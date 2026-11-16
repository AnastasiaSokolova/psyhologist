import { useSite } from '../context';

export default function Header({ dark, onOpenMenu }) {
  const { t, lang, setLang, nav, book } = useSite();

  const goTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`header${dark ? ' header--dark' : ''}`}>
      <div className="header__inner">
        <a href="#top" onClick={goTop} className="logo">
          Yana <i>Nikolenko</i>
        </a>

        <nav className="header__nav">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={n.onClick}>{n.label}</a>
          ))}
        </nav>

        <div className="header__right">
          <div className="lang">
            <button onClick={() => setLang('ua')} className={lang === 'ua' ? 'is-active' : ''}>UA</button>
            <span>/</span>
            <button onClick={() => setLang('en')} className={lang === 'en' ? 'is-active' : ''}>EN</button>
          </div>
          <button className="btn btn--sm" onClick={book}>{t.book}</button>
          <button className="burger" onClick={onOpenMenu} aria-label="menu">
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
