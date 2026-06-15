import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'https://endulustravel.com';

const PAGES = [
  ['/tr/teklif-al', 'Offer TR'],
  ['/en/get-offer', 'Offer EN'],
  ['/tr/iletisim', 'Contact TR'],
  ['/tr/hakkimizda', 'About TR'],
  ['/tr/hizmetler', 'Services TR'],
  ['/tr/blog', 'Blog TR'],
  ['/tr/tur-planlama', 'Planning TR'],
  ['/tr/gizlilik', 'Privacy TR'],
  ['/en/about', 'About EN'],
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const results = [];
for (const [path, name] of PAGES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true }); // mobile
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERR: ' + e.message));
  let status = 0;
  try {
    const resp = await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 45000 });
    status = resp ? resp.status() : 0;
    await new Promise((r) => setTimeout(r, 1500));
  } catch (e) {
    errors.push('NAV: ' + e.message);
  }
  const data = await page.evaluate(() => {
    const overflow = document.documentElement.scrollWidth > window.innerWidth + 2;
    const text = (document.body.innerText || '').trim();
    const hasVideo = !!document.querySelector('video');
    const hasHero = !!document.querySelector('.ds-display, [class*="ds-"]');
    // mojibake / leftover i18n key markers
    const moji = /Ã.|Â.|�/.test(text);
    const rawKey = /\b(offer|contactPage|servicesPage|legal|planning|blog|about)\.[a-zA-Z]/.test(text);
    return { overflow, len: text.length, hasVideo, hasHero, moji, rawKey, sample: text.slice(0, 80) };
  });
  results.push({ name, path, status, errors: errors.slice(0, 3), ...data });
  await page.close();
}
await browser.close();

let bad = 0;
for (const r of results) {
  const flags = [];
  if (r.status !== 200) flags.push('STATUS=' + r.status);
  if (r.overflow) flags.push('OVERFLOW');
  if (r.len < 200) flags.push('THIN(' + r.len + ')');
  if (r.moji) flags.push('MOJIBAKE');
  if (r.rawKey) flags.push('RAWKEY');
  if (r.errors.length) flags.push('ERR:' + r.errors.length);
  const ok = flags.length === 0;
  if (!ok) bad++;
  console.log(`${ok ? 'OK ' : 'XX '} ${r.name.padEnd(12)} v=${r.hasVideo ? 'Y' : '-'} h=${r.hasHero ? 'Y' : '-'} len=${String(r.len).padStart(5)} ${flags.join(' ')}`);
  if (r.errors.length) r.errors.forEach((e) => console.log('      ! ' + e.slice(0, 120)));
}
console.log(bad === 0 ? '\nALL GOOD' : `\n${bad} PAGE(S) WITH ISSUES`);
