import { useTranslation } from 'react-i18next';
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

// WhatsApp brand green, refined into a cinematic gradient that complements the
// desert-gold / midnight design system.
const WA_GRADIENT = 'linear-gradient(140deg, #2ee06a 0%, #1aa64f 55%, #0f8a43 100%)';

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

const WhatsAppIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
  </svg>
);

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
  const { t } = useTranslation();
  const { value: whatsapp } = useWhatsAppSettings();
  const { contactData } = useContactData();
  const resolvedPhone =
    phoneNumber || whatsapp?.number || contactData?.phone || FALLBACK_NUMBER;
  const resolvedMessage = buildMessage({
    message,
    tour,
    defaultMessage: whatsapp?.defaultMessage,
  });
  const whatsappUrl = buildUrl({ phone: resolvedPhone, message: resolvedMessage, tour });

  const onClick = () => {
    trackContact({
      channel: 'whatsapp',
      tour: tour && typeof tour !== 'string' ? (tour.slug || tour.id) : tour,
    });
  };

  // ---- Floating FAB: cinematic, gold-ringed, gently floating, hover label ----
  if (variant === 'fixed') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('whatsapp.aria', 'WhatsApp ile iletişime geç')}
        onClick={onClick}
        className={`group fixed bottom-6 left-6 z-50 flex items-center ${className}`}
      >
        <span
          className="relative ds-float grid place-items-center w-14 h-14 rounded-full"
          style={{
            background: WA_GRADIENT,
            boxShadow:
              '0 14px 36px -8px rgba(20,166,79,0.55), 0 0 0 1px rgba(217,178,90,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
        >
          {/* pulsing gold halo */}
          <span
            aria-hidden
            className="wa-halo absolute inset-0 rounded-full"
            style={{ boxShadow: '0 0 0 2px rgba(217,178,90,0.55)' }}
          />
          {/* online dot */}
          <span
            aria-hidden
            className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
            style={{ background: '#4ade80', borderColor: 'var(--ds-bg, #0a0e1a)' }}
          />
          <WhatsAppIcon className="relative w-7 h-7 text-white" />
        </span>

        {/* hover-revealed glass label (desktop) */}
        <span className="overflow-hidden max-w-0 group-hover:max-w-[220px] transition-all duration-500 ease-out">
          <span
            className="ds-glass ml-3 inline-flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-[var(--ds-text)]"
            style={{ boxShadow: '0 10px 30px -12px rgba(0,0,0,0.7)' }}
          >
            {t('whatsapp.fixedLabel', 'Bize yazın')}
          </span>
        </span>
      </a>
    );
  }

  // ---- Inline / default pill: refined WhatsApp-green, sits beside gold CTAs ---
  const sizeCls =
    size === 'sm' ? 'py-2 px-5 text-sm' : size === 'lg' ? 'py-3.5 px-8 text-base' : 'py-3 px-6 text-[0.95rem]';
  const base =
    'group inline-flex items-center justify-center gap-2 rounded-full font-semibold text-white transition-all duration-300 hover:-translate-y-0.5';
  const isInline = variant === 'inline';
  const buttonClass = `${base} ${sizeCls} ${fullWidth ? 'w-full' : ''} ${className}`;
  const buttonStyle = isInline
    ? { background: 'transparent', border: '1px solid #1aa64f', color: '#4ade80' }
    : { background: WA_GRADIENT, boxShadow: '0 10px 30px -10px rgba(20,166,79,0.55)' };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClass}
      style={buttonStyle}
      onClick={onClick}
    >
      {showIcon && <WhatsAppIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />}
      <span>{children}</span>
    </a>
  );
};

export default WhatsAppButton;
