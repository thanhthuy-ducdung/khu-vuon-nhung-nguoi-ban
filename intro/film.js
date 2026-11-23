// Series opening "Xin chao, minh la ..." - the 8 friends introduce themselves, timed to intro_voice.mp3.
// Reused unchanged at the start of every episode. Fixed garden, camera never moves.
import { PAL, shape, ink, plane, ellipse, rrect, rect, TAU, seg, ss, back, twos, setClock, rays, sparkle, kidney, text, measure, paperFinish } from '../engine/toon.js';
import { CAST, IDS, drawCharacter } from '../characters.js';

const W = 1920, H = 1080, GROUND = 870, SC = 0.98, FPS = 24;
const E = (cx, cy, rx, ry, rot = 0, n = 40) => ellipse(cx, cy, rx, ry, n, 0, TAU, rot);
const S_ = (ctx, pts, o) => shape(ctx, pts, { line: 4, grain: 0.3, breaks: 0.12, ...o });
let SEN = [], ENV = [];
export let DUR = 25.5;
export function setup(s, e) { SEN = s; ENV = e; DUR = s[s.length - 1][1] + 1.0; }
const pulse = (t, a, b, r = 0.2) => ss(seg(t, a, a + r)) * (1 - ss(seg(t, b - r, b)));
const X = i => 135 + i * 235;

function garden(ctx) {
  ctx.fillStyle = PAL.paper; ctx.fillRect(0, 0, W, H);
  plane(ctx, rect(0, 0, W, 640), '#BFD3E3');
  rays(ctx, 1690, 130, 28, 140, PAL.mustardL, { alpha: 0.45, r0: 64 });
  S_(ctx, E(1690, 130, 56, 56), { fill: PAL.mustard, line: 3.5, seed: 3 });
  plane(ctx, kidney(420, 120, 90, 0.1), PAL.white, { grain: 0.15 });
  plane(ctx, kidney(1180, 85, 66, -0.15), PAL.white, { grain: 0.15 });
  plane(ctx, E(300, 660, 520, 110), '#B5C27A');
  plane(ctx, E(1500, 670, 640, 130), '#A9B86C');
  plane(ctx, rect(0, 640, W, H - 640), '#D3D69C');
  ink(ctx, [[0, 642], [W, 642]], 4, { breaks: 0.25, seed: 21 });
  [[260, 1010, PAL.coral], [700, 1035, PAL.mustard], [1140, 1012, PAL.pink], [1560, 1035, PAL.teal]].forEach(([x, y, c], i) => {
    for (let k = 0; k < 5; k++) { const a = k * TAU / 5; S_(ctx, E(x + Math.cos(a) * 10, y + Math.sin(a) * 10, 8, 8), { fill: c, line: 0, grain: 0.1, seed: 120 + i * 7 + k }); }
    S_(ctx, E(x, y, 5, 5), { fill: PAL.white, line: 0, grain: 0, seed: 150 + i });
  });
}

function nameTag(ctx, id, x, k) {
  if (k <= 0) return;
  const c = CAST[id], font = '38px Lobster', w = measure(ctx, c.name, font) + 40, h = 56;
  ctx.save(); ctx.translate(x, 960); ctx.scale(k, k);
  S_(ctx, rrect(-w / 2, -h / 2, w, h, 14), { fill: PAL.white, line: 3, seed: x });
  text(ctx, c.name, 0, 13, { font, align: 'center', fill: PAL.ink, plate: c.accent, off: [2, 2] });
  ctx.restore();
}

export function renderFilm(ctx, t) {
  setClock(t);
  const tt = twos(t), all = [1e9, 1e9];   // no group line any more
  garden(ctx);
  const bubbles = [];
  IDS.forEach((id, i) => {
    const [a, b] = SEN[i], t0 = a - 0.1, u = tt - t0;
    if (u < 0) return;
    const solo = tt < b + 0.3;
    rays(ctx, X(i), GROUND - 230, 24, 240, PAL.white, { alpha: 0.5 * pulse(tt, t0, b + 0.4, 0.2), r0: 30 });
    const talking = (tt >= a && tt <= b) || (tt >= all[0] && tt <= all[1]);
    const open = talking ? (ENV[Math.floor(t * FPS)] || 0) : 0;
    const pose = {
      face: talking ? 'talk' : (solo ? 'happy' : 'smile'), open,
      blink: ((tt + i * 0.61) / 3.3) % 1 < 0.035,
    };
    const k = u < 0.3 ? back(u / 0.3) : 1, s = (CAST[id].s || 1) * SC * k;
    ctx.save(); ctx.translate(X(i), GROUND); ctx.scale(s, s); drawCharacter(ctx, id, pose); ctx.restore();
    nameTag(ctx, id, X(i), u < 0.45 ? back(seg(u, 0.12, 0.45)) : 1);
    bubbles.push([X(i), pulse(tt, a - 0.05, b + 0.45, 0.22), i]);
  });
  for (const [x, k, i] of bubbles) if (k > 0) bubble(ctx, x, k, i);
  paperFinish(ctx, W, H);
}

// speech bubble "Xin chao!" above the speaker's head
function bubble(ctx, x, k, i) {
  const y = 395, w = 214, h = 78;
  ctx.save(); ctx.translate(x, y + h / 2 + 30); ctx.scale(back(Math.min(1, k * 1.15)), back(Math.min(1, k * 1.15))); ctx.translate(0, -(h / 2 + 30));
  ctx.globalAlpha = Math.min(1, k * 1.6);
  const P = [...rrect(-w / 2, -h / 2, w, h, 26)];
  S_(ctx, P, { fill: PAL.white, line: 4, seed: 700 + i });
  S_(ctx, [[-16, h / 2 - 4], [16, h / 2 - 4], [-4, h / 2 + 30]], { fill: PAL.white, line: 0, grain: 0, off: [0, 0], seed: 720 + i });
  ink(ctx, [[-16, h / 2 + 1], [-4, h / 2 + 30], [16, h / 2 + 1]], 4, { seed: 740 + i });
  text(ctx, 'Xin chào!', 0, 15, { font: '46px Lobster', align: 'center', fill: PAL.ink, plate: CAST[IDS[i]].accent, off: [2, 2] });
  ctx.restore();
}
