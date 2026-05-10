'use client';

import { useState } from 'react';
import { ChannelIcon, type ChannelKey } from '@/components/ui/channel-icon';

/**
 * Brand-logo loader. Tries to render an officially-licensed asset from
 *   /public/channel-logos/{key}.{ext}
 * and falls back to the in-house stylized <ChannelIcon> if the file is
 * missing or fails to load.
 *
 * Drop official press-kit SVGs into apps/web/public/channel-logos/ named
 * by ChannelKey ('line.svg', 'shopee.svg', etc.) and they take over
 * automatically. See the README in that directory for download links.
 */
export function BrandLogo({
  channel,
  size = 28,
  className,
  ext = 'svg',
}: {
  channel: ChannelKey;
  size?: number;
  className?: string;
  ext?: 'svg' | 'png' | 'webp';
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return <ChannelIcon channel={channel} size={size} className={className} />;
  }

  return (
    // Plain <img> on purpose — Next.js <Image> requires width/height typing
    // that breaks the rounded-tile aesthetic; logos here are tiny static
    // assets so the optimizer adds little value.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/channel-logos/${channel}.${ext}`}
      alt=""
      width={size}
      height={size}
      onError={() => setErrored(true)}
      className={`block rounded-md ${className ?? ''}`}
      style={{ width: size, height: size, objectFit: 'cover' }}
      loading="lazy"
      decoding="async"
      aria-hidden
    />
  );
}
