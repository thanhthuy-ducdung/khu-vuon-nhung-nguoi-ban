// Episode "Chiec banh cuoi cung" - Mid-century Cartoon style, timed to voice.mp3 (47 sentences).
// Scene 1: picnic table in the garden. Scene 2 (end): the playground. Camera never moves.
import {
  PAL, shape, ink, plane, ellipse, spline, rrect, rect, TAU, seg, ss, back, twos, lerp,
  setClock, rays, sparkle, kidney, text, measure, fit, paperFinish,
} from '../../engine/toon.js';
import { icon } from '../../engine/icons.js';
import { CAST, drawCharacter, handPos } from '../../characters.js';

const W = 1920, H = 1080, GROUND = 880, SC = 1.15, FPS = 24;
const E = (cx, cy, rx, ry, rot = 0, n = 40) => ellipse(cx, cy, rx, ry, n, 0, TAU, rot);
const S_ = (ctx, pts, o) => shape(ctx, pts, { line: 4, grain: 0.3, breaks: 0.12, ...o });
const TABLE_Y = 724, BOX = { x: 1112, y: TABLE_Y - 4 };
const POS = { tho: 600, soc: 930, ho: 1295 };

let SEN = [], ENV = [], SUB = [];
const st = n => SEN[n - 1][0], en = n => SEN[n - 1][1];
export let DUR = 184;
export function setup(s, e, subs) { SEN = s; ENV = e; SUB = subs; DUR = st(47) - 0.3 + 7.4; }
const pulse = (t, a, b, r = 0.25) => ss(seg(t, a, a + r)) * (1 - ss(seg(t, b - r, b)));
const inWin = (t, a, b) => t >= a && t < b;
const sceneB = () => st(44) + 2.4;   // switch to the playground

