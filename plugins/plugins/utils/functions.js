import { Epml } from '../../epml'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

export const inputKeyCodes = [
	48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
	60, 61, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72,
	73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84,
	85, 86, 87, 88, 89, 90, 96, 97, 98, 99, 100, 101,
	102, 103, 104, 105, 106, 107, 108, 109, 110, 111,
	160, 161, 162, 163, 164, 165, 170, 171, 186, 187,
	188, 189, 190, 191, 192, 193, 194, 219, 220, 221,
	222, 223, 226
]

export const blocksNeed = (level) => {
	if (level === 0) {
		return '7200'
	} else if (level === 1) {
		return '72000'
	} else if (level === 2) {
		return '201600'
	} else if (level === 3) {
		return '374400'
	} else if (level === 4) {
		return '618400'
	} else if (level === 5) {
		return '964000'
	} else if (level === 6) {
		return '1482400'
	} else if (level === 7) {
		return '2173600'
	} else if (level === 8) {
		return '3037600'
	} else if (level === 9) {
		return '4074400'
	} else if (level === 'sponsor') {
		return 9000
	}
}

export const getUserNameFromAddress = async (address) => {
	try {
		const getNames = await parentEpml.request("apiCall", {
			type: "api",
			url: `/names/address/${address}`
		})

		if (Array.isArray(getNames) && getNames.length > 0 ) {
			return getNames[0].name
		} else {
			return address
		}
	} catch (error) {
		console.error(error)
	}
}

export const replaceMessagesEdited = async ({ decodedMessages, parentEpml, isReceipient, decodeMessageFunc, _publicKey, addToUpdateMessageHashmap }) => {
	const MAX_CONCURRENT_REQUESTS = 5 // Maximum number of concurrent requests

	const executeWithConcurrencyLimit = async (array, asyncFn) => {
		const results = []
		const concurrencyPool = []

		for (const item of array) {
			const promise = asyncFn(item)
			concurrencyPool.push(promise)

			if (concurrencyPool.length >= MAX_CONCURRENT_REQUESTS) {
				results.push(...await Promise.all(concurrencyPool))
				concurrencyPool.length = 0 // Clear the concurrency pool
			}
		}

		if (concurrencyPool.length > 0) {
			results.push(...await Promise.all(concurrencyPool))
		}

		return results
	}

	const findUpdatedMessage = async (msg) => {
		let msgItem = { ...msg }

		try {
			let msgQuery = `&involving=${msg.recipient}&involving=${msg.sender}`
			if (!isReceipient) {
				msgQuery = `&txGroupId=${msg.txGroupId}`
			}

			// Find new messages first
			const newMsgResponse = await parentEpml.request("apiCall", {
				type: "api",
				url: `/chat/messages?chatreference=${msg.signature}&reverse=true${msgQuery}&limit=1&sender=${msg.sender}&encoding=BASE64`
			})

			if (Array.isArray(newMsgResponse) && newMsgResponse.length > 0) {
				const decodeResponseItem = decodeMessageFunc(newMsgResponse[0], isReceipient, _publicKey)

				delete decodeResponseItem.timestamp

				msgItem = {
					...msgItem,
					...decodeResponseItem,
					senderName: msg.senderName,
					sender: msg.sender,
					editedTimestamp: newMsgResponse[0].timestamp,
					originalSignature: msg.signature
				}
			}

			// Then check and find replies in the same iteration
			let parsedMessageObj

			try {
				parsedMessageObj = JSON.parse(msg.decodedMessage)
			} catch (error) {
				// If parsing fails, return the msgItem as is
				return msgItem
			}

			if (parsedMessageObj.repliedTo) {
				let originalReply

				if (+parsedMessageObj.version > 2) {
					originalReply = await parentEpml.request("apiCall", {
						type: "api",
						url: `/chat/message/${parsedMessageObj.repliedTo}?encoding=BASE64`
					})
				} else {
					originalReply = await parentEpml.request("apiCall", {
						type: "api",
						url: `/chat/messages?reference=${parsedMessageObj.repliedTo}&reverse=true${msgQuery}&encoding=BASE64`
					})
				}

				const originalReplyMessage = originalReply.timestamp ? originalReply : originalReply.length > 0 ? originalReply[0] : null

				const replyResponse = await parentEpml.request("apiCall", {
					type: "api",
					url: `/chat/messages?chatreference=${parsedMessageObj.repliedTo}&reverse=true${msgQuery}&limit=1&sender=${originalReplyMessage.sender}&encoding=BASE64`
				})

				if (originalReplyMessage && Array.isArray(replyResponse) && replyResponse.length !== 0) {
					const decodeOriginalReply = decodeMessageFunc(originalReplyMessage, isReceipient, _publicKey)
					const decodeUpdatedReply = decodeMessageFunc(replyResponse[0], isReceipient, _publicKey)

					msgItem.repliedToData = {
						...decodeUpdatedReply,
						senderName: decodeOriginalReply.senderName,
						sender: decodeOriginalReply.sender
					}
				} else if (originalReplyMessage) {
					msgItem.repliedToData = decodeMessageFunc(originalReplyMessage, isReceipient, _publicKey)
				}
			}

		} catch (error) {
			// Handle or log the error gracefully
			console.error(error)
		}

		return msgItem
	}

	const sortedMessages = decodedMessages.sort((a, b) => b.timestamp - a.timestamp)

	// Execute the functions with concurrency limit
	const updatedMessages = await executeWithConcurrencyLimit(sortedMessages, findUpdatedMessage)
	addToUpdateMessageHashmap(updatedMessages)

	return updatedMessages
}

export function bytesToMegabytes(bytes) {
	return bytes / (1024 * 1024)
}

export function cropAddress(string = '', range = 5) {
	const [start, end] = [
		string?.substring(0, range),
		string?.substring(string?.length - range, string?.length)
	]

	return start + '...' + end
}

export function roundToNearestDecimal(num) {
	const mb = num / 1000000
	return Math.round(mb * 10) / 10
}

export function simpleHash(str) {
	let hash = 0

	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i)
		hash = hash & hash // Convert to 32bit integer
	}

	return hash.toString()
}

export function generateIdFromAddresses(address1, address2) {
	// Sort addresses lexicographically and concatenate
	const sortedAddresses = [address1, address2].sort().join('')

	return simpleHash(sortedAddresses)
}