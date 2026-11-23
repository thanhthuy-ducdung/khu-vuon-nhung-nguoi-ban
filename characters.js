// Character library for the series "Nhung cau chuyen nho cho be 4 tuoi" (Mid-century Cartoon style).
// SINGLE SOURCE OF TRUTH: every episode imports this file, so every friend looks identical in every film.
// Local coordinates: (0,0) = the point between the feet, y up is negative. Standard height ~ 340 px at scale 1.
// Limited animation: bodies are held drawings; only arms, eyes, brows and mouth change.
//
// drawCharacter(ctx, id, pose)
//   pose.wave   0..1  right arm from rest to raised (waving)
//   pose.wob    radians, hand wobble while waving
//   pose.blink  boolean
//   pose.face   'smile' | 'happy' | 'sad' | 'wow' | 'talk' (with pose.open 0..1)
//   pose.armL / pose.armR  [name, k]: blend from rest to 'reach' | 'hold' | 'up' | 'stretch' | 'side' | 'table' | 'tableFar' | 'eat' by k (overrides wave on that arm)
//   pose.noScarf  hide the rabbit's scarf (when it flies away)
//   pose.kickL / pose.kickR 0..1 foot swings out sideways;  pose.step  walking phase (feet lift alternately)
import { PAL, shape, ink, ellipse, spline, rrect, move, reg, TAU } from './engine/toon.js';
import { drawHand } from './engine/chars.js';

const E = (cx, cy, rx, ry, rot = 0, n = 40) => ellipse(cx, cy, rx, ry, n, 0, TAU, rot);
const S = (ctx, pts, o) => shape(ctx, pts, { line: 4, grain: 0.3, breaks: 0.12, ...o });
const tri = (pts, s) => pts.map(([x, y]) => [x * s, y]);
const lerpP = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
export const PINK = '#EFA9A0', CREAM = '#F4E3C3';

// ---------- the cast: identity is fixed here ----------
export const CAST = {
  tho:  { name: 'Thỏ Trắng', kind: 'rabbit',   fur: '#FAF4E6', furD: '#E3D7C1', accent: '#E8B43A', scarf: '#E8B43A' },
  soc:  { name: 'Sóc Nâu',   kind: 'squirrel', fur: '#9C5A32', furD: '#7A4324', furL: '#C98A5C', accent: '#F08A2C', bow: '#F08A2C' },
  gau:  { name: 'Gấu Xám',   kind: 'bear',     fur: '#8F8B87', furD: '#6B6763', furL: '#C7C1BA', shirt: '#6E9B4E', accent: '#6E9B4E' },
  meo:  { name: 'Mèo Mun',   kind: 'cat',      fur: '#3D3937', furD: '#262322', furL: '#5E5956', shirt: '#C98E83', accent: '#C98E83', iris: '#D9C44F' },
  nhim: { name: 'Nhím Nâu',  kind: 'hedgehog', fur: '#DDBA92', furD: '#B8936A', spike: '#7B4B2E', shirt: '#F3E6C6', accent: '#7B4B2E' },
  cu:   { name: 'Cô Cú',     kind: 'owl',      fur: '#8C6E55', furD: '#6E533E', furL: '#B39478', vest: '#6E4A6B', accent: '#6E4A6B', s: 1.08 },
  de:   { name: 'Thầy Dê',   kind: 'goat',     fur: '#EFE8DA', furD: '#CDBFA6', horn: '#B89B72', shirt: '#5B789E', tie: '#E4613F', accent: '#5B789E', s: 1.1 },
  ho:   { name: 'Hổ Béo',    kind: 'tiger',    fur: '#E8893A', furD: '#B9652A', furL: '#F7E2C2', shirt: '#3FA7A0', accent: '#3FA7A0', bw: 1.3 },
};
export const IDS = Object.keys(CAST);

