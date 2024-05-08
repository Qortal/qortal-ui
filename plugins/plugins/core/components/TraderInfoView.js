import { html, LitElement } from 'lit'
import { render } from 'lit/html.js'
import { traderInfoViewStyles } from './plugins-css'
import '@material/mwc-button'
import '@material/mwc-icon'
import '@polymer/paper-dialog/paper-dialog.js'
import '@vaadin/grid'
import '@vaadin/grid/vaadin-grid-sorter'

// Multi language support
import { get, translate } from '../../../../core/translate'

class TraderInfoView extends LitElement {
	static get properties() {
		return {
			theme: { type: String, reflect: true },
			isLoadingBoughtTradesBTC: { type: Boolean },
			isLoadingBoughtTradesLTC: { type: Boolean },
			isLoadingBoughtTradesDOGE: { type: Boolean },
			isLoadingBoughtTradesDGB: { type: Boolean },
			isLoadingBoughtTradesRVN: { type: Boolean },
			isLoadingBoughtTradesARRR: { type: Boolean },
			isLoadingSoldTradesBTC: { type: Boolean },
			isLoadingSoldTradesLTC: { type: Boolean },
			isLoadingSoldTradesDOGE: { type: Boolean },
			isLoadingSoldTradesDGB: { type: Boolean },
			isLoadingSoldTradesRVN: { type: Boolean },
			isLoadingSoldTradesARRR: { type: Boolean },
			isLoadingCompleteInfo: { type: Boolean },
			infoAccountName: { type: String },
			imageUrl: { type: String },
			addressResult: { type: Array },
			nameAddressResult: { type: Array },
			displayAddress: { type: String },
			displayLevel: { type: String },
			displayBalance: { type: Number },
			explorerBoughtBTCTrades: { type: Array },
			explorerBoughtLTCTrades: { type: Array },
			explorerBoughtDOGETrades: { type: Array },
			explorerBoughtDGBTrades: { type: Array },
			explorerBoughtRVNTrades: { type: Array },
			explorerBoughtARRRTrades: { type: Array },
			explorerSoldBTCTrades: { type: Array },
			explorerSoldLTCTrades: { type: Array },
			explorerSoldDOGETrades: { type: Array },
			explorerSoldDGBTrades: { type: Array },
			explorerSoldRVNTrades: { type: Array },
			explorerSoldARRRTrades: { type: Array },
			allPayments: { type: Array },
			slicedArray: { type: Array },
			allReceivedPayments: { type: Array },
			allSendPayments: { type: Array },
			startMintTime: { type: String },
			startMinting: { type: Array },
			totalSent: { type: Number },
			totalReceived: { type: Number },
			txtimestamp: { type: String },
			txcreatorAddress: { type: String },
			txrecipient: { type: String },
			txamount: { type: String },
			txfee: { type: String },
			txblockHeight: { type: String }
		}
	}

	static get styles() {
		return [traderInfoViewStyles]
	}

	constructor() {
		super()
		this.infoAccountName = ''
		this.imageUrl = ''
		this.addressResult = []
		this.nameAddressResult = []
		this.displayAddress = ''
		this.displayLevel = ''
		this.displayBalance = 0
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
		this.isLoadingBoughtTradesBTC = false
		this.isLoadingBoughtTradesLTC = false
		this.isLoadingBoughtTradesDOGE = false
		this.isLoadingBoughtTradesDGB = false
		this.isLoadingBoughtTradesRVN = false
		this.isLoadingBoughtTradesARRR = false
		this.isLoadingSoldTradesBTC = false
		this.isLoadingSoldTradesLTC = false
		this.isLoadingSoldTradesDOGE = false
		this.isLoadingSoldTradesDGB = false
		this.isLoadingSoldTradesRVN = false
		this.isLoadingSoldTradesARRR = false
		this.isLoadingCompleteInfo = false
		this.explorerBoughtBTCTrades = []
		this.explorerBoughtLTCTrades = []
		this.explorerBoughtDOGETrades = []
		this.explorerBoughtDGBTrades = []
		this.explorerBoughtRVNTrades = []
		this.explorerBoughtARRRTrades = []
		this.explorerSoldBTCTrades = []
		this.explorerSoldLTCTrades = []
		this.explorerSoldDOGETrades = []
		this.explorerSoldDGBTrades = []
		this.explorerSoldRVNTrades = []
		this.explorerSoldARRRTrades = []
		this.allPayments = []
		this.slicedArray = []
		this.allReceivedPayments = []
		this.allSendPayments = []
		this.startMintTime = ''
		this.startMinting = []
		this.totalSent = 0
		this.totalReceived = 0
		this.txtimestamp = ''
		this.txcreatorAddress = ''
		this.txrecipient = ''
		this.txamount = ''
		this.txfee = ''
		this.txblockHeight = ''
	}

