import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase'; // لو عندك types معرف

export function supabaseClient(): SupabaseClient<Database> {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
}
