import { html, LitElement } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { connect } from 'pwa-helpers'
import { store } from '../../store'
import { setNewNotification } from '../../redux/app/app-actions'
import { notificationBellGeneralStyles, notificationItemTxStyles } from '../../styles/core-css'
import './popover.js'
import '../../../../plugins/plugins/core/components/TimeAgo'
import '@material/mwc-icon'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/iron-icons/iron-icons.js'
import '@vaadin/item'
import '@vaadin/list-box'

// Multi language support
import { get, translate } from '../../../translate'

class NotificationBellGeneral extends connect(store)(LitElement) {
	static get properties() {
		return {
			notifications: { type: Array },
			showNotifications: { type: Boolean },
			notificationCount: { type: Boolean },
			currentNotification: { type: Object },
			theme: { type: String, reflect: true }
		}
	}

	static get styles() {
		return [notificationBellGeneralStyles]
	}

	constructor() {
		super()
		this.notifications = []
		this.showNotifications = false
		this.notificationCount = false
		this.initialFetch = false
		this.currentNotification = null
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
	}

	render() {
		const hasOngoing = this.notifications.find(
			(notification) => notification.status !== 'confirmed'
		)

		return html`
			<div class="layout">
				<popover-component for="popover-notification" message=${get('notifications.explanation')}></popover-component>
				<div id="popover-notification" @click=${() => this._toggleNotifications()}>
					${hasOngoing ? html`
						<mwc-icon id="notification-general-icon" style="color: green;cursor:pointer;user-select:none">notifications</mwc-icon>
						<vaadin-tooltip for="notification-general-icon" position="bottom" hover-delay=${400} hide-delay=${1} text=${get('notifications.notify4')}></vaadin-tooltip>
					` : html`
						<mwc-icon id="notification-general-icon" style="color: var(--black); cursor:pointer;user-select:none">notifications</mwc-icon>
						<vaadin-tooltip for="notification-general-icon" position="bottom" hover-delay=${400} hide-delay=${1}text=${get('notifications.notify4')}></vaadin-tooltip>
					`}
				</div>
				${hasOngoing ? html`
					<span class="count" style="cursor:pointer" @click=${() => this._toggleNotifications()}>
						<mwc-icon style="color: var(--black);font-size:18px">pending</mwc-icon>
					</span>
				` : ''}
				<div id="notification-panel" class="popover-panel" style="visibility:${this.showNotifications ? 'visibile' : 'hidden'}" tabindex="0" @blur=${this.handleBlur}>
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
										.signature
									}
								></notification-item-tx>
							`
						)}
					</div>
				</div>
			</div>
		`
	}

	firstUpdated() {
		try {
			let value = JSON.parse(localStorage.getItem('isFirstTimeUser'))

			if (!value && value !== false) {
				value = true
			}

			this.isFirstTimeUser = value
		} catch (error) { }
	}

	async stateChanged(state) {
		if (state.app.newNotification) {
			const newNotification = state.app.newNotification

			this.notifications = [newNotification, ...this.notifications]

			store.dispatch(setNewNotification(null))

			if (this.isFirstTimeUser) {
				const target = this.shadowRoot.getElementById(
					'popover-notification'
				)

				const popover = this.shadowRoot.querySelector('popover-component')

				if (popover) {
					popover.openPopover(target)
				}

				localStorage.setItem('isFirstTimeUser', JSON.stringify(false))

				this.isFirstTimeUser = false
			}
		}
	}

	handleBlur() {
		setTimeout(() => {
			if (!this.shadowRoot.contains(document.activeElement)) {
				this.showNotifications = false
			}
		}, 0)
	}

	changeStatus(signature, statusTx) {
		const copyNotifications = [...this.notifications]

		const findNotification = this.notifications.findIndex(
			(notification) => notification.reference.signature === signature
		)

		if (findNotification !== -1) {
			copyNotifications[findNotification] = {
				...copyNotifications[findNotification],
				status: statusTx
			}

			this.notifications = copyNotifications
		}
	}

	_toggleNotifications() {
		this.showNotifications = !this.showNotifications;
		if (this.showNotifications) {
			requestAnimationFrame(() => {
				this.shadowRoot.getElementById('notification-panel').focus();
			});
		}
	}
}

window.customElements.define('notification-bell-general', NotificationBellGeneral)

class NotificationItemTx extends connect(store)(LitElement) {
	static get properties() {
		return {
			status: { type: String },
			type: { type: String },
			timestamp: { type: Number },
			signature: { type: String },
			changeStatus: { attribute: false }
		}
	}

	static get styles() {
		return [notificationItemTxStyles]
	}

	constructor() {
		super()
		this.nodeUrl = this.getNodeUrl()
		this.myNode = this.getMyNode()
	}

	render() {
		return html`
			<div class="notification-item" @click=${() => { }}>
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
						${translate('tubespage.schange28')}: ${this.status === 'confirming' ? translate('notifications.notify1') : translate('notifications.notify2')}
					</p>
					${this.status !== 'confirmed' ? html`<div class="centered"><div class="loader">Loading...</div></div>` : ''}
					<div style="display:flex;justify-content:space-between;align-items:center">
						<message-time timestamp=${this.timestamp} style="color:red;font-size:12px"></message-time>
						${this.status === 'confirmed' ? html`<mwc-icon style="color: green;">done</mwc-icon>` : ''}
					</div>
				</div>
			</div>
		`
	}

	firstUpdated() {
		this.getStatus()
	}

	getNodeUrl() {
		const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		return myNode.protocol + '://' + myNode.domain + ':' + myNode.port
	}

	getMyNode() {
		return store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
	}

	async getStatus() {
		let interval = null
		let stop = false

		const getAnswer = async () => {
			const getTx = async (minterAddr) => {
				const url = `${this.nodeUrl}/transactions/signature/${this.signature}`
				const res = await fetch(url)

				return await res.json()
			}

			if (!stop) {
				stop = true

				try {
					const txTransaction = await getTx()

					if (!txTransaction.error && txTransaction.signature && txTransaction.blockHeight) {
						clearInterval(interval)
						this.changeStatus(this.signature, 'confirmed')
					}
				} catch (error) { }

				stop = false
			}
		}

		interval = setInterval(getAnswer, 20000)
	}

	_toggleNotifications() {
		if (this.notifications.length === 0) return
		this.showNotifications = !this.showNotifications
	}
}

window.customElements.define('notification-item-tx', NotificationItemTx)