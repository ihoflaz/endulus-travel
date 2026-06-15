import puppeteer from 'puppeteer-core';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const B = 'https://endulustravel.com';
const CHECKS = [
  { url: '/tr/hakkimizda', must: ['Kız Kardeş'], mustNot: [] },
  { url: '/tr/turlar', must: ['15-20'], mustNot: [] },
  { url: '/tr/hizmetler', must: ['Bütçe Dostu'], mustNot: ['Ekstrem', 'Macera'] },
];
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
let bad = 0;
for (const c of CHECKS) {
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844, isMobile: true });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(B + c.url, { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise((r) => setTimeout(r, 1500));
  const text = await p.evaluate(() => document.body.innerText);
  const of = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  const missing = c.must.filter((m) => !text.includes(m));
  const present = c.mustNot.filter((m) => text.includes(m));
  const ok = !missing.length && !present.length && !of && !errs.length;
  if (!ok) bad++;
  console.log(`${ok ? 'OK ' : 'XX '} ${c.url.padEnd(18)} ${missing.length ? 'MISS:' + missing.join('|') : ''} ${present.length ? 'SHOULD-NOT:' + present.join('|') : ''} ${of ? 'OVERFLOW' : ''} ${errs.length ? 'ERR' : ''}`);
  await p.close();
}
await b.close();
console.log(bad === 0 ? '\nALL OK' : `\n${bad} ISSUE(S)`);
