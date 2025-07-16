-- Enable UUID extension for better ID management
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS child_guardian_relationships CASCADE;
DROP TABLE IF EXISTS emergency_contacts CASCADE;
DROP TABLE IF EXISTS child_profiles CASCADE;
DROP TABLE IF EXISTS guardian_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table (extends Clerk user data)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('child', 'guardian', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Child profiles table
CREATE TABLE child_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'non-binary', 'prefer-not-to-say')),
    grade TEXT,
    school_name TEXT,
    physician_name TEXT,
    physician_phone TEXT,
    health_notes TEXT,
    consent_given BOOLEAN DEFAULT FALSE,
    profile_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency contacts table
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_profile_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    can_pick_up BOOLEAN DEFAULT FALSE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guardian profiles table
CREATE TABLE guardian_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number TEXT,
    address TEXT,
    relationship_to_child TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Child-Guardian relationships table
CREATE TABLE child_guardian_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_profile_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
    guardian_profile_id UUID REFERENCES guardian_profiles(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL DEFAULT 'parent',
    is_primary_guardian BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(child_profile_id, guardian_profile_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_child_profiles_user_id ON child_profiles(user_id);
CREATE INDEX idx_emergency_contacts_child_profile_id ON emergency_contacts(child_profile_id);
CREATE INDEX idx_guardian_profiles_user_id ON guardian_profiles(user_id);
CREATE INDEX idx_child_guardian_relationships_child_id ON child_guardian_relationships(child_profile_id);
CREATE INDEX idx_child_guardian_relationships_guardian_id ON child_guardian_relationships(guardian_profile_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to update updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_child_profiles_updated_at BEFORE UPDATE ON child_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emergency_contacts_updated_at BEFORE UPDATE ON emergency_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guardian_profiles_updated_at BEFORE UPDATE ON guardian_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_child_guardian_relationships_updated_at BEFORE UPDATE ON child_guardian_relationships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Note: RLS is NOT enabled for this setup to allow the app to work without authentication issues
-- You can enable RLS later when you have proper authentication set up 