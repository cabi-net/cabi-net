---
title: recur
blurb: A minimal command-line journal that surfaces echoes between past and present entries.
year: 2026
order: 6
tags: [cli, python, local-first]
status: finished
links:
  source: https://github.com/cabi-net/recur
---

recur is a minimal command-line journal that surfaces echoes between past and
present entries. write a thought; if a word you used has appeared before, recur
finds that older entry and brings it forward. you can leave it or rewrite it.
either way, the new entry is saved.

entries are stored locally at `~/.recur/entries.json` . the resonance is
accidental and slightly random by design: the same entry won't always surface
the same memory.
