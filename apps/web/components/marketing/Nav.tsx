'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LangToggle } from '@/components/marketing/LangToggle';

/**
 * Marketing header.
 *
 * Five destinations now: Product (homepage anchor), For (dropdown into the
 * three vertical landings), Pricing, Demo, plus the right-side actions
 * (lang, sign-in, start-free). The "For" dropdown surfaces the vertical
 * landings — they exist as pages but were previously only reachable from
 * the bottom-right vertical-chooser chip.
 *
 * Scroll-aware: at scrollY=0 the border is transparent and bg sits at
 * paper/70. After 8px, border + soft long-throw shadow appear and bg
 * lifts to paper/90.
 *
 * Mobile (<md / 768px): center nav + lang toggle + sign-in collapse into
 * a hamburger drawer. The For sub-items render as nested rows in the
 * drawer instead of a popover.
 */
interface VerticalEntry {
  href: string;
  label: { th: string; en: string };
  desc: { th: string; en: string };
}

const verticalEntries: ReadonlyArray<VerticalEntry> = [
  {
    href: '/for/commerce',
    label: { th: 'Ecommerce', en: 'Ecommerce' },
    desc: {
      th: 'ขายของออนไลน์หลายช่องทาง · LINE OA, Shopee, TikTok',
      en: 'Multi-channel online sellers · LINE OA, Shopee, TikTok',
    },
  },
  {
    href: '/for/customer-ops',
    label: { th: 'Ecommerce + ทีม CS', en: 'Ecommerce with CS team' },
    desc: {
      th: 'ทีม CS 5–30 คน · audit log + handle-time ลด 30%',
      en: 'CS teams of 5–30 · audit log + 30% handle-time cut',
    },
  },
  {
    href: '/for/services',
    label: { th: 'Services / Education', en: 'Services / Education' },
    desc: {
      th: 'คลินิก กวดวิชา fitness · LINE OA + Facebook',
      en: 'Clinics, education, fitness · LINE OA + Facebook',
    },
  },
];

interface PrimaryLink {
  href: string;
  label: { th: string; en: string };
}

