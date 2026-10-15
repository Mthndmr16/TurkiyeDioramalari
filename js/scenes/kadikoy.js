import { THREE, TAU, R, rr, ri, pick, chance, lerp, ease, smooth, V, M, E, N, EN, noOL, box, cyl, rod, blob, ell, dome, cone, hipRoof, ridgeRoof, gable, archTop, archWin, line, sag, group, sign, texMat, tileTex, decal, glow, ctex, UB, PLANE, mesh } from '../kit.js';
import { apt, win, tree, cypress, bush, flowers, grass, bench, seatsOf, lamp, bin, bollard, mailbox, bicycle, kiosk, teaSet, crate, fence, streetSign, busStop, trafficLight, planter, cat, dog, curb, crosswalk, dashes, shade, umbrella, goods } from '../props.js';
import { flag, gulls, pigeons, car, traffic, tram, vapur, kayik, smoke, water, petals, sunLight, base } from '../dyn.js';
import { MODE, lane } from '../people.js';

const CREAM = '#efe6d2', TRIM = '#fbf7ee', LEAD = '#7b8591', TILE = '#2c9aa0', DARK = '#2b3842';

function pierBuilding(st, S, x, z) {
  const g = group(st, x, 0, z);
  const W = 10, D = 3.8, H1 = 1.5, H2 = 1.25, H = H1 + H2, b0 = .12, F = D / 2;
  box(g, W + .3, b0, D + .3, '#cfc6b4', 0, 0, 0);
  box(g, 4, H, D, CREAM, 0, b0, 0);
  for (const s of [-1, 1]) box(g, 2.12, H, D - .2, CREAM, s * 3.95, b0, 0);
  // towers on the sea side
  for (const s of [-1, 1]) {
    const tx = s * 2.45, tz = F - .5;
    box(g, 1.0, H + 1.3, 1.1, CREAM, tx, b0, tz);
    box(g, 1.1, .08, 1.2, TRIM, tx, b0 + H + 1.3, tz); box(g, 1.04, .12, 1.14, M(TILE), tx, b0 + H + 1.08, tz);
    hipRoof(g, 1.2, 1.3, .75, LEAD, tx, b0 + H + 1.38, tz); cyl(g, .02, .02, .3, '#c9a64a', tx, b0 + H + 2.1, tz, 5); blob(g, .05, '#d9b552', tx, b0 + H + 2.42, tz, true);
    archWin(g, .5, 1.05, .04, M(DARK), tx, b0, tz + .56);
    archWin(g, .36, .7, .04, M('#46607a'), tx, b0 + H1 + .25, tz + .56);
    archWin(g, .3, .5, .04, M('#46607a'), tx, b0 + H + .45, tz + .56);
    for (const k of [-1, 1]) archWin(g, .26, .5, .04, M('#46607a'), tx + k * .56, b0 + H + .45, tz, k * Math.PI / 2);
  }
  // string courses, tile frieze, cornice
  box(g, W + .06, .1, D + .06, TRIM, 0, b0 + H1 - .06, 0);
  box(g, W + .04, .16, D + .04, M(TILE), 0, b0 + H - .34, 0);
  for (let i = 0; i < 46; i++) { const xx = -W / 2 + .12 + i * (W - .24) / 45; box(g, .06, .06, .02, N('#f2f6f6'), xx, b0 + H - .29, F + .03).castShadow = false; box(g, .06, .06, .02, N('#f2f6f6'), xx, b0 + H - .29, -F - .03).castShadow = false; }
  box(g, W + .34, .1, D + .34, TRIM, 0, b0 + H - .02, 0);
  ridgeRoof(g, 4.4, D + .3, 1.0, LEAD, 0, b0 + H + .08, 0);
  for (const s of [-1, 1]) ridgeRoof(g, 2.4, D + .1, .75, LEAD, s * 3.95, b0 + H + .08, 0);
  // sea facade: three-arch portico with balcony
  for (const xx of [-1.25, 0, 1.25]) { archWin(g, .95, 1.25, .05, M(DARK), xx, b0, F + .01); archWin(g, .78, 1.0, .05, M('#46607a'), xx, b0 + H1 + .05, F + .01); }
  for (const xx of [-1.88, -.62, .62, 1.88]) { box(g, .22, H1, .14, TRIM, xx, b0, F + .04); }
  box(g, 4.1, .08, .55, TRIM, 0, b0 + H1, F + .27);
  for (let k = 0; k <= 40; k++) box(g, .016, .32, .016, N('#4a4a4a'), -2 + k * .1, b0 + H1 + .08, F + .52).castShadow = false;
  box(g, 4.1, .03, .03, '#3a3a3a', 0, b0 + H1 + .4, F + .52);
  sign(g, 'KADIKÖY', 2.4, .34, { bg: '#1e3a5c', fg: '#fff', weight: 900 }, 0, b0 + H - .62, F + .09, 0, false, '#1e3a5c');
  // wing facades
  for (const s of [-1, 1]) {
    for (const k of [-.55, .55]) archWin(g, .5, .95, .04, M(DARK), s * 3.95 + k, b0, F - .09);
    for (const k of [-.6, 0, .6]) archWin(g, .32, .62, .04, M('#46607a'), s * 3.95 + k, b0 + H1 + .2, F - .09);
    for (const k of [-.55, .55]) archWin(g, .5, .95, .04, M('#46607a'), s * 3.95 + k, b0, -F + .09, Math.PI);
    for (const k of [-.6, 0, .6]) archWin(g, .32, .62, .04, M('#46607a'), s * 3.95 + k, b0 + H1 + .2, -F + .09, Math.PI);
    // end facades + covered exit arcades
    archWin(g, .9, 1.0, .04, M('#46607a'), s * 5.01, b0 + H1 + .1, 0, s * Math.PI / 2);
    for (const k of [-1.2, 0, 1.2]) archWin(g, .3, .55, .04, M('#46607a'), s * 5.01, b0 + .5, k, s * Math.PI / 2);
    const ax = s * (W / 2 + .5);
    box(g, 1.0, .1, D - .2, TRIM, ax, b0 + 1.25, 0); box(g, 1.04, .06, D - .1, LEAD, ax, b0 + 1.35, 0);
    for (const k of [-1.6, -.55, .55, 1.6]) box(g, .14, 1.25, .14, TRIM, s * (W / 2 + .93), b0, k);
  }
  // land facade: enclosed arches, 1960s glass turnstile annex
  for (const xx of [-1.25, 0, 1.25]) { archWin(g, .95, 1.25, .05, M('#5a7288'), xx, b0, -F - .01, Math.PI); archWin(g, .78, 1.0, .05, M('#46607a'), xx, b0 + H1 + .05, -F - .01, Math.PI); }
  sign(g, 'KADIKÖY', 2.4, .34, { bg: '#1e3a5c', fg: '#fff' }, 0, b0 + H - .62, -F - .09, Math.PI, false, '#1e3a5c');
  const ann = group(g, 0, 0, -F - .45);
  const glass = noOL(new THREE.MeshToonMaterial({ color: '#cfe3ee', transparent: true, opacity: .3, depthWrite: false }));
  box(ann, 3.4, 1.15, .8, glass, 0, b0, 0).userData.keep = true;
  box(ann, 3.5, .08, .9, '#d8d2c6', 0, b0 + 1.15, 0);
  for (let k = 0; k <= 6; k++) box(ann, .05, 1.15, .05, '#8a9096', -1.7 + k * .566, b0, -.4);
  for (let k = 0; k < 5; k++) { box(ann, .12, .4, .25, '#9aa0a8', -1.2 + k * .6, b0, 0); box(ann, .3, .03, .03, '#c9302c', -1.2 + k * .6 + .15, b0 + .35, 0); }
  sign(ann, 'EMİNÖNÜ · KARAKÖY · ADALAR', 2.6, .18, { bg: '#fff', fg: '#1e3a5c' }, 0, b0 + 1.42, -.46, Math.PI, false, '#1e3a5c');
  // wall lanterns
  for (const xx of [-1.88, 1.88]) for (const zz of [F + .13, -F - .13]) { box(g, .1, .18, .1, N('#f5ecd2'), xx, b0 + 1.0, zz); box(g, .12, .03, .12, '#2a2a2a', xx, b0 + 1.18, zz); }
  return g;
}

