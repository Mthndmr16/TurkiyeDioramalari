// Crowd v2: chibi people as instanced meshes, posed in the vertex shader with jointed limbs
// (hip/knee, shoulder/elbow, neck) and per-instance phase, plus a small steering layer so walkers
// slow down behind each other, side-step, and never stand inside one another.
import { THREE, TAU, R, rr, pick, chance, noOL, gradMap, clamp } from './kit.js';

export const uTime = { value: 0 };
const HIP = .21, KNEE = .11, SH = .47, ELBOW = .37, NECK = .52, LEGX = .055, ARMX = .134;
export const MODE = { walk: 0, sit: 1, idle: 2, wave: 3, browse: 4, photo: 5, umbrella: 6, carry: 7, talk: 8, sitPhone: 9, run: 10, fish: 11, sitRelax: 12, standPhone: 13, vendor: 14, clap: 15, selfie: 16, push: 17 };
const WALKING = new Set([MODE.walk, MODE.umbrella, MODE.carry, MODE.run, MODE.push]);
const SITTING = new Set([MODE.sit, MODE.sitPhone, MODE.sitRelax]);

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

// parts: 0 torso 1 thighL 2 thighR 3 upperArmL 4 upperArmR 5 shinL 6 shinR 7 forearmL 8 forearmR 9 head
// slots: 0 skin 1 top 2 bottom 3 hair 4 shoes 5 eyes 6 accent 7 cheeks 8 white
const VARIANTS = {
  m: { hair: 'short' }, f: { hair: 'long' }, s: { hair: 'bun', skirt: true }, h: { hair: 'scarf', coat: true },
  c: { hair: 'cap' }, b: { hair: 'short', bag: true }, fb: { hair: 'long', bag: true }, u: { hair: 'short', umbrella: true },
  fu: { hair: 'long', umbrella: true }, k: { hair: 'short', backpack: true }, hb: { hair: 'scarf', coat: true, bag: true },
  w: { hair: 'short', apron: true }, g: { hair: 'short', old: true }, gf: { hair: 'bun', old: true, skirt: true },
};
const _geo = {};
function bodyGeo(key) {
  if (_geo[key]) return _geo[key];
  const v = VARIANTS[key]; const P = []; const add = (g, m, pid, slot) => P.push(piece(g, m, pid, slot));
  // legs: thigh + shin
  for (const [s, th, sh] of [[-1, 1, 5], [1, 2, 6]]) {
    add(CY(.047, .043, .105, 8), mtx(s * LEGX, .16, 0), th, v.skirt ? 0 : 2);
    add(SP(.044, 8, 6), mtx(s * LEGX, KNEE, 0), sh, v.skirt ? 0 : 2);
    add(CY(.043, .038, .1, 8), mtx(s * LEGX, .06, 0), sh, v.skirt ? 0 : 2);
    add(BX(.078, .05, .12), mtx(s * LEGX, .025, .022), sh, 4);
  }
  // torso
  add(CY(.108, .102, .08, 14), mtx(0, .235, 0), 0, v.coat ? 1 : 2);
  if (v.skirt) add(CY(.104, .158, .16, 16), mtx(0, .185, 0), 0, 2);
  if (v.coat) add(CY(.116, .148, .26, 16), mtx(0, .2, 0), 0, 1);
  add(CY(.1, .112, .25, 14), mtx(0, .355, 0), 0, 1);
  if (v.apron) { add(BX(.15, .22, .02), mtx(0, .3, .105), 0, 8); add(BX(.2, .018, .2), mtx(0, .415, 0, 1, 1, 1), 0, 8); }
  add(SP(.1, 14, 8, 0, Math.PI / 2), mtx(0, .475, 0, 1.13, .6, .92), 0, 1);
  // arms: upper + forearm + hand
  for (const [s, ua, fa] of [[-1, 3, 7], [1, 4, 8]]) {
    add(SP(.04, 8, 6), mtx(s * ARMX, SH - .005, 0), ua, 1);
    add(CY(.035, .032, .1, 8), mtx(s * ARMX, .42, 0), ua, 1);
    add(SP(.033, 8, 6), mtx(s * ARMX, ELBOW, 0), fa, 1);
    add(CY(.031, .028, .09, 8), mtx(s * ARMX, .32, 0), fa, v.coat ? 1 : 0);
    add(SP(.036, 8, 6), mtx(s * ARMX + s * .008, .268, 0), fa, 0);
  }
  add(CY(.04, .046, .05, 8), mtx(0, .505, 0), 0, 0);
  // head
  if (v.hair === 'scarf') {
    add(SP(.152, 16, 12), mtx(0, .628, -.014), 9, 6);
    add(SP(.118, 14, 10), mtx(0, .618, .042), 9, 0);
    add(CY(.07, .15, .1, 14), mtx(0, .5, -.005), 9, 6);
  } else {
    add(SP(.136, 16, 12), mtx(0, .625, 0), 9, 0);
    if (v.hair === 'cap') { add(SP(.146, 16, 8, 0, Math.PI * .5), mtx(0, .64, -.006), 9, 6); add(BX(.17, .016, .11), mtx(0, .676, .12, 1, 1, 1, .15), 9, 6); add(SP(.141, 16, 8, Math.PI * .45, Math.PI * .2), mtx(0, .62, -.01), 9, 3); }
    else add(SP(.144, 16, 10, 0, Math.PI * .56), mtx(0, .636, -.012, 1, 1, 1, -.3), 9, 3);
    if (v.hair === 'long') { add(BX(.24, .26, .07), mtx(0, .55, -.1), 9, 3); add(SP(.122, 12, 8), mtx(0, .45, -.1, 1, .3, .45), 9, 3); }
    if (v.hair === 'bun') add(SP(.06, 10, 8), mtx(0, .77, -.07), 9, 3);
  }
  for (const s of [-1, 1]) { add(SP(.017, 6, 5), mtx(s * .047, .628, .124, 1, 1.25, .6), 9, 5); add(SP(.022, 6, 4), mtx(s * .078, .592, .108, 1, .55, .5), 9, 7); }
  if (v.old) { add(BX(.06, .02, .01), mtx(0, .585, .13), 9, 8); }
  if (v.bag) { add(BX(.11, .13, .055), mtx(.16, .2, .02), 0, 6); add(BX(.02, .34, .02), mtx(.075, .4, .11, 1, 1, 1, 0, 0, -.55), 0, 6); }
  if (v.backpack) add(BX(.17, .2, .09), mtx(0, .38, -.135), 0, 6);
  if (v.umbrella) {
    // built upright at the right hand, then tilted so it stands vertical once the arm is raised (see MODE.umbrella)
    const hx = ARMX + .008, hy = .268, tilt = 2.9;
    const U = (g, lm) => add(g, new THREE.Matrix4().multiplyMatrices(mtx(hx, hy, 0, 1, 1, 1, tilt), lm), 8, 6);
    const Uh = (g, lm) => add(g, new THREE.Matrix4().multiplyMatrices(mtx(hx, hy, 0, 1, 1, 1, tilt), lm), 8, 4);
    Uh(CY(.008, .008, .5, 5), mtx(0, .22, 0)); U(CY(.015, .38, .13, 12), mtx(0, .5, 0)); Uh(CY(.012, .012, .05, 5), mtx(0, .595, 0)); Uh(CY(.009, .009, .07, 5), mtx(0, -.03, 0, 1, 1, 1, 0, 0, 1.2));
  }
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
const float PI = 3.14159265;
mat3 rotX(float a){ float c=cos(a), s=sin(a); return mat3(1.,0.,0., 0.,c,s, 0.,-s,c); }
mat3 rotY(float a){ float c=cos(a), s=sin(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }
mat3 rotZ(float a){ float c=cos(a), s=sin(a); return mat3(c,s,0., -s,c,0., 0.,0.,1.); }
float pulse(float x){ return smoothstep(0., .3, x) - smoothstep(.7, 1., x); }   // soft bump over x in [0,1]
float hipL, hipR, kneeL, kneeR, shL, shR, elL, elR, spL, spR, fzL, fzR, hYaw, hPitch, hRoll, lean, twist, roll; vec3 bodyOff;
void look(float t, float ph){ // occasional glances left/right and a slow nod, different for everyone
  float g = fract(t*.055 + ph*.17); float dir = sign(sin(ph*7.3));
  hYaw = dir * .55 * pulse(g) + .08*sin(t*.7+ph);
  hPitch = .04*sin(t*1.1+ph*2.) + .12*pulse(fract(t*.041+ph*.29));
  hRoll = .02*sin(t*.5+ph);
}
void breathe(float t, float ph){ bodyOff.y += .004*sin(t*1.9+ph); }
void sway(float t, float ph){ float s = sin(t*.45+ph); roll = .03*s; bodyOff.x += .012*s; hipL = -.03*s; hipR = .03*s; }
void armsDown(float t, float ph){ shL = .04*sin(t*.9+ph); shR = -.04*sin(t*.9+ph+1.); elL = -.22; elR = -.22; spL = .06; spR = .06; }
void legsWalk(float ph, float amp, float kamp){ hipL = sin(ph)*amp; hipR = -sin(ph)*amp; kneeL = max(0., -cos(ph))*kamp; kneeR = max(0., cos(ph))*kamp; }
void armsWalk(float ph, float amp){ shL = -sin(ph)*amp; shR = sin(ph)*amp; elL = -.32 - max(0., -shL)*.6; elR = -.32 - max(0., -shR)*.6; spL = .1; spR = .1; }
void legsSit(){ hipL = -1.45; hipR = -1.45; kneeL = 1.45; kneeR = 1.45; }
void pose(){
  float t = uTime; float ph = iAnim.y; float m = iAnim.x; float wph = t*iAnim.z*6.2831853 + ph;
  hipL=hipR=kneeL=kneeR=shL=shR=elL=elR=spL=spR=fzL=fzR=hYaw=hPitch=hRoll=lean=twist=roll=0.; bodyOff = vec3(0.);
  if (m < .5) {            // walk
    legsWalk(wph, .55, .95); armsWalk(wph, .42); bodyOff.y = abs(cos(wph))*.018; lean = -.05; twist = sin(wph)*.1; look(t, ph); hYaw *= .5;
  } else if (m < 1.5) {    // sit
    legsSit(); shL = -.5; shR = -.5; elL = -.6; elR = -.6; spL = .08; spR = .08; look(t, ph); breathe(t, ph); lean = .04;
  } else if (m < 2.5) {    // idle
    armsDown(t, ph); sway(t, ph); look(t, ph); breathe(t, ph);
  } else if (m < 3.5) {    // wave
    armsDown(t, ph); sway(t, ph); look(t, ph); hYaw *= .3; shR = -2.3 + .1*sin(t*6.+ph); elR = -.45; spR = .35; fzR = sin(t*7.+ph)*.45;
  } else if (m < 4.5) {    // browse: hands in front, looking down at goods, reaching now and then
    sway(t, ph); breathe(t, ph); float reach = pulse(fract(t*.11+ph*.13));
    shL = -.55; shR = -.55 - reach*.75; elL = -1.0; elR = -1.0 + reach*.55; spL = .12; spR = .12;
    hPitch = .34 - reach*.1; hYaw = .3*sin(t*.6+ph);
  } else if (m < 5.5) {    // photo: phone held up, occasionally lowered to check the shot
    breathe(t, ph); float chk = pulse(fract(t*.07+ph*.21));
    shL = -1.5 + chk*.6; shR = -1.5 + chk*.6; elL = -1.3; elR = -1.3; spL = .12; spR = .12; hPitch = -.06 + chk*.45; roll = .02*sin(t*.5+ph);
  } else if (m < 6.5) {    // umbrella walk
    legsWalk(wph, .5, .9); armsWalk(wph, .36); bodyOff.y = abs(cos(wph))*.016; lean = -.08; twist = sin(wph)*.06;
    shR = -1.9; elR = -1.0; spR = .12; fzR = .0; hPitch = .12;
  } else if (m < 7.5) {    // carry (tray, drum, boxes)
    legsWalk(wph, .5, .9); bodyOff.y = abs(cos(wph))*.015; lean = -.04; shL = -.85; shR = -.85; elL = -1.1; elR = -1.1; spL = .1; spR = .1; look(t, ph); hYaw *= .4;
  } else if (m < 8.5) {    // talk: gestures and nods
    sway(t, ph); breathe(t, ph); look(t, ph); hYaw *= .25;
    float g1 = max(0., sin(t*1.3+ph)), g2 = max(0., sin(t*.9+ph+2.));
    shL = -.3 - g2*.45; elL = -1.25; spL = .15; shR = -.45 - g1*.6; elR = -1.35 + g1*.35; spR = .2 + g1*.25; fzR = sin(t*4.+ph)*.25*g1;
    hPitch += .07*sin(t*2.3+ph)*(.5+.5*sin(t*.4+ph));
  } else if (m < 9.5) {    // sit, looking at phone
    legsSit(); shL = -.95; shR = -.95; elL = -1.55; elR = -1.55; spL = .14; spR = .14; hPitch = .48; breathe(t, ph); lean = .12; hYaw = .04*sin(t*.3+ph);
  } else if (m < 10.5) {   // run
    legsWalk(wph, .95, 1.5); armsWalk(wph, .7); elL = -1.3; elR = -1.3; bodyOff.y = abs(cos(wph))*.04; lean = -.22; twist = sin(wph)*.14;
  } else if (m < 11.5) {   // fishing: holding the rod, a tug now and then
    sway(t, ph); breathe(t, ph); float tug = pulse(fract(t*.09+ph*.19));
    shL = -.75 - tug*.3; shR = -.75 - tug*.5; elL = -.45; elR = -.45; spL = .06; spR = .06; hPitch = .28 - tug*.3; hYaw = .1*sin(t*.4+ph);
  } else if (m < 12.5) {   // sit, relaxed: arms on the bench back, one leg stretched out
    hipL = -1.2; kneeL = .35; hipR = -1.45; kneeR = 1.45; shL = .25; shR = .25; elL = -.35; elR = -.35; spL = .6; spR = .6; look(t, ph); breathe(t, ph); lean = -.06;
  } else if (m < 13.5) {   // stand, looking at phone
    sway(t, ph); breathe(t, ph); shL = -.95; shR = -.95; elL = -1.6; elR = -1.6; spL = .14; spR = .14; hPitch = .5; hYaw = .05*sin(t*.3+ph);
  } else if (m < 14.5) {   // vendor: hands on hips, calling out now and then
    sway(t, ph); breathe(t, ph); look(t, ph); float call = pulse(fract(t*.08+ph*.23));
    shL = .3; elL = -1.9; spL = .5; shR = .3 - call*2.4; elR = -1.9 + call*1.5; spR = .5 - call*.2; fzR = call*sin(t*6.)*.3; hPitch -= call*.15;
  } else if (m < 15.5) {   // clap / enjoying music
    sway(t, ph); breathe(t, ph); float c = abs(sin(t*4.5+ph)); shL = -.95; shR = -.95; elL = -1.55; elR = -1.55; spL = .32 - c*.2; spR = .32 - c*.2; hPitch = .06*sin(t*4.5+ph); roll = .04*sin(t*2.25+ph);
  } else if (m < 16.5) {   // selfie
    breathe(t, ph); shR = -2.25; elR = -.7; spR = .3; shL = -.2; elL = -.5; spL = .08; hRoll = .22; hPitch = -.08; hYaw = .15;
  } else {                 // push a cart
    legsWalk(wph, .45, .8); bodyOff.y = abs(cos(wph))*.012; lean = -.14; shL = -1.05; shR = -1.05; elL = -.3; elR = -.3; spL = .1; spR = .1; hPitch = .1;
  }
}
void rotAbout(inout vec3 p, inout vec3 n, mat3 Rm, vec3 piv){ p = Rm*(p - piv) + piv; n = Rm*n; }
void deform(inout vec3 p, inout vec3 n){
  pose(); int part = int(aPart + .5);
  if (part == 1 || part == 5) { if (part == 5) rotAbout(p, n, rotX(kneeL), vec3(-${LEGX}, ${KNEE}, 0.)); rotAbout(p, n, rotX(hipL), vec3(-${LEGX}, ${HIP}, 0.)); }
  else if (part == 2 || part == 6) { if (part == 6) rotAbout(p, n, rotX(kneeR), vec3(${LEGX}, ${KNEE}, 0.)); rotAbout(p, n, rotX(hipR), vec3(${LEGX}, ${HIP}, 0.)); }
  else if (part == 3 || part == 7) { if (part == 7) rotAbout(p, n, rotZ(fzL)*rotX(elL), vec3(-${ARMX}, ${ELBOW}, 0.)); rotAbout(p, n, rotZ(-spL)*rotX(shL), vec3(-${ARMX}, ${SH}, 0.)); }
  else if (part == 4 || part == 8) { if (part == 8) rotAbout(p, n, rotZ(fzR)*rotX(elR), vec3(${ARMX}, ${ELBOW}, 0.)); rotAbout(p, n, rotZ(spR)*rotX(shR), vec3(${ARMX}, ${SH}, 0.)); }
  else if (part == 9) { rotAbout(p, n, rotY(hYaw)*rotX(hPitch)*rotZ(hRoll), vec3(0., ${NECK}, 0.)); }
  if (part == 0 || part == 3 || part == 4 || part == 7 || part == 8 || part == 9) rotAbout(p, n, rotY(twist)*rotX(lean)*rotZ(roll), vec3(0., ${HIP}, 0.));
  p += bodyOff;
}
vec3 slotColor(){
  if (aSlot < .5) return iSkin; if (aSlot < 1.5) return iTop; if (aSlot < 2.5) return iBot; if (aSlot < 3.5) return iHair;
  if (aSlot < 4.5) return vec3(.06,.05,.05); if (aSlot < 5.5) return vec3(.02); if (aSlot < 6.5) return iAcc; if (aSlot < 7.5) return vec3(.95,.45,.45); return vec3(.97);
}`;
function bodyMat() {
  const m = new THREE.MeshToonMaterial({ color: '#ffffff', gradientMap: gradMap }); noOL(m);
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = uTime;
    sh.vertexShader = GLSL + '\n' + sh.vertexShader
      .replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>
      vec3 pDef = position; deform(pDef, objectNormal);`)
      .replace('#include <begin_vertex>', `vec3 transformed = pDef; vPC = slotColor();`);
    sh.fragmentShader = 'varying vec3 vPC;\n' + sh.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n diffuseColor.rgb *= vPC;');
  };
  return m;
}
function outlineMat(color = '#241a26', thick = .011) {
  const m = new THREE.MeshBasicMaterial({ color, side: THREE.BackSide }); noOL(m);
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = uTime;
    sh.vertexShader = GLSL + '\n' + sh.vertexShader.replace('#include <begin_vertex>', `vec3 pDef = position; vec3 nDef = normal; deform(pDef, nDef);
      vec3 transformed = pDef + normalize(nDef) * ${thick.toFixed(4)}; vPC = vec3(0.);`);
  };
  return m;
}
const BODY = bodyMat(), OUTL = outlineMat();
const _c = new THREE.Color();
const setC = (arr, i, hex) => { _c.set(hex); arr[i * 3] = _c.r; arr[i * 3 + 1] = _c.g; arr[i * 3 + 2] = _c.b; };
const _q = new THREE.Quaternion(), _p = new THREE.Vector3(), _s = new THREE.Vector3(), _m4 = new THREE.Matrix4(), _up = new THREE.Vector3(0, 1, 0), _e = new THREE.Euler();
export const MIN_D = .4;

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
  /** opts: v (variant), x,y,z, ry, mode, path:{pts,loop,waits,start,offset,mode}, speed, look:{skin,top,bot,hair,acc}, scale, attach, onTick, old, fixed */
  add(o = {}) {
    let v = o.v || pick(['m', 'm', 'f', 'f', 's', 'h', 'c', 'b', 'fb', 'k', 'hb', 'g', 'gf']);
    if (!VARIANTS[v]) v = 'm';
    const G = this._grp(v); if (G.n >= this.cap) return null;
    const i = G.n++; G.im.count = G.ol.count = G.n;
    const old = o.old ?? (VARIANTS[v].old || chance(.1));
    const L = { skin: pick(SKIN), top: pick(TOPS), bot: pick(BOTS), hair: old ? pick(GREY) : pick(HAIR), acc: pick(ACC), ...(o.look || {}) };
    setC(G.at.iSkin.array, i, L.skin); setC(G.at.iTop.array, i, L.top); setC(G.at.iBot.array, i, L.bot); setC(G.at.iHair.array, i, L.hair); setC(G.at.iAcc.array, i, L.acc);
    const a = { G, i, v, pos: new THREE.Vector3(o.x || 0, o.y || 0, o.z || 0), ry: o.ry || 0, mode: o.mode ?? MODE.idle, baseMode: o.mode ?? MODE.idle,
      speed: o.speed ?? rr(.42, .62), vel: 0, scale: o.scale ?? (v === 'k' ? rr(.68, .78) : rr(.95, 1.06)), ph: R() * TAU, path: null, attach: o.attach || null,
      local: o.attach ? new THREE.Vector3(o.x || 0, o.y || 0, o.z || 0) : null, onTick: o.onTick || null, ox: 0, oz: 0, fx: o.x || 0, fz: o.z || 0 };
    if (o.path) this.setPath(a, o.path);
    else if (!a.attach) this._separateSpawn(a);
    this.agents.push(a); this._write(a);
    return a;
  }
  _separateSpawn(a) { // nudge a standing/sitting person out of anyone already placed there
    for (let it = 0; it < 6; it++) {
      let moved = false;
      for (const b of this.agents) { if (b.attach || b.path) continue; const dx = a.pos.x - b.pos.x, dz = a.pos.z - b.pos.z; const d = Math.hypot(dx, dz); if (d < MIN_D && Math.abs(a.pos.y - b.pos.y) < .5) { const k = (MIN_D - d + .02) / (d || 1); if (d < 1e-4) { a.pos.x += MIN_D; } else { a.pos.x += dx * k; a.pos.z += dz * k; } moved = true; } }
      if (!moved) break;
    }
    a.fx = a.pos.x; a.fz = a.pos.z;
  }
  setPath(a, p) {
    const pts = p.pts.map((q) => q.clone()); const segs = []; let tot = 0;
    for (let k = 0; k < pts.length - 1; k++) { const L = pts[k].distanceTo(pts[k + 1]); segs.push(L); tot += L; }
    if (p.loop) { const L = pts[pts.length - 1].distanceTo(pts[0]); segs.push(L); tot += L; }
    a.path = { pts, segs, loop: !!p.loop, waits: p.waits || {}, k: p.start ?? 0, d: (p.offset ?? R()) * (segs[p.start ?? 0] || 0), dir: 1, wait: 0, waitMode: MODE.idle, face: null, until: null, onArrive: p.onArrive || null };
    a.mode = a.walkMode = p.mode ?? MODE.walk; a.baseMode = a.mode;
    this._place(a);
  }
  _place(a) { const P = a.path; const A = P.pts[P.k], B = P.pts[(P.k + 1) % P.pts.length]; const L = P.segs[P.k] || 1e-6; const k = P.d / L; a.pos.set(A.x + (B.x - A.x) * k, A.y + (B.y - A.y) * k, A.z + (B.z - A.z) * k); }
  _write(a) {
    const G = a.G, i = a.i;
    let x = a.fx, y = a.pos.y, z = a.fz, ry = a.ry;
    if (a.attach) { _p.copy(a.local); a.attach.localToWorld(_p); x = _p.x; y = _p.y; z = _p.z; a.attach.getWorldQuaternion(_q); _e.setFromQuaternion(_q, 'YXZ'); ry = _e.y + a.ry; }
    _q.setFromAxisAngle(_up, ry); _p.set(x, y, z); _s.setScalar(a.scale); _m4.compose(_p, _q, _s); G.im.setMatrixAt(i, _m4);
    const an = G.at.iAnim.array; an[i * 4] = a.mode; an[i * 4 + 1] = a.ph;
    an[i * 4 + 2] = WALKING.has(a.mode) ? Math.max(.4, a.vel) / (.36 * a.scale) * (a.mode === MODE.run ? .9 : 1) : 1; an[i * 4 + 3] = 0;
  }
  update(t, dt) {
    const ags = this.agents, n = ags.length;
    // 1. steering: desired speed from the person ahead
    for (const a of ags) {
      if (!a.path || a.attach) { a.vel = 0; continue; }
      const P = a.path; let target = (P.wait > 0 || P.until) ? 0 : a.speed;
      if (target > 0) {
        const hx = Math.sin(a.ry), hz = Math.cos(a.ry); let steer = 0;
        for (const b of ags) {
          if (b === a || b.attach || Math.abs(a.pos.y - b.pos.y) > .5) continue;
          const dx = b.fx - a.fx, dz = b.fz - a.fz; const fwd = dx * hx + dz * hz; if (fwd < .05 || fwd > .9) continue;
          const latS = dx * hz - dz * hx, lat = Math.abs(latS); if (lat > .42) continue;
          const bFwd = b.path && !b.attach ? b.vel * (Math.sin(b.ry) * hx + Math.cos(b.ry) * hz) : 0;
          if (bFwd > .1) target = Math.min(target, Math.max(bFwd * .9, a.speed * Math.min(1, fwd / .7)));   // follow the person ahead
          else { target = Math.min(target, a.speed * Math.max(.35, fwd / .9)); steer += (latS >= 0 ? -1 : 1) * (1 - lat / .42); } // step around someone standing or coming the other way
        }
        if (steer) { const k = dt * 1.1 * Math.max(-1, Math.min(1, steer)); a.ox += -hz * k * -1; a.oz += hx * k * -1; const m = Math.hypot(a.ox, a.oz); if (m > .7) { a.ox *= .7 / m; a.oz *= .7 / m; } }
      }
      a.vel += clamp(target - a.vel, -dt * 3, dt * 1.6);
    }
    // 2. move along paths
    for (const a of ags) {
      const P = a.path; if (!P) continue;
      if (P.wait > 0 || P.until) {
        if (P.wait > 0) P.wait -= dt;
        if (P.wait <= 0 && P.until && P.until(t)) P.until = null;
        a.mode = P.waitMode; if (P.face != null) a.ry += angDiff(a.ry, P.face) * Math.min(1, dt * 5);
        if (P.wait <= 0 && !P.until) a.mode = a.walkMode;
        continue;
      }
      let mv = a.vel * dt, guard = 8;
      while (mv > 0 && guard--) {
        const nseg = P.segs.length, L = P.segs[P.k]; const rem = P.dir > 0 ? L - P.d : P.d;
        if (mv < rem) { P.d += mv * P.dir; mv = 0; }
        else {
          mv -= rem; const next = P.dir > 0 ? (P.k + 1) % (P.loop ? nseg : nseg + 1) : P.k;
          const w = P.waits[next];
          if (w) { P.wait = Array.isArray(w) ? rr(w[0], w[1]) : (w.t ? rr(w.t[0], w.t[1]) : (typeof w === 'number' ? w : 0)); P.waitMode = w.mode ?? MODE.idle; P.face = w.face ?? null; P.until = w.until || null; mv = 0; }
          if (P.dir > 0) { if (!P.loop && P.k + 1 >= nseg) { P.dir = -1; P.d = L; if (P.onArrive) P.onArrive(a, 'end'); } else { P.k = (P.k + 1) % nseg; P.d = 0; } }
          else { if (P.k - 1 < 0) { if (P.loop) { P.k = nseg - 1; P.d = P.segs[P.k]; } else { P.dir = 1; P.d = 0; if (P.onArrive) P.onArrive(a, 'start'); } } else { P.k -= 1; P.d = P.segs[P.k]; } }
        }
      }
      this._place(a);
      const A = P.pts[P.k], B = P.pts[(P.k + 1) % P.pts.length];
      const hx = (B.x - A.x) * P.dir, hz = (B.z - A.z) * P.dir; if (hx || hz) { const tgt = Math.atan2(hx, hz); a.ry += angDiff(a.ry, tgt) * Math.min(1, dt * 7); }
      a.mode = a.walkMode;
    }
    // 3. pairwise separation on the displayed position; walkers' offsets relax back to their path
    for (const a of ags) { if (a.attach) continue; const k = a.path ? Math.min(1, dt * .45) : 0; a.ox -= a.ox * k; a.oz -= a.oz * k; a.fx = a.pos.x + a.ox; a.fz = a.pos.z + a.oz; }
    for (let i = 0; i < n; i++) {
      const a = ags[i]; if (a.attach) continue;
      for (let j = i + 1; j < n; j++) {
        const b = ags[j]; if (b.attach || Math.abs(a.pos.y - b.pos.y) > .5) continue;
        let dx = a.fx - b.fx, dz = a.fz - b.fz; let d = Math.hypot(dx, dz); const md = MIN_D * (a.scale + b.scale) * .5;
        if (d >= md) continue;
        if (d < 1e-4) { dx = Math.cos(i); dz = Math.sin(i); d = 1e-4; }
        const push = (md - d), ux = dx / d, uz = dz / d;
        const wa = a.path ? 1 : .15, wb = b.path ? 1 : .15; const sum = wa + wb;
        const ka = push * wa / sum, kb = push * wb / sum;
        a.ox += ux * ka; a.oz += uz * ka; a.fx += ux * ka; a.fz += uz * ka;
        b.ox -= ux * kb; b.oz -= uz * kb; b.fx -= ux * kb; b.fz -= uz * kb;
      }
    }
    for (const a of ags) { if (a.onTick) a.onTick(a, t, dt); this._write(a); }
    for (const k in this.groups) { const G = this.groups[k]; G.im.instanceMatrix.needsUpdate = true; G.at.iAnim.needsUpdate = true; if (!G._c) { for (const nm of ['iSkin', 'iTop', 'iBot', 'iHair', 'iAcc']) G.at[nm].needsUpdate = true; G._c = true; } }
  }
  colorsDirty() { for (const k in this.groups) this.groups[k]._c = false; }
}
export function angDiff(a, b) { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; }
/** jitter a polyline sideways so walkers don't share one line */
export function lane(pts, off) { const out = []; for (let i = 0; i < pts.length; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]; const dx = b.x - a.x, dz = b.z - a.z, L = Math.hypot(dx, dz) || 1; out.push(new THREE.Vector3(pts[i].x - dz / L * off, pts[i].y, pts[i].z + dx / L * off)); } return out; }
/** two or three people standing in a loose circle, talking */
export function chat(C, x, z, n = 2, y = 0, opts = {}) {
  const r = n === 2 ? .26 : .34, a0 = rr(0, TAU), out = [];
  for (let i = 0; i < n; i++) { const a = a0 + i / n * TAU; const px = x + Math.cos(a) * r, pz = z + Math.sin(a) * r; out.push(C.add({ x: px, y, z: pz, ry: Math.atan2(x - px, z - pz), mode: i === 0 ? MODE.talk : (chance(.5) ? MODE.talk : MODE.idle), v: opts.v ? pick(opts.v) : undefined, old: opts.old })); }
  return out;
}
