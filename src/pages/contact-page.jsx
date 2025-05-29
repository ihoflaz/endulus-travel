import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  const { t } = useTranslation();
  const [contactData, setContactData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  // Sayfa başlığını ayarla
  useEffect(() => {
    document.title = t('contact.pageTitle', 'İletişim - Endülüs Travel');
  }, [t]);

  // İletişim verilerini yükle
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch('data/contact.json');
        if (!response.ok) {
          throw new Error('İletişim verileri yüklenemedi');
        }
        const data = await response.json();
        setContactData(data);
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
      }
    };

    fetchContactData();
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

  // Form doğrulama
  const validateForm = () => {
    const newErrors = {};
    
    // İsim kontrolü
    if (!formData.name.trim()) {
      newErrors.name = t('contact.errors.nameRequired', 'İsim zorunludur');
    }
    
    // E-posta kontrolü
    if (!formData.email.trim()) {
      newErrors.email = t('contact.errors.emailRequired', 'E-posta zorunludur');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = t('contact.errors.emailInvalid', 'Geçerli bir e-posta adresi giriniz');
    }
    
    // Telefon kontrolü
    if (formData.phone && !/^(\+90|0)?\s*([0-9]{3})\s*([0-9]{3})\s*([0-9]{2})\s*([0-9]{2})$/.test(formData.phone)) {
      newErrors.phone = t('contact.errors.phoneInvalid', 'Geçerli bir telefon numarası giriniz');
    }
    
    // Konu kontrolü
    if (!formData.subject.trim()) {
      newErrors.subject = t('contact.errors.subjectRequired', 'Konu zorunludur');
    }
    
    // Mesaj kontrolü
    if (!formData.message.trim()) {
      newErrors.message = t('contact.errors.messageRequired', 'Mesaj zorunludur');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('contact.errors.messageLength', 'Mesaj en az 10 karakter olmalıdır');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form gönderimi
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setSubmitStatus('submitting');
      
      // Sunucuya gönderme simülasyonu - Gerçek projede API çağrısı yapılacak
      setTimeout(() => {
        setSubmitStatus('success');
        
        // Formu sıfırla
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        
        // 3 saniye sonra başarı mesajını kaldır
        setTimeout(() => {
          setSubmitStatus(null);
        }, 3000);
      }, 1500);
    }
  };

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
              <Link to="/" className="text-white/80 hover:text-white transition-colors">
                {t('navigation.home')}
              </Link>
              <span className="text-white/60 mx-2">&gt;</span>
              <span className="text-[color-secondary]">{t('navigation.contact')}</span>
            </div>

            {/* Hero Content */}
            <div className="text-center text-white max-w-4xl mx-auto">
              <div className="mb-6 animate-fade-in">
                <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-[color-secondary] text-sm font-semibold rounded-full border border-white/30">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {t('contact.badge', 'Bizimle İletişime Geçin')}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {t('contact.title', 'İletişim')}
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {t('contact.description', 'Sorularınız, önerileriniz veya istekleriniz için aşağıdaki iletişim bilgilerimizden bize ulaşabilirsiniz.')}
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">24</h3>
                  <p className="text-white/90">Saat İçinde Yanıt</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">7/24</h3>
                  <p className="text-white/90">Destek Hattı</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">%100</h3>
                  <p className="text-white/90">Müşteri Memnuniyeti</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Content Section */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* İki Sütunlu Bölüm */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* İletişim Bilgileri */}
            <div className="lg:col-span-1">
              <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover-float animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
                
                <div className="relative z-10 p-8">
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-[color-primary] to-blue-600 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {t('contact.contactInfo', 'İletişim Bilgilerimiz')}
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Adres */}
                    <div className="group bg-white/50 backdrop-blur-sm rounded-xl p-4 hover:bg-white/80 transition-all duration-300 hover-float">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-[color-primary]/10 rounded-full flex items-center justify-center mr-4 mt-1 group-hover:bg-[color-primary]/20 transition-colors">
                          <svg className="w-5 h-5 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">{t('contact.address', 'Adres')}</h3>
                          <p className="text-gray-600">
                            {contactData?.address || 'İstanbul, Türkiye'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Telefon */}
                    <div className="group bg-white/50 backdrop-blur-sm rounded-xl p-4 hover:bg-white/80 transition-all duration-300 hover-float">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-[color-primary]/10 rounded-full flex items-center justify-center mr-4 mt-1 group-hover:bg-[color-primary]/20 transition-colors">
                          <svg className="w-5 h-5 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">{t('contact.phone', 'Telefon')}</h3>
                          <a href="tel:+905551234567" className="text-gray-600 hover:text-[color-primary] transition-colors font-medium">
                            {contactData?.phone || '+90 (555) 123 4567'}
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    {/* E-posta */}
                    <div className="group bg-white/50 backdrop-blur-sm rounded-xl p-4 hover:bg-white/80 transition-all duration-300 hover-float">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-[color-primary]/10 rounded-full flex items-center justify-center mr-4 mt-1 group-hover:bg-[color-primary]/20 transition-colors">
                          <svg className="w-5 h-5 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">{t('contact.email', 'E-posta')}</h3>
                          <a href="mailto:info@endulustravel.com" className="text-gray-600 hover:text-[color-primary] transition-colors font-medium">
                            {contactData?.email || 'info@endulustravel.com'}
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    {/* Çalışma Saatleri */}
                    <div className="group bg-white/50 backdrop-blur-sm rounded-xl p-4 hover:bg-white/80 transition-all duration-300 hover-float">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-[color-primary]/10 rounded-full flex items-center justify-center mr-4 mt-1 group-hover:bg-[color-primary]/20 transition-colors">
                          <svg className="w-5 h-5 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">{t('contact.workingHours', 'Çalışma Saatleri')}</h3>
                          <p className="text-gray-600">
                            {contactData?.workingHours || 'Pazartesi - Cuma: 09:00 - 18:00'}
                            <br />
                            {contactData?.weekendHours || 'Cumartesi: 10:00 - 14:00'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sosyal Medya */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-4">{t('contact.followUs', 'Bizi Takip Edin')}</h3>
                    <div className="flex space-x-3">
                      {[
                        { name: 'Facebook', href: 'https://facebook.com', color: 'hover:bg-blue-600' },
                        { name: 'Instagram', href: 'https://instagram.com', color: 'hover:bg-pink-600' },
                        { name: 'Twitter', href: 'https://twitter.com', color: 'hover:bg-blue-400' },
                        { name: 'LinkedIn', href: 'https://linkedin.com', color: 'hover:bg-blue-700' }
                      ].map((social) => (
                        <a 
                          key={social.name}
                          href={social.href} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`p-3 bg-gray-100 hover:text-white ${social.color} rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg group`}
                          aria-label={`${social.name}'da takip edin`}
                        >
                          <svg className="h-5 w-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            {social.name === 'Facebook' && (
                              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                            )}
                            {social.name === 'Instagram' && (
                              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                            )}
                            {social.name === 'Twitter' && (
                              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            )}
                            {social.name === 'LinkedIn' && (
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            )}
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* İletişim Formu */}
            <div className="lg:col-span-2">
              <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-blue-100/50 to-transparent"></div>
                
                <div className="relative z-10 p-8">
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-[color-primary] to-blue-600 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {t('contact.sendMessage', 'Bize Mesaj Gönderin')}
                    </h2>
                  </div>
                  
                  {/* Başarı Mesajı */}
                  {submitStatus === 'success' && (
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-6 text-white mb-8 animate-fade-in">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-6 -translate-y-6"></div>
                      <div className="relative z-10 flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">
                            {t('contact.messageSent', 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* İsim */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('contact.form.name', 'İsim Soyisim')} *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[color-primary] focus:border-transparent outline-none transition-all duration-300 hover:border-[color-primary]/50 ${
                            errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder={t('contact.form.namePlaceholder', 'Adınız Soyadınız')}
                        />
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.name}
                          </p>
                        )}
                      </div>
                      
                      {/* E-posta */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('contact.form.email', 'E-posta')} *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[color-primary] focus:border-transparent outline-none transition-all duration-300 hover:border-[color-primary]/50 ${
                            errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder={t('contact.form.emailPlaceholder', 'ornek@email.com')}
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
                      
                      {/* Telefon */}
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('contact.form.phone', 'Telefon')}
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[color-primary] focus:border-transparent outline-none transition-all duration-300 hover:border-[color-primary]/50 ${
                            errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder={t('contact.form.phonePlaceholder', '0555 123 4567')}
                        />
                        {errors.phone && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.phone}
                          </p>
                        )}
                      </div>
                      
                      {/* Konu */}
                      <div>
                        <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('contact.form.subject', 'Konu')} *
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[color-primary] focus:border-transparent outline-none transition-all duration-300 hover:border-[color-primary]/50 ${
                            errors.subject ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder={t('contact.form.subjectPlaceholder', 'Mesajınızın konusu')}
                        />
                        {errors.subject && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.subject}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Mesaj */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('contact.form.message', 'Mesajınız')} *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="6"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[color-primary] focus:border-transparent outline-none transition-all duration-300 hover:border-[color-primary]/50 resize-none ${
                          errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder={t('contact.form.messagePlaceholder', 'Lütfen mesajınızı yazın...')}
                      ></textarea>
                      {errors.message && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.message}
                        </p>
                      )}
                    </div>
                    
                    {/* Gönder Butonu */}
                    <div>
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
                            <span>{t('contact.form.sending', 'Gönderiliyor...')}</span>
                          </>
                        ) : (
                          <>
                            <span>{t('contact.form.send', 'Mesajı Gönder')}</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 