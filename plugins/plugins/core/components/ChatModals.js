import {css, html, LitElement} from 'lit'
import {Epml} from '../../../epml'
import snackbar from './snackbar.js'
import {get, translate} from '../../../../core/translate'
import '@material/mwc-button'
import '@material/mwc-dialog'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ChatModals extends LitElement {
    static get properties() {
        return {
            openDialogPrivateMessage: { type: Boolean },
            openDialogBlockUser: { type: Boolean },
            isLoading: { type: Boolean },
            nametodialog: { type: String, attribute: true },
            hidePrivateMessageModal: { type: Function },
            hideBlockUserModal: { type: Function },
            toblockaddress: { type: String, attribute: true },
            chatBlockedAdresses: { type: Array }
        }
    }

    constructor() {
        super()
        this.isLoading = false
        this.hidePrivateMessageModal = () => { }
        this.hideBlockUserModal = () => { }
        this.chatBlockedAdresses = []
    }

    static get styles() {
        return css`
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

    .close-button {
        display:block;
        --mdc-theme-primary: red;
    }
    `
    }

    firstUpdated() {

        const stopKeyEventPropagation = (e) => {
            e.stopPropagation();
            return false;
        }

        this.shadowRoot.getElementById('sendTo').addEventListener('keydown', stopKeyEventPropagation);
        this.shadowRoot.getElementById('messageBox').addEventListener('keydown', stopKeyEventPropagation);

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

    // Send Private Message

    _sendMessage() {
        this.isLoading = true;

        const recipient = this.shadowRoot.getElementById('sendTo').value;
        const messageBox = this.shadowRoot.getElementById('messageBox');
        const messageText = messageBox.value;

        if (recipient.length === 0) {
            this.isLoading = false
        } else if (messageText.length === 0) {
            this.isLoading = false
        } else {
            this.sendMessage()
        }
    }

    async sendMessage() {
        this.isLoading = true
        const _recipient = this.shadowRoot.getElementById('sendTo').value
        const messageBox = this.shadowRoot.getElementById('messageBox')
        const messageText = messageBox.value
        let recipient;

        const validateName = async (receiverName) => {
            let myRes;
            let myNameRes = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/names/${receiverName}`
            });

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
        let _reference = new Uint8Array(64)
        window.crypto.getRandomValues(_reference)

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
                let err1string = get('welcomepage.wcchange7')
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

            const _chatBytesArray = Object.keys(chatBytes).map(function (key) { return chatBytes[key]; })
            const chatBytesArray = new Uint8Array(_chatBytesArray)
            const chatBytesHash = new window.parent.Sha256().process(chatBytesArray).finish().result
            const hashPtr = window.parent.sbrk(32, window.parent.heap)
            const hashAry = new Uint8Array(window.parent.memory.buffer, hashPtr, 32)
            hashAry.set(chatBytesHash)

            const difficulty = this.balance < 4 ? 18 : 8

            const workBufferLength = 8 * 1024 * 1024;
            const workBufferPtr = window.parent.sbrk(workBufferLength, window.parent.heap)

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
                messageBox.value = ''
                let err2string = get('welcomepage.wcchange8')
                parentEpml.request('showSnackBar', `${err2string}`)
                this.isLoading = false
                this.shadowRoot.querySelector('#startPmDialog').close()
            } else if (response.error) {
                parentEpml.request('showSnackBar', response.message)
                this.isLoading = false
                this.shadowRoot.querySelector('#startPmDialog').close()
            } else {
                let err3string = get('welcomepage.wcchange9')
                parentEpml.request('showSnackBar', `${err3string}`)
                this.isLoading = false
                this.shadowRoot.querySelector('#startPmDialog').close()
            }

        }
        await getAddressPublicKey()
    }

    _textArea(e) {
        if (e.keyCode === 13 && !e.shiftKey) this._sendMessage()
    }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.apiKey
    }

    getChatBlockedList() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const blockedAddressesUrl = `${nodeUrl}/lists/blockedAddresses?apiKey=${this.getApiKey()}`
        const err3string = 'No regitered name'

        localStorage.removeItem("ChatBlockedAddresses")

        var obj = []

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


    // Chat Block Address

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
            this.hideBlockUserModal()
            let err1string = get("blockpage.bcchange2")
            snackbar.add({
                labelText: `${err1string}`,
                dismiss: true
            })
            this.relMessages()
        } else {
            this.hideBlockUserModal()
            let err2string = get("blockpage.bcchange2")
            snackbar.add({
                labelText: `${err2string}`,
                dismiss: true
            })
        }
        return ret
    }

    render() {
        return html`
          <mwc-dialog
          id='sendPMDialog'
          tabindex='0'
          ?open=${this.openDialogPrivateMessage}
          scrimClickAction='${this.isLoading ? '' : 'close'}'
          escapeKeyAction='close'
          defaultAction='close'
          @blur=${() => this.hidePrivateMessageModal()}
            >
          <div style='text-align:center'>
              <h1>${translate('welcomepage.wcchange2')}</h1>
              <hr>
          </div>
          <p>${translate('welcomepage.wcchange3')}</p>
          <textarea class='input' ?disabled=${this.isLoading} id='sendTo' rows='1'>${this.nametodialog}</textarea>
          <p style='margin-bottom:0;'>
              <textarea class='textarea' @keydown=${(e) => this._textArea(e)} ?disabled=${this.isLoading} id='messageBox' placeholder='${translate('welcomepage.wcchange5')}' rows='1'></textarea>
          </p>
          <mwc-button ?disabled='${this.isLoading}' slot='primaryAction' @click=${() => {
                this._sendMessage();
            }
            }>${translate('welcomepage.wcchange6')}
        </mwc-button>
          <mwc-button
              ?disabled='${this.isLoading}'
              slot='secondaryAction'
              @click='${() => this.hidePrivateMessageModal()}'
              class='close-button'
          >
          ${translate('general.close')}
          </mwc-button>
      </mwc-dialog>
        <mwc-dialog
        id='blockNameDialog'
        tabindex='0'
        ?open=${this.openDialogBlockUser}
        escapeKeyAction='close'
        defaultAction='close'
        @blur=${() => this.hideBlockUserModal()}
        >
            <div style='text-align:center'>
                <h1>${translate('blockpage.bcchange5')}</h1>
                <hr>
                <h2>${translate('blockpage.bcchange6')}</h2><br>
                <h2>${this.nametodialog}</h2>
            </div>
            <mwc-button
                slot='secondaryAction'
                @click='${() => this.chatBlockAddress()}'
                class='block'
            >
            ${translate('general.yes')}
            </mwc-button>
            <mwc-button
                slot='primaryAction'
                @click='${() => this.hideBlockUserModal()}'
                class='close-button'
            >
            ${translate('general.no')}
            </mwc-button>
        </mwc-dialog>
    `;
    }
}

customElements.define('chat-modals', ChatModals)
