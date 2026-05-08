import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
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

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Signed-in users skip the marketing page and land directly in the inbox.
  if (user) redirect('/inbox');

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ChannelStrip />
        <AiOsPrinciples />
        <AgentTabs />
        <AutopilotModes />
        <Backoffice />
        <SelfImproving />
        <Features />
        <Outcomes />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
