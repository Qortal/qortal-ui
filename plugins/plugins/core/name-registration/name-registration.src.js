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
import {warningModal} from '../../utils/warning-modal.js'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class NameRegistration extends LitElement {
    static get properties() {
        return {
            theme: { type: String, reflect: true },
            qortWalletBalance: { type: Number },
            names: { type: Array },
            marketSellNames: { type: Array },
            recipientPublicKey: { type: String },
            selectedAddress: { type: Object },
            btnDisable: { type: Boolean },
            isLoading: { type: Boolean },
            registerNameLoading: { type: Boolean },
            error: { type: Boolean },
            message: { type: String },
            removeError: { type: Boolean },
            removeMessage: { type: String },
            fee: { type: Number },
            updateFee: { type: Number },
            sellFee: { type: Number },
            cancelSellFee: { type: Number },
            toSellName: { type: String },
            toSellPrice: { type: String },
            toCancelSellName: { type: String },
            toUpdateName: { type: String },
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
        this.names = []
        this.marketSellNames = []
        this.recipientPublicKey = ''
        this.btnDisable = false
        this.isLoading = false
        this.registerNameLoading = false
        this.fee = 0.001
        this.updateFee = 0.001
        this.sellFee = 0.001
        this.cancelSellFee = 0.001
        this.toSellName = ''
        this.toUpdateName = ''
        this.toSellPrice = ''
        this.toCancelSellName = ''
        this.errorMessage = ''
        this.successMessage = ''
    }

    render() {
        return html`
            <div id="name-registration-page">
                <div style="min-height:48px; display: flex; padding-bottom: 6px; margin: 2px;">
                    <h3 style="margin: 0; flex: 1; padding-top: .1em; display: inline;">${translate("sidemenu.sm2")}</h3>
                    <mwc-button style="float:right;" @click=${() => this.shadowRoot.querySelector('#registerNameDialog').show()}><mwc-icon>add</mwc-icon>${translate("registernamepage.nchange2")}</mwc-button>
                </div>

                <div class="divCard">
                    <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">${translate("registernamepage.nchange3")}</h3>
                    <vaadin-grid theme="large" id="namesGrid" ?hidden="${this.isEmptyArray(this.names)}" aria-label="Names" .items="${this.names}" all-rows-visible>
                        <vaadin-grid-column width="5rem" flex-grow="0" header="${translate("registernamepage.nchange4")}" .renderer=${(root, column, data) => {
                            render(html`${this.renderAvatar(data.item)}`, root)
                        }}></vaadin-grid-column>
                        <vaadin-grid-column header="${translate("registernamepage.nchange5")}" path="name"></vaadin-grid-column>
                        <vaadin-grid-column header="${translate("registernamepage.nchange6")}" path="owner"></vaadin-grid-column>
                        <vaadin-grid-column width="14rem" flex-grow="0" header="${translate("registernamepage.nchange7")}" .renderer=${(root, column, data) => {
                            render(html`${this.renderAvatarButton(data.item)}`, root)
                        }}></vaadin-grid-column>
                        <vaadin-grid-column width="14rem" flex-grow="0" .renderer=${(root, column, data) => {
                            render(html`${this.renderUpdateNameButton(data.item)}`, root)
                        }}></vaadin-grid-column>
                        <vaadin-grid-column width="14rem" flex-grow="0" .renderer=${(root, column, data) => {
                            if (this.marketSellNames.some(e => e.owner === this.selectedAddress.address)) {
                                render(html`${this.renderCancelSellNameButton(data.item)}`, root)
                            } else {
                                render(html`${this.renderSellNameButton(data.item)}`, root)
                            }
                        }}></vaadin-grid-column>
                    </vaadin-grid>
                    ${(this.isEmptyArray(this.names) && !this.isLoading) ? html`
                        <span style="color: var(--black);">${translate("registernamepage.nchange8")}</span>
                    `: ''}
                    ${this.isLoading ? html`
                        <div class="spinner">
                            <paper-spinner-lite active></paper-spinner-lite>
                        </div>
                    ` : ''}
                </div>

                <mwc-dialog id="registerNameDialog" scrimClickAction="${this.registerNameLoading ? '' : 'close'}">
                    <div style="text-align:center">
                        <h1>${translate("registernamepage.nchange9")}</h1>
                        <hr><br>
                    </div>
                    <p>
                        <mwc-textfield
                            style="width: 100%; color: var(--black);"
                            ?disabled="${this.registerNameLoading}"
                            required
                            outlined
                            id="nameInput"
                            label="${translate("registernamepage.nchange5")}"
                            type="text"
                        >
                        </mwc-textfield>
                    </p>
                    <p>
                        <mwc-textfield
                            style="width: 100%; color: var(--black);"
                            ?disabled="${this.registerNameLoading}"
                            outlined
                            id="descInput"
                            label="${translate("registernamepage.nchange10")}"
                            type="text"
                        >
                        </mwc-textfield>
                    </p>
                    <div style="text-align:right; height:36px;">
                        <span ?hidden="${!this.registerNameLoading}">
                            ${translate("registernamepage.nchange11")} &nbsp;
                            <paper-spinner-lite
                                style="margin-top:12px;"
                                ?active="${this.registerNameLoading}"
                                alt="${translate("registernamepage.nchange12")}"></paper-spinner-lite>
                        </span>
                        <span ?hidden=${this.message === ''} style="${this.error ? 'color:red;' : 'color:green;'}">
                            ${this.message}
                        </span><br>
                        <span>
                            <b>${translate("registernamepage.nchange13")} ${this.fee} QORT.</b>
                        </span>
                    </div>
                    <mwc-button
                        ?disabled="${this.registerNameLoading}"
                        slot="primaryAction"
                        @click=${this.registerName}
                    >
                    ${translate("registernamepage.nchange14")}
                    </mwc-button>
                    <mwc-button
                        ?disabled="${this.registerNameLoading}"
                        slot="secondaryAction"
                        dialogAction="cancel"
                        class="red"
                    >
                    ${translate("general.close")}
                    </mwc-button>
                </mwc-dialog>

                <mwc-dialog id="updateNameDialog" scrimClickAction="" escapeKeyAction="">
                    <div style="text-align:center">
                        <h1>${translate("publishpage.pchange2")} ${translate("login.name")}</h1>
                        <hr><br>
                    </div>
                    <p>
                        <mwc-textfield
                            style="width: 100%; color: var(--black);"
                            readOnly
                            outlined
                            id="oldNameInput"
                            label="${translate("registernamepage.nchange41")}"
                            type="text"
                            value="${this.toUpdateName}"
                        >
                        </mwc-textfield>
                    </p>
                    <p>
                        <mwc-textfield
                            style="width: 100%; color: var(--black);"
                            required
                            outlined
                            id="newNameInput"
                            label="${translate("registernamepage.nchange42")}"
                            type="text"
                        >
                        </mwc-textfield>
                    </p>
                    <p>
                        <mwc-textfield
                            style="width: 100%; color: var(--black);"
                            outlined
                            id="newDescInput"
                            label="${translate("registernamepage.nchange10")}"
                            type="text"
                        >
                        </mwc-textfield>
                    </p>
                    <div style="text-align:right; height:36px;">
                        <span ?hidden=${this.message === ''} style="${this.error ? 'color:red;' : 'color:green;'}">
                            ${this.message}
                        </span><br>
                        <span>
                            <b>${translate("walletpage.wchange21")} ${this.updateFee} QORT.</b>
                        </span>
                    </div>
                    <mwc-button
                        slot="primaryAction"
                        @click="${() => this.updateName()}"
                    >
                    ${translate("publishpage.pchange2")} ${translate("login.name")}
                    </mwc-button>
                    <mwc-button
                        slot="secondaryAction"
                        dialogAction="cancel"
                        class="red"
				@click="${() => this.closeUpdateNameDialog()}"
                    >
                    ${translate("general.close")}
                    </mwc-button>
                </mwc-dialog>

                <mwc-dialog id="sellNameDialog" scrimClickAction="" escapeKeyAction="">
                    <div class="manage-group-dialog">
                        <div style="text-align: center;">
                            <h2>${translate("registernamepage.nchange19")}</h2>
                            <hr />
                            <br>
                        </div>
                        <p>
                            <mwc-textfield
                                style="width: 100%; color: var(--black);"
                                readOnly
                                outlined
                                id="toSellName"
                                label="${translate("registernamepage.nchange25")}"
                                type="text"
                                value="${this.toSellName}"
                            >
                            </mwc-textfield>
                        </p>
                        <p>
                            <mwc-textfield
                                style="width: 100%; color: var(--black);"
                                required
                                outlined
                                id="toSellPrice"
                                label="${translate("registernamepage.nchange23")} (QORT)"
                                type="number"
                                value="${this.toSellPrice}"
                            >
                            </mwc-textfield>
                        </p>
                        <div style="margin-bottom: 10px;">
                            <p style="margin-bottom: 0;">${translate("walletpage.wchange21")} <span style="font-weight: bold;">${this.sellFee} QORT<span></p>
                            <br>
                        </div>
                        ${this.renderClearSuccess()}
                        ${this.renderClearError()}
                        ${this.isLoading ? html`<paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress>` : ''}
                        <div class="buttons">
                            <div>
                                <vaadin-button ?disabled="${this.btnDisable}" theme="primary medium" style="width: 100%;" @click=${() => this.createSellName()}>
                                    <vaadin-icon icon="vaadin:exit" slot="prefix"></vaadin-icon>
                                    ${translate("registernamepage.nchange19")}
                                </vaadin-button>
                            </div>
                        </div>
                    </div>
                    <mwc-button
                        slot="primaryAction"
                        @click="${() => this.closeSellNameDialog()}"
                        class="red"
                    >
                    ${translate("general.close")}
                    </mwc-button>
                </mwc-dialog>

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
        `
    }

    firstUpdated() {
        this.changeTheme()
        this.changeLanguage()
        this.unitFee()
        this.unitUpdateFee()
        this.unitSellFee()
        this.unitCancelSellFee()

        const fetchNames = () => {
            this.isLoading = true
            parentEpml.request('apiCall', {
                url: `/names/address/${this.selectedAddress.address}?limit=0&reverse=true`
            }).then(res => {
                setTimeout(() => { this.names = res }, 1)
                this.isLoading = false
            })
            setTimeout(fetchNames, this.config.user.nodeSettings.pingInterval)
        }

        const fetchMarketSellNames = async () => {
            await parentEpml.request('apiCall', {
                url: `/names/forsale?limit=0&reverse=true`
            }).then(res => {
                this.marketSellNames = res
            })
            setTimeout(fetchMarketSellNames, 180000)
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
                    setTimeout(fetchNames, 1)
                    setTimeout(fetchMarketSellNames, 1)
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

    renderAvatarButton(nameObj) {
        return html`<mwc-button @click=${() => this.uploadAvatar(nameObj)}><mwc-icon>perm_identity</mwc-icon>&nbsp;${translate("registernamepage.nchange15")}</mwc-button>`
    }

    async uploadAvatar(nameObj) {
        let name = nameObj.name
        window.location.href = `../qdn/publish/index.html?service=THUMBNAIL&identifier=qortal_avatar&name=${name}&uploadType=file&category=Avatar&showName=false&showService=false&showIdentifier=false`
    }

    renderSellNameButton(nameObj) {
        return html`<mwc-button class="green" @click=${() => this.openSellNameDialog(nameObj)}><mwc-icon>sell</mwc-icon>&nbsp;${translate("registernamepage.nchange19")}</mwc-button>`
    }

    openSellNameDialog(nameObj) {
        this.toSellName = ''
        this.toSellPrice = ''
        this.shadowRoot.getElementById("toSellName").value = ''
        this.shadowRoot.getElementById("toSellPrice").value = ''
        this.toSellName = nameObj.name
        this.toSellPrice = '5'
        this.shadowRoot.querySelector('#sellNameDialog').show()
    }

    closeSellNameDialog() {
        this.shadowRoot.querySelector('#sellNameDialog').close()
        this.toSellName = ''
        this.toSellPrice = ''
        this.shadowRoot.getElementById("toSellName").value = ''
        this.shadowRoot.getElementById("toSellPrice").value = ''
    }

    renderUpdateNameButton(nameObj) {
        return html`<mwc-button class="warning" @click=${() => this.openUpdateNameDialog(nameObj)}><mwc-icon>update</mwc-icon>&nbsp;${translate("publishpage.pchange2")} ${translate("login.name")}</mwc-button>`
    }

    async openUpdateNameDialog(nameObj) {
        const res = await warningModal.showModalAndWaitPublish(
            {
                message: get('registernamepage.nchange48')
            }
        );
        if (res.action !== 'accept'){
            this.closeUpdateNameDialog()
            return
        }
        this.toUpdateName = ''
        this.shadowRoot.getElementById("oldNameInput").value = ''
        this.shadowRoot.getElementById("newNameInput").value = ''
        this.shadowRoot.getElementById("newDescInput").value = ''
        this.toUpdateName = nameObj.name
        this.shadowRoot.querySelector('#updateNameDialog').show()
    }

    closeUpdateNameDialog() {
        this.shadowRoot.querySelector('#updateNameDialog').close()
        this.toUpdateName = ''
        this.shadowRoot.getElementById("oldNameInput").value = ''
        this.shadowRoot.getElementById("newNameInput").value = ''
        this.shadowRoot.getElementById("newDescInput").value = ''
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

    closeBuyErrorNameDialog() {
        this.shadowRoot.querySelector('#buyErrorNameDialog').close()
    }

    closeBuyErrorPriceDialog() {
        this.shadowRoot.querySelector('#buyErrorPriceDialog').close()
    }

    async unitFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/transactions/unitfee?txType=REGISTER_NAME`
        await fetch(url).then((response) => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response)
        }).then((json) => {
            this.fee = (Number(json) / 1e8).toFixed(2)
        })
    }

    async unitUpdateFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/transactions/unitfee?txType=UPDATE_NAME`
        await fetch(url).then((response) => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response)
        }).then((json) => {
            this.updateFee = (Number(json) / 1e8).toFixed(8)
        })
    }

    async unitSellFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/transactions/unitfee?txType=SELL_NAME`
        await fetch(url).then((response) => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response)
        }).then((json) => {
            this.sellFee = (Number(json) / 1e8).toFixed(8)
        })
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

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.apiKey
    }

    async registerName(e) {
        this.error = false
        this.message = ''
        const feeInput = this.fee
        const nameInput = this.shadowRoot.getElementById("nameInput").value
        const descInput = this.shadowRoot.getElementById("descInput").value

        // Check for valid...
        this.registerNameLoading = true

        // Get Last Ref
        const getLastRef = async () => {
			return await parentEpml.request('apiCall', {
				type: 'api',
				url: `/addresses/lastreference/${this.selectedAddress.address}`
			})
        };

        // Get Account Details
        const validateName = async () => {
			return await parentEpml.request('apiCall', {
				type: 'api',
				url: `/names/${nameInput}`
			})
        };

        const validateReceiver = async () => {
            let nameInfo = await validateName()
            let lastRef = await getLastRef()

            if (nameInfo.error === 401) {
                this.error = false
                this.message = ''
                let myTransaction = await makeTransactionRequest(lastRef)
                getTxnRequestResponse(myTransaction)
            } else {
                this.error = true
                this.message = this.renderFailText()
            }
        }

        // Make Transaction Request
        const makeTransactionRequest = async (lastRef) => {
            let dialogyou = get("transactions.namedialog1")
            let dialogonpress = get("transactions.namedialog2")
			return await parentEpml.request('transaction', {
				type: 3,
				nonce: this.selectedAddress.nonce,
				params: {
					fee: feeInput,
					name: nameInput,
					value: descInput,
					lastReference: lastRef,
					dialogyou: dialogyou,
					dialogonpress: dialogonpress,
				}
			})
        }

        const getTxnRequestResponse = (txnResponse) => {
            if (txnResponse.success === false && txnResponse.message) {
                this.error = true
                this.message = txnResponse.message
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.message = this.renderSuccessText()
                this.error = false
            } else {
                this.error = true
                this.message = txnResponse.data.message
                throw new Error(txnResponse)
            }
        }

        await validateReceiver()

        this.registerNameLoading = false
    }

    async updateName() {
        this.error = false
        this.message = ''
        const updateFeeInput = this.updateFee
        const oldNameInput = this.shadowRoot.getElementById("oldNameInput").value
        const newNameInput = this.shadowRoot.getElementById("newNameInput").value
        const newDescInput = this.shadowRoot.getElementById("newDescInput").value

        // Get Last Ref
        const getLastRef = async () => {
			return await parentEpml.request('apiCall', {
				type: 'api',
				url: `/addresses/lastreference/${this.selectedAddress.address}`
			})
        }

        // Get Account Details
        const validateName = async () => {
			return await parentEpml.request('apiCall', {
				type: 'api',
				url: `/names/${newNameInput}`
			})
        }

        const validateReceiver = async () => {
            let nameInfo = await validateName()
            let lastRef = await getLastRef()

            if (nameInfo.error === 401) {
                this.error = false
                this.message = ''
                let myTransaction = await makeTransactionRequest(lastRef)
                getTxnRequestResponse(myTransaction)
            } else {
                this.error = true
                this.message = this.renderFailText()
            }
        }

        // Make Transaction Request
        const makeTransactionRequest = async (lastRef) => {
            const myOldName = oldNameInput
            const myNewName = newNameInput
            const myNewDesc = newDescInput
            const myLastRef = lastRef
            const myFee = updateFeeInput
            let dialogUpdateName1 = get("registernamepage.nchange43")
            let dialogUpdateName2 = get("registernamepage.nchange44")
            let dialogUpdateName3 = get("registernamepage.nchange45")
			return await parentEpml.request('transaction', {
				type: 4,
				nonce: this.selectedAddress.nonce,
				params: {
					fee: myFee,
					name: myOldName,
					newName: myNewName,
					newData: myNewDesc,
					lastReference: myLastRef,
					dialogUpdateName1: dialogUpdateName1,
					dialogUpdateName2: dialogUpdateName2,
					dialogUpdateName3: dialogUpdateName3
				}
			})
        }

        const getTxnRequestResponse = (txnResponse) => {
            if (txnResponse.success === false && txnResponse.message) {
                this.error = true
                this.message = txnResponse.message
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.message = this.renderSuccessUpdateText()
                this.error = false
            } else {
                this.error = true
                this.message = txnResponse.data.message
                throw new Error(txnResponse)
            }
        }

        await validateReceiver()
    }

    async createSellName() {
        const name = this.shadowRoot.getElementById("toSellName").value
        const price = this.shadowRoot.getElementById("toSellPrice").value
        const sellFeeInput = this.sellFee
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
            const myLastRef = lastRef
            const myFee = sellFeeInput
            const mySellNameDialog1 = get("registernamepage.nchange26")
            const mySellNameDialog2 = get("registernamepage.nchange27")
            const mySellNameDialog3 = get("registernamepage.nchange28")

			return await parentEpml.request('transaction', {
				type: 5,
				nonce: this.selectedAddress.nonce,
				params: {
					fee: myFee,
					name: myName,
					sellPrice: myPrice,
					lastReference: myLastRef,
					sellNameDialog1: mySellNameDialog1,
					sellNameDialog2: mySellNameDialog2,
					sellNameDialog3: mySellNameDialog3
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
                this.shadowRoot.getElementById("toSellName").value = ''
                this.shadowRoot.getElementById("toSellPrice").value = ''
                this.toSellName = ''
                this.toSellPrice = ''
                this.errorMessage = ''
                this.successMessage = this.renderSellSuccessText()
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

    round(number) {
		return (Math.round(parseFloat(number) * 1e8) / 1e8).toFixed(8)
    }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }
}

window.customElements.define('name-registration', NameRegistration)
