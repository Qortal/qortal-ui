"use strict";
import PaymentTransaction from "./PaymentTransaction.js"
import { QORT_DECIMALS } from "../constants.js"

/* ====================================
EXTEND THE PAYMENT TRANSACTION YOU CLOWN
====================================== */ 

export default class MessageTransaction extends PaymentTransaction{
    constructor(){
        super();
        this.type = 17
        this._key = this.constructor.utils.int64ToBytes(0);
        this._isEncrypted = new Uint8Array(1); // Defaults to false
        this._isText = new Uint8Array(1); // Defaults to false
    }
    
    set message(message /* UTF8 String */){
        // ...yes? no?
        this.messageText = message;
        
        // Not sure about encoding here...
        //this._message = message instanceof Uint8Array ? message : this.constructor.Base58.decode(message);
        this._message = this.constructor.utils.stringtoUTF8Array(message)
        this._messageLength = this.constructor.utils.int64ToBytes(this._message.length)
    }
    set isEncrypted(isEncrypted){
        this._isEncrypted[0] = isEncrypted;
    }
    set isText(isText){
        this._isText[0] = isText;
    }
    get _params(){
        // dont extend super because paymentTrasaction is different
        //const params = super.params;
        return [
            this._typeBytes,
            this._timestampBytes,
            this._lastReference,
            this._keyPair.publicKey,
            this._recipient,
            this._key,
            this._amountBytes,
            this._messageLength,
            this._message,
            this._isEncrypted,
            this._isText,
            this._feeBytes
        ]
    }
}

//"use strict";
//function generateSignatureMessageTransaction(keyPair, lastReference, recipient, amount, fee, timestamp, message, isText, isEncrypted) => {
//    const data = generateMessageTransactionBase(keyPair.publicKey, lastReference, recipient, amount, fee, timestamp, message, isText, isEncrypted);
//    return nacl.sign.detached(data, keyPair.privateKey);
//}
//
//function generateMessageTransaction(keyPair, lastReference, recipient, amount, fee, timestamp, message, isText, isEncrypted, signature) => {
//    return appendBuffer(generateMessageTransactionBase(keyPair.publicKey, lastReference, recipient, amount, fee, timestamp, message, isText, isEncrypted),
//                        signature);
//}
//function generateMessageTransactionBase(publicKey, lastReference, recipient, amount, fee, timestamp, message, isText, isEncrypted) => {
//    txType = TYPES.MESSAGE_TRANSACTION;
//
//    const typeBytes = int32ToBytes(txType);
//    const timestampBytes = int64ToBytes(timestamp);
//    const amountBytes = int64ToBytes(amount * 100000000);
//    const feeBytes = int64ToBytes(fee * 100000000);
//    const messageLength = int32ToBytes(message.length);
//    const key = int64ToBytes(0);
//
//    isTextB = new Uint8Array(1);
//    isTextB[0] = isText;
//
//    isEncryptedB = new Uint8Array(1);
//    isEncryptedB[0] = isEncrypted;
//
//    let data = new Uint8Array();
//
//    data = appendBuffer(data, typeBytes);
//    data = appendBuffer(data, timestampBytes);
//    data = appendBuffer(data, lastReference);
//    data = appendBuffer(data, publicKey);
//    data = appendBuffer(data, recipient);
//    data = appendBuffer(data, key);
//    data = appendBuffer(data, amountBytes);
//    data = appendBuffer(data, messageLength);
//    data = appendBuffer(data, message);
//    data = appendBuffer(data, isEncryptedB);
//    data = appendBuffer(data, isTextB);
//    data = appendBuffer(data, feeBytes);
//
//    return data;
//}