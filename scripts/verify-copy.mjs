import puppeteer from 'puppeteer-core';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const B = 'https://endulustravel.com';
const CHECKS = [
  { url: '/tr/hakkimizda', must: ['iki kız kardeş', '15-20', 'bireysel erkek', 'gizli', 'yaş sınırı'] },
  { url: '/en/about', must: ['two sisters', '15-20', 'individual male', 'hidden', 'age limit'] },
  { url: '/tr', must: ['mühendis', '15-20'] },
  { url: '/tr/turlar', must: ['15-20'] },
];
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
let bad = 0;
for (const c of CHECKS) {
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844, isMobile: true });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(B + c.url, { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise((r) => setTimeout(r, 1200));
  const d = await p.evaluate(() => ({ text: document.body.innerText, of: document.documentElement.scrollWidth > window.innerWidth + 2, raw: /\b(aboutPage|home|toursPage)\.[a-zA-Z]/.test(document.body.innerText) }));
  const missing = c.must.filter((m) => !d.text.includes(m));
  const ok = missing.length === 0 && !d.of && !d.raw && errs.length === 0;
  if (!ok) bad++;
  console.log(`${ok ? 'OK ' : 'XX '} ${c.url.padEnd(20)} ${missing.length ? 'MISSING:' + missing.join('|') : ''} ${d.of ? 'OVERFLOW' : ''} ${d.raw ? 'RAWKEY' : ''} ${errs.length ? 'ERR' : ''}`);
  await p.close();
}
await b.close();
console.log(bad === 0 ? '\nALL COPY LIVE' : `\n${bad} ISSUE(S)`);
