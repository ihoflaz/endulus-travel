import puppeteer from 'puppeteer-core';
import fs from 'fs';
fs.mkdirSync('scripts/_shots', { recursive: true });
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox', '--force-device-scale-factor=2'] });
const p = await b.newPage();
await p.setViewport({ width: 820, height: 1200, deviceScaleFactor: 2 });
await p.goto('https://endulustravel.com/tr/teklif-al', { waitUntil: 'networkidle2', timeout: 45000 });
await p.waitForFunction(() => [...document.querySelectorAll('button')].some((x) => x.querySelector('img')), { timeout: 15000 }).catch(() => {});
await new Promise((z) => setTimeout(z, 1000));
// scroll to the form card
await p.evaluate(() => { const h = [...document.querySelectorAll('h3')].find((x) => /Nereye/.test(x.textContent)); if (h) h.scrollIntoView({ block: 'center' }); });
await new Promise((z) => setTimeout(z, 800));
await p.screenshot({ path: 'scripts/_shots/offer-step1.png' });
// then advance to step 2 for a second shot
await p.evaluate(() => { const btn = [...document.querySelectorAll('button')].find((x) => x.querySelector('img') && /Mısır/.test(x.textContent)); if (btn) btn.click(); });
await new Promise((z) => setTimeout(z, 300));
await p.type('input[type=number]', '2');
await p.evaluate(() => { const b2 = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Devam'); if (b2) b2.click(); });
await new Promise((z) => setTimeout(z, 1000));
await p.screenshot({ path: 'scripts/_shots/offer-step2.png' });
await b.close();
console.log('shots saved');
