import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../../epml.js'
import { use, get, translate, translateUnsafeHTML, registerTranslateConfig } from 'lit-translate'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

import '@material/mwc-button'
import '@material/mwc-textfield'
import '@material/mwc-icon'
import '@material/mwc-icon-button'
import '@material/mwc-dialog'
import '@material/mwc-tab-bar'
import '@material/mwc-tab'
import '@material/mwc-list/mwc-list-item'
import '@material/mwc-select'
import '@polymer/iron-icons/iron-icons.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/grid'
import '@vaadin/grid/vaadin-grid-sorter'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

let workers = new Map()

class TradeBotBTC extends LitElement {
    static get properties() {
        return {
            selectedAddress: { type: Object },
            config: { type: Object },
            listedCoins: { type: Map },
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
            qortbtc: { type: Number },
            btcqort: { type: Number },
            tradeBotBtcBook: { type: Array },
            tradesBtcQortal: { type: Array },
            doneTradesBtcQortal: { type: Array },
            tradesAvailableBtcQortal: { type: Array },
            tradeBotBtcQortal: { type: Array },
            tradeBotAvailableBtcQortal: { type: Array },
            checkAlice: { type: String },
            botBuyAtAddress: { type: String },
            reAddAmount: { type: Number },
            reAddPrice: { type: Number }
        }
    }

