import nacl from '../../deps/nacl-fast.js'
import utils from '../../deps/utils.js'

const signChat = (chatBytes, nonce, keyPair) => {

	if (!chatBytes) {
		throw new Error('Chat Bytes not defined')
	}

	if (!nonce) {
		throw new Error('Nonce not defined')
	}

	if (!keyPair) {
		throw new Error('keyPair not defined')
	}

	const _nonce = utils.int32ToBytes(nonce)

	if (chatBytes.length === undefined) {
		const _chatBytesBuffer = Object.keys(chatBytes).map(function (key) { return chatBytes[key]; })

		const chatBytesBuffer = new Uint8Array(_chatBytesBuffer)
		chatBytesBuffer.set(_nonce, 112)

		const signature = nacl.sign.detached(chatBytesBuffer, keyPair.privateKey)

		return utils.appendBuffer(chatBytesBuffer, signature)
	} else {
		const chatBytesBuffer = new Uint8Array(chatBytes)
		chatBytesBuffer.set(_nonce, 112)

		const signature = nacl.sign.detached(chatBytesBuffer, keyPair.privateKey)

		return utils.appendBuffer(chatBytesBuffer, signature)
	}
}

export default signChat
