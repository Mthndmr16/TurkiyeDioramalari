// Static prop library: buildings, windows, shops, street furniture, nature.
import { THREE, TAU, R, rr, ri, pick, chance, lerp, clamp, V, M, E, N, EN, mat, noOL, box, cyl, rod, blob, ell, dome, cone, hipRoof, ridgeRoof, gable, archTop, archWin, line, sag, group, ctex, sign, signTex, texMat, stripeTex, glow, PLANE, UB, cg, mesh, decal } from './kit.js';

export const WARM = ['#ffd08a', '#ffc670', '#ffe0a8', '#ffb85c', '#ffd9a0'];
export const GLASS = ['#7f9fb6', '#88a8bf', '#6f8fa8', '#93b0c4', '#7a95ab'];
const CURT = ['#f4efe4', '#efe3cf', '#e9d9c9', '#f2e8ee', '#e3ecf2', '#f0e0b8'];
const FLW = ['#d6304a', '#e85a7a', '#f6f0e6', '#d6304a', '#f08a3c', '#c2185b'];
export function shade(hex, k) { const c = new THREE.Color(hex); const h = {}; c.getHSL(h); c.setHSL(h.h, h.s, clamp(h.l + k, 0, 1)); return '#' + c.getHexString(); }

export const SHOPGLASS = noOL(new THREE.MeshToonMaterial({ color: '#cfe3ee', transparent: true, opacity: .22, depthWrite: false }));

/* ---------------- interiors painted behind shop glass */
const _int = new Map();
export function interiorTex(type, night) {
  const key = type + night; if (_int.has(key)) return _int.get(key);
  const t = ctex(256, 128, (g, w, h) => {
    const wall = { market: '#f3efe6', bakery: '#f1dcb4', fish: '#dfeef2', music: '#4a3528', cafe: '#e9d2b0', clothes: '#f2ece4', pharmacy: '#f4f7f6', books: '#e6d9c2', kebab: '#f0e2c8', sweets: '#f6e7d4', silk: '#efe6da', antique: '#5a4636', barber: '#e8eef2', florist: '#eef3e8', butcher: '#f3e9e6', tea: '#c9a57a' }[type] || '#eee';
    g.fillStyle = wall; g.fillRect(0, 0, w, h);
    const rnd = (a, b) => a + Math.random() * (b - a);
    const shelf = (y, items) => { g.fillStyle = '#8a6a4a'; g.fillRect(6, y, w - 12, 5); for (let x = 10; x < w - 14;) { const iw = rnd(8, 16), ih = rnd(14, 26); g.fillStyle = items[Math.floor(Math.random() * items.length)]; g.fillRect(x, y - ih, iw, ih); x += iw + rnd(1, 4); } };
    const P = ['#e94b3c', '#f2c230', '#3a86c8', '#4caf6a', '#f08a3c', '#ffffff', '#b04ad0', '#2a2a2a', '#e98bb0'];
    if (['market', 'pharmacy', 'books'].includes(type)) { const pal = type === 'pharmacy' ? ['#fff', '#d9eef5', '#f5d9d9', '#2a8a5a', '#fff'] : type === 'books' ? ['#7a1e1e', '#2a4b7a', '#2a5a3a', '#c9a64a', '#3a2a1a', '#e8dcc0'] : P; shelf(40, pal); shelf(75, pal); shelf(110, pal); }
    if (type === 'bakery') { for (let r = 0; r < 3; r++) { g.fillStyle = '#8a6a4a'; g.fillRect(6, 40 + r * 34, w - 12, 4); for (let x = 12; x < w - 20; x += 20) { g.fillStyle = r === 1 ? '#b8742e' : '#d39a52'; g.beginPath(); if (r === 1) { g.arc(x + 8, 32 + r * 34, 8, 0, TAU); g.fill(); g.fillStyle = wall; g.beginPath(); g.arc(x + 8, 32 + r * 34, 3.5, 0, TAU); g.fill(); } else { g.ellipse(x + 8, 32 + r * 34, 9, 6, 0, 0, TAU); g.fill(); } } } }
    if (type === 'fish') { g.fillStyle = '#cfe8f0'; g.fillRect(0, 80, w, 48); for (let i = 0; i < 26; i++) { g.fillStyle = pick(['#9aa8b4', '#c0c8d0', '#e07a6a', '#8a9aa6']); g.beginPath(); g.ellipse(rnd(10, w - 10), rnd(88, 120), 11, 4, rnd(-.4, .4), 0, TAU); g.fill(); } g.fillStyle = '#2a6fb0'; g.fillRect(0, 0, w, 14); }
    if (type === 'music' || type === 'antique') { for (let i = 0; i < 9; i++) { const x = 18 + i * 26, y = rnd(30, 60); g.fillStyle = pick(['#c9772e', '#8a4a22', '#e0b070', '#5a2a12', '#d8d0c0']); g.beginPath(); g.ellipse(x, y + 30, 10, 14, 0, 0, TAU); g.fill(); g.fillRect(x - 2, y, 4, 30); } g.fillStyle = '#c9a64a'; g.fillRect(0, 110, w, 18); }
    if (type === 'cafe' || type === 'tea') { g.fillStyle = '#7a4e2e'; g.fillRect(20, 70, 120, 58); g.fillStyle = '#c9c9c9'; g.fillRect(40, 40, 40, 30); for (let i = 0; i < 6; i++) { g.fillStyle = '#c7461f'; g.fillRect(150 + i * 15, 58, 6, 10); } g.fillStyle = '#5a3b25'; for (let i = 0; i < 3; i++) g.fillRect(150 + i * 30, 90, 22, 38); }
    if (type === 'clothes' || type === 'silk') { g.fillStyle = '#777'; g.fillRect(10, 22, w - 20, 3); for (let x = 14; x < w - 14; x += 12) { g.fillStyle = pick(type === 'silk' ? ['#d6304a', '#2a9d8f', '#f2c230', '#7a3fa0', '#e98bb0', '#3a86c8', '#f08a3c'] : P); g.fillRect(x, 25, 10, rnd(50, 90)); } }
    if (type === 'kebab') { g.fillStyle = '#9a5a2a'; g.beginPath(); g.moveTo(60, 20); g.lineTo(84, 20); g.lineTo(78, 100); g.lineTo(66, 100); g.fill(); g.fillStyle = '#d08a3a'; g.fillRect(40, 100, 64, 28); g.fillStyle = '#e94b3c'; g.fillRect(56, 14, 32, 6); g.fillStyle = '#8a6a4a'; g.fillRect(120, 70, 120, 58); g.fillStyle = '#fff'; for (let i = 0; i < 4; i++) g.fillRect(130 + i * 28, 60, 20, 10); }
    if (type === 'sweets') { for (let r = 0; r < 3; r++) for (let x = 10; x < w - 30; x += 34) { g.fillStyle = pick(['#d9a04a', '#e8c070', '#f6c0d0', '#b8e0a0', '#fff', '#a0522d']); g.fillRect(x, 30 + r * 32, 30, 20); g.strokeStyle = '#8a6a4a'; g.strokeRect(x, 30 + r * 32, 30, 20); } }
    if (type === 'barber') { g.fillStyle = '#b0c8d8'; g.fillRect(30, 20, 70, 60); g.fillRect(140, 20, 70, 60); g.fillStyle = '#7a1e1e'; g.fillRect(45, 80, 40, 40); g.fillRect(155, 80, 40, 40); }
    if (type === 'florist') { for (let i = 0; i < 40; i++) { g.fillStyle = pick(FLW.concat(['#f2c230', '#b04ad0', '#ffffff'])); g.beginPath(); g.arc(rnd(10, w - 10), rnd(30, 110), rnd(4, 8), 0, TAU); g.fill(); } }
    if (type === 'butcher') { for (let i = 0; i < 8; i++) { g.fillStyle = '#b8323a'; g.beginPath(); g.ellipse(20 + i * 30, 50, 10, 22, 0, 0, TAU); g.fill(); } g.fillStyle = '#fff'; g.fillRect(0, 90, w, 38); }
    if (night) { g.fillStyle = 'rgba(255,220,150,.18)'; g.fillRect(0, 0, w, h); }
  });
  _int.set(key, t); return t;
}

