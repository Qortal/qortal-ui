import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../epml.js'
import { use, get, translate, translateUnsafeHTML, registerTranslateConfig } from 'lit-translate'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

import '@material/mwc-icon'
import '@material/mwc-button'
import '@material/mwc-textfield'
import '@material/mwc-dialog'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/grid'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class NameRegistration extends LitElement {
    static get properties() {
        return {
            loading: { type: Boolean },
            names: { type: Array },
            recipientPublicKey: { type: String },
            selectedAddress: { type: Object },
            btnDisable: { type: Boolean },
            registerNameLoading: { type: Boolean },
            error: { type: Boolean },
            message: { type: String },
            removeError: { type: Boolean },
            removeMessage: { type: String },
            theme: { type: String, reflect: true }
        }
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --mdc-theme-secondary: var(--mdc-theme-primary);
                --paper-input-container-focus-color: var(--mdc-theme-primary);
                --mdc-theme-surface: var(--white);
                --mdc-dialog-content-ink-color: var(--black);
                --lumo-primary-text-color: rgb(0, 167, 245);
                --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
                --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
                --lumo-primary-color: hsl(199, 100%, 48%);
                --lumo-base-color: var(--white);
                --lumo-body-text-color: var(--black);
                --_lumo-grid-border-color: var(--border);
                --_lumo-grid-secondary-border-color: var(--border2);
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

            .red {
                --mdc-theme-primary: #F44336;
            }
        `
    }

    constructor() {
        super()
        this.selectedAddress = {}
        this.names = []
        this.recipientPublicKey = ''
        this.btnDisable = false
        this.registerNameLoading = false
        this.fee = 0.001
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    render() {
        return html`
            <div id="name-registration-page">
                <div style="min-height:48px; display: flex; padding-bottom: 6px; margin: 2px;">
                    <h2 style="margin: 0; flex: 1; padding-top: .1em; display: inline;">${translate("registernamepage.nchange1")}</h2>
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
                    </vaadin-grid>
                    ${this.isEmptyArray(this.names) ? html`
                        <span style="color: var(--black);">${translate("registernamepage.nchange8")}</span>
                    `: ''}
                </div>

                <!-- Register Name Dialog -->
                <mwc-dialog id="registerNameDialog" scrimClickAction="${this.registerNameLoading ? '' : 'close'}">
                    <div>${translate("registernamepage.nchange9")}</div>
                    <br>
                    <mwc-textfield style="width:100%;" ?disabled="${this.registerNameLoading}" label="${translate("registernamepage.nchange5")}" id="nameInput"></mwc-textfield>
                    <p style="margin-bottom:0;">
                        <mwc-textfield style="width:100%;" ?disabled="${this.registerNameLoading}" label="${translate("registernamepage.nchange10")}" id="descInput"></mwc-textfield>
                    </p>
                    <div style="text-align:right; height:36px;">
                        <span ?hidden="${!this.registerNameLoading}">
                            <!-- loading message -->
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
            </div>
			
			
			
			<mwc-dialog id="sellNameDialog" scrimClickAction="${this.sellNameLoading ? '' : 'close'}">
            <div>${translate("registernamepage.nchange22")}</div>
            <br>
            <mwc-textfield style="width:100%;" ?disabled="${this.sellNameLoading}" label="${translate("registernamepage.nchange5")}" id="nameInput"></mwc-textfield>
            <p style="margin-bottom:0;">
                <mwc-textfield style="width:100%;" ?disabled="${this.sellNameLoading}" label="${translate("registernamepage.nchange23")}" id="descInput"></mwc-textfield>
            </p>
            <div style="text-align:right; height:36px;">
                <span ?hidden="${!this.sellNameLoading}">
                    <!-- loading message -->
                    ${translate("registernamepage.nchange11")} &nbsp;
                    <paper-spinner-lite
                        style="margin-top:12px;"
                        ?active="${this.sellNameLoading}"
                        alt="${translate("registernamepage.nchange12")}"></paper-spinner-lite>
                </span>
                <span ?hidden=${this.message === ''} style="${this.error ? 'color:red;' : 'color:green;'}">
                    ${this.message}
                </span><br>
            </div>
            
            <mwc-button
                ?disabled="${this.sellNameLoading}"
                slot="primaryAction"
                @click=${this.sellName}
            >
            ${translate("registernamepage.nchange24")}
            </mwc-button>
            <mwc-button
                ?disabled="${this.sellNameLoading}"
                slot="secondaryAction"
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
        this.unitFee()

        const fetchNames = () => {
            parentEpml.request('apiCall', {
                url: `/names/address/${this.selectedAddress.address}?limit=0&reverse=true`
            }).then(res => {
                setTimeout(() => { this.names = res }, 1)
            })
            setTimeout(fetchNames, this.config.user.nodeSettings.pingInterval)
        }

        window.addEventListener("contextmenu", (event) => {
            event.preventDefault()
            this._textMenu(event)
        })

        window.addEventListener("click", () => {
            parentEpml.request('closeCopyTextMenu', null)
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
                    configLoaded = true
                }
                this.config = JSON.parse(c)
            })
            parentEpml.subscribe('copy_menu_switch', async value => {
                if (value === 'false' && window.getSelection().toString().length !== 0) {
                    this.clearSelection()
                }
            })
        })
        parentEpml.imReady()
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

    renderCoreText() {
        return html`${translate("registernamepage.nchange16")}`
    }

    renderSuccessText() {
        return html`${translate("registernamepage.nchange18")}`
    }

    renderFailText() {
        return html`${translate("registernamepage.nchange17")}`
    }

    renderAvatar(nameObj) {
        let name = nameObj.name
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/arbitrary/THUMBNAIL/${name}/qortal_avatar?async=true&apiKey=${this.getApiKey()}`;
        return html`<img src="${url}" onerror="this.onerror=null; this.src='/img/incognito.png';">`
    }

    renderAvatarButton(nameObj) {
        return html`<mwc-button @click=${() => this.uploadAvatar(nameObj)}><mwc-icon>perm_identity</mwc-icon>&nbsp;${translate("registernamepage.nchange15")}</mwc-button>`
    }
	
	renderSellNameButton() {
        return html`
            <mwc-button @click=${() => this.shadowRoot.querySelector('#sellNameDialog').show()}><mwc-icon>sell</mwc-icon>&nbsp;${translate("registernamepage.nchange21")}</mwc-button>
        `
    }

    async uploadAvatar(nameObj) {
        let name = nameObj.name
        window.location.href = `../qdn/publish/index.html?service=THUMBNAIL&identifier=qortal_avatar&name=${name}&uploadType=file&category=Avatar&showName=false&showService=false&showIdentifier=false`
    }

    async unitFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
        const url = `${nodeUrl}/transactions/unitfee?txType=REGISTER_NAME`;
        await fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            })
            .then((json) => {
                this.fee = (Number(json) / 1e8).toFixed(2);
            })
            .catch((response) => {
                console.log(response.status, response.statusText, this.renderCoreText());
            })
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
            let myRef = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/lastreference/${this.selectedAddress.address}`
            })
            return myRef
        };

        // Get Account Details
        const validateName = async () => {
            let isValid = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/names/${nameInput}`
            })
            return isValid
        };

        const validateReceiver = async () => {
            let nameInfo = await validateName();
            let lastRef = await getLastRef();

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
            let myTxnrequest = await parentEpml.request('transaction', {
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
            return myTxnrequest
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

        validateReceiver()

        this.registerNameLoading = false
    }

    _textMenu(event) {

        const getSelectedText = () => {
            var text = "";
            if (typeof window.getSelection != "undefined") {
                text = window.getSelection().toString();
            } else if (typeof this.shadowRoot.selection != "undefined" && this.shadowRoot.selection.type == "Text") {
                text = this.shadowRoot.selection.createRange().text;
            }
            return text;
        }

        const checkSelectedTextAndShowMenu = () => {
            let selectedText = getSelectedText();
            if (selectedText && typeof selectedText === 'string') {

                let _eve = { pageX: event.pageX, pageY: event.pageY, clientX: event.clientX, clientY: event.clientY }

                let textMenuObject = { selectedText: selectedText, eventObject: _eve, isFrame: true }

                parentEpml.request('openCopyTextMenu', textMenuObject)
            }
        }

        checkSelectedTextAndShowMenu()
    }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }
}

window.customElements.define('name-registration', NameRegistration)
