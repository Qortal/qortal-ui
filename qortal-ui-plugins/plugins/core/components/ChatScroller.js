import { LitElement, html, css } from 'lit';
import { render } from 'lit/html.js';
import { repeat } from 'lit/directives/repeat.js';
import { translate, get } from 'lit-translate';
import { Epml } from "../../../epml";
import './LevelFounder.js';
import './NameMenu.js';
import './ChatModals.js';
import '@vaadin/icons';
import '@vaadin/icon';
import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-icon';

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })
class ChatScroller extends LitElement {
    static get properties() {
        return {
            getNewMessage: { attribute: false },
            getOldMessage: { attribute: false },
            emojiPicker: { attribute: false },
            escapeHTML: { attribute: false },
            initialMessages: { type: Array }, // First set of messages to load.. 15 messages max ( props )
            messages: { type: Array },
            hideMessages: { type: Array }
        }
    }

    static get styles() {
        return css`
        html {
            --scrollbarBG: #a1a1a1;
            --thumbBG: #6a6c75;
        }

        *::-webkit-scrollbar {
            width: 11px;
        }

        * {
            scrollbar-width: thin;
            scrollbar-color: var(--thumbBG) var(--scrollbarBG);
            --mdc-theme-primary: rgb(3, 169, 244);
            --mdc-theme-secondary: var(--mdc-theme-primary);
        }

        *::-webkit-scrollbar-track {
            background: var(--scrollbarBG);
        }

        *::-webkit-scrollbar-thumb {
            background-color: var(--thumbBG);
            border-radius: 6px;
            border: 3px solid var(--scrollbarBG);
        }

        a {
            color: var(--black);
            text-decoration: none;
        }

        ul {
            list-style: none;
            margin: 0;
            padding: 20px;
        }

        .chat-list {
            overflow-y: auto;
            overflow-x: hidden;
            height: 92vh;
            box-sizing: border-box;
        }

        .message-data {
            width: 92%;
            margin-bottom: 15px;
            margin-left: 50px;
        }

        .message-data-name {
            color: var(--black);
            cursor: pointer;
        }

        .message-data-time {
            color: #a8aab1;
            font-size: 13px;
            padding-left: 6px;
            padding-bottom: 4px;
        }

        .message-data-level {
            color: #03a9f4;
            font-size: 13px;
            padding-left: 8px;
            padding-bottom: 4px;
        }

        .message {
            color: black;
            padding: 12px 10px;
            line-height: 19px;
            white-space: pre-line;
            word-wrap: break-word;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            user-select: text;
            font-size: 16px;
            border-radius: 7px;
            margin-bottom: 20px;
            width: 90%;
            position: relative;
        }

        .message:after {
            bottom: 100%;
            left: 93%;
            border: solid transparent;
            content: " ";
            height: 0;
            width: 0;
            position: absolute;
            white-space: pre-line;
            word-wrap: break-word;
            pointer-events: none;
            border-bottom-color: #ddd;
            border-width: 10px;
            margin-left: -10px;
        }

        .emoji {
            width: 1.7em;
            height: 1.5em;
            margin-bottom: -2px;
            vertical-align: bottom;
            object-fit: contain;
        }

        .my-message {
            background: #d1d1d1;
            border: 2px solid #eeeeee;
        }

        .my-message:after {
            border-bottom-color: #d1d1d1;
            left: 7%;
        }

        .other-message {
            background: #f1f1f1;
            border: 2px solid #dedede;
        }

        .other-message:after {
            border-bottom-color: #f1f1f1;
            left: 7%;
        }

        .align-left {
            text-align: left;
        }

        .align-right {
            text-align: right;
        }

        .float-left {
            float: left;
        }

        .float-right {
            float: right;
        }

        .clearfix:after {
            visibility: hidden;
            display: block;
            font-size: 0;
            content: " ";
            clear: both;
            height: 0;
        }

        img {
            border-radius: 25%;
        }
        `
    }

    constructor() {
        super()
        this.messages = []
        this._upObserverhandler = this._upObserverhandler.bind(this)
        this.myAddress = window.parent.reduxStore.getState().app.selectedAddress.address
        this.hideMessages = JSON.parse(localStorage.getItem("MessageBlockedAddresses") || "[]")
    }


