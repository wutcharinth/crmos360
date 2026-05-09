import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SkinSwitcher } from '@/components/skin-switcher';

const COLOR_TOKENS: { name: string; varName: string }[] = [
  { name: 'paper', varName: '--paper' },
  { name: 'paper-2', varName: '--paper-2' },
  { name: 'paper-3', varName: '--paper-3' },
  { name: 'ink', varName: '--ink' },
  { name: 'ink-2', varName: '--ink-2' },
  { name: 'mute', varName: '--mute' },
  { name: 'hairline', varName: '--hairline' },
  { name: 'hairline-2', varName: '--hairline-2' },
  { name: 'warm', varName: '--warm' },
  { name: 'warm-2', varName: '--warm-2' },
  { name: 'warm-soft', varName: '--warm-soft' },
  { name: 'mint', varName: '--mint' },
  { name: 'mint-soft', varName: '--mint-soft' },
  { name: 'rose', varName: '--rose' },
];

const SHADCN_TOKENS = [
  '--background',
  '--foreground',
  '--card',
  '--popover',
  '--primary',
  '--secondary',
  '--muted',
  '--accent',
  '--destructive',
  '--border',
  '--input',
  '--ring',
];

export default function DevSkinPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-hairline bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="label-mono">/dev/skin</p>
            <h1 className="display-md mt-1">Skin tokens — QA surface</h1>
          </div>
          <SkinSwitcher />
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-6 py-10">
        <section>
          <h2 className="text-sm font-medium uppercase tracking-widest text-mute">
            Brand color tokens
          </h2>
          <p className="lead mt-2">
            All values resolve from CSS variables. Toggle the skin above; swatches recolor
            without page reload.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {COLOR_TOKENS.map((tok) => (
              <div
                key={tok.varName}
                className="overflow-hidden rounded-lg border border-hairline"
              >
                <div
                  className="h-16 w-full"
                  style={{ background: `hsl(var(${tok.varName}))` }}
                />
                <div className="bg-paper-2 px-3 py-2">
                  <p className="font-mono text-[10px] text-ink">{tok.name}</p>
                  <p className="font-mono text-[10px] text-mute">{tok.varName}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-widest text-mute">
            shadcn semantic tokens
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {SHADCN_TOKENS.map((tok) => (
              <div key={tok} className="overflow-hidden rounded-lg border border-hairline">
                <div
                  className="h-12 w-full"
                  style={{ background: `hsl(var(${tok}))` }}
                />
                <div className="bg-paper-2 px-3 py-2">
                  <p className="font-mono text-[10px] text-ink">{tok}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-widest text-mute">
            Typography scale
          </h2>
          <div className="mt-6 space-y-4">
            <p className="display-xl">Display XL — clamp(40, 5.6vw, 78)</p>
            <p className="display-lg">Display LG — clamp(32, 4.4vw, 56)</p>
            <p className="display-md">Display MD — clamp(28, 3.4vw, 44)</p>
            <p className="text-xl">Body XL — Tailwind text-xl, 20px</p>
            <p className="text-base">Body base — Tailwind text-base, 16px (default body)</p>
            <p className="text-sm text-ink-2">
              Body small — secondary copy at 14px on ink-2
            </p>
            <p className="label-mono">Label mono — JetBrains Mono · ALL CAPS · tracked</p>
            <p className="font-thai text-base">
              ภาษาไทย — Noto Sans Thai fallback chain validates here. ระบบควรอ่านค่าตัวแปร
              จาก CSS variables โดยตรง.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-widest text-mute">
            Sample components
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Card title</CardTitle>
                <CardDescription>
                  Standard shadcn card; uses --card and --card-foreground tokens.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-ink-2">
                  Cards inherit border, radius, and color from theme tokens. Toggling skin
                  recolors all of these in place.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Primary</Button>
                  <Button size="sm" variant="secondary">
                    Secondary
                  </Button>
                  <Button size="sm" variant="outline">
                    Outline
                  </Button>
                  <Button size="sm" variant="ghost">
                    Ghost
                  </Button>
                  <Button size="sm" variant="destructive">
                    Destructive
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status pills</CardTitle>
                <CardDescription>Confidence + escalation badges.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-soft px-2.5 py-1 text-xs font-medium text-mint">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" />
                    Auto · 96%
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-warm-soft px-2.5 py-1 text-xs font-medium text-warm">
                    Approval · 78%
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-paper-2 px-2.5 py-1 text-xs font-medium text-ink-2">
                    Escalated · 41%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-widest text-mute">
            Radius + shadow
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-sm border border-hairline bg-card p-4 text-sm">
              radius-sm
            </div>
            <div className="rounded-md border border-hairline bg-card p-4 text-sm">
              radius-md
            </div>
            <div className="rounded-lg border border-hairline bg-card p-4 text-sm">
              radius-lg
            </div>
            <div className="rounded-md bg-card p-4 text-sm shadow-soft">shadow-soft</div>
            <div className="rounded-md bg-card p-4 text-sm shadow-cta">shadow-cta</div>
            <div className="rounded-md bg-card p-4 text-sm shadow-terminal">
              shadow-terminal
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