	render() {
		return html`
			<paper-dialog class="full-info-wrapper" id="userFullInfoDialog" modal>
				<div class="full-info-logo">${this.avatarFullImage()}</div>
				<h3>${this.infoAccountName}</h3>
				<p style="color: var(--black);"><b>${this.displayAddress}</b></p>
				<div class="loadingContainer" id="loadingExplorerTrades" style="display:${this.isLoadingCompleteInfo ? 'block' : 'none'}">
					<div class="loading"></div>
					<span style="color: var(--black);">${translate("login.loading")}</span>
				</div>
				<div class="data-info" style="display:${this.isLoadingCompleteInfo ? 'none' : ''}">
					<ul>
						<li>
							<span class="data-items">${translate("mintingpage.mchange27")}</span> ${this.displayLevel}
						</li>
						<li>
							<span class="data-items">${translate("walletprofile.blocksminted")}</span> ${this.addressResult.blocksMinted + this.addressResult.blocksMintedAdjustment}
						</li>
						<li>
							<span class="data-items">${translate("explorerpage.exp15")}</span> ${this.startMintTime}
						</li>
						<li>
							<span class="data-items">${translate("general.balance")}</span> ${this.displayBalance} QORT
						</li>
						<li>
							<span class="data-items">${translate("explorerpage.exp6")}</span> ${this.founderStatus()}
						</li>
					</ul>
				</div>
				<div class="data-info" style="display:${this.isLoadingCompleteInfo ? 'none' : ''}">
					<ul>
						<li>
							<span class="data-items">${translate("explorerpage.exp18")}</span> ${this.allPayments.length}
						</li>
						<li>
							<span class="data-items">${translate("explorerpage.exp19")}</span> ${this.allSendPayments.length}
						</li>
						<li>
							<span class="data-items">QORT ${translate("explorerpage.exp19")}</span> ${this.totalSent.toFixed(0)} QORT
						</li>
						<li>
							<span class="data-items">${translate("explorerpage.exp20")}</span> ${this.allReceivedPayments.length}
						</li>
						<li>
							<span class="data-items">QORT ${translate("explorerpage.exp20")}</span> ${this.totalReceived.toFixed(0)} QORT
						</li>
					</ul>
				</div>
				<div class="explorer-trades">
					<div class="box-info">
						<header>${translate("explorerpage.exp22")}</header>
						<div class="border-wrapper">
							<div class="loadingContainer" id="loadingExplorerTrades" style="display:${this.isLoadingCompleteInfo ? 'block' : 'none'}">
								<div class="loading"></div>
								<span style="color: var(--black);">${translate("login.loading")}</span>
							</div>
							<vaadin-grid theme="compact" id="lastQortPaymentsGrid" ?hidden="${this.isEmptyArray(this.slicedArray)}" .items="${this.slicedArray}">
								<vaadin-grid-column
									auto-width
									header="${translate("walletpage.wchange35")}"
									.renderer=${(root, column, data) => {
										render(html`${translate("walletpage.wchange40")} ${data.item.creatorAddress === this.displayAddress ?
											html`
												<span class="color-out">${translate("walletpage.wchange7")}</span>
											`
											: html`
												<span class="color-in">${translate("walletpage.wchange8")}</span>
											`
										} `, root)
									}}
								>
								</vaadin-grid-column>
								<vaadin-grid-column auto-width header="${translate("walletpage.wchange11")}" path="amount"></vaadin-grid-column>
								<vaadin-grid-column
									auto-width
									header="${translate("walletpage.wchange14")}"
									.renderer=${(root, column, data) => {
										const dateString = new Date(data.item.timestamp).toLocaleDateString()
										render(html`${dateString}`, root)
									}}
								>
								</vaadin-grid-column>
								<vaadin-grid-column
									auto-width
									resizable
									header="${translate("explorerpage.exp7")}"
									.renderer=${(root, column, data) => {
										render(html`
											<span @click="${() => this.showPaymentDetails(data)}">
												<mwc-icon class="btn-info">info</mwc-icon>
											</span>
										`, root)
									}}
								>
								</vaadin-grid-column>
							</vaadin-grid>
							${this.isEmptyArray(this.slicedArray) ? html`
								<span style="color: var(--black); font-size: 16px; text-align: center;">${translate("walletpage.wchange38")}</span>
							`: ''}
						</div>
					</div>
				</div>
				<div>
					<span class="paybutton">
						<mwc-button class='green' @click=${() => this.showAllPayments()}>${translate("explorerpage.exp23")}</mwc-button>
					</span>
					<span class="buttons">
						<mwc-button @click=${() => this.openTrades()}>${translate("explorerpage.exp21")}</mwc-button>
						<mwc-button class='decline' @click=${() => this.closeCompleteInfoDialog()} dialog-dismiss>${translate("general.close")}</mwc-button>
					</span>
				</div>
			</paper-dialog>
			<paper-dialog style="background: var(--white); border: 1px solid var(--black); border-radius: 5px;" id="showAllPaymentsDialog" modal>
				<div style="text-align: center; color: var(--black);">
					<h1>${translate("explorerpage.exp17")}</h1>
					<hr />
				</div>
				<div class="explorer-trades">
					<div class="box-info-full">
						<header>${translate("explorerpage.exp17")}</header>
						<div class="border-wrapper">
							<div class="loadingContainer" id="loadingExplorerTrades" style="display:${this.isLoadingCompleteInfo ? 'block' : 'none'}">
								<div class="loading"></div>
								<span style="color: var(--black);">${translate("login.loading")}</span>
							</div>
							<vaadin-grid theme="compact" id="allQortPaymentsGrid" ?hidden="${this.isEmptyArray(this.allPayments)}" .items="${this.allPayments}">
								<vaadin-grid-column
									auto-width
									header="${translate("walletpage.wchange35")}"
									.renderer=${(root, column, data) => {
										render(html`${translate("walletpage.wchange40")} ${data.item.creatorAddress === this.displayAddress ?
											html`
												<span class="color-out">${translate("walletpage.wchange7")}</span>
											`
											: html`
												<span class="color-in">${translate("walletpage.wchange8")}</span>
											`
										} `, root)
									}}
								>
								</vaadin-grid-column>
								<vaadin-grid-column auto-width header="${translate("walletpage.wchange11")}" path="amount"></vaadin-grid-column>
								<vaadin-grid-column
									auto-width
									header="${translate("walletpage.wchange14")}"
									.renderer=${(root, column, data) => {
										const dateString = new Date(data.item.timestamp).toLocaleDateString()
										render(html`${dateString}`, root)
									}}
								>
								</vaadin-grid-column>
								<vaadin-grid-column
									auto-width
									resizable
									header="${translate("explorerpage.exp7")}"
									.renderer=${(root, column, data) => {
										render(html`
											<span @click="${() => this.showPaymentDetails(data)}">
												<mwc-icon class="btn-info">info</mwc-icon>
											</span>
										`, root)
									}}
								>
								</vaadin-grid-column>
							</vaadin-grid>
							${this.isEmptyArray(this.allPayments) ? html`
								<span style="color: var(--black); font-size: 16px; text-align: center;">${translate("walletpage.wchange38")}</span>
							`: ''}
						</div>
					</div>
				</div>
				<div>
					<span class="buttons">
						<mwc-button class='decline' @click=${() => this.closeShowAllPaymentsDialog()} dialog-dismiss>${translate("general.close")}</mwc-button>
					</span>
				</div>
			</paper-dialog>
			<paper-dialog style="background: var(--white); border: 1px solid var(--black); border-radius: 5px;" id="userErrorDialog" modal>
				<div class="card-container">
					<img class="badge" src="/img/notfound.png" />
					<h2>${translate("explorerpage.exp4")}</h2>
					<h4>${translate("explorerpage.exp5")}</h4>
				</div>
				<div class="buttons">
					<mwc-button class='decline' @click=${() => this.closeErrorDialog()} dialog-dismiss>${translate("general.close")}</mwc-button>
				</div>
			</paper-dialog>
			<paper-dialog style="background: var(--white); border: 1px solid var(--black); border-radius: 5px;" id="userTrades" modal>
				<div class="card-container-button">
					<mwc-button dense unelevated label="${translate("explorerpage.exp8")}" @click=${() => this.openUserBoughtDialog()}></mwc-button><br><br>
					<mwc-button dense unelevated label="${translate("explorerpage.exp9")}" @click=${() => this.openUserSoldDialog()}></mwc-button><br><br>
				</div>
				<div class="buttons">
					<mwc-button class='decline' @click=${() => this.closeTrades()} dialog-dismiss>${translate("general.close")}</mwc-button>
				</div>
			</paper-dialog>
			<paper-dialog style="background: var(--white); border: 1px solid var(--black); border-radius: 5px;" id="userBoughtDialog">
				<div class="card-explorer-container">
					<div id="first-explorer-section">
						${this.boughtBTCTemplate()}
						${this.boughtLTCTemplate()}
					</div>
					<div id="second-explorer-section">
						${this.boughtDOGETemplate()}
						${this.boughtDGBTemplate()}
					</div>
					<div id="third-explorer-section">
						${this.boughtRVNTemplate()}
						${this.boughtARRRTemplate()}
					</div>
				</div>
				<div class="buttons">
					<mwc-button class='decline' @click=${() => this.closeBoughtDialog()} dialog-dismiss>${translate("general.close")}</mwc-button>
				</div>
			</paper-dialog>
			<paper-dialog style="background: var(--white); border: 1px solid var(--black); border-radius: 5px; overflow: auto;" id="userSoldDialog">
				<div class="card-explorer-container">
					<div id="first-explorer-section">
						${this.soldBTCTemplate()}
						${this.soldLTCTemplate()}
					</div>
					<div id="second-explorer-section">
						${this.soldDOGETemplate()}
						${this.soldDGBTemplate()}
					</div>
					<div id="third-explorer-section">
						${this.soldRVNTemplate()}
						${this.soldARRRTemplate()}
					</div>
				</div>
				<div class="buttons">
					<mwc-button class='decline' @click=${() => this.closeSoldDialog()} dialog-dismiss>${translate("general.close")}</mwc-button>
				</div>
			</paper-dialog>
			<paper-dialog style="background: var(--white); border: 1px solid var(--black); border-radius: 5px;" id="showTxDetailsDialog" modal>
				<div style="text-align: center; color: var(--black);">
					<h1>${translate("walletpage.wchange5")}</h1>
					<hr />
				</div>
				<div id="transactionList">
					<span class="title"> ${translate("walletpage.wchange6")} </span>
					<br />
					<div>
						<span>
							${translate("walletpage.wchange40")} ${this.txcreatorAddress === this.displayAddress ?
								html`
									<span class="color-out">${translate("walletpage.wchange7")}</span>
								`
								: html`
									<span class="color-in">${translate("walletpage.wchange8")}</span>
								`
							}
						</span>
					</div>
					<span class="title">${translate("walletpage.wchange9")}</span>
					<br />
					<div><span>${this.txcreatorAddress}</span></div>
					<span class="title">${translate("walletpage.wchange10")}</span>
					<br />
					<div><span>${this.txrecipient}</span></div>
					<span class="title">${translate("walletpage.wchange12")}</span>
					<br />
					<div><span>${this.txfee} QORT</span></div>
					<span class="title">${translate("walletpage.wchange37")}</span>
					<br />
					<div><span>${this.txamount} QORT</span></div>
					<span class="title">${translate("walletpage.wchange13")}</span>
					<br />
					<div><span>${this.txblockHeight}</span></div>
					<span class="title"> ${translate("walletpage.wchange14")} </span>
					<br />
					<div><span>${new Date(this.txtimestamp).toString()}</span></div>
				</div>
				<div class="buttons">
					<mwc-button class='decline' @click=${() => this.closeSoldDialog()} dialog-dismiss>${translate("general.close")}</mwc-button>
				</div>
			</paper-dialog>
		`
	}

