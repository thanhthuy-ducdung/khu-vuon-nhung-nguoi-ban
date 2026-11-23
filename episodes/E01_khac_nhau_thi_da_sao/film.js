// Episode "Khac nhau thi da sao?" - Mid-century Cartoon style, timed to voice.mp3 (49 sentences).
// One fixed garden stage (race track, tall tree, pond); camera never moves. English subtitles burned in.
import {
  PAL, shape, ink, plane, ellipse, spline, rrect, rect, TAU, seg, ss, back, twos, clamp, lerp,
  setClock, rays, sparkle, kidney, text, measure, fit, paperFinish,
} from '../../engine/toon.js';
import { CAST, drawCharacter, handPos } from '../../characters.js';

const W = 1920, H = 1080, GROUND = 880, SC = 1.15, FPS = 24, BALL_R = 30, WATER_Y = 905;
const E = (cx, cy, rx, ry, rot = 0, n = 40) => ellipse(cx, cy, rx, ry, n, 0, TAU, rot);
const S_ = (ctx, pts, o) => shape(ctx, pts, { line: 4, grain: 0.3, breaks: 0.12, ...o });
const POND = { x: 330, y: 935, rx: 270, ry: 70 };
const SCARF_ON_BRANCH = [1522, 524];

let SEN = [], ENV = [], SUB = [];
const st = n => SEN[n - 1][0], en = n => SEN[n - 1][1];
export let DUR = 184;
export function setup(s, e, subs) { SEN = s; ENV = e; SUB = subs; DUR = en(49) + 2.0; }

// ---------- helpers ----------
function keys(t, K, ease = true) {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t < K[i][0]) {
    const [t0, v0] = K[i - 1], [t1, v1] = K[i], u = (t - t0) / (t1 - t0);
    return lerp(v0, v1, ease ? ss(u) : u);
  }
  return K[K.length - 1][1];
}
const pulse = (t, a, b, r = 0.25) => ss(seg(t, a, a + r)) * (1 - ss(seg(t, b - r, b)));
const inWin = (t, a, b) => t >= a && t < b;

// ---------- blocking (x positions over time) ----------
let X = null;
function blocking() {
  const go = en(4) - 0.35, fin = 1380;
  return {
    go,
    tho: [[0, 620], [st(3) + 0.1, 620], [st(3) + 2.4, 640], [go, 640], [go + 2.6, fin + 180], [st(8), fin + 180], [st(8) + 1.4, 1150],
      [st(18) - 0.6, 1150], [st(18) - 0.1, 1215], [en(18) + 0.9, 1215], [en(18) + 1.4, 1150], [st(24) - 0.4, 1150], [st(24) + 1.8, 960]],
    gau: [[0, 960], [st(3) + 0.1, 960], [st(3) + 2.4, 640], [go, 640], [go + 6.3, fin + 80], [st(8), fin + 80], [st(8) + 1.4, 1385],
      [st(24) - 0.4, 1385], [st(24) + 1.8, 1200], [st(44) - 0.2, 1200], [st(44) + 0.6, 1220]],
    ho: [[0, 1300], [st(3) + 0.1, 1300], [st(3) + 2.4, 640], [go, 640], [go + 13.0, fin], [st(8), fin], [st(8) + 1.4, 900],
      [st(19) - 0.1, 900], [st(19) + 0.5, 1010], [en(19) + 0.2, 1010], [en(19) + 0.7, 900], [st(24) - 0.4, 900], [st(24) + 1.8, 720],
      [st(33) + 0.1, 720], [st(33) + 0.7, 560]],
    // the race runs at constant speed
    linearWins: [[go, go + 13.0]],
  };
}
// tiger's swim (x, sink) once he jumps: t0 = st(33)+0.7
function swim(t) {
  const t0 = st(33) + 0.7;
  const x = keys(t, [[t0, 560], [t0 + 0.4, 470], [t0 + 1.2, 360], [t0 + 1.4, 360], [t0 + 2.3, 520], [t0 + 3.0, 700]]);
  let sink = 0, lift = 0;
  if (t >= t0 && t < t0 + 0.4) { const u = seg(t, t0, t0 + 0.4); lift = 60 * 4 * u * (1 - u); sink = 170 * ss(seg(t, t0 + 0.2, t0 + 0.45)); }
  else if (t >= t0 + 0.4 && t < t0 + 2.3) sink = 170;
  else if (t >= t0 + 2.3 && t < t0 + 2.8) sink = 170 * (1 - ss(seg(t, t0 + 2.3, t0 + 2.8)));
  return { x, sink, lift, on: t >= t0 && t < t0 + 3.0, t0 };
}
function posX(id, t) {
  if (id === 'ho') { const w = swim(t); if (w.on || t >= w.t0 + 3.0) return t >= w.t0 + 3.0 ? 700 : w.x; }
  const K = X[id];
  const lin = X.linearWins.some(([a, b]) => t >= a && t < b + 0.01);
  return keys(t, K, !lin);
}
// race lanes: depth offset and scale
function lane(id, t) {
  const k = pulse(t, st(3) + 0.1, st(8) + 1.4, 1.0);
  const L = { tho: [-72, 0.88], gau: [0, 1], ho: [72, 1.1] }[id];
  return { dy: L[0] * k, s: 1 + (L[1] - 1) * k };
}

