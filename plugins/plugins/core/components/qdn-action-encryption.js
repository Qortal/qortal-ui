import nacl from '../../../../crypto/api/deps/nacl-fast.js'
import ed2curve from '../../../../crypto/api/deps/ed2curve.js'

class Semaphore {
    constructor(count) {
        this.count = count;
        this.waiting = [];
    }

    acquire() {
        return new Promise(resolve => {
            if (this.count > 0) {
                this.count--;
                resolve();
            } else {
                this.waiting.push(resolve);
            }
        });
    }

    release() {
        if (this.waiting.length > 0) {
            const resolve = this.waiting.shift();
            resolve();
        } else {
            this.count++;
        }
    }
}

let semaphore = new Semaphore(1);
let reader = new FileReader();
export const fileToBase64 = (file) =>
    new Promise(async (resolve, reject) => {
        if (!reader) {
            reader = new FileReader();
        }
        await semaphore.acquire();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const dataUrl = reader.result;
            if (typeof dataUrl === "string") {
                const base64String = dataUrl.split(',')[1];
                reader.onload = null;
                reader.onerror = null;
                resolve(base64String);
            } else {
                reader.onload = null;
                reader.onerror = null;
                reject(new Error('Invalid data URL'));
            }
            semaphore.release();
        };
        reader.onerror = (error) => {
            reader.onload = null;
            reader.onerror = null;
            reject(error);
            semaphore.release();
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

export function uint8ArrayToObject(uint8Array) {
    // Decode the byte array using TextDecoder
    const decoder = new TextDecoder()
    const jsonString = decoder.decode(uint8Array)

    // Convert the JSON string back into an object
	return JSON.parse(jsonString)
  }

  export function objectToBase64(obj) {
    // Step 1: Convert the object to a JSON string
    const jsonString = JSON.stringify(obj);

    // Step 2: Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Step 3: Create a FileReader to read the Blob as a base64-encoded string
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // Remove 'data:application/json;base64,' prefix
          const base64 = reader.result.replace(
            'data:application/json;base64,',
            ''
          );
          resolve(base64);
        } else {
          reject(new Error('Failed to read the Blob as a base64-encoded string'));
        }
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsDataURL(blob);
    });
  }

export const encryptData = ({ data64, recipientPublicKey }) => {


	const uint8Array = base64ToUint8Array(data64)

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
        throw new Error("Error in encrypting data")
    }
}

export const encryptDataGroup = ({ data64, publicKeys }) => {
    const userPublicKey = window.parent.reduxStore.getState().app.selectedAddress.base58PublicKey
    let combinedPublicKeys = publicKeys
    if (userPublicKey) {
        combinedPublicKeys = [...publicKeys, userPublicKey]
    }

    const publicKeysDuplicateFree = [...new Set(combinedPublicKeys)];
    const Uint8ArrayData = base64ToUint8Array(data64)

    if (!(Uint8ArrayData instanceof Uint8Array)) {
        throw new Error("The Uint8ArrayData you've submitted is invalid")
    }

    try {
        const privateKey = window.parent.reduxStore.getState().app.selectedAddress.keyPair.privateKey
        if (!privateKey) {
            throw new Error("Unable to retrieve keys")
        }

        // Generate a random symmetric key for the message.
        const messageKey = new Uint8Array(32);
        window.crypto.getRandomValues(messageKey);

        const nonce = new Uint8Array(24);
        window.crypto.getRandomValues(nonce);

        // Encrypt the data with the symmetric key.
        const encryptedData = nacl.secretbox(Uint8ArrayData, nonce, messageKey);

        // Generate a keyNonce outside of the loop.
        const keyNonce = new Uint8Array(24);
        window.crypto.getRandomValues(keyNonce);

        // Encrypt the symmetric key for each recipient.
        let encryptedKeys = [];
        publicKeysDuplicateFree.forEach((recipientPublicKey) => {
            const publicKeyUnit8Array = window.parent.Base58.decode(recipientPublicKey)

            const convertedPrivateKey = ed2curve.convertSecretKey(privateKey)
            const convertedPublicKey = ed2curve.convertPublicKey(publicKeyUnit8Array)

            const sharedSecret = new Uint8Array(32)
            // the length of the sharedSecret will be 32 + 16
            // When you're encrypting data using nacl.secretbox, it's adding an authentication tag to the result, which is 16 bytes long. This tag is used for verifying the integrity and authenticity of the data when it is decrypted

            nacl.lowlevel.crypto_scalarmult(sharedSecret, convertedPrivateKey, convertedPublicKey)

            // Encrypt the symmetric key with the shared secret.
            const encryptedKey = nacl.secretbox(messageKey, keyNonce, sharedSecret);

            encryptedKeys.push(encryptedKey);
        });
        const str = "qortalGroupEncryptedData";
        const strEncoder = new TextEncoder();
        const strUint8Array = strEncoder.encode(str);

        // Convert sender's public key to Uint8Array and add to the message
        const senderPublicKeyUint8Array = window.parent.Base58.decode(userPublicKey);

        // Combine all data into a single Uint8Array.
        // Calculate size of combinedData
        let combinedDataSize = strUint8Array.length + nonce.length + keyNonce.length + senderPublicKeyUint8Array.length + encryptedData.length + 4;
        let encryptedKeysSize = 0;

        encryptedKeys.forEach((key) => {
            encryptedKeysSize += key.length;
        });

        combinedDataSize += encryptedKeysSize;

        let combinedData = new Uint8Array(combinedDataSize);

        combinedData.set(strUint8Array);
        combinedData.set(nonce, strUint8Array.length);
        combinedData.set(keyNonce, strUint8Array.length + nonce.length);
        combinedData.set(senderPublicKeyUint8Array, strUint8Array.length + nonce.length + keyNonce.length);
        combinedData.set(encryptedData, strUint8Array.length + nonce.length + keyNonce.length + senderPublicKeyUint8Array.length);

        // Initialize offset for encryptedKeys
        let encryptedKeysOffset = strUint8Array.length + nonce.length + keyNonce.length + senderPublicKeyUint8Array.length + encryptedData.length;
        encryptedKeys.forEach((key) => {
            combinedData.set(key, encryptedKeysOffset);
            encryptedKeysOffset += key.length;
        });
        const countArray = new Uint8Array(new Uint32Array([publicKeysDuplicateFree.length]).buffer);
        combinedData.set(countArray, combinedData.length - 4);
		return uint8ArrayToBase64(combinedData);

    } catch (error) {
        throw new Error("Error in encrypting data")
    }
}

