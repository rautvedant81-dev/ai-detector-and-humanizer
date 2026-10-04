-- =============================================================================
-- HumanCheck AI - Database Schema (PostgreSQL)
-- AI Content Detector & Writing Humanizer Platform
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'pro')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    default_tone VARCHAR(50) DEFAULT 'natural' CHECK (default_tone IN ('natural', 'professional', 'academic', 'casual', 'friendly', 'persuasive', 'formal', 'simple', 'conversational')),
    default_strength INT DEFAULT 2 CHECK (default_strength BETWEEN 1 AND 4),
    default_style VARCHAR(50) DEFAULT 'clear',
    language VARCHAR(20) DEFAULT 'en-US',
    theme VARCHAR(20) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    notifications_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_settings UNIQUE (user_id)
);

-- 3. AI Detector Analyses Table
CREATE TABLE IF NOT EXISTS analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) DEFAULT 'Untitled Analysis',
    input_text TEXT NOT NULL,
    ai_probability INT NOT NULL CHECK (ai_probability BETWEEN 0 AND 100),
    human_probability INT NOT NULL CHECK (human_probability BETWEEN 0 AND 100),
    confidence VARCHAR(50) DEFAULT 'medium' CHECK (confidence IN ('low', 'medium', 'high')),
    classification VARCHAR(50) DEFAULT 'mixed' CHECK (classification IN ('likely_human', 'mixed', 'likely_ai')),
    word_count INT NOT NULL DEFAULT 0,
    character_count INT NOT NULL DEFAULT 0,
    sentence_count INT NOT NULL DEFAULT 0,
    paragraph_count INT NOT NULL DEFAULT 0,
    sentence_analysis JSONB DEFAULT '[]'::jsonb,
    insights JSONB DEFAULT '[]'::jsonb,
    suggestions JSONB DEFAULT '[]'::jsonb,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Writing Humanizations Table
CREATE TABLE IF NOT EXISTS humanizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) DEFAULT 'Untitled Rewrite',
    original_text TEXT NOT NULL,
    improved_text TEXT NOT NULL,
    tone VARCHAR(50) DEFAULT 'natural',
    strength INT DEFAULT 2 CHECK (strength BETWEEN 1 AND 4),
    style VARCHAR(50) DEFAULT 'clear',
    preserve_options JSONB DEFAULT '{"meaning": true, "facts": true, "citations": true, "technical": true, "urls": true, "numbers": true}'::jsonb,
    word_count_before INT NOT NULL DEFAULT 0,
    word_count_after INT NOT NULL DEFAULT 0,
    readability_change INT DEFAULT 0,
    diff_data JSONB DEFAULT '[]'::jsonb,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_humanizations_user_id ON humanizations(user_id);
CREATE INDEX IF NOT EXISTS idx_humanizations_created_at ON humanizations(created_at DESC);
