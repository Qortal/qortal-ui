"use strict";
import ChatBase from "./ChatBase.js"
import { CHAT_REFERENCE_FEATURE_TRIGGER_TIMESTAMP } from '../../constants.js'

export default class GroupChatTransaction extends ChatBase {
    constructor() {
        super();
        this.type = 18
        this.fee = 0
    }

    set proofOfWorkNonce(proofOfWorkNonce) {
        this._proofOfWorkNonce = this.constructor.utils.int32ToBytes(proofOfWorkNonce)
    }


    set hasReceipient(hasReceipient) {
        this._hasReceipient = new Uint8Array(1)
        this._hasReceipient[0] = hasReceipient
    }

    set hasChatReference(hasChatReference) {
        this._hasChatReference = new Uint8Array(1)
        this._hasChatReference[0] = hasChatReference
    }

    set chatReference(chatReference) {
        this._chatReference = chatReference instanceof Uint8Array ? chatReference : this.constructor.Base58.decode(chatReference)
    }

    set message(message) {

        this.messageText = message;

        this._message = this.constructor.utils.stringtoUTF8Array(message)
        this._messageLength = this.constructor.utils.int32ToBytes(this._message.length)
    }

    set isEncrypted(isEncrypted) {
        this._isEncrypted = new Uint8Array(1);
        this._isEncrypted[0] = isEncrypted; // Set to false...
    }

    set isText(isText) {
        this._isText = new Uint8Array(1);
        this._isText[0] = isText; // Set to true
    }

    get params() {
        const params = super.params;
        params.push(
            this._proofOfWorkNonce,
            this._hasReceipient,
            this._messageLength,
            this._message,
            this._isEncrypted,
            this._isText,
            this._feeBytes
        )

        // After the feature trigger timestamp we need to include chat reference
        if (new Date(this._timestamp).getTime() >= CHAT_REFERENCE_FEATURE_TRIGGER_TIMESTAMP) {
            params.push(this._hasChatReference)

            if (this._hasChatReference[0] == 1) {
                params.push(this._chatReference)
            }
        }

        return params;
    }
}