	firstUpdated() {
		// ...
	}

	boughtBTCTemplate() {
		return html`
			<div class="explorer-trades">
				<div class="box">
					<header>${translate("explorerpage.exp10")} (BTC)</header>
					<div class="border-wrapper">
						<div class="loadingContainer" id="loadingExplorerTrades" style="display:${this.isLoadingBoughtTradesBTC ? 'block' : 'none'}">
							<div class="loading"></div>
							<span style="color: var(--black);">${translate("login.loading")}</span>
						</div>
						<vaadin-grid
							theme="compact column-borders row-stripes wrap-cell-content"
							id="explorerBTCTradesGrid" aria-label="Explorer Bought With BTC"
							?hidden="${this.isEmptyArray(this.explorerBoughtBTCTrades)}"
							.items="${this.explorerBoughtBTCTrades}"
						>
							<vaadin-grid-column
								width="170px"
								flex-grow="0"
								header="${translate("tradepage.tchange11")}"
								.renderer=${(root, column, data) => {
									const dateString = new Date(data.item.timestamp).toLocaleDateString()
									render(html`${dateString}`, root)
								}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="${translate("tradepage.tchange9")} (BTC)"
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
						</vaadin-grid>
						<div style="display:${this.isLoadingBoughtTradesBTC ? 'none' : ''}; padding: 10px;">
							${this.isEmptyArray(this.explorerBoughtBTCTrades) ? html`
								<span style="color: var(--black); font-size: 16px; text-align: center;">${translate("explorerpage.exp12")}</span>
							`: ''}
						</div>
					</div>
				</div>
			</div>
		`
	}

	boughtLTCTemplate() {
		return html`
			<div class="explorer-trades">
				<div class="box">
					<header>${translate("explorerpage.exp10")} (LTC)</header>
					<div class="border-wrapper">
						<div class="loadingContainer" id="loadingExplorerTrades" style="display:${this.isLoadingBoughtTradesLTC ? 'block' : 'none'}">
							<div class="loading"></div>
							<span style="color: var(--black);">${translate("login.loading")}</span>
						</div>
						<vaadin-grid
							theme="compact column-borders row-stripes wrap-cell-content"
							id="explorerLTCTradesGrid" aria-label="Explorer Bought With LTC"
							?hidden="${this.isEmptyArray(this.explorerBoughtLTCTrades)}"
							.items="${this.explorerBoughtLTCTrades}"
						>
							<vaadin-grid-column
								width="170px"
								flex-grow="0"
								header="${translate("tradepage.tchange11")}"
								.renderer=${(root, column, data) => {
									const dateString = new Date(data.item.timestamp).toLocaleDateString()
									render(html`${dateString}`, root)
								}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="${translate("tradepage.tchange9")} (LTC)"
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
						</vaadin-grid>
						<div style="display:${this.isLoadingBoughtTradesLTC ? 'none' : ''}; padding: 10px;">
							${this.isEmptyArray(this.explorerBoughtLTCTrades) ? html`
								<span style="color: var(--black); font-size: 16px; text-align: center;">${translate("explorerpage.exp12")}</span>
							`: ''}
						</div>
					</div>
				</div>
			</div>
		`
	}

