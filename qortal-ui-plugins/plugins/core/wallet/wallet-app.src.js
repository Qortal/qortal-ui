import { LitElement, html, css } from 'lit-element'
import { render } from 'lit-html'
import { Epml } from '../../../epml.js'

import '../components/ButtonIconCopy'

import '@material/mwc-icon'
import '@material/mwc-button'
import '@material/mwc-dialog'

import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/vaadin-grid/vaadin-grid.js'
import '@vaadin/vaadin-grid/theme/material/all-imports.js'

import '@github/time-elements'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })
const coinsNames=['qort','btc','ltc','doge']

class MultiWallet extends LitElement {
	static get properties() {
		return {
			loading: { type: Boolean },
			transactions: { type: Object },
			lastBlock: { type: Object },
			selectedTransaction: { type: Object },
			isTextMenuOpen: { type: Boolean },
			wallets:{type : Map},
			_selectedWallet:'qort',
			balanceString:'Fetching balance ...'
		}
	}

	static get styles() {
		return [
			css`
				#pages {
					display: flex;
					flex-wrap: wrap;
					/* margin: 20px; */
					padding: 10px 5px 5px 5px;
					margin: 0px 20px 20px 20px;
				}

				#pages > button {
					user-select: none;
					padding: 5px;
					margin: 0 5px;
					border-radius: 10%;
					border: 0;
					background: transparent;
					font: inherit;
					outline: none;
					cursor: pointer;
				}

				#pages > button:not([disabled]):hover,
				#pages > button:focus {
					color: #ccc;
					background-color: #eee;
				}

				#pages > button[selected] {
					font-weight: bold;
					color: white;
					background-color: #ccc;
				}

				#pages > button[disabled] {
					opacity: 0.5;
					cursor: default;
				}
				.red {
					color: var(--paper-red-500);
				}
				.green {
					color: var(--paper-green-500);
				}
				paper-spinner-lite {
					height: 75px;
					width: 75px;
					--paper-spinner-color: var(--primary-color);
					--paper-spinner-stroke-width: 2px;
				}
				.unconfirmed {
					font-style: italic;
				}
				.roboto {
					font-family: 'Roboto', sans-serif;
				}
				.mono {
					font-family: 'Roboto Mono', monospace;
				}
				.weight-100 {
					font-weight: 100;
				}

				.text-white-primary {
					color: var(--white-primary);
				}
				.text-white-secondary {
					color: var(--white-secondary);
				}
				.text-white-disabled {
					color: var(--white-disabled);
				}
				.text-white-hint {
					color: var(--white-divider);
				}

				table {
					border: none;
				}
				table td,
				th {
					white-space: nowrap;
					/* padding:10px; */
					text-align: left;
					font-size: 14px;
					padding: 0 12px;
					font-family: 'Roboto', sans-serif;
				}
				table tr {
					height: 48px;
				}
				table tr:hover td {
					background: #eee;
				}
				table tr th {
					color: #666;
					font-size: 12px;
				}
				table tr td {
					margin: 0;
				}
				.white-bg {
					height: 100vh;
					background: #fff;
				}
				span {
					font-size: 18px;
					word-break: break-all;
				}
				.title {
					font-weight: 600;
					font-size: 12px;
					line-height: 32px;
					opacity: 0.66;
				}
				#transactionList {
					padding: 0;
				}
				#transactionList > * {
					/* padding-left:24px;
                padding-right:24px; */
				}
				.color-in {
					color: #02977e;
					background-color: rgba(0, 201, 167, 0.2);
					font-weight: 700;
					font-size: 0.60938rem;
					border-radius: 0.25rem !important;
					padding: 0.2rem 0.5rem;
					margin-left: 4px;
				}
				.color-out {
					color: #b47d00;
					background-color: rgba(219, 154, 4, 0.2);
					font-weight: 700;
					font-size: 0.60938rem;
					border-radius: 0.25rem !important;
					padding: 0.2rem 0.5rem;
					margin-left: 4px;
				}
				* {
					box-sizing: border-box;
				}

				body {
					margin: 0;
					padding: 0;
					background: white;
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;
				}

				h2 {
					margin: 0;
					font-weight: 400;
					color: #707584;
					font: 24px/24px 'Open Sans', sans-serif;
				}

				h3 {
					margin: 0 0 5px;
					font-weight: 600;
					font-size: 18px;
					line-height: 18px;
				}

				/* Styles for Larger Screen Sizes */
				@media (min-width: 765px) {
					.wrapper {
						display: grid;
						grid-template-columns: 0.5fr 3.5fr;
					}
				}

				.wrapper {
					margin: 0 auto;
					height: 100%;
					overflow: hidden;
					border-radius: 8px;
					background-color: #fff;
				}

				.wallet {
					width: 170px;
					height: 100vh;
					border-top-left-radius: inherit;
					border-bottom-left-radius: inherit;
    				border-right: 1px solid #eee;
				}

				.transactions-wrapper {
					width: 100%;
					padding: 50px 0 0 0;
					height: 100%;
				}

				.wallet-header {
					margin: 0 20px;
				}

				.wallet-address {
					display: flex;
					align-items: center;
					font-size: 18px; 
					color: var(--mdc-theme-primary, #444750); 
					margin: 4px 0 20px;
				}

				.wallet-balance {
					display: inline-block;
					font-weight: 600;
					font-size: 32px;
					color: var(--mdc-theme-primary, #444750); 
				}

				#transactions {
					margin-top: 60px;
					margin-left: 20px;
					margin-right: 20px;
					border-top: 1px solid #e5e5e5;
					padding-top: 0px;
					height: 100%;
					/* overflow: auto; */
				}

				.show {
					animation: fade-in 0.3s 1;
				}

				.transaction-item {
					display: flex;
					justify-content: space-between;
					position: relative;
					padding-left: 40px;
					margin-bottom: 45px;
					margin-right: 50px;
				}
				.transaction-item::before {
					position: absolute;
					content: '';
					border: 2px solid #e1e1e1;
					border-radius: 50%;
					height: 25px;
					width: 25px;
					left: 0;
					top: 10px;
					box-sizing: border-box;
					vertical-align: middle;
					color: #666666;
				}

				.credit::before {
					content: '+';
					font-size: 25px;
					line-height: 19px;
					padding: 0 4px 0;
				}

				.debit::before {
					content: '-';
					font-size: 20px;
					line-height: 21px;
					padding: 0 5px;
				}

				.transaction-item .details {
					font-size: 14px;
					line-height: 14px;
					color: #999;
				}

				.transaction-item_details {
					width: 270px;
				}

				.transaction-item_amount .amount {
					font-weight: 600;
					font-size: 18px;
					line-height: 45px;
					position: relative;
					margin: 0;
					display: inline-block;
				}

				.currency-box {
				  display: flex;
					background-color: #fff;
					text-align: center;
					padding: 12px;
					cursor: pointer;
					transition: 0.1s ease-in-out;
				}
				.currency-box:not(:last-child) {
				  border-bottom: 1px solid #eee;
				}

				.active {
				  background: #ddd;
				}

				.currency-image {
					display: inline-block;
					height: 42px;
					width: 42px;
					background-repeat: no-repeat;
					background-size: cover;
					border-radius: 3px;
    			filter: grayscale(100%);
				}
				.currency-box.active .currency-image,
				.currency-box:hover .currency-image {
				  filter: none;
				}
				.currency-box:hover {
				  background: #bbb;
				}
				.currency-box.active,
				.currency-box:hover .currency-text {
				  font-weight: 500;
				}				
				
				.currency-text {
				  margin: auto 0;
				  margin-left: 8px;
					font-size: 20px;
					color: #777;
				}

				.qort .currency-image {
					background-image: url('/img/qort.png');
				}

				.btc .currency-image {
					background-image: url('/img/btc.png');
				}

				.ltc .currency-image {
					background-image: url('/img/ltc.png');
				}

				.doge .currency-image {
					background-image: url('/img/doge.png');
				}

				.card-list {
					margin-top: 20px;
				}

				.card-list .currency-image {
					cursor: pointer;
					margin-right: 15px;
					transition: 0.1s;
				}

				.card-list .currency-image:hover {
					transform: scale(1.1);
				}

				/* animations */
				@keyframes fade-in {
					0% {
						opacity: 0;
					}
					100% {
						opacity: 1;
					}
				}

				/* media queries */
				@media (max-width: 863px) {
					.wallet {
						width: 100%;
						height: max-content;
						border-top-right-radius: inherit;
						padding-bottom: 25px;
					}
					.cards {
						margin-top: 25px;
					}
					.currency-box:nth-of-type(2) {
						margin-right: 0;
					}
				}

				@media (max-width: 764px) {
					.wallet {
						width: 100%;
						height: max-content;
						border-top-right-radius: inherit;
						padding-bottom: 25px;
					}
					.cards {
						margin-top: 25px;
					}
					.currency-box {
						width: calc(50% - 25px);
						max-width: 260px;
						display: inline-block;
						margin-right: 25px;
						margin-bottom: 25px;
					}
					.currency-box:nth-of-type(2) {
						margin-right: 0;
					}
				}

				@media (max-width: 530px) {
					h3 {
						line-height: 24px;
					}
					.cards {
						text-align: center;
					}
					.currency-box {
						width: calc(100% - 25px);
						max-width: 260px;
					}
					.currency-box:nth-of-type(2) {
						margin-right: 25px;
					}
					.currency-box:last-of-type {
						margin-bottom: 0;
					}
					.wallet-balance {
						font-size: 22px;
					}
				}

				@media (max-width: 390px) {
					.wallet {
						height: max-content;
						padding: 50px 25px;
					}
					.transactions-wrapper {
						padding: 50px 25px;
					}
					h2 {
						font: 18px/24px 'Open Sans', sans-serif;
					}
				}
			`,
		]
	}

