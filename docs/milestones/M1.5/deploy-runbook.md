# M1.5 deploy runbook

How to take the M1.5 prototype from PR-preview to production for design partners.

## Where things stand

- 20 of 22 build-plan chunks shipped on PR [#1](https://github.com/wutcharinth/FlowAIOS/pull/1).
- Chunks 1-13 (foundation + marketing + admin + 7 mocked in-app surfaces) are visual.
- Chunks 15-19 (lessons / clustering / sentiment / advisor / PDPA / skin DB) are functional.
- Chunk 20 (feature flags) is shipped: production defaults to `m15` OFF; preview defaults to ON.
- Chunk 21 (perf + a11y) — audit in progress; punch list will follow.
- Chunk 22 (deploy behind flag) — this document.

## Pre-flight checklist

Before flipping the m15 flag for any production org, verify:

- [ ] Vercel preview build is green and the PR's Vercel preview URL renders all M1.5 surfaces.
- [ ] Supabase migrations from `supabase/migrations/` are applied to production (see "Applying migrations").
- [ ] Vercel env on production:
  - `GEMINI_API_KEY` set
  - `ADMIN_EMAILS` set (your email at minimum)
  - `M15_ENABLED_DEFAULT=false` (already set; means m15 is OFF for orgs without explicit opt-in)
  - `NEXT_PUBLIC_USE_MOCKS=0` (already set; means production reads real data)
- [ ] `lib/concierge/store.ts` has been swapped from in-memory to the Supabase-backed implementation (currently in-memory; one-file change). Until then, concierge data resets on every cold start.

## Applying migrations

Six migrations on this PR. Apply in order:

```
supabase/migrations/
  20260510120000_concierge_prospects_llm_usage.sql
  20260510130000_lessons.sql
  20260510140000_match_lesson_embedding.sql
  20260510150000_pdpa_settings.sql
  20260510160000_user_prefs.sql
  20260510170000_intelligence_response_p50.sql
  20260510180000_advisor_rules.sql
  20260510190000_feature_flags.sql
```

Two options:

**Option A — Drizzle CLI (recommended).** Requires `DATABASE_URL` set locally to your production Supabase Postgres URI:

```bash
DATABASE_URL='postgresql://postgres:PASSWORD@db.YOUR-PROJECT.supabase.co:5432/postgres' \
  pnpm --filter @crmos360/db migrate
```

**Option B — Supabase CLI.**

```bash
supabase link --project-ref YOUR-PROJECT
supabase db push
```

**Option C — manual.** Open each `.sql` in the Supabase Dashboard SQL editor and run.

## Enabling m15 for a design partner

Once migrations are applied:

1. Sign in to the production app as your admin user.
2. Visit `/admin/flags`.
3. Toggle "M1.5 prototype" ON for your own org first as a smoke test.
4. Walk through `/knowledge`, `/intelligence`, `/advisor`, `/settings/{pdpa,channels,appearance}`. All should render real data (or empty states with no errors).
5. To enable for a design-partner org: have them sign in, visit their /admin/flags, and toggle on — OR set the row directly via the Supabase dashboard:

```sql
INSERT INTO org_feature_flags (org_id, flag_key, enabled, enabled_by_user_id)
VALUES ('PARTNER_ORG_UUID', 'm15', true, 'YOUR_USER_UUID')
ON CONFLICT (org_id, flag_key)
  DO UPDATE SET enabled = excluded.enabled, enabled_at = now();
```

## Rolling back

If something breaks for a partner:

```sql
UPDATE org_feature_flags SET enabled = false
WHERE org_id = 'PARTNER_ORG_UUID' AND flag_key = 'm15';
```

Routes return 404 immediately; no redeploy needed.

To kill the rollout entirely: set `M15_ENABLED_DEFAULT=false` on Vercel (already set) and delete every row in `org_feature_flags` where `flag_key = 'm15' AND enabled = true`.

## Concierge persistence

The marketing concierge currently uses an in-memory store. For production:

1. Open `apps/web/lib/concierge/store.ts`.
2. Replace the `Map`-based implementation with Supabase calls against the `prospect_threads` / `prospect_messages` / `llm_usage` tables (already in migration `20260510120000`).
3. Each function in the file maps to a single Supabase query; the shape is already defined.

A reasonable follow-up commit. Until it lands, concierge transcripts on production reset whenever Vercel cold-starts a function.

## Rate limiting in production

`apps/web/lib/concierge/rate-limit.ts` is in-memory per-instance. Multi-instance prod will under-count by ~3x (Vercel typically runs 3 lambdas hot). For real protection:

- Swap to `@upstash/ratelimit` (REST-backed; persists across instances).
- Or add Vercel Edge Middleware that does IP rate limiting before the request reaches the function.

## Monitoring

Set up alerts on:

- Error rate on `/api/concierge/*`
- P95 latency on `/intelligence`, `/advisor` (cluster + sentiment compute can be slow on first hit)
- `flagged='jailbreak'` rate on `prospect_messages` (sudden spike = abuse pattern worth reviewing)
- `audit_logs` write rate (sanity check — if it drops to zero, something is broken upstream)

## Post-deploy verification

After enabling for a partner, watch the first day:

- [ ] At least 10 prospect threads complete without errors.
- [ ] Lesson extraction fires on at least one team-edited reply (check `lessons` table).
- [ ] Configuration Advisor proposes at least one rule from a cluster (check `advisor_rules` table).
- [ ] Intelligence Dashboard renders for the partner (visit `/intelligence` as them).
- [ ] PDPA control plane saves residency / memory mode (check `org_pdpa_settings` for their row).
- [ ] No P0 audit-log entries (action types like `error.*` or unexpected admin actions).

## Open questions

- Concierge in-memory → Supabase swap: do this before broad rollout.
- Conflict resolution with main: 5 commits on main not in this branch (knowledge base, admin pages, AI logs viewer, etc.). Need to rebase + reconcile before merging to main.
- The `as never` cast in `lessons.ts` for the `match_lesson_embedding` RPC: tighten with a typed wrapper in `packages/db/src/rpc.ts`.
