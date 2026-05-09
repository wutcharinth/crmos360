import type { ReactElement } from 'react';
import Link from 'next/link';
import { Nav } from '@/components/marketing/Nav';
import { Footer } from '@/components/marketing/Footer';

export interface VerticalLandingProps {
  kicker: string;
  headline: string;
  headlineEm: string; // emphasized fragment (warm)
  headlineTrail?: string;
  lead: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  channels: string[];
  pains: { title: string; quote: string; persona: string }[];
  features: { title: string; body: string; tag?: string }[];
  metrics?: { figure: string; caption: string }[];
  pricingHint: { tier: string; price: string; note: string };
  artifact?: { kind: 'inbox' | 'confidence' | 'lessons'; title: string };
}

const featureArtifact = (kind: NonNullable<VerticalLandingProps['artifact']>['kind']) => {
  if (kind === 'confidence') {
    return (
      <div className="space-y-3.5">
        {[
          { tier: 'Auto', score: 94, body: 'พัสดุของคุณส่งจาก Kerry แล้วเมื่อวานนี้…', tone: 'mint' as const },
          { tier: 'Approval', score: 78, body: 'มีโปร 3 แถม 1 ไหมคะ — เสนอราคาส่ง?', tone: 'warm' as const },
          { tier: 'Escalate', score: 31, body: 'พี่อ้อยครับ ขอราคา tier เก่าได้ไหม', tone: 'rose' as const },
        ].map((row) => (
          <div key={row.tier} className="flex items-center gap-3.5">
            <span
              className={`inline-flex h-6 w-[78px] items-center justify-center rounded-full font-mono text-[10px] uppercase tracking-[0.14em] ${
                row.tone === 'mint'
                  ? 'bg-mint-soft text-mint'
                  : row.tone === 'warm'
                    ? 'bg-warm-soft text-warm'
                    : 'bg-[hsl(var(--rose)/0.10)] text-rose'
              }`}
            >
              {row.tier}
            </span>
            <span className="font-mono text-[11px] tabular-nums text-mute">{row.score}</span>
            <p className="flex-1 truncate text-[13px] text-ink-2">&ldquo;{row.body}&rdquo;</p>
          </div>
        ))}
      </div>
    );
  }
  if (kind === 'lessons') {
    return (
      <div className="space-y-3">
        {[
          {
            label: 'AI noticed',
            body: 'Tracking-status questions get edited 47 times/30d. Suggest auto-rule.',
          },
          {
            label: 'AI noticed',
            body: 'VIP customers ask for monthly code 31× — 28× answered identically.',
          },
          {
            label: 'AI noticed',
            body: 'Negative shipping sentiment auto-replied: 71% follow-up. Escalate.',
          },
        ].map((row, i) => (
          <div key={i} className="flex gap-3">
            <span className="mt-1 font-mono text-[10px] uppercase tracking-widest text-mute">
              {row.label}
            </span>
            <p className="text-[13px] leading-relaxed text-ink-2">{row.body}</p>
          </div>
        ))}
      </div>
    );
  }
  // inbox default
  return (
    <div className="space-y-2.5">
      {[
        { sender: 'LINE · พิมพ์ลภัส', tag: 'Auto', body: 'พัสดุถึงไหนแล้วคะ' },
        { sender: 'TikTok · @aor', tag: 'Approval', body: 'wholesale 50 pcs ราคา?' },
        { sender: 'Shopee · Lin Wei', tag: 'Auto', body: 'ส่งฟรีไหมคะ' },
      ].map((row) => (
        <div
          key={row.sender}
          className="flex items-center justify-between gap-3 rounded-md border border-hairline bg-paper px-3.5 py-2.5"
        >
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-widest text-mute">
              {row.sender}
            </p>
            <p className="mt-0.5 truncate text-[13px] text-ink">{row.body}</p>
          </div>
          <span
            className={`flex-shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
              row.tag === 'Auto'
                ? 'bg-mint-soft text-mint'
                : 'bg-warm-soft text-warm'
            }`}
          >
            {row.tag}
          </span>
        </div>
      ))}
    </div>
  );
};