// ---------- backgrounds ----------
function sky(ctx) {
  ctx.fillStyle = PAL.paper; ctx.fillRect(0, 0, W, H);
  plane(ctx, rect(0, 0, W, 700), '#BFD3E3');
  rays(ctx, 1500, 130, 28, 140, PAL.mustardL, { alpha: 0.45, r0: 64 });
  S_(ctx, E(1500, 130, 56, 56), { fill: PAL.mustard, line: 3.5, seed: 3 });
  plane(ctx, kidney(420, 130, 90, 0.1), PAL.white, { grain: 0.15 });
  plane(ctx, kidney(960, 80, 64, -0.15), PAL.white, { grain: 0.15 });
}
function flowers(ctx, list) {
  list.forEach(([x, y, c], i) => {
    for (let k = 0; k < 5; k++) { const a = k * TAU / 5; S_(ctx, E(x + Math.cos(a) * 10, y + Math.sin(a) * 10, 8, 8), { fill: c, line: 0, grain: 0.1, seed: 120 + i * 7 + k }); }
    S_(ctx, E(x, y, 5, 5), { fill: PAL.white, line: 0, grain: 0, seed: 150 + i });
  });
}
function picnicGarden(ctx) {
  sky(ctx);
  plane(ctx, E(300, 720, 520, 120), '#B5C27A');
  plane(ctx, E(1500, 730, 640, 140), '#A9B86C');
  plane(ctx, rect(0, 700, W, H - 700), '#D3D69C');
  ink(ctx, [[0, 702], [W, 702]], 4, { breaks: 0.25, seed: 21 });
  // tree on the left, hedge on the right
  S_(ctx, [[230, 880], [270, 880], [266, 430], [234, 430]], { fill: PAL.brown, line: 4, seed: 40 });
  S_(ctx, E(250, 360, 170, 160), { fill: PAL.avocado, line: 4, seed: 42, shade: [{ pts: E(290, 410, 130, 110), color: PAL.avocadoD, alpha: 0.35 }] });
  S_(ctx, kidney(1700, 760, 170, 0), { fill: '#7E9A4C', line: 4, seed: 44 });
  flowers(ctx, [[1620, 735, PAL.coral], [1700, 715, PAL.mustard], [1780, 745, PAL.pink], [470, 1010, PAL.coral], [1500, 1030, PAL.teal]]);
}
function picnicTable(ctx) {
  // legs, cloth top, cloth drape with a checked border
  for (const x of [560, 1360]) S_(ctx, rect(x - 14, TABLE_Y + 70, 28, 120), { fill: PAL.brown, line: 3.5, seed: 500 + x });
  S_(ctx, rect(470, TABLE_Y, 980, 18), { fill: PAL.white, line: 4, seed: 510 });
  S_(ctx, [[470, TABLE_Y + 16], [1450, TABLE_Y + 16], [1460, TABLE_Y + 84], [460, TABLE_Y + 84]], { fill: PAL.white, line: 4, seed: 511 });
  ctx.save(); ctx.beginPath(); ctx.rect(460, TABLE_Y + 18, 1000, 64); ctx.clip();
  for (let c = 0; c < 32; c++) for (let r = 0; r < 2; r++) if ((c + r) % 2 === 0) { ctx.fillStyle = PAL.coral; ctx.globalAlpha = 0.85; ctx.fillRect(460 + c * 32, TABLE_Y + 18 + r * 32, 32, 32); }
  ctx.restore();
}
function playground(ctx) {
  sky(ctx);
  plane(ctx, E(400, 720, 600, 120), '#B5C27A');
  plane(ctx, rect(0, 700, W, H - 700), '#D9CFA0');
  ink(ctx, [[0, 702], [W, 702]], 4, { breaks: 0.25, seed: 22 });
  // slide (left): ladder + coral chute
  for (const x of [190, 250]) S_(ctx, rect(x, 470, 14, 380), { fill: PAL.teal, line: 3.5, seed: 600 + x });
  for (let i = 0; i < 6; i++) S_(ctx, rect(190, 520 + i * 60, 74, 10), { fill: PAL.tealD, line: 2.5, seed: 610 + i });
  S_(ctx, rect(180, 458, 110, 22), { fill: PAL.mustard, line: 3.5, seed: 620 });
  S_(ctx, spline([[280, 470], [330, 500], [420, 720], [500, 840], [470, 860], [390, 740], [300, 520], [270, 490]], true, 6), { fill: PAL.coral, line: 4, seed: 621 });
  // swing set (right): A-frame + two swings
  for (const [a, b] of [[[1480, 860], [1540, 470]], [[1600, 860], [1540, 470]], [[1760, 860], [1820, 470]], [[1880, 860], [1820, 470]]]) ink(ctx, [a, b], 16, { color: PAL.plum, taper: false, seed: a[0] });
  ink(ctx, [[1530, 470], [1830, 470]], 18, { color: PAL.plum, taper: false });
  for (const x of [1610, 1740]) { ink(ctx, [[x - 30, 476], [x - 30, 720]], 3); ink(ctx, [[x + 30, 476], [x + 30, 720]], 3); S_(ctx, rrect(x - 44, 716, 88, 18, 6), { fill: PAL.mustard, line: 3, seed: 630 + x }); }
  // sandbox
  S_(ctx, [[560, 940], [860, 940], [880, 1010], [540, 1010]], { fill: PAL.kraftL, line: 4, seed: 640 });
  S_(ctx, E(700, 958, 26, 14), { fill: PAL.coral, line: 3, seed: 641 });
  flowers(ctx, [[1100, 1030, PAL.coral], [1350, 1010, PAL.mustard], [980, 1045, PAL.teal]]);
}

