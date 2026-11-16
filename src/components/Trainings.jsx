import { useState } from 'react';
import { useSite } from '../context';
import chair from '../assets/IMG_4374.webp';

export default function Trainings() {
  const { t } = useSite();
  const tr = t.tr;
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    // TODO: send the email to a real backend / mailing list service.
    if (/.+@.+\..+/.test(email)) setSent(true);
    else setErr(true);
  };

  return (
    <section id="trainings" data-bg="#FAF6F0" className="trainings">
      <div className="container trainings__grid">
        <div className="trainings__text">
          <h2 data-reveal="" className="trainings__title">{tr.h}</h2>
          <p data-reveal="" className="trainings__p">{tr.p}</p>

          {sent ? (
            <p className="trainings__ok">{tr.ok}</p>
          ) : (
            <>
              <form onSubmit={submit} className="trainings__form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErr(false); }}
                  placeholder={tr.ph}
                  aria-label={tr.ph}
                />
                <button type="submit" className="btn btn--md">{tr.btn}</button>
              </form>
              {err && <p className="trainings__err">{tr.err}</p>}
            </>
          )}
        </div>

        <div data-mask="" className="trainings__img">
          <img src={chair} alt="Яна Ніколенко у кріслі" loading="lazy" decoding="async" />
          <div />
        </div>
      </div>
    </section>
  );
}
