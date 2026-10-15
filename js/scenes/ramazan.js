import { THREE, TAU, R, rr, ri, pick, chance, lerp, ease, smooth, V, M, E, N, EN, noOL, box, cyl, rod, blob, ell, dome, cone, archWin, line, sag, group, sign, texMat, tileTex, decal, glow, ctex, UB, PLANE, mesh, cg, dotTex, glowTex, SPH2 } from '../kit.js';
import { tree, bench, seatsOf, lamp, bin, stall, goods, cat, dog, shade, flowers, hedge } from '../props.js';
import { motes, stars, sunLight, base } from '../dyn.js';
import { MODE, lane } from '../people.js';

const ST = '#c9c4ba', LEAD = '#5d6a7e';
function minaret(p, x, z, h = 10) {
  const g = group(p, x, 0, z);
  cyl(g, .5, .55, 1.2, ST, 0, 0, 0, 12); cyl(g, .3, .36, h - 1.2, ST, 0, 1.2, 0, 12);
  for (const y of [h * .55, h * .78]) { cyl(g, .52, .36, .3, ST, 0, y - .3, 0, 12); cyl(g, .52, .52, .06, '#b0aa9e', 0, y, 0, 12); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; box(g, .03, .26, .03, N('#8a8578'), Math.sin(a) * .5, y, Math.cos(a) * .5).castShadow = false; } box(g, .1, .2, .02, EN('#ffd890'), 0, y + .05, .37).castShadow = false; }
  cyl(g, .32, .3, .5, ST, 0, h, 0, 12); cone(g, .36, 2.0, LEAD, 0, h + .5, 0, 12); cyl(g, .025, .025, .5, '#d9b552', 0, h + 2.5, 0, 6); blob(g, .07, '#e2c060', 0, h + 3.05, 0, true);
  return g;
}