// ---------- props ----------
function drawBall(ctx, x, y, rot = 0, shadow = true) {
  if (shadow) { ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.ellipse(x + 6, GROUND - 2, BALL_R, 7, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  S_(ctx, E(0, 0, BALL_R, BALL_R), { fill: PAL.coral, line: 4, seed: 801 });
  ink(ctx, spline([[-BALL_R * 0.95, -6], [0, 4], [BALL_R * 0.95, -6]], false, 6), 6, { color: PAL.white, taper: false });
  ctx.restore();
}
function drawScarf(ctx, x, y, rot, flutter) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const f = Math.sin(flutter) * 10;
  S_(ctx, spline([[-60, -12], [0, -16 + f * 0.3], [60, -12], [62, 12], [0, 14 - f * 0.3], [-60, 12]], true, 6), { fill: CAST.tho.scarf, line: 4, seed: 860 });
  S_(ctx, spline([[34, 8], [52, 10], [60 + f, 56], [40 + f, 54]], true, 4), { fill: CAST.tho.scarf, line: 3.5, seed: 861 });
  ctx.restore();
}
function note(ctx, x, y, k, seed) {
  if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  S_(ctx, E(0, 0, 16, 12, -0.4), { fill: PAL.ink, line: 0, grain: 0, seed });
  ink(ctx, [[14, -4], [14, -58]], 5, { taper: false });
  ink(ctx, spline([[14, -58], [30, -46], [32, -28]], false, 5), 5, { taper: true });
  ctx.restore();
}

function garden(ctx, t) {
  ctx.fillStyle = PAL.paper; ctx.fillRect(0, 0, W, H);
  plane(ctx, rect(0, 0, W, 700), '#BFD3E3');
  rays(ctx, 1220, 130, 28, 140, PAL.mustardL, { alpha: 0.45, r0: 64 });
  S_(ctx, E(1220, 130, 56, 56), { fill: PAL.mustard, line: 3.5, seed: 3 });
  plane(ctx, kidney(420, 130, 90, 0.1), PAL.white, { grain: 0.15 });
  plane(ctx, kidney(860, 80, 64, -0.15), PAL.white, { grain: 0.15 });
  plane(ctx, E(300, 720, 520, 120), '#B5C27A');
  plane(ctx, E(1300, 730, 640, 140), '#A9B86C');
  plane(ctx, rect(0, 700, W, H - 700), '#D3D69C');
  ink(ctx, [[0, 702], [W, 702]], 4, { breaks: 0.25, seed: 21 });
  // pond
  S_(ctx, E(POND.x, POND.y, POND.rx, POND.ry), { fill: PAL.tealL, line: 4, seed: 30, shade: [{ pts: E(POND.x + 40, POND.y + 22, POND.rx * 0.8, POND.ry * 0.6), color: PAL.teal, alpha: 0.35 }] });
  for (const [dx, w] of [[-120, 60], [40, 90], [150, 50]]) ink(ctx, [[POND.x + dx - w / 2, POND.y + 8], [POND.x + dx + w / 2, POND.y + 8]], 3, { color: PAL.white, alpha: 0.8 });
  // big tree with a long branch to the left
  S_(ctx, [[1680, 880], [1730, 880], [1724, 420], [1690, 420]], { fill: PAL.brown, line: 4, seed: 40 });
  S_(ctx, spline([[1700, 560], [1600, 520], [1470, 508], [1466, 524], [1600, 540], [1700, 590]], true, 5), { fill: PAL.brown, line: 3.5, seed: 41 });
  S_(ctx, E(1720, 330, 190, 170), { fill: PAL.avocado, line: 4, seed: 42, shade: [{ pts: E(1770, 380, 150, 120), color: PAL.avocadoD, alpha: 0.35 }] });
  S_(ctx, E(1500, 470, 60, 44), { fill: PAL.avocado, line: 3.5, seed: 43 });
  // race props only around the race
  const race = pulse(t, st(3), st(8) + 2.0, 0.6);
  if (race > 0) {
    ctx.save(); ctx.globalAlpha = race;
    ink(ctx, [[700, 790], [660, 960]], 6, { color: PAL.white, taper: false, breaks: 0.15 });
    ink(ctx, [[1440, 790], [1400, 960]], 6, { color: PAL.white, taper: false, breaks: 0.15 });
    S_(ctx, rect(1452, 600, 10, 210), { fill: PAL.ink, line: 0, grain: 0 });
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) S_(ctx, rect(1462 + c * 22, 604 + r * 22, 22, 22), { fill: (r + c) % 2 ? PAL.ink : PAL.white, line: 0, grain: 0, off: [0, 0] });
    ctx.restore();
  }
  [[880, 1015, PAL.coral], [1180, 1035, PAL.mustard], [1560, 1010, PAL.pink], [760, 1045, PAL.teal]].forEach(([x, y, c], i) => {
    for (let k = 0; k < 5; k++) { const a = k * TAU / 5; S_(ctx, E(x + Math.cos(a) * 10, y + Math.sin(a) * 10, 8, 8), { fill: c, line: 0, grain: 0.1, seed: 120 + i * 7 + k }); }
    S_(ctx, E(x, y, 5, 5), { fill: PAL.white, line: 0, grain: 0, seed: 150 + i });
  });
}

