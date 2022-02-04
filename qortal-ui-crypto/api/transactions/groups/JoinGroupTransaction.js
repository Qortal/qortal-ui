"use strict";
import TransactionBase from "../TransactionBase.js"
import { QORT_DECIMALS } from "../../constants.js"

export default class JoinGroupTransaction extends TransactionBase {
    constructor() {
        super()
        this.type = 31
        this.tests.push(
            () => {
                if (!(this._registrantAddress instanceof Uint8Array && this._registrantAddress.length == 25)) {
                    return "Invalid Registrant " + Base58.encode(this._registrantAddress)
                }
                return true
            }
        )
    }

    render(html) {
        return html`
            You are requesting to join the group below:
            <div style="background:#eee; padding:8px; margin:8px 0; border-radius:2px;">
                <span>${this._rGroupName}</span>
            </div>
            On pressing confirm, the group request will be sent!
        `
    }

    set fee(fee) {
        this._fee = fee * QORT_DECIMALS
        this._feeBytes = this.constructor.utils.int64ToBytes(this._fee)
    }

    set registrantAddress(registrantAddress) {// Always Base58 encoded. Accepts Uint8Array or Base58 string.
        this._registrantAddress = registrantAddress instanceof Uint8Array ? registrantAddress : this.constructor.Base58.decode(registrantAddress);
    }

    set rGroupId(rGroupId) {
        this._rGroupId = rGroupId;
        this._rGroupIdBytes = this.constructor.utils.int32ToBytes(this._rGroupId)
    }

    set rGroupName(rGroupName) {
        this._rGroupName = rGroupName;
    }

    get params() {
        const params = super.params;
        params.push(
            this._rGroupIdBytes,
            this._feeBytes
        )
        return params;
    }
}