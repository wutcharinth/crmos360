import { assertM15 } from '@/lib/flags';

export const dynamic = 'force-dynamic';

/**
 * /settings/{pdpa,channels,appearance} are M1.5 surfaces — they get
 * gated behind the m15 flag. /settings/profile and any non-M1.5
 * settings would need to live outside this layout.
 */
export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  await assertM15();
  return <>{children}</>;
}
