import {css, html, LitElement} from 'lit'
import {Epml} from '../../../../epml.js'

import '@polymer/paper-spinner/paper-spinner-lite.js'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class GroupTransaction extends LitElement {
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
            selectedAddress: { type: Object }
        }
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --paper-input-container-focus-color: var(--mdc-theme-primary);
            }

            paper-spinner-lite{
                height: 24px;
                width: 24px;
                --paper-spinner-color: var(--mdc-theme-primary);
                --paper-spinner-stroke-width: 2px;
            }

            #group-transaction-page {
                background:#fff;
            }

            mwc-textfield {
                width:100%;
            }

            .red {
                --mdc-theme-primary: red;
            }

            .red-button {
                --mdc-theme-primary: red;
                --mdc-theme-on-primary: white;
            }

            mwc-button.red-button {
                --mdc-theme-primary: red;
                --mdc-theme-on-primary: white;
            }

            .group-transaction-card {
                padding:12px 24px;
                background:#fff;
                border-radius:2px;
                box-shadow: 11;
            }

            h2 {
                margin:0;
            }

            h2, h3, h4, h5 {
                color:#333;
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
        this.addMintingAccountKey = ''
        this.removeMintingAccountKey = ''
        this.addPeerMessage = ''
        this.confPeerMessage = ''
        this.addMintingAccountMessage = ''
        this.removeMintingAccountMessage = ''
        this.tempMintingAccount = {}
        this.selectedAddress = {}
        this.config = {
            user: {
                node: {

                }
            }
        }
    }

    render() {
        return html`
            <div id="group-transaction-page">
                <div class="group-transaction-card">
                    <h2>Group Transaction</h2>
                    <p>${this.addMintingAccountMessage}</p>
                </div>
            </div>
        `
    }

    firstUpdated() {

        const getGroupIdFromURL = () => {
            let tempUrl = document.location.href
            let decodeTempUrl = decodeURI(tempUrl)
            let splitedUrl = decodeTempUrl.split('?')
			this.addMintingAccountMessage = splitedUrl[1]
        }

        getGroupIdFromURL()

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
                    // setTimeout(getGroupIdFromURL, 1)
                    configLoaded = true
                }
                this.config = JSON.parse(c)
            })
        })

        parentEpml.imReady()
    }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }
}

window.customElements.define('group-transaction', GroupTransaction)
