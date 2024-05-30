import { html, LitElement } from 'lit'
import { getUserNameFromAddress } from '../../utils/functions'
import { chatRightPanelStyles } from './plugins-css'
import './WrapperModal'
import './TipUser'
import './UserInfo'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-icon'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@polymer/paper-progress/paper-progress.js'
import '@vaadin/button'

class ChatRightPanel extends LitElement {
	static get properties() {
		return {
			leaveGroupObj: { type: Object },
			error: { type: Boolean },
			chatHeads: { type: Array },
			groupAdmin: { attribute: false },
			groupMembers: { attribute: false },
			selectedHead: { type: Object },
			toggle: { attribute: false },
			getMoreMembers: { attribute: false },
			setOpenPrivateMessage: { attribute: false },
			userName: { type: String },
			walletBalance: { type: Number },
			sendMoneyLoading: { type: Boolean },
			btnDisable: { type: Boolean },
			errorMessage: { type: String },
			successMessage: { type: String },
			setOpenTipUser: { attribute: false },
			setOpenUserInfo: { attribute: false },
			setUserName: { attribute: false }
		}
	}

	static get styles() {
		return [chatRightPanelStyles]
	}

	constructor() {
		super()
		this.leaveGroupObj = {}
		this.leaveFee = 0.01
		this.error = false
		this.chatHeads = []
		this.groupAdmin = []
		this.groupMembers = []
		this.observerHandler = this.observerHandler.bind(this)
		this.viewElement = ''
		this.downObserverElement = ''
		this.myAddress = window.parent.reduxStore.getState().app.selectedAddress.address
		this.sendMoneyLoading = false
		this.btnDisable = false
		this.errorMessage = ''
		this.successMessage = ''
	}

	render() {
		const owner = this.groupAdmin.filter((admin) => admin.address === this.leaveGroupObj.owner)
		return html`
			<div class="container">
				<div class="close-row" style="margin-top: 15px">
					<vaadin-icon class="top-bar-icon" @click=${() => this.toggle(false)} style="margin: 0px 10px" icon="vaadin:close" slot="icon"></vaadin-icon>
				</div>
				<div id="viewElement" class="container-body">
					<p class="group-name">${this.leaveGroupObj && this.leaveGroupObj.groupName}</p>
					<div class="group-info">
						<p class="group-description">${this.leaveGroupObj && this.leaveGroupObj.description}</p>
						<p class="group-subheader">Members: <span class="group-data">${this.leaveGroupObj && this.leaveGroupObj.memberCount}</span></p>
						<p class="group-subheader">Date created : <span class="group-data">${new Date(this.leaveGroupObj.created).toLocaleDateString("en-US")}</span></p>
					</div>
					<br />
					<p class="chat-right-panel-label">GROUP OWNER</p>
					${owner.map((item) => {
						return html`
							<chat-side-nav-heads
								activeChatHeadUrl=""
								.setActiveChatHeadUrl=${(val) => {
									if (val.address === this.myAddress) return;
									this.selectedHead = val;
									this.setOpenUserInfo(true);
									this.setUserName({
										sender: val.address,
										senderName: val.name ? val.name : ""
									});
								}}
								chatInfo=${JSON.stringify(item)}
							>
							</chat-side-nav-heads>
						`
					})}
					<p class="chat-right-panel-label">ADMINS</p>
					${this.groupAdmin.map((item) => {
						return html`
							<chat-side-nav-heads
								activeChatHeadUrl=""
								.setActiveChatHeadUrl=${(val) => {
									if (val.address === this.myAddress) return;
									this.selectedHead = val;
									this.setOpenUserInfo(true);
									this.setUserName({
										sender: val.address,
										senderName: val.name ? val.name : ""
									});
								}}
								chatInfo=${JSON.stringify(item)}
							>
							</chat-side-nav-heads>
						`
					})}
					<p class="chat-right-panel-label">MEMBERS</p>
					${this.groupMembers.map((item) => {
						return html`
							<chat-side-nav-heads
								activeChatHeadUrl=""
								.setActiveChatHeadUrl=${(val) => {
									if (val.address === this.myAddress) return;
									this.selectedHead = val;
									this.setOpenUserInfo(true);
									this.setUserName({
										sender: val.address,
										senderName: val.name ? val.name : ""
									});
								}}
								chatInfo=${JSON.stringify(item)}
							>
							</chat-side-nav-heads>
						`
					})}
					<div id='downObserver'></div>
				</div>
			</div>
		`
	}

	firstUpdated() {
		this.viewElement = this.shadowRoot.getElementById('viewElement')
		this.downObserverElement = this.shadowRoot.getElementById('downObserver')
		this.elementObserver()
	}

	async updated(changedProperties) {
		if (changedProperties && changedProperties.has('selectedHead')) {
			if (this.selectedHead !== {}) {
				this.userName = await getUserNameFromAddress(this.selectedHead.address)
			}
		}
	}

	elementObserver() {
		const options = {
			root: this.viewElement,
			rootMargin: '0px',
			threshold: 1
		}

		// identify an element to observe
		const elementToObserve = this.downObserverElement

		// passing it a callback function
		const observer = new IntersectionObserver(this.observerHandler, options)

		// call `observe()` on that MutationObserver instance,
		// passing it the element to observe, and the options object
		observer.observe(elementToObserve)
	}

	observerHandler(entries) {
		if (!entries[0].isIntersecting) {
		} else {
			if (this.groupMembers.length < 20) {
				return
			}
			this.getMoreMembers(this.leaveGroupObj.groupId)
		}
	}

	// Standard functions
	getApiKey() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.apiKey
	}

	isEmptyArray(arr) {
		if (!arr) { return true }
		return arr.length === 0
	}

	round(number) {
		return (Math.round(parseFloat(number) * 1e8) / 1e8).toFixed(8)
	}
}

window.customElements.define("chat-right-panel", ChatRightPanel)