export default {
  id: 'ramazan', seed: 55, chip: 'Ramazan', title: 'Sultanahmet', crowdCap: 70,
  sub: 'İftar sofraları kurulmuş, mahya yanmış. Meydanda pide kuyruğu, davulcu dolaşıyor.',
  meta: '41.0054° K · 28.9768° D · Mart, 21:30', night: true,
  sky: 'linear-gradient(180deg,#070b26 0%,#141a48 45%,#2e2a5e 80%,#4a3560 100%)', fog: ['#1c1a3c', 55, 130],
  shots: [
    { a: [-4, 16], e: [27, 23], r: [44, 39], t: [[0, 3.5, -3]], d: 8.5 },
    { a: [2, -2], e: [5, 10], r: [15, 10.5], t: [[0, 2.4, 5], [0, 4.6, 1]], d: 7.5 },
    { a: [-62, -40], e: [14, 18], r: [17, 16], t: [[-8.5, 1.2, 7]], d: 7.5 },
    { a: [58, 100], e: [22, 30], r: [33, 30], t: [[0, 4, -5]], d: 7.5 },
  ],
  build(S) {
    const st = S.static, g = S.group, C = S.crowd;
    g.add(new THREE.HemisphereLight('#4a5aa0', '#151022', .7));
    sunLight(S, '#a9b8ff', .55, [16, 26, 14], 23);
    base(st, 30, 28, 0, 0, '#7c766f', '#4f3828');
    const pav = tileTex('#8f8a82', '#77726a', 10, 10, 8); pav.wrapS = pav.wrapT = THREE.RepeatWrapping; pav.repeat.set(14, 13); decal(st, pav, 30, 28, 0, .004, 0);
    box(st, 8.5, .06, 11, '#2c4a32', -10.5, 0, 7).castShadow = false; box(st, 8.5, .06, 11, '#2c4a32', 10.5, 0, 7).castShadow = false;
    hedge(st, -6.3, 1.6, -6.3, 12.4, '#2a4a30', .4); hedge(st, 6.3, 1.6, 6.3, 12.4, '#2a4a30', .4);
    box(st, 3.6, .04, 11, '#9a948a', 0, 0, 7.5).castShadow = false;
    // ---- mosque
    const Mo = group(st, 0, 0, -7.5);
    box(Mo, 9.4, .4, 9.4, '#a39d92', 0, 0, 0); box(Mo, 7.6, 3.3, 7.6, ST, 0, .4, 0); box(Mo, 7.8, .2, 7.8, '#b5afa3', 0, 3.7, 0);
    for (const [fx, fz, ry] of [[0, 3.82, 0], [0, -3.82, Math.PI], [3.82, 0, Math.PI / 2], [-3.82, 0, -Math.PI / 2]]) { const q = group(Mo, fx, 0, fz, ry); for (let row = 0; row < 2; row++) for (let i = 0; i < 6; i++) { if (ry === 0 && row === 0 && Math.abs(i - 2.5) < 1) continue; archWin(q, .36, .7, .08, E(row ? '#ffcf7a' : '#ffbf5a'), -2.6 + i * 1.04, 1.0 + row * 1.25, 0); } }
    cyl(Mo, 2.75, 2.85, 1.0, ST, 0, 3.9, 0, 24);
    for (let i = 0; i < 20; i++) { const a = i / 20 * TAU; const q = group(Mo, Math.sin(a) * 2.83, 4.2, Math.cos(a) * 2.83, a); archWin(q, .2, .45, .06, E('#ffd890'), 0, 0, 0); }
    dome(Mo, 2.8, LEAD, 0, 4.9, 0, 28); cyl(Mo, .04, .04, .9, '#d9b552', 0, 7.7, 0, 6); blob(Mo, .1, '#e2c060', 0, 8.65, 0, true);
    const semi = cg('semi', () => new THREE.SphereGeometry(1.8, 18, 10, -Math.PI / 2, Math.PI, 0, Math.PI / 2));
    for (const [x, z, ry] of [[0, 3.8, 0], [0, -3.8, Math.PI], [3.8, 0, Math.PI / 2], [-3.8, 0, -Math.PI / 2]]) { const s = mesh(semi, LEAD, Mo, x * .82, 3.9, z * .82); s.rotation.y = ry; }
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) { cyl(Mo, .75, .8, .8, ST, sx * 3.3, 3.8, sz * 3.3, 10); dome(Mo, .8, LEAD, sx * 3.3, 4.6, sz * 3.3, 14); cyl(Mo, .02, .02, .5, '#d9b552', sx * 3.3, 5.4, sz * 3.3, 4); }
    box(Mo, 2.0, 3.2, .4, '#bdb7ab', 0, .4, 3.9); archWin(Mo, 1.1, 2.2, .1, E('#ffcc78'), 0, .4, 4.12);
    // courtyard
    const Cy = group(st, 0, 0, -.9);
    box(Cy, 9.4, .25, 5.6, '#a39d92', 0, 0, 0);
    for (const sx of [-1, 1]) { box(Cy, .6, 1.8, 5.6, ST, sx * 4.4, .25, 0); for (let i = 0; i < 5; i++) { archWin(group(Cy, sx * 4.09, 0, -2.2 + i * 1.1, -sx * Math.PI / 2), .5, 1.0, .08, M('#2a2f45'), 0, .4, 0); dome(Cy, .32, LEAD, sx * 4.4, 2.05, -2.2 + i * 1.1, 10, .6); } }
    for (const sx of [-1, 1]) { box(Cy, 3.4, 1.8, .6, ST, sx * 2.8, .25, 2.5); for (let i = 0; i < 3; i++) { archWin(Cy, .55, 1.0, .08, E('#ffb85a'), sx * (1.6 + i * 1.1), .4, 2.82); dome(Cy, .32, LEAD, sx * (1.6 + i * 1.1), 2.05, 2.5, 10, .6); } }
    box(Cy, 2.0, 2.8, .7, '#bdb7ab', 0, .25, 2.5); archWin(Cy, 1.0, 1.7, .1, E('#ffcc78'), 0, .25, 2.86);
    cyl(Cy, 1.1, 1.2, .9, '#d8d2c6', 0, .25, 0, 8); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; cyl(Cy, .06, .06, 1.3, '#d8d2c6', Math.sin(a) * 1.15, 1.15, Math.cos(a) * 1.15, 6); }
    dome(Cy, 1.45, LEAD, 0, 2.45, 0, 16, .5); cyl(Cy, 1.5, 1.5, .12, '#b0aa9e', 0, 2.4, 0, 8); glow(Cy, 0, 1.2, 0, 3, '#9fd0ff', .3);
    for (const [x, z] of [[-4.3, 1.6], [4.3, 1.6], [-4.3, -3.6], [4.3, -3.6], [-4.3, -11.4], [4.3, -11.4]]) minaret(st, x, z, z > 0 ? 10.2 : 11);
    // mahya
    { const txt = 'HOŞ GELDİN RAMAZAN'; const cw = 340, chh = 40; const c = document.createElement('canvas'); c.width = cw; c.height = chh; const q = c.getContext('2d'); q.fillStyle = '#fff'; q.font = '900 30px Figtree, sans-serif'; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText(txt, cw / 2, chh / 2 + 2);
      const d = q.getImageData(0, 0, cw, chh).data, pts = []; for (let yy = 0; yy < chh; yy += 3) for (let xx = 0; xx < cw; xx += 3) if (d[(yy * cw + xx) * 4 + 3] > 128) pts.push((xx / cw - .5) * 8.0, 8.2 - (yy / chh) * .95 + .45, 1.6);
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      const mm = new THREE.PointsMaterial({ size: .16, map: dotTex, color: '#fff1c2', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
      const P = new THREE.Points(geo, mm); P.frustumCulled = false; g.add(P); S.updates.push((t) => { mm.opacity = .85 + Math.sin(t * 3) * .15; });
      for (const y of [9.25, 7.55]) line(g, sag(V(-4.3, y, 1.6), V(4.3, y, 1.6), .05), '#3a3550'); glow(g, 0, 8.3, 1.8, 9, '#ffd98a', .15); }
    for (const sx of [-1, 1]) { const sp = new THREE.SpotLight('#ffe0b0', 30, 30, .45, .7, 1.5); sp.position.set(sx * 6, .5, 3); sp.target.position.set(0, 6, -7.5); g.add(sp, sp.target); }
    // ---- market: two rows of stalls along a central walkway
    const defs = [['pide', 'RAMAZAN PİDESİ', ['#b8202b', '#f6eee0']], ['lokum', 'LOKUM · AKİDE', ['#2a7a4b', '#f6eee0']], ['serbet', 'ŞERBET', ['#1f4f9e', '#f6eee0']], ['sweets', 'GÜLLAÇ · BAKLAVA', ['#d26a1e', '#f6eee0']], ['toys', 'OYUNCAK', ['#7a2a8a', '#f6eee0']], ['books', 'SAHAF', ['#1e6a6a', '#f6eee0']]];
    const fronts = [];
    defs.forEach((d, i) => { const left = i < 3; const s = stall(st, left ? -3.25 : 3.25, 4.5 + (i % 3) * 3.0, left ? Math.PI / 2 : -Math.PI / 2, { goods: goods[d[0]], label: d[1], awn: d[2], night: true, W: 2.2, D: 1.3 }); fronts.push(s); C.add({ x: s.behind.x, z: s.behind.z, ry: s.ry, mode: MODE.idle, v: pick(['c', 'm', 'h']), look: { top: '#ffffff' } }); });
    for (const [x, z] of [[-3, 6], [3, 9.2]]) { const L = new THREE.PointLight('#ffb35a', 9, 10, 1.4); L.position.set(x, 2.4, z); g.add(L); }
    // string lights
    const bulbs = []; const bc = ['#ffd27a', '#ff7a7a', '#7ad0ff', '#a6ff8a', '#ffd27a'];
    for (let i = 0; i < 6; i++) { const z1 = 3.8 + i * 1.6, z2 = z1 + .8; const a = V(i % 2 ? -2.3 : 2.3, 3.0, z1), b = V(i % 2 ? 2.3 : -2.3, 3.0, z2); const pts = sag(a, b, .35, 10); line(g, pts, '#2a2530'); pts.forEach((p, k) => bulbs.push([p, bc[(i + k) % bc.length]])); }
    { const im = new THREE.InstancedMesh(SPH2, noOL(new THREE.MeshBasicMaterial()), bulbs.length); const dm = new THREE.Object3D(); const col = new THREE.Color(); bulbs.forEach(([p, c], i) => { dm.position.copy(p); dm.position.y -= .06; dm.scale.setScalar(.05); dm.updateMatrix(); im.setMatrixAt(i, dm.matrix); im.setColorAt(i, col.set(c)); }); im.frustumCulled = false; g.add(im);
      const geo = new THREE.BufferGeometry().setFromPoints(bulbs.map((b) => b[0].clone().add(V(0, -.06, 0)))); const pm = new THREE.PointsMaterial({ size: .5, map: glowTex, color: '#ffcf8a', transparent: true, opacity: .55, depthWrite: false, blending: THREE.AdditiveBlending }); const P = new THREE.Points(geo, pm); P.frustumCulled = false; g.add(P); S.updates.push((t) => { pm.opacity = .45 + .15 * Math.sin(t * 4); }); }
    // ottoman lanterns
    const lcols = ['#ff6a3a', '#3ad0ff', '#ffd23a', '#c05aff', '#5aff9a']; const lans = [];
    for (let i = 0; i < 8; i++) { const x = (i % 2 ? 1.3 : -1.3), z = 4 + i * 1.2; const c = lcols[i % lcols.length]; const lg = group(g, x, 2.9, z); line(lg, [V(0, 0, 0), V(0, -.3, 0)], '#2a2530'); const b = mesh(cg('lan', () => new THREE.CylinderGeometry(.08, .12, .26, 6)), E(c), lg, 0, -.45, 0); b.castShadow = false; cyl(lg, .02, .11, .08, '#c9a64a', 0, -.34, 0, 6); glow(lg, 0, -.45, 0, .9, c, .7); lans.push([lg, R() * 9]); }
    S.updates.push((t) => { for (const [l, ph] of lans) { l.rotation.z = Math.sin(t * 1.3 + ph) * .08; l.rotation.x = Math.cos(t * 1.1 + ph) * .06; } });
    // mesir macunu cart
    { const mc = group(st, 8.4, 0, 10, -.5); box(mc, 1.3, .6, .9, '#c9302c', 0, .3, 0); for (const sx of [-.45, .45]) { const w = cyl(mc, .3, .3, .06, '#c9a64a', sx, 0, .48, 12); w.rotation.x = Math.PI / 2; w.position.y = .3; } const mcols = ['#e94b3c', '#f2c230', '#4caf6a', '#3a86c8', '#f08a3c', '#b04ad0']; for (let i = 0; i < 6; i++) cyl(mc, .5 - i * .075, .52 - i * .075, .14, mcols[i], 0, .9 + i * .14, 0, 14); cyl(mc, .02, .02, .5, '#ddd', 0, 1.74, 0, 4); sign(mc, 'MESİR MACUNU', 1.2, .26, { bg: '#fdf3dc', fg: '#c9302c' }, 0, .78, .46, 0, true, null); glow(mc, 0, 1.4, .4, 2.2, '#ffcf8a', .35); }
    C.add({ x: 8.15, z: 9.3, ry: -.5 + Math.PI, mode: MODE.wave, v: 'c', look: { top: '#c9302c', acc: '#f2c230' } });
    for (const [px, pz] of [[8.9, 11.0], [7.7, 10.9]]) C.add({ x: px, z: pz, ry: Math.PI - .4, mode: MODE.browse, scale: .75, v: 'k' });
    // iftar table with diners
    { const T = group(st, -10, 0, 7.5); box(T, 1.1, .32, 7, '#f2efe8', 0, 0, 0); box(T, 1.14, .03, 7.04, '#e3dccd', 0, .32, 0);
      for (let i = 0; i < 10; i++) { const z = -3.1 + i * .69; for (const s of [-1, 1]) { cyl(T, .12, .1, .02, '#ffffff', s * .3, .34, z, 10); cyl(T, .05, .05, .02, '#c88a3a', s * .3, .36, z, 8); box(T, .3, .2, .3, '#7a4e2e', s * .8, 0, z); } }
      for (let i = 0; i < 5; i++) { ell(T, .16, .045, .2, '#c88a3a', 0, .38, -2.8 + i * 1.4); cyl(T, .04, .035, .12, E('#ffe6b0'), .1, .34, -2.4 + i * 1.4, 6); glow(T, .1, .5, -2.4 + i * 1.4, .7, '#ffcf8a', .7); cyl(T, .06, .05, .14, noOL(new THREE.MeshToonMaterial({ color: '#c0182a', transparent: true, opacity: .8 })), -.25, .34, -2.1 + i * 1.4, 8).userData.keep = true; }
      const L = new THREE.PointLight('#ffc070', 6, 7, 1.5); L.position.set(0, 2, 0); T.add(L); }
    for (let i = 0; i < 10; i++) for (const s of [-1, 1]) if (chance(.85)) C.add({ x: -10 + s * .8, y: .01, z: 7.5 - 3.1 + i * .69, ry: s > 0 ? -Math.PI / 2 : Math.PI / 2, mode: MODE.sit, v: pick(['m', 'f', 'h', 's', 'c', 'k', 'hb']) });
    // trees, lamps, benches
    for (const [x, z] of [[-13, -12], [13, -12], [-13, -4], [13, -4], [-13, 12.5], [13, 12.5], [-7.5, 2.4], [7.5, 2.4], [-13.2, 3.4], [13.2, 3.6]]) tree(st, x, z, rr(1.0, 1.3), 'night');
    for (const [x, z] of [[-6.4, 3.4], [6.4, 3.4], [-6.4, 12.8], [6.4, 12.8]]) lamp(st, x, z, { h: 3.0, night: true, color: '#ffd48a' });
    const bs = []; for (const z of [5, 9]) bs.push(bench(st, 10.5, z, -Math.PI / 2, { c: '#6a4a32' })); for (const z of [5.5, 9.9]) bs.push(bench(st, -13.3, z, Math.PI / 2, { c: '#6a4a32' }));
    for (const b of bs) for (const s of seatsOf(b, 2)) if (chance(.7)) C.add({ ...s, mode: MODE.sit });
    { const d = cyl(st, .3, .3, .45, '#b8202b', 11.8, .62, 7.2, 14); d.rotation.z = Math.PI / 2; box(st, 1.2, .4, .45, '#5e3a22', 11.8, 0, 7.2); }
    // ---- walkers
    const lanes = [-.9, -.3, .3, .9];
    for (let i = 0; i < 12; i++) { const x = lanes[i % 4] + rr(-.1, .1); const pts = [V(x, .03, 13.2), V(x, .03, 10.5), V(x, .03, 7.5), V(x, .03, 4.5), V(x, .03, 3.6)]; const side = x < 0 ? -1 : 1; const waits = {}; if (chance(.6)) waits[ri(1, 3)] = { t: [2, 4], mode: MODE.browse, face: side < 0 ? -Math.PI / 2 : Math.PI / 2 }; C.add({ path: { pts, offset: R(), start: ri(0, 3), waits }, v: pick(['m', 'f', 's', 'h', 'b', 'fb', 'hb', 'k', 'c']) }); }
    for (let i = 0; i < 4; i++) C.add({ path: { pts: [V(-12.5, .03, 2.45 + i * .1), V(12.5, .03, 2.45 + i * .1)], offset: R() } });
    for (let i = 0; i < 4; i++) { const sd = i % 2 ? 1 : -1; C.add({ path: { pts: [V(sd * rr(2.2, 3.2), .27, .4), V(sd * rr(2.2, 3.2), .27, -3.0)], offset: R() }, v: pick(['m', 'h', 'c']) }); }
    // davulcu with drum
    { const dv = C.add({ v: 'c', path: { pts: [V(-1.5, .03, 13.2), V(-1.5, .03, 3.6), V(1.5, .03, 3.6), V(1.5, .03, 13.2)], loop: true, offset: R(), mode: MODE.carry }, speed: .45, look: { top: '#7a1e1e', acc: '#c9302c' } });
      const drum = group(g); const dm = cyl(drum, .2, .2, .28, '#b8202b', 0, 0, 0, 14); dm.rotation.x = Math.PI / 2; dm.position.set(0, .34, .18); cyl(drum, .21, .21, .02, '#f2ece0', 0, 0, 0, 14).rotation.x = Math.PI / 2; drum.children[1].position.set(0, .34, .32);
      dv.onTick = (a) => { drum.position.set(a.fx ?? a.pos.x, a.pos.y, a.fz ?? a.pos.z); drum.rotation.y = a.ry; }; }
    // kids with balloons
    for (let i = 0; i < 3; i++) { const kid = C.add({ v: 'k', scale: .72, speed: rr(.6, .8), path: { pts: [V(rr(7.4, 9.6), .03, rr(3, 5)), V(rr(7.4, 9.6), .03, rr(6.5, 8.5)), V(rr(7.4, 9.6), .03, rr(3, 5))], offset: R() } }); const bl = blob(g, .14, pick(['#e94b3c', '#f2c230', '#3a86c8', '#b04ad0']), 0, 1.2, 0, true); const ln = line(g, [V(0, 0, 0), V(0, 1, 0)], '#ddd'); kid.onTick = (a, t) => { const x = (a.fx ?? a.pos.x) + Math.sin(a.ry) * .1, z = (a.fz ?? a.pos.z) + Math.cos(a.ry) * .1; bl.position.set(x - Math.sin(a.ry) * .2, 1.25 + Math.sin(t * 2 + a.ph) * .04, z - Math.cos(a.ry) * .2); ln.position.set(x, .35, z); ln.scale.y = .85; ln.lookAt(bl.position); }; }
    // photographers & idlers near the courtyard gate
    for (const [px, pz] of [[-1.2, 3.15], [1.5, 3.2], [-5.4, 3.4]]) C.add({ x: px, z: pz, ry: Math.PI + rr(-.3, .3), mode: MODE.photo });
    cat(S, st, 1.2, 12.6, 2.4, '#d98a3d', true); cat(S, st, -6.0, 9.6, .3, '#2b2b2b'); dog(S, st, 12.4, 1.9, 2.2, '#c9a77a', true);
    stars(g, 700, 1);
    const moon = ctex(256, 256, (q) => { q.fillStyle = '#fff6d8'; q.beginPath(); q.arc(128, 128, 90, 0, TAU); q.fill(); q.globalCompositeOperation = 'destination-out'; q.beginPath(); q.arc(165, 110, 80, 0, TAU); q.fill(); });
    { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: moon, transparent: true, fog: false, depthWrite: false })); s.position.set(34, 52, -80); s.scale.set(12, 12, 1); g.add(s); glow(g, 34, 52, -80.5, 30, '#9fb0ff', .25); }
    motes(S, g, 90, [12, 7, 12], '#ffcf8a', .1, .25, .6);
  }
};
