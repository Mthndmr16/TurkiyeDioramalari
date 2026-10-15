import { THREE, TAU, R, rr, ri, pick, chance, lerp, ease, smooth, clamp, V, M, E, N, EN, noOL, box, cyl, rod, blob, ell, dome, cone, hipRoof, gable, archTop, archWin, line, sag, group, sign, texMat, decal, glow, ctex, UB, PLANE, mesh, cg, lathe, gradMap } from '../kit.js';
import { tree, poplar, bush, grass, rock, cat, dog, shade, teaSet, crate } from '../props.js';
import { flag, bird, motes, stars, sunLight, base, car, Lane } from '../dyn.js';
import { MODE, lane, chat } from '../people.js';

const TUFF = ['#ecd3ae', '#e6c8a0', '#efd9b8', '#e0bf94', '#f1dcc0'];
const CAP = '#6e5444';

function chimney(p, x, z, h, r0, o = {}) {
  const g = group(p, x, o.y || 0, z, rr(0, TAU));
  const c = o.c || pick(TUFF);
  const prof = [[r0, 0], [r0 * .93, h * .2], [r0 * .72, h * .48], [r0 * .48, h * .76], [r0 * .34, h * .92], [r0 * .3, h]].map(([a, b]) => [a * rr(.95, 1.05), b]);
  lathe(g, prof, c, 0, 0, 0, 16);
  // pale band near the top, darker skirt at the base
  lathe(g, [[prof[3][0] + .01, h * .76], [prof[4][0] + .01, h * .92], [prof[5][0] + .01, h]], shade(c, .05), 0, 0, 0, 16);
  lathe(g, [[r0 * 1.02, 0], [r0 * .97, h * .12], [r0 * .9, h * .16]], shade(c, -.06), 0, 0, 0, 16);
  if (o.cap !== false) { cyl(g, r0 * .3, r0 * .36, h * .05, shade(c, -.04), 0, h, 0, 12); const cp = ell(g, r0 * .58, r0 * .26, r0 * .58, o.capC || CAP, 0, h + h * .05 + r0 * .12, 0); }
  const rAt = (y) => { for (let i = 1; i < prof.length; i++) if (y <= prof[i][1]) { const k = (y - prof[i - 1][1]) / (prof[i][1] - prof[i - 1][1]); return lerp(prof[i - 1][0], prof[i][0], k); } return prof[prof.length - 1][0]; };
  const nW = o.windows ?? ri(0, 3);
  for (let i = 0; i < nW; i++) { const y = rr(.5, h * .6), a = rr(0, TAU), r = rAt(y); const lit = chance(o.lit ?? .3); const q = group(g, Math.sin(a) * r * .96, y, Math.cos(a) * r * .96, a); archWin(q, .2, .3, .1, lit ? E('#ffc46a') : M('#3a2a22'), 0, 0, 0); if (lit) glow(q, 0, .15, .12, .8, '#ffb04a', .5); }
  for (let i = 0; i < (o.holes ?? ri(2, 6)); i++) { const y = rr(h * .3, h * .8), a = rr(0, TAU), r = rAt(y); const q = group(g, Math.sin(a) * r * .97, y, Math.cos(a) * r * .97, a); box(q, .07, .09, .06, N('#4a3628'), 0, 0, 0).castShadow = false; }
  if (o.door) { const a = o.face ?? 0, r = rAt(.35); const q = group(g, Math.sin(a) * r * .96, 0, Math.cos(a) * r * .96, a); archWin(q, .36, .62, .12, M('#5a3b26'), 0, 0, 0); box(q, .5, .06, .3, shade(c, -.1), 0, 0, .15); }
  return g;
}
function family(p, x, z, s = 1, y = 0) { // Paşabağ-style multi-headed chimney
  const g = group(p, x, y, z, rr(0, TAU), s); const c = pick(TUFF);
  lathe(g, [[1.6, 0], [1.4, .5], [1.0, 1.2], [.7, 1.6]], c, 0, 0, 0, 16);
  const n = ri(2, 3); for (let i = 0; i < n; i++) { const a = i / n * TAU + rr(-.3, .3); chimney(g, Math.cos(a) * .55, Math.sin(a) * .55, rr(2.6, 3.8), rr(.42, .6), { y: 1.0, c, windows: 0, holes: ri(0, 3) }); }
  return g;
}
function ridge(p, x, z, len, wid, h, ry = 0, cols = ['#e9b4a2', '#f2dcc4', '#e3a894', '#f6e4cc', '#dba08c']) { // Rose-valley layered ridge
  const g = group(p, x, 0, z, ry); const n = ri(7, 9);
  for (let i = 0; i < n; i++) {
    const k = i / n, L = len * (1 - k * .55) * rr(.95, 1.05), W = wid * (1 - k * .75);
    const sh = new THREE.Shape(); const seg = 16;
    for (let j = 0; j <= seg; j++) { const a = j / seg * TAU; const rx = L / 2 * (1 + rr(-.06, .06)), rz = W / 2 * (1 + rr(-.12, .12)); const px = Math.cos(a) * rx, pz = Math.sin(a) * rz; j ? sh.lineTo(px, pz) : sh.moveTo(px, pz); }
    const geo = new THREE.ExtrudeGeometry(sh, { depth: h / n, bevelEnabled: false }); geo.rotateX(-Math.PI / 2);
    mesh(geo, cols[i % cols.length], g, rr(-.2, .2) * k * len * .1, i * h / n, 0);
  }
  return g;
}
function uchisar(st, S, x, z) {
  const g = group(st, x, 0, z);
  // hill
  lathe(g, [[4.2, 0], [3.9, .6], [3.2, 1.5], [2.4, 2.4], [1.9, 3.0]], '#e3c8a2', 0, 0, 0, 20);
  // spire built of stacked irregular rock
  const parts = [[1.9, 3.0, 1.75, 4.2], [1.75, 4.2, 1.6, 5.4], [1.6, 5.4, 1.35, 6.6], [1.35, 6.6, 1.0, 7.6], [1.0, 7.6, .6, 8.3]];
  for (const [r0, y0, r1, y1] of parts) { const o = lathe(g, [[r0 * rr(.95, 1.05), y0], [lerp(r0, r1, .5) * rr(1.0, 1.1), (y0 + y1) / 2], [r1, y1]], pick(['#ead2ad', '#e4c69e', '#efd8b6']), rr(-.12, .12), 0, rr(-.12, .12), 9); o.rotation.y = rr(0, TAU); }
  dome(g, .6, '#e8cfa8', 0, 8.3, 0, 10, .6);
  // honeycomb of rooms and pigeon holes
  const rAtY = (y) => { const seq = [[0, 4.2], [.6, 3.9], [1.5, 3.2], [2.4, 2.4], [3.0, 1.9], [4.2, 1.75], [5.4, 1.6], [6.6, 1.35], [7.6, 1.0], [8.3, .6]]; for (let i = 1; i < seq.length; i++) if (y <= seq[i][0]) { const k = (y - seq[i - 1][0]) / (seq[i][0] - seq[i - 1][0]); return lerp(seq[i - 1][1], seq[i][1], k); } return .6; };
  for (let i = 0; i < 70; i++) { const y = rr(2.6, 8.0), a = rr(-1.9, 1.9) + (chance(.25) ? Math.PI : 0), r = rAtY(y) * .97; const q = group(g, Math.sin(a) * r, y, Math.cos(a) * r, a); if (chance(.6)) box(q, .12, .16, .1, N('#3e2c22'), 0, 0, 0).castShadow = false; else archWin(q, .18, .28, .1, N('#3e2c22'), 0, 0, 0); }
  flag(S, S.group, x, 8.85 + 1.1, z, .7, 0, true);
  // village houses on the slopes
  for (let i = 0; i < 26; i++) {
    const a = rr(-1.6, 1.8), rad = rr(2.5, 4.1); const y = rad > 3.9 ? lerp(.6, 0, (rad - 3.9) / .3) : rad > 3.2 ? lerp(1.5, .6, (rad - 3.2) / .7) : lerp(2.4, 1.5, (rad - 2.4) / .8);
    const hx = Math.sin(a) * rad, hz = Math.cos(a) * rad; const q = group(g, hx, y - .08, hz, a + rr(-.3, .3));
    const w = rr(.6, 1.0), d = rr(.6, .9), hh = rr(.5, .85); const c = pick(['#e8d6b8', '#dcc6a2', '#f0e2c8', '#d9bf98']);
    box(q, w, hh + .4, d, c, 0, -.4, 0); box(q, w + .06, .06, d + .06, shade(c, -.08), 0, hh, 0);
    archWin(q, .18, .3, .04, M('#4a3a30'), w * .2, .12, d / 2); box(q, .2, .4, .04, '#6a4a32', -w * .25, 0, d / 2 + .01);
    if (chance(.3)) cyl(q, .05, .05, .2, shade(c, -.1), w * .3, hh, 0, 6);
  }
  return g;
}
function caveHotel(st, S, x, z) {
  const g = group(st, x, 0, z);
  const C = S.crowd, rockC = ['#e9cfa6', '#e2c49a', '#efd8b3'];
  // back cliff mass
  for (let i = 0; i < 4; i++) { const bx = -3 + i * 2.1, h = [3.86, 3.86, 3.86, 4.6][i]; box(g, 2.3, h, 3.2, pick(rockC), bx, 0, -1.6); if (i === 3) ell(g, 1.25, .6, 1.7, pick(rockC), bx, h, -1.6); for (let s2 = 1; s2 < 4; s2++) box(g, 2.32, .06, 3.22, N('#cfab80'), bx, s2 * h / 4, -1.6).castShadow = false; }
  // cave rooms in the cliff face (z ≈ 0)
  for (let i = 0; i < 9; i++) { const rx = -3.6 + (i % 5) * 1.6 + rr(-.2, .2), ry = i < 5 ? .1 : 2.15; const lit = chance(.5); const q = group(g, rx, ry, .02); archWin(q, .42, .78, .06, lit ? E('#ffc46a') : M('#3a2a22'), 0, 0, 0); box(q, .54, .06, .1, '#7a5233', 0, .78, .03); if (lit) glow(q, 0, .4, .2, 1.1, '#ffb04a', .45); }
  // cut-stone house fronts
  for (const [hx, hw] of [[-2.2, 1.6], [1.6, 1.8]]) { box(g, hw, 1.9, 1.1, '#f0dfc2', hx, 0, .55); box(g, hw + .1, .08, 1.2, '#dcc6a2', hx, 1.9, .55); for (const k of [-.4, .4]) { archWin(g, .3, .55, .04, M('#46382e'), hx + k * hw / 2, .95, 1.11); box(g, .38, .04, .1, '#a07a50', hx + k * hw / 2, .9, 1.14); } box(g, .4, .8, .04, '#6a4a32', hx, 0, 1.11); }
  // lower terrace (y=1.9) and wooden balcony
  box(g, 8.2, .12, 1.4, '#c9a477', 0, 1.9, .7); box(g, 8.2, .1, .1, '#7a5233', 0, 2.28, 1.36); for (let i = 0; i <= 40; i++) box(g, .03, .38, .03, N('#7a5233'), -4.1 + i * .205, 1.94, 1.36).castShadow = false;
  // stair from ground to terrace (right end)
  for (let i = 0; i < 9; i++) box(g, .7, .21 * (i + 1), .25, '#d8c09c', 4.45, 0, 3.275 - i * .25);
  // upper rooftop terrace (y=3.9) on the cliff top
  box(g, 6.2, .12, 2.2, '#d6b88e', -1.0, 3.86, -1.2); box(g, 6.2, .1, .1, '#7a5233', -1.0, 4.24, -.12); for (let i = 0; i <= 31; i++) box(g, .03, .38, .03, N('#7a5233'), -4.1 + i * .2, 3.9, -.12).castShadow = false;
  // kilims, cushions, lanterns
  const kilim = ctex(256, 128, (q) => { q.fillStyle = '#a3262b'; q.fillRect(0, 0, 256, 128); q.strokeStyle = '#f0c35a'; q.lineWidth = 6; q.strokeRect(8, 8, 240, 112); for (let i = 0; i < 4; i++) { q.fillStyle = i % 2 ? '#1f4f7a' : '#f0c35a'; q.beginPath(); const cx = 40 + i * 58; q.moveTo(cx, 28); q.lineTo(cx + 22, 64); q.lineTo(cx, 100); q.lineTo(cx - 22, 64); q.fill(); } });
  for (const [kx, ky, kz] of [[-2.6, 2.03, .7], [-.4, 2.03, .7], [2.0, 2.03, .7], [-2.4, 3.99, -1.2], [.6, 3.99, -1.4]]) { const k = new THREE.Mesh(PLANE, texMat(kilim)); k.rotation.x = -Math.PI / 2; k.scale.set(1.3, .7, 1); k.position.set(kx, ky, kz); g.add(k); for (const dx of [-.45, .45]) box(g, .34, .12, .3, pick(['#c94a3a', '#e3a63a', '#2a6f8a', '#7a3a6a']), kx + dx, ky, kz - .2); }
  // breakfast on the terrace: low table, copper tray, tea glasses
  { const tx = 3.3, ty = 2.02, tz = .35; cyl(g, .32, .3, .04, '#c9a06a', tx, ty + .22, tz, 12); for (let i = 0; i < 4; i++) { const a = i / 4 * TAU; cyl(g, .02, .02, .22, '#8a6a4a', tx + Math.cos(a) * .22, ty, tz + Math.sin(a) * .22, 5); } cyl(g, .22, .22, .015, '#c98a3a', tx, ty + .26, tz, 14); for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; cyl(g, .035, .03, .03, pick(['#f6f0e6', '#c9302c', '#2a9d8f']), tx + Math.cos(a) * .13, ty + .27, tz + Math.sin(a) * .13, 8); } cyl(g, .018, .014, .05, E('#b4421c'), tx + .02, ty + .27, tz, 6); ell(g, .07, .025, .05, '#d9a24a', tx - .05, ty + .28, tz + .03); }
  for (const kx of [-3.2, -1.2, .8, 2.8]) { box(g, .04, .9, .04, '#7a5233', kx, 2.02, 1.3); box(g, .12, .16, .12, E('#ffcf7a'), kx, 2.7, 1.3).castShadow = false; glow(g, kx, 2.78, 1.3, .9, '#ffb658', .7); }
  // kilim draped over the balcony rail
  { const k = new THREE.Mesh(PLANE, texMat(kilim, false, { side: THREE.DoubleSide })); k.scale.set(1.0, .7, 1); k.position.set(-1.4, 1.95, 1.42); g.add(k); }
  for (let i = 0; i < 5; i++) { cyl(g, .1, .08, .14, '#b0603a', -3.6 + i * 1.7, 2.02, 1.18, 8); blob(g, .1, '#3f7a3a', -3.6 + i * 1.7, 2.22, 1.18); blob(g, .05, '#d6304a', -3.55 + i * 1.7, 2.3, 1.22); }
  // people: photographers on both terraces, tea drinkers
  for (let i = 0; i < 6; i++) C.add({ x: x - 3.6 + i * 1.05 + rr(-.1, .1), y: 3.98, z: z - .45, ry: rr(-.3, .4), mode: chance(.6) ? MODE.photo : MODE.wave });
  for (let i = 0; i < 5; i++) C.add({ x: x - 3.2 + i * 1.6 + rr(-.2, .2), y: 2.02, z: z + 1.05, ry: rr(-.4, .4), mode: chance(.5) ? MODE.photo : MODE.idle });
  for (const kx of [-2.6, 2.0]) for (const dx of [-.45, .45]) C.add({ x: x + kx + dx, y: 1.93, z: z + .5, ry: 0, mode: MODE.sit });
  for (const [dx, dz, ry] of [[-.2, .3, -Math.PI / 2 - .4], [.5, .05, Math.PI + .4]]) C.add({ x: x + 3.3 + dx, y: 1.93, z: z + .35 + dz, ry, mode: MODE.sit, v: pick(['f', 'm']) });
  C.add({ path: { pts: [V(x - 3.6, 3.98, z - 1.9), V(x + 1.6, 3.98, z - 1.9)], offset: R() } });
  return g;
}
function balloon(S, p, cols, s = 1, people = 0, C = null) {
  const g = group(p, 0, 0, 0, 0, s);
  const prof = [[.34, 0], [.52, .36], [.88, .96], [1.24, 1.66], [1.46, 2.36], [1.52, 2.86], [1.44, 3.36], [1.18, 3.86], [.72, 4.22], [.01, 4.38]];
  const t = ctex(512, 256, (q) => { const n = 16; for (let i = 0; i < n; i++) { q.fillStyle = cols[i % cols.length]; q.fillRect(i * 512 / n, 0, 512 / n + 1, 256); } q.fillStyle = cols[cols.length - 1]; q.fillRect(0, 150, 512, 20); q.fillStyle = 'rgba(0,0,0,.2)'; q.fillRect(0, 0, 512, 24); q.fillStyle = 'rgba(255,255,255,.25)'; for (let i = 0; i < n; i++) q.fillRect(i * 512 / n, 0, 2, 256); });
  const env = new THREE.Mesh(cg('lathe-b2', () => new THREE.LatheGeometry(prof.map(([a, b]) => new THREE.Vector2(a, b)), 20)), noOL(new THREE.MeshToonMaterial({ map: t, gradientMap: gradMap, side: THREE.DoubleSide })));
  env.castShadow = true; env.position.y = .75; g.add(env); env.userData.outlineParameters = { thickness: .002 };
  box(g, .62, .42, .62, '#8a5a32', 0, -.42, 0); box(g, .66, .05, .66, '#6a4228', 0, 0, 0);
  for (const [sx, sz] of [[-.3, -.3], [.3, -.3], [-.3, .3], [.3, .3]]) line(g, [V(sx, .02, sz), V(sx * 1.25, .76, sz * 1.25)], '#3a2a20');
  box(g, .34, .06, .34, '#555', 0, .38, 0);
  const fl = glow(g, 0, .55, 0, 1.2, '#ffb347', 0);
  if (C) for (let i = 0; i < people; i++) { const a = i / people * TAU + .4; C.add({ attach: g, x: Math.cos(a) * .17, y: -.4, z: Math.sin(a) * .17, ry: rr(0, TAU), mode: chance(.5) ? MODE.wave : MODE.photo, scale: .9 }); }
  return { g, fl };
}
function horse(S, p, c = '#7a4e2e') {
  const g = group(p); const mane = shade(c, -.25);
  ell(g, .2, .2, .42, c, 0, .62, 0);
  const neck = group(g, 0, .72, .32); rod(neck, V(0, 0, 0), V(0, .32, .16), .1, c, 8); ell(neck, .09, .1, .2, c, 0, .36, .26); ell(neck, .04, .14, .2, mane, 0, .22, .02).rotation.x = -.6; for (const s of [-1, 1]) cone(neck, .025, .08, c, s * .05, .44, .2, 4);
  const legs = []; for (const [lx, lz] of [[-.11, .3], [.11, .3], [-.11, -.3], [.11, -.3]]) { const L = group(g, lx, .5, lz); cyl(L, .045, .035, .5, c, 0, -.5, 0, 6); box(L, .07, .06, .08, '#2a2a2a', 0, -.52, .01); legs.push(L); }
  const tail = group(g, 0, .7, -.42); cyl(tail, .03, .07, .4, mane, 0, -.4, 0, 6); tail.rotation.x = .3;
  ell(g, .21, .05, .2, '#8a2a2a', 0, .82, -.02);
  return { g, legs, tail };
}

