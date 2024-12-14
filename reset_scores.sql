-- Delete all records from highscores table
delete from public.highscores;

-- Reset the sequence if you have one (optional)
-- alter sequence highscores_id_seq restart with 1;