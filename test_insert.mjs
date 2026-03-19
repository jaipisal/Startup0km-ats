import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Signing up test user...");
  const email = `test_employer_${Date.now()}@example.com`;
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: 'password123',
    options: {
      data: {
        name: 'Test Employer',
        role: 'employer',
        company: 'Test Co'
      }
    }
  });

  if (authError) {
    console.error("Signup failed:", authError);
    return;
  }
  
  const user = authData.user;
  console.log("Signed up:", user.id);
  
  // Wait a second for trigger to complete usually
  await new Promise(r => setTimeout(r, 1000));

  console.log("Checking profile...");
  const { data: prof, error: profErr } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (profErr) {
    console.error("Profile check failed:", profErr);
  } else {
    console.log("Profile exists:", prof);
  }

  console.log("Trying to insert job...");
  const { data, error } = await supabase.from('jobs').insert([
    {
      employer_id: user.id,
      title: 'Test Job',
      company: 'Test Co',
      location: 'Remote',
      type: 'Full-time',
      description: 'Test Desc',
      requirements: ['Req 1'],
      salary: '100k',
      status: 'Open'
    }
  ]).select().single();

  if (error) {
    console.error("Insert Job Failed! Error details:", JSON.stringify(error, null, 2));
  } else {
    console.log("Job Insert Succeeded!", data);
  }
}

test();
