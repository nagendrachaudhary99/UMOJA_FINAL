import { supabase } from './supabase'

export interface ChildProfile {
  id?: string
  user_id?: string
  first_name: string
  last_name: string
  date_of_birth: string
  gender: string
  grade: string
  school_name: string
  physician_name: string
  physician_phone: string
  health_notes: string
  consent_given: boolean
  profile_completed: boolean
}

export interface EmergencyContact {
  id?: string
  child_profile_id?: string
  full_name: string
  relationship: string
  phone_number: string
  can_pick_up: boolean
  is_primary: boolean
}

export interface GuardianProfile {
  id?: string
  user_id?: string
  first_name: string
  last_name: string
  phone_number: string
  address: string
  relationship_to_child: string
}

export interface ChildGuardianRelationship {
  id?: string
  child_profile_id: string
  guardian_profile_id: string
  relationship_type: string
  is_primary_guardian: boolean
}

export class DatabaseService {
  // Get current user from Clerk (client-side) - create if doesn't exist
  static async getCurrentUser(userId: string, email?: string, firstName?: string, lastName?: string) {
    if (!userId) throw new Error('No authenticated user')
    
    // First try to get existing user
    let { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single()
    
    // If user doesn't exist, create them
    if (error && error.code === 'PGRST116') {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          clerk_id: userId,
          email: email || '',
          role: 'child' // Default role, can be updated later
        })
        .select()
        .single()
      
      if (createError) {
        console.error('Error creating user:', createError)
        throw new Error('Failed to create user record')
      }
      
      userData = newUser
    } else if (error) {
      console.error('Error fetching user:', error)
      throw new Error('Failed to fetch user data')
    }
    
    return userData
  }

  // Create or update child profile
  static async saveChildProfile(profile: ChildProfile, userId: string, email?: string, firstName?: string, lastName?: string) {
    const user = await this.getCurrentUser(userId, email, firstName, lastName)
    
    const profileData = {
      ...profile,
      user_id: user.id,
      profile_completed: true
    }

    const { data, error } = await supabase
      .from('child_profiles')
      .upsert(profileData, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) {
      console.error('Error saving child profile:', error)
      throw new Error('Failed to save profile')
    }
    
    return data
  }

  // Get child profile
  static async getChildProfile(userId: string, email?: string, firstName?: string, lastName?: string) {
    const user = await this.getCurrentUser(userId, email, firstName, lastName)
    
    const { data, error } = await supabase
      .from('child_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching child profile:', error)
      throw new Error('Failed to fetch profile')
    }
    
    return data
  }

  // Save emergency contacts
  static async saveEmergencyContacts(contacts: EmergencyContact[], childProfileId: string) {
    // Delete existing contacts for this child
    await supabase
      .from('emergency_contacts')
      .delete()
      .eq('child_profile_id', childProfileId)

    // Insert new contacts
    const contactsWithProfileId = contacts.map(contact => ({
      ...contact,
      child_profile_id: childProfileId
    }))

    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert(contactsWithProfileId)
      .select()

    if (error) {
      console.error('Error saving emergency contacts:', error)
      throw new Error('Failed to save emergency contacts')
    }
    
    return data
  }

  // Get emergency contacts
  static async getEmergencyContacts(childProfileId: string) {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('child_profile_id', childProfileId)
      .order('created_at')

    if (error) {
      console.error('Error fetching emergency contacts:', error)
      throw new Error('Failed to fetch emergency contacts')
    }
    
    return data
  }

  // Create user record (called after Clerk signup)
  static async createUser(clerkId: string, email: string, role: 'child' | 'guardian') {
    const { data, error } = await supabase
      .from('users')
      .insert({
        clerk_id: clerkId,
        email,
        role
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      throw new Error('Failed to create user')
    }
    
    return data
  }

  // Guardian-related methods
  static async saveGuardianProfile(profile: GuardianProfile, userId: string, email?: string, firstName?: string, lastName?: string) {
    const user = await this.getCurrentUser(userId, email, firstName, lastName)
    
    const profileData = {
      ...profile,
      user_id: user.id
    }

    const { data, error } = await supabase
      .from('guardian_profiles')
      .upsert(profileData, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) {
      console.error('Error saving guardian profile:', error)
      throw new Error('Failed to save guardian profile')
    }
    
    return data
  }

  static async getGuardianProfile(userId: string, email?: string, firstName?: string, lastName?: string) {
    const user = await this.getCurrentUser(userId, email, firstName, lastName)
    
    const { data, error } = await supabase
      .from('guardian_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching guardian profile:', error)
      throw new Error('Failed to fetch guardian profile')
    }
    
    return data
  }

  static async getGuardianChildren(userId: string) {
    const user = await this.getCurrentUser(userId)
    
    // Get guardian profile first
    const { data: guardianProfile, error: guardianError } = await supabase
      .from('guardian_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (guardianError || !guardianProfile) {
      return []
    }

    // Get children associated with this guardian
    const { data, error } = await supabase
      .from('child_guardian_relationships')
      .select(`
        id,
        relationship_type,
        is_primary_guardian,
        child_profile:child_profiles (
          id,
          first_name,
          last_name,
          date_of_birth,
          gender,
          grade,
          school_name,
          profile_completed,
          user:users (
            id,
            clerk_id
          )
        )
      `)
      .eq('guardian_profile_id', guardianProfile.id)

    if (error) {
      console.error('Error fetching guardian children:', error)
      throw new Error('Failed to fetch children')
    }
    
    return data || []
  }

  static async addChildToGuardian(guardianUserId: string, childUserId: string, relationshipType: string = 'parent', isPrimary: boolean = false) {
    // Get guardian profile
    const guardianUser = await this.getCurrentUser(guardianUserId)
    const { data: guardianProfile, error: guardianError } = await supabase
      .from('guardian_profiles')
      .select('id')
      .eq('user_id', guardianUser.id)
      .single()

    if (guardianError || !guardianProfile) {
      throw new Error('Guardian profile not found')
    }

    // Get child profile
    const childUser = await this.getCurrentUser(childUserId)
    const { data: childProfile, error: childError } = await supabase
      .from('child_profiles')
      .select('id')
      .eq('user_id', childUser.id)
      .single()

    if (childError || !childProfile) {
      throw new Error('Child profile not found')
    }

    // Create relationship
    const { data, error } = await supabase
      .from('child_guardian_relationships')
      .insert({
        child_profile_id: childProfile.id,
        guardian_profile_id: guardianProfile.id,
        relationship_type: relationshipType,
        is_primary_guardian: isPrimary
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating guardian-child relationship:', error)
      throw new Error('Failed to create guardian-child relationship')
    }
    
    return data
  }
} 