export function uint8ArrayStartsWith(uint8Array, string) {
    const stringEncoder = new TextEncoder();
    const stringUint8Array = stringEncoder.encode(string);

    if (uint8Array.length < stringUint8Array.length) {
        return false;
    }

    for (let i = 0; i < stringUint8Array.length; i++) {
        if (uint8Array[i] !== stringUint8Array[i]) {
            return false;
        }
    }

    return true;
}

export function decryptDeprecatedSingle(uint8Array, publicKey) {
    const combinedData = uint8Array
    const str = "qortalEncryptedData";
    const strEncoder = new TextEncoder();
    const strUint8Array = strEncoder.encode(str);

    const strData = combinedData.slice(0, strUint8Array.length);
    const nonce = combinedData.slice(strUint8Array.length, strUint8Array.length + 24);
    const _encryptedData = combinedData.slice(strUint8Array.length + 24);

    const privateKey = window.parent.reduxStore.getState().app.selectedAddress.keyPair.privateKey
    const _publicKey = window.parent.Base58.decode(publicKey)

    if (!privateKey || !_publicKey) {

        throw new Error("Unable to retrieve keys")
    }

    const convertedPrivateKey = ed2curve.convertSecretKey(privateKey)
    const convertedPublicKey = ed2curve.convertPublicKey(_publicKey)
    const sharedSecret = new Uint8Array(32);
    nacl.lowlevel.crypto_scalarmult(sharedSecret, convertedPrivateKey, convertedPublicKey)

    const _chatEncryptionSeed = new window.parent.Sha256().process(sharedSecret).finish().result
    const _decryptedData = nacl.secretbox.open(_encryptedData, nonce, _chatEncryptionSeed)
    if (!_decryptedData) {
        throw new Error("Unable to decrypt")
    }
	return uint8ArrayToBase64(_decryptedData)
}

export function decryptGroupData(data64EncryptedData) {
    const allCombined = base64ToUint8Array(data64EncryptedData);
    const str = "qortalGroupEncryptedData";
    const strEncoder = new TextEncoder();
    const strUint8Array = strEncoder.encode(str);

    // Extract the nonce
    const nonceStartPosition = strUint8Array.length;
    const nonceEndPosition = nonceStartPosition + 24; // Nonce is 24 bytes
    const nonce = allCombined.slice(nonceStartPosition, nonceEndPosition);

    // Extract the shared keyNonce
    const keyNonceStartPosition = nonceEndPosition;
    const keyNonceEndPosition = keyNonceStartPosition + 24; // Nonce is 24 bytes
    const keyNonce = allCombined.slice(keyNonceStartPosition, keyNonceEndPosition);

    // Extract the sender's public key
    const senderPublicKeyStartPosition = keyNonceEndPosition;
    const senderPublicKeyEndPosition = senderPublicKeyStartPosition + 32; // Public keys are 32 bytes
    const senderPublicKey = allCombined.slice(senderPublicKeyStartPosition, senderPublicKeyEndPosition);

    // Calculate count first
    const countStartPosition = allCombined.length - 4; // 4 bytes before the end, since count is stored in Uint32 (4 bytes)
    const countArray = allCombined.slice(countStartPosition, countStartPosition + 4);
    const count = new Uint32Array(countArray.buffer)[0];

    // Then use count to calculate encryptedData
    const encryptedDataStartPosition = senderPublicKeyEndPosition; // start position of encryptedData
    const encryptedDataEndPosition = allCombined.length - ((count * (32 + 16)) + 4);
    const encryptedData = allCombined.slice(encryptedDataStartPosition, encryptedDataEndPosition);

    // Extract the encrypted keys
    // 32+16 = 48
    const combinedKeys = allCombined.slice(encryptedDataEndPosition, encryptedDataEndPosition + (count * 48));
    const privateKey = window.parent.reduxStore.getState().app.selectedAddress.keyPair.privateKey

    if (!privateKey) {
        throw new Error("Unable to retrieve keys")
    }

    const convertedPrivateKey = ed2curve.convertSecretKey(privateKey)
    const convertedSenderPublicKey = ed2curve.convertPublicKey(senderPublicKey)
    const sharedSecret = new Uint8Array(32)
    nacl.lowlevel.crypto_scalarmult(sharedSecret, convertedPrivateKey, convertedSenderPublicKey)
    for (let i = 0; i < count; i++) {
        const encryptedKey = combinedKeys.slice(i * 48, (i + 1) * 48);

        // Decrypt the symmetric key.
        const decryptedKey = nacl.secretbox.open(encryptedKey, keyNonce, sharedSecret);

        // If decryption was successful, decryptedKey will not be null.
        if (decryptedKey) {
            // Decrypt the data using the symmetric key.
            const decryptedData = nacl.secretbox.open(encryptedData, nonce, decryptedKey);

            // If decryption was successful, decryptedData will not be null.
            if (decryptedData) {

                return decryptedData
            }
        }
    }

    throw new Error("Unable to decrypt data")
}
