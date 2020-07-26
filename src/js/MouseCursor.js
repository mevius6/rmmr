import { gsap } from 'gsap';
import { MathUtils, getMousePos } from './utils';
import { EventEmitter } from 'events';

let mouse = {x: 0, y: 0};
window.addEventListener('mousemove', ev => mouse = getMousePos(ev));

export default class MouseCursor extends EventEmitter {
  constructor(el) {
    super();
    this.DOM = {cursor: el};
    this.DOM.cursorInner = this.DOM.cursor.querySelector('.cursor__inner');

    this.filterId = '#Distortion';
    this.DOM.feTurbulence = document.querySelector(`${this.filterId} > feTurbulence`);

    this.primitiveValues = {turb: 0};

    this._createTimeline();

    this.rect = this.DOM.cursor.getBoundingClientRect();

    this.renderedStyles = {
      tx: {
        previous: 0,
        current: 0,
        amt: 0.2
      },
      ty: {
        previous: 0,
        current: 0,
        amt: 0.2
      },
      radius: {
        previous: 60,
        current: 60,
        amt: 0.2
      },
      stroke: {
        previous: 1,
        current: 1,
        amt: 0.2
      }
    };

    this._listen();

    requestAnimationFrame(() => this._render());
  }

  _render() {
    this.renderedStyles['tx'].current = mouse.x - this.rect.width/2;
    this.renderedStyles['ty'].current = mouse.y - this.rect.height/2;

    for (const key in this.renderedStyles ) {
      this.renderedStyles[key].previous = MathUtils.lerp(
        this.renderedStyles[key].previous,
        this.renderedStyles[key].current,
        this.renderedStyles[key].amt
      );
    }

    this.DOM.cursor.style.setProperty('--tx', this.renderedStyles['tx'].previous + 'px');
    this.DOM.cursor.style.setProperty('--ty', this.renderedStyles['ty'].previous + 'px');
    this.DOM.cursorInner.setAttribute('r', this.renderedStyles['radius'].previous);
    this.DOM.cursorInner.style.setProperty('--cursor-stroke-width', this.renderedStyles['stroke'].previous) + 'px';

    requestAnimationFrame(() => this._render());
  }

  _createTimeline() {
    this.tl = gsap.timeline({
      paused: true,
      onStart: () => {
        this.DOM.cursorInner.style.setProperty('--cursor-svg-filter', `url(${this.filterId})`);
      },
      onUpdate: () => {
        this.DOM.feTurbulence.setAttribute('baseFrequency', this.primitiveValues.turb);
      },
      onComplete: () => {
        this.DOM.cursorInner.style.setProperty('--cursor-svg-filter', 'none');
      }
    })
      .to(this.primitiveValues, {
        duration: 0.4,
        ease: "rough({template: none.out, strength: 2, points: 120, taper: 'none', randomize: true, clamp: false})",
        startAt: {turb: 0.07},
        turb: 0
      });
  }

  _enter() {
    this.renderedStyles['radius'].current = 40;
    this.renderedStyles['stroke'].current = 3;
    this.tl.restart();
  }

  _leave() {
    this.renderedStyles['radius'].current = 60;
    this.renderedStyles['stroke'].current = 1;
    this.tl.progress(1).kill();
  }

  _listen() {
    this.on('enter', () => this._enter());
    this.on('leave', () => this._leave());
  }
}
