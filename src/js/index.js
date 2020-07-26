import * as ThemeSwitch from './ThemeSwitch';
// import MouseCursor from './MouseCursor';
// import { ImageTrail } from './ImageTrail';
import { canUseWebP } from './utils';

const root = document.documentElement;
const body = document.body;

const toggle = document.querySelector('theme-switch');
// const cursor = new MouseCursor(document.querySelector('.cursor'));

[...document.querySelectorAll('a, button')].forEach(el => {
  el.addEventListener('mouseenter', () => cursor.emit('enter'));
  el.addEventListener('mouseleave', () => cursor.emit('leave'));
});

toggle.addEventListener('colorschemechange', () => {
  root.setAttribute('data-theme', toggle.mode);
});

window.addEventListener('load', () => {
  root.classList.add(`${canUseWebP() ? 'webp' : 'no-webp'}`);
  body.classList.remove('loading');
  body.classList.add('loaded');
  // new ImageTrail();
});

const title = document.querySelector('.hero__title');

'mousemove touchmove'.split(' ').forEach(handler => {
  title.parentElement.addEventListener(handler, e => {
    title.style.setProperty('--wght-axis', e.clientY)
    // console.log(e);
  });
});
