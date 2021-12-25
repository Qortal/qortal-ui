import Base58 from './deps/Base58.js'
import { kdf } from './kdf.js'
import { HmacSha512, AES_CBC } from 'asmcrypto.js'

export const decryptStoredWallet = async (password, wallet, statusFn = () => { }) => {
    statusFn('Decoding saved data')
    const encryptedSeedBytes = Base58.decode(wallet.encryptedSeed)
    const iv = Base58.decode(wallet.iv)
    const salt = Base58.decode(wallet.salt)
    statusFn('Generating decryption key')
    const key = await kdf(password, salt, statusFn)
    const encryptionKey = key.slice(0, 32)
    const macKey = key.slice(32, 63)

    statusFn('Checking key')
    const mac = new HmacSha512(macKey).process(encryptedSeedBytes).finish().result
    if (Base58.encode(mac) !== wallet.mac) {
        throw new Error('Incorrect password')
    }
    statusFn('Decrypting')
    const decryptedBytes = AES_CBC.decrypt(encryptedSeedBytes, encryptionKey, false, iv)
    return decryptedBytes
}
