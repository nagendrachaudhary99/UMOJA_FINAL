import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface AssessmentBucket {
  id: string;
  name: string;
  description: string;
  purpose: string;
  age_band: 'K-2' | '3-5' | 'MS' | 'HS+';
  created_at: string;
}

export interface AssessmentQuestion {
  id: string;
  bucket_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'likert_scale' | 'open_ended' | 'image_selection';
  response_options?: any;
  section?: string;
  order_index: number;
  is_required: boolean;
  created_at: string;
}

export interface AssessmentSession {
  id: string;
  user_id: string;
  bucket_id: string;
  started_at: string;
  completed_at?: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  total_questions: number;
  answered_questions: number;
  created_at: string;
}

export interface AssessmentResponse {
  id: string;
  session_id: string;
  question_id: string;
  user_id: string;
  response_value?: string;
  response_numeric?: number;
  response_json?: any;
  created_at: string;
}

export interface AssessmentResult {
  id: string;
  user_id: string;
  bucket_id: string;
  session_id: string;
  communication_style?: string;
  social_preference?: string;
  conflict_resolution_style?: string;
  emotional_regulation_score?: number;
  collaboration_readiness_score?: number;
  primary_interests?: any;
  learning_style_preferences?: any;
  character_strengths?: any;
  motivation_score?: number;
  curiosity_score?: number;
  growth_mindset_score?: number;
  digital_literacy_score?: number;
  problem_solving_approach?: string;
  task_completion_score?: number;
  collaboration_skills_score?: number;
  cultural_identity_reflection?: string;
  family_insights?: any;
  teacher_insights?: any;
  unique_strengths?: string;
  support_needs?: string;
  goals_aspirations?: string;
  total_score?: number;
  completion_percentage?: number;
  assessment_date: string;
  created_at: string;
}

export class AssessmentService {
  // Get internal user ID from Clerk ID
  static async getInternalUserId(clerkId: string): Promise<string> {
    // First try to get existing user
    let { data: userData, error } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkId)
      .single()
    
