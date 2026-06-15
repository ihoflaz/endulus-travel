import puppeteer from 'puppeteer-core';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = 'C:/Users/hulus/OneDrive/Masaüstü/endulus-travel/endulus-travel/scripts/_shots';
import fs from 'fs';
fs.mkdirSync(OUT, { recursive: true });

const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--force-device-scale-factor=2'] });
const p = await b.newPage();
await p.setViewport({ width: 1366, height: 900, deviceScaleFactor: 2 });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => { if (m.type() === 'error') errs.push('C:' + m.text()); });

// 1) catch the intro splash mid-draw
await p.goto('https://endulustravel.com/tr', { waitUntil: 'domcontentloaded', timeout: 45000 });
await new Promise((r) => setTimeout(r, 750));
await p.screenshot({ path: `${OUT}/01-intro.png` });

// 2) settle, inspect + shoot navbar logo at rest
await new Promise((r) => setTimeout(r, 3500));
const restInfo = await p.evaluate(() => {
  const logo = document.querySelector('[aria-label="Endülüs Travel"]');
  if (!logo) return { found: false };
  const svg = logo.querySelector('svg');
  const r = logo.getBoundingClientRect();
  return { found: true, paths: svg ? svg.querySelectorAll('path').length : 0, box: { x: r.x, y: r.y, w: r.width, h: r.height } };
});
if (restInfo.found) {
  const bx = restInfo.box;
  await p.screenshot({ path: `${OUT}/02-rest.png`, clip: { x: Math.max(0, bx.x - 8), y: Math.max(0, bx.y - 8), width: bx.w + 60, height: bx.h + 16 } });
}

// 3) hover -> replay assemble, catch mid-animation
let hoverPaths = 0;
await p.evaluate(() => {
  const logo = document.querySelector('[aria-label="Endülüs Travel"]');
  logo.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
});
await new Promise((r) => setTimeout(r, 320));
hoverPaths = await p.evaluate(() => {
  const svg = document.querySelector('[aria-label="Endülüs Travel"] svg');
  return svg ? svg.querySelectorAll('path').length : 0;
});
const bx = restInfo.box;
await p.screenshot({ path: `${OUT}/03-hover.png`, clip: { x: Math.max(0, bx.x - 8), y: Math.max(0, bx.y - 8), width: bx.w + 60, height: bx.h + 16 } });

console.log('restPaths=' + restInfo.paths, 'hoverPaths=' + hoverPaths, 'errors=' + errs.length);
errs.slice(0, 4).forEach((e) => console.log('  ! ' + e.slice(0, 120)));
await b.close();
