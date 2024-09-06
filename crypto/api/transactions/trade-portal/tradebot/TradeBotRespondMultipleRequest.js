/**
 * CrossChain - TradeBot Respond Multiple Request (Buy Action)
 *
 * These are special types of transactions (JSON ENCODED)
 */

export default class TradeBotRespondMultipleRequest {
	constructor() {
		// ...
	}

	createTransaction(txnReq) {
		this.addresses(txnReq.addresses)
		this.foreignKey(txnReq.foreignKey)
		this.receivingAddress(txnReq.receivingAddress)

		return this.txnRequest()
	}

	addresses(addresses) {
		this._addresses = addresses
	}

	foreignKey(foreignKey) {
		this._foreignKey = foreignKey
	}

	receivingAddress(receivingAddress) {
		this._receivingAddress = receivingAddress
	}

	txnRequest() {
		return {
			addresses: this._addresses,
			foreignKey: this._foreignKey,
			receivingAddress: this._receivingAddress
		}
	}
}
