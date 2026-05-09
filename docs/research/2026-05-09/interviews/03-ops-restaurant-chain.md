# Interview 03 — Krit Wongchai, COO, Khao Mor Lay

**Date:** 2026-05-09
**Persona:** Persona 03 — Ops lead, restaurant chain, Bangkok
**Interviewer:** FlowAIOS research
**Format:** 14-question script
**Setting:** Krit's HQ office above the Rama 9 flagship outlet, 3:30pm, between lunch and dinner rush.

---

## Q1 — Walk me through yesterday's customer-ops work.

ตรงๆ นะ, "customer-ops" ในร้านอาหารมันไม่เหมือน ecom. ขอเล่าจริงๆ ตามที่เกิดเมื่อวาน Wednesday.

7:30am ผมเปิด iPad ดู outlet performance ของวันก่อน — 12 outlets, four delivery aggregators each, so 48 streams of data ที่ต้องเทียบกับ Loyverse POS. Praew ส่ง LINE OA daily digest มา 8:00am — yesterday 312 inbound messages, 64% เป็น "ส่งหรือยังคะ" — ลูกค้า Grab/LineMan ที่เข้าใจผิดว่า LINE OA ของเราคือ delivery support. We literally cannot answer that. We just route to the aggregator app.

10:30am call กับ Robinhood account manager — ปัญหา commission ขึ้นจาก 25% เป็น 30% สำหรับ tier ที่เราอยู่. ผมต้องตัดสินใจว่าจะ off-board หรือเปล่า. นั่นคือ customer-ops ของจริงสำหรับผม.

ช่วง lunch rush 11:30–13:30 ผมไม่แตะ LINE OA เลย — outlet managers ส่ง LINE group photos ของ tablet ที่ค้าง, order ที่หาย, refund disputes. Three refund cases yesterday, total 2,400 บาท.

ตอนบ่าย Praew ส่งสรุป — top 5 recurring questions, reservation volume = 38 requests, conversion = 24 confirmed. นั่นแหละครับงาน CS ของผม ตรงๆ นะ ส่วนใหญ่คือ routing problem, ไม่ใช่ conversation problem.

## Q2 — What was the worst part?

ที่แย่สุดเมื่อวานคือ refund dispute ที่ Asoke outlet — ลูกค้าสั่งผ่าน Foodpanda, หม้อไฟลาบ ไม่ครบ 1 อย่าง, ลูกค้าด่าใน LINE OA ของเราเพราะหา Foodpanda support ไม่เจอ. Praew ใช้ 40 นาที reply, screenshot order ที่ไม่ใช่ของเรา, อธิบายว่า refund ต้องผ่าน Foodpanda. ลูกค้าเขียน 1-star review บน Google Maps สาขา Asoke. ตรงๆ นะ — 40 นาทีของ Praew + 1-star review = unit cost ประมาณ 800 บาท สำหรับ order ที่เราได้ commission แค่ 95 บาท.

เห็นไหม? นั่นไม่ใช่ AI problem. นั่นคือ channel architecture problem. LINE OA ของเรากำลังทำหน้าที่ delivery aggregator support โดยไม่ได้ตั้งใจ.

ส่วนที่ Praew บ่นจริงๆ ตอนเย็น — Monday promo blast 47% off lab tod week. มี 600 replies in 90 minutes. ครึ่งหนึ่งถามคำเดิม "ใช้ที่ไหนได้บ้างคะ" "หมดเขตเมื่อไหร่คะ" "delivery ด้วยมั้ยคะ" — answer อยู่ใน broadcast แต่ไม่มีใครอ่าน. Praew copy-paste reply 300+ ครั้ง. นั่นคือ toil ที่ AI น่าจะ kill ได้ภายใน week แรก. แต่ผมยังไม่ได้ลงทุน — เพราะที่ผ่านมาเครื่องมือ ecom CS มันไม่ fit. ผมไม่ใช่ ecom นะ ย้ำ.

## Q3 — What tools are open on your screen right now?

ตอนนี้บนหน้าจอผม — laptop + iPad + iPhone. นับให้ฟัง.

