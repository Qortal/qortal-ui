import { request } from '../../../fetch-request.js'
import { deleteTradeOffer, signTradeBotTxn } from '../../../tradeRequest.js';
import { processTransaction } from '../../../createTransaction.js'

export const cancelAllOffers = async (requestObject) => {
    const keyPair = requestObject.keyPair;
    const publicKey = requestObject.base58PublicKey;
    const address = requestObject.address;

    const getMyOpenOffers = async () => {
        const res = await request('/crosschain/tradeoffers');
        const myOpenTradeOrders = await res.filter(order => order.mode === "OFFERING" && order.qortalCreator === address);
        return myOpenTradeOrders;
    }

    const myOpenOffers = await getMyOpenOffers();
    let response = true;
    myOpenOffers.forEach( async (openOffer) => {
        let unsignedTxn = await deleteTradeOffer({ creatorPublicKey: publicKey, atAddress: openOffer.qortalAtAddress });
        let signedTxnBytes = await signTradeBotTxn(unsignedTxn, keyPair);
        await processTransaction(signedTxnBytes);
    });
    return response
}
