import { useWhatsAppSettings, useContactData } from '../../hooks/useAppData';
import { trackContact } from '../../lib/analytics';
import { getCampaign } from '../../lib/utm';

// Builds a WhatsApp deep-link with a context-aware prefilled message and an
// attribution suffix carrying the active UTM campaign. Fires the `Contact`
// event on click so Pixel + CAPI + GA4 all attribute the touch.
//
// Props:
//   - message: override the default; takes precedence over `tour`
//   - tour:    when set, generates "X turu hakkında bilgi almak istiyorum"
//   - variant: 'default' | 'fixed' | 'inline'
//   - size:    'sm' | 'md' | 'lg'
//   - phoneNumber: override (otherwise falls back to settings or hard-coded
//                  number — only used when the admin hasn't filled the field)
const FALLBACK_NUMBER = '905079384508';
const FALLBACK_MESSAGE = 'Merhaba, turlarınız hakkında bilgi almak istiyorum.';

const buildMessage = ({ message, tour, defaultMessage }) => {
  if (message) return message;
  if (tour) {
    const name = typeof tour === 'string' ? tour : (tour.title || tour.slug);
    return `Merhaba, ${name} turu hakkında bilgi almak istiyorum.`;
  }
  return defaultMessage || FALLBACK_MESSAGE;
};

const buildUrl = ({ phone, message, tour }) => {
  const cleanPhone = String(phone || FALLBACK_NUMBER).replace(/\D/g, '');
  const campaign = getCampaign();
  const suffix = campaign ? ` (ref: ${campaign})` : '';
  const finalText = `${message}${suffix}`;
  const tourId = tour && typeof tour !== 'string' ? (tour.slug || tour.id) : tour;
  const trackingParam = tourId ? `&utm_content=${encodeURIComponent(tourId)}` : '';
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(finalText)}${trackingParam}`;
};

const WhatsAppButton = ({
  message,
  tour,
  className = '',
  children = 'WhatsApp',
  variant = 'default',
  size = 'md',
  fullWidth = false,
  showIcon = true,
  phoneNumber,
}) => {
  const { value: whatsapp } = useWhatsAppSettings();
  const { contactData } = useContactData();
  const resolvedPhone =
    phoneNumber || whatsapp?.number || contactData?.phone || FALLBACK_NUMBER;
  const resolvedMessage = buildMessage({
    message,
    tour,
    defaultMessage: whatsapp?.defaultMessage,
  });
  const whatsappUrl = buildUrl({
    phone: resolvedPhone,
    message: resolvedMessage,
    tour,
  });

  // Compose Tailwind classes
  let buttonClass =
    'group bg-green-500 hover:bg-green-600 text-white font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center space-x-2 rounded-xl';

  if (variant === 'fixed') {
    buttonClass =
      'fixed bottom-6 left-6 z-50 p-4 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in hover:scale-110 group';
  } else if (variant === 'inline') {
    buttonClass += ' border border-green-600';
  }

  if (size === 'sm' && variant !== 'fixed') buttonClass += ' py-2 px-4 text-sm';
  else if (size === 'md' && variant !== 'fixed') buttonClass += ' py-3 px-6 text-base';
  else if (size === 'lg' && variant !== 'fixed') buttonClass += ' py-4 px-8 text-lg';

  if (fullWidth && variant !== 'fixed') buttonClass += ' w-full';
  buttonClass += ` ${className}`;

  const onClick = () => {
    trackContact({
      channel: 'whatsapp',
      tour: tour && typeof tour !== 'string' ? (tour.slug || tour.id) : tour,
    });
  };

  const WhatsAppIcon = () => (
    <svg
      className={`${variant === 'fixed' ? 'w-6 h-6' : 'w-4 h-4'} group-hover:scale-110 transition-transform`}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
    </svg>
  );

  if (variant === 'fixed') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="WhatsApp ile iletişime geç"
        onClick={onClick}
      >
        <WhatsAppIcon />
      </a>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClass}
      onClick={onClick}
    >
      {showIcon && <WhatsAppIcon />}
      <span>{children}</span>
    </a>
  );
};

export default WhatsAppButton;
