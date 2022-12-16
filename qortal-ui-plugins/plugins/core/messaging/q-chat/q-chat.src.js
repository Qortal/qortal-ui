import { LitElement, html, css } from 'lit';
import { render } from 'lit/html.js';
import { Epml } from '../../../../epml.js';
import { use, get, translate, translateUnsafeHTML, registerTranslateConfig } from 'lit-translate';
import WebWorker from 'web-worker:./computePowWorker.src.js';

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

import '../../components/ChatWelcomePage.js';
import '../../components/ChatHead.js';
import '../../components/ChatPage.js';
import '../../components/WrapperModal.js';
import snackbar from '../../components/snackbar.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-icon';
import '@material/mwc-snackbar';
import '@vaadin/grid';

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class Chat extends LitElement {
    static get properties() {
        return {
            selectedAddress: { type: Object },
            chatTitle: { type: String },
            chatHeads: { type: Array },
            chatHeadsObj: { type: Object },
            chatId: { type: String },
            messages: { type: Array },
            btnDisable: { type: Boolean },
            isLoading: { type: Boolean },
            balance: { type: Number },
            theme: { type: String, reflect: true },
            blockedUsers: { type: Array },
            blockedUserList: { type: Array },
            privateMessagePlaceholder: { type: String},
            chatEditor: { type:  Object },
            imageFile: { type: Object },
            activeChatHeadUrl: {type: String},
            openPrivateMessage: { type: Boolean }
        }
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --mdc-theme-secondary: var(--mdc-theme-primary);
                --paper-input-container-focus-color: var(--mdc-theme-primary);
                --mdc-theme-surface: var(--white);
                --mdc-dialog-content-ink-color: var(--black);
                --lumo-primary-text-color: rgb(0, 167, 245);
                --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
                --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
                --lumo-primary-color: hsl(199, 100%, 48%);
                --lumo-base-color: var(--white);
                --lumo-body-text-color: var(--black);
                --_lumo-grid-border-color: var(--border);
                --_lumo-grid-secondary-border-color: var(--border2);
                --mdc-dialog-min-width: 750px;
            }

            paper-spinner-lite {
                height: 24px;
                width: 24px;
                --paper-spinner-color: var(--mdc-theme-primary);
                --paper-spinner-stroke-width: 2px;
            }

            *,
            *:before,
            *:after {
                box-sizing: border-box;
            }

            ul {
                list-style: none;
                padding: 0;
            }

            .container {
                margin: 0 auto;
                width: 100%;
                background: var(--white);
            }

            .people-list {
                width: 20vw;
                float: left;
                height: 100vh;
                overflow-y: hidden;
                border-right: 3px #ddd solid;
            }

            .people-list .blockedusers {
                position: absolute;
                bottom: 0;
                width: 20vw;
                height: 60px;
                background: var(--white);
                border-top: 1px solid var(--border);
                border-right: 3px #ddd solid;
            }

            .people-list .search {
                padding-top: 20px;
                padding-left: 20px;
                padding-right: 20px;
            }

            .center {
                margin: 0;
                position: absolute;
                padding-top: 12px;
                left: 50%;
                -ms-transform: translateX(-50%);
                transform: translateX(-50%);
            }

            .people-list .create-chat {
                border-radius: 5px;
                border: none;
                display: inline-block;
                padding: 14px;
                color: #fff;
                background: var(--tradehead);
                width: 100%;
                font-size: 15px;
                text-align: center;
                cursor: pointer;
            }

            .people-list .create-chat:hover {
                opacity: .8;
                box-shadow: 0 3px 5px rgba(0, 0, 0, .2);
            }

            .people-list ul {
                padding: 0;
                height: 85vh;
                overflow-y: auto;
                overflow-x: hidden;     
            }

            .chat {
                width: 80vw;
                height: 100vh;
                float: left;
                background: var(--white);
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
                color: #434651;
                box-sizing: border-box;
            }

            .chat .new-message-bar {
                display: flex;
                flex: 0 1 auto;
                align-items: center;
                justify-content: space-between;
                padding: 0px 25px;
                font-size: 14px;
                font-weight: 500;
                top: 0;
                position: absolute;
                left: 20vw;
                right: 0;
                z-index: 5;
                background: var(--tradehead);
                color: var(--white);
                border-radius: 0 0 8px 8px;
                min-height: 25px;
                transition: opacity .15s;
                text-transform: capitalize;
                opacity: .85;
                cursor: pointer;
            }

            .chat .new-message-bar:hover {
                opacity: .75;
                transform: translateY(-1px);
                box-shadow: 0 3px 7px rgba(0, 0, 0, .2);
            }

            .hide-new-message-bar {
                display: none !important;
            }

            .chat .chat-history {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 100%;
                left: 20vw;
                border-bottom: 2px solid var(--white);
                overflow-y: hidden;
                height: 100vh;
                box-sizing: border-box;
            }

            .chat .chat-message {
                padding: 10px;
                height: 10%;
                display: inline-block;
                width: 100%;
                background-color: #eee;
            }

            .chat .chat-message textarea {
                width: 90%;
                border: none;
                font-size: 16px;
                padding: 10px 20px;
                border-radius: 5px;
                resize: none;
            }

            .chat .chat-message button {
                float: right;
                color: #94c2ed;
                font-size: 16px;
                text-transform: uppercase;
                border: none;
                cursor: pointer;
                font-weight: bold;
                background: #f2f5f8;
                padding: 10px;
                margin-top: 4px;
                margin-right: 4px;
            }

            .chat .chat-message button:hover {
                color: #75b1e8;
            }

            .online,
            .offline,
            .me {
                margin-right: 3px;
                font-size: 10px;
            }

            .clearfix:after {
                visibility: hidden;
                display: block;
                font-size: 0;
                content: " ";
                clear: both;
                height: 0;
            }

            .red {
                --mdc-theme-primary: red;
            }

            h2 {
                margin:0;
            }

            h2, h3, h4, h5 {
                color: var(--black);
                font-weight: 400;
            }

            [hidden] {
                display: hidden !important;
                visibility: none !important;
            }

            .details {
                display: flex;
                font-size: 18px;
            }

            .title {
                font-weight:600;
                font-size:12px;
                line-height: 32px;
                opacity: 0.66;
            }

            .input {
                width: 100%;
                border: none;
                display: inline-block;
                font-size: 16px;
                padding: 10px 20px;
                border-radius: 5px;
                resize: none;
                background: #eee;
            }

            .textarea {
                width: 100%;
                border: none;
                display: inline-block;
                font-size: 16px;
                padding: 10px 20px;
                border-radius: 5px;
                height: 120px;
                resize: none;
                background: #eee;
            }

            .dialog-container {
                position: relative;
                display: flex;
                align-items: center;
                flex-direction: column;
                padding: 0 10px;
                gap: 10px;
                height: 100%;
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
        this.selectedAddress = {}
        this.config = {
            user: {
                node: {

                }
            }
        }
        this.chatTitle = ""
        this.chatHeads = []
        this.chatHeadsObj = {}
        this.chatId = ''
        this.balance = 1
        this.messages = []
        this.btnDisable = false
        this.isLoading = false
        this.showNewMesssageBar = this.showNewMesssageBar.bind(this)
        this.hideNewMesssageBar = this.hideNewMesssageBar.bind(this)
        this._sendMessage = this._sendMessage.bind(this)
        this.insertImage = this.insertImage.bind(this)
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
        this.blockedUsers = []
        this.blockedUserList = []
        this.privateMessagePlaceholder = ""
        this.imageFile = null
        this.activeChatHeadUrl = ''
        this.openPrivateMessage = false
    }

  async setActiveChatHeadUrl(url) {
        this.activeChatHeadUrl = ''
        await this.updateComplete;
        this.activeChatHeadUrl = url
    }

    render() {
        return html`
            <div class="container clearfix">
                <div class="people-list" id="people-list">
                    <div class="search">
                        <div class="create-chat" @click=${() => {
                            this.openPrivateMessage = true;
                            }}>${translate("chatpage.cchange1")}
                            </div>
                    </div>
                    <ul class="list">
                        ${this.isEmptyArray(this.chatHeads) ? this.renderLoadingText() : this.renderChatHead(this.chatHeads)}
                    </ul>
                    <div class="blockedusers">
                        <div class="center">
                            <mwc-button raised label="${translate("chatpage.cchange3")}" icon="person_off" @click=${() => this.shadowRoot.querySelector('#blockedUserDialog').show()}></mwc-button>
                        </div>
                    </div>
                </div>

                <div class="chat">
                    <div id="newMessageBar" class="new-message-bar hide-new-message-bar clearfix" @click=${() => this.scrollToBottom()}>
                        <span style="flex: 1;">${translate("chatpage.cchange4")}</span>
                        <span>${translate("chatpage.cchange5")} <mwc-icon style="font-size: 16px; vertical-align: bottom;">keyboard_arrow_down</mwc-icon></span>
                    </div>
                    <div class="chat-history">
               
                        ${window.parent.location.pathname !== "/app/q-chat" || this.activeChatHeadUrl ? html`${this.renderChatPage(this.chatId)}` : html`${this.renderChatWelcomePage()}`}
                    </div>
                </div>

                <!-- Start Chatting Dialog -->
                <wrapper-modal 
                    .onClickFunc=${() => {
                        this.chatEditor.resetValue();
                        this.openPrivateMessage = false;
                    } } 
                    style=${this.openPrivateMessage ? "display: block" : "display: none"}>
                    <div>
                        <div class="dialog-container">
                            <div style="text-align: center">
                                <h1>${translate("chatpage.cchange1")}</h1>
                                <hr>
                            </div>
                            <p>${translate("chatpage.cchange6")}</p>
                            <textarea 
                                class="input" 
                                ?disabled=${this.isLoading} 
                                id="sendTo" 
                                placeholder="${translate("chatpage.cchange7")}" 
                                rows="1">
                            </textarea>
                            <chat-text-editor 
                                iframeId="privateMessage" 
                                ?hasGlobalEvents=${false}
                                placeholder="${translate("chatpage.cchange8")}"
                                .setChatEditor=${(editor)=> this.setChatEditor(editor)}
                                .chatEditor=${this.chatEditor}
                                .imageFile=${this.imageFile}
                                ._sendMessage=${this._sendMessage}
                                .insertImage=${this.insertImage}
                                ?isLoading=${this.isLoading}
                                .isLoadingMessages=${false}
                                id="messageBox"
                                >
                            </chat-text-editor>
                            <div class="modal-button-row">
                                <button 
                                    class="modal-button-red" 
                                    @click=${() => {
                                    this.chatEditor.resetValue();
                                    this.openPrivateMessage = false;
                                    }}
                                    ?disabled="${this.isLoading}"
                                >
                                    ${translate("chatpage.cchange33")}
                                </button>
                                <button
                                    class="modal-button"
                                    @click=${this.sendMessageFunc}
                                    ?disabled="${this.isLoading}">
                                        ${this.isLoading === false 
                                        ? this.renderSendText() 
                                        : html`
                                            <paper-spinner-lite active></paper-spinner-lite>
                                        `}
                                </button>
                            </div>
                        </div>
                    </div>    	
                </wrapper-modal>

                <!-- Blocked User Dialog -->
                <mwc-dialog id="blockedUserDialog">
                    <div style="text-align:center">
                        <h1>${translate("chatpage.cchange10")}</h1>
                        <hr>
                        <br>
                    </div>
                    <vaadin-grid theme="compact" id="blockedGrid" ?hidden="${this.isEmptyArray(this.blockedUserList)}" aria-label="Blocked List" .items="${this.blockedUserList}" all-rows-visible>
                        <vaadin-grid-column auto-width header="${translate("chatpage.cchange11")}" path="name"></vaadin-grid-column>
                        <vaadin-grid-column auto-width header="${translate("chatpage.cchange12")}" path="owner"></vaadin-grid-column>
                        <vaadin-grid-column width="10rem" flex-grow="0" header="${translate("chatpage.cchange13")}" .renderer=${(root, column, data) => {
                            render(html`${this.renderUnblockButton(data.item)}`, root);
                        }}>
                        </vaadin-grid-column>
                    </vaadin-grid>
                    ${this.isEmptyArray(this.blockedUserList) ? html`
                        <span style="color: var(--black); text-align: center;">${translate("chatpage.cchange14")}</span>
                    `: ''}
                    <mwc-button
                        slot="primaryAction"
                        dialogAction="cancel"
                        class="red"
                    >
                    ${translate("general.close")}
                   </mwc-button>
                </mwc-dialog>
            </div>
  
        `
    }

    firstUpdated() {
        this.changeLanguage()
        this.changeTheme()
        this.getChatBlockedList()
        this.getLocalBlockedList()

        const getBlockedUsers = async () => {
            let blockedUsers = await parentEpml.request('apiCall', {
                url: `/lists/blockedAddresses?apiKey=${this.getApiKey()}`
            })
            this.blockedUsers = blockedUsers
            setTimeout(getBlockedUsers, 60000)
        }

        const stopKeyEventPropagation = (e) => {
            e.stopPropagation();
            return false;
        }

        this.shadowRoot.getElementById('sendTo').addEventListener('keydown', stopKeyEventPropagation);
        this.shadowRoot.getElementById('messageBox').addEventListener('keydown', stopKeyEventPropagation);

        const getDataFromURL = () => {
            let tempUrl = document.location.href
            let splitedUrl = decodeURI(tempUrl).split('?')
            let urlData = splitedUrl[1]
            if (urlData !== undefined) {

                this.chatId = urlData
            }
        }

        const runFunctionsAfterPageLoad = () => {
            // Functions to exec after render while waiting for page info...
            // getDataFromURL()

            try {
                let key = `${window.parent.reduxStore.getState().app.selectedAddress.address.substr(0, 10)}_chat-heads`
                let localChatHeads = localStorage.getItem(key)
                this.setChatHeads(JSON.parse(localChatHeads))
            } catch (e) {
                // TODO: Could add error handling in case there's a weird one... (-_-)
                return
            }

            // Clear Interval...
            if (this.selectedAddress.address !== undefined) {
                clearInterval(runFunctionsAfterPageLoadInterval)
                return
            }
        }

        let runFunctionsAfterPageLoadInterval = setInterval(runFunctionsAfterPageLoad, 100);

        window.addEventListener("contextmenu", (event) => {
            event.preventDefault()
            this._textMenu(event)
        })

        window.addEventListener("click", () => {
            parentEpml.request('closeCopyTextMenu', null)
            parentEpml.request('closeFramePasteMenu', null)
        })

        window.addEventListener('storage', () => {
            const checkLanguage = localStorage.getItem('qortalLanguage')
            const checkTheme = localStorage.getItem('qortalTheme')

            use(checkLanguage)

            if (checkTheme === 'dark') {
                this.theme = 'dark'
            } else {
                this.theme = 'light'
            }
            document.querySelector('html').setAttribute('theme', this.theme)
        })

        window.onkeyup = (e) => {
            if (e.keyCode === 27) {
                parentEpml.request('closeCopyTextMenu', null)
                parentEpml.request('closeFramePasteMenu', null)
            }
        }

        let configLoaded = false

        parentEpml.ready().then(() => {
            parentEpml.subscribe('selected_address', async selectedAddress => {
                this.selectedAddress = {}
                selectedAddress = JSON.parse(selectedAddress)
                if (!selectedAddress || Object.entries(selectedAddress).length === 0) return
                this.selectedAddress = selectedAddress
            })
            parentEpml.subscribe('config', c => {
                if (!configLoaded) {
                    setTimeout(getBlockedUsers, 1)
                    configLoaded = true
                }
                this.config = JSON.parse(c)
            })
            parentEpml.subscribe('chat_heads', chatHeads => {
                chatHeads = JSON.parse(chatHeads)
                this.getChatHeadFromState(chatHeads)
            })
            parentEpml.request('apiCall', {
                url: `/addresses/balance/${window.parent.reduxStore.getState().app.selectedAddress.address}`
            }).then(res => {
                this.balance = res
            })
            parentEpml.subscribe('copy_menu_switch', async value => {

                if (value === 'false' && window.getSelection().toString().length !== 0) {

                    this.clearSelection()
                }
            })
        })
        parentEpml.imReady()
    }

    setChatEditor(editor) {
        this.chatEditor = editor;
    }

    async _sendMessage() { 
        this.isLoading = true;
        this.chatEditor.disable();
        const messageText = this.chatEditor.mirror.value;
        // Format and Sanitize Message
        const sanitizedMessage = messageText.replace(/&nbsp;/gi, ' ').replace(/<br\s*[\/]?>/gi, '\n');
        const trimmedMessage = sanitizedMessage.trim();
        if (/^\s*$/.test(trimmedMessage)) {
            this.isLoading = false;
            this.chatEditor.enable();
        } else {
            const messageObject = {
                messageText: trimmedMessage,
                images: [''],
                repliedTo: '',
                version: 1
            }
            const stringifyMessageObject = JSON.stringify(messageObject)
            this.sendMessage(stringifyMessageObject);
        }
    }
      
      async sendMessage(messageText) {
        this.isLoading = true;
      
        const _recipient = this.shadowRoot.getElementById('sendTo').value;
      
        let recipient;
      
        const validateName = async (receiverName) => {  
            let myRes;
            try {                
                let myNameRes = await parentEpml.request('apiCall', {
                    type: 'api',
                    url: `/names/${receiverName}`
                });
                if (myNameRes.error === 401) {
                    myRes = false;
                } else {
                    myRes = myNameRes;
                }
                return myRes;
            } catch (error) {
                return "";
            }
        };
      
        const myNameRes = await validateName(_recipient);
        if (!myNameRes) {
            recipient = _recipient;
        } else {
            recipient = myNameRes.owner;
        };
      
        const getAddressPublicKey = async () => {
            let isEncrypted;
            let _publicKey;
      
            let addressPublicKey = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/publickey/${recipient}`
            })
            
            if (addressPublicKey.error === 102) {
                _publicKey = false;
                let err4string = get("chatpage.cchange19");
                parentEpml.request('showSnackBar', `${err4string}`);
                this.chatEditor.enable();
                this.isLoading = false;
            } else if (addressPublicKey !== false) {
                isEncrypted = 1;
                _publicKey = addressPublicKey;
                sendMessageRequest(isEncrypted, _publicKey);
            } else {
                isEncrypted = 0;
                _publicKey = this.selectedAddress.address;
                sendMessageRequest(isEncrypted, _publicKey);
            }
        };
        let _reference = new Uint8Array(64);
        window.crypto.getRandomValues(_reference);
        let reference = window.parent.Base58.encode(_reference);
        const sendMessageRequest = async (isEncrypted, _publicKey) => {
            let chatResponse = await parentEpml.request('chat', {
                type: 18,
                nonce: this.selectedAddress.nonce,
                params: {
                    timestamp: Date.now(),
                    recipient: recipient,
                    recipientPublicKey: _publicKey,
                    hasChatReference: 0,
                    message: messageText,
                    lastReference: reference,
                    proofOfWorkNonce: 0,
                    isEncrypted: isEncrypted,
                    isText: 1
                }
            });
            
            _computePow(chatResponse);
    };
      
        const _computePow = async (chatBytes) => {
            const difficulty = this.balance === 0 ? 12 : 8;
            const path = window.parent.location.origin + '/memory-pow/memory-pow.wasm.full';
            const worker = new WebWorker();
            let nonce = null;
            let chatBytesArray = null;
              await new Promise((res, rej) => {
                worker.postMessage({chatBytes, path, difficulty});
                worker.onmessage = e => {
                  worker.terminate();
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
           
            getSendChatResponse(_response);
        };
      
        const getSendChatResponse = (response) => {
            if (response === true) {
                this.setActiveChatHeadUrl(`direct/${recipient}`);
                this.shadowRoot.getElementById('sendTo').value = "";
                this.openPrivateMessage = false;
                this.chatEditor.resetValue();
            } else if (response.error) {
                parentEpml.request('showSnackBar', response.message);
            } else {
                let err2string = get("chatpage.cchange21");
                parentEpml.request('showSnackBar', `${err2string}`);
            }
      
            this.isLoading = false;
            this.chatEditor.enable();
        };
      
        // Exec..
        getAddressPublicKey();
      
      }

    insertImage(file) {
        if (file.type.includes('image')) {
            this.imageFile = file;
            this.chatEditor.disable();
            return;
        }       
         parentEpml.request('showSnackBar', get("chatpage.cchange28")); 
    }

    renderLoadingText() {
        return html`${translate("chatpage.cchange2")}`
    }

    renderSendText() {
        return html`${translate("chatpage.cchange9")}`
    }

    relMessages() {
        setTimeout(() => {
            window.location.href = window.location.href.split( '#' )[0]
        }, 500)
    }

    getLocalBlockedList() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const blockedAddressesUrl = `${nodeUrl}/lists/blockedAddresses?apiKey=${this.getApiKey()}`

        localStorage.removeItem("MessageBlockedAddresses")

        var hidelist = []

        fetch(blockedAddressesUrl).then(response => {
            return response.json()
        }).then(data => {
            data.map(item => {
                hidelist.push(item)
            })
            localStorage.setItem("MessageBlockedAddresses", JSON.stringify(hidelist))
     
            this.blockedUserList = hidelist
        })
    }

    getChatBlockedList() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const blockedAddressesUrl = `${nodeUrl}/lists/blockedAddresses?apiKey=${this.getApiKey()}`
        const err1string = 'No regitered name'

        localStorage.removeItem("ChatBlockedAddresses")

        var obj = [];

        fetch(blockedAddressesUrl).then(response => {
            return response.json()
        }).then(data => {
            return data.map(item => {
                const noName = {
                    name: err1string,
                    owner: item
                }
                fetch(`${nodeUrl}/names/address/${item}?limit=0&reverse=true`).then(res => {
                    return res.json()
                }).then(jsonRes => {
                    if(jsonRes.length) {
                        jsonRes.map (item => {
                            obj.push(item)
                        })
                    } else {
                        obj.push(noName)
                    }
                    localStorage.setItem("ChatBlockedAddresses", JSON.stringify(obj))
                    this.blockedUserList = JSON.parse(localStorage.getItem("ChatBlockedAddresses") || "[]")
                })
            })
        })
    }

    async unblockUser(websiteObj) {
        let owner = websiteObj.owner

        let items = [
            owner
        ]

        let ownersJsonString = JSON.stringify({ "items": items })

        let ret = await parentEpml.request('apiCall', {
            url: `/lists/blockedAddresses?apiKey=${this.getApiKey()}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: `${ownersJsonString}`
        })

        if (ret === true) {
            this.blockedUsers = this.blockedUsers.filter(item => item != owner)
            this.getChatBlockedList()
            this.blockedUserList = JSON.parse(localStorage.getItem("ChatBlockedAddresses") || "[]")
            let err2string = get("chatpage.cchange16")
            snackbar.add({
                labelText: `${err2string}`,
                dismiss: true
            })
            this.relMessages()
        }
        else {
            let err3string = get("chatpage.cchange17")
            snackbar.add({
                labelText: `${err3string}`,
                dismiss: true
            })
        }
        return ret
    }

    renderUnblockButton(websiteObj) {
        return html`<mwc-button dense unelevated label="${translate("chatpage.cchange18")}" icon="person_remove" @click="${() => this.unblockUser(websiteObj)}"></mwc-button>`
    }

    changeTheme() {
        const checkTheme = localStorage.getItem('qortalTheme')
        if (checkTheme === 'dark') {
            this.theme = 'dark';
        } else {
            this.theme = 'light';
        }
        document.querySelector('html').setAttribute('theme', this.theme);
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

    renderChatWelcomePage() {
        return html`<chat-welcome-page myAddress=${JSON.stringify(this.selectedAddress)}></chat-welcome-page>`
    }

    renderChatHead(chatHeadArr) {

        let tempUrl = document.location.href
        let splitedUrl = decodeURI(tempUrl).split('?')
        // let activeChatHeadUrl = splitedUrl[1] === undefined ? '' : splitedUrl[1]

        return chatHeadArr.map(eachChatHead => {
            return html`<chat-head activeChatHeadUrl=${this.activeChatHeadUrl} .setActiveChatHeadUrl=${(val)=> this.setActiveChatHeadUrl(val)} chatInfo=${JSON.stringify(eachChatHead)}></chat-head>`
        })
    }

    renderChatPage(chatId) {
        
        // Check for the chat ID from and render chat messages
        // Else render Welcome to Q-CHat

        // TODO: DONE: Do the above in the ChatPage 
        return html`<chat-page .chatHeads=${this.chatHeads} .hideNewMesssageBar=${this.hideNewMesssageBar} .showNewMesssageBar=${this.showNewMesssageBar} myAddress=${window.parent.reduxStore.getState().app.selectedAddress.address} chatId=${this.activeChatHeadUrl}></chat-page>`
    }

    setChatHeads(chatObj) {

        let groupList = chatObj.groups.map(group => group.groupId === 0 ? { groupId: group.groupId, url: `group/${group.groupId}`, groupName: "Qortal General Chat", timestamp: group.timestamp === undefined ? 2 : group.timestamp } : { ...group, timestamp: group.timestamp === undefined ? 1 : group.timestamp, url: `group/${group.groupId}` })
        let directList = chatObj.direct.map(dc => {
            return { ...dc, url: `direct/${dc.address}` }
        })
        const compareNames = (a, b) => {
            return a.groupName.localeCompare(b.groupName)
        }
        groupList.sort(compareNames)
        let chatHeadMasterList = [...groupList, ...directList]

        const compareArgs = (a, b) => {
            return b.timestamp - a.timestamp
        }
        this.chatHeads = chatHeadMasterList.sort(compareArgs)
    }

    getChatHeadFromState(chatObj) {

        if (chatObj === undefined) {
            return
        } else {

            this.chatHeadsObj = chatObj
            this.setChatHeads(chatObj)
        }
    }

    _textMenu(event) {

        const getSelectedText = () => {
            var text = "";
            if (typeof window.getSelection != "undefined") {
                text = window.getSelection().toString();
            } else if (typeof this.shadowRoot.selection != "undefined" && this.shadowRoot.selection.type == "Text") {
                text = this.shadowRoot.selection.createRange().text;
            }
            return text;
        }

        const checkSelectedTextAndShowMenu = () => {
            let selectedText = getSelectedText();
            if (selectedText && typeof selectedText === 'string') {

                let _eve = { pageX: event.pageX, pageY: event.pageY, clientX: event.clientX, clientY: event.clientY }

                let textMenuObject = { selectedText: selectedText, eventObject: _eve, isFrame: true }

                parentEpml.request('openCopyTextMenu', textMenuObject)
            }
        }

        checkSelectedTextAndShowMenu()
    }

    _textArea(e) {

        if (e.keyCode === 13 && !e.shiftKey) this._sendMessage()
    }

    clearSelection() {

        window.getSelection().removeAllRanges()
        window.parent.getSelection().removeAllRanges()
    }

    onPageNavigation(pageUrl) {
        parentEpml.request('setPageUrl', pageUrl)
    }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
        let apiKey = myNode.apiKey;
        return apiKey;
    }

    scrollToBottom() {
        const viewElement = this.shadowRoot.querySelector('chat-page').shadowRoot.querySelector('chat-scroller').shadowRoot.getElementById('viewElement');
        viewElement.scroll({ top: viewElement.scrollHeight, left: 0, behavior: 'smooth' })
    }

    showNewMesssageBar() {
        this.shadowRoot.getElementById('newMessageBar').classList.remove('hide-new-message-bar')
    }

    hideNewMesssageBar() {
        this.shadowRoot.getElementById('newMessageBar').classList.add('hide-new-message-bar')
    }
}

window.customElements.define('q-chat', Chat)
