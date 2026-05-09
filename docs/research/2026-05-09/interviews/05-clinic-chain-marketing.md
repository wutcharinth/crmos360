# Interview 05 — Dr. Pongsathorn "Pong" Vorasuntharosoth

**Persona:** Marketing & Digital Director (partner-dentist), Smile Studio Asia (5-branch aesthetic clinic chain, Bangkok + Pattaya)
**Date:** 2026-05-09
**Channel:** 60-min video call, Phrom Phong HQ
**Interviewer:** FlowAIOS research
**Format:** 14-question script

---

## Q1 — Walk me through yesterday's customer-ops work.

Honestly, yesterday was a Wednesday, which is one of our heavier days because Tuesday-night LINE Ads pump leads into Wednesday morning. So my day starts at 7:45 with a coffee and our "morning huddle dashboard," which is basically a Looker Studio sheet pulling from Salesforce, the Bubble booking app, and a Google Sheet our digital team maintains by hand. I look at three numbers — overnight inbound on LINE OA, after-hours conversion rate, and CPL by campaign.

Yesterday overnight we had 312 inbound LINE messages between 22:00 and 08:30. Of those, our Manychat fallback handled 287 with a "ขอบคุณค่ะ ทีมงานจะติดต่อกลับในเวลา 9:00 น." — frankly a useless reply. Of those 287, only 41 ended up booking. That's a 14% conversion. In-hours we run around 32–36%. So we left, conservatively, 60-something bookings on the floor in one night. At an average ticket of, call it, 22,000 baht, you do the math.

From 9:00 to 11:30 I was in branch-marketing review for Pattaya — they're underperforming on threadlift, I think it's a routing issue not a demand issue. Then I audited 40 random LINE conversations from Tuesday — I do this twice a week — to check how my admins are answering. Found three that crossed into clinical advice. Three too many.

Afternoon was LINE Ads optimisation with the agency, partner meeting at 16:00. Day ended 19:30. Customer-ops is honestly 60% of my actual job even though my title says "Marketing Director."

---

## Q2 — What was the worst part?

The 14% number. That's the worst part of every Wednesday. We are spending close to 600,000 THB a month on LINE Ads — that's 20,000 a day — and the bottleneck is *not* lead supply. It's that our after-hours response is a robotic apology. Every night I am, frankly, lighting between 30,000 and 50,000 baht of ad spend on fire because we cannot reply at 23:00 the way we reply at 13:00.

The second-worst part is the audit. When I find an admin saying something like "ฟันคุณน่าจะต้องถอนนะคะ" on LINE — we're a clinic, that's diagnosis-adjacent, that exposes us under the medical practitioner act *and* under PDPA if it's logged in a way we can't audit. I am the one who has to coach the admin, document it, and lose sleep about it. That's not scalable to 5 branches.

---

## Q3 — What tools are open on your screen right now?

Right now? Let me look. LINE OA Manager — always. Salesforce Service Cloud, the case console. Our Bubble booking app. HubSpot — currently the contact view for a VIP patient I'm following up on. Looker Studio for the morning dashboard. Notion for the SOP wiki. Google Sheets — the master CPL tracker. Slack. Gmail. And honestly, ChatGPT in another tab because I use it to draft Thai marketing copy and to help me think through campaign structure. That's nine tabs. On a normal day it's twelve.

The problem is none of these talk to each other properly. HubSpot has the lifecycle stage. Salesforce has the case. Bubble has the actual booking. LINE OA has the conversation. To answer "did this lead convert?" I'm cross-referencing four tools.

---

## Q4 — What did you try before that didn't work?

Three things, in order.

First — Manychat. Set up by an agency about 14 months ago, around 18,000 baht/mo plus 12,000 retainer. It does basic flows. It cannot read our Bubble booking system, cannot route by branch intelligently, and frankly its Thai NLU is brittle. If a patient writes "อยากทำคลีนนิ่งสาขาทองหล่อพรุ่งนี้บ่ายๆ" the bot misses half of that. It also has no concept of clinical-vs-non-clinical, so we hard-coded it to escalate everything that smells medical, which means it escalates *too much* and our admins drown.

Second — we tried a Thai voicebot vendor, I won't name them, for outbound reminder calls. That one we still use, costs about 8,000/mo, works fine for "เรียนคุณ X พรุ่งนี้นัดของท่านเวลา 14:00." But it's outbound only, scripted, no real AI.

