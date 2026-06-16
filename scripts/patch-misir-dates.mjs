import fs from 'fs';
import path from 'path';
const p = path.resolve('public/data/tours.json');
const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
const t = (raw.featured || []).find((x) => x.slug === 'misir-turu-ozel');
if (t) { t.startDate = '2026-06-26'; t.endDate = '2026-07-03'; fs.writeFileSync(p, JSON.stringify(raw, null, 2) + '\n', 'utf8'); console.log('seed: misir-turu-ozel dates set'); }
else console.log('misir-turu-ozel not in seed');
fs.writeFileSync(path.resolve('scripts/_misir.sql'), `UPDATE "Tour" SET "startDate"='2026-06-26', "endDate"='2026-07-03', "updatedAt"=now() WHERE slug='misir-turu-ozel';\n`, 'utf8');
