# Yana Nikolenko — website

Vite + React one-page site (UA / EN). Originally ported from the `Yana Nikolenko.dc.html` design file.

Images live in `src/assets/` as WebP, sized for how they're displayed (≈2× on-screen size).
To add a photo: export it as WebP (or JPG), max ~1920px wide for full-width images and ~800px for cards, and import it in the component.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve dist/ locally
```

`vite.config.js` uses `base: './'`, so `dist/` works from any sub-path or static host.

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages (`.github/workflows/deploy.yml`):
https://anastasiasokolova.github.io/psyhologist/

One-time setup: repo **Settings → Pages → Source: GitHub Actions**.

The `dist/` folder can also be uploaded as-is to any static host (Netlify, Vercel, Cloudflare Pages).

## Where things live

| What | Where |
| --- | --- |
| All texts (UA + EN) | `src/i18n.js` |
| Contact links (Telegram, WhatsApp, Email still `'#'`) | `src/i18n.js` → `cta.c` |
| Card / journal images | `src/data.js` |
| Images | `src/assets/` |
| Sections | `src/components/*.jsx` (one per section, in page order in `App.jsx`) |
| Styles | `src/styles/global.css` (mobile overrides at the bottom, breakpoint 820px) |
| Scroll animations | `src/hooks/usePageMotion.js`, driven by `data-reveal`, `data-mask`, `data-px`, `data-draw`, `data-bg` attributes |

## Still to fill in

- Placeholder in the texts: `[ПРАВИЛА БУДУТЬ ДОДАНІ]` / `[TERMS TO BE ADDED]`.
- The booking form (`src/components/Contacts.jsx`) and the trainings email form (`src/components/Trainings.jsx`) only show a thank-you message; neither is connected to an email / Telegram / form service yet.
- Journal cards link to `#journal`; there are no article pages yet.
