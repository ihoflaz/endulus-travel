import fs from 'fs';
import path from 'path';
const ROOT = path.resolve(process.cwd(), 'src/translations');
const files = [['tr', path.join(ROOT, 'tr/common.json')], ['en', path.join(ROOT, 'en/common.json')]];

// OVERWRITE (value changed): budget removed from the date step question.
const OVER = [
  ['offer.qWhen', 'Hangi tarihte gitmek istersiniz?', 'Which date would you like to travel?'],
];
// ONLY-ADD (new keys)
const ADD = [
  ['offer.oneDeparture', '1 tarih seçeneği', '1 date option'],
  ['offer.notListed', 'Aradığınız rota listede yok mu?', "Can't find the route you're looking for?"],
  ['offer.contactUs', 'Bize yazın', 'Contact us'],
  ['offer.dateLead', '{{dest}} için planlanan tarihler:', 'Planned dates for {{dest}}:'],
  ['offer.errors.dateRequired', 'Lütfen bir tarih seçin', 'Please select a date'],
];

const setDeep = (obj, dotted, value, onlyAdd) => {
  const parts = dotted.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cur[parts[i]] !== 'object' || cur[parts[i]] === null) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  const last = parts[parts.length - 1];
  if (onlyAdd && last in cur) return false;
  cur[last] = value; return true;
};

for (const [lang, p] of files) {
  const obj = JSON.parse(fs.readFileSync(p, 'utf8'));
  let o = 0; let a = 0;
  for (const [k, tr, en] of OVER) if (setDeep(obj, k, lang === 'tr' ? tr : en, false)) o++;
  for (const [k, tr, en] of ADD) if (setDeep(obj, k, lang === 'tr' ? tr : en, true)) a++;
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n', 'utf8');
  console.log(`${lang}: overwrote ${o}, added ${a}`);
}
console.log('done');
