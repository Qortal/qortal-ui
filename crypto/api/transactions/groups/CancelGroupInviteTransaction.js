import TransactionBase from '../TransactionBase'
import { QORT_DECIMALS } from '../../constants'

export default class CancelGroupInviteTransaction extends TransactionBase {
	constructor() {
		super()
		this.type = 30
	}

	render(html) {
		return html`
			${this._cancelInviteDialog1}
			<div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
				<span style="color: #000;">${this._memberName}</span>
			</div>
			<div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
				<span style="color: #000;">${this.theRecipient}</span>
			</div>
			${this._cancelInviteDialog2}
		`
	}

	set memberName(memberName) {
		this._memberName = memberName
	}

	set cancelInviteDialog1(cancelInviteDialog1) {
		this._cancelInviteDialog1 = cancelInviteDialog1
	}

	set cancelInviteDialog2(cancelInviteDialog2) {
		this._cancelInviteDialog2 = cancelInviteDialog2
	}

	set rGroupId(rGroupId) {
		this._rGroupId = rGroupId
		this._rGroupIdBytes = this.constructor.utils.int32ToBytes(this._rGroupId)
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
			this._feeBytes
		)
		return params
	}
}