	constructor() {
		super()
		
		this.lastBlock = {
			height: 0,
		}
		

		this.selectedTransaction = {}
		this.isTextMenuOpen = false
		this.loading = true

		this.selectWallet = this.selectWallet.bind(this)

		this.wallets=new Map()
		let coinProp={
			balance:0,
			wallet:null,
			transactions:[],
			fetchingWalletBalance:false,
			fetchingWalletTransactions:false
		}
		coinsNames.forEach((c,i)=>{//reset fetching status, c:coin, i:index
			this.wallets.set(c,{...coinProp})
		},this)//thisArg=this

		this.wallets.get('qort').wallet = window.parent.reduxStore.getState().app.selectedAddress
		this.wallets.get('btc').wallet  = window.parent.reduxStore.getState().app.selectedAddress.btcWallet
		this.wallets.get('ltc').wallet  = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet
		this.wallets.get('doge').wallet  = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet

		this._selectedWallet='qort'

		parentEpml.ready().then(() => {
			parentEpml.subscribe('selected_address', async (selectedAddress) => {
				selectedAddress = JSON.parse(selectedAddress)
				if (!selectedAddress || Object.entries(selectedAddress).length === 0) return
				
				this.wallets.get('qort').wallet = selectedAddress
				this.wallets.get('btc').wallet  = window.parent.reduxStore.getState().app.selectedAddress.btcWallet
				this.wallets.get('ltc').wallet  = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet
				this.wallets.get('doge').wallet  = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet
				// this.updateAccountTransactions();
			})

			parentEpml.subscribe('copy_menu_switch', async (value) => {
				if (value === 'false' && this.isTextMenuOpen === true) {
					this.clearSelection()
					this.isTextMenuOpen = false
				}
			})
		})
	}

