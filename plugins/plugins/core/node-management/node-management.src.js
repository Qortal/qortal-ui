import {css, html, LitElement} from 'lit'
import {render} from 'lit/html.js'
import {Epml} from '../../../epml.js'
import isElectron from 'is-electron'
import {get, registerTranslateConfig, translate, use} from '../../../../core/translate'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@material/mwc-icon'
import '@material/mwc-textfield'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@vaadin/grid'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

const parentEpml = new Epml({ type: "WINDOW", source: window.parent })

class NodeManagement extends LitElement {
    static get properties() {
        return {
            loading: { type: Boolean },
            upTime: { type: String },
            mintingAccounts: { type: Array },
            peers: { type: Array },
            addMintingAccountLoading: { type: Boolean },
            removeMintingAccountLoading: { type: Boolean },
            addPeerLoading: { type: Boolean },
            confPeerLoading: { type: Boolean },
            addMintingAccountKey: { type: String },
            removeMintingAccountKey: { type: String },
            addPeerMessage: { type: String },
            confPeerMessage: { type: String },
            addMintingAccountMessage: { type: String },
            removeMintingAccountMessage: { type: String },
            nodeConfig: { type: Object },
            nodeDomain: { type: String },
            theme: { type: String, reflect: true }
        }
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --paper-input-container-focus-color: var(--mdc-theme-primary);
                --mdc-theme-surface: var(--white);
                --mdc-dialog-content-ink-color: var(--black);
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
                height: 24px;
                width: 24px;
                --paper-spinner-color: var(--mdc-theme-primary);
                --paper-spinner-stroke-width: 2px;
            }

