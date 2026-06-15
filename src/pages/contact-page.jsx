import { useTranslation } from 'react-i18next';
import { LocaleLink as Link } from '../components/LocaleLink';
import { useState } from 'react';
import { trackLead, trackContact } from '../lib/analytics';
import { getCampaign } from '../lib/utm';
import { useContactData, useWhatsAppSettings } from '../hooks/useAppData';
import Seo from '../components/Seo';
import PageHero from '../components/redesign/PageHero';
import { Reveal, TextReveal, Magnetic } from '../components/motion';

const MEDIA = '/uploads/media';

// Builds a wa.me link with the active campaign appended as a ref, sourced from
// settings (falls back to the production number). Mirrors WhatsAppButton so the
// custom-styled anchors on this page still carry attribution + fire Contact.
const buildWa = (number, baseMsg) => {
  const phone = String(number || '905079384508').replace(/\D/g, '');
  const campaign = getCampaign();
  const text = `${baseMsg}${campaign ? ` (ref: ${campaign})` : ''}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

const ContactPage = () => {
  const { t } = useTranslation();
  const { contactData } = useContactData();
  const { value: whatsapp } = useWhatsAppSettings();
  const waNumber = whatsapp?.number || contactData?.phone;
  const waMsg = t('contactPage.waMsg', 'Merhaba, seyahat planları hakkında bilgi almak istiyorum.');

  // Contact details — sourced from /api/settings/contact, with the production
  // values as fallback so the page never renders blank before the API responds.
  const phone = contactData?.phone || '+90 507 938 45 08';
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;
  const email = contactData?.email || 'info@endulustravel.com';
  const igUrl = contactData?.social?.instagram || 'https://www.instagram.com/endulustravell/';
  const igHandle = '@' + (igUrl.replace(/\/+$/, '').split('/').pop() || 'endulustravell');
  const agencyName = contactData?.agencyName || 'ROTA ATLAS SEYAHAT ACENTASI';
  const address = contactData?.address
    || t('contactPage.addressFallback', 'Osmanağa Mah. Çilek Sok. Akel İşhanı No:1 Kat:2 İç Kapı No:42, Kadıköy / İstanbul');

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('contactPage.errNameRequired', 'Ad Soyad alanı zorunludur');
    if (!formData.email.trim()) newErrors.email = t('contactPage.errEmailRequired', 'E-posta alanı zorunludur');
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('contactPage.errEmailInvalid', 'Geçerli bir e-posta adresi girin');
    if (!formData.subject.trim()) newErrors.subject = t('contactPage.errSubjectRequired', 'Konu alanı zorunludur');
    if (!formData.message.trim()) newErrors.message = t('contactPage.errMessageRequired', 'Mesaj alanı zorunludur');
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setSubmitStatus('submitting');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify({
          kind: 'CONTACT', name: formData.name, email: formData.email,
          phone: formData.phone || undefined, subject: formData.subject || undefined, message: formData.message,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      trackLead({ kind: 'CONTACT', currency: 'TRY' }, { em: formData.email, ph: formData.phone });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus(null), 4000);
    } catch (err) {
      setSubmitStatus('error');
      setErrors({ submit: err.message || t('contactPage.errSubmitFailed', 'Mesaj gönderilemedi') });
      setTimeout(() => setSubmitStatus(null), 4000);
    }
  };

  const fieldCls = (bad) => `w-full bg-transparent border-b ${bad ? 'border-[var(--ds-terracotta)]' : 'border-[var(--ds-line-strong)]'} py-3 text-[var(--ds-text)] placeholder:text-[var(--ds-text-muted)] focus:outline-none focus:border-[var(--ds-gold)] transition-colors`;

  return (
    <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
      <Seo
        title={t('contactPage.documentTitle', 'İletişim - Endülüs Travel')}
        description={t('contactPage.metaDescription', 'Endülüs Travel ile iletişime geçin. Telefon, WhatsApp, e-posta ve Kadıköy ofis adresimiz üzerinden ulaşın; size özel seyahat planları ve ücretsiz danışmanlık için bizimle bağlantı kurun.')}
      />

      <PageHero
        video={`${MEDIA}/istanbul.mp4`} poster={`${MEDIA}/istanbul.jpg`}
        eyebrow={t('contactPage.heroEyebrow', 'İstanbul · Boğaz')}
        title={t('contactPage.heroTitleFull', 'Size ulaşalım')}
        subtitle={t('contactPage.heroSubtitle', 'Hayalinizdeki seyahati planlamak için buradayız. Premium seyahat deneyimleri için bizimle iletişime geçin.')}
        breadcrumb={[{ to: '/', label: t('contactPage.breadcrumbHome', 'Ana Sayfa') }, { label: t('contactPage.breadcrumbContact', 'İletişim') }]}
        minH="60svh"
      />

      {/* Split: info + form */}
      <section className="py-16 md:py-24">
        <div className="ds-container grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: contact rails */}
          <Reveal>
            <span className="ds-eyebrow">{t('contactPage.infoBadge', 'İletişim Bilgileri')}</span>
            <h2 className="ds-display text-[var(--ds-text)] mt-4" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>
              {t('contactPage.infoTitlePrefix', 'Endülüs Travel ile')} <span className="ds-gold-text">{t('contactPage.infoTitleHighlight', 'İletişime Geçin')}</span>
            </h2>
            <p className="ds-lead mt-4">{t('contactPage.infoSubtitle', 'Profesyonel ekibimiz size en iyi seyahat deneyimini sunmak için burada')}</p>

            <div className="mt-8 space-y-3">
              <a href={phoneHref} className="ds-glass rounded-2xl p-5 flex items-center gap-4 group hover:border-[var(--ds-gold)] transition-colors block">
                <span className="w-11 h-11 rounded-xl grid place-items-center shrink-0" style={{ background: 'var(--ds-grad-gold)' }}>
                  <svg className="w-5 h-5 text-[var(--ds-on-gold)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-wider text-[var(--ds-text-muted)]">{t('contactPage.cardPhoneTitle', 'Telefon')}</span>
                  <span className="block text-[var(--ds-text)] font-medium truncate group-hover:text-[var(--ds-gold-bright)] transition-colors">{phone}</span>
                </span>
              </a>
              <a href={`mailto:${email}`} className="ds-glass rounded-2xl p-5 flex items-center gap-4 group hover:border-[var(--ds-gold)] transition-colors block">
                <span className="w-11 h-11 rounded-xl grid place-items-center shrink-0" style={{ background: 'var(--ds-grad-gold)' }}>
                  <svg className="w-5 h-5 text-[var(--ds-on-gold)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-wider text-[var(--ds-text-muted)]">{t('contactPage.cardEmailTitle', 'E-posta')}</span>
                  <span className="block text-[var(--ds-text)] font-medium truncate group-hover:text-[var(--ds-gold-bright)] transition-colors">{email}</span>
                </span>
              </a>
              <div className="grid grid-cols-2 gap-3">
                <a href={buildWa(waNumber, waMsg)} onClick={() => trackContact({ channel: 'whatsapp' })} target="_blank" rel="noopener noreferrer" className="ds-glass rounded-2xl p-5 flex items-center gap-3 group hover:border-[var(--ds-gold)] transition-colors">
                  <svg className="w-6 h-6 text-[var(--ds-gold-bright)] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" /></svg>
                  <span className="text-sm text-[var(--ds-text-soft)] group-hover:text-[var(--ds-gold-bright)] transition-colors">WhatsApp</span>
                </a>
                <a href={igUrl} target="_blank" rel="noopener noreferrer" className="ds-glass rounded-2xl p-5 flex items-center gap-3 group hover:border-[var(--ds-gold)] transition-colors">
                  <svg className="w-6 h-6 text-[var(--ds-gold-bright)] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                  <span className="text-sm text-[var(--ds-text-soft)] group-hover:text-[var(--ds-gold-bright)] transition-colors truncate">{igHandle}</span>
                </a>
              </div>
            </div>

            {/* office + hours */}
            <div className="ds-glass rounded-2xl p-6 mt-3">
              <h3 className="ds-display text-lg text-[var(--ds-text)]">{agencyName}</h3>
              <p className="text-[var(--ds-text-muted)] text-sm mt-2 leading-relaxed">{address}</p>
              <div className="ds-hairline my-5" />
              <h4 className="ds-eyebrow">{t('contactPage.workingHoursTitle', 'Çalışma Saatleri')}</h4>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[var(--ds-text-muted)]">{t('contactPage.weekdays', 'Pazartesi - Cuma')}</span><span className="text-[var(--ds-text-soft)]">09:00 - 18:00</span></div>
                <div className="flex justify-between"><span className="text-[var(--ds-text-muted)]">{t('contactPage.saturday', 'Cumartesi')}</span><span className="text-[var(--ds-text-soft)]">10:00 - 16:00</span></div>
                <div className="flex justify-between"><span className="text-[var(--ds-text-muted)]">{t('contactPage.sunday', 'Pazar')}</span><span className="text-[var(--ds-terracotta)]">{t('contactPage.closed', 'Kapalı')}</span></div>
              </div>
            </div>
          </Reveal>

          {/* Right: form */}
          <Reveal delay={0.15}>
            <div className="ds-glass rounded-3xl p-7 md:p-9">
              <h2 className="ds-display text-2xl text-[var(--ds-text)]">{t('contactPage.formHeading', 'Hemen İletişime Geçin')}</h2>
              <p className="text-[var(--ds-text-muted)] mt-2">{t('contactPage.formSubheading', 'Size özel teklif hazırlayalım')}</p>

              {submitStatus === 'success' && (
                <div className="mt-6 rounded-2xl p-4 border border-[var(--ds-gold)]/40" style={{ background: 'rgba(217,178,90,0.08)' }}>
                  <p className="text-[var(--ds-gold-bright)] font-medium">{t('contactPage.successTitle', 'Mesajınız başarıyla gönderildi!')}</p>
                  <p className="text-[var(--ds-text-muted)] text-sm mt-1">{t('contactPage.successSubtitle', '24 saat içinde size dönüş yapacağız.')}</p>
                </div>
              )}
              {submitStatus === 'error' && (
                <p className="mt-6 text-[var(--ds-terracotta)] text-sm">{errors.submit || t('contactPage.errSubmitFailed', 'Mesaj gönderilemedi')}</p>
              )}

              <form onSubmit={handleSubmit} className="mt-7 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="ds-eyebrow">{t('contactPage.labelName', 'Ad Soyad')} *</label>
                    <input id="name" name="name" value={formData.name} onChange={handleInputChange} className={`${fieldCls(errors.name)} mt-2`} placeholder={t('contactPage.placeholderName', 'Adınız ve soyadınız')} />
                    {errors.name && <p className="mt-2 text-sm text-[var(--ds-terracotta)]">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="ds-eyebrow">{t('contactPage.labelEmail', 'E-posta')} *</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={`${fieldCls(errors.email)} mt-2`} placeholder={t('contactPage.placeholderEmail', 'ornek@email.com')} />
                    {errors.email && <p className="mt-2 text-sm text-[var(--ds-terracotta)]">{errors.email}</p>}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="ds-eyebrow">{t('contactPage.labelPhone', 'Telefon')}</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className={`${fieldCls(false)} mt-2`} placeholder="05XX XXX XX XX" />
                  </div>
                  <div>
                    <label htmlFor="subject" className="ds-eyebrow">{t('contactPage.labelSubject', 'Konu')} *</label>
                    <select id="subject" name="subject" value={formData.subject} onChange={handleInputChange} className={`${fieldCls(errors.subject)} mt-2`} style={{ colorScheme: 'dark' }}>
                      <option value="" className="bg-[#0a0e1a]">{t('contactPage.optionSelect', 'Konu seçiniz')}</option>
                      <option value="tur-bilgi" className="bg-[#0a0e1a]">{t('contactPage.optionTourInfo', 'Tur Bilgileri')}</option>
                      <option value="rezervasyon" className="bg-[#0a0e1a]">{t('contactPage.optionReservation', 'Rezervasyon')}</option>
                      <option value="ozel-tur" className="bg-[#0a0e1a]">{t('contactPage.optionPrivateTour', 'Özel Tur Talebi')}</option>
                      <option value="grup-tur" className="bg-[#0a0e1a]">{t('contactPage.optionGroupTour', 'Grup Turu')}</option>
                      <option value="iptal-degisiklik" className="bg-[#0a0e1a]">{t('contactPage.optionCancelChange', 'İptal/Değişiklik')}</option>
                      <option value="diger" className="bg-[#0a0e1a]">{t('contactPage.optionOther', 'Diğer')}</option>
                    </select>
                    {errors.subject && <p className="mt-2 text-sm text-[var(--ds-terracotta)]">{errors.subject}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="ds-eyebrow">{t('contactPage.labelMessage', 'Mesajınız')} *</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} rows={5} className={`${fieldCls(errors.message)} mt-2 resize-none`} placeholder={t('contactPage.placeholderMessage', 'Hangi destinasyonlara ilgi duyuyorsunuz? Seyahat tarihleriniz ve grup büyüklüğünüz nedir?')} />
                  {errors.message && <p className="mt-2 text-sm text-[var(--ds-terracotta)]">{errors.message}</p>}
                </div>
                <button type="submit" disabled={submitStatus === 'submitting'} className={`ds-btn w-full justify-center ${submitStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {submitStatus === 'submitting' ? t('contactPage.submitting', 'Gönderiliyor...') : t('contactPage.submit', 'Mesajı Gönder')}
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA band */}
      <section className="relative overflow-hidden ds-vignette" style={{ minHeight: '52vh' }}>
        <img src={`${MEDIA}/istanbul.jpg`} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-30" loading="lazy" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, var(--ds-bg), rgba(10,14,26,0.55), var(--ds-bg))' }} />
        <div className="relative z-10 ds-container py-24 text-center flex flex-col items-center">
          <Reveal><span className="ds-eyebrow">{t('contactPage.ctaBadge', 'Özel Teklifler Mevcut')}</span></Reveal>
          <h2 className="ds-display text-[var(--ds-text)] mt-5 text-balance" style={{ fontSize: 'clamp(2rem,5vw,3.4rem)' }}>
            <TextReveal text={t('contactPage.ctaTitlePrefix', 'Hayalinizdeki seyahati')} />
            <span className="block ds-gold-text"><TextReveal text={t('contactPage.ctaTitleHighlight', 'birlikte planlayalım')} delay={0.15} /></span>
          </h2>
          <Reveal delay={0.2}><p className="ds-lead mt-5 max-w-[48ch] mx-auto">{t('contactPage.ctaSubtitle', 'Profesyonel ekibimiz ile size özel, unutulmaz seyahat deneyimleri yaşayın. İlk görüşme tamamen ücretsiz!')}</p></Reveal>
          <Reveal delay={0.3}>
            <div className="mt-9 flex flex-wrap gap-4 justify-center">
              <Magnetic><Link to="/teklif-al" className="ds-btn">{t('contactPage.ctaGetQuote', 'Ücretsiz Teklif Alın')}</Link></Magnetic>
              <a href={buildWa(waNumber, waMsg)} onClick={() => trackContact({ channel: 'whatsapp' })} target="_blank" rel="noopener noreferrer" className="ds-btn-ghost">{t('contactPage.ctaWhatsapp', 'WhatsApp ile Yazın')}</a>
            </div>
          </Reveal>
          <div className="mt-7 text-sm text-[var(--ds-text-muted)]">
            {t('contactPage.callPrompt', 'Hemen aramak isterseniz:')} <a href={phoneHref} className="text-[var(--ds-gold-bright)] font-medium ml-1">{phone}</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
