import type { CategoryIconKey } from '@/lib/demo/scenarios';

/**
 * Line-art category icons for the scenario playground tabs and headers.
 *
 * Replaces emoji glyphs (✨ 👗 🍜 🖥 🌿) which render OS-dependently and
 * sit awkwardly next to typeset labels. These are simple stroke icons
 * sized to match the surrounding text — they pick up `currentColor`
 * from the parent so active/inactive tab states color them via Tailwind.
 */
export function CategoryIcon({
  name,
  size = 16,
  className,
}: {
  name: CategoryIconKey;
  size?: number;
  className?: string;
}) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className: `inline-block shrink-0 ${className ?? ''}`,
  };
  switch (name) {
    case 'sparkles':
      return (
        <svg {...props}>
          <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4z" />
          <path d="M19 14l.7 1.9 1.9.7-1.9.7L19 19l-.7-1.7-1.9-.7 1.9-.7L19 14z" />
        </svg>
      );
    case 'shirt':
      return (
        <svg {...props}>
          <path d="M9 4l-5 2 1.5 4 2.5-1v9a1 1 0 001 1h8a1 1 0 001-1v-9l2.5 1L20 6l-5-2-1.5 1.5a2.5 2.5 0 01-3 0L9 4z" />
        </svg>
      );
    case 'bowl':
      return (
        <svg {...props}>
          <path d="M3 11h18a8 8 0 01-8 8h-2a8 8 0 01-8-8z" />
          <path d="M9 7c0-1 .5-2 1.5-2.5M14 7c0-1 .5-2 1.5-2.5" />
          <path d="M5 19h14" />
        </svg>
      );
    case 'monitor':
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="13" rx="2" />
          <path d="M9 21h6M12 17v4" />
        </svg>
      );
    case 'leaf':
      return (
        <svg {...props}>
          <path d="M11 20A7 7 0 014 13V6a14 14 0 0112 8c.5 4.5-1.5 7-5 6z" />
          <path d="M5 19c2-4 5-7 9-9" />
        </svg>
      );
    case 'bed':
      return (
        <svg {...props}>
          <path d="M3 18v-6a2 2 0 012-2h14a2 2 0 012 2v6" />
          <path d="M3 18h18M3 14h18" />
          <path d="M7 10V8a1 1 0 011-1h3a1 1 0 011 1v2" />
        </svg>
      );
    case 'book':
      return (
        <svg {...props}>
          <path d="M5 4h11a2 2 0 012 2v14H7a2 2 0 01-2-2V4z" />
          <path d="M5 18h13" />
          <path d="M9 8h6" />
        </svg>
      );
    case 'home':
      return (
        <svg {...props}>
          <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9z" />
        </svg>
      );
    case 'dumbbell':
      return (
        <svg {...props}>
          <path d="M5 8v8M3 10v4M19 8v8M21 10v4" />
          <path d="M5 12h14" />
        </svg>
      );
  }
}
