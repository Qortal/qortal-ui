import { LitElement, html } from 'lit'
import { render } from 'lit/html.js'
import { tipUserStyles } from './TipUser-css.js'
import { Epml } from '../../../epml'
import '@vaadin/button'
import '@polymer/paper-progress/paper-progress.js'
import { use, get, translate, translateUnsafeHTML, registerTranslateConfig } from 'lit-translate'

const parentEpml = new Epml({ type: "WINDOW", source: window.parent });

export class TipUser extends LitElement {
  static get properties() {
		return {
        userName: { type: String },
        walletBalance: { type: Number },
        sendMoneyLoading: { type: Boolean },
        closeTipUser: { type: Boolean },
        btnDisable: { type: Boolean },
        errorMessage: { type: String },
        successMessage: { type: String },
        setOpenTipUser: { attribute: false },
        }
	}

  constructor() {
		super()
        this.sendMoneyLoading = false
        this.btnDisable = false
        this.errorMessage = ""
        this.successMessage = ""
        this.myAddress = window.parent.reduxStore.getState().app.selectedAddress
    }

    static styles = [tipUserStyles]

   async firstUpdated() {
      await this.fetchWalletDetails()
    }

    updated(changedProperties) {
        if (changedProperties && changedProperties.has("closeTipUser")) {
            if (this.closeTipUser) {
                this.shadowRoot.getElementById("amountInput").value = ""
                this.errorMessage = ""
                this.successMessage = ""
            }
        }
    }

    async getLastRef() {
		let myRef = await parentEpml.request("apiCall", {
			type: "api",
			url: `/addresses/lastreference/${this.myAddress.address}`,
		})
		return myRef
	}

    renderSuccessText() {
        return html`${translate("chatpage.cchange55")}`
    }

