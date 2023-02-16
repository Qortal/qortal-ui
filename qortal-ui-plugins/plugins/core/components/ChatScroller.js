import { LitElement, html, css } from 'lit';
import { render } from 'lit/html.js';
import { repeat } from 'lit/directives/repeat.js';
import { translate, get } from 'lit-translate';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import { chatStyles } from './ChatScroller-css.js'
import { Epml } from "../../../epml";
import { cropAddress } from "../../utils/cropAddress";
import './LevelFounder.js';
import './NameMenu.js';
import './ChatModals.js';
import './WrapperModal';
import "./UserInfo/UserInfo";
import '@vaadin/icons';
import '@vaadin/icon';
import '@vaadin/tooltip';
import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-icon';
import { EmojiPicker } from 'emoji-picker-js';
import { generateHTML } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })
let toggledMessage = {}
class ChatScroller extends LitElement {
    static get properties() {
        return {
            getNewMessage: { attribute: false },
            getOldMessage: { attribute: false },
            escapeHTML: { attribute: false },
            messages: { type: Array },
            hideMessages: { type: Array },
            setRepliedToMessageObj: { attribute: false },
            setEditedMessageObj: { attribute: false },
            sendMessage: { attribute: false },
            sendMessageForward: { attribute: false },
            showLastMessageRefScroller: { attribute: false },
            emojiPicker: { attribute: false },
            isLoadingMessages: { type: Boolean},
            setIsLoadingMessages: { attribute: false },
            chatId: { type: String },
            setForwardProperties: { attribute: false },
            setOpenPrivateMessage: { attribute: false },
            setOpenUserInfo: { attribute: false },
            setOpenTipUser: { attribute: false },
            setUserName: { attribute: false },
            setSelectedHead: { attribute: false },
            openTipUser: { type: Boolean },
            openUserInfo: { type: Boolean },
            userName: { type: String },
            selectedHead: { type: Object },
            goToRepliedMessage: { attribute: false },
            getOldMessageAfter: {attribute: false},
            listSeenMessages: {type: Array}
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
        this.openTipUser = false;
        this.openUserInfo = false;
        this.listSeenMessages= []
    }

    addSeenMessage(val){
        this.listSeenMessages.push(val)
    }

    render() {
        let formattedMessages = this.messages.reduce((messageArray, message, index) => {
            const lastGroupedMessage = messageArray[messageArray.length - 1];
            let timestamp;
            let sender;
            let repliedToData;
            
            let firstMessageInChat;

            if (index === 0) {
                firstMessageInChat = true;
            } else {
                firstMessageInChat = false;
            }

            message = {...message, firstMessageInChat}

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
              ${this.isLoadingMessages ?  html`
                <div class="spinnerContainer">
                        <paper-spinner-lite active></paper-spinner-lite>
                        </div>
                        ` : ''}
            <ul id="viewElement" class="chat-list clearfix">
                <div id="upObserver"></div>
                ${formattedMessages.map((formattedMessage) => {
                    return repeat(
                            formattedMessage.messages,
                            (message) => message.signature,
                            (message, indexMessage) => html`
                            <message-template 
                            .emojiPicker=${this.emojiPicker} 
                            .escapeHTML=${this.escapeHTML} 
                            .messageObj=${message} 
                            .hideMessages=${this.hideMessages}
                            .setRepliedToMessageObj=${this.setRepliedToMessageObj}
                            .setEditedMessageObj=${this.setEditedMessageObj}
                            .sendMessage=${this.sendMessage}
                            .sendMessageForward=${this.sendMessageForward}
                            ?isFirstMessage=${indexMessage === 0}
                            ?isSingleMessageInGroup=${formattedMessage.messages.length > 1}
                            ?isLastMessageInGroup=${indexMessage === formattedMessage.messages.length - 1}
                            .setToggledMessage=${this.setToggledMessage}
                            .setForwardProperties=${this.setForwardProperties}
                            .setOpenPrivateMessage=${(val) => this.setOpenPrivateMessage(val)}
                            .setOpenTipUser=${(val) => this.setOpenTipUser(val)}
                            .setOpenUserInfo=${(val) => this.setOpenUserInfo(val)}
                            .setUserName=${(val) => this.setUserName(val)}
                            id=${message.signature}
                            .goToRepliedMessage=${this.goToRepliedMessage}
                            .addSeenMessage=${(val)=> this.addSeenMessage(val)}
                            .listSeenMessages=${this.listSeenMessages}
                            chatId=${this.chatId}
                            >
                            </message-template>`
                    )
                })}
                <div style=${"height: 1px;"} id='downObserver'></div>
            </ul>
        `
    }

    shouldUpdate(changedProperties) {
        if(changedProperties.has('isLoadingMessages')){
            return true
        }
        if(changedProperties.has('chatId') && changedProperties.get('chatId')){
            return true
        }
        if(changedProperties.has('openTipUser')){
            return true
        }
        if(changedProperties.has('openUserInfo')){
            return true
        }
        if(changedProperties.has('userName')){
            return true
        }
        // Only update element if prop1 changed.
        return changedProperties.has('messages');
      }

      async getUpdateComplete() {
        await super.getUpdateComplete();
        const marginElements = Array.from(this.shadowRoot.querySelectorAll('message-template'));
        await Promise.all(marginElements.map(el => el.updateComplete));
        return true;
    }

    setToggledMessage(message) {
        toggledMessage = message;
    }

    async firstUpdated() {
        this.emojiPicker.on('emoji', selection => {

            this.sendMessage({
                type: 'reaction',
                editedMessageObj: toggledMessage,
                reaction:  selection.emoji,
                })
            });
        this.viewElement = this.shadowRoot.getElementById('viewElement');
        this.upObserverElement = this.shadowRoot.getElementById('upObserver');
        this.downObserverElement = this.shadowRoot.getElementById('downObserver');
        // Intialize Observers
        this.upElementObserver();
        this.downElementObserver();
        await this.getUpdateComplete();
        this.viewElement.scrollTop = this.viewElement.scrollHeight + 50;
    }

    _getOldMessage(_scrollElement) {
        this.getOldMessage(_scrollElement)
    }

    _getOldMessageAfter(_scrollElement) {
        this.getOldMessageAfter(_scrollElement)
    }

    _upObserverhandler(entries) {
        if (entries[0].isIntersecting) {
            if(this.messages.length < 20){
                return
            }
            this.setIsLoadingMessages(true);
            let _scrollElement = entries[0].target.nextElementSibling;
            this._getOldMessage(_scrollElement);
        }
    }

    _downObserverHandler(entries) {
        if (!entries[0].isIntersecting) {
            let _scrollElement = entries[0].target.previousElementSibling;
            // this._getOldMessageAfter(_scrollElement);
            this.showLastMessageRefScroller(true);
        } else {
            this.showLastMessageRefScroller(false);
        }
    }

    upElementObserver() {
        const options = {
            root: this.viewElement,
            rootMargin: '0px',
            threshold: 1
        };
        const observer = new IntersectionObserver(this._upObserverhandler, options);
        observer.observe(this.upObserverElement);
    }

    downElementObserver() {
    const options = {
        root: this.viewElement,
        rootMargin: '0px',
        threshold: 1
    }
    // identify an element to observe
    const elementToObserve = this.downObserverElement;
    // passing it a callback function
    const observer = new IntersectionObserver(this._downObserverHandler, options);
    // call `observe()` on that MutationObserver instance,
    // passing it the element to observe, and the options object
    observer.observe(elementToObserve);
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
            openDialogPrivateMessage: { type: Boolean },
            openDialogBlockUser: { type: Boolean },
            showBlockAddressIcon: { type: Boolean },
            setRepliedToMessageObj: { attribute: false },
            setEditedMessageObj: { attribute: false },
            sendMessage: { attribute: false },
            sendMessageForward: { attribute: false },
            openDialogImage: { attribute: false },
            openDeleteImage: { type: Boolean },
            isImageLoaded: { type: Boolean },
            isFirstMessage: { type: Boolean },
            isSingleMessageInGroup: { type: Boolean },
            isLastMessageInGroup: { type: Boolean },
            setToggledMessage: { attribute: false },
            setForwardProperties: { attribute: false },
            viewImage: { type: Boolean },
            setOpenPrivateMessage : { attribute: false },
            setOpenTipUser: { attribute: false },
            setOpenUserInfo: { attribute: false },
            setUserName: { attribute: false },
            openTipUser:{ type: Boolean },
            goToRepliedMessage: { attribute: false },
            listSeenMessages: { type: Array },
            addSeenMessage: { attribute: false },
            chatId: { type: String },
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
        this.viewImage =  false
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
        if (bool) {
            this.showBlockAddressIcon = true;
        } else {
            this.showBlockAddressIcon = false;
        }
    }

    firstUpdated(){
        const autoSeeChatList = window.parent.reduxStore.getState().app?.autoLoadImageChats
        if(autoSeeChatList.includes(this.chatId) || this.listSeenMessages.includes(this.messageObj.signature)){
            this.viewImage =  true
        }

        const tooltips = this.shadowRoot.querySelectorAll('vaadin-tooltip');
        tooltips.forEach(tooltip => {
        const overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
        overlay.shadowRoot.getElementById("overlay").style.cssText = "background-color: transparent; box-shadow: rgb(50 50 93 / 25%) 0px 2px 5px -1px, rgb(0 0 0 / 30%) 0px 1px 3px -1px";
        overlay.shadowRoot.getElementById('content').style.cssText = "background-color: var(--reactions-tooltip-bg); color: var(--chat-bubble-msg-color); text-align: center; padding: 20px 10px; border-radius: 8px; font-family: Roboto, sans-serif; letter-spacing: 0.3px; font-weight: 300; font-size: 13.5px; transition: all 0.3s ease-in-out;";
        });
    }

    render() {
        const hidemsg = this.hideMessages;
        let message = "";
        let messageVersion2 = ""
        let reactions = [];
        let repliedToData = null;
        let image = null;
        let isImageDeleted = false;
        let version = 0;
        let isForwarded = false
        let isEdited = false
        try {
            const parsedMessageObj = JSON.parse(this.messageObj.decodedMessage);
            console.log({parsedMessageObj}, +parsedMessageObj.version, +parsedMessageObj.version > 1)
            if(+parsedMessageObj.version > 1){

                messageVersion2 = generateHTML(parsedMessageObj.messageText, [
                    StarterKit,
                    Underline,
                    Highlight
                    // other extensions …
                  ])
            }
            message = parsedMessageObj.messageText;
            repliedToData = this.messageObj.repliedToData;
            isImageDeleted = parsedMessageObj.isImageDeleted;
            reactions = parsedMessageObj.reactions || [];
            version = parsedMessageObj.version;
            isForwarded = parsedMessageObj.type === 'forward';
            isEdited = parsedMessageObj.isEdited && true;
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
        let forwarded = ''
        let edited = ''

        levelFounder = html`<level-founder checkleveladdress="${this.messageObj.sender}"></level-founder>`;
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
                }, 2000);
            } else {
                setTimeout(() => {
                    this.imageFetches = this.imageFetches + 1;
                    imageHTMLRes.src = imageUrl;
                }, 6000);
            }
        };
        return imageHTMLRes;
      }
        if (image) {
            const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
            const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
            imageUrl = `${nodeUrl}/arbitrary/${image.service}/${image.name}/${image.identifier}?async=true&apiKey=${myNode.apiKey}`;
            
            if(this.viewImage || this.myAddress === this.messageObj.sender){
                imageHTML = createImage(imageUrl);
                imageHTMLDialog = createImage(imageUrl) 
                imageHTMLDialog.style= "height: auto; max-height: 80vh; width: auto; max-width: 80vw; object-fit: contain; border-radius: 5px";
            }
           
        }

        nameMenu = html`
            <span class="${this.messageObj.sender === this.myAddress && 'message-data-my-name'}">
                ${this.messageObj.senderName ? this.messageObj.senderName : cropAddress(this.messageObj.sender)}
            </span>
        `;
        forwarded = html`
        <span class="${this.messageObj.sender === this.myAddress && 'message-data-forward'}">
            ${translate("blockpage.bcchange17")}
        </span>
        `;

        edited = html`
        <span class="edited-message-style">
            ${translate("chatpage.cchange68")}
        </span>
        `;

        if (repliedToData) {
            try {
                const parsedMsg =  JSON.parse(repliedToData.decodedMessage);
                repliedToData.decodedMessage = parsedMsg;
            } catch (error) {
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
                                    <div 
                                    style=${this.myAddress === this.messageObj.sender ? "cursor: auto;" : "cursor: pointer;"}
                                    @click=${() => {
                                        if (this.myAddress === this.messageObj.sender) return;
                                        this.setOpenUserInfo(true);
                                        this.setUserName(this.messageObj);
                                    }} class="message-data-avatar">
                                        ${avatarImg}
                                    </div>
                                `
                            ) : 
                            html`
                                <div class="message-data-avatar"></div>
                            `}
                            <div 
                            class="${`message-subcontainer2 
                            ${this.myAddress === this.messageObj.sender && "message-myBg" }
                            ${(((this.isFirstMessage === true && this.isSingleMessageInGroup === false) || 
                            (this.isSingleMessageInGroup === true && this.isLastMessageInGroup === true)) && this.myAddress !== this.messageObj.sender)  
                            ? 'message-triangle' 
                            : (((this.isFirstMessage === true && this.isSingleMessageInGroup === false) || 
                            (this.isSingleMessageInGroup === true && this.isLastMessageInGroup === true)) && this.myAddress === this.messageObj.sender) ? "message-myTriangle" : null}`}" 
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
                                        <span 
                                        style=${this.myAddress === this.messageObj.sender ? "cursor: auto;" : "cursor: pointer;"}
                                        @click=${() => {
                                            if (this.myAddress === this.messageObj.sender) return;
                                            this.setOpenUserInfo(true);
                                            this.setUserName(this.messageObj);
                                        }}
                                        class="message-data-name">
                                            ${nameMenu}
                                        </span>
                                        `
                                    : null
                                }
                                ${isForwarded ? 
                                    html`
                                        <span class="forwarded-text">
                                            ${forwarded}
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
                                    <div class="original-message" 
                                    @click=${()=> {
                                        this.goToRepliedMessage(repliedToData, this.messageObj)
                                    }}>
                                        <p  
                                            style=${"cursor: pointer; margin: 0 0 5px 0;"} 
                                            class=${this.myAddress !== repliedToData.sender
                                            ? "original-message-sender" 
                                            : "message-data-my-name"}>
                                             ${repliedToData.senderName ?? cropAddress(repliedToData.sender)}
                                        </p>
                                        <p class="replied-message">
                                            ${version.toString() === '1' ? html`
                                            ${repliedToData.decodedMessage.messageText}
                                            ` : ''}
                                            ${+version > 1 ? html`
                                            ${unsafeHTML(generateHTML(repliedToData.decodedMessage.messageText, [
                                                StarterKit,
                                                Underline,
                                                Highlight
                                                // other extensions …
                                            ]))}
                                            ` 
                                        : ''}
                                        </p>
                                    </div>
                                    `}
                                    ${image  && !isImageDeleted && !this.viewImage && this.myAddress !== this.messageObj.sender ? html`
                                        <div 
                                        @click=${()=> {
                                            this.viewImage = true
                                            this.addSeenMessage(this.messageObj.signature)
                                        }}
                                        class=${[`image-container`, !this.isImageLoaded ? 'defaultSize' : ''].join(' ')}
                                        style=${this.isFirstMessage && "margin-top: 10px;"}>
                                        <div style="display:flex;width:100%;height:100%;justify-content:center;align-items:center;cursor:pointer;color:var(--black)">
                                        ${translate("chatpage.cchange40")}
                                        </div>
                                           
                                        </div>
                                    ` : html``}
                                    ${!this.isImageLoaded && image && this.viewImage ? html`
                                        <div style="display:flex;width:100%;height:100%;justify-content:center;align-items:center;position:absolute">
                                        <div class=${`smallLoading`}></div>
                                        </div>
                                        
                                    `: ''}
                                    ${image && !isImageDeleted && (this.viewImage || this.myAddress === this.messageObj.sender) ? html`
                                        <div 
                                        class=${[`image-container`, !this.isImageLoaded ? 'defaultSize' : '', !this.isImageLoaded ? 'hideImg': ''].join(' ')}
                                        style=${this.isFirstMessage && "margin-top: 10px;"}>
                                            ${imageHTML}
                                            ${this.myAddress === this.messageObj.sender ? html`
                                            <vaadin-icon
                                            @click=${() => {
                                                this.openDeleteImage = true;
                                                }}
                                            class="image-delete-icon"  icon="vaadin:close" slot="icon"></vaadin-icon>
                                            ` : ''}
                                           
                                        </div>
                                    ` : image && isImageDeleted ? html`
                                        <p class="image-deleted-msg">This image has been deleted</p>
                                    ` : html``}
                                    <div 
                                    id="messageContent" 
                                    class="message" 
                                    style=${(image && replacedMessage !== "") &&"margin-top: 15px;"}>
                                        ${+version > 1 ? html`
                                        ${unsafeHTML(messageVersion2)}
                                        ` : ''}
                                        ${version.toString() === '1' ? html`
                                        ${unsafeHTML(this.emojiPicker.parse(replacedMessage))}
                                        ` : ''}
                                        ${version.toString() === '0' ? html`
                                        ${unsafeHTML(this.emojiPicker.parse(replacedMessage))}
                                        ` : ''}
                                        <div 
                                            style=${isEdited 
                                            ? "justify-content: space-between;" 
                                            : "justify-content: flex-end;"}
                                            class="${((this.isFirstMessage === false && 
                                            this.isSingleMessageInGroup === true && 
                                            this.isLastMessageInGroup === true) || 
                                            (this.isFirstMessage === true && 
                                            this.isSingleMessageInGroup === false &&
                                            this.isLastMessageInGroup === true)) 
                                            ? 'message-data-time'
                                            : 'message-data-time-hidden'
                                        }">
                                            ${isEdited ? 
                                                html`
                                                    <span>
                                                        ${edited}
                                                    </span>
                                                    `
                                                : ''
                                            }
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
                                .myAddress=${this.myAddress}
                                @blur=${() => this.showBlockIconFunc(false)}
                                .sendMessage=${this.sendMessage}
                                .sendMessageForward=${this.sendMessageForward}
                                version=${version}
                                .emojiPicker=${this.emojiPicker} 
                                .setToggledMessage=${this.setToggledMessage}
                                .setForwardProperties=${this.setForwardProperties}
                                ?firstMessageInChat=${this.messageObj.firstMessageInChat}
                                .setOpenPrivateMessage=${(val) => this.setOpenPrivateMessage(val)}
                                .setOpenTipUser=${(val) => this.setOpenTipUser(val)}
                                .setUserName=${(val) => this.setUserName(val)}
                            > 
                            </chat-menu>
                        </div>
                        <div class="message-reactions" style="${reactions.length > 0 && 
                            'margin-top: 10px; margin-bottom: 5px;'}">
                                ${reactions.map((reaction, index)=> {
                                    return html`
                                    <span 
                                        @click=${() => this.sendMessage({
                                        type: 'reaction',
                                        editedMessageObj: this.messageObj,
                                        reaction:  reaction.type,
                                        })} 
                                        id=${`reactions-${index}`}
                                        class="reactions-bg">
                                        ${reaction.type} 
                                        ${reaction.qty}
                                        <vaadin-tooltip 
                                        for=${`reactions-${index}`} 
                                        position="top"
                                        hover-delay=${400}
                                        hide-delay=${1}
                                        text=${reaction.users.length > 3 ?
                                        (
                                        `${reaction.users[0].name 
                                        ? reaction.users[0].name 
                                        : cropAddress(reaction.users[0].address)}, 
                                        ${reaction.users[1].name 
                                        ? reaction.users[1].name 
                                        : cropAddress(reaction.users[1].address)},
                                        ${reaction.users[2].name 
                                        ? reaction.users[2].name 
                                        : cropAddress(reaction.users[2].address)}
                                        ${get("chatpage.cchange71")} ${reaction.users.length - 3} ${get("chatpage.cchange72")}${(reaction.users.length - 3) > 1 ? html`${get("chatpage.cchange73")}` : ""} ${get("chatpage.cchange74")} ${reaction.type}`
                                        ) : reaction.users.length === 3 ?
                                        (
                                        `${reaction.users[0].name 
                                        ? reaction.users[0].name 
                                        : cropAddress(reaction.users[0].address)}, 
                                        ${reaction.users[1].name 
                                        ? reaction.users[1].name 
                                        : cropAddress(reaction.users[1].address)} 
                                        ${get("chatpage.cchange71")} 
                                        ${reaction.users[2].name 
                                        ? reaction.users[2].name 
                                        : cropAddress(reaction.users[2].address)} ${get("chatpage.cchange74")} ${reaction.type}`
                                        ) : reaction.users.length === 2 ?
                                        (
                                        `${reaction.users[0].name 
                                        ? reaction.users[0].name 
                                        : cropAddress(reaction.users[0].address)}
                                        ${get("chatpage.cchange71")} 
                                        ${reaction.users[1].name 
                                        ? reaction.users[1].name 
                                        : cropAddress(reaction.users[1].address)} ${get("chatpage.cchange74")} ${reaction.type}`
                                        ) : reaction.users.length === 1 ?
                                        (
                                        `${reaction.users[0].name 
                                        ? reaction.users[0].name 
                                        : cropAddress(reaction.users[0].address)} ${get("chatpage.cchange74")} ${reaction.type}`
                                        ) 
                                        : "" }>
                                    </vaadin-tooltip> 
                                    </span>
                                    `
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
                <mwc-dialog
                hideActions
                ?open=${this.openDeleteImage} 
                @closed=${()=> {
                    this.openDeleteImage = false;
                }}>
                <div class="delete-image-msg">
                    <p>Are you sure you want to delete this image?</p>
                </div>
                <div class="modal-button-row" @click=${() => this.openDeleteImage = false}>
                    <button class="modal-button-red">
                       Cancel 
                    </button>
                    <button
                    class="modal-button" 
                    @click=${() => this.sendMessage({
                                type: 'delete',
                                name: image.name,
                                identifier: image.identifier,
                                editedMessageObj: this.messageObj,
                            })}>
                        Yes
                    </button>
                </div>
                </mwc-dialog>
        `
    }
}

window.customElements.define('message-template', MessageTemplate);

class ChatMenu extends LitElement {
    static get properties() {
        return {
            menuItems: { type: Array },
            showPrivateMessageModal: {attribute: false},
            showBlockUserModal: {attribute: false},
            toblockaddress: { type: String, attribute: true },
            showBlockIconFunc: {attribute: false},
            showBlockAddressIcon: { type: Boolean },
            originalMessage: { type: Object },
            setRepliedToMessageObj: {attribute: false},
            setEditedMessageObj: {attribute: false},
            myAddress: { type: Object },
            emojiPicker: { attribute: false },
            sendMessage: { attribute: false },
            version: { type: String },
            setToggledMessage: { attribute: false },
            sendMessageForward: { attribute: false },
            setForwardProperties: { attribute: false },
            firstMessageInChat: { type: Boolean },
            setOpenPrivateMessage: { attribute: false },
            setOpenTipUser: { attribute: false },
            setUserName: { attribute: false },
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

    versionErrorSnack(){
        let errorMsg = get("chatpage.cchange34")
        parentEpml.request('showSnackBar', `${errorMsg}`)
    }

    async messageForwardFunc(){
        let parsedMessageObj = {}
        let publicKey = {
            hasPubKey: false,
            key: ''
        }
        try {
             parsedMessageObj = JSON.parse(this.originalMessage.decodedMessage);
            
        } catch (error) {
            parsedMessageObj = {}
        }

        try {
         const res =   await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/publickey/${this._chatId}`
            })
            if (res.error === 102) {
                publicKey.key = ''
                publicKey.hasPubKey = false
            } else if (res !== false) {
                publicKey.key = res
                publicKey.hasPubKey = true
            } else {
                publicKey.key = ''
                publicKey.hasPubKey = false
            }
        } catch (error) {
            
        }
        
        try {
            const message = {
                ...parsedMessageObj,
                type: 'forward'
            }
            const stringifyMessageObject = JSON.stringify(message)
            this.setForwardProperties(stringifyMessageObject)
           
        } catch (error) {
        }
    }
    render() {
        return html` 
            <div class="container">
            <div 
                class=${`menu-icon reaction ${!this.firstMessageInChat ? "tooltip" : ""}`} 
                data-text="${translate("blockpage.bcchange13")}" 
                @click=${(e) => {
                    if(this.version === '0'){
                        this.versionErrorSnack()
                        return
                    }
                    try {
                        this.setToggledMessage(this.originalMessage)
                        this.emojiPicker.togglePicker(e.target)
                    } catch (error) {
                    }
                    
                    }}
               >
                    <vaadin-icon icon="vaadin:smiley-o" slot="icon"></vaadin-icon>
                </div>
                <div 
                class=${`menu-icon ${!this.firstMessageInChat ? "tooltip" : ""}`} 
                data-text="${translate("blockpage.bcchange14")}" 
                @click="${() => {
                    if (this.version === '0') {
                        this.versionErrorSnack()
                        return
                    }
                    this.messageForwardFunc()
                    }}">
                    <vaadin-icon icon="vaadin:arrow-forward" slot="icon"></vaadin-icon>
                </div>                
                <div 
                    class=${`menu-icon ${!this.firstMessageInChat ? "tooltip" : ""}`} 
                    data-text="${translate("blockpage.bcchange9")}" 
                    @click="${() => this.setOpenPrivateMessage({
                        name: this.originalMessage.senderName ? this.originalMessage.senderName : this.originalMessage.sender,
                        open: true   
                    })}">   
                    <vaadin-icon icon="vaadin:paperplane" slot="icon"></vaadin-icon>
                </div>
                <div class=${`menu-icon ${!this.firstMessageInChat ? "tooltip" : ""}`} data-text="${translate("blockpage.bcchange8")}" @click="${() => this.copyToClipboard(this.toblockaddress)}">
                    <vaadin-icon icon="vaadin:copy" slot="icon"></vaadin-icon>
                </div>
                <div 
                class=${`menu-icon ${!this.firstMessageInChat ? "tooltip" : ""}`} 
                data-text="${translate("blockpage.bcchange11")}" 
                @click="${() => {
                    if (this.version === '0') {
                        this.versionErrorSnack()
                        return
                    }
                    this.setRepliedToMessageObj({...this.originalMessage, version: this.version});
                    }}">
                    <vaadin-icon icon="vaadin:reply" slot="icon"></vaadin-icon>
                </div>
                
                ${this.myAddress === this.originalMessage.sender ? (
                    html`
                    <div 
                    class=${`menu-icon ${!this.firstMessageInChat ? "tooltip" : ""}`}
                    data-text="${translate("blockpage.bcchange12")}" 
                    @click=${() => {
                    if(this.version === '0'){
                        this.versionErrorSnack()
                        return
                    }
                    this.setEditedMessageObj(this.originalMessage);
                    }}>
                        <vaadin-icon icon="vaadin:pencil" slot="icon"></vaadin-icon>
                    </div>
                    `
                ) : html`<div></div>`}
                ${this.myAddress !== this.originalMessage.sender ? (
                    html`
                    <div 
                    class=${`menu-icon ${!this.firstMessageInChat ? "tooltip" : ""}`}
                    data-text="${translate("blockpage.bcchange18")}" 
                    @click=${(e) => {
                    e.preventDefault();
                    this.setUserName(this.originalMessage);
                    this.setOpenTipUser(true);
                    }}>
                        <vaadin-icon icon="vaadin:dollar" slot="icon"></vaadin-icon>
                    </div>
                    `
                ) : html`<div></div>`}
                <div class=${`menu-icon ${!this.firstMessageInChat ? "tooltip" : ""}`} data-text="${translate("blockpage.bcchange10")}" @click="${() => this.showBlockIconFunc(true)}">
                    <vaadin-icon icon="vaadin:ellipsis-dots-h" slot="icon"></vaadin-icon>
                </div>
                ${this.showBlockAddressIcon
                    ? html`
                        <div class="block-user-container">
                            <div class="block-user" @click="${() => this.showBlockUserModal()}">
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
