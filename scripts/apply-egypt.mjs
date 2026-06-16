import fs from 'fs';
import path from 'path';

const SLUG = 'misir-turu-ozel';

// Enriched day-by-day program (faithful to the official tour brochure / form).
// Backtick strings so Turkish apostrophes are safe.
const itinerary = [
  {
    day: `1. Gün`, date: `27 Haziran (Cuma) - Tarihi Kahire`,
    title: `İstanbul - Kahire & Tarihi Kahire Turu`,
    activities: [`Sabiha Gökçen'den kalkış (23:55)`, `Kahire'ye varış (02:10)`, `İmam Şâfiî Kabri`, `Salahaddin Kalesi`, `Muhammed Ali Camii`, `El-Muiz Caddesi`, `El-Ezher Camii ve Külliyesi`, `Hz. Hüseyin Camii`, `El Fishawy Cafe`, `Han El Halili Çarşısı ve akşam yemeği`],
    description: `26 Haziran akşamı 20:55'te Sabiha Gökçen Havalimanı'nda buluşuyoruz; uçağımız 23:55'te kalkıyor ve yerel saatle 02:10'da Kahire'ye varıyoruz. Özel aracımızla otele geçip yerleşiyor, gece uçuşu sonrası dinleniyoruz. Kahvaltının ardından İmam Şâfiî Hazretleri'nin türbesini ziyaret ediyor, Kahire'yi panoramik gören Salahaddin Kalesi'ne ve Kavalalı Mehmet Ali Paşa'nın Ayasofya'dan esinlenerek yaptırdığı camiye geçiyoruz. Bab al-Futuh kapısından meşhur El-Muiz Caddesi'ne girip Al-Hâkim, Akmar, Silahdar Camii ve Sebili, Abdurrahman Kethüda Mektebi ve Çeşmesi gibi tarihi yapıları görüyoruz. İslam dünyasının köklü ilim merkezi El-Ezher Camii ve Külliyesi ile Hz. Hüseyin Camii'ni ziyaret ediyor, Mehmet Akif Ersoy'un da uğradığı tarihi El Fishawy Cafe'de mola veriyoruz. Han El Halili Çarşısı'nda serbest zaman ve alışverişin ardından akşam yemeği yiyip otele dönüyoruz. Konaklama Kahire'de.`,
  },
  {
    day: `2. Gün`, date: `28 Haziran (Cumartesi) - Antik Mısır & Giza`,
    title: `Giza Piramitleri ve Mısır Müzesi`,
    activities: [`Otel kahvaltısı`, `Giza Piramitleri (alan girişi dahil)`, `Büyük Mısır Müzesi`, `Papirüs Kağıt Atölyesi`, `Koku/Parfüm Atölyesi`, `Nil'de gün batımı felucca turu`, `Akşam yemeği`],
    description: `Kahvaltının ardından Antik Mısır keşfine başlıyoruz. İlk durağımız dünyanın yedi harikasından günümüze ulaşan tek eser olan Giza Piramitleri (alan giriş ücreti dahildir; piramit içi giriş ücreti hariçtir). Ardından Büyük Mısır Müzesi'ni geziyor, papirüs kağıt atölyesi ile koku atölyesini ziyaret ediyoruz. Günün finalinde Nil Nehri üzerinde gün batımında felucca tekne turu yapıyor, akşam yemeğinin ardından otele dönüyoruz. Konaklama Kahire'de.`,
  },
  {
    day: `3. Gün`, date: `29 Haziran (Pazar) - Şarm el Şeyh'e Transfer`,
    title: `Kahire - Şarm el Şeyh`,
    activities: [`Otel kahvaltısı ve çıkış`, `Şarm el Şeyh'e transfer (6-7 saat)`, `Otele yerleşme`, `Serbest zaman`, `Akşam yemeği`],
    description: `Kahvaltı ve check-out sonrası özel otobüsümüzle Şarm el-Şeyh'e hareket ediyoruz. Yaklaşık 6-7 saatlik yolculuğun ardından Kızıldeniz'in sevilen tatil bölgesine varıp otelimize yerleşiyoruz. Günün kalanı dinlenme ve otel imkanlarından faydalanma için serbest zaman. Akşam yemeği ve konaklama otelimizde.`,
  },
  {
    day: `4. Gün`, date: `30 Haziran (Pazartesi) - Safari & Bedevi Gecesi`,
    title: `Şarm el Şeyh - Çöl Safarisi ve Bedevi Gecesi`,
    activities: [`Otel kahvaltısı`, `Serbest zaman (plaj / havuz)`, `ATV çöl safarisi`, `Deve turu`, `Bedevi çadırı ve geleneksel çay`, `Gösterili akşam yemeği`],
    description: `Kahvaltının ardından sabah saatleri plaj, havuz ve otel aktiviteleri için serbest. Gün batımına doğru akşam yemekli safari turuna çıkıyoruz: kum tepeleri arasında ATV safari, kısa deve gezisi, Bedevi çadırı ziyareti ve Bedevi çayı ikramı. Akşam Bedevi kampında otantik bir yemek, ardından dans ve gösteriler eşliğinde keyifli bir program. Tur sonrası otele dönüş. Safari turu akşam yemekli olarak programa dahildir.`,
  },
  {
    day: `5. Gün`, date: `1 Temmuz (Salı) - Kızıldeniz Dalış & Tekne Turu`,
    title: `Ras Muhammed Tekne Turu ve Dalış`,
    activities: [`Otel kahvaltısı`, `Ras Muhammed Tekne Turu (öğle yemekli)`, `Mercan resiflerinde şnorkel`, `Beyaz Ada (White Island) ziyareti`, `Tüplü dalış (ücretsiz)`, `Akşam yemeği`],
    description: `Kahvaltının ardından öğle yemekli Ras Muhammed tekne turuna çıkıyoruz. Kızıldeniz'in en korunaklı ve zengin sualtı yaşamına sahip Ras Muhammed Milli Parkı'nda yüzme ve şnorkel molalarıyla mercan resiflerini keşfediyoruz; hava ve deniz şartlarına bağlı olarak Beyaz Ada (White Island) ziyareti yapılabiliyor. Dileyen misafirler ücretsiz tüplü dalış yapabilir. Öğle yemeği teknede açık büfe olarak servis edilir; akşam yemeği otelimizde. Tekne turu öğle yemekli olarak programa dahildir.`,
  },
  {
    day: `6. Gün`, date: `2-3 Temmuz (Çarşamba-Perşembe) - Şehir Turu & Dönüş`,
    title: `Şarm el Şeyh Şehir Turu ve Dönüş`,
    activities: [`Otel kahvaltısı ve çıkış`, `Eski Pazar (Old Bazaar)`, `El Sahaba Camii`, `Naama Bay`, `Alışveriş ve fotoğraf molaları`, `Havalimanına transfer`, `Dönüş uçuşu (3 Temmuz 04:45)`],
    description: `Kahvaltı ve check-out sonrası rehberimiz eşliğinde Şarm el-Şeyh şehir turu: Eski Pazar (Old Bazaar), El Sahaba Camii, Naama Bay ve şehrin öne çıkan noktaları panoramik olarak görülüyor; alışveriş ve fotoğraf molaları veriliyor. Rehberimizin belirleyeceği saatte havalimanına transfer; 3 Temmuz sabahı 04:45 uçağımızla İstanbul'a dönüş. Panoramik şehir turu programa dahildir.`,
  },
];

