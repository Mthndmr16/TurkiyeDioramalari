// Moving things: vehicles, boats, birds, flags, particles, water, sky bits.
import { THREE, TAU, R, rr, pick, chance, lerp, clamp, ease, smooth, V, M, E, N, EN, noOL, box, cyl, rod, blob, ell, dome, cone, line, sag, group, sign, texMat, stripeTex, glow, flagTex, ctex, dotTex, petalTex, glowTex, gradMap, UB, PLANE, cg, mesh, SPH } from './kit.js';
import { shade } from './props.js';

export const WIN_GLASS = noOL(new THREE.MeshToonMaterial({ color: '#b9d4e2', transparent: true, opacity: .3, depthWrite: false, gradientMap: gradMap }));
export const WIN_GLASS_N = noOL(new THREE.MeshBasicMaterial({ color: '#ffe6b0', transparent: true, opacity: .55, depthWrite: false }));

export function flag(S, p, x, y, z, w = 1.0, ry = 0, pole = true, ph = R() * 10) {
  const g = group(p, x, y, z, ry);
  if (pole) { cyl(g, .03, .04, w * 2.2, '#d9d9d9', 0, -w * 2.2, 0, 8); blob(g, .05, '#d9b552', 0, .04, 0, true); }
  const geo = new THREE.PlaneGeometry(w, w / 1.5, 12, 6); geo.translate(w / 2, -w / 3, 0);
  const m = noOL(new THREE.MeshToonMaterial({ map: flagTex, gradientMap: gradMap, side: THREE.DoubleSide }));
  const f = new THREE.Mesh(geo, m); f.castShadow = true; g.add(f);
  const pos = geo.attributes.position, b0 = pos.array.slice();
  S.updates.push((t) => { for (let i = 0; i < pos.count; i++) { const bx = b0[i * 3], k = bx / w; pos.array[i * 3 + 2] = Math.sin(bx * 4 - t * 5 + ph) * .09 * k + Math.sin(b0[i * 3 + 1] * 3 + t * 3) * .03 * k; pos.array[i * 3 + 1] = b0[i * 3 + 1] - k * k * .05; } pos.needsUpdate = true; geo.computeVertexNormals(); });
  return g;
}
export function bunting(S, p, a, b, n = 14, s = .4, cols = ['#e30a17', '#ffffff']) {
  const pts = sag(a, b, s, n); line(p, pts, '#444');
  const tri = cg('pennant', () => { const q = new THREE.BufferGeometry(); q.setAttribute('position', new THREE.Float32BufferAttribute([-.08, 0, 0, .08, 0, 0, 0, -.18, 0], 3)); q.computeVertexNormals(); return q; });
  for (let i = 1; i < pts.length - 1; i++) { const m = new THREE.Mesh(tri, noOL(new THREE.MeshToonMaterial({ color: cols[i % cols.length], side: THREE.DoubleSide, gradientMap: gradMap }))); m.position.copy(pts[i]); m.lookAt(pts[i].x + (b.z - a.z), pts[i].y, pts[i].z - (b.x - a.x)); p.add(m); const ph = i * .7; S.updates.push((t) => { m.rotation.x = Math.sin(t * 2.5 + ph) * .25; }); }
}
export function bird(p, { body = '#f6f6f4', wing = '#b9c2cc', s = 1 } = {}) {
  const g = group(p); const b = ell(g, .1 * s, .09 * s, .26 * s, body, 0, 0, 0); b.castShadow = false;
  blob(g, .075 * s, body, 0, .05 * s, .2 * s, true).castShadow = false; box(g, .03 * s, .03 * s, .08 * s, '#e8a531', 0, .03 * s, .3 * s).castShadow = false;
  const wl = group(g), wr = group(g);
  box(wl, .42 * s, .02 * s, .16 * s, wing, -.24 * s, 0, 0).castShadow = false; box(wr, .42 * s, .02 * s, .16 * s, wing, .24 * s, 0, 0).castShadow = false;
  return { g, wl, wr };
}
export function gulls(S, p, n, cx, cy, cz, rmin = 3, rmax = 7, opts) {
  const nx = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    const b = bird(p, opts); const r = rr(rmin, rmax), w = rr(.22, .45) * (chance(.5) ? -1 : 1), ph = R() * TAU, h = cy + rr(-1, 2), fl = rr(7, 10);
    S.updates.push((t) => { const a = ph + t * w; b.g.position.set(cx + Math.cos(a) * r, h + Math.sin(t * .7 + ph) * .5, cz + Math.sin(a) * r); const a2 = a + .1 * Math.sign(w); nx.set(cx + Math.cos(a2) * r, h + Math.sin((t + .1) * .7 + ph) * .5, cz + Math.sin(a2) * r); b.g.lookAt(nx); b.g.rotateZ(-.35 * Math.sign(w)); const f = Math.sin(t * fl + ph) * .55 * (.6 + .4 * Math.sin(t * .5 + ph)); b.wl.rotation.z = f; b.wr.rotation.z = -f; });
  }
}
/** pigeons that peck on the ground and periodically take off around a centre */
export function pigeons(S, p, n, cx, cz, rad, area, h = 5, cyc = 22, y0 = 0, gx = null, gz = null) {
  const ps = []; for (let i = 0; i < n; i++) { const b = bird(p, { body: '#8d93a0', wing: '#6d7380', s: .5 }); ps.push({ b, a: R() * TAU, r: rr(rad * .5, rad), x0: (gx ?? cx) + rr(-area, area), z0: (gz ?? cz) + rr(-area, area), h: rr(h * .6, h * 1.3), ph: R() }); }
  S.updates.push((t) => { const c = t % cyc; const up = c < cyc * .3 ? 0 : c < cyc * .38 ? ease((c - cyc * .3) / (cyc * .08)) : c < cyc * .8 ? 1 : 1 - ease((c - cyc * .8) / (cyc * .15)); for (const q of ps) { const a = q.a + t * .6; const fx = cx + Math.cos(a) * q.r, fz = cz + Math.sin(a) * q.r; q.b.g.position.set(lerp(q.x0, fx, up), lerp(y0 + .06, y0 + q.h, up) + (up < .01 ? Math.abs(Math.sin(t * 3 + q.ph * 9)) * .02 : 0), lerp(q.z0, fz, up)); if (up > .01) q.b.g.lookAt(cx + Math.cos(a + .2) * q.r, q.b.g.position.y, cz + Math.sin(a + .2) * q.r); else q.b.g.rotation.set(Math.sin(t * 4 + q.ph * 9) * .35, q.ph * 6, 0); const f = up > .01 ? Math.sin(t * 16 + q.ph * 9) * .7 : 0; q.b.wl.rotation.z = f; q.b.wr.rotation.z = -f; } });
}

