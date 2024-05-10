import TransactionBase from '../TransactionBase'
import { QORT_DECIMALS } from '../../constants'

export default class UpdateGroupTransaction extends TransactionBase {
	constructor() {
		super()
		this.type = 23
	}

	render(html) {
		return html`
			${this._updategroupdialog1}
			<div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
				<div><span style="color: #000;">${this._updategroupdialog3}: ${this._rGroupNewOwnerDesc}</span></div>
				<hr style="border: 2px solid #03a9f4;">
				<div><span style="color: #000;">${this._updategroupdialog4}: ${this._rGroupNewName}</span></div>
				<hr style="border: 2px solid #03a9f4;">
				<div><span style="color: #000;">${this._updategroupdialog5}: ${this._rGroupNewDesc}</span></div>
				<hr style="border: 2px solid #03a9f4;">
				<div><span style="color: #000;">${this._updategroupdialog6}: ${this._rGroupTypeDesc}</span></div>
			</div>
			${this._updategroupdialog2}
		`
	}

	set updategroupdialog1(updategroupdialog1) {
		this._updategroupdialog1 = updategroupdialog1
	}

	set updategroupdialog2(updategroupdialog2) {
		this._updategroupdialog2 = updategroupdialog2
	}

	set updategroupdialog3(updategroupdialog3) {
		this._updategroupdialog3 = updategroupdialog3
	}

	set updategroupdialog4(updategroupdialog4) {
		this._updategroupdialog4 = updategroupdialog4
	}

	set updategroupdialog5(updategroupdialog5) {
		this._updategroupdialog5 = updategroupdialog5
	}

	set groupTypeDesc(groupTypeDesc) {
		this._rGroupTypeDesc = groupTypeDesc
	}

	set fee(fee) {
		this._fee = fee * QORT_DECIMALS
		this._feeBytes = this.constructor.utils.int64ToBytes(this._fee)
	}

	set newGroupId(newGroupId) {
		this._rGroupNewBytes = this.constructor.utils.int32ToBytes(newGroupId)
	}

	set newOwner(newOwner) {
		this._rGroupNewOwnerDesc = newOwner
		this._rGroupNewOwner = newOwner instanceof Uint8Array ? newOwner : this.constructor.Base58.decode(newOwner)
	}

	set newName(newName) {
		this._rGroupNewName = newName
		this._rGroupNewNameBytes = this.constructor.utils.stringtoUTF8Array(this._rGroupNewName)
		this._rGroupNewNameLength = this.constructor.utils.int32ToBytes(this._rGroupNewNameBytes.length)
	}

	set newDescription(newDescription) {
		this._rGroupNewDesc = newDescription
		this._rGroupNewDescBytes = this.constructor.utils.stringtoUTF8Array(this._rGroupNewDesc)
		this._rGroupNewDescLength = this.constructor.utils.int32ToBytes(this._rGroupNewDescBytes.length)
	}

	set newIsOpen(newIsOpen) {
		this._rGroupNewType = new Uint8Array(1)
		this._rGroupNewType[0] = newIsOpen
	}

	set newApprovalThreshold(newApprovalThreshold) {
		this._rGroupNewApprovalThreshold = new Uint8Array(1)
		this._rGroupNewApprovalThreshold[0] = newApprovalThreshold
	}

	set newMinimumBlockDelay(newMinimumBlockDelay) {
		this._rGroupNewMinimumBlockDelayBytes = this.constructor.utils.int32ToBytes(newMinimumBlockDelay)
	}

	set newMaximumBlockDelay(newMaximumBlockDelay) {
		this._rGroupNewMaximumBlockDelayBytes = this.constructor.utils.int32ToBytes(newMaximumBlockDelay)
	}

	get params() {
		const params = super.params
		params.push(
			this._rGroupNewBytes,
			this._rGroupNewOwner,
			this._rGroupNewDescLength,
			this._rGroupNewDescBytes,
			this._rGroupNewType,
			this._rGroupNewApprovalThreshold,
			this._rGroupNewMinimumBlockDelayBytes,
			this._rGroupNewMaximumBlockDelayBytes,
			this._feeBytes
		)
		return params
	}
}
