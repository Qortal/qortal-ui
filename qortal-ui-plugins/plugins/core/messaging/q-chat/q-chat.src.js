import { LitElement, html, css } from 'lit-element'
import { render } from 'lit-html'
import { Epml } from '../../../../epml.js'

// Components
import '../../components/ChatWelcomePage.js'
import '../../components/ChatHead.js'
import '../../components/ChatPage.js'

import '@polymer/paper-spinner/paper-spinner-lite.js'

import '@material/mwc-icon'
import '@material/mwc-button'
import '@material/mwc-dialog'

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
            balance: { type: Number }
        }
    }

    static get styles() {
        return css`
        
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --paper-input-container-focus-color: var(--mdc-theme-primary);
            }

            paper-spinner-lite{
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
                background: #fff;
            }

            .people-list {
                width: 20vw;
                float: left;
                height: 100vh;
                overflow-y: hidden;
                border-right: 3px #ddd solid;
            }

            .people-list .search {
                padding: 20px;
            }

            .people-list .create-chat {
                border-radius: 3px;
                border: none;
                display: inline-block;
                padding: 14px;
                color: white;
                background: #6a6c75;
                width: 90%;
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
                background: #fff;
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
                background: #6a6c75;
                color: white;
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
                border-bottom: 2px solid white;
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
                color:#333;
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
    }

    render() {
        return html`
            <style>

            </style>

            <div class="container clearfix">
                <div class="people-list" id="people-list">
                <div class="search">
                    <div class="create-chat" @click=${() => this.shadowRoot.querySelector('#startChatDialog').show()}>New Private Message</div>
                </div>
                <ul class="list">
                    ${this.isEmptyArray(this.chatHeads) ? "Loading..." : this.renderChatHead(this.chatHeads)}
                </ul>
            </div>

            <div class="chat">
                <div id="newMessageBar" class="new-message-bar hide-new-message-bar clearfix" @click=${ () => this.scrollToBottom()}>
                    <span style="flex: 1;">New Message</span>
                    <span>(Click to scroll down) <mwc-icon style="font-size: 16px; vertical-align: bottom;">keyboard_arrow_down</mwc-icon></span>
                </div>

                <div class="chat-history">
                    ${window.parent.location.pathname !== "/app/q-chat" ? html`${this.renderChatPage(this.chatId)}` : html`${this.renderChatWelcomePage()}`}
                </div>
            </div>

            <!-- Start Chatting Dialog -->
                <mwc-dialog id="startChatDialog" scrimClickAction="${this.isLoading ? '' : 'close'}">
                    <div style="text-align:center">
                        <h1>New Private Message</h1>
                        <hr>
                    </div>

                    <p>Type the name or address of who you want to chat with to send a private message!</p>
                    
                    <textarea class="input" ?disabled=${this.isLoading} id="sendTo" placeholder="Name / Address" rows="1"></textarea>
                    <p style="margin-bottom:0;">
                        <textarea class="textarea" @keydown=${(e) => this._textArea(e)} ?disabled=${this.isLoading} id="messageBox" placeholder="Message..." rows="1"></textarea>
                    </p>
                    
                    <mwc-button
                        ?disabled="${this.isLoading}"
                        slot="primaryAction"
                        @click=${this._sendMessage}
                        >
                        ${this.isLoading === false ? "Send" : html`<paper-spinner-lite active></paper-spinner-lite>`}
                    </mwc-button>
                    <mwc-button
                        ?disabled="${this.isLoading}"
                        slot="secondaryAction"
                        dialogAction="cancel"
                        class="red">
                        Close
                    </mwc-button>
                </mwc-dialog>
        </div>
  
        `
    }

    renderChatWelcomePage() {
        return html`<chat-welcome-page myAddress=${JSON.stringify(this.selectedAddress)}></chat-welcome-page>`
    }

    renderChatHead(chatHeadArr) {

        let tempUrl = document.location.href
        let splitedUrl = decodeURI(tempUrl).split('?')
        let activeChatHeadUrl = splitedUrl[1] === undefined ? '' : splitedUrl[1]

        return chatHeadArr.map(eachChatHead => {
            return html`<chat-head activeChatHeadUrl=${activeChatHeadUrl} chatInfo=${JSON.stringify(eachChatHead)}></chat-head>`
        })
    }

    renderChatPage(chatId) {
        // Check for the chat ID from and render chat messages
        // Else render Welcome to Q-CHat

        // TODO: DONE: Do the above in the ChatPage 

        return html`<chat-page .hideNewMesssageBar=${this.hideNewMesssageBar} .showNewMesssageBar=${this.showNewMesssageBar} myAddress=${window.parent.reduxStore.getState().app.selectedAddress.address} chatId=${chatId}></chat-page>`
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


    firstUpdated() {

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
            getDataFromURL()

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

            event.preventDefault();
            this._textMenu(event)
        });

        window.addEventListener("click", () => {

            parentEpml.request('closeCopyTextMenu', null)
            parentEpml.request('closeFramePasteMenu', null)
        });

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
                    configLoaded = true
                }
                this.config = JSON.parse(c)
            })
            parentEpml.subscribe('chat_heads', chatHeads => {
                chatHeads = JSON.parse(chatHeads)
                // setTimeout(() => {
                this.getChatHeadFromState(chatHeads)
                // }, 5000)
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

    _sendMessage() {

        this.isLoading = true

        const recipient = this.shadowRoot.getElementById('sendTo').value
        const messageBox = this.shadowRoot.getElementById('messageBox')
        const messageText = messageBox.value

        if (recipient.length === 0) {
            this.isLoading = false
        } else if (messageText.length === 0) {
            this.isLoading = false
        } else {
            this.sendMessage()
        }
    }

    async sendMessage(e) {

        this.isLoading = true

        const _recipient = this.shadowRoot.getElementById('sendTo').value
        const messageBox = this.shadowRoot.getElementById('messageBox')
        const messageText = messageBox.value
        let recipient

        const validateName = async (receiverName) => {

            let myRes
            let myNameRes = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/names/${receiverName}`
            })

            if (myNameRes.error === 401) {
                myRes = false
            } else {
                myRes = myNameRes
            }

            return myRes
        }

        const myNameRes = await validateName(_recipient)
        if (!myNameRes) {

            recipient = _recipient
        } else {

            recipient = myNameRes.owner
        }

        let _reference = new Uint8Array(64);
        window.crypto.getRandomValues(_reference);

        let sendTimestamp = Date.now()

        let reference = window.parent.Base58.encode(_reference)

        const getAddressPublicKey = async () => {
            let isEncrypted
            let _publicKey

            let addressPublicKey = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/publickey/${recipient}`
            })

            if (addressPublicKey.error === 102) {
                _publicKey = false
                parentEpml.request('showSnackBar', "Invalid Name / Address, Check the name / address and retry...")
                this.isLoading = false
            } else if (addressPublicKey !== false) {
                isEncrypted = 1
                _publicKey = addressPublicKey
                sendMessageRequest(isEncrypted, _publicKey)
            } else {
                isEncrypted = 0
                _publicKey = this.selectedAddress.address
                sendMessageRequest(isEncrypted, _publicKey)
            }
        };

        const sendMessageRequest = async (isEncrypted, _publicKey) => {

            let chatResponse = await parentEpml.request('chat', {
                type: 18,
                nonce: this.selectedAddress.nonce,
                params: {
                    timestamp: sendTimestamp,
                    recipient: recipient,
                    recipientPublicKey: _publicKey,
                    message: messageText,
                    lastReference: reference,
                    proofOfWorkNonce: 0,
                    isEncrypted: isEncrypted,
                    isText: 1
                }
            })

            _computePow(chatResponse)
        }

        const _computePow = async (chatBytes) => {

            const _chatBytesArray = Object.keys(chatBytes).map(function (key) { return chatBytes[key]; });
            const chatBytesArray = new Uint8Array(_chatBytesArray)


            const chatBytesHash = new window.parent.Sha256().process(chatBytesArray).finish().result

            const hashPtr = window.parent.sbrk(32, window.parent.heap);
            const hashAry = new Uint8Array(window.parent.memory.buffer, hashPtr, 32);
            hashAry.set(chatBytesHash);

            const difficulty = this.balance === 0 ? 14 : 8;

            const workBufferLength = 8 * 1024 * 1024;
            const workBufferPtr = window.parent.sbrk(workBufferLength, window.parent.heap);

            let nonce = window.parent.computePow(hashPtr, workBufferPtr, workBufferLength, difficulty)

            let _response = await parentEpml.request('sign_chat', {
                nonce: this.selectedAddress.nonce,
                chatBytesArray: chatBytesArray,
                chatNonce: nonce
            })

            getSendChatResponse(_response)
        }

        const getSendChatResponse = (response) => {

            if (response === true) {
                messageBox.value = ""
                parentEpml.request('showSnackBar', "Message Sent Successfully!")
                this.isLoading = false
            } else if (response.error) {
                parentEpml.request('showSnackBar', response.message)
                this.isLoading = false
            } else {
                parentEpml.request('showSnackBar', "Sending failed, Please retry...")
                this.isLoading = false
            }
        }

        // Exec..
        getAddressPublicKey()
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
