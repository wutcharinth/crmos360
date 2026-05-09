import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Noto_Sans_Thai } from 'next/font/google';
import { cookies } from 'next/headers';
import { SkinProvider } from '@/components/skin-provider';
import { SKIN_COOKIE_NAME, readSkinCookie } from '@/lib/skin-cookie';
import { LANG_COOKIE, readLangCookie } from '@/lib/marketing/lang';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
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

// viewport-fit=cover is required for env(safe-area-inset-*) to return non-zero
// values on iOS Safari (notch + home-indicator handling).
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAF7' },
    { media: '(prefers-color-scheme: dark)', color: '#0E1116' },
  ],
};

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const initialSkin = readSkinCookie(cookieStore.get(SKIN_COOKIE_NAME)?.value);
  const initialLang = readLangCookie(cookieStore.get(LANG_COOKIE)?.value);
  // Resolve `system` to `daylight` at SSR (no window). Client effect re-resolves.
  const initialClass = initialSkin === 'cockpit' ? 'dark' : '';

  // When Supabase is configured, surface the user id so the SkinProvider
  // can hydrate from user_prefs on mount. Wrapped in try/catch because
  // `getUser()` writes refresh cookies, which can throw in some
  // server-component contexts; the cookie skin remains a safe fallback.
  let userId: string | null = null;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id ?? null;
    } catch {
      userId = null;
    }
  }

  return (
    <html
      lang={initialLang}
      className={`${inter.variable} ${notoSansThai.variable} ${jetbrainsMono.variable} ${initialClass}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <SkinProvider initialSkin={initialSkin} userId={userId}>
          {children}
        </SkinProvider>
      </body>
    </html>
  );
}