Laptop (MacBook): Google Sheets master tab "Outlet P&L Daily" ที่เปิดอยู่ตลอด 18 hours/day. Wisible CRM tab ที่ผมแทบไม่กดเข้า — 12,000 บาท/เดือน สูญเปล่า, ตรงๆ นะ. Gmail. Slack กับทีม HQ 14 คน. LINE Desktop ที่ Praew share หน้าจอให้ผมเห็น Official Account inbox.

iPad: Loyverse Back Office (live POS dashboard ทุก outlet), Robinhood Merchant tab.

iPhone: LINE personal — outlet manager group ทั้ง 12 สาขา + WhatsApp กับ supplier เนื้อ + email Outlook.

ที่ outlet level — แต่ละ outlet มี 4 tablets: Robinhood, Grab, LineMan, Foodpanda. Plus Loyverse POS terminal. Plus iPad reservation. นั่น 6 หน้าจอต่อสาขา. ผม serious เรื่อง screen-fatigue — staff คนนึงกำลัง flip ระหว่าง 6 device ตอน rush.

ที่ผมไม่อยากเห็นอีก: inbox อีก tab. Praew already overloaded. ที่ผมอยากเห็น: Monday morning report ใน email ที่บอกว่า "last week these 8 questions repeated 240 times, here is what to automate." นั่นแหละ ROI ผม.

## Q4 — What did you try before that didn't work?

เยอะ. ตรงๆ นะ ลองมาแล้ว 3 รอบใหญ่ๆ.

**รอบ 1 (2024):** LINE OA chatbot ของ Zwiz.AI. ตั้ง keyword reply 40 keywords. Pain — keyword matching แตกง่าย. ลูกค้าพิมพ์ "เปิดกี่โมง" vs "เปิดกี่โมงคะ" vs "วันนี้เปิดมั้ย" ระบบจับไม่ได้ครบ. Praew ต้อง maintain keyword list weekly. ใช้ 6 เดือนแล้ว off-board. เสียค่า setup 35,000 + 4,500/เดือน.

**รอบ 2 (2024 late):** Wisible CRM. คิดว่าจะใช้ segment LINE follower 280k ตามพฤติกรรมแล้ว blast เฉพาะ segment. Reality — ทีม marketing ไม่มีเวลา clean data, segment ไม่เคยถูก trigger จริง. 12,000/เดือน, ใช้แค่ promo broadcast scheduler ซึ่ง LINE Manager เปล่ามีให้ฟรี. ปัจจุบันยังจ่ายอยู่เพราะ contract — cancels Q3.

**รอบ 3 (2025):** Hire ส่วนตัว — Praew part-time + freelance CS อีกคน weekend. คิดว่า "ใช้คนถูกกว่ามั้ย?" — 18,000/เดือนต่อหัว. Reality — turnover. Freelance สองคนลาออกใน 5 เดือน. Training cost ของแต่ละคน = 2 weeks at 50% productivity. รวมแล้วเสียมากกว่า software ที่ดี.

Lesson — ไม่ใช่ software ห่วยทุกตัว, แต่ keyword bot กับ generic CRM ไม่ fit. ที่ขาดคือ tool ที่เข้าใจ context "ร้านอาหาร 12 outlets" ไม่ใช่ "online shop ทั่วไป."

## Q5 — What would make tomorrow 50% easier?

50%? ผมเล่าเป็นข้อแล้วกัน, จะได้ไม่ pitch ฟุ้ง.

**One — auto-answer 80% of LINE OA reservation questions.** "มีที่นั่งคืนนี้ Asoke 7 คน 19:30 มั้ย" — ระบบเช็ค availability sheet ของสาขา → ตอบ → จองให้ → update sheet. 30 requests/day × 4 นาที = 2 ชม. ของ Praew หายไป.

**Two — promo FAQ deflection.** Monday blast → 600 replies. ถ้าระบบจับได้ว่า "ใช้ที่ไหน, หมดเมื่อไหร่, delivery ด้วยมั้ย" แล้วตอบ instant ใน LINE OA, Praew ไม่ต้อง copy-paste 300 ครั้ง. ประหยัด ~3 ชม. ของวันจันทร์.

**Three — routing message to "go to Grab app".** อันนี้ง่ายสุด — ถ้าลูกค้าพิมพ์ "ส่งหรือยัง", auto-reply พร้อม link ของ aggregator app. 64% ของ inbound deflected immediately.

