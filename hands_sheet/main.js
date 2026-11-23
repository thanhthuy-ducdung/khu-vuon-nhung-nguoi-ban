// All finger cases for + and - within 10. render(p): one page per p.
import { textures, PAL, text, paperFinish, setClock, shape, rrect } from '../engine/toon.js';
import { drawCountHand, twoHandState } from '../hands.js';
const cv = document.getElementById('c'), g = cv.getContext('2d');
await Promise.all(['60px Lobster', '700 40px Baloo'].map(f => document.fonts.load(f, 'ộừ−')));
textures();
const SUB = [], ADD = [];
for (let n = 1; n <= 10; n++) for (let k = 1; k <= n; k++) SUB.push([n, k]);
for (let a = 1; a <= 9; a++) for (let b = 1; a + b <= 10; b++) ADD.push([a, b]);
const PAGES = [
  ['PHÉP TRỪ: giơ ngón rồi gập (1 → 5)', SUB.filter(([n]) => n <= 5), 'sub'],
  ['PHÉP TRỪ: giơ ngón rồi gập (6 → 8)', SUB.filter(([n]) => n >= 6 && n <= 8), 'sub'],
  ['PHÉP TRỪ: giơ ngón rồi gập (9 → 10)', SUB.filter(([n]) => n >= 9), 'sub'],
  ['PHÉP CỘNG: giơ ngón rồi giơ thêm (1 → 3)', ADD.filter(([a]) => a <= 3), 'add'],
  ['PHÉP CỘNG: giơ ngón rồi giơ thêm (4 → 9)', ADD.filter(([a]) => a >= 4), 'add'],
];
window.DUR = PAGES.length;
window.PAGES = PAGES.length;
window.render = async p => {
  g.setTransform(1, 0, 0, 1, 0, 0); setClock(0);
  const [title, cases, kind] = PAGES[Math.round(p)];
  g.fillStyle = PAL.paper; g.fillRect(0, 0, 1920, 1080);
  text(g, title, 960, 70, { font: '700 46px Baloo', align: 'center', fill: PAL.ink });
  text(g, kind === 'sub' ? 'ngón viền đỏ nét đứt = ngón vừa gập' : 'ngón có viền vàng = ngón vừa giơ thêm', 960, 112, { font: '600 28px Baloo', align: 'center', fill: PAL.inkSoft });
  const cols = 8, cw = 1920 / cols, rows = Math.ceil(cases.length / cols), rh = Math.min(240, (1080 - 140) / rows);
  cases.forEach(([a, b], i) => {
    const cx = cw * (i % cols) + cw / 2, cy = 140 + rh * Math.floor(i / cols);
    shape(g, rrect(cx - cw / 2 + 6, cy + 4, cw - 12, rh - 8, 14), { fill: '#FBF3E2', line: 2.5, grain: 0, off: [0, 0] });
    const n = kind === 'sub' ? a - b : a + b;
    const st = kind === 'sub' ? twoHandState(n, { folded: b }) : twoHandState(n, { added: b });
    const s = rh / 470, twoHands = (kind === 'sub' ? a : n) > 5;
    if (twoHands) {
      drawCountHand(g, cx - 54 * s / 0.45, cy + rh * 0.72, s, st.ext[0], { side: 1, ghost: st.ghost[0], glowSet: st.glow[0] });
      drawCountHand(g, cx + 54 * s / 0.45, cy + rh * 0.72, s, st.ext[1], { side: -1, ghost: st.ghost[1], glowSet: st.glow[1] });
    } else drawCountHand(g, cx, cy + rh * 0.72, s * 1.15, st.ext[0], { side: 1, ghost: st.ghost[0], glowSet: st.glow[0] });
    text(g, `${a} ${kind === 'sub' ? '−' : '+'} ${b} = ${n}`, cx, cy + rh - 18, { font: `700 ${Math.round(rh * 0.15)}px Baloo`, align: 'center', fill: PAL.ink });
  });
  paperFinish(g, 1920, 1080, 0.6);
};
window.READY = true;
