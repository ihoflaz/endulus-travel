import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';

const TourPlanningPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Wizard adımları için state
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Kullanıcı seçimleri için state
  const [selections, setSelections] = useState({
    destination: '',
    duration: '',
    travelers: '',
    interests: [],
    budget: ''
  });

  // Sayfa başlığını ayarla
  useEffect(() => {
    document.title = t('planning.pageTitle', 'Tur Planlama - Endülüs Travel');
  }, [t]);

  // Wizard verilerini yükle
  useEffect(() => {
    const fetchWizardData = async () => {
      try {
        const response = await fetch('data/tour-wizard.json');
        if (!response.ok) {
          throw new Error('Wizard verileri yüklenemedi');
        }
        const data = await response.json();
        setWizardData(data);
        setLoading(false);
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
        setLoading(false);
      }
    };

    fetchWizardData();
  }, []);

  // Kullanıcı seçimlerini işle
  const handleSelection = (stepId, optionId) => {
    if (stepId === 'interests') {
      // İlgi alanları için çoklu seçim
      setSelections(prev => {
        const currentInterests = [...prev.interests];
        
        // Seçili değilse ekle, seçili ise çıkar
        if (currentInterests.includes(optionId)) {
          return {
            ...prev,
            interests: currentInterests.filter(id => id !== optionId)
          };
        } else {
          return {
            ...prev,
            interests: [...currentInterests, optionId]
          };
        }
      });
    } else {
      // Diğer adımlar için tekli seçim
      setSelections(prev => ({
        ...prev,
        [stepId]: optionId
      }));
    }
  };

  // Sonraki adıma geç
  const goToNextStep = () => {
    // Mevcut adımda seçim yapılmış mı kontrol et
    const currentStepId = wizardData[currentStep].step;
    
    if (currentStepId === 'interests') {
      // İlgi alanları için en az bir seçim yapılmalı
      if (selections.interests.length === 0) {
        alert(t('planning.errors.selectInterests', 'Lütfen en az bir ilgi alanı seçin'));
        return;
      }
    } else {
      // Diğer adımlar için seçim kontrolü
      if (!selections[currentStepId]) {
        alert(t('planning.errors.makeSelection', 'Lütfen bir seçim yapın'));
        return;
      }
    }
    
    // Son adım kontrolü
    if (currentStep < wizardData.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Tüm adımlar tamamlandı, sonuç sayfasına git
      finalizePlan();
    }
  };

  // Önceki adıma dön
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Tur planlamasını tamamla
  const finalizePlan = () => {
    // Tüm seçimleri tamamlandı, teklif al sayfasına yönlendir
    // İlgili seçimleri URL parametresi olarak gönder
    const queryParams = new URLSearchParams();
    queryParams.append('destination', selections.destination);
    queryParams.append('duration', selections.duration);
    queryParams.append('travelers', selections.travelers);
    queryParams.append('interests', selections.interests.join(','));
    queryParams.append('budget', selections.budget);
    
    navigate(`/teklif-al?${queryParams.toString()}`);
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

  // Mevcut adım bilgisini al
  const currentStepData = wizardData[currentStep];
  const currentStepId = currentStepData.step;
  const isMultiSelect = !!currentStepData.multiSelect;

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
              <span className="text-[color-secondary]">{t('navigation.tourPlanning')}</span>
            </div>

            {/* Hero Content */}
            <div className="text-center text-white max-w-4xl mx-auto">
              <div className="mb-6 animate-fade-in">
                <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-[color-secondary] text-sm font-semibold rounded-full border border-white/30">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Adım Adım Planlama
                </span>
        </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {t('tourPlanning.title', 'Tur Planlama')}
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {t('tourPlanning.description', 'Size özel tur planınızı oluşturmak için adım adım rehberimizi takip edin. Hassasiyetlerinizi ve tercihlerinizi belirleyerek hayalinizdeki tur deneyimini yaşayın.')}
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">5</h3>
                  <p className="text-white/90">Kolay Adım</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">10</h3>
                  <p className="text-white/90">Dakika Sürer</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">%100</h3>
                  <p className="text-white/90">Özelleştirme</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Content Section */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Premium Step Info Card */}
          <div className="max-w-3xl mx-auto mb-12 animate-fade-in">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100">
              <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-blue-100/50 to-transparent"></div>
              <div className="relative z-10 p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[color-primary] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{currentStep + 1}</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {currentStepData.title}
          </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
            {currentStepData.description}
          </p>
          {isMultiSelect && (
                  <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 text-[color-primary] rounded-full text-sm font-medium">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
              {t('planning.multiSelectInfo', 'Birden fazla seçim yapabilirsiniz')}
                  </div>
          )}
              </div>
            </div>
        </div>

          {/* Premium Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {currentStepData.options.map((option, index) => {
            // Seçim durumunu kontrol et
            const isSelected = isMultiSelect 
              ? selections[currentStepId].includes(option.id)
              : selections[currentStepId] === option.id;

            return (
              <div 
                key={option.id}
                onClick={() => handleSelection(currentStepId, option.id)}
                className={`
                    relative cursor-pointer group transition-all duration-300 ease-out hover:scale-105 animate-fade-in
                  ${isSelected 
                      ? 'transform -translate-y-2' 
                      : 'hover:-translate-y-1'
                    }
                  `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Glass Card Design */}
                  <div className={`
                    relative overflow-hidden rounded-2xl transition-all duration-300 h-full
                    ${isSelected 
                      ? 'bg-gradient-to-br from-[color-primary] to-blue-600 text-white shadow-2xl ring-4 ring-[color-secondary]/50' 
                      : 'bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl hover:shadow-2xl hover:bg-white/90'
                  }
                  `}>
                    
                    {/* Background Effects */}
                    {!isSelected && (
                      <>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[color-primary]/10 to-transparent rounded-full transform -translate-x-6 translate-y-6"></div>
                      </>
                    )}

                    {/* Selection Indicator */}
                {isSelected && (
                      <div className="absolute top-4 right-4 z-20">
                        <div className="w-8 h-8 bg-[color-secondary] rounded-full flex items-center justify-center shadow-lg animate-bounce">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                        </div>
                  </div>
                )}

                    {/* Content */}
                    <div className="relative z-10 p-6">
                      {/* Image */}
                      <div className="w-full h-48 mb-6 rounded-xl overflow-hidden">
                  <img 
                    src={option.image} 
                    alt={option.name}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  />
                </div>

                      {/* Text Content */}
                      <div className="text-center">
                        <h3 className={`text-xl font-bold mb-3 transition-colors ${
                          isSelected ? 'text-white' : 'text-gray-800 group-hover:text-[color-primary]'
                        }`}>
                          {option.name}
                        </h3>
                        <p className={`text-sm leading-relaxed ${
                          isSelected ? 'text-white/90' : 'text-gray-600'
                        }`}>
                          {option.description}
                        </p>
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    {!isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[color-primary]/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                </div>
              </div>
            );
          })}
        </div>

          {/* Premium Navigation Buttons */}
          <div className="flex justify-between items-center max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={goToPreviousStep}
            disabled={currentStep === 0}
              className={`group inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                currentStep === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-[color-primary] hover:scale-105 hover:shadow-lg border border-gray-200'
              }`}
          >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>{t('planning.buttons.previous', 'Önceki')}</span>
          </button>
          
          <button
            onClick={goToNextStep}
              className="group bg-gradient-to-r from-[color-primary] to-blue-600 hover:from-blue-600 hover:to-[color-primary] text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center space-x-2"
          >
              <span>
            {currentStep < wizardData.length - 1 
              ? t('planning.buttons.next', 'Sonraki') 
              : t('planning.buttons.finish', 'Tamamla')}
              </span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourPlanningPage; 