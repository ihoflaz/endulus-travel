/**
 * Seed Postgres with the original static JSON content from public/data/*.
 * Idempotent: skips inserts if rows already exist by their natural key.
 * Also seeds an initial admin user from env (ADMIN_EMAIL / ADMIN_PASSWORD).
 */
import { PrismaClient } from '@prisma/client';
import { hash as bcryptHash } from '../src/utils/password.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

// In docker the original JSON files are mounted at /seed-data.
// For local runs, fall back to the frontend public/data folder.
const candidates = [
  process.env.SEED_DATA_DIR,
  '/seed-data',
  path.resolve(__dirname, '..', '..', 'public', 'data'),
  path.resolve(process.cwd(), 'public', 'data'),
].filter(Boolean);
const DATA_DIR = candidates.find((p) => fs.existsSync(p) && fs.statSync(p).isDirectory()) || candidates[0];
console.log(`[seed] using data dir: ${DATA_DIR}`);

const readJson = (name) => {
  const p = path.join(DATA_DIR, name);
  if (!fs.existsSync(p)) {
    console.warn(`[seed] missing ${p} — skipping`);
    return null;
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
};

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Admin';
  if (!email || !password) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in production');
    }
    console.warn('[seed] skipping admin: ADMIN_EMAIL/ADMIN_PASSWORD not set');
    return;
  }
  if (process.env.NODE_ENV === 'production' && password.length < 10) {
    throw new Error('ADMIN_PASSWORD must be at least 10 characters in production');
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`[seed] admin already exists: ${email}`);
    return;
  }
  const rounds = Number(process.env.BCRYPT_ROUNDS || 12);
  const passwordHash = await bcryptHash(password, rounds);
  await prisma.user.create({
    data: { email, passwordHash, name, role: 'ADMIN', active: true },
  });
  console.log(`[seed] created admin user: ${email}`);
}

async function seedTours() {
  const data = readJson('tours.json');
  if (!data?.featured?.length) return;
  for (const [i, t] of data.featured.entries()) {
    const existing = await prisma.tour.findUnique({ where: { slug: t.slug } });
    if (existing) continue;
    await prisma.tour.create({
      data: {
        slug: t.slug,
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
        order: i,
      },
    });
  }
  console.log(`[seed] tours: ${data.featured.length} processed`);
}

async function seedBlog() {
  const data = readJson('blog.json');
  if (!Array.isArray(data)) return;
  for (const [i, p] of data.entries()) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: p.slug } });
    if (existing) continue;
    await prisma.blogPost.create({
      data: {
        slug: p.slug,
        title: p.title,
        summary: p.summary ?? null,
        content: p.content ?? null,
        coverImage: p.coverImage ?? null,
        category: p.category ?? null,
        date: p.date ?? null,
        author: p.author ?? null,
        order: i,
      },
    });
  }
  console.log(`[seed] blog posts: ${data.length} processed`);
}

async function seedServices() {
  const services = readJson('services.json') || [];
  const content = readJson('service-content.json') || {};
  for (const [i, s] of services.entries()) {
    const existing = await prisma.service.findUnique({ where: { serviceId: s.id } });
    if (existing) continue;
    const ext = content[s.id] || {};
    await prisma.service.create({
      data: {
        serviceId: s.id,
        title: s.title,
        description: s.description ?? null,
        icon: s.icon ?? null,
        image: ext.image ?? null,
        fullDescription: ext.fullDescription ?? null,
        features: Array.isArray(ext.features) ? ext.features : [],
        isWomenGroup: false,
        order: i,
      },
    });
  }

  // Women groups → also stored as Service rows (isWomenGroup=true)
  const women = readJson('women-groups.json') || [];
  for (const [i, w] of women.entries()) {
    const existing = await prisma.service.findUnique({ where: { serviceId: w.id } });
    if (existing) continue;
    await prisma.service.create({
      data: {
        serviceId: w.id,
        title: w.title,
        description: w.description ?? null,
        icon: w.icon ?? null,
        isWomenGroup: true,
        order: i,
      },
    });
  }
  console.log(`[seed] services: ${services.length} + women: ${women.length}`);
}

