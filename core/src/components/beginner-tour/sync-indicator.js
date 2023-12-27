import { LitElement, html, css } from 'lit';
import { store } from '../../store';
import { connect } from 'pwa-helpers';
import '@material/mwc-icon';
import { translate } from '../../../translate';
import { parentEpml } from '../show-plugin';

class SyncIndicator extends connect(store)(LitElement) {
	static get properties() {
		return {
			isBehind: { type: Boolean },
			blocksBehind: { type: Number },
			isSynchronizing: { type: Boolean },
			hasCoreRunning: { type: Boolean },
		};
	}

	constructor() {
		super();
		this.isBehind = null;
		this.blocksBehind = 0;
		this.nodeUrl = this.getNodeUrl();
		this.myNode = this.getMyNode();
		this.interval = null;
		this.hasCoreRunning = true;
		this.seenWelcomeSync = false;
		this.numberOfTries = 0;
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
				bottom: 25px;
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
		`;
	}
	async firstUpdated() {
		this.address = store.getState().app.selectedAddress.address

		const seenWelcomeSync = JSON.parse(
			localStorage.getItem(`welcome-sync-${this.address}`) || 'false'
		);
		this.seenWelcomeSync = seenWelcomeSync;
	}

	getNodeUrl() {
		const myNode =
			window.parent.reduxStore.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			];

		const nodeUrl =
			myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
		return nodeUrl;
	}
	getMyNode() {
		const myNode =
			window.parent.reduxStore.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			];

		return myNode;
	}

	async getDaySummary() {
		try {
			const endpoint = `${this.nodeUrl}/admin/summary/?apiKey=${this.myNode.apiKey}`;
			const res = await fetch(endpoint);
			const data = await res.json();
			let blockTimeInSeconds = null;
			if (data.blockCount) {
				const blockTime = 1440 / data.blockCount;
				blockTimeInSeconds = blockTime * 60;
			}

			const endpointLastBlock = `${this.nodeUrl}/blocks/last`;
			const resLastBlock = await fetch(endpointLastBlock);
			const dataLastBlock = await resLastBlock.json();
			const timestampNow = Date.now();
			const currentBlockTimestamp = dataLastBlock.timestamp;
			if (blockTimeInSeconds && currentBlockTimestamp < timestampNow) {
				const diff = timestampNow - currentBlockTimestamp;
				const inSeconds = diff / 1000; // millisecs to secs
				const inBlocks = inSeconds / blockTimeInSeconds;
				this.blocksBehind = parseInt(inBlocks);
				if (inBlocks >= 1000) {
					this.isBehind = true;
				} else {
					this.isBehind = false;
				}
			} else {
				this.blocksBehind = 0;
				this.isBehind = false;
			}
		} catch (error) {}
	}

	async checkHowManyBlocksBehind() {
		try {
			this.getDaySummary();
			this.interval = setInterval(() => {
				if (this.isBehind === false) {
					this.isBehind = null;
					clearInterval(this.interval);
				}
				this.getDaySummary();
			}, 60000);
		} catch (error) {}
	}

	stateChanged(state) {
		if (
			state.app.nodeStatus &&
			Object.keys(state.app.nodeStatus).length === 0
		) {
			if (this.numberOfTries > 5) {
				this.hasCoreRunning = false;
			} else {
				this.numberOfTries = this.numberOfTries + 1;
			}
		} else if (
			state.app.nodeStatus &&
			state.app.nodeStatus.syncPercent !== this.syncPercentage
		) {
			this.syncPercentage = state.app.nodeStatus.syncPercent;

			if (state.app.nodeStatus.syncPercent !== 100) {
				this.isSynchronizing = true;
			} else {
				this.isSynchronizing = false;
			}
			if (
				this.isBehind === null &&
				state.app.nodeStatus.syncPercent === 100
			) {
				this.isBehind = false;
				this.blocksBehind = 0;
				if (!this.seenWelcomeSync) {
					this.dispatchEvent(
						new CustomEvent('open-welcome-modal-sync', {
							bubbles: true,
							composed: true,
						})
					);
				}
			} else if (
				!this.interval &&
				this.isBehind === null &&
				state.app.nodeStatus.isSynchronizing &&
				state.app.nodeStatus.syncPercent !== 100
			) {
				this.checkHowManyBlocksBehind();
			}
		} else {
			this.hasCoreRunning = true;
		}
	}

	async bootstrap(){
		try {
			const endpoint = `${this.nodeUrl}/admin/bootstrap/?apiKey=${this.myNode.apiKey}`;
			const res = await fetch(endpoint);
			const data = await res.json();
			if(data === true){
				parentEpml.request('showSnackBar', get('tour.tour22'));
			}
			console.log({data})
		} catch (error) {
			
		}
	}

	render() {
		return html`
			${!this.hasCoreRunning
				? html`
						<div class="parent">
							<span
								><mwc-icon
									id="notification-general-icon"
									style="color: red; cursor:pointer;user-select:none"
									>priority_high</mwc-icon
								></span
							>
							<p>
								${translate("tour.tour17")}
							</p>
						</div>
				  `
				: (this.isBehind && this.isSynchronizing)
				? html`
						<div class="parent">
							<div class="column">
								<div class="row">
									<span
										><img
											src="/img/syncing.png"
											style="height: 24px; width: 24px;"
									/></span>
									<p>
									${this.blocksBehind} ${translate("tour.tour20")}
									</p>
								</div>
								<div
									class="row"
									style="justify-content: center"
								>
									<button
										class="bootstrap-button"
										@click="${() => {
											this.bootstrap()
										}}"
									>
										${translate("tour.tour18")}
									</button>
								</div>
							</div>
						</div>
				  `
				: this.isSynchronizing
				? html`
						<div class="parent">
							<span
								><img
									src="/img/syncing.png"
									style="height: 24px; width: 24px;"
							/></span>
							<p>
								${translate("tour.tour19")} ${this.blocksBehind ? this.blocksBehind : ""} ${this.blocksBehind ? translate("tour.tour21"): ""} 
							</p>
						</div>
				  `
				: "" }
		`;
	}
}
customElements.define('sync-indicator', SyncIndicator);
