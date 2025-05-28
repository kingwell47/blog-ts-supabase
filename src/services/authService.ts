import { supabase } from "./supabaseClient";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

/**
 * Registers a new user with email and password.
 * @returns the user and session data
 */

export async function signUp(
  email: string,
  password: string,
  displayName?: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });
  if (error) throw error;
  return data;
}

/**
 * Logs in a user with email and password.
 * @returns the user and session data
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

/**
 * Signs out the current user.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Subscribes to authentication state changes.
 * @param callback - receives event type and current session (or null)
 * @returns a function to unsubscribe
 */
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return () => subscription.unsubscribe();
}
