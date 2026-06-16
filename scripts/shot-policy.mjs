import puppeteer from 'puppeteer-core';
import fs from 'fs';
fs.mkdirSync('scripts/_shots', { recursive: true });
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox', '--force-device-scale-factor=2'] });
const p = await b.newPage();
await p.setViewport({ width: 860, height: 1180, deviceScaleFactor: 2 });
await p.goto('https://endulustravel.com/tr/turlar/fas-turu', { waitUntil: 'networkidle2', timeout: 45000 });
await new Promise((z) => setTimeout(z, 1200));
// scroll the policy box into view (it sits in #genel after the description)
await p.evaluate(() => {
  const el = document.getElementById('genel');
  if (el) {
    const r = el.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + r.top - 30);
  }
});
await new Promise((z) => setTimeout(z, 1800)); // let Reveal finish
await p.screenshot({ path: 'scripts/_shots/policy.png' });
console.log('shot saved');
await b.close();
