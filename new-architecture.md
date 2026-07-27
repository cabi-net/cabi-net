# cabi-net · room + list architecture

The one load-bearing idea: **the project list is the truth; the room is a view onto it.**
One data source, rendered two ways. Adding a piece means adding one file — it shows
up in the list automatically and stays findable, accessible, and mobile-safe no matter
what. Placing it in the room is optional, soft, and never adjudicated. That's what
kills the brittleness: nothing has to *fit*, it just has to land somewhere.

Everything below is plumbing. The modeling, placement, styling, and every word of
copy stay yours — marked `← yours` wherever a decision is one you own.

```
src/
  content/
    projects/            ← one .md per piece. frontmatter = shared truth, body = your writing
      corporate-aesthetics.md
      rider-waite-recoloured.md
      recur.md
      ...
  content.config.ts      ← the schema both views read (Astro 5; v4 = src/content/config.ts)
  data/
    room.ts              ← placement layer: slug → where it sits. a VIEW, not truth.
    hiring.ts            ← the "start here" pointer. curation, not sorting.
  room/
    mountRoom.ts         ← three.js scene + the interaction/clickability plumbing
  pages/
    index.astro          ← renders the list (base) and mounts the room (enhancement)
    work/[slug].astro    ← the object page where each piece actually shines
```

---

## 1. The truth — one project schema

```ts
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title:  z.string(),
    blurb:  z.string(),                 // ← yours. the one-line label, in your voice.
    year:   z.number(),                 // list ordering + honesty about drift over time
    tags:   z.array(z.string()),        // ← yours. LOOSE filters, never hard categories.
    status: z.enum(['finished', 'wip', 'draft']).default('finished'),
    thumb:  image(),                    // list card + billboard fallback in the room
    links:  z.object({
      live:    z.string().url().optional(),
      source:  z.string().url().optional(),
      writeup: z.string().url().optional(),
    }).default({}),
    // what the object page should surface as the "shine". most pieces are just 'live'.
    // the surrogates (corporate aesthetics, recur) declare something richer than a screenshot.
    demo: z.object({
      kind: z.enum(['iframe', 'asciinema', 'images', 'diff', 'none']).default('none'),
      src:  z.string().optional(),
    }).default({ kind: 'none' }),
  }),
});

export const collections = { projects };
```

The **body** of each `.md` is your long-form writing for the object page — untouched
by any of this. Example entry:

```md
---
title: recur
blurb: a local-first journal that surfaces echoes between entries — write a thought, and if a word you've used before appears, it brings the older entry forward.
year: 2025
tags: [cli, python, memory, writing]
status: finished
thumb: ./thumbs/recur.png
demo: { kind: asciinema, src: /casts/recur.cast }   # an old entry resurfacing > any screenshot
links: { source: https://github.com/cabi-net/recur }
---

(your writing about recur goes here — this renders on /work/recur)
```

---

## 2. The room — a placement layer, not a second source of truth

```ts
// src/data/room.ts
import type { CollectionEntry } from 'astro:content';

export type ObjectKind =        // ← yours. one entry per model you build.
  | 'cabinet' | 'cassette' | 'crt' | 'deck' | 'notebook' | 'billboard';

export interface Placement {
  object: ObjectKind;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

// slug → where it sits. ANYTHING not listed auto-lands on the corkboard as a billboard.
export const room: Record<string, Placement> = {
  'corporate-aesthetics':   { object: 'cabinet',  position: [-3, 0, -2] }, // cabi-net, literally
  'rider-waite-recoloured': { object: 'deck',     position: [ 0, 1, -1] },
  'malware-buster':         { object: 'crt',      position: [ 2, 1, -2] },
  'recur':                  { object: 'notebook', position: [-1, 1,  0] },
  'beatbox':                { object: 'cassette',  position: [ 1, 1,  0] },
  // place the rest whenever. no rush — unplaced pieces still appear (see below).  ← yours
};

// the accretion valve: placed pieces get their object, everything else pins to the corkboard.
export function splitByPlacement(projects: CollectionEntry<'projects'>[]) {
  const placed: CollectionEntry<'projects'>[] = [];
  const unplaced: CollectionEntry<'projects'>[] = [];
  for (const p of projects) (room[p.id] ? placed : unplaced).push(p);
  return { placed, unplaced };
}
```

`unplaced` is your drop zone — new odds-and-ends and visual drafts show up as pinned
billboards without any modeling. That's also where `status: 'draft'` pieces can cluster
if you want the studio/workbench feeling to read spatially.

---

## 3. The "start here" pointer — curation, not sort order

```ts
// src/data/hiring.ts
// three hand-picked slugs. a design recruiter's 20-second path. no piece gets demoted;
// this just POINTS. a future piece never has to be adjudicated in or out.
export const hiringPicks = ['rider-waite-recoloured', 'loads-me-not', 'postcard']; // ← yours
```

---

## 4. The page — list is the base, room is the enhancement

