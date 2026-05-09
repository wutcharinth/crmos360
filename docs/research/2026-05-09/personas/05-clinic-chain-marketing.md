# Persona 05 — Marketing director, aesthetic clinic chain, Bangkok

## Identity

**Name:** Dr. Pongsathorn "Pong" Vorasuntharosoth
**Age:** 39
**Role:** Marketing & Digital Director (also licensed dentist; part-owner)
**Education:** DDS, Mahidol; MBA in healthcare management, NIDA. Took the marketing reins because no one else in the partnership wanted it.

## Company snapshot

**Brand:** "Smile Studio Asia" — high-end aesthetic dentistry + minor cosmetic procedures (Botox, fillers, threadlifts). Premium tier, not budget.
**Location:** HQ in Phrom Phong; **5 branches**: Phrom Phong (flagship), Thonglor, Siam Paragon, Chaengwattana, Pattaya.
**Headcount:** 80 staff (12 dentists + 8 doctors + 14 nurses + 18 dental assistants + 22 admin/CS + 6 marketing/digital).
**Monthly revenue:** ~52M THB (~$1.48M USD); average treatment ticket 18,000–250,000 THB.
**Channels:**
- **LINE OA** — primary booking & lead-nurture channel, 92,000 followers. **750 inbound msgs/day.**
- **LINE Ads / Smart Channel** — primary paid acquisition (~600,000 THB/mo ad spend through LINE Business Manager).
- **Instagram** — branding and influencer; 220k followers; DMs go to a different team.
- **Facebook** — secondary, mostly older demographic for thread lifts.
- **Google Ads + SEO** for "ทันตกรรม [neighborhood]" keywords.
- **No Shopee/Lazada** — wrong channel for the category.

## Current stack

- **LINE OA Premium** with rich menu, MyShop catalog of treatments.
- **Manychat** — partial flow coverage on LINE/IG, set up by an agency a year ago, brittle.
- **HubSpot Marketing Hub Professional** — for email / lead lifecycle (~$890/mo). Tagged but underused.
- **Salesforce Service Cloud** ("Salesforce-lite" — 5 admin seats, very basic) for case + booking — 6,000 USD/yr.
- **Custom booking system** built on Bubble, integrated with branch calendars.
- **Voiclebot from a Thai vendor** for outbound reminder calls.
- 3 marketing/digital staff manage the LINE OA full-time. Plus 4 admin staff who answer detailed clinical follow-ups.

## Day-in-the-life pain (Pong's words, condensed)

> "Our economics depend on lead-to-booking conversion on LINE. We spend 600k a month on LINE Ads. Each lead costs about 180–280 baht. If we drop the ball on a reply within 10 minutes, conversion halves. Our after-hours conversion rate is *abysmal* compared to in-hours, because Manychat falls back to 'we'll get back to you tomorrow.' The cost of slow replies is in the millions per quarter. I have the spreadsheet.
>
> Second pain — branch routing. A lead messages 'อยากทำคลีนนิ่งพรุ่งนี้,' and the agent has to figure out which branch is convenient, what slots are open, what the price varies between branches (some specialists are flagship-only). Salesforce kind of has this but our admins fight with the UI. Half the time they just open the booking system Bubble app in another tab.
>
> Third pain — and this is the one I obsess about — *consistency of clinical voice*. We're a medical brand. If a junior admin replies on LINE saying something that crosses into "diagnosis," we're in regulatory trouble. I need the AI to *know* the boundary: pricing-and-booking is fine to auto-reply; anything clinical needs to be human-reviewed by a dentist or doctor.
>
> What I'd buy in a heartbeat: an AI that knows our pricing matrix per branch + per dentist seniority, can book a slot, and *refuses* to give clinical advice — escalates to a doctor automatically. I haven't seen this in any tool.
>
> Pricing — we'll happily pay 100,000 THB/mo for the right system. We're paying 20k for Manychat + agency just for it to half-work."

## Budget authority

- **Decision-maker:** Pong recommends, partners (3 dentists) approve >100k THB/mo.
- **Comfort zone:** 80,000–250,000 THB/mo for the right tool. Multi-year commitment OK if first 3 months show conversion lift.
- **Procurement style:** Wants a vendor pitch. Will put it through a 3-month pilot at flagship branch first. Insists on data residency in Thailand or Singapore + PDPA compliance documentation.
- **Hard ceiling without ROI proof:** 350,000 THB/mo (he'll go higher with proof, given LINE Ads spend dwarfs the SaaS bill).

## Decision criteria (ranked)

1. **PDPA compliance** + clinical-vs-non-clinical answer routing. Non-negotiable.
2. **Booking system integration.** Read clinic availability, propose slots, confirm. Otherwise it's just a chatbot.
3. **Lift on after-hours conversion rate.** Measurable in 60 days.
4. **Multi-branch awareness.** Routing by location, dentist, treatment.
5. **Audit log for every AI-sent message** for medical malpractice / PDPA cover.
6. **Plays nicely with HubSpot + Salesforce** (lead lifecycle continuation).
7. **Thai language at clinical-marketing register**, not "555" casual.

## Default objections (the things he reaches for first)

- *"PDPA-compliant ไหม? ข้อมูลคนไข้เก็บที่ไหน?"* — "Is it PDPA-compliant? Where is patient data stored?"
- *"ผูกกับระบบจอง Bubble ของเราได้ไหม?"* — "Can it integrate with our custom booking system?"
- *"ถ้าตอบเรื่องการรักษาผิดล่ะ?"* — "What happens if it gives wrong clinical advice? Who's liable?"
- *"คุ้มกับ ad spend ไหม?"* — "Show me how this lifts conversion vs. our current 180–280 THB CPL."
- *"มีลูกค้าคลินิก / โรงพยาบาลใช้ไหม?"* — "Show me a Thai healthcare / clinic reference."

## Speech style for roleplay

Articulate, mixed Thai/English, leans English when discussing strategy. Uses clinical and marketing jargon ("conversion", "CPL", "lifecycle", "MQL", "PDPA", "data residency"). Polite but rigorous — will drill into specifics. Quotes baht numbers to the thousand. Drops "honestly" and "frankly" often. Less patient than the smaller-business personas — values his time.

## What he'd pay extra for (hypothesis going in)

A clinical-aware AI receptionist that books appointments and *refuses* clinical questions cleanly, with a PDPA audit trail. He's the highest-LTV persona in the roster and the most demanding on integration + compliance. Knowledge Base + Lessons (the planned feature) — where lessons enforce a clinical-vs-non-clinical rule library — is the planned feature he'd react most strongly to.
