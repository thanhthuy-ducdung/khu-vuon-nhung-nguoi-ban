// Counting hand for the math episodes (Mid-century Cartoon style): a five-finger cartoon glove, palm facing the viewer.
// drawCountHand(ctx, x, y, s, ext, o)
//   (x, y)  wrist centre, s scale (1 = palm about 150 px wide)
//   ext     [thumb, index, middle, ring, pinky], each 0 (folded) .. 1 (raised)
//   o.side  1 = right hand (thumb on the viewer's left), -1 = left hand
//   o.fill  glove colour, o.cuff cuff colour, o.glow index of a finger to highlight (or -1)
//   o.ghost [5 bools] fingers that were just folded: drawn as a faint dashed outline where they stood
//   o.glowSet [5 bools] fingers to highlight (e.g. the ones just raised)
// fingersFor(n)     ext array that shows n (0..5) on one hand, raising index -> middle -> ring -> pinky -> thumb
// handsFor(n)       [rightExt, leftExt] that shows n (0..10) on two hands
import { PAL, shape, ink, ellipse, rrect, xform, spline, TAU } from './engine/toon.js';

const S = (ctx, pts, o) => shape(ctx, pts, { line: 5, grain: 0.25, breaks: 0.08, ...o });
const ORDER = [1, 2, 3, 4, 0];   // raising order: index, middle, ring, pinky, thumb

export function fingersFor(n) {
  const e = [0, 0, 0, 0, 0];
  for (let i = 0; i < Math.max(0, Math.min(5, n)); i++) e[ORDER[i]] = 1;
  return e;
}
export function handsFor(n) { return [fingersFor(Math.min(5, n)), fingersFor(Math.max(0, n - 5))]; }

// one finger as a capsule; when folded it shortens and a knuckle bump stays on the palm
function finger(ctx, bx, by, len, w, ang, k, fill, seed, glow) {
  const L = 16 + len * k;
  const pts = xform(rrect(-w / 2, -L, w, L + w * 0.5, w / 2, 6), bx, by, ang, 1);
  if (glow) { ctx.save(); ctx.globalAlpha = 0.45; S(ctx, xform(rrect(-w / 2 - 12, -L - 12, w + 24, L + w * 0.5 + 24, w / 2 + 12, 6), bx, by, ang, 1), { fill: PAL.mustardL, line: 0, grain: 0, off: [0, 0] }); ctx.restore(); }
  S(ctx, pts, { fill, seed });
  if (k < 0.5) ink(ctx, xform([[-w * 0.32, -L + w * 0.55], [0, -L + w * 0.8], [w * 0.32, -L + w * 0.55]], bx, by, ang, 1), 3, { taper: true });   // nail line of the curled tip
}

function ghostFinger(ctx, bx, by, len, w, ang, thumb = false) {
  const L = 16 + len;
  const pts = xform(rrect(-w / 2, -L, w, L + w * 0.5, w / 2, 6), bx, by, ang, 1);
  ctx.save(); ctx.setLineDash([10, 9]); ctx.lineWidth = 4; ctx.strokeStyle = PAL.coral; ctx.globalAlpha = 0.9;
  ctx.beginPath(); pts.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.closePath(); ctx.stroke(); ctx.restore();
}

export function drawCountHand(ctx, x, y, s, ext, o = {}) {
  const side = o.side ?? 1, fill = o.fill || PAL.white, cuff = o.cuff || PAL.coral, glow = o.glow ?? -1, ghost = o.ghost || [], gset = o.glowSet || [];
  ctx.save(); ctx.translate(x, y); ctx.scale(s * side, s);
  // cuff + wrist
  S(ctx, rrect(-62, -10, 124, 46, 14), { fill: cuff, seed: 11 });
  // four fingers (index .. pinky), from the thumb side outwards
  const F = [[-46, -150, 96, 34, -0.10], [-14, -158, 108, 35, -0.02], [18, -154, 100, 34, 0.05], [48, -140, 80, 30, 0.14]];
  F.forEach(([bx, by, len, w, a], i) => {
    if (ghost[i + 1]) ghostFinger(ctx, bx, by + 30, len, w, a);
    finger(ctx, bx, by + 30, len, w, a, ext[i + 1], fill, 20 + i * 5, glow === i + 1 || gset[i + 1]);
  });
  // palm on top of the finger roots
  S(ctx, spline([[-68, -122], [0, -128], [68, -122], [74, -60], [58, -4], [0, 4], [-58, -4], [-74, -60]], true, 6), { fill, seed: 12 });
  // folded fingers sit on the palm as knuckles
  F.forEach(([bx, by, , w], i) => { if (ext[i + 1] < 0.5) S(ctx, ellipse(bx, -112, w * 0.52, w * 0.42, 18, 0, TAU), { fill, line: 3.5, seed: 40 + i }); });
  // thumb: out to the side when raised, across the palm when folded
  const tk = ext[0], ta = -0.95 + (1 - tk) * 1.35;
  if (ghost[0]) ghostFinger(ctx, -64, -36, 74, 36, -0.95, true);
  finger(ctx, -64, -36, 74 * (0.35 + 0.65 * tk), 36, ta, 1, fill, 60, glow === 0 || gset[0]);
  // palm crease
  ink(ctx, [[-30, -54], [0, -46], [30, -58]], 3, { taper: true, alpha: 0.6 });
  ctx.restore();
}

// 10-finger sequence across two hands: right hand index, middle, ring, pinky, thumb, then the left hand
export const SEQ = [...ORDER.map(f => [0, f]), ...ORDER.map(f => [1, f])];
// state for n raised, plus the fingers folded (sub) or raised (add) by the last step
export function twoHandState(n, { folded = 0, added = 0 } = {}) {
  const ext = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], ghost = [[], []], glow = [[], []];
  for (let i = 0; i < n; i++) { const [h, f] = SEQ[i]; ext[h][f] = 1; }
  for (let i = n; i < n + folded; i++) { const [h, f] = SEQ[i]; ghost[h][f] = true; }
  for (let i = n - added; i < n; i++) { const [h, f] = SEQ[i]; glow[h][f] = true; }
  return { ext, ghost, glow };
}
