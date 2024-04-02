import {css, html, LitElement} from 'lit'
import {render} from 'lit/html.js'
import {Epml} from '../../../epml.js'
import {get, registerTranslateConfig, translate, use} from '../../../../core/translate'
import isElectron from 'is-electron'
import '../components/qortal-info-view.js'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-formfield'
import '@material/mwc-icon'
import '@material/mwc-icon-button'
import '@material/mwc-tab-bar'
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

class NamesMarket extends LitElement {
    static get properties() {
        return {
            theme: { type: String, reflect: true },
            qortWalletBalance: { type: Number },
            marketSellNames: { type: Array },
            marketSoldNames: { type: Array },
            filteredItems: { type: Array },
            filteredSoldItems: { type: Array },
            searchSellNames: { type: Array },
            recipientPublicKey: { type: String },
            selectedAddress: { type: Object },
            btnDisable: { type: Boolean },
            isLoading: { type: Boolean },
            error: { type: Boolean },
            message: { type: String },
            removeError: { type: Boolean },
            removeMessage: { type: String },
            cancelSellFee: { type: Number },
            buyFee: { type: Number },
            toCancelSellName: { type: String },
            toBuyName: { type: String },
            toBuyPrice: { type: String },
            toBuySeller: { type: String },
            errorMessage: { type: String },
            successMessage: { type: String }
        }
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --paper-input-container-focus-color: var(--mdc-theme-primary);
                --mdc-theme-surface: var(--white);
                --mdc-text-field-outlined-idle-border-color: var(--txtfieldborder);
                --mdc-text-field-outlined-hover-border-color: var(--txtfieldhoverborder);
                --mdc-text-field-label-ink-color: var(--black);
                --mdc-text-field-ink-color: var(--black);
                --mdc-dialog-content-ink-color: var(--black);
                --mdc-dialog-min-width: 400px;
                --mdc-dialog-max-width: 1024px;
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

            [hidden] {
                display: hidden !important;
                visibility: none !important;
            }

            #name-registration-page {
                background: var(--white);
                padding: 12px 24px;
            }

            .divCard {
                border: 1px solid var(--border);
                padding: 1em;
                box-shadow: 0 .3px 1px 0 rgba(0,0,0,0.14), 0 1px 1px -1px rgba(0,0,0,0.12), 0 1px 2px 0 rgba(0,0,0,0.20);
                margin-bottom: 10px;
                margin-top: 10px;
            }

            h2 {
                margin:0;
            }

            h2, h3, h4, h5 {
                color: var(--black);
                font-weight: 400;
            }

            img {
                border-radius: 25%;
                max-width: 42px;
                height: 100%;
                max-height: 42px;
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

            .sellerAddress {
                color: var(--mdc-theme-primary);
                cursor: pointer;
            }

            .buyerAddress {
                color: #198754;
                cursor: pointer;
            }

            .sold {
                color: #F44336;
                --mdc-icon-size: 16px;
                padding-top: 10px;
            }

            .buttons {
                text-align: right;
            }

            paper-spinner-lite {
                height: 30px;
                width: 30px;
                --paper-spinner-color: var(--mdc-theme-primary);
                --paper-spinner-stroke-width: 3px;
            }

            .spinner {
                width: 100%;
                display: flex;
                justify-content: center;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
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

            #pagesSold {
                display: flex;
                flex-wrap: wrap;
                padding: 10px 5px 5px 5px;
                margin: 0px 20px 20px 20px;
            }

            #pagesSold > button {
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

            #pagesSold > button:not([disabled]):hover,
            #pagesSold > button:focus {
                color: #ccc;
                background-color: #eee;
            }

