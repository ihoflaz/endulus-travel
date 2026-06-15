import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd(), 'src/translations');
const files = [path.join(ROOT, 'tr/common.json'), path.join(ROOT, 'en/common.json')];

// Dead keys: services now come from the DB (/data/services.json + service-content.json
// via legacyData). These i18n keys are referenced by NO t() call in src.
const DEL = [
  'services.privateToursTitle', 'services.privateToursDescription',
  'services.groupToursTitle', 'services.groupToursDescription',
  'services.familyToursTitle', 'services.familyToursDescription',
  'services.studentToursTitle', 'services.studentToursDescription',
  'services.romanticToursTitle', 'services.romanticToursDescription',
  'services.adventureToursTitle', 'services.adventureToursDescription',
  'serviceContent', // entire legacy duplicate block
];

function del(obj, dotted) {
  const parts = dotted.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cur[parts[i]] !== 'object' || cur[parts[i]] === null) return false;
    cur = cur[parts[i]];
  }
  const last = parts[parts.length - 1];
  if (last in cur) { delete cur[last]; return true; }
  return false;
}

for (const f of files) {
  const obj = JSON.parse(fs.readFileSync(f, 'utf8'));
  let n = 0;
  for (const k of DEL) if (del(obj, k)) n++;
  fs.writeFileSync(f, JSON.stringify(obj, null, 2) + '\n', 'utf8');
  console.log(`${path.basename(path.dirname(f))}: removed ${n} dead key(s)`);
}
console.log('done');
