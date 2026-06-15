import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd(), 'src/translations');
const trPath = path.join(ROOT, 'tr/common.json');
const enPath = path.join(ROOT, 'en/common.json');

// [dotted.key, tr, en]
const ENTRIES = [
  // --- workflow display-page keys ---
  ['blog.eyebrow', 'Çöl Günlükleri', 'Desert Journals'],
  ['servicesPage.heroEyebrow', 'Fas · Marakeş & Çöl', 'Morocco · Marrakech & Desert'],
  ['servicesPage.gridHeading', 'Size uygun çözümü seçin', 'Choose the right solution for you'],
  ['serviceDetail.errorEyebrow', 'Bir sorun oluştu', 'Something went wrong'],
  ['serviceDetail.sectionEyebrow', 'Detaylar', 'Details'],
  ['legal.loading', 'Yükleniyor…', 'Loading…'],
  ['legal.emptyBody', 'İçerik henüz hazırlanmadı.', 'This content has not been prepared yet.'],
  ['legal.privacyEyebrow', 'Kurtuba · Mezquita', 'Córdoba · Mezquita'],
  ['legal.privacyCrumb', 'Gizlilik', 'Privacy'],
  ['legal.termsEyebrow', 'Gırnata · Elhamra', 'Granada · Alhambra'],
  ['legal.termsCrumb', 'Kullanım Koşulları', 'Terms of Use'],
  ['legal.kvkkEyebrow', 'İstanbul · Süleymaniye', 'Istanbul · Süleymaniye'],
  ['legal.kvkkCrumb', 'KVKK', 'KVKK'],
  ['planning.progressStep', 'Adım', 'Step'],
  ['planning.errorTitle', 'Planlama sihirbazı yüklenemedi', 'Planning wizard could not be loaded'],
  ['planning.errorDesc', 'Bir sorun oluştu. Lütfen daha sonra tekrar deneyin veya bizimle iletişime geçin.', 'Something went wrong. Please try again later or get in touch with us.'],

  // --- Rota Pusulası offer wizard keys ---
  ['offer.heroEyebrow', 'Rota Pusulası', 'Route Compass'],
  ['offer.heroTitle', 'Hayalindeki rotayı tasarla', 'Design your dream route'],
  ['offer.heroSubtitle', 'Birkaç adımda yolculuğunu anlat; uzman ekibimiz 24 saat içinde sana özel, ücretsiz teklifini hazırlasın.', 'Tell us about your journey in a few steps and our experts will craft your free, personalized offer within 24 hours.'],
  ['offer.stepWhere', 'Nereye', 'Where'],
  ['offer.stepWhen', 'Ne Zaman', 'When'],
  ['offer.stepHow', 'Nasıl', 'How'],
  ['offer.stepContact', 'İletişim', 'Contact'],
  ['offer.qWhere', 'Nereye gitmek istersiniz?', 'Where would you like to go?'],
  ['offer.qWhen', 'Ne zaman ve hangi bütçeyle?', 'When and with what budget?'],
  ['offer.qHow', 'Nasıl bir deneyim hayal ediyorsunuz?', 'What kind of experience do you imagine?'],
  ['offer.qContact', 'Size nasıl ulaşalım?', 'How can we reach you?'],
  ['offer.prefCulture', 'Kültür & Tarih', 'Culture & History'],
  ['offer.prefNature', 'Doğa', 'Nature'],
  ['offer.prefFood', 'Gastronomi', 'Gastronomy'],
  ['offer.prefShopping', 'Alışveriş', 'Shopping'],
  ['offer.prefRelax', 'Dinlenme', 'Relaxation'],
  ['offer.prefFamily', 'Aile Dostu', 'Family Friendly'],
  ['offer.next', 'Devam', 'Continue'],
  ['offer.back', 'Geri', 'Back'],
  ['offer.submitError', 'Gönderim başarısız oldu, lütfen tekrar deneyin.', 'Submission failed, please try again.'],
  ['offer.trust24h', '24 saat içinde dönüş', 'Reply within 24 hours'],
  ['offer.trustFree', 'Ücretsiz & yükümlülüksüz', 'Free & no obligation'],
  ['offer.trustCustom', 'Size özel hazırlanır', 'Tailored to you'],
  ['offer.successTours', 'Turları Keşfet', 'Explore Tours'],
  ['offer.successHome', 'Ana Sayfa', 'Home'],
  ['offer.placeholders.destination', 'Örn. Mısır, Fas, Özbekistan...', 'e.g. Egypt, Morocco, Uzbekistan...'],
  ['offer.placeholders.numberOfPeople', 'Kaç kişi?', 'How many people?'],
  ['offer.placeholders.budget', 'Yaklaşık bütçeniz', 'Your approximate budget'],
  ['offer.placeholders.additionalInfo', 'Hassasiyetleriniz, özel istekleriniz...', 'Your preferences, special requests...'],
  ['offer.notes.privacy', 'Bu formu doldurarak bilgilerinizin kaydedilmesine ve sizinle iletişime geçilmesine izin vermiş olursunuz.', 'By submitting this form you consent to your information being stored and to being contacted.'],
  // fields/buttons — only added if missing (existing translations win)
  ['offer.fields.fullName', 'Adınız Soyadınız', 'Your Full Name'],
  ['offer.fields.email', 'E-posta', 'Email'],
  ['offer.fields.phone', 'Telefon', 'Phone'],
  ['offer.fields.numberOfPeople', 'Kişi Sayısı', 'Number of People'],
  ['offer.fields.travelDate', 'Gidiş Tarihi', 'Departure Date'],
  ['offer.fields.returnDate', 'Dönüş Tarihi', 'Return Date'],
  ['offer.fields.budget', 'Kişi Başı Bütçe (₺)', 'Budget per Person (₺)'],
  ['offer.fields.additionalInfo', 'Ek Bilgiler', 'Additional Information'],
  ['offer.buttons.submit', 'Teklifimi Hazırla', 'Prepare My Offer'],
  ['offer.buttons.sending', 'Gönderiliyor...', 'Sending...'],
  ['offer.success.title', 'Talebiniz Alındı', 'Request Received'],
  ['offer.success.message', 'Teklif formunuz başarıyla gönderildi. Uzman ekibimiz en kısa sürede sizinle iletişime geçecek.', 'Your offer request was submitted successfully. Our experts will contact you shortly.'],

  // --- Contact (Istanbul) hero ---
  ['contactPage.heroEyebrow', 'İstanbul · Boğaz', 'Istanbul · The Bosphorus'],
  ['contactPage.heroTitleFull', 'Size ulaşalım', 'Let us reach you'],

  // --- Survey (Marrakech) hero ---
  ['survey.heroEyebrow', 'Fas · Marakeş', 'Morocco · Marrakech'],

  // --- Budget Routes (Desert) hero ---
  ['budgetRoutes.heroEyebrow', 'Çöl Kervanı · Değerli Rotalar', 'Desert Caravan · Value Journeys'],

  // --- WhatsApp floating button ---
  ['whatsapp.aria', 'WhatsApp ile iletişime geç', 'Contact us on WhatsApp'],
  ['whatsapp.fixedLabel', 'Bize yazın', 'Message us'],
];

function setDeepOnlyAdd(obj, dotted, value) {
  const parts = dotted.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (typeof cur[k] !== 'object' || cur[k] === null) cur[k] = {};
    cur = cur[k];
  }
  const last = parts[parts.length - 1];
  if (!(last in cur)) { cur[last] = value; return true; }
  return false;
}

function merge(filePath, lang) {
  const obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let added = 0;
  for (const [key, tr, en] of ENTRIES) {
    if (setDeepOnlyAdd(obj, key, lang === 'tr' ? tr : en)) added++;
  }
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + '\n', 'utf8');
  console.log(`${lang}: +${added} keys`);
}

merge(trPath, 'tr');
merge(enPath, 'en');

// mojibake scan
for (const [p, lang] of [[trPath, 'tr'], [enPath, 'en']]) {
  const s = fs.readFileSync(p, 'utf8');
  const bad = s.match(/Ã.|Â.|�/g);
  if (bad) console.log(`WARN ${lang} mojibake markers: ${[...new Set(bad)].join(' ')}`);
}
console.log('done');