	render() {
		return html`
			<div class="wrapper">
				<div class="wallet">
					<div style="font-size: 20px; color: #777; padding: 16px; border-bottom: 1px solid #eee;">Wallets</div>
					<div class="cards">
						<div coin="qort" class="currency-box qort active">
							<div class="currency-image"></div>
							<div class="currency-text">Qort</div>
						</div>
						<div coin="btc" class="currency-box btc">
							<div class="currency-image"></div>
							<div class="currency-text">Bitcoin</div>
						</div>
						<div coin="ltc" class="currency-box ltc">
							<div class="currency-image"></div>
							<div class="currency-text">Litecoin</div>
						</div>
						<div coin="doge" class="currency-box doge">
							<div class="currency-image"></div>
							<div class="currency-text">Dogecoin</div>
						</div>
					</div>
				</div>

				<div class="transactions-wrapper">
					<h2 class="wallet-header">
						Current Wallet
						<div class="wallet-address">
							<span>${this.getSelectedWalletAddress()}</span>
							<button-icon-copy 
								title="Copy wallet address to clipboard"
								onSuccessMessage="Address copied to clipboard"
								onErrorMessage="Unable to copy address"
								textToCopy=${this.getSelectedWalletAddress()}
								buttonSize="28px"
								iconSize="16px"
								color="#707584"
								offsetLeft="4px"
							>
							</button-icon-copy> 
						</div>
						<span class="wallet-balance">${this.balanceString}</span>
					</h2>
					<div id="transactions">
						${this.loading ? html`<paper-spinner-lite style="display: block; margin: 0 auto;" active></paper-spinner-lite>` : ''}
						<div id="transactionsDOM"></div>
					</div>
				</div>

				<div>
					<mwc-dialog id="showTransactionDetailsDialog" scrimClickAction="${this.showTransactionDetailsLoading ? '' : 'close'}">
						<div style="text-align:center">
							<h1>Transaction Details</h1>
							<hr />
						</div>
						<div id="transactionList">
							<span class="title"> Transaction Type </span>
							<br />
							<div>
								<span class="">${this.selectedTransaction.type}</span>
								${this.selectedTransaction.txnFlow === 'OUT' ? html`<span class="color-out">OUT</span>` : html`<span class="color-in">IN</span>`}
							</div>
							<span class="title">Sender</span>
							<br />
							<div><span class="">${this.selectedTransaction.creatorAddress}</span></div>
							<span class="title">Receiver</span>
							<br />
							<div><span class="">${this.selectedTransaction.recipient}</span></div>
							${!this.selectedTransaction.amount
								? ''
								: html`
										<span class="title">Amount</span>
										<br />
										<div><span class="">${this.selectedTransaction.amount} QORT</span></div>
								  `}
							<span class="title"> Transaction Fee </span>
							<br />
							<div><span class="">${this.selectedTransaction.fee}</span></div>

							<span class="title">Block</span>
							<br />
							<div><span class="">${this.selectedTransaction.blockHeight}</span></div>

							<span class="title">Time</span>
							<br />
							<div><span class="">${new Date(this.selectedTransaction.timestamp).toString()}</span></div>

							<span class="title"> Transaction Signature </span>
							<br />
							<div><span class="">${this.selectedTransaction.signature}</span></div>
						</div>
					</mwc-dialog>
				</div>
			</div>
		`
	}

