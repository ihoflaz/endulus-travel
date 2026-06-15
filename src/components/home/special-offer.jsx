import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LocaleLink as Link } from '../LocaleLink';
import { useTours } from '../../hooks/useTours';
import { formatTourPrice } from '../../utils/priceUtils';
import { useWhatsAppSettings } from '../../hooks/useAppData';

// Picks the first Tour with `specialOffer: true` from the API and renders it.
// Falls back to nothing (renders empty container) when no special offers exist.
const SpecialOffer = () => {
  const { t } = useTranslation();
  const { tours, isLoading } = useTours();
  const { value: whatsapp } = useWhatsAppSettings();
  const featured = useMemo(
    () => tours.find((t) => t.specialOffer),
    [tours]
  );

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="container mx-auto px-4 text-center text-slate-400">{t('homeSpecialOffer.loading', 'Yükleniyor…')}</div>
      </section>
    );
  }
  if (!featured) return null;

  const waNumber = (whatsapp?.number || '905079384508').replace(/\D/g, '');
  const waText = featured.whatsappMessage ||
    t('homeSpecialOffer.whatsappMessage', 'Merhaba! {{title}} hakkında detaylı bilgi almak istiyorum.', { title: featured.title });

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800 mb-4">
            {t('homeSpecialOffer.badge', '🔥 Özel Teklif')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {featured.title}
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            {featured.description}
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <div className="relative h-80 lg:h-full overflow-hidden rounded-2xl shadow-xl">
            <img
              src={featured.image || featured.gallery?.[0] || '/images/placeholder-tour.jpg'}
              alt={featured.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <div className="space-y-5">
            <div className="flex flex-wrap gap-2 text-xs">
              {featured.dates && (
                <span className="rounded bg-white px-3 py-1 shadow-sm">📅 {featured.dates}</span>
              )}
              {featured.duration && (
                <span className="rounded bg-white px-3 py-1 shadow-sm">⏱️ {featured.duration}</span>
              )}
              {featured.groupSize && (
                <span className="rounded bg-white px-3 py-1 shadow-sm">👥 {featured.groupSize}</span>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <div className="text-3xl font-bold text-amber-600">
                {formatTourPrice(featured)}
              </div>
              <div className="text-sm text-gray-500">{t('homeSpecialOffer.perPerson', 'Kişi başı')}</div>
            </div>

            {featured.highlights?.length > 0 && (
              <ul className="space-y-2 text-sm text-gray-700">
                {featured.highlights.slice(0, 6).map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to={`/turlar/${featured.slug}`}
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition"
              >
                {t('homeSpecialOffer.viewDetails', 'Detayları Gör')}
              </Link>
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition"
              >
                {t('homeSpecialOffer.contactWhatsapp', 'WhatsApp ile İletişim')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffer;
