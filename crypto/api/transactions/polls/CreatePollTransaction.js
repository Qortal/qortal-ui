import TransactionBase from '../TransactionBase'
import { QORT_DECIMALS } from '../../constants'

export default class CreatePollTransaction extends TransactionBase {
	constructor() {
		super()
		this.type = 8
		this._options = []
	}

	render(html) {
		return html`
			${this._votedialog3}
			<div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
				<span style="color: #000;">${this._rPollName}</span>
			</div>
			${this._votedialog4}
			<div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
				<span style="color: #000;">${this._rPollDesc}</span>
			</div>
			${this._votedialog5}
			<div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
				<span style="color: #000;">${this._pollOptions.join(', ')}</span>
			</div>
			${this._votedialog6}
			<div style="margin-top: 10px; font-weight: bold">
				${this._feeDialog}: ${this._feeDisplay}
			</div>
		`
	}

	addOption(option) {
		const optionBytes = this.constructor.utils.stringtoUTF8Array(option)
		const optionLength = this.constructor.utils.int32ToBytes(optionBytes.length)
		this._options.push({ length: optionLength, bytes: optionBytes })
	}

	set feeDialog(feeDialog) {
		this._feeDialog = feeDialog
	}

	set votedialog3(votedialog3) {
		this._votedialog3 = votedialog3
	}

	set votedialog4(votedialog4) {
		this._votedialog4 = votedialog4
	}

	set votedialog5(votedialog5) {
		this._votedialog5 = votedialog5
	}

	set votedialog6(votedialog6) {
		this._votedialog6 = votedialog6
	}

	set fee(fee) {
		this._feeDisplay = fee
		this._fee = fee * QORT_DECIMALS
		this._feeBytes = this.constructor.utils.int64ToBytes(this._fee)
	}

	set ownerAddress(ownerAddress) {
		this._ownerAddress = ownerAddress instanceof Uint8Array ? ownerAddress : this.constructor.Base58.decode(ownerAddress)
	}

	set rPollName(rPollName) {
		this._rPollName = rPollName
		this._rPollNameBytes = this.constructor.utils.stringtoUTF8Array(this._rPollName)
		this._rPollNameLength = this.constructor.utils.int32ToBytes(this._rPollNameBytes.length)

	}

	set rPollDesc(rPollDesc) {
		this._rPollDesc = rPollDesc
		this._rPollDescBytes = this.constructor.utils.stringtoUTF8Array(this._rPollDesc)
		this._rPollDescLength = this.constructor.utils.int32ToBytes(this._rPollDescBytes.length)
	}

	set rOptions(rOptions) {
		const optionsArray = rOptions[0].split(', ').map(opt => opt.trim())
		this._pollOptions = optionsArray

		for (let i = 0; i < optionsArray.length; i++) {
			this.addOption(optionsArray[i])
		}

		this._rNumberOfOptionsBytes = this.constructor.utils.int32ToBytes(optionsArray.length)
	}


	get params() {
		const params = super.params
		params.push(
			this._ownerAddress,
			this._rPollNameLength,
			this._rPollNameBytes,
			this._rPollDescLength,
			this._rPollDescBytes,
			this._rNumberOfOptionsBytes
		)

		// Push the dynamic options
		for (let i = 0; i < this._options.length; i++) {
			params.push(this._options[i].length, this._options[i].bytes)
		}

		params.push(this._feeBytes)

		return params
	}
}
