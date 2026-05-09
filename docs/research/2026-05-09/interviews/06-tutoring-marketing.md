# Interview 06 — Wasin "Win" Sittiporn

**Persona:** Marketing Manager, FutureMind Academy (3-branch tutoring centre, Bangkok, ~25 staff, ~4.5M THB/mo)
**Date:** 2026-05-09
**Interviewer:** FlowAIOS research team
**Mode:** Synthetic interview, persona roleplay
**Setting:** Voice-call over LINE, Win is on his phone walking back from a TikTok shoot at the Sukhumvit branch

---

## Q1 — Walk me through yesterday's customer-ops work.

โอเค เล่าให้ฟังเลยนะพี่ เมื่อวานนี้คือเป็นวันอังคาร weekly recap day ของผม ตื่นมา 8 โมง เปิด LINE OA ก่อนกาแฟ มี notification ค้างอยู่ 73 อัน — โอเค normal สำหรับเช้าวันอังคาร March cycle.

จากนั้น flow มันเป็นแบบนี้ครับ — เปิด Manychat dashboard ดูว่า bot จับ lead กี่คนเมื่อคืน ได้ 22 คน in ~7 hours ของช่วงนอนของผม. แล้วก็ scroll ดูว่า bot fall over ตรงไหนบ้าง — เจอเลย 4 เคสที่ผู้ปกครองถามว่า "ลูกอยู่ ม.5 สาย sci ควรลง TGAT รอบนี้หรือรอ summer ดีกว่า" — bot ก็ตอบ generic course schedule กลับไป ซึ่งคือผิด context เลย ผู้ปกครองหายไป.

หลังจากนั้นเปิด Sheets ครับ "FM_Catalog_2026" ของผม update ราคาคอร์ส IB summer intensive ให้ Bam (Bam คือน้อง admin คนเก่งสุดในทีม) แล้ว Bam ก็ต้องไปไล่ paste ใส่ Manychat flow ทีละ node manual. กินเวลา 40 นาที สำหรับการ update ราคาคอร์สเดียว.

ช่วงบ่าย — Facebook ads campaign สำหรับ TGAT batch ใหม่ ผมเปิด Business Suite ดู DM inbox มี 35 DM เข้ามาตั้งแต่เที่ยง ทุก DM ต้อง manual reply เพราะ Manychat ไม่ครอบ FB. แล้วก็ TikTok Live Q&A ตอน 8 โมงเย็น 1.2k viewers, mention course price 6 ครั้ง, comments ถามต่อใน LINE OA อีก ~80 ข้อความ.

จบวัน 10 โมงครึ่ง ก่อนนอนยัง reply LINE อยู่ใน Apple Watch เลยพี่.

## Q2 — What was the worst part?

The Sheets-to-Manychat sync ครับ. อันนี้แหละ painful ที่สุด.

คือ catalog ของเราอยู่ใน Google Sheets — 120 rows ของคอร์ส, schedule, ราคา, ห้อง, ครู. ทุกครั้งที่ราคาขยับ หรือเปิดรอบใหม่ Bam ต้องไปแก้ Manychat flow ตามด้วยมือ. แล้ว Manychat flow ของเรามี ~40 nodes ทำให้พลาดง่ายมาก.

last month ครับ เคยเกิด incident — ราคา TPAT คอร์สใน Sheets คือ 32,000 แต่ใน Manychat bot ยัง quote 28,000 อยู่ ผู้ปกครองมา walk-in pay ตามที่ bot บอก แล้ว front desk ต้องอธิบายว่าราคาขึ้นแล้ว — embarrassing มาก คุณวิชุดา (เจ้าของ) โกรธ. honor ราคาเก่าให้ลูกค้าไป ขาดไป 4,000 บาท. เรื่องเล็กมั้ย? ใช่. preventable มั้ย? ใช่ ถ้า bot อ่าน Sheets โดยตรงได้.

ส่วนที่ 2 ที่ painful คือ FB DM coverage. Manychat plan ของเราไม่ครอบ FB เต็ม — ต้องจ่ายเพิ่มอีก tier และ flow ของ FB ก็ต้อง rebuild. Bam reply manual หมดเลย ~80 DM ต่อวัน. เสียเวลา qualified lead ไม่น้อยเพราะ response ช้า.

