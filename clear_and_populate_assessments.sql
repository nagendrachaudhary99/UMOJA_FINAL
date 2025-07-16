-- Clear existing assessment data
DELETE FROM assessment_responses;
DELETE FROM assessment_sessions;
DELETE FROM assessment_results;
DELETE FROM assessment_questions;

-- Repopulate questions for Middle School (MS) age band

-- BUCKET 1: Relational & Interactional Fit 
-- Focus: Collaboration, communication, empathy, conflict resolution.

INSERT INTO assessment_questions (bucket_id, question_text, question_type, response_options, section, order_index) 
SELECT 
    ab.id,
    'When I am in a group, I prefer to take on a leadership role.',
    'likert_scale',
    NULL,
    'Group Roles & Dynamics',
    1
FROM assessment_buckets ab WHERE ab.name = 'Relational & Interactional Fit' AND ab.age_band = 'MS';

INSERT INTO assessment_questions (bucket_id, question_text, question_type, response_options, section, order_index) 
SELECT 
    ab.id,
    'When a group discussion gets heated, I tend to:',
    'multiple_choice',
    '[
        {"value": "mediate", "label": "Try to help everyone find a middle ground"},
        {"value": "state_my_case", "label": "Argue my point firmly"},
        {"value": "stay_quiet", "label": "Stay quiet to avoid conflict"},
        {"value": "get_frustrated", "label": "Get frustrated and check out"}
    ]'::jsonb,
    'Conflict Resolution',
    2
FROM assessment_buckets ab WHERE ab.name = 'Relational & Interactional Fit' AND ab.age_band = 'MS';

INSERT INTO assessment_questions (bucket_id, question_text, question_type, response_options, section, order_index) 
SELECT 
    ab.id,
    'I find it easy to understand how my friends are feeling, even if they don''t say anything.',
    'likert_scale',
    NULL,
    'Empathy & Social Awareness',
    3
FROM assessment_buckets ab WHERE ab.name = 'Relational & Interactional Fit' AND ab.age_band = 'MS';

INSERT INTO assessment_questions (bucket_id, question_text, question_type, response_options, section, order_index) 
SELECT 
    ab.id,
    'How do you prefer to communicate with your group for a project?',
    'multiple_choice',
    '[
        {"value": "in_person", "label": "Talking in person is best"},
        {"value": "text_chat", "label": "Group chats or text messages"},
        {"value": "video_call", "label": "Scheduled video calls"},
        {"value": "email_docs", "label": "Emails and shared documents"}
    ]'::jsonb,
    'Communication Style',
    4
FROM assessment_buckets ab WHERE ab.name = 'Relational & Interactional Fit' AND ab.age_band = 'MS';

INSERT INTO assessment_questions (bucket_id, question_text, question_type, response_options, section, order_index) 
SELECT 
    ab.id,
    'I feel more energized working:',
    'multiple_choice',
    '[
        {"value": "in_a_group", "label": "In a busy group with lots of interaction"},
        {"value": "with_a_partner", "label": "With one or two close partners"},
        {"value": "independently", "label": "Independently, where I can focus"}
    ]'::jsonb,
    'Social Preference',
    5
FROM assessment_buckets ab WHERE ab.name = 'Relational & Interactional Fit' AND ab.age_band = 'MS';


-- BUCKET 2: Interests, Motivation & Growth Potential
-- Focus: Passions, learning styles (VARK), mindset, intrinsic motivation.

INSERT INTO assessment_questions (bucket_id, question_text, question_type, response_options, section, order_index) 
SELECT 
    ab.id,
    'I am most interested in projects that involve:',
    'multiple_choice',
    '[
        {"value": "tech_coding", "label": "Technology, coding, or video games"},
        {"value": "art_design", "label": "Art, design, or music"},
        {"value": "science_nature", "label": "Science, nature, or experiments"},
        {"value": "writing_history", "label": "Writing, history, or storytelling"},
        {"value": "building_engineering", "label": "Building, engineering, or fixing things"}
    ]'::jsonb,
    'Core Interests',
    1
FROM assessment_buckets ab WHERE ab.name = 'Interests, Motivation & Growth Potential' AND ab.age_band = 'MS';

INSERT INTO assessment_questions (bucket_id, question_text, question_type, response_options, section, order_index) 
SELECT 
    ab.id,
    'When I have to learn something new, I prefer to:',
    'multiple_choice',
    '[
        {"value": "visual", "label": "Watch a video or look at diagrams (Visual)"},
        {"value": "auditory", "label": "Listen to a podcast or lecture (Auditory)"},
        {"value": "reading", "label": "Read a book or an article (Reading/Writing)"},
        {"value": "kinesthetic", "label": "Jump in and try it myself (Kinesthetic)"}
    ]'::jsonb,
    'Learning Style (VARK)',
    2
FROM assessment_buckets ab WHERE ab.name = 'Interests, Motivation & Growth Potential' AND ab.age_band = 'MS';

INSERT INTO assessment_questions (bucket_id, question_text, question_type, response_options, section, order_index) 
SELECT 
    ab.id,
    'When I face a really difficult challenge, my first thought is:',
    'multiple_choice',
    '[
        {"value": "excited", "label": "I''m excited! This is a chance to learn something new."},
        {"value": "nervous_but_try", "label": "I''m nervous, but I''ll give it a try."},
        {"value": "avoid", "label": "I might fail, so I''d rather avoid it."},
        {"value": "what_if_i_cant", "label": "What if I can''t do it?"}
    ]'::jsonb,
    'Growth Mindset',
    3
