# Discovery — needs surfaced that aren't in the current slate

**Source:** Q14 ("what didn't I ask?") + the unsolicited threads each persona returned to.

These are needs FlowAIOS does not currently address (or addresses weakly) that surfaced in 2+ persona interviews. Ranked by cross-persona reach.

## Tier 1 — surfaced in 4+ personas

### 1. Buyer-mode vs operator-mode skinning

**Surfaced by:** Pong, Tan, Aoy, Krit, Win-buyer-side (5 personas).

The dark "Operations Cockpit" aesthetic works for the daily operator. It loses the buyer in healthcare, agency-fashion-clients, solo, and education-principal contexts. Personas requested either a light-mode toggle, a "buyer view" of the homepage, or simply hiding the dark UI from the prospecting flow.

Implication: ship two homepage treatments and consider a per-org daily-driver theme override. This is the single most consistent design signal in the study.

### 2. PDPA control plane as a first-class product surface

**Surfaced by:** Pong (decisive), Pim, Tep, Aoy-implicit (4 personas, 1 implicit).

Memory + auto-extraction creates PDPA exposure. Pong demanded as non-negotiable: signed DPA, Thailand or Singapore data residency, zero-retention LLM contract, 30-day deletion default, manual fact-approval queue for first 90 days, exportable audit log. Pim asked about memory portability ("export memory if I leave"). Tep's Japanese clients require data residency in Thailand or Japan.

Implication: PDPA is not a compliance bolt-on; it is an unlock for high-LTV personas. Build a control plane: per-org residency selection, retention controls, fact-approval queue mode, exportable audit log, DPA template generator.

### 3. Conversation handoff card (AI → human)

