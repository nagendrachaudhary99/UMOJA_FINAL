-- Enable UUID extension for better ID management
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing assessment tables if they exist (for clean setup)
DROP TABLE IF EXISTS assessment_responses CASCADE;
DROP TABLE IF EXISTS assessment_questions CASCADE;
DROP TABLE IF EXISTS assessment_sessions CASCADE;
DROP TABLE IF EXISTS assessment_buckets CASCADE;

-- Assessment buckets table (Bucket 1-4)
CREATE TABLE assessment_buckets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    purpose TEXT,
    age_band TEXT NOT NULL CHECK (age_band IN ('K-2', '3-5', 'MS', 'HS+')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment questions table
CREATE TABLE assessment_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bucket_id UUID REFERENCES assessment_buckets(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'likert_scale', 'open_ended', 'image_selection')),
    response_options JSONB, -- For multiple choice options
    section TEXT, -- e.g., 'Section A: My Interests', 'Section B: How I Like to Learn'
    order_index INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment sessions table (tracks when a user takes an assessment)
CREATE TABLE assessment_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bucket_id UUID REFERENCES assessment_buckets(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    total_questions INTEGER,
    answered_questions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment responses table (stores individual question responses)
CREATE TABLE assessment_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    question_id UUID REFERENCES assessment_questions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    response_value TEXT, -- For text responses
    response_numeric INTEGER, -- For Likert scale responses
    response_json JSONB, -- For complex responses (multiple selections, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment results summary table (aggregated results for easy querying)
CREATE TABLE assessment_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bucket_id UUID REFERENCES assessment_buckets(id) ON DELETE CASCADE,
    session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    
    -- Bucket 1: Relational & Interactional Fit
    communication_style TEXT, -- e.g., 'extroverted', 'introverted', 'balanced'
    social_preference TEXT, -- e.g., 'group', 'individual', 'mixed'
    conflict_resolution_style TEXT, -- e.g., 'collaborative', 'compromising', 'avoiding'
    emotional_regulation_score INTEGER, -- 1-5 scale
    collaboration_readiness_score INTEGER, -- 1-5 scale
    
    -- Bucket 2: Interests, Motivation & Growth Potential
    primary_interests JSONB, -- Array of interest categories
    learning_style_preferences JSONB, -- VARK scores
    character_strengths JSONB, -- Top VIA strengths
    motivation_score INTEGER, -- 1-5 scale
    curiosity_score INTEGER, -- 1-5 scale
    growth_mindset_score INTEGER, -- 1-5 scale
    
    -- Bucket 3: Foundational Skills & Readiness
    digital_literacy_score INTEGER, -- 1-5 scale
    problem_solving_approach TEXT, -- e.g., 'systematic', 'creative', 'collaborative'
    task_completion_score INTEGER, -- 1-5 scale
    collaboration_skills_score INTEGER, -- 1-5 scale
    
    -- Bucket 4: Contextual & Holistic Insights
    cultural_identity_reflection TEXT, -- Open-ended response
    family_insights JSONB, -- Parent/guardian observations
    teacher_insights JSONB, -- Teacher observations
    unique_strengths TEXT, -- Open-ended response
    support_needs TEXT, -- Open-ended response
    goals_aspirations TEXT, -- Open-ended response
    
    -- Overall assessment metadata
    total_score INTEGER,
    completion_percentage DECIMAL(5,2),
    assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_assessment_questions_bucket_id ON assessment_questions(bucket_id);
CREATE INDEX idx_assessment_questions_order ON assessment_questions(bucket_id, order_index);
CREATE INDEX idx_assessment_sessions_user_id ON assessment_sessions(user_id);
CREATE INDEX idx_assessment_sessions_bucket_id ON assessment_sessions(bucket_id);
CREATE INDEX idx_assessment_responses_session_id ON assessment_responses(session_id);
CREATE INDEX idx_assessment_responses_user_id ON assessment_responses(user_id);
CREATE INDEX idx_assessment_results_user_id ON assessment_results(user_id);
CREATE INDEX idx_assessment_results_bucket_id ON assessment_results(bucket_id);

-- Insert default assessment buckets
INSERT INTO assessment_buckets (name, description, purpose, age_band) VALUES
('Relational & Interactional Fit', 'Understanding how individuals interact with others and manage emotions', 'To ensure positive group dynamics, effective communication, and emotional safety within pods', 'K-2'),
('Interests, Motivation & Growth Potential', 'Aligning participants with pods that genuinely excite them and support growth', 'To foster deep engagement and support personal and aspirational growth', 'K-2'),
('Foundational Skills & Readiness', 'Understanding current skill levels and readiness for specific types of pods', 'To ensure participants are placed in environments where they can succeed and contribute', 'K-2'),
('Contextual & Holistic Insights', 'Gathering vital external perspectives and deeper contextual information', 'To enrich the matching process with external perspectives and cultural context', 'K-2'),

('Relational & Interactional Fit', 'Understanding how individuals interact with others and manage emotions', 'To ensure positive group dynamics, effective communication, and emotional safety within pods', '3-5'),
('Interests, Motivation & Growth Potential', 'Aligning participants with pods that genuinely excite them and support growth', 'To foster deep engagement and support personal and aspirational growth', '3-5'),
('Foundational Skills & Readiness', 'Understanding current skill levels and readiness for specific types of pods', 'To ensure participants are placed in environments where they can succeed and contribute', '3-5'),
('Contextual & Holistic Insights', 'Gathering vital external perspectives and deeper contextual information', 'To enrich the matching process with external perspectives and cultural context', '3-5'),

('Relational & Interactional Fit', 'Understanding how individuals interact with others and manage emotions', 'To ensure positive group dynamics, effective communication, and emotional safety within pods', 'MS'),
('Interests, Motivation & Growth Potential', 'Aligning participants with pods that genuinely excite them and support growth', 'To foster deep engagement and support personal and aspirational growth', 'MS'),
('Foundational Skills & Readiness', 'Understanding current skill levels and readiness for specific types of pods', 'To ensure participants are placed in environments where they can succeed and contribute', 'MS'),
('Contextual & Holistic Insights', 'Gathering vital external perspectives and deeper contextual information', 'To enrich the matching process with external perspectives and cultural context', 'MS'),

('Relational & Interactional Fit', 'Understanding how individuals interact with others and manage emotions', 'To ensure positive group dynamics, effective communication, and emotional safety within pods', 'HS+'),
('Interests, Motivation & Growth Potential', 'Aligning participants with pods that genuinely excite them and support growth', 'To foster deep engagement and support personal and aspirational growth', 'HS+'),
('Foundational Skills & Readiness', 'Understanding current skill levels and readiness for specific types of pods', 'To ensure participants are placed in environments where they can succeed and contribute', 'HS+'),
('Contextual & Holistic Insights', 'Gathering vital external perspectives and deeper contextual information', 'To enrich the matching process with external perspectives and cultural context', 'HS+');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Note: RLS is NOT enabled for this setup to allow the app to work without authentication issues
-- You can enable RLS later when you have proper authentication set up 