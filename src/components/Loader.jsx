import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../hooks/useViewport';

/** Intro screen: a single line draws itself, the name fades in, then everything dissolves. */
export default function Loader() {
  const [gone, setGone] = useState(() => prefersReducedMotion());
  const boxRef = useRef(null);
  const pathRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    if (gone) return undefined;
    const box = boxRef.current;
    const path = pathRef.current;
    const name = nameRef.current;
    const timers = [];
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      const fade = box.animate(
        [
          { backgroundColor: 'rgba(250,246,240,1)', backdropFilter: 'blur(18px)', opacity: 1 },
          { backgroundColor: 'rgba(250,246,240,.4)', backdropFilter: 'blur(8px)', opacity: 0.8, offset: 0.5 },
          { backgroundColor: 'rgba(250,246,240,0)', backdropFilter: 'blur(0px)', opacity: 0 },
        ],
        { duration: 1600, easing: 'ease-out', fill: 'forwards' }
      );
      fade.onfinish = () => setGone(true);
    };

    const draw = path.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
      duration: 1000, delay: 200, easing: 'cubic-bezier(.45,.05,.25,1)', fill: 'forwards',
    });
    name.animate([{ opacity: 0, filter: 'blur(8px)' }, { opacity: 1, filter: 'blur(0px)' }], {
      duration: 900, delay: 500, easing: 'ease-out', fill: 'forwards',
    });
    draw.onfinish = () => timers.push(setTimeout(finish, 250));
    timers.push(setTimeout(finish, 3500));
    timers.push(setTimeout(() => setGone(true), 5600)); // safety net

    return () => timers.forEach(clearTimeout);
  }, [gone]);

  if (gone) return null;

  return (
    <div ref={boxRef} className="loader" aria-hidden="true">
      <svg viewBox="0 0 200 120" className="loader__svg" fill="none">
        <path
          ref={pathRef}
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset="1"
          d="M 6 86 C 44 88, 70 76, 94 54 C 118 30, 128 10, 110 8 C 90 6, 82 42, 98 64 C 114 86, 150 88, 194 70"
          stroke="#6E665B"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
      <div ref={nameRef} className="loader__name">Yana Nikolenko</div>
    </div>
  );
}