export default {
  id: 'kapadokya', seed: 33, chip: 'Kapadokya', title: 'Göreme', crowdCap: 60,
  sub: 'Gün doğarken yüzlerce balon havalanıyor. Otellerin terasları dolu, Uçhisar Kalesi’nde bayrak dalgalanıyor.',
  meta: '38.6431° K · 34.8289° D · Eylül, 06:14',
  sky: 'linear-gradient(180deg,#2a2452 0%,#6d4a86 28%,#e1806a 60%,#ffd08f 84%,#ffe3b0 100%)', fog: ['#eaa47e', 50, 140],
  shots: [
    { a: [18, 38], e: [24, 19], r: [42, 36], t: [[0, 3.5, -2]], d: 8.5 },
    { a: [192, 168], e: [8, 12], r: [12, 11], t: [[3, 5.2, 1], [3, 6.2, 3]], d: 7.5 },
    { a: [62, 86], e: [9, 13], r: [13.5, 12], t: [[8, 1.4, 6]], d: 7.5 },
    { a: [-32, -58], e: [33, 28], r: [38, 37], t: [[-2, 3, -2]], d: 7.5 },
  ],
  build(S) {
    const st = S.static, g = S.group, C = S.crowd;
    g.add(new THREE.HemisphereLight('#ffd6b6', '#5a3f62', 1.0));
    sunLight(S, '#ffae74', 2.7, [-24, 10, -18], 22);
    const fill = new THREE.DirectionalLight('#8c8cff', .35); fill.position.set(10, 10, 20); g.add(fill);
    base(st, 28, 24, 0, 0, '#dfbf96', '#b3845c');
    for (let i = 0; i < 10; i++) { const b = blob(st, 1, pick(['#dcb88d', '#e3c39a', '#d5ae82']), rr(-12, 12), -.1, rr(-10, 10), true); b.scale.set(rr(1.5, 3.2), rr(.25, .6), rr(1.5, 3)); b.castShadow = false; }
    // dirt road + dry creek
    for (let i = 0; i < 22; i++) { const k = i / 21; const x = lerp(-14, 14, k), z = Math.sin(k * 4.5) * 1.6 + 3.2; box(st, 1.5, .03, 1.0, '#f0dcb8', x, 0, z, Math.cos(k * 4.5) * .55).castShadow = false; }
    for (let i = 0; i < 16; i++) { const k = i / 15; const x = lerp(-14, 2, k), z = lerp(7.6, 5.6, k) + Math.sin(k * 6) * .5; box(st, .9, .025, .8, '#e8d2ae', x, 0, z, .3).castShadow = false; }
    // rose-valley ridges at the back right, Uçhisar back left
    ridge(st, 8.5, -9.0, 9, 3.2, 3.6, .1); ridge(st, 11.5, -5.5, 5, 2.2, 2.4, .5); ridge(st, -2.0, -10.5, 6, 2.0, 2.2, -.1);
    uchisar(st, S, -9.0, -7.0);
    caveHotel(st, S, 3.0, -2.6);
    // fairy chimneys
    const spots = [[-4.6, .6, 4.6, 1.15], [-6.4, 2.6, 3.6, .95], [-2.6, 3.0, 3.0, .85], [-1.0, 1.0, 5.4, 1.25], [-8.2, 1.4, 3.2, .9], [9.6, -1.6, 4.2, 1.0], [11.6, .8, 3.0, .85], [-11.8, 1.2, 4.0, 1.05], [-6.4, -2.6, 4.4, 1.1], [-2.6, -4.6, 3.8, 1.0], [12.4, -2.8, 3.4, .9], [-11.0, 6.2, 2.8, .8]];
    spots.forEach(([x, z, h, r], i) => chimney(st, x, z, h, r, { door: i % 4 === 0, face: 0, lit: .35, windows: i % 3 ? ri(0, 2) : 2 }));
    family(st, -10.4, -1.9, .85); family(st, 0.6, -7.7, .75); family(st, -13.0, 3.4, .7);
    // vineyard, apricots, poplars along the creek
    for (let r = 0; r < 6; r++) for (let c = 0; c < 10; c++) { const b = blob(st, .2, pick(['#5d8a3a', '#6b9a42', '#7aa84a']), -12.8 + c * .5, .16, 11.6 - r * .5); b.scale.y = .7; }
    for (let r = 0; r < 6; r++) box(st, 5.0, .02, .05, N('#8a6a4a'), -10.55, .2, 11.6 - r * .5).castShadow = false;
    for (const [x, z] of [[-5.6, 9.6], [-3.6, 10.6], [-1.6, 9.2], [4.0, 10.6], [1.6, 10.8]]) tree(st, x, z, .65, 'apricot');
    for (let i = 0; i < 9; i++) { const k = i / 8; poplar(st, lerp(-13, 1.5, k) + rr(-.3, .3), lerp(7.6, 5.6, k) + Math.sin(k * 6) * .5 + (i % 2 ? .8 : -.9), rr(.75, 1.05)); }
    grass(st, -6, 7, 10, 3, 60, ['#b8b058', '#a8a04a', '#c9c06a']); grass(st, 6, 0, 8, 6, 40, ['#b8b058', '#a8a04a']);
    for (let i = 0; i < 18; i++) rock(st, rr(-13, 13), rr(-11, 11), rr(.12, .3), pick(['#cdb08a', '#bfa07a', '#d8bf98']));
    // launch field (front right)
    box(st, 8, .02, 6, '#e3cfa8', 9, 0, 7.5).castShadow = false;
    const pal = [['#e63946', '#f1c453', '#2a9d8f', '#ffffff'], ['#3a86ff', '#ffbe0b', '#fb5607', '#ffffff'], ['#8338ec', '#ff006e', '#ffbe0b', '#3a86ff'], ['#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'], ['#ef476f', '#ffd166', '#06d6a0', '#118ab2'], ['#d62828', '#f77f00', '#fcbf49', '#eae2b7'], ['#1d3557', '#e63946', '#f1faee', '#a8dadc']];
    // balloon about to take off with passengers
    const lb = balloon(S, g, pal[1], 1.0, 4, C); lb.g.position.set(7.4, .42, 6.6);
    S.updates.push((t) => { const c = t % 30; const up = c < 12 ? 0 : ease((c - 12) / 18); lb.g.position.y = .42 + up * up * 14; lb.g.position.x = 7.4 + up * 3; const burn = c < 12 ? Math.max(0, Math.sin(t * 2)) ** 3 : Math.max(0, Math.sin(t * 1.3)) ** 6; lb.fl.material.opacity = burn * (.8 + Math.random() * .2); lb.fl.scale.setScalar(1.2 + burn); lb.g.visible = up < .98; });
    // inflating balloon lying on its side + fan + crew
    { const ib = group(st, 10.6, .0, 8.4, -.5); const t = ctex(256, 64, (q) => { for (let i = 0; i < 8; i++) { q.fillStyle = pal[4][i % 4]; q.fillRect(i * 32, 0, 33, 64); } }); const env = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), texMat(t)); env.scale.set(2.6, .75, 1.15); env.position.set(-.3, .45, 0); const mouth = cyl(ib, .45, .55, .3, '#2a2a2a', 2.15, .2, 0, 12); mouth.rotation.z = Math.PI / 2; env.castShadow = true; ib.add(env); box(ib, .62, .42, .62, '#8a5a32', 2.4, 0, 0); box(ib, .6, .06, .62, '#6a4228', 2.4, .42, 0); ib.children[ib.children.length - 1].rotation.z = .2;
      const fan = group(ib, 3.4, 0, .1, Math.PI / 2); box(fan, .5, .12, .4, '#333', 0, 0, 0); cyl(fan, .38, .38, .3, '#c9302c', 0, .45, 0, 14).rotation.x = Math.PI / 2; }
    for (const [cx, cz, ry, md] of [[12.6, 7.4, -1.8, MODE.wave], [11.4, 9.8, -2.6, MODE.talk], [9.0, 9.4, 2.4, MODE.vendor], [8.4, 5.6, .4, MODE.photo]]) C.add({ x: cx, z: cz, ry, mode: md, v: 'c', look: { top: pick(['#f2c230', '#e8e2d6', '#2a6fb0']), acc: '#2a2a2a' } });
    C.add({ v: 'c', speed: 1.0, look: { top: '#f2c230', acc: '#2a2a2a' }, path: { pts: [V(6.4, 0, 8.4), V(9.6, 0, 7.2), V(12.2, 0, 9.0)], mode: MODE.run, offset: R(), waits: { 0: { t: [2, 4], mode: MODE.talk }, 2: { t: [2, 4], mode: MODE.wave } } } });
    chat(C, 4.2, 5.2, 3); chat(C, -7.2, 7.4, 2, 0, { old: true });
    // chase vehicles with basket trailers
    for (const [vx, vz, ry] of [[12.2, 5.0, Math.PI / 2], [5.6, 9.8, .2]]) { const v = car(st, { type: 'van', c: '#f4f4f0' }); v.position.set(vx, 0, vz); v.rotation.y = ry; }
    const bus = car(g, { type: 'dolmus', c: '#f4f4f0' }); new Lane(S, { z: 3.3, x0: -13.5, x1: 13.5, dir: 1, speed: 1.6, fade: 1.2 }).add(bus, .3);
    S.updates.push(() => { const k = (bus.position.x + 14) / 28 * 4.5; bus.position.z = Math.sin(k) * 1.6 + 3.2; bus.rotation.y = -Math.atan(Math.cos(k) * 1.6 * 4.5 / 28) ; });
    // sky balloons
    const bdefs = [[-6, 9, 1, .85, 3], [2, 11, -4, .9, 3], [6, 7.5, 2.5, .8, 2], [-1, 14, -8, 1.0, 0], [-13, 15, -22, 1.8, 0], [12, 17, -28, 2.0, 0], [0, 21, -38, 2.4, 0], [-24, 12, -30, 2.0, 0], [22, 11, -20, 1.7, 0], [-8, 19, -16, 1.4, 0], [9, 5.5, 8.5, .7, 2], [16, 23, -46, 2.6, 0], [-18, 20, -40, 2.4, 0], [26, 16, -36, 2.2, 0], [-3, 8, 6, .75, 2], [14, 12, -10, 1.3, 0], [-16, 9, -10, 1.2, 0], [5, 16, -18, 1.4, 0], [-28, 18, -20, 2.0, 0], [30, 22, -30, 2.4, 0]];
    const bs = bdefs.map(([x, y, z, s, n], i) => { const b = balloon(S, g, pal[i % pal.length], s, n, n ? C : null); b.g.position.set(x, y, z); return { ...b, x, y, z, s, ph: R() * TAU, sp: rr(.06, .16) }; });
    S.updates.push((t) => { for (const b of bs) { const yy = b.y + ((t * b.sp * b.s) % 6) - 1.5 + Math.sin(t * .5 + b.ph) * .3; b.g.position.set(b.x + Math.sin(t * .1 + b.ph) * 1.2, yy, b.z); b.g.rotation.y = t * .04 + b.ph; const burn = Math.max(0, Math.sin(t * .9 + b.ph * 3)) ** 6; b.fl.material.opacity = burn * (.8 + Math.random() * .2); b.fl.scale.setScalar(1.2 + burn * .8); } });
    // horse riders on the valley trail
    const trail = []; for (let k = 0; k <= 14; k++) { const u = k / 14; trail.push(V(lerp(-12.5, -1.5, u), 0, lerp(9.3, 7.4, u) + Math.sin(u * 5) * .4)); }
    for (let i = 0; i < 3; i++) {
      const h = horse(S, g, ['#7a4e2e', '#3a2a22', '#c9a77a'][i]); const off = i * 1.6;
      const rider = C.add({ attach: h.g, x: 0, y: .62, z: -.02, ry: 0, mode: MODE.sit, v: pick(['m', 'f', 'c']), scale: .95 });
      let d = off, dir = 1; const segs = []; let tot = 0; for (let k = 0; k < trail.length - 1; k++) { const L = trail[k].distanceTo(trail[k + 1]); segs.push(L); tot += L; }
      S.updates.push((t, dt) => { d += dir * dt * .55; if (d > tot) { d = tot; dir = -1; } if (d < 0) { d = 0; dir = 1; } let acc = 0, k = 0; while (k < segs.length - 1 && acc + segs[k] < d) { acc += segs[k]; k++; } const u = (d - acc) / segs[k]; const A = trail[k], B = trail[k + 1]; h.g.position.set(lerp(A.x, B.x, u), 0, lerp(A.z, B.z, u)); h.g.rotation.y = Math.atan2((B.x - A.x) * dir, (B.z - A.z) * dir); h.legs.forEach((L, j) => { L.rotation.x = Math.sin(t * 6 + (j % 3 ? Math.PI : 0) + i) * .45; }); h.tail.rotation.z = Math.sin(t * 2 + i) * .2; h.g.position.y = Math.abs(Math.sin(t * 6 + i)) * .02; });
    }
    // valley walkers
    for (let i = 0; i < 6; i++) { const pts = []; for (let k = 0; k <= 10; k++) { const kk = k / 10; pts.push(V(lerp(-13, 13, kk), .02, Math.sin(kk * 4.5) * 1.6 + 3.2 + rr(-.3, .3) + (i % 2 ? .35 : -.35))); } C.add({ path: { pts, offset: R(), start: ri(0, 8) }, v: pick(['k', 'm', 'f', 'b', 'c']) }); }
    // picnic / sunrise watchers on a rock
    for (const [px, pz, ry] of [[-.4, 6.6, -2.6], [.2, 6.9, -2.9], [-2.0, 8.4, -2.4]]) C.add({ x: px, z: pz, ry, mode: MODE.sit, y: .02 });
    for (const [px, pz] of [[2.6, 7.0], [-4.6, 5.6], [-2.8, 9.6]]) C.add({ x: px, z: pz, ry: Math.PI + rr(-.4, .4), mode: MODE.photo });
    C.add({ x: -5.6, z: 5.3, ry: Math.PI + .5, mode: MODE.selfie, v: 'f' }); C.add({ x: -5.95, z: 5.1, ry: Math.PI + .3, mode: MODE.idle, v: 'm' });
    dog(S, st, 3.6, 6.4, .4, '#e8dcc0', true); cat(S, st, 4.8, -1.1, 1.0, '#d98a3d', true);
    glow(g, -80, -2, -100, 46, '#ffb070', .8); glow(g, -80, -2, -100, 16, '#fff1c8', 1);
    stars(g, 260, .3);
    motes(S, g, 110, [13, 8, 11], '#ffd9a0', .1, .15, .5);
    const flock = []; for (let i = 0; i < 7; i++) flock.push(bird(g, { body: '#3a3040', wing: '#2a2430', s: .55 }));
    S.updates.push((t) => { flock.forEach((b, i) => { const a = t * .14 + i * .22; b.g.position.set(Math.cos(a) * 15 + i * .4, 10 + Math.sin(i) * .6, Math.sin(a) * 10 - 3); b.g.lookAt(Math.cos(a + .1) * 15 + i * .4, 10, Math.sin(a + .1) * 10 - 3); const f = Math.sin(t * 9 + i) * .6; b.wl.rotation.z = f; b.wr.rotation.z = -f; }); });
  }
};
