import Base58 from '../deps/Base58.js'

export const validateAddress = (address) => {
	const decodePubKey = Base58.decode(address)

	return decodePubKey instanceof Uint8Array && decodePubKey.length == 25;

}
