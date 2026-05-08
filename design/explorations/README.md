# CRMOS360 — Design direction explorations

Three differentiated hi-fi prototypes for the CRMOS360 homepage. Each implements
the **same Hero + AI Agents section** with copy taken verbatim from
`crmos360-homepage-demo.html` so you can compare design treatments of identical
content. All three are single-file HTML, system fonts only, no external deps.

| | Direction 1 — Editorial | Direction 2 — Calm Computing | Direction 3 — Operations Cockpit |
|---|---|---|---|
| **Philosophy** | Pentagram editorial × Phaidon × Browser Co. | Kenya Hara × MUJI × restraint | Linear × Granola × command center |
| **School** | Information architecture | Eastern philosophy / minimalism | Motion poetics (warm dark) |
| **Mode** | Light, paper-feel | Light, off-white | Dark, charcoal + warm accent |
| **Display type** | Serif (New York / Georgia fallback) | Inter, light weight, expansive leading | Inter, semibold, tight tracking |
| **Body type** | Inter | Inter | Inter |
| **Mono** | JetBrains Mono — figures, kickers, tags | (rare) | JetBrains Mono — tags, file paths, numbers |
| **Primary color** | Ink `#16140F` on Paper `#F7F4ED` | Deep teal `#0E5050` on Off-white `#FAFAF7` | Soft white `#F4F2EC` on Charcoal `#0E1116` |
| **Accent** | Burnt orange `#B05A2A`, Sage `#4A6B47` | Single teal accent, Blush `#E5BFB0` whisper | Warm orange `#F4A663`, Mint `#7CD9B5` success |
| **Hairlines** | Heavy use — newsprint dividers everywhere | Quiet — only on conversation rows | Subtle — `#232B3A` lines on dark |
| **Hero illustration** | Magazine "Fig. 01" specimen with editorial caption | Quiet whitespace mock with hairline dividers | Terminal/IDE-style window with traffic-light dots, scan-line grid |
| **Agent tabs treatment** | Vertical chapter sidebar (I, II, III) with burnt-orange selected indicator | Stacked accordion rows that expand inline | Horizontal segmented tabs with warm underline + status pill |
| **Motion** | Opacity fades, underline reveals on hover | Slow opacity, `.4s` minimum, no springs | Smooth `.2s` hovers, mint pulse on status, lift on CTA |
| **Density** | Medium — narrow column inside generous margins | Low — almost zen | Medium-high — info-rich, ops-grade |
| **Personality keywords** | Considered · Founder-led · Editorial | Premium · Quiet · Trustworthy | Engineered · Capable · Modern |
| **Pairs well with** | A founder/agency selling thoughtful B2B | A premium SaaS targeting CFO/COO buyers | A power tool for ops/support managers |

---

## When to choose each

### Direction 1 — Editorial
Pick this if CRMOS360's positioning is **"the considered choice for SEA SMB
operators who care about craft."** Reads like a Sunday Magazine essay. The
serif display is rare in B2B SaaS, which makes it memorable. Burnt orange +
sage gives warmth. Risk: if the audience is younger / faster / more
engineering-driven, the editorial tone can read as slow.

### Direction 2 — Calm Computing
Pick this if you want to project **quiet authority**. Almost no UI noise. Every
element earns its place. The single-teal accent is restrained but premium.
Reads as Apple-product-page-quiet, but with Thai content built in. Risk: in
SEA B2B, "too clean" can read as "thin" / "missing details" — buyers want to
see substance. Mitigation: the agent rows expand into rich detail, but you
have to click.

### Direction 3 — Operations Cockpit ⭐ recommended
Pick this if CRMOS360 is positioned as **the command center for customer ops
teams** — which the demo's IA strongly suggests (Inbox, Backoffice,
Configuration Advisor, Workflow Builder, Lessons). The dark UI signals "tool,
not website." Warm orange + mint keeps it from feeling cyberpunk. The terminal
hero reads like Linear/Cron/Granola — instantly familiar to SaaS-buying
operators. JetBrains Mono accents on numbers/tags makes the data feel real.

---

## My recommendation: Direction 3 — Operations Cockpit

**Reasoning specific to SEA B2B:**

1. **The product lives in a dark inbox.** Operators stare at LINE OA / Shopee
   chat panels all day. A homepage that previews a dark, dense inbox is
   contiguous with their tool — it says "this is what your day looks like
   here." Light-mode editorial homepage → dark-mode inbox is jarring.

2. **It signals "engineering-grade" without coldness.** The warm orange accent
   (vs neon cyan/violet) reads as confident-warm, not techbro-cyberpunk. Thai
   business culture rewards warmth; pure-cold cockpit dashboards (Datadog,
   Grafana) feel foreign. The orange + mint combo lands in a sweet spot Linear
   discovered for SEA Linear users.

3. **Density matches the audience expectation.** SEA SMB operators are price-
   sensitive — they need to see *what they're paying for* on the homepage.
   Direction 3's dense terminal-style hero shows 6 channels, 4 conversations,
   2 intelligence cards, status pulse, confidence bar — all in the visible
   above-fold space. Direction 1 shows similar density but in editorial wrap;
   Direction 2 deliberately strips density. For "show me what this does" 
   buyers, density wins.

4. **It scales gracefully into the actual product.** The same charcoal + warm
   accent + JetBrains Mono palette will work as the in-app inbox theme for
   Phase 1.3+. Directions 1 and 2 would need a second dark variant for the app
   shell, doubling token maintenance. Direction 3's tokens can drive both
   marketing and product surfaces.

5. **Thai typography reads well in this aesthetic.** Inter at 14-16px on
   `#F4F2EC` over `#0E1116` has higher contrast than ink-on-paper at the same
   size, which helps Sukhumvit Set / Noto Sans Thai fallbacks render cleanly
   without the body feeling crowded.

**Trade-offs to accept:**
- Dark mode primary means a separate light-mode treatment for any embed/email
  (Phase 1.7 territory)
- Less differentiated against other dev-tool-style SaaS homepages (Linear,
  Cron, Granola, Raycast). But: most CRM/customer-ops competitors in SEA
  (Zaapi, Manychat, Wisible) use bright colorful 2018-era illustrations —
  going dark+considered is unique in *this* category.

---

## How to review

Open all three:

```bash
open /Users/oui/CRMOS360/design/explorations/direction-1/index.html
open /Users/oui/CRMOS360/design/explorations/direction-2/index.html
open /Users/oui/CRMOS360/design/explorations/direction-3/index.html
```

Try each at desktop width and at 375×812 (iPhone). All three handle responsive
breakpoints. Click the agent tabs to see how each treats interaction.

Once you pick a direction, we move to **Phase 2 — extract design tokens into
Tailwind config + globals.css + load Inter/Noto Sans Thai fonts** before
building the real Next.js landing page.

You can also mix and match — e.g. *"Direction 3's palette + Direction 1's
serif headlines"* is a valid hybrid. Tell me how you want to fork.
