import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHeroData } from '../../hooks/useAppData';
import TrustStrip from '../TrustStrip';

// Fallback slides used when the API hasn't responded yet (or returns empty).
const FALLBACK_SLIDES = Array.from({ length: 22 }, (_, i) => ({
  image: `/images/slider/${i + 1}.jpg`,
  alt: `Endülüs Travel Slider ${i + 1}`,
}));

const HeroSection = () => {
  const { t } = useTranslation();
  const { heroData } = useHeroData();
  const slides = useMemo(() => {
    const fromApi = heroData?.slides;
    if (Array.isArray(fromApi) && fromApi.length > 0) return fromApi;
    return FALLBACK_SLIDES;
  }, [heroData]);

  const slogan = heroData?.slogan;
  const buttons = Array.isArray(heroData?.buttons) ? heroData.buttons : [];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);
  useEffect(() => {
    if (currentImageIndex >= slides.length) setCurrentImageIndex(0);
  }, [slides.length, currentImageIndex]);

  // Visual hierarchy: the FIRST button is always the dominant primary CTA
  // (large amber pill). Remaining buttons render as quieter secondary links.
  // This deliberately overrides admin-supplied style values to enforce the
  // "single primary CTA" rule that the marketing brief requires.
  const buttonClass = (_style, index) => {
    if (index === 0) {
      return 'bg-amber-500 hover:bg-amber-600 text-white text-base sm:text-lg shadow-2xl ring-2 ring-white/20 hover:ring-white/40 px-8 py-4 transform hover:-translate-y-0.5';
    }
    return 'bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 text-sm';
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.image ?? index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt || `Endülüs Travel Slider ${index + 1}`}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Premium Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 pt-20 md:pt-16">
        <div className="max-w-5xl mx-auto text-center text-white">
          <div className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4 md:mb-6 lg:mb-8 animate-fade-in">
            <span className="text-amber-400 font-semibold mr-2">✨</span>
            <span className="text-xs md:text-sm font-medium text-center">
              {t('homeHero.badge', 'Hassasiyetlerinizi gözeten özel tur deneyimleri')}
            </span>
          </div>

          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 md:mb-4 lg:mb-6 drop-shadow-2xl animate-fade-in px-2 sm:px-4 leading-tight"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="block">{t('homeHero.titleLine1', 'Bizimle çıktığınız hiçbir yolculuk')}</span>
            <span className="block text-amber-400 mt-1 md:mt-2">{t('homeHero.titleLine2', '"herkes için aynı"')}</span>
            <span className="block mt-1 md:mt-2">{t('homeHero.titleLine3', 'değildir.')}</span>
          </h1>

          <p
            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-4 md:mb-6 lg:mb-8 opacity-90 leading-relaxed max-w-4xl mx-auto animate-fade-in px-2 sm:px-4"
            style={{ animationDelay: '0.4s' }}
          >
            {slogan ? (
              <span className="block">{slogan}</span>
            ) : (
              <>
                <span className="block mb-2">
                  {t('homeHero.subtitleLine1', 'Çünkü biliyoruz ki, herkesin beklentisi, önceliği ve konfor alanı farklıdır.')}
                </span>
                <span className="hidden sm:block">
                  {t('homeHero.subtitleLine2', 'Kişiye ve gruba özel, hassasiyet odaklı seyahat deneyimleri ile hayalinizdeki tatili gerçekleştiriyoruz.')}
                </span>
              </>
            )}
          </p>

          {/* Admin-managed buttons — first one is the visual primary CTA */}
          {buttons.length > 0 && (
            <div
              className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4 animate-fade-in"
              style={{ animationDelay: '0.6s' }}
            >
              {buttons.map((b, i) => (
                <a
                  key={`${b.href}-${i}`}
                  href={b.href}
                  className={`rounded-lg font-semibold transition-all duration-200 hover:shadow-xl ${
                    i === 0 ? '' : 'px-5 py-2.5'
                  } ${buttonClass(b.style, i)}`}
                >
                  {b.label}
                </a>
              ))}
            </div>
          )}

          {/* Trust strip — niche-specific guarantees right under the CTA */}
          <div
            className="mt-8 flex justify-center animate-fade-in"
            style={{ animationDelay: '0.8s' }}
          >
            <TrustStrip />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
