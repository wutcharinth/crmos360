'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LangToggle } from '@/components/marketing/LangToggle';

/**
 * Marketing header.
 *
 * Three destinations only — Product (homepage anchor), Pricing, Demo.
 * Hash anchors used to live in the nav directly but they break on
 * non-homepage routes; collapsing to one cross-page Product link keeps
 * navigation reliable across /pricing, /for/*, /demo.
 *
 * Scroll-aware: border + soft shadow appear after the first 8px so the
 * top of the page feels weightless and the sticky element only earns its
 * separator when content scrolls under it.
 *
 * Mobile (<768px): center nav + right-side links collapse into a slide-
 * down drawer toggled by a hamburger. CTA stays visible at all sizes.
 */
const links = [
  { href: '/#features', label: { th: 'ฟีเจอร์', en: 'Product' } },
  { href: '/pricing', label: { th: 'ราคา', en: 'Pricing' } },
] as const;

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (drawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [drawerOpen]);

  // Close the drawer when route changes.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false; // anchors don't claim active
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <header
      className={`sticky top-0 z-30 transition-shadow duration-200 ${
        scrolled
          ? 'border-b border-hairline bg-paper/90 shadow-[0_1px_0_rgba(20,24,26,0.04),0_8px_24px_-12px_rgba(20,24,26,0.08)] backdrop-blur-md'
          : 'border-b border-transparent bg-paper/70 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex w-[min(1240px,calc(100%-32px))] items-center gap-4 py-3 sm:w-[min(1240px,calc(100%-48px))] sm:gap-10 sm:py-3.5">
        <Logo />

        <nav className="hidden flex-1 justify-center gap-7 text-[13.5px] md:flex">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? 'page' : undefined}
              className={`group relative pb-1.5 transition-colors ${
                isActive(href) ? 'text-ink' : 'text-ink-2 hover:text-ink'
              }`}
            >
              <span className="th-only">{label.th}</span>
              <span className="en-only">{label.en}</span>
              <span
                className={`absolute inset-x-0 -bottom-px h-px origin-left bg-warm transition-transform duration-200 ${
                  isActive(href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden md:block">
            <LangToggle />
          </div>
          <Link
            href="/login"
            className="hidden px-2 py-2 text-[13.5px] text-ink-2 transition-colors hover:text-ink md:inline"
          >
            <span className="th-only">เข้าสู่ระบบ</span>
            <span className="en-only">Sign in</span>
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 rounded-md bg-warm px-3.5 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-warm-2 sm:px-4 sm:text-[13.5px]"
          >
            <span className="th-only">เริ่มฟรี</span>
            <span className="en-only">Start free</span>
            <span aria-hidden className="text-[14px] leading-none">→</span>
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen((v) => !v)}
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            className="-mr-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink md:hidden"
          >
            <Hamburger open={drawerOpen} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-drawer"
        aria-hidden={!drawerOpen}
        className={`overflow-hidden border-b border-hairline bg-paper transition-[max-height,opacity] duration-200 ease-out md:hidden ${
          drawerOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="mx-auto flex w-[min(1240px,calc(100%-32px))] flex-col gap-1 py-3 text-[15px]">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? 'page' : undefined}
              className={`flex items-center justify-between rounded-md px-3 py-3 transition-colors ${
                isActive(href)
                  ? 'bg-warm-soft text-ink'
                  : 'text-ink-2 hover:bg-paper-2 hover:text-ink'
              }`}
            >
              <span>
                <span className="th-only">{label.th}</span>
                <span className="en-only">{label.en}</span>
              </span>
              <span aria-hidden className="text-[14px] text-mute">→</span>
            </Link>
          ))}

          <Link
            href="/login"
            className="mt-2 flex items-center justify-between rounded-md border border-hairline px-3 py-3 text-ink-2 transition-colors hover:border-hairline-2 hover:text-ink"
          >
            <span>
              <span className="th-only">เข้าสู่ระบบ</span>
              <span className="en-only">Sign in</span>
            </span>
            <span aria-hidden className="text-[14px] text-mute">→</span>
          </Link>

          <div className="mt-3 flex items-center justify-between border-t border-hairline pt-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              Language
            </span>
            <LangToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}

/**
 * Brand mark.
 *
 * Solid warm rounded square with a hand-drawn F glyph in paper. The F
 * geometry is path-based (not text-rendered) so it renders identically
 * at every size from 16px favicon to 28px header lockup. No gradient,
 * no shimmer, no shadow — the mark earns recognition from shape alone.
 *
 * The SVG matches /public/icon.svg byte-for-byte except for the size
 * wrapper. Keep them in sync.
 */
function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      aria-hidden
      className={className ?? 'h-[26px] w-[26px] shrink-0'}
    >
      <rect width="28" height="28" rx="7" className="fill-warm" />
      <path
        d="M10 7 H20 V9.6 H12.5 V13.4 H18 V16 H12.5 V21 H10 Z"
        className="fill-paper"
      />
    </svg>
  );
}

function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-center gap-2.5 text-[15.5px] font-semibold tracking-[-0.012em] text-ink"
    >
      <LogoMark />
      FlowAIOS
    </Link>
  );
}

function Hamburger({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3.5 w-4">
      <span
        className={`absolute left-0 right-0 h-px bg-current transition-all duration-200 ${
          open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
        }`}
      />
      <span
        className={`absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-current transition-opacity duration-200 ${
          open ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <span
        className={`absolute left-0 right-0 h-px bg-current transition-all duration-200 ${
          open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'
        }`}
      />
    </span>
  );
}