const primaryLinks: ReadonlyArray<PrimaryLink> = [
  { href: '/#features', label: { th: 'ฟีเจอร์', en: 'Product' } },
  { href: '/pricing', label: { th: 'ราคา', en: 'Pricing' } },
  { href: '/demo', label: { th: 'เดโม', en: 'Demo' } },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [forOpen, setForOpen] = useState(false);
  const forRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [drawerOpen]);

  useEffect(() => {
    setDrawerOpen(false);
    setForOpen(false);
  }, [pathname]);

  // Close the For popover when clicking outside it or pressing Esc.
  useEffect(() => {
    if (!forOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!forRef.current?.contains(e.target as Node)) setForOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setForOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [forOpen]);

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false;
    return pathname === href || pathname?.startsWith(`${href}/`);
  };
  const forSectionActive = pathname?.startsWith('/for/') ?? false;

  return (
    <header
      className={`sticky top-0 z-30 transition-shadow duration-200 ${
        scrolled
          ? 'border-b border-hairline bg-paper/90 shadow-[0_1px_0_rgba(20,24,26,0.04),0_8px_24px_-12px_rgba(20,24,26,0.08)] backdrop-blur-md'
          : 'border-b border-transparent bg-paper/70 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex w-[min(1240px,calc(100%-32px))] items-center gap-4 py-3 sm:w-[min(1240px,calc(100%-48px))] sm:gap-8 sm:py-3.5">
        <Logo />

        <nav className="hidden flex-1 justify-center gap-6 text-[13.5px] md:flex">
          {/* Product */}
          <DesktopNavLink
            href="/#features"
            active={isActive('/#features')}
            label={primaryLinks[0]!.label}
          />

          {/* For — dropdown */}
          <div ref={forRef} className="relative">
            <button
              type="button"
              onClick={() => setForOpen((v) => !v)}
              onMouseEnter={() => setForOpen(true)}
              aria-expanded={forOpen}
              aria-haspopup="true"
              className={`group relative inline-flex items-center gap-1 pb-1.5 transition-colors ${
                forSectionActive ? 'text-ink' : 'text-ink-2 hover:text-ink'
              }`}
            >
              <span className="th-only">สำหรับ</span>
              <span className="en-only">For</span>
              <span
                aria-hidden
                className={`text-[10px] leading-none transition-transform duration-200 ${forOpen ? 'rotate-180' : ''}`}
              >
                ▾
              </span>
              <span
                className={`absolute inset-x-0 -bottom-px h-px origin-left bg-warm transition-transform duration-200 ${
                  forSectionActive || forOpen ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </button>
            {/* Dropdown panel */}
            <div
              role="menu"
              onMouseLeave={() => setForOpen(false)}
              className={`absolute left-1/2 top-[calc(100%+10px)] w-[320px] -translate-x-1/2 origin-top rounded-xl border border-hairline bg-paper p-2 shadow-[0_1px_0_rgba(20,24,26,0.04),0_18px_40px_-16px_rgba(20,24,26,0.16)] transition-all duration-150 ease-out ${
                forOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
              }`}
            >
              {verticalEntries.map((v) => (
                <Link
                  key={v.href}
                  href={v.href}
                  role="menuitem"
                  aria-current={isActive(v.href) ? 'page' : undefined}
                  className={`flex flex-col gap-0.5 rounded-md px-3 py-2.5 transition-colors ${
                    isActive(v.href)
                      ? 'bg-warm-soft'
                      : 'hover:bg-paper-2'
                  }`}
                >
                  <span className="text-[13.5px] font-medium text-ink">
                    <span className="th-only">{v.label.th}</span>
                    <span className="en-only">{v.label.en}</span>
                  </span>
                  <span className="text-[11.5px] leading-snug text-ink-2">
                    <span className="th-only">{v.desc.th}</span>
                    <span className="en-only">{v.desc.en}</span>
                  </span>
                </Link>
              ))}
              <div className="mt-1 border-t border-hairline pt-1.5">
                <Link
                  href="/contact"
                  role="menuitem"
                  className="flex items-center justify-between rounded-md px-3 py-2 text-[12px] text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
                >
                  <span>
                    <span className="th-only">B2B / Industrial → คุยกับเรา</span>
                    <span className="en-only">B2B / Industrial → talk to us</span>
                  </span>
                  <span aria-hidden className="text-[12px] text-mute">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Pricing + Demo */}
          {primaryLinks.slice(1).map(({ href, label }) => (
            <DesktopNavLink
              key={href}
              href={href}
              active={isActive(href)}
              label={label}
            />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden md:block">
            <LangToggle />
          </div>
          <Link
            href="/login"
            className={`hidden px-2 py-2 text-[13.5px] transition-colors hover:text-ink md:inline ${
              isActive('/login') ? 'text-ink' : 'text-ink-2'
            }`}
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
          drawerOpen ? 'max-h-[90vh] overflow-y-auto opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="mx-auto flex w-[min(1240px,calc(100%-32px))] flex-col gap-1 py-3 text-[15px]">
          {primaryLinks.map(({ href, label }) => (
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

          {/* For — nested mobile section */}
          <div className="mt-2 rounded-md bg-paper-2 p-2">
            <p className="px-2 pb-1 pt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              <span className="th-only">สำหรับ</span>
              <span className="en-only">For</span>
            </p>
            {verticalEntries.map((v) => (
              <Link
                key={v.href}
                href={v.href}
                aria-current={isActive(v.href) ? 'page' : undefined}
                className={`flex flex-col gap-0.5 rounded-md px-3 py-2.5 transition-colors ${
                  isActive(v.href) ? 'bg-warm-soft' : 'hover:bg-paper'
                }`}
              >
                <span className="text-[14px] font-medium text-ink">
                  <span className="th-only">{v.label.th}</span>
                  <span className="en-only">{v.label.en}</span>
                </span>
                <span className="text-[12px] leading-snug text-ink-2">
                  <span className="th-only">{v.desc.th}</span>
                  <span className="en-only">{v.desc.en}</span>
                </span>
              </Link>
            ))}
            <Link
              href="/contact"
              className="flex items-center justify-between rounded-md px-3 py-2 text-[12.5px] text-ink-2 hover:text-ink"
            >
              <span>
                <span className="th-only">B2B / Industrial → คุยกับเรา</span>
                <span className="en-only">B2B / Industrial → talk to us</span>
              </span>
              <span aria-hidden className="text-[12px] text-mute">→</span>
            </Link>
          </div>

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

function DesktopNavLink({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: { th: string; en: string };
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`group relative pb-1.5 transition-colors ${
        active ? 'text-ink' : 'text-ink-2 hover:text-ink'
      }`}
    >
      <span className="th-only">{label.th}</span>
      <span className="en-only">{label.en}</span>
      <span
        className={`absolute inset-x-0 -bottom-px h-px origin-left bg-warm transition-transform duration-200 ${
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      />
    </Link>
  );
}

/**
 * Brand mark.
 *
 * Custom indigo ribbon F monogram, served from /flowaios-logo.png (also
 * used as the favicon at /icon.png). Image-based rather than path-drawn
 * because the gradient + 3D shading would be noisy to recreate as inline
 * SVG, and the asset is small (~64KB) so it's cheaper to ship as PNG.
 */
function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/flowaios-logo.png"
      alt=""
      aria-hidden
      width={28}
      height={28}
      className={className ?? 'h-[26px] w-[26px] shrink-0'}
    />
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
