import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store'
import { translate } from '../../../translate'
import { coreSyncStatusStyles } from '../../styles/core-css'

class CoreSyncStatus extends connect(store)(LitElement) {
	static get properties() {
		return {
			nodeInfos: { type: Array },
			coreInfos: { type: Array },
			theme: { type: String, reflect: true }
		}
	}

	static get styles() {
		return [coreSyncStatusStyles]
	}

	constructor() {
		super()
		this.nodeInfos = []
		this.coreInfos = []
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
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
						<h4 class="lineHeight">${translate("appinfo.coreversion")}: <span style="color: #03a9f4">${this.coreInfos.buildVersion ? (this.coreInfos.buildVersion).substring(0, 12) : ''}</span></h4>
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
						<h4 class="lineHeight">${translate("appinfo.coreversion")}: <span style="color: #03a9f4">${this.coreInfos.buildVersion ? (this.coreInfos.buildVersion).substring(0, 12) : ''}</span></h4>
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
						<h4 class="lineHeight">${translate("appinfo.coreversion")}: <span style="color: #03a9f4">${this.coreInfos.buildVersion ? (this.coreInfos.buildVersion).substring(0, 12) : ''}</span></h4>
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
						<h4 class="lineHeight">${translate("appinfo.coreversion")}: <span style="color: #03a9f4">${this.coreInfos.buildVersion ? (this.coreInfos.buildVersion).substring(0, 12) : ''}</span></h4>
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
						<h4 class="lineHeight">${translate("appinfo.coreversion")}: <span style="color: #03a9f4">${this.coreInfos.buildVersion ? (this.coreInfos.buildVersion).substring(0, 12) : ''}</span></h4>
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
						<h4 class="lineHeight">${translate("appinfo.coreversion")}: <span style="color: #03a9f4">${this.coreInfos.buildVersion ? (this.coreInfos.buildVersion).substring(0, 12) : ''}</span></h4>
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

	// Standard functions
	getApiKey() {
		const coreNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		return coreNode.apiKey
	}

	isEmptyArray(arr) {
		if (!arr) { return true }
		return arr.length === 0
	}

	round(number) {
		return (Math.round(parseFloat(number) * 1e8) / 1e8).toFixed(8)
	}
}

window.customElements.define('core-sync-status', CoreSyncStatus)