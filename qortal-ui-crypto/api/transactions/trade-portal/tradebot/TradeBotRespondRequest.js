/**
 * CrossChain - TradeBot Respond Request (Buy Action)
 * 
 * These are special types of transactions (JSON ENCODED)
 */

export default class TradeBotRespondRequest {
    constructor() {
        // ...
    }

    createTransaction(txnReq) {

        this.atAddress(txnReq.atAddress)

        this.foreignKey(txnReq.foreignKey)

        this.receivingAddress(txnReq.receivingAddress)

        return this.txnRequest()
    }

    atAddress(atAddress) {

        this._atAddress = atAddress
    }

    foreignKey(foreignKey) {
        this._foreignKey = foreignKey
    }

    receivingAddress(receivingAddress) {

        this._receivingAddress = receivingAddress
    }

    txnRequest() {

        return {
            atAddress: this._atAddress,
            foreignKey: this._foreignKey,
            receivingAddress: this._receivingAddress
        }
    }
}
