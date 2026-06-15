import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { LocaleLink as Link } from '../components/LocaleLink';
import Seo from '../components/Seo';
import PageHero from '../components/redesign/PageHero';
import { Reveal } from '../components/motion';
import { trackLead } from '../lib/analytics';
import { getUtmPayload } from '../lib/utm';

const MEDIA = '/uploads/media';
const EASE = [0.22, 1, 0.36, 1];

const RequestOfferPage = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', destination: '', travelDate: '',
    returnDate: '', numberOfPeople: '', budget: '', preferences: [], additionalInfo: '',
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formOptions, setFormOptions] = useState(null);
  const [step, setStep] = useState(0);

  // Prefill from URL (?destination, budget, persons, days, interests)
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const destination = p.get('destination'); const budget = p.get('budget');
    const persons = p.get('persons'); const days = p.get('days'); const interests = p.get('interests');
    if (destination || budget || persons || days || interests) {
      setFormData((prev) => ({
        ...prev,
        ...(destination ? { destination } : {}),
        ...(budget ? { budget } : {}),
        ...(persons ? { numberOfPeople: persons } : {}),
        ...(interests ? { additionalInfo: `İlgilenilen aktiviteler: ${interests.split(',').join(', ')}${days ? `\nGezi süresi: ${days} gün` : ''}` } : (days ? { additionalInfo: `Gezi süresi: ${days} gün` } : {})),
      }));
    }
  }, [location.search]);

  useEffect(() => {
    fetch('/data/form-options.json').then((r) => (r.ok ? r.json() : null)).then(setFormOptions).catch(() => {});
  }, []);

  // Preference chips, from admin form-options if present, else a sensible default.
  const prefOptions = useMemo(() => {
    if (formOptions) {
      const grp = formOptions.preferences || formOptions.tercihler || formOptions.interests || Object.values(formOptions).find((v) => Array.isArray(v));
      if (Array.isArray(grp) && grp.length) return grp.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
    }
    return [
      { value: 'culture', label: t('offer.prefCulture', 'Kültür & Tarih') },
      { value: 'nature', label: t('offer.prefNature', 'Doğa') },
      { value: 'gastronomy', label: t('offer.prefFood', 'Gastronomi') },
      { value: 'shopping', label: t('offer.prefShopping', 'Alışveriş') },
      { value: 'relax', label: t('offer.prefRelax', 'Dinlenme') },
      { value: 'family', label: t('offer.prefFamily', 'Aile Dostu') },
    ];
  }, [formOptions, t]);

  const set = (name, value) => {
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };
  const togglePref = (value) => setFormData((p) => ({
    ...p, preferences: p.preferences.includes(value) ? p.preferences.filter((x) => x !== value) : [...p.preferences, value],
  }));

  const STEPS = [
    { key: 'where', label: t('offer.stepWhere', 'Nereye') },
    { key: 'when', label: t('offer.stepWhen', 'Ne Zaman') },
    { key: 'how', label: t('offer.stepHow', 'Nasıl') },
    { key: 'contact', label: t('offer.stepContact', 'İletişim') },
  ];

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!formData.destination.trim()) e.destination = t('offer.errors.destinationRequired', 'Gidilecek yer zorunludur');
      if (!formData.numberOfPeople.trim()) e.numberOfPeople = t('offer.errors.numberOfPeopleRequired', 'Kişi sayısı zorunludur');
      else if (isNaN(formData.numberOfPeople) || parseInt(formData.numberOfPeople, 10) < 1) e.numberOfPeople = t('offer.errors.numberOfPeopleInvalid', 'Geçerli bir kişi sayısı giriniz');
    }
    if (s === 1 && formData.budget.trim() && (isNaN(formData.budget) || parseInt(formData.budget, 10) < 0)) e.budget = t('offer.errors.budgetInvalid', 'Geçerli bir bütçe giriniz');
    if (s === 3) {
      if (!formData.fullName.trim()) e.fullName = t('offer.errors.nameRequired', 'Ad Soyad zorunludur');
      if (!formData.email.trim() && !formData.phone.trim()) {
        e.email = t('offer.errors.contactRequired', 'E-posta veya telefon numarasından en az biri zorunludur');
        e.phone = e.email;
      } else {
        if (formData.email.trim() && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) e.email = t('offer.errors.emailInvalid', 'Geçerli bir e-posta adresi giriniz');
        if (formData.phone.trim() && !/^(\+90|0)?\s*([0-9]{3})\s*([0-9]{3})\s*([0-9]{2})\s*([0-9]{2})$/.test(formData.phone)) e.phone = t('offer.errors.phoneInvalid', 'Geçerli bir telefon numarası giriniz');
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setSubmitStatus('submitting');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify({
          kind: 'OFFER', name: formData.fullName, email: formData.email, phone: formData.phone || undefined,
          subject: `Teklif: ${formData.destination || 'Belirsiz destinasyon'}`,
          message: formData.additionalInfo || undefined,
          meta: {
            destination: formData.destination, travelDate: formData.travelDate, returnDate: formData.returnDate,
            numberOfPeople: formData.numberOfPeople, budget: formData.budget, preferences: formData.preferences, utm: getUtmPayload(),
          },
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      trackLead({ kind: 'OFFER', tour: formData.destination, currency: 'TRY' }, { em: formData.email, ph: formData.phone });
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 4000);
    }
  };

  const field = 'w-full bg-transparent border-b border-[var(--ds-line-strong)] py-3 text-[var(--ds-text)] text-lg placeholder:text-[var(--ds-text-muted)] focus:outline-none focus:border-[var(--ds-gold)] transition-colors';

  return (
    <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
      <Seo title={t('offer.pageTitle', 'Teklif Al - Endülüs Travel')} description={t('offer.metaDescription', '')} />

      <PageHero
        video={`${MEDIA}/desert.mp4`} poster={`${MEDIA}/desert.jpg`}
        eyebrow={t('offer.heroEyebrow', 'Rota Pusulası')}
        title={t('offer.heroTitle', 'Hayalindeki rotayı tasarla')}
        subtitle={t('offer.heroSubtitle', 'Birkaç adımda yolculuğunu anlat; uzman ekibimiz 24 saat içinde sana özel, ücretsiz teklifini hazırlasın.')}
        breadcrumb={[{ to: '/', label: t('navigation.home', 'Ana Sayfa') }, { label: t('offer.heroEyebrow', 'Rota Pusulası') }]}
        minH="62svh"
      />

      <section className="py-16 md:py-24">
        <div className="ds-container max-w-3xl">
          {submitStatus === 'success' ? (
            <Reveal>
              <div className="ds-glass rounded-3xl p-10 md:p-14 text-center">
                <div className="w-16 h-16 rounded-full grid place-items-center mx-auto mb-6" style={{ background: 'var(--ds-grad-gold)' }}>
                  <svg className="w-8 h-8 text-[var(--ds-on-gold)]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="ds-display text-3xl text-[var(--ds-text)]">{t('offer.success.title', 'Talebiniz Alındı')}</h2>
                <p className="ds-lead mt-4">{t('offer.success.message', 'Teklif formunuz başarıyla gönderildi. Uzman ekibimiz en kısa sürede sizinle iletişime geçecek.')}</p>
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <Link to="/turlar" className="ds-btn-ghost">{t('offer.successTours', 'Turları Keşfet')}</Link>
                  <Link to="/" className="ds-btn">{t('offer.successHome', 'Ana Sayfa')}</Link>
                </div>
              </div>
            </Reveal>
          ) : (
            <div className="ds-glass rounded-3xl p-7 md:p-12">
              {/* Compass progress */}
              <div className="flex items-center justify-between mb-10">
                {STEPS.map((s, i) => (
                  <div key={s.key} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-9 h-9 rounded-full grid place-items-center text-sm font-semibold transition-all duration-500 ${i <= step ? 'text-[var(--ds-on-gold)]' : 'text-[var(--ds-text-muted)] border border-[var(--ds-line-strong)]'}`} style={i <= step ? { background: 'var(--ds-grad-gold)' } : undefined}>
                        {i < step ? '✓' : i + 1}
                      </div>
                      <span className={`text-[0.65rem] uppercase tracking-wider ${i === step ? 'text-[var(--ds-gold-bright)]' : 'text-[var(--ds-text-muted)]'}`}>{s.label}</span>
                    </div>
                    {i < STEPS.length - 1 && <div className="flex-1 h-px mx-2 mb-5" style={{ background: i < step ? 'var(--ds-grad-gold)' : 'var(--ds-line)' }} />}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5, ease: EASE }}>
                  {step === 0 && (
                    <div className="space-y-8">
                      <h3 className="ds-display text-2xl text-[var(--ds-text)]">{t('offer.qWhere', 'Nereye gitmek istersiniz?')}</h3>
                      <div>
                        <input className={field} placeholder={t('offer.placeholders.destination', 'Örn. Mısır, Fas, Özbekistan...')} value={formData.destination} onChange={(e) => set('destination', e.target.value)} />
                        {errors.destination && <p className="text-[var(--ds-terracotta)] text-sm mt-2">{errors.destination}</p>}
                      </div>
                      <div>
                        <label className="ds-eyebrow">{t('offer.fields.numberOfPeople', 'Kişi Sayısı')}</label>
                        <input type="number" min="1" className={`${field} mt-2`} placeholder={t('offer.placeholders.numberOfPeople', 'Kaç kişi?')} value={formData.numberOfPeople} onChange={(e) => set('numberOfPeople', e.target.value)} />
                        {errors.numberOfPeople && <p className="text-[var(--ds-terracotta)] text-sm mt-2">{errors.numberOfPeople}</p>}
                      </div>
                    </div>
                  )}
                  {step === 1 && (
                    <div className="space-y-8">
                      <h3 className="ds-display text-2xl text-[var(--ds-text)]">{t('offer.qWhen', 'Ne zaman ve hangi bütçeyle?')}</h3>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div><label className="ds-eyebrow">{t('offer.fields.travelDate', 'Gidiş Tarihi')}</label><input type="date" className={`${field} mt-2`} value={formData.travelDate} onChange={(e) => set('travelDate', e.target.value)} /></div>
                        <div><label className="ds-eyebrow">{t('offer.fields.returnDate', 'Dönüş Tarihi')}</label><input type="date" className={`${field} mt-2`} value={formData.returnDate} onChange={(e) => set('returnDate', e.target.value)} /></div>
                      </div>
                      <div>
                        <label className="ds-eyebrow">{t('offer.fields.budget', 'Kişi Başı Bütçe (₺)')}</label>
                        <input type="number" min="0" className={`${field} mt-2`} placeholder={t('offer.placeholders.budget', 'Yaklaşık bütçeniz')} value={formData.budget} onChange={(e) => set('budget', e.target.value)} />
                        {errors.budget && <p className="text-[var(--ds-terracotta)] text-sm mt-2">{errors.budget}</p>}
                      </div>
                    </div>
                  )}
                  {step === 2 && (
                    <div className="space-y-8">
                      <h3 className="ds-display text-2xl text-[var(--ds-text)]">{t('offer.qHow', 'Nasıl bir deneyim hayal ediyorsunuz?')}</h3>
                      <div className="flex flex-wrap gap-3">
                        {prefOptions.map((o) => {
                          const on = formData.preferences.includes(o.value);
                          return (
                            <button key={o.value} type="button" onClick={() => togglePref(o.value)}
                              className={`px-5 py-2.5 rounded-full text-sm transition-all ${on ? 'text-[var(--ds-on-gold)]' : 'text-[var(--ds-text-soft)] border border-[var(--ds-line-strong)] hover:text-[var(--ds-gold-bright)]'}`}
                              style={on ? { background: 'var(--ds-grad-gold)' } : undefined}>
                              {o.label}
                            </button>
                          );
                        })}
                      </div>
                      <div>
                        <label className="ds-eyebrow">{t('offer.fields.additionalInfo', 'Ek Bilgiler')}</label>
                        <textarea rows="3" className={`${field} mt-2 resize-none`} placeholder={t('offer.placeholders.additionalInfo', 'Hassasiyetleriniz, özel istekleriniz...')} value={formData.additionalInfo} onChange={(e) => set('additionalInfo', e.target.value)} />
                      </div>
                    </div>
                  )}
                  {step === 3 && (
                    <div className="space-y-8">
                      <h3 className="ds-display text-2xl text-[var(--ds-text)]">{t('offer.qContact', 'Size nasıl ulaşalım?')}</h3>
                      <div>
                        <input className={field} placeholder={t('offer.fields.fullName', 'Adınız Soyadınız')} value={formData.fullName} onChange={(e) => set('fullName', e.target.value)} />
                        {errors.fullName && <p className="text-[var(--ds-terracotta)] text-sm mt-2">{errors.fullName}</p>}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div><input type="email" className={field} placeholder={t('offer.fields.email', 'E-posta')} value={formData.email} onChange={(e) => set('email', e.target.value)} />{errors.email && <p className="text-[var(--ds-terracotta)] text-sm mt-2">{errors.email}</p>}</div>
                        <div><input type="tel" className={field} placeholder={t('offer.fields.phone', 'Telefon')} value={formData.phone} onChange={(e) => set('phone', e.target.value)} />{errors.phone && <p className="text-[var(--ds-terracotta)] text-sm mt-2">{errors.phone}</p>}</div>
                      </div>
                      <p className="text-xs text-[var(--ds-text-muted)] leading-relaxed">{t('offer.notes.privacy', 'Bu formu doldurarak bilgilerinizin kaydedilmesine ve sizinle iletişime geçilmesine izin vermiş olursunuz.')}</p>
                      {submitStatus === 'error' && <p className="text-[var(--ds-terracotta)] text-sm">{t('offer.submitError', 'Gönderim başarısız oldu, lütfen tekrar deneyin.')}</p>}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Nav */}
              <div className="mt-10 flex items-center justify-between">
                <button onClick={back} className={`ds-btn-ghost ${step === 0 ? 'invisible' : ''}`}>{t('offer.back', 'Geri')}</button>
                {step < STEPS.length - 1 ? (
                  <button onClick={next} className="ds-btn">{t('offer.next', 'Devam')}</button>
                ) : (
                  <button onClick={handleSubmit} disabled={submitStatus === 'submitting'} className="ds-btn">
                    {submitStatus === 'submitting' ? t('offer.buttons.sending', 'Gönderiliyor...') : t('offer.buttons.submit', 'Teklifimi Hazırla')}
                  </button>
                )}
              </div>

              {/* trust nudge */}
              <div className="mt-8 pt-6 border-t border-[var(--ds-line)] flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[var(--ds-text-muted)]">
                <span>✓ {t('offer.trust24h', '24 saat içinde dönüş')}</span>
                <span>✓ {t('offer.trustFree', 'Ücretsiz & yükümlülüksüz')}</span>
                <span>✓ {t('offer.trustCustom', 'Size özel hazırlanır')}</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RequestOfferPage;