    static get styles() {
        return css`
		* {
			--mdc-theme-primary: rgb(3, 169, 244);
			--mdc-theme-secondary: var(--mdc-theme-primary);
			--mdc-theme-error: rgb(255, 89, 89);
                  --mdc-text-field-outlined-idle-border-color: var(--txtfieldborder);
			--mdc-text-field-outlined-hover-border-color: var(--txtfieldhoverborder);
			--mdc-text-field-label-ink-color: var(--black);
			--mdc-text-field-ink-color: var(--black);
                  --mdc-select-outlined-idle-border-color: var(--txtfieldborder);
			--mdc-select-outlined-hover-border-color: var(--txtfieldhoverborder);
			--mdc-select-label-ink-color: var(--black);
			--mdc-select-ink-color: var(--black);
			--mdc-theme-surface: var(--white);
			--mdc-dialog-content-ink-color: var(--black);
                  --mdc-dialog-shape-radius: 25px;
			--paper-input-container-focus-color: var(--mdc-theme-primary);
			--lumo-primary-text-color: rgb(0, 167, 245);
			--lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
			--lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
			--lumo-primary-color: hsl(199, 100%, 48%);
			--lumo-base-color: var(--white);
			--lumo-body-text-color: var(--black);
			--lumo-secondary-text-color: var(--sectxt);
			--lumo-contrast-60pct: var(--vdicon);
			--_lumo-grid-border-color: var(--border);
			--_lumo-grid-secondary-border-color: var(--border2);
		}
		paper-spinner-lite {
			height: 30px;
			width: 30px;
			--paper-spinner-color: var(--mdc-theme-primary);
			--paper-spinner-stroke-width: 3px;
		}
		mwc-tab-bar {
			--mdc-text-transform: none;
			--mdc-tab-color-default: var(--black);
			--mdc-tab-text-label-color-default: var(--black);
		}
		#tabs-1 {
			--mdc-tab-height: 42px;
			border-left: 1px solid var(--tradeborder);
			border-top: 1px solid var(--tradeborder);
			border-right: 1px solid var(--tradeborder);
                  color: var(--black);
		}
		#tab-buy[active] {
			--mdc-theme-primary: rgba(55, 160, 51, 0.9);
		}
		#tabs-1-content {
			height: 100%;
			padding-bottom: 10px;
		}
		#tabs-1-content > div {
			height: 100%;
			border: 1px solid var(--tradeborder);
		}
		#tabs-1-content .card {
			border: none;
		}
		#tabs-1-content .btn-clear {
			--mdc-icon-button-size: 32px;
			color: var(--black);
		}
		.btn-clear-bot {
			--mdc-icon-button-size: 32px;
			color: var(--black);
                  float: right;
		}
		.btn-info {
    			color: var(--black);
			--mdc-icon-size: 16px;
                  padding-top: 3px;
		}
		#tab-sell[active] {
			--mdc-theme-primary: rgb(255, 89, 89); 
		}
		#trade-portal-page {
			background: var(--white);
			padding: 12px 24px;
		}
		.divCard {
			border: 1px solid var(--black);
			padding: 1em;
			box-shadow: 0 0.3px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.2);
		}
            h2 {
                margin: 10px 0;
            }

            h4 {
                margin: 5px 0;
            }

            p {
                font-size: 14px;
                line-height: 21px;
            }

            .card-body {
                background-color: var(--white);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                min-height: 100vh;
                margin: 0;
            }

            .card-container {
                background-color: var(--white);
                border-radius: 5px;
                color: var(--black);
                padding-top: 30px;
                position: relative;
                width: 350px;
                max-width: 100%;
                text-align: center;
            }

            .card-container .level {
                color: #ffffff;
                background-color: #03a9f4;
                border-radius: 3px;
                font-size: 14px;
                font-weight: bold;
                padding: 3px 7px;
                position: absolute;
                top: 30px;
                left: 30px;
            }

            .card-container .founder {
                color: #ffffff;
                background-color: #03a9f4;
                border-radius: 3px;
                font-size: 14px;
                font-weight: bold;
                padding: 3px 7px;
                position: absolute;
                top: 30px;
                right: 30px;
            }

            .card-container .round {
                width: 96px;
                height: 96px;
                border: 1px solid #03a9f4;
                border-radius: 50%;
                padding: 2px;
            }

            .card-container .badge {
                width: 200px;
                height: 135px;
                border: 1px solid transparent;
                border-radius: 10%;
                padding: 2px;
            }

            .userdata {
                background-color: #1F1A36;
                text-align: left;
                padding: 15px;
                margin-top: 30px;
            }

            .userdata ul {
                list-style-type: none;
                margin: 0;
                padding: 0;
            }

            .userdata ul li {
                border: 1px solid #2D2747;
                border-radius: 2px;
                display: inline-block;
                font-size: 12px;
                margin: 0 7px 7px 0;
                padding: 7px;
            }

		h2,
		h3,
		h4,
		h5 {
			color: var(--black);
			font-weight: 400;
		}
		header {
			display: flex;
			flex: 0 1 auto;
			align-items: center;
			justify-content: center;
			padding: 0px 10px;
			font-size: 16px;
			color: var(--white);
			background-color: var(--tradehead);
			border-left: 1px solid var(--tradeborder);
			border-top: 1px solid var(--tradeborder);
			border-right: 1px solid var(--tradeborder);
			min-height: 40px;
		}
		p {
			margin-bottom: 12px;
		}
		#trade-portal {
			max-width: 100vw;
			margin-left: auto;
			margin-right: auto;
		}
		.box {
			margin: 0;
			padding: 0;
			display: flex;
			flex-flow: column;
			height: 100%;
		}
		.box-bot {
			margin: 0;
			padding: 0;
			display: flex;
			flex-flow: column;
			height: 150px;
		}
		#first-trade-section {
			margin-bottom: 10px;
		}
		#first-trade-section > div {
		}
		#second-trade-section {
			margin-bottom: 10px;
		}
		#second-trade-section > div {
		}
		#third-trade-section {
			margin-bottom: 10px;
		}
		#third-trade-section > div {
		}
		.trade-chart {
			background-color: var(--white);
			border: 2px #ddd solid;
			text-align: center;
		}
		.open-trades {
			text-align: center;
		}
		.open-market-container {
			text-align: center;
		}
		.trade-bot-container {
			text-align: center;
		}
		.no-last-seen {
			background: rgb(255, 89, 89);
			padding: 9px 1.3px;
			border-radius: 50%;
			width: 1rem;
			margin: 0 auto;
		}
		.card {
			padding: 1em;
			border: 1px var(--tradeborder) solid;
			flex: 1 1 auto;
			display: flex;
			flex-flow: column;
			justify-content: space-evenly;
			min-height: inherit;
		}
		.card-bot {
			padding: 1em;
			flex: 1 1 auto;
			display: flex;
			flex-flow: column;
			justify-content: space-evenly;
                  width: 350px;
			min-height: inherit;
		}
		.cancel {
			--mdc-theme-primary: rgb(255, 89, 89);
		}
		.border-wrapper {
			border: 1px var(--tradeborder) solid;
			overflow: hidden;
		}
		.amt-text {
			color: var(--tradehave);
			font-size: 15px;
			margin-top: 5px;
			margin-bottom: 12px;
		}
		.exchange {
			color: var(--black);
			font-size: 18px;
                  font-weight: bold;
			margin-top: 5px;
			margin-bottom: 10px;
		}
		.clear-button {
                  display: inline;
			float: right;
			margin-bottom: 5px;
		}
		.exhcnage-text {
                  display: inline;
			float: left;
			margin-bottom: 5px;
		}
		.balance-text {
                  display: inline;
			float: right;
			margin-bottom: 5px;
		}
		.fee-text {
                  display: inline;
			float: left;
			margin-bottom: 5px;
		}
		.tab-text {
			color: var(--tradehave);
			font-size: 12px;
			text-align: left;
			margin-top: 2px;
			margin-bottom: -12px;
		}
		.historic-trades {
			text-align: center;
		}
		.my-open-orders {
			text-align: center;
		}
		.my-historic-trades {
			text-align: center;
		}
		.buttons {
			width: auto !important;
		}
		.buy-button {
			--mdc-theme-primary: rgba(55, 160, 51, 0.9);
		}
		.sell-button {
			--mdc-theme-primary: rgb(255, 89, 89);
		}
		.trade-bot-button {
			margin-top: 20px;
			margin-bottom: 20px;
			--mdc-theme-primary: rgba(55, 160, 51, 0.9);
		}
		.full-width {
			background-color: var(--white);
			border: 2px var(--black);
			height: 200px;
			text-align: center;
		}
		vaading-grid {
			font-size: .8em;
		}
		vaadin-grid-column {
			flex-grow: 1;
		}
		.loadingContainer {
			height: 100%;
			width: 100%;
		}
		.loading,
		.loading:after {
			border-radius: 50%;
			width: 5em;
			height: 5em;
		}
		.loading {
			margin: 10px auto;
			border-width: .6em;
			border-style: solid;
			border-color: rgba(3, 169, 244, 0.2) rgba(3, 169, 244, 0.2) rgba(3, 169, 244, 0.2) rgb(3, 169, 244);
			font-size: 10px;
			position: relative;
			text-indent: -9999em;
			transform: translateZ(0px);
			animation: 1.1s linear 0s infinite normal none running loadingAnimation;
		}
		mwc-select#coinSelectionMenu {
			font-size: 24px;
                  width:220px;
		}
		mwc-select#coinSelectionMenu mwc-list-item {
			line-height: 30px;
		}
		.coinName::before  {
			content: "";
			display: inline-block;
			height: 26px;
			width: 45px;
			position: absolute;
			background-repeat: no-repeat;
			background-size: cover;
			left: 10px;
			top: 10px;
		}
		.coinName {
			display: inline-block;
			height: 26px;
			padding-left: 45px;
		}
		.warning-text {
			animation: blinker 1.5s linear infinite;
                  display: inline;
			float: left;
			margin-bottom: 5px;
			color: rgb(255, 89, 89);
		}
		.warning-bot-text {
			animation: blinker 1.5s linear infinite;
                  display: inline;
			text-align: center;
			color: rgb(255, 89, 89);
		}
		.red {
			--mdc-theme-primary: #F44336;
		}
		@-webkit-keyframes loadingAnimation {
			0% {
				-webkit-transform: rotate(0deg);
				transform: rotate(0deg);
			}
			100% {
				-webkit-transform: rotate(360deg);
				transform: rotate(360deg);
			}
		}
		@keyframes loadingAnimation {
			0% {
				-webkit-transform: rotate(0deg);
				transform: rotate(0deg);
			}
			100% {
				-webkit-transform: rotate(360deg);
				transform: rotate(360deg);
			}
		}
		@keyframes blinker {
			50% {
				opacity: 0;
			}
		}
		@media (min-width: 701px) {
			* {
			}
			#trade-portal {}
			#first-trade-section {
				display: grid;
				grid-template-columns:1fr 4fr 1fr;
				grid-auto-rows: max(350px);
				column-gap: 0.5em;
				row-gap: 0.4em;
				justify-items: stretch;
				align-items: stretch;
				margin-bottom: 10px;
			}
			#second-trade-section {
				display: grid;
				grid-template-columns:1fr 4fr 1fr;
				grid-auto-rows: max(350px);
				column-gap: 0.5em;
				row-gap: 0.4em;
				justify-items: stretch;
				align-items: stretch;
				margin-bottom: 10px;
			}
			#third-trade-section {
				display: grid;
				grid-template-columns: 1fr 4fr 1fr;
				grid-auto-rows: max(150px);
				column-gap: 0.5em;
				row-gap: 0.4em;
				justify-items: stretch;
				align-items: stretch;
				margin-bottom: 10px;
			}
			#fourth-trade-section {
				display: grid;
				grid-template-columns: 1fr 4fr 1fr;
				grid-auto-rows: max(150px);
				column-gap: 0.5em;
				row-gap: 0.4em;
				justify-items: stretch;
				align-items: stretch;
				margin-bottom: 10px;
			}
		}
        `
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
            openTradeOrders: null,
            tradeOffersSocketCounter: 1,
            coinAmount: this.amountString,
            tradeFee: "~0.0001"
        }