## Q3 — What tools are open on your screen right now?

ตอนนี้เลยนะพี่ ถือ iPhone อยู่ — น่าจะเป็น 50% ของชีวิตผม. App switcher ตอนนี้:

- **LINE OA Chat Manager** (mobile) — main tab, อ่านอยู่ตลอด
- **Manychat mobile** — เพิ่งเช็ค flow analytics, conversion drop จาก node "ลงทะเบียน trial" 18% → 11% สัปดาห์นี้, ต้องไปดู
- **Google Sheets app** — FM_Catalog_2026 + FM_Roster_2026 + FM_Campaign_Tracker_2026 ทั้ง 3 sheet pinned
- **Slack** — คุยกับทีม #marketing-ops + #leads-hot
- **FB Business Suite app** — DM inbox + ads manager
- **TikTok Studio** — review yesterday's live performance, 1.2k peak viewers
- **CapCut** — edit clip 30 วิสำหรับโพสต์เย็นนี้
- **Notion** (ส่วนตัว) — campaign calendar + content backlog
- **Gmail** — ไม่ค่อยเปิด เป็น notification dump
- **Apple Reminders** — random ideas ที่ต้อง follow up

ที่ desktop ของผม (MacBook Air ที่ออฟฟิศ) มีเปิด HubSpot Free แต่ไม่ได้แตะมา 4 เดือนแล้ว — tab ติดเหมือน ghost. กับ Looker Studio dashboard ที่ผม build เองสำหรับ paid ads — refresh ทุกอังคาร.

note ครับ — ผม estimate ~70% ของ customer-ops work ผมทำบน phone ไม่ใช่ laptop. ถ้า product มี mobile UX ห่วย = ผม churn ใน week 2.

## Q4 — What did you try before that didn't work?

HubSpot Free ครับ. ผมขนของมาตอน Q4 ปีที่แล้ว enthusiasm สูงมาก คิดว่าจะใช้เป็น CRM กลาง.

6 weeks หลังจากนั้น — abandon. เหตุผลตรงๆนะพี่:

1. **Setup เยอะเกินคน 1 คน** — ผมต้องเป็นคน import contacts, define properties, set up pipelines, แล้ว training Bam ใช้. เกิน bandwidth.
2. **ไม่ talk กับ LINE** — main channel ของเราเลยพี่. HubSpot Thai LINE integration ขึ้น "available" แต่ลองแล้วมันคือ webhook patchwork ที่ต้อง dev. ไม่มี dev in-house.
3. **Mobile app ไม่ดี** — ผมรัน marketing บน phone half the day. HubSpot mobile = ดูได้ แต่แก้ไข limited.
4. **ไม่ talk กับ Sheets ของเรา** — ต้อง manual import.
5. **English-first UX** — Bam กับ admin คนอื่นๆ Thai-first งงนิดหน่อย.

ก่อนหน้านั้นเคยลอง Wati กับ Zoko — มันเป็น WhatsApp-first ไม่ใช่ของเรา. ใน Thailand cycle หลักๆคือ LINE, FB, TikTok.

bottom line — anything ที่ require >5 hours of setup จากคนเดียวก่อนเห็นค่า, มันตาย. 7-day attention span ของ marketing manager คนเดียว.

## Q5 — What would make tomorrow 50% easier?

โห… 50% เลยเหรอ. ถามจริงนะ ผมไม่กล้าหวัง 50% เพราะ ops มันมีของยุ่งหลายชั้น แต่เอาที่ realistic นะพี่ — 3 อย่างคือ:

1. **บอท ที่อ่าน Sheets ของผม direct.** ราคา-คอร์ส-schedule update ใน Sheets, bot รู้ทันที. Bam ไม่ต้องไป double-entry. อันนี้คนเดียว save ผม ~5 ชั่วโมง/สัปดาห์.

2. **Lead vs existing parent — auto route.** ตอนนี้ Bam screen ทุกคน. ถ้า incoming "0812345678 — สวัสดีค่ะ" ปุ๊บ system รู้ว่าเป็น parent เก่า (น้องแบม ลูก พี่นัท ม.5 IB Math) — pull context ทันที. ถ้าเป็น new lead → qualify flow + book trial. saving ~3 ชั่วโมงต่อวันของ Bam.

