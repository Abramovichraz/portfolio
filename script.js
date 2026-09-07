/* ===========================================================================
   Raz Abramovich · backend QA

   The signature move lives here: the page runs a real suite against its own
   live DOM, and the visitor can inject real defects into it and watch the
   suite catch them.

   Nothing below is a fixture or a scripted transcript. Every assertion reads
   the document as it currently stands, every printed number is measured at
   run time, and every fault is an actual mutation of the live page.
   ========================================================================= */

(function () {
  'use strict';

  ScrollCraft.mount(document.body);

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------- contrast ---
     Real WCAG maths. Colours arrive from getComputedStyle as rgba(), and the
     surfaces on this page are translucent, so a background has to be
     composited down the ancestor chain before it means anything. */

  function parseRGB(str) {
    var m = String(str).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    var p = m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }

  function over(fg, bg) {                       // source-over composite
    var a = fg.a + bg.a * (1 - fg.a);
    if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
    return {
      r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
      g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
      b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
      a: a
    };
  }

  function luminance(c) {
    var ch = [c.r, c.g, c.b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  }

  function effectiveBackground(el) {
    var stack = [];
    for (var n = el; n && n.nodeType === 1; n = n.parentElement) {
      var bg = parseRGB(getComputedStyle(n).backgroundColor);
      if (bg && bg.a > 0) stack.push(bg);
      if (bg && bg.a === 1) break;
    }
    var out = { r: 255, g: 255, b: 255, a: 1 };   // the ultimate backdrop
    for (var i = stack.length - 1; i >= 0; i--) out = over(stack[i], out);
    return out;
  }

  function contrast(el) {
    var fg = parseRGB(getComputedStyle(el).color);
    if (!fg) return null;
    var bg = effectiveBackground(el);
    if (fg.a < 1) fg = over(fg, bg);
    var l1 = luminance(fg), l2 = luminance(bg);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }

  /* ------------------------------------------------------------- helpers -- */

  function accessibleName(el) {
    var n = el.getAttribute('aria-label');
    if (n && n.trim()) return n.trim();
    var by = el.getAttribute('aria-labelledby');
    if (by) {
      var ref = document.getElementById(by);
      if (ref && ref.textContent.trim()) return ref.textContent.trim();
    }
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
      var lab = el.id && $('label[for="' + el.id + '"]');
      if (lab && lab.textContent.trim()) return lab.textContent.trim();
    }
    if (el.tagName === 'IMG') return el.getAttribute('alt');   // "" is a valid name
    return (el.textContent || '').trim();
  }

  /* A tap target is only held to 44px when it is a standalone control. Links
     inside a sentence are exempt (WCAG 2.5.8 inline exception), and this page
     has none of those anyway. */
  function tapTargets() {
    return $$('button, .art__link, .direct a, .tree a').filter(function (el) {
      return el.offsetParent !== null || el.getClientRects().length;
    });
  }

  /* ------------------------------------------------------------- the suite --
     Ten assertions. Each returns a real verdict and the value it measured. */

  var CHECKS = [
    {
      name: 'document language is declared', short: 'lang declared',
      run: function () {
        var lang = document.documentElement.getAttribute('lang');
        return { pass: !!(lang && lang.trim()), value: lang ? 'lang="' + lang + '"' : 'missing' };
      }
    },
    {
      name: 'exactly one h1', short: 'one h1',
      run: function () {
        var n = $$('h1').length;
        return { pass: n === 1, value: n + ' found' };
      }
    },
    {
      name: 'heading levels never skip', short: 'heading order',
      run: function () {
        var hs = $$('h1, h2, h3, h4, h5, h6');
        var prev = 0, worst = null;
        for (var i = 0; i < hs.length; i++) {
          var lvl = +hs[i].tagName[1];
          if (prev && lvl > prev + 1) { worst = 'h' + prev + ' to h' + lvl; break; }
          prev = lvl;
        }
        return { pass: !worst, value: worst ? 'skipped ' + worst : hs.length + ' in order' };
      }
    },
    {
      name: 'every graphic has an accessible name', short: 'graphics named',
      run: function () {
        var gs = $$('img, [role="img"]');
        var bad = gs.filter(function (g) {
          // alt="" is a valid name: it marks an image as decorative. Anything
          // else has to carry a name a screen reader can actually read out.
          if (g.tagName === 'IMG') return g.getAttribute('alt') === null;
          return !accessibleName(g);
        });
        return { pass: bad.length === 0, value: bad.length ? bad.length + ' unnamed' : gs.length + ' named' };
      }
    },
    {
      name: 'text contrast at or above 4.5:1', short: 'contrast 4.5:1',
      run: function () {
        var sample = $$('.lede, .head__sub, .post__lines li, .art__body, .inject__ask, ' +
                        '.panel__note, .env dd, .check__name, .rail__note, .tool__list li, .direct a');
        var min = Infinity, el = null;
        sample.forEach(function (s) {
          if (!s.getClientRects().length) return;
          var c = contrast(s);
          if (c !== null && c < min) { min = c; el = s; }
        });
        if (!el) return { pass: true, value: 'nothing visible to measure' };
        return { pass: min >= 4.5, value: min.toFixed(2) + ':1 lowest' };
      }
    },
    {
      name: 'every control has an accessible name', short: 'controls named',
      run: function () {
        var cs = $$('button, a[href], textarea, input, select');
        var bad = cs.filter(function (c) { return !accessibleName(c); });
        return { pass: bad.length === 0, value: bad.length ? bad.length + ' unnamed' : cs.length + ' named' };
      }
    },
    {
      name: 'tap targets at or above 44px', short: 'targets 44px',
      run: function () {
        var min = Infinity;
        tapTargets().forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (!r.width || !r.height) return;
          min = Math.min(min, Math.round(Math.min(r.width, r.height)));
        });
        if (min === Infinity) return { pass: true, value: 'none on screen' };
        return { pass: min >= 44, value: min + 'px smallest' };
      }
    },
    {
      name: 'no positive tabindex', short: 'no +tabindex',
      run: function () {
        var bad = $$('[tabindex]').filter(function (el) { return +el.getAttribute('tabindex') > 0; });
        return { pass: bad.length === 0, value: bad.length ? bad.length + ' found' : 'natural order' };
      }
    },
    {
      name: 'external links carry rel=noopener', short: 'rel=noopener',
      run: function () {
        var ext = $$('a[target="_blank"]');
        var bad = ext.filter(function (a) { return !/\bnoopener\b/.test(a.rel || ''); });
        return { pass: bad.length === 0, value: bad.length ? bad.length + ' unprotected' : ext.length + ' protected' };
      }
    },
    {
      name: 'no horizontal overflow', short: 'no h-overflow',
      run: function () {
        var d = document.documentElement;
        var slack = d.scrollWidth - d.clientWidth;
        return { pass: slack <= 1, value: slack <= 1 ? d.clientWidth + 'px clean' : slack + 'px over' };
      }
    }
  ];

  /* ---------------------------------------------------------- rendering --- */

  var listEl     = $('[data-checks]');
  var verdictEl  = $('[data-verdict]');
  var vStateEl   = $('[data-verdict-state]');
  var vDetailEl  = $('[data-verdict-detail]');
  var stateChip  = $('[data-suite-state]');
  var dotEl      = $('[data-suite-dot]');
  var passedEl   = $('[data-suite-passed]');
  var failedEl   = $('[data-suite-failed]');
  var failedWrap = $('[data-suite-failed-wrap]');
  var msEl       = $('[data-suite-ms]');
  var runBtn     = $('[data-suite-run]');

  var rows = CHECKS.map(function (c, i) {
    var li = document.createElement('li');
    li.className = 'check';
    li.setAttribute('data-state', 'queued');
    li.innerHTML =
      '<span class="check__mark">·</span>' +
      '<span class="check__name"><span class="check__long"></span>' +
      '<span class="check__short"></span></span>' +
      '<span class="check__val">queued</span>';
    li.querySelector('.check__long').textContent = c.name;
    li.querySelector('.check__short').textContent = c.short;
    listEl.appendChild(li);
    return li;
  });

  var MARKS = { queued: '·', running: '>', pass: '✓', fail: '✕' };

  function paint(i, state, value) {
    var li = rows[i];
    li.setAttribute('data-state', state);
    li.querySelector('.check__mark').textContent = MARKS[state];
    li.querySelector('.check__val').textContent = value;
  }

  /* ------------------------------------------------------------- running -- */

  var results = new Array(CHECKS.length);
  var elapsed = 0;
  var ran = 0;

  function tally() {
    var passed = 0, failed = 0;
    results.forEach(function (r) { if (r) { r.pass ? passed++ : failed++; } });

    passedEl.textContent = passed;
    failedEl.textContent = failed;
    failedWrap.hidden = failed === 0;
    msEl.textContent = elapsed.toFixed(1);

    var state = ran < CHECKS.length ? (ran ? 'running' : 'idle')
              : (failed ? 'failed' : 'passed');
    stateChip.textContent = state;
    stateChip.setAttribute('data-state', state);
    dotEl.setAttribute('data-state', state);

    var envAssert = $('[data-env="assertions"]');
    if (envAssert) {
      envAssert.textContent = ran < CHECKS.length
        ? CHECKS.length + ' defined'
        : passed + ' of ' + CHECKS.length + ' passing';
    }

    if (ran === CHECKS.length) {
      verdictEl.hidden = false;
      verdictEl.setAttribute('data-state', failed ? 'failed' : 'passed');
      vStateEl.textContent = failed ? 'failed' : 'passed';
      vDetailEl.textContent = failed
        ? failed + ' of ' + CHECKS.length + ' assertions failed in ' + elapsed.toFixed(1) + ' ms. The defect is real and it is in the page you are reading.'
        : CHECKS.length + ' of ' + CHECKS.length + ' assertions passed in ' + elapsed.toFixed(1) + ' ms, measured on this document.';
    }
  }

  function runOne(i) {
    if (results[i]) return;
    paint(i, 'running', 'running');
    var t0 = performance.now();
    var out;
    try { out = CHECKS[i].run(); }
    catch (e) { out = { pass: false, value: 'threw: ' + e.message }; }
    var dt = performance.now() - t0;
    elapsed += dt;
    results[i] = out;
    ran++;
    paint(i, out.pass ? 'pass' : 'fail', out.value);
    tally();
  }

  function runUpTo(n) {
    for (var i = 0; i < n && i < CHECKS.length; i++) runOne(i);
  }

  function reset() {
    results = new Array(CHECKS.length);
    elapsed = 0; ran = 0;
    rows.forEach(function (_, i) { paint(i, 'queued', 'queued'); });
    verdictEl.hidden = true;
    tally();
  }

  function runAll(fresh) {
    if (fresh) reset();
    runUpTo(CHECKS.length);
  }

  runBtn.addEventListener('click', function () { runAll(true); });

  /* ------------------------------------------ scroll drives the cascade ---
     The first 30% of the act is authored silence: the suite is listed but
     idle, so the run has something to arrive from. Between 0.30 and 0.78 the
     assertions execute one at a time under the reader's hand. */

  var act = document.getElementById('suite');
  var RUN_FROM = 0.30, RUN_TO = 0.78;
  var ticking = false, visible = false;

  function readProgress() {
    ticking = false;
    if (!visible) return;
    var p = parseFloat(getComputedStyle(act).getPropertyValue('--sc-p'));
    if (isNaN(p)) return;
    var t = (p - RUN_FROM) / (RUN_TO - RUN_FROM);
    runUpTo(Math.floor(Math.max(0, Math.min(1, t)) * CHECKS.length));
  }

  function schedule() {
    if (!ticking) { ticking = true; requestAnimationFrame(readProgress); }
  }

  new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      visible = e.isIntersecting;
      if (visible) schedule();
    });
  }, { threshold: [0, 0.25, 0.6] }).observe(act);

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });

  /* A reader on reduced motion, arriving by anchor link, or simply parked on
     the section still deserves the run. If the act has been more than half on
     screen for a beat and the suite has not finished, run it. */
  var settle = null;
  new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      clearTimeout(settle);
      if (e.isIntersecting && e.intersectionRatio > 0.5 && ran < CHECKS.length) {
        settle = setTimeout(function () { runAll(false); }, 900);
      }
    });
  }, { threshold: [0.5, 0.75] }).observe(act);

  tally();

  /* --------------------------------------------------- the fault injector --
     Each of these puts a real defect into the live document. The suite is
     then re-run from scratch, so the assertion that catches it reports the
     value it actually measured after the mutation. */

  var faultState = $('[data-fault-state]');
  var revertBtn  = $('[data-fault-revert]');
  var undo = null;
  var activeFault = null;

  var FAULTS = {
    alt: {
      label: 'accessible name removed',
      note: 'The check-mark graphic in the identity panel has lost the label a screen reader would have read out.',
      apply: function () {
        var g = $('[data-mark]');
        if (!g) return null;
        var was = g.getAttribute('aria-label');
        g.removeAttribute('aria-label');
        return function () { g.setAttribute('aria-label', was); };
      }
    },
    heading: {
      label: 'heading level skipped',
      note: 'The first job title in the record is now an h5 sitting directly under an h2.',
      apply: function () {
        var h3 = $('.post__role');
        if (!h3) return null;
        var h5 = document.createElement('h5');
        h5.className = h3.className;
        h5.innerHTML = h3.innerHTML;
        h3.parentNode.replaceChild(h5, h3);
        return function () { h5.parentNode.replaceChild(h3, h5); };
      }
    },
    target: {
      label: 'tap target shrunk',
      note: 'The repository link in the artifacts section has been squeezed under the 44px floor.',
      apply: function () {
        var a = $('.art__link');
        if (!a) return null;
        var was = a.getAttribute('style') || '';
        a.style.minHeight = '22px';
        a.style.height = '22px';
        return function () { a.setAttribute('style', was); };
      }
    }
  };

  function revert() {
    if (undo) { undo(); undo = null; }
    activeFault = null;
    revertBtn.disabled = true;
    faultState.removeAttribute('data-state');
    faultState.textContent = 'No faults injected. The page is in its shipped state.';
    $$('[data-fault]').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    runAll(true);
  }

  $$('[data-fault]').forEach(function (btn) {
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-fault');
      if (activeFault === key) { revert(); return; }
      if (undo) undo();

      var fault = FAULTS[key];
      undo = fault.apply();
      if (!undo) return;

      activeFault = key;
      revertBtn.disabled = false;
      faultState.setAttribute('data-state', 'dirty');
      faultState.textContent = 'Fault injected: ' + fault.label + '. ' + fault.note + ' Suite re-run below.';
      $$('[data-fault]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });

      runAll(true);
    });
  });

  revertBtn.addEventListener('click', revert);

  /* Leaving a visitor on a broken page would be its own defect. */
  addEventListener('pagehide', function () { if (undo) undo(); });

  /* ---------------------------------------------- environment readout ---- */

  function readEnvironment() {
    var set = function (k, v) { var el = $('[data-env="' + k + '"]'); if (el) el.textContent = v; };
    set('viewport', innerWidth + ' × ' + innerHeight);
    set('pointer', matchMedia('(pointer: fine)').matches ? 'fine' : 'coarse');
    set('motion', matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'full');
    var line = $('[data-env-line]');
    if (line) line.textContent = 'Everything below is measured on your device, now.';
  }
  readEnvironment();
  addEventListener('resize', readEnvironment, { passive: true });

  /* --------------------------------------------------- the run tree nav --- */

  var links = {};
  $$('[data-tree]').forEach(function (a) { links[a.getAttribute('data-tree')] = a; });

  var treeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var a = links[e.target.id];
      if (!a || !e.isIntersecting) return;
      a.setAttribute('data-seen', '');
      Object.keys(links).forEach(function (k) { links[k].removeAttribute('aria-current'); });
      a.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  $$('main .act').forEach(function (s) { if (s.id) treeObserver.observe(s); });

  /* --------------------------------------------------------- the close --- */
  /* A real input, not a decorative form. It composes a mail draft in the
     visitor's own client; nothing is transmitted from this page. */

  var composer = $('[data-composer]');
  var hint = $('[data-composer-hint]');

  composer.addEventListener('submit', function (e) {
    e.preventDefault();
    var body = $('#msg').value.trim();
    var url = 'mailto:abramovichraz@gmail.com'
            + '?subject=' + encodeURIComponent('From your portfolio')
            + (body ? '&body=' + encodeURIComponent(body) : '');
    location.href = url;
    hint.textContent = 'Opening your mail app with the draft.';
  });
})();
