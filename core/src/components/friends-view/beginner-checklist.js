import {css, html, LitElement} from 'lit';
import {connect} from 'pwa-helpers';

import '@vaadin/item';
import '@vaadin/list-box';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import {store} from '../../store.js';
import {setNewTab} from '../../redux/app/app-actions.js';
import '@material/mwc-icon';
import {get} from '../../../translate';
import '../../../../plugins/plugins/core/components/TimeAgo.js';
import '../notification-view/popover.js';
import ShortUniqueId from 'short-unique-id';

class BeginnerChecklist extends connect(store)(LitElement) {
	static properties = {
		notifications: { type: Array },
		showChecklist: { type: Boolean },
		theme: { type: String, reflect: true },
		isSynced: { type: Boolean },
		hasName: { type: Boolean },
		hasTourFinished: { type: Boolean },
	};

	constructor() {
		super();
		this.showChecklist = false;
		this.initialFetch = false;
		this.theme = localStorage.getItem('qortalTheme')
			? localStorage.getItem('qortalTheme')
			: 'light';
		this.isSynced = false;
		this.hasName = null;
		this.nodeUrl = this.getNodeUrl();
		this.myNode = this.getMyNode();
		this.hasTourFinished = null;
		this._controlTourFinished = this._controlTourFinished.bind(this);
		this.uid = new ShortUniqueId();
	}

	_controlTourFinished() {
		this.hasTourFinished = true;
	}

	firstUpdated() {
		this.address = store.getState().app.selectedAddress.address;
		this.hasTourFinished = JSON.parse(
			localStorage.getItem(`hasViewedTour-${this.address}`) || 'null'
		);
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener(
			'send-tour-finished',
			this._controlTourFinished
		);
	}

	disconnectedCallback() {
		window.removeEventListener(
			'send-tour-finished',
			this._controlTourFinished
		);

		super.disconnectedCallback();
	}

	getNodeUrl() {
		const myNode =
			window.parent.reduxStore.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			];

