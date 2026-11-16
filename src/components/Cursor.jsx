import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../hooks/useViewport';

/** Soft trailing dot that replaces the cursor on mouse devices; grows over interactive elements. */
export default function Cursor() {
  const ref = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine || prefersReducedMotion()) return undefined;

    const cur = ref.current;
    const html = document.documentElement;
    html.setAttribute('data-cc', '');
    let tx = -100, ty = -100, cx = -100, cy = -100, raf = 0;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      cur.style.opacity = 1;
      const hot = e.target.closest && e.target.closest('a,button,[data-hot],input,textarea');
      const s = hot ? 30 : 9;
      cur.style.width = cur.style.height = `${s}px`;
      cur.style.margin = `${-s / 2}px 0 0 ${-s / 2}px`;
    };
    const onLeave = () => { cur.style.opacity = 0; };
    const loop = () => {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      cur.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    loop();

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
      html.removeAttribute('data-cc');
    };
  }, []);

  return <div ref={ref} className="cursor" aria-hidden="true" />;
}
