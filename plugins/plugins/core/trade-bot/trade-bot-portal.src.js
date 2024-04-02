import {html, LitElement} from 'lit'
import {render} from 'lit/html.js'
import {Epml} from '../../../epml.js'
import isElectron from 'is-electron'
import {get, registerTranslateConfig, translate, use} from '../../../../core/translate'
import Base58 from '../../../../crypto/api/deps/Base58.js'
import {decryptData, encryptData} from '../../../../core/src/lockScreen.js'
import {tradebotStyles} from './trade-bot-portal-css.js'
import '@material/mwc-button'
import '@material/mwc-textfield'
import '@material/mwc-icon'
import '@material/mwc-icon-button'
import '@material/mwc-dialog'
import '@material/mwc-fab'
import '@material/mwc-tab-bar'
import '@material/mwc-tab'
import '@material/mwc-list/mwc-list-item'
import '@material/mwc-select'
import '@polymer/iron-icons/iron-icons.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/grid'
import '@vaadin/grid/vaadin-grid-sorter'
import '@vaadin/password-field'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

let workers = new Map()

class TradeBotPortal extends LitElement {
    static get properties() {
        return {
            selectedAddress: { type: Object },
            config: { type: Object },
            listedCoins: { type: Map },
            blockedTradesList: { type: Array },
            tradesPresenceCleaned: { type: Array },
            sellBtnDisable: { type: Boolean },
            isSellLoading: { type: Boolean },
            isBuyLoading: { type: Boolean },
            buyBtnDisable: { type: Boolean },
            autoBuyWarning: { type: Boolean },
            autoBuyBtnDisable: { type: Boolean },
            autoBuyBotDisable: { type: Boolean },
            initialAmount: { type: Number },
            cancelBtnDisable: { type: Boolean },
            cancelStuckOfferBtnDisable: { type: Boolean },
            selectedCoin: { type: String },
            isLoadingHistoricTrades: { type: Boolean },
            isLoadingOpenTrades: { type: Boolean },
            isLoadingMyOpenOrders: { type: Boolean },
            showGetWalletBance: { type: Boolean },
            showAddAutoBuy: { type: Boolean },
            theme: { type: String, reflect: true },
            btcWallet: { type: String },
            ltcWallet: { type: String },
            dogeWallet: { type: String },
            dgbWallet: { type: String },
            rvnWallet: { type: String },
            arrrWallet: { type: String },
            arrrWalletAddress: { type: String },
            qortbtc: { type: Number },
            qortltc: { type: Number },
            qortdoge: { type: Number },
            qortdgb: { type: Number },
            qortrvn: { type: Number },
            qortarrr: { type: Number },
            btcqort: { type: Number },
            ltcqort: { type: Number },
            dogeqort: { type: Number },
            dgbqort: { type: Number },
            rvnqort: { type: Number },
            arrrqort: { type: Number },
            tradeBotBtcBook: { type: Array },
            tradeBotLtcBook: { type: Array },
            tradeBotDogeBook: { type: Array },
            tradeBotDgbBook: { type: Array },
            tradeBotRvnBook: { type: Array },
            tradeBotArrrBook: { type: Array },
            autoSalt: { type: String },
            autoStorageData: { type: String },
            autoLockScreenPass: { type: String },
            autoLockScreenSet: { type: String },
            autoLockPass: { type: String },
            autoLockSet: { type: String },
            myAutoLockScreenPass: { type: String },
            myAutoLockScreenSet: { type: String },
            autoHelperMessage: { type: String }
        }
    }

    static get styles() {
        return [tradebotStyles]
    }

    constructor() {
        super()
        let qortal = {
            name: "QORTAL",
            balance: "0",
            coinCode: "QORT",
            coinAmount: this.amountString,
            tradeFee: "0.002"
        }

        let bitcoin = {
            name: "BITCOIN",
            balance: "0",
            coinCode: "BTC",
            openOrders: [],
            openFilteredOrders: [],
            historicTrades: [],
            myOrders: [],
            myHistoricTrades: [],
            myOfferingOrders: [],
            myGridBoughtItems: [],
            openTradeOrders: null,
            tradeOffersSocketCounter: 1,
            coinAmount: this.amountString,
            tradeFee: "~0.0001"
        }

        let litecoin = {
            name: "LITECOIN",
            balance: "0",
            coinCode: "LTC",
            openOrders: [],
            openFilteredOrders: [],
            historicTrades: [],
            myOrders: [],
            myHistoricTrades: [],
            myOfferingOrders: [],
            myGridBoughtItems: [],
            openTradeOrders: null,
            tradeOffersSocketCounter: 1,
            coinAmount: this.amountString,
            tradeFee: "~0.00005"
        }

        let dogecoin = {
            name: "DOGECOIN",
            balance: "0",
            coinCode: "DOGE",
            openOrders: [],
            openFilteredOrders: [],
            historicTrades: [],
            myOrders: [],
            myHistoricTrades: [],
            myOfferingOrders: [],
            myGridBoughtItems: [],
            openTradeOrders: null,
            tradeOffersSocketCounter: 1,
            coinAmount: this.amountString,
            tradeFee: "~0.005"
        }

        let digibyte = {
            name: "DIGIBYTE",
            balance: "0",
            coinCode: "DGB",
            openOrders: [],
            openFilteredOrders: [],
            historicTrades: [],
            myOrders: [],
            myHistoricTrades: [],
            myOfferingOrders: [],
            myGridBoughtItems: [],
            openTradeOrders: null,
            tradeOffersSocketCounter: 1,
            coinAmount: this.amountString,
            tradeFee: "~0.0005"
        }

	  let ravencoin = {
            name: "RAVENCOIN",
            balance: "0",
            coinCode: "RVN",
            openOrders: [],
            openFilteredOrders: [],
            historicTrades: [],
            myOrders: [],
            myHistoricTrades: [],
            myOfferingOrders: [],
            myGridBoughtItems: [],
            openTradeOrders: null,
            tradeOffersSocketCounter: 1,
            coinAmount: this.amountString,
            tradeFee: "~0.006"
        }

        let piratechain = {
            name: "PIRATECHAIN",
            balance: "0",
            coinCode: "ARRR",
            openOrders: [],
            openFilteredOrders: [],
            historicTrades: [],
            myOrders: [],
            myHistoricTrades: [],
            myOfferingOrders: [],
            myGridBoughtItems: [],
            openTradeOrders: null,
            tradeOffersSocketCounter: 1,
            coinAmount: this.amountString,
            tradeFee: "~0.0002"
        }

        this.listedCoins = new Map()
        this.listedCoins.set("QORTAL", qortal)
        this.listedCoins.set("BITCOIN", bitcoin)
        this.listedCoins.set("LITECOIN", litecoin)
        this.listedCoins.set("DOGECOIN", dogecoin)
        this.listedCoins.set("DIGIBYTE", digibyte)
        this.listedCoins.set("RAVENCOIN", ravencoin)
        this.listedCoins.set("PIRATECHAIN", piratechain)

        workers.set("QORTAL", {
            tradesConnectedWorker: null,
            handleStuckTradesConnectedWorker: null
        })

        workers.set("BITCOIN", {
            tradesConnectedWorker: null,
            handleStuckTradesConnectedWorker: null
        })

        workers.set("LITECOIN", {
            tradesConnectedWorker: null,
            handleStuckTradesConnectedWorker: null
        })

        workers.set("DOGECOIN", {
            tradesConnectedWorker: null,
            handleStuckTradesConnectedWorker: null
        })

        workers.set("DIGIBYTE", {
            tradesConnectedWorker: null,
            handleStuckTradesConnectedWorker: null
        })

	  workers.set("RAVENCOIN", {
            tradesConnectedWorker: null,
            handleStuckTradesConnectedWorker: null
        })

        workers.set("PIRATECHAIN", {
            tradesConnectedWorker: null,
            handleStuckTradesConnectedWorker: null
        })

        this.selectedCoin = "LITECOIN"
        this.selectedAddress = {}
        this.config = {}
        this.blockedTradesList = []
        this.tradesPresenceCleaned = []
        this.sellBtnDisable = false
        this.isSellLoading = false
        this.buyBtnDisable = true
        this.autoBuyWarning = false
        this.autoBuyBtnDisable = true
        this.autoBuyBotDisable = false
        this.isBuyLoading = false
        this.initialAmount = 0
        this.cancelBtnDisable = false
        this.cancelStuckOfferBtnDisable = false
        this.isLoadingHistoricTrades = true
        this.isLoadingOpenTrades = true
        this.isLoadingMyOpenOrders = false
        this.showGetWalletBance = true
        this.showAddAutoBuy = false
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
        this.btcWallet = ''
        this.ltcWallet = ''
        this.dogeWallet = ''
        this.dgbWallet = ''
        this.rvnWallet = ''
        this.arrrWallet = ''
        this.arrrWalletAddress = ''
        this.qortbtc = 0
        this.qortltc = 0
        this.qortdoge = 0
        this.qortdgb = 0
        this.qortrvn = 0
        this.qortarrr = 0
        this.btcqort = 0
        this.ltcqort = 0
        this.dogeqort = 0
        this.dgbqort = 0
        this.rvnqort = 0
        this.arrrqort = 0
        this.tradeBotBtcBook = []
        this.tradeBotLtcBook = []
        this.tradeBotDogeBook = []
        this.tradeBotDgbBook = []
        this.tradeBotRvnBook = []
        this.tradeBotArrrBook = []
        this.autoSalt = ''
        this.autoStorageData = ''
        this.autoLockScreenPass = ''
        this.autoLockScreenSet = ''
        this.autoLockPass = ''
        this.autoLockSet = ''
        this.myAutoLockScreenPass = ''
        this.myAutoLockScreenSet = ''
        this.autoHelperMessage = ''
    }