```astro
---
// src/pages/index.astro
import { getCollection } from 'astro:content';
import { hiringPicks } from '../data/hiring';
const projects = (await getCollection('projects')).sort((a, b) => b.data.year - a.data.year);
const pick = (slug: string) => projects.find(p => p.id === slug)!;
---

<!-- BASE — always in the DOM. no-JS, mobile, crawlers, and screen readers all get this. -->
<main id="list">
  <nav aria-label="Start here">
    { hiringPicks.map(slug => <a href={`/work/${slug}`}>{pick(slug).data.title}</a>) }
  </nav>

  <ul class="grid">
    { projects.map(p => (
      <li data-status={p.data.status}>
        <a href={`/work/${p.id}`}>
          <img src={p.data.thumb.src} alt="" loading="lazy" />
          <h2>{p.data.title}</h2>
          <p>{p.data.blurb}</p>
        </a>
      </li>
    )) }
  </ul>
</main>

<!-- ENHANCEMENT — the room mounts here, only when it can. -->
<div id="room" hidden aria-hidden="true"></div>
<button id="view-toggle" hidden></button>

<script>
  import { mountRoom } from '../room/mountRoom';

  const small   = matchMedia('(max-width: 820px)').matches;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const webgl   = (() => { try { return !!document.createElement('canvas').getContext('webgl'); }
                           catch { return false; } })();
  const canRoom = webgl && !small;              // reduced-motion is still allowed — just calmer
  const wantsList = localStorage.getItem('view') === 'list';

  const list   = document.getElementById('list')!;
  const roomEl = document.getElementById('room')!;
  const toggle = document.getElementById('view-toggle') as HTMLButtonElement;
  let mounted = false;

  function toRoom() {
    if (!mounted) { mountRoom(roomEl, { reduced }); mounted = true; }
    roomEl.hidden = false; roomEl.setAttribute('aria-hidden', 'false');
    list.hidden = true;
    toggle.textContent = 'list view'; localStorage.setItem('view', 'room');
  }
  function toList() {
    roomEl.hidden = true; roomEl.setAttribute('aria-hidden', 'true');
    list.hidden = false;
    toggle.textContent = 'explore the room'; localStorage.setItem('view', 'list');
  }

  if (canRoom) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => (list.hidden ? toList() : toRoom()));
    (canRoom && !wantsList) ? toRoom() : toList();
  }
  // if !canRoom: script does nothing, list stays. graceful by default.
</script>
```

---

## 5. The clickability layer — "these objects are alive"

This is the part these sites usually get wrong. Two jobs: make links *findable* in 3D,
and make them *obviously* links. You model; the plumbing wires anything you tag.

```ts
// src/room/mountRoom.ts
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function mountRoom(container: HTMLElement, { reduced }: { reduced: boolean }) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 1.6, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);

  // ─── YOURS ─────────────────────────────────────────────────────────────────
  // build the shell, lights, furniture, and each project's mesh in here.
  // the ONE contract with the plumbing: tag every clickable mesh with its slug,
  // and push it into `interactive`. billboards from `unplaced` get built here too.
  //   mesh.userData.slug = 'recur';
  //   mesh.userData.baseY = mesh.position.y;
  //   mesh.userData.phase = Math.random() * Math.PI * 2;
  //   interactive.push(mesh);
  const interactive: THREE.Mesh[] = [];
  buildRoom(scene, interactive);   // ← your modeling + placement lives here
  // ─────────────────────────────────────────────────────────────────────────────

  // hover: glow + cursor + label (label text = the piece's blurb)
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hovered: THREE.Mesh | null = null;

  function setHover(mesh: THREE.Mesh | null) {
    if (hovered === mesh) return;
    if (hovered) (hovered.material as any).emissive?.setHex(hovered.userData._rest ?? 0x000000);
    hovered = mesh;
    if (mesh) {
      const m = mesh.material as any;
      mesh.userData._rest ??= m.emissive?.getHex() ?? 0x000000;
      m.emissive?.setHex(0x2a2a2a);
      renderer.domElement.style.cursor = 'pointer';
      showLabel(mesh.userData.slug);          // ← yours: how the blurb tooltip looks
    } else {
      renderer.domElement.style.cursor = 'grab';
      hideLabel();
    }
  }

  renderer.domElement.addEventListener('pointermove', (e) => {
    const r = renderer.domElement.getBoundingClientRect();
    pointer.x =  ((e.clientX - r.left) / r.width)  * 2 - 1;
    pointer.y = -((e.clientY - r.top)  / r.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(interactive, false)[0];
    setHover(hit ? (hit.object as THREE.Mesh) : null);
  });

  renderer.domElement.addEventListener('click', () => {
    if (hovered) location.href = `/work/${hovered.userData.slug}`;
  });

  // "these are alive", two ways:
  //  (a) a one-time glint pass on load so a visitor learns objects are links
  //  (b) a permanent gentle idle bob on interactive objects ONLY — so alive reads
  //      as different from the static furniture. both gated by reduced-motion.
  if (!reduced) wakeUp(interactive);          // ← yours: the load glint

  const clock = new THREE.Clock();
  (function loop() {
    if (!reduced) {
      const t = clock.getElapsedTime();
      for (const m of interactive)
        m.position.y = m.userData.baseY + Math.sin(t + m.userData.phase) * 0.03;
    }
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  })();

  addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
```

**Reduced-motion path:** no bob, no glint. Then the affordance load shifts onto the
things that don't move — hover glow, cursor change, and one persistent on-screen hint
line ("click the objects"). Keep that hint in the DOM, not the canvas.

**Accessibility path:** even in room view, drop a visually-hidden `<ul>` of the same
project links inside `#room`, and keep `#view-toggle` keyboard-focusable. Keyboard and
screen-reader users reach every piece via the list; the room is enrichment on top, never
the only door. That's the same principle as the recruiter skip — the room is the joy,
the list is the guarantee.

---

## Adding a new piece (the whole point)

1. Drop `src/content/projects/new-thing.md` — frontmatter + your writing.
   → it's in the list **instantly**: findable, accessible, mobile-safe. You can stop here.
2. *Optional:* model an object, add one line to `room.ts`. → it appears in the room.
3. *Skip step 2* and it auto-pins to the corkboard as a billboard from its `thumb`.
   → never adjudicated into a category, never breaks the taxonomy, because there isn't one.

The affinity you noticed (recur ↔ corporate aesthetics, the interfaces cluster) doesn't
live in folders — it lives in *proximity*. Sit them near each other on the desk and the
rhyme is there, with nothing to maintain and nothing a future piece can fail to join.