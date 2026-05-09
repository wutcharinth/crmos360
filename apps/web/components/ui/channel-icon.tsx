import type { ReactElement, SVGProps } from 'react';
import { useId } from 'react';

/**
 * Brand-colored channel iconography.
 *
 * Each glyph is a rounded "app icon" tile in the channel's official color,
 * with a simplified white symbol inside. Matches the F-monogram aesthetic
 * (solid color, geometric, no gradient — except where the brand identity
 * itself is a gradient, e.g. Instagram). The simplified symbols are
 * stylized references, not literal logo reproductions, so we don't import
 * any brand IP.
 *
 * Usage:
 *   <ChannelIcon channel="line" size={20} />
 *   <ChannelIcon channel="line" label />            // glyph + label
 *   <ChannelIcon channel="line" mono />             // currentColor outline
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

type GlyphComponent = (props: SVGProps<SVGSVGElement>) => ReactElement;

const BRAND_ICONS: Record<ChannelKey, GlyphComponent> = {
  line: LineBrand,
  shopee: ShopeeBrand,
  lazada: LazadaBrand,
  tiktok: TiktokBrand,
  facebook: FacebookBrand,
  messenger: MessengerBrand,
  instagram: InstagramBrand,
  email: EmailBrand,
  whatsapp: WhatsAppBrand,
  web: WebBrand,
};

const MONO_ICONS: Record<ChannelKey, GlyphComponent> = {
  line: LineMono,
  shopee: ShopeeMono,
  lazada: LazadaMono,
  tiktok: TiktokMono,
  facebook: FacebookMono,
  messenger: MessengerMono,
  instagram: InstagramMono,
  email: EmailMono,
  whatsapp: WhatsAppMono,
  web: WebMono,
};

interface ChannelIconProps {
  channel: ChannelKey | string;
  size?: number;
  label?: boolean;
  labelOnly?: boolean;
  /** Force monoline currentColor rendering (no brand color). */
  mono?: boolean;
  className?: string;
  iconClassName?: string;
}

function isChannelKey(v: string): v is ChannelKey {
  return v in BRAND_ICONS;
}

