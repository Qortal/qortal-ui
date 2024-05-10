import TransactionBase from '../TransactionBase'
import { QORT_DECIMALS } from '../../constants'

export default class CreateGroupTransaction extends TransactionBase {
	constructor() {
		super()
		this.type = 22
	}

	render(html) {
		return html`
			${this._groupdialog5}
			<div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
				<div><span style="color: #000;">${this._groupdialog7}: ${this._rGroupName}</span></div>
				<hr style="border: 2px solid #03a9f4;">
				<div><span style="color: #000;">${this._groupdialog8}: ${this._rGroupDesc}</span></div>
				<hr style="border: 2px solid #03a9f4;">
				<div><span style="color: #000;">${this._groupdialog9}: ${this._rGroupTypeDesc}</span></div>
			</div>
			${this._groupdialog6}
		`
	}

	set groupdialog5(groupdialog5) {
		this._groupdialog5 = groupdialog5
	}

	set groupdialog6(groupdialog6) {
		this._groupdialog6 = groupdialog6
	}

	set groupdialog7(groupdialog7) {
		this._groupdialog7 = groupdialog7
	}

	set groupdialog8(groupdialog8) {
		this._groupdialog8 = groupdialog8
	}

	set groupdialog9(groupdialog9) {
		this._groupdialog9 = groupdialog9
	}

	set groupTypeDesc(groupTypeDesc) {
		this._rGroupTypeDesc = groupTypeDesc
	}

	set fee(fee) {
		this._fee = fee * QORT_DECIMALS
		this._feeBytes = this.constructor.utils.int64ToBytes(this._fee)
	}

	set rGroupName(rGroupName) {
		this._rGroupName = rGroupName
		this._rGroupNameBytes = this.constructor.utils.stringtoUTF8Array(this._rGroupName)
		this._rGroupNameLength = this.constructor.utils.int32ToBytes(this._rGroupNameBytes.length)
	}

	set rGroupDesc(rGroupDesc) {
		this._rGroupDesc = rGroupDesc
		this._rGroupDescBytes = this.constructor.utils.stringtoUTF8Array(this._rGroupDesc)
		this._rGroupDescLength = this.constructor.utils.int32ToBytes(this._rGroupDescBytes.length)
	}

	set rGroupType(rGroupType) {
		this._rGroupType = new Uint8Array(1)
		this._rGroupType[0] = rGroupType
	}

	set rGroupApprovalThreshold(rGroupApprovalThreshold) {
		this._rGroupApprovalThreshold = new Uint8Array(1)
		this._rGroupApprovalThreshold[0] = rGroupApprovalThreshold
	}

	set rGroupMinimumBlockDelay(rGroupMinimumBlockDelay) {
		this._rGroupMinimumBlockDelayBytes = this.constructor.utils.int32ToBytes(rGroupMinimumBlockDelay)
	}

	set rGroupMaximumBlockDelay(rGroupMaximumBlockDelay) {
		this._rGroupMaximumBlockDelayBytes = this.constructor.utils.int32ToBytes(rGroupMaximumBlockDelay)
	}

	get params() {
		const params = super.params
		params.push(
			this._rGroupNameLength,
			this._rGroupNameBytes,
			this._rGroupDescLength,
			this._rGroupDescBytes,
			this._rGroupType,
			this._rGroupApprovalThreshold,
			this._rGroupMinimumBlockDelayBytes,
			this._rGroupMaximumBlockDelayBytes,
			this._feeBytes
		)
		return params
	}
}