3. **Weekly "this week's #1 question" report.** ที่ผม manual scan inbox ทุกอังคารตอนนี้ — ขอให้ AI ทำให้. "Win, week นี้พ่อแม่ถามเรื่อง 'TGAT รอบ summer' 47 ครั้ง — wanna broadcast?" — อันนี้แหละๆๆ campaign ideas ฟรีจาก data ของตัวเอง.

ถ้าได้ 3 อย่างนี้เลยพี่ — tomorrow easier 50%. ผมจะมีเวลาทำ TikTok content และคิด growth จริงๆ ไม่ต้องเป็น message-router ของบริษัทตัวเอง.

extra wish list ถ้าได้ — auto-suggested reply เวลา Bam reply แบบ inline (Bam ใช้ Gmail Smart Compose แล้วชอบมาก ของ LINE ไม่มี). กับ sentiment flag แบบ realtime — "parent นี้กำลังโกรธ, escalate ให้ Win" — เพราะตอนนี้ Bam screen เอง บางทีก็พลาด tone, parent ก็เลย escalate to คุณวิชุดาเอง ซึ่งผมไม่อยากให้เกิด.

## Q6 — What's the cost of not solving this?

เอาเป็นเงินก่อนนะพี่.

**Direct lost revenue:** ผมเก็บ stat ไว้ — DM/LINE response time ของเรา median 47 นาที. industry research บอก lead conversion drop ~50% ถ้า response >5 min. ของเรา qualified lead ~8 คนต่อวัน, conversion ปกติ 35%. ถ้า response เร็วขึ้น conversion น่าจะ 50%+. ส่วนต่าง = ~1.2 student/day = ~36 students/mo. average 38,000 THB/term — call it 1.4M THB ของ revenue ที่หายเพราะตอบช้า.

ตัวเลขนี้ overestimate? ใช่ครึ่งนึงก็ยัง 700k THB/mo lost.

**Bam burnout:** Bam คือ MVP ของเรา. ถ้า Bam ลาออก ผมเดือดร้อนหนักมาก. ตอนนี้เห็น Bam reply LINE 4 ทุ่มทุกคืน. risk จริง.

**Brand reputation:** เคสราคาผิดที่เล่าไป — ใน parents' Facebook group ลามไว. tutoring industry, parents talk a lot. 1 incident = 30 หาย.

**Personal cost:** ตัวผมเอง ผมไม่ได้คิด TikTok strategy มา 3 สัปดาห์แล้ว. growth channel อันดับ 1 ของเราโตช้าเพราะ marketing manager ติดงาน customer ops.

รวมๆ — 6 หลักต่อเดือน plus brand risk plus team retention plus growth opportunity cost. เยอะนะพี่.

## Q7 — "AI OS for customer operations" — Observe → Understand → Act → Learn. Reaction?

โอ้ — naming คือ smart นะพี่. "AI OS" มันฟังดู serious กว่า "AI chatbot." marketing language ที่ตรงเป้า.

แต่ honest reaction —

**Observe → Understand** ส่วนนี้ผมซื้อทันที. นี่คือสิ่งที่ Manychat ทำไม่ได้ — Manychat แค่ run script ไม่ได้ understand. ถ้า "Understand" = parse intent + recall customer context (เด็กชื่ออะไร ม.อะไร เป้าหมายอะไร) — อันนี้แหละๆๆ.

**Act** — คือเป็นจุดที่ผม nervous ที่สุด. tutoring industry, AI act ผิด = ผู้ปกครองโทรหาคุณวิชุดา. ถ้า "Act" หมายถึงตอบ auto ทุกเคส — no thanks. ถ้าหมายถึง "act on routine stuff, escalate edge cases" — yes please.

**Learn** — ตรงนี้ผมชอบมากที่สุด. Manychat ไม่ learn. ผมอยากให้ระบบเก็บว่า "เคสนี้เคยแก้ยังไง" แล้วทำให้ดีขึ้นไปเรื่อยๆ. tutoring มี recurring questions เยอะมาก — should compound over time.

