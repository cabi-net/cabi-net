// Shared project data — imported by the work index and the portfolio (print) page
// so the two never drift. `slug` → internal /work/<slug> page; `href` → external link.
// `summary` is a fuller description used in the printable portfolio PDF.
export const projects = [
  {
    slug: 'corporate-aesthetics',
    title: 'corporate aesthetics',
    year: '2026',
    tags: ['archival', 'automation'],
    oneliner: 'An automated archive watching the language of institutional AI and data privacy disclosures over time.',
    summary:
      'An automated archive that watches the language of institutional AI and data privacy disclosures and makes their changes visible over time. A GitHub Actions workflow scrapes privacy pages from Google, Meta, Microsoft and OpenAI on a schedule (using Playwright and the Wayback Machine) and surfaces how the wording shifts.',
    repo: 'https://github.com/cabi-net/corporate-aesthetics',
  },
  {
    slug: 'rider-waite',
    title: 'rider-waite recoloured',
    year: '2026',
    tags: ['scraping', 'image processing', 'automation'],
    oneliner: 'Scraping, indexing, and recolouring the Rider-Waite tarot deck.',
    summary:
      'A Python tool that scrapes all 78 Rider-Waite Tarot cards from Wikimedia Commons and recolours every card at runtime using a custom 4-anchor LAB colour ramp — inspired by Krita’s Index Colors filter and reimplemented from scratch. The user supplies four anchor colours and step counts; the script interpolates between them in CIE LAB space to build the palette.',
    repo: 'https://github.com/cabi-net/rider-waite-scrape-and-index',
  },
  {
    slug: null,
    href: 'https://postc4rd.neocities.org/',
    title: 'postcard',
    year: '2026',
    tags: ['p5.js', 'web', 'interactive'],
    oneliner: 'A digital postcard making and sending website.',
    summary:
      'An interactive website for making and sending digital postcards, built with p5.js.',
    repo: 'https://postc4rd.neocities.org/',
  },
  {
    slug: 'daisy',
    href: 'https://cabi-net.github.io/loads-me-not',
    title: 'loads me not',
    year: '2026',
    tags: ['p5.js', 'generative', 'interactive'],
    oneliner: 'A generative p5.js piece built around infinite loops.',
    summary:
      'A generative, interactive p5.js piece built around infinite loops — endlessly rotating forms set to a short epigraph.',
    repo: 'https://cabi-net.github.io/loads-me-not',
  },
  {
    slug: 'instagram-redux',
    title: 'instagram redux',
    year: '2026',
    tags: ['chrome extension', 'javascript', 'browser'],
    oneliner: 'A Chrome extension that strips Instagram down to what you actually want.',
    summary:
      'A Chrome extension that strips Instagram down to what you actually want — no ads, no reels, no suggested posts or people, and a chronological feed. Inspired by YouTube Redux.',
    status: 'in development',
  },
  {
    slug: 'recur',
    title: 'recur',
    year: '2026',
    tags: ['cli', 'python', 'local-first'],
    oneliner: 'A minimal command-line journal that surfaces echoes between past and present entries.',
    summary:
      'A minimal, local-first command-line journal that surfaces echoes between past and present entries. Write a thought; if a word you used has appeared before, recur finds that older entry and brings it forward. Entries are stored locally with no accounts, sync, or cloud.',
    repo: 'https://github.com/cabi-net/recur',
  },
  {
    slug: null,
    href: 'https://cabi-net.github.io/beaded-font-creator/',
    title: 'beaded font creator',
    year: '2026',
    tags: ['web', 'interactive', 'type'],
    oneliner: 'A tool for building bead-grid fonts.',
    summary:
      'An interactive web tool for building bead-grid fonts.',
    repo: 'https://github.com/cabi-net/beaded-font-creator',
  },
  {
    slug: 'malware-buster',
    title: 'malware buster',
    year: '2023',
    tags: ['game', 'unity', 'shooter'],
    oneliner: 'A Unity shooter set inside a desktop.',
    summary:
      'A shooter built in Unity and set inside a desktop — the camera is framed to read as a screen you are looking at rather than a world you are inside, and the player, enemies and environment are drawn as the machine’s own furniture. Three levels, sequenced so the difficulty and the concept open up together. Playable in the browser or as a Windows download.',
    repo: 'https://silataskin.itch.io/malware-buster',
    status: 'in development',
  },
  {
    slug: 'beatbox',
    title: 'beatbox',
    year: '2026',
    tags: ['web', 'collaboration', 'audio'],
    oneliner: 'A beat marketplace and trading platform.',
    summary:
      'A collaborative marketplace and trading platform for beats. Producers list instrumentals with their metadata — BPM, key, tags — and users browse, preview, filter by tag, and switch between a list and a carousel view of the catalogue.',
    repo: 'https://beatbox-azure.vercel.app/',
    status: 'in development',
  },
];
