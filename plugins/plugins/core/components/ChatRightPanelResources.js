import {css, html, LitElement} from 'lit';
import {Epml} from '../../../epml';
import '@material/mwc-button';
import '@material/mwc-dialog';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import '@polymer/paper-progress/paper-progress.js';
import '@material/mwc-icon';
import '@vaadin/button';
import './WrapperModal';
import './TipUser';
import './UserInfo/UserInfo';
import './ChatImage';
import './ReusableImage';
import {get, translate,} from '../../../../core/translate'
import {generateIdFromAddresses} from '../../utils/id-generation';

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent });

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
			autoView: {type: Boolean},
			onlyMyImages: {type: Boolean},
			repost: {attribute: false}
		};
	}

	constructor() {
		super();
		this.leaveGroupObj = {};
		this.leaveFee = 0.001;
		this.error = false;
		this.chatHeads = [];
		this.groupAdmin = [];
		this.groupMembers = [];
		this.observerHandler = this.observerHandler.bind(this);
		this.getMoreImages = this.getMoreImages.bind(this);
		this.viewElement = '';
		this.downObserverElement = '';

		this.sendMoneyLoading = false;
		this.btnDisable = false;
		this.errorMessage = '';
		this.successMessage = '';

		this.images = [];
		this.viewImage = false;
		this.myName =
			window.parent.reduxStore.getState().app.accountInfo.names[0].name;
		this.myAddress =
			window.parent.reduxStore.getState().app.selectedAddress.address;
        this.autoView =false
        this.onlyMyImages = true
	}

	static get styles() {
		return css`
			.top-bar-icon {
				cursor: pointer;
				height: 18px;
				width: 18px;
				transition: 0.2s all;
			}

			.top-bar-icon:hover {
				color: var(--black);
			}

			.modal-button {
				font-family: Roboto, sans-serif;
				font-size: 16px;
				color: var(--mdc-theme-primary);
				background-color: transparent;
				padding: 8px 10px;
				border-radius: 5px;
				border: none;
				transition: all 0.3s ease-in-out;
			}

			.close-row {
				width: 100%;
				display: flex;
				justify-content: flex-end;
				height: 50px;
				flex: 0;
                align-items: center;
			}

			.container-body {
				width: 100%;
				display: flex;
				flex-direction: column;
				flex-grow: 1;
				overflow: auto;
				margin-top: 5px;
				padding: 0px 6px;
				box-sizing: border-box;
			}

			.container-body::-webkit-scrollbar-track {
				background-color: whitesmoke;
				border-radius: 7px;
			}

			.container-body::-webkit-scrollbar {
				width: 6px;
				border-radius: 7px;
				background-color: whitesmoke;
			}

			.container-body::-webkit-scrollbar-thumb {
				background-color: rgb(180, 176, 176);
				border-radius: 7px;
				transition: all 0.3s ease-in-out;
			}

			.container-body::-webkit-scrollbar-thumb:hover {
				background-color: rgb(148, 146, 146);
				cursor: pointer;
			}

			p {
				color: var(--black);
				margin: 0px;
				padding: 0px;
				word-break: break-all;
			}

			.container {
				display: flex;
				width: 100%;
				flex-direction: column;
				height: 100%;
			}

			.chat-right-panel-label {
				font-family: Montserrat, sans-serif;
				color: var(--group-header);
				padding: 5px;
				font-size: 13px;
				user-select: none;
			}

			.group-info {
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				gap: 10px;
			}

			.group-name {
				font-family: Raleway, sans-serif;
				font-size: 20px;
				color: var(--chat-bubble-msg-color);
				text-align: center;
				user-select: none;
			}

			.group-description {
				font-family: Roboto, sans-serif;
				color: var(--chat-bubble-msg-color);
				letter-spacing: 0.3px;
				font-weight: 300;
				font-size: 14px;
				margin-top: 15px;
				word-break: break-word;
				user-select: none;
			}

			.group-subheader {
				font-family: Montserrat, sans-serif;
				font-size: 14px;
				color: var(--chat-bubble-msg-color);
			}

			.group-data {
				font-family: Roboto, sans-serif;
				letter-spacing: 0.3px;
				font-weight: 300;
				font-size: 14px;
				color: var(--chat-bubble-msg-color);
			}
			.message-myBg {
				background-color: var(--chat-bubble-myBg) !important;
				margin-bottom: 15px;
				border-radius: 5px;
				padding: 5px;
			}
			.message-data-name {
				user-select: none;
				color: #03a9f4;
				margin-bottom: 5px;
			}
			.message-user-info {
				display: flex;
				justify-content: space-between;
				width: 100%;
				gap: 10px;
			}

			.hideImg {
				visibility: hidden;
			}
            .checkbox-row {
                position: relative;
		    display: flex;
		    align-items: center;
		    align-content: center;
		    font-family: Montserrat, sans-serif;
		    font-weight: 600;
		    color: var(--black);
			padding-left: 5px;
	      }
		`;
	}

	async getMoreImages(reset) {
		try {
            if(reset){
                this.images = []
            }
			const groupPart = this.isReceipient
				? `direct_${generateIdFromAddresses(this._chatId, this.myAddress)}`
				: `group_${this._chatId}`;

			let offset = reset ? 0 : this.images.length;
            let endpoint = `/arbitrary/resources/search?service=QCHAT_IMAGE&identifier=qchat_${groupPart}&mode=ALL&limit=20&reverse=true&offset=${offset}`
            if(this.onlyMyImages){
                endpoint = endpoint + `&name=${this.myName}`
            }
			const qchatImages = await parentEpml.request('apiCall', {
				type: 'api',
				url: endpoint,
			});

            let list = []
            if(reset){
                list = qchatImages
            } else {
                list = [...this.images, ...qchatImages]
            }

			this.images = list
		} catch (error) {
			console.log(error);
		}
	}

	firstUpdated() {
		this.viewElement = this.shadowRoot.getElementById('viewElement');
		this.downObserverElement =
			this.shadowRoot.getElementById('downObserver');
		this.elementObserver();
	}

	async updated(changedProperties) {
		if (changedProperties && changedProperties.has('_chatId')) {
			this.images = [];
			await this.getMoreImages(true);
		}

		if (changedProperties && changedProperties.has('onlyMyImages')) {
			await this.getMoreImages(true)
		}
	}

	elementObserver() {
		const options = {
			root: this.viewElement,
			rootMargin: '0px',
			threshold: 1,
		};
		// identify an element to observe
		const elementToObserve = this.downObserverElement;
		// passing it a callback function
		const observer = new IntersectionObserver(
			this.observerHandler,
			options
		);
		// call `observe()` on that MutationObserver instance,
		// passing it the element to observe, and the options object
		observer.observe(elementToObserve);
	}

	observerHandler(entries) {
		if (!entries[0].isIntersecting) {

		} else {
			if (this.images.length < 20) {
				return;
			}
			this.getMoreImages();
		}
	}

    selectAuto(e) {
        this.autoView = !e.target.checked;
    }

    selectMyImages(e) {
        this.onlyMyImages = !e.target.checked;
    }

	render() {
		return html`

        <div class="container">
            <div class="close-row" style="margin-top: 15px">
            <mwc-icon @click=${()=> {
                this.getMoreImages(true)
            }} style="color: var(--black); cursor:pointer;">refresh</mwc-icon>
                <vaadin-icon class="top-bar-icon" @click=${() =>
					this.toggle(
						false
					)} style="margin: 0px 10px" icon="vaadin:close" slot="icon"></vaadin-icon>
            </div>
            <div class="checkbox-row">
                            <label for="authButton" id="authButtonLabel" style="color: var(--black);">
                                ${get('chatpage.cchange69')}
                            </label>
                            <mwc-checkbox style="margin-right: -15px;" id="authButton" @click=${(e) => this.selectAuto(e)} ?checked=${this.autoView}></mwc-checkbox>
                    </div>
                    <div class="checkbox-row">
                            <label for="authButton" id="authButtonLabel" style="color: var(--black);">
                                ${get('chatpage.cchange95')}
                            </label>
                            <mwc-checkbox style="margin-right: -15px;" id="authButton" @click=${(e) => this.selectMyImages(e)} ?checked=${this.onlyMyImages}></mwc-checkbox>
                    </div>
            <div id="viewElement" class="container-body">

                ${this.images.map((image) => {
					return html`<image-parent .repost=${this.repost} .image=${image} ?autoView=${this.autoView}></image-parent>`;
				})}
                <div id='downObserver'></div>
            </div>
        </div>
    </div>
    `;
	}
}