export function ChannelIcon({
  channel,
  size = 16,
  label = false,
  labelOnly = false,
  mono = false,
  className,
  iconClassName,
}: ChannelIconProps) {
  const key: ChannelKey = isChannelKey(channel) ? channel : 'web';
  const Glyph = mono ? MONO_ICONS[key] : BRAND_ICONS[key];
  const text = CHANNEL_LABELS[key];

  if (labelOnly) {
    return (
      <span className={`inline-flex items-baseline gap-1.5 ${className ?? ''}`}>
        <Glyph
          width={size}
          height={size}
          aria-hidden
          className={`relative top-[2px] flex-shrink-0 ${iconClassName ?? ''}`}
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

// — Brand glyphs ———————————————————————————————————————————————————————
//
// 20×20 viewBox, rounded square tile in the brand's official color,
// white inner mark. Symbols are stylized references — not literal
// brand logo reproductions — to avoid IP issues while still being
// instantly recognizable at 16–24px sizes.

function LineBrand(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <rect width="20" height="20" rx="4.5" fill="#06C755" />
      <path
        d="M16.2 9.1c0-2.8-2.8-5-6.2-5s-6.2 2.2-6.2 5c0 2.5 2.2 4.6 5.2 5 .2 0 .5.1.5.3 0 .2-.1.7-.2.9 0 .1-.1.4.4.2.5-.2 2.7-1.6 3.7-2.7C15.4 11.9 16.2 10.6 16.2 9.1Z"
        fill="#fff"
      />
      <path
        d="M7.7 7.7H7v3.2h2.1v-.6H7.7V7.7Zm2.4 0h.7v3.2h-.7V7.7Zm1.4 0h.7l1.4 2v-2h.7v3.2h-.7l-1.4-2v2h-.7V7.7Zm3.5 0h2.1v.6h-1.4v.7h1.3v.6h-1.3v.7h1.4v.6H15V7.7Z"
        fill="#06C755"
      />
    </svg>
  );
}

function ShopeeBrand(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <rect width="20" height="20" rx="4.5" fill="#EE4D2D" />
      <path
        d="M7.4 7.6V6.9a2.6 2.6 0 0 1 5.2 0v.7h2L14 15.7c-.05.7-.65 1.3-1.35 1.3H7.35c-.7 0-1.3-.6-1.35-1.3L5.4 7.6h2Zm1 0h3.2V6.9a1.6 1.6 0 0 0-3.2 0v.7Z"
        fill="#fff"
      />
      <path
        d="M10 11.4c-.5-.2-1.4-.5-1.4-1.2 0-.5.5-.9 1.2-.9.5 0 .9.2 1.2.4l.3-.7c-.4-.3-.9-.5-1.5-.5-1.1 0-2 .7-2 1.7 0 1.1 1.1 1.4 1.7 1.6.6.2 1.2.4 1.2 1 0 .5-.5.8-1.1.8-.6 0-1.2-.3-1.5-.6l-.4.7c.5.4 1.2.7 1.9.7 1.3 0 2.1-.7 2.1-1.7 0-1.1-1.1-1.4-1.7-1.6Z"
        fill="#EE4D2D"
      />
    </svg>
  );
}

function LazadaBrand(props: SVGProps<SVGSVGElement>) {
  // Lazada uses a deep-blue → magenta gradient identity (per the FlowAIOS
  // design). A simplified cart silhouette stands in for the wordmark since
  // the actual Lazada logo is wordmark-only.
  const gid = useId();
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <defs>
        <linearGradient id={`lz-${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0F146E" />
          <stop offset="1" stopColor="#F0006A" />
        </linearGradient>
      </defs>
      <rect width="20" height="20" rx="4.5" fill={`url(#lz-${gid})`} />
      <path
        d="M5.5 6.5h2.2L8.4 13a.4.4 0 0 0 .4.3h5.7v1H8.3a1.4 1.4 0 0 1-1.4-1.2L6.2 7.5H5.5v-1Zm3.6 1.5h6l-.7 4.2a.4.4 0 0 1-.4.3h-4.2a.4.4 0 0 1-.4-.3l-.3-4.2Z"
        fill="#fff"
      />
      <circle cx="9.4" cy="14.9" r=".9" fill="#fff" />
      <circle cx="13.6" cy="14.9" r=".9" fill="#fff" />
    </svg>
  );
}

function TiktokBrand(props: SVGProps<SVGSVGElement>) {
  // TikTok's chromatic-shadow effect is simulated with a cyan + magenta
  // offset; final note in white sits on top. Background is deep slate
  // (#0B1220) per the FlowAIOS design — pure black would clash with
  // the slate-on-paper hierarchy of the rest of the surface.
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <rect width="20" height="20" rx="4.5" fill="#0B1220" />
      <path
        d="M11.7 4v7.7a2.4 2.4 0 1 1-2.1-2.4v1.8a.7.7 0 1 0 .6.7V4h1.5Z"
        fill="#25F4EE"
        transform="translate(-0.6 0.5)"
      />
      <path
        d="M11.7 4v7.7a2.4 2.4 0 1 1-2.1-2.4v1.8a.7.7 0 1 0 .6.7V4h1.5Z"
        fill="#FE2C55"
        transform="translate(0.6 -0.4)"
      />
      <path
        d="M11.7 4h1.5c.2 1.4 1.3 2.5 2.7 2.7v1.5a4.2 4.2 0 0 1-2.7-1v3.5a3.7 3.7 0 1 1-3.7-3.7c.2 0 .4 0 .6.05v1.55a2.4 2.4 0 1 0 2.1 2.4V4Z"
        fill="#fff"
      />
    </svg>
  );
}

function FacebookBrand(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <rect width="20" height="20" rx="4.5" fill="#1877F2" />
      <path
        d="M11.6 17v-6.5h2.2l.3-2.5h-2.5V6.4c0-.7.2-1.2 1.2-1.2h1.4V2.9c-.6 0-1.4-.1-2.1-.1-2 0-3.4 1.2-3.4 3.5v1.7H6.6v2.5h2.1V17h2.9Z"
        fill="#fff"
      />
    </svg>
  );
}

