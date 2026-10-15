import { THREE, TAU, R, rr, ri, pick, chance, lerp, ease, smooth, V, M, E, N, EN, noOL, box, cyl, rod, blob, ell, dome, cone, line, sag, group, sign, texMat, stripeTex, decal, glow, ctex, UB, PLANE, mesh, cg } from '../kit.js';
import { apt, entrance, win, tree, bench, seatsOf, lamp, bin, bollard, busStop, crate, cat, dog, curb, crosswalk, dashes, shade, streetSign, powerPole, teaSet, interiorTex } from '../props.js';
import { car, Lane, signal, rain, sunLight, base } from '../dyn.js';
import { MODE, lane, chat } from '../people.js';

export default {
  id: 'gece', seed: 22, chip: 'Yağmurlu gece', title: 'Kiraz Sokak', crowdCap: 36,
  sub: 'Gece yarısına az kala yağmur bastırdı. Bakkalın ışığı hâlâ yanıyor, dönerci son müşterilerini bekliyor.',
  meta: 'Moda Mah. · Kasım, 23:47', night: true,
  sky: 'linear-gradient(180deg,#0e1222 0%,#1b2238 55%,#2a2a40 100%)', fog: ['#151a2a', 40, 100],
  shots: [
    { a: [18, 38], e: [31, 26], r: [30, 26], t: [[0, 1, -1]], d: 8.5 },
    { a: [-12, 6], e: [7, 10], r: [10.5, 9.5], t: [[0, 1.3, -2.4]], d: 7.5 },
    { a: [52, 78], e: [50, 43], r: [23, 21], t: [[0, 0, 0]], d: 7.5 },
    { a: [-60, -38], e: [12, 16], r: [15, 14], t: [[-5, 1.4, 1]], d: 7 },
  ],
  build(S) {
    const st = S.static, g = S.group, C = S.crowd;
    S.hemi = new THREE.HemisphereLight('#5d6c9c', '#16182a', .6); g.add(S.hemi);
    sunLight(S, '#8fa2e6', .5, [-8, 20, 10], 17);
    base(st, 24, 18, 0, 0, '#3a404d', '#4a3426');
    // street z∈[-.5,4], sidewalks
    box(st, 24, .03, 4.5, '#2b303b', 0, 0, 1.75).castShadow = false; dashes(st, -11.5, 11.5, 1.75, .031);
    crosswalk(st, -1.2, 1.75, 4.2, 'x', 7, .031);
    box(st, 24, .14, 2.0, '#5b5f69', 0, 0, -1.5).castShadow = false; curb(st, 0, -.52, 24, .14, '#7b7f88', .16);
    box(st, 24, .14, 1.5, '#5b5f69', 0, 0, 4.75).castShadow = false; curb(st, 0, 4.02, 24, .14, '#7b7f88', .16);
    box(st, 24, .06, 3.5, '#2f3a33', 0, 0, 7.25).castShadow = false;
    // ---- buildings (facades at z=-2.5)
    // bakkal
    apt(st, { x: 0, y: .14, z: -4.8, w: 6.2, d: 4.6, floors: 4, color: '#b9a589', night: true, lit: .6, sides: 0, roof: 'flat', cols: 5,
      shop: { text: 'YILDIZ BAKKAL', type: 'market', style: { bg: '#fdf6e8', fg: '#c8202a', sub: 'ŞARKÜTERİ · GAZETE · EKMEK', subfg: '#2a4b7a' }, awning: ['#2f7a4b', '#f2efe6'], width: 5.4 } });
    const F = -2.5;
    for (let i = 0; i < 4; i++) { const cx = -2.4 + i * .5; const cr = crate(st, cx, F + .45, ['#f08a2c', '#d63a2c', '#8cc63e', '#f2d23c'][i], .14); }
    for (let i = 0; i < 4; i++) crate(st, -2.15 + i * .5, F + .45, ['#7a2a6a', '#f2d23c', '#8cc63e', '#d63a2c'][i], .34);
    { const bc = group(st, 1.7, .14, F + .4); box(bc, .6, .8, .4, '#d2d6da', 0, 0, 0); box(bc, .5, .45, .03, EN('#ffe8b8'), 0, .3, .21); for (let i = 0; i < 3; i++) ell(bc, .05, .04, .14, '#c98a3e', -.15 + i * .15, .5, .1); }
    { const fz = group(st, 2.55, .14, F + .45); box(fz, .9, .55, .45, '#f4f4f4', 0, 0, 0); box(fz, .8, .12, .03, EN('#ffffff'), 0, .4, .23); sign(fz, 'DONDURMA', .7, .12, { bg: '#e94b3c', fg: '#fff' }, 0, .28, .231, 0, true, null); }
    { const tp = group(st, -2.85, .14, F + .35); for (let i = 0; i < 3; i++) { cyl(tp, .12, .12, .45, '#3a86c8', -.15 + i * .15, 0, 0, 10); dome(tp, .12, '#3a86c8', -.15 + i * .15, .45, 0, 8); } box(tp, .55, .6, .04, N('#888'), 0, 0, .14).castShadow = false; }
    const shopL = new THREE.PointLight('#ffd9a0', 9, 9, 1.4); shopL.position.set(0, 1.2, F + 1.0); g.add(shopL);
    // döner (left) + berber further left
    apt(st, { x: -5.5, y: .14, z: -4.8, w: 4.6, d: 4.6, floors: 3, color: '#8a7f74', night: true, lit: .45, sides: 0, shop: { text: 'DÖNER · LAHMACUN', type: 'kebab', style: { bg: '#c3272e', fg: '#fff3d6' }, awning: ['#c3272e', '#f2efe6'] } });
    const dl = new THREE.PointLight('#ffbf7a', 5, 7, 1.5); dl.position.set(-5.5, 1.1, F + .9); g.add(dl);
    const dSeats = []; for (const dx of [-6.3, -4.7]) dSeats.push(...teaSet(st, dx, F + .62, { n: 2, a0: 0, y: .14, top: '#e8e2d6', stool: '#c3272e', glasses: 1 }));
    apt(st, { x: -9.9, y: .14, z: -4.8, w: 4.2, d: 4.6, floors: 4, color: '#7c8a99', night: true, lit: .35, sides: 'l', shop: { text: 'BERBER', type: 'barber', style: { bg: '#0d1a2a', fg: '#7fd4ff' } } });
    const poleTex = ctex(64, 256, (q) => { q.fillStyle = '#fff'; q.fillRect(0, 0, 64, 256); for (let i = -4; i < 12; i++) { q.fillStyle = i % 2 ? '#d02a2a' : '#2a4bd0'; q.beginPath(); q.moveTo(0, i * 32); q.lineTo(64, i * 32 - 40); q.lineTo(64, i * 32 - 24); q.lineTo(0, i * 32 + 16); q.fill(); } });
    poleTex.wrapT = THREE.RepeatWrapping; const pm = noOL(new THREE.MeshBasicMaterial({ map: poleTex }));
    const pol = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, .6, 14), pm); pol.position.set(-8.0, .95, F + .14); g.add(pol); glow(g, -8.0, .95, F + .3, 1.3, '#9cc8ff', .5);
    S.updates.push((t) => { poleTex.offset.y = (t * .4) % 1; });
    const bL = new THREE.PointLight('#8fc8ff', 2.5, 6, 1.6); bL.position.set(-9.9, 1.1, F + .9); g.add(bL);
    // right: closed shop with graffiti shutter, apartment entrance
    const cs = apt(st, { x: 5.6, y: .14, z: -4.8, w: 4.6, d: 4.6, floors: 5, color: '#a4876f', night: true, lit: .4, cumba: true, sides: 0, noGround: true }); entrance(cs, 1.6, 2.3, '#f3ead9', true);
    apt(st, { x: 9.95, y: .14, z: -4.8, w: 4.1, d: 4.6, floors: 4, color: '#9a8a9a', night: true, lit: .4, sides: 'r', roof: 'hip', roofC: '#7a4a3a' });
    const shTex = ctex(256, 128, (q) => { q.fillStyle = '#8b9096'; q.fillRect(0, 0, 256, 128); q.fillStyle = '#6f747a'; for (let y = 0; y < 128; y += 8) q.fillRect(0, y, 256, 3); q.font = '900 46px Figtree, sans-serif'; q.fillStyle = '#e8507a'; q.save(); q.rotate(-.08); q.fillText('KİRAZ', 26, 80); q.restore(); q.fillStyle = '#5ad1c2'; q.font = '700 22px Figtree, sans-serif'; q.fillText('★ MODA', 150, 104); });
    decal(st, shTex, 3.0, .92, 4.9, .62, F + .02, 0, 0);
    // ---- street lamps (sodium) with light cones
    for (const [lx, lz] of [[4.6, -.85], [-6.6, -.85]]) {
      lamp(st, lx, lz, { style: 'sodium', h: 3.8, night: true, y: .14 });
      const cn = new THREE.Mesh(new THREE.ConeGeometry(1.5, 3.6, 20, 1, true), noOL(new THREE.MeshBasicMaterial({ color: '#ffb35a', transparent: true, opacity: .07, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })));
      cn.position.set(lx, 1.95, lz + 1.05); cn.userData.ground = true; g.add(cn);
      const L = new THREE.PointLight('#ffa54f', 13, 10, 1.5); L.position.set(lx, 3.5, lz + 1.05); g.add(L);
    }
    // puddles with warm reflections + ripples
    const pudTex = ctex(128, 128, (q) => { const r = q.createRadialGradient(64, 64, 10, 64, 64, 64); r.addColorStop(0, 'rgba(255,190,110,.75)'); r.addColorStop(.6, 'rgba(255,170,90,.35)'); r.addColorStop(1, 'rgba(255,170,90,0)'); q.fillStyle = r; q.fillRect(0, 0, 128, 128); });
    const pudM = new THREE.MeshBasicMaterial({ map: pudTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const puds = [[4.6, 1.0, 2.4], [5.4, 2.6, 1.7], [-6.6, 1.2, 2.2], [-1, -1.3, 2.2], [1.5, -1.5, 1.5], [-3, 3.0, 1.5], [2.5, 4.6, 1.3], [-8.5, 2.6, 1.7], [8.5, 1.4, 1.9], [-.2, 1.2, 1.6]];
    for (const [px, pz, ps] of puds) { const m = new THREE.Mesh(PLANE, pudM); m.rotation.x = -Math.PI / 2; m.scale.set(ps * 1.5, ps, 1); m.position.set(px, pz < -.5 || pz > 4 ? .15 : .04, pz); g.add(m); }
    const ringG = new THREE.RingGeometry(.8, 1, 20); const rings = [];
    for (let i = 0; i < 30; i++) { const m = new THREE.Mesh(ringG, new THREE.MeshBasicMaterial({ color: '#cfdcff', transparent: true, opacity: 0, depthWrite: false })); m.rotation.x = -Math.PI / 2; g.add(m); rings.push({ m, life: R() }); }
    S.updates.push((t, dt) => { for (const r of rings) { r.life += dt * 1.6; if (r.life > 1) { r.life = 0; const p = pick(puds); r.m.position.set(p[0] + rr(-1, 1) * p[2] * .6, p[1] < -.5 || p[1] > 4 ? .16 : .05, p[1] + rr(-.5, .5) * p[2] * .5); } const s = .05 + r.life * .22; r.m.scale.set(s, s, s); r.m.material.opacity = (1 - r.life) * .6; } });
    // parked cars + courier scooter
    const p1 = car(st, { type: 'sedan', c: '#eeeeea' }); p1.position.set(-7.2, .03, .25);
    const p2 = car(st, { type: 'sedan', c: '#7a1e1e' }); p2.position.set(8.0, .03, .25); p2.rotation.y = Math.PI;
    const SIG = signal(26, 17, 6);
    const mc = car(g, { type: 'taxi', c: '#f2c230', night: true }), mc2 = car(g, { type: 'sedan', c: '#3a3a44', night: true });
    new Lane(S, { z: 2.6, x0: -11, x1: 11, dir: 1, speed: 3.6, fade: 1.2, stops: [{ x: -2.5, red: (t) => !SIG.carGo(t) }] }).fill([mc, mc2]);
    const hl = new THREE.PointLight('#fff2d0', 0, 9, 1.4); g.add(hl); S.updates.push(() => { hl.position.set(mc.position.x + 1.6, .6, mc.position.z); hl.intensity = mc.visible ? 9 * mc.scale.x : 0; });
    const sc = group(g); { box(sc, .8, .26, .28, '#c73636', 0, .14, 0); box(sc, .4, .36, .42, '#c73636', -.28, .42, 0); sign(sc, 'KURYE', .36, .1, { bg: '#c73636', fg: '#fff' }, -.28, .68, .215, 0, false, null); for (const sx of [-.32, .32]) { const w = cyl(sc, .13, .13, .07, '#1a1a1a', sx, 0, 0, 10); w.rotation.x = Math.PI / 2; w.position.y = .13; } rod(sc, V(.34, .2, 0), V(.3, .62, 0), .015, '#333', 4); box(sc, .03, .03, .36, '#333', .3, .62, 0); glow(sc, .45, .4, 0, 1.0, '#fff4d6', .8); }
    sc.userData.L = 1.0; new Lane(S, { z: .9, x0: -11, x1: 11, dir: -1, speed: 3.0, fade: 1, stops: [{ x: .1, red: (t) => !SIG.carGo(t) }] }).add(sc, .2);
    C.add({ attach: sc, x: .02, y: .14, z: 0, ry: Math.PI / 2, mode: MODE.sit, v: 'c', look: { top: '#c73636', acc: '#c73636' } });
    // street sign, poles, wires
    streetSign(st, 3.4, -.85, 'KİRAZ SK.', 'MODA MAH.', 0, .14);
    for (const [px, pz] of [[9.6, 4.5], [-9.6, 4.5]]) powerPole(st, px, pz, 5.2, .14);
    line(g, sag(V(9.6, 5.2, 4.5), V(-9.6, 5.2, 4.5), .9), '#151515'); line(g, sag(V(9.6, 5.05, 4.5), V(-9.6, 5.05, 4.5), 1.0), '#151515');
    for (const tx of [-3.5, 3.5]) line(g, sag(V(9.6 * Math.sign(tx), 5.1, 4.5), V(tx * 1.2, 4.6, -2.5), .5), '#151515');
    // front strip: bus stop, midye vendor, trees, low wall
    busStop(st, -5.2, 5.25, Math.PI, { night: true, y: .14 });
    { const mv = group(st, 1.4, .14, 5.4); box(mv, .6, .5, .45, '#c9c4b8', 0, 0, 0); cyl(mv, .32, .32, .05, '#ddd', 0, .5, 0, 14); for (let i = 0; i < 14; i++) { const m = ell(mv, .045, .02, .07, '#1a1d24', rr(-.22, .22), .56, rr(-.22, .22)); m.rotation.y = rr(0, 3); } for (let i = 0; i < 4; i++) blob(mv, .035, '#f2d23c', rr(-.2, .2), .57, rr(-.2, .2), true); glow(mv, 0, .9, 0, 1.2, '#ffe0a8', .5); box(mv, .04, .9, .04, '#555', .3, .5, -.2); box(mv, .16, .2, .16, EN('#ffe0a8'), .3, 1.4, -.2); }
    for (const tx of [2.8, 7.8]) tree(st, tx, 6.9, .9, 'night');
    box(st, 24, .4, .2, '#5b5f69', 0, .06, 8.9);
    bin(st, -2.8, 4.6, '#3d4a5a'); bin(st, 9.0, -1.0, '#3d4a5a');
    // cats under the awning & by the bins
    box(st, .5, .3, .38, '#b88a5a', -1.4, .14, F + .5); cat(S, st, -1.4, F + .5, .2, '#d98a3d', true, .14); cat(S, st, -.8, F + .6, -.5, '#f2f0ea', true, .14);
    cyl(st, .09, .07, .05, '#3a7bd5', -.35, .14, F + .85, 10); cyl(st, .09, .07, .05, '#d5503a', -.1, .14, F + .9, 10);
    cat(S, st, -2.5, 4.4, 1.0, '#2b2b2b', false, .14); dog(S, st, 6.6, 5.6, 2.0, '#c9a77a', true, .14);
    // ---- people
    for (const s of dSeats) if (chance(.7)) C.add({ ...s, mode: pick([MODE.sit, MODE.sitPhone, MODE.talk]) });
    C.add({ x: .4, y: .14, z: F + .75, ry: 0, mode: MODE.vendor, v: 'g', look: { top: '#e8e2d6' } });
    C.add({ x: -.9, y: .14, z: F + .9, ry: Math.PI + .2, mode: MODE.browse, v: 'hb' });
    C.add({ x: -5.5, y: .14, z: F + .35, ry: 0, mode: MODE.vendor, v: 'w', look: { top: '#ffffff' } });
    C.add({ x: -5.2, y: .17, z: 5.28, ry: Math.PI, mode: MODE.sitPhone }); C.add({ x: -4.3, y: .14, z: 5.05, ry: Math.PI - .4, mode: MODE.idle, v: 'fu' });
    C.add({ x: 1.4, y: .14, z: 5.9, ry: Math.PI, mode: MODE.vendor, v: 'c' }); C.add({ x: 1.05, y: .14, z: 5.0, ry: .3, mode: MODE.browse, v: 'u' });
    C.add({ x: 6.2, y: .14, z: -2.05, ry: -.6, mode: MODE.wave, v: 'c' }); C.add({ x: 6.75, y: .14, z: -2.25, ry: Math.PI - .8, mode: MODE.idle, v: 'm', old: true });
    const um = (pts, v, n = 1) => { for (let i = 0; i < n; i++) C.add({ v, path: { pts: lane(pts, rr(-.2, .2)), offset: R() }, speed: rr(.5, .7) }); };
    um([V(-11.5, .14, -1.2), V(11.5, .14, -1.2)], 'u', 2); um([V(11.5, .14, -1.2), V(-11.5, .14, -1.2)], 'fu', 1);
    um([V(-9, .14, 4.5), V(9, .14, 4.5)], 'fu', 1); um([V(9, .14, 4.5), V(-9, .14, 4.5)], 'u', 1);
    for (const vv of ['u', 'fu']) C.add({ v: vv, path: { pts: [V(-1.2 + rr(-.3, .3), .14, -1.4), V(-1.2 + rr(-.3, .3), .14, -.7), V(-1.2 + rr(-.3, .3), .03, -.4), V(-1.2 + rr(-.3, .3), .03, 3.9), V(-1.2 + rr(-.3, .3), .14, 4.2), V(-1.2 + rr(-.3, .3), .14, 5.0)], offset: R(), waits: { 1: { t: [0, 1], until: SIG.pedGo }, 4: { t: [0, 1], until: SIG.pedGo } } }, speed: rr(.5, .65) });
    // late for the bus: someone runs down the pavement with an umbrella
    C.add({ v: 'u', speed: 1.05, path: { pts: [V(10.5, .14, 4.6), V(-4.0, .14, 4.7)], mode: MODE.run, offset: R(), waits: { 1: { t: [6, 12], mode: MODE.idle, face: Math.PI } } } });
    chat(C, .6, -1.25, 2, .14, { v: ['u', 'fu', 'm'] });
    rain(S, g, 2000, [12, 16, 9], .26);
    const fl = document.getElementById('flash'); let next = 6;
    S.updates.push((t) => { if (S.lt === undefined) S.lt = -10; if (t > next) { S.lt = t; next = t + rr(9, 16); } const k = t - S.lt; const f = k < .6 ? (k < .08 ? 1 : k < .18 ? .2 : k < .26 ? .8 : Math.max(0, 1 - (k - .26) * 3) * .3) : 0; S.hemi.intensity = .6 + f * 2.5; if (fl) fl.style.opacity = (f * .25).toFixed(3); });
    S.onExit = () => { if (fl) fl.style.opacity = 0; };
  }
};
