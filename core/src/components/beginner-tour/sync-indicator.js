import {css, html, LitElement} from 'lit'
import {store} from '../../store'
import {connect} from 'pwa-helpers'
import {translate} from '../../../translate'
import {parentEpml} from '../show-plugin'

import '@material/mwc-icon'

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

	static get styles() {
		return css`
			* {
				--mdc-theme-text-primary-on-background: var(--black);
				box-sizing: border-box;
			}

			:host {
				box-sizing: border-box;
				position: fixed;
				bottom: 50px;
				right: 25px;
				z-index: 50000;
			}

			.parent {
				width: 360px;
				padding: 10px;
				border-radius: 8px;
				border: 1px solid var(--black);
				display: flex;
				align-items: center;
				gap: 10px;
				user-select: none;
				background: var(--white);
			}

			.row {
				display: flex;
				gap: 10px;
				width: 100%;
			}

			.column {
				display: flex;
				flex-direction: column;
				gap: 10px;
				width: 100%;
			}

			.bootstrap-button {
				font-family: Roboto, sans-serif;
				font-size: 16px;
				color: var(--mdc-theme-primary);
				background-color: transparent;
				padding: 8px 10px;
				border-radius: 5px;
				border: none;
				transition: all 0.3s ease-in-out;
			}

			.bootstrap-button:hover {
				cursor: pointer;
				background-color: #03a8f475;
			}
		`
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
					composed: true,
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

customElements.define('sync-indicator', SyncIndicator)