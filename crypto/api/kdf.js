import {store} from '../api_deps.js'
import {stateAwait} from './utils/stateAwait.js'
import {Sha512} from 'asmcrypto.js'
import utils from '../api/deps/utils.js'
import {get, registerTranslateConfig} from '../../core/translate'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

export const kdf = async (seed, salt, status = () => { }) => {
	const state = store.getState()
	const config = state.config
	const workers = state.app.workers.workers
	const kst1 = get("login.lp17")
	status(kst1)
	await stateAwait(state => state.app.workers.ready)
	const kst2 = get("login.lp18")
	status(kst2)
	salt = new Uint8Array(salt)
	const seedParts = await Promise.all(workers.map((worker, index) => {
		const nonce = index
		return worker.request('kdf', {
			key: seed,
			salt,
			nonce,
			staticSalt: config.crypto.staticSalt,
			staticBcryptSalt: config.crypto.staticBcryptSalt
		}).then(data => {
			let jsonData
			try {
				jsonData = JSON.parse(data)
				data = jsonData
			} catch (e) {
				// ...
			}
			const kst3 = get("login.lp19")
			if (seed !== data.key) throw new Error(kst3 + seed + ' !== ' + data.key)
			const kst4 = get("login.lp20")
			if (nonce !== data.nonce) throw new Error(kst4)
			return data.result
		})
	}))
	const kst5 = get("login.lp21")
	status(kst5)
	const result = new Sha512().process(utils.stringtoUTF8Array(config.crypto.staticSalt + seedParts.reduce((a, c) => a + c))).finish().result
	const kst6 = get("login.lp22")
	status(kst6)
	return result
}
