import puppeteer from 'puppeteer-core';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const B = 'https://endulustravel.com';
const checks = [
  { url: '/tr/turlar', must: ['Geçmiş Turlar', 'Yaklaşan Turlar'] },
  { url: '/tr', must: ['Geçmiş Turlarımız'] },
  { url: '/tr/turlar/dubai-turu', must: ['Bu tur tamamlandı', 'Benzer Tur İçin Teklif Al', 'Program'], mustNot: ['WhatsApp ile Rezervasyon'] },
  { url: '/tr/turlar/fas-turu', must: ['WhatsApp ile Rezervasyon', 'Tur Programı Detayları', 'Hasan II'], mustNot: ['Bu tur tamamlandı'] },
  { url: '/tr/turlar/ozbekistan-turu', must: ['Bu tur tamamlandı', 'Registan'] },
  { url: '/tr/turlar/misir-turu-nisan-2026', must: ['Bu tur tamamlandı'] },
];
const autoScroll = (p) => p.evaluate(async () => {
  await new Promise((res) => {
    let y = 0; const step = 600;
    const id = setInterval(() => { window.scrollTo(0, y); y += step; if (y > document.body.scrollHeight) { clearInterval(id); res(); } }, 80);
  });
  window.scrollTo(0, 0);
});
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
let bad = 0;
for (const c of checks) {
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844, isMobile: true });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  const r = await p.goto(B + c.url, { waitUntil: 'networkidle0', timeout: 45000 });
  try { await p.waitForSelector('h1, h2', { timeout: 8000 }); } catch { /* ignore */ }
  await autoScroll(p);
  await new Promise((z) => setTimeout(z, 1200));
  const d = await p.evaluate(() => ({ text: document.body.textContent, of: document.documentElement.scrollWidth > window.innerWidth + 2 }));
  const miss = (c.must || []).filter((m) => !d.text.includes(m));
  const ban = (c.mustNot || []).filter((m) => d.text.includes(m));
  const ok = r.status() === 200 && !miss.length && !ban.length && !d.of && !errs.length;
  if (!ok) bad++;
  console.log(`${ok ? 'OK ' : 'XX '} ${c.url.padEnd(34)} ${r.status()} ${miss.length ? 'MISS:' + miss.join('|') : ''} ${ban.length ? 'BAN:' + ban.join('|') : ''} ${d.of ? 'OVF' : ''} ${errs.length ? 'ERR:' + errs[0].slice(0, 60) : ''}`);
  await p.close();
}
await b.close();
console.log(bad === 0 ? '\nALL OK' : `\n${bad} ISSUE(S)`);
