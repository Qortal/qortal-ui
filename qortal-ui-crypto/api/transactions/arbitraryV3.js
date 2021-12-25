"use strict";
/*
TO DO
*/


(function(){
    function generateSignatureArbitraryTransactionV3(keyPair, lastReference, service, arbitraryData, fee, timestamp) => {
        const data = generateArbitraryTransactionV3Base(keyPair.publicKey, lastReference, service, arbitraryData, fee, timestamp);
        return nacl.sign.detached(data, keyPair.privateKey);
    }

    function generateArbitraryTransactionV3(keyPair, lastReference, service, arbitraryData, fee, timestamp, signature) => {
        return appendBuffer(generateArbitraryTransactionV3Base(keyPair.publicKey, lastReference, service, arbitraryData, fee, timestamp),
                            signature);
    }

    function generateArbitraryTransactionV3Base(publicKey, lastReference, service, arbitraryData, fee, timestamp) => {
        const txType = TYPES.ARBITRARY_TRANSACTION;
        const typeBytes = int32ToBytes(txType);
        const timestampBytes = int64ToBytes(timestamp);
        const feeBytes = int64ToBytes(fee * 100000000);
        const serviceBytes = int32ToBytes(service);
        const dataSizeBytes = int32ToBytes(arbitraryData.length);
        const paymentsLengthBytes = int32ToBytes(0);  // Support payments - not yet.

        var data = new Uint8Array();

        data = appendBuffer(data, typeBytes);
        data = appendBuffer(data, timestampBytes);
        data = appendBuffer(data, lastReference);
        data = appendBuffer(data, publicKey);
        data = appendBuffer(data, paymentsLengthBytes);
        // Here it is necessary to insert the payments, if there are
        data = appendBuffer(data, serviceBytes);
        data = appendBuffer(data, dataSizeBytes);
        data = appendBuffer(data, arbitraryData);
        data = appendBuffer(data, feeBytes);

        return data;
    }
}())