	getSelectedWalletAddress() {
		return this._selectedWallet === 'qort'
			? this.wallets.get(this._selectedWallet).wallet.address
			: this.wallets.get(this._selectedWallet).wallet.address
	}
		

	async getTransactionGrid(coin) {
		this.transactionsGrid = this.shadowRoot.querySelector(`#${coin}TransactionsGrid`)
		if (coin === 'qort') {
			this.transactionsGrid.addEventListener(
				'click',
				(e) => {
					let myItem = this.transactionsGrid.getEventContext(e).item
					this.showTransactionDetails(myItem, this.wallets.get(this._selectedWallet).transactions)
				},
				{ passive: true }
			)
		}

		this.pagesControl = this.shadowRoot.querySelector('#pages')
		this.pages = undefined
	}

	async renderTransactions() {
		if (this._selectedWallet === 'qort') {
			render(this.renderQortTransactions(this.wallets.get(this._selectedWallet).transactions, this._selectedWallet), this.transactionsDOM)
		} else {
			render(this.renderBTCLikeTransactions(this.wallets.get(this._selectedWallet).transactions, this._selectedWallet), this.transactionsDOM)
		}
	}

	renderQortTransactions(transactions, coin) {
		const requiredConfirmations = 3 // arbitrary value
		// initially `currentBlockHeight` might not be set in the store
		const currentBlockHeight = window.parent.reduxStore.getState().app.blockInfo.height
		if (Array.isArray(transactions)) {
			transactions = transactions.map(tx => {
				tx.confirmations = (currentBlockHeight - (tx.blockHeight - 1)) || ''
				return tx
			})
		}

		return html`
			<dom-module id="vaadin-grid-qort-theme" theme-for="vaadin-grid">
				<template>
					<style>
						:host([theme~="qort"]) table thead tr > th:first-of-type,
						:host([theme~="qort"]) table tbody tr > td:first-of-type {
							min-width: 56px;
							max-width: 56px;
							padding: 4px 0;
						}
					</style>
				</template>
			</dom-module>
			<div style="padding-left:12px;" ?hidden="${!this.isEmptyArray(transactions)}">Address has no transactions yet.</div>
			<vaadin-grid theme="${coin}" id="${coin}TransactionsGrid" ?hidden="${this.isEmptyArray(this.wallets.get(this._selectedWallet).transactions)}" page-size="20" height-by-rows>
				<vaadin-grid-column
					auto-width
					.renderer=${(root, column, data) => {
						if (!currentBlockHeight) {
							return render(html``, root)
						}
						const confirmed = data.item.confirmations >= requiredConfirmations
						if (confirmed) {
							render(html`<mwc-icon title="${ data.item.confirmations } Confirmations" style="color: #00C851">check</mwc-icon>`, root)
						} else {
							render(html`<mwc-icon title="${ data.item.confirmations || 0 }/${ requiredConfirmations } Confirmations" style="color: #777">schedule</mwc-icon>`, root)
						}
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					resizable
					header="Type"
					.renderer=${(root, column, data) => {
						render(html` ${data.item.type} ${data.item.creatorAddress === this.wallets.get('qort').wallet.address ? html`<span class="color-out">OUT</span>` : html`<span class="color-in">IN</span>`} `, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column auto-width resizable header="Sender" path="creatorAddress"></vaadin-grid-column>
				<vaadin-grid-column auto-width resizable header="Receiver" path="recipient"></vaadin-grid-column>
				<vaadin-grid-column auto-width resizable path="fee"></vaadin-grid-column>
				<vaadin-grid-column auto-width resizable path="amount"></vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					resizable
					header="Time"
					.renderer=${(root, column, data) => {
						const time = new Date(data.item.timestamp)
						render(html` <time-ago datetime=${time.toISOString()}> </time-ago> `, root)
					}}
				>
				</vaadin-grid-column>
			</vaadin-grid>
			<div id="pages"></div>
		`
	}

