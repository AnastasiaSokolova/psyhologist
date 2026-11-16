import { useEffect, useRef, useState } from 'react';
import { useSite } from '../context';
import { pad } from '../data';
import { prefersReducedMotion } from '../hooks/useViewport';
import banyan from '../assets/banyan.webp';

// Wide layout geometry. The stage is 100 x 60 units. The tree photo is a square
// PHOTO_W units wide, centred horizontally and vertically; labels are LABEL_W wide on each side.
// The gap between photo and text = PHOTO_L - LABEL_W (each side).
const PHOTO_W = 48;
const PHOTO_L = (100 - PHOTO_W) / 2;
const PHOTO_T = (60 - PHOTO_W) / 2;
const LABEL_W = 20;
const TREE_P = [[64, 82], [42, 66], [58, 46], [24, 32], [70, 12]]; // step points on the photo, in %
const SIDE = ['r', 'l', 'r', 'l', 'r']; // which side the label sits on
const LY = [47, 36, 24, 13, 2]; // label top, in stage units

function treePoints(list) {
  return list.slice(0, 5).map(([title, desc], i) => {
    const [px, py] = TREE_P[i];
    const X = PHOTO_L + (px * PHOTO_W) / 100;
    const Y = PHOTO_T + (py * PHOTO_W) / 100;
    const right = SIDE[i] === 'r';
    const ly = LY[i] + 1.6;
    const lx = right ? 100 - LABEL_W - 1.5 : LABEL_W + 1.5;
    const mid = (lx + X) / 2;
    return {
      n: pad(i + 1),
      title,
      desc,
      right,
      path: `M ${lx} ${ly} C ${mid} ${ly}, ${mid} ${Y}, ${X} ${Y}`,
      delay: i * 0.45,
      dot: { left: `${X}%`, top: `${(Y / 60) * 100}%` },
      label: { left: right ? `${100 - LABEL_W}%` : '0%', width: `${LABEL_W}%`, top: `${(LY[i] / 60) * 100}%` },
      photo: { left: `${px}%`, top: `${py}%` },
    };
  });
}

export default function Steps() {
  const { t, width } = useSite();
  const st = t.st;
  const wide = width >= 1100;
  const points = treePoints(st.list);

  const ref = useRef(null);
  const [treeIn, setTreeIn] = useState(() => prefersReducedMotion());
  const [hover, setHover] = useState(-1);

  useEffect(() => {
    if (treeIn || !ref.current) return undefined;
    const io = new IntersectionObserver((es) => {
      if (es[0].isIntersecting) { setTreeIn(true); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [treeIn]);

  return (
    <section id="steps" ref={ref} data-bg="#FAF6F0" className={`steps${treeIn ? ' is-in' : ''}`}>
      <div className="container">
        <h2 data-reveal="" className="title">
          <span className="title__up">{st.h1}</span>
          <span className="title__it"> {st.h2}</span>
        </h2>

        {wide ? (
          <div className="tree">
            <div
              data-mask=""
              className="tree__photo"
              style={{ left: `${PHOTO_L}%`, top: `${(PHOTO_T / 60) * 100}%`, width: `${PHOTO_W}%` }}
            >
              <img src={banyan} alt="Баньян — від коріння до крони" loading="lazy" decoding="async" />
            </div>
            <svg viewBox="0 0 100 60" preserveAspectRatio="none" fill="none" className="tree__lines">
              {points.map((p) => (
                <path
                  key={p.n}
                  d={p.path}
                  pathLength="1"
                  stroke="#5A3D2B"
                  strokeOpacity=".7"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ transitionDelay: `${p.delay}s` }}
                />
              ))}
            </svg>
            {points.map((p, i) => (
              <span
                key={p.n}
                className={`tree__dot${hover === i ? ' is-hover' : ''}`}
                style={{ ...p.dot, transitionDelay: `${p.delay + 1.1}s, 0s` }}
              />
            ))}
            {points.map((p, i) => (
              <div
                key={p.n}
                className={`tree__label${p.right ? '' : ' tree__label--left'}`}
                style={{ ...p.label, transitionDelay: `${p.delay}s` }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(-1)}
              >
                <div className="tree__num">{p.n}</div>
                <div className="tree__title">{p.title}</div>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="tree-m">
            <div data-mask="" className="tree-m__photo">
              <img src={banyan} alt="Баньян — від коріння до крони" loading="lazy" decoding="async" />
              {points.map((p) => (
                <span key={p.n} className="tree-m__pin" style={p.photo}>{p.n}</span>
              ))}
            </div>
            <div className="tree-m__list">
              {points.map((p) => (
                <div key={p.n} data-reveal="" className="tree-m__item">
                  <span className="tree-m__rail" />
                  <span className="tree-m__num">{p.n}</span>
                  <div>
                    <div className="tree-m__title">{p.title}</div>
                    <p>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