/* ---------------- windows */
export function win(g, x, y, F, ww, wh, S = {}) {
  const q = group(g, x, y, F, S.rot || 0);
  const trim = S.trim || '#f3ead9', fr = S.frame || trim;
  const lit = S.night && chance(S.lit ?? .5);
  const gc = S.night ? (lit ? pick(WARM) : '#273048') : pick(GLASS);
  box(q, ww, wh, .02, S.night && lit ? EN(gc) : N(gc), 0, 0, .012).castShadow = false;
  if (chance(S.curt ?? .55)) { const cc = S.night && lit ? '#fff0d0' : pick(CURT); const half = chance(.5); for (const s of [-1, 1]) box(q, ww * .3, wh * (half ? .55 : .9), .01, S.night && lit ? EN(cc) : N(cc), s * ww * .33, wh * (half ? .42 : .06), .03).castShadow = false; }
  box(q, .05, wh + .1, .07, fr, -ww / 2 - .025, -.05, .035); box(q, .05, wh + .1, .07, fr, ww / 2 + .025, -.05, .035);
  box(q, ww + .1, .05, .07, fr, 0, wh, .035); box(q, ww + .1, .05, .07, fr, 0, -.05, .035);
  box(q, .022, wh, .025, N(fr), 0, 0, .045).castShadow = false; box(q, ww, .022, .025, N(fr), 0, wh * .64, .045).castShadow = false;
  box(q, ww + .18, .045, .13, trim, 0, -.09, .065);
  if (S.ornate) { box(q, ww + .22, .06, .1, trim, 0, wh + .05, .05); if (S.ornate === 'ped') gable(q, ww + .26, .09, .14, trim, 0, wh + .11, .05); else if (S.ornate === 'arch') archTop(q, ww + .12, .07, trim, 0, wh + .05, .04); box(q, .07, .12, .06, trim, -ww / 2 - .07, -.2, .05); box(q, .07, .12, .06, trim, ww / 2 + .07, -.2, .05); }
  if (S.shutters) for (const s of [-1, 1]) { const sh = box(q, ww * .5, wh + .04, .035, S.shutters, s * (ww * .75 + .07), -.02, .03); for (let k = 1; k < 5; k++) box(q, ww * .5, .012, .012, N(shade(S.shutters, -.12)), s * (ww * .75 + .07), k * wh / 5, .052).castShadow = false; }
  if (chance(S.flowers ?? .2)) { box(q, ww + .04, .08, .1, '#8a5a3a', 0, -.06, .14); for (let k = 0; k < 4; k++) { blob(q, .05, '#3f7a3a', -ww * .36 + k * ww * .24, .05, .15); blob(q, .036, pick(FLW), -ww * .36 + k * ww * .24 + .02, .09, .17); } }
  if (S.ac && chance(S.ac)) { const s = chance(.5) ? -1 : 1; box(q, .3, .2, .13, '#eceeef', s * (ww / 2 + .26), -.02, .07); cyl(q, .06, .06, .01, N('#666'), s * (ww / 2 + .26), .08, .14, 10).rotation.x = Math.PI / 2; }
  return q;
}

