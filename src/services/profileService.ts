import { supabase, handleSupabaseError, type Profile } from './supabaseClient';

export async function createProfile(profile: Profile): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .insert([profile]);

  if (error) handleSupabaseError(error);
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No profile found
    handleSupabaseError(error);
  }

  return data;
}