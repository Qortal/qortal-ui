import {css, html, LitElement} from 'lit';
import {connect} from 'pwa-helpers';

import '@vaadin/item';
import '@vaadin/list-box';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import {store} from '../../store.js';
import {setNewNotification} from '../../redux/app/app-actions.js';
import '@material/mwc-icon';
import {get, translate} from '../../../translate'
import {repeat} from 'lit/directives/repeat.js';
import '../../../../plugins/plugins/core/components/TimeAgo.js';
import './popover.js';


class NotificationBellGeneral extends connect(store)(LitElement) {
	static properties = {
		notifications: { type: Array },
		showNotifications: { type: Boolean },
		notificationCount: { type: Boolean },
		theme: { type: String, reflect: true },
		currentNotification: { type: Object },
	};

	constructor() {
		super();
		this.notifications = [];
		this.showNotifications = false;
		this.notificationCount = false;
		this.initialFetch = false;
		this.theme = localStorage.getItem('qortalTheme')
			? localStorage.getItem('qortalTheme')
			: 'light';
		this.currentNotification = null;
	}

	firstUpdated() {
		try {
			let value = JSON.parse(localStorage.getItem('isFirstTimeUser'));
			if (!value && value !== false) {
				value = true;
			}
			this.isFirstTimeUser = value;
		} catch (error) {}
	}

	async stateChanged(state) {
		if (state.app.newNotification) {
			const newNotification = state.app.newNotification;
			this.notifications = [newNotification, ...this.notifications];
			store.dispatch(setNewNotification(null));
			if (this.isFirstTimeUser) {
				const target = this.shadowRoot.getElementById(
					'popover-notification'
				);
				const popover =
					this.shadowRoot.querySelector('popover-component');
				if (popover) {
					popover.openPopover(target);
				}

				localStorage.setItem('isFirstTimeUser', JSON.stringify(false));
				this.isFirstTimeUser = false;
			}
		}
	}

	handleBlur() {
		setTimeout(() => {
			if (!this.shadowRoot.contains(document.activeElement)) {
				this.showNotifications = false;
			}
		}, 0);
	}

	changeStatus(signature, statusTx) {
		const copyNotifications = [...this.notifications];
		const findNotification = this.notifications.findIndex(
			(notification) => notification.reference.signature === signature
		);
		if (findNotification !== -1) {
			copyNotifications[findNotification] = {
				...copyNotifications[findNotification],
				status: statusTx,
			};
			this.notifications = copyNotifications;

		}
	}

	render() {
		const hasOngoing = this.notifications.find(
			(notification) => notification.status !== 'confirmed'
		);
		return html`
			<div class="layout">
				<popover-component
					for="popover-notification"
					message=${get('notifications.explanation')}
				></popover-component>
				<div
					id="popover-notification"
					@click=${() => this._toggleNotifications()}
				>
					${hasOngoing
						? html`
								<mwc-icon id="notification-general-icon" style="color: green;cursor:pointer;user-select:none"
									>notifications</mwc-icon
								>
								<vaadin-tooltip
			  for="notification-general-icon"
			  position="bottom"
			  hover-delay=${400}
			  hide-delay=${1}
			  text=${get('notifications.notify4')}>
		  </vaadin-tooltip>
						  `
						: html`
								<mwc-icon
								id="notification-general-icon"
									style="color: var(--black); cursor:pointer;user-select:none"
									>notifications</mwc-icon
								>
								<vaadin-tooltip
			  for="notification-general-icon"
			  position="bottom"
			  hover-delay=${400}
			  hide-delay=${1}
			  text=${get('notifications.notify4')}>
		  </vaadin-tooltip>
						  `}
				</div>
				${hasOngoing
					? html`
							<span
								class="count"
								style="cursor:pointer"
								@click=${() => this._toggleNotifications()}
							>
								<mwc-icon
									style="color: var(--black);font-size:18px"
									>pending</mwc-icon
								>
							</span>
					  `
					: ''}

				<div
					id="notification-panel"
					class="popover-panel"
					style="visibility:${this.showNotifications
						? 'visibile'
						: 'hidden'}"
					tabindex="0"
					@blur=${this.handleBlur}
				>
					<div class="notifications-list">
						${this.notifications.length === 0 ? html`
						<p style="font-size: 16px; width: 100%; text-align:center;margin-top:20px;">${translate('notifications.notify3')}</p>
						` : ''}
						${repeat(
							this.notifications,
							(notification) => notification.reference.signature, // key function
							(notification) => html`
								<notification-item-tx
									.changeStatus=${(val1, val2) =>
										this.changeStatus(val1, val2)}
									status=${notification.status}
									timestamp=${notification.timestamp}
									type=${notification.type}
									signature=${notification.reference
										.signature}
								></notification-item-tx>
							`
						)}
					</div>
				</div>
			</div>
		`;
	}

