import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Agent {
  id: string;
  name: string;
  purpose: string;
  status: 'active' | 'planned' | 'paused';
  lastRunAt: string | null;
  runs: number;
  shipsIn: string;
}

const AGENTS: Agent[] = [
  {
    id: 'concierge',
    name: 'Marketing Concierge',
    purpose: 'Live chatbot on flowaios.app, answers product questions, qualifies prospects, hands off when out of scope.',
    status: 'active',
    lastRunAt: 'recently',
    runs: 0,
    shipsIn: 'shipped',
  },
  {
    id: 'auto-reply',
    name: 'Customer-service Auto Reply',
    purpose: 'Confidence-gated reply on inbound LINE OA / IG / Messenger. Auto >90%, draft 70-90%, escalate <70%.',
    status: 'active',
    lastRunAt: null,
    runs: 0,
    shipsIn: 'M1.3 (shipped)',
  },
  {
    id: 'memory-extractor',
    name: 'Customer Memory Extractor',
    purpose: 'Pulls durable facts from each conversation (preferences, past issues, tier) and embeds for retrieval.',
    status: 'active',
    lastRunAt: null,
    runs: 0,
    shipsIn: 'M1.4 (shipped)',
  },
  {
    id: 'lesson-extractor',
    name: 'Lesson Extractor',
    purpose: 'Watches team edits to AI drafts and proposes generalizable lessons for human approval.',
    status: 'planned',
    lastRunAt: null,
    runs: 0,
    shipsIn: 'M1.5 · Chunk 15',
  },
  {
    id: 'config-advisor',
    name: 'Configuration Advisor',
    purpose: 'Watches recurring-question clusters and proposes auto-reply rules with confidence + sample matches.',
    status: 'planned',
    lastRunAt: null,
    runs: 0,
    shipsIn: 'M1.5 · Chunk 17',
  },
  {
    id: 'clustering',
    name: 'Recurring-question Clusterer',
    purpose: 'Groups inbound messages by intent via embedding similarity, feeds Intelligence Dashboard.',
    status: 'planned',
    lastRunAt: null,
    runs: 0,
    shipsIn: 'M1.5 · Chunk 16',
  },
  {
    id: 'sentiment',
    name: 'Sentiment Scorer',
    purpose: 'Per-message Gemini sentiment classification, batched to keep cost down.',
    status: 'planned',
    lastRunAt: null,
    runs: 0,
    shipsIn: 'M1.5 · Chunk 16',
  },
  {
    id: 'pdpa-watchdog',
    name: 'PDPA Watchdog',
    purpose: 'Routes new memory facts through approval queue when per-org memory_mode = "approval", logs to audit.',
    status: 'planned',
    lastRunAt: null,
    runs: 0,
    shipsIn: 'M1.5 · Chunk 18',
  },
];

export default function AgentsPage() {
  const active = AGENTS.filter((a) => a.status === 'active');
  const planned = AGENTS.filter((a) => a.status === 'planned');
  const paused = AGENTS.filter((a) => a.status === 'paused');

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-8 py-10">
      <header>
        <p className="label-mono">Admin · agents</p>
        <h1 className="mt-3 text-[clamp(28px,3.4vw,42px)] font-semibold tracking-tight text-ink">
          Background agents registry
        </h1>
        <p className="lead mt-3 max-w-[58ch]">
          Each named pipeline that runs without direct user input. Active agents show
          live last-run timestamps; planned agents show the build chunk that ships them.
        </p>
      </header>

      <Section label="Active" agents={active} />
      <Section label="Planned for M1.5" agents={planned} muted />
      {paused.length > 0 && <Section label="Paused" agents={paused} muted />}
    </div>
  );
}

function Section({
  label,
  agents,
  muted,
}: {
  label: string;
  agents: Agent[];
  muted?: boolean;
}) {
  return (
    <section>
      <p className="label-mono">{label}</p>
      <ul className="mt-4 divide-y divide-hairline overflow-hidden rounded-lg border border-hairline bg-paper">
        {agents.map((a) => (
          <li key={a.id} className="px-5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <h3
                className={`text-[15px] font-semibold ${
                  muted ? 'text-ink-2' : 'text-ink'
                }`}
              >
                {a.name}
              </h3>
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
                  a.status === 'active'
                    ? 'text-mint'
                    : a.status === 'paused'
                      ? 'text-rose'
                      : 'text-mute'
                }`}
              >
                {a.status} · {a.shipsIn}
              </span>
            </div>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{a.purpose}</p>
            {a.id === 'concierge' && (
              <Link
                href="/admin/prospects"
                className="mt-2 inline-flex font-mono text-[10px] uppercase tracking-widest text-warm hover:underline"
              >
                view conversations →
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
