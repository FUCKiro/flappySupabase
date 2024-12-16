-- WARNING: This will delete all game data and users!
-- Make sure you really want to do this before running these commands

-- First, disable RLS temporarily to allow deletions
alter table public.highscores disable row level security;
alter table public.profiles disable row level security;

-- Delete all highscores
delete from public.highscores;

-- Delete all profiles
delete from public.profiles;

-- Delete all users from auth.users
delete from auth.users;

-- Reset sequences if they exist
alter sequence if exists highscores_id_seq restart with 1;

-- Re-enable RLS
alter table public.highscores enable row level security;
alter table public.profiles enable row level security;

-- Verify deletions
select count(*) from public.highscores;
select count(*) from public.profiles;
select count(*) from auth.users;