    renderReceiverText() {
        return html`${translate("chatpage.cchange54")}`
    }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        let apiKey = myNode.apiKey
        return apiKey
    }

    async fetchWalletDetails() {
        await parentEpml.request('apiCall', {
            url: `/addresses/balance/${this.myAddress.address}?apiKey=${this.getApiKey()}`,
        })
        .then((res) => {
            if (isNaN(Number(res))) {
                let snack4string = get("chatpage.cchange48")
                parentEpml.request('showSnackBar', `${snack4string}`)
            } else {
                this.walletBalance = Number(res).toFixed(8)
            }
        })					 
    }

    async sendQort() {
    const amount = this.shadowRoot.getElementById("amountInput").value
    let recipient = this.userName
    this.sendMoneyLoading = true
    this.btnDisable = true

    if (parseFloat(amount) + parseFloat(0.001) > parseFloat(this.walletBalance)) {
        this.sendMoneyLoading = false
        this.btnDisable = false
        let snack1string = get("chatpage.cchange51")
        parentEpml.request('showSnackBar', `${snack1string}`)
        return false
    }

    if (parseFloat(amount) <= 0) {
        this.sendMoneyLoading = false
        this.btnDisable = false
        let snack2string = get("chatpage.cchange52")
        parentEpml.request('showSnackBar', `${snack2string}`)
        return false
    }

    if (recipient.length === 0) {
        this.sendMoneyLoading = false
        this.btnDisable = false
        let snack3string = get("chatpage.cchange53")
        parentEpml.request('showSnackBar', `${snack3string}`)
        return false
    }

    const validateName = async (receiverName) => {
        let myRes
        let myNameRes = await parentEpml.request('apiCall', {
            type: 'api',
            url: `/names/${receiverName}`,
        })

        if (myNameRes.error === 401) {
            myRes = false
        } else {
            myRes = myNameRes
        }
        return myRes;
    }

    const validateAddress = async (receiverAddress) => {
        let myAddress = await window.parent.validateAddress(receiverAddress)
        return myAddress
    }

    const validateReceiver = async (recipient) => {
        let lastRef = await this.getLastRef()
        let isAddress

        try {
            isAddress = await validateAddress(recipient)
        } catch (err) {
            isAddress = false
        }

        if (isAddress) {
            let myTransaction = await makeTransactionRequest(recipient, lastRef)
            getTxnRequestResponse(myTransaction)
        } else {
            let myNameRes = await validateName(recipient)
            if (myNameRes !== false) {
                let myNameAddress = myNameRes.owner
                let myTransaction = await makeTransactionRequest(myNameAddress, lastRef)
                getTxnRequestResponse(myTransaction)
            } else {
                console.error(this.renderReceiverText())
                this.errorMessage = this.renderReceiverText()
                this.sendMoneyLoading = false
                this.btnDisable = false
            }
        }
    }

    const getName = async (recipient)=> {
        try {
            const getNames = await parentEpml.request("apiCall", {
            type: "api",
            url: `/names/address/${recipient}`,
            });

            if (getNames?.length > 0 ) {
                return getNames[0].name
            } else {
                return ''
            }
        } catch (error) {
            return ""
        }
    }

    const makeTransactionRequest = async (receiver, lastRef) => {
        let myReceiver = receiver
        let mylastRef = lastRef
        let dialogamount = get("transactions.amount")
        let dialogAddress = get("login.address")
        let dialogName = get("login.name")
        let dialogto = get("transactions.to")
        let recipientName = await getName(myReceiver)
        let myTxnrequest = await parentEpml.request('transaction', {
            type: 2,
            nonce: this.myAddress.nonce,
            params: {
                recipient: myReceiver,
                recipientName: recipientName,
                amount: amount,
                lastReference: mylastRef,
                fee: 0.001,
                dialogamount: dialogamount,
                dialogto: dialogto,
                dialogAddress,
                dialogName
            },
        })
        return myTxnrequest
    }

    const getTxnRequestResponse = (txnResponse) => {
        if (txnResponse.success === false && txnResponse.message) {
            this.errorMessage = txnResponse.message
            this.sendMoneyLoading = false
            this.btnDisable = false
            throw new Error(txnResponse)
        } else if (txnResponse.success === true && !txnResponse.data.error) {
            this.shadowRoot.getElementById('amountInput').value = ''
            this.errorMessage = ''
            this.successMessage = this.renderSuccessText()
            this.sendMoneyLoading = false
            this.btnDisable = false
            setTimeout(() => {
                this.setOpenTipUser(false)
                this.successMessage = ""
            }, 3000)
        } else {
            this.errorMessage = txnResponse.data.message
            this.sendMoneyLoading = false
            this.btnDisable = false
            throw new Error(txnResponse)
        }
    }
    validateReceiver(recipient)
    }

  render() {
    return html`
      <div class="tip-user-header">      
        <img src="/img/qort.png" width="32" height="32">
        <p class="tip-user-header-font">${translate("chatpage.cchange43")} ${this.userName}</p>
      </div>
      <div class="tip-user-body">
        <p class="tip-available">${translate("chatpage.cchange47")}: ${this.walletBalance} QORT</p>
        <input id="amountInput" class="tip-input" type="number" placeholder="${translate("chatpage.cchange46")}" />
        <p class="tip-available">${translate("chatpage.cchange49")}: 0.001 QORT</p>
        ${this.sendMoneyLoading ? 
            html` 
            <paper-progress indeterminate style="width: 100%; margin: 4px;">
            </paper-progress>` 
            : html`
            <div style=${"text-align: center;"}>
                <vaadin-button 
                    ?disabled=${this.btnDisable}
                    theme="primary medium" 
                    style="width: 100%; cursor: pointer" 
                    @click=${() => this.sendQort()}>
                    <vaadin-icon icon="vaadin:arrow-forward" slot="prefix"></vaadin-icon>
                    ${translate("chatpage.cchange50")} QORT
                </vaadin-button>
            </div>
        `}

        ${this.successMessage ? 
            html`
            <p class="success-msg">
                ${this.successMessage}
            </p>
            `
        : this.errorMessage ? 
            html`
            <p class="error-msg">
                ${this.errorMessage}
            </p>
            `
        : null}
      </div>
    `;
  }
}
customElements.define('tip-user', TipUser)
