# hcd_landing

Salua's public landing page: Next.js with static export (`output: 'export'`), deployed on Vercel at
https://salua-landing.vercel.app. Bilingual (English by default, Spanish via the header/footer switch).

## Structure

- `app/layout.tsx`: fonts (`next/font`: Poppins, Inter, JetBrains Mono) and all share metadata
  (Open Graph, Twitter card, canonical URL).
- `app/opengraph-image.png`, `app/twitter-image.png` (+ `.alt.txt`): 1200x630 share card.
  `app/icon.png` and `app/apple-icon.png`: favicon and home-screen icon.
- `app/landing.css`: the page styles; design tokens are CSS variables in `:root`.
- `components/landing-markup.tsx`: the page markup, rendered in English at build time.
- `lib/landing-dictionary.ts`: every string in English and Spanish, keyed by `data-i18n`,
  `data-i18n-alt` and `data-i18n-aria`.
- `lib/landing-runtime.js` (started by `components/landing-runtime.tsx`): language switch
  (choice saved in `localStorage`), mobile menu, consent demo, counters and all motion.
  Motion respects `prefers-reduced-motion`.
- `public/assets/`: the transparent WebP objects used by the hero and sections.

Design reference: the Salua Design System and the approved landing artifacts (links in
`../docs/proyecto/decisiones.md`).

## Setup

```sh
npm install
npm run dev
npm run lint
npm run build   # generates out/ for static hosting
```

Docs (Spanish): [`../docs`](../docs). Rules: [`../AGENTS.md`](../AGENTS.md).
Only npm; never commit secrets.
