import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../epml.js'
import { use, get, translate, translateUnsafeHTML, registerTranslateConfig } from 'lit-translate'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@material/mwc-icon'
import '@material/mwc-textfield'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@vaadin/grid'

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
            tempMintingAccount: { type: Object },
            nodeConfig: { type: Object },
            nodeDomain: { type: String },
            theme: { type: String, reflect: true }
        };
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
    `;
    }

    constructor() {
        super();
        this.upTime = "";
        this.mintingAccounts = [];
        this.peers = [];
        this.addPeerLoading = false;
        this.confPeerLoading = false;
        this.addMintingAccountLoading = false;
        this.removeMintingAccountLoading = false;
        this.addMintingAccountKey = "";
        this.addPeerMessage = "";
        this.confPeerMessage = "";
        this.addMintingAccountMessage = "";
        this.tempMintingAccount = {};
        this.config = {
            user: {
                node: {},
            },
        };
        this.nodeConfig = {};
        this.nodeDomain = "";
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light';
    }

    render() {
	return html`
		<div id="node-management-page">
			<div class="node-card">
				<h2>${translate("nodepage.nchange1")} ${this.nodeDomain}</h2>
				<mwc-button style="float:right;" class="red" ?hidden="${(this.upTime === "offline")}" @click=${() => this.stopNode()}><mwc-icon>dangerous</mwc-icon>&nbsp;${translate("nodepage.nchange31")}</mwc-button>
				<span class="sblack"><br />${translate("nodepage.nchange2")} ${this.upTime}</span>
				<br /><br />
				<div id="minting">
					<div style="min-height:48px; display: flex; padding-bottom: 6px;">
						<h3 style="margin: 0; flex: 1; padding-top: 8px; display: inline;">${translate("nodepage.nchange3")}</h3>
						<mwc-button
							style="float:right;"
							@click=${() => this.shadowRoot.querySelector("#addMintingAccountDialog").show()}
						>
						<mwc-icon>add</mwc-icon>
						${translate("nodepage.nchange4")}
						</mwc-button>
					</div>

					<!-- Add Minting Account Dialog -->
					<mwc-dialog id="addMintingAccountDialog" scrimClickAction="${this.addMintingAccountLoading ? "" : "close"}">
						<div>${translate("nodepage.nchange5")}</div>
						<br />
						<mwc-textfield
							?disabled="${this.addMintingAccountLoading}"
							label="${translate("nodepage.nchange6")}"
							id="addMintingAccountKey"
						>
						</mwc-textfield>
						<div style="text-align:right; height:36px;" ?hidden=${this.addMintingAccountMessage === ""}>
							<span ?hidden="${this.addMintingAccountLoading}">
								${this.addMintingAccountMessage} &nbsp;
							</span>
							<span ?hidden="${!this.addMintingAccountLoading}">
								<!-- loading message -->
								${translate("nodepage.nchange7")} &nbsp;
								<paper-spinner-lite
									style="margin-top:12px;"
									?active="${this.addMintingAccountLoading}"
									alt="Adding minting account"
								>
								</paper-spinner-lite>
							</span>
						</div>
						<mwc-button
							?disabled="${this.addMintingAccountLoading}"
							slot="primaryAction"
							@click=${this.addMintingAccount}
						>
						${translate("nodepage.nchange8")}
						</mwc-button>
						<mwc-button
							?disabled="${this.addMintingAccountLoading}"
							slot="secondaryAction"
							dialogAction="cancel"
							class="red"
						>
						${translate("general.close")}
						</mwc-button>
					</mwc-dialog>

					<vaadin-grid theme="large" id="mintingAccountsGrid" ?hidden="${this.isEmptyArray(this.mintingAccounts)}" .items="${this.mintingAccounts}" aria-label="Minting Accounts" all-rows-visible>
						<vaadin-grid-column auto-width header="${translate("nodepage.nchange9")}" path="mintingAccount"></vaadin-grid-column>
						<vaadin-grid-column auto-width header="${translate("nodepage.nchange10")}" path="recipientAccount"></vaadin-grid-column>
						<vaadin-grid-column  width="12em" header="${translate("nodepage.nchange11")}" .renderer=${(root, column, data) => {
							render(html`<mwc-button class="red" ?disabled=${this.removeMintingAccountLoading} @click=${() => this.removeMintingAccount(data.item.publicKey)}><mwc-icon>create</mwc-icon>&nbsp;${translate("nodepage.nchange12")}</mwc-button>`, root)
						}}></vaadin-grid-column>
					</vaadin-grid>
					${this.isEmptyArray(this.mintingAccounts) ? html`<span style="color: var(--black);">${translate("nodepage.nchange13")}</span>` : ""}
				</div>
				<br />
				<div id="peers">
					<div style="min-height: 48px; display: flex; padding-bottom: 6px;">
						<h3 style="margin: 0; flex: 1; padding-top: 8px; display: inline;">
							<span>${translate("nodepage.nchange14")}</span>
							<span>(${this.peers.length})</span>
						</h3>
						<mwc-button @click=${() => this.shadowRoot.querySelector("#addPeerDialog").show()}><mwc-icon>add</mwc-icon>&nbsp;${translate("nodepage.nchange15")}</mwc-button>
					</div>

					<mwc-dialog id="addPeerDialog" scrimClickAction="${this.addPeerLoading ? "" : "close"}">
						<div>${translate("nodepage.nchange16")}</div>
						<br />
						<mwc-textfield ?disabled="${this.addPeerLoading}" label="${translate("nodepage.nchange17")}" id="addPeerAddress" ></mwc-textfield>
						<div style="text-align:right; height:36px;" ?hidden=${this.addPeerMessage === ""}>
							<span ?hidden="${this.addPeerLoading}"> ${this.addPeerMessage} &nbsp;</span>
							<span ?hidden="${!this.addPeerLoading}">
								<paper-spinner-lite
									style="margin-top:12px;"
									?active="${this.addPeerLoading}"
									alt="Adding minting account"
								>
								</paper-spinner-lite>
							</span>
						</div>
						<mwc-button
							?disabled="${this.addPeerLoading}"
							@click="${this.addPeer}"
							slot="primaryAction"
						>
						${translate("nodepage.nchange8")}
						</mwc-button>
						<mwc-button
							slot="secondaryAction"
							dialogAction="cancel"
							?disabled="${this.addPeerLoading}"
							class="red"
						>
						${translate("general.close")}
						</mwc-button>
					</mwc-dialog>

					<vaadin-grid theme="large" id="peersGrid" ?hidden="${this.isEmptyArray(this.peers)}" .items="${this.peers}" aria-label="Peers" all-rows-visible>
						<vaadin-grid-column header="${translate("nodepage.nchange18")}" path="address"></vaadin-grid-column>
						<vaadin-grid-column header="${translate("nodepage.nchange19")}" path="lastHeight"></vaadin-grid-column>
						<vaadin-grid-column header="${translate("nodepage.nchange20")}" path="version"></vaadin-grid-column>
						<vaadin-grid-column header="${translate("nodepage.nchange21")}" path="age"></vaadin-grid-column>
						<vaadin-grid-column  width="12em" header="${translate("nodepage.nchange22")}" .renderer=${(root, column, data) => {
							render(html`<mwc-button class="red" @click=${() => this.removePeer(data.item.address, data.index)}><mwc-icon>delete</mwc-icon>&nbsp;${translate("nodepage.nchange12")}</mwc-button><mwc-button class="green" @click=${() => this.forceSyncPeer(data.item.address, data.index)}>&nbsp;${translate("nodepage.nchange23")}</mwc-button>`, root)
						}}></vaadin-grid-column>
					</vaadin-grid>
					${this.isEmptyArray(this.peers) ? html`<span style="color: var(--black);">${translate("nodepage.nchange24")}</span>` : ""}
				</div>
				<br />
			</div>
		</div>
	`;
    }

    firstUpdated() {

        this.changeTheme()
        this.changeLanguage()

        // Call updateMintingAccounts
        this.updateMintingAccounts()

        window.addEventListener("contextmenu", (event) => {
            event.preventDefault();
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
            if (e.keyCode === 27) parentEpml.request('closeCopyTextMenu', null)
        }

        // Calculate HH MM SS from Milliseconds...
        const convertMsToTime = (milliseconds) => {
            let day, hour, minute, seconds;
            seconds = Math.floor(milliseconds / 1000);
            minute = Math.floor(seconds / 60);
            seconds = seconds % 60;
            hour = Math.floor(minute / 60);
            minute = minute % 60;
            day = Math.floor(hour / 24);
            hour = hour % 24;
            if (isNaN(day)) {
                return "offline";
            }
            return day + "d " + hour + "h " + minute + "m";
        };

        const getNodeUpTime = () => {
            parentEpml
                .request("apiCall", {
                    url: `/admin/uptime`,
                })
                .then((res) => {
                    this.upTime = "";
                    setTimeout(() => {
                        this.upTime = convertMsToTime(res);
                    }, 1);
                });

            setTimeout(getNodeUpTime, this.config.user.nodeSettings.pingInterval);
        };

        const updatePeers = () => {
            parentEpml
                .request("apiCall", {
                    url: `/peers`,
                })
                .then((res) => {
                    setTimeout(() => {
                        this.peers = res;
                    }, 1);
                });
                console.log(this.peers)
                setTimeout(updatePeers, this.config.user.nodeSettings.pingInterval);
        };

        const getNodeConfig = () => {
            parentEpml.request("getNodeConfig").then((res) => {
                setTimeout(() => {
                    this.nodeConfig = res;
                }, 1);
                let myNode = window.parent.reduxStore.getState().app.nodeConfig
                    .knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
                this.nodeDomain = myNode.domain + ":" + myNode.port;
            });

            setTimeout(getNodeConfig, 1000);
        };

        let configLoaded = false;
        parentEpml.ready().then(() => {
            parentEpml.subscribe("config", async c => {
                if (!configLoaded) {
                    setTimeout(getNodeUpTime, 1);
                    setTimeout(updatePeers, 1);
                    setTimeout(this.updateMintingAccounts, 1);
                    setTimeout(getNodeConfig, 1);
                    configLoaded = true;
                }
                this.config = JSON.parse(c);
            })
            parentEpml.subscribe('copy_menu_switch', async value => {
                if (value === 'false' && window.getSelection().toString().length !== 0) this.clearSelection();
            })
        });
        parentEpml.imReady();
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

    renderErr1Text() {
        return html`${translate("nodepage.nchange27")}`
    }

    renderErr2Text() {
        return html`${translate("nodepage.nchange28")}`
    }

    forceSyncPeer(peerAddress, rowIndex) {
        parentEpml
            .request("apiCall", {
                url: `/admin/forcesync?apiKey=${this.getApiKey()}`,
                method: "POST",
                body: peerAddress,
            })
            .then((res) => {
                let err3string = get("nodepage.nchange25")
                parentEpml.request('showSnackBar', `${err3string}` + peerAddress);
            });
    }

    removePeer(peerAddress, rowIndex) {
        parentEpml
            .request("apiCall", {
                url: `/peers?apiKey=${this.getApiKey()}`,
                method: "DELETE",
                body: peerAddress,
            })
            .then((res) => {
                let err4string = get("nodepage.nchange26")
                parentEpml.request('showSnackBar', `${err4string}` + peerAddress);
                this.peers.splice(rowIndex, 1);
            });
    }

    stopNode() {
        parentEpml
            .request("apiCall", {
                url: `/admin/stop?apiKey=${this.getApiKey()}`,
                method: "GET"
            })
            .then((res) => {
				let err7string = get("nodepage.nchange32")
                parentEpml.request('showSnackBar', `${err7string}`);
            });
    }

    onPageNavigation(pageUrl) {
        parentEpml.request("setPageUrl", pageUrl);
    }

    addPeer(e) {
        this.addPeerLoading = true;
        const addPeerAddress = this.shadowRoot.querySelector("#addPeerAddress")
            .value;

        parentEpml
            .request("apiCall", {
                url: `/peers?apiKey=${this.getApiKey()}`,
                method: "POST",
                body: addPeerAddress,
            })
            .then((res) => {
                this.addPeerMessage = res.message;
                this.addPeerLoading = false;
            });
    }

    addMintingAccount(e) {
        this.addMintingAccountLoading = true;
        this.addMintingAccountMessage = "Loading...";

        this.addMintingAccountKey = this.shadowRoot.querySelector(
            "#addMintingAccountKey"
        ).value;

        parentEpml
            .request("apiCall", {
                url: `/admin/mintingaccounts?apiKey=${this.getApiKey()}`,
                method: "POST",
                body: this.addMintingAccountKey,
            })
            .then((res) => {
                if (res === true) {
                    this.updateMintingAccounts();
                    this.addMintingAccountKey = "";
                    this.addMintingAccountMessage = this.renderErr1Text();
                    this.addMintingAccountLoading = false;
                } else {
                    this.addMintingAccountKey = "";
                    this.addMintingAccountMessage = this.renderErr2Text(); // Corrected an error here thanks to crow (-_-)
                    this.addMintingAccountLoading = false;
                }
            });
    }

    updateMintingAccounts() {
        parentEpml.request("apiCall", {
            url: `/admin/mintingaccounts`,
        }).then((res) => {
            setTimeout(() => this.mintingAccounts = res, 1);
        });
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

    removeMintingAccount(publicKey) {
        this.removeMintingAccountLoading = true;

        parentEpml.request("apiCall", {
            url: `/admin/mintingaccounts?apiKey=${this.getApiKey()}`,
            method: "DELETE",
            body: publicKey,
        }).then((res) => {
            if (res === true) {
                this.updateMintingAccounts();
                this.removeMintingAccountLoading = false;
                let err5string = get("nodepage.nchange29")
                parentEpml.request('showSnackBar', `${err5string}`);
            } else {
                this.removeMintingAccountLoading = false;
                let err6string = get("nodepage.nchange30")
                parentEpml.request('showSnackBar', `${err6string}`);
            }
        });
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

    isEmptyArray(arr) {
        if (!arr) return true;
        return arr.length === 0;
    }
}

window.customElements.define("node-management", NodeManagement);
