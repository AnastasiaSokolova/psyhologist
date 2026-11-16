import { useSite } from '../context';

export default function MobileMenu({ open, onClose }) {
  const { t, nav } = useSite();

  return (
    <div className={`menu${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" fill="none" className="menu__line">
        <path
          d="M 420 60 C 300 120, 360 220, 260 260 C 180 292, 150 230, 196 214 C 244 198, 262 290, 210 380 C 150 480, 40 470, 60 580 C 76 670, 220 640, 240 720 C 252 770, 200 800, 160 840"
          stroke="rgba(255,255,255,.9)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      <div className="menu__top">
        <span className="logo">Yana <i>Nikolenko</i></span>
        <button className="menu__close" onClick={onClose}>{t.close}</button>
      </div>
      <nav className="menu__nav">
        {nav.map((n) => (
          <a key={n.id} href={`#${n.id}`} onClick={n.onClick}>
            <span className="menu__num">{n.num}</span>
            <span className="menu__label">{n.label}</span>
          </a>
        ))}
      </nav>
      <div className="menu__meta">{t.hero.meta}</div>
    </div>
  );
}
