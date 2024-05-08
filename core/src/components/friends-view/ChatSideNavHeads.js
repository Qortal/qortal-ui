import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store'
import { get } from '../../../translate'
import { chatSideNavHeadsStyles } from '../../styles/core-css'
import './friend-item-actions'
import '@material/mwc-icon'
import '@vaadin/tooltip'

class ChatSideNavHeads extends connect(store)(LitElement) {
	static get properties() {
		return {
			selectedAddress: { type: Object },
			config: { type: Object },
			chatInfo: { type: Object },
			iconName: { type: String },
			activeChatHeadUrl: { type: String },
			isImageLoaded: { type: Boolean },
			setActiveChatHeadUrl: { attribute: false },
			openEditFriend: { attribute: false },
			closeSidePanel: { attribute: false, type: Object }
		}
	}

	static get styles() {
		return [chatSideNavHeadsStyles]
	}

	constructor() {
		super()
		this.selectedAddress = {}
		this.config = {
			user: {
				node: {
				}
			}
		}
		this.chatInfo = {}
		this.iconName = ''
		this.activeChatHeadUrl = ''
		this.isImageLoaded = false
		this.imageFetches = 0
	}

	render() {
		let avatarImg = ''

		if (this.chatInfo.name) {
			const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
			const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
			const avatarUrl = `${nodeUrl}/arbitrary/THUMBNAIL/${this.chatInfo.name}/qortal_avatar?async=true`
			avatarImg = this.createImage(avatarUrl)
		}

		return html`
			<li
				style="display:flex; justify-content: space-between; align-items: center" 
				@click=${(e) => {
					const target = e.target
					const popover = this.shadowRoot.querySelector('friend-item-actions');
					if (popover) {
						popover.openPopover(target);
					}
				}}
				class="clearfix" id=${`friend-item-parent-${this.chatInfo.name}`}
			>
				<div style="display:flex; flex-grow: 1; align-items: center">
					${this.isImageLoaded ? html`${avatarImg}` : html``}
					${!this.isImageLoaded && !this.chatInfo.name && !this.chatInfo.groupName ?
						html`
							<mwc-icon class="img-icon">account_circle</mwc-icon>
						`
						: html``
					}
					${!this.isImageLoaded && this.chatInfo.name ?
						html`
							<div
								style="width:30px; height:30px; float: left; border-radius:50%; background: ${this.activeChatHeadUrl === this.chatInfo.url
								? "var(--chatHeadBgActive)"
								: "var(--chatHeadBg)"}; color: ${this.activeChatHeadUrl === this.chatInfo.url
								? "var(--chatHeadTextActive)"
								: "var(--chatHeadText)"}; font-weight:bold; display: flex; justify-content: center; align-items: center; text-transform: capitalize"
							>
								${this.chatInfo.name.charAt(0)}
							</div>
						` : ''
					}
					${!this.isImageLoaded && this.chatInfo.groupName ?
						html`
							<div
								style="width:30px; height:30px; float: left; border-radius:50%; background: ${this.activeChatHeadUrl === this.chatInfo.url
								? "var(--chatHeadBgActive)"
								: "var(--chatHeadBg)"}; color: ${this.activeChatHeadUrl === this.chatInfo.url
								? "var(--chatHeadTextActive)"
								: "var(--chatHeadText)"}; font-weight:bold; display: flex; justify-content: center; align-items: center; text-transform: capitalize"
							>
								${this.chatInfo.groupName.charAt(0)}
							</div>
						` : ''
					}
					<div>
						<div class="name">
							<span style="float:left; padding-left: 8px; color: var(--chat-group);">
								${this.chatInfo.groupName
									? this.chatInfo.groupName
									: this.chatInfo.name !== undefined
									? (this.chatInfo.alias || this.chatInfo.name)
									: this.chatInfo.address.substr(0, 15)
								}
							</span>
						</div>
					</div>
				</div>
				<div style="display:flex; align-items: center">
					${this.chatInfo.willFollow ?
						html`
							<mwc-icon id="willFollowIcon" style="color: var(--black)">connect_without_contact</mwc-icon>
							<vaadin-tooltip
								for="willFollowIcon"
								position="top"
								hover-delay=${200}
								hide-delay=${1}
								text=${get('friends.friend11')}
							></vaadin-tooltip>
						` : ''
					}
				</div>
			</li>
			<friend-item-actions
				for=${`friend-item-parent-${this.chatInfo.name}`}
				message=${get('notifications.explanation')}
				.openEditFriend=${() => {
					this.openEditFriend(this.chatInfo)
				}}
				name=${this.chatInfo.name}
				.closeSidePanel=${this.closeSidePanel}
			></friend-item-actions>
		`
	}

	firstUpdated() {
		// ...
	}

	createImage(imageUrl) {
		const imageHTMLRes = new Image()
		imageHTMLRes.src = imageUrl
		imageHTMLRes.style = "width:30px; height:30px; float: left; border-radius:50%; font-size:14px"

		imageHTMLRes.onclick = () => {
			this.openDialogImage = true
		}

		imageHTMLRes.onload = () => {
			this.isImageLoaded = true
		}

		imageHTMLRes.onerror = () => {
			if (this.imageFetches < 4) {
				setTimeout(() => {
					this.imageFetches = this.imageFetches + 1
					imageHTMLRes.src = imageUrl
				}, 500)
			} else {
				this.isImageLoaded = false
			}
		}

		return imageHTMLRes
	}

	shouldUpdate(changedProperties) {
		if (changedProperties.has('activeChatHeadUrl')) {
			return true
		}

		if (changedProperties.has('chatInfo')) {
			return true
		}

		return !!changedProperties.has('isImageLoaded')
	}

	getUrl(chatUrl) {
		this.setActiveChatHeadUrl(chatUrl)
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

window.customElements.define('chat-side-nav-heads', ChatSideNavHeads)