	boughtDOGETemplate() {
		return html`
			<div class="explorer-trades">
				<div class="box">
					<header>${translate("explorerpage.exp10")} (DOGE)</header>
					<div class="border-wrapper">
						<div class="loadingContainer" id="loadingExplorerTrades" style="display:${this.isLoadingBoughtTradesDOGE ? 'block' : 'none'}">
							<div class="loading"></div>
							<span style="color: var(--black);">${translate("login.loading")}</span>
						</div>
						<vaadin-grid
							theme="compact column-borders row-stripes wrap-cell-content"
							id="explorerDOGETradesGrid" aria-label="Explorer Bought With DOGE"
							?hidden="${this.isEmptyArray(this.explorerBoughtDOGETrades)}"
							.items="${this.explorerBoughtDOGETrades}"
						>
							<vaadin-grid-column
								width="170px"
								flex-grow="0"
								header="${translate("tradepage.tchange11")}"
								.renderer=${(root, column, data) => {
									const dateString = new Date(data.item.timestamp).toLocaleDateString()
									render(html`${dateString}`, root)
								}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="${translate("tradepage.tchange9")} (DOGE)"
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
						</vaadin-grid>
						<div style="display:${this.isLoadingBoughtTradesDOGE ? 'none' : ''}; padding: 10px;">
							${this.isEmptyArray(this.explorerBoughtDOGETrades) ? html`
								<span style="color: var(--black); font-size: 16px; text-align: center;">${translate("explorerpage.exp12")}</span>
							`: ''}
						</div>
					</div>
				</div>
			</div>
		`
	}

	boughtDGBTemplate() {
		return html`
			<div class="explorer-trades">
				<div class="box">
					<header>${translate("explorerpage.exp10")} (DGB)</header>
					<div class="border-wrapper">
						<div class="loadingContainer" id="loadingExplorerTrades" style="display:${this.isLoadingBoughtTradesDGB ? 'block' : 'none'}">
							<div class="loading"></div>
							<span style="color: var(--black);">${translate("login.loading")}</span>
						</div>
						<vaadin-grid
							theme="compact column-borders row-stripes wrap-cell-content"
							id="explorerDGBTradesGrid" aria-label="Explorer Bought With DGB"
							?hidden="${this.isEmptyArray(this.explorerBoughtDGBTrades)}"
							.items="${this.explorerBoughtDGBTrades}"
						>
							<vaadin-grid-column
								width="170px"
								flex-grow="0"
								header="${translate("tradepage.tchange11")}"
								.renderer=${(root, column, data) => {
									const dateString = new Date(data.item.timestamp).toLocaleDateString()
									render(html`${dateString}`, root)
								}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="${translate("tradepage.tchange9")} (DGB)"
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
						</vaadin-grid>
						<div style="display:${this.isLoadingBoughtTradesDGB ? 'none' : ''}; padding: 10px;">
							${this.isEmptyArray(this.explorerBoughtDGBTrades) ? html`
								<span style="color: var(--black); font-size: 16px; text-align: center;">${translate("explorerpage.exp12")}</span>
							`: ''}
						</div>
					</div>
				</div>
			</div>
		`
	}

	boughtRVNTemplate() {
		return html`
			<div class="explorer-trades">
				<div class="box">
					<header>${translate("explorerpage.exp10")} (RVN)</header>
					<div class="border-wrapper">
						<div class="loadingContainer" id="loadingExplorerTrades" style="display:${this.isLoadingBoughtTradesRVN ? 'block' : 'none'}">
							<div class="loading"></div>
							<span style="color: var(--black);">${translate("login.loading")}</span>
						</div>
						<vaadin-grid
							theme="compact column-borders row-stripes wrap-cell-content"
							id="explorerRVNTradesGrid" aria-label="Explorer Bought With RVN"
							?hidden="${this.isEmptyArray(this.explorerBoughtRVNTrades)}"
							.items="${this.explorerBoughtRVNTrades}"
						>
							<vaadin-grid-column
								width="170px"
								flex-grow="0"
								header="${translate("tradepage.tchange11")}"
								.renderer=${(root, column, data) => {
									const dateString = new Date(data.item.timestamp).toLocaleDateString()
									render(html`${dateString}`, root)
								}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="${translate("tradepage.tchange9")} (RVN)"
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
						</vaadin-grid>
						<div style="display:${this.isLoadingBoughtTradesRVN ? 'none' : ''}; padding: 10px;">
							${this.isEmptyArray(this.explorerBoughtRVNTrades) ? html`
								<span style="color: var(--black); font-size: 16px; text-align: center;">${translate("explorerpage.exp12")}</span>
							`: ''}
						</div>
					</div>
				</div>
			</div>
		`
	}

	boughtARRRTemplate() {
		return html`
			<div class="explorer-trades">
				<div class="box">
					<header>${translate("explorerpage.exp10")} (ARRR)</header>
					<div class="border-wrapper">
						<div class="loadingContainer" id="loadingExplorerTrades" style="display:${this.isLoadingBoughtTradesARRR ? 'block' : 'none'}">
							<div class="loading"></div>
							<span style="color: var(--black);">${translate("login.loading")}</span>
						</div>
						<vaadin-grid
							theme="compact column-borders row-stripes wrap-cell-content"
							id="explorerARRRTradesGrid" aria-label="Explorer Bought With ARRR"
							?hidden="${this.isEmptyArray(this.explorerBoughtARRRTrades)}"
							.items="${this.explorerBoughtARRRTrades}"
						>
							<vaadin-grid-column
								width="170px"
								flex-grow="0"
								header="${translate("tradepage.tchange11")}"
								.renderer=${(root, column, data) => {
									const dateString = new Date(data.item.timestamp).toLocaleDateString()
									render(html`${dateString}`, root)
								}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="${translate("tradepage.tchange9")} (ARRR)"
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
						</vaadin-grid>
						<div style="display:${this.isLoadingBoughtTradesARRR ? 'none' : ''}; padding: 10px;">
							${this.isEmptyArray(this.explorerBoughtARRRTrades) ? html`
								<span style="color: var(--black); font-size: 16px; text-align: center;">${translate("explorerpage.exp12")}</span>
							`: ''}
						</div>
					</div>
				</div>
			</div>
		`
	}

	soldBTCTemplate() {
		return html`
			<div class="explorer-trades">
				<div class="box">
					<header>${translate("explorerpage.exp11")} (BTC)</header>
					<div class="border-wrapper">
						<div class="loadingContainer" id="loadingExplorerTrades" style="display:${this.isLoadingSoldTradesBTC ? 'block' : 'none'}">
							<div class="loading"></div>
							<span style="color: var(--black);">${translate("login.loading")}</span>
						</div>
						<vaadin-grid
							theme="compact column-borders row-stripes wrap-cell-content"
							id="explorerBTCTradesGrid" aria-label="Explorer Sold With BTC"
							?hidden="${this.isEmptyArray(this.explorerSoldBTCTrades)}"
							.items="${this.explorerSoldBTCTrades}"
						>
							<vaadin-grid-column
								width="170px"
								flex-grow="0"
								header="${translate("tradepage.tchange11")}"
								.renderer=${(root, column, data) => {
									const dateString = new Date(data.item.timestamp).toLocaleDateString()
									render(html`${dateString}`, root)
								}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="${translate("tradepage.tchange9")} (BTC)"
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
						</vaadin-grid>
						<div style="display:${this.isLoadingSoldTradesBTC ? 'none' : ''}; padding: 10px;">
							${this.isEmptyArray(this.explorerSoldBTCTrades) ? html`
								<span style="color: var(--black); font-size: 16px; text-align: center;">${translate("explorerpage.exp13")}</span>
							`: ''}
						</div>
					</div>
				</div>
			</div>
		`
	}

