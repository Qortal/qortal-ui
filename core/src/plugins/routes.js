import { store } from '../store'
import {
	doAddPluginUrl,
	doPageUrl,
	doSetChatHeads,
	doSetNode,
	doUpdateAccountInfo,
	doUpdateBlockInfo,
	doUpdateNodeInfo,
	doUpdateNodeStatus
} from '../redux/app/app-actions'
import { loadStateFromLocalStorage, saveStateToLocalStorage, } from '../localStorageHelpers'
import { requestTransactionDialog } from '../functional-components/confirm-transaction-dialog'
import { doNewMessage } from '../notifications/controller'
import * as api from 'qortal-ui-crypto'
import snackbar from '../functional-components/snackbar'


const createTransaction = api.createTransaction
const processTransaction = api.processTransaction
const processTransactionVersion2 = api.processTransactionVersion2
const signChatTransaction = api.signChatTransaction
const signArbitraryTransaction = api.signArbitraryTransaction
const signArbitraryWithFeeTransaction = api.signArbitraryWithFeeTransaction
const tradeBotCreateRequest = api.tradeBotCreateRequest
const tradeBotRespondRequest = api.tradeBotRespondRequest
const tradeBotRespondMultipleRequest = api.tradeBotRespondMultipleRequest
const signTradeBotTxn = api.signTradeBotTxn
const deleteTradeOffer = api.deleteTradeOffer
const cancelAllOffers = api.cancelAllOffers
const sendCoin = async (coin, req) => {
	let response
	try {
		const sendFn = api[`send${coin}`]
		if (sendFn) {
			response = await sendFn(req.data)
		} else {
			response = `Unsupported blockchain: ${coin}`
		}
	} catch (e) {
		console.error(e)
		console.error(e.message)
		response = e.message
	}
	return response
}

