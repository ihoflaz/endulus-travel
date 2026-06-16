import fs from 'fs';
import path from 'path';

const CANCEL = `Tur tarihine 30 günden daha uzun süre varken yapılan iptallerde ödemenizin tamamı iade edilir. Tura 21-30 gün kala yapılan iptallerde tutarın %50'si tahsil edilir. 21 günden az süre kala yapılan iptallerde ücretin tamamı tahsil edilir.`;
const WHO = `Turlarımız aile ve hanımların katılımına uygundur; grubun uyumu ve misafirlerimizin konforu için bireysel erkek misafir kabul edemiyor, beylerin anlayışına sığınıyoruz. Erkek misafirlerimiz aile veya grup katılımıyla aramıza katılabilir. Maksimum 15 kişilik butik gruplar.`;
const PASSPORT = `Pasaportunuzun, gezi bitiş tarihi itibarıyla en az 6 ay geçerli olması gerekmektedir.`;
const EXIT = `Yurt dışı çıkış harcı (havalimanında ödenebilir, 1250 TL) ve tüm şahsi harcamalar misafire aittir.`;

const TOURS = [
  {
    slug: 'dubai-turu',
    title: 'Dubai & Abu Dabi Turu',
    description: 'Burj Khalifa, çöl safarisi, Abu Dabi Şeyh Zayed Camii ve Marina tekne turuyla 5 günlük butik Dubai & Abu Dabi deneyimi. Namaz vakitlerine uygun, vize dahil.',
    pricePerPerson: 1200, currency: 'EUR',
    priceNote: 'Çocuk (2-6 yaş): 800 EUR · Bebek (0-2 yaş): 300 EUR · 200 EUR kapora ile rezervasyon · Yeşil pasaport sahiplerine 75 EUR indirim (vizesiz giriş) · Vize hizmeti ve ücreti fiyata dahildir.',
    groupSize: 'Maksimum 15 kişi (butik)', destination: 'Dubai & Abu Dabi, BAE',
    image: '/images/tours/dubai.jpg',
    dates: '25 - 30 Mart 2026', startDate: '2026-03-25', endDate: '2026-03-30', duration: '5 gün / 4 gece',
    featured: false, order: 22,
    highlights: [
      "5 yıldızlı Elite Byblos'ta 4 gece kahvaltı dahil konaklama",
      'Burj Khalifa 123. kat (giriş dahil) ve Dubai Mall su & ışık gösterisi',
      '4x4 çöl safarisi ve akşam yemekli bedevi kampı',
      "Marina'da akşam yemekli tekne turu",
      'Abu Dabi şehir turu & Şeyh Zayed Camii',
      'Global Village ve Miracle Garden (girişler dahil)',
      'Air Arabia ile gidiş-dönüş uçak bileti (+20 kg bagaj)',
      'Vize hizmeti ve ücreti dahil · Namaz vakitlerine uygun program',
    ],
    included: [
      'Sabiha Gökçen - Sharjah gidiş-dönüş Air Arabia uçak bileti (+20 kg bagaj)',
      '5 yıldızlı Elite Byblos otelde 4 gece konaklama (kahvaltı dahil)',
      'Şehir içi ve şehirlerarası tüm transferler',
      '4 kahvaltı ve 2 akşam yemeği',
      'Tüm müze ve ören yeri giriş ücretleri',
      '4x4 araçlarla çöl safarisi ve akşam yemekli otantik bedevi kampı',
      "Marina'da akşam yemekli tekne turu",
      'Burj Khalifa 123. kat giriş bileti',
      'Miracle Garden ve Global Village giriş biletleri',
      'Abu Dabi ve Dubai şehir turları',
      'Seyahat sigortası',
      'Vize hizmeti ve ücreti',
    ],
    notIncluded: [
      'Yurt dışı çıkış harcı (havalimanında 1250 TL)',
      '1 kahvaltı, öğle yemekleri ve 3 akşam yemeği',
      'Tüm şahsi harcamalar',
      'Yerel bahşişler (ortalama 10 dolar)',
    ],
    itinerary: [
      { day: '1. Gün', date: '25 Mart - Dubai İkonları & Global Village', title: 'İstanbul - Dubai · Burj Al Arab & Global Village',
        activities: ['Sabiha Gökçen buluşma (24 Mart 21:00)', "Sharjah'a varış (05:45)", 'Burj Al Arab fotoğraf molası', 'Bluewaters Island & Ain Dubai', 'Gelecek Müzesi', 'Global Village (serbest zaman)'],
        description: "24 Mart akşamı 21:00'de Sabiha Gökçen'de buluşuyoruz; uçağımız 25 Mart 00:35'te kalkıyor, 05:45'te Sharjah'a varıyoruz ve Dubai'ye geçiyoruz. Dubai'nin simgesi Burj Al Arab önünde fotoğraf molası, ardından Bluewaters Island ve Ain Dubai. Gelecek Müzesi'nin ilk katını gezip otele yerleşiyoruz. Akşam 18:00 gibi dünya kültürlerini bir araya getiren Global Village'a geçiyor, serbest zamanda dünya mutfaklarını tadıp alışveriş yapıyoruz. Gece otele dönüş." },
      { day: '2. Gün', date: '26 Mart - Safari & Bedevi Gecesi', title: 'Çöl Safarisi ve Bedevi Kampı',
        activities: ['Otel kahvaltısı', 'Emirates Mall (serbest)', '4x4 çöl safarisi & kum sörfü', 'Gün batımı fotoğraf molası', 'Bedevi kampında açık büfe akşam yemeği', 'Şov ve dans gösterileri'],
        description: "Kahvaltının ardından serbest zaman (yürüme mesafesindeki Emirates Mall). Öğleden sonra altın çöllerde 4x4 araçlarla safari, kum sörfü ve gün batımında fotoğraflar. Akşam çölde kurulan bedevi kampında açık büfe yemek, ardından şov ve dans gösterileri. Otele dönüş." },
      { day: '3. Gün', date: '27 Mart - Abu Dabi & Burj Khalifa', title: 'Abu Dabi Şehir Turu · Burj Khalifa 123. Kat',
        activities: ['Şeyh Zayed Camii', 'Emirates Palace', 'Abu Dabi Corniche', 'Dubai Mall', 'Burj Khalifa 123. kat (giriş dahil)', 'Su & ışık gösterisi'],
        description: "Kahvaltı sonrası özel aracımızla Abu Dabi'ye; İslam dünyasının en zarif yapılarından Şeyh Zayed Camii, Emirates Palace ve Corniche. Dubai'ye dönüşte Dubai Mall ve dünyanın en yüksek binası Burj Khalifa'nın 123. katından şehir manzarası (giriş dahil). Akşam su & ışık gösterisi ve serbest zaman." },
      { day: '4. Gün', date: '28 Mart - Eski Dubai & Marina Tekne Turu', title: 'Dubai Şehir Turu · Marina Akşam Yemekli Tekne Turu',
        activities: ['Al Seef & abra turu', 'Palm Adası & Atlantis', 'Souk Madinat Jumeirah', "Marina'da akşam yemekli tekne turu"],
        description: "Kahvaltı sonrası Eski Dubai çarşıları ve Al Seef'te gezinti (abra turu, alışveriş). Palm Adası ve Atlantis Oteli'ni turlayıp Souk Madinat Jumeirah'ın mimarisinin keyfini çıkarıyoruz. Akşam Marina'da açık büfe akşam yemekli tekne turuyla Dubai'nin ışıltısını izliyoruz." },
      { day: '5. Gün', date: '29 Mart - Miracle Garden & Dönüş', title: 'Miracle Garden · Dubai Outlet Mall · Dönüş',
        activities: ['Otel çıkışı', 'Miracle Garden', 'Dubai Outlet Mall (serbest)', 'Dönüş uçuşu (20:50)'],
        description: "Kahvaltı ve check-out sonrası dünyanın en büyük çiçek bahçesi Miracle Garden ve son alışveriş için Dubai Outlet Mall. 18:00'de Sharjah Havalimanı'nda oluyor, 20:50 uçağımızla dönüyoruz; 30 Mart 00:20'de İstanbul." },
    ],
    faq: [
      { question: 'İptal ve iade koşulları nelerdir?', answer: CANCEL },
      { question: 'Rezervasyon ve ödeme nasıl yapılır?', answer: '200 EUR kapora ile kesin kayıt oluşur; kalan tutar 10 Mart\'a kadar taksitlendirilebilir (1 Mart itibarıyla yarısı ödenmiş olmalıdır). Çocuk (2-6 yaş) 800 EUR, bebek (0-2 yaş) 300 EUR.' },
      { question: 'Vize gerekiyor mu?', answer: 'Vize hizmeti ve ücreti fiyata dahildir. Yeşil pasaport sahipleri BAE\'ye vizesiz girebilir ve 75 EUR indirim hakkına sahiptir.' },
      { question: 'Uçuş bilgileri nelerdir?', answer: 'Gidiş: 25 Mart 00:35 Sabiha Gökçen → Sharjah (Air Arabia G9284). Dönüş: 29 Mart 20:50 Sharjah → Sabiha Gökçen, 30 Mart 00:20 varış (G9285). 20 kg bagaj dahil.' },
      { question: 'Konaklama nerede?', answer: '5 yıldızlı Elite Byblos otelde 4 gece, kahvaltı dahil.' },
      { question: 'Kimler katılabilir?', answer: WHO },
      { question: 'Pasaport için bir şart var mı?', answer: PASSPORT },
    ],
  },

  {
    slug: 'fas-turu',
    title: 'Binbir Gece Masalları & Baştan Başa Fas Turu',
    description: 'Kazablanka, Marakeş, Essaouira, Rabat, Tanca, Şefşaven ve Fes; Hasan II Camii\'nden UNESCO medinalara 7 günlük her şey dahil Fas turu. Namaz vakitlerine uygun.',
    pricePerPerson: 1475, currency: 'EUR',
    priceNote: 'Çocuk (2-6 yaş): 1.050 EUR · Bebek (0-2 yaş): 400 EUR · 375 EUR kapora ile rezervasyon.',
    groupSize: 'Maksimum 15 kişi (butik)', destination: 'Fas (Kazablanka · Marakeş · Tanca · Fes)',
    image: '/images/tours/fas.jpg',
    dates: '4 - 10 Temmuz 2026', startDate: '2026-07-04', endDate: '2026-07-10', duration: '7 gün / 6 gece',
    featured: true, order: 2,
    highlights: [
      'Marakeş, Kazablanka, Tanca ve Fes; 7 şehir tek turda',
      "Hasan II Camii (İslam dünyasının en büyük camilerinden)",
      'UNESCO Fes el-Bali Medinası & Karaouiyine Üniversitesi',
      'Mavi şehir Şefşaven ve Atlantik kıyısı Essaouira',
      'Bahia Sarayı, Koutoubia Camii, Jemaa el-Fna',
      '6 gece 3-4 yıldızlı otel, kahvaltı ve akşam yemekleri dahil',
      'Air Arabia ile gidiş-dönüş uçak bileti (+20 kg bagaj, ikram dahil)',
      'Namaz vakitlerine uygun program · Her şey dahil',
    ],
    included: [
      'Sabiha Gökçen - Kazablanka gidiş-dönüş Air Arabia uçak bileti (+20 kg bagaj, ikram dahil)',
      '6 gece 3-4 yıldızlı otellerde konaklama (kahvaltı dahil)',
      'Şehir içi ve şehirlerarası tüm transferler',
      'Tüm kahvaltı ve akşam yemekleri',
      'Tüm müze ve ören yeri giriş ücretleri',
      'Seyahat sigortası',
    ],
    notIncluded: [
      'Yurt dışı çıkış harcı (havalimanında 1250 TL)',
      'Tüm şahsi harcamalar',
      'Yerel bahşişler (ortalama 10 EUR)',
    ],
    itinerary: [
      { day: '1. Gün', date: '4 Temmuz - Kazablanka & Marakeş', title: 'İstanbul - Kazablanka - Marakeş (Şehir Turu 1)',
        activities: ['Sabiha Gökçen buluşma (3 Temmuz 22:30)', "Kazablanka'ya varış (04:35)", "Marakeş'e transfer", 'Bahia Sarayı', 'Ben Youssef Medresesi', 'Koutoubia Camii', 'Jemaa el-Fna Meydanı & Medina'],
        description: "3 Temmuz 22:30'da Sabiha Gökçen'de buluşuyoruz; 01:30 uçağımızla Kazablanka'ya hareket edip 04:35'te varıyoruz. Yaklaşık 2 saat 45 dakikalık transferle Marakeş'e geçip kahvaltının ardından şehir turuna başlıyoruz: Bahia Sarayı, Ben Youssef Medresesi, Koutoubia Camii ve Jemaa el-Fna Meydanı ile çevresindeki Medina. Otele dönüş, akşam yemeği ve serbest zaman. Konaklama Marakeş'te." },
      { day: '2. Gün', date: '5 Temmuz - Essaouira', title: 'Marakeş - Essaouira - Marakeş',
        activities: ["Essaouira'ya transfer (~3 saat)", 'UNESCO Essaouira Medinası', 'Skala de la Kasbah', 'Balıkçı limanı', "Marakeş'e dönüş"],
        description: "Kahvaltı sonrası Atlantik kıyısındaki Essaouira'ya (~3 saat) gidiyoruz. Mavi-beyaz mimarisi, surlarla çevrili UNESCO Dünya Mirası Medinası, dar sokakları, sanat atölyeleri ve geleneksel pazarları; Skala de la Kasbah ve balıkçı limanı. Serbest zamanın ardından akşam Marakeş'e dönüş. Konaklama Marakeş'te." },
      { day: '3. Gün', date: '6 Temmuz - Marakeş & Kazablanka', title: 'Marakeş Şehir Turu 2 - Kazablanka',
        activities: ['Majorelle Bahçesi', "Kazablanka'ya transfer (~3,5 saat)", 'Hasan II Camii', 'Corniche', 'BM Meydanı'],
        description: "Kahvaltı sonrası Marakeş'in sanat ve botanik kimliğini yansıtan Majorelle Bahçesi'ni gezip ~3,5 saatlik yolculukla Kazablanka'ya geçiyoruz. İslam dünyasının en büyük camilerinden Hasan II Camii, Corniche sahil yolu ve Birleşmiş Milletler Meydanı. Medina'da son alışveriş. Konaklama Kazablanka'da." },
      { day: '4. Gün', date: '7 Temmuz - Rabat & Tanca', title: 'Kazablanka - Rabat - Tanca Şehir Turu',
        activities: ['Hassan Kulesi & V. Muhammed Türbesi', 'Oudaya Kasbah', "Tanca'ya transfer (~2,5 saat)", 'Kasbah & Medina', 'Cap Spartel', 'Grand & Petit Socco'],
        description: "Kahvaltı sonrası ~1 saatte başkent Rabat'a; Hassan Kulesi ve V. Muhammed Türbesi, Atlantik kıyısındaki Oudaya Kasbah ve Kraliyet Sarayı çevresi. Ardından ~2,5 saatte Atlantik ile Akdeniz'in buluştuğu Tanca'ya; Kasbah ve Medina, Atlantik-Akdeniz buluşmasının panoramik noktası Cap Spartel, Tanca sahili ve canlı Grand/Petit Socco meydanları. Konaklama Tanca'da." },
      { day: '5. Gün', date: '8 Temmuz - Şefşaven & Fes', title: 'Tanca - Şefşaven - Fes',
        activities: ["Şefşaven'e transfer (~1,5 saat)", 'Mavi sokaklar & Medina', 'Uta el Hammam Meydanı', 'Ras El Ma', "Fes'e transfer (~3 saat)"],
        description: "Kahvaltı sonrası Rif Dağları eteğindeki, mavi boyalı sokakları ve huzurlu atmosferiyle ünlü Şefşaven'e (~1,5 saat) gidiyoruz. Medina, Kasbah Meydanı, Uta el Hammam Meydanı ve Ras El Ma su kaynağı; fotoğraf ve serbest zaman. Akşam ~3 saatlik yolculukla Fes'e. Konaklama Fes'te." },
      { day: '6. Gün', date: '9 Temmuz - Fes', title: 'Fes Şehir Turu (UNESCO Fes el-Bali)',
        activities: ['Bab Bou Jeloud', 'Karaouiyine Üniversitesi & Camii', 'Attarine Medresesi', 'Mevlay İdris Türbesi', 'Deri tabakhaneleri', 'Kraliyet Sarayı kapıları'],
        description: "Tam gün Fes şehir turu. Şehrin simgesel kapısı Bab Bou Jeloud'dan UNESCO korumasındaki Fes el-Bali Medinası'na giriyoruz. Dünyanın en eski üniversitelerinden ve İslam ilim tarihinde çok önemli bir yere sahip Karaouiyine Üniversitesi ve Camii, Attarine Medresesi, şehir için manevi öneme sahip Mevlay İdris Türbesi, asırlardır geleneksel yöntemlerle çalışan deri tabakhaneleri ve Kraliyet Sarayı kapıları. Konaklama Fes'te." },
      { day: '7. Gün', date: '10 Temmuz - Dönüş', title: 'Fes - Kazablanka - İstanbul',
        activities: ['Otel kahvaltısı', "Kazablanka Havalimanı'na transfer", 'Dönüş uçuşu (18:00)'],
        description: "Kahvaltı sonrası Kazablanka Havalimanı'na hareket ediyoruz (15:00 varış). 18:00 uçağımızla dönüş; 11 Temmuz 01:40'ta İstanbul'a iniş." },
    ],
    faq: [
      { question: 'İptal ve iade koşulları nelerdir?', answer: CANCEL },
      { question: 'Rezervasyon ve ödeme nasıl yapılır?', answer: '375 EUR kapora ile kesin kayıt oluşur; kalan bakiye tur tarihinden önce taksitlerle tamamlanır (7 Nisan itibarıyla yarısı ödenmiş olmalıdır). Çocuk (2-6 yaş) 1.050 EUR, bebek (0-2 yaş) 400 EUR.' },
      { question: 'Uçuş bilgileri nelerdir?', answer: 'Gidiş: 4 Temmuz 01:30 Sabiha Gökçen → Kazablanka (Air Arabia 30438). Dönüş: 10 Temmuz 18:00 Kazablanka → Sabiha Gökçen, 11 Temmuz 01:40 varış (30437). 20 kg bagaj ve ikram dahil.' },
      { question: 'Konaklama nerede?', answer: 'Tur boyunca 3-4 yıldızlı otellerde 6 gece, kahvaltı dahil (Marakeş, Kazablanka, Tanca, Fes).' },
      { question: 'Kimler katılabilir?', answer: WHO },
      { question: 'Pasaport için bir şart var mı?', answer: PASSPORT },
    ],
  },

  {
    slug: 'misir-turu-nisan-2026',
    title: 'Mısır Turu - Kahire & Şarm el Şeyh (Nisan)',
    description: 'Giza Piramitleri, tarihi Kahire, Şarm el Şeyh\'te 5 yıldızlı her şey dahil resort, ATV safari ve Ras Muhammed dalış turuyla 5 günlük Mısır deneyimi. Namaz vakitlerine uygun.',
    pricePerPerson: 899, currency: 'EUR',
    priceNote: 'Çocuk (3-9 yaş): 699 EUR · Bebek (0-3 yaş): 549 EUR · Tek kişilik oda farkı: +150 EUR · 200 EUR kapora ile rezervasyon.',
    groupSize: 'Maksimum 15 kişi (butik)', destination: 'Mısır (Kahire & Şarm el Şeyh)',
    image: '/uploads/media/egypt.jpg',
    dates: '23 - 28 Nisan 2026', startDate: '2026-04-23', endDate: '2026-04-28', duration: '5 gün / 4 gece',
    featured: false, order: 20,
    highlights: [
      'Giza Piramitleri ve Mısır Medeniyeti Müzesi',
      'Tarihi Kahire: El-Ezher, Hz. Hüseyin Camii, Han El Halili',
      'Şarm el Şeyh\'te 5 yıldızlı her şey dahil resort',
      'ATV çöl safarisi ve bedevi gecesi',
      'Ras Muhammed & Beyaz Ada tekne turu, şnorkel ve dalış',
      'Nil\'de gün batımı felucca turu',
      'AJET ile gidiş-dönüş uçak bileti (+20 kg bagaj)',
      'Namaz vakitlerine uygun program · Her şey dahil · Kapıda vize dahil',
    ],
    included: [
      'Sabiha Gökçen - Kahire & Şarm el Şeyh - Sabiha Gökçen AJET gidiş-dönüş uçak bileti (+20 kg bagaj)',
      'Kahire\'de 2 gece kahvaltı dahil konaklama',
      'Şarm el Şeyh\'te 2 gece 5 yıldızlı her şey dahil resort (Sharm Resort & Plaza)',
      'Tüm şehir içi ve şehirlerarası transferler',
      'Tüm kahvaltı ve akşam yemekleri',
      'Tüm müze ve ören yeri giriş ücretleri',
      'ATV çöl safarisi ve bedevi gecesi',
      'Nil felucca tekne turu',
      'Ras Muhammed tekne turu ve tüplü dalış',
      'Seyahat sağlık sigortası',
      'Kapıda vize',
    ],
    notIncluded: [
      'Yurt dışı çıkış harcı (havalimanında 1250 TL)',
      'Tüm şahsi harcamalar',
      'Yerel bahşişler (ortalama 10 dolar)',
      'Piramit iç giriş ücreti',
    ],
    itinerary: [
      { day: '1. Gün', date: '23 Nisan - Tarihi Kahire', title: 'İstanbul - Kahire · Tarihi Kahire Turu',
        activities: ['Sabiha Gökçen kalkış (11:40)', "Kahire'ye varış (14:25)", 'İmam Şâfiî Kabri', 'El-Ezher Camii', 'Hz. Hüseyin Camii', 'El-Muiz Caddesi', 'El Fishawy Cafe', 'Han El Halili Çarşısı'],
        description: "Sabiha Gökçen'den 13:00 kalkış, 14:25'te Kahire'ye varış. Vize ve bagaj sonrası tarihi Kahire turu: İmam Şâfiî Kabri, El-Ezher Camii ve Külliyesi, Hz. Hüseyin Camii; Fatımi ve Memluk yapılarıyla açık hava müzesi El-Muiz Caddesi; Mehmet Akif Ersoy'un da uğradığı El Fishawy Cafe'de mola ve Han El Halili Çarşısı'nda serbest alışveriş. Akşam yemeği. Konaklama Kahire'de." },
      { day: '2. Gün', date: '24 Nisan - Antik Mısır & Giza', title: 'Giza Piramitleri · Mısır Müzesi · Nil Felucca',
        activities: ['Giza Piramitleri (alan girişi dahil)', 'Papirüs Atölyesi', 'Mısır Medeniyeti Müzesi', 'Selahaddin Kalesi & Muhammed Ali Camii', 'Nil\'de felucca turu'],
        description: "Kahvaltı sonrası Giza Piramitleri (alan girişi dahil; piramit içi hariç), papirüs atölyesi ve Mısır Medeniyeti Müzesi. Öğleden sonra Kahire'yi gören Selahaddin Kalesi ve Osmanlı mimarili Kavalalı Mehmet Ali Paşa Camii. Akşam Nil Nehri'nde gün batımında felucca turu, akşam yemeği. Konaklama Kahire'de." },
      { day: '3. Gün', date: '25 Nisan - Şarm el Şeyh', title: 'Kahire - Şarm el Şeyh · ATV Safari & Bedevi Gecesi',
        activities: ["Şarm el Şeyh'e transfer", 'Her şey dahil otele yerleşme', 'ATV çöl safarisi', 'Bedevi gecesi (yemek & gösteri)'],
        description: "Sabah erken Şarm el Şeyh'e hareket; Kızıldeniz'in tatil cennetine varışta her şey dahil otele yerleşme ve dinlenme. Öğleden sonra ATV çöl safarisi; akşam geleneksel müzik, yerel lezzetler ve otantik atmosferle bedevi gecesi. Konaklama Şarm el Şeyh'te." },
      { day: '4. Gün', date: '26 Nisan - Kızıldeniz', title: 'Ras Muhammed & Beyaz Ada Tekne Turu',
        activities: ['Öğle yemekli tekne turu', 'Ras Muhammed & Beyaz Ada', 'Mercan resiflerinde şnorkel', 'Tüplü dalış (opsiyonel)'],
        description: "Kahvaltı sonrası dünyanın önde gelen dalış ve doğa noktalarından Ras Muhammed ve Beyaz Ada'ya öğle yemekli tekne turu. Turkuaz sularda yüzme molaları, mercan resiflerinde şnorkel ve dileyen için tüplü dalış. Öğle yemeği teknede. Akşam otele dönüş. Konaklama Şarm el Şeyh'te." },
      { day: '5. Gün', date: '27-28 Nisan - Şehir Turu & Dönüş', title: 'Şarm el Şeyh Şehir Turu ve Dönüş',
        activities: ['Otel çıkışı', 'El Sahaba Camii', 'Old Bazaar', 'Naama Bay', 'Havalimanına transfer', 'Dönüş uçuşu (28 Nisan 04:00)'],
        description: "Kahvaltı ve check-out sonrası şehir turu: zarif mimarisiyle El Mustafa ve görkemli El Sahaba Camii, Old Bazaar'da serbest zaman, Kızıldeniz manzaralı Farsha Cafe ve Naama Bay sahil yürüyüşü. Ardından havalimanına transfer; 28 Nisan 04:00 uçağımızla dönüş (06:40 varış)." },
    ],
    faq: [
      { question: 'İptal ve iade koşulları nelerdir?', answer: CANCEL },
      { question: 'Rezervasyon ve ödeme nasıl yapılır?', answer: '200 EUR kapora ile kesin kayıt oluşur; kalan bakiye tur tarihinden önce tamamlanır (1 Nisan itibarıyla en az yarısı ödenmiş olmalıdır). Çocuk (3-9 yaş) 699 EUR, bebek (0-3 yaş) 549 EUR, tek kişilik oda farkı +150 EUR.' },
      { question: 'Uçuş bilgileri nelerdir?', answer: 'Gidiş: 23 Nisan 13:00 Sabiha Gökçen → Kahire (AJET VF391). Dönüş: 28 Nisan 04:00 Şarm el Şeyh → Sabiha Gökçen, 06:40 varış (AJET VF256). 20 kg bagaj dahil.' },
      { question: 'Vize gerekiyor mu, ek resmi ücretler var mı?', answer: 'Kapıda vize fiyata dahildir. ' + EXIT },
      { question: 'Konaklama nerede?', answer: 'Kahire\'de 2 gece kahvaltı dahil; Şarm el Şeyh\'te 2 gece 5 yıldızlı her şey dahil Sharm Resort & Plaza Hotel.' },
      { question: 'Kimler katılabilir?', answer: WHO },
      { question: 'Pasaport için bir şart var mı?', answer: PASSPORT },
    ],
  },

  {
    slug: 'ozbekistan-turu',
    title: 'Özbekistan Turu - Hiva, Buhara, Semerkant, Taşkent',
    description: 'İçan Kala\'dan Registan Meydanı\'na; İmam Buhari ve Bahauddin Nakşibendi türbelerinden Şah-ı Zinde\'ye, İslam medeniyetinin kalbinde 6 günlük butik İpek Yolu turu. Türkçe rehberlik, namaz vakitlerine uygun.',
    pricePerPerson: 1250, currency: 'EUR',
    priceNote: 'Çocuk (3-9 yaş): 900 EUR · Bebek (0-3 yaş): 700 EUR · 270 EUR kapora ile rezervasyon · Kampanya fiyatı.',
    groupSize: 'Maksimum 15 kişi (butik)', destination: 'Özbekistan (Hiva · Buhara · Semerkant · Taşkent)',
    image: '/uploads/media/samarkand.jpg',
    dates: '24 - 30 Mayıs 2026', startDate: '2026-05-24', endDate: '2026-05-30', duration: '6 gün / 5 gece',
    featured: false, order: 21,
    highlights: [
      'Hiva İçan Kala açık hava müzesi (UNESCO)',
      'Buhara: Ark Kalesi, Kalon Minaresi, Mir Arab Medresesi',
      'Semerkant: Registan Meydanı, Gur-i Emir, Şah-ı Zinde',
      'İmam Buhari ve Bahauddin Nakşibendi türbeleri',
      'Taşkent: Hazreti İmam Kompleksi (Hz. Osman Mushaf-ı Şerifi)',
      'THY ile gidiş-dönüş uçak bileti (+20 kg bagaj)',
      'Türkçe rehberlik · 5 gece kahvaltı dahil konaklama',
      'Namaz vakitlerine uygun program',
    ],
    included: [
      'Gidiş-dönüş uçak biletleri (+20 kg bagaj)',
      '3-4 yıldızlı otellerde 5 gece konaklama (kahvaltı dahil)',
      'Şehir içi ve şehirlerarası tüm transferler',
      'Tüm kahvaltı ve akşam yemekleri',
      'Türkçe rehberlik hizmeti',
      'Programdaki tüm ziyaret ve geziler için giriş biletleri',
      'Seyahat sağlık sigortası',
    ],
    notIncluded: [
      'Yurt dışı çıkış harcı (havalimanında 1250 TL)',
      'Tüm şahsi harcamalar',
      'Yerel bahşişler (ortalama 10 dolar)',
    ],
    itinerary: [
      { day: '1. Gün', date: '24 Mayıs - Hiva', title: 'İstanbul - Ürgenç - Hiva (İçan Kala)',
        activities: ['İstanbul Havalimanı buluşma (23 Mayıs 22:00)', "Ürgenç'e varış", 'İçan Kala & Ata Darvaza', 'Köhne Ark Sarayı', 'Muhammed Emin Han Medresesi & Kelte Minar', 'Cuma Camii', 'Pahlavan Mahmud Türbesi'],
        description: "23 Mayıs 22:00'de İstanbul Havalimanı'nda buluşuyor, 01:05 uçağımızla Ürgenç'e gidiyoruz. Rehberimiz eşliğinde, Orta Çağ dokusunu en iyi koruyan UNESCO şehri Hiva'ya geçiyoruz. Surlar içindeki açık hava müzesi İçan Kala'yı Ata Darvaza kapısından gezmeye başlıyoruz: Köhne Ark Sarayı, şehrin simgesi Muhammed Emin Han Medresesi ve Kelte Minar, Muhammed Rahim Han Medresesi, Taş Avlu Sarayı, ahşap sütunlu Cuma Camii, İslam Hoca Medresesi ve Pahlavan Mahmud Türbesi. Akşam yemeği. Konaklama Hiva'da." },
      { day: '2. Gün', date: '25 Mayıs - Buhara', title: 'Hiva - Buhara · Labi Havuz',
        activities: ["Buhara'ya yolculuk (~7 saat)", 'Çöl manzaraları', 'Otele yerleşme', 'Labi Havuz Meydanı (serbest)'],
        description: "Kahvaltı sonrası Orta Asya'nın kadim ilim, kültür ve ticaret merkezi Buhara'ya yaklaşık 7 saatlik yolculuk; yol boyunca uçsuz bucaksız çöl manzaraları. Otele yerleşme ve dinlenmenin ardından akşam yemeği; tarih boyunca tüccar ve ilim insanlarının buluşma noktası Labi Havuz Meydanı'nda serbest zaman. Konaklama Buhara'da." },
      { day: '3. Gün', date: '26 Mayıs - Buhara', title: 'Buhara Şehir Turu · Nakşibendi Türbesi',
        activities: ['Bahauddin Nakşibendi Türbesi', 'İsmail Samani Türbesi', 'Eyüp Peygamber Çeşmesi', 'Ark Kalesi', 'Kalon Mescidi & Minaresi', 'Mir Arab Medresesi', 'Uluğ Bey & Abdülaziz Han Medreseleri'],
        description: "Kahvaltı sonrası Nakşibendi tarikatının kurucusu Bahauddin Nakşibendi Türbesi, İsmail Samani Türbesi ve Eyüp Peygamber Çeşmesi. Eski Şehir'de Ark Kalesi, Kalon Mescidi ve Minaresi, hâlâ eğitim veren Mir Arab Medresesi, Bolo Houz Camii, Uluğ Bey ve Abdülaziz Han Medreseleri; İpek Yolu'nun kalbinde serbest alışveriş. Akşam yemeği. Konaklama Buhara'da." },
      { day: '4. Gün', date: '27 Mayıs - Semerkant', title: 'Buhara - Semerkant · İmam Buhari Türbesi',
        activities: ["Semerkant'a yolculuk (~5 saat)", 'Hoca Abdülhalik Gijduvani Türbesi', 'Seramik atölyesi', 'İmam Buhari Türbesi', 'İmam Maturidi Türbesi'],
        description: "Kahvaltı sonrası Semerkant'a ~5 saatlik yolculuk. Yol üzerinde Nakşibendi silsilesinin öncülerinden Hoca Abdülhalik Gijduvani Türbesi ve geleneksel seramik atölyesi. Semerkant'a varırken hadis ilminin en büyük isimlerinden İmam Buhari ile Mahdumi A'zam türbeleri; ardından İmam Maturidi ve Hace Ubeydullah-ı Ahrar ziyaretleri. Akşam yemeği. Konaklama Semerkant'ta." },
      { day: '5. Gün', date: '28 Mayıs - Semerkant', title: 'Semerkant Şehir Turu · Registan & Şah-ı Zinde',
        activities: ['Gur-i Emir (Emir Timur Türbesi)', 'Uluğ Bey Rasathanesi', 'Şah-ı Zinde Türbeler Kompleksi', 'Hazret Hızır Camii', 'Bibi Hanım Camii', 'Siyob Pazarı', 'Registan Meydanı'],
        description: "Kahvaltı sonrası Emir Timur'un türbesi Gur-i Emir ile başlıyoruz; Uluğ Bey Rasathanesi, asırlardır ziyaret edilen Şah-ı Zinde Türbeler Kompleksi (Kusam bin Abbas ve birçok İslam büyüğünün medfun olduğu), Hazret Hızır Camii, görkemli Bibi Hanım Camii ve Siyob Pazarı. Üç büyük medreseyle çevrili, Orta Asya İslam mimarisinin zirvesi Registan Meydanı (Uluğ Bey, Tilla Kari, Şirdar). Akşam yemeği. Konaklama Semerkant'ta." },
      { day: '6. Gün', date: '29-30 Mayıs - Taşkent & Dönüş', title: 'Semerkant - Taşkent - İstanbul',
        activities: ["Taşkent'e yolculuk (~5 saat)", 'Hazreti İmam Kompleksi (Mushaf-ı Şerif)', 'Emir Timur & Bağımsızlık Meydanı', 'Kökeldaş Medresesi', 'Çorsu Pazarı', 'Veda yemeği & dönüş'],
        description: "Kahvaltı sonrası başkent Taşkent'e ~5 saatlik yolculuk. Hz. Osman dönemine ait Mushaf-ı Şerif'e ev sahipliği yapan Hazreti İmam Kompleksi, Emir Timur Meydanı, Bağımsızlık Meydanı, hâlâ eğitim veren Kökeldaş Medresesi ve Çorsu Pazarı'nda serbest zaman. Veda yemeğinin ardından havalimanına transfer; 30 Mayıs ilk saatlerinde İstanbul'a dönüş." },
    ],
    faq: [
      { question: 'İptal ve iade koşulları nelerdir?', answer: CANCEL },
      { question: 'Rezervasyon ve ödeme nasıl yapılır?', answer: '270 EUR (%20) kapora ile kesin kayıt oluşur; kalan tutar 9 Mayıs\'a kadar taksitlendirilebilir (2 Mayıs itibarıyla yarısı ödenmiş olmalıdır). Çocuk (3-9 yaş) 900 EUR, bebek (0-3 yaş) 700 EUR.' },
      { question: 'Uçuş bilgileri nelerdir?', answer: 'Gidiş: 24 Mayıs 01:05 İstanbul → Ürgenç (THY TK262). Dönüş: 30 Mayıs 02:20 Taşkent → İstanbul, 05:35 varış (THY TK371). 20 kg bagaj dahil.' },
      { question: 'Konaklama nerede?', answer: '3-4 yıldızlı otellerde 5 gece, kahvaltı dahil (Hiva, Buhara, Semerkant).' },
      { question: 'Kimler katılabilir?', answer: WHO },
      { question: 'Pasaport için bir şart var mı?', answer: PASSPORT },
    ],
  },
];

