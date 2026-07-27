import { defineCollection, z } from 'astro:content';

// One demo block on a project page. Discriminated on `kind` so each variant only
// carries its own fields — a malformed demo fails the build instead of rendering blank.
const demoItem = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('iframe'),
    src: z.string(),
    title: z.string(),
    ratio: z.string().default('4 / 3'),
    caption: z.string().optional(),
  }),
  z.object({
    kind: z.literal('video'),
    // webm first, mp4 fallback — browsers pick the first they can play
    sources: z.array(z.object({ src: z.string(), type: z.string() })).min(1),
    poster: z.string().optional(),
    caption: z.string().optional(),
  }),
  z.object({
    kind: z.literal('asciinema'),
    src: z.string(),
    caption: z.string().optional(),
  }),
  z.object({
    kind: z.literal('diff'),
    before: z.string(),
    after: z.string(),
    caption: z.string().optional(),
  }),
  z.object({
    kind: z.literal('images'),
    items: z.array(z.object({ src: z.string(), alt: z.string() })).min(1),
    caption: z.string().optional(),
  }),
]);

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    blurb: z.string(),
    year: z.number(),
    // explicit hand-sort; ascending. year alone can't order these (all 2026).
    order: z.number(),
    // tile size in the bento grid: 3 hero / 2 standard / 1 minor. Deliberately
    // separate from `order` — sequence and importance are different axes.
    emphasis: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(2),
    tags: z.array(z.string()),
    status: z.enum(['finished', 'in development']).default('finished'),
    thumb: z.string().optional(),
    // two images shown side by side in the tile's slot — for before/after pairs,
    // where one image alone doesn't say what the project does
    thumbPair: z.array(z.string()).length(2).optional(),
    links: z
      .object({
        live: z.string().url().optional(),
        source: z.string().url().optional(),
        writeup: z.string().url().optional(),
      })
      .default({}),
    demo: z.array(demoItem).default([]),
    // 'fullbleed' renders a bare edge-to-edge iframe with no article chrome.
    // NB: not named `layout` — that key is reserved by Astro's markdown handling
    // and gets resolved as a component import path.
    display: z.enum(['article', 'fullbleed']).default('article'),
    // external-only pieces: the list links straight out, no /work/<slug> is built
    external: z.boolean().default(false),
  }),
});

export const collections = { projects };
