# FlowAIOS — M1.5 Build Plan

**Phase:** post-research; market validation study complete (see `docs/research/2026-05-09/`).
**Audience:** solo founder + AI agents.
**Approach:** prototype-led; layered (HTML hi-fi for marketing, Next.js mocked for in-app, functional integration for data-bound pieces). Soft validation gate runs in parallel with functional integration.

## Context

The 8-persona Thai-market study validated H10 (confidence-gated auto-reply) unanimously, surfaced KB+Lessons as the highest-rated planned feature (4.4/5 avg, 5/8 "would pay extra"), exposed a buyer-mode vs operator-mode aesthetic split that loses 4+ buyers on the dark cockpit, flagged PDPA as a deal gate (not a feature), and recommended Pim (mid-market CS manager) and Win (marketing-led tutoring) as P1/P2 ICPs.

The recommended M1.5 scope: **Knowledge Base + Lessons → Intelligence Dashboard → Configuration Advisor → conversation handoff card → PDPA scaffolding → buyer-mode skin → channel-set-per-vertical config**. This phase turns that scope into an executable build plan with prototype layering.

Defaults applied for the three open questions:
- **Plan location** — this file (plan-mode constraint). After approval, copy to `docs/milestones/M1.5/build-plan.md`.
- **Mock data infra** — Next.js route handlers returning fixtures behind `NEXT_PUBLIC_USE_MOCKS=1`. Light, env-toggled, exercises the same client code as production.
- **`/for/agencies` landing** — skip in M1.5. Tan is year-2; don't promise what we can't sell. Keep the slot in the routing config for future.

## Goals

1. Demo-able end-to-end product: M1.2–1.4 surfaces re-skinned to multi-skin tokens + all M1.5 surfaces clickable with mocked data + functional lesson pipeline + PDPA control plane.
2. Two homepage variants (cockpit-dark + daylight-light) and two vertical landings (`/for/commerce`, `/for/customer-ops`).
3. Public pricing page reflecting the 4-tier shape from the study.
4. Validated against 3–5 real Pim/Win-style users; deltas folded into the back half of functional integration.
5. Shipped behind feature flag for design partners.

## Success criteria

- Pim/Win-equivalent users complete a guided demo of all 7 new surfaces in under 15 minutes with no orientation help.
- Buyer-mode skin loses fewer prospects than the dark cockpit on a 5-second test.
- Lesson extraction pipeline runs against real `customer_memory` data and produces ≥1 valid auto-lesson per 50 messages.
- PDPA control panel ships with a working audit log + residency selector + retention job.
- All M1.5 changes ship behind a single feature flag (`m15`), with per-org override.
- Validation round produces a written delta-doc and at least one binding scope adjustment.

---

## Phase 1 — Foundation

Unlocks every later phase. Do this first, sequentially.

### Chunk 1: Multi-skin design tokens

**Prerequisites:** none.

**Read first:**
- `apps/web/tailwind.config.ts`
- `apps/web/app/globals.css`
- `apps/web/components.json` (shadcn config, if present)
- `crmos360-homepage-demo.html` (current dark cockpit palette)
- `design/explorations/README.md` (rationale + Direction 3 token list)

**Deliverable:**
- `apps/web/lib/themes/tokens.ts` — TypeScript token definitions (colors, type, spacing, radius, motion, density) for two skins: `cockpit` (current dark) and `daylight` (new light, derived from Direction 1 "Editorial" palette but with same semantic structure as cockpit).
- `apps/web/app/globals.css` — CSS variables defined per-skin via `[data-skin="cockpit"]` and `[data-skin="daylight"]` selectors.
- `apps/web/tailwind.config.ts` — extended to consume CSS vars (e.g. `colors.bg.canvas: 'var(--color-bg-canvas)'`).
- `apps/web/components/skin-provider.tsx` — React provider that reads pref from cookie/localStorage and writes `data-skin` to `<html>`.
- `apps/web/app/dev/skin/page.tsx` — internal page that renders all token swatches + sample components in both skins for QA.

**Verification:**
- `pnpm dev` and visit `/dev/skin` — toggle skin, all tokens visibly shift.
- Inspect `<html data-skin>` flips correctly in DevTools.
- `pnpm typecheck` passes.

### Chunk 2: Mock data layer

**Prerequisites:** Chunk 1.

