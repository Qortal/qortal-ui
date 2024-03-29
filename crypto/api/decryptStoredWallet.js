import Base58 from './deps/Base58.js'
import {kdf} from './kdf.js'
import {AES_CBC, HmacSha512} from 'asmcrypto.js'
import {get, registerTranslateConfig} from '../../core/translate'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

export const decryptStoredWallet = async (password, wallet, statusFn = () => { }) => {
	const sfn1 = get("login.lp12")
	statusFn(sfn1)
	const encryptedSeedBytes = Base58.decode(wallet.encryptedSeed)
	const iv = Base58.decode(wallet.iv)
	const salt = Base58.decode(wallet.salt)
	const sfn2 = get("login.lp13")
	statusFn(sfn2)
	const key = await kdf(password, salt, statusFn)
	const encryptionKey = key.slice(0, 32)
	const macKey = key.slice(32, 63)
	const sfn3 = get("login.lp14")
	statusFn(sfn3)
	const mac = new HmacSha512(macKey).process(encryptedSeedBytes).finish().result
	const sfn4 = get("login.lp15")
	if (Base58.encode(mac) !== wallet.mac) {
		throw new Error(sfn4)
	}
	const sfn5 = get("login.lp16")
	statusFn(sfn5)
	return AES_CBC.decrypt(encryptedSeedBytes, encryptionKey, false, iv)
}
