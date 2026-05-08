import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Noto_Sans_Thai } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai'],
  variable: '--font-thai',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'CRMOS360 · AI OS สำหรับ Customer Operations',
  description:
    'CRMOS360 คือ AI Operating System สำหรับ Customer Operations และ Social Commerce ' +
    'รวมแชท ลูกค้า ออเดอร์ Workflow และ AI Agents ไว้ในระบบเดียว',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="th"
      className={`${inter.variable} ${notoSansThai.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
