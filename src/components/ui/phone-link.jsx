import { useContactData } from '../../hooks/useAppData';

const FALLBACK = '+90 507 938 45 08';

const cleanForTel = (n) => String(n || '').replace(/[^+\d]/g, '');

// Reusable phone display + tel: link sourced from /api/settings/contact.
// Renders the prefix text + clickable number; falls back to the production
// real number if the API hasn't loaded yet (prevents flashing "555…").
const PhoneLink = ({ prefix = '📞 Hemen aramak isterseniz:', className = '' }) => {
  const { contactData } = useContactData();
  const phone = contactData?.phone || FALLBACK;
  const href = `tel:${cleanForTel(phone)}`;
  return (
    <p className={className}>
      {prefix}{' '}
      <a href={href} className="underline hover:text-[color:var(--color-secondary)] transition-colors">
        {phone}
      </a>
    </p>
  );
};

export default PhoneLink;
export { PhoneLink };