framework ผ่านนะพี่ — 8/10. แต่ Act ต้องอยู่ใต้ confidence gating ชัดมาก ไม่งั้นผมไม่กล้าเปิด.

## Q8 — [Dark charcoal homepage, warm orange accent, dense terminal-style hero.] Reaction?

โอ้โห — ผมชอบมากเลยนะพี่. dark mode + warm orange — มัน Linear-coded, Vercel-coded, อ่านดู serious. Gen-Z developer aesthetic ที่กำลังลามไปทุก SaaS.

ส่วนตัวผม — 9/10 visually. terminal-style hero ทำให้รู้สึกว่า product มี depth, ไม่ใช่ Canva-tier landing page อีก.

**แต่...** มี concern ใหญ่ครับ.

ผมต้องไป pitch คุณวิชุดา. คุณวิชุดาอายุ 54, จบ MA education, ใช้ iPad mini, ชอบ UI ที่ "ดูสะอาด ดูสบายตา." ถ้าผมเปิดหน้านี้ให้ดู เจ้าจะถาม "ทำไมมันดำดำ ดูเหมือนของ hacker?" จริงๆ. tutoring industry, owners เป็น educator ไม่ใช่ tech founder. dark + dense reads as "geeky" สำหรับ demographic นี้.

ทางออก — ถ้ามี light mode toggle หรือ ส่งเดโมแบบ light ให้ผมเอาไป pitch ก็ผ่านได้. หรือมี customer logos ของโรงเรียน/สถาบันการศึกษา — โอ้ aspirational logos สำคัญมากสำหรับ vertical นี้.

ในมุมผมในฐานะ user หลัก = love. ในมุม buying authority = need light alternative.

ส่วน "density" — ดีนะ. Thai SMB buyers อยากเห็น "of money's worth" บนหน้าแรก. air-y minimalist landing page ทำให้รู้สึกว่า product น้อย. dense = แน่น = พร้อมขาย.

## Q9 — Confidence-gated auto-reply. Reaction?

อันนี้แหละๆๆๆ. นี่คือ killer feature ครับ.

confidence gating คือ exact answer ของ objection ใหญ่ผม — "AI ตอบเรื่องการศึกษาผิด ผู้ปกครองไม่พอใจแน่." ถ้าระบบรู้ว่า "เคสนี้ confidence 95% — ตอบเลย," "เคสนี้ confidence 60% — draft ให้ Bam approve," "เคสนี้ confidence 30% — escalate ทันที" — ผมเปิดได้สบายใจ.

เอา default setting ตามนี้นะพี่ — ผม imagine config ของเรา:

- **Auto:** schedule queries, ราคาคอร์ส, location, parking, contact admin. ~50% ของ inbound น่าจะวิ่งใต้ flag นี้.
- **Approval:** "course recommendation" — เด็กควรลง TGAT หรือ TPAT — bot draft Bam approve. ~30%.
- **Escalate:** complaint, refund request, schedule conflict ของเด็กเก่า. ~20%.

ผม onboard แบบนี้ได้เร็วมาก — confidence threshold ปรับได้ในระบบ ใช่มั้ย? ขอให้มี slider mobile-friendly ผมจะปรับมันบนรถนะพี่.

อย่างเดียวที่ขอ — "approval queue" ต้อง notify ทันที. ถ้า Bam ต้อง check tab ทุก 10 นาที = หาย benefit. push notification + เปิด/approve ใน 2 tap.

H10 ในสมมติฐานพี่ — confidence-gated unblocks Thai ops teams to trust AI on the front line — ผม validate 100%. นี่คือ unlock ของ vertical ที่ stakes สูงเช่น education, healthcare. without confidence gating ผมไม่กล้าเปิดอัตโนมัติ. with it = วันแรกเลย.

## Q10 — Unified inbox across LINE + Shopee + TikTok + Lazada + IG + FB + email. Reaction?

โอเค ตรงนี้ honest take —

**LINE + FB = mandatory.** ของเราคือ 95% ของ inbound. ถ้า cover ทั้ง 2 แบบ first-class (ไม่ใช่ FB เป็น afterthought) — ผมซื้อ.

