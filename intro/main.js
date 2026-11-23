// Page contract: window.READY, window.render(t), window.DUR
import { textures } from '../engine/toon.js';
import * as film from './film.js';
const cv = document.getElementById('c'), g = cv.getContext('2d');
await Promise.all(['60px Lobster', '700 40px Baloo'].map(f => document.fonts.load(f, 'ỏấôóèíâúĐầẬổ')));
textures();
film.setup(await (await fetch('sentences.json')).json(), await (await fetch('env.json')).json());
window.DUR = film.DUR;
window.render = async t => { g.setTransform(1, 0, 0, 1, 0, 0); film.renderFilm(g, t); };
window.READY = true;