/* ---------------- road vehicles (length along +x) */
export function car(p, { c = '#f2c230', type = 'sedan', night = false } = {}) {
  const g = group(p);
  const dims = { sedan: [1.7, .3, .78, .28], taxi: [1.7, .3, .78, .28], van: [1.9, .3, .8, .46], dolmus: [2.1, .34, .84, .5], bus: [4.2, .34, 1.0, .82] }[type];
  const [L, bh, W, ch] = dims;
  box(g, L, bh, W, c, 0, .1, 0);
  const gl = night ? N('#30384a') : N('#33475e');
  if (type === 'sedan' || type === 'taxi') { box(g, L * .52, ch, W * .9, c, -.08, .1 + bh, 0); box(g, L * .48, ch * .72, W * .92, gl, -.08, .1 + bh + .03, 0); box(g, .05, ch * .7, W * .8, gl, L * .18, .1 + bh + .02, 0).rotation.z = .5; }
  else { box(g, L - (type === 'bus' ? .1 : .35), ch, W * .96, c, type === 'bus' ? 0 : -.12, .1 + bh, 0); box(g, L - (type === 'bus' ? .3 : .5), ch * .55, W * .98, gl, type === 'bus' ? 0 : -.15, .1 + bh + ch * .3, 0); box(g, .04, ch * .6, W * .8, gl, L / 2 - (type === 'bus' ? .04 : .3), .1 + bh + ch * .25, 0); }
  const wr = type === 'bus' ? .17 : .13;
  for (const sx of type === 'bus' ? [-L * .33, L * .3] : [-L * .3, L * .3]) for (const sz of [-W / 2, W / 2]) { const w = cyl(g, wr, wr, .1, '#1c1c20', sx, 0, sz, 10); w.rotation.x = Math.PI / 2; w.position.y = wr; cyl(g, wr * .5, wr * .5, .11, N('#aaa'), sx, 0, sz, 8).rotation.x = Math.PI / 2; g.children[g.children.length - 1].position.y = wr; }
  for (const s of [-1, 1]) { box(g, .03, .07, .14, night ? EN('#fff6d8') : N('#fff6d8'), L / 2, .24, s * W * .32); box(g, .03, .07, .12, night ? EN('#ff3a3a') : N('#c22a2a'), -L / 2, .26, s * W * .32); }
  if (type === 'taxi') { box(g, .32, .1, .18, '#222', -.1, .1 + bh + ch, 0); sign(g, 'TAKSİ', .28, .08, { bg: '#222', fg: '#f2c230' }, -.1, .1 + bh + ch + .055, .095, 0, true, null); }
  if (type === 'bus') { box(g, L + .01, .1, W + .01, '#c8302c', 0, .32, 0); sign(g, 'İETT', .5, .14, { bg: '#ffffff', fg: '#1a3a6a' }, .4, .55, W / 2 + .006, 0, false, null); sign(g, '16D  KADIKÖY', .7, .14, { bg: '#111', fg: '#ffb020' }, L / 2 + .006, .1 + bh + ch * .78, 0, Math.PI / 2, true, null); }
  if (type === 'dolmus') sign(g, 'KADIKÖY · ÜSKÜDAR', .9, .13, { bg: '#fff', fg: '#222' }, -.1, .1 + bh + ch - .08, W / 2 * .97 + .005, 0, false, null);
  if (night) { glow(g, L / 2 + .15, .24, .2, 1.1, '#fff4d6', .9); glow(g, L / 2 + .15, .24, -.2, 1.1, '#fff4d6', .9); }
  g.userData.L = L;
  return g;
}
/** a timed traffic signal: cars get `green` seconds, then pedestrians `walk` seconds (with a short all-red) */
export function signal(period = 22, green = 14, walk = 6, offset = 0) {
  const ph = (t) => ((t + offset) % period + period) % period;
  return { carGo: (t) => ph(t) < green, pedGo: (t) => { const p = ph(t); return p > green + 1 && p < green + 1 + walk; }, phase: ph, period, green, walk };
}
/** one traffic lane along x. Vehicles follow each other, keep their distance, and stop at red lights. */
export class Lane {
  constructor(S, { z, x0 = -14, x1 = 14, dir = 1, speed = 2.5, y = 0, fade = 1.2, stops = [], onS = null }) {
    Object.assign(this, { z, x0, x1, dir, speed, y, fade, onS }); this.len = x1 - x0 + 2 * fade; this.vs = [];
    this.stops = stops.map((st) => ({ s: this.toS(st.x) - .25, red: st.red }));
    S.updates.push((t, dt) => this.step(t, dt));
  }
  toS(x) { return this.dir > 0 ? x - (this.x0 - this.fade) : (this.x1 + this.fade) - x; }
  toX(s) { return this.dir > 0 ? this.x0 - this.fade + s : this.x1 + this.fade - s; }
  add(o, sFrac = null, speed = null) { const L = o.userData.L || 2; const v = { o, L, s: (sFrac ?? R()) * this.len, v: this.speed * .8, max: speed ?? this.speed * rr(.92, 1.08) }; this.vs.push(v); this.vs.sort((a, b) => a.s - b.s); o.rotation.y = this.dir > 0 ? 0 : Math.PI; return v; }
  /** spread n vehicles evenly along the lane */
  fill(list) { list.forEach((o, i) => this.add(o, (i + .3) / list.length)); return this; }
  step(t, dt) {
    const vs = this.vs, n = vs.length, len = this.len;
    for (let i = 0; i < n; i++) {
      const v = vs[i]; let target = v.max;
      if (n > 1) { let best = null, bg = 1e9; for (let j = 0; j < n; j++) { if (j === i) continue; const w = vs[j]; let gap = w.s - v.s; if (gap <= 0) gap += len; gap -= (w.L + v.L) / 2 + .35; if (gap < bg) { bg = gap; best = w; } } if (bg < 1.4) target = Math.min(target, bg < .12 ? 0 : best.v * Math.min(1, bg / 1.4) + Math.max(0, bg - .4) * .4); }
      for (const st of this.stops) { if (!st.red(t)) continue; const d = st.s - (v.s + v.L / 2); if (d > -.05 && d < 2.6) target = Math.min(target, d < .12 ? 0 : v.max * (d / 2.6)); }
      v.v += clamp(target - v.v, -dt * 4.5, dt * 1.8); if (v.v < 0) v.v = 0;
      v.s += v.v * dt; if (v.s >= len) v.s -= len;
      const x = this.toX(v.s); v.o.position.set(x, this.y, this.z); if (this.onS) this.onS(v.o, v.s, x);
      const sc = Math.min(smooth(this.x0 - this.fade, this.x0 + .3, x), 1 - smooth(this.x1 - .3, this.x1 + this.fade, x)); v.o.scale.setScalar(Math.max(sc, .0001)); v.o.visible = sc > .01;
    }
    vs.sort((a, b) => a.s - b.s);
  }
}
/** single vehicle on its own lane (kept for simple cases) */
export function traffic(S, o, opts) { const L = new Lane(S, { ...opts, speed: opts.speed || 2.5 }); L.add(o, ((opts.off || 0) % 10) / 10); return L; }
/** nostalgic tram, length along x. passengers can attach to returned .seats */
export function tram(S, p, { dest = 'MODA', night = false, c = '#b81f2a', cream = '#efe1c0' } = {}) {
  const g = group(p); const L = 3.6, W = 1.0;
  box(g, L - .5, .2, W - .25, '#2b2b30', 0, .04, 0);
  for (const sx of [-1.1, 1.1]) { box(g, .8, .14, W - .1, '#333', sx, 0, 0); }
  box(g, L, .52, W, c, 0, .24, 0); box(g, L + .02, .07, W + .02, cream, 0, .44, 0);
  // window band with transparent glass so passengers show
  const posts = 7;
  for (let i = 0; i <= posts; i++) { const x = -L / 2 + .05 + i * (L - .1) / posts; for (const s of [-1, 1]) box(g, .08, .46, .05, c, x, .76, s * (W / 2 - .025)); }
  for (const s of [-1, 1]) { const gl = new THREE.Mesh(UB, night ? WIN_GLASS_N : WIN_GLASS); gl.scale.set(L - .1, .44, .02); gl.position.set(0, .99, s * (W / 2 - .02)); g.add(gl); }
  for (const s of [-1, 1]) { box(g, .05, .46, W, c, s * (L / 2 - .025), .76, 0); box(g, .02, .3, W * .7, night ? N('#2a3a4a') : N('#3a5068'), s * (L / 2), .83, 0).castShadow = false; }
  box(g, L, .06, W, cream, 0, 1.22, 0);
  const rf = cyl(g, 1, 1, 1, '#e1d2b0', 0, 0, 0, 14); rf.rotation.z = Math.PI / 2; rf.scale.set(.12, L + .06, .55); rf.position.set(0, 1.28, 0);
  box(g, L - 1.0, .1, W - .45, cream, 0, 1.35, 0);
  box(g, L - .2, .05, W - .1, '#c9b894', 0, .54, 0);
  for (let i = 0; i < 5; i++) for (const s of [-1, 1]) box(g, .3, .2, .22, '#8a5a36', -1.3 + i * .65, .54, s * .25);
  const pole = group(g, -.5, 1.42, 0); rod(pole, V(0, 0, 0), V(-.9, .95, 0), .018, '#2a2a2a', 4); box(pole, .1, .04, .2, '#2a2a2a', -.9, .95, 0);
  for (const s of [-1, 1]) { sign(g, dest, .56, .15, { bg: '#151515', fg: '#ffcf4a' }, s * (L / 2 + .008), 1.12, 0, s * Math.PI / 2, true, null); box(g, .03, .07, .07, night ? EN('#fff4cc') : N('#fff4cc'), s * (L / 2 + .01), .38, 0); if (night) glow(g, s * (L / 2 + .2), .38, 0, 1.2, '#ffe9b0'); }
  sign(g, 'T3', .22, .18, { bg: '#fff', fg: c }, 0, .36, W / 2 + .006, 0, false, null);
  g.userData.seats = []; for (let i = 0; i < 5; i++) for (const s of [-1, 1]) g.userData.seats.push(V(-1.3 + i * .65, .57, s * .25));
  return g;
}
/** classic Istanbul ferry, length along x */
export function vapur(S, p, name = 'KADIKÖY', night = false) {
  const g = group(p); const L = 8.0, W = 2.0, white = '#f4f1ea', navy = '#1d2b47';
  box(g, L, .42, W, navy, 0, -.42, 0); box(g, L, .46, W, white, 0, 0, 0);
  for (const s of [-1, 1]) { cyl(g, W / 2, W / 2, .42, navy, s * L / 2, -.42, 0, 18); cyl(g, W / 2, W / 2, .46, white, s * L / 2, 0, 0, 18); }
  box(g, L + W - .1, .05, W + .05, '#b7322f', 0, -.03, 0).castShadow = false;
  box(g, L + W - .2, .05, W - .1, '#a99a82', 0, .46, 0);
  // lower saloon with transparent windows
  box(g, L - 1.0, .12, W - .24, white, 0, .5, 0); box(g, L - 1.0, .14, W - .24, white, 0, 1.12, 0);
  for (let i = 0; i <= 12; i++) for (const s of [-1, 1]) box(g, .07, .5, .05, white, -L / 2 + .5 + i * (L - 1) / 12, .62, s * (W / 2 - .14));
  for (const s of [-1, 1]) { const gl = new THREE.Mesh(UB, night ? WIN_GLASS_N : WIN_GLASS); gl.scale.set(L - 1.05, .5, .02); gl.position.set(0, .87, s * (W / 2 - .14)); g.add(gl); }
  for (const s of [-1, 1]) box(g, .05, .62, W - .24, white, s * (L / 2 - .5), .5, 0);
  box(g, L - .9, .02, W - .3, '#6a5a48', 0, .5, 0);
  for (let i = 0; i < 9; i++) for (const s of [-1, 1]) box(g, .5, .16, .2, '#8a5a36', -3 + i * .75, .52, s * .5);
  // upper deck
  box(g, L + .5, .06, W + .02, '#dcd4c2', 0, 1.26, 0);
  for (const s of [-1, 1]) { box(g, L + .4, .035, .035, '#fff', 0, 1.6, s * W / 2); for (let i = 0; i < 16; i++) box(g, .025, .32, .025, N('#fff'), -L / 2 - .2 + i * (L + .4) / 15, 1.29, s * W / 2).castShadow = false; }
  box(g, L - 3.2, .58, W - .6, white, 0, 1.32, 0); for (const s of [-1, 1]) box(g, L - 3.3, .2, .02, N('#2b3d5c'), 0, 1.58, s * (W - .6) / 2).castShadow = false;
  box(g, L - 3, .07, W - .4, '#dcd4c2', 0, 1.9, 0);
  for (const s of [-1, 1]) { box(g, .8, .44, W - .7, white, s * (L / 2 - 1.8), 1.97, 0); box(g, .02, .18, W - .9, N('#2b3d5c'), s * (L / 2 - 1.39), 2.17, 0).castShadow = false; }
  cyl(g, .3, .33, .82, '#efc95e', 0, 1.97, 0, 14); cyl(g, .31, .31, .2, '#1e1e1e', 0, 2.79, 0, 14);
  const tor = cg('buoy', () => new THREE.TorusGeometry(.12, .04, 6, 12));
  for (const s of [-1, 1]) for (const x of [-2.4, 2.4]) { const b = mesh(tor, '#ee6a2e', g, x, 1.45, s * (W / 2 + .03)); b.castShadow = false; }
  for (const s of [-1, 1]) sign(g, name, 1.5, .24, { bg: white, fg: navy }, 1.2, .23, s * (W / 2 + .006), s > 0 ? 0 : Math.PI, false, null);
  flag(S, g, -L / 2 - .6, 2.3, 0, .6, 0);
  g.userData.deck = []; for (let i = 0; i < 9; i++) for (const s of [-1, 1]) g.userData.deck.push({ p: V(-3.2 + i * .8 + rr(-.1, .1), 1.29, s * (W / 2 - .2)), ry: s > 0 ? 0 : Math.PI });
  g.userData.seats = []; for (let i = 0; i < 9; i++) for (const s of [-1, 1]) g.userData.seats.push(V(-3 + i * .75, .55, s * .5));
  g.userData.smoke = V(0, 2.95, 0);
  return g;
}
export function kayik(S, p, x, z, c = '#2a6fb0', ry = 0) {
  const g = group(p, x, -.32, z, ry);
  const hull = cg('kayik', () => { const pts = []; for (let i = 0; i <= 8; i++) { const k = i / 8; pts.push(new THREE.Vector2(.36 * Math.sin(Math.PI * k) + .02, k * .3 - .15)); } const q = new THREE.LatheGeometry(pts, 12); q.rotateZ(Math.PI / 2); q.scale(4, 1, 1); return q; });
  const h = mesh(hull, c, g, 0, .1, 0); h.scale.set(.42, .75, .9);
  box(g, 1.2, .03, .38, '#c9a06a', 0, .2, 0); box(g, .04, .06, .5, '#8a5a36', .2, .17, 0);
  const ph = R() * 9; S.updates.push((t) => { g.position.y = -.32 + Math.sin(t * 1.4 + ph) * .03; g.rotation.z = Math.sin(t * 1.1 + ph) * .05; g.rotation.x = Math.sin(t * .9 + ph) * .04; });
  return g;
}
export function smoke(S, p, src, n = 10, col = '#d0d4d8') { const puffs = []; for (let i = 0; i < n; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTex, color: col, transparent: true, opacity: 0, depthWrite: false })); p.add(sp); puffs.push({ sp, life: i / n }); } return (dt, wpos, strength = 1, t = 0) => { for (const q of puffs) { q.life += dt * .35; if (q.life > 1) q.life -= 1; const k = q.life; q.sp.position.set(wpos.x + k * 1.2, wpos.y + k * 2.2, wpos.z + Math.sin(k * 6 + t) * .2); const s = .35 + k * 1.2; q.sp.scale.set(s, s, 1); q.sp.material.opacity = .55 * strength * Math.sin(Math.PI * k); } }; }

