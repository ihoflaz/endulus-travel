import { useTranslation } from 'react-i18next';
import {
  PaperAirplaneIcon,
  BuildingOffice2Icon,
  CakeIcon,
  TruckIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  MapIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

// Picks a context-aware icon for an INCLUDED service line by matching
// Turkish/English keywords against the lowercased text. Falls back to a
// generic green check when nothing matches.
const iconForIncluded = (text) => {
  const value = (text || '').toLowerCase();
  const has = (...words) => words.some((word) => value.includes(word));

  if (has('ucak', 'uçak', 'flight', 'bilet')) return PaperAirplaneIcon;
  if (has('otel', 'konaklama', 'hotel', 'accommodation')) return BuildingOffice2Icon;
  if (has('kahvalti', 'kahvaltı', 'yemek', 'meal', 'breakfast', 'food', 'helal')) return CakeIcon;
  if (has('transfer', 'ulasim', 'ulaşım', 'transport')) return TruckIcon;
  if (has('rehber', 'guide')) return UserGroupIcon;
  if (has('vize', 'visa')) return DocumentTextIcon;
  if (has('sigorta', 'insurance')) return ShieldCheckIcon;
  if (has('muze', 'müze', 'gezi', 'tur', 'excursion')) return MapIcon;
  return CheckCircleIcon;
};

const Column = ({ title, headerColor, children }) => (
  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/60">
    <h3 className="text-xl font-bold mb-6 text-[color:var(--color-text-dark)] flex items-center">
      <span className={`w-6 h-6 ${headerColor} rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}>
        {title.icon}
      </span>
      {title.label}
    </h3>
    <ul className="space-y-3">{children}</ul>
  </div>
);

// Renders a tour's included / not-included services as two icon lists.
const IncludedIcons = ({ included = [], notIncluded = [] }) => {
  const { t } = useTranslation();

  const hasIncluded = Array.isArray(included) && included.length > 0;
  const hasNotIncluded = Array.isArray(notIncluded) && notIncluded.length > 0;

  if (!hasIncluded && !hasNotIncluded) return null;

  const single = hasIncluded !== hasNotIncluded;

  return (
    <div className={`grid grid-cols-1 ${single ? '' : 'md:grid-cols-2'} gap-6`}>
      {hasIncluded && (
        <Column
          headerColor="bg-[color:var(--color-success)]"
          title={{
            label: t('tourDetail.includedTitle', 'Fiyata Dahil Olanlar'),
            icon: <CheckCircleIcon className="w-4 h-4 text-white" />,
          }}
        >
          {included.map((item, index) => {
            const ItemIcon = iconForIncluded(item);
            return (
              <li key={index} className="flex items-start gap-3">
                <ItemIcon className="w-5 h-5 text-[color:var(--color-success)] mt-0.5 flex-shrink-0" />
                <span className="text-[color:var(--color-text-dark)]">{item}</span>
              </li>
            );
          })}
        </Column>
      )}

      {hasNotIncluded && (
        <Column
          headerColor="bg-[color:var(--color-error)]"
          title={{
            label: t('tourDetail.notIncludedTitle', 'Fiyata Dahil Olmayanlar'),
            icon: <XCircleIcon className="w-4 h-4 text-white" />,
          }}
        >
          {notIncluded.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <XCircleIcon className="w-5 h-5 text-[color:var(--color-error)] mt-0.5 flex-shrink-0" />
              <span className="text-[color:var(--color-text-light)]">{item}</span>
            </li>
          ))}
        </Column>
      )}
    </div>
  );
};

export default IncludedIcons;
