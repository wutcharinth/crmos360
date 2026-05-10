# Channel logos — press-kit drop-in

Files placed in this directory are served at `/channel-logos/{key}.svg` and
auto-pick up wherever `<BrandLogo channel="{key}" />` is rendered (currently
the hero `<CombineStage />`). If a file is missing for a given key, the
component falls back to the in-house stylized `<ChannelIcon>` tile.

## Why this directory exists

Brand logos are trademarks. Reproducing them requires either downloading
the official press-kit asset or rendering a stylized in-house icon. We do
the latter by default; this directory is the override slot for when you
want to ship the official mark.

## Filename convention

Use the `ChannelKey` from `apps/web/components/ui/channel-icon.tsx`:

```
line.svg          shopee.svg       lazada.svg
tiktok.svg        facebook.svg     instagram.svg
messenger.svg     email.svg        whatsapp.svg
web.svg
```

SVG is preferred. PNG / WebP also work — pass `ext="png"` / `ext="webp"`
to `<BrandLogo>` per call.

Recommended dimensions: square, 64×64 minimum, with the brand mark
centered and modest padding. The `<BrandLogo>` component renders at any
requested `size` (28 in the hero orbs, 20 in the inbox row badges).

## Where to download official press-kit assets

Each platform publishes brand guidelines + downloadable SVG/PNG kits.
Read each kit's usage rules before shipping — most allow nominative use
(showing "we integrate with X") provided the mark isn't altered, isn't
implying endorsement, and stays at the recommended clear-space.

| key | Platform | Brand resources |
|---|---|---|
| `line` | LINE | https://developers.line.biz/en/docs/line-developers-community/identity-guidelines/ |
| `shopee` | Shopee | Request via https://shopee.com / partner portal |
| `lazada` | Lazada | https://www.lazada.com → press / brand assets |
| `tiktok` | TikTok / TikTok Shop | https://www.tiktok.com/business/library |
| `facebook` | Facebook (Meta) | https://about.meta.com/brand/resources/facebookapp/ |
| `instagram` | Instagram (Meta) | https://about.meta.com/brand/resources/instagram/ |
| `messenger` | Messenger (Meta) | https://about.meta.com/brand/resources/messenger/ |
| `whatsapp` | WhatsApp (Meta) | https://about.meta.com/brand/resources/whatsapp/ |

For email, web chat, and any in-house channel, the default `<ChannelIcon>`
tile is fine — there's no third-party trademark to honor.

## After dropping a file in

No build step needed. Vercel serves the file as a static asset on next
deploy; the BrandLogo loader picks it up because the file exists at the
expected URL.

To preview locally: `pnpm --filter @crmos360/web dev`, then visit
`http://localhost:3000/` and the hero stage will show the new logos.

## Removing a logo

Delete the file. The component falls back to `<ChannelIcon>` automatically.

## Compliance reminder

Do not modify the supplied logos (color shifts, distortion, drop-shadow
effects, etc.). Most brand guidelines disallow modification. If you need
a tinted / dark-mode variant, download both the standard and dark
versions from the press kit instead of recoloring one yourself.
