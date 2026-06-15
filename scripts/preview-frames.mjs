import puppeteer from 'puppeteer-core';
import path from 'path';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const HTML = 'file:///' + path.resolve('scripts/brand-anim.html').replace(/\\/g, '/');
const OUT = path.resolve('scripts/_shots');
import fs from 'fs';
fs.mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--force-device-scale-factor=1'] });
const p = await b.newPage();
await p.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
await p.goto(HTML, { waitUntil: 'networkidle0', timeout: 30000 });
await p.waitForFunction('window.__ready === true', { timeout: 15000 });
for (const t of [1.0, 2.2, 4.5]) {
  await p.evaluate((tt) => window.renderFrame(tt), t);
  await new Promise((r) => setTimeout(r, 120));
  // composite over a neutral gray so we can SEE the transparent result while checking layout
  await p.screenshot({ path: `${OUT}/preview_t${t}.png`, omitBackground: true });
}
console.log('previews saved');
await b.close();
