import { Fragment, type ReactNode } from 'react';

/**
 * Minimal markdown for chat bubbles. The AI sometimes wraps SKUs / product
 * names in **double-asterisks** for emphasis; rendering the raw markers
 * looks broken. We render `**bold**` as <strong> and `*italic*` as <em>.
 * Everything else is plain text — combined with `whitespace-pre-wrap` on
 * the parent, line breaks are preserved.
 */
export function ChatBody({ text }: { text: string }) {
  return <>{renderInline(text)}</>;
}

function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*\n]+?)\*\*|(?<!\*)\*([^*\n]+?)\*(?!\*)/g;
  let lastIndex = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) out.push(<Fragment key={key++}>{text.slice(lastIndex, m.index)}</Fragment>);
    if (m[1] !== undefined) {
      out.push(<strong key={key++} className="font-semibold">{m[1]}</strong>);
    } else if (m[2] !== undefined) {
      out.push(<em key={key++}>{m[2]}</em>);
    }
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) out.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  return out;
}
