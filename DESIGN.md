# FlowAIOS — Design tokens

Two skins, one token grammar. Both implemented as CSS variables in `apps/web/app/globals.css` and consumed via `tailwind.config.ts`. Switching is `<html className="dark">` for cockpit; default `:root` for daylight.

## Skin 1 — Daylight (marketing default, buyer-mode)

Reads as: a Sunday-paper editorial spread that happens to contain product UI. Paper-feel, warm, considered.

### Color (OKLCH-equivalent HSL)

| Role | Token | HSL | Use |
|---|---|---|---|
| Canvas | `--paper` | `60 23% 97%` | Page background |
| Surface raised | `--paper-2` | `51 21% 94%` | Cards, sections |
| Surface deep | `--paper-3` | `47 16% 89%` | Inset, chips |
| Ink primary | `--ink` | `200 13% 9%` | Body, headings |
| Ink secondary | `--ink-2` | `203 5% 31%` | Lead copy |
| Mute | `--mute` | `90 3% 53%` | Labels, mono |
| Hairline | `--hairline` | `48 13% 84%` | Dividers, borders |
| Hairline-2 | `--hairline-2` | `47 8% 64%` | Stronger borders |
| **Warm** (primary accent) | `--warm` | `24 63% 44%` | CTA, brand orange |
| Warm-2 | `--warm-2` | `25 62% 53%` | Hover state |
| Warm-soft | `--warm-soft` | `32 50% 90%` | Tinted backgrounds |
| Mint (success) | `--mint` | `160 52% 36%` | Auto state, success |
| Mint-soft | `--mint-soft` | `148 33% 91%` | Auto pill background |
| Rose (alert) | `--rose` | `357 44% 50%` | Errors, escalations |

**Color strategy:** Restrained. Tinted neutrals (paper, ink) carry the surface. Warm orange is the single brand accent at ≤10% of any composition. Mint is a status color (success / "auto") not a brand color. Rose is rare, alerts only.

**Anti-banned:** never `#fff` or `#000`. Every neutral has a paper/ink hue tint.

## Skin 2 — Cockpit (in-app default, operator-mode)

Reads as: an operations console that respects you. Warm-dark, dense, ops-grade. Linear/Cron coded but with warm orange accent (no cyberpunk).

