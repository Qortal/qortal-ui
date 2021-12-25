import Base58 from '../deps/Base58.js'


export const validateAddress = (address) => {
    const decodePubKey = Base58.decode(address)

    if (!(decodePubKey instanceof Uint8Array && decodePubKey.length == 25)) {
        return false
    }
    return true

}
