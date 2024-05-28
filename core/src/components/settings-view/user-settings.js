import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store'
import { userSettingsStyles } from '../../styles/core-css'
import './account-view'
import './export-keys'
import './notifications-view'
import './qr-login-view'
import './security-view'
import '@material/mwc-button'
import '@polymer/paper-dialog/paper-dialog.js'

// Multi language support
import { translate } from '../../../translate'

class UserSettings extends connect(store)(LitElement) {
	static get properties() {
		return {
			loggedIn: { type: Boolean },
			pages: { type: Array },
			selectedView: { type: Object },
			theme: { type: String, reflect: true }
		}
	}

	static get styles() {
		return [userSettingsStyles]
	}

	constructor() {
		super()
		this.selectedView = { id: 'info', name: 'General Account Info' }
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
	}

	render() {
		return html`
			<paper-dialog id="userSettingsDialog" class="userSettings" modal>
				<div class="actions">
					<h2></h2>
					<mwc-icon class="close-icon" @click=${() => this.closeSettings()} title="Close Settings" >highlight_off</mwc-icon>
				</div>
				<div class="container">
					<div class="wrapper">
						<div class="leftBar" style="display: table; width: 100%;">
							<div class="slug">Qortal UI ${translate("settings.settings")}</div>
							<ul>
								<li @click=${() => this.setSettingsView('info')} ><a class=${this.selectedView.id === 'info' ? 'active' : ''} href="javascript:void(0)">${translate("settings.account")}</a></li>
								<li @click=${() => this.setSettingsView('security')} ><a class=${this.selectedView.id === 'security' ? 'active' : ''} href="javascript:void(0)">${translate("settings.security")}</a></li>
								<li @click=${() => this.setSettingsView('export')} ><a class=${this.selectedView.id === 'export' ? 'active' : ''} href="javascript:void(0)">${translate("settings.exp1")}</a></li>
								<li @click=${() => this.setSettingsView('qr-login')} ><a class=${this.selectedView.id === 'qr-login' ? 'active' : ''} href="javascript:void(0)">${translate("settings.qr_login_menu_item")}</a></li>
								<li @click=${() => this.setSettingsView('notification')} ><a class=${this.selectedView.id === 'notification' ? 'active' : ''} href="javascript:void(0)">${translate("settings.notifications")}</a></li>
							</ul>
						</div>
						<div class="mainPage">
							<h1>${this.renderHeaderViews()}</h1>
							<hr>
							${html`${this.renderSettingViews(this.selectedView)}`}
						</div>
					</div>
				</div>
			</paper-dialog>
		`
	}

	stateChanged(state) {
		this.loggedIn = state.app.loggedIn
	}

	renderSettingViews(selectedView) {
		if (selectedView.id === 'info') {
			return html`<account-view></account-view>`
		} else if (selectedView.id === 'security') {
			return html`<security-view .closeSettings=${() => this.closeSettings()}></security-view>`
		} else if (selectedView.id === 'export') {
			return html`<export-keys></export-keys>`
		} else if (selectedView.id === 'notification') {
			return html`<notifications-view></notifications-view>`
		} else if (selectedView.id === 'qr-login') {
			return html`<qr-login-view></qr-login-view>`
		}
	}

	renderHeaderViews() {
		if (this.selectedView.id === 'info') {
			return html`${translate("settings.generalinfo")}`
		} else if (this.selectedView.id === 'security') {
			return html`${translate("settings.accountsecurity")}`
		} else if (this.selectedView.id === 'export') {
			return html`${translate("settings.exp1")}`
		} else if (this.selectedView.id === 'notification') {
			return html`UI ${translate("settings.notifications")}`
		} else if (this.selectedView.id === 'qr-login') {
			return html`${translate("settings.qr_login_menu_item")}`
		}
	}

	setSettingsView(pageId) {
		if (pageId === 'info') {
			return this.selectedView = { id: 'info', name: 'General Account Info' }
		} else if (pageId === 'security') {
			return this.selectedView = { id: 'security', name: 'Account Security' }
		} else if (pageId === 'export') {
			return this.selectedView = { id: 'export', name: 'Export Master Keys' }
		} else if (pageId === 'notification') {
			return this.selectedView = { id: 'notification', name: 'UI Notifications' }
		} else if (pageId === 'qr-login') {
			return this.selectedView = { id: 'qr-login', name: 'QR Login' }
		}
	}

	openSettings() {
		if (this.loggedIn) {
			this.shadowRoot.getElementById('userSettingsDialog').open()
		}
	}

	closeSettings() {
		this.shadowRoot.getElementById('userSettingsDialog').close()
		this.cleanUp()
	}

	cleanUp() {
		this.selectedView = { id: 'info', name: 'General Account Info' }
	}
}

window.customElements.define('user-settings', UserSettings)