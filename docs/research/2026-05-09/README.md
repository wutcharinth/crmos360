# FlowAIOS — Thai Market Validation Study

**Date:** 2026-05-09
**Audience:** Thai SMB customer-operations buyers
**Method:** 8 synthetic personas × 14-question interview script × cross-persona synthesis
**Goals:** Validate (1) → Prioritize (2) → Discover (3) → Pricing (4)

## What this study tests

FlowAIOS (CRMOS360) has shipped M1.2–1.4: unified commerce inbox, AI auto-reply (confidence-gated), customer memory, LINE OA integration. Several adjacent features are planned but unbuilt. This study pressure-tests the team's positioning bets, ranks the planned feature slate, surfaces unknown needs, and probes pricing — from the perspective of eight Thai-market buyer archetypes.

## Methodology

1. **Persona roster** — eight cards spanning industry × company size × buyer role × channel mix × tech maturity. See `personas/`.
2. **Parallel synthetic interviews** — eight subagents, one per persona, each running the same 14-question script and reacting to the same hypotheses + feature slate. Transcripts in `interviews/`.
3. **Synthesis** — main thread aggregates transcripts and writes verdicts on H1–H10, a feature-prioritization matrix, discovery themes, pricing signals, and ICP narrowing recommendations. Files in `synthesis/`.

## Hypotheses under test

- **H1** — Dark ops-cockpit UI beats friendly bot UI for Thai SMB ops buyers.
- **H2** — Unified LINE + Shopee/TikTok/Lazada inbox with per-case confidence (Auto/Approval/Escalate) is the wedge.
- **H3** — Auto-extracted customer memory + AI Configuration Advisor enables self-improving ops without explicit KB setup.
- **H4** — Three-agent model (Service / Ops / Growth) is more intuitive than N-agent sprawl.
- **H5** — Product positioned as "AI OS" (Observe → Understand → Act → Learn) beats "AI chatbot" framing.
- **H6** — Warm accent (orange + mint) on dark reads as "engineering-grade + approachable" for Thai buyers.
- **H7** — Backoffice automation is table-stakes; differentiation lives in the Learning layer.
- **H8** — Thai SMB buyers are price-sensitive and demand visible density above the fold.
- **H9** — LINE OA-first + multi-channel adjacency is the right channel ordering.
- **H10** — Confidence-gated auto-reply is what unblocks Thai ops teams to trust AI on the front line.

## Feature slate (prioritization candidates)

**Shipped:** Unified Commerce Inbox · Customer Service Agent · AI Auto-Reply · Customer Memory · LINE OA integration.

**Planned (under prioritization):**
1. Operations Agent (order lookup, ticket, workflow trigger, API/webhook)
2. Growth Agent (product recommendations, promotions, follow-up)
3. AI Configuration Advisor (rules suggestions from team behavior)
4. AI Setup Assistant (guided onboarding by business type)
5. AI Workflow Builder (natural-language → executable rules)
6. Knowledge Base + Lesson System (curated KB + auto-extracted lessons)
7. Intelligence Dashboard (recurring questions, sentiment trends, bottlenecks)

## Persona index

| # | Persona | File |
|---|---|---|
| 1 | DTC beauty owner, BKK | [personas/01-dtc-beauty-owner.md](personas/01-dtc-beauty-owner.md) |
| 2 | CS manager, fashion ecom, BKK | [personas/02-cs-manager-fashion.md](personas/02-cs-manager-fashion.md) |
| 3 | Ops lead, restaurant chain, BKK | [personas/03-ops-restaurant-chain.md](personas/03-ops-restaurant-chain.md) |
| 4 | Solo F&B owner, Chiang Mai | [personas/04-solo-fnb-chiangmai.md](personas/04-solo-fnb-chiangmai.md) |
| 5 | Marketing director, clinic chain | [personas/05-clinic-chain-marketing.md](personas/05-clinic-chain-marketing.md) |
| 6 | Marketing manager, tutoring centre | [personas/06-tutoring-marketing.md](personas/06-tutoring-marketing.md) |
| 7 | Agency CEO, multi-tenant OA | [personas/07-agency-ceo.md](personas/07-agency-ceo.md) |
| 8 | CS lead, B2B distribution | [personas/08-b2b-distribution-cs.md](personas/08-b2b-distribution-cs.md) |

## Reading order

1. Skim this README.
2. Read `synthesis/recommendations.md` first (the executive read).
3. Drill down: `hypothesis-verdicts.md` → `feature-prioritization.md` → `pricing-signals.md` → `discovery.md`.
4. For evidence behind any claim, follow citations into `interviews/NN-*.md`.
5. For the persona model behind a quote, see the matching `personas/NN-*.md` card.
