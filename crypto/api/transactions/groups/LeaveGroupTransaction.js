import TransactionBase from '../TransactionBase'
import { QORT_DECIMALS } from '../../constants'

export default class LeaveGroupTransaction extends TransactionBase {
	constructor() {
		super()
		this.type = 32
	}

	render(html) {
		return html`
			${this._groupdialog3}
			<div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
				<span style="color: #000;">${this._rGroupName}</span>
			</div>
			${this._groupdialog4}
		`
	}

	set groupdialog3(groupdialog3) {
		this._groupdialog3 = groupdialog3
	}

	set groupdialog4(groupdialog4) {
		this._groupdialog4 = groupdialog4
	}

	set fee(fee) {
		this._fee = fee * QORT_DECIMALS
		this._feeBytes = this.constructor.utils.int64ToBytes(this._fee)
	}

	set registrantAddress(registrantAddress) {
		this._registrantAddress = registrantAddress instanceof Uint8Array ? registrantAddress : this.constructor.Base58.decode(registrantAddress)
	}

	set rGroupId(rGroupId) {
		this._rGroupId = rGroupId
		this._rGroupIdBytes = this.constructor.utils.int32ToBytes(this._rGroupId)
	}

	set rGroupName(rGroupName) {
		this._rGroupName = rGroupName
	}

	get params() {
		const params = super.params
		params.push(
			this._rGroupIdBytes,
			this._feeBytes
		)
		return params
	}
}
