import {css, html, LitElement} from 'lit'
import {store} from '../../store'
import {connect} from 'pwa-helpers'
import {translate} from '../../../translate'

class CoreSyncStatus extends connect(store)(LitElement) {
	static get properties() {
		return {
			nodeInfos: { type: Array },
			coreInfos: { type: Array },
			theme: { type: String, reflect: true }
		}
	}

	constructor() {
		super()
		this.nodeInfos = []
		this.coreInfos = []
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
	}

	static get styles() {
		return css`
			.lineHeight {
				line-height: 33%;
			}

			.tooltip {
				display: inline-block;
				position: relative;
				text-align: left;
			}

			.tooltip .bottom {
				min-width: 200px;
				max-width: 250px;
				top: 35px;
				left: 50%;
				transform: translate(-50%, 0);
				padding: 10px 10px;
				color: var(--black);
				background-color: var(--white);
				font-weight: normal;
				font-size: 13px;
				border-radius: 8px;
				position: absolute;
				z-index: 99999999;
				box-sizing: border-box;
				box-shadow: 0 1px 8px rgba(0,0,0,0.5);
				border: 1px solid var(--black);
				visibility: hidden;
				opacity: 0;
				transition: opacity 0.8s;
			}

			.tooltip:hover .bottom {
				visibility: visible;
				opacity: 1;
			}

			.tooltip .bottom i {
				position: absolute;
				bottom: 100%;
				left: 50%;
				margin-left: -12px;
				width: 24px;
				height: 12px;
				overflow: hidden;
			}

			.tooltip .bottom i::after {
				content: '';
				position: absolute;
				width: 12px;
				height: 12px;
				left: 50%;
				transform: translate(-50%,50%) rotate(45deg);
				background-color: var(--white);
				border: 1px solid var(--black);
				box-shadow: 0 1px 8px rgba(0,0,0,0.5);
			}
		`
	}

	render() {
		return html`
			<div id="core-sync-status-id">
				${this.renderSyncStatusIcon()}
			</div>
		`
	}

	firstUpdated() {
		this.getNodeInfos()
		this.getCoreInfos()

		setInterval(() => {
			this.getNodeInfos()
			this.getCoreInfos()
		}, 30000)
	}


	async getNodeInfos() {
		const appInfoNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		const appInfoUrl = appInfoNode.protocol + '://' + appInfoNode.domain + ':' + appInfoNode.port
		const nodeInfoUrl = `${appInfoUrl}/admin/status`

		await fetch(nodeInfoUrl).then(response => {
			return response.json()
		}).then(data => {
			this.nodeInfos = data
		}).catch(err => {
			console.error('Request failed', err)
		})
	}

	async getCoreInfos() {
		const appCoreNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		const appCoreUrl = appCoreNode.protocol + '://' + appCoreNode.domain + ':' + appCoreNode.port
		const coreInfoUrl = `${appCoreUrl}/admin/info`

		await fetch(coreInfoUrl).then(response => {
			return response.json()
		}).then(data => {
			this.coreInfos = data
		}).catch(err => {
			console.error('Request failed', err)
		})
	}