**Surfaced by:** Nat (decisive — her Q14), Pim (her #1 escalation pain), Pong (clinical escalation), Tep (quote-escalation) (4 personas).

When AI hands a conversation to a human, the human currently arrives blind. They need a one-card summary on arrival: conversation history compressed, AI's reasoning ("escalating because customer mentioned 'lawyer'"), suggested reply, customer memory in the same view.

This was Nat's Q14 — *what didn't I ask about that matters more.* It's also Pim's top operational pain. Cheap to build, addresses two strong-fit ICPs directly.

### 4. Channel-set-per-vertical configuration

**Surfaced by:** Pong, Tep, Aoy, Krit, Win (5 personas).

The visible Shopee + Lazada + TikTok chips on the homepage *actively repel* non-ecom buyers. Personas wanted to either hide non-relevant channels or have vertical-specific defaults (healthcare = LINE only; F&B = LINE + aggregators; B2B = LINE + email).

Implication: build a per-vertical channel-set config and reflect this in marketing — let the homepage adapt to a "what's your industry?" pre-selection, or ship vertical-specific landing pages.

## Tier 2 — surfaced in 2–3 personas

### 5. Identity unification (same customer across channels)

**Surfaced by:** Pong, Pim (2 personas).

Customer X is on LINE under one alias and on Instagram under another. Memory is more valuable when tied to a *person*, not a channel handle. Pong wants this for cross-branch booking; Pim for cross-platform CSAT continuity.

Implication: customer-identity resolution is a deeper investment than memory. Worth a design spike.

### 6. Promo broadcast intelligence + campaign trigger detection

**Surfaced by:** Krit (decisive), Win (his Q5), Tan (3 personas).

"This is the #1 question on LINE OA this week — want to send a campaign?" maps to all three. Krit explicitly: "I'm using 280k LINE followers like an email list — embarrassing." Win wants weekly campaign-trigger insights. Tan wants this packaged as monthly client-facing reports.

Implication: fold this into the Intelligence Dashboard rather than a separate Growth Agent. Make the broadcast trigger a one-click action from the dashboard.

### 7. Branch / outlet / multi-location awareness

**Surfaced by:** Pong (5 branches), Krit (12 outlets), Pim (2 concept stores) (3 personas).

Routing by branch availability, branch-specific pricing, branch-specific staff. Currently the persona models don't see this in FlowAIOS. Pong's #2 pain.

Implication: multi-location is its own first-class concept — branch entity in the data model, branch-aware routing rules, branch-level reporting. Cross-cuts inbox + booking + reporting.

### 8. Agency multi-tenant cockpit + reseller economics

**Surfaced by:** Tan (decisive), implicit-cross-persona (most personas would benefit from being managed by an agency early in lifecycle) (1 strong + cross-cutting).

True multi-tenancy (single login, switchable client orgs, isolated data, per-client config), reusable persona library across clients, white-label client-facing reporting, partner/reseller program.

Implication: this is a year-2 distribution play. If pursued early, it forces architectural decisions (data isolation model, billing model) that are easier to design in than to retrofit. Worth scoping a spike even if shipping is deferred.

### 9. Mobile-first single-app for owner-operators

**Surfaced by:** Aoy, Win, Nat (her phone-approval flow), Krit-implicit (3–4 personas).

Aoy runs everything from her Galaxy A54 — no laptop in her kitchen. Win runs marketing from his phone half the time. Nat described "approving drafts in batch from my phone at 10pm" as the trigger that takes out her credit card.

Implication: a focused mobile experience is a wedge, not a port. Specifically: AI-draft approval queue + customer-memory view + escalation ping — all phone-first.

## Tier 3 — single-persona but high-strategic-value

### 10. Aggregator gateway (Grab / Robinhood / LineMan / Foodpanda)

**Surfaced by:** Krit only — but this is 60% of his order volume and the single largest unaddressed pain in the F&B vertical.

A bridge that lets a customer ask "where's my order?" on the merchant's LINE OA and gets an answer *from the aggregator's tracking system.* Currently Krit just tells customers "go check Grab." If solved: massive CSAT lift + supports retention via LINE rather than the aggregator.

Implication: high-effort vertical investment. Defer until F&B ICP is confirmed; then it's a defining moat for that vertical.

### 11. SAP B1 / ERP write-back integration with multi-modal input parsing

**Surfaced by:** Tep only.

Read-and-write SAP B1, parse photos + PDFs + Excel into SKU lookups, draft quotes for human approval. Hugely high-value but vertical-specific. Defer; revisit when funding a "FlowAIOS Industrial" vertical edition.

### 12. PromptPay-as-recurring-billing

**Surfaced by:** Aoy.

Thai SMB at the small end doesn't want recurring credit-card billing. PromptPay every month or annual upfront is the norm.

Implication: small lift, removes a friction blocker for the bottom-of-market tier. Worth doing if Setup Assistant is being shipped.

### 13. Reservation-aware booking flows

**Surfaced by:** Krit (table reservations), Pong (clinic appointments) (2 personas, but in different verticals).

Both want AI to check calendar availability and confirm bookings without human intervention for the easy slots. Different integrations, similar shape.

Implication: a generic "calendar lookup + book" capability could serve both verticals if abstracted at the right layer.

### 14. Tutor / agent co-write (real-time AI assist while a human types)

**Surfaced by:** Win, implicit Pim.

Not auto-reply. Not draft-for-approval. The human is typing; AI suggests next sentence, factual completions, tone adjustments.

Implication: a different interaction model than the current confidence-gated flow. Worth a small experiment for the personas that won't let AI auto-reply at all.

### 15. Vendor liability indemnification

**Surfaced by:** Pong (decisive).

For clinical-boundary violations: "Who is liable if AI gives wrong clinical advice and we get fined?" Asks for vendor contractual indemnification.

Implication: a procurement / legal feature, not a product feature. But it gates the deal. Add to enterprise sales playbook.

---

## Cross-cutting insight

Six of the top 9 discovery items relate to **environment-shaping, not core conversation handling.** PDPA controls, branch-awareness, channel-set config, multi-tenancy, mobile-first, buyer-vs-operator skin, broadcast intelligence — these are about *fitting into the buyer's reality* rather than improving the AI's reply quality.

The reply-quality layer (M1.2–1.4) is largely validated. The *fit-to-context* layer is where the next ICP-specific gains live.
