import {html, LitElement} from 'lit'
import {Epml} from '../../../epml.js'
import {get, translate} from '../../../../core/translate'
import {tradeInfoViewStyle} from './TradeInfoView-css.js'
import './TraderInfoView.js'
import '@polymer/paper-dialog/paper-dialog.js'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class TradeInfoView extends LitElement {
    static get properties() {
        return {
            sellerAddress: { type: String },
            buyerAddress: { type: String },
            sellqortAmount: { type: Number },
            buyforeignAmount: { type: Number },
            tradeTime: { type: String },
            coinCode: { type: String },
            addressSellerResult: { type: Array },
            addressBuyerResult: { type: Array },
            sellerImage: { type: String },
            infoSellerName: { type: String },
            buyerImage: { type: String },
            infoBuyerName: { type: String },
            priceEach: { type: Number },
            atAddress: { type: String },
            isLoadingCompleteInfo: { type: Boolean },
            theme: { type: String, reflect: true }
        }
    }

    static get styles() {
        return [tradeInfoViewStyle]
    }

    constructor() {
        super()
        this.sellerAddress = ''
        this.buyerAddress = ''
        this.sellqortAmount = 0
        this.buyforeignAmount = 0
        this.tradeTime = ''
        this.coinCode = ''
        this.addressSellerResult = []
        this.addressBuyerResult = []
        this.sellerImage = ''
        this.infoSellerName = ''
        this.buyerImage = ''
        this.infoBuyerName = ''
        this.priceEach = 0
        this.atAddress = ''
        this.isLoadingCompleteInfo = false
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    render() {
        return html`
            <paper-dialog class="pds" id="tradeInfoDialog" modal>
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">${translate("info.inf19")}</h4>
                    </div>
                    <div class="card-body">
                        <div class="d-sm-flex align-items-center justify-content-between">
                            <div class="d-flex mb-3">
                                ${this.avatarSellerImage()}
                                <div class="ms-3">
                                    <p class="fw-bold cfs-18 red">${translate("tradepage.tchange13")}</p>
                                    <p class="fw-bold cfs-18">${this.infoSellerName}</p>
                                    <span class="get-user-info cfs-14" @click="${() => this.requestUserInfo(this.sellerAddress)}">${this.sellerAddress}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    <p class="cfs-14">${translate("explorerpage.exp6")}:&nbsp;${this.founderSellerStatus()}</p>
                                </div>
                            </div>
                            <div class="d-flex mb-3">
                                <div class="me-sm-3 ms-3 ms-sm-0 text-sm-end order-1 order-sm-0">
                                    <p class="fw-bold cfs-18 green">${translate("info.inf20")}</p>
                                    <p class="fw-bold cfs-18">${this.infoBuyerName}</p>
                                    <span class="get-user-info cfs-14" @click="${() => this.requestUserInfo(this.buyerAddress)}">&nbsp;&nbsp;&nbsp;&nbsp;${this.buyerAddress}</span>
                                    <p class="cfs-14">${translate("explorerpage.exp6")}:&nbsp;${this.founderBuyerStatus()}</p>
                                </div>
                                ${this.avatarBuyerImage()}
                            </div>
                        </div>
                        <div class="table-responsive mt-4">
                            <table class="table w-100 table-borderless cmw-30">
                                <tbody>
                                    <tr class="text-primary fw-bold cfs-16">
                                        <td>${translate("tradepage.tchange8")} ( QORT )</td>
                                        <td class="text-end">${this.sellqortAmount} QORT</td>
                                    </tr>
                                    <tr class="fw-bold cfs-16">
                                        <td>${translate("tradepage.tchange9")} ( ${this.coinCode} )</td>
                                        <td class="text-end">${this.priceEach} ${this.coinCode}</td>
                                    </tr>
                                    <tr class="fw-bold cfs-16">
                                        <td>${translate("tradepage.tchange10")} ( ${this.coinCode} )</td>
                                        <td class="text-end">${this.buyforeignAmount} ${this.coinCode}</td>
                                    </tr>
                                    <tr class="fw-bold cfs-16">
                                        <td>AT ${translate("settings.address")}</td>
                                        <td class="text-end">${this.atAddress}</td>
                                    </tr>
                                    <tr class="fw-bold cfs-16">
                                        <td>${translate("tradepage.tchange11")}</td>
                                        <td class="text-end">${this.tradeTime}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="buttons">
                    <span class="btn btn-sm btn-danger mt-2 px-3 border-0" @click="${() => this.closeTradeInfo()}" dialog-dismiss>${translate("general.close")}</span>
                </div>
            </paper-dialog>
            <trader-info-view></trader-info-view>
        `
    }

    async openTradeInfo(seller, buyer, qortAmount, foreignAmount, ata, time, coin) {
        this.sellerAddress = ''
        this.buyerAddress = ''
        this.sellqortAmount = 0
        this.buyforeignAmount = 0
        this.tradeTime = ''
        this.coinCode = ''
        this.priceEach = 0
        this.atAddress = ''
        this.shadowRoot.getElementById('tradeInfoDialog').open()
        this.isLoadingCompleteInfo = true
        this.sellerAddress = seller
        this.buyerAddress = buyer
        this.sellqortAmount = qortAmount
        this.buyforeignAmount = foreignAmount
        this.tradeTime = new Date(time).toLocaleString()
        this.coinCode = coin
        this.priceEach = this.round(parseFloat(foreignAmount) / parseFloat(qortAmount))
        this.atAddress = ata
        await this.getAddressSellerInfo(seller)
        await this.getAddressBuyerInfo(buyer)
        await this.getAddressSellerAvatar(seller)
        await this.getAddressBuyerAvatar(buyer)
        this.isLoadingCompleteInfo = false
    }

    closeTradeInfo() {
        this.shadowRoot.getElementById('tradeInfoDialog').close()
    }

    requestUserInfo(infoAddress) {
        let requestAddress = ''
        requestAddress = infoAddress
        const theUserInfoView = this.shadowRoot.querySelector('trader-info-view')
        theUserInfoView.openTraderInfo(requestAddress)
    }

    async getAddressSellerInfo(seller) {
        this.addressSellerResult = []
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const infoSellerAddressUrl = `${nodeUrl}/addresses/${seller}`

		this.addressSellerResult = await fetch(infoSellerAddressUrl).then(response => {
			return response.json()
		})
    }

    async getAddressBuyerInfo(buyer) {
        this.addressBuyerResult = []
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const infoBuyerAddressUrl = `${nodeUrl}/addresses/${buyer}`

		this.addressBuyerResult = await fetch(infoBuyerAddressUrl).then(response => {
			return response.json()
		})
    }

    async getAddressSellerAvatar(seller) {
        this.sellerImage = ''
        this.infoSellerName = ''
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const sellerNameUrl = `${nodeUrl}/names/address/${seller}?limit=0&reverse=true`

        await fetch(sellerNameUrl).then(res => {
            return res.json()
        }).then(jsonRes => {
            if(jsonRes.length) {
                jsonRes.map (item => {
                    this.infoSellerName = item.name
                    this.sellerImageName = item.name
                })
            } else {
                this.infoSellerName = get("chatpage.cchange15")
                this.sellerImageName = seller
            }
        })

		this.sellerImage = `${nodeUrl}/arbitrary/THUMBNAIL/${this.sellerImageName}/qortal_avatar?async=true&apiKey=${this.getApiKey()}`
    }

    async getAddressBuyerAvatar(buyer) {
        this.buyerImage = ''
        this.infoBuyerName = ''
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const buyerNameUrl = `${nodeUrl}/names/address/${buyer}?limit=0&reverse=true`

        await fetch(buyerNameUrl).then(res => {
            return res.json()
        }).then(jsonRes => {
            if(jsonRes.length) {
                jsonRes.map (item => {
                    this.infoBuyerName = item.name
                    this.buyerImageName = item.name
                })
            } else {
                this.infoBuyerName = get("chatpage.cchange15")
                this.buyerImageName = seller
            }
        })

		this.buyerImage = `${nodeUrl}/arbitrary/THUMBNAIL/${this.buyerImageName}/qortal_avatar?async=true&apiKey=${this.getApiKey()}`
    }

    avatarSellerImage() {
       return html`<img class="cwh-80 rounded" src="${this.sellerImage}" onerror="this.src='/img/incognito.png';" />`
    }

    avatarBuyerImage() {
       return html`<img class="cwh-80 rounded order-0 order-sm-1" src="${this.buyerImage}" onerror="this.src='/img/incognito.png';" />`
    }

    founderSellerStatus() {
       if (this.addressSellerResult.flags === 1) {
           return html`<span class="green">${translate("general.yes")}</span>`
       } else {
           return html`<span class="red">${translate("general.no")}</span>`
       }
    }

    founderBuyerStatus() {
       if (this.addressBuyerResult.flags === 1) {
           return html`<span class="green">${translate("general.yes")}</span>`
       } else {
           return html`<span class="red">${translate("general.no")}</span>`
       }
    }

    getApiKey() {
        const apiNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return apiNode.apiKey;
    }

    isEmptyArray(arr) {
        if (!arr) {
            return true
        }
        return arr.length === 0
    }

    round(number) {
		return (Math.round(parseFloat(number) * 1e8) / 1e8).toFixed(8)
    }
}

window.customElements.define('trade-info-view', TradeInfoView)
