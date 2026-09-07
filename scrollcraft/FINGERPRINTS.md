# Fingerprints

Every site you build with **scroll-craft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| raz-qa | Live surface | Test-explorer run tree, left rail on desktop and a tab strip on phones, with a status bar carrying suite state | Populated session panel, already reading the visitor's environment, no title treatment | pin 2.0 > flow > pan 3.0 > pin 3.8 (peak) > flow > pin 1.3; 6 acts, 11.9vh | Pinned panel holding a real composer input that drafts a mail, contact table and footer inside the stage | The fault injector: controls that put a real defect into the live DOM so the page's own suite catches it, then revert | Cold instrument, dense, no imagery | Static site on GitHub Pages |


---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

- **Live surface** is taken, and with it the honesty rule: the next build using
  this grammar needs panels that genuinely compute, not a painted surface.
- **A run tree as navigation** is taken. Another build wanting an index in the
  margin needs a different object: a folio, a map, a waypoint list.
- **A page that tests itself** is taken, and so is the wider shape it belongs
  to: any interaction whose content is the page's own measured state.
- **Ending on a real input** is taken (a composer that drafts a mail). Another
  close needs to resolve some other way.
- **6 acts at 11.9vh** is taken. Note this sits just outside the 13.6-13.8vh
  band flagged in uniqueness.md, but a second build landing at ~12vh across 6
  acts would start a band of its own.
- Not taken, and still free: every other grammar, all photographic and
  illustrated worlds, `scrub` and `kinetic` (unused here), and any aesthetic
  family other than dense/instrument.

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scroll-craft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.
