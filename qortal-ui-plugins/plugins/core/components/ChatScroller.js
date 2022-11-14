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
import { EmojiPicker } from 'emoji-picker-js';
import { cropAddress } from "../../utils/cropAddress";

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })
class ChatScroller extends LitElement {
    static get properties() {
        return {
            getNewMessage: { attribute: false },
            getOldMessage: { attribute: false },
            emojiPicker: { attribute: false },
            escapeHTML: { attribute: false },
            messages: { type: Array },
            hideMessages: { type: Array },
            setRepliedToMessageObj: { type: Function },
            setEditedMessageObj: { type: Function },
            focusChatEditor: { type: Function },
            sendMessage: { type: Function}
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
        console.log({messages: this.messages})

        let formattedMessages = this.messages.reduce((messageArray, message) => {
            const lastGroupedMessage = messageArray[messageArray.length - 1];
            let timestamp;
            let sender;
            let repliedToData;
            if (lastGroupedMessage) {
                timestamp = lastGroupedMessage.timestamp;
                sender = lastGroupedMessage.sender;
                repliedToData = lastGroupedMessage.repliedToData;
            }
            const isSameGroup = Math.abs(timestamp - message.timestamp) < 600000 && sender === message.sender && !repliedToData;
       
            if (isSameGroup) {
                messageArray[messageArray.length - 1].messages = [...(messageArray[messageArray.length - 1]?.messages || []), message];
            } else {
                messageArray.push({
                    messages: [message],
                    ...message
                });
            }
            return messageArray;
        }, [])

        return html`
            <ul id="viewElement" class="chat-list clearfix">
                <div id="upObserver"></div>
                ${formattedMessages.map((formattedMessage) => {
                    return repeat(
                            formattedMessage.messages,
                            (message) => message.reference,
                            (message, indexMessage) => html`
                            <message-template 
                            .emojiPicker=${this.emojiPicker} 
                            .escapeHTML=${this.escapeHTML} 
                            .messageObj=${message} 
                            .hideMessages=${this.hideMessages}
                            .setRepliedToMessageObj=${this.setRepliedToMessageObj}
                            .setEditedMessageObj=${this.setEditedMessageObj}
                            .focusChatEditor=${this.focusChatEditor}
                            .sendMessage=${this.sendMessage}
                            ?isFirstMessage=${indexMessage === 0}
                            ?isSingleMessageInGroup=${formattedMessage.messages.length > 1}
                            ?isLastMessageInGroup=${indexMessage === formattedMessage.messages.length - 1}
                            >
                            </message-template>`
                    )
                })}
                <div id='downObserver'></div>
                <div class='last-message-ref'>
                    <vaadin-icon class='arrow-down-icon' icon='vaadin:arrow-circle-down' slot='icon' @click=${() => {
                        this.shadowRoot.getElementById('downObserver').scrollIntoView({
                            behavior: 'smooth',
                        }) 
                    }}>
                    </vaadin-icon>
                </div>
            </ul>
        `
    }

    shouldUpdate(changedProperties) {
        // Only update element if prop1 changed.
        return changedProperties.has('messages');
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
            setRepliedToMessageObj: { type: Function },
            setEditedMessageObj: { type: Function },
            focusChatEditor: { type: Function },
            sendMessage: { type: Function },
            openDialogImage: { type: Function },
            isImageLoaded: { type: Boolean },
            isFirstMessage: { type: Boolean },
            isSingleMessageInGroup: { type: Boolean },
            isLastMessageInGroup: { type: Boolean },
        }
    }

