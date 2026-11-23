// Maths episode "O vuong bi mat" - Mid-century classroom + chalkboard maths + counting hand, timed to voice.mp3 (39 sentences).
import { PAL, shape, ink, plane, ellipse, rrect, rect, TAU, seg, ss, back, twos, lerp, setClock, rays, sparkle, text, measure, fit, paperFinish } from '../../engine/toon.js';
import { CAST, drawCharacter } from '../../characters.js';
import { drawCountHand, twoHandState } from '../../hands.js';

const W = 1920, H = 1080, FPS = 24;
const E = (cx, cy, rx, ry) => ellipse(cx, cy, rx, ry, 40, 0, TAU);
const S_ = (ctx, pts, o) => shape(ctx, pts, { line: 4, grain: 0.3, breaks: 0.12, ...o });
const SLATE = '#24423A', CHALK = '#F3F0E4', ACCENT = '#F2A65A', PALE = '#F4E27A';
const BOARD = { x0: 496, y0: 104, x1: 1504, y1: 616 };
const STUD = { soc: [1170, 985], gau: [1440, 985], ho: [1730, 985] }, DE = [300, 900];
const CALL = { x: 1275, y: 370, r: 205 };

let SEN = [], ENV = [], SUB = [], CNT = {};
const st = n => SEN[n - 1][0], en = n => SEN[n - 1][1];
export let DUR = 165;
export function setup(s, e, subs, counts) { SEN = s; ENV = e; SUB = subs; CNT = counts; DUR = st(39) - 0.3 + 7.4; }
const pulse = (t, a, b, r = 0.25) => ss(seg(t, a, a + r)) * (1 - ss(seg(t, b - r, b)));
const inWin = (t, a, b) => t >= a && t < b;

// ---------- chalk (glyph sprites are cached) ----------
const cache = new Map();
function chalkSprite(str, px, color) {
  const key = `${str}|${px}|${color}`;
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas'), k = c.getContext('2d');
  k.font = `${px}px Chalk`; const w = Math.ceil(k.measureText(str).width) + 20;
  c.width = w; c.height = Math.ceil(px * 1.6);
  k.font = `${px}px Chalk`; k.fillStyle = color; k.fillText(str, 10, px * 1.15);
  k.globalCompositeOperation = 'destination-out';
  let s = str.length * 31 + px; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < w * c.height / 12; i++) { k.globalAlpha = 0.25 + r() * 0.6; k.fillRect(r() * w, r() * c.height, 1 + r() * 2.2, 1 + r() * 1.6); }
  const out = { c, w: w - 20 }; cache.set(key, out); return out;
}
// write-on: u 0..1 reveals the glyphs left to right
function chalk(ctx, str, x, y, px, color = CHALK, u = 1, alpha = 1) {
  const sp = chalkSprite(str, px, color);
  if (u <= 0) return sp.w;
  ctx.save(); ctx.globalAlpha = 0.95 * alpha; ctx.beginPath(); ctx.rect(x - 10, y - px * 1.2, (sp.w + 20) * Math.min(1, u), px * 1.7); ctx.clip();
  ctx.drawImage(sp.c, x - 10, y - px * 1.15); ctx.restore();
  return sp.w;
}
function chalkBox(ctx, x, y, s, u = 1, inside = '', insideK = 0) {
  if (u <= 0) return;
  ctx.save(); ctx.strokeStyle = ACCENT; ctx.lineCap = 'round'; ctx.globalAlpha = 0.9;
  const P = [[x, y + 2], [x + s - 2, y], [x + s, y + s - 1], [x - 1, y + s], [x, y + 2]];
  for (let p = 0; p < 3; p++) {
    ctx.lineWidth = 5 - p; ctx.beginPath();
    const n = Math.max(1, Math.ceil(4 * u)), f = 4 * u - (n - 1);
    ctx.moveTo(P[0][0] + p, P[0][1] - p);
    for (let i = 1; i <= n; i++) { const a = P[i - 1], b = P[i], k = i === n ? f : 1; ctx.lineTo(lerp(a[0], b[0], k) + p * (i % 2), lerp(a[1], b[1], k) - p * ((i + 1) % 2)); }
    ctx.stroke();
  }
  ctx.restore();
  if (inside && insideK > 0) { const kk = back(Math.min(1, insideK)); ctx.save(); ctx.translate(x + s / 2, y + s / 2); ctx.scale(kk, kk); chalk(ctx, inside, -s * 0.26, s * 0.36, s * 0.95, ACCENT); ctx.restore(); }
}
// a line of maths; tokens: strings or '□'; u reveals token by token
function mathLine(ctx, tokens, x, y, px, u = 1, answer = '', answerK = 0, alpha = 1) {
  let cx = x; const n = tokens.length;
  tokens.forEach((t, i) => {
    const uu = Math.max(0, Math.min(1, u * n - i));
    if (t === '□') { chalkBox(ctx, cx + 8, y - px * 0.78, px * 0.82, uu, answer, answerK); cx += px * 1.0; }
    else { const w = chalk(ctx, t, cx, y, px, CHALK, uu, alpha); cx += w + px * 0.2; }
  });
}