**Four — Monday digest report สำหรับผม.** "Last week recurring themes: A, B, C. Suggested automation: X. Estimated time saved: Y hours." อันนี้คือ Configuration Advisor ที่ผม heard about — ถ้าทำได้จริงคือ killer.

ทั้ง 4 ข้อ = Praew toil ลด 60–70%, ผมได้ insight ที่ไม่ต้องไล่ดู Sheet เอง. ตรงๆ นะ — ถ้าได้แค่ 3/4 ผมก็พอใจแล้ว unit-economically.

## Q6 — What's the cost of not solving this?

คิดเป็นเงินให้ฟัง.

**Praew toil:** 5 ชม./วัน × 22 วัน = 110 ชม./เดือน on LINE OA. ถ้า fully-loaded cost ของ Praew = 28,000 บาท/เดือน, นั่น = 255 บาท/ชม. Toil ที่น่า automate ~70% = 77 ชม. = ~19,500 บาท/เดือนของ wasted labor.

**Refund disputes routed wrong:** average 3 cases/day chain-wide, 30 นาทีต่อ case to resolve, plus Google review damage. หาก 1-star review ลด weekend traffic ของสาขานั้น 2%, AOV 380, ลูกค้าเฉลี่ย 280/วัน = ~2,100 บาท/วัน revenue at risk. ตัวเลขนี้ soft แต่ real.

**Reservation conversion ที่หายไป:** เรา confirm reservation 24/38 = 63%. อีก 14 หาย ส่วนใหญ่เพราะ Praew ตอบช้า. หาก reservation เฉลี่ย 4 คน × AOV 320 = 1,280 บาท. Lost: 14 × 1,280 = 17,920 บาท/วัน × 30 = 537,000/เดือน. นั่นเป็น top-line, ถ้า contribution margin 18% = 96,700 บาท/เดือนของ EBITDA หาย.

**Total cost of not solving:** conservatively 100,000+ บาท/เดือน chain-wide.

ก็เลยเหตุผลที่ผมยอมคุยกับคุณวันนี้ — ตัวเลขมัน justify ต้นทุน software ใน range 30–60k/เดือนถ้าทำได้จริง 70% ของ promise. ตรงๆ นะ ถ้าได้ครึ่งของ promise ก็ break-even แล้ว.

## Q7 — "AI OS for customer operations" — Observe → Understand → Act → Learn. Reaction?

ฟังดู MBA. ตรงๆ นะ.

"AI OS" — ผมเข้าใจ frame นี้. คุณกำลัง position ไม่ใช่ chatbot, ไม่ใช่ inbox tool, แต่เป็น operating layer. OK, ผม buy concept. แต่ buyer ส่วนใหญ่ในวงการอาหารจะไม่ get. คนรุ่นน้องที่ทำ ecom — ขายของออนไลน์ — เขาจะ get เพราะเขา live in software. คนที่ทำร้านอาหาร 20 ปี — เขาจะถามคุณ "มันคือ chatbot ใช่มะ?" ภายใน 15 วินาที.

Observe → Understand → Act → Learn — loop นี้ดี on paper. ผมชอบ "Learn" — ถ้าระบบจริงๆ learn จาก behavior แล้ว suggest config ใหม่, นั่นแก้ pain ของผมเรื่อง "บอกผมหน่อยว่าเดือนหน้าควร automate อะไร." แต่ "Observe → Understand" ในร้านอาหารแปลว่าอะไร? Observe LINE message ผมเข้าใจ. แต่ Observe Loyverse POS data ไหม? Observe Robinhood/Grab tablet ไหม? — ถ้าตอบ "ไม่" — แล้ว loop คุณก็ observed แค่ 30% ของ customer journey ผม.

Counter-suggestion — ตัด jargon. ถ้าคุณบอก outlet manager ผมว่า "AI OS" เขาจะ glaze. ถ้าคุณบอก "ระบบที่ตอบ LINE OA ให้ 80% แล้วเรียกคนเฉพาะเรื่องสำคัญ" เขาจะฟัง. Naming matters.

Net — concept ดี, framing นามธรรมไป สำหรับ buyer ผม. H5 (AI OS beats chatbot framing) — ผมจะบอกว่า partial. กับ ops buyer ใช้ได้, กับ owner-operator ทั่วไป ไม่ค่อย.

