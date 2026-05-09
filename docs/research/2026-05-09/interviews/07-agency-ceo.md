# Interview 07 — Tanawat "Tan" Charoensiri, Founder/CEO, Tanawat Digital

**Date:** 2026-05-09
**Persona:** [07-agency-ceo](../personas/07-agency-ceo.md)
**Format:** 14-question script
**Setting:** Founder-to-founder Zoom call, Tan dialing in from his Ekkamai office, second monitor visible behind him with a wall of LINE OA tabs.

---

**Q1 — Walk me through yesterday's customer-ops work, across 15 client orgs.**

**Tan:** ตรงๆ นะครับ — yesterday was end-of-month, so it was a circus. Two things blew up before coffee. One fashion client ran a flash sale at 8am and the Manychat flow choked on a coupon that didn't exist in their Shopify — about 180 customers got an error reply before someone caught it. Second, one F&B client's LINE OA got rate-limited because we pushed a broadcast to 40k followers without warming the API. Two of fifteen tenants on fire by 9:30am.

Normal cadence after that. 10am ops standup, 12 minutes, four AMs each report red/yellow/green on their 3–4 accounts. Yesterday three accounts were red. Client calls until 1pm — fashion client wanting to pivot AW26 launch flow, real-estate client whose agents say the LINE auto-reply sounds "เหมือนหุ่นยนต์", internal review with paid-media lead. Afternoon I review AM-built Manychat flows before they push live — across 9 clients we have ~200 active flows, every one a possible footgun.

End of day I look at margin. Yesterday I checked August numbers — retainer 1.4M MRR, tooling COGS ~65k/mo I can't cleanly bill through. That's the real story of yesterday. Not the chat, the *margin*.

Oh — และก่อนถามเรื่อง pricing นะครับ — I'm going to ask in about three minutes anyway, just flagging.

---

**Q2 — What was the worst part?**

**Tan:** The 180-customer broadcast error. Not the volume — 180 is small — but *who saw it*. The client's CMO WhatsApp'd me at 8:47am: "Tan, our customers are getting an error message with our brand on it." That's the exact thing I sell against. My pitch is "we are calmer and more competent than your in-house team." When that happens, the retainer is on the table.

The deeper worst part — I couldn't tell him *why* it broke for an hour. Manychat logs, Zaapi side, Shopify side — different dashboards, none cross-referenced. My AM had to screen-share with our dev to trace it. In an enterprise tool that's one timeline, one trace ID. In Thai-SMB-stack reality, it's three tools and a Slack thread.

Second-worst — every AM is doing the same client-by-client onboarding work. We onboarded a beauty brand last week — 38 hours. Most of it repeating things we built for the other three beauty clients in a slightly different tone. That's the problem that caps how many clients I can take. The margin killer.

---

**Q3 — What tools are open on your screen right now?**

**Tan:** Let me look. *(turns)* Eleven Chrome tabs. Slack. ClickUp. Three Manychat workspaces in different Chrome profiles because Manychat has no multi-account switcher. Zaapi multi-tenant dashboard — to be fair, Zaapi does this part well. LINE Business Manager. Shopify partner. Looker Studio with three client reports pinned. Notion. Gmail. Desktop LINE for client comms.

Second monitor is a wall of LINE OA Manager tabs — five clients open at all times so AMs can jump in if AI escalates.

So — fourteen, fifteen surfaces. The real cost isn't the tabs, it's that none of them know about each other. When a client asks "how did we do on LINE this month vs paid", I'm pulling three sources into Looker by hand.

---

**Q4 — What did you try before that didn't work?**

**Tan:** Ha. ตรงๆ — pitched probably 200 tools in three years, trialed twenty. The graveyard:

HubSpot Marketing Hub for two clients in 2023. Killed it. Per-seat per-client math doesn't work for an agency, and the LINE integration was a third-party add-on that broke every six weeks.

Salesforce Service Cloud at a bigger fashion client — the *client* wanted it, took 4 months to deploy, ripped out after we left because no one used it. Lesson: enterprise tools die in SMB hands.

Two Thai-built chatbot platforms — both went per-seat-per-account, both had the "multiple workspaces, switch with logout" problem. One had decent Thai NLP but the multi-tenant story was fake.

Tried building our own. 2024, hired a contractor — burnt 800k THB and 5 months, got 60% there, killed it. I'm not a software company. I'm an agency. I should not be building software.

Closest thing that *works* — Zaapi for 9 clients, Manychat for the rest. Neither is a cockpit. They're tools. There's no "OS".

---

**Q5 — What would make tomorrow 50% easier?**

**Tan:** Three things, in order.

One — true multi-tenant cockpit. One login, switch 15 clients with a dropdown, each fully isolated, but one inbox view if I want. That alone saves ~30 min per AM per day × 4 AMs × 22 days = 44 hours/month back. At 600 THB/hr loaded cost, 26k THB/mo just in AM time. That's the unit-economics math I do for everything.

