import { useState } from 'react';
import { useSite } from '../context';

export default function Faq() {
  const { t } = useSite();
  const fq = t.fq;
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" data-bg="#FAF6F0" className="faq">
      <div className="container faq__inner">
        <div>
          <h2 data-reveal="" className="title faq__title">
            <span className="title__up">{fq.h1}</span>
            <span className="title__it"> {fq.h2}</span>
          </h2>
        </div>

        <div className="faq__list">
          {fq.list.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`faq__item${isOpen ? ' is-open' : ''}`}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} className="faq__q">
                  <span>{q}</span>
                  <span className="plus plus--muted">+</span>
                </button>
                <div className="collapse">
                  <div><p className="faq__a">{a}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
