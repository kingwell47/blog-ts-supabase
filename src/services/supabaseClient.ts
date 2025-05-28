import { createClient } from "@supabase/supabase-js";

// Ensure these environment variables are set in your .env or build settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY"
  );
}

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