            #node-management-page {
                background: var(--white);
            }

            mwc-textfield {
                width: 100%;
            }

            .red {
                --mdc-theme-primary: #F44336;
            }

            .green {
                --mdc-theme-primary: #198754;
            }

            .red-button {
                --mdc-theme-primary: red;
                --mdc-theme-on-primary: white;
            }

            mwc-button.red-button {
                --mdc-theme-primary: red;
                --mdc-theme-on-primary: white;
            }

            .node-card {
                padding: 12px 24px;
                background: var(--white);
                border-radius: 2px;
                box-shadow: 11;
            }

            h2 {
                margin: 0;
            }

            h2,
            h3,
            h4,
            h5 {
                color: var(--black);
                font-weight: 400;
            }

            .sblack {
                color: var(--black);
            }

            [hidden] {
                display: hidden !important;
                visibility: none !important;
            }

            .details {
                display: flex;
                font-size: 18px;
            }
        `
    }

    constructor() {
        super()
        this.upTime = ""
        this.mintingAccounts = []
        this.peers = []
        this.addPeerLoading = false
        this.confPeerLoading = false
        this.addMintingAccountLoading = false
        this.removeMintingAccountLoading = false
        this.addMintingAccountKey = ""
        this.addPeerMessage = ""
        this.confPeerMessage = ""
        this.addMintingAccountMessage = ""
        this.config = {
            user: {
                node: {},
            },
        }
        this.nodeConfig = {}
        this.nodeDomain = ""
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    render() {
	return html`
            <div id="node-management-page">
                <div class="node-card">
                    <h2>${translate("nodepage.nchange1")} ${this.nodeDomain}</h2>
                    ${this.renderButtons()}
                    <span class="sblack"><br>${translate("nodepage.nchange2")} ${this.upTime}</span>
                    <br><br>
                    <div id="minting">
                        <div style="min-height:48px; display: flex; padding-bottom: 6px;">
                            <h3 style="margin: 0; flex: 1; padding-top: 8px; display: inline;">${translate("nodepage.nchange3")}</h3>
                            <mwc-button style="float: right;" @click=${() => this.shadowRoot.getElementById('addMintingAccountDialog').show()}>
                                <mwc-icon>add</mwc-icon>
                                 ${translate("nodepage.nchange4")}
                            </mwc-button>
                        </div>
                        <vaadin-grid theme="large" id="mintingAccountsGrid" ?hidden="${this.isEmptyArray(this.mintingAccounts)}" .items="${this.mintingAccounts}" aria-label="Minting Accounts" all-rows-visible>
                            <vaadin-grid-column auto-width header="${translate("nodepage.nchange9")}" path="mintingAccount"></vaadin-grid-column>
                            <vaadin-grid-column auto-width header="${translate("nodepage.nchange10")}" path="recipientAccount"></vaadin-grid-column>
                            <vaadin-grid-column width="12em" header="${translate("nodepage.nchange11")}" .renderer=${(root, column, data) => {
                                render(html`
                                    <mwc-button class="red" ?disabled=${this.removeMintingAccountLoading} @click=${() => this.removeMintingAccount(data.item.publicKey)}>
                                        <mwc-icon>create</mwc-icon>&nbsp;${translate("nodepage.nchange12")}
                                    </mwc-button>
                                `, root)
                            }}></vaadin-grid-column>
                        </vaadin-grid>
                        ${this.isEmptyArray(this.mintingAccounts) ? html`<span style="color: var(--black);">${translate("nodepage.nchange13")}</span>` : ""}
                    </div><br>
                    <div id="peers">
                        <div style="min-height: 48px; display: flex; padding-bottom: 6px;">
                            <h3 style="margin: 0; flex: 1; padding-top: 8px; display: inline;">
                                <span>${translate("nodepage.nchange14")}</span>
                                <span>(${this.peers.length})</span>
                            </h3>
                            <mwc-button @click=${() => this.shadowRoot.getElementById('addPeerDialog').show()}><mwc-icon>add</mwc-icon>&nbsp;${translate("nodepage.nchange15")}</mwc-button>
                        </div>
                        <vaadin-grid theme="large" id="peersGrid" ?hidden="${this.isEmptyArray(this.peers)}" .items="${this.peers}" aria-label="Peers" all-rows-visible>
                            <vaadin-grid-column header="${translate("nodepage.nchange18")}" path="address"></vaadin-grid-column>
                            <vaadin-grid-column header="${translate("nodepage.nchange19")}" path="lastHeight"></vaadin-grid-column>
                            <vaadin-grid-column header="${translate("nodepage.nchange20")}" path="version"></vaadin-grid-column>
                            <vaadin-grid-column header="${translate("nodepage.nchange21")}" path="age"></vaadin-grid-column>
                            <vaadin-grid-column width="12em" header="${translate("nodepage.nchange22")}" .renderer=${(root, column, data) => {
                                render(html`
                                    <mwc-button class="red" @click=${() => this.removePeer(data.item.address, data.index)}>
                                        <mwc-icon>delete</mwc-icon>&nbsp;${translate("nodepage.nchange12")}
                                    </mwc-button>
                                    <mwc-button class="green" @click=${() => this.forceSyncPeer(data.item.address, data.index)}>
                                        &nbsp;${translate("nodepage.nchange23")}
                                    </mwc-button>
                                `, root)
                            }}></vaadin-grid-column>
                        </vaadin-grid>
                        ${this.isEmptyArray(this.peers) ? html`<span style="color: var(--black);">${translate("nodepage.nchange24")}</span>` : ""}
                    </div><br>
                </div>
            </div>

            <mwc-dialog id="addPeerDialog" scrimClickAction="" escapeKeyAction="">
                <div>${translate("nodepage.nchange16")}</div><br>
                <mwc-textfield ?disabled="${this.addPeerLoading}" label="${translate("nodepage.nchange17")}" id="addPeerAddress" ></mwc-textfield>
                <div style="text-align: center; height: 36px;" ?hidden="${!this.addPeerLoading}">
                    <span>
                        <paper-spinner-lite style="margin-top: 12px;" ?active="${this.addPeerLoading}" alt="Adding new peer"></paper-spinner-lite>
                    </span>
                </div>
                <mwc-button ?disabled="${this.addPeerLoading}" @click="${this.addPeer}" slot="primaryAction">
                    ${translate("nodepage.nchange8")}
                </mwc-button>
                <mwc-button slot="secondaryAction" ?disabled="${this.addPeerLoading}" @click="${() => this.closeAddPeerDialog()}" class="red">
                    ${translate("general.close")}
                </mwc-button>
            </mwc-dialog>

            <mwc-dialog id="addMintingAccountDialog" scrimClickAction="${this.addMintingAccountLoading ? "" : "close"}">
                <div>${translate("nodepage.nchange5")}</div><br>
                 <mwc-textfield ?disabled="${this.addMintingAccountLoading}" label="${translate("nodepage.nchange6")}" id="addMintingAccountKey"></mwc-textfield>
                 <div style="text-align:right; height:36px;" ?hidden=${this.addMintingAccountMessage === ""}>
                     <span ?hidden="${this.addMintingAccountLoading}">
                         ${this.addMintingAccountMessage}&nbsp;
                    </span>
                    <span ?hidden="${!this.addMintingAccountLoading}">
                        ${translate("nodepage.nchange7")} &nbsp;
                        <paper-spinner-lite style="margin-top:12px;" ?active="${this.addMintingAccountLoading}" alt="Adding minting account"></paper-spinner-lite>
                    </span>
                </div>
                <mwc-button ?disabled="${this.addMintingAccountLoading}" slot="primaryAction" @click=${this.addMintingAccount}>
                    ${translate("nodepage.nchange8")}
                </mwc-button>
                <mwc-button ?disabled="${this.addMintingAccountLoading}" slot="secondaryAction" dialogAction="cancel" class="red">
                    ${translate("general.close")}
                </mwc-button>
            </mwc-dialog>

            <mwc-dialog id="bootstrapDialog" scrimClickAction="" escapeKeyAction="">
                <div style="text-align: center;">${translate("tour.tour18")}</div><br>
                <div style="text-align: center;">${translate("nodepage.nchange37")}</div>
                <mwc-button @click="${() => this.bootstrapNode()}" slot="primaryAction">
                    ${translate("general.continue")}
                </mwc-button>
                <mwc-button slot="secondaryAction" @click="${() => this.closeBootstrapDialog()}" class="red">
                    ${translate("login.lp4")}
                </mwc-button>
            </mwc-dialog>
        `
    }

    firstUpdated() {
        this.changeTheme()
        this.changeLanguage()
        this.updateMintingAccounts()

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

        // Calculate HH MM SS from Milliseconds...
        const convertMsToTime = (milliseconds) => {
            let day, hour, minute, seconds
            seconds = Math.floor(milliseconds / 1000)
            minute = Math.floor(seconds / 60)
            seconds = seconds % 60
            hour = Math.floor(minute / 60)
            minute = minute % 60
            day = Math.floor(hour / 24)
            hour = hour % 24
            if (isNaN(day)) {
                return "offline"
            }
            return day + "d " + hour + "h " + minute + "m"
        }

        const getNodeUpTime = () => {
            this.upTime = ""
            parentEpml.request("apiCall", {
                url: `/admin/uptime`
            }).then((res) => {
                this.upTime = convertMsToTime(res)
            })
            setTimeout(getNodeUpTime, 60000)
        }

        const updatePeers = () => {
            this.peers = []
            parentEpml.request("apiCall", {
                url: `/peers`
            }).then((res) => {
                this.peers = res
            })
            setTimeout(updatePeers, 60000)
        }

        const getNodeConfig = () => {
            this.nodeConfig = {}
            this.nodeDomain = ""
            parentEpml.request("getNodeConfig").then((res) => {
                this.nodeConfig = res
                const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
                this.nodeDomain = myNode.domain + ":" + myNode.port
            })
            setTimeout(getNodeConfig, 60000)
        }

        let configLoaded = false

        parentEpml.ready().then(() => {
            parentEpml.subscribe("config", async c => {
                if (!configLoaded) {
                    setTimeout(getNodeUpTime, 1)
                    setTimeout(updatePeers, 1)
                    setTimeout(this.updateMintingAccounts, 1)
                    setTimeout(getNodeConfig, 1)
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

    renderErr1Text() {
        return html`${translate("nodepage.nchange27")}`
    }

    renderErr2Text() {
        return html`${translate("nodepage.nchange28")}`
    }

    forceSyncPeer(peerAddress, rowIndex) {
        parentEpml.request("apiCall", {
            url: `/admin/forcesync?apiKey=${this.getApiKey()}`,
            method: "POST",
            body: peerAddress
        }).then((res) => {
            let snackString = get("nodepage.nchange25")
            parentEpml.request('showSnackBar', `${snackString}` + peerAddress)
        })
    }

    removePeer(peerAddress, rowIndex) {
        parentEpml
            .request("apiCall", {
                url: `/peers?apiKey=${this.getApiKey()}`,
                method: "DELETE",
                body: peerAddress
            })
            .then((res) => {
                let snackString = get("nodepage.nchange26")
                parentEpml.request('showSnackBar', `${snackString}` + peerAddress)
                this.peers.splice(rowIndex, 1)
            })
    }

    renderButtons() {
        if (!isElectron()) {
            return html`<mwc-button style="float:right;" class="red" ?hidden="${(this.upTime === "offline")}" @click=${() => this.stopNode()}><mwc-icon>dangerous</mwc-icon>&nbsp;${translate("nodepage.nchange31")}</mwc-button>
            <mwc-button style="float:right;" ?hidden="${(this.upTime === "offline")}" @click=${() => this.openBootstrapDialog()}><mwc-icon>restart_alt</mwc-icon>&nbsp;${translate("tour.tour18")}</mwc-button>
            <mwc-button style="float:right;" ?hidden="${(this.upTime === "offline")}" @click=${() => this.restartNode()}><mwc-icon>360</mwc-icon>&nbsp;${translate("nodepage.nchange33")}</mwc-button>`
        } else {
            if (this.upTime === "offline") {
                 return html`<mwc-button style="float:right;" class="green" @click=${() => this.startNode()}><mwc-icon>play_circle</mwc-icon>&nbsp;${translate("nodepage.nchange35")}</mwc-button>`
            } else {
                 return html`<mwc-button style="float:right;" class="red" @click=${() => this.stopNode()}><mwc-icon>stop_circle</mwc-icon>&nbsp;${translate("nodepage.nchange31")}</mwc-button>
                 <mwc-button style="float:right;" @click=${() => this.openBootstrapDialog()}><mwc-icon>restart_alt</mwc-icon>&nbsp;${translate("tour.tour18")}</mwc-button>
                 <mwc-button style="float:right;" @click=${() => this.restartNode()}><mwc-icon>360</mwc-icon>&nbsp;${translate("nodepage.nchange33")}</mwc-button>`
            }
        }
    }

    startNode() {
        if (!isElectron()) {
        } else {
            window.parent.electronAPI.startCore()
            let startString = get("nodepage.nchange36")
            parentEpml.request('showSnackBar', `${startString}`)
            this.upTime = "starting node"
        }
    }

    stopNode() {
        parentEpml.request("apiCall", {
            url: `/admin/stop?apiKey=${this.getApiKey()}`,
            method: "GET"
        }).then((res) => {
            if (res === true) {
                let snackString = get("nodepage.nchange32")
                parentEpml.request('showSnackBar', `${snackString}`)
                this.upTime = "offline"
            } else {
                let snackString = get("walletpage.wchange44")
                parentEpml.request('showSnackBar', `${snackString}`)
            }
        })
    }

    restartNode() {
        parentEpml.request("apiCall", {
            url: `/admin/restart?apiKey=${this.getApiKey()}`,
            method: "GET"
        }).then((res) => {
            if (res === true) {
                let snackString = get("nodepage.nchange34")
                parentEpml.request('showSnackBar', `${snackString}`)
                this.upTime = "restarting node"
            } else {
                let snackString = get("walletpage.wchange44")
                parentEpml.request('showSnackBar', `${snackString}`)
            }
        })
    }

    bootstrapNode() {
        parentEpml.request("apiCall", {
            url: `/admin/bootstrap/?apiKey=${this.getApiKey()}`,
            method: "GET"
        }).then((res) => {
            if (res === true) {
                this.shadowRoot.getElementById('bootstrapDialog').close()
                let snackString = get("tour.tour22")
                parentEpml.request('showSnackBar', `${snackString}`)
            } else {
                let snackString = get("walletpage.wchange44")
                parentEpml.request('showSnackBar', `${snackString}`)
            }
        })
    }

    openBootstrapDialog() {
        this.shadowRoot.getElementById('bootstrapDialog').show()
    }

    closeBootstrapDialog() {
        this.shadowRoot.getElementById('bootstrapDialog').close()
    }

    async addPeer() {
        this.addPeerLoading = true
        const addPeerAddress = this.shadowRoot.getElementById('addPeerAddress').value
        await parentEpml.request("apiCall", {
            url: `/peers?apiKey=${this.getApiKey()}`,
            method: "POST",
            body: addPeerAddress
        }).then((res) => {
            if (res === true) {
                let trueString = get("walletpage.wchange52")
                parentEpml.request('showSnackBar', `${trueString}`)
                this.addPeerLoading = false
                this.shadowRoot.getElementById('addPeerAddress').value = ''
                this.shadowRoot.getElementById('addPeerDialog').close()
            } else if (res === false || res.error === 123) {
                let falseString = get("tabmenu.tm41")
                parentEpml.request('showSnackBar', `${falseString}`)
                this.addPeerLoading = false
            }
        })
    }

    closeAddPeerDialog() {
        this.addPeerLoading = false
        this.shadowRoot.getElementById('addPeerAddress').value = ''
        this.shadowRoot.getElementById('addPeerDialog').close()
    }

    addMintingAccount() {
        this.addMintingAccountLoading = true
        this.addMintingAccountMessage = "Loading..."

        this.addMintingAccountKey = this.shadowRoot.querySelector("#addMintingAccountKey").value

        parentEpml.request("apiCall", {
            url: `/admin/mintingaccounts?apiKey=${this.getApiKey()}`,
            method: "POST",
            body: this.addMintingAccountKey
        }).then((res) => {
            if (res === true) {
                this.updateMintingAccounts()
                this.addMintingAccountKey = ""
                this.addMintingAccountMessage = this.renderErr1Text()
                this.addMintingAccountLoading = false
            } else {
                this.addMintingAccountKey = ""
                this.addMintingAccountMessage = this.renderErr2Text() // Corrected an error here thanks to crow (-_-)
                this.addMintingAccountLoading = false
            }
        })
    }

    updateMintingAccounts() {
        this.mintingAccounts = []
        parentEpml.request("apiCall", {
            url: `/admin/mintingaccounts`
        }).then((res) => {
            this.mintingAccounts = res
        })
    }

    removeMintingAccount(publicKey) {
        this.removeMintingAccountLoading = true

        parentEpml.request("apiCall", {
            url: `/admin/mintingaccounts?apiKey=${this.getApiKey()}`,
            method: "DELETE",
            body: publicKey
        }).then((res) => {
            if (res === true) {
                this.updateMintingAccounts()
                this.removeMintingAccountLoading = false
                let snackString = get("nodepage.nchange29")
                parentEpml.request('showSnackBar', `${snackString}`)
            } else {
                this.removeMintingAccountLoading = false
                let snackString = get("nodepage.nchange30")
                parentEpml.request('showSnackBar', `${snackString}`)
            }
        })
    }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.apiKey
    }

    isEmptyArray(arr) {
        if (!arr) return true
        return arr.length === 0
    }
}

window.customElements.define("node-management", NodeManagement)
