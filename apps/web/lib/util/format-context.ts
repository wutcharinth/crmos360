interface KbHit {
  id: string;
  title: string;
  body: string;
  similarity: number;
}

export function formatKnowledgeContext(hits: KbHit[]): string {
  if (hits.length === 0) return '';
  return [
    'Relevant knowledge base articles (use when answering, but only if applicable):',
    ...hits.map((h, i) => `[KB${i + 1}] ${h.title}\n${h.body}`),
  ].join('\n\n');
}