**Read first:**
- `packages/db/src/` — schema for inbox, customers, customer_memory.
- `apps/web/app/(app)/inbox/page.tsx` — current data-fetch pattern.
- `apps/web/lib/` — existing utilities.

**Deliverable:**
- `apps/web/lib/mocks/fixtures/` — fixture data per surface:
  - `conversations.ts` (40 conversations across 6 channels, 3 verticals)
  - `customers.ts` (~80 customers with memory entries)
  - `lessons.ts` (12 lessons across pending/approved/rejected)
  - `dashboard-metrics.ts` (recurring questions, sentiment trends, automate-next candidates)
  - `advisor-rules.ts` (8 rule candidates across pattern types)
  - `audit-log.ts` (200 entries, mixed AI actions + human approvals)
- `apps/web/app/api/_mocks/[...slug]/route.ts` — Next.js route handler that returns fixtures when `process.env.NEXT_PUBLIC_USE_MOCKS === '1'`.
- `apps/web/lib/api/client.ts` — thin wrapper that branches between real Supabase calls and mock route at the data-fetch layer.
- `.env.example` — document `NEXT_PUBLIC_USE_MOCKS=1` for prototype mode.

**Verification:**
- `NEXT_PUBLIC_USE_MOCKS=1 pnpm dev` — Inbox renders fixture conversations.
- Toggle off, app falls back to real Supabase queries.
- Each new surface in Phase 3 imports from `lib/api/client.ts`, never directly from fixtures or Supabase.

### Chunk 3: Route shell

**Prerequisites:** Chunk 2.

**Read first:**
- `apps/web/app/(app)/layout.tsx` — current app shell, navigation.
- `apps/web/middleware.ts` — auth guards.

**Deliverable:**
- `apps/web/app/(app)/knowledge/page.tsx` — placeholder.
- `apps/web/app/(app)/intelligence/page.tsx` — placeholder.
- `apps/web/app/(app)/advisor/page.tsx` — placeholder.
- `apps/web/app/(app)/settings/pdpa/page.tsx` — placeholder.
- `apps/web/app/(app)/settings/channels/page.tsx` — placeholder.
- `apps/web/app/(app)/settings/appearance/page.tsx` — placeholder.
- `apps/web/components/app-nav.tsx` — extended to include new top-level entries (Inbox, Knowledge, Intelligence, Advisor, Settings).

**Verification:**
- All 6 routes resolve (return placeholder content).
- Navigation shows new entries.
- Auth still enforced.

---

## Phase 2 — Marketing surfaces

Two of three landing pages + a homepage variant + a pricing page. Skip `/for/agencies`.

### Chunk 4: Homepage daylight variant + vertical chooser

**Prerequisites:** Chunk 1.

**Read first:**
- `apps/web/app/(marketing)/page.tsx` — current homepage (Sunlit Cockpit / dark cockpit port).
- `crmos360-homepage-demo.html` — original demo content.

**Deliverable:**
- `apps/web/app/(marketing)/layout.tsx` — sets `data-skin="daylight"` by default for marketing surfaces; respects user override.
- `apps/web/app/(marketing)/page.tsx` — hero now leads with H10 (confidence-gated reply), not unified inbox. Primary CTA: "Start with your LINE OA in 30 minutes."
- `apps/web/components/marketing/vertical-chooser.tsx` — overlay that prompts "Which best describes you?" with options: DTC commerce, Customer-ops mid-market, Education / services. Persists choice in cookie. Filters subsequent demo content (channel chips visible, language tone, examples shown).
- `apps/web/app/(marketing)/page.tsx` reads chosen vertical and adapts: hides irrelevant channel chips, swaps hero example.

**Verification:**
- Default load shows daylight skin.
- Vertical chooser overlay appears for first-time visitors.
- Choosing "Education / services" hides Shopee/Lazada/TikTok chips on the homepage.
- Toggle to cockpit skin via `?skin=cockpit` query for QA.

### Chunk 5: Vertical landing pages

**Prerequisites:** Chunk 4.

**Read first:**
- `docs/research/2026-05-09/personas/01-dtc-beauty-owner.md` (Nat — commerce vertical).
- `docs/research/2026-05-09/personas/02-cs-manager-fashion.md` (Pim — customer-ops vertical).
- `docs/research/2026-05-09/personas/06-tutoring-marketing.md` (Win — services vertical).