function iskeleCamii(st, x, z) {
  const g = group(st, x, 0, z); const stn = '#e7dfcd', lead = '#7b8591';
  box(g, 2.7, .15, 2.9, '#cfc6b4', 0, 0, 0);
  box(g, 2.5, 1.9, 2.5, stn, 0, .15, -.2);
  for (const [fx, fz, ry] of [[0, 1.06, 0], [1.26, -.2, Math.PI / 2], [-1.26, -.2, -Math.PI / 2]]) for (let k = -1; k <= 1; k++) { archWin(group(g, fx, 0, fz, ry), .3, .6, .04, M('#46607a'), k * .7, .45, 0); archWin(group(g, fx, 0, fz, ry), .2, .35, .04, M('#46607a'), k * .7, 1.35, 0); }
  box(g, 2.6, .1, 2.6, '#d8cfbc', 0, 2.05, -.2);
  cyl(g, 1.0, 1.05, .35, stn, 0, 2.15, -.2, 16); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; const q = group(g, Math.sin(a) * 1.03, 2.2, -.2 + Math.cos(a) * 1.03, a); box(q, .12, .22, .03, M('#46607a'), 0, 0, 0).castShadow = false; }
  dome(g, 1.05, lead, 0, 2.5, -.2, 18); cyl(g, .02, .02, .35, '#c9a64a', 0, 3.55, -.2, 5); blob(g, .05, '#d9b552', 0, 3.9, -.2, true);
  // portico with small domes
  box(g, 2.5, .12, .7, '#d8cfbc', 0, 1.3, 1.35); for (const k of [-1.15, -.38, .38, 1.15]) cyl(g, .07, .07, 1.15, TRIM, k, .15, 1.6, 8);
  for (const k of [-.77, 0, .77]) dome(g, .32, lead, k, 1.42, 1.35, 12);
  box(g, .6, 1.0, .05, '#5a3e2c', 0, .15, 1.07);
  // minaret
  const mx = 1.45, mz = -1.35; cyl(g, .3, .32, .8, stn, mx, 0, mz, 10); cyl(g, .18, .21, 4.8, stn, mx, .8, mz, 12);
  cyl(g, .32, .2, .2, stn, mx, 4.0, mz, 12); cyl(g, .33, .33, .05, '#cfc6b4', mx, 4.2, mz, 12); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; box(g, .02, .2, .02, N('#7a7a7a'), mx + Math.sin(a) * .31, 4.25, mz + Math.cos(a) * .31).castShadow = false; }
  cyl(g, .19, .19, .5, stn, mx, 4.25, mz, 12); cone(g, .22, 1.3, lead, mx, 4.75, mz, 12); cyl(g, .015, .015, .3, '#c9a64a', mx, 6.05, mz, 4); blob(g, .04, '#d9b552', mx, 6.38, mz, true);
  return g;
}

