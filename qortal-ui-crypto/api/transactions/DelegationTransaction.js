'use strict';
import TransactionBase from './TransactionBase.js'
// import { QORT_DECIMALS } from "../constants.js" // Not needed, no amount

export default class DelegationTransaction extends TransactionBase {
    constructor () {
        super()
        this.type = 18
        this.tests.push(
            () => {
                if (!(this._superNodeAddress instanceof Uint8Array && this._superNodeAddress.length == 25)) {
                    return 'Invalid recipient ' + Base58.encode(this._superNodeAddress)
                }
                return true
            }
        )
    }

    set superNodeAddress (superNodeAddress) { // Always Base58 encoded. Accepts Uint8Array or Base58 string.
        this._superNodeAddress = superNodeAddress instanceof Uint8Array ? superNodeAddress : this.constructor.Base58.decode(superNodeAddress)
    }

    get params () {
        const params = super.params
        params.push(
            this._superNodeAddress,
            this._feeBytes
        )
        return params
    }
}
