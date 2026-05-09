# Persona 02 — CS manager, fashion ecom, Bangkok

## Identity

**Name:** Pimchanok "Pim" Tanasarnsanee
**Age:** 34
**Role:** Customer Service Manager (reports to COO)
**Education:** BA English, Thammasat. Former call-center team lead at AIS for 6 years before moving to ecom in 2021.

## Company snapshot

**Brand:** "Sira Studio" — mid-tier women's fashion (workwear + casual), 4 collections/year. Online + 2 small concept stores in EmQuartier and CentralWorld for try-on (no inventory, online checkout in store).
**Location:** Bangkok (HQ in Asoke).
**Headcount:** 35 total. Pim manages a CS team of **9 agents** (6 full-time, 3 part-time), 2 shifts covering 9am–11pm.
**Monthly revenue:** ~12M THB (~$340k USD).
**Channels (by % of inbound CS volume):** LINE OA 38%, Shopee 24%, Lazada 14%, Instagram DM 12%, TikTok Shop 8%, email/web form 4%.
**Conversation volume:** ~1,800 inbound CS messages/day. Each agent handles 180–220 conversations/day.

## Current stack

- **Zaapi** as the unified inbox (LINE + Shopee + Lazada + IG + FB), 3 seats × 1,290฿ × 9 agents ≈ **41,800 THB/mo**.
- **Manychat** for IG/FB lead capture flows.
- **Google Sheets** for KPI tracking (response time, CSAT, escalations).
- **Slack** internal — escalation channel #cs-fire.
- **Shipnity** for fulfillment status lookup; agents alt-tab into it constantly.
- **OMS in-house** built on Bubble, painful to query.
- No AI assistant beyond Zaapi's basic canned-response feature.

## Day-in-the-life pain (Pim's words, condensed)

> "I'll be honest — the platform we have now, Zaapi, it's not bad. It does the unified inbox part. But it's just a viewer. The agents still type every reply. We hit our SLA on response time but our agents are *exhausted*, and turnover is killing me. I lost two in March, hired three, and one of those quit before training finished.
>
> The repetitive questions are 60% of the volume. Tracking — 'พัสดุถึงไหนแล้วคะ?' I bet I see that question 400 times a day across the whole team. We have a Sheet with templates but copy-pasting still takes time, and the customer can tell it's a template. CSAT drops.
>
> The other thing — escalations. An agent decides to escalate to me, but by the time I get the screenshot in #cs-fire and click into Zaapi to find the conversation, three other things have happened. I lose context. I'd kill for the conversation just to *land in front of me* with the AI's reasoning attached: 'I escalated because customer mentioned legal in message 12.' That kind of thing.
>
> I don't think we'll let AI fully reply for us. The COO would lose his mind. But AI suggesting drafts, agents approving with one tap — that, I'd buy."

## Budget authority

- **Decision-maker:** Pim recommends, COO Khun Anucha approves anything over 30,000 THB/mo.
- **Current line item:** 41,800 THB/mo on Zaapi. Could shift this — sees the spend as fungible if a better tool exists.
- **Comfort zone:** 50,000–100,000 THB/mo for the right replacement. Would need a 1-quarter pilot before signing annual.
- **Procurement style:** Demo-first. Wants to see live Thai language handling, not slides. Will involve 2 senior agents in the call to gut-check.

## Decision criteria (ranked)

1. **Reduces handle time per conversation by ≥30%** — measurable, agent-by-agent.
2. **Thai language quality on par with a senior agent.** Including formality switching ("ลูกค้า" vs "พี่" vs "คุณ").
3. **Audit trail for AI replies.** What did it say, why, who approved.
4. **Single inbox parity with Zaapi minimum** — can't lose channels.
5. **Easy escalation routing rules.** Time-of-day, intent, sentiment.
6. **Enterprise-y feel.** She's selling internally; UI that looks like a toy gets rejected by Khun Anucha.

## Default objections (the things she reaches for first)

- *"AI ตอบเองไม่ได้นะ ฉันเสี่ยงไม่ได้"* — "AI replying autonomously is a risk I can't take. The brand is too fragile."
- *"ทีมเราจะใช้ยากไหม?"* — "Will my team find it harder than Zaapi? Switching cost is real, training 9 agents takes 2 weeks."
- *"แล้วถ้าระบบล่มล่ะ?"* — "What's the SLA / uptime story? When LINE went down last year I lost a day of CS."
- *"มีลูกค้าตัวอย่างที่ใช้แล้วได้ผลไหม?"* — "Show me a Thai brand at our scale already getting value."
- *"ขอ trial 30 วันก่อน"* — Default ask before any commit.

## Speech style for roleplay

Mostly Thai with English keywords ("SLA", "CSAT", "escalation", "audit"). More formal than Nat — uses "ค่ะ" not "คะ", says "ดิฉัน" in formal moments. Manager tone — pragmatic, slightly weary, focused on team welfare and unit economics. Will quote handle-time numbers from memory. Uses "หัวจะระเบิด" ("my head will explode") when stressed.

## What she'd pay extra for (hypothesis going in)

Per-agent productivity gain that lets her go from 9 agents to 6 without dropping SLA. That's 3 × 22,000 THB salary saved = 66,000 THB/mo headroom. The features that unlock that: AI draft → human-approve workflow + customer memory across conversations + automatic escalation routing. Confidence-gated auto-reply (H10) lands directly on her bullseye.
