import { LitElement, html, css } from 'lit'
import { svgSun, svgMoon } from '../../assets/js/svg.js'

class QortThemeToggle extends LitElement {
  static get properties() {
    return {
      theme: {
        type: String,
        reflect: true
      }
    }
  }

  constructor() {
    super();
    this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light';
  }

  static styles = [
    css`
      :host {
        display: inline-block;
        position: relative;
        width: 54px;
        height: 32px;
        transform: translateY(-2px);
      }

      svg {
        width: 32px;
        height: 32px;
      }

      input {
        cursor: pointer;
        position: absolute;
        z-index: 1;
        opacity: 0;
        width: 100%;
        height: 100%;
      }

      .slider {
        position: absolute;
        cursor: pointer;
        width: 100%;
        height: 16px;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 1rem;
        background-color: var(--graylight);
        transition: all .4s ease;
      }

      .icon {
        width: 32px;
        height: 32px;
        display: inline-block;
        position: absolute;
        top: 50%;
        background: var(--graylight);
        border: 2px solid var(--gray);
        border-radius: 50%;
        transition: transform 300ms ease;
      }

      :host([theme="light"]) .icon {
        transform: translate(0, -50%);
      }

      input:checked ~ .icon,
      :host([theme="dark"]) .icon {
        transform: translate(calc(100% - 18px), -50%);
      }

      .moon {
        display: none;
      }

      .moon svg {
        transform: scale(0.6);
      }

      :host([theme="dark"]) .sun {
        display: none;
      }

      :host([theme="dark"]) .moon {
        display: inline-block;
      }
    `
  ];

  render() {
    return html`
      <input type="checkbox" @change=${() => this.toggleTheme()}/>
      <div class="slider"></div>
      <div class="icon">
        <span class="sun">${svgSun}</span>
        <span class="moon">${svgMoon}</span>
      </div>
    `;
  }

  firstUpdated() {
    this.initTheme();
  }


  toggleTheme() {
    if (this.theme === 'light') {
      this.theme = 'dark';
    } else {
      this.theme = 'light';
    }

    this.dispatchEvent(
      new CustomEvent('qort-theme-change', {
        bubbles: true,
        composed: true,
        detail: this.theme,
      }),
    );

    window.localStorage.setItem('qortalTheme', this.theme);
    this.initTheme();
  }

  initTheme() {
    document.querySelector('html').setAttribute('theme', this.theme);
  }
}

window.customElements.define('qort-theme-toggle', QortThemeToggle);