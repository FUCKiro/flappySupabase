import { supabase, handleSupabaseError } from './supabaseClient';

export interface User {
  id: string;
  email: string;
  username: string;
}

export const signUp = async (email: string, password: string, username: string): Promise<User> => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }
    }
  });

  if (authError) handleSupabaseError(authError);
  if (!authData.user) throw new Error('No user data returned');

  return {
    id: authData.user.id,
    email: authData.user.email!,
    username
  };
};

export const signIn = async (email: string, password: string): Promise<User> => {
  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) handleSupabaseError(error);
  if (!user) throw new Error('No user data returned');

  // Get username from user metadata
  const username = user.user_metadata?.username || 'Player';

  return {
    id: user.id,
    email: user.email!,
    username: username
  };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) handleSupabaseError(error);
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Get username from user metadata
  const username = user.user_metadata?.username || 'Player';

  return {
    id: user.id,
    email: user.email!,
    username: username
  };
};