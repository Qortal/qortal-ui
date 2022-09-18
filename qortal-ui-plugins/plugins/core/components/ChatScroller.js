import { LitElement, html, css } from 'lit';
import { render } from 'lit/html.js';
import { repeat } from 'lit/directives/repeat.js';
import { translate, get } from 'lit-translate';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import { chatStyles } from './ChatScroller-css.js'
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
            hideMessages: { type: Array },
            setRepliedToSignature: {type: Function},
            repliedToSignature: {type: String},
        }
    }

    static styles = [chatStyles]

    constructor() {
        super()
        this.messages = []
        this._upObserverhandler = this._upObserverhandler.bind(this)
        this._downObserverHandler = this._downObserverHandler.bind(this)
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
                    (message) => html`
                    <message-template 
                    .emojiPicker=${this.emojiPicker} 
                    .escapeHTML=${this.escapeHTML} 
                    .messageObj=${message} 
                    .hideMessages=${this.hideMessages}
                    .setRepliedToSignature=${this.setRepliedToSignature}
                    .repliedToSignature=${this.repliedToSignature}
                    >
                    </message-template>`
                )}
                <div id='downObserver'></div>
                <div class='last-message-ref'>
                    <vaadin-icon icon='vaadin:arrow-circle-down' slot='icon' @click=${() => {
                        this.shadowRoot.getElementById('downObserver').scrollIntoView({
                            behavior: 'smooth',
                        }) 
                    }}>
                    </vaadin-icon>
                </div>
            </ul>
        `
    }

    async firstUpdated() {
        this.viewElement = this.shadowRoot.getElementById('viewElement')
        this.upObserverElement = this.shadowRoot.getElementById('upObserver')
        this.downObserverElement = this.shadowRoot.getElementById('downObserver')


        // Intialize Observers
        this.upElementObserver()
        this.downElementObserver()
        await this.updateComplete
        this.viewElement.scrollTop = this.viewElement.scrollHeight + 50
    }

    _getOldMessage(_scrollElement) {
        this.getOldMessage(_scrollElement)
    }

    _upObserverhandler(entries) {
        if (entries[0].isIntersecting) {
            let _scrollElement = entries[0].target.nextElementSibling
            this._getOldMessage(_scrollElement)
        }
    }

    _downObserverHandler(entries) {
        if (!entries[0].isIntersecting) {
            this.shadowRoot.querySelector(".last-message-ref").style.opacity = '1'
        } else {
            this.shadowRoot.querySelector(".last-message-ref").style.opacity = '0'
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

    downElementObserver() {
    const options = {
        root: this.viewElement,
        rootMargin: '0px',
        threshold: 1
    }

    // identify an element to observe
    const elementToObserve = this.downObserverElement

    // passing it a callback function
    const observer = new IntersectionObserver(this._downObserverHandler, options)

    // call `observe()` on that MutationObserver instance,
    // passing it the element to observe, and the options object
    observer.observe(elementToObserve)

    }
}

window.customElements.define('chat-scroller', ChatScroller)


class MessageTemplate extends LitElement {
    static get properties() {
        return {
            messageObj: { type: Object },
            emojiPicker: { attribute: false },
            escapeHTML: { attribute: false },
            hideMessages: { type: Array },
            openDialogPrivateMessage: {type: Boolean},
            openDialogBlockUser: {type: Boolean},
            showBlockAddressIcon: { type: Boolean },
            setRepliedToSignature: {type: Function},
            repliedToSignature: {type: String},
        }
    }

    constructor() {
        super();
        this.messageObj = {}
        this.openDialogPrivateMessage = false
        this.openDialogBlockUser = false
        this.showBlockAddressIcon = false
        this.myAddress = window.parent.reduxStore.getState().app.selectedAddress.address
    }

    static styles = [chatStyles]

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
        console.log(this.messageObj, "here244")
        const hidemsg = this.hideMessages
        let message = ""
        let repliedToData = null
        try {
            const parsedMessageObj = JSON.parse(this.messageObj.decodedMessage)
            message = parsedMessageObj.messageText
            repliedToData = {
                    "timestamp": 1663419371885,
                    "txGroupId": 0,
                    "reference": "5LuncmE2RsGVdQizkZLnjgqU8QozR2hHhkiSujUgywEfqAvm6RW4xZ7c9XjuMnb76bNmX2ntRNhnBF4ErvawM1dW",
                    "senderPublicKey": "xmZXCYzGU2t3S6Ehm2zp4pVm83q9d143NKRgmiU1dXW",
                    "sender": "Qj9aLrdK2FLQY6YssRQUkDmXNJCko2zF7e",
                    "senderName": "GiseleH",
                    "data": "3JLP9vViLoRPJ1Pqt2uC6Ufqf7wgTrs4HuV4Ltgwdnf5ekcBCCf5MTm2Sg3sXHeuVnCpoJAyVdqgAbr7tcBoq3soNZTjteusXjjW3NSMNcJEAadaTYC68xGXGmvK1jRyioPqGaKiXKzR2jPPRV5SyiPd66788Z2Rqt3VQB98rvronX5w5tE9UUWRor6bmMeVL3dj7fHYhLPPE5VBpCS9Eskti7vnTgDUQxnjfr",
                    "isText": true,
                    "isEncrypted": false,
                    "signature": "3jWvhQKSDt4Zqeup5sLfyNksVVphFW5iF11PsTZzXQLCCPH9pDMqwNoKE2oe3DPYz47VbbLgJaAWMVA44z9dUr9U",
                    "decodedMessage": "for TrentB512 who computer crashed your registered name in qortal for your level 3 account was TrentB512 https://exqlorer.com/address/Qf58otnEXeoyvD7dvYmfEGpQ64oMD3uvwM"
                
            }
        } catch (error) {
            message = this.messageObj.decodedMessage
        }
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
            nameMenu = html`<span>${this.messageObj.senderName ? this.messageObj.senderName : this.messageObj.sender}</span>`
        }

        return hideit ? html`<li class="clearfix"></li>` : html`
            <li class="clearfix message-parent">
                <div class="message-data ${this.messageObj.sender === this.myAddress ? "" : ""}">
                    <span class="message-data-name">${nameMenu}</span>
                    <span class="message-data-level">${levelFounder}</span>
                    <span class="message-data-time"><message-time timestamp=${this.messageObj.timestamp}></message-time></span>
                </div>
                <div class="message-data-avatar">
                ${avatarImg}
                </div>
                <div class="message-container ${this.messageObj.sender === this.myAddress ? "my-message" : "other-message"}">
                ${repliedToData && html`
                    <div 
                        class="original-message" 
                        style=${this.messageObj.sender === this.myAddress && "background-color: rgb(179 179 179 / 79%)"}>
                        ${repliedToData.decodedMessage}
                    </div>
                    `}
                <div id="messageContent" class="message">
                    ${unsafeHTML(this.emojiPicker.parse(this.escapeHTML(message)))}
                </div>
                    <chat-menu 
                        tabindex="0"
                        class="chat-hover"
                        style=${this.showBlockAddressIcon && "display: block"}
                        toblockaddress="${this.messageObj.sender}" 
                        .showPrivateMessageModal=${() => this.showPrivateMessageModal()}
                        .showBlockUserModal=${() => this.showBlockUserModal()}
                        .showBlockIconFunc=${(props) => this.showBlockIconFunc(props)}
                        .showBlockAddressIcon=${this.showBlockAddressIcon}
                        .originalMessageSignature=${this.messageObj.signature}
                        .setRepliedToSignature=${this.setRepliedToSignature}
                        .repliedToSignature=${this.repliedToSignature}
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
        `
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
            showBlockAddressIcon: {type: Boolean},
            originalMessageSignature: {type: String},
            setRepliedToSignature: {type: Function},
            repliedToSignature: {type: String},
        }
    }

    constructor() {
        super();
        this.selectedAddress = window.parent.reduxStore.getState().app.selectedAddress.address;
        this.showPrivateMessageModal = () => {};
        this.showBlockUserModal = () => {};
    }

    static styles = [chatStyles]

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
            <div class="container">
                <div class="menu-icon tooltip" data-text="${translate("blockpage.bcchange9")}" @click="${() => this.showPrivateMessageModal()}">   
                    <vaadin-icon icon="vaadin:paperplane" slot="icon"></vaadin-icon>
                </div>
                <div class="menu-icon tooltip" data-text="${translate("blockpage.bcchange8")}" @click="${() => this.copyToClipboard(this.toblockaddress)}">
                    <vaadin-icon icon="vaadin:copy" slot="icon"></vaadin-icon>
                </div>
                <div class="menu-icon tooltip" data-text="${translate("blockpage.bcchange11")}" @click="${() => this.setRepliedToSignature(this.originalMessageSignature)}">
                    <vaadin-icon icon="vaadin:reply" slot="icon"></vaadin-icon>
                </div>
                <div class="menu-icon tooltip" data-text="${translate("blockpage.bcchange10")}" @click="${() => this.showBlockIconFunc(true)}">
                    <vaadin-icon icon="vaadin:ellipsis-dots-h" slot="icon"></vaadin-icon>
                </div>
                ${this.showBlockAddressIcon
                    ? html`
                        <div class="block-user-container">
                            <div class="menu-icon block-user" @click="${() => this.showBlockUserModal()}">
                                <p>${translate("blockpage.bcchange1")}</p>
                                <vaadin-icon icon="vaadin:close-circle" slot="icon"></vaadin-icon>
                            </div>                    
                        </div> 
                    ` : html`
                        <div></div>
                    `
                }
            </div>  
        `
    }
}

window.customElements.define('chat-menu', ChatMenu)
