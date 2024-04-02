import {css, html, LitElement} from "lit";
import {Epml} from "../../../epml";
import {getUserNameFromAddress} from "../../utils/getUserNameFromAddress";
import "@material/mwc-button";
import "@material/mwc-dialog";
import "@polymer/paper-spinner/paper-spinner-lite.js";
import '@polymer/paper-progress/paper-progress.js';
import "@material/mwc-icon";
import '@vaadin/button';
import "./WrapperModal";
import "./TipUser"
import "./UserInfo/UserInfo";

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

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
            getMoreMembers:{ attribute: false },
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
		}
	}

	constructor() {
		super()
		this.leaveGroupObj = {}
		this.leaveFee = 0.001
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
        this.errorMessage = ""
        this.successMessage = ""
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
            flex:0

        }

        .container-body {
            width: 100%;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            overflow:auto;
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
    `
    }

	firstUpdated() {
        this.viewElement = this.shadowRoot.getElementById('viewElement');
        this.downObserverElement = this.shadowRoot.getElementById('downObserver');
        this.elementObserver();
    }

    async updated(changedProperties) {
        if (changedProperties && changedProperties.has('selectedHead')) {
            if (this.selectedHead !== {}) {
				this.userName = await getUserNameFromAddress(this.selectedHead.address);
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
        const elementToObserve = this.downObserverElement;
        // passing it a callback function
        const observer = new IntersectionObserver(this.observerHandler, options);
        // call `observe()` on that MutationObserver instance,
        // passing it the element to observe, and the options object
        observer.observe(elementToObserve);
    }

    observerHandler(entries) {
        if (!entries[0].isIntersecting) {

        } else {
            if(this.groupMembers.length < 20){
                return
            }
            this.getMoreMembers(this.leaveGroupObj.groupId)
        }
    }

	render() {
        const owner = this.groupAdmin.filter((admin)=> admin.address === this.leaveGroupObj.owner)
		return html`
        <div class="container">
            <div class="close-row" style="margin-top: 15px">
                <vaadin-icon class="top-bar-icon" @click=${()=> this.toggle(false)} style="margin: 0px 10px" icon="vaadin:close" slot="icon"></vaadin-icon>
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
                    return html`<chat-side-nav-heads
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
                    ></chat-side-nav-heads>`
                })}
                <p class="chat-right-panel-label">ADMINS</p>
                ${this.groupAdmin.map((item) => {
                    return html`<chat-side-nav-heads
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
                    ></chat-side-nav-heads>`
                })}
                <p class="chat-right-panel-label">MEMBERS</p>
                ${this.groupMembers.map((item) => {
                    return html`<chat-side-nav-heads
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
                    ></chat-side-nav-heads>`
                })}
                <div id='downObserver'></div>
            </div>
        </div>
    </div>
    `
	}
}

customElements.define("chat-right-panel", ChatRightPanel)