// ---------- props ----------
function cake(ctx, x, y, s = 1, part = 1, seed = 1) {
  if (s <= 0.02) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (part < 1) { ctx.beginPath(); ctx.rect(-40, -40, 80 * part, 80); ctx.clip(); }
  S_(ctx, rrect(-24, -10, 48, 26, 8), { fill: PAL.kraft, line: 3.5, seed });
  S_(ctx, spline([[-26, -6], [-14, -20], [0, -24], [14, -20], [26, -6], [12, -2], [0, -6], [-12, -2]], true, 4), { fill: PAL.coralL, line: 3, seed: seed + 1 });
  S_(ctx, [[0, -24], [-7, -38], [7, -36]], { fill: PAL.avocado, line: 2.5, seed: seed + 2 });
  ctx.restore();
}
function box(ctx, t, n) {
  const open = ss(seg(t, st(5) + 0.2, st(5) + 1.0)) * (1 - ss(seg(t, st(43) + 0.3, st(43) + 1.3)));
  const { x, y } = BOX;
  // lid stands up behind the box when open
  if (open > 0.02) S_(ctx, [[x - 84, y - 50], [x + 84, y - 50], [x + 84, y - 50 - 50 * open], [x - 84, y - 50 - 50 * open]], { fill: PAL.kraftL, line: 4, seed: 701 });
  const cakes = [[-48, -56], [-16, -60], [16, -60], [48, -56]];
  for (let i = 0; i < n; i++) if (open > 0.5) cake(ctx, x + cakes[i][0], y + cakes[i][1], 0.95, 1, 720 + i * 3);
  S_(ctx, rect(x - 84, y - 50, 168, 50), { fill: PAL.kraft, line: 4, seed: 700 });
  S_(ctx, rect(x - 84, y - 50, 168, 12), { fill: PAL.kraftD, line: 0, seed: 702, off: [0, 0] });
  if (open < 0.98) S_(ctx, [[x - 90, y - 50], [x + 90, y - 50], [x + 90, y - 50 - 14 * (1 - open)], [x - 90, y - 50 - 14 * (1 - open)]], { fill: PAL.kraftL, line: 4, seed: 703 });
  if (open < 0.3) { ink(ctx, [[x, y - 64], [x, y]], 6, { color: PAL.coral, taper: false }); }
}
function handWorld(id, side, name, k, t) {
  const p = handPos(CAST[id], side, name, k), s = (CAST[id].s || 1) * SC;
  return [POS[id] + p[0] * s, GROUND - (id === 'tho' ? carryLift(t) : 0) + p[1] * s];
}
const carryLift = () => 0;

// ---------- speech ----------
const DIALOGUE = { 3: ['tho'], 6: ['soc'], 10: ['soc'], 12: ['ho'], 14: ['soc'], 15: ['ho'], 18: ['tho'], 20: ['soc'], 22: ['ho'], 24: ['tho'], 26: ['ho'],
  30: ['soc'], 32: ['ho'], 34: ['soc'], 36: ['ho'], 40: ['ho'], 42: ['soc'], 46: ['soc', 'ho'] };
function speaking(t, id) {
  for (const [n, who] of Object.entries(DIALOGUE)) if (who.includes(id) && t >= st(+n) - 0.05 && t <= en(+n) + 0.05) return ENV[Math.floor(t * FPS)] || 0;
  return null;
}
const chew = t => 0.25 + 0.35 * Math.max(0, Math.sin(t * 14));

// x positions: Thỏ walks in carrying the box, the other two run in
function posX(id, t) {
  if (t >= sceneB()) return { tho: 760, soc: 980, ho: 1220 }[id];
  if (id === 'tho') return lerp(-200, POS.tho, ss(seg(t, st(2) + 0.4, st(2) + 3.2)));
  const a = st(4) + 0.1, b = en(4) + 0.2;
  return lerp(id === 'soc' ? -200 : 2140, POS[id], ss(seg(t, a, b)));
}

