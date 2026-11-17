import { useEffect, useRef } from 'react';
import { useSite } from '../context';
import { useArticle, formatDate } from '../blog/articles';
import { closeArticle } from '../blog/route';
import ArticleBody from './ArticleBody';

/** Full-screen article view on top of the page (`#/blog/<slug>`). Closing returns to the blog section. */
export default function ArticlePage({ slug }) {
  const { t, lang, setLang, goTo } = useSite();
  const jr = t.jr;
  const { article } = useArticle(slug, lang);
  const ref = useRef(null);

  const close = (e) => {
    e?.preventDefault();
    closeArticle(goTo);
  };

  // Lock the page underneath, start each article at the top, close on Esc.
  useEffect(() => {
    const html = document.documentElement;
    html.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && closeArticle(goTo);
    window.addEventListener('keydown', onKey);
    return () => {
      html.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [goTo]);

  useEffect(() => {
    ref.current?.scrollTo(0, 0);
    ref.current?.focus({ preventScroll: true });
  }, [slug]);

  useEffect(() => {
    if (article) document.title = `${article.title} — Yana Nikolenko`;
    return () => { document.title = 'Yana Nikolenko — психолог'; };
  }, [article]);

  return (
    <div ref={ref} className="article" role="dialog" aria-modal="true" aria-label={article ? article.title : jr.h1} tabIndex={-1}>
      <div className="article__bar">
        <div className="header__inner">
          <a href="#journal" onClick={close} className="logo">Yana <i>Nikolenko</i></a>
          <div className="lang">
            <button onClick={() => setLang('ua')} className={lang === 'ua' ? 'is-active' : ''}>UA</button>
            <span>/</span>
            <button onClick={() => setLang('en')} className={lang === 'en' ? 'is-active' : ''}>EN</button>
          </div>
        </div>
      </div>

      <article className="article__inner">
        <a href="#journal" onClick={close} className="article__back">← {jr.back}</a>

        {article === null && <div className="article__state" />}
        {article === false && <p className="article__state">{jr.notFound}</p>}

        {article && (
          <>
            <div className="article__meta">
              {article.cat > 0 && <span className="article__cat">{jr.filters[article.cat]}</span>}
              <span>{formatDate(article.date, lang)}</span>
            </div>
            <h1 className="article__title">{article.title}</h1>
            {article.excerpt && <p className="article__lead">{article.excerpt}</p>}
            {article.coverLarge && (
              <div className="article__cover">
                <img src={article.coverLarge} alt={article.alt} decoding="async" />
              </div>
            )}
            {article.body && <ArticleBody value={article.body} />}
          </>
        )}

        <a href="#journal" onClick={close} className="article__back article__back--end">← {jr.back}</a>
      </article>
    </div>
  );
}
