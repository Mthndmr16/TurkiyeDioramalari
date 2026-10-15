import { THREE, TAU, R, rr, ri, pick, chance, lerp, ease, smooth, clamp, V, M, E, N, EN, noOL, box, cyl, rod, blob, ell, dome, cone, hipRoof, ridgeRoof, gable, archTop, archWin, line, sag, group, sign, texMat, tileTex, decal, glow, ctex, UB, PLANE, mesh, cg, gradMap } from '../kit.js';
import { apt, win, tree, bush, flowers, grass, bench, seatsOf, lamp, bin, bollard, kiosk, teaSet, crate, fence, trafficLight, planter, cat, dog, curb, crosswalk, dashes, shade, umbrella, hedge } from '../props.js';
import { flag, gulls, pigeons, car, traffic, water, petals, smoke, sunLight, base } from '../dyn.js';
import { MODE, lane } from '../people.js';

const STN = '#dccb9f', LEAD = '#8a929c', BRICK = '#b5603f', HANST = '#d8c8a8';

function pointedArch(p, w, h, d, c, x, y, z, ry = 0) { const q = group(p, x, y, z, ry); box(q, w, h - w * .55, d, c, 0, 0, 0); const a = gable(q, w, d, w * .55, c, 0, h - w * .55, 0); return q; }

function uluCami(st, S, x, z) {
  const g = group(st, x, 0, z);
  const NX = 4, NZ = 5, sp = 2.4, W = NX * sp, D = NZ * sp, H = 3.0;
  box(g, W + .4, .2, D + .4, '#c4b48c', 0, 0, 0);
  box(g, W, H, D, STN, 0, .2, 0);
  box(g, W + .14, .14, D + .14, '#cdbb8e', 0, .2 + H - .1, 0);
  for (let k = 1; k < 4; k++) box(g, W + .02, .02, D + .02, N('#c9b78c'), 0, .2 + k * .72, 0).castShadow = false;
  // windows: two rows of pointed arches on every facade
  const faces = [[0, D / 2, 0, W, NX], [0, -D / 2, Math.PI, W, NX], [W / 2, 0, Math.PI / 2, D, NZ], [-W / 2, 0, -Math.PI / 2, D, NZ]];
  for (const [fx, fz, ry, len, n] of faces) { const q = group(g, fx, .2, fz, ry); for (let i = 0; i < n * 2; i++) { const wx = -len / 2 + (i + .5) * len / (n * 2); if (ry === 0 && Math.abs(wx) < 1.0) continue; pointedArch(q, .38, .8, .06, M('#3e4a52'), wx, .55, .01); box(q, .5, .05, .1, '#cdbb8e', wx, .5, .04); pointedArch(q, .3, .55, .06, M('#3e4a52'), wx, 1.95, .01); } }
  // north portal
  { const q = group(g, 0, .2, D / 2); box(q, 2.0, H + .45, .5, '#e3d4ac', 0, 0, .15); pointedArch(q, 1.1, 2.5, .1, M('#4a3a2c'), 0, 0, .42); for (let i = 0; i < 5; i++) box(q, 1.2 - i * .18, .08, .08, N('#cdbb8e'), 0, 2.15 + i * .1, .42).castShadow = false; sign(q, 'ULU CAMİ', 1.2, .22, { bg: '#1f3a2f', fg: '#e9d9a6', serif: true }, 0, 2.95, .42, 0, false, '#1f3a2f'); box(q, 1.6, .08, .4, '#c4b48c', 0, 0, .8); box(q, 1.4, .08, .3, '#c4b48c', 0, .08, .75); }
  // 20 domes on octagonal drums; central one with lantern
  for (let i = 0; i < NX; i++) for (let j = 0; j < NZ; j++) {
    const dx = -W / 2 + (i + .5) * sp, dz = -D / 2 + (j + .5) * sp, y0 = .2 + H;
    cyl(g, 1.06, 1.1, .45, STN, dx, y0, dz, 8); cyl(g, 1.12, 1.12, .06, '#cdbb8e', dx, y0 + .45, dz, 8);
    const centre = (j === 2 && (i === 1 || i === 2));
    dome(g, 1.0, LEAD, dx, y0 + .5, dz, 16, .9);
    if (j === 2 && i === 1) { cyl(g, .32, .32, .4, '#cfd6dc', dx + 1.2, y0 + .45, dz, 8); dome(g, .32, LEAD, dx + 1.2, y0 + .85, dz, 10); }
    cyl(g, .02, .02, .25, '#c9a64a', dx, y0 + 1.4, dz, 4); blob(g, .04, '#d9b552', dx, y0 + 1.66, dz, true);
  }
  // two minarets at the north corners
  for (const [mx, h] of [[-W / 2 - .1, 10.5], [W / 2 + .1, 9.6]]) { const mz = D / 2 - .3; box(g, .9, 3.4, .9, STN, mx, 0, mz); cyl(g, .32, .36, h - 3.4, '#e3d4ac', mx, 3.4, mz, 12); const sy = h - 1.6; cyl(g, .5, .34, .3, STN, mx, sy - .3, mz, 12); cyl(g, .52, .52, .05, '#cdbb8e', mx, sy, mz, 12); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; box(g, .02, .24, .02, N('#6a6a6a'), mx + Math.sin(a) * .5, sy + .05, mz + Math.cos(a) * .5).castShadow = false; } cyl(g, .3, .3, .5, '#e3d4ac', mx, h, mz, 12); cone(g, .36, 1.6, LEAD, mx, h + .5, mz, 12); cyl(g, .02, .02, .35, '#c9a64a', mx, h + 2.1, mz, 4); blob(g, .05, '#d9b552', mx, h + 2.5, mz, true); }
  return { g, W, D };
}

