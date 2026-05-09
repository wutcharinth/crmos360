import Link from 'next/link';
import { Nav } from '@/components/marketing/Nav';
import { Footer } from '@/components/marketing/Footer';
import { PricingTiers } from '@/components/marketing/PricingTiers';

export const metadata = {
  title: 'FlowAIOS Pricing · 4 tiers from ฿990 to enterprise',
  description:
    'Self-serve Starter and Growth, Pro pilot, Enterprise with PDPA + DPA. Pricing derived from 8-persona Thai market study.',
};

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="relative pb-12 pt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-32 h-[500px] bg-[radial-gradient(ellipse_1200px_500px_at_50%_-200px,hsl(var(--warm)/0.05),transparent_65%)]"
          />
          <div className="relative mx-auto w-[min(1080px,calc(100%-48px))] text-center">
            <span className="label-mono mb-7 inline-flex items-center gap-2.5 rounded-full border border-hairline bg-paper px-3 py-1.5 normal-case tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-warm" />
              Pricing
            </span>
            <h1 className="display-lg mx-auto max-w-3xl text-ink">
              ราคาที่ <em className="not-italic font-semibold text-warm whitespace-nowrap">match scale ของคุณ</em>
              <br />
              ไม่ใช่ตาม seat count
            </h1>
            <p className="lead mx-auto mt-5 max-w-xl">
              4 tiers เริ่มต้น ฿990/เดือน — มาจากการสัมภาษณ์ผู้ซื้อจริง 8 segment ในตลาดไทย.
              Self-serve trial 14 วัน on Starter & Growth. Pro & Enterprise ผ่าน pilot.
            </p>
          </div>
        </section>

        <PricingTiers />

        {/* FAQ */}
        <section className="border-t border-hairline bg-paper-2 py-16">
          <div className="mx-auto w-[min(1080px,calc(100%-48px))]">
            <p className="label-mono">Frequently asked</p>
            <h2 className="display-md mt-3 text-ink">คำถามที่ผู้ซื้อชอบถาม</h2>
            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {FAQS.map((q) => (
                <div key={q.q} className="rounded-xl border border-hairline bg-paper p-5">
                  <p className="text-[14px] font-semibold text-ink">{q.q}</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{q.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Agency callout */}
        <section className="py-16">
          <div className="mx-auto flex w-[min(1080px,calc(100%-48px))] flex-col gap-5 rounded-2xl border border-hairline bg-paper p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="label-mono">Agencies + multi-tenant</p>
              <h3 className="mt-2 text-[18px] font-semibold text-ink">
                Run FlowAIOS for multiple clients?
              </h3>
              <p className="mt-2 text-[13.5px] text-ink-2">
                True multi-tenant cockpit, reusable persona library, white-label client reports,
                reseller margin. ฿80,000–150,000/mo unlimited or ฿5,000–7,000 per managed client.
                In planning for year 2 — talk to us if you&rsquo;re an agency today.
              </p>
            </div>
            <Link
              href="/contact?agency=1"
              className="rounded-lg border border-hairline bg-paper-2 px-5 py-3 text-[13px] font-medium text-ink hover:bg-paper-3"
            >
              Talk to us →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

const FAQS = [
  {
    q: 'Annual = how much off?',
    a: '10× monthly per tier (you save 2 months). Toggle on the pricing table to see annual prices for any tier.',
  },
  {
    q: 'Trial — บัตรเครดิตจำเป็นไหม?',
    a: 'Starter and Growth: 14-day trial, no card required. Pro: 30-day pilot with assigned CS contact + success metric. Enterprise: 90-day pilot with signed pilot agreement.',
  },
  {
    q: 'PDPA / data residency?',
    a: 'All tiers ship with audit log + retention controls. Pro adds branch-level access controls. Enterprise adds signed DPA, Thailand or Singapore data residency, vendor liability indemnification, and SOC2 documentation.',
  },
  {
    q: 'Per-seat or per-org?',
    a: 'Per-org. Tiers gate on volume + features, not headcount. Add agents to your team without adding cost. (Per-seat pricing kills CS economics; we don\'t do it.)',
  },
  {
    q: 'Migration จาก Manychat / Zaapi?',
    a: 'Yes — we import LINE OA history, Manychat flows, and customer tags. Migration assist is free at Pro tier and above; Growth tier is self-serve with docs + Thai live support during business hours.',
  },
  {
    q: 'PromptPay billing?',
    a: 'Yes for Starter and Growth tiers (no credit card recurring). Pro and Enterprise via invoice / corporate card.',
  },
];
