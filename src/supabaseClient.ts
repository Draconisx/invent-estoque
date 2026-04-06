import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aoddqnuyvqndwpogfcnk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZGRxbnV5dnFuZHdwb2dmY25rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODc1NDYsImV4cCI6MjA5MDk2MzU0Nn0.sDax_ErO3gqdfMgJtp9uoXuXQeyAqkndYjKwt56JKa0';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function initAuth() {
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) console.error('Auth error:', error);
  return data;
}