function bull(st, x, z, ry = 0) { // Kadıköy Boğa, bronze on stone plinth
  const g = group(st, x, 0, z, ry); const br = '#5e4a34';
  box(g, 1.7, .25, 1.0, '#b9b2a6', 0, 0, 0); box(g, 1.5, .55, .8, '#cfc8bc', 0, .25, 0); box(g, 1.6, .06, .9, '#b9b2a6', 0, .8, 0);
  const b = group(g, 0, .86, 0);
  ell(b, .5, .3, .26, br, 0, .52, 0); ell(b, .32, .34, .28, br, .32, .55, 0);
  for (const [lx, lz] of [[-.35, -.13], [-.35, .13], [.32, -.13], [.32, .13]]) { const l = cyl(b, .05, .06, .38, br, lx, 0, lz, 6); }
  const head = group(b, .72, .42, 0); ell(head, .16, .13, .13, br, 0, 0, 0); ell(head, .09, .08, .1, shade(br, -.06), .13, -.06, 0);
  for (const s of [-1, 1]) { rod(head, V(-.02, .08, s * .1), V(.08, .2, s * .24), .022, '#3a2e22', 5); }
  rod(b, V(-.5, .6, 0), V(-.62, .2, .05), .02, br, 4);
  return g;
}

function quayLife(S, st, g) {
  // fishermen at the quay edge
  const C = S.crowd; const spots = [-9.2, -7.6, -3.6, -2.0, 12.4];
  for (const fx of spots) {
    const a = C.add({ v: pick(['m', 'c', 'm']), x: fx, z: 2.95, ry: 0, mode: MODE.idle, old: chance(.4) });
    rod(st, V(fx + .12, .3, 3.05), V(fx + .25, 1.75, 4.4), .012, '#2a2a2a', 4);
    line(g, [V(fx + .25, 1.75, 4.4), V(fx + .25, -.32, 4.9)], '#e8e8e8', .6);
    cyl(st, .1, .09, .2, pick(['#2a6fb0', '#e94b3c', '#f2c230']), fx - .3, 0, 2.85, 10);
  }
}

