export const VERTICALS = ['commerce', 'customer-ops', 'services', 'b2b'] as const;
export type Vertical = (typeof VERTICALS)[number];

export const VERTICAL_COOKIE = 'flowaios-vertical';

export interface VerticalProfile {
  id: Vertical;
  label: string;
  description: string;
  channels: ReadonlyArray<string>; // labels matching channelStripBrands
  ctaHref: string;
}

export const verticalProfiles: ReadonlyArray<VerticalProfile> = [
  {
    id: 'commerce',
    label: 'DTC Commerce',
    description: 'แบรนด์ DTC, ecom, ร้านขายผ่าน LINE OA + Shopee + Lazada + TikTok Shop',
    channels: ['LINE OA', 'Shopee', 'Lazada', 'TikTok Shop', 'Instagram', 'Facebook'],
    ctaHref: '/for/commerce',
  },
  {
    id: 'customer-ops',
    label: 'Customer Ops Mid-market',
    description: 'ทีม CS 5–30 คน รองรับลูกค้าหลายช่องทาง ต้องการเครื่องมือควบคุมคุณภาพ + audit',
    channels: ['LINE OA', 'Shopee', 'Lazada', 'Instagram', 'Facebook', 'Email'],
    ctaHref: '/for/customer-ops',
  },
  {
    id: 'services',
    label: 'Services / Education',
    description: 'ธุรกิจบริการ คลินิก กวดวิชา fitness ส่วนใหญ่ใช้ LINE OA + Facebook',
    channels: ['LINE OA', 'Facebook', 'Email'],
    ctaHref: '/for/services',
  },
  {
    id: 'b2b',
    label: 'B2B / Industrial',
    description: 'ธุรกิจ B2B จำหน่ายอะไหล่/อุปกรณ์ ส่วนใหญ่รับ order ผ่าน LINE + email',
    channels: ['LINE OA', 'Email'],
    ctaHref: '/contact',
  },
];

export function isVertical(value: string | undefined): value is Vertical {
  return value !== undefined && (VERTICALS as readonly string[]).includes(value);
}

export function readVerticalCookie(value: string | undefined): Vertical | null {
  return isVertical(value) ? value : null;
}

export function getVerticalProfile(id: Vertical): VerticalProfile | undefined {
  return verticalProfiles.find((p) => p.id === id);
}
