import type { ReactElement, SVGProps } from 'react';

/**
 * Minimal monoline channel iconography.
 *
 * One viewbox, one stroke weight, one color (`currentColor`). No brand-color
 * fills (Shopee orange / LINE green / IG gradient) — those would clash with
 * the FlowAIOS warm-orange-on-paper palette and read as 2018-SaaS-busy. The
 * mark for each channel is a stylized geometric reference, not a logo.
 *
 * Usage:
 *   <ChannelIcon channel="line" size={16} />
 *   <ChannelIcon channel="line" label />            // glyph + label
 *   <ChannelIcon channel="line" label labelOnly />  // label only with the
 *                                                   // glyph as accent dot
 */

export type ChannelKey =
  | 'line'
  | 'shopee'
  | 'lazada'
  | 'tiktok'
  | 'facebook'
  | 'messenger'
  | 'instagram'
  | 'email'
  | 'whatsapp'
  | 'web';

export const CHANNEL_LABELS: Record<ChannelKey, string> = {
  line: 'LINE OA',
  shopee: 'Shopee',
  lazada: 'Lazada',
  tiktok: 'TikTok Shop',
  facebook: 'Facebook',
  messenger: 'Messenger',
  instagram: 'Instagram',
  email: 'Email',
  whatsapp: 'WhatsApp',
  web: 'Web chat',
};

const ICONS: Record<ChannelKey, (props: SVGProps<SVGSVGElement>) => ReactElement> = {
  line: LineGlyph,
  shopee: ShopeeGlyph,
  lazada: LazadaGlyph,
  tiktok: TiktokGlyph,
  facebook: FacebookGlyph,
  messenger: MessengerGlyph,
  instagram: InstagramGlyph,
  email: EmailGlyph,
  whatsapp: WhatsAppGlyph,
  web: WebGlyph,
};

interface ChannelIconProps {
  channel: ChannelKey | string;
  size?: number;
  label?: boolean;
  labelOnly?: boolean;
  className?: string;
  iconClassName?: string;
}

function isChannelKey(v: string): v is ChannelKey {
  return v in ICONS;
}

