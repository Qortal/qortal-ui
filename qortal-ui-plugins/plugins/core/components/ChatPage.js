import { LitElement, html, css } from 'lit';
import { render } from 'lit/html.js';
import { Epml } from '../../../epml.js';
import { use, get, translate, registerTranslateConfig } from 'lit-translate';
// import localForage from "localforage";
registerTranslateConfig({
    loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
});
import ShortUniqueId from 'short-unique-id';
import Compressor from 'compressorjs';
import { escape, unescape } from 'html-escaper';
import { inputKeyCodes } from '../../utils/keyCodes.js';
import './ChatScroller.js';
import './LevelFounder.js';
import './NameMenu.js';
import './TimeAgo.js';
import './ChatTextEditor';
import './WrapperModal';
import './ChatSelect.js'
import '@polymer/paper-spinner/paper-spinner-lite.js';
import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-icon';
import { replaceMessagesEdited } from '../../utils/replace-messages-edited.js';
import { publishData } from '../../utils/publish-image.js';
import WebWorker from 'web-worker:./computePowWorker.js';
import WebWorkerImage from 'web-worker:./computePowWorkerImage.js';
import { EmojiPicker } from 'emoji-picker-js';


// const messagesCache = localForage.createInstance({
//     name: "messages-cache",
// });

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
            imageFile: { type: Object },
            isUploadingImage: { type: Boolean },
            chatEditor: { type:  Object },
            chatEditorNewChat: { type: Object },
            userLanguage: { type: String },
            lastMessageRefVisible: { type: Boolean },
            isLoadingOldMessages: {type: Boolean},
            isEditMessageOpen: { type: Boolean },
            webSocket: {attribute: false},
            chatHeads: {type: Array},
            forwardActiveChatHeadUrl: {type: String},
            openForwardOpen: {type: Boolean}
        }
    }

    static get styles() {
        return css`
        html {
            scroll-behavior: smooth;
        }

        .chat-head-container {
            display: flex;
            justify-content: flex-start;
            flex-direction: column;
            height: 50vh;
            overflow-y: auto;
            width: 100%;
        }

        .chat-container {
            display: grid;
            grid-template-rows: minmax(6%, 92vh) minmax(40px, auto);
            max-height: 100%;
        }

        .chat-text-area {
            display: flex;
            position: relative;
            justify-content: center;
            min-height: 60px;
            max-height: 100%;
        }

        .chat-text-area .typing-area {
            display: flex;
            flex-direction: column;
            width: 98%;
            box-sizing: border-box;
            margin-bottom: 8px;
            border: 1px solid var(--chat-bubble-bg);
            border-radius: 10px;
            background: var(--chat-bubble-bg);
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
            padding: 10px 10px 8px 10px;
        }
        
        .repliedTo-subcontainer {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 15px;
            width: 100%;
        }

        .repliedTo-message {
            display: flex;
            flex-direction: column;
            gap: 5px;
            width: 100%;
        }

        .senderName {
            margin: 0;
            color: var(--mdc-theme-primary);
            font-weight: bold;
            user-select: none;
        }

        .original-message {
            color: var(--chat-bubble-msg-color);
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            margin: 0;
            width: 800px;
        }

        .reply-icon {
            width: 20px;
            color: var(--mdc-theme-primary);
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

        .emoji-button-caption {
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

        .caption-container {
            width: 100%;
            display: flex;
            height: auto;
            overflow: hidden;
            justify-content: center;
            background-color: var(--white);
            padding: 5px;
            border-radius: 1px;
        }

        .chatbar-caption {
            font-family: Roboto, sans-serif;
            width: 70%;
            margin-right: 10px;
            outline: none;
            align-items: center;
            font-size: 18px;
            resize: none;
            border-top: 0;
            border-right: 0;
            border-left: 0;
            border-bottom: 1px solid #cac8c8;
            padding: 3px;
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

        .dialogCustom {
            position: fixed;
            z-index: 10000;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            top: 10px;
            right: 20px;
            user-select: none;
        }

        .dialogCustom p {
            color: var(--black)
        }

        .dialogCustomInner {
            min-width: 300px;
            height: 40px;
            background-color: var(--white);
            box-shadow: rgb(119 119 119 / 32%) 0px 4px 12px;
            padding: 10px;
            border-radius: 4px;
        }

        .dialogCustomInner ul {
            padding-left: 0px
        }
        .dialogCustomInner li {
            margin-bottom: 10px;
        }

        .marginLoader {
            margin-right: 8px;
        }

        .smallLoading,
        .smallLoading:after {
            border-radius: 50%;
            width: 2px;
            height: 2px;
        }

        .smallLoading {
            border-width: 0.8em;
            border-style: solid;
            border-color: rgba(3, 169, 244, 0.2) rgba(3, 169, 244, 0.2)
            rgba(3, 169, 244, 0.2) rgb(3, 169, 244);
            font-size: 10px;
            position: relative;
            text-indent: -9999em;
            transform: translateZ(0px);
            animation: 1.1s linear 0s infinite normal none running loadingAnimation;
        }

        @-webkit-keyframes loadingAnimation {
            0% {
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
            }
            100% {
                -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
            }
        }

        @keyframes loadingAnimation {
            0% {
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
            }
            100% {
                -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
            }
        }
        
        /* Add Image Modal Dialog Styling */

        .dialog-container {
            position: relative;
            display: flex;
            align-items: center;
            flex-direction: column;
            padding: 0 10px;
            gap: 10px;
            height: 100%;
        }

        .dialog-container-title {
            color: var(--black);
            font-size: 18px;
        }

        .dialog-container-loader {
            position: relative;
            display: flex;
            align-items: center;
            padding: 0 10px;
            gap: 10px;
            height: 100%;
        }

        .dialog-image {
            width: 100%;
            max-height: 300px;
            border-radius: 0;
            object-fit: contain;
        }

        .last-message-ref {
            position: absolute;
            font-size: 18px;
            top: -40px;
            right: 30px;
            width: 50;
            height: 50;
            z-index: 5;
            color: black;
            background-color: white;
            border-radius: 50%;
            transition: all 0.1s ease-in-out;
	    }

        .last-message-ref:hover {
            cursor: pointer;
            transform: scale(1.1);
        }

        .arrow-down-icon {
            transform: scale(1.15);
        }

        .modal-button-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
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

        .modal-button-red {
            font-family: Roboto, sans-serif;
            font-size: 16px;
            color: #F44336;
            background-color: transparent;
            padding: 8px 10px;
            border-radius: 5px;
            border: none;
            transition: all 0.3s ease-in-out;
            }

        .modal-button-red:hover {
            cursor: pointer;
            background-color: #f4433663;
            }

        .modal-button:hover {
            cursor: pointer;
            background-color: #03a8f475;
        }
        `
    }

    constructor() {
        super()
        this.changeMsgInput = this.changeMsgInput.bind(this)
        this.getOldMessage = this.getOldMessage.bind(this)
        this._sendMessage = this._sendMessage.bind(this)
        this.insertImage = this.insertImage.bind(this)
        this._downObserverhandler = this._downObserverhandler.bind(this)
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
        this.chatEditorPlaceholder = ""
        this.messagesRendered = []
        this.repliedToMessageObj = null
        this.editedMessageObj = null
        this.iframeHeight = 42
        this.imageFile = null
        this.uid = new ShortUniqueId()
        this.userLanguage = ""
        this.lastMessageRefVisible = false
        this.isEditMessageOpen = false
        this.emojiPicker = new EmojiPicker({
            style: "twemoji",
            twemojiBaseUrl: '/emoji/',
            showPreview: false,
            showVariants: false,
            showAnimation: false,
            position: 'top-start',
            boxShadow: 'rgba(4, 4, 5, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.24) 0px 8px 16px 0px'
        });
        this.openForwardOpen = false
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
                        this.renderChatScroller()}
                </div>
                <div class="chat-text-area" style="${`${(this.repliedToMessageObj || this.editedMessageObj) && "min-height: 120px"}`}">
                    <div 
                    class='last-message-ref' 
                    style=${(this.lastMessageRefVisible && !this.imageFile) ? 'opacity: 1;' : 'opacity: 0;'}>
                        <vaadin-icon class='arrow-down-icon' icon='vaadin:arrow-circle-down' slot='icon' @click=${() => {
                            this.shadowRoot.querySelector("chat-scroller").shadowRoot.getElementById("downObserver")
                            .scrollIntoView({
                                behavior: 'smooth',
                            });
                        }}>
                        </vaadin-icon>
                        </div>
                        <div class="typing-area">
                            ${this.repliedToMessageObj && html`
                                <div class="repliedTo-container">
                                    <div class="repliedTo-subcontainer">
                                        <vaadin-icon class="reply-icon" icon="vaadin:reply" slot="icon"></vaadin-icon>
                                        <div class="repliedTo-message">
                                            <p class="senderName">${this.repliedToMessageObj.senderName ? this.repliedToMessageObj.senderName : this.repliedToMessageObj.sender}</p>
                                            <p class="original-message">${this.repliedToMessageObj.message}</p>
                                        </div>
                                        <vaadin-icon
                                            class="close-icon"
                                            icon="vaadin:close-big"
                                            slot="icon"
                                            @click=${() => this.closeRepliedToContainer()}
                                            ></vaadin-icon>
                                    </div>
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
                                        <vaadin-icon
                                            class="close-icon"
                                            icon="vaadin:close-big"
                                            slot="icon"
                                            @click=${() => this.closeEditMessageContainer()}
                                            ></vaadin-icon>
                                    </div>
                                </div>
                            `}
                        <div class="chatbar">
                            <chat-text-editor
                                ?hasGlobalEvents=${true}
                                iframeId="_chatEditorDOM"
                                placeholder=${this.chatEditorPlaceholder}
                                ._sendMessage=${this._sendMessage}
                                .setChatEditor=${(editor)=> this.setChatEditor(editor)}
                                .chatEditor=${this.chatEditor}
                                .imageFile=${this.imageFile}
                                .insertImage=${this.insertImage}
                                .chatMessageInput=${this.chatMessageInput}
                                .editedMessageObj=${this.editedMessageObj}
                                .mirrorChatInput=${this.mirrorChatInput}
                                ?isLoading=${this.isLoading}
                                ?isLoadingMessages=${this.isLoadingMessages}
                                ?isEditMessageOpen=${this.isEditMessageOpen}>                           
                            </chat-text-editor>
                    </div>
                </div>
            </div>
            ${(this.isUploadingImage || this.isDeletingImage) ? html`
					<div class="dialogCustom">
                        <div class="dialogCustomInner">
                            <div class="dialog-container-loader">
                                <div class=${`smallLoading marginLoader`}></div>
                                <p>
                                ${this.isDeletingImage ?
                                    translate("chatpage.cchange31") : translate("chatpage.cchange30")}
                                </p>
                            </div>			
                        </div>                        
			        </div>
            </div>
			`: ''}
                <wrapper-modal 
                .removeImage=${() => {
                    this.chatEditorNewChat.resetValue()
                    this.removeImage()
                } } 
                style=${(this.imageFile && !this.isUploadingImage) ? "display: block" : "display: none"}>
                    <div>
                        <div class="dialog-container">
                            ${this.imageFile && html`
                                <img src=${URL.createObjectURL(this.imageFile)} alt="dialog-img" class="dialog-image" />
                            `}
                            <div class="caption-container">
                                <chat-text-editor
                                    iframeId="newChat"
                                    ?hasGlobalEvents=${false}
                                    placeholder=${this.chatEditorPlaceholder}
                                    ._sendMessage=${this._sendMessage}
                                    .setChatEditor=${(editor)=> this.setChatEditorNewChat(editor)}
                                    .chatEditor=${this.chatEditorNewChat}
                                    .imageFile=${this.imageFile}
                                    .insertImage=${this.insertImage}
                                    .editedMessageObj=${this.editedMessageObj}
                                    ?isLoading=${this.isLoading}
                                    ?isLoadingMessages=${this.isLoadingMessages}
                                    id="chatTextCaption"
                                    >
                                </chat-text-editor>
                            </div>
                            <div class="modal-button-row">
                                <button class="modal-button-red" @click=${() => {
                                this.chatEditorNewChat.resetValue()
                                this.removeImage()
                                }}>
                                    ${translate("chatpage.cchange33")}
                                </button>
                                <button
                                    class="modal-button"
                                    @click=${()=> {
                                        const chatTextEditor = this.shadowRoot.getElementById('chatTextCaption')
                                        chatTextEditor.sendMessageFunc({
                                            type: 'image',
                                            imageFile:  this.imageFile,
                                        })
                                    }}
                                >
                                    ${translate("chatpage.cchange9")}
                                </button>
                            </div>
                        </div>
                </div>    	
            </wrapper-modal>
            <wrapper-modal 
                .removeImage=${() => {
                   this.openForwardOpen = false
                   this.forwardActiveChatHeadUrl = ""
                } } 
                style=${this.openForwardOpen ? "display: block" : "display: none"}>
                    <div>
                        <div class="dialog-container">
                            <div>
                                <p class="dialog-container-title">${translate("blockpage.bcchange16")}</p>
                            </div>
                          <div class="chat-head-container">
                             ${this.chatHeads.map((item)=> {
                                return html`<chat-select activeChatHeadUrl=${this.forwardActiveChatHeadUrl} .setActiveChatHeadUrl=${(val)=> {
                                    this.forwardActiveChatHeadUrl = val
                                }} chatInfo=${JSON.stringify(item)}></chat-select>`
                             })}
                           </div>
                          
                            <div class="modal-button-row">
                                <button class="modal-button-red" @click=${() => {
                                this.openForwardOpen = false
                   this.forwardActiveChatHeadUrl = ""
                                }}>
                                    ${translate("chatpage.cchange33")}
                                </button>
                                <button
                                    ?disabled=${!this.forwardActiveChatHeadUrl}
                                    class="modal-button"
                                    @click=${()=> {
                                       this.sendForwardMessage()
                                    }}
                                >
                                    ${translate("blockpage.bcchange14")}
                                </button>
                            </div>
                        </div>
                </div>    	
            </wrapper-modal>
        </div>
        `
    }

    setForwardProperties(forwardedMessage){
        this.openForwardOpen = true
        this.forwardedMessage = forwardedMessage
    }

   async sendForwardMessage(){
        let parsedMessageObj = {}
        let publicKey = {
            hasPubKey: false,
            key: ''
        }
        try {
             parsedMessageObj = JSON.parse(this.forwardedMessage);
            
        } catch (error) {
            parsedMessageObj = {}
        }

        try {
         const res =   await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/publickey/${this.forwardChatId}`
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
            delete message.reactions
            const stringifyMessageObject = JSON.stringify(message)
            this.sendMessage(stringifyMessageObject, undefined, '', true,  {
                isReceipient: true,
                chatId: 'Qdxha59Cm1Ty4QkKMBWPnKrNigcDCDk6eq',
                publicKey: {
                    hasPubKey: false,
                    key: ''
                }
            })
        } catch (error) {
            console.log({error})
        }
    }

    showLastMessageRefScroller(props) {
        this.lastMessageRefVisible = props;
    }

    setChatEditor(editor) {
        this.chatEditor = editor;
    }

    setChatEditorNewChat(editor) {
        this.chatEditorNewChat = editor;
    }
    
    insertImage(file) {
        if (file.type.includes('image')) {
            this.imageFile = file;
            this.chatEditor.disable();
            // this.changeMsgInput('newChat')
            // this.initChatEditor();
            // this.chatEditor.disable();
            return;
        }       
         parentEpml.request('showSnackBar', get("chatpage.cchange28")); 
    }

    removeImage() {
        this.imageFile = null;
        this.chatEditor.enable();
    }

    changeMsgInput(id) {
  
        this.chatEditor.remove()
        this.chatMessageInput  = this.shadowRoot.getElementById(id);
        this.initChatEditor();
    }

    async initUpdate(){
        if(this.webSocket){
            this.webSocket.close()
            this.webSocket= ''
        }
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
            const isRecipient = this.chatId.includes('direct') === true ? true : false;
            this.chatId.includes('direct') === true ? this.isReceipient = true : this.isReceipient = false;
            this._chatId = this.chatId.split('/')[1];
            const mstring = get("chatpage.cchange8");
            const placeholder = isRecipient === true ? `Message ${this._chatId}` : `${mstring}`;
            this.chatEditorPlaceholder = placeholder;

            isRecipient ? getAddressPublicKey() : this.fetchChatMessages(this._chatId);
            
            // Init ChatEditor
            // this.initChatEditor();
        }, 100)

     
    }

    async firstUpdated() {
        window.addEventListener('storage', () => {                                                
            const checkLanguage = localStorage.getItem('qortalLanguage');
            use(checkLanguage);
            this.userLanguage = checkLanguage;
        })

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

    await this.initUpdate()
    }

    async updated(changedProperties) {
        if (changedProperties && changedProperties.has('userLanguage')) {
            const userLang = changedProperties.get('userLanguage')

            if(userLang){
                await new Promise(r => setTimeout(r, 100));
                this.chatEditorPlaceholder = this.isReceipient === true ? `Message ${this._chatId}` : `${get("chatpage.cchange8")}`;
            }
            
        }
        if (changedProperties && changedProperties.has('chatId') && changedProperties.get('chatId')) {
           await this.initUpdate()
        }
        
    }

   async renderPlaceholder() {
        const getName = async (recipient)=> {
            try {
                const getNames = await parentEpml.request("apiCall", {
					type: "api",
					url: `/names/address/${recipient}`,
				});

                if (Array.isArray(getNames) && getNames.length > 0 ) {
                    return getNames[0].name
                } else {
                    return ''
                }

            } catch (error) {
                return ""
            }
        }
        let userName = ""
        if(this.isReceipient){
             userName = await getName(this._chatId);
        }
        const mstring = get("chatpage.cchange8");
        const placeholder = this.isReceipient === true ? `Message ${userName ? userName : this._chatId}` : `${mstring}`;
        return placeholder;
    }

    renderChatScroller() {
        return html`
        <chat-scroller 
        chatId=${this.chatId}
        .messages=${this.messagesRendered} 
        .escapeHTML=${escape} 
        .getOldMessage=${this.getOldMessage}
        .setRepliedToMessageObj=${(val) => this.setRepliedToMessageObj(val)}
        .setEditedMessageObj=${(val) => this.setEditedMessageObj(val)}
        .focusChatEditor=${() => this.focusChatEditor()}
        .sendMessage=${(val) => this._sendMessage(val)}
        .sendMessageForward=${(messageText, typeMessage, chatReference, isForward, forwardParams)=> this.sendMessage(messageText, typeMessage, chatReference, isForward, forwardParams)}
        .showLastMessageRefScroller=${(val) => this.showLastMessageRefScroller(val)}
        .emojiPicker=${this.emojiPicker} 
        ?isLoadingMessages=${this.isLoadingOldMessages}
        .setIsLoadingMessages=${(val) => this.setIsLoadingMessages(val)}
        .setForwardProperties=${(forwardedMessage)=> this.setForwardProperties(forwardedMessage)}
        >
        </chat-scroller>
        `
    }
    setIsLoadingMessages(val){
        this.isLoadingOldMessages = val
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
            this.isLoadingOldMessages = false
            await this.getUpdateComplete();
            const marginElements = Array.from(this.shadowRoot.querySelector('chat-scroller').shadowRoot.querySelectorAll('message-template'));

            const findElement = marginElements.find((item)=> item.messageObj.reference === scrollElement.messageObj.reference)
          
            if(findElement){
                findElement.scrollIntoView({ behavior: 'auto', block: 'center' });
            }
           
        
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
            this.isLoadingOldMessages = false
            await this.getUpdateComplete();
            const marginElements = Array.from(this.shadowRoot.querySelector('chat-scroller').shadowRoot.querySelectorAll('message-template'));
            const findElement = marginElements.find((item)=> item.messageObj.reference === scrollElement.messageObj.reference)
            
            if(findElement){
                findElement.scrollIntoView({ behavior: 'auto', block: 'center' });
            }
         

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
            this.chatEditorPlaceholder = await this.renderPlaceholder();
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
            this.messagesRendered = this._messages;
            this.isLoadingMessages = false;
            setTimeout(() => this.downElementObserver(), 500);
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
        this.isEditMessageOpen = !this.isEditMessageOpen;
        this.chatEditor.resetValue();
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
        let isReceipientVar;
        let _publicKeyVar;
        try {
            isReceipientVar =  this.isReceipient === undefined ? isReceipient : this.isReceipient;
            _publicKeyVar = this._publicKey === undefined ? _publicKey : this._publicKey;
        } catch (error) {
            isReceipientVar = isReceipient;
            _publicKeyVar = _publicKey;
        }
        
        let decodedMessageObj = {};

        if (isReceipientVar === true) {
            // direct chat
            if (encodedMessageObj.isEncrypted === true && _publicKeyVar.hasPubKey === true && encodedMessageObj.data) {
                let decodedMessage = window.parent.decryptChatMessage(encodedMessageObj.data, window.parent.reduxStore.getState().app.selectedAddress.keyPair.privateKey, _publicKeyVar.key, encodedMessageObj.reference);
                decodedMessageObj = { ...encodedMessageObj, decodedMessage };
            } else if (encodedMessageObj.isEncrypted === false && encodedMessageObj.data) {
                let bytesArray = window.parent.Base58.decode(encodedMessageObj.data);
                let decodedMessage = new TextDecoder('utf-8').decode(bytesArray);
                decodedMessageObj = { ...encodedMessageObj, decodedMessage };
            } else {
                decodedMessageObj = { ...encodedMessageObj, decodedMessage: "Cannot Decrypt Message!" };
            }

        } else {
            // group chat
            let bytesArray = window.parent.Base58.decode(encodedMessageObj.data);
            let decodedMessage = new TextDecoder('utf-8').decode(bytesArray);
            decodedMessageObj = { ...encodedMessageObj, decodedMessage };
        }

        return decodedMessageObj;
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

            this.webSocket  = new WebSocket(directSocketLink);

            // Open Connection
            this.webSocket.onopen = () => {

                setTimeout(pingDirectSocket, 50)
            }

            // Message Event
            this.webSocket.onmessage = async (e) => {
                if (initial === 0) {
                    const isReceipient = this.chatId.includes('direct')

                    // commented out code= localstorage persistance
                    // const chatReference1 = isReceipient ? 'direct' : 'group';
                    // const chatReference2 = this.chatId.split('/')[1];
                    // const cachedData = await messagesCache.getItem(`${chatReference1}-${chatReference2}`);
                    const cachedData = null
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
            this.webSocket.onclose = () => {
                clearTimeout(directSocketTimeout)
            }

            // Error Event
            this.webSocket.onerror = (e) => {
                clearTimeout(directSocketTimeout)
            }

            const pingDirectSocket = () => {
                this.webSocket.send('ping')

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

            this.webSocket = new WebSocket(groupSocketLink);

            // Open Connection
            this.webSocket.onopen = () => {

                setTimeout(pingGroupSocket, 50)
            }

            // Message Event
            this.webSocket.onmessage = async (e) => {

                if (initial === 0) {
                    const isGroup = this.chatId.includes('group')
                    const chatReference1 = isGroup ? 'group' : 'direct';
                    const chatReference2 = this.chatId.split('/')[1];

                    // const cachedData = await messagesCache.getItem(`${chatReference1}-${chatReference2}`);
                    const cachedData = null;
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
            this.webSocket.onclose = () => {
                clearTimeout(groupSocketTimeout)
            }

            // Error Event
            this.webSocket.onerror = (e) => {
                clearTimeout(groupSocketTimeout)
            }

            const pingGroupSocket = () => {
                this.webSocket.send('ping')

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
        this.chatEditorNewChat.disable()
        const messageText = this.chatEditor.mirror.value;
        // Format and Sanitize Message
        const sanitizedMessage = messageText.replace(/&nbsp;/gi, ' ').replace(/<br\s*[\/]?>/gi, '\n');
        const trimmedMessage = sanitizedMessage.trim();
        
        const getName = async (recipient)=> {
            try {
                const getNames = await parentEpml.request("apiCall", {
					type: "api",
					url: `/names/address/${recipient}`,
				});

                if (Array.isArray(getNames) && getNames.length > 0 ) {
                    return getNames[0].name
                } else {
                    return ''
                }

            } catch (error) {
                return ""
            }
        }

        if (outSideMsg && outSideMsg.type === 'delete') {
            this.isDeletingImage = true
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
            await new Promise(resolve => {
                new Compressor(blob, {
                    quality: 0.6,
                    maxWidth: 500,
                    success(result) {
                        const file = new File([result], "name", {
                            type: 'image/png'
                        });
                       
                        compressedFile = file;
                        resolve();
                    },
                    error(err) {
                        console.log(err.message);
                      },
                })
            })
            try {
                await publishData({
                    registeredName: userName,
                    file : compressedFile,
                    service: 'QCHAT_IMAGE',
                    identifier: identifier,
                    parentEpml,
                    metaData: undefined,
                    uploadType: 'file',
                    selectedAddress: this.selectedAddress,
                    worker: new WebWorkerImage()
                   })
                   this.isDeletingImage = false
            } catch (error) {
                console.error(error)
                this.isLoading = false;
                this.chatEditor.enable();
                this.chatEditorNewChat.enable()
                return
            }
                typeMessage = 'edit';
                let chatReference = outSideMsg.editedMessageObj.reference;

            if(outSideMsg.editedMessageObj.chatReference){
                chatReference = outSideMsg.editedMessageObj.chatReference;
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
            this.isUploadingImage = true;
            const userName = await getName(this.selectedAddress.address);
            if (!userName) {
                parentEpml.request('showSnackBar', get("chatpage.cchange27"));
                this.isLoading = false;
                this.chatEditor.enable();
                this.chatEditorNewChat.enable()
                return;
            }
            const image = this.imageFile
            const id = this.uid();
            const identifier = `qchat_${id}`;
            let compressedFile = '';
            await new Promise(resolve => {
                new Compressor( image, {
                    quality: .6,
                    maxWidth: 500,
                    success(result){
                        const file = new File([result], "name", {
                            type: image.type
                        });
                        compressedFile = file
                        resolve()
                    },
                    error(err) {
                        console.log(err.message);
                      },
                })
            })
            const fileSize = compressedFile.size;
            if (fileSize > 500000) {
                parentEpml.request('showSnackBar', get("chatpage.cchange26"));
                this.isLoading = false;
                this.isUploadingImage = false;
                this.chatEditor.enable();
                this.chatEditorNewChat.enable();
                return;
            }
                try {
                    await publishData({
                        registeredName: userName,
                        file : compressedFile,
                        service: 'QCHAT_IMAGE',
                        identifier : identifier,
                        parentEpml,
                        metaData: undefined,
                        uploadType: 'file',
                        selectedAddress: this.selectedAddress,
                        worker: new WebWorkerImage()
                    });
                this.isUploadingImage = false;
                this.imageFile = null;
                } catch (error) {
                    console.error(error)
                    this.isLoading = false;
                    this.isUploadingImage = false;
                    this.chatEditor.enable();
                    this.chatEditorNewChat.enable();
                    return;
                }
                const messageTextWithImage = this.chatEditorNewChat.mirror.value;
                // Format and Sanitize Message
                const sanitizedMessageWithImage = messageTextWithImage.replace(/&nbsp;/gi, ' ').replace(/<br\s*[\/]?>/gi, '\n');
                const trimmedMessageWithImage = sanitizedMessageWithImage.trim();
                const messageObject = {
                    messageText: trimmedMessageWithImage,
                    images: [{
                            service: "QCHAT_IMAGE",
                            name: userName,
                            identifier: identifier
                    }],
                    isImageDeleted: false,
                    repliedTo: '',
                    version: 1
                };
                const stringifyMessageObject = JSON.stringify(messageObject);
                this.sendMessage(stringifyMessageObject, typeMessage);
        }  else if (outSideMsg && outSideMsg.type === 'reaction') {
            typeMessage = 'edit';
            let chatReference = outSideMsg.editedMessageObj.reference;

            if (outSideMsg.editedMessageObj.chatReference) {
                chatReference = outSideMsg.editedMessageObj.chatReference;
            }
           
            let message = "";

        try {
            const parsedMessageObj = JSON.parse(outSideMsg.editedMessageObj.decodedMessage);
            message = parsedMessageObj;
            
        } catch (error) {
            message = outSideMsg.editedMessageObj.decodedMessage;
        }   

            let reactions = message.reactions || []
            const findEmojiIndex = reactions.findIndex((reaction)=> reaction.type === outSideMsg.reaction)
            if(findEmojiIndex !== -1){
                let users =  reactions[findEmojiIndex].users || []
                const findUserIndex = users.findIndex((user)=> user === this.selectedAddress.address )
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
            this.chatEditorNewChat.enable()
        } 
        else if (this.repliedToMessageObj) {
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

    async sendMessage(messageText, typeMessage, chatReference, isForward, forwardParams) {
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

        const sendForwardRequest = async () => {
            const { publicKey } = forwardParams

            const isRecipient = this.forwardActiveChatHeadUrl.includes('direct') === true ? true : false;
            
            const chatId = this.forwardActiveChatHeadUrl.split('/')[1];
            this.openForwardOpen = false
            if (isRecipient === true) {
                let chatResponse = await parentEpml.request('chat', {
                    type: 18,
                    nonce: this.selectedAddress.nonce,
                    params: {
                        timestamp: Date.now(),
                        recipient: chatId,
                        recipientPublicKey: publicKey.key,
                        hasChatReference:  0,
                        chatReference: "",
                        message: messageText,
                        lastReference: reference,
                        proofOfWorkNonce: 0,
                        isEncrypted: publicKey.hasPubKey === false ? 0 : 1,
                        isText: 1
                    }
                });
         
                _computePow(chatResponse, true)
            } else {
                let groupResponse = await parentEpml.request('chat', {
                    type: 181,
                    nonce: this.selectedAddress.nonce,
                    params: {
                        timestamp: Date.now(),
                        groupID: Number(chatId),
                        hasReceipient: 0,
                        hasChatReference: 0,
                        chatReference: chatReference,
                        message: messageText,
                        lastReference: reference,
                        proofOfWorkNonce: 0,
                        isEncrypted: 0, // Set default to not encrypted for groups
                        isText: 1
                    }
                });

                _computePow(groupResponse, true)
            }
        };

        const _computePow = async (chatBytes, isForward) => {
            const difficulty = this.balance === 0 ? 12 : 8;
            const path = window.parent.location.origin + '/memory-pow/memory-pow.wasm.full'
              const worker = new WebWorker();
            let nonce = null
            let chatBytesArray = null
              await new Promise((res, rej) => {
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
           

            getSendChatResponse(_response, isForward);
        };

        const getSendChatResponse = (response, isForward) => {
            if (response === true) {
                this.chatEditor.resetValue();
                this.chatEditorNewChat.resetValue()
                if(isForward){
                    let successString = get("blockpage.bcchange15");
                    parentEpml.request('showSnackBar', `${successString}`);
                }
            } else if (response.error) {
                parentEpml.request('showSnackBar', response.message);
            } else {
                let err2string = get("chatpage.cchange21");
                parentEpml.request('showSnackBar', `${err2string}`);
            }

            this.isLoading = false;
            this.chatEditor.enable();
            this.chatEditorNewChat.enable()
            this.closeEditMessageContainer()
            this.closeRepliedToContainer()
            this.openForwardOpen = false
            this.forwardActiveChatHeadUrl = ""
        };

        if(isForward){
            sendForwardRequest();
            return
        }
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
}

window.customElements.define('chat-page', ChatPage)
