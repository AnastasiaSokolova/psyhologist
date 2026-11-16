import { useState } from 'react';
import { useSite } from '../context';
import { WORK_MEDIA } from '../data';

const Chevron = () => (
  <svg viewBox="0 0 14 8" fill="none">
    <path d="M 1 1 L 7 7 L 13 1" stroke="#1E1C19" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Work() {
  const { t } = useSite();
  const w = t.work;
  const [open, setOpen] = useState(-1);

  return (
    <section id="work" data-bg="#FAF6F0" className="work">
      <div className="container">
        <div className="work__head">
          <div>
            <h2 data-reveal="" className="title">
              <span className="title__up">{w.h1}</span>
              <span className="title__it">&nbsp;{w.h2}</span>
            </h2>
          </div>
        </div>

        <div className="work__grid">
          {w.cards.map(([title, items], i) => {
            const isOpen = open === i;
            const toggle = () => setOpen(isOpen ? -1 : i);
            const m = WORK_MEDIA[i];
            return (
              <div key={i} data-reveal="" className={`work-card${isOpen ? ' is-open' : ''}`}>
                <img
                  src={m.img}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onClick={toggle}
                  className="work-card__img"
                  style={{ objectPosition: m.pos }}
                />
                <button onClick={toggle} aria-expanded={isOpen} className="work-card__head">
                  <span className="work-card__chev"><Chevron /></span>
                  <span className="work-card__title">{title}</span>
                </button>
                <div className="collapse collapse--fast">
                  <div>
                    <ul className="work-card__list">
                      {items.split('; ').map((it) => (
                        <li key={it}><span className="dot" /><span>{it}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