function poseFor(id, t) {
  const p = { face: 'smile', blink: ((t + { tho: 0, soc: 1.3, ho: 2.1 }[id]) / 3.4) % 1 < 0.035 };
  const W_ = (a, b) => inWin(t, a, b);
  if (W_(st(5), en(8))) p.face = 'happy';
  if (id === 'soc' && W_(st(9), en(9) + 0.3)) p.face = 'wow';
  if ((id === 'soc' || id === 'ho') && W_(st(13), en(16) + 0.2)) p.face = 'sad';
  if (id === 'tho' && W_(st(13), en(16))) p.face = 'wow';
  if (id === 'ho' && W_(st(31), en(31) + 0.3)) p.face = 'wow';
  if (t >= st(33)) p.face = 'happy';
  if (id === 'tho' && W_(st(23), en(24))) p.face = 'happy';
  // eating: chewing mouth
  const eat1 = W_(st(7) + 0.9, st(8) + 1.6), eat2 = (id !== 'tho') && W_(st(37) + 0.6, en(38) - 0.4);
  if (eat1 || eat2) { p.face = 'talk'; p.open = chew(t); }
  const sp = speaking(t, id);
  if (sp !== null) { p.face = 'talk'; p.open = sp; }
  // arms (scene A)
  if (t < sceneB()) {
    if (id === 'tho') {
      const carry = t < st(5) + 0.2 ? 1 : 0; if (carry && t > st(2)) { p.armL = ['hold', 1]; p.armR = ['hold', 1]; }
      const reachBox = pulse(t, st(5), st(5) + 1.3, 0.3); if (reachBox > 0) p.armR = ['tableFar', reachBox];
      const close = pulse(t, st(43), st(43) + 1.6, 0.3); if (close > 0) p.armR = ['tableFar', close];
      const wave = pulse(t, st(3), en(3) + 0.2); if (wave > 0) { p.wave = wave; p.wob = Math.sin(t * 12) * 0.3; }
    }
    if (eat1) p.armR = id === 'tho' ? ['eat', pulse(t, st(7) + 0.6, st(8) + 1.8, 0.35)] : p.armR;
    if (eat1 && id === 'soc') p.armL = ['eat', pulse(t, st(7) + 0.6, st(8) + 1.8, 0.35)];
    if (eat1 && id === 'ho') p.armL = ['eat', pulse(t, st(7) + 0.6, st(8) + 1.8, 0.35)];
    if (id === 'soc') {
      const grab = pulse(t, st(11), en(16) + 0.3, 0.35); if (grab > 0) p.armR = ['tableFar', grab];
      const brk = pulse(t, st(27), en(29) + 0.3, 0.35); if (brk > 0) { p.armR = ['table', brk]; p.armL = ['table', brk]; }
      const give = pulse(t, st(29) + 0.2, en(29) + 0.4, 0.4); if (give > 0) p.armR = ['tableFar', give];
      if (eat2) p.armL = ['eat', pulse(t, st(37) + 0.3, en(38) - 0.2, 0.35)];
      const bulb = W_(st(19), en(20)); if (bulb) p.face = sp !== null ? 'talk' : 'smile';
    }
    if (id === 'ho') {
      const grab = pulse(t, st(11) + 1.6, en(16) + 0.3, 0.35); if (grab > 0) p.armL = ['tableFar', grab];
      const take = pulse(t, en(29) - 0.4, st(37) + 0.6, 0.35); if (take > 0) p.armL = ['table', take];
      if (eat2) p.armL = ['eat', pulse(t, st(37) + 0.3, en(38) - 0.2, 0.35)];
    }
  } else {
    const hands = pulse(t, sceneB(), DUR + 1, 0.4);
    if (id === 'tho') p.armR = ['side', hands];
    if (id === 'soc') { p.armL = ['side', hands]; p.armR = ['side', hands]; }
    if (id === 'ho') p.armL = ['side', hands];
  }
  return p;
}

function drawFriend(ctx, id, t) {
  const x = posX(id, t), dx = posX(id, t + 0.05) - posX(id, t - 0.05);
  const p = poseFor(id, t);
  if (Math.abs(dx) > 1.2) p.step = t * 4;
  let rot = 0, lift = 0;
  if (id === 'ho' && inWin(t, st(25), en(25) + 0.4)) lift = -6 * Math.abs(Math.sin((t - st(25)) * 8));   // nod
  if (id === 'soc' && inWin(t, st(41), en(41) + 0.4)) lift = -6 * Math.abs(Math.sin((t - st(41)) * 8));
  if ((id === 'soc' || id === 'ho') && inWin(t, st(13), en(16))) rot = Math.sin(t * 9) * 0.025;            // tug
  const s = (CAST[id].s || 1) * SC;
  ctx.save(); ctx.translate(x, GROUND - lift); ctx.rotate(rot); ctx.scale(s, s); drawCharacter(ctx, id, p); ctx.restore();
}

