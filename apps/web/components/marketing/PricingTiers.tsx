'use client';

import { useState } from 'react';
import Link from 'next/link';

type Cadence = 'monthly' | 'annual';

interface Tier {
  id: string;
  name: string;
  thbMonthly: number;
  thbMonthlyMax?: number;
  enterprise?: boolean;
  audience: string;
  oneLine: string; // editorial line, not bullet list
  ctaLabel: string;
  ctaHref: string;
  anchor?: { label: string; vsName: string; vsThbMonthly: number };
  includes: string[];
  excludes?: string[];
}

const TIERS: Tier[] = [
  {
    id: 'starter',
    name: 'Starter',
    thbMonthly: 990,
    thbMonthlyMax: 2990,
    audience: 'Solo · LINE OA only',
    oneLine: 'For one-person businesses on LINE. Auto-reply, memory, mobile approval. PromptPay billing.',
    ctaLabel: 'Try free 14 days',
    ctaHref: '/signup?tier=starter',
    includes: [
      'LINE OA single channel',
      'AI auto-reply (confidence-gated)',
      'Customer memory',
      'Setup Assistant + Thai-only UI',
      'Mobile-first phone-approval flow',
      'PromptPay billing',
    ],
    excludes: ['Multi-channel inbox', 'KB editor', 'Configuration Advisor'],
  },
  {
    id: 'growth',
    name: 'Growth',
    thbMonthly: 8000,
    thbMonthlyMax: 24000,
    audience: 'Founder / SMB · multi-channel',
    oneLine:
      'For founders who need every channel, real KB, and lessons that compound. Self-serve, no sales call.',
    ctaLabel: 'Try free 14 days',
    ctaHref: '/signup?tier=growth',
    anchor: { label: 'vs Manychat Pro', vsName: 'Manychat Pro', vsThbMonthly: 1820 }, // ~$50/mo
    includes: [
      'Everything in Starter, plus',
      'Multi-channel inbox (configurable)',
      'Channel-set-per-vertical config',
      'Intelligence Dashboard (lite)',
      'Knowledge Base + auto-lessons',
      'Sheets integration',
      'Web app + mobile',
    ],
    excludes: ['Configuration Advisor', 'Audit log export'],
  },
  {
    id: 'pro',
    name: 'Pro',
    thbMonthly: 35000,
    thbMonthlyMax: 95000,
    audience: 'Mid-market · 30–100 staff',
    oneLine:
      'For CS teams that need handle-time math, audit trail, and Thai live support. Pilot-led, 30-day success metric.',
    ctaLabel: 'Talk to us',
    ctaHref: '/contact?tier=pro',
    anchor: { label: 'vs Zaapi for 9-agent team', vsName: 'Zaapi 9 seats', vsThbMonthly: 41800 },
    includes: [
      'Everything in Growth, plus',
      'Configuration Advisor (full)',
      'Intelligence Dashboard (full)',
      'Conversation handoff card',
      'Multi-branch awareness',
      'Audit log export (CSV / JSONL)',
      'Thai live support, business hours',
    ],
    excludes: ['Custom integrations', 'On-prem option'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    thbMonthly: 120000,
    enterprise: true,
    audience: 'Regulated · 100+ staff',
    oneLine:
      'For regulated buyers: signed DPA, TH/SG residency, custom integrations, vendor liability indemnification.',
    ctaLabel: 'Talk to us',
    ctaHref: '/contact?tier=enterprise',
    includes: [
      'Everything in Pro, plus',
      'Signed DPA + PDPA control plane',
      'TH / SG data residency',
      'SOC2 documentation',
      'Vendor liability indemnification',
      'Custom integrations (SAP / booking / ERP)',
      'Dedicated CSM',
      'Vertical reference program access',
    ],
  },
];

function formatTHB(n: number): string {
  return `฿${n.toLocaleString('en-US')}`;
}

export function PricingTiers() {
  const [cadence, setCadence] = useState<Cadence>('monthly');
  const multiplier = cadence === 'annual' ? 10 : 1;
  const cadenceLabel = cadence === 'annual' ? '/yr' : '/mo';

  const starter = TIERS[0]!;
  const growth = TIERS[1]!;
  const pro = TIERS[2]!;
  const enterprise = TIERS[3]!;

  return (
    <section className="pb-20">
      <div className="mx-auto w-[min(1200px,calc(100%-48px))]">
        {/* Cadence toggle, right-aligned */}
        <div className="mb-10 flex justify-end">
          <div className="inline-flex items-center gap-1 rounded-full border border-hairline bg-paper-2 p-1">
            {(['monthly', 'annual'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCadence(c)}
                className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                  cadence === c
                    ? 'bg-paper text-ink shadow-soft'
                    : 'text-ink-2 hover:text-ink'
                }`}
              >
                {c === 'monthly' ? 'Monthly' : 'Annual · save 2 mo'}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetric layout: Growth is the hero (large, left), the other 3 stack right.
            On mobile: Growth on top, then Starter, Pro, Enterprise. */}
        <div className="grid gap-7 lg:grid-cols-[1.6fr_1fr]">
          {/* GROWTH — hero card, larger */}
          <article className="relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-warm bg-paper p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_600px_300px_at_30%_0%,hsl(var(--warm-soft)),transparent_70%)]"
            />
            <div className="relative">
              <div className="flex items-center gap-3">
                <p className="label-mono text-warm">Most chosen</p>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                  {growth.audience}
                </span>
              </div>
              <h3 className="mt-4 text-[28px] font-semibold leading-tight text-ink">
                {growth.name}
              </h3>
              <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-ink-2">
                {growth.oneLine}
              </p>

              <div className="mt-8 flex items-baseline gap-2">
                <span className="text-[44px] font-semibold leading-none tracking-tight text-ink tabular-nums">
                  {formatTHB(growth.thbMonthly * multiplier)}
                </span>
                {growth.thbMonthlyMax && (
                  <span className="text-[20px] text-ink-2 tabular-nums">
                    – {formatTHB(growth.thbMonthlyMax * multiplier)}
                  </span>
                )}
                <span className="ml-1 text-[14px] font-normal text-ink-2">
                  {cadenceLabel}
                </span>
              </div>
              {growth.anchor && (
                <p className="mt-2 font-mono text-[11px] text-mute">
                  {growth.anchor.label} ·{' '}
                  <span className="text-warm">
                    {Math.round(
                      ((growth.anchor.vsThbMonthly - growth.thbMonthly) / growth.anchor.vsThbMonthly) * 100,
                    )}
                    % less
                  </span>{' '}
                  at our entry price
                </p>
              )}

              <div className="mt-9 grid gap-2.5 sm:grid-cols-2">
                {growth.includes.map((line, i) => (
                  <p
                    key={line}
                    className={`flex gap-2.5 text-[13px] leading-snug ${
                      i === 0 ? 'font-medium text-ink' : 'text-ink-2'
                    }`}
                  >
                    <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-warm" />
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <Link
              href={growth.ctaHref}
              className="relative mt-9 inline-flex items-center justify-center self-start rounded-lg bg-warm px-6 py-3 text-[14px] font-medium text-paper transition-all hover:-translate-y-px hover:bg-warm-2 hover:shadow-cta"
            >
              {growth.ctaLabel}
            </Link>
          </article>

          {/* SATELLITE STACK — Starter, Pro, Enterprise as horizontal rows on right column */}
          <div className="grid gap-3.5 lg:grid-rows-3">
            {[starter, pro, enterprise].map((t, i) => (
              <article
                key={t.id}
                className={`flex flex-col justify-between gap-4 rounded-xl border border-hairline bg-paper p-5 ${
                  t.enterprise ? 'border-dashed' : ''
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-[16px] font-semibold text-ink">{t.name}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                      {t.audience}
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] leading-snug text-ink-2">
                    {t.oneLine}
                  </p>
                  {t.anchor && (
                    <p className="mt-1.5 font-mono text-[10.5px] text-mute">
                      {t.anchor.label} ·{' '}
                      <span className="text-warm">
                        {Math.round(
                          ((t.anchor.vsThbMonthly - t.thbMonthly) / t.anchor.vsThbMonthly) * 100,
                        )}
                        % less
                      </span>
                    </p>
                  )}
                </div>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    {t.enterprise ? (
                      <p className="text-[20px] font-semibold leading-none tracking-tight text-ink tabular-nums">
                        From {formatTHB(t.thbMonthly * multiplier)}
                        <span className="ml-1 text-[12px] font-normal text-ink-2">
                          {cadenceLabel}
                        </span>
                      </p>
                    ) : (
                      <p className="text-[20px] font-semibold leading-none tracking-tight text-ink tabular-nums">
                        {formatTHB(t.thbMonthly * multiplier)}
                        {t.thbMonthlyMax && (
                          <span className="ml-1 text-[12px] text-ink-2 tabular-nums">
                            – {formatTHB(t.thbMonthlyMax * multiplier)}
                          </span>
                        )}
                        <span className="ml-1 text-[12px] font-normal text-ink-2">
                          {cadenceLabel}
                        </span>
                      </p>
                    )}
                  </div>
                  <Link
                    href={t.ctaHref}
                    className="inline-flex items-center gap-1 rounded-md border border-hairline bg-paper-2 px-3 py-2 text-[12.5px] font-medium text-ink transition-colors hover:border-warm/40 hover:bg-warm-soft hover:text-warm"
                  >
                    {t.ctaLabel} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Comparison detail — full feature list per non-Growth tier, expanded inline */}
        <details className="group mt-12 overflow-hidden rounded-xl border border-hairline bg-paper-2">
          <summary className="flex cursor-pointer items-center justify-between gap-3 px-6 py-4 text-[14px] font-medium text-ink transition-colors hover:bg-paper-3">
            <span>เทียบทุก tier</span>
            <span className="font-mono text-[11px] tracking-widest text-mute transition-transform group-open:rotate-180">
              ▼
            </span>
          </summary>
          <div className="border-t border-hairline px-6 py-7">
            <div className="grid gap-7 md:grid-cols-3">
              {[starter, pro, enterprise].map((t) => (
                <div key={t.id}>
                  <p className="label-mono">{t.name}</p>
                  <h4 className="mt-2 text-[15px] font-semibold text-ink">
                    {t.audience}
                  </h4>
                  <ul className="mt-4 space-y-1.5">
                    {t.includes.map((line) => (
                      <li
                        key={line}
                        className="flex gap-2 text-[12.5px] leading-snug text-ink-2"
                      >
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-warm" />
                        {line}
                      </li>
                    ))}
                    {t.excludes?.map((line) => (
                      <li
                        key={line}
                        className="flex gap-2 text-[12px] leading-snug text-mute line-through"
                      >
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-mute" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
