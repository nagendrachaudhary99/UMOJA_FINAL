import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ 
        success: false, 
        message: 'You must be logged in to link a child.',
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const { 
      firstName, 
      lastName, 
      dateOfBirth, 
      schoolName, 
      grade,
      relationshipType = 'parent' 
    } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth) {
      return NextResponse.json({ 
        success: false,
        message: 'First name, last name, and date of birth are required',
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Get guardian's internal user ID
    const { data: guardianUser, error: guardianError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkId)
      .single();

    if (guardianError || !guardianUser) {
      return NextResponse.json({ 
        success: false, 
        message: 'Guardian account not found. Please ensure you have signed up as a guardian.',
        error: 'Guardian not found' 
      }, { status: 404 });
    }

    // Get or create guardian profile
    let { data: guardianProfile, error: guardianProfileError } = await supabase
      .from('guardian_profiles')
      .select('id')
      .eq('user_id', guardianUser.id)
      .single();

    // If guardian profile doesn't exist, create a basic one
    if (guardianProfileError && guardianProfileError.code === 'PGRST116') {
      const { data: newGuardianProfile, error: createProfileError } = await supabase
        .from('guardian_profiles')
        .insert({
          user_id: guardianUser.id,
          first_name: 'Guardian',
          last_name: 'User',
          relationship_to_child: relationshipType
        })
        .select('id')
        .single();

      if (createProfileError) {
        console.error('Error creating guardian profile:', createProfileError);
        return NextResponse.json({ 
          success: false, 
          message: 'Failed to create guardian profile. Please try again.',
          error: 'Guardian profile creation failed' 
        }, { status: 500 });
      }

      guardianProfile = newGuardianProfile;
    } else if (guardianProfileError) {
      console.error('Error fetching guardian profile:', guardianProfileError);
      return NextResponse.json({ 
        success: false, 
        message: 'Error accessing guardian profile. Please try again.',
        error: 'Guardian profile access error' 
      }, { status: 500 });
    }

    // Ensure we have a valid guardian profile
    if (!guardianProfile?.id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unable to access or create guardian profile. Please try again.',
        error: 'Guardian profile unavailable' 
      }, { status: 500 });
    }

    // Search for child with matching details
    let query = supabase
      .from('child_profiles')
      .select(`
        id,
        first_name,
        last_name,
        date_of_birth,
        school_name,
        grade,
        user:users (
          id,
          clerk_id
        )
      `)
      .eq('first_name', firstName.trim())
      .eq('last_name', lastName.trim())
      .eq('date_of_birth', dateOfBirth);

    // Add optional filters if provided
    if (schoolName) {
      query = query.eq('school_name', schoolName.trim());
    }
    if (grade) {
      query = query.eq('grade', grade.trim());
    }

    const { data: matchingChildren, error: searchError } = await query;

    if (searchError) {
      console.error('Error searching for children:', searchError);
      return NextResponse.json({ 
        success: false, 
        message: 'An error occurred while searching for children. Please try again.',
        error: 'Error searching for children' 
      }, { status: 500 });
    }

    if (!matchingChildren || matchingChildren.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No child found with the provided details. Please check the information and try again.' 
      });
    }

    if (matchingChildren.length > 1) {
      return NextResponse.json({ 
        success: false, 
        message: 'Multiple children found with these details. Please provide more specific information like school name or grade.' 
      });
    }

    const child = matchingChildren[0];

    // Check if relationship already exists
    const { data: existingRelationship, error: relationshipError } = await supabase
      .from('child_guardian_relationships')
      .select('id')
      .eq('child_profile_id', child.id)
      .eq('guardian_profile_id', guardianProfile.id)
      .single();

    if (existingRelationship) {
      return NextResponse.json({ 
        success: false, 
        message: 'You are already linked to this child.' 
      });
    }

    // Check if child already has a primary guardian
    const { data: primaryGuardian, error: primaryError } = await supabase
      .from('child_guardian_relationships')
      .select('id')
      .eq('child_profile_id', child.id)
      .eq('is_primary_guardian', true)
      .single();

    const isPrimaryGuardian = !primaryGuardian;

    // Create the relationship
    const { data: newRelationship, error: createError } = await supabase
      .from('child_guardian_relationships')
      .insert({
        child_profile_id: child.id,
        guardian_profile_id: guardianProfile.id,
        relationship_type: relationshipType,
        is_primary_guardian: isPrimaryGuardian
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating guardian-child relationship:', createError);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to link child to guardian. Please try again.',
        error: createError.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully linked to ${child.first_name} ${child.last_name}`,
      child: {
        id: child.id,
        first_name: child.first_name,
        last_name: child.last_name,
        date_of_birth: child.date_of_birth,
        school_name: child.school_name,
        grade: child.grade
      },
      relationship: {
        id: newRelationship.id,
        relationship_type: relationshipType,
        is_primary_guardian: isPrimaryGuardian
      }
    });

  } catch (error) {
    console.error('Verify child error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'An unexpected error occurred. Please try again.',
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// GET endpoint to search for children without linking
export async function GET(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ 
        success: false, 
        message: 'You must be logged in to search for children.',
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const url = new URL(request.url);
    const firstName = url.searchParams.get('firstName');
    const lastName = url.searchParams.get('lastName');
    const dateOfBirth = url.searchParams.get('dateOfBirth');

    if (!firstName || !lastName || !dateOfBirth) {
      return NextResponse.json({ 
        success: false,
        message: 'First name, last name, and date of birth are required',
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Search for child with matching details
    const { data: matchingChildren, error: searchError } = await supabase
      .from('child_profiles')
      .select(`
        id,
        first_name,
        last_name,
        date_of_birth,
        school_name,
        grade,
        profile_completed
      `)
      .eq('first_name', firstName.trim())
      .eq('last_name', lastName.trim())
      .eq('date_of_birth', dateOfBirth);

    if (searchError) {
      console.error('Error searching for children:', searchError);
      return NextResponse.json({ 
        success: false,
        message: 'An error occurred while searching for children. Please try again.',
        error: 'Error searching for children'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      children: matchingChildren || [],
      found: (matchingChildren?.length || 0) > 0
    });

  } catch (error) {
    console.error('Search child error:', error);
    return NextResponse.json({ 
      success: false,
      message: 'An unexpected error occurred while searching. Please try again.',
      error: 'Internal server error'
    }, { status: 500 });
  }
} 