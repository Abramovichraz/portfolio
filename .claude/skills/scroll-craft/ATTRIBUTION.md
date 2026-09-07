# Attribution

**scroll-craft** was created by **Nate Herk** - https://github.com/nateherkai/scroll-craft -
and is released under the MIT licence.

This repository is a distribution maintained by **Shai Shotashvili (FutureProof AI)** -
https://github.com/Shaus12. It exists so the people I share it with can install the skill
in one line from a marketplace I keep current, and so they know where they got it.

## What changed here

- The plugin folder is `plugins/futureproof-design/` (was `plugins/nateherk-design/`), so the
  plugin installs as `futureproof-design@futureproof` and the skill is invoked as
  `/futureproof-design:scroll-craft`.
- `.claude-plugin/marketplace.json` and `plugins/futureproof-design/.claude-plugin/plugin.json`
  name Shai Shotashvili as maintainer of this distribution and point at this repository.
- `README.md` carries a maintainer banner and this repository's install commands.
- `LICENSE` keeps Nate Herk's original MIT copyright and adds a second copyright line
  covering the modifications above.

## What did not change

The skill itself - `SKILL.md`, `references/`, `engine/`, `scripts/`, `templates/` - is Nate
Herk's work, unmodified. The design standard, the engine, the verification harness and the
worked examples are his.

If you build on this, keep both credits.
