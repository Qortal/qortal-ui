import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store'
import { parentEpml } from '../show-plugin'
import { setCoinBalances } from '../../redux/app/app-actions'

class CoinBalancesController extends connect(store)(LitElement) {
	static get properties() {
		return {
			coinList: { type: Object }
		}
	}

	constructor() {
		super();
		this.coinList = {}
		this.nodeUrl = this.getNodeUrl()
		this.myNode = this.getMyNode()
		this.fetchBalance = this.fetchBalance.bind(this)
		this._updateCoinList = this._updateCoinList.bind(this)
		this.stop = false
	}

	render() {
		return html``
	}

	getNodeUrl() {
		const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		return myNode.protocol + '://' + myNode.domain + ':' + myNode.port
	}

	getMyNode() {
		return store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
	}

	async updateQortWalletBalance() {
		let qortAddress = store.getState().app.selectedAddress.address

		await parentEpml.request('apiCall', {
			url: `/addresses/balance/${qortAddress}?apiKey=${this.myNode.apiKey}`,
		}).then((res) => {
			this.qortWalletBalance = res
			store.dispatch(
				setCoinBalances({
					type: 'qort',
					fullValue: Number(res)
				})
			)
		}).catch(() => {
			console.log('error')
		})
	}

	async updateBtcWalletBalance() {
		let _url = `/crosschain/btc/walletbalance?apiKey=${this.myNode.apiKey}`
		let _body = store.getState().app.selectedAddress.btcWallet.derivedMasterPublicKey

		await parentEpml.request('apiCall', {
			url: _url,
			method: 'POST',
			body: _body
		}).then((res) => {
			if (isNaN(Number(res))) {
				//...
			} else {
				this.btcWalletBalance = (Number(res) / 1e8).toFixed(8)
				store.dispatch(
					setCoinBalances({
						type: 'btc',
						fullValue: Number(res)
					})
				)
			}
		}).catch(() => {
			console.log('error')
		})
	}

	async updateLtcWalletBalance() {
		let _url = `/crosschain/ltc/walletbalance?apiKey=${this.myNode.apiKey}`
		let _body = store.getState().app.selectedAddress.ltcWallet.derivedMasterPublicKey

		await parentEpml.request('apiCall', {
			url: _url,
			method: 'POST',
			body: _body
		}).then((res) => {
			if (isNaN(Number(res))) {
				//...
			} else {
				this.ltcWalletBalance = (Number(res) / 1e8).toFixed(8)
				store.dispatch(
					setCoinBalances({
						type: 'ltc',
						fullValue: Number(res)
					})
				)

			}
		}).catch(() => {
			console.log('error')
		})
	}

	async updateDogeWalletBalance() {
		let _url = `/crosschain/doge/walletbalance?apiKey=${this.myNode.apiKey}`
		let _body = store.getState().app.selectedAddress.dogeWallet.derivedMasterPublicKey

		await parentEpml.request('apiCall', {
			url: _url,
			method: 'POST',
			body: _body
		}).then((res) => {
			if (isNaN(Number(res))) {
				//...
			} else {
				this.dogeWalletBalance = (Number(res) / 1e8).toFixed(8)
				store.dispatch(
					setCoinBalances({
						type: 'doge',
						fullValue: Number(res)
					})
				)
			}
		}).catch(() => {
			console.log('error')
		})
	}

	async updateDgbWalletBalance() {
		let _url = `/crosschain/dgb/walletbalance?apiKey=${this.myNode.apiKey}`
		let _body = store.getState().app.selectedAddress.dgbWallet.derivedMasterPublicKey

		await parentEpml.request('apiCall', {
			url: _url,
			method: 'POST',
			body: _body
		}).then((res) => {
			if (isNaN(Number(res))) {
				//...
			} else {
				this.dgbWalletBalance = (Number(res) / 1e8).toFixed(8)
				store.dispatch(
					setCoinBalances({
						type: 'dgb',
						fullValue: Number(res)
					})
				)
			}
		}).catch(() => {
			console.log('error')
		})
	}

