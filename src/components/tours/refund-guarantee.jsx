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
      <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-success)]/30 bg-[color:var(--color-success)]/10 px-4 py-2">
        <ShieldCheckIcon
          className="h-5 w-5 shrink-0 text-[color:var(--color-success)]"
          aria-hidden="true"
        />
        <span className="text-sm font-semibold text-[color:var(--color-text-dark)]">
          {title}
        </span>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="flex items-start gap-4 rounded-2xl border border-[color:var(--color-success)]/30 bg-[color:var(--color-success)]/10 px-5 py-4 sm:items-center sm:px-6 sm:py-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-success)]/15">
          <ShieldCheckIcon
            className="h-6 w-6 text-[color:var(--color-success)]"
            aria-hidden="true"
          />
        </span>
        <div>
          <h3 className="text-base font-bold text-[color:var(--color-text-dark)] sm:text-lg">
            {title}
          </h3>
          <p className="mt-1 text-sm text-[color:var(--color-text-light)]">
            {description}
          </p>
        </div>
      </div>
    );
  }

  // variant === 'card'
  return (
    <div className="rounded-xl border border-[color:var(--color-border)] bg-white p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-secondary)]/15">
          <ShieldCheckIcon
            className="h-6 w-6 text-[color:var(--color-success)]"
            aria-hidden="true"
          />
        </span>
        <div>
          <h3 className="text-sm font-bold text-[color:var(--color-text-dark)]">
            {title}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-[color:var(--color-text-light)]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundGuarantee;
