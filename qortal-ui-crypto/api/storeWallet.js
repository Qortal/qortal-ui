import { HmacSha512, AES_CBC } from 'asmcrypto.js'
import { kdf } from './kdf.js'
// import Base58 from '../qora/deps/Base58.js'
import Base58 from './deps/Base58.js'

const getRandomValues = window.crypto ? window.crypto.getRandomValues.bind(window.crypto) : window.msCrypto.getRandomValues.bind(window.msCrypto)

export const generateSaveWalletData = async (wallet, password, kdfThreads, statusUpdateFn) => {
    statusUpdateFn('Generating random values')
    let iv = new Uint8Array(16)
    getRandomValues(iv)
    let salt = new Uint8Array(32)
    getRandomValues(salt) // Can actually use a salt this time, as we can store the salt with the wallet

    // const key = PBKDF2_HMAC_SHA512.bytes(utils.stringtoUTF8Array(password), salt, PBKDF2_ROUNDS, 64) // 512bit key to be split in two for mac/encryption
    const key = await kdf(password, salt, statusUpdateFn)
    statusUpdateFn('Encrypting seed')
    const encryptionKey = key.slice(0, 32)
    const macKey = key.slice(32, 63)
    const encryptedSeed = AES_CBC.encrypt(wallet._byteSeed, encryptionKey, false, iv)
    // const mac = HmacSha512.bytes(encryptedSeed, macKey)
    statusUpdateFn('Generating mac')
    const mac = new HmacSha512(macKey).process(encryptedSeed).finish().result
    return {
        address0: wallet._addresses[0].address,
        encryptedSeed: Base58.encode(encryptedSeed),
        salt: Base58.encode(salt),
        iv: Base58.encode(iv),
        version: wallet._walletVersion,
        mac: Base58.encode(mac),
        kdfThreads
    }
}
