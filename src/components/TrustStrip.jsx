import { useFooterSettings } from '../hooks/useAppData';

// A compact trust strip surfacing the niche-specific guarantees that
// matter most for the target audience: TURSAB license, refund policy,
// halal/prayer compliance, group size. Used near the primary CTA.
const FALLBACK_TURSAB = 'TURSAB No: 6739';

const Item = ({ icon, label }) => (
  <div className="flex items-center gap-2 text-xs sm:text-sm">
    <span className="text-base sm:text-lg" aria-hidden="true">{icon}</span>
    <span className="text-white/90">{label}</span>
  </div>
);

const TrustStrip = ({ variant = 'overlay', className = '' }) => {
  const { value: footer } = useFooterSettings();
  const tursab = footer?.licenseNumber || FALLBACK_TURSAB;
  const base = variant === 'overlay'
    ? 'rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 text-white'
    : 'rounded-full bg-amber-50 border border-amber-200 px-4 py-2 text-amber-900';

  return (
    <div className={`inline-flex flex-wrap items-center gap-x-5 gap-y-2 ${base} ${className}`}>
      <Item icon="🛡️" label={tursab} />
      <Item icon="🕌" label="Namaz vakitlerine uygun program" />
      <Item icon="🍽️" label="Helal mutfak" />
      <Item icon="👥" label="15-20 kişilik butik grup" />
      <Item icon="↩️" label="Mücbir sebepte tam iade" />
    </div>
  );
};

export default TrustStrip;
