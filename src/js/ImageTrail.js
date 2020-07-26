import { gsap } from "gsap";
import { MathUtils, getMousePos } from "./utils";

// calculate the viewport size
let winsize;
const calcWinsize = () => winsize = {width: window.innerWidth, height: window.innerHeight};
calcWinsize();
// and recalculate on resize
window.addEventListener('resize', calcWinsize);

// mousePos: current mouse position
// cacheMousePos: previous mouse position
// lastMousePos: last recorded mouse position (at the time the last image was shown)
let mousePos      = {x: 0, y: 0},
    lastMousePos  = mousePos,
    cacheMousePos = lastMousePos;

let section = document.querySelector('.hero');
// update the mouse position
section.addEventListener('mousemove', ev => mousePos = getMousePos(ev));

// gets the distance from the current mouse position to the last recorded mouse position
const getMouseDistance = () => MathUtils.distance(mousePos.x,mousePos.y,lastMousePos.x,lastMousePos.y);

class Image {
  constructor(el) {
    this.DOM = {el: el};
    // image deafult styles
    this.defaultStyle = {
      scaleX: 1,
      scaleY: 1,
      x: 0,
      y: 0,
      opacity: 0
    };
    // get sizes/position
    this.getRect();
    // init/bind events
    this.initEvents();
  }
  initEvents() {
    // on resize get updated sizes/position
    window.addEventListener('resize', () => this.resize());
  }
  resize() {
    // reset styles
    gsap.set(this.DOM.el, this.defaultStyle);
    // get sizes/position
    this.getRect();
  }
  getRect() {
    this.rect = this.DOM.el.getBoundingClientRect();
  }
  isActive() {
    // check if image is animating or if it's visible
    return gsap.isTweening(this.DOM.el) || this.DOM.el.style.opacity != 0;
  }
}

class ImageTrail {
  constructor() {
    // images container
    this.DOM = {content: section};
    // array of Image objs, one per image element
    this.images = [];
    [...this.DOM.content.querySelectorAll('picture')].forEach(picture => this.images.push(new Image(picture)));
    // total number of images
    this.imagesTotal = this.images.length;
    // upcoming image index
    this.imgPosition = 0;
    // zIndex value to apply to the upcoming image
    this.zIndexVal = 1;
    // mouse distance required to show the next image
    this.threshold = 100;
    // render the images
    requestAnimationFrame(() => this.render());
  }
  render() {
    // get distance between the current mouse position and the position of the previous image
    let distance = getMouseDistance();
    // cache previous mouse position
    cacheMousePos.x = MathUtils.lerp(cacheMousePos.x || mousePos.x, mousePos.x, 0.1);
    cacheMousePos.y = MathUtils.lerp(cacheMousePos.y || mousePos.y, mousePos.y, 0.1);

    // if the mouse moved more than [this.threshold] then show the next image
    if ( distance > this.threshold ) {
      this.showNextImage();

      ++this.zIndexVal;
      this.imgPosition = this.imgPosition < this.imagesTotal-1 ? this.imgPosition+1 : 0;

      lastMousePos = mousePos;
    }

    // check when mousemove stops and all images are inactive (not visible and not animating)
    let isIdle = true;
    for (let img of this.images) {
      if ( img.isActive() ) {
        isIdle = false;
        break;
      }
    }
    // reset z-index initial value
    if ( isIdle && this.zIndexVal !== 1 ) {
      this.zIndexVal = 1;
    }

    // loop..
    requestAnimationFrame(() => this.render());
  }
  showNextImage() {
    // show image at position [this.imgPosition]
    const img = this.images[this.imgPosition];
    // kill any tween on the image
    gsap.killTweensOf(img.DOM.el);

    const tl = gsap.timeline();
    // show the image
    tl.set(img.DOM.el, {
      startAt: {opacity: 0},
      opacity: 1,
      scaleX: 1,
      scaleY: 1,
      zIndex: this.zIndexVal,
      x: mousePos.x - img.rect.width/2,
      y: mousePos.y - img.rect.height/2,
      transformOrigin: '50% -10%'
    }, 0)
      .to(img.DOM.el, 0.5, {
        ease: "power1.out",
        opacity: 0
      }, 0.4)
      .to(img.DOM.el, 0.2, {
        ease: "quad.in",
        scaleX: 0.5,
        scaleY: 2
      }, 0.4)
      .to(img.DOM.el, 0.5, {
        ease: "expo.out",
        scaleX: 0.7,
        scaleY: 1.7,
        y: `+=${MathUtils.getRandomFloat(winsize.height/2,winsize.height)}`
      }, 0.6);
  }
}

export { ImageTrail };
