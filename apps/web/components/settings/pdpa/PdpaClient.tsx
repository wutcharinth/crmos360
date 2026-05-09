'use client';

import { useCallback, useEffect, useState } from 'react';
import type { MockAuditLogEntry } from '@/lib/mocks/types';
import { ResidencyOption } from './ResidencyOption';
import { AuditTable } from './AuditTable';

type Residency = 'TH' | 'SG' | 'EU';
type MemoryMode = 'auto' | 'approval' | 'manual';

const TH_DIAGRAM = `[your customer]  →  [BKK edge]  →  [Bangkok DC]
                                       │
                                       └─ encrypted at rest (AES-256)
                                       └─ never leaves TH borders`;

const SG_DIAGRAM = `[your customer]  →  [BKK edge]  →  [Singapore DC]
                                       │
                                       └─ encrypted at rest (AES-256)
                                       └─ MAS-aligned, ASEAN region only`;

const EU_DIAGRAM = `[your customer]  →  [BKK edge]  →  [Frankfurt DC]
                                       │
                                       └─ encrypted at rest (AES-256)
                                       └─ GDPR + Schrems II compliant`;

const MEMORY_MODES: Array<{
  value: MemoryMode;
  label: string;
  description: string;
}> = [
  {
    value: 'auto',
    label: 'Auto-extract',
    description:
      'Extract facts on every reply. Fastest signal accumulation; suited for orgs with established review processes.',
  },
  {
    value: 'approval',
    label: 'Approval queue · first 90 days',
    description:
      'New facts hold in a pending queue for human review before persisting. Auto-promotes to live mode after day 90.',
  },
  {
    value: 'manual',
    label: 'Manual only',
    description:
      'No automatic extraction. Operators add memory entries by hand. Highest control, slowest learning.',
  },
];

interface Toast {
  id: number;
  message: string;
}

