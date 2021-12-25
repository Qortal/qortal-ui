import { LitElement, html, css } from 'lit-element';
import { render } from 'lit-html';
import { Epml } from '../../../epml.js';

import '@material/mwc-button';
import '@material/mwc-textfield';
import '@material/mwc-icon-button';
import '@material/mwc-dialog';
import '@material/mwc-tab-bar';
import '@material/mwc-tab';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-select';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-sorter';
import '@vaadin/vaadin-grid/theme/material/all-imports.js';

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent });

let workers = new Map();

class TradePortal extends LitElement {
	static get properties() {
		return {
			selectedAddress: { type: Object },
			config: { type: Object },
			listedCoins: { type: Map },
			sellBtnDisable: { type: Boolean },
			isSellLoading: { type: Boolean },
			isBuyLoading: { type: Boolean },
			buyBtnDisable: { type: Boolean },
			initialAmount: { type: Number },
			cancelBtnDisable: { type: Boolean },
			cancelStuckOfferBtnDisable: { type: Boolean },
			selectedCoin: { type: String },
			isLoadingHistoricTrades: { type: Boolean },
			isLoadingOpenTrades: { type: Boolean },
			isLoadingMyOpenOrders: { type: Boolean },
		}
	}

	static get styles() {
		return css`
			* {
				--mdc-theme-primary: rgb(3, 169, 244);
				--mdc-theme-secondary: var(--mdc-theme-primary);
				--paper-input-container-focus-color: var(--mdc-theme-primary);
			}

			#tabs-1 {
				--mdc-tab-height: 50px;
				border-left: 1px solid rgb(102, 102, 102);
				border-top: 1px solid rgb(102, 102, 102);
				border-right: 1px solid rgb(102, 102, 102);
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
				border: 1px solid rgb(102, 102, 102);
			}

			#tabs-1-content .card {
				border: none;
			}

			#tabs-1-content .btn-clear {
				--mdc-icon-button-size: 40px;
			}

			#tab-sell[active] {
				--mdc-theme-primary: rgb(255, 89, 89); 
			}

			#trade-portal-page {
				background: #fff;
				padding: 12px 24px;
			}

			.divCard {
				border: 1px solid #eee;
				padding: 1em;
				box-shadow: 0 0.3px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.2);
			}

			h2 {
				margin: 0;
			}

			h2,
			h3,
			h4,
			h5 {
				color: #333;
				font-weight: 400;
			}

			header {
				display: flex;
				flex: 0 1 auto;
				align-items: center;
				justify-content: center;
				padding: 0px 15px;
				font-size: 16px;
				color: #fff;
				background-color: rgb(106, 108, 117);
				min-height: 40px;
			}

			p {
				margin-bottom: 15px;
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
				background-color: #eee;
				border: 2px #ddd solid;
				text-align: center;
			}

			.open-trades {
				text-align: center;
			}

			.no-last-seen {
				background: rgb(255, 89, 89);
				padding: 9px 1.3px;
				border-radius: 50%;
				width: 1rem;
				margin: 0 auto;
			}

			.open-market-container {
				text-align: center;
			}

			.buy-sell {
			}

			.card {
				padding: 1em;
				border: 1px #666 solid;
				flex: 1 1 auto;
				display: flex;
				flex-flow: column;
				justify-content: space-evenly;
				min-height: inherit;
			}

			.cancel {
				--mdc-theme-primary: rgb(255, 89, 89);
			}

			.border-wrapper {
				border: 1px #666 solid;
				overflow: hidden;
			}

			.you-have {
				color: #555;
				font-size: 15px;
				text-align: right;
				margin-top: 2px;
				margin-bottom: 10px;
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

			.full-width {
				background-color: #fff;
				border: 2px #ddd solid;
				height: 100px;
				text-align: center;
			}

			vaading-grid{
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
				margin: 45% auto;
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

			.ltc.coinName:before  {
				background-image: url('/img/qortltc.png');
			}

			.doge.coinName:before  {
				background-image: url('/img/qortdoge.png');
			}

			.coinName {
				display: inline-block;
				height: 26px;
				padding-left: 45px;
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
					grid-template-columns: 2fr  1fr;
					grid-auto-rows: max(450px);
					column-gap: 0.5em;
					row-gap: 0.4em;
					justify-items: stretch;
					align-items: stretch;
					margin-bottom: 10px;
				}

				.buy-sell {
					display: grid;
					grid-template-columns: 1fr 1fr;
					grid-auto-rows: max(450px);
					column-gap: 0.5em;
					row-gap: 0.4em;
				}

			}
		`;
	}

