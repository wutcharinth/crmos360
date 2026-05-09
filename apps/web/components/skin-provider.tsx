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

type SkinContextValue = {
  skin: Skin;
  resolvedSkin: ResolvedSkin;
  setSkin: (skin: Skin) => void;
};

const SkinContext = createContext<SkinContextValue | null>(null);

export function SkinProvider({
  children,
  initialSkin = 'daylight',
}: {
  children: ReactNode;
  initialSkin?: Skin;
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

  const setSkin = useCallback((next: Skin) => {
    setSkinState(next);
    writeCookie(next);
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
