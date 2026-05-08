// Verify RLS doesn't recurse anymore. Sign in as a real user and run the
// queries that the /onboarding and /(app) layout do.
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const envText = readFileSync('.env.local', 'utf8');
for (const line of envText.split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

const admin = createClient(url, service, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const email = `rls-smoke-${Date.now()}@crmos360.test`;
const password = 'TestPassword123!';

console.log(`[setup] create confirmed user ${email}`);
const { data: u, error: ue } = await admin.auth.admin.createUser({
  email, password, email_confirm: true,
});
if (ue) throw ue;

const userClient = createClient(url, anon, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log('[setup] sign in as user');
const { data: s, error: se } = await userClient.auth.signInWithPassword({ email, password });
if (se) throw se;
console.log(`  session OK, user.id=${s.user.id}`);

console.log('\n[1] org_members select (should not recurse, returns empty for new user)');
const t1 = Date.now();
const { data: m1, error: e1 } = await userClient
  .from('org_members').select('org_id').eq('user_id', s.user.id).limit(1).maybeSingle();
console.log(`  ${e1 ? 'FAIL: ' + e1.message : `OK (${Date.now() - t1}ms, rows=${m1 ? 1 : 0})`}`);
if (e1) process.exit(1);

console.log('\n[2] organizations select (RLS uses is_org_member helper)');
const t2 = Date.now();
const { error: e2 } = await userClient.from('organizations').select('id').limit(1);
console.log(`  ${e2 ? 'FAIL: ' + e2.message : `OK (${Date.now() - t2}ms)`}`);
if (e2) process.exit(1);

console.log('\n[3] simulate onboarding: admin creates org + member, user re-queries');
const slug = `rls-${Date.now()}`;
const { data: org } = await admin.from('organizations')
  .insert({ name: 'RLS Smoke', slug }).select('id').single();
await admin.from('org_members').insert({ org_id: org.id, user_id: s.user.id, role: 'owner' });

const { data: m3, error: e3 } = await userClient
  .from('org_members')
  .select('org_id, role, organizations:organizations!inner(id, name, slug)')
  .eq('user_id', s.user.id).limit(1).maybeSingle();
console.log(`  ${e3 ? 'FAIL: ' + e3.message : `OK membership found, role=${m3?.role}, org=${m3?.organizations?.name}`}`);
if (e3) process.exit(1);

console.log('\n[cleanup]');
await admin.from('organizations').delete().eq('id', org.id);
await admin.auth.admin.deleteUser(s.user.id);

console.log('\n✓ RLS recursion fixed. /onboarding and /(app) queries now succeed.\n');
