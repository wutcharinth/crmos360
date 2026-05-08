import { knowledgeBaseItems, lessonItems } from '@/lib/marketing/data';

export function SelfImproving() {
  return (
    <section className="border-t border-hairline bg-paper-2 py-28">
      <div className="mx-auto w-[min(1240px,calc(100%-48px))]">
        <div className="mb-14 grid items-end gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <span className="label-mono mb-4 inline-block text-warm">Self-improving AI</span>
            <h2 className="display-md text-ink">
              AI ที่เรียนรู้จากธุรกิจของคุณ
              <br />
              ไม่ใช่ AI ทั่วไปที่ตอบเหมือนกันทุกแบรนด์
            </h2>
          </div>
          <p className="lead">
            CRMOS360 ใช้ Knowledge Base เป็น source of truth และ Lesson System
            เป็น playbook ที่พัฒนาจากการทำงานจริง ทุก lesson ต้องผ่านการอนุมัติของ
            manager เพื่อให้ automation ฉลาดขึ้นโดยไม่เสียการควบคุม
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          <article className="rounded-2xl border border-hairline bg-paper p-7 shadow-soft">
            <h3 className="text-[22px] font-semibold tracking-tight text-ink">Knowledge Base</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
              แหล่งความรู้หลักของธุรกิจที่ AI ใช้อ้างอิงก่อนตอบลูกค้า
            </p>
            <div className="mt-5 flex flex-col divide-y divide-hairline">
              {knowledgeBaseItems.map((it) => (
                <span key={it} className="py-3 text-[13.5px] leading-relaxed text-ink-2">
                  {it}
                </span>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-hairline bg-paper p-7 shadow-soft">
            <h3 className="text-[22px] font-semibold tracking-tight text-ink">Lesson System</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
              บทเรียนจากการใช้งานจริง เช่น คำตอบที่ทีมแก้ไข คำตอบที่ถูกอนุมัติ
              และเคสที่ถูกส่งต่อ
            </p>
            <div className="mt-5 flex flex-col divide-y divide-hairline">
              {lessonItems.map((it) => (
                <span key={it} className="py-3 text-[13.5px] leading-relaxed text-ink-2">
                  {it}
                </span>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
