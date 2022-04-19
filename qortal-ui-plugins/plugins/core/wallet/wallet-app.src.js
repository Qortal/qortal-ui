import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../epml.js'
import { use, get, translate, translateUnsafeHTML, registerTranslateConfig } from 'lit-translate'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

import '../components/ButtonIconCopy'
import '@material/mwc-button'
import '@material/mwc-checkbox'
import '@material/mwc-dialog'
import '@material/mwc-formfield'
import '@material/mwc-icon'
import '@material/mwc-textfield'
import '@polymer/paper-progress/paper-progress.js'
import '@polymer/paper-slider/paper-slider.js'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/button'
import '@vaadin/grid'
import '@vaadin/icon'
import '@vaadin/icons'
import '@github/time-elements'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

const coinsNames = ['qort', 'btc', 'ltc', 'doge']

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
            errorMessage: { type: String },
            successMessage: { type: String },
            sendMoneyLoading: { type: Boolean },
            btnDisable: { type: Boolean },
            isValidAmount: { type: Boolean },
            balance: { type: Number },
            btcFeePerByte: { type: Number },
            ltcFeePerByte: { type: Number },
            dogeFeePerByte: { type: Number },
            balanceString: { type: String }
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
                font-weight: 400;
                font: 24px/24px 'Open Sans', sans-serif;
            }

            h3 {
                margin: 0 0 5px;
                font-weight: 600;
                font-size: 18px;
                line-height: 18px;
            }

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
                background-color: var(--white);
            }

            .wallet {
                width: 170px;
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

            .currency-box {
                display: flex;
                background-color: var(--white);
                text-align: center;
                padding: 12px;
                cursor: pointer;
                transition: 0.1s ease-in-out;
            }

            .currency-box:not(:last-child) {
                border-bottom: var(--border);
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

            .currency-box.active .currency-image,
            .currency-box:hover .currency-image {
                filter: none;
            }

            .currency-box:hover {
                background: var(--menuhover);
            }

            .currency-box.active,
            .currency-box:hover .currency-text {
                font-weight: 500;
            }				
				
            .currency-text {
                margin: auto 0;
                margin-left: 8px;
                font-size: 20px;
                color: var(--black);
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

            .buttons {
                width: auto !important;
            }

            .send-coin-dialog {
                min-height: 300px;
                min-width: 300px;
                box-sizing: border-box;
                position: relative;
            }

            @keyframes fade-in {
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
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
                .currency-box:nth-of-type(2) {
                    margin-right: 0;
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

        this.selectWallet = this.selectWallet.bind(this)

        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light';

        this.recipient = ''
        this.btcRecipient = ''
        this.ltcRecipient = ''
        this.dogeRecipient = ''
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
        this.btcFeePerByte = 100
        this.btcSatMinFee = 20
        this.btcSatMaxFee = 150
        this.ltcFeePerByte = 30
        this.ltcSatMinFee = 10
        this.ltcSatMaxFee = 100
        this.dogeFeePerByte = 1000
        this.dogeSatMinFee = 100
        this.dogeSatMaxFee = 10000

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

        this._selectedWallet = 'qort'

        parentEpml.ready().then(() => {
            parentEpml.subscribe('selected_address', async (selectedAddress) => {
                selectedAddress = JSON.parse(selectedAddress)
                if (!selectedAddress || Object.entries(selectedAddress).length === 0) return

                this.wallets.get('qort').wallet = selectedAddress
                this.wallets.get('btc').wallet = window.parent.reduxStore.getState().app.selectedAddress.btcWallet
                this.wallets.get('ltc').wallet = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet
                this.wallets.get('doge').wallet = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet
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
                    <div style="font-size: 20px; color: var(--black); padding: 16px; border-bottom: 1px solid var(--border);">${translate("walletpage.wchange22")}</div>
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
                        ${translate("walletpage.wchange2")}
                        <div class="wallet-address">
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
                            ${this.balanceString}<br><br>
                            ${this.renderSendButton()}
                        </span>
                    </h2>
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
                        <div><span>${this.selectedTransaction.recipient}</span></div>
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
                        <div>
                            <span>${this.selectedTransaction.btcReceiver}</span>
                        </div>
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
                        <div>
                            <span> ${this.selectedTransaction.ltcReceiver} </span>
                        </div>
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
                        <div>
                            <span>${this.selectedTransaction.dogeSender}</span>
                        </div>
                         <span class="title"> ${translate("walletpage.wchange10")} </span>
                        <br />
                        <div>
                            <span>${this.selectedTransaction.dogeReceiver}</span>
                        </div>
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

                <mwc-dialog id="sendQortDialog">
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
                            <span style="font-weight: bold;">${this.balanceString}</span>
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
                        <div style="margin-bottom: 0;">
                            <p style="margin-bottom: 0;">${translate("walletpage.wchange21")} <span style="font-weight: bold;">0.001 QORT<span></p>
                        </div>
                        <p style="color: red;">${this.errorMessage}</p>
                        <p style="color: green;">${this.successMessage}</p>
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
                        dialogAction="cancel"
                        class="red"
                    >
                    ${translate("general.close")}
                    </mwc-button>
                </mwc-dialog>

                <mwc-dialog id="sendBtcDialog">
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
                            <span style="font-weight: bold;">${this.balanceString}</span>
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
                        <p style="color: red;">${this.errorMessage}</p>
                        <p style="color: green;">${this.successMessage}</p>
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
                        dialogAction="cancel"
                        class="red"
                    >
                    ${translate("general.close")}
                    </mwc-button>
                </mwc-dialog>

                <mwc-dialog id="sendLtcDialog">
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
                            <span style="font-weight: bold;">${this.balanceString}</span>
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
                        <p style="color: red;">${this.errorMessage}</p>
                        <p style="color: green;">${this.successMessage}</p>
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
                        dialogAction="cancel"
                        class="red"
                    >
                    ${translate("general.close")}
                    </mwc-button>
                </mwc-dialog>

                <mwc-dialog id="sendDogeDialog">
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
                            <span style="font-weight: bold;">${this.balanceString}</span>
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
                                ${translate("walletpage.wchange24")}: <span style="font-weight: bold;">${(this.dogeFeePerByte / 1e8).toFixed(8)} DOGE</span><br>L${translate("walletpage.wchange25")}
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
                        <p style="color: red;">${this.errorMessage}</p>
                        <p style="color: green;">${this.successMessage}</p>
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

	setInterval(() => {
	    this.errorMessage = '';
	}, 10000)

	setInterval(() => {
	    this.successMessage = '';
	}, 10000)

        this.currencyBoxes = this.shadowRoot.querySelectorAll('.currency-box')
        this.transactionsDOM = this.shadowRoot.getElementById('transactionsDOM')

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

    selectWallet(event) {
        event.preventDefault()

        const target = event.currentTarget

        this.currencyBoxes.forEach((currencyBox) => {
            if (currencyBox.classList.contains('active')) {
                currencyBox.classList.remove('active')
            }
        })
        target.classList.add('active')
        this._selectedWallet = target.attributes.coin.value
        this.showWallet()
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

        const makeTransactionRequest = async (receiver, lastRef) => {
            let myReceiver = receiver
            let mylastRef = lastRef
            let dialogamount = get("transactions.amount")
            let dialogto = get("transactions.to")

            let myTxnrequest = await parentEpml.request('transaction', {
                type: 2,
                nonce: this.wallets.get(this._selectedWallet).wallet.nonce,
                params: {
                    recipient: myReceiver,
                    amount: amount,
                    lastReference: mylastRef,
                    fee: 0.001,
                    dialogamount: dialogamount,
                    dialogto: dialogto,
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
                this.successMessage = this.renderReceiverText()
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
        this.balanceString = this.renderFetchText()
        switch (coin) {
            case 'qort':
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
                if (this._selectedWallet == coin) {
                    this.wallets.get(coin).transactions = txsQort
                }
                break
            case 'btc':
            case 'ltc':
            case 'doge':
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
                console.log(sortedTransactions)
                if (this._selectedWallet == coin) {
                    this.wallets.get(this._selectedWallet).transactions = sortedTransactions
                }
                break
            default:
                break
        }
    }

    renderSendButton() {
        if ( this._selectedWallet === "qort" ) {
            return html`<vaadin-button theme="primary large" style="width: 75%;" @click=${() => this.openSendQort()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange17")} QORT</vaadin-button>`
        } else if ( this._selectedWallet === "btc" ) {
            return html`<vaadin-button theme="primary large" style="width: 75%;" @click=${() => this.openSendBtc()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange17")} BTC</vaadin-button>`
        } else if ( this._selectedWallet === "ltc" ) {
            return html`<vaadin-button theme="primary large" style="width: 75%;" @click=${() => this.openSendLtc()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange17")} LTC</vaadin-button>`
        } else if ( this._selectedWallet === "doge" ) {
            return html`<vaadin-button theme="primary large" style="width: 75%;" @click=${() => this.openSendDoge()}><vaadin-icon icon="vaadin:coin-piles" slot="prefix"></vaadin-icon> ${translate("walletpage.wchange17")} DOGE</vaadin-button>`
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
                    this.showAltTransactionDetails(btcItem, this.wallets.get(this._selectedWallet).transactions)
                },
                { passive: true }
            )
        } else if (coin === 'ltc') {
            this.transactionsGrid.addEventListener(
                'click',
                (e) => {
                    let ltcItem = this.transactionsGrid.getEventContext(e).item
                    this.showAltTransactionDetails(ltcItem, this.wallets.get(this._selectedWallet).transactions)
                },
                { passive: true }
            )
        } else if (coin === 'doge') {
            this.transactionsGrid.addEventListener(
                'click',
                (e) => {
                    let dogeItem = this.transactionsGrid.getEventContext(e).item
                    this.showAltTransactionDetails(dogeItem, this.wallets.get(this._selectedWallet).transactions)
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
            render(this.renderAltTransactions(this.wallets.get(this._selectedWallet).transactions, this._selectedWallet), this.transactionsDOM)
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
                        if (confirmed) {
                            render(html`<mwc-icon title="${data.item.confirmations} ${translate("walletpage.wchange42")}" style="color: #00C851">check</mwc-icon>`, root)
                        } else {
                            render(html`<mwc-icon title="${data.item.confirmations || 0}/${requiredConfirmations} ${translate("walletpage.wchange42")}" style="color: #777">schedule</mwc-icon>`, root)
                        }
                    }}
                >
                </vaadin-grid-column>
                <vaadin-grid-column
                    auto-width
                    resizable
                    header="${translate("walletpage.wchange35")}"
                    .renderer=${(root, column, data) => {
                        render(html` ${data.item.type} ${data.item.creatorAddress === this.wallets.get('qort').wallet.address ? html`<span class="color-out">${translate("walletpage.wchange7")}</span>` : html`<span class="color-in">${translate("walletpage.wchange8")}</span>`} `, root)
                    }}
                >
                </vaadin-grid-column>
                <vaadin-grid-column auto-width resizable header="${translate("walletpage.wchange9")}" path="creatorAddress"></vaadin-grid-column>
                <vaadin-grid-column auto-width resizable header="${translate("walletpage.wchange10")}" path="recipient"></vaadin-grid-column>
                <vaadin-grid-column auto-width resizable header="${translate("walletpage.wchange36")}" path="fee"></vaadin-grid-column>
                <vaadin-grid-column auto-width resizable header="${translate("walletpage.wchange11")}" path="amount"></vaadin-grid-column>
                <vaadin-grid-column
                    auto-width
                    resizable
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

    renderAltTransactions(transactions, coin) {
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
                    resizable
                    header="${translate("walletpage.wchange35")}"
                    .renderer=${(root, column, data) => {
                        render(html` ${translate("walletpage.wchange40")} ${data.item.inputs[0].address === this.wallets.get(this._selectedWallet).wallet.address ? html`<span class="color-out">${translate("walletpage.wchange7")}</span>` : html`<span class="color-in">${translate("walletpage.wchange8")}</span>`} `, root)
                    }}
                >
                </vaadin-grid-column>
                <vaadin-grid-column
                    auto-width
                    resizable
                    header="${translate("walletpage.wchange9")}"
                    .renderer=${(root, column, data) => {
                        render(html`${data.item.inputs[0].address}`, root)
                    }}
                >
                </vaadin-grid-column>
                <vaadin-grid-column
                    auto-width
                    resizable
                    header="${translate("walletpage.wchange10")}"
                    .renderer=${(root, column, data) => {
                        render(html`${data.item.outputs[0].address}`, root)
                    }}
                >
                </vaadin-grid-column>
                <vaadin-grid-column auto-width resizable header="${translate("walletpage.wchange16")}" path="txHash"></vaadin-grid-column>
                <vaadin-grid-column
                    auto-width
                    resizable
                    header="${translate("walletpage.wchange37")}"
                    .renderer=${(root, column, data) => {
                        const amount = (Number(data.item.totalAmount) / 1e8).toFixed(8)
                        render(html`${amount}`, root)
                    }}
                >
                </vaadin-grid-column>
                <vaadin-grid-column
                    auto-width
                    resizable
                    header="${translate("walletpage.wchange14")}"
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

	showAltTransactionDetails(myTransaction, allTransactions) {
        allTransactions.forEach((transaction) => {
            if (myTransaction.txHash === transaction.txHash) {
                let altTxnFlow = myTransaction.inputs[0].address === this.wallets.get(this._selectedWallet).wallet.address ? 'OUT' : 'IN'
                let altSender = myTransaction.inputs[0].address
                let altReceiver = myTransaction.outputs[0].address
                this.selectedTransaction = { ...transaction, altTxnFlow, altSender, altReceiver }
                if (this.selectedTransaction.txHash.length != 0) {
					if ( this._selectedWallet === "btc" ) {
						this.shadowRoot.querySelector('#showBtcTransactionDetailsDialog').show()
					} else if ( this._selectedWallet === "ltc" ) {
						this.shadowRoot.querySelector('#showLtcTransactionDetailsDialog').show()
					} else if ( this._selectedWallet === "doge" ) {
						this.shadowRoot.querySelector('#showDogeTransactionDetailsDialog').show()
					}
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