		return myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
	}
	getMyNode() {
		return window.parent.reduxStore.getState().app.nodeConfig.knownNodes[
			window.parent.reduxStore.getState().app.nodeConfig.node
			];
	}

	async getName(recipient) {
		try {
			if (!recipient) return '';
			const endpoint = `${this.nodeUrl}/names/address/${recipient}`;
			const res = await fetch(endpoint);
			const getNames = await res.json();

			this.hasName = Array.isArray(getNames) && getNames.length > 0;
		} catch (error) {
			return '';
		}
	}

	stateChanged(state) {
		if (
			state.app.nodeStatus &&
			state.app.nodeStatus.syncPercent !== this.syncPercentage
		) {
			this.syncPercentage = state.app.nodeStatus.syncPercent;

			if (
				!this.hasAttempted &&
				state.app.selectedAddress &&
				state.app.nodeStatus.syncPercent === 100
			) {
				this.hasAttempted = true;
				this.getName(state.app.selectedAddress.address);
			}
		}
		if (
			state.app.accountInfo &&
			state.app.accountInfo.names.length &&
			state.app.nodeStatus &&
			state.app.nodeStatus.syncPercent === 100 &&
			this.hasName === false &&
			this.hasAttempted &&
			state.app.accountInfo &&
			state.app.accountInfo.names &&
			state.app.accountInfo.names.length > 0
		) {
			this.hasName = true;
		}
	}

	handleBlur() {
		setTimeout(() => {
			if (!this.shadowRoot.contains(document.activeElement)) {
				this.showChecklist = false;
			}
		}, 0);
	}

	render() {
		return this.hasName === false || this.hasTourFinished === false
			? html`
					<div class="layout">
						<popover-component
							for="popover-checklist"
							message=${get('tour.tour16')}
						></popover-component>
						<div
							id="popover-checklist"
							@click=${() => this._toggleChecklist()}
						>
							<mwc-icon
								id="checklist-general-icon"
								style=${`color: ${
									!this.hasName ? 'red' : 'var(--black)'
								}; cursor:pointer;user-select:none`}
								>checklist</mwc-icon
							>
							<vaadin-tooltip
								for="checklist-general-icon"
								position="bottom"
								hover-delay=${400}
								hide-delay=${1}
								text=${get('tour.tour16')}
							>
							</vaadin-tooltip>
						</div>

						<div
							id="checklist-panel"
							class="popover-panel"
							style="visibility:${this.showChecklist
								? 'visibile'
								: 'hidden'}"
							tabindex="0"
							@blur=${this.handleBlur}
						>
							<div class="list">
								<div class="task-list-item">
									<p>Are you synced?</p>
									${this.syncPercentage === 100
										? html`
												<mwc-icon
													id="checklist-general-icon"
													style="color: green; user-select:none"
													>task_alt</mwc-icon
												>
										  `
										: html`
												<mwc-icon
													id="checklist-general-icon"
													style="color: red; user-select:none"
													>radio_button_unchecked</mwc-icon
												>
										  `}
								</div>

								<div
									class="task-list-item"
									style="cursor:pointer"
									@click=${() => {
										store.dispatch(
											setNewTab({
												url: `group-management`,
												id: this.uid.rnd(),
												myPlugObj: {
													url: 'name-registration',
													domain: 'core',
													page: 'name-registration/index.html',
													title: 'Name Registration',
													icon: 'vaadin:user-check',
													mwcicon: 'manage_accounts',
													pluginNumber:
														'plugin-qCmtXAQmtu',
													menus: [],
													parent: false,
												},
												openExisting: true,
											})
										);
										this.handleBlur();
									}}
								>
									<p>Do you have a name registered?</p>
									${this.hasName
										? html`
												<mwc-icon
													id="checklist-general-icon"
													style="color: green; user-select:none"
													>task_alt</mwc-icon
												>
										  `
										: html`
												<mwc-icon
													id="checklist-general-icon"
													style="color: red; user-select:none"
													>radio_button_unchecked</mwc-icon
												>
										  `}
								</div>
							</div>
						</div>
					</div>
			  `
			: '';
	}

	_toggleChecklist() {
		this.showChecklist = !this.showChecklist;
		if (this.showChecklist) {
			requestAnimationFrame(() => {
				this.shadowRoot.getElementById('checklist-panel').focus();
			});
		}
	}

	static styles = css`
		.layout {
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;
		}

		.count {
			position: absolute;
			top: -5px;
			right: -5px;
			font-size: 12px;
			background-color: red;
			color: white;
			border-radius: 50%;
			width: 16px;
			height: 16px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.nocount {
			display: none;
		}

		.popover-panel {
			position: absolute;
			width: 200px;
			padding: 10px;
			background-color: var(--white);
			border: 1px solid var(--black);
			border-radius: 4px;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
			top: 40px;
			max-height: 350px;
			overflow: auto;
			scrollbar-width: thin;
			scrollbar-color: #6a6c75 #a1a1a1;
		}

		.popover-panel::-webkit-scrollbar {
			width: 11px;
		}

		.popover-panel::-webkit-scrollbar-track {
			background: #a1a1a1;
		}

		.popover-panel::-webkit-scrollbar-thumb {
			background-color: #6a6c75;
			border-radius: 6px;
			border: 3px solid #a1a1a1;
		}

		.list {
			display: flex;
			flex-direction: column;
			gap: 15px;
		}

		.task-list-item {
			display: flex;
			gap: 15px;
			justify-content: space-between;
			align-items: center;
		}

		.checklist-item {
			padding: 5px;
			border-bottom: 1px solid;
			display: flex;
			justify-content: space-between;
			cursor: pointer;
			transition: 0.2s all;
		}

		.checklist-item:hover {
			background: var(--nav-color-hover);
		}

		p {
			font-size: 16px;
			color: var(--black);
			margin: 0px;
			padding: 0px;
		}
	`;
}

customElements.define('beginner-checklist', BeginnerChecklist);