export const routes = {
	registerUrl: async (req) => {
		store.dispatch(doAddPluginUrl(req.data))
	},

	setAccountInfo: async (req) => {
		store.dispatch(doUpdateAccountInfo(req.data))
	},

	getAccountInfo: async (req) => {
		return store.getState().app.accountInfo
	},

	setChatHeads: async (req) => {
		return store.dispatch(doSetChatHeads(req.data))
	},

	getChatHeads: async (req) => {
		return store.getState().app.chatHeads
	},

	updateBlockInfo: async (req) => {
		store.dispatch(doUpdateBlockInfo(req.data))
	},

	updateNodeStatus: async (req) => {
		store.dispatch(doUpdateNodeStatus(req.data))
	},

	updateNodeInfo: async (req) => {
		store.dispatch(doUpdateNodeInfo(req.data))
	},

	setNode: async (req) => {
		store.dispatch(doSetNode(req.data))
	},

	getNodeConfig: async (req) => {
		return store.getState().app.nodeConfig
	},

	setPageUrl: async (req) => {
		return store.dispatch(doPageUrl(req.data))
	},

	getLocalStorage: async (req) => {
		return loadStateFromLocalStorage(req.data)
	},

	setLocalStorage: async (req) => {
		return saveStateToLocalStorage(req.data.key, req.data.dataObj)
	},

	apiCall: async (req) => {
		const url = req.data.url
		delete req.data.url
		return api.request(url, req.data)
	},

	addresses: async (req) => {
		return store.getState().app.wallet.addresses.map((address) => {
			return {
				address: address.address,
				color: address.color,
				nonce: address.nonce,
				textColor: address.textColor,
				base58PublicKey: address.base58PublicKey,
			}
		})
	},

	transaction: async (req) => {
		let response
		try {
			const tx = createTransaction(
				req.data.type,
				store.getState().app.wallet._addresses[req.data.nonce].keyPair,
				req.data.params
			)

			if (!req.disableModal && !req.data.disableModal) {
				await requestTransactionDialog.requestTransaction(tx)
			}

			let res

			if (req.data.apiVersion && req.data.apiVersion === 2) {
				res = await processTransactionVersion2(tx.signedBytes)
			}

			if (!req.data.apiVersion) {
				res = await processTransaction(tx.signedBytes)
			}

			let extraData = {}

			if (req.data.type === 38 && tx && tx._rewardShareKeyPair && tx._rewardShareKeyPair.secretKey) {
				extraData.rewardSharePrivateKey = Base58.encode(tx._rewardShareKeyPair.secretKey)
			}

			response = {
				success: true,
				data: res,
				extraData
			}
		} catch (e) {
			console.error(e)
			console.error(e.message)

			response = {
				success: false,
				message: e.message
			}
		}

		return response
	},

	standaloneTransaction: async (req) => {
		const rebuildUint8Array = (obj) => {
			let _array = new Uint8Array(Object.keys(obj).length)

			for (let i = 0; i < _array.byteLength; ++i) {
				_array.set([obj[i]], i)
			}

			return _array
		}

		let response

		try {
			// req.data.keyPair unfortunately "prepared" into horrible object so we need to convert back
			let _keyPair = {}

			for (let _keyName in req.data.keyPair) {
				_keyPair[_keyName] = rebuildUint8Array(
					req.data.keyPair[_keyName]
				)
			}

			const tx = createTransaction(
				req.data.type,
				_keyPair,
				req.data.params
			)

			let res

			if (req.data.apiVersion && req.data.apiVersion === 2) {
				res = await processTransactionVersion2(tx.signedBytes)
			}

			if (!req.data.apiVersion) {
				res = await processTransaction(tx.signedBytes)
			}

			response = {
				success: true,
				data: res
			}
		} catch (e) {
			console.error(e)
			console.error(e.message)

			response = {
				success: false,
				message: e.message
			}
		}

		return response
	},

	username: async (req) => {
		const state = store.getState()
		return state.user.storedWallets[state.app.wallet.addresses[0].address].name
	},

	chat: async (req) => {
		let response

		try {
			const tx = createTransaction(
				req.data.type,
				store.getState().app.wallet._addresses[req.data.nonce].keyPair,
				req.data.params
			)

			response = tx.chatBytes
		} catch (e) {
			console.error(e)
			console.error(e.message)

			response = false
		}

		return response
	},

	sign_chat: async (req) => {
		let response

		try {
			const signedChatBytes = await signChatTransaction(
				req.data.chatBytesArray,
				req.data.chatNonce,
				store.getState().app.wallet._addresses[req.data.nonce].keyPair
			)

			let res

			if (req.data.apiVersion && req.data.apiVersion === 2) {
				res = await processTransactionVersion2(signedChatBytes)
			}

			if (!req.data.apiVersion) {
				res = await processTransaction(signedChatBytes)
			}

			response = res
		} catch (e) {
			console.error(e)
			console.error(e.message)

			response = false
		}

		return response
	},

	sign_arbitrary: async (req) => {
		let response

		try {
			const signedArbitraryBytes = await signArbitraryTransaction(
				req.data.arbitraryBytesBase58,
				req.data.arbitraryBytesForSigningBase58,
				req.data.arbitraryNonce,
				store.getState().app.wallet._addresses[req.data.nonce].keyPair
			)

			let res

			if (req.data.apiVersion && req.data.apiVersion === 2) {
				res = await processTransactionVersion2(signedArbitraryBytes)
			}

			if (!req.data.apiVersion) {
				res = await processTransaction(signedArbitraryBytes)
			}

			response = res
		} catch (e) {
			console.error(e)
			console.error(e.message)

			response = false
		}

		return response
	},

	sign_arbitrary_with_fee: async (req) => {
		let response

		try {
			const signedArbitraryBytes = await signArbitraryWithFeeTransaction(
				req.data.arbitraryBytesBase58,
				req.data.arbitraryBytesForSigningBase58,
				store.getState().app.wallet._addresses[req.data.nonce].keyPair
			)

			let res

			if (req.data.apiVersion && req.data.apiVersion === 2) {
				res = await processTransactionVersion2(signedArbitraryBytes)
			}

			if (!req.data.apiVersion) {
				res = await processTransaction(signedArbitraryBytes)
			}

			response = res
		} catch (e) {
			console.error(e)
			console.error(e.message)

			response = false
		}

		return response
	},

	showNotification: async (req) => {
		doNewMessage(req.data)
	},

	showSnackBar: async (req) => {
		snackbar.add({
			labelText: req.data,
			dismiss: true
		})
	},

	tradeBotCreateRequest: async (req) => {
		let response

		try {
			const unsignedTxn = await tradeBotCreateRequest(req.data)

			const signedTxnBytes = await signTradeBotTxn(
				unsignedTxn,
				store.getState().app.selectedAddress.keyPair
			)

			let res

			if (req.data.apiVersion && req.data.apiVersion === 2) {
				res = await processTransactionVersion2(signedTxnBytes)
			}

			if (!req.data.apiVersion) {
				res = await processTransaction(signedTxnBytes)
			}

			response = res
		} catch (e) {
			console.error(e)
			console.error(e.message)

			response = e.message
		}

		return response
	},

	tradeBotRespondRequest: async (req) => {
		let response

		try {
			response = await tradeBotRespondRequest(req.data)
		} catch (e) {
			console.error(e)
			console.error(e.message)

			response = e.message
		}

		return response
	},

	tradeBotRespondMultipleRequest: async (req) => {
		let response

		try {
			response = await tradeBotRespondMultipleRequest(req.data)
		} catch (e) {
			console.error(e)
			console.error(e.message)

			response = e.message
		}

		return response
	},

	deleteTradeOffer: async (req) => {
		let response

		try {
			const unsignedTxn = await deleteTradeOffer(req.data)

			const signedTxnBytes = await signTradeBotTxn(
				unsignedTxn,
				store.getState().app.selectedAddress.keyPair
			)

			let res

			if (req.data.apiVersion && req.data.apiVersion === 2) {
				res = await processTransactionVersion2(signedTxnBytes)
			}

			if (!req.data.apiVersion) {
				res = await processTransaction(signedTxnBytes)
			}

			response = res
		} catch (e) {
			console.error(e)
			console.error(e.message)

			response = e.message
		}

		return response
	},

	cancelAllOffers: async (req) => {
		let response

		try {
			response = await cancelAllOffers(store.getState().app.selectedAddress)
		} catch (e) {
			console.error(e)
			console.error(e.message)

			response = e.message
		}

		return response
	},

	sendBtc: async (req) => sendCoin('Btc', req),

	sendLtc: async (req) => sendCoin('Ltc', req),

	sendDoge: async (req) => sendCoin('Doge', req),

	sendDgb: async (req) => sendCoin('Dgb', req),

	sendRvn: async (req) => sendCoin('Rvn', req),

	sendArrr: async (req) => sendCoin('Arrr', req),
}
