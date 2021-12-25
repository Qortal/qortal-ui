import { parentEpml } from '../connect.js'
// import { EpmlStream } from 'epml' maybe not needed...loaded for me

export class UnconfirmedTransactionWatcher {
    constructor () {
        this._unconfirmedTransactionStreams = {}
        this.reset() // Sets defaults

        setInterval(() => {
            Object.entries(this._addresses).forEach((addr) => this._addressTransactionCheck(addr[0]))
        }, 10 * 1000)
    }

    reset () {
        this._addresses = {}
        this._addressesUnconfirmedTransactions = {}
    }

    // Adds an address to watch
    addAddress (address) {
        // console.log("Added address", address)
        const addr = address.address
        this._addresses[addr] = address
        this._addressesUnconfirmedTransactions[addr] = []

        if (this._unconfirmedTransactionStreams[addr]) return
        // console.log("CREATING A STRTRREEAAAMMMM")
        this._unconfirmedTransactionStreams[addr] = new EpmlStream(`unconfirmedOfAddress/${addr}`, () => this._addressesUnconfirmedTransactions[addr])

        // this.updateAddress(address.address)
    }

    check () {
        // console.log("checkin for unconfirmed")
        const c = this._addressTransactionCheck()
            .then(() => setTimeout(() => this.check(), 5000))
            .catch(() => setTimeout(() => this.check(), 5000))
        // console.log(c)
    }

    async _addressTransactionCheck () {
        // console.log("Checking for unconfirmed transactions")
        // console.log(this._addresses, Object.keys(this._addresses))
        return Promise.all(Object.keys(this._addresses).map(addr => {
            // console.log(`checking ${addr}`)
            return parentEpml.request('apiCall', {
                type: 'api',
                // url: `transactions/unconfirmedof/${addr}`
                url: `/transactions/unconfirmed`
            }).then(unconfirmedTransactions => {
                // unconfirmedTransactions = JSON.parse(unconfirmedTransactions)
                // console.log(unconfirmedTransactions)
                unconfirmedTransactions.filter(tx => {
                    tx.creatorAddress === addr || tx.recipient === addr
                })
                // console.log(unconfirmedTransactions, unconfirmedTransactions.length)
                // if(unconfirmedTransactions.length === 0) {
                //     return
                // }
                this._unconfirmedTransactionStreams[addr].emit(unconfirmedTransactions)
                // console.log(this._unconfirmedTransactionStreams[addr])
            })
        }))
    }
}
