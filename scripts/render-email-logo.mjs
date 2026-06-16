import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const HTML = 'file:///' + path.resolve('scripts/email-logo.html').replace(/\\/g, '/');
const DIR = path.resolve('scripts/_egif');
fs.rmSync(DIR, { recursive: true, force: true });
fs.mkdirSync(DIR, { recursive: true });
const FPS = 12.5;
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: 600, height: 300, deviceScaleFactor: 1 });
await p.goto(HTML, { waitUntil: 'networkidle0', timeout: 30000 });
await p.waitForFunction('window.__ready === true', { timeout: 15000 });
const DUR = await p.evaluate(() => window.DURATION);
const N = Math.round(DUR * FPS);
for (let i = 0; i < N; i++) {
  await p.evaluate((t) => window.renderFrame(t), i / FPS);
  await p.screenshot({ path: `${DIR}/f_${String(i + 1).padStart(3, '0')}.png`, clip: { x: 0, y: 0, width: 600, height: 300 } });
}
await b.close();
console.log(`rendered ${N} frames`);
