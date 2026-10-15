import { THREE, setSeed, bake, ease, lerp, DBG } from './kit.js';
/* debug: report pairs of props whose bounding boxes overlap substantially (run with ?debug) */
function overlapReport(S) {
  const items = []; const b = new THREE.Box3(), sz = new THREE.Vector3(), c = new THREE.Vector3(), vb = new THREE.Box3();
  const boxOf = (o) => { b.makeEmpty(); o.updateWorldMatrix(true, true); o.traverse((m) => { if (!m.isMesh || m.isInstancedMesh || !m.geometry) return; if (!m.geometry.boundingBox) m.geometry.computeBoundingBox(); vb.copy(m.geometry.boundingBox).applyMatrix4(m.matrixWorld); b.union(vb); }); return b; };
  for (const o of S.static.children) {
    if (o.isPoints || o.isLine || o.isSprite || o.userData.ground) continue;
    boxOf(o); if (b.isEmpty()) continue; b.getSize(sz); b.getCenter(c);
    if (sz.x > 9 || sz.z > 9 || sz.y < .12 || c.y < 0) continue;
    items.push({ o, box: b.clone(), vol: Math.max(1e-6, sz.x * sz.y * sz.z), name: `${o.name || o.type}@(${c.x.toFixed(1)},${c.z.toFixed(1)}) ${sz.x.toFixed(1)}x${sz.y.toFixed(1)}x${sz.z.toFixed(1)}` });
  }
  const out = []; const ib = new THREE.Box3(), is = new THREE.Vector3();
  for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
    const A = items[i], B = items[j]; if (!A.box.intersectsBox(B.box)) continue;
    ib.copy(A.box).intersect(B.box); ib.getSize(is); const v = is.x * is.y * is.z; const r = v / Math.min(A.vol, B.vol);
    const small = Math.min(A.vol, B.vol); if ((r > .35 && small > .02) || (r > .2 && v > .05)) out.push({ r: +r.toFixed(2), a: A.name, b: B.name });
  }
  out.sort((x, y) => y.r - x.r); return out;
}
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { Crowd, uTime } from './people.js';
import kadikoy from './scenes/kadikoy.js';
import galata from './scenes/galata.js';
import gece from './scenes/gece.js';
import kapadokya from './scenes/kapadokya.js';
import bursa from './scenes/bursa.js';
import ramazan from './scenes/ramazan.js';

const DEFS = [kadikoy, galata, gece, kapadokya, bursa, ramazan];
const DEG = Math.PI / 180;
const canvas = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x000000, 0);
const effect = new OutlineEffect(renderer, { defaultThickness: 0.0030, defaultColor: [0.14, 0.1, 0.14] });
const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0xffffff, 60, 140);
const camera = new THREE.PerspectiveCamera(36, innerWidth / innerHeight, 0.1, 420);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; controls.dampingFactor = .08; controls.maxPolarAngle = 86 * DEG; controls.minDistance = 3; controls.maxDistance = 80;

const SC = DEFS.map((d) => ({ def: d, built: null }));
function build(i) {
  const e = SC[i]; if (e.built) return e.built;
  const d = e.def; setSeed(d.seed || i * 7 + 3);
  const S = { ...d, group: new THREE.Group(), updates: [], lights: 0 };
  S.static = new THREE.Group(); S.group.add(S.static);
  S.crowd = new Crowd(S.group, d.crowdCap || 48);
  S.group.visible = false; scene.add(S.group);
  d.build(S);
  if (DBG) S.overlaps = overlapReport(S);
  S.verts = bake(S.static, S.group);
  S.crowd.update(0, 0);
  e.built = S; return S;
}