function wind(ctx, t) {
  const k = pulse(t, st(14), en(16) + 0.4, 0.5);
  if (k <= 0) return;
  for (let i = 0; i < 5; i++) {
    const ph = ((t * 0.9 + i * 0.37) % 1), x = 1900 - ph * 2100, y = 420 + i * 70;
    ink(ctx, spline([[x, y], [x + 120, y - 18], [x + 240, y], [x + 300, y - 30], [x + 270, y - 50]], false, 6), 5, { color: PAL.white, alpha: 0.85 * k, taper: true });
  }
}

function splash(ctx, x, y, t0, t) {
  const u = seg(t, t0, t0 + 0.9);
  if (u <= 0 || u >= 1) return;
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI * (0.15 + 0.7 * i / 6), r = 30 + 90 * u;
    const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r * 1.2 + 160 * u * u;
    S_(ctx, E(px, py, 9 * (1 - u * 0.5), 12 * (1 - u * 0.5)), { fill: PAL.white, line: 2.5, seed: 880 + i, alpha: 1 - u });
  }
  ink(ctx, E(x, y + 6, 40 + 80 * u, 10 + 16 * u), 3, { closed: true, color: PAL.white, alpha: 1 - u });
}

// ---------- speech ----------
const DIALOGUE = { 9: ['ho'], 11: ['tho'], 13: ['gau'], 17: ['tho'], 21: ['tho', 'ho'], 23: ['gau'], 28: ['tho'], 30: ['gau'], 32: ['ho'], 35: ['tho'],
  37: ['ho'], 39: ['gau'], 41: ['tho'], 43: ['ho'], 45: ['tho', 'gau', 'ho'], 46: ['tho', 'gau', 'ho'], 47: ['tho', 'gau', 'ho'], 48: ['tho', 'gau', 'ho'] };