	_toggleNotifications() {
		this.showNotifications = !this.showNotifications;
		if (this.showNotifications) {
			requestAnimationFrame(() => {
				this.shadowRoot.getElementById('notification-panel').focus();
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

		.notifications-list {
			display: flex;
			flex-direction: column;
		}

		.notification-item {
			padding: 5px;
			border-bottom: 1px solid;
			display: flex;
			justify-content: space-between;
			cursor: pointer;
			transition: 0.2s all;
		}

		.notification-item:hover {
			background: var(--nav-color-hover);
		}

		p {
			font-size: 14px;
			color: var(--black);
			margin: 0px;
			padding: 0px;
		}
	`;
}

customElements.define('notification-bell-general', NotificationBellGeneral);

class NotificationItemTx extends connect(store)(LitElement) {
	static properties = {
		status: { type: String },
		type: { type: String },
		timestamp: { type: Number },
		signature: { type: String },
		changeStatus: { attribute: false },
	};

	constructor() {
		super();
		this.nodeUrl = this.getNodeUrl();
		this.myNode = this.getMyNode();
	}

	getNodeUrl() {
		const myNode =
			store.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			]

		return myNode.protocol + '://' + myNode.domain + ':' + myNode.port
	}
	getMyNode() {
		return store.getState().app.nodeConfig.knownNodes[
			window.parent.reduxStore.getState().app.nodeConfig.node
			]
	}

	async getStatus() {
		let interval = null;
		let stop = false;
		const getAnswer = async () => {
			const getTx = async (minterAddr) => {
				const url = `${this.nodeUrl}/transactions/signature/${this.signature}`
				const res = await fetch(url)
				return await res.json()
			}

			if (!stop) {
				stop = true;
				try {
					const txTransaction = await getTx();
					if (!txTransaction.error && txTransaction.signature && txTransaction.blockHeight) {
						clearInterval(interval);
						this.changeStatus(this.signature, 'confirmed');
					}
				} catch (error) {}
				stop = false;
			}
		};
		interval = setInterval(getAnswer, 20000);
	}

	firstUpdated() {
		this.getStatus();
	}

	render() {
		return html`
			<div class="notification-item" @click=${() => {}}>
				<div>
					<p style="margin-bottom:10px; font-weight:bold">
						${translate('transpage.tchange1')}
					</p>
				</div>
				<div>
					<p style="margin-bottom:5px">
						${translate('walletpage.wchange35')}: ${this.type}
					</p>
					<p style="margin-bottom:5px">
						${translate('tubespage.schange28')}:
						${this.status === 'confirming'
							? translate('notifications.notify1')
							: translate('notifications.notify2')}
					</p>
					${this.status !== 'confirmed'
						? html`
								<div class="centered">
									<div class="loader">Loading...</div>
								</div>
						  `
						: ''}
					<div
						style="display:flex;justify-content:space-between;align-items:center"
					>
						<message-time
							timestamp=${this.timestamp}
							style="color:red;font-size:12px"
						></message-time>
						${this.status === 'confirmed'
							? html`
									<mwc-icon style="color: green;"
										>done</mwc-icon
									>
							  `
							: ''}
					</div>
				</div>
			</div>
		`;
	}

	_toggleNotifications() {
		if (this.notifications.length === 0) return;
		this.showNotifications = !this.showNotifications;
	}

	static styles = css`
		.centered {
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.layout {
			width: 100px;
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

		.notifications-list {
			display: flex;
			flex-direction: column;
		}

		.notification-item {
			padding: 5px;
			border-bottom: 1px solid;
			display: flex;
			flex-direction: column;
			cursor: default;
		}

		.notification-item:hover {
			background: var(--nav-color-hover);
		}

		p {
			font-size: 14px;
			color: var(--black);
			margin: 0px;
			padding: 0px;
		}

		.loader,
		.loader:before,
		.loader:after {
			border-radius: 50%;
			width: 10px;
			height: 10px;
			-webkit-animation-fill-mode: both;
			animation-fill-mode: both;
			-webkit-animation: load7 1.8s infinite ease-in-out;
			animation: load7 1.8s infinite ease-in-out;
		}
		.loader {
			color: var(--black);
			font-size: 5px;
			margin-bottom: 20px;
			position: relative;
			text-indent: -9999em;
			-webkit-transform: translateZ(0);
			-ms-transform: translateZ(0);
			transform: translateZ(0);
			-webkit-animation-delay: -0.16s;
			animation-delay: -0.16s;
		}
		.loader:before,
		.loader:after {
			content: '';
			position: absolute;
			top: 0;
		}
		.loader:before {
			left: -3.5em;
			-webkit-animation-delay: -0.32s;
			animation-delay: -0.32s;
		}
		.loader:after {
			left: 3.5em;
		}
		@-webkit-keyframes load7 {
			0%,
			80%,
			100% {
				box-shadow: 0 2.5em 0 -1.3em;
			}
			40% {
				box-shadow: 0 2.5em 0 0;
			}
		}
		@keyframes load7 {
			0%,
			80%,
			100% {
				box-shadow: 0 2.5em 0 -1.3em;
			}
			40% {
				box-shadow: 0 2.5em 0 0;
			}
		}
	`;
}

customElements.define('notification-item-tx', NotificationItemTx);
