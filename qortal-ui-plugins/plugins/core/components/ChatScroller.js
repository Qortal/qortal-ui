import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { repeat } from 'lit/directives/repeat.js'
import { translate, get } from 'lit-translate'
import { Epml } from "../../../epml"
import { chatStyles } from './ChatScroller-css.js'
import './LevelFounder.js'
import './NameMenu.js'
import './ChatModals.js'
import '@vaadin/icons'
import '@vaadin/icon'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-icon'

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
                    (message) => html`<message-template .emojiPicker=${this.emojiPicker} .escapeHTML=${this.escapeHTML} .messageObj=${message} .hideMessages=${this.hideMessages}></message-template>`
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
            console.log({ _scrollElement })
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
            hideMessages: { type: Array },
            openDialogPrivateMessage: {type: Boolean},
            openDialogBlockUser: {type: Boolean},
            showBlockAddressIcon: { type: Boolean }
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
            nameMenu = html`<span>${this.messageObj.senderName ? this.messageObj.senderName : this.messageObj.sender}</span>`
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
            showBlockAddressIcon: {type: Boolean}
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
            <div class="container" style=${this.showBlockAddressIcon && "width: 70px" }>
                <div class="menu-icon tooltip" data-text="${translate("blockpage.bcchange9")}" @click="${() => this.showPrivateMessageModal()}">   
                    <vaadin-icon icon="vaadin:paperplane" slot="icon"></vaadin-icon>
                </div>
                <div class="menu-icon tooltip" data-text="${translate("blockpage.bcchange8")}" @click="${() => this.copyToClipboard(this.toblockaddress)}">
                    <vaadin-icon icon="vaadin:copy" slot="icon"></vaadin-icon>
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
