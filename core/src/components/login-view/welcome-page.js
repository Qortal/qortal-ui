import { html, LitElement } from 'lit'
import { welcomePageStyles } from '../../styles/core-css'
import '@material/mwc-button'

// Multi language support
import { translate } from '../../../translate'

class WelcomePage extends LitElement {
	static get properties() {
		return {
			hideNav: { type: Boolean, notify: true },
			theme: { type: String, reflect: true }
		}
	}

	static get styles() {
		return [welcomePageStyles]
	}

	constructor() {
		super()
		this.hideNav = true
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
	}

	render() {
		return html`
			<div class="welcome-page">
				<mwc-button class="button-outline" @click=${() => this.navigate('login')} outlined>${translate("login.login")}</mwc-button>
				<mwc-button class="button-outline" @click=${() => this.navigate('create-account')} outlined>${translate("login.createaccount")}</mwc-button>
			</div>
		`
	}

	navigate(page) {
		this.dispatchEvent(new CustomEvent('navigate', {
			detail: { page },
			bubbles: true,
			composed: true
		}))
	}
}

window.customElements.define('welcome-page', WelcomePage)