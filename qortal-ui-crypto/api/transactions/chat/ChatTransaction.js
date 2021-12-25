"use strict";
import ChatBase from "./ChatBase.js"
import nacl from '../../deps/nacl-fast.js'
import ed2curve from '../../deps/ed2curve.js'
import { Sha256 } from 'asmcrypto.js'


export default class ChatTransaction extends ChatBase {
    constructor() {
        super();
        this.type = 18
        this.fee = 0
    }

    set recipientPublicKey(recipientPublicKey) {
        this._base58RecipientPublicKey = recipientPublicKey instanceof Uint8Array ? this.constructor.Base58.encode(recipientPublicKey) : recipientPublicKey
        this._recipientPublicKey = this.constructor.Base58.decode(this._base58RecipientPublicKey)

    }

    set proofOfWorkNonce(proofOfWorkNonce) {
        this._proofOfWorkNonce = this.constructor.utils.int32ToBytes(proofOfWorkNonce)
    }


    set recipient(recipient) {
        this._recipient = recipient instanceof Uint8Array ? recipient : this.constructor.Base58.decode(recipient)
        this._hasReceipient = new Uint8Array(1)
        this._hasReceipient[0] = 1
    }

    set message(message) {

        this.messageText = message;

        this._message = this.constructor.utils.stringtoUTF8Array(message)
        this._messageLength = this.constructor.utils.int32ToBytes(this._message.length)
    }

    set isEncrypted(isEncrypted) {
        this._isEncrypted = new Uint8Array(1);
        this._isEncrypted[0] = isEncrypted;

        if (isEncrypted === 1) {
            const convertedPrivateKey = ed2curve.convertSecretKey(this._keyPair.privateKey)
            const convertedPublicKey = ed2curve.convertPublicKey(this._recipientPublicKey)
            const sharedSecret = new Uint8Array(32);
            nacl.lowlevel.crypto_scalarmult(sharedSecret, convertedPrivateKey, convertedPublicKey);

            this._chatEncryptionSeed = new Sha256().process(sharedSecret).finish().result
            this._encryptedMessage = nacl.secretbox(this._message, this._lastReference.slice(0, 24), this._chatEncryptionSeed)
        }

        this._myMessage = isEncrypted === 1 ? this._encryptedMessage : this._message
        this._myMessageLenth = isEncrypted === 1 ? this.constructor.utils.int32ToBytes(this._myMessage.length) : this._messageLength
    }

    set isText(isText) {
        this._isText = new Uint8Array(1);
        this._isText[0] = isText;
    }

    get params() {
        const params = super.params;
        params.push(
            this._proofOfWorkNonce,
            this._hasReceipient,
            this._recipient,
            this._myMessageLenth,
            this._myMessage,
            this._isEncrypted,
            this._isText,
            this._feeBytes
        )
        return params;
    }
}