/* ---------------- apartment / shop-house. Local front faces +z, origin at footprint centre on ground. */
export function apt(p, o) {
  const { x = 0, z = 0, y = 0, w = 3, d = 4, floors = 4, color = '#e8b07a', ry = 0, night = false, trim = '#f3ead9', lit = .45,
    cumba = false, balc = .35, roof = 'flat', roofC = '#b5573a', sides = 0, shop = null, shutters = null, ornate = false, plinth = 0,
    stone = null, gh = 1.35, fh = 1.05, cols = null, flowers = .25, ac = .2, curt = .6, door = null, frame = null, dish = .5, back = false, roofH = .9 } = o;
  const g = group(p, x, y, z, ry);
  const H = gh + (floors - 1) * fh, F = d / 2;
  if (plinth > 0) box(g, w, plinth, d, stone || '#9a8f80', 0, -plinth, 0);
  box(g, w, H, d, color);
  box(g, w + .04, gh - .02, d + .04, stone || shade(color, -.08), 0, 0, 0);
  if (ornate) { for (let k = 0; k < 4; k++) box(g, w + .05, .02, d + .05, N(shade(stone || color, -.18)), 0, .25 + k * .26, 0).castShadow = false; for (const s of [-1, 1]) box(g, .16, H - gh, .06, shade(color, .06), s * (w / 2 - .08), gh, F + .02); }
  for (let f = 1; f < floors; f++) box(g, w + .08, .08, d + .08, trim, 0, gh + (f - 1) * fh - .08, 0);
  box(g, w + .18, .14, d + .18, trim, 0, H - .03, 0);
  if (ornate) for (let k = 0; k < Math.floor(w / .18); k++) box(g, .07, .06, .05, N(trim), -w / 2 + .1 + k * .18, H - .09, F + .1).castShadow = false;
  const S = { trim, night, lit, shutters, ornate: ornate ? pick(['ped', 'arch', 'flat']) : false, flowers, ac, curt, frame };
  const nc = cols || Math.max(2, Math.round(w / .95));
  const cw = cumba && floors >= 3 ? Math.min(1.5, w * .42) : 0;
  const bal = [];
  for (let f = 1; f < floors; f++) {
    const y0 = gh + (f - 1) * fh + .2, ww = Math.min(.5, w / nc * .55), wh = .62;
    for (let c = 0; c < nc; c++) {
      const wx = -w / 2 + (c + .5) * w / nc;
      if (cw && Math.abs(wx) < cw / 2 + ww / 2 + .08) continue;
      const hasB = chance(balc);
      win(g, wx, y0, F, ww, hasB ? wh + .22 : wh, { ...S, flowers: hasB ? 0 : flowers });
      if (hasB) bal.push([wx, y0, Math.min(w / nc * .95, ww + .5)]);
    }
    if (sides) for (const sx of [-1, 1]) { if (sides === 'r' && sx < 0) continue; if (sides === 'l' && sx > 0) continue; const n = Math.max(1, Math.round(d / 1.3)); for (let c = 0; c < n; c++) win(g, sx * w / 2, y0, -d / 2 + (c + .5) * d / n - (sx > 0 ? 0 : 0), .4, .58, { ...S, rot: sx * Math.PI / 2, flowers: 0 }); }
    if (back) { for (let c = 0; c < nc; c++) win(g, -w / 2 + (c + .5) * w / nc, y0, -F, .42, .58, { ...S, rot: Math.PI, flowers: 0, ac: .3 }); }
  }
  for (const [bx, by, bw] of bal) balcony(g, bx, by - .12, F, bw, S, night);
  if (cw) {
    const ch = H - gh - .3, cz = F + .3; box(g, cw, ch, .6, color, 0, gh + .12, cz);
    box(g, cw + .1, .1, .7, trim, 0, gh + .04, cz); box(g, cw + .12, .1, .72, trim, 0, gh + .12 + ch, cz);
    for (const s of [-1, 1]) for (let k = 0; k < 3; k++) box(g, .06, .16 - k * .04, .5 - k * .14, trim, s * (cw / 2 - .1), gh + .04 - .16 + k * .04, F + .25 - k * .05);
    for (let f = 1; f < floors; f++) { const yy = gh + (f - 1) * fh + .2; win(g, 0, yy, cz + .3, cw * .55, .62, { ...S, flowers: 0, ac: 0 }); win(g, -cw / 2, yy, cz, .24, .58, { ...S, rot: -Math.PI / 2, flowers: 0, curt: 0, ac: 0 }); win(g, cw / 2, yy, cz, .24, .58, { ...S, rot: Math.PI / 2, flowers: 0, curt: 0, ac: 0 }); }
  }
  // corner drain pipe
  cyl(g, .03, .03, H, '#8f8f8f', w / 2 - .07, 0, F + .04, 6);
  // roof
  if (roof === 'flat') {
    for (const [a, b, c2, d2] of [[0, F, w + .1, .1], [0, -F, w + .1, .1], [w / 2, 0, .1, d], [-w / 2, 0, .1, d]]) box(g, c2, .22, d2, trim, a, H + .1, b);
    const spots = []; const free = (sx, sz, r) => { for (const [a, b, c] of spots) if (Math.hypot(a - sx, b - sz) < r + c) return false; spots.push([sx, sz, r]); return true; };
    if (chance(.85)) { const sx = rr(-w / 3, w / 3), sz = rr(-F + .5, 0); if (free(sx, sz, .4)) { cyl(g, .26, .26, .5, '#dfe3e6', sx, H + .11, sz, 12); cyl(g, .27, .27, .04, '#c9ced2', sx, H + .61, sz, 12); for (const a of [0, 1.5, 3, 4.6]) cyl(g, .02, .02, .1, '#888', sx + Math.cos(a) * .2, H + .11, sz + Math.sin(a) * .2, 4); } }
    if (chance(.6)) { const sx = rr(-w / 3, w / 3), sz = rr(-F + .5, F - .6); if (free(sx, sz, .45)) { box(g, .7, .55, .7, trim, sx, H + .11, sz); box(g, .32, .44, .04, '#4a3a30', sx, H + .11, sz + .37); } }
    if (chance(dish)) { const sx = rr(-w / 3, w / 3), sz = rr(-F + .4, F - .4); if (free(sx, sz, .3)) satDish(g, sx, H + .11, sz, rr(0, TAU)); }
    if (chance(.5)) { const sx = rr(-w / 3, w / 3), sz = rr(-F + .4, F - .4); if (free(sx, sz, .2)) { cyl(g, .015, .015, 1.1, '#555', sx, H + .11, sz, 4); box(g, .5, .015, .015, '#555', sx, H + .9, sz); box(g, .35, .015, .015, '#555', sx, H + 1.05, sz); } }
    if (chance(.4)) { const sx = rr(-w / 3, w / 3), sz = rr(-F + .4, F - .4); if (free(sx, sz, .3)) box(g, .36, .26, .22, '#e9ecef', sx, H + .11, sz); }
    if (chance(.35)) { const sx = rr(-w / 3, 0), sz = rr(-F + .5, F - .9); if (free(sx, sz, .8)) { for (const dx of [0, 1.2]) cyl(g, .015, .015, .6, '#777', sx + dx, H + .11, sz, 4); const L = sag(V(sx, H + .68, sz), V(sx + 1.2, H + .68, sz), .05, 6); line(g, L, '#666'); for (let k = 1; k < 5; k++) box(g, .14, .18, .01, N(pick(['#e94b3c', '#fff', '#3a86c8', '#f2c230', '#46a86a'])), sx + k * .24, H + .48, sz).castShadow = false; } }
  } else {
    ridgeRoof(g, w + .32, d + .32, roofH, roofC, 0, H + .08, 0);
    box(g, w + .32, .08, d + .32, shade(roofC, -.08), 0, H, 0);
    if (chance(.8)) { const sx = rr(-w / 4, w / 4); box(g, .26, roofH * .9, .26, '#9a5b45', sx, H + roofH * .35, -d * .12); box(g, .32, .06, .32, '#7a4535', sx, H + roofH * 1.25, -d * .12); }
    if (chance(dish)) satDish(g, rr(-w / 4, w / 4), H + roofH * .45, F * .55, rr(-1, 1));
  }
  // ground floor
  if (shop) storefront(g, 0, F, w, gh, shop, night);
  else if (o.noGround) { }
  else {
    const dx = (door ?? (chance(.5) ? -1 : 1)) * w * .26;
    entrance(g, dx, F, trim, night);
    win(g, -dx * .9, .45, F, .55, .5, { ...S, flowers: .3, ac: 0, shutters: null, ornate: false });
  }
  g.userData = { H, F, w, d, gh };
  return g;
}
export function entrance(g, x, F, trim, night) {
  box(g, .68, 1.0, .06, trim, x, 0, F + .03);
  box(g, .56, .92, .05, '#5a3e2c', x, .02, F + .055);
  box(g, .26, .9, .015, N('#4a3222'), x - .13, .03, F + .085).castShadow = false; box(g, .26, .9, .015, N('#4a3222'), x + .13, .03, F + .085).castShadow = false;
  box(g, .2, .2, .015, night ? EN('#ffdca0') : N('#9fb6c6'), x, .62, F + .09).castShadow = false;
  box(g, .86, .07, .3, '#b9b2a6', x, 0, F + .15);
  box(g, .8, .05, .4, trim, x, 1.02, F + .2);
  if (night) glow(g, x, 1.0, F + .25, .7, '#ffd8a0', .7);
}
export function balcony(g, x, y, F, bw, S, night) {
  box(g, bw, .06, .44, S.trim, x, y, F + .22);
  box(g, bw, .03, .03, '#2e2f33', x, y + .36, F + .43);
  for (let k = 0; k <= Math.floor(bw / .07); k++) box(g, .014, .3, .014, N('#2e2f33'), x - bw / 2 + k * .07, y + .06, F + .43).castShadow = false;
  for (const s of [-1, 1]) { box(g, .03, .03, .42, '#2e2f33', x + s * bw / 2, y + .36, F + .22); for (let k = 0; k < 6; k++) box(g, .014, .3, .014, N('#2e2f33'), x + s * bw / 2, y + .06, F + .02 + k * .07).castShadow = false; }
  const r = R();
  if (r < .4) { for (let k = 0; k < 2; k++) { const px = x + rr(-bw / 2 + .12, bw / 2 - .12); cyl(g, .07, .05, .1, '#b0603a', px, y + .06, F + .22, 8); blob(g, rr(.08, .13), pick(['#3f7a3a', '#4f8a3f', '#5d9c4a']), px, y + .23, F + .22); if (chance(.5)) blob(g, .04, pick(FLW), px + .04, y + .3, F + .27); } }
  else if (r < .55) satDish(g, x + bw / 2 - .2, y + .25, F + .34, 0, .7);
  else if (r < .7) { box(g, .14, .16, .14, '#e7e2d6', x - .15, y + .06, F + .2); box(g, .14, .16, .14, '#e7e2d6', x + .15, y + .06, F + .2); cyl(g, .12, .12, .2, '#f4f4f4', x, y + .06, F + .2, 10); }
  else if (r < .8) { for (let k = 0; k < 3; k++) box(g, .13, .18, .01, N(pick(['#e94b3c', '#fff', '#3a86c8', '#f2c230'])), x - .2 + k * .2, y + .14, F + .38).castShadow = false; }
}
export function satDish(g, x, y, z, ry = 0, s = 1) { const q = group(g, x, y, z, ry, s); cyl(q, .02, .02, .22, '#888', 0, 0, 0, 4); const d = cyl(q, .2, .03, .06, '#eef0f2', 0, .22, .04, 12); d.rotation.x = 1.1; rod(q, V(0, .24, .1), V(0, .3, .22), .01, '#777', 4); return q; }
/** shop ground floor: interior texture behind glass, mullions, sign band, optional awning */
export function storefront(g, x, F, w, gh, shop, night) {
  const sw = Math.min(w * .86, shop.width || 99), sh = .92;
  const it = interiorTex(shop.type || 'market', night);
  const ip = new THREE.Mesh(PLANE, texMat(it, night)); ip.scale.set(sw, sh, 1); ip.position.set(x, .06 + sh / 2, F + .015); g.add(ip);
  const gl = new THREE.Mesh(PLANE, SHOPGLASS); gl.scale.set(sw, sh, 1); gl.position.set(x, .06 + sh / 2, F + .05); gl.userData.keep = true; g.add(gl);
  box(g, sw + .1, .06, .1, '#3a3a3a', x, 0, F + .04);
  const n = Math.max(2, Math.round(sw / .7));
  for (let i = 0; i <= n; i++) box(g, .05, sh + .04, .08, shop.frame || '#3a3a3a', x - sw / 2 + i * sw / n, .04, F + .045);
  box(g, sw + .1, .05, .08, shop.frame || '#3a3a3a', x, sh + .06, F + .045);
  const dX = x + (shop.doorAt ?? (sw / 2 - sw / n / 2));
  box(g, sw / n - .06, sh - .02, .02, N('#1e2a33'), dX, .07, F + .06).castShadow = false;
  if (shop.text) sign(g, shop.text, sw + .04, .26, shop.style || { bg: '#fff', fg: '#222' }, x, gh - .19, F + .07, 0, night || shop.lit, shop.board || '#2b2b2b');
  if (shop.awning) {
    const am = texMat(stripeTex(shop.awning[0], shop.awning[1], 10));
    const a = new THREE.Mesh(UB, am); a.scale.set(sw + .06, .035, .62); a.position.set(x, .96, F + .37); a.rotation.x = .2; a.castShadow = true; g.add(a);
    const v = new THREE.Mesh(UB, am); v.scale.set(sw + .06, .1, .02); v.position.set(x, .85, F + .68); v.castShadow = true; g.add(v);
    for (const s of [-1, 1]) rod(g, V(x + s * (sw / 2), 1.04, F + .07), V(x + s * (sw / 2), .9, F + .66), .012, '#555', 4);
  }
  if (night) { const L = glow(g, x, .55, F + .35, sw * 1.2, '#ffe0a8', .22); }
  if (shop.display) shop.display(g, x, F, sw);
}

