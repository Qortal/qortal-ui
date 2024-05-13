import { kdf } from './kdf'
import PhraseWallet from './PhraseWallet'
import Base58 from './deps/Base58'
import { decryptStoredWallet } from './decryptStoredWallet'

export const createWallet = async (sourceType, source, statusUpdateFn) => {
	let version, seed

	switch (sourceType) {
		case 'phrase':
			version = 2
			seed = await kdf(source.seedPhrase, void 0, statusUpdateFn)
			break
		case 'seed':
			version = 1
			seed = Base58.decode(source.seed)
			break
		case 'storedWallet':
		case 'backedUpSeed':
			version = source.wallet.version
			seed = await decryptStoredWallet(source.password, source.wallet, statusUpdateFn)
			break
		default:
			throw 'sourceType ' + sourceType + ' not recognized'
	}

	return new PhraseWallet(seed, version)
}
