// Crowd: chibi people as instanced meshes, animated in the vertex shader (walk / sit / idle / gesture / browse / photo / umbrella).
import { THREE, TAU, R, rr, pick, chance, noOL, gradMap } from './kit.js';

export const uTime = { value: 0 };
const HIP = .21, SH = .47;
export const MODE = { walk: 0, sit: 1, idle: 2, wave: 3, browse: 4, photo: 5, umbrella: 6, carry: 7 };

const SKIN = ['#f3cba8', '#e9b690', '#dca37c', '#c98a64', '#f7d9bf', '#b77a55', '#e2ad86'];
const HAIR = ['#2b1d16', '#3b281c', '#55361f', '#1b1a1c', '#7a4a2a', '#a8763f', '#d9b27a', '#2e2420'];
const GREY = ['#bdbab4', '#d8d6d0', '#9d9a95'];
const TOPS = ['#e2574c', '#f2b134', '#3c7dd9', '#46a86a', '#f08a4b', '#ffffff', '#8b5cc4', '#2f4a6d', '#e98bb0', '#3fb6b0', '#c94f2c', '#f4e3c1', '#6b7a3a', '#1f1f24', '#b8c8de'];
const BOTS = ['#2f3e5c', '#3b5998', '#26272b', '#6b5a4a', '#8a8f99', '#c7b79a', '#435a3c', '#5b2f3c', '#1f2a44'];
const ACC = ['#d6455a', '#f2c230', '#3a86c8', '#7a3fa0', '#e98bb0', '#4caf6a', '#f08a3c', '#2a9d8f', '#ffffff', '#a0522d'];

function mtx(x, y, z, sx = 1, sy = 1, sz = 1, rx = 0, ry = 0, rz = 0) { const m = new THREE.Matrix4(); m.compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(sx, sy, sz)); return m; }
function piece(geo, m, pid, slot) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone(); g.applyMatrix4(m);
  const n = g.attributes.position.count; const out = new THREE.BufferGeometry();
  out.setAttribute('position', g.attributes.position); out.setAttribute('normal', g.attributes.normal);
  out.setAttribute('aPart', new THREE.BufferAttribute(new Float32Array(n).fill(pid), 1));
  out.setAttribute('aSlot', new THREE.BufferAttribute(new Float32Array(n).fill(slot), 1));
  return out;
}
const CY = (rt, rb, h, s = 10) => new THREE.CylinderGeometry(rt, rb, h, s);
const SP = (r, w = 12, h = 9, ts = 0, tl = Math.PI) => new THREE.SphereGeometry(r, w, h, 0, TAU, ts, tl);
const BX = (w, h, d) => new THREE.BoxGeometry(w, h, d);