/* ---------------- nature */
export function tree(p, x, z, s = 1, type = 'plane', o = {}) {
  const g = group(p, x, o.y || 0, z, rr(0, TAU), s);
  const pal = o.cols || {
    plane: ['#5d9c4a', '#4f8a3f', '#6fb055', '#7fbd5e'], erguvan: ['#c75b9b', '#d77fb5', '#e7a6cf', '#b84f8e', '#e391c4'], autumn: ['#e0a03a', '#d5862c', '#efc24a', '#c96a2a', '#b8502a'],
    linden: ['#7fae4c', '#6c9e43', '#8fbd5a'], night: ['#1f3a2c', '#264634', '#2d523c'], apricot: ['#8aa83a', '#a8b84a', '#c9a03a'], chestnut: ['#d9a23a', '#c98a2c', '#a8a03a', '#e0b44a'],
  }[type] || ['#5d9c4a', '#4f8a3f'];
  const bark = o.bark || (type === 'plane' || type === 'autumn' ? '#b8a88a' : '#6b4a35');
  const th = type === 'plane' || type === 'autumn' ? 1.5 : 1.25, tr = type === 'erguvan' ? .09 : .13;
  cyl(g, tr * .8, tr * 1.25, th, bark, 0, 0, 0, 8);
  const br = [];
  for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + rr(-.3, .3); const end = V(Math.cos(a) * .6, th + rr(.35, .7), Math.sin(a) * .6); rod(g, V(0, th * .8, 0), end, tr * .45, bark, 5); br.push(end); }
  const n = o.n || (type === 'plane' || type === 'autumn' ? 11 : 9);
  for (let i = 0; i < n; i++) { const b = br[i % br.length]; const r = rr(.42, .7) * (type === 'plane' || type === 'autumn' ? 1.2 : 1); blob(g, r, pick(pal), b.x * rr(.6, 1.3) + rr(-.25, .25), b.y + rr(-.05, .55), b.z * rr(.6, 1.3) + rr(-.25, .25)); }
  blob(g, .75 * (type === 'plane' ? 1.25 : 1), pick(pal), 0, th + 1.05, 0);
  if (o.pit) { box(p, .9 * s, .03, .9 * s, '#5a4636', x, o.y || 0, z).castShadow = false; for (let k = -2; k <= 2; k++) box(p, .9 * s, .015, .03, N('#444'), x, (o.y || 0) + .03, z + k * .18 * s).castShadow = false; }
  return g;
}
export function pine(p, x, z, s = 1, y = 0) { // umbrella / stone pine (fıstık çamı)
  const g = group(p, x, y, z, rr(0, TAU), s); const lean = rr(-.15, .15);
  const top = V(lean * 2, 3.2, rr(-.2, .2)); rod(g, V(0, 0, 0), top, .13, '#7a5a42', 7);
  for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; rod(g, top.clone().multiplyScalar(.85), V(top.x + Math.cos(a) * .9, top.y + .2, top.z + Math.sin(a) * .9), .06, '#7a5a42', 5); }
  for (let i = 0; i < 9; i++) { const a = R() * TAU, r = rr(0, 1.1); const b = ell(g, rr(.55, .8), rr(.22, .32), rr(.55, .8), pick(['#3f6b3a', '#4a7a40', '#365e33']), top.x + Math.cos(a) * r, top.y + rr(.15, .45), top.z + Math.sin(a) * r, false); }
  return g;
}
export function cypress(p, x, z, s = 1, c = '#2f5a3a', y = 0) { const g = group(p, x, y, z, 0, s); cyl(g, .07, .09, .4, '#5a3e2c', 0, 0, 0, 6); ell(g, .4, 1.55, .4, c, 0, 1.75, 0, false); ell(g, .3, .7, .3, shade(c, .05), .06, 2.9, .04, false); return g; }
export function poplar(p, x, z, s = 1, c, y = 0) { const g = group(p, x, y, z, 0, s); cyl(g, .07, .1, .8, '#8a7656', 0, 0, 0, 6); const cc = c || pick(['#c9c055', '#b5b84d', '#d8c46a', '#9fb04a']); ell(g, .45, 1.75, .45, cc, 0, 2.3, 0, false); ell(g, .32, .9, .32, shade(cc, .06), .08, 3.4, 0, false); return g; }
export function bush(p, x, z, s = 1, cols = ['#4f8a3f', '#5d9c4a', '#3f7a3a'], y = 0) { const g = group(p, x, y, z, rr(0, TAU), s); for (let i = 0; i < 4; i++) blob(g, rr(.18, .3), pick(cols), rr(-.25, .25), rr(.12, .22), rr(-.25, .25)); return g; }
export function hedge(p, x1, z1, x2, z2, c = '#4a8a3c', h = .4, y = 0) { const L = Math.hypot(x2 - x1, z2 - z1), a = Math.atan2(z2 - z1, x2 - x1); const n = Math.max(2, Math.round(L / .3)); for (let i = 0; i < n; i++) { const k = (i + .5) / n; blob(p, rr(.2, .26), shade(c, rr(-.04, .04)), lerp(x1, x2, k), y + h * .55, lerp(z1, z2, k)); } }
export function flowers(p, x, z, w, d, cols = FLW, n = 0, y = 0) { n = n || Math.round(w * d * 18); for (let i = 0; i < n; i++) { const fx = x + rr(-w / 2, w / 2), fz = z + rr(-d / 2, d / 2); blob(p, .05, '#3f7a3a', fx, y + .04, fz).castShadow = false; blob(p, .04, pick(cols), fx, y + .1, fz).castShadow = false; } }
export function grass(p, x, z, w, d, n, cols = ['#6fb055', '#5d9c4a', '#86c45e'], y = 0) { const g = cg('tuft', () => { const q = new THREE.ConeGeometry(.03, .14, 4); q.translate(0, .07, 0); return q; }); for (let i = 0; i < n; i++) { const c = pick(cols); const bx = x + rr(-w / 2, w / 2), bz = z + rr(-d / 2, d / 2); for (let k = 0; k < 3; k++) { const o = mesh(g, N(c), p, bx + rr(-.04, .04), y, bz + rr(-.04, .04)); o.rotation.set(rr(-.3, .3), 0, rr(-.3, .3)); o.scale.setScalar(rr(.7, 1.3)); o.castShadow = false; } } }
export function rock(p, x, z, s = 1, c = '#9a9288', y = 0) { const o = blob(p, s, c, x, y + s * .3, z); o.scale.set(s * rr(.8, 1.3), s * rr(.5, .8), s * rr(.8, 1.2)); o.rotation.set(rr(0, 3), rr(0, 3), 0); return o; }

