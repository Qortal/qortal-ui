import { html, LitElement } from 'lit'
import { Epml } from '../../../epml'
import { generateIdFromAddresses } from '../../utils/functions'
import { chatRightPanelResourcesStyles, imageParentStyles } from './plugins-css'
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
import { get, translate } from '../../../../core/translate'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ChatRightPanelResources extends LitElement {
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
			images: { type: Array },
			viewImage: { type: Boolean },
			autoView: { type: Boolean },
			onlyMyImages: { type: Boolean },
			repost: { attribute: false }
		}
	}

	static get styles() {
		return [chatRightPanelResourcesStyles]
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
		this.getMoreImages = this.getMoreImages.bind(this)
		this.viewElement = ''
		this.downObserverElement = ''
		this.sendMoneyLoading = false
		this.btnDisable = false
		this.errorMessage = ''
		this.successMessage = ''
		this.images = []
		this.viewImage = false
		this.myName = window.parent.reduxStore.getState().app.accountInfo.names[0].name
		this.myAddress = window.parent.reduxStore.getState().app.selectedAddress.address
		this.autoView = false
		this.onlyMyImages = true
	}

	render() {
		return html`
			<div class="container">
				<div class="close-row" style="margin-top: 15px">
					<mwc-icon @click=${() => {this.getMoreImages(true);}} style="color: var(--black); cursor:pointer;">refresh</mwc-icon>
					<vaadin-icon class="top-bar-icon" @click=${() => this.toggle(false)} style="margin: 0px 10px" icon="vaadin:close" slot="icon"></vaadin-icon>
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
					${this.images.map((image) => {
						return html`
							<image-parent .repost=${this.repost} .image=${image} ?autoView=${this.autoView}></image-parent>
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

	async getMoreImages(reset) {
		try {
			if (reset) {
				this.images = []
			}

			const groupPart = this.isReceipient ? `direct_${generateIdFromAddresses(this._chatId, this.myAddress)}` : `group_${this._chatId}`

			let offset = reset ? 0 : this.images.length

			let endpoint = `/arbitrary/resources/search?service=QCHAT_IMAGE&identifier=qchat_${groupPart}&mode=ALL&limit=20&reverse=true&offset=${offset}`

			if (this.onlyMyImages) {
				endpoint = endpoint + `&name=${this.myName}`
			}

			const qchatImages = await parentEpml.request('apiCall', {
				type: 'api',
				url: endpoint
			})

			let list = []

			if (reset) {
				list = qchatImages
			} else {
				list = [...this.images, ...qchatImages]
			}

			this.images = list
		} catch (error) {
			console.log(error)
		}
	}

	async updated(changedProperties) {
		if (changedProperties && changedProperties.has('_chatId')) {
			this.images = []
			await this.getMoreImages(true)
		}

		if (changedProperties && changedProperties.has('onlyMyImages')) {
			await this.getMoreImages(true)
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

window.customElements.define('chat-right-panel-resources', ChatRightPanelResources)

class ImageParent extends LitElement {
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
			images: { type: Array },
			viewImage: { type: Boolean },
			image: { type: Object },
			autoView: { type: Boolean },
			repost: { attribute: false },
			isImgLoaded: { type: Boolean }
		}
	}

	static get styles() {
		return [imageParentStyles]
	}

	constructor() {
		super()
		this.leaveGroupObj = {}
		this.leaveFee = 0.01
		this.error = false
		this.chatHeads = []
		this.groupAdmin = []
		this.groupMembers = []
		this.viewElement = ''
		this.sendMoneyLoading = false
		this.btnDisable = false
		this.errorMessage = ''
		this.successMessage = ''
		this.isImgLoaded = false
		this.images = []
		this.viewImage = false
		this.myName = window.parent.reduxStore.getState().app.accountInfo.names[0].name
	}

	render() {
		return html`
			${!this.autoView && !this.viewImage && this.myName !== this.image.name ?
				html`
					<div class="message-myBg">
						<div class="message-user-info">
							<span class="message-data-name">${this.image.name}</span>
						</div>
						<div @click=${() => {this.viewImage = true;}} class=${[`image-container`].join(' ')} style="height: 200px">
							<div style="display:flex;width:100%;height:100%;justify-content:center;align-items:center;cursor:pointer;color:var(--black);">
								${translate('chatpage.cchange40')}
							</div>
						</div>
					</div>
				`
				: html``
			}
			${this.autoView || this.viewImage || this.myName === this.image.name ?
				html`
					<div class="message-myBg">
						<div class="message-user-info">
							<span class="message-data-name">${this.image.name}</span>
						</div>
						<reusable-image
							.resource=${{
								name: this.image.name,
								service: this.image.service,
								identifier: this.image.identifier
							}}
							.onLoad=${() => this.onLoad()}
						>
						</reusable-image>
						${this.isImgLoaded ?
							html`
								<div class="actions-parent">
									<button class="repost-btn" @click=${() => this.repost(this.image)}>repost</button>
								</div>
							`
							: ''
						}
					</div>
				`
				: ''
			}
		`
	}

	firstUpdated() {
		// ...
	}

	async updated(changedProperties) {
		if (changedProperties && changedProperties.has('chatId')) {
			// ...
		}
	}

	onLoad() {
		this.isImgLoaded = true
		this.requestUpdate()
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

window.customElements.define('image-parent', ImageParent)
