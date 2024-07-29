import { store } from '../store'
import * as api from 'qortal-ui-crypto'
import snackbar from '../functional-components/snackbar'

const createTransaction = api.createTransaction
const processTransaction = api.processTransaction
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
	apiCall: async (req) => {
		const url = req.data.url
		delete req.data.url
		return api.request(url, req.data)
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

			const res = await processTransaction(tx.signedBytes)

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

			const res = await processTransaction(tx.signedBytes)

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

			response = await processTransaction(signedTxnBytes)
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

			response = await processTransaction(signedTxnBytes)
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
			response = await cancelAllOffers(
				store.getState().app.selectedAddress
			)
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
