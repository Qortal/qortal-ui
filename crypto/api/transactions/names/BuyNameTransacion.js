import TransactionBase from '../TransactionBase'
import { QORT_DECIMALS } from '../../constants'

export default class BuyNameTransacion extends TransactionBase {
	constructor() {
		super()
		this.type = 7
	}

	render(html) {
		return html`
			${this._buyNameDialog1}
			<div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
				<span style="color: #000;">${this.nameText}</span>
			</div>
			${this._buyNameDialog2}
			<div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
				<span style="color: #000;">${this.showSellPrice}</span>
			</div>
			${this._buyNameDialog3}
		`
	}

	set buyNameDialog1(buyNameDialog1) {
		this._buyNameDialog1 = buyNameDialog1
	}

	set buyNameDialog2(buyNameDialog2) {
		this._buyNameDialog2 = buyNameDialog2
	}

	set buyNameDialog3(buyNameDialog3) {
		this._buyNameDialog3 = buyNameDialog3
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

	set sellPrice(sellPrice) {
		this.showSellPrice = sellPrice
		this._sellPrice = sellPrice * QORT_DECIMALS
		this._sellPriceBytes = this.constructor.utils.int64ToBytes(this._sellPrice)
	}

	set recipient(recipient) {
		this._recipient = recipient instanceof Uint8Array ? recipient : this.constructor.Base58.decode(recipient)
		this.theRecipient = recipient
	}

	get params() {
		const params = super.params
		params.push(
			this._nameLength,
			this._nameBytes,
			this._sellPriceBytes,
			this._recipient,
			this._feeBytes
		)
		return params
	}
}