    // If user doesn't exist, create them
    if (error && error.code === 'PGRST116') {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          clerk_id: clerkId,
          email: '', // We'll get this from Clerk user object if needed
          role: 'child' // Default role, can be updated later
        })
        .select('id')
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

    if (!userData) {
      throw new Error('Failed to get or create user record')
    }

    return userData.id;
  }

  // Get assessment buckets for a specific age band
  static async getAssessmentBuckets(ageBand: string): Promise<AssessmentBucket[]> {
    const { data, error } = await supabase
      .from('assessment_buckets')
      .select('*')
      .eq('age_band', ageBand);

    if (error) {
      console.error('Error fetching assessment buckets:', error);
      throw error;
    }

    // Define the desired order
    const bucketOrder = [
      'Relational & Interactional Fit',
      'Interests, Motivation & Growth Potential', 
      'Foundational Skills & Readiness',
      'Contextual & Holistic Insights'
    ];

    // Sort buckets according to the desired order
    const sortedData = (data || []).sort((a, b) => {
      const indexA = bucketOrder.indexOf(a.name);
      const indexB = bucketOrder.indexOf(b.name);
      
      // If both buckets are in the order array, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // If only one is in the order array, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // If neither is in the order array, maintain alphabetical order
      return a.name.localeCompare(b.name);
    });

    return sortedData;
  }

  // Get questions for a specific bucket
  static async getAssessmentQuestions(bucketId: string): Promise<AssessmentQuestion[]> {
    const { data, error } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('bucket_id', bucketId)
      .order('order_index');

    if (error) {
      console.error('Error fetching assessment questions:', error);
      throw error;
    }

    return data || [];
  }

  // Create a new assessment session
  static async createAssessmentSession(
    clerkId: string,
    bucketId: string,
    totalQuestions: number
  ): Promise<AssessmentSession> {
    const internalUserId = await this.getInternalUserId(clerkId);
    
    const { data, error } = await supabase
      .from('assessment_sessions')
      .insert({
        user_id: internalUserId,
        bucket_id: bucketId,
        total_questions: totalQuestions,
        answered_questions: 0,
        status: 'in_progress'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating assessment session:', error);
      throw error;
    }

    return data;
  }

  // Save an assessment response
  static async saveAssessmentResponse(
    sessionId: string,
    questionId: string,
    clerkId: string,
    response: {
      response_value?: string;
      response_numeric?: number;
      response_json?: any;
    }
  ): Promise<AssessmentResponse> {
    const internalUserId = await this.getInternalUserId(clerkId);
    
    const { data, error } = await supabase
      .from('assessment_responses')
      .insert({
        session_id: sessionId,
        question_id: questionId,
        user_id: internalUserId,
        ...response
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving assessment response:', error);
      throw error;
    }

    return data;
  }

  // Update assessment session progress
  static async updateSessionProgress(sessionId: string, answeredQuestions: number): Promise<void> {
    const { error } = await supabase
      .from('assessment_sessions')
      .update({
        answered_questions: answeredQuestions
      })
      .eq('id', sessionId);

    if (error) {
      console.error('Error updating session progress:', error);
      throw error;
    }
  }

  // Complete an assessment session
  static async completeAssessmentSession(sessionId: string): Promise<void> {
    const { error } = await supabase
      .from('assessment_sessions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) {
      console.error('Error completing assessment session:', error);
      throw error;
    }
  }

  // Get user's assessment sessions
  static async getUserAssessmentSessions(clerkId: string): Promise<AssessmentSession[]> {
    const internalUserId = await this.getInternalUserId(clerkId);
    
    const { data, error } = await supabase
      .from('assessment_sessions')
      .select(`
        *,
        assessment_buckets(name, description)
      `)
      .eq('user_id', internalUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user assessment sessions:', error);
      throw error;
    }

    return data || [];
  }

  // Get assessment responses for a session
  static async getSessionResponses(sessionId: string): Promise<AssessmentResponse[]> {
    const { data, error } = await supabase
      .from('assessment_responses')
      .select(`
        *,
        assessment_questions(question_text, question_type, section)
      `)
      .eq('session_id', sessionId)
      .order('created_at');

    if (error) {
      console.error('Error fetching session responses:', error);
      throw error;
    }

    return data || [];
  }

  // Save assessment results summary
  static async saveAssessmentResults(results: Partial<AssessmentResult>): Promise<AssessmentResult> {
    const { data, error } = await supabase
      .from('assessment_results')
      .insert(results)
      .select()
      .single();

    if (error) {
      console.error('Error saving assessment results:', error);
      throw error;
    }

    return data;
  }

  // Get user's assessment results
  static async getUserAssessmentResults(clerkId: string): Promise<AssessmentResult[]> {
    const internalUserId = await this.getInternalUserId(clerkId);
    
    const { data, error } = await supabase
      .from('assessment_results')
      .select(`
        *,
        assessment_buckets(name, description)
      `)
      .eq('user_id', internalUserId)
      .order('assessment_date', { ascending: false });

    if (error) {
      console.error('Error fetching user assessment results:', error);
      throw error;
    }

    return data || [];
  }

  // Check if user has completed assessments for all buckets
  static async checkAssessmentCompletion(clerkId: string, ageBand: string): Promise<{
    completed: boolean;
    completedBuckets: string[];
    totalBuckets: number;
  }> {
    const buckets = await this.getAssessmentBuckets(ageBand);
    const sessions = await this.getUserAssessmentSessions(clerkId);
    
    const completedSessions = sessions.filter(session => 
      session.status === 'completed' && 
      buckets.some(bucket => bucket.id === session.bucket_id)
    );

    const completedBucketIds = completedSessions.map(session => session.bucket_id);
    const completed = completedBucketIds.length === buckets.length;

    return {
      completed,
      completedBuckets: completedBucketIds,
      totalBuckets: buckets.length
    };
  }

  // Get assessment progress for a user
  static async getAssessmentProgress(clerkId: string, ageBand: string): Promise<{
    buckets: AssessmentBucket[];
    sessions: AssessmentSession[];
    progress: { [bucketId: string]: { completed: boolean; progress: number } };
  }> {
    const buckets = await this.getAssessmentBuckets(ageBand);
    const sessions = await this.getUserAssessmentSessions(clerkId);
    
    const progress: { [bucketId: string]: { completed: boolean; progress: number } } = {};
    
    buckets.forEach(bucket => {
      const session = sessions.find(s => s.bucket_id === bucket.id);
      if (session) {
        progress[bucket.id] = {
          completed: session.status === 'completed',
          progress: session.total_questions > 0 ? (session.answered_questions / session.total_questions) * 100 : 0
        };
      } else {
        progress[bucket.id] = {
          completed: false,
          progress: 0
        };
      }
    });

    return {
      buckets,
      sessions,
      progress
    };
  }
} 