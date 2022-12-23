'use strict';
import TransactionBase from '../TransactionBase.js'
import Base58 from '../../deps/Base58.js'
import { store } from '../../../api.js'
import { QORT_DECIMALS } from "../../constants.js"

export default class AddGroupAdminTransaction extends TransactionBase {
    constructor() {
        super()
        this.type = 24
    }

    render(html) {
        const conf = store.getState().config
        return html`
            Are you sure to update this group ?
            <div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
              
            </div>
            On pressing confirm, the group details will be updated!
        `
    }


    set fee(fee) {
        this._fee = fee * QORT_DECIMALS
        this._feeBytes = this.constructor.utils.int64ToBytes(this._fee)
    }
    set member(member) {
        this._member = member instanceof Uint8Array ? member : this.constructor.Base58.decode(member)
    }
  
    set _groupId(_groupId){
        this._groupBytes = this.constructor.utils.int32ToBytes(_groupId)
    }
    get params() {
        const params = super.params
        params.push(
            this._groupBytes,
            this._member,
            this._feeBytes
        )
        console.log('verify params', params)
        return params
    }
}