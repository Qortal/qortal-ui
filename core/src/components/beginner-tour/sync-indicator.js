import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store'
import { parentEpml } from '../show-plugin'
import { syncIndicator2Styles } from '../../styles/core-css'
import '@material/mwc-icon'

// Multi language support
import {translate} from '../../../translate'

class SyncIndicator extends connect(store)(LitElement) {
	static get properties() {
		return {
			blocksBehind: { type: Number },
			nodeUrl: { type: String },
			address: { type: String },
			isBehind: { type: Boolean },
			isSynchronizing: { type: Boolean },
			hasCoreRunning: { type: Boolean }
		}
	}

	static get styles() {
		return [syncIndicator2Styles]
	}

	constructor() {
		super()
		this.blocksBehind = 0
		this.nodeUrl = ''
		this.address = ''
		this.isBehind = false
		this.isSynchronizing = false
		this.hasCoreRunning = true
		this.interval = null
		this.seenWelcomeSync = false
		this.numberOfTries = 0
		this.hasOpened = false
	}

	render() {
		return html`
			${!this.hasCoreRunning ? html`
				<div class="parent">
					<span>
						<mwc-icon id="notification-general-icon" style="color: red; cursor:pointer;user-select:none">
							priority_high
						</mwc-icon>
					</span>
					<p>
						${translate("tour.tour17")}
					</p>
				</div>
			` : (this.blocksBehind > 1050 && this.isSynchronizing) ? html`
				<div class="parent">
					<div class="column">
						<div class="row">
							<span>
								<img src="/img/syncing.png" style="height: 24px; width: 24px;" />
							</span>
							<p>
								${this.blocksBehind} ${translate("tour.tour20")}
							</p>
						</div>
						<div class="row" style="justify-content: center">
							<button class="bootstrap-button" @click="${() => {this.bootstrap()}}">
								${translate("tour.tour18")}
							</button>
						</div>
					</div>
				</div>
			` : this.isSynchronizing ? html`
				<div class="parent">
					<span>
						<img src="/img/syncing.png" style="height: 24px; width: 24px;" />
					</span>
					<p>
						${translate("tour.tour19")} ${this.blocksBehind ? this.blocksBehind : ""} ${this.blocksBehind ? translate("tour.tour21"): ""}
					</p>
				</div>
			` : "" }
		`
	}

	firstUpdated() {
		this.getNodeUrl()
		this.address = store.getState().app.selectedAddress.address

		this.seenWelcomeSync = JSON.parse(
			localStorage.getItem(`welcome-sync-${this.address}`) || 'false'
		)

		setInterval(() => {
			this.getNodeUrl()
		}, 60000)
	}

	getNodeUrl() {
		const syncInfoNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		const syncInfoUrl = syncInfoNode.protocol + '://' + syncInfoNode.domain + ':' + syncInfoNode.port
		this.nodeUrl = syncInfoUrl
	}

	async getDaySummary() {
		try {
			this.fetchingSummary = true

			const endpointLastBlock = `${this.nodeUrl}/blocks/last`
			const resLastBlock = await fetch(endpointLastBlock)
			const dataLastBlock = await resLastBlock.json()
			const timestampNow = Date.now()
			const currentBlockTimestamp = dataLastBlock.timestamp

			if (currentBlockTimestamp < timestampNow) {
				const diff = timestampNow - currentBlockTimestamp
				const inSeconds = diff / 1000
				const inBlocks = inSeconds / 70
				this.blocksBehind = parseInt(inBlocks)
				if (inBlocks >= 100) {
					this.isBehind = true
				} else {
					this.isBehind = false
					this.blocksBehind = 0
				}
			} else {
				this.blocksBehind = 0
				this.isBehind = false
			}
		} catch (error) {} finally {
			this.fetchingSummary = false
		}
	}

	async checkHowManyBlocksBehind() {
		try {
			await this.getDaySummary()
			this.interval = setInterval(() => {
				if(this.fetchingSummary) return
				if (this.isBehind === false) {
					this.isBehind = null
					clearInterval(this.interval)
				}
				this.getDaySummary()
			}, 20000)
		} catch (error) {
			// ...
		}
	}

	async bootstrap() {
		try {
			const endpoint = `${this.nodeUrl}/admin/bootstrap/?apiKey=${this.getApiKey()}`
			const res = await fetch(endpoint)
			const data = await res.json()
			if (data === true) {
				parentEpml.request('showSnackBar', get('tour.tour22'))
			}
		} catch (error) {
			// ...
		}
	}

	getApiKey() {
		const apiNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		return apiNode.apiKey
	}

	stateChanged(state) {
		this.address = store.getState().app.selectedAddress.address

		if (!this.seenWelcomeSync && state.app.nodeStatus && state.app.nodeStatus.syncPercent === 100 && this.hasOpened === false) {
			this.hasOpened = true
			this.dispatchEvent(
				new CustomEvent('open-welcome-modal-sync', {
					bubbles: true,
					composed: true
				})
			)
		}

		if (state.app.nodeStatus && Object.keys(state.app.nodeStatus).length === 0) {
			if (this.numberOfTries > 5) {
				this.hasCoreRunning = false
			} else {
				this.numberOfTries = this.numberOfTries + 1
			}
		} else if (state.app.nodeStatus && state.app.nodeStatus.syncPercent === 100 && state.app.nodeStatus.syncPercent !== this.syncPercentage) {
			this.syncPercentage = state.app.nodeStatus.syncPercent
			this.isSynchronizing = false
		} else if (state.app.nodeStatus) {
			this.hasCoreRunning = true
			this.numberOfTries = 0
			this.syncPercentage = state.app.nodeStatus.syncPercent

			if (state.app.nodeStatus.syncPercent !== 100) {
				this.isSynchronizing = true
			}

			if (!this.interval && this.isBehind === null && state.app.nodeStatus.isSynchronizing && state.app.nodeStatus.syncPercent !== 100) {
				this.checkHowManyBlocksBehind()
			}
		} else {
			this.hasCoreRunning = true
		}
	}
}

window.customElements.define('sync-indicator', SyncIndicator)