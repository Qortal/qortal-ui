import {
	uint8ArrayToBase64,
	base64ToUint8Array,
	uint8ArrayToObject,
	decryptSingle
} from '../../../plugins/plugins/core/components/GroupEncryption.js'

const Base64Message = {}

Base64Message.decode = function (string, keys, ref) {
	const binaryString = atob(string)
	const binaryLength = binaryString.length
	const bytes = new Uint8Array(binaryLength)

	for (let i = 0; i < binaryLength; i++) {
		bytes[i] = binaryString.charCodeAt(i)
	}

	const decoder = new TextDecoder()
	const decodedString = decoder.decode(bytes)

	if (decodedString.includes("messageText") || decodedString === "4001") {
		if (decodedString === "4001") {
			const firstString = 'First group key created.'
			const hubString = '{"messageText":{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"' + firstString + '"}]}]},"images":[""],"repliedTo":"","version":3}'
			return hubString
		} else {
			return decodedString
		}
	} else {
		let repliedToStr = ''
		let messageStr = ''
		let hubString = ''

		const res = decryptSingle(string, keys, false)

		if (res === 'noKey' || res === 'decryptionFailed') {
			return '{"messageText":{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This message could not be decrypted"}]}]},"images":[""],"repliedTo":"","version":3}'
		}

		const decryptToUnit8Array = base64ToUint8Array(res)
		const responseData = uint8ArrayToObject(decryptToUnit8Array)

		if (responseData.type === "notification") {
			const messageStrRaw = responseData.data.message
			messageStr = messageStrRaw.trim()
		}

		if (ref !== "noref") {
			if (responseData.type === "reaction") {
				repliedToStr = ref
				messageStr = responseData.content
			}
		}

		if (responseData.hasOwnProperty('message') && typeof responseData['message'] === 'string' && responseData['message'].length) {
			const messageStrRaw = responseData.message
			const messageJoin1 = messageStrRaw.split('"').join('<upvote>')
			const messageReplace1 = messageJoin1.replace('<p>', '')
			const messageReplace2 = messageReplace1.replace('</p>', '')
			const messageTrim = messageReplace2.trim()
			const messageJoin2 = messageTrim.split('<br><br>').join('"},{"type":"hardBreak"},{"type":"hardBreak"},{"type":"text","text":"')
			const messageJoin3 = messageJoin2.split('<br>').join('"},{"type":"hardBreak"},{"type":"text","text":"')

			messageStr = messageJoin3
		}

		if (responseData.repliedTo) {
			repliedToStr = responseData.repliedTo
		}

		if (responseData.type === "edit") {
			hubString = '{"messageText":{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"' + messageStr + '"}]}]},"images":[""],"repliedTo":"' + repliedToStr + '","version":3,"isEdited":true}'
		} else if (responseData.type === "reaction") {
			hubString = '{"messageText":{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"' + messageStr + '"}]}]},"images":[""],"repliedTo":"' + repliedToStr + '","version":3,"isReaction":true}'
		} else {
			hubString = '{"messageText":{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"' + messageStr + '"}]}]},"images":[""],"repliedTo":"' + repliedToStr + '","version":3}'
		}

		const preparedString = hubString.split('<upvote>').join('\\"')
		const finalString = preparedString.replace(/<\/?[^>]+(>|$)/g, '')

		return finalString
	}
}

export default Base64Message