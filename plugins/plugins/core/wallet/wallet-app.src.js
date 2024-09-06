import { html, LitElement } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../epml'
import { decryptData, encryptData } from '../../../../core/src/lockScreen'
import { multiWalletStyles } from '../components/plugins-css'
import isElectron from 'is-electron'
import FileSaver from 'file-saver'
import Base58 from '../../../../crypto/api/deps/Base58'
import '../components/ButtonIconCopy'
import '../components/QortalQrcodeGenerator'
import '../components/frag-file-input'
import '../components/time-elements/index'
import '@material/mwc-button'
import '@material/mwc-checkbox'
import '@material/mwc-dialog'
import '@material/mwc-formfield'
import '@material/mwc-icon'
import '@material/mwc-icon-button'
import '@material/mwc-tab-bar'
import '@material/mwc-textfield'
import '@polymer/iron-icons/iron-icons.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-progress/paper-progress.js'
import '@polymer/paper-slider/paper-slider.js'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@vaadin/button'
import '@vaadin/grid'
import '@vaadin/icon'
import '@vaadin/icons'
import '@vaadin/password-field'
import '@vaadin/tabs'
import '@vaadin/tabsheet'

// Multi language support
import { get, registerTranslateConfig, translate, use } from '../../../../core/translate'
registerTranslateConfig({
	loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

const coinsNames = ['qort', 'btc', 'ltc', 'doge', 'dgb', 'rvn', 'arrr']

class MultiWallet extends LitElement {
	static get properties() {
		return {
			loading: { type: Boolean },
			transactions: { type: Object },
			lastBlock: { type: Object },
			selectedTransaction: { type: Object },
			isTextMenuOpen: { type: Boolean },
			wallets: { type: Map },
			_selectedWallet: 'qort',
			nodeConfig: { type: Object },
			nodeDomain: { type: String },
			theme: { type: String, reflect: true },
			amount: { type: Number },
			recipient: { type: String },
			btcRecipient: { type: String },
			btcAmount: { type: Number },
			ltcRecipient: { type: String },
			ltcAmount: { type: Number },
			dogeRecipient: { type: String },
			dogeAmount: { type: Number },
			dgbRecipient: { type: String },
			dgbAmount: { type: Number },
			rvnRecipient: { type: String },
			rvnAmount: { type: Number },
			arrrRecipient: { type: String },
			arrrAmount: { type: Number },
			arrrMemo: { type: String },
			errorMessage: { type: String },
			arrrWalletAddress: { type: String },
			unusedWalletAddress: { type: String },
			successMessage: { type: String },
			sendMoneyLoading: { type: Boolean },
			btnDisable: { type: Boolean },
			qortWarning: { type: Boolean },
			isValidAmount: { type: Boolean },
			balance: { type: Number },
			balanceString: { type: String },
			btcServer: { type: Number },
			ltcServer: { type: Number },
			dogeServer: { type: Number },
			dgbServer: { type: Number },
			rvnServer: { type: Number },
			arrrServer: { type: Number },
			qortPaymentFee: { type: Number },
			btcFeePerByte: { type: Number },
			ltcFeePerByte: { type: Number },
			dogeFeePerByte: { type: Number },
			dgbFeePerByte: { type: Number },
			rvnFeePerByte: { type: Number },
			qortBook: { type: Array },
			btcBook: { type: Array },
			ltcBook: { type: Array },
			dogeBook: { type: Array },
			dgbBook: { type: Array },
			rvnBook: { type: Array },
			arrrBook: { type: Array },
			qortBookName: { type: String },
			btcBookName: { type: String },
			ltcBookName: { type: String },
			dogeBookName: { type: String },
			dgbBookName: { type: String },
			rvnBookName: { type: String },
			arrrBookName: { type: String },
			qortBookAddress: { type: String },
			btcBookAddress: { type: String },
			ltcBookAddress: { type: String },
			dogeBookAddress: { type: String },
			dgbBookAddress: { type: String },
			rvnBookAddress: { type: String },
			arrrBookAddress: { type: String },
			myElementId: { type: String },
			walletSalt: { type: String },
			walletStorageData: { type: String },
			walletLockScreenPass: { type: String },
			walletLockScreenSet: { type: String },
			walletLockPass: { type: String },
			walletLockSet: { type: String },
			myWalletLockScreenPass: { type: String },
			myWalletLockScreenSet: { type: String },
			walletHelperMessage: { type: String },
			bookQortalAddress: { type: String },
			bookBitcoinAddress: { type: String },
			bookLitecoinAddress: { type: String },
			bookDogecoinAddress: { type: String },
			bookDigibyteAddress: { type: String },
			bookRavencoinAddress: { type: String },
			bookPiratechainAddress: { type: String },
			visitedTab: { type: Number },
			searchOffset: { type: Number },
			searchLimit: { type: Number },
			counter: { type: Number },
			pageButtonsHidden: { type: Boolean }
		}
	}

	static get styles() {
		return [multiWalletStyles]
	}

	static get observers() {
		return ['_kmxKeyUp(amount)']
	}

	constructor() {
		super()
		this.lastBlock = {
			height: 0
		}
		this.balanceString = this.renderFetchText()
		this.selectedTransaction = {}
		this.isTextMenuOpen = false
		this.loading = true
		this.nodeConfig = {}
		this.nodeDomain = ''
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
		this.qortBook = []
		this.btcBook = []
		this.ltcBook = []
		this.dogeBook = []
		this.dgbBook = []
		this.rvnBook = []
		this.arrrBook = []
		this.qortBookName = ''
		this.btcBookName = ''
		this.ltcBookName = ''
		this.dogeBookName = ''
		this.dgbBookName = ''
		this.rvnBookName = ''
		this.arrrBookName = ''
		this.qortBookAddress = ''
		this.btcBookAddress = ''
		this.ltcBookAddress = ''
		this.dogeBookAddress = ''
		this.dgbBookAddress = ''
		this.rvnBookAddress = ''
		this.arrrBookAddress = ''
		this.recipient = ''
		this.btcRecipient = ''
		this.ltcRecipient = ''
		this.dogeRecipient = ''
		this.dgbRecipient = ''
		this.rvnRecipient = ''
		this.arrrRecipient = ''
		this.arrrMemo = ''
		this.arrrWalletAddress = ''
		this.unusedWalletAddress = ''
		this.btcServer = ''
		this.ltcServer = ''
		this.dogeServer = ''
		this.dgbServer = ''
		this.rvnServer = ''
		this.arrrServer = ''
		this.errorMessage = ''
		this.successMessage = ''
		this.myElementId = ''
		this.sendMoneyLoading = false
		this.isValidAmount = false
		this.btnDisable = false
		this.qortWarning = false
		this.balance = 0
		this.amount = 0
		this.btcAmount = 0
		this.ltcAmount = 0
		this.dogeAmount = 0
		this.dgbAmount = 0
		this.rvnAmount = 0
		this.arrrAmount = 0
		this.qortPaymentFee = 0.001
		this.btcFeePerByte = 100
		this.btcSatMinFee = 20
		this.btcSatMaxFee = 150
		this.ltcFeePerByte = 30
		this.ltcSatMinFee = 10
		this.ltcSatMaxFee = 100
		this.dogeFeePerByte = 1000
		this.dogeSatMinFee = 100
		this.dogeSatMaxFee = 10000
		this.dgbFeePerByte = 10
		this.dgbSatMinFee = 1
		this.dgbSatMaxFee = 100
		this.rvnFeePerByte = 1125
		this.rvnSatMinFee = 1000
		this.rvnSatMaxFee = 10000
		this.walletSalt = ''
		this.walletStorageData = ''
		this.walletLockScreenPass = ''
		this.walletLockScreenSet = ''
		this.walletLockPass = ''
		this.walletLockSet = ''
		this.myWalletLockScreenPass = ''
		this.myWalletLockScreenSet = ''
		this.walletHelperMessage = ''
		this.bookQortalAddress = ''
		this.bookBitcoinAddress = ''
		this.bookLitecoinAddress = ''
		this.bookDogecoinAddress = ''
		this.bookDigibyteAddress = ''
		this.bookRavencoinAddress = ''
		this.bookPiratechainAddress = ''
		this.visitedTab = 0
		this.searchOffset = 0
		this.searchLimit = 10
		this.counter = 1
		this.pageButtonsHidden = false
		this.wallets = new Map()

		let coinProp = {
			balance: 0,
			wallet: null,
			transactions: [],
			fetchingWalletBalance: false,
			fetchingWalletTransactions: false
		}

		coinsNames.forEach((c, i) => {
			this.wallets.set(c, { ...coinProp })
		}, this)

		this.wallets.get('qort').wallet = window.parent.reduxStore.getState().app.selectedAddress
		this.wallets.get('btc').wallet = window.parent.reduxStore.getState().app.selectedAddress.btcWallet
		this.wallets.get('ltc').wallet = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet
		this.wallets.get('doge').wallet = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet
		this.wallets.get('dgb').wallet = window.parent.reduxStore.getState().app.selectedAddress.dgbWallet
		this.wallets.get('rvn').wallet = window.parent.reduxStore.getState().app.selectedAddress.rvnWallet
		this.wallets.get('arrr').wallet = window.parent.reduxStore.getState().app.selectedAddress.arrrWallet

		this._selectedWallet = 'qort'

		parentEpml.ready().then(() => {
			parentEpml.subscribe('selected_address', async (selectedAddress) => {
				selectedAddress = JSON.parse(selectedAddress)
				if (!selectedAddress || Object.entries(selectedAddress).length === 0) return

				this.wallets.get('qort').wallet = selectedAddress
				this.wallets.get('btc').wallet = window.parent.reduxStore.getState().app.selectedAddress.btcWallet
				this.wallets.get('ltc').wallet = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet
				this.wallets.get('doge').wallet = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet
				this.wallets.get('dgb').wallet = window.parent.reduxStore.getState().app.selectedAddress.dgbWallet
				this.wallets.get('rvn').wallet = window.parent.reduxStore.getState().app.selectedAddress.rvnWallet
				this.wallets.get('arrr').wallet = window.parent.reduxStore.getState().app.selectedAddress.arrrWallet
			})
			parentEpml.subscribe('coin_balances', async (payload) => {
				const coinBalances = JSON.parse(payload)
				if (coinBalances[this._selectedWallet]) {
					const res = coinBalances[this._selectedWallet].fullValue
					let value = Number(res).toFixed(8)
					if (this._selectedWallet !== 'qort') {
						value = (Number(res) / 1e8).toFixed(8)
					}
					this.wallets.get(this._selectedWallet).balance = value
					this.balanceString = this.wallets.get(this._selectedWallet).balance + " " + this._selectedWallet.toLocaleUpperCase()
					this.balance = this.wallets.get(this._selectedWallet).balance
				}
			})
		})

		this.pingCoinBalancesController = this.pingCoinBalancesController.bind(this)
	}

	refreshWallet() {
		const coin = this._selectedWallet
		switch (coin) {
			case 'qort':
				this.tabWalletQort()
				break
			case 'arrr':
				this.tabWalletArrr()
				break
			case 'btc':
				this.tabWalletBtc()
				break;
			case 'ltc':
				this.tabWalletLtc()
				break;
			case 'doge':
				this.tabWalletDoge()
				break
			case 'dgb':
				this.tabWalletDgb()
				break;
			case 'rvn':
				this.tabWalletRvn()
				break
			default:
				break
		}
	}

	render() {
		return html`
			<div class="wrapper">
				<div class="header-title sans">
					${translate("walletpage.wchange22")} ${this.renderWalletLockButton()}
				</div>
				<div class="fullWidth">
					<hr class="hrstyle">
				</div>
				<mwc-tab-bar id="tabs-1" activeIndex="0">
					<mwc-tab label="Qortal" hasImageIcon minWidth @click="${(e) => this.tabWalletQort()}">
						<img slot="icon" width="24px" height="24px" src="/img/qort.png">
					</mwc-tab>
					<mwc-tab label="Bitcoin" hasImageIcon minWidth @click="${(e) => this.tabWalletBtc()}">
						<img slot="icon" width="24px" height="24px" src="/img/btc.png">
					</mwc-tab>
					<mwc-tab label="Litecoin" hasImageIcon minWidth @click="${(e) => this.tabWalletLtc()}">
						<img slot="icon" width="24px" height="24px" src="/img/ltc.png">
					</mwc-tab>
					<mwc-tab label="Dogecoin" hasImageIcon minWidth @click="${(e) => this.tabWalletDoge()}">
						<img slot="icon" width="24px" height="24px" src="/img/doge.png">
					</mwc-tab>
					<mwc-tab label="Digibyte" hasImageIcon minWidth @click="${(e) => this.tabWalletDgb()}">
						<img slot="icon" width="24px" height="24px" src="/img/dgb.png">
					</mwc-tab>
					<mwc-tab label="Ravencoin" hasImageIcon minWidth @click="${(e) => this.tabWalletRvn()}">
						<img slot="icon" width="24px" height="24px" src="/img/rvn.png">
					</mwc-tab>
					<mwc-tab label="Pirate Chain" hasImageIcon minWidth @click="${(e) => this.tabWalletArrr()}">
						<img slot="icon" width="24px" height="24px" src="/img/arrr.png">
					</mwc-tab>
				</mwc-tab-bar>
				<div class="transactions-wrapper">
					<h2 class="wallet-header">
						<div style="display:flex;align-items:center;gap:20px">
							${translate("walletpage.wchange2")}
							<vaadin-icon @click=${this.refreshWallet} style="cursor:pointer" icon="vaadin:refresh" slot="prefix"></vaadin-icon>
						</div>
						<div class="wallet-address" ?hidden="${this.getSelectedWalletAddress().length < 1}">
							<span>${this.getSelectedWalletAddress()}</span>
							<button-icon-copy
								title="${translate("walletpage.wchange3")}"
								onSuccessMessage="${translate("walletpage.wchange4")}"
								onErrorMessage="${translate("walletpage.wchange39")}"
								textToCopy=${this.getSelectedWalletAddress()}
								buttonSize="28px"
								iconSize="16px"
								color="var(--copybutton)"
								offsetLeft="4px"
							>
							</button-icon-copy>
						</div>
						<span class="wallet-balance">
							${this.balanceString}
						</span>
						<br>
						<span class="server-address">${this.getSelectedWalletServer()}</span>
						<br>
					</h2>
					<div class="send-pos" ?hidden="${this.getSelectedWalletAddress().length < 1}">
						${this.renderSendButton()}
					</div>
					<div class="book-pos" ?hidden="${this.getSelectedWalletAddress().length < 1}">
						${this.renderAddressbookButton()}
					</div>
					<div class="qrcode-pos" ?hidden="${this.getSelectedWalletAddress().length < 1}">
						<qortal-qrcode-generator data="${this.getSelectedWalletAddress()}" mode="octet" format="html" auto></qortal-qrcode-generator>
					</div>
					${this.renderTabTransactions()}
					<div id="transactions">
						${this.loading ? html`
							<paper-spinner-lite style="display: block; margin: 5px auto;" active></paper-spinner-lite>
						` : ''}
						<div id="transactionsDOM"></div>
					</div>
				</div>
				<mwc-dialog id="showTransactionDetailsDialog" scrimClickAction="${this.showTransactionDetailsLoading ? '' : 'close'}">
					<div style="text-align: center;">
						<h1>${translate("walletpage.wchange5")}</h1>
						<hr />
					</div>
					<div id="transactionList">
						<span class="title"> ${translate("walletpage.wchange6")} </span>
						<br />
						<div>
							<span>${this.selectedTransaction.type}</span>
							${this.selectedTransaction.txnFlow === 'OUT' ? html`<span class="color-out">${translate("walletpage.wchange7")}</span>` : html`<span class="color-in">${translate("walletpage.wchange8")}</span>`}
						</div>
						<span class="title"> ${translate("walletpage.wchange9")} </span>
						<br />
						<div><span>${this.selectedTransaction.type === 'AT' ? html`${this.selectedTransaction.atAddress}` : html`${this.selectedTransaction.creatorAddress}`}</span></div>
						<span class="title"> ${translate("walletpage.wchange10")} </span>
						<br />
						<div style="display: inline;">
							${this.selectedTransaction.type === 'DEPLOY_AT' ? html`${this.renderCAB()}` : html`${this.renderSQB()}`}
						</div>
						<br />
						${!this.selectedTransaction.amount ? '' : html`
						<span class="title"> ${translate("walletpage.wchange11")} </span>
						<br />
						<div><span>${this.selectedTransaction.amount} QORT</span></div>
						`}
						<span class="title"> ${translate("walletpage.wchange12")} </span>
						<br />
						<div><span>${this.selectedTransaction.fee}</span></div>
						<span class="title"> ${translate("walletpage.wchange13")} </span>
						<br />
						<div><span>${this.selectedTransaction.blockHeight}</span></div>
						<span class="title"> ${translate("walletpage.wchange14")} </span>
						<br />
						<div><span>${new Date(this.selectedTransaction.timestamp).toString()}</span></div>
						<span class="title"> ${translate("walletpage.wchange15")} </span>
						<br />
						<div><span>${this.selectedTransaction.signature}</span></div>
					</div>
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="showBtcTransactionDetailsDialog" scrimClickAction="${this.showBtcTransactionDetailsLoading ? '' : 'close'}">
					<div style="text-align: center;">
						<h1>${translate("walletpage.wchange5")}</h1>
						<hr />
					</div>
					<div id="transactionList">
						<span class="title"> ${translate("walletpage.wchange6")} </span>
						<br />
						<div>
							<span>${translate("walletpage.wchange40")}</span>
							${this.selectedTransaction.btcTxnFlow === 'OUT' ? html`<span class="color-out">${translate("walletpage.wchange7")}</span>` : html`<span class="color-in">${translate("walletpage.wchange8")}</span>`}
						</div>
						<span class="title"> ${translate("walletpage.wchange9")} </span>
						<br />
						<div>
							<span>${this.selectedTransaction.btcSender}</span>
						</div>
						<span class="title"> ${translate("walletpage.wchange10")} </span>
						<br />
						<div style="display: inline;">
							<span>${this.selectedTransaction.btcReceiver}</span>
							<paper-icon-button icon="icons:send" @click=${() => this.sendToBtcAddress()} title="${translate("walletpage.wchange46")}"></paper-icon-button>
							<paper-icon-button icon="icons:add-circle" @click=${() => this.openAddBtcAddressDialog()} title="${translate("walletpage.wchange49")}"></paper-icon-button>
						</div>
						<br />
						<span class="title"> ${translate("walletpage.wchange12")} </span>
						<br />
						<div>
							<span>${(this.selectedTransaction.feeAmount / 1e8).toFixed(8)} BTC</span>
						</div>
						<span class="title"> ${translate("walletpage.wchange37")} </span>
						<br />
						<div>
							<span>${(this.selectedTransaction.totalAmount / 1e8).toFixed(8)} BTC</span>
						</div>
						<span class="title"> ${translate("walletpage.wchange14")} </span>
						<br />
						<div><span>${new Date(this.selectedTransaction.timestamp).toString()}</span></div>
						<span class="title"> ${translate("walletpage.wchange16")} </span>
						<br />
						<div>
							<span>${this.selectedTransaction.txHash}</span>
						</div>
					</div>
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="showLtcTransactionDetailsDialog" scrimClickAction="${this.showLtcTransactionDetailsLoading ? '' : 'close'}">
					<div style="text-align: center;">
						<h1>${translate("walletpage.wchange5")}</h1>
						<hr />
					</div>
					<div id="transactionList">
						<span class="title"> ${translate("walletpage.wchange6")}e </span>
						<br />
						<div>
							<span>${translate("walletpage.wchange40")}</span>
							${this.selectedTransaction.ltcTxnFlow === 'OUT' ? html`<span class="color-out">${translate("walletpage.wchange7")}</span>` : html`<span class="color-in">${translate("walletpage.wchange8")}</span>`}
						</div>
						<span class="title"> ${translate("walletpage.wchange9")} </span>
						<br />
						<div>
							<span>${this.selectedTransaction.ltcSender}</span>
						</div>
						<span class="title"> ${translate("walletpage.wchange10")} </span>
						<br />
						<div style="display: inline;">
							<span>${this.selectedTransaction.ltcReceiver}</span>
							<paper-icon-button icon="icons:send" @click=${() => this.sendToLtcAddress()} title="${translate("walletpage.wchange46")}"></paper-icon-button>
							<paper-icon-button icon="icons:add-circle" @click=${() => this.openAddLtcAddressDialog()} title="${translate("walletpage.wchange49")}"></paper-icon-button>
						</div>
						<br />
						<span class="title"> ${translate("walletpage.wchange12")} </span>
						<br />
						<div>
							<span> ${(this.selectedTransaction.feeAmount / 1e8).toFixed(8)} LTC </span>
						</div>
						<span class="title"> ${translate("walletpage.wchange37")} </span>
						<br />
						<div>
							<span> ${(this.selectedTransaction.totalAmount / 1e8).toFixed(8)} LTC </span>
						</div>
						<span class="title"> ${translate("walletpage.wchange14")} </span>
						<br />
						<div><span>${new Date(this.selectedTransaction.timestamp).toString()}</span></div>
						<span class="title"> ${translate("walletpage.wchange16")} </span>
						<br />
						<div>
							<span>${this.selectedTransaction.txHash}</span>
						</div>
					</div>
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="showDogeTransactionDetailsDialog" scrimClickAction="${this.showDogeTransactionDetailsLoading ? '' : 'close'}">
					<div style="text-align: center;">
						<h1>${translate("walletpage.wchange5")}</h1>
						<hr />
					</div>
					<div id="transactionList">
						<span class="title"> ${translate("walletpage.wchange6")} </span>
						<br />
						<div>
							<span>${translate("walletpage.wchange40")}</span>
							${this.selectedTransaction.dogeTxnFlow === 'OUT' ? html`<span class="color-out">${translate("walletpage.wchange7")}</span>` : html`<span class="color-in">${translate("walletpage.wchange8")}</span>`}
						</div>
						<span class="title"> ${translate("walletpage.wchange9")} </span>
						<br />
						<div style="display: inline;">
							<span>${this.selectedTransaction.dogeSender}</span>
						</div>
						<br />
						<span class="title"> ${translate("walletpage.wchange10")} </span>
						<br />
						<div style="display: inline;">
							<span>${this.selectedTransaction.dogeReceiver}</span>
							<paper-icon-button icon="icons:send" @click=${() => this.sendToDogeAddress()} title="${translate("walletpage.wchange46")}"></paper-icon-button>
							<paper-icon-button icon="icons:add-circle" @click=${() => this.openAddDogeAddressDialog()} title="${translate("walletpage.wchange49")}"></paper-icon-button>
						</div>
						<br />
						<span class="title"> ${translate("walletpage.wchange12")} </span>
						<br />
						<div>
							<span>${(this.selectedTransaction.feeAmount / 1e8).toFixed(8)} DOGE</span>
						</div>
						<span class="title"> ${translate("walletpage.wchange37")} </span>
						<br />
						<div>
							<span>${(this.selectedTransaction.totalAmount / 1e8).toFixed(8)} DOGE</span>
						</div>
						<span class="title"> ${translate("walletpage.wchange14")} </span>
						<br />
						<div><span>${new Date(this.selectedTransaction.timestamp).toString()}</span></div>
						<span class="title"> ${translate("walletpage.wchange16")} </span>
						<br />
						<div>
							<span>${this.selectedTransaction.txHash}</span>
						</div>
					</div>
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="showDgbTransactionDetailsDialog" scrimClickAction="${this.showDgbTransactionDetailsLoading ? '' : 'close'}">
					<div style="text-align: center;">
						<h1>${translate("walletpage.wchange5")}</h1>
						<hr />
					</div>
					<div id="transactionList">
						<span class="title"> ${translate("walletpage.wchange6")} </span>
						<br />
						<div>
							<span>${translate("walletpage.wchange40")}</span>
							${this.selectedTransaction.dgbTxnFlow === 'OUT' ? html`<span class="color-out">${translate("walletpage.wchange7")}</span>` : html`<span class="color-in">${translate("walletpage.wchange8")}</span>`}
						</div>
						<span class="title"> ${translate("walletpage.wchange9")} </span>
						<br />
						<div>
							<span>${this.selectedTransaction.dgbSender}</span>
						</div>
						<span class="title"> ${translate("walletpage.wchange10")} </span>
						<br />
						<div style="display: inline;">
							<span>${this.selectedTransaction.dgbReceiver}</span>
							<paper-icon-button icon="icons:send" @click=${() => this.sendToDgbAddress()} title="${translate("walletpage.wchange46")}"></paper-icon-button>
							<paper-icon-button icon="icons:add-circle" @click=${() => this.openAddDgbAddressDialog()} title="${translate("walletpage.wchange49")}"></paper-icon-button>
						</div>
						<br />
						<span class="title"> ${translate("walletpage.wchange12")} </span>
						<br />
						<div>
							<span>${(this.selectedTransaction.feeAmount / 1e8).toFixed(8)} DGB</span>
						</div>
						<span class="title"> ${translate("walletpage.wchange37")} </span>
						<br />
						<div>
							<span>${(this.selectedTransaction.totalAmount / 1e8).toFixed(8)} DGB</span>
						</div>
						<span class="title"> ${translate("walletpage.wchange14")} </span>
						<br />
						<div><span>${new Date(this.selectedTransaction.timestamp).toString()}</span></div>
						<span class="title"> ${translate("walletpage.wchange16")} </span>
						<br />
						<div>
							<span>${this.selectedTransaction.txHash}</span>
						</div>
					</div>
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="showRvnTransactionDetailsDialog" scrimClickAction="${this.showRvnTransactionDetailsLoading ? '' : 'close'}">
					<div style="text-align: center;">
						<h1>${translate("walletpage.wchange5")}</h1>
						<hr />
					</div>
					<div id="transactionList">
						<span class="title"> ${translate("walletpage.wchange6")} </span>
						<br />
						<div>
							<span>${translate("walletpage.wchange40")}</span>
							${this.selectedTransaction.rvnTxnFlow === 'OUT' ? html`<span class="color-out">${translate("walletpage.wchange7")}</span>` : html`<span class="color-in">${translate("walletpage.wchange8")}</span>`}
						</div>
						<span class="title"> ${translate("walletpage.wchange9")} </span>
						<br />
						<div>
							<span>${this.selectedTransaction.rvnSender}</span>
						</div>
						<span class="title"> ${translate("walletpage.wchange10")} </span>
						<br />
						<div style="display: inline;">
							<span>${this.selectedTransaction.rvnReceiver}</span>
							<paper-icon-button icon="icons:send" @click=${() => this.sendToRvnAddress()} title="${translate("walletpage.wchange46")}"></paper-icon-button>
							<paper-icon-button icon="icons:add-circle" @click=${() => this.openAddRvnAddressDialog()} title="${translate("walletpage.wchange49")}"></paper-icon-button>
						</div>
						<br />
						<span class="title"> ${translate("walletpage.wchange12")} </span>
						<br />
						<div>
							<span>${(this.selectedTransaction.feeAmount / 1e8).toFixed(8)} RVN</span>
						</div>
						<span class="title"> ${translate("walletpage.wchange37")} </span>
						<br />
						<div>
							<span>${(this.selectedTransaction.totalAmount / 1e8).toFixed(8)} RVN</span>
						</div>
						<span class="title"> ${translate("walletpage.wchange14")} </span>
						<br />
						<div><span>${new Date(this.selectedTransaction.timestamp).toString()}</span></div>
						<span class="title"> ${translate("walletpage.wchange16")} </span>
						<br />
						<div>
							<span>${this.selectedTransaction.txHash}</span>
						</div>
					</div>
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="showArrrTransactionDetailsDialog" scrimClickAction="${this.showArrrTransactionDetailsLoading ? '' : 'close'}">
					<div style="text-align: center;">
						<h1>${translate("walletpage.wchange5")}</h1>
						<hr />
					</div>
					<div id="transactionList">
						<span class="title"> ${translate("walletpage.wchange6")} </span>
						<br />
						<div>
							<span>${translate("walletpage.wchange40")}</span>
							${this.selectedTransaction.arrrTxnFlow === 'OUT' ? html`<span class="color-out">${translate("walletpage.wchange7")}</span>` : html`<span class="color-in">${translate("walletpage.wchange8")}</span>`}
						</div>
						<span class="title"> ${translate("walletpage.wchange9")} </span>
						<br />
						<div>
							<span>${this.selectedTransaction.arrrSender}</span>
						</div>
						<span class="title"> ${translate("walletpage.wchange10")} </span>
						<br />
						<div style="display: inline;">
							<span>${this.selectedTransaction.arrrReceiver}</span>
							<paper-icon-button icon="icons:send" @click=${() => this.sendToArrrAddress()} title="${translate("walletpage.wchange46")}"></paper-icon-button>
							<paper-icon-button icon="icons:add-circle" @click=${() => this.openAddArrrAddressDialog()} title="${translate("walletpage.wchange49")}"></paper-icon-button>
						</div>
						<br />
						<span class="title"> ${translate("walletpage.wchange12")} </span>
						<br />
						<div>
							<span>${(this.selectedTransaction.feeAmount / 1e8).toFixed(8)} ARRR</span>
						</div>
						<span class="title"> ${translate("walletpage.wchange37")} </span>
						<br />
						<div>
							<span>${(this.selectedTransaction.totalAmount / 1e8).toFixed(8)} ARRR</span>
						</div>
						<span class="title"> ${translate("walletpage.wchange14")} </span>
						<br />
						<div><span>${new Date(this.selectedTransaction.timestamp).toString()}</span></div>
						<span class="title"> ${translate("walletpage.wchange16")} </span>
						<br />
						<div>
							<span>${this.selectedTransaction.txHash}</span>
						</div>
					</div>
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
						>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="sendQortDialog" scrimClickAction="" escapeKeyAction="">
					<div class="send-coin-dialog">
						<div style="text-align: center;">
							<img src="/img/qort.png" width="32" height="32">
							<h2> ${translate("walletpage.wchange17")} QORT</h2>
							<hr />
						</div>
						<p>
							<span>${translate("walletpage.wchange18")}:</span><br />
							<span style="font-weight: bold;">${this.getSelectedWalletAddress()}</span>
						</p>
						<p>
							<span>${translate("walletpage.wchange19")}:</span><br />
							<span style="float: left; font-weight: bold; display: inline;">${this.balanceString}</span><br />
							<span style="float: left; font-weight: bold; display: inline;">
								<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.calculateQortAll()}>
									<vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon>
									${translate("walletpage.wchange45")} QORT
								</vaadin-button>
							</span>
							<br /><span>&nbsp;</span>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								@input="${(e) => { this.checkQortAmount(e) }}"
								id="amountInput"
								label="${translate("walletpage.wchange11")} (QORT)"
								type="number"
								auto-validate="false"
								value="${this.amount}"
							>
							</mwc-textfield>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								id="recipient"
								label="${translate("walletpage.wchange20")}"
								type="text"
								value="${this.recipient}"
							>
							</mwc-textfield>
						</p>
						<div style="margin-bottom: 10px;">
							<p style="margin-bottom: 0;">${translate("walletpage.wchange21")} <span style="font-weight: bold;">${this.qortPaymentFee} QORT<span></p>
						</div>
						${this.renderClearSuccess()}
						${this.renderClearError()}
						${this.sendMoneyLoading ? html` 
							<paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress>
						` : ''}
						<div class="buttons">
							<div>
								<vaadin-button ?disabled="${this.btnDisable}" theme="primary medium" style="width: 100%;" @click=${() => this.sendQort()}>
									<vaadin-icon icon="vaadin:arrow-forward" slot="prefix"></vaadin-icon>
									${translate("walletpage.wchange17")} QORT
								</vaadin-button>
								<div style="display:${this.qortWarning ? 'inline' : 'none'}">${this.renderWarning()}</div>
							</div>
						</div>
					</div>
					<mwc-button
						slot="primaryAction"
						@click="${() => this.closeQortDialog()}"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="sendBtcDialog" scrimClickAction="" escapeKeyAction="">
					<div class="send-coin-dialog">
						<div style="text-align: center;">
							<img src="/img/btc.png" width="32" height="32">
							<h2>${translate("walletpage.wchange17")} BTC</h2>
							<hr />
						</div>
						<p>
							<span>From address:</span><br />
							<span style="font-weight: bold;">${this.getSelectedWalletAddress()}</span>
						</p>
						<p>
							<span>Available balance:</span><br />
							<span style="font-weight: bold;">${this.balanceString}</span><br />
							<span style="float: left; font-weight: bold; display: inline;">
								<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.calculateBtcAll()}>
									<vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon>
									${translate("walletpage.wchange45")} BTC
								</vaadin-button>
							</span>
							<br /><span>&nbsp;</span>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								@input="${(e) => { this._checkAmount(e) }}"
								id="btcAmountInput"
								label="${translate("walletpage.wchange11")} (BTC)"
								type="number"
								auto-validate="false"
								value="${this.btcAmount}"
							>
							</mwc-textfield>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								id="btcRecipient"
								label="To (address)"
								type="text"
								value="${this.btcRecipient}"
							>
							</mwc-textfield>
						</p>
						<div style="margin-bottom: 0;">
							<p style="margin-bottom: 0;">${translate("walletpage.wchange24")}: <span style="font-weight: bold;">${(this.btcFeePerByte / 1e8).toFixed(8)} BTC</span><br>${translate("walletpage.wchange25")}</p>
							<paper-slider
								class="blue"
								style="width: 100%;"
								pin
								@change="${(e) => (this.btcFeePerByte = e.target.value)}"
								id="btcFeeSlider"
								min="${this.btcSatMinFee}"
								max="${this.btcSatMaxFee}"
								value="${this.btcFeePerByte}"
							>
							</paper-slider>
						</div>
						${this.renderClearSuccess()}
						${this.renderClearError()}
						${this.sendMoneyLoading ? html` 
							<paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress>
						` : ''}
						<div class="buttons">
							<div>
								<vaadin-button ?disabled="${this.btnDisable}" theme="primary medium" style="width: 100%;" @click=${() => this.sendBtc()}>
									<vaadin-icon icon="vaadin:arrow-forward" slot="prefix"></vaadin-icon>
									${translate("walletpage.wchange17")} BTC
								</vaadin-button>
							</div>
						</div>
					</div>
					<mwc-button
						slot="primaryAction"
						@click="${() => this.closeBtcDialog()}"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="sendLtcDialog" scrimClickAction="" escapeKeyAction="">
					<div class="send-coin-dialog">
						<div style="text-align: center;">
							<img src="/img/ltc.png" width="32" height="32">
							<h2>${translate("walletpage.wchange17")} LTC</h2>
							<hr />
						</div>
						<p>
							<span>${translate("walletpage.wchange18")}:</span><br />
							<span style="font-weight: bold;">${this.getSelectedWalletAddress()}</span>
						</p>
						<p>
							<span>${translate("walletpage.wchange19")}:</span><br />
							<span style="float: left; font-weight: bold; display: inline;">${this.balanceString}</span><br />
							<span style="float: left; font-weight: bold; display: inline;">
								<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.calculateLtcAll()}>
									<vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon>
									${translate("walletpage.wchange45")} LTC
								</vaadin-button>
							</span>
							<br /><span>&nbsp;</span>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								@input="${(e) => { this._checkAmount(e) }}"
								id="ltcAmountInput"
								label="${translate("walletpage.wchange11")} (LTC)"
								type="number"
								auto-validate="false"
								value="${this.ltcAmount}"
							>
							</mwc-textfield>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								id="ltcRecipient"
								label="${translate("walletpage.wchange23")}"
								type="text"
								value="${this.ltcRecipient}"
							>
							</mwc-textfield>
						</p>
						<div style="margin-bottom: 0;">
							<p style="margin-bottom: 0;">${translate("walletpage.wchange24")}: <span style="font-weight: bold;">${(this.ltcFeePerByte / 1e8).toFixed(8)} LTC</span><br>${translate("walletpage.wchange25")}</p>
							<paper-slider
								class="blue"
								style="width: 100%;"
								pin
								@change="${(e) => (this.ltcFeePerByte = e.target.value)}"
								id="ltcFeeSlider"
								min="${this.ltcSatMinFee}"
								max="${this.ltcSatMaxFee}"
								value="${this.ltcFeePerByte}"
							>
							</paper-slider>
						</div>
						${this.renderClearSuccess()}
						${this.renderClearError()}
						${this.sendMoneyLoading ? html` 
							<paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress>
						` : ''}
						<div class="buttons">
							<div>
								<vaadin-button ?disabled="${this.btnDisable}" theme="primary medium" style="width: 100%;" @click=${() => this.sendLtc()}>
									<vaadin-icon icon="vaadin:arrow-forward" slot="prefix"></vaadin-icon>
									${translate("walletpage.wchange17")} LTC
								</vaadin-button>
							</div>
						</div>
					</div>
					<mwc-button
						slot="primaryAction"
						@click="${() => this.closeLtcDialog()}"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="sendDogeDialog" scrimClickAction="" escapeKeyAction="">
					<div class="send-coin-dialog">
						<div style="text-align: center;">
							<img src="/img/doge.png" width="32" height="32">
							<h2>${translate("walletpage.wchange17")} DOGE</h2>
							<hr />
						</div>
						<p>
							<span>${translate("walletpage.wchange18")}:</span><br />
							<span style="font-weight: bold;">${this.getSelectedWalletAddress()}</span>
						</p>
						<p>
							<span>${translate("walletpage.wchange19")}:</span><br />
							<span style="font-weight: bold;">${this.balanceString}</span><br />
							<span style="float: left; font-weight: bold; display: inline;">
								<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.calculateDogeAll()}>
									<vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon>
									${translate("walletpage.wchange45")} DOGE
								</vaadin-button>
							</span>
							<br /><span>&nbsp;</span>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								@input="${(e) => { this._checkAmount(e) }}"
								id="dogeAmountInput"
								label="${translate("walletpage.wchange11")} (DOGE)"
								type="number"
								auto-validate="false"
								value="${this.dogeAmount}"
							>
							</mwc-textfield>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								id="dogeRecipient"
								label="${translate("walletpage.wchange23")}"
								type="text"
								value="${this.dogeRecipient}"
							>
							</mwc-textfield>
						</p>
						<div style="margin-bottom: 0;">
							<p style="margin-bottom: 0;">
								${translate("walletpage.wchange24")}: <span style="font-weight: bold;">${(this.dogeFeePerByte / 1e8).toFixed(8)} DOGE</span><br>${translate("walletpage.wchange25")}
							</p>
							<paper-slider
								class="blue"
								style="width: 100%;"
								pin
								@change="${(e) => (this.dogeFeePerByte = e.target.value)}"
								id="dogeFeeSlider"
								min="${this.dogeSatMinFee}"
								max="${this.dogeSatMaxFee}"
								value="${this.dogeFeePerByte}"
							>
							</paper-slider>
						</div>
						${this.renderClearSuccess()}
						${this.renderClearError()}
						${this.sendMoneyLoading ? html` 
							<paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress>
						` : ''}
						<div class="buttons">
							<div>
								<vaadin-button ?disabled="${this.btnDisable}" theme="primary medium" style="width: 100%;" @click=${() => this.sendDoge()}>
									<vaadin-icon icon="vaadin:arrow-forward" slot="prefix"></vaadin-icon>
									${translate("walletpage.wchange17")} DOGE
								</vaadin-button>
							</div>
						</div>
					</div>
					<mwc-button
						slot="primaryAction"
						@click="${() => this.closeDogeDialog()}"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="sendDgbDialog" scrimClickAction="" escapeKeyAction="">
					<div class="send-coin-dialog">
						<div style="text-align: center;">
							<img src="/img/dgb.png" width="32" height="32">
							<h2>${translate("walletpage.wchange17")} DGB</h2>
							<hr />
						</div>
						<p>
							<span>${translate("walletpage.wchange18")}:</span><br />
							<span style="font-weight: bold;">${this.getSelectedWalletAddress()}</span>
						</p>
						<p>
							<span>${translate("walletpage.wchange19")}:</span><br />
							<span style="font-weight: bold;">${this.balanceString}</span><br />
							<span style="float: left; font-weight: bold; display: inline;">
								<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.calculateDgbAll()}>
									<vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon>
									${translate("walletpage.wchange45")} DGB
								</vaadin-button>
							</span>
							<br /><span>&nbsp;</span>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								@input="${(e) => { this._checkAmount(e) }}"
								id="dgbAmountInput"
								label="${translate("walletpage.wchange11")} (DGB)"
								type="number"
								auto-validate="false"
								value="${this.dgbAmount}"
							>
							</mwc-textfield>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								id="dgbRecipient"
								label="${translate("walletpage.wchange23")}"
								type="text"
								value="${this.dgbRecipient}"
							>
							</mwc-textfield>
						</p>
						<div style="margin-bottom: 0;">
							<p style="margin-bottom: 0;">
								${translate("walletpage.wchange24")}: <span style="font-weight: bold;">${(this.dgbFeePerByte / 1e8).toFixed(8)} DGB</span><br>${translate("walletpage.wchange25")}
							</p>
							<paper-slider
								class="blue"
								style="width: 100%;"
								pin
								@change="${(e) => (this.dgbFeePerByte = e.target.value)}"
								id="dgbFeeSlider"
								min="${this.dgbSatMinFee}"
								max="${this.dgbSatMaxFee}"
								value="${this.dgbFeePerByte}"
							>
							</paper-slider>
						</div>
						${this.renderClearSuccess()}
						${this.renderClearError()}
						${this.sendMoneyLoading ? html` 
							<paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress>
						` : ''}
						<div class="buttons">
							<div>
								<vaadin-button ?disabled="${this.btnDisable}" theme="primary medium" style="width: 100%;" @click=${() => this.sendDgb()}>
									<vaadin-icon icon="vaadin:arrow-forward" slot="prefix"></vaadin-icon>
									${translate("walletpage.wchange17")} DGB
								</vaadin-button>
							</div>
						</div>
					</div>
					<mwc-button
						slot="primaryAction"
						@click="${() => this.closeDgbDialog()}"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="sendRvnDialog" scrimClickAction="" escapeKeyAction="">
					<div class="send-coin-dialog">
						<div style="text-align: center;">
							<img src="/img/rvn.png" width="32" height="32">
							<h2>${translate("walletpage.wchange17")} RVN</h2>
							<hr />
						</div>
						<p>
							<span>${translate("walletpage.wchange18")}:</span><br />
							<span style="font-weight: bold;">${this.getSelectedWalletAddress()}</span>
						</p>
						<p>
							<span>${translate("walletpage.wchange19")}:</span><br />
							<span style="font-weight: bold;">${this.balanceString}</span><br />
							<span style="float: left; font-weight: bold; display: inline;">
								<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.calculateRvnAll()}>
									<vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon>
									${translate("walletpage.wchange45")} RVN
								</vaadin-button>
							</span>
							<br /><span>&nbsp;</span>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								@input="${(e) => { this._checkAmount(e) }}"
								id="rvnAmountInput"
								label="${translate("walletpage.wchange11")} (RVN)"
								type="number"
								auto-validate="false"
								value="${this.rvnAmount}"
							>
							</mwc-textfield>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								id="rvnRecipient"
								label="${translate("walletpage.wchange23")}"
								type="text"
								value="${this.rvnRecipient}"
							>
							</mwc-textfield>
						</p>
						<div style="margin-bottom: 0;">
							<p style="margin-bottom: 0;">
								${translate("walletpage.wchange24")}: <span style="font-weight: bold;">${(this.rvnFeePerByte / 1e8).toFixed(8)} RVN</span><br>${translate("walletpage.wchange25")}
							</p>
							<paper-slider
								class="blue"
								style="width: 100%;"
								pin
								@change="${(e) => (this.rvnFeePerByte = e.target.value)}"
								id="rvnFeeSlider"
								min="${this.rvnSatMinFee}"
								max="${this.rvnSatMaxFee}"
								value="${this.rvnFeePerByte}"
							>
							</paper-slider>
						</div>
						${this.renderClearSuccess()}
						${this.renderClearError()}
						${this.sendMoneyLoading ? html` 
							<paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress>
						` : ''}
						<div class="buttons">
							<div>
								<vaadin-button ?disabled="${this.btnDisable}" theme="primary medium" style="width: 100%;" @click=${() => this.sendRvn()}>
									<vaadin-icon icon="vaadin:arrow-forward" slot="prefix"></vaadin-icon>
									${translate("walletpage.wchange17")} RVN
								</vaadin-button>
							</div>
						</div>
					</div>
					<mwc-button
						slot="primaryAction"
						@click="${() => this.closeRvnDialog()}"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="sendArrrDialog" scrimClickAction="" escapeKeyAction="">
					<div class="send-coin-dialog">
						<div style="text-align: center;">
							<img src="/img/arrr.png" width="32" height="32">
							<h2>${translate("walletpage.wchange17")} ARRR</h2>
							<hr />
						</div>
						<p>
							<span>${translate("walletpage.wchange18")}:</span><br />
							<span style="font-weight: bold;">${this.getSelectedWalletAddress()}</span>
						</p>
						<p>
							<span>${translate("walletpage.wchange19")}:</span><br />
							<span style="font-weight: bold;">${this.balanceString}</span><br />
							<span style="float: left; font-weight: bold; display: inline;">
								<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.calculateArrrAll()}>
									<vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon>
									${translate("walletpage.wchange45")} ARRR
								</vaadin-button>
							</span>
							<br /><span>&nbsp;</span>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								@input="${(e) => { this._checkAmount(e) }}"
								id="arrrAmountInput"
								label="${translate("walletpage.wchange11")} (ARRR)"
								type="number"
								auto-validate="false"
								value="${this.arrrAmount}"
							>
							</mwc-textfield>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								id="arrrRecipient"
								label="${translate("walletpage.wchange23")}"
								type="text"
								value="${this.arrrRecipient}"
							>
							</mwc-textfield>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								id="arrrMemo"
								label="${translate("walletpage.wchange57")}"
								type="text"
								value="${this.arrrMemo}"
								maxLength="256"
							>
							</mwc-textfield>
						</p>
						<p style="color: red;">${this.errorMessage}</p>
						<p style="color: green;">${this.successMessage}</p>
						${this.sendMoneyLoading ? html` 
							<paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress>
						` : ''}
						<div class="buttons">
							<div>
								<vaadin-button ?disabled="${this.btnDisable}" theme="primary medium" style="width: 100%;" @click=${() => this.sendArrr()}>
									<vaadin-icon icon="vaadin:arrow-forward" slot="prefix"></vaadin-icon>
									${translate("walletpage.wchange17")} ARRR
								</vaadin-button>
							</div>
						</div>
					</div>
					<mwc-button
						slot="primaryAction"
						@click="${() => this.closeArrrDialog()}"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="qortBookDialog">
					<div style="text-align:center">
						<img src="/img/qort.png" width="32" height="32">
						<h1>Qortal ${translate("walletpage.wchange47")}</h1>
					</div>
					<div class="floatleft">${this.renderExportAddressbookButton()}</div>
					<div class="floatright">${this.renderImportAddressbookButton()}</div>
					<br><br>
					<hr>
					<br>
					<vaadin-grid theme="compact" id="qortBookGrid" ?hidden="${this.isEmptyArray(this.qortBook)}" aria-label="QORT Addressbook" .items="${this.qortBook}" all-rows-visible>
						<vaadin-grid-column width="9rem" flex-grow="0" header="${translate("chatpage.cchange11")}" path="name"></vaadin-grid-column>
						<vaadin-grid-column auto-width header="${translate("login.address")}" path="address"></vaadin-grid-column>
						<vaadin-grid-column width="11rem" flex-grow="0" header="${translate("chatpage.cchange13")}" .renderer=${(root, column, data) => {
							render(html`${this.renderSendFromQortAddressbookButton(data.item)}`, root)
						}}>
						</vaadin-grid-column>
						<vaadin-grid-column width="11rem" header="" .renderer=${(root, column, data) => {
							render(html`
								<mwc-button class="red" @click=${() => this.removeQortAddress(data.item.address)}>
									<mwc-icon>delete</mwc-icon>
									&nbsp;${translate("nodepage.nchange12")}
								</mwc-button>
							`, root)
						}}>
						</vaadin-grid-column>
					</vaadin-grid>
					${this.isEmptyArray(this.qortBook) ? html`
						<span style="color: var(--black); text-align: center;">${translate("walletpage.wchange48")}</span>
					`: ''}
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
					<mwc-button
						slot="secondaryAction"
						@click=${() => this.openAddToQortAddressbook()}
					>
						${translate("rewardsharepage.rchange14")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="btcBookDialog">
					<div style="text-align:center">
						<img src="/img/btc.png" width="32" height="32">
						<h1>Bitcoin ${translate("walletpage.wchange47")}</h1>
					</div>
					<div class="floatleft">${this.renderExportAddressbookButton()}</div>
					<div class="floatright">${this.renderImportAddressbookButton()}</div>
					<br><br>
					<hr>
					<br>
					<vaadin-grid theme="compact" id="btcBookGrid" ?hidden="${this.isEmptyArray(this.btcBook)}" aria-label="BTC Addressbook" .items="${this.btcBook}" all-rows-visible>
						<vaadin-grid-column width="9rem" flex-grow="0" header="${translate("chatpage.cchange11")}" path="name"></vaadin-grid-column>
						<vaadin-grid-column auto-width header="${translate("login.address")}" path="address"></vaadin-grid-column>
						<vaadin-grid-column width="11rem" flex-grow="0" header="${translate("chatpage.cchange13")}" .renderer=${(root, column, data) => {
							render(html`${this.renderSendFromBtcAddressbookButton(data.item)}`, root)
						}}>
						</vaadin-grid-column>
						<vaadin-grid-column width="11rem" header="" .renderer=${(root, column, data) => {
							render(html`
								<mwc-button class="red" @click=${() => this.removeBtcAddress(data.item.address)}>
									<mwc-icon>delete</mwc-icon>
									&nbsp;${translate("nodepage.nchange12")}
								</mwc-button>
							`, root)
						}}>
						</vaadin-grid-column>
					</vaadin-grid>
					${this.isEmptyArray(this.btcBook) ? html`
						<span style="color: var(--black); text-align: center;">${translate("walletpage.wchange48")}</span>
					`: ''}
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
					<mwc-button
						slot="secondaryAction"
						@click=${() => this.openAddToBtcAddressbook()}
					>
						${translate("rewardsharepage.rchange14")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="ltcBookDialog">
					<div style="text-align:center">
						<img src="/img/ltc.png" width="32" height="32">
						<h1>Litecoin ${translate("walletpage.wchange47")}</h1>
					</div>
					<div class="floatleft">${this.renderExportAddressbookButton()}</div>
					<div class="floatright">${this.renderImportAddressbookButton()}</div>
					<br><br>
					<hr>
					<br>
					<vaadin-grid theme="compact" id="ltcBookGrid" ?hidden="${this.isEmptyArray(this.ltcBook)}" aria-label="LTC Addressbook" .items="${this.ltcBook}" all-rows-visible>
						<vaadin-grid-column width="9rem" flex-grow="0" header="${translate("chatpage.cchange11")}" path="name"></vaadin-grid-column>
						<vaadin-grid-column auto-width header="${translate("login.address")}" path="address"></vaadin-grid-column>
						<vaadin-grid-column width="11rem" flex-grow="0" header="${translate("chatpage.cchange13")}" .renderer=${(root, column, data) => {
							render(html`${this.renderSendFromLtcAddressbookButton(data.item)}`, root)
						}}>
						</vaadin-grid-column>
						<vaadin-grid-column width="11rem" header="" .renderer=${(root, column, data) => {
							render(html`
								<mwc-button class="red" @click=${() => this.removeLtcAddress(data.item.address)}>
									<mwc-icon>delete</mwc-icon>
									&nbsp;${translate("nodepage.nchange12")}
								</mwc-button>
							`, root)
						}}>
						</vaadin-grid-column>
					</vaadin-grid>
					${this.isEmptyArray(this.ltcBook) ? html`
						<span style="color: var(--black); text-align: center;">${translate("walletpage.wchange48")}</span>
					`: ''}
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
					<mwc-button
						slot="secondaryAction"
						@click=${() => this.openAddToLtcAddressbook()}
					>
						${translate("rewardsharepage.rchange14")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="dogeBookDialog">
					<div style="text-align:center">
						<img src="/img/doge.png" width="32" height="32">
						<h1>Dogecoin ${translate("walletpage.wchange47")}</h1>
					</div>
					<div class="floatleft">${this.renderExportAddressbookButton()}</div>
					<div class="floatright">${this.renderImportAddressbookButton()}</div>
					<br><br>
					<hr>
					<br>
					<vaadin-grid theme="compact" id="dogeBookGrid" ?hidden="${this.isEmptyArray(this.dogeBook)}" aria-label="DOGE Addressbook" .items="${this.dogeBook}" all-rows-visible>
						<vaadin-grid-column width="9rem" flex-grow="0" header="${translate("chatpage.cchange11")}" path="name"></vaadin-grid-column>
						<vaadin-grid-column auto-width header="${translate("login.address")}" path="address"></vaadin-grid-column>
						<vaadin-grid-column width="11rem" flex-grow="0" header="${translate("chatpage.cchange13")}" .renderer=${(root, column, data) => {
							render(html`${this.renderSendFromDogeAddressbookButton(data.item)}`, root)
						}}>
						</vaadin-grid-column>
						<vaadin-grid-column width="11rem" header="" .renderer=${(root, column, data) => {
							render(html`
								<mwc-button class="red" @click=${() => this.removeDogeAddress(data.item.address)}>
									<mwc-icon>delete</mwc-icon>
									&nbsp;${translate("nodepage.nchange12")}
								</mwc-button>
							`, root)
						}}>
						</vaadin-grid-column>
					</vaadin-grid>
					${this.isEmptyArray(this.dogeBook) ? html`
						<span style="color: var(--black); text-align: center;">${translate("walletpage.wchange48")}</span>
					`: ''}
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
					<mwc-button
						slot="secondaryAction"
						@click=${() => this.openAddToDogeAddressbook()}
					>
						${translate("rewardsharepage.rchange14")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="dgbBookDialog">
					<div style="text-align:center">
						<img src="/img/dgb.png" width="32" height="32">
						<h1>Digibyte ${translate("walletpage.wchange47")}</h1>
					</div>
					<div class="floatleft">${this.renderExportAddressbookButton()}</div>
					<div class="floatright">${this.renderImportAddressbookButton()}</div>
					<br><br>
					<hr>
					<br>
					<vaadin-grid theme="compact" id="dgbBookGrid" ?hidden="${this.isEmptyArray(this.dgbBook)}" aria-label="DGB Addressbook" .items="${this.dgbBook}" all-rows-visible>
						<vaadin-grid-column width="9rem" flex-grow="0" header="${translate("chatpage.cchange11")}" path="name"></vaadin-grid-column>
						<vaadin-grid-column auto-width header="${translate("login.address")}" path="address"></vaadin-grid-column>
						<vaadin-grid-column width="11rem" flex-grow="0" header="${translate("chatpage.cchange13")}" .renderer=${(root, column, data) => {
							render(html`${this.renderSendFromDgbAddressbookButton(data.item)}`, root)
						}}>
						</vaadin-grid-column>
						<vaadin-grid-column width="11rem" header="" .renderer=${(root, column, data) => {
							render(html`
								<mwc-button class="red" @click=${() => this.removeDgbAddress(data.item.address)}>
									<mwc-icon>delete</mwc-icon>
									&nbsp;${translate("nodepage.nchange12")}
								</mwc-button>
							`, root)
						}}>
						</vaadin-grid-column>
					</vaadin-grid>
					${this.isEmptyArray(this.dgbBook) ? html`
						<span style="color: var(--black); text-align: center;">${translate("walletpage.wchange48")}</span>
					`: ''}
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
					<mwc-button
						slot="secondaryAction"
						@click=${() => this.openAddToDgbAddressbook()}
					>
						${translate("rewardsharepage.rchange14")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="rvnBookDialog">
					<div style="text-align:center">
						<img src="/img/rvn.png" width="32" height="32">
						<h1>Ravencoin ${translate("walletpage.wchange47")}</h1>
					</div>
					<div class="floatleft">${this.renderExportAddressbookButton()}</div>
					<div class="floatright">${this.renderImportAddressbookButton()}</div>
					<br><br>
					<hr>
					<br>
					<vaadin-grid theme="compact" id="rvnBookGrid" ?hidden="${this.isEmptyArray(this.rvnBook)}" aria-label="RVN Addressbook" .items="${this.rvnBook}" all-rows-visible>
						<vaadin-grid-column width="9rem" flex-grow="0" header="${translate("chatpage.cchange11")}" path="name"></vaadin-grid-column>
						<vaadin-grid-column auto-width header="${translate("login.address")}" path="address"></vaadin-grid-column>
						<vaadin-grid-column width="11rem" flex-grow="0" header="${translate("chatpage.cchange13")}" .renderer=${(root, column, data) => {
							render(html`${this.renderSendFromRvnAddressbookButton(data.item)}`, root)
						}}>
						</vaadin-grid-column>
						<vaadin-grid-column width="11rem" header="" .renderer=${(root, column, data) => {
							render(html`
								<mwc-button class="red" @click=${() => this.removeRvnAddress(data.item.address)}>
									<mwc-icon>delete</mwc-icon>
									&nbsp;${translate("nodepage.nchange12")}
								</mwc-button>
							`, root)
						}}>
						</vaadin-grid-column>
					</vaadin-grid>
					${this.isEmptyArray(this.rvnBook) ? html`
						<span style="color: var(--black); text-align: center;">${translate("walletpage.wchange48")}</span>
					`: ''}
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
					<mwc-button
						slot="secondaryAction"
						@click=${() => this.openAddToRvnAddressbook()}
					>
						${translate("rewardsharepage.rchange14")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="arrrBookDialog">
					<div style="text-align:center">
						<img src="/img/arrr.png" width="32" height="32">
						<h1>Pirate Chain ${translate("walletpage.wchange47")}</h1>
					</div>
					<div class="floatleft">${this.renderExportAddressbookButton()}</div>
					<div class="floatright">${this.renderImportAddressbookButton()}</div>
					<br><br>
					<hr>
					<br>
					<vaadin-grid theme="compact" id="arrrBookGrid" ?hidden="${this.isEmptyArray(this.arrrBook)}" aria-label="ARRR Addressbook" .items="${this.arrrBook}" all-rows-visible>
						<vaadin-grid-column width="9rem" flex-grow="0" header="${translate("chatpage.cchange11")}" path="name"></vaadin-grid-column>
						<vaadin-grid-column auto-width header="${translate("login.address")}" path="address"></vaadin-grid-column>
						<vaadin-grid-column width="11rem" flex-grow="0" header="${translate("chatpage.cchange13")}" .renderer=${(root, column, data) => {
							render(html`${this.renderSendFromArrrAddressbookButton(data.item)}`, root)
						}}>
						</vaadin-grid-column>
						<vaadin-grid-column width="11rem" header="" .renderer=${(root, column, data) => {
							render(html`
								<mwc-button class="red" @click=${() => this.removeArrrAddress(data.item.address)}>
									<mwc-icon>delete</mwc-icon>
									&nbsp;${translate("nodepage.nchange12")}
								</mwc-button>
							`, root)
						}}>
						</vaadin-grid-column>
					</vaadin-grid>
					${this.isEmptyArray(this.arrrBook) ? html`
						<span style="color: var(--black); text-align: center;">${translate("walletpage.wchange48")}</span>
					`: ''}
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
						>
						${translate("general.close")}
					</mwc-button>
					<mwc-button
						slot="secondaryAction"
						@click=${() => this.openAddToArrrAddressbook()}
					>
						${translate("rewardsharepage.rchange14")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="addQortAddressDialog" scrimClickAction="" escapeKeyAction="">
					<div style="text-align:center">
						<img src="/img/qort.png" width="32" height="32">
						<h1>Qortal ${translate("walletpage.wchange47")}</h1>
						<br />
						<h2>${translate("walletpage.wchange49")}</h2>
						<hr>
						<br>
					</div>
					<div style="min-height: 150px; min-width: 500px; box-sizing: border-box; position: relative;">
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								id="qortNameInput"
								label="${translate("login.name")}"
								type="text"
								value="${this.qortBookName}"
							>
							</mwc-textfield>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								id="qortAddressInput"
								label="${translate("login.address")}"
								type="text"
								value="${this.qortBookAddress}"
							>
							</mwc-textfield>
						</p>
					</div>
					<div class="buttons">
						<div>
							<vaadin-button theme="primary medium" style="width: 100%;" @click=${() =>
								this.addToQortalAddressbook()}>
								<vaadin-icon icon="vaadin:plus-circle-o" slot="prefix"></vaadin-icon>
								${translate("walletpage.wchange49")}
							</vaadin-button>
						</div>
					</div>
					<mwc-button
						slot="primaryAction"
						@click="${() => this.closeQortAddressDialog()}"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="addBtcAddressDialog" scrimClickAction="" escapeKeyAction="">
					<div style="text-align:center">
						<img src="/img/btc.png" width="32" height="32">
						<h1>Bitcoin ${translate("walletpage.wchange47")}</h1>
						<br />
						<h2>${translate("walletpage.wchange49")}</h2>
						<hr>
						<br>
					</div>
					<div style="min-height: 150px; min-width: 500px; box-sizing: border-box; position: relative;">
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								id="btcNameInput"
								label="${translate("login.name")}"
								type="text"
								value="${this.btcBookName}"
							>
							</mwc-textfield>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								id="btcAddressInput"
								label="${translate("login.address")}"
								type="text"
								value="${this.btcBookAddress}"
							>
							</mwc-textfield>
						</p>
					</div>
					<div class="buttons">
						<div>
							<vaadin-button theme="primary medium" style="width: 100%;" @click=${() =>
								this.addToBitcoinAddressbook()}>
								<vaadin-icon icon="vaadin:plus-circle-o" slot="prefix"></vaadin-icon>
								${translate("walletpage.wchange49")}
							</vaadin-button>
						</div>
					</div>
					<mwc-button
						slot="primaryAction"
						@click="${() => this.closeBtcAddressDialog()}"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="addLtcAddressDialog" scrimClickAction="" escapeKeyAction="">
					<div style="text-align:center">
						<img src="/img/ltc.png" width="32" height="32">
						<h1>Litecoin ${translate("walletpage.wchange47")}</h1>
						<br />
						<h2>${translate("walletpage.wchange49")}</h2>
						<hr>
						<br>
					</div>
					<div style="min-height: 150px; min-width: 500px; box-sizing: border-box; position: relative;">
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								id="ltcNameInput"
								label="${translate("login.name")}"
								type="text"
								value="${this.ltcBookName}"
							>
							</mwc-textfield>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								id="ltcAddressInput"
								label="${translate("login.address")}"
								type="text"
								value="${this.ltcBookAddress}"
							>
							</mwc-textfield>
						</p>
					</div>
					<div class="buttons">
						<div>
							<vaadin-button theme="primary medium" style="width: 100%;" @click=${() =>
								this.addToLitecoinAddressbook()}>
								<vaadin-icon icon="vaadin:plus-circle-o" slot="prefix"></vaadin-icon>
								${translate("walletpage.wchange49")}
							</vaadin-button>
						</div>
					</div>
					<mwc-button
						slot="primaryAction"
						@click="${() => this.closeLtcAddressDialog()}"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="addDogeAddressDialog" scrimClickAction="" escapeKeyAction="">
					<div style="text-align:center">
						<img src="/img/doge.png" width="32" height="32">
						<h1>Dogecoin ${translate("walletpage.wchange47")}</h1>
						<br />
						<h2>${translate("walletpage.wchange49")}</h2>
						<hr>
						<br>
					</div>
					<div style="min-height: 150px; min-width: 500px; box-sizing: border-box; position: relative;">
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								id="dogeNameInput"
								label="${translate("login.name")}"
								type="text"
								value="${this.dogeBookName}"
							>
							</mwc-textfield>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								id="dogeAddressInput"
								label="${translate("login.address")}"
								type="text"
								value="${this.dogeBookAddress}"
							>
							</mwc-textfield>
						</p>
					</div>
					<div class="buttons">
						<div>
							<vaadin-button theme="primary medium" style="width: 100%;" @click=${() =>
								this.addToDogecoinAddressbook()}>
								<vaadin-icon icon="vaadin:plus-circle-o" slot="prefix"></vaadin-icon>
								${translate("walletpage.wchange49")}
							</vaadin-button>
						</div>
					</div>
					<mwc-button
						slot="primaryAction"
						@click="${() => this.closeDogeAddressDialog()}"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="addDgbAddressDialog" scrimClickAction="" escapeKeyAction="">
					<div style="text-align:center">
						<img src="/img/dgb.png" width="32" height="32">
						<h1>Digibyte ${translate("walletpage.wchange47")}</h1>
						<br />
						<h2>${translate("walletpage.wchange49")}</h2>
						<hr>
						<br>
					</div>
					<div style="min-height: 150px; min-width: 500px; box-sizing: border-box; position: relative;">
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								id="dgbNameInput"
								label="${translate("login.name")}"
								type="text"
								value="${this.dgbBookName}"
							>
							</mwc-textfield>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								id="dgbAddressInput"
								label="${translate("login.address")}"
								type="text"
								value="${this.dgbBookAddress}"
							>
							</mwc-textfield>
						</p>
					</div>
					<div class="buttons">
						<div>
							<vaadin-button theme="primary medium" style="width: 100%;" @click=${() =>
								this.addToDigibyteAddressbook()}>
								<vaadin-icon icon="vaadin:plus-circle-o" slot="prefix"></vaadin-icon>
								${translate("walletpage.wchange49")}
							</vaadin-button>
						</div>
					</div>
					<mwc-button
						slot="primaryAction"
						@click="${() => this.closeDgbAddressDialog()}"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="addRvnAddressDialog" scrimClickAction="" escapeKeyAction="">
					<div style="text-align:center">
						<img src="/img/rvn.png" width="32" height="32">
						<h1>Ravencoin ${translate("walletpage.wchange47")}</h1>
						<br />
						<h2>${translate("walletpage.wchange49")}</h2>
						<hr>
						<br>
					</div>
					<div style="min-height: 150px; min-width: 500px; box-sizing: border-box; position: relative;">
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								id="rvnNameInput"
								label="${translate("login.name")}"
								type="text"
								value="${this.rvnBookName}"
							>
							</mwc-textfield>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								id="rvnAddressInput"
								label="${translate("login.address")}"
								type="text"
								value="${this.rvnBookAddress}"
							>
							</mwc-textfield>
						</p>
					</div>
					<div class="buttons">
						<div>
							<vaadin-button theme="primary medium" style="width: 100%;" @click=${() =>
								this.addToRavencoinAddressbook()}>
								<vaadin-icon icon="vaadin:plus-circle-o" slot="prefix"></vaadin-icon>
								${translate("walletpage.wchange49")}
							</vaadin-button>
						</div>
					</div>
					<mwc-button
						slot="primaryAction"
						@click="${() => this.closeRvnAddressDialog()}"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="addArrrAddressDialog" scrimClickAction="" escapeKeyAction="">
					<div style="text-align:center">
						<img src="/img/arrr.png" width="32" height="32">
						<h1>Pirate Chain ${translate("walletpage.wchange47")}</h1>
						<br />
						<h2>${translate("walletpage.wchange49")}</h2>
						<hr>
						<br>
					</div>
					<div style="min-height: 150px; min-width: 500px; box-sizing: border-box; position: relative;">
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								id="arrrNameInput"
								label="${translate("login.name")}"
								type="text"
								value="${this.arrrBookName}"
							>
							</mwc-textfield>
						</p>
						<p>
							<mwc-textfield
								style="width: 100%;"
								required
								id="arrrAddressInput"
								label="${translate("login.address")}"
								type="text"
								value="${this.arrrBookAddress}"
							>
							</mwc-textfield>
						</p>
					</div>
					<div class="buttons">
						<div>
							<vaadin-button theme="primary medium" style="width: 100%;" @click=${() =>
								this.addToPiratechainAddressbook()}>
								<vaadin-icon icon="vaadin:plus-circle-o" slot="prefix"></vaadin-icon>
								${translate("walletpage.wchange49")}
							</vaadin-button>
						</div>
					</div>
					<mwc-button
						slot="primaryAction"
						@click="${() => this.closeArrrAddressDialog()}"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="importQortAddressbookDialog">
					<div style="text-align:center">
						<img src="/img/qort.png" width="32" height="32">
						<h1>Qortal ${translate("walletpage.wchange53")}</h1>
						<br />
						<hr>
						<br>
					</div>
					<div style="min-height: 150px; min-width: 500px; box-sizing: border-box; position: relative;">
						<frag-file-input accept=".qort.json" @file-read-success="${(e) => this.importQortAddressbook(e.detail.result)}"></frag-file-input>
						<h4 style="color: #F44336; text-align: center;">${translate("walletpage.wchange56")}</h4>
						<h5 style="text-align: center;">${translate("walletpage.wchange55")}</h5>
					</div>
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="importBtcAddressbookDialog">
					<div style="text-align:center">
						<img src="/img/btc.png" width="32" height="32">
						<h1>Bitcoin ${translate("walletpage.wchange53")}</h1>
						<br />
						<hr>
						<br>
					</div>
					<div style="min-height: 150px; min-width: 500px; box-sizing: border-box; position: relative;">
						<frag-file-input accept=".btc.json" @file-read-success="${(e) => this.importBtcAddressbook(e.detail.result)}"></frag-file-input>
						<h4 style="color: #F44336; text-align: center;">${translate("walletpage.wchange56")}</h4>
						<h5 style="text-align: center;">${translate("walletpage.wchange55")}</h5>
					</div>
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="importLtcAddressbookDialog">
					<div style="text-align:center">
						<img src="/img/ltc.png" width="32" height="32">
						<h1>Litecoin ${translate("walletpage.wchange53")}</h1>
						<br />
						<hr>
						<br>
					</div>
					<div style="min-height: 150px; min-width: 500px; box-sizing: border-box; position: relative;">
						<frag-file-input accept=".ltc.json" @file-read-success="${(e) => this.importLtcAddressbook(e.detail.result)}"></frag-file-input>
						<h4 style="color: #F44336;" text-align: center;>${translate("walletpage.wchange56")}</h4>
						<h5 style="text-align: center;">${translate("walletpage.wchange55")}</h5>
					</div>
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="importDogeAddressbookDialog">
					<div style="text-align:center">
						<img src="/img/doge.png" width="32" height="32">
						<h1>Dogecoin ${translate("walletpage.wchange53")}</h1>
						<br />
						<hr>
						<br>
					</div>
					<div style="min-height: 150px; min-width: 500px; box-sizing: border-box; position: relative;">
						<frag-file-input accept=".doge.json" @file-read-success="${(e) => this.importDogeAddressbook(e.detail.result)}"></frag-file-input>
						<h4 style="color: #F44336; text-align: center;">${translate("walletpage.wchange56")}</h4>
						<h5 style="text-align: center;">${translate("walletpage.wchange55")}</h5>
					</div>
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="importDgbAddressbookDialog">
					<div style="text-align:center">
						<img src="/img/dgb.png" width="32" height="32">
						<h1>Digibyte ${translate("walletpage.wchange53")}</h1>
						<br />
						<hr>
						<br>
					</div>
					<div style="min-height: 150px; min-width: 500px; box-sizing: border-box; position: relative;">
						<frag-file-input accept=".dgb.json" @file-read-success="${(e) => this.importDgbAddressbook(e.detail.result)}"></frag-file-input>
						<h4 style="color: #F44336; text-align: center;">${translate("walletpage.wchange56")}</h4>
						<h5 style="text-align: center;">${translate("walletpage.wchange55")}</h5>
					</div>
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="importRvnAddressbookDialog">
					<div style="text-align:center">
						<img src="/img/rvn.png" width="32" height="32">
						<h1>Litecoin ${translate("walletpage.wchange53")}</h1>
						<br />
						<hr>
						<br>
					</div>
					<div style="min-height: 150px; min-width: 500px; box-sizing: border-box; position: relative;">
						<frag-file-input accept=".rvn.json" @file-read-success="${(e) => this.importRvnAddressbook(e.detail.result)}"></frag-file-input>
						<h4 style="color: #F44336; text-align: center;">${translate("walletpage.wchange56")}</h4>
						<h5 style="text-align: center;">${translate("walletpage.wchange55")}</h5>
					</div>
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="importArrrAddressbookDialog">
					<div style="text-align:center">
						<img src="/img/arrr.png" width="32" height="32">
						<h1>Pirate Chain ${translate("walletpage.wchange53")}</h1>
						<br />
						<hr>
						<br>
					</div>
					<div style="min-height: 150px; min-width: 500px; box-sizing: border-box; position: relative;">
						<frag-file-input accept=".arrr.json" @file-read-success="${(e) => this.importArrrAddressbook(e.detail.result)}"></frag-file-input>
						<h4 style="color: #F44336; text-align: center;">${translate("walletpage.wchange56")}</h4>
						<h5 style="text-align: center;">${translate("walletpage.wchange55")}</h5>
					</div>
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
			</div>
			<paper-dialog class="setpass-wrapper" id="setWalletLockScreenPass" modal>
				<div style="text-align: center;">
					<h2 style="color: var(--black);">Qortal ${translate("tabmenu.tm5")} ${translate("login.lp1")}</h2>
					<hr>
				</div>
				<div style="text-align: center;">
					<h3 style="color: var(--black);">${translate("login.lp2")}</h3>
					<h4 style="color: var(--black);">${translate("login.lp3")}</h4>
				</div>
				<div style="display:flex;">
					<mwc-icon style="padding: 10px; padding-left: 0; padding-top: 42px; color: var(--black);">password</mwc-icon>
					<vaadin-password-field style="width: 100%;" label="${translate("login.password")}" id="walletLockPassword" autofocus></vaadin-password-field>
				</div>
				<div style="display:flex;">
					<mwc-icon style="padding: 10px; padding-left: 0; padding-top: 42px; color: var(--black);">password</mwc-icon>
					<vaadin-password-field style="width: 100%;" label="${translate("login.confirmpass")}" id="walletLockPasswordConfirm"></vaadin-password-field>
				</div>
				<div style="display: flex; justify-content: space-between;">
					<mwc-button class="red" @click="${() => this.closewWalletSetScreenLockPass()}">${translate("login.lp4")}</mwc-button>
					<mwc-button @click="${() => this.walletCheckPass()}">${translate("login.lp5")}</mwc-button>
				</div>
			</paper-dialog>
			<paper-dialog class="setpass-wrapper" id="walletExtraConfirmPass" modal>
				<div style="text-align: center;">
					<h2 style="color: var(--black);">Qortal ${translate("tabmenu.tm5")} ${translate("login.lp1")}</h2>
					<hr>
				</div>
				<div style="text-align: center;">
					<h3 style="color: var(--black);">${translate("login.lessthen8")}</h3>
				</div>
				<div style="display: flex; justify-content: space-between;">
					<mwc-button class="red" @click="${() => this.closWalletExtraConfirmPass()}">${translate("login.lp4")}</mwc-button>
					<mwc-button @click="${() => this.setWalletNewScreenPass()}">${translate("login.lp5")}</mwc-button>
				</div>
			</paper-dialog>
			<paper-dialog class="lock-wrapper" id="walletLockScreenActive" modal>
				<div class="text-wrapper">
					<span class="lock-title-white">${translate("sidemenu.wallets")}</span><br/>
					<span class="lock-title-white">${translate("login.lp9")} </span>
					<span class="lock-title-red">${translate("login.lp10")}</span>
				</div>
				<div style="display:flex; margin-top: 5px;">
					<mwc-icon style="padding: 10px; padding-left: 0; padding-top: 42px; color: var(--black);">password</mwc-icon>
					<vaadin-password-field style="width: 45%;" label="${translate("login.password")}" id="walletUnlockPassword" @keydown="${this.walletPassKeyListener}" autofocus>
					<div slot="helper">
						${this.walletHelperMessage}
					</div>
					</vaadin-password-field>
				</div>
				<div style="display: flex; margin-top: 35px;">
					<mwc-button dense unelevated label="${translate("login.lp7")}" icon="lock_open" @click="${() => this.closeWalletLockScreenActive()}"></mwc-button>
				</div>
			</paper-dialog>
		`
	}

	firstUpdated() {

		this.changeTheme()
		this.changeLanguage()
		this.paymentFee()
		this.getNodeConfig()

		this.bookQortalAddress = window.parent.reduxStore.getState().app.selectedAddress.address
		this.bookBitcoinAddress = window.parent.reduxStore.getState().app.selectedAddress.btcWallet.address
		this.bookLitecoinAddress = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet.address
		this.bookDogecoinAddress = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet.address
		this.bookDigibyteAddress = window.parent.reduxStore.getState().app.selectedAddress.dgbWallet.address
		this.bookRavencoinAddress = window.parent.reduxStore.getState().app.selectedAddress.rvnWallet.address
		this.bookPiratechainAddress = window.parent.reduxStore.getState().app.selectedAddress.arrrWallet.address

		this.walletHelperMessage = this.renderWalletHelperPass()

		this.walletSalt = ''
		this.walletSalt = Base58.encode(window.parent.reduxStore.getState().app.wallet._addresses[0].keyPair.privateKey)

		this.walletStorageData = ''
		this.walletStorageData = window.parent.reduxStore.getState().app.selectedAddress.address

		this.walletLockScreenPass = ''
		this.walletLockScreenPass = 'walletLockScreenPass-' + this.walletStorageData

		this.walletLockScreenSet = ''
		this.walletLockScreenSet = 'walletLockScreenSet-' + this.walletStorageData

		this.walletLockPass = ''
		this.walletLockPass = encryptData(false, this.walletSalt)

		this.walletLockSet = ''
		this.walletLockSet = encryptData(false, this.walletSalt)

		if (localStorage.getItem(this.walletLockScreenPass) === null && localStorage.getItem(this.walletLockScreenSet) === null) {
			localStorage.setItem(this.walletLockScreenPass, this.walletLockPass)
			localStorage.setItem(this.walletLockScreenSet, this.walletLockSet)
			this.myWalletLockScreenPass = ''
			this.myWalletLockScreenPass = decryptData(localStorage.getItem(this.walletLockScreenPass), this.walletSalt)
			this.myWalletLockScreenSet = ''
			this.myWalletLockScreenSet = decryptData(localStorage.getItem(this.walletLockScreenSet), this.walletSalt)
		} else {
			this.myWalletLockScreenPass = ''
			this.myWalletLockScreenPass = decryptData(localStorage.getItem(this.walletLockScreenPass), this.walletSalt)
			this.myWalletLockScreenSet = ''
			this.myWalletLockScreenSet = decryptData(localStorage.getItem(this.walletLockScreenSet), this.walletSalt)
		}

		if (this.myWalletLockScreenSet === true) {
			this.shadowRoot.getElementById('walletLockScreenActive').open()
		}

		this.qortAddressbook()
		this.btcAddressbook()
		this.ltcAddressbook()
		this.dogeAddressbook()
		this.dgbAddressbook()
		this.rvnAddressbook()
		this.arrrAddressbook()

		this.transactionsDOM = this.shadowRoot.getElementById('transactionsDOM')

		this.showNewQortWallet()

		window.addEventListener('storage', () => {
			const checkLanguage = localStorage.getItem('qortalLanguage')
			const checkTheme = localStorage.getItem('qortalTheme')

			use(checkLanguage)

			if (checkTheme === 'dark') {
				this.theme = 'dark'
			} else {
				this.theme = 'light'
			}
			document.querySelector('html').setAttribute('theme', this.theme)
		})

		if (!isElectron()) {
		} else {
			window.addEventListener('contextmenu', (event) => {
				event.preventDefault()
				window.parent.electronAPI.showMyMenu()
			})
		}

		this.clearConsole()

		setInterval(() => {
			this.clearConsole()
			this.getNodeConfig()
		}, 60000)

		setInterval(() => {
			this.paymentFee()
		}, 600000)
	}

	async myTabChanged(value) {
		this.pageButtonsHidden = false
		this.visitedTab = value
		this.searchOffset = 0
		this.searchLimit = 10
		this.counter = 1
		await this.renderNewDom()
	}

	renderTabTransactions() {
		if (this._selectedWallet == 'qort') {
			return html`
				<div style="margin-top: 10px;">
					<vaadin-tabs>
						<vaadin-tab id="type" disabled><span style="color: var(--black);">${translate("walletpage.wchange6")} :</span></vaadin-tab>
						<vaadin-tab id="payment-tab" style="cursor: pointer;" @click=${(e) => this.myTabChanged(0)}>PAYMENT</vaadin-tab>
						<vaadin-tab id="arbitrary-tab" style="cursor: pointer;" @click=${(e) => this.myTabChanged(1)}>ARBITRARY</vaadin-tab>
						<vaadin-tab id="at-tab" style="cursor: pointer;" @click=${(e) => this.myTabChanged(2)}>AT</vaadin-tab>
						<vaadin-tab id="group-tab" style="cursor: pointer;" @click=${(e) => this.myTabChanged(3)}>GROUP</vaadin-tab>
						<vaadin-tab id="name-tab" style="cursor: pointer;" @click=${(e) => this.myTabChanged(4)}>NAME</vaadin-tab>
						<vaadin-tab id="asset-tab" style="cursor: pointer;" @click=${(e) => this.myTabChanged(5)}>ASSET</vaadin-tab>
						<vaadin-tab id="poll-tab" style="cursor: pointer;" @click=${(e) => this.myTabChanged(6)}>POLL</vaadin-tab>
						<vaadin-tab id="rewarshare-tab" style="cursor: pointer;" @click=${(e) => this.myTabChanged(7)}>REWARDSHARE</vaadin-tab>
						<vaadin-tab id="misc-tab" style="cursor: pointer;" @click=${(e) => this.myTabChanged(8)}>MISC</vaadin-tab>
					</vaadin-tabs>
				</div>
			`
		} else {
			return html``
		}
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

	clearConsole() {
		if (!isElectron()) {
		} else {
			console.clear()
			window.parent.electronAPI.clearCache()
		}
	}

	pingCoinBalancesController() {
		if (!this._selectedWallet) return
		const customEvent = new CustomEvent('ping-coin-controller-with-coin', {
			detail: this._selectedWallet
		})
		window.parent.dispatchEvent(customEvent)
	}

	connectedCallback() {
		super.connectedCallback()
		this.intervalID = setInterval(this.pingCoinBalancesController, 30000)
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		if (this.intervalID) {
			clearInterval(this.intervalID)
		}
	}

	renderWalletLockButton() {
		if (this.myWalletLockScreenPass === false && this.myWalletLockScreenSet === false) {
			return html`
				<div style="display: inline;">
					<paper-icon-button style="padding-bottom: 12px;" icon="icons:lock-open" @click=${() => this.openWalletSetScreenLockPass()} title="${translate("login.lp11")}"></paper-icon-button>
				</div>
			`
		} else if (this.myWalletLockScreenSet === false) {
			return html`
				<div style="display: inline;">
					<paper-icon-button style="padding-bottom: 12px;" icon="icons:lock-open" @click=${() => this.setWalletLockQortal()} title="${translate("login.lp11")}"></paper-icon-button>
				</div>
			`
		} else if (this.myWalletLockScreenSet === true) {
			return html`
				<div style="display: inline;">
					<paper-icon-button style="padding-bottom: 12px;" icon="icons:lock" title="${translate("login.lp10")}"></paper-icon-button>
				</div>
			`
		}
	}

	openWalletSetScreenLockPass() {
		this.shadowRoot.getElementById('walletLockPassword').value = ''
		this.shadowRoot.getElementById('walletLockPasswordConfirm').value = ''
		this.shadowRoot.getElementById('setWalletLockScreenPass').open()
	}

	closewWalletSetScreenLockPass() {
		this.shadowRoot.getElementById('setWalletLockScreenPass').close()
	}

	walletCheckPass() {
		const walletPassword = this.shadowRoot.getElementById('walletLockPassword').value
		const walletRePassword = this.shadowRoot.getElementById('walletLockPasswordConfirm').value

		if (walletPassword === '') {
			let snackbar1string = get("login.pleaseenter")
			parentEpml.request('showSnackBar', `${snackbar1string}`)
			return
		}

		if (walletPassword != walletRePassword) {
			let snackbar2string = get("login.notmatch")
			parentEpml.request('showSnackBar', `${snackbar2string}`)
			return
		}

		if (walletPassword.length < 8) {
			let snackbar3string = get("login.lessthen8")
			parentEpml.request('showSnackBar', `${snackbar3string}`)
			this.walletExtraConfirm()
		}

		if (walletPassword.length >= 8) {
			this.setWalletNewScreenPass()
			let snackbar4string = get("login.lp6")
			parentEpml.request('showSnackBar', `${snackbar4string}`)
		}
	}

	walletExtraConfirm() {
		this.shadowRoot.getElementById('setWalletLockScreenPass').close()
		this.shadowRoot.getElementById('walletExtraConfirmPass').open()
	}

	closWalletExtraConfirmPass() {
		this.shadowRoot.getElementById('walletExtraConfirmPass').close()
		this.shadowRoot.getElementById('walletLockPassword').value = ''
		this.shadowRoot.getElementById('walletLockPasswordConfirm').value = ''
	}

	setWalletNewScreenPass() {
		const walletRawPassword = this.shadowRoot.getElementById('walletLockPassword').value
		const walletCryptPassword = encryptData(walletRawPassword, this.walletSalt)
		localStorage.setItem(this.walletLockScreenPass, walletCryptPassword)
		this.myWalletLockScreenPass = ''
		this.myWalletLockScreenPass = decryptData(localStorage.getItem(this.walletLockScreenPass), this.walletSalt)
		this.shadowRoot.getElementById('setWalletLockScreenPass').close()
		this.shadowRoot.getElementById('walletExtraConfirmPass').close()
		this.shadowRoot.getElementById('walletLockPassword').value = ''
		this.shadowRoot.getElementById('walletLockPasswordConfirm').value = ''
	}

	setWalletLockQortal() {
		this.walletHelperMessage = this.renderWalletHelperPass()
		this.walletLockSet = ''
		this.walletLockSet = encryptData(true, this.walletSalt)
		localStorage.setItem(this.walletLockScreenSet, this.walletLockSet)
		this.myWalletLockScreenSet = ''
		this.myWalletLockScreenSet = decryptData(localStorage.getItem(this.walletLockScreenSet), this.walletSalt)
		this.shadowRoot.getElementById('walletLockScreenActive').open()
	}

	walletPassKeyListener(e) {
		if (e.key === 'Enter') {
			this.closeWalletLockScreenActive()
		}
	}

	async closeWalletLockScreenActive() {
		const myWalletPass = decryptData(localStorage.getItem(this.walletLockScreenPass), this.walletSalt)
		const walletCheckPass = this.shadowRoot.getElementById('walletUnlockPassword').value
		const errDelay = ms => new Promise(res => setTimeout(res, ms))

		if (walletCheckPass === myWalletPass) {
			this.walletLockSet = ''
			this.walletLockSet = encryptData(false, this.walletSalt)
			localStorage.setItem(this.walletLockScreenSet, this.walletLockSet)
			this.myWalletLockScreenSet = ''
			this.myWalletLockScreenSet = decryptData(localStorage.getItem(this.walletLockScreenSet), this.walletSalt)
			this.shadowRoot.getElementById('walletLockScreenActive').close()
			this.shadowRoot.getElementById('walletUnlockPassword').value = ''
			this.walletHelperMessage = this.renderWalletHelperPass()
		} else {
			this.shadowRoot.getElementById('walletUnlockPassword').value = ''
			this.walletHelperMessage = this.renderWalletHelperErr()
			await errDelay(3000)
			this.walletHelperMessage = this.renderWalletHelperPass()
		}
	}

	renderWalletHelperPass() {
		return html`<span style="color: #fff; font-weight: bold; font-size: 13px; float: left;">${translate("login.pleaseenter")}</span>`
	}

	renderWalletHelperErr() {
		return html`<span style="color: var(--mdc-theme-error); font-weight: bold;  font-size: 13px; float: right;">${translate("login.lp8")}</span>`
	}

	renderWarning() {
		return html`<span class="warning-text">${translate("tradepage.tchange48")} QORT</span>`
	}

	renderClearSuccess() {
		let strSuccessValue = this.successMessage
		if (strSuccessValue === "") {
			return html``
		} else {
			return html`
				<div class="successBox">
					<span style="color: green; float: left; padding-top: 4px; padding-left: 7px;">${this.successMessage}</span>
					<span style="padding-top: 4px: padding-right: 7px; float: right;">
						<mwc-icon-button class="btn-clear-success" title="${translate("general.close")}" icon="close" @click="${() => this.successMessage = ''}"></mwc-icon-button>
					</span>
				</div>
				<div style="margin-bottom: 15px;">
					<p style="margin-bottom: 0;">${translate("walletpage.wchange43")}</p>
				</div>
			`
		}
	}

	renderClearError() {
		let strErrorValue = this.errorMessage
		if (strErrorValue === "") {
			return html``
		} else {
			return html`
				<div class="errorBox">
					<span style="color: red; float: left; padding-top: 4px; padding-left: 7px;">${this.errorMessage}</span>
					<span style="padding-top: 4px: padding-right: 7px; float: right;">
						<mwc-icon-button class="btn-clear-error" title="${translate("general.close")}" icon="close" @click="${() => this.errorMessage = ''}"></mwc-icon-button>
					</span>
				</div>
				<div style="margin-bottom: 15px;">
					<p style="margin-bottom: 0;">${translate("walletpage.wchange44")}</p>
				</div>
			`
		}
	}

	tabWalletQort() {
		this._selectedWallet = 'qort'
		this.visitedTab = 0
		this.searchOffset = 0
		this.searchLimit = 10
		this.pageButtonsHidden = false
		this.showNewQortWallet()
	}

	tabWalletBtc() {
		this._selectedWallet = 'btc'
		this.showWallet()
	}

	tabWalletLtc() {
		this._selectedWallet = 'ltc'
		this.showWallet()
	}

	tabWalletDoge() {
		this._selectedWallet = 'doge'
		this.showWallet()
	}

	tabWalletDgb() {
		this._selectedWallet = 'dgb'
		this.showWallet()
	}

	tabWalletRvn() {
		this._selectedWallet = 'rvn'
		this.showWallet()
	}

	tabWalletArrr() {
		this._selectedWallet = 'arrr'
		this.showWallet()
	}

	qortAddressbook() {
		const storedQortalAddressBook = 'addressbookQort-' + this.bookQortalAddress
		if (localStorage.getItem(storedQortalAddressBook) === null) {
			localStorage.setItem(storedQortalAddressBook, "")
		} else {
			this.qortBook = JSON.parse(localStorage.getItem(storedQortalAddressBook) || "[]")
		}
	}

	btcAddressbook() {
		const storedBitcoinAddressBook = 'addressbookBtc-' + this.bookBitcoinAddress
		if (localStorage.getItem(storedBitcoinAddressBook) === null) {
			localStorage.setItem(storedBitcoinAddressBook, "")
		} else {
			this.btcBook = JSON.parse(localStorage.getItem(storedBitcoinAddressBook) || "[]")
		}
	}

	ltcAddressbook() {
		const storedLitecoinAddressBook = 'addressbookLtc-' + this.bookLitecoinAddress
		if (localStorage.getItem(storedLitecoinAddressBook) === null) {
			localStorage.setItem(storedLitecoinAddressBook, "")
		} else {
			this.ltcBook = JSON.parse(localStorage.getItem(storedLitecoinAddressBook) || "[]")
		}
	}

	dogeAddressbook() {
		const storedDogecoinAddressBook = 'addressbookDoge-' + this.bookDogecoinAddress
		if (localStorage.getItem(storedDogecoinAddressBook) === null) {
			localStorage.setItem(storedDogecoinAddressBook, "")
		} else {
			this.dogeBook = JSON.parse(localStorage.getItem(storedDogecoinAddressBook) || "[]")
		}
	}

	dgbAddressbook() {
		const storedDigibyteAddressBook = 'addressbookDgb-' + this.bookDigibyteAddress
		if (localStorage.getItem(storedDigibyteAddressBook) === null) {
			localStorage.setItem(storedDigibyteAddressBook, "")
		} else {
			this.dgbBook = JSON.parse(localStorage.getItem(storedDigibyteAddressBook) || "[]")
		}
	}

	rvnAddressbook() {
		const storedRavencoinAddressBook = 'addressbookRvn-' + this.bookRavencoinAddress
		if (localStorage.getItem(storedRavencoinAddressBook) === null) {
			localStorage.setItem(storedRavencoinAddressBook, "")
		} else {
			this.rvnBook = JSON.parse(localStorage.getItem(storedRavencoinAddressBook) || "[]")
		}
	}

	arrrAddressbook() {
		const storedPiratechainAddressBook = 'addressbookArrr-' + this.bookPiratechainAddress
		if (localStorage.getItem(storedPiratechainAddressBook) === null) {
			localStorage.setItem(storedPiratechainAddressBook, "")
		} else {
			this.arrrBook = JSON.parse(localStorage.getItem(storedPiratechainAddressBook) || "[]")
		}
	}

	openQortAddressbook() {
		this.shadowRoot.querySelector("#qortBookDialog").show()
	}

	openBtcAddressbook() {
		this.shadowRoot.querySelector("#btcBookDialog").show()
	}

	openLtcAddressbook() {
		this.shadowRoot.querySelector("#ltcBookDialog").show()
	}

	openDogeAddressbook() {
		this.shadowRoot.querySelector("#dogeBookDialog").show()
	}

	openDgbAddressbook() {
		this.shadowRoot.querySelector("#dgbBookDialog").show()
	}

	openRvnAddressbook() {
		this.shadowRoot.querySelector("#rvnBookDialog").show()
	}

	openArrrAddressbook() {
		this.shadowRoot.querySelector("#arrrBookDialog").show()
	}

	openAddQortAddressDialog() {
		this.qortBookAddress = this.selectedTransaction.recipient
		this.openAddToQortAddressbook()
		this.shadowRoot.querySelector('#showTransactionDetailsDialog').close()
	}

	openAddBtcAddressDialog() {
		this.btcBookAddress = this.selectedTransaction.btcReceiver
		this.openAddToBtcAddressbook()
		this.shadowRoot.querySelector('#showBtcTransactionDetailsDialog').close()
	}

	openAddLtcAddressDialog() {
		this.ltcBookAddress = this.selectedTransaction.ltcReceiver
		this.openAddToLtcAddressbook()
		this.shadowRoot.querySelector('#showLtcTransactionDetailsDialog').close()
	}

	openAddDogeAddressDialog() {
		this.dogeBookAddress = this.selectedTransaction.dogeReceiver
		this.openAddToDogeAddressbook()
		this.shadowRoot.querySelector('#showDogeTransactionDetailsDialog').close()
	}

	openAddDgbAddressDialog() {
		this.dgbBookAddress = this.selectedTransaction.dgbReceiver
		this.openAddToDgbAddressbook()
		this.shadowRoot.querySelector('#showDgbTransactionDetailsDialog').close()
	}

	openAddRvnAddressDialog() {
		this.rvnBookAddress = this.selectedTransaction.rvnReceiver
		this.openAddToRvnAddressbook()
		this.shadowRoot.querySelector('#showRvnTransactionDetailsDialog').close()
	}

	openAddArrrAddressDialog() {
		this.arrrBookAddress = this.selectedTransaction.arrrReceiver
		this.openAddToArrrAddressbook()
		this.shadowRoot.querySelector('#showArrrTransactionDetailsDialog').close()
	}

	openAddToQortAddressbook() {
		this.shadowRoot.querySelector("#addQortAddressDialog").show()
	}

	openAddToBtcAddressbook() {
		this.shadowRoot.querySelector("#addBtcAddressDialog").show()
	}

	openAddToLtcAddressbook() {
		this.shadowRoot.querySelector("#addLtcAddressDialog").show()
	}

	openAddToDogeAddressbook() {
		this.shadowRoot.querySelector("#addDogeAddressDialog").show()
	}

	openAddToDgbAddressbook() {
		this.shadowRoot.querySelector("#addDgbAddressDialog").show()
	}

	openAddToRvnAddressbook() {
		this.shadowRoot.querySelector("#addRvnAddressDialog").show()
	}

	openAddToArrrAddressbook() {
		this.shadowRoot.querySelector("#addArrrAddressDialog").show()
	}

	openImportQortAddressbook() {
		this.shadowRoot.querySelector("#importQortAddressbookDialog").show()
	}

	openImportBtcAddressbook() {
		this.shadowRoot.querySelector("#importBtcAddressbookDialog").show()
	}

	openImportLtcAddressbook() {
		this.shadowRoot.querySelector("#importLtcAddressbookDialog").show()
	}

	openImportDogeAddressbook() {
		this.shadowRoot.querySelector("#importDogeAddressbookDialog").show()
	}

	openImportDgbAddressbook() {
		this.shadowRoot.querySelector("#importDgbAddressbookDialog").show()
	}

	openImportRvnAddressbook() {
		this.shadowRoot.querySelector("#importRvnAddressbookDialog").show()
	}

	openImportArrrAddressbook() {
		this.shadowRoot.querySelector("#importArrrAddressbookDialog").show()
	}

	closeQortAddressDialog() {
		this.shadowRoot.querySelector('#addQortAddressDialog').close()
		this.shadowRoot.getElementById('qortNameInput').value = ''
		this.shadowRoot.getElementById('qortAddressInput').value = ''
		this.qortBookName = ''
		this.qortBookAddress = ''
	}

	closeBtcAddressDialog() {
		this.shadowRoot.querySelector('#addBtcAddressDialog').close()
		this.shadowRoot.getElementById('btcNameInput').value = ''
		this.shadowRoot.getElementById('btcAddressInput').value = ''
		this.btcBookName = ''
		this.btcBookAddress = ''
	}

	closeLtcAddressDialog() {
		this.shadowRoot.querySelector('#addLtcAddressDialog').close()
		this.shadowRoot.getElementById('ltcNameInput').value = ''
		this.shadowRoot.getElementById('ltcAddressInput').value = ''
		this.ltcBookName = ''
		this.ltcBookAddress = ''
	}

	closeDogeAddressDialog() {
		this.shadowRoot.querySelector('#addDogeAddressDialog').close()
		this.shadowRoot.getElementById('dogeNameInput').value = ''
		this.shadowRoot.getElementById('dogeAddressInput').value = ''
		this.dogeBookName = ''
		this.dogeBookAddress = ''
	}

	closeDgbAddressDialog() {
		this.shadowRoot.querySelector('#addDgbAddressDialog').close()
		this.shadowRoot.getElementById('dgbNameInput').value = ''
		this.shadowRoot.getElementById('dgbAddressInput').value = ''
		this.dgbBookName = ''
		this.dgbBookAddress = ''
	}

	closeRvnAddressDialog() {
		this.shadowRoot.querySelector('#addRvnAddressDialog').close()
		this.shadowRoot.getElementById('rvnNameInput').value = ''
		this.shadowRoot.getElementById('rvnAddressInput').value = ''
		this.rvnBookName = ''
		this.rvnBookAddress = ''
	}

	closeArrrAddressDialog() {
		this.shadowRoot.querySelector('#addArrrAddressDialog').close()
		this.shadowRoot.getElementById('arrrNameInput').value = ''
		this.shadowRoot.getElementById('arrrAddressInput').value = ''
		this.arrrBookName = ''
		this.arrrBookAddress = ''
	}

	closeImportQortAddressbookDialog() {
		this.shadowRoot.querySelector("#importQortAddressbookDialog").close()
	}

	closeImportBtcAddressbookDialog() {
		this.shadowRoot.querySelector("#importBtcAddressbookDialog").close()
	}

	closeImportLtcAddressbookDialog() {
		this.shadowRoot.querySelector("#importLtcAddressbookDialog").close()
	}

	closeImportDogeAddressbookDialog() {
		this.shadowRoot.querySelector("#importDogeAddressbookDialog").close()
	}

	closeImportDgbAddressbookDialog() {
		this.shadowRoot.querySelector("#importDgbAddressbookDialog").close()
	}

	closeImportRvnAddressbookDialog() {
		this.shadowRoot.querySelector("#importRvnAddressbookDialog").close()
	}

	closeImportArrrAddressbookDialog() {
		this.shadowRoot.querySelector("#importArrrAddressbookDialog").close()
	}

	addToQortalAddressbook() {
		const myQortalAddressBook = 'addressbookQort-' + this.bookQortalAddress

		let name = this.shadowRoot.getElementById('qortNameInput').value
		let address = this.shadowRoot.getElementById('qortAddressInput').value

		var oldQortalBook = JSON.parse(localStorage.getItem(myQortalAddressBook) || "[]")

		if (name.length === 0) {
			let qortbookstring1 = get("walletpage.wchange50")
			parentEpml.request('showSnackBar', `${qortbookstring1}`)
			return false
		}

		if (address.length === 0) {
			let qortbookstring2 = get("walletpage.wchange51")
			parentEpml.request('showSnackBar', `${qortbookstring2}`)
			return false
		}

		const newQortalBookItem = {
			name: name,
			address: address
		}

		oldQortalBook.push(newQortalBookItem)

		localStorage.setItem(myQortalAddressBook, JSON.stringify(oldQortalBook))

		let qortbookstring2 = get("walletpage.wchange52")
		parentEpml.request('showSnackBar', `${qortbookstring2}`)

		this.closeQortAddressDialog()
		this.qortBook = JSON.parse(localStorage.getItem(myQortalAddressBook) || "[]")
	}

	addToBitcoinAddressbook() {
		const myBitcoinAddressBook = 'addressbookBtc-' + this.bookBitcoinAddress

		let name = this.shadowRoot.getElementById('btcNameInput').value
		let address = this.shadowRoot.getElementById('btcAddressInput').value

		var oldBitcoinBook = JSON.parse(localStorage.getItem(myBitcoinAddressBook) || "[]")

		if (name.length === 0) {
			let btcbookstring1 = get("walletpage.wchange50")
			parentEpml.request('showSnackBar', `${btcbookstring1}`)
			return false
		}

		if (address.length === 0) {
			let btcbookstring2 = get("walletpage.wchange51")
			parentEpml.request('showSnackBar', `${btcbookstring2}`)
			return false
		}

		const newBitcoinBookItem = {
			name: name,
			address: address
		}

		oldBitcoinBook.push(newBitcoinBookItem)

		localStorage.setItem(myBitcoinAddressBook, JSON.stringify(oldBitcoinBook))

		let btcbookstring3 = get("walletpage.wchange52")
		parentEpml.request('showSnackBar', `${btcbookstring3}`)

		this.closeBtcAddressDialog()
		this.btcBook = JSON.parse(localStorage.getItem(myBitcoinAddressBook) || "[]")
	}

	addToLitecoinAddressbook() {
		const myLitecoinAddressBook = 'addressbookLtc-' + this.bookLitecoinAddress

		let name = this.shadowRoot.getElementById('ltcNameInput').value
		let address = this.shadowRoot.getElementById('ltcAddressInput').value

		var oldLitecoinBook = JSON.parse(localStorage.getItem(myLitecoinAddressBook) || "[]")

		if (name.length === 0) {
			let ltcbookstring1 = get("walletpage.wchange50")
			parentEpml.request('showSnackBar', `${ltcbookstring1}`)
			return false
		}

		if (address.length === 0) {
			let ltcbookstring2 = get("walletpage.wchange51")
			parentEpml.request('showSnackBar', `${ltcbookstring2}`)
			return false
		}

		const newLitecoinBookItem = {
			name: name,
			address: address
		}

		oldLitecoinBook.push(newLitecoinBookItem)

		localStorage.setItem(myLitecoinAddressBook, JSON.stringify(oldLitecoinBook))

		let ltcbookstring3 = get("walletpage.wchange52")
		parentEpml.request('showSnackBar', `${ltcbookstring3}`)

		this.closeLtcAddressDialog()
		this.ltcBook = JSON.parse(localStorage.getItem(myLitecoinAddressBook) || "[]")
	}

	addToDogecoinAddressbook() {
		const myDogecoinAddressBook = 'addressbookDoge-' + this.bookDogecoinAddress

		let name = this.shadowRoot.getElementById('dogeNameInput').value
		let address = this.shadowRoot.getElementById('dogeAddressInput').value

		var oldDogecoinBook = JSON.parse(localStorage.getItem(myDogecoinAddressBook) || "[]")

		if (name.length === 0) {
			let dogebookstring1 = get("walletpage.wchange50")
			parentEpml.request('showSnackBar', `${dogebookstring1}`)
			return false
		}

		if (address.length === 0) {
			let dogebookstring2 = get("walletpage.wchange51")
			parentEpml.request('showSnackBar', `${dogebookstring2}`)
			return false
		}

		const newDogecoinBookItem = {
			name: name,
			address: address
		}

		oldDogecoinBook.push(newDogecoinBookItem)

		localStorage.setItem(myDogecoinAddressBook, JSON.stringify(oldDogecoinBook))

		let dogebookstring3 = get("walletpage.wchange52")
		parentEpml.request('showSnackBar', `${dogebookstring3}`)

		this.closeDogeAddressDialog()
		this.dogeBook = JSON.parse(localStorage.getItem(myDogecoinAddressBook) || "[]")
	}

	addToDigibyteAddressbook() {
		const myDigibyteAddressBook = 'addressbookDgb-' + this.bookDigibyteAddress

		let name = this.shadowRoot.getElementById('dgbNameInput').value
		let address = this.shadowRoot.getElementById('dgbAddressInput').value

		var oldDigibyteBook = JSON.parse(localStorage.getItem(myDigibyteAddressBook) || "[]")

		if (name.length === 0) {
			let dgbbookstring1 = get("walletpage.wchange50")
			parentEpml.request('showSnackBar', `${dgbbookstring1}`)
			return false
		}

		if (address.length === 0) {
			let dgbbookstring2 = get("walletpage.wchange51")
			parentEpml.request('showSnackBar', `${dgbbookstring2}`)
			return false
		}

		const newDigibyteBookItem = {
			name: name,
			address: address
		}

		oldDigibyteBook.push(newDigibyteBookItem)

		localStorage.setItem(myDigibyteAddressBook, JSON.stringify(oldDigibyteBook))

		let dgbbookstring3 = get("walletpage.wchange52")
		parentEpml.request('showSnackBar', `${dgbbookstring3}`)

		this.closeDgbAddressDialog()
		this.dgbBook = JSON.parse(localStorage.getItem(myDigibyteAddressBook) || "[]")
	}

	addToRavencoinAddressbook() {
		const myRavencoinAddressBook = 'addressbookRvn-' + this.bookRavencoinAddress

		let name = this.shadowRoot.getElementById('rvnNameInput').value
		let address = this.shadowRoot.getElementById('rvnAddressInput').value

		var oldRavencoinBook = JSON.parse(localStorage.getItem(myRavencoinAddressBook) || "[]")

		if (name.length === 0) {
			let rvnbookstring1 = get("walletpage.wchange50")
			parentEpml.request('showSnackBar', `${rvnbookstring1}`)
			return false
		}

		if (address.length === 0) {
			let rvnbookstring2 = get("walletpage.wchange51")
			parentEpml.request('showSnackBar', `${rvnbookstring2}`)
			return false
		}

		const newRavencoinBookItem = {
			name: name,
			address: address
		}

		oldRavencoinBook.push(newRavencoinBookItem)

		localStorage.setItem(myRavencoinAddressBook, JSON.stringify(oldRavencoinBook))

		let rvnbookstring3 = get("walletpage.wchange52")
		parentEpml.request('showSnackBar', `${rvnbookstring3}`)

		this.closeRvnAddressDialog()
		this.rvnBook = JSON.parse(localStorage.getItem(myRavencoinAddressBook) || "[]")
	}

	addToPiratechainAddressbook() {
		const myPiratechainAddressBook = 'addressbookArrr-' + this.bookPiratechainAddress

		let name = this.shadowRoot.getElementById('arrrNameInput').value
		let address = this.shadowRoot.getElementById('arrrAddressInput').value

		var oldPiratechainBook = JSON.parse(localStorage.getItem(myPiratechainAddressBook) || "[]")

		if (name.length === 0) {
			let arrrbookstring1 = get("walletpage.wchange50")
			parentEpml.request('showSnackBar', `${arrrbookstring1}`)
			return false
		}

		if (address.length === 0) {
			let arrrbookstring2 = get("walletpage.wchange51")
			parentEpml.request('showSnackBar', `${arrrbookstring2}`)
			return false
		}

		const newPiratechainBookItem = {
			name: name,
			address: address
		}

		oldPiratechainBook.push(newPiratechainBookItem)

		localStorage.setItem(myPiratechainAddressBook, JSON.stringify(oldPiratechainBook))

		let arrrbookstring3 = get("walletpage.wchange52")
		parentEpml.request('showSnackBar', `${arrrbookstring3}`)

		this.closeArrrAddressDialog()
		this.arrrBook = JSON.parse(localStorage.getItem(myPiratechainAddressBook) || "[]")
	}

	sendFromQortAddressbook(websiteObj) {
		this.recipient = websiteObj.address
		this.openSendQort()
		this.shadowRoot.querySelector('#qortBookDialog').close()
	}

	sendFromBtcAddressbook(websiteObj) {
		this.btcRecipient = websiteObj.address
		this.openSendBtc()
		this.shadowRoot.querySelector('#btcBookDialog').close()
	}

	sendFromLtcAddressbook(websiteObj) {
		this.ltcRecipient = websiteObj.address
		this.openSendLtc()
		this.shadowRoot.querySelector('#ltcBookDialog').close()
	}

	sendFromDogeAddressbook(websiteObj) {
		this.dogeRecipient = websiteObj.address
		this.openSendDoge()
		this.shadowRoot.querySelector('#dogeBookDialog').close()
	}

	sendFromDgbAddressbook(websiteObj) {
		this.dgbRecipient = websiteObj.address
		this.openSendDgb()
		this.shadowRoot.querySelector('#dgbBookDialog').close()
	}

	sendFromRvnAddressbook(websiteObj) {
		this.rvnRecipient = websiteObj.address
		this.openSendRvn()
		this.shadowRoot.querySelector('#rvnBookDialog').close()
	}

	sendFromArrrAddressbook(websiteObj) {
		this.arrrRecipient = websiteObj.address
		this.openSendArrr()
		this.shadowRoot.querySelector('#arrrBookDialog').close()
	}

	removeQortAddress(adressObj) {
		const theQortalAddressBook = 'addressbookQort-' + this.bookQortalAddress
		const addressToRemove = adressObj
		this.newQortBookFilter = []
		this.newQortBookFilter = this.qortBook.filter((item) => item.address !== addressToRemove)
		const myNewObj = JSON.stringify(this.newQortBookFilter)
		localStorage.removeItem(theQortalAddressBook)
		localStorage.setItem(theQortalAddressBook, myNewObj)
		this.qortBook = JSON.parse(localStorage.getItem(theQortalAddressBook) || "[]")
	}

	removeBtcAddress(adressObj) {
		const theBitcoinAddressBook = 'addressbookBtc-' + this.bookBitcoinAddress
		const addressToRemove = adressObj
		this.newBtcBookFilter = []
		this.newBtcBookFilter = this.btcBook.filter((item) => item.address !== addressToRemove)
		const myNewObj = JSON.stringify(this.newBtcBookFilter)
		localStorage.removeItem(theBitcoinAddressBook)
		localStorage.setItem(theBitcoinAddressBook, myNewObj)
		this.btcBook = JSON.parse(localStorage.getItem(theBitcoinAddressBook) || "[]")
	}

	removeLtcAddress(adressObj) {
		const theLitecoinAddressBook = 'addressbookLtc-' + this.bookLitecoinAddress
		const addressToRemove = adressObj
		this.newLtcBookFilter = []
		this.newLtcBookFilter = this.ltcBook.filter((item) => item.address !== addressToRemove)
		const myNewObj = JSON.stringify(this.newLtcBookFilter)
		localStorage.removeItem(theLitecoinAddressBook)
		localStorage.setItem(theLitecoinAddressBook, myNewObj)
		this.ltcBook = JSON.parse(localStorage.getItem(theLitecoinAddressBook) || "[]")
	}

	removeDogeAddress(adressObj) {
		const theDogecoinAddressBook = 'addressbookDoge-' + this.bookDogecoinAddress
		const addressToRemove = adressObj
		this.newDogeBookFilter = []
		this.newDogeBookFilter = this.dogeBook.filter((item) => item.address !== addressToRemove)
		const myNewObj = JSON.stringify(this.newDogeBookFilter)
		localStorage.removeItem(theDogecoinAddressBook)
		localStorage.setItem(theDogecoinAddressBook, myNewObj)
		this.dogeBook = JSON.parse(localStorage.getItem(theDogecoinAddressBook) || "[]")
	}

	removeDgbAddress(adressObj) {
		const theDigibyteAddressBook = 'addressbookDgb-' + this.bookDigibyteAddress
		const addressToRemove = adressObj
		this.newDgbBookFilter = []
		this.newDgbBookFilter = this.dgbBook.filter((item) => item.address !== addressToRemove)
		const myNewObj = JSON.stringify(this.newDgbBookFilter)
		localStorage.removeItem(theDigibyteAddressBook)
		localStorage.setItem(theDigibyteAddressBook, myNewObj)
		this.dgbBook = JSON.parse(localStorage.getItem(theDigibyteAddressBook) || "[]")
	}

	removeRvnAddress(adressObj) {
		const theRavencoinAddressBook = 'addressbookRvn-' + this.bookRavencoinAddress
		const addressToRemove = adressObj
		this.newRvnBookFilter = []
		this.newRvnBookFilter = this.rvnBook.filter((item) => item.address !== addressToRemove)
		const myNewObj = JSON.stringify(this.newRvnBookFilter)
		localStorage.removeItem(theRavencoinAddressBook)
		localStorage.setItem(theRavencoinAddressBook, myNewObj)
		this.rvnBook = JSON.parse(localStorage.getItem(theRavencoinAddressBook) || "[]")
	}

	removeArrrAddress(adressObj) {
		const thePiratechainAddressBook = 'addressbookArrr-' + this.bookPiratechainAddress
		const addressToRemove = adressObj
		this.newArrrBookFilter = []
		this.newArrrBookFilter = this.arrrBook.filter((item) => item.address !== addressToRemove)
		const myNewObj = JSON.stringify(this.newArrrBookFilter)
		localStorage.removeItem(thePiratechainAddressBook)
		localStorage.setItem(thePiratechainAddressBook, myNewObj)
		this.arrrBook = JSON.parse(localStorage.getItem(thePiratechainAddressBook) || "[]")
	}

	renderSendFromQortAddressbookButton(websiteObj) {
		return html`<mwc-button dense unelevated label="${translate("walletpage.wchange17")} QORT" icon="send" @click="${() => this.sendFromQortAddressbook(websiteObj)}"></mwc-button>`
	}

	renderSendFromBtcAddressbookButton(websiteObj) {
		return html`<mwc-button dense unelevated label="${translate("walletpage.wchange17")} BTC" icon="send" @click="${() => this.sendFromBtcAddressbook(websiteObj)}"></mwc-button>`
	}

	renderSendFromLtcAddressbookButton(websiteObj) {
		return html`<mwc-button dense unelevated label="${translate("walletpage.wchange17")} LTC" icon="send" @click="${() => this.sendFromLtcAddressbook(websiteObj)}"></mwc-button>`
	}

	renderSendFromDogeAddressbookButton(websiteObj) {
		return html`<mwc-button dense unelevated label="${translate("walletpage.wchange17")} DOGE" icon="send" @click="${() => this.sendFromDogeAddressbook(websiteObj)}"></mwc-button>`
	}

	renderSendFromDgbAddressbookButton(websiteObj) {
		return html`<mwc-button dense unelevated label="${translate("walletpage.wchange17")} DGB" icon="send" @click="${() => this.sendFromDgbAddressbook(websiteObj)}"></mwc-button>`
	}

	renderSendFromRvnAddressbookButton(websiteObj) {
		return html`<mwc-button dense unelevated label="${translate("walletpage.wchange17")} RVN" icon="send" @click="${() => this.sendFromRvnAddressbook(websiteObj)}"></mwc-button>`
	}

	renderSendFromArrrAddressbookButton(websiteObj) {
		return html`<mwc-button dense unelevated label="${translate("walletpage.wchange17")} ARRR" icon="send" @click="${() => this.sendFromArrrAddressbook(websiteObj)}"></mwc-button>`
	}

	exportQortAddressbook() {
		const expQortalAddressBook = 'addressbookQort-' + this.bookQortalAddress
		let bookname = ""
		const qortBookData = JSON.stringify(localStorage.getItem(expQortalAddressBook))
		const qortBookSave = JSON.parse((qortBookData) || "[]")
		const blob = new Blob([qortBookSave], { type: 'text/plain;charset=utf-8' })
		bookname = "qortal_addressbook." + this.bookQortalAddress + ".qort.json"
		this.saveFileToDisk(blob, bookname)
	}

	exportBtcAddressbook() {
		const expBitcoinAddressBook = 'addressbookBtc-' + this.bookBitcoinAddress
		let bookname = ""
		const btcBookData = JSON.stringify(localStorage.getItem(expBitcoinAddressBook))
		const btcBookSave = JSON.parse((btcBookData) || "[]")
		const blob = new Blob([btcBookSave], { type: 'text/plain;charset=utf-8' })
		bookname = "bitcoin_addressbook." + this.bookBitcoinAddress + ".btc.json"
		this.saveFileToDisk(blob, bookname)
	}

	exportLtcAddressbook() {
		const expLitecoinAddressBook = 'addressbookLtc-' + this.bookLitecoinAddress
		let bookname = ""
		const ltcBookData = JSON.stringify(localStorage.getItem(expLitecoinAddressBook))
		const ltcBookSave = JSON.parse((ltcBookData) || "[]")
		const blob = new Blob([ltcBookSave], { type: 'text/plain;charset=utf-8' })
		bookname = "litecoin_addressbook." + this.bookLitecoinAddress + ".ltc.json"
		this.saveFileToDisk(blob, bookname)
	}

	exportDogeAddressbook() {
		const expDogecoinAddressBook = 'addressbookDoge-' + this.bookDogecoinAddress
		let bookname = ""
		const dogeBookData = JSON.stringify(localStorage.getItem(expDogecoinAddressBook))
		const dogeBookSave = JSON.parse((dogeBookData) || "[]")
		const blob = new Blob([dogeBookSave], { type: 'text/plain;charset=utf-8' })
		bookname = "dogecoin_addressbook." + this.bookDogecoinAddress + ".doge.json"
		this.saveFileToDisk(blob, bookname)
	}

	exportDgbAddressbook() {
		const expDigibyteAddressBook = 'addressbookDgb-' + this.bookDigibyteAddress
		let bookname = ""
		const dgbBookData = JSON.stringify(localStorage.getItem(expDigibyteAddressBook))
		const dgbBookSave = JSON.parse((dgbBookData) || "[]")
		const blob = new Blob([dgbBookSave], { type: 'text/plain;charset=utf-8' })
		bookname = "digibyte_addressbook." + this.bookDigibyteAddress + ".dgb.json"
		this.saveFileToDisk(blob, bookname)
	}

	exportRvnAddressbook() {
		const expRavencoinAddressBook = 'addressbookRvn-' + this.bookRavencoinAddress
		let bookname = ""
		const rvnBookData = JSON.stringify(localStorage.getItem(expRavencoinAddressBook))
		const rvnBookSave = JSON.parse((rvnBookData) || "[]")
		const blob = new Blob([rvnBookSave], { type: 'text/plain;charset=utf-8' })
		bookname = "ravencoin_addressbook." + this.bookRavencoinAddress + ".rvn.json"
		this.saveFileToDisk(blob, bookname)
	}

	exportArrrAddressbook() {
		const expPiratechainAddressBook = 'addressbookArrr-' + this.bookPiratechainAddress
		let bookname = ""
		const arrrBookData = JSON.stringify(localStorage.getItem(expPiratechainAddressBook))
		const arrrBookSave = JSON.parse((arrrBookData) || "[]")
		const blob = new Blob([arrrBookSave], { type: 'text/plain;charset=utf-8' })
		bookname = "piratechain_addressbook." + this.bookPiratechainAddress + ".arrr.json"
		this.saveFileToDisk(blob, bookname)
	}

	importQortAddressbook(file) {
		const impQortalAddressBook = 'addressbookQort-' + this.bookQortalAddress
		localStorage.removeItem(impQortalAddressBook)
		const newItems = JSON.parse((file) || "[]")
		localStorage.setItem(impQortalAddressBook, JSON.stringify(newItems))
		this.qortBook = JSON.parse(localStorage.getItem(impQortalAddressBook) || "[]")
		this.shadowRoot.querySelector('#importQortAddressbookDialog').close()
	}

	importBtcAddressbook(file) {
		const impBitcoinAddressBook = 'addressbookBtc-' + this.bookBitcoinAddress
		localStorage.removeItem(impBitcoinAddressBook)
		const newItems = JSON.parse((file) || "[]")
		localStorage.setItem(impBitcoinAddressBook, JSON.stringify(newItems))
		this.btcBook = JSON.parse(localStorage.getItem(impBitcoinAddressBook) || "[]")
		this.shadowRoot.querySelector('#importBtcAddressbookDialog').close()
	}

	importLtcAddressbook(file) {
		const impLitecoinAddressBook = 'addressbookLtc-' + this.bookLitecoinAddress
		localStorage.removeItem(impLitecoinAddressBook)
		const newItems = JSON.parse((file) || "[]")
		localStorage.setItem(impLitecoinAddressBook, JSON.stringify(newItems))
		this.ltcBook = JSON.parse(localStorage.getItem(impLitecoinAddressBook) || "[]")
		this.shadowRoot.querySelector('#importLtcAddressbookDialog').close()
	}

	importDogeAddressbook(file) {
		const impDogecoinAddressBook = 'addressbookDoge-' + this.bookDogecoinAddress
		localStorage.removeItem(impDogecoinAddressBook)
		const newItems = JSON.parse((file) || "[]")
		localStorage.setItem(impDogecoinAddressBook, JSON.stringify(newItems))
		this.dogeBook = JSON.parse(localStorage.getItem(impDogecoinAddressBook) || "[]")
		this.shadowRoot.querySelector('#importDogeAddressbookDialog').close()
	}

	importDgbAddressbook(file) {
		const impDigibyteAddressBook = 'addressbookDgb-' + this.bookDigibyteAddress
		localStorage.removeItem(impDigibyteAddressBook)
		const newItems = JSON.parse((file) || "[]")
		localStorage.setItem(impDigibyteAddressBook, JSON.stringify(newItems))
		this.dgbBook = JSON.parse(localStorage.getItem(impDigibyteAddressBook) || "[]")
		this.shadowRoot.querySelector('#importDgbAddressbookDialog').close()
	}

	importRvnAddressbook(file) {
		const impRavencoinAddressBook = 'addressbookRvn-' + this.bookRavencoinAddress
		localStorage.removeItem(impRavencoinAddressBook)
		const newItems = JSON.parse((file) || "[]")
		localStorage.setItem(impRavencoinAddressBook, JSON.stringify(newItems))
		this.rvnBook = JSON.parse(localStorage.getItem(impRavencoinAddressBook) || "[]")
		this.shadowRoot.querySelector('#importRvnAddressbookDialog').close()
	}

	importArrrAddressbook(file) {
		const impPiratechainAddressBook = 'addressbookArrr-' + this.bookPiratechainAddress
		localStorage.removeItem(impPiratechainAddressBook)
		const newItems = JSON.parse((file) || "[]")
		localStorage.setItem(impPiratechainAddressBook, JSON.stringify(newItems))
		this.arrrBook = JSON.parse(localStorage.getItem(impPiratechainAddressBook) || "[]")
		this.shadowRoot.querySelector('#importArrrAddressbookDialog').close()
	}

	closeQortDialog() {
		this.shadowRoot.querySelector('#sendQortDialog').close()
		this.shadowRoot.getElementById('amountInput').value = ''
		this.shadowRoot.getElementById('recipient').value = ''
		this.recipient = ''
		this.amount = 0
		this.successMessage = ''
		this.errorMessage = ''
	}

	closeBtcDialog() {
		this.shadowRoot.querySelector('#sendBtcDialog').close()
		this.shadowRoot.getElementById('btcAmountInput').value = 0
		this.shadowRoot.getElementById('btcRecipient').value = ''
		this.btcRecipient = ''
		this.btcAmount = 0
		this.successMessage = ''
		this.errorMessage = ''
	}

	closeLtcDialog() {
		this.shadowRoot.querySelector('#sendLtcDialog').close()
		this.shadowRoot.getElementById('ltcAmountInput').value = 0
		this.shadowRoot.getElementById('ltcRecipient').value = ''
		this.ltcRecipient = ''
		this.ltcAmount = 0
		this.successMessage = ''
		this.errorMessage = ''
	}

	closeDogeDialog() {
		this.shadowRoot.querySelector('#sendDogeDialog').close()
		this.shadowRoot.getElementById('dogeAmountInput').value = 0
		this.shadowRoot.getElementById('dogeRecipient').value = ''
		this.dogeRecipient = ''
		this.dogeAmount = 0
		this.successMessage = ''
		this.errorMessage = ''
	}

	closeDgbDialog() {
		this.shadowRoot.querySelector('#sendDgbDialog').close()
		this.shadowRoot.getElementById('dgbAmountInput').value = 0
		this.shadowRoot.getElementById('dgbRecipient').value = ''
		this.dgbRecipient = ''
		this.dgbAmount = 0
		this.successMessage = ''
		this.errorMessage = ''
	}

	closeRvnDialog() {
		this.shadowRoot.querySelector('#sendRvnDialog').close()
		this.shadowRoot.getElementById('rvnAmountInput').value = 0
		this.shadowRoot.getElementById('rvRecipient').value = ''
		this.rvnRecipient = ''
		this.rvnAmount = 0
		this.successMessage = ''
		this.errorMessage = ''
	}

	closeArrrDialog() {
		this.shadowRoot.querySelector('#sendArrrDialog').close()
		this.shadowRoot.getElementById('arrrRecipient').value = ''
		this.shadowRoot.getElementById('arrrMemo').value = ''
		this.arrrRecipient = ''
		this.arrrMemo = ''
		this.arrrAmount = 0
		this.successMessage = ''
		this.errorMessage = ''
	}

	sendToQortAddress() {
		this.recipient = this.selectedTransaction.recipient
		this.openSendQort()
		this.shadowRoot.querySelector('#showTransactionDetailsDialog').close()
	}

	sendToBtcAddress() {
		this.btcRecipient = this.selectedTransaction.btcReceiver
		this.openSendBtc()
		this.shadowRoot.querySelector('#showBtcTransactionDetailsDialog').close()
	}

	sendToLtcAddress() {
		this.ltcRecipient = this.selectedTransaction.ltcReceiver
		this.openSendLtc()
		this.shadowRoot.querySelector('#showLtcTransactionDetailsDialog').close()
	}

	sendToDogeAddress() {
		this.dogeRecipient = this.selectedTransaction.dogeReceiver
		this.openSendDoge()
		this.shadowRoot.querySelector('#showDogeTransactionDetailsDialog').close()
	}

	sendToDgbAddress() {
		this.dgbRecipient = this.selectedTransaction.dgbReceiver
		this.openSendDgb()
		this.shadowRoot.querySelector('#showDgbTransactionDetailsDialog').close()
	}

	sendToRvnAddress() {
		this.rvnRecipient = this.selectedTransaction.rvnReceiver
		this.openSendRvn()
		this.shadowRoot.querySelector('#showRvnTransactionDetailsDialog').close()
	}

	sendToArrrAddress() {
		this.arrrRecipient = this.selectedTransaction.arrrReceiver
		this.openSendArrr()
		this.shadowRoot.querySelector('#showArrrTransactionDetailsDialog').close()
	}

	calculateQortAll() {
		this.amount = 0
		this.shadowRoot.getElementById('amountInput').value = this.amount
		if (this.balance < 0.01100000) {
			let not_enough_string = get("walletpage.wchange26")
			parentEpml.request('showSnackBar', `${not_enough_string}`)
		} else {
			this.amount = (this.balance - 0.01100000).toFixed(8)
			this.shadowRoot.getElementById('amountInput').value = this.amount
			this.shadowRoot.getElementById('amountInput').blur()
			this.shadowRoot.getElementById('amountInput').focus()
		}
	}

	calculateBtcAll() {
		if (this.balance < 0.00051000) {
			let not_enough_string = get("walletpage.wchange26")
			parentEpml.request('showSnackBar', `${not_enough_string}`)
		} else {
			this.btcAmount = (this.balance - 0.00050000).toFixed(8)
			this.btcFeePerByte = 100
		}
	}

	calculateLtcAll() {
		if (this.balance < 0.00031000) {
			let not_enough_string = get("walletpage.wchange26")
			parentEpml.request('showSnackBar', `${not_enough_string}`)
		} else {
			this.ltcAmount = (this.balance - 0.00030000).toFixed(8)
			this.ltcFeePerByte = 15
		}
	}

	calculateDogeAll() {
		if (this.balance < 0.05100000) {
			let not_enough_string = get("walletpage.wchange26")
			parentEpml.request('showSnackBar', `${not_enough_string}`)
		} else {
			this.dogeAmount = (this.balance - 0.05000000).toFixed(8)
			this.dogeFeePerByte = 1000
		}
	}

	calculateDgbAll() {
		if (this.balance < 0.00005100) {
			let not_enough_string = get("walletpage.wchange26")
			parentEpml.request('showSnackBar', `${not_enough_string}`)
		} else {
			this.dgbAmount = (this.balance - 0.00005000).toFixed(8)
			this.dgbFeePerByte = 10
		}
	}

	calculateRvnAll() {
		if (this.balance < 0.00572500) {
			let not_enough_string = get("walletpage.wchange26")
			parentEpml.request('showSnackBar', `${not_enough_string}`)
		} else {
			this.rvnAmount = (this.balance - 0.00562500).toFixed(8)
			this.rvnFeePerByte = 1125
		}
	}

	calculateArrrAll() {
		if (this.balance < 0.00011000) {
			let not_enough_string = get("walletpage.wchange26")
			parentEpml.request('showSnackBar', `${not_enough_string}`)
		} else {
			this.arrrAmount = (this.balance - 0.00010000).toFixed(8)
		}
	}

	renderSQB() {
		let displaybutton = this.selectedTransaction.recipient
		if (displaybutton == null) {
			return html`<span>${this.selectedTransaction.recipient}</span>`
		} else {
			return html`
				<span>${this.selectedTransaction.recipient}</span>
				<paper-icon-button icon="icons:send" @click=${() => this.sendToQortAddress()} title="${translate("walletpage.wchange46")}"></paper-icon-button>
				<paper-icon-button icon="icons:add-circle" @click=${() => this.openAddQortAddressDialog()} title="${translate("walletpage.wchange49")}"></paper-icon-button>
			`
		}
	}

	renderCAB() {
		return html`
			<span>${this.selectedTransaction.aTAddress}</span>
			<button-icon-copy
				title="${translate("blockpage.bcchange8")}"
				onSuccessMessage="${translate("walletpage.wchange4")}"
				onErrorMessage="${translate("walletpage.wchange39")}"
				textToCopy=${this.selectedTransaction.aTAddress}
				buttonSize="24px"
				iconSize="16px"
				color="var(--copybutton)"
				offsetLeft="4px"
			></button-icon-copy>
		`
	}

	renderFetchText() {
		return html`${translate("walletpage.wchange1")}`
	}

	renderInvalidText() {
		return html`${translate("walletpage.wchange27")}`
	}

	renderReceiverText() {
		return html`${translate("walletpage.wchange29")}`
	}

	renderSuccessText() {
		return html`${translate("walletpage.wchange30")}`
	}

	renderFailText() {
		return html`${translate("walletpage.wchange31")}`
	}

	renderOutText() {
		return html`${translate("walletpage.wchange7")}`
	}

	renderInText() {
		return html`${translate("walletpage.wchange8")}`
	}

	_checkAmount(e) {
		const targetAmount = e.target.value
		const target = e.target

		if (targetAmount.length === 0) {
			this.isValidAmount = false
			this.btnDisable = true

			e.target.blur()
			e.target.focus()

			e.target.invalid = true
			e.target.validationMessage = this.renderInvalidText()
		} else {
			this.btnDisable = false
		}

		e.target.blur()
		e.target.focus()

		e.target.validityTransform = (newValue, nativeValidity) => {
			if (newValue.includes('-') === true) {
				this.btnDisable = true
				target.validationMessage = this.renderInvalidText()

				return {
					valid: false
				}
			} else if (!nativeValidity.valid) {
				if (newValue.includes('.') === true) {
					let myAmount = newValue.split('.')
					if (myAmount[1].length > 8) {
						this.btnDisable = true
						target.validationMessage = this.renderInvalidText()
					} else {
						return {
							valid: true
						}
					}
				}
			} else {
				this.btnDisable = false
			}
		}
	}

	checkQortAmount(e) {
		const targetAmount = e.target.value
		const target = e.target
		this.btnDisable = true
		this.qortWarning = false

		if (targetAmount.length === 0) {
			this.isValidAmount = false
			this.btnDisable = true
			this.qortWarning = false
			e.target.blur()
			e.target.focus()
			e.target.invalid = true
		} else {
			const checkQortAmountInput = this.shadowRoot.getElementById('amountInput').value
			const checkQortAmount = this.round(parseFloat(checkQortAmountInput))
			const myFunds = this.round(parseFloat(this.balance - 0.01100000))
			if (Number(myFunds) >= Number(checkQortAmount)) {
				this.shadowRoot.getElementById('amountInput').value = checkQortAmountInput
				this.btnDisable = false
				this.qortWarning = false
			} else {
				this.shadowRoot.getElementById('amountInput').value = checkQortAmountInput
				this.btnDisable = true
				this.qortWarning = true
			}
		}

		e.target.blur()
		e.target.focus()

		e.target.validityTransform = (newValue, nativeValidity) => {
			if (newValue.includes('-') === true) {
				this.btnDisable = true
				this.qortWarning = false
				return {
					valid: false
				}
			} else if (!nativeValidity.valid) {
				if (newValue.includes('.') === true) {
					let myAmount = newValue.split('.')
					if (myAmount[1].length > 8) {
						this.btnDisable = true
						this.qortWarning = false
					} else {
						const checkQortAmountInput = this.shadowRoot.getElementById('amountInput').value
						const checkQortAmount = this.round(parseFloat(checkQortAmountInput))
						const myFunds = this.round(parseFloat(this.balance - 0.01100000))
						if (Number(myFunds) >= Number(checkQortAmount)) {
							this.shadowRoot.getElementById('amountInput').value = checkQortAmountInput
							this.btnDisable = false
							this.qortWarning = false
						} else {
							this.shadowRoot.getElementById('amountInput').value = checkQortAmountInput
							this.btnDisable = true
							this.qortWarning = true
						}
						return {
							valid: true
						}
					}
				}
			} else {
				const checkQortAmountInput = this.shadowRoot.getElementById('amountInput').value
				const checkQortAmount = this.round(parseFloat(checkQortAmountInput))
				const myFunds = this.round(parseFloat(this.balance - 0.01100000))
				if (Number(myFunds) >= Number(checkQortAmount)) {
					this.shadowRoot.getElementById('amountInput').value = checkQortAmountInput
					this.btnDisable = false
					this.qortWarning = false
				} else {
					this.shadowRoot.getElementById('amountInput').value = checkQortAmountInput
					this.btnDisable = true
					this.qortWarning = true
				}
			}
		}
	}

	async sendQort() {
		const sendFee = this.qortPaymentFee
		const amount = this.shadowRoot.getElementById('amountInput').value
		let recipient = this.shadowRoot.getElementById('recipient').value

		this.sendMoneyLoading = true
		this.btnDisable = true

		if (parseFloat(amount) + parseFloat(0.001) > parseFloat(this.balance)) {
			this.sendMoneyLoading = false
			this.btnDisable = false
			let snack1string = get("walletpage.wchange26")
			parentEpml.request('showSnackBar', `${snack1string}`)
			return false
		}

		if (parseFloat(amount) <= 0) {
			this.sendMoneyLoading = false
			this.btnDisable = false
			let snack2string = get("walletpage.wchange27")
			parentEpml.request('showSnackBar', `${snack2string}`)
			return false
		}

		if (recipient.length === 0) {
			this.sendMoneyLoading = false
			this.btnDisable = false
			let snack3string = get("walletpage.wchange28")
			parentEpml.request('showSnackBar', `${snack3string}`)
			return false
		}

		const getLastRef = async () => {
			return await parentEpml.request('apiCall', {
				type: 'api',
				url: `/addresses/lastreference/${this.getSelectedWalletAddress()}`
			})
		}

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

		const validateAddress = async (receiverAddress) => {
			return await window.parent.validateAddress(receiverAddress)
		}

		const validateReceiver = async (recipient) => {
			let lastRef = await getLastRef()
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

		const getName = async (recipient) => {
			try {
				const getNames = await parentEpml.request("apiCall", {
					type: "api",
					url: `/names/address/${recipient}`
				})
				if (getNames?.length > 0) {
					return getNames[0].name
				} else {
					return ''
				}
			} catch (error) {
				return ''
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

			return await parentEpml.request('transaction', {
				type: 2,
				nonce: this.wallets.get(this._selectedWallet).wallet.nonce,
				params: {
					recipient: myReceiver,
					recipientName: recipientName,
					amount: amount,
					lastReference: mylastRef,
					fee: sendFee,
					dialogamount: dialogamount,
					dialogto: dialogto,
					dialogAddress,
					dialogName
				},
			})
		}

		const getTxnRequestResponse = (txnResponse) => {
			if (txnResponse.success === false && txnResponse.message) {
				this.errorMessage = txnResponse.message
				this.sendMoneyLoading = false
				this.btnDisable = false
				throw new Error(txnResponse)
			} else if (txnResponse.success === true && !txnResponse.data.error) {
				this.shadowRoot.getElementById('amountInput').value = ''
				this.shadowRoot.getElementById('recipient').value = ''
				this.errorMessage = ''
				this.recipient = ''
				this.amount = 0
				this.successMessage = this.renderSuccessText()
				this.sendMoneyLoading = false
				this.btnDisable = false
			} else {
				this.errorMessage = txnResponse.data.message
				this.sendMoneyLoading = false
				this.btnDisable = false
				throw new Error(txnResponse)
			}
		}
		await validateReceiver(recipient)
		await this.showNewQortWallet()
	}

	async sendBtc() {
		const btcAmount = this.shadowRoot.getElementById('btcAmountInput').value
		let btcRecipient = this.shadowRoot.getElementById('btcRecipient').value
		const xprv58 = this.wallets.get(this._selectedWallet).wallet.derivedMasterPrivateKey

		this.sendMoneyLoading = true
		this.btnDisable = true

		const makeRequest = async () => {
			const opts = {
				xprv58: xprv58,
				receivingAddress: btcRecipient,
				bitcoinAmount: btcAmount,
				feePerByte: (this.btcFeePerByte / 1e8).toFixed(8)
			}
			return await parentEpml.request('sendBtc', opts)
		}

		const manageResponse = (response) => {
			if (response.length === 64) {
				this.shadowRoot.getElementById('btcAmountInput').value = 0
				this.shadowRoot.getElementById('btcRecipient').value = ''
				this.errorMessage = ''
				this.btcRecipient = ''
				this.btcAmount = 0
				this.successMessage = this.renderSuccessText()
				this.sendMoneyLoading = false
				this.btnDisable = false
			} else if (response === false) {
				this.errorMessage = this.renderFailText()
				this.sendMoneyLoading = false
				this.btnDisable = false
				throw new Error(txnResponse)
			} else {
				this.errorMessage = response.message
				this.sendMoneyLoading = false
				this.btnDisable = false
				throw new Error(response)
			}
		}
		const res = await makeRequest()
		manageResponse(res)
		await this.showWallet()
	}

	async sendLtc() {
		const ltcAmount = this.shadowRoot.getElementById('ltcAmountInput').value
		const ltcRecipient = this.shadowRoot.getElementById('ltcRecipient').value
		const xprv58 = this.wallets.get(this._selectedWallet).wallet.derivedMasterPrivateKey

		this.sendMoneyLoading = true
		this.btnDisable = true

		const makeRequest = async () => {
			const opts = {
				xprv58: xprv58,
				receivingAddress: ltcRecipient,
				litecoinAmount: ltcAmount,
				feePerByte: (this.ltcFeePerByte / 1e8).toFixed(8)
			}
			return await parentEpml.request('sendLtc', opts)
		}

		const manageResponse = (response) => {
			if (response.length === 64) {
				this.shadowRoot.getElementById('ltcAmountInput').value = 0
				this.shadowRoot.getElementById('ltcRecipient').value = ''
				this.errorMessage = ''
				this.ltcRecipient = ''
				this.ltcAmount = 0
				this.successMessage = this.renderSuccessText()
				this.sendMoneyLoading = false
				this.btnDisable = false
			} else if (response === false) {
				this.errorMessage = this.renderFailText()
				this.sendMoneyLoading = false
				this.btnDisable = false
				throw new Error(txnResponse)
			} else {
				this.errorMessage = response.message
				this.sendMoneyLoading = false
				this.btnDisable = false
				throw new Error(response)
			}
		}
		const res = await makeRequest()
		manageResponse(res)
		await this.showWallet()
	}

	async sendDoge() {
		const dogeAmount = this.shadowRoot.getElementById('dogeAmountInput').value
		let dogeRecipient = this.shadowRoot.getElementById('dogeRecipient').value
		const xprv58 = this.wallets.get(this._selectedWallet).wallet.derivedMasterPrivateKey

		this.sendMoneyLoading = true
		this.btnDisable = true

		const makeRequest = async () => {
			const opts = {
				xprv58: xprv58,
				receivingAddress: dogeRecipient,
				dogecoinAmount: dogeAmount,
				feePerByte: (this.dogeFeePerByte / 1e8).toFixed(8)
			}
			return await parentEpml.request('sendDoge', opts)
		}

		const manageResponse = (response) => {
			if (response.length === 64) {
				this.shadowRoot.getElementById('dogeAmountInput').value = 0
				this.shadowRoot.getElementById('dogeRecipient').value = ''
				this.errorMessage = ''
				this.dogeRecipient = ''
				this.dogeAmount = 0
				this.successMessage = this.renderSuccessText()
				this.sendMoneyLoading = false
				this.btnDisable = false
			} else if (response === false) {
				this.errorMessage = this.renderFailText()
				this.sendMoneyLoading = false
				this.btnDisable = false
				throw new Error(txnResponse)
			} else {
				this.errorMessage = response.message
				this.sendMoneyLoading = false
				this.btnDisable = false
				throw new Error(response)
			}
		}
		const res = await makeRequest()
		manageResponse(res)
		await this.showWallet()
	}

	async sendDgb() {
		const dgbAmount = this.shadowRoot.getElementById('dgbAmountInput').value
		let dgbRecipient = this.shadowRoot.getElementById('dgbRecipient').value
		const xprv58 = this.wallets.get(this._selectedWallet).wallet.derivedMasterPrivateKey

		this.sendMoneyLoading = true
		this.btnDisable = true

		const makeRequest = async () => {
			const opts = {
				xprv58: xprv58,
				receivingAddress: dgbRecipient,
				digibyteAmount: dgbAmount,
				feePerByte: (this.dgbFeePerByte / 1e8).toFixed(8)
			}
			return await parentEpml.request('sendDgb', opts)
		}

		const manageResponse = (response) => {
			if (response.length === 64) {
				this.shadowRoot.getElementById('dgbAmountInput').value = 0
				this.shadowRoot.getElementById('dgbRecipient').value = ''
				this.errorMessage = ''
				this.dgbRecipient = ''
				this.dgbAmount = 0
				this.successMessage = this.renderSuccessText()
				this.sendMoneyLoading = false
				this.btnDisable = false
			} else if (response === false) {
				this.errorMessage = this.renderFailText()
				this.sendMoneyLoading = false
				this.btnDisable = false
				throw new Error(txnResponse)
			} else {
				this.errorMessage = response.message
				this.sendMoneyLoading = false
				this.btnDisable = false
				throw new Error(response)
			}
		}
		const res = await makeRequest()
		manageResponse(res)
		await this.showWallet()
	}

	async sendRvn() {
		const rvnAmount = this.shadowRoot.getElementById('rvnAmountInput').value
		let rvnRecipient = this.shadowRoot.getElementById('rvnRecipient').value
		const xprv58 = this.wallets.get(this._selectedWallet).wallet.derivedMasterPrivateKey

		this.sendMoneyLoading = true
		this.btnDisable = true

		const makeRequest = async () => {
			const opts = {
				xprv58: xprv58,
				receivingAddress: rvnRecipient,
				ravencoinAmount: rvnAmount,
				feePerByte: (this.rvnFeePerByte / 1e8).toFixed(8)
			}
			return await parentEpml.request('sendRvn', opts)
		}

		const manageResponse = (response) => {
			if (response.length === 64) {
				this.shadowRoot.getElementById('rvnAmountInput').value = 0
				this.shadowRoot.getElementById('rvnRecipient').value = ''
				this.errorMessage = ''
				this.rvnRecipient = ''
				this.rvnAmount = 0
				this.successMessage = this.renderSuccessText()
				this.sendMoneyLoading = false
				this.btnDisable = false
			} else if (response === false) {
				this.errorMessage = this.renderFailText()
				this.sendMoneyLoading = false
				this.btnDisable = false
				throw new Error(txnResponse)
			} else {
				this.errorMessage = response.message
				this.sendMoneyLoading = false
				this.btnDisable = false
				throw new Error(response)
			}
		}
		const res = await makeRequest()
		manageResponse(res)
		await this.showWallet()
	}

	async sendArrr() {
		const arrrAmount = this.shadowRoot.getElementById('arrrAmountInput').value
		let arrrRecipient = this.shadowRoot.getElementById('arrrRecipient').value
		let arrrMemo = this.shadowRoot.getElementById('arrrMemo').value
		const seed58 = this.wallets.get(this._selectedWallet).wallet.seed58

		this.sendMoneyLoading = true
		this.btnDisable = true

		const makeRequest = async () => {
			const opts = {
				entropy58: seed58,
				receivingAddress: arrrRecipient,
				arrrAmount: arrrAmount,
				memo: arrrMemo
			}
			return await parentEpml.request('sendArrr', opts)
		}

		const manageResponse = (response) => {
			if (response.length === 64) {
				this.shadowRoot.getElementById('arrrAmountInput').value = 0
				this.shadowRoot.getElementById('arrrRecipient').value = ''
				this.shadowRoot.getElementById('arrrMemo').value = ''
				this.errorMessage = ''
				this.arrrRecipient = ''
				this.arrrMemo = ''
				this.arrrAmount = 0
				this.successMessage = this.renderSuccessText()
				this.sendMoneyLoading = false
				this.btnDisable = false
			} else if (response === false) {
				this.errorMessage = this.renderFailText()
				this.sendMoneyLoading = false
				this.btnDisable = false
				throw new Error(txnResponse)
			} else {
				this.errorMessage = response.message
				this.sendMoneyLoading = false
				this.btnDisable = false
				throw new Error(response)
			}
		}
		const res = await makeRequest()
		manageResponse(res)
		await this.showWallet()
	}

	async showWallet() {
		this.transactionsDOM.hidden = true
		this.loading = true

		if (this._selectedWallet == 'qort') {
			if (!window.parent.reduxStore.getState().app.blockInfo.height) {
				await parentEpml.request('apiCall', {
					url: `/blocks/height`,
					type: 'api'
				}).then(height => parentEpml.request('updateBlockInfo', {
					height
				}))
			}
		}

		const coin = this._selectedWallet

		await this.fetchWalletAddress(this._selectedWallet)
		await this.fetchWalletDetails(this._selectedWallet)
		await this.fetchWalletServer(this._selectedWallet)

		if (this._selectedWallet == coin) {
			await this.renderTransactions()
			await this.getTransactionGrid(this._selectedWallet)
			await this.updateItemsFromPage(1, true)
			this.loading = false
			this.transactionsDOM.hidden = false
		}
	}


	async showNewQortWallet() {
		this.pageButtonsHidden = false
		this.transactionsDOM.hidden = true
		this.loading = true

		if (!window.parent.reduxStore.getState().app.blockInfo.height) {
			await parentEpml.request('apiCall', {
				url: `/blocks/height`,
				type: 'api'
			}).then(height => parentEpml.request('updateBlockInfo', {
				height
			}))
		}

		const coin = this._selectedWallet

		this.balanceString = this.renderFetchText()

		parentEpml.request('apiCall', {
			url: `/addresses/balance/${this.wallets.get('qort').wallet.address}`
		}).then((res) => {
			if (isNaN(Number(res))) {
				let snack4string = get("walletpage.wchange32")
				parentEpml.request('showSnackBar', `${snack4string}`)
			} else {
				if (this._selectedWallet == coin) {
					this.wallets.get(coin).balance = Number(res).toFixed(8)
					this.balanceString = this.wallets.get(this._selectedWallet).balance + " " + this._selectedWallet.toLocaleUpperCase()
					this.balance = this.wallets.get(this._selectedWallet).balance
				}
			}
		})

		await this.fetchWalletDetails(this._selectedWallet)
		await this.fetchWalletServer(this._selectedWallet)

		this.shadowRoot.getElementById('type').selected = false
		this.shadowRoot.getElementById('payment-tab').selected = true
		this.shadowRoot.getElementById('arbitrary-tab').selected = false
		this.shadowRoot.getElementById('at-tab').selected = false
		this.shadowRoot.getElementById('group-tab').selected = false
		this.shadowRoot.getElementById('name-tab').selected = false
		this.shadowRoot.getElementById('asset-tab').selected = false
		this.shadowRoot.getElementById('poll-tab').selected = false
		this.shadowRoot.getElementById('rewarshare-tab').selected = false
		this.shadowRoot.getElementById('misc-tab').selected = false

		if (this._selectedWallet == coin) {
			await this.renderTransactions()
			await this.getTransactionGrid(this._selectedWallet)
			this.loading = false
			this.transactionsDOM.hidden = false
		}
	}

	async renderNewDom() {
		this.transactionsDOM.hidden = true
		this.loading = true

		if (!window.parent.reduxStore.getState().app.blockInfo.height) {
			await parentEpml.request('apiCall', {
				url: `/blocks/height`,
				type: 'api'
			}).then(height => parentEpml.request('updateBlockInfo', {
				height
			}))
		}

		const coin = this._selectedWallet

		await this.fetchWalletDetails(this._selectedWallet)

		if (this._selectedWallet == coin) {
			await this.renderTransactions()
			await this.getTransactionGrid(this._selectedWallet)
			this.loading = false
			this.transactionsDOM.hidden = false
		}
	}

	goBackwardTX() {
		if (this.searchOffset === 0) {
			this.pageButtonsHidden = false
			this.searchLimit = 10
			this.counter = 1
		} else {
			this.pageButtonsHidden = false
			this.searchLimit = 10
			this.counter = this.searchOffset / 10
			this.searchOffset = this.searchOffset - 10
			this.renderNewDom()
		}
	}

	goForwardTX() {
		this.pageButtonsHidden = false
		this.searchLimit = 10
		this.searchOffset = this.searchOffset + 10
		this.counter = (this.searchOffset / 10) + 1
		this.renderNewDom()
	}

	showAllTX() {
		this.pageButtonsHidden = true
		this.searchLimit = 0
		this.searchOffset = 0
		this.counter = 1
		this.renderNewDom()
	}

	async fetchWalletDetails(coin) {
		switch (coin) {
			case 'qort':
				const paymentTxsQort = await parentEpml.request('apiCall', {
					url: `/transactions/search?address=${this.wallets.get('qort').wallet.address}&confirmationStatus=CONFIRMED&reverse=true
						&limit=${this.searchLimit}
						&offset=${this.searchOffset}
						&txType=PAYMENT
					`
				})
				const pendingPaymentTxsQort = await parentEpml.request('apiCall', {
					url: `/transactions/unconfirmed?creator=${this.wallets.get('qort').wallet.base58PublicKey}&reverse=true
						&limit=${this.searchLimit}
						&offset=${this.searchOffset}
						&txType=PAYMENT
					`
				})
				const arbitraryTxsQort = await parentEpml.request('apiCall', {
					url: `/transactions/search?address=${this.wallets.get('qort').wallet.address}&confirmationStatus=CONFIRMED&reverse=true
						&limit=${this.searchLimit}
						&offset=${this.searchOffset}
						&txType=ARBITRARY
					`
				})
				const pendingArbitraryTxsQort = await parentEpml.request('apiCall', {
					url: `/transactions/unconfirmed?creator=${this.wallets.get('qort').wallet.base58PublicKey}&reverse=true
						&limit=${this.searchLimit}
						&offset=${this.searchOffset}
						&txType=ARBITRARY
					`
				})
				const atTxsQort = await parentEpml.request('apiCall', {
					url: `/transactions/search?address=${this.wallets.get('qort').wallet.address}&confirmationStatus=CONFIRMED&reverse=true
						&limit=${this.searchLimit}
						&offset=${this.searchOffset}
						&txType=AT
						&txType=DEPLOY_AT
						&txType=MESSAGE
					`
				})
				const pendingAtTxsQort = await parentEpml.request('apiCall', {
					url: `/transactions/unconfirmed?creator=${this.wallets.get('qort').wallet.base58PublicKey}&reverse=true
						&limit=${this.searchLimit}
						&offset=${this.searchOffset}
						&txType=AT
						&txType=DEPLOY_AT
						&txType=MESSAGE
					`
				})
				const groupTxsQort = await parentEpml.request('apiCall', {
					url: `/transactions/search?address=${this.wallets.get('qort').wallet.address}&confirmationStatus=CONFIRMED&reverse=true
						&limit=${this.searchLimit}
						&offset=${this.searchOffset}
						&txType=CREATE_GROUP
						&txType=UPDATE_GROUP
						&txType=ADD_GROUP_ADMIN
						&txType=REMOVE_GROUP_ADMIN
						&txType=GROUP_BAN
						&txType=CANCEL_GROUP_BAN
						&txType=GROUP_KICK
						&txType=GROUP_INVITE
						&txType=CANCEL_GROUP_INVITE
						&txType=JOIN_GROUP
						&txType=LEAVE_GROUP
						&txType=GROUP_APPROVAL
						&txType=SET_GROUP
					`
				})
				const pendingGroupTxsQort = await parentEpml.request('apiCall', {
					url: `/transactions/unconfirmed?creator=${this.wallets.get('qort').wallet.base58PublicKey}&reverse=true
						&limit=${this.searchLimit}
						&offset=${this.searchOffset}
						&txType=CREATE_GROUP
						&txType=UPDATE_GROUP
						&txType=ADD_GROUP_ADMIN
						&txType=REMOVE_GROUP_ADMIN
						&txType=GROUP_BAN
						&txType=CANCEL_GROUP_BAN
						&txType=GROUP_KICK
						&txType=GROUP_INVITE
						&txType=CANCEL_GROUP_INVITE
						&txType=JOIN_GROUP
						&txType=LEAVE_GROUP
						&txType=GROUP_APPROVAL
						&txType=SET_GROUP
					`
				})
				const nameTxsQort = await parentEpml.request('apiCall', {
					url: `/transactions/search?address=${this.wallets.get('qort').wallet.address}&confirmationStatus=CONFIRMED&reverse=true
						&limit=${this.searchLimit}
						&offset=${this.searchOffset}
						&txType=REGISTER_NAME
						&txType=UPDATE_NAME
						&txType=SELL_NAME
						&txType=CANCEL_SELL_NAME
						&txType=BUY_NAME
					`
				})
				const pendingNameTxsQort = await parentEpml.request('apiCall', {
					url: `/transactions/unconfirmed?creator=${this.wallets.get('qort').wallet.base58PublicKey}&reverse=true
						&limit=${this.searchLimit}
						&offset=${this.searchOffset}
						&txType=REGISTER_NAME
						&txType=UPDATE_NAME
						&txType=SELL_NAME
						&txType=CANCEL_SELL_NAME
						&txType=BUY_NAME
					`
				})
				const assetTxsQort = await parentEpml.request('apiCall', {
					url: `/transactions/search?address=${this.wallets.get('qort').wallet.address}&confirmationStatus=CONFIRMED&reverse=true
						&limit=${this.searchLimit}
						&offset=${this.searchOffset}
						&txType=ISSUE_ASSET
						&txType=TRANSFER_ASSET
						&txType=CREATE_ASSET_ORDER
						&txType=CANCEL_ASSET_ORDER
						&txType=UPDATE_ASSET
					`
				})
				const pendingAssetTxsQort = await parentEpml.request('apiCall', {
					url: `/transactions/unconfirmed?creator=${this.wallets.get('qort').wallet.base58PublicKey}&reverse=true
						&limit=${this.searchLimit}
						&offset=${this.searchOffset}
						&txType=ISSUE_ASSET
						&txType=TRANSFER_ASSET
						&txType=CREATE_ASSET_ORDER
						&txType=CANCEL_ASSET_ORDER
						&txType=UPDATE_ASSET
					`
				})
				const pollTxsQort = await parentEpml.request('apiCall', {
					url: `/transactions/search?address=${this.wallets.get('qort').wallet.address}&confirmationStatus=CONFIRMED&reverse=true
						&limit=${this.searchLimit}
						&offset=${this.searchOffset}
						&txType=CREATE_POLL
						&txType=VOTE_ON_POLL
					`
				})
				const pendingPollTxsQort = await parentEpml.request('apiCall', {
					url: `/transactions/unconfirmed?creator=${this.wallets.get('qort').wallet.base58PublicKey}&reverse=true
						&limit=${this.searchLimit}
						&offset=${this.searchOffset}
						&txType=CREATE_POLL
						&txType=VOTE_ON_POLL
					`
				})
				const rewardshareTxsQort = await parentEpml.request('apiCall', {
					url: `/transactions/search?address=${this.wallets.get('qort').wallet.address}&confirmationStatus=CONFIRMED&reverse=true
						&limit=${this.searchLimit}
						&offset=${this.searchOffset}
						&txType=REWARD_SHARE
					`
				})
				const pendingRewardshareTxsQort = await parentEpml.request('apiCall', {
					url: `/transactions/unconfirmed?creator=${this.wallets.get('qort').wallet.base58PublicKey}&reverse=true
						&limit=${this.searchLimit}
						&offset=${this.searchOffset}
						&txType=REWARD_SHARE
					`
				})
				const miscTxsQort = await parentEpml.request('apiCall', {
					url: `/transactions/search?address=${this.wallets.get('qort').wallet.address}&confirmationStatus=CONFIRMED&reverse=true
						&limit=${this.searchLimit}
						&offset=${this.searchOffset}
						&txType=TRANSFER_PRIVS
						&txType=PRESENCE
					`
				})
				const pendingMiscTxsQort = await parentEpml.request('apiCall', {
					url: `/transactions/unconfirmed?creator=${this.wallets.get('qort').wallet.base58PublicKey}&reverse=true
						&limit=${this.searchLimit}
						&offset=${this.searchOffset}
						&txType=TRANSFER_PRIVS
						&txType=PRESENCE
					`
				})
				if (this._selectedWallet == coin) {
					if (this.visitedTab === 0) {
						this.wallets.get(coin).transactions = pendingPaymentTxsQort.concat(paymentTxsQort)
					} else if (this.visitedTab === 1) {
						this.wallets.get(coin).transactions = pendingArbitraryTxsQort.concat(arbitraryTxsQort)
					} else if (this.visitedTab === 2) {
						this.wallets.get(coin).transactions = pendingAtTxsQort.concat(atTxsQort)
					} else if (this.visitedTab === 3) {
						this.wallets.get(coin).transactions = pendingGroupTxsQort.concat(groupTxsQort)
					} else if (this.visitedTab === 4) {
						this.wallets.get(coin).transactions = pendingNameTxsQort.concat(nameTxsQort)
					} else if (this.visitedTab === 5) {
						this.wallets.get(coin).transactions = pendingAssetTxsQort.concat(assetTxsQort)
					} else if (this.visitedTab === 6) {
						this.wallets.get(coin).transactions = pendingPollTxsQort.concat(pollTxsQort)
					} else if (this.visitedTab === 7) {
						this.wallets.get(coin).transactions = pendingRewardshareTxsQort.concat(rewardshareTxsQort)
					} else if (this.visitedTab === 8) {
						this.wallets.get(coin).transactions = pendingMiscTxsQort.concat(miscTxsQort)
					}
				}
				break
			case 'btc':
			case 'ltc':
			case 'doge':
			case 'dgb':
			case 'rvn':
				this.balanceString = this.renderFetchText()
				const walletName = `${coin}Wallet`
				parentEpml.request('apiCall', {
					url: `/crosschain/${coin}/walletbalance?apiKey=${this.getApiKey()}`,
					method: 'POST',
					body: `${window.parent.reduxStore.getState().app.selectedAddress[walletName].derivedMasterPublicKey}`
				}).then((res) => {
					if (isNaN(Number(res))) {
						let snack5string = get("walletpage.wchange33")
						let snack6string = get("walletpage.wchange34")
						parentEpml.request('showSnackBar', `${snack5string} ${coin.toLocaleUpperCase()} ${snack6string}!`)
					} else {
						if (this._selectedWallet == coin) {
							this.wallets.get(this._selectedWallet).balance = (Number(res) / 1e8).toFixed(8)
							this.balanceString = this.wallets.get(this._selectedWallet).balance + " " + this._selectedWallet.toLocaleUpperCase()
							this.balance = this.wallets.get(this._selectedWallet).balance
						}
					}
				})

				const txs = await parentEpml.request('apiCall', {
					url: `/crosschain/${coin}/wallettransactions?apiKey=${this.getApiKey()}`,
					method: 'POST',
					body: `${window.parent.reduxStore.getState().app.selectedAddress[walletName].derivedMasterPublicKey}`,
				})

				const compareFn = (a, b) => {
					return b.timestamp - a.timestamp
				}

				const sortedTransactions = txs.sort(compareFn)
				if (this._selectedWallet == coin) {
					this.wallets.get(this._selectedWallet).transactions = sortedTransactions
				}
				break
			case 'arrr':
				const arrrWalletName = `${coin}Wallet`

				const res = await parentEpml.request('apiCall', {
					url: `/crosschain/${coin}/syncstatus?apiKey=${this.getApiKey()}`,
					method: 'POST',
					body: `${window.parent.reduxStore.getState().app.selectedAddress[arrrWalletName].seed58}`
				})

				if (coin != this._selectedWallet) {
					// We've switched away from this coin
				}

				if (res.indexOf('<') > -1) {
					this.balanceString = this.renderFetchText()
					await new Promise(resolve => setTimeout(resolve, 2000))
					await this.showWallet()
					return
				} else if (res !== "Synchronized") {
					this.balanceString = res
					await new Promise(resolve => setTimeout(resolve, 2000))
					await this.showWallet()
					return
				}

				this.balanceString = this.renderFetchText()

				parentEpml.request('apiCall', {
					url: `/crosschain/${coin}/walletbalance?apiKey=${this.getApiKey()}`,
					method: 'POST',
					body: `${window.parent.reduxStore.getState().app.selectedAddress[arrrWalletName].seed58}`,
				}).then((res) => {
					if (isNaN(Number(res))) {
						let snack5string = get("walletpage.wchange33")
						let snack6string = get("walletpage.wchange34")
						parentEpml.request('showSnackBar', `${snack5string} ${coin.toLocaleUpperCase()} ${snack6string}!`)
					} else {
						if (this._selectedWallet == coin) {
							this.wallets.get(this._selectedWallet).balance = (Number(res) / 1e8).toFixed(8)
							this.balanceString = this.wallets.get(this._selectedWallet).balance + " " + this._selectedWallet.toLocaleUpperCase()
							this.balance = this.wallets.get(this._selectedWallet).balance
						}
					}
				})

				const arrrTxs = await parentEpml.request('apiCall', {
					url: `/crosschain/${coin}/wallettransactions?apiKey=${this.getApiKey()}`,
					method: 'POST',
					body: `${window.parent.reduxStore.getState().app.selectedAddress[arrrWalletName].seed58}`,
				})

				const arrrCompareFn = (a, b) => {
					return b.timestamp - a.timestamp
				}

				const arrrSortedTransactions = arrrTxs.sort(arrrCompareFn)

				if (this._selectedWallet == coin) {
					this.wallets.get(this._selectedWallet).transactions = arrrSortedTransactions
				}
				break
			default:
				break
		}
	}

	async fetchWalletAddress(coin) {
		switch (coin) {
			case 'arrr':
				const arrrWalletName = `${coin}Wallet`
				let res = await parentEpml.request('apiCall', {
					url: `/crosschain/${coin}/walletaddress?apiKey=${this.getApiKey()}`,
					method: 'POST',
					body: `${window.parent.reduxStore.getState().app.selectedAddress[arrrWalletName].seed58}`,
				})
				if (res != null && res.error != 1201 && res.length === 78) {
					this.arrrWalletAddress = res
				}
				break

			default:
				// Not used for other coins yet
				break
		}
	}

	renderSendButton() {
		if (this._selectedWallet === "qort") {
			return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openSendQort()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange17")} QORT</vaadin-button>`
		} else if (this._selectedWallet === "btc") {
			return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openSendBtc()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange17")} BTC</vaadin-button>`
		} else if (this._selectedWallet === "ltc") {
			return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openSendLtc()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange17")} LTC</vaadin-button>`
		} else if (this._selectedWallet === "doge") {
			return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openSendDoge()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange17")} DOGE</vaadin-button>`
		} else if (this._selectedWallet === "dgb") {
			return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openSendDgb()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange17")} DGB</vaadin-button>`
		} else if (this._selectedWallet === "rvn") {
			return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openSendRvn()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange17")} RVN</vaadin-button>`
		} else if (this._selectedWallet === "arrr") {
			return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openSendArrr()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange17")} ARRR</vaadin-button>`
		} else {
			return html``
		}
	}

	renderAddressbookButton() {
		if (this._selectedWallet === "qort") {
			return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openQortAddressbook()}><vaadin-icon icon="vaadin:book" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange47")}</vaadin-button>`
		} else if (this._selectedWallet === "btc") {
			return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openBtcAddressbook()}><vaadin-icon icon="vaadin:book" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange47")}</vaadin-button>`
		} else if (this._selectedWallet === "ltc") {
			return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openLtcAddressbook()}><vaadin-icon icon="vaadin:book" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange47")}</vaadin-button>`
		} else if (this._selectedWallet === "doge") {
			return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openDogeAddressbook()}><vaadin-icon icon="vaadin:book" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange47")}</vaadin-button>`
		} else if (this._selectedWallet === "dgb") {
			return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openDgbAddressbook()}><vaadin-icon icon="vaadin:book" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange47")}</vaadin-button>`
		} else if (this._selectedWallet === "rvn") {
			return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openRvnAddressbook()}><vaadin-icon icon="vaadin:book" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange47")}</vaadin-button>`
		} else if (this._selectedWallet === "arrr") {
			return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openArrrAddressbook()}><vaadin-icon icon="vaadin:book" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange47")}</vaadin-button>`
		} else {
			return html``
		}
	}

	renderExportAddressbookButton() {
		if (this._selectedWallet === "qort") {
			return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.exportQortAddressbook()}><vaadin-icon icon="vaadin:cloud-download" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange54")}</vaadin-button>`
		} else if (this._selectedWallet === "btc") {
			return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.exportBtcAddressbook()}><vaadin-icon icon="vaadin:cloud-download" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange54")}</vaadin-button>`
		} else if (this._selectedWallet === "ltc") {
			return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.exportLtcAddressbook()}><vaadin-icon icon="vaadin:cloud-download" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange54")}</vaadin-button>`
		} else if (this._selectedWallet === "doge") {
			return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.exportDogeAddressbook()}><vaadin-icon icon="vaadin:cloud-download" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange54")}</vaadin-button>`
		} else if (this._selectedWallet === "dgb") {
			return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.exportDgbAddressbook()}><vaadin-icon icon="vaadin:cloud-download" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange54")}</vaadin-button>`
		} else if (this._selectedWallet === "rvn") {
			return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.exportRvnAddressbook()}><vaadin-icon icon="vaadin:cloud-download" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange54")}</vaadin-button>`
		} else if (this._selectedWallet === "arrr") {
			return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.exportArrrAddressbook()}><vaadin-icon icon="vaadin:cloud-download" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange54")}</vaadin-button>`
		} else {
			return html``
		}
	}

	renderImportAddressbookButton() {
		if (this._selectedWallet === "qort") {
			return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.openImportQortAddressbook()}><vaadin-icon icon="vaadin:cloud-upload" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange53")}</vaadin-button>`
		} else if (this._selectedWallet === "btc") {
			return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.openImportBtcAddressbook()}><vaadin-icon icon="vaadin:cloud-upload" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange53")}</vaadin-button>`
		} else if (this._selectedWallet === "ltc") {
			return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.openImportLtcAddressbook()}><vaadin-icon icon="vaadin:cloud-upload" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange53")}</vaadin-button>`
		} else if (this._selectedWallet === "doge") {
			return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.openImportDogeAddressbook()}><vaadin-icon icon="vaadin:cloud-upload" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange53")}</vaadin-button>`
		} else if (this._selectedWallet === "dgb") {
			return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.openImportDgbAddressbook()}><vaadin-icon icon="vaadin:cloud-upload" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange53")}</vaadin-button>`
		} else if (this._selectedWallet === "rvn") {
			return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.openImportRvnAddressbook()}><vaadin-icon icon="vaadin:cloud-upload" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange53")}</vaadin-button>`
		} else if (this._selectedWallet === "arrr") {
			return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.openImportArrrAddressbook()}><vaadin-icon icon="vaadin:cloud-upload" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange53")}</vaadin-button>`
		} else {
			return html``
		}
	}

	openSendQort() {
		this.shadowRoot.querySelector("#sendQortDialog").show();
	}

	openSendBtc() {
		this.shadowRoot.querySelector("#sendBtcDialog").show();
	}

	openSendLtc() {
		this.shadowRoot.querySelector("#sendLtcDialog").show();
	}

	openSendDoge() {
		this.shadowRoot.querySelector("#sendDogeDialog").show();
	}

	openSendDgb() {
		this.shadowRoot.querySelector("#sendDgbDialog").show();
	}

	openSendRvn() {
		this.shadowRoot.querySelector("#sendRvnDialog").show();
	}

	openSendArrr() {
		this.shadowRoot.querySelector("#sendArrrDialog").show();
	}

	changeTheme() {
		const checkTheme = localStorage.getItem('qortalTheme')
		if (checkTheme === 'dark') {
			this.theme = 'dark';
		} else {
			this.theme = 'light';
		}
		document.querySelector('html').setAttribute('theme', this.theme);
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

	getSelectedWalletAddress() {
		switch (this._selectedWallet) {
			case "arrr":
				// Use address returned by core API
				return this.arrrWalletAddress

			default:
				// Use locally derived address
				return this.wallets.get(this._selectedWallet).wallet.address
		}
	}

	getSelectedWalletServer() {
		switch (this._selectedWallet) {
			case "qort":
				return this.nodeDomain
			case "btc":
				return this.btcServer
			case "ltc":
				return this.ltcServer
			case "doge":
				return this.dogeServer
			case "dgb":
				return this.dgbServer
			case "rvn":
				return this.rvnServer
			case "arrr":
				return this.arrrServer
			default:
				return
		}
	}

	async fetchWalletServer(coin) {
		if (coin == 'qort') {
			return
		}
		let walletServer = ''
		try {
			const serverInfo = await parentEpml.request('apiCall', {
				type: 'api',
				/* TODO */
				url: `/crosschain/${coin}/serverinfos`,
				// TODO when 'current' parameter is added to 'serverinfos' API call, change above line to:
				// url: `/crosschain/${coin}/serverinfos?current=true`,
			})
			/* TODO */
			let currentServerFound = false
			for (const server of serverInfo.servers) {
				if (server.isCurrent === true) {
					walletServer = `${server.hostName}:${server.port}`
					currentServerFound = true
					break
				}
			}
			if (!currentServerFound) {
				walletServer = 'Not Connected'
			}
			// TODO when 'current' parameter is added to 'serverinfos' API call, change above 'let,for,if' sections to:
			/*if (serverInfo.servers[0]) {
				const currentServerInfo = `${serverInfo.servers[0].hostName}:${serverInfo.servers[0].port}`
				walletServer = currentServerInfo
			} else {
				walletServer = 'Not Connected'
			}*/
		} catch (error) {
			console.error('Failed to fetch server info:', error)
			walletServer = `Error fetching server: ${error}`
		}
		switch (coin) {
			case "btc":
				this.btcServer = walletServer
				break
			case "ltc":
				this.ltcServer = walletServer
				break
			case "doge":
				this.dogeServer = walletServer
				break
			case "dgb":
				this.dgbServer = walletServer
				break
			case "rvn":
				this.rvnServer = walletServer
				break
			case "arrr":
				this.arrrServer = walletServer
				break
			default:
				break
		}
	}

	getNodeConfig() {
		this.nodeDomain = ""
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		this.nodeDomain = myNode.domain + ":" + myNode.port
		this.nodeConfig = {}
		parentEpml.request("getNodeConfig").then((res) => {
			this.nodeConfig = res
		})
	}

	async getTransactionGrid(coin) {
		this.transactionsGrid = this.shadowRoot.querySelector(`#${coin}TransactionsGrid`)
		if (coin === 'qort') {
			this.transactionsGrid.addEventListener(
				'click',
				(e) => {
					let qortItem = this.transactionsGrid.getEventContext(e).item
					this.showQortTransactionDetails(qortItem, this.wallets.get(this._selectedWallet).transactions)
				},
				{ passive: true }
			)
		} else if (coin === 'btc') {
			this.transactionsGrid.addEventListener(
				'click',
				(e) => {
					let btcItem = this.transactionsGrid.getEventContext(e).item
					this.showBtcTransactionDetails(btcItem, this.wallets.get(this._selectedWallet).transactions)
				},
				{ passive: true }
			)
		} else if (coin === 'ltc') {
			this.transactionsGrid.addEventListener(
				'click',
				(e) => {
					let ltcItem = this.transactionsGrid.getEventContext(e).item
					this.showLtcTransactionDetails(ltcItem, this.wallets.get(this._selectedWallet).transactions)
				},
				{ passive: true }
			)
		} else if (coin === 'doge') {
			this.transactionsGrid.addEventListener(
				'click',
				(e) => {
					let dogeItem = this.transactionsGrid.getEventContext(e).item
					this.showDogeTransactionDetails(dogeItem, this.wallets.get(this._selectedWallet).transactions)
				},
				{ passive: true }
			)
		} else if (coin === 'dgb') {
			this.transactionsGrid.addEventListener(
				'click',
				(e) => {
					let dgbItem = this.transactionsGrid.getEventContext(e).item
					this.showDgbTransactionDetails(dgbItem, this.wallets.get(this._selectedWallet).transactions)
				},
				{ passive: true }
			)
		} else if (coin === 'rvn') {
			this.transactionsGrid.addEventListener(
				'click',
				(e) => {
					let rvnItem = this.transactionsGrid.getEventContext(e).item
					this.showRvnTransactionDetails(rvnItem, this.wallets.get(this._selectedWallet).transactions)
				},
				{ passive: true }
			)
		} else if (coin === 'arrr') {
			this.transactionsGrid.addEventListener(
				'click',
				(e) => {
					let arrrItem = this.transactionsGrid.getEventContext(e).item
					this.showArrrTransactionDetails(arrrItem, this.wallets.get(this._selectedWallet).transactions)
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
		} else if (this._selectedWallet === 'btc') {
			render(this.renderBtcTransactions(this.wallets.get(this._selectedWallet).transactions, this._selectedWallet), this.transactionsDOM)
		} else if (this._selectedWallet === 'ltc') {
			render(this.renderLtcTransactions(this.wallets.get(this._selectedWallet).transactions, this._selectedWallet), this.transactionsDOM)
		} else if (this._selectedWallet === 'doge') {
			render(this.renderDogeTransactions(this.wallets.get(this._selectedWallet).transactions, this._selectedWallet), this.transactionsDOM)
		} else if (this._selectedWallet === 'dgb') {
			render(this.renderDgbTransactions(this.wallets.get(this._selectedWallet).transactions, this._selectedWallet), this.transactionsDOM)
		} else if (this._selectedWallet === 'rvn') {
			render(this.renderRvnTransactions(this.wallets.get(this._selectedWallet).transactions, this._selectedWallet), this.transactionsDOM)
		} else if (this._selectedWallet === 'arrr') {
			render(this.renderArrrTransactions(this.wallets.get(this._selectedWallet).transactions, this._selectedWallet), this.transactionsDOM)
		}
	}

	renderQortTransactions(transactions, coin) {
		const requiredConfirmations = 3
		const currentBlockHeight = window.parent.reduxStore.getState().app.blockInfo.height
		if (Array.isArray(transactions)) {
			transactions = transactions.map(tx => {
				tx.confirmations = (currentBlockHeight - (tx.blockHeight - 1)) || ''
				return tx
			})
		}
		return html`
			<div style="padding-left:12px;" ?hidden="${!this.isEmptyArray(transactions)}"><span style="color: var(--black);">${translate("walletpage.wchange38")}</span></div>
			<vaadin-grid theme="large" id="${coin}TransactionsGrid" ?hidden="${this.isEmptyArray(this.wallets.get(this._selectedWallet).transactions)}" .items="${this.wallets.get(this._selectedWallet).transactions}" all-rows-visible>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange41")}"
					.renderer=${(root, column, data) => {
						if (!currentBlockHeight) {
							return render(html``, root)
						}
						const confirmed = data.item.confirmations >= requiredConfirmations
						const unconfirmed = data.item.confirmations == 0
						if (confirmed) {
							render(html`<mwc-icon title="${data.item.confirmations} ${translate("walletpage.wchange42")}" style="color: #00C851">check</mwc-icon>`, root)
						} else if (unconfirmed) {
							render(html`<mwc-icon title="${data.item.confirmations || 0}/${requiredConfirmations} ${translate("walletpage.wchange42")}" style="color: #F44336">schedule</mwc-icon>`, root)
						} else {
							render(html`<mwc-icon title="${data.item.confirmations}/${requiredConfirmations} ${translate("walletpage.wchange42")}" style="color: #B47D00">schedule</mwc-icon>`, root)
						}
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange35")}"
					.renderer=${(root, column, data) => {
						render(html`
							${data.item.type} ${data.item.creatorAddress === this.wallets.get('qort').wallet.address ?
								html`
									<span class="color-out">${translate("walletpage.wchange7")}</span>
								` : html`
									<span class="color-in">${translate("walletpage.wchange8")}</span>
								`
							}
						`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange9")}"
					.renderer=${(root, column, data) => {
						render(html`${data.item.type === 'AT' ? html`${data.item.atAddress}` : html`${data.item.creatorAddress}`}`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange10")}"
					.renderer=${(root, column, data) => {
						render(html`${data.item.type === 'DEPLOY_AT' ? html`${data.item.aTAddress}` : html`${data.item.recipient}`}`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column auto-width header="${translate("walletpage.wchange36")}" path="fee"></vaadin-grid-column>
				<vaadin-grid-column auto-width header="${translate("walletpage.wchange11")}" path="amount"></vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange14")}"
					.renderer=${(root, column, data) => {
						const time = new Date(data.item.timestamp)
						render(html` 
							<time-ago datetime=${time.toISOString()}> </time-ago>
						`, root)
					}}
				>
				</vaadin-grid-column>
			</vaadin-grid>
			<div style="margin-top: 10px;">
				<vaadin-button theme="primary small" style="cursor: pointer;" ?hidden="${this.pageButtonsHidden}" @click=${() => this.goBackwardTX()}>
					<< <span style="text-transform: uppercase; font-size: 14px;">${translate("general.back")}</span>
				</vaadin-button>
				<span style="color: var(--black); font-size: 16px; font-weight: 600;">&nbsp;${translate("general.page")} ${this.counter}&nbsp;</span>
				<vaadin-button theme="primary small" style="cursor: pointer;" ?hidden="${this.wallets.get(this._selectedWallet).transactions.length < 10 || this.pageButtonsHidden}" @click=${() => this.goForwardTX()}>
					<span style="text-transform: uppercase; font-size: 14px;">${translate("general.next")}</span> >>
				</vaadin-button>
				<div style="float: right;">
					<vaadin-button theme="primary small" style="cursor: pointer;" @click=${() => this.showAllTX()}>
						<span style="text-transform: uppercase; font-size: 14px;">${translate("general.view")} ${translate("general.all")}</span>
					</vaadin-button>
				</div>
			</div>
		`
	}

	renderBtcTransactions(transactions, coin) {
		return html`
			<div style="padding-left:12px;" ?hidden="${!this.isEmptyArray(transactions)}"><span style="color: var(--black);">${translate("walletpage.wchange38")}</span></div>
			<vaadin-grid theme="large" id="${coin}TransactionsGrid" ?hidden="${this.isEmptyArray(this.wallets.get(this._selectedWallet).transactions)}" page-size="25" all-rows-visible>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange41")}"
					.renderer=${(root, column, data) => {
						render(html`
							<mwc-icon style="color: #00C851">check</mwc-icon>
						`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange35")}"
					.renderer=${(root, column, data) => {
						render(html`
							${translate("walletpage.wchange40")} ${data.item.inputs[0].address === this.wallets.get(this._selectedWallet).wallet.address ?
								html`
									<span class="color-out">${translate("walletpage.wchange7")}</span>
								` : html`
									<span class="color-in">${translate("walletpage.wchange8")}</span>
								`
							}
						`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange9")}"
					.renderer=${(root, column, data) => {
						render(html`${data.item.inputs[0].address}`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange10")}"
					.renderer=${(root, column, data) => {
						render(html`${data.item.outputs[0].address}`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column auto-width resizable header="${translate("walletpage.wchange16")}" path="txHash"></vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange37")}"
					.renderer=${(root, column, data) => {
						const amount = (Number(data.item.totalAmount) / 1e8).toFixed(8)
						render(html`${amount}`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange14")}"
					.renderer=${(root, column, data) => {
						const time = new Date(data.item.timestamp)
						render(html` 
							<time-ago datetime=${time.toISOString()}> </time-ago>
						`, root)
					}}
				>
				</vaadin-grid-column>
			</vaadin-grid>
			<div id="pages"></div>
		`
	}

	renderLtcTransactions(transactions, coin) {
		return html`
			<div style="padding-left:12px;" ?hidden="${!this.isEmptyArray(transactions)}"><span style="color: var(--black);">${translate("walletpage.wchange38")}</span></div>
			<vaadin-grid theme="large" id="${coin}TransactionsGrid" ?hidden="${this.isEmptyArray(this.wallets.get(this._selectedWallet).transactions)}" page-size="25" all-rows-visible>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange41")}"
					.renderer=${(root, column, data) => {
						render(html`
							<mwc-icon style="color: #00C851">check</mwc-icon>
						`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange35")}"
					.renderer=${(root, column, data) => {
						render(html`
							${translate("walletpage.wchange40")} ${data.item.inputs[0].address === this.wallets.get(this._selectedWallet).wallet.address ?
								html`
									<span class="color-out">${translate("walletpage.wchange7")}</span>
								` : html`
									<span class="color-in">${translate("walletpage.wchange8")}</span>
								`
							}
						`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange9")}"
					.renderer=${(root, column, data) => {
						render(html`${data.item.inputs[0].address}`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange10")}"
					.renderer=${(root, column, data) => {
						render(html`${data.item.outputs[0].address}`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column auto-width resizable header="${translate("walletpage.wchange16")}" path="txHash"></vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange37")}"
					.renderer=${(root, column, data) => {
						const amount = (Number(data.item.totalAmount) / 1e8).toFixed(8)
						render(html`${amount}`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange14")}"
					.renderer=${(root, column, data) => {
						const time = new Date(data.item.timestamp)
						render(html` 
							<time-ago datetime=${time.toISOString()}> </time-ago>
						`, root)
					}}
				>
				</vaadin-grid-column>
			</vaadin-grid>
			<div id="pages"></div>
		`
	}

	renderDogeTransactions(transactions, coin) {
		return html`
		<div>
			<div style="padding-left:12px;" ?hidden="${!this.isEmptyArray(transactions)}"><span style="color: var(--black);">${translate("walletpage.wchange38")}</span></div>
			<vaadin-grid theme="large" id="${coin}TransactionsGrid" ?hidden="${this.isEmptyArray(this.wallets.get(this._selectedWallet).transactions)}" page-size="25" all-rows-visible>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange41")}"
					.renderer=${(root, column, data) => {
						render(html`
							<mwc-icon style="color: #00C851">check</mwc-icon>
						`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange35")}"
					.renderer=${(root, column, data) => {
						render(html`
							${translate("walletpage.wchange40")} ${data.item.inputs[0].address === this.wallets.get(this._selectedWallet).wallet.address ?
								html`
									<span class="color-out">${translate("walletpage.wchange7")}</span>
								` : html`
									<span class="color-in">${translate("walletpage.wchange8")}</span>
								`
							}
						`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange9")}"
					.renderer=${(root, column, data) => {
						render(html`${data.item.inputs[0].address}`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange10")}"
					.renderer=${(root, column, data) => {
						render(html`${data.item.outputs[0].address}`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column auto-width resizable header="${translate("walletpage.wchange16")}" path="txHash"></vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange37")}"
					.renderer=${(root, column, data) => {
						const amount = (Number(data.item.totalAmount) / 1e8).toFixed(8)
						render(html`${amount}`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange14")}"
					.renderer=${(root, column, data) => {
						const time = new Date(data.item.timestamp)
						render(html` 
							<time-ago datetime=${time.toISOString()}> </time-ago>
						`, root)
					}}
				>
				</vaadin-grid-column>
			</vaadin-grid>
			<div id="pages"></div>
		`
	}

	renderDgbTransactions(transactions, coin) {
		return html`
			<div style="padding-left:12px;" ?hidden="${!this.isEmptyArray(transactions)}"><span style="color: var(--black);">${translate("walletpage.wchange38")}</span></div>
			<vaadin-grid theme="large" id="${coin}TransactionsGrid" ?hidden="${this.isEmptyArray(this.wallets.get(this._selectedWallet).transactions)}" page-size="25" all-rows-visible>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange41")}"
					.renderer=${(root, column, data) => {
						render(html`
							<mwc-icon style="color: #00C851">check</mwc-icon>
						`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange35")}"
					.renderer=${(root, column, data) => {
						render(html`
							${translate("walletpage.wchange40")} ${data.item.inputs[0].address === this.wallets.get(this._selectedWallet).wallet.address ?
								html`
									<span class="color-out">${translate("walletpage.wchange7")}</span>
								` : html`
									<span class="color-in">${translate("walletpage.wchange8")}</span>
								`
							}
						`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange9")}"
					.renderer=${(root, column, data) => {
						render(html`${data.item.inputs[0].address}`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange10")}"
					.renderer=${(root, column, data) => {
						render(html`${data.item.outputs[0].address}`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column auto-width resizable header="${translate("walletpage.wchange16")}" path="txHash"></vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange37")}"
					.renderer=${(root, column, data) => {
						const amount = (Number(data.item.totalAmount) / 1e8).toFixed(8)
						render(html`${amount}`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange14")}"
					.renderer=${(root, column, data) => {
						const time = new Date(data.item.timestamp)
						render(html` 
							<time-ago datetime=${time.toISOString()}> </time-ago>
						`, root)
					}}
				>
				</vaadin-grid-column>
			</vaadin-grid>
			<div id="pages"></div>
		`
	}

	renderRvnTransactions(transactions, coin) {
		return html`
			<div style="padding-left:12px;" ?hidden="${!this.isEmptyArray(transactions)}"><span style="color: var(--black);">${translate("walletpage.wchange38")}</span></div>
			<vaadin-grid theme="large" id="${coin}TransactionsGrid" ?hidden="${this.isEmptyArray(this.wallets.get(this._selectedWallet).transactions)}" page-size="25" all-rows-visible>
				<vaadin-grid-column
				auto-width
				header="${translate("walletpage.wchange41")}"
				.renderer=${(root, column, data) => {
				render(html`
				<mwc-icon style="color: #00C851">check</mwc-icon>
				`, root)
				}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange35")}"
					.renderer=${(root, column, data) => {
						render(html`
							${translate("walletpage.wchange40")} ${data.item.inputs[0].address === this.wallets.get(this._selectedWallet).wallet.address ?
								html`
									<span class="color-out">${translate("walletpage.wchange7")}</span>
								` : html`
									<span class="color-in">${translate("walletpage.wchange8")}</span>
								`
							}
						`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange9")}"
					.renderer=${(root, column, data) => {
						render(html`${data.item.inputs[0].address}`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange10")}"
					.renderer=${(root, column, data) => {
						render(html`${data.item.outputs[0].address}`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column auto-width resizable header="${translate("walletpage.wchange16")}" path="txHash"></vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange37")}"
					.renderer=${(root, column, data) => {
						const amount = (Number(data.item.totalAmount) / 1e8).toFixed(8)
						render(html`${amount}`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange14")}"
					.renderer=${(root, column, data) => {
						const time = new Date(data.item.timestamp)
						render(html` 
							<time-ago datetime=${time.toISOString()}> </time-ago>
						`, root)
					}}
				>
				</vaadin-grid-column>
			</vaadin-grid>
			<div id="pages"></div>
		`
	}

	renderArrrTransactions(transactions, coin) {
		return html`
			<div style="padding-left:12px;" ?hidden="${!this.isEmptyArray(transactions)}"><span style="color: var(--black);">${translate("walletpage.wchange38")}</span></div>
			<vaadin-grid theme="large" id="${coin}TransactionsGrid" ?hidden="${this.isEmptyArray(this.wallets.get(this._selectedWallet).transactions)}" page-size="25" all-rows-visible>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange41")}"
					.renderer=${(root, column, data) => {
						render(html`
							<mwc-icon style="color: #00C851">check</mwc-icon>
						`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange35")}"
					.renderer=${(root, column, data) => {
						render(html`
							${translate("walletpage.wchange40")} ${data.item.totalAmount < 0 ?
								html`
									<span class="color-out">${translate("walletpage.wchange7")}</span>
								` : html`
									<span class="color-in">${translate("walletpage.wchange8")}</span>
								`
							}
						`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column auto-width resizable header="${translate("walletpage.wchange16")}" path="txHash"></vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange37")}"
					.renderer=${(root, column, data) => {
						const amount = (Number(data.item.totalAmount) / 1e8).toFixed(8)
						render(html`${amount}`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange14")}"
					.renderer=${(root, column, data) => {
						const time = new Date(data.item.timestamp)
						render(html` 
							<time-ago datetime=${time.toISOString()}> </time-ago>
						`, root)
					}}
				>
				</vaadin-grid-column>
				<vaadin-grid-column
					auto-width
					header="${translate("walletpage.wchange57")}"
					.renderer=${(root, column, data) => {
						render(html`${data.item.memo}`, root)
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

	showQortTransactionDetails(myTransaction, allTransactions) {
		allTransactions.forEach((transaction) => {
			if (myTransaction.signature === transaction.signature) {
				let txnFlow = myTransaction.creatorAddress === this.wallets.get('qort').wallet.address ? 'OUT' : 'IN'
				this.selectedTransaction = { ...transaction, txnFlow }
				if (this.selectedTransaction.signature.length != 0) {
					this.shadowRoot.querySelector('#showTransactionDetailsDialog').show()
				}
			}
		})
	}

	showBtcTransactionDetails(myTransaction, allTransactions) {
		allTransactions.forEach((transaction) => {
			if (myTransaction.txHash === transaction.txHash) {
				let btcTxnFlow = myTransaction.inputs[0].address === this.wallets.get(this._selectedWallet).wallet.address ? 'OUT' : 'IN'
				let btcSender = myTransaction.inputs[0].address
				let btcReceiver = myTransaction.outputs[0].address
				this.selectedTransaction = { ...transaction, btcTxnFlow, btcSender, btcReceiver }
				if (this.selectedTransaction.txHash.length != 0) {
					this.shadowRoot.querySelector('#showBtcTransactionDetailsDialog').show()
				}
			}
		})
	}

	showLtcTransactionDetails(myTransaction, allTransactions) {
		allTransactions.forEach((transaction) => {
			if (myTransaction.txHash === transaction.txHash) {
				let ltcTxnFlow = myTransaction.inputs[0].address === this.wallets.get(this._selectedWallet).wallet.address ? 'OUT' : 'IN'
				let ltcSender = myTransaction.inputs[0].address
				let ltcReceiver = myTransaction.outputs[0].address
				this.selectedTransaction = { ...transaction, ltcTxnFlow, ltcSender, ltcReceiver }
				if (this.selectedTransaction.txHash.length != 0) {
					this.shadowRoot.querySelector('#showLtcTransactionDetailsDialog').show()
				}
			}
		})
	}

	showDogeTransactionDetails(myTransaction, allTransactions) {
		allTransactions.forEach((transaction) => {
			if (myTransaction.txHash === transaction.txHash) {
				let dogeTxnFlow = myTransaction.inputs[0].address === this.wallets.get(this._selectedWallet).wallet.address ? 'OUT' : 'IN'
				let dogeSender = myTransaction.inputs[0].address
				let dogeReceiver = myTransaction.outputs[0].address
				this.selectedTransaction = { ...transaction, dogeTxnFlow, dogeSender, dogeReceiver }
				if (this.selectedTransaction.txHash.length != 0) {
					this.shadowRoot.querySelector('#showDogeTransactionDetailsDialog').show()
				}
			}
		})
	}

	showDgbTransactionDetails(myTransaction, allTransactions) {
		allTransactions.forEach((transaction) => {
			if (myTransaction.txHash === transaction.txHash) {
				let dgbTxnFlow = myTransaction.inputs[0].address === this.wallets.get(this._selectedWallet).wallet.address ? 'OUT' : 'IN'
				let dgbSender = myTransaction.inputs[0].address
				let dgbReceiver = myTransaction.outputs[0].address
				this.selectedTransaction = { ...transaction, dgbTxnFlow, dgbSender, dgbReceiver }
				if (this.selectedTransaction.txHash.length != 0) {
					this.shadowRoot.querySelector('#showDgbTransactionDetailsDialog').show()
				}
			}
		})
	}

	showRvnTransactionDetails(myTransaction, allTransactions) {
		allTransactions.forEach((transaction) => {
			if (myTransaction.txHash === transaction.txHash) {
				let rvnTxnFlow = myTransaction.inputs[0].address === this.wallets.get(this._selectedWallet).wallet.address ? 'OUT' : 'IN'
				let rvnSender = myTransaction.inputs[0].address
				let rvnReceiver = myTransaction.outputs[0].address
				this.selectedTransaction = { ...transaction, rvnTxnFlow, rvnSender, rvnReceiver }
				if (this.selectedTransaction.txHash.length != 0) {
					this.shadowRoot.querySelector('#showRvnTransactionDetailsDialog').show()
				}
			}
		})
	}

	showArrrTransactionDetails(myTransaction, allTransactions) {
		allTransactions.forEach((transaction) => {
			if (myTransaction.txHash === transaction.txHash) {
				let arrrTxnFlow = myTransaction.inputs[0].address === this.wallets.get(this._selectedWallet).wallet.address ? 'OUT' : 'IN'
				let arrrSender = myTransaction.inputs[0].address
				let arrrReceiver = myTransaction.outputs[0].address
				this.selectedTransaction = { ...transaction, arrrTxnFlow, arrrSender, arrrReceiver }
				if (this.selectedTransaction.txHash.length != 0) {
					this.shadowRoot.querySelector('#showArrrTransactionDetailsDialog').show()
				}
			}
		})
	}

	async saveFileToDisk(blob, fileName) {
		try {
			const fileHandle = await self.showSaveFilePicker({
				suggestedName: fileName,
				types: [{
					description: "File"
				}]
			})
			const writeFile = async (fileHandle, contents) => {
				const writable = await fileHandle.createWritable()
				await writable.write(contents)
				await writable.close()
			}
			writeFile(fileHandle, blob).then(() => console.log("FILE SAVED"))
			let snack4string = get("general.save")
			parentEpml.request('showSnackBar', `${snack4string} ${fileName} ✅`)
		} catch (error) {
			if (error.name === 'AbortError') {
				return
			}
			FileSaver.saveAs(blob, fileName)
		}
	}

	getConfirmations(height, lastBlockHeight) {
		return lastBlockHeight - height + 1
	}

	_unconfirmedClass(unconfirmed) {
		return unconfirmed ? 'unconfirmed' : ''
	}

	// Standard functions
	getApiKey() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.apiKey
	}

	isEmptyArray(arr) {
		if (!arr) { return true }
		return arr.length === 0
	}

	round(number) {
		return (Math.round(parseFloat(number) * 1e8) / 1e8).toFixed(8)
	}

	floor(num) {
		num = parseFloat(num)
		return isNaN(num) ? 0 : this.format(Math.floor(num))
	}

	decimals(num) {
		num = parseFloat(num)
		return num % 1 > 0 ? (num + '').split('.')[1] : '0'
	}

	subtract(num1, num2) {
		return num1 - num2
	}

	format(num) {
		return num.toLocaleString()
	}
}

window.customElements.define('multi-wallet', MultiWallet)