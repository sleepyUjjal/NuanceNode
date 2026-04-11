-- ==============================================================================
-- NuanceNode Master Database Setup & Hardening Script
-- 
-- INSTRUCTIONS:
-- 1. Open your Supabase SQL Editor.
-- 2. Paste and run this entire file. It will create the entire database structure
--    from scratch and apply critical Row Level Security (RLS) rules.
-- ==============================================================================

BEGIN;

-- 1. Create Base Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(255) DEFAULT '',
    email VARCHAR(255) UNIQUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    auth_type VARCHAR(50) DEFAULT 'email'
);

-- 2. Create Chats Table
CREATE TABLE IF NOT EXISTS public.chats (
    id VARCHAR(36) PRIMARY KEY,
    claim TEXT NOT NULL,
    analysis_report TEXT,
    pdf_storage_path TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(36) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE
);

-- 3. Create Email Authentication Credentials Table
CREATE TABLE IF NOT EXISTS public.email_auth_credentials (
    user_id VARCHAR(36) PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    hashed_password VARCHAR(255) NOT NULL,
    otp_code VARCHAR(10),
    otp_expires_at TIMESTAMP WITHOUT TIME ZONE
);

-- 4. Create Google Authentication Credentials Table
CREATE TABLE IF NOT EXISTS public.google_auth_credentials (
    user_id VARCHAR(36) PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    google_id VARCHAR(255) UNIQUE NOT NULL
);

-- 5. Supabase Security Hardening (CRITICAL)
-- NuanceNode routes everything securely through FastAPI.
-- This disables the public Supabase web API to prevent people from reading database tables directly.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.users FROM anon, authenticated;
REVOKE ALL ON TABLE public.chats FROM anon, authenticated;

GRANT ALL ON TABLE public.users TO service_role;
GRANT ALL ON TABLE public.chats TO service_role;

COMMIT;
