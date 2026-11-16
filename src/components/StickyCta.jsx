import { useSite } from '../context';

/** Mobile-only "book" pill that slides in after the hero and hides near the contacts section. */
export default function StickyCta({ visible }) {
  const { t, book } = useSite();
  return (
    <div className={`sticky-cta${visible ? ' is-visible' : ''}`}>
      <button onClick={book} tabIndex={visible ? 0 : -1}>
        <svg viewBox="0 0 40 20" fill="none">
          <path d="M 1 14 C 10 14, 16 4, 22 6 C 28 8, 20 16, 16 12 C 12 8, 26 4, 39 8" stroke="#6E665B" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        {t.hero.cta1}
      </button>
    </div>
  );
}