## Q8 — Dark charcoal homepage, warm orange accent, dense terminal-style hero with 6 channels + 4 conversations + 2 intelligence cards. Reaction?

โอเค ดูจริงๆ นะ.

**First reaction (6 วินาทีแรก):** "นี่คือเครื่องมือสำหรับคนที่รู้ว่าตัวเองทำอะไรอยู่." Dark UI + dense data = signal "engineering tool, not toy." ผมชอบ. Praew อาจจะกลัว — นั่นคือ trade-off คุณ.

**6 channels visible:** LINE, Shopee, TikTok, Lazada, IG, FB, email. ผม count แล้ว — ขาด aggregator. **ขาด Robinhood, Grab, LineMan, Foodpanda.** เห็นปะ? นี่คือ instant turn-off สำหรับ F&B buyer. ผม 60% ของ order volume อยู่ที่ 4 channel ที่คุณไม่มี. Shopee/Lazada ผมไม่มี seller account ด้วยซ้ำ. คุณกำลัง show channel ที่ผมใช้ 2 ใน 6, irrelevant 4. **Visual density ส่ง message ผิดให้ persona ผม.**

**4 conversations + 2 intelligence cards:** Intelligence cards คือสิ่งที่ทำให้ผมหยุดดู. ถ้า card บอก "47 reservation requests this week, 12 unconfirmed > 2hr" — ผม sold. ถ้า card บอก generic NPS หรือ sentiment — ไม่ใช่. Specificity matters.

**Orange accent on charcoal:** อ่านว่า "warm + technical." ดี. ไม่หวาน, ไม่ล้น. กับ Thai SMB ผมว่า OK — H6 partial validate. ไม่ creepy, ไม่ corporate stiff.

**H1 (dark cockpit beats friendly bot):** สำหรับ ops buyer ผม — yes, validate. แต่ persona ผมไม่ใช่ majority Thai SMB. Solo restaurant owner วัย 50 จะกลัว. ทำ landing page 2 versions มั้ย? Ops mode + Owner mode toggle?

**Net:** ถ้าเพิ่ม aggregator channels — ผม pilot. ถ้าไม่เพิ่ม — homepage บอกผมว่า "this isn't for you." ตรงๆ นะ.

## Q9 — Confidence-gated auto-reply (high → auto, medium → draft for human approval, low → escalate). Reaction?

นี่คือ feature ที่ผม buy ทันที. ตรงๆ นะ. อธิบายให้ฟัง.

ผม operate 12 outlets. ความเสี่ยงไม่ใช่ "AI ตอบช้า" ความเสี่ยงคือ "AI ตอบผิดแล้ว viral บน Pantip." Restaurant brand reputation มี asymmetric downside — 1 bad reply ไป screenshot กระจาย, 1,000 good reply ไม่มีคนพูดถึง.

3-tier confidence gate แก้ exact pain นี้ —
- **High confidence auto:** "เปิดกี่โมง" "menu มีอะไร" "ส่งทั่วกรุงเทพมั้ย" — fire ได้ ไม่ต้องคน. นั่น 60% ของ volume.
- **Medium confidence draft:** "อยากจอง 8 คน วันที่ 15 มี private room มั้ย" — draft ให้ Praew approve 1-click. นั่น 25% ของ volume แต่ต้อง human touch.
- **Low confidence escalate:** "ลาบที่ส่งมาเสียกินแล้วท้องเสียเอาเงินคืน" — escalate to manager + flag urgent. นั่น 5% แต่ 95% ของ damage.

นี่คือ **trust ladder** ที่ทำให้ผมยอมเปิด auto-reply. ถ้าไม่มี gate ผมไม่กล้า on. ถ้ามี gate ผม on ได้ Day 1 ที่ low threshold แล้วค่อยขยาย.

**Question:** ใครตั้ง threshold? ถ้า AI ตั้งเองดี — ถ้าผมต้องไปจูน slider 6 categories คือ overhead. ถ้า Configuration Advisor บอก "เดือนหน้า threshold หมวดนี้น่าจะขยับขึ้น based on 240 successful drafts" — perfect.

**H10 (confidence gating unlocks trust):** strong validate from me. นี่คือ feature ที่เปลี่ยน "AI scary" เป็น "AI controllable." Sell harder บนหน้านี้.

## Q10 — Unified inbox across LINE + Shopee + TikTok + Lazada + IG + FB + email. Match your work?

