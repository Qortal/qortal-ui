import {html, LitElement} from 'lit'
import {tipUserStyles} from './TipUser-css.js'
import {Epml} from '../../../epml'
import '@vaadin/button'
import '@polymer/paper-progress/paper-progress.js'
import {get, translate} from '../../../../core/translate'

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
            qortPaymentFee: { type: Number }
        }
    }

    constructor() {
        super()
        this.sendMoneyLoading = false
        this.btnDisable = false
        this.errorMessage = ""
        this.successMessage = ""
        this.myAddress = window.parent.reduxStore.getState().app.selectedAddress
        this.qortPaymentFee = 0.01
    }

    static styles = [tipUserStyles]

    async firstUpdated() {
        await this.fetchWalletDetails()
        await this.paymentFee()
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
		return await parentEpml.request("apiCall", {
			type: "api",
			url: `/addresses/lastreference/${this.myAddress.address}`,
		})
    }

    async getSendQortFee() {
        let sendFee = await parentEpml.request('apiCall', {
            type: "api",
            url: `/transactions/unitfee?txType=PAYMENT`
        })
        return (Number(sendFee) / 1e8).toFixed(8)
    }

    async paymentFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/transactions/unitfee?txType=PAYMENT`
        await fetch(url).then((response) => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response)
        }).then((json) => {
            this.qortPaymentFee = (Number(json) / 1e8).toFixed(8)
        })
    }

    renderSuccessText() {
        return html`${translate("chatpage.cchange55")}`
    }

    renderReceiverText() {
        return html`${translate("chatpage.cchange54")}`
    }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.apiKey
    }

    async fetchWalletDetails() {

    }

    async sendQort() {
        const amount = this.shadowRoot.getElementById("amountInput").value;
        const recipient = this.userName;

        this.sendMoneyLoading = true;
        this.btnDisable = true;

        // Helper function to reset loading and button state
        const resetState = () => {
            this.sendMoneyLoading = false;
            this.btnDisable = false;
        }

        if (parseFloat(amount) + parseFloat(0.011) > parseFloat(this.walletBalance)) {
            resetState();
            const snack1string = get("chatpage.cchange51");
            parentEpml.request('showSnackBar', `${snack1string}`);
            return false;
        }

        if (parseFloat(amount) <= 0) {
            resetState();
            const snack2string = get("chatpage.cchange52");
            parentEpml.request('showSnackBar', `${snack2string}`);
            return false;
        }

        if (recipient.length === 0) {
            resetState();
            const snack3string = get("chatpage.cchange53");
            parentEpml.request('showSnackBar', `${snack3string}`);
            return false;
        }

        const validateName = async (receiverName) => {
            const myNameRes = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/names/${receiverName}`
            });
            return myNameRes.error === 401 ? false : myNameRes;
        };

        const validateAddress = async (receiverAddress) => {
            return window.parent.validateAddress(receiverAddress);
        };

        const getName = async (recipient) => {
            try {
                const getNames = await parentEpml.request("apiCall", {
                    type: "api",
                    url: `/names/address/${recipient}`
                });
                return getNames?.length > 0 ? getNames[0].name : '';
            } catch (error) {
                return "";
            }
        };

        const makeTransactionRequest = async (receiver, lastRef) => {
            const dialogAmount = get("transactions.amount");
            const dialogAddress = get("login.address");
            const dialogName = get("login.name");
            const dialogTo = get("transactions.to");
            const recipientName = await getName(receiver);

            return await parentEpml.request('transaction', {
                type: 2,
                nonce: this.myAddress.nonce,
                params: {
                    recipient: receiver,
                    recipientName: recipientName,
                    amount: amount,
                    lastReference: lastRef,
                    fee: this.qortPaymentFee,
                    dialogAmount,
                    dialogTo,
                    dialogAddress,
                    dialogName
                }
            });
        };

        const getTxnRequestResponse = (txnResponse) => {
            if (txnResponse.success === false && txnResponse.message) {
                this.errorMessage = txnResponse.message;
                resetState();
                throw new Error(txnResponse);
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.shadowRoot.getElementById('amountInput').value = '';
                this.errorMessage = '';
                this.successMessage = this.renderSuccessText();
                resetState();
                setTimeout(() => {
                    this.setOpenTipUser(false);
                    this.successMessage = "";
                }, 3000);
            } else {
                this.errorMessage = txnResponse.data.message;
                resetState();
                throw new Error(txnResponse);
            }
        };

        const validateReceiver = async (recipient) => {
            let lastRef = await this.getLastRef();
            let isAddress;

            try {
                isAddress = await validateAddress(recipient);
            } catch (err) {
                isAddress = false;
            }

            if (isAddress) {
                const myTransaction = await makeTransactionRequest(recipient, lastRef);
                getTxnRequestResponse(myTransaction);
            } else {
                const myNameRes = await validateName(recipient);
                if (myNameRes !== false) {
                    const myTransaction = await makeTransactionRequest(myNameRes.owner, lastRef);
                    getTxnRequestResponse(myTransaction);
                } else {
                    this.errorMessage = this.renderReceiverText();
                    resetState();
                }
            }
        };

        await validateReceiver(recipient);
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
        <p class="tip-available">${translate("chatpage.cchange49")}: ${this.qortPaymentFee} QORT</p>
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