    constructor() {
        super();
        this.messageObj = {}
        this.openDialogPrivateMessage = false
        this.openDialogBlockUser = false
        this.showBlockAddressIcon = false
        this.myAddress = window.parent.reduxStore.getState().app.selectedAddress.address
        this.imageFetches = 0
        this.openDialogImage = false
        this.isImageLoaded = false
        this.isFirstMessage = false
        this.isSingleMessageInGroup = false
        this.isLastMessageInGroup = false
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
        console.log(this.messageObj);
        const hidemsg = this.hideMessages;
        let message = "";
        let reactions = [];
        let repliedToData = null;
        let image = null;
        let isImageDeleted = false;
        try {
            const parsedMessageObj = JSON.parse(this.messageObj.decodedMessage);
            message = parsedMessageObj.messageText;
            repliedToData = this.messageObj.repliedToData;
            isImageDeleted = parsedMessageObj.isImageDeleted;
            reactions = parsedMessageObj.reactions || [];
           if (parsedMessageObj.images && Array.isArray(parsedMessageObj.images) && parsedMessageObj.images.length > 0) {
                image = parsedMessageObj.images[0];
            }
        } catch (error) {
            message = this.messageObj.decodedMessage;
        }
        let avatarImg = '';
        let imageHTML = '';
        let imageHTMLDialog = '';
        let imageUrl = '';
        let nameMenu = '';
        let levelFounder = '';
        let hideit = hidemsg.includes(this.messageObj.sender);

        levelFounder = html`<level-founder checkleveladdress="${this.messageObj.sender}"></level-founder>`;
        console.log({message})
        if (this.messageObj.senderName) {
            const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
            const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
            const avatarUrl = `${nodeUrl}/arbitrary/THUMBNAIL/${this.messageObj.senderName}/qortal_avatar?async=true&apiKey=${myNode.apiKey}`;
            avatarImg = html`<img src="${avatarUrl}" style="max-width:100%; max-height:100%;" onerror="this.onerror=null; this.src='/img/incognito.png';" />`;
        } else {
            avatarImg = html`<img src='/img/incognito.png'  style="max-width:100%; max-height:100%;" onerror="this.onerror=null;" />`
        }
  
     const createImage = (imageUrl) => {
        const imageHTMLRes = new Image();
        imageHTMLRes.src = imageUrl;
        imageHTMLRes.style= "max-width:45vh; max-height:40vh; border-radius: 5px; cursor: pointer";
        imageHTMLRes.onclick= () => {
            this.openDialogImage = true;
        }
        imageHTMLRes.onload = () => {
            this.isImageLoaded = true;
        }
        imageHTMLRes.onerror = () => {   
            if (this.imageFetches < 4) {
                setTimeout(() => {
                    this.imageFetches = this.imageFetches + 1;
                    imageHTMLRes.src = imageUrl;
                }, 500);
            } else {
                imageHTMLRes.src = '/img/chain.png';
                imageHTMLRes.style= "max-width:45vh; max-height:20vh; border-radius: 5px; filter: opacity(0.5)";
                imageHTMLRes.onclick= () => {
                    
                }

                this.isImageLoaded = true
            }
        };
        return imageHTMLRes;
      }
        if (image) {
            const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
            const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
            imageUrl = `${nodeUrl}/arbitrary/${image.service}/${image.name}/${image.identifier}?async=true&apiKey=${myNode.apiKey}`;
            imageHTML = createImage(imageUrl);
            imageHTMLDialog = createImage(imageUrl);
            imageHTMLDialog.style= "height: auto; max-height: 80vh; width: auto; max-width: 80vw; object-fit: contain; border-radius: 5px";
        }

        nameMenu = html`
            <span class="${this.messageObj.sender === this.myAddress && 'message-data-my-name'}">
                ${this.messageObj.senderName ? this.messageObj.senderName : cropAddress(this.messageObj.sender)}
            </span>
        `;

        if (repliedToData) {
            try {
                const parsedMsg =  JSON.parse(repliedToData.decodedMessage);
                repliedToData.decodedMessage = parsedMsg;
            } catch (error) {
                console.error(error);
            }
        }
        const escapedMessage = this.escapeHTML(message)
        const replacedMessage = escapedMessage.replace(new RegExp('\r?\n','g'), '<br />');

        return hideit ? html`<li class="clearfix"></li>` : html`
            <li 
            class="clearfix message-parent" 
            style="${(this.isSingleMessageInGroup === true && this.isLastMessageInGroup === false && reactions.length === 0) ? 
            'padding-bottom: 0;' 
            : null} 
            ${this.isFirstMessage && 'margin-top: 20px;'}">
                <div>
                    <div 
                    class="message-container" 
                    style="${(this.isSingleMessageInGroup === true && this.isLastMessageInGroup === false) && 'margin-bottom: 0'}">
                        <div class="message-subcontainer1">
                            ${(this.isSingleMessageInGroup === false || 
                            (this.isSingleMessageInGroup === true && this.isLastMessageInGroup === true)) 
                            ? (
                                html`
                                    <div class="message-data-avatar">
                                        ${avatarImg}
                                    </div>
                                `
                            ) : 
                            html`
                                <div class="message-data-avatar"></div>
                            `}
                            <div 
                            class="${`message-subcontainer2 
                            ${((this.isFirstMessage === true && this.isSingleMessageInGroup === false) || 
                            (this.isSingleMessageInGroup === true && this.isLastMessageInGroup === true)) && 
                            'message-triangle'}`}" 
                            style="${(this.isSingleMessageInGroup === true && this.isLastMessageInGroup === false) ? 'margin-bottom: 0;' : null}
                            ${(this.isFirstMessage === false && this.isSingleMessageInGroup === true && this.isLastMessageInGroup === false)
                            ? 'border-radius: 8px 25px 25px 8px;'
                            : (this.isFirstMessage === true && this.isSingleMessageInGroup === true && this.isLastMessageInGroup === false) 
                            ?  'border-radius: 27px 25px 25px 12px;'
                            : (this.isFirstMessage === false && this.isSingleMessageInGroup === true && this.isLastMessageInGroup === true) ?  
                            'border-radius: 10px 25px 25px 0;' 
                            : (this.isFirstMessage === true && this.isSingleMessageInGroup === false && this.isLastMessageInGroup === true) 
                            ? 'border-radius: 25px 25px 25px 0px;'
                            : null
                            }">
                            <div class="message-user-info">
                                ${this.isFirstMessage ? 
                                    html`
                                        <span class="message-data-name">
                                            ${nameMenu}
                                        </span>
                                        `
                                    : null
                                }
                                ${this.isFirstMessage ? (
                                html`
                                    <span class="message-data-level">${levelFounder}</span>
                                `
                                ) : null}
                            </div>
                                ${repliedToData && html`
                                    <div class="original-message">
                                        <p class="original-message-sender">
                                            ${repliedToData.sendName ?? cropAddress(repliedToData.sender)}
                                        </p>
                                        <p class="replied-message">
                                            ${repliedToData.decodedMessage.messageText}
                                        </p>
                                    </div>
                                    `}
                                    ${image && !isImageDeleted ? html`
                                        <div class=${[`image-container`, !this.isImageLoaded ? 'defaultSize' : ''].join(' ')}>
                                            ${imageHTML}<vaadin-icon
                                            @click=${() => this.sendMessage({
                                            type: 'delete',
                                            name: image.name,
                                            identifier: image.identifier,
                                            editedMessageObj: this.messageObj,
                                        })}
                                            class="image-delete-icon"  icon="vaadin:close" slot="icon"></vaadin-icon>
                                        </div>
                                    ` : html``}
                                    <div id="messageContent" class="message">
                                        ${unsafeHTML(this.emojiPicker.parse(replacedMessage))}
                                        <div class="${((this.isFirstMessage === false && 
                                            this.isSingleMessageInGroup === true && 
                                            this.isLastMessageInGroup === true) || 
                                            (this.isFirstMessage === true && 
                                            this.isSingleMessageInGroup === false &&
                                            this.isLastMessageInGroup === true)) 
                                            ? 'message-data-time'
                                            : 'message-data-time-hidden'
                                        }">
                                            <message-time timestamp=${this.messageObj.timestamp}></message-time>
                                        </div>
                                    </div>
                            </div>
                                <chat-menu 
                                tabindex="0"
                                class="chat-hover"
                                style="${this.showBlockAddressIcon && 'display: block;'}"
                                toblockaddress="${this.messageObj.sender}" 
                                .showPrivateMessageModal=${() => this.showPrivateMessageModal()}
                                .showBlockUserModal=${() => this.showBlockUserModal()}
                                .showBlockIconFunc=${(props) => this.showBlockIconFunc(props)}
                                .showBlockAddressIcon=${this.showBlockAddressIcon}
                                .originalMessage=${{...this.messageObj, message}}
                                .setRepliedToMessageObj=${this.setRepliedToMessageObj}
                                .setEditedMessageObj=${this.setEditedMessageObj}
                                .focusChatEditor=${this.focusChatEditor}
                                .myAddress=${this.myAddress}
                                @blur=${() => this.showBlockIconFunc(false)}
                                .sendMessage=${this.sendMessage}
                            > 
                            </chat-menu>
                        </div>
                        <div class="message-reactions" style="${reactions.length > 0 && 
                            'margin-top: 10px; margin-bottom: 5px;'}">
                                ${reactions.map((reaction)=> {
                                    return html`
                                    <span 
                                    @click=${() => this.sendMessage({
                                        type: 'reaction',
                                        editedMessageObj: this.messageObj,
                                        reaction:  reaction.type,
                                        })} 
                                    class="reactions-bg">
                                    ${reaction.type} ${reaction.qty}
                                    </span>`
                                })}
                        </div>
                    </div>
                </div>
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
            <mwc-dialog 
                id="showDialogPublicKey" 
                ?open=${this.openDialogImage} 
                @closed=${()=> {
                    this.openDialogImage = false
                }}>
					<div class="dialog-header"></div>
					<div class="dialog-container imageContainer">
					    ${imageHTMLDialog}
					</div>
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
						@click=${()=>{
							
						this.openDialogImage = false
						}}
					>
					    ${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
        `
    }
}

