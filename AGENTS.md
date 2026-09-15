# AGENTS.md

Guidance for AI coding agents working in this repo.

## What this is

Official site for JD Musick, an electric blues and soul recording artist.
Astro static pages deploy to Cloudflare Pages; the contact endpoint is the only
server-side route. Read `README.md` before changing visual styling or public copy.

## Stack

- **Astro** (static output), TypeScript, no UI framework — components are
  `.astro` files with inline `<style>`/`<script>`.
- Styling is hand-written CSS. Design tokens and shared component styles live
  in `public/universal.css`.
- Icons via `astro-icon` + `@iconify-json/simple-icons` / `lucide`.
- Deploy target: Cloudflare Pages project `jdmusick` via `wrangler.toml`
  (`npx wrangler pages deploy dist`).

## Structure

- `src/pages/` — routes (`index.astro`, `about.astro`, `music.astro`,
  `contact.astro`, `privacy-policy.astro`).
- `src/components/` — `SiteHeader.astro`, `SiteFooter.astro`.
- `src/layouts/Layout.astro` — shared page shell.
- `src/config/site.ts` — single source of truth for site URL, name, tagline,
  and `SOCIALS` (streaming/social links). Entries with `href: null` are
  auto-hidden by the header/footer/Music page — don't special-case missing
  links elsewhere, just fill in the `href`.
- `src/data/album.ts` — album/track data for `The Road Still Knows`. Track order,
  durations, and release date here are the single source for the Music page;
  don't hardcode track info in components.
- `functions/api/contact.ts` — the only server-side code. It validates Contact
  page submissions, verifies Turnstile, and uses Cloudflare Email Sending.

## Commands

```bash
npm run dev       # astro dev, http://localhost:4321
npm run build     # astro build -> dist/
npm run preview   # serve the built output
npm run build && npx wrangler pages dev dist  # include Pages Functions
```

No test suite or linter is configured. Verify changes with `npm run build`
and, for anything visual, `npm run dev` + a browser check.

## Conventions

- Keep the site static except for `POST /api/contact`; it is a Pages Function
  because the Email Sending token cannot ship to the browser. Do not add other
  server routes or client-side data fetching without an explicit requirement.
  Content changes go through `src/config/site.ts` / `src/data/album.ts`, not
  component-level hardcoding.
- Social links with `href: null` are intentionally hidden. Do not invent public
  profiles or replace them with similarly named artists.
- `astro.config.mjs` `site`, `src/config/site.ts` `SITE_URL`, and
  `public/robots.txt`'s `Sitemap:` line must all point at `jdmusick.band`.

## Contact form and email

- Mail uses Cloudflare Email Sending's REST API. The token must have
  `Email Sending: Edit` permission.
- Keep `from` on the connected and verified domain. Put the visitor's address
  in the API's top-level snake_case `reply_to` field; `replyTo` is invalid.
- Treat success as `data.success`, not merely an HTTP 2xx response.
- `CLOUDFLARE_ACCOUNT_ID` is plaintext in `wrangler.toml`. The API token and
  `TURNSTILE_SECRET_KEY` are Pages secrets and must never be committed.
- The public Turnstile site key is supplied through
  `PUBLIC_TURNSTILE_SITE_KEY` at build time.
  `astro dev` uses Cloudflare's test key, but does not serve the Function; use
  a build with `wrangler pages dev dist` for end-to-end local tests.
- Keep the contact-form data description in `privacy-policy.astro` accurate if
  fields, providers, storage, or retention behavior change.
