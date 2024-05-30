import { parentEpml } from '../connect'

export class UnconfirmedTransactionWatcher {
	constructor() {
		this._unconfirmedTransactionStreams = {}
		this.reset() // Sets defaults

		setInterval(() => {
			Object.entries(this._addresses).forEach((addr) => this._addressTransactionCheck(addr[0]))
		}, 10 * 1000)
	}

	reset() {
		this._addresses = {}
		this._addressesUnconfirmedTransactions = {}
	}

	// Adds an address to watch
	addAddress(address) {
		const addr = address.address
		this._addresses[addr] = address
		this._addressesUnconfirmedTransactions[addr] = []
		if (this._unconfirmedTransactionStreams[addr]) return
		this._unconfirmedTransactionStreams[addr] = new EpmlStream(`unconfirmedOfAddress/${addr}`, () => this._addressesUnconfirmedTransactions[addr])
	}

	check() {
		const c = this._addressTransactionCheck()
			.then(() => setTimeout(() => this.check(), 5000))
			.catch(() => setTimeout(() => this.check(), 5000))
	}

	async _addressTransactionCheck() {
		return Promise.all(Object.keys(this._addresses).map(addr => {
			return parentEpml.request('apiCall', {
				type: 'api',
				url: `/transactions/unconfirmed`
			}).then(unconfirmedTransactions => {
				unconfirmedTransactions.filter(tx => {
					tx.creatorAddress === addr || tx.recipient === addr
				})
				this._unconfirmedTransactionStreams[addr].emit(unconfirmedTransactions)
			})
		}))
	}
}