Partial match. เข้าใจตรงนี้ก่อน — unified inbox concept ดี **แต่ channel mix ของผมเป็น niche.**

**ของผม:**
- LINE OA — 95% ของ direct customer conversation. Critical.
- Email — supplier, B2B catering inquiry. ~10/day. Useful.
- Facebook — ทีม marketing เปิดเอง, comment ลูกค้าน้อย ~5/day. Nice-to-have.
- IG — เปิดแต่แทบไม่ใช้.
- **Shopee/Lazada/TikTok shop — ไม่มี seller account.** ร้านอาหารเราไม่ขายของออนไลน์. นี่ irrelevant 100%.

**ของที่ผมต้องการแต่คุณไม่ list:**
- Robinhood Merchant chat
- Grab Merchant
- LineMan Wongnai
- Foodpanda Partner

นี่คือ **4 channel ที่ generate 60% ของ order volume + 80% ของ customer-issue.** ถ้า unified inbox ของคุณรวม 4 channel นี้ — ผม **pre-order**. ถ้าไม่ — คุณกำลังขายของให้ ecom seller, ไม่ใช่ F&B operator.

ตรงๆ นะ, "unified inbox" สำหรับ F&B = aggregator inbox + LINE OA. คุณ build มาเก่ง 95% ของ ecom side แต่ blind 0% ของ F&B side.

**คำถามเชิงกลยุทธ์:** มี API access กับ Robinhood/Grab Merchant ไหม? ถ้าไม่มี — admit. แล้ว position ว่า "F&B aggregator coming Q3" ผมรอได้. แต่ถ้า roadmap ไม่มีเลย — ผมไม่ใช่ buyer ของคุณ.

**H9 (LINE-first + multi-channel adjacency):** เห็นด้วยกับ LINE-first. Adjacency ที่คุณเลือกไม่ตรง vertical ผม. SaaS market positioning issue, ไม่ใช่ product issue.

## Q11 — Customer memory — AI auto-extracts facts and surfaces them on next conversation. Useful, creepy, or both?

Both. ขึ้นกับ implementation. ตรงๆ นะ — ผมจะแยก use case ให้ฟัง.

**Useful — high value:**
- "ลูกค้าคนนี้แพ้กุ้ง" — extract from past message → flag next time order. นี่ saves serious liability. ผมยอม pay.
- "ลูกค้าคนนี้ปกติ order ทุกวันศุกร์ เวลา 18:00, ส่งคอนโด X" — re-confirm address speed up reservation flow.
- "เคย complain เรื่อง spice level สาขา Asoke" — manager เห็น banner ก่อนตอบ → empathy reply. ดี.

**Creepy — high risk:**
- "ลูกค้าคนนี้ดูจะกำลังเลิกกับแฟน เพราะลด order จาก 2 คนเป็น 1 คน 3 weeks" — เกินขอบเขต. ใครให้ AI infer life event?
- "ลูกค้าน่าจะ vegetarian based on last 3 orders" — half-creepy if surfaced as label. OK if used silently to suggest menu.
- การ extract ข้อมูล financial — "ลูกค้านี้ AOV สูง, push promo discount น้อยลง" — ethical gray.

**Practical concerns:**
- **PDPA.** Thailand PDPA strict. AI extracted facts = personal data. ต้องมี user-controllable surface ("ลูกค้าขอ export/delete").
- **Edit/override.** ผมต้องลบ fact ผิดได้ด้วย 1 click. ถ้า AI ติด label "vegan" ผิด แล้วลูกค้ามากิน เนื้อหายาก.
- **Visibility to whom?** outlet manager เห็น? Praew เห็น? ผมเห็น? ต้องมี role-based access.

**Net:** Useful > creepy ถ้า scope จำกัดที่ "operational facts" (allergy, schedule, address, complaint history) ไม่ใช่ "psychological inference." Sell on operational, hide the inference engine. **H3 partial validate** — ผม buy auto-extraction ถ้า surface UX clean + PDPA-compliant + edit-able.

## Q12 — Rank these 7 planned features 1–5; tag would-pay-extra-for.

ตรงๆ นะ ขอ rank ตามมุมมอง ops F&B 12 outlets. 1 = critical, 5 = nice-to-have.

