import { useEffect, useRef, useState } from 'react';
import { useSite } from '../context';
import photo from '../assets/ya1.webp';
import { sendForm } from '../sendForm';

const EMPTY = { name: '', msg: '', mail: '', text: '' };

export default function Contacts({ ref }) {
  const { t, form, openForm } = useSite();
  const c = t.cta;
  const [values, setValues] = useState(EMPTY);
  const [err, setErr] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState(false);
  const nameRef = useRef(null);

  // Focus the name field whenever someone opens the form (header / hero / sticky "book" buttons).
  useEffect(() => {
    if (!form.focusTick) return undefined;
    const id = setTimeout(() => nameRef.current?.focus({ preventScroll: true }), form.focusDelay);
    return () => clearTimeout(id);
  }, [form.focusTick, form.focusDelay]);

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (key !== 'text') setErr(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    if (e.target.elements._honey?.value) return; // bot filled the hidden field
    const mailOk = /.+@.+\..+/.test(values.mail);
    if (!values.name.trim() || !(mailOk || values.msg.trim())) {
      setErr(true);
      return;
    }
    setSending(true);
    setSendErr(false);
    try {
      await sendForm(
        `Новий запис з сайту — ${values.name.trim()}`,
        {
          "Ім'я": values.name.trim(),
          'Месенджер': values.msg.trim() || '—',
          'Пошта': values.mail.trim() || '—',
          'Запит': values.text.trim() || '—',
        },
        mailOk ? values.mail.trim() : undefined
      );
      setSent(true);
    } catch {
      setSendErr(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contacts" ref={ref} data-bg="#EFE6DA" className="contacts">
      <div className="grain grain--soft" />
      <div className="contacts__photo">
        <img src={photo} alt="Яна Ніколенко" loading="lazy" decoding="async" />
      </div>
      <div className="grain grain--softer" />

      <div className="container contacts__inner">
        <div className="contacts__text">
          <h2 data-reveal="" className="contacts__title">
            <span>{c.h1}</span>
            <span className="contacts__title-it">{c.h2}</span>
          </h2>
          <div data-reveal="" className="contacts__note">
            <p>{c.note}</p>
          </div>

          {sent ? (
            <div className="contacts__done">
              <div>{c.okH}</div>
              <p>{c.okP}</p>
            </div>
          ) : form.open ? (
            <form onSubmit={submit} noValidate className="book-form">
              <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp" />
              <label>
                <span>{c.fName}</span>
                <input ref={nameRef} type="text" value={values.name} onChange={set('name')} autoComplete="name" />
              </label>
              <label>
                <span>{c.fMsg}</span>
                <input type="text" value={values.msg} onChange={set('msg')} placeholder={c.fMsgPh} />
              </label>
              <label className="book-form__full">
                <span>{c.fMail}</span>
                <input type="email" value={values.mail} onChange={set('mail')} autoComplete="email" />
              </label>
              <label className="book-form__full">
                <span>{c.fText}</span>
                <textarea rows="3" value={values.text} onChange={set('text')} placeholder={c.fTextPh} />
              </label>
              <div className="book-form__full book-form__actions">
                {err && <p className="book-form__err">{c.fErr}</p>}
                {sendErr && <p className="book-form__err">{c.sendErr}</p>}
                <button type="submit" className="btn-dark" disabled={sending}>{sending ? c.sending : c.send}</button>
              </div>
            </form>
          ) : (
            <div data-reveal="" className="contacts__open">
              <button type="button" className="btn-dark" onClick={() => openForm(150)}>{c.btn}</button>
            </div>
          )}

          <p data-reveal="" className="contacts__meta">{c.meta}</p>
        </div>
      </div>
    </section>
  );
}