**Deliverable:**
- `apps/web/app/(marketing)/for/commerce/page.tsx` — hero, 3 pain-points lifted from Nat's persona quotes, 3 feature blocks (Inbox + auto-reply, Customer memory, Order lookup teaser), pricing CTA. Shopee/Lazada/TikTok visible.
- `apps/web/app/(marketing)/for/customer-ops/page.tsx` — hero, 3 pain-points lifted from Pim's persona quotes, 3 feature blocks (Confidence-gated auto-reply, KB+Lessons, Intelligence Dashboard), enterprise-friendly visual treatment.
- `apps/web/app/(marketing)/for/services/page.tsx` — hero with Win-style positioning ("AI lead-qualifier for service businesses"), feature blocks (Configuration Advisor, Intelligence Dashboard, Sheets integration teaser).

**Verification:**
- Each landing renders distinct content.
- Channel chips and language tone match the vertical.
- All three respect the daylight skin.

### Chunk 6: Pricing page

**Prerequisites:** Chunk 1.

**Read first:**
- `docs/research/2026-05-09/synthesis/pricing-signals.md` — 4-tier shape.

**Deliverable:**
- `apps/web/app/(marketing)/pricing/page.tsx` — 4 tiers (Starter, Growth, Pro, Enterprise) in horizontal cards. Monthly/annual toggle. Feature comparison matrix. "Talk to us" CTAs for Pro and Enterprise. Starter and Growth: self-serve CTA.
- Includes a small "Agencies / multi-tenant?" link to a contact form (year-2 placeholder).

**Verification:**
- All 4 tiers render with correct THB/mo prices.
- Monthly/annual toggle adjusts displayed prices (annual = 10× monthly i.e. 2 months free).
- Feature matrix correct against the synthesis doc.

---

## Phase 3 — In-app mocked prototypes

Each surface ships as a clickable Next.js route consuming mock fixtures. No backend logic yet. Parallelize by dispatching one subagent per chunk after Phase 1 completes.

### Chunk 7: Re-skin Inbox + Conversation detail

**Prerequisites:** Chunks 1, 2.

**Read first:**
- `apps/web/app/(app)/inbox/page.tsx`
- `apps/web/app/(app)/inbox/[id]/page.tsx` (if exists)
- `apps/web/components/inbox/` (existing inbox components)

**Deliverable:**
- All hardcoded color / spacing / type values in Inbox surfaces replaced with token references.
- Channel chip filtering: respects per-org channel-set config (Chunk 13). Hides chips for channels the org has disabled.
- Both skins render correctly.

**Verification:**
- Visual diff between current and re-skinned Inbox shows only token-driven changes.
- Toggle skin in `/dev/skin` — Inbox follows.
- With channels filter `["line"]`, only LINE conversations show.

### Chunk 8: KB + Lessons surface (mocked)

**Prerequisites:** Chunks 1, 2, 3.

**Read first:**
- `apps/web/lib/mocks/fixtures/lessons.ts`
- `crmos360-homepage-demo.html` for the "Lessons" section UI cues.

**Deliverable:**
- `apps/web/app/(app)/knowledge/page.tsx` — two-pane layout: left tree of KB articles + lessons, right pane editor / detail.
- `apps/web/app/(app)/knowledge/articles/[id]/page.tsx` — KB article markdown editor (use `react-markdown` for preview, plain textarea or TipTap for edit).
- `apps/web/app/(app)/knowledge/lessons/page.tsx` — lesson list filtered by status (pending/approved/rejected). Each row: source conversation link, extracted statement, suggested rule, approve / reject / edit actions.
- `apps/web/app/(app)/knowledge/lessons/[id]/page.tsx` — lesson detail with conversation context, AI's reasoning, and a "promote to rule" button (links to Configuration Advisor).
- `apps/web/components/knowledge/lesson-card.tsx`, `apps/web/components/knowledge/article-tree.tsx` — reusable.

**Verification:**
- Navigate `/knowledge` → see article tree.
- Open a lesson → see conversation context + reasoning.
- Approve / reject — UI updates (mock; no persistence).
- Both skins render correctly.

### Chunk 9: Intelligence Dashboard (mocked)

**Prerequisites:** Chunks 1, 2, 3.

**Read first:**
- `apps/web/lib/mocks/fixtures/dashboard-metrics.ts`
- `docs/research/2026-05-09/synthesis/feature-prioritization.md` § Intelligence Dashboard