Third — and this is the one that hurts — we tried Salesforce Einstein in a 90-day trial. Sales pitched us hard. The reality was the Thai language model was, honestly, embarrassing in 2025. It also assumed our data lived in Salesforce, which it doesn't — most of our patient context lives in LINE chat history and the Bubble booking app. Killed the trial. Total spend, including consultant time, was somewhere around 380,000 baht for nothing.

So — three failed attempts, roughly 600,000 baht of CAC-equivalent spend, and we're still answering at 14% after-hours conversion.

---

## Q5 — What would make tomorrow 50% easier?

One thing. An AI on LINE that, at 02:00, can read a message that says "อยากทำ Invisalign สาขาพร้อมพงษ์ ราคาเท่าไหร่ จองพรุ่งนี้ได้มั้ย" and do *all four* of:

1. Quote the correct Phrom Phong Invisalign starting price — which is 130,000 THB for our standard package, different from Pattaya which is 110,000 — without me uploading a separate price sheet for every branch
2. Check Bubble for an open Phrom Phong slot tomorrow with a dentist senior enough to do Invisalign consultation
3. Propose two slot options and tentatively hold one
4. *Refuse* to answer if the patient then asks "ฟันผมเหมาะกับ Invisalign ไหม" and instead say "อันนี้ต้องให้คุณหมอประเมินค่ะ ขอนัด consult 30 นาทีนะคะ"

That last bullet is the one nobody is solving. If something can do those four things, my after-hours conversion goes from 14% to, conservatively, 24-25%, which is — frankly — 12 to 18 million baht of additional booked revenue per year just from the night shift. That's the math. That's why I'm taking this call.

---

## Q6 — What's the cost of not solving this?

I have the spreadsheet open. Let me give you the real numbers.

After-hours window we define as 20:00–09:00, which is 13 hours, plus weekends. Inbound volume in that window is roughly 9,000 messages per month across all five branches. Conversion in that window, as I said, is 14%. In-hours conversion is 33%. So we have a delta of 19 percentage points that we are not capturing.

19% of 9,000 is 1,710 incremental bookings per month we *could* be making. Average ticket is around 22,000 THB, but the *first* booking is usually a smaller treatment — call it 14,000 — and then lifetime value is roughly 3.2x that, so call it 45,000 THB LTV per booked patient.

1,710 incremental bookings × 45,000 LTV = 76.95 million THB of LTV per month at risk. Even if I'm wrong by 50% — if the actual incremental is 800 bookings, not 1,710 — that's still 36 million baht/month of LTV we're walking past. Per quarter that's, conservatively, 100 million baht of customer LTV we leak because we cannot respond intelligently after 8 PM.

So the cost of not solving this — frankly — is somewhere between "embarrassing" and "an existential margin issue." This is why a 100,000 THB/mo SaaS bill is, to me, a rounding error. It's six hours of LINE Ads spend.

---

## Q7 — "AI OS for customer operations" — Observe → Understand → Act → Learn. Reaction?

Okay, I like the framing more than I expected to. Most vendors come in saying "AI chatbot" or "customer service automation" and I tune out within 30 seconds. "AI OS" is more honest about what's actually needed — this isn't a chatbot, it's a control plane.

The four verbs. Observe — fine, table stakes, you better be ingesting LINE, IG, our booking system. Understand — this is where most vendors fail. Understanding for me means knowing *which branch*, *which dentist tier*, *which treatment category*, *which lifecycle stage*. If "understand" just means intent classification, that's 2022 tech. Act — fine, but I want to see what verbs you support. Booking, rescheduling, escalating, sending price sheet, tagging in Salesforce — those are the verbs I care about. Learn — frankly this is the one I'm most skeptical of. Every vendor claims their AI "learns." Show me the audit log. Show me what changed last week. Show me the rule that was added because admins kept overriding the AI on threadlift inquiries.

So — directionally right framing. I'd buy the framing if the "Learn" layer is real and auditable. If "Learn" is actually a black box that quietly mutates behavior, that's a *liability* in healthcare. PDPA and medical-practitioner act don't allow black-box behavior on patient communication.

---

