import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        // shadcn primitives (CSS-variable driven so existing components auto-pick up the theme)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // Sunlit Cockpit brand tokens — used by marketing pages and product chrome.
        // Reference via CSS variables so dark mode (added later) can flip them.
        paper:       'hsl(var(--paper))',
        'paper-2':   'hsl(var(--paper-2))',
        'paper-3':   'hsl(var(--paper-3))',
        ink:         'hsl(var(--ink))',
        'ink-2':     'hsl(var(--ink-2))',
        mute:        'hsl(var(--mute))',
        hairline:    'hsl(var(--hairline))',
        'hairline-2':'hsl(var(--hairline-2))',
        warm:        'hsl(var(--warm))',
        'warm-2':    'hsl(var(--warm-2))',
        'warm-soft': 'hsl(var(--warm-soft))',
        mint:        'hsl(var(--mint))',
        'mint-soft': 'hsl(var(--mint-soft))',
        amber:       'hsl(var(--amber))',
        'amber-soft':'hsl(var(--amber-soft))',
        rose:        'hsl(var(--rose))',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'var(--font-thai)', 'ui-sans-serif', '-apple-system', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'var(--font-thai)', 'ui-sans-serif', 'sans-serif'],
        thai: ['var(--font-thai)', 'var(--font-sans)', 'ui-sans-serif', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.03em',
        tightish: '-0.022em',
        widest: '0.22em',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        // Elevated terminal artifact in the hero
        terminal:
          '0 28px 70px rgba(20,24,26,0.10), 0 8px 22px rgba(20,24,26,0.06)',
        // Soft card lift used by marketing cards
        soft:
          '0 4px 16px rgba(20,24,26,0.04)',
        // CTA button hover lift — tinted with the indigo accent
        cta:
          '0 12px 28px rgba(79, 70, 229, 0.22)',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
      },
      animation: {
        pulse: 'pulse 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
