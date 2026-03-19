import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const testEmail = process.env.TEST_USER_EMAIL || '0ghbw@sharebot.net';
  const testPassword = process.env.TEST_USER_PASSWORD || 'PASSword@1234$_';

  console.log(`Logging in as user ${testEmail}...`);
  
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword
  });

  if (authError) {
    console.error("Login failed:", authError);
    return;
  }
  
  const user = authData.user;
  console.log("Logged in! UID:", user.id);
  
  console.log("Trying to insert job...");
  const { data, error } = await supabase.from('jobs').insert([
    {
      employer_id: user.id,
      title: 'Test Software Engineer',
      company: 'Test Startup Inc',
      location: 'New York, Remote',
      type: 'Full-time',
      description: 'We are looking for a smart engineer.',
      requirements: ['React', 'TypeScript'],
      salary: '$120k',
      status: 'Open'
    }
  ]).select().single();

  if (error) {
    console.error("Insert Job Failed! Exact error details:");
    console.error(JSON.stringify(error, null, 2));
  } else {
    console.log("Job Insert Succeeded! Data returned:");
    console.log(data);
  }
}

test();
