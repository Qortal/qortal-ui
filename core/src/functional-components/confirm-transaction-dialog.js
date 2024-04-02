import {css, html, LitElement} from 'lit'
import {connect} from 'pwa-helpers'
import {store} from '../store.js'
import {get, translate} from '../../translate'

import {listenForRequest} from '../transactionRequest.js'

import '@polymer/paper-dialog/paper-dialog.js'
import '@material/mwc-button'

class ConfirmTransactionDialog extends connect(store)(LitElement) {
    static get properties() {
        return {
            txInfo: { type: Object },
            theme: { type: String, reflect: true }
        }
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --mdc-theme-secondary: var(--mdc-theme-primary);
                --mdc-theme-surface: var(--white);
                --mdc-dialog-content-ink-color: var(--black);
            }

            .decline {
                --mdc-theme-primary: var(--mdc-theme-error)
            }

            #txInfo {
                text-align: left;
                max-width: 520px;
                color: var(--black);
            }

            .buttons {
                text-align:right;
            }

            table td, th{
                padding:4px;
                text-align:left;
                font-size:14px;
                color: var(--black);
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
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light';
    }

    render() {
        return html`
            <paper-dialog style="background: var(--white);" id="confirmDialog" modal>
                <h2 style="color: var(--black);">${translate("transpage.tchange1")}</h2>
                <div id="txInfo">
                    ${this.txInfo}
                </div>
                <div class="buttons">
                    <mwc-button class='decline' @click=${e => this.decline(e)} dialog-dismiss>${translate("transpage.tchange2")}</mwc-button>
                    <mwc-button class='confirm' @click=${e => this.confirm(e)} dialog-confirm autofocus>${translate("transpage.tchange3")}</mwc-button>
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
        const rejecterror = get("transactions.declined")
        this._reject(new Error(rejecterror))
    }
}

window.customElements.define('confirm-transaction-dialog', ConfirmTransactionDialog)

const txDialog = document.createElement('confirm-transaction-dialog')
export const requestTransactionDialog = document.body.appendChild(txDialog)