    render() {
        return html`
            <ul id="viewElement" class="chat-list clearfix">
                <div id="upObserver"></div>
               
                ${repeat(
            this.messages,
            (message) => message.reference,
            (message) => html`<message-template .emojiPicker=${this.emojiPicker} .escapeHTML=${this.escapeHTML} .messageObj=${message}  .hideMessages=${this.hideMessages}></message-template>`
        )}
                <div id="downObserver"></div>
            </ul>
        `
    }

    async firstUpdated() {
        this.viewElement = this.shadowRoot.getElementById('viewElement')
        this.upObserverElement = this.shadowRoot.getElementById('upObserver')
        this.downObserverElement = this.shadowRoot.getElementById('downObserver')


        // Intialize Observers
        this.upElementObserver()
        console.log('messagess', this.messages)
        await this.updateComplete
        this.viewElement.scrollTop = this.viewElement.scrollHeight + 50
    }

    _getOldMessage(_scrollElement) {
    this.getOldMessage(_scrollElement)

        
    }

    _upObserverhandler(entries) {
        if (entries[0].isIntersecting) {
            let _scrollElement = entries[0].target.nextElementSibling
            console.log({ _scrollElement })
            this._getOldMessage(_scrollElement)
        }
    }

    upElementObserver() {
        const options = {
            root: this.viewElement,
            rootMargin: '0px',
            threshold: 1
        };

        const observer = new IntersectionObserver(this._upObserverhandler, options)
        observer.observe(this.upObserverElement)
    }
}

window.customElements.define('chat-scroller', ChatScroller)


class MessageTemplate extends LitElement {
    static get properties() {
        return {
            messageObj: { type: Object },
            hideMessages: { type: Array },
            openDialogPrivateMessage: {type: Boolean},
            openDialogBlockUser: {type: Boolean},
            showBlockAddressIcon: { type: Boolean },
        };
    }

    constructor() {
        super();
        this.messageObj = {}
        this.openDialogPrivateMessage = false
        this.openDialogBlockUser = false
        this.showBlockAddressIcon = false;
    }

    static get styles() {
        return css`
        html {
            --scrollbarBG: #a1a1a1;
            --thumbBG: #6a6c75;
        }

        *::-webkit-scrollbar {
            width: 11px;
        }

        * {
            scrollbar-width: thin;
            scrollbar-color: var(--thumbBG) var(--scrollbarBG);
            --mdc-theme-primary: rgb(3, 169, 244);
            --mdc-theme-secondary: var(--mdc-theme-primary);
        }

        *::-webkit-scrollbar-track {
            background: var(--scrollbarBG);
        }

        *::-webkit-scrollbar-thumb {
            background-color: var(--thumbBG);
            border-radius: 6px;
            border: 3px solid var(--scrollbarBG);
        }

        a {
            color: var(--black);
            text-decoration: none;
        }

        ul {
            list-style: none;
            margin: 0;
            padding: 20px;
        }

        .chat-list {
            overflow-y: auto;
            overflow-x: hidden;
            height: 92vh;
            box-sizing: border-box;
        }

        .message-data {
            width: 92%;
            margin-bottom: 15px;
            margin-left: 50px;
        }

        .message-data-name {
            color: var(--black);
            cursor: pointer;
        }

        .message-data-time {
            color: #a8aab1;
            font-size: 13px;
            padding-left: 6px;
            padding-bottom: 4px;
        }

        .message-data-level {
            color: #03a9f4;
            font-size: 13px;
            padding-left: 8px;
            padding-bottom: 4px;
        }

        .message-container {
            position: relative;
        }

        .message {
            color: black;
            padding: 12px 10px;
            line-height: 19px;
            white-space: pre-line;
            word-wrap: break-word;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            user-select: text;
            font-size: 16px;
            border-radius: 7px;
            margin-bottom: 20px;
            width: 90%;
            position: relative;
        }

        .message:after {
            bottom: 100%;
            left: 93%;
            border: solid transparent;
            content: " ";
            height: 0;
            width: 0;
            position: absolute;
            white-space: pre-line;
            word-wrap: break-word;
            pointer-events: none;
            border-bottom-color: #ddd;
            border-width: 10px;
            margin-left: -10px;
        }

        .message-parent:hover .chat-hover {
            display: block;
        }

        .message-parent:hover .message{
            filter:brightness(0.90);
        }

        .chat-hover {
            display: none;
            position: absolute;
            top: -32px;
            left: 86%;
        }

        .emoji {
            width: 1.7em;
            height: 1.5em;
            margin-bottom: -2px;
            vertical-align: bottom;
            object-fit: contain;
        }

        .my-message {
            background: #d1d1d1;
            border: 2px solid #eeeeee;
        }

        .my-message:after {
            border-bottom-color: #d1d1d1;
            left: 7%;
        }

        .other-message {
            background: #f1f1f1;
            border: 2px solid #dedede;
        }

        .other-message:after {
            border-bottom-color: #f1f1f1;
            left: 7%;
        }

        .align-left {
            text-align: left;
        }

        .align-right {
            text-align: right;
        }

        .float-left {
            float: left;
        }

        .float-right {
            float: right;
        }

        .clearfix:after {
            visibility: hidden;
            display: block;
            font-size: 0;
            content: " ";
            clear: both;
            height: 0;
        }

        img {
            border-radius: 25%;
        }
        `
    }

