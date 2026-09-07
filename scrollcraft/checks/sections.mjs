import { chromium } from 'playwright-core';

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
});

for (const [w, h, tag] of [[1440, 900, 'desk'], [390, 844, 'phone']]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto('http://localhost:4500/', { waitUntil: 'load' });
  await page.waitForTimeout(500);

  for (const id of ['record', 'stack', 'artifacts']) {
    await page.evaluate((i) => document.getElementById(i).scrollIntoView(), id);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `../lab/sections/${tag}-${id}.png` });
  }

  if (tag === 'desk') {
    // focus order: tab through and record what receives focus, in order
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    const order = [];
    for (let i = 0; i < 22; i++) {
      await page.keyboard.press('Tab');
      const cur = await page.evaluate(() => {
        const a = document.activeElement;
        if (!a || a === document.body) return null;
        const r = a.getBoundingClientRect();
        const cs = getComputedStyle(a);
        return {
          tag: a.tagName.toLowerCase(),
          label: (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 34),
          outline: cs.outlineWidth + ' ' + cs.outlineStyle,
          onScreen: r.top >= -2 && r.bottom <= innerHeight + 2
        };
      });
      if (!cur) break;
      order.push(cur);
    }
    console.log('FOCUS ORDER');
    order.forEach((o, i) =>
      console.log(` ${String(i + 1).padStart(2)} ${o.tag.padEnd(8)} ${o.label.padEnd(36)} ring:${o.outline} onscreen:${o.onScreen}`));
  }
  await page.close();
}

await browser.close();
