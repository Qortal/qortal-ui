import { LitElement, html, css } from 'lit';
import {animate} from '@lit-labs/motion';
import { Epml } from '../../../epml.js';
import { use, get, translate, registerTranslateConfig } from 'lit-translate';
import { generateHTML } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import { Editor, Extension } from '@tiptap/core'

// import localForage from "localforage";
registerTranslateConfig({
    loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
});
import ShortUniqueId from 'short-unique-id';
import Compressor from 'compressorjs';
import { escape } from 'html-escaper';
import { inputKeyCodes } from '../../utils/keyCodes.js';
import './ChatScroller.js';
import './LevelFounder.js';
import './NameMenu.js';
import './TimeAgo.js';
import './ChatTextEditor.js';
import './WrapperModal.js';
import './TipUser'
import './ChatSelect.js'
import './ChatSideNavHeads.js'
import './ChatLeaveGroup.js'
import './ChatGroupSettings.js'
import './ChatRightPanel.js'
import './ChatSeachResults.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-icon';
import { replaceMessagesEdited } from '../../utils/replace-messages-edited.js';
import { publishData } from '../../utils/publish-image.js';
import { EmojiPicker } from 'emoji-picker-js';
import WebWorker from 'web-worker:./computePowWorker.js';
import WebWorkerImage from 'web-worker:./computePowWorkerImage.js';
import '@polymer/paper-dialog/paper-dialog.js'

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
            showNewMessageBar: { attribute: false },
            hideNewMessageBar: { attribute: false },
            setOpenPrivateMessage: { attribute: false },
            chatEditorPlaceholder: { type: String },
            messagesRendered: { type: Array },
            repliedToMessageObj: { type: Object },
            editedMessageObj: { type: Object },
            iframeHeight: { type: Number },
            imageFile: { type: Object },
            isUploadingImage: { type: Boolean },
            userLanguage: { type: String },
            lastMessageRefVisible: { type: Boolean },
            isLoadingOldMessages: { type: Boolean },
            isEditMessageOpen: { type: Boolean },
            webSocket: { attribute: false },
            chatHeads: { type: Array },
            forwardActiveChatHeadUrl: { type: Object },
            openForwardOpen: {type: Boolean },
            groupAdmin: {type: Array},
            groupMembers: {type: Array},
            shifted: {type: Boolean},
            groupInfo: {type: Object},
            setActiveChatHeadUrl: {attribute: false},
            userFound: { type: Array },
            userFoundModalOpen: { type: Boolean },
            webWorker: { type: Object },
            webWorkerImage: { type: Object },
            myTrimmedMeassage: { type: String },
            editor: {type: Object},
            currentEditor: {type: String},
            isEnabledChatEnter: {type: Boolean},
            openTipUser: { type: Boolean },
            openUserInfo: { type: Boolean },
            selectedHead: { type: Object },
            userName: { type: String },
            goToRepliedMessage: {attribute: false}
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
        overflow-x: hidden;
        width: 100%;
    }

    .repliedTo-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 10px 10px 8px 10px;
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

  .chat-container {
      display: grid;
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
      word-break: break-all;
      text-overflow: ellipsis;
    overflow: hidden;
    max-height: 60px;
  }
  .repliedTo-message p {
    margin: 0px;
    padding: 0px;
  }

  .repliedTo-message pre {
    white-space: pre-wrap;
  }

  .repliedTo-message p mark {
	background-color: #ffe066;
    border-radius: 0.25em;
    box-decoration-break: clone;
    padding: 0.125em 0;
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
  
  .chatbar-container {
      width: 100%;
      display: flex;
      height: auto;
      overflow: hidden;
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

  paper-dialog.warning {
            width: 50%;
            max-width: 50vw;
            height: 30%;
            max-height: 30vh;
            text-align: center;
            background-color: var(--white);
            color: var(--black);
            border: 1px solid var(--black);
            border-radius: 15px;
            line-height: 1.6;
            overflow-y: auto;
        }
        .buttons {
            text-align:right;
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
      font-family: Montserrat;
      color: var(--black);
      font-size: 20px;
      margin: 15px 0 0 0;
  }
  
  .divider {
    height: 1px;
    background-color: var(--chat-bubble-msg-color);
    user-select: none;
    width: 70%;
    margin-bottom: 20px;
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

    .chat-right-panel {
        flex: 0;
        border-left: 3px solid rgb(221, 221, 221);
        height: 100%;
        overflow-y: auto;
        background: transparent;
    }

    .movedin {
        flex: 1 !important;
        background: transparent;
    }

    .main-container {
        display: flex;
        height: 100%;
    }

    .group-nav-container {
        display: flex;
        height: 40px; 
        padding: 25px 5px 25px 20px; 
        margin: 0px;
        background-color: var(--chat-bubble-bg); 
        box-sizing: border-box; 
        align-items: center;
        justify-content: space-between;
        box-shadow: var(--group-drop-shadow);
    }

    .top-bar-icon {
        border-radius: 50%;
        color: var(--chat-bubble-msg-color);
        transition: 0.3s all ease-in-out;
        padding: 5px;
        background-color: transparent;
    }

    .top-bar-icon:hover {
        background-color: #e6e6e69b;
        cursor: pointer;
        color: var(--black)
    }

    .group-name {
        font-family: Raleway, sans-serif;
        font-size: 16px;
        color: var(--black);
        margin:0px;
        padding:0px;
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

  .name-input {
      width: 100%;
      margin-bottom: 15px;
      outline: 0;
      border-width: 0 0 2px;
      border-color: var(--mdc-theme-primary);
      background-color: transparent;
      padding: 10px;
      font-family: Roboto, sans-serif;
      font-size: 15px;
      color: var(--chat-bubble-msg-color);
      box-sizing: border-box;
  }

  .name-input::selection {
      background-color: var(--mdc-theme-primary);
      color: white;   
  }

  .name-input::placeholder {
      opacity: 0.9;
      color: var(--black);
  }

  .search-results-div {
    position: absolute;
    top: 25px;
    right: 25px;
  }

  .search-field {
      width: 100%;
      position: relative;
      margin-bottom: 5px;
  }

  .search-icon {
      position: absolute;
      right: 3px;
      top: 0;
      color: var(--chat-bubble-msg-color);
      transition: all 0.3s ease-in-out;
      background: none;
      border-radius: 50%;
      padding: 6px 3px;
      font-size: 21px;
  }

  .search-icon:hover {
    cursor: pointer;
    background: #d7d7d75c;
  }

  .user-verified {
    position: absolute;
    top: 0;
    right: 5px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #04aa2e;
    font-size: 13px;
  }
  
  .user-selected {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    padding: 18px 20px;
    color: var(--chat-bubble-msg-color);
    border-radius: 5px;
    background-color: #ececec96;
  }

  .user-selected-name {
    font-family: Roboto, sans-serif;
    margin: 0;
    font-size: 16px;
  }

  .forwarding-container {
    display: flex;
    gap: 15px;
  }

  .user-selected-forwarding {
    font-family: Livvic, sans-serif;
    margin: 0;
    font-size: 16px;
  }

  .close-forwarding {
      color: #676b71;
      width: 14px;
      transition: all 0.1s ease-in-out;
  }

  .close-forwarding:hover {
      cursor: pointer;
      color: #4e5054;
  }
`
}

    constructor() {
        super()
        this.getOldMessage = this.getOldMessage.bind(this)
        this._sendMessage = this._sendMessage.bind(this)
        this.insertImage = this.insertImage.bind(this)
        this.toggleEnableChatEnter = this.toggleEnableChatEnter.bind(this)
        this._downObserverhandler = this._downObserverhandler.bind(this)
        this.setOpenTipUser = this.setOpenTipUser.bind(this)
        this.setOpenUserInfo = this.setOpenUserInfo.bind(this)
        this.setUserName = this.setUserName.bind(this)
        this.setSelectedHead = this.setSelectedHead.bind(this)
        this.selectedAddress = {}
        this.userName = ""
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
        this.groupAdmin = []
        this.groupMembers = []
        this.shifted = false
        this.groupInfo = {}
        this.pageNumber = 1
        this.userFoundModalOpen = false
        this.userFound = []
        this.forwardActiveChatHeadUrl = {
            url: "",
            name: "",
            selected: false
        }
        this.webWorker = null;
        this.webWorkerImage = null;
        this.currentEditor = '_chatEditorDOM'
        this.initialChat = this.initialChat.bind(this)
        this.isEnabledChatEnter = true
    }

    _toggle(value) {
        this.shifted = value === (false || true) ? value : !this.shifted;
        this.requestUpdate()
      }

    setOpenTipUser(props) {
        this.openTipUser = props;
    }

    setOpenUserInfo(props) {
        this.openUserInfo = props;
    }

    setUserName(props) {
        this.userName = props.senderName ? props.senderName : props.sender;
        this.setSelectedHead(props);
    }

    setSelectedHead(props) {
        this.selectedHead = {
            ...this.selectedHead,
            address: props.sender,
            name: props.senderName,
            };
        }

    toggleEnableChatEnter(){
        localStorage.setItem('isEnabledChatEnter', !this.isEnabledChatEnter ) 
        this.isEnabledChatEnter = !this.isEnabledChatEnter
    }
    
    render() {
        return html`
            <div class="main-container">
            <div 
            class="chat-container" 
            style=${(!this.isReceipient && +this._chatId !== 0) ? "grid-template-rows: minmax(40px, auto) minmax(6%, 92vh) minmax(40px, auto); flex: 3;" : "grid-template-rows: minmax(6%, 92vh) minmax(40px, auto); flex: 2;"}>
                ${(!this.isReceipient && +this._chatId !== 0) ? 
                html`
                <div class="group-nav-container">
                    <div @click=${this._toggle} style="height: 100%; display: flex; align-items: center;flex-grow: 1; cursor: pointer; cursor: pointer; user-select: none">
                        <p class="group-name">${this.groupInfo && this.groupInfo.groupName}</p>
                    </div>
                    <div style="display: flex; height: 100%; align-items: center">
                        <vaadin-icon class="top-bar-icon" @click=${this._toggle} style="margin: 0px 10px" icon="vaadin:info" slot="icon"></vaadin-icon>
                    </div>
                </div>
                ` : null}
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
                                            ${this.repliedToMessageObj.version.toString() === '1' ? html`
                                            ${this.repliedToMessageObj.message}
                                            ` : ''}
                                            ${this.repliedToMessageObj.version.toString() === '2' 
                                            ? html`
                                                ${unsafeHTML(generateHTML(this.repliedToMessageObj.message, 
                                                [
                                                    StarterKit,
                                                    Underline,
                                                    Highlight
                                                    // other extensions …
                                                ]))}
                                            ` 
                                            : ''}
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
                                                ${unsafeHTML(generateHTML(this.editedMessageObj.message, 
                                                [
                                                    StarterKit,
                                                    Underline,
                                                    Highlight
                                                    // other extensions …
                                                ]))}
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
                                .imageFile=${this.imageFile}
                                .insertImage=${this.insertImage}
                                .editedMessageObj=${this.editedMessageObj}
                                ?isLoading=${this.isLoading}
                                ?isLoadingMessages=${this.isLoadingMessages}
                                ?isEditMessageOpen=${this.isEditMessageOpen}
                                .editor=${this.editor}
                                .updatePlaceholder=${(editor, value)=> this.updatePlaceholder(editor, value)}
                                id="_chatEditorDOM"
                                .repliedToMessageObj=${this.repliedToMessageObj}
                                .toggleEnableChatEnter=${this.toggleEnableChatEnter}
                                ?isEnabledChatEnter=${this.isEnabledChatEnter}
                                chatId=${this.chatId}
                                >                           
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
                .onClickFunc=${() => {
                    this.removeImage();
                }} 
                style=${(this.imageFile && !this.isUploadingImage) ? "visibility:visible;z-index:50" : "visibility: hidden;z-index:-100"}>
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
                                    .imageFile=${this.imageFile}
                                    .insertImage=${this.insertImage}
                                    .editedMessageObj=${this.editedMessageObj}
                                    ?isLoading=${this.isLoading}
                                    ?isLoadingMessages=${this.isLoadingMessages}
                                    id="chatTextCaption"
                                    .editor=${this.editorImage}
                                    .updatePlaceholder=${(editor, value)=> this.updatePlaceholder(editor, value)}
                                    >
                                </chat-text-editor>
                            </div>
                            <div class="modal-button-row">
                                <button class="modal-button-red" @click=${() => {
                                
                                this.removeImage();
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
            <paper-dialog class="warning" id="confirmDialog" modal>
                <h2 style="color: var(--black);">${translate("chatpage.cchange41")}</h2>
                <hr>
                <br>
                <h3 style="color: var(--black);">${translate("chatpage.cchange42")}</h3>
                <div class="buttons">
                    <mwc-button @click=${() => this.sendMessage(this.myTrimmedMeassage)} dialog-confirm>${translate("transpage.tchange3")}</mwc-button>
                </div>
            </paper-dialog>
            <wrapper-modal 
                .onClickFunc=${() => {
                   this.openForwardOpen = false;
                   this.forwardActiveChatHeadUrl = {};
                   this.requestUpdate();
                } } 
                style=${this.openForwardOpen ? "display: block" : "display: none"}>
                    <div>
                        <div class="dialog-container">
                            <div>
                                <p class="dialog-container-title">${translate("blockpage.bcchange16")}</p>
                            </div>
                            <div class="divider"></div>
                          <div class="chat-head-container">
                            <div class="search-field">
                                <input 
                                    type="text"
                                    class="name-input" 
                                    id="sendTo" 
                                    placeholder="${translate("chatpage.cchange7")}" 
                                    @keydown=${() => {
                                        if (this.forwardActiveChatHeadUrl.selected) {
                                            this.forwardActiveChatHeadUrl = {};
                                            this.requestUpdate();
                                            } 
                                        }
                                    }
                                />
                                ${this.forwardActiveChatHeadUrl.selected ? (
                                    html`
                                    <div class="user-verified">
                                        <p >${translate("chatpage.cchange38")}</p>
                                        <vaadin-icon icon="vaadin:check-circle-o" slot="icon"></vaadin-icon>
                                    </div>
                                    `
                                ) : (
                                    html`              
                                    <vaadin-icon 
                                        @click=${this.userSearch}
                                        slot="icon" 
                                        icon="vaadin:open-book"
                                        class="search-icon">
                                    </vaadin-icon>
                                    `
                                )}
                            </div>  
                            ${this.forwardActiveChatHeadUrl.selected ? (
                             html`
                                <div class="user-selected">
                                    <p class="user-selected-name">
                                        ${this.forwardActiveChatHeadUrl.name}
                                    </p>
                                    <div class="forwarding-container">
                                        <p class="user-selected-forwarding">
                                            Forwarding...
                                        </p>
                                        <vaadin-icon  
                                        class="close-forwarding"
                                        icon="vaadin:close-big"
                                        slot="icon"
                                        @click=${() => {
                                            this.userFound = [];
                                            this.forwardActiveChatHeadUrl = {};
                                            this.requestUpdate();
                                            this.shadowRoot.getElementById("sendTo").value = "";
                                            }}>
                                        </vaadin-icon>
                                    </div>
                                </div>
                                `
                            ) : ( 
                            html`
                            ${this.chatHeads.map((item) => {
                                return html`
                                <chat-select 
                                    activeChatHeadUrl=${this.forwardActiveChatHeadUrl.url} 
                                    .setActiveChatHeadUrl=${(val)=> {
                                        this.forwardActiveChatHeadUrl = {
                                            ...this.forwardActiveChatHeadUrl,
                                                url: val
                                        };
                                        this.userFound = [];
                                    }} 
                                    chatInfo=${JSON.stringify(item)}>
                                </chat-select>`
                            })}
                            `
                            )}
                        </div>
                          
                            <div class="modal-button-row">
                                <button class="modal-button-red" @click=${() => {
                                    this.openForwardOpen = false;
                                    this.forwardActiveChatHeadUrl = {};
                                    this.requestUpdate();
                                }}>
                                    ${translate("chatpage.cchange33")}
                                </button>
                                <button
                                    class="modal-button"
                                    @click=${()=> {
                                       this.sendForwardMessage()
                                    }}
                                >
                                    ${translate("blockpage.bcchange14")}
                                </button>
                            </div>
                        </div>
                        <div class="search-results-div">
                            <chat-search-results 
                                .onClickFunc=${(result) => {
                                    this.forwardActiveChatHeadUrl = {
                                        ...this.forwardActiveChatHeadUrl,
                                        url: `direct/${result.owner}`,
                                        name: result.name,
                                        selected: true
                                    };
                                    this.userFound = [];
                                    this.userFoundModalOpen = false;
                                }}
                                .closeFunc=${() => {
                                    this.userFoundModalOpen = false;
                                    this.userFound = [];
                                }}
                                .searchResults=${this.userFound}
                                ?isOpen=${this.userFoundModalOpen}
                                ?loading=${this.isLoading}>
                            </chat-search-results>
                        </div>
                    </div>    	
            </wrapper-modal>
            <wrapper-modal
                .onClickFunc=${() => {
                    this.setOpenTipUser(false);
                }}
                zIndex=${55}
                style=${this.openTipUser ? "display: block;" : "display: none;"}>
                <tip-user
                    .closeTipUser=${!this.openTipUser}
                    .userName=${this.userName}
                    .setOpenTipUser=${(val) => this.setOpenTipUser(val)}>
                </tip-user>
            </wrapper-modal>
            <wrapper-modal 
            .onClickFunc=${() => {
                this.setOpenUserInfo(false);
                this.setUserName("");
                this.setSelectedHead({});
            }} 
            style=${
                this.openUserInfo ? "display: block" : "display: none"
            }>
                <user-info
                    .setOpenUserInfo=${(val) => this.setOpenUserInfo(val)}
                    .setOpenTipUser=${(val) => this.setOpenTipUser(val)}
                    .setOpenPrivateMessage=${(val) => this.setOpenPrivateMessage(val)}
                    .userName=${this.userName}
                    .selectedHead=${this.selectedHead} 
                ></user-info>
            </wrapper-modal>
        </div>
        <div class="chat-right-panel ${this.shifted ? "movedin" : "movedout"}"   ${animate()}>
            <chat-right-panel 
            .getMoreMembers=${(val)=> this.getMoreMembers(val)} 
            .toggle=${(val)=> this._toggle(val)} 
            .selectedAddress=${this.selectedAddress} 
            .groupMembers=${this.groupMembers} 
            .groupAdmin=${this.groupAdmin} 
            .leaveGroupObj=${this.groupInfo}
            .setOpenPrivateMessage=${(val) => this.setOpenPrivateMessage(val)}
            .setOpenTipUser=${(val) => this.setOpenTipUser(val)}
            .setOpenUserInfo=${(val) => this.setOpenUserInfo(val)}
            .setUserName=${(val) => this.setUserName(val)}
            >
            </chat-right-panel>
        </div>
    </div>
    `
    }

    async getMoreMembers(groupId){
        try {
            const getMembers = await parentEpml.request("apiCall", {
                type: "api",
                url: `/groups/members/${groupId}?onlyAdmins=false&limit=20&offset=${this.pageNumber * 20}`,
            });
        
            const getMembersWithName = (getMembers.members || []).map(async (member) => {
                let memberItem = member
                try {
                  const name =  await this.getName(member.member)
                   memberItem = {
                    address: member.member,
                    name: name ? name : undefined
                  }
                } catch (error) {
                }
        
                return memberItem
            })
            const membersWithName = await Promise.all(getMembersWithName)
            this.groupMembers = membersWithName
            this.pageNumber = this.pageNumber + 1
        } catch (error) {
        }
    }



  async  connectedCallback() {
        super.connectedCallback();
        await this.initUpdate()
        this.webWorker = new WebWorker();
        this.webWorkerImage = new WebWorkerImage();
        await this.getUpdateCompleteTextEditor();

        const elementChatId = this.shadowRoot.getElementById('_chatEditorDOM').shadowRoot.getElementById('_chatEditorDOM')
        const elementChatImageId = this.shadowRoot.getElementById('chatTextCaption').shadowRoot.getElementById('newChat')
        this.editor = new Editor({
              onUpdate: ()=> {
                this.shadowRoot.getElementById('_chatEditorDOM').getMessageSize(this.editor.getJSON())
              },
          
            element: elementChatId,
            extensions: [
              StarterKit,
              Underline,
              Highlight,
              Placeholder.configure({
                placeholder: 'Write something …',
              }),
              Extension.create({
                name: 'shortcuts',
                addKeyboardShortcuts:()=> {
                  return {
                    'Enter': ()=> {
                        if(this.isEnabledChatEnter){
                            const chatTextEditor = this.shadowRoot.getElementById('_chatEditorDOM')
                            chatTextEditor.sendMessageFunc({
                            })
                          return true
                        }
                   
                    },
                    "Shift-Enter": () => {
                        if(this.isEnabledChatEnter){
                            this.editor.commands.first(() => [
                                this.editor.commands.newlineInCode()
                            ])
                        }
                       
                    }
                    
              
                  }
                }})
            ]
          })
         
          this.editorImage = new Editor({
            onUpdate: ()=> {
                this.shadowRoot.getElementById('chatTextCaption').getMessageSize(this.editorImage.getJSON())
              },
            element: elementChatImageId,
            extensions: [
              StarterKit,
              Underline,
              Highlight,
              Placeholder.configure({
                placeholder: 'Write something …',
              }),
              Extension.create({
                addKeyboardShortcuts:()=> {
                  return {
                    'Enter':()=> {
                        const chatTextEditor = this.shadowRoot.getElementById('chatTextCaption')
                        chatTextEditor.sendMessageFunc({
                            type: 'image',
                            imageFile:  this.imageFile,
                        })
                      return true
                    }
                  }
                }})
            ]
          })
          document.addEventListener('keydown', this.initialChat);
      }

    disconnectedCallback() {
        super.disconnectedCallback();
        if(this.webSocket){
            this.webSocket.close(1000, 'switch chat')
            this.webSocket= ''
        }
        this.webWorker.terminate();
        this.webWorkerImage.terminate();
        this.editor.destroy()
        this.editorImage.destroy()
        document.removeEventListener('keydown', this.initialChat);
      }

      initialChat(e) {
        if (this.editor && !this.editor.isFocused && this.currentEditor === '_chatEditorDOM' && !this.openForwardOpen && !this.openTipUser) {
            // WARNING: Deprecated methods from KeyBoard Event
            if (e.code === "Space" || e.keyCode === 32 || e.which === 32) {
            } else if (inputKeyCodes.includes(e.keyCode)) {
                this.editor.commands.insertContent(e.key)
                this.editor.commands.focus('end')
            } else {
               this.editor.commands.focus('end')
            }
        }

        
    }

   async goToRepliedMessage(message){
    const findMessage = this.shadowRoot.querySelector('chat-scroller').shadowRoot.getElementById(message.reference)
    if(findMessage){
        findMessage.scrollIntoView({ behavior: 'smooth', block: 'center' })
        const findElement = findMessage.shadowRoot.querySelector('.message-parent')
        if(findElement){
            findElement.classList.add('blink-bg')
            setTimeout(()=> {
                findElement.classList.remove('blink-bg')
            }, 2000)
        }
  
        return
    }
    if((message.timestamp -  this.messagesRendered[0].timestamp)  > 86400000){
        let errorMsg = get("chatpage.cchange66")
        parentEpml.request('showSnackBar', `${errorMsg}`)
        return
    } 

    if((message.timestamp -  this.messagesRendered[0].timestamp)  < 86400000){
       await this.getOldMessageDynamic(0, this.messagesRendered[0].timestamp, message.timestamp - 7200000)
       const findMessage = this.shadowRoot.querySelector('chat-scroller').shadowRoot.getElementById(message.reference)
    if(findMessage){
        findMessage.scrollIntoView({ behavior: 'smooth', block: 'center' })
        const findElement = findMessage.shadowRoot.querySelector('.message-parent')
        if(findElement){
            findElement.classList.add('blink-bg')
            setTimeout(()=> {
                findElement.classList.remove('blink-bg')
            }, 2000)
        }
  
        return
    }

    let errorMsg = get("chatpage.cchange66")
    parentEpml.request('showSnackBar', `${errorMsg}`)
    
    }

   }

    async userSearch() {
        const nameValue = this.shadowRoot.getElementById('sendTo').value;
            if (!nameValue) {
                this.userFound = [];
                this.userFoundModalOpen = false;
                this.loading = false;
                return;
            }
            try {
                const result = await parentEpml.request('apiCall', {
                    type: 'api',
                    url: `/names/${nameValue}`
                })
                if (result.error === 401) {
                    this.loading = false;
                    this.userFound = [];
                    this.loading = false;
                } else {
                    this.userFound = [
                        ...this.userFound, 
                        result,
                      ];
                }
                this.userFoundModalOpen = true;
            } catch (error) {
                this.loading = false;
                let err4string = get("chatpage.cchange35");
                parentEpml.request('showSnackBar', `${err4string}`)
            }
    }    

    setForwardProperties(forwardedMessage){
        this.openForwardOpen = true
        this.forwardedMessage = forwardedMessage
    }
    
    async sendForwardMessage() {
        let parsedMessageObj = {};
        try {
             parsedMessageObj = JSON.parse(this.forwardedMessage);
            } 
        catch (error) {
            parsedMessageObj = {};
        }
        
        try {
            const message = {
                ...parsedMessageObj,
                type: 'forward'
            }
            delete message.reactions
            const stringifyMessageObject = JSON.stringify(message);
            this.sendMessage(stringifyMessageObject, undefined, '', true)
        } catch (error) {
        }
    }

    showLastMessageRefScroller(props) {
        this.lastMessageRefVisible = props;
    }

    
    insertImage(file) {
        if (file.type.includes('image')) {
            this.imageFile = file;
            this.currentEditor = 'newChat'
            return;
        }       
         parentEpml.request('showSnackBar', get("chatpage.cchange28")); 
    }

    removeImage() {
        this.imageFile = null;
        this.resetChatEditor()
        this.currentEditor = '_chatEditorDOM'
    }

    changeMsgInput(id) {
        this.chatMessageInput  = this.shadowRoot.getElementById(id);
        this.initChatEditor();
    }

    async initUpdate(){
        this.pageNumber = 1
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


        const isRecipient = this.chatId.includes('direct') === true ? true : false;
        const groupId = this.chatId.split('/')[1];
        if(!isRecipient && groupId.toString() !== '0'){

            try {
                const getMembers = await parentEpml.request("apiCall", {
					type: "api",
					url: `/groups/members/${groupId}?onlyAdmins=false&limit=20&offset=0`,
				});
                const getMembersAdmins = await parentEpml.request("apiCall", {
					type: "api",
					url: `/groups/members/${groupId}?onlyAdmins=true&limit=20`,
				});
                const getGroupInfo = await parentEpml.request("apiCall", {
					type: "api",
					url: `/groups/${groupId}`,
				});
                const getMembersAdminsWithName = (getMembersAdmins.members || []).map(async (member) => {
                    let memberItem = member
                    try {
                      const name =  await this.getName(member.member)
                       memberItem = {
                        address: member.member,
                        name: name ? name : undefined
                      }
                    } catch (error) {
                    }
            
                    return memberItem
                })
                const membersAdminsWithName = await Promise.all(getMembersAdminsWithName)
                const getMembersWithName = (getMembers.members || []).map(async (member) => {
                    let memberItem = member
                    try {
                      const name =  await this.getName(member.member)
                       memberItem = {
                        address: member.member,
                        name: name ? name : undefined
                      }
                    } catch (error) {
                    }
            
                    return memberItem
                })
                const membersWithName = await Promise.all(getMembersWithName)
                this.groupAdmin = membersAdminsWithName
                this.groupMembers = membersWithName
                this.groupInfo = getGroupInfo
            } catch (error) {
            }
        }
        
     
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
           
        })
        parentEpml.imReady();
    
    const isEnabledChatEnter = localStorage.getItem('isEnabledChatEnter') 

        if(isEnabledChatEnter){
            this.isEnabledChatEnter = isEnabledChatEnter === 'false' ? false : true 
        }
    
    }

    async updated(changedProperties) {
        if (changedProperties && changedProperties.has('userLanguage')) {
            const userLang = changedProperties.get('userLanguage')
            if (userLang) {
                await new Promise(r => setTimeout(r, 100));
                this.chatEditorPlaceholder = this.isReceipient === true ? `Message ${this._chatId}` : `${get("chatpage.cchange8")}`;
            }       
        }


     
        if (changedProperties && changedProperties.has('isLoading')) {
            if (this.isLoading === true && this.currentEditor === '_chatEditorDOM' && this.editor && this.editor.setEditable) {
                this.editor.setEditable(false)
            }
            if (this.isLoading === false && this.currentEditor === '_chatEditorDOM' && this.editor &&  this.editor.setEditable) {
                this.editor.setEditable(true)
            }
        }
        
    }

    async getName (recipient) {
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
            .sendMessage=${(val) => this._sendMessage(val)}
            .sendMessageForward=${(messageText, typeMessage, chatReference, isForward, forwardParams)=> this.sendMessage(messageText, typeMessage, chatReference, isForward, forwardParams)}
            .showLastMessageRefScroller=${(val) => this.showLastMessageRefScroller(val)}
            .emojiPicker=${this.emojiPicker} 
            ?isLoadingMessages=${this.isLoadingOldMessages}
            .setIsLoadingMessages=${(val) => this.setIsLoadingMessages(val)}
            .setForwardProperties=${(forwardedMessage)=> this.setForwardProperties(forwardedMessage)}
            .setOpenPrivateMessage=${(val) => this.setOpenPrivateMessage(val)}
            .setOpenTipUser=${(val) => this.setOpenTipUser(val)}
            .setOpenUserInfo=${(val) => this.setOpenUserInfo(val)}
            .setUserName=${(val) => this.setUserName(val)}
            .setSelectedHead=${(val) => this.setSelectedHead(val)}
            ?openTipUser=${this.openTipUser}
            .selectedHead=${this.selectedHead}
            .goToRepliedMessage=${(val)=> this.goToRepliedMessage(val)}
            .getOldMessageAfter=${(val)=> this.getOldMessageAfter(val)}
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

    async getUpdateCompleteTextEditor() {
        await super.getUpdateComplete();
        const marginElements = Array.from(this.shadowRoot.querySelectorAll('chat-text-editor'));
        await Promise.all(marginElements.map(el => el.updateComplete));
        const marginElements2 = Array.from(this.shadowRoot.querySelectorAll('wrapper-modal'));
        await Promise.all(marginElements2.map(el => el.updateComplete));
        return true;
    }

    updatePlaceholder(editor, text){
        editor.extensionManager.extensions.forEach((extension) => {
            if (extension.name === "placeholder") {
    
              extension.options["placeholder"] = text
              editor.commands.focus('end')
            }
          })
    }

    async getOldMessageDynamic(limit, before, after) {

        if (this.isReceipient) {
            const getInitialMessages = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/chat/messages?involving=${window.parent.reduxStore.getState().app.selectedAddress.address}&involving=${this._chatId}&limit=${limit}&reverse=true&before=${before}&after=${after}&haschatreference=false`,
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
            const viewElement = this.shadowRoot.querySelector('chat-scroller').shadowRoot.getElementById('viewElement');

            if(viewElement){
                viewElement.scrollTop = 200
            }
                

            
           
        
        } else {
            const getInitialMessages = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/chat/messages?txGroupId=${Number(this._chatId)}&limit=${limit}&reverse=true&before=${before}&after=${after}&haschatreference=false`,
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
            const viewElement = this.shadowRoot.querySelector('chat-scroller').shadowRoot.getElementById('viewElement');

            if(viewElement){
                viewElement.scrollTop = 200
            }
       
                
          
         

        }
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

    async getOldMessageAfter(scrollElement) {
 
        if (this.isReceipient) {
            const getInitialMessages = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/chat/messages?involving=${window.parent.reduxStore.getState().app.selectedAddress.address}&involving=${this._chatId}&limit=20&reverse=true&afer=${scrollElement.messageObj.timestamp}&haschatreference=false`,
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
            this.messagesRendered = [...this.messagesRendered, ...replacedMessages].sort(function (a, b) {
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
                url: `/chat/messages?txGroupId=${Number(this._chatId)}&limit=20&reverse=true&after=${scrollElement.messageObj.timestamp}&haschatreference=false`,
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
          
            this.messagesRendered = [ ...this.messagesRendered, ...replacedMessages].sort(function (a, b) {
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
        this.editor.commands.focus('end')
        this.repliedToMessageObj = {...messageObj};
        this.editedMessageObj = null;
        this.requestUpdate();
    }

    // set edited message in chat editor

     setEditedMessageObj(messageObj) {
        this.editor.commands.focus('end')
        this.editedMessageObj = {...messageObj};
        this.repliedToMessageObj = null;
        this.requestUpdate();
    }
    
    closeEditMessageContainer() {
        this.editedMessageObj = null;
        this.isEditMessageOpen = !this.isEditMessageOpen;
        this.editor.commands.setContent('')
    }
 
    closeRepliedToContainer() {
        this.repliedToMessageObj = null;
        this.requestUpdate();
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
                newMessagesRendered[findOriginalMessageIndex] = {...newMessage, timestamp: newMessagesRendered[findOriginalMessageIndex].timestamp, senderName: newMessagesRendered[findOriginalMessageIndex].senderName,
					sender: newMessagesRendered[findOriginalMessageIndex].sender, editedTimestamp: newMessage.timestamp }
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

            this.showNewMessageBar();
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

        const initDirect = async (cid, noInitial) => {
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
                    if(noInitial) return
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
            this.webSocket.onclose = (e) => {
                clearTimeout(directSocketTimeout)
                if(e.reason === 'switch chat') return
                restartDirectWebSocket()
            }

            // Error Event
            this.webSocket.onerror = () => {
                clearTimeout(directSocketTimeout)
            }

            const pingDirectSocket = () => {
                this.webSocket.send('ping')

                directSocketTimeout = setTimeout(pingDirectSocket, 295000)
            }

        };
        const restartDirectWebSocket = () => {
            const noInitial = true
            setTimeout(() => initDirect(chatId, noInitial), 50)
        }
        const restartGroupWebSocket = () => {
            const noInitial = true
            let groupChatId = Number(chatId)
            setTimeout(() => initGroup(groupChatId, noInitial), 50)
        }

        const initGroup = (gId, noInitial) => {
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
                    if(noInitial) return
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
            this.webSocket.onclose = (e) => {
                clearTimeout(groupSocketTimeout)
                if(e.reason === 'switch chat') return
                restartGroupWebSocket()
            }

            // Error Event
            this.webSocket.onerror = () => {
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

    resetChatEditor(){
        if(this.currentEditor === '_chatEditorDOM'){
            this.editor.commands.setContent('')
        }
        if(this.currentEditor === 'newChat'){
            this.editorImage.commands.setContent('')
        }
    }

   async _sendMessage(outSideMsg, msg) {
        if(this.isReceipient){
           let hasPublicKey = true
            if(!this._publicKey.hasPubKey){
                hasPublicKey = false
                try {
                    const res =   await parentEpml.request('apiCall', {
                        type: 'api',
                        url: `/addresses/publickey/${this.selectedAddress.address}`
                    })
                    if (res.error === 102) {
                        this._publicKey.key = ''
                        this._publicKey.hasPubKey = false
                    } else if (res !== false) {
                        this._publicKey.key = res
                        this._publicKey.hasPubKey = true
                        hasPublicKey = true
                    } else {
                        this._publicKey.key = ''
                        this._publicKey.hasPubKey = false
                    }
                } catch (error) {
                }

                if(!hasPublicKey || !this._publicKey.hasPubKey){
                    let err4string = get("chatpage.cchange39");
                parentEpml.request('showSnackBar', `${err4string}`)
                return
                }
                
            }
        }
        // have params to determine if it's a reply or not
        // have variable to determine if it's a response, holds signature in constructor
        // need original message signature 
        // need whole original message object, transform the data and put it in local storage
        // create new var called repliedToData and use that to modify the UI
        // find specific object property in local
        let typeMessage = 'regular';
        let workerImage;
        this.isLoading = true;
        const trimmedMessage = msg
        
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

            if (this.webWorkerImage) {
                workerImage = this.webWorkerImage;
            } else {
                this.webWorkerImage = new WebWorkerImage();
            }
   
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
                    worker: workerImage
                   })
                   this.isDeletingImage = false
            } catch (error) {
                this.isLoading = false;
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
                return;
            }

            if (this.webWorkerImage) {
                workerImage = this.webWorkerImage;
            } else {
                this.webWorkerImage = new WebWorkerImage();
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
                        worker: workerImage
                    });
                this.isUploadingImage = false;
                this.removeImage()
                } catch (error) {
                    this.isLoading = false;
                    this.isUploadingImage = false;
                    return;
                }
            
            
             
                const messageObject = {
                    messageText: trimmedMessage,
                    images: [{
                            service: "QCHAT_IMAGE",
                            name: userName,
                            identifier: identifier
                    }],
                    isImageDeleted: false,
                    repliedTo: '',
                    version: 2
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

        } 
        else if (this.repliedToMessageObj) {
            let chatReference = this.repliedToMessageObj.reference;
            if(this.repliedToMessageObj.chatReference){
                chatReference = this.repliedToMessageObj.chatReference;
            }
            typeMessage = 'reply';
            const messageObject = {
                messageText: trimmedMessage,
                images: [''],
                repliedTo: chatReference,
                version: 2
            }
            const stringifyMessageObject = JSON.stringify(messageObject);
            this.sendMessage(stringifyMessageObject, typeMessage);
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
                isEdited: true
            }
            const stringifyMessageObject = JSON.stringify(messageObject)
            this.sendMessage(stringifyMessageObject, typeMessage, chatReference);
        } else {
            const messageObject = {
                messageText: trimmedMessage,
                images: [''],
                repliedTo: '',
                version: 2
            }
            const stringifyMessageObject = JSON.stringify(messageObject)
           
            if (this.balance < 4) {
                this.myTrimmedMeassage = ''
                this.myTrimmedMeassage = stringifyMessageObject
                this.shadowRoot.getElementById('confirmDialog').open()
            } else {
                this.sendMessage(stringifyMessageObject, typeMessage);
            }
        }
    }

    async sendMessage(messageText, typeMessage, chatReference, isForward) {
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
                        isEncrypted: 1,
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

            const userInput = this.shadowRoot.getElementById("sendTo").value.trim();
                if(!userInput && !this.forwardActiveChatHeadUrl.url) {
                    let err4string = get("chatpage.cchange65");
                    getSendChatResponse(false, true, err4string );
                    return
                } 
            let publicKey = {
                hasPubKey: false,
                key: ''
            };

            if (this.forwardActiveChatHeadUrl.url) { 
                const activeChatHeadAddress = this.forwardActiveChatHeadUrl.url.split('/')[1];        
                try {
                    const res = await parentEpml.request('apiCall', {
                        type: 'api',
                        url: `/addresses/publickey/${activeChatHeadAddress}`
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
                    console.error(error);
               }
            }
    
            if (!this.forwardActiveChatHeadUrl.selected && this.shadowRoot.getElementById("sendTo").value !== "") {
                
                try {
                    let userPubkey = "";
                    const validatedAddress = await parentEpml.request('apiCall', {
                        type: 'api',
                        url: `/addresses/validate/${userInput}`
                    });

                    const validatedUsername = await parentEpml.request('apiCall', {
                        type: 'api',
                        url: `/names/${userInput}`
                    });
                    
                        if (validatedAddress && validatedUsername.name) {
                            userPubkey = await parentEpml.request('apiCall', {
                                type: 'api',
                                url: `/addresses/publickey/${validatedUsername.owner}`
                            });
                            this.forwardActiveChatHeadUrl = {
                                ...this.forwardActiveChatHeadUrl,
                                url: `direct/${validatedUsername.owner}`,
                                name: validatedUsername.name,
                                selected: true
                            };
                        } else
                    if (!validatedAddress && (validatedUsername && !validatedUsername.error)) {
                        userPubkey = await parentEpml.request('apiCall', {
                            type: 'api',
                            url: `/addresses/publickey/${validatedUsername.owner}`
                        });
                        this.forwardActiveChatHeadUrl = {
                            ...this.forwardActiveChatHeadUrl,
                            url: `direct/${validatedUsername.owner}`,
                            name: validatedUsername.name,
                            selected: true
                        };
                    } else if (validatedAddress && !validatedUsername.name) {
                        userPubkey = await parentEpml.request('apiCall', {
                            type: 'api',
                            url: `/addresses/publickey/${userInput}`
                        });
                        this.forwardActiveChatHeadUrl = {
                            ...this.forwardActiveChatHeadUrl,
                            url: `direct/${userInput}`,
                            name: "",
                            selected: true
                        };
                    } else if (!validatedAddress && !validatedUsername.name) {
                        let err4string = get("chatpage.cchange62");
                        // parentEpml.request('showSnackBar', `${err4string}`);
                        getSendChatResponse(false, true, err4string);
                        return;
                    }

                    if (userPubkey.error === 102) {
                        publicKey.key = '';
                        publicKey.hasPubKey = false;
                    } else if (userPubkey !== false) {
                        publicKey.key = userPubkey;
                        publicKey.hasPubKey = true;
                    } else {
                        publicKey.key = '';
                        publicKey.hasPubKey = false;
                    }
                } catch (error) {
                    console.error(error);
                }
            }

            const isRecipient = this.forwardActiveChatHeadUrl.url.includes('direct') === true ? true : false;
            
            const recipientAddress = this.forwardActiveChatHeadUrl.url.split('/')[1];
            this.openForwardOpen = false;
            if (isRecipient === true) {
                if(!publicKey.hasPubKey){
                    let err4string = get("chatpage.cchange39");
                    parentEpml.request('showSnackBar', `${err4string}`);
                    getSendChatResponse(false);
                    return;
                }
                let chatResponse = await parentEpml.request('chat', {
                    type: 18,
                    nonce: this.selectedAddress.nonce,
                    params: {
                        timestamp: Date.now(),
                        recipient: recipientAddress,
                        recipientPublicKey: publicKey.key,
                        hasChatReference:  0,
                        chatReference: "",
                        message: messageText,
                        lastReference: reference,
                        proofOfWorkNonce: 0,
                        isEncrypted: 1,
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
                        groupID: Number(recipientAddress),
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
            const difficulty = this.balance < 4 ? 18 : 8;
            const path = window.parent.location.origin + '/memory-pow/memory-pow.wasm.full'

              let worker;

              if (this.webWorker) {
                worker = this.webWorker;
              } else {
                this.webWorker = new WebWorker();
              }

            let nonce = null;

            let chatBytesArray = null;

              await new Promise((res) => {
                worker.postMessage({chatBytes, path, difficulty});
                worker.onmessage = e => {
                  chatBytesArray = e.data.chatBytesArray;
                    nonce = e.data.nonce;
                    res();
                }
              });

            let _response = await parentEpml.request('sign_chat', {
                nonce: this.selectedAddress.nonce,
                chatBytesArray: chatBytesArray,
                chatNonce: nonce
            });

            getSendChatResponse(_response, isForward);
        };

        const getSendChatResponse = (response, isForward, customErrorMessage) => {
            if (response === true) {
                this.resetChatEditor()
                if(isForward){
                    let successString = get("blockpage.bcchange15");
                    parentEpml.request('showSnackBar', `${successString}`);
                }

                this.closeEditMessageContainer()
                this.closeRepliedToContainer()
                this.openForwardOpen = false
                this.forwardActiveChatHeadUrl = {
                url: "",
                name: "",
                selected: false
                }
            } else if (response.error) {
                parentEpml.request('showSnackBar', response.message);
            } else {
                let err2string = get("chatpage.cchange21");
                parentEpml.request('showSnackBar', `${customErrorMessage || err2string}`);
            }
            if(isForward && response !== true){
                this.isLoading = false;
                return
            }
            this.isLoading = false;
            
        };

        if (isForward) {
            sendForwardRequest();
            return;
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
            this.hideNewMessageBar()
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
