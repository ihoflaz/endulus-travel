import puppeteer from 'puppeteer-core';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = 'C:/Users/hulus/OneDrive/Masaüstü/endulus-travel/endulus-travel/scripts/_shots';
import fs from 'fs';
fs.mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--force-device-scale-factor=2'] });
const p = await b.newPage();
await p.setViewport({ width: 1366, height: 900, deviceScaleFactor: 2 });
await p.goto('https://endulustravel.com/tr', { waitUntil: 'networkidle2', timeout: 45000 });
await new Promise((r) => setTimeout(r, 3000));
const box = await p.evaluate(() => { const r = document.querySelector('[aria-label="Endülüs Travel"]').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
// observe ~11s WITHOUT hovering; record path counts
let maxPaths = 0; let shot = false; const counts = [];
for (let i = 0; i < 24; i++) {
  const n = await p.evaluate(() => document.querySelector('[aria-label="Endülüs Travel"] svg').querySelectorAll('path').length);
  counts.push(n);
  if (n > maxPaths) maxPaths = n;
  if (n >= 8 && !shot) { await p.screenshot({ path: `${OUT}/05-loop.png`, clip: { x: Math.max(0, box.x - 8), y: Math.max(0, box.y - 8), width: box.w + 60, height: box.h + 16 } }); shot = true; }
  await new Promise((r) => setTimeout(r, 500));
}
console.log('maxPaths(no-hover)=' + maxPaths, 'loopFired=' + (maxPaths >= 8));
console.log('counts=' + counts.join(','));
await b.close();
