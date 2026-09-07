# BRIEF — Raz Abramovich, Backend QA Engineer

**Status: Self-authored under explicit creative delegation.**
The user's instruction was "build my site with the new skill, try to make it look
professional." That delegates creative direction; it does not delegate facts.

Every factual claim below is **evidence** taken from the existing site at
`index.html@36c791f` (the user's own copy about himself). Anything marked
**assumption** is my authored decision, not something he said.

---

## The eight topics

**1. Vibe, three to five words.**
Authored: *precise, instrumented, unshowy, verifiable.*
References (not websites): a CI run summary; an oscilloscope face; the margin of
a well-kept lab notebook.

**2. The scroll journey.**
Authored, from his content order: a console already running → who he is and what
he owns → the toolchain → the proof → the shipped work → how to reach him.

**3. The energy curve.**
Authored: level and low for the first third (this is a working surface, not a
pitch), one spike at the proof, quiet after it.

**4. Feeling, stage by stage, and the one moment.**
See the feeling curve below. The one moment: the visitor breaks the page
themselves and the suite catches them.

**5. One thing no site they have seen does.**
Authored: the page tests itself, live, in front of the reader, and hands them the
controls to break it.

**6. Distance from premium-minimal.**
Authored: **dense** (uniqueness.md §5), with a structural edge. Information
forward, small type, high count. Not premium-minimal, which would read as a
marketing page for a person whose job is measurement.

**7. One unbroken world, or distinct scenes?**
Neither, and that is the finding: this brief does not want a world at all. It
wants a **surface**. See the grammar note.

**8. Assets he already has.**
Evidence: no photography, no footage, no logo, no brand kit. Environment has no
ffmpeg build and no image-generation key (`doctor.mjs`, this session), so
generated imagery is unavailable too. The page must carry itself on structure,
type and behaviour. That constraint pointed at the right grammar rather than
away from one.

---

## Who and what

**What this is, and who it is for.** Evidence: a QA engineer's portfolio, aimed
at hiring managers and engineering leads. Backend and SaaS systems.

**What the visitor must believe by the end.** Authored, one sentence:
*This person finds the defect you would have shipped.*

**What the visitor does next.** One action, one label everywhere on the page:
**Email Raz**.

**Facts on record** (all from his own copy, nothing added):

| Fact | Source |
|---|---|
| QA Engineer, 5 years, SaaS and backend | about copy |
| Backend QA Engineer, Firearc, Herzeliya Pituah, 2025–present | experience |
| QA Engineer & Automation, Bolt Tech, Petah Tikva, 2021–2025 | experience |
| Sole owner of production release approvals | experience bullet |
| Led QA for the Rule Engine migration, legacy to C# | experience bullet |
| Playwright, Selenium (C#), PowerShell, Python, CI/CD | skills |
| REST APIs, Postman, SQL, BigQuery, AWS, Azure DevOps | skills |
| ChatGPT, Claude, Gemini, LLM integration | skills |
| Two public repositories, both linked | projects |
| Netanya, Israel · 052-4385149 · abramovichraz@gmail.com · LinkedIn | contact |

**Facts deliberately NOT carried over:**

- **"50+ Projects Completed."** Unverifiable and unsourced. taste.md forbids
  invented statistics, and a fabricated number on a QA engineer's page is the
  worst possible place to have one. Dropped. Every number that survives is real.
- **Three "Certifications" with no issuer, no date, no credential ID.** A
  certification claim with no issuer is not a certification. Reframed as
  *practice areas* (what he works on), which is true as written. If he holds
  actual certificates, they go back in with issuer and year.

---

## The grammar: Live surface (uniqueness.md §2.3)

The page behaves like the product. For a QA engineer the product is a test run,
so the page is a test surface with his record inside it.

**Why the other seven lost:**

| Grammar | Why not |
|---|---|
| Filmic one-shot | Needs a scrub clip. No footage, no ffmpeg, no generation key. And it carries a burden of proof it cannot meet here: nothing about a QA record wants to be *carried*. |
| Chaptered editorial | He is not selling an essay. The proof of a tester is behaviour, not prose, and the grammar's media column needs photography he does not have. |
| Continuous world | Requires worldflight legs, i.e. video. Impossible in this environment, and there is no geography in the brief. |
| Typographic poster | The one real alternative: it needs no assets. Rejected because type alone can *state* that he finds defects and can never *show* it. It would look sharp and prove nothing. |
| Gallery / catalog | A collection of two public repos is not a collection. |
| Split stage | Manual-versus-automated is a genuine axis, but it forces the whole page through one comparison, and his story has four (record, stack, proof, contact). |
| Rhythmic cutlist | An energy-brand grammar. Wrong register entirely for someone being evaluated for rigour. |

**The honesty rule, and how this build clears it.** §2.3 forbids a painted
surface: the panels must be real markup running real logic on real data. They
are. Every assertion in the suite executes against the live DOM of the page the
visitor is looking at, and every number it prints is measured at runtime —
contrast ratios from computed styles, tap-target sizes from real bounding rects,
durations from `performance.now()`. There is no scripted output and no fixture.
If the page regresses, the page says so on its own face.

---

## The feeling curve

Written before the acts existed.

```
1  Curiosity       a console already mid-run, statuses ticking, no headline claim
2  Confidence      plain record held still while the run log advances beside it
3  Competence      the toolchain travelling sideways as an inventory, dense, specific
4  Complicity      they break the page themselves and the suite goes red on them   ← PEAK
5  Substantiation  the shipped repositories, quiet, after the noise
6  Readiness       a real input with a cursor in it
```

No two adjacent feelings repeat. Act 3 is the quiet in front of the peak: an
inventory does not argue, so act 4 has something to be a change from.

**The peak.** Act 4, and it gets the largest span on the page by a clear margin.

The sentence a visitor would say to a friend:

> I clicked a button that stripped a label off his page, and his own test suite
> caught it in front of me and told me exactly which assertion failed.

**The tell-someone sentence:**

> It's the site where you break the page yourself and it catches you.

**The signature move.** The fault injector. Three controls inject a *real*
defect into the live document — remove an accessible name, skip a heading level,
shrink a tap target below 44px. The suite re-runs for real, the specific
assertion goes red with the actual measured value, and revert restores it. It is
coded in the page, driven off `--sc-p` and the page's own state, and the engine
is untouched. This is also the peak; feel.md §3 requires those to be the same
moment, and here they are.

**Authored silence.** The first two thirds of act 4 are deliberately quiet: the
suite is listed but not yet run, so the run has something to arrive from. The
verification pass should read that as intent, not as dead scroll.

---

## The score

| # | Beat | Device | Span | Why this one |
|---|---|---|---|---|
| 1 | Recognition | `pin` | 2.0 | The frame holds while the surface boots. The hero is the tool already in a state, not a title. |
| 2 | Record | `flow` + `in` + `count` | — | Credentials are information, not experience. feel.md §5: compress the administrative parts. |
| 3 | Capability | `pan` | 3.0 | Lateral travel reads as breadth. A stack is a range, not an argument. |
| 4 | **Proof** | `pin` + real controls | 3.8 | The visitor operates the surface. Longest span on the page. |
| 5 | Evidence | `flow` + `reveal` | — | A wipe is a change of state: the artifacts arriving. |
| 6 | Readiness | `pin` + real input | 1.3 | §2.3: the close is an actual input, not a magnetic button. |

Five device families (`pin`, `flow`/`in`, `pan`, `reveal`, `count`), never the
same family twice in a row, zero `scrub` acts. Pinned total 10.1vh, roughly
12.5vh with the two flow sections — outside the 13.6–13.8vh band flagged in
uniqueness.md §1.

**Grammar bans respected:** no `scrub`, no `kinetic`, no `spotlight`, no `drift`
past two stops, no marketing bar, no scrims, no full-bleed photography, no
display type at hero scale. Copy is in the surface's idiom: labels, status
lines, empty states, assertion messages.

---

## Palette and type

Cold instrument, not terminal-green and not the premium-minimal costume.

```
canvas  #0A0D10   surface #131A20
ink     #E6EDF2   ink-soft #8A98A4  (cold-tinted, not flat gray)
accent  #2FD4C6   accent-ink #06100F
```

**One documented deviation from "one accent".** A test surface has pass and fail
semantics, and suppressing a failure colour would be worse design and worse
accessibility than carrying it. Failure red `#FF6F61` is scoped strictly to
failing assertions, never used decoratively, and never carries meaning alone:
every status is also a word and a glyph, so it survives greyscale and colour
blindness. Two hues total, one of them purely semantic.

Type: **Archivo** for display and text, **JetBrains Mono** for data, labels and
assertion output — mono for code and data, which is its sanctioned use, and it
is already the face on his current site.

---

## Verification (Step 5)

Harness green on three passes: desktop 1440×900, phone 390×844, and reduced
motion. No dead scroll, and every cue clears 4.5:1 at its worst frame. The
contact sheet could not be tiled because this environment has no full ffmpeg
build, so the frames were read individually instead.

Measured by hand, since a green harness run does not cover these:

- The page's own suite: 10 of 10 at both widths, and each fault caught by the
  correct assertion with the value it actually measured, then reverted clean.
- Rail overflow 816px against a 1440px viewport, clear of the half-viewport
  floor in devices.md §3. It travels -17px to -839px on the sheet.
- Focus order on a fresh load: skip link, run control, the six tree links, the
  three fault controls, both repositories, the composer, the contact links.
  Every stop carries a visible accent ring.
- Anchor jumps clear the fixed chrome at both widths.

### Defects the suite caught in its own page

Three, all mine, all fixed rather than exempted:

1. Tap targets at 25 to 37px across the run control, the tree links and the
   contact links. The chrome was resized around the 44px floor.
2. `width: min(100%, 60rem)` plus margins on `.panel`, which overflowed its own
   container by exactly the margins and clipped the panel on a phone.
3. The graphics check accepted an empty accessible name, so the first fault
   injected nothing detectable. The check was wrong, not the fault.

### Feel check

Run cold against the sheet, one word per act, before rereading this file.

```
intended        felt
1 curiosity     curiosity
2 confidence    confidence
3 competence    competence
4 complicity    proof, then complicity   ← the one divergence
5 substantiation substantiation
6 readiness     readiness
```

Act 4 reads as *proof* until the visitor touches a control, and only becomes
*complicity* once they do. The peak is participatory, so the page cannot
guarantee it. What changed: the invitation was shortened and moved so it sits
on the same screen as the verdict at both widths, and it is the only prose in a
panel that is otherwise all data, which makes it the thing the eye lands on
after the run finishes.

Peak confirmed on the sheet: the suite act holds six of the twenty-five frames
(56% to 80% of the page), the most of any act, and carries the largest visual
change on the page. The act before it is an inventory, which is the quiet.

### Not verified

- **A real phone.** Headless Chromium cannot reproduce iOS touch scrolling or
  Safari's layout of the pinned stages. Mobile here is an emulated viewport.
- **The intended typography.** This sandbox's proxy blocks fonts.googleapis.com,
  so every screenshot renders in the fallback stack rather than Archivo and
  JetBrains Mono. The request is well-formed and the same one his previous site
  used, but the real faces have not been seen rendered.
