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
				url: `/chat/messages?chatreference=${msg.signature}&reverse=true${msgQuery}&limit=1&sender=${msg.sender}`,
			})

			if (response && Array.isArray(response) && response.length !== 0) {
				let responseItem = { ...response[0] }
                const decodeResponseItem = decodeMessageFunc(responseItem, isReceipient, _publicKey)
				delete decodeResponseItem.timestamp
		
				msgItem = {
					...msg,
					...decodeResponseItem,
					senderName: msg.senderName,
					sender: msg.sender,
					editedTimestamp: response[0].timestamp,
				}
			}
		} catch (error) {
		}

		return msgItem
	})
	const updateMessages = await Promise.all(findNewMessages)
	const findNewMessages2 = updateMessages.map(async (msg) => {
		let parsedMessageObj = msg
		try {
			parsedMessageObj = JSON.parse(msg.decodedMessage)
		} catch (error) {
			return msg
		}
		let msgItem = msg
		try {
			let msgQuery = `&involving=${msg.recipient}&involving=${msg.sender}`
			if (!isReceipient) {
				msgQuery = `&txGroupId=${msg.txGroupId}`
			}
			if (parsedMessageObj.repliedTo) {
				let originalReply
				if(+parsedMessageObj.version > 2){
					 originalReply = await parentEpml.request("apiCall", {
						type: "api",
						url: `/chat/message/${parsedMessageObj.repliedTo}`,
					})
				}
				if(+parsedMessageObj.version < 3){
					 originalReply = await parentEpml.request("apiCall", {
						type: "api",
						url: `/chat/messages?reference=${parsedMessageObj.repliedTo}&reverse=true${msgQuery}`,
					})
			   }
			
				
				

				const originalReplyMessage = originalReply.timestamp ? originalReply : originalReply.length !== 0 ? originalReply[0] : null

				const response = await parentEpml.request("apiCall", {
					type: "api",
					url: `/chat/messages?chatreference=${parsedMessageObj.repliedTo}&reverse=true${msgQuery}&limit=1&sender=${originalReplyMessage.sender}`,
				})
				
				if (
					originalReplyMessage &&
					response &&
					Array.isArray(response) &&
					response.length !== 0
				) {
					const decodeOriginalReply = decodeMessageFunc(originalReplyMessage, isReceipient, _publicKey)

					const decodeUpdatedReply = decodeMessageFunc(response[0], isReceipient, _publicKey)
					const formattedRepliedToData = {
						...decodeUpdatedReply,
						senderName: decodeOriginalReply.senderName,
						sender: decodeOriginalReply.sender,
					}
					msgItem = {
						...msg,
						repliedToData: formattedRepliedToData,
					}
				} else {
					

					if (
						originalReplyMessage
					) {
						
						msgItem = {
							...msg,
							repliedToData: decodeMessageFunc(originalReplyMessage, isReceipient, _publicKey),
						}
					}
				}
			}
		} catch (error) {
		}

		return msgItem
	})
	const updateMessages2 = await Promise.all(findNewMessages2)

	return updateMessages2
}
