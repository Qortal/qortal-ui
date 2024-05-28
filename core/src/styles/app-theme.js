import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../store'

class AppTheme extends connect(store)(LitElement) {
	static get properties() {
		return {
			styles: { type: Object },
			theme: { type: Object }
		}
	}

	constructor() {
		super()
	}

	render() {
		return html`
 			<style>
				*,
				html {
					--mdc-theme-primary: ${this.theme.colors.primary};
					--mdc-theme-primary-bg: ${this.theme.colors.primaryBg};
					--mdc-theme-on-primary: ${this.theme.colors.onPrimary};
					--mdc-theme-secondary: ${this.theme.colors.secondary};
					--mdc-theme-secondary-bg: ${this.theme.colors.secondaryBg};
					--mdc-theme-on-secondary: ${this.theme.colors.onSecondary};
					--mdc-theme-surface: ${this.theme.colors.surface};
					--mdc-theme-on-surface: ${this.theme.colors.onSurface};
					--mdc-theme-background: ${this.theme.colors.background};
					--mdc-theme-error: ${this.theme.colors.error};
					--mdc-theme-warning: ${this.theme.colors.warning};
					--layout-breakpoint-tablet: ${this.styles.breakpoints.tablet};
					--layout-breakpoint-desktop: ${this.styles.breakpoints.desktop};
					--layout-breakpoint-mobile: ${this.styles.breakpoints.mobile};
				}

				paper-spinner-lite,
				paper-spinner {
					--paper-spinner-color: var(--mdc-theme-secondary)
				}
 			</style>
		`
	}

	firstUpdated() {
		// ...
	}

	/* Disable shady css, so that the styles DO bleed */
	createRenderRoot() {
		return this
	}

	stateChanged(state) {
		this.styles = state.config.styles
		this.theme = this.styles.theme
	}
}

window.customElements.define('app-theme', AppTheme)