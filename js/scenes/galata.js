import { THREE, TAU, R, rr, ri, pick, chance, lerp, ease, smooth, V, M, E, N, EN, noOL, box, cyl, rod, blob, ell, dome, cone, hipRoof, ridgeRoof, gable, archTop, archWin, line, sag, group, sign, texMat, tileTex, decal, glow, ctex, UB, PLANE, mesh, cg } from '../kit.js';
import { apt, win, tree, cypress, bush, flowers, grass, bench, seatsOf, lamp, bin, bollard, mailbox, bicycle, kiosk, teaSet, crate, fence, streetSign, trafficLight, planter, cat, dog, crosswalk, shade, umbrella } from '../props.js';
import { flag, bunting, gulls, pigeons, car, traffic, tram, cloud, sunLight, base } from '../dyn.js';
import { MODE, lane, chat } from '../people.js';

// street rises from the tower square (z=-6, y=0) to Tünel (z=9, y=1.6)
const Z0 = -6, Z1 = 9, TOP = 1.6, TH = Math.atan2(TOP, Z1 - Z0);
export const hY = (z) => z <= Z0 ? 0 : z >= Z1 ? TOP : (z - Z0) / (Z1 - Z0) * TOP;
const STONE = '#c9b590';

function tower(st, S, x, z) {
  const g = group(st, x, 0, z);
  cyl(g, 2.25, 2.35, .45, '#a99a83', 0, 0, 0, 28);
  cyl(g, 1.78, 1.98, 10.5, STONE, 0, .45, 0, 28);
  for (let i = 1; i < 14; i++) { const y = .45 + i * .75; const r = lerp(1.98, 1.78, i * .75 / 10.5) + .006; cyl(g, r, r, .025, N('#b09c78'), 0, y, 0, 28).castShadow = false; }
  // small staggered windows
  for (let lv = 0; lv < 6; lv++) for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + (lv % 2) * .6 + .3; const y = 1.6 + lv * 1.5; const r = lerp(1.98, 1.78, (y - .45) / 10.5); const q = group(g, Math.sin(a) * r, y, Math.cos(a) * r, a); archWin(q, .2, .45, .08, M('#2b2f38'), 0, 0, 0); }
  // door (north / +z)
  { const q = group(g, 0, .45, 1.96); archWin(q, .7, 1.25, .1, M('#4a3626'), 0, 0, 0); box(q, .95, .1, .14, '#a99a83', 0, 1.25, 0); }
  // corbel ring + consoles
  for (let i = 0; i < 28; i++) { const a = i / 28 * TAU; const q = group(g, Math.sin(a) * 1.86, 10.55, Math.cos(a) * 1.86, a); box(q, .14, .4, .22, '#b8a483', 0, 0, .06); }
  cyl(g, 2.12, 1.95, .28, '#bda98a', 0, 10.95, 0, 28);
  cyl(g, 2.3, 2.3, .1, '#9a8a73', 0, 11.23, 0, 30);
  // gallery railing
  for (let i = 0; i < 40; i++) { const a = i / 40 * TAU; box(g, .035, .45, .035, N('#2f2f33'), Math.sin(a) * 2.24, 11.33, Math.cos(a) * 2.24).castShadow = false; }
  const tor = mesh(cg('railT', () => new THREE.TorusGeometry(2.24, .025, 4, 48)), '#2f2f33', g, 0, 11.78, 0); tor.rotation.x = Math.PI / 2;
  // top drum with arched windows
  cyl(g, 1.66, 1.7, 2.0, '#d0bd9a', 0, 11.33, 0, 28);
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; const q = group(g, Math.sin(a) * 1.67, 11.55, Math.cos(a) * 1.67, a); archWin(q, .36, 1.25, .08, M('#33404e'), 0, 0, 0); box(q, .05, 1.25, .1, N('#f2ece0'), 0, 0, .02).castShadow = false; }
  cyl(g, 1.92, 1.78, .22, '#b8a483', 0, 13.33, 0, 28);
  cone(g, 2.02, 3.7, '#4d5664', 0, 13.55, 0, 28);
  cyl(g, .05, .05, .55, '#c9a64a', 0, 17.2, 0, 6); blob(g, .1, '#d9b552', 0, 17.8, 0, true);
  return g;
}