	soldLTCTemplate() {
		return html`
			<div class="explorer-trades">
				<div class="box">
					<header>${translate("explorerpage.exp11")} (LTC)</header>
					<div class="border-wrapper">
						<div class="loadingContainer" id="loadingExplorerTrades" style="display:${this.isLoadingSoldTradesLTC ? 'block' : 'none'}">
							<div class="loading"></div>
							<span style="color: var(--black);">${translate("login.loading")}</span>
						</div>
						<vaadin-grid
							theme="compact column-borders row-stripes wrap-cell-content"
							id="explorerLTCTradesGrid" aria-label="Explorer Sold With LTC"
							?hidden="${this.isEmptyArray(this.explorerSoldLTCTrades)}"
							.items="${this.explorerSoldLTCTrades}"
						>
							<vaadin-grid-column
								width="170px"
								flex-grow="0"
								header="${translate("tradepage.tchange11")}"
								.renderer=${(root, column, data) => {
									const dateString = new Date(data.item.timestamp).toLocaleDateString()
									render(html`${dateString}`, root)
								}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="${translate("tradepage.tchange9")} (LTC)"
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
						</vaadin-grid>
						<div style="display:${this.isLoadingSoldTradesLTC ? 'none' : ''}; padding: 10px;">
							${this.isEmptyArray(this.explorerSoldLTCTrades) ? html`
								<span style="color: var(--black); font-size: 16px; text-align: center;">${translate("explorerpage.exp13")}</span>
							`: ''}
						</div>
					</div>
				</div>
			</div>
		`
	}

	soldDOGETemplate() {
		return html`
			<div class="explorer-trades">
				<div class="box">
					<header>${translate("explorerpage.exp11")} (DOGE)</header>
					<div class="border-wrapper">
						<div class="loadingContainer" id="loadingExplorerTrades" style="display:${this.isLoadingSoldTradesDOGE ? 'block' : 'none'}">
							<div class="loading"></div>
							<span style="color: var(--black);">${translate("login.loading")}</span>
						</div>
						<vaadin-grid
							theme="compact column-borders row-stripes wrap-cell-content"
							id="explorerDOGETradesGrid" aria-label="Explorer Sold With DOGE"
							?hidden="${this.isEmptyArray(this.explorerSoldDOGETrades)}"
							.items="${this.explorerSoldDOGETrades}"
						>
							<vaadin-grid-column
								width="170px"
								flex-grow="0"
								header="${translate("tradepage.tchange11")}"
								.renderer=${(root, column, data) => {
									const dateString = new Date(data.item.timestamp).toLocaleDateString()
									render(html`${dateString}`, root)
								}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="${translate("tradepage.tchange9")} (DOGE)"
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
						</vaadin-grid>
						<div style="display:${this.isLoadingSoldTradesDOGE ? 'none' : ''}; padding: 10px;">
							${this.isEmptyArray(this.explorerSoldDOGETrades) ? html`
								<span style="color: var(--black); font-size: 16px; text-align: center;">${translate("explorerpage.exp13")}</span>
							`: ''}
						</div>
					</div>
				</div>
			</div>
		`
	}

	soldDGBTemplate() {
		return html`
			<div class="explorer-trades">
				<div class="box">
					<header>${translate("explorerpage.exp11")} (DGB)</header>
					<div class="border-wrapper">
						<div class="loadingContainer" id="loadingExplorerTrades" style="display:${this.isLoadingSoldTradesDGB ? 'block' : 'none'}">
							<div class="loading"></div>
							<span style="color: var(--black);">${translate("login.loading")}</span>
						</div>
						<vaadin-grid
							theme="compact column-borders row-stripes wrap-cell-content"
							id="explorerDGBTradesGrid" aria-label="Explorer Sold With DGB"
							?hidden="${this.isEmptyArray(this.explorerSoldDGBTrades)}"
							.items="${this.explorerSoldDGBTrades}"
						>
							<vaadin-grid-column
								width="170px"
								flex-grow="0"
								header="${translate("tradepage.tchange11")}"
								.renderer=${(root, column, data) => {
									const dateString = new Date(data.item.timestamp).toLocaleDateString()
									render(html`${dateString}`, root)
								}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="${translate("tradepage.tchange9")} (DGB)"
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
						</vaadin-grid>
						<div style="display:${this.isLoadingSoldTradesDGB ? 'none' : ''}; padding: 10px;">
							${this.isEmptyArray(this.explorerSoldDGBTrades) ? html`
								<span style="color: var(--black); font-size: 16px; text-align: center;">${translate("explorerpage.exp13")}</span>
							`: ''}
						</div>
					</div>
				</div>
			</div>
		`
	}

	soldRVNTemplate() {
		return html`
			<div class="explorer-trades">
				<div class="box">
					<header>${translate("explorerpage.exp11")} (RVN)</header>
					<div class="border-wrapper">
						<div class="loadingContainer" id="loadingExplorerTrades" style="display:${this.isLoadingSoldTradesRVN ? 'block' : 'none'}">
							<div class="loading"></div>
							<span style="color: var(--black);">${translate("login.loading")}</span>
						</div>
						<vaadin-grid
							theme="compact column-borders row-stripes wrap-cell-content"
							id="explorerRVNTradesGrid" aria-label="Explorer Sold With RVN"
							?hidden="${this.isEmptyArray(this.explorerSoldRVNTrades)}"
							.items="${this.explorerSoldRVNTrades}"
						>
							<vaadin-grid-column
								width="170px"
								flex-grow="0"
								header="${translate("tradepage.tchange11")}"
								.renderer=${(root, column, data) => {
									const dateString = new Date(data.item.timestamp).toLocaleDateString()
									render(html`${dateString}`, root)
								}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="${translate("tradepage.tchange9")} (RVN)"
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
						</vaadin-grid>
						<div style="display:${this.isLoadingSoldTradesRVN ? 'none' : ''}; padding: 10px;">
							${this.isEmptyArray(this.explorerSoldRVNTrades) ? html`
								<span style="color: var(--black); font-size: 16px; text-align: center;">${translate("explorerpage.exp13")}</span>
							`: ''}
						</div>
					</div>
				</div>
			</div>
		`
	}

