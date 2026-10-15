import { THREE, TAU, R, rr, ri, pick, chance, lerp, ease, smooth, V, M, E, N, EN, noOL, box, cyl, rod, blob, ell, dome, cone, archWin, line, sag, group, sign, texMat, tileTex, decal, glow, ctex, UB, PLANE, mesh, cg, dotTex, glowTex, SPH2 } from '../kit.js';
import { tree, bench, seatsOf, lamp, bin, stall, goods, cat, dog, shade, flowers, hedge, planter } from '../props.js';
import { motes, stars, sunLight, base, water } from '../dyn.js';
import { MODE, lane, chat } from '../people.js';

const ST = '#cfcabf', LEAD = '#5d6a7e';
function minaret(p, x, z, h = 10, bal = 2, c = ST, r = .32) {
  const g = group(p, x, 0, z);
  cyl(g, r * 1.6, r * 1.75, 1.2, c, 0, 0, 0, 12); cyl(g, r, r * 1.1, h - 1.2, c, 0, 1.2, 0, 12);
  const ys = bal === 3 ? [h * .5, h * .68, h * .86] : bal === 2 ? [h * .55, h * .8] : [h * .7];
  for (const y of ys) { cyl(g, r * 1.65, r * 1.1, .3, c, 0, y - .3, 0, 12); cyl(g, r * 1.65, r * 1.65, .06, shade(c, -.1), 0, y, 0, 12); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; box(g, .03, .26, .03, N('#8a8578'), Math.sin(a) * r * 1.6, y, Math.cos(a) * r * 1.6).castShadow = false; } box(g, .1, .2, .02, EN('#ffd890'), 0, y + .05, r * 1.15).castShadow = false; }
  cyl(g, r, r * .95, .5, c, 0, h, 0, 12); cone(g, r * 1.15, 2.0, LEAD, 0, h + .5, 0, 12); cyl(g, .025, .025, .5, '#d9b552', 0, h + 2.5, 0, 6); blob(g, .07, '#e2c060', 0, h + 3.05, 0, true);
  return g;
}
/* Sultanahmet (Blue) Mosque: prayer hall with the cascade of domes, arcaded courtyard with şadırvan, six minarets. Axis along x. */
function blueMosque(st, S, x, z) {
  const g = group(st, x, 0, z);
  const Mo = group(g, 2.6, 0, 0);
  box(Mo, 9.4, .4, 9.4, '#a39d92', 0, 0, 0); box(Mo, 7.6, 3.3, 7.6, ST, 0, .4, 0); box(Mo, 7.8, .2, 7.8, '#b5afa3', 0, 3.7, 0);
  for (const [fx, fz, ry] of [[0, 3.82, 0], [0, -3.82, Math.PI], [3.82, 0, Math.PI / 2], [-3.82, 0, -Math.PI / 2]]) { const q = group(Mo, fx, 0, fz, ry); for (let row = 0; row < 2; row++) for (let i = 0; i < 6; i++) archWin(q, .36, .7, .08, E(row ? '#ffcf7a' : '#ffbf5a'), -2.6 + i * 1.04, 1.0 + row * 1.25, 0); }
  cyl(Mo, 2.75, 2.85, 1.0, ST, 0, 3.9, 0, 24);
  for (let i = 0; i < 20; i++) { const a = i / 20 * TAU; const q = group(Mo, Math.sin(a) * 2.83, 4.2, Math.cos(a) * 2.83, a); archWin(q, .2, .45, .06, E('#ffd890'), 0, 0, 0); }
  dome(Mo, 2.8, LEAD, 0, 4.9, 0, 28); cyl(Mo, .04, .04, .9, '#d9b552', 0, 7.7, 0, 6); blob(Mo, .1, '#e2c060', 0, 8.65, 0, true);
  const semi = cg('semi', () => new THREE.SphereGeometry(1.8, 18, 10, -Math.PI / 2, Math.PI, 0, Math.PI / 2));
  for (const [sx, sz, ry] of [[0, 3.8, 0], [0, -3.8, Math.PI], [3.8, 0, Math.PI / 2], [-3.8, 0, -Math.PI / 2]]) { const s = mesh(semi, LEAD, Mo, sx * .82, 3.9, sz * .82); s.rotation.y = ry; }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { cyl(Mo, .75, .8, .8, ST, sx * 3.3, 3.8, sz * 3.3, 10); dome(Mo, .8, LEAD, sx * 3.3, 4.6, sz * 3.3, 14); cyl(Mo, .02, .02, .5, '#d9b552', sx * 3.3, 5.4, sz * 3.3, 4); }
  for (const [sx, sz] of [[-2.4, 3.3], [2.4, 3.3], [-2.4, -3.3], [2.4, -3.3], [3.3, 2.4], [3.3, -2.4], [-3.3, 2.4], [-3.3, -2.4]]) { cyl(Mo, .5, .55, .5, ST, sx, 3.8, sz, 10); dome(Mo, .55, LEAD, sx, 4.3, sz, 12); }
  box(Mo, 2.0, 3.2, .4, '#bdb7ab', 0, .4, 3.9); archWin(Mo, 1.1, 2.2, .1, E('#ffcc78'), 0, .4, 4.12);
  // courtyard to the -x side
  const Cy = group(g, -4.9, 0, 0, -Math.PI / 2);
  box(Cy, 7.4, .25, 7.4, '#a39d92', 0, 0, 0);
  for (const sx of [-1, 1]) { box(Cy, .6, 1.8, 7.4, ST, sx * 3.4, .25, 0); for (let i = 0; i < 6; i++) { archWin(group(Cy, sx * 3.09, 0, -2.75 + i * 1.1, -sx * Math.PI / 2), .5, 1.0, .08, M('#2a2f45'), 0, .4, 0); dome(Cy, .32, LEAD, sx * 3.4, 2.05, -2.75 + i * 1.1, 10, .6); } }
  box(Cy, 7.4, 1.8, .6, ST, 0, .25, 3.4); for (let i = 0; i < 6; i++) { archWin(Cy, .5, 1.0, .08, E('#ffb85a'), -2.75 + i * 1.1, .4, 3.72); dome(Cy, .32, LEAD, -2.75 + i * 1.1, 2.05, 3.4, 10, .6); }
  box(Cy, 2.0, 2.8, .7, '#bdb7ab', 0, .25, 3.4); archWin(Cy, 1.0, 1.7, .1, E('#ffcc78'), 0, .25, 3.76);
  cyl(Cy, 1.1, 1.2, .9, '#d8d2c6', 0, .25, 0, 8); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; cyl(Cy, .06, .06, 1.3, '#d8d2c6', Math.sin(a) * 1.15, 1.15, Math.cos(a) * 1.15, 6); }
  dome(Cy, 1.45, LEAD, 0, 2.45, 0, 16, .5); cyl(Cy, 1.5, 1.5, .12, '#b0aa9e', 0, 2.4, 0, 8); glow(Cy, 0, 1.2, 0, 3, '#9fd0ff', .3);
  for (const [mx, mz, h, b] of [[-1.5, 4.5, 11, 3], [6.7, 4.5, 11, 3], [-1.5, -4.5, 11, 3], [6.7, -4.5, 11, 3], [-8.9, 3.9, 8.5, 2], [-8.9, -3.9, 8.5, 2]]) minaret(g, mx, mz, h, b);
  return { g, mahya: [V(x - 1.5, 0, z + 4.5), V(x + 6.7, 0, z + 4.5)] };
}
/* Hagia Sophia: pink-red mass, shallow dome on a windowed drum, two semidomes on the long axis, heavy buttresses, four minarets. */
function hagiaSophia(st, S, x, z) {
  const g = group(st, x, 0, z); const C1 = '#b96d62', C2 = '#d9b98a', C3 = '#c98076';
  box(g, 10, 4.8, 8, C1, 0, 0, 0);
  for (let k = 1; k < 5; k++) box(g, 10.02, .1, 8.02, N(C2), 0, k * .95, 0).castShadow = false;
  for (const s of [-1, 1]) { const q = group(g, 0, 0, s * 4.0, s < 0 ? Math.PI : 0); for (let i = 0; i < 7; i++) { archWin(q, .5, 1.1, .06, E('#ffcf8a'), -3.9 + i * 1.3, .5, .02); archWin(q, .4, .8, .06, E('#ffcf8a'), -3.9 + i * 1.3, 2.4, .02); } }
  for (const s of [-1, 1]) { const q = group(g, s * 5.0, 0, 0, s * Math.PI / 2); for (let i = 0; i < 5; i++) archWin(q, .5, 1.1, .06, E('#ffcf8a'), -2.6 + i * 1.3, .5, .02); }
  // narthex / outer narthex on the west (-x)
  box(g, 2.0, 4.0, 8.4, C3, -6.0, 0, 0); box(g, 2.1, .1, 8.5, LEAD, -6.0, 4.0, 0);
  // buttresses on the north and south flanks
  for (const s of [-1, 1]) for (const bx of [-2.2, 2.2]) { box(g, 2.0, 6.6, 2.2, C1, bx, 0, s * 4.9); box(g, 2.05, .1, 2.25, N(C2), bx, 3.3, s * 4.9).castShadow = false; const w = box(g, 2.0, 1.2, 2.2, C1, bx, 6.6, s * 4.9); w.scale.z = .5; w.position.z = s * 4.35; }
  // drum, dome, semidomes, exedrae
  box(g, 7.6, 1.2, 7.6, C1, 0, 4.8, 0);
  cyl(g, 3.75, 3.75, 1.1, C1, 0, 6.0, 0, 40);
  for (let i = 0; i < 40; i++) { const a = i / 40 * TAU; const q = group(g, Math.sin(a) * 3.73, 6.25, Math.cos(a) * 3.73, a); archWin(q, .26, .6, .08, E('#ffd890'), 0, 0, 0); }
  dome(g, 3.7, LEAD, 0, 7.1, 0, 36, .62); cyl(g, .05, .05, .9, '#d9b552', 0, 9.4, 0, 6); blob(g, .11, '#e2c060', 0, 10.3, 0, true);
  const semi = cg('semiHS', () => new THREE.SphereGeometry(2.7, 24, 12, -Math.PI / 2, Math.PI, 0, Math.PI / 2));
  for (const s of [-1, 1]) { box(g, 2.0, 1.0, 6.4, C1, s * 3.4, 4.8, 0); const m = mesh(semi, LEAD, g, s * 3.0, 5.4, 0); m.rotation.y = s * Math.PI / 2; m.scale.set(1, .72, 1); }
  const ex = cg('exHS', () => new THREE.SphereGeometry(1.4, 16, 8, -Math.PI / 2, Math.PI, 0, Math.PI / 2));
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const m = mesh(ex, LEAD, g, sx * 4.8, 4.5, sz * 2.4); m.rotation.y = sx * Math.PI / 2 + sz * .6; m.scale.set(1, .7, 1); }
  for (const [mx, mz, c] of [[-6.4, 4.6, '#b85a4e'], [5.6, 4.6, '#e3d8c2'], [-6.4, -4.6, '#e3d8c2'], [5.6, -4.6, '#e3d8c2']]) minaret(g, mx, mz, 9.5, 1, c, .36);
  for (const s of [-1, 1]) { const sp = new THREE.SpotLight('#ffd9b0', 26, 34, .5, .7, 1.5); sp.position.set(s * 9, .5, 7); sp.target.position.set(0, 7, 0); g.add(sp, sp.target); }
  return g;
}

