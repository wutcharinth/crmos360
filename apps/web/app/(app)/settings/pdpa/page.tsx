import { listAuditLog } from '@/lib/api';
import { PdpaClient } from '@/components/settings/pdpa/PdpaClient';

export const dynamic = 'force-dynamic';

export default async function PdpaSettingsPage() {
  const entries = await listAuditLog(200);

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      {/* Lede */}
      <header className="grid gap-x-12 gap-y-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="label-mono">Settings · PDPA</p>
          <h1 className="mt-4 text-[clamp(32px,4vw,52px)] font-semibold leading-[1.05] tracking-tight text-ink">
            <em className="not-italic font-semibold text-warm">Compliance</em> as a control
            plane, not a checkbox.
          </h1>
          <p className="lead mt-5 max-w-[62ch]">
            Five settings that decide where customer data lives, how it gets written, when
            it disappears, who touched it, and what your legal team has on file. Each one
            saves on change.
          </p>
        </div>
        <aside className="self-end md:pb-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            Build stage
          </p>
          <p className="mt-2 font-mono text-[12px] text-warm">M1.5 · Chunk 12</p>
          <p className="mt-1 text-[12px] text-mute">Mock mode</p>
        </aside>
      </header>

      <PdpaClient entries={entries} />
    </main>
  );
}
