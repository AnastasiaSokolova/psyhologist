import { useState } from 'react';
import { useSite } from '../context';
import { delay } from './Hero';

export default function Education() {
  const { t, mobile } = useSite();
  const a = t.about;
  const [active, setActive] = useState(4);

  return (
    <section id="education" data-bg="#F5F1EA" className="edu">
      <div className="container edu__grid">
        <div className="edu__head">
          <h2 data-reveal="" className="title">
            <span className="title__up">{a.eduT1}</span>
            <span className="title__it"> {a.eduT2}</span>
          </h2>
        </div>

        <ol className="edu__list">
          {a.eduList.map(([years, title, school], i) => (
            <li
              key={i}
              data-reveal=""
              style={delay(i * 110)}
              className={`edu__row${active === i ? ' is-active' : ''}`}
              onMouseEnter={() => { if (!mobile) setActive(i); }}
              onClick={() => setActive(i)}
            >
              <span className="edu__line" />
              <span className="edu__years">{years}</span>
              <div className="edu__body">
                <div className="edu__name">{title}</div>
                <div className="edu__school">{school}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