**TikTok DM** — emerging แต่ยังไม่ใหญ่ของเรา. ผม get DM TikTok ~10 ต่อวัน mostly content questions ไม่ใช่ lead. nice-to-have.

**Shopee + Lazada** — irrelevant for tutoring. ผมไม่ขายของบน marketplace. ถ้า bundle มาเฉยๆ ก็ ไม่จ่ายเพิ่มแล้วกัน.

**IG DM** — เรามี IG ~12k followers แต่ DM น้อย. nice-to-have.

**Email** — admin staff ใช้บ้างกับ corporate clients (โรงเรียนนานาชาติที่ส่งเด็กมาเรียน summer). matters ~10%.

priority order ของผม:
1. LINE OA (must have — first-class)
2. Facebook DM + FB Comments (must have — first-class)
3. TikTok DM (nice-to-have)
4. IG DM (nice-to-have)
5. Email (nice-to-have)
6. Shopee/Lazada (zero value to me)

**Concern หนึ่ง** — pricing model. ถ้าราคา per channel ผมจะจ่ายแค่ LINE + FB. ถ้า all-channel flat — ผมไม่ต้องการ Shopee แต่จะรู้สึกว่าจ่ายไปฟรี. ทำให้ pricing tier ชัดสำหรับ vertical ที่ไม่ใช่ commerce.

H9 ในสมมติฐานพี่ — LINE-first + multi-channel adjacency — ตรงสำหรับเรา ใช่. แต่ Shopee/Lazada ไม่ใช่ universal — adjust messaging by vertical.

## Q11 — Customer memory. Reaction?

อันนี้แหละๆๆ. tutoring คือ memory-heavy industry ที่สุดแล้วในใจผม.

ลูกค้าของเราคือ "ผู้ปกครอง × เด็ก" pair. เด็กอายุเปลี่ยน, เกรดเปลี่ยน, target exam เปลี่ยน. parent ก็มี personality ของตัวเอง — บางคน price-sensitive, บางคน outcome-driven, บางคน อยากให้ลูกได้ peer group ดี. system ต้องเก็บ context นี้ทั้งหมด.

ของผม imagine —
- น้องแบม (ลูกพี่นัท) — ม.5, รร.สวนกุหลาบ, สาย sci, target TGAT รอบ Oct, scored 78 ใน mock เมื่อ 2 weeks ago, ครูประจำ A.Pat
- พี่นัท (parent) — payment via bank transfer, prefer LINE communication, hate phone calls, asked about TPAT add-on 3 ครั้งแล้ว ($Y, ยังไม่ได้ลง)

ถ้าระบบจำได้แบบนี้ next time พี่นัท DM "TGAT หน่อยครับ" → bot pull profile → "พี่นัทคะ TGAT รอบ Oct ที่น้องแบมจะลง schedule เป็น..." — instant trust ครับ.

**คำถามที่ผม care หนัก:**

1. **Memory format ตรงกับ Sheets ของผมมั้ย?** ตอนนี้ FM_Roster_2026 มี 14 columns. ผมอยาก import 1 ครั้งจบ และ sync ต่อได้.

2. **PDPA?** ผู้ปกครองข้อมูล sensitive — ลูก, school, score. ถ้า data store ในไทยและ PDPA-compliant + audit log — buying signal.

3. **Memory editable มั้ย?** ถ้า bot จำผิด ผมต้อง override ได้ ใน 2 tap.

4. **Memory expiry?** เด็กจบ ม.6 ไป university — context นี้ลบหรือ archive ยังไง?

ถ้าตอบดี = strong yes. tutoring vertical sells on memory.

H3 (auto-extracted memory + Configuration Advisor) — validate strongly สำหรับ vertical นี้.

## Q12 — Rank these 7 planned features 1–5; tag would-pay-extra-for.

โอเค จะ rank ตาม fit กับธุรกิจผม ไม่ใช่ general appeal นะ.

