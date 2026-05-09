'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChannelIcon, type ChannelKey } from '@/components/ui/channel-icon';

/**
 * Right column — context pane.
 *
 * Three tabs: AI · Customer · Order.
 *   - AI tab: signals grid (intent / sentiment / urgency / memory hit),
 *     memory list (notes from customer_memory), suggested actions.
 *   - Customer tab: profile fields (name, channel, since, orders, LTV,
 *     tier), tags, memory.
 *   - Order tab: most recent order (mocked from a stub for now —
 *     needs a real `orders` table that doesn't exist yet).
 *
 * Wired vs mocked:
 *   - Customer name, channel, tags, memory → real
 *   - Signals (intent/sentiment/urgency) → mocked (no NLP pipeline yet)
 *   - Orders → mocked (no orders table yet)
 *   - Tier / orders count / LTV → mocked unless caller passes them
 */
export interface ContextProps {
  customerId: string;
  customerName: string;
  channel: ChannelKey;
  since?: string | null;
  tier?: string;
  orders?: number;
  ltv?: string | null;
  tags: string[];
  memory: { id: string; kind: string; content: string }[];
  signals?: { l: string; v: string; cls?: 'pos' | 'warn' | 'neg' }[];
  actions?: string[];
}

const TABS = ['AI', 'Customer', 'Order'] as const;
type Tab = (typeof TABS)[number];

export function InboxContextPane(props: ContextProps) {
  const [tab, setTab] = useState<Tab>('AI');

  return (
    <>
      <div className="flex items-center border-b border-hairline px-4 py-3.5">
        <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-ink">
          {tab === 'AI' ? 'AI · context' : tab === 'Customer' ? props.customerName : 'Order'}
        </h3>
        <div className="ml-auto flex gap-0 rounded-md bg-paper-2 p-0.5">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded px-2.5 py-1 font-mono text-[10.5px] transition-colors ${
                tab === t ? 'bg-paper text-ink shadow-sm' : 'text-mute hover:text-ink'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === 'AI' && <AiTab {...props} />}
      {tab === 'Customer' && <CustomerTab {...props} />}
      {tab === 'Order' && <OrderTab {...props} />}
    </>
  );
}

function AiTab(props: ContextProps) {
  const signals = props.signals ?? [
    { l: 'intent', v: 'inquiry', cls: undefined },
    { l: 'sentiment', v: 'neutral', cls: undefined },
    { l: 'urgency', v: 'low', cls: 'pos' as const },
    { l: 'memory hit', v: `${props.memory.length} / 12`, cls: undefined },
  ];
  const actions = props.actions ?? ['none yet'];

  return (
    <>
      <Section title="Signals">
        <div className="grid grid-cols-2 gap-1.5">
          {signals.map((s, i) => (
            <div
              key={i}
              className="rounded-lg border border-hairline bg-paper-2 px-2.5 py-2"
            >
              <p className="font-mono text-[9.5px] uppercase tracking-wider text-mute">
                {s.l}
              </p>
              <p
                className={`mt-1 font-mono text-[12px] font-medium ${
                  s.cls === 'pos'
                    ? 'text-mint'
                    : s.cls === 'warn'
                      ? 'text-warm'
                      : s.cls === 'neg'
                        ? 'text-rose'
                        : 'text-ink'
                }`}
              >
                {s.v}
              </p>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Memory">
        {props.memory.length === 0 ? (
          <p className="text-[12.5px] text-mute">
            No memory yet. AI extracts facts after a few exchanges.
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {props.memory.slice(0, 6).map((m) => (
              <li
                key={m.id}
                className="flex gap-2 rounded-lg border border-hairline bg-paper-2 px-2.5 py-2 text-[12.5px] leading-snug text-ink-2"
              >
                <span aria-hidden className="mt-0.5 shrink-0 text-warm">
                  ›
                </span>
                <div className="min-w-0">
                  <span className="font-mono text-[9.5px] uppercase tracking-wide text-warm">
                    {m.kind}
                  </span>
                  <p className="mt-0.5">{m.content}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
      <Section title="Suggested actions">
        <div className="flex flex-col gap-1.5">
          {actions.map((a, i) => (
            <button
              key={i}
              type="button"
              className="flex items-center justify-between rounded-lg border border-hairline bg-paper-2 px-2.5 py-2 text-left text-[12.5px] transition-colors hover:border-warm/30 hover:bg-warm-soft/40"
            >
              <span className="font-mono text-ink-2">{a}</span>
              <span className="font-mono text-[10.5px] text-warm">run →</span>
            </button>
          ))}
        </div>
      </Section>
    </>
  );
}

function CustomerTab(props: ContextProps) {
  return (
    <>
      <Section title="Profile">
        <Field label="Name" value={props.customerName} />
        <Field
          label="Channel"
          valueNode={<ChannelIcon channel={props.channel} size={14} />}
        />
        {props.since && <Field label="Customer since" value={props.since} />}
        {props.orders != null && <Field label="Orders" value={String(props.orders)} mono />}
        {props.ltv && <Field label="LTV" value={props.ltv} mono />}
        {props.tier && <Field label="Tier" value={props.tier} />}
      </Section>
      <Section title="Tags">
        {props.tags.length === 0 ? (
          <p className="text-[12.5px] text-mute">No tags yet.</p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {props.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-hairline bg-paper-2 px-2 py-0.5 font-mono text-[10.5px] text-ink-2"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </Section>
      <Section title="Memory">
        <ul className="flex flex-col gap-1.5">
          {props.memory.slice(0, 6).map((m) => (
            <li
              key={m.id}
              className="flex gap-2 rounded-lg border border-hairline bg-paper-2 px-2.5 py-2 text-[12.5px] leading-snug text-ink-2"
            >
              <span aria-hidden className="mt-0.5 shrink-0 text-warm">
                ›
              </span>
              <span>{m.content}</span>
            </li>
          ))}
        </ul>
      </Section>
      <div className="px-4 pb-4">
        <Link
          href={`/customers/${props.customerId}`}
          className="text-[12.5px] text-warm hover:underline"
        >
          View full profile →
        </Link>
      </div>
    </>
  );
}

function OrderTab(_props: ContextProps) {
  // No orders table yet — render the "no order" empty state with a hint
  // about where this data will come from. The mocked card structure
  // mirrors the prototype so the column doesn't look empty.
  return (
    <Section title="Recent order">
      <div className="rounded-lg border border-hairline bg-paper-2 p-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11.5px] font-medium text-ink">
            no order linked
          </span>
          <span className="rounded-full bg-paper-3 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wide text-mute">
            stub
          </span>
        </div>
        <p className="mt-2 text-[12px] leading-snug text-mute">
          Order data wires up once the Shipnity / Shopee integration ships. For now
          this column would link to the customer&rsquo;s most recent order, with
          carrier, tracking, ETA, and total.
        </p>
      </div>
    </Section>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-hairline px-4 py-4">
      <h4 className="mb-2.5 font-mono text-[10px] font-medium uppercase tracking-wider text-mute">
        {title}
      </h4>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  valueNode,
  mono,
}: {
  label: string;
  value?: string;
  valueNode?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1 text-[12.5px]">
      <span className="text-mute">{label}</span>
      <span
        className={`max-w-[60%] truncate text-right text-ink ${mono ? 'font-mono text-[11.5px]' : 'font-medium'}`}
      >
        {valueNode ?? value ?? '—'}
      </span>
    </div>
  );
}
