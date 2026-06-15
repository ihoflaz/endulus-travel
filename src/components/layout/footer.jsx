import { LocaleLink as Link } from '../LocaleLink';
import { useTranslation } from 'react-i18next';
import { useContactData, useFooterSettings, useWhatsAppSettings } from '../../hooks/useAppData';
import AnimatedLogo from '../brand/AnimatedLogo';
import { Reveal } from '../motion';

// Fully admin-driven (contact / footer / whatsapp settings); hardcoded copy is
// only a fallback before the backend is seeded.
const FALLBACK_CONTACT = {
  address: 'Osmanağa Mah. Çilek Sok. Akel İşhanı No:1 Kat:2 İç Kapı No:42, Kadıköy / İstanbul',
  phone: '+90 507 938 45 08',
  email: 'info@endulustravel.com',
};
const FALLBACK_FOOTER = {
  aboutText: 'Kadim sokaklardan ihtişamlı saraylara, sıcak çöllerden derin okyanuslara.',
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
  const ig = contact?.social?.instagram;

  const exploreLinks = [
    { to: '/turlar', key: 'navigation.tours', fb: 'Turlar' },
    { to: '/yurt-disi-turlar', key: 'navbar.internationalTours', fb: 'Yurt Dışı Turlar' },
    { to: '/yurt-ici-turlar', key: 'navbar.domesticTours', fb: 'Yurt İçi Turlar' },
    { to: '/hakkimizda', key: 'navigation.about', fb: 'Hakkımızda' },
    { to: '/blog', key: 'navigation.blog', fb: 'Blog' },
    { to: '/iletisim', key: 'navigation.contact', fb: 'İletişim' },
  ];

  return (
    <footer className="relative ds-dark ds-grain overflow-hidden" style={{ background: 'var(--ds-bg)' }}>
      <div className="ds-hairline" />
      <div className="ds-container pt-20 pb-10">
        {/* Top: brand + CTA */}
        <Reveal>
          <div className="grid lg:grid-cols-12 gap-10 items-start pb-14">
            <div className="lg:col-span-5">
              <AnimatedLogo size={44} variant="gold" withWordmark animate={false} />
              <p className="ds-lead mt-6 max-w-[40ch]" style={{ fontSize: '1.05rem' }}>{f.aboutText}</p>
              {ig && (
                <a href={ig} target="_blank" rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-[var(--ds-text-soft)] hover:text-[var(--ds-gold-bright)] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 01-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 3.65a6.15 6.15 0 100 12.3 6.15 6.15 0 000-12.3zm0 10.15a4 4 0 110-8 4 4 0 010 8zm6.4-10.4a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" /></svg>
                  <span className="text-sm">{contact?.social?.instagram ? '@' + ig.replace(/\/+$/, '').split('/').pop() : 'Instagram'}</span>
                </a>
              )}
            </div>

            <div className="lg:col-span-3">
              <h3 className="ds-eyebrow mb-5">{t('footer.exploreTitle', 'Keşfet')}</h3>
              <ul className="space-y-3">
                {exploreLinks.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-[var(--ds-text-soft)] hover:text-[var(--ds-gold-bright)] transition-colors">{t(l.key, l.fb)}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-4">
              <h3 className="ds-eyebrow mb-5">{t('footer.contactInfoTitle', 'İletişim')}</h3>
              <address className="not-italic space-y-3 text-[var(--ds-text-soft)]">
                {contact.address && <p className="text-sm leading-relaxed max-w-[34ch]">{contact.address}</p>}
                {contact.phone && <a href={phoneHref} className="block hover:text-[var(--ds-gold-bright)] transition-colors">{contact.phone}</a>}
                {contact.email && <a href={`mailto:${contact.email}`} className="block hover:text-[var(--ds-gold-bright)] transition-colors">{contact.email}</a>}
              </address>
              <a href={`https://wa.me/${waNumber}?text=${waMessage}`} target="_blank" rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2.5 px-5 py-3 rounded-full font-medium transition-transform hover:-translate-y-0.5"
                style={{ background: 'rgba(47,143,115,0.16)', color: '#7fd6b8', border: '1px solid rgba(47,143,115,0.4)' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" /></svg>
                {t('footer.whatsappContact', 'WhatsApp ile İletişim')}
              </a>
            </div>
          </div>
        </Reveal>

        <div className="ds-hairline" />

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--ds-text-muted)]">
          <div className="flex flex-col md:flex-row items-center gap-x-4 gap-y-1 text-center md:text-left">
            <span>© {currentYear} {f.copyright}</span>
            {f.licenseNumber && <span className="text-[var(--ds-gold)]">{f.licenseNumber}</span>}
            {f.legalName && <span className="opacity-70">{f.legalName}</span>}
          </div>
          <div className="flex flex-wrap justify-center gap-5">
            {[
              { to: '/gizlilik', text: t('footer.privacyPolicy', 'Gizlilik Politikası') },
              { to: '/kullanim-kosullari', text: t('footer.termsOfUse', 'Kullanım Koşulları') },
              { to: '/kvkk', text: t('footer.kvkk', 'KVKK') },
            ].map((p) => (
              <Link key={p.to} to={p.to} className="hover:text-[var(--ds-gold-bright)] transition-colors">{p.text}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