// cakes in hands, the last cake, the halves
function cakesInPlay(ctx, t) {
  const eaters = [['tho', 1], ['soc', -1], ['ho', -1]];
  // first round: one cake each, from box to mouth, getting smaller
  if (inWin(t, st(7) + 0.6, st(8) + 1.8)) eaters.forEach(([id, side], i) => {
    const k = pulse(t, st(7) + 0.6, st(8) + 1.8, 0.35), h = handWorld(id, side, 'eat', k, t);
    const left = 1 - seg(t, st(7) + 1.2, st(8) + 1.4);
    cake(ctx, h[0] + side * 4, h[1] - 8, 0.9, Math.max(0.15, left), 760 + i * 3);
  });
  // the last cake: in the box until it is broken
  const brk0 = st(27) + 0.6, split = st(27) + 2.6;
  if (t >= brk0 && t < split + 0.1) {
    const u = ss(seg(t, brk0, brk0 + 0.6)), x = lerp(BOX.x + 16, 1010, u), y = lerp(BOX.y - 60, TABLE_Y - 60, u);
    cake(ctx, x, y, lerp(0.95, 1.25, u), 1, 790);
  }
  if (t >= split) {
    const sep = ss(seg(t, split, split + 0.5));
    const give0 = st(29) + 0.6, give1 = en(29) - 0.3;
    const g = ss(seg(t, give0, give1));
    const bigX = lerp(1010 + 18 + 22 * sep, handWorld('ho', -1, 'table', 1, t)[0] + 6, g), bigY = lerp(TABLE_Y - 60, TABLE_Y - 40, g);
    const smallX = 1010 - 18 - 22 * sep, smallY = TABLE_Y - 60;
    const e2 = seg(t, st(37) + 0.6, en(38) - 0.6);
    if (t < st(37) + 0.3) {
      cake(ctx, bigX, bigY, 1.25, 1, 800);                       // big piece (whole width, offset)
      ctx.save(); ctx.beginPath(); ctx.rect(smallX - 40, 0, 40, H); ctx.clip(); cake(ctx, smallX + 8, smallY, 1.0, 1, 803); ctx.restore();
    } else {
      const hs = handWorld('soc', -1, 'eat', pulse(t, st(37) + 0.3, en(38) - 0.2, 0.35), t), hh = handWorld('ho', -1, 'eat', pulse(t, st(37) + 0.3, en(38) - 0.2, 0.35), t);
      cake(ctx, hh[0] - 4, hh[1] - 8, 1.0, Math.max(0, 1 - e2), 806);
      cake(ctx, hs[0] - 4, hs[1] - 8, 0.75, Math.max(0, 1 - e2), 809);
    }
  }
}

function cakesInBox(t) {
  if (t < st(7) + 0.6) return 4;
  if (t < st(27) + 0.6) return 1;
  return 0;
}

// ---------- title, lesson, subtitles ----------
function titleCard(ctx, t) {
  ctx.fillStyle = PAL.paper; ctx.fillRect(0, 0, W, H);
  rays(ctx, W / 2, 500, 32, 900, PAL.mustardL, { alpha: 0.35 });
  const k = back(seg(t, 0.15, 0.55));
  text(ctx, 'CÂU CHUYỆN', W / 2, 330, { font: '600 42px Baloo', align: 'center', fill: PAL.inkSoft, track: 10, alpha: ss(seg(t, 0.1, 0.5)) });
  ctx.save(); ctx.translate(W / 2, 500); ctx.scale(k, k);
  text(ctx, 'Chiếc bánh cuối cùng', 0, 40, { font: '128px Lobster', align: 'center', fill: PAL.ink, plate: PAL.coral, off: [5, 4] });
  ctx.restore();
  cake(ctx, W / 2, 680, 2.2 * back(seg(t, 0.45, 0.8)), 1, 990);
}
function lesson(ctx, t) {
  const k = pulse(t, st(47) - 0.1, DUR + 1, 0.35);
  if (k <= 0) return;
  ctx.save(); ctx.translate(W / 2, 250); const b = back(Math.min(1, seg(t, st(47) + 1.0, st(47) + 1.4))); ctx.scale(b, b);
  const str = 'Chia sẻ thì vui hơn!', font = '96px Lobster', w = measure(ctx, str, font) + 110;
  S_(ctx, rrect(-w / 2, -80, w, 150, 36), { fill: PAL.white, line: 5, seed: 990 });
  text(ctx, str, 0, 30, { font, align: 'center', fill: PAL.ink, plate: PAL.coral, off: [4, 3] });
  ctx.restore();
  sparkle(ctx, 420, 220, 30 * k, { fill: PAL.mustard }); sparkle(ctx, 1500, 200, 26 * k, { fill: PAL.mustard });
}
function subtitle(ctx, t) {
  let idx = -1;
  for (let i = 0; i < SEN.length; i++) if (t >= SEN[i][0] - 0.1 && t <= SEN[i][1] + 0.35) idx = i;
  if (idx < 0) return;
  const k = Math.min(ss(seg(t, SEN[idx][0] - 0.1, SEN[idx][0] + 0.1)), 1 - ss(seg(t, SEN[idx][1] + 0.2, SEN[idx][1] + 0.35)));
  const F = fit(ctx, SUB[idx], '700 {px}px Baloo', 46, 1500, 2, 38);
  const lh = F.px * 1.18, n = F.lines.length, w = Math.max(...F.lines.map(l => measure(ctx, l, F.font))) + 64, h = n * lh + 26;
  ctx.save(); ctx.globalAlpha = k;
  ctx.fillStyle = 'rgba(43,36,32,0.86)'; ctx.beginPath(); ctx.roundRect(W / 2 - w / 2, H - 40 - h, w, h, 18); ctx.fill();
  F.lines.forEach((l, i) => text(ctx, l, W / 2, H - 40 - h + 13 + lh * (i + 0.8), { font: F.font, align: 'center', fill: '#FFF6DF', plate: null }));
  ctx.restore();
}
function wipe(ctx, p) {
  const x0 = -W * 0.1 + p * W * 2.6;
  S_(ctx, [[x0 - W * 1.3, 0], [x0, 0], [x0 - 120, H], [x0 - W * 1.3 - 120, H]], { fill: PAL.mustardL, line: 5, seed: 900, off: [0, 0] });
}

