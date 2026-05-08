import { recommendations, backofficeCards } from '@/lib/marketing/data';

const badgeClass: Record<'auto' | 'review' | 'neutral', string> = {
  auto: 'border-mint/30 bg-mint-soft text-mint',
  review: 'border-warm/30 bg-warm-soft text-warm',
  neutral: 'border-hairline bg-paper-2 text-mute',
};

export function Backoffice() {
  return (
    <section id="backoffice" className="border-t border-hairline py-28">
      <div className="mx-auto w-[min(1240px,calc(100%-48px))]">
        <div className="mb-14 grid items-end gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <span className="label-mono mb-4 inline-block text-warm">AI-managed Backoffice</span>
            <h2 className="display-md text-ink">
              หลังบ้านที่ AI ช่วยตั้งค่า แนะนำ
              <br />
              และดูแลให้ดีขึ้นเรื่อย ๆ
            </h2>
          </div>
          <p className="lead">
            จุดต่างของ FlowAIOS คือ AI ไม่ได้ช่วยแค่หน้าบ้านในการตอบลูกค้า
            แต่ช่วยจัดการหลังบ้าน ตั้งแต่ setup, knowledge base, workflow,
            auto-reply rules, escalation rules และ configuration recommendations
          </p>
        </div>

        <div className="grid gap-7 lg:grid-cols-[1.3fr_1fr]">
          {/* Configuration Advisor demo */}
          <div className="overflow-hidden rounded-2xl border border-hairline bg-paper shadow-soft">
            <div className="flex items-baseline justify-between border-b border-hairline bg-paper-2 px-6 py-4">
              <div>
                <strong className="block text-[15px] font-semibold text-ink">
                  AI Configuration Advisor
                </strong>
                <span className="text-[12.5px] text-mute">
                  คำแนะนำจากพฤติกรรมการใช้งานจริง
                </span>
              </div>
              <span className="rounded-full border border-mint/30 bg-mint-soft px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-mint">
                4 recommendations
              </span>
            </div>
            <div className="flex flex-col">
              {recommendations.map((r, i) => (
                <article
                  key={r.title}
                  className={`px-6 py-5 ${
                    i < recommendations.length - 1 ? 'border-b border-hairline' : ''
                  }`}
                >
                  <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                    <strong className="text-[14.5px] font-semibold text-ink">{r.title}</strong>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${badgeClass[r.badge]}`}
                    >
                      {r.badgeLabel}
                    </span>
                  </div>
                  <p className="text-[13px] leading-snug text-ink-2">{r.body}</p>
                  <div className="mt-3 flex gap-2">
                    {r.actions.map((a, ai) => (
                      <button
                        key={a}
                        type="button"
                        className={`rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                          ai === 0
                            ? 'border-warm/40 bg-warm text-paper hover:bg-warm-2'
                            : 'border-hairline bg-paper text-ink-2 hover:border-hairline-2 hover:text-ink'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Backoffice cards */}
          <div className="flex flex-col gap-5">
            {backofficeCards.map((c) => (
              <article
                key={c.title}
                className="rounded-2xl border border-hairline bg-paper p-6 transition-shadow hover:shadow-soft"
              >
                <h3 className="text-[18px] font-semibold tracking-tight text-ink">{c.title}</h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-ink-2">{c.body}</p>
                {c.bullets.length > 0 && (
                  <ul className="mt-3.5 space-y-1.5">
                    {c.bullets.map((b) => (
                      <li
                        key={b}
                        className="relative pl-3.5 text-[13px] text-ink-2 before:absolute before:left-0 before:top-2.5 before:h-px before:w-2 before:bg-warm"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
