import { autopilotModes } from '@/lib/marketing/data';

export function AutopilotModes() {
  return (
    <section id="autopilot" className="border-t border-hairline bg-paper-2 py-28">
      <div className="mx-auto w-[min(1240px,calc(100%-48px))]">
        <div className="mb-14 grid items-end gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <span className="label-mono mb-4 inline-block text-warm">Controlled Autopilot</span>
            <h2 className="display-md text-ink">
              Auto Reply ได้ แต่ควบคุมได้ตามความเสี่ยง
              <br />
              ของแต่ละเคส
            </h2>
          </div>
          <p className="lead">
            FlowAIOS ไม่ได้ปล่อยให้ AI ตอบทุกอย่างแบบเสี่ยง ๆ
            แต่ให้ธุรกิจกำหนดระดับ automation ได้ ตั้งแต่ตอบอัตโนมัติ
            ร่างคำตอบรออนุมัติ ไปจนถึงส่งต่อให้คนดูแลทันที
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {autopilotModes.map((m) => (
            <article
              key={m.title}
              className={`rounded-2xl border bg-paper p-7 transition-shadow hover:shadow-soft ${
                m.highlight
                  ? 'border-warm/40 shadow-soft ring-1 ring-warm/10'
                  : 'border-hairline'
              }`}
            >
              <h3 className="flex flex-wrap items-center gap-2.5 text-[20px] font-semibold tracking-tight text-ink">
                {m.title}
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                    m.highlight
                      ? 'border-warm/40 bg-warm-soft text-warm'
                      : 'border-hairline bg-paper-2 text-mute'
                  }`}
                >
                  {m.label}
                </span>
              </h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">{m.body}</p>
              <ul className="mt-5 space-y-1.5">
                {m.bullets.map((b) => (
                  <li
                    key={b}
                    className="relative pl-4 text-[13.5px] text-ink-2 before:absolute before:left-0 before:top-2.5 before:h-px before:w-2 before:bg-warm"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
