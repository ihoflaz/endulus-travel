import puppeteer from 'puppeteer-core';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
for (const [u, vp] of [['/tr', 'desktop'], ['/en', 'mobile'], ['/tr/turlar/misir-turu-ozel', 'mobile']]) {
  const p = await b.newPage();
  await p.setViewport(vp === 'mobile' ? { width: 390, height: 844, isMobile: true } : { width: 1366, height: 900 });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('https://endulustravel.com' + u, { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise((x) => setTimeout(x, 1500));
  const d = await p.evaluate(() => {
    const all = [...document.querySelectorAll('a[href*="wa.me"]')];
    const fab = all.find((x) => getComputedStyle(x).position === 'fixed');
    let info = null;
    if (fab) {
      const r = fab.getBoundingClientRect();
      info = {
        hasHalo: !!fab.querySelector('.wa-halo'),
        hasSvg: !!fab.querySelector('svg'),
        bottomLeft: r.left < 70 && r.bottom > window.innerHeight - 100,
        href: fab.getAttribute('href').slice(0, 35),
      };
    }
    return { waCount: all.length, fab: !!fab, info, overflow: document.documentElement.scrollWidth > window.innerWidth + 2 };
  });
  console.log(u.padEnd(34), vp.padEnd(8), 'wa=' + d.waCount, 'fab=' + d.fab, 'overflow=' + d.overflow, 'err=' + errs.length, JSON.stringify(d.info));
  await p.close();
}
await b.close();
