import TransactionBase from './TransactionBase'

export default class DelegationTransaction extends TransactionBase {
	constructor() {
		super()
		this.type = 18
	}

	set superNodeAddress(superNodeAddress) {
		this._superNodeAddress = superNodeAddress instanceof Uint8Array ? superNodeAddress : this.constructor.Base58.decode(superNodeAddress)
	}

	get params() {
		const params = super.params
		params.push(
			this._superNodeAddress,
			this._feeBytes
		)
		return params
	}
}
