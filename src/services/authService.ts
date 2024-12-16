import { supabase, handleSupabaseError } from './supabaseClient';
import { isEmailTaken, isUsernameTaken } from './validationService';
import { createProfile } from './profileService';

const AUTH_ERRORS = {
  invalid_credentials: 'Invalid email or password',
  user_not_found: 'No user found with this email',
  email_taken: 'An account with this email already exists',
  weak_password: 'Password should be at least 6 characters',
  invalid_email: 'Please enter a valid email address',
} as const;

function getAuthErrorMessage(error: any): string {
  if (error.message in AUTH_ERRORS) {
    return AUTH_ERRORS[error.message as keyof typeof AUTH_ERRORS];
  }
  return error.message || 'An authentication error occurred';
}

export interface User {
  id: string;
  email: string;
  username: string;
}

export const signUp = async (
  email: string,
  password: string,
  username: string
): Promise<User> => {
  // Check if email is taken
  const emailExists = await isEmailTaken(email.toLowerCase());
  if (emailExists) {
    throw new Error('An account with this email already exists');
  }

  // Check if username is taken
  const usernameExists = await isUsernameTaken(username);
  if (usernameExists) {
    throw new Error('This username is already taken');
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, email: email.toLowerCase() },
      emailRedirectTo: `${import.meta.env.VITE_SITE_URL}/auth/callback`
    }
  });

  if (authError) throw new Error(getAuthErrorMessage(authError));
  if (!authData.user) throw new Error('No user data returned');

  // Create profile in profiles table
  await createProfile({
    id: authData.user.id,
    email: email.toLowerCase(),
    username
  });

  return {
    id: authData.user.id,
    email: authData.user.email!,
    username
  };
};

export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(getAuthErrorMessage(error));
  if (!data.user) throw new Error('No user data returned');

  // Get username from user metadata
  const username = data.user.user_metadata?.username || 'Player';

  return {
    id: data.user.id,
    email: data.user.email!,
    username: username
  };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(getAuthErrorMessage(error));
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  
  if (!user) return null;
  
  // Get username from user metadata
  const username = user.user_metadata?.username || 'Player';

  return {
    id: user.id,
    email: user.email!,
    username: username
  };
};