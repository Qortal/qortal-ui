import { html, LitElement } from 'lit'
import { svgMoon, svgSun } from '../../assets/js/svg'
import { qortThemeToggleStyles } from '../styles/core-css'

class QortThemeToggle extends LitElement {
	static get properties() {
		return {
			theme: { type: String, reflect: true }
		}
	}

	constructor() {
		super()
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
	}

	static get styles() {
		return [qortThemeToggleStyles]
	}

	render() {
		return html`
			<input type="button" @click=${() => this.toggleTheme()}/>
			<div class="icon">
				<span class="sun">${svgSun}</span>
				<span class="moon">${svgMoon}</span>
			</div>
		`
	}

	firstUpdated() {
		this.initTheme()
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
				detail: this.theme
			})
		)

		window.localStorage.setItem('qortalTheme', this.theme)

		this.initTheme()
	}

	initTheme() {
		document.querySelector('html').setAttribute('theme', this.theme)
	}
}

window.customElements.define('qort-theme-toggle', QortThemeToggle)