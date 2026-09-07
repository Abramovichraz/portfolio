import { chromium } from 'playwright-core';

const WIDTH = Number(process.argv[2] || 1440);
const HEIGHT = Number(process.argv[3] || 900);

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
});
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
await page.goto('http://localhost:4500/', { waitUntil: 'load' });
await page.waitForTimeout(600);

// run the real suite the way the Run button does
await page.click('[data-suite-run]');
await page.waitForTimeout(400);

const out = await page.evaluate(() => {
  const rows = [...document.querySelectorAll('.check')].map(li => ({
    state: li.getAttribute('data-state'),
    name: li.querySelector('.check__name').textContent,
    value: li.querySelector('.check__val').textContent
  }));
  // which specific elements are under 44px?
  const small = [...document.querySelectorAll('button, .art__link, .direct a, .tree a')]
    .filter(el => el.getClientRects().length)
    .map(el => {
      const r = el.getBoundingClientRect();
      return { sel: el.className || el.tagName, w: Math.round(r.width), h: Math.round(r.height) };
    })
    .filter(x => Math.min(x.w, x.h) < 44);
  const doc = document.documentElement;
  return { rows, small, overflow: doc.scrollWidth - doc.clientWidth,
           railOverflow: (() => { const r = document.querySelector('.rail');
             return r ? r.scrollWidth - window.innerWidth : null; })() };
});

console.log(`viewport ${WIDTH}x${HEIGHT}`);
for (const r of out.rows) console.log(`  ${r.state === 'pass' ? '✓' : '✕'} ${r.name.padEnd(42)} ${r.value}`);
console.log('under-44 targets:', JSON.stringify(out.small, null, 1));
console.log('doc overflow:', out.overflow, '| rail overflow vs viewport:', out.railOverflow);

await browser.close();
