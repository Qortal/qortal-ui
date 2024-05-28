import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store'
import { qrLoginViewStyles } from '../../styles/core-css'
import '../../../../plugins/plugins/core/components/QortalQrcodeGenerator'
import '@material/mwc-icon'
import '@material/mwc-textfield'
import '@vaadin/password-field/vaadin-password-field.js'

// Multi language support
import { translate } from '../../../translate'

class QRLoginView extends connect(store)(LitElement) {
	static get properties() {
		return {
			theme: { type: String, reflect: true },
			savedWalletDataJson: { type: String },
			translateDescriptionKey: { type: String },
			translateButtonKey: { type: String }
		}
	}

	static get styles() {
		return [qrLoginViewStyles]
	}

	constructor() {
		super()
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
		this.translateDescriptionKey = 'settings.qr_login_description_' + (this.isWalletStored() ? '1' : '2')
		this.translateButtonKey = 'settings.qr_login_button_' + (this.isWalletStored() ? '1' : '2')
	}

	render() {
		return html`
			<div style="position: relative;" >
				<div class="center-box">
					<p>
						${translate(this.translateDescriptionKey)}
					</p>
					<div style="max-width: 500px; justify-content: center; margin: auto; display: ${this.isWalletStored() ? 'none' : 'flex'}">
						<mwc-icon style="padding: 10px; padding-left:0; padding-top: 42px;">password</mwc-icon>
						<vaadin-password-field id="newWalletPassword" style="width: 100%; color: var(--black);" label="${translate("settings.password")}"  autofocus></vaadin-password-field>
					</div>
					<div style="max-width: 600px; display: flex; justify-content: center; margin: auto;">
						<div id="qr-toggle-button" @click=${() => this.showQRCode()} class="q-button outlined"> ${translate(this.translateButtonKey)} </div>
					</div>
					<div id="login-qr-code" style="display: none;">
						<qortal-qrcode-generator id="login-qr-code" data="${this.savedWalletDataJson}" mode="octet" format="html" auto></qortal-qrcode-generator>
					</div>
				</div>
			</div>
		`
	}

	isWalletStored() {
		const state = store.getState()
		const address0 = state.app.wallet._addresses[0].address
		const savedWalletData = state.user.storedWallets && state.user.storedWallets[address0]

		return !!savedWalletData
	}

	async setSavedWalletDataJson() {
		const state = store.getState()

		let data

		if (this.isWalletStored()) {
			const address0 = state.app.wallet._addresses[0].address

			data = state.user.storedWallets[address0]
		} else {
			const password = this.shadowRoot.getElementById('newWalletPassword').value

			data = await state.app.wallet.generateSaveWalletData(password, state.config.crypto.kdfThreads, () => { })
		}

		this.savedWalletDataJson = JSON.stringify(data)
	}

	async showQRCode() {
		await this.setSavedWalletDataJson()

		let el = this.shadowRoot.getElementById('login-qr-code')

		el.style.display = 'flex'
	}
}

window.customElements.define('qr-login-view', QRLoginView)