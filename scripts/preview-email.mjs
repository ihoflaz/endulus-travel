import { buildAckHtml, buildOpsHtml } from '../server/src/utils/mailer.js';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const dir = path.resolve('scripts/_email');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'ack.html'), buildAckHtml({ kind: 'OFFER', name: 'Ayşe Yılmaz' }), 'utf8');
fs.writeFileSync(path.join(dir, 'ops.html'), buildOpsHtml({
  kind: 'OFFER', name: 'Ayşe Yılmaz', email: 'ayse@example.com', phone: '0555 123 45 67',
  subject: 'Teklif: Fas Turu', message: 'Temmuz için 2 kişilik bilgi almak istiyorum.\nTeşekkürler.',
  meta: { destination: 'Fas', numberOfPeople: '2', budget: '1500 EUR', preferences: ['Kültür', 'Gastronomi'] },
}), 'utf8');

const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox', '--force-device-scale-factor=2'] });
for (const name of ['ack', 'ops']) {
  const p = await b.newPage();
  await p.setViewport({ width: 660, height: 1000, deviceScaleFactor: 2 });
  await p.goto('file:///' + path.join(dir, `${name}.html`).replace(/\\/g, '/'), { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1200));
  await p.screenshot({ path: path.join(dir, `${name}.png`), fullPage: true });
  await p.close();
}
await b.close();
console.log('email previews rendered');