window.customElements.define('message-template', MessageTemplate);

class ChatMenu extends LitElement {
    static get properties() {
        return {
            menuItems: { type: Array },
            showPrivateMessageModal: { type: Function },
            showBlockUserModal: { type: Function },
            toblockaddress: { type: String, attribute: true },
            showBlockIconFunc: { type: Function },
            showBlockAddressIcon: { type: Boolean },
            originalMessage: { type: Object },
            setRepliedToMessageObj: { type: Function },
            setEditedMessageObj: { type: Function },
            focusChatEditor: { type: Function },
            myAddress: { type: Object },
            emojiPicker: { attribute: false },
            sendMessage: {type: Function}
        }
    }

    constructor() {
        super();
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

    firstUpdated () {
        this.emojiPicker = new EmojiPicker({
            style: "twemoji",
            twemojiBaseUrl: '/emoji/',
            showPreview: false,
            showVariants: false,
            showAnimation: false,
            position: 'top-start',
            boxShadow: 'rgba(4, 4, 5, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.24) 0px 8px 16px 0px'
        });

      this.emojiPicker.on('emoji', selection => {
        this.sendMessage({
            type: 'reaction',
            editedMessageObj: this.originalMessage,
            reaction:  selection.emoji,
         
           
         })
        });
    }
    
    render() {
        return html` 
            <div class="container">
            <div 
                class="menu-icon tooltip reaction" 
                data-text="${translate("blockpage.bcchange13")}" 
                @click=${(e) => {
                    this.emojiPicker.togglePicker(e.target)
                    }}
               >
                    <vaadin-icon icon="vaadin:smiley-o" slot="icon"></vaadin-icon>
                </div>
                <div class="menu-icon tooltip" data-text="${translate("blockpage.bcchange9")}" @click="${() => this.showPrivateMessageModal()}">   
                    <vaadin-icon icon="vaadin:paperplane" slot="icon"></vaadin-icon>
                </div>
                <div class="menu-icon tooltip" data-text="${translate("blockpage.bcchange8")}" @click="${() => this.copyToClipboard(this.toblockaddress)}">
                    <vaadin-icon icon="vaadin:copy" slot="icon"></vaadin-icon>
                </div>
                <div 
                class="menu-icon tooltip" 
                data-text="${translate("blockpage.bcchange11")}" 
                @click="${() => {
                    this.setRepliedToMessageObj(this.originalMessage);
                    this.focusChatEditor();
                    }}">
                    <vaadin-icon icon="vaadin:reply" slot="icon"></vaadin-icon>
                </div>
                
                ${this.myAddress === this.originalMessage.sender ? (
                    html`
                    <div 
                    class="menu-icon tooltip" 
                    data-text="${translate("blockpage.bcchange12")}" 
                    @click=${() => {
                    this.setEditedMessageObj(this.originalMessage);
                    this.focusChatEditor();
                    }}>
                        <vaadin-icon icon="vaadin:pencil" slot="icon"></vaadin-icon>
                    </div>
                    `
                ) : html`<div></div>`}
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
