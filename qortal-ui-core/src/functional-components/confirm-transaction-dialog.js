import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'

import { listenForRequest } from '../transactionRequest.js'

import '@polymer/paper-dialog/paper-dialog.js'
import '@material/mwc-button'

class ConfirmTransactionDialog extends connect(store)(LitElement) {
    static get properties() {
        return {
            txInfo: { type: Object }
        }
    }

    static get styles() {
        return css`
            .decline {
                --mdc-theme-primary: var(--mdc-theme-error)
            }
            #txInfo {
                text-align:left;
                max-width:520px;
            }

            .buttons {
                text-align:right;
            }
            table td, th{
                padding:4px;
                text-align:left;
                font-size:14px;
            }
        `
    }

    constructor() {
        super()
        this.transaction = {
            template: html`Awaiting transaction info`
        }
        this.txInfo = html``
        listenForRequest(args => this.requestTransaction(args))
    }

    render() {
        return html`
            <style>
                
            </style>

            <paper-dialog id="confirmDialog" modal>
                <h2>Transaction request</h2>
                <div id="txInfo">
                    ${this.txInfo}
                </div>
                <div class="buttons">
                    <mwc-button class='decline' @click=${e => this.decline(e)} dialog-dismiss>Decline</mwc-button>
                    <mwc-button class='confirm' @click=${e => this.confirm(e)} dialog-confirm autofocus>Confirm</mwc-button>
                </div>
            </paper-dialog>
        `
    }

    stateChanged(state) {
        this.loggedIn = state.app.loggedIn
    }

    requestTransaction(transaction) {
        this.shadowRoot.getElementById('confirmDialog').open()
        this.transaction = transaction
        this.txInfo = transaction.render(html)

        return new Promise((resolve, reject) => {
            this._resolve = resolve
            this._reject = reject
        })
    }

    confirm(e) {
        this._resolve({
            success: true
        })
    }

    decline(e) {

        this._reject(new Error('User declined transaction'))
    }
}

window.customElements.define('confirm-transaction-dialog', ConfirmTransactionDialog)

const txDialog = document.createElement('confirm-transaction-dialog')
export const requestTransactionDialog = document.body.appendChild(txDialog)