function mevlevihane(st, S, x0, x1, z0, z1, y) { // Galata Mevlevihanesi gate, garden, hazire
  const g = group(st, 0, 0, 0);
  const wallC = '#d6ccb8';
  // street wall with gate facing +x
  box(g, .3, 1.0, z1 - z0, wallC, x1 - .15, y, (z0 + z1) / 2); box(g, .36, .08, z1 - z0, '#bfb39c', x1 - .15, y + 1.0, (z0 + z1) / 2);
  const gz = (z0 + z1) / 2;
  box(g, .5, 2.0, 1.6, wallC, x1 - .2, y, gz); box(g, .6, .12, 1.8, '#bfb39c', x1 - .2, y + 2.0, gz);
  archWin(group(g, x1 + .06, y, gz, Math.PI / 2), .8, 1.5, .06, M('#4a3626'), 0, 0, 0);
  sign(g, 'GALATA MEVLEVİHANESİ', 1.4, .22, { bg: '#1f3a2f', fg: '#e9d9a6', serif: true }, x1 + .1, y + 1.78, gz, Math.PI / 2, false, '#1f3a2f');
  // garden + cypresses + turbaned tombstones
  box(g, x1 - x0 - .3, .05, z1 - z0, '#7aa65a', (x0 + x1) / 2 - .15, y, (z0 + z1) / 2).castShadow = false;
  for (const [cx, cz] of [[-3.4, 6.1], [-2.9, 8.5], [-4.3, 6.6]]) cypress(g, cx, cz, rr(.85, 1.1), '#2f5a3a', y);
  for (let i = 0; i < 8; i++) { const tx = rr(-4.4, -2.7), tz = rr(5.9, 7.0) + (i > 5 ? 1.0 : 0); const ts = group(g, tx, y, tz, rr(-.3, .3)); box(ts, .12, rr(.45, .7), .07, '#e8e2d6', 0, 0, 0); const top = ts.children[0].scale.y; if (chance(.7)) { cyl(ts, .07, .06, .1, '#f2ece0', 0, top, 0, 8); blob(ts, .075, chance(.5) ? '#f2ece0' : '#3a5a3a', 0, top + .13, 0, true); } }
  // semahane roof peeking behind
  box(g, 1.8, 1.5, 1.8, '#c9b9a0', -5.6, y, 8.0); hipRoof(g, 2.1, 2.1, .9, '#6d7682', -5.6, y + 1.5, 8.0); for (const k of [-.5, .5]) archWin(group(g, -4.69, y, 8.0 + k, Math.PI / 2), .3, .7, .04, M('#3c4a56'), 0, .3, 0);
  return g;
}

function instrumentRack(st, x, y, z, ry) {
  const g = group(st, x, y, z, ry);
  box(g, .7, .04, .04, '#5a3b25', 0, .95, 0); box(g, .04, .95, .04, '#5a3b25', -.33, 0, 0); box(g, .04, .95, .04, '#5a3b25', .33, 0, 0);
  for (let i = 0; i < 4; i++) { const xx = -.24 + i * .16; const col = pick(['#c9772e', '#8a4a22', '#e0b070', '#5a2a12']); ell(g, .06, .11, .03, col, xx, .62, .03); box(g, .025, .2, .02, '#3a2414', xx, .7, .03); }
  for (let i = 0; i < 2; i++) { const d = cyl(g, .09, .06, .2, pick(['#c9302c', '#d9b552', '#2a2a2a']), -.2 + i * .4, 0, .2, 10); cyl(g, .1, .1, .02, '#eee', -.2 + i * .4, .2, .2, 10); }
  return g;
}