// ---- SQL generation (dollar-quoted; idempotent upsert by slug) ----
const dq = (s) => `$q$${s}$q$`; // safe: content never contains $q$
const pgArr = (arr) => (arr && arr.length ? `ARRAY[${arr.map(dq).join(',')}]::text[]` : `ARRAY[]::text[]`);

let sql = 'BEGIN;\n';
for (const t of TOURS) {
  sql += `INSERT INTO "Tour" (id, slug, title, description, "pricePerPerson", currency, "priceNote", "groupSize", type, destination, image, gallery, "specialOffer", dates, duration, "startDate", "endDate", highlights, included, "notIncluded", itinerary, faq, featured, active, "order", "createdAt", "updatedAt") VALUES (`;
  sql += `gen_random_uuid()::text, '${t.slug}', ${dq(t.title)}, ${dq(t.description)}, ${t.pricePerPerson}, '${t.currency}', ${dq(t.priceNote)}, ${dq(t.groupSize)}, 'international', ${dq(t.destination)}, ${dq(t.image)}, ARRAY[]::text[], false, ${dq(t.dates)}, ${dq(t.duration)}, '${t.startDate}', '${t.endDate}', ${pgArr(t.highlights)}, ${pgArr(t.included)}, ${pgArr(t.notIncluded)}, $itin$${JSON.stringify(t.itinerary)}$itin$::jsonb, $faq$${JSON.stringify(t.faq)}$faq$::jsonb, ${t.featured}, true, ${t.order}, now(), now())\n`;
  sql += `ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, "pricePerPerson"=EXCLUDED."pricePerPerson", currency=EXCLUDED.currency, "priceNote"=EXCLUDED."priceNote", "groupSize"=EXCLUDED."groupSize", type=EXCLUDED.type, destination=EXCLUDED.destination, image=EXCLUDED.image, dates=EXCLUDED.dates, duration=EXCLUDED.duration, "startDate"=EXCLUDED."startDate", "endDate"=EXCLUDED."endDate", highlights=EXCLUDED.highlights, included=EXCLUDED.included, "notIncluded"=EXCLUDED."notIncluded", itinerary=EXCLUDED.itinerary, faq=EXCLUDED.faq, featured=EXCLUDED.featured, "order"=EXCLUDED."order", "updatedAt"=now();\n`;
}
// Remove the earlier mistaken duplicate slugs (consolidated onto dubai-turu / fas-turu).
sql += `DELETE FROM "Tour" WHERE slug IN ('dubai-abu-dabi-turu','fas-binbir-gece-turu');\n`;
sql += 'COMMIT;\nSELECT slug, "startDate"::date, "endDate"::date, "pricePerPerson", featured, active FROM "Tour" ORDER BY "order";\n';
fs.writeFileSync(path.resolve('scripts/fix-tours.sql'), sql, 'utf8');
console.log(`SQL written: ${TOURS.length} tours`);

