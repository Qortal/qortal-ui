import publicKeyToAddress from '../../wallet/publicKeyToAddress'
import TransactionBase from '../TransactionBase'
import nacl from '../../deps/nacl-fast'
import ed2curve from '../../deps/ed2curve'
import { Sha256 } from 'asmcrypto.js'
import { DYNAMIC_FEE_TIMESTAMP } from '../../constants'

export default class RewardShareTransaction extends TransactionBase {
	constructor() {
		super()
		this.type = 38
	}

	render(html) {
		return html`
			${this._rewarddialog1} <strong>${this._percentageShare / 1e8}%</strong> ${this._rewarddialog2} <strong>${this.constructor.Base58.encode(this._recipient)}</strong>?
			${this._rewarddialog3}
			<div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
				<span style="color: #000;">${this._base58RewardShareSeed}</span>
			</div>
			${this._rewarddialog4}
		`
	}

	set rewarddialog1(rewarddialog1) {
		this._rewarddialog1 = rewarddialog1
	}

	set rewarddialog2(rewarddialog2) {
		this._rewarddialog2 = rewarddialog2
	}

	set rewarddialog3(rewarddialog3) {
		this._rewarddialog3 = rewarddialog3
	}

	set rewarddialog4(rewarddialog4) {
		this._rewarddialog4 = rewarddialog4
	}

	set recipientPublicKey(recipientPublicKey) {
		this._base58RecipientPublicKey = recipientPublicKey instanceof Uint8Array ? this.constructor.Base58.encode(recipientPublicKey) : recipientPublicKey
		this._recipientPublicKey = this.constructor.Base58.decode(this._base58RecipientPublicKey)
		this.recipient = publicKeyToAddress(this._recipientPublicKey)

		const convertedPrivateKey = ed2curve.convertSecretKey(this._keyPair.privateKey)
		const convertedPublicKey = ed2curve.convertPublicKey(this._recipientPublicKey)
		const sharedSecret = new Uint8Array(32)

		nacl.lowlevel.crypto_scalarmult(sharedSecret, convertedPrivateKey, convertedPublicKey)

		this._rewardShareSeed = new Sha256().process(sharedSecret).finish().result
		this._base58RewardShareSeed = this.constructor.Base58.encode(this._rewardShareSeed)
		this._rewardShareKeyPair = nacl.sign.keyPair.fromSeed(this._rewardShareSeed)

		if (new Date(this._timestamp).getTime() >= DYNAMIC_FEE_TIMESTAMP) {
			this.fee = (recipientPublicKey === this.constructor.Base58.encode(this._keyPair.publicKey) ? 0 : 0.01)
		} else {
			this.fee = (recipientPublicKey === this.constructor.Base58.encode(this._keyPair.publicKey) ? 0 : 0.001)
		}
	}

	set recipient(recipient) {
		this._recipient = recipient instanceof Uint8Array ? recipient : this.constructor.Base58.decode(recipient)
	}

	set percentageShare(share) {
		this._percentageShare = share * 100
		this._percentageShareBytes = this.constructor.utils.int64ToBytes(this._percentageShare)
	}

	get params() {
		const params = super.params
		params.push(
			this._recipient,
			this._rewardShareKeyPair.publicKey,
			this._percentageShareBytes,
			this._feeBytes
		)
		return params
	}
}
