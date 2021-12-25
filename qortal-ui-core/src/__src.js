// import { store } from './store'
// import * as api from 'qortal-ui-crypto'

// const createTransaction = api.createTransaction
// const processTransaction = api.processTransaction
// const signChatTransaction = api.signChatTransaction

// let _reference = new Uint8Array(64);
// window.crypto.getRandomValues(_reference);
// let reference = window.parent.Base58.encode(_reference)

// let tmstp = Date.now()

// const params = {
//     timestamp: tmstp,
//     groupID: 0,
//     lastReference: reference,
//     proofOfWorkNonce: 0
// }

// const _computePow = async (chatBytes) => {

//     const chatBytesHash = new window.parent.Sha256().process(chatBytes).finish().result

//     const hashPtr = window.parent.sbrk(32, window.parent.heap);
//     const hashAry = new Uint8Array(window.parent.memory.buffer, hashPtr, 32);
//     hashAry.set(chatBytesHash);

//     const difficulty = 15

//     const workBufferLength = 8 * 1024 * 1024;
//     const workBufferPtr = window.parent.sbrk(workBufferLength, window.parent.heap);

//     let nonce = window.parent.computePow(hashPtr, workBufferPtr, workBufferLength, difficulty)

//     return nonce;
// }

// export const send = async () => {
//     let response
//     try {
//         const tx = createTransaction(19, store.getState().app.wallet._addresses[0].keyPair, params)

//         const computedNonce = await _computePow(tx.chatBytes)

//         const signedChatBytes = signChatTransaction(tx.chatBytes, computedNonce, store.getState().app.wallet._addresses[store.getState().app.selectedAddress.nonce].keyPair)

//         const res = await processTransaction(signedChatBytes)

//         response = res
//     } catch (e) {
//         console.error(e)
//         console.error(e.message)
//         response = false
//     }
//     return response
// };
