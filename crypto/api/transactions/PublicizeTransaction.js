import ChatBase from './chat/ChatBase'
import { QORT_DECIMALS } from '../constants'

export default class PublicizeTransaction extends ChatBase {
	constructor() {
		super()
		this.type = 19
		this.fee = 0
	}

	set proofOfWorkNonce(proofOfWorkNonce) {
		this._proofOfWorkNonce = this.constructor.utils.int32ToBytes(proofOfWorkNonce)
	}

	set fee(fee) {
		this._fee = fee * QORT_DECIMALS
		this._feeBytes = this.constructor.utils.int64ToBytes(this._fee)
	}

	get params() {
		const params = super.params
		params.push(
			this._proofOfWorkNonce,
			this._feeBytes
		)
		return params
	}
}
