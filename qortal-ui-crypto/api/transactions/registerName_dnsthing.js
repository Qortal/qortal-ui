"use strict";
/*
    TO DO
*/
(function(){
    function generateSignatureRegisterNameTransaction(keyPair, lastReference, owner, name, value, fee, timestamp) => {
        const data = generateRegisterNameTransactionBase(keyPair.publicKey, lastReference, owner, name, value, fee, timestamp);
        return nacl.sign.detached(data, keyPair.privateKey);
    }

    function generateRegisterNameTransaction(keyPair, lastReference, owner, name, value, fee, timestamp, signature) => {
        return appendBuffer( generateRegisterNameTransactionBase(keyPair.publicKey, lastReference, owner, name, value, fee, timestamp),
                            signature );
    }

    function generateRegisterNameTransactionBase(publicKey, lastReference, owner, name, value, fee, timestamp) => {
        const txType = TYPES.REGISTER_NAME_TRANSACTION;
        const typeBytes = int32ToBytes(txType);
        const timestampBytes = int64ToBytes(timestamp);
        const feeBytes = int64ToBytes(fee * 100000000);
        const nameSizeBytes = int32ToBytes(name.length);
        const valueSizeBytes = int32ToBytes(value.length);

        let data = new Uint8Array();

        data = appendBuffer(data, typeBytes);
        data = appendBuffer(data, timestampBytes);
        data = appendBuffer(data, lastReference);
        data = appendBuffer(data, publicKey);
        data = appendBuffer(data, owner);
        data = appendBuffer(data, nameSizeBytes);
        data = appendBuffer(data, name);
        data = appendBuffer(data, valueSizeBytes);
        data = appendBuffer(data, value);
        data = appendBuffer(data, feeBytes);

        return data;
    }
}())