function band(p, w, h, d, x, y, z) { // almaşık wall: one stone course, two brick courses
  const n = Math.floor(h / .3); for (let i = 0; i < n; i++) { box(p, w, .1, d, HANST, x, y + i * .3, z); box(p, w + .005, .2, d + .005, BRICK, x, y + i * .3 + .1, z); }
  const rem = h - n * .3; if (rem > .01) box(p, w, rem, d, HANST, x, y + n * .3, z);
}
function kozaHan(st, S, x, z) {
  const g = group(st, x, 0, z); const C = S.crowd;
  const W = 9, D = 8, T = 1.2, H = 2.7;
  // four ranges
  band(g, W, H, T, 0, 0, D / 2 - T / 2); band(g, W, H, T, 0, 0, -D / 2 + T / 2);
  band(g, T, H, D - 2 * T, W / 2 - T / 2, 0, 0); band(g, T, H, D - 2 * T, -W / 2 + T / 2, 0, 0);
  for (const [rx, rz, rw, rd] of [[0, D / 2 - T / 2, W + .12, T + .12], [0, -D / 2 + T / 2, W + .12, T + .12], [W / 2 - T / 2, 0, T + .12, D - 2 * T], [-W / 2 + T / 2, 0, T + .12, D - 2 * T]]) box(g, rw, .1, rd, '#cbb994', rx, H, rz);
  // roofs: low lead slopes outside, arcade domes inside, chimneys
  for (const [rx, rz, rw, rd] of [[0, D / 2 - T / 2, W, T], [0, -D / 2 + T / 2, W, T], [W / 2 - T / 2, 0, T, D - 2 * T], [-W / 2 + T / 2, 0, T, D - 2 * T]]) box(g, rw - .02, .14, rd - .02, LEAD, rx, H + .1, rz);
  const inner = []; for (let i = 0; i < 8; i++) { const k = -W / 2 + T + .4 + i * (W - 2 * T - .8) / 7; inner.push([k, D / 2 - T - .3], [k, -D / 2 + T + .3]); } for (let i = 0; i < 4; i++) { const k = -D / 2 + T + 1.0 + i * (D - 2 * T - 2.0) / 3; inner.push([W / 2 - T - .3, k], [-W / 2 + T + .3, k]); }
  for (const [dx, dz] of inner) dome(g, .26, LEAD, dx, H, dz, 10, .8);
  for (let i = 0; i < 12; i++) { const k = -W / 2 + .5 + i * (W - 1) / 11; for (const s of [-1, 1]) { const cz = s * (D / 2 - .25); cyl(g, .08, .1, .45, HANST, k, H + .24, cz, 6); cone(g, .1, .14, LEAD, k, H + .69, cz, 6); } }
  // outer windows
  for (const [fx, fz, ry, len] of [[0, D / 2, 0, W], [0, -D / 2, Math.PI, W], [W / 2, 0, Math.PI / 2, D], [-W / 2, 0, -Math.PI / 2, D]]) { const q = group(g, fx, 0, fz, ry); for (let i = 0; i < Math.round(len / .9); i++) { const wx = -len / 2 + (i + .5) * len / Math.round(len / .9); if (ry === 0 && Math.abs(wx) < 1.1) continue; box(q, .22, .32, .06, M('#3a3530'), wx, 1.75, .01); box(q, .28, .3, .06, M('#3a3530'), wx, .55, .01); } }
  // taç kapı (north)
  { const q = group(g, 0, 0, D / 2); box(q, 2.0, H + .5, .35, '#e6d8b8', 0, 0, .12); pointedArch(q, 1.0, 2.0, .1, M('#4a3a2c'), 0, 0, .3); box(q, 1.6, .5, .05, M('#2a9d9f'), 0, 2.2, .3); for (let i = 0; i < 6; i++) box(q, .12, .12, .02, N('#f2f6f6'), -.6 + i * .24, 2.38, .33).castShadow = false; sign(q, 'KOZA HAN', 1.3, .22, { bg: '#7a1e1e', fg: '#f6e3b4', serif: true }, 0, 2.95, .32, 0, false, '#7a1e1e'); }
  // inner courtyard arcades (two storeys)
  const cw = W - 2 * T, cd = D - 2 * T;
  const arc = (len, fx, fz, ry) => { const q = group(g, fx, 0, fz, ry); box(q, len, H, .04, M('#6e5a48'), 0, 0, -.28); box(q, len + .04, .1, .62, LEAD, 0, H - .1, 0); const n = Math.round(len / .75); box(q, len, .12, .6, HANST, 0, 1.32, 0); for (let i = 0; i <= n; i++) { const px = -len / 2 + i * len / n; box(q, .14, 1.32, .16, HANST, px, 0, .22); box(q, .12, 1.15, .14, HANST, px, 1.44, .22); } for (let i = 0; i < n; i++) { const px = -len / 2 + (i + .5) * len / n; gable(q, len / n - .14, .14, .22, HANST, px, 1.1, .22); gable(q, len / n - .12, .12, .2, HANST, px, 2.4, .22); box(q, len / n - .12, .06, .02, N(BRICK), px, 2.36, .3).castShadow = false; } return q; };
  arc(cw, 0, cd / 2 - .3, Math.PI); arc(cw, 0, -cd / 2 + .3, 0); arc(cd - 1.2, cw / 2 - .3, 0, -Math.PI / 2); arc(cd - 1.2, -cw / 2 + .3, 0, Math.PI / 2);
  box(g, cw + .02, .02, cd + .02, '#c9bba0', 0, 0, 0).castShadow = false;
  // octagonal mescit over the şadırvan
  { const m = group(g, 0, 0, 0);
    cyl(m, .78, .82, .3, '#e3d6bc', 0, 0, 0, 8); cyl(m, .7, .7, .02, N('#5aa7c9'), 0, .29, 0, 8);
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + Math.PI / 8; box(m, .14, 1.35, .14, HANST, Math.sin(a) * 1.0, 0, Math.cos(a) * 1.0); }
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; const q = group(m, Math.sin(a) * .93, 1.1, Math.cos(a) * .93, a); gable(q, .62, .1, .25, HANST, 0, 0, 0); }
    cyl(m, 1.12, 1.12, .14, '#cbb994', 0, 1.35, 0, 8);
    cyl(m, .92, .95, 1.0, '#e6d8b8', 0, 1.49, 0, 8); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; const q = group(m, Math.sin(a) * .9, 1.75, Math.cos(a) * .9, a + Math.PI / 8 * 0); pointedArch(q, .24, .45, .05, M('#3e4a52'), 0, 0, 0); }
    cyl(m, 1.0, 1.0, .08, '#cbb994', 0, 2.49, 0, 8); dome(m, .9, LEAD, 0, 2.55, 0, 14, .85); cyl(m, .02, .02, .25, '#c9a64a', 0, 3.3, 0, 4); blob(m, .04, '#d9b552', 0, 3.56, 0, true);
    for (let i = 0; i < 7; i++) box(m, .5, .2 * (i + 1), .22, '#d8caa8', 1.25 + i * .0, 0, -1.35 + i * .2).position.x = 1.3; }
  // linden trees & tea tables in the courtyard
  for (const [tx, tz] of [[-2.2, -1.3], [2.2, -1.3], [-2.2, 1.3], [2.2, 1.3]]) tree(g, tx, tz, .62, 'linden', { cols: ['#c9b83a', '#a8b040', '#d9c04a', '#8fa83a'] });
  const seats = [];
  for (const [cx2, cz2] of [[-1.35, -1.2], [1.35, 1.2], [-1.35, 1.2]]) seats.push(...teaSet(g, cx2, cz2, { n: 3, a0: rr(0, 2), stool: '#3a2e28', top: '#e8e2d6' }));
  for (const s of seats) if (chance(.8)) C.add({ ...s, mode: MODE.sit });
  // silk scarves hanging in the ground arcades
  const scarf = ['#d6304a', '#2a9d8f', '#f2c230', '#7a3fa0', '#e98bb0', '#3a86c8', '#f08a3c', '#ffffff', '#1f4f7a'];
  for (const s of [-1, 1]) for (let i = 0; i < 7; i++) { const px = -cw / 2 + .45 + i * (cw - .9) / 6; box(g, .7, .02, .02, '#666', px, 1.15, s * (cd / 2 - .06)); for (let k = 0; k < 4; k++) box(g, .13, .45, .015, N(pick(scarf)), px - .24 + k * .16, .68, s * (cd / 2 - .07)).castShadow = false; }
  // browsers
  g.updateMatrixWorld(true);
  for (const s of [-1, 1]) for (let k = 0; k < 2; k++) { const zz = s * (cd / 2 - .3); const pts = [V(x - cw / 2 + .5, .01, z + zz), V(x + cw / 2 - .5, .01, z + zz)]; C.add({ v: pick(['fb', 'hb', 'b', 'f']), path: { pts, offset: R(), waits: { 0: { t: [2, 4], mode: MODE.browse, face: s > 0 ? 0 : Math.PI }, 1: { t: [2, 4], mode: MODE.browse, face: s > 0 ? 0 : Math.PI } } } }); }
  return g;
}
function karagoz(st, S, x, z, ry) {
  const g = group(st, x, 0, z, ry);
  box(g, 2.0, .9, .3, '#7a1e1e', 0, 0, 0); for (const s of [-1, 1]) box(g, .14, 2.1, .3, '#7a1e1e', s * .93, 0, 0); box(g, 2.0, .3, .32, '#7a1e1e', 0, 1.8, 0);
  const t = ctex(256, 160, (q) => { const gr = q.createRadialGradient(128, 80, 10, 128, 80, 150); gr.addColorStop(0, '#fff6d8'); gr.addColorStop(1, '#f0d9a0'); q.fillStyle = gr; q.fillRect(0, 0, 256, 160);
    const fig = (cx, flip, col, hat) => { q.save(); q.translate(cx, 0); q.scale(flip, 1); q.fillStyle = col; q.beginPath(); q.ellipse(0, 95, 18, 34, 0, 0, TAU); q.fill(); q.beginPath(); q.arc(4, 52, 14, 0, TAU); q.fill(); q.fillStyle = hat; q.beginPath(); q.moveTo(-10, 44); q.lineTo(18, 44); q.lineTo(4, hat === '#2a2a2a' ? 20 : 28); q.fill(); q.fillStyle = col; q.fillRect(-14, 126, 8, 26); q.fillRect(6, 126, 8, 26); q.strokeStyle = col; q.lineWidth = 6; q.beginPath(); q.moveTo(14, 82); q.lineTo(36, 70); q.stroke(); q.restore(); };
    fig(90, 1, 'rgba(160,40,40,.85)', '#2a2a2a'); fig(170, -1, 'rgba(40,90,150,.85)', '#c9a64a'); q.strokeStyle = '#7a1e1e'; q.lineWidth = 6; q.strokeRect(3, 3, 250, 154); });
  const sc = new THREE.Mesh(PLANE, texMat(t, true)); sc.scale.set(1.72, .9, 1); sc.position.set(0, 1.35, .16); g.add(sc);
  sign(g, 'KARAGÖZ · HACİVAT', 1.6, .24, { bg: '#f2c46d', fg: '#7a1e1e' }, 0, 2.28, .17, 0, false, '#7a1e1e');
  glow(g, 0, 1.35, .3, 2.0, '#ffe6a8', .25);
  return g;
}
function uludag(p) { // distant mountain with snow cap
  const g = new THREE.Group(); p.add(g);
  const geo = new THREE.ConeGeometry(48, 26, 40, 10); const pos = geo.attributes.position; const col = [];
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i); const n = Math.sin(x * .21) * Math.cos(z * .17) * 2.4 + Math.sin(x * .07 + z * .05) * 3; const yy = y + (y < 12.9 ? n * (1 - (y + 13) / 26) : 0); pos.setY(i, yy); const k = (yy + 13) / 26; if (k > .6 + Math.sin(x * .3) * .06) c.set('#f6f7fb'); else if (k > .48) c.set('#8a8f78'); else if (k > .3) c.set('#4f7a46'); else c.set('#5f8a4a'); col.push(c.r, c.g, c.b); }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); geo.computeVertexNormals();
  const mt = new THREE.Mesh(geo, noOL(new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: gradMap }))); mt.position.set(10, 1, -112); mt.scale.set(1.7, .95, 1); g.add(mt);
  const g2 = new THREE.Mesh(new THREE.ConeGeometry(30, 14, 24, 4), noOL(new THREE.MeshToonMaterial({ color: '#5f8a4a', gradientMap: gradMap }))); g2.position.set(-40, -2, -70); g.add(g2);
  const g3 = g2.clone(); g3.position.set(45, -3, -62); g3.scale.set(1.2, .9, 1); g.add(g3);
  return g;
}

