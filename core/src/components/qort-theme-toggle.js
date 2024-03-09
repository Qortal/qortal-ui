import {css, html, LitElement} from 'lit'
import {svgMoon, svgSun} from '../../assets/js/svg.js'

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

      .icon {
        width: 32px;
        height: 32px;
        display: inline-block;
        position: absolute;
        top: 50%;
        background: var(--switchbackground);
        border: 2px solid var(--switchborder);
        border-radius: 50%;
        transition: transform 300ms ease;
      }

      .icon {
        transform: translate(0, -50%);
      }

      .sun {
        display: none;
      }

      :host([theme="light"]) .sun {
        display: inline-block;
      }

      .moon {
        display: none;
      }

      .moon svg {
        transform: scale(0.6);
      }

      :host([theme="dark"]) .moon {
        display: inline-block;
      }
    `
  ];

  render() {
    return html`
      <input type="button" @click=${() => this.toggleTheme()}/>
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
		switch (this.theme) {
			case 'light':
				this.theme = 'dark';
        break;
			case 'dark':
				this.theme = 'light';
        break;
			default:
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
