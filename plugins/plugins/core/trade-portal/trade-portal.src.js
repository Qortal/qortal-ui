import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../epml.js'
import isElectron from 'is-electron'
import { use, get, translate, translateUnsafeHTML, registerTranslateConfig } from 'lit-translate'
import Base58 from '../../../../crypto/api/deps/Base58.js'
import { encryptData, decryptData } from '../../../../core/src/lockScreen.js'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

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
import chartsbtc from './charts/btc-charts.js'
import chartsltc from './charts/ltc-charts.js'
import chartsdoge from './charts/doge-charts.js'
import chartsdgb from './charts/dgb-charts.js'
import chartsrvn from './charts/rvn-charts.js'
import chartsarrr from './charts/arrr-charts.js'
import '../components/TraderInfoView.js'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

let workers = new Map()

class TradePortal extends LitElement {
    static get properties() {
        return {
            selectedAddress: { type: Object },
            config: { type: Object },
            listedCoins: { type: Map },
            nodeInfo: { type: Array },
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
            qortRatio: {type: Number},
            tradeSalt: { type: String },
            tradeStorageData: { type: String },
            tradeLockScreenPass: { type: String },
            tradeLockScreenSet: { type: String },
            tradeLockPass: { type: String },
            tradeLockSet: { type: String },
            myTradeLockScreenPass: { type: String },
            myTradeLockScreenSet: { type: String },
            tradeHelperMessage: { type: String }
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

                .myhover vaadin-grid-cell-content {
			cursor: pointer;
		}
		.myhover vaadin-grid::part(selected-row) {
			color: green;
			cursor: pointer;
		}
		.myhover vaadin-grid::part(focused-selected-row) {
			color: green;
			cursor: pointer;
		}
		.myhover vaadin-grid::part(cell):hover {
			cursor: pointer;
		}
		.myhover vaadin-grid::part(row):hover {
			color: green;
			cursor: pointer;
		}
                .myhover vaadin-grid::part(selected-row-cell) {
			color: green;
			cursor: pointer;
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
    			color: #03a9f4;
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
		.btc.coinName:before  {
			background-image: url('/img/qortbtc.png');
		}
		.ltc.coinName:before  {
			background-image: url('/img/qortltc.png');
		}
		.doge.coinName:before  {
			background-image: url('/img/qortdoge.png');
		}
		.dgb.coinName:before  {
			background-image: url('/img/qortdgb.png');
		}
		.rvn.coinName:before  {
			background-image: url('/img/qortrvn.png');
		}
            .arrr.coinName:before  {
			background-image: url('/img/qortarrr.png');
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
            paper-dialog.info {
                width: 100%;
                max-width: 75vw;
                height: 100%;
                max-height: 50vh;
                background-color: var(--white);
                color: var(--black);
                border: 1px solid var(--black);
                border-radius: 15px;
                line-height: 1.6;
                overflow-y: auto;
            }
            .actions {
                display: flex;
                justify-content: space-between;
                padding: 0 1em;
                margin: 12px 0 -6px 0;
            }
            .close-icon {
                font-size: 36px;
            }
            .close-icon:hover {
                cursor: pointer;
                opacity: .6;
            }

            .setpass-wrapper {
                width: 100%;
                min-width: 400px;
                max-width: 450px;
                text-align: center;
                background: var(--white);
                border: 1px solid var(--black);
                border-radius: 15px;
                padding: 10px 10px 0px;
                box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
             }

             .lock-wrapper {
                 width: 100%;
                 height: 100%;
                 min-width: 600px;
                 max-width: 600px;
                 min-height: 400px;
                 max-height: 400px;
                 text-align: center;
                 background: url("/img/qortal-lock.jpg");
                 border: 1px solid var(--black);
                 border-radius: 25px;
                 padding: 10px 10px 0px;
             }

             .text-wrapper {
                 width: 100%;
                 height: 100%;
                 min-width: 280px;
                 max-width: 280px;
                 min-height: 64px;
                 max-height: 64px;
                 text-align: center;
                 margin-left: 35px;
                 margin-top: 125px;
                 overflow: hidden;
             }

            .lock-title-white {
                font-family: 'magistralbold';
                font-weight: 700;
                font-size: 26px;
                line-height: 32px;
                color: #ffffff;
            }

            .lock-title-red {
                font-family: 'magistralbold';
                font-weight: 700;
                font-size: 26px;
                line-height: 32px;
                color: #df3636;
            }

            @media (min-width: 701px) {
                * {
                }
                #trade-portal {}
                #first-trade-section {
                    display: grid;
                    grid-template-columns:1fr 1fr 2fr;
                    grid-auto-rows: max(450px);
                    column-gap: 0.5em;
                    row-gap: 0.4em;
                    justify-items: stretch;
                    align-items: stretch;
                    margin-bottom: 10px;
                }
                #second-trade-section {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    grid-auto-rows: max(450px);
                    column-gap: 0.5em;
                    row-gap: 0.4em;
                    justify-items: stretch;
                    align-items: stretch;
                    margin-bottom: 10px;
                }
                #third-trade-section {
                    display: grid;
                    grid-template-columns: 1fr 2fr 1fr;
                    grid-auto-rows: max(200px);
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
        this.nodeInfo = []
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
        this.tradeInfoAccountName = ''
        this.tradeImageUrl = ''
        this.tradeAddressResult = []
        this.displayTradeAddress = ''
        this.displayTradeLevel = ''
        this.displayTradeBalance = ''
        this.tradeSalt = ''
        this.tradeStorageData = ''
        this.tradeLockScreenPass = ''
        this.tradeLockScreenSet = ''
        this.tradeLockPass = ''
        this.tradeLockSet = ''
        this.myTradeLockScreenPass = ''
        this.myTradeLockScreenSet = ''
        this.tradeHelperMessage = ''
    }

    historicTradesTemplate() {
        return html`
		<div class="historic-trades">
			<div class="box">
				<header><span>${translate("tradepage.tchange3")}</span></header>
				<div class="border-wrapper">
					<div class="loadingContainer" id="loadingHistoricTrades" style="display:${this.isLoadingHistoricTrades ? 'block' : 'none'}"><div class="loading"></div><span style="color: var(--black);">${translate("login.loading")}</span></div>
					<vaadin-grid theme="compact column-borders row-stripes wrap-cell-content" id="historicTradesGrid" aria-label="Historic Trades" .items="${this.listedCoins.get(this.selectedCoin).historicTrades}">
						<vaadin-grid-column auto-width resizable header="${translate("tradepage.tchange8")} (QORT)" path="qortAmount"></vaadin-grid-column>
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

    openTradesTemplate() {
        return html`
		<div class="open-trades myhover">
			<div class="box">
				<header><span>${translate("tradepage.tchange5")}</span></header>
				<div class="border-wrapper">
					<div class="loadingContainer" id="loadingHistoricTrades" style="display:${this.isLoadingOpenTrades ? 'block' : 'none'}"><div class="loading"></div><span style="color: var(--black);">${translate("login.loading")}</span></div>
					<vaadin-grid
						multi-sort="true"
						theme="compact column-borders row-stripes"
						wrap-cell-content
						id="openOrdersGrid"
						aria-label="Open Orders"
						.items="${this.listedCoins.get(this.selectedCoin).openFilteredOrders}"
					>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange8")} (QORT)"
							id="qortAmountColumn"
							.renderer=${(root, column, data) => {
								render(html`<span style="cursor: pointer;" @click="${() => this.fillBuyForm(data)}">${this.round(data.item.qortAmount)}</span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange9")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
							id="priceColumn"
							.renderer=${(root, column, data) => {
								render(html`<span style="cursor: pointer;" @click="${() => this.fillBuyForm(data)}">${this.round(data.item.price)}</span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange10")} (${this.listedCoins.get(this.selectedCoin).coinCode})"
							id="foreignAmountColumn"
							.renderer=${(root, column, data) => {
								render(html`<span style="cursor: pointer;" @click="${() => this.fillBuyForm(data)}">${data.item.foreignAmount}</span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange13")}"
							id="qortalCreatorColumn"
							.renderer=${(root, column, data) => {
								render(html`<span style="cursor: pointer;" @click="${() => this.fillBuyForm(data)}">${data.item.qortalCreator}</span>`, root)
							}}
						>
						</vaadin-grid-column>
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("explorerpage.exp7")}"
							.renderer=${(root, column, data) => {
								render(html`<span style="cursor: pointer;" @click="${() => this.requestTraderInfo(data.item.qortalCreator)}"><mwc-icon class="btn-info">info</mwc-icon></span>`, root)
							}}
						>
						</vaadin-grid-column>
					</vaadin-grid>
				</div>
			</div>
		</div>
        `
    }

    openMarketTemplate() {
        return html`
		<div class="open-market-container">
			<div class="box">
				<mwc-tab-bar id="tabs-1" activeIndex="0">
					<mwc-tab id="tab-buy" label="${translate("tradepage.tchange18")} QORT" @click="${(e) => this.displayTabContent('buy')}"></mwc-tab>
					<mwc-tab id="tab-sell" label="${translate("tradepage.tchange19")} QORT" @click="${(e) => this.displayTabContent('sell')}"></mwc-tab>
				</mwc-tab-bar>
				<z id="tabs-1-content">
					<div id="tab-buy-content">
						<div class="card">
							<div style="margin-left: auto">
								<mwc-icon-button class="btn-clear" title="${translate("tradepage.tchange15")}" icon="clear_all" @click="${() => this.clearBuyForm()}"></mwc-icon-button>
							</div>
                                          <span class="tab-text">${translate("tradepage.tchange8")} (QORT)*</span>
							<p>
								<mwc-textfield
									style="width: 100%; color: var(--black);"
									id="buyAmountInput"
									required readOnly
                                                      label=""
									placeholder="0.0000"
									type="text" 
									auto-validate="false"
									outlined value="${this.initialAmount}"
								>
								</mwc-textfield>
							</p>
                                          <span class="tab-text">${translate("tradepage.tchange14")} (${this.listedCoins.get(this.selectedCoin).coinCode})*</span>
							<p>
								<mwc-textfield
									style="width: 100%; color: var(--black);"
									id="buyPriceInput"
									required readOnly
									label=""
									placeholder="0.0000"
									type="text"
									auto-validate="false"
									outlined value="${this.initialAmount}"
								>
								</mwc-textfield>
							</p>
                                          <span class="tab-text">${translate("tradepage.tchange10")} (${this.listedCoins.get(this.selectedCoin).coinCode})*</span>
							<p>
								<mwc-textfield
									style="width: 100%; color: var(--black);"
									id="buyTotalInput"
									required readOnly
									label=""
									placeholder="0.0000"
									type="text"
									auto-validate="false"
									outlined value="${this.initialAmount}"
								>
								</mwc-textfield>
								<mwc-textfield
									style="display: none; visibility: hidden;"
									id="qortalAtAddress"
									required readOnly
									label="Qortal AT Address"
									type="text"
									auto-validate="false"
									outlined
								>
								</mwc-textfield>
							</p>
							<span class="amt-text">
                                              <span class="balance-text">${translate("tradepage.tchange16")}: ${this.listedCoins.get(this.selectedCoin).balance} ${this.listedCoins.get(this.selectedCoin).coinCode}</span>
                                              <span class="fee-text">${translate("walletpage.wchange12")}: ${this.listedCoins.get(this.selectedCoin).tradeFee} ${this.listedCoins.get(this.selectedCoin).coinCode}</span>
                                          </span>
							<div class="buttons">
								<div>
									<mwc-button class="buy-button" ?disabled="${this.buyBtnDisable}" style="width:100%;" raised @click="${(e) => this.buyAction(e)}">
										${this.isBuyLoading === false ? html`${translate("tradepage.tchange18")}` : html`<paper-spinner-lite active></paper-spinner-lite>`}
									</mwc-button>
								</div>
							</div>
						</div>
					</div>
					<div id="tab-sell-content">
						<div class="card">
							<div style="margin-left: auto">
								<mwc-icon-button class="btn-clear" title="${translate("tradepage.tchange15")}" icon="clear_all" @click="${() => this.clearSellForm()}"></mwc-icon-button>
							</div>
							<span class="tab-text">${translate("tradepage.tchange8")} (QORT)*</span>
							<p>
								<mwc-textfield
									style="width: 100%; color: var(--black);"
									id="sellAmountInput"
									required
                                                      label=""
									placeholder="0.0000"
									@input="${(e) => { this._checkSellAmount(e) }}"
									type="number"
									auto-validate="false"
									outlined value="${this.initialAmount}"
								>
								</mwc-textfield>
							</p>
                                          <span class="tab-text">${translate("tradepage.tchange14")} (${this.listedCoins.get(this.selectedCoin).coinCode})*</span>
							<p>
								<mwc-textfield
									style="width: 100%; color: var(--black);"
									id="sellPriceInput"
									required
                                                      label=""
									placeholder="0.0000"
									@input="${(e) => { this._checkSellAmount(e) }}"
									type="number"
									auto-validate="false"
									outlined value="${this.initialAmount}"
								>
								</mwc-textfield>
							</p>
                                          <span class="tab-text">${translate("tradepage.tchange10")} (${this.listedCoins.get(this.selectedCoin).coinCode})*</span>
							<p>
								<mwc-textfield
									style="width: 100%; color: var(--black);"
									id="sellTotalInput"
									required readOnly
									label=""
									placeholder="0.0000"
									type="number"
									auto-validate="false"
									outlined value="${this.initialAmount}"
								>
								</mwc-textfield>
							</p>
							<span class="amt-text">
                                              <span class="balance-text">${translate("tradepage.tchange16")}: ${this.listedCoins.get("QORTAL").balance} QORT</span>
							    <span class="fee-text">${translate("walletpage.wchange12")}: ${this.listedCoins.get("QORTAL").tradeFee} QORT</span>
                                          </span>
							<div class="buttons">
								<div>
									<mwc-button class="sell-button" ?disabled="${this.sellBtnDisable}" style="width:100%;" raised @click="${(e) => this.sellAction()}">
										${this.isSellLoading === false ? html`${translate("tradepage.tchange19")}` : html`<paper-spinner-lite active></paper-spinner-lite>`}
									</mwc-button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>	
		</div>
        `
    }

    myOpenOrdersTemplate() {
        return html`
		<div class="my-open-orders">
			<div class="box">
				<header><span>${translate("tradepage.tchange6")}</span><mwc-icon-button title="${translate("tradepage.tchange7")}" icon="more_vert" @click=${() => this.showStuckOrdersDialog()}></mwc-icon-button></header>
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
						<vaadin-grid-column
							auto-width
							resizable
							header="${translate("tradepage.tchange17")}"
							.renderer=${(root, column, data) => {
								 render(html`${this.renderCancelButton(data.item)}`, root)
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

    render() {
        return html`
		<div id="trade-portal-page">
			<div style="min-height: 40px; display: flex; padding-bottom: 0px; margin: 2px 2px 0px 2px ;">
				<h2 style="margin: 0 0 15px 0; line-height: 50px; display: inline;">Qortal ${translate("tradepage.tchange1")} - &nbsp;</h2>
				<mwc-select outlined id="coinSelectionMenu" label="${translate("tradepage.tchange2")}">
					<mwc-list-item value="LITECOIN" selected><span class="coinName ltc" style="color: var(--black);">QORT / LTC</span></mwc-list-item>
					<mwc-list-item value="BITCOIN"><span class="coinName btc" style="color: var(--black);">QORT / BTC</span></mwc-list-item>
					<mwc-list-item value="DOGECOIN"><span class="coinName doge" style="color: var(--black);">QORT / DOGE</span></mwc-list-item>
					<mwc-list-item value="DIGIBYTE"><span class="coinName dgb" style="color: var(--black);">QORT / DGB</span></mwc-list-item>
					<mwc-list-item value="RAVENCOIN"><span class="coinName rvn" style="color: var(--black);">QORT / RVN</span></mwc-list-item>
					<mwc-list-item value="PIRATECHAIN"><span class="coinName arrr" style="color: var(--black);">QORT / ARRR</span></mwc-list-item>
				</mwc-select>
                                <div style="padding-left: 20px; padding-top: 5px;">
				    <mwc-fab mini icon="info" title="${translate("info.inf1")}" @click=${() => this.shadowRoot.getElementById('tradeInfoDialog').open()}></mwc-fab>
			        </div>
                                <div style="padding-left: 20px; padding-top: 15px;">
                                    ${this.chartShowCoin()}
			        </div>
                                <div style="padding-left: 10px; padding-top: 12px; color: var(--black);">
                                   ${this.renderTradeLockButton()}
			        </div>
                                
			</div>
			<div id="trade-portal">
				<div id="first-trade-section">
					${this.historicTradesTemplate()}
					${this.myHistoricTradesTemplate()}
					${this.openTradesTemplate()}
				</div>
				<div id="second-trade-section">
					${this.myOpenOrdersTemplate()}
					${this.openMarketTemplate()}
				</div>
				<div id="third-trade-section">
                              <div></div>
					<div style="text-align: center;">
					    <h2 style="color: var(--black);">${translate("tradepage.tchange33")} ${this.listedCoins.get(this.selectedCoin).coinCode} ${translate("tradepage.tchange40")}</h2>
					    <h3 style="color: var(--black);">1 <span style="color: #03a9f4;">QORT</span> = ${this.exchangeRateQort()} ${this.listedCoins.get(this.selectedCoin).coinCode}</h3>
                                  <mwc-button dense unelevated label="${translate("tradepage.tchange47")}" @click=${() => this.setDefaultSellPrice()}></mwc-button>
					</div>
                              <div></div>
				</div>
			</div>
		</div>
		<!-- Manage Stuck Orders Dialog -->
		<mwc-dialog id="manageStuckOrdersDialog" scrimClickAction="${this.cancelStuckOfferBtnDisable ? '' : 'close'}">
			<div style="text-align: center;">
				<h1>${translate("tradepage.tchange7")}</h1>
				<hr>
			</div>
			<div>
				<vaadin-grid style="width: 500px" theme="compact column-borders row-stripes wrap-cell-content" id="stuckOrdersGrid" aria-label="My Offering Orders" .items="${this.listedCoins.get(this.selectedCoin).myOfferingOrders}">
					<vaadin-grid-column auto-width resizable header="${translate("tradepage.tchange8")} (QORT)" path="qortAmount"></vaadin-grid-column>
					<vaadin-grid-column auto-width resizable header="${translate("tradepage.tchange9")} (${this.listedCoins.get(this.selectedCoin).coinCode})" path="price"></vaadin-grid-column>
					<vaadin-grid-column auto-width resizable header="${translate("tradepage.tchange10")} (${this.listedCoins.get(this.selectedCoin).coinCode})" path="expectedForeignAmount"></vaadin-grid-column>
					<vaadin-grid-column auto-width resizable header="${translate("tradepage.tchange17")}" .renderer=${(root, column, data) => { render(html`${this.renderCancelStuckOfferButton(data.item)}`, root) }}></vaadin-grid-column>
				</vaadin-grid>
			</div>
			<mwc-button slot="primaryAction" dialogAction="cancel" class="cancel">${translate("general.close")}</mwc-button>
		</mwc-dialog>

		<paper-dialog id="tradeInfoDialog" class="info" modal>
			<div class="actions">
				<h3></h3>
				<mwc-icon class="close-icon" @click=${() => this.shadowRoot.getElementById('tradeInfoDialog').close()} title="${translate("info.inf2")}">highlight_off</mwc-icon>
			</div>
			<div class="container">
				<h1 style="color: #03a9f4; text-align: center;">${translate("info.inf1")}</h1>
				<h2 style="text-align: center;">${translate("info.inf3")} ${this.listedCoins.get(this.selectedCoin).coinCode} ${translate("info.inf4")}</h2>
				<h2 style="text-align: center;">${translate("info.inf5")} ${this.listedCoins.get(this.selectedCoin).coinCode}</h2>
				<h2 style="text-align: center;">${translate("info.inf6")}</h2>
			</div>
		</paper-dialog>
                <paper-dialog class="setpass-wrapper" id="setTradeLockScreenPass" modal>
                    <div style="text-align: center;">
                        <h2 style="color: var(--black);">Qortal ${translate("tabmenu.tm4")} ${translate("login.lp1")}</h2>
                        <hr>
                    </div>
                    <div style="text-align: center;">
                        <h3 style="color: var(--black);">${translate("login.lp2")}</h3>
                        <h4 style="color: var(--black);">${translate("login.lp3")}</h4>
                    </div>
                    <div style="display:flex;">
                        <mwc-icon style="padding: 10px; padding-left: 0; padding-top: 42px; color: var(--black);">password</mwc-icon>
                        <vaadin-password-field style="width: 100%;" label="${translate("login.password")}" id="tradeLockPassword" autofocus></vaadin-password-field>
                    </div>
                    <div style="display:flex;">
                        <mwc-icon style="padding: 10px; padding-left: 0; padding-top: 42px; color: var(--black);">password</mwc-icon>
                        <vaadin-password-field style="width: 100%;" label="${translate("login.confirmpass")}" id="tradeLockPasswordConfirm"></vaadin-password-field>
                    </div>
                        <div style="display: flex; justify-content: space-between;">
                            <mwc-button class="red" @click="${() => this.closewTradeSetScreenLockPass()}">${translate("login.lp4")}</mwc-button>
                        <mwc-button @click="${() => this.tradeCheckPass()}">${translate("login.lp5")}</mwc-button>
                    </div>
                </paper-dialog>
                <paper-dialog class="setpass-wrapper" id="tradeExtraConfirmPass" modal>
                    <div style="text-align: center;">
                        <h2 style="color: var(--black);">Qortal ${translate("tabmenu.tm4")} ${translate("login.lp1")}</h2>
                        <hr>
                    </div>
                    <div style="text-align: center;">
                        <h3 style="color: var(--black);">${translate("login.lessthen8")}</h3>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <mwc-button class="red" @click="${() => this.closTradeExtraConfirmPass()}">${translate("login.lp4")}</mwc-button>
                        <mwc-button @click="${() => this.setTradeNewScreenPass()}">${translate("login.lp5")}</mwc-button>
                    </div>
                </paper-dialog>
                <paper-dialog class="lock-wrapper" id="tradeLockScreenActive" modal>
                    <div class="text-wrapper">
                        <span class="lock-title-white">${translate("sidemenu.tradeportal")}</span><br/>
                        <span class="lock-title-white">${translate("login.lp9")} </span>
                        <span class="lock-title-red">${translate("login.lp10")}</span>
                    </div>
                    <div style="display:flex; margin-top: 5px;">
                        <mwc-icon style="padding: 10px; padding-left: 0; padding-top: 42px; color: var(--black);">password</mwc-icon>
                        <vaadin-password-field style="width: 45%;" label="${translate("login.password")}" id="tradeUnlockPassword" @keydown="${this.tradePassKeyListener}" autofocus>
                            <div slot="helper">
                                ${this.tradeHelperMessage}
                            </div>
                        </vaadin-password-field>
                    </div>
                    <div style="display: flex; margin-top: 35px;">
                        <mwc-button dense unelevated label="${translate("login.lp7")}" icon="lock_open" @click="${() => this.closeTradeLockScreenActive()}"></mwc-button>
                    </div>
                </paper-dialog>
		<trader-info-view></trader-info-view>
        `
    }

    firstUpdated() {
        let _this = this

        this.changeTheme()
        this.changeLanguage()

        this.tradeHelperMessage = this.renderTradeHelperPass()

        this.tradeSalt = ''
        this.tradeSalt = Base58.encode(window.parent.reduxStore.getState().app.wallet._addresses[0].keyPair.privateKey)

        this.tradeStorageData = ''
        this.tradeStorageData = window.parent.reduxStore.getState().app.selectedAddress.address

        this.tradeLockScreenPass = ''
        this.tradeLockScreenPass = 'tradeLockScreenPass-' + this.tradeStorageData

        this.tradeLockScreenSet = ''
        this.tradeLockScreenSet = 'tradeLockScreenSet-' + this.tradeStorageData

        this.tradeLockPass = ''
        this.tradeLockPass = encryptData(false, this.tradeSalt)

        this.tradeLockSet = ''
        this.tradeLockSet = encryptData(false, this.tradeSalt)

        if (localStorage.getItem(this.tradeLockScreenPass) === null && localStorage.getItem(this.tradeLockScreenSet) === null) {
            localStorage.setItem(this.tradeLockScreenPass, this.tradeLockPass)
            localStorage.setItem(this.tradeLockScreenSet, this.tradeLockSet)
            this.myTradeLockScreenPass = ''
            this.myTradeLockScreenPass = decryptData(localStorage.getItem(this.tradeLockScreenPass), this.tradeSalt)
            this.myTradeLockScreenSet = ''
            this.myTradeLockScreenSet = decryptData(localStorage.getItem(this.tradeLockScreenSet), this.tradeSalt)
        } else {
            this.myTradeLockScreenPass = ''
            this.myTradeLockScreenPass = decryptData(localStorage.getItem(this.tradeLockScreenPass), this.tradeSalt)
            this.myTradeLockScreenSet = ''
            this.myTradeLockScreenSet = decryptData(localStorage.getItem(this.tradeLockScreenSet), this.tradeSalt)
        }

        if (this.myTradeLockScreenSet === true) {
            this.shadowRoot.getElementById('tradeLockScreenActive').open()
        }

        this.updateWalletBalance()
        this.fetchWalletAddress(this.selectedCoin)

        setTimeout(() => {
            this.displayTabContent('buy')
        }, 0)

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
        this._historicTradesGrid = this.shadowRoot.getElementById('historicTradesGrid')
        this._myHistoricTradesGrid = this.shadowRoot.getElementById('myHistoricTradesGrid')
        this._stuckOrdersGrid = this.shadowRoot.getElementById('stuckOrdersGrid')

        const getNodeInfo = () => {
            parentEpml.request("apiCall", { url: `/admin/status` }).then((res) => {
                this.nodeInfo = res
                getSellButtonStatus()
            })
            setTimeout(getNodeInfo, 30000)
        }

        const getSellButtonStatus = () => {
            if (this.nodeInfo.isSynchronizing === true) {
                this.sellBtnDisable = true
            } else if (this.nodeInfo.isSynchronizing === false) {
                this.sellBtnDisable = false
            } else {
                this.sellBtnDisable = true
            }
        }

        const getQortBtcPrice = () => {
            parentEpml.request("apiCall", { url: `/crosschain/price/BITCOIN?inverse=true` }).then((res) => {
                this.qortbtc = (Number(res) / 1e8).toFixed(8)
            })
            setTimeout(getQortBtcPrice, 300000)
        }

        const getQortLtcPrice = () => {
            parentEpml.request("apiCall", { url: `/crosschain/price/LITECOIN?inverse=true` }).then((res) => {
                this.qortltc = (Number(res) / 1e8).toFixed(8)
            })
            setTimeout(getQortLtcPrice, 300000)
        }

        const getQortDogePrice = () => {
            parentEpml.request("apiCall", { url: `/crosschain/price/DOGECOIN?inverse=true` }).then((res) => {
               this.qortdoge = (Number(res) / 1e8).toFixed(8)
            })
            setTimeout(getQortDogePrice, 300000)
        }

        const getQortDgbPrice = () => {
            parentEpml.request("apiCall", { url: `/crosschain/price/DIGIBYTE?inverse=true` }).then((res) => {
                this.qortdgb = (Number(res) / 1e8).toFixed(8)
            })
            setTimeout(getQortDgbPrice, 300000)
        }

        const getQortRvnPrice = () => {
            parentEpml.request("apiCall", { url: `/crosschain/price/RAVENCOIN?inverse=true` }).then((res) => {
                this.qortrvn = (Number(res) / 1e8).toFixed(8)
            })
            setTimeout(getQortRvnPrice, 300000)
        }

        const getQortArrrPrice = () => {
            parentEpml.request("apiCall", { url: `/crosschain/price/PIRATECHAIN?inverse=true` }).then((res) => {
                this.qortarrr = (Number(res) / 1e8).toFixed(8)
            })
            setTimeout(getQortArrrPrice, 300000)
        }

        window.addEventListener('storage', () => {
            const checkLanguage = localStorage.getItem('qortalLanguage')
            const checkTheme = localStorage.getItem('qortalTheme')

            use(checkLanguage)

            this.theme = (checkTheme === 'dark') ? 'dark' : 'light'
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
                    setTimeout(getNodeInfo, 1)
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

        setTimeout(() => this.shadowRoot.querySelector('[slot="vaadin-grid-cell-content-3"]').setAttribute('title', 'Last Seen'), 3000)
        this.clearConsole()
        setInterval(() => {
            this.clearConsole()
        }, 60000)
    }

    clearConsole() {
        if (!isElectron()) {
        } else {
            console.clear()
            window.parent.electronAPI.clearCache()
        }
    }

    renderTradeLockButton() {
        if (this.myTradeLockScreenPass === false && this.myTradeLockScreenSet === false) {
            return html`
                <div style="display: inline;">
                    <paper-icon-button style="padding-bottom: 12px;" icon="icons:lock-open" @click=${() => this.openTradeSetScreenLockPass()} title="${translate("login.lp11")}"></paper-icon-button>
                </div>
            `
        } else if (this.myTradeLockScreenSet === false) {
            return html`
                <div style="display: inline;">
                    <paper-icon-button style="padding-bottom: 12px;" icon="icons:lock-open" @click=${() => this.setTradeLockQortal()} title="${translate("login.lp11")}"></paper-icon-button>
                </div>
            `
        } else if (this.myTradeLockScreenSet === true) {
            return html`
                <div style="display: inline;">
                    <paper-icon-button style="padding-bottom: 12px;" icon="icons:lock" title="${translate("login.lp10")}"></paper-icon-button>
                </div>
            `
        }
    }

    openTradeSetScreenLockPass() {
        this.shadowRoot.getElementById('tradeLockPassword').value = ''
        this.shadowRoot.getElementById('tradeLockPasswordConfirm').value = ''
        this.shadowRoot.getElementById('setTradeLockScreenPass').open()
    }

    closewTradeSetScreenLockPass() {
        this.shadowRoot.getElementById('setTradeLockScreenPass').close()
    }

    tradeCheckPass() {
        const tradePassword = this.shadowRoot.getElementById('tradeLockPassword').value
        const tradeRePassword = this.shadowRoot.getElementById('tradeLockPasswordConfirm').value

        if (tradePassword === '') {
            let snackbar1string = get("login.pleaseenter")
            parentEpml.request('showSnackBar', `${snackbar1string}`)
            return
        }

        if (tradePassword != tradeRePassword) {
            let snackbar2string = get("login.notmatch")
            parentEpml.request('showSnackBar', `${snackbar2string}`)
            return
        }

        if (tradePassword.length < 8) {
            let snackbar3string = get("login.lessthen8")
            parentEpml.request('showSnackBar', `${snackbar3string}`)
            this.tradeExtraConfirm()
        }

        if (tradePassword.length >= 8) {
            this.setTradeNewScreenPass()
            let snackbar4string = get("login.lp6")
            parentEpml.request('showSnackBar', `${snackbar4string}`)
        }
    }

    tradeExtraConfirm() {
        this.shadowRoot.getElementById('setTradeLockScreenPass').close()
        this.shadowRoot.getElementById('tradeExtraConfirmPass').open()
    }

    closTradeExtraConfirmPass() {
        this.shadowRoot.getElementById('tradeExtraConfirmPass').close()
        this.shadowRoot.getElementById('tradeLockPassword').value = ''
        this.shadowRoot.getElementById('tradeLockPasswordConfirm').value = ''
    }

    setTradeNewScreenPass() {
        const tradeRawPassword = this.shadowRoot.getElementById('tradeLockPassword').value
        const tradeCryptPassword = encryptData(tradeRawPassword, this.tradeSalt)
        localStorage.setItem(this.tradeLockScreenPass, tradeCryptPassword)
        this.myTradeLockScreenPass = ''
        this.myTradeLockScreenPass = decryptData(localStorage.getItem(this.tradeLockScreenPass), this.tradeSalt)
        this.shadowRoot.getElementById('setTradeLockScreenPass').close()
        this.shadowRoot.getElementById('tradeExtraConfirmPass').close()
        this.shadowRoot.getElementById('tradeLockPassword').value = ''
        this.shadowRoot.getElementById('tradeLockPasswordConfirm').value = ''
    }

    setTradeLockQortal() {
        this.tradeHelperMessage = this.renderTradeHelperPass()
        this.tradeLockSet = ''
        this.tradeLockSet = encryptData(true, this.tradeSalt)
        localStorage.setItem(this.tradeLockScreenSet, this.tradeLockSet)
        this.myTradeLockScreenSet = ''
        this.myTradeLockScreenSet = decryptData(localStorage.getItem(this.tradeLockScreenSet), this.tradeSalt)
        this.shadowRoot.getElementById('tradeLockScreenActive').open()
    }

    tradePassKeyListener(e) {
        if (e.key === 'Enter') {
            this.closeTradeLockScreenActive()
        }
    }

    async closeTradeLockScreenActive() {
        const myTradePass = decryptData(localStorage.getItem(this.tradeLockScreenPass), this.tradeSalt)
        const tradeCheckPass = this.shadowRoot.getElementById('tradeUnlockPassword').value
        const errDelay = ms => new Promise(res => setTimeout(res, ms))

        if (tradeCheckPass === myTradePass) {
            this.tradeLockSet = ''
            this.tradeLockSet = encryptData(false, this.tradeSalt)
            localStorage.setItem(this.tradeLockScreenSet, this.tradeLockSet)
            this.myTradeLockScreenSet = ''
            this.myTradeLockScreenSet = decryptData(localStorage.getItem(this.tradeLockScreenSet), this.tradeSalt)
            this.shadowRoot.getElementById('tradeLockScreenActive').close()
            this.shadowRoot.getElementById('tradeUnlockPassword').value = ''
            this.tradeHelperMessage = this.renderTradeHelperPass()
        } else {
            this.shadowRoot.getElementById('tradeUnlockPassword').value = ''
            this.tradeHelperMessage = this.renderTradeHelperErr()
            await errDelay(3000)
            this.tradeHelperMessage = this.renderTradeHelperPass()
            return
        }
    }

    renderTradeHelperPass() {
        return html`<span style="color: #fff; font-weight: bold; font-size: 13px; float: left;">${translate("login.pleaseenter")}</span>`
    }

    renderTradeHelperErr() {
        return html`<span style="color: var(--mdc-theme-error); font-weight: bold;  font-size: 13px; float: right;">${translate("login.lp8")}</span>`
    }

    requestTraderInfo(traderAddress) {
        let getAddress = traderAddress
        const theInfoView = this.shadowRoot.querySelector('trader-info-view')
        theInfoView.openTraderInfo(getAddress)
    }

    changeTheme() {
        const checkTheme = localStorage.getItem('qortalTheme')
        this.theme = (checkTheme === 'dark') ? 'dark' : 'light'
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

    chartShowCoin() {
        switch(this.listedCoins.get(this.selectedCoin).coinCode) {
            case "BTC":
                return html`<mwc-button dense unelevated label="BTC ${translate("tradepage.tchange49")}" @click=${() => chartsbtc.open()}></mwc-button>`
                break
            case "LTC":
                return html`<mwc-button dense unelevated label="LTC ${translate("tradepage.tchange49")}" @click=${() => chartsltc.open()}></mwc-button>`
                break
            case "DOGE":
                return html`<mwc-button dense unelevated label="DOGE ${translate("tradepage.tchange49")}" @click=${() => chartsdoge.open()}></mwc-button>`
                break
            case "DGB":
                return html`<mwc-button dense unelevated label="DGB ${translate("tradepage.tchange49")}" @click=${() => chartsdgb.open()}></mwc-button>`
                break
            case "RVN":
                return html`<mwc-button dense unelevated label="RVN ${translate("tradepage.tchange49")}" @click=${() => chartsrvn.open()}></mwc-button>`
                break
            case "ARRR":
                return html`<mwc-button dense unelevated label="ARRR ${translate("tradepage.tchange49")}" @click=${() => chartsarrr.open()}></mwc-button>`
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

        this.isLoadingHistoricTrades = true
        this.isLoadingOpenTrades = true
        this.createConnection()
        this._openOrdersGrid.querySelector('#priceColumn').headerRenderer = function (root) {
            const priceString2 = get("tradepage.tchange9")
            root.innerHTML = '<vaadin-grid-sorter path="price" direction="asc">' + priceString2 + ' (' + _this.listedCoins.get(_this.selectedCoin).coinCode + ')</vaadin-grid-sorter>'
        }
        this.clearSellForm()
        this.clearBuyForm()
        await this.updateWalletBalance()
        this.fetchWalletAddress(coin)
    }

    displayTabContent(tab) {
        const tabPane = this.shadowRoot.getElementById("tabs-1")
        tabPane.setAttribute("activeIndex", (tab === 'buy') ? '0': '1')

        const tabBuyContent = this.shadowRoot.getElementById('tab-buy-content')
        tabBuyContent.style.display = (tab === 'buy') ? 'block' : 'none'

        const tabSellContent = this.shadowRoot.getElementById('tab-sell-content')
        tabSellContent.style.display = (tab === 'sell') ? 'block' : 'none'
    }

    setDefaultSellPrice() {
        this.displayTabContent('sell')
        const tabSellPrice = this.shadowRoot.getElementById('sellPriceInput')
        tabSellPrice.value = this.qortRatio.isNaN ? 0 : this.qortRatio
    }

    async reRenderHistoricTrades() {
        this.requestUpdate()
        await this.updateComplete
        this.isLoadingHistoricTrades = false
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

    fillBuyForm(sellerRequest) {
        this.shadowRoot.getElementById('buyAmountInput').value = parseFloat(sellerRequest.item.qortAmount)
        this.shadowRoot.getElementById('buyPriceInput').value = this.round(parseFloat(sellerRequest.item.foreignAmount) / parseFloat(sellerRequest.item.qortAmount))
        this.shadowRoot.getElementById('buyTotalInput').value = parseFloat(sellerRequest.item.foreignAmount)
        this.shadowRoot.getElementById('qortalAtAddress').value = sellerRequest.item.qortalAtAddress
        const buyFunds = this.round(parseFloat(sellerRequest.item.foreignAmount))
        const haveFunds = this.round(parseFloat(this.listedCoins.get(this.selectedCoin).balance))
        if (Number(haveFunds) > Number(buyFunds)) {
            this.buyBtnDisable = false
            this.autoBuyWarning = false
            this.displayTabContent('buy')
        } else {
            this.buyBtnDisable = true
            this.autoBuyWarning = true
            this.displayTabContent('buy')
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
    *  - REDEEMED
    *  - TRADING
    *  - REFUNDED
    *  - CANCELLED
    */

    processTradeOffers(offers) {
        offers.forEach((offer) => {
            if (offer.mode === 'OFFERING') {
                this.processOfferingTrade(offer)
            } else if (offer.mode === 'REDEEMED') {
                this.processRedeemedTrade(offer)
            } else if (offer.mode === 'TRADING') {
                this.processTradingTrade(offer)
            } else if (offer.mode === 'REFUNDED') {
                this.processRefundedTrade(offer)
            } else if (offer.mode === 'CANCELLED') {
                this.processCancelledTrade(offer)
            }
        })
    }

    /**
    * TradeBot Note by cat
    *
    * trade-bot entry states:
    *   - when you do /crosschain/tradebot/create,
    *   - it returns unsigned DEPLOY_AT for you to sign & broadcast
    *   - so initial trade-bot state is BOB_WAITING_FOR_AT_CONFIRM, because trade-bot is waiting for UI to sign & broadcast txn and for that txn to be confirmed into a block
    *   - once that happens & Bob's trade-bot notices that DEPLOY_AT has confirmed (and hence AT created and running), then it switches to BOB_WAITING_FOR_MESSAGE
    *   - which is Bob's trade-bot waiting for a message from Alice's trade-bot telling it (Bob's trade-bot) that Alice's trade-bot has funded P2SH-A and some other details
    *   - when that message is sent, Bob's trade-bot processes that message and sends its own message to the AT (which switches it to TRADING mode)
    *   - but the next state for Bob's trade-bot is to wait for Alice to spot AT is locked to her and for her to fund P2SH-B, hence BOB_WAITING_FOR_P2SH_B
    *   - at this point, Bob's trade-bot finds P2SH-B on the litecoin blockchain and can send secret-B to P2SH-B
    *   - when this happens, Alice uses secret-B and secret-A to redeem the QORT from the AT, so until Alice does this, Bob's trade-bot state is BOB_WAITING_FOR_AT_REDEEM
    *   - after Alice redeems QORT from AT, Bob can extract secret-A and capture the actual LTC funds from P2SH-A to his own litecoin account and hence his trade-bot moves to BOB_DONE
    *   - if anything goes wrong then refunds occur and Bob's trade-bot ends up at BOB_REFUNDED instead
    *   - I think you can probably guess the corresponding meaning of states for Alice's point of view, but if not I can go through those too?
    *   - Alice calls /crosschain/tradebot/respond which funds P2SH-A
    *   - so her trade-bot waits for that to appear in litecoin blockchain, so until then is ALICE_WAITING_FOR_P2SH_A
    *   - once the P2SH-A funding confirms, Alice's trade-bot can MESSAGE Bob's trade-bot with the details and changes to ALICE_WAITING_FOR_AT_LOCK
    *   - Bob's AT should then lock to trading with Alice (via those MESSAGEs above) and Alice's trade-bot notices this, (minimally) funds P2SH-B and waits until Bob 'spends' P2SH-B, hence ALICE_WATCH_P2SH_B
    *   - if Bob spends P2SH-B, then Alice can send secret-B and secret-A to the AT, claim the QORT and she's ALICE_DONE
    *   - if something goes wrong then her trade-bot needs to refund P2SH-B (if applicable) first (ALICE_REFUNDING_B)
    *   - and when that's done refund P2SH-A (ALICE_REFUNDING_A)
    *   - and when that's done her trade-bot ends up at ALICE_REFUNDED
    *
    *  (PHEW)
    */

    processTradeBotStates(tradeStates) {

        /**
        * BitcoinACCTv1 TRADEBOT STATES
        *  - BOB_WAITING_FOR_AT_CONFIRM
        *  - BOB_WAITING_FOR_MESSAGE
        *  - BOB_WAITING_FOR_AT_REDEEM
        *  - BOB_DONE
        *  - BOB_REFUNDED
        *  - ALICE_WAITING_FOR_AT_LOCK
        *  - ALICE_DONE
        *  - ALICE_REFUNDING_A
        *  - ALICE_REFUNDED
        *
        * @param {[{}]} states
        */

        const BitcoinACCTv1 = (states) => {
            states.reverse()
            states.forEach((state) => {
                if (state.creatorAddress === this.selectedAddress.address) {
                    if (state.tradeState == 'BOB_WAITING_FOR_AT_CONFIRM') {
                        this.changeTradeBotState(state, 'PENDING')
                    } else if (state.tradeState == 'BOB_WAITING_FOR_MESSAGE') {
                        this.changeTradeBotState(state, 'LISTED')
                    } else if (state.tradeState == 'BOB_WAITING_FOR_AT_REDEEM') {
                        this.changeTradeBotState(state, 'TRADING')
                    } else if (state.tradeState == 'BOB_DONE') {
                        this.handleCompletedState(state)
                    } else if (state.tradeState == 'BOB_REFUNDED') {
                        this.handleCompletedState(state)
                    } else if (state.tradeState == 'ALICE_WAITING_FOR_AT_LOCK') {
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

        /**
        * LitecoinACCTv1 TRADEBOT STATES
        *  - BOB_WAITING_FOR_AT_CONFIRM
        *  - BOB_WAITING_FOR_MESSAGE
        *  - BOB_WAITING_FOR_AT_REDEEM
        *  - BOB_DONE
        *  - BOB_REFUNDED
        *  - ALICE_WAITING_FOR_AT_LOCK
        *  - ALICE_DONE
        *  - ALICE_REFUNDING_A
        *  - ALICE_REFUNDED
        *
        * @param {[{}]} states
        */

        const LitecoinACCTv1 = (states) => {
            states.reverse()
            states.forEach((state) => {
                if (state.creatorAddress === this.selectedAddress.address) {
                    if (state.tradeState == 'BOB_WAITING_FOR_AT_CONFIRM') {
                        this.changeTradeBotState(state, 'PENDING')
                    } else if (state.tradeState == 'BOB_WAITING_FOR_MESSAGE') {
                        this.changeTradeBotState(state, 'LISTED')
                    } else if (state.tradeState == 'BOB_WAITING_FOR_AT_REDEEM') {
                        this.changeTradeBotState(state, 'TRADING')
                    } else if (state.tradeState == 'BOB_DONE') {
                        this.handleCompletedState(state)
                    } else if (state.tradeState == 'BOB_REFUNDED') {
                        this.handleCompletedState(state)
                    } else if (state.tradeState == 'ALICE_WAITING_FOR_AT_LOCK') {
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

        /**
        * DogecoinACCTv1 TRADEBOT STATES
        *  - BOB_WAITING_FOR_AT_CONFIRM
        *  - BOB_WAITING_FOR_MESSAGE
        *  - BOB_WAITING_FOR_AT_REDEEM
        *  - BOB_DONE
        *  - BOB_REFUNDED
        *  - ALICE_WAITING_FOR_AT_LOCK
        *  - ALICE_DONE
        *  - ALICE_REFUNDING_A
        *  - ALICE_REFUNDED
        *
        * @param {[{}]} states
        */

        const DogecoinACCTv1 = (states) => {
            states.reverse()
            states.forEach((state) => {
                if (state.creatorAddress === this.selectedAddress.address) {
                    if (state.tradeState == 'BOB_WAITING_FOR_AT_CONFIRM') {
                        this.changeTradeBotState(state, 'PENDING')
                    } else if (state.tradeState == 'BOB_WAITING_FOR_MESSAGE') {
                        this.changeTradeBotState(state, 'LISTED')
                    } else if (state.tradeState == 'BOB_WAITING_FOR_AT_REDEEM') {
                        this.changeTradeBotState(state, 'TRADING')
                    } else if (state.tradeState == 'BOB_DONE') {
                        this.handleCompletedState(state)
                    } else if (state.tradeState == 'BOB_REFUNDED') {
                        this.handleCompletedState(state)
                    } else if (state.tradeState == 'ALICE_WAITING_FOR_AT_LOCK') {
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

        /**
        * DigibyteACCTv1 TRADEBOT STATES
        *  - BOB_WAITING_FOR_AT_CONFIRM
        *  - BOB_WAITING_FOR_MESSAGE
        *  - BOB_WAITING_FOR_AT_REDEEM
        *  - BOB_DONE
        *  - BOB_REFUNDED
        *  - ALICE_WAITING_FOR_AT_LOCK
        *  - ALICE_DONE
        *  - ALICE_REFUNDING_A
        *  - ALICE_REFUNDED
        *
        * @param {[{}]} states
        */

        const DigibyteACCTv1 = (states) => {
            states.reverse()
            states.forEach((state) => {
                if (state.creatorAddress === this.selectedAddress.address) {
                    if (state.tradeState == 'BOB_WAITING_FOR_AT_CONFIRM') {
                        this.changeTradeBotState(state, 'PENDING')
                    } else if (state.tradeState == 'BOB_WAITING_FOR_MESSAGE') {
                        this.changeTradeBotState(state, 'LISTED')
                    } else if (state.tradeState == 'BOB_WAITING_FOR_AT_REDEEM') {
                        this.changeTradeBotState(state, 'TRADING')
                    } else if (state.tradeState == 'BOB_DONE') {
                        this.handleCompletedState(state)
                    } else if (state.tradeState == 'BOB_REFUNDED') {
                        this.handleCompletedState(state)
                    } else if (state.tradeState == 'ALICE_WAITING_FOR_AT_LOCK') {
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

        /**
        * RavencoinACCTv1 TRADEBOT STATES
        *  - BOB_WAITING_FOR_AT_CONFIRM
        *  - BOB_WAITING_FOR_MESSAGE
        *  - BOB_WAITING_FOR_AT_REDEEM
        *  - BOB_DONE
        *  - BOB_REFUNDED
        *  - ALICE_WAITING_FOR_AT_LOCK
        *  - ALICE_DONE
        *  - ALICE_REFUNDING_A
        *  - ALICE_REFUNDED
        *
        * @param {[{}]} states
        */

        const RavencoinACCTv1 = (states) => {
            states.reverse()
            states.forEach((state) => {
                if (state.creatorAddress === this.selectedAddress.address) {
                    if (state.tradeState == 'BOB_WAITING_FOR_AT_CONFIRM') {
                        this.changeTradeBotState(state, 'PENDING')
                    } else if (state.tradeState == 'BOB_WAITING_FOR_MESSAGE') {
                        this.changeTradeBotState(state, 'LISTED')
                    } else if (state.tradeState == 'BOB_WAITING_FOR_AT_REDEEM') {
                        this.changeTradeBotState(state, 'TRADING')
                    } else if (state.tradeState == 'BOB_DONE') {
                        this.handleCompletedState(state)
                    } else if (state.tradeState == 'BOB_REFUNDED') {
                        this.handleCompletedState(state)
                    } else if (state.tradeState == 'ALICE_WAITING_FOR_AT_LOCK') {
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

        /**
        * PirateChainACCTv1 TRADEBOT STATES
        *  - BOB_WAITING_FOR_AT_CONFIRM
        *  - BOB_WAITING_FOR_MESSAGE
        *  - BOB_WAITING_FOR_AT_REDEEM
        *  - BOB_DONE
        *  - BOB_REFUNDED
        *  - ALICE_WAITING_FOR_AT_LOCK
        *  - ALICE_DONE
        *  - ALICE_REFUNDING_A
        *  - ALICE_REFUNDED
        *
        * @param {[{}]} states
        */

         const PirateChainACCTv1 = (states) => {
            states.reverse()
            states.forEach((state) => {
                if (state.creatorAddress === this.selectedAddress.address) {
                    if (state.tradeState == 'BOB_WAITING_FOR_AT_CONFIRM') {
                        this.changeTradeBotState(state, 'PENDING')
                    } else if (state.tradeState == 'BOB_WAITING_FOR_MESSAGE') {
                        this.changeTradeBotState(state, 'LISTED')
                    } else if (state.tradeState == 'BOB_WAITING_FOR_AT_REDEEM') {
                        this.changeTradeBotState(state, 'TRADING')
                    } else if (state.tradeState == 'BOB_DONE') {
                        this.handleCompletedState(state)
                    } else if (state.tradeState == 'BOB_REFUNDED') {
                        this.handleCompletedState(state)
                    } else if (state.tradeState == 'ALICE_WAITING_FOR_AT_LOCK') {
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
        if (this.listedCoins.get(this.selectedCoin).tradeOffersSocketCounter === 1) {
            setTimeout(() => this.filterStuckTrades(tradeStates), 250)
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

    async sellAction() {
        this.isSellLoading = true
        this.sellBtnDisable = true
        const sellAmountInput = this.shadowRoot.getElementById('sellAmountInput').value
        const sellTotalInput = this.shadowRoot.getElementById('sellTotalInput').value
        const fundingQortAmount = this.round(parseFloat(sellAmountInput) + 0.001)

        const makeRequest = async () => {
            let _receivingAddress = null
            switch (this.selectedCoin) {
                case 'BITCOIN':
                    _receivingAddress = this.selectedAddress.btcWallet.address
                    break
                case 'LITECOIN':
                    _receivingAddress = this.selectedAddress.ltcWallet.address
                    break
                case 'DOGECOIN':
                    _receivingAddress = this.selectedAddress.dogeWallet.address
                    break
                case 'DIGIBYTE':
                    _receivingAddress = this.selectedAddress.dgbWallet.address
                    break
                case 'RAVENCOIN':
                    _receivingAddress = this.selectedAddress.rvnWallet.address
                    break
                case 'PIRATECHAIN':
                    _receivingAddress = this.arrrWalletAddress
                    break
                default:
                    break
            }
            const response = await parentEpml.request('tradeBotCreateRequest', {
                creatorPublicKey: this.selectedAddress.base58PublicKey,
                qortAmount: parseFloat(sellAmountInput),
                fundingQortAmount: parseFloat(fundingQortAmount),
                foreignBlockchain: this.selectedCoin,
                foreignAmount: parseFloat(sellTotalInput),
                tradeTimeout: 60,
                receivingAddress: _receivingAddress,
            })
            return response
        }

        const manageResponse = (response) => {
            if (response === true) {
                this.isSellLoading = false
                this.sellBtnDisable = false
                this.shadowRoot.getElementById('sellAmountInput').value = this.initialAmount
                this.shadowRoot.getElementById('sellPriceInput').value = this.initialAmount
                this.shadowRoot.getElementById('sellTotalInput').value = this.initialAmount
            } else if (response === false) {
                this.isSellLoading = false
                this.sellBtnDisable = false
                let snack2string = get("tradepage.tchange20")
                parentEpml.request('showSnackBar', `${snack2string}`)
            } else {
                this.isSellLoading = false
                this.sellBtnDisable = false
                let snack3string = get("tradepage.tchange21")
                parentEpml.request('showSnackBar', `${snack3string}: ${response.message}`)
            }
        }

        if (this.round(parseFloat(fundingQortAmount) + parseFloat(0.002)) > parseFloat(this.listedCoins.get("QORTAL").balance)) {
            this.isSellLoading = false
            this.sellBtnDisable = false
            let snack4string = get("tradepage.tchange22")
            parentEpml.request('showSnackBar', `${snack4string}`)
            return false
        } else {
            const res = await makeRequest()
            manageResponse(res)
        }
    }

    async buyAction() {
        this.isBuyLoading = true
        this.buyBtnDisable = true
        const qortalAtAddress = this.shadowRoot.getElementById('qortalAtAddress').value
        let _foreignKey = ""

        switch (this.selectedCoin) {
            case 'BITCOIN':
                _foreignKey = this.selectedAddress.btcWallet.derivedMasterPrivateKey
                break
            case 'LITECOIN':
                _foreignKey = this.selectedAddress.ltcWallet.derivedMasterPrivateKey
                break
            case 'DOGECOIN':
                _foreignKey = this.selectedAddress.dogeWallet.derivedMasterPrivateKey
                break
            case 'DIGIBYTE':
                _foreignKey = this.selectedAddress.dgbWallet.derivedMasterPrivateKey
                break
			case 'RAVENCOIN':
                _foreignKey = this.selectedAddress.rvnWallet.derivedMasterPrivateKey
                break
            case 'PIRATECHAIN':
                _foreignKey = this.selectedAddress.arrrWallet.seed58
                break
            default:
                break
        }

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
                this.shadowRoot.getElementById('buyAmountInput').value = this.initialAmount
                this.shadowRoot.getElementById('buyPriceInput').value = this.initialAmount
                this.shadowRoot.getElementById('buyTotalInput').value = this.initialAmount
                this.shadowRoot.getElementById('qortalAtAddress').value = ''
                let snack5string = get("tradepage.tchange23")
                parentEpml.request('showSnackBar', `${snack5string}`)
            } else if (response === false) {
                this.isBuyLoading = false
                this.buyBtnDisable = false
                let snack6string = get("tradepage.tchange24")
                parentEpml.request('showSnackBar', `${snack6string}`)
            } else {
                this.isBuyLoading = false
                this.buyBtnDisable = false
                let snack7string = get("tradepage.tchange25")
                parentEpml.request('showSnackBar', `${snack7string}: ${response.message}`)
            }
        }
        const res = await makeRequest()
        manageResponse(res)
    }

    async cancelAction(state) {
        const button = this.shadowRoot.querySelector(`mwc-button#${state.atAddress}`)
        button.innerHTML = `<paper-spinner-lite active></paper-spinner-lite>`
        this.cancelBtnDisable = true

        const makeRequest = async () => {
            const response = await parentEpml.request('deleteTradeOffer', {
                creatorPublicKey: this.selectedAddress.base58PublicKey,
                atAddress: state.atAddress,
            })
            return response
        }

        const manageResponse = (response) => {
            if (response === true) {
                button.remove()
                this.cancelBtnDisable = false
                let snack8string = get("tradepage.tchange26")
                parentEpml.request('showSnackBar', `${snack8string}`)
            } else if (response === false) {
                button.innerHTML = 'CANCEL'
                this.cancelBtnDisable = false
                let snack9string = get("tradepage.tchange27")
                parentEpml.request('showSnackBar', `${snack9string}`)
            } else {
                button.innerHTML = 'CANCEL'
                this.cancelBtnDisable = false
                let snack10string = get("tradepage.tchange28")
                parentEpml.request('showSnackBar', `${snack10string}: ${response.message}`)
            }
        }
        const res = await makeRequest()
        manageResponse(res)
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

    renderCancelButton(stateItem) {
        if (stateItem.tradeState === 'BOB_WAITING_FOR_MESSAGE') {
            return html`<mwc-button id="${stateItem.atAddress}" ?disabled=${this.cancelBtnDisable} class="cancel" @click=${(e) => this.cancelAction(stateItem)}>${translate("tradepage.tchange29")}</mwc-button>`
        } else {
            return ''
        }
    }

    showStuckOrdersDialog() {
        this.shadowRoot.querySelector('#manageStuckOrdersDialog').show()
    }

    async cancelStuckOfferAction(offer) {
        this.cancelStuckOfferBtnDisable = true

        const makeRequest = async () => {
            const response = await parentEpml.request('deleteTradeOffer', {
                creatorPublicKey: this.selectedAddress.base58PublicKey,
                atAddress: offer.qortalAtAddress,
            })
            return response
        }

        const manageResponse = (response) => {
            if (response === true) {
                this.cancelStuckOfferBtnDisable = false
                let snack11string = get("tradepage.tchange26")
                parentEpml.request('showSnackBar', `${snack11string}`)
            } else if (response === false) {
                this.cancelStuckOfferBtnDisable = false
                let snack12string = get("tradepage.tchange27")
                parentEpml.request('showSnackBar', `${snack12string}`)
            } else {
                this.cancelStuckOfferBtnDisable = false
                let snack13string = get("tradepage.tchange28")
                parentEpml.request('showSnackBar', `${snack13string}: ${response.message}`)
            }
        }
        const res = await makeRequest()
        manageResponse(res)
    }

    renderCancelStuckOfferButton(offerItem) {
        if (offerItem.mode === 'OFFERING' && offerItem.qortalCreator === this.selectedAddress.address) {
            return html`<mwc-button id="offer-${offerItem.qortalAtAddress}" ?disabled=${this.cancelStuckOfferBtnDisable} class="cancel" @click=${(e) => this.cancelStuckOfferAction(offerItem)}>CANCEL</mwc-button>`
        } else {
            return ''
        }
    }

    _checkSellAmount(e) {
        const targetAmount = e.target.value
        const target = e.target

        if (targetAmount.length === 0) {
            this.isValidAmount = false
            this.sellBtnDisable = true
            e.target.blur()
            e.target.focus()
            e.target.invalid = true
        } else {
            const sellAmountInput = this.shadowRoot.getElementById('sellAmountInput').value
            const sellPriceInput = this.shadowRoot.getElementById('sellPriceInput').value
            this.shadowRoot.getElementById('sellTotalInput').value = this.round(parseFloat(sellAmountInput) * parseFloat(sellPriceInput))
            this.sellBtnDisable = false
        }

        e.target.blur()
        e.target.focus()

        e.target.validityTransform = (newValue, nativeValidity) => {
            if (newValue.includes('-') === true) {
                this.sellBtnDisable = true
                return {
                    valid: false,
                }
            } else if (!nativeValidity.valid) {
                if (newValue.includes('.') === true) {
                    let myAmount = newValue.split('.')
                    if (myAmount[1].length > 8) {
                        this.sellBtnDisable = true
                    } else {
                        const sellAmountInput = this.shadowRoot.getElementById('sellAmountInput').value
                        const sellPriceInput = this.shadowRoot.getElementById('sellPriceInput').value
                        this.shadowRoot.getElementById('sellTotalInput').value = this.round(parseFloat(sellAmountInput) * parseFloat(sellPriceInput))
                        this.sellBtnDisable = false
                        return {
                            valid: true,
                        }
                    }
                }
            } else {
                const sellAmountInput = this.shadowRoot.getElementById('sellAmountInput').value
                const sellPriceInput = this.shadowRoot.getElementById('sellPriceInput').value
                this.shadowRoot.getElementById('sellTotalInput').value = this.round(parseFloat(sellAmountInput) * parseFloat(sellPriceInput))
                this.sellBtnDisable = false
            }
        }
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

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
        let apiKey = myNode.apiKey;
        return apiKey;
    }

    clearBuyForm() {
        this.shadowRoot.getElementById('buyAmountInput').value = this.initialAmount
        this.shadowRoot.getElementById('buyPriceInput').value = this.initialAmount
        this.shadowRoot.getElementById('buyTotalInput').value = this.initialAmount
        this.shadowRoot.getElementById('qortalAtAddress').value = ''
        this.buyBtnDisable = true
    }

    clearSellForm() {
        this.shadowRoot.getElementById('sellAmountInput').value = this.initialAmount
        this.shadowRoot.getElementById('sellPriceInput').value = this.initialAmount
        this.shadowRoot.getElementById('sellTotalInput').value = this.initialAmount
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

    /**
    * Inline Worker - Takes in a function and a modifier then returns an instance of a Web Worker
    *
    * - Modifiers are simply an Array of Object containing placeholders (containers for variables used in the passedFunction ) in the and its values.
    * These placeholders gets replaced with it value during instantiation of the function to be used by the Worker.
    * - Example of modifiers: const modifiers = [
    *            { searchValue: 'SELECTED_ADDRESS', replaceValue: this.selectedAddress.address, },
    * ]
    *
    * @param {Function} passedFunction
    * @param {Array} modifiers
    * @returns {Worker} Worker
    */

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
        this._myHistoricTradesGrid.clearCache()
        this._historicTradesGrid.clearCache()
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

    handleStuckTrades() {
        let tradeBotStates = []

        self.addEventListener('message', function (event) {
            tradeBotStates = event.data
        })

        const getCompletedTrades = async () => {
            const url = `http://NODEURL/crosschain/trades?limit=25&reverse=true&foreignBlockchain=FOREIGN_BLOCKCHAIN`
            const res = await fetch(url)
            const historicTrades = await res.json()
            const compareFn = (a, b) => {
                return b.tradeTimestamp - a.tradeTimestamp
            }
            const sortedTrades = historicTrades.sort(compareFn)
            self.postMessage({ type: 'HISTORIC_TRADES', data: sortedTrades })
        }

        const filterStuckOffers = (myOffers) => {
            const myTradeBotStates = tradeBotStates.filter((state) => state.creatorAddress === 'SELECTED_ADDRESS')
            const stuckOffers = myOffers.filter((myOffer) => {
                let value = myTradeBotStates.some((myTradeBotState) => myOffer.qortalAtAddress === myTradeBotState.atAddress)
                return !value
            })
            return stuckOffers
        }

        const getOffers = async () => {
            const url = `http://NODEURL/crosschain/tradeoffers?foreignBlockchain=FOREIGN_BLOCKCHAIN`
            const res = await fetch(url)
            const openTradeOrders = await res.json()
            const myOpenTradeOrders = await openTradeOrders.filter((order) => order.mode === 'OFFERING' && order.qortalCreator === 'SELECTED_ADDRESS')
            const stuckOffers = filterStuckOffers(myOpenTradeOrders)
            self.postMessage({ type: 'STUCK_OFFERS', data: stuckOffers })
        }
        setTimeout(() => { getOffers() }, 1000)
        setTimeout(() => { getCompletedTrades() }, 1000)
    }

    filterStuckTrades(states) {
        if (workers.get(this.selectedCoin).handleStuckTradesConnectedWorker !== null) {
            this.isLoadingOpenTrades = false
            return
        }

        this.shadowRoot.getElementById('loadingHistoricTrades').style.display = "block";
        let isHandleTradesDone = false
        let isHandleStuckOffersDone = false

        const handleMessage = (message) => {
            switch (message.type) {
                case 'HISTORIC_TRADES':
                    this.listedCoins.get(this.selectedCoin).historicTrades = message.data
                    this.reRenderHistoricTrades()
                    isHandleTradesDone = true
                    break
                case 'STUCK_OFFERS':
                    doStuckOffers(message.data)
                    isHandleStuckOffersDone = true
                    break
                default:
                    break
            }
            if (isHandleTradesDone === true && isHandleStuckOffersDone === true) return workers.get(this.selectedCoin).handleStuckTradesConnectedWorker.terminate()
        }

        const doStuckOffers = (message) => {
            const offers = message
            const offerItem = (offer) => {
                return {
                    ...offer,
                    price: this.round(parseFloat(offer.expectedForeignAmount) / parseFloat(offer.qortAmount)),
                }
            }
            const addStuckOrders = (offerItem) => {
                if (offerItem.qortalCreator === this.selectedAddress.address) {
                    this._stuckOrdersGrid.items.unshift(offerItem)
                    this._stuckOrdersGrid.clearCache()
                }
            }
            const handleOffers = () => {
                offers.forEach((offer) => {
                    addStuckOrders(offerItem(offer))
                })
            }
            handleOffers()
        }

        let myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        let nodeUrl = myNode.domain + ':' + myNode.port

        const modifiers = [
            { searchValue: 'NODEURL', replaceValue: nodeUrl },
            { searchValue: 'SELECTED_ADDRESS', replaceValue: this.selectedAddress.address, },
            { searchValue: 'FOREIGN_BLOCKCHAIN', replaceValue: this.selectedCoin, },
        ]

        workers.get(this.selectedCoin).handleStuckTradesConnectedWorker = this.inlineWorker(this.handleStuckTrades, modifiers)
        workers.get(this.selectedCoin).handleStuckTradesConnectedWorker.postMessage(states)
        workers.get(this.selectedCoin).handleStuckTradesConnectedWorker.addEventListener(
            'message',
            function (event) {
                handleMessage(event.data)
            },
            { passive: true }
        )
    }
}

window.customElements.define('trade-portal', TradePortal)