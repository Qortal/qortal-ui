// Trade Bot
import TradeBotCreateRequest from './transactions/trade-portal/tradebot/TradeBotCreateRequest.js';
import TradeBotRespondRequest from './transactions/trade-portal/tradebot/TradeBotRespondRequest.js';
import signTradeBotTransaction from './transactions/trade-portal/tradebot/signTradeBotTransaction.js'

// Trade Offer
import DeleteTradeOffer from './transactions/trade-portal/tradeoffer/DeleteTradeOffer.js';

import { request } from './fetch-request'


// TradeBotCreateRequest
export const tradeBotCreateRequest = (requestObject) => {
    const txn = new TradeBotCreateRequest().createTransaction(requestObject)

    return request('/crosschain/tradebot/create', {
        method: 'POST',
        headers: {
            'Accept': 'text/plain',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(txn)
    })
}

// TradeBotRespondRequest
export const tradeBotRespondRequest = (requestObject) => {
    const txn = new TradeBotRespondRequest().createTransaction(requestObject)

    return request('/crosschain/tradebot/respond', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(txn)
    })
}


// Sign Trade Transactions
export const signTradeBotTxn = (unsignedTxn, keyPair) => {
    return signTradeBotTransaction(unsignedTxn, keyPair)
}

// Delete Trade Offer
export const deleteTradeOffer = (requestObject) => {
    const txn = new DeleteTradeOffer().createTransaction(requestObject)

    return request('/crosschain/tradeoffer', {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(txn)
    })
}

// Send BTC 
export const sendBtc = (requestObject) => {

    return request('/crosschain/btc/send', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestObject)
    })
}

// Send LTC 
export const sendLtc = (requestObject) => {

    return request('/crosschain/ltc/send', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestObject)
    })
}

// Send DOGE 
export const sendDoge = (requestObject) => {

    return request('/crosschain/doge/send', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestObject)
    })
}
