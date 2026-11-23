// Model-sheet page. render(t): t=0 -> line-up of all 8; t=1..8 -> one character sheet.
import { textures, PAL, shape, rrect, text, measure, paperFinish, setClock, plane, rect, ink } from './engine/toon.js';
import { CAST, IDS, drawCharacter } from './characters.js';
const cv = document.getElementById('c'), g = cv.getContext('2d');
await Promise.all(['60px Lobster', '700 40px Baloo', '600 40px Baloo'].map(f => document.fonts.load(f, 'ỏấôóèíâúĐầ')));
textures();
const W = 1920, H = 1080;
function tag(ctx, c, x, y, px = 46) {
  const font = `${px}px Lobster`, w = measure(ctx, c.name, font) + 56, h = px * 1.45;
  shape(ctx, rrect(x - w / 2, y - h / 2, w, h, 16), { fill: PAL.white, line: 3.5, grain: 0.2 });
  text(ctx, c.name, x, y + px * 0.34, { font, align: 'center', fill: PAL.ink, plate: c.accent, off: [3, 2] });
}
function lineup() {
  g.fillStyle = PAL.paper; g.fillRect(0, 0, W, H);
  plane(g, rect(0, 740, W, 340), '#D3D69C'); ink(g, [[0, 742], [W, 742]], 4, { breaks: 0.25, seed: 21 });
  text(g, 'Khu vườn Những Người Bạn', W / 2, 110, { font: '84px Lobster', align: 'center', fill: PAL.ink, plate: PAL.coral, off: [4, 3] });
  IDS.forEach((id, i) => {
    const x = 125 + i * 238, c = CAST[id];
    g.save(); g.translate(x, 800); g.scale(0.82 * (c.s || 1), 0.82 * (c.s || 1)); drawCharacter(g, id, { face: 'smile' }); g.restore();
    tag(g, c, x, 900, 34);
  });
  paperFinish(g, W, H);
}
function sheet(id) {
  const c = CAST[id];
  g.fillStyle = PAL.paper; g.fillRect(0, 0, W, H);
  text(g, c.name, 80, 120, { font: '96px Lobster', fill: PAL.ink, plate: c.accent, off: [4, 3] });
  text(g, 'MODEL SHEET · S1', 84, 170, { font: '600 30px Baloo', fill: PAL.inkSoft, track: 6 });
  const poses = [['smile', 0, 'Bình thường'], ['happy', 0, 'Vui'], ['sad', 0, 'Buồn'], ['wow', 0, 'Ngạc nhiên'], ['happy', 1, 'Vẫy tay']];
  poses.forEach(([face, wave, lab], i) => {
    const x = 220 + i * 370, s = 1.22 * (c.s || 1);
    shape(g, rrect(x - 170, 230, 340, 740, 24), { fill: '#FBF3E2', line: 3, grain: 0.15, seed: i });
    g.save(); g.translate(x, 870); g.scale(s, s); drawCharacter(g, id, { face, wave, wob: 0.15 }); g.restore();
    text(g, lab, x, 935, { font: '700 36px Baloo', align: 'center', fill: PAL.ink });
  });
  paperFinish(g, W, H);
}
window.DUR = 9;
window.render = async t => { g.setTransform(1, 0, 0, 1, 0, 0); setClock(0); t = Math.round(t); t === 0 ? lineup() : sheet(IDS[t - 1]); };
window.READY = true;
