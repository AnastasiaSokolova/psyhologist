import { useSite } from '../context';

export default function Footer() {
  const { t, nav } = useSite();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__top">
          <div className="footer__logo">Yana <i>Nikolenko</i></div>
          <nav className="footer__nav">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={n.onClick}>{n.label}</a>
            ))}
          </nav>
          <div className="footer__social">
            <a href="https://www.instagram.com/yananikolenko__/" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© 2026 {t.ft.name}</span>
        </div>
      </div>
    </footer>
  );
}
