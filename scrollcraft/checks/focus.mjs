import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4500/', { waitUntil: 'load' });
await page.waitForTimeout(600);
const order = [];
for (let i = 0; i < 26; i++) {
  await page.keyboard.press('Tab');
  const cur = await page.evaluate(() => {
    const a = document.activeElement;
    if (!a || a === document.body) return null;
    const cs = getComputedStyle(a);
    return { tag: a.tagName.toLowerCase(),
             label: (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0,34),
             ring: cs.outlineWidth + ' ' + cs.outlineStyle + ' ' + cs.outlineColor };
  });
  if (!cur) { order.push({tag:'(body)',label:'wrapped out',ring:''}); break; }
  order.push(cur);
}
order.forEach((o,i)=>console.log(` ${String(i+1).padStart(2)} ${o.tag.padEnd(8)} ${o.label.padEnd(30)} ${o.ring}`));
await browser.close();