export default {
  id: 'ramazan', seed: 55, chip: 'Ramazan', title: 'Sultanahmet', crowdCap: 80,
  sub: 'Ramazan gecesi: bir yanda Sultanahmet Camii, karşısında Ayasofya; parkta iftar sofraları, tezgâhlar ve mahya.',
  meta: '41.0054° K · 28.9768° D · Mart, 21:30', night: true,
  sky: 'linear-gradient(180deg,#070b26 0%,#141a48 45%,#2e2a5e 80%,#4a3560 100%)', fog: ['#1c1a3c', 60, 150],
  shots: [
    { a: [-62, -36], e: [27, 23], r: [56, 50], t: [[0, 3.5, 1]], d: 8.5 },
    { a: [-104, -76], e: [6, 10], r: [15, 11.5], t: [[-.5, 2.2, 2], [-.5, 4.4, -2]], d: 7.5 },
    { a: [-152, -124], e: [12, 17], r: [19, 18], t: [[-8.5, 1.4, 6]], d: 7.5 },
    { a: [80, 125], e: [31, 37], r: [42, 38], t: [[2, 4, 3]], d: 7.5 },
  ],
  build(S) {
    const st = S.static, g = S.group, C = S.crowd;
    g.add(new THREE.HemisphereLight('#4a5aa0', '#151022', .7));
    sunLight(S, '#a9b8ff', .55, [16, 26, 14], 28);
    base(st, 30, 44, 0, 0, '#7c766f', '#4f3828');
    const pav = tileTex('#8f8a82', '#77726a', 10, 10, 8); pav.wrapS = pav.wrapT = THREE.RepeatWrapping; pav.repeat.set(14, 20); decal(st, pav, 30, 44, 0, .004, 0);
    // ---- the two monuments facing each other across the park
    const BM = blueMosque(st, S, 0, -15.5);
    hagiaSophia(st, S, 1.0, 16.5);
    for (const sx of [-1, 1]) { const sp = new THREE.SpotLight('#ffe0b0', 30, 34, .5, .7, 1.5); sp.position.set(sx * 7, .5, -6); sp.target.position.set(2.6, 6, -15.5); g.add(sp, sp.target); }
    // mahya between the two park-side minarets
    { const txt = 'HOŞ GELDİN RAMAZAN'; const cw = 340, chh = 40; const c = document.createElement('canvas'); c.width = cw; c.height = chh; const q = c.getContext('2d'); q.fillStyle = '#fff'; q.font = '900 30px Figtree, sans-serif'; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText(txt, cw / 2, chh / 2 + 2);
      const [A, B] = BM.mahya; const mx = (A.x + B.x) / 2, mz = A.z + .05, mw = B.x - A.x;
      const d = q.getImageData(0, 0, cw, chh).data, pts = []; for (let yy = 0; yy < chh; yy += 3) for (let xx = 0; xx < cw; xx += 3) if (d[(yy * cw + xx) * 4 + 3] > 128) pts.push(mx + (xx / cw - .5) * mw * .92, 8.3 - (yy / chh) * .95 + .45, mz);
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      const mm = new THREE.PointsMaterial({ size: .16, map: dotTex, color: '#fff1c2', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
      const P = new THREE.Points(geo, mm); P.frustumCulled = false; g.add(P); S.updates.push((t) => { mm.opacity = .85 + Math.sin(t * 3) * .15; });
      for (const y of [9.3, 7.6]) line(g, sag(V(A.x, y, mz), V(B.x, y, mz), .05), '#3a3550'); glow(g, mx, 8.4, mz + .3, 9, '#ffd98a', .15); }
    // ---- park: lawns, hedges, central path, round pool with jets
    for (const sx of [-1, 1]) { box(st, 7.5, .06, 17, '#2c4a32', sx * 9.5, 0, 1.5).castShadow = false; hedge(st, sx * 5.9, -6.8, sx * 5.9, 9.8, '#2a4a30', .4); }
    box(st, 4.2, .04, 20, '#9a948a', 0, 0, 1.5).castShadow = false;
    for (const sx of [-1, 1]) box(st, 7.5, .04, 2.0, '#9a948a', sx * 9.5, 0, 1.5).castShadow = false;
    { cyl(st, 3.3, 3.4, .35, '#cfc6b4', 0, 0, 1.5, 32); cyl(st, 3.0, 3.0, .02, N('#2d6a8a'), 0, .35, 1.5, 32).castShadow = false; water(S, g, 5.8, 5.8, 0, .36, 1.5, '#4f9bc2', .3); cyl(st, .5, .6, .5, '#cfc6b4', 0, .35, 1.5, 12);
      const jets = []; for (let i = 0; i < 9; i++) { const a = i / 8 * TAU; const jx = i === 8 ? 0 : Math.cos(a) * 2.0, jz = i === 8 ? 1.5 : 1.5 + Math.sin(a) * 2.0; const geo = new THREE.BufferGeometry(); const n = 36; const pos = new Float32Array(n * 3); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: '#dff4ff', size: .08, transparent: true, opacity: .85 })); pts.frustumCulled = false; g.add(pts); jets.push({ jx, jz, pos, geo, n, ph: R() * 9, h: i === 8 ? 2.4 : 1.2 }); }
      S.updates.push((t) => { for (const j of jets) { const h = j.h + Math.sin(t * .8 + j.ph) * .3; for (let k = 0; k < j.n; k++) { const u = ((t * .9 + k / j.n) % 1); const a = k * 2.4; const r = u * .3; j.pos[k * 3] = j.jx + Math.cos(a) * r; j.pos[k * 3 + 1] = .4 + h * 4 * u * (1 - u); j.pos[k * 3 + 2] = j.jz + Math.sin(a) * r; } j.geo.attributes.position.needsUpdate = true; } });
      for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; const L = new THREE.PointLight(['#ff8a5a', '#5ad0ff', '#ffd25a', '#b05aff'][i % 4], 2.2, 5, 1.8); L.position.set(Math.cos(a) * 2.0, .7, 1.5 + Math.sin(a) * 2.0); g.add(L); glow(g, Math.cos(a) * 2.0, .6, 1.5 + Math.sin(a) * 2.0, 1.6, ['#ff8a5a', '#5ad0ff', '#ffd25a', '#b05aff'][i % 4], .5); } }
    for (const sx of [-1, 1]) for (const z of [-9.4, 12.2]) { planter(st, sx * 3.0, z, 1.6, .5, '#9a8f80', 0, ['#d6304a', '#f2c230', '#f6f0e6']); }
    // ---- Ramadan fair: stalls on both sides of the central path
    const defs = [['pide', 'RAMAZAN PİDESİ', ['#b8202b', '#f6eee0']], ['lokum', 'LOKUM · AKİDE', ['#2a7a4b', '#f6eee0']], ['serbet', 'OSMANLI ŞERBETİ', ['#1f4f9e', '#f6eee0']], ['sweets', 'GÜLLAÇ · BAKLAVA', ['#d26a1e', '#f6eee0']], ['toys', 'OYUNCAK', ['#7a2a8a', '#f6eee0']], ['books', 'SAHAF', ['#1e6a6a', '#f6eee0']]];
    const SZ = [-6.6, -4.0, -1.4, 4.4, 7.0, 9.6];
    defs.forEach((d, i) => { const left = i % 2 === 0; const sv = stall(st, left ? -3.2 : 3.2, SZ[i], left ? Math.PI / 2 : -Math.PI / 2, { goods: goods[d[0]], label: d[1], awn: d[2], night: true, W: 2.2, D: 1.3 }); C.add({ x: sv.behind.x, z: sv.behind.z, ry: sv.ry, mode: MODE.vendor, v: pick(['c', 'm', 'h', 'w']), look: { top: '#ffffff' } }); });
    for (const [x, z] of [[-3, -4], [3, 7]]) { const L = new THREE.PointLight('#ffb35a', 9, 10, 1.4); L.position.set(x, 2.4, z); g.add(L); }
    // queue at the pide stall
    for (let i = 0; i < 5; i++) C.add({ x: -2.2 + i * .42, z: -6.6 + (i % 2) * .15, ry: -Math.PI / 2, mode: pick([MODE.idle, MODE.standPhone, MODE.talk]), v: pick(['m', 'f', 'h', 'c', 'b', 'g']) });
    // string lights and lanterns over the path
    const bulbs = []; const bc = ['#ffd27a', '#ff7a7a', '#7ad0ff', '#a6ff8a', '#ffd27a'];
    for (let i = 0; i < 8; i++) { const z1 = -8 + i * 2.4, z2 = z1 + 1.2; const a = V(i % 2 ? -2.3 : 2.3, 3.0, z1), b = V(i % 2 ? 2.3 : -2.3, 3.0, z2); const pts = sag(a, b, .35, 10); line(g, pts, '#2a2530'); pts.forEach((p, k) => bulbs.push([p, bc[(i + k) % bc.length]])); }
    { const im = new THREE.InstancedMesh(SPH2, noOL(new THREE.MeshBasicMaterial()), bulbs.length); const dm = new THREE.Object3D(); const col = new THREE.Color(); bulbs.forEach(([p, c], i) => { dm.position.copy(p); dm.position.y -= .06; dm.scale.setScalar(.05); dm.updateMatrix(); im.setMatrixAt(i, dm.matrix); im.setColorAt(i, col.set(c)); }); im.frustumCulled = false; g.add(im);
      const geo = new THREE.BufferGeometry().setFromPoints(bulbs.map((b) => b[0].clone().add(V(0, -.06, 0)))); const pm = new THREE.PointsMaterial({ size: .5, map: glowTex, color: '#ffcf8a', transparent: true, opacity: .55, depthWrite: false, blending: THREE.AdditiveBlending }); const P = new THREE.Points(geo, pm); P.frustumCulled = false; g.add(P); S.updates.push((t) => { pm.opacity = .45 + .15 * Math.sin(t * 4); }); }
    const lcols = ['#ff6a3a', '#3ad0ff', '#ffd23a', '#c05aff', '#5aff9a']; const lans = [];
    for (let i = 0; i < 10; i++) { const x = (i % 2 ? 1.4 : -1.4), z = -7 + i * 1.8; const c = lcols[i % lcols.length]; const lg = group(g, x, 2.9, z); line(lg, [V(0, 0, 0), V(0, -.3, 0)], '#2a2530'); const b = mesh(cg('lan', () => new THREE.CylinderGeometry(.08, .12, .26, 6)), E(c), lg, 0, -.45, 0); b.castShadow = false; cyl(lg, .02, .11, .08, '#c9a64a', 0, -.34, 0, 6); glow(lg, 0, -.45, 0, .9, c, .7); lans.push([lg, R() * 9]); }
    S.updates.push((t) => { for (const [l, ph] of lans) { l.rotation.z = Math.sin(t * 1.3 + ph) * .08; l.rotation.x = Math.cos(t * 1.1 + ph) * .06; } });
    // mesir macunu cart, simit cart
    { const mc = group(st, 8.0, 0, 11.6, -.5); box(mc, 1.3, .6, .9, '#c9302c', 0, .3, 0); for (const sx of [-.45, .45]) { const w = cyl(mc, .3, .3, .06, '#c9a64a', sx, 0, .48, 12); w.rotation.x = Math.PI / 2; w.position.y = .3; } const mcols = ['#e94b3c', '#f2c230', '#4caf6a', '#3a86c8', '#f08a3c', '#b04ad0']; for (let i = 0; i < 6; i++) cyl(mc, .5 - i * .075, .52 - i * .075, .14, mcols[i], 0, .9 + i * .14, 0, 14); cyl(mc, .02, .02, .5, '#ddd', 0, 1.74, 0, 4); sign(mc, 'MESİR MACUNU', 1.2, .26, { bg: '#fdf3dc', fg: '#c9302c' }, 0, .78, .46, 0, true, null); glow(mc, 0, 1.4, .4, 2.2, '#ffcf8a', .35); }
    C.add({ x: 7.75, z: 10.9, ry: -.5 + Math.PI, mode: MODE.vendor, v: 'c', look: { top: '#c9302c', acc: '#f2c230' } });
    for (const [px, pz] of [[8.5, 12.6], [7.3, 12.5]]) C.add({ x: px, z: pz, ry: Math.PI - .4, mode: MODE.browse, v: 'k' });
    // iftar table on the west lawn path
    { const T = group(st, -9.5, 0, 3.5); box(T, 1.1, .32, 8, '#f2efe8', 0, 0, 0); box(T, 1.14, .03, 8.04, '#e3dccd', 0, .32, 0);
      for (let i = 0; i < 11; i++) { const z = -3.5 + i * .7; for (const s of [-1, 1]) { cyl(T, .12, .1, .02, '#ffffff', s * .3, .34, z, 10); cyl(T, .05, .05, .02, '#c88a3a', s * .3, .36, z, 8); box(T, .3, .2, .3, '#7a4e2e', s * .8, 0, z); } }
      for (let i = 0; i < 6; i++) { ell(T, .16, .045, .2, '#c88a3a', 0, .38, -3.2 + i * 1.3); cyl(T, .04, .035, .12, E('#ffe6b0'), .1, .34, -2.8 + i * 1.3, 6); glow(T, .1, .5, -2.8 + i * 1.3, .7, '#ffcf8a', .7); cyl(T, .06, .05, .14, noOL(new THREE.MeshToonMaterial({ color: '#c0182a', transparent: true, opacity: .8 })), -.25, .34, -2.5 + i * 1.3, 8).userData.keep = true; }
      const L = new THREE.PointLight('#ffc070', 6, 8, 1.5); L.position.set(0, 2, 0); T.add(L); }
    for (let i = 0; i < 11; i++) for (const s of [-1, 1]) if (chance(.85)) C.add({ x: -9.5 + s * .8, y: .01, z: 3.5 - 3.5 + i * .7, ry: s > 0 ? -Math.PI / 2 : Math.PI / 2, mode: pick([MODE.sit, MODE.sit, MODE.talk]), v: pick(['m', 'f', 'h', 's', 'c', 'k', 'hb', 'g', 'gf']) });
    C.add({ v: 'w', speed: .45, path: { pts: [V(-8.0, .01, -1.6), V(-8.0, .01, 8.2)], mode: MODE.carry, offset: R(), waits: { 0: { t: [2, 4], mode: MODE.browse, face: Math.PI }, 1: { t: [2, 4], mode: MODE.browse, face: 0 } } } });
    // trees, lamps, benches
    for (const [x, z] of [[-13, -8], [13, -8], [-13, 0], [13, 0], [-13, 10], [13, 10], [-7.5, -3.5], [7.5, -3.5], [-7.5, 7.5], [7.5, 7.5], [-12.5, 15], [12.5, 15], [-12.5, -14], [12.5, -14]]) tree(st, x, z, rr(1.0, 1.3), 'night');
    for (const [x, z] of [[-5.3, -3.5], [5.3, -3.5], [-5.3, 6.5], [5.3, 6.5], [-5.3, 12.5], [5.3, 12.5], [-5.3, -9.5], [5.3, -9.5]]) lamp(st, x, z, { h: 3.0, night: true, color: '#ffd48a' });
    const bs = []; for (const z of [-2.5, 5.5]) bs.push(bench(st, 4.0, z, -Math.PI / 2, { c: '#6a4a32' }), bench(st, -4.0, z, Math.PI / 2, { c: '#6a4a32' })); for (const z of [4.5, 6.8]) bs.push(bench(st, 12.6, z, -Math.PI / 2, { c: '#6a4a32' }));
    for (const b of bs) for (const s of seatsOf(b, 2)) if (chance(.75)) C.add({ ...s, mode: pick([MODE.sit, MODE.sitPhone, MODE.sitRelax, MODE.talk]) });
    { const d = cyl(st, .3, .3, .45, '#b8202b', 11.8, .62, -2.0, 14); d.rotation.z = Math.PI / 2; box(st, 1.2, .4, .45, '#5e3a22', 11.8, 0, -2.0); }
    // ---- people: strolling the fair, crossing the park, photographers, groups
    const lanes = [-1.0, -.35, .35, 1.0];
    for (let i = 0; i < 14; i++) { const x = lanes[i % 4] + rr(-.1, .1); const pts = [V(x, .03, 12.8), V(x, .03, 9.4), V(x, .03, 6.0), V(x, .03, -2.0), V(x, .03, -5.0), V(x, .03, -8.6)]; const side = x < 0 ? -1 : 1; const waits = {}; if (chance(.6)) waits[pick([1, 2, 4])] = { t: [2, 4], mode: MODE.browse, face: side < 0 ? -Math.PI / 2 : Math.PI / 2 }; C.add({ path: { pts, offset: R(), start: ri(0, 4), waits }, v: pick(['m', 'f', 's', 'h', 'b', 'fb', 'hb', 'k', 'c', 'g', 'gf']) }); }
    for (let i = 0; i < 4; i++) C.add({ path: { pts: [V(-13, .03, 1.3 + i * .1), V(13, .03, 1.3 + i * .1)], offset: R() } });
    for (let i = 0; i < 3; i++) C.add({ path: { pts: [V(-13, .03, -9.0 + i * .2), V(13, .03, -9.0 + i * .2)], offset: R() } });
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; const pts = []; for (let k = 0; k < 10; k++) { const b = a + k / 10 * TAU; pts.push(V(Math.cos(b) * 4.0, .03, 1.5 + Math.sin(b) * 4.0)); } C.add({ path: { pts, loop: true, offset: R(), start: ri(0, 8) }, v: pick(['m', 'f', 'b', 'fb', 'k']) }); }
    chat(C, -1.6, -3.2, 3); chat(C, 2.0, 11.2, 2); chat(C, -11.2, -3.0, 2, 0, { old: true });
    for (const [px, pz, tz] of [[-1.2, 13.4, -15.5], [1.6, 13.3, -15.5], [-.6, -9.4, 16.5], [2.4, -9.6, 16.5]]) C.add({ x: px, z: pz, ry: Math.atan2(0 - px, tz - pz), mode: MODE.photo });
    C.add({ x: 6.6, z: 2.2, ry: -Math.PI / 2, mode: MODE.selfie, v: 'f' }); C.add({ x: 6.65, z: 2.6, ry: -Math.PI / 2 + .2, mode: MODE.idle, v: 'm' });
    // davulcu
    { const dv = C.add({ v: 'c', path: { pts: [V(-1.6, .03, 12.5), V(-1.6, .03, -8.0), V(1.6, .03, -8.0), V(1.6, .03, 12.5)], loop: true, offset: R(), mode: MODE.carry }, speed: .45, look: { top: '#7a1e1e', acc: '#c9302c' } });
      const drum = group(g); const dm = cyl(drum, .2, .2, .28, '#b8202b', 0, 0, 0, 14); dm.rotation.x = Math.PI / 2; dm.position.set(0, .34, .18); const dh = cyl(drum, .21, .21, .02, '#f2ece0', 0, 0, 0, 14); dh.rotation.x = Math.PI / 2; dh.position.set(0, .34, .32);
      dv.onTick = (a) => { drum.position.set(a.fx, a.pos.y, a.fz); drum.rotation.y = a.ry; }; }
    // kids with balloons running on the east lawn path
    for (let i = 0; i < 3; i++) { const kid = C.add({ v: 'k', speed: rr(.7, .9), path: { pts: [V(rr(7.5, 9.6), .03, rr(-1, 1)), V(rr(7.5, 9.6), .03, rr(3, 5)), V(rr(7.5, 9.6), .03, rr(-1, 1))], mode: MODE.run, offset: R() } }); const bl = blob(g, .14, pick(['#e94b3c', '#f2c230', '#3a86c8', '#b04ad0']), 0, 1.2, 0, true); const ln = line(g, [V(0, 0, 0), V(0, 1, 0)], '#ddd'); kid.onTick = (a, t) => { const x = a.fx, z = a.fz; bl.position.set(x - Math.sin(a.ry) * .2, 1.25 + Math.sin(t * 2 + a.ph) * .04, z - Math.cos(a.ry) * .2); ln.position.set(x, .35, z); ln.scale.y = .85; ln.lookAt(bl.position); }; }
    cat(S, st, 1.2, 12.6, 2.4, '#d98a3d', true); cat(S, st, -6.6, 11.0, .3, '#2b2b2b'); dog(S, st, 12.4, -5.2, 2.2, '#c9a77a', true);
    stars(g, 700, 1);
    const moon = ctex(256, 256, (q) => { q.fillStyle = '#fff6d8'; q.beginPath(); q.arc(128, 128, 90, 0, TAU); q.fill(); q.globalCompositeOperation = 'destination-out'; q.beginPath(); q.arc(165, 110, 80, 0, TAU); q.fill(); });
    { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: moon, transparent: true, fog: false, depthWrite: false })); s.position.set(-40, 52, -80); s.scale.set(12, 12, 1); g.add(s); glow(g, -40, 52, -80.5, 30, '#9fb0ff', .25); }
    motes(S, g, 110, [13, 7, 16], '#ffcf8a', .1, .25, .6);
  }
};