	constructor() {
		super()
		let qortal = {
			name: "QORTAL",
			balance: "0",
			coinCode: "QORT",
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
			tradeOffersSocketCounter: 1
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
			tradeOffersSocketCounter: 1
		}

		this.listedCoins = new Map()
		this.listedCoins.set("QORTAL", qortal)
		this.listedCoins.set("LITECOIN", litecoin)
		this.listedCoins.set("DOGECOIN", dogecoin)

		workers.set("QORTAL", {
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

		this.selectedCoin = "LITECOIN"
		this.selectedAddress = {}
		this.config = {}
		this.sellBtnDisable = false
		this.isSellLoading = false
		this.buyBtnDisable = true
		this.isBuyLoading = false
		this.initialAmount = 0
		this.cancelBtnDisable = false
		this.cancelStuckOfferBtnDisable = false
		this.isLoadingHistoricTrades = true
		this.isLoadingOpenTrades = true
		this.isLoadingMyOpenOrders = false
	}

	// TODO: Move each template to a separate components! Maybe
	historicTradesTemplate() {
		return html`
			<div class="historic-trades">
				<div class="box">
					<header><span>HISTORIC MARKET TRADES</span></header>
					<div class="border-wrapper">
						<div class="loadingContainer" id="loadingHistoricTrades" style="display:${this.isLoadingHistoricTrades ? 'block' : 'none'}"><div class="loading">Loading...</div></div>
						<vaadin-grid theme="compact column-borders row-stripes wrap-cell-content" id="historicTradesGrid" aria-label="Historic Trades" .items="${this.listedCoins.get(this.selectedCoin).historicTrades}">
							<vaadin-grid-column auto-width resizable header="Amount (QORT)" path="qortAmount"></vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="Price (${this.listedCoins.get(this.selectedCoin).coinCode})"
								.renderer=${(root, column, data) => {
                							const price = this.round(parseFloat(data.item.foreignAmount) / parseFloat(data.item.qortAmount))
                							render(html`${price}`, root)
            							}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="Total (${this.listedCoins.get(this.selectedCoin).coinCode})"
								.renderer=${(root, column, data) => {
                							render(html`<span> ${data.item.foreignAmount} </span>`, root)
            							}}
							>
							</vaadin-grid-column>
						</vaadin-grid>
					</div>
				</div>
			</div>
		`;
    	}

	openTradesTemplate() {
		return html`
			<div class="open-trades">
				<div class="box">
					<header><span>OPEN MARKET SELL ORDERS</span></header>
					<div class="border-wrapper">
						<div class="loadingContainer" id="loadingHistoricTrades" style="display:${this.isLoadingOpenTrades ? 'block' : 'none'}"><div class="loading">Loading...</div></div>
						<vaadin-grid multi-sort="true" theme="compact column-borders row-stripes wrap-cell-content" id="openOrdersGrid" aria-label="Open Orders" .items="${this.listedCoins.get(this.selectedCoin).openFilteredOrders}">
							<vaadin-grid-column
								auto-width
								resizable
								header="Amount (QORT)"
								id="qortAmountColumn"
								path="qortAmount"
								.renderer=${(root, column, data) => {
									render(html`<span> ${this.round(data.item.qortAmount)} </span>`, root)
								}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="Price (${this.listedCoins.get(this.selectedCoin).coinCode})"
								id="priceColumn"
								path="price"
								.renderer=${(root, column, data) => {
									render(html`<span> ${this.round(data.item.price)} </span>`, root)
								}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="Total (${this.listedCoins.get(this.selectedCoin).coinCode})"
								.renderer=${(root, column, data) => {
									render(html`<span> ${data.item.foreignAmount} </span>`, root)
								}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="Seller"
								.renderer=${(root, column, data) => {
									render(html`<span> ${data.item.qortalCreator} </span>`, root)
								}}
							>
							</vaadin-grid-column>
						</vaadin-grid>
					</div>
				</div>
			</div>
		`;
	}

	openMarketTemplate() {
		return html`
			<div class="open-market-container">
				<div class="box">
					<mwc-tab-bar id="tabs-1" activeIndex="0">
						<mwc-tab id="tab-buy" label="Buy" @click=${(e) => this.displayTabContent('buy')}></mwc-tab>
						<mwc-tab id="tab-sell" label="Sell" @click=${(e) => this.displayTabContent('sell')}></mwc-tab>
					</mwc-tab-bar>
					<z id="tabs-1-content">
						<div id="tab-buy-content">
							<div class="card">
								<div style="margin-left: auto">
									<mwc-icon-button class="btn-clear" title="Clear Form" icon="clear_all" @click=${() => this.clearBuyForm()}></mwc-icon-button>
								</div>
								<p>
									<mwc-textfield
										style="width:100%;"
										id="buyAmountInput"
										required readOnly label="Amount (QORT)"
										placeholder="0.0000"
										type="text" 
										auto-validate="false"
										outlined value="${this.initialAmount}"
									>
									</mwc-textfield>
								</p>
								<p>
									<mwc-textfield
										style="width:100%;"
										id="buyPriceInput"
										required readOnly
										label="Price Ea. (${this.listedCoins.get(this.selectedCoin).coinCode})"
										placeholder="0.0000"
										type="text"
										auto-validate="false"
										outlined value="${this.initialAmount}"
									>
									</mwc-textfield>
								</p>
								<p style="margin-bottom: 10px;">
									<mwc-textfield
										style="width:100%;"
										id="buyTotalInput"
										required readOnly
										label="Total (${this.listedCoins.get(this.selectedCoin).coinCode})"
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
								<span class="you-have">You have: ${this.listedCoins.get(this.selectedCoin).balance} ${this.listedCoins.get(this.selectedCoin).coinCode}</span>
								<div class="buttons">
									<div>
										<mwc-button class="buy-button" ?disabled=${this.buyBtnDisable} style="width:100%;" raised @click=${(e) => this.buyAction(e)}>
											${this.isBuyLoading === false ? 'BUY' : html`<paper-spinner-lite active></paper-spinner-lite>`}
										</mwc-button>
									</div>
								</div>
							</div>
						</div>
						<div id="tab-sell-content">
							<div class="card">
								<div style="margin-left: auto">
									<mwc-icon-button class="btn-clear" title="Clear Form" icon="clear_all" @click=${() => this.clearSellForm()}></mwc-icon-button>
								</div>										
								<p>
									<mwc-textfield
										style="width:100%;"
										id="sellAmountInput"
										required label="Amount (QORT)"
										placeholder="0.0000"
										@input=${(e) => {this._checkSellAmount(e)}}
										type="number"
										auto-validate="false"
										outlined value="${this.initialAmount}"
									>
									</mwc-textfield>
								</p>
								<p>
									<mwc-textfield
										style="width:100%;"
										id="sellPriceInput"
										required label="Price Ea. (${this.listedCoins.get(this.selectedCoin).coinCode})"
										placeholder="0.0000"
										@input=${(e) => {this._checkSellAmount(e)}}
										type="number"
										auto-validate="false"
										outlined value="${this.initialAmount}"
									>
									</mwc-textfield>
								</p>
								<p style="margin-bottom: 10px;">
									<mwc-textfield
										style="width:100%;"
										id="sellTotalInput"
										required readOnly
										label="Total (${this.listedCoins.get(this.selectedCoin).coinCode})"
										placeholder="0.0000"
										type="text"
										auto-validate="false"
										outlined value="${this.initialAmount}"
									>
									</mwc-textfield>
								</p>
								<span class="you-have">You have: ${this.listedCoins.get("QORTAL").balance} QORT</span>
								<div class="buttons">
									<div>
										<mwc-button class="sell-button" ?disabled=${this.sellBtnDisable} style="width:100%;" raised @click=${(e) => this.sellAction()}>
											${this.isSellLoading === false ? 'SELL' : html`<paper-spinner-lite active></paper-spinner-lite>`}
										</mwc-button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>	
			</div>
		`;
	}

	myOpenOrdersTemplate() {
		return html`
			<div class="my-open-orders">
				<div class="box">
					<header><span>MY ORDERS</span><mwc-icon-button title="Stuck Orders" icon="more_vert" @click=${() => this.showStuckOrdersDialog()}></mwc-icon-button></header>
					<div class="border-wrapper">
						<div class="loadingContainer" id="loadingHistoricTrades" style="display:${this.isLoadingMyOpenOrders ? 'block' : 'none'}"><div class="loading">Loading...</div></div>
						<vaadin-grid multi-sort="true" theme="compact column-borders row-stripes wrap-cell-content" id="myOrdersGrid" aria-label="My Orders" .items="${this.listedCoins.get(this.selectedCoin).myOrders}">
							<vaadin-grid-column
								auto-width
								resizable
								header="Date"
								.renderer=${(root, column, data) => {
									const dateString = new Date(data.item.timestamp).toLocaleString()
									render(html`${dateString}`, root)
								}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="Status"
								.renderer=${(root, column, data) => {
									render(html`<span id="${data.item.atAddress}"> ${data.item._tradeState} </span>`, root)
								}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="Price (${this.listedCoins.get(this.selectedCoin).coinCode})"
								.renderer=${(root, column, data) => {
									const price = this.round(parseFloat(data.item.foreignAmount) / parseFloat(data.item.qortAmount))
									render(html`${price}`, root)
								}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="Amount (QORT)" path="qortAmount"
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="Total (${this.listedCoins.get(this.selectedCoin).coinCode})" path="foreignAmount"
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="Action"
								.renderer=${(root, column, data) => {
									render(html`${this.renderCancelButton(data.item)}`, root)
								}}
							>
							</vaadin-grid-column>
						</vaadin-grid>
					</div>
				</div>
			</div>
		`;
	}

	myHistoricTradesTemplate() {
		return html`
			<div class="my-historic-trades">
				<div class="box">
					<header>MY TRADE HISTORY</header>
					<div class="border-wrapper">
						<vaadin-grid theme="compact column-borders row-stripes wrap-cell-content" id="myHistoricTradesGrid" aria-label="My Open Orders" .items="${this.listedCoins.get(this.selectedCoin).myHistoricTrades}">
							<vaadin-grid-column
								auto-width
								resizable
								header="Date"
								.renderer=${(root, column, data) => {
									const dateString = new Date(data.item.timestamp).toLocaleString()
									render(html`${dateString}`, root)
								}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="Status"
								.renderer=${(root, column, data) => {
									if (data.item.mode === 'SOLD') return render(html`<span style="color: red"> ${data.item.mode} </span>`, root)
									if (data.item.mode === 'BOUGHT') return render(html`<span style="color: green"> ${data.item.mode} </span>`, root)
									return render(html`<span> ${data.item.mode} </span>`, root)
								}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="Price (${this.listedCoins.get(this.selectedCoin).coinCode})"
								.renderer=${(root, column, data) => {
									const price = this.round(parseFloat(data.item.foreignAmount) / parseFloat(data.item.qortAmount))
									render(html`${price}`, root)
								}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="Amount (QORT)" path="qortAmount"
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="Total (${this.listedCoins.get(this.selectedCoin).coinCode})"
								.renderer=${(root, column, data) => {
									render(html`<span> ${data.item.foreignAmount} </span>`, root)
								}}
							>
							</vaadin-grid-column>
						</vaadin-grid>
					</div>
				</div>
			</div>
		`;
	}

	render() {
		return html`
			<div id="trade-portal-page">
				<div style="min-height: 40px; display: flex; padding-bottom: 0px; margin: 2px 2px 0px 2px ;">
					<h2 style="margin: 0 0 15px 0; line-height: 50px; display: inline;">Qortal Trade Portal - &nbsp;</h2>
					<mwc-select outlined id="coinSelectionMenu" label="Select Trading Pair">
						<mwc-list-item value="LITECOIN" selected></span><span class="coinName ltc">QORT / LTC</span></mwc-list-item>
						<mwc-list-item value="DOGECOIN"><span class="coinName doge">QORT / DOGE</span></mwc-list-item>
					</mwc-select>
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
				</div>
			</div>
			<!-- Manage Stuck Orders Dialog -->
			<mwc-dialog id="manageStuckOrdersDialog" scrimClickAction="${this.cancelStuckOfferBtnDisable ? '' : 'close'}">
				<div style="text-align:center">
					<h1>Stuck Offers</h1>
					<hr />
				</div>
				<div>
					<vaadin-grid style="width: 500px" theme="compact column-borders row-stripes wrap-cell-content" id="stuckOrdersGrid" aria-label="My Offering Orders" .items="${this.listedCoins.get(this.selectedCoin).myOfferingOrders}">
						<vaadin-grid-column auto-width resizable header="Amount (QORT)" path="qortAmount"></vaadin-grid-column>
						<vaadin-grid-column auto-width resizable header="Price (${this.listedCoins.get(this.selectedCoin).coinCode})" path="price"></vaadin-grid-column>
						<vaadin-grid-column auto-width resizable header="Total (${this.listedCoins.get(this.selectedCoin).coinCode})" path="expectedForeignAmount"></vaadin-grid-column>
						<vaadin-grid-column auto-width resizable header="Action" .renderer=${(root, column, data) => { render(html`${this.renderCancelStuckOfferButton(data.item)}`, root) }}></vaadin-grid-column>
					</vaadin-grid>
				</div>
				<mwc-button slot="primaryAction" dialogAction="cancel" class="cancel">Close</mwc-button>
			</mwc-dialog>
		`;
	}

	setForeignCoin(coin) {
		let _this = this
		this.selectedCoin = coin
		this.isLoadingHistoricTrades = true
		this.isLoadingOpenTrades = true
		this.createConnection()
		this._openOrdersGrid.querySelector('#priceColumn').headerRenderer = function (root) {
			root.innerHTML = '<vaadin-grid-sorter path="price" direction="asc">Price (' + _this.listedCoins.get(_this.selectedCoin).coinCode + ')</vaadin-grid-sorter>'
		}
		this.clearSellForm()
		this.clearBuyForm()
		this.updateWalletBalance()
	}

	displayTabContent(tab) {
		const tabBuyContent = this.shadowRoot.getElementById('tab-buy-content')
		const tabSellContent = this.shadowRoot.getElementById('tab-sell-content')
		tabBuyContent.style.display = (tab === 'buy') ? 'block' : 'none'
		tabSellContent.style.display = (tab === 'sell') ? 'block' : 'none'
	}

	reRenderHistoricTrades() {
		this.requestUpdate()
		this.isLoadingHistoricTrades = false
	}

	reRenderOpenFilteredOrders() {
		this.requestUpdate()
		this.isLoadingOpenTrades = false
	}

	reRenderMyOpenOrders() {
		this.requestUpdate()
		this.isLoadingMyOpenOrders = false
	}

	firstUpdated() {
		let _this = this
		setTimeout(() => {
			this.displayTabContent('buy')
		}, 0)

		// Set Trade Panes
		this._openOrdersGrid = this.shadowRoot.getElementById('openOrdersGrid')
		this._openOrdersGrid.querySelector('#priceColumn').headerRenderer = function (root) {
			root.innerHTML = '<vaadin-grid-sorter path="price" direction="asc">Price (' + _this.listedCoins.get(_this.selectedCoin).coinCode + ')</vaadin-grid-sorter>'
		}

		this._openOrdersGrid.querySelector('#qortAmountColumn').headerRenderer = function (root) {
			root.innerHTML = '<vaadin-grid-sorter path="qortAmount">Amount (QORT)</vaadin-grid-sorter>'
		}

		this._myOrdersGrid = this.shadowRoot.getElementById('myOrdersGrid')
		this._historicTradesGrid = this.shadowRoot.getElementById('historicTradesGrid')
		this._myHistoricTradesGrid = this.shadowRoot.getElementById('myHistoricTradesGrid')
		this._stuckOrdersGrid = this.shadowRoot.getElementById('stuckOrdersGrid')

		// call getOpenOrdersGrid
		this.getOpenOrdersGrid()

		window.addEventListener(
			'contextmenu',
			(event) => {
				event.preventDefault()
				this._textMenu(event)
			},
			{ passive: true }
		)

		window.addEventListener(
			'click',
			() => {
				parentEpml.request('closeCopyTextMenu', null)
			},
			{ passive: true }
		)

		window.onkeyup = (e) => {
			if (e.keyCode === 27) parentEpml.request('closeCopyTextMenu', null)
		}

		let configLoaded = false

		parentEpml.ready().then(() => {
			parentEpml.subscribe('selected_address', async (selectedAddress) => {
				this.selectedAddress = {}
				selectedAddress = JSON.parse(selectedAddress)
				if (!selectedAddress || Object.entries(selectedAddress).length === 0) return
				this.selectedAddress = selectedAddress
				this.updateAccountBalance()
			})

			parentEpml.subscribe('config', (c) => {
				if (!configLoaded) configLoaded = true
				this.config = JSON.parse(c)
			})

			parentEpml.subscribe('copy_menu_switch', async (value) => {
				if (value === 'false' && window.getSelection().toString().length !== 0) this.clearSelection()
			})

			let coinSelectionMenu = this.shadowRoot.getElementById("coinSelectionMenu")

			coinSelectionMenu.addEventListener('change', function () {
				_this.setForeignCoin(coinSelectionMenu.value)
			})

			_this.setForeignCoin(coinSelectionMenu.value)
		})
		parentEpml.imReady()

		// Set Last Seen column's title on OpenOrders grid
		setTimeout(() => this.shadowRoot.querySelector('[slot="vaadin-grid-cell-content-3"]').setAttribute('title', 'Last Seen'), 3000)
	}

	fillBuyForm(sellerRequest) {
		this.shadowRoot.getElementById('buyAmountInput').value = parseFloat(sellerRequest.qortAmount)
		this.shadowRoot.getElementById('buyPriceInput').value = this.round(parseFloat(sellerRequest.foreignAmount) / parseFloat(sellerRequest.qortAmount))
		this.shadowRoot.getElementById('buyTotalInput').value = parseFloat(sellerRequest.foreignAmount)
		this.shadowRoot.getElementById('qortalAtAddress').value = sellerRequest.qortalAtAddress
		this.buyBtnDisable = false
	}

	getOpenOrdersGrid() {
		const myGrid = this.shadowRoot.querySelector('#openOrdersGrid')
		myGrid.addEventListener(
			'click', (e) => {
				let myItem = myGrid.getEventContext(e).item
				if (myItem !== undefined && myItem.qortalCreator !== this.selectedAddress.address) {
					this.fillBuyForm(myItem)
				}
			},
			{ passive: true }
		)
	}

	processOfferingTrade(offer) {
		const offerItem = {
			...offer,
			qortAmount: parseFloat(offer.qortAmount),
			price: parseFloat(offer.foreignAmount) / parseFloat(offer.qortAmount),
		}
		const addOffer = () => {
			this.listedCoins.get(this.selectedCoin).openOrders.unshift(offerItem)
		}
		const initOffer = () => {
			this.listedCoins.get(this.selectedCoin).openOrders.push(offerItem)
		}
		this.listedCoins.get(this.selectedCoin).openOrders.length === 0 ? initOffer() : addOffer()
		this.listedCoins.get(this.selectedCoin).tradeOffersSocketCounter > 1 ? this._openOrdersGrid.clearCache() : null
	}

	processRedeemedTrade(offer) {
		// If trade is mine, add it to my historic trades and also add it to historic trades
		if (offer.qortalCreator === this.selectedAddress.address) {
			// Check and Update Wallet Balance
			if (this.listedCoins.get(this.selectedCoin).tradeOffersSocketCounter > 1) {
				this.updateWalletBalance()
			}
			const offerItem = {
				...offer,
				mode: 'SOLD',
			}
			// Add to my historic trades
			this._myHistoricTradesGrid.items.unshift(offerItem)
			this.listedCoins.get(this.selectedCoin).tradeOffersSocketCounter > 1 ? this._myHistoricTradesGrid.clearCache() : null
		} else if (offer.partnerQortalReceivingAddress === this.selectedAddress.address) {
			// Check and Update Wallet Balance
			if (this.listedCoins.get(this.selectedCoin).tradeOffersSocketCounter > 1) {
				this.updateWalletBalance()
			}
			const offerItem = {
				...offer,
				mode: 'BOUGHT',
			}
			// Add to my historic trades
			this._myHistoricTradesGrid.items.unshift(offerItem)
			this.listedCoins.get(this.selectedCoin).tradeOffersSocketCounter > 1 ? this._myHistoricTradesGrid.clearCache() : null
		}
		// Add to historic trades
		const addNewHistoricTrade = () => {
			this._historicTradesGrid.items.unshift(offer)
			this._historicTradesGrid.clearCache()
		}
		this.listedCoins.get(this.selectedCoin).tradeOffersSocketCounter > 1 ? addNewHistoricTrade() : null
	}

	processTradingTrade(offer) {
		// Remove from open market orders
		if (offer.qortalCreator === this.selectedAddress.address && this.listedCoins.get(this.selectedCoin).tradeOffersSocketCounter > 1) {
			// Check and Update Wallet Balance
			this.updateWalletBalance()
		}
		this._openOrdersGrid.items.forEach((item, index) => {
			if (item.qortalAtAddress === offer.qortalAtAddress) {
				this._openOrdersGrid.items.splice(index, 1)
				this.listedCoins.get(this.selectedCoin).tradeOffersSocketCounter > 1 ? this._openOrdersGrid.clearCache() : null
			}
		})
		this.listedCoins.get(this.selectedCoin).openOrders = this.listedCoins.get(this.selectedCoin).openOrders.filter((order) => order.qortalAtAddress !== offer.qortalAtAddress)
	}

	processRefundedTrade(offer) {
		if (offer.qortalCreator === this.selectedAddress.address) {
			// Check and Update Wallet Balance
			if (this.listedCoins.get(this.selectedCoin).tradeOffersSocketCounter > 1) {
				this.updateWalletBalance()
			}
			// Add to my historic trades
			this._myHistoricTradesGrid.items.unshift(offer)
			this.listedCoins.get(this.selectedCoin).tradeOffersSocketCounter > 1 ? this._myHistoricTradesGrid.clearCache() : null
		}
	}

	processCancelledTrade(offer) {
		if (offer.qortalCreator === this.selectedAddress.address) {
			// Check and Update Wallet Balance
			if (this.listedCoins.get(this.selectedCoin).tradeOffersSocketCounter > 1) {
				this.updateWalletBalance()
			}
			// Add to my historic trades
			this._myHistoricTradesGrid.items.unshift(offer)
			this.listedCoins.get(this.selectedCoin).tradeOffersSocketCounter > 1 ? this._myHistoricTradesGrid.clearCache() : null
		}
		this._openOrdersGrid.items.forEach((item, index) => {
			if (item.qortalAtAddress === offer.qortalAtAddress) {
				this._openOrdersGrid.items.splice(index, 1)
				this.listedCoins.get(this.selectedCoin).tradeOffersSocketCounter > 1 ? this._openOrdersGrid.clearCache() : null
			}
		})
		this.listedCoins.get(this.selectedCoin).openOrders = this.listedCoins.get(this.selectedCoin).openOrders.filter((order) => order.qortalAtAddress !== offer.qortalAtAddress)
		this._stuckOrdersGrid.items.forEach((item, index) => {
			if (item.qortalAtAddress === offer.qortalAtAddress) {
				this._stuckOrdersGrid.items.splice(index, 1)
				this._stuckOrdersGrid.clearCache()
			}
		})
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
				this.listedCoins.get(this.selectedCoin).tradeOffersSocketCounter > 1 ? this._openOrdersGrid.clearCache() : null
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
		*  - BOB_WAITING_FOR_P2SH_B
		*  - BOB_WAITING_FOR_AT_REDEEM
		*  - BOB_DONE
		*  - BOB_REFUNDED
		*  - ALICE_WAITING_FOR_P2SH_A
		*  - ALICE_WAITING_FOR_AT_LOCK
		*  - ALICE_WATCH_P2SH_B
		*  - ALICE_DONE
		*  - ALICE_REFUNDING_B
		*  - ALICE_REFUNDING_A
		*  - ALICE_REFUNDED
		*
		* @param {[{}]} states
		*/

		const BitcoinACCTv1 = (states) => {
			// Reverse the states
			states.reverse()
			states.forEach((state) => {
				if (state.creatorAddress === this.selectedAddress.address) {
					if (state.tradeState == 'BOB_WAITING_FOR_AT_CONFIRM') {
						this.changeTradeBotState(state, 'PENDING')
					} else if (state.tradeState == 'BOB_WAITING_FOR_MESSAGE') {
						this.changeTradeBotState(state, 'LISTED')
					} else if (state.tradeState == 'BOB_WAITING_FOR_P2SH_B') {
						this.changeTradeBotState(state, 'TRADING')
					} else if (state.tradeState == 'BOB_WAITING_FOR_AT_REDEEM') {
						this.changeTradeBotState(state, 'REDEEMING')
					} else if (state.tradeState == 'BOB_DONE') {
						this.handleCompletedState(state)
					} else if (state.tradeState == 'BOB_REFUNDED') {
						this.handleCompletedState(state)
					} else if (state.tradeState == 'ALICE_WAITING_FOR_P2SH_A') {
						this.changeTradeBotState(state, 'PENDING')
					} else if (state.tradeState == 'ALICE_WAITING_FOR_AT_LOCK') {
						this.changeTradeBotState(state, 'TRADING')
					} else if (state.tradeState == 'ALICE_WATCH_P2SH_B') {
						this.changeTradeBotState(state, 'TRADING')
					} else if (state.tradeState == 'ALICE_DONE') {
						this.handleCompletedState(state)
					} else if (state.tradeState == 'ALICE_REFUNDING_B') {
						this.changeTradeBotState(state, 'REFUNDING')
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
			// Reverse the states
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
			// Reverse the states
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
			default:
				break
		}

		// Fill Historic Trades and Filter Stuck Trades
		if (this.listedCoins.get(this.selectedCoin).tradeOffersSocketCounter === 1) {
			setTimeout(() => this.filterStuckTrades(tradeStates), 50)
		}
	}

	changeTradeBotState(state, tradeState) {
		// Set Loading state
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
					this._myOrdersGrid.items.splice(index, 1)
					this._myOrdersGrid.items.unshift(stateItem)
					this._myOrdersGrid.clearCache()
				}
			})
		}
		item ? updateStateItem() : addStateItem()
	}

	// ONLY USE FOR BOB_DONE, BOB_REFUNDED, ALICE_DONE, ALICE_REFUNDED
	handleCompletedState(state) {
		this._myOrdersGrid.items.forEach((item, index) => {
			if (item.atAddress === state.atAddress) {
				this._myOrdersGrid.items.splice(index, 1)
				this._myOrdersGrid.clearCache()
			}
		})
	}

	initSocket() {
		let _relatedCoin = ""
		let presenceTxns = null
		let offeringTrades = null
		let filteredOffers = []

		self.addEventListener('message', function (event) {
			switch (event.data.type) {
				case 'open_orders':
					offeringTrades = event.data.content
					handleOfferingTrades()
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

		const processOffersWithPresence = () => {
			const waitFor = (ms) => new Promise((r) => setTimeout(r, ms))
			async function asyncForEach(array, callback) {
				for (let index = 0; index < array.length; index++) {
					await callback(array[index], index, array)
				}
			}
			const startOfferPresenceMapping = async () => {
				await asyncForEach(presenceTxns, async (presence) => {
					await waitFor(5)
					let offerIndex = offeringTrades.findIndex((offeringTrade) => offeringTrade.qortalCreatorTradeAddress === presence.address)
					offerIndex !== -1 ? (offeringTrades[offerIndex].lastSeen = presence.timestamp) : null
                		})
				filteredOffers = offeringTrades.filter((offeringTrade) => lessThanThirtyMinsAgo(offeringTrade.lastSeen))
				self.postMessage({ type: 'PRESENCE', data: { offers: offeringTrades, filteredOffers: filteredOffers, relatedCoin: _relatedCoin } })
				filteredOffers = []
			}
			startOfferPresenceMapping()
		}

		const handleOfferingTrades = () => {
			if (presenceTxns === null) return
			processOffersWithPresence()
		}

		const handlePresence = () => {
			if (offeringTrades === null) return
			processOffersWithPresence()
		}

		const initTradeOffersWebSocket = (restarted = false) => {
			let tradeOffersSocketCounter = 0
			let socketTimeout
			let socketLink = `ws://NODEURL/websockets/crosschain/tradeoffers?foreignBlockchain=FOREIGN_BLOCKCHAIN&includeHistoric=true`
			const socket = new WebSocket(socketLink)
			// Open Connection
			socket.onopen = () => {
				setTimeout(pingSocket, 50)
				tradeOffersSocketCounter += 1
			}
			// Message Event
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
			// Closed Event
			socket.onclose = () => {
				clearTimeout(socketTimeout)
				// Restart Socket Connection
				restartTradeOffersWebSocket()
			}
			// Error Event
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
			// Open Connection
			socket.onopen = () => {
				setTimeout(pingSocket, 50)
			}
			// Message Event
			socket.onmessage = (e) => {
				e.relatedCoin = _relatedCoin
				self.postMessage({
					type: 'TRADE_BOT',
					data: e.data,
					isRestarted: restarted,
				})
				restarted = false
			}
			// Closed Event
			socket.onclose = () => {
				clearTimeout(socketTimeout)
				// Restart Socket Connection
				restartTradeBotWebSocket()
			}
			// Error Event
			socket.onerror = (e) => {
				clearTimeout(socketTimeout)
			}
			const pingSocket = () => {
				socket.send('ping')
				socketTimeout = setTimeout(pingSocket, 295000)
			}
		}

		const initPresenceWebSocket = (restarted = false) => {
			let socketTimeout
			let socketLink = `ws://NODEURL/websockets/presence?presenceType=TRADE_BOT`
			const socket = new WebSocket(socketLink)
			// Open Connection
			socket.onopen = () => {
				setTimeout(pingSocket, 50)
			}
			// Message Event
			socket.onmessage = (e) => {
				presenceTxns = JSON.parse(e.data)
				handlePresence()
				restarted = false
			}
			// Closed Event
			socket.onclose = () => {
				clearTimeout(socketTimeout)
				// Restart Socket Connection
				restartPresenceWebSocket()
			}
			// Error Event
			socket.onerror = (e) => {
				clearTimeout(socketTimeout)
			}
			const pingSocket = () => {
				socket.send('ping')
				socketTimeout = setTimeout(pingSocket, 295000)
			}
		}

		const restartPresenceWebSocket = () => {
			setTimeout(() => initPresenceWebSocket(true), 3000)
		}

		const restartTradeOffersWebSocket = () => {
			setTimeout(() => initTradeOffersWebSocket(true), 3000)
		}

		const restartTradeBotWebSocket = () => {
			setTimeout(() => initTradeBotWebSocket(true), 3000)
		}

		// Start TradeOffersWebSocket
		initTradeOffersWebSocket()

		// Start PresenceWebSocket
		initPresenceWebSocket()

		// Start TradeBotWebSocket
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
				case 'LITECOIN':
					_receivingAddress = this.selectedAddress.ltcWallet.address
					break
				case 'DOGECOIN':
					_receivingAddress = this.selectedAddress.dogeWallet.address
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
				parentEpml.request('showSnackBar', 'Failed to Create Trade. Try again!')
			} else {
				this.isSellLoading = false
				this.sellBtnDisable = false
				parentEpml.request('showSnackBar', `Failed to Create Trade. ERROR_CODE: ${response.message}`)
			}
		}

		if (this.round(parseFloat(fundingQortAmount) + parseFloat(0.002)) > parseFloat(this.listedCoins.get("QORTAL").balance)) {
			this.isSellLoading = false
			this.sellBtnDisable = false
			parentEpml.request('showSnackBar', 'Insufficient Funds!')
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
			case 'LITECOIN':
				_foreignKey = this.selectedAddress.ltcWallet.derivedMasterPrivateKey
				break
			case 'DOGECOIN':
				_foreignKey = this.selectedAddress.dogeWallet.derivedMasterPrivateKey
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
				parentEpml.request('showSnackBar', 'Buy Request Successful!')
			} else if (response === false) {
				this.isBuyLoading = false
				this.buyBtnDisable = false
				parentEpml.request('showSnackBar', 'Buy Request Existing!')
			} else {
				this.isBuyLoading = false
				this.buyBtnDisable = false
				parentEpml.request('showSnackBar', `Failed to Create Trade. ERROR_CODE: ${response.message}`)
			}
		}

		// Call makeRequest
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
				parentEpml.request('showSnackBar', 'Trade Cancelling In Progress!')
			} else if (response === false) {
				button.innerHTML = 'CANCEL'
				this.cancelBtnDisable = false
				parentEpml.request('showSnackBar', 'Failed to Cancel Trade. Try again!')
			} else {
				button.innerHTML = 'CANCEL'
				this.cancelBtnDisable = false
				parentEpml.request('showSnackBar', `Failed to Cancel Trade. ERROR_CODE: ${response.message}`)
			}
		}

		// Call makeRequest
		const res = await makeRequest()
		manageResponse(res)
	}