// slots: 0 skin 1 top 2 bottom 3 hair 4 shoes 5 eyes 6 accent 7 cheeks
const VARIANTS = {
  m: { hair: 'short' }, f: { hair: 'long' }, s: { hair: 'bun', skirt: true }, h: { hair: 'scarf', coat: true },
  c: { hair: 'cap' }, b: { hair: 'short', bag: true }, fb: { hair: 'long', bag: true }, u: { hair: 'short', umbrella: true },
  fu: { hair: 'long', umbrella: true }, k: { hair: 'short', backpack: true }, hb: { hair: 'scarf', coat: true, bag: true },
};
const _geo = {};
function bodyGeo(key) {
  if (_geo[key]) return _geo[key];
  const v = VARIANTS[key]; const P = []; const add = (g, m, pid, slot) => P.push(piece(g, m, pid, slot));
  for (const [s, pid] of [[-1, 1], [1, 2]]) {
    add(CY(.046, .04, .2, 8), mtx(s * .055, .11, 0), pid, v.skirt ? 0 : 2);
    add(BX(.078, .05, .12), mtx(s * .056, .025, .022), pid, 4);
  }
  add(CY(.108, .102, .08, 14), mtx(0, .235, 0), 0, v.coat ? 1 : 2);
  if (v.skirt) add(CY(.104, .158, .16, 16), mtx(0, .185, 0), 0, 2);
  if (v.coat) add(CY(.116, .148, .26, 16), mtx(0, .2, 0), 0, 1);
  add(CY(.1, .112, .25, 14), mtx(0, .355, 0), 0, 1);
  add(SP(.1, 14, 8, 0, Math.PI / 2), mtx(0, .475, 0, 1.13, .6, .92), 0, 1);
  for (const [s, pid] of [[-1, 3], [1, 4]]) {
    add(CY(.034, .03, .2, 8), mtx(s * .134, .37, 0, 1, 1, 1, 0, 0, s * .1), pid, 1);
    add(SP(.036, 8, 6), mtx(s * .145, .262, 0), pid, 0);
  }
  add(CY(.04, .046, .05, 8), mtx(0, .505, 0), 0, 0);
  if (v.hair === 'scarf') {
    add(SP(.152, 16, 12), mtx(0, .628, -.014), 0, 6);
    add(SP(.118, 14, 10), mtx(0, .618, .042), 0, 0);
    add(CY(.07, .15, .1, 14), mtx(0, .5, -.005), 0, 6);
  } else {
    add(SP(.136, 16, 12), mtx(0, .625, 0), 0, 0);
    if (v.hair === 'cap') { add(SP(.146, 16, 8, 0, Math.PI * .5), mtx(0, .64, -.006), 0, 6); add(BX(.17, .016, .11), mtx(0, .676, .12, 1, 1, 1, .15), 0, 6); add(SP(.141, 16, 8, Math.PI * .45, Math.PI * .2), mtx(0, .62, -.01), 0, 3); }
    else add(SP(.144, 16, 10, 0, Math.PI * .56), mtx(0, .636, -.012, 1, 1, 1, -.3), 0, 3);
    if (v.hair === 'long') { add(BX(.24, .26, .07), mtx(0, .55, -.1), 0, 3); add(SP(.122, 12, 8), mtx(0, .45, -.1, 1, .3, .45), 0, 3); }
    if (v.hair === 'bun') add(SP(.06, 10, 8), mtx(0, .77, -.07), 0, 3);
  }
  for (const s of [-1, 1]) { add(SP(.017, 6, 5), mtx(s * .047, .628, .124, 1, 1.25, .6), 0, 5); add(SP(.022, 6, 4), mtx(s * .078, .592, .108, 1, .55, .5), 0, 7); }
  if (v.bag) { add(BX(.11, .13, .055), mtx(.155, .17, .01), 4, 6); add(BX(.012, .06, .045), mtx(.155, .25, .01), 4, 6); }
  if (v.backpack) add(BX(.17, .2, .09), mtx(0, .38, -.135), 0, 6);
  if (v.umbrella) { add(CY(.008, .008, .5, 5), mtx(.1, .58, .06), 0, 4); add(CY(.015, .38, .13, 12), mtx(.1, .86, .06), 0, 6); add(CY(.012, .012, .05, 5), mtx(.1, .955, .06), 0, 4); }
  const g = mergeAll(P); _geo[key] = g; return g;
}
function mergeAll(list) {
  let n = 0; for (const g of list) n += g.attributes.position.count;
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), pa = new Float32Array(n), sl = new Float32Array(n);
  let o = 0; for (const g of list) { const c = g.attributes.position.count; pos.set(g.attributes.position.array, o * 3); nor.set(g.attributes.normal.array, o * 3); pa.set(g.attributes.aPart.array, o); sl.set(g.attributes.aSlot.array, o); o += c; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setAttribute('aPart', new THREE.BufferAttribute(pa, 1)); g.setAttribute('aSlot', new THREE.BufferAttribute(sl, 1));
  g.computeBoundingSphere(); return g;
}
const GLSL = `
attribute float aPart; attribute float aSlot;
attribute vec4 iAnim; attribute vec3 iSkin; attribute vec3 iTop; attribute vec3 iBot; attribute vec3 iHair; attribute vec3 iAcc;
uniform float uTime;
varying vec3 vPC;
mat3 rotX(float a){ float c=cos(a), s=sin(a); return mat3(1.,0.,0., 0.,c,s, 0.,-s,c); }
void partPose(out float ang, out float piv, out float bob){
  float ph = uTime*iAnim.z*6.2831853 + iAnim.y; float m = iAnim.x;
  float leg = 0., aL = 0., aR = 0.; bob = 0.; bool sit = false;
  if (m < .5) { leg = sin(ph)*.62; aL = -sin(ph)*.5; aR = sin(ph)*.5; bob = abs(cos(ph))*.022; }
  else if (m < 1.5) { sit = true; float s = sin(ph*.2); aL = -.5 + s*.04; aR = -.5 - s*.04; }
  else if (m < 2.5) { float s = sin(ph*.3); aL = s*.05; aR = -s*.05; bob = s*.004; }
  else if (m < 3.5) { aL = .04; aR = -1.25 + sin(ph*1.7)*.4; bob = abs(sin(ph*.85))*.006; }
  else if (m < 4.5) { float s = sin(ph*.25); aL = -.6 + s*.06; aR = -.55 - s*.06; }
  else if (m < 5.5) { aL = -1.4; aR = -1.4; }
  else if (m < 6.5) { leg = sin(ph)*.55; aL = -sin(ph)*.4; aR = -.75; bob = abs(cos(ph))*.018; }
  else { leg = sin(ph)*.55; aL = -1.2; aR = -1.2; bob = abs(cos(ph))*.018; }
  ang = 0.; piv = 0.;
  if (aPart > .5 && aPart < 1.5) { ang = sit ? -1.5 : leg; piv = ${HIP}; }
  else if (aPart > 1.5 && aPart < 2.5) { ang = sit ? -1.5 : -leg; piv = ${HIP}; }
  else if (aPart > 2.5 && aPart < 3.5) { ang = aL; piv = ${SH}; }
  else if (aPart > 3.5) { ang = aR; piv = ${SH}; }
}
vec3 slotColor(){
  if (aSlot < .5) return iSkin; if (aSlot < 1.5) return iTop; if (aSlot < 2.5) return iBot; if (aSlot < 3.5) return iHair;
  if (aSlot < 4.5) return vec3(.06,.05,.05); if (aSlot < 5.5) return vec3(.02); if (aSlot < 6.5) return iAcc; return vec3(.95,.45,.45);
}`;
function bodyMat() {
  const m = new THREE.MeshToonMaterial({ color: '#ffffff', gradientMap: gradMap }); noOL(m);
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = uTime;
    sh.vertexShader = GLSL + "\n" + sh.vertexShader
      .replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>
      float pAng; float pPiv; float pBob; partPose(pAng, pPiv, pBob); mat3 pR = rotX(pAng); objectNormal = pR * objectNormal;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
      transformed.y -= pPiv; transformed = pR * transformed; transformed.y += pPiv + pBob; vPC = slotColor();`);
    sh.fragmentShader = 'varying vec3 vPC;\n' + sh.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n diffuseColor.rgb *= vPC;');
  };
  return m;
}
function outlineMat(color = '#241a26', thick = .012) {
  const m = new THREE.MeshBasicMaterial({ color, side: THREE.BackSide }); noOL(m);
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = uTime;
    sh.vertexShader = GLSL + "\n" + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      float pAng; float pPiv; float pBob; partPose(pAng, pPiv, pBob); mat3 pR = rotX(pAng);
      transformed.y -= pPiv; transformed = pR * transformed; transformed.y += pPiv + pBob;
      transformed += normalize(pR * normal) * ${thick.toFixed(4)}; vPC = vec3(0.);`);
  };
  return m;
}
const BODY = bodyMat(), OUTL = outlineMat();
const _c = new THREE.Color();
const setC = (arr, i, hex) => { _c.set(hex); arr[i * 3] = _c.r; arr[i * 3 + 1] = _c.g; arr[i * 3 + 2] = _c.b; };
const _q = new THREE.Quaternion(), _p = new THREE.Vector3(), _s = new THREE.Vector3(), _m4 = new THREE.Matrix4(), _up = new THREE.Vector3(0, 1, 0), _e = new THREE.Euler();

