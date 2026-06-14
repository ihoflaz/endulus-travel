// One-off production data sync — run inside the backend container:
//   docker compose exec -T backend node --input-type=module < ep-prod-sync.mjs
//
// 1. Updates the "misir-turu-ozel" Tour from /seed-data/tours.json (the bind-
//    mounted public/data, refreshed by git pull).
// 2. Fixes stale/placeholder settings that were seeded from the old JSON
//    (contact phone/address/social) and populates the empty site/footer/whatsapp
//    settings. Contact is merged — only known-wrong fields are overwritten.
import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';

const prisma = new PrismaClient();

const REAL = {
  phone: '+90 507 938 45 08',
  address: 'Osmanağa Mah. Çilek Sok. Akel İşhanı No:1 Kat:2 İç Kapı No:42, Kadıköy / İstanbul',
  instagram: 'https://www.instagram.com/endulustravell/',
  waNumber: '905079384508',
};

const upsertSetting = async (key, value) => {
  await prisma.setting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
  console.log(`[sync] setting "${key}" updated`);
};

const main = async () => {
  // --- 1. Egypt tour from seed data ---
  try {
    const raw = JSON.parse(fs.readFileSync('/seed-data/tours.json', 'utf8'));
    const t = (raw.featured || []).find((x) => x.slug === 'misir-turu-ozel');
    if (!t) {
      console.warn('[sync] misir-turu-ozel not found in /seed-data/tours.json — skipping tour');
    } else {
      await prisma.tour.update({
        where: { slug: 'misir-turu-ozel' },
        data: {
          title: t.title,
          description: t.description ?? null,
          pricePerPerson: t.pricePerPerson ?? null,
          originalPrice: t.originalPrice ?? null,
          campaignPrice: t.campaignPrice ?? null,
          currency: t.currency ?? null,
          priceStatus: t.priceStatus ?? null,
          priceNote: t.priceNote ?? null,
          groupSize: t.groupSize ?? null,
          category: t.category ?? null,
          type: t.type ?? null,
          destination: t.destination ?? null,
          image: t.image ?? null,
          gallery: Array.isArray(t.gallery) ? t.gallery : [],
          specialOffer: !!t.specialOffer,
          dates: t.dates ?? null,
          duration: t.duration ?? null,
          highlights: Array.isArray(t.highlights) ? t.highlights : [],
          included: Array.isArray(t.included) ? t.included : [],
          notIncluded: Array.isArray(t.notIncluded) ? t.notIncluded : [],
          itinerary: t.itinerary ?? null,
          whatsappMessage: t.whatsappMessage ?? null,
        },
      });
      console.log(`[sync] tour "misir-turu-ozel" updated → ${t.pricePerPerson} ${t.currency}, ${t.dates}`);
    }
  } catch (e) {
    console.error('[sync] tour update failed:', e.message);
  }

  // --- 2. contact (merge: fix only the known-wrong fields) ---
  const existing = await prisma.setting.findUnique({ where: { key: 'contact' } });
  const contact = { ...(existing?.value || {}) };
  contact.phone = REAL.phone;
  contact.address = REAL.address;
  contact.email = contact.email || 'info@endulustravel.com';
  contact.social = {
    instagram: REAL.instagram,
    facebook: '',
    twitter: '',
    youtube: '',
  };
  await upsertSetting('contact', contact);

  // --- 3. site (SEO / branding) ---
  await upsertSetting('site', {
    title: 'Endülüs Travel — Namaz Vakitlerine Uygun, Her Şey Dahil Butik Turlar',
    description:
      'Hassasiyetlerinizi gözeten kişiselleştirilmiş tur deneyimleri. Maksimum 20 kişilik butik gruplar, namaz vakitlerine uygun program, helal mutfak, ekstra tursuz. Mısır, Fas, Özbekistan, Dubai turları.',
    keywords: [
      'endülüs travel', 'mısır turu', 'helal tur', 'namaz vakitli tur',
      'butik tur', 'şarm el şeyh', 'kahire turu', 'muhafazakar tatil',
    ],
    ogImage: 'https://endulustravel.com/favicon/web-app-manifest-512x512.png',
  });

  // --- 4. footer ---
  await upsertSetting('footer', {
    aboutText: 'Kadim sokaklardan ihtişamlı saraylara, sıcak çöllerden derin okyanuslara',
    legalName: 'ROTA ATLAS TURİZM SEYAHAT ACENTASI',
    licenseNumber: 'TURSAB No: 6739',
    copyright: 'Endülüs Travel. Tüm hakları saklıdır.',
  });

  // --- 5. whatsapp ---
  await upsertSetting('whatsapp', {
    number: REAL.waNumber,
    defaultMessage: 'Merhaba, turlarınız hakkında bilgi almak istiyorum.',
  });

  console.log('[sync] done');
};

main()
  .catch((e) => { console.error('[sync] fatal:', e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
