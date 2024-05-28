import { css, html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../store'
import { listenForRequest } from '../transactionRequest'
import { confirmTransactionDialogStyles } from '../styles/core-css'
import '@material/mwc-button'
import '@polymer/paper-dialog/paper-dialog.js'

// Multi language support
import { get, translate } from '../../translate'

class ConfirmTransactionDialog extends connect(store)(LitElement) {
	static get properties() {
		return {
			txInfo: { type: Object },
			theme: { type: String, reflect: true }
		}
	}

	static get styles() {
		return [confirmTransactionDialogStyles]
	}

	constructor() {
		super()
		this.transaction = {
			template: html`Awaiting transaction info`
		}
		this.txInfo = html``
		listenForRequest(args => this.requestTransaction(args))
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
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

	firstUpdated() {
		// ...
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

	stateChanged(state) {
		this.loggedIn = state.app.loggedIn
	}
}

window.customElements.define('confirm-transaction-dialog', ConfirmTransactionDialog)

const txDialog = document.createElement('confirm-transaction-dialog')
export const requestTransactionDialog = document.body.appendChild(txDialog)