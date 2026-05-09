import { InboxShell } from '@/components/inbox/InboxShell';
import { InboxSidebar } from '@/components/inbox/InboxSidebar';
import { InboxList, type InboxListItem } from '@/components/inbox/InboxList';
import { InboxThreadView } from '@/components/inbox/InboxThreadView';
import { InboxContextPane } from '@/components/inbox/InboxContextPane';

/**
 * Dev-only inbox preview — renders the workspace with hand-crafted
 * mock data so the layout can be reviewed without sign-in. Not linked
 * from anywhere in the product. Safe to delete once the auth-walled
 * /inbox is verified end-to-end with real data.
 */
export const dynamic = 'force-dynamic';

const items: InboxListItem[] = [
  {
    id: 'c1',
    name: 'อรวรรณ จันทรา',
    channel: 'line',
    unread: true,
    preview: 'มี cleansing balm ใหม่ไหมคะ ตัวเก่าใช้หมดแล้ว',
    lastAt: new Date(Date.now() - 2 * 60_000).toISOString(),
    tag: { label: 'Auto · 94%', cls: 'auto' },
    vip: false,
  },
  {
    id: 'c2',
    name: 'Lin Wei',
    channel: 'shopee',
    unread: true,
    preview: "Wholesale 50 pcs of CB-Original — what's the tier price?",
    lastAt: new Date(Date.now() - 5 * 60_000).toISOString(),
    tag: { label: 'Approval · 78%', cls: 'approve' },
    vip: false,
  },
  {
    id: 'c3',
    name: 'Songrit P.',
    channel: 'tiktok',
    unread: false,
    preview: 'ของเสีย พี่จะคืนเงินยังไงครับ',
    lastAt: new Date(Date.now() - 18 * 60_000).toISOString(),
    tag: { label: 'Escalate', cls: 'escalate' },
    vip: false,
  },
  {
    id: 'c4',
    name: 'Pim · VIP',
    channel: 'instagram',
    unread: false,
    preview: 'ขอโค้ด VIP สำหรับเพื่อนได้ไหมคะ',
    lastAt: new Date(Date.now() - 60 * 60_000).toISOString(),
    tag: { label: 'Growth · 88%', cls: 'growth' },
    vip: true,
  },
  {
    id: 'c5',
    name: 'Chai (Bangkok)',
    channel: 'lazada',
    unread: false,
    preview: 'ส่ง Kerry ไปที่ไหนได้บ้างครับ',
    lastAt: new Date(Date.now() - 110 * 60_000).toISOString(),
    tag: { label: 'Auto · 91%', cls: 'auto' },
    vip: false,
  },
];

export default function InboxPreviewPage() {
  return (
    <div className="flex h-[calc(100vh-100px)] min-h-0 flex-col">
      <InboxShell
        sidebar={
          <InboxSidebar
            folder="all"
            channelCounts={[
              { key: 'line', count: 8 },
              { key: 'tiktok', count: 5 },
              { key: 'shopee', count: 4 },
              { key: 'lazada', count: 3 },
              { key: 'facebook', count: 4 },
              { key: 'instagram', count: 2 },
              { key: 'email', count: 2 },
            ]}
            totalCounts={{
              all: 28,
              mine: 6,
              unassigned: 4,
              approval: 3,
              escalated: 2,
            }}
          />
        }
        list={<InboxList items={items} totalCount={items.length} />}
        thread={
          <InboxThreadView
            conversationId="c1"
            customerName="อรวรรณ จันทรา"
            channel="line"
            status="open"
            autoReplyEnabled
            messages={[
              {
                id: 'm1',
                direction: 'inbound',
                body: 'สวัสดีค่ะ มี cleansing balm ตัวใหม่ที่หลายคนถามถึงรึยังคะ ตัวเก่าใช้หมดแล้ว 😊',
                aiGenerated: false,
                sentAt: new Date(Date.now() - 18 * 60_000).toISOString(),
              },
            ]}
            customerMeta={{
              tier: 'Member',
              orders: 4,
              ltv: '8,420 ฿',
              confidence: 94,
            }}
          />
        }
        context={
          <InboxContextPane
            customerId="cust-aoi"
            customerName="อรวรรณ จันทรา"
            channel="line"
            since="ม.ค. 2024"
            tags={['ผิวแห้ง', 'paraben-free', 'Kerry shipper', 'repeat-buyer']}
            tier="Member"
            orders={4}
            ltv="8,420 ฿"
            memory={[
              {
                id: 'm-1',
                kind: 'fact',
                content: 'ชอบโปรส่งฟรี · เคย complaint เรื่องส่งช้า เม.ย. 2025',
              },
              {
                id: 'm-2',
                kind: 'note',
                content: 'tone: สุภาพและกระชับ · ตอบเร็วได้คะแนนสูง',
              },
              {
                id: 'm-3',
                kind: 'fact',
                content: 'เคยซื้อ cleansing balm รุ่น Original 2 ครั้ง',
              },
            ]}
            signals={[
              { l: 'intent', v: 'product_inquiry' },
              { l: 'sentiment', v: 'neutral' },
              { l: 'urgency', v: 'low', cls: 'pos' },
              { l: 'memory hit', v: '3 / 12' },
            ]}
            actions={['check_order', 'send_link']}
          />
        }
      />
    </div>
  );
}
