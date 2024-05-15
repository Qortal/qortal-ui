import { html, LitElement } from 'lit'
import './app-theme'
import './styles.scss'

class AppStyles extends LitElement {
	static get properties() {
		return {
		}
	}

	constructor() {
		super()
		this.windowHeight = html`100vh`
		window.addEventListener('resize', () => this._windowResized())
		this._windowResized()
	}

	render() {
		return html`
 			<style>
				* {
					font-family: "Roboto", sans-serif;
					color: var(--mdc-theme-on-surface);
					--window-height: ${this.windowHeight};
					--shadow-1: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
					--shadow-2: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
					--shadow-3: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
					--shadow-4: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
					--shadow-5: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
					--paper-input-container-focus-color: var(--mdc-theme-secondary);
				}

				hr {
					border-color: var(--theme-on-surface);
				}
 			</style>
			<app-theme></app-theme>
		`
	}

	firstUpdated() {
		// ...
	}

	 /* Disable shadow DOM, so that the styles DO bleed */
	createRenderRoot() {
		return this
	}

	// For mobile chrome's address bar
	_windowResized() {
		const ua = navigator.userAgent
		const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)
		const isChrome = /Chrome/i.test(ua)
		const isSafari = /Version\/[\d\.]+.*Safari/.test(ua)

		if (isMobile && isChrome) {
			this.windowHeight = html`calc(100vh - 56px)`
		} else if (isMobile && isSafari) {
			this.windowHeight = html`calc(100vh - 72px)`
		} else {
			this.windowHeight = html`100vh`
		}
	}
}

window.customElements.define('app-styles', AppStyles)