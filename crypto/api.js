import { Sha256 } from 'asmcrypto.js'
import Base58 from './api/deps/Base58'
import Base64 from './api/deps/Base64'
import Base64Message from './api/deps/Base64Message'
import { base58PublicKeyToAddress } from './api/wallet/base58PublicKeyToAddress'
import { validateAddress } from './api/wallet/validateAddress'
import { decryptChatMessage, decryptChatMessageBase64 } from './api/transactions/chat/decryptChatMessage'
import _ from 'lodash'

window.Sha256 = Sha256
window.Base58 = Base58
window.Base64 = Base64
window.Base64Message = Base64Message
window._ = _
window.base58PublicKeyToAddress = base58PublicKeyToAddress
window.validateAddress = validateAddress
window.decryptChatMessage = decryptChatMessage
window.decryptChatMessageBase64 = decryptChatMessageBase64

export { initApi, store } from './api_deps'
export * from './api/deps/deps'
export * from './api/api'
export * from './api/registerUsername'
export { createWallet } from './api/createWallet'
