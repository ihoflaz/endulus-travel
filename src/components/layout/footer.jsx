import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContactData, useFooterSettings, useWhatsAppSettings } from '../../hooks/useAppData';

// Footer is fully driven by admin-editable settings. Hardcoded copy survives
// only as fallback when the backend is unreachable or hasn't been seeded yet.
const FALLBACK_CONTACT = {
  address: 'Osmanağa mah. Çilek sok. Akel İşhanı No:1 Kat:2 İç kapı no:42 — Kadıköy / İstanbul',
  phone: '+90 507 938 45 08',
  email: 'info@endulustravel.com',
};
const FALLBACK_FOOTER = {
  aboutText: 'Kadim sokaklardan ihtişamlı saraylara, sıcak çöllerden derin okyanuslara',
  legalName: 'ROTA ATLAS TURİZM SEYAHAT ACENTASI',
  licenseNumber: 'TURSAB No: 6739',
  copyright: 'Endülüs Travel. Tüm hakları saklıdır.',
};
const FALLBACK_WA = '905079384508';
const FALLBACK_WA_MSG = 'Merhaba, tur planlaması hakkında bilgi almak istiyorum.';

const Footer = () => {
  const { t } = useTranslation();
  const { contactData } = useContactData();
  const { value: footer } = useFooterSettings();
  const { value: whatsapp } = useWhatsAppSettings();
  const currentYear = new Date().getFullYear();

  const contact = { ...FALLBACK_CONTACT, ...(contactData || {}) };
  const f = { ...FALLBACK_FOOTER, ...(footer || {}) };
  const waNumber = (whatsapp?.number || FALLBACK_WA).replace(/\D/g, '');
  const waMessage = encodeURIComponent(whatsapp?.defaultMessage || FALLBACK_WA_MSG);
  const phoneHref = `tel:${(contact.phone || '').replace(/[^+\d]/g, '')}`;

  return (
    <footer className="relative mt-auto overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[color:var(--color-secondary)]/20 to-transparent rounded-full transform -translate-x-20 translate-y-20"></div>
      </div>

      <div className="relative z-10 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <span className="text-[color:var(--color-secondary)] font-semibold mr-2">✨</span>
              <span className="text-sm font-medium">{t('footer.tagline', 'Seyahat Yolculuğunuz Burada Başlıyor')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {f.aboutText}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 h-full">
                <h3 className="text-xl font-bold mb-6 text-white">{t('footer.officeAddressTitle', 'Ofis Adresimiz')}</h3>
                <address className="not-italic text-gray-300 space-y-4">
                  <p className="text-white font-medium mb-2">Endülüs Travel</p>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{contact.address}</p>
                </address>
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-xs text-gray-400 space-y-1">
                    {f.licenseNumber && (
                      <p>
                        <span className="text-[color:var(--color-secondary)] font-medium">{f.licenseNumber}</span>
                      </p>
                    )}
                    {f.legalName && <p className="font-medium text-gray-300">{f.legalName}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 h-full">
                <h3 className="text-xl font-bold mb-6 text-white">{t('footer.contactInfoTitle', 'İletişim Bilgileri')}</h3>
                <address className="not-italic text-gray-300 space-y-4">
                  {contact.phone && (
                    <div className="flex items-center gap-3 p-4 rounded-lg hover:bg-white/10 transition">
                      <a href={phoneHref} className="text-white hover:text-[color:var(--color-secondary)] font-medium text-lg">
                        {contact.phone}
                      </a>
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex items-center gap-3 p-4 rounded-lg hover:bg-white/10 transition">
                      <a href={`mailto:${contact.email}`} className="text-white hover:text-[color:var(--color-secondary)] font-medium">
                        {contact.email}
                      </a>
                    </div>
                  )}
                </address>
                <div className="mt-6">
                  <a
                    href={`https://wa.me/${waNumber}?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition transform hover:scale-105 inline-flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    <span>{t('footer.whatsappContact', 'WhatsApp ile İletişim')}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 animate-fade-in">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4">
                <div className="text-center">
                  <p className="text-gray-300 text-sm">
                    © {currentYear} <span className="font-semibold text-white">{f.copyright}</span>
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-6 text-sm">
                  {[
                    { to: '/gizlilik', text: t('footer.privacyPolicy', 'Gizlilik Politikası') },
                    { to: '/kullanim-kosullari', text: t('footer.termsOfUse', 'Kullanım Koşulları') },
                    { to: '/kvkk', text: t('footer.kvkk', 'KVKK') },
                  ].map((p) => (
                    <Link
                      key={p.to}
                      to={p.to}
                      className="text-gray-300 hover:text-[color:var(--color-secondary)] transition hover:underline"
                    >
                      {p.text}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 h-2 bg-gradient-to-r from-[color:var(--color-primary)] via-[color:var(--color-secondary)] to-[color:var(--color-primary)]"></div>
    </footer>
  );
};

export default Footer;
