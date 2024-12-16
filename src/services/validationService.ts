import { supabase } from './supabaseClient';

export async function isEmailTaken(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email.toLowerCase())
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error checking email:', error);
    return false; // Fail open to avoid blocking registration
  }

  return !!data;
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking username:', error);
    return false; // Fail open to avoid blocking registration
  }

  return !!data;
}