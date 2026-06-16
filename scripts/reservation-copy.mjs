import fs from 'fs';
import path from 'path';
const ROOT = path.resolve(process.cwd(), 'src/translations');
const trPath = path.join(ROOT, 'tr/common.json');
const enPath = path.join(ROOT, 'en/common.json');

// "Teklif Al / kişiye özel rota" -> "Rezervasyon / yaklaşan turlar". OVERWRITES.
const ENTRIES = [
  // nav / generic buttons
  ['nav.getOffer', 'Rezervasyon', 'Reserve'],
  ['navigation.getOffer', 'Rezervasyon', 'Reserve'],
  ['home.getOffer', 'Rezervasyon', 'Reserve'],
  ['buttons.getOffer', 'Rezervasyon', 'Reserve'],
  ['buttons.getQuote', 'Rezervasyon Talebi', 'Reservation Request'],
  // home
  ['home.heroSecondary', 'Yaklaşan Turlar', 'Upcoming Tours'],
  ['home.ctaTitle', 'Yaklaşan turlarımızda yerinizi ayırtın', 'Reserve your spot on our upcoming tours'],
  ['home.ctaBody', 'Beğendiğiniz turu ve tarihi seçin; 24 saat içinde rezervasyon için size dönelim.', 'Pick a tour and date you love and we will get back to you within 24 hours for your reservation.'],
  ['home.ctaButton', 'Rezervasyon Talebi', 'Reservation Request'],
  // tours listing CTA (shared by domestic/international too)
  ['toursPage.ctaEyebrow', 'Hazır mısınız?', 'Ready to go?'],
  ['toursPage.ctaTitle', 'Yaklaşan turlarımızda yerinizi ayırtın', 'Reserve your spot on our upcoming tours'],
  ['toursPage.ctaBody', 'Beğendiğiniz turu ve tarihi seçin; 24 saat içinde rezervasyon için size dönelim.', 'Pick a tour and date you love and we will reply within 24 hours.'],
  ['toursPage.ctaButton', 'Rezervasyon Talebi', 'Reservation Request'],
  ['toursPage.ctaQuoteButton', 'Rezervasyon Talebi', 'Reservation Request'],
  // tour detail
  ['tourDetail.heroOffer', 'Rezervasyon Talebi', 'Reservation Request'],
  ['tourDetail.sidebarOffer', 'Rezervasyon Talebi', 'Reservation Request'],
  ['tourDetail.pastCta', 'Yaklaşan Turlara Göz At', 'See Upcoming Tours'],
  // contact CTA
  ['contactPage.ctaGetQuote', 'Rezervasyon Talebi', 'Reservation Request'],
  ['contactPage.ctaTitlePrefix', 'Yaklaşan turlarımıza', 'Join our'],
  ['contactPage.ctaTitleHighlight', 'katılın', 'upcoming tours'],
  ['contactPage.formSubheading', 'Yaklaşan turlarımız için size yardımcı olalım', 'Let us help you with our upcoming tours'],
  // about CTA
  ['aboutPage.ctaButtonQuote', 'Rezervasyon Talebi', 'Reservation Request'],
  ['aboutPage.ctaHeadingLine1', 'Yaklaşan turlarımızda', 'Reserve your spot on'],
  ['aboutPage.ctaHeadingLine2', 'yerinizi ayırtın!', 'our upcoming tours'],
  ['aboutPage.ctaSubtitle', 'Beğendiğiniz turu ve tarihi seçin; gerisini biz halledelim.', 'Pick a tour and date you love and leave the rest to us.'],
  // services CTA (cover the likely-rendered keys; harmless if a key is unused)
  ['serviceDetail.ctaGetOffer', 'Rezervasyon Talebi', 'Reservation Request'],
  ['servicesPage.ctaGetOffer', 'Rezervasyon Talebi', 'Reservation Request'],
  ['services.ctaGetOffer', 'Rezervasyon Talebi', 'Reservation Request'],
  // offer / reservation form page
  ['offer.heroEyebrow', 'Rezervasyon & Bilgi', 'Reservation & Info'],
  ['offer.heroTitle', 'Yaklaşan turlarımıza katılın', 'Join our upcoming tours'],
  ['offer.heroSubtitle', 'Yaklaşan turlarımızdan birini ve tarihini seçin; ekibimiz 24 saat içinde rezervasyon ve detaylar için size dönsün.', 'Choose one of our upcoming tours and a date; our team will get back to you within 24 hours for reservation and details.'],
  ['offer.qWhere', 'Hangi turumuza katılmak istersiniz?', 'Which tour would you like to join?'],
  ['offer.qWhen', 'Hangi tarihte gitmek istersiniz?', 'Which date would you like to travel?'],
  ['offer.buttons.submit', 'Rezervasyon Talebi Gönder', 'Send Reservation Request'],
  ['offer.success.title', 'Talebiniz Alındı', 'Request Received'],
  ['offer.success.message', 'Rezervasyon talebiniz alındı. Ekibimiz en kısa sürede sizinle iletişime geçecek.', 'Your reservation request has been received. Our team will contact you shortly.'],
  ['offer.pageTitle', 'Rezervasyon & Bilgi - Endülüs Travel', 'Reservation & Info - Endülüs Travel'],
  ['offer.metaDescription', 'Yaklaşan turlarımıza katılın: turu ve tarihi seçin, ekibimiz 24 saat içinde rezervasyon için size dönsün.', 'Join our upcoming tours: pick a tour and date and our team will reach out within 24 hours.'],
];

function setDeep(obj, dotted, value) {
  const parts = dotted.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cur[parts[i]] !== 'object' || cur[parts[i]] === null) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

for (const [p, lang] of [[trPath, 'tr'], [enPath, 'en']]) {
  const obj = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const [k, tr, en] of ENTRIES) setDeep(obj, k, lang === 'tr' ? tr : en);
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n', 'utf8');
  console.log(`${lang}: ${ENTRIES.length} keys set`);
}
console.log('done');
