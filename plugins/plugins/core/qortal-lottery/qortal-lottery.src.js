import {css, html, LitElement} from 'lit'
import {render} from 'lit/html.js'
import {Epml} from '../../../epml.js'
import {get, registerTranslateConfig, translate, use} from '../../../../core/translate'
import isElectron from 'is-electron'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-formfield'
import '@material/mwc-icon'
import '@material/mwc-icon-button'
import '@material/mwc-textfield'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@polymer/paper-progress/paper-progress.js'
import '@vaadin/button'
import '@vaadin/icon'
import '@vaadin/icons'
import '@vaadin/grid'
import '@vaadin/text-field'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class QortalLottery extends LitElement {
    static get properties() {
        return {
            theme: { type: String, reflect: true },
            selectedAddress: { type: Object },
            openLotteries: { type: Array },
            openLotteriesAtArray: { type: Array },
            openLotteriesArray: { type: Array },
            openLotteriesFilterTx1: { type: Array },
            openLotteriesFilterTx2: { type: Array },
            closedLotteries: { type: Array },
            closedLotteriesAtArray: { type: Array },
            closedLotteriesFilterTx1: { type: Array },
            closedLotteriesFilterTx2: { type: Array },
            closedLotteriesFilterTx3: { type: Array },
            closedLotteriesArray: { type: Array },
            lotteryAtAddress: { type: String },
            lotteryEnterAmount: { type: Number },
            sendQortLoading: { type: Boolean },
            openLotteriesLoading: { type: Boolean },
            closedLotteriesLoading: { type: Boolean },
            sendQortFee: { type: Number },
            errorMessage: { type: String },
            successMessage: { type: String },
            btnDisable: { type: Boolean },
            qortWarning: { type: Boolean },
            isValidAmount: { type: Boolean },
            balance: { type: Number }
        }
    }

    static get styles() {
        return css`
            * {
                box-sizing: border-box;
                --mdc-theme-primary: rgb(3, 169, 244);
                --mdc-theme-secondary: var(--mdc-theme-primary);
                --mdc-theme-surface: var(--white);
		--mdc-theme-error: rgb(255, 89, 89);
                --mdc-dialog-content-ink-color: var(--black);
                --mdc-dialog-min-width: 500px;
                --mdc-dialog-max-width: 1024px;
                --paper-input-container-focus-color: var(--mdc-theme-primary);
                --lumo-primary-text-color: rgb(0, 167, 245);
                --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
                --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
                --lumo-primary-color: hsl(199, 100%, 48%);
                --lumo-base-color: var(--white);
                --lumo-secondary-text-color: var(--sectxt);
                --lumo-contrast-60pct: var(--vdicon);
                --lumo-body-text-color: var(--black);
                --_lumo-grid-border-color: var(--border);
                --_lumo-grid-secondary-border-color: var(--border2);
            }

            [hidden] {
                display: hidden !important;
                visibility: none !important;
            }

            #qortal-lottery-page {
                background: var(--white);
                padding: 12px 24px;
            }

            .divCard {
                padding: 1em;
            }

            h2 {
                margin:0;
            }

            h2, h3, h4, h5 {
                color: var(--black);
                font-weight: 400;
            }

            .header-title {
                display: block;
                overflow: hidden;
                font-size: 32px;
                color: var(--black);
                font-weight: 400;
                text-align: center;
                white-space: pre-wrap;
                overflow-wrap: break-word;
                word-break: break-word;
                cursor: inherit;
                margin-top: 1rem;
            }

            paper-progress {
                --paper-progress-active-color: var(--mdc-theme-primary);
            }

            .red {
                --mdc-theme-primary: #F44336;
            }

            .green {
                --mdc-theme-primary: #198754;
            }

            .warning {
                --mdc-theme-primary: #f0ad4e;
            }

            .buttons {
                text-align: right;
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

            .btn-clear-success {
                --mdc-icon-button-size: 32px;
                color: red;
            }

            .btn-clear-error {
                --mdc-icon-button-size: 32px;
                color: green;
            }

            .error-icon {
                font-size: 48px;
                color: red;
            }

            .warning-text {
                animation: blinker 1.5s linear infinite;
                text-align: center;
                margin-top: 10px;
                color: rgb(255, 89, 89);
            }

            @keyframes blinker {
                50% {
                    opacity: 0;
                 }
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
        `
    }

    constructor() {
        super()
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
        this.selectedAddress = {}
        this.openLotteries = []
        this.openLotteriesAtArray = []
        this.openLotteriesFilterTx1 = []
        this.openLotteriesFilterTx2 = []
        this.openLotteriesArray = []
        this.closedLotteries = []
        this.closedLotteriesAtArray = []
        this.closedLotteriesFilterTx1 = []
        this.closedLotteriesFilterTx2 = []
        this.closedLotteriesFilterTx3 = []
        this.closedLotteriesArray = []
        this.lotteryAtAddress = ''
        this.lotteryEnterAmount = 0
        this.sendQortLoading = false
        this.openLotteriesLoading = false
        this.closedLotteriesLoading = false
        this.sendQortFee = 0
        this.errorMessage = ''
        this.successMessage = ''
        this.isValidAmount = false
        this.btnDisable = false
        this.qortWarning = false
        this.balance = 0
    }

    render() {
        return html`
            <div id="qortal-lottery-page">
                <div>
                    <span class="header-title">${translate('tabmenu.tm42')}</span>
                    <hr style="color: #eee; border-radius: 80%; margin-bottom: 2rem;">
                </div>

                <div class="divCard">
                    <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">${translate('lotterypage.lot1')}</h3>
                    <div class="loadingContainer" id="loadingOpenLotteries" style="display:${this.openLotteriesLoading ? 'block' : 'none'}">
                        <div class="loading"></div>
                        <div style="text-align: center;"><span style="color: var(--black);">${translate("login.loading")}</span></div>
                    </div>
                    <vaadin-grid theme="compact, wrap-cell-content" id="lotteryGrid" ?hidden="${this.isEmptyArray(this.openLotteriesArray)}" aria-label="Open" .items="${this.openLotteriesArray}" all-rows-visible>
                        <vaadin-grid-column width="40%" header="${translate('grouppage.gchange5')}" path="description"></vaadin-grid-column>
                        <vaadin-grid-column width="22%" header="${translate('lotterypage.lot2')}" path="aTAddress"></vaadin-grid-column>
                        <vaadin-grid-column width="8%" header="${translate('lotterypage.lot3')}" path="startBlock"></vaadin-grid-column>
                        <vaadin-grid-column width="9%" header="${translate('lotterypage.lot4')}" path="endBlock"></vaadin-grid-column>
                        <vaadin-grid-column width="8%" header="${translate('lotterypage.lot13')}" path="joined"></vaadin-grid-column>
                        <vaadin-grid-column width="13%" header="${translate('grouppage.gchange7')}" .renderer=${(root, column, data) => {
                            render(html`${this.renderPlayButton(data.item)}`, root)
                        }}></vaadin-grid-column>
                    </vaadin-grid>
                    <div style="display:${this.openLotteriesLoading ? 'none' : 'block'}">
                        ${this.isEmptyArray(this.openLotteriesArray) ? html`
                            <div style="text-align: center;"><span style="color: var(--black);">${translate('lotterypage.lot11')}</span></div>
                        `: ''}
                    </div>
                </div><br>
                <div class="divCard">
                    <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">${translate('lotterypage.lot6')}</h3>
                    <div class="loadingContainer" id="loadingClosedLotteries" style="display:${this.closedLotteriesLoading ? 'block' : 'none'}">
                        <div class="loading"></div>
                        <div style="text-align: center;"><span style="color: var(--black);">${translate("login.loading")}</span></div>
                    </div>
                    <vaadin-grid theme="compact, wrap-cell-content" id="lotteryGrid" ?hidden="${this.isEmptyArray(this.closedLotteriesArray)}" aria-label="Finished" .items="${this.closedLotteriesArray}" all-rows-visible>
                        <vaadin-grid-column width="40%" header="${translate('grouppage.gchange5')}" path="description"></vaadin-grid-column>
                        <vaadin-grid-column width="9%" header="${translate('lotterypage.lot3')}" path="startblock"></vaadin-grid-column>
                        <vaadin-grid-column width="9%" header="${translate('lotterypage.lot4')}" path="endblock"></vaadin-grid-column>
                        <vaadin-grid-column width="12%" header="${translate('lotterypage.lot7')}" .renderer=${(root, column, data) => {
                            render(html`${data.item.jackpot} QORT`, root)
                        }}></vaadin-grid-column>
                        <vaadin-grid-column width="22%" header="${translate('lotterypage.lot8')}" path="winner"></vaadin-grid-column>
                        <vaadin-grid-column width="8%" header="${translate('lotterypage.lot9')}" .renderer=${(root, column, data) => {
                            render(html`<mwc-icon style="color: #00C851">check</mwc-icon>`, root)
                        }}></vaadin-grid-column>
                    </vaadin-grid>
                    <div style="display:${this.closedLotteriesLoading ? 'none' : 'block'}">
                        ${this.isEmptyArray(this.closedLotteriesArray) ? html`
                            <div style="text-align: center;"><span style="color: var(--black);">${translate('lotterypage.lot12')}</span></div>
                        `: ''}
                    </div>
                </div>

                <mwc-dialog id="playLotteryDialog" scrimClickAction="" escapeKeyAction="">
                    <div class="send-coin-dialog">
                        <div style="text-align: center;">
                            <h2>${translate('lotterypage.lot10')}</h2>
                            <hr />
                        </div>
                        <p>
                            <span>${translate("walletpage.wchange18")}:</span><br />
                            <span style="font-weight: bold;">${window.parent.reduxStore.getState().app.selectedAddress.address}</span>
                        </p>
                        <p>
                            <span>${translate("walletpage.wchange19")}:</span><br />
                            <span style="float: left; font-weight: bold; display: inline;">${this.balance} QORT</span>
                            <br>
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
                                value="${this.lotteryEnterAmount}"
                            >
                            </mwc-textfield>
                        </p>
                        <p>
                            <mwc-textfield
                                style="width: 100%;"
                                required
                                readOnly
                                id="recipient"
                                label="${translate("walletpage.wchange20")}"
                                type="text"
                                value="${this.lotteryAtAddress}"
                            >
                            </mwc-textfield>
                        </p>
                        <div style="margin-bottom: 10px;">
                            <p style="margin-bottom: 0;">${translate("walletpage.wchange21")} <span style="font-weight: bold;">${this.sendQortFee} QORT<span></p>
                        </div>
                        ${this.renderClearSuccess()}
                        ${this.renderClearError()}
                        ${this.sendQortLoading ? html`<paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress> ` : ''}
                        <div class="buttons">
                            <div>
                                <vaadin-button ?disabled="${this.btnDisable}" theme="primary medium" style="width: 100%;" @click=${() => this.sendQort()}>
                                    <vaadin-icon icon="vaadin:play-circle-o" slot="prefix"></vaadin-icon>
                                    ${translate('lotterypage.lot10')}
                                </vaadin-button>
                                <div style="display:${this.qortWarning ? 'inline' : 'none'}">${this.renderWarning()}</div>
                            </div>
                        </div>
                    </div>
                    <mwc-button
                        slot="primaryAction"
                        @click="${() => this.closePlayLotteryDialog()}"
                        class="red"
                    >
                        ${translate("general.close")}
                    </mwc-button>
                </mwc-dialog>
            </div>
        `
    }

    async firstUpdated() {
        this.changeTheme()
        this.changeLanguage()

        await this.getLotteries()
        await this.getOpenLotteries()
        await this.getFinishedLotteries()

        window.addEventListener('storage', () => {
            const checkLanguage = localStorage.getItem('qortalLanguage')
            const checkTheme = localStorage.getItem('qortalTheme')

            use(checkLanguage)

            if (checkTheme) {
                this.theme = checkTheme
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

        let configLoaded = false

        parentEpml.ready().then(() => {
            parentEpml.subscribe('selected_address', async selectedAddress => {
                this.selectedAddress = {}
                selectedAddress = JSON.parse(selectedAddress)
                if (!selectedAddress || Object.entries(selectedAddress).length === 0) return
                this.selectedAddress = selectedAddress
            })
            parentEpml.subscribe('config', c => {
                if (!configLoaded) {
                    configLoaded = true
                }
                this.config = JSON.parse(c)
            })
        })
        parentEpml.imReady()

        this.clearConsole()
        setInterval(() => {
            this.clearConsole()
        }, 60000)
        setInterval(() => {
           this.refresh()
        }, 300000)
    }

    changeTheme() {
        const checkTheme = localStorage.getItem('qortalTheme')
        if (checkTheme) {
            this.theme = checkTheme
        } else {
            this.theme = 'light'
        }
        document.querySelector('html').setAttribute('theme', this.theme)
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

    async getLotteries() {
        this.openLotteriesLoading = true
        this.closedLotteriesLoading = true
        this.openLotteries = []
        this.closedLotteries = []
        this.openLotteriesAtArray = []
        this.closedLotteriesAtArray = []

        await parentEpml.request('apiCall', {
            url: `/at/byfunction/GA2GF79hfJeTy1TezS4sUZWS4vxJKs4qqwJ49h3NN8H9?limit=0&reverse=true`
        }).then(res => {
            this.openLotteries = res.filter(function (ol) {
                return ol.isSleeping === true
            })
            this.closedLotteries = res.filter(function (cl) {
                return cl.isSleeping === false
            })
        })

        this.openLotteries.map(item => {
			const aTT = item.ATAddress
			const endHeight = item.sleepUntilHeight
			const newObj = {
				ATAddress: aTT,
				sleepUntilHeight: endHeight
			}
			this.openLotteriesAtArray.push(newObj)
		})

        this.closedLotteries.map(item => {
			const myAT = item.ATAddress
			this.closedLotteriesAtArray.push(myAT)
		})

        const appDelay = ms => new Promise(res => setTimeout(res, ms))
        await appDelay(1000)
    }

    async getOpenLotteries() {
        let prepareOpenLotteriesArray = []

        this.openLotteriesAtArray.map(item => {
			parentEpml.request('apiCall', {
				url: `/transactions/address/${item.ATAddress}?limit=0&reverse=true`
			}).then(res => {
				this.openLotteriesFilterTx1 = []
				this.openLotteriesFilterTx2 = []
				this.openLotteriesFilterTx = res.filter(function (da) {
					return da.type === "DEPLOY_AT"
				})
				this.openLotteriesFilterTx2 = res.filter(function (pm) {
					return pm.type === "PAYMENT"
				})
				this.openLotteriesFilterTx.map(item2 => {
					const sleep = item.sleepUntilHeight
					const desc = item2.description
					const start = item2.blockHeight
					const ata = item2.aTAddress
					const amount = item2.tags
					const players = this.openLotteriesFilterTx2.length
					const obj = {
						description: desc,
						startBlock: start,
						endBlock: sleep,
						aTAddress: ata,
						joined: players,
						enter: amount
					}
					prepareOpenLotteriesArray.push(obj)
				})
			})
		})
        const appDelay = ms => new Promise(res => setTimeout(res, ms))
        await appDelay(2000)
        this.openLotteriesArray = prepareOpenLotteriesArray
        this.openLotteriesArray.sort((a, b) => parseFloat(b.endBlock) - parseFloat(a.endBlock))
        this.openLotteriesLoading = false
    }

    async getFinishedLotteries() {
        let prepareClosedLotteriesArray = []

        this.closedLotteriesAtArray.map(item => {
			parentEpml.request('apiCall', {
				url: `/transactions/address/${item}?limit=0&reverse=true`
			}).then(res => {
				this.closedLotteriesFilterTx1 = []
				this.closedLotteriesFilterTx2 = []
				this.closedLotteriesFilterTx1 = res.filter(function (el) {
					return el.type === "DEPLOY_AT"
				})
				this.closedLotteriesFilterTx2 = res.filter(function (el) {
					return el.type === "AT"
				})

				this.closedLotteriesFilterTx2.map(item1 => {
					const twinner = item1.recipient
					const tjackpot = item1.amount
					const tendblock = item1.blockHeight
					this.closedLotteriesFilterTx1.map(item2 => {
						const tstartblock = item2.blockHeight
						const tdescription = item2.description
						parentEpml.request('apiCall', {
							url: `/names/address/${twinner}?limit=0&reverse=true`
						}).then(res => {
							if (res.length) {
								const winName = res[0].name
								const obj = {
									description: tdescription,
									startblock: tstartblock,
									endblock: tendblock,
									winner: winName,
									jackpot: tjackpot
								}
								prepareClosedLotteriesArray.push(obj)
							} else {
								const obj = {
									description: tdescription,
									startblock: tstartblock,
									endblock: tendblock,
									winner: twinner,
									jackpot: tjackpot
								}
								prepareClosedLotteriesArray.push(obj)
							}
						})
					})
				})
			})
		})
        const appDelay = ms => new Promise(res => setTimeout(res, ms))
        await appDelay(5000)
        this.closedLotteriesArray = prepareClosedLotteriesArray
        this.closedLotteriesArray.sort((a, b) => parseFloat(b.endblock) - parseFloat(a.endblock))
        this.closedLotteriesLoading = false
    }

    renderPlayButton(dataObj) {
        return html`
            <mwc-button class="green" raised dense @click="${() => this.openPlayLotteryDialog(dataObj)}">
                ${translate('lotterypage.lot5')}
            </mwc-button>
        `
    }

    async openPlayLotteryDialog(dataObj) {
        this.balance = 0
        await this.getWalletBalance()
        this.sendQortFee = 0
        await this.getQortPaymentFee()
        this.lotteryAtAddress = ''
        this.lotteryEnterAmount = 0
        this.errorMessage = ''
        this.successMessage = ''
        this.sendQortLoading = false
        this.lotteryAtAddress = dataObj.aTAddress
        this.lotteryEnterAmount = dataObj.enter

        if (!isNaN(this.lotteryEnterAmount) && !isNaN(parseFloat(this.lotteryEnterAmount))) {
            this.lotteryEnterAmount = parseFloat(dataObj.enter)
        } else {
            this.lotteryEnterAmount = 0
        }

        const checkMyQortAmount = this.round(parseFloat(this.lotteryEnterAmount))
        const checkMyFunds = this.round(parseFloat(this.balance - 0.01100000))

        if (Number(checkMyFunds) >= Number(checkMyQortAmount)) {
            this.btnDisable = false
            this.qortWarning = false
        } else {
            this.btnDisable = true
            this.qortWarning = true
        }

        this.shadowRoot.querySelector("#playLotteryDialog").show()
    }

    async getWalletBalance() {
        await parentEpml.request('apiCall', {
            url: `/addresses/balance/${window.parent.reduxStore.getState().app.selectedAddress.address}?apiKey=${this.getApiKey()}`,
        }).then((res) => {
            if (isNaN(Number(res))) {
                let snack4string = get("walletpage.wchange32")
                parentEpml.request('showSnackBar', `${snack4string}`)
            } else {
                this.balance = Number(res).toFixed(8)
            }
        })
    }

    async getQortPaymentFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/transactions/unitfee?txType=PAYMENT`
        await fetch(url).then((response) => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response)
        }).then((json) => {
            this.sendQortFee = (Number(json) / 1e8).toFixed(8)
        })
    }

    closePlayLotteryDialog() {
        this.shadowRoot.querySelector("#playLotteryDialog").close()
        this.balance = 0
        this.lotteryAtAddress = ''
        this.lotteryEnterAmount = 0
        this.errorMessage = ''
        this.successMessage = ''
        this.btnDisable = false
        this.qortWarning = false
        this.sendQortLoading = false
    }

    renderWarning() {
        return html`<span class="warning-text">${translate("tradepage.tchange48")} QORT</span>`
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
                    valid: false,
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
                            valid: true,
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
        this.sendQortFee = 0
        await this.getQortPaymentFee()

        const sendFee = this.sendQortFee
        const amount = this.shadowRoot.getElementById('amountInput').value
        const recipient = this.shadowRoot.getElementById('recipient').value

        this.sendQortLoading = true
        this.btnDisable = true

        if (parseFloat(amount) + parseFloat(0.011) > parseFloat(this.balance)) {
            this.sendQortLoading = false
            this.btnDisable = false
            let snack1string = get("walletpage.wchange26")
            parentEpml.request('showSnackBar', `${snack1string}`)
            return false
        }

        if (parseFloat(amount) <= 0) {
            this.sendQortLoading = false
            this.btnDisable = false
            let snack2string = get("walletpage.wchange27")
            parentEpml.request('showSnackBar', `${snack2string}`)
            return false
        }

        if (recipient.length === 0) {
            this.sendQortLoading = false
            this.btnDisable = false
            let snack3string = get("walletpage.wchange28")
            parentEpml.request('showSnackBar', `${snack3string}`)
            return false
        }

        const getLastRef = async () => {
			return await parentEpml.request('apiCall', {
				type: 'api',
				url: `/addresses/lastreference/${window.parent.reduxStore.getState().app.selectedAddress.address}`,
			})
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
                    this.sendQortLoading = false
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
			return await parentEpml.request('transaction', {
				type: 2,
				nonce: window.parent.reduxStore.getState().app.selectedAddress.nonce,
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
                this.sendQortLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.shadowRoot.getElementById('amountInput').value = ''
                this.shadowRoot.getElementById('recipient').value = ''
                this.errorMessage = ''
                this.lotteryAtAddress = ''
                this.lotteryEnterAmount = 0
                this.successMessage = this.renderSuccessText()
                this.sendQortLoading = false
                this.btnDisable = false
            } else {
                this.errorMessage = txnResponse.data.message
                this.sendQortLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            }
        }
        await validateReceiver(recipient)
    }

    clearConsole() {
        if (!isElectron()) {
        } else {
            console.clear()
            window.parent.electronAPI.clearCache()
        }
    }

    async refresh() {
        await this.getLotteries()
        await this.getOpenLotteries()
        await this.getFinishedLotteries()
    }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.apiKey
    }

    round(number) {
		return (Math.round(parseFloat(number) * 1e8) / 1e8).toFixed(8)
    }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }
}

window.customElements.define('qortal-lottery', QortalLottery)
