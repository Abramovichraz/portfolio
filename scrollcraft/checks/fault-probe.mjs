import { chromium } from 'playwright-core';

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4500/', { waitUntil: 'load' });
await page.waitForTimeout(500);

const state = () => page.evaluate(() => ({
  chip: document.querySelector('[data-suite-state]').textContent,
  passed: document.querySelector('[data-suite-passed]').textContent,
  failed: document.querySelector('[data-suite-failed]').textContent,
  reds: [...document.querySelectorAll('.check[data-state="fail"]')].map(li => ({
    name: li.querySelector('.check__name').textContent,
    value: li.querySelector('.check__val').textContent
  })),
  verdict: document.querySelector('[data-verdict-detail]').textContent
}));

await page.click('[data-suite-run]');
await page.waitForTimeout(300);
console.log('baseline      ', JSON.stringify(await state()));

for (const fault of ['alt', 'heading', 'target']) {
  await page.click(`[data-fault="${fault}"]`);
  await page.waitForTimeout(300);
  const s = await state();
  console.log(`inject ${fault.padEnd(8)}`, s.chip, `${s.passed}/${s.failed}`, JSON.stringify(s.reds));
  await page.click('[data-fault-revert]');
  await page.waitForTimeout(300);
  const r = await state();
  console.log(`  reverted    `, r.chip, `${r.passed}/${r.failed}`);
}

await browser.close();
