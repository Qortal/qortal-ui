import { html, LitElement } from 'lit'
import { themeToggleStyles } from '../styles/core-css'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/iron-icons/image-icons.js'
import '@polymer/iron-icons/iron-icons.js'

// Multi language support
import { translate } from '../../translate'

class ThemeToggle extends LitElement {
	static get properties() {
		return {
			theme: { type: String, reflect: true}
		}
	}

	static get styles() {
		return [themeToggleStyles]
	}

	constructor() {
		super()
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
	}

	render() {
		return html`
			<div style="display: inline;">
				<paper-icon-button class="light-mode" icon="image:brightness-3" @click=${() => this.toggleTheme()} title="${translate("info.inf18")}"></paper-icon-button>
				<paper-icon-button class="dark-mode" icon="image:wb-sunny" @click=${() => this.toggleTheme()} title="${translate("info.inf17")}"></paper-icon-button>
			</div>
		`
	}

	firstUpdated() {
		this.initTheme()
	}


	toggleTheme() {
		if (this.theme === 'light') {
			this.theme = 'dark'
		} else {
			this.theme = 'light'
		}

		this.dispatchEvent(new CustomEvent('qort-theme-change', {
			bubbles: true,
			composed: true,
			detail: this.theme
		}))

		window.localStorage.setItem('qortalTheme', this.theme)

		this.initTheme()
	}

	initTheme() {
		document.querySelector('html').setAttribute('theme', this.theme)
	}
}

window.customElements.define('theme-toggle', ThemeToggle)