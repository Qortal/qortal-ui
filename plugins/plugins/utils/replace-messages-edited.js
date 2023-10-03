// export const replaceMessagesEdited = async ({
// 	decodedMessages,
// 	parentEpml,
//     isReceipient,
//     decodeMessageFunc,
//     _publicKey,
// 	addToUpdateMessageHashmap
// }) => {
// 	const findNewMessages = decodedMessages.map(async (msg) => {
// 		let msgItem = null
// 		try {
// 			let msgQuery = `&involving=${msg.recipient}&involving=${msg.sender}`
// 			if (!isReceipient) {
// 				msgQuery = `&txGroupId=${msg.txGroupId}`
// 			}
// 			const response = await parentEpml.request("apiCall", {
// 				type: "api",
// 				url: `/chat/messages?chatreference=${msg.signature}&reverse=true${msgQuery}&limit=1&sender=${msg.sender}&encoding=BASE64`,
// 			})

// 			if (response && Array.isArray(response) && response.length !== 0) {
// 				let responseItem = { ...response[0] }
//                 const decodeResponseItem = decodeMessageFunc(responseItem, isReceipient, _publicKey)
// 				delete decodeResponseItem.timestamp
		
// 				msgItem = {
// 					...msg,
// 					...decodeResponseItem,
// 					senderName: msg.senderName,
// 					sender: msg.sender,
// 					editedTimestamp: response[0].timestamp,
// 					originalSignature: msg.signature
// 				}
// 			}
// 		} catch (error) {
// 		}

// 		return msgItem
// 	})
// 	const updateMessages = await Promise.all(findNewMessages)
// 	const filterOutNull = updateMessages.filter((item)=> item !== 'null' && item !== null)

// 	const findNewMessages2 = filterOutNull.map(async (msg) => {
// 		let parsedMessageObj = msg
// 		try {
// 			parsedMessageObj = JSON.parse(msg.decodedMessage)
// 		} catch (error) {
// 			return msg
// 		}
// 		let msgItem = msg
// 		try {
// 			let msgQuery = `&involving=${msg.recipient}&involving=${msg.sender}`
// 			if (!isReceipient) {
// 				msgQuery = `&txGroupId=${msg.txGroupId}`
// 			}
// 			if (parsedMessageObj.repliedTo) {
// 				let originalReply
// 				if(+parsedMessageObj.version > 2){
// 					 originalReply = await parentEpml.request("apiCall", {
// 						type: "api",
// 						 url: `/chat/message/${parsedMessageObj.repliedTo}?encoding=BASE64`,
// 					})
// 				}
// 				if(+parsedMessageObj.version < 3){
// 					 originalReply = await parentEpml.request("apiCall", {
// 						type: "api",
// 						 url: `/chat/messages?reference=${parsedMessageObj.repliedTo}&reverse=true${msgQuery}&encoding=BASE64`,
// 					})
// 			   }
			
				
				

// 				const originalReplyMessage = originalReply.timestamp ? originalReply : originalReply.length !== 0 ? originalReply[0] : null

// 				const response = await parentEpml.request("apiCall", {
// 					type: "api",
// 					url: `/chat/messages?chatreference=${parsedMessageObj.repliedTo}&reverse=true${msgQuery}&limit=1&sender=${originalReplyMessage.sender}&encoding=BASE64`,
// 				})
				
// 				if (
// 					originalReplyMessage &&
// 					response &&
// 					Array.isArray(response) &&
// 					response.length !== 0
// 				) {
// 					const decodeOriginalReply = decodeMessageFunc(originalReplyMessage, isReceipient, _publicKey)

// 					const decodeUpdatedReply = decodeMessageFunc(response[0], isReceipient, _publicKey)
// 					const formattedRepliedToData = {
// 						...decodeUpdatedReply,
// 						senderName: decodeOriginalReply.senderName,
// 						sender: decodeOriginalReply.sender,
// 					}
// 					msgItem = {
// 						...msg,
// 						repliedToData: formattedRepliedToData,
// 					}
// 				} else {
					

// 					if (
// 						originalReplyMessage
// 					) {
						
// 						msgItem = {
// 							...msg,
// 							repliedToData: decodeMessageFunc(originalReplyMessage, isReceipient, _publicKey),
// 						}
// 					}
// 				}
// 			}
// 		} catch (error) {
// 		}