// ---- seed tours.json consistency ----
const toursPath = path.resolve('public/data/tours.json');
const raw = JSON.parse(fs.readFileSync(toursPath, 'utf8'));
raw.featured = raw.featured || [];
for (const t of TOURS) {
  const entry = {
    id: t.slug, slug: t.slug, title: t.title, description: t.description,
    pricePerPerson: t.pricePerPerson, currency: t.currency, priceNote: t.priceNote,
    groupSize: t.groupSize, type: 'international', destination: t.destination, image: t.image,
    gallery: [], specialOffer: false, dates: t.dates, duration: t.duration,
    startDate: t.startDate, endDate: t.endDate, highlights: t.highlights,
    included: t.included, notIncluded: t.notIncluded, itinerary: t.itinerary, faq: t.faq,
    featured: t.featured,
  };
  const idx = raw.featured.findIndex((x) => x.slug === t.slug);
  if (idx >= 0) raw.featured[idx] = { ...raw.featured[idx], ...entry };
  else raw.featured.push(entry);
}
// drop the earlier mistaken duplicate slugs from the seed too
const removed = ['dubai-abu-dabi-turu', 'fas-binbir-gece-turu'];
raw.featured = raw.featured.filter((x) => !removed.includes(x.slug));
fs.writeFileSync(toursPath, JSON.stringify(raw, null, 2) + '\n', 'utf8');
console.log(`seed tours.json: now ${raw.featured.length} tours`);