	updateAccountBalance() {
		clearTimeout(this.updateAccountBalanceTimeout)
		parentEpml.request('apiCall', {
			url: `/addresses/balance/${this.selectedAddress.address}`,
		})
		.then((res) => {
			this.listedCoins.get("QORTAL").balance = res
			this.updateAccountBalanceTimeout = setTimeout(() => this.updateAccountBalance(), 10000)
		})
	}

	updateWalletBalance() {
		let _url = ``
		let _body = null

		switch (this.selectedCoin) {
			case 'LITECOIN':
				_url = `/crosschain/ltc/walletbalance`
				_body = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet.derivedMasterPublicKey
				break
			case 'DOGECOIN':
				_url = `/crosschain/doge/walletbalance`
				_body = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet.derivedMasterPublicKey
				break
			default:
				break
		}

		parentEpml.request('apiCall', {
			url: _url,
			method: 'POST',
			body: _body,
		})
		.then((res) => {
			if (isNaN(Number(res))) {
				parentEpml.request('showSnackBar', 'Failed to Fetch Balance. Try again!')
			} else {
				this.listedCoins.get(this.selectedCoin).balance = (Number(res) / 1e8).toFixed(8)
			}
		})
	}

	renderCancelButton(stateItem) {
		if (stateItem.tradeState === 'BOB_WAITING_FOR_MESSAGE') {
			return html`<mwc-button id="${stateItem.atAddress}" ?disabled=${this.cancelBtnDisable} class="cancel" @click=${(e) => this.cancelAction(stateItem)}>CANCEL</mwc-button>`
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
				parentEpml.request('showSnackBar', 'Trade Cancelling In Progress!')
			} else if (response === false) {
				this.cancelStuckOfferBtnDisable = false
				parentEpml.request('showSnackBar', 'Failed to Cancel Trade. Try again!')
			} else {
				this.cancelStuckOfferBtnDisable = false
				parentEpml.request('showSnackBar', `Failed to Cancel Trade. ERROR_CODE: ${response.message}`)
			}
		}