**Deliverable:**
- `apps/web/app/(app)/intelligence/page.tsx` — 4-quadrant dashboard:
  - Top-left: recurring-question clusters (top 10, with volume bars and tap-through to source conversations).
  - Top-right: sentiment trend chart (channel × time, last 30 days).
  - Bottom-left: "Automate next" widget — top 5 candidates with one-click "send to Advisor" action.
  - Bottom-right: bottleneck card — slowest responses, after-hours conversion, agent workload.
- Filters: vertical, channel, branch, date range.
- "Export PDF" button (stub — no real export yet).
- Use Recharts or similar; respect skin tokens.

**Verification:**
- Dashboard renders with mock data.
- Filters update the displayed metrics.
- "Send to Advisor" navigates to `/advisor` with prefill.

### Chunk 10: Configuration Advisor (mocked)

**Prerequisites:** Chunks 1, 2, 3, 9.

**Read first:**
- `apps/web/lib/mocks/fixtures/advisor-rules.ts`

**Deliverable:**
- `apps/web/app/(app)/advisor/page.tsx` — split view: pending rule candidates (top), active rules library (bottom).
- `apps/web/app/(app)/advisor/[id]/page.tsx` — rule candidate detail: source pattern, confidence, sample matches, proposed condition + action, approve / reject / edit / "save and don't auto-apply" actions.
- Active rules: search, sort by trigger count, disable / edit / delete.
- Prefill flow: when arriving from `/intelligence` with `?source=cluster:X`, show the candidate prefilled.

**Verification:**
- Open `/advisor` → see candidates + active rules.
- Drill into a candidate → see proposed rule.
- Approve → moves to active rules list.
- Prefill from Intelligence Dashboard works.

### Chunk 11: Conversation handoff card

**Prerequisites:** Chunks 1, 2, 7.

**Read first:**
- `apps/web/app/(app)/inbox/[id]/page.tsx` (existing conversation detail).
- Persona transcripts where Nat / Pim describe the handoff pain.

**Deliverable:**
- `apps/web/components/inbox/handoff-card.tsx` — banner that appears at the top of the conversation pane when `conversation.status === 'escalated_to_human'` or AI confidence dropped below threshold mid-thread:
  - Conversation history compressed to a 3-bullet summary.
  - AI's reasoning ("escalating because customer mentioned 'lawyer' in message 12").
  - Suggested reply (with confidence pill).
  - Customer memory snippets relevant to this thread.
  - "Take over" + "Send suggested" + "Edit and send" actions.
- Wire into existing inbox detail page; show only on escalated conversations.

**Verification:**
- Open an escalated mock conversation → see handoff card with all four sections.
- "Take over" hides the card; "Send suggested" sends the suggested reply.

### Chunk 12: PDPA control plane (mocked)

**Prerequisites:** Chunks 1, 2, 3.

