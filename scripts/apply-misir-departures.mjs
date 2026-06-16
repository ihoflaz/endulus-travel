import fs from 'fs';
import path from 'path';

// Mısır (Kahire & Şarm el Şeyh) departure calendar — one tour, many dates.
const DEPARTURES = [
  { label: '26 Haziran - 3 Temmuz 2026', startDate: '2026-06-26', endDate: '2026-07-03' },
  { label: '24 - 31 Temmuz 2026', startDate: '2026-07-24', endDate: '2026-07-31' },
  { label: '21 - 28 Ağustos 2026', startDate: '2026-08-21', endDate: '2026-08-28' },
  { label: '18 - 25 Eylül 2026', startDate: '2026-09-18', endDate: '2026-09-25' },
  { label: '9 - 16 Ekim 2026', startDate: '2026-10-09', endDate: '2026-10-16' },
];
const SLUG = 'misir-turu-ozel';

const p = path.resolve('public/data/tours.json');
const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
const t = (raw.featured || []).find((x) => x.slug === SLUG);
if (!t) throw new Error(`${SLUG} not found in tours.json`);
t.departures = DEPARTURES;
fs.writeFileSync(p, JSON.stringify(raw, null, 2) + '\n', 'utf8');
console.log(`seed: ${SLUG} departures set (${DEPARTURES.length})`);

const json = JSON.stringify(DEPARTURES);
fs.writeFileSync(
  path.resolve('scripts/_misirdep.sql'),
  `UPDATE "Tour" SET departures = $j$${json}$j$::jsonb, "updatedAt" = now() WHERE slug = '${SLUG}';\n`,
  'utf8'
);
console.log('wrote scripts/_misirdep.sql');
