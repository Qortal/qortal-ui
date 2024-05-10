import { AES_CBC, HmacSha512 } from 'asmcrypto.js'
import { kdf } from './kdf'
import Base58 from './deps/Base58'

const getRandomValues = window.crypto ? window.crypto.getRandomValues.bind(window.crypto) : window.msCrypto.getRandomValues.bind(window.msCrypto)

export const generateSaveWalletData = async (wallet, password, kdfThreads, statusUpdateFn) => {
	statusUpdateFn('Generating random values')
	let iv = new Uint8Array(16)
	getRandomValues(iv)
	let salt = new Uint8Array(32)
	getRandomValues(salt)
	const key = await kdf(password, salt, statusUpdateFn)
	statusUpdateFn('Encrypting seed')
	const encryptionKey = key.slice(0, 32)
	const macKey = key.slice(32, 63)
	const encryptedSeed = AES_CBC.encrypt(wallet._byteSeed, encryptionKey, false, iv)
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
