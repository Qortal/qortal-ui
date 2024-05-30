import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store.js'
import { doLogout } from '../../redux/app/app-actions.js'
import { logoutViewStyles } from '../../styles/core-css'
import '@material/mwc-button'
import '@polymer/paper-dialog/paper-dialog.js'

// Multi language support
import { translate } from '../../../translate'

class LogoutView extends connect(store)(LitElement) {
	static get properties() {
		return {
			theme: { type: String, reflect: true }
		}
	}

	static get styles() {
		return [logoutViewStyles]
	}

	constructor() {
		super()
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
	}

	render() {
		return html`
			<paper-dialog style="background: var(--white);" id="userLogoutDialog" modal>
				<div style="text-align: center;">
					<h2 style="color: var(--black);">Qortal UI</h2>
					<hr>
				</div>
				<div style="text-align: center;">
					<h2 style="color: var(--black);">${translate("logout.confirmlogout")}</h2>
				</div>
				<div class="buttons">
					<mwc-button class='decline' @click=${() => this.decline()} dialog-dismiss>${translate("general.no")}</mwc-button>
					<mwc-button class='confirm' @click=${e => this.confirm(e)} dialog-confirm autofocus>${translate("general.yes")}</mwc-button>
				</div>
			</paper-dialog>
		`
	}

	openLogout() {
		this.shadowRoot.getElementById('userLogoutDialog').open()
	}

	async confirm(e) {
		store.dispatch(doLogout())
		e.stopPropagation()
	}

	decline() {
		this.shadowRoot.getElementById('userLogoutDialog').close()
		this.requestUpdate()
	}
}

window.customElements.define('logout-view', LogoutView)