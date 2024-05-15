import TransactionBase from '../TransactionBase'
import { QORT_DECIMALS } from '../../constants'

export default class GroupBanTransaction extends TransactionBase {
	constructor() {
		super()
		this.type = 26
	}

	render(html) {
		return html`
			${this._banMemberDialog1}
			<div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
				<span style="color: #000;">${this.theRecipient}</span>
			</div>
			${this._banMemberDialog2}
		`
	}

	set banMemberDialog1(banMemberDialog1) {
		this._banMemberDialog1 = banMemberDialog1
	}

	set banMemberDialog2(banMemberDialog2) {
		this._banMemberDialog2 = banMemberDialog2
	}

	set rGroupId(rGroupId) {
		this._rGroupId = rGroupId
		this._rGroupIdBytes = this.constructor.utils.int32ToBytes(this._rGroupId)
	}

	set rBanReason(rBanReason) {
		this._rBanReason = rBanReason
		this._rBanReasonBytes = this.constructor.utils.stringtoUTF8Array(this._rBanReason)
		this._rBanReasonLength = this.constructor.utils.int32ToBytes(this._rBanReasonBytes.length)
	}

	set rBanTime(rBanTime) {
		this._rBanTime = rBanTime
		this._rBanTimeBytes = this.constructor.utils.int32ToBytes(this._rBanTime)
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
			this._rBanReasonLength,
			this._rBanReasonBytes,
			this._rBanTimeBytes,
			this._feeBytes
		)
		return params
	}
}
