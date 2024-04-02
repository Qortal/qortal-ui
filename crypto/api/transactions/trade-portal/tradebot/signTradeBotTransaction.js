import Base58 from '../../../deps/Base58.js'
import nacl from '../../../deps/nacl-fast.js'
import utils from '../../../deps/utils.js'

const signTradeBotTransaction = (unsignedTxn, keyPair) => {
	if (!unsignedTxn) {
		throw new Error('Unsigned Transaction Bytes not defined')
	}

	if (!keyPair) {
		throw new Error('keyPair not defined')
	}

	const txnBuffer = Base58.decode(unsignedTxn)

	if (keyPair.privateKey.length === undefined) {
		const _privateKey = Object.keys(keyPair.privateKey).map(function (key) { return keyPair.privateKey[key]; })
		const privateKey = new Uint8Array(_privateKey)
		const signature = nacl.sign.detached(txnBuffer, privateKey)
		return utils.appendBuffer(txnBuffer, signature)
	} else {
		const signature = nacl.sign.detached(txnBuffer, keyPair.privateKey)
		return utils.appendBuffer(txnBuffer, signature)
	}
}

export default signTradeBotTransaction
