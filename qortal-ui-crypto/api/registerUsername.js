/**
 * Not to be confused with register name...this is a special use case
 */
import { request, createTransaction, processTransaction } from './api.js'

const TX_TYPE = 3 // NAME_REGISTRATION
const CHECK_LAST_REF_INTERVAL = 30 * 1000 // err 30 seconds

const pendingAddresses = {}

// const config = store.getState().config
// const node = config.coin.node.api
// const baseUrl = node.url + node.tail

const checkLastRefs = () => {
    Object.entries(pendingAddresses).forEach(([address, fn]) => {
        // console.log(fn, address)
        request('addresses/lastreference/' + address).then(res => {
            if (res === 'false') return
            fn(res)
            delete pendingAddresses[address]
            clearInterval(lastRefInterval)
        })
        // fetch(baseUrl + 'addresses/lastreference/' + address)
        //     .then(async res => res.text())
    })
}

const lastRefInterval = setInterval(() => checkLastRefs(), CHECK_LAST_REF_INTERVAL)

const callOnLastRef = (address, fn) => {
    pendingAddresses[address] = fn
}

export const registerUsername = async ({ name, address, lastRef, keyPair }) => {
    callOnLastRef(address, lastreference => {
        const txBytes = createTransaction(TX_TYPE, keyPair, {
            registrantPublicKey: keyPair.publicKey,
            registrantAddress: address,
            name,
            value: address,
            lastReference: lastreference
        })
        processTransaction(txBytes).then(res => {})
    })
}
