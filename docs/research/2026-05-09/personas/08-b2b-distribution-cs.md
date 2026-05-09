# Persona 08 — CS lead, B2B industrial distribution, Samut Prakan

## Identity

**Name:** Suthep "Tep" Boonrueang
**Age:** 47
**Role:** Customer Service / Inside Sales Lead (reports to Sales Director)
**Education:** Vocational diploma in industrial engineering; 22 years at the company, started in the warehouse, worked his way up. Not "tech-forward" by his own admission.

## Company snapshot

**Company:** "Boonrueang Engineering Supply" — B2B distributor of industrial fasteners, fittings, and electrical components. Sells to factories, contractors, MEP firms, automotive Tier 2/3 suppliers.
**Location:** Samut Prakan (warehouse + office on the same lot).
**Headcount:** 60 staff total. Tep manages an inside-sales / CS team of **6 people** (3 senior account handlers + 2 junior + 1 admin).
**Monthly revenue:** ~28M THB (~$795k USD), 80% repeat-order business with a known customer base of ~340 active accounts.
**Channels:**
- **LINE OA + LINE 1-on-1** — 70% of inbound order/quote requests come via LINE. Customers send product photos, Excel files, and rambling messages.
- **Email** — 20% of inbound (the more "formal" customers, especially Japanese and Korean MNCs).
- **Phone** — 10%, mostly urgent re-orders.
- **No e-commerce channels.** Their customers don't buy on Shopee.
**Conversation volume:** ~180 LINE messages + 60 emails/day. Tickets are *high-value* (avg 8,500 THB; some hit 200,000 THB).

## Current stack

- **LINE OA Premium** + a few staff using personal LINE accounts to chat with long-time customers (a problem Tep knows about and hasn't fixed).
- **SAP Business One** as ERP (orders, inventory, pricing).
- **Excel + email** for quote generation. The senior team builds quotes manually from SAP B1 lookups.
- **Microsoft Teams** internal.
- **No CRM** beyond SAP B1's basic customer master.
- **No AI**, no chatbot, no automation tools. Tep tried Manychat once, gave up.

## Day-in-the-life pain (Tep's words, condensed)

> "ลูกค้าส่งรูปนัทเข้ามาทาง LINE: 'มีตัวนี้ไหมครับ ขนาดเท่านี้ จำนวน 200 ตัว' พนักงานเราต้องเปิด SAP เช็ค SKU ดูสต็อก ดูราคาตามเทียร์ลูกค้า แล้วตอบกลับ. ใช้เวลา 20 นาทีถึง 2 ชั่วโมงต่อรายการ. คนของผม 6 คน ทำได้ราว 80–100 quotes ต่อวัน. ลูกค้าใหม่ๆ บางคนก็รอไม่ไหว ไปเจ้าอื่นเลย.
>
> ปัญหาที่ใหญ่กว่า: ลูกค้าเก่า 340 ราย เรารู้ใจเขาหมด — เขาชอบสเปคไหน ราคา tier อะไร ส่งที่ไหน — แต่ความรู้นี้อยู่ในหัวพนักงานคนเดียว. คุณสมศักดิ์ ลูกค้าเก่า 15 ปี ดิวกับพี่อ้อยเท่านั้น. ถ้าพี่อ้อยลาออก เราเจ๊ง.
>
> ถ้า AI สามารถ: 1) อ่านรูปและข้อความเข้าใจว่าลูกค้าต้องการอะไร 2) เช็ค SKU ใน SAP 3) ดึงราคา tier ลูกค้ารายนั้นอัตโนมัติ 4) ร่าง quote ส่งให้พนักงานเรา approve — นั่นเปลี่ยนธุรกิจเรา. ตอนนี้เราเสียลูกค้าเพราะตอบช้า.
>
> แต่ผมไม่เชื่อว่ามันจะใช้ได้กับ B2B industrial. AI tools ที่ดูมา ตัวอย่างใช้งานเป็น beauty, fashion, food หมดเลย. industrial fasteners ใครจะมาทำให้?
>
> งบ — ตามจริง บริษัทจ่ายได้เดือนละ 30,000–80,000 บาท ถ้าเห็นชัดว่าลด lead time. SAP ค่า license เดือนละ 60,000 อยู่แล้ว ก็ไม่ได้บอกว่าจ่ายไม่ได้. แต่ต้องเห็นว่าใช้ได้กับธุรกิจเรา."

## Budget authority

- **Decision-maker:** Tep recommends, Sales Director and CFO co-approve. Conservative procurement.
- **Comfort zone:** 30,000–80,000 THB/mo. Will pay more if SAP B1 integration is real.
- **Procurement style:** Slow. Vendor due diligence. Wants on-prem / private deployment option ideally. PDPA + data residency matter.
- **Hard ceiling without ROI proof:** 100,000 THB/mo.

## Decision criteria (ranked)

1. **SAP Business One integration** — read SKU + pricing + customer master. Without this it's just a chatbot.
2. **Multi-modal input handling** — customers send photos, PDFs, Excel files. AI must parse all three.
3. **B2B-aware** — quote generation, tier pricing, delivery scheduling. Not consumer-y.
4. **Customer memory institutional knowledge.** Captures "what does this customer always order, who do they buy through, what payment terms."
5. **PDPA + data residency** in Thailand or Japan (some Japanese clients require it).
6. **Thai language with technical/industrial vocabulary.** Must handle product specs ("M8 x 30mm hex bolt grade 8.8").

## Default objections (the things he reaches for first)

- *"AI tool ที่เห็น ใช้กับ B2B industrial ได้จริงไหม? ตัวอย่างเขามีแต่ ecom"* — "Every AI tool's example is ecom. Show me one that handles industrial."
- *"ผูกกับ SAP B1 ได้ไหม? ถ้าไม่ได้ก็ไม่มีประโยชน์"* — "If it can't talk to SAP B1, it's pointless."
- *"AI อ่าน PDF spec sheet ได้ไหม? ลูกค้าส่ง PDF เยอะ"* — "Does it parse PDF spec sheets? Customers send those constantly."
- *"data ของลูกค้าเก็บที่ไหน? บางลูกค้าญี่ปุ่นกำหนด data residency"* — "Where is customer data stored? Some Japanese clients require Thailand or Japan residency."
- *"มี case study B2B distribution ไหม?"* — "Show me a B2B distribution / industrial reference customer."

## Speech style for roleplay

Mostly Thai with industrial/SAP jargon ("SKU", "tier", "spec", "lead time", "BOM", "quote", "PO"). More formal than the consumer personas — uses "ครับ" not "คะ", "ผม" not "พี่." Speaks slowly, methodically. Veteran tone. Will mention "22 ปีที่นี่" ("22 years here") to anchor authority. Skeptical of trendy tech but recognizes business pain. Says "ตามจริง" ("honestly") to signal he's about to be blunt.

## What he'd pay extra for (hypothesis going in)

A B2B-aware AI that parses photos/PDFs of part requests, looks up SAP B1 for SKU/price/stock, drafts a quote, and lets staff approve in one tap. Customer memory (planned feature) — auto-captured per-account preferences — would directly address his "knowledge in one employee's head" risk. He stress-tests whether FlowAIOS positioning generalizes beyond ecom or whether it's category-specific. If FlowAIOS can serve him, the TAM expansion is significant; if not, the messaging is tighter than the team thinks.