export default {
  id: 'galata', seed: 44, chip: 'Galata', title: 'Galata', crowdCap: 44,
  sub: 'Tünel’den Galip Dede Caddesi’ne iniş: müzik dükkânları, Mevlevihane’nin kapısı ve en sonda kule.',
  meta: '41.0256° K · 28.9741° D · Haziran, 15:10',
  sky: 'linear-gradient(180deg,#4f9ee6 0%,#93c9f2 45%,#dcefff 100%)', fog: ['#d8ecfb', 70, 150],
  shots: [
    { a: [18, -2], e: [27, 22], r: [50, 43], t: [[0, 4.5, -3]], d: 8.5 },
    { a: [3, -3], e: [3, 6], r: [15, 11], t: [[0, 3.4, -3], [0, 3.9, -6]], d: 7.5 },
    { a: [-38, 38], e: [24, 30], r: [18, 17], t: [[0, 6.5, -10]], d: 8 },
    { a: [72, 102], e: [36, 30], r: [38, 36], t: [[0, 2.5, -2]], d: 7 },
  ],
  build(S) {
    const st = S.static, g = S.group, C = S.crowd;
    g.add(new THREE.HemisphereLight('#e3f1ff', '#a89276', 1.2));
    sunLight(S, '#fff3dc', 2.6, [-14, 24, 12], 24);
    base(st, 24, 30, 0, 0, '#bdb2a1', '#8a5e40');
    // ramp + Tünel plateau
    const L = Math.hypot(Z1 - Z0, TOP);
    const ramp = box(st, 23.96, 2.0, L, '#b9ad9b', 0, -2.0, 0); ramp.position.set(0, 0, 0); ramp.geometry = UB; ramp.scale.set(23.96, 2.0, L); ramp.rotation.x = -TH; ramp.position.set(0, (TOP / 2) - Math.cos(TH) * 1.0, (Z0 + Z1) / 2 + Math.sin(TH) * 1.0); ramp.castShadow = false;
    box(st, 23.96, TOP, 15 - Z1, '#b9ad9b', 0, 0, (Z1 + 15) / 2).castShadow = false;
    for (let i = 0; i < 3; i++) box(st, 24.01, .03, 15 - Z1 + .01, N('#9a8e7c'), 0, .4 + i * .4, (Z1 + 15) / 2).castShadow = false;
    // cobbles on street + square
    const cob = tileTex('#8f8678', '#6f675c', 14, 14, 14); cob.wrapS = cob.wrapT = THREE.RepeatWrapping; cob.repeat.set(2, 11);
    { const p = new THREE.Mesh(PLANE, texMat(cob)); p.scale.set(3.0, L, 1); p.rotation.x = -Math.PI / 2 - TH; p.position.set(0, TOP / 2 + .012, (Z0 + Z1) / 2); p.receiveShadow = true; st.add(p); }
    for (const s of [-1, 1]) { const sw = box(st, .6, .1, L, '#d2c8b6', s * 1.8, 0, 0); sw.rotation.x = -TH; sw.position.set(s * 1.8, TOP / 2 + .02, (Z0 + Z1) / 2); sw.castShadow = false; }
    const cob2 = tileTex('#9a9182', '#776e62', 14, 14, 14); cob2.wrapS = cob2.wrapT = THREE.RepeatWrapping; cob2.repeat.set(9, 3.5);
    decal(st, cob2, 24, 9, 0, .008, -10.5);
    const pav = tileTex('#cfc5b2', '#b0a690', 10, 10, 8); pav.wrapS = pav.wrapT = THREE.RepeatWrapping; pav.repeat.set(10, 2.5);
    decal(st, pav, 24, 6, 0, TOP + .008, 12);
    // ---- the tower
    tower(st, S, 0, -10.0);
    // ticket kiosk + queue railing
    box(st, .9, 1.0, .6, '#5a3b25', 3.9, 0, -7.9); box(st, 1.0, .06, .7, '#3a2414', 3.9, 1.0, -7.9); sign(st, 'GİŞE', .6, .16, { bg: '#f2c46d', fg: '#3a2414' }, 3.9, .8, -7.59, 0, false, null);
    for (const xx of [2.3, 3.3]) fence(st, V(xx, 0, -7.4), V(xx, 0, -5.9), { h: .45, c: '#6a5a48', step: .5 });
    for (let i = 0; i < 4; i++) C.add({ x: 2.8 + rr(-.08, .08), z: -7.1 + i * .45, ry: Math.PI + .3, mode: pick([MODE.photo, MODE.idle, MODE.standPhone, MODE.talk]) });
    // square furniture: cafés with umbrellas, trees, benches
    const seats = [];
    for (const [cx, cz, uc] of [[-6, -8, '#b8202b'], [-7.4, -9.7, '#f4efe4'], [-6.0, -11.4, '#b8202b'], [6.2, -7.6, '#2f5a3a'], [7.4, -9.5, '#f4efe4'], [6.2, -11.2, '#2f5a3a']]) seats.push(...teaSet(st, cx, cz, { n: 3, umbrella: uc, top: '#e8e2d6', stool: '#3a2e28', a0: rr(0, 2) }));
    for (const [tx, tz] of [[-4.2, -11.9], [4.4, -12.0], [-7.6, -6.6], [7.6, -6.6], [-7.7, -12.1], [7.7, -12.1]]) tree(st, tx, tz, rr(.85, 1.0), 'plane', { pit: true });
    const bs = [bench(st, -3.3, -7.3, Math.PI / 2 + .5), bench(st, -2.9, -11.8, .5), bench(st, 2.8, -11.8, -.5)];
    for (const b of bs) for (const s of seatsOf(b, 2)) if (chance(.7)) seats.push(s);
    for (const s of seats) C.add({ ...s, mode: pick([MODE.sit, MODE.sit, MODE.sitPhone, MODE.sitRelax]) });
    lamp(st, -3.7, -9.4, { h: 2.6 }); lamp(st, 3.7, -9.4, { h: 2.6 });
    // street musician
    C.add({ x: -2.6, z: -6.5, ry: .6, mode: MODE.browse, v: 'c', look: { top: '#2a2a2a', acc: '#2a2a2a' } });
    C.add({ x: -5.1, z: -9.3, ry: 1.0, mode: MODE.selfie, v: 'f' }); C.add({ x: -5.45, z: -9.45, ry: .8, mode: MODE.idle, v: 'm' });
    chat(C, 3.0, -9.6, 3); chat(C, -1.2, -12.6, 2, 0, { old: true });
    { const gt = group(st, -2.6, 0, -6.5, .6); ell(gt, .1, .14, .04, '#c9772e', .02, .3, .18); box(gt, .03, .3, .02, '#3a2414', .14, .45, .18).rotation.z = -.9; cyl(st, .1, .12, .08, '#3a2a20', -2.3, 0, -6.1, 10); }
    for (const [px, pz] of [[-2.0, -5.6], [-2.6, -5.4], [-3.3, -5.7], [-1.5, -5.9]]) C.add({ x: px, z: pz, ry: Math.PI + rr(-.3, .3), mode: chance(.7) ? MODE.clap : MODE.idle });
    // photographers facing the tower
    for (const [px, pz] of [[1.3, -6.7], [-1.4, -6.9], [4.9, -5.9], [-5.0, -6.4]]) C.add({ x: px, z: pz, ry: Math.atan2(0 - px, -10.0 - pz), mode: MODE.photo });
    // juice & simit carts
    { const jc = group(st, 5.9, 0, -12.2, -.3); box(jc, .9, .45, .5, '#2a6fb0', 0, .2, 0); for (let i = 0; i < 12; i++) blob(jc, .06, pick(['#f08a2c', '#c9302c', '#7a1a3a']), -.33 + (i % 6) * .13, .7, -.08 + Math.floor(i / 6) * .14, true); cyl(jc, .02, .02, 1.0, '#ddd', 0, .65, 0, 5); cone(jc, .55, .22, '#f2c230', 0, 1.6, 0, 10); sign(jc, 'NAR · PORTAKAL', .8, .14, { bg: '#fff', fg: '#c9302c' }, 0, .55, .26, 0, false, null); }
    C.add({ x: 6.05, z: -12.7, ry: -.3, mode: MODE.vendor, v: 'm' });
    // backdrop buildings behind the tower (face +z)
    const backC = ['#d9c7a6', '#b56a52', '#e3d3b0', '#9aa7a0', '#c9a27e', '#e6cfc0'];
    let bx = -12;
    for (let i = 0; i < 6; i++) { const w = [3.8, 4.4, 3.6, 4.0, 4.2, 4.0][i]; apt(st, { x: bx + w / 2, z: -13.9, w: w - .04, d: 2.2, floors: ri(4, 6), sides: i === 0 || i === 5 ? 1 : 0, color: backC[i], ornate: true, roof: chance(.5) ? 'hip' : 'flat', roofC: '#a8573e', balc: .45, shop: chance(.6) ? { text: pick(['KAHVE', 'LOKANTA', 'SAHAF', 'HEDİYELİK', 'BÖREKÇİ']), type: pick(['cafe', 'books', 'antique', 'bakery']), style: { bg: '#f4efe4', fg: '#3a2414', serif: true }, awning: chance(.5) ? ['#7a1e1e', '#f4efe4'] : null } : null }); bx += w; }
    // side buildings of the square
    for (const s of [-1, 1]) for (let i = 0; i < 2; i++) apt(st, { x: s * 10.3, z: -7.4 - i * 2.6, w: 2.5, d: 3.4, floors: ri(4, 5), sides: 1, color: pick(['#c9a27e', '#e3d3b0', '#b56a52', '#d4b8a0']), ry: -s * Math.PI / 2, ornate: true, roof: 'flat', balc: .4, shop: { text: pick(['KAFE', 'BALIK EKMEK', 'GALATA PASTANESİ']), type: pick(['cafe', 'sweets']), style: { bg: '#2a2018', fg: '#f6e3b4', serif: true }, awning: [s > 0 ? '#2f5a3a' : '#7a1e1e', '#f4efe4'] } });
    // ---- Galip Dede: buildings both sides, stepping with the slope
    const L_W = [2.4, 2.3, 2.5, 2.2, 2.2], R_W = [3.0, 3.2, 2.8, 3.0, 3.0];
    const shopsL = [{ text: 'GALATA MÜZİK', type: 'music', style: { bg: '#2a1e18', fg: '#f2c46d', serif: true } }, { text: 'SAZ · UD · BAĞLAMA', type: 'music', style: { bg: '#3a2418', fg: '#f6e3b4' } }, { text: 'ÇAY OCAĞI', type: 'tea', style: { bg: '#b8202b', fg: '#fff' }, awning: ['#b8202b', '#f3ece0'] }, { text: 'DAVUL · ZİL', type: 'music', style: { bg: '#111', fg: '#e9c46a' } }, { text: 'PLAK', type: 'antique', style: { bg: '#1e3446', fg: '#ff8a7a' } }];
    const shopsR = [{ text: 'KEMAN ATÖLYESİ', type: 'music', style: { bg: '#f4efe4', fg: '#5a2a12', serif: true } }, { text: 'MÜZİK ALETLERİ', type: 'music', style: { bg: '#2a1e18', fg: '#f6e3b4' } }, { text: 'KAHVE', type: 'cafe', style: { bg: '#fff7e6', fg: '#2a5a3a' }, awning: ['#2a5a3a', '#f3ece0'] }, { text: 'ANTİKA', type: 'antique', style: { bg: '#1e3446', fg: '#e9d9b0', serif: true } }, { text: 'GİTAR EVİ', type: 'music', style: { bg: '#c9302c', fg: '#fff' } }];
    const facC = ['#e5b55c', '#c86b5a', '#8fb0a5', '#efe0c2', '#d48fa0', '#b8c4d6', '#e8c9a0', '#a9b88a', '#d9a066', '#b7a2c8', '#c9b590', '#9c5a48'];
    const shopFronts = [];
    for (const side of [-1, 1]) {
      const ws = side < 0 ? L_W : R_W; let zz = side < 0 ? 5.6 : 9.0;
      for (let i = 0; i < ws.length; i++) {
        const w = ws[i], zc = zz - w / 2, hi = hY(zz), lo = hY(zz - w);
        const shop = (side < 0 ? shopsL : shopsR)[i];
        apt(st, { x: side * 4.35, y: hi, z: zc, w: w - .04, d: 4.5, floors: ri(4, 5), sides: 1, color: facC[(i * 2 + (side > 0 ? 1 : 0)) % facC.length], ry: -side * Math.PI / 2, ornate: true, plinth: hi - lo + .3, stone: pick(['#b8ab94', '#a89c86', '#c2b59c']), roof: chance(.75) ? 'hip' : 'flat', roofC: pick(['#a8573e', '#b5634a', '#9c4a36', '#7d8792']), balc: .45, cumba: chance(.35), shutters: chance(.4) ? pick(['#3f6b55', '#6b4a3a', '#5a6a7a']) : null, shop, back: true });
        if (shop.type === 'music') { const fx = side * 1.88; instrumentRack(st, fx, hi, zc - w * .3, -side * Math.PI / 2); shopFronts.push({ x: side * 2.4, z: zc + .2, face: side < 0 ? -Math.PI / 2 : Math.PI / 2 }); }
        zz -= w;
      }
    }
    // second row behind (rooftops seen from above)
    for (const side of [-1, 1]) { let zz = 9; for (let i = 0; i < 5; i++) { const w = [3.2, 2.8, 3.0, 2.6, 2.9][i]; const zc = zz - w / 2; apt(st, { x: side * 9.35, y: hY(zz), z: zc, w: w - .04, d: 5.2, floors: 3, sides: 1, color: pick(facC), ry: side * Math.PI / 2, ornate: chance(.5), plinth: hY(zz) - hY(zz - w) + .3, roof: chance(.8) ? 'hip' : 'flat', roofC: pick(['#a8573e', '#b5634a']), balc: .5, shop: null, back: true }); zz -= w; } }
    // Mevlevihane occupies the top of the left side
    box(st, 4.5, TOP - hY(5.6) + .2, 3.4, '#b8ab94', -4.35, hY(5.6) - .2, 7.3);
    mevlevihane(st, S, -6.6, -2.1, 5.6, 9.0, TOP);
    // laundry lines + flags across the street
    const clothes = ['#e94b3c', '#f2c230', '#3a86c8', '#ffffff', '#4caf6a', '#f08a3c', '#d48fa0'];
    for (const [lz, dy] of [[6.6, 3.8], [2.4, 4.4], [-2.0, 3.9]]) { const ly = hY(lz) + dy; line(g, sag(V(-2.15, ly, lz), V(2.15, ly, lz), .25), '#555'); for (let i = 0; i < 6; i++) { const k = (i + .5) / 6; const c = new THREE.Mesh(UB, M(pick(clothes))); c.scale.set(.26, rr(.3, .45), .02); c.position.set(lerp(-1.9, 1.9, k), ly - Math.sin(Math.PI * k) * .25 - c.scale.y / 2, lz); c.castShadow = true; g.add(c); const ph = R() * 9; S.updates.push((t) => { c.rotation.x = Math.sin(t * 2 + ph) * .22; }); } }
    bunting(S, g, V(-2.15, hY(4.4) + 5.2, 4.4), V(2.15, hY(4.4) + 5.2, 4.4), 12, .3, ['#e30a17', '#ffffff']);
    flag(S, g, -2.2, hY(0.6) + 4.6, .6, .7, Math.PI / 2 + .5, false); flag(S, g, 2.2, hY(-3.4) + 4.9, -3.4, .7, -Math.PI / 2 - .5, false);
    for (const [a, b] of [[V(-2.15, hY(8) + 5.4, 8), V(2.15, hY(6) + 5.0, 6)], [V(-2.15, hY(1) + 5.6, 1), V(2.15, hY(-1) + 5.3, -1)], [V(-2.15, hY(-4) + 5.2, -4), V(2.15, hY(-3) + 5.0, -3)]]) line(g, sag(a, b, .4), '#202020');
    // tea tables on the street outside the çay ocağı (left, 3rd building)
    const tz = 5.6 - L_W[0] - L_W[1] - L_W[2] / 2; for (const dz of [-.55, .55]) { const ss = teaSet(st, -1.3, tz + dz, { y: hY(tz + dz) + .02, n: 2, a0: Math.PI / 2, stool: '#b8342c' }); for (const s of ss) if (chance(.8)) C.add({ ...s, mode: MODE.sit }); }
    C.add({ v: 'w', speed: .5, path: { pts: [V(-1.75, hY(tz + 1.2) + .02, tz + 1.2), V(-1.75, hY(tz - .9) + .02, tz - .9)], mode: MODE.carry, waits: { 0: { t: [2, 4], mode: MODE.browse, face: -Math.PI / 2 }, 1: { t: [2, 4], mode: MODE.browse, face: Math.PI / 2 } } } });
    // street lamps (wall-mounted)
    for (const zz2 of [7, 3, -1, -4.5]) for (const s of [-1, 1]) { const yy = hY(zz2) + 2.6; box(st, .5, .04, .04, '#23302a', s * 1.95, yy, zz2 + s * .3); box(st, .14, .22, .14, N('#f5ecd2'), s * 1.75, yy - .25, zz2 + s * .3); cone(st, .13, .1, '#23302a', s * 1.75, yy - .04, zz2 + s * .3, 4); }
    // ---- Tünel square: tram + station
    box(st, 24, .02, 2.0, '#9a948a', 0, TOP, 12).castShadow = false;
    for (const s of [-.36, .36]) box(st, 24, .02, .05, N('#6c7079'), 0, TOP + .02, 12 + s * .5).castShadow = false;
    for (const x of [-11.3, -4.4, 3.0, 9.0]) { cyl(st, .05, .06, 2.6, '#3f5145', x, TOP, 13.2, 8); box(st, .05, .05, 1.3, '#3f5145', x, TOP + 2.5, 12.6); }
    line(g, [V(-12, TOP + 2.42, 12), V(12, TOP + 2.42, 12)], '#222');
    const tr = tram(S, g, { dest: 'TAKSİM', c: '#b81f2a', cream: '#f2ebdc' }); tr.position.set(-6.5, TOP + .03, 12);
    S.updates.push((t) => { const c = t % 26; let x; if (c < 6) x = -6.5; else if (c < 15) x = lerp(-6.5, 13.5, ease((c - 6) / 9)); else if (c < 16) x = 13.5; else if (c < 22) x = lerp(-13.5, -6.5, ease((c - 16) / 6)); else x = -6.5; tr.position.x = x; const s = 1 - smooth(10.5, 12.6, Math.abs(x)); tr.scale.setScalar(Math.max(.0001, s)); tr.visible = s > .01; });
    for (const sp of tr.userData.seats) if (chance(.5)) C.add({ attach: tr, x: sp.x, y: sp.y - .02, z: sp.z, ry: sp.z > 0 ? -Math.PI / 2 : Math.PI / 2, mode: MODE.sit });
    // Tünel funicular station (neo-classical, one storey) on the left
    { const t = group(st, -7.5, TOP, 13.8); box(t, 5.0, 1.7, 2.2, '#e6dccb', 0, 0, 0); box(t, 5.2, .14, 2.4, '#f4efe4', 0, 1.7, 0); box(t, 5.0, .4, 2.2, '#e6dccb', 0, 1.84, 0); box(t, 5.3, .1, 2.5, '#f4efe4', 0, 2.24, 0);
      for (const xx of [-1.6, 0, 1.6]) archWin(t, .8, 1.3, .06, M('#3c4a56'), xx, 0, -1.11, Math.PI); for (const xx of [-2.2, -.8, .8, 2.2]) box(t, .16, 1.7, .1, '#f4efe4', xx, 0, -1.14);
      for (const xx of [-1.6, 0, 1.6]) archWin(t, .6, 1.1, .06, M('#3c4a56'), xx, .2, 1.11); for (const xx of [-.7, .7]) archWin(t, .5, 1.0, .06, M('#3c4a56'), 2.51, .2, xx, Math.PI / 2);
      sign(t, 'TÜNEL 1875', 1.8, .3, { bg: '#7a1e1e', fg: '#f6e3b4', serif: true }, 0, 1.98, -1.13, Math.PI, false, '#7a1e1e'); }
    { const t = group(st, 6.0, TOP, 13.9); apt(t, { x: 0, z: 0, w: 5, d: 2.0, floors: 3, color: '#d9c0a0', ornate: true, ry: Math.PI, roof: 'flat', sides: 1, back: true, shop: { text: 'İSTİKLAL CADDESİ', type: 'clothes', style: { bg: '#1e3446', fg: '#fff' } } }); }
    for (const x of [-3, 2.4]) lamp(st, x, 9.6, { h: 2.6, y: TOP, arms: 2 });
    for (const x of [-10.5, 10.5]) tree(st, x, 10.4, .8, 'plane', { y: TOP });
    // ---- walkers
    const ST = (zA, zB, x, n, waits) => { for (let i = 0; i < n; i++) { const xo = x + rr(-.25, .25); const pts = []; for (let k = 0; k <= 8; k++) { const zz2 = lerp(zA, zB, k / 8); pts.push(V(xo, hY(zz2) + .02, zz2)); } C.add({ path: { pts, offset: R(), start: ri(0, 6), waits }, v: pick(['m', 'f', 's', 'b', 'fb', 'k', 'c', 'h']) }); } };
    ST(11.2, -6.0, -.55, 5); ST(11.2, -6.0, .55, 5); ST(10.6, -5.5, 1.75, 2); ST(10.6, -5.5, -1.75, 2);
    // shop browsers at instrument racks
    for (const f of shopFronts.slice(0, 4)) { const zA = f.z + 1.4, zB = f.z - 1.4; const xo = f.x * .7; C.add({ v: pick(['b', 'fb', 'k']), path: { pts: [V(xo, hY(zA) + .02, zA), V(xo, hY(f.z) + .02, f.z), V(xo, hY(zB) + .02, zB)], waits: { 1: { t: [3, 6], mode: MODE.browse, face: f.face } }, offset: R() } }); }
    // square loops
    for (let i = 0; i < 5; i++) { const r = rr(3.3, 4.4); const pts = []; for (let k = 0; k <= 10; k++) { const a = (-105 + k * 21) * Math.PI / 180; pts.push(V(Math.sin(a) * r, .02, -10.0 + Math.cos(a) * r)); } C.add({ path: { pts, offset: R(), start: ri(0, 8) } }); }
    // Tünel square walkers
    for (let i = 0; i < 4; i++) C.add({ path: { pts: [V(-9.5, TOP + .02, 10.7 + rr(-.25, .3)), V(9.5, TOP + .02, 10.7 + rr(-.25, .3))], offset: R() } });
    C.add({ x: -6, y: TOP, z: 11.15, ry: 0, mode: MODE.standPhone }); C.add({ x: -5.3, y: TOP, z: 11.1, ry: -.4, mode: MODE.idle, v: 'k' }); chat(C, 1.0, 10.2, 2, TOP);
    // animals, birds, clouds
    cat(S, st, -1.4, -7.2, .6, '#d98a3d'); cat(S, st, 1.3, -12.4, 2, '#2b2b2b', true); cat(S, st, -1.9, 1.2, 1.2, '#f2efe8', true, hY(1.2)); cat(S, st, 1.95, 6.2, -1.6, '#9c9c9c', true, hY(6.2)); dog(S, st, -6.2, -12.4, .9, '#c9a77a', true);
    pigeons(S, g, 22, 0, -10.0, 4.4, 1.6, 9, 20, 0, 0, -5.4);
    gulls(S, g, 6, 0, 14, -10.0, 3.5, 7);
    const cls = [[-16, 19, -24, 1.6], [12, 21, -28, 2.0], [-26, 16, -8, 1.4], [26, 18, -4, 1.7], [4, 24, -38, 2.4], [-30, 22, -34, 1.9]].map(([x, y, z, s]) => ({ c: cloud(g, x, y, z, s), x }));
    S.updates.push((t) => { for (const c of cls) c.c.position.x = ((c.x + t * .4 + 36) % 72) - 36; });
  }
};
