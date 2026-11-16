import { useSite } from '../context';
import { delay } from './Hero';

export default function Approach() {
  const { t } = useSite();
  const ap = t.ap;

  return (
    <section id="approach" data-bg="#FAF6F0" className="approach">
      <div className="approach__fade" />
      <div className="container approach__inner">
        <div className="approach__head">
          <h2 data-reveal="" className="title approach__title">
            <span className="title__up">{ap.h1}</span>
            <span className="title__it"> {ap.h2}</span>
          </h2>
        </div>

        <div className="approach__grid">
          {ap.tabs.map(([title, , body], i) => (
            <article key={i} data-reveal="" style={delay(i * 200)} className="approach__item">
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>

        <div data-reveal="" className="approach__foot">
          <svg viewBox="0 0 40 20" fill="none">
            <path d="M 1 14 C 10 14, 16 4, 22 6 C 28 8, 20 16, 16 12 C 12 8, 26 4, 39 8" stroke="#5A3D2B" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span>{ap.foot}</span>
        </div>
      </div>
    </section>
  );
}
