import { assertM15 } from '@/lib/flags';

export const dynamic = 'force-dynamic';

export default async function AdvisorLayout({ children }: { children: React.ReactNode }) {
  await assertM15();
  return <>{children}</>;
}
