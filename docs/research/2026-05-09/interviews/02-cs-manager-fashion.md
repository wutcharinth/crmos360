# Interview 02 — Pimchanok "Pim" Tanasarnsanee (CS Manager, Sira Studio fashion ecom)

**Date:** 2026-05-09
**Persona:** [02-cs-manager-fashion.md](../personas/02-cs-manager-fashion.md)
**Method:** Synthetic interview, 14-question script

## Q1. Walk me through yesterday's customer-ops work — what did the day actually look like?

โอเคค่ะ เมื่อวานเป็นวันจันทร์ ซึ่งหนักกว่าปกติอยู่แล้วเพราะคิวจาก weekend ค้างมา ดิฉันเข้างานประมาณ 8:45 เปิด Slack ก่อน ดู #cs-fire ว่ามี escalation อะไรค้างจากกะดึก — มีสาม cases ค่ะ หนึ่งคือลูกค้าด่ายาวเรื่อง Shopee ส่งช้า อีกสองคือเคลม sizing

9 โมงน้องเข้ากะแรก 6 คน ดิฉัน brief สั้น ๆ แล้วเปิด Zaapi ขึ้นมา dashboard inbox unread ตอนนั้นแตะ 340 messages ค่ะ — LINE OA หนักสุดเหมือนเดิม ประมาณ 38% ของ volume ทั้งวัน ตามด้วย Shopee แล้วก็ Lazada ดิฉันต้องเข้าไปแบ่งคิวเองว่าใครจับ channel ไหน เพราะ Zaapi ไม่ auto-route ตาม intent ได้ดีพอ

ที่เหลือของวันก็คือสลับหน้าจอตลอดเวลา — Zaapi เพื่อตอบ, Shipnity เพื่อเช็คเลขพัสดุ, OMS Bubble ของเราเพื่อดู order status ซึ่งมัน query ช้ามาก, Google Sheet สำหรับ KPI tracking, แล้วก็ Slack เพื่อ escalate ขึ้นกับ COO ดิฉันเองตอบ ticket เฉพาะที่ escalate มา หรือ VIP customer แค่นั้นค่ะ

ตอนเย็น 6 โมงทำสรุป handle time เฉลี่ยทีมได้ 3 นาที 20 วินาทีต่อ conversation, CSAT 4.2/5, response time SLA hit 87% — ต่ำกว่าเป้า 90% เพราะช่วงเที่ยงคิวระเบิด เลิกงาน 2 ทุ่มครึ่ง กลับบ้านเขียน performance review ของน้องสองคนต่อจนเที่ยงคืน ค่ะ

## Q2. What was the worst part?

หัวจะระเบิดที่สุดคือเรื่อง escalation ค่ะ ตรง ๆ เลย

เมื่อวานมี case นึง ลูกค้าซื้อชุดไป 4,500 บาท แล้ว complain ว่า fabric ไม่เหมือนรูป น้องในทีมตอบไปประมาณ 8 รอบ พยายาม de-escalate แล้วในที่สุดลูกค้าพูดคำว่า "จะแจ้ง สคบ." น้องตกใจ screenshot โยนเข้า #cs-fire ส่งให้ดิฉัน

ปัญหาคือพอดิฉันเปิด Slack เห็น screenshot — มันเป็นแค่ภาพ ดิฉันต้องเปิด Zaapi, search ชื่อลูกค้า, scroll ขึ้นไปอ่าน context ทั้งหมด 8 messages ก่อนหน้า เพื่อดูว่าน้องตอบอะไรไปบ้าง ตอนนั้นดิฉันอยู่ในมีตติ้งกับ marketing พอดี กว่าจะเข้ามาจัดการได้ลูกค้ารอไป 14 นาที ซึ่งสำหรับลูกค้าที่กำลังโกรธ 14 นาทีคือนิรันดร์ค่ะ

เรื่อง context loss นี่เกิดทุกวัน ไม่ใช่แค่เคสเดียว ดิฉันคิดว่าเสียเวลา manager 30-45 นาทีต่อวันแค่กับการ "หา conversation" ก่อนจะ "แก้ conversation"

อีกเรื่องคือน้องในทีม — ดิฉันสังเกตว่าน้องคนหนึ่งตอบเหมือน robot มากขึ้นเรื่อย ๆ เพราะ template เยอะเกิน ลูกค้าเริ่มเขียนกลับมาว่า "พี่ใช่คนหรือบอท?" ซึ่งสำหรับ fashion brand ที่ขาย warmth กับ personal touch มันคือ death by a thousand cuts ค่ะ