	soldARRRTemplate() {
		return html`
			<div class="explorer-trades">
				<div class="box">
					<header>${translate("explorerpage.exp11")} (ARRR)</header>
					<div class="border-wrapper">
						<div class="loadingContainer" id="loadingExplorerTrades" style="display:${this.isLoadingSoldTradesARRR ? 'block' : 'none'}">
							<div class="loading"></div>
							<span style="color: var(--black);">${translate("login.loading")}</span>
						</div>
						<vaadin-grid
							theme="compact column-borders row-stripes wrap-cell-content"
							id="explorerARRRTradesGrid"
							aria-label="Explorer Sold With ARRR"
							?hidden="${this.isEmptyArray(this.explorerSoldARRRTrades)}"
							.items="${this.explorerSoldARRRTrades}"
						>
							<vaadin-grid-column
								width="170px"
								flex-grow="0"
								header="${translate("tradepage.tchange11")}"
								.renderer=${(root, column, data) => {
									const dateString = new Date(data.item.timestamp).toLocaleDateString()
									render(html`${dateString}`, root)
								}}
							>
							</vaadin-grid-column>
							<vaadin-grid-column
								auto-width
								resizable
								header="${translate("tradepage.tchange9")} (ARRR)"
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
						</vaadin-grid>
						<div style="display:${this.isLoadingSoldTradesARRR ? 'none' : ''}; padding: 10px;">
							${this.isEmptyArray(this.explorerSoldARRRTrades) ? html`
								<span style="color: var(--black); font-size: 16px; text-align: center;">${translate("explorerpage.exp13")}</span>
							`: ''}
						</div>
					</div>
				</div>
			</div>
		`
	}

	openTraderInfo(traderData) {
		if (traderData.startsWith('Q') && traderData.length == 34) {
			this.getAddressUserResult(traderData)
		} else {
			this.getNameUserResult(traderData)
		}
	}

	async getAddressUserResult(resultAddress) {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const addressUrl = `${nodeUrl}/addresses/${resultAddress}`

		await fetch(addressUrl).then(res => {
			if (res.status === 400) {
				this.shadowRoot.getElementById('userErrorDialog').open()
			} else {
				this.getAllWithAddress(resultAddress)
			}
		})
	}

	async getNameUserResult(resultName) {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const nameUrl = `${nodeUrl}/names/${resultName}`

		await fetch(nameUrl).then(res => {
			if (res.status === 404) {
				this.shadowRoot.getElementById('userErrorDialog').open()
			} else {
				this.getAddressFromName(resultName)
			}
		})
	}

	async getAddressFromName(fromName) {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const fromNameUrl = `${nodeUrl}/names/${fromName}`

		this.nameAddressResult = await fetch(fromNameUrl).then(response => {
			return response.json()
		})

		const nameAddress = this.nameAddressResult.owner

		await this.getAllWithAddress(nameAddress)
	}

	async getAllWithAddress(myAddress) {
		await this.getAddressUserInfo(myAddress)
		await this.getAddressUserAvatar(myAddress)
		await this.getAddressUserBalance(myAddress)
		this.displayAddress = this.addressResult.address
		this.displayLevel = this.addressResult.level
		this.isLoadingCompleteInfo = true
		this.shadowRoot.getElementById('userFullInfoDialog').open()
		await this.getStartMint(myAddress)
		await this.getPaymentsGridItems()
		this.isLoadingCompleteInfo = false
	}

	async getAddressUserInfo(infoAddress) {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const infoAddressUrl = `${nodeUrl}/addresses/${infoAddress}`

		this.addressResult = await fetch(infoAddressUrl).then(response => {
			return response.json()
		})
	}

	async getAddressUserAvatar(avatarAddress) {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const nameUrl = `${nodeUrl}/names/address/${avatarAddress}?limit=0&reverse=true`

		await fetch(nameUrl).then(res => {
			return res.json()
		}).then(jsonRes => {
			if (jsonRes.length) {
				jsonRes.map(item => {
					this.infoAccountName = item.name
					this.imageName = item.name
				})
			} else {
				this.infoAccountName = get("chatpage.cchange15")
				this.imageName = avatarAddress
			}
		})

		this.imageUrl = `${nodeUrl}/arbitrary/THUMBNAIL/${this.imageName}/qortal_avatar?async=true}`
	}

	async getAddressUserBalance(balanceAddress) {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const balanceAddressUrl = `${nodeUrl}/addresses/balance/${balanceAddress}`

		const qortalBalanceInfo = await fetch(balanceAddressUrl).then(res => {
			return res.json()
		})

		this.displayBalance = qortalBalanceInfo.toFixed(4)
	}

	async getStartMint(mintAddress) {
		this.startMintTime = ''
		this.startMinting = []
		const checkBlocks = this.addressResult.blocksMinted + this.addressResult.blocksMintedAdjustment
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port

		if (checkBlocks === 0) {
			this.startMintTime = get("explorerpage.exp16")
		} else {
			const rewardshareUrl = `${nodeUrl}/transactions/search?txType=REWARD_SHARE&address=${mintAddress}&confirmationStatus=CONFIRMED&limit=1&reverse=false`

			this.startMinting = await fetch(rewardshareUrl).then(response => {
				return response.json()
			})

			this.startMintTime = new Date(this.startMinting[0].timestamp).toLocaleDateString()
		}
	}

	avatarImage() {
		return html`<img class="round" src="${this.imageUrl}" onerror="this.src='/img/incognito.png';" />`
	}

	avatarFullImage() {
		return html`<img class="round-fullinfo" src="${this.imageUrl}" onerror="this.src='/img/incognito.png';" />`
	}

	founderBadge() {
		if (this.addressResult.flags === 1) {
			return html`<span class="founder">${translate("explorerpage.exp6")}</span>`
		} else {
			return html``
		}
	}

	founderStatus() {
		if (this.addressResult.flags === 1) {
			return html`<span style="color: green;">${translate("general.yes")}</span>`
		} else {
			return html`<span style="color: red;">${translate("general.no")}</span>`
		}
	}

	async getPaymentsGridItems() {
		this.allPayments = []
		this.slicedArray = []
		this.allReceivedPayments = []
		this.allSendPayments = []
		this.totalSent = 0
		this.totalReceived = 0

		const paymentsAddress = this.displayAddress
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const paymentsUrl = `${nodeUrl}/transactions/address/${paymentsAddress}?limit=0&reverse=true`

		const paymentsAll = await fetch(paymentsUrl).then(response => {
			return response.json()
		})

		this.allPayments = paymentsAll.map(item => {
			const searchType = item.type
			if (searchType == "PAYMENT") {
				return {
					timestamp: item.timestamp,
					creatorAddress: item.creatorAddress,
					recipient: item.recipient,
					amount: item.amount,
					fee: item.fee,
					blockHeight: item.blockHeight
				}
			}
		}).filter(item => !!item)

		this.slicedArray = this.allPayments.slice(0, 5)

		this.allSendPayments = this.allPayments.map(item => {
			const searchSendAddress = item.creatorAddress
			if (searchSendAddress == paymentsAddress) {
				return {
					timestamp: item.timestamp,
					creatorAddress: item.creatorAddress,
					recipient: item.recipient,
					amount: item.amount

				}
			}
		}).filter(item => !!item)

		this.allSendPayments.map(item => {
			this.totalSent += parseFloat(item.amount)
		})

		this.allReceivedPayments = this.allPayments.map(item => {
			const searchReceivedAddress = item.recipient
			if (searchReceivedAddress == paymentsAddress) {
				return {
					timestamp: item.timestamp,
					creatorAddress: item.creatorAddress,
					recipient: item.recipient,
					amount: item.amount

				}
			}
		}).filter(item => !!item)

		this.allReceivedPayments.map(item => {
			this.totalReceived += parseFloat(item.amount)
		})
	}

