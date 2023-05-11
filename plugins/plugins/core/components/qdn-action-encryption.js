import nacl from '../../../../crypto/api/deps/nacl-fast.js'
import ed2curve from '../../../../crypto/api/deps/ed2curve.js'


export const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const dataUrl = reader.result;
            if (typeof dataUrl === "string") {
                const base64String = dataUrl.split(',')[1];
                resolve(base64String);
            } else {
                reject(new Error('Invalid data URL'));
            }
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });



export function uint8ArrayToBase64(uint8Array) {
    const length = uint8Array.length;
    let binaryString = '';
    const chunkSize = 1024 * 1024; // Process 1MB at a time

    for (let i = 0; i < length; i += chunkSize) {
        const chunkEnd = Math.min(i + chunkSize, length);
        const chunk = uint8Array.subarray(i, chunkEnd);
        binaryString += Array.from(chunk, byte => String.fromCharCode(byte)).join('');
    }

    return btoa(binaryString);
}


export function base64ToUint8Array(base64) {
    const binaryString = atob(base64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }

    return bytes
}


export const encryptData = ({ data64, recipientPublicKey }) => {


    const Uint8ArrayData = base64ToUint8Array(data64)
    const uint8Array = Uint8ArrayData

    if (!(uint8Array instanceof Uint8Array)) {

        throw new Error("The Uint8ArrayData you've submitted is invalid")
    }
    try {
        const privateKey = window.parent.reduxStore.getState().app.selectedAddress.keyPair.privateKey
        if (!privateKey) {

            throw new Error("Unable to retrieve keys")
        }
        const publicKeyUnit8Array = window.parent.Base58.decode(recipientPublicKey)

        const convertedPrivateKey = ed2curve.convertSecretKey(privateKey)
        const convertedPublicKey = ed2curve.convertPublicKey(publicKeyUnit8Array)
        const sharedSecret = new Uint8Array(32)
        nacl.lowlevel.crypto_scalarmult(sharedSecret, convertedPrivateKey, convertedPublicKey)

        const chatEncryptionSeed = new window.parent.Sha256().process(sharedSecret).finish().result

        const nonce = new Uint8Array(24);
        window.crypto.getRandomValues(nonce);
        const encryptedData = nacl.secretbox(uint8Array, nonce, chatEncryptionSeed)

        const str = "qortalEncryptedData";
        const strEncoder = new TextEncoder();
        const strUint8Array = strEncoder.encode(str);

        const combinedData = new Uint8Array(strUint8Array.length + nonce.length + encryptedData.length);

        combinedData.set(strUint8Array);

        combinedData.set(nonce, strUint8Array.length);
        combinedData.set(encryptedData, strUint8Array.length + nonce.length);


        const uint8arrayToData64 = uint8ArrayToBase64(combinedData)

        return {
            encryptedData: uint8arrayToData64,
            recipientPublicKey
        }
    } catch (error) {
        console.log({ error })
        throw new Error("Error in encrypting data")
    }
}