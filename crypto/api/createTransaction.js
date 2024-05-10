import { transactionTypes as transactions } from './transactions/transactions'
import Base58 from './deps/Base58'
import { request } from './fetch-request'
import signChat from './transactions/chat/signChat'
import signArbitrary from './transactions/arbitrary/signArbitrary'
import signArbitraryWithFee from './transactions/arbitrary/signArbitraryWithFee'

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

// Sign Arbitrary Transactions
export const signArbitraryTransaction = (arbitraryBytesBase58, arbitraryBytesForSigningBase58, nonce, keyPair) => {
	return signArbitrary(arbitraryBytesBase58, arbitraryBytesForSigningBase58, nonce, keyPair)
}

export const signArbitraryWithFeeTransaction = (arbitraryBytesBase58, arbitraryBytesForSigningBase58, keyPair) => {
	return signArbitraryWithFee(arbitraryBytesBase58, arbitraryBytesForSigningBase58, keyPair)
}

// Process Transactions
export const processTransaction = bytes => request('/transactions/process', {
	method: 'POST',
	body: Base58.encode(bytes)
})

export const processTransactionVersion2 = bytes => request('/transactions/process?apiVersion=2', {
	method: 'POST',
	body: Base58.encode(bytes)
})