// Newly added info from the brochure (was missing on the site: cancellation, flights, visa)
const faq = [
  { question: `İptal ve iade koşulları nelerdir?`, answer: `Tur tarihine 30 günden fazla süre varken yapılan iptallerde ödemenizin tamamı iade edilir. Tura 21-30 gün kala yapılan iptallerde tutarın %50'si tahsil edilir. 21 günden az süre kala yapılan iptallerde ücretin tamamı tahsil edilir.` },
  { question: `Rezervasyon ve ödeme nasıl yapılır?`, answer: `Rezervasyonunuz 500 EUR kapora ile kesinleşir; kalan bakiye tur tarihinden önce tamamlanır. Çocuk (2-12 yaş) 600 EUR, bebek (0-2 yaş) 300 EUR, tek kişilik oda farkı +280 EUR'dur.` },
  { question: `Uçuş bilgileri nelerdir?`, answer: `Gidiş: 26 Haziran 23:55 Sabiha Gökçen → Kahire (AJET VF247). Dönüş: 3 Temmuz 04:45 Şarm el-Şeyh → Sabiha Gökçen (AJET VF256). 20 kg bagaj hakkı fiyata dahildir.` },
  { question: `Vize gerekiyor mu, ek resmi ücretler var mı?`, answer: `Mısır kapı vizesi 30 USD'dir ve fiyata dahil değildir. Yurt dışı çıkış harcı (1250 TL) havalimanında ödenir. Bu resmi ücretler ile tüm şahsi harcamalar misafire aittir.` },
  { question: `Konaklama nerede?`, answer: `Kahire'de 3 gece kahvaltı dahil 4 yıldızlı Azal Pyramids Hotel; Şarm el-Şeyh'de 3 gece her şey dahil 5 yıldızlı Dreams Beach Resort.` },
  { question: `Pasaport için bir şart var mı?`, answer: `Pasaportunuzun, gezi bitiş tarihi itibarıyla en az 6 ay geçerli olması gerekmektedir.` },
];

const itinJson = JSON.stringify(itinerary);
const faqJson = JSON.stringify(faq);

const sql = `BEGIN;
UPDATE "Tour"
SET itinerary = $itin$${itinJson}$itin$::jsonb,
    faq = $faq$${faqJson}$faq$::jsonb
WHERE slug = '${SLUG}';
COMMIT;
SELECT slug, jsonb_array_length(itinerary) AS days, jsonb_array_length(faq) AS faqs FROM "Tour" WHERE slug = '${SLUG}';
`;
const sqlPath = path.resolve('scripts/fix-egypt-tour.sql');
fs.writeFileSync(sqlPath, sql, 'utf8');
console.log('SQL written:', sqlPath, `(itinerary ${itinerary.length} days, faq ${faq.length})`);

// keep the seed tours.json consistent with the DB
const toursPath = path.resolve('public/data/tours.json');
try {
  const raw = JSON.parse(fs.readFileSync(toursPath, 'utf8'));
  const list = Array.isArray(raw) ? raw : (raw.featured || raw.tours || []);
  const tour = list.find((x) => x.slug === SLUG || x.id === SLUG);
  if (tour) {
    tour.itinerary = itinerary;
    tour.faq = faq;
    fs.writeFileSync(toursPath, JSON.stringify(raw, null, 2) + '\n', 'utf8');
    console.log('seed tours.json updated for', SLUG);
  } else {
    console.log('seed tours.json: tour not found (skipped) — DB is source of truth');
  }
} catch (e) {
  console.log('seed tours.json: skipped (', e.message, ')');
}
