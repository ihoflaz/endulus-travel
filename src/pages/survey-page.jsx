import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const SurveyPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    groupType: '',
    travelPreferences: [],
    otherPreferences: [],
    specialRequests: ''
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sayfa başlığını ayarla
  useEffect(() => {
    document.title = t('survey.pageTitle', 'Ön Anket - Endülüs Travel');
  }, [t]);

  // Anket sorularını yükle
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('data/survey-questions.json');
        if (!response.ok) {
          throw new Error('Anket soruları yüklenemedi');
        }
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
  const handleCheckboxChange = (e, category) => {
    const { value, checked } = e.target;
    
    setFormData((prev) => {
      // Mevcut seçimler
      const currentSelections = prev[category] || [];
      
      // Seçim ekle veya çıkar
      const updatedSelections = checked
        ? [...currentSelections, value]
        : currentSelections.filter(item => item !== value);
      
      return {
        ...prev,
        [category]: updatedSelections,
      };
    });
  };

  // Form doğrulama
  const validateForm = () => {
    const newErrors = {};
    
    // İsim kontrolü
    if (!formData.fullName.trim()) {
      newErrors.fullName = t('survey.errors.nameRequired', 'İsim zorunludur');
    }
    
    // E-posta veya telefon zorunluluğu
    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.email = t('survey.errors.contactRequired', 'E-posta veya telefon numarasından en az biri zorunludur');
      newErrors.phone = t('survey.errors.contactRequired', 'E-posta veya telefon numarasından en az biri zorunludur');
    } else {
      // E-posta kontrolü (girildi ise)
      if (formData.email.trim() && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
        newErrors.email = t('survey.errors.emailInvalid', 'Geçerli bir e-posta adresi giriniz');
      }
      
      // Telefon kontrolü (girildi ise)
      if (formData.phone.trim() && !/^(\+90|0)?\s*([0-9]{3})\s*([0-9]{3})\s*([0-9]{2})\s*([0-9]{2})$/.test(formData.phone)) {
        newErrors.phone = t('survey.errors.phoneInvalid', 'Geçerli bir telefon numarası giriniz');
      }
    }
    
    // Grup türü kontrolü
    if (!formData.groupType) {
      newErrors.groupType = t('survey.errors.groupTypeRequired', 'Lütfen bir grup türü seçin');
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
          groupType: '',
          travelPreferences: [],
          otherPreferences: [],
          specialRequests: ''
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
            {/* Hero Content */}
            <div className="text-center text-white max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <div className="mb-6 animate-fade-in">
                <Link to="/" className="text-white/80 hover:text-white transition-colors">
                  {t('navigation.home')}
                </Link>
                <span className="text-white/60 mx-2">&gt;</span>
                <span className="text-[color-secondary]">{t('navigation.survey')}</span>
              </div>
              
              <div className="mb-6 animate-fade-in">
                <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-[color-secondary] text-sm font-semibold rounded-full border border-white/30">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {t('survey.badge', 'Kişiselleştirilmiş Seyahat')}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {t('survey.title', 'Ön Anket Formu')}
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {t('survey.description', 'Sizin için en uygun tur deneyimini oluşturabilmemiz için lütfen aşağıdaki formu doldurunuz. Bu bilgiler, ihtiyaçlarınıza ve beklentilerinize göre kişiselleştirilmiş bir seyahat planlamak için kullanılacaktır.')}
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-[color-secondary] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-[color-primary]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Kişiselleştirilmiş</h3>
                  <p className="text-white/90 text-sm">Size özel tur planı</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-[color-secondary] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-[color-primary]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Hızlı İşlem</h3>
                  <p className="text-white/90 text-sm">2 dakika sürer</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-[color-secondary] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-[color-primary]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Güvenli</h3>
                  <p className="text-white/90 text-sm">Verileriniz korunur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Content Section */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          
          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-green-600 p-8 text-white mb-12 animate-fade-in">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
              <div className="relative z-10 flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold mb-2">
                    {t('survey.success.title', 'Talebiniz Alındı')}
                  </h3>
                  <p className="text-white/90 mb-6">
                    {t('survey.success.message', 'Anket yanıtlarınız başarıyla kaydedildi. Uzman ekibimiz en kısa sürede sizinle iletişime geçecek ve size özel seyahat planı hakkında bilgi verecektir.')}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitStatus(null)}
                    className="group bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/30 inline-flex items-center space-x-2"
                  >
                    <span>{t('survey.success.newForm', 'Yeni Form Doldur')}</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Survey Form */}
          {submitStatus !== 'success' && (
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100 animate-fade-in">
              <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-blue-100/50 to-transparent"></div>
              <div className="relative z-10 p-8 md:p-12">
                
                <form onSubmit={handleSubmit} className="space-y-12">
                  {/* Personal Information Section */}
                  <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center mb-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-[color-primary] to-blue-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-xl font-bold text-white">1</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">
                          {t('survey.sections.personalInfo', 'Kişisel Bilgileriniz')}
                        </h2>
                        <p className="text-gray-600">Size ulaşabilmemiz için temel bilgileriniz</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div className="col-span-2 md:col-span-1">
                        <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('survey.fields.fullName', 'Adınız Soyadınız')} *
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[color-primary] focus:border-transparent outline-none transition-all duration-300 ${
                            errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-[color-primary]/50'
                          }`}
                          placeholder={t('survey.placeholders.fullName', 'Adınız ve soyadınız')}
                        />
                        {errors.fullName && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="col-span-2 md:col-span-1">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('survey.fields.email', 'E-posta Adresiniz')}
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[color-primary] focus:border-transparent outline-none transition-all duration-300 ${
                            errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-[color-primary]/50'
                          }`}
                          placeholder={t('survey.placeholders.email', 'ornek@email.com')}
                        />
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="col-span-2 md:col-span-1">
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('survey.fields.phone', 'Telefon Numaranız')}
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[color-primary] focus:border-transparent outline-none transition-all duration-300 ${
                            errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-[color-primary]/50'
                          }`}
                          placeholder={t('survey.placeholders.phone', '0555 123 4567')}
                        />
                        {errors.phone && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.phone}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-gray-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          {t('survey.notes.contactRequired', 'E-posta veya telefon numarasından en az birini belirtmelisiniz')}
                        </p>
                      </div>
                      
                      {/* Group Type */}
                      <div className="col-span-2 md:col-span-1">
                        <label htmlFor="groupType" className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('survey.fields.groupType', 'Grup Yapınız')} *
                        </label>
                        <select
                          id="groupType"
                          name="groupType"
                          value={formData.groupType}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[color-primary] focus:border-transparent outline-none transition-all duration-300 ${
                            errors.groupType ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-[color-primary]/50'
                          }`}
                        >
                          <option value="">
                            {t('survey.placeholders.groupType', 'Grup türünüzü seçin')}
                          </option>
                          {questions?.groupTypes?.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                        {errors.groupType && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.groupType}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Travel Preferences Section */}
                  <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center mb-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-[color-primary] to-blue-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-xl font-bold text-white">2</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">
                          {t('survey.sections.preferences', 'Seyahat Tercihleriniz')}
                        </h2>
                        <p className="text-gray-600">Size uygun tur planı oluşturmamıza yardımcı olun</p>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      {/* Travel Preferences */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <p className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                          <svg className="w-6 h-6 mr-2 text-[color-primary]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {t('survey.questions.travelPreferences', 'Seyahatlerinizde öncelikli tercihleriniz nelerdir?')}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {questions?.travelPreferences?.map((preference) => (
                            <label key={preference.value} className="group cursor-pointer">
                              <div className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                                formData.travelPreferences.includes(preference.value)
                                  ? 'border-[color-primary] bg-[color-primary]/5 shadow-md'
                                  : 'border-gray-200 hover:border-[color-primary]/30 hover:shadow-sm'
                              }`}>
                                <div className="flex items-start">
                                  <input
                                    id={`pref-${preference.value}`}
                                    name={preference.value}
                                    type="checkbox"
                                    value={preference.value}
                                    checked={formData.travelPreferences.includes(preference.value)}
                                    onChange={(e) => handleCheckboxChange(e, 'travelPreferences')}
                                    className="h-5 w-5 text-[color-primary] border-gray-300 rounded mt-0.5 focus:ring-[color-primary]"
                                  />
                                  <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-[color-primary] transition-colors">
                                    {preference.label}
                                  </span>
                                </div>
                                {formData.travelPreferences.includes(preference.value) && (
                                  <div className="absolute top-2 right-2">
                                    <svg className="w-5 h-5 text-[color-primary]" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Other Preferences */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <p className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                          <svg className="w-6 h-6 mr-2 text-[color-primary]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {t('survey.questions.otherPreferences', 'Diğer tercihleriniz/hassasiyetleriniz:')}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {questions?.otherPreferences?.map((preference) => (
                            <label key={preference.value} className="group cursor-pointer">
                              <div className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                                formData.otherPreferences.includes(preference.value)
                                  ? 'border-[color-primary] bg-[color-primary]/5 shadow-md'
                                  : 'border-gray-200 hover:border-[color-primary]/30 hover:shadow-sm'
                              }`}>
                                <div className="flex items-start">
                                  <input
                                    id={`other-${preference.value}`}
                                    name={preference.value}
                                    type="checkbox"
                                    value={preference.value}
                                    checked={formData.otherPreferences.includes(preference.value)}
                                    onChange={(e) => handleCheckboxChange(e, 'otherPreferences')}
                                    className="h-5 w-5 text-[color-primary] border-gray-300 rounded mt-0.5 focus:ring-[color-primary]"
                                  />
                                  <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-[color-primary] transition-colors">
                                    {preference.label}
                                  </span>
                                </div>
                                {formData.otherPreferences.includes(preference.value) && (
                                  <div className="absolute top-2 right-2">
                                    <svg className="w-5 h-5 text-[color-primary]" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Special Requests Section */}
                  <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center mb-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-[color-primary] to-blue-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-xl font-bold text-white">3</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">
                          {t('survey.sections.specialRequests', 'Özel Talepler')}
                        </h2>
                        <p className="text-gray-600">Eklemek istediğiniz özel notlar</p>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="specialRequests" className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('survey.fields.specialRequests', 'Belirtmek istediğiniz diğer özel talepleriniz:')}
                      </label>
                      <textarea
                        id="specialRequests"
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        rows="5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[color-primary] focus:border-transparent outline-none transition-all duration-300 hover:border-[color-primary]/50 resize-none"
                        placeholder={t('survey.placeholders.specialRequests', 'Ekstra bilgi vermek isterseniz buraya yazabilirsiniz...')}
                      ></textarea>
                    </div>
                  </div>
                  
                  {/* Privacy Notice and Submit */}
                  <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className="bg-blue-50 p-6 rounded-xl mb-8">
                      <div className="flex items-start">
                        <svg className="w-6 h-6 text-[color-primary] mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {t('survey.notes.privacy', 'Bu formu doldurarak bilgilerinizin kaydedilmesine ve sizinle iletişime geçilmesine izin vermiş oluyorsunuz. Verileriniz üçüncü kişilerle paylaşılmayacaktır.')}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={submitStatus === 'submitting'}
                      className={`group w-full bg-gradient-to-r from-[color-primary] to-blue-600 hover:from-blue-600 hover:to-[color-primary] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center space-x-3 ${
                        submitStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {submitStatus === 'submitting' ? (
                        <>
                          <div className="relative">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          </div>
                          <span>{t('survey.buttons.sending', 'Gönderiliyor...')}</span>
                        </>
                      ) : (
                        <>
                          <span>{t('survey.buttons.submit', 'Anketi Gönder')}</span>
                          <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyPage; 