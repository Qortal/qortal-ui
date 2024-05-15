import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store'
import { accountViewStyles } from '../../styles/core-css'

// Multi language support
import { get, translate } from '../../../translate'

class AccountView extends connect(store)(LitElement) {
	static get properties() {
		return {
			accountInfo: { type: Object },
			switchAvatar: { type: String },
			theme: { type: String, reflect: true }
		}
	}

	static get styles() {
		return [accountViewStyles]
	}

	constructor() {
		super()
		this.accountInfo = store.getState().app.accountInfo
		this.switchAvatar = ''
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
	}

	render() {
		return html`
			<div class="sub-main">
				<div class="center-box">
					<div class="img-icon">${this.getAvatar()}</div>
					<span id="accountName">
						${this.accountInfo.names.length !== 0 ? this.accountInfo.names[0].name : get("chatpage.cchange15")}
					</span>
					<div class="content-box">
						<span class="title">${translate("settings.address")}: </span>
						<span class="value">${store.getState().app.selectedAddress.address}</span>
						<br/>
						<span class="title">${translate("settings.publickey")}: </span>
						<span class="value">${store.getState().app.selectedAddress.base58PublicKey}</span>
					</div>
				</div>
			</div>
		`
	}

	firstUpdated() {
		this.getSwitchAvatar()

		setInterval(() => {
			this.getSwitchAvatar()
		}, 10000)
	}

	getAvatar() {
		if (this.switchAvatar === 'light') {
			if (this.accountInfo.names.length === 0) {
				return html`<img src="/img/noavatar_light.png" style="width:150px; height:150px; border-radius: 25%;">`
			} else {
				const avatarName = this.accountInfo.names[0].name
				const avatarNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
				const avatarUrl = avatarNode.protocol + '://' + avatarNode.domain + ':' + avatarNode.port
				const url = `${avatarUrl}/arbitrary/THUMBNAIL/${avatarName}/qortal_avatar?async=true`

				return html`<img src="${url}" style="width:150px; height:150px; border-radius: 25%;" onerror="this.src='/img/noavatar_light.png';">`
			}
		} else if (this.switchAvatar === 'dark') {
			if (this.accountInfo.names.length === 0) {
				return html`<img src="/img/noavatar_dark.png" style="width:150px; height:150px; border-radius: 25%;">`
			} else {
				const avatarName = this.accountInfo.names[0].name
				const avatarNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
				const avatarUrl = avatarNode.protocol + '://' + avatarNode.domain + ':' + avatarNode.port
				const url = `${avatarUrl}/arbitrary/THUMBNAIL/${avatarName}/qortal_avatar?async=true`

				return html`<img src="${url}" style="width:150px; height:150px; border-radius: 25%;" onerror="this.src='/img/noavatar_dark.png';">`
			}
		}
	}

	getSwitchAvatar() {
		this.switchAvatar = localStorage.getItem('qortalTheme')
	}

	stateChanged(state) {
		this.accountInfo = state.app.accountInfo
	}
}

window.customElements.define('account-view', AccountView)