	renderBTCLikeTransactions(transactions, coin) {
		return html`
			<div style="padding-left:12px;" ?hidden="${!this.isEmptyArray(transactions)}">Address has no transactions yet.</div>
			<vaadin-grid id="${coin}TransactionsGrid" ?hidden="${this.isEmptyArray(this.wallets.get(this._selectedWallet).transactions)}" page-size="20" height-by-rows>
				<vaadin-grid-column auto-width resizable header="Transaction Hash" path="txHash"></vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					resizable
					header="Total Amount"
					.renderer=${(root, column, data) => {
						const amount = (Number(data.item.totalAmount) / 1e8).toFixed(8)
						render(html`${amount}`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					resizable
					header="Time"
					.renderer=${(root, column, data) => {
						const time = new Date(data.item.timestamp * 1000)
						render(html` <time-ago datetime=${time.toISOString()}> </time-ago> `, root)
					}}
				>
				</vaadin-grid-column>
			</vaadin-grid>
			<div id="pages"></div>
		`
	}

	async updateItemsFromPage(page, changeWallet = false) {
		if (page === undefined) {
			return
		}

		changeWallet === true ? (this.pagesControl.innerHTML = '') : null

		if (!this.pages) {
			this.pages = Array.apply(null, { length: Math.ceil(this.wallets.get(this._selectedWallet).transactions.length / this.transactionsGrid.pageSize) }).map((item, index) => {
				return index + 1
			})

			const prevBtn = document.createElement('button')
			prevBtn.textContent = '<'
			prevBtn.addEventListener('click', () => {
				const selectedPage = parseInt(this.pagesControl.querySelector('[selected]').textContent)
				this.updateItemsFromPage(selectedPage - 1)
			})
			this.pagesControl.appendChild(prevBtn)

			this.pages.forEach((pageNumber) => {
				const pageBtn = document.createElement('button')
				pageBtn.textContent = pageNumber
				pageBtn.addEventListener('click', (e) => {
					this.updateItemsFromPage(parseInt(e.target.textContent))
				})
				if (pageNumber === page) {
					pageBtn.setAttribute('selected', true)
				}
				this.pagesControl.appendChild(pageBtn)
			})

			const nextBtn = window.document.createElement('button')
			nextBtn.textContent = '>'
			nextBtn.addEventListener('click', () => {
				const selectedPage = parseInt(this.pagesControl.querySelector('[selected]').textContent)
				this.updateItemsFromPage(selectedPage + 1)
			})
			this.pagesControl.appendChild(nextBtn)
		}

		const buttons = Array.from(this.pagesControl.children)
		buttons.forEach((btn, index) => {
			if (parseInt(btn.textContent) === page) {
				btn.setAttribute('selected', true)
			} else {
				btn.removeAttribute('selected')
			}
			if (index === 0) {
				if (page === 1) {
					btn.setAttribute('disabled', '')
				} else {
					btn.removeAttribute('disabled')
				}
			}
			if (index === buttons.length - 1) {
				if (page === this.pages.length) {
					btn.setAttribute('disabled', '')
				} else {
					btn.removeAttribute('disabled')
				}
			}
		})
		let start = (page - 1) * this.transactionsGrid.pageSize
		let end = page * this.transactionsGrid.pageSize

		this.transactionsGrid.items = this.wallets.get(this._selectedWallet).transactions.slice(start, end)
	}

