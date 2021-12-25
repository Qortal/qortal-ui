/**
 * CrossChain - DELETE TradeOffer 
 * 
 * These are special types of transactions (JSON ENCODED)
 */

export default class DeleteTradeOffer {
    constructor() {
        // ...
    }

    createTransaction(txnReq) {

        this.creatorPublicKey(txnReq.creatorPublicKey)

        this.atAddress(txnReq.atAddress)

        return this.txnRequest()
    }

    creatorPublicKey(creatorPublicKey) {

        this._creatorPublicKey = creatorPublicKey

    }

    atAddress(atAddress) {

        this._atAddress = atAddress
    }

    txnRequest() {

        return {
            creatorPublicKey: this._creatorPublicKey,
            atAddress: this._atAddress
        }
    }
}
