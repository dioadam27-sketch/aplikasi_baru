import { createClient } from '@supabase/supabase-js';

/**
 * CONFIGURATION SUPABASE
 * ---------------------
 * 1. Buat project di https://supabase.com
 * 2. Buka Project Settings > API
 * 3. Copy 'Project URL' dan 'anon public' key ke sini.
 */

const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_PUBLIC_KEY';

// Validasi sederhana untuk mendeteksi apakah key sudah diganti
const isPlaceholder = SUPABASE_URL.includes('YOUR_PROJECT_ID') || SUPABASE_ANON_KEY === 'YOUR_ANON_PUBLIC_KEY';

export const supabase = !isPlaceholder 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;
