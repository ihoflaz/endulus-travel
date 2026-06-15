import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = path.resolve('scripts/_shots');
fs.mkdirSync(OUT, { recursive: true });
const HTML = 'file:///' + path.resolve('scripts/brand-anim.html').replace(/\\/g, '/');
const VARS = [
  { name: '1x1', w: 1080, h: 1080, q: 'w=1080&h=1080&mark=full&mode=in', t: 4.0 },
  { name: '16x9', w: 1920, h: 1080, q: 'w=1920&h=1080&mark=full&mode=in', t: 4.0 },
  { name: 'emblem-9x16', w: 1080, h: 1920, q: 'w=1080&h=1920&mark=emblem&mode=in', t: 3.0 },
  { name: 'outro-mid', w: 1080, h: 1920, q: 'w=1080&h=1920&mark=full&mode=out', t: 1.2 },
];
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--force-device-scale-factor=1'] });
for (const v of VARS) {
  const p = await b.newPage();
  await p.setViewport({ width: v.w, height: v.h, deviceScaleFactor: 1 });
  await p.goto(HTML + '?' + v.q, { waitUntil: 'networkidle0', timeout: 30000 });
  await p.waitForFunction('window.__ready === true', { timeout: 15000 });
  await p.evaluate((t) => window.renderFrame(t), v.t);
  await new Promise((r) => setTimeout(r, 120));
  await p.screenshot({ path: `${OUT}/v_${v.name}.png`, omitBackground: true });
  await p.close();
}
await b.close();
console.log('variant previews saved');
