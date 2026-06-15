import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LocaleLink as Link } from '../components/LocaleLink';
import { trackLead } from '../lib/analytics';
import Seo from '../components/Seo';
import PageHero from '../components/redesign/PageHero';
import { Reveal } from '../components/motion';

const MEDIA = '/uploads/media';

const SurveyPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', groupType: '',
    travelPreferences: [], otherPreferences: [], specialRequests: '',
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/data/survey-questions.json');
        if (!response.ok) throw new Error('Anket soruları yüklenemedi');
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const toggle = (value, category) => {
    setFormData((prev) => {
      const cur = prev[category] || [];
      return { ...prev, [category]: cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value] };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = t('survey.errors.nameRequired', 'İsim zorunludur');
    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.email = t('survey.errors.contactRequired', 'E-posta veya telefon numarasından en az biri zorunludur');
      newErrors.phone = newErrors.email;
    } else {
      if (formData.email.trim() && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) newErrors.email = t('survey.errors.emailInvalid', 'Geçerli bir e-posta adresi giriniz');
      if (formData.phone.trim() && !/^(\+90|0)?\s*([0-9]{3})\s*([0-9]{3})\s*([0-9]{2})\s*([0-9]{2})$/.test(formData.phone)) newErrors.phone = t('survey.errors.phoneInvalid', 'Geçerli bir telefon numarası giriniz');
    }
    if (!formData.groupType) newErrors.groupType = t('survey.errors.groupTypeRequired', 'Lütfen bir grup türü seçin');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submit — POSTs to /api/messages with kind=SURVEY
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitStatus('submitting');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify({
          kind: 'SURVEY', name: formData.fullName, email: formData.email, phone: formData.phone || undefined,
          subject: 'Ön Anket', message: formData.specialRequests || undefined,
          meta: { groupType: formData.groupType, travelPreferences: formData.travelPreferences, otherPreferences: formData.otherPreferences },
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      trackLead({ kind: 'SURVEY', currency: 'TRY' }, { em: formData.email, ph: formData.phone });
      setSubmitStatus('success');
      setFormData({ fullName: '', email: '', phone: '', groupType: '', travelPreferences: [], otherPreferences: [], specialRequests: '' });
      setTimeout(() => setSubmitStatus(null), 6000);
    } catch {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 4000);
    }
  };

  const field = (bad) => `w-full bg-transparent border-b ${bad ? 'border-[var(--ds-terracotta)]' : 'border-[var(--ds-line-strong)]'} py-3 text-[var(--ds-text)] placeholder:text-[var(--ds-text-muted)] focus:outline-none focus:border-[var(--ds-gold)] transition-colors`;

  const Chip = ({ on, label, onClick }) => (
    <button type="button" onClick={onClick}
      className={`px-4 py-2.5 rounded-full text-sm transition-all text-left ${on ? 'text-[var(--ds-on-gold)]' : 'text-[var(--ds-text-soft)] border border-[var(--ds-line-strong)] hover:text-[var(--ds-gold-bright)]'}`}
      style={on ? { background: 'var(--ds-grad-gold)' } : undefined}>
      {label}
    </button>
  );

  const SectionHead = ({ n, title, sub }) => (
    <div className="flex items-center gap-4 mb-7">
      <span className="w-10 h-10 rounded-full grid place-items-center text-sm font-semibold shrink-0" style={{ background: 'var(--ds-grad-gold)', color: 'var(--ds-on-gold)' }}>{n}</span>
      <div>
        <h2 className="ds-display text-xl text-[var(--ds-text)]">{title}</h2>
        <p className="text-sm text-[var(--ds-text-muted)]">{sub}</p>
      </div>
    </div>
  );

  return (
    <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
      <Seo
        title={t('survey.pageTitle', 'Ön Anket - Endülüs Travel')}
        description={t('survey.metaDescription', 'Endülüs Travel ön anketini doldurun; grup yapınızı ve seyahat tercihlerinizi paylaşın, uzman ekibimiz size özel kişiselleştirilmiş bir tur planı hazırlasın. Yalnızca 2 dakika sürer.')}
      />

      <PageHero
        video={`${MEDIA}/morocco.mp4`} poster={`${MEDIA}/morocco.jpg`}
        eyebrow={t('survey.heroEyebrow', 'Fas · Marakeş')}
        title={t('survey.title', 'Ön Anket Formu')}
        subtitle={t('survey.description', 'Sizin için en uygun tur deneyimini oluşturabilmemiz için lütfen aşağıdaki formu doldurunuz. Bu bilgiler, ihtiyaçlarınıza ve beklentilerinize göre kişiselleştirilmiş bir seyahat planlamak için kullanılacaktır.')}
        breadcrumb={[{ to: '/', label: t('navigation.home', 'Ana Sayfa') }, { label: t('navigation.survey', 'Ön Anket') }]}
        minH="60svh"
      />

      <section className="py-16 md:py-24">
        <div className="ds-container max-w-3xl">
          {loading ? (
            <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-2xl ds-glass animate-pulse" />)}</div>
          ) : submitStatus === 'success' ? (
            <Reveal>
              <div className="ds-glass rounded-3xl p-10 md:p-14 text-center">
                <div className="w-16 h-16 rounded-full grid place-items-center mx-auto mb-6" style={{ background: 'var(--ds-grad-gold)' }}>
                  <svg className="w-8 h-8 text-[var(--ds-on-gold)]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="ds-display text-3xl text-[var(--ds-text)]">{t('survey.success.title', 'Talebiniz Alındı')}</h2>
                <p className="ds-lead mt-4">{t('survey.success.message', 'Anket yanıtlarınız başarıyla kaydedildi. Uzman ekibimiz en kısa sürede sizinle iletişime geçecek ve size özel seyahat planı hakkında bilgi verecektir.')}</p>
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <button type="button" onClick={() => setSubmitStatus(null)} className="ds-btn-ghost">{t('survey.success.newForm', 'Yeni Form Doldur')}</button>
                  <Link to="/turlar" className="ds-btn">{t('offer.successTours', 'Turları Keşfet')}</Link>
                </div>
              </div>
            </Reveal>
          ) : (
            <form onSubmit={handleSubmit} className="ds-glass rounded-3xl p-7 md:p-10 space-y-12">
              {/* 1. Personal */}
              <div>
                <SectionHead n="1" title={t('survey.sections.personalInfo', 'Kişisel Bilgileriniz')} sub={t('survey.sections.personalInfoSubtitle', 'Size ulaşabilmemiz için temel bilgileriniz')} />
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="ds-eyebrow">{t('survey.fields.fullName', 'Adınız Soyadınız')} *</label>
                    <input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} className={`${field(errors.fullName)} mt-2`} placeholder={t('survey.placeholders.fullName', 'Adınız ve soyadınız')} />
                    {errors.fullName && <p className="mt-2 text-sm text-[var(--ds-terracotta)]">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label htmlFor="groupType" className="ds-eyebrow">{t('survey.fields.groupType', 'Grup Yapınız')} *</label>
                    <select id="groupType" name="groupType" value={formData.groupType} onChange={handleInputChange} className={`${field(errors.groupType)} mt-2`} style={{ colorScheme: 'dark' }}>
                      <option value="" className="bg-[#0a0e1a]">{t('survey.placeholders.groupType', 'Grup türünüzü seçin')}</option>
                      {questions?.groupTypes?.map((type) => <option key={type.value} value={type.value} className="bg-[#0a0e1a]">{type.label}</option>)}
                    </select>
                    {errors.groupType && <p className="mt-2 text-sm text-[var(--ds-terracotta)]">{errors.groupType}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="ds-eyebrow">{t('survey.fields.email', 'E-posta Adresiniz')}</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={`${field(errors.email)} mt-2`} placeholder={t('survey.placeholders.email', 'ornek@email.com')} />
                    {errors.email && <p className="mt-2 text-sm text-[var(--ds-terracotta)]">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="ds-eyebrow">{t('survey.fields.phone', 'Telefon Numaranız')}</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className={`${field(errors.phone)} mt-2`} placeholder={t('survey.placeholders.phone', '0555 123 4567')} />
                    {errors.phone && <p className="mt-2 text-sm text-[var(--ds-terracotta)]">{errors.phone}</p>}
                  </div>
                </div>
                <p className="mt-4 text-xs text-[var(--ds-text-muted)]">{t('survey.notes.contactRequired', 'E-posta veya telefon numarasından en az birini belirtmelisiniz')}</p>
              </div>

              {/* 2. Preferences */}
              <div>
                <SectionHead n="2" title={t('survey.sections.preferences', 'Seyahat Tercihleriniz')} sub={t('survey.sections.preferencesSubtitle', 'Size uygun tur planı oluşturmamıza yardımcı olun')} />
                <p className="text-[var(--ds-text-soft)] mb-4">{t('survey.questions.travelPreferences', 'Seyahatlerinizde öncelikli tercihleriniz nelerdir?')}</p>
                <div className="flex flex-wrap gap-2.5 mb-8">
                  {questions?.travelPreferences?.map((p) => <Chip key={p.value} on={formData.travelPreferences.includes(p.value)} label={p.label} onClick={() => toggle(p.value, 'travelPreferences')} />)}
                </div>
                <p className="text-[var(--ds-text-soft)] mb-4">{t('survey.questions.otherPreferences', 'Diğer tercihleriniz/hassasiyetleriniz:')}</p>
                <div className="flex flex-wrap gap-2.5">
                  {questions?.otherPreferences?.map((p) => <Chip key={p.value} on={formData.otherPreferences.includes(p.value)} label={p.label} onClick={() => toggle(p.value, 'otherPreferences')} />)}
                </div>
              </div>

              {/* 3. Special requests */}
              <div>
                <SectionHead n="3" title={t('survey.sections.specialRequests', 'Özel Talepler')} sub={t('survey.sections.specialRequestsSubtitle', 'Eklemek istediğiniz özel notlar')} />
                <label htmlFor="specialRequests" className="ds-eyebrow">{t('survey.fields.specialRequests', 'Belirtmek istediğiniz diğer özel talepleriniz:')}</label>
                <textarea id="specialRequests" name="specialRequests" value={formData.specialRequests} onChange={handleInputChange} rows="4" className={`${field(false)} mt-2 resize-none`} placeholder={t('survey.placeholders.specialRequests', 'Ekstra bilgi vermek isterseniz buraya yazabilirsiniz...')} />
              </div>

              <div>
                <p className="text-xs text-[var(--ds-text-muted)] leading-relaxed mb-6">{t('survey.notes.privacy', 'Bu formu doldurarak bilgilerinizin kaydedilmesine ve sizinle iletişime geçilmesine izin vermiş oluyorsunuz. Verileriniz üçüncü kişilerle paylaşılmayacaktır.')}</p>
                {submitStatus === 'error' && <p className="text-[var(--ds-terracotta)] text-sm mb-4">{t('offer.submitError', 'Gönderim başarısız oldu, lütfen tekrar deneyin.')}</p>}
                <button type="submit" disabled={submitStatus === 'submitting'} className={`ds-btn w-full justify-center ${submitStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {submitStatus === 'submitting' ? t('survey.buttons.sending', 'Gönderiliyor...') : t('survey.buttons.submit', 'Anketi Gönder')}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default SurveyPage;
