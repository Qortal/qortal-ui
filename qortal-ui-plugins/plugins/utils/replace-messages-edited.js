export const replaceMessagesEdited = async ({
	decodedMessages,
	parentEpml,
    isReceipient,
    decodeMessageFunc,
    _publicKey
}) => {
	const findNewMessages = decodedMessages.map(async (msg) => {
		let msgItem = msg
		try {
			let msgQuery = `&involving=${msg.recipient}&involving=${msg.sender}`
			if (!isReceipient) {
				msgQuery = `&txGroupId=${msg.txGroupId}`
			}
			const response = await parentEpml.request("apiCall", {
				type: "api",
				url: `/chat/messages?chatreference=${msg.reference}&reverse=true${msgQuery}`,
			})

			if (response && Array.isArray(response) && response.length !== 0) {
				let responseItem = { ...response[0] }
                const decodeResponseItem = decodeMessageFunc(responseItem, isReceipient, _publicKey)
				delete decodeResponseItem.timestamp
				msgItem = {
					...msg,
					...decodeResponseItem,
					editedTimestamp: response[0].timestamp,
				}
			}
		} catch (error) {
			console.log(error)
		}

		return msgItem
	})
	const updateMessages = await Promise.all(findNewMessages)
	const findNewMessages2 = updateMessages.map(async (msg) => {
		let parsedMessageObj = msg
		try {
			parsedMessageObj = JSON.parse(msg.decodedMessage)
		} catch (error) {
            console.log('error')
			return msg
		}
		let msgItem = msg
		try {
			let msgQuery = `&involving=${msg.recipient}&involving=${msg.sender}`
			if (!isReceipient) {
				msgQuery = `&txGroupId=${msg.txGroupId}`
			}
			if (parsedMessageObj.repliedTo) {
				const response = await parentEpml.request("apiCall", {
					type: "api",
					url: `/chat/messages?chatreference=${parsedMessageObj.repliedTo}&reverse=true${msgQuery}`,
				})
				if (
					response &&
					Array.isArray(response) &&
					response.length !== 0
				) {
					msgItem = {
						...msg,
						repliedToData: decodeMessageFunc(response[0], isReceipient, _publicKey),
					}
				} else {
					const response2 = await parentEpml.request("apiCall", {
						type: "api",
						url: `/chat/messages?reference=${parsedMessageObj.repliedTo}&reverse=true${msgQuery}`,
					})

					if (
						response2 &&
						Array.isArray(response2) &&
						response2.length !== 0
					) {
						msgItem = {
							...msg,
							repliedToData: decodeMessageFunc(response2[0], isReceipient, _publicKey),
						}
					}
				}
			}
		} catch (error) {
			console.log(error)
		}

		return msgItem
	})
	const updateMessages2 = await Promise.all(findNewMessages2)

	return updateMessages2
}
