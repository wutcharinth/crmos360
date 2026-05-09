/**
 * Server-safe skin cookie helpers. The provider + hooks live in
 * components/skin-provider.tsx (client). Anything that needs to read the
 * cookie at request time on the server (root layout) imports from here.
 */

export type Skin = 'daylight' | 'cockpit' | 'system';

export const SKIN_COOKIE_NAME = 'flowaios-skin';

const SKIN_VALUES: readonly Skin[] = ['daylight', 'cockpit', 'system'] as const;

function isSkin(v: string | undefined): v is Skin {
  return v !== undefined && (SKIN_VALUES as readonly string[]).includes(v);
}

export function readSkinCookie(value: string | undefined): Skin {
  return isSkin(value) ? value : 'daylight';
}
