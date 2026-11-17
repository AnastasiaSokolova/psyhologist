import { createImageUrlBuilder } from '@sanity/image-url';

/** Same project as studio/sanity.config.ts. The dataset is public, so no token is needed in the browser. */
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'sm1kudal';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const API_VERSION = '2025-02-19';

/**
 * Runs a GROQ query against the Sanity CDN (published content only — drafts never reach the site).
 * A plain fetch keeps the bundle small; @sanity/client isn't needed for read-only queries.
 */
export async function sanityFetch(query, params = {}) {
  const url = new URL(`https://${projectId}.apicdn.sanity.io/v${API_VERSION}/data/query/${dataset}`);
  url.searchParams.set('query', query);
  url.searchParams.set('perspective', 'published');
  for (const [key, value] of Object.entries(params)) url.searchParams.set(`$${key}`, JSON.stringify(value));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity ${res.status}`);
  return (await res.json()).result;
}

const builder = createImageUrlBuilder({ projectId, dataset });
export const urlFor = (source) => builder.image(source).auto('format');

const CARD_FIELDS = `_id, title, "slug": slug.current, category, language, excerpt, publishedAt, coverImage`;

/** Published articles in one language, newest first. */
export const ARTICLES_QUERY = `*[_type == "article" && language == $lang && defined(slug.current) && defined(publishedAt)]
  | order(publishedAt desc) { ${CARD_FIELDS} }`;

/** One article with its body. */
export const ARTICLE_QUERY = `*[_type == "article" && slug.current == $slug][0] { ${CARD_FIELDS}, body }`;
