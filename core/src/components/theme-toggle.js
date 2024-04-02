import {css, html, LitElement} from 'lit'
import {translate} from '../../translate'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/iron-icons/image-icons.js'
import '@polymer/iron-icons/iron-icons.js'

class ThemeToggle extends LitElement {
	static get properties() {
		return {
			theme: { type: String, reflect: true}
		}
	}

	constructor() {
		super()
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
	}

	static styles = [
		css`
			* {
				--mdc-theme-primary: rgb(3, 169, 244);
				--mdc-theme-secondary: var(--mdc-theme-primary);
				--mdc-theme-error: rgb(255, 89, 89);
				--lumo-primary-text-color: rgb(0, 167, 245);
				--lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
				--lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
				--lumo-primary-color: hsl(199, 100%, 48%);
				--lumo-base-color: var(--white);
				--lumo-body-text-color: var(--black);
				--lumo-secondary-text-color: var(--sectxt);
				--lumo-contrast-60pct: var(--vdicon);
				--item-selected-color: var(--nav-selected-color);
				--item-selected-color-text: var(--nav-selected-color-text);
				--item-color-active: var(--nav-color-active);
				--item-color-hover: var(--nav-color-hover);
				--item-text-color: var(--nav-text-color);
				--item-icon-color: var(--nav-icon-color);
				--item-border-color: var(--nav-border-color);
				--item-border-selected-color: var(--nav-border-selected-color);
			}

			.light-mode {
				display: none;
			}

			:host([theme="light"]) .light-mode {
				display: inline-block;
			}

			.dark-mode {
				display: none;
			}

			:host([theme="dark"]) .dark-mode {
				display: inline-block;
			}

			:host([theme="dark"]) paper-icon-button {
				-ms-transform: rotate(120deg);
				transform: rotate(120deg);
			}
		`
	]

	render() {
		return html`
			<div style="display: inline;">
				<paper-icon-button class="light-mode" icon="image:wb-sunny" @click=${() => this.toggleTheme()} title="${translate("info.inf18")}"></paper-icon-button>
				<paper-icon-button class="dark-mode" icon="image:brightness-3" @click=${() => this.toggleTheme()} title="${translate("info.inf17")}"></paper-icon-button>
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

		this.dispatchEvent(new CustomEvent('qort-theme-change', {
			bubbles: true,
			composed: true,
			detail: this.theme,
		}))

		window.localStorage.setItem('qortalTheme', this.theme)
		this.initTheme()
	}

	initTheme() {
		document.querySelector('html').setAttribute('theme', this.theme);
	}
}

window.customElements.define('theme-toggle', ThemeToggle);
