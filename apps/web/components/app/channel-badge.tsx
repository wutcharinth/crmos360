import { ChannelIcon, CHANNEL_LABELS, type ChannelKey } from '@/components/ui/channel-icon';

interface Props {
  channel: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const TINTS: Record<ChannelKey, string> = {
  line: 'border-mint/30 bg-mint-soft text-mint',
  shopee: 'border-warm/30 bg-warm-soft text-warm',
  lazada: 'border-warm/30 bg-warm-soft text-warm',
  tiktok: 'border-rose/30 bg-[hsl(var(--rose)/0.06)] text-rose',
  facebook: 'border-hairline bg-paper-2 text-ink-2',
  messenger: 'border-hairline bg-paper-2 text-ink-2',
  instagram: 'border-rose/30 bg-[hsl(var(--rose)/0.06)] text-rose',
  email: 'border-hairline bg-paper-2 text-mute',
  whatsapp: 'border-mint/30 bg-mint-soft text-mint',
  web: 'border-hairline bg-paper-2 text-ink-2',
};

function isChannelKey(v: string): v is ChannelKey {
  return v in TINTS;
}

export function ChannelBadge({ channel, size = 'sm', showLabel = false }: Props) {
  const key: ChannelKey = isChannelKey(channel) ? channel : 'web';
  const tint = TINTS[key];
  const padding = size === 'sm' ? 'h-5 px-1.5' : 'h-6 px-2';
  const iconSize = size === 'sm' ? 12 : 14;
  const label = CHANNEL_LABELS[key];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${tint} ${padding}`}
      title={label}
    >
      <ChannelIcon channel={key} size={iconSize} />
      {showLabel && (
        <span className="font-mono text-[10px] uppercase tracking-[0.12em]">{label}</span>
      )}
    </span>
  );
}