	_textMenu(event) {
		const getSelectedText = () => {
			var text = ''
			if (typeof window.getSelection != 'undefined') {
				text = window.getSelection().toString()
			} else if (typeof this.shadowRoot.selection != 'undefined' && this.shadowRoot.selection.type == 'Text') {
				text = this.shadowRoot.selection.createRange().text
			}
			return text
		}
		const checkSelectedTextAndShowMenu = () => {
			let selectedText = getSelectedText()
			if (selectedText && typeof selectedText === 'string') {
				let _eve = { pageX: event.pageX, pageY: event.pageY, clientX: event.clientX, clientY: event.clientY }

				let textMenuObject = { selectedText: selectedText, eventObject: _eve, isFrame: true }

				parentEpml.request('openCopyTextMenu', textMenuObject)
			}
		}

		checkSelectedTextAndShowMenu()
	}

	clearSelection() {
		window.getSelection().removeAllRanges()
		window.parent.getSelection().removeAllRanges()
	}

	transactionItem(transactionObject) {
		return `
            <div class='transaction-item ${transactionObject.type}'>
                <div class='transaction-item_details'>
                    <h3>${transactionObject.name}</h3>
                    <span class='details'>${transactionObject.category} ${transactionObject.ID} - ${transactionObject.date}</span>
                </div>
                <div class='transaction-item_amount'>
                    <p class='amount'>${transactionObject.amount}</p>
                </div>
            </div>
        `
	}

	firstUpdated() {
		// DOM refs
		this.currencyBoxes = this.shadowRoot.querySelectorAll('.currency-box')
		this.transactionsDOM = this.shadowRoot.getElementById('transactionsDOM')

		// Attach eventlisteners to the cuurency boxes
		this.currencyBoxes.forEach((currencyBox) => {
			currencyBox.addEventListener('click', this.selectWallet)
		})

		this.showWallet()

		window.addEventListener('contextmenu', (event) => {
			event.preventDefault()
			this.isTextMenuOpen = true
			this._textMenu(event)
		})
		window.addEventListener('click', () => {
			if (this.isTextMenuOpen) {
				parentEpml.request('closeCopyTextMenu', null)
			}
		})
		window.onkeyup = (e) => {
			if (e.keyCode === 27) {
				parentEpml.request('closeCopyTextMenu', null)
			}
		}
	}