// ---------- classroom ----------
function classroom(ctx) {
  ctx.fillStyle = PAL.paper; ctx.fillRect(0, 0, W, H);
  plane(ctx, rect(0, 0, W, 760), '#F1E2C2');
  plane(ctx, rect(0, 620, W, 140), PAL.tealL);
  ink(ctx, [[0, 620], [W, 620]], 4, { breaks: 0.2 });
  plane(ctx, rect(0, 760, W, H - 760), PAL.kraftL);
  ink(ctx, [[0, 760], [W, 760]], 4, { breaks: 0.2 });
  S_(ctx, rect(80, 110, 230, 280), { fill: '#BFD3E3', line: 5, seed: 31 });
  ink(ctx, [[195, 110], [195, 390]], 5); ink(ctx, [[80, 250], [310, 250]], 5);
  S_(ctx, E(1760, 150, 58, 58), { fill: PAL.white, line: 4.5, seed: 33 });
  ink(ctx, [[1760, 150], [1760, 112]], 5); ink(ctx, [[1760, 150], [1788, 162]], 5);
  S_(ctx, rrect(470, 80, 1060, 560, 10), { fill: PAL.brown, line: 5, seed: 40 });
  S_(ctx, rect(BOARD.x0, BOARD.y0, BOARD.x1 - BOARD.x0, BOARD.y1 - BOARD.y0), { fill: SLATE, line: 3, seed: 41, grain: 0.5 });
  S_(ctx, rect(480, 628, 1040, 22), { fill: PAL.brownL, line: 4, seed: 42 });
  for (const [x, c] of [[620, CHALK], [660, ACCENT], [1400, CHALK]]) S_(ctx, rrect(x, 618, 30, 10, 4), { fill: c, line: 2, seed: x });
}

// ---------- the four problems ----------
// write: sentence where line 1 is written; conv: sentence of the changed sum; hand: [show, count, answer] sentences
let P = null;
function problems() {
  return [
    { l1: ['3', '+', '□', '=', '5'], l2: ['□', '=', '5', '−', '3'], ans: '2', write: 3, conv: 9, show: 10, count: 11, answer: 12, start: 5, op: 'sub', k: 3, who: 'gau', wipeAt: null },
    { l1: ['□', '+', '2', '=', '6'], l2: ['□', '=', '6', '−', '2'], ans: '4', write: 14, conv: 16, show: 17, count: 18, answer: 19, start: 6, op: 'sub', k: 2, who: 'all', wipeAt: 14 },
    { l1: ['8', '−', '□', '=', '5'], l2: ['□', '=', '8', '−', '5'], ans: '3', write: 21, conv: 24, show: 25, count: 26, answer: 27, start: 8, op: 'sub', k: 5, who: 'soc', wipeAt: 21 },
    { l1: ['□', '−', '3', '=', '5'], l2: ['□', '=', '5', '+', '3'], ans: '8', write: 29, conv: 32, show: 33, count: 34, answer: 35, start: 5, op: 'add', k: 3, who: 'ho', wipeAt: 29 },
  ];
}
function activeProblem(t) {
  let a = P[0];
  for (const p of P) if (p.wipeAt && t >= st(p.wipeAt) + 0.35) a = p;
  return a;
}
// number of fingers folded/raised so far for the active problem
function countStep(p, t) {
  const times = CNT[p.count]; let n = 0;
  for (const tt of times) if (t >= tt + 0.1) n++;
  return n;
}

