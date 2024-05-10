import TransactionBase from '../TransactionBase'
import publicKeyToAddress from '../../wallet/publicKeyToAddress'
import { Base58 } from '../../deps/deps'
import { DYNAMIC_FEE_TIMESTAMP } from '../../constants'

export default class RemoveRewardShareTransaction extends TransactionBase {
	constructor() {
		super()
		this.type = 38
	}

	render(html) {
		return html`
			${this._rewarddialog5}
			<div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
				<span style="color: #000;">${this.constructor.Base58.encode(this._recipient)}</span>
			</div>
			${this._rewarddialog6}
		`
	}

	set rewarddialog5(rewarddialog5) {
		this._rewarddialog5 = rewarddialog5
	}

	set rewarddialog6(rewarddialog6) {
		this._rewarddialog6 = rewarddialog6
	}

	set rewardShareKeyPairPublicKey(rewardShareKeyPairPublicKey) {
		this._rewardShareKeyPairPublicKey = Base58.decode(rewardShareKeyPairPublicKey)
	}

	set recipient(recipient) {
		const _address = publicKeyToAddress(this._keyPair.publicKey)
		this._recipient = recipient instanceof Uint8Array ? recipient : this.constructor.Base58.decode(recipient)

		if (new Date(this._timestamp).getTime() >= DYNAMIC_FEE_TIMESTAMP) {
			this.fee = _address === recipient ? 0 : 0.01
		} else {
			this.fee = _address === recipient ? 0 : 0.001
		}
	}

	set percentageShare(share) {
		this._percentageShare = share * 100
		this._percentageShareBytes = this.constructor.utils.int64ToBytes(this._percentageShare)
	}

	get params() {
		const params = super.params
		params.push(
			this._recipient,
			this._rewardShareKeyPairPublicKey,
			this._percentageShareBytes,
			this._feeBytes
		)
		return params
	}
}