export default {
  id: 'kadikoy', seed: 11, chip: 'Kadıköy', title: 'Kadıköy İskelesi', crowdCap: 40,
  sub: 'Vapur yanaşıyor, martılar simit peşinde. Meydan kalabalık; Moda tramvayı İskele Camii durağından kalkmak üzere.',
  meta: '40.9917° K · 29.0236° D · Nisan, 10:40',
  sky: 'linear-gradient(180deg,#8ec8ee 0%,#cfe7f4 50%,#f6e2ea 100%)', fog: ['#e8eef4', 60, 130],
  shots: [
    { a: [24, 44], e: [30, 25], r: [40, 34], t: [[1, .5, -1.5]], d: 8.5 },
    { a: [70, 98], e: [11, 15], r: [15, 13.5], t: [[5.5, 1.4, 5]], d: 7.5 },
    { a: [-24, -4], e: [7, 11], r: [12.5, 11], t: [[-4, 1, -1.8], [-1, 1.1, -3.4]], d: 7.5 },
    { a: [-40, -62], e: [42, 36], r: [31, 30], t: [[0, 0, -2]], d: 7 },
  ],
  build(S) {
    const st = S.static, g = S.group, C = S.crowd;
    g.add(new THREE.HemisphereLight('#dff0ff', '#a8906a', 1.3));
    sunLight(S, '#fff1d8', 2.6, [14, 22, 12], 21);
    // ---- ground: land z∈[-11,3.2], sea z∈[3.2,11]
    base(st, 30, 14.2, 0, -3.9, '#d8cbb0');
    box(st, 30, .6, 7.8, '#8d5f3e', 0, -1.69, 7.1).castShadow = false; box(st, 29.7, .32, 7.5, '#5b3a28', 0, -1.69 - .32, 7.1).castShadow = false;
    const wv = noOL(new THREE.MeshToonMaterial({ color: '#2a86ad', transparent: true, opacity: .8 })); box(st, 30, .68, 7.8, wv, 0, -1.08, 7.1).userData.keep = true;
    water(S, g, 30, 7.8, 0, -.36, 7.1, '#45acd0');
    box(st, 30, 1.25, .4, '#a89c89', 0, -1.1, 3.0).castShadow = false; box(st, 30, .08, .5, '#c9bea8', 0, .1, 3.0);
    for (let x = -14.5; x < 15; x += .5) box(st, .48, .02, .02, N('#9a8f7c'), x, -.2, 3.21).castShadow = false;
    // square paving
    const pav = tileTex('#d9cdb5', '#bcae94', 10, 10, 8); pav.wrapS = pav.wrapT = THREE.RepeatWrapping; pav.repeat.set(12, 2.4);
    decal(st, pav, 30, 5.8, 0, .006, -.0, -Math.PI / 2);
    // ---- road z∈[-4.8,-2.6], sidewalk z∈[-5.8,-4.8]
    box(st, 30, .03, 2.2, '#5d6069', 0, 0, -3.7).castShadow = false;
    for (const s of [-.36, .36]) box(st, 30, .012, .06, N('#8a8e96'), 0, .03, -3.25 + s * .5).castShadow = false;
    dashes(st, -14.5, 14.5, -3.75, .031);
    curb(st, 0, -2.66, 30, .12, '#b3a68e', .1); curb(st, 0, -4.86, 30, .12, '#b3a68e', .1);
    box(st, 30, .08, .94, '#cfc3ab', 0, 0, -5.33).castShadow = false;
    crosswalk(st, 2, -3.7, 2.0, 'x', 6, .031); crosswalk(st, -8, -3.7, 2.0, 'x', 6, .031);
    for (const [tx, tz, ry] of [[1, -2.75, Math.PI], [3, -4.75, 0], [-9, -2.75, Math.PI], [-7, -4.75, 0]]) trafficLight(st, tx, tz, ry);
    // tram overhead line
    for (const x of [-13, -7, -1, 5, 11]) { cyl(st, .05, .06, 2.65, '#3f5145', x, 0, -2.45, 8); box(st, .05, .05, .9, '#3f5145', x, 2.55, -2.85); }
    line(g, [V(-15, 2.45, -3.25), V(15, 2.45, -3.25)], '#222');
    // ---- pier platform + building
    box(st, 11.2, .3, 4.1, '#a39a8a', 5.5, -.3, 5.25); box(st, 11.2, .06, 4.1, '#bdb3a2', 5.5, -.04, 5.25).castShadow = false;
    for (let x = .2; x <= 10.8; x += 1.35) for (const zz of [3.6, 5.2, 7.0]) cyl(st, .12, .12, 1.1, '#6e5a46', x, -1.4, zz, 6);
    for (let x = .3; x < 11; x += .7) { const t = cyl(st, .12, .12, .14, '#222', x, -.38, 7.35, 10); t.rotation.x = Math.PI / 2; }
    for (const x of [1, 3.5, 7.5, 10]) cyl(st, .1, .12, .28, '#2f3438', x, 0, 7.05, 8);
    pierBuilding(st, S, 5.5, 4.4);
    flag(S, g, 10.4, 1.98, 7.0, .9);
    box(st, 1.2, .06, .6, '#8a8f96', 5.6, .0, 7.45);
    // ---- quay strip (left), tea garden, benches, mosque
    iskeleCamii(st, -12.4, -.6);
    fence(st, V(-14.7, 0, 1.6), V(-13.3, 0, 1.6), { h: .5 }); fence(st, V(-11.5, 0, 1.6), V(-10.1, 0, 1.6), { h: .5 }); fence(st, V(-10.1, 0, 1.6), V(-10.1, 0, -2.3), { h: .5 }); fence(st, V(-14.7, 0, 1.6), V(-14.7, 0, -2.3), { h: .5 });
    box(st, .1, .7, .1, '#cfc6b4', -13.3, 0, 1.6); box(st, .1, .7, .1, '#cfc6b4', -11.5, 0, 1.6);
    tree(st, -14.1, -1.7, .9, 'plane'); cypress(st, -10.6, -1.8, .7);
    const teaSeats = [];
    for (const [tx, tz, uc] of [[-9.0, .3, '#e8e2d6'], [-7.6, .3, '#c9302c'], [-9.0, 1.3, '#c9302c'], [-7.6, 1.3, '#e8e2d6'], [-6.2, .8, '#2f6b4a']]) teaSeats.push(...teaSet(st, tx, tz, { n: 3, umbrella: uc, a0: rr(0, 1) }));
    kiosk(st, -5.05, .25, Math.PI, { text: 'ÇAY · SİMİT', c: '#2f6b4a', style: { bg: '#fff3d6', fg: '#2f6b4a' } });
    const benches = [];
    for (const bx of [-4.0, -2.6, -1.2]) benches.push(bench(st, bx, 1.35, 0));
    for (const bx of [-3.3, -1.9]) tree(st, bx, .55, .85, 'erguvan', { pit: true });
    lamp(st, -.6, .55, { h: 2.5, arms: 2 });
    quayLife(S, st, g);
    for (let x = -14; x < 0; x += 2.4) if (![-9.2, -7.6, -3.6, -2.0].some((f) => Math.abs(f - x) < .6)) bollard(st, x, 3.05);
    for (const bx of [-9.6, -6.9, -.2]) bin(st, bx, -2.2);
    // tram stop platform
    box(st, 4.2, .12, .5, '#bdb3a2', -4, 0, -2.4); for (const dx of [-1.4, 1.4]) cyl(st, .03, .03, 1.5, '#3f5145', -4 + dx, .12, -2.3, 6); box(st, 3.2, .05, .45, '#3f5145', -4, 1.62, -2.35);
    sign(st, 'İSKELE CAMİİ', 1.1, .2, { bg: '#fff', fg: '#1e3a5c', border: '#1e3a5c' }, -2.4, 1.95, -2.3, 0, false, '#1e3a5c'); cyl(st, .025, .025, 1.85, '#3f5145', -2.4, .12, -2.33, 6);
    bench(st, -4.4, -2.3, Math.PI, { L: 1.0, y: .12 });
    // ---- right side: land apron of pier, simit, balloons, bull
    tree(st, 1.2, .6, 1.0, 'plane', { pit: true }); tree(st, 10.6, .4, 1.0, 'plane', { pit: true }); tree(st, 14.4, 1.9, .9, 'plane', { pit: true }); tree(st, 12.0, 2.2, .8, 'erguvan', { pit: true });
    lamp(st, 3.0, .2, { h: 2.6, arms: 2 }); lamp(st, 8.4, .2, { h: 2.6, arms: 2 }); lamp(st, 13.8, 1.2, { h: 2.6 });
    bull(st, 12.9, -.2, -.3);
    busStop(st, 8.6, -2.25, Math.PI, { text: 'İSKELE' });
    for (const bx of [6.2, 7.0]) bicycle(st, bx, -1.9, .1, pick(['#3a86c8', '#c8302c', '#46a86a']));
    mailbox(st, 14.3, -2.2, Math.PI);
    // simit cart + vendor
    const sc = group(st, 2.3, 0, 1.3, -.4); box(sc, .8, .4, .5, '#c3272e', 0, .26, 0); for (const s of [-.28, .28]) { const w = cyl(sc, .15, .15, .05, '#333', s, 0, .27, 10); w.rotation.x = Math.PI / 2; w.position.y = .15; }
    box(sc, .76, .4, .46, noOL(new THREE.MeshToonMaterial({ color: '#d8eef5', transparent: true, opacity: .4 })), 0, .66, 0).userData.keep = true; box(sc, .8, .04, .5, '#c3272e', 0, 1.06, 0);
    const tor = new THREE.TorusGeometry(.08, .032, 6, 12); for (let i = 0; i < 9; i++) { const s = mesh(tor, '#b8742e', sc, -.26 + (i % 3) * .26, .7 + Math.floor(i / 3) * .11, (i % 2) * .05 - .02); s.rotation.x = Math.PI / 2 - .3; s.castShadow = false; }
    sign(sc, 'SİMİT', .56, .15, { bg: '#fff3d6', fg: '#c3272e' }, 0, 1.25, 0, 0, false, '#c3272e');
    C.add({ v: 'c', x: 2.6, z: .8, ry: -.4 + Math.PI, mode: MODE.idle, look: { top: '#ffffff', acc: '#c3272e' } });
    // balloon seller
    { const bx = 9.2, bz = 1.0; C.add({ v: 'm', x: bx, z: bz, ry: 2.6, mode: MODE.idle, old: true }); const bg = group(g, bx + .15, 0, bz + .05); const cols = ['#e94b3c', '#f2c230', '#3a86c8', '#4caf6a', '#e98bb0', '#b04ad0', '#ffffff']; for (let i = 0; i < 9; i++) { const a = i / 9 * TAU, r = rr(.1, .3); const by = rr(1.5, 1.9); const b = ell(bg, .12, .15, .12, pick(cols), Math.cos(a) * r, by, Math.sin(a) * r); b.castShadow = true; line(bg, [V(0, .4, 0), V(Math.cos(a) * r, by - .15, Math.sin(a) * r)], '#ddd'); const ph = R() * 9; S.updates.push((t) => { b.position.y = by + Math.sin(t * 1.3 + ph) * .04; }); } }
    // midye seller on quay (right)
    { const mx = 11.6, mz = 2.4; box(st, .5, .4, .4, '#c9c4b8', mx, 0, mz); cyl(st, .3, .3, .05, '#ddd', mx, .4, mz, 14); for (let i = 0; i < 14; i++) { const m = ell(st, .045, .02, .07, '#1a1d24', mx + rr(-.2, .2), .46, mz + rr(-.2, .2)); m.rotation.y = rr(0, 3); } for (let i = 0; i < 4; i++) blob(st, .035, '#f2d23c', mx + rr(-.2, .2), .47, mz + rr(-.2, .2), true); C.add({ v: 'm', x: mx, z: mz - .5, ry: 0, mode: MODE.idle }); }
    // flower seller near crosswalk
    { const fx = -9.4, fz = -2.1; for (let i = 0; i < 5; i++) { cyl(st, .11, .09, .22, '#3a6aa0', fx - .5 + i * .25, 0, fz, 8); for (let k = 0; k < 4; k++) blob(st, .05, pick(['#d6304a', '#f6f0e6', '#f2c230', '#e85a7a', '#b04ad0']), fx - .5 + i * .25 + rr(-.05, .05), .3 + rr(0, .08), fz + rr(-.05, .05), true); } C.add({ v: 'h', x: fx + .1, z: fz - .38, ry: 0, mode: MODE.idle, old: true }); }
    // ---- buildings along the back (front faces +z at z=-5.8)
    const BL = [
      { x: -13.1, w: 3.4, floors: 5, color: '#d9c7a6', roof: 'hip', shop: { text: 'KİTAPÇI', type: 'books', style: { bg: '#3b2f4a', fg: '#fff' } } },
      { x: -9.6, w: 3.6, floors: 4, color: '#e9b27c', cumba: true, shop: { text: 'TURŞUCU', type: 'market', style: { bg: '#2a6a3a', fg: '#fff3d6' }, awning: ['#2a6a3a', '#f4efe4'] } },
      { x: -6.2, w: 3.2, floors: 6, color: '#9fc7c0', shop: { text: 'ECZANE', type: 'pharmacy', style: { bg: '#fff', fg: '#d0202a', border: '#d0202a' }, board: '#d0202a' } },
      { x: -2.9, w: 3.4, floors: 5, color: '#e8dcc4', sides: 'r', shop: { text: 'BALIKÇI', type: 'fish', style: { bg: '#1e4f7a', fg: '#fff' }, awning: ['#1e4f7a', '#f4efe4'] } },
      { x: 2.9, w: 3.4, floors: 4, color: '#d98472', roof: 'hip', sides: 'l', shop: { text: 'MANAV', type: 'florist', style: { bg: '#f2c230', fg: '#2a4a1a' }, awning: ['#3f7a3a', '#f4efe4'] } },
      { x: 6.2, w: 3.2, floors: 6, color: '#f0d9a8', cumba: true, shop: { text: 'SİMİT FIRINI', type: 'bakery', style: { bg: '#c3272e', fg: '#fff3d6' }, awning: ['#c3272e', '#f4efe4'] } },
      { x: 9.6, w: 3.6, floors: 5, color: '#b8c4d6', shop: { text: 'TÜRK KAHVESİ', type: 'cafe', style: { bg: '#2f2018', fg: '#f6e3b4', serif: true } } },
      { x: 13.1, w: 3.4, floors: 4, color: '#c7a6cf', roof: 'hip', shop: { text: 'PLAKÇI', type: 'music', style: { bg: '#111', fg: '#ff6b6b' } } },
    ];
    for (const b of BL) apt(st, { ...b, z: -8.1, d: 4.6, shutters: chance(.3) ? '#3f6b55' : null, balc: .35, ac: .25 });
    flag(S, g, -6.2 + .7, 6.0, -5.5, .7, 0, false); cyl(st, .02, .02, 1.2, '#ddd', -5.5, 5.2, -5.6, 5).rotation.x = .6;
    // turşu jars outside the shop
    for (let i = 0; i < 6; i++) { const jx = -10.8 + i * .26; cyl(st, .1, .1, .3, pick(['#c9302c', '#7aa83a', '#f2a03a', '#d6b04a', '#9a2a4a']), jx, .0, -5.55, 10); cyl(st, .07, .07, .04, '#e8e8e8', jx, .3, -5.55, 8); }
    // çarşı (pedestrian market street) between the two buildings
    box(st, 2.4, .02, 5.2, '#b9ad98', 0, 0, -8.4).castShadow = false;
    for (const s of [-1, 1]) {
      for (let k = 0; k < 3; k++) {
        const zc = -6.6 - k * 1.45;
        box(st, .55, .45, 1.1, '#8a5a3a', s * .88, 0, zc); box(st, .62, .04, 1.18, '#c9a06a', s * .88, .45, zc);
        if ((k + (s > 0 ? 1 : 0)) % 2) goods.fish(st, s * .88, .49, zc, 1.0); else goods.fruit(st, s * .88, .49, zc, 1.0);
        const am = texMat(ctex(64, 64, (q) => { for (let i = 0; i < 8; i++) { q.fillStyle = i % 2 ? '#f4efe4' : (s > 0 ? '#c3272e' : '#1e4f7a'); q.fillRect(i * 8, 0, 8, 64); } }));
        const a = new THREE.Mesh(UB, am); a.scale.set(.75, .03, 1.35); a.position.set(s * .8, 1.25, zc); a.rotation.z = -s * .25; a.castShadow = true; st.add(a);
      }
    }
    for (let k = 0; k < 5; k++) line(g, sag(V(-1.2, 2.2, -6.2 - k * 1.0), V(1.2, 2.2, -6.2 - k * 1.0), .15, 8), '#444');
    // sidewalk furniture at the kerb
    for (const lx of [-11.4, -4.6, 4.6, 11.4]) lamp(st, lx, -4.98, { h: 2.6 });
    for (const tx of [-13, -8, 8, 13]) tree(st, tx, -5.05, .7, 'plane', { pit: false });
    for (const bx of [-1.5, 1.6]) bin(st, bx, -5.0, '#3d5a7a');
    // ---- sea: ferry, boats, gulls
    const fer = vapur(S, g, 'KADIKÖY'); fer.position.set(5.5, -.12, 8.5);
    const puff = smoke(S, g, null, 12);
    const wp = new THREE.Vector3();
    S.updates.push((t, dt) => { const c = t % 36; let x; if (c < 10) x = 5.5; else if (c < 21) x = lerp(5.5, -10, ease((c - 10) / 11)); else if (c < 24) x = -10; else x = lerp(-10, 5.5, ease((c - 24) / 12)); const moving = !(c < 10 || (c >= 21 && c < 24)); fer.position.x = x; fer.position.y = -.12 + Math.sin(t * 1.2) * .035; fer.rotation.z = Math.sin(t * .7) * .01; wp.set(fer.position.x, fer.position.y + 2.95, fer.position.z); puff(dt, wp, moving ? 1 : .35, t); });
    for (const d of fer.userData.deck) if (chance(.5)) C.add({ attach: fer, x: d.p.x, y: d.p.y - .02, z: d.p.z, ry: d.ry, mode: chance(.3) ? MODE.wave : MODE.idle });
    for (const sp of fer.userData.seats) if (chance(.35)) C.add({ attach: fer, x: sp.x, y: sp.y - .06, z: sp.z, ry: sp.z > 0 ? Math.PI / 2 : -Math.PI / 2, mode: MODE.sit });
    kayik(S, g, -12.4, 4.4, '#2a6fb0', .1); kayik(S, g, -11.2, 5.0, '#e8e2d6', -.15); kayik(S, g, -13.6, 5.4, '#c8302c', .25);
    const boat = group(g); { box(boat, 2.6, .35, .9, '#f4f1ea', 0, -.25, 0); box(boat, 1.6, .45, .8, '#f4f1ea', -.2, .1, 0); box(boat, 1.5, .18, .82, N('#2b3d5c'), -.2, .3, 0); box(boat, 2.62, .06, .92, '#e86a2a', 0, -.1, 0); cone(boat, .45, .9, '#f4f1ea', 1.3, -.25, 0, 4).rotation.z = -Math.PI / 2; }
    traffic(S, boat, { z: 10.2, x0: -14, x1: 14, speed: 1.3, off: 6, dir: -1, y: -.15, fade: 1.6 });
    gulls(S, g, 7, 5.5, 4.5, 6, 2.5, 6.5); gulls(S, g, 5, -6, 3.5, 4.5, 2, 4);
    pigeons(S, g, 14, 6, -.6, 2.2, 1.4, 3.5, 24);
    // ---- trams & traffic
    const tr = tram(S, g, { dest: 'MODA' }); tr.position.set(-4, .03, -3.25);
    S.updates.push((t) => { const c = t % 30; let x; if (c < 6) x = -4; else if (c < 15) x = lerp(-4, 16.5, ease((c - 6) / 9)); else if (c < 16) x = 16.5; else if (c < 22) x = lerp(-16.5, -4, ease((c - 16) / 6)); else x = -4; tr.position.x = x; tr.visible = Math.abs(x) < 15.6; const s = 1 - smooth(13.4, 15.4, Math.abs(x)); tr.scale.setScalar(Math.max(.0001, s)); });
    for (const sp of tr.userData.seats) if (chance(.5)) C.add({ attach: tr, x: sp.x, y: sp.y - .02, z: sp.z, ry: sp.z > 0 ? -Math.PI / 2 : Math.PI / 2, mode: MODE.sit });
    const vs = [car(g, { type: 'taxi', c: '#f2c230' }), car(g, { type: 'dolmus', c: '#f2c230' }), car(g, { type: 'sedan', c: '#c63b3b' }), car(g, { type: 'bus', c: '#f4f4f0' }), car(g, { type: 'sedan', c: '#eeeeea' }), car(g, { type: 'taxi', c: '#f2c230' })];
    vs.forEach((v, i) => traffic(S, v, { z: -4.25, speed: 2.6 - (i === 3 ? .6 : 0), off: i * 6.1, dir: -1, fade: 1.2, gap: 0 }));
    // ---- people
    const seats = [...teaSeats.filter(() => chance(.75))]; for (const b of benches) for (const s of seatsOf(b, 2)) if (chance(.75)) seats.push(s);
    for (const s of seats) C.add({ ...s, mode: MODE.sit });
    // meeting at the bull
    for (const [px, pz, ry] of [[11.55, .5, 1.6], [11.65, -.35, 1.2], [14.25, .25, -1.5], [14.15, -.6, -1.2]]) C.add({ x: px, z: pz, ry, mode: chance(.5) ? MODE.wave : MODE.idle });
    // gull feeders
    C.add({ x: .3, z: 2.75, ry: 0, mode: MODE.wave, v: 'k' }); C.add({ x: -5.4, z: 2.8, ry: .2, mode: MODE.wave, v: 's' });
    // walkers
    const W = (pts, n, o = {}) => { for (let i = 0; i < n; i++) C.add({ path: { pts: lane(pts, rr(-.25, .25)), loop: o.loop, waits: o.waits, offset: R(), start: ri(0, Math.max(0, pts.length - 2)) }, v: o.v }); };
    W([V(-14.2, 0, 2.3), V(-.6, 0, 2.3)], 4);
    W([V(-9.8, 0, -1.3), V(14.5, 0, -1.3)], 5);
    W([V(5.5, 0, 1.6), V(4.5, 0, -.8), V(2.0, 0, -2.3), V(2.0, 0, -5.3), V(.2, 0, -6.0), V(.2, 0, -10.6)], 5, { waits: { 5: { t: [2, 4] } } });
    W([V(-14.5, 0, -5.4), V(14.5, 0, -5.4)], 5);
    W([V(-8, 0, -1.6), V(-8, 0, -5.3), V(-14, 0, -5.3)], 2);
    W([V(13.0, 0, 2.55), V(14.8, 0, 2.55)], 1);
    // çarşı shoppers browsing stalls
    for (let i = 0; i < 4; i++) { const s = i % 2 ? 1 : -1; const pts = [V(-s * .2, 0, -5.9), V(-s * .2, 0, -6.6), V(-s * .2, 0, -8.05), V(-s * .2, 0, -9.5), V(-s * .2, 0, -10.6)]; C.add({ v: pick(['b', 'fb', 'hb']), path: { pts, waits: { 1: { t: [2, 5], mode: MODE.browse, face: s > 0 ? Math.PI / 2 : -Math.PI / 2 }, 2: { t: [2, 5], mode: MODE.browse, face: s > 0 ? Math.PI / 2 : -Math.PI / 2 }, 3: { t: [2, 5], mode: MODE.browse, face: -s * Math.PI / 2 } }, offset: R(), start: ri(0, 3) } }); }
    for (const [vx, vz, ry] of [[-.95, -7.0, Math.PI / 2], [.95, -8.6, -Math.PI / 2]]) C.add({ x: vx - Math.sign(vx) * .15, z: vz, ry: ry + Math.PI, mode: MODE.idle, v: 'c', look: { top: '#ffffff' } });
    // pier crowd waiting for the ferry
    for (let i = 0; i < 4; i++) C.add({ x: rr(2.4, 8.6), z: rr(6.6, 7.0), ry: rr(-.4, .4), mode: MODE.idle });
    // bus stop waiting
    C.add({ x: 8.3, z: -2.1, ry: Math.PI, mode: MODE.sit, y: .03 }); C.add({ x: 9.4, z: -2.0, ry: Math.PI, mode: MODE.idle, v: 'b' });
    // tram stop waiting
    C.add({ x: -4.6, z: -2.25, ry: Math.PI, mode: MODE.sit, y: .15 }); C.add({ x: -3.2, z: -2.35, ry: Math.PI + .3, mode: MODE.idle, v: 'k' });
    // cats & a street dog
    cat(S, st, -1.9, 1.65, .3, '#d98a3d', true); cat(S, st, 3.4, 1.1, 2, '#2b2b2b'); cat(S, st, -11.9, 1.9, -.5, '#f2efe8', true); cat(S, st, -.6, -6.4, 1.6, '#9c9c9c', true);
    dog(S, st, 11.0, -1.9, 2.2, '#c9a77a', true);
    petals(S, g, 200, [15, 7, 8], ['#e59bcb', '#d77fb5', '#f2c2df', '#c75b9b'], .14, .45, [0, 0, -2]);
  }
};
