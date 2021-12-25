import { Epml, EpmlReadyPlugin, RequestPlugin, EpmlWorkerPlugin } from 'epml'

import utils from './cryptoUtils.js'
import { Sha512, bytes_to_base64 as bytesToBase64 } from 'asmcrypto.js'
import bcrypt from 'bcryptjs'

Epml.registerPlugin(RequestPlugin)
Epml.registerPlugin(EpmlReadyPlugin)
Epml.registerPlugin(EpmlWorkerPlugin)

const parentEpml = new Epml({ type: 'WORKER', source: self })

parentEpml.route('kdf', async req => {

    const { salt, key, nonce, staticSalt, staticBcryptSalt } = req.data
    const combinedBytes = utils.appendBuffer(salt, utils.stringtoUTF8Array(staticSalt + key + nonce))
    const sha512Hash = new Sha512().process(combinedBytes).finish().result
    const sha512HashBase64 = bytesToBase64(sha512Hash)
    const result = bcrypt.hashSync(sha512HashBase64.substring(0, 72), staticBcryptSalt)
    return { key, nonce, result }
})

parentEpml.imReady()
