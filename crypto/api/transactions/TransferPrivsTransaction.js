import TransactionBase from './TransactionBase'
import { store } from '../../api'
import { QORT_DECIMALS } from '../constants'

export default class TransferPrivsTransaction extends TransactionBase {
	constructor() {
		super()
		this.type = 40
	}

	render(html) {
		const conf = store.getState().config
		return html`
			Are you sure to transfer privileges to this account ?
			<div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
				<span style="color: #000;">${this.theRecipient}</span>
			</div>
			On pressing confirm, the transfer privileges request will be sent!
		`
	}

	set recipient(recipient) {
		this._recipient = recipient instanceof Uint8Array ? recipient : this.constructor.Base58.decode(recipient)
		this.theRecipient = recipient
	}

	set fee(fee) {
		this._fee = fee * QORT_DECIMALS
		this._feeBytes = this.constructor.utils.int64ToBytes(this._fee)
	}

	get params() {
		const params = super.params
		params.push(
			this._recipient,
			this._feeBytes
		)
		return params
	}
}
