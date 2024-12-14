-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create highscores table
create table highscores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  score integer not null check (score >= 0),
  username text not null,
  timestamp timestamptz not null default now(),
  constraint unique_user_highscore unique (user_id)
);

-- Setup Row Level Security
alter table highscores enable row level security;

-- Access policies
create policy "Anyone can read highscores"
  on highscores for select using (true);

create policy "Users can insert their own scores"
  on highscores for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own scores"
  on highscores for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create function to clean old scores
create or replace function clean_old_scores()
returns void
language plpgsql
as $$
begin
  delete from highscores
  where timestamp < date_trunc('week', now());
end;
$$;


-- Note: The cron job needs to be set up in the Supabase dashboard
-- Go to Database -> Functions -> Scheduled Functions
-- Add a new scheduled function with:
-- Name: clean-weekly-scores
-- Schedule (cron): 0 0 * * 1
-- Function to run: select clean_old_scores();