    // Open & Close Private Message Chat Modal

    showPrivateMessageModal() {
        this.openDialogPrivateMessage = true
    }

    hidePrivateMessageModal() {
        this.openDialogPrivateMessage = false
    }

    // Open & Close Block User Chat Modal

    showBlockUserModal() {
        this.openDialogBlockUser = true
    }

    hideBlockUserModal() {
        this.openDialogBlockUser = false
    }

    showBlockIconFunc(bool) {
        this.shadowRoot.querySelector(".chat-hover").focus({ preventScroll: true })
        if(bool) {
            this.showBlockAddressIcon = true;
        } else {
            this.showBlockAddressIcon = false;
        }
    }

    render() {
        console.log(this.showBlockAddressIcon)
        const hidemsg = this.hideMessages

        let avatarImg = ''
        let nameMenu = ''
        let levelFounder = ''
        let hideit = hidemsg.includes(this.messageObj.sender)

        levelFounder = html`<level-founder checkleveladdress="${this.messageObj.sender}"></level-founder>`

        if (this.messageObj.senderName) {
            const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
            const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
            const avatarUrl = `${nodeUrl}/arbitrary/THUMBNAIL/${this.messageObj.senderName}/qortal_avatar?async=true&apiKey=${myNode.apiKey}`
            avatarImg = html`<img src="${avatarUrl}" style="max-width:100%; max-height:100%;" onerror="this.onerror=null; this.src='/img/incognito.png';" />`
        }

        if (this.messageObj.sender === this.myAddress) {
            nameMenu = html`<span style="color: #03a9f4;">${this.messageObj.senderName ? this.messageObj.senderName : this.messageObj.sender}</span>`
        } else {
            nameMenu = html`<name-menu toblockaddress="${this.messageObj.sender}" nametodialog="${this.messageObj.senderName ? this.messageObj.senderName : this.messageObj.sender}"></name-menu>`
        }

        return hideit ? html`<li class="clearfix"></li>` : html`
			<li class="clearfix message-parent">
                <div class="message-data ${this.messageObj.sender === this.myAddress ? "" : ""}">
                    <span class="message-data-name">${nameMenu}</span>
                    <span class="message-data-level">${levelFounder}</span>
                    <span class="message-data-time"><message-time timestamp=${this.messageObj.timestamp}></message-time></span>
                </div>
                <div class="message-data-avatar" style="width:42px; height:42px; ${this.messageObj.sender === this.myAddress ? "float:left;" : "float:left;"} margin:3px;">${avatarImg}</div>
                <div class="message-container">
                    <div id="messageContent" class="message ${this.messageObj.sender === this.myAddress ? "my-message float-left" : "other-message float-left"}">${this.emojiPicker.parse(this.escapeHTML(this.messageObj.decodedMessage))}</div>
                    <chat-menu 
                    tabindex="0"
                    class="chat-hover"
                    style=${this.showBlockAddressIcon && "display: block"}
                    toblockaddress="${this.messageObj.sender}" 
                    .showPrivateMessageModal=${() => this.showPrivateMessageModal()}
                    .showBlockUserModal=${() => this.showBlockUserModal()}
                    .showBlockIconFunc=${(props) => this.showBlockIconFunc(props)}
                    .showBlockAddressIcon=${this.showBlockAddressIcon}
                    @blur=${() => this.showBlockIconFunc(false)}
                    > 
                    </chat-menu>
                </div>
            </li>
            <chat-modals 
            .openDialogPrivateMessage=${this.openDialogPrivateMessage} 
            .openDialogBlockUser=${this.openDialogBlockUser} 
            nametodialog="${this.messageObj.senderName ? this.messageObj.senderName : this.messageObj.sender}" 
            .hidePrivateMessageModal=${() => this.hidePrivateMessageModal()}
            .hideBlockUserModal=${() => this.hideBlockUserModal()}
            toblockaddress=${this.messageObj.sender}
            >
            </chat-modals>
		`;
    }
}

