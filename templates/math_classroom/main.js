// Page contract: window.READY, window.render(t), window.DUR
import { textures } from '../../engine/toon.js';
import * as film from './film.js';
const cv = document.getElementById('c'), g = cv.getContext('2d');
await Promise.all(['60px Lobster', '700 40px Baloo', '600 40px Baloo', '120px Chalk'].map(f => document.fonts.load(f, 'ỏấôóèíâúĐầẬổỆ□−=+0123456789ợ')));
textures();
const j = async f => (await fetch(f)).json();
film.setup(await j('sentences.json'), await j('env.json'), await j('subs_en.json'), await j('counts.json'));
window.DUR = film.DUR;
window.render = async t => { g.setTransform(1, 0, 0, 1, 0, 0); film.renderFilm(g, t); };
window.READY = true;