		// Call makeRequest
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

	// Helper Functions (Re-Used in Most part of the UI )
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
			{ searchValue: 'FOREIGN_BLOCKCHAIN', replaceValue: this.selectedCoin, },
		]

		workers.get(this.selectedCoin).tradesConnectedWorker = this.inlineWorker(this.initSocket, modifiers)

		workers.get(this.selectedCoin).tradesConnectedWorker.addEventListener(
			'message',
			function (event) {
				handleMessage(event.data)
			},
			{ passive: true }
		)

		workers.get(this.selectedCoin).tradesConnectedWorker.postMessage({ type: "set_coin", content: this.selectedCoin })
	}

	handleStuckTrades() {
		let tradeBotStates = []

		self.addEventListener('message', function (event) {
			tradeBotStates = event.data
		})

		const getCompletedTrades = async () => {
			const url = `http://NODEURL/crosschain/trades?limit=100&reverse=true&foreignBlockchain=FOREIGN_BLOCKCHAIN`
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

		// Get Historic Trades
		getCompletedTrades()

		// Get Offers
		getOffers()
	}

	filterStuckTrades(states) {
		if (workers.get(this.selectedCoin).handleStuckTradesConnectedWorker !== null) {
			this.isLoadingOpenTrades = false
			return
		}

		//show the loading on historic trades
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
