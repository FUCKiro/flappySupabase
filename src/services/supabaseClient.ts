import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    debug: import.meta.env.DEV
  }
});

// Verify connection
async function checkConnection() {
  try {
    const { error } = await supabase.from('highscores').select('count', { count: 'exact', head: true });
    if (error) throw error;
    console.log('Successfully connected to Supabase');
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
  }
}

// Check connection in development
if (import.meta.env.DEV) {
  checkConnection();
}

export type Profile = {
  id: string;
  username: string;
  email: string;
};

export type Score = {
  id: string;
  user_id: string;
  score: number;
  username: string;
  timestamp: string;
};

// Error handling utility
export function handleSupabaseError(error: any): never {
  // Log error details for debugging (in development only)
  console.error('Supabase error:', error);

  // Map Supabase errors to user-friendly messages
  const message = (() => {
    switch (error?.code) {
      case '23505':
        if (error.message?.includes('profiles_username_key')) {
          return 'This username is already taken';
        }
        if (error.message?.includes('profiles_email_key')) {
          return 'An account with this email already exists';
        }
        return 'A record with this information already exists';
      case 'invalid_credentials':
        return 'Invalid email or password';
      case 'user_not_found':
        return 'No user found with this email';
      case 'email_taken':
        return 'An account with this email already exists';
      case 'PGRST301':
        return 'Database connection failed';
      case 'PGRST204':
        return 'Invalid data provided';
      case '23505':
        return 'A record with this information already exists';
      case '42P01':
        return 'Database table not found';
      case '42501':
        return 'Insufficient permissions';
      default: 
        return 'An unexpected error occurred';
    }
  })();

  throw new Error(message);
}