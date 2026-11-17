import { useEffect, useState } from 'react';

/** Article pages live at `#/blog/<slug>` — works on any static host (GitHub Pages) without server rewrites. */
export const articleHref = (slug) => `#/blog/${encodeURIComponent(slug)}`;

const readSlug = () => {
  const m = window.location.hash.match(/^#\/blog\/([^/?#]+)/);
  return m ? decodeURIComponent(m[1]) : null;
};

let openedFromList = false;
/** Call when an article is opened from the blog list, so "back" can return to the same scroll position. */
export const markOpenedFromList = () => { openedFromList = true; };

export function useArticleSlug() {
  const [slug, setSlug] = useState(readSlug);
  useEffect(() => {
    const onChange = () => {
      const s = readSlug();
      if (!s) openedFromList = false;
      setSlug(s);
    };
    window.addEventListener('hashchange', onChange);
    window.addEventListener('blog:route', onChange);
    return () => {
      window.removeEventListener('hashchange', onChange);
      window.removeEventListener('blog:route', onChange);
    };
  }, []);
  return slug;
}

/** Close the article and return to the blog section. */
export function closeArticle(goTo) {
  if (openedFromList) {
    openedFromList = false;
    window.history.back();
    return;
  }
  // Opened directly (shared link): drop the hash and scroll to the blog section.
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
  window.dispatchEvent(new Event('blog:route'));
  requestAnimationFrame(() => goTo('journal'));
}
