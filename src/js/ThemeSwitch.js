const NAME = 'theme-switch';
const DARK = 'dark';
const LIGHT = 'light';
const NO_PREFERENCE = 'no-preference';
const MQ_DARK = `(prefers-color-scheme: ${DARK})`;
const MQ_LIGHT = `(prefers-color-scheme: ${LIGHT}), (prefers-color-scheme: ${NO_PREFERENCE})`;
const COLOR_SCHEME_CHANGE = 'colorschemechange';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    *,::after,::before{box-sizing:border-box}:host{contain:content;display:block}form{padding:0;background:transparent;color:inherit}fieldset{border:0;margin:0;padding:0}legend{font:inherit;padding:0;margin-block-end:0.5rem;}input,label{cursor:pointer}

    input {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      position: absolute;
      pointer-events: none;
      margin: 0;
      border: 0;
      padding: 0;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }

    input:focus:not(:focus-visible) + label {
      outline: 0;
    }

    input:focus-visible + label {
      --${NAME}-border-color: var(--accent);
      /*
      outline: var(--accent) dotted 2px;
      outline-offset: 2px; */
    }

    label {
      display: inline-block;
      border-width: 1px;
      border-style: solid;
      border-color: var(--${NAME}-border-color);
      padding: 0.15rem;
      font-size: 14px;
      line-height: 1;
      vertical-align: top;
      margin-inline-end: 0.5rem;
      transition-delay: 0s;
      transition-duration: 150ms;
      transition-property: border-color, filter;
      transition-timing-function: ease-in-out;
    }

    label::before {
      content: '';
      display: inline-block;
      background-size: var(--${NAME}-icon-size, 1rem);
      background-repeat: no-repeat;
      width: var(--${NAME}-icon-size, 1rem);
      height: var(--${NAME}-icon-size, 1rem);
      filter: var(--${NAME}-icon-filter, none);
      vertical-align: middle;
    }

    input:checked + #darkLabel::before,
    input:checked + #lightLabel::before {
    }

    #darkLabel::before {
      background-image: var(--${NAME}-${DARK}-icon, var(--moon));
    }

    #lightLabel::before {
      background-image: var(--${NAME}-${LIGHT}-icon, var(--sun));
    }

    @media (hover: hover) {
      label:hover {
        --${NAME}-border-color: var(--accent);
      }
    }
  </style>
  <form>
    <fieldset>
      <!--<legend>Поменять оформление:</legend>-->
      <input id="lightRadio" type="radio" name="mode" value="${LIGHT}">
      <label id="lightLabel" for="lightRadio"></label>
      <input id="darkRadio" type="radio" name="mode" value="${DARK}">
      <label id="darkLabel" for="darkRadio"></label>
    </fieldset>
  </form>
`;

export class ThemeSwitch extends HTMLElement {
  constructor() {
    super();

    document.addEventListener(COLOR_SCHEME_CHANGE, (event) => {
      this.mode = event.detail.colorScheme;
      this._updateRadios();
      this._updateLabels();
    });

    this._initializeDOM();
  }

  _initializeDOM() {
    const shadowRoot = this.attachShadow({mode: 'closed'});
    shadowRoot.appendChild(template.content.cloneNode(true));

    this._lightRadio = shadowRoot.querySelector('#lightRadio');
    this._lightLabel = shadowRoot.querySelector('#lightLabel');
    this._darkRadio = shadowRoot.querySelector('#darkRadio');
    this._darkLabel = shadowRoot.querySelector('#darkLabel');

    const hasNativePrefersColorScheme = matchMedia(MQ_DARK).media !== 'not all';

    if (hasNativePrefersColorScheme) {
      matchMedia(MQ_DARK).addListener(({matches}) => {
        this.mode = matches ? DARK : LIGHT;
        this._dispatchEvent(COLOR_SCHEME_CHANGE, {colorScheme: this.mode});
      });
    }

    if (!this.mode) {
      this.mode = DARK;
    }

    this._updateRadios();

    [this._lightRadio, this._darkRadio].forEach((input) => {
      input.addEventListener('change', e => {
        if (e.target.checked) {
          this.mode = e.target.value;
          this._dispatchEvent(COLOR_SCHEME_CHANGE, {colorScheme: this.mode})
        }
      }, false);
    });
  }

  _dispatchEvent(type, value) {
    this.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      composed: true,
      detail: value,
    }));
  }

  _updateRadios() {
    if (this.mode === LIGHT) {
      this._lightRadio.checked = true;
    } else {
      this._darkRadio.checked = true;
    }
  }

  _updateLabels() {
    [this._lightLabel, this._darkLabel].forEach((label) => {
      if (this.mode === LIGHT) {
        label.style.setProperty(`--${NAME}-icon-filter`, 'invert(100%)');
      } else {
        label.style.setProperty(`--${NAME}-icon-filter`, 'none');
      }
    });
  }
}

window.customElements.define(NAME, ThemeSwitch);