	selectWallet(event) {
		event.preventDefault()
	
		const target = event.currentTarget

		// if (target.classList.contains('active')) return
		// removed to allow one click wallet refresh

		this.currencyBoxes.forEach((currencyBox) => {
			if (currencyBox.classList.contains('active')) {
				currencyBox.classList.remove('active')
			}
		})
		target.classList.add('active')
		this._selectedWallet=target.attributes.coin.value
		this.showWallet()
	}

async showWallet(){
	this.transactionsDOM.hidden = true
	this.loading = true

	if (this._selectedWallet=='qort') {
			if (!window.parent.reduxStore.getState().app.blockInfo.height) {
				// we make sure that `blockHeight` is set before rendering QORT transactions
				await parentEpml.request('apiCall', { url: `/blocks/height`, type: 'api' })
					.then(height => parentEpml.request('updateBlockInfo', { height }))
			}
	}
	const coin=this._selectedWallet
	await this.fetchWalletDetails(this._selectedWallet)
	if(this._selectedWallet == coin){//if the wallet didn't switch
			await this.renderTransactions()
		await this.getTransactionGrid(this._selectedWallet)
		await this.updateItemsFromPage(1, true)
		this.loading = false
		this.transactionsDOM.hidden = false
	}
}	
	async fetchWalletDetails(coin){//this function will fetch the balance and transactions of the given wallet
			this.balanceString="Fetching balance ..."
			switch (coin) {
				case 'qort':					
					//fetching the qort balance
						parentEpml
							.request('apiCall', {
								url: `/addresses/balance/${this.wallets.get('qort').wallet.address}`,
							})
							.then((res) => {
								if (isNaN(Number(res))) {
									parentEpml.request('showSnackBar', `Failed to Fetch QORT Balance. Try again!`)
								} else {
									if(this._selectedWallet==coin){//check if we are still fetching wallet balance ...
										this.wallets.get(coin).balance = res
										this.balanceString=this.wallets.get(this._selectedWallet).balance+" "+this._selectedWallet.toLocaleUpperCase()
									}
								}
							})
					//fetching the qort transactions						
						const txsQort = await parentEpml.request('apiCall', {
							url: `/transactions/search?address=${this.wallets.get('qort').wallet.address}&confirmationStatus=BOTH&reverse=true`,
						})
						if(this._selectedWallet==coin)
							this.wallets.get(coin).transactions = txsQort
						
						break
				case 'btc':
				case 'ltc':
				case 'doge':
				//fetching the balance
					const walletName = `${coin}Wallet`
					parentEpml
						.request('apiCall', {
							url: `/crosschain/${coin}/walletbalance`,
							method: 'POST',
							body: `${window.parent.reduxStore.getState().app.selectedAddress[walletName].derivedMasterPublicKey}`,
						})
						.then((res) => {
							if (isNaN(Number(res))) {
								parentEpml.request('showSnackBar', `Failed to Fetch ${coin.toLocaleUpperCase()} Balance. Try again!`)
							} else {
								if(this._selectedWallet==coin){//check if we are still fetching wallet balance ...
									this.wallets.get(this._selectedWallet).balance = (Number(res) / 1e8).toFixed(8)
									this.balanceString=this.wallets.get(this._selectedWallet).balance+" "+this._selectedWallet.toLocaleUpperCase()
								}
							}
						})
				//fetching transactions
					const txs = await parentEpml.request('apiCall', {
						url: `/crosschain/${coin}/wallettransactions`,
						method: 'POST',
						body: `${window.parent.reduxStore.getState().app.selectedAddress[walletName].derivedMasterPublicKey}`,
					})
					const compareFn = (a, b) => {
						return b.timestamp - a.timestamp
					}
					const sortedTransactions = txs.sort(compareFn)

					if(this._selectedWallet==coin){
						this.wallets.get(this._selectedWallet).transactions = sortedTransactions
					}
					break
				default:
					break
			}
	}

	showTransactionDetails(myTransaction, allTransactions) {
		allTransactions.forEach((transaction) => {
			if (myTransaction.signature === transaction.signature) {
				// Do something...
				let txnFlow = myTransaction.creatorAddress === this.wallets.get('qort').wallet.address ? 'OUT' : 'IN'
				this.selectedTransaction = { ...transaction, txnFlow }
				if (this.selectedTransaction.signature.length != 0) {
					this.shadowRoot.querySelector('#showTransactionDetailsDialog').show()
				}
			}
		})
	}

	isEmptyArray(arr) {
		if (!arr) {
			return true
		}
		return arr.length === 0
	}

	floor(num) {
		num = parseFloat(num)
		return isNaN(num) ? 0 : this._format(Math.floor(num))
	}

	decimals(num) {
		num = parseFloat(num) // So that conversion to string can get rid of insignificant zeros
		// return isNaN(num) ? 0 : (num + "").split(".")[1]
		return num % 1 > 0 ? (num + '').split('.')[1] : '0'
	}

	subtract(num1, num2) {
		return num1 - num2
	}

	getConfirmations(height, lastBlockHeight) {
		return lastBlockHeight - height + 1
	}

	_format(num) {
		return num.toLocaleString()
	}

	textColor(color) {
		return color === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.87)'
	}
	_unconfirmedClass(unconfirmed) {
		return unconfirmed ? 'unconfirmed' : ''
	}
}

window.customElements.define('multi-wallet', MultiWallet)
