export const replaceMessagesEdited = async ({
	decodedMessages,
	parentEpml,
    isReceipient,
    decodeMessageFunc,
    _publicKey
}) => {
	const findNewMessages = decodedMessages.map(async (msg) => {
		let originalMsg = msg
		let msgItem = msg
		try {
			if(msg.chatReference){
				originalMsg = await parentEpml.request("apiCall", {
					type: "api",
					url: `/chat/message/${msg.chatReference}`,
				})
				originalMsg.chatReference = msg.chatReference
			}
			let msgQuery = `&involving=${originalMsg.recipient}&involving=${originalMsg.sender}`
			if (!isReceipient) {
				msgQuery = `&txGroupId=${originalMsg.txGroupId}`
			}
			const response = await parentEpml.request("apiCall", {
				type: "api",
				url: `/chat/messages?chatreference=${originalMsg.signature}&reverse=true${msgQuery}`,
			})
			let decodedMsgs = []
		response.map((eachMessage) => {
                const msgRes = decodeMessageFunc(eachMessage, isReceipient, _publicKey)
				let parsedMessageObj = originalMsg
		try {
			parsedMessageObj = JSON.parse(msgRes.decodedMessage)
			decodedMsgs.push({
				...msgRes,
				decodedMessage: parsedMessageObj
			})
		} catch (error) {
			
		}
			
            })

			const filterReactions = decodedMsgs.filter((message)=> {
				if(!message.decodedMessage) return false
				if(!message.decodedMessage.reactions || !Array.isArray(message.decodedMessage.reactions)) return false
				return message.decodedMessage.reactions.length > 0
			})

			const filterWithoutReactions = decodedMsgs.filter((message)=> {
				
				return message.sender === originalMsg.sender
			})
			if (filterReactions && Array.isArray(filterReactions) && filterReactions.length !== 0) {
				let responseItem = { ...filterReactions[0] }
				let parsedMessageMsg = {}
				try {
					parsedMessageMsg = JSON.parse(originalMsg.decodedMessage)
					
				} catch (error) {
					
				}
				let originalPosterMsg = {
					...originalMsg,
					decodedMessage: parsedMessageMsg
				}
				if(filterWithoutReactions.length > 0){
					originalPosterMsg = {
						...filterWithoutReactions[0] 
					}

					
				}

				originalPosterMsg.decodedMessage = JSON.stringify({
					...originalPosterMsg.decodedMessage,
					reactions: responseItem.decodedMessage.reactions
				})

				msgItem = {
					...originalPosterMsg,
					senderName: originalMsg.senderName,
					sender: originalMsg.sender,
					editedTimestamp: response[0].timestamp,
				}
			}

			
			if ((!Array.isArray(filterReactions) || (filterReactions || []).length === 0) && filterWithoutReactions.length > 0) {
				let responseItem = { ...filterWithoutReactions[0] }
				const originalPosterMsg = JSON.stringify(responseItem.decodedMessage)
				msgItem = {
					...responseItem,
					decodedMessage: originalPosterMsg,
					timestamp: originalMsg.timestamp,
					editedTimestamp: responseItem.timestamp,
				}
			}
		} catch (error) {
		}
		return msgItem
	})
	const updateMessages = await Promise.all(findNewMessages)
	const findNewMessages2 = updateMessages.map(async (originalMsg) => {
		let parsedMessageObj = originalMsg
		try {
			parsedMessageObj = JSON.parse(originalMsg.decodedMessage)
		} catch (error) {
			return originalMsg
		}
		let msgItem = originalMsg
		try {
			let msgQuery = `&involving=${originalMsg.recipient}&involving=${originalMsg.sender}`
			if (!isReceipient) {
				msgQuery = `&txGroupId=${originalMsg.txGroupId}`
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
			
				
				const response = await parentEpml.request("apiCall", {
					type: "api",
					url: `/chat/messages?chatreference=${parsedMessageObj.repliedTo}&reverse=true${msgQuery}`,
				})

				let decodedMsgs = []
				response.map((eachMessage) => {
					const msgRes = decodeMessageFunc(eachMessage, isReceipient, _publicKey)
					let parsedMessageObj = originalMsg
			try {
				parsedMessageObj = JSON.parse(msgRes.decodedMessage)
				decodedMsgs.push({
					...msgRes,
					decodedMessage: parsedMessageObj
				})
			} catch (error) {
				
			}
				
				})
		const filterWithoutReactions = decodedMsgs.filter((message)=> {
				
			return message.sender === originalMsg.sender
		})
				const originalReplyMessage = originalReply.timestamp ? originalReply : originalReply.length !== 0 ? originalReply[0] : null
				
				if (
					originalReplyMessage &&
					filterWithoutReactions &&
					Array.isArray(filterWithoutReactions) &&
					filterWithoutReactions.length !== 0
				) {
					const decodeOriginalReply = decodeMessageFunc(originalReplyMessage, isReceipient, _publicKey)

					const decodeUpdatedReply = decodeMessageFunc(filterWithoutReactions[0], isReceipient, _publicKey)
					const formattedRepliedToData = {
						...decodeUpdatedReply,
						senderName: decodeOriginalReply.senderName,
						sender: decodeOriginalReply.sender,
					}
					msgItem = {
						...originalMsg,
						repliedToData: formattedRepliedToData,
					}
				} else {
					

					if (
						originalReplyMessage
					) {
						
						msgItem = {
							...originalMsg,
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