FROM assessment_buckets ab WHERE ab.name = 'Interests, Motivation & Growth Potential' AND ab.age_band = 'MS';

INSERT INTO assessment_questions (bucket_id, question_text, question_type, response_options, section, order_index) 
SELECT 
    ab.id,
    'I am more motivated to do my best work when:',
    'multiple_choice',
    '[
        {"value": "good_grade", "label": "I know I will get a good grade or reward"},
        {"value": "genuinely_interested", "label": "I am genuinely interested in the topic"},
        {"value": "working_with_friends", "label": "I am working with my friends"},
        {"value": "impress_others", "label": "I want to impress my parents or teachers"}
    ]'::jsonb,
    'Sources of Motivation',
    4
FROM assessment_buckets ab WHERE ab.name = 'Interests, Motivation & Growth Potential' AND ab.age_band = 'MS';

INSERT INTO assessment_questions (bucket_id, question_text, question_type, response_options, section, order_index) 
SELECT 
    ab.id,
    'If I could learn about anything I wanted, I would choose to learn about...',
    'open_ended',
    NULL,
    'Curiosity & Passion',
    5
FROM assessment_buckets ab WHERE ab.name = 'Interests, Motivation & Growth Potential' AND ab.age_band = 'MS';


-- BUCKET 3: Foundational Skills & Readiness
-- Focus: Self-management, problem-solving, digital literacy.

INSERT INTO assessment_questions (bucket_id, question_text, question_type, response_options, section, order_index) 
SELECT 
    ab.id,
    'When I have a big project, I am good at breaking it down into smaller steps.',
    'likert_scale',
    NULL,
    'Organization & Planning',
    1
FROM assessment_buckets ab WHERE ab.name = 'Foundational Skills & Readiness' AND ab.age_band = 'MS';

INSERT INTO assessment_questions (bucket_id, question_text, question_type, response_options, section, order_index) 
SELECT 
    ab.id,
    'If I get stuck on a problem, my first step is usually to:',
    'multiple_choice',
    '[
        {"value": "try_again", "label": "Keep trying the same way until it works"},
        {"value": "research", "label": "Look up information online or in a book"},
        {"value": "ask_friend", "label": "Ask a friend for their opinion"},
        {"value": "ask_adult", "label": "Ask a teacher or parent for help"}
    ]'::jsonb,
    'Problem-Solving Approach',
    2
FROM assessment_buckets ab WHERE ab.name = 'Foundational Skills & Readiness' AND ab.age_band = 'MS';

INSERT INTO assessment_questions (bucket_id, question_text, question_type, response_options, section, order_index) 
SELECT 
    ab.id,
    'I feel comfortable using tools like Google Docs, Slides, or video editors for school projects.',
    'likert_scale',
    NULL,
    'Digital Literacy',
    3
FROM assessment_buckets ab WHERE ab.name = 'Foundational Skills & Readiness' AND ab.age_band = 'MS';

INSERT INTO assessment_questions (bucket_id, question_text, question_type, response_options, section, order_index) 
SELECT 
    ab.id,
    'I can stay focused on a task without getting distracted by my phone or other websites.',
    'likert_scale',
    NULL,
    'Self-Management',
    4
FROM assessment_buckets ab WHERE ab.name = 'Foundational Skills & Readiness' AND ab.age_band = 'MS';


-- BUCKET 4: Contextual & Holistic Insights
-- Focus: Identity, values, personal goals.

INSERT INTO assessment_questions (bucket_id, question_text, question_type, response_options, section, order_index) 
SELECT 
    ab.id,
    'Being in a pod with people from different backgrounds and cultures sounds:',
    'multiple_choice',
    '[
        {"value": "exciting", "label": "Exciting and interesting"},
        {"value": "a_little_nervous", "label": "A little nerve-wracking, but I''m open to it"},
        {"value": "uncomfortable", "label": "Uncomfortable"},
        {"value": "no_preference", "label": "I don''t have a strong preference"}
    ]'::jsonb,
    'Cultural Openness',
    1
FROM assessment_buckets ab WHERE ab.name = 'Contextual & Holistic Insights' AND ab.age_band = 'MS';

INSERT INTO assessment_questions (bucket_id, question_text, question_type, response_options, section, order_index) 
SELECT 
    ab.id,
    'What is a unique skill or quality you have that you think would be valuable to a team?',
    'open_ended',
    NULL,
    'Self-Perception & Strengths',
    2
FROM assessment_buckets ab WHERE ab.name = 'Contextual & Holistic Insights' AND ab.age_band = 'MS';

INSERT INTO assessment_questions (bucket_id, question_text, question_type, response_options, section, order_index) 
SELECT 
    ab.id,
    'The most important thing I want to get out of my Umoja pod experience is:',
    'open_ended',
    NULL,
    'Personal Goals & Aspirations',
    3
FROM assessment_buckets ab WHERE ab.name = 'Contextual & Holistic Insights' AND ab.age_band = 'MS';

INSERT INTO assessment_questions (bucket_id, question_text, question_type, response_options, section, order_index) 
SELECT 
    ab.id,
    'It is important for me to be in a group where my ideas about fairness and social justice are shared.',
    'likert_scale',
    NULL,
    'Values Alignment',
    4
FROM assessment_buckets ab WHERE ab.name = 'Contextual & Holistic Insights' AND ab.age_band = 'MS'; 