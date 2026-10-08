/**
 * One-off seeder: Ekim-Kasım 2026 turları (Özbekistan, Tayland, GAP & Suriye).
 * Create-only — slug zaten varsa dokunmaz. Çalıştırma (sunucuda, repo checkout'tan):
 *   docker compose exec -T backend node --input-type=module < server/scripts/seed-tours-2026-10.js
 * İçerik kaynakları: Google Forms bilgi formları (Ekim 2026). Fiyat/iptal
 * koşulları formlardaki metinle birebir uyumludur.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CANCEL_FAQ = {
  question: 'İptal ve iade koşulları nelerdir?',
  answer:
    "Tur tarihine 30 günden fazla süre varken yapılan iptallerde ödemenizin tamamı iade edilir. Tura 21-30 gün kala yapılan iptallerde tutarın %50'si tahsil edilir. 21 günden az süre kala yapılan iptallerde ücretin tamamı tahsil edilir.",
};
const FAMILY_FAQ = {
  question: 'Turlara kimler katılabilir?',
  answer:
    'Turlarımız aileler ve hanımlar için tasarlanmış butik gruplardır; yaş sınırı yoktur, çocuklu aileler ve büyüklerimiz rahatlıkla katılabilir. Beyefendiler yalnızca aile katılımı şeklinde kabul edilmektedir. Programlar namaz vakitlerine uygun molalarla planlanır.',
};
const PASSPORT_FAQ = {
  question: 'Pasaport ve vize için ne gerekiyor?',
  answer:
    'Pasaportunuzun tur bitiş tarihinden itibaren en az 6 ay geçerli olması gerekmektedir.',
};

const TOURS = [
  {
    slug: 'ozbekistan-turu-ekim-2026',
    title: 'Özbekistan Turu - Hiva, Buhara, Semerkant & Taşkent',
    description:
      "20-26 Ekim tarihlerinde İpek Yolu'nun kalbine yolculuk: Hiva'nın masal şehri İçan Kale'den Buhara'nın kadim medreselerine, Semerkant'ın Registan Meydanı'ndan İmam Buhari ve İmam Maturidi hazretlerinin kabirlerine uzanan, namaz vakitlerine uygun 7 günlük mânevi ve kültürel rota. Maksimum 15-20 kişilik butik grup, ekstra ücret yok.",
    pricePerPerson: 1200,
    originalPrice: 1300,
    campaignPrice: 1200,
    currency: 'EUR',
    priceNote:
      '0-3 yaş: 750 EUR · 3-9 yaş: 1100 EUR · 9 yaş üzeri yetişkin fiyatına tabidir · 400 EUR kapora ile rezervasyon',
    groupSize: 'Maksimum 15-20 kişi',
    type: 'international',
    destination: 'Özbekistan (Hiva, Buhara, Semerkant, Taşkent)',
    image: '/images/tours/ozbekistan2026.jpg',
    gallery: [
      '/images/tours/ozbekistan2026-1.jpg',
      '/images/tours/ozbekistan2026-2.jpg',
      '/images/tours/ozbekistan2026-3.jpg',
      '/images/tours/ozbekistan2026-4.jpg',
      '/images/tours/ozbekistan2026-5.jpg',
      '/images/tours/ozbekistan2026-6.jpg',
    ],
    specialOffer: true,
    featured: true,
    dates: '20 - 26 Ekim 2026',
    duration: '7 gün / 6 gece',
    startDate: new Date('2026-10-20'),
    endDate: new Date('2026-10-26'),
    highlights: [
      "Hiva İçan Kale — UNESCO listesindeki açık hava müzesi şehirde rehberli tur",
      "Buhara'da Bahaüddin Nakşibend ve İsmail Samani türbeleri, Kalon Camii ve Minaresi",
      "Semerkant Registan Meydanı, Şah-i Zinde Külliyesi ve Bibi Hanım Camii",
      'İmam Buhari ve İmam Maturidi hazretlerinin kabirlerini ziyaret',
      "Taşkent'te Hazreti İmam Külliyesi ve Çorsu Pazarı",
      'Programdaki tüm müze ve ören yeri girişleri dahil — ekstra tur ücreti yok',
      '3-4 yıldızlı otellerde kahvaltı dahil konaklama, tüm akşam yemekleri dahil',
      'Namaz vakitlerine uygun, Türkçe rehberli butik program',
    ],
    included: [
      'İstanbul - Ürgenç / Taşkent - İstanbul direkt uçak biletleri (20 kg bagaj)',
      '6 gece 3 ve 4 yıldızlı otellerde kahvaltı dahil konaklama',
      'Tüm şehirlerarası ulaşım ve havalimanı transferleri',
      'Tüm kahvaltılar ve akşam yemekleri',
      'Türkçe konuşan profesyonel rehberlik',
      'Programdaki tüm müze ve ören yeri giriş ücretleri',
      'Seyahat sağlık sigortası',
    ],
    notIncluded: [
      'Yurt dışı çıkış harcı (havalimanında ödenebilir, yaklaşık 1250 TL)',
      'Kişisel harcamalar',
    ],
    itinerary: [
      {
        day: '1. Gün',
        date: '20 Ekim - İstanbul → Ürgenç → Hiva',
        title: 'İstanbul - Ürgenç uçuşu ve Hiva',
        activities: ["İstanbul Havalimanı'nda buluşma (10:15)", 'Ürgenç uçuşu (13:15 - 19:00)', "Hiva'ya transfer (~40 dk)", "İçan Kale'de serbest zaman"],
        description:
          "İstanbul Havalimanı'nda saat 10:15'te buluşuyor, 13:15'te kalkan uçağımızla Ürgenç'e uçuyoruz. Yaklaşık 40 dakikalık transferle masal şehri Hiva'ya geçiyor, otelimize yerleşiyoruz. Akşam İçan Kale'nin surları içinde serbest zaman. Konaklama Hiva'da.",
      },
      {
        day: '2. Gün',
        date: '21 Ekim - Hiva → Buhara',
        title: 'İçan Kale turu ve Buhara yolculuğu',
        activities: ['Ata Darvaza Kapısı', 'Kunya Ark', 'Muhammed Emin Han Medresesi', 'Kalta Minor Minaresi', 'Cuma Camii', 'Pehlivan Darvaza', "Buhara'ya kara yolculuğu (~7 saat)"],
        description:
          "Kahvaltının ardından rehberimiz eşliğinde UNESCO Dünya Mirası İçan Kale'yi geziyoruz: Ata Darvaza Kapısı, Kunya Ark, Muhammed Emin Han Medresesi, yarım kalmış turkuaz Kalta Minor Minaresi, Cuma Camii ve Pehlivan Darvaza. Öğleden sonra İpek Yolu kervanlarının izinde yaklaşık 7 saatlik yolculukla Buhara'ya ulaşıyoruz. Konaklama Buhara'da.",
      },
      {
        day: '3. Gün',
        date: '22 Ekim - Buhara',
        title: 'Kadim Buhara',
        activities: ['Bahaüddin Nakşibend Türbesi', 'İsmail Samani Türbesi', 'Eyyûb Kuyusu', 'Ark Kalesi', 'Kalon Camii ve Minaresi', 'Mir-i Arab Medresesi', 'Bolo Hauz Camii', 'Uluğ Bey ve Abdülaziz Han medreseleri', 'Lyabi Hauz Meydanı'],
        description:
          "Tam gün Buhara: Nakşibendî yolunun pîri Bahaüddin Nakşibend hazretlerinin türbesi, İsmail Samani Türbesi, Eyyûb Kuyusu, Ark Kalesi, şehrin simgesi Kalon Camii ve Minaresi, Mir-i Arab Medresesi, kırk sütunlu Bolo Hauz Camii ile Uluğ Bey ve Abdülaziz Han medreselerini ziyaret ediyoruz. Günün sonunda Lyabi Hauz Meydanı'nda ve tarihi çarşılarda serbest zaman. Konaklama Buhara'da.",
      },
      {
        day: '4. Gün',
        date: '23 Ekim - Buhara → Semerkant',
        title: 'Gijduvani ve Semerkant yolu',
        activities: ['Hoca Abdülhalik Gucdüvani Türbesi', 'Mahdumi Azam Türbesi', 'İmam Buhari Türbesi', 'İmam Maturidi Türbesi', 'Hoca Ubeydullah Ahrar'],
        description:
          "Buhara'dan Semerkant'a yaklaşık 5 saatlik yolculuğumuzda Hoca Abdülhalik Gucdüvani hazretlerinin türbesinde mola veriyoruz. Semerkant'a varışta Mahdumi Azam Türbesi'ni, hadis ilminin büyük imamı İmam Buhari hazretlerini, ardından İmam Maturidi ve Hoca Ubeydullah Ahrar hazretlerinin kabirlerini ziyaret ediyoruz. Akşam yemeğimizi restoranda alıyoruz. Konaklama Semerkant'ta.",
      },
      {
        day: '5. Gün',
        date: '24 Ekim - Semerkant',
        title: 'Timur başkenti Semerkant',
        activities: ['Gur-i Emir Türbesi', 'Uluğ Bey Rasathanesi', 'Şah-i Zinde Külliyesi', 'Hazret-i Hızır Camii', 'Bibi Hanım Camii', 'Siyob Pazarı', 'Registan Meydanı'],
        description:
          "Tam gün Semerkant: Emir Timur'un medfun olduğu Gur-i Emir Türbesi, Uluğ Bey Rasathanesi, çini sanatının zirvesi Şah-i Zinde Külliyesi, Hazret-i Hızır Camii ve Bibi Hanım Camii'ni geziyoruz. Siyob Pazarı'nda serbest zamanın ardından üç muhteşem medresesiyle Registan Meydanı'nı geziyor, akşam ışıklandırılmış meydanda serbest zaman geçiriyoruz. Konaklama Semerkant'ta.",
      },
      {
        day: '6. Gün',
        date: '25 Ekim - Semerkant → Taşkent',
        title: 'Başkent Taşkent',
        activities: ["Taşkent'e yolculuk (~5 saat)", 'Hazreti İmam Külliyesi', 'Emir Timur Meydanı', 'Bağımsızlık Meydanı', 'Kukeldaş Medresesi', 'Çorsu Pazarı', 'Veda yemeği'],
        description:
          "Yaklaşık 5 saatlik yolculukla başkent Taşkent'e geçiyoruz. Hz. Osman'a ait dünyanın en eski Kur'an nüshasının korunduğu Hazreti İmam Külliyesi, Emir Timur Meydanı, Bağımsızlık Meydanı ve Kukeldaş Medresesi'ni ziyaret ediyoruz. Çorsu Pazarı'nda serbest zamanın ardından veda yemeğinde buluşuyoruz. Konaklama Taşkent'te.",
      },
      {
        day: '7. Gün',
        date: '26 Ekim - Taşkent → İstanbul',
        title: 'Dönüş',
        activities: ["Çorsu Pazarı'nda serbest zaman", 'Havalimanına transfer', 'İstanbul uçuşu (16:50 - 20:10)'],
        description:
          "Kahvaltının ardından Çorsu Pazarı'nda son alışverişler için serbest zaman. Havalimanına transferle 16:50'de kalkan uçağımızla İstanbul'a dönüyoruz; varış 20:10. Güzel hatıralarla evlerimize dönüyoruz.",
      },
    ],
    faq: [
      CANCEL_FAQ,
      {
        question: 'Ödeme nasıl yapılıyor?',
        answer:
          'Kesin kayıt için 400 EUR ön ödeme (kapora) alınır; kalan tutar tur tarihine kadar taksitli ödenebilir. Ödeme detayları ve tur sözleşmesi rezervasyon sonrasında iletilir.',
      },
      FAMILY_FAQ,
      {
        question: 'Özbekistan için vize gerekiyor mu?',
        answer:
          'Türkiye Cumhuriyeti vatandaşları Özbekistan\'a vizesiz seyahat edebilmektedir. Pasaportunuzun tur bitiş tarihinden itibaren en az 6 ay geçerli olması yeterlidir.',
      },
    ],
    whatsappMessage:
      'Merhaba! 20-26 Ekim tarihleri arasındaki Özbekistan Turu hakkında bilgi almak istiyorum.',
  },

  {
    slug: 'tayland-turu-kasim-2026',
    title: 'Tayland Turu - Bangkok, Krabi & Phuket',
    description:
      "12-20 Kasım tarihlerinde THY direkt uçuşlarıyla Tayland: Bangkok'un saray ve pazarlarından Krabi'nin zümrüt koylarına, Phi Phi Adaları'ndan Phuket'e uzanan 9 günlük rota. Helal konseptli restoranlarda yemekler, namaz vakitlerine uygun program, maksimum 20 kişilik butik grup — program dışı ekstra ücret yok.",
    pricePerPerson: 2250,
    originalPrice: 2350,
    campaignPrice: 2250,
    currency: 'EUR',
    priceNote:
      '0-2 yaş: 1000 EUR · 2-6 yaş: 2100 EUR · 6 yaş üzeri yetişkin fiyatına tabidir · Tek kişilik oda farkı: +250 EUR · 600 EUR kapora ile rezervasyon',
    groupSize: 'Maksimum 20 kişi',
    type: 'international',
    destination: 'Tayland (Bangkok, Krabi, Phuket)',
    image: '/images/tours/tayland.jpg',
    gallery: [
      '/images/tours/tayland1.jpg',
      '/images/tours/tayland2.jpg',
      '/images/tours/tayland3.jpg',
      '/images/tours/tayland4.jpg',
      '/images/tours/tayland5.jpg',
      '/images/tours/tayland6.jpg',
    ],
    specialOffer: true,
    featured: true,
    dates: '12 - 20 Kasım 2026',
    duration: '9 gün / 8 gece',
    startDate: new Date('2026-11-12'),
    endDate: new Date('2026-11-20'),
    highlights: [
      'THY direkt uçuşlarıyla İstanbul - Bangkok gidiş, Phuket - İstanbul dönüş',
      'Phi Phi Adaları tekne turu: Maya Bay, Pileh Lagünü, Monkey Beach',
      'Bangkok Grand Palace, Wat Arun ve Damnoen Saduak Yüzen Pazarı',
      'Etik Fil Koruma Merkezi ziyareti ve Emerald Pool',
      "Railay Plajı'na long tail tekneyle geçiş, Krabi'nin zümrüt koyları",
      'Phuket Old Town, Big Buddha ve gece pazarı',
      'Helal konseptli restoranlarda tüm kahvaltı ve akşam yemekleri dahil',
      'Namaz vakitlerine uygun, Türkçe rehberli butik program',
    ],
    included: [
      'İstanbul - Bangkok / Phuket - İstanbul THY direkt uçak biletleri',
      'Bangkok - Krabi iç hat uçuşu',
      '8 gece 3 ve 4 yıldızlı otellerde kahvaltı dahil konaklama (3 gece Bangkok, 3 gece Krabi, 2 gece Phuket)',
      'Tüm şehir içi ve şehirlerarası transferler',
      'Helal konseptli restoranlarda tüm kahvaltı ve akşam yemekleri, Phi Phi turunda öğle yemeği',
      'Türkçe konuşan profesyonel rehberlik',
      'Programdaki tüm giriş ücretleri: Phi Phi tekne turu, fil koruma merkezi, kano, Tiger Park',
      'Seyahat sağlık sigortası',
    ],
    notIncluded: [
      'Yurt dışı çıkış harcı (havalimanında ödenebilir, yaklaşık 1250 TL)',
      'Kişisel harcamalar',
    ],
    itinerary: [
      {
        day: '1. Gün',
        date: '12-13 Kasım - İstanbul → Bangkok',
        title: 'İstanbul - Bangkok uçuşu',
        activities: ['THY TK0058 direkt uçuş (15:25)', "Ertesi sabah Bangkok'a varış (04:15)", 'Otele transfer ve dinlenme'],
        description:
          "İstanbul Havalimanı'ndan 15:25'te kalkan THY direkt uçuşumuzla Bangkok'a hareket ediyoruz. Ertesi sabah 04:15'te varıyor, otelimize transfer olup dinleniyoruz. Konaklama Bangkok'ta.",
      },
      {
        day: '2. Gün',
        date: '13 Kasım - Bangkok',
        title: 'Saraylar ve tapınaklar şehri',
        activities: ['Grand Palace', 'Wat Phra Kaew', 'Wat Pho', 'Feribotla Wat Arun', 'Asiatique gece çarşısı'],
        description:
          "Bangkok'un simgesi Grand Palace ve Wat Phra Kaew ile başlıyor, dev yatan Buda heykeliyle Wat Pho'yu geziyoruz. Chao Phraya Nehri'ni feribotla geçerek gün batımında Wat Arun'u görüyor, akşamı nehir kıyısındaki Asiatique'te geçiriyoruz. Konaklama Bangkok'ta.",
      },
      {
        day: '3. Gün',
        date: '14 Kasım - Bangkok',
        title: 'Yüzen pazar ve Chinatown',
        activities: ['Damnoen Saduak Yüzen Pazarı', 'Maeklong Demiryolu Pazarı', 'Chinatown'],
        description:
          "Sabah Tayland'ın meşhur Damnoen Saduak Yüzen Pazarı'nda kayıklarla pazar alışverişini deneyimliyoruz. Trenin içinden geçtiği Maeklong Demiryolu Pazarı'nı görüyor, akşam Chinatown'un renkli sokaklarında vakit geçiriyoruz. Konaklama Bangkok'ta.",
      },
      {
        day: '4. Gün',
        date: '15 Kasım - Bangkok → Krabi',
        title: 'Krabi ve Railay Plajı',
        activities: ['Bangkok - Krabi iç hat uçuşu', 'Ao Nang Plajı', 'Long tail tekneyle Railay Plajı', 'İsteğe bağlı Monkey Trail'],
        description:
          "İç hat uçuşuyla Andaman Denizi'nin incisi Krabi'ye geçiyoruz. Ao Nang Plajı'nın ardından long tail tekneyle sadece denizden ulaşılabilen Railay Plajı'na gidiyoruz; dileyenler Monkey Trail yürüyüşüne katılıyor. Konaklama Krabi'de.",
      },
      {
        day: '5. Gün',
        date: '16 Kasım - Krabi',
        title: 'Phi Phi Adaları tekne turu',
        activities: ['Maya Bay', 'Pileh Lagünü', 'Viking Mağarası', 'Monkey Beach', 'Teknede öğle yemeği'],
        description:
          "Tam gün Phi Phi Adaları turu: dünyaca ünlü Maya Bay, zümrüt yeşili Pileh Lagünü, Viking Mağarası ve Monkey Beach'i tekneyle geziyor, kristal sularda yüzme molaları veriyoruz. Öğle yemeği turda dahil. Konaklama Krabi'de.",
      },
      {
        day: '6. Gün',
        date: '17 Kasım - Krabi',
        title: 'Filler ve zümrüt havuz',
        activities: ['Etik Fil Koruma Merkezi', 'Emerald Pool', "Klongrood'da kano"],
        description:
          "Fillerin doğal ortamında korunduğu etik fil koruma merkezini ziyaret ediyoruz. Yağmur ormanının içindeki zümrüt renkli doğal havuz Emerald Pool'da yüzme molası verip Klongrood'un berrak sularında kano yapıyoruz. Konaklama Krabi'de.",
      },
      {
        day: '7. Gün',
        date: '18 Kasım - Krabi → Phuket',
        title: 'Phuket yolculuğu',
        activities: ['Krabi - Phuket transferi (~3 saat)', 'Ma Doo Bua Cafe', 'Karon Plajı'],
        description:
          "Yaklaşık 3 saatlik manzaralı yolculukla Phuket'e geçiyoruz. Dev nilüfer yapraklarıyla ünlü Ma Doo Bua Cafe'de mola verip günü Karon Plajı'nda tamamlıyoruz. Konaklama Phuket'te.",
      },
      {
        day: '8. Gün',
        date: '19 Kasım - Phuket',
        title: 'Phuket keşfi',
        activities: ['Phuket Old Town', 'Wat Chalong', 'Big Buddha', 'Tiger Park', 'Gece pazarı'],
        description:
          "Rengarenk Sino-Portekiz mimarisiyle Phuket Old Town'u geziyoruz. Wat Chalong ve adaya hakim Big Buddha'nın ardından Tiger Park'ı ziyaret ediyor, son akşamımızı gece pazarında geçiriyoruz. Konaklama Phuket'te.",
      },
      {
        day: '9. Gün',
        date: '20 Kasım - Phuket → İstanbul',
        title: 'Dönüş',
        activities: ['Havalimanına transfer', 'THY TK0167 direkt uçuş (09:05 - 15:45)'],
        description:
          "Erken saatlerde havalimanına transfer oluyor, 09:05'te kalkan THY direkt uçuşumuzla aynı gün 15:45'te İstanbul'a varıyoruz.",
      },
    ],
    faq: [
      CANCEL_FAQ,
      {
        question: 'Ödeme nasıl yapılıyor?',
        answer:
          'Kesin kayıt için 600 EUR ön ödeme (kapora) alınır; kalan tutar 1 Kasım\'a kadar taksitli ödenebilir. Ödeme detayları ve tur sözleşmesi rezervasyon sonrasında iletilir.',
      },
      FAMILY_FAQ,
      {
        question: 'Tayland için vize gerekiyor mu?',
        answer:
          'Türkiye Cumhuriyeti vatandaşları turistik seyahatlerde Tayland\'a vizesiz giriş yapabilmektedir. Pasaportunuzun tur bitiş tarihinden itibaren en az 6 ay geçerli olması gerekir.',
      },
      {
        question: 'Yemekler nasıl?',
        answer:
          'Tüm kahvaltılar otellerde, akşam yemekleri helal konseptli restoranlarda alınır; Phi Phi tekne turunda öğle yemeği de dahildir.',
      },
    ],
    whatsappMessage:
      'Merhaba! 12-20 Kasım tarihleri arasındaki Tayland Turu hakkında bilgi almak istiyorum.',
  },

  {
    slug: 'gap-suriye-turu-kasim-2026',
    title: 'GAP & Suriye Turu - Mardin, Urfa, Halep & Şam',
    description:
      "14-19 Kasım tarihlerinde Mezopotamya'dan Şam'a tarih ve maneviyat yolculuğu: Mardin'in taş konaklarından Göbeklitepe'ye, Halfeti'nin batık minaresinden Halep Kalesi'ne, Emevi Camii'nden Kasyun Dağı'na uzanan 6 günlük eşsiz rota. Maksimum 15 kişilik butik grup, Suriye vizesi ve tüm geziler dahil.",
    pricePerPerson: 1100,
    currency: 'USD',
    priceNote:
      '0-2 yaş: 250 USD · 2-11 yaş: 1000 USD · 11 yaş üzeri yetişkin fiyatına tabidir · Tek kişilik oda farkı: +250 USD · 400 USD kapora ile rezervasyon',
    groupSize: 'Maksimum 15 kişi',
    type: 'international',
    destination: 'GAP & Suriye (Mardin, Urfa, Antep, Halep, Şam)',
    image: '/images/tours/gap-suriye.jpg',
    gallery: [
      '/images/tours/gap-suriye1.jpg',
      '/images/tours/gap-suriye2.jpg',
      '/images/tours/gap-suriye3.jpg',
    ],
    specialOffer: false,
    featured: true,
    dates: '14 - 19 Kasım 2026',
    duration: '6 gün / 5 gece',
    startDate: new Date('2026-11-14'),
    endDate: new Date('2026-11-19'),
    highlights: [
      "Mardin'in taş medreselerinden Midyat'ın tarihi sokaklarına",
      "İnsanlık tarihinin sıfır noktası Göbeklitepe",
      'Balıklıgöl ve Hz. İbrahim makamları, sıra gecesi eşliğinde Urfa akşamı',
      "Halfeti'de batık minareye tekne turu",
      "Humus'ta Halid bin Velid hazretlerinin kabri",
      "Halep Kalesi ve tarihi çarşılar",
      "Şam'da Emevi Camii, El Azem Sarayı ve Babü's-Sağir'deki sahabe kabirleri",
      "Kasyun Dağı'ndan Şam manzarası — Suriye vizesi tura dahil",
    ],
    included: [
      'İstanbul - Mardin / Gaziantep - İstanbul uçak biletleri',
      '5 gece 4 yıldızlı otellerde kahvaltı dahil konaklama',
      'Restoran veya otellerde akşam yemekleri',
      'Tüm geziler, şehirlerarası ulaşım ve transferler',
      'Programdaki müze ve ören yeri giriş ücretleri',
      'Halfeti tekne turu ve Şanlıurfa sıra gecesi',
      'Suriye vizesi (sınırda tur kapsamında alınır)',
      'Seyahat sağlık sigortası',
    ],
    notIncluded: [
      'Yurt dışı çıkış harcı (havalimanında ödenebilir, yaklaşık 1250 TL)',
      'Kişisel harcamalar ve yerel bahşişler',
    ],
    itinerary: [
      {
        day: '1. Gün',
        date: '14 Kasım - Mardin → Midyat',
        title: 'Taş şehir Mardin',
        activities: ['İstanbul - Mardin uçuşu (07:25 - 09:25)', 'Kasımiye Medresesi', 'Eski Mardin', 'Mardin Ulu Camii', 'Zinciriye Medresesi', 'Bakırcılar Çarşısı'],
        description:
          "Sabah uçuşuyla Mardin'e iniyoruz. Mezopotamya ovasına bakan Kasımiye Medresesi ile başlayıp Eski Mardin'in daracık sokaklarında Ulu Camii ve Zinciriye Medresesi'ni geziyoruz. Tarihi çarşılar ve Bakırcılar Çarşısı'nda serbest zamanın ardından Midyat'a geçiyoruz. Konaklama Midyat'ta.",
      },
      {
        day: '2. Gün',
        date: '15 Kasım - Midyat → Şanlıurfa',
        title: 'Midyat ve sıra gecesi',
        activities: ['Midyat Konukevi', "Midyat'ın tarihi sokakları", 'Gelişke Hanı', "Beyaz Su'da mola", 'Şanlıurfa sıra gecesi'],
        description:
          "Dizilere mekan olan Midyat Konukevi'ni ve telkâri ustalarının çarşılarını geziyoruz. Beyaz Su'da molanın ardından Şanlıurfa'ya geçiyor, akşam sıra gecesi eşliğinde Urfa mutfağının eşsiz lezzetlerini tadıyoruz. Konaklama Şanlıurfa'da.",
      },
      {
        day: '3. Gün',
        date: '16 Kasım - Şanlıurfa → Halfeti → Gaziantep',
        title: 'Göbeklitepe ve Halfeti',
        activities: ['Göbeklitepe', 'Balıklıgöl', 'Halil-ür Rahman Camii', "Hz. İbrahim'in doğduğu mağara", 'Aynzeliha Gölü', 'Gümrük Hanı', 'Halfeti tekne turu'],
        description:
          "Güne insanlık tarihini yeniden yazdıran 12.000 yıllık Göbeklitepe ile başlıyoruz. Balıklıgöl, Halil-ür Rahman Camii, Hz. İbrahim'in doğduğu mağara ve Mevlid-i Halil Camii'ni ziyaret ediyor, Gümrük Hanı'nda mola veriyoruz. Öğleden sonra Halfeti'de tekne turuyla batık minareyi görüyor, akşam Gaziantep'e ulaşıyoruz. Konaklama Gaziantep'te.",
      },
      {
        day: '4. Gün',
        date: '17 Kasım - Gaziantep → Humus → Halep → Şam',
        title: 'Suriye\'ye geçiş',
        activities: ['Öncüpınar sınır geçişi ve vize işlemleri', "Humus'ta Halid bin Velid'in kabri", 'Halep Kalesi ve çarşı', "Şam'a varış"],
        description:
          "Öncüpınar Sınır Kapısı'ndan Suriye'ye geçiyoruz; vize işlemleri tur kapsamında yapılıyor. Humus'ta büyük komutan Halid bin Velid hazretlerinin kabrini ziyaret ediyor, Halep'te tarihi kale ve çarşıda kısa mola veriyoruz. Akşam Şam'a ulaşıyoruz. Konaklama Şam'da.",
      },
      {
        day: '5. Gün',
        date: '18 Kasım - Şam',
        title: 'Kadim Şam',
        activities: ['El Azem Sarayı', 'Zahiriye Medresesi', 'Nuriye Külliyesi', "Babü's-Sağir'de sahabe kabirleri", 'Merce Meydanı', 'Emevi Camii', 'Tarihi çarşılar'],
        description:
          "Tam gün Şam: El Azem Sarayı, Zahiriye Medresesi ve Nureddin Zengi'nin kabrinin bulunduğu Nuriye Külliyesi'ni geziyoruz. Babü's-Sağir Mezarlığı'nda Bilal-i Habeşi ve İbn Ümmü Mektum hazretleri başta olmak üzere sahabe kabirlerini ziyaret ediyoruz. Merce Meydanı'nın ardından İslam mimarisinin şaheseri Emevi Camii'nde namaz kılıyor, tarihi çarşı ve hanlarda serbest zaman geçiriyoruz. Konaklama Şam'da.",
      },
      {
        day: '6. Gün',
        date: '19 Kasım - Şam → Hama → İstanbul',
        title: 'Kasyun, Hama ve dönüş',
        activities: ["Kasyun Dağı'ndan Şam manzarası", 'Yermük Kampı', "Hama'da Ömer bin Abdülaziz'in kabri", 'Hama su değirmenleri', 'Gaziantep - İstanbul uçuşu (21:10 - 23:05)'],
        description:
          "Sabah Kasyun Dağı'ndan Şam'ı kuşbakışı izliyoruz. Yermük Kampı'nın ardından Hama'da beşinci halife kabul edilen Ömer bin Abdülaziz hazretlerinin kabrini ve Asi Nehri üzerindeki tarihi su değirmenlerini görüyoruz. Sınır geçişinin ardından Gaziantep Havalimanı'ndan 21:10'da kalkan uçakla İstanbul'a dönüyoruz.",
      },
    ],
    faq: [
      CANCEL_FAQ,
      {
        question: 'Ödeme nasıl yapılıyor?',
        answer:
          'Kesin kayıt için 400 USD ön ödeme (kapora) alınır; kalan tutarın 4 Kasım\'a kadar tamamlanması gerekir. Ödeme detayları ve tur sözleşmesi rezervasyon sonrasında iletilir.',
      },
      {
        question: 'Suriye\'ye geçiş güvenli mi, vize nasıl alınıyor?',
        answer:
          'Suriye vizesi tur kapsamında sınır kapısında topluca alınır ve ücreti tura dahildir. Program, bölgeyi yakından tanıyan ekibimiz ve yerel bağlantılarımızla, güvenli güzergahlar üzerinden planlanmıştır. Pasaportunuzun tur bitişinden itibaren en az 6 ay geçerli olması gerekir.',
      },
      FAMILY_FAQ,
    ],
    whatsappMessage:
      'Merhaba! 14-19 Kasım tarihleri arasındaki GAP & Suriye Turu hakkında bilgi almak istiyorum.',
  },
];

const run = async () => {
  for (const t of TOURS) {
    const existing = await prisma.tour.findUnique({ where: { slug: t.slug }, select: { id: true } });
    if (existing) {
      console.log(`[seed-tours] ${t.slug}: zaten var — atlandı`);
      continue;
    }
    await prisma.tour.create({ data: t });
    console.log(`[seed-tours] ${t.slug}: eklendi`);
  }
};

run()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
