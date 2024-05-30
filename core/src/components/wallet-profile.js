import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../store'
import { walletProfileStyles } from '../styles/core-css'

// Multi language support
import { translate } from '../../translate'

class WalletProfile extends connect(store)(LitElement) {
	static get properties() {
		return {
			wallet: { type: Object },
			nodeConfig: { type: Object },
			accountInfo: { type: Object },
			theme: { type: String, reflect: true }
		}
	}

	static get styles() {
		return [walletProfileStyles]
	}

	constructor() {
		super()
		this.wallet = {}
		this.nodeConfig = {}
		this.accountInfo = {
			names: [],
			addressInfo: {}
		}
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
	}

	render() {
		return html`
			<div id="profileInMenu">
				<div style="padding: 8px 0;">
					<div id="accountName">
						<div id="child inline-block-child" class="full-info-logo">${this.getAvatar()}</div>
						&nbsp;&nbsp;&nbsp;
						<div id="inline-block-child">
							<div>
								${this.accountInfo.names.length !== 0 ? this.accountInfo.names[0].name : ''}
							</div>
                            				<div>
								${this.accountInfo.addressInfo ? html`
									<span style="margin-bottom: 8px; display: inline-block; font-size: 14px;">
										${translate("walletprofile.minterlevel")} - <span style="color: #03a9f4;">${this.accountInfo.addressInfo.level} ${this.accountInfo.addressInfo.flags === 1 ? html`<strong>(F)</strong>` : ''}
									</span>
								` : ''}
							</div>
                            				<p id="blocksMinted">${translate("walletprofile.blocksminted")} - ${this.accountInfo.addressInfo.blocksMinted + this.accountInfo.addressInfo.blocksMintedAdjustment}</p>
						</div>
					</div>
					<p id="address">${this.wallet.addresses[0].address}</p>
				</div>
			</div>
		`
	}

	firstUpdated() {
		// ...
	}

	getAvatar() {
		if (this.accountInfo.names.length === 0) {
			return html`<img class="round-fullinfo" src="/img/incognito.png">`
		} else {
			const avatarNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
			const avatarUrl = avatarNode.protocol + '://' + avatarNode.domain + ':' + avatarNode.port
			const url = `${avatarUrl}/arbitrary/THUMBNAIL/${this.accountInfo.names[0].name}/qortal_avatar?async=true`

			return html`<img class="round-fullinfo" src="${url}" onerror="this.src='/img/incognito.png';" />`
		}
	}

	stateChanged(state) {
		this.wallet = state.app.wallet
		this.nodeConfig = state.app.nodeConfig
		this.accountInfo = state.app.accountInfo
	}
}

window.customElements.define('wallet-profile', WalletProfile)