export function ChannelIcon({
  channel,
  size = 16,
  label = false,
  labelOnly = false,
  className,
  iconClassName,
}: ChannelIconProps) {
  const key: ChannelKey = isChannelKey(channel) ? channel : 'web';
  const Glyph = ICONS[key];
  const text = CHANNEL_LABELS[key];

  if (labelOnly) {
    return (
      <span className={`inline-flex items-baseline gap-1.5 ${className ?? ''}`}>
        <Glyph
          width={size}
          height={size}
          aria-hidden
          className={`relative top-[2px] flex-shrink-0 text-current ${iconClassName ?? ''}`}
        />
        <span>{text}</span>
      </span>
    );
  }

  if (label) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 ${className ?? ''}`}
        title={text}
      >
        <Glyph
          width={size}
          height={size}
          aria-hidden
          className={`flex-shrink-0 ${iconClassName ?? ''}`}
        />
        <span>{text}</span>
      </span>
    );
  }

  return (
    <Glyph
      width={size}
      height={size}
      aria-label={text}
      role="img"
      className={`inline-block ${iconClassName ?? className ?? ''}`}
    />
  );
}

// — Glyph definitions —————————————————————————————————————————————————————
//
// All glyphs share these conventions:
//   - 20×20 viewBox
//   - stroke="currentColor"
//   - strokeWidth=1.5
//   - strokeLinecap="round" / strokeLinejoin="round"
//   - fill="none" except for tiny accent dots
// This keeps them visually consistent across both daylight and cockpit
// skins (color flips automatically via currentColor).

const STROKE_PROPS = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function LineGlyph(props: SVGProps<SVGSVGElement>) {
  // LINE OA — chat bubble with subtle right-pointing tail
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <path
        {...STROKE_PROPS}
        d="M3 8.5C3 5.46 6.13 3 10 3s7 2.46 7 5.5-3.13 5.5-7 5.5c-.65 0-1.28-.07-1.87-.2L5.4 16l.66-2.6C4.21 12.4 3 10.55 3 8.5Z"
      />
      <circle cx="7.5" cy="8.5" r="0.7" fill="currentColor" />
      <circle cx="10" cy="8.5" r="0.7" fill="currentColor" />
      <circle cx="12.5" cy="8.5" r="0.7" fill="currentColor" />
    </svg>
  );
}

function ShopeeGlyph(props: SVGProps<SVGSVGElement>) {
  // Shopee — shopping bag with arched handles
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <path
        {...STROKE_PROPS}
        d="M4.6 7H15.4l-.7 9.2a1.4 1.4 0 0 1-1.4 1.3H6.7a1.4 1.4 0 0 1-1.4-1.3L4.6 7Z"
      />
      <path
        {...STROKE_PROPS}
        d="M7.5 7a2.5 2.5 0 0 1 5 0"
      />
    </svg>
  );
}

function LazadaGlyph(props: SVGProps<SVGSVGElement>) {
  // Lazada — tag with asymmetric facet (not a heart, not a price tag clichรฉ)
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <path
        {...STROKE_PROPS}
        d="M10.5 3 17 9.5 11 16l-7.5-3L4 5.5 10.5 3Z"
      />
      <circle cx="6.4" cy="6.4" r="1" {...STROKE_PROPS} />
    </svg>
  );
}

function TiktokGlyph(props: SVGProps<SVGSVGElement>) {
  // TikTok Shop — musical note with a small hook (stylized, not the brand mark)
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <path
        {...STROKE_PROPS}
        d="M11 3v9.5a2.8 2.8 0 1 1-2.8-2.8"
      />
      <path
        {...STROKE_PROPS}
        d="M11 3c.3 1.7 1.7 3 3.5 3.2"
      />
    </svg>
  );
}

function FacebookGlyph(props: SVGProps<SVGSVGElement>) {
  // Facebook — circle with simplified "f" descender
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <circle {...STROKE_PROPS} cx="10" cy="10" r="7" />
      <path {...STROKE_PROPS} d="M11.4 7.5h-1.1c-.6 0-1 .4-1 1v8" />
      <path {...STROKE_PROPS} d="M8.4 11h2.6" />
    </svg>
  );
}

function MessengerGlyph(props: SVGProps<SVGSVGElement>) {
  // Messenger — rounded oval bubble with the lightning-shape inner reply
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <path
        {...STROKE_PROPS}
        d="M10 2.7c4 0 7.3 3 7.3 6.9 0 2.4-1.4 4.6-3.6 5.9V18l-2.8-1.5a8.6 8.6 0 0 1-.9 0c-4 0-7.3-3-7.3-6.9S6 2.7 10 2.7Z"
      />
      <path {...STROKE_PROPS} d="M6.5 11.2 9 8.4l1.6 1.6 3.2-2.8-2.5 2.8-1.6-1.6L6.5 11.2Z" />
    </svg>
  );
}

function InstagramGlyph(props: SVGProps<SVGSVGElement>) {
  // Instagram — rounded square with circle and corner dot
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <rect {...STROKE_PROPS} x="3.4" y="3.4" width="13.2" height="13.2" rx="3.5" />
      <circle {...STROKE_PROPS} cx="10" cy="10" r="3" />
      <circle cx="13.8" cy="6.2" r="0.85" fill="currentColor" />
    </svg>
  );
}

function EmailGlyph(props: SVGProps<SVGSVGElement>) {
  // Email — envelope with simple flap
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <rect {...STROKE_PROPS} x="2.5" y="5" width="15" height="10" rx="1.5" />
      <path {...STROKE_PROPS} d="m3 6 7 5 7-5" />
    </svg>
  );
}

function WhatsAppGlyph(props: SVGProps<SVGSVGElement>) {
  // WhatsApp — chat bubble with phone notch
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <path
        {...STROKE_PROPS}
        d="M10 2.5a7.5 7.5 0 0 0-6.5 11.2L2.5 17.5l3.9-1A7.5 7.5 0 1 0 10 2.5Z"
      />
      <path
        {...STROKE_PROPS}
        d="M7.6 8.2c.2 1.1.9 2.4 1.7 3.1.7.7 1.9 1.4 3 1.6.4.1.8-.2 1-.5l.4-.7-1.7-.9-.5.5a3.7 3.7 0 0 1-1.7-1.7l.5-.5-.9-1.7-.7.4c-.3.2-.6.6-.5 1Z"
      />
    </svg>
  );
}

function WebGlyph(props: SVGProps<SVGSVGElement>) {
  // Web — a globe-ish circle with a horizontal meridian
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <circle {...STROKE_PROPS} cx="10" cy="10" r="7" />
      <path {...STROKE_PROPS} d="M3.5 10h13" />
      <path {...STROKE_PROPS} d="M10 3.5c2 2 3 4.2 3 6.5s-1 4.5-3 6.5c-2-2-3-4.2-3-6.5s1-4.5 3-6.5Z" />
    </svg>
  );
}

// Convenience: render a horizontal strip of channel icons by key.
// Used by the marketing ChannelStrip.
export function ChannelIconRow({
  channels,
  showLabels = false,
  size = 18,
  className,
}: {
  channels: (ChannelKey | string)[];
  showLabels?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-x-7 gap-y-3 ${className ?? ''}`}>
      {channels.map((c) => (
        <ChannelIcon
          key={c}
          channel={c}
          size={size}
          label={showLabels}
          className="text-ink-2"
        />
      ))}
    </div>
  );
}
