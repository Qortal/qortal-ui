/**
 * CrossChain - TradeBot Create Request (Sell Action)
 * 
 * These are special types of transactions (JSON ENCODED)
 */

export default class TradeBotCreateRequest {
    constructor() {
        // ...
    }

    createTransaction(txnReq) {

        this.creatorPublicKey(txnReq.creatorPublicKey);

        this.qortAmount(txnReq.qortAmount);

        this.fundingQortAmount(txnReq.fundingQortAmount);

        this.foreignBlockchain(txnReq.foreignBlockchain);

        this.foreignAmount(txnReq.foreignAmount);

        this.tradeTimeout(txnReq.tradeTimeout);

        this.receivingAddress(txnReq.receivingAddress);

        return this.txnRequest();
    }

    creatorPublicKey(creatorPublicKey) {

        this._creatorPublicKey = creatorPublicKey;

    }

    qortAmount(qortAmount) {
        this._qortAmount = qortAmount;
    }


    fundingQortAmount(fundingQortAmount) {

        this._fundingQortAmount = fundingQortAmount;
    }

    foreignBlockchain(foreignBlockchain) {

        this._foreignBlockchain = foreignBlockchain;
    }

    foreignAmount(foreignAmount) {

        this._foreignAmount = foreignAmount;
    }

    tradeTimeout(tradeTimeout) {

        this._tradeTimeout = tradeTimeout;
    }

    receivingAddress(receivingAddress) {

        this._receivingAddress = receivingAddress;
    }

    txnRequest() {

        return {
            creatorPublicKey: this._creatorPublicKey,
            qortAmount: this._qortAmount,
            fundingQortAmount: this._fundingQortAmount,
            foreignBlockchain: this._foreignBlockchain,
            foreignAmount: this._foreignAmount,
            tradeTimeout: this._tradeTimeout,
            receivingAddress: this._receivingAddress
        }
    }
}
