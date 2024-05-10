import TransactionBase from '../TransactionBase'
import { QORT_DECIMALS } from '../../constants'

export default class RegisterNameTransaction extends TransactionBase {
	constructor() {
		super()
		this.type = 3
	}

	render(html) {
		return html`
			${this._dialogyou}
			<div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
				<span style="color: #000;">${this.nameText}</span>
			</div>
			${this._dialogonpress}
		`
	}

	set dialogyou(dialogyou) {
		this._dialogyou = dialogyou
	}

	set dialogonpress(dialogonpress) {
		this._dialogonpress = dialogonpress
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

	set value(value) {
		this.valueText = value.length === 0 ? "Registered Name on the Qortal Chain" : value
		this._valueBytes = this.constructor.utils.stringtoUTF8Array(this.valueText)
		this._valueLength = this.constructor.utils.int32ToBytes(this._valueBytes.length)
	}

	get params() {
		const params = super.params
		params.push(
			this._nameLength,
			this._nameBytes,
			this._valueLength,
			this._valueBytes,
			this._feeBytes
		)
		return params
	}
}
