import { useSite } from '../context';
import photo from '../assets/quote-rock.webp';

export default function QuotePhoto() {
  const { t } = useSite();
  const q = t.quote;

  return (
    <section data-bg="#FAF6F0" className="quote">
      <img src={photo} alt="Яна Ніколенко серед скель" data-px="0.12" className="quote__img" loading="lazy" decoding="async" />
      <div className="quote__shade" />
      <div className="quote__text">
        <h2 data-reveal="">
          <span className="quote__h1">{q.h1}</span>
          <span className="quote__h2">{q.h2}</span>
        </h2>
        <p data-reveal="">{q.s}</p>
      </div>
    </section>
  );
}