| # | Feature | Rank | Pay extra? |
|---|---|---|---|
| 1 | **Intelligence Dashboard** | 5 | YES — flagship buying reason |
| 2 | **AI Configuration Advisor** | 5 | YES |
| 3 | **Knowledge Base + Lessons** | 4 | YES (if Sheets-aware) |
| 4 | **Growth Agent** | 4 | YES — แต่ would test first |
| 5 | **AI Setup Assistant** | 3 | NO — onboarding only |
| 6 | **AI Workflow Builder** | 2 | NO |
| 7 | **Operations Agent** | 2 | NO |

**ทำไม Intelligence Dashboard = 5?**
นี่คือ feature ที่ทำให้ผมไม่ต้อง manual scan inbox เพื่อหา campaign ideas. "TGAT October — top question this week" → broadcast → conversion. dashboard แบบนี้ ROI ชัดที่สุด. — pay extra ทันที 5,000 THB/mo ก็ยอม.

**Configuration Advisor = 5?**
ผมไม่อยาก setup rules manual. ถ้าระบบดู Bam ตอบเองและ learn pattern แล้ว suggest "ทุกครั้งที่ parent ถามเรื่อง parking, ตอบ X" — saves me Sundays. — yes pay extra.

**Knowledge Base + Lessons = 4?**
ขึ้นกับว่า talk Sheets ได้มั้ย. ถ้า KB คืออีก DB ที่ต้อง maintain manual แยกจาก Sheets = 2. ถ้า KB ingest Sheets + คอย cross-check = 4-5.

**Growth Agent = 4?**
ตรง wheelhouse ผม. แต่ผมเป็น marketer เอง — Growth Agent ต้องไม่ดูเหมือน "จะมาแทนผม." ถ้า positioning เป็น "co-pilot ของ marketer" = ใช่ pay extra. ถ้า positioning "AI ทำ marketing เอง" = trust low.

**Setup Assistant = 3?**
nice once. หลัง onboard week 1 ไม่แตะอีก. ไม่ pay extra เป็น line item แต่อยากได้ตอนเริ่ม.

**Workflow Builder = 2?**
ของเราเล็ก ทีม 4 คน processes loose. natural-language workflow builder ฟังดู cool แต่จริงๆ ผมไม่มี workflow ซับซ้อนพอ. SMB อย่างเรา — over-engineered.

**Operations Agent = 2?**
order lookup, ticket, webhook — เราไม่มี order. ไม่มี ticket system. ไม่มี webhook ที่ต้อง trigger. agent นี้ build for ecom, ไม่ใช่ tutoring. skip.

H4 (3-agent: Service/Ops/Growth) — **half-validate.** สำหรับ vertical ผม — Service + Growth = obvious. Ops = irrelevant. ถ้า positioning "3 agents" ผมจะรู้สึกว่าจ่ายเงินซื้อ agent ที่ไม่ใช้ — repackage as "core + add-on" ดีกว่า.

## Q13 — Expected price/mo? Trigger to sign? Deal-breaker?

**Expected price.**

โอเค คิดในใจ — ตอนนี้จ่าย 9k (LINE + Manychat + ghost HubSpot). budget ผมเปิดไว้ 15-25k. ถ้าระบบ replace Manychat + add Sheets sync + Intelligence Dashboard + memory + confidence-gated auto-reply — ผม comfortable ที่ **18,000-22,000 THB/mo** สำหรับเรา.

ถ้า positioning premium tier (Growth Agent + Configuration Advisor add-on) — เพิ่มเป็น **25-30k THB/mo** ได้ ถ้า ROI ชัด. anything above 35k ต้องคุยกับคุณวิชุดา ซึ่งจะใช้เวลาอีก 2 สัปดาห์ของ approval cycle.

**Trigger to sign.**

5 อย่างนี้ก็พอ:
1. **14-day trial** — self-serve sign-up. ไม่ต้องคุย sales.
2. **Connect Google Sheets ใน 5 นาที** ตอน onboarding — ถ้าผ่าน checkpoint นี้ = strong signal.
3. **LINE OA + FB DM** plug ใน <30 นาที.
4. **First "auto-reply ที่ confidence 95%" goes out วันแรก** — taste of magic.
5. **Pricing tier ชัด** — ไม่มี "talk to sales for pricing." ผมจะไปหาเจ้าอื่น.

ถ้า 5 อย่างนี้ผ่านใน week 1 ของ trial — ผมจ่าย annual ได้.

