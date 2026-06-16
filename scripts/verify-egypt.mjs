import puppeteer from 'puppeteer-core';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: 390, height: 844, isMobile: true });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
const r = await p.goto('https://endulustravel.com/tr/turlar/misir-turu-ozel', { waitUntil: 'networkidle2', timeout: 45000 });
await new Promise((z) => setTimeout(z, 1800));
const d = await p.evaluate(() => ({
  len: document.body.innerText.length,
  iptal: document.body.innerText.includes('İptal ve iade'),
  vf: document.body.innerText.includes('VF247'),
  fishawy: document.body.innerText.includes('Fishawy'),
  overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
}));
console.log('status', r.status(), JSON.stringify(d), 'errors', errs.length);
await b.close();
