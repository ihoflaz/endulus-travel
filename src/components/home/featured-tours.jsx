import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTours } from '../../hooks/useTours';
import { formatTourPrice } from '../../utils/priceUtils';

const FeaturedTours = () => {
  const { tours, isLoading, error } = useTours();
  const [currentSlide, setCurrentSlide] = useState(0);

  const specialOfferTours = useMemo(
    () => tours.filter((t) => t && t.specialOffer),
    [tours]
  );

  // Auto-rotate slides every 5s when there are more than one.
  useEffect(() => {
    if (specialOfferTours.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % specialOfferTours.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [specialOfferTours.length]);

  // Reset to a valid index when the list shrinks.
  useEffect(() => {
    if (currentSlide >= specialOfferTours.length) setCurrentSlide(0);
  }, [specialOfferTours.length, currentSlide]);

  const nextSlide = () =>
    setCurrentSlide((p) => (p + 1) % Math.max(specialOfferTours.length, 1));
  const prevSlide = () =>
    setCurrentSlide(
      (p) => (p - 1 + specialOfferTours.length) % Math.max(specialOfferTours.length, 1)
    );
  const goToSlide = (i) => setCurrentSlide(i);

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded-md w-64 mx-auto mb-4" />
            <div className="h-4 bg-gray-300 rounded-md w-96 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (error || specialOfferTours.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Yaklaşan Turlarımız</h2>
          <p className="text-lg text-gray-600">
            Şu anda özel teklifli tur bulunmamaktadır.
          </p>
        </div>
      </section>
    );
  }

  const currentTour = specialOfferTours[currentSlide];
  if (!currentTour) return null;

  // Fallback chain: image → first gallery item → placeholder
  const coverImage =
    currentTour.image ||
    currentTour.gallery?.[0] ||
    '/images/placeholder-tour.jpg';

  const discountPct =
    currentTour.originalPrice && currentTour.pricePerPerson
      ? Math.round(
          ((currentTour.originalPrice - currentTour.pricePerPerson) /
            currentTour.originalPrice) *
            100
        )
      : null;

  const currencySymbol =
    currentTour.currency === 'EUR' ? '€' : currentTour.currency === 'USD' ? '$' : '₺';

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Yaklaşan Turlarımız</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Özel indirimli turlarımızı kaçırmayın! Sınırlı süre ve kontenjanla.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white">
            <div className="relative h-96 overflow-hidden">
              <img
                src={coverImage}
                alt={currentTour.title || 'Tur'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  🔥 Özel Teklif
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{currentTour.title}</h3>
                <p className="text-gray-200 mb-4 line-clamp-2">{currentTour.description}</p>
                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                  {currentTour.duration && (
                    <div className="flex items-center gap-1"><span>📅</span><span>{currentTour.duration}</span></div>
                  )}
                  {currentTour.groupSize && (
                    <div className="flex items-center gap-1"><span>👥</span><span>{currentTour.groupSize}</span></div>
                  )}
                  {currentTour.destination && (
                    <div className="flex items-center gap-1"><span>🌍</span><span>{currentTour.destination}</span></div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  {discountPct != null && discountPct > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 line-through text-lg">
                        {currentTour.originalPrice.toLocaleString('tr-TR')} {currencySymbol}
                      </span>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-bold">
                        %{discountPct} İndirim
                      </span>
                    </div>
                  )}
                  <div className="text-3xl font-bold text-blue-700">
                    {formatTourPrice(currentTour)}
                  </div>
                  <div className="text-sm text-gray-500">Kişi başı</div>
                </div>

                <Link
                  to={`/turlar/${currentTour.slug}`}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Detayları Gör
                </Link>
              </div>

              {currentTour.highlights?.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Öne Çıkanlar</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    {currentTour.highlights.slice(0, 4).map((h, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <span className="text-green-500">✓</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {specialOfferTours.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Önceki tur"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Sonraki tur"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="flex justify-center mt-6 space-x-2">
                {specialOfferTours.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentSlide
                        ? 'bg-blue-700 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`${index + 1}. tura git`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">⏰ Sınırlı süre teklifleri - Acele edin!</p>
          <Link
            to="/turlar"
            className="inline-flex items-center text-blue-700 hover:text-blue-800 font-semibold transition-colors"
          >
            Tüm Turları Gör
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTours;