            #pagesSold > button[selected] {
                font-weight: bold;
                color: var(--white);
                background-color: #ccc;
            }

            #pagesSold > button[disabled] {
                opacity: 0.5;
                cursor: default;
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

            .manage-group-dialog {
                min-height: 300px;
                min-width: 350px;
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

            .error-icon {
                font-size: 48px;
                color: red;
            }
        `
    }

    constructor() {
        super()
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
        this.qortWalletBalance = 0
        this.selectedAddress = {}
        this.marketSellNames = []
        this.marketSoldNames = []
        this.filteredItems = []
        this.filteredSoldItems = []
        this.searchSellNames = []
        this.recipientPublicKey = ''
        this.btnDisable = false
        this.isLoading = false
        this.cancelSellFee = 0.001
        this.buyFee = 0.001
        this.toCancelSellName = ''
        this.toBuyName = ''
        this.toBuyPrice = ''
        this.toBuySeller = ''
        this.errorMessage = ''
        this.successMessage = ''
    }

    render() {
        return html`
            <div id="name-registration-page">
                <mwc-tab-bar id="tabs-1" activeIndex="0">
                    <mwc-tab label="${translate("registernamepage.nchange22")}" @click="${(e) => this.displayTabContent('sell')}"></mwc-tab>
                    <mwc-tab label="${translate("registernamepage.nchange46")}" @click="${(e) => this.displayTabContent('sold')}"></mwc-tab>
                </mwc-tab-bar>

                <div id="tabs-1-content">
                    <div id="tab-sell-content">
                        <div class="divCard">
                            <vaadin-text-field
                                placeholder="${translate("datapage.dchange4")}"
                                style="width: 25%; margin-bottom: 20px;"
                                clear-button-visible
                                @value-changed="${(e) => {
                                    this.searchSellNames = []
                                    const searchTerm = (e.target.value || '').trim()
                                    const keys = ['name', 'owner', 'salePrice']
                                    const filtered = this.marketSellNames.filter((search) => keys.some((key) => search[key].toLowerCase().includes(searchTerm.toLowerCase())))
                                    if (!e.target.value) {
                                        this.updatePageSize()
                                    } else {
                                        this.searchSellNames = filtered
                                        this.updatePageSizeSearch()
                                    }
                                }}"
                            >
                            <vaadin-icon slot="prefix" icon="vaadin:search"></vaadin-icon>
                            </vaadin-text-field><br>
                            <vaadin-grid theme="large" id="marketSellNames" ?hidden="${this.isEmptyArray(this.marketSellNames)}" aria-label="Names" page-size="20" all-rows-visible>
                                <vaadin-grid-column header="${translate("registernamepage.nchange5")}" path="name"></vaadin-grid-column>
                                <vaadin-grid-column header="${translate("registernamepage.nchange6")}" .renderer=${(root, column, data) => {
                                        render(html`<span class="sellerAddress" @click=${() => this.openSellerInfo(data.item.owner)}>${data.item.owner}</span>`, root)
                                }}></vaadin-grid-column>
                                <vaadin-grid-column header="${translate("registernamepage.nchange23")} (QORT)" path="salePrice"></vaadin-grid-column>
                                <vaadin-grid-column width="14rem" flex-grow="0" header="${translate("registernamepage.nchange7")}" .renderer=${(root, column, data) => {
                                    if (data.item.owner === this.selectedAddress.address) {
                                        render(html`${this.renderCancelSellNameButton(data.item)}`, root)
                                    } else {
                                        render(html`${this.renderBuyNameButton(data.item)}`, root)
                                    }
                                }}></vaadin-grid-column>
                            </vaadin-grid>
                            <div id="pages"></div>
                            ${(this.isEmptyArray(this.marketSellNames) && !this.isLoading) ? html`
                                <span style="color: var(--black);">${translate("registernamepage.nchange24")}</span>
                            `: ''}
                            ${this.isLoading ? html`
                                <div class="spinner">
                                    <paper-spinner-lite active></paper-spinner-lite>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div id="tab-sold-content">
                        <div class="divCard">
                            <vaadin-grid theme="large" id="marketSoldNames" ?hidden="${this.isEmptyArray(this.marketSoldNames)}" aria-label="Sold Names" page-size="20" all-rows-visible>
                                <vaadin-grid-column header="${translate("registernamepage.nchange5")}" path="name"></vaadin-grid-column>
                                <vaadin-grid-column header="${translate("registernamepage.nchange6")}" .renderer=${(root, column, data) => {
                                        render(html`<span class="sellerAddress" @click=${() => this.openSellerInfo(data.item.seller)}>${data.item.seller}</span>`, root)
                                }}></vaadin-grid-column>
                                <vaadin-grid-column header="${translate("rewardsharepage.rchange6")}" .renderer=${(root, column, data) => {
                                        render(html`<span class="buyerAddress" @click=${() => this.openSellerInfo(data.item.creatorAddress)}>${data.item.creatorAddress}</span>`, root)
                                }}></vaadin-grid-column>
                                <vaadin-grid-column header="${translate("registernamepage.nchange23")} (QORT)" path="amount"></vaadin-grid-column>
                                <vaadin-grid-column width="10rem" flex-grow="0" header="${translate("websitespage.schange28")}" .renderer=${(root, column, data) => {
                                        render(html`<span style="color: #F44336;"><mwc-icon class="sold">sell</mwc-icon>&nbsp;${translate("tradepage.tchange31")}</span>`, root)
                                }}></vaadin-grid-column>
                            </vaadin-grid>
                            <div id="pagesSold"></div>
                            ${(this.isEmptyArray(this.marketSoldNames) && !this.isLoading) ? html`
                                <span style="color: var(--black);">${translate("registernamepage.nchange24")}</span>
                            `: ''}
                            ${this.isLoading ? html`
                                <div class="spinner">
                                    <paper-spinner-lite active></paper-spinner-lite>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <mwc-dialog id="cancelSellNameDialog" scrimClickAction="" escapeKeyAction="">
                    <div class="manage-group-dialog">
                        <div style="text-align: center;">
                            <h2>${translate("registernamepage.nchange20")} ${translate("registernamepage.nchange5")}</h2>
                            <hr />
                            <br>
                        </div>
                        <p>
                            <mwc-textfield
                                style="width: 100%; color: var(--black);"
                                readOnly
                                outlined
                                id="toCancelSellName"
                                label="${translate("registernamepage.nchange29")}"
                                type="text"
                                value="${this.toCancelSellName}"
                            >
                            </mwc-textfield>
                        </p>
                        <div style="margin-bottom: 10px;">
                            <p style="margin-bottom: 0;">${translate("walletpage.wchange21")} <span style="font-weight: bold;">${this.cancelSellFee} QORT<span></p>
                            <br>
                        </div>
                        ${this.renderClearSuccess()}
                        ${this.renderClearError()}
                        ${this.isLoading ? html`<paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress>` : ''}
                        <div class="buttons">
                            <div>
                                <vaadin-button ?disabled="${this.btnDisable}" theme="primary medium" style="width: 100%;" @click=${() => this.createCancelSellName()}>
                                    <vaadin-icon icon="vaadin:close-circle-o" slot="prefix"></vaadin-icon>
                                    ${translate("registernamepage.nchange20")} ${translate("registernamepage.nchange5")}
                                </vaadin-button>
                            </div>
                        </div>
                    </div>
                    <mwc-button
                        slot="primaryAction"
                        @click="${() => this.closeCancelSellNameDialog()}"
                        class="red"
                    >
                    ${translate("general.close")}
                    </mwc-button>
                </mwc-dialog>

                <mwc-dialog id="buyNameDialog" scrimClickAction="" escapeKeyAction="">
                    <div class="manage-group-dialog">
                        <div style="text-align: center;">
                            <h2>${translate("registernamepage.nchange21")}</h2>
                            <hr />
                            <br>
                        </div>
                        <p>
                            <mwc-textfield
                                style="width: 100%; color: var(--black);"
                                readOnly
                                outlined
                                id="toBuyName"
                                label="${translate("registernamepage.nchange5")}"
                                type="text"
                                value="${this.toBuyName}"
                            >
                            </mwc-textfield>
                        </p>
                        <p>
                            <mwc-textfield
                                style="width: 100%; color: var(--black);"
                                readOnly
                                outlined
                                id="toBuySeller"
                                label="${translate("registernamepage.nchange6")}"
                                type="text"
                                value="${this.toBuySeller}"
                            >
                            </mwc-textfield>
                        </p>
                        <p>
                            <mwc-textfield
                                style="width: 100%; color: var(--black);"
                                readOnly
                                outlined
                                id="toBuyPrice"
                                label="${translate("registernamepage.nchange23")}"
                                type="number"
                                value="${this.toBuyPrice}"
                            >
                            </mwc-textfield>
                        </p>
                        <div style="margin-bottom: 10px;">
                            <p style="margin-bottom: 0;">${translate("walletpage.wchange21")} <span style="font-weight: bold;">${this.buyFee} QORT<span></p>
                            <br>
                        </div>
                        ${this.renderClearSuccess()}
                        ${this.renderClearError()}
                        ${this.isLoading ? html`<paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress>` : ''}
                        <div class="buttons">
                            <div>
                                <vaadin-button ?disabled="${this.btnDisable}" theme="primary medium" style="width: 100%;" @click=${() => this.openCheckFunds()}>
                                    <vaadin-icon icon="vaadin:cart" slot="prefix"></vaadin-icon>
                                    ${translate("registernamepage.nchange21")}
                                </vaadin-button>
                            </div>
                        </div>
                    </div>
                    <mwc-button
                        slot="primaryAction"
                        @click="${() => this.closeBuyNameDialog()}"
                        class="red"
                    >
                    ${translate("general.close")}
                    </mwc-button>
                </mwc-dialog>

                <mwc-dialog id="buyErrorNameDialog" scrimClickAction="" escapeKeyAction="">
                    <div class="card-container">
                        <mwc-icon class="error-icon">warning</mwc-icon>
                        <h2>${translate("registernamepage.nchange35")}</h2>
                        <h4>${translate("registernamepage.nchange36")}</h4>
                    </div>
                    <mwc-button
                        slot="primaryAction"
                        @click=${() => this.closeBuyErrorNameDialog()}
                        class="red"
                    >
                    ${translate("general.close")}
                    </mwc-button>
                </mwc-dialog>

                <mwc-dialog id="buyErrorPriceDialog" scrimClickAction="" escapeKeyAction="">
                    <div class="card-container">
                        <mwc-icon class="error-icon">warning</mwc-icon>
                        <h2>${translate("registernamepage.nchange37")}</h2>
                        <h4>${translate("registernamepage.nchange38")}</h4>
                    </div>
                    <mwc-button
                        slot="primaryAction"
                        @click=${() => this.closeBuyErrorPriceDialog()}
                        class="red"
                    >
                    ${translate("general.close")}
                    </mwc-button>
                </mwc-dialog>
            </div>
            <qortal-info-view></qortal-info-view>
        `
    }

    firstUpdated() {

        this.changeTheme()
        this.changeLanguage()
        this.unitCancelSellFee()
        this.unitBuyFee()

        setTimeout(() => {
            this.displayTabContent('sell')
        }, 0)

        const fetchMarketSellNames = async () => {
            this.isLoading = true
            await parentEpml.request('apiCall', {
                url: `/names/forsale?limit=0&reverse=true`
            }).then(res => {
                this.marketSellNames = res
            })
            await this.updatePageSize()
            this.isLoading = false
            setTimeout(fetchMarketSellNames, 180000)
        }

        const fetchMarketSoldNames = async () => {
            this.isLoading = true
            await parentEpml.request('apiCall', {
                url: `/transactions/search?txType=BUY_NAME&confirmationStatus=BOTH&limit=0&reverse=true`
            }).then(res => {
                this.marketSoldNames = res
            })
            await this.updatePageSoldSize()
            this.isLoading = false
            setTimeout(fetchMarketSoldNames, 300000)
        }

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
                    setTimeout(fetchMarketSellNames, 1)
                    setTimeout(fetchMarketSoldNames, 1)
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
    }

    clearConsole() {
        if (!isElectron()) {
        } else {
            console.clear()
            window.parent.electronAPI.clearCache()
        }
    }

    displayTabContent(tab) {
        const tabSellContent = this.shadowRoot.getElementById('tab-sell-content')
        const tabSoldContent = this.shadowRoot.getElementById('tab-sold-content')
        tabSellContent.style.display = (tab === 'sell') ? 'block' : 'none'
        tabSoldContent.style.display = (tab === 'sold') ? 'block' : 'none'
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

    async updatePageSize() {
        this.filteredItems = []
        this.marketSellNames.sort((a, b) => parseFloat(a.salePrice) - parseFloat(b.salePrice))
        this.filteredItems = this.marketSellNames
        await this.setPages()
        await this.updateItemsFromPage(1, true)
    }

    async setPages() {
        this.namesGrid = this.shadowRoot.querySelector(`#marketSellNames`)
        this.pagesControl = this.shadowRoot.querySelector('#pages')
        this.pages = undefined
    }

    async updatePageSizeSearch() {
        this.filteredItems = []
        this.searchSellNames.sort((a, b) => parseFloat(a.salePrice) - parseFloat(b.salePrice))
        this.filteredItems = this.searchSellNames
        await this.setPagesSearch()
        await this.updateItemsFromPage(1, true)
    }

    async setPagesSearch() {
        this.namesGrid = this.shadowRoot.querySelector(`#marketSellNames`)
        this.pagesControl = this.shadowRoot.querySelector('#pages')
        this.pages = undefined
    }

    async updatePageSoldSize() {
        this.filteredSoldItems = []
        this.marketSoldNames.sort((b, a) => parseFloat(a.amount) - parseFloat(b.amount))
        this.filteredSoldItems = this.marketSoldNames
        await this.setSoldPages()
        await this.updateItemsSoldFromPage(1, true)
    }

    async setSoldPages() {
        this.namesSoldGrid = this.shadowRoot.querySelector(`#marketSoldNames`)
        this.pagesSoldControl = this.shadowRoot.querySelector('#pagesSold')
        this.soldPages = undefined
    }

    async updateItemsFromPage(page, changeNames = false) {
        if (page === undefined) {
            return
        }

        changeNames === true ? (this.pagesControl.innerHTML = '') : null

        if (!this.pages) {
            this.pages = Array.apply(null, { length: Math.ceil(this.filteredItems.length / this.namesGrid.pageSize) }).map((item, index) => {
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
        let start = (page - 1) * this.namesGrid.pageSize
        let end = page * this.namesGrid.pageSize

        this.namesGrid.items = this.filteredItems.slice(start, end)
    }

    async updateItemsSoldFromPage(pageSold, changeSoldNames = false) {
        if (pageSold === undefined) {
            return
        }

        changeSoldNames === true ? (this.pagesSoldControl.innerHTML = '') : null

        if (!this.soldPages) {
            this.soldPages = Array.apply(null, { length: Math.ceil(this.filteredSoldItems.length / this.namesSoldGrid.pageSize) }).map((item, index) => {
                return index + 1
            })

            const prevBtn = document.createElement('button')
            prevBtn.textContent = '<'
            prevBtn.addEventListener('click', () => {
                const selectedPage = parseInt(this.pagesSoldControl.querySelector('[selected]').textContent)
                this.updateItemsSoldFromPage(selectedPage - 1)
            })
            this.pagesSoldControl.appendChild(prevBtn)

            this.soldPages.forEach((pageNumber) => {
                const pageBtn = document.createElement('button')
                pageBtn.textContent = pageNumber
                pageBtn.addEventListener('click', (e) => {
                    this.updateItemsSoldFromPage(parseInt(e.target.textContent))
                })
                if (pageNumber === pageSold) {
                    pageBtn.setAttribute('selected', true)
                }
                this.pagesSoldControl.appendChild(pageBtn)
            })

            const nextBtn = window.document.createElement('button')
            nextBtn.textContent = '>'
            nextBtn.addEventListener('click', () => {
                const selectedPage = parseInt(this.pagesSoldControl.querySelector('[selected]').textContent)
                this.updateItemsSoldFromPage(selectedPage + 1)
            })
            this.pagesSoldControl.appendChild(nextBtn)
        }

        const buttons = Array.from(this.pagesSoldControl.children)

        buttons.forEach((btn, index) => {
            if (parseInt(btn.textContent) === pageSold) {
                btn.setAttribute('selected', true)
            } else {
                btn.removeAttribute('selected')
            }
            if (index === 0) {
                if (pageSold === 1) {
                    btn.setAttribute('disabled', '')
                } else {
                    btn.removeAttribute('disabled')
                }
            }
            if (index === buttons.length - 1) {
                if (pageSold === this.soldPages.length) {
                    btn.setAttribute('disabled', '')
                } else {
                    btn.removeAttribute('disabled')
                }
            }
        })
        let start = (pageSold - 1) * this.namesSoldGrid.pageSize
        let end = pageSold * this.namesSoldGrid.pageSize

        this.namesSoldGrid.items = this.filteredSoldItems.slice(start, end)
    }

    async updateQortWalletBalance() {
        let qortAddress = window.parent.reduxStore.getState().app.selectedAddress.address

        await parentEpml.request('apiCall', {
            url: `/addresses/balance/${qortAddress}`,
        }).then((res) => {
            this.qortWalletBalance = res
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

    renderCoreText() {
        return html`${translate("registernamepage.nchange16")}`
    }

    renderSuccessText() {
        return html`${translate("registernamepage.nchange18")}`
    }

    renderSuccessUpdateText() {
        return html`${translate("registernamepage.nchange47")}`
    }

    renderSellSuccessText() {
        return html`${translate("registernamepage.nchange32")}`
    }

    renderCancelSuccessText() {
        return html`${translate("registernamepage.nchange33")}`
    }

    renderBuySuccessText() {
        return html`${translate("registernamepage.nchange34")}`
    }

    renderFailText() {
        return html`${translate("registernamepage.nchange17")}`
    }

    renderAvatar(nameObj) {
        let name = nameObj.name
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/arbitrary/THUMBNAIL/${name}/qortal_avatar?async=true&apiKey=${this.getApiKey()}`
        return html`<img src="${url}" onerror="this.onerror=null; this.src='/img/incognito.png';">`
    }

    renderCancelSellNameButton(nameObj) {
        return html`<mwc-button class="red" @click=${() => this.openCancelSellNameDialog(nameObj)}><mwc-icon>cancel</mwc-icon>&nbsp;${translate("registernamepage.nchange20")}</mwc-button>`
    }

    openCancelSellNameDialog(nameObj) {
        this.toCancelSellName = ''
        this.shadowRoot.getElementById("toCancelSellName").value = ''
        this.toCancelSellName = nameObj.name
        this.shadowRoot.querySelector('#cancelSellNameDialog').show()
    }

    closeCancelSellNameDialog() {
        this.shadowRoot.querySelector('#cancelSellNameDialog').close()
        this.toCancelSellName = ''
        this.shadowRoot.getElementById("toCancelSellName").value = ''
    }

    renderBuyNameButton(nameObj) {
        return html`<mwc-button class="green" @click=${() => this.openCheck(nameObj)}><mwc-icon>shop</mwc-icon>&nbsp;${translate("registernamepage.nchange21")}</mwc-button>`
    }

    openCheck(nameObj) {
       const _name = nameObj.name
       const _seller = nameObj.owner
       const _price = nameObj.salePrice
       if (this.isEmptyArray(this.names) === true) {
           this.openBuyNameDialog(_name, _seller, _price)
       } else {
           this.shadowRoot.querySelector('#buyErrorNameDialog').show()
       }
    }

    openBuyNameDialog(_name, _seller, _price) {
        this.toBuyName = ''
        this.toBuyPrice = ''
        this.toBuySeller = ''
        this.shadowRoot.getElementById("toBuyName").value = ''
        this.shadowRoot.getElementById("toBuyPrice").value = ''
        this.shadowRoot.getElementById("toBuySeller").value = ''
        this.toBuyName = _name
        this.toBuyPrice = _price
        this.toBuySeller = _seller
        this.shadowRoot.querySelector('#buyNameDialog').show()
    }

    closeBuyNameDialog() {
        this.toBuyName = ''
        this.toBuyPrice = ''
        this.toBuySeller = ''
        this.shadowRoot.getElementById("toBuyName").value = ''
        this.shadowRoot.getElementById("toBuyPrice").value = ''
        this.shadowRoot.getElementById("toBuySeller").value = ''
        this.shadowRoot.querySelector('#buyNameDialog').close()
    }

    async openCheckFunds() {
        await this.updateQortWalletBalance()

        const myFunds = this.round(parseFloat(this.qortWalletBalance))
        const myBuyPrice = this.round(parseFloat(this.toBuyPrice))

        if (Number(myFunds) < Number(myBuyPrice)) {
            this.shadowRoot.querySelector('#buyErrorPriceDialog').show()
        } else {
            this.createBuyName()
        }
    }

    openSellerInfo(address) {
        let sendInfoAddress = address
        const infoDialog = this.shadowRoot.querySelector('qortal-info-view')
        infoDialog.openUserInfo(sendInfoAddress)
    }

    closeBuyErrorNameDialog() {
        this.shadowRoot.querySelector('#buyErrorNameDialog').close()
    }

    closeBuyErrorPriceDialog() {
        this.shadowRoot.querySelector('#buyErrorPriceDialog').close()
    }

    async unitCancelSellFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/transactions/unitfee?txType=CANCEL_SELL_NAME`
        await fetch(url).then((response) => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response)
        }).then((json) => {
            this.cancelSellFee = (Number(json) / 1e8).toFixed(8)
        })
    }

    async unitBuyFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/transactions/unitfee?txType=BUY_NAME`
        await fetch(url).then((response) => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response)
        }).then((json) => {
            this.buyFee = (Number(json) / 1e8).toFixed(8)
        })
    }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.apiKey
    }

    async createCancelSellName() {
        const name = this.shadowRoot.getElementById("toCancelSellName").value
        const cancelSellFeeInput = this.cancelSellFee
        this.isLoading = true
        this.btnDisable = true

        const getLastRef = async () => {
			return await parentEpml.request('apiCall', {
				type: 'api',
				url: `/addresses/lastreference/${this.selectedAddress.address}`
			})
        }

        const validateReceiver = async () => {
            let lastRef = await getLastRef()
            let myTransaction = await makeTransactionRequest(lastRef)
            getTxnRequestResponse(myTransaction)
        }

        const makeTransactionRequest = async (lastRef) => {
            const myName = name
            const myLastRef = lastRef
            const myFee = cancelSellFeeInput
            const myCancelSellNameDialog1 = get("registernamepage.nchange30")
            const myCancelSellNameDialog2 = get("registernamepage.nchange31")

			return await parentEpml.request('transaction', {
				type: 6,
				nonce: this.selectedAddress.nonce,
				params: {
					fee: myFee,
					name: myName,
					lastReference: myLastRef,
					cancelSellNameDialog1: myCancelSellNameDialog1,
					cancelSellNameDialog2: myCancelSellNameDialog2
				}
			})
        }

        const getTxnRequestResponse = (txnResponse) => {
            if (txnResponse.success === false && txnResponse.message) {
                this.errorMessage = txnResponse.message
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.shadowRoot.getElementById("toCancelSellName").value = ''
                this.toCancelSellName = ''
                this.errorMessage = ''
                this.successMessage = this.renderCancelSuccessText()
                this.isLoading = false
                this.btnDisable = false
            } else {
                this.errorMessage = txnResponse.data.message
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            }
        }
        await validateReceiver()
    }

    createBuyName() {
        const name = this.shadowRoot.getElementById("toBuyName").value
        const price = this.shadowRoot.getElementById("toBuyPrice").value
        const seller = this.shadowRoot.getElementById("toBuySeller").value
        const buyFeeInput = this.buyFee
        this.isLoading = true
        this.btnDisable = true

        const getLastRef = async () => {
			return await parentEpml.request('apiCall', {
				type: 'api',
				url: `/addresses/lastreference/${this.selectedAddress.address}`
			})
        }

        const validateReceiver = async () => {
            let lastRef = await getLastRef()
            let myTransaction = await makeTransactionRequest(lastRef)
            getTxnRequestResponse(myTransaction)
        }

        const makeTransactionRequest = async (lastRef) => {
            const myName = name
            const myPrice = price
            const mySeller = seller
            const myLastRef = lastRef
            const myFee = buyFeeInput
            const myBuyNameDialog1 = get("registernamepage.nchange39")
            const myBuyNameDialog2 = get("registernamepage.nchange27")
            const myBuyNameDialog3 = get("registernamepage.nchange40")

			return await parentEpml.request('transaction', {
				type: 7,
				nonce: this.selectedAddress.nonce,
				params: {
					fee: myFee,
					name: myName,
					sellPrice: myPrice,
					recipient: mySeller,
					lastReference: myLastRef,
					buyNameDialog1: myBuyNameDialog1,
					buyNameDialog2: myBuyNameDialog2,
					buyNameDialog3: myBuyNameDialog3
				}
			})
        }

        const getTxnRequestResponse = (txnResponse) => {
            if (txnResponse.success === false && txnResponse.message) {
                this.errorMessage = txnResponse.message
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.shadowRoot.getElementById("toBuyName").value = ''
                this.shadowRoot.getElementById("toBuyPrice").value = ''
                this.shadowRoot.getElementById("toBuySeller").value = ''
                this.toBuyName = ''
                this.toBuyPrice = ''
                this.toBuySeller = ''
                this.errorMessage = ''
                this.successMessage = this.renderBuySuccessText()
                this.isLoading = false
                this.btnDisable = false
            } else {
                this.errorMessage = txnResponse.data.message
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            }
        }
        validateReceiver()
    }

    round(number) {
		return (Math.round(parseFloat(number) * 1e8) / 1e8).toFixed(8)
    }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }
}

window.customElements.define('names-market', NamesMarket)