/* ---------------- UI */
const fade = document.getElementById('fade'), sky = document.getElementById('sky'), card = document.getElementById('card'), rail = document.getElementById('rail');
SC.forEach((e, i) => { const b = document.createElement('button'); b.type = 'button'; b.innerHTML = `<span class="n">0${i + 1}</span>${e.def.chip}<span class="bar"><b></b></span>`; b.addEventListener('click', () => go(i)); rail.appendChild(b); e.btn = b; });
let halted = false, camHold = false, cur = -1, sceneT = 0, worldT = 0, paused = false, free = false, switching = false;
const dur = (S) => S.shots.reduce((a, s) => a + s.d, 0);
function applyScene(i) {
  const S = build(i);
  if (cur >= 0) { const P = SC[cur].built; P.group.visible = false; P.onExit && P.onExit(); SC[cur].btn.setAttribute('aria-current', 'false'); }
  cur = i; S.group.visible = true; SC[i].btn.setAttribute('aria-current', 'true');
  sky.style.background = S.sky; scene.fog.color.set(S.fog[0]); scene.fog.near = S.fog[1]; scene.fog.far = S.fog[2];
  document.getElementById('c-eye').textContent = `0${i + 1} / 0${SC.length} · ${S.chip}`;
  document.getElementById('c-title').textContent = S.title; document.getElementById('c-sub').textContent = S.sub; document.getElementById('c-meta').textContent = S.meta;
  sceneT = 0; placeCam(S, 0);
  try { history.replaceState(null, '', '#s' + (i + 1)); } catch (e) { }
}
function go(i) {
  if (switching) return; i = (i + SC.length) % SC.length; switching = true; card.classList.add('out'); fade.style.opacity = 1;
  setTimeout(() => { applyScene(i); requestAnimationFrame(() => { fade.style.opacity = 0; setTimeout(() => card.classList.remove('out'), 250); switching = false; }); }, 760);
}
const _tg = new THREE.Vector3();
function placeCam(S, t) {
  let acc = 0, sh = S.shots[0], k = 0;
  for (const s of S.shots) { if (t < acc + s.d) { sh = s; k = (t - acc) / s.d; break; } acc += s.d; sh = s; k = 1; }
  const a = lerp(sh.a[0], sh.a[1], k) * DEG, el = lerp(sh.e[0], sh.e[1], k) * DEG, r = lerp(sh.r[0], sh.r[1], k);
  const t0 = sh.t[0], t1 = sh.t[1] || sh.t[0], ke = ease(k); _tg.set(lerp(t0[0], t1[0], ke), lerp(t0[1], t1[1], ke), lerp(t0[2], t1[2], ke));
  const asp = camera.aspect; const r2 = r * (asp < 1 ? 1 + (1 - asp) * 1.1 : 1);
  camera.position.set(_tg.x + Math.sin(a) * Math.cos(el) * r2, _tg.y + Math.sin(el) * r2, _tg.z + Math.cos(a) * Math.cos(el) * r2);
  camera.lookAt(_tg); controls.target.copy(_tg);
}
const bPlay = document.getElementById('b-play'), bCam = document.getElementById('b-cam'), hint = document.getElementById('hint');
function setPaused(v) { paused = v; bPlay.setAttribute('aria-pressed', String(v)); document.getElementById('l-play').textContent = v ? 'Oynat' : 'Duraklat'; document.getElementById('i-play').innerHTML = v ? '<path d="M7 5l12 7-12 7z"/>' : '<path d="M8 5v14M16 5v14"/>'; }
function setFree(v) { free = v; bCam.setAttribute('aria-pressed', String(v)); document.getElementById('l-cam').textContent = v ? 'Sinematik' : 'Serbest kamera'; hint.style.opacity = v ? 1 : .55; }
bPlay.addEventListener('click', () => setPaused(!paused));
bCam.addEventListener('click', () => setFree(!free));
document.getElementById('b-full').addEventListener('click', () => { try { if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => { }); else document.exitFullscreen(); } catch (e) { } });
controls.addEventListener('start', () => { if (!free) setFree(true); });
addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') go(cur + 1); else if (e.key === 'ArrowLeft') go(cur - 1); else if (e.key === ' ') { e.preventDefault(); setPaused(!paused); } else if (e.key.toLowerCase() === 'c') setFree(!free); else if (e.key.toLowerCase() === 'f') document.getElementById('b-full').click(); });
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.fov = camera.aspect < 1 ? 46 : 36; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
dispatchEvent(new Event('resize'));
setPaused(false); setFree(false);

