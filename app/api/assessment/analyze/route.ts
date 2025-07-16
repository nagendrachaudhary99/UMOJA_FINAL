import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

export async function POST() {
  // --- Environment Variable Check ---
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!supabaseUrl || !supabaseServiceKey || !openaiApiKey) {
    console.error('Server Error: Missing one or more required environment variables (Supabase URL/Key, OpenAI Key).');
    return new NextResponse(
      JSON.stringify({ error: 'Server configuration error. Please check server logs.' }),
      { status: 500 }
    );
  }

  try {
    // --- Initialize Clients ---
    const supabase: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    const openai = new OpenAI({ apiKey: openaiApiKey });
    
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Helper function to get internal user ID
    const getInternalUserId = async (id: string): Promise<string> => {
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('clerk_id', id)
            .single();
        if (error || !data) {
            throw new Error('Could not find internal user ID for Clerk ID.');
        }
        return data.id;
    };

    const internalUserId = await getInternalUserId(clerkId);

    // 1. Check if results already exist for the user
    const { data: existingResult } = await supabase
        .from('user_assessment_results')
        .select('*')
        .eq('user_id', internalUserId)
        .single();

    if (existingResult) {
        // Return stored results to save on API calls
        return new NextResponse(JSON.stringify({ analysis: existingResult }), { status: 200 });
    }

    // 2. If no results, fetch responses to generate new ones
    const { data: responses, error: responsesError } = await supabase
      .from('assessment_responses')
      .select(`
        response_value,
        response_json,
        question:assessment_questions (
          question_text,
          question_type,
          bucket:assessment_buckets (
            name
          )
        )
      `)
      .eq('user_id', internalUserId);

    if (responsesError) {
      console.error('Error fetching responses:', responsesError);
      return new NextResponse(JSON.stringify({ error: 'Failed to fetch assessment responses.' }), { status: 500 });
    }

    if (!responses || responses.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'No assessment responses found for this user.' }), { status: 404 });
    }
    
    // 2. Format responses for the AI prompt
    const formattedResponses = responses.map((r: any) => {
      const questionText = r.question.question_text;
      const bucketName = r.question.bucket.name;
      let answer = r.response_value;
      if (r.response_json) {
        answer = JSON.stringify(r.response_json);
      }
      return `In bucket "${bucketName}", to question "${questionText}", the user answered: "${answer}"`;
    }).join('\n');

    const systemPrompt = `You are an expert educational psychologist. Your task is to analyze a middle school student's self-reported assessment answers to provide a holistic personality and learning profile. The output must be a valid JSON object with the specified structure. Do not include any text outside of the JSON object.`;

    const userPrompt = `Here are the student's assessment answers:\n\n${formattedResponses}\n\nPlease analyze these responses and provide a detailed profile in the following JSON format:\n\n{\n  "personality_summary": "A detailed summary of the student's personality, social, and collaborative style.",\n  "learning_style": {\n    "primary": "The primary VARK learning style (Visual, Auditory, Reading/Writing, or Kinesthetic).",\n    "secondary": "The secondary VARK learning style.",\n    "description": "A description of how they learn best."\n  },\n  "trait_scores": [\n    { "trait": "Leadership", "score": 0-100, "fullMark": 100 },\n    { "trait": "Collaboration", "score": 0-100, "fullMark": 100 },\n    { "trait": "Empathy", "score": 0-100, "fullMark": 100 },\n    { "trait": "Problem Solving", "score": 0-100, "fullMark": 100 },\n    { "trait": "Digital Literacy", "score": 0-100, "fullMark": 100 },\n    { "trait": "Growth Mindset", "score": 0-100, "fullMark": 100 }\n  ],\n  "strengths": [\n    "A list of 3-4 key strengths as strings."\n  ],\n  "areas_for_growth": [\n    "A list of 2-3 areas for growth as strings."\n  ],\n  "pod_recommendation": "A specific recommendation for the type of pod this student would thrive in."\n}`;

    // 3. Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: "json_object" },
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');

    // 5. Store the new analysis in the database
    const { personality_summary, learning_style, trait_scores, strengths, areas_for_growth, pod_recommendation } = analysis;
    
    await supabase.from('user_assessment_results').upsert({
        user_id: internalUserId,
        personality_summary,
        learning_style,
        trait_scores,
        strengths,
        areas_for_growth,
        pod_recommendation,
        updated_at: new Date().toISOString(),
    });

    return new NextResponse(JSON.stringify({ analysis }), { status: 200 });

  } catch (error) {
    console.error('Error in analysis route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(JSON.stringify({ error: 'An internal error occurred.', details: errorMessage }), { status: 500 });
  }
} 