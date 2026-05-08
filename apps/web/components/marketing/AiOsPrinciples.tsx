import { principles } from '@/lib/marketing/data';

export function AiOsPrinciples() {
  return (
    <section id="ai-os" className="py-28">
      <div className="mx-auto w-[min(1240px,calc(100%-48px))]">
        <div className="mb-14 grid items-end gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <span className="label-mono mb-4 inline-block text-warm">The Core Positioning</span>
            <h2 className="display-md text-ink">
              ไม่ใช่แค่ Unified Inbox แต่คือ AI Operating System
              <br />
              สำหรับ Customer Operations
            </h2>
          </div>
          <p className="lead">
            CRMOS360 เชื่อมบทสนทนา ข้อมูลลูกค้า ออเดอร์ marketplace workflow ทีมงาน
            knowledge base และ AI automation เข้าด้วยกัน
            เพื่อเปลี่ยนทุกข้อความให้กลายเป็น action และ intelligence สำหรับธุรกิจ
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-2 lg:grid-cols-4">
          {principles.map((p) => (
            <article key={p.n} className="bg-paper px-7 py-9">
              <div className="font-mono text-[13px] tracking-widest text-mute">{p.n}</div>
              <h3 className="mt-5 text-[22px] font-semibold tracking-tightish text-ink">
                {p.title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ink-2">{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
