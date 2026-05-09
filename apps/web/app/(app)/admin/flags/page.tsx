import { listFlagsForOrg, FLAG_M15 } from '@/lib/flags';
import { requireMembership } from '@/lib/auth/current-user';
import { FlagToggleRow } from './flag-toggle-row';

export const dynamic = 'force-dynamic';

export default async function FeatureFlagsPage() {
  const { orgId, orgName, role } = await requireMembership();
  const flags = await listFlagsForOrg(orgId);
  const isAdmin = role === 'owner' || role === 'admin';

  return (
    <div className="mx-auto max-w-3xl px-8 py-12">
      <header>
        <p className="label-mono">Admin · feature flags</p>
        <h1 className="mt-3 text-[clamp(28px,3.4vw,42px)] font-semibold tracking-tight text-ink">
          Stage rollouts per org
        </h1>
        <p className="lead mt-3 max-w-[58ch]">
          Per-org boolean flags that override the global env default. Hidden surfaces
          return 404 (not 403) when off, matching the rest of the admin posture.
        </p>
        <p className="mt-3 font-mono text-[11px] text-mute">{orgName}</p>
      </header>

      <section className="mt-12 space-y-1 divide-y divide-hairline border-y border-hairline">
        <FlagToggleRow
          flagKey={FLAG_M15}
          name="M1.5 prototype"
          description="Knowledge / Intelligence / Configuration Advisor / Settings tree (PDPA, Channels, Appearance). When off, these routes 404."
          enabled={flags[FLAG_M15]}
          canEdit={isAdmin}
        />
      </section>

      <section className="mt-9 rounded-lg border border-dashed border-hairline bg-paper-2/40 px-5 py-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
          Resolution order
        </p>
        <ol className="mt-3 space-y-1.5 text-[13px] leading-relaxed text-ink-2">
          <li className="flex gap-2.5">
            <span className="font-mono text-warm">01</span>
            <span>Per-org row in <code className="font-mono text-[11.5px] text-ink">org_feature_flags</code> wins.</span>
          </li>
          <li className="flex gap-2.5">
            <span className="font-mono text-warm">02</span>
            <span>Otherwise, env default <code className="font-mono text-[11.5px] text-ink">M15_ENABLED_DEFAULT</code>.</span>
          </li>
          <li className="flex gap-2.5">
            <span className="font-mono text-warm">03</span>
            <span>Local dev with no Supabase env always returns enabled.</span>
          </li>
        </ol>
      </section>
    </div>
  );
}