| Feature | Rank | Pay extra? | Reason |
|---|---|---|---|
| AI Configuration Advisor | 1 | Yes | นี่คือ "Monday digest บอกผมว่าเดือนหน้า automate อะไร" — exact ask ของผม. Configuration ไม่ใช่ static rule, มัน learn จาก ops behavior. ถ้าทำได้ — game-changer. Pay extra premium tier. |
| Intelligence Dashboard | 1 | Yes | Recurring questions + bottlenecks + outlet-level breakdown. ผมต้องการแทน Google Sheet master P&L tab. ถ้า dashboard slice by outlet ได้ — pay extra. |
| Knowledge Base + Lessons | 2 | Maybe | KB ผมยอมรับว่า table-stakes. Auto-extracted lessons น่าสนใจ — "last week 3 outlets misanswered allergy question" → auto-update KB. ดี. แต่ priority รอง 1+1. |
| Operations Agent | 2 | Yes — IF aggregator | Order lookup + workflow trigger ดี. ถ้า trigger ได้ Robinhood/Grab refund flow = killer. ถ้า trigger ได้แค่ Shopee/Lazada = irrelevant ผม. Conditional pay-extra. |
| AI Workflow Builder | 3 | No | Natural-language → executable rules ฟังดูดีในงาน demo. Reality — ผมไม่ build workflow ทุกวัน. Praew ไม่ build เลย. Configuration Advisor + good defaults > workflow builder สำหรับ persona ผม. |
| Growth Agent | 4 | No | Product recommendation + promo follow-up — ผมไม่ใช่ ecom upsell. AOV ไม่ขึ้นจาก AI recommendation, มันขึ้นจาก menu engineering. Skip. |
| AI Setup Assistant | 5 | No | Onboarding tool. ใช้ครั้งเดียวแล้วทิ้ง. ไม่ pay extra เพราะไม่ recurring value. แค่ make sure setup ใช้ได้ — ไม่ต้องเป็น feature ขาย. |

**Top would-pay-extra-for:** Configuration Advisor + Intelligence Dashboard + Operations Agent (ถ้ามี aggregator integration).

**Insight ที่อยากให้คุณจด:** rank ของผมสะท้อนว่า persona ผม buy "**learning layer**" ไม่ใช่ "**execution layer**." Inbox + auto-reply = table-stakes ฟรี-ish. Premium = "tell me what to automate next." H7 (learning layer is differentiation) — strong validate from me.

## Q13 — Expected price/mo? Trigger to sign? Deal-breaker?

ตอบเป็น 3 ส่วน.

**Expected price:**
- **Pilot tier (1 outlet):** 8,000–15,000 บาท/เดือน. นี่คือ try-before-scale.
- **Chain tier (12 outlets, full features):** 35,000–55,000 บาท/เดือน. comfort zone ผม. Above 60k ต้อง CEO sign-off — slower cycle. Wisible ตอนนี้ 12k ใช้ไม่คุ้ม → ถ้า FlowAIOS ทดแทน + ทำ 5x value ก็ justified ที่ 40k.
- **Per-outlet pricing model:** 3,500–5,000 บาท/outlet/เดือน. ผม OK ถ้า scale-able. แต่ระวัง — outlet 13 ผมอาจไม่อยาก add ถ้า marginal cost สูงไป.

**Trigger to sign:**
1. **Pilot 1 outlet 30 วัน** — measurable. KPI: Praew toil ลด ≥40%, reservation conversion ขึ้น ≥15%, zero brand-incident.
2. **Aggregator integration roadmap** committed (Robinhood/Grab/LineMan/Foodpanda). ถึงไม่ launch Day 1 ก็ได้ แต่ต้องอยู่ใน Q3 commitment.
3. **PDPA compliance** documented — DPA template, audit log.
4. **Reference customer F&B chain** ใน Thailand. ถ้าไม่มี ผมเป็น customer #1 ก็ได้, แต่ขอ discount 30% pilot pricing.

**Deal-breaker:**
- ไม่มี LINE OA native API (ใช้ webhook แทน) — dealbreaker. LINE flakiness ทำผม panic.
- Pricing > 70,000 chain-wide without aggregator integration. **Overpriced for ecom-only feature set.**
- No outlet-level reporting — F&B chain ต้อง slice by outlet, ไม่งั้น insight useless.
- Vendor ที่ pivots away from F&B vertical 6 เดือนหลัง sign — switching cost สูง. Contract ผมขอ exit clause.

