/**
 * Hero illustration: customer channels converging into a single FlowAIOS inbox.
 *
 * Ported from the FlowAIOS design bundle (flowaios/project/landing.jsx +
 * styles.css). Six channel orbs sit around the perimeter; each is connected
 * to the centre inbox panel by a dashed line whose stroke-dashoffset animates
 * to suggest data streaming inward. Orbs gently float on alternating phases.
 *
 * Static visual + CSS animations only. No JS, no client-side state — this
 * component is a server-rendered SVG + a few keyframes scoped via inline
 * <style>. Cheap, accessible (aria-hidden on the visual; the inbox rows are
 * real text the screen reader announces).
 */

const CHANNELS = [
  { key: 'line',    label: 'LINE OA',  letter: 'L', bg: '#06C755',                                                   pos: 'left-[8%] top-[12%]',     phase: 'a' },
  { key: 'shopee',  label: 'Shopee',   letter: 'S', bg: '#EE4D2D',                                                   pos: 'right-[8%] top-[10%]',    phase: 'b' },
  { key: 'tiktok',  label: 'TikTok',   letter: 'T', bg: '#0B1220',                                                   pos: 'left-[4%] top-[48%]',     phase: 'a' },
  { key: 'lazada',  label: 'Lazada',   letter: 'Z', bg: 'linear-gradient(135deg,#0F146E 0%,#F0006A 100%)',           pos: 'right-[4%] top-[46%]',    phase: 'b' },
  { key: 'meta',    label: 'Meta',     letter: 'M', bg: 'linear-gradient(135deg,#1877F2 0%,#C13584 60%,#F58529 100%)', pos: 'left-[14%] bottom-[18%]', phase: 'a' },
  { key: 'email',   label: 'Email',    letter: '@', bg: '#475569',                                                   pos: 'right-[14%] bottom-[16%]', phase: 'b' },
] as const;

interface InboxRow {
  channel: 'line' | 'shopee' | 'tiktok' | 'lazada' | 'meta' | 'email';
  letter: string;
  bg: string;
  name: string;
  msg: string;
  pill: 'auto' | 'approval' | 'escalate' | 'growth';
  pillLabel: string;
}

const ROWS: InboxRow[] = [
  {
    channel: 'line',
    letter: 'L',
    bg: '#06C755',
    name: 'อรวรรณ',
    msg: 'มี cleansing balm ใหม่ไหม. memory: paraben-free, Kerry shipper',
    pill: 'auto',
    pillLabel: 'Auto',
  },
  {
    channel: 'shopee',
    letter: 'S',
    bg: '#EE4D2D',
    name: 'Lin Wei',
    msg: 'wholesale 50 pcs price, verify SKU + tier first',
    pill: 'approval',
    pillLabel: 'Approval',
  },
  {
    channel: 'tiktok',
    letter: 'T',
    bg: '#0B1220',
    name: '@somchai_real',
    msg: 'sentiment: negative + keyword "แจ้งความ", escalate within 5 min',
    pill: 'escalate',
    pillLabel: 'Escalate',
  },
  {
    channel: 'lazada',
    letter: 'Z',
    bg: 'linear-gradient(135deg,#0F146E 0%,#F0006A 100%)',
    name: 'Returning buyer',
    msg: 'VIP discount code, auto-rule R-008 candidate, 31 hits/30d',
    pill: 'growth',
    pillLabel: 'Growth',
  },
];

// Six dashed lines from each orb position to the inbox centre (200, 230 in the
// 400×420 viewBox). Coordinates picked to match where the orbs live.
const LINES: [number, number, number, number][] = [
  [60, 70,  200, 230],
  [340, 60, 200, 230],
  [40, 220, 200, 230],
  [360, 220, 200, 230],
  [80, 360, 200, 230],
  [320, 360, 200, 230],
];

const PILL_CLASS: Record<InboxRow['pill'], string> = {
  auto: 'bg-mint-soft text-mint',
  approval: 'bg-warm-soft text-warm',
  escalate: 'bg-[#FFF1F2] text-[#BE123C]',
  growth: 'bg-[#EEF2FF] text-[#4338CA]',
};

