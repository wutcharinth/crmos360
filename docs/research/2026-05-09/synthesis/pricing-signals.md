# Pricing Signals

**Source:** Q13 across all 8 personas — expected price/mo, trigger to sign, deal-breaker.

## Anchor table

| # | Persona | Comfort range | Stretch | Hard ceiling | Trigger | Deal-breaker |
|---|---|---|---|---|---|---|
| 01 | Nat (DTC beauty) | 6,000–9,000 | 15,000 | 25,000 | Credit-card signup, value visible in 7 days | English-only UI, sales call required |
| 02 | Pim (CS mgr fashion) | 65,000–90,000 | 90,000 | 90,000 | 30-day pilot, –25% AHT measured, Thai live demo, reference customer at 1.5–2.5K msg/day | No reference at her scale |
| 03 | Krit (restaurant) | 35,000–55,000 | 65,000 | 70,000 | 1-outlet pilot, monthly "automate next" report | No aggregator integration |
| 04 | Aoy (solo F&B) | 500–1,500 | 3,000 | 5,000 | PromptPay billing, ≤30-min setup, Thai-friendly UI | English-only UI, credit-card recurring |
| 05 | Pong (clinic) | 120,000–180,000 | 250,000 | 350,000 | 90-day pilot, +4–6pp afterhours conversion, signed DPA, Thai healthcare reference | No DPA, no TH/SG residency, customer #1 in healthcare |
| 06 | Win (tutoring) | 18,000–22,000 | 30,000 | 35,000 | 14-day self-serve trial, Sheets integration | Owner-principal vetoes UI / no FB DM |
| 07 | Tan (agency) | 80,000–150,000 (unlimited) **or** 5,000–7,000/client | 10,000/client | 8,000/client | Multi-tenant proof, partner/reseller program | Per-seat pricing |
| 08 | Tep (B2B) | 30,000–80,000 | 100,000 | 100,000 | SAP B1 connector live, B2B reference customer | No SAP integration, no on-prem option, customer #1 in B2B |

All figures in THB/month. Tan's "per-client" is a per-managed-client fee.

## Tier shape

Four budget bands emerge cleanly:

### Solo / micro tier — 500–3,000 THB/mo
- **Persona:** Aoy.
- **Profile:** LINE-only, sub-300k THB/mo revenue, no procurement.
- **Required to convert:** Setup Assistant, Thai-only UI, PromptPay billing, single-channel scope.
- **Ceiling:** 5,000 — beyond this requires explicit ROI proof or family-member sponsorship.

### Founder / SMB tier — 5,000–25,000 THB/mo
- **Personas:** Nat, Win.
- **Profile:** 5–35 staff, 4–12M THB/mo revenue, founder/marketing-manager decision authority.
- **Required to convert:** self-serve credit-card signup, 7–14 day trial, no sales call, value visible same week.
- **Ceiling:** 25,000–35,000 — beyond this requires owner sign-off and starts to feel "enterprise."

### Mid-market tier — 30,000–100,000 THB/mo
- **Personas:** Krit, Pim, Tep, Tan-per-client.
- **Profile:** 35–80 staff, 12–40M THB/mo revenue, manager-recommends + COO/CFO-approves.
- **Required to convert:** 30–90 day pilot, measurable success criterion, Thai live demo, ≥1 reference customer at similar scale.
- **Ceiling:** 100,000 — above this needs board-level signoff in most personas.

### Enterprise / regulated tier — 100,000–350,000 THB/mo
- **Personas:** Pong, Tan-unlimited.
- **Profile:** 80+ staff, 50M+ THB/mo, multi-stakeholder procurement, regulatory exposure.
- **Required to convert:** signed DPA, data residency (TH/SG), reference customer in *same vertical*, vendor liability indemnification, 90-day pilot with quantitative success.
- **Ceiling:** 350,000+ given the LINE Ads spend dwarfs the SaaS bill, *if* trust gates are crossed.

## Common deal-breakers (across multiple personas)

1. **English-only UI** — Aoy, Nat (also flags Thai language quality on AI replies, not just UI).
2. **Per-seat pricing** — Tan (insta-no for agencies); Pim (compounds in her 9-agent team).
3. **No PDPA / data-residency story** — Pong (hard no), Tep (Japanese clients require it).
4. **No integration of record** — Krit (aggregators), Tep (SAP B1), Pong (Bubble booking).
5. **No vertical reference customer** — Pim (her scale), Pong (healthcare), Tep (B2B distribution). The "I won't be customer #1" objection appears in 3 of 8 personas.
6. **Sales call required** — Nat, Win (self-serve buyers).
7. **Owner-principal aesthetic veto** — Win specifically; implicit in others.

## Common triggers (what flips them to yes)

1. **Time to first value under 1 week / under 30 minutes** (depending on tier) — Aoy, Nat, Win.
2. **Quantitative pilot success metric** — Pim (–25% AHT), Pong (+4–6pp afterhours conv), Krit (cost-per-conversation), Tep (lead time).
3. **Thai live demo + Thai reference customer** — Pim, Pong, Tep, Krit.
4. **Multi-tenant cockpit + partner program** — Tan.
5. **PromptPay billing option** — Aoy (and likely Krit).

## Pricing recommendations

### Packaging

A 4-tier offering:

| Tier | Range (THB/mo) | Includes | Excludes |
|---|---|---|---|
| **Starter** | 990–2,990 | LINE OA single channel, Setup Assistant, AI auto-reply (gated), customer memory, mobile-first | Multi-channel, agents framing, PDPA controls beyond defaults |
| **Growth** | 8,000–24,000 | + Multi-channel inbox (configurable channel set), Intelligence Dashboard lite, KB editor, web app | + Configuration Advisor, Workflow Builder |
| **Pro** | 35,000–95,000 | + Configuration Advisor, full Intelligence Dashboard, multi-branch awareness, audit log, Thai live support | + Custom integrations, on-prem |
| **Enterprise** | 120,000+ | + Signed DPA, TH/SG residency, vendor liability, custom integrations (SAP/booking), dedicated CSM, SOC2 docs, vertical reference program | — |

### Agency add-on

Separate SKU for Tan-class buyers: **80,000–150,000 THB/mo unlimited tier** with reseller margin (20–30%) and white-label client reports. Or per-managed-client **5,000–7,000 THB** with volume discount above 10 clients. Both must be true multi-tenant.

### Trial economics

- **Starter & Growth:** 14-day self-serve trial, no credit card. Conversion via in-app "you've saved X hours, ready to plug in?" trigger.
- **Pro:** 30-day pilot with assigned CSM and explicit success metric.
- **Enterprise:** 90-day pilot with success-criteria contract.

### What this implies

The market spans a **700x price range** (500 THB to 350,000 THB). Trying to serve all of it with one product surface is the failure mode. The personas tell a clear story: ship Starter and Pro tiers first (highest validated demand and clearest packaging contrasts), defer Enterprise until PDPA control plane and a healthcare reference customer are real, defer the agency SKU until multi-tenant architecture lands.