function speaking(t, id) {
  for (const [n, who] of Object.entries(DIALOGUE)) if (who.includes(id) && t >= st(+n) - 0.05 && t <= en(+n) + 0.05) return ENV[Math.floor(t * FPS)] || 0;
  return null;
}

function poseFor(id, t) {
  const p = { face: 'smile', blink: ((t + { tho: 0, gau: 1.3, ho: 2.1 }[id]) / 3.4) % 1 < 0.035 };
  const W_ = (a, b) => inWin(t, a, b);
  // faces by beat
  if (id === 'ho' && W_(en(7), st(11))) p.face = 'sad';
  if (W_(st(14), en(17) + 0.3)) p.face = 'wow';
  if (id === 'tho' && W_(st(18), en(19))) p.face = 'sad';
  if (W_(st(21), en(23) + 0.5)) p.face = 'happy';
  if (W_(st(25), en(26) + 0.3)) p.face = 'wow';
  if (id === 'tho' && W_(st(27), en(28))) p.face = 'sad';
  if (id === 'ho' && W_(st(31), en(33))) p.face = 'happy';
  if (W_(st(34), en(35))) p.face = id === 'tho' ? 'wow' : 'happy';
  if (t >= st(36)) p.face = 'happy';
  if (id === 'gau' && W_(st(12), en(13))) p.face = 'wow';
  const sp = speaking(t, id);
  if (sp !== null) { p.face = 'talk'; p.open = sp; }
  // waves when named (sentence 2) and cheering
  let wave = 0;
  const named = { tho: 0.38, gau: 0.62, ho: 0.82 }[id], nt = lerp(st(2), en(2), named);
  wave = pulse(t, nt - 0.2, nt + 1.1);
  if (id !== 'gau') wave = Math.max(wave, pulse(t, st(21), en(21) + 0.3));
  if (id === 'ho') wave = Math.max(wave, pulse(t, st(31), en(32) + 0.2));
  if (wave > 0) { p.wave = wave; p.wob = Math.sin(t * TAU * 2 + id.length) * 0.32; }
  // arms
  if (id === 'gau') {
    const scratch = pulse(t, st(12), en(13), 0.3); if (scratch > 0) p.armL = ['up', 0.75 * scratch];
    const reach = pulse(t, st(20) + 1.2, en(20) + 0.2, 0.7); if (reach > 0) p.armR = ['stretch', reach];
  }
  if (id === 'tho') {
    const up = pulse(t, st(18), en(18) + 0.3, 0.2); if (up > 0) p.armR = ['up', up];
    const hands = pulse(t, st(44) + 0.6, en(48) + 0.3, 0.5); if (hands > 0) { p.armL = ['side', hands]; p.armR = ['side', hands]; }
  }
  if (id === 'ho') {
    const up = pulse(t, st(19) + 0.4, en(19) + 0.2, 0.3); if (up > 0) { p.armR = ['up', up]; p.armL = ['up', up]; }
    const carry = pulse(t, st(33) + 3.0, st(36) + 0.6, 0.3); if (carry > 0 && t > st(33) + 2.4) p.armR = ['hold', 1];
    const hands = pulse(t, st(44) + 0.6, en(48) + 0.3, 0.5); if (hands > 0) p.armR = ['side', hands];
  }
  if (id === 'gau') {
    const hold = (t >= st(24) - 0.4 && t < st(25)) ? 1 : 0; if (hold) p.armL = ['hold', 1];
    const hands = pulse(t, st(44) + 0.6, en(48) + 0.3, 0.5); if (hands > 0) p.armL = ['side', hands];
  }
  if (id === 'tho' && t >= st(16) + 0.3 && t < st(20) + 4.7) p.noScarf = true;
  return p;
}

