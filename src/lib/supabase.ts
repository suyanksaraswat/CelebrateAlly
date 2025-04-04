
import { createClient } from '@supabase/supabase-js';

// Using the provided Supabase credentials
const supabaseUrl = 'https://ndvviylgdymeyrqkndah.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kdnZpeWxnZHltZXlycWtuZGFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MjU5MTUsImV4cCI6MjA1OTAwMTkxNX0.HRWwLpK7A0loOrRI20wv1UZazZWGldPWQfUp1b9_J3M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