// ---------- shared parts ----------
function arm(ctx, sh, el, ha, handA, col, paw, side, seed) {
  const P = spline([sh, el, ha], false, 6);
  ink(ctx, P, 22, { seed, taper: false, wob: 0.08 });
  const o = reg(seed, 1);
  ink(ctx, move(P, o[0] * 0.6, o[1] * 0.6), 14, { seed: seed + 1, taper: false, wob: 0.05, color: col });
  drawHand(ctx, ha[0], ha[1], handA, 'open', side, 0.72, paw);
}
// arm targets relative to the rest pose, x mirrored by side
const ARM = {
  reach: { el: [72, 74], ha: [104, 112], a: 1.0 },   // down and out, hand at ball height beside the feet
  hold:  { el: [70, 52], ha: [92, 62], a: 0.2 },      // forearm forward, ball carried in the hand
  up:    { el: [86, -40], ha: [96, -112], a: -1.45 },  // hand above the head (toss / catch)
  stretch: { el: [100, -64], ha: [118, -172], a: -1.45 }, // long reach straight up (higher than 'up')
  side:  { el: [84, 30], ha: [126, 24], a: 0.05 },      // arm out to the side (holding a friend's hand)
  table: { el: [76, 50], ha: [70, 22], a: 0.35 },       // hand resting on a table top in front
  tableFar: { el: [96, 40], ha: [118, 20], a: 0.15 },   // reaching across the table
  eat:   { el: [74, 26], ha: [38, -34], a: -2.2 },      // hand at the mouth (eating)
};
export function handPos(c, side, name, k = 1) {
  const bw = c.bw || 1, top = c.kind === 'owl' ? -162 : -150, T = ARM[name];
  const rest = [side * (18 + 50 * bw), top + 98], tgt = [side * (T.ha[0] + 50 * (bw - 1)), top + T.ha[1]];
  return lerpP(rest, tgt, k);
}
function arms(ctx, c, pose, top, sd) {
  const bw = c.bw || 1, col = c.shirt || c.fur, paw = c.kind === 'owl' ? c.furL : c.fur;
  for (const side of [-1, 1]) {
    const w = side === 1 ? (pose.wave || 0) : 0;
    const sh = [side * 50 * bw, top + 14];
    let el = lerpP([side * (14 + 50 * bw), top + 58], [side * (46 + 50 * bw), top - 22], w);
    let ha = lerpP([side * (18 + 50 * bw), top + 98], [side * (56 + 50 * bw), top - 92], w);
    let a = (1 - w) * (Math.PI / 2 - side * 0.12) + w * (-Math.PI / 2 + (pose.wob || 0));
    const ov = side === 1 ? pose.armR : pose.armL;
    if (ov && ov[1] > 0) {
      const T = ARM[ov[0]], k = ov[1], dx = 50 * (bw - 1);
      el = lerpP([side * (14 + 50 * bw), top + 58], [side * (T.el[0] + dx), top + T.el[1]], k);
      ha = lerpP([side * (18 + 50 * bw), top + 98], [side * (T.ha[0] + dx), top + T.ha[1]], k);
      const ta = side === 1 ? T.a : Math.PI - T.a;
      a = (1 - k) * (Math.PI / 2 - side * 0.12) + k * ta;
    }
    arm(ctx, sh, el, ha, a, col, paw, side, sd + 300 + side * 7);
  }
}
function eyes(ctx, c, pose, ex, ey, big) {
  const dark = c.kind === 'cat';
  for (const s of [-1, 1]) {
    const x = s * ex, y = ey;
    if (big) S(ctx, E(x, y, 22, 22), { fill: PAL.white, line: 0, grain: 0, seed: 60 + s });
    if (pose.blink) { ink(ctx, [[x - 10, y], [x + 10, y]], 4.5, { taper: false, color: dark ? CREAM : PAL.ink }); continue; }
    const wow = pose.face === 'wow', r = big ? 11 : 9;
    if (dark) { ctx.fillStyle = c.iris; ctx.beginPath(); ctx.ellipse(x, y, 12, 14, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.ellipse(x, y, dark ? 5 : r * (wow ? 1.15 : 1), dark ? 12 : (big ? r : 12) * (wow ? 1.15 : 1), 0, 0, TAU); ctx.fill();
    ctx.fillStyle = PAL.white; ctx.beginPath(); ctx.arc(x + 3, y - 4, 3, 0, TAU); ctx.fill();
  }
}
function brows(ctx, c, face, ex, ey) {
  if (face !== 'sad' && face !== 'wow') return;
  const col = c.kind === 'cat' ? CREAM : PAL.ink;
  for (const s of [-1, 1]) {
    const x = s * ex, y = ey - 26;
    const P = face === 'sad' ? [[x - s * 12, y - 6], [x + s * 10, y + 3]] : spline([[x - 11, y - 2], [x, y - 9], [x + 11, y - 2]], false, 5);
    ink(ctx, P, 4, { taper: true, color: col });
  }
}
function mouth(ctx, face, y, open = 0) {
  if (face === 'happy') {
    S(ctx, spline([[-16, y - 6], [16, y - 6], [11, y + 7], [0, y + 11], [-11, y + 7]], true, 6), { fill: PAL.ink, line: 0, grain: 0, off: [0, 0] });
    ctx.fillStyle = PINK; ctx.beginPath(); ctx.ellipse(0, y + 6, 7, 4, 0, 0, TAU); ctx.fill();
  } else if (face === 'talk') {
    const o = Math.max(0, Math.min(1, open));
    if (o < 0.12) { ink(ctx, spline([[-14, y - 4], [0, y + 4], [14, y - 4]], false, 6), 4, { taper: true }); return; }
    const h = 4 + o * 12;
    S(ctx, spline([[-15, y - 5], [15, y - 5], [10, y - 5 + h * 0.8], [0, y - 5 + h], [-10, y - 5 + h * 0.8]], true, 6), { fill: PAL.ink, line: 0, grain: 0, off: [0, 0] });
    if (o > 0.4) { ctx.fillStyle = PINK; ctx.beginPath(); ctx.ellipse(0, y - 5 + h * 0.75, 6, 3, 0, 0, TAU); ctx.fill(); }
  } else if (face === 'wow') {
    ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.ellipse(0, y + 2, 8, 11, 0, 0, TAU); ctx.fill();
  } else if (face === 'sad') {
    ink(ctx, spline([[-13, y + 4], [0, y - 3], [13, y + 4]], false, 6), 4, { taper: true });
  } else ink(ctx, spline([[-14, y - 4], [0, y + 4], [14, y - 4]], false, 6), 4, { taper: true });
}
function cheeks(ctx, y = -198, dx = 50) {
  ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = PINK;
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * dx, y, 13, 8, 0, 0, TAU); ctx.fill(); }
  ctx.restore();
}

