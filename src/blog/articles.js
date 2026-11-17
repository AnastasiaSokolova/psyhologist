import { useEffect, useState } from 'react';
import { sanityFetch, urlFor, ARTICLES_QUERY, ARTICLE_QUERY } from './sanity';
import { T } from '../i18n';
import { POST_IMG } from '../data';

/** Category values stored in Sanity (studio/schemaTypes/article.ts), in filter-chip order (chip 0 = "All"). */
export const CATEGORIES = ['Стосунки', 'Сексуальність', 'Я та ідентичність', 'Психотерапія'];

/** Site language ('ua' | 'en') → Sanity `language` field ('uk' | 'en'). */
const cmsLang = (lang) => (lang === 'ua' ? 'uk' : 'en');

/**
 * Articles that were on the site before the CMS. Shown for a language until it has at least one
 * published article in Sanity. Texts come from i18n.js (`jr.posts`), same order as below.
 */
const FALLBACK_META = [
  { slug: 'same-people', date: '2026-10-12' },
  { slug: 'desire', date: '2026-09-28' },
  { slug: 'first-session', date: '2026-09-09' },
];

const fallbackArticles = (lang) =>
  T[lang].jr.posts.map(([cat, title, excerpt], i) => ({
    slug: FALLBACK_META[i].slug,
    date: FALLBACK_META[i].date,
    cat,
    title,
    excerpt,
    cover: POST_IMG[i],
    coverLarge: POST_IMG[i],
    alt: '',
    body: null,
  }));

const fromCms = (a) => ({
  slug: a.slug,
  date: a.publishedAt,
  cat: CATEGORIES.indexOf(a.category) + 1,
  title: a.title,
  excerpt: a.excerpt || '',
  cover: a.coverImage?.asset ? urlFor(a.coverImage).width(760).height(950).fit('crop').url() : null,
  coverLarge: a.coverImage?.asset ? urlFor(a.coverImage).width(1600).height(900).fit('crop').url() : null,
  alt: a.coverImage?.alt || '',
  body: a.body || null,
});

const byDateDesc = (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0);

/** "12 жовтня 2026" / "12 October 2026" from an ISO date. */
export function formatDate(iso, lang) {
  if (!iso) return '';
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  return new Intl.DateTimeFormat(lang === 'ua' ? 'uk-UA' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
    .format(d)
    .replace(/\s*р\.$/, '');
}

const listCache = new Map();
function loadList(lang) {
  if (!listCache.has(lang)) {
    const p = sanityFetch(ARTICLES_QUERY, { lang: cmsLang(lang) }).catch((err) => {
      listCache.delete(lang);
      throw err;
    });
    listCache.set(lang, p);
  }
  return listCache.get(lang);
}

/** Blog list for the current language: CMS articles if there are any, otherwise the built-in ones. */
export function useArticles(lang) {
  const [state, setState] = useState({ lang: null, items: null });

  useEffect(() => {
    let alive = true;
    loadList(lang)
      .then((items) => alive && setState({ lang, items }))
      .catch((err) => {
        console.warn('[blog] Sanity unavailable, showing built-in articles', err);
        if (alive) setState({ lang, items: [] });
      });
    return () => { alive = false; };
  }, [lang]);

  if (state.lang !== lang) return { loading: true, articles: [] };
  const articles = state.items.length ? state.items.map(fromCms) : fallbackArticles(lang);
  return { loading: false, articles: articles.sort(byDateDesc) };
}

/** A single article by slug: from Sanity, or a built-in one. `article` is null while loading, false if not found. */
export function useArticle(slug, lang) {
  const [state, setState] = useState({ slug: null, data: null });

  useEffect(() => {
    let alive = true;
    sanityFetch(ARTICLE_QUERY, { slug })
      .catch(() => null)
      .then((data) => alive && setState({ slug, data: data || false }));
    return () => { alive = false; };
  }, [slug]);

  if (state.slug !== slug) return { article: null };
  if (state.data) return { article: fromCms(state.data) };
  const local = fallbackArticles(lang).find((a) => a.slug === slug);
  return { article: local || false };
}
