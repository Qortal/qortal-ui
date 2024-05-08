import { html, LitElement } from 'lit'
import { Epml } from '../../../epml'
import { chatGroupsManagerStyles } from './plugins-css'
import './WrapperModal'
import './TipUser'
import './UserInfo'
import './ChatImage'
import './ReusableImage'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-icon'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@polymer/paper-progress/paper-progress.js'
import '@vaadin/button'

// Multi language support
import { get } from '../../../../core/translate'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ChatGroupsManager extends LitElement {
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
			setUserName: { attribute: false },
			chatId: { type: String },
			_chatId: { type: String },
			isReceipient: { type: Boolean },
			groups: { type: Array },
			viewImage: { type: Boolean },
			autoView: { type: Boolean },
			onlyMyImages: { type: Boolean },
			repost: { attribute: false }
		}
	}

	static get styles() {
		return [chatGroupsManagerStyles]
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
		this.getGroups = this.getGroups.bind(this)
		this.viewElement = ''
		this.downObserverElement = ''
		this.sendMoneyLoading = false
		this.btnDisable = false
		this.errorMessage = ''
		this.successMessage = ''
		this.groups = []
		this.viewImage = false
		this.myName = window.parent.reduxStore.getState().app.accountInfo.names[0].name
		this.myAddress = window.parent.reduxStore.getState().app.selectedAddress.address
		this.autoView = false
		this.onlyMyImages = true
	}

	render() {
		console.log('this.groups', this.groups)

		return html`
			<div class="container">
				<div class="close-row" style="margin-top: 15px">
					<mwc-icon @click=${() => {this.getGroups();}} style="color: var(--black); cursor:pointer;">refresh</mwc-icon>
				</div>
				<div class="checkbox-row">
					<label for="authButton" id="authButtonLabel" style="color: var(--black);">${get('chatpage.cchange69')}</label>
					<mwc-checkbox style="margin-right: -15px;" id="authButton" @click=${(e) => this.selectAuto(e)} ?checked=${this.autoView}></mwc-checkbox>
				</div>
				<div class="checkbox-row">
					<label for="authButton" id="authButtonLabel" style="color: var(--black);">${get('chatpage.cchange95')}</label>
					<mwc-checkbox style="margin-right: -15px;" id="authButton" @click=${(e) => this.selectMyImages(e)} ?checked=${this.onlyMyImages}></mwc-checkbox>
				</div>
				<div id="viewElement" class="container-body">
					<div id='downObserver'></div>
				</div>
			</div>
		`
	}

	firstUpdated() {
		this.getGroups()
	}

	async getGroups() {
		try {
			let endpoint = `/groups`

			this.groups = await parentEpml.request('apiCall', {
				type: 'api',
				url: endpoint
			})
		} catch (error) {
			console.log(error)
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
		const observer = new IntersectionObserver(
			this.observerHandler,
			options
		)

		// call `observe()` on that MutationObserver instance,
		// passing it the element to observe, and the options object
		observer.observe(elementToObserve)
	}

	observerHandler(entries) {
		if (!entries[0].isIntersecting) {
		} else {
			if (this.images.length < 20) {
				return
			}

			this.getMoreImages()
		}
	}

	selectAuto(e) {
		this.autoView = !e.target.checked
	}

	selectMyImages(e) {
		this.onlyMyImages = !e.target.checked
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

window.customElements.define('chat-groups-manager', ChatGroupsManager)