## Q8 — [Showing the homepage demo: dark charcoal, warm orange accent, dense terminal-style hero with 6 channel chips, 4 conversation cards, 2 intelligence cards.] Reaction?

[Long pause. Squints.]

Honestly? My first reaction is — this looks like a developer tool. It looks like a Datadog dashboard or a Grafana page. For *me*, personally, I'm fine with it. I came up reading terminals; my MBA didn't kill that. But I am not the user.

My users are 22 admin staff, average age 26, mostly women, who are very fluent in LINE OA's friendly UI and who get nervous around dense interfaces. If I put this in front of khun Ploy or khun Mint tomorrow, the first thing they say is "พี่ป้อง อันนี้มันยากไหมคะ" — "is this hard?" And the answer can't be "yes."

The orange accent — fine, energetic, distinctive. Doesn't read healthcare to me. Healthcare reads as soft white, soft teal, navy. This reads as fintech-meets-DevOps. Which might actually be a *good* contrast for differentiation in the agency-tool space, but it's a bad fit for the *brand* signal a clinic wants to project to its patient-facing staff. Although — hold on — to be fair, this isn't shown to patients. This is shown to my ops team. So maybe I'm overthinking the brand fit.

What I *do* like — the density. Six channels visible above the fold, four live conversations, two intelligence cards. That tells me you respect my time and you expect me to be operating, not browsing. That's the right stance for a tool I'd use 6 hours a day.

What I'd push back on — show me one screenshot of the *admin* UI, the screen my khun Ploy uses. The marketing site can be Grafana-dark. The admin app cannot be.

---

## Q9 — Confidence-gated auto-reply. Reaction?

[Sits forward.]

Okay. *This* is the feature. This is, frankly, the feature that maps directly onto the only thing keeping me from buying an AI receptionist — which is the clinical-vs-non-clinical boundary.

Let me tell you how I'd want it to work, and you tell me if you can build it. Three tiers — auto, approve, escalate. I want to set, at the rule level, that any message classified as "pricing inquiry," "branch question," "hours question," "treatment availability," "appointment booking," or "appointment rescheduling" goes auto, with confidence threshold I control — say 0.85. Anything classified as "clinical question," "post-treatment symptom," "medication question," "complication," anything with a body-part noun co-occurring with a symptom verb, goes *escalate* — never auto, even at confidence 0.99. And in between — vague messages, complex multi-intent — goes to "approve," meaning the AI drafts and a human one-click sends.

If the system can give me that three-tier model with rule-level overrides, *and* it logs every decision with the confidence score, the input, the rule that fired, and the human action taken — that's the audit trail I need for medical practice review and PDPA. I would sign for that today.

Caveat — I want to see the false-negative rate on clinical detection. If it misclassifies a clinical question as "pricing" and auto-replies, that's the failure mode that bankrupts a clinic. I want to see your benchmark on that, in Thai, on dental and aesthetic vocabulary specifically.

---

## Q10 — Unified inbox. Reaction?

Useful, but with caveats specific to my world.

LINE OA — yes, must-have, table stakes, this is 92% of my inbound. Instagram DMs — yes, helpful, 220k followers and our IG team is currently a separate silo so unifying that would solve a real coordination problem. Facebook — fine, secondary, mostly older patients asking about threadlifts.

Shopee, Lazada, TikTok Shop — irrelevant for me. We don't sell SKUs on marketplaces. Aesthetic dentistry is not an e-commerce category. I'd actually want to *hide* those channel chips from my admins so they don't get distracted by dashboards full of zeros.

What I actually want in the unified inbox that I haven't seen any vendor offer — *cross-channel patient identity*. If khun Somchai messages on LINE on Monday and DMs on IG on Wednesday, the system should know it's the same person. That's PDPA-sensitive, that's harder than it sounds, but that's the unification that matters to me. Channel-level unification without identity-level unification is honestly just a fancier ticket queue.

Also — phone calls. Half my high-LTV patients still call. Where does voice fit in this unified inbox? If you don't have voice, you have 70% of my pain, not 100%.

---

## Q11 — Customer memory — AI auto-extracts facts from conversations into structured profile. Reaction?

[Long pause.]

Okay. I'm going to push hard here, because this is the feature that, depending on how you've built it, is either the best thing in your roadmap or a regulatory landmine.

