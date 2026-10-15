// Core helpers: seeded random, materials, primitive builders, textures, static baking.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
export { THREE };

export const DEG = Math.PI / 180, TAU = Math.PI * 2;
export function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let _r = rng(1);
export const setSeed = (s) => { _r = rng(s); };
export const R = () => _r();
export const rr = (a, b) => a + (b - a) * _r();
export const ri = (a, b) => Math.floor(rr(a, b + 1));
export const pick = (a) => a[Math.floor(_r() * a.length)];
export const chance = (p) => _r() < p;
export const lerp = (a, b, k) => a + (b - a) * k;
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const ease = (k) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(k, 0, 1));
export const smooth = (a, b, v) => { const k = clamp((v - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
export const V = (x, y, z) => new THREE.Vector3(x, y, z);

/* ---------------- materials */
export const gradMap = (() => { const t = new THREE.DataTexture(new Uint8Array([96, 168, 222, 255]), 4, 1, THREE.RedFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
const _m = new Map();
export function M(c) { const k = 't' + c; let m = _m.get(k); if (!m) { m = new THREE.MeshToonMaterial({ color: c, gradientMap: gradMap }); m.userData.solid = true; _m.set(k, m); } return m; }
export function E(c) { const k = 'e' + c; let m = _m.get(k); if (!m) { m = new THREE.MeshBasicMaterial({ color: c }); m.userData.solid = true; m.userData.basic = true; _m.set(k, m); } return m; }
/** solid colour that is never outlined (tiny details) */
export function N(c) { const k = 'n' + c; let m = _m.get(k); if (!m) { m = new THREE.MeshToonMaterial({ color: c, gradientMap: gradMap }); m.userData.solid = true; noOL(m); _m.set(k, m); } return m; }
export function EN(c) { const k = 'en' + c; let m = _m.get(k); if (!m) { m = new THREE.MeshBasicMaterial({ color: c }); m.userData.solid = true; m.userData.basic = true; noOL(m); _m.set(k, m); } return m; }
export const mat = (c) => (c && c.isMaterial) ? c : M(c);
export function noOL(m) { m.userData.outlineParameters = { visible: false }; return m; }
export const TOONV = new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: gradMap });
export const TOONVX = noOL(new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: gradMap }));
export const BASICV = new THREE.MeshBasicMaterial({ vertexColors: true });
export const BASICVX = noOL(new THREE.MeshBasicMaterial({ vertexColors: true }));

/* ---------------- geometry */
export const UB = new THREE.BoxGeometry(1, 1, 1);
const _g = new Map();
export const cg = (k, f) => { let g = _g.get(k); if (!g) { g = f(); _g.set(k, g); } return g; };
export const SPH = new THREE.IcosahedronGeometry(1, 1);
export const SPH2 = new THREE.SphereGeometry(1, 14, 10);
export const PLANE = new THREE.PlaneGeometry(1, 1);
export function mesh(geo, m, p, x = 0, y = 0, z = 0) { const o = new THREE.Mesh(geo, mat(m)); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; p.add(o); return o; }
/** box with bottom at y */
export function box(p, w, h, d, c, x = 0, y = 0, z = 0, ry = 0) { const o = mesh(UB, c, p, x, y + h / 2, z); o.scale.set(w, h, d); if (ry) o.rotation.y = ry; return o; }
/** box spanning two corners (min/max), y bottom */
export function cyl(p, rt, rb, h, c, x = 0, y = 0, z = 0, seg = 12) { const g = cg(`c${rt}_${rb}_${seg}`, () => new THREE.CylinderGeometry(rt, rb, 1, seg)); const o = mesh(g, c, p, x, y + h / 2, z); o.scale.y = h; return o; }
/** cylinder between two points */
export function rod(p, a, b, r, c, seg = 6) { const g = cg(`rod${seg}`, () => new THREE.CylinderGeometry(1, 1, 1, seg)); const d = new THREE.Vector3().subVectors(b, a); const L = d.length(); const o = mesh(g, c, p); o.position.copy(a).addScaledVector(d, .5); o.scale.set(r, L, r); o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); return o; }
export function blob(p, r, c, x, y, z, hi = false) { const o = mesh(hi ? SPH2 : SPH, c, p, x, y, z); o.scale.setScalar(r); return o; }
export function ell(p, rx, ry, rz, c, x, y, z, hi = true) { const o = mesh(hi ? SPH2 : SPH, c, p, x, y, z); o.scale.set(rx, ry, rz); return o; }
export function dome(p, r, c, x, y, z, seg = 18, sy = 1) { const g = cg('dome' + seg, () => new THREE.SphereGeometry(1, seg, Math.max(5, seg / 2 | 0), 0, TAU, 0, Math.PI / 2)); const o = mesh(g, c, p, x, y, z); o.scale.set(r, r * sy, r); return o; }
export function cone(p, r, h, c, x, y, z, seg = 12) { const g = cg('cone' + seg, () => { const q = new THREE.ConeGeometry(1, 1, seg); q.translate(0, .5, 0); return q; }); const o = mesh(g, c, p, x, y, z); o.scale.set(r, h, r); return o; }
export function hipRoof(p, w, d, h, c, x, y, z, ry = 0) { const g = cg('hip', () => { const q = new THREE.ConeGeometry(1, 1, 4); q.rotateY(Math.PI / 4); q.translate(0, .5, 0); return q; }); const o = mesh(g, c, p, x, y, z); o.scale.set(w / 1.414, h, d / 1.414); o.rotation.y = ry; return o; }
/** proper hip roof with ridge (w > d) */
export function ridgeRoof(p, w, d, h, c, x, y, z, ry = 0) {
  if (d > w) { const t = w; w = d; d = t; ry += Math.PI / 2; }
  // ridge spans w - d so hips are at 45° in plan
  const geo = cg(`ridge_${(w / d).toFixed(2)}`, () => { const k = Math.max(0, .5 - (d / w) * .5); const P = [[-.5, 0, -.5], [.5, 0, -.5], [.5, 0, .5], [-.5, 0, .5]]; const A = [-k, 1, 0], B = [k, 1, 0]; const v = [...P[0], ...B, ...P[1], ...P[0], ...A, ...B, ...P[2], ...A, ...P[3], ...P[2], ...B, ...A, ...P[1], ...B, ...P[2], ...P[3], ...A, ...P[0]]; const q = new THREE.BufferGeometry(); q.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); q.computeVertexNormals(); return q; });
  const o = mesh(geo, c, p, x, y, z); o.scale.set(w, h, d); o.rotation.y = ry; return o;
}
export function gable(p, w, d, h, c, x, y, z, ry = 0) { const g = cg('gab', () => { const s = new THREE.Shape(); s.moveTo(-.5, 0); s.lineTo(.5, 0); s.lineTo(0, 1); s.lineTo(-.5, 0); const q = new THREE.ExtrudeGeometry(s, { depth: 1, bevelEnabled: false }); q.translate(0, 0, -.5); return q; }); const o = mesh(g, c, p, x, y, z); o.scale.set(w, h, d); o.rotation.y = ry; return o; }
/** half-cylinder arch top (for arched windows/doors), facing +z, bottom at y */
export function archTop(p, w, d, c, x, y, z, ry = 0) { const g = cg('arch', () => { const q = new THREE.CylinderGeometry(.5, .5, 1, 12, 1, false, 0, Math.PI); q.rotateZ(Math.PI / 2); q.rotateY(Math.PI / 2); return q; }); const o = mesh(g, c, p, x, y, z); o.scale.set(w, w, d); o.rotation.y = ry; return o; }
/** arched opening: rect + semicircle, total height h */
export function archWin(p, w, h, d, c, x, y, z, ry = 0) { const q = new THREE.Group(); q.position.set(x, y, z); q.rotation.y = ry; p.add(q); box(q, w, h - w / 2, d, c, 0, 0, 0); const a = archTop(q, w, d, c, 0, h - w / 2, 0); a.rotation.y = 0; return q; }
export function lathe(p, prof, c, x, y, z, seg = 14) { const g = new THREE.LatheGeometry(prof.map(([a, b]) => new THREE.Vector2(a, b)), seg); return mesh(g, c, p, x, y, z); }
export function line(p, pts, color = '#2a2530', op = 1) { const g = new THREE.BufferGeometry().setFromPoints(pts); const m = new THREE.LineBasicMaterial({ color, transparent: op < 1, opacity: op }); const l = new THREE.Line(g, m); p.add(l); return l; }
export function sag(a, b, s = .4, n = 14) { const pts = []; for (let i = 0; i <= n; i++) { const k = i / n; pts.push(new THREE.Vector3(lerp(a.x, b.x, k), lerp(a.y, b.y, k) - Math.sin(Math.PI * k) * s, lerp(a.z, b.z, k))); } return pts; }
export function group(p, x = 0, y = 0, z = 0, ry = 0, s = 1) { const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; if (s !== 1) g.scale.setScalar(s); p.add(g); return g; }

