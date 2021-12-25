import { LitElement, html, css } from 'lit-element'
import { render } from 'lit-html'
import { Epml } from '../../../epml.js'

import '@material/mwc-icon'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@polymer/paper-spinner/paper-spinner-lite.js'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ChatWelcomePage extends LitElement {
    static get properties() {
        return {
            selectedAddress: { type: Object },
            config: { type: Object },
            myAddress: { type: Object, reflect: true },
            messages: { type: Array },
            btnDisable: { type: Boolean },
            isLoading: { type: Boolean },
            balance: { type: Number }
        }
    }

    static get styles() {
        return css`
        @keyframes moveInBottom {
            0% {
                opacity: 0;
                transform: translateY(30px);
            }

            100% {
                opacity: 1;
                transform: translate(0);
            }
        }

        paper-spinner-lite{
            height: 24px;
            width: 24px;
            --paper-spinner-color: var(--mdc-theme-primary);
            --paper-spinner-stroke-width: 2px;
        }

        .welcome-title {
            display: block;
            overflow: hidden;
            font-size: 40px;
            color: black;
            font-weight: 400;
            text-align: center;
            white-space: pre-wrap;
            overflow-wrap: break-word;
            word-break: break-word;
            cursor: inherit;
            margin-top: 2rem;
        }

        .sub-main {
            position: relative;
            text-align: center;
        }

        .center-box {
            position: absolute;
            top: 45%;
            left: 50%;
            transform: translate(-50%, 0%);
            text-align: center;
        }

        .img-icon {
            font-size: 150px;
        }

        .start-chat {
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            align-content: center;
            border: none;
            border-radius: 20px;
            padding-left: 25px;
            padding-right: 25px;
            color: white;
            background: #6a6c75;
            width: 50%;
            font-size: 17px;
            cursor: pointer;
            height: 50px;
            margin-top: 1rem;
            text-transform: uppercase;
            text-decoration: none;
            transition: all .2s;
            position: relative;
            animation: moveInBottom .3s ease-out .50s;
            animation-fill-mode: backwards;
        }

        .start-chat:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, .2);
        }

        .start-chat::after {
            content: "";
            display: inline-flex;
            height: 100%;
            width: 100%;
            border-radius: 100px;
            position: absolute;
            top: 0;
            left: 0;
            z-index: -1;
            transition: all .4s;
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
            width: 90%;
            border: none;
            display: inline-block;
            font-size: 16px;
            padding: 10px 20px;
            border-radius: 5px;
            resize: none;
            background: #eee;
        }

        .textarea {
            width: 90%;
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
        this.selectedAddress = window.parent.reduxStore.getState().app.selectedAddress.address
        this.myAddress = {}
        this.balance = 1
        this.messages = []
        this.btnDisable = false
        this.isLoading = false
    }

    render() {
        return html`
            <div>
                <div>
                    <span class="welcome-title">Welcome to Q-Chat</span>
                    <hr style="color: #eee; border-radius: 80%; margin-bottom: 2rem;">
                </div>
                <div class="sub-main">
                    <div class="center-box">
                        <mwc-icon class="img-icon">chat</mwc-icon><br>
                        <span style="font-size: 20px;">${this.myAddress.address}</span>
                        <div class="start-chat" @click=${() => this.shadowRoot.querySelector('#startSecondChatDialog').show()}>New Private Message</div>
                    </div>
                </div>
                
                <!-- Start Chatting Dialog -->
                <mwc-dialog id="startSecondChatDialog" scrimClickAction="${this.isLoading ? '' : 'close'}">
                    <div style="text-align:center">
                        <h1>New Private Message</h1>
                        <hr>
                    </div>

                    <p>Type the name or address of who you want to chat with to send a private message!</p>
                    
                    <textarea class="input" ?disabled=${this.isLoading} id="sendTo" placeholder="Name / Address" rows="1"></textarea>
                    <p style="margin-bottom:0;">
                        <textarea class="textarea" @keydown=${(e) => this._textArea(e)} ?disabled=${this.isLoading} id="messageBox" placeholder="Message..." rows="1"></textarea>
                    </p>
                    
                    <mwc-button ?disabled="${this.isLoading}" slot="primaryAction" @click=${this._sendMessage}>Send</mwc-button>
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

        let configLoaded = false

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
                // Do something here...
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
}

window.customElements.define('chat-welcome-page', ChatWelcomePage)
