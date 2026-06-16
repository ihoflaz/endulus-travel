import fs from 'fs';
import path from 'path';
const DEST = 'Mısır (Kahire & Şarm el Şeyh)';
const p = path.resolve('public/data/tours.json');
const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
const t = (raw.featured || []).find((x) => x.slug === 'misir-turu-ozel');
if (t) { t.destination = DEST; fs.writeFileSync(p, JSON.stringify(raw, null, 2) + '\n', 'utf8'); console.log('seed destination set'); }
fs.writeFileSync(path.resolve('scripts/_misirdest.sql'), `UPDATE "Tour" SET destination=$d$${DEST}$d$, "updatedAt"=now() WHERE slug='misir-turu-ozel';\n`, 'utf8');