/* ---------------- street furniture */
export function bench(p, x, z, ry = 0, o = {}) {
  const g = group(p, x, o.y || 0, z, ry); const c = o.c || '#8a5a36', leg = o.leg || '#2d3a33', L = o.L || 1.0;
  for (let i = 0; i < 3; i++) box(g, L, .03, .085, c, 0, .2, -.1 + i * .1);
  for (let i = 0; i < 2; i++) box(g, L, .07, .03, c, 0, .3 + i * .1, -.16);
  for (const sx of [-L / 2 + .08, L / 2 - .08]) { box(g, .04, .2, .04, leg, sx, 0, .1); box(g, .04, .45, .04, leg, sx, 0, -.15); box(g, .04, .03, .3, leg, sx, .17, -.02); box(g, .04, .03, .25, leg, sx, .3, .0); }
  g.userData.seats = [-L / 4, L / 4].map((sx) => { const v = V(sx, .2, .0); return g.localToWorld ? v : v; });
  return g;
}
/** world positions + facing for sitting on a bench built with bench() */
export function seatsOf(b, n = 2) { b.updateMatrixWorld(true); const out = []; const L = 1.0; for (let i = 0; i < n; i++) { const sx = n === 1 ? 0 : -L / 2 + .25 + i * (L - .5) / (n - 1); const v = V(sx, .03, -.02).applyMatrix4(b.matrixWorld); out.push({ x: v.x, y: v.y, z: v.z, ry: b.rotation.y }); } return out; }
export function lamp(p, x, z, o = {}) {
  const { h = 2.6, night = false, color = '#ffd28a', style = 'ist', y = 0, arms = 1, ry = 0 } = o;
  const g = group(p, x, y, z, ry); const pole = o.pole || (style === 'ist' ? '#23302a' : '#5a5f66');
  if (style === 'ist') {
    cyl(g, .1, .14, .3, pole, 0, 0, 0, 8); cyl(g, .04, .06, h, pole, 0, 0, 0, 8); for (let k = 0; k < 3; k++) cyl(g, .07, .07, .03, pole, 0, .5 + k * .7, 0, 8);
    const heads = arms === 2 ? [-.42, .42] : [0];
    if (arms === 2) { box(g, .9, .04, .04, pole, 0, h - .05, 0); for (const s of [-1, 1]) rod(g, V(0, h - .4, 0), V(s * .4, h - .05, 0), .015, pole, 4); }
    for (const hx of heads) { const hy = arms === 2 ? h - .05 : h; box(g, .2, .04, .2, pole, hx, hy, 0); box(g, .16, .26, .16, night ? EN(color) : N('#f5ecd2'), hx, hy + .04, 0); for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) box(g, .02, .26, .02, pole, hx + a * .08, hy + .04, b * .08); cone(g, .17, .14, pole, hx, hy + .3, 0, 4).rotation.y = Math.PI / 4; cyl(g, .02, .02, .08, pole, hx, hy + .44, 0, 4); if (night) glow(g, hx, hy + .17, 0, 1.6, color, .85); }
  } else if (style === 'sodium') {
    cyl(g, .06, .09, h, pole, 0, 0, 0, 8); box(g, .06, .06, 1.1, pole, 0, h - .05, .5); box(g, .26, .1, .42, pole, 0, h - .12, 1.05); box(g, .2, .02, .32, night ? EN('#ffb35a') : N('#ddd'), 0, h - .13, 1.05);
    if (night) glow(g, 0, h - .2, 1.05, 2.6, '#ffa64a', .9);
  } else {
    cyl(g, .05, .07, h, pole, 0, 0, 0, 8); box(g, .34, .08, .14, pole, .12, h, 0); box(g, .28, .02, .1, night ? EN('#f6f0ff') : N('#eee'), .12, h - .01, 0); if (night) glow(g, .12, h - .05, 0, 1.6, '#f6f0ff', .6);
  }
  return g;
}
export function bin(p, x, z, c = '#4f6a5a', y = 0) { const g = group(p, x, y, z); cyl(g, .12, .1, .34, c, 0, 0, 0, 10); cyl(g, .135, .135, .04, shade(c, -.1), 0, .34, 0, 10); return g; }
export function bollard(p, x, z, c = '#3a3a3e', y = 0) { cyl(p, .05, .06, .3, c, x, y, z, 8); blob(p, .055, c, x, y + .3, z, true); }
export function hydrant(p, x, z, y = 0) { const g = group(p, x, y, z); cyl(g, .06, .07, .26, '#c8302c', 0, 0, 0, 8); dome(g, .065, '#c8302c', 0, .26, 0, 8); cyl(g, .025, .025, .14, '#c8302c', 0, .16, 0, 6).rotation.z = Math.PI / 2; return g; }
export function mailbox(p, x, z, ry = 0, y = 0) { const g = group(p, x, y, z, ry); box(g, .04, .3, .04, '#555', 0, 0, 0); box(g, .3, .36, .22, '#f2c230', 0, .3, 0); sign(g, 'PTT', .22, .08, { bg: '#f2c230', fg: '#1a3a6a' }, 0, .55, .115, 0, false, null); box(g, .2, .02, .03, N('#222'), 0, .5, .11); return g; }
export function bicycle(p, x, z, ry = 0, c = '#c8302c', y = 0) {
  const g = group(p, x, y, z, ry); const tor = cg('wheel', () => new THREE.TorusGeometry(.13, .015, 5, 14));
  for (const s of [-.22, .22]) { const w = mesh(tor, '#222', g, s, .13, 0); w.castShadow = false; }
  rod(g, V(-.22, .13, 0), V(0, .3, 0), .012, c, 4); rod(g, V(0, .3, 0), V(.2, .32, 0), .012, c, 4); rod(g, V(.22, .13, 0), V(.2, .34, 0), .012, c, 4); rod(g, V(0, .3, 0), V(0, .13, 0), .012, c, 4); rod(g, V(0, .13, 0), V(-.22, .13, 0), .01, c, 4);
  box(g, .1, .02, .05, '#222', -.02, .33, 0); box(g, .03, .02, .2, '#222', .2, .36, 0);
  return g;
}
export function kiosk(p, x, z, ry = 0, o = {}) { // büfe
  const g = group(p, x, 0, z, ry); const c = o.c || '#2f6b4a';
  box(g, 1.3, .12, .9, shade(c, -.15), 0, 0, 0); box(g, 1.3, 1.0, .9, c, 0, .1, 0); box(g, 1.5, .07, 1.12, shade(c, -.1), 0, 1.1, .06); box(g, 1.38, .1, 1.0, '#f4efe4', 0, 1.17, .02);
  for (const s of [-1, 1]) box(g, .06, .62, .04, '#f4efe4', s * .58, .46, .46); box(g, 1.22, .05, .05, '#f4efe4', 0, 1.06, .46);
  { const am = texMat(stripeTex('#f4efe4', o.stripe || '#c8302c', 10)); const a = new THREE.Mesh(UB, am); a.scale.set(1.36, .03, .4); a.position.set(0, 1.0, .64); a.rotation.x = .3; g.add(a); }
  for (const s of [-1, 1]) { box(g, .02, .5, .3, N('#2a3a4a'), s * .66, .5, 0).castShadow = false; }
  bin(g, .9, .25);
  box(g, 1.1, .5, .02, N('#2a3a4a'), 0, .55, .46).castShadow = false; box(g, 1.2, .04, .2, '#d8d2c6', 0, .5, .52);
  const mags = ['#e94b3c', '#3a86c8', '#f2c230', '#46a86a', '#ffffff', '#e98bb0'];
  for (let i = 0; i < 8; i++) box(g, .1, .14, .01, N(pick(mags)), -.45 + i * .13, .65 + (i % 2) * .16, .48).castShadow = false;
  for (let i = 0; i < 5; i++) box(g, .09, .12, .06, N(pick(mags)), -.4 + i * .2, .54, .55).castShadow = false;
  sign(g, o.text || 'BÜFE', 1.2, .24, o.style || { bg: '#f2c230', fg: '#1d1d1d' }, 0, 1.33, 0.3, 0, !!o.night, null);
  if (o.night) glow(g, 0, .8, .7, 2, '#ffe0a8', .35);
  return g;
}
export function teaSet(p, x, z, o = {}) { // small table + stools + çay glasses; returns seat spots
  const g = group(p, x, o.y || 0, z, o.ry || 0);
  cyl(g, .2, .2, .03, o.top || '#e8e2d6', 0, .3, 0, 12); cyl(g, .025, .025, .3, '#555', 0, 0, 0, 6); cyl(g, .12, .12, .02, '#555', 0, 0, 0, 8);
  const seats = []; const n = o.n || 2;
  for (let i = 0; i < n; i++) { const a = i / n * TAU + (o.a0 || 0); const sx = Math.cos(a) * .4, sz = Math.sin(a) * .4; cyl(g, .1, .1, .03, o.stool || '#b8342c', sx, .17, sz, 10); for (const k of [0, 1, 2, 3]) { const la = k / 4 * TAU; rod(g, V(sx + Math.cos(la) * .07, .17, sz + Math.sin(la) * .07), V(sx + Math.cos(la) * .09, 0, sz + Math.sin(la) * .09), .01, '#444', 4); } seats.push([sx, sz, Math.atan2(-sx, -sz)]); }
  for (let i = 0; i < (o.glasses ?? 2); i++) { const a = i / 2 * TAU + .4; cyl(g, .018, .014, .05, EN('#b4421c'), Math.cos(a) * .1, .33, Math.sin(a) * .1, 6).castShadow = false; cyl(g, .03, .03, .006, N('#ddd'), Math.cos(a) * .1, .33, Math.sin(a) * .1, 8).castShadow = false; }
  if (o.umbrella) { cyl(g, .02, .02, 1.3, '#ddd', 0, .33, 0, 5); const u = cone(g, .75, .28, o.umbrella, 0, 1.42, 0, 10); }
  g.updateMatrixWorld(true);
  return seats.map(([sx, sz, ry]) => { const v = V(sx, .03, sz).applyMatrix4(g.matrixWorld); return { x: v.x, y: (o.y || 0) + .01, z: v.z, ry: ry + (o.ry || 0) }; });
}
export function crate(p, x, z, fruit, y = 0, ry = 0) { const g = group(p, x, y, z, ry); box(g, .4, .2, .3, '#a8774a', 0, 0, 0); for (let k = 0; k < 3; k++) box(g, .41, .02, .31, N('#8a5a32'), 0, .04 + k * .06, 0).castShadow = false; if (fruit) for (let i = 0; i < 6; i++) blob(g, .06, fruit, -.12 + (i % 3) * .12, .23, -.06 + Math.floor(i / 3) * .12, true).castShadow = false; return g; }
export function fence(p, a, b, o = {}) { const { h = .45, c = '#2e2f33', step = .12, y = 0 } = o; const L = Math.hypot(b.x - a.x, b.z - a.z); const n = Math.max(1, Math.round(L / step)); for (let i = 0; i <= n; i++) { const k = i / n; box(p, .018, h, .018, N(c), lerp(a.x, b.x, k), y, lerp(a.z, b.z, k)).castShadow = false; } const ang = Math.atan2(b.x - a.x, b.z - a.z); for (const hh of [h, h * .15]) { const r = box(p, .03, .03, L, c, (a.x + b.x) / 2, y + hh - .015, (a.z + b.z) / 2); r.rotation.y = ang; } }
export function streetSign(p, x, z, text, sub, ry = 0, y = 0) { const g = group(p, x, y, z, ry); cyl(g, .025, .025, 1.7, '#9aa0a8', 0, 0, 0, 6); sign(g, text, .9, .24, { bg: '#1f4f9e', fg: '#fff', sub, subfg: '#cfe0ff' }, 0, 1.6, .03, 0, false, '#1f4f9e'); return g; }
export function busStop(p, x, z, ry = 0, o = {}) {
  const g = group(p, x, o.y || 0, z, ry); const c = o.c || '#5d6670';
  for (const dx of [-.85, .85]) cyl(g, .03, .03, 1.55, c, dx, 0, -.25, 6);
  box(g, 1.9, .05, .75, c, 0, 1.55, -.05); box(g, 1.7, 1.1, .02, noOL(new THREE.MeshToonMaterial({ color: '#cfe3ee', transparent: true, opacity: .35 })), 0, .4, -.28).userData.keep = true;
  box(g, .6, 1.0, .05, o.night ? EN('#e6f2ff') : N('#e6f2ff'), .62, .3, -.26);
  bench(g, -.2, -.05, 0, { L: 1.1, c: '#8a8f96', leg: '#555' });
  sign(g, o.text || 'DURAK', .7, .18, { bg: '#f2c230', fg: '#1a1a1a' }, -.55, 1.75, -.05, 0, !!o.night, null);
  return g;
}
export function trafficLight(p, x, z, ry = 0, y = 0) { const g = group(p, x, y, z, ry); cyl(g, .035, .04, 1.6, '#4a4f58', 0, 0, 0, 6); box(g, .14, .38, .12, '#2a2a2e', 0, 1.6, 0); for (const [k, c] of [[0, '#e33'], [1, '#fb3'], [2, '#3c6']]) cyl(g, .035, .035, .02, k === 2 ? EN(c) : N(shade(c, -.25)), 0, 1.9 - k * .11, .065, 8).rotation.x = Math.PI / 2; return g; }
export function powerPole(p, x, z, h = 4.2, y = 0) { const g = group(p, x, y, z); cyl(g, .07, .1, h, '#6a5e52', 0, 0, 0, 8); box(g, 1.1, .06, .06, '#6a5e52', 0, h - .25, 0); for (const s of [-.45, 0, .45]) cyl(g, .025, .025, .08, '#ddd', s, h - .19, 0, 6); box(g, .25, .3, .2, '#7a7f86', 0, h - .9, .12); return g; }
export function umbrella(p, x, z, c = '#e8e2d6', y = 0, h = 1.35, r = .75) { cyl(p, .02, .02, h, '#ddd', x, y, z, 5); cone(p, r, .28, c, x, y + h - .12, z, 10); }
export function cat(S, p, x, z, ry = 0, c = '#d98a3d', sit = false, y = 0) {
  const g = group(p, x, y, z, ry, .85);
  if (sit) { ell(g, .12, .15, .14, c, 0, .14, 0); blob(g, .095, c, 0, .33, .05, true); }
  else { ell(g, .09, .085, .19, c, 0, .16, 0); for (const [lx, lz] of [[-.05, .11], [.05, .11], [-.05, -.11], [.05, -.11]]) box(g, .032, .1, .032, c, lx, 0, lz); blob(g, .08, c, 0, .25, .19, true); }
  const hy = sit ? .33 : .25, hz = sit ? .05 : .19;
  for (const sx of [-.042, .042]) cone(g, .028, .06, c, sx, hy + .06, hz, 4);
  for (const sx of [-.03, .03]) blob(g, .012, N('#1a1a1a'), sx, hy + .015, hz + .075, true).castShadow = false;
  const tail = group(g, 0, sit ? .06 : .19, sit ? -.13 : -.19);
  const tt = cyl(tail, .017, .024, .26, c, 0, 0, 0, 5); tt.rotation.x = sit ? -1.25 : -.55;
  const ph = R() * 9; S.updates.push((t) => { tail.rotation.y = Math.sin(t * 2.2 + ph) * .5; });
  return g;
}
export function dog(S, p, x, z, ry = 0, c = '#c9a77a', lying = true, y = 0) {
  const g = group(p, x, y, z, ry);
  if (lying) { ell(g, .16, .1, .3, c, 0, .1, 0); blob(g, .11, c, 0, .14, .3, true); ell(g, .05, .04, .07, shade(c, -.1), 0, .12, .41); for (const s of [-1, 1]) ell(g, .035, .07, .05, shade(c, -.15), s * .08, .2, .28); box(g, .03, .04, .02, N('#f2c230'), .09, .23, .27); for (const s of [-1, 1]) ell(g, .04, .03, .1, c, s * .08, .03, .25); }
  else { ell(g, .14, .12, .28, c, 0, .32, 0); for (const [lx, lz] of [[-.07, .17], [.07, .17], [-.07, -.17], [.07, -.17]]) box(g, .05, .26, .05, c, lx, 0, lz); blob(g, .11, c, 0, .48, .3, true); ell(g, .05, .04, .07, shade(c, -.1), 0, .46, .41); for (const s of [-1, 1]) ell(g, .035, .07, .05, shade(c, -.15), s * .08, .55, .28); }
  const tail = group(g, 0, lying ? .1 : .38, -.28); cyl(tail, .02, .03, .2, c, 0, 0, 0, 5).rotation.x = -1.0; const ph = R() * 9; S.updates.push((t) => { tail.rotation.y = Math.sin(t * (lying ? 1.5 : 6) + ph) * .5; });
  return g;
}
export function planter(p, x, z, w = .8, d = .4, c = '#9a8f80', y = 0, fl = FLW) { box(p, w, .3, d, c, x, y, z); box(p, w - .06, .02, d - .06, N('#5a4636'), x, y + .3, z).castShadow = false; for (let i = 0; i < Math.round(w * 6); i++) { const fx = x + rr(-w / 2 + .06, w / 2 - .06), fz = z + rr(-d / 2 + .06, d / 2 - .06); blob(p, .06, '#3f7a3a', fx, y + .36, fz); blob(p, .04, pick(fl), fx, y + .42, fz); } }
export function curb(p, x, z, w, d, c = '#b8b0a2', h = .1, y = 0) { box(p, w, h, d, c, x, y, z).castShadow = false; }
export function crosswalk(p, x, z, len, along = 'x', n = 6, y = 0) { for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * .38; if (along === 'x') box(p, .22, .012, len, N('#f2f2ee'), x + o, y, z).castShadow = false; else box(p, len, .012, .22, N('#f2f2ee'), x, y, z + o).castShadow = false; } }
export function dashes(p, x1, x2, z, y = 0, along = 'x') { for (let x = x1; x < x2; x += 1.2) { if (along === 'x') box(p, .55, .01, .06, N('#f2efe6'), x, y, z).castShadow = false; else box(p, .06, .01, .55, N('#f2efe6'), z, y, x).castShadow = false; } }
export function stall(p, x, z, ry, o) { // market stall facing +z (local), counter at front
  const g = group(p, x, o.y || 0, z, ry); const wood = o.wood || '#7a4e2e', W = o.W || 2.0, D = o.D || 1.2;
  for (const sx of [-W / 2 + .05, W / 2 - .05]) for (const sz of [-D / 2 + .05, D / 2 - .05]) box(g, .06, 1.9, .06, wood, sx, 0, sz);
  if (o.back !== false) box(g, W, 1.7, .05, shade(wood, -.08), 0, 0, -D / 2 + .02);
  box(g, W - .1, .45, .4, '#8a5a3a', 0, 0, D / 2 - .25); box(g, W, .04, .5, '#c9a06a', 0, .45, D / 2 - .25);
  const am = texMat(stripeTex(o.awn[0], o.awn[1], 10)); const a = new THREE.Mesh(UB, am); a.scale.set(W + .3, .04, D + .5); a.position.set(0, 2.02, .1); a.rotation.x = .22; a.castShadow = true; g.add(a);
  const v = new THREE.Mesh(UB, am); v.scale.set(W + .3, .18, .02); v.position.set(0, 1.86, D / 2 + .34); g.add(v);
  if (o.label) sign(g, o.label, W * .8, .3, o.style || { bg: '#fdf3dc', fg: '#8a1e1e' }, 0, 2.45, -D / 2 + .1, 0, !!o.night, '#3a2414');
  if (o.night) for (let i = 0; i < 5; i++) { const bx = -W / 2 + .2 + i * (W - .4) / 4; box(g, .06, .08, .06, EN('#ffe2a0'), bx, 1.72, D / 2 + .25).castShadow = false; glow(g, bx, 1.74, D / 2 + .27, .7, '#ffcf7a', .8); }
  if (o.goods) o.goods(g, 0, .49, D / 2 - .25, W);
  g.updateMatrixWorld(true);
  const front = V(0, 0, D / 2 + .55).applyMatrix4(g.matrixWorld); const behind = V(0, 0, -D / 2 + .4).applyMatrix4(g.matrixWorld);
  return { g, front, behind, ry };
}
export const goods = {
  fruit: (g, x, y, z, W) => { const cs = ['#f08a2c', '#d63a2c', '#8cc63e', '#f2d23c', '#7a2a6a']; for (let i = 0; i < 4; i++) { const cx = x - W / 2 + .3 + i * (W - .6) / 3; box(g, .36, .1, .32, '#a8774a', cx, y, z); for (let k = 0; k < 6; k++) blob(g, .055, cs[i % cs.length], cx - .1 + (k % 3) * .1, y + .14, z - .06 + Math.floor(k / 3) * .12, true).castShadow = false; } },
  fish: (g, x, y, z, W) => { box(g, W - .2, .06, .42, N('#e8f4f8'), x, y, z); for (let i = 0; i < 18; i++) { const f = ell(g, .09, .025, .03, pick(['#9aa8b4', '#c0c8d0', '#d87a6a', '#8a9aa6']), x - W / 2 + .2 + (i % 9) * (W - .4) / 8, y + .08, z - .1 + Math.floor(i / 9) * .2); f.rotation.y = rr(-.3, .3); f.castShadow = false; } for (let i = 0; i < 4; i++) box(g, .04, .08, .01, N('#fff'), x - W / 2 + .3 + i * .45, y + .1, z + .22).castShadow = false; },
  pide: (g, x, y, z, W) => { for (let i = 0; i < 4; i++) { ell(g, .2, .04, .14, '#c88a3a', x - W / 2 + .3 + i * (W - .6) / 3, y + .04, z); } },
  lokum: (g, x, y, z, W) => { for (let i = 0; i < 30; i++) box(g, .07, .05, .07, N(pick(['#f6c0d0', '#fff', '#b8e0a0', '#f8d8a0', '#e8a0b0'])), x - W / 2 + .2 + (i % 15) * (W - .4) / 14, y, z - .08 + Math.floor(i / 15) * .14).castShadow = false; },
  serbet: (g, x, y, z, W) => { for (let i = 0; i < 3; i++) cyl(g, .09, .11, .32, noOL(new THREE.MeshToonMaterial({ color: ['#c0182a', '#e88a2a', '#7a1a3a'][i], transparent: true, opacity: .85 })), x - .5 + i * .5, y, z, 10).userData.keep = true; },
  books: (g, x, y, z, W) => { for (let i = 0; i < 14; i++) box(g, .14, .03 + R() * .04, .2, N(pick(['#2a4b7a', '#7a1e1e', '#2a5a3a', '#c9a64a', '#e8dcc0'])), x - W / 2 + .2 + (i % 7) * (W - .4) / 6, y + Math.floor(i / 7) * .07, z).castShadow = false; },
  scarves: (g, x, y, z, W) => { for (let i = 0; i < 9; i++) box(g, .14, .5, .02, N(pick(['#d6304a', '#2a9d8f', '#f2c230', '#7a3fa0', '#e98bb0', '#3a86c8', '#f08a3c'])), x - W / 2 + .2 + i * (W - .4) / 8, y + .9, z + .2).castShadow = false; box(g, W, .02, .02, '#777', x, y + 1.42, z + .2); for (let i = 0; i < 8; i++) box(g, .16, .04, .16, N(pick(['#d6304a', '#2a9d8f', '#f2c230', '#7a3fa0'])), x - W / 2 + .25 + i * (W - .5) / 7, y, z).castShadow = false; },
  sweets: (g, x, y, z, W) => { for (let i = 0; i < 6; i++) { const cx = x - W / 2 + .25 + i * (W - .5) / 5; cyl(g, .13, .13, .03, '#c9c9c9', cx, y, z, 12); cyl(g, .11, .11, .03, pick(['#d9a04a', '#c88a3a', '#e8c070', '#8a5a2a']), cx, y + .03, z, 12); } },
  toys: (g, x, y, z, W) => { for (let i = 0; i < 5; i++) blob(g, .1, pick(['#e94b3c', '#f2c230', '#3a86c8', '#4caf6a', '#b04ad0']), x - W / 2 + .3 + i * (W - .6) / 4, y + .1, z, true); },
  chestnut: (g, x, y, z, W) => { for (let i = 0; i < 20; i++) blob(g, .035, '#6a3a1a', x + rr(-W / 2 + .2, W / 2 - .2), y + .03, z + rr(-.12, .12), true).castShadow = false; },
};
