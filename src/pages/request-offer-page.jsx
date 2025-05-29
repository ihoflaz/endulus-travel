import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const RequestOfferPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    destination: '',
    travelDate: '',
    returnDate: '',
    numberOfPeople: '',
    budget: '',
    preferences: [],
    additionalInfo: ''
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formOptions, setFormOptions] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sayfa başlığını ayarla
  useEffect(() => {
    document.title = t('offer.pageTitle', 'Teklif Al - Endülüs Travel');
  }, [t]);

  // URL parametrelerini işle
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // URL parametrelerinden formu doldur
    const destination = params.get('destination');
    const budget = params.get('budget');
    const persons = params.get('persons');
    const days = params.get('days');
    const interests = params.get('interests');
    
    if (destination || budget || persons || days || interests) {
      const updatedFormData = { ...formData };
      
      if (destination) updatedFormData.destination = destination;
      if (budget) updatedFormData.budget = budget;
      if (persons) updatedFormData.numberOfPeople = persons;
      
      // İlgi alanlarını parse et
      if (interests) {
        updatedFormData.additionalInfo = `İlgilenilen aktiviteler: ${interests.split(',').join(', ')}${days ? `\nGezi süresi: ${days} gün` : ''}`;
      } else if (days) {
        updatedFormData.additionalInfo = `Gezi süresi: ${days} gün`;
      }
      
      setFormData(updatedFormData);
    }
  }, [location.search]);

  // Form seçeneklerini yükle
  useEffect(() => {
    const fetchFormOptions = async () => {
      try {
        const response = await fetch('data/form-options.json');
        if (!response.ok) {
          throw new Error('Form seçenekleri yüklenemedi');
        }
        const data = await response.json();
        setFormOptions(data);
        setLoading(false);
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
        setLoading(false);
      }
    };

    fetchFormOptions();
  }, []);

  // Form değişikliklerini işle
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Hata mesajını temizle
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Checkbox değişikliklerini işle
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    
    setFormData((prev) => {
      // Mevcut seçimler
      const currentPreferences = prev.preferences || [];
      
      // Seçim ekle veya çıkar
      const updatedPreferences = checked
        ? [...currentPreferences, value]
        : currentPreferences.filter(item => item !== value);
      
      return {
        ...prev,
        preferences: updatedPreferences,
      };
    });
  };

  // Form doğrulama
  const validateForm = () => {
    const newErrors = {};
    
    // Ad Soyad kontrolü
    if (!formData.fullName.trim()) {
      newErrors.fullName = t('offer.errors.nameRequired', 'Ad Soyad zorunludur');
    }
    
    // E-posta veya telefon zorunluluğu
    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.email = t('offer.errors.contactRequired', 'E-posta veya telefon numarasından en az biri zorunludur');
      newErrors.phone = t('offer.errors.contactRequired', 'E-posta veya telefon numarasından en az biri zorunludur');
    } else {
      // E-posta kontrolü (girildi ise)
      if (formData.email.trim() && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
        newErrors.email = t('offer.errors.emailInvalid', 'Geçerli bir e-posta adresi giriniz');
      }
      
      // Telefon kontrolü (girildi ise)
      if (formData.phone.trim() && !/^(\+90|0)?\s*([0-9]{3})\s*([0-9]{3})\s*([0-9]{2})\s*([0-9]{2})$/.test(formData.phone)) {
        newErrors.phone = t('offer.errors.phoneInvalid', 'Geçerli bir telefon numarası giriniz');
      }
    }
    
    // Gidilecek yer kontrolü
    if (!formData.destination.trim()) {
      newErrors.destination = t('offer.errors.destinationRequired', 'Gidilecek yer zorunludur');
    }
    
    // Kişi sayısı kontrolü
    if (!formData.numberOfPeople.trim()) {
      newErrors.numberOfPeople = t('offer.errors.numberOfPeopleRequired', 'Kişi sayısı zorunludur');
    } else if (isNaN(formData.numberOfPeople) || parseInt(formData.numberOfPeople) < 1) {
      newErrors.numberOfPeople = t('offer.errors.numberOfPeopleInvalid', 'Geçerli bir kişi sayısı giriniz');
    }
    
    // Bütçe kontrolü (girilmişse sayı kontrolü)
    if (formData.budget.trim() && (isNaN(formData.budget) || parseInt(formData.budget) < 0)) {
      newErrors.budget = t('offer.errors.budgetInvalid', 'Geçerli bir bütçe giriniz');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form gönderimi
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setSubmitStatus('submitting');
      
      // API'ye gönderme simülasyonu
      setTimeout(() => {
        setSubmitStatus('success');
        
        // Formu sıfırla
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          destination: '',
          travelDate: '',
          returnDate: '',
          numberOfPeople: '',
          budget: '',
          preferences: [],
          additionalInfo: ''
        });
        
        // 5 saniye sonra başarı mesajını kaldır
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      }, 1500);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[color-primary]/30 border-t-[color-primary] rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-[color-secondary] rounded-full animate-ping"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[color-primary] via-blue-600 to-[color-primary]"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[color-secondary]/20 to-transparent rounded-full transform -translate-x-16 translate-y-16"></div>
        
        <div className="relative z-10 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* Breadcrumb */}
            <div className="mb-6 animate-fade-in">
              <Link to="/" className="text-white/80 hover:text-white transition-colors">{t('navigation.home')}</Link>
              <span className="text-white/60 mx-2">&gt;</span>
              <span className="text-[color-secondary]">{t('offer.title', 'Özel Teklif Alın')}</span>
            </div>

            {/* Hero Content */}
            <div className="text-center text-white max-w-4xl mx-auto">
              <div className="mb-6 animate-fade-in">
                <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-[color-secondary] text-sm font-semibold rounded-full border border-white/30">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {t('offer.badge', 'Kişiselleştirilmiş Teklif')}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {t('offer.title', 'Özel Teklif Alın')}
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {t('offer.description', 'Size özel hazırlanacak tur planı için aşağıdaki formu doldurun. Deneyimli ekibimiz en uygun teklifinizi 24 saat içinde hazırlayacak.')}
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">24</h3>
                  <p className="text-white/90">Saat İçinde Yanıt</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">%100</h3>
                  <p className="text-white/90">Kişiselleştirme</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">0₺</h3>
                  <p className="text-white/90">Teklif Ücreti</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Content Section */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          
          {/* Başarı Mesajı */}
          {submitStatus === 'success' && (
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-md mb-10">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-green-800">
                    {t('offer.success.title', 'Talebiniz Alındı')}
                  </h3>
                  <p className="mt-2 text-sm text-green-700">
                    {t('offer.success.message', 'Teklif formunuz başarıyla gönderildi. Uzman ekibimiz, talebinizi inceleyerek en kısa sürede size özel fiyat teklifi ile iletişime geçecektir.')}
                  </p>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setSubmitStatus(null)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      {t('offer.success.newForm', 'Yeni Teklif İste')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* WhatsApp ile Teklif */}
          <div className="bg-green-50 p-6 rounded-lg mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {t('offer.whatsapp.title', 'Hızlı Teklif İster misiniz?')}
                </h3>
                <p className="text-gray-600">
                  {t('offer.whatsapp.description', 'Formu doldurmak yerine WhatsApp üzerinden de bizimle iletişime geçebilir ve hızlıca teklif alabilirsiniz.')}
                </p>
              </div>
              <a
                href="https://wa.me/905551234567?text=Merhaba,%20tur%20paketi%20hakkında%20bilgi%20almak%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t('offer.whatsapp.button', 'WhatsApp ile Teklif Al')}
              </a>
            </div>
          </div>
          
          {/* Teklif Formu */}
          {submitStatus !== 'success' && (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
              {/* Kişisel Bilgiler */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">
                  {t('offer.sections.personalInfo', 'Kişisel Bilgileriniz')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* İsim Soyisim */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('offer.fields.fullName', 'Adınız Soyadınız')} *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('offer.placeholders.fullName', 'Adınız ve soyadınız')}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  {/* E-posta */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('offer.fields.email', 'E-posta Adresiniz')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('offer.placeholders.email', 'ornek@email.com')}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Telefon */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('offer.fields.phone', 'Telefon Numaranız')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('offer.placeholders.phone', '0555 123 4567')}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      {t('offer.notes.contactRequired', 'E-posta veya telefon numarasından en az birini belirtmelisiniz')}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Seyahat Bilgileri */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">
                  {t('offer.sections.travelInfo', 'Seyahat Bilgileri')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gidilecek Yer */}
                  <div>
                    <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('offer.fields.destination', 'Gidilecek Yer/Ülke')} *
                    </label>
                    <select
                      id="destination"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                        errors.destination ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">
                        {t('offer.placeholders.destination', 'Gidilecek yeri seçin')}
                      </option>
                      {formOptions?.destinations?.map((dest) => (
                        <option key={dest.value} value={dest.value}>
                          {dest.label}
                        </option>
                      ))}
                    </select>
                    {errors.destination && (
                      <p className="mt-1 text-sm text-red-600">{errors.destination}</p>
                    )}
                  </div>
                  
                  {/* Kişi Sayısı */}
                  <div>
                    <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('offer.fields.numberOfPeople', 'Kişi Sayısı')} *
                    </label>
                    <input
                      type="number"
                      id="numberOfPeople"
                      name="numberOfPeople"
                      min="1"
                      value={formData.numberOfPeople}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                        errors.numberOfPeople ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('offer.placeholders.numberOfPeople', 'Kaç kişi katılacak?')}
                    />
                    {errors.numberOfPeople && (
                      <p className="mt-1 text-sm text-red-600">{errors.numberOfPeople}</p>
                    )}
                  </div>
                  
                  {/* Gidiş Tarihi */}
                  <div>
                    <label htmlFor="travelDate" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('offer.fields.travelDate', 'Tahmini Gidiş Tarihi')}
                    </label>
                    <input
                      type="date"
                      id="travelDate"
                      name="travelDate"
                      value={formData.travelDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                  
                  {/* Dönüş Tarihi */}
                  <div>
                    <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('offer.fields.returnDate', 'Tahmini Dönüş Tarihi')}
                    </label>
                    <input
                      type="date"
                      id="returnDate"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                  
                  {/* Bütçe */}
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('offer.fields.budget', 'Kişi Başı Bütçe (₺)')}
                    </label>
                    <input
                      type="number"
                      id="budget"
                      name="budget"
                      min="0"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                        errors.budget ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('offer.placeholders.budget', 'Kişi başı bütçeniz')}
                    />
                    {errors.budget && (
                      <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Tercihler ve Ek Bilgiler */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">
                  {t('offer.sections.preferences', 'Tercihler ve Ek Bilgiler')}
                </h2>
                
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    {t('offer.fields.preferences', 'Özel Tercihleriniz')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {formOptions?.preferences?.map((pref) => (
                      <div key={pref.value} className="flex items-start">
                        <input
                          id={`pref-${pref.value}`}
                          name={`pref-${pref.value}`}
                          type="checkbox"
                          value={pref.value}
                          checked={formData.preferences.includes(pref.value)}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded mt-1"
                        />
                        <label htmlFor={`pref-${pref.value}`} className="ml-2 block text-sm text-gray-700">
                          {pref.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('offer.fields.additionalInfo', 'Ek Bilgiler veya Talepler')}
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    placeholder={t('offer.placeholders.additionalInfo', 'Ekstra bilgi vermek isterseniz buraya yazabilirsiniz...')}
                  ></textarea>
                </div>
              </div>
              
              {/* Gizlilik Bilgilendirmesi ve Gönder */}
              <div>
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <p className="text-sm text-gray-700">
                    {t('offer.notes.privacy', 'Bu formu doldurarak Endülüs Travel ile bilgilerinizin kaydedilmesine ve sizinle iletişime geçilmesine izin vermiş oluyorsunuz. Verileriniz üçüncü kişilerle paylaşılmayacaktır.')}
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={submitStatus === 'submitting'}
                  className={`w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition ${
                    submitStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {submitStatus === 'submitting' ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('offer.buttons.sending', 'Gönderiliyor...')}
                    </span>
                  ) : (
                    t('offer.buttons.submit', 'Teklif İste')
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestOfferPage; 