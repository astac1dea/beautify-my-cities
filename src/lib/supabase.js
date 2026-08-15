import { createClient } from '@supabase/supabase-js'

// Not wired up yet - the app reads and writes through src/lib/store.js, which
// keeps everything in localStorage. This stays here for the migration to a real
// backend; see MIGRATION.sql for the tables that still need creating.
//
// Returns null rather than throwing when the env vars are missing, so importing
// this file can never break a build.

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && anonKey ? createClient(url, anonKey) : null

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    )
  }
  return supabase
}
