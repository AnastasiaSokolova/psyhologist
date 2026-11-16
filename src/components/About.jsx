import { useSite } from '../context';
import { delay } from './Hero';
import studio from '../assets/ya2.webp';
import bw from '../assets/IMG_0177.webp';

export default function About() {
  const { t, mobile } = useSite();
  const a = t.about;

  return (
    <section id="about" data-bg="#FAF6F0" className="about">
      <div className="container about__grid">
        <figure className="about__figure">
          <div data-mask="" className="about__main">
            <img src={studio} alt="Яна Ніколенко в студії" loading="lazy" decoding="async" />
          </div>
          {!mobile && (
            <div data-mask="" style={delay(300)} className="about__small">
              <img src={bw} alt="" loading="lazy" decoding="async" />
            </div>
          )}
        </figure>

        <div className="about__text">
          <h2 data-reveal="" className="about__name">
            {a.n1} <span>{a.n2}</span>
          </h2>
          <div data-reveal="" className="about__roles">{a.roles}</div>
          <blockquote data-reveal="" className="about__quote">«{a.quote}»</blockquote>
          <div className="about__paras">
            {a.p.map((p, i) => (
              <p key={i} data-reveal="">{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