**Deal-breakers:**

1. ❌ **ไม่ talk Google Sheets** — instant out. ผมไม่ migrate catalog.
2. ❌ **FB DM เป็น afterthought / paywalled tier สูง** — out.
3. ❌ **ต้องคุย sales ก่อน trial** — Win ไม่รับ sales call. self-serve only.
4. ❌ **ไม่มี mobile app หรือ mobile UX แย่** — ผมรัน marketing บน phone. desktop-only product = dead.
5. ❌ **AI ตอบผิดเรื่อง exam dates ใน trial** — single mistake ใน high-stakes domain = trust gone. confidence gating mandatory.
6. ❌ **Data store นอก Thailand + ไม่ PDPA ชัด** — parents ถาม คุณวิชุดาห้าม.

## Q14 — What didn't I ask about that matters more?

โอเค — 4 อย่างที่พี่ไม่ได้ถามแต่ matter:

**1. Broadcast / campaign blast.**
LINE OA แบบ free มี monthly broadcast quota จำกัด. tutoring ของเรา broadcast ทุกอาทิตย์ — schedule reminder, exam tip, promotion. ถ้า CRMOS360 ช่วย optimize broadcast (ส่งเฉพาะ segment ที่เหมาะ ไม่ blast ทั้ง 28k followers สิ้นเปลือง quota) = huge win. ตอนนี้ Manychat ทำได้ห่วยมาก.

**2. Multi-branch view.**
เรามี 3 สาขา. parent ของน้องแบม สาขา Sukhumvit, แต่บางครั้ง drop-off ที่ Lat Phrao เพราะใกล้บ้านเพื่อน. ผมต้องการ unified parent view across branch. ถ้าระบบ silo by branch = ไม่ work.

**3. Tutor ↔ AI assistant interface.**
14 tutors ของเรา freelancers + parttime. tutor ก็ DM กับ parent บ้างเรื่อง homework. ถ้า AI ช่วย draft message ของ tutor (in tutor's voice) before send = unlock อีก persona เลย. ตอนนี้ tutor reply ช้าเพราะไม่มีเวลา. AI co-write = win.

**4. PDPA + parental consent flow.**
educational data sensitive มาก. ลูกอายุต่ำกว่า 18 → consent ต้องจาก parent. เรา manual ทำผ่าน PDF ส่ง LINE สิ้นเปลืองมาก. ถ้า CRMOS360 มี consent flow ที่ store ใน customer record + audit log = saves us legal headache + signals serious product.

อยาก add ด้วยอีกอันสุดท้าย — **ภาษา.** UI ภาษาไทยที่อ่าน natural ไม่ใช่ Google Translate เป็น hygiene factor. คุณวิชุดาดู UI ตัวเอง ถ้าอ่านไม่ออกหรืออ่านแล้ว awkward = approval ไม่ผ่าน. ตอนเดโมขอ Thai locale ดูด้วย.

**5. Referral / word-of-mouth tracking.**
ของเรา ~40% ของ new students มาจาก referral (parent A บอก parent B). ตอนนี้ผมไม่มี way to track ว่าใครแนะนำใคร. ถ้า CRMOS360 มี simple referral attribution ใน customer record = unlock loyalty program ได้.

**6. Reporting ที่ส่งให้คุณวิชุดาได้เลย.**
ทุกเดือนผมต้อง compile slide สำหรับ owner — leads, conversion, top campaigns, churn risk. กินเวลาผมครึ่งวัน. ถ้า dashboard export PDF report ภาษาไทย สวยพอที่จะส่งเจ้านาย — หวัง pay extra อีก 2-3k THB/mo.

โอเคพี่ ผมพอแล้ว ต้อง upload TikTok เย็นนี้ — ขอบคุณที่ถามเยอะ. ส่ง Pricing tier กับ trial signup link มาเมื่อไหร่บอกผมเลย ผม sign trial วันนั้นเลย ถ้า Sheets-sync demo ผ่าน. ถ้า Sheets-sync แค่ "coming soon" — มาคุยกันใหม่ Q3. Cheers krub!

---

**End of interview.**
**Word count target:** ~3,000 words.
