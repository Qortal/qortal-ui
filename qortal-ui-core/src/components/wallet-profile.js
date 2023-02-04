import { LitElement, html, css } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
import { translate, translateUnsafeHTML } from 'lit-translate'

import '@polymer/paper-toast'
import '@material/mwc-icon-button'

class WalletProfile extends connect(store)(LitElement) {
    static get properties() {
        return {
            wallet: { type: Object },
            nodeConfig: { type: Object },
            accountInfo: { type: Object },
            imageUrl: { type: String },
            theme: { type: String, reflect: true }
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
        this.imageUrl = ''
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    render() {
        return html`
            <style>
                #profileInMenu {
                    padding: 12px;
                    border-top: var(--border);
                    background: var(--sidetopbar);
                    color: var(--black);
                }

                #profileInMenu:hover {
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
                    width:100%;
                    padding-bottom:8px;
                    display: flex;
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
                }

                .round-fullinfo {
                    position: relative;
                    width: 69px;
                    height: 69px;
                    border-radius: 50%;
                }

                .full-info-logo {
                    width: 69px;
                    height: 69px;
                    border-radius: 50%;
                }

                .inline-block-child {
                    flex: 1;
                }
            </style>


            <div id="profileInMenu">
                <div style="padding: 8px 0;">
                    <div id="accountName">
                        <div id="child inline-block-child" class="full-info-logo">${this.getAvatar()}</div>
                        &nbsp;&nbsp;&nbsp;
                        <div id="inline-block-child">
                            <div>${this.accountInfo.names.length !== 0 ? this.accountInfo.names[0].name : ''}</div>
                            <div>${this.accountInfo.addressInfo ? html`<span style="margin-bottom: 8px; display: inline-block; font-size: 14px;">${translate("walletprofile.minterlevel")} - <span style="color: #03a9f4;">${this.accountInfo.addressInfo.level} ${this.accountInfo.addressInfo.flags === 1 ? html`<strong>(F)</strong>` : ''}</span>` : ''}</div>
                            <p id="blocksMinted">${translate("walletprofile.blocksminted")} - ${this.accountInfo.addressInfo.blocksMinted + this.accountInfo.addressInfo.blocksMintedAdjustment}</p>
                        </div>
                    </div>
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

    async getAllWithAddress(myAddress) {
        await this.getAddressUserAvatar(myAddress)
    }

    getAvatar() {
        let numberBlocks = (this.accountInfo.addressInfo.blocksMinted + this.accountInfo.addressInfo.blocksMintedAdjustment);
        if (Number.isNaN(numberBlocks) || numberBlocks == "" || numberBlocks === null) {
            return html`<img class="round-fullinfo" src="/img/incognito.png">`
        } else {
            const avatarNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
            const avatarUrl = avatarNode.protocol + '://' + avatarNode.domain + ':' + avatarNode.port
            const url = `${avatarUrl}/arbitrary/THUMBNAIL/${this.accountInfo.names[0].name}/qortal_avatar?async=true&apiKey=${this.getApiKey()}`
            return html`<img class="round-fullinfo" src="${url}" onerror="this.src='/img/incognito.png';" />`
        }
    }

    getApiKey() {
        const apiNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node];
        let apiKey = apiNode.apiKey;
        return apiKey;
    }

    stateChanged(state) {
        this.wallet = state.app.wallet
        this.nodeConfig = state.app.nodeConfig
        this.accountInfo = state.app.accountInfo
    }
}

window.customElements.define('wallet-profile', WalletProfile)
