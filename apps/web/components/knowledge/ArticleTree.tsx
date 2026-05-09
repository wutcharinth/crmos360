'use client';

import { useState } from 'react';

interface MockArticle {
  id: string;
  title: string;
  updatedDays: number;
}

interface MockCategory {
  id: string;
  label: string;
  articles: MockArticle[];
}

// Inline mock data — no DB schema yet for KB articles. Replaced when Phase 5
// migration lands.
const CATEGORIES: MockCategory[] = [
  {
    id: 'shipping',
    label: 'Shipping & Returns',
    articles: [
      { id: 'kb_001', title: 'Kerry tracking — how to read the status', updatedDays: 3 },
      { id: 'kb_002', title: 'Return window + refund policy', updatedDays: 11 },
      { id: 'kb_003', title: 'International shipping (TH → SG/MY)', updatedDays: 24 },
    ],
  },
  {
    id: 'product',
    label: 'Product · Klin Skin',
    articles: [
      { id: 'kb_004', title: 'Ingredient list · sensitive-skin line', updatedDays: 5 },
      { id: 'kb_005', title: 'Discovery set FAQ', updatedDays: 9 },
      { id: 'kb_006', title: 'Brand voice — alcohol/paraben/fragrance-free', updatedDays: 18 },
      { id: 'kb_007', title: 'Wholesale pricing tiers (B2B)', updatedDays: 30 },
    ],
  },
];

/**
 * Left-rail collapsible KB article tree. Categories collapse/expand;
 * clicking an article does nothing yet (article editor lands in a follow-up).
 */
export function ArticleTree() {
  const [open, setOpen] = useState<Record<string, boolean>>({
    shipping: true,
    product: true,
  });

  return (
    <nav aria-label="Knowledge base articles" className="space-y-5">
      {CATEGORIES.map((cat) => {
        const isOpen = open[cat.id] ?? true;
        return (
          <div key={cat.id}>
            <button
              type="button"
              onClick={() => setOpen((s) => ({ ...s, [cat.id]: !isOpen }))}
              className="flex w-full items-baseline justify-between gap-3 text-left"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute group-hover:text-ink-2">
                {cat.label}
              </span>
              <span className="font-mono text-[10px] tabular-nums text-mute">
                {isOpen ? '−' : '+'} {cat.articles.length}
              </span>
            </button>
            {isOpen && (
              <ul className="mt-2.5 space-y-1.5">
                {cat.articles.map((a) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      className="block w-full truncate text-left text-[13px] leading-snug text-ink-2 hover:text-warm"
                      title={a.title}
                    >
                      {a.title}
                    </button>
                    <p className="font-mono text-[10px] text-mute">
                      updated {a.updatedDays}d ago
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
      <p className="border-t border-hairline pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
        Article editor · Phase 5
      </p>
    </nav>
  );
}