/* ---------------- textures */
export function ctex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
export const glowTex = ctex(128, 128, (g) => { const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.18, 'rgba(255,255,255,.7)'); r.addColorStop(.45, 'rgba(255,255,255,.18)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); });
export const dotTex = ctex(64, 64, (g) => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.5, 'rgba(255,255,255,.8)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); });
export const petalTex = ctex(64, 64, (g) => { g.fillStyle = '#fff'; g.beginPath(); g.ellipse(32, 32, 26, 15, .6, 0, TAU); g.fill(); });
export function glow(p, x, y, z, s, color, op = 1) { const m = new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }); const sp = new THREE.Sprite(m); sp.position.set(x, y, z); sp.scale.set(s, s, 1); p.add(sp); return sp; }
const _t = new Map();
export function signTex(text, o = {}) {
  const key = JSON.stringify([text, o]); if (_t.has(key)) return _t.get(key);
  const h = 128, w = Math.min(1024, Math.max(64, Math.round(h * (o.ratio || 4))));
  const t = ctex(w, h, (g) => {
    g.fillStyle = o.bg || '#fff'; g.fillRect(0, 0, w, h);
    if (o.border) { g.strokeStyle = o.border; g.lineWidth = 7; g.strokeRect(9, 9, w - 18, h - 18); }
    g.fillStyle = o.fg || '#111'; g.textAlign = 'center'; g.textBaseline = 'middle';
    let fs = o.size || (o.sub ? 56 : 72); const fam = o.serif ? '"DM Serif Display", Georgia, serif' : 'Figtree, system-ui, sans-serif';
    const wt = o.serif ? 400 : (o.weight || 900);
    const setF = () => g.font = `${o.italic ? 'italic ' : ''}${wt} ${fs}px ${fam}`; setF();
    while (g.measureText(text).width > w * .88 && fs > 10) { fs -= 2; setF(); }
    g.fillText(text, w / 2, o.sub ? h * .4 : h * .54);
    if (o.sub) { g.fillStyle = o.subfg || g.fillStyle; let s = 22; g.font = `700 ${s}px Figtree, sans-serif`; while (g.measureText(o.sub).width > w * .9 && s > 8) { s--; g.font = `700 ${s}px Figtree, sans-serif`; } g.fillText(o.sub, w / 2, h * .8); }
  });
  _t.set(key, t); return t;
}
export function texMat(t, lit = false, opts = {}) { const m = lit ? new THREE.MeshBasicMaterial({ map: t, ...opts }) : new THREE.MeshToonMaterial({ map: t, gradientMap: gradMap, ...opts }); return noOL(m); }
/** sign facing +z, centred at (x,y,z) */
export function sign(p, text, w, h, o, x, y, z, ry = 0, lit = false, board = '#2a2a2a') {
  const t = signTex(text, { ...o, ratio: w / h });
  const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; p.add(g);
  if (board) box(g, w + .06, h + .06, .05, board, 0, -h / 2 - .03, -.03);
  const s = new THREE.Mesh(PLANE, texMat(t, lit)); s.scale.set(w, h, 1); s.position.z = .001; g.add(s);
  return g;
}
export function decal(p, t, w, h, x, y, z, rx = -Math.PI / 2, ry = 0, lit = false, opts = {}) { const s = new THREE.Mesh(PLANE, texMat(t, lit, opts)); s.scale.set(w, h, 1); s.position.set(x, y, z); s.rotation.set(rx, ry, 0, 'YXZ'); s.receiveShadow = true; p.add(s); return s; }
export function stripeTex(c1, c2, n = 8, vertical = true) { return ctex(128, 128, (g) => { for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? c2 : c1; if (vertical) g.fillRect(i * 128 / n, 0, 128 / n + 1, 128); else g.fillRect(0, i * 128 / n, 128, 128 / n + 1); } }); }
export const flagTex = ctex(300, 200, (g, w, h) => {
  g.fillStyle = '#E30A17'; g.fillRect(0, 0, w, h);
  const G = h; g.fillStyle = '#fff'; g.beginPath(); g.arc(.5 * G, h / 2, .25 * G, 0, TAU); g.fill();
  g.fillStyle = '#E30A17'; g.beginPath(); g.arc(.5625 * G, h / 2, .2 * G, 0, TAU); g.fill();
  const cx = 1.0 * G, cy = h / 2, ro = .125 * G, ri = ro * .382; g.fillStyle = '#fff'; g.beginPath();
  for (let i = 0; i < 10; i++) { const a = Math.PI + i * Math.PI / 5; const r = i % 2 ? ri : ro; g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
  g.closePath(); g.fill();
});
export function tileTex(base, line, cols = 8, rows = 8, jitter = 10) { return ctex(256, 256, (g) => { g.fillStyle = line; g.fillRect(0, 0, 256, 256); const cw = 256 / cols, rh = 256 / rows; for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) { const c = new THREE.Color(base); const hsl = {}; c.getHSL(hsl); c.setHSL(hsl.h, hsl.s, clamp(hsl.l + (Math.random() - .5) * jitter / 100, 0, 1)); g.fillStyle = '#' + c.getHexString(); g.fillRect(x * cw + (y % 2) * cw / 2 + 1.5, y * rh + 1.5, cw - 3, rh - 3); g.fillRect(x * cw + (y % 2) * cw / 2 + 1.5 - 256, y * rh + 1.5, cw - 3, rh - 3); } }); }