/* ---------------- environment */
export function water(S, p, w, d, x, y, z, color = '#45acd0', amp = 1) {
  const geo = new THREE.PlaneGeometry(w, d, Math.round(w * 2), Math.round(d * 2)); geo.rotateX(-Math.PI / 2);
  const m = noOL(new THREE.MeshToonMaterial({ color, gradientMap: gradMap, transparent: true, opacity: .93 }));
  const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.receiveShadow = true; p.add(o);
  const pos = geo.attributes.position, b0 = pos.array.slice();
  S.updates.push((t) => { for (let i = 0; i < pos.count; i++) { const px = b0[i * 3] + x, pz = b0[i * 3 + 2] + z; pos.array[i * 3 + 1] = (Math.sin(px * .7 + t * 1.3) * .045 + Math.cos(pz * 1.3 + px * .3 + t * 1.7) * .035) * amp; } pos.needsUpdate = true; geo.computeVertexNormals(); });
  // foam sparkles
  return o;
}
export function petals(S, p, n, area, colors, size = .16, fall = .5, center = [0, 0, 0]) {
  const geo = new THREE.BufferGeometry(); const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), ph = new Float32Array(n); const c = new THREE.Color();
  for (let i = 0; i < n; i++) { pos[i * 3] = center[0] + rr(-area[0], area[0]); pos[i * 3 + 1] = rr(0, area[1]); pos[i * 3 + 2] = center[2] + rr(-area[2], area[2]); c.set(pick(colors)); col.set([c.r, c.g, c.b], i * 3); ph[i] = R() * TAU; }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const m = new THREE.PointsMaterial({ size, map: petalTex, vertexColors: true, transparent: true, depthWrite: false, alphaTest: .05 });
  const pts = new THREE.Points(geo, m); pts.frustumCulled = false; p.add(pts);
  S.updates.push((t, dt) => { for (let i = 0; i < n; i++) { const k = i * 3; pos[k + 1] -= dt * fall * (.6 + .4 * Math.sin(ph[i])); pos[k] += dt * (.4 + Math.sin(t * 1.3 + ph[i]) * .6); pos[k + 2] += dt * Math.cos(t + ph[i]) * .3; if (pos[k + 1] < 0) { pos[k + 1] = area[1]; pos[k] = center[0] + rr(-area[0], area[0]); } if (pos[k] > center[0] + area[0]) pos[k] = center[0] - area[0]; } geo.attributes.position.needsUpdate = true; });
  return pts;
}
export function motes(S, p, n, area, color, size = .12, rise = .2, op = .8, center = [0, 0, 0]) {
  const geo = new THREE.BufferGeometry(); const pos = new Float32Array(n * 3), ph = new Float32Array(n);
  for (let i = 0; i < n; i++) { pos[i * 3] = center[0] + rr(-area[0], area[0]); pos[i * 3 + 1] = rr(0, area[1]); pos[i * 3 + 2] = center[2] + rr(-area[2], area[2]); ph[i] = R() * TAU; }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({ size, map: dotTex, color, transparent: true, opacity: op, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
  const pts = new THREE.Points(geo, m); pts.frustumCulled = false; p.add(pts);
  S.updates.push((t, dt) => { for (let i = 0; i < n; i++) { const k = i * 3; pos[k + 1] += dt * rise * (.5 + Math.sin(ph[i]) * .5); pos[k] += Math.sin(t * .8 + ph[i]) * dt * .25; if (pos[k + 1] > area[1]) pos[k + 1] = 0; } geo.attributes.position.needsUpdate = true; m.opacity = op * (.75 + .25 * Math.sin(t * 2)); });
}
export function stars(p, n = 600, op = 1) {
  const geo = new THREE.BufferGeometry(); const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const a = R() * TAU, e = Math.acos(rr(.05, 1)); const r = 160; pos[i * 3] = Math.cos(a) * Math.sin(e) * r; pos[i * 3 + 1] = Math.cos(e) * r * .9 + 10; pos[i * 3 + 2] = Math.sin(a) * Math.sin(e) * r; }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({ size: 2.2, sizeAttenuation: false, color: '#ffffff', transparent: true, opacity: op, fog: false, depthWrite: false });
  const s = new THREE.Points(geo, m); s.frustumCulled = false; p.add(s); return s;
}
export function cloud(p, x, y, z, s = 1) { const g = group(p, x, y, z, 0, s); for (let i = 0; i < 7; i++) { const b = blob(g, rr(.9, 1.6), pick(['#ffffff', '#f4f8fc', '#eef4fa']), rr(-2.2, 2.2), rr(-.2, .6), rr(-1, 1)); b.castShadow = false; b.receiveShadow = false; } return g; }
export function rain(S, p, N = 2000, area = [12, 16, 9], op = .26) {
  const rg = new THREE.BufferGeometry(), rp = new Float32Array(N * 6), sp = new Float32Array(N);
  for (let i = 0; i < N; i++) { const x = rr(-area[0], area[0]), y = rr(0, area[1]), z = rr(-area[2], area[2]); rp.set([x, y, z, x - .04, y - .45, z], i * 6); sp[i] = rr(13, 18); }
  rg.setAttribute('position', new THREE.BufferAttribute(rp, 3));
  const l = new THREE.LineSegments(rg, new THREE.LineBasicMaterial({ color: '#a9b8dd', transparent: true, opacity: op, fog: false })); l.frustumCulled = false; p.add(l);
  S.updates.push((t, dt) => { for (let i = 0; i < N; i++) { const k = i * 6, d = sp[i] * dt; rp[k + 1] -= d; rp[k + 4] -= d; if (rp[k + 4] < 0) { const y = rr(area[1] - 2, area[1]); rp[k + 1] = y; rp[k + 4] = y - .45; } } rg.attributes.position.needsUpdate = true; });
}
export function sunLight(S, color, int, pos, size = 20, target = [0, 0, 0]) {
  const L = new THREE.DirectionalLight(color, int); L.position.set(...pos); L.target.position.set(...target); L.castShadow = true;
  L.shadow.mapSize.set(2048, 2048); const c = L.shadow.camera; c.left = -size; c.right = size; c.top = size; c.bottom = -size; c.near = 1; c.far = 140;
  L.shadow.bias = -0.0005; L.shadow.normalBias = 0.025; S.group.add(L, L.target); return L;
}
export function base(p, w, d, cx, cz, top, soil = '#8d5f3e', topH = .32) {
  box(p, w, topH, d, top, cx, -topH, cz).castShadow = false;
  box(p, w - .02, 1.05, d - .02, soil, cx, -topH - 1.05, cz).castShadow = false;
  for (let i = 0; i < 3; i++) box(p, w + .01, .03, d + .01, N(shade(soil, -.06)), cx, -topH - .3 - i * .3, cz).castShadow = false;
  box(p, w - .3, .32, d - .3, '#5b3a28', cx, -topH - 1.37, cz).castShadow = false;
}
