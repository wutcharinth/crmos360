import { features } from '@/lib/marketing/data';

export function Features() {
  return (
    <section id="features" className="border-t border-hairline py-28">
      <div className="mx-auto w-[min(1240px,calc(100%-48px))]">
        <div className="mb-14 grid items-end gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <span className="label-mono mb-4 inline-block text-warm">Product Capabilities</span>
            <h2 className="display-md text-ink">
              ฟีเจอร์หลักที่ทำให้ CRMOS360
              <br />
              เป็นมากกว่าระบบแชท
            </h2>
          </div>
          <p className="lead">
            ครอบคลุมทั้งงานตอบลูกค้า งานหลังบ้าน งานขาย และการปรับปรุงระบบ
            automation เพื่อให้ทีม customer operations ทำงานได้เร็วขึ้นและสม่ำเสมอขึ้น
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.n} className="bg-paper px-7 py-9">
              <div className="font-mono text-[13px] tracking-widest text-warm">{f.n}</div>
              <h3 className="mt-5 text-[20px] font-semibold tracking-tight text-ink">
                {f.title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ink-2">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
