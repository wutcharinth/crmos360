'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { SKIN_COOKIE_NAME, type Skin } from '@/lib/skin-cookie';

export type { Skin } from '@/lib/skin-cookie';
export type ResolvedSkin = 'daylight' | 'cockpit';

const SKIN_COOKIE = SKIN_COOKIE_NAME;

function resolveSystem(): ResolvedSkin {
  if (typeof window === 'undefined') return 'daylight';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'cockpit'
    : 'daylight';
}

function resolve(skin: Skin): ResolvedSkin {
  if (skin === 'system') return resolveSystem();
  return skin;
}

function applyDom(resolved: ResolvedSkin) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', resolved === 'cockpit');
}

function writeCookie(skin: Skin) {
  if (typeof document === 'undefined') return;
  document.cookie = `${SKIN_COOKIE}=${skin}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

function isSkinValue(v: unknown): v is Skin {
  return v === 'daylight' || v === 'cockpit' || v === 'system';
}

type SkinContextValue = {
  skin: Skin;
  resolvedSkin: ResolvedSkin;
  setSkin: (skin: Skin) => void;
};

const SkinContext = createContext<SkinContextValue | null>(null);

export function SkinProvider({
  children,
  initialSkin = 'daylight',
  userId,
}: {
  children: ReactNode;
  initialSkin?: Skin;
  /**
   * When present, the provider hydrates its initial skin from the DB on
   * mount (falling back to the cookie-derived `initialSkin` if the
   * request fails or the user has no row yet) and writes through to
   * /api/user/prefs whenever the user picks a different skin.
   */
  userId?: string | null;
}) {
  const [skin, setSkinState] = useState<Skin>(initialSkin);
  const [resolvedSkin, setResolvedSkin] = useState<ResolvedSkin>(
    initialSkin === 'system' ? 'daylight' : initialSkin,
  );

  useEffect(() => {
    const r = resolve(skin);
    setResolvedSkin(r);
    applyDom(r);
  }, [skin]);

  useEffect(() => {
    if (skin !== 'system' || typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const r = resolveSystem();
      setResolvedSkin(r);
      applyDom(r);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [skin]);

  // Hydrate from DB on mount for signed-in users. Cookie value remains
  // the SSR-time fast path so the first paint isn't blocked.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/user/prefs', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as { skin?: unknown };
        if (cancelled) return;
        if (isSkinValue(data.skin) && data.skin !== skin) {
          setSkinState(data.skin);
          writeCookie(data.skin);
        }
      } catch {
        // Silently ignore — cookie value still applies.
      }
    })();
    return () => {
      cancelled = true;
    };
    // Run once per userId change. We intentionally don't depend on
    // `skin` here; the goal is one-shot hydration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const setSkin = useCallback((next: Skin) => {
    setSkinState(next);
    writeCookie(next);
    // Fire-and-forget DB write. Marketing visitors hit a 401/redirect
    // here; that's expected — the cookie is enough for them.
    if (typeof window !== 'undefined') {
      void fetch('/api/user/prefs', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ skin: next }),
      }).catch(() => {
        // Silently ignore.
      });
    }
  }, []);

  return (
    <SkinContext.Provider value={{ skin, resolvedSkin, setSkin }}>
      {children}
    </SkinContext.Provider>
  );
}

export function useSkin(): SkinContextValue {
  const ctx = useContext(SkinContext);
  if (!ctx) {
    throw new Error('useSkin must be used inside <SkinProvider>');
  }
  return ctx;
}

export { readSkinCookie, SKIN_COOKIE_NAME } from '@/lib/skin-cookie';
