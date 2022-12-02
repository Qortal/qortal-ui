import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../epml.js'
import { use, get, translate, translateUnsafeHTML, registerTranslateConfig } from 'lit-translate'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

import '../components/ButtonIconCopy.js'
import '../components/QortalQrcodeGenerator.js'
import '../components/frag-file-input.js'
import FileSaver from 'file-saver'
import '@github/time-elements'
import '@material/mwc-button'
import '@material/mwc-checkbox'
import '@material/mwc-dialog'
import '@material/mwc-formfield'
import '@material/mwc-icon'
import '@material/mwc-icon-button'
import '@material/mwc-tab-bar'
import '@material/mwc-textfield'
import '@polymer/paper-progress/paper-progress.js'
import '@polymer/paper-slider/paper-slider.js'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/iron-icons/iron-icons.js'
import '@vaadin/button'
import '@vaadin/grid'
import '@vaadin/icon'
import '@vaadin/icons'

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
            successMessage: { type: String },
            sendMoneyLoading: { type: Boolean },
            btnDisable: { type: Boolean },
            isValidAmount: { type: Boolean },
            balance: { type: Number },
            balanceString: { type: String },
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
            arrrBookAddress: { type: String }
        }
    }

    static get observers() {
        return ['_kmxKeyUp(amount)']
    }

    static get styles() {
        return css`
            * {
                box-sizing: border-box;
                --mdc-theme-primary: rgb(3, 169, 244);
                --mdc-theme-secondary: var(--mdc-theme-primary);
                --mdc-theme-surface: var(--white);
                --mdc-dialog-content-ink-color: var(--black);
                --mdc-dialog-min-width: 400px;
                --mdc-dialog-max-width: 1024px;
                --paper-input-container-focus-color: var(--mdc-theme-primary);
                --lumo-primary-text-color: rgb(0, 167, 245);
                --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
                --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
                --lumo-primary-color: hsl(199, 100%, 48%);
                --lumo-base-color: var(--white);
                --lumo-body-text-color: var(--black);
                --_lumo-grid-border-color: var(--border);
                --_lumo-grid-secondary-border-color: var(--border2);
            }

            #pages {
                display: flex;
                flex-wrap: wrap;
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
                color: var(--black);
            }

            #pages > button:not([disabled]):hover,
            #pages > button:focus {
                color: #ccc;
                background-color: #eee;
            }

            #pages > button[selected] {
                font-weight: bold;
                color: var(--white);
                background-color: #ccc;
            }

            #pages > button[disabled] {
                opacity: 0.5;
                cursor: default;
            }

            #tabs-height {
                --mdc-tab-height: 50px;
            }

            #tabs-1-content {
                height: 100%;
                padding-bottom: 10px;
            }

            mwc-tab-bar {
                --mdc-text-transform: none;
                --mdc-tab-color-default: var(--black);
                --mdc-tab-text-label-color-default: var(--black);
            }

            paper-slider.blue {
                --paper-slider-knob-color: var(--paper-light-blue-500);
                --paper-slider-active-color: var(--paper-light-blue-500);
                --paper-slider-pin-color: var(--paper-light-blue-500);
            }

            paper-progress {
                --paper-progress-active-color: var(--mdc-theme-primary);
            }

            .red {
                --mdc-theme-primary: #F44336;
            }

            .green {
                color: var(--paper-green-500);
            }

            paper-spinner-lite {
                height: 75px;
                width: 75px;
                --paper-spinner-color: var(--mdc-theme-primary);
                --paper-spinner-stroke-width: 3px;
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

            .sans {
                font-family: 'Open Sans', sans-serif;
            }

            .weight-100 {
                font-weight: 100;
            }

            .text-white-primary {
                color: var(--white);
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

            .white-bg {
                height: 100vh;
                background: var(--white);
            }

            span {
                font-size: 18px;
                word-break: break-all;
            }

            .floatleft {
                float: left;
            }

            .floatright {
                float: right;
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

            body {
                margin: 0;
                padding: 0;
                background: var(--white);
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }

            h2 {
                margin: 0;
                color: var(--black);
                font-weight: 400;
                font: 24px/24px 'Open Sans', sans-serif;
            }

            h3 {
                margin: 0 0 5px;
                color: var(--black);
                font-weight: 600;
                font-size: 18px;
                line-height: 18px;
            }

            .hrstyle {
                color: var(--border);
                border-radius: 80%;
                margin-bottom: 1rem;
            }

            .header-title {
                font-size: 32px;
                color: var(--black);
                font-weight: 600;
                text-align: center;
                margin-top: 1rem;
            }

            .fullWidth {
                width: 100%;
            }

            .wrapper {
                margin: 0 auto;
                height: 100%;
                overflow: hidden;
                border-radius: 8px;
                background-color: var(--white);
            }

            .wallet {
                width: 200px;
                height: 100vh;
                border-top-left-radius: inherit;
                border-bottom-left-radius: inherit;
                border-right: 1px solid var(--border);
            }

            .transactions-wrapper {
                width: 100%;
                padding: 30px 0 0 0;
                height: 100%;
            }

            .wallet-header {
                margin: 0 20px;
                color: var(--black);
            }

            .wallet-address {
                display: flex;
                align-items: center;
                font-size: 18px; 
                color: var(--black); 
                margin: 4px 0 20px;
            }

            .wallet-balance {
                display: inline-block;
                font-weight: 600;
                font-size: 32px;
                color: var(--black); 
            }

            #transactions {
                margin-top: 30px;
                margin-left: 20px;
                margin-right: 20px;
                border-top: 1px solid var(--border);
                padding-top: 0px;
                height: 100%;
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

            .active {
                background: var(--menuactive);
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

            .dgb .currency-image {
                background-image: url('/img/dgb.png');
            }

		.rvn .currency-image {
                background-image: url('/img/rvn.png');
            }

            .arrr .currency-image {
                background-image: url('/img/arrr.png');
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

            .buttons {
                width: auto !important;
            }

            .send-coin-dialog {
                min-height: 300px;
                min-width: 300px;
                box-sizing: border-box;
                position: relative;
            }

            .btn-clear-success {
			--mdc-icon-button-size: 32px;
			color: red;
		}

            .btn-clear-error {
			--mdc-icon-button-size: 32px;
			color: green;
		}

            @keyframes fade-in {
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }

            .successBox {
                height: 34px;
                min-width: 300px;
                width: 100%;
                border: 1px solid green;
                border-radius: 5px;
                background-color: transparent;
                margin-top: 15px;
            }

            .errorBox {
                height: 34px;
                min-width: 300px;
                width: 100%;
                border: 1px solid red;
                border-radius: 5px;
                background-color: transparent;
                margin-top: 15px;
            }

            .qrcode-pos {
                margin-top: -175px;
                float: right;
            }

            .send-pos {
                margin-top: 20px;
                margin-left: 20px;
                width: 185px;
            }

            .book-pos {
                margin-top: -44px;
                margin-left: 215px;
                width: 185px;
            }

            .square {
                width: 42px;
                height: 42px;
                object-fit: cover;
                aspect-ratio: 1 / 1;
            }

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
            }

            .checkboxLabel:hover{
                cursor: pointer;
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
            }

            @media (max-width: 530px) {
                h3 {
                    line-height: 24px;
                }
                .cards {
                    text-align: center;
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
        `
    }

    constructor() {
        super()

        this.lastBlock = {
            height: 0,
        }

        this.balanceString = this.renderFetchText()
        this.selectedTransaction = {}
        this.isTextMenuOpen = false
        this.loading = true

        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light';

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
        this.errorMessage = ''
        this.successMessage = ''
        this.sendMoneyLoading = false
        this.isValidAmount = false
        this.btnDisable = false
	  this.balance = 0
        this.amount = 0
        this.btcAmount = 0
        this.ltcAmount = 0
        this.dogeAmount = 0
        this.dgbAmount = 0
        this.rvnAmount = 0
        this.arrrAmount = 0
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
        this.wallets.get('arrr').wallet = window.parent.reduxStore.getState().app.selectedAddress.arrWallet

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
                <div class="header-title sans">
                    ${translate("walletpage.wchange22")}
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
                        ${translate("walletpage.wchange2")}
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
                    <div id="transactions">
                        ${this.loading ? html`<paper-spinner-lite style="display: block; margin: 5px auto;" active></paper-spinner-lite>` : ''}
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
                        <div><span>${this.selectedTransaction.creatorAddress}</span></div>
                        <span class="title"> ${translate("walletpage.wchange10")} </span>
                        <br />
                        <div style="display: inline;">
                            ${this.renderSQB()}
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
                                <vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.calculateQortAll()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange45")} QORT</vaadin-button>
                            </span><br /><span>&nbsp;</span>
                        </p>
                        <p>
                            <mwc-textfield
                                style="width: 100%;"
                                required
                                @input="${(e) => { this._checkAmount(e) }}"
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
                            <p style="margin-bottom: 0;">${translate("walletpage.wchange21")} <span style="font-weight: bold;">0.001 QORT<span></p>
                        </div>
                        ${this.renderClearSuccess()}
                        ${this.renderClearError()}
                        ${this.sendMoneyLoading ? html` <paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress> ` : ''}
                        <div class="buttons">
                            <div>
                                <vaadin-button ?disabled="${this.btnDisable}" theme="primary medium" style="width: 100%;" @click=${() => this.sendQort()}>
                                    <vaadin-icon icon="vaadin:arrow-forward" slot="prefix"></vaadin-icon>
                                    ${translate("walletpage.wchange17")} QORT
                                </vaadin-button>
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
                                <vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.calculateBtcAll()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange45")} BTC</vaadin-button>
                            </span><br /><span>&nbsp;</span>
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
                        ${this.sendMoneyLoading ? html` <paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress> ` : ''}
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
                                <vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.calculateLtcAll()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange45")} LTC</vaadin-button>
                            </span><br /><span>&nbsp;</span>
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
                        ${this.sendMoneyLoading ? html` <paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress> ` : ''}
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
                                <vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.calculateDogeAll()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange45")} DOGE</vaadin-button>
                            </span><br /><span>&nbsp;</span>
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
                        ${this.sendMoneyLoading ? html` <paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress> ` : ''}
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
                                <vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.calculateDgbAll()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange45")} DGB</vaadin-button>
                            </span><br /><span>&nbsp;</span>
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
                        ${this.sendMoneyLoading ? html` <paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress> ` : ''}
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
                                <vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.calculateRvnAll()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange45")} RVN</vaadin-button>
                            </span><br /><span>&nbsp;</span>
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
                        ${this.sendMoneyLoading ? html` <paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress> ` : ''}
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
                                <vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.calculateArrrAll()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange45")} ARRR</vaadin-button>
                            </span><br /><span>&nbsp;</span>
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
                        ${this.sendMoneyLoading ? html` <paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress> ` : ''}
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
                    <div class="floatleft">${this.renderExportAddressbookButton()}</div><div class="floatright">${this.renderImportAddressbookButton()}</div><br><br>
                    <hr>
                    <br>
                    <vaadin-grid theme="compact" id="qortBookGrid" ?hidden="${this.isEmptyArray(this.qortBook)}" aria-label="QORT Addressbook" .items="${this.qortBook}" all-rows-visible>
                        <vaadin-grid-column header="" .renderer=${(root, column, data) => {
                            render(html`${this.renderAvatar(data.item)}`, root)
                        }}></vaadin-grid-column>
                        <vaadin-grid-column auto-width header="${translate("chatpage.cchange11")}" path="name"></vaadin-grid-column>
                        <vaadin-grid-column auto-width header="${translate("login.address")}" path="address"></vaadin-grid-column>
                        <vaadin-grid-column width="11rem" flex-grow="0" header="${translate("chatpage.cchange13")}" .renderer=${(root, column, data) => {
                            render(html`${this.renderSendFromQortAddressbookButton(data.item)}`, root);
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
                    <div class="floatleft">${this.renderExportAddressbookButton()}</div><div class="floatright">${this.renderImportAddressbookButton()}</div><br><br>
                    <hr>
                    <br>
                    <vaadin-grid theme="compact" id="btcBookGrid" ?hidden="${this.isEmptyArray(this.btcBook)}" aria-label="BTC Addressbook" .items="${this.btcBook}" all-rows-visible>
                        <vaadin-grid-column header="" .renderer=${(root, column, data) => {
                            render(html`${this.renderAvatar(data.item)}`, root)
                        }}></vaadin-grid-column>
                        <vaadin-grid-column auto-width header="${translate("chatpage.cchange11")}" path="name"></vaadin-grid-column>
                        <vaadin-grid-column auto-width header="${translate("login.address")}" path="address"></vaadin-grid-column>
                        <vaadin-grid-column width="11rem" flex-grow="0" header="${translate("chatpage.cchange13")}" .renderer=${(root, column, data) => {
                            render(html`${this.renderSendFromBtcAddressbookButton(data.item)}`, root);
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
                    <div class="floatleft">${this.renderExportAddressbookButton()}</div><div class="floatright">${this.renderImportAddressbookButton()}</div><br><br>
                    <hr>
                    <br>
                    <vaadin-grid theme="compact" id="ltcBookGrid" ?hidden="${this.isEmptyArray(this.ltcBook)}" aria-label="LTC Addressbook" .items="${this.ltcBook}" all-rows-visible>
                        <vaadin-grid-column header="" .renderer=${(root, column, data) => {
                            render(html`${this.renderAvatar(data.item)}`, root)
                        }}></vaadin-grid-column>
                        <vaadin-grid-column auto-width header="${translate("chatpage.cchange11")}" path="name"></vaadin-grid-column>
                        <vaadin-grid-column auto-width header="${translate("login.address")}" path="address"></vaadin-grid-column>
                        <vaadin-grid-column width="11rem" flex-grow="0" header="${translate("chatpage.cchange13")}" .renderer=${(root, column, data) => {
                            render(html`${this.renderSendFromLtcAddressbookButton(data.item)}`, root);
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
                    <div class="floatleft">${this.renderExportAddressbookButton()}</div><div class="floatright">${this.renderImportAddressbookButton()}</div><br><br>
                    <hr>
                    <br>
                    <vaadin-grid theme="compact" id="dogeBookGrid" ?hidden="${this.isEmptyArray(this.dogeBook)}" aria-label="DOGE Addressbook" .items="${this.dogeBook}" all-rows-visible>
                        <vaadin-grid-column header="" .renderer=${(root, column, data) => {
                            render(html`${this.renderAvatar(data.item)}`, root)
                        }}></vaadin-grid-column>
                        <vaadin-grid-column auto-width header="${translate("chatpage.cchange11")}" path="name"></vaadin-grid-column>
                        <vaadin-grid-column auto-width header="${translate("login.address")}" path="address"></vaadin-grid-column>
                        <vaadin-grid-column width="11rem" flex-grow="0" header="${translate("chatpage.cchange13")}" .renderer=${(root, column, data) => {
                            render(html`${this.renderSendFromDogeAddressbookButton(data.item)}`, root);
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
                    <div class="floatleft">${this.renderExportAddressbookButton()}</div><div class="floatright">${this.renderImportAddressbookButton()}</div><br><br>
                    <hr>
                    <br>
                    <vaadin-grid theme="compact" id="dgbBookGrid" ?hidden="${this.isEmptyArray(this.dgbBook)}" aria-label="DGB Addressbook" .items="${this.dgbBook}" all-rows-visible>
                        <vaadin-grid-column header="" .renderer=${(root, column, data) => {
                            render(html`${this.renderAvatar(data.item)}`, root)
                        }}></vaadin-grid-column>
                        <vaadin-grid-column auto-width header="${translate("chatpage.cchange11")}" path="name"></vaadin-grid-column>
                        <vaadin-grid-column auto-width header="${translate("login.address")}" path="address"></vaadin-grid-column>
                        <vaadin-grid-column width="11rem" flex-grow="0" header="${translate("chatpage.cchange13")}" .renderer=${(root, column, data) => {
                            render(html`${this.renderSendFromDgbAddressbookButton(data.item)}`, root);
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
                    <div class="floatleft">${this.renderExportAddressbookButton()}</div><div class="floatright">${this.renderImportAddressbookButton()}</div><br><br>
                    <hr>
                    <br>
                    <vaadin-grid theme="compact" id="rvnBookGrid" ?hidden="${this.isEmptyArray(this.rvnBook)}" aria-label="RVN Addressbook" .items="${this.rvnBook}" all-rows-visible>
                        <vaadin-grid-column header="" .renderer=${(root, column, data) => {
                            render(html`${this.renderAvatar(data.item)}`, root)
                        }}></vaadin-grid-column>
                        <vaadin-grid-column auto-width header="${translate("chatpage.cchange11")}" path="name"></vaadin-grid-column>
                        <vaadin-grid-column auto-width header="${translate("login.address")}" path="address"></vaadin-grid-column>
                        <vaadin-grid-column width="11rem" flex-grow="0" header="${translate("chatpage.cchange13")}" .renderer=${(root, column, data) => {
                            render(html`${this.renderSendFromRvnAddressbookButton(data.item)}`, root);
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
                    <div class="floatleft">${this.renderExportAddressbookButton()}</div><div class="floatright">${this.renderImportAddressbookButton()}</div><br><br>
                    <hr>
                    <br>
                    <vaadin-grid theme="compact" id="arrrBookGrid" ?hidden="${this.isEmptyArray(this.arrrBook)}" aria-label="ARRR Addressbook" .items="${this.arrrBook}" all-rows-visible>
                        <vaadin-grid-column header="" .renderer=${(root, column, data) => {
                            render(html`${this.renderAvatar(data.item)}`, root)
                        }}></vaadin-grid-column>
                        <vaadin-grid-column auto-width header="${translate("chatpage.cchange11")}" path="name"></vaadin-grid-column>
                        <vaadin-grid-column auto-width header="${translate("login.address")}" path="address"></vaadin-grid-column>
                        <vaadin-grid-column width="11rem" flex-grow="0" header="${translate("chatpage.cchange13")}" .renderer=${(root, column, data) => {
                            render(html`${this.renderSendFromArrrAddressbookButton(data.item)}`, root);
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
                        <h1>Qortal ${translate("walletpage.wchange47")}</h1><br />
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
                            <vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.addToQortalAddressbook()}>
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
                        <h1>Bitcoin ${translate("walletpage.wchange47")}</h1><br />
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
                            <vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.addToBitcoinAddressbook()}>
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
                        <h1>Litecoin ${translate("walletpage.wchange47")}</h1><br />
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
                            <vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.addToLitecoinAddressbook()}>
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
                        <h1>Dogecoin ${translate("walletpage.wchange47")}</h1><br />
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
                            <vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.addToDogecoinAddressbook()}>
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
                        <h1>Digibyte ${translate("walletpage.wchange47")}</h1><br />
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
                            <vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.addToDigibyteAddressbook()}>
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
                        <h1>Ravencoin ${translate("walletpage.wchange47")}</h1><br />
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
                            <vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.addToRavencoinAddressbook()}>
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
                        <h1>Pirate Chain ${translate("walletpage.wchange47")}</h1><br />
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
                            <vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.addToPiratechainAddressbook()}>
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
                        <h1>Qortal ${translate("walletpage.wchange53")}</h1><br />
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
                        <h1>Bitcoin ${translate("walletpage.wchange53")}</h1><br />
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
                        <h1>Litecoin ${translate("walletpage.wchange53")}</h1><br />
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
                        <h1>Dogecoin ${translate("walletpage.wchange53")}</h1><br />
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
                        <h1>Digibyte ${translate("walletpage.wchange53")}</h1><br />
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
                        <h1>Litecoin ${translate("walletpage.wchange53")}</h1><br />
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
                        <h1>Pirate Chain ${translate("walletpage.wchange53")}</h1><br />
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
        `
    }

    firstUpdated() {

        this.changeTheme()
        this.changeLanguage()
        this.qortAddressbook()
        this.btcAddressbook()
        this.ltcAddressbook()
        this.dogeAddressbook()
        this.dgbAddressbook()
        this.rvnAddressbook()
        this.arrrAddressbook()

        this.transactionsDOM = this.shadowRoot.getElementById('transactionsDOM')

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

        window.onkeyup = (e) => {
            if (e.keyCode === 27) {
                parentEpml.request('closeCopyTextMenu', null)
            }
        }

        this.shadowRoot.getElementById('amountInput').addEventListener('contextmenu', (event) => {
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
                } else {
                    this.pasteMenu(event, 'amountInput')
                    this.isPasteMenuOpen = true
                    event.preventDefault()
                    event.stopPropagation()
                }
            }
            checkSelectedTextAndShowMenu()
        })

        this.shadowRoot.getElementById('recipient').addEventListener('contextmenu', (event) => {
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
                } else {
                    this.pasteMenu(event, 'recipient')
                    this.isPasteMenuOpen = true
                    event.preventDefault()
                    event.stopPropagation()
                }
            }
            checkSelectedTextAndShowMenu()
        })

        this.shadowRoot.getElementById('btcAmountInput').addEventListener('contextmenu', (event) => {
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
                } else {
                    this.pasteMenu(event, 'btcAmountInput')
                    this.isPasteMenuOpen = true
                    event.preventDefault()
                    event.stopPropagation()
                }
            }
            checkSelectedTextAndShowMenu()
        })

        this.shadowRoot.getElementById('btcRecipient').addEventListener('contextmenu', (event) => {
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
                } else {
                    this.pasteMenu(event, 'btcRecipient')
                    this.isPasteMenuOpen = true
                    event.preventDefault()
                    event.stopPropagation()
                }
            }
            checkSelectedTextAndShowMenu()
        })

        this.shadowRoot.getElementById('ltcAmountInput').addEventListener('contextmenu', (event) => {
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
                } else {
                    this.pasteMenu(event, 'ltcAmountInput')
                    this.isPasteMenuOpen = true
                    event.preventDefault()
                    event.stopPropagation()
                }
            }
            checkSelectedTextAndShowMenu()
        })

        this.shadowRoot.getElementById('ltcRecipient').addEventListener('contextmenu', (event) => {
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
                } else {
                    this.pasteMenu(event, 'ltcRecipient')
                    this.isPasteMenuOpen = true
                    event.preventDefault()
                    event.stopPropagation()
                }
            }
            checkSelectedTextAndShowMenu()
        })

        this.shadowRoot.getElementById('dogeAmountInput').addEventListener('contextmenu', (event) => {
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
                } else {
                    this.pasteMenu(event, 'dogeAmountInput')
                    this.isPasteMenuOpen = true
                    event.preventDefault()
                    event.stopPropagation()
                }
            }
            checkSelectedTextAndShowMenu()
        })

        this.shadowRoot.getElementById('dogeRecipient').addEventListener('contextmenu', (event) => {
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
                } else {
                    this.pasteMenu(event, 'dogeRecipient')
                    this.isPasteMenuOpen = true
                    event.preventDefault()
                    event.stopPropagation()
                }
            }
            checkSelectedTextAndShowMenu()
        })

        this.shadowRoot.getElementById('dgbAmountInput').addEventListener('contextmenu', (event) => {
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
                } else {
                    this.pasteMenu(event, 'dgbAmountInput')
                    this.isPasteMenuOpen = true
                    event.preventDefault()
                    event.stopPropagation()
                }
            }
            checkSelectedTextAndShowMenu()
        })

        this.shadowRoot.getElementById('dgbRecipient').addEventListener('contextmenu', (event) => {
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
                } else {
                    this.pasteMenu(event, 'dgbRecipient')
                    this.isPasteMenuOpen = true
                    event.preventDefault()
                    event.stopPropagation()
                }
            }
            checkSelectedTextAndShowMenu()
        })

	  this.shadowRoot.getElementById('rvnAmountInput').addEventListener('contextmenu', (event) => {
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
                } else {
                    this.pasteMenu(event, 'rvnAmountInput')
                    this.isPasteMenuOpen = true
                    event.preventDefault()
                    event.stopPropagation()
                }
            }
            checkSelectedTextAndShowMenu()
        })

        this.shadowRoot.getElementById('rvnRecipient').addEventListener('contextmenu', (event) => {
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
                } else {
                    this.pasteMenu(event, 'rvnRecipient')
                    this.isPasteMenuOpen = true
                    event.preventDefault()
                    event.stopPropagation()
                }
            }
            checkSelectedTextAndShowMenu()
        })

	  this.shadowRoot.getElementById('arrrAmountInput').addEventListener('contextmenu', (event) => {
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
                } else {
                    this.pasteMenu(event, 'arrrAmountInput')
                    this.isPasteMenuOpen = true
                    event.preventDefault()
                    event.stopPropagation()
                }
            }
            checkSelectedTextAndShowMenu()
        })

        this.shadowRoot.getElementById('arrrRecipient').addEventListener('contextmenu', (event) => {
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
                } else {
                    this.pasteMenu(event, 'arrrRecipient')
                    this.isPasteMenuOpen = true
                    event.preventDefault()
                    event.stopPropagation()
                }
            }
            checkSelectedTextAndShowMenu()
        })

        this.shadowRoot.getElementById('arrrMemo').addEventListener('contextmenu', (event) => {
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
                } else {
                    this.pasteMenu(event, 'arrrMemo')
                    this.isPasteMenuOpen = true
                    event.preventDefault()
                    event.stopPropagation()
                }
            }
            checkSelectedTextAndShowMenu()
        })
    }

    renderClearSuccess() {
        let strSuccessValue = this.successMessage
        if (strSuccessValue === "") {
            return html``
        } else {
            return html`
                <div class="successBox">
                    <span style="color: green; float: left; padding-top: 4px; padding-left: 7px;">${this.successMessage}</span>
                    <span style="padding-top: 4px: padding-right: 7px; float: right;"><mwc-icon-button class="btn-clear-success" title="${translate("general.close")}" icon="close" @click="${() => this.successMessage = ''}"></mwc-icon-button></span>
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
                    <span style="padding-top: 4px: padding-right: 7px; float: right;"><mwc-icon-button class="btn-clear-error" title="${translate("general.close")}" icon="close" @click="${() => this.errorMessage = ''}"></mwc-icon-button></span>
                </div>
                <div style="margin-bottom: 15px;">
                    <p style="margin-bottom: 0;">${translate("walletpage.wchange44")}</p>
                </div>
            `
        }
    }

    tabWalletQort() {
        this._selectedWallet = 'qort'
        this.showWallet()
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
        if (localStorage.getItem("addressbookQort") === null) {
            localStorage.setItem("addressbookQort", "")
        } else {
            this.qortBook = JSON.parse(localStorage.getItem("addressbookQort") || "[]")
        }
    }

    btcAddressbook() {
        if (localStorage.getItem("addressbookBtc") === null) {
            localStorage.setItem("addressbookBtc", "")
        } else {
            this.btcBook = JSON.parse(localStorage.getItem("addressbookBtc") || "[]")
        }
    }

    ltcAddressbook() {
        if (localStorage.getItem("addressbookLtc") === null) {
            localStorage.setItem("addressbookLtc", "")
        } else {
            this.ltcBook = JSON.parse(localStorage.getItem("addressbookLtc") || "[]")
        }
    }

    dogeAddressbook() {
        if (localStorage.getItem("addressbookDoge") === null) {
            localStorage.setItem("addressbookDoge", "")
        } else {
            this.dogeBook = JSON.parse(localStorage.getItem("addressbookDoge") || "[]")
        }
    }

    dgbAddressbook() {
        if (localStorage.getItem("addressbookDgb") === null) {
            localStorage.setItem("addressbookDgb", "")
        } else {
            this.dgbBook = JSON.parse(localStorage.getItem("addressbookDgb") || "[]")
        }
    }

    rvnAddressbook() {
        if (localStorage.getItem("addressbookRvn") === null) {
            localStorage.setItem("addressbookRvn", "")
        } else {
            this.rvnBook = JSON.parse(localStorage.getItem("addressbookRvn") || "[]")
        }
    }

    arrrAddressbook() {
        if (localStorage.getItem("addressbookArrr") === null) {
            localStorage.setItem("addressbookArrr", "")
        } else {
            this.arrrBook = JSON.parse(localStorage.getItem("addressbookArrr") || "[]")
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
        let name = this.shadowRoot.getElementById('qortNameInput').value
        let address = this.shadowRoot.getElementById('qortAddressInput').value

        var oldQortalBook = JSON.parse(localStorage.getItem("addressbookQort") || "[]")

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

        localStorage.setItem("addressbookQort", JSON.stringify(oldQortalBook))

        let qortbookstring2 = get("walletpage.wchange52")
        parentEpml.request('showSnackBar', `${qortbookstring2}`)

        this.closeQortAddressDialog()
        this.qortBook = JSON.parse(localStorage.getItem("addressbookQort") || "[]")
    }

    addToBitcoinAddressbook() {
        let name = this.shadowRoot.getElementById('btcNameInput').value
        let address = this.shadowRoot.getElementById('btcAddressInput').value

        var oldBitcoinBook = JSON.parse(localStorage.getItem("addressbookBtc") || "[]")

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

        localStorage.setItem("addressbookBtc", JSON.stringify(oldBitcoinBook))

        let btcbookstring3 = get("walletpage.wchange52")
        parentEpml.request('showSnackBar', `${btcbookstring3}`)

        this.closeBtcAddressDialog()
        this.btcBook = JSON.parse(localStorage.getItem("addressbookBtc") || "[]")
    }

    addToLitecoinAddressbook() {
        let name = this.shadowRoot.getElementById('ltcNameInput').value
        let address = this.shadowRoot.getElementById('ltcAddressInput').value

        var oldLitecoinBook = JSON.parse(localStorage.getItem("addressbookLtc") || "[]")

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

        localStorage.setItem("addressbookLtc", JSON.stringify(oldLitecoinBook))

        let ltcbookstring3 = get("walletpage.wchange52")
        parentEpml.request('showSnackBar', `${ltcbookstring3}`)

        this.closeLtcAddressDialog()
        this.ltcBook = JSON.parse(localStorage.getItem("addressbookLtc") || "[]")
    }

    addToDogecoinAddressbook() {
        let name = this.shadowRoot.getElementById('dogeNameInput').value
        let address = this.shadowRoot.getElementById('dogeAddressInput').value

        var oldDogecoinBook = JSON.parse(localStorage.getItem("addressbookDoge") || "[]")

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

        localStorage.setItem("addressbookDoge", JSON.stringify(oldDogecoinBook))

        let dogebookstring3 = get("walletpage.wchange52")
        parentEpml.request('showSnackBar', `${dogebookstring3}`)

        this.closeDogeAddressDialog()
        this.dogeBook = JSON.parse(localStorage.getItem("addressbookDoge") || "[]")
    }

    addToDigibyteAddressbook() {
        let name = this.shadowRoot.getElementById('dgbNameInput').value
        let address = this.shadowRoot.getElementById('dgbAddressInput').value

        var oldDigibyteBook = JSON.parse(localStorage.getItem("addressbookDgb") || "[]")

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

        localStorage.setItem("addressbookDgb", JSON.stringify(oldDigibyteBook))

        let dgbbookstring3 = get("walletpage.wchange52")
        parentEpml.request('showSnackBar', `${dgbbookstring3}`)

        this.closeDgbAddressDialog()
        this.dgbBook = JSON.parse(localStorage.getItem("addressbookDgb") || "[]")
    }

    addToRavencoinAddressbook() {
        let name = this.shadowRoot.getElementById('rvnNameInput').value
        let address = this.shadowRoot.getElementById('rvnAddressInput').value

        var oldRavencoinBook = JSON.parse(localStorage.getItem("addressbookRvn") || "[]")

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

        localStorage.setItem("addressbookRvn", JSON.stringify(oldRavencoinBook))

        let rvnbookstring3 = get("walletpage.wchange52")
        parentEpml.request('showSnackBar', `${rvnbookstring3}`)

        this.closeRvnAddressDialog()
        this.rvnBook = JSON.parse(localStorage.getItem("addressbookRvn") || "[]")
    }

    addToPiratechainAddressbook() {
        let name = this.shadowRoot.getElementById('arrrNameInput').value
        let address = this.shadowRoot.getElementById('arrrAddressInput').value

        var oldPiratechainBook = JSON.parse(localStorage.getItem("addressbookArrr") || "[]")

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

        localStorage.setItem("addressbookArrr", JSON.stringify(oldPiratechainBook))

        let arrrbookstring3 = get("walletpage.wchange52")
        parentEpml.request('showSnackBar', `${arrrbookstring3}`)

        this.closeArrrAddressDialog()
        this.arrrBook = JSON.parse(localStorage.getItem("addressbookArrr") || "[]")
    }

    sendFromQortAddressbook(websiteObj) {
        let address = websiteObj.address
        this.recipient = address
        this.openSendQort()
        this.shadowRoot.querySelector('#qortBookDialog').close()
    }

    sendFromBtcAddressbook(websiteObj) {
        let address = websiteObj.address
        this.btcRecipient = address
        this.openSendBtc()
        this.shadowRoot.querySelector('#btcBookDialog').close()
    }

    sendFromLtcAddressbook(websiteObj) {
        let address = websiteObj.address
        this.ltcRecipient = address
        this.openSendLtc()
        this.shadowRoot.querySelector('#ltcBookDialog').close()
    }

    sendFromDogeAddressbook(websiteObj) {
        let address = websiteObj.address
        this.dogeRecipient = address
        this.openSendDoge()
        this.shadowRoot.querySelector('#dogeBookDialog').close()
    }

    sendFromDgbAddressbook(websiteObj) {
        let address = websiteObj.address
        this.dgbRecipient = address
        this.openSendDgb()
        this.shadowRoot.querySelector('#dgbBookDialog').close()
    }

    sendFromRvnAddressbook(websiteObj) {
        let address = websiteObj.address
        this.rvnRecipient = address
        this.openSendRvn()
        this.shadowRoot.querySelector('#rvnBookDialog').close()
    }

    sendFromArrrAddressbook(websiteObj) {
        let address = websiteObj.address
        this.arrrRecipient = address
        this.openSendArrr()
        this.shadowRoot.querySelector('#arrrBookDialog').close()
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
        const qortBookData = JSON.stringify(localStorage.getItem("addressbookQort"))
        const qortBookSave = JSON.parse((qortBookData) || "[]")
        const blob = new Blob([qortBookSave], { type: 'text/plain;charset=utf-8' })
        FileSaver.saveAs(blob, `qortal_addressbook.qort.json`)
    }

    exportBtcAddressbook() {
        const btcBookData = JSON.stringify(localStorage.getItem("addressbookBtc"))
        const btcBookSave = JSON.parse((btcBookData) || "[]")
        const blob = new Blob([btcBookSave], { type: 'text/plain;charset=utf-8' })
        FileSaver.saveAs(blob, `bitcoin_addressbook.btc.json`)
    }

    exportLtcAddressbook() {
        const ltcBookData = JSON.stringify(localStorage.getItem("addressbookLtc"))
        const ltcBookSave = JSON.parse((ltcBookData) || "[]")
        const blob = new Blob([ltcBookSave], { type: 'text/plain;charset=utf-8' })
        FileSaver.saveAs(blob, `litecoin_addressbook.ltc.json`)
    }

    exportDogeAddressbook() {
        const dogeBookData = JSON.stringify(localStorage.getItem("addressbookDoge"))
        const dogeBookSave = JSON.parse((dogeBookData) || "[]")
        const blob = new Blob([dogeBookSave], { type: 'text/plain;charset=utf-8' })
        FileSaver.saveAs(blob, `dogecoin_addressbook.doge.json`)
    }

    exportDgbAddressbook() {
        const dgbBookData = JSON.stringify(localStorage.getItem("addressbookDgb"))
        const dgbBookSave = JSON.parse((dgbBookData) || "[]")
        const blob = new Blob([dgbBookSave], { type: 'text/plain;charset=utf-8' })
        FileSaver.saveAs(blob, `digibyte_addressbook.dgb.json`)
    }

    exportRvnAddressbook() {
        const rvnBookData = JSON.stringify(localStorage.getItem("addressbookRvn"))
        const rvnBookSave = JSON.parse((rvnBookData) || "[]")
        const blob = new Blob([rvnBookSave], { type: 'text/plain;charset=utf-8' })
        FileSaver.saveAs(blob, `ravencoin_addressbook.rvn.json`)
    }

    exportArrrAddressbook() {
        const arrrBookData = JSON.stringify(localStorage.getItem("addressbookArrr"))
        const arrrBookSave = JSON.parse((arrrBookData) || "[]")
        const blob = new Blob([arrrBookSave], { type: 'text/plain;charset=utf-8' })
        FileSaver.saveAs(blob, `piratechain_addressbook.arrr.json`)
    }

    importQortAddressbook(file) {
        localStorage.removeItem("addressbookQort")
        const newItems = JSON.parse((file) || "[]")
        localStorage.setItem("addressbookQort", JSON.stringify(newItems))
        this.qortBook = JSON.parse(localStorage.getItem("addressbookQort") || "[]")
        this.shadowRoot.querySelector('#importQortAddressbookDialog').close()
    }

    importBtcAddressbook(file) {
        localStorage.removeItem("addressbookBtc")
        const newItems = JSON.parse((file) || "[]")
        localStorage.setItem("addressbookBtc", JSON.stringify(newItems))
        this.btcBook = JSON.parse(localStorage.getItem("addressbookBtc") || "[]")
        this.shadowRoot.querySelector('#importBtcAddressbookDialog').close()
    }

    importLtcAddressbook(file) {
        localStorage.removeItem("addressbookLtc")
        const newItems = JSON.parse((file) || "[]")
        localStorage.setItem("addressbookLtc", JSON.stringify(newItems))
        this.ltcBook = JSON.parse(localStorage.getItem("addressbookLtc") || "[]")
        this.shadowRoot.querySelector('#importLtcAddressbookDialog').close()
    }

    importDogeAddressbook(file) {
        localStorage.removeItem("addressbookDoge")
        const newItems = JSON.parse((file) || "[]")
        localStorage.setItem("addressbookDoge", JSON.stringify(newItems))
        this.dogeBook = JSON.parse(localStorage.getItem("addressbookDoge") || "[]")
        this.shadowRoot.querySelector('#importDogeAddressbookDialog').close()
    }

    importDgbAddressbook(file) {
        localStorage.removeItem("addressbookDgb")
        const newItems = JSON.parse((file) || "[]")
        localStorage.setItem("addressbookDgb", JSON.stringify(newItems))
        this.dgbBook = JSON.parse(localStorage.getItem("addressbookDgb") || "[]")
        this.shadowRoot.querySelector('#importDgbAddressbookDialog').close()
    }

    importRvnAddressbook(file) {
        localStorage.removeItem("addressbookRvn")
        const newItems = JSON.parse((file) || "[]")
        localStorage.setItem("addressbookRvn", JSON.stringify(newItems))
        this.rvnBook = JSON.parse(localStorage.getItem("addressbookRvn") || "[]")
        this.shadowRoot.querySelector('#importRvnAddressbookDialog').close()
    }

    importArrrAddressbook(file) {
        localStorage.removeItem("addressbookArrr")
        const newItems = JSON.parse((file) || "[]")
        localStorage.setItem("addressbookArrr", JSON.stringify(newItems))
        this.arrrBook = JSON.parse(localStorage.getItem("addressbookArrr") || "[]")
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
        this.arrrMemo=''
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
        if (this.balance < 0.00110000) {
            let not_enough_string = get("walletpage.wchange26")
            parentEpml.request('showSnackBar', `${not_enough_string}`)
        } else {
            this.amount = (this.balance - 0.00100000).toFixed(8)
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
                    valid: false,
                }
            } else if (!nativeValidity.valid) {
                if (newValue.includes('.') === true) {
                    let myAmount = newValue.split('.')
                    if (myAmount[1].length > 8) {
                        this.btnDisable = true
                        target.validationMessage = this.renderInvalidText()
                    } else {
                        return {
                            valid: true,
                        }
                    }
                }
            } else {
                this.btnDisable = false
            }
        }
    }

    pasteToTextBox(elementId) {
        window.focus()
        navigator.clipboard.readText().then((clipboardText) => {
            let element = this.shadowRoot.getElementById(elementId)
            element.value += clipboardText
            element.focus()
        })
    }

    pasteMenu(event, elementId) {
        let eventObject = { pageX: event.pageX, pageY: event.pageY, clientX: event.clientX, clientY: event.clientY, elementId }
        parentEpml.request('openFramePasteMenu', eventObject)
    }

    async sendQort() {
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
            let myRef = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/lastreference/${this.getSelectedWalletAddress()}`,
            })
            return myRef
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
            return myRes
        }

        const validateAddress = async (receiverAddress) => {
            let myAddress = await window.parent.validateAddress(receiverAddress)
            return myAddress
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

        const getName = async (recipient)=> {
            try {
                
                const getNames = await parentEpml.request("apiCall", {
					type: "api",
					url: `/names/address/${recipient}`,
				})
                if(getNames?.length > 0 ){
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
                nonce: this.wallets.get(this._selectedWallet).wallet.nonce,
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
        validateReceiver(recipient)
        this.showWallet()
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
                feePerByte: (this.btcFeePerByte / 1e8).toFixed(8),
            }
            const response = await parentEpml.request('sendBtc', opts)
            return response
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
        this.showWallet()
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
                feePerByte: (this.ltcFeePerByte / 1e8).toFixed(8),
            }
            const response = await parentEpml.request('sendLtc', opts)
            return response
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
        this.showWallet()
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
                feePerByte: (this.dogeFeePerByte / 1e8).toFixed(8),
            }
            const response = await parentEpml.request('sendDoge', opts)
            return response
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
        this.showWallet()
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
                feePerByte: (this.dgbFeePerByte / 1e8).toFixed(8),
            }
            const response = await parentEpml.request('sendDgb', opts)
            return response
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
        this.showWallet()
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
                feePerByte: (this.rvnFeePerByte / 1e8).toFixed(8),
            }
            const response = await parentEpml.request('sendRvn', opts)
            return response
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
        this.showWallet()
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
            const response = await parentEpml.request('sendArrr', opts)
            return response
        }

        const manageResponse = (response) => {
            if (response.length === 64) {
                this.shadowRoot.getElementById('arrrAmountInput').value = 0
                this.shadowRoot.getElementById('arrrRecipient').value = ''
                this.shadowRoot.getElementById('arrrMemo').value = ''
                this.errorMessage = ''
                this.arrrRecipient = ''
                this.arrrMemo=''
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
        this.showWallet()
    }

    async showWallet() {
        this.transactionsDOM.hidden = true
        this.loading = true

        if (this._selectedWallet == 'qort') {
            if (!window.parent.reduxStore.getState().app.blockInfo.height) {
                await parentEpml.request('apiCall', { url: `/blocks/height`, type: 'api' })
                    .then(height => parentEpml.request('updateBlockInfo', { height }))
            }
        }
        const coin = this._selectedWallet
        await this.fetchWalletAddress(this._selectedWallet)
        await this.fetchWalletDetails(this._selectedWallet)
        if (this._selectedWallet == coin) {
            await this.renderTransactions()
            await this.getTransactionGrid(this._selectedWallet)
            await this.updateItemsFromPage(1, true)
            this.loading = false
            this.transactionsDOM.hidden = false
        }
    }

    async fetchWalletDetails(coin) {
        switch (coin) {
            case 'qort':
                this.balanceString = this.renderFetchText()
                parentEpml.request('apiCall', {
                    url: `/addresses/balance/${this.wallets.get('qort').wallet.address}?apiKey=${this.getApiKey()}`,
                })
                .then((res) => {
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
                const txsQort = await parentEpml.request('apiCall', {
                    url: `/transactions/search?address=${this.wallets.get('qort').wallet.address}&confirmationStatus=CONFIRMED&reverse=true`,
                })		
                const pendingTxsQort = await parentEpml.request('apiCall', {
                    url: `/transactions/unconfirmed?creator=${this.wallets.get('qort').wallet.base58PublicKey}&reverse=true&txType=PAYMENT&txType=REGISTER_NAME&txType=UPDATE_NAME&txType=SELL_NAME&txType=CANCEL_SELL_NAME&txType=BUY_NAME&txType=CREATE_POLL&txType=VOTE_ON_POLL&txType=ARBITRARY&txType=ISSUE_ASSET&txType=TRANSFER_ASSET&txType=CREATE_ASSET_ORDER&txType=CANCEL_ASSET_ORDER&txType=MULTI_PAYMENT&txType=DEPLOY_AT&txType=MESSAGE&txType=PUBLICIZE&txType=AIRDROP&txType=AT&txType=CREATE_GROUP&txType=UPDATE_GROUP&txType=ADD_GROUP_ADMIN&txType=REMOVE_GROUP_ADMIN&txType=GROUP_BAN&txType=CANCEL_GROUP_BAN&txType=GROUP_KICK&txType=GROUP_INVITE&txType=CANCEL_GROUP_INVITE&txType=JOIN_GROUP&txType=LEAVE_GROUP&txType=GROUP_APPROVAL&txType=SET_GROUP&txType=UPDATE_ASSET&txType=ACCOUNT_FLAGS&txType=ENABLE_FORGING&txType=REWARD_SHARE&txType=ACCOUNT_LEVEL&txType=TRANSFER_PRIVS&txType=PRESENCE`,
                })
                if (this._selectedWallet == coin) {
                    this.wallets.get(coin).transactions = pendingTxsQort.concat(txsQort)
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
                    body: `${window.parent.reduxStore.getState().app.selectedAddress[walletName].derivedMasterPublicKey}`,
                })
                .then((res) => {
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
                    body: `${window.parent.reduxStore.getState().app.selectedAddress[arrrWalletName].seed58}`,
                })
                if (coin != this._selectedWallet) {
                    // We've switched away from this coin
                }
                if (res !== null && res !== "Synchronized") {
                    // Not synchronized yet - display sync status instead of balance
                    this.balanceString = res;

                    // Check again shortly after
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    this.showWallet()

                    // No need to make balance or transaction list calls yet
                    return
                }

                this.balanceString = this.renderFetchText()

                parentEpml.request('apiCall', {
                    url: `/crosschain/${coin}/walletbalance?apiKey=${this.getApiKey()}`,
                    method: 'POST',
                    body: `${window.parent.reduxStore.getState().app.selectedAddress[arrrWalletName].seed58}`,
                })
                .then((res) => {
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
        if ( this._selectedWallet === "qort" ) {
            return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openSendQort()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange17")} QORT</vaadin-button>`
        } else if ( this._selectedWallet === "btc" ) {
            return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openSendBtc()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange17")} BTC</vaadin-button>`
        } else if ( this._selectedWallet === "ltc" ) {
            return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openSendLtc()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange17")} LTC</vaadin-button>`
        } else if ( this._selectedWallet === "doge" ) {
            return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openSendDoge()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange17")} DOGE</vaadin-button>`
        } else if ( this._selectedWallet === "dgb" ) {
            return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openSendDgb()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange17")} DGB</vaadin-button>`
        } else if ( this._selectedWallet === "rvn" ) {
            return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openSendRvn()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange17")} RVN</vaadin-button>`
        } else if ( this._selectedWallet === "arrr" ) {
            return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openSendArrr()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange17")} ARRR</vaadin-button>`
        } else {
            return html``
        }
    }

    renderAddressbookButton() {
        if ( this._selectedWallet === "qort" ) {
            return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openQortAddressbook()}><vaadin-icon icon="vaadin:book" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange47")}</vaadin-button>`
        } else if ( this._selectedWallet === "btc" ) {
            return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openBtcAddressbook()}><vaadin-icon icon="vaadin:book" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange47")}</vaadin-button>`
        } else if ( this._selectedWallet === "ltc" ) {
            return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openLtcAddressbook()}><vaadin-icon icon="vaadin:book" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange47")}</vaadin-button>`
        } else if ( this._selectedWallet === "doge" ) {
            return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openDogeAddressbook()}><vaadin-icon icon="vaadin:book" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange47")}</vaadin-button>`
        } else if ( this._selectedWallet === "dgb" ) {
            return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openDgbAddressbook()}><vaadin-icon icon="vaadin:book" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange47")}</vaadin-button>`
        } else if ( this._selectedWallet === "rvn" ) {
            return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openRvnAddressbook()}><vaadin-icon icon="vaadin:book" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange47")}</vaadin-button>`
        } else if ( this._selectedWallet === "arrr" ) {
            return html`<vaadin-button theme="primary medium" style="width: 100%;" @click=${() => this.openArrrAddressbook()}><vaadin-icon icon="vaadin:book" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange47")}</vaadin-button>`
        } else {
            return html``
        }
    }

    renderExportAddressbookButton() {
        if ( this._selectedWallet === "qort" ) {
            return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.exportQortAddressbook()}><vaadin-icon icon="vaadin:cloud-download" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange54")}</vaadin-button>`
        } else if ( this._selectedWallet === "btc" ) {
            return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.exportBtcAddressbook()}><vaadin-icon icon="vaadin:cloud-download" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange54")}</vaadin-button>`
        } else if ( this._selectedWallet === "ltc" ) {
            return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.exportKLtcAddressbook()}><vaadin-icon icon="vaadin:cloud-download" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange54")}</vaadin-button>`
        } else if ( this._selectedWallet === "doge" ) {
            return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.exportDogeAddressbook()}><vaadin-icon icon="vaadin:cloud-download" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange54")}</vaadin-button>`
        } else if ( this._selectedWallet === "dgb" ) {
            return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.exportDgbAddressbook()}><vaadin-icon icon="vaadin:cloud-download" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange54")}</vaadin-button>`
        } else if ( this._selectedWallet === "rvn" ) {
            return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.exportRvnAddressbook()}><vaadin-icon icon="vaadin:cloud-download" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange54")}</vaadin-button>`
        } else if ( this._selectedWallet === "arrr" ) {
            return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.exportArrrAddressbook()}><vaadin-icon icon="vaadin:cloud-download" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange54")}</vaadin-button>`
        } else {
            return html``
        }
    }

    renderImportAddressbookButton() {
        if ( this._selectedWallet === "qort" ) {
            return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.openImportQortAddressbook()}><vaadin-icon icon="vaadin:cloud-upload" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange53")}</vaadin-button>`
        } else if ( this._selectedWallet === "btc" ) {
            return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.openImportBtcAddressbook()}><vaadin-icon icon="vaadin:cloud-upload" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange53")}</vaadin-button>`
        } else if ( this._selectedWallet === "ltc" ) {
            return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.openImportLtcAddressbook()}><vaadin-icon icon="vaadin:cloud-upload" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange53")}</vaadin-button>`
        } else if ( this._selectedWallet === "doge" ) {
            return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.openImportDogeAddressbook()}><vaadin-icon icon="vaadin:cloud-upload" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange53")}</vaadin-button>`
        } else if ( this._selectedWallet === "dgb" ) {
            return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.openImportDgbAddressbook()}><vaadin-icon icon="vaadin:cloud-upload" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange53")}</vaadin-button>`
        } else if ( this._selectedWallet === "rvn" ) {
            return html`<vaadin-button theme="primary small" style="width: 100%;" @click=${() => this.openImportRvnAddressbook()}><vaadin-icon icon="vaadin:cloud-upload" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange53")}</vaadin-button>`
        } else if ( this._selectedWallet === "arrr" ) {
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
            <vaadin-grid theme="large" id="${coin}TransactionsGrid" ?hidden="${this.isEmptyArray(this.wallets.get(this._selectedWallet).transactions)}" page-size="25" all-rows-visible>
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
                        render(html` ${data.item.type} ${data.item.creatorAddress === this.wallets.get('qort').wallet.address ? html`<span class="color-out">${translate("walletpage.wchange7")}</span>` : html`<span class="color-in">${translate("walletpage.wchange8")}</span>`} `, root)
                    }}
                >
                </vaadin-grid-column>
                <vaadin-grid-column
                    auto-width
                    header="${translate("walletpage.wchange9")}"
                    path="creatorAddress"
                >
                </vaadin-grid-column>
                <vaadin-grid-column auto-width header="${translate("walletpage.wchange10")}" path="recipient"></vaadin-grid-column>
                <vaadin-grid-column auto-width header="${translate("walletpage.wchange36")}" path="fee"></vaadin-grid-column>
                <vaadin-grid-column auto-width header="${translate("walletpage.wchange11")}" path="amount"></vaadin-grid-column>
                <vaadin-grid-column auto-width
                    header="${translate("walletpage.wchange14")}"
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

    renderBtcTransactions(transactions, coin) {
        return html`
            <div style="padding-left:12px;" ?hidden="${!this.isEmptyArray(transactions)}"><span style="color: var(--black);">${translate("walletpage.wchange38")}</span></div>
            <vaadin-grid theme="large" id="${coin}TransactionsGrid" ?hidden="${this.isEmptyArray(this.wallets.get(this._selectedWallet).transactions)}" page-size="25" all-rows-visible>
                <vaadin-grid-column
                    auto-width
                    header="${translate("walletpage.wchange41")}"
                    .renderer=${(root, column, data) => {
                        render(html`<mwc-icon style="color: #00C851">check</mwc-icon>`, root)
                    }}
                >
                </vaadin-grid-column>
                <vaadin-grid-column
                    auto-width
                    header="${translate("walletpage.wchange35")}"
                    .renderer=${(root, column, data) => {
                        render(html` ${translate("walletpage.wchange40")} ${data.item.inputs[0].address === this.wallets.get(this._selectedWallet).wallet.address ? html`<span class="color-out">${translate("walletpage.wchange7")}</span>` : html`<span class="color-in">${translate("walletpage.wchange8")}</span>`} `, root)
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
                        render(html` <time-ago datetime=${time.toISOString()}> </time-ago> `, root)
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
                        render(html`<mwc-icon style="color: #00C851">check</mwc-icon>`, root)
                    }}
                >
                </vaadin-grid-column>
                <vaadin-grid-column
                    auto-width
                    header="${translate("walletpage.wchange35")}"
                    .renderer=${(root, column, data) => {
                        render(html` ${translate("walletpage.wchange40")} ${data.item.inputs[0].address === this.wallets.get(this._selectedWallet).wallet.address ? html`<span class="color-out">${translate("walletpage.wchange7")}</span>` : html`<span class="color-in">${translate("walletpage.wchange8")}</span>`} `, root)
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
                        render(html` <time-ago datetime=${time.toISOString()}> </time-ago> `, root)
                    }}
                >
                </vaadin-grid-column>
            </vaadin-grid>
            <div id="pages"></div>
	`
    }

    renderDogeTransactions(transactions, coin) {
        return html`
            <div style="padding-left:12px;" ?hidden="${!this.isEmptyArray(transactions)}"><span style="color: var(--black);">${translate("walletpage.wchange38")}</span></div>
            <vaadin-grid theme="large" id="${coin}TransactionsGrid" ?hidden="${this.isEmptyArray(this.wallets.get(this._selectedWallet).transactions)}" page-size="25" all-rows-visible>
                <vaadin-grid-column
                    auto-width
                    header="${translate("walletpage.wchange41")}"
                    .renderer=${(root, column, data) => {
                        render(html`<mwc-icon style="color: #00C851">check</mwc-icon>`, root)
                    }}
                >
                </vaadin-grid-column>
                <vaadin-grid-column
                    auto-width
                    header="${translate("walletpage.wchange35")}"
                    .renderer=${(root, column, data) => {
                        render(html` ${translate("walletpage.wchange40")} ${data.item.inputs[0].address === this.wallets.get(this._selectedWallet).wallet.address ? html`<span class="color-out">${translate("walletpage.wchange7")}</span>` : html`<span class="color-in">${translate("walletpage.wchange8")}</span>`} `, root)
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
                        render(html` <time-ago datetime=${time.toISOString()}> </time-ago> `, root)
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
                        render(html`<mwc-icon style="color: #00C851">check</mwc-icon>`, root)
                    }}
                >
                </vaadin-grid-column>
                <vaadin-grid-column
                    auto-width
                    header="${translate("walletpage.wchange35")}"
                    .renderer=${(root, column, data) => {
                        render(html` ${translate("walletpage.wchange40")} ${data.item.inputs[0].address === this.wallets.get(this._selectedWallet).wallet.address ? html`<span class="color-out">${translate("walletpage.wchange7")}</span>` : html`<span class="color-in">${translate("walletpage.wchange8")}</span>`} `, root)
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
                        render(html` <time-ago datetime=${time.toISOString()}> </time-ago> `, root)
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
                        render(html`<mwc-icon style="color: #00C851">check</mwc-icon>`, root)
                    }}
                >
                </vaadin-grid-column>
                <vaadin-grid-column
                    auto-width
                    header="${translate("walletpage.wchange35")}"
                    .renderer=${(root, column, data) => {
                        render(html` ${translate("walletpage.wchange40")} ${data.item.inputs[0].address === this.wallets.get(this._selectedWallet).wallet.address ? html`<span class="color-out">${translate("walletpage.wchange7")}</span>` : html`<span class="color-in">${translate("walletpage.wchange8")}</span>`} `, root)
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
                        render(html` <time-ago datetime=${time.toISOString()}> </time-ago> `, root)
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
                        render(html`<mwc-icon style="color: #00C851">check</mwc-icon>`, root)
                    }}
                >
                </vaadin-grid-column>
                <vaadin-grid-column
                    auto-width
                    header="${translate("walletpage.wchange35")}"
                    .renderer=${(root, column, data) => {
                        render(html` ${translate("walletpage.wchange40")} ${data.item.totalAmount < 0 ? html`<span class="color-out">${translate("walletpage.wchange7")}</span>` : html`<span class="color-in">${translate("walletpage.wchange8")}</span>`} `, root)
                    }}
                >
                </vaadin-grid-column>
                <!--<vaadin-grid-column
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
                </vaadin-grid-column>-->
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
                        render(html` <time-ago datetime=${time.toISOString()}> </time-ago> `, root)
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

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
        let apiKey = myNode.apiKey;
        return apiKey;
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

    renderAvatar(nameObj) {
        let name = nameObj.name
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/arbitrary/THUMBNAIL/${name}/qortal_avatar?async=true&apiKey=${this.getApiKey()}`;
        return html`<img class="square" src="${url}" onerror="this.onerror=null; this.src='/img/incognito.png';">`
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
        num = parseFloat(num)
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

    _unconfirmedClass(unconfirmed) {
        return unconfirmed ? 'unconfirmed' : ''
    }
}

window.customElements.define('multi-wallet', MultiWallet)
