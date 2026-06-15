import { useTranslation } from 'react-i18next';
import { LocaleLink as Link } from '../LocaleLink';
import { Reveal } from '../motion';
import { formatTourPrice, getPriceLabel } from '../../utils/priceUtils';

const FALLBACK_IMG = '/uploads/media/egypt.jpg';

// Cinematic tour card — used across Tours / Domestic / International / Home.
// Pure presentation over an admin/DB tour object (already localized upstream).
const TourCardX = ({ tour, delay = 0, categoryLabel }) => {
  const { t } = useTranslation();
  const cat = categoryLabel || t('categories.' + tour.category, tour.destination || '');
  return (
    <Reveal delay={delay} className="h-full">
      <Link to={`/turlar/${tour.slug}`} className="group block h-full rounded-3xl overflow-hidden ds-glass">
        <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
          <img
            src={tour.image || FALLBACK_IMG}
            alt={tour.title}
            loading="lazy"
            onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 38%, rgba(7,10,18,0.94))' }} />

          {tour.specialOffer && (
            <span className="absolute top-4 right-4 text-[0.65rem] uppercase tracking-[0.2em] px-3 py-1 rounded-full font-semibold" style={{ background: 'var(--ds-grad-gold)', color: 'var(--ds-on-gold)' }}>
              {t('toursPage.specialOffer', 'Özel Fırsat')}
            </span>
          )}
          {cat && (
            <span className="absolute top-4 left-4 text-[0.68rem] uppercase tracking-[0.22em] px-3 py-1 rounded-full ds-glass text-[var(--ds-gold-bright)]">
              {cat}
            </span>
          )}

          <div className="absolute bottom-0 inset-x-0 p-6">
            {(tour.duration || tour.groupSize) && (
              <div className="flex items-center gap-4 mb-3 text-[0.72rem] text-[var(--ds-text-muted)] uppercase tracking-wider">
                {tour.duration && <span>{tour.duration}</span>}
                {tour.duration && tour.groupSize && <span className="opacity-40">·</span>}
                {tour.groupSize && <span>{tour.groupSize}</span>}
              </div>
            )}
            <h3 className="ds-display text-2xl leading-tight text-[var(--ds-text)]">{tour.title}</h3>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[var(--ds-gold)] font-medium">{formatTourPrice(tour)}</span>
              <span className="text-xs text-[var(--ds-text-muted)]">{getPriceLabel(tour)}</span>
            </div>
            <span className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--ds-text-soft)] group-hover:text-[var(--ds-gold-bright)] transition-colors">
              {t('toursPage.viewDetails', 'Detayları Gör')}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
};

export default TourCardX;
