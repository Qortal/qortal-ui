import TransactionBase from '../TransactionBase'
import { QORT_DECIMALS } from '../../constants'

export default class CancelSellNameTransacion extends TransactionBase {
	constructor() {
		super()
		this.type = 6
	}

	render(html) {
		return html`
			${this._cancelSellNameDialog1}
			<div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
				<span style="color: #000;">${this.nameText}</span>
			</div>
			${this._cancelSellNameDialog2}
		`
	}

	set cancelSellNameDialog1(cancelSellNameDialog1) {
		this._cancelSellNameDialog1 = cancelSellNameDialog1
	}

	set cancelSellNameDialog2(cancelSellNameDialog2) {
		this._cancelSellNameDialog2 = cancelSellNameDialog2
	}

	set fee(fee) {
		this._fee = fee * QORT_DECIMALS
		this._feeBytes = this.constructor.utils.int64ToBytes(this._fee)
	}

	set name(name) {
		this.nameText = name
		this._nameBytes = this.constructor.utils.stringtoUTF8Array(name)
		this._nameLength = this.constructor.utils.int32ToBytes(this._nameBytes.length)
	}

	get params() {
		const params = super.params
		params.push(
			this._nameLength,
			this._nameBytes,
			this._feeBytes
		)
		return params
	}
}
