import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
function validateEnvVariables() {
  const missing = [];
  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY');
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

validateEnvVariables();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  if (import.meta.env.DEV) {
    console.error('Supabase error:', error);
  }

  // Map Supabase errors to user-friendly messages
  const message = (() => {
    switch (error?.code) {
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