-- Drop existing table and policies
drop table if exists public.highscores cascade;

-- Recreate highscores table with proper constraints
create table public.highscores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  score integer not null check (score >= 0 and score <= 1000),
  username text not null check (length(username) >= 3 and length(username) <= 20),
  timestamp timestamptz not null default now(),
  constraint unique_user_highscore unique (user_id)
);

-- Enable RLS
alter table public.highscores enable row level security;

-- Create policies
create policy "Anyone can read highscores"
  on public.highscores
  for select
  to anon, authenticated
  using (true);

create policy "Users can insert their own scores"
  on public.highscores
  for insert
  to authenticated
  with check (
    auth.uid() = user_id and
    (
      select count(*) = 0
      from public.highscores
      where user_id = auth.uid()
    )
  );

create policy "Users can update their own scores"
  on public.highscores
  for update
  to authenticated
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
returns integer
security definer
set search_path = public
language plpgsql
as $$
declare
  deleted_count integer;
begin
  delete from public.highscores
  where timestamp < date_trunc('week', now())
  returning count(*) into deleted_count;
  
  return deleted_count;
end;
$$;