function board(ctx, t) {
  const p = activeProblem(t);
  const w1 = seg(t, st(p.write) + 0.4, en(p.write) - 0.1), w2 = seg(t, st(p.conv) + 0.3, en(p.conv) - 0.2);
  const ansK = seg(t, st(p.answer), st(p.answer) + 0.4);
  chalk(ctx, 'Tìm ô vuông', 560, 185, 60, '#E9E2C8');
  mathLine(ctx, p.l1, 600, 330, 120, w1, p.ans, ansK);
  if (p.op === 'add') {   // Tiger's wrong try, crossed out
    const wr = seg(t, st(30) + 1.4, en(30) - 0.2), cross = seg(t, st(31) + 0.4, st(31) + 1.0), fade = 1 - seg(t, st(32), st(32) + 0.5);
    if (wr > 0 && fade > 0) {
      chalk(ctx, '5 − 3 = 2 ?', 1110, 330, 70, PALE, wr, fade);
      if (cross > 0) { ctx.save(); ctx.globalAlpha = 0.9 * fade; ctx.strokeStyle = ACCENT; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(1100, 270); ctx.lineTo(1100 + 330 * cross, 270 + 80 * cross); ctx.moveTo(1100, 350); ctx.lineTo(1100 + 330 * cross, 350 - 80 * cross); ctx.stroke(); ctx.restore(); }
    }
  }
  mathLine(ctx, p.l2, 600, 500, 120, w2, p.ans, ansK);
  // wipe band when a new problem starts
  for (const q of P) if (q.wipeAt) {
    const u = seg(t, st(q.wipeAt) - 0.05, st(q.wipeAt) + 0.7);
    if (u > 0 && u < 1) {
      const x = lerp(BOARD.x0 - 220, BOARD.x1 + 40, u);
      ctx.save(); ctx.beginPath(); ctx.rect(BOARD.x0, BOARD.y0, BOARD.x1 - BOARD.x0, BOARD.y1 - BOARD.y0); ctx.clip();
      ctx.fillStyle = SLATE; ctx.fillRect(BOARD.x0, BOARD.y0, x - BOARD.x0, BOARD.y1 - BOARD.y0);
      ctx.globalAlpha = 0.35; ctx.fillStyle = '#3B5B52'; ctx.fillRect(x - 220, BOARD.y0, 220, BOARD.y1 - BOARD.y0);
      ctx.restore();
    }
  }
}

function handCallout(ctx, t, headOf) {
  const p = activeProblem(t), a = st(p.show) - 0.1, b = en(p.answer) + 1.2;
  const k = pulse(t, a, b, 0.3);
  if (k <= 0) return;
  const { x, y, r } = CALL, sc = back(Math.min(1, seg(t, a, a + 0.35)));
  // leader line to the speaker(s)
  const targets = p.who === 'all' ? ['soc', 'gau', 'ho'] : [p.who];
  ctx.save(); ctx.globalAlpha = k;
  for (const id of targets) { const [hx, hy] = headOf(id); ink(ctx, [[x + r * 0.55, y + r * 0.8], [hx, hy]], 4, { breaks: 0.3 }); }
  ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.translate(-x, -y);
  S_(ctx, E(x + 8, y + 8, r, r), { fill: PAL.paperDD, line: 0, grain: 0, off: [0, 0], alpha: 0.6 });
  S_(ctx, E(x, y, r, r), { fill: '#FBF3E2', line: 5, seed: 70 });
  const step = t >= st(p.count) ? countStep(p, t) : 0;
  const n = p.op === 'sub' ? p.start - step : p.start + step;
  const stt = p.op === 'sub' ? twoHandState(n, { folded: step }) : twoHandState(n, { added: step });
  const two = Math.max(p.start, n) > 5;
  if (two) {
    drawCountHand(ctx, x - 78, y + 150, 0.72, stt.ext[0], { side: 1, ghost: stt.ghost[0], glowSet: stt.glow[0] });
    drawCountHand(ctx, x + 78, y + 150, 0.72, stt.ext[1], { side: -1, ghost: stt.ghost[1], glowSet: stt.glow[1] });
  } else drawCountHand(ctx, x, y + 150, 1.0, stt.ext[0], { ghost: stt.ghost[0], glowSet: stt.glow[0] });
  // spoken count tag ("trừ 1", "cộng 2", then the answer)
  let tag = String(p.start);
  if (step > 0) tag = `${p.op === 'sub' ? 'trừ' : 'cộng'} ${step}`;
  if (t >= st(p.answer)) tag = `= ${p.ans}`;
  text(ctx, tag, x, y - r + 52, { font: '700 46px Baloo', align: 'center', fill: PAL.ink, plate: PAL.mustard, off: [2, 2] });
  ctx.restore();
}

