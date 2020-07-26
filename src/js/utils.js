const root = document.documentElement;
const body = document.body;

const MathUtils = {
  // линейная интерполяция
  lerp: (a, b, n) => (1 - n) * a + n * b,
  // расстояние между двумя точками
  distance: (x1,y1,x2,y2) => Math.hypot(x2-x1, y2-y1),
  // случайное число
  getRandomFloat: (min, max) => (Math.random() * (max - min) + min).toFixed(2)
}

const calcWinsize = () => {
  return { width: window.innerWidth, height: window.innerHeight }
}

const getMousePos = (e) => {
  let posx = 0;
  let posy = 0;

  if (!e) e = window.event;
  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + body.scrollLeft + root.scrollLeft;
    posy = e.clientY + body.scrollTop + root.scrollTop;
  }

  return { x: posx, y: posy }
}

const canUseWebP = () => {
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');

  if (ctx) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  return false;
}

export { MathUtils, calcWinsize, getMousePos, canUseWebP };
