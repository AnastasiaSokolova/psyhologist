import { useState } from 'react';
import { useSite } from '../context';

export default function Services() {
  const { t, book } = useSite();
  const sv = t.sv;
  const [rulesOpen, setRulesOpen] = useState(false);

  return (
    <section id="services" className="services">
      <div className="container">
        <h2 data-reveal="" className="title">
          <span className="title__up">{sv.h1}</span>
          <span className="title__it"> {sv.h2}</span>
        </h2>

        <div className="services__list">
          {sv.list.map(([title, price, minutes], i) => (
            <div key={i} data-reveal="" className="service">
              <h3 className="service__title">{title}</h3>
              <div className="service__price">
                <span className="service__amount">{price}</span>
                <span className="service__cur">{sv.cur}</span>
              </div>
              <div className="service__rows">
                {[
                  [sv.durL, `${minutes} ${sv.min}`],
                  [sv.fmtL, sv.fmt],
                  [sv.freqL, sv.freq],
                ].map(([k, v]) => (
                  <div key={k} className="service__row">
                    <span>{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn--md service__btn" onClick={book}>{sv.btn}</button>
            </div>
          ))}
        </div>

        <div className="services__after">
          <p data-reveal="" className="services__note">{sv.note}</p>
          <div data-reveal="" className={`rules${rulesOpen ? ' is-open' : ''}`}>
            <button onClick={() => setRulesOpen(!rulesOpen)} aria-expanded={rulesOpen} className="rules__toggle">
              <span className="rules__label">{sv.rulesT}</span>
              <span className="plus">+</span>
            </button>
            <div className="collapse">
              <div><p className="rules__text">{sv.rules}</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
