import Link from 'next/link';
import { Nav } from '@/components/marketing/Nav';
import { Footer } from '@/components/marketing/Footer';
import { ScenePlayer } from '@/components/demo/ScenePlayer';
import { ScenarioPlayground } from '@/components/demo/ScenarioPlayground';
import { DEMO_BRAND, TOTAL_DURATION } from '@/lib/demo/scenes';

const walkthroughSeconds = Math.round(TOTAL_DURATION / 1000);
const walkthroughLabel = `${Math.floor(walkthroughSeconds / 60)}:${String(walkthroughSeconds % 60).padStart(2, '0')}`;

export const metadata = {
  title: `Try FlowAIOS · ${walkthroughLabel} walkthrough + interactive demo`,
  description:
    'Watch a scripted walkthrough of FlowAIOS handling 5 real customer-ops scenarios, then chat with the AI yourself. No signup required.',
};

export default function DemoPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Header */}
        <section className="relative pb-12 pt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-32 h-[520px] bg-[radial-gradient(ellipse_1100px_520px_at_50%_-200px,hsl(var(--warm)/0.06),transparent_65%)]"
          />
          <div className="relative mx-auto w-[min(1240px,calc(100%-48px))]">
            <p className="label-mono">Demo · canned tenant</p>
            <h1 className="display-md mt-4 max-w-[24ch]">
              ลอง FlowAIOS กับ <em className="not-italic font-semibold text-warm">{DEMO_BRAND.name}</em>
            </h1>
            <p className="lead mt-5 max-w-[58ch]">
              {DEMO_BRAND.tagline}. {DEMO_BRAND.team}. Watch the {walkthroughLabel} walkthrough,
              then chat with the AI yourself. Every transcript below uses scripted facts of a
              made-up brand, no live customer data.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="#walkthrough"
                className="rounded-lg bg-warm px-5 py-3 text-[14px] font-medium text-paper transition-all hover:-translate-y-px hover:bg-warm-2 hover:shadow-cta"
              >
                Watch walkthrough →
              </Link>
              <Link
                href="#playground"
                className="text-[14px] text-ink underline-offset-4 hover:text-warm hover:underline"
              >
                Skip to playground
              </Link>
              <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                {walkthroughLabel} scripted · 9 industries interactive · no signup
              </span>
            </div>
          </div>
        </section>

        {/* Walkthrough */}
        <section id="walkthrough" className="border-t border-hairline bg-paper-2 py-16">
          <div className="mx-auto w-[min(1240px,calc(100%-48px))]">
            <div className="flex items-baseline justify-between gap-4 pb-9">
              <p className="label-mono">Walkthrough · auto-playing</p>
              <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                Click any scene to jump
              </span>
            </div>
            <ScenePlayer />
          </div>
        </section>

        {/* Playground */}
        <section id="playground" className="border-t border-hairline py-16">
          <div className="mx-auto w-[min(1240px,calc(100%-48px))]">
            <p className="label-mono">Playground · 9 live verticals</p>
            <h2 className="display-md mt-3 max-w-[24ch]">
              Pick a category. Ask the{' '}
              <em className="not-italic accent-word whitespace-nowrap">brand&rsquo;s AI</em> anything.
            </h2>
            <p className="lead mt-4 max-w-[60ch]">
              Nine industries — beauty, fashion, food, electronics, supplements, hotel, education,
              real estate, fitness — each with its own catalog, policies, and the &ldquo;what we
              answer / what we escalate&rdquo; rules that vertical actually needs. The AI
              roleplays as that brand&rsquo;s agent so you can feel how it handles
              industry-specific challenges.
            </p>
            <div className="mt-10">
              <ScenarioPlayground />
            </div>
          </div>
        </section>

        {/* Explore grid */}
        <section className="border-t border-hairline bg-paper-2 py-16">
          <div className="mx-auto w-[min(1240px,calc(100%-48px))]">
            <p className="label-mono">Explore the rest</p>
            <h2 className="display-md mt-3 max-w-[28ch]">
              Where the AI goes after it replies
            </h2>
            <p className="lead mt-4 max-w-[58ch]">
              Confidence-gated reply is the wedge. The Learning layer is the moat. Each of
              these is a real surface in FlowAIOS, not a roadmap promise.
            </p>

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              <ExploreCard
                kicker="Inbox · shipped"
                title="Unified inbox across LINE OA, Shopee, TikTok, Lazada, IG, FB, Email"
                body="One place to triage. Channel chips configurable per vertical, escalation routing per agent."
                href="/for/customer-ops"
              />
              <ExploreCard
                kicker="Intelligence · coming"
                title="Recurring questions become rules"
                body="The Configuration Advisor watches what your team edits and proposes auto-rules with confidence + sample matches. Approve once, applies forever."
                href="/for/customer-ops#features"
              />
              <ExploreCard
                kicker="Customer memory · shipped"
                title="The AI remembers ‘แพ้ paraben’ across all channels"
                body="Auto-extracted from past conversations, embedded into every reply. Returning customers get continuity, not a fresh script."
                href="/for/commerce"
              />
              <ExploreCard
                kicker="PDPA control plane · coming"
                title="Audit log, residency, retention, fact-approval queue"
                body="Built for the buyer who needs to clear an internal risk review. TH or SG residency, signed DPA template, exportable audit."
                href="/for/customer-ops#features"
              />
            </div>
          </div>
        </section>

        {/* Self-serve dogfood pitch (lifted from JongToh) */}
        <section className="border-t border-hairline py-16">
          <div className="mx-auto w-[min(820px,calc(100%-48px))] text-center">
            <p className="label-mono">Self-serve · dogfood</p>
            <p className="mt-5 text-[clamp(20px,2.4vw,30px)] font-light leading-snug tracking-tight text-ink">
              The concierge answering you on this page is the{' '}
              <em className="not-italic font-semibold text-warm">same AI</em> you&rsquo;ll
              ship to your customers on day one.
            </p>
            <p className="mt-5 text-[14px] text-ink-2">
              If it sells you on FlowAIOS, it&rsquo;ll sell your customers on you. If it
              fumbles, that&rsquo;s a feedback loop we&rsquo;d rather know about now.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/signup"
                className="rounded-lg bg-warm px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-warm-2"
              >
                Start a free trial
              </Link>
              <Link
                href="/pricing"
                className="rounded-lg border border-hairline bg-paper-2 px-5 py-3 text-[14px] font-medium text-ink transition-colors hover:bg-paper-3"
              >
                See pricing
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ExploreCard({
  kicker,
  title,
  body,
  href,
}: {
  kicker: string;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-hairline bg-paper p-6 transition-all hover:-translate-y-0.5 hover:border-warm/30 hover:shadow-soft"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm">
        {kicker}
      </p>
      <h3 className="mt-3 text-[17px] font-semibold leading-snug text-ink">{title}</h3>
      <p className="mt-3 text-[13.5px] leading-relaxed text-ink-2">{body}</p>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-mute group-hover:text-warm">
        Read more →
      </p>
    </Link>
  );
}
