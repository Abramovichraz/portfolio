import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const [w,h,tag] of [[1440,900,'desk'],[390,844,'phone']]) {
  const page = await browser.newPage({ viewport:{width:w,height:h} });
  await page.goto('http://localhost:4500/', { waitUntil:'load' });
  await page.waitForTimeout(500);
  const chrome = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const bar = parseFloat(cs.getPropertyValue('--bar-h'));
    const tree = parseFloat(cs.getPropertyValue('--tree-h'));
    return bar + tree;
  });
  console.log(`\n${tag} (chrome ${chrome}px)`);
  for (const id of ['record','artifacts']) {
    await page.click(`a[href="#${id}"]`);
    await page.waitForTimeout(900);
    const r = await page.evaluate((i) => {
      const h = document.querySelector(`#${i} h2`);
      return Math.round(h.getBoundingClientRect().top);
    }, id);
    console.log(`  #${id.padEnd(10)} heading top at ${r}px  ${r >= chrome ? 'clear' : 'CLIPPED'}`);
  }
  await page.close();
}
await browser.close();
