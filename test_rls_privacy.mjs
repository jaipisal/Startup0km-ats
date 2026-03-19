import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join('=').trim().replace(/^"(.*)"$/, '$1');
        }
      });
    }
  } catch (err) {
    console.warn("Could not load .env file:", err.message);
  }
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verify() {
  console.log("--- RLS Verification Results ---");

  // 1. Try to select profiles without authentication
  console.log("\n1. Testing unauthenticated profiles access...");
  const { data: anonData, error: anonError } = await supabase
    .from('profiles')
    .select('id, name');
  
  if (anonError) {
    console.log("✅ Expected failure for anon access:", anonError.message);
  } else {
    console.log("❌ Anon access succeeded (should have failed or returned empty):", anonData.length, "rows found.");
  }

  // 2. Try to select closed jobs
  console.log("\n2. Testing access to jobs...");
  const { data: allJobs, error: jobsError } = await supabase
    .from('jobs')
    .select('id, title, status');
  
  if (jobsError) {
    console.error("Error fetching jobs:", jobsError);
  } else {
    const closedJobs = allJobs?.filter(j => j.status === 'Closed') || [];
    if (closedJobs.length === 0) {
      console.log("✅ No closed jobs visible (or no closed jobs exist).");
    } else {
      console.log("❌ Closed jobs are visible despite RLS policy!");
    }
  }

  console.log("\n--- Verification Finished ---");
}

verify();
