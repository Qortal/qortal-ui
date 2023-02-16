'use strict'
import TransactionBase from '../TransactionBase.js'
import { QORT_DECIMALS } from '../../constants.js'

export default class UpdateNameTransaction extends TransactionBase {
	constructor() {
		super()
		this.type = 4
	}

	render(html) {
		return html`
			${this._dialogUpdateName1}
			<div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
				<span style="color: #000;">${this.nameText}</span>
			</div>
			${this._dialogUpdateName2}
			<div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
				<span style="color: #000;">${this.newNameText}</span>
			</div>
			${this._dialogUpdateName3}
		`
	}

	set dialogUpdateName1(dialogUpdateName1) {
		this._dialogUpdateName1 = dialogUpdateName1
	}

	set dialogUpdateName1(dialogUpdateName1) {
		this._dialogUpdateName1 = dialogUpdateName1
	}

	set dialogUpdateName2(dialogUpdateName2) {
		this._dialogUpdateName2 = dialogUpdateName2
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

	set newName(mewName) {
		this.newNameText = newName
		this._newNameBytes = this.constructor.utils.stringtoUTF8Array(mewName)
		this._newNameLength = this.constructor.utils.int32ToBytes(this._newNameBytes.length)
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
			this._newNameLength,
			this._newNameBytes,
			this._valueLength,
			this._valueBytes,
			this._feeBytes
		)
		return params
	}
}
