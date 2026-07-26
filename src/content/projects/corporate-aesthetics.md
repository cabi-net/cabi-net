---
title: corporate aesthetics
blurb: An automated archive watching the language of institutional AI and data privacy disclosures over time.
year: 2026
order: 1
tags: [archival, automation]
status: finished
links:
  source: https://github.com/cabi-net/corporate-aesthetics
---

An automated archive that watches the language of institutional AI and
data privacy disclosures over time, and makes their changes visible.

| institution | page | method |
| --- | --- | --- |
| Google | [How Google Assistant works with your data ↗](https://support.google.com/assistant/answer/11091015) | Playwright |
| Meta | [How Meta uses information for generative AI ↗](https://privacycenter.instagram.com/privacy/genai/) | Playwright |
| Microsoft | [Data, privacy, and security for Azure OpenAI ↗](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy) | Playwright |
| OpenAI | [Data Processing Addendum ↗](https://openai.com/policies/data-processing-addendum/) | Wayback Machine |

A GitHub Actions workflow runs every Monday at 9am UTC. It scrapes each
target page, extracts the meaningful text, and commits a dated snapshot
to the repository. The repository history is the data structure — there
is no database.

OpenAI's policy pages actively block automated access. Their snapshots
are retrieved via the Internet Archive instead — a layer of mediation
that is itself part of the record.

> This project runs on GitHub, which is owned by Microsoft. Microsoft is
> one of the four companies whose rhetorical behavior this archive
> documents. This is not a contradiction to resolve or hide; it is part
> of the record.

Archiving since March 2026 · weekly snapshots · diff viewer forthcoming
