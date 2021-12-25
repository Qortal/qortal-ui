import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'

import '@polymer/paper-toast'
import '@material/mwc-icon-button'

class WalletProfile extends connect(store)(LitElement) {
    static get properties() {
        return {
            wallet: { type: Object },
            nodeConfig: { type: Object },
            accountInfo: { type: Object }
        }
    }

    static get styles() {
        return [
            css`
            `
        ]
    }

    constructor() {
        super()
        this.nodeConfig = {}
        this.accountInfo = {
            names: [],
            addressInfo: {}
        }
    }

    render() {
        return html`
            <style>
                #profileInMenu {
                    padding: 12px;
                    border-top: 1px solid rgb(238, 238, 238);
                    background: rgb(255, 255, 255);
                }
                #profileInMenu:hover {
                    /* cursor:pointer; */
                }
                #accountIcon {
                    font-size:48px;
                    color: var(--mdc-theme-primary);
                    display: inline-block;
                }
                #accountName {
                    margin: 0;
                    font-size: 18px;
                    font-weight:500;
                    display: inline-block;
                    width:100%;
                    padding-bottom:8px;
                }
                #blocksMinted {
                    margin:0;
                    margin-top: 0;
                    font-size: 11px;
                    color: #03a9f4;
                }
                #address {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;

                    margin:0;
                    margin-top:8px;
                    font-size:11px;
                    /* padding-top:8px; */
                }
            </style>


            <div id="profileInMenu">
                <div style="padding: 8px 0;">
                    <span id="accountName">
                        ${this.accountInfo.names.length !== 0 ? this.accountInfo.names[0].name : ''}
                    </span>
                    ${this.accountInfo.addressInfo ? html`<span style="margin-bottom: 8px; display: inline-block; font-size: 14px;">Minter Level - <span style="color: #03a9f4;">${this.accountInfo.addressInfo.level} ${this.accountInfo.addressInfo.flags === 1 ? html`<strong>(F)</strong>` : ''}</span>` : ''}
                    <p id="blocksMinted">Blocks Minted - ${this.accountInfo.addressInfo.blocksMinted + this.accountInfo.addressInfo.blocksMintedAdjustment}</p>
                    <p id="address">${this.wallet.addresses[0].address}</p>
                </div>
            </div>
            <paper-toast id="toast" horizontal-align="right" vertical-align="top" vertical-offset="64"></paper-toast>
        `
    }

    firstUpdated() {

        const container = document.body.querySelector('main-app').shadowRoot.querySelector('app-view').shadowRoot;
        const toast = this.shadowRoot.getElementById('toast')
        const isMobile = window.matchMedia(`(max-width: ${getComputedStyle(document.body).getPropertyValue('--layout-breakpoint-tablet')})`).matches

        if (isMobile) {
            toast.verticalAlign = 'bottom'
            toast.verticalOffset = 0
        }
        this.toast = container.appendChild(toast)
    }

    stateChanged(state) {
        this.wallet = state.app.wallet
        this.nodeConfig = state.app.nodeConfig
        this.accountInfo = state.app.accountInfo
    }
}

window.customElements.define('wallet-profile', WalletProfile)