    openTradesTemplate() {
        return html`
		<div class="open-trades">
			<div class="box">
				<header><span>${this.listedCoins.get(this.selectedCoin).coinCode} ${translate("tradepage.tchange42")}</span></header>
				<div class="border-wrapper">
					<div class="loadingContainer" id="loadingHistoricTrades" style="display:${this.isLoadingOpenTrades ? 'block' : 'none'}"><div class="loading"></div><span style="color: var(--black);">${translate("login.loading")}</span></div>
					<vaadin-grid multi-sort="true" theme="compact column-borders row-stripes wrap-cell-content" id="openOrdersGrid" aria-label="Open Orders" .items="${this.listedCoins.get(this.selectedCoin).openFilteredOrders}">
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange8")} (QORT)"
							id="qortAmountColumn"
							.renderer=${(root, column, data) => {
								render(html`<span>${this.round(data.item.qortAmount)}</span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange9")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
							id="priceColumn"
							.renderer=${(root, column, data) => {
								render(html`<span>${this.round(data.item.price)}</span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange10")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
							id="foreignAmountColumn"
							.renderer=${(root, column, data) => {
								render(html`<span>${data.item.foreignAmount}</span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange13")}"
							id="qortalCreatorColumn"
							.renderer=${(root, column, data) => {
								render(html`<span>${data.item.qortalCreator}</span>`, root)
							}}
						>
						</vaadin-grid-column>
					</vaadin-grid>
				</div>
			</div>
		</div>
        `
    }

    myOpenOrdersTemplate() {
        return html`
		<div class="my-open-orders">
			<div class="box">
				<header><span>${translate("info.inf15")}</span></header>
				<div class="border-wrapper">
					<div class="loadingContainer" id="loadingHistoricTrades" style="display:${this.isLoadingMyOpenOrders ? 'block' : 'none'}"><div class="loading"></div><span style="color: var(--black);">${translate("login.loading")}</span></div>
					<vaadin-grid multi-sort="true" theme="compact column-borders row-stripes wrap-cell-content" id="myOrdersGrid" aria-label="My Orders" .items="${this.listedCoins.get(this.selectedCoin).myOrders}">
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange11")}"
							.renderer=${(root, column, data) => {
								const dateString = new Date(data.item.timestamp).toLocaleString()
								render(html`${dateString}`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange12")}"
							.renderer=${(root, column, data) => {
								render(html`<span id="${data.item.atAddress}"> ${data.item._tradeState} </span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange9")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
							.renderer=${(root, column, data) => {
								const price = this.round(parseFloat(data.item.foreignAmount) / parseFloat(data.item.qortAmount))
								render(html`${price}`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange8")} (QORT)" path="qortAmount"
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange10")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
                                          path="foreignAmount"
						>
						</vaadin-grid-column>
					</vaadin-grid>
				</div>
			</div>
		</div>
        `
    }

    myDoneTradesTemplate() {
        return html`
		<div class="my-historic-trades">
			<div class="box">
				<header>${translate("tradepage.tchange43")} (${this.listedCoins.get(this.selectedCoin).coinCode})</header>
				<div class="border-wrapper">
					<div class="loadingContainer" id="loadingHistoricTrades" style="display:${this.isLoadingDoneTrades ? 'block' : 'none'}"><div class="loading"></div><span style="color: var(--black);">${translate("login.loading")}</span></div>
					<vaadin-grid theme="compact column-borders row-stripes wrap-cell-content" id="myDoneTradesGrid" aria-label="My Buyed Qortal" .items="${this.listedCoins.get(this.selectedCoin).myGridBoughtItems}">
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange11")}"
							.renderer=${(root, column, data) => {
								const dateString = new Date(data.item.timestamp).toLocaleString()
								render(html`${dateString}`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange12")}"
							.renderer=${(root, column, data) => {
								return render(html`<span style="color: green"> ${translate("tradepage.tchange32")} </span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange9")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
							.renderer=${(root, column, data) => {
								const price = this.round(parseFloat(data.item.foreignAmount) / parseFloat(data.item.qortAmount))
								render(html`${price}`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange8")} (QORT)"
                                          path="qortAmount"
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange10")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
							.renderer=${(root, column, data) => {
								render(html`<span> ${data.item.foreignAmount} </span>`, root)
							}}
						>
						</vaadin-grid-column>
					</vaadin-grid>
				</div>
			</div>
		</div>
        `
    }

    myHistoricTradesTemplate() {
        return html`
		<div class="my-historic-trades">
			<div class="box">
				<header>${translate("tradepage.tchange4")}</header>
				<div class="border-wrapper">
					<vaadin-grid theme="compact column-borders row-stripes wrap-cell-content" id="myHistoricTradesGrid" aria-label="My Open Orders" .items="${this.listedCoins.get(this.selectedCoin).myHistoricTrades}">
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange11")}"
							.renderer=${(root, column, data) => {
								const dateString = new Date(data.item.timestamp).toLocaleString()
								render(html`${dateString}`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange12")}"
							.renderer=${(root, column, data) => {
								if (data.item.mode === 'SOLD') return render(html`<span style="color: red"> ${translate("tradepage.tchange31")} </span>`, root)
								if (data.item.mode === 'BOUGHT') return render(html`<span style="color: green"> ${translate("tradepage.tchange32")} </span>`, root)
								return render(html`<span> ${data.item.mode} </span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange9")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
							.renderer=${(root, column, data) => {
								const price = this.round(parseFloat(data.item.foreignAmount) / parseFloat(data.item.qortAmount))
								render(html`${price}`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange8")} (QORT)" path="qortAmount"
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange10")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
							.renderer=${(root, column, data) => {
								render(html`<span> ${data.item.foreignAmount} </span>`, root)
							}}
						>
						</vaadin-grid-column>
					</vaadin-grid>
				</div>
			</div>
		</div>
        `
    }

    tradeBotBTCTemplate() {
        return html`
		<div class="trade-bot-container">
			<div class="box-bot">
				<header><span>${translate("info.inf16")} QORT ${translate("info.inf14")} ${this.listedCoins.get(this.selectedCoin).coinCode}</span></header>
				<div class="border-wrapper">
					<vaadin-grid theme="compact column-borders row-stripes wrap-cell-content" id="tradeBotBTCGrid" aria-label="Auto Buy BTC" ?hidden="${this.isEmptyArray(this.tradeBotBtcBook)}" .items="${this.tradeBotBtcBook}">
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange8")} (QORT)"
							.renderer=${(root, column, data) => {
								render(html`<span>${data.item.botBtcQortAmount}</span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange9")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
							.renderer=${(root, column, data) => {
								render(html`<span>${data.item.botBtcPrice}</span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange10")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
							.renderer=${(root, column, data) => {
								const totalCoins = this.round(parseFloat(data.item.botBtcQortAmount) * parseFloat(data.item.botBtcPrice))
								const myBotFunds = this.round(parseFloat(this.listedCoins.get(this.selectedCoin).balance))
								if (Number(myBotFunds) > Number(totalCoins)) {
									this.autoBuyBotDisable = false
									render(html`<span style="color: rgba(55, 160, 51);">${totalCoins}</span>`, root)
                                                } else {
									this.autoBuyBotDisable = true
									render(html`<span style="color: rgba(255, 89, 89);">${totalCoins}</span>`, root)
                                                }
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("nodepage.nchange11")}"
							.renderer=${(root, column, data) => {
								render(html`<mwc-button class="red" @click=${() => this.removeBTCTradebook()}><mwc-icon>delete</mwc-icon>&nbsp;${translate("nodepage.nchange12")}</mwc-button>`, root)
							}}
						>
						</vaadin-grid-column>
					</vaadin-grid>
					${this.isEmptyArray(this.tradeBotBtcBook) ? html`
						<mwc-button class="trade-bot-button" style="width: 25%;" raised @click="${() => this.addAutoBuyAction()}">
							${translate("tradepage.tchange38")} ${translate("tradepage.tchange39")}
						</mwc-button>
					`: ''}
				</div>
				${this.autoBuyBotDisable ? html`
					<div style="margin-top: 15px;">${this.renderBotWarning()}</div>
				`: ''}
			</div>
		</div>
        `
    }

    tradeBotLTCTemplate() {
        return html`
		<div class="trade-bot-container">
			<div class="box-bot">
				<header><span>${translate("info.inf16")} QORT ${translate("info.inf14")} ${this.listedCoins.get(this.selectedCoin).coinCode}</span></header>
				<div class="border-wrapper">
					<vaadin-grid theme="compact column-borders row-stripes wrap-cell-content" id="tradeBotLTCGrid" aria-label="Auto Buy LTC" ?hidden="${this.isEmptyArray(this.tradeBotLtcBook)}" .items="${this.tradeBotLtcBook}">
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange8")} (QORT)"
							.renderer=${(root, column, data) => {
								render(html`<span>${data.item.botLtcQortAmount}</span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange9")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
							.renderer=${(root, column, data) => {
								render(html`<span>${data.item.botLtcPrice}</span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange10")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
							.renderer=${(root, column, data) => {
								const totalCoins = this.round(parseFloat(data.item.botLtcQortAmount) * parseFloat(data.item.botLtcPrice))
								const myBotFunds = this.round(parseFloat(this.listedCoins.get(this.selectedCoin).balance))
								if (Number(myBotFunds) > Number(totalCoins)) {
									this.autoBuyBotDisable = false
									render(html`<span style="color: rgba(55, 160, 51);">${totalCoins}</span>`, root)
                                                } else {
									this.autoBuyBotDisable = true
									render(html`<span style="color: rgba(255, 89, 89);">${totalCoins}</span>`, root)
                                                }
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("nodepage.nchange11")}"
							.renderer=${(root, column, data) => {
								render(html`<mwc-button class="red" @click=${() => this.removeLTCTradebook()}><mwc-icon>delete</mwc-icon>&nbsp;${translate("nodepage.nchange12")}</mwc-button>`, root)
							}}
						>
						</vaadin-grid-column>
					</vaadin-grid>
					${this.isEmptyArray(this.tradeBotLtcBook) ? html`
						<mwc-button class="trade-bot-button" style="width: 25%;" raised @click="${() => this.addAutoBuyAction()}">
							${translate("tradepage.tchange38")} ${translate("tradepage.tchange39")}
						</mwc-button>
					`: ''}
				</div>
				${this.autoBuyBotDisable ? html`
					<div style="margin-top: 15px;">${this.renderBotWarning()}</div>
				`: ''}
			</div>
		</div>
        `
    }

    tradeBotDOGETemplate() {
        return html`
		<div class="trade-bot-container">
			<div class="box-bot">
				<header><span>${translate("info.inf16")} QORT ${translate("info.inf14")} ${this.listedCoins.get(this.selectedCoin).coinCode}</span></header>
				<div class="border-wrapper">
					<vaadin-grid theme="compact column-borders row-stripes wrap-cell-content" id="tradeBotDOGEGrid" aria-label="Auto Buy DOGE" ?hidden="${this.isEmptyArray(this.tradeBotDogeBook)}" .items="${this.tradeBotDogeBook}">
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange8")} (QORT)"
							.renderer=${(root, column, data) => {
								render(html`<span>${data.item.botDogeQortAmount}</span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange9")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
							.renderer=${(root, column, data) => {
								render(html`<span>${data.item.botDogePrice}</span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange10")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
							.renderer=${(root, column, data) => {
								const totalCoins = this.round(parseFloat(data.item.botDogeQortAmount) * parseFloat(data.item.botDogePrice))
								const myBotFunds = this.round(parseFloat(this.listedCoins.get(this.selectedCoin).balance))
								if (Number(myBotFunds) > Number(totalCoins)) {
									this.autoBuyBotDisable = false
									render(html`<span style="color: rgba(55, 160, 51);">${totalCoins}</span>`, root)
                                                } else {
									this.autoBuyBotDisable = true
									render(html`<span style="color: rgba(255, 89, 89);">${totalCoins}</span>`, root)
                                                }
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("nodepage.nchange11")}"
							.renderer=${(root, column, data) => {
								render(html`<mwc-button class="red" @click=${() => this.removeDOGETradebook()}><mwc-icon>delete</mwc-icon>&nbsp;${translate("nodepage.nchange12")}</mwc-button>`, root)
							}}
						>
						</vaadin-grid-column>
					</vaadin-grid>
					${this.isEmptyArray(this.tradeBotDogeBook) ? html`
						<mwc-button class="trade-bot-button" style="width: 25%;" raised @click="${() => this.addAutoBuyAction()}">
							${translate("tradepage.tchange38")} ${translate("tradepage.tchange39")}
						</mwc-button>
					`: ''}
				</div>
				${this.autoBuyBotDisable ? html`
					<div style="margin-top: 15px;">${this.renderBotWarning()}</div>
				`: ''}
			</div>
		</div>
        `
    }

    tradeBotDGBTemplate() {
        return html`
		<div class="trade-bot-container">
			<div class="box-bot">
				<header><span>${translate("info.inf16")} QORT ${translate("info.inf14")} ${this.listedCoins.get(this.selectedCoin).coinCode}</span></header>
				<div class="border-wrapper">
					<vaadin-grid theme="compact column-borders row-stripes wrap-cell-content" id="tradeBotDGBGrid" aria-label="Auto Buy DGB" ?hidden="${this.isEmptyArray(this.tradeBotDgbBook)}" .items="${this.tradeBotDgbBook}">
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange8")} (QORT)"
							.renderer=${(root, column, data) => {
								render(html`<span>${data.item.botDgbQortAmount}</span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange9")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
							.renderer=${(root, column, data) => {
								render(html`<span>${data.item.botDgbPrice}</span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange10")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
							.renderer=${(root, column, data) => {
								const totalCoins = this.round(parseFloat(data.item.botDgbQortAmount) * parseFloat(data.item.botDgbPrice))
								const myBotFunds = this.round(parseFloat(this.listedCoins.get(this.selectedCoin).balance))
								if (Number(myBotFunds) > Number(totalCoins)) {
									this.autoBuyBotDisable = false
									render(html`<span style="color: rgba(55, 160, 51);">${totalCoins}</span>`, root)
                                                } else {
									this.autoBuyBotDisable = true
									render(html`<span style="color: rgba(255, 89, 89);">${totalCoins}</span>`, root)
                                                }
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("nodepage.nchange11")}"
							.renderer=${(root, column, data) => {
								render(html`<mwc-button class="red" @click=${() => this.removeDGBTradebook()}><mwc-icon>delete</mwc-icon>&nbsp;${translate("nodepage.nchange12")}</mwc-button>`, root)
							}}
						>
						</vaadin-grid-column>
					</vaadin-grid>
					${this.isEmptyArray(this.tradeBotDgbBook) ? html`
						<mwc-button class="trade-bot-button" style="width: 25%;" raised @click="${() => this.addAutoBuyAction()}">
							${translate("tradepage.tchange38")} ${translate("tradepage.tchange39")}
						</mwc-button>
					`: ''}
				</div>
				${this.autoBuyBotDisable ? html`
					<div style="margin-top: 15px;">${this.renderBotWarning()}</div>
				`: ''}
			</div>
		</div>
        `
    }

    tradeBotRVNTemplate() {
        return html`
		<div class="trade-bot-container">
			<div class="box-bot">
				<header><span>${translate("info.inf16")} QORT ${translate("info.inf14")} ${this.listedCoins.get(this.selectedCoin).coinCode}</span></header>
				<div class="border-wrapper">
					<vaadin-grid theme="compact column-borders row-stripes wrap-cell-content" id="tradeBotRVNGrid" aria-label="Auto Buy RVN" ?hidden="${this.isEmptyArray(this.tradeBotRvnBook)}" .items="${this.tradeBotRvnBook}">
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange8")} (QORT)"
							.renderer=${(root, column, data) => {
								render(html`<span>${data.item.botRvnQortAmount}</span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange9")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
							.renderer=${(root, column, data) => {
								render(html`<span>${data.item.botRvnPrice}</span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange10")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
							.renderer=${(root, column, data) => {
								const totalCoins = this.round(parseFloat(data.item.botRvnQortAmount) * parseFloat(data.item.botRvnPrice))
								const myBotFunds = this.round(parseFloat(this.listedCoins.get(this.selectedCoin).balance))
								if (Number(myBotFunds) > Number(totalCoins)) {
									this.autoBuyBotDisable = false
									render(html`<span style="color: rgba(55, 160, 51);">${totalCoins}</span>`, root)
                                                } else {
									this.autoBuyBotDisable = true
									render(html`<span style="color: rgba(255, 89, 89);">${totalCoins}</span>`, root)
                                                }
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("nodepage.nchange11")}"
							.renderer=${(root, column, data) => {
								render(html`<mwc-button class="red" @click=${() => this.removeRVNTradebook()}><mwc-icon>delete</mwc-icon>&nbsp;${translate("nodepage.nchange12")}</mwc-button>`, root)
							}}
						>
						</vaadin-grid-column>
					</vaadin-grid>
					${this.isEmptyArray(this.tradeBotRvnBook) ? html`
						<mwc-button class="trade-bot-button" style="width: 25%;" raised @click="${() => this.addAutoBuyAction()}">
							${translate("tradepage.tchange38")} ${translate("tradepage.tchange39")}
						</mwc-button>
					`: ''}
				</div>
				${this.autoBuyBotDisable ? html`
					<div style="margin-top: 15px;">${this.renderBotWarning()}</div>
				`: ''}
			</div>
		</div>
        `
    }

    tradeBotARRRTemplate() {
        return html`
		<div class="trade-bot-container">
			<div class="box-bot">
				<header><span>${translate("info.inf16")} QORT ${translate("info.inf14")} ${this.listedCoins.get(this.selectedCoin).coinCode}</span></header>
				<div class="border-wrapper">
					<vaadin-grid theme="compact column-borders row-stripes wrap-cell-content" id="tradeBotARRRGrid" aria-label="Auto Buy ARRR" ?hidden="${this.isEmptyArray(this.tradeBotArrrBook)}" .items="${this.tradeBotArrrBook}">
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange8")} (QORT)"
							.renderer=${(root, column, data) => {
								render(html`<span>${data.item.botArrrQortAmount}</span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange9")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
							.renderer=${(root, column, data) => {
								render(html`<span>${data.item.botArrrPrice}</span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange10")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
							.renderer=${(root, column, data) => {
								const totalCoins = this.round(parseFloat(data.item.botArrrQortAmount) * parseFloat(data.item.botArrrPrice))
								const myBotFunds = this.round(parseFloat(this.listedCoins.get(this.selectedCoin).balance))
								if (Number(myBotFunds) > Number(totalCoins)) {
									this.autoBuyBotDisable = false
									render(html`<span style="color: rgba(55, 160, 51);">${totalCoins}</span>`, root)
                                                } else {
									this.autoBuyBotDisable = true
									render(html`<span style="color: rgba(255, 89, 89);">${totalCoins}</span>`, root)
                                                }
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("nodepage.nchange11")}"
							.renderer=${(root, column, data) => {
								render(html`<mwc-button class="red" @click=${() => this.removeARRRTradebook()}><mwc-icon>delete</mwc-icon>&nbsp;${translate("nodepage.nchange12")}</mwc-button>`, root)
							}}
						>
						</vaadin-grid-column>
					</vaadin-grid>
					${this.isEmptyArray(this.tradeBotArrrBook) ? html`
						<mwc-button class="trade-bot-button" style="width: 25%;" raised @click="${() => this.addAutoBuyAction()}">
							${translate("tradepage.tchange38")} ${translate("tradepage.tchange39")}
						</mwc-button>
					`: ''}
				</div>
				${this.autoBuyBotDisable ? html`
					<div style="margin-top: 15px;">${this.renderBotWarning()}</div>
				`: ''}
			</div>
		</div>
        `
    }

    render() {
        return html`
		<div id="trade-portal-page">
			<div id="trade-bot-portal">
			<div></div>
			<div style="min-height: 50px; display: flex; padding-bottom: 10px; padding-top: 10px; margin: auto;">
				<h2 style="margin: 0 0 15px 0; line-height: 50px; display: inline;">${translate("info.inf13")} QORT ${translate("info.inf14")} ${this.listedCoins.get(this.selectedCoin).coinCode} - &nbsp;</h2>
				<mwc-select outlined id="coinSelectionMenu" label="${translate("tradepage.tchange2")}">
					<mwc-list-item value="BITCOIN"><span class="coinName btc" style="color: var(--black);">BTC / QORT</span></mwc-list-item>
					<mwc-list-item value="LITECOIN" selected><span class="coinName ltc" style="color: var(--black);">LTC / QORT</span></mwc-list-item>
					<mwc-list-item value="DOGECOIN"><span class="coinName doge" style="color: var(--black);">DOGE / QORT</span></mwc-list-item>
					<mwc-list-item value="DIGIBYTE"><span class="coinName dgb" style="color: var(--black);">DGB / QORT</span></mwc-list-item>
					<mwc-list-item value="RAVENCOIN"><span class="coinName rvn" style="color: var(--black);">RVN / QORT</span></mwc-list-item>
                                       <mwc-list-item value="PIRATECHAIN"><span class="coinName arrr" style="color: var(--black);">ARRR / QORT</span></mwc-list-item>
				</mwc-select>
                                <div style="padding-left: 20px; padding-top: 5px;">
			            <mwc-fab mini icon="info" title="${translate("info.inf7")}" @click=${() => this.shadowRoot.getElementById('buyInfoDialog').open()}></mwc-fab>
			        </div>
                                <div style="padding-left: 10px; padding-top: 12px; color: var(--black);">
                                   ${this.renderAutoLockButton()}
			        </div>
			</div>
			<div></div>
			</div>
			<div id="trade-portal">
				<div id="first-trade-section">
                              <div></div>
					${this.openTradesTemplate()}
                              <div></div>
				</div>
				<div id="second-trade-section">
                              <div></div>
					${this.myDoneTradesTemplate()}
                              <div></div>
				</div>
				<div id="third-trade-section">
                              <div></div>
					${this.myOpenOrdersTemplate()}
                              <div></div>
				</div>
				<div id="fourth-trade-section">
                              <div></div>
					${this.showAutoBuyGrid()}
                              <div></div>
				</div>
				<div style="text-align: center;">
					<h2 style="color: var(--black);">${translate("tradepage.tchange33")} ${this.listedCoins.get(this.selectedCoin).coinCode} ${translate("tradepage.tchange40")}</h2>
					<h3 style="color: var(--black);">1 <span style="color: #03a9f4;">QORT</span> = ${this.exchangeRateQort()} ${this.listedCoins.get(this.selectedCoin).coinCode}</h3>
				</div>
			</div>
		</div>

		<mwc-dialog style="background: var(--white);" id="tradeBotBTCAddDialog">
			<div class="trade-bot-container" style="display:${this.showGetWalletBance ? 'inline' : 'none'}">
                      <h2 style="color: var(--black);">${this.renderFetchText()} <paper-spinner-lite active></paper-spinner-lite></h2>
                  </div>
			<div class="card-bot" style="display:${this.showAddAutoBuy ? 'flex' : 'none'}">
				<div style="text-align: center;">
					<h1>${this.listedCoins.get(this.selectedCoin).coinCode} ==> QORT</h1>
					<hr>
				</div>
				<div style="display: inline;">
                              <div style="display:${this.autoBuyWarning ? 'inline' : 'none'}">${this.renderWarning()}</div>
					<mwc-icon-button class="btn-clear-bot" title="${translate("tradepage.tchange15")}" icon="clear_all" @click="${() => this.clearTradeBotForm()}"></mwc-icon-button>
				</div>
				<span class="tab-text">${translate("tradepage.tchange8")} (QORT)*</span>
				<p>
					<mwc-textfield
						style="width: 100%; color: var(--black);"
						id="autoBuyBTCQortAmountInput"
						required
						label=""
						placeholder="0.0000000"
						type="number"
						@input="${(e) => { this.checkTradeBotAmount(e) }}"
						auto-validate="false"
						outlined
						value="${this.initialAmount}"
					>
					</mwc-textfield>
				</p>
				<span class="tab-text">${translate("tradepage.tchange14")} (${this.listedCoins.get(this.selectedCoin).coinCode})*</span>
				<p>
					<mwc-textfield
						style="width: 100%; color: var(--black);"
						id="autoBuyBTCPriceInput"
						required
						label=""
						placeholder="0.00000000"
						type="number"
						@input="${(e) => { this.checkTradeBotAmount(e) }}"
						auto-validate="false"
						outlined
						value="${this.initialAmount}"
					>
					</mwc-textfield>
				</p>
				<span class="tab-text">${translate("tradepage.tchange10")} (${this.listedCoins.get(this.selectedCoin).coinCode})*</span>
				<p>
					<mwc-textfield
						style="width: 100%; color: var(--black);"
						id="autoBuyBTCTotalInput"
						required
						label=""
						placeholder="0.0000000"
						type="number"
						@input="${(e) => { this.checkTradeBotTotalAmount(e) }}"
						auto-validate="false"
						outlined
						value="${this.initialAmount}"
					>
					</mwc-textfield>
				</p>
				<span class="amt-text">
					<span class="balance-text">${translate("tradepage.tchange16")}: ${this.listedCoins.get(this.selectedCoin).balance} ${this.listedCoins.get(this.selectedCoin).coinCode}</span>
				</span>
				<div class="buttons">
					<div>
						<mwc-button class="buy-button" ?disabled="${this.autoBuyBtnDisable}" style="width:100%;" raised @click="${() => this.checkTradeBotValues()}">
							${translate("tradepage.tchange38")} ${this.listedCoins.get(this.selectedCoin).coinCode} ${translate("tradepage.tchange39")}
						</mwc-button>
					</div>
				</div>
			</div>
			<mwc-button slot="primaryAction" dialogAction="cancel" class="cancel">${translate("general.close")}</mwc-button>
		</mwc-dialog>

		<mwc-dialog style="background: var(--white);" id="tradeBotLTCAddDialog">
			<div class="trade-bot-container" style="display:${this.showGetWalletBance ? 'inline' : 'none'}">
                      <h2 style="color: var(--black);">${this.renderFetchText()} <paper-spinner-lite active></paper-spinner-lite></h2>
                  </div>
			<div class="card-bot" style="display:${this.showAddAutoBuy ? 'flex' : 'none'}">
				<div style="text-align: center;">
					<h1>${this.listedCoins.get(this.selectedCoin).coinCode} ==> QORT</h1>
					<hr>
				</div>
				<div style="display: inline;">
                              <div style="display:${this.autoBuyWarning ? 'inline' : 'none'}">${this.renderWarning()}</div>
					<mwc-icon-button class="btn-clear-bot" title="${translate("tradepage.tchange15")}" icon="clear_all" @click="${() => this.clearTradeBotForm()}"></mwc-icon-button>
				</div>
				<span class="tab-text">${translate("tradepage.tchange8")} (QORT)*</span>
				<p>
					<mwc-textfield
						style="width: 100%; color: var(--black);"
						id="autoBuyLTCQortAmountInput"
						required
						label=""
						placeholder="0.0000000"
						type="number"
						@input="${(e) => { this.checkTradeBotAmount(e) }}"
						auto-validate="false"
						outlined
						value="${this.initialAmount}"
					>
					</mwc-textfield>
				</p>
				<span class="tab-text">${translate("tradepage.tchange14")} (${this.listedCoins.get(this.selectedCoin).coinCode})*</span>
				<p>
					<mwc-textfield
						style="width: 100%; color: var(--black);"
						id="autoBuyLTCPriceInput"
						required
						label=""
						placeholder="0.00000000"
						type="number"
						@input="${(e) => { this.checkTradeBotAmount(e) }}"
						auto-validate="false"
						outlined
						value="${this.initialAmount}"
					>
					</mwc-textfield>
				</p>
				<span class="tab-text">${translate("tradepage.tchange10")} (${this.listedCoins.get(this.selectedCoin).coinCode})*</span>
				<p>
					<mwc-textfield
						style="width: 100%; color: var(--black);"
						id="autoBuyLTCTotalInput"
						required
						label=""
						placeholder="0.0000000"
						type="number"
						@input="${(e) => { this.checkTradeBotTotalAmount(e) }}"
						auto-validate="false"
						outlined
						value="${this.initialAmount}"
					>
					</mwc-textfield>
				</p>
				<span class="amt-text">
					<span class="balance-text">${translate("tradepage.tchange16")}: ${this.listedCoins.get(this.selectedCoin).balance} ${this.listedCoins.get(this.selectedCoin).coinCode}</span>
				</span>
				<div class="buttons">
					<div>
						<mwc-button class="buy-button" ?disabled="${this.autoBuyBtnDisable}" style="width:100%;" raised @click="${() => this.checkTradeBotValues()}">
							${translate("tradepage.tchange38")} ${this.listedCoins.get(this.selectedCoin).coinCode} ${translate("tradepage.tchange39")}
						</mwc-button>
					</div>
				</div>
			</div>
			<mwc-button slot="primaryAction" dialogAction="cancel" class="cancel">${translate("general.close")}</mwc-button>
		</mwc-dialog>

		<mwc-dialog style="background: var(--white);" id="tradeBotDOGEAddDialog">
			<div class="trade-bot-container" style="display:${this.showGetWalletBance ? 'inline' : 'none'}">
                      <h2 style="color: var(--black);">${this.renderFetchText()} <paper-spinner-lite active></paper-spinner-lite></h2>
                  </div>
			<div class="card-bot" style="display:${this.showAddAutoBuy ? 'flex' : 'none'}">
				<div style="text-align: center;">
					<h1>${this.listedCoins.get(this.selectedCoin).coinCode} ==> QORT</h1>
					<hr>
				</div>
				<div style="display: inline;">
                              <div style="display:${this.autoBuyWarning ? 'inline' : 'none'}">${this.renderWarning()}</div>
					<mwc-icon-button class="btn-clear-bot" title="${translate("tradepage.tchange15")}" icon="clear_all" @click="${() => this.clearTradeBotForm()}"></mwc-icon-button>
				</div>
				<span class="tab-text">${translate("tradepage.tchange8")} (QORT)*</span>
				<p>
					<mwc-textfield
						style="width: 100%; color: var(--black);"
						id="autoBuyDOGEQortAmountInput"
						required
						label=""
						placeholder="0.0000000"
						type="number"
						@input="${(e) => { this.checkTradeBotAmount(e) }}"
						auto-validate="false"
						outlined
						value="${this.initialAmount}"
					>
					</mwc-textfield>
				</p>
				<span class="tab-text">${translate("tradepage.tchange14")} (${this.listedCoins.get(this.selectedCoin).coinCode})*</span>
				<p>
					<mwc-textfield
						style="width: 100%; color: var(--black);"
						id="autoBuyDOGEPriceInput"
						required
						label=""
						placeholder="0.00000000"
						type="number"
						@input="${(e) => { this.checkTradeBotAmount(e) }}"
						auto-validate="false"
						outlined
						value="${this.initialAmount}"
					>
					</mwc-textfield>
				</p>
				<span class="tab-text">${translate("tradepage.tchange10")} (${this.listedCoins.get(this.selectedCoin).coinCode})*</span>
				<p>
					<mwc-textfield
						style="width: 100%; color: var(--black);"
						id="autoBuyDOGETotalInput"
						required
						label=""
						placeholder="0.0000000"
						type="number"
						@input="${(e) => { this.checkTradeBotTotalAmount(e) }}"
						auto-validate="false"
						outlined
						value="${this.initialAmount}"
					>
					</mwc-textfield>
				</p>
				<span class="amt-text">
					<span class="balance-text">${translate("tradepage.tchange16")}: ${this.listedCoins.get(this.selectedCoin).balance} ${this.listedCoins.get(this.selectedCoin).coinCode}</span>
				</span>
				<div class="buttons">
					<div>
						<mwc-button class="buy-button" ?disabled="${this.autoBuyBtnDisable}" style="width:100%;" raised @click="${() => this.checkTradeBotValues()}">
							${translate("tradepage.tchange38")} ${this.listedCoins.get(this.selectedCoin).coinCode} ${translate("tradepage.tchange39")}
						</mwc-button>
					</div>
				</div>
			</div>
			<mwc-button slot="primaryAction" dialogAction="cancel" class="cancel">${translate("general.close")}</mwc-button>
		</mwc-dialog>

		<mwc-dialog style="background: var(--white);" id="tradeBotDGBAddDialog">
			<div class="trade-bot-container" style="display:${this.showGetWalletBance ? 'inline' : 'none'}">
                      <h2 style="color: var(--black);">${this.renderFetchText()} <paper-spinner-lite active></paper-spinner-lite></h2>
                  </div>
			<div class="card-bot" style="display:${this.showAddAutoBuy ? 'flex' : 'none'}">
				<div style="text-align: center;">
					<h1>${this.listedCoins.get(this.selectedCoin).coinCode} ==> QORT</h1>
					<hr>
				</div>
				<div style="display: inline;">
                              <div style="display:${this.autoBuyWarning ? 'inline' : 'none'}">${this.renderWarning()}</div>
					<mwc-icon-button class="btn-clear-bot" title="${translate("tradepage.tchange15")}" icon="clear_all" @click="${() => this.clearTradeBotForm()}"></mwc-icon-button>
				</div>
				<span class="tab-text">${translate("tradepage.tchange8")} (QORT)*</span>
				<p>
					<mwc-textfield
						style="width: 100%; color: var(--black);"
						id="autoBuyDGBQortAmountInput"
						required
						label=""
						placeholder="0.0000000"
						type="number"
						@input="${(e) => { this.checkTradeBotAmount(e) }}"
						auto-validate="false"
						outlined
						value="${this.initialAmount}"
					>
					</mwc-textfield>
				</p>
				<span class="tab-text">${translate("tradepage.tchange14")} (${this.listedCoins.get(this.selectedCoin).coinCode})*</span>
				<p>
					<mwc-textfield
						style="width: 100%; color: var(--black);"
						id="autoBuyDGBPriceInput"
						required
						label=""
						placeholder="0.00000000"
						type="number"
						@input="${(e) => { this.checkTradeBotAmount(e) }}"
						auto-validate="false"
						outlined
						value="${this.initialAmount}"
					>
					</mwc-textfield>
				</p>
				<span class="tab-text">${translate("tradepage.tchange10")} (${this.listedCoins.get(this.selectedCoin).coinCode})*</span>
				<p>
					<mwc-textfield
						style="width: 100%; color: var(--black);"
						id="autoBuyDGBTotalInput"
						required
						label=""
						placeholder="0.0000000"
						type="number"
						@input="${(e) => { this.checkTradeBotTotalAmount(e) }}"
						auto-validate="false"
						outlined
						value="${this.initialAmount}"
					>
					</mwc-textfield>
				</p>
				<span class="amt-text">
					<span class="balance-text">${translate("tradepage.tchange16")}: ${this.listedCoins.get(this.selectedCoin).balance} ${this.listedCoins.get(this.selectedCoin).coinCode}</span>
				</span>
				<div class="buttons">
					<div>
						<mwc-button class="buy-button" ?disabled="${this.autoBuyBtnDisable}" style="width:100%;" raised @click="${() => this.checkTradeBotValues()}">
							${translate("tradepage.tchange38")} ${this.listedCoins.get(this.selectedCoin).coinCode} ${translate("tradepage.tchange39")}
						</mwc-button>
					</div>
				</div>
			</div>
			<mwc-button slot="primaryAction" dialogAction="cancel" class="cancel">${translate("general.close")}</mwc-button>
		</mwc-dialog>

		<mwc-dialog style="background: var(--white);" id="tradeBotRVNAddDialog">
			<div class="trade-bot-container" style="display:${this.showGetWalletBance ? 'inline' : 'none'}">
                      <h2 style="color: var(--black);">${this.renderFetchText()} <paper-spinner-lite active></paper-spinner-lite></h2>
                  </div>
			<div class="card-bot" style="display:${this.showAddAutoBuy ? 'flex' : 'none'}">
				<div style="text-align: center;">
					<h1>${this.listedCoins.get(this.selectedCoin).coinCode} ==> QORT</h1>
					<hr>
				</div>
				<div style="display: inline;">
                              <div style="display:${this.autoBuyWarning ? 'inline' : 'none'}">${this.renderWarning()}</div>
					<mwc-icon-button class="btn-clear-bot" title="${translate("tradepage.tchange15")}" icon="clear_all" @click="${() => this.clearTradeBotForm()}"></mwc-icon-button>
				</div>
				<span class="tab-text">${translate("tradepage.tchange8")} (QORT)*</span>
				<p>
					<mwc-textfield
						style="width: 100%; color: var(--black);"
						id="autoBuyRVNQortAmountInput"
						required
						label=""
						placeholder="0.0000000"
						type="number"
						@input="${(e) => { this.checkTradeBotAmount(e) }}"
						auto-validate="false"
						outlined
						value="${this.initialAmount}"
					>
					</mwc-textfield>
				</p>
				<span class="tab-text">${translate("tradepage.tchange14")} (${this.listedCoins.get(this.selectedCoin).coinCode})*</span>
				<p>
					<mwc-textfield
						style="width: 100%; color: var(--black);"
						id="autoBuyRVNPriceInput"
						required
						label=""
						placeholder="0.00000000"
						type="number"
						@input="${(e) => { this.checkTradeBotAmount(e) }}"
						auto-validate="false"
						outlined
						value="${this.initialAmount}"
					>
					</mwc-textfield>
				</p>
				<span class="tab-text">${translate("tradepage.tchange10")} (${this.listedCoins.get(this.selectedCoin).coinCode})*</span>
				<p>
					<mwc-textfield
						style="width: 100%; color: var(--black);"
						id="autoBuyRVNTotalInput"
						required
						label=""
						placeholder="0.0000000"
						type="number"
						@input="${(e) => { this.checkTradeBotTotalAmount(e) }}"
						auto-validate="false"
						outlined
						value="${this.initialAmount}"
					>
					</mwc-textfield>
				</p>
				<span class="amt-text">
					<span class="balance-text">${translate("tradepage.tchange16")}: ${this.listedCoins.get(this.selectedCoin).balance} ${this.listedCoins.get(this.selectedCoin).coinCode}</span>
				</span>
				<div class="buttons">
					<div>
						<mwc-button class="buy-button" ?disabled="${this.autoBuyBtnDisable}" style="width:100%;" raised @click="${() => this.checkTradeBotValues()}">
							${translate("tradepage.tchange38")} ${this.listedCoins.get(this.selectedCoin).coinCode} ${translate("tradepage.tchange39")}
						</mwc-button>
					</div>
				</div>
			</div>
			<mwc-button slot="primaryAction" dialogAction="cancel" class="cancel">${translate("general.close")}</mwc-button>
		</mwc-dialog>

		<mwc-dialog style="background: var(--white);" id="tradeBotARRRAddDialog">
			<div class="trade-bot-container" style="display:${this.showGetWalletBance ? 'inline' : 'none'}">
                      <h2 style="color: var(--black);">${this.renderFetchText()} <paper-spinner-lite active></paper-spinner-lite></h2>
                  </div>
			<div class="card-bot" style="display:${this.showAddAutoBuy ? 'flex' : 'none'}">
				<div style="text-align: center;">
					<h1>${this.listedCoins.get(this.selectedCoin).coinCode} ==> QORT</h1>
					<hr>
				</div>
				<div style="display: inline;">
                              <div style="display:${this.autoBuyWarning ? 'inline' : 'none'}">${this.renderWarning()}</div>
					<mwc-icon-button class="btn-clear-bot" title="${translate("tradepage.tchange15")}" icon="clear_all" @click="${() => this.clearTradeBotForm()}"></mwc-icon-button>
				</div>
				<span class="tab-text">${translate("tradepage.tchange8")} (QORT)*</span>
				<p>
					<mwc-textfield
						style="width: 100%; color: var(--black);"
						id="autoBuyARRRQortAmountInput"
						required
						label=""
						placeholder="0.0000000"
						type="number"
						@input="${(e) => { this.checkTradeBotAmount(e) }}"
						auto-validate="false"
						outlined
						value="${this.initialAmount}"
					>
					</mwc-textfield>
				</p>
				<span class="tab-text">${translate("tradepage.tchange14")} (${this.listedCoins.get(this.selectedCoin).coinCode})*</span>
				<p>
					<mwc-textfield
						style="width: 100%; color: var(--black);"
						id="autoBuyARRRPriceInput"
						required
						label=""
						placeholder="0.00000000"
						type="number"
						@input="${(e) => { this.checkTradeBotAmount(e) }}"
						auto-validate="false"
						outlined
						value="${this.initialAmount}"
					>
					</mwc-textfield>
				</p>
				<span class="tab-text">${translate("tradepage.tchange10")} (${this.listedCoins.get(this.selectedCoin).coinCode})*</span>
				<p>
					<mwc-textfield
						style="width: 100%; color: var(--black);"
						id="autoBuyARRRTotalInput"
						required
						label=""
						placeholder="0.0000000"
						type="number"
						@input="${(e) => { this.checkTradeBotTotalAmount(e) }}"
						auto-validate="false"
						outlined
						value="${this.initialAmount}"
					>
					</mwc-textfield>
				</p>
				<span class="amt-text">
					<span class="balance-text">${translate("tradepage.tchange16")}: ${this.listedCoins.get(this.selectedCoin).balance} ${this.listedCoins.get(this.selectedCoin).coinCode}</span>
				</span>
				<div class="buttons">
					<div>
						<mwc-button class="buy-button" ?disabled="${this.autoBuyBtnDisable}" style="width:100%;" raised @click="${() => this.checkTradeBotValues()}">
							${translate("tradepage.tchange38")} ${this.listedCoins.get(this.selectedCoin).coinCode} ${translate("tradepage.tchange39")}
						</mwc-button>
					</div>
				</div>
			</div>
			<mwc-button slot="primaryAction" dialogAction="cancel" class="cancel">${translate("general.close")}</mwc-button>
		</mwc-dialog>

            <paper-dialog id="buyInfoDialog" class="info" modal>
                <div class="actions">
                    <h3></h3>
                    <mwc-icon class="close-icon" @click=${() => this.shadowRoot.getElementById('buyInfoDialog').close()} title="${translate("info.inf8")}">highlight_off</mwc-icon>
                </div>
                <div class="container">
                    <h1 style="color: #03a9f4;">${translate("info.inf7")}</h1>
                    <h2>${translate("info.inf9")}</h2>
                    <h2>${translate("info.inf10")}</h2>
                    <h2>${translate("info.inf11")}</h2>
                    <h2>${translate("info.inf12")}</h2>
                </div>
            </paper-dialog>
            <paper-dialog class="setpass-wrapper" id="setAutoLockScreenPass" modal>
                <div style="text-align: center;">
                    <h2 style="color: var(--black);">Qortal ${translate("tabmenu.tm6")} ${translate("login.lp1")}</h2>
                    <hr>
                </div>
                <div style="text-align: center;">
                    <h3 style="color: var(--black);">${translate("login.lp2")}</h3>
                    <h4 style="color: var(--black);">${translate("login.lp3")}</h4>
                </div>
                <div style="display:flex;">
                    <mwc-icon style="padding: 10px; padding-left: 0; padding-top: 42px; color: var(--black);">password</mwc-icon>
                    <vaadin-password-field style="width: 100%;" label="${translate("login.password")}" id="autoLockPassword" autofocus></vaadin-password-field>
                </div>
                <div style="display:flex;">
                    <mwc-icon style="padding: 10px; padding-left: 0; padding-top: 42px; color: var(--black);">password</mwc-icon>
                    <vaadin-password-field style="width: 100%;" label="${translate("login.confirmpass")}" id="autoLockPasswordConfirm"></vaadin-password-field>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <mwc-button class="red" @click="${() => this.closewAutoSetScreenLockPass()}">${translate("login.lp4")}</mwc-button>
                    <mwc-button @click="${() => this.autoCheckPass()}">${translate("login.lp5")}</mwc-button>
                </div>
            </paper-dialog>
            <paper-dialog class="setpass-wrapper" id="autoExtraConfirmPass" modal>
                <div style="text-align: center;">
                    <h2 style="color: var(--black);">Qortal ${translate("tabmenu.tm6")} ${translate("login.lp1")}</h2>
                    <hr>
                </div>
                <div style="text-align: center;">
                    <h3 style="color: var(--black);">${translate("login.lessthen8")}</h3>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <mwc-button class="red" @click="${() => this.closAutoExtraConfirmPass()}">${translate("login.lp4")}</mwc-button>
                    <mwc-button @click="${() => this.setAutoNewScreenPass()}">${translate("login.lp5")}</mwc-button>
                </div>
            </paper-dialog>
            <paper-dialog class="lock-wrapper" id="autoLockScreenActive" modal>
                <div class="text-wrapper">
                    <span class="lock-title-white">${translate("tradepage.tchange46")}</span><br/>
                    <span class="lock-title-white">${translate("login.lp9")} </span>
                    <span class="lock-title-red">${translate("login.lp10")}</span>
                </div>
                <div style="display:flex; margin-top: 5px;">
                    <mwc-icon style="padding: 10px; padding-left: 0; padding-top: 42px; color: var(--black);">password</mwc-icon>
                    <vaadin-password-field style="width: 45%;" label="${translate("login.password")}" id="autoUnlockPassword" @keydown="${this.autoPassKeyListener}" autofocus>
                        <div slot="helper">
                            ${this.autoHelperMessage}
                        </div>
                    </vaadin-password-field>
                </div>
                <div style="display: flex; margin-top: 35px;">
                    <mwc-button dense unelevated label="${translate("login.lp7")}" icon="lock_open" @click="${() => this.closeAutoLockScreenActive()}"></mwc-button>
                </div>
            </paper-dialog>
        `
    }

    async firstUpdated() {
        let _this = this

        this.changeTheme()
        this.changeLanguage()
        await this.tradeFee()
        await this.getNewBlockedTrades()

        this.autoHelperMessage = this.renderAutoHelperPass()

        this.autoSalt = ''
        this.autoSalt = Base58.encode(window.parent.reduxStore.getState().app.wallet._addresses[0].keyPair.privateKey)

        this.autoStorageData = ''
        this.autoStorageData = window.parent.reduxStore.getState().app.selectedAddress.address

        this.autoLockScreenPass = ''
        this.autoLockScreenPass = 'autoLockScreenPass-' + this.autoStorageData

        this.autoLockScreenSet = ''
        this.autoLockScreenSet = 'autoLockScreenSet-' + this.autoStorageData

        this.autoLockPass = ''
        this.autoLockPass = encryptData(false, this.autoSalt)

        this.autoLockSet = ''
        this.autoLockSet = encryptData(false, this.autoSalt)

        if (localStorage.getItem(this.autoLockScreenPass) === null && localStorage.getItem(this.autoLockScreenSet) === null) {
            localStorage.setItem(this.autoLockScreenPass, this.autoLockPass)
            localStorage.setItem(this.autoLockScreenSet, this.autoLockSet)
            this.myAutoLockScreenPass = ''
            this.myAutoLockScreenPass = decryptData(localStorage.getItem(this.autoLockScreenPass), this.autoSalt)
            this.myAutoLockScreenSet = ''
            this.myAutoLockScreenSet = decryptData(localStorage.getItem(this.autoLockScreenSet), this.autoSalt)
        } else {
            this.myAutoLockScreenPass = ''
            this.myAutoLockScreenPass = decryptData(localStorage.getItem(this.autoLockScreenPass), this.autoSalt)
            this.myAutoLockScreenSet = ''
            this.myAutoLockScreenSet = decryptData(localStorage.getItem(this.autoLockScreenSet), this.autoSalt)
        }

        if (this.myAutoLockScreenSet === true) {
            this.shadowRoot.getElementById('autoLockScreenActive').open()
        }

        await this.updateWalletBalance()
        await this.fetchWalletAddress(this.selectedCoin)
        this.blockedTradesList = JSON.parse(localStorage.getItem('failedTrades') || '[]')
        this._openOrdersGrid = this.shadowRoot.getElementById('openOrdersGrid')

        this._openOrdersGrid.querySelector('#priceColumn').headerRenderer = function (root) {
            const priceString = get("tradepage.tchange9")
            root.innerHTML = '<vaadin-grid-sorter path="price" direction="asc">' + priceString + ' (' + _this.listedCoins.get(_this.selectedCoin).coinCode + ')</vaadin-grid-sorter>'
        }

        this._openOrdersGrid.querySelector('#qortAmountColumn').headerRenderer = function (root) {
            const amountString = get("tradepage.tchange8")
            root.innerHTML = '<vaadin-grid-sorter path="qortAmount">' + amountString + ' (QORT)</vaadin-grid-sorter>'
        }

        this._myOrdersGrid = this.shadowRoot.getElementById('myOrdersGrid')

        const getQortBtcPrice = () => {
            parentEpml.request("apiCall", { url: `/crosschain/price/BITCOIN?inverse=true` }).then((res) => {
                setTimeout(() => { this.qortbtc = (Number(res) / 1e8).toFixed(8) }, 1)
            })
            setTimeout(getQortBtcPrice, 300000)
        }

        const getQortLtcPrice = () => {
            parentEpml.request("apiCall", { url: `/crosschain/price/LITECOIN?inverse=true` }).then((res) => {
                setTimeout(() => { this.qortltc = (Number(res) / 1e8).toFixed(8) }, 1)
            })
            setTimeout(getQortLtcPrice, 300000)
        }

        const getQortDogePrice = () => {
            parentEpml.request("apiCall", { url: `/crosschain/price/DOGECOIN?inverse=true` }).then((res) => {
                setTimeout(() => { this.qortdoge = (Number(res) / 1e8).toFixed(8) }, 1)
            })
            setTimeout(getQortDogePrice, 300000)
        }

        const getQortDgbPrice = () => {
            parentEpml.request("apiCall", { url: `/crosschain/price/DIGIBYTE?inverse=true` }).then((res) => {
                setTimeout(() => { this.qortdgb = (Number(res) / 1e8).toFixed(8) }, 1)
            })
            setTimeout(getQortDgbPrice, 300000)
        }

        const getQortRvnPrice = () => {
            parentEpml.request("apiCall", { url: `/crosschain/price/RAVENCOIN?inverse=true` }).then((res) => {
                setTimeout(() => { this.qortrvn = (Number(res) / 1e8).toFixed(8) }, 1)
            })
            setTimeout(getQortRvnPrice, 300000)
        }

        const getQortArrrPrice = () => {
            parentEpml.request("apiCall", { url: `/crosschain/price/PIRATECHAIN?inverse=true` }).then((res) => {
                setTimeout(() => { this.qortarrr = (Number(res) / 1e8).toFixed(8) }, 1)
            })
            setTimeout(getQortArrrPrice, 300000)
        }

        window.addEventListener('storage', () => {
            this.blockedTradesList = JSON.parse(localStorage.getItem('failedTrades') || '[]')
            this.tradeBotBtcBook = JSON.parse(localStorage.getItem(this.btcWallet) || "[]")
            this.tradeBotLtcBook = JSON.parse(localStorage.getItem(this.ltcWallet) || "[]")
            this.tradeBotDogeBook = JSON.parse(localStorage.getItem(this.dogeWallet) || "[]")
            this.tradeBotDgbBook = JSON.parse(localStorage.getItem(this.dgbWallet) || "[]")
            this.tradeBotRvnBook = JSON.parse(localStorage.getItem(this.rvnWallet) || "[]")
            this.tradeBotArrrBook = JSON.parse(localStorage.getItem(this.arrrWallet) || "[]")
            const checkLanguage = localStorage.getItem('qortalLanguage')
            const checkTheme = localStorage.getItem('qortalTheme')

            use(checkLanguage)

            this.theme = (checkTheme) ? checkTheme : 'light'
            document.querySelector('html').setAttribute('theme', this.theme)
        })

        if (!isElectron()) {
        } else {
            window.addEventListener('contextmenu', (event) => {
                event.preventDefault()
                window.parent.electronAPI.showMyMenu()
            })
        }

        this.btcWallet = window.parent.reduxStore.getState().app.selectedAddress.btcWallet.address
        this.ltcWallet = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet.address
        this.dogeWallet = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet.address
        this.dgbWallet = window.parent.reduxStore.getState().app.selectedAddress.dgbWallet.address
        this.rvnWallet = window.parent.reduxStore.getState().app.selectedAddress.rvnWallet.address
        this.arrrWallet = window.parent.reduxStore.getState().app.selectedAddress.arrrWallet.address

        let configLoaded = false

        parentEpml.ready().then(() => {
            parentEpml.subscribe('selected_address', async (selectedAddress) => {
                this.selectedAddress = {}
                selectedAddress = JSON.parse(selectedAddress)
                if (!selectedAddress || Object.entries(selectedAddress).length === 0) return
                this.selectedAddress = selectedAddress

                this.btcWallet = window.parent.reduxStore.getState().app.selectedAddress.btcWallet.address
                this.ltcWwallet = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet.address
                this.dogeWallet = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet.address
                this.dgbWallet = window.parent.reduxStore.getState().app.selectedAddress.dgbWallet.address
                this.rvnWallet = window.parent.reduxStore.getState().app.selectedAddress.rvnWallet.address
                this.arrrWallet = window.parent.reduxStore.getState().app.selectedAddress.arrrWallet.address

                this.updateAccountBalance()
            })

            parentEpml.subscribe('config', (c) => {
                if (!configLoaded) {
                    setTimeout(getQortBtcPrice, 1)
                    setTimeout(getQortLtcPrice, 1)
                    setTimeout(getQortDogePrice, 1)
                    setTimeout(getQortDgbPrice, 1)
                    setTimeout(getQortRvnPrice, 1)
                    setTimeout(getQortArrrPrice, 1)
                    configLoaded = true
                }
                this.config = JSON.parse(c)
            })

            let coinSelectionMenu = this.shadowRoot.getElementById("coinSelectionMenu")

            coinSelectionMenu.addEventListener('change', function () {
                _this.setForeignCoin(coinSelectionMenu.value,false)
            })

            _this.setForeignCoin(coinSelectionMenu.value,true)
        })
        parentEpml.imReady()
        this.btcTradebook()
        this.ltcTradebook()
        this.dogeTradebook()
        this.dgbTradebook()
        this.rvnTradebook()
        this.arrrTradebook()
        this.clearConsole()
        setInterval(() => {
            this.clearConsole()
        }, 60000)
        setInterval(() => {
            this.getNewBlockedTrades()
        }, 300000)
    }

    clearConsole() {
        if (!isElectron()) {
        } else {
            console.clear()
            window.parent.electronAPI.clearCache()
        }
    }

    renderAutoLockButton() {
        if (this.myAutoLockScreenPass === false && this.myAutoLockScreenSet === false) {
            return html`
                <div style="display: inline;">
                    <paper-icon-button style="padding-bottom: 12px;" icon="icons:lock-open" @click=${() => this.openAutoSetScreenLockPass()} title="${translate("login.lp11")}"></paper-icon-button>
                </div>
            `
        } else if (this.myAutoLockScreenSet === false) {
            return html`
                <div style="display: inline;">
                    <paper-icon-button style="padding-bottom: 12px;" icon="icons:lock-open" @click=${() => this.setAutoLockQortal()} title="${translate("login.lp11")}"></paper-icon-button>
                </div>
            `
        } else if (this.myAutoLockScreenSet === true) {
            return html`
                <div style="display: inline;">
                    <paper-icon-button style="padding-bottom: 12px;" icon="icons:lock" title="${translate("login.lp10")}"></paper-icon-button>
                </div>
            `
        }
    }

    openAutoSetScreenLockPass() {
        this.shadowRoot.getElementById('autoLockPassword').value = ''
        this.shadowRoot.getElementById('autoLockPasswordConfirm').value = ''
        this.shadowRoot.getElementById('setAutoLockScreenPass').open()
    }

    closewAutoSetScreenLockPass() {
        this.shadowRoot.getElementById('setAutoLockScreenPass').close()
    }

    autoCheckPass() {
        const autoPassword = this.shadowRoot.getElementById('autoLockPassword').value
        const autoRePassword = this.shadowRoot.getElementById('autoLockPasswordConfirm').value

        if (autoPassword === '') {
            let snackbar1string = get("login.pleaseenter")
            parentEpml.request('showSnackBar', `${snackbar1string}`)
            return
        }

        if (autoPassword != autoRePassword) {
            let snackbar2string = get("login.notmatch")
            parentEpml.request('showSnackBar', `${snackbar2string}`)
            return
        }

        if (autoPassword.length < 8) {
            let snackbar3string = get("login.lessthen8")
            parentEpml.request('showSnackBar', `${snackbar3string}`)
            this.autoExtraConfirm()
        }

        if (autoPassword.length >= 8) {
            this.setAutoNewScreenPass()
            let snackbar4string = get("login.lp6")
            parentEpml.request('showSnackBar', `${snackbar4string}`)
        }
    }

    autoExtraConfirm() {
        this.shadowRoot.getElementById('setAutoLockScreenPass').close()
        this.shadowRoot.getElementById('autoExtraConfirmPass').open()
    }

    closAutoExtraConfirmPass() {
        this.shadowRoot.getElementById('autoExtraConfirmPass').close()
        this.shadowRoot.getElementById('autoLockPassword').value = ''
        this.shadowRoot.getElementById('autoLockPasswordConfirm').value = ''
    }

    setAutoNewScreenPass() {
        const autoRawPassword = this.shadowRoot.getElementById('autoLockPassword').value
        const autoCryptPassword = encryptData(autoRawPassword, this.autoSalt)
        localStorage.setItem(this.autoLockScreenPass, autoCryptPassword)
        this.myAutoLockScreenPass = ''
        this.myAutoLockScreenPass = decryptData(localStorage.getItem(this.autoLockScreenPass), this.autoSalt)
        this.shadowRoot.getElementById('setAutoLockScreenPass').close()
        this.shadowRoot.getElementById('autoExtraConfirmPass').close()
        this.shadowRoot.getElementById('autoLockPassword').value = ''
        this.shadowRoot.getElementById('autoLockPasswordConfirm').value = ''
    }

    setAutoLockQortal() {
        this.autoHelperMessage = this.renderAutoHelperPass()
        this.autoLockSet = ''
        this.autoLockSet = encryptData(true, this.autoSalt)
        localStorage.setItem(this.autoLockScreenSet, this.autoLockSet)
        this.myAutoLockScreenSet = ''
        this.myAutoLockScreenSet = decryptData(localStorage.getItem(this.autoLockScreenSet), this.autoSalt)
        this.shadowRoot.getElementById('autoLockScreenActive').open()
    }

    autoPassKeyListener(e) {
        if (e.key === 'Enter') {
            this.closeAutoLockScreenActive()
        }
    }

    async closeAutoLockScreenActive() {
        const myAutoPass = decryptData(localStorage.getItem(this.autoLockScreenPass), this.autoSalt)
        const autoCheckPass = this.shadowRoot.getElementById('autoUnlockPassword').value
        const errDelay = ms => new Promise(res => setTimeout(res, ms))

        if (autoCheckPass === myAutoPass) {
            this.autoLockSet = ''
            this.autoLockSet = encryptData(false, this.autoSalt)
            localStorage.setItem(this.autoLockScreenSet, this.autoLockSet)
            this.myAutoLockScreenSet = ''
            this.myAutoLockScreenSet = decryptData(localStorage.getItem(this.autoLockScreenSet), this.autoSalt)
            this.shadowRoot.getElementById('autoLockScreenActive').close()
            this.shadowRoot.getElementById('autoUnlockPassword').value = ''
            this.autoHelperMessage = this.renderAutoHelperPass()
        } else {
            this.shadowRoot.getElementById('autoUnlockPassword').value = ''
            this.autoHelperMessage = this.renderAutoHelperErr()
            await errDelay(3000)
            this.autoHelperMessage = this.renderAutoHelperPass()

        }
    }

    renderAutoHelperPass() {
        return html`<span style="color: #fff; font-weight: bold; font-size: 13px; float: left;">${translate("login.pleaseenter")}</span>`
    }

    renderAutoHelperErr() {
        return html`<span style="color: var(--mdc-theme-error); font-weight: bold;  font-size: 13px; float: right;">${translate("login.lp8")}</span>`
    }

    changeTheme() {
        const checkTheme = localStorage.getItem('qortalTheme')
        this.theme = (checkTheme) ? checkTheme : 'light'
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

    renderFetchText() {
        return html`${translate("walletpage.wchange1")}`
    }

    renderWarning() {
        return html`<span class="warning-text">${translate("tradepage.tchange48")} ${this.listedCoins.get(this.selectedCoin).coinCode}</span>`
    }

    renderBotWarning() {
        return html`<span class="warning-bot-text">${translate("walletpage.wchange1")}</span>`
    }

    showAutoBuyGrid() {
        switch(this.listedCoins.get(this.selectedCoin).coinCode) {
            case "BTC":
                return html`${this.tradeBotBTCTemplate()}`
                break
            case "LTC":
                return html`${this.tradeBotLTCTemplate()}`
                break
            case "DOGE":
                return html`${this.tradeBotDOGETemplate()}`
                break
            case "DGB":
                return html`${this.tradeBotDGBTemplate()}`
                break
            case "RVN":
                return html`${this.tradeBotRVNTemplate()}`
                break
            case "ARRR":
                return html`${this.tradeBotARRRTemplate()}`
                break
            default:
                break
        }
    }

    exchangeRateQort() {
        switch(this.listedCoins.get(this.selectedCoin).coinCode) {
            case "BTC":
                this.qortRatio = this.qortbtc
                break
            case "LTC":
                this.qortRatio = this.qortltc
                break
            case "DOGE":
                this.qortRatio = this.qortdoge
                break
            case "DGB":
                this.qortRatio = this.qortdgb
                break
            case "RVN":
                this.qortRatio = this.qortrvn
                break
            case "ARRR":
                this.qortRatio = this.qortarrr
                break
            default:
                break
        }
        return html`${this.qortRatio}`
    }

    exchangeRateForeign() {
        if (this.listedCoins.get(this.selectedCoin).coinCode === "BTC") {
            parentEpml.request('apiCall', {
                url: `/crosschain/price/BITCOIN?inverse=false`
            }).then((res) => {
                this.btcqort = (Number(res) / 1e8).toFixed(8)
            })
            return html`${this.btcqort}`
        } else if (this.listedCoins.get(this.selectedCoin).coinCode === "LTC") {
            parentEpml.request('apiCall', {
                url: `/crosschain/price/LITECOIN?inverse=false`
            }).then((res) => {
                this.ltcqort = (Number(res) / 1e8).toFixed(8)
            })
            return html`${this.ltcqort}`
        } else if (this.listedCoins.get(this.selectedCoin).coinCode === "DOGE") {
            parentEpml.request('apiCall', {
                url: `/crosschain/price/DOGECOIN?inverse=false`
            }).then((res) => {
                this.dogeqort = (Number(res) / 1e8).toFixed(8)
            })
            return html`${this.dogeqort}`
        } else if (this.listedCoins.get(this.selectedCoin).coinCode === "DGB") {
            parentEpml.request('apiCall', {
                url: `/crosschain/price/DIGIBYTE?inverse=false`
            }).then((res) => {
                this.dgbqort = (Number(res) / 1e8).toFixed(8)
            })
            return html`${this.dgbqort}`
        } else if (this.listedCoins.get(this.selectedCoin).coinCode === "RVN") {
            parentEpml.request('apiCall', {
                url: `/crosschain/price/RAVENCOIN?inverse=false`
            }).then((res) => {
                this.rvnqort = (Number(res) / 1e8).toFixed(8)
            })
            return html`${this.rvnqort}`
        } else if (this.listedCoins.get(this.selectedCoin).coinCode === "ARRR") {
            parentEpml.request('apiCall', {
                url: `/crosschain/price/PIRATECHAIN?inverse=false`
            }).then((res) => {
                this.arrrqort = (Number(res) / 1e8).toFixed(8)
            })
            return html`${this.arrrqort}`
        }
    }

    async updateWalletBalance() {
        let _url = ``
        let _body = null

        switch (this.selectedCoin) {
            case 'BITCOIN':
                _url = `/crosschain/btc/walletbalance?apiKey=${this.getApiKey()}`
                _body = window.parent.reduxStore.getState().app.selectedAddress.btcWallet.derivedMasterPublicKey
                break
            case 'LITECOIN':
                _url = `/crosschain/ltc/walletbalance?apiKey=${this.getApiKey()}`
                _body = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet.derivedMasterPublicKey
                break
            case 'DOGECOIN':
                _url = `/crosschain/doge/walletbalance?apiKey=${this.getApiKey()}`
                _body = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet.derivedMasterPublicKey
                break
            case 'DIGIBYTE':
                _url = `/crosschain/dgb/walletbalance?apiKey=${this.getApiKey()}`
                _body = window.parent.reduxStore.getState().app.selectedAddress.dgbWallet.derivedMasterPublicKey
		    break
		case 'RAVENCOIN':
                _url = `/crosschain/rvn/walletbalance?apiKey=${this.getApiKey()}`
                _body = window.parent.reduxStore.getState().app.selectedAddress.rvnWallet.derivedMasterPublicKey
                break
            case 'PIRATECHAIN':
                _url = `/crosschain/arrr/walletbalance?apiKey=${this.getApiKey()}`
                _body = window.parent.reduxStore.getState().app.selectedAddress.arrrWallet.seed58
                break
            default:
                break
        }

        this.showGetWalletBance = true
        this.showAddAutoBuy = false

        await parentEpml.request('apiCall', {
            url: _url,
            method: 'POST',
            body: _body,
        }).then((res) => {
            if (isNaN(Number(res))) {
                //...
            } else {
                this.listedCoins.get(this.selectedCoin).balance = (Number(res) / 1e8).toFixed(8)
            }
        })

        this.showGetWalletBance = false
        this.showAddAutoBuy = true
    }

    async fetchWalletAddress(coin) {
        switch (coin) {
            case 'PIRATECHAIN':
                let res = await parentEpml.request('apiCall', {
                    url: `/crosschain/arrr/walletaddress?apiKey=${this.getApiKey()}`,
                    method: 'POST',
                    body: `${window.parent.reduxStore.getState().app.selectedAddress.arrrWallet.seed58}`,
                })
                if (res != null && res.error != 1201) {
                    this.arrrWalletAddress = res
                }
                break

            default:
                // Not used for other coins yet
                break
        }
    }

    async getDoneTrades() {
        let tradesUrl = ``
        clearTimeout(this.updateDoneTradesTimeout)
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const myAddress = window.parent.reduxStore.getState().app.selectedAddress.address

        switch (this.selectedCoin) {
            case 'BITCOIN':
                tradesUrl = `${nodeUrl}/crosschain/trades?foreignBlockchain=BITCOIN&minimumTimestamp=1597310000000&limit=0&reverse=true`
                break
            case 'LITECOIN':
                tradesUrl = `${nodeUrl}/crosschain/trades?foreignBlockchain=LITECOIN&minimumTimestamp=1597310000000&limit=0&reverse=true`
                break
            case 'DOGECOIN':
                tradesUrl = `${nodeUrl}/crosschain/trades?foreignBlockchain=DOGECOIN&minimumTimestamp=1597310000000&limit=0&reverse=true`
                break
            case 'DIGIBYTE':
                tradesUrl = `${nodeUrl}/crosschain/trades?foreignBlockchain=DIGIBYTE&minimumTimestamp=1597310000000&limit=0&reverse=true`
		    break
		case 'RAVENCOIN':
                tradesUrl = `${nodeUrl}/crosschain/trades?foreignBlockchain=RAVENCOIN&minimumTimestamp=1597310000000&limit=0&reverse=true`
                break
            case 'PIRATECHAIN':
                tradesUrl = `${nodeUrl}/crosschain/trades?foreignBlockchain=PIRATECHAIN&minimumTimestamp=1597310000000&limit=0&reverse=true`
                break
            default:
                break
        }

        this.isLoadingDoneTrades = true

        const doneTradesAll = await fetch(tradesUrl).then(response => {
           return response.json()
        })

        this.listedCoins.get(this.selectedCoin).myGridBoughtItems = doneTradesAll.map(item => {
            const searchAddress = item.buyerReceivingAddress
            if (searchAddress == myAddress) {
                return {
                    timestamp: item.tradeTimestamp,
                    foreignAmount: item.foreignAmount,
                    qortAmount: item.qortAmount
                }
            }
        }).filter(item => !!item)

        this.isLoadingDoneTrades = false
        this.updateDoneTradesTimeout = setTimeout(() => this.getDoneTrades(), 300000)
    }

    btcTradebook() {
        if (localStorage.getItem(this.btcWallet) === null) {
            localStorage.setItem(this.btcWallet, "")
        } else {
            this.tradeBotBtcBook = JSON.parse(localStorage.getItem(this.btcWallet) || "[]")
        }
    }

    addToBTCTradebook() {
        const addBotBtcQortAmount = this.shadowRoot.getElementById('autoBuyBTCQortAmountInput').value
        const addBotBtcPrice = this.shadowRoot.getElementById('autoBuyBTCPriceInput').value
        const addBtcQortAmount = this.round(parseFloat(addBotBtcQortAmount))
        const addBtcPrice = this.round(parseFloat(addBotBtcPrice))

        var oldBtcTradebook = JSON.parse(localStorage.getItem(this.btcWallet) || "[]")

        const newBtcTradebookItem = {
            botBtcQortAmount: addBtcQortAmount,
            botBtcPrice: addBtcPrice
        }

        oldBtcTradebook.push(newBtcTradebookItem)

        localStorage.setItem(this.btcWallet, JSON.stringify(oldBtcTradebook))

        let btctradebookstring = get("tradepage.tchange44")
        parentEpml.request('showSnackBar', `${btctradebookstring}`)

        this.closeBTCTradebookDialog()
        this.tradeBotBtcBook = JSON.parse(localStorage.getItem(this.btcWallet) || "[]")
    }

    closeBTCTradebookDialog() {
        this.shadowRoot.querySelector('#tradeBotBTCAddDialog').close()
        this.clearTradeBotForm()
    }

    removeBTCTradebook() {
        localStorage.removeItem(this.btcWallet)
        localStorage.setItem(this.btcWallet, "")
        this.tradeBotBtcBook = JSON.parse(localStorage.getItem(this.btcWallet) || "[]")

        this.autoBuyBotDisable = false

        let btcstring = get("tradepage.tchange41")
        parentEpml.request('showSnackBar', `${btcstring}`)
    }

    ltcTradebook() {
        if (localStorage.getItem(this.ltcWallet) === null) {
            localStorage.setItem(this.ltcWallet, "")
        } else {
            this.tradeBotLtcBook = JSON.parse(localStorage.getItem(this.ltcWallet) || "[]")
        }
    }

    addToLTCTradebook() {
        const addBotLtcQortAmount = this.shadowRoot.getElementById('autoBuyLTCQortAmountInput').value
        const addBotLtcPrice = this.shadowRoot.getElementById('autoBuyLTCPriceInput').value
        const addLtcQortAmount = this.round(parseFloat(addBotLtcQortAmount))
        const addLtcPrice = this.round(parseFloat(addBotLtcPrice))

        var oldLtcTradebook = JSON.parse(localStorage.getItem(this.ltcWallet) || "[]")

        const newLtcTradebookItem = {
            botLtcQortAmount: addLtcQortAmount,
            botLtcPrice: addLtcPrice
        }

        oldLtcTradebook.push(newLtcTradebookItem)

        localStorage.setItem(this.ltcWallet, JSON.stringify(oldLtcTradebook))

        let ltctradebookstring = get("tradepage.tchange44")
        parentEpml.request('showSnackBar', `${ltctradebookstring}`)

        this.closeLTCTradebookDialog()
        this.tradeBotLtcBook = JSON.parse(localStorage.getItem(this.ltcWallet) || "[]")
    }

    closeLTCTradebookDialog() {
        this.shadowRoot.querySelector('#tradeBotLTCAddDialog').close()
        this.clearTradeBotForm()
    }

    removeLTCTradebook() {
        localStorage.removeItem(this.ltcWallet)
        localStorage.setItem(this.ltcWallet, "")
        this.tradeBotLtcBook = JSON.parse(localStorage.getItem(this.ltcWallet) || "[]")

        this.autoBuyBotDisable = false

        let ltcstring = get("tradepage.tchange41")
        parentEpml.request('showSnackBar', `${ltcstring}`)
    }

    dogeTradebook() {
        if (localStorage.getItem(this.dogeWallet) === null) {
            localStorage.setItem(this.dogeWallet, "")
        } else {
            this.tradeBotDogeBook = JSON.parse(localStorage.getItem(this.dogeWallet) || "[]")
        }
    }

    addToDOGETradebook() {
        const addBotDogeQortAmount = this.shadowRoot.getElementById('autoBuyDOGEQortAmountInput').value
        const addBotDogePrice = this.shadowRoot.getElementById('autoBuyDOGEPriceInput').value
        const addDogeQortAmount = this.round(parseFloat(addBotDogeQortAmount))
        const addDogePrice = this.round(parseFloat(addBotDogePrice))

        var oldDogeTradebook = JSON.parse(localStorage.getItem(this.dogeWallet) || "[]")

        const newDogeTradebookItem = {
            botDogeQortAmount: addDogeQortAmount,
            botDogePrice: addDogePrice
        }

        oldDogeTradebook.push(newDogeTradebookItem)

        localStorage.setItem(this.dogeWallet, JSON.stringify(oldDogeTradebook))

        let dogetradebookstring = get("tradepage.tchange44")
        parentEpml.request('showSnackBar', `${dogetradebookstring}`)

        this.closeDOGETradebookDialog()
        this.tradeBotDogeBook = JSON.parse(localStorage.getItem(this.dogeWallet) || "[]")
    }

    closeDOGETradebookDialog() {
        this.shadowRoot.querySelector('#tradeBotDOGEAddDialog').close()
        this.clearTradeBotForm()
    }

    removeDOGETradebook() {
        localStorage.removeItem(this.dogeWallet)
        localStorage.setItem(this.dogeWallet, "")
        this.tradeBotDogeBook = JSON.parse(localStorage.getItem(this.dogeWallet) || "[]")

        this.autoBuyBotDisable = false

        let dogestring = get("tradepage.tchange41")
        parentEpml.request('showSnackBar', `${dogestring}`)
    }

    dgbTradebook() {
        if (localStorage.getItem(this.dgbWallet) === null) {
            localStorage.setItem(this.dgbWallet, "")
        } else {
            this.tradeBotDgbBook = JSON.parse(localStorage.getItem(this.dgbWallet) || "[]")
        }
    }

    addToDGBTradebook() {
        const addBotDgbQortAmount = this.shadowRoot.getElementById('autoBuyDGBQortAmountInput').value
        const addBotDgbPrice = this.shadowRoot.getElementById('autoBuyDGBPriceInput').value
        const addDgbQortAmount = this.round(parseFloat(addBotDgbQortAmount))
        const addDgbPrice = this.round(parseFloat(addBotDgbPrice))

        var oldDgbTradebook = JSON.parse(localStorage.getItem(this.dgbWallet) || "[]")

        const newDgbTradebookItem = {
            botDgbQortAmount: addDgbQortAmount,
            botDgbPrice: addDgbPrice
        }

        oldDgbTradebook.push(newDgbTradebookItem)

        localStorage.setItem(this.dgbWallet, JSON.stringify(oldDgbTradebook))

        let dgbtradebookstring = get("tradepage.tchange44")
        parentEpml.request('showSnackBar', `${dgbtradebookstring}`)

        this.closeDGBTradebookDialog()
        this.tradeBotDgbBook = JSON.parse(localStorage.getItem(this.dgbWallet) || "[]")
    }

    closeDGBTradebookDialog() {
        this.shadowRoot.querySelector('#tradeBotDGBAddDialog').close()
        this.clearTradeBotForm()
    }

    removeDGBTradebook() {
        localStorage.removeItem(this.dgbWallet)
        localStorage.setItem(this.dgbWallet, "")
        this.tradeBotDgbBook = JSON.parse(localStorage.getItem(this.dgbWallet) || "[]")

        this.autoBuyBotDisable = false

        let dgbstring = get("tradepage.tchange41")
        parentEpml.request('showSnackBar', `${dgbstring}`)
    }

    rvnTradebook() {
        if (localStorage.getItem(this.rvnWallet) === null) {
            localStorage.setItem(this.rvnWallet, "")
        } else {
            this.tradeBotRvnBook = JSON.parse(localStorage.getItem(this.rvnWallet) || "[]")
        }
    }

    addToRVNTradebook() {
        const addBotRvnQortAmount = this.shadowRoot.getElementById('autoBuyRVNQortAmountInput').value
        const addBotRvnPrice = this.shadowRoot.getElementById('autoBuyRVNPriceInput').value
        const addRvnQortAmount = this.round(parseFloat(addBotRvnQortAmount))
        const addRvnPrice = this.round(parseFloat(addBotRvnPrice))

        var oldRvnTradebook = JSON.parse(localStorage.getItem(this.rvnWallet) || "[]")

        const newRvnTradebookItem = {
            botRvnQortAmount: addRvnQortAmount,
            botRvnPrice: addRvnPrice
        }

        oldRvnTradebook.push(newRvnTradebookItem)

        localStorage.setItem(this.rvnWallet, JSON.stringify(oldRvnTradebook))

        let rvntradebookstring = get("tradepage.tchange44")
        parentEpml.request('showSnackBar', `${rvntradebookstring}`)

        this.closeRVNTradebookDialog()
        this.tradeBotRvnBook = JSON.parse(localStorage.getItem(this.rvnWallet) || "[]")
    }

    closeRVNTradebookDialog() {
        this.shadowRoot.querySelector('#tradeBotRVNAddDialog').close()
        this.clearTradeBotForm()
    }

    removeRVNTradebook() {
        localStorage.removeItem(this.rvnWallet)
        localStorage.setItem(this.rvnWallet, "")
        this.tradeBotRvnBook = JSON.parse(localStorage.getItem(this.rvnWallet) || "[]")

        this.autoBuyBotDisable = false

        let rvnstring = get("tradepage.tchange41")
        parentEpml.request('showSnackBar', `${rvnstring}`)
    }

    arrrTradebook() {
        if (localStorage.getItem(this.arrrWallet) === null) {
            localStorage.setItem(this.arrrWallet, "")
        } else {
            this.tradeBotArrrBook = JSON.parse(localStorage.getItem(this.arrrWallet) || "[]")
        }
    }

    addToARRRTradebook() {
        const addBotArrrQortAmount = this.shadowRoot.getElementById('autoBuyARRRQortAmountInput').value
        const addBotArrrPrice = this.shadowRoot.getElementById('autoBuyARRRPriceInput').value
        const addArrrQortAmount = this.round(parseFloat(addBotArrrQortAmount))
        const addArrrPrice = this.round(parseFloat(addBotArrrPrice))

        var oldArrrTradebook = JSON.parse(localStorage.getItem(this.arrrWallet) || "[]")

        const newArrrTradebookItem = {
            botArrrQortAmount: addArrrQortAmount,
            botArrrPrice: addArrrPrice
        }

        oldArrrTradebook.push(newArrrTradebookItem)

        localStorage.setItem(this.arrrWallet, JSON.stringify(oldArrrTradebook))

        let arrrtradebookstring = get("tradepage.tchange44")
        parentEpml.request('showSnackBar', `${arrrtradebookstring}`)

        this.closeARRRTradebookDialog()
        this.tradeBotArrrBook = JSON.parse(localStorage.getItem(this.arrrWallet) || "[]")
    }

    closeARRRTradebookDialog() {
        this.shadowRoot.querySelector('#tradeBotARRRAddDialog').close()
        this.clearTradeBotForm()
    }

    removeARRRTradebook() {
        localStorage.removeItem(this.arrrWallet)
        localStorage.setItem(this.arrrWallet, "")
        this.tradeBotArrrBook = JSON.parse(localStorage.getItem(this.arrrWallet) || "[]")

        this.autoBuyBotDisable = false

        let arrrstring = get("tradepage.tchange41")
        parentEpml.request('showSnackBar', `${arrrstring}`)
    }

    async setForeignCoin(coin,beingInitialized) {
        let _this = this
        this.selectedCoin = coin

        let coinSelectionMenu=this.shadowRoot.getElementById("coinSelectionMenu")

        if(beingInitialized){
            coinSelectionMenu.shadowRoot.querySelector('.mdc-select--outlined .mdc-select__anchor').setAttribute('style', 'padding-left: 60px;')
            let pairIconContainer = document.createElement("span")
            let pairicon = (_this.listedCoins.get(_this.selectedCoin).coinCode).toLowerCase()
            pairIconContainer.setAttribute("class","pairIconContainer")
            pairIconContainer.setAttribute('style', 'left: 10px;top: 50%;transform: translate(0, -50%);height: 26px;width: 45px;position: absolute;background-repeat: no-repeat;background-size: cover;background-image: url(/img/qort'+pairicon+'.png);')
            coinSelectionMenu.shadowRoot.querySelector('.mdc-select--outlined .mdc-select__anchor').appendChild(pairIconContainer)
        }else{
            let pairIconContainer = coinSelectionMenu.shadowRoot.querySelector(".mdc-select--outlined .mdc-select__anchor span.pairIconContainer")
            let pairicon = (_this.listedCoins.get(_this.selectedCoin).coinCode).toLowerCase()
            pairIconContainer.style.backgroundImage='url(/img/qort'+pairicon+'.png)'
        }

        this.isLoadingOpenTrades = true
        this.createConnection()
        this._openOrdersGrid.querySelector('#priceColumn').headerRenderer = function (root) {
            const priceString2 = get("tradepage.tchange9")
            root.innerHTML = '<vaadin-grid-sorter path="price" direction="asc">' + priceString2 + ' (' + _this.listedCoins.get(_this.selectedCoin).coinCode + ')</vaadin-grid-sorter>'
        }
        this.clearTradeBotForm()
        clearTimeout(this.updateDoneTradesTimeout)
        await this.getDoneTrades()
        this.updateDoneTradesTimeout = setTimeout(() => this.getDoneTrades(), 180000)
        await this.updateWalletBalance()
        await this.fetchWalletAddress(coin)

    }

    async reRenderOpenFilteredOrders() {
        this.requestUpdate()
        await this.updateComplete
        this.isLoadingOpenTrades = false
    }

    async reRenderMyOpenOrders() {
        this.requestUpdate()
        await this.updateComplete
        this.isLoadingMyOpenOrders = false
    }

    addAutoBuyAction() {
        this.autoBuyWarning = false
        this.clearTradeBotForm()
        this.shadowRoot.querySelector('#tradeBot' + this.listedCoins.get(this.selectedCoin).coinCode + 'AddDialog').show()
    }

    checkTradeBotValues() {
        const checkTradeBotAmountInput = this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'QortAmountInput').value
        const checkTradeBotPriceInput = this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'PriceInput').value
        const checkTradeBotTotalInput = this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'TotalInput').value
        const checkAmount = this.round(parseFloat(checkTradeBotAmountInput))
        const checkPrice = this.round(parseFloat(checkTradeBotPriceInput))
        const checkTotal = this.round(parseFloat(checkTradeBotTotalInput))

        if (Number(checkAmount) === 0) {
            let amountString = get("tradepage.tchange34")
            parentEpml.request('showSnackBar', `${amountString}`)
        } else if (Number(checkPrice) === 0) {
            let priceString = get("tradepage.tchange35")
            parentEpml.request('showSnackBar', `${priceString}`)
        } else if (Number(checkTotal) === 0) {
            let totalString = get("tradepage.tchange35")
            parentEpml.request('showSnackBar', `${totalString}`)
        } else {
            this.showAddToAutoBuyStore()
        }
    }

    showAddToAutoBuyStore() {
        switch(this.listedCoins.get(this.selectedCoin).coinCode) {
            case "BTC":
                this.addToBTCTradebook()
                break
            case "LTC":
                this.addToLTCTradebook()
                break
            case "DOGE":
                this.addToDOGETradebook()
                break
            case "DGB":
                this.addToDGBTradebook()
                break
            case "RVN":
                this.addToRVNTradebook()
                break
            case "ARRR":
                this.addToARRRTradebook()
                break
            default:
                break
        }
    }

    processOfferingTrade(offer) {
        try {
            if(this.listedCoins.get(offer.foreignBlockchain).name!='') {
                const offerItem = {
                    ...offer,
                    qortAmount: parseFloat(offer.qortAmount),
                    price: parseFloat(offer.foreignAmount) / parseFloat(offer.qortAmount),
                }
                const addOffer = () => {
                    this.listedCoins.get(offer.foreignBlockchain).openOrders.unshift(offerItem)
                }
                const initOffer = () => {
                    this.listedCoins.get(offer.foreignBlockchain).openOrders.push(offerItem)
                }
                this.listedCoins.get(offer.foreignBlockchain).openOrders.length === 0 ? initOffer() : addOffer()
                this.listedCoins.get(offer.foreignBlockchain).tradeOffersSocketCounter > 1 ? this._openOrdersGrid.clearCache() : null
            }
        } catch(e) {
            console.log("Error adding offer from "+offer.foreignBlockchain)
        }
    }

    processRedeemedTrade(offer) {
        try {
            if (this.listedCoins.get(offer.foreignBlockchain).name!='') {

                if (offer.qortalCreator === this.selectedAddress.address) {
                    if (this.listedCoins.get(offer.foreignBlockchain).tradeOffersSocketCounter > 1) {
                        this.updateWalletBalance()
                    }
                    const offerItem = {
                        ...offer,
                        mode: 'SOLD',
                    }
                    this._myHistoricTradesGrid.items.unshift(offerItem)
                    this.listedCoins.get(offer.foreignBlockchain).tradeOffersSocketCounter > 1 ? this._myHistoricTradesGrid.clearCache() : null
                } else if (offer.partnerQortalReceivingAddress === this.selectedAddress.address) {
                    if (this.listedCoins.get(offer.foreignBlockchain).tradeOffersSocketCounter > 1) {
                        this.updateWalletBalance()
                    }
                    const offerItem = {
                        ...offer,
                        mode: 'BOUGHT',
                    }
                    this._myHistoricTradesGrid.items.unshift(offerItem)
                    this.listedCoins.get(offer.foreignBlockchain).tradeOffersSocketCounter > 1 ? this._myHistoricTradesGrid.clearCache() : null
                }
                const addNewHistoricTrade = () => {
                    this._historicTradesGrid.items.unshift(offer)
                    this._historicTradesGrid.clearCache()
                }
                this.listedCoins.get(offer.foreignBlockchain).tradeOffersSocketCounter > 1 ? addNewHistoricTrade() : null

            }
        } catch(e) {
            console.log("Error processing redeemed trade offer from "+offer.foreignBlockchain)
        }
    }

    processTradingTrade(offer) {
        try {
            if (this.listedCoins.get(offer.foreignBlockchain).name!='') {

                if (offer.qortalCreator === this.selectedAddress.address && this.listedCoins.get(offer.foreignBlockchain).tradeOffersSocketCounter > 1) {
                    this.updateWalletBalance()
                }
                this._openOrdersGrid.items.forEach((item, index) => {
                    if (item.qortalAtAddress === offer.qortalAtAddress) {
                        this._openOrdersGrid.items.splice(index, 1)
                        this.listedCoins.get(offer.foreignBlockchain).tradeOffersSocketCounter > 1 ? this._openOrdersGrid.clearCache() : null
                    }
                })
                this.listedCoins.get(offer.foreignBlockchain).openOrders = this.listedCoins.get(offer.foreignBlockchain).openOrders.filter((order) => order.qortalAtAddress !== offer.qortalAtAddress)
            }
        } catch(e) {
            console.log("Error processing trading trade offer from "+offer.foreignBlockchain)
        }
    }

    processRefundedTrade(offer) {
        try {
            if (this.listedCoins.get(offer.foreignBlockchain).name!='') {

            if (offer.qortalCreator === this.selectedAddress.address) {
                if (this.listedCoins.get(offer.foreignBlockchain).tradeOffersSocketCounter > 1) {
                    this.updateWalletBalance()
                }
                this._myHistoricTradesGrid.items.unshift(offer)
                this.listedCoins.get(offer.foreignBlockchain).tradeOffersSocketCounter > 1 ? this._myHistoricTradesGrid.clearCache() : null
            }

            }
        } catch(e) {
            console.log("Error processing refunded trade offer from "+offer.foreignBlockchain)
        }
    }

    processCancelledTrade(offer) {
        try {
            if (this.listedCoins.get(offer.foreignBlockchain).name!='') {

                if (offer.qortalCreator === this.selectedAddress.address) {
                    if (this.listedCoins.get(offer.foreignBlockchain).tradeOffersSocketCounter > 1) {
                        this.updateWalletBalance()
                    }
                    this._myHistoricTradesGrid.items.unshift(offer)
                    this.listedCoins.get(offer.foreignBlockchain).tradeOffersSocketCounter > 1 ? this._myHistoricTradesGrid.clearCache() : null
                }
                this._openOrdersGrid.items.forEach((item, index) => {
                    if (item.qortalAtAddress === offer.qortalAtAddress) {
                        this._openOrdersGrid.items.splice(index, 1)
                        this.listedCoins.get(offer.foreignBlockchain).tradeOffersSocketCounter > 1 ? this._openOrdersGrid.clearCache() : null
                    }
                })
                this.listedCoins.get(offer.foreignBlockchain).openOrders = this.listedCoins.get(offer.foreignBlockchain).openOrders.filter((order) => order.qortalAtAddress !== offer.qortalAtAddress)
                this._stuckOrdersGrid.items.forEach((item, index) => {
                    if (item.qortalAtAddress === offer.qortalAtAddress) {
                        this._stuckOrdersGrid.items.splice(index, 1)
                        this._stuckOrdersGrid.clearCache()
                    }
                })
            }
        } catch(e) {
            console.log("Error processing cancelled trade offer from "+offer.foreignBlockchain)
        }
    }

    processTradeOffers(offers) {
        offers.forEach((offer) => {
            if (offer.mode === 'OFFERING') {
                this.processOfferingTrade(offer)
            }
        })
    }

    processTradeBotStates(tradeStates) {

        const BitcoinACCTv1 = (states) => {
            states.reverse()
            states.forEach((state) => {
                if (state.creatorAddress === this.selectedAddress.address) {
                    if (state.tradeState == 'ALICE_WAITING_FOR_AT_LOCK') {
                        this.changeTradeBotState(state, 'BUYING')
                    } else if (state.tradeState == 'ALICE_DONE') {
                        this.handleCompletedState(state)
                    } else if (state.tradeState == 'ALICE_REFUNDING_A') {
                        this.changeTradeBotState(state, 'REFUNDING')
                    } else if (state.tradeState == 'ALICE_REFUNDED') {
                        this.handleCompletedState(state)
                    }
                }
            })
        }

        const LitecoinACCTv1 = (states) => {
            states.reverse()
            states.forEach((state) => {
                if (state.creatorAddress === this.selectedAddress.address) {
                    if (state.tradeState == 'ALICE_WAITING_FOR_AT_LOCK') {
                        this.changeTradeBotState(state, 'BUYING')
                    } else if (state.tradeState == 'ALICE_DONE') {
                        this.handleCompletedState(state)
                    } else if (state.tradeState == 'ALICE_REFUNDING_A') {
                        this.changeTradeBotState(state, 'REFUNDING')
                    } else if (state.tradeState == 'ALICE_REFUNDED') {
                        this.handleCompletedState(state)
                    }
                }
            })
        }

        const DogecoinACCTv1 = (states) => {
            states.reverse()
            states.forEach((state) => {
                if (state.creatorAddress === this.selectedAddress.address) {
                    if (state.tradeState == 'ALICE_WAITING_FOR_AT_LOCK') {
                        this.changeTradeBotState(state, 'BUYING')
                    } else if (state.tradeState == 'ALICE_DONE') {
                        this.handleCompletedState(state)
                    } else if (state.tradeState == 'ALICE_REFUNDING_A') {
                        this.changeTradeBotState(state, 'REFUNDING')
                    } else if (state.tradeState == 'ALICE_REFUNDED') {
                        this.handleCompletedState(state)
                    }
                }
            })
        }

        const DigibyteACCTv1 = (states) => {
            states.reverse()
            states.forEach((state) => {
                if (state.creatorAddress === this.selectedAddress.address) {
                    if (state.tradeState == 'ALICE_WAITING_FOR_AT_LOCK') {
                        this.changeTradeBotState(state, 'BUYING')
                    } else if (state.tradeState == 'ALICE_DONE') {
                        this.handleCompletedState(state)
                    } else if (state.tradeState == 'ALICE_REFUNDING_A') {
                        this.changeTradeBotState(state, 'REFUNDING')
                    } else if (state.tradeState == 'ALICE_REFUNDED') {
                        this.handleCompletedState(state)
                    }
                }
            })
        }

        const RavencoinACCTv1 = (states) => {
            states.reverse()
            states.forEach((state) => {
                if (state.creatorAddress === this.selectedAddress.address) {
                    if (state.tradeState == 'ALICE_WAITING_FOR_AT_LOCK') {
                        this.changeTradeBotState(state, 'BUYING')
                    } else if (state.tradeState == 'ALICE_DONE') {
                        this.handleCompletedState(state)
                    } else if (state.tradeState == 'ALICE_REFUNDING_A') {
                        this.changeTradeBotState(state, 'REFUNDING')
                    } else if (state.tradeState == 'ALICE_REFUNDED') {
                        this.handleCompletedState(state)
                    }
                }
            })
        }

        const PirateChainACCTv1 = (states) => {
            states.reverse()
            states.forEach((state) => {
                if (state.creatorAddress === this.selectedAddress.address) {
                    if (state.tradeState == 'ALICE_WAITING_FOR_AT_LOCK') {
                        this.changeTradeBotState(state, 'BUYING')
                    } else if (state.tradeState == 'ALICE_DONE') {
                        this.handleCompletedState(state)
                    } else if (state.tradeState == 'ALICE_REFUNDING_A') {
                        this.changeTradeBotState(state, 'REFUNDING')
                    } else if (state.tradeState == 'ALICE_REFUNDED') {
                        this.handleCompletedState(state)
                    }
                }
            })
        }

        switch (this.selectedCoin) {
            case 'BITCOIN':
                BitcoinACCTv1(tradeStates)
                break
            case 'LITECOIN':
                LitecoinACCTv1(tradeStates)
                break
            case 'DOGECOIN':
                DogecoinACCTv1(tradeStates)
                break
            case 'DIGIBYTE':
                DigibyteACCTv1(tradeStates)
                break
            case 'RAVENCOIN':
                RavencoinACCTv1(tradeStates)
                break
            case 'PIRATECHAIN':
                PirateChainACCTv1(tradeStates)
                break
            default:
                break
        }
    }

    changeTradeBotState(state, tradeState) {
        this.isLoadingMyOpenOrders = true
        const stateItem = {
            ...state,
            _tradeState: tradeState,
        }
        const item = this._myOrdersGrid.querySelector(`#${state.atAddress}`)
        const addStateItem = () => {
            this.reRenderMyOpenOrders()
            this._myOrdersGrid.items.unshift(stateItem)
            this._myOrdersGrid.clearCache()
        }
        const updateStateItem = () => {
            this._myOrdersGrid.items.forEach((item, index) => {
                if (item.atAddress === state.atAddress) {
                    this.reRenderMyOpenOrders()
                    this._myOrdersGrid.items.splice(index, 1)
                    this._myOrdersGrid.items.unshift(stateItem)
                    this._myOrdersGrid.clearCache()
                }
            })
        }
        item ? updateStateItem() : addStateItem()
    }

    handleCompletedState(state) {
        this._myOrdersGrid.items.forEach((item, index) => {
            if (item.atAddress === state.atAddress) {
                this.reRenderMyOpenOrders()
                this._myOrdersGrid.items.splice(index, 1)
                this._myOrdersGrid.clearCache()
            }
        })
    }

    initSocket() {
        let _relatedCoin = ""
        let tradePresenceTxns = null
        let offeringTrades = null

        self.addEventListener('message', function (event) {
            switch (event.data.type) {
                case 'open_orders':
                    offeringTrades = event.data.content
                    processOffersWithPresence()
                    break
                case 'set_coin':
                    _relatedCoin = event.data.content
                    break
                default:
                    break
            }
        })

        const lessThanThirtyMinsAgo = (timestamp) => {
            const THIRTYMINS = 1000 * 60 * 30
            const thirtyMinsAgo = Date.now() - THIRTYMINS
            return timestamp > thirtyMinsAgo
        }

        const filterOffersUsingTradePresence = (offeringTrade) => {
            return offeringTrade.tradePresenceExpiry > Date.now();
        }

        const processOffersWithPresence = () => {
            if (offeringTrades === null) return

            async function asyncForEach(array, callback) {
                for (let index = 0; index < array.length; index++) {
                    await callback(array[index], index, array)
                }
            }

            const startOfferPresenceMapping = async () => {

                if (tradePresenceTxns !== null) {
                    await asyncForEach(tradePresenceTxns, async (tradePresence) => {
                        let offerIndex = offeringTrades.findIndex((offeringTrade) => offeringTrade.qortalCreatorTradeAddress === tradePresence.tradeAddress)
                        offerIndex !== -1 ? (offeringTrades[offerIndex].tradePresenceExpiry = tradePresence.timestamp) : null
                    })
                }

                let filteredOffers = offeringTrades.filter((offeringTrade) => filterOffersUsingTradePresence(offeringTrade))
                self.postMessage({ type: 'PRESENCE', data: { offers: offeringTrades, filteredOffers: filteredOffers, relatedCoin: _relatedCoin } })
            }

            startOfferPresenceMapping()
        }

        const initTradeOffersWebSocket = (restarted = false) => {
            let tradeOffersSocketCounter = 0
            let socketTimeout
            let socketLink = `ws://NODEURL/websockets/crosschain/tradeoffers?foreignBlockchain=FOREIGN_BLOCKCHAIN&includeHistoric=true`
            const socket = new WebSocket(socketLink)
            socket.onopen = () => {
                setTimeout(pingSocket, 50)
                tradeOffersSocketCounter += 1
            }
            socket.onmessage = (e) => {
                e.relatedCoin = _relatedCoin
                self.postMessage({
                    type: 'TRADE_OFFERS',
                    data: e.data,
                    counter: tradeOffersSocketCounter,
                    isRestarted: restarted,
                })
                tradeOffersSocketCounter += 1
                restarted = false
            }
            socket.onclose = () => {
                clearTimeout(socketTimeout)
                restartTradeOffersWebSocket()
            }
            socket.onerror = (e) => {
                clearTimeout(socketTimeout)
            }
            const pingSocket = () => {
                socket.send('ping')
                socketTimeout = setTimeout(pingSocket, 295000)
            }
        }

        const initTradeBotWebSocket = (restarted = false) => {
            let socketTimeout
            let socketLink = `ws://NODEURL/websockets/crosschain/tradebot?foreignBlockchain=FOREIGN_BLOCKCHAIN`
            const socket = new WebSocket(socketLink)
            socket.onopen = () => {
                setTimeout(pingSocket, 50)
            }
            socket.onmessage = (e) => {
                e.relatedCoin = _relatedCoin
                self.postMessage({
                    type: 'TRADE_BOT',
                    data: e.data,
                    isRestarted: restarted,
                })
                restarted = false
            }
            socket.onclose = () => {
                clearTimeout(socketTimeout)
                restartTradeBotWebSocket()
            }
            socket.onerror = (e) => {
                clearTimeout(socketTimeout)
            }
            const pingSocket = () => {
                socket.send('ping')
                socketTimeout = setTimeout(pingSocket, 295000)
            }
        }

        const initTradePresenceWebSocket = (restarted = false) => {
            let socketTimeout
            let socketLink = `ws://NODEURL/websockets/crosschain/tradepresence`
            const socket = new WebSocket(socketLink)
            socket.onopen = () => {
                setTimeout(pingSocket, 50)
            }
            socket.onmessage = (e) => {
                tradePresenceTxns = JSON.parse(e.data)
                processOffersWithPresence()
                restarted = false
            }
            socket.onclose = () => {
                clearTimeout(socketTimeout)
                restartTradePresenceWebSocket()
            }
            socket.onerror = (e) => {
                clearTimeout(socketTimeout)
            }
            const pingSocket = () => {
                socket.send('ping')
                socketTimeout = setTimeout(pingSocket, 295000)
            }
        }

        const restartTradePresenceWebSocket = () => {
            setTimeout(() => initTradePresenceWebSocket(true), 50)
        }

        const restartTradeOffersWebSocket = () => {
            setTimeout(() => initTradeOffersWebSocket(true), 50)
        }

        const restartTradeBotWebSocket = () => {
            setTimeout(() => initTradeBotWebSocket(true), 50)
        }

        initTradeOffersWebSocket()
        initTradePresenceWebSocket()
        initTradeBotWebSocket()
    }

    updateAccountBalance() {
        clearTimeout(this.updateAccountBalanceTimeout)
        parentEpml.request('apiCall', {
            url: `/addresses/balance/${this.selectedAddress.address}?apiKey=${this.getApiKey()}`,
        })
            .then((res) => {
                this.listedCoins.get("QORTAL").balance = res
                this.updateAccountBalanceTimeout = setTimeout(() => this.updateAccountBalance(), 10000)
            })
    }

    _checkBuyAmount(e) {
        const targetAmount = e.target.value
        const target = e.target

        if (targetAmount.length === 0) {
            this.isValidAmount = false
            this.sellBtnDisable = true
            e.target.blur()
            e.target.focus()
            e.target.invalid = true
        } else {
            this.buyBtnDisable = false
        }

        e.target.blur()
        e.target.focus()

        e.target.validityTransform = (newValue, nativeValidity) => {
            if (newValue.includes('-') === true) {
                this.buyBtnDisable = true
                return {
                    valid: false,
                }
            } else if (!nativeValidity.valid) {
                if (newValue.includes('.') === true) {
                    let myAmount = newValue.split('.')
                    if (myAmount[1].length > 8) {
                        this.buyBtnDisable = true
                    } else {
                        this.buyBtnDisable = false
                        return {
                            valid: true,
                        }
                    }
                }
            } else {
                this.buyBtnDisable = false
            }
        }
    }

    checkTradeBotAmount(e) {
        const targetAmount = e.target.value
        const target = e.target
        this.autoBuyWarning = false

        if (targetAmount.length === 0) {
            this.isValidAmount = false
            this.autoBuyBtnDisable = true
            this.autoBuyWarning = false
            e.target.blur()
            e.target.focus()
            e.target.invalid = true
        } else {
            const buyTradeBotAmountInput = this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'QortAmountInput').value
            const buyTradeBotPriceInput = this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'PriceInput').value
            const buyTradeBotTotalInput = this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'TotalInput').value
            const checkFunds = this.round(parseFloat(buyTradeBotAmountInput) * parseFloat(buyTradeBotPriceInput))
            const myFunds = this.round(parseFloat(this.listedCoins.get(this.selectedCoin).balance))
            if (Number(myFunds) > Number(checkFunds)) {
                this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'TotalInput').value = this.round(parseFloat(buyTradeBotAmountInput) * parseFloat(buyTradeBotPriceInput))
                this.autoBuyBtnDisable = false
                this.autoBuyWarning = false
            } else {
                this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'TotalInput').value = this.round(parseFloat(buyTradeBotAmountInput) * parseFloat(buyTradeBotPriceInput))
                this.autoBuyBtnDisable = true
                this.autoBuyWarning = true
            }
        }

        e.target.blur()
        e.target.focus()

        e.target.validityTransform = (newValue, nativeValidity) => {
            if (newValue.includes('-') === true) {
                this.autoBuyBtnDisable = true
                this.autoBuyWarning = false
                return {
                    valid: false,
                }
            } else if (!nativeValidity.valid) {
                if (newValue.includes('.') === true) {
                    let myAmount = newValue.split('.')
                    if (myAmount[1].length > 8) {
                        this.autoBuyBtnDisable = true
                        this.autoBuyWarning = false
                    } else {
                        const buyTradeBotAmountInput = this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'QortAmountInput').value
                        const buyTradeBotPriceInput = this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'PriceInput').value
                        const buyTradeBotTotalInput = this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'TotalInput').value
                        const checkFunds = this.round(parseFloat(buyTradeBotAmountInput) * parseFloat(buyTradeBotPriceInput))
                        const myFunds = this.round(parseFloat(this.listedCoins.get(this.selectedCoin).balance))
                        if (Number(myFunds) > Number(checkFunds)) {
                            this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'TotalInput').value = this.round(parseFloat(buyTradeBotAmountInput) * parseFloat(buyTradeBotPriceInput))
                            this.autoBuyBtnDisable = false
                            this.autoBuyWarning = false
                        } else {
                            this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'TotalInput').value = this.round(parseFloat(buyTradeBotAmountInput) * parseFloat(buyTradeBotPriceInput))
                            this.autoBuyBtnDisable = true
                            this.autoBuyWarning = true
                        }
                        return {
                            valid: true,
                        }
                    }
                }
            } else {
                const buyTradeBotAmountInput = this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'QortAmountInput').value
                const buyTradeBotPriceInput = this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'PriceInput').value
                const buyTradeBotTotalInput = this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'TotalInput').value
                const checkFunds = this.round(parseFloat(buyTradeBotAmountInput) * parseFloat(buyTradeBotPriceInput))
                const myFunds = this.round(parseFloat(this.listedCoins.get(this.selectedCoin).balance))
                if (Number(myFunds) > Number(checkFunds)) {
                    this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'TotalInput').value = this.round(parseFloat(buyTradeBotAmountInput) * parseFloat(buyTradeBotPriceInput))
                    this.autoBuyBtnDisable = false
                    this.autoBuyWarning = false
                } else {
                    this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'TotalInput').value = this.round(parseFloat(buyTradeBotAmountInput) * parseFloat(buyTradeBotPriceInput))
                    this.autoBuyBtnDisable = true
                    this.autoBuyWarning = true
                }
            }
        }
    }

    checkTradeBotTotalAmount(e) {
        const targetAmount = e.target.value
        const target = e.target
        this.autoBuyWarning = false

        if (targetAmount.length === 0) {
            this.isValidAmount = false
            this.autoBuyBtnDisable = true
            this.autoBuyWarning = false
            e.target.blur()
            e.target.focus()
            e.target.invalid = true
        } else {
            const buyTradeBotAmountInput = this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'QortAmountInput').value
            const buyTradeBotPriceInput = this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'PriceInput').value
            const buyTradeBotTotalInput = this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'TotalInput').value
            const checkFunds = this.round(parseFloat(buyTradeBotAmountInput) * parseFloat(buyTradeBotPriceInput))
            const myFunds = this.round(parseFloat(this.listedCoins.get(this.selectedCoin).balance))
            if (Number(myFunds) > Number(checkFunds)) {
                this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'QortAmountInput').value = this.round(parseFloat(buyTradeBotTotalInput) / parseFloat(buyTradeBotPriceInput))
                this.autoBuyBtnDisable = false
                this.autoBuyWarning = false
            } else {
                this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'QortAmountInput').value = this.round(parseFloat(buyTradeBotTotalInput) / parseFloat(buyTradeBotPriceInput))
                this.autoBuyBtnDisable = true
                this.autoBuyWarning = true
            }
        }

        e.target.blur()
        e.target.focus()

        e.target.validityTransform = (newValue, nativeValidity) => {
            if (newValue.includes('-') === true) {
                this.autoBuyBtnDisable = true
                this.autoBuyWarning = false
                return {
                    valid: false,
                }
            } else if (!nativeValidity.valid) {
                if (newValue.includes('.') === true) {
                    let myAmount = newValue.split('.')
                    if (myAmount[1].length > 8) {
                        this.autoBuyBtnDisable = true
                        this.autoBuyWarning = false
                    } else {
                        const buyTradeBotAmountInput = this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'QortAmountInput').value
                        const buyTradeBotPriceInput = this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'PriceInput').value
                        const buyTradeBotTotalInput = this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'TotalInput').value
                        const checkFunds = this.round(parseFloat(buyTradeBotAmountInput) * parseFloat(buyTradeBotPriceInput))
                        const myFunds = this.round(parseFloat(this.listedCoins.get(this.selectedCoin).balance))
                        if (Number(myFunds) > Number(checkFunds)) {
                            this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'QortAmountInput').value = this.round(parseFloat(buyTradeBotTotalInput) / parseFloat(buyTradeBotPriceInput))
                            this.autoBuyBtnDisable = false
                            this.autoBuyWarning = false
                        } else {
                            this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'QortAmountInput').value = this.round(parseFloat(buyTradeBotTotalInput) / parseFloat(buyTradeBotPriceInput))
                            this.autoBuyBtnDisable = true
                            this.autoBuyWarning = true
                        }
                        return {
                            valid: true,
                        }
                    }
                }
            } else {
                const buyTradeBotAmountInput = this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'QortAmountInput').value
                const buyTradeBotPriceInput = this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'PriceInput').value
                const buyTradeBotTotalInput = this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'TotalInput').value
                const checkFunds = this.round(parseFloat(buyTradeBotAmountInput) * parseFloat(buyTradeBotPriceInput))
                const myFunds = this.round(parseFloat(this.listedCoins.get(this.selectedCoin).balance))
                if (Number(myFunds) > Number(checkFunds)) {
                    this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'QortAmountInput').value = this.round(parseFloat(buyTradeBotTotalInput) / parseFloat(buyTradeBotPriceInput))
                    this.autoBuyBtnDisable = false
                    this.autoBuyWarning = false
                } else {
                    this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'QortAmountInput').value = this.round(parseFloat(buyTradeBotTotalInput) / parseFloat(buyTradeBotPriceInput))
                    this.autoBuyBtnDisable = true
                    this.autoBuyWarning = true
                }
            }
        }
    }

    async tradeFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/transactions/unitfee?txType=DEPLOY_AT`
        await fetch(url).then((response) => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response)
        }).then((json) => {
            this.listedCoins.get("QORTAL").tradeFee = (Number(json) + 100000) / 1e8
        })
    }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.apiKey
    }

    clearTradeBotForm() {
        this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'QortAmountInput').value = this.initialAmount
        this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'PriceInput').value = this.initialAmount
        this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'TotalInput').value = this.initialAmount
        this.autoBuyBtnDisable = true
    }

    isEmptyArray(arr) {
        if (!arr) {
            return true
        }
        return arr.length === 0
    }

    round(number) {
		return (Math.round(parseFloat(number) * 1e8) / 1e8).toFixed(8)
    }

    inlineWorker(passedFunction, modifiers) {
        let parsedFunction = ``

        modifiers.forEach((modifier) => {
            let regex = new RegExp(modifier.searchValue, 'g')
            parsedFunction = parsedFunction.length === 0 ? `(function ${passedFunction.toString().trim().replace(regex, modifier.replaceValue)})()` : parsedFunction.toString().trim().replace(regex, modifier.replaceValue)
        })

        const workerUrl = URL.createObjectURL(new Blob([parsedFunction], { type: 'text/javascript' }))
        const worker = new Worker(workerUrl)
        URL.revokeObjectURL(workerUrl)
        return worker
    }

    clearPaneCache() {
        this._openOrdersGrid.clearCache()
        this._myOrdersGrid.clearCache()
    }

    createConnection() {
        if (workers.get(this.selectedCoin).tradesConnectedWorker !== null) {
            this.isLoadingHistoricTrades = false
            this.isLoadingOpenTrades = false
            return
        }

        const handleMessage = (message) => {
            switch (message.type) {
                case 'TRADE_OFFERS':
                    if (!message.isRestarted) {
                        this.listedCoins.get(this.selectedCoin).tradeOffersSocketCounter = message.counter
                        this.processTradeOffers(JSON.parse(message.data))
                        this.listedCoins.get(this.selectedCoin).tradeOffersSocketCounter === 1 ? this.clearPaneCache() : null
                        workers.get(this.selectedCoin).tradesConnectedWorker.postMessage(this.listedCoins.get(this.selectedCoin).openOrders)
                        workers.get(this.selectedCoin).tradesConnectedWorker.postMessage({ type: "open_orders", content: this.listedCoins.get(this.selectedCoin).openOrders })
                    }
                    return null
                case 'TRADE_BOT':
                    if (!message.isRestarted) this.processTradeBotStates(JSON.parse(message.data))
                    return null
                case 'PRESENCE':
                    this.tradesPresenceCleaned = []
                    this.listedCoins.get(message.data.relatedCoin).openOrders = message.data.offers
                    this.tradesPresenceCleaned = message.data.filteredOffers

                    const filterPresenceList = () => {
                        this.blockedTradesList.forEach(item => {
                            const toDelete = item.recipient
                            this.tradesPresenceCleaned = this.tradesPresenceCleaned.filter(el => {
                                return el.qortalCreatorTradeAddress !== toDelete
                            })
                        })
                    }

                    filterPresenceList()
                    this.listedCoins.get(message.data.relatedCoin).openFilteredOrders = this.tradesPresenceCleaned
                    this.reRenderOpenFilteredOrders()
                    return null
                default:
                    break
            }
        }

        let myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        let nodeUrl = myNode.domain + ':' + myNode.port

        const modifiers = [
            { searchValue: 'NODEURL', replaceValue: nodeUrl },
            { searchValue: 'FOREIGN_BLOCKCHAIN', replaceValue: this.selectedCoin },
        ]

        workers.get(this.selectedCoin).tradesConnectedWorker = this.inlineWorker(this.initSocket, modifiers)

        workers.get(this.selectedCoin).tradesConnectedWorker.addEventListener('message', function (event) { handleMessage(event.data) }, { passive: true })

        workers.get(this.selectedCoin).tradesConnectedWorker.postMessage({ type: "set_coin", content: this.selectedCoin })
    }

    async getNewBlockedTrades() {
        const unconfirmedTransactionsList = async () => {
            const myNodeInf = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
            const myNodeUrl = myNodeInf.protocol + '://' + myNodeInf.domain + ':' + myNodeInf.port
            const unconfirmedTransactionslUrl = `${myNodeUrl}/transactions/unconfirmed?txType=MESSAGE&limit=0&reverse=true`

            var addBlockedTrades = JSON.parse(localStorage.getItem('failedTrades') || '[]')

            await fetch(unconfirmedTransactionslUrl).then(response => {
                return response.json()
            }).then(data => {
                data.map(item => {
                    const unconfirmedNessageTimeDiff = Date.now() - item.timestamp
                    const timeOneHour = 60 * 60 * 1000
                    if (Number(unconfirmedNessageTimeDiff) > Number(timeOneHour)) {
                        const addBlocked = {
                            timestamp: item.timestamp,
                            recipient: item.recipient
                        }
                        addBlockedTrades.push(addBlocked)
                    }
                })
                localStorage.setItem("failedTrades", JSON.stringify(addBlockedTrades))
                this.blockedTradesList = JSON.parse(localStorage.getItem('failedTrades') || '[]')
            })
        }

        await unconfirmedTransactionsList()

        const filterUnconfirmedTransactionsList = async () => {
            let cleanBlockedTrades = this.blockedTradesList.reduce((newArray, cut) => {
                if(!newArray.some(obj => obj.recipient === cut.recipient)) {
                    newArray.push(cut)
                }
                return newArray
            },[])
            localStorage.setItem("failedTrades", JSON.stringify(cleanBlockedTrades))
            this.blockedTradesList = JSON.parse(localStorage.getItem("failedTrades") || "[]")
        }

        await filterUnconfirmedTransactionsList()
    }
}

window.customElements.define('trade-bot-portal', TradeBotPortal)
