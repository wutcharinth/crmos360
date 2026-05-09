import { DensityToggle } from '@/components/settings/DensityToggle';
import { LangToggleAdmin } from '@/components/settings/LangToggleAdmin';
import { LivePreview } from '@/components/settings/LivePreview';
import { SettingSection } from '@/components/settings/SettingSection';
import { SkinSwitcher } from '@/components/skin-switcher';

export const dynamic = 'force-dynamic';

export default function AppearanceSettingsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <header>
        <p className="label-mono">Settings · Appearance</p>
        <h1 className="mt-3 text-[clamp(28px,3.4vw,42px)] font-semibold leading-[1.08] tracking-tight text-ink">
          How FlowAIOS{' '}
          <em className="not-italic font-semibold text-warm">looks</em> on your
          screen.
        </h1>
        <p className="lead mt-4">
          Three independent knobs — skin, density, language. Each saves the
          moment you change it; preview at the bottom shows the combined
          result in real time.
        </p>
      </header>

      <div className="mt-12">
        <SettingSection
          kicker="01"
          title="Skin"
          description="Daylight is the marketing-friendly light editorial. Cockpit is the dark ops-grade dashboard. System matches your OS."
          rule={false}
        >
          <SkinSwitcher />
          <p className="mt-4 max-w-prose text-[13px] leading-relaxed text-ink-2">
            <strong className="font-medium text-ink">Daylight</strong> · light
            editorial. Best for marketing, sharing screenshots with
            stakeholders.
            <br />
            <strong className="font-medium text-ink">Cockpit</strong> · dark
            ops-grade. Best for daily inbox triage.
            <br />
            <strong className="font-medium text-ink">System</strong> · matches
            the OS dark/light setting.
          </p>
        </SettingSection>

        <SettingSection
          kicker="02"
          title="Density"
          description="Compact reduces inbox + dashboard spacing by ~30%. Useful on smaller laptops or when you want more rows on screen."
        >
          <DensityToggle />
        </SettingSection>

        <SettingSection
          kicker="03"
          title="Language"
          description="Sets the admin UI language. Match browser reads navigator.language and resolves to th or en automatically."
        >
          <LangToggleAdmin />
        </SettingSection>
      </div>

      <div className="mt-14 border-t border-hairline pt-10">
        <LivePreview />
      </div>
    </main>
  );
}