**Read first:**
- `docs/research/2026-05-09/personas/05-clinic-chain-marketing.md` (Pong's PDPA non-negotiables).

**Deliverable:**
- `apps/web/app/(app)/settings/pdpa/page.tsx` — sectioned settings:
  - **Data residency:** TH / SG / EU radio. Show data-flow diagram for chosen region.
  - **Memory mode:** "Auto-extract" vs "Approval queue first 90 days" vs "Manual only". Toggle.
  - **Retention:** number input for days (default 30); per-data-type overrides (memory / audit log / inbox).
  - **Audit log:** scrollable table of last 200 AI actions with filter + export.
  - **DPA template:** generates a downloadable PDF (stub — fixed template).
- All actions disabled in mock mode but UI fully present.

**Verification:**
- Open `/settings/pdpa` → all 5 sections render.
- Audit log rows show fixture data with filter working.
- "Generate DPA" stub downloads a placeholder PDF.

### Chunk 13: Settings — channels + appearance

**Prerequisites:** Chunks 1, 2, 3.

**Deliverable:**
- `apps/web/app/(app)/settings/channels/page.tsx` — channel toggles (LINE OA, Shopee, Lazada, TikTok Shop, Instagram, Facebook, Email, WhatsApp). Each can be enabled/disabled per-org. Vertical preset buttons: "DTC commerce" (enables LINE+Shopee+Lazada+TikTok+IG), "Customer-ops mid-market" (enables LINE+Shopee+IG+FB+Email), "Services" (enables LINE+FB+Email), "B2B" (enables LINE+Email), "Custom".
- `apps/web/app/(app)/settings/appearance/page.tsx` — skin toggle (cockpit / daylight / "match system"), density toggle (comfortable / compact), Thai/English language preference. Persists to cookie + (Phase 5) per-user pref in DB.

**Verification:**
- Toggle a channel off → that channel hidden from Inbox chip filter.
- Vertical preset applies the right channel set.
- Skin toggle applies immediately + survives reload.

---

## Phase 4 — Validation (soft gate)

Runs in parallel with the start of Phase 5. Findings adjust the back half of Phase 5.

### Chunk 14: User validation round

**Prerequisites:** Chunks 4, 5, 8, 9, 10 (4 of 6 mocked surfaces clickable end-to-end).

**Read first:**
- `docs/research/2026-05-09/synthesis/recommendations.md` § "Run a real-user round"
- `docs/research/2026-05-09/personas/02-cs-manager-fashion.md` and `06-tutoring-marketing.md` for recruit fingerprint.

**Deliverable:**
- `docs/research/2026-05-09/validation-round/recruit.md` — list of 8–10 candidates contacted, source channel, status (contacted / declined / scheduled / interviewed). Target: 3–5 interviews.
- Recruit fingerprint: Pim-class (15–80 staff customer-ops manager, multi-channel ecom, currently using Zaapi/Manychat) and Win-class (10–30 staff service business, marketing manager / owner, using LINE OA + spreadsheets).
- `docs/research/2026-05-09/validation-round/interviews/` — one transcript per session (30 minutes, semi-structured).
- `docs/research/2026-05-09/validation-round/deltas.md` — items where real users diverged from synthetic personas. For each: severity (must-fix / should-adjust / informational) + which Phase 5 chunk it affects.

**Verification:**
- 3+ real interviews completed.
- Deltas doc lists explicit scope adjustments to Chunks 15–19, signed off by you.

---

## Phase 5 — Functional integration

Wire the mocked surfaces to real data + AI. Runs after Phase 3 mocks land. Validation findings (Chunk 14) adjust the back half of this phase.

### Chunk 15: Lesson extraction pipeline

**Prerequisites:** Chunk 8.

**Read first:**
- `packages/ai/src/memory.ts` — pattern to mirror (fact extraction, embedding, storage).
- Existing migrations under `supabase/migrations/`.
- `packages/db/src/` for schema modeling pattern.

**Deliverable:**
- `supabase/migrations/M1.5_01_lessons.sql` — new tables:
  - `lessons` (id, org_id, source_conversation_id, statement, reasoning, status, suggested_rule_id, created_by_ai, approved_by_user_id, created_at, approved_at).
  - `lesson_applications` (id, lesson_id, conversation_id, applied_at, outcome).
- `packages/ai/src/lessons.ts` — extraction function:
  - Triggered post auto-reply (alongside memory extraction).
  - Identifies generalizable patterns from team edits: "the AI suggested X, the human edited to Y" → candidate lesson.
  - Embeds and dedupes against existing lessons.
  - Inserts as `pending` for human approval.
- `apps/web/app/(app)/knowledge/lessons/[id]/route.ts` (POST handler) — approve / reject / edit endpoints.
- Update `apps/web/lib/api/client.ts` to point lesson queries at real Supabase when `NEXT_PUBLIC_USE_MOCKS !== '1'`.

**Verification:**
- Run a test conversation through auto-reply pipeline → lesson candidate appears in `/knowledge/lessons` with `pending` status.
- Approve via UI → row updates in DB.
- Aim: ≥1 valid lesson per 50 messages on real production data over a 7-day observation window.

### Chunk 16: Dashboard queries

**Prerequisites:** Chunk 9.

**Read first:**
- `packages/db/src/` for the embeddings setup (HNSW already exists per recent commits).
- `packages/ai/src/memory.ts` for the existing embedding utilities.

**Deliverable:**
- `packages/ai/src/clustering.ts` — recurring-question clustering:
  - Pulls last 30 days of inbound messages.
  - Embeds via existing Gemini embedding utility.
  - Clusters via simple agglomerative or DBSCAN.
  - Returns top N clusters with representative message + volume.
- `packages/ai/src/sentiment.ts` — sentiment scoring for inbox messages (Gemini call, batched).
- `apps/web/app/api/intelligence/route.ts` — aggregates clustering + sentiment + workload metrics for the dashboard.
- `apps/web/app/(app)/intelligence/page.tsx` switches from fixtures to real API in non-mock mode.

**Verification:**
- Dashboard against real data shows recurring questions matching what an operator would expect.
- Sentiment trend visibly responds to a known incident week.
- Cluster IDs route correctly to Configuration Advisor.

### Chunk 17: Configuration Advisor logic

**Prerequisites:** Chunks 10, 15, 16.

**Read first:**
- `packages/ai/src/auto-reply.ts` (existing confidence-gating logic) — to wire approved rules into.

**Deliverable:**
- `supabase/migrations/M1.5_02_advisor_rules.sql` — `advisor_rules` table (id, org_id, name, condition_jsonb, action_jsonb, source ['cluster' | 'lesson' | 'manual'], status ['pending' | 'active' | 'disabled'], created_at, applied_count, last_applied_at).
- `packages/ai/src/advisor.ts`:
  - `proposeRulesFromCluster(cluster)` — given a recurring-question cluster, propose a rule (condition: messages matching this intent; action: auto-reply with template).
  - `proposeRulesFromLesson(lesson)` — given an approved lesson, propose a rule.
  - `applyRules(message)` — invoked by auto-reply pipeline; if any active rule matches, override default reply with rule action.
- Wire `applyRules` into `packages/ai/src/auto-reply.ts` ahead of the Gemini call.
- `apps/web/app/api/advisor/route.ts` — CRUD for rule candidates.

**Verification:**
- Approve a candidate → moves to active.
- Send a matching test message → rule applies and reply uses rule action.
- Audit log records rule application (Chunk 18).

### Chunk 18: PDPA wiring

**Prerequisites:** Chunk 12. Can run in parallel with 15–17.

**Read first:**
- `docs/research/2026-05-09/personas/05-clinic-chain-marketing.md` for residency + retention requirements.
- Existing Supabase region setup.

**Deliverable:**
- `supabase/migrations/M1.5_03_audit_log.sql` — `audit_log` table (id, org_id, actor_type ['ai' | 'user' | 'system'], actor_id, action, resource_type, resource_id, payload_jsonb, created_at).
- `packages/ai/src/audit.ts` — `recordAction(...)` utility, called from auto-reply, memory extraction, lesson extraction, advisor rule application.
- `supabase/migrations/M1.5_04_pdpa_settings.sql` — `org_pdpa_settings` table (org_id PK, residency, memory_mode, memory_retention_days, audit_retention_days, inbox_retention_days, dpa_signed_at).
- `packages/db/src/retention-job.ts` — cron job that runs daily, deletes records past retention per org.
- `apps/web/app/api/audit/export/route.ts` — CSV/JSONL export for audit log.
- `apps/web/app/(app)/settings/pdpa/page.tsx` switches from mock to real wiring.
- Memory pipeline (`packages/ai/src/memory.ts`) respects `memory_mode === 'approval'` — writes to `pending_facts` table instead of `customer_memory` until approved.

**Verification:**
- Toggle memory mode to "approval" → new memory facts go to pending, surface in `/settings/pdpa` for approval.
- Set retention to 7 days → run retention job → records older than 7 days deleted.
- Audit log shows actions from all four AI subsystems.

### Chunk 19: Buyer-mode skin persistence

**Prerequisites:** Chunk 13.

**Deliverable:**
- `supabase/migrations/M1.5_05_user_prefs.sql` — `user_prefs` table (user_id PK, skin, density, language, updated_at).
- `apps/web/app/api/user/prefs/route.ts` — GET/PATCH for user prefs.
- `apps/web/components/skin-provider.tsx` updated: cookie default falls through to DB pref for authenticated users; pref changes write through to DB.
- Org-level default: `org_settings.default_skin` (one column added to existing org table).

**Verification:**
- Change skin in `/settings/appearance` → persists across logouts.
- New user inherits org default skin until they override.

---

## Phase 6 — Ship

### Chunk 20: Feature flag wiring

**Prerequisites:** all of Phase 5.

**Deliverable:**
- `apps/web/lib/flags.ts` — flag helper. Single flag `m15` with per-org override (`org_feature_flags` table) + global env default.
- All M1.5 surfaces guarded:
  - Routes return 404 when flag is off (or redirect to homepage).
  - Navigation entries hidden when flag is off.
  - API routes return 403 when flag is off for the requesting org.
- Admin tool: `/admin/flags/[org_id]` — toggle flag per org.

**Verification:**
- Disable `m15` for an org → all M1.5 routes return 404, nav hides entries.
- Re-enable → instant access.

### Chunk 21: Perf + a11y pass

**Prerequisites:** Chunk 20.

**Deliverable:**
- Lighthouse run on each marketing page; target ≥90 on perf + a11y + best-practices.
- Keyboard navigation audit on each in-app surface (tab order, focus states, escape closes overlays).
- Thai + English copy QA (read every string in both languages).
- Add missing `aria-label`s, fix any contrast failures (especially on the daylight skin).

**Verification:**
- Lighthouse scores documented per route.
- Manual keyboard-only walkthrough of each in-app surface succeeds.

### Chunk 22: Deploy behind flag

**Prerequisites:** Chunk 21.

**Deliverable:**
- Deploy to production with `m15` flag default-off globally.
- Enable for 2–3 design-partner orgs (recruited from validation round).
- Set up alerting: error rate, P95 latency, lesson-extraction failure rate, audit-log write rate.

**Verification:**
- Design-partner orgs can use M1.5 surfaces; other orgs see the previous experience.
- 7-day burn-in passes without P0 incidents.

---

## Risks

1. **Multi-skin retrofit cost (Chunk 1)** — current Tailwind setup may not extract cleanly into CSS vars without touching every component. Mitigation: do a 2-day spike before committing to the plan; if extraction is heavier than estimated, narrow scope to "new surfaces use tokens, existing surfaces re-skin in a follow-up."
2. **Lesson extraction quality (Chunk 15)** — at low message volumes, the auto-extracted lessons may be noisy. Mitigation: bootstrap with hand-curated lessons in fixtures; observe quality on real data for 7 days before declaring Chunk 15 done.
3. **PDPA legal review (Chunk 18)** — DPA template + residency story may need legal sign-off. Mitigation: start the legal conversation in parallel with Phase 1.
4. **User validation may invalidate scope (Chunk 14)** — if real users invalidate KB+Lessons or Intelligence Dashboard as the top features, re-prioritize. Mitigation: gate is soft; mocked work is ~30% the cost of functional work, so reordering before functional integration is cheap.
5. **Validation recruitment lag** — finding 3–5 Pim/Win-class users in 1–2 weeks is non-trivial without an existing pipeline. Mitigation: start recruitment alongside Phase 1; LINE OA partner agencies and SEA SaaS communities are best channels.

## Critical files (reference points)

- `apps/web/tailwind.config.ts` — multi-skin extension target.
- `apps/web/app/globals.css` — CSS var definitions.
- `apps/web/app/(app)/inbox/` — re-skin target + handoff card insertion.
- `apps/web/app/(marketing)/page.tsx` — homepage daylight variant.
- `packages/ai/src/memory.ts` — pattern for `lessons.ts`, `clustering.ts`, `audit.ts`.
- `packages/ai/src/auto-reply.ts` — wire advisor rule application.
- `packages/db/src/` — new schemas for lessons / audit / pdpa / user_prefs.
- `crmos360-homepage-demo.html` — design source-of-truth for cockpit skin.
- `design/explorations/README.md` — design rationale, daylight palette derived from Direction 1.
- `docs/research/2026-05-09/synthesis/` — scope justification.

## Verification (end-to-end)

Final acceptance:

- [ ] Solo demo of all 7 new surfaces in <15 minutes, end to end.
- [ ] Lighthouse ≥90 perf + a11y on each marketing page.
- [ ] Skin toggle survives reload and DB-persists for authenticated users.
- [ ] Channel-set config hides irrelevant chips on Inbox + homepage.
- [ ] Lesson pipeline produces ≥1 valid auto-lesson per 50 messages on real data over 7 days.
- [ ] Intelligence Dashboard recurring-questions widget surfaces real top clusters from production data.
- [ ] Approve a rule in Advisor → matching message in Inbox triggers the rule's action.
- [ ] PDPA: switch memory mode to "approval" → new facts hold in queue; retention job deletes past-window data.
- [ ] Audit log records actions from auto-reply + memory + lessons + advisor.
- [ ] Feature flag `m15` toggles all M1.5 surfaces on/off per org without breakage.
- [ ] Validation round: 3+ live interviews + deltas doc + at least one binding scope adjustment.
- [ ] Deploy behind flag for 2–3 design partners; 7-day burn-in clean.

After plan approval: copy this file to `docs/milestones/M1.5/build-plan.md` and start with Chunk 1.
