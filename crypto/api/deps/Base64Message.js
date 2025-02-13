import {
	uint8ArrayToBase64,
	base64ToUint8Array,
	uint8ArrayToObject,
	decryptSingle
} from '../../../plugins/plugins/core/components/GroupEncryption.js'
import {
	extensionToPointer,
	encodedToChar,
	embedToString,
	parseQortalLink
} from '../../../plugins/plugins/core/components/qdn-action-constants.js'

const Base64Message = {}

Base64Message.decode = function (string, keys, ref) {
	let repliedToStr = ''
	let hubSpecialId = ''
	let hubMessageStr = ''
	let newMessageObject = ''
	let reactionStr = ''
	let messageUseEmbed = {}
	let editStr = false
	let embedFileStr = '"images":[""]'

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
		const res = decryptSingle(string, keys, false)

		if (res === 'noKey' || res === 'decryptionFailed') {
			return '{"specialId":"","message":"<p>This message could not be decrypted</p>","repliedTo":"","isEdited":false,"isFromHub":true,"version": 3}'
		}

		const decryptToUnit8Array = base64ToUint8Array(res)
		const responseData = uint8ArrayToObject(decryptToUnit8Array)

		if (responseData.type === "edit") {
			editStr = true
		}

		if (responseData.repliedTo) {
			repliedToStr = responseData.repliedTo
		}

		if (responseData.specialId) {
			hubSpecialId = responseData.specialId
		}

		if (responseData.type === "notification") {
			hubMessageStr = responseData.data.message
		} else if (ref !== "noref" && responseData.type === "reaction") {
			reactionStr = '"isReaction":true,'
			repliedToStr = ref
			hubMessageStr = responseData.content
		} else if (responseData.message.includes('qortal://use-embed/')) {
			const useEmbed1 = extensionToPointer(responseData.message)
			const useEmbed2 = /<newpointer>(.*?)<\/newpointer>/g.exec(useEmbed1)
			const useEmbed3 = encodedToChar(useEmbed2[1])
			messageUseEmbed = parseQortalLink(useEmbed3)
			embedFileStr = embedToString(messageUseEmbed)
			hubMessageStr = responseData.message.split(useEmbed2[1]).join('')
		} else {
			hubMessageStr = responseData.message
		}

		const hubMessageFinal = hubMessageStr.split('"').join('&quot;')

		newMessageObject = '{"specialId":"' + hubSpecialId + '","message":"' + hubMessageFinal + '",' + embedFileStr + ',"repliedTo":"' + repliedToStr + '","isEdited":' + editStr + ',"isFromHub":true,' + reactionStr + '"version": 3}'

		return newMessageObject
	}
}

export default Base64Message