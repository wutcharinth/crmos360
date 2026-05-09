/**
 * Single-DOM bilingual pattern lifted from JongToh's `[lang=en] .th-only`
 * CSS trick. Both translations live in the same DOM tree wrapped in
 * `<span class="th-only">…</span><span class="en-only">…</span>`. The
 * top-level `<html lang>` attribute determines which side is hidden via
 * a single CSS rule (see globals.css). No runtime swap, no flicker.
 */

export type Lang = 'th' | 'en';

export const LANG_COOKIE = 'flowaios-lang';

export function isLang(v: string | undefined): v is Lang {
  return v === 'th' || v === 'en';
}

export function readLangCookie(value: string | undefined): Lang {
  return isLang(value) ? value : 'th'; // default Thai (primary market)
}