        this.listedCoins = new Map()
        this.listedCoins.set("QORTAL", qortal)
        this.listedCoins.set("BITCOIN", bitcoin)

        workers.set("QORTAL", {
            tradesConnectedWorker: null,
            handleStuckTradesConnectedWorker: null
        })

        workers.set("BITCOIN", {
            tradesConnectedWorker: null,
            handleStuckTradesConnectedWorker: null
        })

        this.selectedCoin = "BITCOIN"
        this.selectedAddress = {}
        this.config = {}
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
        this.qortbtc = 0
        this.btcqort = 0
        this.tradeBotBtcBook = []
        this.tradesBtcQortal = []
        this.doneTradesBtcQortal = []
        this.tradesAvailableBtcQortal = []
        this.tradeBotBtcQortal = []
        this.tradeBotAvailableBtcQortal = []
        this.checkAlice = ''
        this.botBuyAtAddress = ''
        this.reAddAmount = 0
        this.reAddPrice = 0
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
				<header><span>${translate("tradepage.tchange36")}</span></header>
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
					<vaadin-grid theme="compact column-borders row-stripes wrap-cell-content" id="myDoneTradesGrid" aria-label="My Buyed Qortal" .items="${this.doneTradesBtcQortal}">
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
				<header><span>${translate("tradepage.tchange39")} ${this.listedCoins.get(this.selectedCoin).coinCode} ==> QORT</span></header>
				<div class="border-wrapper">
					<vaadin-grid theme="compact column-borders row-stripes wrap-cell-content" id="tradeBotBTCGrid" aria-label="Auto Buy Bot BTC" ?hidden="${this.isEmptyArray(this.tradeBotBtcBook)}" .items="${this.tradeBotBtcBook}">
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

