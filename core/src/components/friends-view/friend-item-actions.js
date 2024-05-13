import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store'
import { createPopper } from '@popperjs/core'
import { setNewTab, setSideEffectAction } from '../../redux/app/app-actions'
import { translate } from '../../../translate'
import { friendItemActionsStyles } from '../../styles/core-css'
import ShortUniqueId from 'short-unique-id'
import '@material/mwc-icon'

export class FriendItemActions extends connect(store)(LitElement) {
	static get properties() {
		return {
			for: { type: String, reflect: true },
			message: { type: String },
			openEditFriend: { attribute: false },
			name: { type: String },
			closeSidePanel: { attribute: false, type: Object }
		}
	}

	static get styles() {
		return [friendItemActionsStyles]
	}

	constructor() {
		super()
		this.message = ''
		this.nodeUrl = this.getNodeUrl()
		this.uid = new ShortUniqueId()
		this.getUserAddress = this.getUserAddress.bind(this)
	}

	render() {
		return html`
			<div id="parent-div" tabindex="0" @blur=${this.handleBlur}>
				<span class="close-icon" @click="${this.closePopover}">
					<mwc-icon style="color: var(--black)">close</mwc-icon>
				</span>
				<div class="action-parent">
					<div
						class="send-message-button"
						@click="${() => {
							this.openEditFriend();
							this.closePopover();
						}}"
					>
						<mwc-icon style="color: var(--black)">edit</mwc-icon>
						${translate('friends.friend10')}
					</div>
					<div
						class="send-message-button"
						@click="${async () => {
							const address = await this.getUserAddress();
							if (!address) return;
							store.dispatch(
								setNewTab({
									url: `q-chat`,
									id: this.uid.rnd(),
									myPlugObj: {
										url: 'q-chat',
										domain: 'core',
										page: 'q-chat/index.html',
										title: 'Q-Chat',
										icon: 'vaadin:chat',
										mwcicon: 'forum',
										pluginNumber: 'plugin-qhsyOnpRhT',
										menus: [],
										parent: false
									},
									openExisting: true
								})
							);
							store.dispatch(
								setSideEffectAction({
									type: 'openPrivateChat',
									data: {
										address,
										name: this.name
									}
								})
							);
							this.closePopover();
							this.closeSidePanel();
						}}"
					>
						<mwc-icon style="color: var(--black)">send</mwc-icon>
						${translate('friends.friend8')}
					</div>
					<div
						class="send-message-button"
						@click="${() => {
							const query = `?service=APP&name=Q-Mail/to/${this.name}`;
							store.dispatch(
								setNewTab({
									url: `qdn/browser/index.html${query}`,
									id: this.uid.rnd(),
									myPlugObj: {
										url: 'myapp',
										domain: 'core',
										page: `qdn/browser/index.html${query}`,
										title: 'Q-Mail',
										icon: 'vaadin:mailbox',
										mwcicon: 'mail_outline',
										menus: [],
										parent: false
									},
									openExisting: true
								})
							);
							this.closePopover();
							this.closeSidePanel();
						}}"
					>
						<mwc-icon style="color: var(--black)">mail</mwc-icon>
						${translate('friends.friend9')}
					</div>
					<div
						class="send-message-button"
						@click="${() => {
							const customEvent = new CustomEvent('open-visiting-profile', { detail: this.name });
							window.dispatchEvent(customEvent);
							this.closePopover();
							this.closeSidePanel();
						}}"
					>
						<mwc-icon style="color: var(--black)">person</mwc-icon>
						${translate('profile.profile18')}
					</div>
				</div>
			</div>
		`
	}

	firstUpdated() {
		// ...
	}

	getNodeUrl() {
		const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		return myNode.protocol + '://' + myNode.domain + ':' + myNode.port
	}

	attachToTarget(target) {
		if (!this.popperInstance && target) {
			this.popperInstance = createPopper(target, this, {
				placement: 'bottom'
			})
		}
	}

	openPopover(target) {
		this.attachToTarget(target)
		this.style.display = 'block'
		setTimeout(() => {
			this.shadowRoot.getElementById('parent-div').focus()
		}, 50)
	}

	closePopover() {
		this.style.display = 'none'
		if (this.popperInstance) {
			this.popperInstance.destroy()
			this.popperInstance = null
		}
		this.requestUpdate()
	}

	handleBlur() {
		setTimeout(() => {
			this.closePopover()
		}, 0)
	}

	async getUserAddress() {
		try {
			const url = `${this.nodeUrl}/names/${this.name}`
			const res = await fetch(url)
			const result = await res.json()
			if (result.error === 401) {
				return ''
			} else {
				return result.owner
			}
		} catch (error) {
			return ''
		}
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

window.customElements.define('friend-item-actions', FriendItemActions)
