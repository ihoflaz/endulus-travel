import fs from 'fs';
import path from 'path';
const ROOT = path.resolve(process.cwd(), 'src/translations');
const trPath = path.join(ROOT, 'tr/common.json');
const enPath = path.join(ROOT, 'en/common.json');

const ENTRIES = [
  ['tourDetail.navOverview', 'Genel', 'Overview'],
  ['tourDetail.navRecap', 'Tur Özeti', 'Recap'],
  ['tourDetail.navItinerary', 'Program', 'Itinerary'],
  ['tourDetail.navIncluded', 'Dahil / Hariç', 'Included'],
  ['tourDetail.navFaq', 'SSS', 'FAQ'],
  ['tourDetail.completed', 'Bu tur tamamlandı', 'This tour has ended'],
  ['tourDetail.completedNote', 'Bu tur gerçekleştirildi ve tamamlandı. Benzer bir rota için bize yazabilir veya gelecek turlarımıza göz atabilirsiniz.', 'This tour has taken place. Message us for a similar route or browse our upcoming tours.'],
  ['tourDetail.pastCta', 'Benzer Tur İçin Teklif Al', 'Request a Similar Tour'],
  ['tourDetail.watchRecap', 'Tur Özetini İzle', 'Watch the Recap'],
  ['tourDetail.recapTitle', 'Bu turdan kareler', 'Moments from this tour'],
  ['toursPage.tabUpcoming', 'Yaklaşan Turlar', 'Upcoming Tours'],
  ['toursPage.tabPast', 'Geçmiş Turlar', 'Past Tours'],
  ['tourCard.completed', 'Tamamlandı', 'Completed'],
  ['home.pastEyebrow', 'Geçmiş Turlarımız', 'Our Past Tours'],
  ['home.pastTitle', 'Birlikte yaşadığımız yolculuklar', 'Journeys we have shared'],
  ['home.pastAll', 'Tüm Geçmiş Turlar', 'All Past Tours'],
];

function setOnlyAdd(obj, dotted, value) {
  const parts = dotted.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cur[parts[i]] !== 'object' || cur[parts[i]] === null) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  const last = parts[parts.length - 1];
  if (!(last in cur)) { cur[last] = value; return true; }
  return false;
}

for (const [p, lang] of [[trPath, 'tr'], [enPath, 'en']]) {
  const obj = JSON.parse(fs.readFileSync(p, 'utf8'));
  let n = 0;
  for (const [k, tr, en] of ENTRIES) if (setOnlyAdd(obj, k, lang === 'tr' ? tr : en)) n++;
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n', 'utf8');
  console.log(`${lang}: +${n}`);
}
console.log('done');
