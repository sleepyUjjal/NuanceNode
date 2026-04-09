-- Supabase hardening for NuanceNode when FastAPI is the only intended access layer.
-- Run this in the Supabase SQL Editor after your tables exist.

begin;

alter table if exists public.users enable row level security;
alter table if exists public.chats enable row level security;

revoke all on table public.users from anon, authenticated;
revoke all on table public.chats from anon, authenticated;

-- Keep service-role level access available for server-side connections.
grant all on table public.users to service_role;
grant all on table public.chats to service_role;

commit;