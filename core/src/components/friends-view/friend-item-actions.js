// popover-component.js
import { LitElement, html, css } from 'lit';
import { createPopper } from '@popperjs/core';
import '@material/mwc-icon';
import { use, get, translate } from 'lit-translate';
import { store } from '../../store';
import { connect } from 'pwa-helpers';
import { setNewTab, setSideEffectAction } from '../../redux/app/app-actions';
import ShortUniqueId from 'short-unique-id';

export class FriendItemActions extends connect(store)(LitElement) {
	static styles = css`
		:host {
			display: none;
			position: absolute;
			background-color: var(--white);
			border: 1px solid #ddd;
			padding: 8px;
			z-index: 10;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
			color: var(--black);
			max-width: 250px;
		}

		.close-icon {
			cursor: pointer;
			float: right;
			margin-left: 10px;
			color: var(--black);
		}

		.send-message-button {
			font-family: Roboto, sans-serif;
			letter-spacing: 0.3px;
			font-weight: 300;
			padding: 8px 5px;
			border-radius: 3px;
			text-align: center;
			color: var(--mdc-theme-primary);
			transition: all 0.3s ease-in-out;
			display: flex;
			align-items: center;
			gap: 10px
		}

		.send-message-button:hover {
			cursor: pointer;
			background-color: #03a8f485;
		}
		.action-parent {
			display: flex;
			flex-direction: column;
			width: 100%;
		}

		div[tabindex='0']:focus {
			outline: none;
		}
	`;

	static get properties() {
		return {
			for: { type: String, reflect: true },
			message: { type: String },
			openEditFriend: { attribute: false },
			name: { type: String },
		};
	}

	constructor() {
		super();
		this.message = '';
		this.nodeUrl = this.getNodeUrl();
		this.uid = new ShortUniqueId();
        this.getUserAddress = this.getUserAddress.bind(this)
	}
	getNodeUrl() {
		const myNode =
			store.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			];

		const nodeUrl =
			myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
		return nodeUrl;
	}

	firstUpdated() {
		// We'll defer the popper attachment to the openPopover() method to ensure target availability
	}

	attachToTarget(target) {
		if (!this.popperInstance && target) {
			this.popperInstance = createPopper(target, this, {
				placement: 'bottom',
				strategy: 'fixed',
			});
		}
	}

	openPopover(target) {
		this.attachToTarget(target);
		this.style.display = 'block';
		setTimeout(() => {
			this.shadowRoot.getElementById('parent-div').focus();
		}, 50);
	}

	closePopover() {
		this.style.display = 'none';
		if (this.popperInstance) {
			this.popperInstance.destroy();
			this.popperInstance = null;
		}
		this.requestUpdate();
	}
	handleBlur() {
		setTimeout(() => {
			this.closePopover();
		}, 0);
	}

	async getUserAddress() {
		try {
			const url = `${this.nodeUrl}/names/${this.name}`;
			const res = await fetch(url);
			const result = await res.json();
			if (result.error === 401) {
				return '';
			} else {
				return result.owner;
			}
		} catch (error) {
			return '';
		}
	}

	render() {
		return html`
			<div id="parent-div" tabindex="0" @blur=${this.handleBlur}>
				<span class="close-icon" @click="${this.closePopover}"
					><mwc-icon style="color: var(--black)"
						>close</mwc-icon
					></span
				>
				<div class="action-parent">
					<div
						class="send-message-button"
						@click="${() => {
							this.openEditFriend();
							this.closePopover();
						}}"
					>
					<mwc-icon style="color: var(--black)"
						>edit</mwc-icon
					>
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
										page: 'messaging/q-chat/index.html',
										title: 'Q-Chat',
										icon: 'vaadin:chat',
										mwcicon: 'forum',
										pluginNumber: 'plugin-qhsyOnpRhT',
										menus: [],
										parent: false,
									},

									openExisting: true,
								})
							);
							store.dispatch(
								setSideEffectAction({
									type: 'openPrivateChat',
									data: {
                                        address,
                                        name: this.name
                                    },
								})
							);
							this.closePopover();
						}}"
					>
					<mwc-icon style="color: var(--black)"
						>send</mwc-icon
					>
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
										parent: false,
									},
									openExisting: true,
								})
							);
							this.closePopover();
						}}"
					>
					<mwc-icon style="color: var(--black)"
						>mail</mwc-icon
					>
						${translate('friends.friend9')}
					</div>
				</div>
			</div>
		`;
	}
}

customElements.define('friend-item-actions', FriendItemActions);