    render() {
        return html`
		<div id="trade-portal-page">
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
						readOnly
						label=""
						placeholder="0.0000000"
						type="number"
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
        `
    }

    async firstUpdated() {

        let _this = this

        this.changeTheme()
        this.changeLanguage()
        await this.updateWalletBalance()

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
        this._myHistoricTradesGrid = this.shadowRoot.getElementById('myHistoricTradesGrid')

        const delay = ms => new Promise(res => setTimeout(res, ms))

        const getQortBtcPrice = () => {
            parentEpml.request("apiCall", { url: `/crosschain/price/BITCOIN?inverse=true` }).then((res) => {
                setTimeout(() => { this.qortbtc = (Number(res) / 1e8).toFixed(8) }, 1)
            })
            setTimeout(getQortBtcPrice, 300000)
        }

        const filterMyPriceTradesBTC = async () => {
            const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
            const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
            const tradeBotBtcQortalUrl = `${nodeUrl}/crosschain/tradebot?foreignBlockchain=BITCOIN&apiKey=${this.getApiKey()}`
            const waitFor = ms => new Promise(res => setTimeout(res, ms))
            let timer

            const tradeBotBtcQortal = await fetch(tradeBotBtcQortalUrl).then(response => {
                return response.json()
            })

            this.tradeBotBtcQortal = tradeBotBtcQortal

            await waitFor(1000)

            if (this.isEmptyArray(this.tradeBotBtcBook) === true) {
                clearTimeout(timer)
                timer = setTimeout(filterMyPriceTradesBTC, 180000)
                return
            } else {
                clearTimeout(timer)
                timer = setTimeout(filterMyPriceTradesBTC, 180000)

                this.tradeBotAvailableBtcQortal = this.listedCoins.get(this.selectedCoin).openFilteredOrders.map(item => {
                    const listprice = parseFloat(item.price)
                    const listamount = parseFloat(item.qortAmount)
                    const checkprice = parseFloat(this.tradeBotBtcBook[0].botBtcPrice)
                    const checkamount = parseFloat(this.tradeBotBtcBook[0].botBtcQortAmount)
                    if (Number(listprice) <= Number(checkprice) && Number(listamount) <= Number(checkamount)) {
                        return {
                            qortAmount: item.qortAmount,
                            price: item.price,
                            foreignAmount: item.foreignAmount,
                            qortalCreator: item.qortalCreator,
                            qortalAtAddress: item.qortalAtAddress
                        }
                    }
                }).filter(item => !!item)

                this.tradeBotAvailableBtcQortal.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))

                if (this.isEmptyArray(this.tradeBotAvailableBtcQortal) === true) {
                    return
                } else {
                    this.checkAlice = this.tradeBotAvailableBtcQortal[0].qortalAtAddress
                }

                await waitFor(1000)

                if (this.tradeBotBtcQortal.some(item => item.atAddress === this.checkAlice)) {
                    return
                } else {
                    this.tradesAvailableBtcQortal = this.tradeBotAvailableBtcQortal
                }
            }

