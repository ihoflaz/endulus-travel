import { useTranslation } from 'react-i18next';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

// A reusable "refund guarantee" trust callout, surfaced in 3 spots on the
// tour page. The niche promise (full refund on force-majeure cancellation)
// is one of the strongest objection-handlers for this audience, so it is
// repeated as a sidebar card, a hero pill, and a between-sections banner.
const RefundGuarantee = ({ variant = 'card' }) => {
  const { t } = useTranslation();
  const title = t('trust.refundTitle', 'Mücbir Sebepte Tam İade');
  const description = t(
    'trust.refundDesc',
    'Mücbir sebeplerle iptal edilen turlarda ödemenizin tamamı iade edilir.'
  );

  if (variant === 'inline') {
    return (
      <div
        className="inline-flex items-center gap-2 rounded-full px-4 py-2"
        style={{
          border: '1px solid rgba(47,143,115,0.4)',
          backgroundColor: 'rgba(47,143,115,0.12)',
        }}
      >
        <ShieldCheckIcon
          className="h-5 w-5 shrink-0"
          style={{ color: 'rgba(91,196,163,1)' }}
          aria-hidden="true"
        />
        <span className="text-sm font-semibold text-[var(--ds-text)]">
          {title}
        </span>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div
        className="flex items-start gap-4 rounded-2xl px-5 py-4 sm:items-center sm:px-6 sm:py-5"
        style={{
          border: '1px solid rgba(47,143,115,0.4)',
          backgroundColor: 'rgba(47,143,115,0.12)',
        }}
      >
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(47,143,115,0.18)' }}
        >
          <ShieldCheckIcon
            className="h-6 w-6"
            style={{ color: 'rgba(91,196,163,1)' }}
            aria-hidden="true"
          />
        </span>
        <div>
          <h3 className="text-base font-bold text-[var(--ds-text)] sm:text-lg">
            {title}
          </h3>
          <p className="mt-1 text-sm text-[var(--ds-text-muted)]">
            {description}
          </p>
        </div>
      </div>
    );
  }

  // variant === 'card'
  return (
    <div className="ds-glass rounded-xl p-4">
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: 'rgba(47,143,115,0.18)' }}
        >
          <ShieldCheckIcon
            className="h-6 w-6"
            style={{ color: 'rgba(91,196,163,1)' }}
            aria-hidden="true"
          />
        </span>
        <div>
          <h3 className="text-sm font-bold text-[var(--ds-text)]">
            {title}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-[var(--ds-text-muted)]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundGuarantee;