customElements.define('chat-right-panel-resources', ChatRightPanelResources);

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
            autoView: {type: Boolean},
			repost: {attribute: false},
			isImgLoaded: {type: Boolean}
		};
	}

	constructor() {
		super();
		this.leaveGroupObj = {};
		this.leaveFee = 0.001;
		this.error = false;
		this.chatHeads = [];
		this.groupAdmin = [];
		this.groupMembers = [];
		this.viewElement = '';

		this.sendMoneyLoading = false;
		this.btnDisable = false;
		this.errorMessage = '';
		this.successMessage = '';
		this.isImgLoaded = false
		this.images = [];
		this.viewImage = false;
		this.myName =
			window.parent.reduxStore.getState().app.accountInfo.names[0].name;
	}

	static get styles() {
		return css`
			.top-bar-icon {
				cursor: pointer;
				height: 18px;
				width: 18px;
				transition: 0.2s all;
			}

			.top-bar-icon:hover {
				color: var(--black);
			}

			.modal-button {
				font-family: Roboto, sans-serif;
				font-size: 16px;
				color: var(--mdc-theme-primary);
				background-color: transparent;
				padding: 8px 10px;
				border-radius: 5px;
				border: none;
				transition: all 0.3s ease-in-out;
			}

			.close-row {
				width: 100%;
				display: flex;
				justify-content: flex-end;
				height: 50px;
				flex: 0;
                gap: 20px;
                align-items: center;
			}

			.container-body {
				width: 100%;
				display: flex;
				flex-direction: column;
				flex-grow: 1;
				overflow: auto;
				margin-top: 5px;
				padding: 0px 6px;
				box-sizing: border-box;
			}

			.container-body::-webkit-scrollbar-track {
				background-color: whitesmoke;
				border-radius: 7px;
			}

			.container-body::-webkit-scrollbar {
				width: 6px;
				border-radius: 7px;
				background-color: whitesmoke;
			}

			.container-body::-webkit-scrollbar-thumb {
				background-color: rgb(180, 176, 176);
				border-radius: 7px;
				transition: all 0.3s ease-in-out;
			}

			.container-body::-webkit-scrollbar-thumb:hover {
				background-color: rgb(148, 146, 146);
				cursor: pointer;
			}

			p {
				color: var(--black);
				margin: 0px;
				padding: 0px;
				word-break: break-all;
			}

			.container {
				display: flex;
				width: 100%;
				flex-direction: column;
				height: 100%;
			}

			.chat-right-panel-label {
				font-family: Montserrat, sans-serif;
				color: var(--group-header);
				padding: 5px;
				font-size: 13px;
				user-select: none;
			}

			.group-info {
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				gap: 10px;
			}

			.group-name {
				font-family: Raleway, sans-serif;
				font-size: 20px;
				color: var(--chat-bubble-msg-color);
				text-align: center;
				user-select: none;
			}

			.group-description {
				font-family: Roboto, sans-serif;
				color: var(--chat-bubble-msg-color);
				letter-spacing: 0.3px;
				font-weight: 300;
				font-size: 14px;
				margin-top: 15px;
				word-break: break-word;
				user-select: none;
			}

			.group-subheader {
				font-family: Montserrat, sans-serif;
				font-size: 14px;
				color: var(--chat-bubble-msg-color);
			}

			.group-data {
				font-family: Roboto, sans-serif;
				letter-spacing: 0.3px;
				font-weight: 300;
				font-size: 14px;
				color: var(--chat-bubble-msg-color);
			}
			.message-myBg {
				background-color: var(--chat-bubble-myBg) !important;
				margin-bottom: 15px;
				border-radius: 5px;
				padding: 5px;
			}
			.message-data-name {
				user-select: none;
				color: #03a9f4;
				margin-bottom: 5px;
			}
			.message-user-info {
				display: flex;
				justify-content: space-between;
				width: 100%;
				gap: 10px;
			}

			.hideImg {
				visibility: hidden;
			}
			.image-container {
				display: flex;
			}
			.repost-btn {
				margin-top: 4px;
                max-height: 28px;
                padding: 5px 5px;
                font-size: 14px;
                background-color: #03a9f4;
                color: white;
                border: 1px solid transparent;
                border-radius: 3px;
                cursor: pointer;
			}
		`;
	}

	firstUpdated() {}

	async updated(changedProperties) {
		if (changedProperties && changedProperties.has('chatId')) {
			// const autoSeeChatList =
			// 	window.parent.reduxStore.getState().app.autoLoadImageChats;
			// if (autoSeeChatList.includes(this.chatId)) {
			// 	this.viewImage = true;
			// }
		}
	}

	onLoad(){
		this.isImgLoaded = true
		this.requestUpdate()
	}

	render() {
		return html`
			${!this.autoView && !this.viewImage && this.myName !== this.image.name
				? html`
						<div class="message-myBg">
							<div class="message-user-info">
								<span class="message-data-name">
									${this.image.name}
								</span>
							</div>
							<div
								@click=${() => {
									this.viewImage = true;
								}}
								class=${[`image-container`].join(' ')}
								style="height: 200px"
							>
								<div
									style="display:flex;width:100%;height:100%;justify-content:center;align-items:center;cursor:pointer;color:var(--black);"
								>
									${translate('chatpage.cchange40')}
								</div>
							</div>
						</div>
				  `
				: html``}
			${this.autoView || this.viewImage || this.myName === this.image.name
				? html`
						<div class="message-myBg">
							<div class="message-user-info">
								<span class="message-data-name">
									${this.image.name}
								</span>
							</div>
							<reusable-image
								.resource=${{
									name: this.image.name,
									service: this.image.service,
									identifier: this.image.identifier,
								}}
								.onLoad=${()=> this.onLoad()}
							></reusable-image>
							${this.isImgLoaded ? html`
							<div class="actions-parent">
								<button class="repost-btn" @click=${()=> this.repost(this.image)}>repost</button>
							</div>
							` : ''}

						</div>
				  `
				: ''}
		`;
	}
}

customElements.define('image-parent', ImageParent);
