-- Enable UUID extension
create extension if not exists "uuid-ossp" schema extensions;

-- Create profiles table for username uniqueness
create table if not exists public.profiles (
  id uuid references auth.users primary key,
  email text unique not null,
  username text unique not null check (length(username) >= 3 and length(username) <= 20),
  created_at timestamptz default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Create highscores table
create table if not exists public.highscores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  score integer not null check (score >= 0 and score <= 1000),
  username text not null check (length(username) >= 3 and length(username) <= 20),
  timestamp timestamptz not null default now(),
  constraint unique_user_highscore unique (user_id)
);

-- Setup Row Level Security
alter table public.highscores enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Anyone can read highscores" on public.highscores;
drop policy if exists "Users can insert their own scores" on public.highscores;
drop policy if exists "Users can update their own scores" on public.highscores;

-- Access policies
create policy "Anyone can read highscores"
  on public.highscores for select using (true);

create policy "Users can insert their own scores"
  on public.highscores for insert
  with check (
    auth.uid() = user_id and
    (
      select count(*) = 0
      from public.highscores
      where user_id = auth.uid()
    )
  );

create policy "Users can update their own scores"
  on public.highscores for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id and 
    score > (
      select score 
      from public.highscores 
      where user_id = auth.uid()
    )
  );

-- Create function to clean old scores
create or replace function public.clean_old_scores()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.highscores
  where timestamp < date_trunc('week', now());
end;
$$;