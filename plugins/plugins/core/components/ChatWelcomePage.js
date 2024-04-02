import {css, html, LitElement} from 'lit'
import {Epml} from '../../../epml.js'
import {get, registerTranslateConfig, translate, use} from '../../../../core/translate'
import isElectron from 'is-electron'

import '@material/mwc-icon'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/grid'

registerTranslateConfig({
    loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

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
            balance: { type: Number },
            theme: { type: String, reflect: true },
            setOpenPrivateMessage: { attribute: false }
        }
    }

    static get styles() {
        return css`
        * {
            --mdc-theme-primary: rgb(3, 169, 244);
            --paper-input-container-focus-color: var(--mdc-theme-primary);
            --lumo-primary-text-color: rgb(0, 167, 245);
            --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
            --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
            --lumo-primary-color: hsl(199, 100%, 48%);
            --lumo-base-color: var(--white);
            --lumo-body-text-color: var(--black);
        }

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
            color: var(--black);
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
            color: var(--black);
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
            color: var(--white);
            background: var(--tradehead);
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
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    render() {
        return html`
            <div>
                <div>
                    <span class="welcome-title">${translate("welcomepage.wcchange1")}</span>
                    <hr style="color: #eee; border-radius: 80%; margin-bottom: 2rem;">
                </div>
                <div class="sub-main">
                    <div class="center-box">
                        <mwc-icon class="img-icon">chat</mwc-icon><br>
                        <span style="font-size: 20px; color: var(--black);">${this.myAddress.address}</span>
                        <div
                            class="start-chat"
                            @click="${() => this.setOpenPrivateMessage({
            name: "",
            open: true
        })}">
                            ${translate("welcomepage.wcchange2")}
                        </div>
                    </div>
                </div>

                <!-- Start Chatting Dialog -->
                <mwc-dialog id="startSecondChatDialog" scrimClickAction="${this.isLoading ? '' : 'close'}">
                    <div style="text-align:center">
                        <h1>${translate("welcomepage.wcchange2")}</h1>
                        <hr>
                    </div>

                    <p>${translate("welcomepage.wcchange3")}</p>

                    <textarea class="input" ?disabled=${this.isLoading} id="sendTo" placeholder="${translate("welcomepage.wcchange4")}" rows="1"></textarea>
                    <p style="margin-bottom:0;">
                        <textarea class="textarea" @keydown=${(e) => this._textArea(e)} ?disabled=${this.isLoading} id="messageBox" placeholder="${translate("welcomepage.wcchange5")}" rows="1"></textarea>
                    </p>

                    <mwc-button ?disabled="${this.isLoading}" slot="primaryAction" @click=${() => {
                this._sendMessage();
            }
            }>
                    ${translate("welcomepage.wcchange6")}</mwc-button>
                    <mwc-button
                        ?disabled="${this.isLoading}"
                        slot="secondaryAction"
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
        this.changeTheme()
        this.changeLanguage()

        this.clearConsole()
        setInterval(() => {
            this.clearConsole()
        }, 60000)

        const stopKeyEventPropagation = (e) => {
            e.stopPropagation()
            return false
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

        window.addEventListener('storage', () => {
            const checkLanguage = localStorage.getItem('qortalLanguage')
            const checkTheme = localStorage.getItem('qortalTheme')

            use(checkLanguage)

            if (checkTheme) {
                this.theme = checkTheme
            } else {
                this.theme = 'light'
            }
            document.querySelector('html').setAttribute('theme', this.theme)
        })

        parentEpml.ready().then(() => {
            parentEpml.subscribe('selected_address', async selectedAddress => {
                this.selectedAddress = {}
                selectedAddress = JSON.parse(selectedAddress)
                if (!selectedAddress || Object.entries(selectedAddress).length === 0) return
                this.selectedAddress = selectedAddress
            })

        })

        parentEpml.imReady()
    }

    clearConsole() {
        if (!isElectron()) {
        } else {
            console.clear()
            window.parent.electronAPI.clearCache()
        }
    }

    changeTheme() {
        const checkTheme = localStorage.getItem('qortalTheme')
        if (checkTheme) {
            this.theme = checkTheme
        } else {
            this.theme = 'light'
        }
        document.querySelector('html').setAttribute('theme', this.theme)
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

    _sendMessage() {
        this.isLoading = true;
        const recipient = this.shadowRoot.getElementById('sendTo').value;
        const messageBox = this.shadowRoot.getElementById('messageBox');
        const messageText = messageBox.value;

        if (recipient.length === 0) {
            this.isLoading = false;
        } else if (messageText.length === 0) {
            this.isLoading = false;
        } else {
            this.sendMessage();
        }
    }

    async sendMessage() {
        this.isLoading = true;
        const _recipient = this.shadowRoot.getElementById('sendTo').value;
        const messageBox = this.shadowRoot.getElementById('messageBox');
        const messageText = messageBox.value;
        let recipient;

        const validateName = async (receiverName) => {
            let myRes;
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
        };

        const myNameRes = await validateName(_recipient);

        if (!myNameRes) {
            recipient = _recipient;
        } else {
            recipient = myNameRes.owner;
        }

        let _reference = new Uint8Array(64);
        window.crypto.getRandomValues(_reference);

        let sendTimestamp = Date.now();

        let reference = window.parent.Base58.encode(_reference);

        const getAddressPublicKey = async () => {
            let isEncrypted;
            let _publicKey;

            let addressPublicKey = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/publickey/${recipient}`
            })

            if (addressPublicKey.error === 102) {
                _publicKey = false;
                // Do something here...
                let err1string = get("welcomepage.wcchange7");
                parentEpml.request('showSnackBar', `${err1string}`);
                this.isLoading = false;
            } else if (addressPublicKey !== false) {
                isEncrypted = 1;
                _publicKey = addressPublicKey;
                await sendMessageRequest(isEncrypted, _publicKey);
            } else {
                isEncrypted = 0;
                _publicKey = this.selectedAddress.address;
                await sendMessageRequest(isEncrypted, _publicKey);
            }
        };

        const sendMessageRequest = async (isEncrypted, _publicKey) => {
            const messageObject = {
                messageText,
                images: [''],
                repliedTo: '',
                version: 3
            };
            const stringifyMessageObject = JSON.stringify(messageObject);
            let chatResponse = await parentEpml.request('chat', {
                type: 18,
                nonce: this.selectedAddress.nonce,
                params: {
                    timestamp: sendTimestamp,
                    recipient: recipient,
                    recipientPublicKey: _publicKey,
                    hasChatReference: 0,
                    message: stringifyMessageObject,
                    lastReference: reference,
                    proofOfWorkNonce: 0,
                    isEncrypted: isEncrypted,
                    isText: 1
                }
            })
            await _computePow(chatResponse)
        }

        const _computePow = async (chatBytes) => {

            const _chatBytesArray = Object.keys(chatBytes).map(function (key) { return chatBytes[key]; });
            const chatBytesArray = new Uint8Array(_chatBytesArray)
            const chatBytesHash = new window.parent.Sha256().process(chatBytesArray).finish().result
            const hashPtr = window.parent.sbrk(32, window.parent.heap);
            const hashAry = new Uint8Array(window.parent.memory.buffer, hashPtr, 32);
            hashAry.set(chatBytesHash);

            const difficulty = this.balance < 4 ? 18 : 8;

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
                let err2string = get("welcomepage.wcchange8")
                parentEpml.request('showSnackBar', `${err2string}`)
                this.isLoading = false
            } else if (response.error) {
                parentEpml.request('showSnackBar', response.message)
                this.isLoading = false
            } else {
                let err3string = get("welcomepage.wcchange9")
                parentEpml.request('showSnackBar', `${err3string}`)
                this.isLoading = false
            }

        }
        await getAddressPublicKey()
    }

    _textArea(e) {
        if (e.keyCode === 13 && !e.shiftKey) this._sendMessage()
    }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.apiKey
    }
}

window.customElements.define('chat-welcome-page', ChatWelcomePage)