export function renderFilm(ctx, t) {
  setClock(t);
  const tt = twos(t), w0 = en(1) + 0.15, w1 = st(2) - 0.2, b = sceneB(), wb0 = b - 0.7, wb1 = b + 0.7;
  if (tt < (w0 + w1) / 2) titleCard(ctx, tt);
  else if (tt < b) {
    picnicGarden(ctx);
    for (const id of ['tho', 'soc', 'ho']) drawFriend(ctx, id, tt);
    picnicTable(ctx);
    if (tt >= st(2) && tt < st(5) + 0.2) {   // Thỏ carries the closed box in
      const x = posX('tho', tt) + 10, y = GROUND - 80 * SC;
      if (tt < en(4) + 0.6) { ctx.save(); ctx.translate(x - BOX.x, y - BOX.y - 20); box(ctx, tt, 4); ctx.restore(); }
      else { const u = ss(seg(tt, en(4) + 0.6, st(5) + 0.1)); ctx.save(); ctx.translate(lerp(x - BOX.x, 0, u), lerp(y - BOX.y - 20, 0, u)); box(ctx, tt, 4); ctx.restore(); }
    } else if (tt >= st(5) + 0.2) {
      const tug = inWin(tt, st(13), en(16)) ? Math.sin(tt * 18) * 5 : 0;
      ctx.save(); ctx.translate(tug, 0); box(ctx, tt, cakesInBox(tt)); ctx.restore();
    }
    cakesInPlay(ctx, tt);
    // idea bulb for Sóc
    const idea = pulse(tt, st(19) + 0.4, en(20) + 0.3, 0.25);
    if (idea > 0) { ctx.save(); ctx.translate(POS.soc + 90, GROUND - 520); ctx.scale(back(Math.min(1, idea * 1.2)), back(Math.min(1, idea * 1.2))); rays(ctx, 0, 0, 16, 70, PAL.mustardL, { alpha: 0.6 * idea, r0: 30 }); icon(ctx, 'bulb', 0, 0, 90, {}); ctx.restore(); }
  } else {
    playground(ctx);
    for (const id of ['tho', 'soc', 'ho']) drawFriend(ctx, id, tt);
    if (tt >= st(47) - 0.2) rays(ctx, W / 2, 250, 30, 600, PAL.white, { alpha: 0.25 * pulse(tt, st(47) - 0.2, DUR + 1, 0.4), r0: 120 });
    lesson(ctx, tt);
  }
  if (tt > w0 && tt < w1) wipe(ctx, seg(tt, w0, w1));
  if (tt > wb0 && tt < wb1) wipe(ctx, seg(tt, wb0, wb1));
  subtitle(ctx, t);
  paperFinish(ctx, W, H);
}
