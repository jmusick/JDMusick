# JD Musick

Official website for JD Musick, an electric blues and soul artist. The debut album, **The Road Still Knows**, was released September 4, 2026.

Built with [Astro](https://astro.build) for static deployment to [Cloudflare Pages](https://pages.cloudflare.com/). The contact form runs as a Pages Function using Cloudflare Turnstile and Cloudflare Email Sending.

## Visual direction

The site takes its palette and texture from the album artwork: blackened wood, wet brick, ember orange, rust, and aged cream. Bebas Neue matches the tall condensed artist credit on the cover, Barlow Condensed carries the headlines, and Libre Franklin keeps long copy readable.

## Content status

- Spotify and Apple Music album links are live.
- Social profile links remain hidden until their correct URLs are recorded in `src/config/site.ts`.
- The released Spotify album is the source of truth for the track order and displayed timings in `src/data/album.ts`.
- The Turnstile production site key and server secret still need to be created for `jdmusick.band`.
- Cloudflare Email Sending must be onboarded for `jdmusick.band`, with the API token and form destination stored as Pages secrets.

## Development

```bash
npm install
npm run dev                                  # pages only; Functions are not served
npm run build
npx wrangler pages dev dist                 # includes /api/contact
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

Cloudflare Pages project `jdmusick`, via `wrangler.toml`. The connected Git
repository deploys automatically, or a local build can be published with:

```bash
npx wrangler pages deploy dist --project-name jdmusick
```

## Contact form

`POST /api/contact` is the site's only server-side route. The Cloudflare Pages
Function in [`functions/api/contact.ts`](functions/api/contact.ts) verifies
Turnstile and sends messages through the Cloudflare Email Sending REST API.

Production configuration:

| Location | Type | Name |
| --- | --- | --- |
| `wrangler.toml` `[vars]` | Plaintext | `CLOUDFLARE_ACCOUNT_ID` |
| Pages project secret | Encrypted | `CLOUDFLARE_API_TOKEN` |
| Pages project secret | Encrypted | `TURNSTILE_SECRET_KEY` |

The API token needs `Email Sending: Edit` permission for the account. The
Function defaults to `contact@jdmusick.band` as its verified sender and
destination; `EMAIL_FROM_CONTACT` and
`CONTACT_TO_EMAIL` can override those at runtime.

Provide the public Turnstile site key at build time as `PUBLIC_TURNSTILE_SITE_KEY`.
Store `TURNSTILE_SECRET_KEY` and `CLOUDFLARE_API_TOKEN` only as encrypted Pages
secrets. Copy `.dev.vars.example` to `.dev.vars` for local Function testing;
never commit the populated file.