// 		return msgItem
// 	})
// 	const updateMessages2 = await Promise.all(findNewMessages2)
// 	console.log({updateMessages2})
// 	updateMessages2.forEach((item)=> {
// 		addToUpdateMessageHashmap(item.originalSignature, item)
// 	})
// 	return updateMessages2
// }


export const replaceMessagesEdited = async ({
    decodedMessages,
    parentEpml,
    isReceipient,
    decodeMessageFunc,
    _publicKey,
    addToUpdateMessageHashmap
}) => {
    const MAX_CONCURRENT_REQUESTS = 5; // Maximum number of concurrent requests

    const executeWithConcurrencyLimit = async (array, asyncFn) => {
        const results = [];
        const concurrencyPool = [];

        for (const item of array) {
            const promise = asyncFn(item);
            concurrencyPool.push(promise);

            if (concurrencyPool.length >= MAX_CONCURRENT_REQUESTS) {
                results.push(...await Promise.all(concurrencyPool));
                concurrencyPool.length = 0; // Clear the concurrency pool
            }
        }

        if (concurrencyPool.length > 0) {
            results.push(...await Promise.all(concurrencyPool));
        }

        return results;
    };

	const findUpdatedMessage = async (msg) => {
		let msgItem = { ...msg };
	
		try {
			let msgQuery = `&involving=${msg.recipient}&involving=${msg.sender}`;
			if (!isReceipient) {
				msgQuery = `&txGroupId=${msg.txGroupId}`;
			}
	
			// Find new messages first
			const newMsgResponse = await parentEpml.request("apiCall", {
				type: "api",
				url: `/chat/messages?chatreference=${msg.signature}&reverse=true${msgQuery}&limit=1&sender=${msg.sender}&encoding=BASE64`,
			});
	
			if (Array.isArray(newMsgResponse) && newMsgResponse.length > 0) {
				const decodeResponseItem = decodeMessageFunc(newMsgResponse[0], isReceipient, _publicKey);
				delete decodeResponseItem.timestamp;
	
				msgItem = {
					...msgItem,
					...decodeResponseItem,
					senderName: msg.senderName,
					sender: msg.sender,
					editedTimestamp: newMsgResponse[0].timestamp,
					originalSignature: msg.signature
				};
			}
	
			// Then check and find replies in the same iteration
			let parsedMessageObj;
			try {
				parsedMessageObj = JSON.parse(msg.decodedMessage);
			} catch (error) {
				// If parsing fails, return the msgItem as is
				return msgItem;
			}
	
			if (parsedMessageObj.repliedTo) {
				let originalReply;
				if(+parsedMessageObj.version > 2){
					 originalReply = await parentEpml.request("apiCall", {
						type: "api",
						url: `/chat/message/${parsedMessageObj.repliedTo}?encoding=BASE64`,
					});
				} else {
					 originalReply = await parentEpml.request("apiCall", {
						type: "api",
						url: `/chat/messages?reference=${parsedMessageObj.repliedTo}&reverse=true${msgQuery}&encoding=BASE64`,
					});
				}
	
				const originalReplyMessage = originalReply.timestamp ? originalReply : originalReply.length > 0 ? originalReply[0] : null;
	
				const replyResponse = await parentEpml.request("apiCall", {
					type: "api",
					url: `/chat/messages?chatreference=${parsedMessageObj.repliedTo}&reverse=true${msgQuery}&limit=1&sender=${originalReplyMessage.sender}&encoding=BASE64`,
				});
	
				if (
					originalReplyMessage &&
					Array.isArray(replyResponse) &&
					replyResponse.length !== 0
				) {
					const decodeOriginalReply = decodeMessageFunc(originalReplyMessage, isReceipient, _publicKey);
					const decodeUpdatedReply = decodeMessageFunc(replyResponse[0], isReceipient, _publicKey);
	
					msgItem.repliedToData = {
						...decodeUpdatedReply,
						senderName: decodeOriginalReply.senderName,
						sender: decodeOriginalReply.sender,
					};
				} else if (originalReplyMessage) {
					msgItem.repliedToData = decodeMessageFunc(originalReplyMessage, isReceipient, _publicKey);
				}
			}
	
		} catch (error) {
			// Handle or log the error gracefully
			console.error(error);
		}
	
		return msgItem;
	};
	
	const sortedMessages = decodedMessages.sort((a, b) => b.timestamp - a.timestamp);
	
	// Execute the functions with concurrency limit
	const updatedMessages = await executeWithConcurrencyLimit(sortedMessages, findUpdatedMessage);
	addToUpdateMessageHashmap(updatedMessages);
	
	return updatedMessages;
	
};