// ---------- characters ----------
const DIALOGUE = { 4: ['de'], 8: ['gau'], 9: ['gau'], 10: ['gau'], 11: ['gau'], 12: ['gau'], 13: ['de'], 16: ['soc', 'gau', 'ho'], 17: ['soc', 'gau', 'ho'],
  18: ['soc', 'gau', 'ho'], 19: ['soc', 'gau', 'ho'], 20: ['de'], 23: ['soc'], 24: ['soc'], 25: ['soc'], 26: ['soc'], 27: ['soc'], 28: ['de'], 30: ['ho'], 31: ['de'], 32: ['de'],
  34: ['ho'], 35: ['ho'], 37: ['ho'], 38: ['de'] };
function speaking(t, id) {
  for (const [n, who] of Object.entries(DIALOGUE)) if (who.includes(id) && t >= st(+n) - 0.05 && t <= en(+n) + 0.05) return ENV[Math.floor(t * FPS)] || 0;
  return null;
}
function poseFor(id, t) {
  const p = { face: 'smile', blink: ((t + { de: 0.5, gau: 1.3, soc: 2.0, ho: 2.7 }[id]) / 3.4) % 1 < 0.035 };
  const W_ = (a, b) => inWin(t, a, b);
  if (id === 'de') {
    for (const n of [3, 14, 21, 29, 32]) { const k = pulse(t, st(n), en(n), 0.3); if (k > 0) p.armR = ['up', 0.85 * k]; }
    for (const n of [20, 36]) { const k = pulse(t, st(n), en(n) + 0.3, 0.25); if (k > 0) { p.armR = ['up', 0.5 * k]; p.armL = ['up', 0.5 * k]; } }
    if (t >= st(13)) p.face = 'happy';
    if (W_(st(31), en(31))) p.face = 'smile';
  } else {
    if (W_(st(5), st(7))) p.face = id === 'ho' ? 'wow' : 'smile';
    if (id === 'soc') { const k = pulse(t, st(6), en(6) + 0.3, 0.3); if (k > 0) p.armL = ['up', 0.75 * k]; }
    const raise = { gau: [[st(7), en(9)]], soc: [[st(22), en(24)]], ho: [[st(30), en(30)]] }[id] || [];
    let wave = 0;
    for (const [a, b] of raise) wave = Math.max(wave, pulse(t, a, b, 0.3));
    wave = Math.max(wave, pulse(t, st(15), en(16), 0.3));
    if (wave > 0) { p.wave = wave; p.wob = Math.sin(t * 10) * 0.12; }
    const clap = pulse(t, st(36), en(36) + 0.3, 0.25); if (clap > 0) { p.armR = ['up', 0.5 * clap]; p.armL = ['up', 0.5 * clap]; }
    if (t >= st(12)) p.face = 'happy';
    if (id === 'ho' && W_(st(31), en(32) + 0.3)) p.face = 'sad';
    if (id === 'ho' && t >= st(35)) p.face = 'happy';
  }
  const sp = speaking(t, id); if (sp !== null) { p.face = 'talk'; p.open = sp; }
  return p;
}
const SCALE = { de: 1.1 * 1.15, gau: 0.9, soc: 0.9, ho: 0.9 };
function draw(ctx, id, t) {
  const [x, y] = id === 'de' ? DE : STUD[id];
  let rot = 0, lift = 0;
  if (id === 'de' && inWin(t, st(31), en(31))) rot = Math.sin((t - st(31)) * TAU * 1.5) * 0.05;   // head shake
  if (id === 'de' && inWin(t, st(28), en(28) + 0.3)) lift = -6 * Math.abs(Math.sin((t - st(28)) * 8));
  ctx.save(); ctx.translate(x, y - lift); ctx.rotate(rot); ctx.scale(SCALE[id], SCALE[id]); drawCharacter(ctx, id, poseFor(id, t)); ctx.restore();
}
const headOf = id => { const [x, y] = STUD[id]; return [x, y - 220 * SCALE[id] * 1.15]; };