const startIdx = Math.max(0, Math.min(SC.length - 1, (+((location.hash.match(/^#s(\d)$/) || [])[1] || 1)) - 1));
const lm = document.getElementById('load-msg'); if (lm) lm.textContent = `${SC[startIdx].def.title} kuruluyor…`;
try { await Promise.race([Promise.all([document.fonts.load('900 64px Figtree', 'ŞİĞÜÖÇ AZ'), document.fonts.load('700 22px Figtree', 'ŞİĞ'), document.fonts.load('400 64px "DM Serif Display"', 'ÇAY')]), new Promise((r) => setTimeout(r, 2500))]); } catch (e) { }
await new Promise((r) => setTimeout(r, 30));
applyScene(startIdx);
effect.render(scene, camera);
document.getElementById('loader').style.opacity = 0; setTimeout(() => document.getElementById('loader')?.remove(), 700);
fade.style.opacity = 0; setTimeout(() => card.classList.remove('out'), 300);
// build the rest in the background, one per idle slot, warming shaders as we go
let bi = 0; const order = SC.map((_, i) => (startIdx + 1 + i) % SC.length).filter((i) => i !== startIdx);
function bgBuild() { if (halted) return setTimeout(bgBuild, 500); if (bi >= order.length) return; const i = order[bi++]; const S = build(i); const vis = S.group.visible; S.group.visible = true; renderer.compile(scene, camera); S.group.visible = vis; setTimeout(bgBuild, 120); }
setTimeout(bgBuild, 900);

const clock = new THREE.Clock();
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
function frame() {
  requestAnimationFrame(frame);
  if (halted) return;
  const dt = Math.min(clock.getDelta(), .05);
  const S = SC[cur].built;
  if (!paused) { worldT += dt; uTime.value = worldT; for (const u of S.updates) u(worldT, dt); S.crowd.update(worldT, dt); }
  if (camHold) { } else if (!free) { if (!paused) sceneT += dt * (reduce ? .5 : 1); const D = dur(S); if (sceneT >= D && !switching) { go(cur + 1); sceneT = D - .001; } placeCam(S, Math.min(sceneT, D - .001)); }
  else controls.update();
  SC[cur].btn.querySelector('b').style.width = free ? '100%' : (Math.min(1, sceneT / dur(S)) * 100).toFixed(1) + '%';
  effect.render(scene, camera);
}
frame();
window.__dio = {
  hold: (v) => { camHold = v; halted = v; }, go, apply: (i) => applyScene(i), setFree, setPaused, get cur() { return cur; }, SC,
  shot: (i, t, wt = 12) => { applyScene(i); const S = SC[i].built; worldT = wt; uTime.value = wt; for (let k = 0; k < 3; k++) { for (const u of S.updates) u(wt + k * .016, .016); S.crowd.update(wt + k * .016, .016); } placeCam(S, t); effect.render(scene, camera); },
  cam: (pos, tgt) => { camera.position.set(...pos); camera.lookAt(...tgt); effect.render(scene, camera); },
  overlaps: (i) => (SC[i ?? cur].built || build(i)).overlaps,
  soak: (sec) => { const S = SC[cur].built; const n = Math.round(sec / .05); for (let k = 0; k < n; k++) { worldT += .05; uTime.value = worldT; for (const u of S.updates) u(worldT, .05); S.crowd.update(worldT, .05); } const ag = S.crowd.agents; let stuck = 0, minD = 9; for (let i = 0; i < ag.length; i++) { const a = ag[i]; if (a.path && !a.attach && a.vel < .05 && a.path.wait <= 0 && !a.path.until) stuck++; for (let j = i + 1; j < ag.length; j++) { const b = ag[j]; if (a.attach || b.attach || Math.abs(a.pos.y - b.pos.y) > .5) continue; const d = Math.hypot(a.fx - b.fx, a.fz - b.fz); if (d < minD) minD = d; } } return { agents: ag.length, stuck, minD: +minD.toFixed(2) }; },
  stats: () => { const S = SC[cur].built; let meshes = 0; S.group.traverse((o) => { if (o.isMesh) meshes++; }); return { meshes, verts: S.verts, calls: renderer.info.render.calls, tris: renderer.info.render.triangles }; },
};
