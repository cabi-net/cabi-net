/**
 * Render a .glb to a static 16:10 PNG for use as a tile thumbnail.
 *
 *   node scripts/render-glb.mjs "public/assets/thumbs/Retro Pc.glb" out.png
 *   node scripts/render-glb.mjs in.glb out.png --yaw 35 --pitch 15
 *
 * Uses the Playwright chromium already installed for shoot-thumbs.mjs, driving
 * three.js from a CDN inside the page. Nothing is added to the site bundle —
 * the committed PNG is all the site ever loads.
 */
import { chromium } from 'playwright';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const [, , input, output, ...rest] = process.argv;
if (!input || !output) {
  console.error('usage: node scripts/render-glb.mjs <in.glb> <out.png> [--yaw N] [--pitch N]');
  process.exit(1);
}

const arg = (name, fallback) => {
  const i = rest.indexOf(`--${name}`);
  return i === -1 ? fallback : Number(rest[i + 1]);
};
const yaw = arg('yaw', 35);
const pitch = arg('pitch', 18);

const W = 1440;
const H = 900; // 16:10, matching .tile-thumb

const glbBase64 = (await readFile(input)).toString('base64');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });

page.on('console', (m) => m.type() === 'error' && console.error(`  page: ${m.text()}`));

await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent">
<script type="importmap">
{"imports":{"three":"https://unpkg.com/three@0.160.0/build/three.module.js",
"three/addons/":"https://unpkg.com/three@0.160.0/examples/jsm/"}}
</script>
<script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(${W}, ${H});
renderer.setPixelRatio(2);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// soft three-point-ish lighting so the model reads without blowing out textures
scene.add(new THREE.AmbientLight(0xffffff, 1.5));
const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 5, 4); scene.add(key);
const fill = new THREE.DirectionalLight(0xffffff, 0.8); fill.position.set(-4, 2, -3); scene.add(fill);

const bin = Uint8Array.from(atob("${glbBase64}"), c => c.charCodeAt(0));
const url = URL.createObjectURL(new Blob([bin], { type: 'model/gltf-binary' }));

new GLTFLoader().load(url, (gltf) => {
  const model = gltf.scene;

  // Scale to a unit box, then re-measure and centre. Some of these models have
  // geometry offset far from their own origin, so centring before scaling (or
  // trusting the first box) leaves the subject off-frame.
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  model.scale.setScalar(1 / maxDim);

  const wrap = new THREE.Group();
  wrap.add(model);
  const box2 = new THREE.Box3().setFromObject(wrap);
  const centre2 = box2.getCenter(new THREE.Vector3());
  model.position.sub(centre2);
  scene.add(wrap);

  const camera = new THREE.PerspectiveCamera(30, ${W} / ${H}, 0.01, 100);
  const y = ${yaw} * Math.PI / 180, p = ${pitch} * Math.PI / 180, d = 2.6;
  camera.position.set(Math.sin(y) * Math.cos(p) * d, Math.sin(p) * d, Math.cos(y) * Math.cos(p) * d);
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
  window.__done = true;
}, undefined, (e) => { window.__error = String(e); });
</script></body></html>`);

try {
  await page.waitForFunction('window.__done || window.__error', { timeout: 60_000 });
  const err = await page.evaluate('window.__error');
  if (err) throw new Error(err);
  await mkdir(path.dirname(output), { recursive: true });
  await page.locator('canvas').screenshot({ path: output, omitBackground: true });
  console.log(`  ok  ${path.basename(input)} -> ${output}`);
} catch (e) {
  console.error(`  FAIL ${path.basename(input)}: ${e.message.split('\n')[0]}`);
  process.exitCode = 1;
} finally {
  await browser.close();
}
