import TransactionBase from './TransactionBase'
import Base58 from '../deps/Base58'
import { store } from '../../api'

export default class PaymentTransaction extends TransactionBase {
	constructor() {
		super()
		this.type = 2
	}

	render(html) {
		const conf = store.getState().config
		return html`
			<table>
				<tr>
					<th>${this._dialogto}:</th>
				</tr>
				<tr>
					<td>${this.dialogAddress} ${' '}-</td>
					<td>${Base58.encode(this._recipient)}</td>
				</tr>
				${this.recipientName ? html`
					<tr>
						<td>${this.dialogName} ${' '}-</td>
						<td>${this.recipientName}</td>
					</tr>
				` : ''}
				<tr>
					<th>${this._dialogamount}</th>
					<td>${this._amount / conf.coin.decimals} ${conf.coin.symbol}</td>
				</tr>
			</table>
		`
	}

	set recipient(recipient) {
		this._recipient = recipient instanceof Uint8Array ? recipient : this.constructor.Base58.decode(recipient)
	}

	set dialogto(dialogto) {
		this._dialogto = dialogto
	}

	set dialogamount(dialogamount) {
		this._dialogamount = dialogamount
	}

	set amount(amount) {
		this._amount = Math.round(amount * store.getState().config.coin.decimals)
		this._amountBytes = this.constructor.utils.int64ToBytes(this._amount)
	}

	get params() {
		const params = super.params
		params.push(
			this._recipient,
			this._amountBytes,
			this._feeBytes
		)
		return params
	}
}