export default {
  id: 'bursa', seed: 77, chip: 'Bursa', title: 'Bursa', crowdCap: 56,
  sub: 'Ulu Cami’nin yirmi kubbesi, Koza Han’ın avlusunda çay ve ipek. Arkada karlı Uludağ, teleferik yukarı tırmanıyor.',
  meta: '40.1839° K · 29.0619° D · Ekim, 16:30',
  sky: 'linear-gradient(180deg,#7fb2e0 0%,#bcd9ee 45%,#f2e3c8 85%,#f7d9b0 100%)', fog: ['#e6e0d4', 70, 170],
  shots: [
    { a: [14, 34], e: [22, 18], r: [46, 40], t: [[0, 4.5, -4]], d: 8.5 },
    { a: [24, 54], e: [52, 46], r: [15, 14], t: [[8.2, 1.2, -7.2]], d: 7.5 },
    { a: [-12, 10], e: [6, 9], r: [11, 9.5], t: [[0, 1.1, -4.6]], d: 7.5 },
    { a: [-52, -30], e: [11, 15], r: [24, 22], t: [[-8.5, 3.5, -5]], d: 7.5 },
  ],
  build(S) {
    const st = S.static, g = S.group, C = S.crowd;
    g.add(new THREE.HemisphereLight('#fff1dc', '#a0886a', 1.2));
    sunLight(S, '#ffd9a8', 2.6, [-22, 15, 10], 24);
    base(st, 30, 26, 0, 0, '#cbbfa6', '#8d5f3e');
    uludag(g);
    const pav = tileTex('#d8ccb2', '#bba98c', 8, 8, 8); pav.wrapS = pav.wrapT = THREE.RepeatWrapping; pav.repeat.set(14, 9);
    decal(st, pav, 30, 21.4, 0, .005, -2.3);
    // ---- road at the front (Atatürk Cd.) z∈[8.4,10.6], sidewalk z∈[10.6,12.4]
    box(st, 30, .03, 2.2, '#5d6069', 0, 0, 9.5).castShadow = false; dashes(st, -14.5, 14.5, 9.5, .031);
    curb(st, 0, 8.36, 30, .12, '#b3a68e', .1); curb(st, 0, 10.64, 30, .12, '#b3a68e', .1);
    box(st, 30, .08, 1.8, '#cfc3ab', 0, 0, 11.6).castShadow = false; crosswalk(st, 1, 9.5, 2.0, 'x', 6, .031);
    for (const [tx, tz, ry] of [[0, 8.25, Math.PI], [2, 10.75, 0]]) trafficLight(st, tx, tz, ry);
    for (const lx of [-12, -6, 6, 12]) lamp(st, lx, 10.85, { h: 2.6 });
    for (const tx of [-14, -9, -3.4, 4, 9, 14]) tree(st, tx, 11.9, .85, 'autumn', { pit: true });
    const vs = [car(g, { type: 'taxi', c: '#f2c230' }), car(g, { type: 'sedan', c: '#2a5a9a' }), car(g, { type: 'dolmus', c: '#f2c230' }), car(g, { type: 'sedan', c: '#eeeeea' }), car(g, { type: 'van', c: '#c63b3b' }), car(g, { type: 'sedan', c: '#3a3a3e' })];
    vs.forEach((v, i) => traffic(S, v, { z: i % 2 ? 9.0 : 10.0, speed: 2.4, off: i * 4.7, dir: i % 2 ? 1 : -1, fade: 1.2 }));
    // ---- Ulu Cami (left) + Koza Han (right)
    const UC = uluCami(st, S, -9.1, -6.6);
    kozaHan(st, S, 8.2, -7.2);
    // bedesten domes behind Koza Han
    { const bd = group(st, 8.2, 0, -12.3); box(bd, 9, 1.6, 1.2, HANST, 0, 0, 0); for (let i = 0; i < 6; i++) { cyl(bd, .55, .6, .25, HANST, -3.75 + i * 1.5, 1.6, 0, 8); dome(bd, .55, LEAD, -3.75 + i * 1.5, 1.85, 0, 12); } }
    // İskender konak + kestane şekeri between them (facing +z)
    apt(st, { x: -1.4, z: -10.0, w: 3.2, d: 3.4, floors: 3, color: '#efe4cf', trim: '#7a4a2a', roof: 'hip', roofC: '#b5563c', cumba: true, sides: 1, frame: '#7a4a2a', shutters: null, shop: { text: 'İSKENDER', type: 'kebab', style: { bg: '#7a1e1e', fg: '#f6e3b4', serif: true }, awning: ['#7a1e1e', '#f4efe4'] } });
    apt(st, { x: 1.8, z: -10.4, w: 2.4, d: 2.8, floors: 2, color: '#d9a066', trim: '#f3ead9', roof: 'hip', roofC: '#b5563c', sides: 1, shop: { text: 'KESTANE ŞEKERİ', type: 'sweets', style: { bg: '#5a2a12', fg: '#f2c46d' }, awning: ['#5a2a12', '#f4efe4'] } });
    const dine = []; for (const dx of [-2.4, -.4]) dine.push(...teaSet(st, dx, -6.9, { n: 2, a0: 0, top: '#f4efe4', stool: '#7a4a2a', umbrella: '#7a1e1e' }));
    for (const s of dine) if (chance(.85)) C.add({ ...s, mode: MODE.sit });
    // great plane tree + karagöz
    tree(st, 0.4, -3.6, 1.55, 'autumn', { pit: true });
    karagoz(st, S, -1.6, -5.8, .25);
    for (let i = 0; i < 6; i++) C.add({ x: -2.2 + (i % 3) * .5 + rr(-.08, .08), z: -4.9 + Math.floor(i / 3) * .5, ry: Math.PI + .25, mode: MODE.sit, y: .01, scale: rr(.68, .76), v: pick(['k', 'm', 'f', 's']) });
    C.add({ x: -3.0, z: -4.6, ry: Math.PI + .5, mode: MODE.idle, v: 'h' }); C.add({ x: -.4, z: -4.4, ry: Math.PI, mode: MODE.idle, v: 'c', old: true });
    // ---- Koza Parkı: long pool with jets, benches, flower beds
    box(st, 12, .26, 2.4, '#cfc6b4', 0, 0, 3.2); box(st, 11.6, .02, 2.0, N('#5aa7c9'), 0, .22, 3.2).castShadow = false;
    water(S, g, 11.5, 1.9, 0, .23, 3.2, '#5fb6d6', .25);
    const jets = []; for (let i = 0; i < 9; i++) { const jx = -5 + i * 1.25; const geo = new THREE.BufferGeometry(); const n = 40; const pos = new Float32Array(n * 3); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: '#e8f6ff', size: .07, transparent: true, opacity: .8 })); pts.frustumCulled = false; g.add(pts); jets.push({ jx, pos, geo, n, ph: R() * 9 }); }
    S.updates.push((t) => { for (const j of jets) { const h = 1.1 + Math.sin(t * .8 + j.ph) * .4; for (let k = 0; k < j.n; k++) { const u = ((t * .9 + k / j.n) % 1); const a = k * 2.4; const r = u * .35; j.pos[k * 3] = j.jx + Math.cos(a) * r; j.pos[k * 3 + 1] = .25 + h * 4 * u * (1 - u); j.pos[k * 3 + 2] = 3.2 + Math.sin(a) * r; } j.geo.attributes.position.needsUpdate = true; } });
    for (const [fx, fz] of [[-9.5, 3.2], [9.5, 3.2]]) { box(st, 4.4, .25, 2.2, '#bfb5a2', fx, 0, fz); flowers(st, fx, fz, 4.0, 1.8, ['#f2c230', '#e85a3a', '#d6304a', '#f6f0e6', '#c96a2a'], 120, .25); }
    const bs = []; for (const bx of [-5, -2.5, 2.5, 5]) { bs.push(bench(st, bx, 5.3, Math.PI)); bs.push(bench(st, bx, 1.1, 0)); }
    for (const b of bs) for (const s of seatsOf(b, 2)) if (chance(.55)) C.add({ ...s, mode: MODE.sit });
    for (const [tx, tz] of [[-7.2, 1.0], [7.2, 1.0], [-7.2, 5.6], [7.2, 5.6], [-12.6, 6.6], [12.6, 6.6], [-3.6, -1.3], [5.4, -1.4]]) tree(st, tx, tz, rr(.9, 1.1), 'autumn', { pit: true });
    for (const lx of [-6, 0, 6]) { lamp(st, lx, .4, { h: 2.6, arms: 2 }); lamp(st, lx, 6.0, { h: 2.6, arms: 2 }); }
    for (const bx of [-8.4, 8.4]) bin(st, bx, 4.6);
    // kestane cart + smoke, simit cart
    { const kc = group(st, -4.0, 0, 6.6, .2); box(kc, .9, .45, .55, '#2f2f33', 0, .25, 0); for (const s of [-.3, .3]) { const w = cyl(kc, .16, .16, .05, '#222', s, 0, .3, 10); w.rotation.x = Math.PI / 2; w.position.y = .16; } cyl(kc, .3, .3, .06, '#555', -.15, .7, 0, 14); for (let i = 0; i < 16; i++) blob(kc, .035, '#6a3a1a', -.15 + rr(-.22, .22), .78, rr(-.22, .22), true); box(kc, .3, .2, .3, '#c9a06a', .25, .7, 0); sign(kc, 'KESTANE', .6, .14, { bg: '#f2c46d', fg: '#3a1a0a' }, 0, .55, .28, 0, false, null); }
    { const sm = smoke(S, g, null, 8, '#cfc8c0'); const wp = V(-4.15, 1.0, 6.65); S.updates.push((t, dt) => sm(dt, wp, .5, t)); }
    C.add({ x: -4.05, z: 6.1, ry: .2, mode: MODE.idle, v: 'c', old: true });
    { const sc = group(st, 4.6, 0, 6.6, -.3); box(sc, .8, .4, .5, '#c3272e', 0, .26, 0); box(sc, .76, .4, .46, noOL(new THREE.MeshToonMaterial({ color: '#d8eef5', transparent: true, opacity: .4 })), 0, .66, 0).userData.keep = true; box(sc, .8, .04, .5, '#c3272e', 0, 1.06, 0); const tor = new THREE.TorusGeometry(.08, .032, 6, 12); for (let i = 0; i < 9; i++) { const s = mesh(tor, '#b8742e', sc, -.26 + (i % 3) * .26, .7 + Math.floor(i / 3) * .11, (i % 2) * .05 - .02); s.rotation.x = Math.PI / 2 - .3; s.castShadow = false; } sign(sc, 'SİMİT', .56, .15, { bg: '#fff3d6', fg: '#c3272e' }, 0, 1.25, 0, 0, false, '#c3272e'); }
    C.add({ x: 4.7, z: 6.1, ry: -.3, mode: MODE.idle, v: 'm' });
    // pigeons & feeders in front of Ulu Cami
    pigeons(S, g, 26, -9, -6.6, 6, 1.8, 7, 24, 0, -9, 1.4);
    for (const [px, pz] of [[-10.2, 1.6], [-8.0, 2.0], [-9.0, .8]]) C.add({ x: px, z: pz, ry: Math.PI + rr(-.4, .4), mode: MODE.wave });
    // walkers
    const W = (pts, n, o = {}) => { for (let i = 0; i < n; i++) C.add({ path: { pts: lane(pts, rr(-.3, .3)), offset: R(), start: ri(0, Math.max(0, pts.length - 2)), waits: o.waits }, v: o.v }); };
    W([V(-14, 0, 7.4), V(14, 0, 7.4)], 5); W([V(-14, 0, 11.4), V(14, 0, 11.4)], 4);
    W([V(-7.4, 0, -.1), V(7.2, 0, -.1)], 3);
    W([V(8.2, 0, -2.4), V(6.6, 0, -.4), V(6.6, 0, 6.8), V(1.0, 0, 7.4), V(1.0, 0, 11.2)], 4);
    W([V(-9.1, 0, 1.2), V(-4.0, 0, .9), V(-.8, 0, -1.6), V(1.9, 0, -2.8), V(1.9, 0, -7.4)], 3, { waits: { 4: { t: [2, 4], mode: MODE.browse, face: Math.PI } } });
    W([V(-14, 0, -.2), V(-14, 0, 7.2)], 1);
    // teleferik: base station at the back-right corner, cabins climbing towards Uludağ
    { const ts = group(st, 13.9, 0, -10.0); box(ts, 2.0, .01, 1.6, '#ccc', 0, 0, 0); box(ts, 2.0, 1.6, 1.6, '#e8e8e8', 0, 0, 0); box(ts, 2.2, .1, 1.8, '#c9302c', 0, 1.6, 0); box(ts, 1.8, .9, .05, M('#3a4a5a'), 0, .3, .81); sign(ts, 'TELEFERİK', 1.4, .22, { bg: '#c9302c', fg: '#fff' }, 0, 1.38, .83, 0, false, null); cyl(ts, .12, .14, 2.0, '#8a8f96', .7, 1.6, -.3, 8); cyl(ts, .12, .14, 2.0, '#8a8f96', -.7, 1.6, -.3, 8); }
    const A = V(13.9, 3.6, -10.3), B = V(28, 34, -80);
    line(g, [A.clone().add(V(-.3, 0, 0)), B.clone().add(V(-.3, 0, 0))], '#333'); line(g, [A.clone().add(V(.3, 0, 0)), B.clone().add(V(.3, 0, 0))], '#333');
    const cabs = []; for (let i = 0; i < 6; i++) { const cb = group(g); box(cb, .5, .45, .45, '#c9302c', 0, -.6, 0); box(cb, .52, .2, .47, N('#3a4a5a'), 0, -.42, 0); rod(cb, V(0, -.15, 0), V(0, 0, 0), .015, '#333', 4); cabs.push({ cb, k: i / 6, side: i % 2 ? .3 : -.3 }); }
    S.updates.push((t) => { for (const c of cabs) { const k = ((c.k + t * .012 * (c.side > 0 ? 1 : -1)) % 1 + 1) % 1; c.cb.position.lerpVectors(A, B, k); c.cb.position.x += c.side; c.cb.position.y -= Math.sin(Math.PI * k) * 2; } });
    // cats, dog
    cat(S, st, 6.4, -2.6, .3, '#d98a3d', true); cat(S, st, -4.4, -.2, 2, '#2b2b2b'); cat(S, st, 9.6, 1.5, -1, '#f2efe8', true); dog(S, st, 13.4, 1.8, 2.4, '#c9a77a', true);
    petals(S, g, 160, [15, 8, 10], ['#e0a03a', '#d5862c', '#efc24a', '#c96a2a'], .17, .4, [0, 0, 0]);
  }
};
