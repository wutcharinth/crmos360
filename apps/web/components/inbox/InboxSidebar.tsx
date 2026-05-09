import Link from 'next/link';
import { ChannelIcon, type ChannelKey } from '@/components/ui/channel-icon';

/**
 * Left rail of the inbox workspace.
 *
 * Matches the prototype's Sidebar:
 *   - brand row (FlowAIOS F monogram + wordmark)
 *   - "Workspaces" section: All / Mine / Unassigned / Awaiting approval / Escalated
 *   - "Channels" section: each channel + count, brand-colored icon
 *   - bottom row: Knowledge base / Workflows / Settings
 *
 * On the narrow breakpoint (<md / 768px) labels collapse and the rail
 * becomes 64px icon-only — the InboxShell already handles the column
 * width swap via grid-cols.
 */
type FolderId = 'all' | 'mine' | 'unassigned' | 'approval' | 'escalated';

const FOLDERS: ReadonlyArray<{
  id: FolderId;
  href: string;
  label: { th: string; en: string };
  iconPath: string;
}> = [
  {
    id: 'all',
    href: '/inbox',
    label: { th: 'ทั้งหมด', en: 'All conversations' },
    iconPath:
      'M4 6h16M4 12h16M4 18h10', // bars
  },
  {
    id: 'mine',
    href: '/inbox?folder=mine',
    label: { th: 'ของฉัน', en: 'Assigned to me' },
    iconPath:
      'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M16 7a4 4 0 11-8 0 4 4 0 018 0z',
  },
  {
    id: 'unassigned',
    href: '/inbox?folder=unassigned',
    label: { th: 'ยังไม่ได้มอบหมาย', en: 'Unassigned' },
    iconPath:
      'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75',
  },
  {
    id: 'approval',
    href: '/inbox?folder=approval',
    label: { th: 'รอ approve', en: 'Awaiting approval' },
    iconPath:
      'M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3',
  },
  {
    id: 'escalated',
    href: '/inbox?folder=escalated',
    label: { th: 'Escalated', en: 'Escalated' },
    iconPath:
      'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01',
  },
];

const BOTTOM = [
  {
    href: '/admin/knowledge',
    label: { th: 'Knowledge base', en: 'Knowledge base' },
    iconPath: 'M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z',
  },
  {
    href: '/advisor',
    label: { th: 'Workflows', en: 'Workflows' },
    iconPath: 'M5 7h14 M5 12h14 M5 17h6 M19 17l-3-3m3 3l-3 3',
  },
  {
    href: '/admin/settings',
    label: { th: 'ตั้งค่า', en: 'Settings' },
    iconPath: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h0a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v0a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z',
  },
] as const;

interface ChannelCount {
  key: ChannelKey;
  count: number;
}

export function InboxSidebar({
  folder,
  channelCounts,
  totalCounts,
}: {
  folder: FolderId | null;
  channelCounts: ChannelCount[];
  totalCounts: Record<FolderId, number>;
}) {
  return (
    <nav className="flex h-full flex-col p-3">
      <Link
        href="/"
        className="mb-3 flex shrink-0 items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-paper-2"
        aria-label="FlowAIOS"
      >
        <BrandMark />
        <span className="hidden text-[14.5px] font-semibold tracking-[-0.012em] text-ink xl:inline">
          FlowAIOS
        </span>
      </Link>

      <SectionLabel>Workspaces</SectionLabel>
      {FOLDERS.map((f) => {
        const active = folder === f.id || (folder === null && f.id === 'all');
        return (
          <Link
            key={f.id}
            href={f.href}
            aria-current={active ? 'page' : undefined}
            className={`group relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13.5px] transition-colors ${
              active
                ? 'bg-warm-soft text-warm'
                : 'text-ink-2 hover:bg-paper-2 hover:text-ink'
            }`}
          >
            <Glyph d={f.iconPath} />
            <span className="hidden flex-1 truncate xl:inline">
              <span className="th-only">{f.label.th}</span>
              <span className="en-only">{f.label.en}</span>
            </span>
            <Count active={active}>{totalCounts[f.id]}</Count>
          </Link>
        );
      })}

      <SectionLabel>Channels</SectionLabel>
      {channelCounts.map((c) => (
        <Link
          key={c.key}
          href={`/inbox?channel=${c.key}`}
          className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13.5px] text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
        >
          <ChannelIcon channel={c.key} size={16} />
          <span className="hidden flex-1 truncate xl:inline">
            {channelLabel(c.key)}
          </span>
          <span className="hidden font-mono text-[10.5px] text-mute xl:inline">
            {c.count}
          </span>
        </Link>
      ))}

      <div className="mt-auto flex flex-col gap-0.5 border-t border-hairline pt-3">
        {BOTTOM.map((b) => (
          <Link
            key={b.href}
            href={b.href}
            className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13.5px] text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
          >
            <Glyph d={b.iconPath} />
            <span className="hidden flex-1 truncate xl:inline">
              <span className="th-only">{b.label.th}</span>
              <span className="en-only">{b.label.en}</span>
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

function BrandMark() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden className="h-[24px] w-[24px] shrink-0">
      <defs>
        <linearGradient id="inbox-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4F46E5" />
          <stop offset="1" stopColor="#818CF8" />
        </linearGradient>
      </defs>
      <rect width="28" height="28" rx="7" fill="url(#inbox-logo-grad)" />
      <path
        d="M10 7 H20 V9.6 H12.5 V13.4 H18 V16 H12.5 V21 H10 Z"
        fill="#fff"
      />
    </svg>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 hidden px-2.5 pb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-mute xl:block">
      {children}
    </p>
  );
}

function Glyph({ d }: { d: string }) {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 opacity-80"
    >
      {d.split(/\s(?=[ML])/).map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}

function Count({ children, active }: { children: React.ReactNode; active: boolean }) {
  return (
    <span
      className={`hidden rounded-full px-1.5 font-mono text-[10px] xl:inline ${
        active ? 'bg-warm/15 text-warm' : 'bg-paper-2 text-mute'
      }`}
    >
      {children}
    </span>
  );
}

function channelLabel(key: ChannelKey): string {
  const labels: Record<ChannelKey, string> = {
    line: 'LINE OA',
    shopee: 'Shopee',
    lazada: 'Lazada',
    tiktok: 'TikTok',
    facebook: 'Facebook',
    messenger: 'Messenger',
    instagram: 'Instagram',
    email: 'Email',
    whatsapp: 'WhatsApp',
    web: 'Web',
  };
  return labels[key];
}
