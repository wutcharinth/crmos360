import type { MockSentimentPoint } from '@/lib/mocks/types';

interface SentimentChartProps {
  points: MockSentimentPoint[];
  /** SVG viewBox width — pin to this to keep tick math simple. */
  width?: number;
  height?: number;
  /** Index of point to mark as a known incident (e.g. shipping outage). */
  incidentIndex?: number;
}

/**
 * Hand-rolled inline SVG sentiment chart. Three thin lines (positive,
 * neutral, negative) over a 30-day window. Solid colors only — no gradient
 * fills. The token grammar:
 *   - positive  → mint
 *   - neutral   → ink-2
 *   - negative  → rose
 *
 * No chart-library dep on purpose. The shape is a sparkline; we want it to
 * read as editorial, not as a Recharts default.
 */
export function SentimentChart({
  points,
  width = 360,
  height = 200,
  incidentIndex,
}: SentimentChartProps) {
  const padX = 8;
  const padTop = 14;
  const padBottom = 22;
  const innerW = width - padX * 2;
  const innerH = height - padTop - padBottom;

  if (points.length === 0) {
    return null;
  }

  const xAt = (i: number): number =>
    padX + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);

  // Y axis is fixed [0, 1] since values are proportions that sum to 1.
  const yAt = (v: number): number => padTop + (1 - v) * innerH;

  const toPath = (key: 'positive' | 'neutral' | 'negative'): string =>
    points
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(2)},${yAt(p[key]).toFixed(2)}`)
      .join(' ');

  const lastPoint = points[points.length - 1]!;
  const incident = typeof incidentIndex === 'number' ? points[incidentIndex] : undefined;

  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block w-full"
        role="img"
        aria-label="Sentiment trend, 30 days, three series: positive, neutral, negative"
        preserveAspectRatio="none"
      >
        {/* Baseline grid — three faint horizontal rules at 25/50/75% */}
        {[0.25, 0.5, 0.75].map((v) => (
          <line
            key={v}
            x1={padX}
            y1={yAt(v)}
            x2={width - padX}
            y2={yAt(v)}
            stroke="hsl(var(--hairline))"
            strokeWidth={1}
            strokeDasharray="2 4"
          />
        ))}

        {/* Incident marker — vertical rule + dot */}
        {incident && typeof incidentIndex === 'number' && (
          <g>
            <line
              x1={xAt(incidentIndex)}
              y1={padTop}
              x2={xAt(incidentIndex)}
              y2={height - padBottom}
              stroke="hsl(var(--rose))"
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={0.55}
            />
            <circle
              cx={xAt(incidentIndex)}
              cy={yAt(incident.negative)}
              r={3}
              fill="hsl(var(--rose))"
            />
          </g>
        )}

        {/* Lines — neutral first (thicker, darker), then positive, then negative on top */}
        <path
          d={toPath('neutral')}
          fill="none"
          stroke="hsl(var(--ink-2))"
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.55}
        />
        <path
          d={toPath('positive')}
          fill="none"
          stroke="hsl(var(--mint))"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={toPath('negative')}
          fill="none"
          stroke="hsl(var(--rose))"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* End-point dots labelled with current values */}
        <circle
          cx={xAt(points.length - 1)}
          cy={yAt(lastPoint.positive)}
          r={2.5}
          fill="hsl(var(--mint))"
        />
        <circle
          cx={xAt(points.length - 1)}
          cy={yAt(lastPoint.negative)}
          r={2.5}
          fill="hsl(var(--rose))"
        />

        {/* X axis range labels */}
        <text
          x={padX}
          y={height - 6}
          fontFamily="var(--font-mono), ui-monospace, monospace"
          fontSize={9}
          letterSpacing="0.14em"
          fill="hsl(var(--mute))"
        >
          {points[0]!.date.slice(5)}
        </text>
        <text
          x={width - padX}
          y={height - 6}
          fontFamily="var(--font-mono), ui-monospace, monospace"
          fontSize={9}
          letterSpacing="0.14em"
          fill="hsl(var(--mute))"
          textAnchor="end"
        >
          {lastPoint.date.slice(5)} · today
        </text>
      </svg>

      {/* Legend + last-day readout */}
      <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1.5">
        <SeriesPill color="mint" label="positive" value={lastPoint.positive} />
        <SeriesPill color="ink-2" label="neutral" value={lastPoint.neutral} />
        <SeriesPill color="rose" label="negative" value={lastPoint.negative} />
        {incident && typeof incidentIndex === 'number' && (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-rose">
            incident · day {points.length - incidentIndex}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

function SeriesPill({
  color,
  label,
  value,
}: {
  color: 'mint' | 'rose' | 'ink-2';
  label: string;
  value: number;
}) {
  const dot =
    color === 'mint'
      ? 'bg-mint'
      : color === 'rose'
        ? 'bg-rose'
        : 'bg-ink-2';
  return (
    <span className="inline-flex items-baseline gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
      <span className={`inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full ${dot}`} aria-hidden />
      {label}
      <span className="tabular-nums text-ink-2">
        {Math.round(value * 100)}%
      </span>
    </span>
  );
}
