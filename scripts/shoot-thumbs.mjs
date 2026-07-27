/**
 * Screenshot each project's live URL into a 16:10 tile thumbnail.
 *
 *   node scripts/shoot-thumbs.mjs            # every project with links.live
 *   node scripts/shoot-thumbs.mjs postcard   # just one, by slug
 *
 * Writes public/assets/thumbs/<slug>.png and prints the frontmatter line to add.
 * Run on demand, not at build time: the PNGs are committed, so builds stay fast
 * and work offline. Re-run when a site changes.
 */
import { chromium } from 'playwright';
import { readdir, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const PROJECTS_DIR = 'src/content/projects';
const OUT_DIR = 'public/assets/thumbs';

// 16:10 at 2x, matching .tile-thumb's aspect-ratio
const VIEWPORT = { width: 1440, height: 900 };

/**
 * Per-project capture tweaks. Canvas pieces need longer than a network-idle
 * signal (that fires while p5 is still on its loading screen), and some sites
 * only show anything interesting after input.
 */
const TWEAKS = {
  // its links.live is an itch.io store page, so a screenshot captures itch's
  // chrome rather than the game. the thumb is a video frame instead:
  //   ffmpeg -ss 5 -i public/assets/malware-buster/mal-buster.mp4 \
  //     -frames:v 1 -q:v 2 public/assets/thumbs/malware-buster.png
  'malware-buster': { skip: true },
  // the sketch holds on a "loading..." screen until you click through it
  'loads-me-not': {
    wait: 4000,
    async before(page) {
      await page.mouse.click(1300, 800);
      await page.waitForTimeout(1500);
      await page.mouse.click(720, 450);
    },
  },
  postcard: {
    wait: 4000,
    // an empty form says nothing about the project; type into it first
    async before(page) {
      const input = page.locator('input, textarea, [contenteditable]').first();
      await input.click({ timeout: 5000 });
      await page.keyboard.type('wish you were here', { delay: 45 });
    },
  },
};

/** Pull `title`, `links.live` and any existing thumb out of a project's frontmatter. */
async function readProject(file) {
  const raw = await readFile(path.join(PROJECTS_DIR, file), 'utf8');
  const fm = raw.split('---')[1] ?? '';
  const live = fm.match(/^\s+live:\s*(\S+)/m)?.[1];
  const title = fm.match(/^title:\s*(.+)$/m)?.[1]?.trim();
  return { slug: path.basename(file, '.md'), title, live };
}

const only = process.argv[2];

const files = (await readdir(PROJECTS_DIR)).filter((f) => f.endsWith('.md'));
let projects = (await Promise.all(files.map(readProject))).filter((p) => p.live);
// skipped projects keep a hand-made thumb; an explicit slug still forces a shot
if (only) projects = projects.filter((p) => p.slug === only);
else projects = projects.filter((p) => !TWEAKS[p.slug]?.skip);

if (!projects.length) {
  console.error(only ? `no project "${only}" with a links.live` : 'no live URLs found');
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const results = [];

for (const { slug, title, live } of projects) {
  const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 2 });
  const out = path.join(OUT_DIR, `${slug}.png`);
  try {
    const tweak = TWEAKS[slug] ?? {};
    await page.goto(live, { waitUntil: 'networkidle', timeout: 30_000 });
    // canvas/p5 pieces need a beat to draw their first frame
    await page.waitForTimeout(tweak.wait ?? 2500);
    if (tweak.before) {
      // an interaction failing shouldn't lose us the screenshot
      await tweak.before(page).catch((e) => console.error(`       (setup: ${e.message.split('\n')[0]})`));
      await page.waitForTimeout(1200);
    }
    await page.screenshot({ path: out });
    console.log(`  ok   ${slug.padEnd(22)} ${live}`);
    results.push(slug);
  } catch (err) {
    // one unreachable site shouldn't kill the rest of the run
    console.error(`  FAIL ${slug.padEnd(22)} ${err.message.split('\n')[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();

if (results.length) {
  console.log(`\n${results.length}/${projects.length} captured. Add to frontmatter:\n`);
  for (const slug of results) console.log(`  ${slug}.md →  thumb: /assets/thumbs/${slug}.png`);
}