// ---------- one character ----------
export function drawCharacter(ctx, id, pose = {}) {
  const c = CAST[id], k = c.kind, bw = c.bw || 1, face = pose.face || 'smile';
  const sd = id.charCodeAt(0) * 37 + id.length * 11;
  const owl = k === 'owl';
  const top = owl ? -162 : -150;
  const bodyPts = owl
    ? spline([[-62, -162], [62, -162], [80, -84], [66, -22], [-66, -22], [-80, -84]], true, 8)
    : spline([[-52, -150], [52, -150], [66, -80], [62, -22], [-62, -22], [-66, -80]].map(([x, y]) => [x * bw, y]), true, 8);

  // --- behind the body ---
  if (k === 'squirrel') S(ctx, spline([[40, -40], [112, -72], [152, -164], [140, -252], [96, -292], [58, -272], [92, -232], [100, -162], [70, -102], [30, -82]], true, 8),
    { fill: c.fur, line: 4, seed: sd + 1, shade: [{ pts: E(118, -190, 22, 70, -0.2), color: c.furL, alpha: 0.9 }] });
  if (k === 'cat') { const P = spline([[-50, -40], [-112, -62], [-132, -132], [-106, -186], [-124, -210]], false, 8); ink(ctx, P, 24, { taper: false, seed: sd }); ink(ctx, move(P, 3, 2), 15, { taper: false, color: c.fur, seed: sd + 2 }); }
  if (k === 'tiger') {
    const P = spline([[-70, -40], [-130, -56], [-150, -120], [-128, -160]], false, 8);
    ink(ctx, P, 26, { taper: false, seed: sd }); ink(ctx, move(P, 3, 2), 17, { taper: false, color: c.fur, seed: sd + 2 });
    for (const u of [[-122, -58], [-146, -100], [-142, -142]]) ink(ctx, [[u[0] - 8, u[1] - 8], [u[0] + 8, u[1] + 8]], 5, { taper: true });
  }
  if (k === 'rabbit') S(ctx, E(-64, -50, 20, 20), { fill: c.fur, line: 3.5, seed: sd + 3 });
  if (k === 'bear') S(ctx, E(58, -44, 15, 15), { fill: c.fur, line: 3.5, seed: sd + 3 });

  // --- feet + body ---
  for (const s of [-1, 1]) {
    const kick = (s === 1 ? pose.kickR : pose.kickL) || 0;
    const lift = pose.step !== undefined ? Math.max(0, Math.sin(pose.step * Math.PI * 2 + (s === 1 ? 0 : Math.PI))) * 10 : 0;
    S(ctx, E(s * (30 * bw + kick * 34), -10 - kick * 16 - lift, 30, 14, -s * kick * 0.35), { fill: c.furD, line: 3.5, seed: sd + 10 + s });
  }
  S(ctx, bodyPts, { fill: c.shirt || c.fur, line: 4.5, seed: sd + 12 });
  if (k === 'squirrel') S(ctx, E(0, -80, 36, 46), { fill: CREAM, line: 0, grain: 0.15, seed: sd + 13 });
  if (owl) {
    S(ctx, spline([[-42, -156], [42, -156], [52, -46], [0, -32], [-52, -46]], true, 6), { fill: c.vest, line: 3.5, seed: sd + 14 });
    for (const y of [-120, -88, -56]) S(ctx, E(0, y, 6, 6), { fill: PAL.mustard, line: 2, seed: sd + y });
  }
  if (c.shirt) ink(ctx, spline([[-26, top + 4], [0, top + 22], [26, top + 4]], false, 6), 3.5, { seed: sd + 15 });
  if (k === 'tiger') { // overall straps + pocket
    for (const s of [-1, 1]) S(ctx, rrect(s * 34 - 9, -150, 18, 64, 6), { fill: '#2E8A84', line: 3, seed: sd + 16 + s });
    S(ctx, rrect(-30, -96, 60, 40, 8), { fill: '#2E8A84', line: 3, seed: sd + 18 });
  }
  if (k === 'goat') { // bow tie
    S(ctx, [[0, -110], [-24, -123], [-24, -97]], { fill: c.tie, line: 3, seed: sd + 16 });
    S(ctx, [[0, -110], [24, -123], [24, -97]], { fill: c.tie, line: 3, seed: sd + 17 });
    S(ctx, E(0, -110, 7, 7), { fill: PAL.coralD, line: 2.5, seed: sd + 18 });
  }
  if (k === 'rabbit' && !pose.noScarf) {
    S(ctx, rrect(-58, -164, 116, 30, 13), { fill: c.scarf, line: 4, seed: sd + 16 });
    S(ctx, [[20, -140], [46, -140], [54, -88], [30, -92]], { fill: c.scarf, line: 3.5, seed: sd + 17 });
  }

  arms(ctx, c, pose, top, sd);

  // --- ears / crown / horns behind the head ---
  if (k === 'rabbit') for (const s of [-1, 1]) {
    S(ctx, E(s * 30, -330, 22, 74, s * 0.12), { fill: c.fur, line: 4, seed: sd + 20 + s });
    S(ctx, E(s * 30, -326, 10, 54, s * 0.12), { fill: PINK, line: 0, grain: 0.1, seed: sd + 22 + s });
  }
  if (k === 'bear' || k === 'tiger') for (const s of [-1, 1]) {
    const ex = k === 'tiger' ? 66 : 58;
    S(ctx, E(s * ex, -276, 27, 27), { fill: c.fur, line: 4, seed: sd + 20 + s });
    S(ctx, E(s * ex, -276, 13, 13), { fill: c.furL, line: 0, seed: sd + 22 + s });
  }
  if (k === 'squirrel') for (const s of [-1, 1]) {
    S(ctx, tri([[30, -266], [56, -322], [72, -256]], s), { fill: c.fur, line: 4, seed: sd + 20 + s });
    S(ctx, tri([[42, -268], [56, -304], [64, -262]], s), { fill: PINK, line: 0, seed: sd + 22 + s });
  }
  if (k === 'cat') for (const s of [-1, 1]) {
    S(ctx, tri([[20, -262], [60, -322], [78, -240]], s), { fill: c.fur, line: 4, seed: sd + 20 + s });
    S(ctx, tri([[34, -262], [58, -304], [68, -250]], s), { fill: PINK, line: 0, seed: sd + 22 + s });
  }
  if (k === 'hedgehog') {
    const P = [], cy = -214;
    for (let i = 0; i <= 22; i++) { const a = Math.PI * 0.9 + i / 22 * Math.PI * 1.2, r = i % 2 ? 98 : 124; P.push([Math.cos(a) * r, cy + Math.sin(a) * r]); }
    P.push([66, -168], [-66, -168]);
    S(ctx, spline(P, true, 5), { fill: c.spike, line: 4, seed: sd + 20, breaks: 0.08 });
  }
  if (owl) for (const s of [-1, 1]) S(ctx, tri([[60, -286], [80, -312], [92, -270]], s), { fill: c.furD, line: 3.5, seed: sd + 20 + s });
  if (k === 'goat') for (const s of [-1, 1]) {
    S(ctx, spline(tri([[26, -284], [44, -330], [84, -346], [102, -320], [80, -326], [56, -312], [48, -276]], s), true, 5), { fill: c.horn, line: 4, seed: sd + 20 + s });
    S(ctx, E(s * 92, -238, 34, 13, s * 0.35), { fill: c.fur, line: 4, seed: sd + 24 + s });
    S(ctx, E(s * 94, -238, 20, 6, s * 0.35), { fill: PINK, line: 0, seed: sd + 26 + s });
  }

  // --- head ---
  const hd = owl ? [0, -230, 92, 78] : k === 'bear' ? [0, -218, 84, 72] : k === 'tiger' ? [0, -220, 94, 76]
    : k === 'hedgehog' ? [0, -212, 80, 68] : k === 'goat' ? [0, -224, 72, 80] : [0, -218, 80, 70];
  S(ctx, E(...hd), { fill: c.fur, line: 4.5, seed: sd + 30 });
  if (k === 'goat') S(ctx, spline([[-20, -150], [20, -150], [8, -130], [0, -124], [-8, -130]], true, 6), { fill: PAL.white, line: 3.5, seed: sd + 33 });

  // --- face ---
  let ex = 27, ey = -226, mouthY = -180, cheekY = -198;
  if (k === 'bear') S(ctx, E(0, -194, 38, 28), { fill: c.furL, line: 3, seed: sd + 31 });
  if (k === 'squirrel') S(ctx, E(0, -194, 36, 25), { fill: CREAM, line: 0, seed: sd + 31 });
  if (k === 'cat') S(ctx, E(0, -194, 32, 22), { fill: c.furL, line: 0, seed: sd + 31 });
  if (k === 'hedgehog') S(ctx, E(0, -196, 40, 30), { fill: '#EED6B6', line: 0, seed: sd + 31 });
  if (k === 'goat') { S(ctx, E(0, -186, 40, 32), { fill: '#F7F1E6', line: 3, seed: sd + 31 }); ey = -236; mouthY = -172; cheekY = -206; }
  if (k === 'tiger') {
    for (const s of [-1, 1]) S(ctx, E(s * 24, -192, 30, 24), { fill: c.furL, line: 0, seed: sd + 31 + s });
    for (const dx of [-18, 0, 18]) ink(ctx, [[dx, -292], [dx * 0.6, -262]], 7, { taper: true, seed: sd + 34 + dx });
    for (const s of [-1, 1]) for (const dy of [-12, 8]) ink(ctx, [[s * 94, -222 + dy], [s * 66, -218 + dy * 0.6]], 6, { taper: true, seed: sd + 40 + dy + s });
    ex = 30;
  }
  if (owl) { for (const s of [-1, 1]) S(ctx, E(s * 33, -234, 36, 36), { fill: CREAM, line: 3, seed: sd + 32 + s }); ex = 33; ey = -234; }

  eyes(ctx, c, pose, ex, ey, owl);
  brows(ctx, c, face, ex, ey);
  if (!owl && k !== 'cat') cheeks(ctx, cheekY, k === 'tiger' ? 58 : 50);

  if (k === 'rabbit' || k === 'cat' || k === 'goat') S(ctx, [[-9, mouthY - 24], [9, mouthY - 24], [0, mouthY - 14]], { fill: PINK, line: 2.5, seed: sd + 40 });
  if (k === 'bear' || k === 'tiger') S(ctx, E(0, -206, 13, 9), { fill: k === 'tiger' ? PINK : PAL.ink, line: k === 'tiger' ? 2.5 : 0, grain: 0, seed: sd + 40 });
  if (k === 'squirrel') S(ctx, E(0, -205, 8, 6), { fill: PAL.ink, line: 0, grain: 0, seed: sd + 40 });
  if (k === 'hedgehog') S(ctx, E(0, -208, 11, 9), { fill: PAL.ink, line: 0, grain: 0, seed: sd + 40 });
  if (k === 'cat' || k === 'tiger') for (const s of [-1, 1]) {
    const col = k === 'cat' ? '#E9DFCC' : PAL.ink;
    ink(ctx, [[s * 38, -198], [s * 92, -206]], 2.5, { taper: true, color: col, seed: sd + 41 + s });
    ink(ctx, [[s * 38, -189], [s * 90, -184]], 2.5, { taper: true, color: col, seed: sd + 43 + s });
  }
  if (owl) {
    for (const s of [-1, 1]) ink(ctx, E(s * 33, -234, 27, 27), 4, { closed: true, breaks: 0.1, seed: sd + 45 + s });
    ink(ctx, spline([[-8, -238], [0, -244], [8, -238]], false, 4), 3.5);
    S(ctx, face === 'wow' ? [[-11, -208], [11, -208], [8, -190], [0, -184], [-8, -190]] : [[-11, -208], [11, -208], [0, -184]], { fill: PAL.mustard, line: 3, seed: sd + 47 });
  } else mouth(ctx, face, k === 'bear' ? -178 : mouthY, pose.open || 0);

  if (k === 'squirrel') {
    S(ctx, [[0, -290], [-30, -312], [-28, -268]], { fill: c.bow, line: 3.5, seed: sd + 50 });
    S(ctx, [[0, -290], [30, -312], [28, -268]], { fill: c.bow, line: 3.5, seed: sd + 51 });
    S(ctx, E(0, -290, 10, 10), { fill: PAL.coral, line: 3, seed: sd + 52 });
  }
}
