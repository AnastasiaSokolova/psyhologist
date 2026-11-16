import { useSite } from '../context';
import portrait from '../assets/yana.webp';

/** Reveal delay helper for [data-reveal] / [data-mask] elements. */
export const delay = (ms) => ({ '--d': `${ms}ms` });

export default function Hero({ ref }) {
  const { t, book, goTo } = useSite();
  const h = t.hero;

  return (
    <section id="top" ref={ref} data-bg="#FAF6F0" className="hero">
      <div className="hero__portrait" data-mask="" data-slow="" style={delay(600)}>
        <img src={portrait} alt="Яна Ніколенко" data-px="0.04" fetchPriority="high" />
      </div>
      <div className="grain" />
      <div className="hero__fade" />

      <div className="hero__inner">
        <div className="hero__text">
          <div data-reveal="" style={delay(1300)} className="hero__roles">{h.roles}</div>
          <h1 data-reveal="" style={delay(1450)} className="hero__name">{h.name}</h1>
          <div data-reveal="" style={delay(1600)} className="hero__tag">{h.tag}</div>
          <p data-reveal="" style={delay(1750)} className="hero__sub">{h.sub}</p>
          <div data-reveal="" style={delay(1900)} className="hero__btns">
            <button className="btn btn--lg" onClick={book}>{h.cta1}</button>
            <button className="btn btn--lg" onClick={() => goTo('about')}>{h.cta2}</button>
          </div>
          <div data-reveal="" style={delay(2050)} className="hero__meta">{h.meta}</div>
        </div>
        {/* Keeps room for the portrait (sits above the text on mobile thanks to wrap-reverse). */}
        <div className="hero__spacer" />
      </div>
    </section>
  );
}
