import RIPEMD160 from '../deps/ripemd160.js'
import BROKEN_RIPEMD160 from '../deps/broken-ripemd160.js'
import { Sha256 } from 'asmcrypto.js'

import utils from '../deps/utils.js'
import Base58 from '../deps/Base58.js'
import { Buffer } from 'buffer'

import { ADDRESS_VERSION } from '../constants.js'

const repeatSHA256 = (passphrase, hashes) => {
    let hash = passphrase
    for (let i = 0; i < hashes; i++) {
        hash = new Sha256().process(hash).finish().result
    }
    return hash
}

const publicKeyToAddress = (publicKey, qora = false) => {
    const publicKeySha256 = new Sha256().process(publicKey).finish().result
    const _publicKeyHash = qora ? new BROKEN_RIPEMD160().digest(publicKeySha256) : new RIPEMD160().update(Buffer.from(publicKeySha256)).digest('hex')

    const publicKeyHash = qora ? _publicKeyHash : _publicKeyHash
    let address = new Uint8Array()

    address = utils.appendBuffer(address, [ADDRESS_VERSION])
    address = utils.appendBuffer(address, publicKeyHash)

    const checkSum = repeatSHA256(address, 2)
    address = utils.appendBuffer(address, checkSum.subarray(0, 4))

    address = Base58.encode(address)

    return address
}

export default publicKeyToAddress
