import puppeteer from 'puppeteer-core';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = 'C:/Users/hulus/OneDrive/Masaüstü/endulus-travel/endulus-travel/scripts/_shots';
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--force-device-scale-factor=2'] });
const p = await b.newPage();
await p.setViewport({ width: 1366, height: 900, deviceScaleFactor: 2 });
await p.goto('https://endulustravel.com/tr', { waitUntil: 'networkidle2', timeout: 45000 });
await new Promise((r) => setTimeout(r, 3500));
const box = await p.evaluate(() => { const r = document.querySelector('[aria-label="Endülüs Travel"]').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
// real hover
await p.mouse.move(box.x + box.w / 2, box.y + box.h / 2);
await new Promise((r) => setTimeout(r, 280));
const midPaths = await p.evaluate(() => document.querySelector('[aria-label="Endülüs Travel"] svg').querySelectorAll('path').length);
await p.screenshot({ path: `${OUT}/04-hover-real.png`, clip: { x: Math.max(0, box.x - 8), y: Math.max(0, box.y - 8), width: box.w + 60, height: box.h + 16 } });
await new Promise((r) => setTimeout(r, 1800));
const afterPaths = await p.evaluate(() => document.querySelector('[aria-label="Endülüs Travel"] svg').querySelectorAll('path').length);
console.log('midPaths=' + midPaths, 'afterPaths=' + afterPaths);
await b.close();
