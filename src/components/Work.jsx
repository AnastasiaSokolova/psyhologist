import { useEffect, useState } from 'react';
import { useSite } from '../context';
import { WORK_MEDIA } from '../data';

const Plus = () => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M 7 1 V 13 M 1 7 H 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export default function Work() {
  const { t } = useSite();
  const w = t.work;
  const [open, setOpen] = useState(-1);
  // On a computer with a mouse the list opens on hover; on touch screens it opens on tap.
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

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
            // A mouse click on a hover device would just close the card under the cursor, so only
            // keyboard activation (detail === 0) toggles there.
            const toggle = (e) => {
              if (canHover && e.detail > 0) return;
              setOpen(isOpen ? -1 : i);
            };
            const hover = canHover
              ? { onMouseEnter: () => setOpen(i), onMouseLeave: () => setOpen((o) => (o === i ? -1 : o)) }
              : {};
            const m = WORK_MEDIA[i];
            return (
              <div key={i} data-reveal="" className={`work-card${isOpen ? ' is-open' : ''}`} {...hover}>
                <img
                  src={m.img}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="work-card__img"
                  style={{ objectPosition: m.pos }}
                />
                <div className="work-card__shade" />
                <button
                  type="button"
                  onClick={toggle}
                  aria-expanded={isOpen}
                  aria-controls={`work-list-${i}`}
                  aria-label={title}
                  className="work-card__hit"
                />
                <span className="work-card__plus" aria-hidden="true"><Plus /></span>
                <div className="work-card__body">
                  <h3 className="work-card__title">{title}</h3>
                  <div className="collapse collapse--fast" id={`work-list-${i}`}>
                    <div>
                      <ul className="work-card__list">
                        {items.split('; ').map((it) => (
                          <li key={it}><span className="dot" /><span>{it}</span></li>
                        ))}
                      </ul>
                    </div>
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