/* ---------------- static baking: merge every solid-colour mesh under root into a few vertex-coloured meshes */
const _tm = new THREE.Matrix4();
export function bake(root, target) {
  root.updateMatrixWorld(true); target.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(target.matrixWorld).invert();
  const buckets = new Map(), rm = [];
  root.traverse((o) => {
    if (!o.isMesh || o.isInstancedMesh || o.userData.keep) return;
    const m = o.material; if (Array.isArray(m) || !m.userData.solid) return;
    const src = o.geometry; const g = src.index ? src.toNonIndexed() : src;
    const ng = new THREE.BufferGeometry();
    ng.setAttribute('position', g.attributes.position.clone()); ng.setAttribute('normal', g.attributes.normal.clone());
    _tm.multiplyMatrices(inv, o.matrixWorld); ng.applyMatrix4(_tm);
    if (_tm.determinant() < 0) { const p = ng.attributes.position.array; for (let i = 0; i < p.length; i += 9) for (let k = 0; k < 3; k++) { const t = p[i + 3 + k]; p[i + 3 + k] = p[i + 6 + k]; p[i + 6 + k] = t; } }
    const n = ng.attributes.position.count, col = new Float32Array(n * 3), c = m.color;
    for (let i = 0; i < n; i++) { col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
    ng.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const ol = !(m.userData.outlineParameters && m.userData.outlineParameters.visible === false);
    const key = (m.userData.basic ? 'b' : 't') + (o.castShadow ? 's' : 'n') + (ol ? 'o' : 'x');
    if (!buckets.has(key)) buckets.set(key, []); buckets.get(key).push(ng); rm.push(o);
  });
  for (const o of rm) o.parent.remove(o);
  let verts = 0;
  for (const [key, list] of buckets) {
    let chunk = [], cnt = 0;
    const flush = () => { if (!chunk.length) return; const g = mergeGeometries(chunk, false); const mm = key[0] === 'b' ? (key[2] === 'o' ? BASICV : BASICVX) : (key[2] === 'o' ? TOONV : TOONVX); const me = new THREE.Mesh(g, mm); me.castShadow = key[1] === 's'; me.receiveShadow = key[0] !== 'b'; me.matrixAutoUpdate = false; target.add(me); verts += cnt; chunk = []; cnt = 0; };
    for (const g of list) { chunk.push(g); cnt += g.attributes.position.count; if (cnt > 250000) flush(); }
    flush();
  }
  // drop empty groups left behind
  return verts;
}
