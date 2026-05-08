import { outcomes } from '@/lib/marketing/data';

export function Outcomes() {
  return (
    <section className="border-t border-hairline bg-paper-2 py-28">
      <div className="mx-auto w-[min(1240px,calc(100%-48px))]">
        <div className="rounded-3xl border border-hairline bg-paper px-9 py-14 shadow-soft md:px-14">
          <div className="mb-10 max-w-3xl">
            <span className="label-mono mb-4 inline-block text-warm">Business Outcomes</span>
            <h2 className="display-md text-ink">
              ให้ทุกแชทกลายเป็นข้อมูล ทุกข้อมูลกลายเป็น action
              <br />
              และทุก action ทำให้ระบบฉลาดขึ้น
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-2 lg:grid-cols-4">
            {outcomes.map((o) => (
              <article key={o.title} className="bg-paper px-7 py-7">
                <strong className="block text-[26px] font-semibold tracking-tight text-warm">
                  {o.title}
                </strong>
                <span className="mt-2.5 block text-[13.5px] leading-relaxed text-ink-2">
                  {o.body}
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
