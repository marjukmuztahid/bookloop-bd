import { createClient } from '@supabase/supabase-js';

const NEW_SUPABASE_URL = 'https://dmkituigvbffvnmfjshh.supabase.co';
const NEW_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRta2l0dWlndmJmZnZubWZqc2hoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTc3NzkzNSwiZXhwIjoyMDk1MzUzOTM1fQ.bnFzA5UbLUPReFcRGDiQP3-qp-61Sa4GRR9xZ6LLdbs';

const supabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_ROLE_KEY);

const ADMIN_ID = '72c0c6b2-89c8-441d-a9ab-e200f969595d';
const ADMIN_EMAIL = 'bookloopbd.com@gmail.com';

async function run() {
  console.log("=== Recreating Admin Auth User (Post-Cleanup) ===");

  // Create the auth user with the custom ID
  console.log("Creating auth user in Supabase Auth...");
  const { data: createData, error: createError } = await supabase.auth.admin.createUser({
    id: ADMIN_ID,
    email: ADMIN_EMAIL,
    email_confirm: true,
    user_metadata: { full_name: 'BookLoop Admin' }
  });

  if (createError) {
    console.error("Failed to create auth user. Make sure you ran the SQL cleanup in your Supabase Dashboard first!", createError.message);
    return;
  }
  console.log("Successfully created auth user!");

  // Re-insert into public.users and public.admin_users
  console.log("Re-inserting into public.users...");
  const { error: insertUserErr } = await supabase
    .from('users')
    .insert({
      id: ADMIN_ID,
      full_name: 'BookLoop Admin',
      phone: '01700000000',
      district: 'Dhaka'
    });
  if (insertUserErr) console.error("insertUserErr:", insertUserErr.message);
  else console.log("Successfully inserted into public.users!");

  console.log("Re-inserting into public.admin_users...");
  const { error: insertAdminErr } = await supabase
    .from('admin_users')
    .insert({
      id: ADMIN_ID,
      email: ADMIN_EMAIL
    });
  if (insertAdminErr) console.error("insertAdminErr:", insertAdminErr.message);
  else console.log("Successfully inserted into public.admin_users!");

  // Send password reset
  console.log("Sending password reset email...");
  const { error: resetErr } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email: ADMIN_EMAIL
  });
  if (resetErr) console.error("Failed to send password reset:", resetErr.message);
  else console.log("Successfully sent password reset email!");
}

run();
