import TransactionBase from '../TransactionBase'
import { QORT_DECIMALS } from '../../constants'

export default class GroupInviteTransaction extends TransactionBase {
	constructor() {
		super()
		this.type = 29
	}

	render(html) {
		return html`
			${this._inviteMemberDialog1}
			<div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
				<span style="color: #000;">${this.theRecipient}</span>
			</div>
			${this._inviteMemberDialog2}
		`
	}

	set inviteMemberDialog1(inviteMemberDialog1) {
		this._inviteMemberDialog1 = inviteMemberDialog1
	}

	set inviteMemberDialog2(inviteMemberDialog2) {
		this._inviteMemberDialog2 = inviteMemberDialog2
	}

	set rGroupId(rGroupId) {
		this._rGroupId = rGroupId
		this._rGroupIdBytes = this.constructor.utils.int32ToBytes(this._rGroupId)
	}

	set rInviteTime(rInviteTime) {
		this._rInviteTime = rInviteTime
		this._rInviteTimeBytes = this.constructor.utils.int32ToBytes(this._rInviteTime)
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
			this._rGroupIdBytes,
			this._recipient,
			this._rInviteTimeBytes,
			this._feeBytes
		)
		return params
	}
}
