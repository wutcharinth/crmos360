import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

// Load env from apps/web/.env.local (run from apps/web/)
const envText = readFileSync('.env.local', 'utf8');
for (const line of envText.split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) throw new Error('missing supabase env');

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const testEmail = `smoke-${Date.now()}@crmos360.test`;
const testPassword = 'TestPassword123!';

console.log(`\n[1/5] Creating confirmed test user: ${testEmail}`);
const { data: created, error: createErr } = await admin.auth.admin.createUser({
  email: testEmail,
  password: testPassword,
  email_confirm: true,
  user_metadata: { full_name: 'Smoke Test User' },
});
if (createErr) throw createErr;
const userId = created.user.id;
console.log(`  OK user.id=${userId}`);

console.log(`\n[2/5] Upserting user_profile`);
const { error: profErr } = await admin.from('user_profiles').upsert({
  id: userId,
  email: testEmail,
  full_name: 'Smoke Test User',
});
if (profErr) throw profErr;
console.log('  OK');

const slug = `smoke-${Date.now()}`;
console.log(`\n[3/5] Creating organization (slug=${slug})`);
const { data: org, error: orgErr } = await admin
  .from('organizations')
  .insert({ name: 'Smoke Test Co', slug })
  .select('id')
  .single();
if (orgErr) throw orgErr;
console.log(`  OK org.id=${org.id}`);

console.log(`\n[4/5] Adding owner via org_members`);
const { error: memberErr } = await admin.from('org_members').insert({
  org_id: org.id,
  user_id: userId,
  role: 'owner',
});
if (memberErr) throw memberErr;
console.log('  OK');

console.log('\n[5/5] Cleanup');
await admin.from('organizations').delete().eq('id', org.id);
await admin.auth.admin.deleteUser(userId);
console.log('  OK');

console.log('\n✓ Backend signup + onboarding pipeline verified.\n');
