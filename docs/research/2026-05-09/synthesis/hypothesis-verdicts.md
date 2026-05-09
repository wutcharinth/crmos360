# Hypothesis Verdicts

**Source:** 8 synthetic interviews, Thai market, 2026-05-09.
**Verdict scale:** Validated (V) · Mixed (M) · Invalidated (I) · Not directly tested (N).

## Summary table

| ID | Hypothesis | Verdict | Cross-persona signal |
|---|---|---|---|
| H1 | Dark ops-cockpit UI beats friendly bot UI | **Mixed** | Wins for ops/B2B/founder buyer; fails for solo, healthcare, agency-fashion clients |
| H2 | Unified multi-channel inbox is the wedge | **Mixed → reframe** | Table-stakes for ecom, irrelevant for non-ecom; confidence-gating is the actual wedge |
| H3 | Customer memory is a self-improving wedge | **Validated, PDPA-gated** | Lights-up moment for B2B/clinic; non-negotiable PDPA scaffolding required |
| H4 | Three-agent model (Service/Ops/Growth) is intuitive | **Under-tested → mixed** | OK for mid-market; confusing for solo / non-commerce verticals |
| H5 | "AI OS" framing beats "AI chatbot" | **Mixed** | Helps internal sell to mid-market buyers; deck-language to solo / owner-operator |
| H6 | Warm orange + mint on dark = engineering-grade + approachable | **Mixed** | Reads "developer tool" for healthcare/fashion brand contexts |
| H7 | Backoffice = table-stakes; Learning layer = differentiation | **Validated** | Universal — KB+Lessons highest-rated planned feature |
| H8 | Thai SMB price-sensitive + demand visible density | **Bifurcated** | Density wins for ops/B2B; bounces solo + brand-led buyers |
| H9 | LINE-first + multi-channel adjacency is right ordering | **Mixed** | True for ecom; non-ecom personas want non-LINE channels *hidden*, not adjacent |
| H10 | Confidence-gated auto-reply is the trust unlock | **Strongly validated** | 8 of 8 personas — strongest signal in the study |

---

## H1 — Dark ops-cockpit UI beats friendly bot UI

**Verdict: Mixed (split by buyer role).**

**Validated for:**
- **Pim (CS manager, fashion ecom):** "Looks enterprise enough that Khun Anucha won't reject it. The density signals 'serious tool.'"
- **Tep (B2B veteran):** Likes the engineering-grade density. Calls it "ดูเหมือน CAD/ERP มากกว่า chatbot — ดี" — signals a tool, not a toy.
- **Nat (founder):** "Looks like Linear or Cron. I trust this aesthetic."
- **Win (marketing manager, personally):** Loves the Linear/Vercel coding.

**Invalidated for:**
- **Aoy (solo Chiang Mai):** "ดูยุ่งจังค่ะ. ไม่ใช่สำหรับพี่. ดูเป็นบริษัทใหญ่." Bounces in seconds.
- **Pong (healthcare):** "Looks like a developer tool. My admin team is 22 women aged 35–55. They'll resist. And the brand signal is wrong for a clinical brand."
- **Tan (agency):** "I have 4 fashion clients and 3 beauty clients. Dark + orange = wrong palette for half my book. They'd reject this in client review."
- **Win (buyer-side veto):** "I love it; my owner-principal will read 'geeky' and veto. She's 54, education sector, expects clean white SaaS."
- **Krit (restaurant chain owner-ops):** "Scary for owner-operators. Maybe fine for my ops manager."

**Implication:** Ship a buyer-mode (light, softer) and an operator-mode (current dark cockpit). The buyer signs the contract; the operator uses it 8 hours a day. Conflating those two audiences in a single visual treatment is the error.

---

## H2 — Unified multi-channel inbox is the wedge

**Verdict: Mixed → reframe.** Unified inbox is *table-stakes* (Zaapi parity), not the wedge. The actual wedge is **confidence-gated reply with memory-aware escalation**, which works on a single channel.

