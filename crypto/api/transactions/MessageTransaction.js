import PaymentTransaction from './PaymentTransaction'

export default class MessageTransaction extends PaymentTransaction {
	constructor() {
		super()
		this.type = 17
		this._key = this.constructor.utils.int64ToBytes(0)
		this._isEncrypted = new Uint8Array(1) // Defaults to false
		this._isText = new Uint8Array(1) // Defaults to false
	}

	set message(message /* UTF8 String */) {
		// ...yes? no?
		this.messageText = message

		// Not sure about encoding here...
		this._message = this.constructor.utils.stringtoUTF8Array(message)
		this._messageLength = this.constructor.utils.int64ToBytes(this._message.length)
	}

	set isEncrypted(isEncrypted) {
		this._isEncrypted[0] = isEncrypted
	}

	set isText(isText) {
		this._isText[0] = isText
	}

	get _params() {
		return [
			this._typeBytes,
			this._timestampBytes,
			this._lastReference,
			this._keyPair.publicKey,
			this._recipient,
			this._key,
			this._amountBytes,
			this._messageLength,
			this._message,
			this._isEncrypted,
			this._isText,
			this._feeBytes
		]
	}
}