	renderSyncStatusIcon() {
		if (this.nodeInfos.isSynchronizing === true && this.nodeInfos.syncPercent === 99) {
			return html`
				<div class="tooltip" style="display: inline;">
					<span><img src="/img/syncing.png" style="height: 24px; width: 24px; padding-top: 4px;"></span>
					<div class="bottom">
						<h3>${translate("walletprofile.wp3")}</h3>
						<h4 class="lineHeight">${translate("appinfo.coreversion")}: <span style="color: #03a9f4">${this.coreInfos.buildVersion ? (this.coreInfos.buildVersion).substring(0,12) : ''}</span></h4>
						<h4 class="lineHeight">${translate("appinfo.synchronizing")}... <span style="color: #03a9f4">${this.nodeInfos.syncPercent !== undefined ? this.nodeInfos.syncPercent + '%' : ''}</span></h4>
						<h4 class="lineHeight">${translate("appinfo.blockheight")}: <span style="color: #03a9f4">${this.nodeInfos.height ? this.nodeInfos.height : ''}</span></h4>
						<h4 class="lineHeight">${translate("appinfo.peers")}: <span style="color: #03a9f4">${this.nodeInfos.numberOfConnections ? this.nodeInfos.numberOfConnections : ''}</span></h4>
						<i></i>
					</div>
				</div>
			`
		} else if (this.nodeInfos.isSynchronizing === true && this.nodeInfos.isMintingPossible === false && this.nodeInfos.syncPercent === 100) {
			return html`
				<div class="tooltip" style="display: inline;">
					<span><img src="/img/synced.png" style="height: 24px; width: 24px; padding-top: 4px;"></span>
					<div class="bottom">
						<h3>${translate("walletprofile.wp3")}</h3>
						<h4 class="lineHeight">${translate("appinfo.coreversion")}: <span style="color: #03a9f4">${this.coreInfos.buildVersion ? (this.coreInfos.buildVersion).substring(0,12) : ''}</span></h4>
						<h4 class="lineHeight">${translate("walletprofile.wp4")} ${translate("walletprofile.wp2")}</h4>
						<h4 class="lineHeight">${translate("appinfo.blockheight")}: <span style="color: #03a9f4">${this.nodeInfos.height ? this.nodeInfos.height : ''}</span></h4>
						<h4 class="lineHeight">${translate("appinfo.peers")}: <span style="color: #03a9f4">${this.nodeInfos.numberOfConnections ? this.nodeInfos.numberOfConnections : ''}</span></h4>
						<i></i>
					</div>
				</div>
			`
		} else if (this.nodeInfos.isSynchronizing === false && this.nodeInfos.isMintingPossible === false && this.nodeInfos.syncPercent === 100) {
			return html`
				<div class="tooltip" style="display: inline;">
					<span><img src="/img/synced.png" style="height: 24px; width: 24px; padding-top: 4px;"></span>
					<div class="bottom">
						<h3>${translate("walletprofile.wp3")}</h3>
						<h4 class="lineHeight">${translate("appinfo.coreversion")}: <span style="color: #03a9f4">${this.coreInfos.buildVersion ? (this.coreInfos.buildVersion).substring(0,12) : ''}</span></h4>
						<h4 class="lineHeight">${translate("walletprofile.wp4")} ${translate("walletprofile.wp2")}</h4>
						<h4 class="lineHeight">${translate("appinfo.blockheight")}: <span style="color: #03a9f4">${this.nodeInfos.height ? this.nodeInfos.height : ''}</span></h4>
						<h4 class="lineHeight">${translate("appinfo.peers")}: <span style="color: #03a9f4">${this.nodeInfos.numberOfConnections ? this.nodeInfos.numberOfConnections : ''}</span></h4>
						<i></i>
					</div>
				</div>
			`
		} else if (this.nodeInfos.isSynchronizing === true && this.nodeInfos.isMintingPossible === true && this.nodeInfos.syncPercent === 100) {
			return html`
				<div class="tooltip" style="display: inline;">
					<span><img src="/img/synced_minting.png" style="height: 24px; width: 24px; padding-top: 4px;"></span>
					<div class="bottom">
						<h3>${translate("walletprofile.wp3")}</h3>
						<h4 class="lineHeight">${translate("appinfo.coreversion")}: <span style="color: #03a9f4">${this.coreInfos.buildVersion ? (this.coreInfos.buildVersion).substring(0,12) : ''}</span></h4>
						<h4 class="lineHeight">${translate("walletprofile.wp4")} <span style="color: #03a9f4">( ${translate("walletprofile.wp1")} )</span></h4>
						<h4 class="lineHeight">${translate("appinfo.blockheight")}: <span style="color: #03a9f4">${this.nodeInfos.height ? this.nodeInfos.height : ''}</span></h4>
						<h4 class="lineHeight">${translate("appinfo.peers")}: <span style="color: #03a9f4">${this.nodeInfos.numberOfConnections ? this.nodeInfos.numberOfConnections : ''}</span></h4>
						<i></i>
					</div>
				</div>
			`
		} else if (this.nodeInfos.isSynchronizing === false && this.nodeInfos.isMintingPossible === true && this.nodeInfos.syncPercent === 100) {
			return html`
				<div class="tooltip" style="display: inline;">
					<span><img src="/img/synced_minting.png" style="height: 24px; width: 24px; padding-top: 4px;"></span>
					<div class="bottom">
						<h3>${translate("walletprofile.wp3")}</h3>
						<h4 class="lineHeight">${translate("appinfo.coreversion")}: <span style="color: #03a9f4">${this.coreInfos.buildVersion ? (this.coreInfos.buildVersion).substring(0,12) : ''}</span></h4>
						<h4 class="lineHeight">${translate("walletprofile.wp4")} <span style="color: #03a9f4">( ${translate("walletprofile.wp1")} )</span></h4>
						<h4 class="lineHeight">${translate("appinfo.blockheight")}: <span style="color: #03a9f4">${this.nodeInfos.height ? this.nodeInfos.height : ''}</span></h4>
						<h4 class="lineHeight">${translate("appinfo.peers")}: <span style="color: #03a9f4">${this.nodeInfos.numberOfConnections ? this.nodeInfos.numberOfConnections : ''}</span></h4>
						<i></i>
					</div>
				</div>
			`
		} else {
			return html`
				<div class="tooltip" style="display: inline;">
					<span><img src="/img/syncing.png" style="height: 24px; width: 24px; padding-top: 4px;"></span>
					<div class="bottom">
						<h3>${translate("walletprofile.wp3")}</h3>
						<h4 class="lineHeight">${translate("appinfo.coreversion")}: <span style="color: #03a9f4">${this.coreInfos.buildVersion ? (this.coreInfos.buildVersion).substring(0,12) : ''}</span></h4>
						<h4 class="lineHeight">${translate("appinfo.synchronizing")}... <span style="color: #03a9f4">${this.nodeInfos.syncPercent !== undefined ? this.nodeInfos.syncPercent + '%' : ''}</span></h4>
						<h4 class="lineHeight">${translate("appinfo.blockheight")}: <span style="color: #03a9f4">${this.nodeInfos.height ? this.nodeInfos.height : ''}</span></h4>
						<h4 class="lineHeight">${translate("appinfo.peers")}: <span style="color: #03a9f4">${this.nodeInfos.numberOfConnections ? this.nodeInfos.numberOfConnections : ''}</span></h4>
						<i></i>
					</div>
				</div>
			`
		}
	}

	stateChanged(state) {
		// ...
	}

}

customElements.define('core-sync-status', CoreSyncStatus)