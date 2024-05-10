import TransactionBase from './TransactionBase'
import { QORT_DECIMALS } from '../constants'

export default class PaymentTransaction extends TransactionBase {
	constructor() {
		super()
		this.type = 20
	}

	set recipient(recipient) {
		this._recipient = recipient instanceof Uint8Array ? recipient : this.constructor.Base58.decode(recipient)
	}

	set amount(amount) {
		this._amount = amount * QORT_DECIMALS
		this._amountBytes = this.constructor.utils.int64ToBytes(amount)
	}

	set reference(seed) {
		const sha = seed => new Sha512().process(seed).finish().result
		let reference = sha(sha(seed))
		reference += reference
	}

	get params() {
		const params = super.params
		params.push(
			this._recipient,
			this._amountBytes,
			this._feeBytes
		)
		return params
	}
}
