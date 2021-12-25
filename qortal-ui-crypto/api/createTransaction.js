import { transactionTypes as transactions } from './transactions/transactions.js'
import Base58 from './deps/Base58.js'
import { request } from './fetch-request'
import signChat from './transactions/chat/signChat.js'


export const createTransaction = (type, keyPair, params) => {
    const tx = new transactions[type]()
    tx.keyPair = keyPair
    Object.keys(params).forEach(param => {
        tx[param] = params[param]
    })

    return tx
}

// Compute Chat Nonce
export const computeChatNonce = bytes => request('/chat/compute', {
    method: 'POST',
    body: Base58.encode(bytes)
})

// Sign Chat Transactions
export const signChatTransaction = (chatBytes, nonce, keyPair) => {
    return signChat(chatBytes, nonce, keyPair)
}

// Process Transactions
export const processTransaction = bytes => request('/transactions/process', {
    method: 'POST',
    body: Base58.encode(bytes)
})
