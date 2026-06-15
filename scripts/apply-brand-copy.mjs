import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd(), 'src/translations');
const trPath = path.join(ROOT, 'tr/common.json');
const enPath = path.join(ROOT, 'en/common.json');

// dotted.key -> { tr, en }  (OVERWRITES existing values)
const M = {
  // --- About hero ---
  'about.title': { tr: `Biz Kimiz`, en: `Who We Are` },
  'about.subtitle': {
    tr: `Biri mühendis, biri diyetisyen; iki kız kardeşin ortak tutkusundan doğan bir yol arkadaşlığı.`,
    en: `A travel companionship born from the shared passion of two sisters — one an engineer, the other a dietitian.`,
  },

  // --- Home (Biz kimiz teaser + boutique size) ---
  'home.introBody': {
    tr: `Endülüs Travel, biri mühendis diğeri diyetisyen olan iki kız kardeşin ortak tutkusu ve hayaliyle kuruldu. İçimize sinmeyen hiçbir rotayı satışa sunmuyor; her ülkeyi "bir kez gitme şansım olsa nereleri görürdüm" diye bizzat deneyimleyerek planlıyoruz. Namaz vakitlerine uygun, helal mutfaklı, 15-20 kişilik butik gruplarla; aileler ve hanımlar için huzurlu bir yol arkadaşlığı sunuyoruz.`,
    en: `Endülüs Travel was founded on the shared passion of two sisters — one an engineer, the other a dietitian. We never sell a route we don't wholeheartedly believe in; we plan each country by asking "if I could go just once, where would I go?" and by experiencing it ourselves. Prayer-time friendly, halal cuisine, boutique groups of 15-20 — a peaceful companionship for families and women.`,
  },
  'home.heroSubtitle': {
    tr: `Namaz vakitlerine uygun, helal mutfaklı, 15-20 kişilik butik turlarla İslam coğrafyasının kalbine açılan kapı.`,
    en: `A gateway to the heart of the Islamic world through prayer-time-friendly, halal-cuisine boutique tours of 15-20 guests.`,
  },
  'home.pillarBoutiqueDesc': {
    tr: `15-20 kişilik samimi, özenli gruplar.`,
    en: `Intimate, attentive groups of 15-20 guests.`,
  },

  // --- About page: real story ---
  'aboutPage.statInnovationTitle': { tr: `Butik`, en: `Boutique` },
  'aboutPage.statInnovationLabel': { tr: `15-20 Kişilik Gruplar`, en: `Groups of 15-20` },

  'aboutPage.missionP1Pre': { tr: `Endülüs Travel, `, en: `Endülüs Travel was ` },
  'aboutPage.missionP1Strong1': {
    tr: `biri mühendis diğeri diyetisyen olan iki kız kardeşin ortak tutkusu ve hayaliyle kuruldu.`,
    en: `founded on the shared passion and dream of two sisters — one an engineer, the other a dietitian.`,
  },
  'aboutPage.missionP1Mid': {
    tr: ` Bu tutku bizi bugüne taşıdı; ama hayallerimiz bitmedi, gidecek daha çok yolumuz var. `,
    en: ` That passion carried us here — yet our dreams aren't finished; there's so much road ahead. `,
  },
  'aboutPage.missionP1Strong2': {
    tr: `İçimize sinmeyen hiçbir rotayı satışa sunmuyoruz`,
    en: `We never sell a route we don't wholeheartedly believe in`,
  },
  'aboutPage.missionP1Post': {
    tr: `; her ülkeyi "bir kez gitme şansım olsa nereleri görürdüm" diye düşünerek, bizzat deneyimleyerek planlıyoruz.`,
    en: `; we plan each one by asking "if I could visit just once, where would I go?" — and by experiencing it ourselves.`,
  },
  'aboutPage.missionP2Pre': {
    tr: `Birini tanımanın en güzel yollarından biri birlikte seyahat etmektir; bu yüzden yol arkadaşlığını kıymetli, bir o kadar da özen ve anlayış gerektiren bir bağ olarak görürüz. `,
    en: `One of the finest ways to know someone is to travel together; so we treat companionship as something precious that also asks for care and understanding. `,
  },
  'aboutPage.missionP2Strong': {
    tr: `Dengeleri kalabalıkta korumak zorlaştığı için turlarımızı 15-20 kişilik butik gruplarla, herkese eşit ve sınıf farkı gözetmeyen bir anlayışla düzenliyoruz`,
    en: `Because balance is harder to keep in a crowd, we run our tours in boutique groups of 15-20, with equal service and no class distinctions`,
  },
  'aboutPage.missionP2Post': {
    tr: `. Turlarımız aile ve hanımların katılımına uygundur; grubun uyumu ve misafirlerimizin konforu için bireysel erkek misafir kabul edemiyor, bu konuda beylerin anlayışına sığınıyoruz.`,
    en: `. Our tours are designed for families and women; to protect group harmony and our guests' comfort, we are unable to accept individual male guests, and we kindly ask for the gentlemen's understanding.`,
  },

  'aboutPage.toursIntroPre': {
    tr: `Bizim için seyahat asla sadece gezmek değildir; onu `,
    en: `For us, travel is never just sightseeing — we turn it into `,
  },
  'aboutPage.toursIntroStrong': {
    tr: `huzurlu, inanç değerlerinize saygılı ve her yaşı kucaklayan anlamlı bir yol arkadaşlığına`,
    en: `a meaningful companionship: peaceful, respectful of your faith, and welcoming to every age`,
  },
  'aboutPage.toursIntroPost': { tr: ` dönüştürüyoruz.`, en: `.` },

  'aboutPage.featureSensitivityTitle': { tr: `Namaz Saatlerine Uygun`, en: `Built Around Prayer Times` },
  'aboutPage.featureSensitivityPre': {
    tr: `Seyahati ibadete asla engel görmüyoruz; namaz vakitlerindeki molaları vakit kaybı değil, `,
    en: `We never see travel as an obstacle to worship; we treat prayer-time breaks not as lost time but as `,
  },
  'aboutPage.featureSensitivityStrong': {
    tr: `iç huzurun her şeyden kıymetli olduğu anlar`,
    en: `moments where inner peace matters most`,
  },
  'aboutPage.featureSensitivityPost': {
    tr: ` olarak görüyor, ibadet etmek isteyen misafirlerimize namaz saatlerine uygun molalar veriyoruz.`,
    en: `, giving guests who wish to pray breaks that fit the prayer hours.`,
  },

  'aboutPage.featureAllInclusiveTitle': { tr: `Her Şey Dahil, Sürpriz Ücret Yok`, en: `All-Inclusive, No Surprise Fees` },
  'aboutPage.featureAllInclusivePre': {
    tr: `Programlarımızda ekstra tur veya müze giriş ücreti adı altında `,
    en: `Our programs carry no extra-tour or museum-entry `,
  },
  'aboutPage.featureAllInclusiveStrong': { tr: `gizli ya da sürpriz ücretler bulunmaz`, en: `hidden or surprise fees` },
  'aboutPage.featureAllInclusivePost': {
    tr: `; programdaki aktiviteler için tur esnasında asla ek ücret talep etmiyoruz. Birçok rotamızda kahvaltı ve akşam yemekleri fiyata dahildir.`,
    en: `; we never ask for extra payment during the tour for activities in the program. On many routes, breakfast and dinner are included.`,
  },

  'aboutPage.featureBudgetTitle': { tr: `Bizzat Deneyimlenmiş Rotalar`, en: `Routes We've Lived Ourselves` },
  'aboutPage.featureBudgetPre': {
    tr: `İçimize sinmeyen hiçbir rotayı satışa sunmuyor, `,
    en: `We never offer a route that doesn't feel right to us; `,
  },
  'aboutPage.featureBudgetStrong1': { tr: `her rotayı bizzat deneyimleyerek`, en: `we walk every route ourselves` },
  'aboutPage.featureBudgetMid': { tr: ` çiziyor, görülmesi gereken `, en: ` and weave in the must-see, ` },
  'aboutPage.featureBudgetStrong2': { tr: `her yaşa uygun müze ve aktiviteleri`, en: `every-age museums and activities` },
  'aboutPage.featureBudgetPost': { tr: ` özenle programa dahil ediyoruz.`, en: ` with great care.` },

  'aboutPage.featurePersonalTitle': { tr: `Her Yaşa Açık, Aile Dostu`, en: `Family-Friendly, Every Age Welcome` },
  'aboutPage.featurePersonalPre': {
    tr: `Seyahatin sadece gençlere özgü olmadığına inanır, turlarımıza `,
    en: `We believe travel isn't only for the young, so we place `,
  },
  'aboutPage.featurePersonalStrong': { tr: `yaş sınırı koymayız`, en: `no age limit on our tours` },
  'aboutPage.featurePersonalPost': {
    tr: `. Çocukların ümidi, gençlerin enerjisi, büyüklerimizin duası ve tecrübesi yollarımızı güzelleştirir.`,
    en: `. A child's hope, youth's energy, and our elders' prayers and wisdom make every journey richer.`,
  },

  'aboutPage.promiseText': {
    tr: `"Gidecek daha çok yolumuz var; güzel yollar ve güzel yol arkadaşları için çokça dua ediyor, bir gün dünyanın herhangi bir yerine birlikte seyahat etmeyi diliyoruz."`,
    en: `"We still have a long road ahead — we pray for beautiful roads and companions, and hope to travel the world together with you one day."`,
  },
  'aboutPage.metaDescription': {
    tr: `Endülüs Travel; biri mühendis diğeri diyetisyen iki kız kardeşin kurduğu, namaz vakitlerine uygun, her şey dahil ve gizli ücretsiz, 15-20 kişilik butik turlar düzenleyen, aile ve hanımlara özel bir seyahat markasıdır.`,
    en: `Founded by two sisters — an engineer and a dietitian — Endülüs Travel runs prayer-time-friendly, all-inclusive boutique tours of 15-20 guests with no hidden fees, designed for families and women.`,
  },

  // --- Tours page hero (boutique size fix) ---
  'toursPage.heroDescription': {
    tr: `Klasik turlardan farklı olarak; size ve grubunuza özel, özenle planlanmış seyahatler sunuyoruz. Turlarımızı 15-20 kişilik butik gruplarla, kalabalıktan uzak, samimi bir ortamda gerçekleştiriyoruz.`,
    en: `Unlike classic tours, we craft journeys made just for you and your group — run in boutique groups of 15-20, away from the crowds, in a warm and intimate atmosphere.`,
  },

  // --- Services group-tour size fix ---
  'services.groupToursTitle': { tr: `Grup Turları (15-20 Kişi)`, en: `Group Tours (15-20 People)` },
};

function setDeep(obj, dotted, value) {
  const parts = dotted.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (typeof cur[k] !== 'object' || cur[k] === null) cur[k] = {};
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = value;
}

function apply(filePath, lang) {
  const obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let n = 0;
  for (const [key, v] of Object.entries(M)) { setDeep(obj, key, v[lang]); n++; }
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + '\n', 'utf8');
  console.log(`${lang}: overwrote ${n} keys`);
}

apply(trPath, 'tr');
apply(enPath, 'en');

for (const [p, lang] of [[trPath, 'tr'], [enPath, 'en']]) {
  const s = fs.readFileSync(p, 'utf8');
  const bad = s.match(/Ã.|Â.|�/g);
  if (bad) console.log(`WARN ${lang} mojibake: ${[...new Set(bad)].join(' ')}`);
}
console.log('done');
