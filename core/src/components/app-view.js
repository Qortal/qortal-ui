import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../store'
import { Epml } from '../epml'
import { addTradeBotRoutes } from '../tradebot/addTradeBotRoutes'
import { get, translate } from '../../translate'
import { decryptData, encryptData } from '../lockScreen'
import { setChatLastSeen } from '../redux/app/app-actions'
import { appViewStyles } from '../styles/core-css'
import isElectron from 'is-electron'
import localForage from 'localforage'
import './app-info'
import './check-for-update'
import './new-selector'
import './search-modal'
import './show-plugin'
import './theme-toggle'
import './wallet-profile'
import './controllers/coin-balances-controller'
import './beginner-tour/tour-component'
import './beginner-tour/sync-indicator'
import './friends-view/beginner-checklist'
import './friends-view/core-sync-status'
import './friends-view/friends-side-panel-parent'
import './friends-view/profile'
import './friends-view/save-settings-qdn'
import './logout-view/logout-view'
import './notification-view/notification-bell'
import './notification-view/notification-bell-general'
import './settings-view/user-settings'
import './user-info-view/user-info-view'
import '../functional-components/side-menu'
import '../functional-components/side-menu-item'
import '@material/mwc-button'
import '@material/mwc-icon'
import '@polymer/app-layout/app-layout.js'
import '@polymer/iron-icons/iron-icons.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-progress/paper-progress.js'
import '@polymer/paper-ripple'
import '@vaadin/button'
import '@vaadin/icon'
import '@vaadin/icons'
import '@vaadin/password-field'
import '@vaadin/text-field'
import '@vaadin/tooltip'