	async updateRvnWalletBalance() {
		let _url = `/crosschain/rvn/walletbalance?apiKey=${this.myNode.apiKey}`
		let _body = store.getState().app.selectedAddress.rvnWallet.derivedMasterPublicKey

		await parentEpml.request('apiCall', {
			url: _url,
			method: 'POST',
			body: _body
		}).then((res) => {
			if (isNaN(Number(res))) {
				//...
			} else {
				this.rvnWalletBalance = (Number(res) / 1e8).toFixed(8)
				store.dispatch(
					setCoinBalances({
						type: 'rvn',
						fullValue: Number(res)
					})
				)
			}
		}).catch(() => {
			console.log('error')
		})
	}

	async updateArrrWalletBalance() {
		let _url = `/crosschain/arrr/walletbalance?apiKey=${this.myNode.apiKey}`
		let _body = store.getState().app.selectedAddress.arrrWallet.seed58

		await parentEpml.request('apiCall', {
			url: _url,
			method: 'POST',
			body: _body,
		}).then((res) => {
			if (isNaN(Number(res))) {
				//...
			} else {
				this.arrrWalletBalance = (Number(res) / 1e8).toFixed(8)
				store.dispatch(
					setCoinBalances({
						type: 'arrr',
						fullValue: Number(res)
					})
				)
			}
		}).catch(() => {
			console.log('error')
		})
	}

	_updateCoinList(event) {
		const copyCoinList = { ...this.coinList }
		const coin = event.detail

		if (!copyCoinList[coin]) {
			try {
				if (coin === 'qort') {
					this.updateQortWalletBalance()
				} else if (coin === 'btc') {
					this.updateBtcWalletBalance()
				} else if (coin === 'ltc') {
					this.updateLtcWalletBalance()
				} else if (coin === 'doge') {
					this.updateDogeWalletBalance()
				} else if (coin === 'dgb') {
					this.updateDgbWalletBalance()
				} else if (coin === 'rvn') {
					this.updateRvnWalletBalance()
				} else if (coin === 'arrr') {
					this.updateArrrWalletBalance()
				}
			} catch (error) { }
		}

		copyCoinList[coin] = Date.now() + 120000

		this.coinList = copyCoinList
		this.requestUpdate()
	}

	async fetchCoins(arrayOfCoins) {
		const getCoinBalances = (arrayOfCoins || []).map(async (coin) => {
			if (coin === 'qort') {
				await this.updateQortWalletBalance()
			} else if (coin === 'btc') {
				await this.updateBtcWalletBalance()
			} else if (coin === 'ltc') {
				await this.updateLtcWalletBalance()
			} else if (coin === 'doge') {
				await this.updateDogeWalletBalance()
			} else if (coin === 'dgb') {
				await this.updateDgbWalletBalance()
			} else if (coin === 'rvn') {
				await this.updateRvnWalletBalance()
			} else if (coin === 'arrr') {
				await this.updateArrrWalletBalance()
			}
		})

		await Promise.all(getCoinBalances)
	}

	async fetchBalance() {
		try {
			let arrayOfCoins = []

			const copyObject = { ...this.coinList }
			const currentDate = Date.now()
			const array = Object.keys(this.coinList)

			for (const key of array) {
				const item = this.coinList[key]

				if (item < currentDate) {
					delete copyObject[key]
				} else {
					arrayOfCoins.push(key)
				}
			}

			if (!this.stop) {
				this.stop = true

				await this.fetchCoins(arrayOfCoins)

				this.stop = false
			}

			this.coinList = copyObject
		} catch (error) {
			this.stop = false
		}
	}

	connectedCallback() {
		super.connectedCallback()
		this.intervalID = setInterval(this.fetchBalance, 45000)
		window.addEventListener('ping-coin-controller-with-coin', this._updateCoinList)
	}

	disconnectedCallback() {
		if (this.intervalID) { clearInterval(this.intervalID) }
		window.removeEventListener('ping-coin-controller-with-coin', this._updateCoinList)
		super.disconnectedCallback()
	}
}

window.customElements.define('coin-balances-controller', CoinBalancesController)