// ---------- characters ----------
const prevX = {};
function drawFriend(ctx, id, t) {
  const x = posX(id, t), L = lane(id, t);
  const dx = posX(id, t + 0.05) - posX(id, t - 0.05);
  const p = poseFor(id, t);
  if (Math.abs(dx) > 1.2) p.step = t * (Math.abs(dx) > 8 ? 4.2 : 2.4);
  if (t >= st(44) + 0.8 && t < en(48)) p.step = t * 1.6;       // marching while singing
  let lift = 0, rot = 0;
  if (id === 'tho' && inWin(t, st(18), en(18))) lift = 30 * Math.abs(Math.sin((t - st(18)) * Math.PI * 1.9));
  if (id === 'ho' && Math.abs(dx) > 1.2 && t < st(8)) rot = Math.sin(t * TAU * 2.4) * 0.06;    // waddle
  if (id === 'gau' && inWin(t, st(29), en(29) + 0.2)) rot = Math.sin((t - st(29)) * TAU * 3) * 0.05;   // head shake
  let sink = 0;
  if (id === 'ho') { const w = swim(t); if (w.on) { sink = w.sink; lift += w.lift; } }
  const s = (CAST[id].s || 1) * SC * L.s;
  ctx.save();
  if (sink > 0) { ctx.beginPath(); ctx.rect(0, 0, W, WATER_Y); ctx.clip(); }
  ctx.translate(x, GROUND + L.dy - lift + sink); ctx.rotate(rot); ctx.scale(s, s);
  drawCharacter(ctx, id, p);
  ctx.restore();
  if (sink > 60) for (let i = 0; i < 2; i++) ink(ctx, E(x, WATER_Y + 4, 110 + i * 40 + Math.sin(t * 6 + i) * 8, 14 + i * 6), 3, { closed: true, color: PAL.white, alpha: 0.8 - i * 0.3 });
  return { x, dy: L.dy, s };
}

function handWorld(id, side, name, k, t) {
  const p = handPos(CAST[id], side, name, k), x = posX(id, t), s = (CAST[id].s || 1) * SC;
  return [x + p[0] * s, GROUND + p[1] * s];
}

function ballAndScarf(ctx, t) {
  // scarf
  const fly0 = st(16) + 0.3, fly1 = en(16) - 0.2, grab = st(20) + 2.0, back0 = en(20) + 0.0, back1 = st(20) + 4.7;
  if (t >= fly0 && t < back1) {
    let x, y, r;
    if (t < fly1) { const u = seg(t, fly0, fly1), tx = posX('tho', t); const a = [tx, 712], c = [1300, 360], b = SCARF_ON_BRANCH;
      x = (1 - u) * (1 - u) * a[0] + 2 * u * (1 - u) * c[0] + u * u * b[0]; y = (1 - u) * (1 - u) * a[1] + 2 * u * (1 - u) * c[1] + u * u * b[1]; r = Math.sin(u * 9) * 0.5; }
    else if (t < grab) { [x, y] = SCARF_ON_BRANCH; r = Math.sin(t * 2.2) * 0.06; }
    else if (t < back0) { const h = handWorld('gau', 1, 'stretch', pulse(t, st(20) + 1.2, en(20) + 0.2, 0.7), t); x = h[0]; y = h[1] + 10; r = 0; }
    else { const u = ss(seg(t, back0, back1)), h = handWorld('gau', 1, 'stretch', 0.3, t), tx = posX('tho', t); x = lerp(h[0], tx, u); y = lerp(h[1], 712, u); r = (1 - u) * 0.4; }
    drawScarf(ctx, x, y, r, t * 9);
  }
  // ball
  if (t < st(24) - 0.4) return;
  const drop = st(25) + 0.1, inPond = st(25) + 1.3;
  const sw = swim(t);
  if (t < drop) { const h = handWorld('gau', -1, 'hold', 1, t); drawBall(ctx, h[0] - 4, h[1] - 6, 0, false); return; }
  if (t < inPond) {
    const h0 = handWorld('gau', -1, 'hold', 1, drop), u = seg(t, drop, inPond);
    const x = lerp(h0[0], POND.x + 60, 1 - (1 - u) * (1 - u));
    let y = GROUND - BALL_R;
    if (u < 0.25) y = lerp(h0[1], GROUND - BALL_R, (u / 0.25) ** 2);
    else if (u > 0.8) y = GROUND - BALL_R + (WATER_Y - GROUND + 8) * seg(u, 0.8, 1);
    drawBall(ctx, x, y, x / BALL_R, u < 0.8);
    return;
  }
  splash(ctx, POND.x + 60, WATER_Y, inPond, t);
  const grabT = sw.t0 + 1.25, outT = sw.t0 + 2.9, place = st(36) + 0.4;
  if (t < grabT) { drawBall(ctx, POND.x + 30, WATER_Y + 4 + Math.sin(t * 3) * 3, 0, false); return; }
  if (t < outT) { drawBall(ctx, sw.x - 10, WATER_Y - 14, 0, false); return; }
  if (t < place + 0.5) {
    const h = handWorld('ho', 1, 'hold', 1, t);
    if (t > place) { const u = ss(seg(t, place, place + 0.5)); drawBall(ctx, lerp(h[0], 860, u), lerp(h[1], GROUND - BALL_R, u), 0, true); return; }
    drawBall(ctx, h[0] + 4, h[1] - 6, 0, false); return;
  }
  if (t < st(44)) drawBall(ctx, 860, GROUND - BALL_R, 860 / BALL_R, true);
  else { const k = 1 - seg(t, st(44), st(44) + 0.4); if (k > 0) { ctx.save(); ctx.globalAlpha = k; drawBall(ctx, 860, GROUND - BALL_R, 0, true); ctx.restore(); } }
  if (sw.on) splash(ctx, 470, WATER_Y, sw.t0 + 0.35, t);
}