PDPA. Section 26, sensitive personal data. Health information is sensitive personal data under Thai PDPA, full stop. If your system is auto-extracting "patient mentioned bruxism," "patient mentioned diabetes," "patient mentioned pregnancy," and stuffing that into a structured profile — you are processing sensitive personal data, and we need explicit, granular, *purpose-bounded* consent under section 26(5) or 26(6) of PDPA. You also need a Data Protection Officer relationship and a DPIA, frankly, before we even pilot.

Specific questions. One — where is the data stored? Singapore is acceptable to me, Thailand is preferable, anywhere else is a no. AWS Bangkok region exists; are you on it? Two — who is the data controller, who is the data processor? You need to be a processor, we need to be the controller, and we need a DPA — Data Processing Agreement — that clearly says so. Three — what's your retention policy? I want to be able to delete a patient's extracted memory on request within 30 days, that's section 33 of PDPA. Four — what are you using for training? If you're using OpenAI's API and they're training on our data, that's a deal-breaker; we need a zero-retention contract. Five — encryption at rest and in transit, audit logs, access controls — table stakes.

If you can answer all five well, then *yes*, customer memory is a fantastic feature for me. Aesthetic dentistry has long lifecycles — a patient might book Invisalign, come back two years later for veneers, three years after that for a cleaning. Remembering "this patient has porcelain veneers from 2024 on teeth 11, 12, 21, 22" is *clinically valuable* and time-saving for the dentist. But that exact data is also *extremely* sensitive under PDPA and frankly under medical confidentiality norms.

So — I'd treat this feature as opt-in per patient, with a clear retention setting, and I'd want to inspect every extracted memory before it goes into the profile. Manual approval for first 90 days, then move to auto with audit. That's what I'd negotiate in the contract.

---

## Q12 — Rank these 7 planned features, 1–5, and tag would-pay-extra-for.

Let me think about this from the lens of my conversion problem.

**5 / 5 — Operations Agent.** Pay extra for. This is, for me, the closest mapping to the "AI receptionist that books slots" use case. If your Operations Agent reads our Bubble booking system, looks up availability, books a slot, and sends a calendar invite to the patient — that *is* the wedge for me. 5/5, pay extra for it, top of my list.

**5 / 5 — Knowledge Base + Lessons.** Pay extra for. I called this out in your roadmap doc as the feature I'd react most strongly to, and I stand by that. This is where I encode "Phrom Phong Invisalign price is 130,000," "Pattaya threadlift not offered on Sundays," "anything with the word 'ปวด' or 'บวม' must escalate to a doctor." Lessons that auto-learn from admin overrides — that's where the system becomes ours, not generic. Pay extra. Heavily.

**4 / 5 — Intelligence Dashboard.** Recurring questions, sentiment trends, bottlenecks. I'd use this. I currently get 60% of this from manually auditing 40 conversations twice a week. Replacing that with a real dashboard saves me roughly 4 hours a week. 4/5 — would pay a moderate premium.

**4 / 5 — Growth Agent.** Product recommendations, follow-up. Useful, especially for cross-sell — "Invisalign patient at month 8, recommend whitening." But for healthcare we have to be careful about "recommendation" — it cannot stray into "you should get this treatment," that's clinical territory. So I'd want it scoped to *administrative* nudges (rebooking reminders, treatment plan check-ins) not *clinical* nudges (recommending procedures). With that scope, 4/5.

**3 / 5 — AI Configuration Advisor.** Useful but secondary. I have a clear mental model of my rules; what I need is a fast way to *encode* them, not an AI suggesting rules I haven't thought of. Although — if it surfaces "your team is overriding the AI 40% of the time on threadlift price questions, want to add a rule?" — that's a 4/5 use case. So depends on what "advisor" actually does. 3/5 default, 4/5 if it's behavioral.

**3 / 5 — AI Setup Assistant.** Nice to have. We have the budget to do setup manually, and frankly I trust manual setup more than a wizard for the first 90 days. Would not pay extra.

**2 / 5 — AI Workflow Builder.** Natural-language to executable rules. Skeptical. NL rule editors produce ambiguous rules that fire unexpectedly, and in healthcare unexpected behavior is a liability. I'd rather have a structured rule editor with visual diff. Possibly negative if it replaces a structured editor.

So if I had to write the priority list on a napkin: **Operations Agent + Knowledge Base/Lessons** are the two I'd buy on those alone. Intelligence Dashboard and a scoped Growth Agent are nice-to-haves. The rest are 3 or below.

