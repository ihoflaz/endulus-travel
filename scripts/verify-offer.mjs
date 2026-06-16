import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: 1100, height: 1000 });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
await p.goto('https://endulustravel.com/tr/teklif-al', { waitUntil: 'networkidle2', timeout: 45000 });
// wait for destination cards (tours loaded)
await p.waitForFunction(() => [...document.querySelectorAll('button')].some((x) => /Mısır|Fas/i.test(x.textContent)), { timeout: 15000 }).catch(() => {});
await new Promise((z) => setTimeout(z, 800));
const step1 = await p.evaluate(() => {
  const tx = document.body.textContent;
  const cards = [...document.querySelectorAll('button')].filter((x) => x.querySelector('img'));
  return { destCards: cards.length, hasMisir: /Mısır/.test(tx), hasFas: /Fas/.test(tx) };
});
// pick Mısır
await p.evaluate(() => { const btn = [...document.querySelectorAll('button')].find((x) => x.querySelector('img') && /Mısır/.test(x.textContent)); if (btn) btn.click(); });
await new Promise((z) => setTimeout(z, 300));
await p.type('input[type=number]', '2');
await p.evaluate(() => { const b2 = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Devam'); if (b2) b2.click(); });
await new Promise((z) => setTimeout(z, 900));
const step2 = await p.evaluate(() => {
  const tx = document.body.textContent;
  return { hasDate: /Haziran|Temmuz/.test(tx), hasBudget: /Bütçe/.test(tx), hasDateLead: /planlanan tarihler/.test(tx) };
});
console.log('STEP1', JSON.stringify(step1));
console.log('STEP2', JSON.stringify(step2));
console.log('errors', errs.length, errs[0] || '');
await b.close();
