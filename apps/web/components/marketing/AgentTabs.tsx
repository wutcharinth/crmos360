'use client';

import { useState } from 'react';
import { agents, type AgentKey } from '@/lib/marketing/data';

export function AgentTabs() {
  const [active, setActive] = useState<AgentKey>('service');
  const current = agents.find((a) => a.key === active)!;

  return (
    <section id="agents" className="border-t border-hairline py-28">
      <div className="mx-auto w-[min(1240px,calc(100%-48px))]">
        <div className="mb-14 grid items-end gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <span className="label-mono mb-4 inline-block text-warm">AI Agent Team</span>
            <h2 className="display-md text-ink">
              ขับเคลื่อนด้วย <span className="text-warm">3 AI Agents</span>
              <br />
              ที่เข้าใจหน้าบ้านและหลังบ้าน
            </h2>
          </div>
          <p className="lead">
            ไม่ต้องสร้าง agent เยอะจนซับซ้อน CRMOS360 วาง agent เป็น 3 บทบาทหลักที่ธุรกิจเข้าใจง่าย:
            ดูแลลูกค้า ทำงานหลังบ้าน และช่วยสร้างรายได้จากบทสนทนา
          </p>
        </div>

        {/* Panel */}
        <div className="overflow-hidden rounded-2xl border border-hairline bg-paper shadow-soft">
          {/* Tabs */}
          <div
            role="tablist"
            aria-label="AI agents"
            className="grid border-b border-hairline bg-paper-2 sm:grid-cols-3"
          >
            {agents.map((a) => {
              const selected = a.key === active;
              return (
                <button
                  key={a.key}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActive(a.key)}
                  className={`relative cursor-pointer border-r border-hairline px-6 py-5 text-left transition-colors last:border-r-0 sm:px-7 sm:py-6 ${
                    selected
                      ? 'bg-paper text-ink'
                      : 'text-ink-2 hover:bg-warm-soft hover:text-ink'
                  }`}
                >
                  <span
                    className={`block font-mono text-[10.5px] uppercase tracking-[0.16em] ${
                      selected ? 'text-warm' : 'text-mute'
                    }`}
                  >
                    {a.num}
                  </span>
                  <strong className="mt-2 block text-[16px] font-semibold tracking-tight text-ink">
                    {a.title}
                  </strong>
                  <span className="mt-1 block text-[13px] leading-snug text-ink-2">
                    {a.shortLabel}
                  </span>
                  {selected && (
                    <span className="absolute inset-x-6 -bottom-px h-0.5 rounded bg-warm sm:inset-x-7" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Body */}
          <div className="px-9 py-9 md:px-10 md:py-10">
            <div className="mb-7 flex items-baseline justify-between border-b border-hairline pb-5">
              <div>
                <strong className="text-[20px] font-semibold tracking-tight">
                  {current.title}
                </strong>
                <p className="mt-1 text-[13px] text-mute">{current.subtitle}</p>
              </div>
              <span className="rounded-full border border-warm/30 bg-warm-soft px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-warm">
                {current.state}
              </span>
            </div>

            <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
              <div>
                <h3 className="display-md !text-[24px] !font-semibold tracking-tight">
                  {current.heading}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
                  {current.description}
                </p>
                <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  {current.capabilities.map(([name, body]) => (
                    <div
                      key={name}
                      className="rounded-xl border border-hairline bg-paper-2 px-4 py-4 transition-colors hover:border-hairline-2"
                    >
                      <strong className="block text-[13px] font-semibold text-ink">
                        {name}
                      </strong>
                      <span className="block text-[12.5px] leading-snug text-ink-2">
                        {body}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="flex flex-col gap-3.5">
                {current.mini.map(([name, body]) => (
                  <div
                    key={name}
                    className="rounded-xl border-l-2 border-l-warm bg-paper-2 px-4 py-3.5"
                  >
                    <strong className="block font-mono text-[10.5px] uppercase tracking-[0.16em] text-warm">
                      {name}
                    </strong>
                    <span className="mt-1.5 block text-[13px] leading-relaxed text-ink-2">
                      {body}
                    </span>
                  </div>
                ))}
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
