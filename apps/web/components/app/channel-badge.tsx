interface Props {
  channel: string;
  size?: 'sm' | 'md';
}

const STYLES: Record<string, string> = {
  line: 'bg-[#06C755]/10 text-[#06C755] border-[#06C755]/30',
  messenger: 'bg-[#0078FF]/10 text-[#0078FF] border-[#0078FF]/30',
  instagram: 'bg-[#E4405F]/10 text-[#E4405F] border-[#E4405F]/30',
};

export function ChannelBadge({ channel, size = 'sm' }: Props) {
  const cls = STYLES[channel] ?? 'bg-muted text-muted-foreground border-border';
  const padding = size === 'sm' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-1 text-xs';
  return (
    <span
      className={`inline-flex items-center rounded-full border font-mono uppercase tracking-wider ${cls} ${padding}`}
    >
      {channel}
    </span>
  );
}
