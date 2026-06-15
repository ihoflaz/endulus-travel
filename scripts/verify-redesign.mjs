import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'https://endulustravel.com';

// [tr path, en path, name]
const PAGES = [
  ['/tr', '/en', 'Home'],
  ['/tr/turlar', '/en/tours', 'Tours'],
  ['/tr/turlar/misir-turu-ozel', '/en/tours/misir-turu-ozel', 'TourDetail'],
  ['/tr/yurt-ici-turlar', '/en/domestic-tours', 'Domestic'],
  ['/tr/yurt-disi-turlar', '/en/international-tours', 'International'],
  ['/tr/tur-planlama', '/en/tour-planning', 'Planning'],
  ['/tr/teklif-al', '/en/request-offer', 'Offer'],
  ['/tr/on-anket', '/en/survey', 'Survey'],
  ['/tr/butceye-gore-rota', '/en/budget-routes', 'Budget'],
  ['/tr/hakkimizda', '/en/about', 'About'],
  ['/tr/iletisim', '/en/contact', 'Contact'],
  ['/tr/blog', '/en/blog', 'Blog'],
  ['/tr/hizmetler', '/en/services', 'Services'],
  ['/tr/gizlilik', '/en/privacy', 'Privacy'],
  ['/tr/kullanim-kosullari', '/en/terms', 'Terms'],
  ['/tr/kvkk', '/en/kvkk', 'KVKK'],
];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });

async function check(url, mobile) {
  const page = await browser.newPage();
  await page.setViewport(mobile ? { width: 390, height: 844, isMobile: true } : { width: 1366, height: 900 });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERR: ' + e.message));
  let status = 0;
  try {
    const resp = await page.goto(BASE + url, { waitUntil: 'networkidle2', timeout: 45000 });
    status = resp ? resp.status() : 0;
    await new Promise((r) => setTimeout(r, 1200));
  } catch (e) { errors.push('NAV: ' + e.message); }
  const d = await page.evaluate(() => {
    const text = (document.body.innerText || '').trim();
    return {
      overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
      len: text.length,
      hasVideoOrImg: !!document.querySelector('video, img'),
      moji: /Ã.|Â.|�/.test(text),
      rawKey: /\b(offer|contactPage|servicesPage|serviceDetail|legal|planning|blog|about|survey|budgetRoutes|toursPage|tourDetail|domesticTours|internationalTours)\.[a-zA-Z]/.test(text),
    };
  });
  await page.close();
  return { status, errors: errors.slice(0, 2), ...d };
}

let bad = 0;
for (const [tr, en, name] of PAGES) {
  for (const [path, lng] of [[tr, 'TR'], [en, 'EN']]) {
    const m = await check(path, true);
    const flags = [];
    if (m.status !== 200) flags.push('STATUS=' + m.status);
    if (m.overflow) flags.push('OVERFLOW');
    if (m.len < 200) flags.push('THIN(' + m.len + ')');
    if (m.moji) flags.push('MOJIBAKE');
    if (m.rawKey) flags.push('RAWKEY');
    if (m.errors.length) flags.push('ERR');
    const ok = flags.length === 0;
    if (!ok) bad++;
    console.log(`${ok ? 'OK ' : 'XX '} ${(name + ' ' + lng).padEnd(16)} len=${String(m.len).padStart(5)} ${flags.join(' ')}`);
    m.errors.forEach((e) => console.log('      ! ' + e.slice(0, 130)));
  }
}
await browser.close();
console.log(bad === 0 ? '\n✅ ALL PAGES GOOD (TR+EN, mobile)' : `\n❌ ${bad} CHECK(S) WITH ISSUES`);
