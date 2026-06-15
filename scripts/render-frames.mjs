import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const HTML = 'file:///' + path.resolve('scripts/brand-anim.html').replace(/\\/g, '/');
const DIR = path.resolve('scripts/_frames');
fs.rmSync(DIR, { recursive: true, force: true });
fs.mkdirSync(DIR, { recursive: true });

const FPS = 30;
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--force-device-scale-factor=1'] });
const p = await b.newPage();
await p.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
await p.goto(HTML, { waitUntil: 'networkidle0', timeout: 30000 });
await p.waitForFunction('window.__ready === true', { timeout: 15000 });
const DURATION = await p.evaluate(() => window.DURATION);
const N = Math.round(DURATION * FPS);
for (let i = 0; i < N; i++) {
  const t = i / FPS;
  await p.evaluate((tt) => window.renderFrame(tt), t);
  const name = String(i + 1).padStart(4, '0');
  await p.screenshot({ path: `${DIR}/f_${name}.png`, omitBackground: true });
}
await b.close();
console.log(`rendered ${N} frames @ ${FPS}fps (${DURATION}s) -> ${DIR}`);
