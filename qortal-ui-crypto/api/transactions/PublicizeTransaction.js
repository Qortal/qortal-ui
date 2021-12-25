"use strict";
import ChatBase from "./chat/ChatBase.js"

export default class PublicizeTransaction extends ChatBase {
    constructor() {
        super();
        this.type = 19
        this.fee = 0
    }

    set proofOfWorkNonce(proofOfWorkNonce) {
        this._proofOfWorkNonce = this.constructor.utils.int32ToBytes(proofOfWorkNonce)
    }

    get params() {
        const params = super.params;
        params.push(
            this._proofOfWorkNonce,
            this._feeBytes
        )
        return params;
    }
}