	showPaymentDetails(paymentsData) {
		this.txtimestamp = ''
		this.txcreatorAddress = ''
		this.txrecipient = ''
		this.txamount = ''
		this.txfee = ''
		this.txblockHeight = ''
		this.txtimestamp = paymentsData.item.timestamp
		this.txcreatorAddress = paymentsData.item.creatorAddress
		this.txrecipient = paymentsData.item.recipient
		this.txamount = paymentsData.item.amount
		this.txfee = paymentsData.item.fee
		this.txblockHeight = paymentsData.item.blockHeight
		this.shadowRoot.getElementById('showTxDetailsDialog').open()
	}

	showAllPayments() {
		this.shadowRoot.getElementById('showAllPaymentsDialog').open()
	}

	async getBoughtBTCGridItems() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const tradesBoughtBTCUrl = `${nodeUrl}/crosschain/trades?foreignBlockchain=BITCOIN&minimumTimestamp=1597310000000&limit=0&reverse=true`
		const myBTCAddress = this.displayAddress

		const boughtBTCTradesAll = await fetch(tradesBoughtBTCUrl).then(response => {
			return response.json()
		})

		this.explorerBoughtBTCTrades = boughtBTCTradesAll.map(item => {
			const searchAddress = item.buyerReceivingAddress
			if (searchAddress == myBTCAddress) {
				return {
					timestamp: item.tradeTimestamp,
					foreignAmount: item.foreignAmount,
					qortAmount: item.qortAmount
				}
			}
		}).filter(item => !!item)
	}

	async getBoughtLTCGridItems() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const tradesBoughtLTCUrl = `${nodeUrl}/crosschain/trades?foreignBlockchain=LITECOIN&minimumTimestamp=1597310000000&limit=0&reverse=true`
		const myLTCAddress = this.displayAddress

		const boughtLTCTradesAll = await fetch(tradesBoughtLTCUrl).then(response => {
			return response.json()
		})

		this.explorerBoughtLTCTrades = boughtLTCTradesAll.map(item => {
			const searchAddress = item.buyerReceivingAddress
			if (searchAddress == myLTCAddress) {
				return {
					timestamp: item.tradeTimestamp,
					foreignAmount: item.foreignAmount,
					qortAmount: item.qortAmount
				}
			}
		}).filter(item => !!item)
	}

	async getBoughtDOGEGridItems() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const tradesBoughtDOGEUrl = `${nodeUrl}/crosschain/trades?foreignBlockchain=DOGECOIN&minimumTimestamp=1597310000000&limit=0&reverse=true`
		const myDOGEAddress = this.displayAddress

		const boughtDOGETradesAll = await fetch(tradesBoughtDOGEUrl).then(response => {
			return response.json()
		})

		this.explorerBoughtDOGETrades = boughtDOGETradesAll.map(item => {
			const searchAddress = item.buyerReceivingAddress
			if (searchAddress == myDOGEAddress) {
				return {
					timestamp: item.tradeTimestamp,
					foreignAmount: item.foreignAmount,
					qortAmount: item.qortAmount
				}
			}
		}).filter(item => !!item)
	}

	async getBoughtDGBGridItems() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const tradesBoughtDGBUrl = `${nodeUrl}/crosschain/trades?foreignBlockchain=DIGIBYTE&minimumTimestamp=1597310000000&limit=0&reverse=true`
		const myDGBAddress = this.displayAddress

		const boughtDGBTradesAll = await fetch(tradesBoughtDGBUrl).then(response => {
			return response.json()
		})

		this.explorerBoughtDGBTrades = boughtDGBTradesAll.map(item => {
			const searchAddress = item.buyerReceivingAddress
			if (searchAddress == myDGBAddress) {
				return {
					timestamp: item.tradeTimestamp,
					foreignAmount: item.foreignAmount,
					qortAmount: item.qortAmount
				}
			}
		}).filter(item => !!item)
	}

	async getBoughtRVNGridItems() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const tradesBoughtRVNUrl = `${nodeUrl}/crosschain/trades?foreignBlockchain=RAVENCOIN&minimumTimestamp=1597310000000&limit=0&reverse=true`
		const myRVNAddress = this.displayAddress

		const boughtRVNTradesAll = await fetch(tradesBoughtRVNUrl).then(response => {
			return response.json()
		})

		this.explorerBoughtRVNTrades = boughtRVNTradesAll.map(item => {
			const searchAddress = item.buyerReceivingAddress
			if (searchAddress == myRVNAddress) {
				return {
					timestamp: item.tradeTimestamp,
					foreignAmount: item.foreignAmount,
					qortAmount: item.qortAmount
				}
			}
		}).filter(item => !!item)
	}

	async getBoughtARRRGridItems() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const tradesBoughtARRRUrl = `${nodeUrl}/crosschain/trades?foreignBlockchain=PIRATECHAIN&minimumTimestamp=1597310000000&limit=0&reverse=true`
		const myARRRAddress = this.displayAddress

		const boughtARRRTradesAll = await fetch(tradesBoughtARRRUrl).then(response => {
			return response.json()
		})

		this.explorerBoughtARRRTrades = boughtARRRTradesAll.map(item => {
			const searchAddress = item.buyerReceivingAddress
			if (searchAddress == myARRRAddress) {
				return {
					timestamp: item.tradeTimestamp,
					foreignAmount: item.foreignAmount,
					qortAmount: item.qortAmount
				}
			}
		}).filter(item => !!item)
	}

	async getSoldBTCGridItems() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const tradesSoldBTCUrl = `${nodeUrl}/crosschain/trades?foreignBlockchain=BITCOIN&minimumTimestamp=1597310000000&limit=0&reverse=true`
		const myBTCAddress = this.displayAddress

		const soldBTCTradesAll = await fetch(tradesSoldBTCUrl).then(response => {
			return response.json()
		})

		this.explorerSoldBTCTrades = soldBTCTradesAll.map(item => {
			const searchAddress = item.sellerAddress
			if (searchAddress == myBTCAddress) {
				return {
					timestamp: item.tradeTimestamp,
					foreignAmount: item.foreignAmount,
					qortAmount: item.qortAmount
				}
			}
		}).filter(item => !!item)
	}

	async getSoldLTCGridItems() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const tradesSoldLTCUrl = `${nodeUrl}/crosschain/trades?foreignBlockchain=LITECOIN&minimumTimestamp=1597310000000&limit=0&reverse=true`
		const myLTCAddress = this.displayAddress

		const soldLTCTradesAll = await fetch(tradesSoldLTCUrl).then(response => {
			return response.json()
		})

		this.explorerSoldLTCTrades = soldLTCTradesAll.map(item => {
			const searchAddress = item.sellerAddress
			if (searchAddress == myLTCAddress) {
				return {
					timestamp: item.tradeTimestamp,
					foreignAmount: item.foreignAmount,
					qortAmount: item.qortAmount
				}
			}
		}).filter(item => !!item)
	}

	async getSoldDOGEGridItems() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const tradesSoldDOGEUrl = `${nodeUrl}/crosschain/trades?foreignBlockchain=DOGECOIN&minimumTimestamp=1597310000000&limit=0&reverse=true`
		const myDOGEAddress = this.displayAddress

		const soldDOGETradesAll = await fetch(tradesSoldDOGEUrl).then(response => {
			return response.json()
		})

		this.explorerSoldDOGETrades = soldDOGETradesAll.map(item => {
			const searchAddress = item.sellerAddress
			if (searchAddress == myDOGEAddress) {
				return {
					timestamp: item.tradeTimestamp,
					foreignAmount: item.foreignAmount,
					qortAmount: item.qortAmount
				}
			}
		}).filter(item => !!item)
	}

	async getSoldDGBGridItems() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const tradesSoldDGBUrl = `${nodeUrl}/crosschain/trades?foreignBlockchain=DIGIBYTE&minimumTimestamp=1597310000000&limit=0&reverse=true`
		const myDGBAddress = this.displayAddress

		const soldDGBTradesAll = await fetch(tradesSoldDGBUrl).then(response => {
			return response.json()
		})

		this.explorerSoldDGBTrades = soldDGBTradesAll.map(item => {
			const searchAddress = item.sellerAddress
			if (searchAddress == myDGBAddress) {
				return {
					timestamp: item.tradeTimestamp,
					foreignAmount: item.foreignAmount,
					qortAmount: item.qortAmount
				}
			}
		}).filter(item => !!item)
	}

	async getSoldRVNGridItems() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const tradesSoldRVNUrl = `${nodeUrl}/crosschain/trades?foreignBlockchain=RAVENCOIN&minimumTimestamp=1597310000000&limit=0&reverse=true`
		const myRVNAddress = this.displayAddress

		const soldRVNTradesAll = await fetch(tradesSoldRVNUrl).then(response => {
			return response.json()
		})

		this.explorerSoldRVNTrades = soldRVNTradesAll.map(item => {
			const searchAddress = item.sellerAddress
			if (searchAddress == myRVNAddress) {
				return {
					timestamp: item.tradeTimestamp,
					foreignAmount: item.foreignAmount,
					qortAmount: item.qortAmount
				}
			}
		}).filter(item => !!item)
	}

	async getSoldARRRGridItems() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const tradesSoldARRRUrl = `${nodeUrl}/crosschain/trades?foreignBlockchain=PIRATECHAIN&minimumTimestamp=1597310000000&limit=0&reverse=true`
		const myARRRAddress = this.displayAddress

		const soldARRRTradesAll = await fetch(tradesSoldARRRUrl).then(response => {
			return response.json()
		})

		this.explorerSoldARRRTrades = soldARRRTradesAll.map(item => {
			const searchAddress = item.sellerAddress
			if (searchAddress == myARRRAddress) {
				return {
					timestamp: item.tradeTimestamp,
					foreignAmount: item.foreignAmount,
					qortAmount: item.qortAmount
				}
			}
		}).filter(item => !!item)
	}

	openTrades() {
		this.shadowRoot.getElementById('userTrades').open()
		this.shadowRoot.getElementById('userFullInfoDialog').close()
	}

	async openUserBoughtDialog() {
		this.shadowRoot.getElementById('userBoughtDialog').open()
		this.explorerBoughtBTCTrades = []
		this.explorerBoughtLTCTrades = []
		this.explorerBoughtDOGETrades = []
		this.explorerBoughtDGBTrades = []
		this.explorerBoughtRVNTrades = []
		this.explorerBoughtARRRTrades = []
		this.isLoadingBoughtTradesBTC = true
		this.isLoadingBoughtTradesLTC = true
		this.isLoadingBoughtTradesDOGE = true
		this.isLoadingBoughtTradesDGB = true
		this.isLoadingBoughtTradesRVN = true
		this.isLoadingBoughtTradesARRR = true
		await this.getBoughtBTCGridItems()
		this.isLoadingBoughtTradesBTC = false
		await this.getBoughtLTCGridItems()
		this.isLoadingBoughtTradesLTC = false
		await this.getBoughtDOGEGridItems()
		this.isLoadingBoughtTradesDOGE = false
		await this.getBoughtDGBGridItems()
		this.isLoadingBoughtTradesDGB = false
		await this.getBoughtRVNGridItems()
		this.isLoadingBoughtTradesRVN = false
		await this.getBoughtARRRGridItems()
		this.isLoadingBoughtTradesARRR = false
	}

	async openUserSoldDialog() {
		this.shadowRoot.getElementById('userSoldDialog').open()
		this.explorerSoldBTCTrades = []
		this.explorerSoldLTCTrades = []
		this.explorerSoldDOGETrades = []
		this.explorerSoldDGBTrades = []
		this.explorerSoldRVNTrades = []
		this.explorerSoldARRRTrades = []
		this.isLoadingSoldTradesBTC = true
		this.isLoadingSoldTradesLTC = true
		this.isLoadingSoldTradesDOGE = true
		this.isLoadingSoldTradesDGB = true
		this.isLoadingSoldTradesRVN = true
		this.isLoadingSoldTradesARRR = true
		await this.getSoldBTCGridItems()
		this.isLoadingSoldTradesBTC = false
		await this.getSoldLTCGridItems()
		this.isLoadingSoldTradesLTC = false
		await this.getSoldDOGEGridItems()
		this.isLoadingSoldTradesDOGE = false
		await this.getSoldDGBGridItems()
		this.isLoadingSoldTradesDGB = false
		await this.getSoldRVNGridItems()
		this.isLoadingSoldTradesRVN = false
		await this.getSoldARRRGridItems()
		this.isLoadingSoldTradesARRR = false
	}

	closeErrorDialog() {
		this.shadowRoot.getElementById('userErrorDialog').close()
	}

	closeTrades() {
		this.shadowRoot.getElementById('userTrades').close()
	}

	closeCompleteInfoDialog() {
		this.shadowRoot.getElementById('userFullInfoDialog').close()
	}

	closeBoughtDialog() {
		this.shadowRoot.getElementById('userBoughtDialog').close()
	}

	closeSoldDialog() {
		this.shadowRoot.getElementById('userSoldDialog').close()
	}

	closeShowAllPaymentsDialog() {
		this.shadowRoot.getElementById('showAllPaymentsDialog').close()
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
}

window.customElements.define('trader-info-view', TraderInfoView)
