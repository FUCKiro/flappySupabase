-- Drop existing function if exists
drop function if exists public.clean_old_scores();

-- Create improved function
create or replace function public.clean_old_scores()
returns integer -- Changed to return number of deleted rows
language plpgsql
security definer
set search_path = public
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