const chatLastSeen = localForage.createInstance({
	name: 'chat-last-seen'
})

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class AppView extends connect(store)(LitElement) {
	static get properties() {
		return {
			config: { type: Object },
			urls: { type: Object },
			nodeType: { type: String, reflect: true },
			theme: { type: String, reflect: true },
			addressInfo: { type: Object },
			botQortWallet: { type: String },
			botBtcWallet: { type: String },
			botLtcWallet: { type: String },
			botDogeWallet: { type: String },
			botDgbWallet: { type: String },
			botRvnWallet: { type: String },
			botArrrWallet: { type: String },
			arrrWalletAddress: { type: String },
			qortWalletBalance: { type: Number },
			btcWalletBalance: { type: Number },
			ltcWalletBalance: { type: Number },
			dogeWalletBalance: { type: Number },
			dgbWalletBalance: { type: Number },
			rvnWalletBalance: { type: Number },
			arrrWalletBalance: { type: Number },
			failedTradesList: { type: Array },
			tradesOpenBtcQortal: { type: Array },
			myTradesOpenLtcQortal: { type: Array },
			tradesFailedBtcQortal: { type: Array },
			tradesOpenBtcQortalCleaned: { type: Array },
			tradesOpenLtcQortal: { type: Array },
			tradesFailedLtcQortal: { type: Array },
			tradesOpenLtcQortalCleaned: { type: Array },
			tradesOpenDogeQortal: { type: Array },
			tradesFailedDogeQortal: { type: Array },
			tradesOpenDogeQortalCleaned: { type: Array },
			tradesOpenDgbQortal: { type: Array },
			tradesFailedDgbQortal: { type: Array },
			tradesOpenDgbQortalCleaned: { type: Array },
			tradesOpenRvnQortal: { type: Array },
			tradesFailedRvnQortal: { type: Array },
			tradesOpenRvnQortalCleaned: { type: Array },
			tradesOpenArrrQortal: { type: Array },
			tradesFailedArrrQortal: { type: Array },
			tradesOpenArrrQortalCleaned: { type: Array },
			tradeBotBtcBook: { type: Array },
			tradeBotLtcBook: { type: Array },
			tradeBotDogeBook: { type: Array },
			tradeBotDgbBook: { type: Array },
			tradeBotRvnBook: { type: Array },
			tradeBotArrrBook: { type: Array },
			tradeBotBtcAt: { type: Array },
			tradeBotLtcAt: { type: Array },
			tradeBotDogeAt: { type: Array },
			tradeBotDgbAt: { type: Array },
			tradeBotRvnAt: { type: Array },
			tradeBotArrrAt: { type: Array },
			tradeBotAvailableBtcQortal: { type: Array },
			tradeBotAvailableLtcQortal: { type: Array },
			tradeBotAvailableDogeQortal: { type: Array },
			tradeBotAvailableDgbQortal: { type: Array },
			tradeBotAvailableRvnQortal: { type: Array },
			tradeBotAvailableArrrQortal: { type: Array },
			checkBtcAlice: { type: String },
			checkLtcAlice: { type: String },
			checkDogeAlice: { type: String },
			checkDgbAlice: { type: String },
			checkRvnAlice: { type: String },
			checkArrrAlice: { type: String },
			reAddBtcAmount: { type: Number },
			reAddLtcAmount: { type: Number },
			reAddDogeAmount: { type: Number },
			reAddDgbAmount: { type: Number },
			reAddRvnAmount: { type: Number },
			reAddArrrAmount: { type: Number },
			reAddBtcPrice: { type: Number },
			reAddLtcPrice: { type: Number },
			reAddDogePrice: { type: Number },
			reAddDgbPrice: { type: Number },
			reAddRvnPrice: { type: Number },
			reAddArrrPrice: { type: Number },
			botBtcBuyAtAddress: { type: String },
			botLtcBuyAtAddress: { type: String },
			botDogeBuyAtAddress: { type: String },
			botDgbBuyAtAddress: { type: String },
			botRvnBuyAtAddress: { type: String },
			botArrrBuyAtAddress: { type: String },
			salt: { type: String },
			storageData: { type: String },
			lockScreenPass: { type: String },
			lockScreenSet: { type: String },
			lockPass: { type: String },
			lockSet: { type: String },
			myLockScreenPass: { type: String },
			myLockScreenSet: { type: String },
			helperMessage: { type: String },
			showSyncMessages: { type: Boolean }
		}
	}

	static get styles() {
		return [appViewStyles]
	}

	constructor() {
		super()
		this.urls = []
		this.nodeType = ''
		this.addressInfo = {}
		this.botQortWallet = ''
		this.botBtcWallet = ''
		this.botLtcWallet = ''
		this.botDogeWallet = ''
		this.botDgbWallet = ''
		this.botRvnWallet = ''
		this.botArrrWallet = ''
		this.arrrWalletAddress = ''
		this.qortWalletBalance = 0
		this.btcWalletBalance = 0
		this.ltcWalletBalance = 0
		this.dogeWalletBalance = 0
		this.dgbWalletBalance = 0
		this.rvnWalletBalance = 0
		this.arrrWalletBalance = 0
		this.failedTradesList = []
		this.tradesOpenBtcQortal = []
		this.myTradesOpenLtcQortal = []
		this.tradesFailedBtcQortal = []
		this.tradesOpenBtcQortalCleaned = []
		this.tradesOpenLtcQortal = []
		this.tradesFailedLtcQortal = []
		this.tradesOpenLtcQortalCleaned = []
		this.tradesOpenDogeQortal = []
		this.tradesFailedDogeQortal = []
		this.tradesOpenDogeQortalCleaned = []
		this.tradesOpenDgbQortal = []
		this.tradesFailedDgbQortal = []
		this.tradesOpenDgbQortalCleaned = []
		this.tradesOpenRvnQortal = []
		this.tradesFailedRvnQortal = []
		this.tradesOpenRvnQortalCleaned = []
		this.tradesOpenArrrQortal = []
		this.tradesFailedArrrQortal = []
		this.tradesOpenArrrQortalCleaned = []
		this.tradeBotBtcBook = []
		this.tradeBotLtcBook = []
		this.tradeBotDogeBook = []
		this.tradeBotDgbBook = []
		this.tradeBotRvnBook = []
		this.tradeBotArrrBook = []
		this.tradeBotBtcAt = []
		this.tradeBotLtcAt = []
		this.tradeBotDogeAt = []
		this.tradeBotDgbAt = []
		this.tradeBotRvnAt = []
		this.tradeBotArrrAt = []
		this.tradeBotAvailableBtcQortal = []
		this.tradeBotAvailableLtcQortal = []
		this.tradeBotAvailableDogeQortal = []
		this.tradeBotAvailableDgbQortal = []
		this.tradeBotAvailableRvnQortal = []
		this.tradeBotAvailableArrrQortal = []
		this.checkBtcAlice = ''
		this.checkLtcAlice = ''
		this.checkDogeAlice = ''
		this.checkDgbAlice = ''
		this.checkRvnAlice = ''
		this.checkArrrAlice = ''
		this.reAddBtcAmount = 0
		this.reAddLtcAmount = 0
		this.reAddDogeAmount = 0
		this.reAddDgbAmount = 0
		this.reAddRvnAmount = 0
		this.reAddArrrAmount = 0
		this.reAddBtcPrice = 0
		this.reAddLtcPrice = 0
		this.reAddDogePrice = 0
		this.reAddDgbPrice = 0
		this.reAddRvnPrice = 0
		this.reAddArrrPrice = 0
		this.botBtcBuyAtAddress = ''
		this.botLtcBuyAtAddress = ''
		this.botDogeBuyAtAddress = ''
		this.botDgbBuyAtAddress = ''
		this.botRvnBuyAtAddress = ''
		this.botArrrBuyAtAddress = ''
		this.salt = ''
		this.storageData = ''
		this.lockScreenPass = ''
		this.lockScreenSet = ''
		this.lockPass = ''
		this.lockSet = ''
		this.myLockScreenPass = ''
		this.myLockScreenSet = ''
		this.helperMessage = ''
		this.getTourElements = this.getTourElements.bind(this)
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
	}

	render() {
		return html`
			<app-drawer-layout fullbleed force-narrow>
				<app-drawer swipe-open slot="drawer" id="appdrawer">
					<app-header-layout id="appsidebar">
						<div id="sideBar">
							<wallet-profile></wallet-profile>
							<div class="sideBarMenu">
								<div class="s-menu">
									<side-menu>
										${this.renderNodeTypeMenu()}
									</side-menu>
								</div>
							</div>
							<app-info></app-info>
						</div>
					</app-header-layout>
				</app-drawer>
				<app-header-layout style="height: var(--window-height);">
					<app-header id='appHeader' slot="header" fixed>
						<app-toolbar>
							<paper-icon-button id="mb" class="menu-toggle-button" drawer-toggle icon="menu"></paper-icon-button>
							<div main-title>
								<span class="qora-title">
								<img src="${this.config.coin.logo}" style="height:32px; padding-left:12px;">
								</span>
							</div>
							<div style="display:flex;align-items:center;gap:20px">
								<beginner-checklist></beginner-checklist>
								<profile-qdn></profile-qdn>
								<friends-side-panel-parent></friends-side-panel-parent>
								<notification-bell></notification-bell>
								<notification-bell-general></notification-bell-general>
								<save-settings-qdn></save-settings-qdn>
							</div>
							<div>&nbsp;</div>
							<new-selector></new-selector>
							<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
							<core-sync-status></core-sync-status>
							<div>&nbsp;&nbsp;&nbsp;</div>
							<theme-toggle></theme-toggle>
							<div>&nbsp;&nbsp;</div>
							${this.renderLockButton()}
							<div>&nbsp;&nbsp;</div>
							<search-modal></search-modal>
							<div>&nbsp;&nbsp;</div>
							<div style="display: inline;">
								<paper-icon-button icon="icons:settings" @click=${() => this.openSettings()} title="${translate("settings.settings")}"></paper-icon-button>
							</div>
							<div>&nbsp;&nbsp;</div>
							<check-for-update></check-for-update>
							<div>&nbsp;</div>
							<div style="display: inline;">
								<paper-icon-button icon="icons:exit-to-app" @click=${() => this.openLogout()} title="${translate("logout.logout")}"></paper-icon-button>
							</div>
							<div>&nbsp;&nbsp;</div>
						</app-toolbar>
					</app-header>
					<show-plugin></show-plugin>
					<tour-component .getElements=${this.getTourElements}></tour-component>
					${!this.showSyncMessages ? html`
						<sync-indicator></sync-indicator>
					` : html``}
				</app-header-layout>
			</app-drawer-layout>
			<user-info-view></user-info-view>
			<user-settings></user-settings>
			<logout-view></logout-view>
			<paper-dialog class="setpass-wrapper" id="setLockScreenPass" modal>
				<div style="text-align: center;">
					<h2 style="color: var(--black);">Qortal UI ${translate("login.lp1")}</h2>
					<hr>
				</div>
				<div style="text-align: center;">
					<h3 style="color: var(--black);">${translate("login.lp2")}</h3>
					<h4 style="color: var(--black);">${translate("login.lp3")}</h4>
				</div>
				<div style="display:flex;">
					<mwc-icon style="padding: 10px; padding-left: 0; padding-top: 42px; color: var(--black);">password</mwc-icon>
					<vaadin-password-field style="width: 100%;" label="${translate("login.password")}" id="lockPassword" autofocus></vaadin-password-field>
				</div>
				<div style="display:flex;">
					<mwc-icon style="padding: 10px; padding-left: 0; padding-top: 42px; color: var(--black);">password</mwc-icon>
					<vaadin-password-field style="width: 100%;" label="${translate("login.confirmpass")}" id="lockPasswordConfirm"></vaadin-password-field>
				</div>
				<div style="display: flex; justify-content: space-between;">
					<mwc-button class="red" @click="${() => this.closeSetScreenLockPass()}">${translate("login.lp4")}</mwc-button>
					<mwc-button @click="${() => this.checkPass()}">${translate("login.lp5")}</mwc-button>
				</div>
			</paper-dialog>
			<paper-dialog class="setpass-wrapper" id="extraConfirmPass" modal>
				<div style="text-align: center;">
					<h2 style="color: var(--black);">Qortal UI ${translate("login.lp1")}</h2>
					<hr>
				</div>
				<div style="text-align: center;">
					<h3 style="color: var(--black);">${translate("login.lessthen8")}</h3>
				</div>
				<div style="display: flex; justify-content: space-between;">
					<mwc-button class="red" @click="${() => this.closExtraConfirmPass()}">${translate("login.lp4")}</mwc-button>
					<mwc-button @click="${() => this.setNewScreenPass()}">${translate("login.lp5")}</mwc-button>
				</div>
			</paper-dialog>
			<paper-dialog class="lock-wrapper" id="lockScreenActive" modal>
				<div class="text-wrapper">
					<span class="lock-title-white">UI </span><br/>
					<span class="lock-title-white">${translate("login.lp9")} </span>
					<span class="lock-title-red">${translate("login.lp10")}</span>
				</div>
				<div style="display:flex; margin-top: 5px;">
					<mwc-icon style="padding: 10px; padding-left: 0; padding-top: 42px; color: var(--black);">password</mwc-icon>
					<vaadin-password-field style="width: 45%;" label="${translate("login.password")}" id="unlockPassword" @keydown="${this.passKeyListener}" autofocus>
					<div slot="helper">
						${this.helperMessage}
					</div>
					</vaadin-password-field>
				</div>
				<div style="display: flex; margin-top: 35px;">
					<mwc-button dense unelevated label="${translate("login.lp7")}" icon="lock_open" @click="${() => this.closeLockScreenActive()}"></mwc-button>
				</div>
			</paper-dialog>
			<coin-balances-controller></coin-balances-controller>
		`
	}

	async firstUpdated() {
		addTradeBotRoutes(parentEpml)

		parentEpml.imReady()

		this.clearTheCache()
		this.helperMessage = this.renderHelperPass()
		this.showSyncMessages = store.getState().app.showSyncIndicator
		this.salt = ''
		this.salt = Base58.encode(store.getState().app.wallet._addresses[0].keyPair.privateKey)
		this.storageData = ''
		this.storageData = store.getState().app.selectedAddress.address
		this.lockScreenPass = ''
		this.lockScreenPass = 'lockScreenPass-' + this.storageData
		this.lockScreenSet = ''
		this.lockScreenSet = 'lockScreenSet-' + this.storageData
		this.lockPass = ''
		this.lockPass = encryptData(false, this.salt)
		this.lockSet = ''
		this.lockSet = encryptData(false, this.salt)

		if (localStorage.getItem(this.lockScreenPass) === null && localStorage.getItem(this.lockScreenSet) === null) {
			localStorage.setItem(this.lockScreenPass, this.lockPass)
			localStorage.setItem(this.lockScreenSet, this.lockSet)

			this.myLockScreenPass = ''
			this.myLockScreenPass = decryptData(localStorage.getItem(this.lockScreenPass), this.salt)
			this.myLockScreenSet = ''
			this.myLockScreenSet = decryptData(localStorage.getItem(this.lockScreenSet), this.salt)
		} else {
			this.myLockScreenPass = ''
			this.myLockScreenPass = decryptData(localStorage.getItem(this.lockScreenPass), this.salt)
			this.myLockScreenSet = ''
			this.myLockScreenSet = decryptData(localStorage.getItem(this.lockScreenSet), this.salt)
		}

		if (this.myLockScreenSet === true) {
			this.shadowRoot.getElementById('lockScreenActive').open()
		}

		var drawerTog = this.shadowRoot.getElementById('mb')
		var drawerOut = this.shadowRoot.getElementById('appsidebar')

		drawerTog.addEventListener('mouseover', function () {
			drawerTog.click()
		})

		drawerOut.addEventListener('mouseleave', function () {
			drawerTog.click()
		})

		await this.getNodeType()

		const myAppNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		const nodeAppUrl = myAppNode.protocol + '://' + myAppNode.domain + ':' + myAppNode.port
		const appDelay = ms => new Promise(res => setTimeout(res, ms))

		await appDelay(3000)

		this.botQortWallet = store.getState().app.selectedAddress.address
		this.botBtcWallet = store.getState().app.selectedAddress.btcWallet.address
		this.botLtcWallet = store.getState().app.selectedAddress.ltcWallet.address
		this.botDogeWallet = store.getState().app.selectedAddress.dogeWallet.address
		this.botDgbWallet = store.getState().app.selectedAddress.dgbWallet.address
		this.botRvnWallet = store.getState().app.selectedAddress.rvnWallet.address
		this.botArrrWallet = store.getState().app.selectedAddress.arrrWallet.address

		await this.botBtcTradebook()
		await this.botLtcTradebook()
		await this.botDogeTradebook()
		await this.botDgbTradebook()
		await this.botRvnTradebook()
		await this.botArrrTradebook()

		window.addEventListener('storage', async () => {
			this.failedTradesList = JSON.parse(localStorage.getItem('failedTrades') || '[]')
			this.tradeBotBtcBook = JSON.parse(localStorage.getItem(this.botBtcWallet) || '[]')
			this.tradeBotLtcBook = JSON.parse(localStorage.getItem(this.botLtcWallet) || '[]')
			this.tradeBotDogeBook = JSON.parse(localStorage.getItem(this.botDogeWallet) || '[]')
			this.tradeBotDgbBook = JSON.parse(localStorage.getItem(this.botDgbWallet) || '[]')
			this.tradeBotRvnBook = JSON.parse(localStorage.getItem(this.botRvnWallet) || '[]')
			this.tradeBotArrrBook = JSON.parse(localStorage.getItem(this.botArrrWallet) || '[]')
		})

		if (localStorage.getItem('failedTrades') === null) {
			localStorage.setItem('failedTrades', '')

			var oldFailedTrades = JSON.parse(localStorage.getItem('failedTrades') || '[]')

			const addFixedFail = {
				timestamp: 1699792400000,
				recipient: 'QSMfgUCXahYHg38RidZ4FuWbVV8KGngDjP'
			}

			oldFailedTrades.push(addFixedFail)

			localStorage.setItem('failedTrades', JSON.stringify(oldFailedTrades))

			this.failedTradesList = JSON.parse(localStorage.getItem('failedTrades') || '[]')
		} else {
			this.failedTradesList = JSON.parse(localStorage.getItem('failedTrades') || '[]')
		}

		const unconfirmedTransactions = async () => {
			const unconfirmedTransactionslUrl = `${nodeAppUrl}/transactions/unconfirmed?txType=MESSAGE&limit=0&reverse=true`
			var addFailedTrades = JSON.parse(localStorage.getItem('failedTrades') || '[]')
			await fetch(unconfirmedTransactionslUrl).then(response => {
				return response.json()
			}).then(data => {
				data.map(item => {
					const unconfirmedNessageTimeDiff = Date.now() - item.timestamp
					const timeOneHour = 60 * 60 * 1000
					if (Number(unconfirmedNessageTimeDiff) > Number(timeOneHour)) {
						const addIt = {
							timestamp: item.timestamp,
							recipient: item.recipient
						}
						addFailedTrades.push(addIt)
					}
				})

				localStorage.setItem('failedTrades', JSON.stringify(addFailedTrades))

				this.failedTradesList = JSON.parse(localStorage.getItem('failedTrades') || '[]')
			})
		}

		await unconfirmedTransactions()

		const filterUnconfirmedTransactions = async () => {
			let cleanFailedTrades = this.failedTradesList.reduce((newArray, cut) => {
				if (!newArray.some(obj => obj.recipient === cut.recipient)) {
					newArray.push(cut)
				}

				return newArray
			}, [])

			localStorage.setItem('failedTrades', JSON.stringify(cleanFailedTrades))

			this.failedTradesList = JSON.parse(localStorage.getItem('failedTrades') || '[]')
		}

		await filterUnconfirmedTransactions()

		const getOpenTradesBTC = async () => {
			let timerBTC

			if (this.isEmptyArray(this.tradeBotBtcBook) === true) {
				clearTimeout(timerBTC)
				timerBTC = setTimeout(getOpenTradesBTC, 150000)
			} else {
				await this.updateBtcWalletBalance()
				const tradesOpenBtcQortalUrl = `${nodeAppUrl}/crosschain/tradeoffers?foreignBlockchain=BITCOIN&limit=0`

				const tradesOpenBtcQortal = await fetch(tradesOpenBtcQortalUrl).then(response => {
					return response.json()
				})

				this.tradesOpenBtcQortal = tradesOpenBtcQortal.map(item => {
					const expiryTime = item.creatorPresenceExpiry
					if (Number(expiryTime) > Date.now()) {
						const calcedPrice = parseFloat(item.expectedForeignAmount) / parseFloat(item.qortAmount)
						const roundedPrice = (Math.round(parseFloat(calcedPrice) * 1e8) / 1e8).toFixed(8)
						return {
							qortAmount: item.qortAmount,
							price: roundedPrice,
							foreignAmount: item.expectedForeignAmount,
							qortalCreator: item.qortalCreator,
							qortalAtAddress: item.qortalAtAddress,
							qortalCreatorTradeAddress: item.qortalCreatorTradeAddress
						}
					}
				}).filter(item => !!item)

				const unconfirmedTransactionsBTC = async () => {
					const unconfirmedTransactionsUrlBTC = `${nodeAppUrl}/transactions/unconfirmed?txType=MESSAGE&limit=0&reverse=true`
					var addFailedTradesBTC = JSON.parse(localStorage.getItem('failedTrades') || '[]')

					await fetch(unconfirmedTransactionsUrlBTC).then(response => {
						return response.json()
					}).then(data => {
						data.map(item => {
							const unconfirmedNessageTimeDiffBTC = Date.now() - item.timestamp
							const timeOneHourBTC = 60 * 60 * 1000
							if (Number(unconfirmedNessageTimeDiffBTC) > Number(timeOneHourBTC)) {
								const addItBTC = {
									timestamp: item.timestamp,
									recipient: item.recipient
								}
								addFailedTradesBTC.push(addItBTC)
							}
						})

						localStorage.setItem('failedTrades', JSON.stringify(addFailedTradesBTC))
						this.failedTradesList = JSON.parse(localStorage.getItem('failedTrades') || '[]')
					})
				}

				await unconfirmedTransactionsBTC()

				const filterUnconfirmedTransactionsBTC = async () => {
					let cleanFailedTradesBTC = this.failedTradesList.reduce((newArray, cut) => {
						if (!newArray.some(obj => obj.recipient === cut.recipient)) {
							newArray.push(cut)
						}

						return newArray
					}, [])

					localStorage.setItem('failedTrades', JSON.stringify(cleanFailedTradesBTC))
					this.failedTradesList = JSON.parse(localStorage.getItem('failedTrades') || '[]')
				}

				await filterUnconfirmedTransactionsBTC()

				this.tradesOpenBtcQortalCleaned = this.tradesOpenBtcQortal

				const filterOpenOfferBTC = async () => {
					this.failedTradesList.forEach(item => {
						const recipientToRemove = item.recipient

						this.tradesOpenBtcQortalCleaned = this.tradesOpenBtcQortalCleaned.filter(obj => {
							return obj.qortalCreatorTradeAddress !== recipientToRemove
						})
					})
				}

				await filterOpenOfferBTC()
				await appDelay(1000)
				await filterMyBotPriceTradesBTC()

				setTimeout(getOpenTradesBTC, 150000)
			}
		}

		const filterMyBotPriceTradesBTC = async () => {
			const tradeBotBtcUrl = `${nodeAppUrl}/crosschain/tradebot?foreignBlockchain=BITCOIN&apiKey=${this.getApiKey()}`

			this.tradeBotBtcAt = await fetch(tradeBotBtcUrl).then(response => {
				return response.json()
			})

			await appDelay(1000)

			this.tradeBotAvailableBtcQortal = this.tradesOpenBtcQortalCleaned.map(item => {
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
						qortalAtAddress: item.qortalAtAddress,
						qortalCreatorTradeAddress: item.qortalCreatorTradeAddress
					}
				}
			}).filter(item => !!item)

			this.tradeBotAvailableBtcQortal.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))

			if (this.isEmptyArray(this.tradeBotAvailableBtcQortal) === true) {
				return
			} else {
				this.checkBtcAlice = this.tradeBotAvailableBtcQortal[0].qortalAtAddress
			}

			await appDelay(1000)

			if (this.tradeBotBtcAt.some(item => item.atAddress === this.checkBtcAlice)) {
				return
			}

			await appDelay(1000)

			if (this.isEmptyArray(this.tradeBotAvailableBtcQortal) === true) {

			} else {
				const botbtcprice = this.round(parseFloat(this.tradeBotBtcBook[0].botBtcPrice))
				const changebtcamount = parseFloat(this.tradeBotBtcBook[0].botBtcQortAmount)
				const reducebtcamount = parseFloat(this.tradeBotAvailableBtcQortal[0].qortAmount)
				const tradebtcataddress = this.tradeBotAvailableBtcQortal[0].qortalAtAddress
				const newbtcamount = this.round(parseFloat(changebtcamount - reducebtcamount))

				this.reAddBtcAmount = this.round(parseFloat(this.tradeBotBtcBook[0].botBtcQortAmount))
				this.reAddBtcPrice = this.round(parseFloat(this.tradeBotBtcBook[0].botBtcPrice))

				localStorage.removeItem(this.botBtcWallet)
				localStorage.setItem(this.botBtcWallet, '')

				var oldBtcTradebook = JSON.parse(localStorage.getItem(this.botBtcWallet) || '[]')

				const newBtcTradebookItem = {
					botBtcQortAmount: newbtcamount,
					botBtcPrice: botbtcprice
				}

				oldBtcTradebook.push(newBtcTradebookItem)

				localStorage.setItem(this.botBtcWallet, JSON.stringify(oldBtcTradebook))

				this.tradeBotBtcBook = JSON.parse(localStorage.getItem(this.botBtcWallet) || '[]')

				this.botBtcBuyAtAddress = tradebtcataddress

				await appDelay(1000)

				await this.buyBtcAction()

				if (this.isEmptyArray(this.tradeBotBtcBook) === true) {
					return
				} else {
					const botamount = parseFloat(this.tradeBotBtcBook[0].botBtcQortAmount)

					if (Number(botamount) === 0) {
						this.removeBotBTCTradebook()
					}
				}

				if (this.isEmptyArray(this.tradeBotBtcBook) === true) {

				} else {
					const checkBotBtcFunds = this.round(parseFloat(this.tradeBotBtcBook[0].botBtcQortAmount) * parseFloat(this.tradeBotBtcBook[0].botBtcPrice))
					const myBotBtcFunds = this.round(parseFloat(this.btcWalletBalance))

					if (Number(myBotBtcFunds) < Number(checkBotBtcFunds)) {
						this.removeBotBTCTradebook()
					}
				}
			}
		}

		const getOpenTradesLTC = async () => {
			let timerLTC

			if (this.isEmptyArray(this.tradeBotLtcBook) === true) {
				clearTimeout(timerLTC)
				timerLTC = setTimeout(getOpenTradesLTC, 150000)
			} else {
				await this.updateLtcWalletBalance()

				const getTradesOpenLtcQortal = async () => {
					const tradesOpenLtcQortalUrl = `${nodeAppUrl}/crosschain/tradeoffers?foreignBlockchain=LITECOIN&limit=0`

					await fetch(tradesOpenLtcQortalUrl).then(response => {
						return response.json()
					}).then(data => {
						this.myTradesOpenLtcQortal = data
					})
				}

				await getTradesOpenLtcQortal()

				const filterTradesOpenLtcQortal = async () => {
					this.tradesOpenLtcQortal = this.myTradesOpenLtcQortal.map(item => {
						const expiryTime = item.creatorPresenceExpiry
						if (Number(expiryTime) > Date.now()) {
							const calcedPrice = parseFloat(item.expectedForeignAmount) / parseFloat(item.qortAmount)
							const roundedPrice = (Math.round(parseFloat(calcedPrice) * 1e8) / 1e8).toFixed(8)
							return {
								qortAmount: item.qortAmount,
								price: roundedPrice,
								foreignAmount: item.expectedForeignAmount,
								qortalCreator: item.qortalCreator,
								qortalAtAddress: item.qortalAtAddress,
								qortalCreatorTradeAddress: item.qortalCreatorTradeAddress
							}
						}
					}).filter(item => !!item)
				}

				await filterTradesOpenLtcQortal()

				const unconfirmedTransactionsLTC = async () => {
					const unconfirmedTransactionsUrlLTC = `${nodeAppUrl}/transactions/unconfirmed?txType=MESSAGE&limit=0&reverse=true`
					var addFailedTradesLTC = JSON.parse(localStorage.getItem('failedTrades') || '[]')

					await fetch(unconfirmedTransactionsUrlLTC).then(response => {
						return response.json()
					}).then(data => {
						data.map(item => {
							const unconfirmedNessageTimeDiffLTC = Date.now() - item.timestamp
							const timeOneHourLTC = 60 * 60 * 1000
							if (Number(unconfirmedNessageTimeDiffLTC) > Number(timeOneHourLTC)) {
								const addItLTC = {
									timestamp: item.timestamp,
									recipient: item.recipient
								}
								addFailedTradesLTC.push(addItLTC)
							}
						})

						localStorage.setItem('failedTrades', JSON.stringify(addFailedTradesLTC))
						this.failedTradesList = JSON.parse(localStorage.getItem('failedTrades') || '[]')
					})
				}

				await unconfirmedTransactionsLTC()

				const filterUnconfirmedTransactionsLTC = async () => {
					let cleanFailedTradesLTC = this.failedTradesList.reduce((newArray, cut) => {
						if (!newArray.some(obj => obj.recipient === cut.recipient)) {
							newArray.push(cut)
						}

						return newArray
					}, [])

					localStorage.setItem('failedTrades', JSON.stringify(cleanFailedTradesLTC))
					this.failedTradesList = JSON.parse(localStorage.getItem('failedTrades') || '[]')
				}

				await filterUnconfirmedTransactionsLTC()

				this.tradesOpenLtcQortalCleaned = this.tradesOpenLtcQortal

				const filterOpenOfferLTC = async () => {
					this.failedTradesList.forEach(item => {
						const recipientToRemove = item.recipient
						this.tradesOpenLtcQortalCleaned = this.tradesOpenLtcQortalCleaned.filter(obj => {
							return obj.qortalCreatorTradeAddress !== recipientToRemove
						})
					})
				}

				await filterOpenOfferLTC()
				await appDelay(1000)
				await filterMyBotPriceTradesLTC()

				setTimeout(getOpenTradesLTC, 150000)
			}
		}

		const filterMyBotPriceTradesLTC = async () => {
			const tradeBotLtcUrl = `${nodeAppUrl}/crosschain/tradebot?foreignBlockchain=LITECOIN&apiKey=${this.getApiKey()}`

			this.tradeBotLtcAt = await fetch(tradeBotLtcUrl).then(response => {
				return response.json()
			})

			await appDelay(1000)

			this.tradeBotAvailableLtcQortal = this.tradesOpenLtcQortalCleaned.map(item => {
				const listprice = parseFloat(item.price)
				const listamount = parseFloat(item.qortAmount)
				const checkprice = parseFloat(this.tradeBotLtcBook[0].botLtcPrice)
				const checkamount = parseFloat(this.tradeBotLtcBook[0].botLtcQortAmount)

				if (Number(listprice) <= Number(checkprice) && Number(listamount) <= Number(checkamount)) {
					return {
						qortAmount: item.qortAmount,
						price: item.price,
						foreignAmount: item.foreignAmount,
						qortalCreator: item.qortalCreator,
						qortalAtAddress: item.qortalAtAddress,
						qortalCreatorTradeAddress: item.qortalCreatorTradeAddress
					}
				}
			}).filter(item => !!item)

			this.tradeBotAvailableLtcQortal.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))

			if (this.isEmptyArray(this.tradeBotAvailableLtcQortal) === true) {
				return
			} else {
				this.checkLtcAlice = this.tradeBotAvailableLtcQortal[0].qortalAtAddress
			}

			await appDelay(1000)

			if (this.tradeBotLtcAt.some(item => item.atAddress === this.checkLtcAlice)) {
				return
			}

			await appDelay(1000)

			if (this.isEmptyArray(this.tradeBotAvailableLtcQortal) === true) {

			} else {
				const botltcprice = this.round(parseFloat(this.tradeBotLtcBook[0].botLtcPrice))
				const changeltcamount = parseFloat(this.tradeBotLtcBook[0].botLtcQortAmount)
				const reduceltcamount = parseFloat(this.tradeBotAvailableLtcQortal[0].qortAmount)
				const tradeltcataddress = this.tradeBotAvailableLtcQortal[0].qortalAtAddress
				const newltcamount = this.round(parseFloat(changeltcamount - reduceltcamount))

				this.reAddLtcAmount = this.round(parseFloat(this.tradeBotLtcBook[0].botLtcQortAmount))
				this.reAddLtcPrice = this.round(parseFloat(this.tradeBotLtcBook[0].botLtcPrice))

				localStorage.removeItem(this.botLtcWallet)
				localStorage.setItem(this.botLtcWallet, '')

				var oldLtcTradebook = JSON.parse(localStorage.getItem(this.botLtcWallet) || '[]')

				const newLtcTradebookItem = {
					botLtcQortAmount: newltcamount,
					botLtcPrice: botltcprice
				}

				oldLtcTradebook.push(newLtcTradebookItem)

				localStorage.setItem(this.botLtcWallet, JSON.stringify(oldLtcTradebook))

				this.tradeBotLtcBook = JSON.parse(localStorage.getItem(this.botLtcWallet) || '[]')

				this.botLtcBuyAtAddress = tradeltcataddress

				await appDelay(1000)

				await this.buyLtcAction()

				if (this.isEmptyArray(this.tradeBotLtcBook) === true) {
					return
				} else {
					const botamount = parseFloat(this.tradeBotLtcBook[0].botLtcQortAmount)

					if (Number(botamount) === 0) {
						this.removeBotLTCTradebook()
					}
				}

				if (this.isEmptyArray(this.tradeBotLtcBook) === true) {

				} else {
					const checkBotLtcFunds = this.round(parseFloat(this.tradeBotLtcBook[0].botLtcQortAmount) * parseFloat(this.tradeBotLtcBook[0].botLtcPrice))
					const myBotLtcFunds = this.round(parseFloat(this.ltcWalletBalance))

					if (Number(myBotLtcFunds) < Number(checkBotLtcFunds)) {
						this.removeBotLTCTradebook()
					}
				}
			}
		}

		const getOpenTradesDOGE = async () => {
			let timerDOGE

			if (this.isEmptyArray(this.tradeBotDogeBook) === true) {
				clearTimeout(timerDOGE)
				timerDOGE = setTimeout(getOpenTradesDOGE, 150000)
			} else {
				await this.updateDogeWalletBalance()
				const tradesOpenDogeQortalUrl = `${nodeAppUrl}/crosschain/tradeoffers?foreignBlockchain=DOGECOIN&limit=0`

				const tradesOpenDogeQortal = await fetch(tradesOpenDogeQortalUrl).then(response => {
					return response.json()
				})

				this.tradesOpenDogeQortal = tradesOpenDogeQortal.map(item => {
					const expiryTime = item.creatorPresenceExpiry
					if (Number(expiryTime) > Date.now()) {
						const calcedPrice = parseFloat(item.expectedForeignAmount) / parseFloat(item.qortAmount)
						const roundedPrice = (Math.round(parseFloat(calcedPrice) * 1e8) / 1e8).toFixed(8)
						return {
							qortAmount: item.qortAmount,
							price: roundedPrice,
							foreignAmount: item.expectedForeignAmount,
							qortalCreator: item.qortalCreator,
							qortalAtAddress: item.qortalAtAddress,
							qortalCreatorTradeAddress: item.qortalCreatorTradeAddress
						}
					}
				}).filter(item => !!item)

				const unconfirmedTransactionsDOGE = async () => {
					const unconfirmedTransactionsUrlDOGE = `${nodeAppUrl}/transactions/unconfirmed?txType=MESSAGE&limit=0&reverse=true`
					var addFailedTradesDOGE = JSON.parse(localStorage.getItem('failedTrades') || '[]')

					await fetch(unconfirmedTransactionsUrlDOGE).then(response => {
						return response.json()
					}).then(data => {
						data.map(item => {
							const unconfirmedNessageTimeDiffDOGE = Date.now() - item.timestamp
							const timeOneHourDOGE = 60 * 60 * 1000
							if (Number(unconfirmedNessageTimeDiffDOGE) > Number(timeOneHourDOGE)) {
								const addItDOGE = {
									timestamp: item.timestamp,
									recipient: item.recipient
								}
								addFailedTradesDOGE.push(addItDOGE)
							}
						})

						localStorage.setItem('failedTrades', JSON.stringify(addFailedTradesDOGE))
						this.failedTradesList = JSON.parse(localStorage.getItem('failedTrades') || '[]')
					})
				}

				await unconfirmedTransactionsDOGE()

				const filterUnconfirmedTransactionsDOGE = async () => {
					let cleanFailedTradesDOGE = this.failedTradesList.reduce((newArray, cut) => {
						if (!newArray.some(obj => obj.recipient === cut.recipient)) {
							newArray.push(cut)
						}

						return newArray
					}, [])

					localStorage.setItem('failedTrades', JSON.stringify(cleanFailedTradesDOGE))
					this.failedTradesList = JSON.parse(localStorage.getItem('failedTrades') || '[]')
				}

				await filterUnconfirmedTransactionsDOGE()

				this.tradesOpenDogeQortalCleaned = this.tradesOpenDogeQortal

				const filterOpenOfferDOGE = async () => {
					this.failedTradesList.forEach(item => {
						const recipientToRemove = item.recipient
						this.tradesOpenDogeQortalCleaned = this.tradesOpenDogeQortalCleaned.filter(obj => {
							return obj.qortalCreatorTradeAddress !== recipientToRemove
						})
					})
				}

				await filterOpenOfferDOGE()
				await appDelay(1000)
				await filterMyBotPriceTradesDOGE()

				setTimeout(getOpenTradesDOGE, 150000)
			}
		}

		const filterMyBotPriceTradesDOGE = async () => {
			const tradeBotDogeUrl = `${nodeAppUrl}/crosschain/tradebot?foreignBlockchain=DOGECOIN&apiKey=${this.getApiKey()}`

			this.tradeBotDogeAt = await fetch(tradeBotDogeUrl).then(response => {
				return response.json()
			})

			await appDelay(1000)

			this.tradeBotAvailableDogeQortal = this.tradesOpenDogeQortalCleaned.map(item => {
				const listprice = parseFloat(item.price)
				const listamount = parseFloat(item.qortAmount)
				const checkprice = parseFloat(this.tradeBotDogeBook[0].botDogePrice)
				const checkamount = parseFloat(this.tradeBotDogeBook[0].botDogeQortAmount)

				if (Number(listprice) <= Number(checkprice) && Number(listamount) <= Number(checkamount)) {
					return {
						qortAmount: item.qortAmount,
						price: item.price,
						foreignAmount: item.foreignAmount,
						qortalCreator: item.qortalCreator,
						qortalAtAddress: item.qortalAtAddress,
						qortalCreatorTradeAddress: item.qortalCreatorTradeAddress
					}
				}
			}).filter(item => !!item)

			this.tradeBotAvailableDogeQortal.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))

			if (this.isEmptyArray(this.tradeBotAvailableDogeQortal) === true) {
				return
			} else {
				this.checkDogeAlice = this.tradeBotAvailableDogeQortal[0].qortalAtAddress
			}

			await appDelay(1000)

			if (this.tradeBotDogeAt.some(item => item.atAddress === this.checkDogeAlice)) {
				return
			}

			await appDelay(1000)

			if (this.isEmptyArray(this.tradeBotAvailableDogeQortal) === true) {

			} else {
				const botdogeprice = this.round(parseFloat(this.tradeBotDogeBook[0].botDogePrice))
				const changedogeamount = parseFloat(this.tradeBotDogeBook[0].botDogeQortAmount)
				const reducedogeamount = parseFloat(this.tradeBotAvailableDogeQortal[0].qortAmount)
				const tradedogeataddress = this.tradeBotAvailableDogeQortal[0].qortalAtAddress
				const newdogeamount = this.round(parseFloat(changedogeamount - reducedogeamount))

				this.reAddDogeAmount = this.round(parseFloat(this.tradeBotDogeBook[0].botDogeQortAmount))
				this.reAddDogePrice = this.round(parseFloat(this.tradeBotDogeBook[0].botDogePrice))

				localStorage.removeItem(this.botDogeWallet)
				localStorage.setItem(this.botDogeWallet, '')

				var oldDogeTradebook = JSON.parse(localStorage.getItem(this.botDogeWallet) || '[]')

				const newDogeTradebookItem = {
					botDogeQortAmount: newdogeamount,
					botDogePrice: botdogeprice
				}

				oldDogeTradebook.push(newDogeTradebookItem)

				localStorage.setItem(this.botDogeWallet, JSON.stringify(oldDogeTradebook))

				this.tradeBotDogeBook = JSON.parse(localStorage.getItem(this.botDogeWallet) || '[]')

				this.botDogeBuyAtAddress = tradedogeataddress

				await appDelay(1000)

				await this.buyDogeAction()

				if (this.isEmptyArray(this.tradeBotDogeBook) === true) {
					return
				} else {
					const botamount = parseFloat(this.tradeBotDogeBook[0].botDogeQortAmount)

					if (Number(botamount) === 0) {
						this.removeBotDOGETradebook()
					}
				}

				if (this.isEmptyArray(this.tradeBotDogeBook) === true) {

				} else {
					const checkBotDogeFunds = this.round(parseFloat(this.tradeBotDogeBook[0].botDogeQortAmount) * parseFloat(this.tradeBotDogeBook[0].botDogePrice))
					const myBotDogeFunds = this.round(parseFloat(this.dogeWalletBalance))

					if (Number(myBotDogeFunds) < Number(checkBotDogeFunds)) {
						this.removeBotDOGETradebook()
					}
				}
			}
		}

		const getOpenTradesDGB = async () => {
			let timerDGB

			if (this.isEmptyArray(this.tradeBotDgbBook) === true) {
				clearTimeout(timerDGB)
				timerDGB = setTimeout(getOpenTradesDGB, 150000)
			} else {
				await this.updateDgbWalletBalance()
				const tradesOpenDgbQortalUrl = `${nodeAppUrl}/crosschain/tradeoffers?foreignBlockchain=DIGIYBYTE&limit=0`

				const tradesOpenDgbQortal = await fetch(tradesOpenDgbQortalUrl).then(response => {
					return response.json()
				})

				this.tradesOpenDgbQortal = tradesOpenDgbQortal.map(item => {
					const expiryTime = item.creatorPresenceExpiry
					if (Number(expiryTime) > Date.now()) {
						const calcedPrice = parseFloat(item.expectedForeignAmount) / parseFloat(item.qortAmount)
						const roundedPrice = (Math.round(parseFloat(calcedPrice) * 1e8) / 1e8).toFixed(8)
						return {
							qortAmount: item.qortAmount,
							price: roundedPrice,
							foreignAmount: item.expectedForeignAmount,
							qortalCreator: item.qortalCreator,
							qortalAtAddress: item.qortalAtAddress,
							qortalCreatorTradeAddress: item.qortalCreatorTradeAddress
						}
					}
				}).filter(item => !!item)

				const unconfirmedTransactionsDGB = async () => {
					const unconfirmedTransactionsUrlDGB = `${nodeAppUrl}/transactions/unconfirmed?txType=MESSAGE&limit=0&reverse=true`
					var addFailedTradesDGB = JSON.parse(localStorage.getItem('failedTrades') || '[]')

					await fetch(unconfirmedTransactionsUrlDGB).then(response => {
						return response.json()
					}).then(data => {
						data.map(item => {
							const unconfirmedNessageTimeDiffDGB = Date.now() - item.timestamp
							const timeOneHourDGB = 60 * 60 * 1000
							if (Number(unconfirmedNessageTimeDiffDGB) > Number(timeOneHourDGB)) {
								const addItDGB = {
									timestamp: item.timestamp,
									recipient: item.recipient
								}
								addFailedTradesDGB.push(addItDGB)
							}
						})

						localStorage.setItem('failedTrades', JSON.stringify(addFailedTradesDGB))
						this.failedTradesList = JSON.parse(localStorage.getItem('failedTrades') || '[]')
					})
				}

				await unconfirmedTransactionsDGB()

				const filterUnconfirmedTransactionsDGB = async () => {
					let cleanFailedTradesDGB = this.failedTradesList.reduce((newArray, cut) => {
						if (!newArray.some(obj => obj.recipient === cut.recipient)) {
							newArray.push(cut)
						}

						return newArray
					}, [])

					localStorage.setItem('failedTrades', JSON.stringify(cleanFailedTradesDGB))
					this.failedTradesList = JSON.parse(localStorage.getItem('failedTrades') || '[]')
				}

				await filterUnconfirmedTransactionsDGB()

				this.tradesOpenDgbQortalCleaned = this.tradesOpenDgbQortal

				const filterOpenOfferDGB = async () => {
					this.failedTradesList.forEach(item => {
						const recipientToRemove = item.recipient
						this.tradesOpenDgbQortalCleaned = this.tradesOpenDgbQortalCleaned.filter(obj => {
							return obj.qortalCreatorTradeAddress !== recipientToRemove
						})
					})
				}

				await filterOpenOfferDGB()
				await appDelay(1000)
				await filterMyBotPriceTradesDGB()

				setTimeout(getOpenTradesDGB, 150000)
			}
		}

		const filterMyBotPriceTradesDGB = async () => {
			const tradeBotDgbUrl = `${nodeAppUrl}/crosschain/tradebot?foreignBlockchain=DIGIBYTE&apiKey=${this.getApiKey()}`

			this.tradeBotDgbAt = await fetch(tradeBotDgbUrl).then(response => {
				return response.json()
			})

			await appDelay(1000)

			this.tradeBotAvailableDgbQortal = this.tradesOpenDgbQortalCleaned.map(item => {
				const listprice = parseFloat(item.price)
				const listamount = parseFloat(item.qortAmount)
				const checkprice = parseFloat(this.tradeBotDgbBook[0].botDgbPrice)
				const checkamount = parseFloat(this.tradeBotDgbBook[0].botDgbQortAmount)

				if (Number(listprice) <= Number(checkprice) && Number(listamount) <= Number(checkamount)) {
					return {
						qortAmount: item.qortAmount,
						price: item.price,
						foreignAmount: item.foreignAmount,
						qortalCreator: item.qortalCreator,
						qortalAtAddress: item.qortalAtAddress,
						qortalCreatorTradeAddress: item.qortalCreatorTradeAddress
					}
				}
			}).filter(item => !!item)

			this.tradeBotAvailableDgbQortal.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))

			if (this.isEmptyArray(this.tradeBotAvailableDgbQortal) === true) {
				return
			} else {
				this.checkDgbAlice = this.tradeBotAvailableDgbQortal[0].qortalAtAddress
			}

			await appDelay(1000)

			if (this.tradeBotDgbAt.some(item => item.atAddress === this.checkDgbAlice)) {
				return
			}

			await appDelay(1000)

			if (this.isEmptyArray(this.tradeBotAvailableDgbQortal) === true) {

			} else {
				const botdgbprice = this.round(parseFloat(this.tradeBotDgbBook[0].botDgbPrice))
				const changedgbamount = parseFloat(this.tradeBotDgbBook[0].botDgbQortAmount)
				const reducedgbamount = parseFloat(this.tradeBotAvailableDgbQortal[0].qortAmount)
				const tradedgbataddress = this.tradeBotAvailableDgbQortal[0].qortalAtAddress
				const newdgbamount = this.round(parseFloat(changedgbamount - reducedgbamount))

				this.reAddDgbAmount = this.round(parseFloat(this.tradeBotDgbBook[0].botDgbQortAmount))
				this.reAddDgbPrice = this.round(parseFloat(this.tradeBotDgbBook[0].botDgbPrice))

				localStorage.removeItem(this.botDgbWallet)
				localStorage.setItem(this.botDgbWallet, '')

				var oldDgbTradebook = JSON.parse(localStorage.getItem(this.botDgbWallet) || '[]')

				const newDgbTradebookItem = {
					botDgbQortAmount: newdgbamount,
					botDgbPrice: botdgbprice
				}

				oldDgbTradebook.push(newDgbTradebookItem)

				localStorage.setItem(this.botDgbWallet, JSON.stringify(oldDgbTradebook))

				this.tradeBotDgbBook = JSON.parse(localStorage.getItem(this.botDgbWallet) || '[]')

				this.botDgbBuyAtAddress = tradedgbataddress

				await appDelay(1000)

				await this.buyDgbAction()

				if (this.isEmptyArray(this.tradeBotDgbBook) === true) {
					return
				} else {
					const botamount = parseFloat(this.tradeBotDgbBook[0].botDgbQortAmount)

					if (Number(botamount) === 0) {
						this.removeBotDGBTradebook()
					}
				}

				if (this.isEmptyArray(this.tradeBotDgbBook) === true) {

				} else {
					const checkBotDgbFunds = this.round(parseFloat(this.tradeBotDgbBook[0].botDgbQortAmount) * parseFloat(this.tradeBotDgbBook[0].botDgbPrice))
					const myBotDgbFunds = this.round(parseFloat(this.dgbWalletBalance))

					if (Number(myBotDgbFunds) < Number(checkBotDgbFunds)) {
						this.removeBotDGBTradebook()
					}
				}
			}
		}

		const getOpenTradesRVN = async () => {
			let timerRVN

			if (this.isEmptyArray(this.tradeBotRvnBook) === true) {
				clearTimeout(timerRVN)
				timerRVN = setTimeout(getOpenTradesRVN, 150000)
			} else {
				await this.updateRvnWalletBalance()
				const tradesOpenRvnQortalUrl = `${nodeAppUrl}/crosschain/tradeoffers?foreignBlockchain=RAVENCOIN&limit=0`

				const tradesOpenRvnQortal = await fetch(tradesOpenRvnQortalUrl).then(response => {
					return response.json()
				})

				this.tradesOpenRvnQortal = tradesOpenRvnQortal.map(item => {
					const expiryTime = item.creatorPresenceExpiry
					if (Number(expiryTime) > Date.now()) {
						const calcedPrice = parseFloat(item.expectedForeignAmount) / parseFloat(item.qortAmount)
						const roundedPrice = (Math.round(parseFloat(calcedPrice) * 1e8) / 1e8).toFixed(8)
						return {
							qortAmount: item.qortAmount,
							price: roundedPrice,
							foreignAmount: item.expectedForeignAmount,
							qortalCreator: item.qortalCreator,
							qortalAtAddress: item.qortalAtAddress,
							qortalCreatorTradeAddress: item.qortalCreatorTradeAddress
						}
					}
				}).filter(item => !!item)

				const unconfirmedTransactionsRVN = async () => {
					const unconfirmedTransactionsUrlRVN = `${nodeAppUrl}/transactions/unconfirmed?txType=MESSAGE&limit=0&reverse=true`
					var addFailedTradesRVN = JSON.parse(localStorage.getItem('failedTrades') || '[]')

					await fetch(unconfirmedTransactionsUrlRVN).then(response => {
						return response.json()
					}).then(data => {
						data.map(item => {
							const unconfirmedNessageTimeDiffRVN = Date.now() - item.timestamp
							const timeOneHourRVN = 60 * 60 * 1000
							if (Number(unconfirmedNessageTimeDiffRVN) > Number(timeOneHourRVN)) {
								const addItRVN = {
									timestamp: item.timestamp,
									recipient: item.recipient
								}
								addFailedTradesRVN.push(addItRVN)
							}
						})

						localStorage.setItem('failedTrades', JSON.stringify(addFailedTradesRVN))
						this.failedTradesList = JSON.parse(localStorage.getItem('failedTrades') || '[]')
					})
				}

				await unconfirmedTransactionsRVN()

				const filterUnconfirmedTransactionsRVN = async () => {
					let cleanFailedTradesRVN = this.failedTradesList.reduce((newArray, cut) => {
						if (!newArray.some(obj => obj.recipient === cut.recipient)) {
							newArray.push(cut)
						}

						return newArray
					}, [])

					localStorage.setItem('failedTrades', JSON.stringify(cleanFailedTradesRVN))
					this.failedTradesList = JSON.parse(localStorage.getItem('failedTrades') || '[]')
				}

				await filterUnconfirmedTransactionsRVN()

				this.tradesOpenRvnQortalCleaned = this.tradesOpenRvnQortal

				const filterOpenOfferRVN = async () => {
					this.failedTradesList.forEach(item => {
						const recipientToRemove = item.recipient
						this.tradesOpenRvnQortalCleaned = this.tradesOpenRvnQortalCleaned.filter(obj => {
							return obj.qortalCreatorTradeAddress !== recipientToRemove
						})
					})
				}

				await filterOpenOfferRVN()
				await appDelay(1000)
				await filterMyBotPriceTradesRVN()

				setTimeout(getOpenTradesRVN, 150000)
			}
		}

		const filterMyBotPriceTradesRVN = async () => {
			const tradeBotRvnUrl = `${nodeAppUrl}/crosschain/tradebot?foreignBlockchain=RAVENCOIN&apiKey=${this.getApiKey()}`

			this.tradeBotRvnAt = await fetch(tradeBotRvnUrl).then(response => {
				return response.json()
			})

			await appDelay(1000)

			this.tradeBotAvailableRvnQortal = this.tradesOpenRvnQortalCleaned.map(item => {
				const listprice = parseFloat(item.price)
				const listamount = parseFloat(item.qortAmount)
				const checkprice = parseFloat(this.tradeBotRvnBook[0].botRvnPrice)
				const checkamount = parseFloat(this.tradeBotRvnBook[0].botRvnQortAmount)
				if (Number(listprice) <= Number(checkprice) && Number(listamount) <= Number(checkamount)) {
					return {
						qortAmount: item.qortAmount,
						price: item.price,
						foreignAmount: item.foreignAmount,
						qortalCreator: item.qortalCreator,
						qortalAtAddress: item.qortalAtAddress,
						qortalCreatorTradeAddress: item.qortalCreatorTradeAddress
					}
				}
			}).filter(item => !!item)

			this.tradeBotAvailableRvnQortal.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))

			if (this.isEmptyArray(this.tradeBotAvailableRvnQortal) === true) {
				return
			} else {
				this.checkRvnAlice = this.tradeBotAvailableRvnQortal[0].qortalAtAddress
			}

			await appDelay(1000)

			if (this.tradeBotRvnAt.some(item => item.atAddress === this.checkRvnAlice)) {
				return
			}

			await appDelay(1000)

			if (this.isEmptyArray(this.tradeBotAvailableRvnQortal) === true) {

			} else {
				const botrvnprice = this.round(parseFloat(this.tradeBotRvnBook[0].botRvnPrice))
				const changervnamount = parseFloat(this.tradeBotRvnBook[0].botRvnQortAmount)
				const reducervnamount = parseFloat(this.tradeBotAvailableRvnQortal[0].qortAmount)
				const tradervnataddress = this.tradeBotAvailableRvnQortal[0].qortalAtAddress
				const newrvnamount = this.round(parseFloat(changervnamount - reducervnamount))

				this.reAddRvnAmount = this.round(parseFloat(this.tradeBotRvnBook[0].botRvnQortAmount))
				this.reAddRvnPrice = this.round(parseFloat(this.tradeBotRvnBook[0].botRvnPrice))

				localStorage.removeItem(this.botRvnWallet)
				localStorage.setItem(this.botRvnWallet, '')

				var oldRvnTradebook = JSON.parse(localStorage.getItem(this.botRvnWallet) || '[]')

				const newRvnTradebookItem = {
					botRvnQortAmount: newrvnamount,
					botRvnPrice: botrvnprice
				}

				oldRvnTradebook.push(newRvnTradebookItem)

				localStorage.setItem(this.botRvnWallet, JSON.stringify(oldRvnTradebook))

				this.tradeBotRvnBook = JSON.parse(localStorage.getItem(this.botRvnWallet) || '[]')

				this.botRvnBuyAtAddress = tradervnataddress

				await appDelay(1000)

				await this.buyRvnAction()

				if (this.isEmptyArray(this.tradeBotRvnBook) === true) {
					return
				} else {
					const botamount = parseFloat(this.tradeBotRvnBook[0].botRvnQortAmount)

					if (Number(botamount) === 0) {
						this.removeBotRVNTradebook()
					}
				}

				if (this.isEmptyArray(this.tradeBotRvnBook) === true) {

				} else {
					const checkBotRvnFunds = this.round(parseFloat(this.tradeBotRvnBook[0].botRvnQortAmount) * parseFloat(this.tradeBotRvnBook[0].botRvnPrice))
					const myBotRvnFunds = this.round(parseFloat(this.rvnWalletBalance))

					if (Number(myBotRvnFunds) < Number(checkBotRvnFunds)) {
						this.removeBotRVNTradebook()
					}
				}
			}
		}

		const getOpenTradesARRR = async () => {
			let timerARRR

			if (this.isEmptyArray(this.tradeBotArrrBook) === true) {
				clearTimeout(timerARRR)
				timerARRR = setTimeout(getOpenTradesARRR, 150000)
			} else {
				await this.updateArrrWalletBalance()
				const tradesOpenArrrQortalUrl = `${nodeAppUrl}/crosschain/tradeoffers?foreignBlockchain=PIRATECHAIN&limit=0`

				const tradesOpenArrrQortal = await fetch(tradesOpenArrrQortalUrl).then(response => {
					return response.json()
				})

				this.tradesOpenArrrQortal = tradesOpenArrrQortal.map(item => {
					const expiryTime = item.creatorPresenceExpiry
					if (Number(expiryTime) > Date.now()) {
						const calcedPrice = parseFloat(item.expectedForeignAmount) / parseFloat(item.qortAmount)
						const roundedPrice = (Math.round(parseFloat(calcedPrice) * 1e8) / 1e8).toFixed(8)
						return {
							qortAmount: item.qortAmount,
							price: roundedPrice,
							foreignAmount: item.expectedForeignAmount,
							qortalCreator: item.qortalCreator,
							qortalAtAddress: item.qortalAtAddress,
							qortalCreatorTradeAddress: item.qortalCreatorTradeAddress
						}
					}
				}).filter(item => !!item)

				const unconfirmedTransactionsARRR = async () => {
					const unconfirmedTransactionsUrlARRR = `${nodeAppUrl}/transactions/unconfirmed?txType=MESSAGE&limit=0&reverse=true`
					var addFailedTradesARRR = JSON.parse(localStorage.getItem('failedTrades') || '[]')

					await fetch(unconfirmedTransactionsUrlARRR).then(response => {
						return response.json()
					}).then(data => {
						data.map(item => {
							const unconfirmedNessageTimeDiffARRR = Date.now() - item.timestamp
							const timeOneHourARRR = 60 * 60 * 1000
							if (Number(unconfirmedNessageTimeDiffARRR) > Number(timeOneHourARRR)) {
								const addItARRR = {
									timestamp: item.timestamp,
									recipient: item.recipient
								}
								addFailedTradesARRR.push(addItARRR)
							}
						})

						localStorage.setItem('failedTrades', JSON.stringify(addFailedTradesARRR))
						this.failedTradesList = JSON.parse(localStorage.getItem('failedTrades') || '[]')
					})
				}

				await unconfirmedTransactionsARRR()

				const filterUnconfirmedTransactionsARRR = async () => {
					let cleanFailedTradesARRR = this.failedTradesList.reduce((newArray, cut) => {
						if (!newArray.some(obj => obj.recipient === cut.recipient)) {
							newArray.push(cut)
						}

						return newArray
					}, [])

					localStorage.setItem('failedTrades', JSON.stringify(cleanFailedTradesARRR))
					this.failedTradesList = JSON.parse(localStorage.getItem('failedTrades') || '[]')
				}

				await filterUnconfirmedTransactionsARRR()

				this.tradesOpenArrrQortalCleaned = this.tradesOpenArrrQortal

				const filterOpenOfferARRR = async () => {
					this.failedTradesList.forEach(item => {
						const recipientToRemove = item.recipient
						this.tradesOpenArrrQortalCleaned = this.tradesOpenArrrQortalCleaned.filter(obj => {
							return obj.qortalCreatorTradeAddress !== recipientToRemove
						})
					})
				}

				await filterOpenOfferARRR()
				await appDelay(1000)
				await filterMyBotPriceTradesARRR()

				setTimeout(getOpenTradesARRR, 150000)
			}
		}

		const filterMyBotPriceTradesARRR = async () => {
			const tradeBotArrrUrl = `${nodeAppUrl}/crosschain/tradebot?foreignBlockchain=PIRATECHAIN&apiKey=${this.getApiKey()}`

			this.tradeBotArrrAt = await fetch(tradeBotArrrUrl).then(response => {
				return response.json()
			})

			await appDelay(1000)

			this.tradeBotAvailableArrrQortal = this.tradesOpenArrrQortalCleaned.map(item => {
				const listprice = parseFloat(item.price)
				const listamount = parseFloat(item.qortAmount)
				const checkprice = parseFloat(this.tradeBotArrrBook[0].botArrrPrice)
				const checkamount = parseFloat(this.tradeBotArrrBook[0].botArrrQortAmount)

				if (Number(listprice) <= Number(checkprice) && Number(listamount) <= Number(checkamount)) {
					return {
						qortAmount: item.qortAmount,
						price: item.price,
						foreignAmount: item.foreignAmount,
						qortalCreator: item.qortalCreator,
						qortalAtAddress: item.qortalAtAddress,
						qortalCreatorTradeAddress: item.qortalCreatorTradeAddress
					}
				}
			}).filter(item => !!item)

			this.tradeBotAvailableArrrQortal.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))

			if (this.isEmptyArray(this.tradeBotAvailableArrrQortal) === true) {
				return
			} else {
				this.checkArrrAlice = this.tradeBotAvailableArrrQortal[0].qortalAtAddress
			}

			await appDelay(1000)

			if (this.tradeBotArrrAt.some(item => item.atAddress === this.checkArrrAlice)) {
				return
			}

			await appDelay(1000)

			if (this.isEmptyArray(this.tradeBotAvailableArrrQortal) === true) {

			} else {
				const botarrrprice = this.round(parseFloat(this.tradeBotArrrBook[0].botArrrPrice))
				const changearrramount = parseFloat(this.tradeBotArrrBook[0].botArrrQortAmount)
				const reducearrramount = parseFloat(this.tradeBotAvailableArrrQortal[0].qortAmount)
				const tradearrrataddress = this.tradeBotAvailableArrrQortal[0].qortalAtAddress
				const newarrramount = this.round(parseFloat(changearrramount - reducearrramount))

				this.reAddArrrAmount = this.round(parseFloat(this.tradeBotArrrBook[0].botArrrQortAmount))
				this.reAddArrrPrice = this.round(parseFloat(this.tradeBotArrrBook[0].botArrrPrice))

				localStorage.removeItem(this.botArrrWallet)
				localStorage.setItem(this.botArrrWallet, '')

				var oldArrrTradebook = JSON.parse(localStorage.getItem(this.botArrrWallet) || '[]')

				const newArrrTradebookItem = {
					botArrrQortAmount: newarrramount,
					botArrrPrice: botarrrprice
				}

				oldArrrTradebook.push(newArrrTradebookItem)

				localStorage.setItem(this.botArrrWallet, JSON.stringify(oldArrrTradebook))

				this.tradeBotArrrBook = JSON.parse(localStorage.getItem(this.botArrrWallet) || '[]')

				this.botArrrBuyAtAddress = tradearrrataddress

				await appDelay(1000)

				await this.buyArrrAction()

				if (this.isEmptyArray(this.tradeBotArrrBook) === true) {
					return
				} else {
					const botamount = parseFloat(this.tradeBotArrrBook[0].botArrrQortAmount)

					if (Number(botamount) === 0) {
						this.removeBotARRRTradebook()
					}
				}

				if (this.isEmptyArray(this.tradeBotArrrBook) === true) {

				} else {
					const checkBotArrrFunds = this.round(parseFloat(this.tradeBotArrrBook[0].botArrrQortAmount) * parseFloat(this.tradeBotArrrBook[0].botArrrPrice))
					const myBotArrrFunds = this.round(parseFloat(this.arrrWalletBalance))

					if (Number(myBotArrrFunds) < Number(checkBotArrrFunds)) {
						this.removeBotARRRTradebook()
					}
				}
			}
		}

		const getChatLastSeen = async () => {
			let items = []

			await chatLastSeen.iterate(function (value, key, iterationNumber) {
				items.push({ key, timestamp: value })
			})

			store.dispatch(setChatLastSeen(items))
			return items
		}

		await getOpenTradesBTC()
		await appDelay(1000)
		await getOpenTradesLTC()
		await appDelay(1000)
		await getOpenTradesDOGE()
		await appDelay(1000)
		await getOpenTradesDGB()
		await appDelay(1000)
		await getOpenTradesRVN()
		await appDelay(1000)
		await getOpenTradesARRR()
		await getChatLastSeen()

		setInterval(() => {
			this.clearTheCache()
		}, 60000)
	}

	getTourElements() {
		let els = {}

		const el1 = this.shadowRoot.querySelector('core-sync-status').shadowRoot.getElementById('core-sync-status-id')
		const el2 = this.shadowRoot.querySelector('show-plugin').shadowRoot.getElementById('showPluginId')
		const el3 = this.shadowRoot.querySelector('beginner-checklist').shadowRoot.getElementById('popover-notification')

		if (el1) {
			els['core-sync-status-id'] = el1
		}

		if (el2) {
			els['tab'] = el2
		}

		if (el3) {
			els['checklist'] = el3
		}

		return els
	}

	clearTheCache() {
		if (!isElectron()) {
		} else {
			console.clear()

			window.parent.electronAPI.clearMyCache()
			window.parent.electronAPI.clearCache()
		}
	}

	async getNodeType() {
		const myAppNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		const nodeAppUrl = myAppNode.protocol + '://' + myAppNode.domain + ':' + myAppNode.port
		const url = `${nodeAppUrl}/admin/info`

		await fetch(url).then((response) => {
			return response.json()
		}).then((data) => {
			this.nodeType = data.type
		})
	}

	renderNodeTypeMenu() {
		const addressInfo = this.addressInfo
		const isMinter = addressInfo?.error !== 124 && +addressInfo?.level > 0
		const isSponsor = +addressInfo?.level >= 5

		if (this.nodeType === 'lite') {
			return html`
				<side-menu-item label="${translate('sidemenu.wallets')}" href="/app/wallet" selected>
					<vaadin-icon icon="vaadin:wallet" slot="icon"></vaadin-icon>
				</side-menu-item>
				<side-menu-item label="${translate('sidemenu.nameregistration')}" href="/app/name-registration">
					<vaadin-icon icon="vaadin:user-check" slot="icon"></vaadin-icon>
				</side-menu-item>
				<side-menu-item label="${translate('sidemenu.datamanagement')}" href="/app/data-management">
					<vaadin-icon icon="vaadin:database" slot="icon"></vaadin-icon>
				</side-menu-item>
				<side-menu-item label="${translate('sidemenu.qchat')}" href="/app/q-chat">
					<vaadin-icon icon="vaadin:chat" slot="icon"></vaadin-icon>
				</side-menu-item>
				${this.renderNodeManagement()}
			`
		} else {
			return html`
				<side-menu-item label="${translate('sidemenu.minting')}" expanded>
					<vaadin-icon icon="vaadin:info-circle" slot="icon"></vaadin-icon>
					<side-menu-item id="qminter" label="${translate('sidemenu.mintingdetails')}" href="/app/minting" ?hide=${!isMinter}>
						<vaadin-icon icon="vaadin:info-circle" slot="icon"></vaadin-icon>
					</side-menu-item>
					<side-menu-item id="qbminter" label="${translate('sidemenu.becomeAMinter')}" href="/app/become-minter" ?hide=${isMinter}>
						<vaadin-icon icon="vaadin:thumbs-up" slot="icon"></vaadin-icon>
					</side-menu-item>
					<side-menu-item id="qiminter" label="${translate('mintingpage.mchange35')}" href="/app/sponsorship-list" ?hide=${!isSponsor}>
						<vaadin-icon icon="vaadin:list-ol" slot="icon"></vaadin-icon>
					</side-menu-item>
				</side-menu-item>
				<side-menu-item id="qwallet" label="${translate('sidemenu.wallets')}" href="/app/wallet">
					<vaadin-icon icon="vaadin:wallet" slot="icon"></vaadin-icon>
				</side-menu-item>
				<side-menu-item label="${translate('sidemenu.trading')}" expanded>
					<vaadin-icon icon="vaadin:cash" slot="icon"></vaadin-icon>
					<side-menu-item id="qtrade" label="${translate('sidemenu.tradeportal')}" href="/app/trade-portal">
						<vaadin-icon icon="vaadin:bullets" slot="icon"></vaadin-icon>
					</side-menu-item>
					<side-menu-item id="qbot" label="${translate('tradepage.tchange46')}" href="/app/trade-bot-portal">
						<vaadin-icon icon="vaadin:calc-book" slot="icon"></vaadin-icon>
					</side-menu-item>
				</side-menu-item>
				<side-menu-item id="qrewardshare" label="${translate('sidemenu.rewardshare')}" href="/app/reward-share">
					<vaadin-icon icon="vaadin:share-square" slot="icon"></vaadin-icon>
				</side-menu-item>
				<side-menu-item id="qchat" label="${translate('sidemenu.qchat')}" href="/app/q-chat">
					<vaadin-icon icon="vaadin:chat" slot="icon"></vaadin-icon>
				</side-menu-item>
				<side-menu-item label="${translate('sidemenu.sm1')}" expanded>
					<vaadin-icon icon="vaadin:user-card" slot="icon"></vaadin-icon>
					<side-menu-item id="qnamereg" label="${translate('sidemenu.sm2')}" href="/app/name-registration">
						<vaadin-icon icon="vaadin:user-check" slot="icon"></vaadin-icon>
					</side-menu-item>
					<side-menu-item id="qnamemarket" label="${translate('sidemenu.sm3')}" href="/app/names-market">
						<vaadin-icon icon="vaadin:shop" slot="icon"></vaadin-icon>
					</side-menu-item>
				</side-menu-item>
				<side-menu-item label="QDN" expanded>
					<vaadin-icon icon="vaadin:cluster" slot="icon"></vaadin-icon>
					<side-menu-item id="qweb" label="${translate('sidemenu.websites')}" href="/app/websites">
						<vaadin-icon icon="vaadin:desktop" slot="icon" ></vaadin-icon>
					</side-menu-item>
					<side-menu-item id="qapp" label="Q-Apps" href="/app/qapps">
						<vaadin-icon icon="vaadin:external-browser" slot="icon" ></vaadin-icon>
					</side-menu-item>
				</side-menu-item>
				<side-menu-item id="qgroupmange" label="${translate('sidemenu.groups')}" href="/app/group-management">
					<vaadin-icon icon="vaadin:group" slot="icon"></vaadin-icon>
				</side-menu-item>
				<side-menu-item id="qpuzzles" label="${translate('sidemenu.puzzles')}" href="/app/puzzles">
					<vaadin-icon icon="vaadin:puzzle-piece" slot="icon"></vaadin-icon>
				</side-menu-item>
				<side-menu-item label="${translate('sidemenu.management')}" expanded>
					<vaadin-icon icon="vaadin:cogs" slot="icon"></vaadin-icon>
					<side-menu-item id="qdata" label="${translate('sidemenu.datamanagement')}" href="/app/data-management">
						<vaadin-icon icon="vaadin:database" slot="icon"></vaadin-icon>
					</side-menu-item>
					${this.renderNodeManagement()}
				</side-menu-item>
			`
		}
	}

	renderLockButton() {
		if (this.myLockScreenPass === false && this.myLockScreenSet === false) {
			return html`
				<div style="display: inline;">
					<paper-icon-button icon="icons:lock-open" @click=${() => this.openSetScreenLockPass()} title="${translate("login.lp11")}"></paper-icon-button>
				</div>
			`
		} else if (this.myLockScreenSet === false) {
			return html`
				<div style="display: inline;">
					<paper-icon-button icon="icons:lock-open" @click=${() => this.setLockQortal()} title="${translate("login.lp11")}"></paper-icon-button>
				</div>
			`
		} else if (this.myLockScreenSet === true) {
			return html`
				<div style="display: inline;">
					<paper-icon-button icon="icons:lock" title="${translate("login.lp10")}"></paper-icon-button>
				</div>
			`
		}
	}

	openSetScreenLockPass() {
		this.shadowRoot.getElementById('lockPassword').value = ''
		this.shadowRoot.getElementById('lockPasswordConfirm').value = ''
		this.shadowRoot.getElementById('setLockScreenPass').open()
	}

	closeSetScreenLockPass() {
		this.shadowRoot.getElementById('setLockScreenPass').close()
	}

	checkPass() {
		const password = this.shadowRoot.getElementById('lockPassword').value
		const rePassword = this.shadowRoot.getElementById('lockPasswordConfirm').value

		if (password === '') {
			let snackbar1string = get("login.pleaseenter")
			parentEpml.request('showSnackBar', `${snackbar1string}`)
			return
		}

		if (password != rePassword) {
			let snackbar2string = get("login.notmatch")
			parentEpml.request('showSnackBar', `${snackbar2string}`)
			return
		}

		if (password.length < 8) {
			let snackbar3string = get("login.lessthen8")
			parentEpml.request('showSnackBar', `${snackbar3string}`)
			this.lowPass = ''
			this.lowPass = password
			this.extraConfirm()
		}

		if (password.length >= 8) {
			this.setNewScreenPass()
			let snackbar4string = get("login.lp6")
			parentEpml.request('showSnackBar', `${snackbar4string}`)
		}
	}

	extraConfirm() {
		this.shadowRoot.getElementById('setLockScreenPass').close()
		this.shadowRoot.getElementById('extraConfirmPass').open()
	}

	closExtraConfirmPass() {
		this.shadowRoot.getElementById('extraConfirmPass').close()
		this.shadowRoot.getElementById('lockPassword').value = ''
		this.shadowRoot.getElementById('lockPasswordConfirm').value = ''
	}

	setNewScreenPass() {
		const rawPassword = this.shadowRoot.getElementById('lockPassword').value
		const cryptPassword = encryptData(rawPassword, this.salt)

		localStorage.setItem(this.lockScreenPass, cryptPassword)

		this.myLockScreenPass = ''
		this.myLockScreenPass = decryptData(localStorage.getItem(this.lockScreenPass), this.salt)
		this.shadowRoot.getElementById('setLockScreenPass').close()
		this.shadowRoot.getElementById('extraConfirmPass').close()
		this.shadowRoot.getElementById('lockPassword').value = ''
		this.shadowRoot.getElementById('lockPasswordConfirm').value = ''
	}

	setLockQortal() {
		this.helperMessage = this.renderHelperPass()
		this.lockSet = ''
		this.lockSet = encryptData(true, this.salt)

		localStorage.setItem(this.lockScreenSet, this.lockSet)

		this.myLockScreenSet = ''
		this.myLockScreenSet = decryptData(localStorage.getItem(this.lockScreenSet), this.salt)
		this.shadowRoot.getElementById('lockScreenActive').open()
	}

	passKeyListener(e) {
		if (e.key === 'Enter') {
			this.closeLockScreenActive()
		}
	}

	async closeLockScreenActive() {
		const myPass = decryptData(localStorage.getItem(this.lockScreenPass), this.salt)
		const checkPass = this.shadowRoot.getElementById('unlockPassword').value
		const errDelay = ms => new Promise(res => setTimeout(res, ms))

		if (checkPass === myPass) {
			this.lockSet = ''
			this.lockSet = encryptData(false, this.salt)

			localStorage.setItem(this.lockScreenSet, this.lockSet)

			this.myLockScreenSet = ''
			this.myLockScreenSet = decryptData(localStorage.getItem(this.lockScreenSet), this.salt)
			this.shadowRoot.getElementById('lockScreenActive').close()
			this.shadowRoot.getElementById('unlockPassword').value = ''
			this.helperMessage = this.renderHelperPass()
		} else {
			this.shadowRoot.getElementById('unlockPassword').value = ''
			this.helperMessage = this.renderHelperErr()

			await errDelay(3000)

			this.helperMessage = this.renderHelperPass()
		}
	}

	renderHelperPass() {
		return html`<span style="color: #fff; font-size: 13px; font-weight: bold; float: left;">${translate("login.pleaseenter")}</span>`
	}

	renderHelperErr() {
		return html`<span style="color: var(--mdc-theme-error); font-size: 13px; font-weight: bold; float: right;">${translate("login.lp8")}</span>`
	}

	renderNodeManagement() {
		const checkNodeManagement = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]

		if ((checkNodeManagement.enableManagement = true)) {
			return html`
				<side-menu-item id="qnode" label="${translate('sidemenu.nodemanagement')}" href="/app/node-management">
					<vaadin-icon icon="vaadin:cloud" slot="icon"></vaadin-icon>
				</side-menu-item>
			`
		} else {
			return html``
		}
	}

	async updateQortWalletBalance() {
		let qortAddress = store.getState().app.selectedAddress.address

		await parentEpml.request('apiCall', {
			url: `/addresses/balance/${qortAddress}?apiKey=${this.getApiKey()}`,
		}).then((res) => {
			this.qortWalletBalance = res
		})
	}

	async updateBtcWalletBalance() {
		let _url = `/crosschain/btc/walletbalance?apiKey=${this.getApiKey()}`
		let _body = store.getState().app.selectedAddress.btcWallet.derivedMasterPublicKey

		await parentEpml.request('apiCall', {
			url: _url,
			method: 'POST',
			body: _body,
		}).then((res) => {
			if (isNaN(Number(res))) {
				//...
			} else {
				this.btcWalletBalance = (Number(res) / 1e8).toFixed(8)
			}
		})
	}

	async updateLtcWalletBalance() {
		let _url = `/crosschain/ltc/walletbalance?apiKey=${this.getApiKey()}`
		let _body = store.getState().app.selectedAddress.ltcWallet.derivedMasterPublicKey

		await parentEpml.request('apiCall', {
			url: _url,
			method: 'POST',
			body: _body,
		}).then((res) => {
			if (isNaN(Number(res))) {
				//...
			} else {
				this.ltcWalletBalance = (Number(res) / 1e8).toFixed(8)
			}
		})
	}

	async updateDogeWalletBalance() {
		let _url = `/crosschain/doge/walletbalance?apiKey=${this.getApiKey()}`
		let _body = store.getState().app.selectedAddress.dogeWallet.derivedMasterPublicKey

		await parentEpml.request('apiCall', {
			url: _url,
			method: 'POST',
			body: _body,
		}).then((res) => {
			if (isNaN(Number(res))) {
				//...
			} else {
				this.dogeWalletBalance = (Number(res) / 1e8).toFixed(8)
			}
		})
	}

	async updateDgbWalletBalance() {
		let _url = `/crosschain/dgb/walletbalance?apiKey=${this.getApiKey()}`
		let _body = store.getState().app.selectedAddress.dgbWallet.derivedMasterPublicKey

		await parentEpml.request('apiCall', {
			url: _url,
			method: 'POST',
			body: _body,
		}).then((res) => {
			if (isNaN(Number(res))) {
				//...
			} else {
				this.dgbWalletBalance = (Number(res) / 1e8).toFixed(8)
			}
		})
	}

	async updateRvnWalletBalance() {
		let _url = `/crosschain/rvn/walletbalance?apiKey=${this.getApiKey()}`
		let _body = store.getState().app.selectedAddress.rvnWallet.derivedMasterPublicKey

		await parentEpml.request('apiCall', {
			url: _url,
			method: 'POST',
			body: _body,
		}).then((res) => {
			if (isNaN(Number(res))) {
				//...
			} else {
				this.rvnWalletBalance = (Number(res) / 1e8).toFixed(8)
			}
		})
	}

	async updateArrrWalletBalance() {
		let _url = `/crosschain/arrr/walletbalance?apiKey=${this.getApiKey()}`
		let _body = store.getState().app.selectedAddress.arrrWallet.seed58

		await parentEpml.request('apiCall', {
			url: _url,
			method: 'POST',
			body: _body,
		}).then((res) => {
			if (isNaN(Number(res))) {
				//...
			} else {
				this.arrrWalletBalance = (Number(res) / 1e8).toFixed(8)
			}
		})
	}

	botBtcTradebook() {
		if (localStorage.getItem(this.botBtcWallet) === null) {
			localStorage.setItem(this.botBtcWallet, '')
		} else {
			this.tradeBotBtcBook = JSON.parse(localStorage.getItem(this.botBtcWallet) || '[]')
		}
	}

	removeBotBTCTradebook() {
		localStorage.removeItem(this.botBtcWallet)
		localStorage.setItem(this.botBtcWallet, '')

		this.tradeBotBtcBook = JSON.parse(localStorage.getItem(this.botBtcWallet) || '[]')
		this.tradeBotAvailableBtcQortal = []
	}

	botLtcTradebook() {
		if (localStorage.getItem(this.botLtcWallet) === null) {
			localStorage.setItem(this.botLtcWallet, '')
		} else {
			this.tradeBotLtcBook = JSON.parse(localStorage.getItem(this.botLtcWallet) || '[]')
		}
	}

	removeBotLTCTradebook() {
		localStorage.removeItem(this.botLtcWallet)
		localStorage.setItem(this.botLtcWallet, '')

		this.tradeBotLtcBook = JSON.parse(localStorage.getItem(this.botLtcWallet) || '[]')
		this.tradeBotAvailableLtcQortal = []
	}

	botDogeTradebook() {
		if (localStorage.getItem(this.botDogeWallet) === null) {
			localStorage.setItem(this.botDogeWallet, '')
		} else {
			this.tradeBotDogeBook = JSON.parse(localStorage.getItem(this.botDogeWallet) || '[]')
		}
	}

	removeBotDOGETradebook() {
		localStorage.removeItem(this.botDogeWallet)
		localStorage.setItem(this.botDogeWallet, '')

		this.tradeBotDogeBook = JSON.parse(localStorage.getItem(this.botDogeWallet) || '[]')
		this.tradeBotAvailableDogeQortal = []
	}

	botDgbTradebook() {
		if (localStorage.getItem(this.botDgbWallet) === null) {
			localStorage.setItem(this.botDgbWallet, '')
		} else {
			this.tradeBotDgbBook = JSON.parse(localStorage.getItem(this.botDgbWallet) || '[]')
		}
	}

	botRvnTradebook() {
		if (localStorage.getItem(this.botRvnWallet) === null) {
			localStorage.setItem(this.botRvnWallet, '')
		} else {
			this.tradeBotRvnBook = JSON.parse(localStorage.getItem(this.botRvnWallet) || '[]')
		}
	}

	botArrrTradebook() {
		if (localStorage.getItem(this.botArrrWallet) === null) {
			localStorage.setItem(this.botArrrWallet, '')
		} else {
			this.tradeBotArrrBook = JSON.parse(localStorage.getItem(this.botArrrWallet) || '[]')
		}
	}

	async buyBtcAction() {
		const makeRequest = async () => {
			return await parentEpml.request('tradeBotRespondRequest', {
				atAddress: this.botBtcBuyAtAddress,
				foreignKey: store.getState().app.selectedAddress.btcWallet.derivedMasterPrivateKey,
				receivingAddress: store.getState().app.selectedAddress.address
			})
		}

		const manageResponse = (response) => {
			if (response === true) {
				let snack5string = get('tradepage.tchange23')
				parentEpml.request('showSnackBar', `${snack5string}`)
			} else if (response === false) {
				localStorage.removeItem(this.botBtcWallet)
				localStorage.setItem(this.botBtcWallet, '')

				var oldBtcTradebook = JSON.parse(localStorage.getItem(this.botBtcWallet) || '[]')

				const newBtcTradebookItem = {
					botBtcQortAmount: this.reAddBtcAmount,
					botBtcPrice: this.reAddBtcPrice
				}

				oldBtcTradebook.push(newBtcTradebookItem)

				localStorage.setItem(this.botBtcWallet, JSON.stringify(oldBtcTradebook))

				this.tradeBotBtcBook = JSON.parse(localStorage.getItem(this.botBtcWallet) || '[]')

				let snack6string = get('tradepage.tchange24')
				parentEpml.request('showSnackBar', `${snack6string}`)
			} else {
				localStorage.removeItem(this.botBtcWallet)
				localStorage.setItem(this.botBtcWallet, '')

				var oldBtcTradebook = JSON.parse(localStorage.getItem(this.botBtcWallet) || '[]')

				const newBtcTradebookItem = {
					botBtcQortAmount: this.reAddBtcAmount,
					botBtcPrice: this.reAddBtcPrice
				}

				oldBtcTradebook.push(newBtcTradebookItem)

				localStorage.setItem(this.botBtcWallet, JSON.stringify(oldBtcTradebook))

				this.tradeBotBtcBook = JSON.parse(localStorage.getItem(this.botBtcWallet) || '[]')

				let snack7string = get('tradepage.tchange25')
				parentEpml.request('showSnackBar', `${snack7string}: ${response.message}`)
			}
		}

		const res = await makeRequest()
		manageResponse(res)
	}

	async buyLtcAction() {
		const makeRequest = async () => {
			return await parentEpml.request('tradeBotRespondRequest', {
				atAddress: this.botLtcBuyAtAddress,
				foreignKey: store.getState().app.selectedAddress.ltcWallet.derivedMasterPrivateKey,
				receivingAddress: store.getState().app.selectedAddress.address
			})
		}

		const manageResponse = (response) => {
			if (response === true) {
				let snack5string = get('tradepage.tchange23')
				parentEpml.request('showSnackBar', `${snack5string}`)
			} else if (response === false) {
				localStorage.removeItem(this.botLtcWallet)
				localStorage.setItem(this.botLtcWallet, '')

				var oldLtcTradebook = JSON.parse(localStorage.getItem(this.botLtcWallet) || '[]')

				const newLtcTradebookItem = {
					botLtcQortAmount: this.reAddLtcAmount,
					botLtcPrice: this.reAddLtcPrice
				}

				oldLtcTradebook.push(newLtcTradebookItem)

				localStorage.setItem(this.botLtcWallet, JSON.stringify(oldLtcTradebook))

				this.tradeBotLtcBook = JSON.parse(localStorage.getItem(this.botLtcWallet) || '[]')

				let snack6string = get('tradepage.tchange24')
				parentEpml.request('showSnackBar', `${snack6string}`)
			} else {
				localStorage.removeItem(this.botLtcWallet)
				localStorage.setItem(this.botLtcWallet, '')

				var oldLtcTradebook = JSON.parse(localStorage.getItem(this.botLtcWallet) || '[]')

				const newLtcTradebookItem = {
					botLtcQortAmount: this.reAddLtcAmount,
					botLtcPrice: this.reAddLtcPrice
				}

				oldLtcTradebook.push(newLtcTradebookItem)

				localStorage.setItem(this.botLtcWallet, JSON.stringify(oldLtcTradebook))

				this.tradeBotLtcBook = JSON.parse(localStorage.getItem(this.botLtcWallet) || '[]')

				let snack7string = get('tradepage.tchange25')
				parentEpml.request('showSnackBar', `${snack7string}: ${response.message}`)
			}
		}

		const res = await makeRequest()
		manageResponse(res)
	}

	async buyDogeAction() {
		const makeRequest = async () => {
			return await parentEpml.request('tradeBotRespondRequest', {
				atAddress: this.botDogeBuyAtAddress,
				foreignKey: store.getState().app.selectedAddress.dogeWallet.derivedMasterPrivateKey,
				receivingAddress: store.getState().app.selectedAddress.address
			})
		}

		const manageResponse = (response) => {
			if (response === true) {
				let snack5string = get('tradepage.tchange23')
				parentEpml.request('showSnackBar', `${snack5string}`)
			} else if (response === false) {
				localStorage.removeItem(this.botDogeWallet)
				localStorage.setItem(this.botDogeWallet, '')

				var oldDogeTradebook = JSON.parse(localStorage.getItem(this.botDogeWallet) || '[]')

				const newDogeTradebookItem = {
					botDogeQortAmount: this.reAddDogeAmount,
					botDogePrice: this.reAddDogePrice
				}

				oldDogeTradebook.push(newDogeTradebookItem)

				localStorage.setItem(this.botDogeWallet, JSON.stringify(oldDogeTradebook))

				this.tradeBotDogeBook = JSON.parse(localStorage.getItem(this.botDogeWallet) || '[]')

				let snack6string = get('tradepage.tchange24')
				parentEpml.request('showSnackBar', `${snack6string}`)
			} else {
				localStorage.removeItem(this.botDogeWallet)
				localStorage.setItem(this.botDogeWallet, '')

				var oldDogeTradebook = JSON.parse(localStorage.getItem(this.botDogeWallet) || '[]')

				const newDogeTradebookItem = {
					botDogeQortAmount: this.reAddDogeAmount,
					botDogePrice: this.reAddDogePrice
				}

				oldDogeTradebook.push(newDogeTradebookItem)

				localStorage.setItem(this.botDogeWallet, JSON.stringify(oldDogeTradebook))

				this.tradeBotDogeBook = JSON.parse(localStorage.getItem(this.botDogeWallet) || '[]')

				let snack7string = get('tradepage.tchange25')
				parentEpml.request('showSnackBar', `${snack7string}: ${response.message}`)
			}
		}

		const res = await makeRequest()
		manageResponse(res)
	}

	async buyDgbAction() {
		const makeRequest = async () => {
			return await parentEpml.request('tradeBotRespondRequest', {
				atAddress: this.botDgbBuyAtAddress,
				foreignKey: store.getState().app.selectedAddress.dgbWallet.derivedMasterPrivateKey,
				receivingAddress: store.getState().app.selectedAddress.address
			})
		}

		const manageResponse = (response) => {
			if (response === true) {
				let snack5string = get('tradepage.tchange23')
				parentEpml.request('showSnackBar', `${snack5string}`)
			} else if (response === false) {
				localStorage.removeItem(this.botDgbWallet)
				localStorage.setItem(this.botDgbWallet, '')

				var oldDgbTradebook = JSON.parse(localStorage.getItem(this.botDgbWallet) || '[]')

				const newDgbTradebookItem = {
					botDgbQortAmount: this.reAddDgbAmount,
					botDgbPrice: this.reAddDgbPrice
				}

				oldDgbTradebook.push(newDgbTradebookItem)

				localStorage.setItem(this.botDgbWallet, JSON.stringify(oldDgbTradebook))

				this.tradeBotDgbBook = JSON.parse(localStorage.getItem(this.botDgbWallet) || '[]')

				let snack6string = get('tradepage.tchange24')
				parentEpml.request('showSnackBar', `${snack6string}`)
			} else {
				localStorage.removeItem(this.botDgbWallet)
				localStorage.setItem(this.botDgbWallet, '')

				var oldDgbTradebook = JSON.parse(localStorage.getItem(this.botDgbWallet) || '[]')

				const newDgbTradebookItem = {
					botDgbQortAmount: this.reAddDgbAmount,
					botDgbPrice: this.reAddDgbPrice
				}

				oldDgbTradebook.push(newDgbTradebookItem)

				localStorage.setItem(this.botDgbWallet, JSON.stringify(oldDgbTradebook))

				this.tradeBotDgbBook = JSON.parse(localStorage.getItem(this.botDgbWallet) || '[]')

				let snack7string = get('tradepage.tchange25')
				parentEpml.request('showSnackBar', `${snack7string}: ${response.message}`)
			}
		}

		const res = await makeRequest()
		manageResponse(res)
	}

	async buyRvnAction() {
		const makeRequest = async () => {
			return await parentEpml.request('tradeBotRespondRequest', {
				atAddress: this.botRvnBuyAtAddress,
				foreignKey: store.getState().app.selectedAddress.rvnWallet.derivedMasterPrivateKey,
				receivingAddress: store.getState().app.selectedAddress.address
			})
		}

		const manageResponse = (response) => {
			if (response === true) {
				let snack5string = get('tradepage.tchange23')
				parentEpml.request('showSnackBar', `${snack5string}`)
			} else if (response === false) {
				localStorage.removeItem(this.botRvnWallet)
				localStorage.setItem(this.botRvnWallet, '')

				var oldRvnTradebook = JSON.parse(localStorage.getItem(this.botRvnWallet) || '[]')

				const newRvnTradebookItem = {
					botRvnQortAmount: this.reAddRvnAmount,
					botRvnPrice: this.reAddRvnPrice
				}

				oldRvnTradebook.push(newRvnTradebookItem)

				localStorage.setItem(this.botRvnWallet, JSON.stringify(oldRvnTradebook))

				this.tradeBotRvnBook = JSON.parse(localStorage.getItem(this.botRvnWallet) || '[]')

				let snack6string = get('tradepage.tchange24')
				parentEpml.request('showSnackBar', `${snack6string}`)
			} else {
				localStorage.removeItem(this.botRvnWallet)
				localStorage.setItem(this.botRvnWallet, '')

				var oldRvnTradebook = JSON.parse(localStorage.getItem(this.botRvnWallet) || '[]')

				const newRvnTradebookItem = {
					botRvnQortAmount: this.reAddRvnAmount,
					botRvnPrice: this.reAddRvnPrice
				}

				oldRvnTradebook.push(newRvnTradebookItem)

				localStorage.setItem(this.botRvnWallet, JSON.stringify(oldRvnTradebook))

				this.tradeBotRvnBook = JSON.parse(localStorage.getItem(this.botRvnWallet) || '[]')

				let snack7string = get('tradepage.tchange25')
				parentEpml.request('showSnackBar', `${snack7string}: ${response.message}`)
			}
		}

		const res = await makeRequest()
		manageResponse(res)
	}

	async buyArrrAction() {
		const makeRequest = async () => {
			return await parentEpml.request('tradeBotRespondRequest', {
				atAddress: this.botArrrBuyAtAddress,
				foreignKey: store.getState().app.selectedAddress.arrrWallet.seed58,
				receivingAddress: store.getState().app.selectedAddress.address
			})
		}

		const manageResponse = (response) => {
			if (response === true) {
				let snack5string = get('tradepage.tchange23')
				parentEpml.request('showSnackBar', `${snack5string}`)
			} else if (response === false) {
				localStorage.removeItem(this.botArrrWallet)
				localStorage.setItem(this.botArrrWallet, '')

				var oldArrrTradebook = JSON.parse(localStorage.getItem(this.botArrrWallet) || '[]')

				const newArrrTradebookItem = {
					botArrrQortAmount: this.reAddArrrAmount,
					botArrrPrice: this.reAddArrrPrice
				}

				oldArrrTradebook.push(newArrrTradebookItem)

				localStorage.setItem(this.botArrrWallet, JSON.stringify(oldArrrTradebook))

				this.tradeBotArrrBook = JSON.parse(localStorage.getItem(this.botArrrWallet) || '[]')

				let snack6string = get('tradepage.tchange24')
				parentEpml.request('showSnackBar', `${snack6string}`)
			} else {
				localStorage.removeItem(this.botArrrWallet)
				localStorage.setItem(this.botArrrWallet, '')

				var oldArrrTradebook = JSON.parse(localStorage.getItem(this.botArrrWallet) || '[]')

				const newArrrTradebookItem = {
					botArrrQortAmount: this.reAddArrrAmount,
					botArrrPrice: this.reAddArrrPrice
				}

				oldArrrTradebook.push(newArrrTradebookItem)

				localStorage.setItem(this.botArrrWallet, JSON.stringify(oldArrrTradebook))

				this.tradeBotArrrBook = JSON.parse(localStorage.getItem(this.botArrrWallet) || '[]')

				let snack7string = get('tradepage.tchange25')
				parentEpml.request('showSnackBar', `${snack7string}: ${response.message}`)
			}
		}

		const res = await makeRequest()
		manageResponse(res)
	}

	stateChanged(state) {
		const split = state.app.url.split('/')
		const sideurl = split[2]
		this.config = state.config
		this.urls = state.app.registeredUrls
		this.addressInfo = state.app.accountInfo.addressInfo
		this.showSyncMessages = state.app.showSyncIndicator

		if (sideurl === 'minting') {
			this.shadowRoot.getElementById('qminter').setAttribute('selected', 'selected')
			if (this.shadowRoot.getElementById('qbminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qiminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qiminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qwallet').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qwallet').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qtrade').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qtrade').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbot').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbot').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qrewardshare').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qrewardshare').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qchat').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qchat').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamereg').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamereg').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamemarket').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamemarket').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qweb').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qweb').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qapp').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qapp').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qgroupmange').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qgroupmange').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qpuzzles').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qpuzzles').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qdata').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qdata').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnode').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnode').removeAttribute('selected')
			}
		} else if (sideurl === 'become-minter') {
			this.shadowRoot.getElementById('qbminter').setAttribute('selected', 'selected')
			if (this.shadowRoot.getElementById('qminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qiminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qiminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qwallet').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qwallet').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qtrade').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qtrade').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbot').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbot').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qrewardshare').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qrewardshare').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qchat').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qchat').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamereg').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamereg').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamemarket').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamemarket').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qweb').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qweb').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qapp').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qapp').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qgroupmange').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qgroupmange').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qpuzzles').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qpuzzles').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qdata').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qdata').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnode').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnode').removeAttribute('selected')
			}
		} else if (sideurl === 'sponsorship-list') {
			this.shadowRoot.getElementById('qiminter').setAttribute('selected', 'selected')
			if (this.shadowRoot.getElementById('qminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qwallet').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qwallet').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qtrade').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qtrade').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbot').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbot').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qrewardshare').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qrewardshare').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qchat').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qchat').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamereg').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamereg').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamemarket').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamemarket').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qweb').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qweb').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qapp').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qapp').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qgroupmange').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qgroupmange').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qpuzzles').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qpuzzles').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qdata').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qdata').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnode').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnode').removeAttribute('selected')
			}
		} else if (sideurl === 'wallet') {
			this.shadowRoot.getElementById('qwallet').setAttribute('selected', 'selected')
			if (this.shadowRoot.getElementById('qminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qiminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qiminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qtrade').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qtrade').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbot').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbot').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qrewardshare').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qrewardshare').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qchat').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qchat').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamereg').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamereg').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamemarket').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamemarket').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qweb').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qweb').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qapp').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qapp').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qgroupmange').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qgroupmange').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qpuzzles').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qpuzzles').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qdata').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qdata').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnode').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnode').removeAttribute('selected')
			}
		} else if (sideurl === 'trade-portal') {
			this.shadowRoot.getElementById('qtrade').setAttribute('selected', 'selected')
			if (this.shadowRoot.getElementById('qminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qiminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qiminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qwallet').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qwallet').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbot').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbot').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qrewardshare').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qrewardshare').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qchat').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qchat').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamereg').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamereg').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamemarket').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamemarket').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qweb').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qweb').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qapp').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qapp').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qgroupmange').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qgroupmange').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qpuzzles').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qpuzzles').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qdata').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qdata').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnode').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnode').removeAttribute('selected')
			}
		} else if (sideurl === 'trade-bot-portal') {
			this.shadowRoot.getElementById('qbot').setAttribute('selected', 'selected')
			if (this.shadowRoot.getElementById('qminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qiminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qiminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qwallet').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qwallet').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qtrade').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qtrade').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qrewardshare').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qrewardshare').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qchat').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qchat').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamereg').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamereg').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamemarket').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamemarket').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qweb').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qweb').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qapp').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qapp').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qgroupmange').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qgroupmange').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qpuzzles').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qpuzzles').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qdata').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qdata').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnode').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnode').removeAttribute('selected')
			}
		} else if (sideurl === 'reward-share') {
			this.shadowRoot.getElementById('qrewardshare').setAttribute('selected', 'selected')
			if (this.shadowRoot.getElementById('qminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qiminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qiminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qwallet').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qwallet').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qtrade').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qtrade').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbot').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbot').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qchat').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qchat').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamereg').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamereg').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamemarket').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamemarket').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qweb').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qweb').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qapp').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qapp').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qgroupmange').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qgroupmange').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qpuzzles').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qpuzzles').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qdata').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qdata').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnode').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnode').removeAttribute('selected')
			}
		} else if (sideurl === 'q-chat') {
			this.shadowRoot.getElementById('qchat').setAttribute('selected', 'selected')
			if (this.shadowRoot.getElementById('qminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qiminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qiminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qwallet').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qwallet').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qtrade').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qtrade').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbot').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbot').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qrewardshare').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qrewardshare').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamereg').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamereg').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamemarket').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamemarket').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qweb').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qweb').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qapp').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qapp').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qgroupmange').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qgroupmange').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qpuzzles').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qpuzzles').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qdata').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qdata').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnode').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnode').removeAttribute('selected')
			}
		} else if (sideurl === 'name-registration') {
			this.shadowRoot.getElementById('qnamereg').setAttribute('selected', 'selected')
			if (this.shadowRoot.getElementById('qminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qiminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qiminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qwallet').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qwallet').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qtrade').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qtrade').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbot').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbot').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qrewardshare').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qrewardshare').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qchat').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qchat').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamemarket').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamemarket').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qweb').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qweb').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qapp').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qapp').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qgroupmange').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qgroupmange').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qpuzzles').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qpuzzles').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qdata').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qdata').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnode').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnode').removeAttribute('selected')
			}
		} else if (sideurl === 'names-market') {
			this.shadowRoot.getElementById('qnamemarket').setAttribute('selected', 'selected')
			if (this.shadowRoot.getElementById('qminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qiminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qiminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qwallet').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qwallet').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qtrade').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qtrade').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbot').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbot').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qrewardshare').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qrewardshare').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qchat').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qchat').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamereg').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamereg').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qweb').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qweb').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qapp').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qapp').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qgroupmange').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qgroupmange').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qpuzzles').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qpuzzles').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qdata').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qdata').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnode').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnode').removeAttribute('selected')
			}
		} else if (sideurl === 'websites') {
			this.shadowRoot.getElementById('qweb').setAttribute('selected', 'selected')
			if (this.shadowRoot.getElementById('qminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qiminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qiminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qwallet').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qwallet').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qtrade').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qtrade').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbot').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbot').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qrewardshare').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qrewardshare').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qchat').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qchat').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamereg').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamereg').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamemarket').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamemarket').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qapp').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qapp').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qgroupmange').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qgroupmange').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qpuzzles').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qpuzzles').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qdata').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qdata').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnode').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnode').removeAttribute('selected')
			}
		} else if (sideurl === 'qapps') {
			this.shadowRoot.getElementById('qapp').setAttribute('selected', 'selected')
			if (this.shadowRoot.getElementById('qminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qiminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qiminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qwallet').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qwallet').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qtrade').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qtrade').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbot').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbot').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qrewardshare').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qrewardshare').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qchat').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qchat').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamereg').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamereg').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamemarket').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamemarket').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qweb').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qweb').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qgroupmange').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qgroupmange').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qpuzzles').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qpuzzles').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qdata').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qdata').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnode').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnode').removeAttribute('selected')
			}
		} else if (sideurl === 'group-management') {
			this.shadowRoot.getElementById('qgroupmange').setAttribute('selected', 'selected')
			if (this.shadowRoot.getElementById('qminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qiminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qiminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qwallet').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qwallet').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qtrade').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qtrade').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbot').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbot').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qrewardshare').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qrewardshare').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qchat').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qchat').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamereg').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamereg').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamemarket').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamemarket').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qweb').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qweb').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qapp').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qapp').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qpuzzles').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qpuzzles').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qdata').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qdata').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnode').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnode').removeAttribute('selected')
			}
		} else if (sideurl === 'puzzles') {
			this.shadowRoot.getElementById('qpuzzles').setAttribute('selected', 'selected')
			if (this.shadowRoot.getElementById('qminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qiminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qiminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qwallet').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qwallet').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qtrade').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qtrade').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbot').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbot').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qrewardshare').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qrewardshare').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qchat').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qchat').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamereg').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamereg').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamemarket').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamemarket').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qweb').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qweb').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qapp').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qapp').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qgroupmange').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qgroupmange').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qdata').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qdata').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnode').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnode').removeAttribute('selected')
			}
		} else if (sideurl === 'data-management') {
			this.shadowRoot.getElementById('qdata').setAttribute('selected', 'selected')
			if (this.shadowRoot.getElementById('qminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qiminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qiminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qwallet').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qwallet').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qtrade').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qtrade').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbot').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbot').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qrewardshare').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qrewardshare').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qchat').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qchat').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamereg').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamereg').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamemarket').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamemarket').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qweb').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qweb').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qapp').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qapp').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qgroupmange').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qgroupmange').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qpuzzles').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qpuzzles').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnode').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnode').removeAttribute('selected')
			}
		} else if (sideurl === 'node-management') {
			this.shadowRoot.getElementById('qnode').setAttribute('selected', 'selected')
			if (this.shadowRoot.getElementById('qminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qiminter').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qiminter').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qwallet').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qwallet').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qtrade').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qtrade').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qbot').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qbot').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qrewardshare').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qrewardshare').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qchat').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qchat').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamereg').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamereg').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qnamemarket').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qnamemarket').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qweb').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qweb').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qapp').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qapp').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qgroupmange').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qgroupmange').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qpuzzles').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qpuzzles').removeAttribute('selected')
			} else if (this.shadowRoot.getElementById('qdata').hasAttribute('selected')) {
				this.shadowRoot.getElementById('qdata').removeAttribute('selected')
			}
		}
	}

	openSettings() {
		const settingsDialog = document.getElementById('main-app').shadowRoot.querySelector('app-view').shadowRoot.querySelector('user-settings')
		settingsDialog.openSettings()
	}

	openLogout() {
		const logoutDialog = document.getElementById('main-app').shadowRoot.querySelector('app-view').shadowRoot.querySelector('logout-view')
		logoutDialog.openLogout()
	}

	getApiKey() {
		const apiNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		return apiNode.apiKey
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
}

window.customElements.define('app-view', AppView)