function MessengerBrand(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <rect width="20" height="20" rx="4.5" fill="#0084FF" />
      <path
        d="M10 3.4c-3.8 0-6.8 2.8-6.8 6.3 0 2 .9 3.7 2.5 4.9V17l2.3-1.3c.6.2 1.3.3 2 .3 3.8 0 6.8-2.8 6.8-6.3S13.8 3.4 10 3.4Zm.7 8.4-1.7-1.8-3.4 1.8L9.3 8.5l1.8 1.8 3.4-1.8-3.8 3.3Z"
        fill="#fff"
      />
    </svg>
  );
}

function InstagramBrand(props: SVGProps<SVGSVGElement>) {
  // Authentic gradient — IG identity is the gradient, dropping it would
  // make the icon unrecognizable. useId keeps gradient IDs unique when
  // multiple Instagram icons render on the same page.
  const gid = useId();
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <defs>
        <linearGradient id={`ig-${gid}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#FED373" />
          <stop offset="0.25" stopColor="#F15245" />
          <stop offset="0.6" stopColor="#D92E7F" />
          <stop offset="1" stopColor="#9B36B7" />
        </linearGradient>
      </defs>
      <rect width="20" height="20" rx="4.5" fill={`url(#ig-${gid})`} />
      <rect
        x="4.5"
        y="4.5"
        width="11"
        height="11"
        rx="3.2"
        fill="none"
        stroke="#fff"
        strokeWidth="1.3"
      />
      <circle cx="10" cy="10" r="2.6" fill="none" stroke="#fff" strokeWidth="1.3" />
      <circle cx="13.3" cy="6.7" r=".75" fill="#fff" />
    </svg>
  );
}

function EmailBrand(props: SVGProps<SVGSVGElement>) {
  // Email is a protocol, not a brand. Slate-600 (#475569) tile per the
  // FlowAIOS design — keeps the strip cohesive when sitting next to the
  // colored channel marks.
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <rect width="20" height="20" rx="4.5" fill="#475569" />
      <path
        d="M4.5 7.5h11v6.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5v-6.5Z"
        fill="#fff"
      />
      <path
        d="m4.5 7.5 5.5 4 5.5-4-5.5-1.5-5.5 1.5Z"
        fill="#E2E8F0"
      />
      <path
        d="m4.7 7.7 5.3 3.8 5.3-3.8"
        fill="none"
        stroke="#475569"
        strokeWidth=".7"
      />
    </svg>
  );
}

function WhatsAppBrand(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <rect width="20" height="20" rx="4.5" fill="#25D366" />
      <path
        d="M14.7 5.3a6.6 6.6 0 0 0-10.4 8L3.4 17l3.8-1a6.6 6.6 0 0 0 7.5-10.7Zm-4.6 9.9a5.5 5.5 0 0 1-2.8-.8l-.2-.1-2.2.6.6-2.2-.1-.2a5.5 5.5 0 1 1 4.7 2.7Zm3-4.1c-.2-.1-1-.5-1.1-.5-.2-.1-.3-.1-.4.1-.1.2-.4.5-.5.6-.1.1-.2.1-.4 0a4.5 4.5 0 0 1-2.3-2c-.2-.3.2-.3.5-.9.05-.1 0-.2 0-.3-.05-.1-.4-1-.6-1.3-.15-.3-.3-.3-.4-.3h-.4a.7.7 0 0 0-.5.2 2.1 2.1 0 0 0-.7 1.6c0 .9.7 1.8.8 2 .1.15 1.4 2.1 3.4 3 2 .85 2 .55 2.4.5.4-.05 1.2-.5 1.4-1 .2-.5.2-.9.1-1l-.4-.2Z"
        fill="#fff"
      />
    </svg>
  );
}

