import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../epml.js'
import { use, get, translate, registerTranslateConfig } from 'lit-translate'
import localForage from "localforage";
registerTranslateConfig({
    loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})
import ShortUniqueId from 'short-unique-id';
import Compressor from 'compressorjs';
import { escape, unescape } from 'html-escaper';
import { inputKeyCodes } from '../../utils/keyCodes.js'
import './ChatScroller.js'
import './LevelFounder.js'
import './NameMenu.js'
import './TimeAgo.js'
import { EmojiPicker } from 'emoji-picker-js';
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-icon'
import { replaceMessagesEdited } from '../../utils/replace-messages-edited.js';
import { publishData } from '../../utils/publish-image.js';
import WebWorker from 'web-worker:./computePowWorker.js';
import WebWorkerImage from 'web-worker:./computePowWorkerImage.js';

// hello
const messagesCache = localForage.createInstance({
    name: "messages-cache",
});

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ChatPage extends LitElement {
    static get properties() {
        return {
            selectedAddress: { type: Object },
            config: { type: Object },
            messages: { type: Array },
            _messages: { type: Array },
            newMessages: { type: Array },
            hideMessages: { type: Array },
            chatId: { type: String },
            myAddress: { type: String },
            isReceipient: { type: Boolean },
            isLoading: { type: Boolean },
            _publicKey: { type: Object },
            balance: { type: Number },
            socketTimeout: { type: Number },
            messageSignature: { type: String },
            _initialMessages: { type: Array },
            isUserDown: { type: Boolean },
            isPasteMenuOpen: { type: Boolean },
            showNewMesssageBar: { attribute: false },
            hideNewMesssageBar: { attribute: false },
            chatEditorPlaceholder: { type: String },
            messagesRendered: { type: Array },
            repliedToMessageObj: { type: Object },
            editedMessageObj: { type: Object },
            iframeHeight: { type: Number },
            chatMessageSize: { type: Number},
            imageFile: {type: Object}
        }
    }

    static get styles() {
        return css`
        html {
            scroll-behavior: smooth;
        }

        .chat-container {
            display: grid;
            grid-template-rows: minmax(6%, 92vh) minmax(40px, auto);
            max-height: 100%;
        }

        .chat-text-area {
            display: flex;
            justify-content: center;
            min-height: 60px;
            max-height: 100%;
            overflow: hidden;
        }

        .chat-text-area .typing-area {
            display: flex;
            flex-direction: column;
            width: 98%;
            box-sizing: border-box;
            margin-bottom: 8px;
            border: 1px solid var(--black);
            border-radius: 10px;
            background: #f1f1f1;
            color: var(--black);
        }

        .chat-text-area .typing-area textarea {
            display: none;
        }

        .chat-text-area .typing-area .chat-editor {
            display: flex;
            max-height: -webkit-fill-available;
            width: 100%;
            border-color: transparent;
            margin: 0;
            padding: 0;
            border: none;
        }

        .repliedTo-container {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px 8px 10px;
        }
        
        .repliedTo-subcontainer {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 15px;
        }

        .repliedTo-message {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }


        .senderName {
            margin: 0;
            color: var(--mdc-theme-primary);
            font-weight: bold;
            user-select: none;
        }

        .original-message {
            margin: 0;
        }

        .reply-icon {
            width: 20px;
            color: var(--mdc-theme-primary);
        }

        .checkmark-icon {
            width: 30px;
            color: var(--mdc-theme-primary);
            margin: 0 8px;
        }
        .checkmark-icon:hover {
           cursor: pointer;
        }

        .close-icon {
            color: #676b71;
            width: 18px;
            transition: all 0.1s ease-in-out;
        }

        .close-icon:hover {
            cursor: pointer;
            color: #494c50;
        }
        
        .chat-text-area .typing-area .chatbar {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: auto;
            padding: 5px 5px 5px 7px;
            overflow-y: hidden;
        }

        .chatbar-container {
            width: 100%;
            display: flex;
            height: auto;
            overflow: hidden;
        }

        .chat-text-area .typing-area .emoji-button {
            width: 45px;
            height: 40px;
            padding-top: 4px;
            border: none;
            outline: none;
            background: transparent;
            cursor: pointer;
            max-height: 40px;
            color: var(--black);
        }

        .message-size-container {
            display: flex;
            justify-content: flex-end;
            width: 100%;
        }

        .message-size {
            font-family: Roboto, sans-serif;
            font-size: 12px;
            color: black;
        }

        .lds-grid {
            width: 120px;
            height: 120px;
            position: absolute;
            left: 50%;
            top: 40%;
        }

        .lds-grid div {
            position: absolute;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: #03a9f4;
            animation: lds-grid 1.2s linear infinite;
        }

        .lds-grid div:nth-child(1) {
            top: 4px;
            left: 4px;
            animation-delay: 0s;
            }

        .lds-grid div:nth-child(2) {
            top: 4px;
            left: 48px;
            animation-delay: -0.4s;
        }

        .lds-grid div:nth-child(3) {
            top: 4px;
            left: 90px;
            animation-delay: -0.8s;
        }

        .lds-grid div:nth-child(4) {
            top: 50px;
            left: 4px;
            animation-delay: -0.4s;
        }

        .lds-grid div:nth-child(5) {
            top: 50px;
            left: 48px;
            animation-delay: -0.8s;
        }

        .lds-grid div:nth-child(6) {
            top: 50px;
            left: 90px;
            animation-delay: -1.2s;
        }

        .lds-grid div:nth-child(7) {
            top: 95px;
            left: 4px;
            animation-delay: -0.8s;
        }

        .lds-grid div:nth-child(8) {
            top: 95px;
            left: 48px;
            animation-delay: -1.2s;
        }
        
        .lds-grid div:nth-child(9) {
            top: 95px;
            left: 90px;
            animation-delay: -1.6s;
        }

        @keyframes lds-grid {
            0%, 100% {
            opacity: 1;
            }
            50% {
            opacity: 0.5;
            }
    }   

        .float-left {
            float: left;
        }

        img {
            border-radius: 25%;
        }

        .paperclip-icon {
            color: #494949;
            width: 25px;
        }

        .paperclip-icon:hover {
            cursor: pointer;
        }

        .send-icon {
            width: 30px;
            margin-left: 5px;
            transition: all 0.1s ease-in-out;
            cursor: pointer;
        }

        .send-icon:hover {
            filter: brightness(1.1);
        }

        .file-picker-container {
            position: relative;
            height: 25px;
            width: 25px;
        }

        .file-picker-input-container {
            position: absolute;
            top: 0px;
            bottom: 0px;
            left: 0px;
            right: 0px;
            z-index: 10;
            opacity: 0;
            overflow: hidden;
        }

        input[type=file]::-webkit-file-upload-button { 
            cursor: pointer; 
        }   
        
        `
    }

    constructor() {
        super()
        this.getMessageConfig = this.getMessageConfig.bind(this)
        this.getOldMessage = this.getOldMessage.bind(this)
        this._sendMessage = this._sendMessage.bind(this)
        this.insertImage = this.insertImage.bind(this)
        this.getMessageSize = this.getMessageSize.bind(this)
        this._downObserverhandler = this._downObserverhandler.bind(this)
        this.calculateIFrameHeight = this.calculateIFrameHeight.bind(this)
        this.selectedAddress = {}
        this.chatId = ''
        this.myAddress = ''
        this.messages = []
        this._messages = []
        this.newMessages = []
        this.hideMessages = JSON.parse(localStorage.getItem("MessageBlockedAddresses") || "[]")
        this._publicKey = { key: '', hasPubKey: false }
        this.messageSignature = ''
        this._initialMessages = []
        this.balance = 1
        this.isReceipient = false
        this.isLoadingMessages = true
        this.isLoading = false
        this.isUserDown = false
        this.isPasteMenuOpen = false
        this.chatEditorPlaceholder = this.renderPlaceholder()
        this.messagesRendered = []
        this.repliedToMessageObj = null
        this.editedMessageObj = null
        this.iframeHeight = 40
        this.chatMessageSize = 0
        this.imageFile = null
        this.uid = new ShortUniqueId()
    }
    
    render() {
        return html`
            <div class="chat-container">
                <div>
                    ${this.isLoadingMessages ? 
                        html`
                        <div class="lds-grid">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        ` : 
                        this.renderChatScroller(this._initialMessages)}
                        <mwc-dialog id="showDialogPublicKey" ?open=${this.imageFile} @closed=${()=> {
                            this.imageFile = null
                        }}>
                            <div class="dialog-header"></div>
                            <div class="dialog-container">
                                ${this.imageFile && html`
                                <img src=${URL.createObjectURL(this.imageFile)} />
                                `}
                            </div>
                            <mwc-button
                                slot="primaryAction"
                                dialogAction="cancel"
                                class="red"
                                @click=${()=> {
                                    this._sendMessage({
                                        type: 'image',
                                        imageFile:  this.imageFile,
                                        caption: 'This is a caption'
                                    })
                                }}
                            >
                            send
                            </mwc-button>
                            <mwc-button
                                slot="primaryAction"
                                dialogAction="cancel"
                                class="red"
                                @click=${()=>{
                                    
                                this.imageFile = null
                                }}
                            >
                            ${translate("general.close")}
                        </mwc-button>
                    </mwc-dialog>
                </div>
                <div class="chat-text-area" style="${`height: ${this.iframeHeight}px; ${(this.repliedToMessageObj || this.editedMessageObj) && "min-height: 120px"}`}">
                        <div class="typing-area">
                            ${this.repliedToMessageObj && html`
                                <div class="repliedTo-container">
                                    <div class="repliedTo-subcontainer">
                                        <vaadin-icon class="reply-icon" icon="vaadin:reply" slot="icon"></vaadin-icon>
                                        <div class="repliedTo-message">
                                            <p class="senderName">${this.repliedToMessageObj.senderName ? this.repliedToMessageObj.senderName : this.repliedToMessageObj.sender}</p>
                                            <p class="original-message">${this.repliedToMessageObj.message}</p>
                                        </div>
                                    </div>
                                    <vaadin-icon
                                        class="close-icon"
                                        icon="vaadin:close-big"
                                        slot="icon"
                                        @click=${() => this.closeRepliedToContainer()}
                                        ></vaadin-icon>
                                </div>
                            `}
                            ${this.editedMessageObj && html`
                                <div class="repliedTo-container">
                                    <div class="repliedTo-subcontainer">
                                        <vaadin-icon class="reply-icon" icon="vaadin:pencil" slot="icon"></vaadin-icon>
                                        <div class="repliedTo-message">
                                            <p class="senderName">${translate("chatpage.cchange25")}</p>
                                            <p class="original-message">${this.editedMessageObj.message}</p>
                                        </div>
                                    </div>
                                    <vaadin-icon
                                        class="close-icon"
                                        icon="vaadin:close-big"
                                        slot="icon"
                                        @click=${() => this.closeEditMessageContainer()}
                                        ></vaadin-icon>
                                </div>
                            `}
                        <div class="chatbar" style="${this.chatMessageSize >= 750 && 'padding-bottom: 7px'}">
                            <div class="chatbar-container" style="${this.chatMessageInput && this.chatMessageInput.contentDocument.body.scrollHeight > 60 ? 'align-items: flex-end' : "align-items: center"}"
                            >
                                <div class="file-picker-container">
                                    <vaadin-icon
                                        class="paperclip-icon"
                                        icon="vaadin:paperclip"
                                        slot="icon"
                                        @click=${() => this.closeEditMessageContainer()}
                                    >
                                    </vaadin-icon>
                                    <div class="file-picker-input-container">
                                        <input 
                                            .value="${this.imageFile}"
                                            @change="${e => this.insertImage(e.target.files[0])}"
                                            class="file-picker-input" type="file" name="myImage" accept="image/*" />
                                    </div>
                                </div>
                                <textarea style="color: var(--black);" tabindex='1' ?autofocus=${true} ?disabled=${this.isLoading || this.isLoadingMessages} id="messageBox" rows="1"></textarea>
                                <iframe style="${`height: ${this.iframeHeight}px`}" class="chat-editor" id="_chatEditorDOM" tabindex="-1" height=${this.iframeHeight}>
                                </iframe>
                                <button class="emoji-button" ?disabled=${this.isLoading || this.isLoadingMessages}>
                                    ${html`<img class="emoji" draggable="false" alt="😀" src="/emoji/svg/1f600.svg" />`}
                                </button>
                                ${this.editedMessageObj ? (
                                    html`
                                    <div>
                                    ${this.isLoading === false ? html`
                                        <vaadin-icon
                                            class="checkmark-icon"
                                            icon="vaadin:check"
                                            slot="icon"
                                            @click=${() => this._sendMessage()}
                                            >
                                        </vaadin-icon>
                                        ` :
                                        html`
                                        <paper-spinner-lite active></paper-spinner-lite>
                                        `}
                                    </div>
                                        `
                                ) : 
                                    html`
                                        <div style="display:flex; ${this.chatMessageInput && this.chatMessageInput.contentDocument.body.scrollHeight > 60 ? 'margin-bottom: 5px' : "margin-bottom: 0"}">
                                            ${this.isLoading === false ? html`
                                                <img 
                                                src="/img/qchat-send-message-icon.svg" 
                                                alt="send-icon" 
                                                class="send-icon" 
                                                @click=${() => this._sendMessage()} />
                                            ` : 
                                            html`
                                                <paper-spinner-lite active></paper-spinner-lite>
                                        `}
                                        </div>
                                        `
                                }
                            </div>
                                ${this.chatMessageSize >= 750 ? 
                                    html`
                                    <div class="message-size-container">
                                        <div class="message-size" style="${this.chatMessageSize >= 1000 && 'color: #bd1515'}">
                                            ${`Your message size is of ${this.chatMessageSize} bytes out of a maximum of 1000`}
                                        </div>
                                    </div>
                                    ` : 
                                    html``}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
    }



    insertImage(file){
        
        if(file.type.includes('image')){
            this.imageFile = file

            return
        }
        
        parentEpml.request('showSnackBar', get("chatpage.cchange28"))
        
    }


  
    async firstUpdated() {
       
        // TODO: Load and fetch messages from localstorage (maybe save messages to localstorage...)
        // this.changeLanguage();
        this.emojiPickerHandler = this.shadowRoot.querySelector('.emoji-button');
        this.mirrorChatInput = this.shadowRoot.getElementById('messageBox');
        this.chatMessageInput = this.shadowRoot.getElementById('_chatEditorDOM');
        console.log(this.chatMessageInput);
        console.log(this.mirrorChatInput.clientHeight);
        document.addEventListener('keydown', (e) => {
            if (!this.chatEditor.content.body.matches(':focus')) {
                // WARNING: Deprecated methods from KeyBoard Event
                if (e.code === "Space" || e.keyCode === 32 || e.which === 32) {
                    this.chatEditor.insertText('&nbsp;');
                } else if (inputKeyCodes.includes(e.keyCode)) {
                    this.chatEditor.insertText(e.key);
                    return this.chatEditor.focus();
                } else {
                    return this.chatEditor.focus();
                }
            }
        });

        // Init EmojiPicker
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
            const emojiHtmlString = `<img class="emoji" draggable="false" alt="${selection.emoji}" src="${selection.url}">`;
            this.chatEditor.insertEmoji(emojiHtmlString);
        });

        // Attach Event Handler
        this.emojiPickerHandler.addEventListener('click', () => this.emojiPicker.togglePicker(this.emojiPickerHandler));
        window.addEventListener('storage', () => {
            const checkLanguage = localStorage.getItem('qortalLanguage')
            use(checkLanguage)
        })

        const getAddressPublicKey = () => {

            parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/publickey/${this._chatId}`
            }).then(res => {

                if (res.error === 102) {

                    this._publicKey.key = ''
                    this._publicKey.hasPubKey = false
                    this.fetchChatMessages(this._chatId)
                } else if (res !== false) {

                    this._publicKey.key = res
                    this._publicKey.hasPubKey = true
                    this.fetchChatMessages(this._chatId)
                } else {

                    this._publicKey.key = ''
                    this._publicKey.hasPubKey = false
                    this.fetchChatMessages(this._chatId)
                }
            })
        };

        setTimeout(() => {
            this.chatId.includes('direct') === true ? this.isReceipient = true : this.isReceipient = false;
            this._chatId = this.chatId.split('/')[1];

            const mstring = get("chatpage.cchange8")
            const placeholder = this.isReceipient === true ? `Message ${this._chatId}` : `${mstring}`;
            this.chatEditorPlaceholder = placeholder;

            this.isReceipient ? getAddressPublicKey() : this.fetchChatMessages(this._chatId);

            // Init ChatEditor
            this.initChatEditor();
        }, 100)

        parentEpml.ready().then(() => {
            parentEpml.subscribe('selected_address', async selectedAddress => {
                this.selectedAddress = {}
                selectedAddress = JSON.parse(selectedAddress)
                if (!selectedAddress || Object.entries(selectedAddress).length === 0) return
                this.selectedAddress = selectedAddress
            })
            parentEpml.request('apiCall', {
                url: `/addresses/balance/${window.parent.reduxStore.getState().app.selectedAddress.address}`
            }).then(res => {
                this.balance = res
            })
            parentEpml.subscribe('frame_paste_menu_switch', async res => {

                res = JSON.parse(res)
                if (res.isOpen === false && this.isPasteMenuOpen === true) {

                    this.pasteToTextBox(textarea)
                    this.isPasteMenuOpen = false
                }
            })
        })
        parentEpml.imReady();
    }


    async updated(changedProperties) {
        if (changedProperties.has('messagesRendered')) { 
            const chatReference1 = this.isReceipient ? 'direct' : 'group';
            const chatReference2 = this._chatId
            if (chatReference1 && chatReference2) {
                await messagesCache.setItem(`${chatReference1}-${chatReference2}`, this.messagesRendered);
            }
        }
        if (changedProperties && changedProperties.has('editedMessageObj')) {
            this.chatEditor.insertText(this.editedMessageObj.message)
        }
        if (changedProperties && changedProperties.has('chatMessageSize')) {
            console.log(this.chatMessageSize, "Chat Message Size");
        }
    }

    calculateIFrameHeight(height) {
        this.iframeHeight = height;
    }

    changeLanguage() {
        const checkLanguage = localStorage.getItem('qortalLanguage')

        if (checkLanguage === null || checkLanguage.length === 0) {
            localStorage.setItem('qortalLanguage', 'us')
            use('us')
        } else {
            use(checkLanguage)
        }
    }

    renderPlaceholder() {
        const mstring = get("chatpage.cchange8")
        const placeholder = this.isReceipient === true ? `Message ${this._chatId}` : `${mstring}`;
        this.chatEditorPlaceholder = placeholder;
    }

    renderChatScroller(initialMessages) {
        return html`
        <chat-scroller 
        .initialMessages=${initialMessages} 
        .messages=${this.messagesRendered} 
        .emojiPicker=${this.emojiPicker} 
        .escapeHTML=${escape} 
        .getOldMessage=${this.getOldMessage}
        .setRepliedToMessageObj=${(val) => this.setRepliedToMessageObj(val)}
        .setEditedMessageObj=${(val) => this.setEditedMessageObj(val)}
        .focusChatEditor=${() => this.focusChatEditor()}
        .sendMessage=${(val)=> this._sendMessage(val)}
        >
        </chat-scroller>`
    }

    async getUpdateComplete() {
        await super.getUpdateComplete();
        const marginElements = Array.from(this.shadowRoot.querySelectorAll('chat-scroller'));
        await Promise.all(marginElements.map(el => el.updateComplete));
        return true;
    }

    async getOldMessage(scrollElement) {

        if (this.isReceipient) {
            const getInitialMessages = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/chat/messages?involving=${window.parent.reduxStore.getState().app.selectedAddress.address}&involving=${this._chatId}&limit=20&reverse=true&before=${scrollElement.messageObj.timestamp}&haschatreference=false`,
            });

            const decodeMsgs = getInitialMessages.map((eachMessage) => {
                return this.decodeMessage(eachMessage)
            })
            
         
            const replacedMessages = await replaceMessagesEdited({
                decodedMessages: decodeMsgs,
	parentEpml,
            isReceipient: this.isReceipient,
            decodeMessageFunc: this.decodeMessage,
            _publicKey: this._publicKey
            })
            this.messagesRendered = [...replacedMessages, ...this.messagesRendered].sort(function (a, b) {
                return a.timestamp
                    - b.timestamp
            })
            await this.getUpdateComplete();

            scrollElement.scrollIntoView({ behavior: 'auto', block: 'center' });

        } else {
            const getInitialMessages = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/chat/messages?txGroupId=${Number(this._chatId)}&limit=20&reverse=true&before=${scrollElement.messageObj.timestamp}&haschatreference=false`,
            });


            const decodeMsgs = getInitialMessages.map((eachMessage) => {
                return this.decodeMessage(eachMessage)
            })

            const replacedMessages = await replaceMessagesEdited({
                decodedMessages: decodeMsgs,
	parentEpml,
            isReceipient: this.isReceipient,
            decodeMessageFunc: this.decodeMessage,
            _publicKey: this._publicKey
            })
          
            this.messagesRendered = [...replacedMessages, ...this.messagesRendered].sort(function (a, b) {
                return a.timestamp
                    - b.timestamp
            })
            await this.getUpdateComplete();

            scrollElement.scrollIntoView({ behavior: 'auto', block: 'center' });

        }

    }

    async processMessages(messages, isInitial) {
        const isReceipient = this.chatId.includes('direct')
         const decodedMessages = messages.map((eachMessage) => {

                if (eachMessage.isText === true) {
                    this.messageSignature = eachMessage.signature
                    let _eachMessage = this.decodeMessage(eachMessage)
                    return _eachMessage
                } else {
                    this.messageSignature = eachMessage.signature
                    let _eachMessage = this.decodeMessage(eachMessage)
                    return _eachMessage
                }
            })
       
        if (isInitial) {

          

            const replacedMessages = await replaceMessagesEdited({
                decodedMessages: decodedMessages,
	parentEpml,
            isReceipient: isReceipient,
            decodeMessageFunc: this.decodeMessage,
            _publicKey: this._publicKey
            })

            this._messages = replacedMessages.sort(function (a, b) {
                return a.timestamp
                    - b.timestamp
            })

          

            // TODO: Determine number of initial messages by screen height...
            this._initialMessages = this._messages


            this.messagesRendered = this._initialMessages


            this.isLoadingMessages = false
            setTimeout(() => this.downElementObserver(), 500)
        } else {
            const replacedMessages = await replaceMessagesEdited({
            decodedMessages: decodedMessages,
	        parentEpml,
            isReceipient: isReceipient,
            decodeMessageFunc: this.decodeMessage,
            _publicKey: this._publicKey
            })

          
            const renderEachMessage = replacedMessages.map(async(msg)=> {
              await  this.renderNewMessage(msg)
            })
          await Promise.all(renderEachMessage)


            // this.newMessages = this.newMessages.concat(_newMessages)
            this.messagesRendered = [...this.messagesRendered].sort(function (a, b) {
                return a.timestamp
                    - b.timestamp
            })


        }
    }

    getMessageConfig() {
        const textAreaElement = this.shadowRoot.getElementById('messageBox');
        return textAreaElement.value;
    }

    getMessageSize(message){
        try {
         const messageText = message;
        // Format and Sanitize Message
        const sanitizedMessage = messageText.replace(/&nbsp;/gi, ' ').replace(/<br\s*[\/]?>/gi, '\n');
        const trimmedMessage = sanitizedMessage.trim();
            let messageObject = {};

            if (this.repliedToMessageObj) {
                let chatReference = this.repliedToMessageObj.reference;
                if (this.repliedToMessageObj.chatReference) {
                    chatReference = this.repliedToMessageObj.chatReference;
                }
                 messageObject = {
                    messageText: trimmedMessage,
                    images: [''],
                    repliedTo: chatReference,
                    version: 1
                }
            } else if (this.editedMessageObj) {
                let message = "";
                try {
                    const parsedMessageObj = JSON.parse(this.editedMessageObj.decodedMessage);
                    message = parsedMessageObj;
                 } catch (error) {
                    message = this.messageObj.decodedMessage
                }
                messageObject = {
                    ...message,
                    messageText: trimmedMessage,
                }
            } else {
              messageObject = {
                    messageText: trimmedMessage,
                    images: [''],
                    repliedTo: '',
                    version: 1
                };
            }

            const stringified = JSON.stringify(messageObject);
            const size =  new Blob([stringified]).size;
            this.chatMessageSize = size;

        } catch (error) {
            console.error(error)
        }
        
    }
        
     // set replied to message in chat editor

     setRepliedToMessageObj(messageObj) {
        this.repliedToMessageObj = {...messageObj};
        this.editedMessageObj = null;
        this.requestUpdate();
    }

    // set edited message in chat editor

     setEditedMessageObj(messageObj) {
        this.editedMessageObj = {...messageObj};
        this.repliedToMessageObj = null;
        this.requestUpdate();
    }
    
    closeEditMessageContainer() {
        this.editedMessageObj = null;
        this.chatEditor.resetValue();
        this.requestUpdate();
    }
 
    closeRepliedToContainer() {
        this.repliedToMessageObj = null;
        this.requestUpdate();
    }
 
    focusChatEditor() {
       this.chatEditor.focus();
    }

    /**
    * New Message Template implementation, takes in a message object.
    * @param { Object } messageObj
    * @property id or index
    * @property sender and other info..
    */
    chatMessageTemplate(messageObj) {
        const hidemsg = this.hideMessages

        let avatarImg = ''
        let nameMenu = ''
        let levelFounder = ''
        let hideit = hidemsg.includes(messageObj.sender)

        levelFounder = `<level-founder checkleveladdress="${messageObj.sender}"></level-founder>`

        if (messageObj.senderName) {
            const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
            const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
            const avatarUrl = `${nodeUrl}/arbitrary/THUMBNAIL/${messageObj.senderName}/qortal_avatar?async=true&apiKey=${myNode.apiKey}`
            avatarImg = `<img src="${avatarUrl}" style="max-width:100%; max-height:100%;" onerror="this.onerror=null; this.src='/img/incognito.png';" />`
        }

        if (messageObj.sender === this.myAddress) {
            nameMenu = `<span style="color: #03a9f4;">${messageObj.senderName ? messageObj.senderName : messageObj.sender}</span>`
        } else {
            nameMenu = `<name-menu toblockaddress="${messageObj.sender}" nametodialog="${messageObj.senderName ? messageObj.senderName : messageObj.sender}"></name-menu>`
        }

        if (hideit === true) {
            return `
                <li class="clearfix"></li>
            `
        } else {
            return `
                <li class="clearfix">
                    <div class="message-data ${messageObj.sender === this.selectedAddress.address ? "" : ""}">
                        <span class="message-data-name">${nameMenu}</span>
                        <span class="message-data-level">${levelFounder}</span>
                        <span class="message-data-time"><message-time timestamp=${messageObj.timestamp}></message-time></span>
                    </div>
                    <div class="message-data-avatar" style="width:42px; height:42px; ${messageObj.sender === this.selectedAddress.address ? "float:left;" : "float:left;"} margin:3px;">${avatarImg}</div>
                    <div class="message ${messageObj.sender === this.selectedAddress.address ? "my-message float-left" : "other-message float-left"}">${this.emojiPicker.parse(escape(messageObj.decodedMessage))}</div>
                </li>
            `
        }
    }

    async renderNewMessage(newMessage) {
        if(newMessage.chatReference){
            const findOriginalMessageIndex = this.messagesRendered.findIndex(msg=> msg.reference === newMessage.chatReference || (msg.chatReference && msg.chatReference === newMessage.chatReference) )
            if(findOriginalMessageIndex !== -1){
                const newMessagesRendered = [...this.messagesRendered]
                newMessagesRendered[findOriginalMessageIndex] = {...newMessage, timestamp: newMessagesRendered[findOriginalMessageIndex].timestamp, editedTimestamp: newMessage.timestamp }
                this.messagesRendered = newMessagesRendered
            await this.getUpdateComplete();
            }

            return
        }
        const viewElement = this.shadowRoot.querySelector('chat-scroller').shadowRoot.getElementById('viewElement');

        if (newMessage.sender === this.selectedAddress.address) {

            this.messagesRendered = [...this.messagesRendered, newMessage]
            await this.getUpdateComplete();

            viewElement.scrollTop = viewElement.scrollHeight;
        } else if (this.isUserDown) {

            // Append the message and scroll to the bottom if user is down the page
            this.messagesRendered = [...this.messagesRendered, newMessage]
            await this.getUpdateComplete();

            viewElement.scrollTop = viewElement.scrollHeight;
        } else {

            this.messagesRendered = [...this.messagesRendered, newMessage]
            await this.getUpdateComplete();

            this.showNewMesssageBar();
        }
    }

    /**
     *  Decode Message Method. Takes in a message object and returns a decoded message object
     * @param {Object} encodedMessageObj 
     * 
     */
    decodeMessage(encodedMessageObj, isReceipient, _publicKey ) {
        let isReceipientVar 
        let _publicKeyVar 
        try {
            isReceipientVar =  this.isReceipient === undefined ? isReceipient : this.isReceipient;
            _publicKeyVar = this._publicKey === undefined ? _publicKey : this._publicKey
        } catch (error) {
            isReceipientVar = isReceipient
            _publicKeyVar = _publicKey
        }
        
        let decodedMessageObj = {}

        if (isReceipientVar === true) {
            // direct chat
            if (encodedMessageObj.isEncrypted === true && _publicKeyVar.hasPubKey === true && encodedMessageObj.data) {
                let decodedMessage = window.parent.decryptChatMessage(encodedMessageObj.data, window.parent.reduxStore.getState().app.selectedAddress.keyPair.privateKey, _publicKeyVar.key, encodedMessageObj.reference)
                decodedMessageObj = { ...encodedMessageObj, decodedMessage }
            } else if (encodedMessageObj.isEncrypted === false && encodedMessageObj.data) {
                let bytesArray = window.parent.Base58.decode(encodedMessageObj.data)
                let decodedMessage = new TextDecoder('utf-8').decode(bytesArray)
                decodedMessageObj = { ...encodedMessageObj, decodedMessage }
            } else {

                decodedMessageObj = { ...encodedMessageObj, decodedMessage: "Cannot Decrypt Message!" }
            }

        } else {
            // group chat

            let bytesArray = window.parent.Base58.decode(encodedMessageObj.data)
            let decodedMessage = new TextDecoder('utf-8').decode(bytesArray)
            decodedMessageObj = { ...encodedMessageObj, decodedMessage }
        }

        return decodedMessageObj
    }

    async fetchChatMessages(chatId) {

        const initDirect = async (cid) => {

            let initial = 0

            let directSocketTimeout

            let myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
            let nodeUrl = myNode.domain + ":" + myNode.port

            let directSocketLink

            if (window.parent.location.protocol === "https:") {

                directSocketLink = `wss://${nodeUrl}/websockets/chat/messages?involving=${window.parent.reduxStore.getState().app.selectedAddress.address}&involving=${cid}`;
            } else {

                // Fallback to http
                directSocketLink = `ws://${nodeUrl}/websockets/chat/messages?involving=${window.parent.reduxStore.getState().app.selectedAddress.address}&involving=${cid}`;
            }

            const directSocket = new WebSocket(directSocketLink);

            // Open Connection
            directSocket.onopen = () => {

                setTimeout(pingDirectSocket, 50)
            }

            // Message Event
            directSocket.onmessage = async (e) => {
                if (initial === 0) {
                    const isReceipient = this.chatId.includes('direct')


                    const chatReference1 = isReceipient ? 'direct' : 'group';
                    const chatReference2 = this.chatId.split('/')[1];
                    const cachedData = await messagesCache.getItem(`${chatReference1}-${chatReference2}`);

                    let getInitialMessages = []
                    if (cachedData && cachedData.length !== 0) {
                        const lastMessage = cachedData[cachedData.length - 1]
                        const newMessages = await parentEpml.request('apiCall', {
                            type: 'api',
                            url: `/chat/messages?involving=${window.parent.reduxStore.getState().app.selectedAddress.address}&involving=${cid}&limit=20&reverse=true&after=${lastMessage.timestamp}&haschatreference=false`,
                        });
                        getInitialMessages = [...cachedData, ...newMessages].slice(-20)
                    } else {
                        getInitialMessages = await parentEpml.request('apiCall', {
                            type: 'api',
                            url: `/chat/messages?involving=${window.parent.reduxStore.getState().app.selectedAddress.address}&involving=${cid}&limit=20&reverse=true&haschatreference=false`,
                        });


                    }

                    this.processMessages(getInitialMessages, true)

                    initial = initial + 1

                } else {
                    if(e.data){
                        this.processMessages(JSON.parse(e.data), false)
                    }
                    
                }
            }

            // Closed Event
            directSocket.onclose = () => {
                clearTimeout(directSocketTimeout)
            }

            // Error Event
            directSocket.onerror = (e) => {
                clearTimeout(directSocketTimeout)
            }

            const pingDirectSocket = () => {
                directSocket.send('ping')

                directSocketTimeout = setTimeout(pingDirectSocket, 295000)
            }

        };

        const initGroup = (gId) => {
            let groupId = Number(gId)

            let initial = 0

            let groupSocketTimeout

            let myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
            let nodeUrl = myNode.domain + ":" + myNode.port

            let groupSocketLink

            if (window.parent.location.protocol === "https:") {

                groupSocketLink = `wss://${nodeUrl}/websockets/chat/messages?txGroupId=${groupId}`;
            } else {

                // Fallback to http
                groupSocketLink = `ws://${nodeUrl}/websockets/chat/messages?txGroupId=${groupId}`;
            }

            const groupSocket = new WebSocket(groupSocketLink);

            // Open Connection
            groupSocket.onopen = () => {

                setTimeout(pingGroupSocket, 50)
            }

            // Message Event
            groupSocket.onmessage = async (e) => {

                if (initial === 0) {
                    const isGroup = this.chatId.includes('group')
                    const chatReference1 = isGroup ? 'group' : 'direct';
                    const chatReference2 = this.chatId.split('/')[1];

                    const cachedData = await messagesCache.getItem(`${chatReference1}-${chatReference2}`);

                    let getInitialMessages = []
                    if (cachedData && cachedData.length !== 0) {

                        const lastMessage = cachedData[cachedData.length - 1]

                        const newMessages = await parentEpml.request('apiCall', {
                            type: 'api',
                            url: `/chat/messages?txGroupId=${groupId}&limit=20&reverse=true&after=${lastMessage.timestamp}&haschatreference=false`,
                        });

                        getInitialMessages = [...cachedData, ...newMessages].slice(-20)
                    } else {
                        getInitialMessages = await parentEpml.request('apiCall', {
                            type: 'api',
                            url: `/chat/messages?txGroupId=${groupId}&limit=20&reverse=true&haschatreference=false`,
                        });


                    }


                    this.processMessages(getInitialMessages, true)

                    initial = initial + 1
                } else {
                    if(e.data){
                        this.processMessages(JSON.parse(e.data), false)
                    }
                   
                }
            }

            // Closed Event
            groupSocket.onclose = () => {
                clearTimeout(groupSocketTimeout)
            }

            // Error Event
            groupSocket.onerror = (e) => {
                clearTimeout(groupSocketTimeout)
            }

            const pingGroupSocket = () => {
                groupSocket.send('ping')

                groupSocketTimeout = setTimeout(pingGroupSocket, 295000)
            }

        };


        if (chatId !== undefined) {

            if (this.isReceipient) {
                initDirect(chatId)
            } else {
                let groupChatId = Number(chatId)
                initGroup(groupChatId)
            }

        } else {
            // ... Render a nice "Error, Go Back" component.
        }

        // Add to the messages... TODO: Save messages to localstorage and fetch from it to make it persistent... 
    }

   async _sendMessage(outSideMsg) {
        // have params to determine if it's a reply or not
        // have variable to determine if it's a response, holds signature in constructor
        // need original message signature 
        // need whole original message object, transform the data and put it in local storage
        // create new var called repliedToData and use that to modify the UI
        // find specific object property in local
        let typeMessage = 'regular';
       
        this.isLoading = true;
        this.chatEditor.disable();
        const messageText = this.mirrorChatInput.value;
        // Format and Sanitize Message
        const sanitizedMessage = messageText.replace(/&nbsp;/gi, ' ').replace(/<br\s*[\/]?>/gi, '\n');
        const trimmedMessage = sanitizedMessage.trim();
        
        const getName = async (recipient)=> {
            try {
                
                const getNames = await parentEpml.request("apiCall", {
					type: "api",
					url: `/names/address/${recipient}`,
				})
                if(Array.isArray(getNames) && getNames.length > 0 ){
                    return getNames[0].name
                } else {
                    return ''
                }
            } catch (error) {
                return ""
            }
        }

        if(outSideMsg && outSideMsg.type === 'delete'){
            const userName = outSideMsg.name
            const identifier = outSideMsg.identifier
            let compressedFile = ''
            var str = "iVBORw0KGgoAAAANSUhEUgAAAsAAAAGMAQMAAADuk4YmAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAADlJREFUeF7twDEBAAAAwiD7p7bGDlgYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAGJrAABgPqdWQAAAABJRU5ErkJggg==";
   
    const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
      
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
      
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
      
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
      
        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
      }
      const blob = b64toBlob(str, 'image/png');

            await new Promise(resolve =>{
                new Compressor( blob, {
                    quality: 0.6,
                    maxWidth: 500,
                    success(result){
                        console.log({result})
                        const file = new File([result], "name", {
                            type: 'image/png'
                        });
                        console.log({file})
                        compressedFile = file
                        resolve()
                    },
                    error(err) {
                        console.log(err.message);
                      },
                })
            })
            try {
           

                await publishData({
                    registeredName: userName  ,
            file : compressedFile ,
            service: 'IMAGE',
            identifier : identifier,
            parentEpml,
            metaData: undefined,
            uploadType: 'file',
            selectedAddress: this.selectedAddress,
            worker: new WebWorkerImage()
                   })
            } catch (error) {
                console.error(error)
                this.isLoading = false;
                this.chatEditor.enable();
                return
            }
                typeMessage = 'edit';
                let chatReference = outSideMsg.editedMessageObj.reference;

            if(outSideMsg.editedMessageObj.chatReference){
                chatReference = outSideMsg.editedMessageObj.chatReference
            }
           
            let message = "";
        try {
            const parsedMessageObj = JSON.parse(outSideMsg.editedMessageObj.decodedMessage);
            message = parsedMessageObj;
            
        } catch (error) {
            message = outSideMsg.editedMessageObj.decodedMessage;
        }
            const messageObject = {
                ...message,
                isImageDeleted: true
            }
            const stringifyMessageObject = JSON.stringify(messageObject);
            this.sendMessage(stringifyMessageObject, typeMessage, chatReference);
           

        }
        else if (outSideMsg && outSideMsg.type === 'image') {

            const userName = await getName(this.selectedAddress.address);
            if (!userName) {
                parentEpml.request('showSnackBar', get("chatpage.cchange27"));
                this.isLoading = false;
                this.chatEditor.enable();
                return;
            }
            const id = this.uid();
            const identifier = `qchat_${id}`
            let compressedFile = ''
            await new Promise(resolve =>{
                new Compressor( outSideMsg.imageFile, {
                    quality: .6,
                    maxWidth: 500,
                    success(result){
                        const file = new File([result], "name", {
                            type: outSideMsg.imageFile.type
                        });
                        compressedFile = file
                        resolve()
                    },
                    error(err) {
                        console.log(err.message);
                      },
                })
            })

            const fileSize = compressedFile.size
            if(fileSize > 5000000){
                parentEpml.request('showSnackBar', get("chatpage.cchange26"))
                this.isLoading = false;
                this.chatEditor.enable();
                return
            }
          console.log({userName, identifier })
                try {
                    await publishData({
                        registeredName: userName,
                file : compressedFile,
                service: 'IMAGE',
                identifier : identifier,
                parentEpml,
                metaData: undefined,
                uploadType: 'file',
                selectedAddress: this.selectedAddress,
                worker: new WebWorkerImage()
                       })
                } catch (error) {
                    console.error(error)
                this.isLoading = false;
                this.chatEditor.enable();
                return
                }
                   
                    const messageObject = {
                        messageText: outSideMsg.caption,
                        images: [{
                                service: "IMAGE",
                                name: userName,
                                identifier: identifier
                        }],
                        isImageDeleted: false,
                        repliedTo: '',
                        version: 1
                    }
                    const stringifyMessageObject = JSON.stringify(messageObject)
                    this.sendMessage(stringifyMessageObject, typeMessage);
           
           
       
        }  else if(outSideMsg && outSideMsg.type === 'reaction'){
            typeMessage = 'edit'
            let chatReference = outSideMsg.editedMessageObj.reference

            if(outSideMsg.editedMessageObj.chatReference){
                chatReference = outSideMsg.editedMessageObj.chatReference
            }
           
            let message = ""
        try {
            const parsedMessageObj = JSON.parse(outSideMsg.editedMessageObj.decodedMessage)
            message = parsedMessageObj
            
        } catch (error) {
            message = outSideMsg.editedMessageObj.decodedMessage
        }   

            let reactions = message.reactions || []
            const findEmojiIndex = reactions.findIndex((reaction)=> reaction.type === outSideMsg.reaction)
            if(findEmojiIndex !== -1){
                let users =  reactions[findEmojiIndex].users || []
                const findUserIndex = users.find((user)=> user === this.selectedAddress.address )
                if(findUserIndex !== -1){
                  users.splice(findUserIndex, 1)
                } else {
                    users.push(this.selectedAddress.address)
                }
                reactions[findEmojiIndex] = {
                    ...reactions[findEmojiIndex],
                    qty: users.length,
                    users
                }
                if(users.length === 0){
                    reactions.splice(findEmojiIndex, 1)
                }
            } else {
                reactions = [...reactions, {
                    type: outSideMsg.reaction,
                    qty: 1,
                    users: [this.selectedAddress.address]
                }]
            }
            
            const messageObject = {
                ...message,
                reactions
                
            }
            const stringifyMessageObject = JSON.stringify(messageObject)
            this.sendMessage(stringifyMessageObject, typeMessage, chatReference);

        } else if (/^\s*$/.test(trimmedMessage)) {
            this.isLoading = false;
            this.chatEditor.enable();
        } else if (trimmedMessage.length >= 256) {
            this.isLoading = false;
            this.chatEditor.enable();
            let err1string = get("chatpage.cchange24");
            parentEpml.request('showSnackBar', `${err1string}`);
        } else if (this.repliedToMessageObj) {
            let chatReference = this.repliedToMessageObj.reference

            if(this.repliedToMessageObj.chatReference){
                chatReference = this.repliedToMessageObj.chatReference
            }
            typeMessage = 'reply'
            const messageObject = {
                messageText: trimmedMessage,
                images: [''],
                repliedTo: chatReference,
                version: 1
            }
            const stringifyMessageObject = JSON.stringify(messageObject)
            this.sendMessage(stringifyMessageObject, typeMessage  );
        } else if (this.editedMessageObj) {
            typeMessage = 'edit'
            let chatReference = this.editedMessageObj.reference

            if(this.editedMessageObj.chatReference){
                chatReference = this.editedMessageObj.chatReference
            }
           
            let message = ""
        try {
            const parsedMessageObj = JSON.parse(this.editedMessageObj.decodedMessage)
            message = parsedMessageObj
            
        } catch (error) {
            message = this.editedMessageObj.decodedMessage
        }
            const messageObject = {
                ...message,
                messageText: trimmedMessage,
                
            }
            const stringifyMessageObject = JSON.stringify(messageObject)
            this.sendMessage(stringifyMessageObject, typeMessage, chatReference);
        } else {
            const messageObject = {
                messageText: trimmedMessage,
                images: [''],
                repliedTo: '',
                version: 1
            }
            const stringifyMessageObject = JSON.stringify(messageObject)
            this.sendMessage(stringifyMessageObject, typeMessage);
        }
    }

    async sendMessage(messageText, typeMessage, chatReference) {
   
        this.isLoading = true;

        let _reference = new Uint8Array(64);
        window.crypto.getRandomValues(_reference);
        let reference = window.parent.Base58.encode(_reference);
        const sendMessageRequest = async () => {
            if (this.isReceipient === true) {
                let chatResponse = await parentEpml.request('chat', {
                    type: 18,
                    nonce: this.selectedAddress.nonce,
                    params: {
                        timestamp: Date.now(),
                        recipient: this._chatId,
                        recipientPublicKey: this._publicKey.key,
                        hasChatReference: typeMessage === 'edit' ? 1 : 0,
                        chatReference: chatReference,
                        message: messageText,
                        lastReference: reference,
                        proofOfWorkNonce: 0,
                        isEncrypted: this._publicKey.hasPubKey === false ? 0 : 1,
                        isText: 1
                    }
                });
         
                _computePow(chatResponse)
            } else {
                let groupResponse = await parentEpml.request('chat', {
                    type: 181,
                    nonce: this.selectedAddress.nonce,
                    params: {
                        timestamp: Date.now(),
                        groupID: Number(this._chatId),
                        hasReceipient: 0,
                        hasChatReference: typeMessage === 'edit' ? 1 : 0,
                        chatReference: chatReference,
                        message: messageText,
                        lastReference: reference,
                        proofOfWorkNonce: 0,
                        isEncrypted: 0, // Set default to not encrypted for groups
                        isText: 1
                    }
                });

                _computePow(groupResponse)
            }
        };

        const _computePow = async (chatBytes) => {
            const difficulty = this.balance === 0 ? 12 : 8;
            const path = window.parent.location.origin + '/memory-pow/memory-pow.wasm.full'
              const worker = new WebWorker();
            let nonce = null
            let chatBytesArray = null
              await new Promise((res, rej) => {
                console.log({chatBytes})
                worker.postMessage({chatBytes, path, difficulty});
            
                worker.onmessage = e => {
                    
                    
                  worker.terminate()
                  chatBytesArray = e.data.chatBytesArray
                    nonce = e.data.nonce
                    res()
                 
                }
              })

            let _response = await parentEpml.request('sign_chat', {
                nonce: this.selectedAddress.nonce,
                chatBytesArray: chatBytesArray,
                chatNonce: nonce
            });
           

            getSendChatResponse(_response);
        };

        const getSendChatResponse = (response) => {
            if (response === true) {
                this.chatEditor.resetValue();
            } else if (response.error) {
                parentEpml.request('showSnackBar', response.message);
            } else {
                let err2string = get("chatpage.cchange21");
                parentEpml.request('showSnackBar', `${err2string}`);
            }

            this.isLoading = false;
            this.chatEditor.enable();
            this.closeEditMessageContainer()
            this.closeRepliedToContainer()
        };

        // Exec..
        sendMessageRequest();
    }

    /**
     * Method to set if the user's location is down in the chat
     * @param { Boolean } isDown 
     */
    setIsUserDown(isDown) {
        this.isUserDown = isDown;
    }

    _downObserverhandler(entries) {

        if (entries[0].isIntersecting) {

            this.setIsUserDown(true)
            this.hideNewMesssageBar()
        } else {

            this.setIsUserDown(false)
        }
    }

    downElementObserver() {
        const downObserver = this.shadowRoot.querySelector('chat-scroller').shadowRoot.getElementById('downObserver');

        const options = {
            root: this.shadowRoot.querySelector('chat-scroller').shadowRoot.getElementById('viewElement'),
            rootMargin: '100px',
            threshold: 1
        }
        const observer = new IntersectionObserver(this._downObserverhandler, options)
        observer.observe(downObserver)
    }

    pasteToTextBox(textarea) {

        // Return focus to the window
        window.focus()

        navigator.clipboard.readText().then(clipboardText => {

            textarea.value += clipboardText
            textarea.focus()
        });
    }

    pasteMenu(event) {

        let eventObject = { pageX: event.pageX, pageY: event.pageY, clientX: event.clientX, clientY: event.clientY }
        parentEpml.request('openFramePasteMenu', eventObject)
    }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }

    

    initChatEditor() {

        const ChatEditor = function (editorConfig) {
            
            const ChatEditor = function () {
                const editor = this;
                editor.init();
            };

            ChatEditor.prototype.getValue = function () {
                const editor = this;

                if (editor.content) {
                    return editor.content.body.innerHTML;
                }
            };

            ChatEditor.prototype.setValue = function (value) {
                const editor = this;

                if (value) {
                    editor.content.body.innerHTML = value;
                    editor.updateMirror();
                }

                editor.focus();
            };

            ChatEditor.prototype.resetValue = function () {
                const editor = this;
                editor.content.body.innerHTML = '';
                editor.updateMirror();
                editor.focus();
            };

            ChatEditor.prototype.styles = function () {
                const editor = this;

                editor.styles = document.createElement('style');
                editor.styles.setAttribute('type', 'text/css');
                editor.styles.innerText = `
                    html {
                        cursor: text;
                    }
                    body {
                        font-size: 1rem;
                        line-height: 1.38rem;
                        font-weight: 400;
                        font-family: "Open Sans", helvetica, sans-serif;
                        padding-right: 3px;
                        text-align: left;
                        white-space: break-spaces;
                        word-break: break-word;
                        outline: none;
                    }
                    body[contentEditable=true]:empty:before {
                        content: attr(data-placeholder);
                        display: block;
                        color: rgb(103, 107, 113);
                        text-overflow: ellipsis;
                        overflow: hidden;
                        user-select: none;
                        white-space: nowrap;
                   }
                   body[contentEditable=false]{
                        background: rgba(0,0,0,0.1);
                   }
                   img.emoji {
                        width: 1.7em;
                        height: 1.5em;
                       margin-bottom: -2px;
                       vertical-align: bottom;
                   }
               `;
                editor.content.head.appendChild(editor.styles);
            };

            ChatEditor.prototype.enable = function () {
                const editor = this;

                editor.content.body.setAttribute('contenteditable', 'true');
                editor.focus();
            };

            ChatEditor.prototype.disable = function () {
                const editor = this;

                editor.content.body.setAttribute('contenteditable', 'false');
            };

            ChatEditor.prototype.state = function () {
                const editor = this;

                return editor.content.body.getAttribute('contenteditable');
            };

            ChatEditor.prototype.focus = function () {
                const editor = this;

                editor.content.body.focus();
            };

            ChatEditor.prototype.clearSelection = function () {
                const editor = this;

                let selection = editor.content.getSelection().toString();
                if (!/^\s*$/.test(selection)) editor.content.getSelection().removeAllRanges();
            };

            ChatEditor.prototype.insertEmoji = function (emojiImg) {
                const editor = this;

                const doInsert = () => {

                    if (editor.content.queryCommandSupported("InsertHTML")) {
                        editor.content.execCommand("insertHTML", false, emojiImg);
                        editor.updateMirror();
                    }
                };

                editor.focus();
                return doInsert();
            };

            ChatEditor.prototype.insertText = function (text) {
                const editor = this;

                const parsedText = editorConfig.emojiPicker.parse(text);
                const doPaste = () => {

                    if (editor.content.queryCommandSupported("InsertHTML")) {
                        editor.content.execCommand("insertHTML", false, parsedText);
                        editor.updateMirror();
                    }
                };

                editor.focus();
                return doPaste();
            };

            ChatEditor.prototype.updateMirror = function () {
                const editor = this;

                const chatInputValue = editor.getValue();
                const filteredValue = chatInputValue.replace(/<img.*?alt=".*?/g, '').replace(/".?src=.*?>/g, '');

                let unescapedValue = editorConfig.unescape(filteredValue);
                editor.mirror.value = unescapedValue;
            };

            ChatEditor.prototype.listenChanges =  function () {
                const editor = this;

                const events = ['drop', 'contextmenu', 'mouseup', 'click', 'touchend', 'keydown', 'blur', 'paste']

                for (let i = 0; i < events.length; i++) {
                    const event = events[i]
                    editor.content.body.addEventListener(event, async function (e) {
                    console.log("hello world12")
                        if (e.type === 'click') {
                            e.preventDefault();
                            e.stopPropagation();
                        }

                        if (e.type === 'paste') {
                            e.preventDefault();
                            const item_list = await navigator.clipboard.read();
                            console.log({item_list})
                            let image_type; // we will feed this later
                            const item = item_list.find( item => // choose the one item holding our image
                                item.types.some( type => { // does this item have our type
                                if (type.startsWith( 'image/')) {
                                    image_type = type; // store which kind of image type it is
                                    return true;
                                }
                            })
                            );
                            const blob = item && await item.getType( image_type );
                            var file = new File([blob], "name", {
                            type: image_type
                            });

                            editorConfig.insertImage(file)
                            navigator.clipboard.readText().then(clipboardText => {
                                let escapedText = editorConfig.escape(clipboardText);
                                editor.insertText(escapedText);
                            }).catch(err => {
                                // Fallback if everything fails...
                                let textData = (e.originalEvent || e).clipboardData.getData('text/plain');
                                editor.insertText(textData);
                            })
                            return false;
                        }

                        if (e.type === 'contextmenu') {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }

                        if (e.type === 'keydown') {
                            console.log("key pressed");
                            console.log(editorConfig.getMessageConfig(), "this is the chat input value");
                            console.log(editorConfig.editableElement.contentDocument.body.scrollHeight, "scroll height")
                            console.log(editorConfig.mirrorElement.clientHeight, "client height")
                            editorConfig.calculateIFrameHeight(editorConfig.editableElement.contentDocument.body.scrollHeight);
                            editorConfig.getMessageSize(editorConfig.editableElement.contentDocument.body.innerHTML);
                             // Handle Enter
                            if (e.keyCode === 13 && !e.shiftKey) {

                                // Update Mirror
                                editor.updateMirror();

                                if (editor.state() === 'false') return false;

                                editorConfig.sendFunc();
                                e.preventDefault();
                                return false;
                            }

                            // Handle Commands with CTR or CMD
                            if (e.ctrlKey || e.metaKey) {
                                switch (e.keyCode) {
                                    case 66:
                                    case 98: e.preventDefault();
                                        return false;
                                    case 73:
                                    case 105: e.preventDefault();
                                        return false;
                                    case 85:
                                    case 117: e.preventDefault();
                                        return false;
                                }

                                return false;
                            }
                        }

                        if (e.type === 'blur') {
                            editor.clearSelection();
                        }

                        if (e.type === 'drop') {
                            e.preventDefault();

                            let droppedText = e.dataTransfer.getData('text/plain')
                            let escapedText = editorConfig.escape(droppedText)

                            editor.insertText(escapedText);
                            return false;
                        }

                        editor.updateMirror();
                    });
                  }

                editor.content.addEventListener('click', function (event) {

                    event.preventDefault();
                    editor.focus();
                });
            };

            ChatEditor.prototype.init = function () {
                const editor = this;

                editor.frame = editorConfig.editableElement;
                editor.mirror = editorConfig.mirrorElement;

                editor.content = (editor.frame.contentDocument || editor.frame.document);
                editor.content.body.setAttribute('contenteditable', 'true');
                editor.content.body.setAttribute('data-placeholder', editorConfig.placeholder);
                editor.content.body.setAttribute('spellcheck', 'false');

                editor.styles();
                editor.listenChanges();
            };


            function doInit() {
                return new ChatEditor();
            }
            return doInit();
        };

        const editorConfig = {
            getMessageConfig: this.getMessageConfig,
            getMessageSize: this.getMessageSize,
            calculateIFrameHeight: this.calculateIFrameHeight,
            mirrorElement: this.mirrorChatInput,
            editableElement: this.chatMessageInput,
            sendFunc: this._sendMessage,
            emojiPicker: this.emojiPicker,
            escape: escape,
            unescape: unescape,
            placeholder: this.chatEditorPlaceholder,
            imageFile: this.imageFile,
            requestUpdate: this.requestUpdate,
            insertImage: this.insertImage,
            chatMessageSize: this.chatMessageSize
        };
        this.chatEditor = new ChatEditor(editorConfig);
    }
}

window.customElements.define('chat-page', ChatPage)
