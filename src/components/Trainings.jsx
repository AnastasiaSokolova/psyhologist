import { useState } from 'react';
import { useSite } from '../context';
import chair from '../assets/IMG_4374.webp';
import { sendForm } from '../sendForm';

export default function Trainings() {
  const { t } = useSite();
  const tr = t.tr;
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    if (e.target.elements._honey?.value) return;
    if (!/.+@.+\..+/.test(email)) {
      setErr(true);
      return;
    }
    setSending(true);
    setSendErr(false);
    try {
      await sendForm('Тренінги: нова підписка з сайту', { 'Пошта': email.trim() }, email.trim());
      setSent(true);
    } catch {
      setSendErr(true);
    } finally {
      setSending(false);
    }
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
                <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErr(false); setSendErr(false); }}
                  placeholder={tr.ph}
                  aria-label={tr.ph}
                />
                <button type="submit" className="btn btn--md" disabled={sending}>{tr.btn}</button>
              </form>
              {err && <p className="trainings__err">{tr.err}</p>}
              {sendErr && <p className="trainings__err">{tr.sendErr}</p>}
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
