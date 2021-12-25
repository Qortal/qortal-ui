'use strict';
import TransactionBase from './TransactionBase.js'
// import { QORT_DECIMALS } from '../constants.js'
import Base58 from '../deps/Base58.js'
// import { store } from '../../store.js'
import { store } from '../../api.js'

export default class PaymentTransaction extends TransactionBase {
    constructor() {
        super()
        this.type = 2
        this.tests.push(
            () => {
                if (!(this._amount >= 0)) {
                    return 'Invalid amount ' + this._amount / store.getState().config.coin.decimals
                }
                return true
            },
            () => {
                if (!(this._recipient instanceof Uint8Array && this._recipient.length == 25)) {
                    return 'Invalid recipient ' + Base58.encode(this._recipient)
                }
                return true
            }
        )
    }

    set recipient(recipient) { // Always Base58 encoded. Accepts Uint8Array or Base58 string.
        this._recipient = recipient instanceof Uint8Array ? recipient : this.constructor.Base58.decode(recipient)
    }
    set amount(amount) {
        // console.log('=====DECIMALS ', store.getState().config.coin.decimals)
        // console.log("IINIT AMOUNT: ", amount);
        this._amount = amount * store.getState().config.coin.decimals
        this._amountBytes = this.constructor.utils.int64ToBytes(this._amount)
    }
    get params() {
        const params = super.params
        params.push(
            this._recipient,
            this._amountBytes,
            this._feeBytes
        )
        return params
    }

    render(html) {
        const conf = store.getState().config
        // console.log(this)
        return html`
            <table>
                <tr>
                    <th>To</th>
                    <td>${Base58.encode(this._recipient)}</td>
                </tr>
                <tr>
                    <th>Amount</th>
                    <td>${this._amount / conf.coin.decimals} ${conf.coin.symbol}</td>
                </tr>
            </table>
        `
    }
}
//
// import txTypes from "./txTypes.js"
// import nacl from "./deps/nacl-fast.js"
// import Utils from "./Utils.js"
//
// function generateSignaturePaymentTransaction(keyPair, lastReference, recipient, amount, fee, timestamp) => {
//    const data = generatePaymentTransactionBase(keyPair.publicKey, lastReference, recipient, amount, fee, timestamp);
//    return nacl.sign.detached(data, keyPair.privateKey);
// }
//
// function generatePaymentTransaction(keyPair, lastReference, recipient, amount, fee, timestamp, signature) => {
//    return Utils.appendBuffer(generatePaymentTransactionBase(keyPair.publicKey, lastReference, recipient, amount, fee, timestamp),signature);
// }
//
// function generatePaymentTransactionBase(publicKey, lastReference, recipient, amount, fee, timestamp) => {
//    const txType = txTypes.PAYMENT_TRANSACTION;
//    const typeBytes = Utils.int32ToBytes(txType);
//    const timestampBytes = Utils.int64ToBytes(timestamp);
//    const amountBytes = Utils.int64ToBytes(amount * 100000000);
//    const feeBytes = Utils.int64ToBytes(fee * 100000000);
//
//    let data = new Uint8Array();
//
//    data = Utils.appendBuffer(data, typeBytes);
//    data = Utils.appendBuffer(data, timestampBytes);
//    data = Utils.appendBuffer(data, lastReference);
//    data = Utils.appendBuffer(data, publicKey);
//    data = Utils.appendBuffer(data, recipient);
//    data = Utils.appendBuffer(data, amountBytes);
//    data = Utils.appendBuffer(data, feeBytes);
//
//    return data;
// }
