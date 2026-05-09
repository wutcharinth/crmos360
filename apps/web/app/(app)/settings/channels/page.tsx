import { ChannelsManager } from '@/components/settings/ChannelsManager';
import { SettingSection } from '@/components/settings/SettingSection';

export const dynamic = 'force-dynamic';

export default function ChannelsSettingsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      {/* Lede */}
      <header>
        <p className="label-mono">Settings · Channels</p>
        <h1 className="mt-3 text-[clamp(28px,3.4vw,42px)] font-semibold leading-[1.08] tracking-tight text-ink">
          Which{' '}
          <em className="not-italic font-semibold text-warm">channels</em> are
          actually yours?
        </h1>
        <p className="lead mt-4">
          Pick a vertical preset to seed a sensible default, then turn
          individual channels on or off. Disabled channels disappear from the
          inbox filter and homepage chips org-wide.
        </p>
      </header>

      <div className="mt-12">
        <SettingSection
          kicker="Channel set"
          title="Active channels"
          description="The vertical preset is shorthand. Anything you toggle after picking one switches you to Custom."
          rule={false}
        >
          <ChannelsManager />
        </SettingSection>
      </div>
    </main>
  );
}
