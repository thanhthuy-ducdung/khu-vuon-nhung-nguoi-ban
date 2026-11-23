// 3-second series opener: the 8 friends pop in and wave together.
import { textures, PAL, shape, ink, plane, ellipse, rrect, rect, TAU, seg, ss, back, twos, setClock, rays, sparkle, kidney, text, measure, paperFinish } from '../engine/toon.js';
import { CAST, IDS, drawCharacter } from '../characters.js';
const cv = document.getElementById('c'), g = cv.getContext('2d');
await Promise.all(['60px Lobster', '700 40px Baloo'].map(f => document.fonts.load(f, 'ỏấôóèíâúĐầẬổ')));
textures();
const W = 1920, H = 1080, GROUND = 870, SC = 0.98;
const E = (cx, cy, rx, ry) => ellipse(cx, cy, rx, ry, 40, 0, TAU);
const S_ = (ctx, pts, o) => shape(ctx, pts, { line: 4, grain: 0.3, breaks: 0.12, ...o });
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
}
function nameTag(ctx, id, x, k) {
  if (k <= 0) return;
  const c = CAST[id], font = '38px Lobster', w = measure(ctx, c.name, font) + 40, h = 56;
  ctx.save(); ctx.translate(x, 960); ctx.scale(k, k);
  S_(ctx, rrect(-w / 2, -h / 2, w, h, 14), { fill: PAL.white, line: 3, seed: x });
  text(ctx, c.name, 0, 13, { font, align: 'center', fill: PAL.ink, plate: c.accent, off: [2, 2] });
  ctx.restore();
}
window.DUR = 3.0;
window.render = async t => {
  g.setTransform(1, 0, 0, 1, 0, 0); setClock(t); const tt = twos(t);
  garden(g);
  rays(g, W / 2, 560, 32, 1000, PAL.white, { alpha: 0.22 * ss(seg(tt, 0.6, 1.0)), r0: 160 });
  IDS.forEach((id, i) => {
    const t0 = 0.05 + i * 0.07, u = tt - t0; if (u < 0) return;
    const k = u < 0.28 ? back(u / 0.28) : 1;
    const wave = ss(seg(tt, 0.75, 1.0)) * (1 - ss(seg(tt, 2.75, 3.0)));
    const pose = { face: 'happy', wave, wob: Math.sin(tt * TAU * 2 + i) * 0.32 };
    const s = (CAST[id].s || 1) * SC * k;
    g.save(); g.translate(X(i), GROUND); g.scale(s, s); drawCharacter(g, id, pose); g.restore();
    nameTag(g, id, X(i), u < 0.4 ? back(seg(u, 0.1, 0.4)) : 1);
  });
  const sp = ss(seg(tt, 0.9, 1.2));
  if (sp > 0) { sparkle(g, 640, 230, 24 * sp, { fill: PAL.white }); sparkle(g, 1320, 260, 20 * sp, { fill: PAL.white }); sparkle(g, 980, 180, 16 * sp, { fill: PAL.white }); }
  paperFinish(g, W, H);
};
window.READY = true;