export function PdpaClient({ entries }: { entries: MockAuditLogEntry[] }) {
  const [residency, setResidency] = useState<Residency>('TH');
  const [memoryMode, setMemoryMode] = useState<MemoryMode>('approval');
  const [memoryDays, setMemoryDays] = useState<number>(90);
  const [inboxDays, setInboxDays] = useState<number>(365);
  const [auditDays, setAuditDays] = useState<number>(365);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const announceSaved = useCallback(() => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message: 'Saved (mock)' }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2000);
  }, []);

  // Skip the announce on first mount; only fire on user-initiated changes.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted) announceSaved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [residency, memoryMode, memoryDays, inboxDays, auditDays]);

  const onDpaDownload = () => {
    const text = `FlowAIOS — Data Processing Agreement (template)

Effective: ${new Date().toISOString().slice(0, 10)}
Org residency: ${residency}
Memory mode: ${memoryMode}
Retention: memory ${memoryDays}d / inbox ${inboxDays}d / audit ${auditDays}d

The full template would describe:
  · Roles (controller / processor) and lawful basis under PDPA B.E. 2562.
  · Categories of data processed (conversations, customer profile, memory facts).
  · Subprocessors (Supabase, Google Cloud, LINE Platform, Anthropic / Google AI).
  · Cross-border transfer terms aligned with the residency selection above.
  · Sub-processor change notice, audit rights, breach notification (72h).
  · Data subject request handling (access, correction, erasure, portability).
  · Retention and deletion schedule per the values above.
  · Termination, return / deletion of data, and survival of confidentiality.

This is a stubbed download from mock mode. The production build wires a
PDF generator from the same template.
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowaios-dpa-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* 1 — Data residency */}
      <section className="mt-12">
        <p className="label-mono">01 · Residency</p>
        <h2 className="mt-3 text-[clamp(22px,2.4vw,30px)] font-semibold leading-tight tracking-tight text-ink">
          <em className="not-italic font-semibold text-warm">Where</em> your customer data lives.
        </h2>
        <p className="lead mt-3 max-w-[60ch]">
          Pick a region. We pin the primary database, the embedding store, and every backup
          to that geography. No round-trips through other regions for inference.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <ResidencyOption
            value="TH"
            label="Thailand"
            region="Bangkok · ap-southeast-7"
            latency="< 30ms from BKK"
            diagram={TH_DIAGRAM}
            selected={residency === 'TH'}
            onSelect={setResidency}
          />
          <ResidencyOption
            value="SG"
            label="Singapore"
            region="Singapore · ap-southeast-1"
            latency="~ 50ms from BKK"
            diagram={SG_DIAGRAM}
            selected={residency === 'SG'}
            onSelect={setResidency}
          />
          <ResidencyOption
            value="EU"
            label="European Union"
            region="Frankfurt · eu-central-1"
            latency="~ 200ms from BKK"
            diagram={EU_DIAGRAM}
            selected={residency === 'EU'}
            onSelect={setResidency}
          />
        </div>
      </section>

      <div className="mt-16 border-t border-hairline" />

      {/* 2 — Memory mode */}
      <section className="mt-14">
        <p className="label-mono">02 · Memory mode</p>
        <h2 className="mt-3 text-[clamp(22px,2.4vw,30px)] font-semibold leading-tight tracking-tight text-ink">
          How <em className="not-italic font-semibold text-warm">facts</em> get into the customer file.
        </h2>
        <p className="lead mt-3 max-w-[60ch]">
          Memory is the layer that makes the second message smarter than the first. Pick
          how aggressively the system writes to it.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-start">
          <div className="relative">
            <select
              value={memoryMode}
              onChange={(e) => setMemoryMode(e.target.value as MemoryMode)}
              className="w-full appearance-none rounded-xl border border-hairline bg-paper-2 px-4 py-3 pr-10 text-[15px] font-medium text-ink focus:border-warm focus:outline-none"
            >
              {MEMORY_MODES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[12px] text-mute">
              ▾
            </span>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-2">
              {MEMORY_MODES.find((m) => m.value === memoryMode)?.description}
            </p>
          </div>
          <ul className="space-y-3 border-l border-hairline pl-6 text-[12.5px] text-ink-2">
            {MEMORY_MODES.map((m) => (
              <li key={m.value} className={memoryMode === m.value ? 'text-ink' : ''}>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-mute">
                  {m.value}
                </span>{' '}
                — {m.description}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-16 border-t border-hairline" />

      {/* 3 — Retention */}
      <section className="mt-14">
        <p className="label-mono">03 · Retention</p>
        <h2 className="mt-3 text-[clamp(22px,2.4vw,30px)] font-semibold leading-tight tracking-tight text-ink">
          <em className="not-italic font-semibold text-warm">When</em> we forget.
        </h2>
        <p className="lead mt-3 max-w-[60ch]">
          Per-bucket retention windows in days. The retention job runs daily at 03:00 ICT
          and hard-deletes anything past the window — not soft-flagged, gone.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <RetentionInput
            label="Memory"
            description="Customer facts and summaries"
            value={memoryDays}
            onChange={setMemoryDays}
          />
          <RetentionInput
            label="Inbox"
            description="Conversation messages"
            value={inboxDays}
            onChange={setInboxDays}
          />
          <RetentionInput
            label="Audit log"
            description="AI + human action records"
            value={auditDays}
            onChange={setAuditDays}
          />
        </div>
        <p className="mt-4 font-mono text-[11px] text-mute">
          Records older than this are deleted by the daily retention job at 03:00 ICT.
        </p>
      </section>

      <div className="mt-16 border-t border-hairline" />

      {/* 4 — Audit log */}
      <section className="mt-14">
        <p className="label-mono">04 · Audit log</p>
        <h2 className="mt-3 text-[clamp(22px,2.4vw,30px)] font-semibold leading-tight tracking-tight text-ink">
          Every <em className="not-italic font-semibold text-warm">action</em>, on the record.
        </h2>
        <p className="lead mt-3 max-w-[60ch]">
          AI replies, memory writes, lesson approvals, retention sweeps — all stamped with
          actor, resource, and reason. Last 200 entries below; export for legal review.
        </p>
        <div className="mt-6">
          <AuditTable entries={entries} />
        </div>
      </section>

      <div className="mt-16 border-t border-hairline" />

      {/* 5 — DPA */}
      <section className="mt-14 mb-20">
        <p className="label-mono">05 · DPA</p>
        <h2 className="mt-3 text-[clamp(22px,2.4vw,30px)] font-semibold leading-tight tracking-tight text-ink">
          The <em className="not-italic font-semibold text-warm">paperwork</em> your legal team will ask for.
        </h2>
        <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
          <div className="space-y-3 text-[14.5px] leading-[1.7] text-ink-2">
            <p>
              The Data Processing Agreement names FlowAIOS as the processor and your org as
              the controller, then names every sub-processor we touch on your behalf
              (Supabase, Google Cloud, LINE Platform, Anthropic, Google AI). It locks in
              the residency and retention values you set above, defines the breach
              notification window (72h), and grants you audit rights on request.
            </p>
            <p>
              Generate a draft below; share it with your DPO before signature. Production
              builds emit a signed PDF; this prototype emits a plain-text outline so the
              workflow is walkable end to end.
            </p>
          </div>
          <button
            type="button"
            onClick={onDpaDownload}
            className="self-start rounded-lg border border-warm bg-warm px-5 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-paper hover:bg-warm-2"
          >
            Generate DPA template (PDF)
          </button>
        </div>
      </section>

      {/* Toaster */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto rounded-lg border border-hairline-2 bg-paper-2 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink shadow-soft"
          >
            {t.message}
          </div>
        ))}
      </div>
    </>
  );
}

function RetentionInput({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="flex flex-col rounded-xl border border-hairline bg-paper-2 p-4">
      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-mute">
        {label}
      </span>
      <span className="mt-1 text-[12px] text-ink-2">{description}</span>
      <div className="mt-3 flex items-baseline gap-2">
        <input
          type="number"
          min={1}
          max={3650}
          value={value}
          onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))}
          className="w-24 rounded-md border border-hairline bg-paper px-2 py-1.5 font-mono text-[15px] tabular-nums text-ink focus:border-warm focus:outline-none"
        />
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
          days
        </span>
      </div>
    </label>
  );
}