Two — persona / tone-of-voice / flow library I build *once* and reuse across clients with overrides. Right now my fashion playbook lives in four separate Manychat workspaces, copy-pasted. If a beauty trend shifts, I update three places, forget the fourth, the fourth client's AI starts sounding off. A library with override semantics — "this client inherits 'Bangkok-fashion-Gen-Z-tone' but overrides greeting and sign-off" — that's the dream. Onboarding from 38 hours to 8. 3x more clients without growing the team. The real margin lever.

Three — client-facing monthly report the AI just *generates*. "1,247 conversations handled this month, 87% accuracy, top 5 escalations, top 3 questions we couldn't answer well." Right now AMs spend ~4 hours per client per month assembling the equivalent in Looker. Across 15 clients, 60 hours/month — almost half an FTE.

Give me those three, I pay. Pricing in a minute.

---

**Q6 — What's the cost of not solving this?**

**Tan:** Margin. Pure margin.

Retainer ~1.4M MRR, blended margin ~30% — call it 420k net before my salary. Onboarding ~38 hours per new client × loaded cost = ~23k just to get a client live. We onboard ~5 new/year because more breaks the team. That caps growth.

Tooling pass-through I can't cleanly bill — ~65k/mo across Zaapi, Manychat, Shopify reseller, Looker. ~25k/mo I'm eating because clients pushed back. 300k a year.

Client churn — we lose ~2 clients/year, mostly because their AI is "robotic" or "missed an order" — really us not having good enough memory and confidence routing. Each loss ~780k ARR. So 1.5M of churn we could potentially save.

Add it up — probably 1.8–2M THB/year of margin I'm leaving on the floor because my stack is glued together. So when a vendor says "we'll save you time," I want to know *which line item* it hits. I don't buy software for productivity. I buy for margin.

---

**Q7 — "AI OS for customer operations" — Observe → Understand → Act → Learn. Reaction?**

**Tan:** I like the framing more than I expected. Most vendors lead with "AI chatbot." Chatbot is 2019 language. AI OS sounds like infrastructure, which is closer to how I want to position to clients — "we operate your customer ops on a platform" beats "we built you a bot."

Observe → Understand → Act → Learn — that's a stack diagram, not a feature list, and I respect that. Learn is interesting because it's where my margin lives. If your platform actually learns from each client's history and gets sharper, that's a wedge against tools that need re-tuning every quarter.

ตรงๆ — concern: every vendor in 2024–2026 says "AI OS." Cresta, Decagon, Sierra in the US, three Thai players locally. If you don't have something concrete behind it, the framing is wallpaper. What does "Understand" *do* differently from what Manychat or Zaapi already do? Show me the verb, not the noun.

And — does your "OS" handle 15 tenants natively, or is it single-tenant I have to fork 15 times? That's the question that decides whether I buy.

Hold on — pricing. ราคาประมาณเท่าไหร่ต่อ tenant ครับ? File that, I'll keep going.

---

**Q8 — [Shows the homepage.] Reaction? You're an agency, you appraise design.**

**Tan:** *(scrolling)* … Hmm. Interesting. So the framing said "dark charcoal, warm orange accent, terminal hero." This is *not* that. Soft mint and lime palette, light background, paper-feel, sage-and-lime brand mark. Was there a redesign?

Reacting to what I'm actually seeing. As an agency principal evaluating whether I'd put my F&B and fashion and beauty clients behind this — soft palette is honestly easier to sell to fashion and beauty. They'd recoil from a black terminal-cockpit aesthetic. Charcoal-and-orange reads "developer tool" or "trader screen." My fashion client wants something that fits a luxe Instagram brand. Mint-and-lime is on-brand for half my book.

But — for real-estate and B2B-leaning clients, the lime might read too "consumer wellness app." So this palette helps half my clients and hurts the other half. Eternal agency problem with branded SaaS.

Density looks reasonable. Above the fold I want numbers — conversation count, accuracy, time-to-resolve, multi-tenant badge. If you bury "multi-tenant" in feature 7 of section 4, I bounce.

Dealbreaker for an agency — does the homepage hint at white-label? If I onboard a client and they Google "CRMOS360" and your homepage looks like a SaaS brand, that's friction. Want a clear "for agencies" footer link.

H6 hypothesis (warm-accent-on-dark = engineering-grade-but-approachable) — can't fully judge because what I'm seeing isn't dark. But mint + lime + sage reads "wellness SaaS" more than "engineering-grade." Friendly. Not intimidating. For SMB-end clients, that's a feature, not a bug.

---

**Q9 — Confidence-gated auto-reply. Reaction?**

