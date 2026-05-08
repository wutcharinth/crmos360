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
  title: 'FlowAIOS · AI OS สำหรับ Customer Operations',
  description:
    'FlowAIOS คือ AI Operating System สำหรับ Customer Operations และ Social Commerce ' +
    'รวมแชท ลูกค้า ออเดอร์ Workflow และ AI Agents ไว้ในระบบเดียว',
  metadataBase: new URL('https://flowaios.vercel.app'),
  openGraph: {
    title: 'FlowAIOS',
    description: 'AI Operating System for Customer Operations',
    url: 'https://flowaios.vercel.app',
    siteName: 'FlowAIOS',
    type: 'website',
  },
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