// ---------- title, lesson, subtitles ----------
function titleCard(ctx, t) {
  ctx.fillStyle = PAL.paper; ctx.fillRect(0, 0, W, H);
  rays(ctx, W / 2, 500, 32, 900, PAL.mustardL, { alpha: 0.35 });
  const k = back(seg(t, 0.15, 0.55));
  text(ctx, 'CÂU CHUYỆN', W / 2, 330, { font: '600 42px Baloo', align: 'center', fill: PAL.inkSoft, track: 10, alpha: ss(seg(t, 0.1, 0.5)) });
  ctx.save(); ctx.translate(W / 2, 500); ctx.scale(k, k);
  text(ctx, 'Khác nhau thì đã sao?', 0, 40, { font: '128px Lobster', align: 'center', fill: PAL.ink, plate: PAL.coral, off: [5, 4] });
  ctx.restore();
}
function lesson(ctx, t) {
  const k = pulse(t, st(49) - 0.1, DUR + 1, 0.35);
  if (k <= 0) return;
  ctx.save(); ctx.translate(W / 2, 250); const b = back(Math.min(1, seg(t, st(49) + 1.2, st(49) + 1.6))); ctx.scale(b, b);
  const font = '96px Lobster', w = measure(ctx, 'Khác nhau thì đã sao!', font) + 110;
  S_(ctx, rrect(-w / 2, -80, w, 150, 36), { fill: PAL.white, line: 5, seed: 990 });
  text(ctx, 'Khác nhau thì đã sao!', 0, 30, { font, align: 'center', fill: PAL.ink, plate: PAL.coral, off: [4, 3] });
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
  if (!X) X = blocking();
  setClock(t);
  const tt = twos(t), w0 = en(1) + 0.15, w1 = st(2) - 0.2;
  if (tt < (w0 + w1) / 2) titleCard(ctx, tt);
  else {
    garden(ctx, tt);
    wind(ctx, tt);
    const order = ['tho', 'gau', 'ho'].sort((a, b) => lane(a, tt).dy - lane(b, tt).dy);
    for (const id of order) drawFriend(ctx, id, tt);
    ballAndScarf(ctx, tt);
    // singing notes
    if (tt >= st(45) && tt < en(48) + 0.3) ['ho', 'tho', 'gau'].forEach((id, i) => {
      const x = posX(id, tt), ph = (tt * 0.8 + i * 0.33) % 1;
      note(ctx, x + 90, GROUND - 470 - ph * 60, pulse(ph, 0, 1, 0.2), 950 + i);
    });
    if (tt >= st(49) - 0.2) rays(ctx, W / 2, 250, 30, 600, PAL.white, { alpha: 0.25 * pulse(tt, st(49) - 0.2, DUR + 1, 0.4), r0: 120 });
    lesson(ctx, tt);
  }
  if (tt > w0 && tt < w1) wipe(ctx, seg(tt, w0, w1));
  subtitle(ctx, t);
  paperFinish(ctx, W, H);
}
