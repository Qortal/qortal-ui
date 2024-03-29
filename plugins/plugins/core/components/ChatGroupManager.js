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
import {get} from '../../../../core/translate'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent });

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
		this.getGroups = this.getGroups.bind(this);
		this.viewElement = '';
		this.downObserverElement = '';

		this.sendMoneyLoading = false;
		this.btnDisable = false;
		this.errorMessage = '';
		this.successMessage = '';

		this.groups = [];
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

	async getGroups() {
		try {

            let endpoint = `/groups`


			this.groups = await parentEpml.request('apiCall', {
				type: 'api',
				url: endpoint,
			})
		} catch (error) {
			console.log(error);
		}
	}

	firstUpdated() {
		// this.viewElement = this.shadowRoot.getElementById('viewElement');
		// this.downObserverElement =
		// 	this.shadowRoot.getElementById('downObserver');
		// this.elementObserver();
		this.getGroups()
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
		console.log('this.groups', this.groups)
		return html`

        <div class="container">
            <div class="close-row" style="margin-top: 15px">
            <mwc-icon @click=${()=> {
                this.getGroups()
            }} style="color: var(--black); cursor:pointer;">refresh</mwc-icon>
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


                <div id='downObserver'></div>
            </div>
        </div>
    </div>
    `;
	}
}

customElements.define('chat-groups-manager', ChatGroupsManager);

