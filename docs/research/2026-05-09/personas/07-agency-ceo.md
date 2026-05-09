# Persona 07 — Agency CEO running multi-tenant LINE OA, Bangkok

## Identity

**Name:** Tanawat "Tan" Charoensiri
**Age:** 36
**Role:** Founder & CEO
**Education:** BBA Marketing, ABAC; 7 years at a digital agency, then started his own boutique in 2019.

## Company snapshot

**Agency:** "Tanawat Digital" — boutique LINE OA + e-commerce ops agency. They operate LINE OA accounts on behalf of clients (community management + paid ads + flow design + occasional CS coverage).
**Location:** Bangkok (Ekkamai office).
**Headcount:** 12 (Tan + ops director + 4 account managers + 4 community managers + 2 paid-media specialists).
**Clients:** **15 active SMB clients**, mostly in fashion (4), beauty (3), F&B (2), real estate (3), fitness/wellness (2), pet products (1). Average client spend with the agency: 65,000 THB/mo retainer + paid media managed on top.
**Monthly revenue:** ~1.4M THB (~$40k USD) retainer; another 4M passes through as paid-media management.
**Channels managed for clients:** Almost all LINE OA-anchored, with Shopee + IG layered on for ecom clients.
**Conversation volume across all clients:** ~3,200 LINE OA messages/day combined.

## Current stack

- **Zaapi** at multi-tenant tier — 3,500 THB/mo per client × 9 clients ≈ **31,500 THB/mo**. Other 6 clients use clients' own LINE OA tools.
- **Manychat** Pro × multiple workspaces. Painful licensing.
- **ClickUp** for client task management.
- **Looker Studio** dashboards per client (Tan built these).
- **LINE Business Manager** for ad accounts (multi-client agency role).
- **Shopify partner / Shopify Plus reseller** for ecom clients.
- **Google Workspace + Slack + Notion** for internal ops.

## Day-in-the-life pain (Tan's words, condensed)

> "I'm running 15 LINE OA accounts simultaneously. Every tool I use either makes me create 15 separate workspaces — pain to manage, pain to bill — or charges me per-seat per-account, which compounds to a number that doesn't make sense for my margins.
>
> What I really need is a true multi-tenant cockpit. One login for me, switchable between 15 client orgs. Each client's data isolated. Per-client branding (so when I onboard a new client, the AI's voice matches their tone). Per-client billing if I want to pass it through, or bundled if I want to absorb it.
>
> I'd also love to *show* clients the AI working. A monthly client-facing report: 'this month AI handled 1,200 conversations for you, 87% accuracy, here are the top 5 escalations.' Right now my account managers piece this together in Looker Studio every month, and it's manual and inconsistent.
>
> The killer feature would be 'agency mode' — where I can build a flow / persona / tone-of-voice library *once* and reuse across clients with tweaks. Right now every client onboarding is ~40 hours of repetitive setup. If I can cut that to 8 hours, I can take 3x more clients without growing the team.
>
> Pricing — I'd pay 80,000–150,000 THB/mo for an unlimited-client tier, or 5,000–10,000 THB per client per month if it's per-tenant. The 'per client per seat' models that most US SaaS use kill agency economics."

## Budget authority

- **Decision-maker:** Tan, full discretion. Profit-margin sensitive (his retainer model is ~30% margin).
- **Comfort zone:** 80,000–150,000 THB/mo unlimited-tier or 5–10k/client.
- **Procurement style:** Prefers founder-to-founder calls. Will pilot with 2 clients before rolling out. Wants a partner / reseller program.
- **Hard ceiling on per-client SaaS:** 8,000 THB/client/mo (above this his margin shrinks).

## Decision criteria (ranked)

1. **True multi-tenant** — single login, switchable, isolated client data, per-client config.
2. **Reusable persona / tone library** across clients with overrides.
3. **Client-facing reporting** he can share monthly without manual prep.
4. **Reseller / partner economics** — discount, white-label, or commissions.
5. **PDPA + data isolation between clients.** Cross-tenant leak is an existential risk.
6. **Fast onboarding for new clients** — under 1 day of agency time.
7. **Plays nice with LINE Business Manager** (ad-account-level integration).

## Default objections (the things he reaches for first)

- *"คิดเงินยังไงคะ? ต่อ client หรือต่อ seat?"* — "How does pricing work — per client or per seat? Per-seat dies for agencies."
- *"Multi-tenant แท้หรือเปล่า? ไม่ใช่ workspace เก๊"* — "Is it true multi-tenant or just multiple workspaces hacked together?"
- *"มี white-label option ไหม?"* — "Can I white-label it under my agency brand?"
- *"data ของลูกค้าแต่ละราย แยกขาดจากกันจริงไหม?"* — "Is client data truly isolated? PDPA + reputational risk."
- *"มี partner/reseller program ไหม?"* — "Do you have a partner program — discount, MDF?"

## Speech style for roleplay

Bilingual, agency-savvy, slightly suspicious of vendor pitches because he's been pitched 200 times. Mixes Thai/English freely with marketing/tech jargon. Will reframe pitches in terms of his unit economics. Direct, slightly transactional. "ตรงๆ นะครับ" ("straight up"). Throws around "client", "retainer", "MRR", "margin". Will probe pricing within first 3 minutes.

## What he'd pay extra for (hypothesis going in)

True multi-tenant + reusable persona library + white-label reporting. A native multi-tenant story is a sticky moat for FlowAIOS — Tan's segment is small in absolute count but represents 10–20x downstream client reach per agency signed. He'd be a stress-test on whether the platform is built single-tenant-first (most are) or multi-tenant-first.