async function seedHero() {
  const hero = readJson('hero.json');
  if (!hero) return;
  if (typeof hero.slogan === 'string') {
    await prisma.setting.upsert({
      where: { key: 'hero.slogan' },
      create: { key: 'hero.slogan', value: hero.slogan },
      update: {},
    });
  }
  const cleanImage = (p) => {
    if (!p) return p;
    const norm = String(p).replace(/\\/g, '/');
    const idx = norm.toLowerCase().lastIndexOf('/public/');
    if (idx >= 0) return norm.slice(idx + '/public'.length);
    return norm.startsWith('/') ? norm : `/${norm}`;
  };
  if (Array.isArray(hero.slides)) {
    for (const [i, s] of hero.slides.entries()) {
      const image = cleanImage(s.image);
      // Use image path as natural key for idempotency
      const existing = await prisma.heroSlide.findFirst({ where: { image } });
      if (existing) continue;
      await prisma.heroSlide.create({
        data: { image, alt: s.alt ?? null, order: i },
      });
    }
  }
  if (Array.isArray(hero.buttons)) {
    for (const [i, b] of hero.buttons.entries()) {
      const existing = await prisma.heroButton.findFirst({
        where: { label: b.label, href: b.href },
      });
      if (existing) continue;
      await prisma.heroButton.create({
        data: {
          label: b.label,
          labelKey: b.labelKey ?? null,
          href: b.href,
          style: b.style ?? null,
          order: i,
        },
      });
    }
  }
  console.log('[seed] hero seeded');
}

async function seedAbout() {
  const about = readJson('about.json');
  if (!about) return;
  await prisma.setting.upsert({
    where: { key: 'about' },
    create: { key: 'about', value: about },
    update: {},
  });
  console.log('[seed] about seeded');
}

async function seedContact() {
  const contact = readJson('contact.json');
  if (!contact) return;
  await prisma.setting.upsert({
    where: { key: 'contact' },
    create: { key: 'contact', value: contact },
    update: {},
  });
  console.log('[seed] contact seeded');
}

async function seedCategories() {
  const cats = readJson('categories.json');
  if (!Array.isArray(cats)) return;
  for (const [i, c] of cats.entries()) {
    const existing = await prisma.category.findUnique({ where: { key: c.key } });
    if (existing) continue;
    await prisma.category.create({
      data: {
        key: c.key,
        label: c.label,
        description: c.description ?? null,
        order: i,
      },
    });
  }
  console.log(`[seed] categories: ${cats.length}`);
}

async function seedFormOptions() {
  const seedFile = (filename, prefix = '') => {
    const obj = readJson(filename);
    if (!obj) return [];
    const entries = [];
    for (const [group, list] of Object.entries(obj)) {
      if (!Array.isArray(list)) continue;
      for (const [i, item] of list.entries()) {
        entries.push({
          groupName: prefix + group,
          value: item.value,
          label: item.label,
          order: i,
        });
      }
    }
    return entries;
  };

  const all = [
    ...seedFile('form-options.json'),
    ...seedFile('survey-questions.json', 'survey.'),
  ];
  let count = 0;
  for (const opt of all) {
    const existing = await prisma.formOption.findUnique({
      where: { groupName_value: { groupName: opt.groupName, value: opt.value } },
    });
    if (existing) continue;
    await prisma.formOption.create({ data: opt });
    count++;
  }
  console.log(`[seed] form options: ${count} created`);
}

async function seedBudgetRoutes() {
  const list = readJson('budget-routes.json');
  if (!Array.isArray(list)) return;
  for (const [i, r] of list.entries()) {
    // Look up by legacyId (the original numeric id from the JSON file)
    if (r.id != null) {
      const existing = await prisma.budgetRoute.findUnique({
        where: { legacyId: r.id },
      });
      if (existing) continue;
    }
    await prisma.budgetRoute.create({
      data: {
        legacyId: r.id ?? null,
        persons: r.persons,
        budget: r.budget,
        destination: r.destination,
        days: r.days,
        departure: r.departure ?? null,
        image: r.image ?? null,
        description: r.description ?? null,
        highlights: Array.isArray(r.highlights) ? r.highlights : [],
        price: r.price,
        order: i,
      },
    });
  }
  console.log(`[seed] budget routes: ${list.length}`);
}

async function seedTourWizard() {
  const list = readJson('tour-wizard.json');
  if (!Array.isArray(list)) return;
  for (const [i, step] of list.entries()) {
    const existing = await prisma.tourWizardStep.findUnique({
      where: { step: step.step },
    });
    if (existing) continue;
    await prisma.tourWizardStep.create({
      data: {
        step: step.step,
        title: step.title,
        description: step.description ?? null,
        options: step.options ?? [],
        order: i,
      },
    });
  }
  console.log(`[seed] tour wizard: ${list.length}`);
}

async function main() {
  console.log('[seed] starting');
  await seedAdmin();
  await seedCategories();
  await seedTours();
  await seedBlog();
  await seedServices();
  await seedHero();
  await seedAbout();
  await seedContact();
  await seedFormOptions();
  await seedBudgetRoutes();
  await seedTourWizard();
  console.log('[seed] done');
}

main()
  .catch((e) => {
    console.error('[seed] failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