---

## Q13 — Expected price/mo? Trigger to sign? Deal-breaker?

**Expected price.** For a 5-branch chain, with the Operations Agent and Knowledge Base/Lessons working at clinical-grade precision in Thai — I expect to pay **120,000 to 180,000 THB per month**, all-in, probably tiered by message volume or seat count. I currently pay roughly 38,000/mo across Manychat, agency retainer, and the voicebot vendor for vastly inferior outcomes. So 4-5x that for something that actually moves my conversion is honestly fair.

I would be skeptical of anything under 50,000/mo — at that price I'd assume corner-cutting on PDPA infrastructure, which is the most expensive part to do right.

I would be skeptical of anything over 350,000/mo without an enterprise-tier ROI guarantee — which I'd negotiate as "if after-hours conversion doesn't lift by 5pp in 90 days, you refund 50%."

**Trigger to sign.** Three things. (1) A successful 90-day pilot at our flagship Phrom Phong branch with a measurable lift in after-hours conversion of at least 4pp, ideally 6pp. (2) A signed DPA with data residency in Thailand or Singapore, zero-retention with whatever LLM provider you use. (3) A reference call with at least one Thai healthcare or clinic customer at similar scale — minimum 3 branches. If I don't get the reference call, I won't sign. Frankly I'd rather wait six months and be customer #2 in healthcare than be customer #1 in healthcare for a horizontal vendor.

**Deal-breaker.** Single biggest one — data residency outside Thailand/Singapore. Second — using our patient conversation data for model training without explicit opt-in and with no opt-out path. Third — no audit log on AI decisions; I need every auto-reply to be traceable to a confidence score, a rule, an input, and a timestamp, retained for at least 5 years. Fourth — bad Thai. If your model can't handle aesthetic-dentistry vocabulary in Thai at native level, including code-switching to English for technical terms — "ขอนัด consult Invisalign" — then it doesn't matter how nice your dashboard is. Fifth and last — no integration with Bubble or webhook escape hatch. If I can't pipe slot data in and bookings out, you're a chat tool, not an ops tool.

---

## Q14 — What didn't I ask about that matters more?

Three things, in descending order of how much they keep me up at night.

**One — liability and indemnification.** You did not ask "what happens if your AI auto-replies with something that constitutes unauthorized practice of medicine and we get sued?" That is the question my partners will ask in the boardroom before they sign a 100k/mo contract. I want to know — is FlowAIOS willing to indemnify us, with a cap, for AI-driven clinical-boundary violations? Or is the contract going to be "AS IS, no warranty"? Because if it's the latter, our legal will require us to add a manual approval step to every AI-sent message, which kills the whole point. The vendors who win healthcare are the ones who put real money behind their clinical-boundary classifier.

**Two — change management for my admin team.** You asked about features and pricing but not about *adoption*. My 22 admin staff are trained on Salesforce Service Cloud and on LINE OA's native console. Asking them to switch tools is an 8-week, painful process. Do you have a co-existence mode where the AI works *inside* LINE OA Manager during a pilot, instead of forcing my team into your console on day one? That would be a huge unlock — the AI does its work, my admins keep their muscle memory, and we migrate them gradually as they trust the system. Forcing a console switch on day one is a 50-50 chance of pilot failure.

**Three — what my branches *don't* see today.** You did not ask about cross-branch insights. Right now, if a patient at Pattaya complains about a treatment, my Phrom Phong manager doesn't know. If a campaign drives 200 leads to Thonglor and they all bounce because of a routing bug, my Chaengwattana manager finds out three weeks later. A tool that surfaces cross-branch patterns — "this complaint type is up 40% across all branches in the last 14 days," or "Pattaya is converting threadlift leads at half the rate of Phrom Phong, here's the conversation-level diff" — that's something I cannot get from any tool I currently own, and frankly it might be the most strategically valuable feature you could ship for a chain like mine.

So — those three. Liability, change management, cross-branch intelligence. Add those to the conversation when you talk to other healthcare buyers and you'll close more of them.

[Looks at watch.]

I have to run to a partners' meeting. I'll genuinely take a follow-up call when you have a Thai healthcare reference and a draft DPA. Send those by email. Khob khun krub.

---