window.customElements.define('message-template', MessageTemplate);

class ChatMenu extends LitElement {
    static get properties() {
        return {
            menuItems: { type: Array },
            selectedAddress: { type: Object },
            showPrivateMessageModal: {type: Function},
            showBlockUserModal: {type: Function},
            toblockaddress: { type: String, attribute: true },
            showBlockIconFunc: {type: Function},
            showBlockAddressIcon: {type: Boolean}
        };
    }

    constructor() {
        super();
        this.selectedAddress = window.parent.reduxStore.getState().app.selectedAddress.address;
        this.showPrivateMessageModal = () => {};
        this.showBlockUserModal = () => {};
    }

    static get styles() {
        return css`
        .container {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 5px;
            background-color: white;
            border: 1px solid #dad9d9;
            border-radius: 5px;
            height:100%;
            width: 100px;
            position: relative;
        }

        .menu-icon {
            width: 100%;
            padding: 5px;
            display: flex;
            align-items: center;
            font-size: 13px;
        }

        .menu-icon:hover {
            background-color: #dad9d9;
            transition: all 0.1s ease-in-out;
            cursor: pointer;
        }

        .tooltip {
            position: relative; 
         }

         .tooltip:before {
            content: attr(data-text); 
            position: absolute;
            top: -47px;
            left: 50%;
            transform: translateX(-50%);
            width: 90px;
            padding: 10px;
            border-radius: 10px;
            background:#fff;
            color: #000;
            text-align: center;
            box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
            font-size: 12px;
            z-index: 5;
            display: none; 
            }

            .tooltip:hover:before {
            display: block;
            }

            .tooltip:after {
            content: "";
            position: absolute;
            margin-top: -7px;
            top: -7px;
            border: 10px solid #fff;
            border-color: white transparent transparent transparent;
            z-index: 5;
            display: none;
            }

            .tooltip:hover:before, .tooltip:hover:after {
            display: block;
            }

            .block-user-container {
                display: block;
                position: absolute;
                left: -48px;
            }

            .block-user {
                justify-content: space-between;
                border: 1px solid rgb(218, 217, 217);
                border-radius: 5px;
                background-color: white;
                width: 100%;
                height: 32px;
                padding: 3px 8px;
                box-shadow: rgba(77, 77, 82, 0.2) 0px 7px 29px 0px;
            }

        `
    }

    // Copy address to clipboard

    async copyToClipboard(text) {
        try {
            let copyString1 = get("walletpage.wchange4")
            await navigator.clipboard.writeText(text)
            parentEpml.request('showSnackBar', `${copyString1}`)
        } catch (err) {
            let copyString2 = get("walletpage.wchange39")
            parentEpml.request('showSnackBar', `${copyString2}`)
            console.error('Copy to clipboard error:', err)
        }
    }
    
    render() {

        return html` 
            <div class="container" style=${this.showBlockAddressIcon && "width: 70px" }>
                <div class="menu-icon tooltip" data-text="Private Message" 
                @click="${() => this.showPrivateMessageModal()}">   
                <vaadin-icon icon="vaadin:paperplane" slot="icon"></vaadin-icon>
                </div>
                <div class="menu-icon tooltip" data-text="Copy Address" @click="${() => this.copyToClipboard(this.toblockaddress)}">
                <vaadin-icon icon="vaadin:copy" slot="icon"></vaadin-icon>
                </div>
                <div class="menu-icon tooltip" data-text="More" @click="${() => this.showBlockIconFunc(true)}">
                <vaadin-icon icon="vaadin:ellipsis-dots-h" slot="icon"></vaadin-icon>
                </div>
                ${this.showBlockAddressIcon ? html`
                    <div class="block-user-container">
                        <div class="menu-icon block-user" @click="${() => this.showBlockUserModal()}">
                            <p>${translate("blockpage.bcchange1")}</p>
                            <vaadin-icon icon="vaadin:close-circle" slot="icon"></vaadin-icon>
                        </div>                    
                    </div> 
                ` : html`
                    <div></div>
                    `}
            </div>  
        `
    }
}

window.customElements.define('chat-menu', ChatMenu);

