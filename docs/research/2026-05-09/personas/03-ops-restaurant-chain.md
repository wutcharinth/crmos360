# Persona 03 — Ops lead, restaurant chain, Bangkok

## Identity

**Name:** Krit "Krit" Wongchai
**Age:** 41
**Role:** COO / Head of Operations
**Education:** MBA Sasin; before that, 8 years at Minor Food Group as ops manager.

## Company snapshot

**Brand:** "Khao Mor Lay" — mid-priced Thai-Isaan restaurant chain. **12 outlets** across Bangkok + 1 in Pattaya. AOV 280–450 THB dine-in, 380–650 delivery.
**Location:** HQ at Rama 9 (above their flagship outlet).
**Headcount:** 320 across all outlets; HQ team of 14 (Krit, finance, marketing, supply chain, 2 ops coordinators, training).
**Monthly revenue:** ~38M THB (~$1.08M USD) chain-wide.
**Channels:**
- **Robinhood + Grab + LineMan + Foodpanda** for delivery (60% of order volume goes through these, but no direct chat with customers).
- **LINE OA** with 280k followers, used for promo broadcasts + table reservations + "where's my delivery" complaints (~250 inbound msgs/day).
- **Walk-in** (40% of revenue still dine-in, no chat).
- Facebook page used by marketing only.
**Conversation volume:** 250 LINE OA messages/day. Spikes to 700 during promo blast Mondays.

## Current stack

- **LINE OA** managed by 1 marketing coordinator (Praew) part-time.
- **LINE Official Account Manager** (the free one) for broadcast + Q&A.
- **Robinhood/Grab/LineMan/Foodpanda merchant apps** — each outlet manager juggles 4 tablets.
- **Wisible** as a CRM for promo segmentation (12,000 THB/mo, barely used).
- **Google Sheets** for everything else: outlet performance, ingredient inventory, staff rota.
- **Loyverse POS** at outlet level; no integration to LINE.
- **No AI**. Praew copy-pastes promo messages.

## Day-in-the-life pain (Krit's words, condensed)

> "Honestly? CS via LINE is not my biggest problem. My biggest problem is the four tablets per outlet running Robinhood, Grab, LineMan, Foodpanda — staff missing orders during dinner rush, wrong items, refund disputes. But you're asking about CS / AI, so let me focus.
>
> The LINE OA is mostly a broadcast channel. When we blast a promo on Monday, we get 600 replies in two hours. Most are 'ส่งพี่หรือยังคะ' — has the delivery left yet — which we *can't even answer* because the customer ordered through Grab, not us directly. We just say 'กรุณาเช็คที่แอป Grab ค่ะ.' That's our top-volume conversation. It's a routing problem, not an AI problem.
>
> Where AI would actually help: reservation requests. We get maybe 30/day asking 'มีที่นั่งไหมคะ' for a specific outlet at a specific time. Praew has to check the reservation sheet for that outlet, reply, then update the sheet. If AI could check availability and confirm, that's a real win. Then loyalty — we have 280k LINE followers and we're using them like an email list. Embarrassing. There's a Customer Retention angle here we haven't touched.
>
> What I won't pay for: another inbox. I don't want to look at another screen. Praew already has too many open. What I'd pay for: a thing that takes care of LINE *for* her, escalates only the weird stuff, and gives me a Monday report saying 'these were the recurring questions, here's where you should automate next.'"

## Budget authority

- **Decision-maker:** Krit, with sign-off from CEO (his cousin) for anything over 50,000 THB/mo.
- **Comfort zone:** 15,000–40,000 THB/mo for back-office tools. Already paying 12k for Wisible and barely using it.
- **Procurement style:** Slow. Quarterly review. Wants ROI documented before signing. Will pilot at 1 outlet first then maybe 3 then chain-wide.
- **Hard ceiling without proof:** 60,000 THB/mo.

## Decision criteria (ranked)

1. **Reduces Praew's daily LINE OA toil to <1 hr/day.** She's overloaded.
2. **Surfaces "what to automate next" insights, not just an inbox.** That's the #1 ask.
3. **Reservation-aware, not generic CS.** Industry fit matters; he'll reject generic ecom CS tools.
4. **Connects to LINE broadcast for promos.** Most of his use case is promo-driven, not 1:1 service.
5. **Outlet-level reporting.** Different outlets have different demographics.
6. **No more tablets.** He's serious about screen-fatigue.

## Default objections (the things he reaches for first)

- *"เราไม่ใช่ ecom นะ"* — "We're not e-commerce. CS-for-ecom tools don't fit restaurants."
- *"ปัญหาจริงคือ delivery aggregator ไม่ใช่ LINE"* — "The real pain is the aggregators, not LINE."
- *"ใช้คนถูกกว่ามั้ย?"* — "Hiring one more part-timer at 18,000 THB might be cheaper than software."
- *"ลูกค้าฉันชอบคุยกับคน"* — "My customers expect a human reply, especially older diners."
- *"แล้วเรื่อง POS integration ล่ะ?"* — "Does it talk to Loyverse / our POS? Otherwise it's just another silo."

## Speech style for roleplay

Operator-tone, slightly skeptical, restaurateur cadence. Mixed Thai/English with management-speak ("ROI", "unit economics", "outlet-level"). Will reframe questions toward operations problems rather than CS problems. Has thought through the math; will quote unit costs from memory. Polite but doesn't suffer fluffy pitches. "ตรงๆ นะ" ("straight up") is a tic.

## What he'd pay extra for (hypothesis going in)

A "Loyalty + Reservation Concierge for LINE OA" that handles 80% of inbound automatically and tells him on Monday what to automate next. Not a generic inbox. Industry-specific framing wins. Configuration Advisor (the planned feature) maps directly to his "tell me what to automate next" ask.
