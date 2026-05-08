import { channelStripBrands } from '@/lib/marketing/data';

export function ChannelStrip() {
  return (
    <section aria-label="Supported channels" className="border-y border-hairline bg-paper-2 py-9">
      <div className="mx-auto flex w-[min(1240px,calc(100%-48px))] flex-col items-center gap-5 md:flex-row md:justify-between md:gap-10">
        <p className="max-w-md text-center text-[13px] text-ink-2 md:text-left">
          สร้างมาเพื่อธุรกิจไทยและ SEA ที่ขายและบริการลูกค้าหลายช่องทางทุกวัน
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 md:justify-end">
          {channelStripBrands.map((b) => (
            <span
              key={b}
              className="font-mono text-[12px] tracking-[0.05em] text-ink-2"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
