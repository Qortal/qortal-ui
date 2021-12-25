import { LitElement, html, css } from 'lit-element'
// import { render } from 'lit-html'
// import { Epml } from '../../../src/epml.js'
import { Epml } from '../../../../epml.js'

import '@polymer/paper-spinner/paper-spinner-lite.js'

// import * as thing from 'time-elements'
// import '@vaadin/vaadin-grid/vaadin-grid.js'
// import '@vaadin/vaadin-grid/theme/material/all-imports.js'

// import '@material/mwc-icon'
// import '@material/mwc-textfield'
// import '@material/mwc-button'
// import '@material/mwc-dialog'

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
                /* margin:12px; */
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

    // getMintingAccountGrid() {

    //     const myGrid = this.shadowRoot.querySelector('#mintingAccountsGrid')

    //     myGrid.addEventListener('click', (e) => {
    //         this.tempMintingAccount = myGrid.getEventContext(e).item

    //         this.shadowRoot.querySelector('#removeMintingAccountDialog').show()
    //     })

    // }


    // addPeer(e) {
    //     this.addPeerLoading = true
    //     const addPeerAddress = this.shadowRoot.querySelector('#addPeerAddress').value

    //     parentEpml.request('apiCall', {
    //         url: `/peers`,
    //         method: 'POST',
    //         body: addPeerAddress
    //     }).then(res => {
    //         this.addPeerMessage = res.message

    //         this.addPeerLoading = false
    //     })

    // }


    // addMintingAccount(e) {
    //     this.addMintingAccountLoading = true
    //     this.addMintingAccountMessage = "Loading..."

    //     this.addMintingAccountKey = this.shadowRoot.querySelector('#addMintingAccountKey').value

    //     parentEpml.request('apiCall', {
    //         url: `/admin/mintingaccounts`,
    //         method: 'POST',
    //         body: this.addMintingAccountKey
    //     }).then(res => {
    //         if (res === true) {
    //             this.updateMintingAccounts()
    //             this.addMintingAccountKey = ''
    //             this.addMintingAccountMessage = 'Minting Node Added Successfully!'
    //             this.addMintingAccountLoading = false
    //         } else {
    //             this.addMintingAccountKey = ''
    //             this.addMintingAccountMessage = 'Failed to Add Minting Node!' // Corrected an error here thanks to crow (-_-)
    //             this.addMintingAccountLoading = false
    //         }
    //     })
    // }

    // updateMintingAccounts() {
    //     parentEpml.request('apiCall', {
    //         url: `/admin/mintingaccounts`
    //     }).then(res => {

    //         this.mintingAccounts = []
    //         setTimeout(() => { this.mintingAccounts = res }, 1)
    //     })

    //     // setTimeout(updateMintingAccounts, this.config.user.nodeSettings.pingInterval) // Perhaps should be slower...?
    // }

    // removeMintingAccount(e) {
    //     this.removeMintingAccountLoading = true
    //     this.removeMintingAccountMessage = "Loading..."

    //     this.removeMintingAccountKey = this.shadowRoot.querySelector('#removeMintingAccountKey').value

    //     this.mintingAccounts.forEach(mintingAccount => {
    //         if (this.tempMintingAccount.recipientAccount === mintingAccount.recipientAccount) {

    //             parentEpml.request('apiCall', {
    //                 url: `/admin/mintingaccounts`,
    //                 method: 'DELETE',
    //                 body: this.removeMintingAccountKey
    //             }).then(res => {
    //                 if (res === true) {
    //                     this.updateMintingAccounts()
    //                     this.removeMintingAccountKey = ''
    //                     this.removeMintingAccountMessage = 'Minting Node Removed Successfully!'
    //                     this.removeMintingAccountLoading = false
    //                 } else {
    //                     this.removeMintingAccountKey = ''
    //                     this.removeMintingAccountMessage = 'Failed to Remove Minting Node!'
    //                     this.removeMintingAccountLoading = false
    //                 }
    //             })
    //         }
    //     })

    // }

    firstUpdated() {

        // Call getMintingAccountGrid
        // this.getMintingAccountGrid()

        // Call updateMintingAccounts
        // this.updateMintingAccounts()

        const getGroupIdFromURL = () => {
            let tempUrl = document.location.href
            let decodeTempUrl = decodeURI(tempUrl)
            let splitedUrl = decodeTempUrl.split('?')
            let myGroupId = splitedUrl[1]
            this.addMintingAccountMessage = myGroupId
            console.log(myGroupId);
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
