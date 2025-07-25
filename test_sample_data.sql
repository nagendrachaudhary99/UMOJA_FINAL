-- Sample test data for child verification testing
-- This file adds sample children that guardians can verify and link to

-- First, let's insert some sample users (these would normally be created through Clerk signup)
INSERT INTO users (id, clerk_id, email, role, created_at) VALUES 
(gen_random_uuid(), 'child_test_123', 'nagendra.child@example.com', 'child', NOW()),
(gen_random_uuid(), 'child_test_456', 'emily.child@example.com', 'child', NOW()),
(gen_random_uuid(), 'child_test_789', 'lucas.child@example.com', 'child', NOW())
ON CONFLICT (clerk_id) DO NOTHING;

-- Now insert sample child profiles using the user IDs
-- Sample Child 1: Nagendra Chaudhary (matching the one shown in the UI)
INSERT INTO child_profiles (
    id, 
    user_id, 
    first_name, 
    last_name, 
    date_of_birth, 
    gender, 
    grade, 
    school_name, 
    profile_completed,
    created_at
) 
SELECT 
    gen_random_uuid(),
    u.id,
    'Nagendra',
    'Chaudhary',
    '2023-10-23',
    'male',
    '6th',
    'Lincoln Elementary',
    true,
    NOW()
FROM users u WHERE u.clerk_id = 'child_test_123'
ON CONFLICT (user_id) DO NOTHING;

-- Sample Child 2: Emily Johnson
INSERT INTO child_profiles (
    id, 
    user_id, 
    first_name, 
    last_name, 
    date_of_birth, 
    gender, 
    grade, 
    school_name, 
    profile_completed,
    created_at
) 
SELECT 
    gen_random_uuid(),
    u.id,
    'Emily',
    'Johnson',
    '2012-03-15',
    'female',
    '7th',
    'Roosevelt Middle School',
    true,
    NOW()
FROM users u WHERE u.clerk_id = 'child_test_456'
ON CONFLICT (user_id) DO NOTHING;

-- Sample Child 3: Lucas Martinez
INSERT INTO child_profiles (
    id, 
    user_id, 
    first_name, 
    last_name, 
    date_of_birth, 
    gender, 
    grade, 
    school_name, 
    profile_completed,
    created_at
) 
SELECT 
    gen_random_uuid(),
    u.id,
    'Lucas',
    'Martinez',
    '2011-08-22',
    'male',
    '8th',
    'Washington Middle School',
    true,
    NOW()
FROM users u WHERE u.clerk_id = 'child_test_789'
ON CONFLICT (user_id) DO NOTHING; 