function WebBrand(props: SVGProps<SVGSVGElement>) {
  // Web chat — generic globe in neutral. No real brand here.
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <rect width="20" height="20" rx="4.5" fill="#374151" />
      <circle cx="10" cy="10" r="5" fill="none" stroke="#fff" strokeWidth="1.2" />
      <path d="M5 10h10" stroke="#fff" strokeWidth="1.2" fill="none" />
      <path
        d="M10 5c1.5 1.5 2.3 3.2 2.3 5s-.8 3.5-2.3 5c-1.5-1.5-2.3-3.2-2.3-5s.8-3.5 2.3-5Z"
        fill="none"
        stroke="#fff"
        strokeWidth="1.2"
      />
    </svg>
  );
}

// — Mono glyphs (currentColor outline) ——————————————————————————————————
//
// Used when callers explicitly pass `mono` — places where the icon
// should follow text color (small inline meta, in-app filter chips,
// badges that already sit on a colored background).

const STROKE_PROPS = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function LineMono(props: SVGProps<SVGSVGElement>) {
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

function ShopeeMono(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <path
        {...STROKE_PROPS}
        d="M4.6 7H15.4l-.7 9.2a1.4 1.4 0 0 1-1.4 1.3H6.7a1.4 1.4 0 0 1-1.4-1.3L4.6 7Z"
      />
      <path {...STROKE_PROPS} d="M7.5 7a2.5 2.5 0 0 1 5 0" />
    </svg>
  );
}

function LazadaMono(props: SVGProps<SVGSVGElement>) {
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

function TiktokMono(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <path {...STROKE_PROPS} d="M11 3v9.5a2.8 2.8 0 1 1-2.8-2.8" />
      <path {...STROKE_PROPS} d="M11 3c.3 1.7 1.7 3 3.5 3.2" />
    </svg>
  );
}

function FacebookMono(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <circle {...STROKE_PROPS} cx="10" cy="10" r="7" />
      <path {...STROKE_PROPS} d="M11.4 7.5h-1.1c-.6 0-1 .4-1 1v8" />
      <path {...STROKE_PROPS} d="M8.4 11h2.6" />
    </svg>
  );
}

function MessengerMono(props: SVGProps<SVGSVGElement>) {
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

function InstagramMono(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <rect {...STROKE_PROPS} x="3.4" y="3.4" width="13.2" height="13.2" rx="3.5" />
      <circle {...STROKE_PROPS} cx="10" cy="10" r="3" />
      <circle cx="13.8" cy="6.2" r="0.85" fill="currentColor" />
    </svg>
  );
}

function EmailMono(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <rect {...STROKE_PROPS} x="2.5" y="5" width="15" height="10" rx="1.5" />
      <path {...STROKE_PROPS} d="m3 6 7 5 7-5" />
    </svg>
  );
}

function WhatsAppMono(props: SVGProps<SVGSVGElement>) {
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

function WebMono(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <circle {...STROKE_PROPS} cx="10" cy="10" r="7" />
      <path {...STROKE_PROPS} d="M3.5 10h13" />
      <path {...STROKE_PROPS} d="M10 3.5c2 2 3 4.2 3 6.5s-1 4.5-3 6.5c-2-2-3-4.2-3-6.5s1-4.5 3-6.5Z" />
    </svg>
  );
}

// Convenience: render a horizontal strip of channel icons by key.
export function ChannelIconRow({
  channels,
  showLabels = false,
  size = 18,
  mono = false,
  className,
}: {
  channels: (ChannelKey | string)[];
  showLabels?: boolean;
  size?: number;
  mono?: boolean;
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
          mono={mono}
          className={mono ? 'text-ink-2' : ''}
        />
      ))}
    </div>
  );
}
