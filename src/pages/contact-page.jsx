import { useTranslation } from 'react-i18next';
import { LocaleLink as Link } from '../components/LocaleLink';
import { useState, useEffect } from 'react';
import { trackLead, trackContact } from '../lib/analytics';
import { getCampaign } from '../lib/utm';
import { useContactData, useWhatsAppSettings } from '../hooks/useAppData';

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
  const address = contactData?.address
    || t('contactPage.addressFallback', 'Osmanağa Mah. Çilek Sok. Akel İşhanı No:1 Kat:2 İç Kapı No:42, Kadıköy / İstanbul');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    document.title = t('contactPage.documentTitle', 'İletişim - Endülüs Travel');
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('contactPage.errNameRequired', 'Ad Soyad alanı zorunludur');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('contactPage.errEmailRequired', 'E-posta alanı zorunludur');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('contactPage.errEmailInvalid', 'Geçerli bir e-posta adresi girin');
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = t('contactPage.errSubjectRequired', 'Konu alanı zorunludur');
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t('contactPage.errMessageRequired', 'Mesaj alanı zorunludur');
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitStatus('submitting');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          kind: 'CONTACT',
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          subject: formData.subject || undefined,
          message: formData.message,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      trackLead(
        { kind: 'CONTACT', currency: 'TRY' },
        { em: formData.email, ph: formData.phone }
      );
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (err) {
      setSubmitStatus('error');
      setErrors({ submit: err.message || t('contactPage.errSubmitFailed', 'Mesaj gönderilemedi') });
      setTimeout(() => setSubmitStatus(null), 4000);
    }
  };

  return (
    <div className="page-transition">
      {/* Modern Hero Section with Dynamic Background */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
          <div className="absolute inset-0 bg-[url('/images/patterns/topography.svg')] opacity-10"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-20">
          {/* Breadcrumb */}
          <nav className="mb-8 animate-fade-in">
            <div className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-blue-300 hover:text-white transition-colors duration-300">
                {t('contactPage.breadcrumbHome', 'Ana Sayfa')}
              </Link>
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white font-medium">{t('contactPage.breadcrumbContact', 'İletişim')}</span>
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-white animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm font-medium">{t('contactPage.onlineBadge', 'Şimdi Çevrimiçiyiz')}</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  {t('contactPage.heroTitleLine1', 'Size')}
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {t('contactPage.heroTitleLine2', 'Ulaşalım')}
                </span>
              </h1>

              <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-lg">
                {t('contactPage.heroSubtitle', 'Hayalinizdeki seyahati planlamak için buradayız. Premium seyahat deneyimleri için bizimle iletişime geçin.')}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">24/7</div>
                  <div className="text-sm text-blue-200">{t('contactPage.statSupport', 'Destek')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">5⭐</div>
                  <div className="text-sm text-blue-200">{t('contactPage.statRating', 'Değerlendirme')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">1000+</div>
                  <div className="text-sm text-blue-200">{t('contactPage.statHappyCustomers', 'Mutlu Müşteri')}</div>
                </div>
              </div>

              {/* Quick Contact Buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href={phoneHref}
                  className="group flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{t('contactPage.callNow', 'Hemen Arayın')}</div>
                    <div className="text-green-100 text-sm">{phone}</div>
                  </div>
                </a>

                <a
                  href={buildWa(waNumber, waMsg)}
                  onClick={() => trackContact({ channel: 'whatsapp' })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold">WhatsApp</div>
                    <div className="text-green-100 text-sm">{t('contactPage.instantMessage', 'Anında Mesaj')}</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Right Content - Contact Form */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">{t('contactPage.formHeading', 'Hemen İletişime Geçin')}</h2>
                  <p className="text-blue-200">{t('contactPage.formSubheading', 'Size özel teklif hazırlayalım')}</p>
                </div>

                {/* Success Message */}
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-500/20 border border-green-400/30 rounded-2xl backdrop-blur-sm animate-fade-in">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-green-100 font-semibold">{t('contactPage.successTitle', 'Mesajınız başarıyla gönderildi!')}</p>
                        <p className="text-green-200 text-sm">{t('contactPage.successSubtitle', '24 saat içinde size dönüş yapacağız.')}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                        {t('contactPage.labelName', 'Ad Soyad')} *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 bg-white/10 border ${
                          errors.name ? 'border-red-400' : 'border-white/20'
                        } rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm`}
                        placeholder={t('contactPage.placeholderName', 'Adınız ve soyadınız')}
                      />
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-300 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                        {t('contactPage.labelEmail', 'E-posta')} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 bg-white/10 border ${
                          errors.email ? 'border-red-400' : 'border-white/20'
                        } rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm`}
                        placeholder={t('contactPage.placeholderEmail', 'ornek@email.com')}
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-300 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
                        {t('contactPage.labelPhone', 'Telefon')}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                        placeholder="05XX XXX XX XX"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-white mb-2">
                        {t('contactPage.labelSubject', 'Konu')} *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 bg-white/10 border ${
                          errors.subject ? 'border-red-400' : 'border-white/20'
                        } rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm`}
                      >
                        <option value="" className="bg-slate-800">{t('contactPage.optionSelect', 'Konu seçiniz')}</option>
                        <option value="tur-bilgi" className="bg-slate-800">{t('contactPage.optionTourInfo', 'Tur Bilgileri')}</option>
                        <option value="rezervasyon" className="bg-slate-800">{t('contactPage.optionReservation', 'Rezervasyon')}</option>
                        <option value="ozel-tur" className="bg-slate-800">{t('contactPage.optionPrivateTour', 'Özel Tur Talebi')}</option>
                        <option value="grup-tur" className="bg-slate-800">{t('contactPage.optionGroupTour', 'Grup Turu')}</option>
                        <option value="iptal-degisiklik" className="bg-slate-800">{t('contactPage.optionCancelChange', 'İptal/Değişiklik')}</option>
                        <option value="diger" className="bg-slate-800">{t('contactPage.optionOther', 'Diğer')}</option>
                      </select>
                      {errors.subject && (
                        <p className="mt-2 text-sm text-red-300 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.subject}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-white mb-2">
                      {t('contactPage.labelMessage', 'Mesajınız')} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full px-4 py-4 bg-white/10 border ${
                        errors.message ? 'border-red-400' : 'border-white/20'
                      } rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm resize-none`}
                      placeholder={t('contactPage.placeholderMessage', 'Hangi destinasyonlara ilgi duyuyorsunuz? Seyahat tarihleriniz ve grup büyüklüğünüz nedir?')}
                    ></textarea>
                    {errors.message && (
                      <p className="mt-2 text-sm text-red-300 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitStatus === 'submitting'}
                    className={`group w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3 ${
                      submitStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {submitStatus === 'submitting' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>{t('contactPage.submitting', 'Gönderiliyor...')}</span>
                      </>
                    ) : (
                      <>
                        <span>{t('contactPage.submit', 'Mesajı Gönder')}</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Contact Information Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-full font-semibold mb-6">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('contactPage.infoBadge', 'İletişim Bilgileri')}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              {t('contactPage.infoTitlePrefix', 'Endülüs Travel ile')}
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('contactPage.infoTitleHighlight', 'İletişime Geçin')}
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t('contactPage.infoSubtitle', 'Profesyonel ekibimiz size en iyi seyahat deneyimini sunmak için burada')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Cards */}
            <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{t('contactPage.cardPhoneTitle', 'Telefon İletişimi')}</h3>
              <p className="text-slate-600 mb-4">{t('contactPage.cardPhoneDesc', 'Deneyimli ekibimiz ile doğrudan görüşün')}</p>
              <a
                href={phoneHref}
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
              >
                {phone}
              </a>
              <p className="text-sm text-slate-500 mt-2">{t('contactPage.cardPhoneNote', '7/24 Destek Hattı')}</p>
            </div>

            <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{t('contactPage.cardEmailTitle', 'E-posta')}</h3>
              <p className="text-slate-600 mb-4">{t('contactPage.cardEmailDesc', 'Detaylı bilgi için yazabilirsiniz')}</p>
              <a
                href={`mailto:${email}`}
                className="text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent hover:from-emerald-600 hover:to-green-600 transition-all duration-300"
              >
                {email}
              </a>
              <p className="text-sm text-slate-500 mt-2">{t('contactPage.cardEmailNote', '24 saat içinde yanıt')}</p>
            </div>

            <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{t('contactPage.cardSocialTitle', 'Sosyal Medya')}</h3>
              <p className="text-slate-600 mb-4">{t('contactPage.cardSocialDesc', 'Güncel içerikler için takip edin')}</p>
              <a
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
              >
                {igHandle}
              </a>
              <p className="text-sm text-slate-500 mt-2">{t('contactPage.cardSocialNote', 'Günlük paylaşımlar')}</p>
            </div>
          </div>

          {/* Office Information */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-600 rounded-full font-semibold mb-6">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4m0 0v-4a1 1 0 011-1h2a1 1 0 011 1v4M7 7h10M7 11h10m-5 4h2" />
                  </svg>
                  {t('contactPage.officeBadge', 'Ofis Bilgileri')}
                </div>
                
                <h3 className="text-3xl font-bold text-slate-800 mb-6">
                  ROTA ATLAS SEYAHAT ACENTASI
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-2">{t('contactPage.addressHeading', 'Adres')}</h4>
                      <p className="text-slate-600 leading-relaxed">
                        {address}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 bg-blue-50 rounded-2xl p-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-blue-800 font-semibold">{t('contactPage.centralLocation', 'Merkezi Konum')}</p>
                      <p className="text-blue-600 text-sm">{t('contactPage.centralLocationDesc', "Kadıköy'ün kalbinde, ulaşım kolaylığı")}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-slate-100 to-blue-50 rounded-2xl p-8">
                <h4 className="text-xl font-bold text-slate-800 mb-6">{t('contactPage.workingHoursTitle', 'Çalışma Saatleri')}</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="text-slate-600">{t('contactPage.weekdays', 'Pazartesi - Cuma')}</span>
                    <span className="font-semibold text-slate-800">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="text-slate-600">{t('contactPage.saturday', 'Cumartesi')}</span>
                    <span className="font-semibold text-slate-800">10:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-600">{t('contactPage.sunday', 'Pazar')}</span>
                    <span className="text-red-500 font-semibold">{t('contactPage.closed', 'Kapalı')}</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-100 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-800 font-semibold">{t('contactPage.openNow', 'Şu anda açığız!')}</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">{t('contactPage.emergencySupport', 'Acil durumlar için 7/24 WhatsApp destek')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-white font-semibold">{t('contactPage.ctaBadge', 'Özel Teklifler Mevcut')}</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {t('contactPage.ctaTitlePrefix', 'Hayalinizdeki Seyahati')}
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t('contactPage.ctaTitleHighlight', 'Birlikte Planlayalım')}
              </span>
            </h2>

            <p className="text-xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
              {t('contactPage.ctaSubtitle', 'Profesyonel ekibimiz ile size özel, unutulmaz seyahat deneyimleri yaşayın. İlk görüşme tamamen ücretsiz!')}
            </p>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t('contactPage.featureFastTitle', 'Hızlı Yanıt')}</h3>
                <p className="text-blue-200">{t('contactPage.featureFastDesc', '24 saat içinde detaylı teklif')}</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t('contactPage.featureFreeTitle', 'Ücretsiz Danışmanlık')}</h3>
                <p className="text-blue-200">{t('contactPage.featureFreeDesc', 'İlk görüşme tamamen ücretsiz')}</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t('contactPage.featurePersonalTitle', 'Kişisel Tasarım')}</h3>
                <p className="text-blue-200">{t('contactPage.featurePersonalDesc', 'Size özel tur planlaması')}</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/teklif-al" 
                className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-3"
              >
                <span>{t('contactPage.ctaGetQuote', 'Ücretsiz Teklif Alın')}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <a
                href={buildWa(waNumber, waMsg)}
                onClick={() => trackContact({ channel: 'whatsapp' })}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span>{t('contactPage.ctaWhatsapp', 'WhatsApp ile Yazın')}</span>
              </a>
              
              <a
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-blue-200 text-sm">
                📞 {t('contactPage.callPrompt', 'Hemen aramak isterseniz:')}
                <a href={phoneHref} className="text-white font-semibold hover:text-blue-300 transition-colors ml-2">
                  {phone}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage; 