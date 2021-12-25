"use strict";
import TransactionBase from "../TransactionBase.js"
import { QORT_DECIMALS } from "../../constants.js"

export default class RegisterNameTransaction extends TransactionBase {
    constructor() {
        super()
        this.type = 3
        this.fee = 0.001
        // this.tests.push(
        //     () => {
        //         if (!(this._registrantAddress instanceof Uint8Array && this._registrantAddress.length == 25)) {
        //             return "Invalid registrant " + Base58.encode(this._registrantAddress)
        //         }
        //         return true
        //     }
        // )
    }

    render(html) {
        return html`
            You are registering the name below:
            <div style="background:#eee; padding:8px; margin:8px 0; border-radius:2px;">
                <span>${this.nameText}</span>
            </div>
            On pressing confirm, the name will be registered!
        `
    }

    set name(name) {
        this.nameText = name;

        this._nameBytes = this.constructor.utils.stringtoUTF8Array(name)
        this._nameLength = this.constructor.utils.int32ToBytes(this._nameBytes.length)
    }

    set value(value) {
        this.valueText = value.length === 0 ? "Registered Name on the Qortal Chain" : value;

        this._valueBytes = this.constructor.utils.stringtoUTF8Array(this.valueText)
        this._valueLength = this.constructor.utils.int32ToBytes(this._valueBytes.length)
    }

    get params() {
        const params = super.params;
        params.push(
            this._nameLength,
            this._nameBytes,
            this._valueLength,
            this._valueBytes,
            this._feeBytes
        )
        return params;
    }
}
