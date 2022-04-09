import { LitElement, html, css } from 'lit';
import { connect } from 'pwa-helpers';
import { store } from '../../store.js';
import { translate, translateUnsafeHTML } from 'lit-translate'

class AccountView extends connect(store)(LitElement) {
    static get properties() {
        return {
            accountInfo: { type: Object },
            theme: { type: String, reflect: true }
        }
    }

    static get styles() {
        return css`

            .sub-main {
                position: relative;
                text-align: center;
            }

            .center-box {
                position: relative;
                top: 45%;
                left: 50%;
                transform: translate(-50%, 0%);
                text-align: center;
            }

            .img-icon {
                display: block;
                margin-top: 10px;
            }

            .content-box {
                border: 1px solid #a1a1a1;
                padding: 10px 25px;
                text-align: left;
                display: inline-block;
            }

            .title {
                font-weight: 600;
                font-size: 15px;
                display: block;
                line-height: 32px;
                opacity: 0.66;
            }

            .value {
                font-size: 16px;
                display: inline-block;
            }

            #accountName {
                margin: 0;
                font-size: 24px;
                font-weight:500;
                display: inline-block;
                width:100%;
            }
        `
    }

    constructor() {
        super()
        this.accountInfo = { names: [], addressInfo: {} }
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    render() {
        return html`
            <div class="sub-main">
                <div class="center-box">
                    <div class="img-icon">${this.getAvatar()}</div>
                    <span id="accountName">
                        ${this.accountInfo.names.length !== 0 ? this.accountInfo.names[0].name : 'No Registered Name'}
                    </span>
                    <div class="content-box">
                        <span class="title">${translate("settings.address")}: </span>
                        <span class="value">${store.getState().app.selectedAddress.address}</span>
                        <br/>
                        <span class="title">${translate("settings.publickey")}: </span>
                        <span class="value">${store.getState().app.selectedAddress.base58PublicKey}</span>
                    </div>
                </div>
            </div>
        `
    }

    stateChanged(state) {
        this.accountInfo = state.app.accountInfo
    }

    getAvatar() {
        let numberBlocks = (this.accountInfo.addressInfo.blocksMinted + this.accountInfo.addressInfo.blocksMintedAdjustment);
        if (Number.isNaN(numberBlocks) || numberBlocks == "" || numberBlocks === null) {
            return html`<img src="/img/noavatar.png" style="width:150px; height:150px;">`
        } else {
            const avatarNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
            const avatarUrl = avatarNode.protocol + '://' + avatarNode.domain + ':' + avatarNode.port
            const url = `${avatarUrl}/arbitrary/THUMBNAIL/${this.accountInfo.names[0].name}/qortal_avatar?async=true&apiKey=${this.getApiKey()}`
            return html`<img src="${url}" style="width:150px; height:150px;" onerror="this.src='/img/noavatar.png';">`
        }
    }

    getApiKey() {
        const apiNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node];
        let apiKey = apiNode.apiKey;
        return apiKey;
    }
}

window.customElements.define('account-view', AccountView)
