"use strict";
import TransactionBase from "../TransactionBase.js"
import { QORT_DECIMALS } from "../../constants.js"

export default class CreateGroupTransaction extends TransactionBase {
    constructor() {
        super()
        this.type = 22
    }

    render(html) {
        return html`
            You are requesting to creating the group below:
            <div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
                <div>Group Name: <span style="color: #000;">${this._rGroupName}</span></div>
                <br>
                <div>Group Description: <span style="color: #000;">${this._rGroupDesc}</span></div>
                <br>
                <div>Group Type: <span style="color: #000;">${this.myGroupType === 1 ? "Public" : "Private"}</span></div>
            </div>
            On pressing confirm, the group request will be sent!
        `
    }

    set fee(fee) {
        this._fee = fee * QORT_DECIMALS
        this._feeBytes = this.constructor.utils.int64ToBytes(this._fee)
    }

    set rGroupName(rGroupName) {
        this._rGroupName = rGroupName;
        this._rGroupNameBytes = this.constructor.utils.stringtoUTF8Array(this._rGroupName.toLocaleLowerCase())
        this._rGroupNameLength = this.constructor.utils.int32ToBytes(this._rGroupNameBytes.length)
    }

    set rGroupDesc(rGroupDesc) {
        this._rGroupDesc = rGroupDesc;
        this._rGroupDescBytes = this.constructor.utils.stringtoUTF8Array(this._rGroupDesc.toLocaleLowerCase())
        this._rGroupDescLength = this.constructor.utils.int32ToBytes(this._rGroupDescBytes.length)
    }

    set rGroupType(rGroupType) {
        this.myGroupType = rGroupType;
        this._rGroupType = new Uint8Array(1)
        this._rGroupType[0] = rGroupType;
    }

    set rGroupApprovalThreshold(rGroupApprovalThreshold) {
        this._rGroupApprovalThreshold = new Uint8Array(1)
        this._rGroupApprovalThreshold[0] = rGroupApprovalThreshold;
    }

    set rGroupMinimumBlockDelay(rGroupMinimumBlockDelay) {
        this._rGroupMinimumBlockDelay = rGroupMinimumBlockDelay;
        this._rGroupMinimumBlockDelayBytes = this.constructor.utils.int32ToBytes(this._rGroupMinimumBlockDelay)
    }

    set rGroupMaximumBlockDelay(rGroupMaximumBlockDelay) {
        this._rGroupMaximumBlockDelay = rGroupMaximumBlockDelay;
        this._rGroupMaximumBlockDelayBytes = this.constructor.utils.int32ToBytes(this._rGroupMaximumBlockDelay)
    }

    get params() {
        const params = super.params;
        params.push(
            this._rGroupNameLength,
            this._rGroupNameBytes,
            this._rGroupDescLength,
            this._rGroupDescBytes,
            this._rGroupType,
            this._rGroupApprovalThreshold,
            this._rGroupMinimumBlockDelayBytes,
            this._rGroupMaximumBlockDelayBytes,
            this._feeBytes
        )
        return params;
    }
}