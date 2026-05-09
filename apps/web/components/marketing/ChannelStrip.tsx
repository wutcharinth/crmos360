import { ChannelIcon } from '@/components/ui/channel-icon';

const STRIP_CHANNELS = [
  'line',
  'tiktok',
  'shopee',
  'lazada',
  'facebook',
  'instagram',
  'email',
] as const;

export function ChannelStrip() {
  return (
    <section
      aria-label="Supported channels"
      className="border-y border-hairline bg-paper-2 py-9"
    >
      <div className="mx-auto flex w-[min(1240px,calc(100%-48px))] flex-col items-center gap-6 md:flex-row md:justify-between md:gap-10">
        <p className="max-w-md text-center text-[13px] text-ink-2 md:text-left">
          <span className="th-only">
            สร้างมาเพื่อธุรกิจไทยและ SEA ที่ขายและบริการลูกค้าหลายช่องทางทุกวัน
          </span>
          <span className="en-only">
            Built for Thai and SEA businesses serving customers across many channels every day.
          </span>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4 md:justify-end">
          {STRIP_CHANNELS.map((c) => (
            <ChannelIcon
              key={c}
              channel={c}
              size={22}
              className="text-ink-2 transition-colors hover:text-warm"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
