export const dynamic = 'force-dynamic';

export default function AuditPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-9 px-8 py-10">
      <header>
        <p className="label-mono">Admin · audit</p>
        <h1 className="mt-3 text-[clamp(28px,3.4vw,42px)] font-semibold tracking-tight text-ink">
          Audit log
        </h1>
        <p className="lead mt-3 max-w-[58ch]">
          Every AI action and human decision in one append-only stream. Production audit
          surface lives in <code className="font-mono text-[12px] text-warm">audit_logs</code>
          (Supabase) and ships behind the M1.5 · Chunk 18 PDPA control plane.
        </p>
      </header>

      <div className="rounded-lg border border-dashed border-hairline bg-paper-2/40 px-5 py-14 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
          Pending wiring
        </p>
        <p className="mt-2 text-[13px] text-ink-2">
          Concierge actions already log via the in-memory ledger and surface on the
          /admin/cost page. The full multi-actor audit (auto-reply, memory extraction,
          lesson approval, rule application) joins here once the per-action audit hook lands.
        </p>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
          Ships in M1.5 · Chunk 18
        </p>
      </div>
    </div>
  );
}