            await waitFor(1000)

            if (this.isEmptyArray(this.tradesAvailableBtcQortal) === true) {
                return
            } else {
                const botprice = this.round(parseFloat(this.tradeBotBtcBook[0].botBtcPrice))
                const changeamount = parseFloat(this.tradeBotBtcBook[0].botBtcQortAmount)
                const reduceamount = parseFloat(this.tradesAvailableBtcQortal[0].qortAmount)
                const tradeataddress = this.tradesAvailableBtcQortal[0].qortalAtAddress
                const newamount = this.round(parseFloat(changeamount - reduceamount))

                this.reAddAmount = this.round(parseFloat(this.tradeBotBtcBook[0].botBtcQortAmount))
                this.reAddPrice = this.round(parseFloat(this.tradeBotBtcBook[0].botBtcPrice))

                localStorage.removeItem(this.btcWallet)
                localStorage.setItem(this.btcWallet, "")

                var oldBtcTradebook = JSON.parse(localStorage.getItem(this.btcWallet) || "[]")

                const newBtcTradebookItem = {
                    botBtcQortAmount: newamount,
                    botBtcPrice: botprice
                }

                oldBtcTradebook.push(newBtcTradebookItem)

                localStorage.setItem(this.btcWallet, JSON.stringify(oldBtcTradebook))

                this.tradeBotBtcBook = JSON.parse(localStorage.getItem(this.btcWallet) || "[]")

                await waitFor(1000)

                this.botBuyAtAddress = tradeataddress

                this.buyAction()

                if (this.isEmptyArray(this.tradeBotBtcBook) === true) {
                    return
                } else {
                    const botamount = parseFloat(this.tradeBotBtcBook[0].botBtcQortAmount)

                    if (Number(botamount) === 0) {
                        this.removeBTCTradebook()
                    } else {
                        this.tradeBotBtcBook = this.tradeBotBtcBook
                    }
                }

                if (this.isEmptyArray(this.tradeBotBtcBook) === true) {
                    return
                } else {
                    const checkBotFunds = this.round(parseFloat(this.tradeBotBtcBook[0].botBtcQortAmount) * parseFloat(this.tradeBotBtcBook[0].botBtcPrice))
                    const myBotFunds = this.round(parseFloat(this.listedCoins.get(this.selectedCoin).balance))

                    if (Number(myBotFunds) < Number(checkBotFunds)) {
                        this.removeBTCTradebook()
                    } else {
                        this.tradeBotBtcBook = this.tradeBotBtcBook
                    }
                }
            }
        }

        const getDoneTradeBTC = async () => {
            this.isLoadingDoneTrades = true
            const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
            const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
            const doneBtcQortalUrl = `${nodeUrl}/crosschain/trades?foreignBlockchain=BITCOIN&minimumTimestamp=1597310000000&limit=0&reverse=true`
            const myAddress = window.parent.reduxStore.getState().app.selectedAddress.address

            const doneBtcQortal = await fetch(doneBtcQortalUrl).then(response => {
                return response.json()
            })

            this.doneTradesBtcQortal = doneBtcQortal.map(item => {
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
            setTimeout(getDoneTradeBTC, 600000)
        }

        window.addEventListener('contextmenu', (event) => {
            event.preventDefault()
            this._textMenu(event)},
            { passive: true }
        )

        window.addEventListener('click', () => {
            parentEpml.request('closeCopyTextMenu', null)},
            { passive: true }
        )

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
            if (e.keyCode === 27) parentEpml.request('closeCopyTextMenu', null)
        }

        this.btcWallet = window.parent.reduxStore.getState().app.selectedAddress.btcWallet.address

        let configLoaded = false

        parentEpml.ready().then(() => {
            parentEpml.subscribe('selected_address', async (selectedAddress) => {
                this.selectedAddress = {}
                selectedAddress = JSON.parse(selectedAddress)
                if (!selectedAddress || Object.entries(selectedAddress).length === 0) return
                this.selectedAddress = selectedAddress
                this.btcWwallet = window.parent.reduxStore.getState().app.selectedAddress.btcWallet.address
                await this.updateAccountBalance()
                await this.btcTradebook()  
            })

            parentEpml.subscribe('config', (c) => {
                if (!configLoaded) {
                    setTimeout(getQortBtcPrice, 1)
                    setTimeout(getDoneTradeBTC, 1)
                    configLoaded = true
                }
                this.config = JSON.parse(c)
            })

            parentEpml.subscribe('copy_menu_switch', async (value) => {
                if (value === 'false' && window.getSelection().toString().length !== 0) this.clearSelection()
            })
            this.setForeignCoin()
        })
        parentEpml.imReady()

        setTimeout(() => this.shadowRoot.querySelector('[slot="vaadin-grid-cell-content-3"]').setAttribute('title', 'Last Seen'), 3000)

        this.btcTradebook()
        await delay(3000)
        filterMyPriceTradesBTC()
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

    renderFetchText() {
        return html`${translate("walletpage.wchange1")}`
    }

    renderWarning() {
        return html`<span class="warning-text">NOT ENOUGH ${this.listedCoins.get(this.selectedCoin).coinCode}</span>`
    }

    renderBotWarning() {
        return html`<span class="warning-bot-text">NOT ENOUGH ${this.listedCoins.get(this.selectedCoin).coinCode} ! AUTO BUY BOT IS STOPPED</span>`
    }

    exchangeRateQort() {
        return html`${this.qortbtc}`
    }

    showAutoBuyGrid() {
        return html`${this.tradeBotBTCTemplate()}`
    }

    showAddToAutoBuyStore() {
        this.addToBTCTradebook()
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
        this.firstUpdated()
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
        this.tradesAvailableBtcQortal = []
    }

    exchangeRateForeign() {
        parentEpml.request('apiCall', {
            url: `/crosschain/price/BITCOIN?inverse=false`
        }).then((res) => {
            this.btcqort = (Number(res) / 1e8).toFixed(8)
        })
        return html`${this.btcqort}`
    }

    async updateWalletBalance() {
        let _url = `/crosschain/btc/walletbalance?apiKey=${this.getApiKey()}`
        let _body = window.parent.reduxStore.getState().app.selectedAddress.btcWallet.derivedMasterPublicKey

        this.showGetWalletBance = true
        this.showAddAutoBuy = false

        await parentEpml.request('apiCall', {
            url: _url,
            method: 'POST',
            body: _body,
        }).then((res) => {
            if (isNaN(Number(res))) {
                let snack1string = get("tradepage.tchange30")
                parentEpml.request('showSnackBar', `${snack1string}`)
            } else {
                this.listedCoins.get(this.selectedCoin).balance = (Number(res) / 1e8).toFixed(8)
            }
        })

        this.showGetWalletBance = false
        this.showAddAutoBuy = true
    }

    async setForeignCoin() {
        let _this = this
        this.selectedCoin = "BITCOIN"

        this.isLoadingOpenTrades = true
        await this.createConnection()

        this._openOrdersGrid.querySelector('#priceColumn').headerRenderer = function (root) {
            const priceString2 = get("tradepage.tchange9")
            root.innerHTML = '<vaadin-grid-sorter path="price" direction="asc">' + priceString2 + ' (' + _this.listedCoins.get(_this.selectedCoin).coinCode + ')</vaadin-grid-sorter>'
        }

        this.autoBuyBotDisable = false
        await this.updateWalletBalance()
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
        const checkAmount = this.round(parseFloat(checkTradeBotAmountInput))
        const checkPrice = this.round(parseFloat(checkTradeBotPriceInput))

        if (Number(checkAmount) === 0) {
            let amountString = get("tradepage.tchange34")
            parentEpml.request('showSnackBar', `${amountString}`)
        } else if (Number(checkPrice) === 0) {
            let priceString = get("tradepage.tchange35")
            parentEpml.request('showSnackBar', `${priceString}`)
        } else {
            this.showAddToAutoBuyStore()
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

    /**
    * TRADE OFFER STATES or MODE
    *  - OFFERING
    */

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

        switch (this.selectedCoin) {
            case 'BITCOIN':
                BitcoinACCTv1(tradeStates)
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
                socketTimeout = setTimeout(pingSocket, 150000)
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
                socketTimeout = setTimeout(pingSocket, 150000)
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
                socketTimeout = setTimeout(pingSocket, 150000)
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

    async buyAction() {
        const qortalAtAddress = this.botBuyAtAddress
        let _foreignKey = this.selectedAddress.btcWallet.derivedMasterPrivateKey

        const makeRequest = async () => {
            const response = await parentEpml.request('tradeBotRespondRequest', {
                atAddress: qortalAtAddress,
                foreignKey: _foreignKey,
                receivingAddress: this.selectedAddress.address,
            })
            return response
        }

        const manageResponse = (response) => {
            if (response === true) {
                this.isBuyLoading = false
                this.buyBtnDisable = true
                let snack5string = get("tradepage.tchange23")
                parentEpml.request('showSnackBar', `${snack5string}`)
            } else if (response === false) {
                this.isBuyLoading = false
                this.buyBtnDisable = false

                localStorage.removeItem(this.btcWallet)
                localStorage.setItem(this.btcWallet, "")

                var oldBtcTradebook = JSON.parse(localStorage.getItem(this.btcWallet) || "[]")

                const newBtcTradebookItem = {
                    botBtcQortAmount: this.reAddAmount,
                    botBtcPrice: this.reAddPrice
                }

                oldBtcTradebook.push(newBtcTradebookItem)

                localStorage.setItem(this.btcWallet, JSON.stringify(oldBtcTradebook))

                this.tradeBotBtcBook = JSON.parse(localStorage.getItem(this.btcWallet) || "[]")

                let snack6string = get("tradepage.tchange24")
                parentEpml.request('showSnackBar', `${snack6string}`)
            } else {
                this.isBuyLoading = false
                this.buyBtnDisable = false

                localStorage.removeItem(this.btcWallet)
                localStorage.setItem(this.btcWallet, "")

                var oldBtcTradebook = JSON.parse(localStorage.getItem(this.btcWallet) || "[]")

                const newBtcTradebookItem = {
                    botBtcQortAmount: this.reAddAmount,
                    botBtcPrice: this.reAddPrice
                }

                oldBtcTradebook.push(newBtcTradebookItem)

                localStorage.setItem(this.btcWallet, JSON.stringify(oldBtcTradebook))

                this.tradeBotBtcBook = JSON.parse(localStorage.getItem(this.btcWallet) || "[]")

                let snack7string = get("tradepage.tchange25")
                parentEpml.request('showSnackBar', `${snack7string}: ${response.message}`)
            }
        }
        const res = await makeRequest()
        manageResponse(res)
    }

    updateAccountBalance() {
        clearTimeout(this.updateAccountBalanceTimeout)
        parentEpml.request('apiCall', {
            url: `/addresses/balance/${this.selectedAddress.address}?apiKey=${this.getApiKey()}`,
        }).then((res) => {
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

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
        let apiKey = myNode.apiKey;
        return apiKey;
    }

    clearSelection() {
        window.getSelection().removeAllRanges()
        window.parent.getSelection().removeAllRanges()
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
                let _eve = {
                    pageX: event.pageX,
                    pageY: event.pageY,
                    clientX: event.clientX,
                    clientY: event.clientY,
                }
                let textMenuObject = {
                    selectedText: selectedText,
                    eventObject: _eve,
                    isFrame: true,
                }
                parentEpml.request('openCopyTextMenu', textMenuObject)
            }
        }
        checkSelectedTextAndShowMenu()
    }

    clearTradeBotForm() {
        this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'QortAmountInput').value = this.initialBotAmount
        this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'PriceInput').value = this.initialAmount
        this.shadowRoot.getElementById('autoBuy' + this.listedCoins.get(this.selectedCoin).coinCode + 'TotalInput').value = this.initialBotAmount
        this.autoBuyBtnDisable = true
    }

    isEmptyArray(arr) {
        if (!arr) {
            return true
        }
        return arr.length === 0
    }

    round(number) {
        let result = (Math.round(parseFloat(number) * 1e8) / 1e8).toFixed(8)
        return result
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
                    this.listedCoins.get(message.data.relatedCoin).openOrders = message.data.offers
                    this.listedCoins.get(message.data.relatedCoin).openFilteredOrders = message.data.filteredOffers
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
}

window.customElements.define('trade-bot-btc', TradeBotBTC)