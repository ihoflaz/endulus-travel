import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const HTML = 'file:///' + path.resolve('scripts/brand-anim.html').replace(/\\/g, '/');
const ROOT = path.resolve('scripts/_variants');
fs.rmSync(ROOT, { recursive: true, force: true });
fs.mkdirSync(ROOT, { recursive: true });

const FPS = 30;
const VARS = [
  { name: 'logo-9x16', w: 1080, h: 1920, q: 'mark=full&mode=in' },
  { name: 'emblem-9x16', w: 1080, h: 1920, q: 'mark=emblem&mode=in' },
  { name: 'logo-1x1', w: 1080, h: 1080, q: 'mark=full&mode=in' },
  { name: 'logo-16x9', w: 1920, h: 1080, q: 'mark=full&mode=in' },
  { name: 'logo-9x16-outro', w: 1080, h: 1920, q: 'mark=full&mode=out' },
  { name: 'logo-9x16-loop', w: 1080, h: 1920, q: 'mark=full&mode=shimmer' },
];

const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--force-device-scale-factor=1'] });
for (const v of VARS) {
  const dir = path.join(ROOT, v.name);
  fs.mkdirSync(dir, { recursive: true });
  const p = await b.newPage();
  await p.setViewport({ width: v.w, height: v.h, deviceScaleFactor: 1 });
  await p.goto(`${HTML}?w=${v.w}&h=${v.h}&${v.q}`, { waitUntil: 'networkidle0', timeout: 30000 });
  await p.waitForFunction('window.__ready === true', { timeout: 15000 });
  const DUR = await p.evaluate(() => window.DURATION);
  const N = Math.round(DUR * FPS);
  for (let i = 0; i < N; i++) {
    await p.evaluate((t) => window.renderFrame(t), i / FPS);
    await p.screenshot({ path: `${dir}/f_${String(i + 1).padStart(4, '0')}.png`, omitBackground: true });
  }
  await p.close();
  console.log(`${v.name}: ${N} frames (${DUR}s) @ ${v.w}x${v.h}`);
}
await b.close();
console.log('all variants rendered');
