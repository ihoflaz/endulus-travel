import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LocaleLink as Link } from '../components/LocaleLink';
import { useLocaleNavigate } from '../hooks/useLocaleNavigate';
import Seo from '../components/Seo';
import PageHero from '../components/redesign/PageHero';
import { Reveal, Magnetic } from '../components/motion';

const MEDIA = '/uploads/media';

const TourPlanningPage = () => {
  const { t } = useTranslation();
  const navigate = useLocaleNavigate();

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

  // Wizard verilerini yükle
  useEffect(() => {
    const fetchWizardData = async () => {
      try {
        const response = await fetch('/data/tour-wizard.json');
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
      <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[var(--ds-line)] border-t-[var(--ds-gold)] rounded-full ds-spin-slow" style={{ animationDuration: '1s' }}></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-[var(--ds-gold-bright)] rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    );
  }

  // Veri yüklenmediyse (hata) — dark empty state
  if (!wizardData || wizardData.length === 0) {
    return (
      <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
        <Seo
          title={t('planning.pageTitle', 'Tur Planlama - Endülüs Travel')}
          description={t('tourPlanning.metaDescription', 'Adım adım tur planlama sihirbazımızla size özel seyahat rotanızı oluşturun. Destinasyon, süre, ilgi alanları ve bütçenizi belirleyin, hassasiyetlerinize uygun teklifinizi anında alın.')}
        />
        <div className="ds-container text-center py-32 flex flex-col items-center">
          <h3 className="ds-display text-2xl text-[var(--ds-text)] mb-3">{t('planning.errorTitle', 'Planlama sihirbazı yüklenemedi')}</h3>
          <p className="text-[var(--ds-text-muted)] max-w-md">{t('planning.errorDesc', 'Bir sorun oluştu. Lütfen daha sonra tekrar deneyin veya bizimle iletişime geçin.')}</p>
          <Link to="/teklif-al" className="ds-btn mt-8 inline-flex">{t('toursPage.ctaButton', 'Teklif Al')}</Link>
        </div>
      </div>
    );
  }

  // Mevcut adım bilgisini al
  const currentStepData = wizardData[currentStep];
  const currentStepId = currentStepData.step;
  const isMultiSelect = !!currentStepData.multiSelect;
  const progress = ((currentStep + 1) / wizardData.length) * 100;

  return (
    <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
      <Seo
        title={t('planning.pageTitle', 'Tur Planlama - Endülüs Travel')}
        description={t('tourPlanning.metaDescription', 'Adım adım tur planlama sihirbazımızla size özel seyahat rotanızı oluşturun. Destinasyon, süre, ilgi alanları ve bütçenizi belirleyin, hassasiyetlerinize uygun teklifinizi anında alın.')}
      />

      <PageHero
        video={`${MEDIA}/cappadocia.mp4`}
        poster={`${MEDIA}/cappadocia.jpg`}
        eyebrow={t('planning.stepByStepBadge', 'Adım Adım Planlama')}
        title={t('tourPlanning.title', 'Tur Planlama')}
        subtitle={t('tourPlanning.description', 'Size özel tur planınızı oluşturmak için adım adım rehberimizi takip edin. Hassasiyetlerinizi ve tercihlerinizi belirleyerek hayalinizdeki tur deneyimini yaşayın.')}
        breadcrumb={[
          { to: '/', label: t('navigation.home', 'Ana Sayfa') },
          { label: t('navigation.tourPlanning', 'Tur Planlama') },
        ]}
      />

      {/* Stat strip */}
      <section className="border-b border-[var(--ds-line)]">
        <div className="ds-container py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { value: '5', label: t('planning.statEasySteps', 'Kolay Adım') },
              { value: '10', label: t('planning.statMinutes', 'Dakika Sürer') },
              { value: '%100', label: t('planning.statCustomization', 'Özelleştirme') },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08}>
                <div className="ds-glass rounded-2xl px-6 py-7 text-center">
                  <div className="ds-display ds-gold-text text-4xl mb-1">{stat.value}</div>
                  <p className="text-sm tracking-wide text-[var(--ds-text-muted)]">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Wizard */}
      <section className="py-14 md:py-20">
        <div className="ds-container">

          {/* Progress */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="flex items-center justify-between mb-3 text-xs tracking-[0.18em] uppercase text-[var(--ds-text-muted)]">
              <span>{t('planning.progressStep', 'Adım')} {currentStep + 1} / {wizardData.length}</span>
              <span className="ds-gold-text font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--ds-line)' }}>
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%`, background: 'var(--ds-grad-gold)' }}
              />
            </div>
          </div>

          {/* Step info card */}
          <div className="max-w-3xl mx-auto mb-12">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl ds-glass p-8 md:p-10 text-center">
                <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'var(--ds-grad-gold)', opacity: 0.6 }} />
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg" style={{ background: 'var(--ds-grad-gold)', boxShadow: '0 12px 32px -12px rgba(217,178,90,0.6)' }}>
                  <span className="text-2xl font-bold" style={{ color: 'var(--ds-on-gold)' }}>{currentStep + 1}</span>
                </div>
                <h2 className="ds-display text-[var(--ds-text)] mb-4" style={{ fontSize: 'clamp(1.7rem,4vw,2.6rem)' }}>
                  {currentStepData.title}
                </h2>
                <p className="ds-lead text-[var(--ds-text-soft)] max-w-xl mx-auto">
                  {currentStepData.description}
                </p>
                {isMultiSelect && (
                  <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-[var(--ds-line-strong)] text-[var(--ds-gold-bright)]" style={{ background: 'var(--ds-glass)' }}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {t('planning.multiSelectInfo', 'Birden fazla seçim yapabilirsiniz')}
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-14">
            {currentStepData.options.map((option, index) => {
              // Seçim durumunu kontrol et
              const isSelected = isMultiSelect
                ? selections[currentStepId].includes(option.id)
                : selections[currentStepId] === option.id;

              return (
                <Reveal key={option.id} delay={(index % 3) * 0.07}>
                  <button
                    type="button"
                    onClick={() => handleSelection(currentStepId, option.id)}
                    aria-pressed={isSelected}
                    className={`group relative w-full text-left cursor-pointer rounded-3xl overflow-hidden transition-all duration-300 ease-out h-full ds-glass focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-gold)] ${
                      isSelected
                        ? '-translate-y-1.5 ring-2 ring-[var(--ds-gold)]'
                        : 'hover:-translate-y-1 hover:border-[var(--ds-line-strong)]'
                    }`}
                    style={isSelected ? { boxShadow: '0 20px 50px -18px rgba(217,178,90,0.5)' } : undefined}
                  >
                    {/* Gold wash when selected */}
                    {isSelected && (
                      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(160deg, rgba(217,178,90,0.16), rgba(217,178,90,0))' }} />
                    )}

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 z-20">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'var(--ds-grad-gold)' }}>
                          <svg className="w-5 h-5" style={{ color: 'var(--ds-on-gold)' }} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Image */}
                    <div className="relative w-full h-44 overflow-hidden">
                      <img
                        src={option.image}
                        alt={option.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(7,10,18,0) 35%, rgba(7,10,18,0.85) 100%)' }} />
                    </div>

                    {/* Text */}
                    <div className="relative z-10 p-6">
                      <h3 className={`ds-display text-xl mb-2 transition-colors ${isSelected ? 'ds-gold-text' : 'text-[var(--ds-text)] group-hover:text-[var(--ds-gold-bright)]'}`}>
                        {option.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-[var(--ds-text-muted)]">
                        {option.description}
                      </p>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center gap-4 max-w-3xl mx-auto">
            <button
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
              className={`group ds-btn-ghost ${currentStep === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>{t('planning.buttons.previous', 'Önceki')}</span>
            </button>

            <Magnetic>
              <button onClick={goToNextStep} className="group ds-btn">
                <span>
                  {currentStep < wizardData.length - 1
                    ? t('planning.buttons.next', 'Sonraki')
                    : t('planning.buttons.finish', 'Tamamla')}
                </span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </Magnetic>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TourPlanningPage;