export class Crowd {
  constructor(parent, cap = 40) { this.parent = parent; this.cap = cap; this.groups = {}; this.agents = []; }
  _grp(v) {
    if (this.groups[v]) return this.groups[v];
    const base = bodyGeo(v); const g = new THREE.BufferGeometry();
    for (const k of ['position', 'normal', 'aPart', 'aSlot']) g.setAttribute(k, base.attributes[k]);
    const cap = this.cap, mk = (n) => new THREE.InstancedBufferAttribute(new Float32Array(cap * n), n);
    const at = { iAnim: mk(4), iSkin: mk(3), iTop: mk(3), iBot: mk(3), iHair: mk(3), iAcc: mk(3) };
    for (const k in at) { at[k].setUsage(THREE.DynamicDrawUsage); g.setAttribute(k, at[k]); }
    const im = new THREE.InstancedMesh(g, BODY, cap); im.castShadow = true; im.receiveShadow = true; im.frustumCulled = false; im.count = 0;
    const ol = new THREE.InstancedMesh(g, OUTL, cap); ol.instanceMatrix = im.instanceMatrix; ol.frustumCulled = false; ol.count = 0;
    im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.parent.add(im, ol);
    return (this.groups[v] = { im, ol, at, n: 0 });
  }
  /** opts: v (variant), x,z,y, ry, mode, path:{pts,loop,waits}, speed, look:{skin,top,bot,hair,acc}, scale, attach:Object3D */
  add(o = {}) {
    let v = o.v || pick(['m', 'm', 'f', 'f', 's', 'h', 'c', 'b', 'fb', 'k', 'hb']);
    const G = this._grp(v); if (G.n >= this.cap) return null;
    const i = G.n++; G.im.count = G.ol.count = G.n;
    const old = o.old ?? chance(.12);
    const L = { skin: pick(SKIN), top: pick(TOPS), bot: pick(BOTS), hair: old ? pick(GREY) : pick(HAIR), acc: pick(ACC), ...(o.look || {}) };
    setC(G.at.iSkin.array, i, L.skin); setC(G.at.iTop.array, i, L.top); setC(G.at.iBot.array, i, L.bot); setC(G.at.iHair.array, i, L.hair); setC(G.at.iAcc.array, i, L.acc);
    const a = { G, i, v, pos: new THREE.Vector3(o.x || 0, o.y || 0, o.z || 0), ry: o.ry || 0, mode: o.mode ?? MODE.idle, baseMode: o.mode ?? MODE.idle,
      speed: o.speed ?? rr(.42, .62), scale: o.scale ?? (chance(.12) ? rr(.72, .8) : rr(.95, 1.06)), ph: R() * TAU, path: null, attach: o.attach || null, local: o.attach ? new THREE.Vector3(o.x || 0, o.y || 0, o.z || 0) : null, onTick: o.onTick || null };
    if (o.path) this.setPath(a, o.path);
    this.agents.push(a); this._write(a, true);
    return a;
  }
  setPath(a, p) {
    const pts = p.pts.map((q) => q.clone()); const segs = []; let tot = 0;
    for (let k = 0; k < pts.length - 1; k++) { const L = pts[k].distanceTo(pts[k + 1]); segs.push(L); tot += L; }
    if (p.loop) { const L = pts[pts.length - 1].distanceTo(pts[0]); segs.push(L); tot += L; }
    a.path = { pts, segs, loop: !!p.loop, waits: p.waits || {}, k: p.start ?? 0, d: (p.offset ?? R()) * (segs[p.start ?? 0] || 0), dir: 1, wait: 0, waitMode: MODE.idle, face: null };
    a.mode = a.walkMode = p.mode ?? MODE.walk; a.baseMode = a.mode;
    a.pos.copy(pts[a.path.k]);
  }
  _write(a, colors = false) {
    const G = a.G, i = a.i;
    let x = a.fx ?? a.pos.x, y = a.pos.y, z = a.fz ?? a.pos.z, ry = a.ry;
    if (a.attach) { _p.copy(a.local); a.attach.localToWorld(_p); x = _p.x; y = _p.y; z = _p.z; a.attach.getWorldQuaternion(_q); _e.setFromQuaternion(_q, 'YXZ'); ry = _e.y + a.ry; }
    _q.setFromAxisAngle(_up, ry); _p.set(x, y, z); _s.setScalar(a.scale); _m4.compose(_p, _q, _s); G.im.setMatrixAt(i, _m4);
    const an = G.at.iAnim.array; an[i * 4] = a.mode; an[i * 4 + 1] = a.ph; an[i * 4 + 2] = a.mode === MODE.walk || a.mode >= 6 ? a.speed / (.36 * a.scale) : 1; an[i * 4 + 3] = 0;
  }
  update(t, dt) {
    for (const a of this.agents) {
      const P = a.path;
      if (P) {
        if (P.wait > 0) { P.wait -= dt; a.mode = P.waitMode; if (P.face != null) a.ry += angDiff(a.ry, P.face) * Math.min(1, dt * 5); if (P.wait <= 0) a.mode = a.walkMode; }
        else {
          let mv = a.speed * dt; let guard = 8;
          while (mv > 0 && guard--) {
            const n = P.segs.length; const L = P.segs[P.k];
            const rem = P.dir > 0 ? L - P.d : P.d;
            if (mv < rem) { P.d += mv * P.dir; mv = 0; }
            else {
              mv -= rem; let next;
              if (P.dir > 0) { next = (P.k + 1) % (P.loop ? n : n + 1); }
              else { next = P.k; }
              const w = P.waits[next]; if (w) { P.wait = Array.isArray(w) ? rr(w[0], w[1]) : (w.t ? rr(w.t[0], w.t[1]) : w); P.waitMode = w.mode ?? MODE.idle; P.face = w.face ?? null; mv = 0; }
              if (P.dir > 0) { if (!P.loop && P.k + 1 >= n) { P.dir = -1; P.d = L; } else { P.k = (P.k + 1) % n; P.d = 0; } }
              else { if (P.k - 1 < 0) { if (P.loop) { P.k = n - 1; P.d = P.segs[P.k]; } else { P.dir = 1; P.d = 0; } } else { P.k -= 1; P.d = P.segs[P.k]; } }
            }
          }
          const A = P.pts[P.k], B = P.pts[(P.k + 1) % P.pts.length]; const L = P.segs[P.k] || 1e-6; const k = P.d / L;
          a.pos.set(A.x + (B.x - A.x) * k, A.y + (B.y - A.y) * k, A.z + (B.z - A.z) * k);
          const hx = (B.x - A.x) * P.dir, hz = (B.z - A.z) * P.dir; if (P.wait <= 0 && (hx || hz)) { const tgt = Math.atan2(hx, hz); a.ry += angDiff(a.ry, tgt) * Math.min(1, dt * 7); }
          if (P.wait > 0) a.mode = P.waitMode;
        }
      }
      if (a.onTick) a.onTick(a, t, dt);
    }
    // simple side-stepping so walkers don't pass through each other or through people standing / sitting
    const ags = this.agents, n = ags.length;
    for (let i = 0; i < n; i++) {
      const a = ags[i]; if (!a.path || a.attach) { a.fx = a.pos.x; a.fz = a.pos.z; continue; }
      const px = Math.cos(a.ry), pz = -Math.sin(a.ry); let tgt = 0;
      for (let j = 0; j < n; j++) { if (j === i) continue; const b = ags[j]; if (b.attach) continue; const dx = a.pos.x - (b.fx ?? b.pos.x), dz = a.pos.z - (b.fz ?? b.pos.z); const d2 = dx * dx + dz * dz; if (d2 > .3 || Math.abs(a.pos.y - b.pos.y) > .5) continue; const d = Math.sqrt(d2); let sd = Math.sign(dx * px + dz * pz) || (i < j ? 1 : -1); tgt += sd * (.55 - d) * (b.path ? 1 : 1.6); }
      tgt = Math.max(-.42, Math.min(.42, tgt)); a.off = (a.off || 0) + (tgt - (a.off || 0)) * Math.min(1, dt * 5);
      a.fx = a.pos.x + px * a.off; a.fz = a.pos.z + pz * a.off;
    }
    for (const a of ags) this._write(a);
    for (const k in this.groups) { const G = this.groups[k]; G.im.instanceMatrix.needsUpdate = true; G.at.iAnim.needsUpdate = true; if (!G._c) { for (const n of ['iSkin', 'iTop', 'iBot', 'iHair', 'iAcc']) G.at[n].needsUpdate = true; G._c = true; } }
  }
  colorsDirty() { for (const k in this.groups) this.groups[k]._c = false; }
}
export function angDiff(a, b) { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; }
/** helper: jitter a polyline sideways so walkers don't share one line */
export function lane(pts, off) { const out = []; for (let i = 0; i < pts.length; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]; const dx = b.x - a.x, dz = b.z - a.z, L = Math.hypot(dx, dz) || 1; out.push(new THREE.Vector3(pts[i].x - dz / L * off, pts[i].y, pts[i].z + dx / L * off)); } return out; }
