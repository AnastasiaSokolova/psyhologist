import { Suspense, lazy, useCallback, useMemo, useRef, useState } from 'react';
import { T } from './i18n';
import { MOBILE_MAX, NAV_IDS, pad } from './data';
import { SiteContext } from './context';
import { useViewportWidth, prefersReducedMotion } from './hooks/useViewport';
import { usePageMotion } from './hooks/usePageMotion';

import Loader from './components/Loader';
import Header from './components/Header';
import MobileMenu from './components/MobileMenu';
import Hero from './components/Hero';
import About from './components/About';
import Education from './components/Education';
import Work from './components/Work';
import QuotePhoto from './components/QuotePhoto';
import Approach from './components/Approach';
import Services from './components/Services';
import Steps from './components/Steps';
import Faq from './components/Faq';
import Journal from './components/Journal';
import Trainings from './components/Trainings';
import Contacts from './components/Contacts';
import Footer from './components/Footer';
import StickyCta from './components/StickyCta';
import { useArticleSlug } from './blog/route';

// Article pages (and the rich-text renderer) load only when someone opens an article.
const ArticlePage = lazy(() => import('./components/ArticlePage'));

export default function App() {
  const [lang, setLangState] = useState('ua');
  const [menuOpen, setMenuOpen] = useState(false);
  // Booking form in the contacts section: `focusTick` bumps each time something asks to open it.
  const [form, setForm] = useState({ open: false, focusTick: 0, focusDelay: 0 });
  const articleSlug = useArticleSlug();
  const width = useViewportWidth();
  const mobile = width < MOBILE_MAX;

  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const ctaRef = useRef(null);
  const { hdrDark, sticky } = usePageMotion(rootRef, heroRef, ctaRef);

  const t = T[lang];

  const setLang = useCallback((l) => {
    setLangState(l);
    document.documentElement.lang = l === 'ua' ? 'uk' : 'en';
  }, []);

  const goTo = useCallback((id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - (id === 'contacts' ? 0 : 40),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, []);

  const site = useMemo(() => {
    const nav = t.nav.map((label, i) => ({
      label,
      id: NAV_IDS[i],
      num: pad(i + 1),
      onClick: (e) => { e.preventDefault(); goTo(NAV_IDS[i]); },
    }));
    const openForm = (focusDelay) => setForm((f) => ({ open: true, focusTick: f.focusTick + 1, focusDelay }));
    return {
      t, lang, setLang, mobile, width, nav, goTo, form, openForm,
      book: () => { goTo('contacts'); openForm(900); },
    };
  }, [t, lang, setLang, mobile, width, goTo, form]);

  return (
    <SiteContext.Provider value={site}>
      <div ref={rootRef} className="page">
        <Loader />
        <Header dark={hdrDark && !menuOpen} onOpenMenu={() => setMenuOpen(true)} />
        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

        <main>
          <Hero ref={heroRef} />
          <About />
          <Education />
          <Work />
          <QuotePhoto />
          <Approach />
          <Services />
          <Steps />
          <Faq />
          <Journal />
          <Trainings />
          <Contacts ref={ctaRef} />
        </main>

        <Footer />
        {mobile && <StickyCta visible={sticky} />}
        {articleSlug && (
          <Suspense fallback={null}>
            <ArticlePage slug={articleSlug} />
          </Suspense>
        )}
      </div>
    </SiteContext.Provider>
  );
}