// ---------- title, lesson, subtitles ----------
function titleCard(ctx, t) {
  ctx.fillStyle = PAL.paper; ctx.fillRect(0, 0, W, H);
  rays(ctx, W / 2, 500, 32, 900, PAL.mustardL, { alpha: 0.35 });
  const k = back(seg(t, 0.15, 0.55));
  text(ctx, 'CÂU CHUYỆN', W / 2, 330, { font: '600 42px Baloo', align: 'center', fill: PAL.inkSoft, track: 10, alpha: ss(seg(t, 0.1, 0.5)) });
  ctx.save(); ctx.translate(W / 2, 500); ctx.scale(k, k);
  text(ctx, 'Ô vuông bí mật', 0, 40, { font: '128px Lobster', align: 'center', fill: PAL.ink, plate: PAL.coral, off: [5, 4] });
  ctx.restore();
}
function lesson(ctx, t) {
  const k = pulse(t, st(39) - 0.1, DUR + 1, 0.35);
  if (k <= 0) return;
  ctx.save(); ctx.translate(W / 2, 760); const b = back(Math.min(1, seg(t, st(39) + 1.0, st(39) + 1.4))); ctx.scale(b, b);
  const str = 'Ô vuông dễ ợt, đếm ngón tay thôi!', font = '78px Lobster', w = measure(ctx, str, font) + 100;
  S_(ctx, rrect(-w / 2, -70, w, 130, 34), { fill: PAL.white, line: 5, seed: 990 });
  text(ctx, str, 0, 26, { font, align: 'center', fill: PAL.ink, plate: PAL.coral, off: [4, 3] });
  ctx.restore();
}
function subtitle(ctx, t) {
  let idx = -1;
  for (let i = 0; i < SEN.length; i++) if (t >= SEN[i][0] - 0.1 && t <= SEN[i][1] + 0.35) idx = i;
  if (idx < 0) return;
  const k = Math.min(ss(seg(t, SEN[idx][0] - 0.1, SEN[idx][0] + 0.1)), 1 - ss(seg(t, SEN[idx][1] + 0.2, SEN[idx][1] + 0.35)));
  const F = fit(ctx, SUB[idx], '700 {px}px Baloo', 44, 1500, 2, 34);
  const lh = F.px * 1.18, n = F.lines.length, w = Math.max(...F.lines.map(l => measure(ctx, l, F.font))) + 64, h = n * lh + 24;
  ctx.save(); ctx.globalAlpha = k;
  ctx.fillStyle = 'rgba(43,36,32,0.86)'; ctx.beginPath(); ctx.roundRect(W / 2 - w / 2, H - 30 - h, w, h, 18); ctx.fill();
  F.lines.forEach((l, i) => text(ctx, l, W / 2, H - 30 - h + 12 + lh * (i + 0.8), { font: F.font, align: 'center', fill: '#FFF6DF', plate: null }));
  ctx.restore();
}
function wipe(ctx, p) {
  const x0 = -W * 0.1 + p * W * 2.6;
  S_(ctx, [[x0 - W * 1.3, 0], [x0, 0], [x0 - 120, H], [x0 - W * 1.3 - 120, H]], { fill: PAL.mustardL, line: 5, seed: 900, off: [0, 0] });
}

export function renderFilm(ctx, t) {
  if (!P) P = problems();
  setClock(t);
  const tt = twos(t), w0 = en(1) + 0.15, w1 = st(2) - 0.2;
  if (tt < (w0 + w1) / 2) titleCard(ctx, tt);
  else {
    classroom(ctx);
    board(ctx, t);
    draw(ctx, 'de', tt);
    for (const id of ['soc', 'gau', 'ho']) draw(ctx, id, tt);
    handCallout(ctx, t, headOf);
    if (tt >= st(39) - 0.2) { sparkle(ctx, 360, 700, 30, { fill: PAL.mustard }); sparkle(ctx, 1560, 690, 26, { fill: PAL.mustard }); }
    lesson(ctx, tt);
  }
  if (tt > w0 && tt < w1) wipe(ctx, seg(tt, w0, w1));
  subtitle(ctx, t);
  paperFinish(ctx, W, H);
}
