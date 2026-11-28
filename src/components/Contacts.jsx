import { useEffect, useRef, useState } from 'react';
import { useSite } from '../context';
import photo from '../assets/ya1.webp';
import { sendForm } from '../sendForm';

const EMPTY = { name: '', phone: '', mail: '', text: '' };
const FIELDS = ['name', 'phone', 'mail'];
const MAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Returns the i18n key of the error for a field, or '' when the value is fine.
function check(key, value) {
  const v = value.trim();
  if (key === 'name') return v.length < 2 ? 'eName' : '';
  if (key === 'phone') {
    if (!v) return 'ePhone';
    const digits = v.replace(/\D/g, '');
    if (!/^\+?[\d\s()-]+$/.test(v) || digits.length < 10 || digits.length > 15) return 'ePhoneBad';
    return '';
  }
  if (key === 'mail') return v && !MAIL_RE.test(v) ? 'eMailBad' : ''; // optional, but must be valid if given
  return '';
}

export default function Contacts({ ref }) {
  const { t, form, openForm } = useSite();
  const c = t.cta;
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState(false);
  const nameRef = useRef(null);
  const formRef = useRef(null);

  // Focus the name field whenever someone opens the form (header / hero / sticky "book" buttons).
  useEffect(() => {
    if (!form.focusTick) return undefined;
    const id = setTimeout(() => nameRef.current?.focus({ preventScroll: true }), form.focusDelay);
    return () => clearTimeout(id);
  }, [form.focusTick, form.focusDelay]);

  const set = (key) => (e) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [key]: value }));
    // Once a field has been left (or the form submitted), re-check it live so the error clears as soon as it's fixed.
    if (FIELDS.includes(key) && (touched[key] || submitted)) {
      setErrors((er) => ({ ...er, [key]: check(key, value) }));
    }
  };

  const blur = (key) => () => {
    // Don't nag about an empty field the person just tabbed through; that's reported on submit.
    if (!values[key].trim() && !submitted) return;
    setTouched((tc) => ({ ...tc, [key]: true }));
    setErrors((er) => ({ ...er, [key]: check(key, values[key]) }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    if (e.target.elements._honey?.value) return; // bot filled the hidden field
    setSubmitted(true);
    const next = Object.fromEntries(FIELDS.map((k) => [k, check(k, values[k])]));
    setErrors(next);
    const firstBad = FIELDS.find((k) => next[k]);
    if (firstBad) {
      formRef.current?.querySelector(`[name="${firstBad}"]`)?.focus();
      return;
    }
    const mail = values.mail.trim();
    setSending(true);
    setSendErr(false);
    try {
      await sendForm(
        `Новий запис з сайту — ${values.name.trim()}`,
        {
          "Ім'я": values.name.trim(),
          'Телефон': values.phone.trim(),
          'Пошта': mail || '—',
          'Запит': values.text.trim() || '—',
        },
        mail || undefined
      );
      setSent(true);
    } catch {
      setSendErr(true);
    } finally {
      setSending(false);
    }
  };

  const fieldProps = (key) => ({
    name: key,
    value: values[key],
    onChange: set(key),
    onBlur: blur(key),
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `cf-${key}-err` : undefined,
  });
  const fieldErr = (key) =>
    errors[key] ? <em id={`cf-${key}-err`} className="book-form__ferr" role="alert">{c[errors[key]]}</em> : null;
  const hasErrors = submitted && FIELDS.some((k) => errors[k]);

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
            <form ref={formRef} onSubmit={submit} noValidate className="book-form">
              <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp" />
              <label className="book-form__full">
                <span>{c.fName} *</span>
                <input ref={nameRef} type="text" autoComplete="name" maxLength={80} {...fieldProps('name')} />
                {fieldErr('name')}
              </label>
              <label className="book-form__full">
                <span>{c.fPhone} *</span>
                <input type="tel" inputMode="tel" autoComplete="tel" maxLength={24} placeholder={c.fPhonePh} {...fieldProps('phone')} />
                {fieldErr('phone')}
              </label>
              <label className="book-form__full">
                <span>{c.fMail}</span>
                <input type="email" inputMode="email" autoComplete="email" maxLength={120} {...fieldProps('mail')} />
                {fieldErr('mail')}
              </label>
              <label className="book-form__full">
                <span>{c.fText}</span>
                <textarea rows="3" name="text" maxLength={2000} value={values.text} onChange={set('text')} placeholder={c.fTextPh} />
              </label>
              <div className="book-form__full book-form__actions">
                {hasErrors && <p className="book-form__err">{c.fErr}</p>}
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