**Tan:** Right shape. Auto / Approval / Escalate per-message confidence — that's how every serious vendor should be doing this in 2026. Maps cleanly to how I already staff: AI handles easy, AM approves medium, community manager handles escalation. Fits the agency model out of the box.

Two probes.

One — confidence threshold per client, not global. Fashion client wants AI to auto-reply aggressively because their voice is breezy and a wrong reply is recoverable. Real-estate client wants almost nothing to auto-fire — wrong reply about a 12M condo is reputational damage. Per-tenant thresholds, ideally per-intent within a tenant.

Two — what *signal* drives confidence? Pure model probability is weak. Better — blended with intent classification + memory match + escalation history. If a customer was previously angry, threshold auto-rises. "ร้านเปิดกี่โมง" — auto-fire at 0.6. "I want a refund and I'm angry" — never auto-fire. That policy layer is what separates a real OS from a chatbot.

If you have that — this feature alone is worth 15–20k per client/month of value. Real number I'd take to QBRs. "AI handled X% of your queries autonomously, here's the savings."

---

**Q10 — Unified inbox. Reaction? Does it scope per client?**

**Tan:** This is the question that decides whether I buy. Direct answer.

Unified inbox showing LINE + Shopee + IG + TikTok across one tenant — table stakes. Every Thai inbox tool does that. Cross-tenant superview where I, as agency principal, see all 15 client inboxes in one pane with a tenant filter — that's a wedge.

But more important than the superview — per-client *isolation* must be airtight. PDPA-existential. If a brand A customer sees a reply referencing brand B's promotion, my client list disappears overnight.

Checklist for unified inbox:
1. Per-client scope is the *default* view, not the override.
2. Cross-tenant superview exists for agency principal, with explicit role gating.
3. Customer memory keyed per-tenant — same phone number on two clients is two separate records, not merged.
4. RBAC at the tenant level — hand a specific AM access to specific tenants only.
5. Audit log per tenant.

Five boxes, real conversation. Three boxes, no.

Other thing — does the inbox respect LINE Business Manager's ad-account hierarchy? We do paid + organic together. If your inbox doesn't talk to LINE BM for ad-driven conversations, my paid-media leads still live in two tools.

---

**Q11 — Customer memory. Reaction? Data isolation between clients.**

**Tan:** Half-asked in Q10 — let me focus. Auto-extracted customer memory is great *if and only if* it's cleanly tenant-scoped. Horror scenario — Khun Aom buys from my fashion client and my beauty client, same LINE userId across both my tenants. Do you:

(a) Merge into one global customer record — wrong answer, PDPA disaster.
(b) Two separate per-tenant records that never know about each other — correct.
(c) Consented cross-tenant identity graph with explicit dual opt-in — interesting, probably not v1.

I'm betting (b). If yes, confirm it on the homepage — make it a security/compliance pillar. Thai SMB legal teams are PDPA-paranoid post-2023 enforcement. Buying signal.

Other thing — what's the schema? "Customer prefers spicy" is cute but useless to a fashion brand. Memory schema configurable per tenant? Fashion wants size/fit/brand-affinity. F&B wants dietary/allergens/visit-frequency. Real-estate wants budget/area/family-size. Global schema = toy. Per-tenant configurable with industry templates = product.

Does memory feed auto-reply context? That's the loop that makes "Learn" real. Memory feeds reply, outcome feeds memory, threshold tightens. Loop closed = moat.

---

**Q12 — Rank these 7 features 1–5; tag would-pay-extra-for.**

**Tan:** OK, thinking out loud.

- **Operations Agent** (order lookup, ticket, workflow trigger, API/webhook) — F&B and fashion need order lookup yesterday. **4.** Most I can stitch with webhooks if I have to. Would pay extra: mild yes, if per-client.

- **Growth Agent** (recommendations, promos, follow-up) — interesting but my paid-media team owns this surface. Worried about stepping on specialist workflows. **3.**

- **AI Configuration Advisor** — **4** if it works across tenants and learns my agency's house style. **3** if per-tenant only. Would pay extra if it crosses tenants under my agency umbrella with isolation preserved.

- **AI Setup Assistant** — this is the **5**. Onboarding is my single biggest cost line and growth cap. 38 hours → 8 hours unlocks ~3x growth without team expansion. **Would absolutely pay extra.** Killer feature for agencies. Don't bury it.

- **AI Workflow Builder** (NL → executable rules) — **4.** Right now AMs build flows in Manychat by hand, fine but slow. NL → rules is 30% time saver per flow. Lowers the hiring skill floor — junior AM productive in 2 weeks instead of 8.

- **Knowledge Base + Lessons** — **4 going on 5.** Half of my reusable-library dream. If lessons extract per tenant *and* I can promote a lesson to my agency-wide library to reuse across clients with consent, that's a 5. **Would pay extra** for the cross-tenant promotion mechanism — that's literally the agency moat.

