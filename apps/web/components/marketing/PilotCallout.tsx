/**
 * Editorial side-note callout, lifted from JongToh's "marginalia" pilot
 * pattern in src/pages/landing.ts:434-440. Anchors urgency without
 * shouting, sits as a quiet aside between hero and the next section.
 */
export function PilotCallout() {
  return (
    <section aria-label="Design partner program" className="border-y border-hairline bg-paper-2/60 py-9">
      <div className="mx-auto grid w-[min(1080px,calc(100%-48px))] gap-x-12 gap-y-4 md:grid-cols-[180px_1fr_auto] md:items-baseline">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm">
            Design partner program
          </p>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-mute">
            <span className="th-only">5 ทีมแรกเท่านั้น · 2026 H2</span>
            <span className="en-only">First 5 teams only · H2 2026</span>
          </p>
        </div>
        <p className="text-[14px] italic leading-relaxed text-ink-2">
          <span className="th-only">
            ทีมแรก ๆ ที่ใช้ FlowAIOS จะใช้ <strong className="not-italic font-semibold text-ink">ฟรี 12 เดือน</strong>
            แลกกับ feedback ตรงไปตรงมา และการเล่าประสบการณ์ให้ทีม customer-ops คนอื่น ๆ ฟังเป็นระยะ
            ๆ. ไม่ต้องเซ็น MSA ก่อน, ไม่ต้องส่งโฆษณาให้, แค่ใช้จริงและบอกเรา
            ว่าอะไรเวิร์คอะไรไม่.
          </span>
          <span className="en-only">
            Early teams use FlowAIOS{' '}
            <strong className="not-italic font-semibold text-ink">free for 12 months</strong> in
            exchange for blunt feedback and the occasional word-of-mouth introduction to
            other customer-ops teams. No MSA, no logo placement required: use it for real
            and tell us what works and what doesn&rsquo;t.
          </span>
        </p>
        <a
          href="mailto:hello@flowaios.app?subject=Design%20partner%20interest"
          className="inline-flex items-center gap-1.5 self-start rounded-md border border-hairline bg-paper px-3.5 py-2 text-[12.5px] font-medium text-ink transition-colors hover:border-warm/40 hover:text-warm md:self-end"
        >
          <span className="th-only">เข้าโครงการ</span>
          <span className="en-only">Apply</span>
          <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
