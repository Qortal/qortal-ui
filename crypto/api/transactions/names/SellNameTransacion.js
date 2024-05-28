import TransactionBase from '../TransactionBase'
import { QORT_DECIMALS } from '../../constants'

export default class SellNameTransacion extends TransactionBase {
	constructor() {
		super()
		this.type = 5
	}

	render(html) {
		return html`
			${this._sellNameDialog1}
			<div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
				<span style="color: #000;">${this.nameText}</span>
			</div>
			${this._sellNameDialog2}
			<div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
				<span style="color: #000;">${this.showSellPrice}</span>
			</div>
			${this._sellNameDialog3}
		`
	}

	set sellNameDialog1(sellNameDialog1) {
		this._sellNameDialog1 = sellNameDialog1
	}

	set sellNameDialog2(sellNameDialog2) {
		this._sellNameDialog2 = sellNameDialog2
	}

	set sellNameDialog3(sellNameDialog3) {
		this._sellNameDialog3 = sellNameDialog3
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

	get params() {
		const params = super.params
		params.push(
			this._nameLength,
			this._nameBytes,
			this._sellPriceBytes,
			this._feeBytes
		)
		return params
	}
}