const STAGE_CSS = `
  @keyframes flowaios-stage-float-a {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-6px); }
  }
  @keyframes flowaios-stage-float-b {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(6px); }
  }
  @keyframes flowaios-stage-dash {
    from { stroke-dashoffset: 0; }
    to   { stroke-dashoffset: -14; }
  }
  @keyframes flowaios-stage-pulse {
    0%, 100% { box-shadow: 0 0 0 0 hsl(var(--mint) / 0.55); }
    50%      { box-shadow: 0 0 0 6px hsl(var(--mint) / 0); }
  }
  .flowaios-orb-a { animation: flowaios-stage-float-a 5.5s ease-in-out infinite; }
  .flowaios-orb-b { animation: flowaios-stage-float-b 6s   ease-in-out infinite; }
  .flowaios-stage-line {
    stroke: url(#flowaios-stage-grad);
    stroke-width: 1;
    stroke-dasharray: 3 4;
    animation: flowaios-stage-dash 2.4s linear infinite;
  }
  .flowaios-stage-pulse {
    animation: flowaios-stage-pulse 1.6s ease-in-out infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .flowaios-orb-a, .flowaios-orb-b,
    .flowaios-stage-line, .flowaios-stage-pulse { animation: none !important; }
  }
`;

export function CombineStage() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-hairline bg-paper shadow-terminal"
      style={{ aspectRatio: '1 / 1.05' }}
    >
      <style dangerouslySetInnerHTML={{ __html: STAGE_CSS }} />

      {/* Subtle grid backdrop, masked to a soft circular vignette so it fades
          out at the edges of the card. Pure decoration. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px),' +
            'linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          WebkitMaskImage:
            'radial-gradient(circle at 50% 55%, black 30%, transparent 75%)',
          maskImage:
            'radial-gradient(circle at 50% 55%, black 30%, transparent 75%)',
        }}
      />

      {/* Connecting dashed lines from each orb to the centre. */}
      <svg
        aria-hidden
        viewBox="0 0 400 420"
        preserveAspectRatio="none"
        className="absolute inset-0 z-[1] h-full w-full"
      >
        <defs>
          <linearGradient id="flowaios-stage-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#B8632A" stopOpacity="0" />
            <stop offset="50%" stopColor="#B8632A" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#2C8A6B" stopOpacity="0" />
          </linearGradient>
        </defs>
        {LINES.map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className="flowaios-stage-line"
          />
        ))}
      </svg>

      {/* Channel orbs */}
      {CHANNELS.map((ch) => (
        <div
          key={ch.key}
          aria-hidden
          className={`absolute z-[3] flex h-14 w-14 items-center justify-center rounded-2xl border border-hairline bg-paper shadow-soft ${ch.pos} ${ch.phase === 'a' ? 'flowaios-orb-a' : 'flowaios-orb-b'}`}
        >
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md text-[13px] font-bold tracking-tight text-white"
            style={{ background: ch.bg }}
          >
            {ch.letter}
          </span>
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] tracking-[0.04em] text-mute">
            {ch.label}
          </span>
        </div>
      ))}

      {/* Centre inbox panel */}
      <div
        className="absolute left-1/2 top-[55%] z-[4] w-[64%] min-w-[260px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-hairline bg-paper shadow-terminal"
      >
        <div className="flex items-center gap-2 border-b border-hairline bg-paper-2 px-3 py-2.5">
          <span className="h-3.5 w-3.5 rounded bg-gradient-to-br from-warm to-warm-2" aria-hidden />
          <span className="font-mono text-[12px] font-medium text-ink-2">
            flowaios.app / inbox
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] text-mint">
            <span className="flowaios-stage-pulse h-1.5 w-1.5 rounded-full bg-mint" />
            AI OS Online
          </span>
        </div>

        <ul className="m-0 list-none p-0">
          {ROWS.map((r, i) => (
            <li
              key={i}
              className="grid grid-cols-[20px_1fr_auto] items-center gap-2.5 border-b border-hairline px-3 py-2.5 last:border-b-0"
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold tracking-tight text-white"
                style={{ background: r.bg }}
                aria-hidden
              >
                {r.letter}
              </span>
              <div className="min-w-0">
                <div className="text-[12.5px] font-medium text-ink">
                  {r.name}
                </div>
                <div className="mt-0.5 truncate text-[11.5px] text-ink-2">
                  {r.msg}
                </div>
              </div>
              <span
                className={`rounded-full px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.04em] ${PILL_CLASS[r.pill]}`}
              >
                {r.pillLabel}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