export function VerticalLanding({
  kicker,
  headline,
  headlineEm,
  headlineTrail,
  lead,
  primaryCta,
  secondaryCta,
  channels,
  pains,
  features,
  metrics,
  pricingHint,
  artifact,
}: VerticalLandingProps) {
  const primaryPain = pains[0];
  const supportingPains = pains.slice(1);
  const headlineFeature = features[0];
  const supportingFeatures = features.slice(1);

  if (!primaryPain || !headlineFeature) {
    throw new Error('VerticalLanding requires at least one pain and one feature.');
  }

  return (
    <>
      <Nav />
      <main>
        {/* HERO — restrained, no metric tile */}
        <section className="relative pb-12 pt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-32 h-[560px] bg-[radial-gradient(ellipse_1100px_560px_at_50%_-220px,hsl(var(--warm)/0.06),transparent_65%)]"
          />
          <div className="relative mx-auto w-[min(1080px,calc(100%-48px))]">
            <p className="label-mono">{kicker}</p>
            <h1 className="display-lg mt-5 max-w-[18ch]">
              {headline}{' '}
              <em className="not-italic font-semibold text-warm">{headlineEm}</em>
              {headlineTrail ? <> {headlineTrail}</> : null}
            </h1>
            <p className="lead mt-6 max-w-[58ch]">{lead}</p>

            <div className="mt-9 flex flex-wrap items-baseline gap-x-9 gap-y-4">
              <Link
                href={primaryCta.href}
                className="rounded-lg bg-warm px-5 py-3 text-[14px] font-medium text-paper transition-all hover:-translate-y-px hover:bg-warm-2 hover:shadow-cta"
              >
                {primaryCta.label}
              </Link>
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="group inline-flex items-center gap-1.5 text-[14px] text-ink transition-colors hover:text-warm"
                >
                  {secondaryCta.label}
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              )}

              {/* Channel chips inline with CTA — no separate row */}
              <div className="flex flex-wrap items-center gap-1.5">
                {channels.slice(0, 5).map((ch) => (
                  <span
                    key={ch}
                    className="font-mono text-[11px] tracking-[0.05em] text-mute"
                  >
                    {ch}
                  </span>
                )).reduce<ReactElement[]>((acc, el, i, arr) => {
                  acc.push(el);
                  if (i < arr.length - 1) {
                    acc.push(
                      <span key={`sep-${i}`} className="text-mute/50">
                        ·
                      </span>,
                    );
                  }
                  return acc;
                }, [])}
                {channels.length > 5 && (
                  <span className="font-mono text-[11px] tracking-[0.05em] text-mute">
                    +{channels.length - 5}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* PAINS — single oversized pull quote, two side-notes below */}
        <section className="border-t border-hairline py-20">
          <div className="mx-auto w-[min(1080px,calc(100%-48px))]">
            <p className="label-mono">Heard from operators</p>
            <blockquote className="mt-7">
              <p className="text-[clamp(22px,2.6vw,34px)] font-light leading-tight tracking-tight text-ink">
                <span className="text-warm">&ldquo;</span>
                <em className="not-italic">{primaryPain.quote}</em>
                <span className="text-warm">&rdquo;</span>
              </p>
              <footer className="mt-5 flex items-center gap-3">
                <span className="h-px w-10 bg-warm" aria-hidden />
                <p className="text-[13px] font-medium text-ink-2">
                  {primaryPain.persona}
                </p>
                <span className="text-mute">·</span>
                <p className="font-mono text-[11px] uppercase tracking-widest text-mute">
                  {primaryPain.title}
                </p>
              </footer>
            </blockquote>

            {supportingPains.length > 0 && (
              <div className="mt-14 grid gap-x-12 gap-y-7 md:grid-cols-2">
                {supportingPains.map((p) => (
                  <div key={p.title} className="border-t border-hairline pt-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm">
                      {p.title}
                    </p>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
                      &ldquo;{p.quote}&rdquo;
                    </p>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-mute">
                      {p.persona}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FEATURE SPREAD — asymmetric: 1 hero feature with artifact + 2 stacked side features */}
        <section className="border-t border-hairline bg-paper-2 py-20">
          <div className="mx-auto w-[min(1080px,calc(100%-48px))]">
            <p className="label-mono">What actually changes</p>
            <h2 className="display-md mt-3 max-w-[24ch]">
              สามสิ่งที่ทีมคุณจะเห็นในสัปดาห์แรก
            </h2>

            <div className="mt-12 grid gap-12 lg:grid-cols-[1.25fr_1fr]">
              {/* HERO FEATURE — left, larger, with artifact */}
              <article>
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-[44px] font-light leading-none text-warm">
                    01
                  </span>
                  {headlineFeature.tag && (
                    <span className="rounded-full border border-hairline bg-paper px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
                      {headlineFeature.tag}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-[24px] font-semibold leading-tight text-ink">
                  {headlineFeature.title}
                </h3>
                <p className="lead mt-4 max-w-[48ch]">{headlineFeature.body}</p>
                {artifact && (
                  <div className="mt-7 rounded-xl border border-hairline bg-paper p-5 shadow-soft">
                    <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                      {artifact.title}
                    </p>
                    {featureArtifact(artifact.kind)}
                  </div>
                )}
              </article>

              {/* SUPPORTING — right, two stacked, smaller, no card chrome */}
              <div className="space-y-12 self-start lg:pt-2">
                {supportingFeatures.map((f, i) => (
                  <article key={f.title}>
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-[24px] font-light leading-none text-ink-2">
                        {String(i + 2).padStart(2, '0')}
                      </span>
                      {f.tag && (
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
                          {f.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 text-[17px] font-semibold leading-tight text-ink">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
                      {f.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* METRICS — inline editorial strip, no cards */}
        {metrics && metrics.length > 0 && (
          <section className="border-t border-hairline py-14">
            <div className="mx-auto w-[min(1080px,calc(100%-48px))]">
              <p className="label-mono">In pilot</p>
              <div className="mt-5 flex flex-col flex-wrap gap-y-7 sm:flex-row sm:items-baseline sm:gap-x-12">
                {metrics.map((m, i) => (
                  <div key={m.caption} className="flex items-baseline gap-4">
                    {i > 0 && (
                      <span className="hidden font-mono text-mute sm:block" aria-hidden>
                        |
                      </span>
                    )}
                    <span className="text-[clamp(32px,3.4vw,44px)] font-semibold tracking-tight text-ink tabular-nums">
                      {m.figure}
                    </span>
                    <span className="text-[13px] leading-tight text-ink-2">
                      {m.caption}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PRICING — banded, single line of conviction */}
        <section className="border-t border-hairline bg-paper-2 py-16">
          <div className="mx-auto flex w-[min(1080px,calc(100%-48px))] flex-col items-start gap-7 md:flex-row md:items-end md:justify-between">
            <div className="flex-1">
              <p className="label-mono">{pricingHint.tier}</p>
              <p className="mt-3 text-[clamp(28px,3.2vw,40px)] font-semibold leading-tight tracking-tight text-ink">
                {pricingHint.price}
              </p>
              <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-ink-2">
                {pricingHint.note}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              <Link
                href="/pricing"
                className="text-[14px] text-ink-2 underline-offset-4 hover:text-ink hover:underline"
              >
                ดู 4 tiers →
              </Link>
              <Link
                href={primaryCta.href}
                className="rounded-lg bg-warm px-5 py-3 text-[14px] font-medium text-paper transition-all hover:-translate-y-px hover:bg-warm-2 hover:shadow-cta"
              >
                {primaryCta.label}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
