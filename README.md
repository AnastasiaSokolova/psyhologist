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

## Deploy (Cloudflare Pages)

Connect the GitHub repo in Cloudflare Pages with these settings:

| Setting | Value |
| --- | --- |
| Framework preset | Vite (or None) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Node version | from `.nvmrc` (22) |
| Environment variables | none required |

- `vite.config.js` uses `base: '/'` — the site is served from the domain root.
- Article pages use hash URLs (`#/blog/<slug>`), so no `_redirects` file is needed; with no `404.html`, Cloudflare serves `index.html` for unknown paths.
- Optional overrides: `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET` (set for Production and Preview; read at build time). Never put a Sanity token in a `VITE_` variable — it would be public.

## Where things live

| What | Where |
| --- | --- |
| All texts (UA + EN) | `src/i18n.js` |
| Contact links (Telegram, WhatsApp, Email still `'#'`) | `src/i18n.js` → `cta.c` |
| Card / journal images | `src/data.js` |
| Images | `src/assets/` |
| Sections | `src/components/*.jsx` (one per section, in page order in `App.jsx`) |
| Styles | `src/styles/global.css` (mobile overrides at the bottom, breakpoint 820px) |
| Scroll animations | `src/hooks/usePageMotion.js`, driven by `data-reveal`, `data-mask`, `data-px`, `data-bg` attributes |

## Blog (Sanity CMS)

Articles are edited in Sanity Studio (`../studio`, run `npm run dev` there → http://localhost:3333), project `sm1kudal`, dataset `production`.

- The site reads **published** articles directly from the Sanity CDN (`src/blog/sanity.js`), filtered by language (`uk` / `en`) and sorted newest first.
- Article pages open at `#/blog/<slug>` (`src/components/ArticlePage.jsx`); the text is rendered from Portable Text (`src/components/ArticleBody.jsx`).
- Until a language has at least one published article in Sanity, the blog shows the built-in articles from `src/i18n.js` (`jr.posts`) — or if Sanity can't be reached.
- Categories in Sanity must match the filter chips: Стосунки, Сексуальність, Я та ідентичність, Психотерапія.
- Sanity only answers browsers from allowed origins. `http://localhost:5173` and `http://localhost:4173` are allowed; before going live add the Cloudflare addresses (otherwise the blog silently shows the built-in articles):

  ```bash
  cd ../studio
  npx sanity cors add https://PROJECT.pages.dev --no-credentials
  npx sanity cors add "https://*.PROJECT.pages.dev" --no-credentials   # preview deploys
  npx sanity cors add https://YOUR-DOMAIN.com --no-credentials           # custom domain, if any
  ```

- New articles appear on the site without a rebuild (the CDN can take up to a minute).

## Forms

The booking form and the trainings form send emails to yananikolenko18@gmail.com via [FormSubmit](https://formsubmit.co) (`src/sendForm.js`).
The very first submission triggers an activation email from FormSubmit to that inbox — click **Activate Form** once, otherwise nothing is delivered.

## Still to fill in

- Placeholder in the texts: `[ПРАВИЛА БУДУТЬ ДОДАНІ]` / `[TERMS TO BE ADDED]`.
