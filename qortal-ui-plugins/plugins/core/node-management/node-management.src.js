import { LitElement, html, css } from "lit-element";
import { render } from 'lit-html'
import { Epml } from "../../../epml.js";

import "@polymer/paper-spinner/paper-spinner-lite.js";
import "@vaadin/vaadin-grid/vaadin-grid.js";
import "@vaadin/vaadin-grid/theme/material/all-imports.js";
import "@material/mwc-icon";
import "@material/mwc-textfield";
import "@material/mwc-button";
import "@material/mwc-dialog";

const parentEpml = new Epml({ type: "WINDOW", source: window.parent });

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
    };
  }

  static get styles() {
    return css`
        * {
            --mdc-theme-primary: rgb(3, 169, 244);
            --paper-input-container-focus-color: var(--mdc-theme-primary);
        }

        paper-spinner-lite {
            height: 24px;
            width: 24px;
            --paper-spinner-color: var(--mdc-theme-primary);
            --paper-spinner-stroke-width: 2px;
        }

        #node-management-page {
            background: #fff;
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
            /* margin:12px; */
            padding: 12px 24px;
            background: #fff;
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
            color: #333;
            font-weight: 400;
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
  }

  render() {
    return html`
      <div id="node-management-page">
        <div class="node-card">
          <h2>Node management for: ${this.nodeDomain}</h2>
          <span><br />Node has been online for: ${this.upTime}</span>
          
          <br /><br />
          <div id="minting">
            <div style="min-height:48px; display: flex; padding-bottom: 6px;">
              <h3
                style="margin: 0; flex: 1; padding-top: 8px; display: inline;"
              >
                Node's minting accounts
              </h3>
              <mwc-button
                style="float:right;"
                @click=${() =>
                  this.shadowRoot
                    .querySelector("#addMintingAccountDialog")
                    .show()}
                ><mwc-icon>add</mwc-icon>Add minting account</mwc-button
              >
            </div>

            <!-- Add Minting Account Dialog -->
            <mwc-dialog
              id="addMintingAccountDialog"
              scrimClickAction="${this.addMintingAccountLoading ? "" : "close"}"
            >
              <div>
                If you would like to mint with your own account you will need to
                create a rewardshare transaction to yourself (with rewardshare
                percent set to 0), and then mint with the rewardshare key it
                gives you.
              </div>
              <br />
              <mwc-textfield
                ?disabled="${this.addMintingAccountLoading}"
                label="Rewardshare key"
                id="addMintingAccountKey"
              ></mwc-textfield>
              <div
                style="text-align:right; height:36px;"
                ?hidden=${this.addMintingAccountMessage === ""}
              >
                <span ?hidden="${this.addMintingAccountLoading}">
                  ${this.addMintingAccountMessage} &nbsp;
                </span>
                <span ?hidden="${!this.addMintingAccountLoading}">
                  <!-- loading message -->
                  Doing something delicious &nbsp;
                  <paper-spinner-lite
                    style="margin-top:12px;"
                    ?active="${this.addMintingAccountLoading}"
                    alt="Adding minting account"
                  ></paper-spinner-lite>
                </span>
              </div>
              <mwc-button
                ?disabled="${this.addMintingAccountLoading}"
                slot="primaryAction"
                @click=${this.addMintingAccount}
              >
                Add
              </mwc-button>
              <mwc-button
                ?disabled="${this.addMintingAccountLoading}"
                slot="secondaryAction"
                dialogAction="cancel"
                class="red"
              >
                Close
              </mwc-button>
            </mwc-dialog>

            <vaadin-grid id="mintingAccountsGrid" style="height:auto;" ?hidden="${this.isEmptyArray(this.mintingAccounts)}" aria-label="Minting Accounts" .items="${this.mintingAccounts}" height-by-rows>
              	<vaadin-grid-column auto-width header="Minting Account" path="mintingAccount"></vaadin-grid-column>
              	<vaadin-grid-column auto-width header="Recipient Account" path="recipientAccount"></vaadin-grid-column>
                <vaadin-grid-column  width="12em" header="Action" .renderer=${(root, column, data) => {
                    render(html`<mwc-button class="red" ?disabled=${this.removeMintingAccountLoading} @click=${() => this.removeMintingAccount(data.item.publicKey)}><mwc-icon>create</mwc-icon>Remove</mwc-button>`, root)
                }}></vaadin-grid-column>
            </vaadin-grid>

            ${this.isEmptyArray(this.mintingAccounts) ? html` No minting accounts found for this node ` : ""}
          </div>

          <br />
          <div id="peers">
            <div style="min-height: 48px; display: flex; padding-bottom: 6px;">
              <h3 style="margin: 0; flex: 1; padding-top: 8px; display: inline;">
                <span>Peers connected to node</span>
                <span>(${this.peers.length})</span>
              </h3>
              <mwc-button @click=${() => this.shadowRoot.querySelector("#addPeerDialog").show()}><mwc-icon>add</mwc-icon>Add peer</mwc-button>
            </div>

            <mwc-dialog id="addPeerDialog" scrimClickAction="${this.addPeerLoading ? "" : "close"}">
              <div>Type the peer you wish to add's address below</div>
              <br />
              <mwc-textfield ?disabled="${this.addPeerLoading}" label="Peer Address" id="addPeerAddress" ></mwc-textfield>
              <div style="text-align:right; height:36px;" ?hidden=${this.addPeerMessage === ""}>
                <span ?hidden="${this.addPeerLoading}"> ${this.addPeerMessage} &nbsp;</span>
                <span ?hidden="${!this.addPeerLoading}">
                  <paper-spinner-lite
                    style="margin-top:12px;"
                    ?active="${this.addPeerLoading}"
                    alt="Adding minting account"
                  ></paper-spinner-lite>
                </span>
              </div>
              <mwc-button
                ?disabled="${this.addPeerLoading}"
                @click="${this.addPeer}"
                slot="primaryAction"
              >
                Add
              </mwc-button>
              <mwc-button
                slot="secondaryAction"
                dialogAction="cancel"
                ?disabled="${this.addPeerLoading}"
                class="red"
              >
                Close
              </mwc-button>
            </mwc-dialog>

            <vaadin-grid id="peersGrid" style="height:auto;" ?hidden="${this.isEmptyArray(this.peers)}" aria-label="Peers" .items="${this.peers}" height-by-rows>
                <vaadin-grid-column path="address"></vaadin-grid-column>
                <vaadin-grid-column path="lastHeight"></vaadin-grid-column>
                <vaadin-grid-column path="version" header="Build Version"></vaadin-grid-column>
                <vaadin-grid-column path="age" header="Connected for"></vaadin-grid-column>
				        <vaadin-grid-column  width="12em" header="Action" .renderer=${(root, column, data) => {
                    render(html`<mwc-button class="red" @click=${() => this.removePeer(data.item.address, data.index)}><mwc-icon>delete</mwc-icon>Remove</mwc-button><mwc-button class="green" @click=${() => this.forceSyncPeer(data.item.address, data.index)}>Force Sync</mwc-button>`, root)
                }}></vaadin-grid-column>
            </vaadin-grid>

            ${this.isEmptyArray(this.peers) ? html` Node has no connected peers ` : ""}
          </div>
          <br />
        </div>
      </div>
    `;
  }
	
  forceSyncPeer (peerAddress, rowIndex) {
    parentEpml
      .request("apiCall", {
        url: `/admin/forcesync`,
        method: "POST",
        body: peerAddress,
      })
      .then((res) => {
        parentEpml.request('showSnackBar', "Starting Sync with Peer: " + peerAddress );
      });
  }
	
  removePeer(peerAddress, rowIndex) {
    parentEpml
      .request("apiCall", {
        url: `/peers`,
        method: "DELETE",
        body: peerAddress,
      })
      .then((res) => {
        parentEpml.request('showSnackBar', "Successfully removed Peer: " + peerAddress );
        this.peers.splice(rowIndex, 1);
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
        url: `/peers`,
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
        url: `/admin/mintingaccounts`,
        method: "POST",
        body: this.addMintingAccountKey,
      })
      .then((res) => {
        if (res === true) {
          this.updateMintingAccounts();
          this.addMintingAccountKey = "";
          this.addMintingAccountMessage = "Minting Node Added Successfully!";
          this.addMintingAccountLoading = false;
        } else {
          this.addMintingAccountKey = "";
          this.addMintingAccountMessage = "Failed to Add Minting Node!"; // Corrected an error here thanks to crow (-_-)
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
            url: `/admin/mintingaccounts`,
            method: "DELETE",
            body: publicKey,
        }).then((res) => {
            if (res === true) {
                this.updateMintingAccounts();
                this.removeMintingAccountLoading = false;
                parentEpml.request('showSnackBar', "Successfully Removed Minting Account!");
            } else {
                this.removeMintingAccountLoading = false;
                parentEpml.request('showSnackBar', "Failed to Remove Minting Account!");
            }
        });
	}

  firstUpdated() {

    // Call updateMintingAccounts
    this.updateMintingAccounts();

    window.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      this._textMenu(event)
    });
    window.addEventListener("click", () => {
      parentEpml.request('closeCopyTextMenu', null)
    });
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
