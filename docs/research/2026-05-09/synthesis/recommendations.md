# Recommendations

**Audience:** FlowAIOS founders, design + eng leads, GTM lead.
**Read order:** this file first; drill into the supporting synthesis files for evidence.

## TL;DR

1. **The wedge is confidence-gated auto-reply (H10), not the unified inbox (H2).** Lead marketing with H10. The unified inbox is table-stakes parity, not differentiation.
2. **Narrow the ICP to two personas this quarter:** Pim (mid-market CS manager, fashion ecom) and Win (marketing-led tutoring/education). Defer the long tail.
3. **Build M1.5 around the Learning layer, not the Operations layer.** Knowledge Base + Lessons → Intelligence Dashboard → Configuration Advisor. This sequence has the highest cross-persona pull and the lowest integration risk.
4. **Ship a buyer-mode skin alongside the dark cockpit.** The dark UI loses 4+ persona buyers regardless of operator preference.
5. **Treat PDPA as a product surface, not a compliance task.** It unlocks the highest-LTV personas (Pong, Tep) and is non-negotiable for them.

## ICP narrowing — pick 2 personas, defer the rest

After reviewing all 8, the two personas that combine **strong product-market fit + low procurement friction + alignment with the validated wedge + alignment with the next-build feature roadmap** are Pim and Win. Nat (founder DTC) is the strongest founder-tier candidate but requires a dedicated low-end SKU.

### Priority 1 — Pim (mid-market CS manager)

- **ACV potential:** 65,000–90,000 THB/mo.
- **Why she wins:** Validates the wedge (H10) directly, ranks the Learning-layer features (KB+Lessons, Workflow Builder) high, has a fungible SaaS budget (Zaapi 41,800/mo), willing to switch on a 30-day pilot, has authority to recommend (COO approves).
- **What she needs FlowAIOS to add:** light-mode skin for her line agents (her 9-agent team is the daily driver, not her), reference customer at her scale (1.5–2.5K msg/day), audit log for AI replies.
- **Sales motion:** Demo-first, Thai live demo, 30-day pilot with –25% AHT success metric.

### Priority 2 — Win (marketing manager, education vertical)

- **ACV potential:** 18,000–25,000 THB/mo (volume tier).
- **Why he wins:** Self-serve buyer (no procurement friction), validates Configuration Advisor + Intelligence Dashboard ranking, pulls hard for Sheets integration (cheap to ship), represents a vertical (education) that maps cleanly to other middle-tier non-ecom verticals (real estate, fitness, beauty services).
- **What he needs FlowAIOS to add:** Google Sheets integration as a first-class connector, Facebook DM coverage, Thai-language PDF reports for owner-principal review, light-mode default.
- **Sales motion:** 14-day self-serve trial, in-product upgrade trigger, no sales call.

### Priority 3 (bench) — Nat (DTC founder)

- **ACV potential:** 6,000–15,000 THB/mo.
- **Why she's bench, not P1:** Nat validates a Starter-tier product with a different sales motion (no enterprise trappings) and a vertical (DTC ecom) where Operations Agent is decisive — but Operations Agent is *not* in the recommended next-build list. If Operations Agent comes in M1.6+, promote Nat to P1.

### Defer — Pong, Tep, Tan, Krit, Aoy

Each represents real LTV but each requires a heavy investment FlowAIOS isn't ready to make:

- **Pong (clinic):** Requires PDPA control plane, healthcare reference customer, branch-aware booking, vendor liability indemnification. Massive ACV (120–350k THB) but a 12-month build to clear his trust gate. Defer; revisit Q4 once PDPA scaffolding lands.
- **Tep (B2B distribution):** Requires SAP B1 connector + multi-modal parsing + on-prem option + B2B reference. Vertical edition needed. Defer to "FlowAIOS Industrial" track.
- **Tan (agency):** Requires true multi-tenant architecture + reseller program + persona library. Strategic distribution play but a year-2 motion. Scope a multi-tenant spike now to avoid retrofit pain later.
- **Krit (restaurant chain):** Pain real, but the actual unlock is aggregator integrations (Grab/Robinhood/LineMan/Foodpanda), not the current feature slate. Defer F&B vertical until aggregator gateway lands.
- **Aoy (solo):** Free or sub-1,500 tier. Below break-even for paid GTM. Serve via self-serve free / community tier when bandwidth allows.

## Recommended next milestone — M1.5 shape

Built directly on the prioritization matrix and discovery threads:

### Core build (must ship)

1. **Knowledge Base + Lesson System** — highest avg score (4.4), 5 of 8 "would pay extra" tags. Ships the Learning-layer differentiator (H7).
2. **Intelligence Dashboard** — second-highest pull, unlocks Krit/Win/Tan/Pong tier in messaging.
3. **AI Configuration Advisor** — closes the dashboard → rule loop. Cheapest of the three to build incrementally on top of #1 and #2.
4. **Conversation handoff card** (discovered) — Nat's Q14, Pim's #1 ops pain. Cheap; addresses two ICP personas directly.

