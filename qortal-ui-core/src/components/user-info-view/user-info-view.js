import { LitElement, html, css } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store.js'
import { doLogout } from '../../redux/app/app-actions.js'
import { translate, translateUnsafeHTML } from 'lit-translate'

import '@polymer/paper-dialog/paper-dialog.js'
import '@material/mwc-button'

class UserInfoView extends connect(store)(LitElement) {
    static get properties() {
        return {
            theme: { type: String, reflect: true },
            infoAccountName: { type: String },
            imageUrl: { type: String },
            addressResult: { type: Array },
            nameAddressResult: { type: Array },
            displayAddress: { type: String },
            displayLevel: { type: String },
            displayBalance: { type: String }
        }
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --mdc-theme-secondary: var(--mdc-theme-primary);
                --mdc-theme-surface: var(--white);
                --mdc-dialog-content-ink-color: var(--black);
                box-sizing: border-box;
            }

            h2 {
                margin: 10px 0;
            }

            h4 {
                margin: 5px 0;
            }

            p {
                font-size: 14px;
                line-height: 21px;
            }

            .card-body {
                background-color: var(--white);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                min-height: 100vh;
                margin: 0;
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

            .card-container .level {
                color: #ffffff;
                background-color: #03a9f4;
                border-radius: 3px;
                font-size: 14px;
                font-weight: bold;
                padding: 3px 7px;
                position: absolute;
                top: 30px;
                left: 30px;
            }

            .card-container .founder {
                color: #ffffff;
                background-color: #03a9f4;
                border-radius: 3px;
                font-size: 14px;
                font-weight: bold;
                padding: 3px 7px;
                position: absolute;
                top: 30px;
                right: 30px;
            }

            .card-container .round {
                width: 96px;
                height: 96px;
                border: 1px solid #03a9f4;
                border-radius: 50%;
                padding: 2px;
            }

            .card-container .badge {
                width: 200px;
                height: 135px;
                border: 1px solid transparent;
                border-radius: 10%;
                padding: 2px;
            }

            .userdata {
                background-color: #1F1A36;
                text-align: left;
                padding: 15px;
                margin-top: 30px;
            }

            .userdata ul {
                list-style-type: none;
                margin: 0;
                padding: 0;
            }

            .userdata ul li {
                border: 1px solid #2D2747;
                border-radius: 2px;
                display: inline-block;
                font-size: 12px;
                margin: 0 7px 7px 0;
                padding: 7px;
            }

            .decline {
                --mdc-theme-primary: var(--mdc-theme-error)
            }

            .buttons {
                text-align:right;
            }

        `
    }

    constructor() {
        super()
        this.infoAccountName = ''
        this.imageUrl = ''
        this.addressResult = []
        this.nameAddressResult = []
        this.displayAddress = ''
        this.displayLevel = ''
        this.displayBalance = ''
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    render() {
        return html`
            <paper-dialog style="background: var(--white); border: 1px solid var(--black); border-radius: 5px;" id="userInfoDialog" modal>
                <div class="card-container">
                    <span class="level">${translate("mintingpage.mchange27")} ${this.displayLevel}</span>
                    ${this.founderBadge()}
                    ${this.avatarImage()}
                    <h2>${this.infoAccountName}</h2>
                    <h4>${this.displayAddress}</h4>
                    <p>${translate("explorerpage.exp2")}: ${this.displayBalance} QORT</p>
                </div>
                <div class="buttons">
                    <mwc-button @click=${() => this.openMoreInfoDialog()}>${translate("explorerpage.exp3")}</mwc-button>
                    <mwc-button class='decline' @click=${() => this.closeInfoDialog()} dialog-dismiss>${translate("general.close")}</mwc-button>
                </div>
            </paper-dialog>

            <paper-dialog style="background: var(--white); border: 1px solid var(--black); border-radius: 5px;" id="userErrorDialog" modal>
                <div class="card-container">
                    <img class="badge" src="/img/notfound.png" />
                    <h2>${translate("explorerpage.exp4")}</h2>
                    <h4>${translate("explorerpage.exp5")}</h4>
                </div>
                <div class="buttons">
                    <mwc-button class='decline' @click=${() => this.closeErrorDialog()} dialog-dismiss>${translate("general.close")}</mwc-button>
                </div>
            </paper-dialog>
        `
    }

    openUserInfo(userData) {
        if (userData.startsWith('Q') && userData.length == 34) {
            this.getAddressUserResult(userData)
        } else {
            this.getNameUserResult(userData)
        }
    }

    async getAddressUserResult(resultAddress) {
        const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const addressUrl = `${nodeUrl}/addresses/${resultAddress}`

        await fetch(addressUrl).then(res => {
            if (res.status === 400) {
                this.shadowRoot.getElementById('userErrorDialog').open()
            } else {
                this.getAllWithAddress(resultAddress)
            }
        })
    }

    async getNameUserResult(resultName) {
        const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const nameUrl = `${nodeUrl}/names/${resultName}`

        await fetch(nameUrl).then(res => {
            if (res.status === 404) {
                this.shadowRoot.getElementById('userErrorDialog').open()
            } else {
                this.getAddressFromName(resultName)
            }
        })
    }

    async getAddressFromName(fromName) {
        const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const fromNameUrl = `${nodeUrl}/names/${fromName}`

        const qortalNameInfo = await fetch(fromNameUrl).then(response => {
            return response.json()
        })

        this.nameAddressResult = qortalNameInfo
        const nameAddress = this.nameAddressResult.owner
        this.getAllWithAddress(nameAddress)
    }

    async getAllWithAddress(myAddress) {
        await this.getAddressUserInfo(myAddress)
        await this.getAddressUserAvatar(myAddress)
        await this.getAddressUserBalance(myAddress)
        this.displayAddress = this.addressResult.address
        this.displayLevel = this.addressResult.level
        this.shadowRoot.getElementById('userInfoDialog').open()
    }

    async getAddressUserInfo(infoAddress) {
        const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const infoAddressUrl = `${nodeUrl}/addresses/${infoAddress}`

        const qortalAddressInfo = await fetch(infoAddressUrl).then(response => {
            return response.json()
        })

        this.addressResult = qortalAddressInfo
    }

    async getAddressUserAvatar(avatarAddress) {
        const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const nameUrl = `${nodeUrl}/names/address/${avatarAddress}?limit=0&reverse=true`

        await fetch(nameUrl).then(res => {
            return res.json()
        }).then(jsonRes => {
            if(jsonRes.length) {
                jsonRes.map (item => {
                    this.infoAccountName = item.name
                    this.imageName = item.name
                })
            } else {
                this.infoAccountName = "No registered name"
                this.imageName = avatarAddress
            }
        })

        const myImageUrl = `${nodeUrl}/arbitrary/THUMBNAIL/${this.imageName}/qortal_avatar?async=true&apiKey=${this.getApiKey()}`
        this.imageUrl = myImageUrl
    }

    async getAddressUserBalance(balanceAddress) {
        const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const balanceAddressUrl = `${nodeUrl}/addresses/balance/${balanceAddress}`

        const qortalBalanceInfo = await fetch(balanceAddressUrl).then(res => {
            return res.json()
        })

        this.displayBalance = qortalBalanceInfo
    }

    avatarImage() {
       return html`<img class="round" src="${this.imageUrl}" onerror="this.src='/img/incognito.png';" />`
    }

    founderBadge() {
       if (this.addressResult.flags === 1) {
           return html`<span class="founder">${translate("explorerpage.exp6")}</span>`
       } else {
           return html``
       }
    }

    openMoreInfoDialog() {
        this.shadowRoot.getElementById('userErrorDialog').open()
    }

    closeInfoDialog() {
        this.shadowRoot.getElementById('userInfoDialog').close()
    }

    closeErrorDialog() {
        this.shadowRoot.getElementById('userErrorDialog').close()
    }

    getApiKey() {
        const apiNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node];
        let apiKey = apiNode.apiKey;
        return apiKey;
    }
}

window.customElements.define('user-info-view', UserInfoView)