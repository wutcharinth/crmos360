export type Density = 'comfortable' | 'compact';

export const DENSITY_COOKIE = 'flowaios-density';

export function isDensity(v: string | undefined): v is Density {
  return v === 'comfortable' || v === 'compact';
}

export function readDensityCookie(value: string | undefined): Density {
  return isDensity(value) ? value : 'comfortable';
}