- **Intelligence Dashboard** — **4** for client-facing reporting. AMs spend 4 hours/client/month assembling this in Looker. Auto-generate, brand per-tenant, I'll show in every QBR. **Would pay extra** for white-label / co-brand.

Ranking — **5:** Setup Assistant, KB+Lessons (with cross-tenant library), Intelligence Dashboard. **4:** Workflow Builder, Operations Agent, Configuration Advisor. **3:** Growth Agent.

Would-pay-extra-for cluster, priority order: (1) Setup Assistant with industry templates, (2) cross-tenant lesson promotion, (3) white-label Intelligence Dashboard.

---

**Q13 — Expected price/mo? Trigger to sign? Deal-breaker?**

**Tan:** Direct.

**Per-client:** target 5,000–7,000 THB per client/month for normal SMB, 8–10k for heavier clients. Hard ceiling 8,000 THB/client/mo at the *median* — above that, retainer math breaks. At 5–7k I pass through transparently as "tech stack" line in retainer.

**Unlimited tier (preferred):** 80,000–150,000 THB/mo unlimited. I'm at 15 clients now, growing to 25 in 18 months. At 100k/mo, effective per-client cost is 6.6k now and 4k at 25 clients — marginal client becomes nearly free. Exactly the right shape for an agency. Makes me a champion.

**Per-seat — never.** 1,500 THB per seat per workspace × 12 internal seats × 15 client workspaces = 270k/mo. Non-starter. Anyone pitching per-seat-per-workspace to agencies in 2026 hasn't done their homework. ตรงๆ.

**Trigger to sign:** Two-client paid pilot at 50% off retail for 60 days. I pick — usually one fashion, one F&B, most contrasting use cases. If AMs save measurable time and clients haven't complained about AI sounding wrong — roll out next 5 within 30 days, all 15 by month 6 if it holds.

**Deal-breakers, priority:**
1. No true multi-tenant — fake "multiple workspaces" architecture. Insta-no.
2. Cross-tenant data leak risk — even theoretical. PDPA-existential.
3. No partner / reseller program. Agencies need MDF, co-marketing, or rev share — pick one.
4. No white-label option for at least client-facing reporting layer. Even just co-brand.
5. No LINE Business Manager integration — lose half my paid-media value.

**Would negotiate:** Founder-to-founder discount as early-anchor agency partner. Case study, video testimonial, intros to two other Bangkok agency principals — exchange for 30% off year one and grandfather pricing for life. That's the agency-anchor deal. Take it or leave it. It's how Zaapi got me.

---

**Q14 — What didn't I ask about that matters more?**

**Tan:** Three things, biggest first.

**One — partner / reseller economics.** Most important thing for converting agencies into a distribution channel. Vendors who win the Thai agency segment do it through MDF + co-marketing + tiered discount + clear deal-registration. You should have a partner page within 90 days of GA. Tiers: certified agency (10% off, listed in directory), gold (20% + co-marketing, named accounts protected), platinum (30% + MDF + revenue share). I'm a one-man case study for whether your platform makes economic sense for an agency to *resell* — not just operate. If I can resell CRMOS360 to my clients at a markup with my brand on it, you've turned me from a customer into a sales channel. 10x leverage move you're not making yet.

**Two — onboarding *services*, not just the Setup Assistant.** Assistant is great for the 80% case. The 20% complex case — fashion client with custom Shopify Plus + ERP + WMS — needs either professional services from your team or a certified-implementer program where I get trained and paid to do the implementation. Without that, complex clients (the high-LTV ones) won't onboard. Also relevant — train-the-trainer for my AMs. Want my team certified on CRMOS360. Vendor lock-in for you (good), competitive moat for me (also good).

**Three — exit / data portability.** No vendor likes this question. But putting 15 clients' customer data into your platform — day one I need clean per-tenant export. PDPA gives the customer right of access, flows up to my client, flows up to me. If your data export story is "ticket support, wait two weeks," my clients' lawyers reject the contract. Build an export API per tenant, advertise it, make it boring. Counterintuitively, easy exit is a *trust* feature — lowers cost of trying you.

Smaller things briefly: per-tenant SLA, status page subscribable per client, sandbox tenant for testing before promoting to prod, webhook fan-out per tenant, multi-region data residency (Thailand-resident showing up in some clients' procurement now).

OK — brain dump done. ส่งสัญญามาดูครับ when you're ready. แต่ขอย้ำ — multi-tenant + per-client (or unlimited) pricing + reseller program. Three legs of the stool. Drop one and I won't sign no matter how good the AI is.

---

*Interview ends. Tan checks his watch, mentions a 4pm client call, asks for a one-pager and to be sent the partner-tier deck "when you have one."*
