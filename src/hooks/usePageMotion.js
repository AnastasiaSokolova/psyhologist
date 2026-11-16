import { useEffect, useState } from 'react';
import { prefersReducedMotion } from './useViewport';

/**
 * Page-level scroll effects, driven by data attributes in the markup:
 *
 *  - [data-reveal] / [data-mask]  fade + un-blur in when scrolled into view
 *                                 (initial state lives in CSS; we add [data-shown])
 *  - [data-px="0.04"]             parallax drift + slight zoom
 *  - [data-bg="#hex"]             root background follows the section in the middle of the screen
 *
 * Also returns header/sticky-CTA flags derived from the hero and contacts positions.
 */
export function usePageMotion(rootRef, heroRef, ctaRef) {
  const [flags, setFlags] = useState({ hdrDark: true, sticky: false });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reduced = prefersReducedMotion();

    // --- reveal on scroll -------------------------------------------------
    const show = (el) => el.setAttribute('data-shown', '');
    const revealIO = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target);
            revealIO.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    const maskIO = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target);
            maskIO.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -6% 0px', threshold: 0 }
    );

    let pxEls = [];
    let bgEls = [];
    // Tracked per effect run (not on the DOM), so a re-run — e.g. React StrictMode in dev — re-observes everything.
    const seen = new WeakSet();
    const scan = () => {
      root.querySelectorAll('[data-reveal]:not([data-shown])').forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        if (reduced) show(el);
        else revealIO.observe(el);
      });
      root.querySelectorAll('[data-mask]:not([data-shown])').forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        if (reduced) show(el);
        else maskIO.observe(el);
      });
      pxEls = [...root.querySelectorAll('[data-px]')];
      bgEls = [...root.querySelectorAll('[data-bg]')];
    };
    scan();
    // Elements rendered later (language switch, journal filter, accordions) get picked up too.
    const mo = new MutationObserver(scan);
    mo.observe(root, { childList: true, subtree: true });

    // --- scroll-driven effects -------------------------------------------
    const tick = () => {
      const vh = window.innerHeight;
      if (!reduced) {
        for (const el of pxEls) {
          const r = el.getBoundingClientRect();
          if (r.bottom < -100 || r.top > vh + 100) continue;
          const f = +el.getAttribute('data-px');
          const y = (r.top + r.height / 2 - vh / 2) * -f;
          el.style.transform = `translate3d(0,${y.toFixed(1)}px,0) scale(${1 + f * 2.2})`;
        }
      }
      for (const s of bgEls) {
        const r = s.getBoundingClientRect();
        if (r.top < vh * 0.5 && r.bottom > vh * 0.5) {
          root.style.backgroundColor = s.getAttribute('data-bg');
          break;
        }
      }
      const hero = heroRef.current;
      const cta = ctaRef.current;
      const hdrDark = hero ? hero.getBoundingClientRect().bottom > 120 : false;
      const sticky = window.scrollY > vh * 0.85 && (!cta || cta.getBoundingClientRect().top > vh * 0.9);
      setFlags((f) => (f.hdrDark === hdrDark && f.sticky === sticky ? f : { hdrDark, sticky }));
    };

    let frame = 0;
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; tick(); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    tick();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
      mo.disconnect();
      revealIO.disconnect();
      maskIO.disconnect();
    };
  }, [rootRef, heroRef, ctaRef]);

  return flags;
}
