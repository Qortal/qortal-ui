'use strict';
import TransactionBase from './TransactionBase.js'
import Base58 from '../deps/Base58.js'
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

    set dialogto(dialogto) {
        this._dialogto = dialogto
    }

    set dialogamount(dialogamount) {
        this._dialogamount = dialogamount
    }

    set amount(amount) {
        this._amount = Math.round(amount * store.getState().config.coin.decimals)
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
        return html`
            <table>
                <tr>
                    <th>${this._dialogto}</th>
                    <td>${Base58.encode(this._recipient)}</td>
                </tr>
                <tr>
                    <th>${this._dialogamount}</th>
                    <td>${this._amount / conf.coin.decimals} ${conf.coin.symbol}</td>
                </tr>
            </table>
        `
    }
}
