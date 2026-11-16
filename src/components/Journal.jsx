import { useState } from 'react';
import { useSite } from '../context';
import { POST_IMG } from '../data';

export default function Journal() {
  const { t } = useSite();
  const jr = t.jr;
  const [filter, setFilter] = useState(0);

  const posts = jr.posts
    .map(([cat, title, desc, date], i) => ({ cat, title, desc, date, img: POST_IMG[i] }))
    .filter((p) => filter === 0 || p.cat === filter);

  return (
    <section id="journal" data-bg="#FAF6F0" className="journal">
      <div className="container">
        <h2 data-reveal="" className="title">
          <span className="title__up">{jr.h1}</span>
          <span className="title__it"> {jr.h2}</span>
        </h2>

        <div data-reveal="" className="journal__filters bleed">
          {jr.filters.map((f, i) => (
            <button key={f} onClick={() => setFilter(i)} className={`chip${filter === i ? ' is-active' : ''}`}>{f}</button>
          ))}
        </div>

        <div className="journal__posts bleed">
          {posts.map((p) => (
            <a key={p.title} href="#journal" className="post">
              <div className="post__cover">
                <img src={p.img} alt="" loading="lazy" decoding="async" className="post__img" />
                <span className="post__cat">{jr.filters[p.cat]}</span>
              </div>
              <div className="post__date">{p.date}</div>
              <h3 className="post__title">{p.title}</h3>
              <p className="post__desc">{p.desc}</p>
              <span className="post__more">{jr.read} →</span>
            </a>
          ))}
          {posts.length === 0 && <div className="journal__empty">{jr.empty}</div>}
        </div>
      </div>
    </section>
  );
}