### Trust + fit (must ship to unblock revenue)

5. **PDPA control plane** — per-org data residency selection, fact-approval queue mode, retention controls, exportable audit log, DPA template. Unlocks Pong-class deals later but is required for *every* persona's risk-team review today.
6. **Buyer-mode skin** — light-mode alongside the dark Operations Cockpit, with a per-org daily-driver theme override. Removes the H1/H6 buyer-veto risk.
7. **Channel-set-per-vertical config** — let users hide non-relevant channels. Removes the H9 "this isn't for me" friction.

### Defer / spike

- **Operations Agent** — reframe as a connector framework. Defer the agent label; build one connector (DTC ecom: Shipnity + Shopee + LINE Shopping) as the first concrete connector. Promotes Nat to P1.
- **Workflow Builder** — defer; rebuild on top of approved lessons rather than free-NL.
- **Growth Agent** — fold into Intelligence Dashboard.
- **Multi-tenant architecture** — design spike now, build later.
- **Aggregator gateway** (F&B) — future vertical investment.
- **SAP B1 connector** — future vertical investment.

## Marketing + positioning shifts

1. **Lead with confidence-gated auto-reply (H10)** as the headline wedge. Eight of 8 personas validated this; nothing else in the study had unanimous validation.
2. **Drop "AI OS" as the universal frame.** Keep it for mid-market+; ship a parallel "AI staff that handles your LINE OA" frame for the founder/solo tier.
3. **Vertical-aware landing pages.** A single homepage trying to speak to ecom + clinic + B2B + agency reads like none of them. Three landing pages (DTC commerce / Customer-ops mid-market / Agency partners) cover the priority ICPs.
4. **Soften the dark cockpit on the marketing surface.** The dark UI can be a section ("see the cockpit"), not the hero. Hero should match the buyer's brand context, not the operator's.

## Pricing — packaging shift

Current packaging is implicit / unclear. Recommendation: **publish four tiers** (see [pricing-signals.md](pricing-signals.md)):

| Tier | THB/mo | Anchor persona |
|---|---|---|
| Starter | 990–2,990 | Aoy (long-tail / community tier) |
| Growth | 8,000–24,000 | Nat, Win |
| Pro | 35,000–95,000 | Pim, Krit, Tep (without SAP), Tan-per-client |
| Enterprise | 120,000+ | Pong, Tan-unlimited |

Plus an **Agency** add-on at 80,000–150,000 THB/mo unlimited or 5,000–7,000 THB/managed-client (year 2 SKU).

**Insta-no:** per-seat pricing kills agencies (Tan), compounds for ops teams (Pim).

## Risks called out by the study (not yet addressed)

1. **The brand-buyer / operator-buyer split is real and not solved.** Personas reject the dark UI in buyer contexts even when their operators would love it. Architecturally, this means design tokens must support multi-skin from day one — a retrofit is far costlier.
2. **PDPA is a deal gate, not a feature.** Even mid-market personas who didn't volunteer PDPA will fail their internal risk review without it.
3. **Vertical reference customer** is a 3-of-8 deal-blocker. Without one in each ICP vertical, the highest-LTV deals stall. Recommend signing one paid pilot per priority vertical *as a marketing asset* before scaling sales.
4. **Aggregator gap (F&B) and ERP gap (B2B)** are real verticals' real pains. Each is a 6–12 month build. Choose deliberately when to enter them.
5. **The 700x price-range market** cannot be served with one product surface. The Starter and Pro tiers must feel like distinct products, not the same product with feature flags.

## What to do next week

1. **Lock the M1.5 scope** to: KB+Lessons → Intelligence Dashboard → Configuration Advisor → handoff card → PDPA scaffolding → buyer-mode skin → channel-set config. (3 features + 4 fit improvements.)
2. **Cut the homepage roster** of features visible. Show H10 (confidence-gated reply) as the hero. Hide non-relevant channels. Add a vertical chooser ("which best describes you?").
3. **Plan a Pim-style pilot:** identify 2–3 mid-market fashion / beauty / lifestyle ecom CS managers to pilot M1.5 against. Pim's profile (35 staff, 9 CS agents, Zaapi incumbent) is the fingerprint to recruit against.
4. **Spike the multi-tenant data model** even if not building Tan's SKU yet. The retrofit risk in 6 months is large.
5. **Draft a PDPA control-plane PRD.** Even if the build slips, the messaging needs to exist.
6. **Run a real-user round** of this study against 4–5 actual Thai SMB ops managers to validate or invalidate the synthetic findings before locking M1.5. Synthetic personas are good for hypothesis ranking; live users are needed for the final commit.