**Validated as table-stakes:**
- **Nat:** "I literally toggle four tabs. Yes, I want one inbox."
- **Pim:** "Zaapi already does this. So minimum-viable bar."

**Re-framed as the actual wedge by:**
- **Pim explicitly:** "The wedge isn't multi-channel — Zaapi has that. The wedge is the AI-draft + approval flow."
- **Pong:** Asks for *identity unification* (same customer across channels) over channel unification.

**Invalidated for non-ecom:**
- **Tep (B2B):** "Multi-channel is irrelevant — value 3/10. We have LINE and email, that's it. The visible Shopee/Lazada/TikTok logos actively repel me."
- **Pong:** "Hide Shopee/Lazada/TikTok chips on my homepage. They don't apply."
- **Aoy:** "I'm LINE-only by choice. The whole pitch doesn't apply."
- **Krit:** Channels on the demo are wrong — his real channel pain is aggregators (Grab/Robinhood), not Shopee.

**Implication:** Lead with confidence-gated reply (H10) as the wedge. Treat unified inbox as a per-vertical configurable feature with channel sets the user can hide.

---

## H3 — Customer memory is a self-improving wedge

**Verdict: Validated — but PDPA-gated.**

**Lights-up moments (the strongest reaction in their interview):**
- **Tep (B2B):** Solves the "knowledge in one employee's head" risk. "ถ้าพี่อ้อยลาออก เราเจ๊ง — ระบบนี้แก้ปัญหานั้น." Rated 5, would pay extra.
- **Win:** Parents have specific contexts (child's school, target exam) — memory is the unlock.
- **Pim:** Good *if* memory has audit log + agent-edit history.

**PDPA-gated by:**
- **Pong (healthcare):** Auto-extracted memory is a PDPA section-26 sensitive-data landmine. Requires: signed DPA · Thailand or Singapore data residency · zero-retention LLM contract · 30-day deletion default · manual approval of extracted facts for first 90 days. Without these: hard no.
- **Pim:** "Can I export memory if I leave?" — portability is non-negotiable.

**Implication:** Customer memory is real. Ship it with a PDPA control plane: per-org data residency selection, fact-approval queue mode, retention controls, exportable audit log. This unlocks the high-LTV regulated personas.

---

## H4 — Three-agent model (Service / Ops / Growth) is intuitive

**Verdict: Under-tested → mixed.** Personas reacted to the *feature slate* directly rather than the agent grouping.

**Where the agent split mapped naturally:**
- **Pim, Tep:** Service vs Ops distinction is intuitive (their teams are organized that way).

**Where it didn't:**
- **Aoy, Win:** Solo / small operations don't think in "agents." They want "ระบบ" that does everything. Three-agent split adds cognitive overhead.
- **Win:** Operations Agent doesn't apply to tutoring (no orders to look up). The split forced him to mark Operations Agent 2/5 even though parts of it are useful — the agent grouping created a false binary.

**Implication:** For mid-market and above, the agent model is fine. For solo / non-commerce verticals, lead with "AI staff member" framing and let users opt into capabilities, not agents.

---

## H5 — "AI OS" framing beats "AI chatbot"

**Verdict: Mixed.**

**Helps internal sell to:**
- **Pim:** "OS" framing helps her present to her COO. "Chatbot" sounds like a Manychat downgrade.
- **Pong:** Buys the concept — sees it as bigger than chat.
- **Tan:** OS framing differentiates from his existing tooling.

**Reads as deck language to:**
- **Aoy:** "OS เหมือน iOS เหรอคะ? ไม่ใช่สำหรับพี่."
- **Krit:** "ตรงๆ นะ ผมไม่อิน OS หรอก. บอกตรงๆ ว่ามันทำอะไรให้ผมก็พอ."
- **Nat:** "Show me, don't tell me. 'OS' is what enterprise sales decks say."

**Implication:** Keep "AI OS" for mid-market+ (Pim, Pong, Tan). Ship a parallel "AI staff that handles your LINE OA" framing for solo/founder/owner-operator (Nat, Aoy, Krit).

---

## H6 — Warm orange + mint on dark = engineering-grade + approachable

**Verdict: Mixed.**

**Validated for:** Tep, Pim, Win-personally — reads as "tool, not toy."

**Invalidated for:** Pong (healthcare brand mismatch), Tan (fashion/beauty clients reject), Aoy (overwhelming).

**Notable signal from Tan:** He flagged the actual demo palette as "mint/lime/sage" rather than "dark charcoal + orange terminal." Worth verifying the demo file matches the design exploration's stated palette — if there's drift, fix it before the next round.

**Implication:** Treat the design system as multi-skin from the start. Vertical-aware skinning isn't optional.

---

## H7 — Backoffice = table-stakes, Learning layer = differentiation

**Verdict: Validated.**

- **Krit:** "Surfacing 'this is what to automate next' is what I'd pay for. Inbox is just an inbox."
- **Tep:** Knowledge Base + Auto-Lessons rated 5. "If the system captures customer institutional knowledge, that's the moat."
- **Pong:** KB + Lessons rated 5 — required for clinical-vs-non-clinical rule library.
- **Nat:** KB + Lessons rated 4 — tied with Operations Agent.
- **Pim:** "Audit trail + lessons is what makes my COO trust this."

**Implication:** Continue investing in the Learning layer. KB + Lessons is the highest-rated planned feature in the study (avg ~4.4/5).

---

## H8 — Thai SMB price-sensitive + demand visible density

**Verdict: Bifurcated by sophistication tier.**

- **Density-wins tier:** Tep (B2B veteran), Pim (ops manager), Nat (founder), Win (marketing-savvy). They translate density into "I see what I'm paying for."
- **Density-loses tier:** Aoy (solo, low tech maturity), Pong (brand-led, high tech maturity but wrong vertical signal), Tan-via-his-clients (fashion/beauty owner-operators).

**Implication:** "Density wins" is true for the operator-buying-the-tool. It's false for the brand-buyer or the low-sophistication owner-operator. Ship two homepage treatments minimum.

---

## H9 — LINE-first + multi-channel adjacency is right ordering

**Verdict: Mixed.**

**LINE-first validated by everyone.** No persona pushed back on LINE OA being the anchor channel.

**Multi-channel adjacency contested:**
- Ecom personas (Nat, Pim) want Shopee + TikTok + Lazada visible — validated.
- Non-ecom personas (Pong, Aoy, Tep, Krit) want non-LINE channels *hidden*. The visible chips actively communicate "this tool isn't for me."
- Win wants Facebook DMs treated as first-class, not as an afterthought.

**Implication:** LINE OA is the universal anchor. Channel adjacency must be vertical-aware: defaults differ by industry, and users can hide channels they don't use. Avoid a one-size-fits-all "all channels everywhere" homepage.

---

## H10 — Confidence-gated auto-reply is the trust unlock

**Verdict: Strongly validated.** 8 of 8 personas. Strongest signal in the study.

Sample reactions:
- **Pim:** "This is the answer I've been waiting for. I won't let AI auto-reply to everything, but high-confidence cases? Yes."
- **Pong:** "This is the perfect mechanism for the clinical-vs-non-clinical boundary."
- **Nat:** "Approving drafts in batch from my phone at 10pm? Take my money."
- **Tep:** "Three tiers — auto / draft / escalate — that's how we already think about quote turnaround."
- **Aoy:** "ระบบตอบให้ที่ตอบได้ ที่ไม่ได้ส่งให้พี่ดู — เออ ใช้ได้."
- **Krit:** "This is the trust unlock. AI handles 80%, I handle weird stuff."
- **Win:** "Confidence-gated is what unblocks parents-asking-about-exams cases."
- **Tan:** Validated, but with a twist — wants per-client / per-intent thresholds.

**Implication:** Confidence-gated auto-reply is the leading wedge. Lead with it on the homepage. It's already shipped (M1.3) — make sure marketing leads with this, not "unified inbox."
