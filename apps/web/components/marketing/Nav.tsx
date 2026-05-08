import Link from 'next/link';
import { navLinks } from '@/lib/marketing/data';

export function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-hairline bg-paper/85 backdrop-blur-md">
      <div className="mx-auto grid w-[min(1240px,calc(100%-48px))] grid-cols-[auto_1fr_auto] items-center gap-10 py-3.5">
        <Link
          href="#top"
          className="inline-flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.005em] text-ink"
        >
          <span className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-md bg-gradient-to-br from-warm to-warm-2 font-mono text-[11px] font-bold tracking-[-0.02em] text-paper">
            360
          </span>
          CRMOS360
        </Link>

        <nav className="flex justify-center gap-7 text-[13px]">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="group relative pb-1.5 text-ink-2 transition-colors hover:text-ink"
            >
              {label}
              <span className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-warm transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3.5">
          <Link
            href="/login"
            className="px-3.5 py-2 text-[13px] text-ink-2 transition-colors hover:text-ink"
          >
            เข้าสู่ระบบ
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-warm"
          >
            ขอดูเดโม
          </Link>
        </div>
      </div>
    </header>
  );
}
