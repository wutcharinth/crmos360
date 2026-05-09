# Feature Prioritization

**Source:** 8 synthetic interviews × 7 planned features. Each persona scored 1–5 and tagged a "would pay extra for" feature.
**Method:** Average score (impact × reach) plus count of "would pay extra" tags as a stickiness proxy.

## Matrix (planned features only)

| Feature | 01 Nat | 02 Pim | 03 Krit | 04 Aoy | 05 Pong | 06 Win | 07 Tan | 08 Tep | **Avg** | **Pay-extra count** |
|---|---|---|---|---|---|---|---|---|---|---|
| **Knowledge Base + Lessons** | 4 ★ | 4 | 4 | 4 ★ | 5 ★ | 4 | 5 ★ | 5 ★ | **4.4** | **5** |
| **Intelligence Dashboard** | 3 | 3 | 5 ★ | 1 | 4 | 5 ★ | 5 | 4 | **3.8** | **2** |
| **AI Configuration Advisor** | 4 | 3 | 5 ★ | 2 | 4 | 5 ★ | 4 | 3 | **3.8** | **2** |
| **AI Setup Assistant** | 3 | 2 | 2 | 5 ★ | 3 | 3 | 5 ★ | 3* | **3.3** | **2** |
| **Operations Agent** | 5 ★ | 4 | 2 | 1 | 5 ★ | 2 | 4 | 5 ★ | **3.5** | **3** |
| **AI Workflow Builder** | 3 | 4 ★ | 2 | 1 | 2 | 2 | 4 | 3 | **2.6** | **1** |
| **Growth Agent** | 3 | 3 | 2 | 1 | 4 | 4 | 3 | 2 | **2.8** | **0** |

★ = tagged as "would pay extra for this" by that persona.
\* = Tep's Operations-Agent and Setup-Assistant scores are conditional on B2B-Industrial-Distribution being a supported business type.

## Recommended top 3 (next milestone candidates)

### 1. Knowledge Base + Lesson System — **build first**

Highest avg (4.4). Five "would pay extra" tags — the most of any feature. Universal pull across founder, mid-market, healthcare, agency, and B2B personas.

Why it wins:
- **Pong** needs it for clinical-vs-non-clinical rule library.
- **Tep** needs it for institutional knowledge capture (the "พี่อ้อย risk").
- **Nat, Pim** see it as the audit trail / governance layer.
- **Tan** wants cross-tenant promotion of lessons across his client roster.
- **Aoy** sees the auto-lessons piece as worth the small premium.

Build implications:
- Auto-lesson extraction from team edits + approvals (already designed).
- Curated KB editor with PDPA-aware content classification.
- Lesson promotion workflow (Tan: cross-tenant; Pong: cross-branch).
- Audit log per lesson application.

### 2. Intelligence Dashboard — **build second**

Avg 3.8 with two "would pay extra" tags from the highest-budget mid-market personas (Krit, Win). Tan also rated 5.

Why it wins:
- **Krit's #1 ask** ("tell me what to automate next" on Monday) maps directly here.
- **Win** wants weekly campaign-trigger intelligence ("this is the #1 question this week").
- **Tan** wants client-facing reports he can share without manual prep.
- **Pong** wants conversion-by-time-of-day analytics.

Build implications:
- Recurring-question detection + clustering.
- Sentiment trend visualization.
- Channel + branch + agent drill-down.
- Per-tenant export for agency mode (Tan's request).
- Plain-Thai PDF export (Win's request from his owner-principal).

### 3. AI Configuration Advisor — **build third**

Avg 3.8, tied with Intelligence Dashboard. Two "would pay extra" tags (Krit, Win). Pulls slightly more for marketing-led personas; Intelligence Dashboard pulls slightly more for ops-led.

Why it wins:
- It is the *active* counterpart to the *passive* Intelligence Dashboard. Together they form a closed loop: dashboard surfaces patterns, advisor recommends rules.
- **Krit, Win** explicitly want this; the rest see it as "nice to have but not at the top."

Build implications:
- Behavior-pattern → rule-candidate engine.
- Approval workflow before auto-application.
- Tie-back to KB lessons (a rule that codifies a lesson).

## Conditional features

### Operations Agent — **vertical-conditional**

Avg 3.5 but bimodal: 5 (Nat, Pong, Tep) vs 1–2 (Krit, Aoy, Win). Verticals where it lands strong:
- DTC ecom (Nat) — order lookup, Shipnity webhook, ticket create.
- Healthcare (Pong) — booking integration with branch availability.
- B2B distribution (Tep) — SAP B1 SKU + tier-pricing lookup, quote drafting.

These three want **fundamentally different integrations.** Building one Operations Agent that serves all three requires a connector architecture, not a feature. Consider: **defer the agent label, build a connector framework instead** and pick one vertical's integration set as the first connector.

Recommendation: pick **DTC ecom** (Shipnity + Shopee + LINE Shopping) as the first connector — broadest reach in the validated ICP. Healthcare booking and SAP B1 are 6–12 month vertical investments to be deferred.

### AI Setup Assistant — **required for low-end and agency expansion**

Decisive 5★ for Aoy (her churn is pinned on setup time) and Tan (his agency margin is pinned on onboarding cost). Average 3.3 because mid-market personas don't care.

If the company is going down-market or pursuing agency partnerships, this is non-negotiable. If staying mid-market, defer.

### AI Workflow Builder — **defer for high-stakes verticals**

Avg 2.6, lowest cluster. Pim is the lone strong-tag (4★) — she'd save 4–5 hrs/wk. But Pong, Win, and others flagged liability concerns: natural-language → executable rules creates "the AI made up a workflow" risk that mid-market buyers can't accept.

Defer until KB + Lessons is mature; then build Workflow Builder as a *layer on top* of approved lessons rather than free-form NL → rules.

### Growth Agent — **defer**

Avg 2.8, **zero "would pay extra" tags.** The closest signal is Pong rating it 4 ("scoped Growth Agent — promotion timing, not unsolicited recommendations"). Win rated it 4 only as "co-pilot" not "agent." Several personas worry it would damage brand voice.

Recommendation: do not build Growth Agent as a distinct surface. Fold growth-relevant capabilities (broadcast intelligence, recurring-question → campaign trigger) into the Intelligence Dashboard instead.

## Net recommendation

Build, in order:
1. **Knowledge Base + Lessons** (universal pull, highest stickiness)
2. **Intelligence Dashboard** (mid-market budget unlock)
3. **Configuration Advisor** (closes the dashboard → rule loop)

Reframe:
- **Operations Agent** → "Connector framework" with one vertical's integrations as the first connector.
- **Growth Agent** → fold into Intelligence Dashboard.

Defer:
- **Workflow Builder** until KB + Lessons matures (rebuild as lesson-grounded, not free-NL).

Conditional:
- **Setup Assistant** if pursuing solo / agency tiers; otherwise defer.

This sequencing also moves the Learning-layer differentiator (H7) forward fastest, which is what the cross-persona signal is most clearly asking for.