## Q3. What tools are open on your screen right now?

ตอนนี้ที่เปิดอยู่บนสองจอนะคะ — จอซ้าย: Zaapi (หลัก inbox), Shipnity (อีก tab), OMS ของเราที่ทำบน Bubble (อีก tab), แล้วก็ LINE OA Manager dashboard ตรง ๆ เพราะ Zaapi บางครั้ง sync ช้า ต้องเข้าไปดู rich menu กับ broadcast audience เอง

จอขวา: Slack (สอง channel — #cs-fire กับ #cs-team), Google Sheet ที่ดิฉัน track KPI ของน้องแต่ละคนรายวัน, Manychat (เปิดทิ้งไว้ดู IG/FB lead flows), Gmail (ลูกค้า B2B ส่งเข้ามาบ้าง), แล้วก็ Notion หน้า SOP ที่ดิฉันเขียนไว้ให้น้องเปิดอ่าน

รวม ๆ ก็ประมาณ 9 tabs/apps ค่ะ ปกติ ดิฉัน alt-tab ระหว่าง Zaapi กับ Shipnity บ่อยที่สุด — ทุกครั้งที่ลูกค้าถามเลขพัสดุดิฉันต้อง copy เลข order ไป paste ใน Shipnity แล้วค่อย copy เลข tracking กลับมาตอบ ใช้เวลา 30-40 วินาทีต่อครั้ง คูณกับ 400 ครั้งต่อวันคือ 4 ชั่วโมงรวมทั้งทีมที่หายไปกับการ alt-tab ค่ะ

ที่ไม่ได้เปิดแต่ใช้ทุกวันคือ Excel ของ inventory + Canva สำหรับ rich content ตอบลูกค้าเรื่อง sizing chart

## Q4. What did you try before that didn't work?

หลายอย่างค่ะ ลองมาเยอะ

**หนึ่ง — Page365** ใช้ก่อน Zaapi ประมาณ 10 เดือน UI ดูสวยกว่า Zaapi แต่ LINE integration ไม่เสถียร และ Shopee sync มี delay 2-5 นาที ซึ่งสำหรับ flash sale คือฆาตกรรม ย้ายออก

**สอง — ลอง Dialogflow + custom bot บน LINE OA** ปลายปี 2024 จ้าง freelancer ทำ FAQ bot ตอบเรื่อง shipping กับ size chart มี intent ประมาณ 30 ตัว ผลคือ — bot ตอบเร็วจริง แต่พอเจอคำถามนอก script มันตอบมั่ว ลูกค้าเริ่ม complain ว่า "บอทกวน" เราต้องปิดทิ้ง 6 สัปดาห์ ค่า dev 80,000 บาท สูญ COO พูดยาว ๆ เรื่องนี้

**สาม — Canned response macros ใน Zaapi** ทำไป 45 templates น้องใช้จริงแค่ 12 เพราะหามันไม่เจอเวลาเร่ง search bar ใน Zaapi ช้า

**สี่ — จ้าง outsourced CS** จากบริษัท BPO มา 4 ที่นั่ง ลด workload ทีม core ได้ แต่ quality ตก CSAT ลงจาก 4.5 เหลือ 3.9 ใน 6 สัปดาห์ ภาษาไม่ get tone ของ brand เลิกสัญญาใน 3 เดือน

**ห้า — สร้าง KB internal บน Notion** น้องไม่ค่อยเปิดอ่าน เพราะตอนเร่งคิวไม่มีเวลามา search Notion มันต้อง surface ในที่ที่น้องตอบลูกค้าอยู่ค่ะ ไม่ใช่อีก tab

บทเรียน: AI ที่ตอบเองไม่ได้เลย และ tool ที่อยู่คนละหน้าจอกับ inbox ก็ไม่ได้

## Q5. What would make tomorrow 50% easier?

ขอคิดเป็นรูปธรรมนะคะ ไม่ใช่ wishlist

50% ง่ายขึ้น = handle time ลดลงประมาณครึ่งหนึ่ง จาก 3:20 เหลือ 1:40 ต่อ conversation นั่นแปลว่าทีม 9 คนทำ workload เท่าเดิมได้ในเวลา 4.5 ชั่วโมง ซึ่งใหญ่มากค่ะ

สิ่งที่ทำให้เกิดได้:

**หนึ่ง — AI draft reply พร้อม context ครบ** น้องแค่อ่าน, ปรับ 1-2 คำ, กด send ไม่ใช่พิมพ์ใหม่ ทุก case ที่เป็น tracking question (60% ของ volume) ควรมี draft รอแล้วพร้อมเลข tracking ดึงจาก Shipnity อัตโนมัติ

**สอง — เลิก alt-tab** order info, customer history, past complaints — ทุกอย่างต้องอยู่ใน same pane กับ conversation ดิฉันไม่อยากเห็นน้องเปิด Shipnity tab อีกแล้ว ค่ะ

**สาม — escalation ที่ "land" มาหาดิฉันพร้อมเหตุผล** ไม่ใช่ screenshot ใน Slack แต่เป็น ticket ที่บอก "AI confidence ต่ำเพราะลูกค้าใช้คำว่า สคบ. ใน message 12, sentiment เปลี่ยนจาก neutral เป็น angry ตอน 14:32, suggested action: refund + apology" ดิฉันแค่อ่าน 30 วิ ตัดสินใจ approve ได้

**สี่ — auto-routing ตาม intent + time** เช้า LINE OA ส่งไปคนถนัด LINE, Shopee message ส่งไปอีกคน VIP ลูกค้าวิ่งตรงมาที่ดิฉันเลย ไม่ต้องประชุม brief ทุกเช้า

ถ้าได้ 4 อย่างนี้ ดิฉันลดทีมจาก 9 เหลือ 6 คนได้โดยไม่ตก SLA ค่ะ

## Q6. What's the cost to your business of not solving this?

ดิฉันคิดเป็นตัวเลขให้ฟังนะคะ มี 3 ชั้น

**ชั้นแรก — direct cost ของ headcount.** ทีม 9 คน เงินเดือนเฉลี่ย 22,000 บาท + OT + ประกันสังคม ตกหัวละประมาณ 26,000 รวมทีม 234,000 บาท/เดือน ถ้า productivity ขึ้น 30% เราเหลือ 6 คน save 78,000 บาท/เดือน ปีละเกือบล้านค่ะ

**ชั้นสอง — turnover cost.** ปีที่แล้วลาออก 4 คน hire ใหม่ 5 คน หนึ่งคน quit ตอน training ยังไม่จบ recruiting + onboarding cost หัวละประมาณ 35,000 บาท (เวลา manager + lost productivity 6 สัปดาห์) รวม 175,000 บาท/ปี ที่เป็น hidden cost ที่ COO ไม่ค่อยเห็น เพราะไม่ได้เป็น line item ใน P&L

**ชั้นสาม — revenue leak จาก slow response.** เรามี data ที่ดิฉัน track เอง: lead ที่ตอบใน 5 นาที conversion rate 18% ลด เป็น 9% ถ้าตอบช้ากว่า 30 นาที ตอนนี้ช่วง peak (เที่ยง + 2 ทุ่ม) เราตอบเกิน 30 นาทีบ่อย ๆ ถ้าคิดว่าเสีย sales 200,000 บาท/เดือนจาก slow response ก็ไม่เกินจริงค่ะ

**รวมแล้วประมาณ 280,000 บาท/เดือน** ที่บริษัทเสียอยู่ตอนนี้ ทั้ง direct + indirect ซึ่งสำหรับธุรกิจที่ทำ revenue 12 ล้าน/เดือน คือ ~2.3% ของ topline ที่หายไปกับ ops inefficiency

แล้วยังไม่นับ brand damage จาก agent ที่เหนื่อยจนตอบลูกค้าเสียงเย็นชาด้วยนะคะ ตัวนั้นวัดยาก แต่กระทบ retention แน่ ๆ ค่ะ

## Q7. We're framing the product as an "AI OS for customer operations" — Observe → Understand → Act → Learn. What does that phrase make you think? Believable, or vapor?

ครึ่งกลางค่ะ — ไม่ใช่ vapor ทั้งหมด แต่ก็ยังไม่ believable 100%

สิ่งที่ฟังแล้วชอบคือคำว่า "OS" — มันบอกว่าไม่ใช่แค่ inbox อีกตัวหนึ่ง ไม่ใช่แค่ chatbot มันคือ layer ที่อยู่ใต้การทำงาน ดิฉันเข้าใจ metaphor นี้ ทีม engineering รุ่นน้องชอบใช้ ทำให้รู้สึกว่าทีม product เขาคิดเป็นระบบไม่ใช่ feature สุ่ม

Observe → Understand → Act → Learn — ดิฉันชอบ verb 4 ตัวนี้ในแง่ structure แต่ขออนุญาตท้วงค่ะ:

- **Observe** ฟังดูเข้าใจ — มัน listen ทุก channel โอเค believable
- **Understand** อันนี้เริ่มเสี่ยง คำว่า understand บนภาษาไทย โดยเฉพาะ context fashion ที่ลูกค้าพิมพ์ "ไซส์อะไรดีคะ ส่วนสูง 162 หนัก 52 ปกติใส่ M ของ Uniqlo" — AI เข้าใจจริงไหม? ต้อง prove ค่ะ
- **Act** อันนี้น่ากลัวที่สุด ถ้า act หมายถึง auto-reply autonomous ดิฉันออกจากห้องเลยนะคะ COO จะไม่เซ็น ถ้า act หมายถึง draft + suggest โอเค
- **Learn** ฟังดูเซ็กซี่ที่สุดในสี่ตัว แต่ก็ vapor ที่สุด ทุก vendor บอกว่า "AI ของเราเรียนรู้" — ดิฉันอยากเห็นว่า learn อะไร, จาก data ใคร, ใครเป็นเจ้าของ output ของการเรียนรู้นั้น

สรุป — **positioning OK, ไม่เกินจริงเกินไป** แต่ตอน demo ห้ามพูดคำว่า "AI OS" ลอย ๆ ต้อง map กับสิ่งที่ดิฉันเห็นบนหน้าจอตอนนั้นเลยว่าตรงไหนคือ Observe ตรงไหนคือ Act ไม่งั้นมันจะกลายเป็น marketing fluff ค่ะ

H5 sense check: ดีกว่า "AI chatbot" แน่นอน ฟังดูจริงจังขึ้น คุยกับ COO ได้ง่ายขึ้น

## Q8. Reaction to the homepage screenshot (dark charcoal + warm orange, terminal-style hero, 6 channels + 4 conversations + 2 intelligence cards above the fold, Inter + JetBrains Mono).

โอเค เห็นภาพแล้วค่ะ ขอแชร์ honest reaction นะคะ

**สิ่งที่ชอบทันที:**
- Density สูง — เห็น 6 channels พร้อมตัวเลข, 4 conversations จริง, 2 intelligence cards บน fold เดียว ดิฉันรู้ว่าตอนนี้ระบบทำอะไรอยู่ ไม่ต้อง scroll ไม่ต้องเดา การที่ landing page กล้าโชว์ของจริงไม่ใช่ stock photo ลูกค้านั่งคุยรอบ ๆ illustration — มัน trust signal ค่ะ
- JetBrains Mono สำหรับตัวเลข — ดูจริงจัง engineering-grade ดิฉัน present กับ COO ได้
- Charcoal + orange — orange นี่เซอร์ไพรส์นิดหน่อย แต่มันทำให้ไม่ดู cold เกินไป ถ้าทั้งหน้าเป็น mono dark + blue accent มันจะรู้สึกเป็น dev tool เกินสำหรับ ops manager แบบดิฉัน

**สิ่งที่กังวล:**
- น้องในทีมดิฉันอายุ 22-28 บางคน comfort กับ light UI มาก ดิฉันเปิดให้น้องดูแล้วถามว่า "ใช้ทุกวันไหวไหม" ถ้าน้องบอกว่าตาล้าใน 2 ชั่วโมง คือ blocker ค่ะ ขอ light mode option เป็น fallback อย่างน้อยให้ agent ระดับ operator
- Terminal-style hero — เท่นะคะ แต่มี risk คือ COO อาจคิดว่า "นี่ไม่ใช่เครื่องมือ business" ดิฉันต้องโน้มน้าวเพิ่ม ถ้าหน้าแรกมีเลขเงิน เลขรายได้ เลขที่ COO อยากเห็น (revenue impact, hours saved) ปนอยู่ด้วยจะดี ตอนนี้มันดู ops-centric เกินไปนิด

**Buy or intimidate?** Buy ค่ะ — ดิฉันไม่กลัว แต่ดิฉันไม่ใช่ persona เฉลี่ย ดิฉันเดาว่า solo founder อายุ 40+ ที่ขายเสื้อผ้าจะดูแล้ว bounce H1 (dark cockpit > friendly bot) — สำหรับ ops buyer แบบดิฉัน ใช่ ตรงเลย แต่อย่าใช้ landing page เดียวสำหรับทุก segment

H6 (warm accent reads as engineering + approachable): สำหรับดิฉันใช่ — orange ช่วยจริง ๆ

## Q9. Reaction to per-conversation confidence-gating: AI auto-replies on high-confidence, drafts for human approval on medium, escalates on low.

อันนี้ — ขอพูดตรง ๆ ว่าเป็น feature ที่ "right answer" ที่สุดที่ดิฉันเคยได้ยินจาก vendor ในรอบ 2 ปีค่ะ

ทุก vendor มาคุยจะแบ่งเป็นสองค่าย: ค่ายแรก "AI ตอบเองได้ 90%" — ดิฉันไม่เชื่อ และไม่กล้า ค่ายที่สอง "AI ทำไม่ได้หรอก ใช้เป็น template assistant" — แล้วทำไมต้องจ่ายเพิ่ม

Confidence-gating คือทางสายกลางที่ทำให้ ROI วัดได้และ risk control ได้ ดิฉันชอบมาก

**คำถามที่ดิฉันต้องถามก่อนเซ็น:**

1. **Confidence threshold ปรับได้ไหม?** ตอนเริ่มดิฉันอยากให้ระบบ conservative มาก — auto reply เฉพาะ tracking question ที่มีเลข tracking ชัด ๆ เท่านั้น เริ่มจาก 5% auto, 60% draft, 35% escalate แล้วค่อย ๆ ปรับเมื่อ trust สะสม
2. **มี audit log ไหม?** ทุก auto-reply ต้องมี timestamp, confidence score, reasoning, customer ID — ดูย้อนหลังได้ทุก case เพราะถ้าเกิด PR crisis (มี case แล้วในวงการเสื้อผ้าไทยปีที่แล้ว) ต้องสาวกลับได้ทันที
3. **Human-in-the-loop ตรง medium-confidence ทำงานยังไง?** น้องต้องกดอะไรกี่ครั้ง? ถ้าต้องเปิด tab ใหม่ทุกครั้งคือเสียเวลามากกว่าพิมพ์เอง ขอ approve ด้วย one-tap จาก inbox view เดิม
4. **Auto-reply pattern จะถูก fine-tune ตาม brand voice ของ Sira Studio ได้แค่ไหน?** เราใช้คำว่า "พี่" กับลูกค้าประจำ "คุณ" กับลูกค้าใหม่ AI แยกได้ไหม?

**Bottom line:** H10 (confidence-gating unblocks trust) — ดิฉัน confirm 100% นี่คือเหตุผลเดียวที่ทำให้ดิฉันยอม sit ในมีตติ้งกับ vendor ครั้งที่สอง

## Q10. Reaction to a single inbox unifying LINE OA + Shopee + TikTok Shop + Lazada + IG + FB + email — does this match how you actually work?

ใช่ค่ะ — แต่ขอความซื่อสัตย์ตรงนี้ Zaapi ก็ทำส่วนนี้ได้แล้ว เป็น table-stakes ไม่ใช่ wedge

H2 บอกว่า unified inbox + confidence gating คือ wedge ดิฉันเห็นว่า unified inbox **อย่างเดียว** ไม่ใช่ wedge — มัน assumed แล้ว มัน confidence-gating ที่เป็น wedge

แต่!! รายละเอียดเรื่อง unified inbox ที่ Zaapi ทำได้แย่ ๆ และคุณต้องทำให้ดีกว่า:

**หนึ่ง — TikTok Shop integration.** Zaapi เพิ่ง launch beta TikTok ปีนี้ ยัง bug เยอะ message delay 1-3 นาที, image attachment บางทีหายไป ถ้า CRMOS360 ทำ TikTok Shop ให้เสถียรเท่า LINE คือคุณชนะตรงนี้แล้ว 8% ของ volume เราอยู่ที่ TikTok และ growing เร็ว

**สอง — Channel-specific UX hint.** LINE OA ไม่ใช่ Shopee — ลูกค้าใช้ tone คนละแบบ Shopee ลูกค้าจะ formal กว่า LINE OA จะ casual UI ควรย้อม channel ของแต่ละ message ไม่ใช่กลายเป็น generic เหมือนกันหมด Zaapi ทำ icon เล็ก ๆ เฉย ๆ ดู confusing น้องบางทีลืมว่ากำลังตอบ channel ไหน

**สาม — Order context sync.** ใน Shopee, message มาพร้อม order ID อัตโนมัติ — Zaapi sync แล้วแต่ไม่ surface ดี ดิฉันอยากเห็น order summary card ลอยอยู่ข้าง conversation ทันที พร้อมราคา, สถานะส่ง, voucher ที่ลูกค้าใช้ — สามอย่างนี้ตอบ 80% ของคำถาม

**สี่ — Email หาย mostly** เราใช้ email น้อย แต่ B2B กับ press inquiry มาทาง email ห้ามให้มัน fall through

H9 confirm: LINE OA-first ถูกแล้ว 38% ของเรา multi-channel adjacency ก็จำเป็น ห้ามขาด

## Q11. Reaction to "customer memory" — the AI auto-extracts facts from past conversations and surfaces them on the next conversation. Useful, creepy, or both?

ทั้งสองอย่างค่ะ — useful 70% creepy 30% และ creepy ส่วนนั้นต้อง design ออกไปให้หมด

**Useful side:**
ถ้า AI จำได้ว่า "คุณ Mint ส่วนสูง 162 เคยซื้อ size M เคย complain เรื่อง fabric หนาเกิน" แล้วน้องเปิด conversation ครั้งใหม่เห็น summary card นั้นเลย — handle time ลด 40-60 วินาทีต่อ case ง่าย ๆ และ rapport กับลูกค้าดีขึ้นทันที ลูกค้ารู้สึกว่าเรา "จำได้" = retention

ตอนนี้ดิฉันให้น้องเปิด profile ลูกค้าใน OMS ของเราซึ่ง search ช้ามาก ส่วนใหญ่น้องไม่เปิด ตอบไปแบบไม่มี context = generic = CSAT ตก

**Creepy / risky side:**
1. **PDPA** — Thailand PDPA เข้มขึ้นเรื่อย ๆ AI extract fact = personal data processing ดิฉันต้องตอบ DPO ของบริษัทได้ว่า data ไหน extract, เก็บไว้ที่ไหน, ลูกค้า request ลบได้ไหม ถ้า vendor ไม่มี answer ชัด คุยต่อไม่ได้
2. **False memory** — ถ้า AI extract ผิด เช่น เข้าใจว่าลูกค้าแพ้ผ้าใยสังเคราะห์ทั้งที่ไม่ใช่ น้องเชื่อ surface นั้นแล้วแนะนำผิด ลูกค้าโกรธ ใครรับผิดชอบ?
3. **Sensitive info** — บางลูกค้าเล่าเรื่อง personal เช่น "ซื้อเป็นของขวัญแฟน แฟนเพิ่งเลิก ส่งคืนได้ไหม" — ฟัง AI ไม่ควรเก็บเรื่อง relationship status เป็น "fact" ที่ surface ครั้งหน้า

**สิ่งที่ดิฉันต้องการจาก feature นี้:**
- **Memory editor** — ดิฉันหรือน้อง senior ลบ/แก้ memory ได้ manually
- **Confidence on memories** — ไม่ใช่ทุก fact เท่ากัน, fact ที่ AI สกัดมาจาก 1 message ครั้งเดียวต้อง flag ว่าเชื่อถือต่ำ
- **Customer-visible toggle** — ลูกค้าขอ delete ได้ตาม PDPA right to erasure
- **Memory category** — แยก "preference" (ซื้อ size M) ออกจาก "personal" (เพิ่งเลิกแฟน) preference ใช้ได้, personal ห้าม surface

ถ้าทำได้ครบ 4 ข้อ — ใช่ ดิฉันจ่ายเพิ่มสำหรับ feature นี้ได้

H3 (auto-extracted memory enables self-improving ops): ใช่ในทาง principle แต่ implementation detail คือ make-or-break ค่ะ

## Q12. Feature ranking

| Feature | Score (1–5) | Note |
|---|---|---|
| Operations Agent | 4 | Order lookup + workflow trigger ตรงกับ alt-tab pain ของเรา ลด context switching ได้จริง อยากได้ webhook เข้า Shipnity ตรง |
| Growth Agent | 2 | Cross-sell น่าสนใจ แต่ Sira ไม่ใช่ DTC แบบ Wisdom — เราขายผ่าน marketplace 46% ซึ่ง Growth Agent shape ไม่เข้า marketplace policy |
| AI Configuration Advisor | 3 | ฟังดูดี แต่ vendor พูดแบบนี้ทุกเจ้า ขอเห็น output ก่อนตัดสิน |
| AI Setup Assistant | 3 | One-time value, onboard 2 อาทิตย์เร็วขึ้นเป็น 5 วัน คุ้ม แต่ไม่ใช่ recurring value |
| AI Workflow Builder | 4 | NL → executable rules ใหญ่มากสำหรับดิฉัน ทุกวันนี้ดิฉันต้องเขียน SOP ให้น้องเองทั้ง doc — ถ้าพูด "ทุกครั้งที่ลูกค้าถาม return หลัง 7 วัน escalate มาดิฉัน" แล้ว rule เกิดเอง คือ magic |
| Knowledge Base + Lesson System | 4 | KB ที่ surface ใน inbox view ไม่ใช่อีก tab + lesson auto-extract = ตอบ "Notion ไม่มีคนเปิด" ที่ดิฉันเจอ |
| Intelligence Dashboard | 3 | ดิฉันมี Sheet ของตัวเองอยู่แล้ว ถ้า dashboard ทำได้แค่เท่ากันคือ 3 ถ้าเห็น recurring questions + sentiment trend ที่ Sheet ไม่ทำคือ 4 |

**Would pay extra for:** **AI Workflow Builder** — เพราะ recurring value สูงสุด ทุกอาทิตย์ดิฉันมี policy ใหม่ (refund window, restock fee, voucher rule) ที่ต้องสื่อสารกับ 9 agents ตอนนี้คือ Slack announcement + Notion update + reminder ในมีตติ้งเช้า น้องครึ่งหนึ่งจำผิด ถ้าเขียนเป็น rule ครั้งเดียวแล้ว AI enforce ที่ inbox ระดับ draft = save manager time 4-5 ชม./สัปดาห์ + reduce policy violation. รองลงมาคือ Operations Agent เพราะลด alt-tab ตรง ๆ

## Q13. What would you expect to pay per month? What's the trigger that makes you sign? What kills the deal instantly?

**Pricing expectation:**
ตอนนี้ Zaapi 41,800 บาท/เดือน นี่คือ floor ในใจดิฉัน

ดิฉันจะจ่าย **65,000-90,000 บาท/เดือน** สำหรับ FlowAIOS ถ้า value prop ตรงตามที่คุยมา — นั่นคือ premium 23,000-48,000 บาทเหนือ Zaapi

ทำไม 90k คือ ceiling? เพราะถ้า productivity gain จริง 30% ดิฉันลดทีม 9 → 6 = save 78,000 บาท/เดือน ดังนั้น software cost ไม่ควรเกิน 90k ไม่งั้น net saving หาย กว่า 100k = COO ปฏิเสธทันที ต้องตี business case ใหม่หมด

ถ้าคุณเก็บ per-seat (เช่น 9 seats × 8,000 = 72,000 บาท) acceptable ถ้า per-message volume base ดิฉันต้องคิดเลขเยอะ ๆ ก่อนเซ็น

**Trigger ที่ทำให้เซ็น:**
1. **Pilot 30 วัน** ที่มี success metric ชัด — handle time ลด 25% ขึ้นไป + CSAT ไม่ตก ฟรี หรือ refundable
2. **Reference customer** ในไทย scale คล้าย ๆ เรา ขนาด 1,500-2,500 messages/วัน ไม่ใช่ corporate enterprise และไม่ใช่ solo founder
3. **Live Thai language demo** ที่ดิฉันเอาบทสนทนาจริงของลูกค้าเรามาใส่ตรงนั้น (anonymized) ให้ AI ตอบสด น้อง 2 คนนั่งดูด้วย
4. **Audit log + PDPA compliance doc** เป็นหนังสือ ไม่ใช่ slide
5. **ราคา transparent** — ไม่มี "contact us for pricing" ค่ะ ดิฉันเห็นบน website มา filter ไว้ก่อนติดต่อ

**Deal killers ทันที:**
1. **Annual contract เท่านั้น ไม่มี monthly option** — ดิฉันต้อง prove value ก่อน COO ถึงเซ็น 1 ปี
2. **AI ตอบมั่ว tone ในภาษาไทย** ที่ live demo — เช่น ใช้ "ครับ" ตอบลูกค้าที่ลงท้าย "ค่ะ" หรือ formality สลับ
3. **ไม่มี data residency clarity** — data เก็บ Singapore? US? PDPA implication คนละเรื่อง ถ้าตอบไม่ได้ในมีตติ้งแรก = bye
4. **Vendor ที่ค่อนแคะคู่แข่ง** Zaapi — ดิฉันอยู่กับ Zaapi 18 เดือน ทีมเขาดี ถ้าคุณจะเอาฉันออกจาก Zaapi ขายด้วยของคุณ ไม่ใช่ดูถูก Zaapi
5. **Setup time > 4 สัปดาห์** ทีม 9 คนหยุดเรียน 2 อาทิตย์ก็แย่แล้ว มากกว่านั้น = ROI delay จนไม่คุ้ม

## Q14. What didn't I ask about that matters more?

ขอบคุณที่ถามคำถามนี้ค่ะ มีสองเรื่อง

**หนึ่ง — เรื่อง agent welfare ไม่ได้ถูกถามเลย**

ทุกคนถามเรื่อง productivity, handle time, CSAT แต่ไม่มีใครถามว่า "AI assistant ตัวนี้จะทำให้ทีมของฉันรู้สึกยังไง?" สำหรับดิฉันมัน critical

ถ้า AI draft ทุก message — น้อง feel ว่า skill ตัวเองถูก commoditize อาจ disengage หรือ feel ว่าตัวเองโดน replace ในไม่ช้า turnover พุ่งไม่ใช่ลดลง

ถ้า AI draft แล้ว flag ว่า case นี้ "low confidence — agent ลองเอง" น้องรู้สึก trusted, ได้ชาเลนจ์ AI กลายเป็น co-pilot ไม่ใช่ overseer

**Question I'd want vendor to answer:** "ทีมของลูกค้า reference คุณ — turnover ดีขึ้นหรือแย่ลงหลัง deploy?" ถ้าไม่มี data = red flag

อีกมุมคือ career path — ถ้า AI ทำงาน tier-1 ทีมเก่าจะ upskill ไปทำ tier-2 อะไร? ดิฉันต้องสร้าง role ใหม่ "AI training specialist" ในทีม? Vendor มี playbook ไหม?

**สอง — Failure mode + offboarding**

ถ้าดิฉันใช้ FlowAIOS 6 เดือนแล้วเลิก ดิฉันเอา customer memory + conversation history + extracted lessons ออกมาในรูปแบบไหน?

Zaapi export ได้เป็น CSV เฉย ๆ ซึ่งโอเคไม่ดีไม่แย่ แต่ FlowAIOS มี "memory" + "lesson" ที่ unique ถ้าดิฉันสร้าง IP สะสมไว้ในนั้น 6 เดือน แล้วเลิกแบบ vendor lock-in ที่เอาออกไม่ได้คือดิฉันโดน hostage

**Question vendor ต้องตอบ:** "Day 1 of cancellation — what does data export look like? Format? Time? Cost?"

ถ้าตอบโปร่งใส = trust ถ้าตอบเลี่ยง = ดิฉันไม่เซ็น

นี่คือสองเรื่องที่ดิฉันคาดว่าจะไม่ค่อยมีใครถาม แต่กระทบ decision จริงค่ะ

---

## Interviewer field notes (out of character)

- **H10 strongly validated.** Pim called confidence-gating "the right answer" and explicitly tied it to her "AI ตอบเองไม่ได้" objection in the persona card. This is the wedge for ops-manager segment, not unified inbox.
- **H2 partially invalidated.** Unified inbox alone is table-stakes (Zaapi already does it). Wedge = unified inbox **+ confidence-gating + channel-specific UX**. Repositioning needed: lead with confidence-gating, treat inbox parity as proof-of-credibility not differentiator.
- **H3 (memory) gated by PDPA + memory governance.** She wants it but listed 4 hard requirements (editor, confidence on memories, customer-visible delete, category separation). Without these, feature is creepy not useful. Roadmap implication: ship memory governance UI before pushing memory as differentiator.
- **Pricing anchor: ~75K THB/mo (range 65K-90K), capped at 90K** by the ROI math (3-FTE save = 78K saving). COO approval threshold of 30K is a soft floor. Above 90K requires fresh business case = friction.
- **Surprise: AI Workflow Builder ranked equal-top with Operations Agent and KB+Lesson** — not the headline feature in our positioning. NL-to-rules is a high-leverage wedge for managers (not just ops execs) because it lets one person codify policy across a team. Worth promoting in top-of-funnel messaging for the manager persona.
- **Non-obvious signal: agent welfare + offboarding (Q14).** Buyer is asking "will my team quit?" and "can I leave?" Neither is in the current marketing. Add reference-customer turnover delta + data-export commitment to sales collateral — both look like trust accelerants for risk-averse mid-market buyers.
- **H1/H6 (dark + warm orange) validates for ops-manager but with a caveat:** offer light-mode for line agents. The buyer ≠ the daily user; persona splits matter for theme.