| Role | Token | HSL | Use |
|---|---|---|---|
| Canvas | `--paper` | `210 22% 7%` (#0E1116) | Page background |
| Surface raised | `--paper-2` | `217 21% 11%` (#141921) | Cards, panels |
| Surface deep | `--paper-3` | `217 24% 14%` (#1B2230) | Inset |
| Ink primary | `--ink` | `52 14% 94%` (#F4F2EC) | Body, headings (warm-tinted off-white) |
| Ink secondary | `--ink-2` | `228 4% 71%` (#B5B6BB) | Secondary copy |
| Mute | `--mute` | `220 7% 47%` (#6E7480) | Labels, mono |
| Hairline | `--hairline` | `220 24% 18%` (#232B3A) | Subtle dividers |
| Hairline-2 | `--hairline-2` | `220 22% 25%` (#303A4D) | Stronger borders |
| **Warm** | `--warm` | `29 87% 67%` (#F4A663) | Brand orange (lifted for dark) |
| Warm-2 | `--warm-2` | `26 76% 60%` (#E58F4A) | Hover |
| Mint | `--mint` | `158 53% 67%` (#7CD9B5) | Auto state, success |
| Rose | `--rose` | `356 67% 71%` (#E78287) | Errors |

**Color strategy:** Restrained-toward-Committed. Charcoal canvas dominates; warm orange carries 5–15% of any composition (CTAs, status pills, hot threads). Mint is reserved for confidence ≥90% / "auto" state.

## Typography

- **Sans:** Inter, weights 300/400/500/600/700. Variable: `--font-sans`.
- **Thai sans:** Noto Sans Thai, weights 300–700. Variable: `--font-thai`. Auto-applied to `:lang(th)` and `[lang="th"]`.
- **Mono:** JetBrains Mono, weights 400/500. Variable: `--font-mono`. Used for labels, file paths, numeric keys, kicker tags.

### Display scale (custom utility classes in `globals.css`)

| Class | Size | Weight | Tracking | Use |
|---|---|---|---|---|
| `.display-xl` | clamp(40, 5.6vw, 78) | 600 | -0.028em | Marketing hero only |
| `.display-lg` | clamp(32, 4.4vw, 56) | 600 | -0.022em | Vertical landing hero |
| `.display-md` | clamp(28, 3.4vw, 44) | 500 | -0.018em | Section openers |
| `.lead` | 16/1.65 | 400 | — | Subhead body, max 56ch |
| `.label-mono` | 11px ALL CAPS | 500 | 0.18em | Kickers, status |

**Hierarchy ratio:** ≥1.5x between consecutive scale steps. No flat scales.

## Layout

- **Marketing container:** `w-[min(1240px,calc(100%-48px))]` for hero/wide content; `w-[min(1080px,calc(100%-48px))]` for body sections; max 65–75ch for prose.
- **In-app container:** typically `max-w-6xl` or `max-w-7xl` with `px-6` to `px-8`. Inbox uses no container — it's edge-to-edge for density.
- **Spacing rhythm:** vary deliberately. Section vertical spacing: `py-9` (compact) → `py-12`/`py-14` (medium) → `py-16`/`py-20` (generous). Don't repeat the same value across consecutive sections.
- **Cards:** used sparingly. Default to: full borders, rounded-xl, no nested cards. Avoid identical-card grids — break the pattern with sizing or layout variation.

## Elevation

- `shadow-soft` — `0 4px 16px rgba(20,24,26,0.04)` — gentle marketing card lift.
- `shadow-cta` — `0 12px 28px rgba(184,99,42,0.22)` — primary button on hover.
- `shadow-terminal` — `0 28px 70px rgba(20,24,26,0.10), 0 8px 22px rgba(20,24,26,0.06)` — hero terminal artifact.

Restrict shadow palette to these three. No additional ad-hoc shadow values.

## Motion

- **Duration:** 200ms standard hover, 400ms sectional.
- **Easing:** ease-out exponential curves. No bounce, no elastic, no `cubic-bezier(0.68, -0.55, 0.265, 1.55)`-style overshoot.
- **Animatable:** opacity, transform, color, background. **Never** layout properties (width, height, padding, margin, top/left).
- **Brand pulse:** `pulse 2.4s ease-in-out infinite` on status dots only. Don't apply to text or large surfaces.

## Components — conventions

- **CTAs:** primary = `bg-warm text-paper`. Hover: `bg-warm-2`, `-translate-y-px`, `shadow-cta`. Secondary = ghost text or `border-hairline bg-paper-2`.
- **Status pills:** rounded-full, monospace label, paired with a tinted background and border. Auto = mint, Approval = warm, Escalate = rose, Growth = mute.
- **Channel chips:** monospace, uppercase tracking-wide, paper-2 background, hairline border. Always show channel + count when in inbox context.
- **Kickers:** `.label-mono` above section headlines. Don't double-up on heading + kicker meaning; the kicker categorizes, the heading states.

## Banned patterns (project-specific)

In addition to the [shared impeccable absolute bans](`/Users/oui/.claude/skills/impeccable/SKILL.md#absolute-bans`):

- **Identical 3-card or 4-card feature grids.** Vary at least one of: size, alignment, content shape. If the design wants three feature blocks, two should be cards and one should be an editorial vignette, or all three should differ in height.
- **Hero metrics tile.** Big number + small label + supporting stat is banned. Metrics live in line with copy or as an editorial caption beside an artifact, not as a card grid.
- **Gradient text on display copy.** The hero `<em className="text-warm">` style is the only allowed accent. Never `bg-gradient-to-r ... bg-clip-text`.
- **"AI-powered" / "intelligent" / "smart"** in copy. Lead with the user action.
- **Stock-art smiling customer**, robot mascot, or cartoon-character illustrations.
- **Card with `border-l-4` accent stripe.** Use full borders, leading numbers, or no border.

## Source files

- `apps/web/app/globals.css` — token definitions (both skins), display utility classes.
- `apps/web/tailwind.config.ts` — Tailwind extension consuming CSS vars.
- `apps/web/components/skin-provider.tsx` — runtime skin toggle.
- `design/explorations/README.md` — original design rationale.
