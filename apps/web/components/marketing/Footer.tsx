import Link from 'next/link';
import { navLinks } from '@/lib/marketing/data';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-hairline bg-paper py-12">
      <div className="mx-auto flex w-[min(1240px,calc(100%-48px))] flex-col items-start gap-7 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-md bg-gradient-to-br from-warm to-warm-2 font-mono text-[11px] font-bold tracking-[-0.02em] text-paper">
            360
          </span>
          <div className="text-[13px] text-mute">
            <b className="font-medium text-ink">FlowAIOS</b>
            <span className="mx-2 text-hairline-2">·</span>
            AI OS for Customer Operations
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-7 gap-y-2 text-[13px]">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-ink-2 transition-colors hover:text-warm"
            >
              {label}
            </Link>
          ))}
          <Link href="/login" className="text-ink-2 transition-colors hover:text-warm">
            เข้าสู่ระบบ
          </Link>
        </nav>

        <div className="font-mono text-[11px] tracking-[0.05em] text-mute">© {year}</div>
      </div>
    </footer>
  );
}
