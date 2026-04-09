alter table if exists public.chats
add column if not exists pdf_storage_path text;
