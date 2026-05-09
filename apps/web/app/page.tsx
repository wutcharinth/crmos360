import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { Nav } from '@/components/marketing/Nav';
import { Hero } from '@/components/marketing/Hero';
import { ChannelStrip } from '@/components/marketing/ChannelStrip';
import { AiOsPrinciples } from '@/components/marketing/AiOsPrinciples';
import { AgentTabs } from '@/components/marketing/AgentTabs';
import { AutopilotModes } from '@/components/marketing/AutopilotModes';
import { Backoffice } from '@/components/marketing/Backoffice';
import { SelfImproving } from '@/components/marketing/SelfImproving';
import { Features } from '@/components/marketing/Features';
import { Outcomes } from '@/components/marketing/Outcomes';
import { Cta } from '@/components/marketing/Cta';
import { Footer } from '@/components/marketing/Footer';
import { VerticalChooser } from '@/components/marketing/VerticalChooser';
import { Concierge } from '@/components/marketing/Concierge';
import { PilotCallout } from '@/components/marketing/PilotCallout';
import { TrustBand } from '@/components/marketing/TrustBand';
import { DogfoodPitch } from '@/components/marketing/DogfoodPitch';
import { VERTICAL_COOKIE, readVerticalCookie } from '@/lib/marketing/vertical';
import { LANG_COOKIE, readLangCookie } from '@/lib/marketing/lang';

export default async function HomePage() {
  // Local dev without Supabase env: skip the auth check and render the marketing page.
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    // Signed-in users skip the marketing page and land directly in the inbox.
    if (user) redirect('/inbox');
  }

  const cookieStore = await cookies();
  const vertical = readVerticalCookie(cookieStore.get(VERTICAL_COOKIE)?.value);
  // Lang is also set on <html lang> at the root layout, but we read here
  // to short-circuit the chooser overlay logic if a value already exists.
  void readLangCookie(cookieStore.get(LANG_COOKIE)?.value);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <PilotCallout />
        <ChannelStrip />
        <AiOsPrinciples />
        <AgentTabs />
        <AutopilotModes />
        <Backoffice />
        <SelfImproving />
        <Features />
        <TrustBand />
        <Outcomes />
        <DogfoodPitch />
        <Cta />
      </main>
      <Footer />
      <VerticalChooser initialVertical={vertical} />
      <Concierge />
    </>
  );
}
