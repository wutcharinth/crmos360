import { redirect } from 'next/navigation';
import { requireMembership } from '@/lib/auth/current-user';
import { isSupabaseConfigured } from '@/lib/supabase/server';
import { InboxShell } from '@/components/inbox/InboxShell';
import { InboxSidebar } from '@/components/inbox/InboxSidebar';
import { InboxList } from '@/components/inbox/InboxList';
import { loadInboxList } from './_load';

export const dynamic = 'force-dynamic';

/**
 * Inbox empty-state route.
 *
 * Renders the 4-column workspace with the thread + context columns
 * showing a "pick a conversation" splash. If conversations exist we
 * redirect to /inbox/[firstId] so the user always lands on a thread.
 */
export default async function InboxPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="p-8 text-sm text-mute">Inbox requires Supabase to be configured.</div>
    );
  }

  const { orgId } = await requireMembership();
  const { items, channelCounts, totalCounts } = await loadInboxList(orgId);

  if (items.length > 0) {
    redirect(`/inbox/${items[0]!.id}`);
  }

  return (
    <div className="flex h-[calc(100vh-100px)] min-h-0 flex-col">
      <InboxShell
        sidebar={
          <InboxSidebar
            folder="all"
            channelCounts={channelCounts}
            totalCounts={totalCounts}
          />
        }
        list={<InboxList items={items} totalCount={items.length} />}
        thread={
          <div className="flex flex-1 items-center justify-center p-12 text-center">
            <div>
              <p className="text-base font-medium text-ink">No conversations yet</p>
              <p className="mt-1 text-sm text-mute">
                Connect a channel in Integrations to start receiving messages.
              </p>
            </div>
          </div>
        }
      />
    </div>
  );
}
