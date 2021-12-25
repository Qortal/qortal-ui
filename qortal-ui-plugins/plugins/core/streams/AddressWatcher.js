import { parentEpml } from '../connect.js'

// Tests to see if a block or transaction should trigger an address reload...but we're not doing that yet, because of no time for good testing
const transactionTests = []
const blockTests = []

const DEFAULT_ADDRESS_INFO = {}

transactionTests.push((tx, addr) => {
    return tx.recipient === addr || tx.sender === addr
})

blockTests.push((block, addr) => {
    return block.generator === addr
})

export class AddressWatcher {
    constructor (addresses) {
        addresses = addresses || []
        this.reset()

        addresses.forEach(addr => this.addAddress(addr))
    }

    reset () {
        this._addresses = {}
        this._addressStreams = {}
    }

    // Adds an address to watch
    addAddress (address) {
        const addr = address.address
        this._addresses[addr] = address

        this._addressStreams[addr] = new EpmlStream(`address/${addr}`, () => this._addresses[addr])

        this.updateAddress(addr)
    }

    async testBlock (block) {
        // console.log('TESTING BLOCK')
        const pendingUpdateAddresses = []

        // blockTests.forEach(fn => {

        // })
        // transactionTests.forEach(fn => {
        // 
        const transactions = await parentEpml.request('apiCall', { url: `/transactions/block/${block.signature}` })
        transactions.forEach(transaction => {
            // console.log(this)
            // fn(transaction, Object.keys(this._addresses))
            // Guess the block needs transactions
            for (const addr of Object.keys(this._addresses)) {
                // const addrChanged = transactionTests.some(fn => {
                //     return fn(transaction, addr)
                // })
                // console.log('checking ' + addr)
                const addrChanged = true // Just update it every block...for now
                if (!addrChanged) return

                if (!(addr in pendingUpdateAddresses)) pendingUpdateAddresses.push(addr)
                /**
                 * In the future transactions are potentially stored from here...and address is updated excluding transactions...and also somehow manage tx pages...
                 * Probably will just make wallet etc. listen for address change and then do the api call itself. If tx. page is on, say, page 3...and there's a new transaction...
                 * it will refresh, changing the "page" to have 1 extra transaction at the top and losing 1 at the bottom (pushed to next page)
                 */
            }
        })
        pendingUpdateAddresses.forEach(addr => this.updateAddress(addr))
    }

    async updateAddress (addr) {
        // console.log('UPPPDDAAATTTINGGG AADDDRRR', addr)
        let addressRequest = await parentEpml.request('apiCall', {
            type: 'explorer',
            data: {
                addr: addr,
                txOnPage: 10
            }
        })
        // addressRequest = JSON.parse(addressRequest)
        // console.log(addressRequest, 'AAADDDREESS REQQUEESTT')
        // console.log('response: ', addressRequest)

        const addressInfo = addressRequest.success ? addressRequest.data : DEFAULT_ADDRESS_INFO
        // const addressInfo = addressRequest.success ? addressRequest.data : DEFAULT_ADDRESS_INFO
        addressInfo.transactions = []

        for (let i = addressInfo.start; i >= addressInfo.end; i--) {
            addressInfo.transactions.push(addressInfo[i])
            delete addressInfo[i]
        }
        // console.log('ADDRESS INFO', addressInfo)
        if (!(addr in this._addresses)) return

        this._addresses[addr] = addressInfo
        // console.log('---------------------------Emitting-----------------------------', this._addresses[addr], this._addressStreams[addr])
        this._addressStreams[addr].emit(addressInfo)
    }
}
