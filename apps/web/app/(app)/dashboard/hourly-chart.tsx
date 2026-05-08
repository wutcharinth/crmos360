'use client';

interface Props {
  data: { hour: string; inbound: number; outbound: number }[];
}

export function HourlyChart({ data }: Props) {
  const max = Math.max(1, ...data.flatMap((d) => [d.inbound, d.outbound]));

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1 h-40">
        {data.map((d) => {
          const inH = (d.inbound / max) * 100;
          const outH = (d.outbound / max) * 100;
          return (
            <div
              key={d.hour}
              className="group relative flex flex-1 flex-col items-center gap-0.5"
              title={`${d.hour}: ${d.inbound} in / ${d.outbound} out`}
            >
              <div className="flex w-full flex-1 items-end gap-px">
                <div
                  className="flex-1 rounded-t bg-mint/60 transition-colors group-hover:bg-mint"
                  style={{ height: `${inH}%` }}
                />
                <div
                  className="flex-1 rounded-t bg-warm/60 transition-colors group-hover:bg-warm"
                  style={{ height: `${outH}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
        <span>{data[0]?.hour}</span>
        <span>{data[Math.floor(data.length / 2)]?.hour}</span>
        <span>{data[data.length - 1]?.hour}</span>
      </div>
      <div className="flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-mint" /> Inbound
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-warm" /> Outbound
        </span>
      </div>
    </div>
  );
}
