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
import { useTours } from '../hooks';
import { partitionTours, upcomingDepartures } from '../utils/tour-status';
import { formatTourPrice } from '../utils/priceUtils';

const MEDIA = '/uploads/media';
const FALLBACK_IMG = '/uploads/media/egypt.jpg';
const EASE = [0.22, 1, 0.36, 1];
const clip = (s, n = 96) => { const t = String(s ?? '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t; };

const RequestOfferPage = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { tours } = useTours();

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', destination: '', travelDate: '',
    tourSlug: '', tourTitle: '', dateKey: '', numberOfPeople: '', preferences: [], additionalInfo: '',
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formOptions, setFormOptions] = useState(null);
  const [step, setStep] = useState(0);

  // Only upcoming tours — those with a single dated window OR a departure
  // calendar — grouped by destination (one card per place).
  const destGroups = useMemo(() => {
    const { upcoming } = partitionTours(Array.isArray(tours) ? tours : []);
    const dated = upcoming.filter((x) => x.startDate || (Array.isArray(x.departures) && x.departures.length));
    const map = new Map();
    for (const tr of dated) {
      const key = tr.destination || tr.title;
      if (!map.has(key)) map.set(key, { destination: key, image: tr.image, description: tr.description, tours: [] });
      map.get(key).tours.push(tr);
    }
    // Per-group count of selectable date options (departures expand to many).
    for (const g of map.values()) {
      g.dateCount = g.tours.reduce((n, tr) => {
        const deps = upcomingDepartures(tr);
        return n + (deps.length || (tr.startDate || tr.dates ? 1 : 0));
      }, 0);
    }
    return [...map.values()];
  }, [tours]);

  const hasTours = destGroups.length > 0;
  const selectedGroup = useMemo(() => destGroups.find((g) => g.destination === formData.destination) || null, [destGroups, formData.destination]);

  // Expand the selected destination's tours into one card per departure date.
  const dateOptions = useMemo(() => {
    if (!selectedGroup) return [];
    const opts = [];
    for (const tr of selectedGroup.tours) {
      const deps = upcomingDepartures(tr);
      if (deps.length) {
        deps.forEach((d, i) => opts.push({
          key: `${tr.slug}#${i}`,
          label: d.label || [d.startDate, d.endDate].filter(Boolean).join(' - '),
          tour: tr,
        }));
      } else if (tr.startDate || tr.dates) {
        opts.push({ key: tr.slug, label: tr.dates || tr.title, tour: tr });
      }
    }
    return opts;
  }, [selectedGroup]);

  // Prefill from URL (?destination, persons, days, interests). Match a group if possible.
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const destination = p.get('destination'); const persons = p.get('persons');
    const days = p.get('days'); const interests = p.get('interests');
    if (destination || persons || days || interests) {
      setFormData((prev) => ({
        ...prev,
        ...(destination ? { destination } : {}),
        ...(persons ? { numberOfPeople: persons } : {}),
        ...(interests ? { additionalInfo: `İlgilenilen aktiviteler: ${interests.split(',').join(', ')}${days ? `\nGezi süresi: ${days} gün` : ''}` } : (days ? { additionalInfo: `Gezi süresi: ${days} gün` } : {})),
      }));
    }
  }, [location.search]);

  // Once tours load, snap a prefilled destination string onto the matching group key.
  useEffect(() => {
    if (!formData.destination || !destGroups.length) return;
    if (selectedGroup) return;
    const m = destGroups.find((g) => g.destination.toLowerCase().includes(formData.destination.toLowerCase()) || formData.destination.toLowerCase().includes(g.destination.toLowerCase()));
    if (m) setFormData((p) => ({ ...p, destination: m.destination }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destGroups]);

  useEffect(() => {
    fetch('/data/form-options.json').then((r) => (r.ok ? r.json() : null)).then(setFormOptions).catch(() => {});
  }, []);

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
  const pickDestination = (key) => setFormData((p) => ({ ...p, destination: key, travelDate: '', tourSlug: '', tourTitle: '', dateKey: '' }));
  const pickDate = (opt) => setFormData((p) => ({ ...p, travelDate: opt.label, tourSlug: opt.tour.slug, tourTitle: opt.tour.title, dateKey: opt.key }));
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
    if (s === 1 && dateOptions.length && !formData.travelDate) {
      e.travelDate = t('offer.errors.dateRequired', 'Lütfen bir tarih seçin');
    }
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
          subject: `Teklif: ${formData.tourTitle || formData.destination || 'Belirsiz destinasyon'}`,
          message: formData.additionalInfo || undefined,
          meta: {
            destination: formData.destination, tour: formData.tourTitle || undefined, tourSlug: formData.tourSlug || undefined,
            travelDate: formData.travelDate, numberOfPeople: formData.numberOfPeople, preferences: formData.preferences, utm: getUtmPayload(),
          },
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      trackLead({ kind: 'OFFER', tour: formData.tourTitle || formData.destination, currency: 'TRY' }, { em: formData.email, ph: formData.phone });
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

                      {hasTours ? (
                        <div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {destGroups.map((g) => {
                              const on = formData.destination === g.destination;
                              return (
                                <button key={g.destination} type="button" onClick={() => pickDestination(g.destination)}
                                  className={`text-left rounded-2xl overflow-hidden ds-glass transition-all ${on ? 'ring-2 ring-[var(--ds-gold)]' : 'hover:border-[var(--ds-line-strong)]'}`}>
                                  <div className="relative" style={{ aspectRatio: '16/10' }}>
                                    <img src={g.image || FALLBACK_IMG} alt={g.destination} loading="lazy" onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 45%, rgba(7,10,18,0.92))' }} />
                                    {on && <span className="absolute top-3 right-3 w-7 h-7 rounded-full grid place-items-center" style={{ background: 'var(--ds-grad-gold)' }}><svg className="w-4 h-4 text-[var(--ds-on-gold)]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></span>}
                                    <div className="absolute bottom-0 inset-x-0 p-4">
                                      <h4 className="ds-display text-lg text-[var(--ds-text)] leading-tight">{g.destination}</h4>
                                    </div>
                                  </div>
                                  <div className="p-4 pt-3">
                                    <p className="text-sm text-[var(--ds-text-muted)] leading-relaxed">{clip(g.description, 100)}</p>
                                    <span className="mt-2 inline-block text-xs text-[var(--ds-gold-bright)]">{g.dateCount > 1 ? t('offer.nDepartures', '{{count}} tarih seçeneği', { count: g.dateCount }) : t('offer.oneDeparture', '1 tarih seçeneği')}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          {errors.destination && <p className="text-[var(--ds-terracotta)] text-sm mt-3">{errors.destination}</p>}
                          <p className="text-xs text-[var(--ds-text-muted)] mt-4">{t('offer.notListed', 'Aradığınız rota listede yok mu?')} <Link to="/iletisim" className="text-[var(--ds-gold-bright)]">{t('offer.contactUs', 'Bize yazın')}</Link></p>
                        </div>
                      ) : (
                        <div>
                          <input className={field} placeholder={t('offer.placeholders.destination', 'Örn. Mısır, Fas, Özbekistan...')} value={formData.destination} onChange={(e) => set('destination', e.target.value)} />
                          {errors.destination && <p className="text-[var(--ds-terracotta)] text-sm mt-2">{errors.destination}</p>}
                        </div>
                      )}

                      <div>
                        <label className="ds-eyebrow">{t('offer.fields.numberOfPeople', 'Kişi Sayısı')}</label>
                        <input type="number" min="1" className={`${field} mt-2`} placeholder={t('offer.placeholders.numberOfPeople', 'Kaç kişi?')} value={formData.numberOfPeople} onChange={(e) => set('numberOfPeople', e.target.value)} />
                        {errors.numberOfPeople && <p className="text-[var(--ds-terracotta)] text-sm mt-2">{errors.numberOfPeople}</p>}
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-8">
                      <h3 className="ds-display text-2xl text-[var(--ds-text)]">{t('offer.qWhen', 'Hangi tarihte gitmek istersiniz?')}</h3>
                      {selectedGroup && dateOptions.length ? (
                        <div>
                          <p className="text-[var(--ds-text-soft)] -mt-2">{t('offer.dateLead', '{{dest}} için planlanan tarihler:', { dest: selectedGroup.destination })}</p>
                          <div className="space-y-3 mt-2">
                            {dateOptions.map((opt) => {
                              const tr = opt.tour;
                              const on = formData.dateKey === opt.key;
                              return (
                                <button key={opt.key} type="button" onClick={() => pickDate(opt)}
                                  className={`w-full text-left rounded-2xl p-5 ds-glass flex items-center justify-between gap-4 transition-all ${on ? 'ring-2 ring-[var(--ds-gold)]' : 'hover:border-[var(--ds-line-strong)]'}`}>
                                  <div className="min-w-0">
                                    <div className="ds-display text-lg text-[var(--ds-text)]">{opt.label}</div>
                                    <div className="text-sm text-[var(--ds-text-muted)] mt-1">
                                      {[tr.duration, tr.groupSize].filter(Boolean).join(' · ')}
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <div className="text-[var(--ds-gold)] font-medium">{formatTourPrice(tr)}</div>
                                    <span className={`mt-1 inline-block w-6 h-6 rounded-full ${on ? '' : 'border border-[var(--ds-line-strong)]'}`} style={on ? { background: 'var(--ds-grad-gold)' } : undefined}>
                                      {on && <svg className="w-4 h-4 m-1 text-[var(--ds-on-gold)]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          {errors.travelDate && <p className="text-[var(--ds-terracotta)] text-sm mt-3">{errors.travelDate}</p>}
                        </div>
                      ) : (
                        <div>
                          <label className="ds-eyebrow">{t('offer.fields.travelDate', 'Tercih ettiğiniz tarih')}</label>
                          <input type="date" className={`${field} mt-2`} value={formData.travelDate} onChange={(e) => set('travelDate', e.target.value)} />
                        </div>
                      )}
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
