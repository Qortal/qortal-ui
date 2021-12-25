
"use strict";

import TransactionBase from "../TransactionBase.js"

import publicKeyToAddress from '../../wallet/publicKeyToAddress.js'
import { Base58 } from "../../deps/deps.js";


export default class RemoveRewardShareTransaction extends TransactionBase {
    constructor() {
        super()
        this.type = 38
    }

    render(html) {
        return html`
            You are removing a reward share transaction associated with account:
            <div style="background:#eee; padding:8px; margin:8px 0; border-radius:2px;">
                <span>${this.constructor.Base58.encode(this._recipient)}</span>
            </div>
            On pressing confirm, the rewardshare will be removed and the minting key will become invalid.
        `
    }

    set rewardShareKeyPairPublicKey(rewardShareKeyPairPublicKey) {

        this._rewardShareKeyPairPublicKey = Base58.decode(rewardShareKeyPairPublicKey)
    }

    set recipient(recipient) {

        const _address = publicKeyToAddress(this._keyPair.publicKey)
        this._recipient = recipient instanceof Uint8Array ? recipient : this.constructor.Base58.decode(recipient)
        this.fee = _address === recipient ? 0 : 0.001
    }


    set percentageShare(share) {
        this._percentageShare = share * 100
        this._percentageShareBytes = this.constructor.utils.int64ToBytes(this._percentageShare)
    }

    get params() {
        const params = super.params
        params.push(
            this._recipient,
            this._rewardShareKeyPairPublicKey,
            this._percentageShareBytes,
            this._feeBytes
        )
        return params;
    }
}
