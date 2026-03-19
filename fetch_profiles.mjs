import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gcdeacsivyubuerqeqbw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZGVhY3Npdnl1YnVlcnFlcWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDU2MDUsImV4cCI6MjA4OTQyMTYwNX0.r1_Q-eiMYILcuvOTjBZQ937_F4xIP8wm3cj2oXNXOds';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Fetching profiles to find the user...");
  const { data: profiles, error: profError } = await supabase.from('profiles').select('*');
  
  if (profError) {
    console.error("Failed to fetch profiles:", profError);
    return;
  }
  
  console.log("Profiles found:", profiles);
  
  if (profiles.length > 0) {
    const user = profiles.find(p => p.role === 'employer') || profiles[0];
    console.log("Will try to insert a job for:", user.id);
    
    // We cannot insert as this user via Anon key because RLS requires auth.uid() = employer_id !
    // We'd have to literally authenticate as them.
    // BUT we can check if the profile exists.
  } else {
    console.log("No profiles exist in the remote database!");
  }
}

test();
