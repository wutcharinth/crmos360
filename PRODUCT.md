# FlowAIOS — Product context

## Register

**Mixed.** Two distinct surfaces with different rules:

- **Marketing surfaces** (`/`, `/for/*`, `/pricing`) — register: **brand**. Design IS the product. Persuasion, voice, opinion. Editorial cadence allowed.
- **In-app surfaces** (`/(app)/*` — Inbox, Knowledge, Intelligence, Advisor, Settings) — register: **product**. Design SERVES the work. Density, clarity, audit. Operator-facing.

These two registers have *different* visual treatments by deliberate choice (the buyer-mode/operator-mode skin split that surfaced in the validation study). Anything that conflates them — marketing density, in-app brochure — is wrong.

## Users

Two priority personas, derived from the 8-persona Thai market validation study (`docs/research/2026-05-09/synthesis/recommendations.md`).

### Pim — CS Manager, mid-market fashion ecom (P1 ICP)
35 staff, 9-agent CS team, currently using Zaapi. Mostly Thai with English keywords. More formal than a founder. Manager tone — pragmatic, slightly weary, focused on team welfare and unit economics. Quotes handle-time numbers from memory. Worries about: brand voice consistency, agent burnout, audit trail, switching cost. ACV potential ฿65–90k/mo.

### Win — Marketing Manager, tutoring centre (P2 ICP)
25 staff, 3 branches in Bangkok. Bilingual, Gen-Z marketing fluent. Casual and breezy. Mobile-first — runs marketing from his phone half the time. Self-serve buyer, no procurement friction. Wants Sheets integration, Facebook coverage, weekly campaign-trigger insights. ACV potential ฿18–25k/mo.

Bench: Nat (DTC founder, ฿6–15k/mo) — promote to P1 if Operations Agent ships.

## Brand voice

- **Bilingual by default.** Thai primary, English keywords woven in (SLA, CSAT, audit, escalation, confidence). Don't write pure-English marketing copy then translate.
- **Direct, slightly weary, slightly amused.** This is software for people who handle 200 messages a day. Speak to them as a colleague, not as a sales deck.
- **Never "AI-powered".** Lead with what the user does, not what the AI does. "AI ตอบเองเมื่อมั่นใจ — ส่งให้ทีมรีวิวเมื่อต้องคิด" beats "AI-powered customer service automation".
- **Numbers earn their place.** When you cite a metric, cite it specifically (฿66k/mo headcount budget freed; −32% handle time; +5pp afterhours conversion). No "boost productivity 10x" claims.
- **No em dashes** in copy (per impeccable laws). Use commas, colons, semicolons, or parentheses.

## Anti-references

What FlowAIOS must **not** read like:

- **Manychat / Zaapi homepages** — bright primary colors, illustration-led, "boost your sales" energy. SEA-SaaS-circa-2018 aesthetic. Personas (Pim, Tep, Krit) explicitly reject this.
- **Datadog / Grafana** — pure cold cyberpunk dark UIs. Foreign feel, no warmth. Thai business culture rewards warmth.
- **Intercom / Zendesk** — generic enterprise SaaS cream, blue gradients, smiling-customer stock photos. Says "expensive and boring".
- **Chatbot vendors with mascot characters** — robot avatars, "say hi to your AI assistant". Corny.
- **Western YC SaaS templates** — gradient hero text, identical 3-feature cards, hero metric tile. Personas have seen these and bounce.

## Aesthetic anchor

Two skins, both brand-coherent, applied per-context:

- **Daylight** (default for marketing): editorial paper-feel light. Warm orange + restrained sage. Pentagram-meets-MUJI cadence. Thai serif accents acceptable. Source: `design/explorations/direction-1` adapted as buyer-mode.
- **Cockpit** (default for in-app): warm-dark operations console. Charcoal + warm orange + mint. Inter + JetBrains Mono. Linear/Cron coded. Source: `design/explorations/direction-3`.

Switching is per-org preference + system-aware default. Marketing surfaces should pre-emptively render daylight even when user pref is cockpit (the homepage is selling, not operating).

## Strategic principles

1. **Confidence-gating is the wedge.** H10 was validated 8/8 personas. Lead every surface with it — homepage hero, in-app inbox, agent collateral. The unified inbox is table-stakes; the wedge is *AI replies on >90% confidence, drafts on 70-90%, escalates on <70%*.
2. **Vertical specificity beats generality.** A homepage trying to sell to clinic + B2B + DTC + tutoring at once reads like none of them. Channel chips, examples, pricing emphasis must tune to the chosen vertical.
3. **PDPA is a product surface, not compliance.** Audit log, residency selector, retention controls, fact-approval queue. Live in `/settings/pdpa`. Visible in marketing.
4. **The Learning layer is the moat.** KB + Lessons + Configuration Advisor. Every approved AI reply teaches the next one. Prioritize this over Operations Agent / Growth Agent in the planned slate.
5. **Density wins for operators; density loses for buyers.** Shipping two visual treatments is non-optional. The dark cockpit is for the daily driver; the daylight is for the buyer who needs to feel the product.

## What FlowAIOS is not

- Not a chatbot builder. (Manychat is.)
- Not a generic CRM. (HubSpot is.)
- Not a CX platform with sentiment dashboards as the only feature. (Most "AI for CS" tools are.)
- Not a no-code workflow builder. (Workflow Builder is deferred; build KB/Lessons first.)
- Not for solo creators with <฿100k/mo revenue (Aoy persona deferred to free tier).

## Constraints

- **Thai-first UI.** Every English string must have a Thai translation. Sukhumvit Set / Noto Sans Thai must render cleanly at body size on both skins.
- **PDPA compliance**, including TH or SG data residency option for Pro tier and above.
- **LINE OA is the universal anchor channel.** Other channels are vertical-specific extras, not co-equal.
- **Mobile-first for owner-operator personas.** Approval flows must work on a Samsung Galaxy A54 in a kitchen.

## Source documents

- Market validation: `docs/research/2026-05-09/`
- Build plan: `docs/milestones/M1.5/build-plan.md`
- Design exploration: `design/explorations/README.md` + `direction-1` (daylight), `direction-3` (cockpit)
- Existing tokens: `apps/web/app/globals.css`
