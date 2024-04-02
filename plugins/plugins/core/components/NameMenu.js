import {css, html, LitElement} from 'lit'
import {Epml} from '../../../epml.js'
import snackbar from './snackbar.js'
import {get, translate} from '../../../../core/translate'
import '@material/mwc-snackbar'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-icon'
import '@polymer/paper-tooltip/paper-tooltip.js'
import '@polymer/paper-spinner/paper-spinner-lite.js'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class NameMenu extends LitElement {
    static get properties() {
        return {
            toblockaddress: { type: String, attribute: true },
            nametodialog: { type: String, attribute: true },
            chatBlockedAdresses: { type: Array },
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
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --mdc-theme-secondary: var(--mdc-theme-primary);
                --mdc-dialog-content-ink-color: var(--black);
                --mdc-theme-surface: var(--white);
                --mdc-theme-text-primary-on-background: var(--black);
                --paper-input-container-focus-color: var(--mdc-theme-primary);
                --lumo-primary-text-color: rgb(0, 167, 245);
                --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
                --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
                --lumo-primary-color: hsl(199, 100%, 48%);
                --lumo-base-color: var(--white);
                --lumo-body-text-color: var(--black);
            }

            a {
                background-color: transparent;
                color: var(--black);
                text-decoration: none;
                display: inline;
                position: relative;
            }

            a:hover {
                background-color: transparent;
                color: var(--black);
                text-decoration: none;
                display: inline;
                position: relative;
            }

            a:after {
                content: '';
                position: absolute;
                width: 100%;
                transform: scaleX(0);
                height: 2px;
                bottom: 0;
                left: 0;
                background-color: #03a9f4;
                transform-origin: bottom right;
                transition: transform 0.25s ease-out;
            }

            a:hover:after {
                transform: scaleX(1);
                transform-origin: bottom left;
            }

            .block {
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

            .custom {
                --paper-tooltip-background: #03a9f4;
                --paper-tooltip-text-color: #fff;
            }

            .dropdown {
                position: relative;
                display: inline;
            }

            .dropdown a:hover {
                background-color: transparent;
            }

            .dropdown-content {
                display: none;
                position: absolute;
                bottom: 25px;
                left: 10px;
                background-color: var(--white);
                min-width: 200px;
                overflow: auto;
                border: 1px solid transparent;
                border-radius: 10px;
                box-shadow: var(--qchatshadow);
                z-index: 1;
            }

            .dropdown-content span {
                color: var(--nav-text-color);
                text-align: center;
                padding-top: 12px;
                display: block;
            }

            .dropdown-content a {
                color: var(--nav-text-color);
                padding: 12px 12px;
                text-decoration: none;
                display: block;
            }

            .dropdown-content a:hover {
                background-color: var(--nav-color-hover);
            }

            .showList {
                display: block;
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
        this.chatBlockedAdresses = []
        this.selectedAddress = window.parent.reduxStore.getState().app.selectedAddress.address
        this.myAddress = {}
        this.balance = 1
        this.messages = []
        this.btnDisable = false
        this.isLoading = false
    }

    render() {
        return html`
            <div class="dropdown">
                <a class="block" id="myNameMenu" href="#" @click="${() => this.myMenu()}">${this.nametodialog}</a>
                <paper-tooltip class="custom" for="myNameMenu" position="right">${translate("blockpage.bcchange7")}</paper-tooltip>
                <div id="myDropdown" class="dropdown-content">
                    <span>${this.nametodialog}</span>
                    <hr style="color: var(--nav-text-color); border-radius: 90%;">
                    <a href="#" @click="${() => this.shadowRoot.querySelector('#blockNameDialog').show()}">${translate("blockpage.bcchange1")}</a>
                    <a href="#" @click="${() => this.copyToClipboard(this.toblockaddress)}">${translate("blockpage.bcchange8")}</a>
                    <a href="#" @click="${() => this.shadowRoot.querySelector('#startPmDialog').show()}">${translate("blockpage.bcchange9")}</a>
                    <a class="block" href="#" @click="${() => this.myMenu()}">${translate("general.close")}</a>
                </div>
            </div>
            <mwc-dialog id="blockNameDialog">
                <div style="text-align:center">
                    <h1>${translate("blockpage.bcchange5")}</h1>
                    <hr>
                    <h2>${translate("blockpage.bcchange6")}</h2><br>
                    <h2>${this.nametodialog}</h2>
                </div>
                <mwc-button
                    slot="secondaryAction"
                    @click="${() => this.chatBlockAddress()}"
                    class="block"
                >
                ${translate("general.yes")}
                </mwc-button>
                <mwc-button
                    slot="primaryAction"
                    @click="${() => this.myMenu()}"
                    class="block red"
                >
                ${translate("general.no")}
                </mwc-button>
            </mwc-dialog>
            <mwc-dialog id="startPmDialog" scrimClickAction="${this.isLoading ? '' : 'close'}">
                <div style="text-align:center">
                    <h1>${translate("welcomepage.wcchange2")}</h1>
                    <hr>
                </div>
                <p>${translate("welcomepage.wcchange3")}</p>
                <textarea class="input" ?disabled=${this.isLoading} id="sendTo" rows="1">${this.nametodialog}</textarea>
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
                    @click="${() => this.myMenu()}"
                    class="block red"
                >
                ${translate("general.close")}
                </mwc-button>
            </mwc-dialog>
        `
    }

    firstUpdated() {
        this.getChatBlockedAdresses()

        setInterval(() => {
            this.getChatBlockedAdresses()
        }, 60000)

        window.onclick = function (event) {
            if (!event.target.matches('.block')) {
                var dropdowns = document.getElementsByClassName('dropdown-content');
                var i;
                for (i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('showList')) {
                        openDropdown.classList.remove('showList');
                    }
                }
            }
        }

        const stopKeyEventPropagation = (e) => {
            e.stopPropagation()
            return false
        }

        this.shadowRoot.getElementById('sendTo').addEventListener('keydown', stopKeyEventPropagation)
        this.shadowRoot.getElementById('messageBox').addEventListener('keydown', stopKeyEventPropagation)

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

        })
        parentEpml.imReady()
    }

    myMenu() {
        this.shadowRoot.getElementById('myDropdown').classList.toggle('showList')
        this.shadowRoot.querySelector('#blockNameDialog').close()
        this.shadowRoot.querySelector('#startPmDialog').close()
    }

    closeMenu() {
        this.shadowRoot.getElementById('myDropdown').classList.toggle('showList')
        var dropdowns = document.getElementsByClassName('dropdown-content');
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('showList')) {
                openDropdown.classList.remove('showList');
            }
        }
    }

    async copyToClipboard(text) {
        try {
            let copyString1 = get("walletpage.wchange4")
            await navigator.clipboard.writeText(text)
            parentEpml.request('showSnackBar', `${copyString1}`)
            this.closeMenu()
        } catch (err) {
            let copyString2 = get("walletpage.wchange39")
            parentEpml.request('showSnackBar', `${copyString2}`)
            console.error('Copy to clipboard error:', err)
            this.closeMenu()
        }
    }

    relMessages() {
        setTimeout(() => {
            window.location.href = window.location.href.split('#')[0]
        }, 500)
    }

    async getChatBlockedAdresses() {
		this.chatBlockedAdresses = await parentEpml.request('apiCall', {
			url: `/lists/blockedAddresses?apiKey=${this.getApiKey()}`
		})
    }

    async chatBlockAddress() {
        let address = this.toblockaddress

        let items = [
            address
        ]

        let addressJsonString = JSON.stringify({ "items": items })

        let ret = await parentEpml.request('apiCall', {
            url: `/lists/blockedAddresses?apiKey=${this.getApiKey()}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: `${addressJsonString}`
        })

        if (ret === true) {
            this.chatBlockedAdresses = this.chatBlockedAdresses.filter(item => item != address)
            this.chatBlockedAdresses.push(address)
            this.getChatBlockedList()
            this.closeMenu()
            this.shadowRoot.querySelector('#blockNameDialog').close()
            let err1string = get("blockpage.bcchange2")
            snackbar.add({
                labelText: `${err1string}`,
                dismiss: true
            })
            this.relMessages()
        } else {
            this.closeMenu()
            this.shadowRoot.querySelector('#blockNameDialog').close()
            let err2string = get("blockpage.bcchange2")
            snackbar.add({
                labelText: `${err2string}`,
                dismiss: true
            })
        }
        return ret
    }

    getChatBlockedList() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const blockedAddressesUrl = `${nodeUrl}/lists/blockedAddresses?apiKey=${this.getApiKey()}`
        const err3string = 'No registered name'

        localStorage.removeItem("ChatBlockedAddresses")

        var obj = [];

        fetch(blockedAddressesUrl).then(response => {
            return response.json()
        }).then(data => {
            return data.map(item => {
                const noName = {
                    name: err3string,
                    owner: item
                }
                fetch(`${nodeUrl}/names/address/${item}?limit=0&reverse=true`).then(res => {
                    return res.json()
                }).then(jsonRes => {
                    if (jsonRes.length) {
                        jsonRes.map(item => {
                            obj.push(item)
                        })
                    } else {
                        obj.push(noName)
                    }
                    localStorage.setItem("ChatBlockedAddresses", JSON.stringify(obj))
                })
            })
        })
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
                let err1string = get("welcomepage.wcchange7")
                parentEpml.request('showSnackBar', `${err1string}`)
                this.isLoading = false
            } else if (addressPublicKey !== false) {
                isEncrypted = 1
                _publicKey = addressPublicKey
                await sendMessageRequest(isEncrypted, _publicKey)
            } else {
                isEncrypted = 0
                _publicKey = this.selectedAddress.address
                await sendMessageRequest(isEncrypted, _publicKey)
            }
        };

        const sendMessageRequest = async (isEncrypted, _publicKey) => {
            const messageObject = {
                messageText,
                images: [''],
                repliedTo: '',
                version: 1
            }
            const stringifyMessageObject = JSON.stringify(messageObject)
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
                this.closeMenu()
            } else if (response.error) {
                parentEpml.request('showSnackBar', response.message)
                this.isLoading = false
                this.closeMenu()
            } else {
                let err3string = get("welcomepage.wcchange9")
                parentEpml.request('showSnackBar', `${err3string}`)
                this.isLoading = false
                this.closeMenu()
            }

        }
        await getAddressPublicKey()
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

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.apiKey
    }
}

window.customElements.define('name-menu', NameMenu)