ตรงๆ นะ — pricing ของคุณคงอยู่ที่ 25–60k range สำหรับ chain. Sweet spot ผม 35–45k.

## Q14 — What didn't I ask about that matters more?

ดี, ขอตอบ 4 เรื่อง.

**One — POS integration.** คุณไม่ได้ถาม Loyverse, Foodpanda merchant, หรือ Robinhood. นี่คือ blind spot ของ pitch คุณ. F&B ops จริงๆ คือ "order → kitchen → delivery → review loop." LINE OA เป็น sliver ของ loop. ถ้า FlowAIOS ไม่ touch order data — คุณกำลัง automate front-of-house chat โดยที่ back-of-house ยังเป็น 4-tablet hell. คุณแก้ symptom, ไม่ใช่ disease.

**Two — outlet manager UX, not HQ UX.** คุณ design dashboard สวย — แต่คนใช้จริงคือ outlet manager วัย 35–50, มือถือ Android กลาง, working ระหว่าง rush. Dashboard ของคุณ optimize for ผมใน HQ. ถ้า 12 outlet manager ใช้ไม่ได้ — adoption fail. ถาม: mobile app native? offline mode? Thai language full? — questions คุณไม่ถาม.

**Three — onboarding cost & timeline.** Software ดีหลายตัวล้มเพราะ onboarding 8 weeks. ผมต้อง pilot 1 outlet ใน ≤2 weeks. ถ้า setup ต้อง professional services ของคุณ 100k baht — ใน budget ผมเฉือน ROI หาย. Self-serve onboarding คือ moat ที่คุณไม่ได้ถาม.

**Four — what happens when AI is wrong.** ตรงๆ นะ — ผมไม่กลัว AI พลาด, ผมกลัว AI พลาดแล้ว vendor หาย. Incident response process? SLA on AI hallucination? Refund/credit policy? Liability sharing? Mature ops vendor ตอบได้. Junior vendor หลบ.

ห้าก็พอแล้ว — ผมพูดเยอะแล้ว ใกล้ dinner rush. โทรกลับวันจันทร์ผมจะลองเปิด demo. แต่จำไว้ — channel mix ของผม + aggregator + outlet-level. ถ้าครบ 3 ผม pilot. ขาดสักอัน, generic ecom CS อีก SaaS ตัว.

---

## Interviewer field notes (out-of-character)

- **Persona's "AI OS" objection is partial-real, partial-fluff.** He understood the concept on first pass and even bought into Observe→Understand→Act→Learn — his pushback was specifically that the *language* doesn't fit owner-operator F&B buyers. Recommend keeping AI OS frame for ops/IT buyer marketing surfaces but adding a "what it does in plain Thai" tier above the fold.
- **Aggregator gap is the single biggest channel-fit blocker for F&B vertical.** Robinhood / Grab / LineMan / Foodpanda integration came up unprompted in 5 of 14 answers (Q1, Q2, Q5, Q10, Q14). For the F&B segment this is a positioning crisis, not a roadmap nice-to-have. Either build, partner, or de-prioritize F&B as ICP.
- **Configuration Advisor + Intelligence Dashboard are the wedge for this persona, not the inbox.** He treats inbox + auto-reply as table-stakes. He'd pay premium for the *learning layer*. Validates H7 strongly. The product team has been investing heavily in inbox; this persona suggests the marketing should lead with the Advisor + Dashboard.
- **Confidence-gated auto-reply is the trust unlock.** Strongest single feature reaction in the interview. He volunteered the 3-tier framework back to us in his own words and explicitly said "Day 1 I turn it on at low threshold." H10 strong validate.
- **Pricing anchor sits in the 35–55k THB/mo range for a 12-outlet chain, with a strong preference for per-outlet linear scaling and a 1-outlet pilot at ~10k.** Hard ceiling 70k without aggregator integration; with it, possibly higher. Watch the per-outlet price ladder — he hinted that marginal outlets above 12 might not get added if pricing is steep.
- **PDPA, outlet-level reporting, and POS integration are unspoken table-stakes.** He raised all three unprompted in Q14. Likely true across other Thai-market F&B and multi-location personas; cross-check in synthesis.
