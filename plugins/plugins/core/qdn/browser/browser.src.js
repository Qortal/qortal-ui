import {html, LitElement} from 'lit'
import {Epml} from '../../../../epml'
import {Sha256} from 'asmcrypto.js'
import {
	cancelTradeOfferTradeBot,
	createBuyOrderTx,
	getGroupAdmins,
	getPublishesFromAdmins,
	getPublishesFromAdminsAdminSpace,
	getUserWalletFunc,
	isUsingPublicNode,
	Loader,
	processTransactionV2,
	publishData,
	requestQueueGetAtAddresses,
	tradeBotCreateRequest,
	getArrrSyncStatus,
	getNodeInfo,
	getNodeStatus
} from '../../../utils/classes'
import {appendBuffer} from '../../../utils/utilities'
import {QORT_DECIMALS} from '../../../../../crypto/api/constants'
import {mimeToExtensionMap, listOfAllQortalRequests} from '../../components/qdn-action-constants'
import {
	createSymmetricKeyAndNonce,
	decryptGroupEncryptionWithSharingKey,
	decryptSingle,
	encryptSingle,
	uint8ArrayToObject,
	validateSecretKey
} from '../../components/GroupEncryption'
import {
	base64ToUint8Array,
	decryptDeprecatedSingle,
	decryptGroupData,
	decryptGroupDataNew,
	encryptDataGroup,
	encryptDataGroupNew,
	fileToBase64,
	groupSecretkeys,
	objectToBase64,
	roundUpToDecimals,
	uint8ArrayStartsWith,
	uint8ArrayToBase64
} from '../../components/qdn-action-encryption'
import {webBrowserModalStyles, webBrowserStyles} from '../../components/plugins-css'
import * as actions from '../../components/qdn-action-types'
import isElectron from 'is-electron'
import ShortUniqueId from 'short-unique-id'
import WebWorker from 'web-worker:./computePowWorkerFile.js'
import WebWorkerChat from 'web-worker:./computePowWorker.js'
import Base58 from '../../../../../crypto/api/deps/Base58'
import ed2curve from '../../../../../crypto/api/deps/ed2curve'
import nacl from '../../../../../crypto/api/deps/nacl-fast'
import '@material/mwc-button'
import '@material/mwc-icon'
import '@material/mwc-checkbox'

// Multi language support
import {get, registerTranslateConfig, translate, use} from '../../../../../core/translate'

registerTranslateConfig({
	loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

const sellerForeignFee = {
	LITECOIN: {
		value: "~0.00005",
		ticker: "LTC"
	},
	DOGECOIN: {
		value: "~0.005",
		ticker: "DOGE"
	},
	BITCOIN: {
		value: "~0.0001",
		ticker: "BTC"
	},
	DIGIBYTE: {
		value: "~0.0005",
		ticker: "DGB"
	},
	RAVENCOIN: {
		value: "~0.006",
		ticker: "RVN"
	},
	PIRATECHAIN: {
		value: "~0.0002",
		ticker: "ARRR"
	}
}

class WebBrowser extends LitElement {
	static get properties() {
		return {
			selectedAddress: { type: Object },
			url: { type: String },
			name: { type: String },
			service: { type: String },
			identifier: { type: String },
			path: { type: String },
			preview: { type: String },
			dev: { type: String },
			link: { type: String },
			displayUrl: { type: String },
			followedNames: { type: Array },
			blockedNames: { type: Array },
			theme: { type: String, reflect: true },
			btcFeePerByte: { type: Number },
			ltcFeePerByte: { type: Number },
			dogeFeePerByte: { type: Number },
			dgbFeePerByte: { type: Number },
			rvnFeePerByte: { type: Number },
			arrrWalletAddress: { type: String }
		}
	}

	static get observers() {
		return ['_kmxKeyUp(amount)']
	}

	static get styles() {
		return [webBrowserStyles]
	}

	constructor() {
		super()
		this.url = 'about:blank'
		this.uid = new ShortUniqueId()
		this.myAddress = window.parent.reduxStore.getState().app.selectedAddress
		this._publicKey = { key: '', hasPubKey: false }
		const urlParams = new URLSearchParams(window.location.search)
		this.name = urlParams.get('name')
		this.service = urlParams.get('service')
		this.identifier = urlParams.get('identifier') != null ? urlParams.get('identifier') : null
		this.path = urlParams.get('path') != null ? (urlParams.get('path').startsWith('/') ? '' : '/') + urlParams.get('path') : ''
		this.preview = urlParams.get('preview')
		this.link = urlParams.get('link')
		this.dev = urlParams.get('dev')
		this.followedNames = []
		this.blockedNames = []
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
		this.loader = new Loader()

		// Build initial display URL
		let displayUrl

		if (this.dev === 'FRAMEWORK') {
			displayUrl = 'qortal://app/development'
		} else {
			displayUrl = 'qortal://' + this.service + '/' + this.name

			if (this.identifier && this.identifier !== 'null' && this.identifier !== 'default') {
				displayUrl = displayUrl.concat('/' + this.identifier)
			}

			if (this.path != null && this.path !== '/') {
				displayUrl = displayUrl.concat(this.path)
			}
		}

		this.displayUrl = displayUrl

		const getFollowedNames = async () => {
			this.followedNames = await parentEpml.request('apiCall', {
				url: `/lists/followedNames?apiKey=${this.getApiKey()}`
			})

			setTimeout(
				getFollowedNames,
				this.config.user.nodeSettings.pingInterval
			)
		}

		const getBlockedNames = async () => {
			this.blockedNames = await parentEpml.request('apiCall', {
				url: `/lists/blockedNames?apiKey=${this.getApiKey()}`
			})

			setTimeout(
				getBlockedNames,
				this.config.user.nodeSettings.pingInterval
			)
		}

		const render = () => {
			const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
			const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port

			if (this.preview != null && this.preview.length > 0) {
				// In preview mode we access the preview URL path directly
				this.url = `${nodeUrl}${this.preview}&theme=${this.theme}`
			} else if (this.dev === 'FRAMEWORK') {
				this.url = `${this.link}`
			} else {
				// Normal mode
				this.url = `${nodeUrl}/render/${this.service}/${this.name}${this.path != null ? this.path : ''}?theme=${this.theme}&identifier=${(this.identifier != null && this.identifier !== 'null') ? this.identifier : ''}`
			}
		}

		this.selectedAddress = {}
		this.btcFeePerByte = 0.00000100
		this.ltcFeePerByte = 0.00000030
		this.dogeFeePerByte = 0.00001000
		this.dgbFeePerByte = 0.00000010
		this.rvnFeePerByte = 0.00001125
		this.arrrWalletAddress = ''

		let configLoaded = false

		parentEpml.ready().then(() => {
			parentEpml.subscribe('selected_address', async (selectedAddress) => {
				selectedAddress = JSON.parse(selectedAddress)

				if (!selectedAddress || Object.entries(selectedAddress).length === 0) {
					return
				}

				this.selectedAddress = selectedAddress
				this.btcWallet = window.parent.reduxStore.getState().app.selectedAddress.btcWallet
				this.ltcWallet = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet
				this.dogeWallet = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet
				this.dgbWallet = window.parent.reduxStore.getState().app.selectedAddress.dgbWallet
				this.rvnWallet = window.parent.reduxStore.getState().app.selectedAddress.rvnWallet
				this.arrrWallet = window.parent.reduxStore.getState().app.selectedAddress.arrrWallet
			})

			parentEpml.subscribe('config', (c) => {
				this.config = JSON.parse(c)
				if (!configLoaded) {
					render()
					setTimeout(getFollowedNames, 1)
					setTimeout(getBlockedNames, 1)
					configLoaded = true
				}
			})
		})
	}

	render() {
		return html`
				<div id="websitesWrapper" style="width:auto; padding:10px; background: var(--white);">
					<div class="layout horizontal center">
						<div class="address-bar">
							<mwc-button @click=${() => this.goBack()} title="${translate('general.back')}" class="address-bar-button">
							<mwc-icon>arrow_back_ios</mwc-icon>
						</mwc-button>
							<mwc-button @click=${() => this.goForward()} title="${translate('browserpage.bchange1')}" class="address-bar-button">
							<mwc-icon>arrow_forward_ios</mwc-icon>
						</mwc-button>
							<mwc-button @click=${() => this.refresh()} title="${translate('browserpage.bchange2')}" class="address-bar-button">
							<mwc-icon>refresh</mwc-icon>
						</mwc-button>
							<mwc-button @click=${() => this.goBackToList()} title="${translate('browserpage.bchange3')}" class="address-bar-button">
							<mwc-icon>home</mwc-icon>
						</mwc-button>
							<input @keydown=${this._handleKeyDown} style="width: 550px; color: var(--black);" id="address" type="text" value="${this.displayUrl}">
							${this.renderFullScreen()}
							<mwc-button @click=${() => this.delete()} title="${translate('browserpage.bchange4')} ${this.service} ${this.name} ${translate('browserpage.bchange5')}" class="address-bar-button float-right">
							<mwc-icon>delete</mwc-icon>
						</mwc-button>
							${this.renderBlockUnblockButton()}
							${this.renderFollowUnfollowButton()}
						</div>
						<div class="iframe-container">
							<iframe id="browser-iframe" src="${this.url}" sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals" allow="fullscreen; clipboard-read; clipboard-write;">
								<span style="color: var(--black);">${translate('browserpage.bchange6')}</span>
							</iframe>
						</div>
					</div>
				</div>
		`
	}

	firstUpdated() {
		this.changeTheme()
		this.changeLanguage()

		this.btcWallet = window.parent.reduxStore.getState().app.selectedAddress.btcWallet
		this.ltcWallet = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet
		this.dogeWallet = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet
		this.dgbWallet = window.parent.reduxStore.getState().app.selectedAddress.dgbWallet
		this.rvnWallet = window.parent.reduxStore.getState().app.selectedAddress.rvnWallet
		this.arrrWallet = window.parent.reduxStore.getState().app.selectedAddress.arrrWallet

		window.addEventListener('storage', () => {
			const checkLanguage = localStorage.getItem('qortalLanguage')
			const checkTheme = localStorage.getItem('qortalTheme')

			use(checkLanguage)

			if (checkTheme === 'dark') {
				this.theme = 'dark'
			} else {
				this.theme = 'light'
			}

			document.querySelector('html').setAttribute('theme', this.theme)
		})

		if (!isElectron()) {
		} else {
			window.addEventListener('contextmenu', (event) => {
				event.preventDefault()
				window.parent.electronAPI.showMyMenu()
			})
		}

		window.addEventListener('message', async (event) => {
			if (event == null || event.data == null || event.data.length === 0 || event.data.action == null) {
				return
			}

			let response = '{"error": "Request could not be fulfilled"}'
			let data = event.data

			switch (data.action) {
				case actions.IS_USING_PUBLIC_NODE: {
					response = await isUsingPublicNode()
				}
					break

				case actions.GET_ARRR_SYNC_STATUS: {
					response = await getArrrSyncStatus()
				}
					break

				case actions.GET_NODE_INFO: {
					response = await getNodeInfo()
				}
					break

				case actions.GET_NODE_STATUS: {
					response = await getNodeStatus()
				}
					break

				case actions.ADMIN_ACTION: {
					let type = data.type
					let value = data.value
					let res1 = await showModalAndWait(
						actions.ADMIN_ACTION,
						{
							service: this.service,
							name: this.name,
							type: type,
							value: value
						}
					)
					if (res1 && res1.action === 'accept') {
						try {
							// Determine the API endpoint based on the type
							let apiEndpoint = ''
							// Default method
							let method = 'GET'
							// Flag to include value in body
							let includeValueInBody = false
							switch (type.toLowerCase()) {
								case 'stop':
									apiEndpoint = '/admin/stop'
									break
								case 'restart':
									apiEndpoint = '/admin/restart'
									break
								case 'bootstrap':
									apiEndpoint = '/admin/bootstrap'
									break
								case 'addmintingaccount':
									apiEndpoint = '/admin/mintingaccounts'
									method = 'POST'
									includeValueInBody = true
									break
								case 'removemintingaccount':
									apiEndpoint = '/admin/mintingaccounts'
									method = 'DELETE'
									includeValueInBody = true
									break
								case 'forcesync':
									apiEndpoint = '/admin/forcesync'
									method = 'POST'
									includeValueInBody = true
									break
								case 'addpeer':
									apiEndpoint = '/peers'
									method = 'POST'
									includeValueInBody = true
									break
								case 'removepeer':
									apiEndpoint = '/peers'
									method = 'DELETE'
									includeValueInBody = true
									break
								default:
									console.error(`Unknown admin action type: ${type}`)
									break
							}
							// Set up options for the API call
							let options = {
								url: `${apiEndpoint}?apiKey=${this.getApiKey()}`,
								method: method
							}
							// Include value in body if required
							if (includeValueInBody) {
								options.headers = {
									'Content-Type': 'text/plain'
								}
								options.body = value // Include the peer or minting account value
							}
							// Send the API request
							let apiResponse = await parentEpml.request('apiCall', options)
							response = JSON.stringify(apiResponse)
						} catch (error) {
							const data = {}
							data['error'] = `Error performing admin action: ${error.message}`
							response = JSON.stringify(data)
						}
					} else {
						const data = {}
						data['error'] = `User declined admin action: ${type}`
						response = JSON.stringify(data)
					}
				}
					break

				case actions.SHOW_ACTIONS: {
					response = listOfAllQortalRequests
				}
					break

				case actions.GET_USER_ACCOUNT: {
					let skip = false
					if (window.parent.reduxStore.getState().app.qAPPAutoAuth) {
						skip = true
					}
					let res1
					if (!skip) {
						res1 = await showModalAndWait(
							actions.GET_USER_ACCOUNT,
							{
								service: this.service,
								name: this.name
							}
						)
					}
					if ((res1 && res1.action === 'accept') || skip) {
						let account = {}
						account['address'] = this.selectedAddress.address
						account['publicKey'] =
							this.selectedAddress.base58PublicKey
						response = JSON.stringify(account)
						break
					} else {
						const data = {}
						data['error'] = "User declined to share account details"
						response = JSON.stringify(data)
					}
				}
					break

				case actions.ENCRYPT_DATA: {
					try {
						let dataSentBack = {}
						let data64 = data.data64
						let publicKeys = data.publicKeys || []
						if (data.file) {
							data64 = await fileToBase64(data.file)
						}
						if (!data64) {
							dataSentBack['error'] = "Please include data to encrypt"
							response = JSON.stringify(dataSentBack)
							break
						}
						const encryptDataResponse = encryptDataGroup({
							data64, publicKeys: publicKeys
						})
						if (encryptDataResponse) {
							data64 = encryptDataResponse
							response = JSON.stringify(encryptDataResponse)
							break
						} else {
							dataSentBack['error'] = "Unable to encrypt"
							response = JSON.stringify(dataSentBack)
							break
						}
					} catch (error) {
						const data = {}
						data['error'] = error.message || "Error in encrypting data"
						response = JSON.stringify(data)
					}
				}
					break

				case actions.DECRYPT_DATA: {
					const { encryptedData, publicKey } = data
					try {
						let data = {}
						if (!encryptedData) {
							data['error'] = `Missing fields: encryptedData`
							response = JSON.stringify(data)
							break

						}
						const uint8Array = base64ToUint8Array(encryptedData)
						const startsWithQortalEncryptedData = uint8ArrayStartsWith(uint8Array, "qortalEncryptedData")
						if (startsWithQortalEncryptedData) {
							if (!publicKey) {
								data['error'] = `Missing fields: publicKey`
								response = JSON.stringify(data)
								break
							}
							const decryptedDataToBase64 = decryptDeprecatedSingle(uint8Array, publicKey)
							response = JSON.stringify(decryptedDataToBase64)
							break
						}
						const startsWithQortalGroupEncryptedData = uint8ArrayStartsWith(uint8Array, "qortalGroupEncryptedData")
						if (startsWithQortalGroupEncryptedData) {
							const decryptedData = decryptGroupData(encryptedData)
							const decryptedDataToBase64 = uint8ArrayToBase64(decryptedData)
							response = JSON.stringify(decryptedDataToBase64)
							break

						}
						data['error'] = "Unable to decrypt"
						response = JSON.stringify(data)
						break
					} catch (error) {
						const data = {}
						data['error'] = error.message || "Error in decrypting data"
						response = JSON.stringify(data)
					}
				}
					break

				case actions.ENCRYPT_QORTAL_GROUP_DATA: {
					let data64 = data.data64 ? data.data64 : data.base64
					let groupId = data.groupId
					let isAdmins = data.isAdmins
					let dataSentBack = {}
					let secretKeyObject
					if (!groupId) {
						dataSentBack['error'] = "Please provide a groupId"
						response = JSON.stringify(dataSentBack)
						break
					}
  					if (data.file || data.blob) {
						data64 = await fileToBase64(data.file || data.blob)
					}
					if (!data64) {
						dataSentBack['error'] = "Please include data to encrypt"
						response = JSON.stringify(dataSentBack)
						break
					}
					if (!isAdmins) {
						if (
							groupSecretkeys[groupId] &&
							groupSecretkeys[groupId].secretKeyObject &&
							groupSecretkeys[groupId].timestamp &&
							(Date.now() - groupSecretkeys[groupId].timestamp) < 1200000
						) {
							secretKeyObject = groupSecretkeys[groupId].secretKeyObject
						}
						if(!secretKeyObject) {
							const { names } = await getGroupAdmins(groupId)
							const publish = await getPublishesFromAdmins(names, groupId)
							if (publish === false) {
								dataSentBack['error'] = "No group key found."
								response = JSON.stringify(dataSentBack)
								break
							}
							const resData = await parentEpml.request('apiCall', {
								type: 'api',
								url: `/arbitrary/DOCUMENT_PRIVATE/${publish.name}/${publish.identifier}?encoding=base64`
							})
							const decryptedKey = await this.decryptResourceQDN(resData)
							const dataint8Array = base64ToUint8Array(decryptedKey.data)
							const decryptedKeyToObject = uint8ArrayToObject(dataint8Array)
							if (!validateSecretKey(decryptedKeyToObject)) {
								dataSentBack['error'] = "SecretKey is not valid"
								response = JSON.stringify(dataSentBack)
								break
							}
							secretKeyObject = decryptedKeyToObject
							let groupSecretkeys = {}
							groupSecretkeys[`${groupId}`] = {
								secretKeyObject,
								timestamp: Date.now()
							}
						}
					} else {
						if (
							groupSecretkeys[`admins-${groupId}`] &&
							groupSecretkeys[`admins-${groupId}`].secretKeyObject &&
							groupSecretkeys[`admins-${groupId}`].timestamp &&
							(Date.now() - groupSecretkeys[`admins-${groupId}`].timestamp) < 1200000
						) {
							secretKeyObject = groupSecretkeys[`admins-${groupId}`].secretKeyObject
						}
						if (!secretKeyObject) {
							const { names } = await getGroupAdmins(groupId)
							const publish = await getPublishesFromAdminsAdminSpace(names, groupId)
							if (publish === false) {
								dataSentBack['error'] = "No group key found."
								response = JSON.stringify(dataSentBack)
								break
							}
							const resData = await parentEpml.request('apiCall', {
								type: 'api',
								url: `/arbitrary/DOCUMENT_PRIVATE/${publish.name}/${publish.identifier}?encoding=base64`
							})
							const decryptedKey = await this.decryptResourceQDN(resData)
							const dataint8Array = base64ToUint8Array(decryptedKey.data)
							const decryptedKeyToObject = uint8ArrayToObject(dataint8Array)
							if (!validateSecretKey(decryptedKeyToObject)) {
								dataSentBack['error'] = "SecretKey is not valid"
								response = JSON.stringify(dataSentBack)
								break
							}
							secretKeyObject = decryptedKeyToObject
							let groupSecretkeys = {}
							groupSecretkeys[`admins-${groupId}`] = {
								secretKeyObject,
								timestamp: Date.now()
							}
						}
					}
					const resGroupEncryptedResource = encryptSingle(data64, secretKeyObjec)
					if (resGroupEncryptedResource) {
						response = resGroupEncryptedResource
					} else {
						dataSentBack['error'] = "Unable to encrypt"
						response = JSON.stringify(dataSentBack)
					}
				}
					break

				case actions.DECRYPT_QORTAL_GROUP_DATA: {
					let data64 = data.daat64 ? data.daat64 : data.base64
					let groupId = data.groupId
					let isAdmins = data.isAdmins
					let dataSentBack = {}
					let secretKeyObject
					if (!groupId) {
						dataSentBack['error'] = "Please provide a groupId"
						response = JSON.stringify(dataSentBack)
						break
					}
					if (!data64) {
						dataSentBack['error'] = "Please include data to encrypt"
						response = JSON.stringify(dataSentBack)
						break
					}
					if (!isAdmins) {
						if (
							groupSecretkeys[groupId] &&
							groupSecretkeys[groupId].secretKeyObject &&
							groupSecretkeys[groupId].timestamp &&
							(Date.now() - groupSecretkeys[groupId].timestamp) < 1200000
						) {
							secretKeyObject = groupSecretkeys[groupId].secretKeyObject
						}
						if (!secretKeyObject) {
							const { names } = await getGroupAdmins(groupId)
							const publish = await getPublishesFromAdmins(names, groupId)
							if (publish === false) {
								dataSentBack['error'] = "No group key found."
								response = JSON.stringify(dataSentBack)
								break
							}
							const resData = await parentEpml.request('apiCall', {
								type: 'api',
								url: `/arbitrary/DOCUMENT_PRIVATE/${publish.name}/${publish.identifier}?encoding=base64`
							})
							const decryptedKey = await this.decryptResourceQDN(resData)
							const dataint8Array = base64ToUint8Array(decryptedKey.data)
							const decryptedKeyToObject = uint8ArrayToObject(dataint8Array)
							if (!validateSecretKey(decryptedKeyToObject)) {
								dataSentBack['error'] = "SecretKey is not valid"
								response = JSON.stringify(dataSentBack)
								break
							}
							secretKeyObject = decryptedKeyToObject
							let groupSecretkeys ={}
							groupSecretkeys[`${groupId}`] = {
								secretKeyObject,
								timestamp: Date.now()
							}
						}
					} else {
						if (
							groupSecretkeys[`admins-${groupId}`] &&
							groupSecretkeys[`admins-${groupId}`].secretKeyObject &&
							groupSecretkeys[`admins-${groupId}`].timestamp &&
							(Date.now() - groupSecretkeys[`admins-${groupId}`].timestamp) < 1200000
						) {
							secretKeyObject = groupSecretkeys[`admins-${groupId}`].secretKeyObject
						}
						if (!secretKeyObject) {
							const { names } = await getGroupAdmins(groupId)
							const publish = await getPublishesFromAdminsAdminSpace(names, groupId)
							if (publish === false) {
								dataSentBack['error'] = "No group key found."
								response = JSON.stringify(dataSentBack)
								break
							}
							const resData = await parentEpml.request('apiCall', {
								type: 'api',
								url: `/arbitrary/DOCUMENT_PRIVATE/${publish.name}/${publish.identifier}?encoding=base64`
							})
							const decryptedKey = await this.decryptResourceQDN(resData)
							const dataint8Array = base64ToUint8Array(decryptedKey.data)
							const decryptedKeyToObject = uint8ArrayToObject(dataint8Array)
							if (!validateSecretKey(decryptedKeyToObject)) {
								dataSentBack['error'] = "SecretKey is not valid"
								response = JSON.stringify(dataSentBack)
								break
							}
							secretKeyObject = decryptedKeyToObject
							let groupSecretkeys ={}
							groupSecretkeys[`admins-${groupId}`] = {
								secretKeyObject,
								timestamp: Date.now()
							}
						}
					}
					const resGroupDecryptResource = decryptSingle(data64, secretKeyObject, false)
					if (resGroupDecryptResource) {
						response = resGroupDecryptResource
					} else {
						dataSentBack['error'] = "Unable to decrypt"
						response = JSON.stringify(dataSentBack)
					}
				}
					break

				case actions.ENCRYPT_DATA_WITH_SHARING_KEY: {
					let data64 = data.data64 || data.base64
					let publicKeys = data.publicKeys || []
					let dataSentBack = {}
					if (data.file || data.blob) {
						data64 = await fileToBase64(data.file || data.blob)
  					}
					if (!data64) {
						dataSentBack['error'] = "Please include data to encrypt"
						response = JSON.stringify(dataSentBack)
						break
					}
					const symmetricKey = createSymmetricKeyAndNonce()
					const dataObject = {
						data: data64,
						key:symmetricKey.messageKey
					}
					const dataObjectBase64 = await objectToBase64(dataObject)
					const privateKey = Base58.encode(window.parent.reduxStore.getState().app.wallet._addresses[0].keyPair.privateKey)
					const userPublicKey = Base58.encode(window.parent.reduxStore.getState().app.wallet._addresses[0].keyPair.publicKey)
					const encryptDataResponse = encryptDataGroupNew({
						data64: dataObjectBase64,
						publicKeys: publicKeys,
						privateKey,
						userPublicKey,
						customSymmetricKey: symmetricKey.messageKey
					})
					if (encryptDataResponse) {
						return encryptDataResponse
					} else {
						dataSentBack['error'] = "Unable to encrypt"
						response = JSON.stringify(dataSentBack)
					}
				}
					break

				case actions.DECRYPT_DATA_WITH_SHARING_KEY: {
					let dataSentBack = {}
					const { encryptedData, key } = data
					if (!encryptedData) {
						dataSentBack['error'] = "Please include data to decrypt"
						response = JSON.stringify(dataSentBack)
						break
					}
					const decryptedData = await decryptGroupEncryptionWithSharingKey({
						data64EncryptedData: encryptedData,
						key
					})
					const base64ToObject = JSON.parse(atob(decryptedData))
					if(base64ToObject.data) {
						return base64ToObject.data
					} else {
						dataSentBack['error'] = "No data in the decrypted resource"
						response = JSON.stringify(dataSentBack)
					}
				}
					break

				case actions.DECRYPT_AESGCM: {
					const requiredFields = ["encryptedData", "iv", "senderPublicKey"]
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					const encryptedData = data.encryptedData
					const iv = data.iv
					const senderPublicKeyBase58 = data.senderPublicKey
					// Decode keys and IV
					const senderPublicKey = Base58.decode(senderPublicKeyBase58)
					const uint8PrivateKey = window.parent.reduxStore.getState().app.selectedAddress.keyPair.privateKey
					// Convert ed25519 keys to Curve25519
					const convertedPrivateKey = ed2curve.convertSecretKey(uint8PrivateKey)
					const convertedPublicKey = ed2curve.convertPublicKey(senderPublicKey)
					// Generate shared secret
					const sharedSecret = new Uint8Array(32)
					nacl.lowlevel.crypto_scalarmult(sharedSecret, convertedPrivateKey, convertedPublicKey)
					// Derive encryption key
					let encryptionKey = new Uint8Array(32)
					encryptionKey = new Sha256().process(sharedSecret).finish().result
					// Convert IV and ciphertext from Base64
					const base64ToUint8Array = (base64) => Uint8Array.from(atob(base64), c => c.charCodeAt(0))
					const ivUint8Array = base64ToUint8Array(iv)
					const ciphertext = base64ToUint8Array(encryptedData)
					// Validate IV and key lengths
					if (ivUint8Array.length !== 12) {
						let myMsg1 = get("managegroup.mg58")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						response = '{"error": "Invalid IV: AES-GCM requires a 12-byte IV."}'
						break
					}
					if (encryptionKey.length !== 32) {
						let myMsg1 = get("managegroup.mg58")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						response = '{"error": "Invalid key: AES-GCM requires a 256-bit key."}'
						break
					}
					try {
						// Decrypt data
						const algorithm = { name: "AES-GCM", iv: ivUint8Array }
						const cryptoKey = await crypto.subtle.importKey("raw", encryptionKey, algorithm, false, ["decrypt"])
						const decryptedArrayBuffer = await crypto.subtle.decrypt(algorithm, cryptoKey, ciphertext)
						// Return decrypted data as Base64
						return uint8ArrayToBase64(new Uint8Array(decryptedArrayBuffer))
					} catch (error) {
						let myMsg1 = get("managegroup.mg58")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						response = '{"error": "Failed to decrypt the message. Ensure the data and keys are correct."}'
					}
				}
					break

				case actions.CREATE_TRADE_BUY_ORDER: {
					const node = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
					const nodeUrl = node.protocol + '://' + node.domain + ':' + node.port
					const requiredFields = ["crosschainAtInfo", "foreignBlockchain"]
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					const isGateway = await isUsingPublicNode()
					const foreignBlockchain = data.foreignBlockchain
					const atAddresses = data.crosschainAtInfo.map((order) => order.qortalAtAddress)
					const atPromises = atAddresses.map((atAddress) =>
						requestQueueGetAtAddresses.enqueue(async () => {
							const url = `${nodeUrl}/crosschain/trade/${atAddress}`
							const resAddress = await fetch(url)
							const resData = await resAddress.json()
							if (foreignBlockchain !== resData.foreignBlockchain) {
								let myMsg1 = get("modals.mpchange1")
								let myMsg2 = get("walletpage.wchange44")
								await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
								response = '{"error": "All requested ATs need to be of the same foreign Blockchain."}'
								throw new Error("All requested ATs need to be of the same foreign Blockchain.")
							}
							return resData
						})
					)
					const crosschainAtInfo = await Promise.all(atPromises)
					try {
						const resPermission = await showModalAndWait(
							actions.CREATE_TRADE_BUY_ORDER,
							{
								text1: get("modals.mpchange2"),
								text2: `${atAddresses.length}${" "} ${`buy order${atAddresses.length === 1 ? "" : "s"}`}`,
								text3: `${crosschainAtInfo.reduce((latest, cur) => {
										return latest + cur.qortAmount
									}, 0)} QORT FOR ${roundUpToDecimals(
										crosschainAtInfo.reduce((latest, cur) => {
											return latest + cur.expectedForeignAmount
										}, 0)
									)}
									${` ${crosschainAtInfo[0].foreignBlockchain}`}`,
								foreignFee: `${sellerForeignFee[foreignBlockchain].value} ${sellerForeignFee[foreignBlockchain].ticker}`
							}
						)
						if (resPermission.action === 'accept') {
							const resBuyOrder = await createBuyOrderTx({
								crosschainAtInfo,
								isGateway,
								foreignBlockchain
							})
							if (resBuyOrder.callResponse === true) {
								let myMsg1 = get("modals.mpchange3")
								let myMsg2 = get("modals.mpchange4")
								await showSuccessAndWait("REQUEST_SUCCESS", { id1: myMsg1, id2: myMsg2 })
								response = '{"success": "Successfully created buy order"}'
								break
							} else {
								let myMsg1 = get("modals.mpchange5")
								let myMsg2 = get("walletpage.wchange44")
								await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
								response = '{"error": "Failed to submit buy order."}'
								break
							}
						} else if (resPermission.action === 'reject') {
							let myMsg1 = get("transactions.declined")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
							response = '{"error": "User declined request"}'
							break
						}
					} catch (error) {
						let myMsg1 = get("managegroup.mg58")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						response = '{"error": "Failed to submit buy order."}'
						break
					}
				}
					break

				case actions.CREATE_TRADE_SELL_ORDER: {
					const requiredFields = ["qortAmount", "foreignBlockchain", "foreignAmount"]
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					const receivingAddress = await getUserWalletFunc(data.foreignBlockchain)
					try {
						const resPermission = await showModalAndWait(
							actions.CREATE_TRADE_SELL_ORDER,
							{
								text1: get("modals.mpchange6"),
								text2: `${data.qortAmount}${" "} ${`QORT`}`,
								text3: `${get("modals.mpchange7")} ${data.foreignAmount} ${data.foreignBlockchain}`,
								fee: "0.02"
							}
						)
						if (resPermission.action === 'accept') {
							const keyPair = window.parent.reduxStore.getState().app.selectedAddress.keyPair
							const userPublicKey = Base58.encode(keyPair.publicKey)
							const myRes = await tradeBotCreateRequest(
								{
									creatorPublicKey: userPublicKey,
									qortAmount: parseFloat(data.qortAmount),
									fundingQortAmount: parseFloat(data.qortAmount) + 0.001,
									foreignBlockchain: data.foreignBlockchain,
									foreignAmount: parseFloat(data.foreignAmount),
									tradeTimeout: 120,
									receivingAddress: receivingAddress.address
								},
								keyPair
							)
							if (myRes.signature) {
								let myMsg1 = get("modals.mpchange8")
								let myMsg2 = get("modals.mpchange9")
								await showSuccessAndWait("REQUEST_SUCCESS", { id1: myMsg1, id2: myMsg2 })
								response = '{"success": "Successfully created sell order"}'
								break
							} else {
								let myMsg1 = get("modals.mpchange10")
								let myMsg2 = get("walletpage.wchange44")
								await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
								response = '{"error": "Failed to submit sell order."}'
								break
							}
						} else if (resPermission.action === 'reject') {
							let myMsg1 = get("transactions.declined")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
							response = '{"error": "User declined request"}'
							break
						}
					} catch (error) {
						let myMsg1 = get("managegroup.mg58")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						response = '{"error": "Failed to submit sell order."}'
						break
					}
				}
					break

				case actions.CANCEL_TRADE_SELL_ORDER: {
					const requiredFields = ["atAddress"]
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					const node = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
					const nodeUrl = node.protocol + '://' + node.domain + ':' + node.port
					const url = `${nodeUrl}/crosschain/trade/${data.atAddress}`
					const resAddress = await fetch(url)
					const resData = await resAddress.json()
					if (!resData.qortalAtAddress) {
						let myMsg1 = get("modals.mpchange11")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						response = '{"error": "Cannot find AT info."}'
						break
					}
					try {
						const fee = await this.messageFee()
						const resPermission = await showModalAndWait(
							actions.CANCEL_TRADE_SELL_ORDER,
							{
								text1: get("modals.mpchange12"),
								text2: `${resData.qortAmount}${" "} ${`QORT`}`,
								text3: `${get("modals.mpchange7")} ${resData.expectedForeignAmount} ${resData.foreignBlockchain}`,
								fee: fee
							}
						)
						if (resPermission.action === 'accept') {
							const keyPair = window.parent.reduxStore.getState().app.selectedAddress.keyPair
							const userPublicKey = Base58.encode(keyPair.publicKey)
							const myRes = await cancelTradeOfferTradeBot(
								{
									creatorPublicKey: userPublicKey,
									atAddress: data.atAddress
								},
								keyPair
							)
							if (myRes.signature) {
								let myMsg1 = get("modals.mpchange13")
								let myMsg2 = get("modals.mpchange14")
								await showSuccessAndWait("REQUEST_SUCCESS", { id1: myMsg1, id2: myMsg2 })
								response = '{"success": "Successfully cancelled sell order."}'
								break
							} else {
								let myMsg1 = get("modals.mpchange15")
								let myMsg2 = get("walletpage.wchange44")
								await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
								response = '{"error": "Failed to cancel sell order."}'
								break
							}
						} else if (resPermission.action === 'reject') {
							let myMsg1 = get("transactions.declined")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
							response = '{"error": "User declined request"}'
							break
						}
					} catch (error) {
						let myMsg1 = get("managegroup.mg58")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						response = '{"error": "Failed to submit sell order."}'
						break
					}
				}
					break

				case actions.GET_LIST_ITEMS: {
					const requiredFields = ['list_name']
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					let skip = false
					if (window.parent.reduxStore.getState().app.qAPPAutoLists) {
						skip = true
					}
					let res1
					if (!skip) {
						res1 = await showModalAndWait(
							actions.GET_LIST_ITEMS,
							{
								list_name: data.list_name
							}
						)
					}
					if (res1 && res1.action === 'accept' || skip) {
						try {
							const list = await parentEpml.request('apiCall', {
								type: 'api',
								url: `/lists/${data.list_name}?apiKey=${this.getApiKey()}`
							})
							response = JSON.stringify(list)
							break
						} catch (error) {
							let myMsg1 = get("modals.mpchange16")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
							const data = {}
							data['error'] = "Error in retrieving list."
							response = JSON.stringify(data)
							break
						}
					} else {
						let myMsg1 = get("transactions.declined")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
						response = '{"error": "User declined request"}'
					}
				}
					break

				case actions.ADD_LIST_ITEMS: {
					const requiredFields = ['list_name', 'items']
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					const items = data.items
					const list_name = data.list_name
					const res = await showModalAndWait(
						actions.ADD_LIST_ITEMS,
						{
							list_name: list_name,
							items: items
						}
					)
					if (res && res.action === 'accept') {
						try {
							const body = {
								items: items,
							}
							const bodyToString = JSON.stringify(body)
							response = await parentEpml.request('apiCall', {
								type: 'api',
								method: 'POST',
								url: `/lists/${list_name}?apiKey=${this.getApiKey()}`,
								body: bodyToString,
								headers: {
									'Content-Type': 'application/json'
								}
							})
							break
						} catch (error) {
							let myMsg1 = get("modals.mpchange17")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
							const data = {}
							data['error'] = "Error in adding to list."
							response = JSON.stringify(data)
							break
						}
					} else {
						let myMsg1 = get("transactions.declined")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
						response = '{"error": "User declined request"}'
					}
				}
					break

				case actions.DELETE_LIST_ITEM: {
					const requiredFields = ['list_name', 'item']
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					const item = data.item
					const list_name = data.list_name
					const res = await showModalAndWait(
						actions.DELETE_LIST_ITEM,
						{
							list_name: list_name,
							item: item
						}
					)
					if (res && res.action === 'accept') {
						try {
							const body = {
								items: [item]
							}
							const bodyToString = JSON.stringify(body)
							response = await parentEpml.request('apiCall', {
								type: 'api',
								method: 'DELETE',
								url: `/lists/${list_name}?apiKey=${this.getApiKey()}`,
								body: bodyToString,
								headers: {
									'Content-Type': 'application/json'
								}
							})
							break
						} catch (error) {
							let myMsg1 = get("modals.mpchange18")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
							const data = {}
							data['error'] = "Error in delete list."
							response = JSON.stringify(data)
							break
						}
					} else {
						let myMsg1 = get("transactions.declined")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
						response = '{"error": "User declined request"}'
					}
				}
					break

				case actions.GET_FRIENDS_LIST: {
					let skip = false
					if (window.parent.reduxStore.getState().app.qAPPFriendsList) {
						skip = true
					}
					let res1
					if (!skip) {
						res1 = await showModalAndWait(
							actions.GET_FRIENDS_LIST
						)
					}
					if (res1 && res1.action === 'accept' || skip) {
						try {
							let list = JSON.parse(localStorage.getItem('friends-my-friend-list') || "[]")
							list = list.map((friend) => friend.name || "")
							response = JSON.stringify(list)
							break
						} catch (error) {
							let myMsg1 = get("modals.mpchange19")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
							const data = {}
							data['error'] = "Error in retrieving friends list."
							response = JSON.stringify(data)
							break
						}
					} else {
						let myMsg1 = get("transactions.declined")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
						response = '{"error": "User declined request"}'
					}
				}
					break

				case actions.LINK_TO_QDN_RESOURCE:
				case actions.QDN_RESOURCE_DISPLAYED:
					// Links are handled by the core, but the UI also listens for these actions in order to update the address bar.
					// Note: don't update this.url here, as we don't want to force reload the iframe each time.
					if (this.preview != null && this.preview.length > 0) {
						this.displayUrl = translate("appspage.schange40")
						break
					}
					let url = 'qortal://' + data.service + '/' + data.name
					this.path = data.path != null ? (data.path.startsWith('/') ? '' : '/') + data.path : null
					if (data.identifier != null && data.identifier !== '' && data.identifier !== 'default') {
						url = url.concat('/' + data.identifier)
					}
					if (this.path != null && this.path !== '/') {
						url = url.concat(this.path)
					}
					this.name = data.name
					this.service = data.service
					this.identifier = data.identifier
					this.displayUrl = url
					const frame = window.frameElement
					let tabId = ''
					if (frame && frame.dataset.id) {
						tabId = frame.dataset.id
					}
					if (data.name === 'Q-Mail') {
						localStorage.setItem("Q-Mail-last-visited", Date.now())
					}
					window.parent.reduxStore.dispatch(window.parent.reduxAction.addTabInfo({
						name: data.name,
						service: data.service,
						id: tabId ? tabId : ''
					}))
					break

				case actions.SET_TAB_NOTIFICATIONS: {
					const { count } = data
					if (isNaN(count)) {
						let myMsg1 = get("modals.mpchange20")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						response['error'] = 'Count is not a number.'
						break
					}
					if (count === undefined) {
						let myMsg1 = get("modals.mpchange21")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						response['error'] = 'Missing count.'
						break
					}
					window.parent.reduxStore.dispatch(window.parent.reduxAction.setTabNotifications({
						name: this.name,
						count: count
					}))
					response = true
				}
					break

				case actions.PUBLISH_QDN_RESOURCE: {
					// optional fields: encrypt:boolean recipientPublicKey:string
					const requiredFields = ['service', 'name']
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					if (!data.file && !data.data64) {
						let myMsg1 = get("modals.mpchange22")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						let data = {}
						data['error'] = "No data or file was submitted."
						response = JSON.stringify(data)
						break
					}
					// Use "default" if user hasn't specified an identifer
					const service = data.service
					const name = data.name
					let identifier = data.identifier
					let data64 = data.data64
					const filename = data.filename
					const title = data.title
					const description = data.description
					const category = data.category
					const tag1 = data.tag1
					const tag2 = data.tag2
					const tag3 = data.tag3
					const tag4 = data.tag4
					const tag5 = data.tag5
					let feeAmount = null
					if (data.identifier == null) {
						identifier = 'default'
					}
					if (data.encrypt && (!data.publicKeys || (Array.isArray(data.publicKeys) && data.publicKeys.length === 0))) {
						let myMsg1 = get("modals.mpchange23")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						let data = {}
						data['error'] = "Encrypting data requires public keys."
						response = JSON.stringify(data)
						break
					}
					if (!data.encrypt && data.service.endsWith("_PRIVATE")) {
						let myMsg1 = get("modals.mpchange24")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						let data = {}
						data['error'] = "Only encrypted data can go into private services."
						response = JSON.stringify(data)
						break
					}
					if (data.file) {
						data64 = await fileToBase64(data.file)
					}
					const getArbitraryFee = await this.getArbitraryFee()
					feeAmount = getArbitraryFee.fee
					if (data.encrypt) {
						try {
							const encryptDataResponse = encryptDataGroup({
								data64, publicKeys: data.publicKeys
							})
							if (encryptDataResponse) {
								data64 = encryptDataResponse
							}
						} catch (error) {
							let myMsg1 = get("modals.mpchange25")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
							const obj = {}
							obj['error'] = error.message ? error.message : get("modals.mpchange25")
							response = JSON.stringify(obj)
							break
						}
					}
					const res2 = await showModalAndWait(
						actions.PUBLISH_QDN_RESOURCE,
						{
							name,
							identifier,
							service,
							encrypt: data.encrypt,
							feeAmount: getArbitraryFee.feeToShow
						}
					)
					if (res2.action === 'accept') {
						if (data.file && !data.encrypt) {
							data64 = await fileToBase64(data.file)
						}
						const worker = new WebWorker()
						try {
							this.loader.show()
							const resPublish = await publishData({
								registeredName: encodeURIComponent(name),
								file: data64,
								service: service,
								identifier: encodeURIComponent(identifier),
								parentEpml,
								uploadType: 'file',
								selectedAddress: this.selectedAddress,
								worker: worker,
								isBase64: true,
								filename: filename,
								title,
								description,
								category,
								tag1,
								tag2,
								tag3,
								tag4,
								tag5,
								apiVersion: 2,
								withFee: res2.userData.isWithFee === true,
								feeAmount: feeAmount
							})
							response = JSON.stringify(resPublish)
							worker.terminate()
						} catch (error) {
							let myMsg1 = get("modals.mpchange26")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
							worker.terminate()
							const obj = {}
							obj['error'] = error.message ? error.message : get("modals.mpchange26")
							response = JSON.stringify(obj)
							console.error(error)
							break
						} finally {
							this.loader.hide()
						}
					} else if (res2.action === 'reject') {
						let myMsg1 = get("transactions.declined")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
						response = '{"error": "User declined request"}'
					}
					// Params: data.service, data.name, data.identifier, data.data64,
					// TODO: prompt user for publish. If they confirm, call `POST /arbitrary/{service}/{name}/{identifier}/base64` and sign+process transaction
					// then set the response string from the core to the `response` variable (defined above)
					// If they decline, send back JSON that includes an `error` key, such as `{"error": "User declined request"}`
				}
					break

				case actions.PUBLISH_MULTIPLE_QDN_RESOURCES: {
					const requiredFields = ['resources']
					const missingFields = []
					let feeAmount = null
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					const resources = data.resources
					if (!Array.isArray(resources)) {
						let myMsg1 = get("modals.mpchange27")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						let data = {}
						data['error'] = "Invalid data."
						response = JSON.stringify(data)
						break
					}
					if (resources.length === 0) {
						let myMsg1 = get("modals.mpchange28")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						let data = {}
						data['error'] = "No resources to publish."
						response = JSON.stringify(data)
						break
					}
					if (data.encrypt && (!data.publicKeys || (Array.isArray(data.publicKeys) && data.publicKeys.length === 0))) {
						let myMsg1 = get("modals.mpchange23")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						let data = {}
						data['error'] = "Encrypting data requires public keys."
						response = JSON.stringify(data)
						break
					}
					const getArbitraryFee = await this.getArbitraryFee()
					feeAmount = getArbitraryFee.fee
					const res2 = await showModalAndWait(
						actions.PUBLISH_MULTIPLE_QDN_RESOURCES,
						{
							resources,
							encrypt: data.encrypt,
							feeAmount: getArbitraryFee.feeToShow
						}
					)
					if (res2.action === 'reject') {
						let myMsg1 = get("transactions.declined")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
						response = '{"error": "User declined request"}'
						break

					}
					let failedPublishesIdentifiers = []
					this.loader.show()
					for (const resource of resources) {
						try {
							const requiredFields = ['service', 'name']
							const missingFields = []
							requiredFields.forEach((field) => {
								if (!resource[field]) {
									missingFields.push(field)
								}
							})
							if (missingFields.length > 0) {
								const missingFieldsString = missingFields.join(', ')
								const errorMsg = `Missing fields: ${missingFieldsString}`
								failedPublishesIdentifiers.push({
									reason: errorMsg,
									identifier: resource.identifier
								})
								continue
							}
							if (!resource.file && !resource.data64) {
								const errorMsg = 'No data or file was submitted'
								failedPublishesIdentifiers.push({
									reason: errorMsg,
									identifier: resource.identifier
								})
								continue
							}
							const service = resource.service
							const name = resource.name
							let identifier = resource.identifier
							let data64 = resource.data64
							const filename = resource.filename
							const title = resource.title
							const description = resource.description
							const category = resource.category
							const tag1 = resource.tag1
							const tag2 = resource.tag2
							const tag3 = resource.tag3
							const tag4 = resource.tag4
							const tag5 = resource.tag5
							if (resource.identifier == null) {
								identifier = 'default'
							}
							if (!data.encrypt && service.endsWith("_PRIVATE")) {
								const errorMsg = get("modals.mpchange24")
								failedPublishesIdentifiers.push({
									reason: errorMsg,
									identifier: resource.identifier
								})
								continue
							}
							if (data.file) {
								data64 = await fileToBase64(data.file)
							}
							if (data.encrypt) {
								try {
									const encryptDataResponse = encryptDataGroup({
										data64, publicKeys: data.publicKeys
									})
									if (encryptDataResponse) {
										data64 = encryptDataResponse
									}
								} catch (error) {
									const errorMsg = error.message ? error.message : get("modals.mpchange25")
									failedPublishesIdentifiers.push({
										reason: errorMsg,
										identifier: resource.identifier
									})
									continue
								}
							}
							if (resource.file && !data.encrypt) {
								data64 = await fileToBase64(resource.file)
							}
							const worker = new WebWorker()
							try {
								await publishData({
									registeredName: encodeURIComponent(name),
									file: data64,
									service: service,
									identifier: encodeURIComponent(identifier),
									parentEpml,
									uploadType: 'file',
									selectedAddress: this.selectedAddress,
									worker: worker,
									isBase64: true,
									filename: filename,
									title,
									description,
									category,
									tag1,
									tag2,
									tag3,
									tag4,
									tag5,
									apiVersion: 2,
									withFee: res2.userData.isWithFee === true,
									feeAmount: feeAmount
								})
								worker.terminate()
								await new Promise((res) => {
									setTimeout(() => {
										res()
									}, 1000)
								})
							} catch (error) {
								worker.terminate()
								const errorMsg = error.message ? error.message : get("modals.mpchange26")
								failedPublishesIdentifiers.push({
									reason: errorMsg,
									identifier: resource.identifier
								})
							}
						} catch (error) {
							failedPublishesIdentifiers.push({
								reason: get("modals.mpchange29"),
								identifier: resource.identifier
							})
						}
					}
					this.loader.hide()
					if (failedPublishesIdentifiers.length > 0) {
						let myMsg1 = failedPublishesIdentifiers
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const obj = {}
						obj['error'] = {
							unsuccessfulPublishes: failedPublishesIdentifiers
						}
						response = JSON.stringify(obj)
						this.loader.hide()
						break
					}
					response = true
				}
					break

				case actions.VOTE_ON_POLL: {
					const requiredFields = ['pollName', 'optionIndex']
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field] && data[field] !== 0) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					const pollName = data.pollName
					const optionIndex = data.optionIndex
					let pollInfo = null
					try {
						pollInfo = await parentEpml.request("apiCall", {
							type: "api",
							url: `/polls/${encodeURIComponent(pollName)}`
						})
					} catch (error) {
						let myMsg1 = get("modals.mpchange30")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const errorMsg = (error && error.message) || get("modals.mpchange30")
						let obj = {}
						obj['error'] = errorMsg
						response = JSON.stringify(obj)
						break
					}
					if (!pollInfo || pollInfo.error) {
						let myMsg1 = get("modals.mpchange30")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const errorMsg = (pollInfo && pollInfo.message) || 'Poll not found.'
						let obj = {}
						obj['error'] = errorMsg
						response = JSON.stringify(obj)
						break
					}
					try {
						this.loader.show()
						const resVoteOnPoll = await this._voteOnPoll(pollName, optionIndex)
						response = JSON.stringify(resVoteOnPoll)
					} catch (error) {
						let myMsg1 = get("modals.mpchange31")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const obj = {}
						obj['error'] = error.message ? error.message : get("modals.mpchange31")
						response = JSON.stringify(obj)
					} finally {
						this.loader.hide()
					}
				}
					break

				case actions.CREATE_POLL: {
					const requiredFields = ['pollName', 'pollDescription', 'pollOptions', 'pollOwnerAddress']
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					const pollName = data.pollName
					const pollDescription = data.pollDescription
					const pollOptions = data.pollOptions
					const pollOwnerAddress = data.pollOwnerAddress
					try {
						this.loader.show()
						const resCreatePoll = await this._createPoll(pollName, pollDescription, pollOptions, pollOwnerAddress)
						response = JSON.stringify(resCreatePoll)
					} catch (error) {
						let myMsg1 = get("modals.mpchange32")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const obj = {}
						obj['error'] = error.message ? error.message : get("modals.mpchange32")
						response = JSON.stringify(obj)
					} finally {
						this.loader.hide()
					}
				}
					break

				case actions.OPEN_NEW_TAB: {
					if (!data.qortalLink) {
						let myMsg1 = get("modals.mpchange33")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const obj = {}
						obj['error'] = 'Please enter a qortal link - qortal://...'
						response = JSON.stringify(obj)
						break
					}
					try {
						await this.linkOpenNewTab(data.qortalLink)
						response = true
						break
					} catch (error) {
						let myMsg1 = get("modals.mpchange34")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const obj = {}
						obj['error'] = "Invalid qortal link."
						response = JSON.stringify(obj)
					}
				}
					break

				case actions.NOTIFICATIONS_PERMISSION: {
					try {
						const res = await showModalAndWait(
							actions.NOTIFICATIONS_PERMISSION,
							{
								name: this.name
							}
						)
						if (res.action === 'accept') {
							this.addAppToNotificationList(this.name)
							response = true
							break
						} else {
							response = false
							break
						}
					} catch (error) {
						console.error(error)
					}
				}
					break

				case actions.SEND_LOCAL_NOTIFICATION: {
					const { title, url, icon, message } = data
					try {
						const id = `appNotificationList-${this.selectedAddress.address}`
						const checkData = localStorage.getItem(id) ? JSON.parse(localStorage.getItem(id)) : null
						if (!checkData || !checkData[this.name]) {
							let myMsg1 = get("modals.mpchange34")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
							const obj = {}
							obj['error'] = "App not on permission list"
							response = JSON.stringify(obj)
							break
						}
						const appInfo = checkData[this.name]
						const lastNotification = appInfo.lastNotification
						const interval = appInfo.interval
						if (lastNotification && interval) {
							const timeDifference = Date.now() - lastNotification
							if (timeDifference > interval) {
								parentEpml.request('showNotification', {
									title, type: "qapp-local-notification", sound: '', url, options: { body: message, icon, badge: icon }
								})
								response = true
								this.updateLastNotification(id, this.name)
								break
							} else {
								let myMsg1 = get("modals.mpchange34")
								let myMsg2 = get("walletpage.wchange44")
								await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
								const obj = {}
								obj['error'] = "Invalid data"
								response = JSON.stringify(obj)
								break
							}
						} else if (!lastNotification) {
							parentEpml.request('showNotification', {
								title, type: "qapp-local-notification", sound: '', url, options: { body: message, icon, badge: icon }
							})
							response = true
							this.updateLastNotification(id)
							break
						} else {
							let myMsg1 = get("modals.mpchange34")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
							const obj = {}
							obj['error'] = "Invalid data"
							response = JSON.stringify(obj)
							break						}
					} catch (error) {
						let myMsg1 = get("modals.mpchange35")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const obj = {}
						obj['error'] = error.message ? error.message : get("modals.mpchange35")
						response = JSON.stringify(obj)
					}
				}
					break

				case actions.SEND_CHAT_MESSAGE: {
					const message = data.message
					const recipient = data.destinationAddress
					const groupId = data.groupId
					const isRecipient = !groupId
					const sendMessage = async (messageText, chatReference) => {
						let _reference = new Uint8Array(64)
						window.crypto.getRandomValues(_reference)
						let reference = window.parent.Base58.encode(_reference)
						const sendMessageRequest = async () => {
							let chatResponse
							if (isRecipient) {
								chatResponse = await parentEpml.request('chat', {
									type: 18,
									nonce: this.selectedAddress.nonce,
									params: {
										timestamp: Date.now(),
										recipient: recipient,
										recipientPublicKey: this._publicKey.key,
										hasChatReference: 0,
										chatReference: chatReference,
										message: messageText,
										lastReference: reference,
										proofOfWorkNonce: 0,
										isEncrypted: 1,
										isText: 1
									}
								})
							}
							if (!isRecipient) {
								chatResponse = await parentEpml.request('chat', {
									type: 181,
									nonce: this.selectedAddress.nonce,
									params: {
										timestamp: Date.now(),
										groupID: Number(groupId),
										hasReceipient: 0,
										hasChatReference: 0,
										chatReference: chatReference,
										message: messageText,
										lastReference: reference,
										proofOfWorkNonce: 0,
										isEncrypted: 0,
										isText: 1
									}
								})
							}
							return await _computePow(chatResponse)
						}
						const _computePow = async (chatBytes) => {
							const difficulty = 8
							const path = window.parent.location.origin + '/memory-pow/memory-pow.wasm.full'
							const worker = new WebWorkerChat()
							let nonce = null
							let chatBytesArray = null
							await new Promise((res) => {
								worker.postMessage({ chatBytes, path, difficulty })
								worker.onmessage = e => {
									chatBytesArray = e.data.chatBytesArray
									nonce = e.data.nonce
									res()
								}
							})
							let _response = await parentEpml.request('sign_chat', {
								nonce: this.selectedAddress.nonce,
								chatBytesArray: chatBytesArray,
								chatNonce: nonce,
								apiVersion: 2
							})
							return getSendChatResponse(_response)
						}
						const getSendChatResponse = (res) => {
							if (res.signature) {
								return res
							} else if (res.error) {
								let myMsg1 = res.message
								let myMsg2 = get("walletpage.wchange44")
								showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
								throw new Error(res.message)
							} else {
								let myMsg1 = get("modals.mpchange36")
								let myMsg2 = get("walletpage.wchange44")
								showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
								throw new Error('ERROR: Could not send message.')
							}
						}
						return await sendMessageRequest()
					}
					const result = await showModalAndWait(
						actions.SEND_CHAT_MESSAGE,
						{
							message: data.message
						}
					)
					if (result.action === "accept") {
						let hasPublicKey = true
						if (isRecipient) {
							const res = await parentEpml.request('apiCall', {
								type: 'api',
								url: `/addresses/publickey/${recipient}`
							})
							if (res.error === 102) {
								this._publicKey.key = ''
								this._publicKey.hasPubKey = false
								hasPublicKey = false
							} else if (res !== false) {
								this._publicKey.key = res
								this._publicKey.hasPubKey = true
							} else {
								this._publicKey.key = ''
								this._publicKey.hasPubKey = false
								hasPublicKey = false
							}
						}
						if (!hasPublicKey && isRecipient) {
							let myMsg1 = get("modals.mpchange37")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
							response = '{"error": "Cannot send an encrypted message to this user since they do not have their publickey on chain."}'
							break
						}
						const tiptapJson = {
							type: 'doc',
							content: [{
								type: 'paragraph',
								content: [{
									type: 'text',
									text: message
								}]
							}]
						}
						const messageObject = {
							messageText: tiptapJson,
							images: [''],
							repliedTo: '',
							version: 3
						}
						const stringifyMessageObject = JSON.stringify(messageObject)
						try {
							this.loader.show()
							response = await sendMessage(stringifyMessageObject)
						} catch (error) {
							let myMsg1 = get("modals.mpchange38")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
							if (error.message) {
								let data = {}
								data['error'] = error.message
								response = JSON.stringify(data)
								break
							}
							response = '{"error": "Request could not be fulfilled."}'
						} finally {
							this.loader.hide()
						}
					} else {
						let myMsg1 = get("transactions.declined")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
						response = '{"error": "User declined request"}'
					}
					// this.loader.show()
					// Params: data.groupId, data.destinationAddress, data.message
					// TODO: prompt user to send chat message. If they confirm, sign+process a CHAT transaction
					// then set the response string from the core to the `response` variable (defined above)
					// If they decline, send back JSON that includes an `error` key, such as `{"error": "User declined request"}`
				}
					break

				case actions.JOIN_GROUP: {
					const requiredFields = ['groupId']
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					const groupId = data.groupId
					let groupInfo
					try {
						groupInfo = await parentEpml.request("apiCall", {
							type: "api",
							url: `/groups/${groupId}`
						})
					} catch (error) {
						let myMsg1 = get("modals.mpchange39")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const errorMsg = (error && error.message) || 'Group not found.'
						let obj = {}
						obj['error'] = errorMsg
						response = JSON.stringify(obj)
						break
					}
					if (!groupInfo || groupInfo.error) {
						let myMsg1 = get("modals.mpchange39")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const errorMsg = (groupInfo && groupInfo.message) || 'Group not found.'
						let obj = {}
						obj['error'] = errorMsg
						response = JSON.stringify(obj)
						break
					}
					const fee = await this.unitJoinFee()
					try {
						const resPermission = await showModalAndWait(
							actions.JOIN_GROUP,
							{
								text1: get("modals.mpchange40"),
								text2: `${get("modals.mpchange41")} ${groupInfo.groupName}`,
								text3: `${get("modals.mpchange42")} ${groupId}`,
								fee: fee
							}
						)
						if (resPermission.action === 'accept') {
							this.loader.show()
							const resJoinGroup = await this._joinGroup(groupId, groupInfo.groupName)
							if (resJoinGroup.signature) {
								this.loader.hide()
								let myMsg1 = get("modals.mpchange43")
								await showSuccessAndWait("REQUEST_SUCCESS", { id1: myMsg1 })
								response = JSON.stringify(resJoinGroup)
								break
							} else {
								this.loader.hide()
								let myMsg1 = get("modals.mpchange44")
								let myMsg2 = get("walletpage.wchange44")
								await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
								response = '{"error": "Failed to join the group."}'
								break
							}
						} else if (resPermission.action === 'reject') {
							let myMsg1 = get("transactions.declined")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
							response = '{"error": "User declined request"}'
							break
						}
					} catch (error) {
						this.loader.hide()
						let myMsg1 = get("modals.mpchange44")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const obj = {}
						obj['error'] = error.message ? error.message : get("modals.mpchange44")
						response = JSON.stringify(obj)
						break
					}
				}
					break

				case actions.SAVE_FILE: {
					try {
						const requiredFields = ['filename', 'blob']
						const missingFields = []
						let dataSentBack = {}
						requiredFields.forEach((field) => {
							if (!data[field]) {
								missingFields.push(field)
							}
						})
						if (missingFields.length > 0) {
							const missingFieldsString = missingFields.join(', ')
							const tryAgain = get("walletpage.wchange44")
							await showErrorAndWait(
								"MISSING_FIELDS",
								{
									id1: missingFieldsString,
									id2: tryAgain
								}
							)
							dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
							response = JSON.stringify(dataSentBack)
							break
						}
						const filename = data.filename
						const blob = data.blob
						const res = await showModalAndWait(
							actions.SAVE_FILE,
							{
								filename
							}
						)
						if (res.action === 'reject') {
							let myMsg1 = get("transactions.declined")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
							response = '{"error": "User declined request"}'
							break
						}
						const mimeType = blob.type || data.mimeType
						let backupExention = filename.split('.').pop()
						if (backupExention) {
							backupExention = '.' + backupExention
						}
						const fileExtension = mimeToExtensionMap[mimeType] || backupExention
						let fileHandleOptions = {}
						if (!mimeType) {
							const obj = {}
							obj['error'] = 'A mimeType could not be derived'
							response = JSON.stringify(obj)
							break
						}
						if (!fileExtension) {
							const obj = {}
							obj['error'] = 'A file extension could not be derived'
							response = JSON.stringify(obj)
							break
						}
						if (fileExtension && mimeType) {
							fileHandleOptions = {
								accept: {
									[mimeType]: [fileExtension]
								}
							}
						}
						try {
							const fileHandle = await self.showSaveFilePicker({
								suggestedName: filename,
								types: [
									{
										description: mimeType,
										...fileHandleOptions
									}
								]
							})
							const writeFile = async (fileHandle, contents) => {
								const writable = await fileHandle.createWritable()
								await writable.write(contents)
								await writable.close()
							}
							writeFile(fileHandle, blob).then(() => console.log("FILE SAVED"))
						} catch (error) {
							if (error.name === 'AbortError') {
								const obj = {}
								obj['error'] = 'User declined the download'
								response = JSON.stringify(obj)
								break
							}
							FileSaver.saveAs(blob, filename)
						}
						response = JSON.stringify(true)
					} catch (error) {
						let myMsg1 = get("managegroup.mg58")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const obj = {}
						obj['error'] = error.message || 'Failed to initiate download'
						response = JSON.stringify(obj)
					}
				}
					break

				case actions.DEPLOY_AT: {
					const requiredFields = ['name', 'description', 'tags', 'creationBytes', 'amount', 'assetId', 'type']
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field] && data[field] !== 0) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					try {
						this.loader.show()
						const resDeployAt = await this._deployAt(data.name, data.description, data.tags, data.creationBytes, data.amount, data.assetId, data.type)
						response = JSON.stringify(resDeployAt)
						this.loader.hide()
						break
					} catch (error) {
						this.loader.hide()
						let myMsg1 = get("modals.mpchange49")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const obj = {}
						obj['error'] = error.message ? error.message : get("modals.mpchange49")
						response = JSON.stringify(obj)
					}
				}
					break

				case actions.GET_PROFILE_DATA: {
					const defaultProperties = ['tagline', 'bio', 'wallets']
					const requiredFields = ['property']
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field] && data[field] !== 0) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					try {
						const profileData = window.parent.reduxStore.getState().app.profileData
						if (!profileData) {
							let myMsg1 = get("modals.mpchange50")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
							response = '{"error": "User does not have a profile."}'
							break
						}
						const property = data.property
						const propertyIndex = defaultProperties.indexOf(property)
						if (propertyIndex !== -1) {
							const requestedData = profileData[property]
							if (requestedData) {
								response = JSON.stringify(requestedData)
								break
							} else {
								let myMsg1 = get("modals.mpchange51")
								let myMsg2 = get("walletpage.wchange44")
								await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
								response = '{"error": "Cannot find requested data."}'
								break
							}
						}
						if (property.includes('-private')) {
							const resPrivateProperty = await showModalAndWait(
								actions.GET_PROFILE_DATA, {
									property
								}
							)
							if (resPrivateProperty.action === 'accept') {
								const requestedData = profileData.customData[property]
								if (requestedData) {
									response = JSON.stringify(requestedData)
									break
								} else {
									let myMsg1 = get("modals.mpchange51")
									let myMsg2 = get("walletpage.wchange44")
									await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
									response = '{"error": "Cannot find requested data."}'
									break
								}
							} else {
								let myMsg1 = get("transactions.declined")
								let myMsg2 = get("walletpage.wchange44")
								await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
								response = '{"error": "User declined request"}'
								break
							}
						} else {
							const requestedData = profileData.customData[property]
							if (requestedData) {
								response = JSON.stringify(requestedData)
								break
							} else {
								let myMsg1 = get("modals.mpchange51")
								let myMsg2 = get("walletpage.wchange44")
								await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
								response = '{"error": "Cannot find requested data."}'
								break
							}
						}
					} catch (error) {
						let myMsg1 = get("modals.mpchange52")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const obj = {}
						obj['error'] = error.message ? error.message : get("modals.mpchange52")
						response = JSON.stringify(obj)
					}
				}
					break

				case actions.SET_PROFILE_DATA: {
					const requiredFields = ['property', 'data']
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field] && data[field] !== 0) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					try {
						const property = data.property
						const payload = data.data
						const uniqueId = this.uid.rnd()
						const fee = await this.getArbitraryFee()
						const resSetPrivateProperty = await showModalAndWait(
							actions.SET_PROFILE_DATA, {
								property,
								fee: fee.feeToShow
							}
						)
						if (resSetPrivateProperty.action !== 'accept') {
							let myMsg1 = get("transactions.declined")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
							response = '{"error": "User declined request"}'
							break
						}
						// Dispatch event and wait until I get a response to continue
						// Create and dispatch custom event
						const customEvent = new CustomEvent('qortal-request-set-profile-data', {
							detail: {
								property,
								payload,
								uniqueId
							}
						})
						window.parent.dispatchEvent(customEvent)
						// Wait for response event
						const res = await new Promise((resolve, reject) => {
							function handleResponseEvent(event) {
								// Handle the data from the event, if any
								const responseData = event.detail
								if (responseData && responseData.uniqueId !== uniqueId) return
								// Clean up by removing the event listener once we've received the response
								window.removeEventListener('qortal-request-set-profile-data-response', handleResponseEvent)

								if (responseData.response === 'saved') {
									resolve(responseData)
								} else {
									reject(new Error('not saved'))
								}
							}
							// Set up an event listener to wait for the response
							window.addEventListener('qortal-request-set-profile-data-response', handleResponseEvent)
						})
						if (!res.response) {
							let myMsg1 = get("modals.mpchange53")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
							response = '{"error": "Failed to set property."}'
							break
						}
						response = JSON.stringify(res.response)
					} catch (error) {
						let myMsg1 = get("modals.mpchange53")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const obj = {}
						obj['error'] = error.message ? error.message : get("modals.mpchange53")
						response = JSON.stringify(obj)
					}
				}
					break

				case actions.OPEN_PROFILE: {
					const requiredFields = ['name']
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field] && data[field] !== 0) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					try {
						const customEvent = new CustomEvent('open-visiting-profile', {
							detail: data.name
						})
						window.parent.dispatchEvent(customEvent)
						response = JSON.stringify(true)
						break
					} catch (error) {
						let myMsg1 = get("modals.mpchange54")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const obj = {}
						obj['error'] = error.message ? error.message : get("modals.mpchange54")
						response = JSON.stringify(obj)
					}
				}
					break

				case actions.GET_USER_WALLET: {
					const requiredFields = ['coin']
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					const res3 = await showModalAndWait(
						actions.GET_USER_WALLET
					)
					if (res3.action === 'accept') {
						let coin = data.coin
						let userWallet = {}
						let arrrAddress = ""
						if (coin === "ARRR") {
							arrrAddress = await parentEpml.request('apiCall', {
								url: `/crosschain/arrr/walletaddress?apiKey=${this.getApiKey()}`,
								method: 'POST',
								body: `${window.parent.reduxStore.getState().app.selectedAddress.arrrWallet.seed58}`
							})
						}
						switch (coin) {
							case 'QORT':
								userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.address
								userWallet['publicKey'] = window.parent.reduxStore.getState().app.selectedAddress.base58PublicKey
								break
							case 'BTC':
								userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.btcWallet.address
								userWallet['publicKey'] = window.parent.reduxStore.getState().app.selectedAddress.btcWallet.derivedMasterPublicKey
								break
							case 'LTC':
								userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet.address
								userWallet['publicKey'] = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet.derivedMasterPublicKey
								break
							case 'DOGE':
								userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet.address
								userWallet['publicKey'] = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet.derivedMasterPublicKey
								break
							case 'DGB':
								userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.dgbWallet.address
								userWallet['publicKey'] = window.parent.reduxStore.getState().app.selectedAddress.dgbWallet.derivedMasterPublicKey
								break
							case 'RVN':
								userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.rvnWallet.address
								userWallet['publicKey'] = window.parent.reduxStore.getState().app.selectedAddress.rvnWallet.derivedMasterPublicKey
								break
							case 'ARRR':
								userWallet['address'] = arrrAddress
								userWallet['publicKey'] = window.parent.reduxStore.getState().app.selectedAddress.arrrWallet.seed58
								break
							default:
								break
						}
						response = JSON.stringify(userWallet)
						break
					} else if (res3.action === 'reject') {
						let myMsg1 = get("transactions.declined")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
						response = '{"error": "User declined request"}'
						break
					}
				}
					break

				case actions.GET_USER_WALLET_TRANSACTIONS: {
					const requiredFields = ['coin']
					const missingFields = []
					let dataSentBack = {}
					let skipWalletTransactions = false
					let resSkipWalletTransactions
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					if (window.parent.reduxStore.getState().app.qAPPAutoTransactions) {
						skipWalletTransactions = true
					}
					if (!skipWalletTransactions) {
						resSkipWalletTransactions = await showModalAndWait(
							actions.GET_USER_WALLET_TRANSACTIONS
						)
					}
					if ((resSkipWalletTransactions && resSkipWalletTransactions.action === 'accept') || skipWalletTransactions) {
						let coin = data.coin
						if (coin === "QORT") {
							let qortAddress = window.parent.reduxStore.getState().app.selectedAddress.address
							try {
								response = await parentEpml.request('apiCall', {
									url: `/transactions/address/${qortAddress}?limit=0&reverse=true`
								})
								break
							} catch (error) {
								let myMsg1 = get("browserpage.bchange21")
								let myMsg2 = get("walletpage.wchange44")
								await showErrorAndWait("ACTION_FAILED", {id1: myMsg1, id2: myMsg2})
								const data = {}
								data['error'] = error.message ? error.message : get("browserpage.bchange21")
								response = JSON.stringify(data)
								break
							}
						} else {
							let _url = ``
							let _body = null
							switch (coin) {
								case 'BTC':
									_url = `/crosschain/btc/wallettransactions?apiKey=${this.getApiKey()}`
									_body = window.parent.reduxStore.getState().app.selectedAddress.btcWallet.derivedMasterPublicKey
									break
								case 'LTC':
									_url = `/crosschain/ltc/wallettransactions?apiKey=${this.getApiKey()}`
									_body = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet.derivedMasterPublicKey
									break
								case 'DOGE':
									_url = `/crosschain/doge/wallettransactions?apiKey=${this.getApiKey()}`
									_body = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet.derivedMasterPublicKey
									break
								case 'DGB':
									_url = `/crosschain/dgb/wallettransactions?apiKey=${this.getApiKey()}`
									_body = window.parent.reduxStore.getState().app.selectedAddress.dgbWallet.derivedMasterPublicKey
									break
								case 'RVN':
									_url = `/crosschain/rvn/wallettransactions?apiKey=${this.getApiKey()}`
									_body = window.parent.reduxStore.getState().app.selectedAddress.rvnWallet.derivedMasterPublicKey
									break
								case 'ARRR':
									_url = `/crosschain/arrr/wallettransactions?apiKey=${this.getApiKey()}`
									_body = window.parent.reduxStore.getState().app.selectedAddress.arrrWallet.seed58
									break
								default:
									break
							}
							try {
								response = await parentEpml.request('apiCall', {
									url: _url,
									method: 'POST',
									body: _body
								})
								break
							} catch (error) {
								let myMsg1 = get("browserpage.bchange21")
								let myMsg2 = get("walletpage.wchange44")
								await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
								const data = {}
								data['error'] = error.message ? error.message : get("browserpage.bchange21")
								response = JSON.stringify(data)
								break
							}
						}
					} else if (resSkipWalletTransactions.action === 'reject') {
						let myMsg1 = get("transactions.declined")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
						response = '{"error": "User declined request"}'
						break
					}
				}
					break

				case actions.GET_WALLET_BALANCE: {
					const requiredFields = ['coin']
					const missingFields = []
					let dataSentBack = {}
					let skipWalletBalance = false
					let resSkipWalletBalance
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					// Params: data.coin (QORT / BTC / LTC / DOGE / DGB / RVN / ARRR)
					// TODO: prompt user to share wallet balance. If they confirm, call `GET /crosschain/:coin/walletbalance`, or for QORT, call `GET /addresses/balance/:address`
					// then set the response string from the core to the `response` variable (defined above)
					// If they decline, send back JSON that includes an `error` key, such as `{"error": "User declined request"}`
					if (window.parent.reduxStore.getState().app.qAPPAutoBalance) {
						skipWalletBalance = true
					}
					if (!skipWalletBalance) {
						resSkipWalletBalance = await showModalAndWait(
							actions.GET_WALLET_BALANCE
						)
					}
					if ((resSkipWalletBalance && resSkipWalletBalance.action === 'accept') || skipWalletBalance) {
						let coin = data.coin
						if (coin === "QORT") {
							let qortAddress = window.parent.reduxStore.getState().app.selectedAddress.address
							try {
								response = await parentEpml.request('apiCall', {
									url: `/addresses/balance/${qortAddress}?apiKey=${this.getApiKey()}`
								})
								break
							} catch (error) {
								let myMsg1 = get("browserpage.bchange21")
								let myMsg2 = get("walletpage.wchange44")
								await showErrorAndWait("ACTION_FAILED", {id1: myMsg1, id2: myMsg2})
								const data = {}
								data['error'] = error.message ? error.message : get("browserpage.bchange21")
								response = JSON.stringify(data)
								break
							}
						} else {
							let _url = ``
							let _body = null
							switch (coin) {
								case 'BTC':
									_url = `/crosschain/btc/walletbalance?apiKey=${this.getApiKey()}`
									_body = window.parent.reduxStore.getState().app.selectedAddress.btcWallet.derivedMasterPublicKey
									break
								case 'LTC':
									_url = `/crosschain/ltc/walletbalance?apiKey=${this.getApiKey()}`
									_body = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet.derivedMasterPublicKey
									break
								case 'DOGE':
									_url = `/crosschain/doge/walletbalance?apiKey=${this.getApiKey()}`
									_body = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet.derivedMasterPublicKey
									break
								case 'DGB':
									_url = `/crosschain/dgb/walletbalance?apiKey=${this.getApiKey()}`
									_body = window.parent.reduxStore.getState().app.selectedAddress.dgbWallet.derivedMasterPublicKey
									break
								case 'RVN':
									_url = `/crosschain/rvn/walletbalance?apiKey=${this.getApiKey()}`
									_body = window.parent.reduxStore.getState().app.selectedAddress.rvnWallet.derivedMasterPublicKey
									break
								case 'ARRR':
									_url = `/crosschain/arrr/walletbalance?apiKey=${this.getApiKey()}`
									_body = window.parent.reduxStore.getState().app.selectedAddress.arrrWallet.seed58
									break
								default:
									break
							}
							try {
								const res = await parentEpml.request('apiCall', {
									url: _url,
									method: 'POST',
									body: _body
								})
								if (isNaN(Number(res))) {
									let myMsg1 = get("browserpage.bchange21")
									let myMsg2 = get("walletpage.wchange44")
									await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
									const data = {}
									data['error'] = get("browserpage.bchange21")
									response = JSON.stringify(data)
									break
								} else {
									response = (Number(res) / 1e8).toFixed(8)
									break
								}
							} catch (error) {
								let myMsg1 = get("browserpage.bchange21")
								let myMsg2 = get("walletpage.wchange44")
								await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
								const data = {}
								data['error'] = error.message ? error.message : get("browserpage.bchange21")
								response = JSON.stringify(data)
								break
							}
						}
					} else if (resSkipWalletBalance.action === 'reject') {
						let myMsg1 = get("transactions.declined")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
						response = '{"error": "User declined request"}'
						break
					}
				}
					break

				case actions.GET_USER_WALLET_INFO: {
					const requiredFields = ['coin']
					const missingFields = []
					let skipUserWalletInfo = false
					let dataSentBack = {}
					let resSkipUserWalletInfo
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					if (window.parent.reduxStore.getState().app.qAPPAutoAuth) {
						skipUserWalletInfo = true
					}
					if (!skipUserWalletInfo) {
						resSkipUserWalletInfo = await showModalAndWait(
							actions.GET_USER_WALLET
						)
					}
					if ((resSkipUserWalletInfo && resSkipUserWalletInfo.action === 'accept') || skipUserWalletInfo) {
						let coin = data.coin
						let walletKeys = this.getUserWallet(coin)
						let _url = `/crosschain/` + data.coin.toLowerCase() + `/addressinfos?apiKey=${this.getApiKey()}`
						let _body = { xpub58: walletKeys['publicKey'] }
						try {
							const bodyToString = JSON.stringify(_body)
							const res = await parentEpml.request('apiCall', {
								url: _url,
								method: 'POST',
								headers: {
									'Accept': '*/*',
									'Content-Type': 'application/json'
								},
								body: bodyToString
							})
							response = JSON.stringify(res)
						} catch (error) {
							let myMsg1 = get("browserpage.bchange21")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
							const data = {}
							data['error'] = error.message ? error.message : get("browserpage.bchange21")
							response = JSON.stringify(data)
							return
						}
					} else if (resSkipUserWalletInfo.action === 'reject') {
						let myMsg1 = get("transactions.declined")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
						response = '{"error": "User declined request"}'
					}
				}
					break

				case actions.GET_CROSSCHAIN_SERVER_INFO: {
					const requiredFields = ['coin']
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					let _url = `/crosschain/` + data.coin.toLowerCase() + `/serverinfos`
					try {
						const res = await parentEpml.request('apiCall', {
							url: _url,
							method: 'GET',
							headers: {
								'Accept': '*/*'
							}
						})
						response = JSON.stringify(res.servers)
					} catch (error) {
						let myMsg1 = get("modals.mpchange55")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const data = {}
						data['error'] = error.message ? error.message : get("modals.mpchange55")
						response = JSON.stringify(data)
						return
					}
				}
					break

				case actions.GET_TX_ACTIVITY_SUMMARY: {
					const requiredFields = ['coin']
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					try {
						let coin = data.coin
						response = await parentEpml.request('apiCall', {
							type: 'api',
							method: 'POST',
							url: `/crosschain/txactivity?apiKey=${this.getApiKey()}&foreignBlockchain=${coin}`,
							headers: {
								'Accept': '*/*',
								'Content-Type': 'application/json'
							}
						})
						break
					} catch (error) {
						let myMsg1 = get("modals.mpchange56")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const data = {}
						data['error'] = error.message ? error.message : get("modals.mpchange56")
						response = JSON.stringify(data)
					}
				}
					break

				case actions.GET_FOREIGN_FEE: {
					const requiredFields = ['coin','type']
					const missingFields = []
					let dataSentBack = {}
		  			requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					try {
						let coin = data.coin.toLowerCase()
						let type = data.type
						response = await parentEpml.request('apiCall', {
							type: 'api',
							method: 'GET',
							url: `/crosschain/${coin}/${type}?apiKey=${this.getApiKey()}`,
							headers: {
								'Accept': '*/*',
								'Content-Type': 'application/json'
							},
						})
						break
					} catch (error) {
						let myMsg1 = get("modals.mpchange57")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const data = {}
						data['error'] = error.message ? error.message : get("modals.mpchange57")
						response = JSON.stringify(data)
					}
				}
					break

				case actions.UPDATE_FOREIGN_FEE: {
					const requiredFields = ['coin','type']
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					try {
						let coin = data.coin.toLowerCase()
						let type = data.type
						let value = data.value
						response = await parentEpml.request('apiCall', {
							type: 'api',
							method: 'POST',
							url: `/crosschain/${coin}/update${type}?apiKey=${this.getApiKey()}`,
							headers: {
								'Accept': '*/*',
								'Content-Type': 'application/json'
							},
							body: `${value}`
						})
						break
					} catch (error) {
						let myMsg1 = get("modals.mpchange58")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const data = {}
						data['error'] = error.message ? error.message : get("modals.mpchange58")
						response = JSON.stringify(data)
					}
				}
					break

				case actions.GET_SERVER_CONNECTION_HISTORY: {
					const requiredFields = ['coin']
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					try {
						let coin = data.coin.toLowerCase()
						response = await parentEpml.request('apiCall', {
							type: 'api',
							method: 'GET',
							url: `/crosschain/${coin}/serverconnectionhistory`,
							headers: {
								'Accept': '*/*',
								'Content-Type': 'application/json'
							},
						})
						break
					} catch (error) {
						let myMsg1 = get("modals.mpchange59")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const data = {}
						data['error'] = error.message ? error.message : get("modals.mpchange59")
						response = JSON.stringify(data)
					}
				}
					break

				case actions.SET_CURRENT_FOREIGN_SERVER: {
					const requiredFields = ['coin']
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					try {
						let coin = data.coin.toLowerCase()
						let host = data.host
						let port = data.port
						let type = data.type
						const body = {
							hostName: host,
							port: port,
							connectionType: type
						}
						const bodyToString = JSON.stringify(body)
						response = await parentEpml.request('apiCall', {
							type: 'api',
							method: 'POST',
							url: `/crosschain/${coin}/setcurrentserver?apiKey=${this.getApiKey()}`,
							headers: {
								'Accept': '*/*',
								'Content-Type': 'application/json'
							},
							body: `${bodyToString}`
						})
						break
					} catch (error) {
						let myMsg1 = get("modals.mpchange60")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const data = {}
						data['error'] = error.message ? error.message : get("modals.mpchange60")
						response = JSON.stringify(data)
					}
				}
					break

				case actions.ADD_FOREIGN_SERVER: {
					const requiredFields = ['coin']
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					try {
						let coin = data.coin.toLowerCase()
						let host = data.host
						let port = data.port
						let type = data.type
						const body = {
							hostName: host,
							port: port,
							connectionType: type
						}
						const bodyToString = JSON.stringify(body)
						response = await parentEpml.request('apiCall', {
							type: 'api',
							method: 'POST',
							url: `/crosschain/${coin}/addserver?apiKey=${this.getApiKey()}`,
							headers: {
								'Accept': '*/*',
								'Content-Type': 'application/json'
							},
							body: `${bodyToString}`
						})
						break
					} catch (error) {
						let myMsg1 = get("modals.mpchange61")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const data = {}
						data['error'] = error.message ? error.message : get("modals.mpchange61")
						response = JSON.stringify(data)
					}
				}
					break

				case actions.REMOVE_FOREIGN_SERVER: {
					const requiredFields = ['coin']
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					try {
						let coin = data.coin.toLowerCase()
						let host = data.host
						let port = data.port
						let type = data.type
						const body = {
							hostName: host,
							port: port,
							connectionType: type
						}
						const bodyToString = JSON.stringify(body)
						response = await parentEpml.request('apiCall', {
							type: 'api',
							method: 'POST',
							url: `/crosschain/${coin}/removeserver?apiKey=${this.getApiKey()}`,
							headers: {
								'Accept': '*/*',
								'Content-Type': 'application/json'
							},
							body: `${bodyToString}`
						})
						break
					} catch (error) {
						let myMsg1 = get("modals.mpchange62")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const data = {}
						data['error'] = error.message ? error.message : get("modals.mpchange62")
						response = JSON.stringify(data)
					}
				}
					break

				case actions.GET_DAY_SUMMARY: {
					try {
						response = await parentEpml.request('apiCall', {
							type: 'api',
							url: `/admin/summary?apiKey=${this.getApiKey()}`
						})
						break
					} catch (error) {
						let myMsg1 = get("modals.mpchange63")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						const data = {}
						data['error'] = error.message ? error.message : get("modals.mpchange63")
						response = JSON.stringify(data)
					}
				}
					break

				case actions.SIGN_TRANSACTION: {
					const signNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
					const signUrl = signNode.protocol + '://' + signNode.domain + ':' + signNode.port
					const requiredFields = ['unsignedBytes']
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					const shouldProcess = data.process ? data.process : false
					let url = `${signUrl}/transactions/decode?ignoreValidityChecks=false`
					let body = data.unsignedBytes
					const resDecode = await fetch(url, {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: body
					})
					if (!resDecode.ok) {
						let myMsg1 = get("modals.mpchange64")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
						response = '{"error": "Failed to decode transaction."}'
						break
					}
					const decodedData = await resDecode.json()
					const signRequest = await showModalAndWait(
						actions.SIGN_TRANSACTION,
						{
							text1: `${shouldProcess ? get("modals.mpchange65") : get("modals.mpchange66")}`,
							text2: get("modals.mpchange67"),
							text3: `${get("modals.mpchange68")} ${decodedData.type}`,
							txdata: `${get("modals.mpchange69")}`,
							txjson: `${JSON.stringify(decodedData)}`
						}
					)
					if (signRequest.action === 'accept') {
						let urlConverted = `${signUrl}/transactions/convert`
						const responseConverted = await fetch(urlConverted, {
							method: "POST",
							headers: {
								"Content-Type": "application/json"
							},
							body: data.unsignedBytes
						})
						const keyPair = window.parent.reduxStore.getState().app.selectedAddress.keyPair
						const convertedBytes = await responseConverted.text()
						const txBytes = Base58.decode(data.unsignedBytes)
						const _arbitraryBytesBuffer = Object.keys(txBytes).map(function (key) {
							return txBytes[key]
						})
						const arbitraryBytesBuffer = new Uint8Array(_arbitraryBytesBuffer)
						const txByteSigned = Base58.decode(convertedBytes)
						const _bytesForSigningBuffer = Object.keys(txByteSigned).map(function (key) {
							return txByteSigned[key]
						})
						const bytesForSigningBuffer = new Uint8Array(_bytesForSigningBuffer)
						const signature = nacl.sign.detached(
							bytesForSigningBuffer,
							keyPair.privateKey
						)
						const signedBytes = appendBuffer(arbitraryBytesBuffer, signature)
						const signedBytesToBase58 = Base58.encode(signedBytes)
						if(!shouldProcess) {
							response = signedBytesToBase58
							break
						}
						try {
							this.loader.show()
							const res = await processTransactionV2(signedBytesToBase58)
							if (res.signature) {
								this.loader.hide()
								let myMsg1 = get("modals.mpchange72")
								await showSuccessAndWait("REQUEST_SUCCESS", { id1: myMsg1 })
								response = '{"success": "Transaction signed and processed successfully!"}'
								break
							} else {
								this.loader.hide()
								let myMsg1 = get("modals.mpchange73")
								let myMsg2 = get("walletpage.wchange44")
								await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
								response = '{"error": "Transaction was not able to be processed."}'
								break
							}
						} catch (error) {
							this.loader.hide()
							let myMsg1 = get("managegroup.mg58")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
							response = '{"error": "Transaction was not able to be processed."}'
							break
						}
					} else if (signRequest.action === 'reject') {
						let myMsg1 = get("transactions.declined")
						let myMsg2 = get("walletpage.wchange44")
						await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
						response = '{"error": "User declined request"}'
					}
				}
					break

				case actions.SEND_COIN: {
					const requiredFields = ['coin', 'amount']
					const missingFields = []
					let dataSentBack = {}
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait(
							"MISSING_FIELDS",
							{
								id1: missingFieldsString,
								id2: tryAgain
							}
						)
						dataSentBack['error'] = `Missing fields: ${missingFieldsString}`
						response = JSON.stringify(dataSentBack)
						break
					}
					if (!data.destinationAddress && !data.recipient) {
						const missingFieldsString = "destinationAddress or recipient"
						const tryAgain = get("walletpage.wchange44")
						await showErrorAndWait("MISSING_FIELDS", { id1: missingFieldsString, id2: tryAgain })
						break
					}
					let checkCoin = data.coin
					if (checkCoin === "QORT") {
						// Params: data.coin, data.destinationAddress, data.amount, data.fee
						// TODO: prompt user to send. If they confirm, call `POST /crosschain/:coin/send`, or for QORT, broadcast a PAYMENT transaction
						// then set the response string from the core to the `response` variable (defined above)
						// If they decline, send back JSON that includes an `error` key, such as `{"error": "User declined request"}`
						const amount = Number(data.amount)
						const recipient = data.destinationAddress ? data.destinationAddress : data.recipient
						const coin = data.coin
						const walletBalance = await parentEpml.request('apiCall', {
							url: `/addresses/balance/${this.myAddress.address}`
						})
						if (isNaN(Number(walletBalance))) {
							let errorMsg = get("modals.mpchange74")
							let failedMsg = get("walletpage.wchange33") + " QORT " + get("general.balance")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: failedMsg, id3: pleaseMsg })
							let obj = {}
							obj['error'] = errorMsg
							response = JSON.stringify(obj)
							break
						}
						const myRef = await parentEpml.request("apiCall", {
							type: "api",
							url: `/addresses/lastreference/${this.myAddress.address}`
						})
						const transformDecimals = (Number(walletBalance) * QORT_DECIMALS).toFixed(0)
						const walletBalanceDecimals = Number(transformDecimals)
						const amountDecimals = Number(amount) * QORT_DECIMALS
						const balance = (Number(transformDecimals) / 1e8).toFixed(8)
						const fee = await this.sendQortFee()
						if (amountDecimals + (fee * QORT_DECIMALS) > walletBalanceDecimals) {
							let myMsg1 = get("chatpage.cchange51")
							let myMsg2 = get("walletpage.wchange26")
							let myMsg3 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg2, id2: myMsg3 })
							let obj = {}
							obj['error'] = myMsg1
							response = JSON.stringify(obj)
							break
						}
						if (amount <= 0) {
							let myMsg1 = get("chatpage.cchange52")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
							let obj = {}
							obj['error'] = myMsg1
							response = JSON.stringify(obj)
							break
						}
						if (recipient.length === 0) {
							let myMsg1 = get("chatpage.cchange53")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
							let obj = {}
							obj['error'] = myMsg1
							response = JSON.stringify(obj)
							break
						}
						const processPayment = await showModalAndWait(
							actions.SEND_COIN,
							{
								amount,
								recipient,
								coin,
								balance,
								fee
							}
						)
						if (processPayment.action === 'reject') {
							let myMsg1 = get("transactions.declined")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
							response = '{"error": "User declined request"}'
							break
						}
						const validateName = async (receiverName) => {
							let myRes
							let myNameRes = await parentEpml.request('apiCall', {
								type: 'api',
								url: `/names/${receiverName}`
							})
							if (myNameRes.error === 401) {
								myRes = false
							} else {
								myRes = myNameRes
							}
							return myRes
						}
						const validateAddress = async (receiverAddress) => {
							return await window.parent.validateAddress(receiverAddress)
						}
						const validateReceiver = async (recipient) => {
							let lastRef = myRef
							let isAddress
							try {
								isAddress = await validateAddress(recipient)
							} catch (err) {
								isAddress = false
							}
							if (isAddress) {
								let myTransaction = await makeTransactionRequest(recipient, lastRef)
								return getTxnRequestResponse(myTransaction)
							} else {
								let myNameRes = await validateName(recipient)
								if (myNameRes !== false) {
									let myNameAddress = myNameRes.owner
									let myTransaction = await makeTransactionRequest(myNameAddress, lastRef)
									return getTxnRequestResponse(myTransaction)
								} else {
									let errorMsg = get("walletpage.wchange29")
									let pleaseMsg = get("walletpage.wchange44")
									await showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: pleaseMsg })
									throw new Error(errorMsg)
								}
							}
						}
						const getName = async (recipient) => {
							try {
								const getNames = await parentEpml.request("apiCall", {
									type: "api",
									url: `/names/address/${recipient}`
								})
								if (getNames.length > 0) {
									return getNames[0].name
								} else {
									return ''
								}
							} catch (error) {
								return ''
							}
						}
						this.loader.show()
						const makeTransactionRequest = async (receiver, lastRef) => {
							let myReceiver = receiver
							let mylastRef = lastRef
							let dialogamount = get("transactions.amount")
							let dialogAddress = get("login.address")
							let dialogName = get("login.name")
							let dialogto = get("transactions.to")
							let recipientName = await getName(myReceiver)
							return await parentEpml.request('transaction', {
								type: 2,
								nonce: this.myAddress.nonce,
								params: {
									recipient: myReceiver,
									recipientName: recipientName,
									amount: amount,
									lastReference: mylastRef,
									fee: fee,
									dialogamount: dialogamount,
									dialogto: dialogto,
									dialogAddress,
									dialogName
								},
								apiVersion: 2
							})
						}
						const getTxnRequestResponse = (txnResponse) => {
							if (txnResponse.success === false && txnResponse.message) {
								this.loader.hide()
								let myMsg1 = txnResponse.message
								let myMsg2 = get("walletpage.wchange44")
								showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
								throw new Error(txnResponse.message)
							} else if (txnResponse.success === true && !txnResponse.data.error) {
								this.loader.hide()
								let successMsg = get("walletpage.wchange30")
								let patientMsg = get("walletpage.wchange43")
								showSuccessAndWait("REQUEST_SUCCESS", { id1: successMsg, id2: patientMsg })
								return txnResponse.data
							} else {
								this.loader.hide()
								let myMsg1 = get("modals.mpchange75")
								let myMsg2 = get("walletpage.wchange44")
								showErrorAndWait("ACTION_FAILED", { id1: myMsg1, id2: myMsg2 })
								throw new Error('Error: could not send coin.')
							}
						}
						try {
							response = await validateReceiver(recipient)
						} catch (error) {
							let errorMsg = get("modals.mpchange38")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: pleaseMsg })
							response = '{"error": "Request could not be fulfilled"}'
						} finally {
							this.loader.hide()
						}
						break
					} else if (checkCoin === "BTC") {
						this.loader.show()
						const amount = Number(data.amount)
						const recipient = data.destinationAddress ? data.destinationAddress : data.recipient
						const coin = data.coin
						const xprv58 = this.btcWallet.derivedMasterPrivateKey
						const feePerByte = data.fee ? data.fee : this.btcFeePerByte
						const btcWalletBalance = await parentEpml.request('apiCall', {
							url: `/crosschain/btc/walletbalance?apiKey=${this.getApiKey()}`,
							method: 'POST',
							body: `${this.btcWallet.derivedMasterPublicKey}`
						})
						if (isNaN(Number(btcWalletBalance))) {
							this.loader.hide()
							let errorMsg = get("modals.mpchange76")
							let failedMsg = get("walletpage.wchange33") + " BTC " + get("general.balance")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: failedMsg, id3: pleaseMsg })
							let obj = {}
							obj['error'] = errorMsg
							response = JSON.stringify(obj)
							break
						}
						const btcWalletBalanceDecimals = Number(btcWalletBalance)
						const btcAmountDecimals = Number(amount) * QORT_DECIMALS
						const balance = (Number(btcWalletBalance) / 1e8).toFixed(8)
						const fee = feePerByte * 500 // default 0.00050000
						if (btcAmountDecimals + (fee * QORT_DECIMALS) > btcWalletBalanceDecimals) {
							this.loader.hide()
							let myMsg1 = get("chatpage.cchange51")
							let myMsg2 = get("walletpage.wchange26")
							let myMsg3 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg2, id2: myMsg3 })
							let obj = {}
							obj['error'] = myMsg1
							response = JSON.stringify(obj)
							break
						}
						this.loader.hide()
						const processPayment = await showModalAndWait(
							actions.SEND_COIN,
							{
								amount,
								recipient,
								coin,
								balance,
								fee
							}
						)
						if (processPayment.action === 'reject') {
							let myMsg1 = get("transactions.declined")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
							response = '{"error": "User declined request"}'
							break
						}
						this.loader.show()
						const makeRequest = async () => {
							const opts = {
								xprv58: xprv58,
								receivingAddress: recipient,
								bitcoinAmount: amount,
								feePerByte: feePerByte * QORT_DECIMALS
							}
							return await parentEpml.request('sendBtc', opts)
						}
						const manageResponse = (response) => {
							if (response.length === 64) {
								this.loader.hide()
								let successMsg = get("walletpage.wchange30")
								let patientMsg = get("walletpage.wchange43")
								showSuccessAndWait("REQUEST_SUCCESS", { id1: successMsg, id2: patientMsg })
							} else if (response === false) {
								this.loader.hide()
								let errorMsg = get("walletpage.wchange31")
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: pleaseMsg })
								throw new Error(response)
							} else {
								this.loader.hide()
								let errorMsg = response.message
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: pleaseMsg })
								throw new Error(response)
							}
						}
						try {
							const res = await makeRequest()
							manageResponse(res)
							response = res
						} catch (error) {
							let errorMsg = get("modals.mpchange38")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: pleaseMsg })
							response = '{"error": "Request could not be fulfilled"}'
						} finally {
							this.loader.hide()
						}
						break
					} else if (checkCoin === "LTC") {
						this.loader.show()
						const amount = Number(data.amount)
						const recipient = data.destinationAddress
						const coin = data.coin
						const xprv58 = this.ltcWallet.derivedMasterPrivateKey
						const feePerByte = data.fee ? data.fee : this.ltcFeePerByte
						const ltcWalletBalance = await parentEpml.request('apiCall', {
							url: `/crosschain/ltc/walletbalance?apiKey=${this.getApiKey()}`,
							method: 'POST',
							body: `${this.ltcWallet.derivedMasterPublicKey}`
						})
						if (isNaN(Number(ltcWalletBalance))) {
							this.loader.hide()
							let errorMsg = get("modals.mpchange77")
							let failedMsg = get("walletpage.wchange33") + " LTC " + get("general.balance")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: failedMsg, id3: pleaseMsg })
							let obj = {}
							obj['error'] = errorMsg
							response = JSON.stringify(obj)
							break
						}
						const ltcWalletBalanceDecimals = Number(ltcWalletBalance)
						const ltcAmountDecimals = Number(amount) * QORT_DECIMALS
						const balance = (Number(ltcWalletBalance) / 1e8).toFixed(8)
						const fee = feePerByte * 1000 // default 0.00030000
						if (ltcAmountDecimals + (fee * QORT_DECIMALS) > ltcWalletBalanceDecimals) {
							this.loader.hide()
							let myMsg1 = get("chatpage.cchange51")
							let myMsg2 = get("walletpage.wchange26")
							let myMsg3 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg2, id2: myMsg3 })
							let obj = {}
							obj['error'] = myMsg1
							response = JSON.stringify(obj)
							break
						}
						this.loader.hide()
						const processPayment = await showModalAndWait(
							actions.SEND_COIN,
							{
								amount,
								recipient,
								coin,
								balance,
								fee
							}
						)
						if (processPayment.action === 'reject') {
							let myMsg1 = get("transactions.declined")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
							response = '{"error": "User declined request"}'
							break
						}
						this.loader.show()
						const makeRequest = async () => {
							const opts = {
								xprv58: xprv58,
								receivingAddress: recipient,
								litecoinAmount: amount,
								feePerByte: feePerByte * QORT_DECIMALS
							}
							return await parentEpml.request('sendLtc', opts)
						}
						const manageResponse = (response) => {
							if (response.length === 64) {
								this.loader.hide()
								let successMsg = get("walletpage.wchange30")
								let patientMsg = get("walletpage.wchange43")
								showSuccessAndWait("REQUEST_SUCCESS", { id1: successMsg, id2: patientMsg })
							} else if (response === false) {
								this.loader.hide()
								let errorMsg = get("walletpage.wchange31")
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: pleaseMsg })
								throw new Error(response)
							} else {
								this.loader.hide()
								let errorMsg = response.message
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: pleaseMsg })
								throw new Error(response)
							}
						}
						try {
							const res = await makeRequest()
							manageResponse(res)
							response = res
						} catch (error) {
							let errorMsg = get("modals.mpchange38")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: pleaseMsg })
							response = '{"error": "Request could not be fulfilled"}'
						} finally {
							this.loader.hide()
						}
						break
					} else if (checkCoin === "DOGE") {
						this.loader.show()
						const amount = Number(data.amount)
						const recipient = data.destinationAddress ? data.destinationAddress : data.recipient
						const coin = data.coin
						const xprv58 = this.dogeWallet.derivedMasterPrivateKey
						const feePerByte = data.fee ? data.fee : this.dogeFeePerByte
						const dogeWalletBalance = await parentEpml.request('apiCall', {
							url: `/crosschain/doge/walletbalance?apiKey=${this.getApiKey()}`,
							method: 'POST',
							body: `${this.dogeWallet.derivedMasterPublicKey}`
						})
						if (isNaN(Number(dogeWalletBalance))) {
							this.loader.hide()
							let errorMsg = get("modals.mpchange78")
							let failedMsg = get("walletpage.wchange33") + " DOGE " + get("general.balance")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: failedMsg, id3: pleaseMsg })
							let obj = {}
							obj['error'] = errorMsg
							response = JSON.stringify(obj)
							break
						}
						const dogeWalletBalanceDecimals = Number(dogeWalletBalance)
						const dogeAmountDecimals = Number(amount) * QORT_DECIMALS
						const balance = (Number(dogeWalletBalance) / 1e8).toFixed(8)
						const fee = feePerByte * 5000 // default 0.05000000
						if (dogeAmountDecimals + (fee * QORT_DECIMALS) > dogeWalletBalanceDecimals) {
							this.loader.hide()
							let myMsg1 = get("chatpage.cchange51")
							let myMsg2 = get("walletpage.wchange26")
							let myMsg3 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg2, id2: myMsg3 })
							let obj = {}
							obj['error'] = myMsg1
							response = JSON.stringify(obj)
							break
						}
						this.loader.hide()
						const processPayment = await showModalAndWait(
							actions.SEND_COIN,
							{
								amount,
								recipient,
								coin,
								balance,
								fee
							}
						)
						if (processPayment.action === 'reject') {
							let myMsg1 = get("transactions.declined")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
							response = '{"error": "User declined request"}'
							break
						}
						this.loader.show()
						const makeRequest = async () => {
							const opts = {
								xprv58: xprv58,
								receivingAddress: recipient,
								dogecoinAmount: amount,
								feePerByte: feePerByte * QORT_DECIMALS
							}
							return await parentEpml.request('sendDoge', opts)
						}
						const manageResponse = (response) => {
							if (response.length === 64) {
								this.loader.hide()
								let successMsg = get("walletpage.wchange30")
								let patientMsg = get("walletpage.wchange43")
								showSuccessAndWait("REQUEST_SUCCESS", { id1: successMsg, id2: patientMsg })
							} else if (response === false) {
								this.loader.hide()
								let errorMsg = get("walletpage.wchange31")
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: pleaseMsg })
								throw new Error(response)
							} else {
								this.loader.hide()
								let errorMsg = response.message
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: pleaseMsg })
								throw new Error(response)
							}
						}
						try {
							const res = await makeRequest()
							manageResponse(res)
							response = res
						} catch (error) {
							let errorMsg = get("modals.mpchange38")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: pleaseMsg })
							response = '{"error": "Request could not be fulfilled"}'
						} finally {
							this.loader.hide()
						}
						break
					} else if (checkCoin === "DGB") {
						this.loader.show()
						const amount = Number(data.amount)
						const recipient = data.destinationAddress ? data.destinationAddress : data.recipient
						const coin = data.coin
						const xprv58 = this.dgbWallet.derivedMasterPrivateKey
						const feePerByte = data.fee ? data.fee : this.dgbFeePerByte
						const dgbWalletBalance = await parentEpml.request('apiCall', {
							url: `/crosschain/dgb/walletbalance?apiKey=${this.getApiKey()}`,
							method: 'POST',
							body: `${this.dgbWallet.derivedMasterPublicKey}`
						})
						if (isNaN(Number(dgbWalletBalance))) {
							this.loader.hide()
							let errorMsg = get("modals.mpchange79")
							let failedMsg = get("walletpage.wchange33") + " DGB " + get("general.balance")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: failedMsg, id3: pleaseMsg })
							let obj = {}
							obj['error'] = errorMsg
							response = JSON.stringify(obj)
							break
						}
						const dgbWalletBalanceDecimals = Number(dgbWalletBalance)
						const dgbAmountDecimals = Number(amount) * QORT_DECIMALS
						const balance = (Number(dgbWalletBalance) / 1e8).toFixed(8)
						const fee = feePerByte * 500 // default 0.00005000
						if (dgbAmountDecimals + (fee * QORT_DECIMALS) > dgbWalletBalanceDecimals) {
							this.loader.hide()
							let myMsg1 = get("chatpage.cchange51")
							let myMsg2 = get("walletpage.wchange26")
							let myMsg3 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg2, id2: myMsg3 })
							let obj = {}
							obj['error'] = myMsg1
							response = JSON.stringify(obj)
							break
						}
						this.loader.hide()
						const processPayment = await showModalAndWait(
							actions.SEND_COIN,
							{
								amount,
								recipient,
								coin,
								balance,
								fee
							}
						)
						if (processPayment.action === 'reject') {
							let myMsg1 = get("transactions.declined")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
							response = '{"error": "User declined request"}'
							break
						}
						this.loader.show()
						const makeRequest = async () => {
							const opts = {
								xprv58: xprv58,
								receivingAddress: recipient,
								digibyteAmount: amount,
								feePerByte: feePerByte * QORT_DECIMALS
							}
							return await parentEpml.request('sendDgb', opts)
						}
						const manageResponse = (response) => {
							if (response.length === 64) {
								this.loader.hide()
								let successMsg = get("walletpage.wchange30")
								let patientMsg = get("walletpage.wchange43")
								showSuccessAndWait("REQUEST_SUCCESS", { id1: successMsg, id2: patientMsg })
							} else if (response === false) {
								this.loader.hide()
								let errorMsg = get("walletpage.wchange31")
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: pleaseMsg })
								throw new Error(response)
							} else {
								this.loader.hide()
								let errorMsg = response.message
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: pleaseMsg })
								throw new Error(response)
							}
						}
						try {
							const res = await makeRequest()
							manageResponse(res)
							response = res
						} catch (error) {
							let errorMsg = get("modals.mpchange38")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: pleaseMsg })
							response = '{"error": "Request could not be fulfilled"}'
						} finally {
							this.loader.hide()
						}
						break
					} else if (checkCoin === "RVN") {
						this.loader.show()
						const amount = Number(data.amount)
						const recipient = data.destinationAddress ? data.destinationAddress : data.recipient
						const coin = data.coin
						const xprv58 = this.rvnWallet.derivedMasterPrivateKey
						const feePerByte = data.fee ? data.fee : this.rvnFeePerByte
						const rvnWalletBalance = await parentEpml.request('apiCall', {
							url: `/crosschain/rvn/walletbalance?apiKey=${this.getApiKey()}`,
							method: 'POST',
							body: `${this.rvnWallet.derivedMasterPublicKey}`
						})
						if (isNaN(Number(rvnWalletBalance))) {
							this.loader.hide()
							let errorMsg = get("modals.mpchange80")
							let failedMsg = get("walletpage.wchange33") + " RVN " + get("general.balance")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: failedMsg, id3: pleaseMsg })
							let obj = {}
							obj['error'] = errorMsg
							response = JSON.stringify(obj)
							break
						}
						const rvnWalletBalanceDecimals = Number(rvnWalletBalance)
						const rvnAmountDecimals = Number(amount) * QORT_DECIMALS
						const balance = (Number(rvnWalletBalance) / 1e8).toFixed(8)
						const fee = feePerByte * 500 // default 0.00562500
						if (rvnAmountDecimals + (fee * QORT_DECIMALS) > rvnWalletBalanceDecimals) {
							this.loader.hide()
							let myMsg1 = get("chatpage.cchange51")
							let myMsg2 = get("walletpage.wchange26")
							let myMsg3 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg2, id2: myMsg3 })
							let obj = {}
							obj['error'] = myMsg1
							response = JSON.stringify(obj)
							break
						}
						this.loader.hide()
						const processPayment = await showModalAndWait(
							actions.SEND_COIN,
							{
								amount,
								recipient,
								coin,
								balance,
								fee
							}
						)
						if (processPayment.action === 'reject') {
							let myMsg1 = get("transactions.declined")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
							response = '{"error": "User declined request"}'
							break
						}
						this.loader.show()
						const makeRequest = async () => {
							const opts = {
								xprv58: xprv58,
								receivingAddress: recipient,
								ravencoinAmount: amount,
								feePerByte: feePerByte * QORT_DECIMALS
							}
							return await parentEpml.request('sendRvn', opts)
						}
						const manageResponse = (response) => {
							if (response.length === 64) {
								this.loader.hide()
								let successMsg = get("walletpage.wchange30")
								let patientMsg = get("walletpage.wchange43")
								showSuccessAndWait("REQUEST_SUCCESS", { id1: successMsg, id2: patientMsg })
							} else if (response === false) {
								this.loader.hide()
								let errorMsg = get("walletpage.wchange31")
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: pleaseMsg })
								throw new Error(response)
							} else {
								this.loader.hide()
								let errorMsg = response.message
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: pleaseMsg })
								throw new Error(response)
							}
						}
						try {
							const res = await makeRequest()
							manageResponse(res)
							response = res
						} catch (error) {
							let errorMsg = get("modals.mpchange38")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: pleaseMsg })
							response = '{"error": "Request could not be fulfilled"}'
						} finally {
							this.loader.hide()
						}
						break
					} else if (checkCoin === "ARRR") {
						this.loader.show()
						const amount = Number(data.amount)
						const recipient = data.destinationAddress ? data.destinationAddress : data.recipient
						const coin = data.coin
						const memo = data.memo
						const seed58 = this.arrrWallet.seed58
						const arrrWalletBalance = await parentEpml.request('apiCall', {
							url: `/crosschain/arrr/walletbalance?apiKey=${this.getApiKey()}`,
							method: 'POST',
							body: `${this.arrrWallet.seed58}`
						})
						if (isNaN(Number(arrrWalletBalance))) {
							this.loader.hide()
							let errorMsg = get("modals.mpchange81")
							let failedMsg = get("walletpage.wchange33") + " ARRR " + get("general.balance")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: failedMsg, id3: pleaseMsg })
							let obj = {}
							obj['error'] = errorMsg
							response = JSON.stringify(obj)
							break
						}
						const arrrWalletBalanceDecimals = Number(arrrWalletBalance)
						const arrrAmountDecimals = Number(amount) * QORT_DECIMALS
						const balance = (Number(arrrWalletBalance) / 1e8).toFixed(8)
						const fee = 0.00010000
						if (arrrAmountDecimals + (fee * QORT_DECIMALS) > arrrWalletBalanceDecimals) {
							this.loader.hide()
							let myMsg1 = get("chatpage.cchange51")
							let myMsg2 = get("walletpage.wchange26")
							let myMsg3 = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: myMsg2, id2: myMsg3 })
							let obj = {}
							obj['error'] = myMsg1
							response = JSON.stringify(obj)
							break
						}
						this.loader.hide()
						const processPayment = await showModalAndWait(
							actions.SEND_COIN,
							{
								amount,
								recipient,
								coin,
								balance,
								fee
							}
						)
						if (processPayment.action === 'reject') {
							let myMsg1 = get("transactions.declined")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("DECLINED_REQUEST", { id1: myMsg1, id2: myMsg2 })
							response = '{"error": "User declined request"}'
							break
						}
						this.loader.show()
						const makeRequest = async () => {
							const opts = {
								entropy58: seed58,
								receivingAddress: recipient,
								arrrAmount: amount,
								memo: memo
							}
							return await parentEpml.request('sendArrr', opts)
						}
						const manageResponse = (response) => {
							if (response.length === 64) {
								this.loader.hide()
								let successMsg = get("walletpage.wchange30")
								let patientMsg = get("walletpage.wchange43")
								showSuccessAndWait("REQUEST_SUCCESS", { id1: successMsg, id2: patientMsg })
							} else if (response === false) {
								this.loader.hide()
								let errorMsg = get("walletpage.wchange31")
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: pleaseMsg })
								throw new Error(response)
							} else {
								this.loader.hide()
								let errorMsg = response.message
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: pleaseMsg })
								throw new Error(response)
							}
						}
						try {
							const res = await makeRequest()
							manageResponse(res)
							response = res
							break
						} catch (error) {
							let errorMsg = get("modals.mpchange38")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("ACTION_FAILED", { id1: errorMsg, id2: pleaseMsg })
							response = '{"error": "Request could not be fulfilled"}'
						} finally {
							this.loader.hide()
						}
						break
					}
				}
					break

				default:
					console.log('Unhandled message: ' + JSON.stringify(data))
					break
			}
			// Parse response
			let responseObj
			try {
				responseObj = JSON.parse(response)
			} catch (e) {
				// Not all responses will be JSON
				responseObj = response
			}
			// Respond to app
			if (responseObj.error != null) {
				event.ports[0].postMessage({
					result: null,
					error: responseObj
				})
			} else {
				event.ports[0].postMessage({
					result: responseObj,
					error: null
				})
			}
		})
		this.clearConsole()
		setInterval(() => {
			this.clearConsole()
		}, 60000)
	}

	renderFullScreen() {
		if (window.innerHeight === screen.height) {
			return html`
				<mwc-button
					@click=${() => this.exitFullScreen()}
					title="${translate('browserpage.bchange38')}"
					class="address-bar-button float-right"
				>
					<mwc-icon>fullscreen_exit</mwc-icon>
				</mwc-button>
			`
		} else {
			return html`
				<mwc-button
					@click=${() => this.goFullScreen()}
					title="${translate('browserpage.bchange37')}"
					class="address-bar-button float-right"
				>
					<mwc-icon>fullscreen</mwc-icon>
				</mwc-button>
			`
		}
	}

	goFullScreen() {
		var elem = this.shadowRoot.getElementById('websitesWrapper')
		if (elem.requestFullscreen) {
			elem.requestFullscreen()
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen()
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen()
		} else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen()
		}
		this.renderFullScreen()
	}

	exitFullScreen() {
		if (document.exitFullscreen) {
			document.exitFullscreen()
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen()
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen()
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen()
		}
		this.renderFullScreen()
	}

	async decryptResourceQDN(data) {
		try {
			const privateKey = Base58.encode(window.parent.reduxStore.getState().app.wallet._addresses[0].keyPair.privateKey)
			const encryptedData = decryptGroupDataNew(data, privateKey)

			return {
				data: uint8ArrayToBase64(encryptedData.decryptedData),
				count: encryptedData.count
			}
		} catch (error) {
			console.log("Error:", error.message)
		}
	}

	async unitJoinFee() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const url = `${nodeUrl}/transactions/unitfee?txType=JOIN_GROUP`
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error('Error when fetching join fee')
		}
		const data = await response.json()
		return (Number(data) / 1e8).toFixed(8)
	}
	async deployAtFee() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const url = `${nodeUrl}/transactions/unitfee?txType=DEPLOY_AT`
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error('Error when fetching join fee')
		}
		const data = await response.json()
		return (Number(data) / 1e8).toFixed(8)
	}

	async messageFee() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const url = `${nodeUrl}/transactions/unitfee?txType=MESSAGE`
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error('Error when fetching message fee')
		}
		const data = await response.json()
		return (Number(data) / 1e8).toFixed(8)
	}


	async getArbitraryFee() {
		const timestamp = Date.now()
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const url = `${nodeUrl}/transactions/unitfee?txType=ARBITRARY&timestamp=${timestamp}`
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error('Error when fetching arbitrary fee')
		}
		const data = await response.json()
		const arbitraryFee = (Number(data) / 1e8).toFixed(8)
		return {
			timestamp,
			fee: Number(data),
			feeToShow: arbitraryFee
		}
	}
	async sendQortFee() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const url = `${nodeUrl}/transactions/unitfee?txType=PAYMENT`
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error('Error when fetching join fee')
		}
		const data = await response.json()
		return (Number(data) / 1e8).toFixed(8)
	}

	async unitVoteFee() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const url = `${nodeUrl}/transactions/unitfee?txType=VOTE_ON_POLL`
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error('Error when fetching vote fee')
		}
		const data = await response.json()
		return (Number(data) / 1e8).toFixed(8)
	}

	async unitCreatePollFee() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const url = `${nodeUrl}/transactions/unitfee?txType=CREATE_POLL`
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error('Error when fetching vote fee')
		}
		const data = await response.json()
		return (Number(data) / 1e8).toFixed(8)
	}

	async _joinGroup(groupId, groupName) {
		const joinFeeInput = await this.unitJoinFee()
		const getLastRef = async () => {
			return await parentEpml.request('apiCall', {
				type: 'api',
				url: `/addresses/lastreference/${this.selectedAddress.address}`
			})
		}
		const validateReceiver = async () => {
			let lastRef = await getLastRef()
			let myTransaction = await makeTransactionRequest(lastRef)
			return getTxnRequestResponse(myTransaction)
		}
		const makeTransactionRequest = async (lastRef) => {
			let groupdialog1 = get("transactions.groupdialog1")
			let groupdialog2 = get("transactions.groupdialog2")
			return await parentEpml.request('transaction', {
				type: 31,
				nonce: this.selectedAddress.nonce,
				params: {
					fee: joinFeeInput,
					registrantAddress: this.selectedAddress.address,
					rGroupName: groupName,
					rGroupId: groupId,
					lastReference: lastRef,
					groupdialog1: groupdialog1,
					groupdialog2: groupdialog2
				},
				apiVersion: 2
			})
		}
		const getTxnRequestResponse = (txnResponse) => {
			if (txnResponse.success === false && txnResponse.message) {
				throw new Error(txnResponse.message)
			} else if (txnResponse.success === true && !txnResponse.data.error) {
				return txnResponse.data
			} else if (txnResponse.data && txnResponse.data.message) {
				throw new Error(txnResponse.data.message)
			} else {
				throw new Error('Server error. Could not perform action.')
			}
		}
		return await validateReceiver()
	}

	async _deployAt(name, description, tags, creationBytes, amount, assetId, atType) {
		const deployAtFee = await this.deployAtFee()
		const getLastRef = async () => {
			return await parentEpml.request('apiCall', {
				type: 'api',
				url: `/addresses/lastreference/${this.selectedAddress.address}`
			})
		}
		const validateReceiver = async () => {
			let lastRef = await getLastRef()
			let myTransaction = await makeTransactionRequest(lastRef)
			return getTxnRequestResponse(myTransaction)
		}
		const makeTransactionRequest = async (lastRef) => {
			let deployAtdialog1 = get("transactions.deployAtdialog1")
			let deployAtdialog2 = get("transactions.deployAtdialog2")
			let deployAtdialog3 = get("transactions.deployAtdialog3")
			let deployAtdialog4 = get("walletpage.wchange12")
			return await parentEpml.request('transaction', {
				type: 16,
				nonce: this.selectedAddress.nonce,
				params: {
					fee: deployAtFee,
					rName: name,
					rDescription: description,
					rTags: tags,
					rAmount: amount,
					rAssetId: assetId,
					rCreationBytes: creationBytes,
					atType: atType,
					lastReference: lastRef,
					atDeployDialog1: deployAtdialog1,
					atDeployDialog2: deployAtdialog2,
					atDeployDialog3: deployAtdialog3,
					atDeployDialog4: deployAtdialog4
				},
				apiVersion: 2
			})
		}
		const getTxnRequestResponse = (txnResponse) => {
			if (txnResponse.success === false && txnResponse.message) {
				throw new Error(txnResponse.message)
			} else if (txnResponse.success === true && !txnResponse.data.error) {
				return txnResponse.data
			} else if (txnResponse.data && txnResponse.data.message) {
				throw new Error(txnResponse.data.message)
			} else {
				throw new Error('Server error. Could not perform action.')
			}
		}
		return await validateReceiver()
	}

	async _voteOnPoll(pollName, optionIndex) {
		const voteFeeInput = await this.unitVoteFee()
		const getLastRef = async () => {
			return await parentEpml.request('apiCall', {
				type: 'api',
				url: `/addresses/lastreference/${this.selectedAddress.address}`
			})
		}
		const validateReceiver = async () => {
			let lastRef = await getLastRef()
			let myTransaction = await makeTransactionRequest(lastRef)
			return getTxnRequestResponse(myTransaction)
		}
		const makeTransactionRequest = async (lastRef) => {
			let votedialog1 = get("transactions.votedialog1")
			let votedialog2 = get("transactions.votedialog2")
			let feeDialog = get("walletpage.wchange12")

			return await parentEpml.request('transaction', {
				type: 9,
				nonce: this.selectedAddress.nonce,
				params: {
					fee: voteFeeInput,
					voterAddress: this.selectedAddress.address,
					rPollName: pollName,
					rOptionIndex: optionIndex,
					lastReference: lastRef,
					votedialog1: votedialog1,
					votedialog2: votedialog2,
					feeDialog
				},
				apiVersion: 2
			})
		}
		const getTxnRequestResponse = (txnResponse) => {
			if (txnResponse.success === false && txnResponse.message) {
				throw new Error(txnResponse.message)
			} else if (txnResponse.success === true && !txnResponse.data.error) {
				return txnResponse.data
			} else if (txnResponse.data && txnResponse.data.message) {
				throw new Error(txnResponse.data.message)
			} else {
				throw new Error('Server error. Could not perform action.')
			}
		}
		return await validateReceiver()
	}

	async _createPoll(pollName, pollDescription, options, pollOwnerAddress) {
		const voteFeeInput = await this.unitCreatePollFee()
		const getLastRef = async () => {
			return await parentEpml.request('apiCall', {
				type: 'api',
				url: `/addresses/lastreference/${this.selectedAddress.address}`
			})
		}
		const validateReceiver = async () => {
			let lastRef = await getLastRef()
			let myTransaction = await makeTransactionRequest(lastRef)
			return getTxnRequestResponse(myTransaction)
		}
		const makeTransactionRequest = async (lastRef) => {
			let votedialog3 = get("transactions.votedialog3")
			let votedialog4 = get("transactions.votedialog4")
			let votedialog5 = get("transactions.votedialog5")
			let votedialog6 = get("transactions.votedialog6")
			let feeDialog = get("walletpage.wchange12")
			return await parentEpml.request('transaction', {
				type: 8,
				nonce: this.selectedAddress.nonce,
				params: {
					fee: voteFeeInput,
					ownerAddress: pollOwnerAddress,
					rPollName: pollName,
					rPollDesc: pollDescription,
					rOptions: options,
					lastReference: lastRef,
					votedialog3: votedialog3,
					votedialog4: votedialog4,
					votedialog5: votedialog5,
					votedialog6: votedialog6,
					feeDialog
				},
				apiVersion: 2
			})
		}
		const getTxnRequestResponse = (txnResponse) => {
			if (txnResponse.success === false && txnResponse.message) {
				throw new Error(txnResponse.message)
			} else if (txnResponse.success === true && !txnResponse.data.error) {
				return txnResponse.data
			} else if (txnResponse.data && txnResponse.data.message) {
				throw new Error(txnResponse.data.message)
			} else {
				throw new Error('Server error. Could not perform action.')
			}
		}
		return await validateReceiver()
	}

	async extractComponents(url) {
		if (!url.startsWith("qortal://")) {
			return null
		}
		url = url.replace(/^(qortal\:\/\/)/, "")
		if (url.includes("/")) {
			let parts = url.split("/")
			const service = parts[0].toUpperCase()
			parts.shift()
			const name = parts[0]
			parts.shift()
			let identifier
			if (parts.length > 0) {
				identifier = parts[0] // Do not shift yet
				// Check if a resource exists with this service, name and identifier combination
				let responseObj = await parentEpml.request('apiCall', {
					url: `/arbitrary/resource/status/${service}/${name}/${identifier}?apiKey=${this.getApiKey()}`
				})

				if (responseObj.totalChunkCount > 0) {
					// Identifier exists, so don't include it in the path
					parts.shift()
				}
				else {
					identifier = null
				}
			}
			const path = parts.join("/")
			const components = {}
			components["service"] = service
			components["name"] = name
			components["identifier"] = identifier
			components["path"] = path
			return components
		}
		return null
	}

	async _handleKeyDown(e) {
		if (e.key === 'Enter') {
			let newQuery = e.target.value
			if (newQuery.endsWith('/')) {
				newQuery = newQuery.slice(0, -1)
			}
			const res = await this.extractComponents(newQuery)
			if (!res) return
			const { service, name, identifier, path } = res
			let query = `?service=${service}`
			if (name) {
				query = query + `&name=${name}`
			}
			if (identifier) {
				query = query + `&identifier=${identifier}`
			}
			if (path) {
				query = query + `&path=${path}`
			}
			window.location = window.location.origin + window.location.pathname + query
		}
	}

	async linkOpenNewTab(link) {
		let newQuery = link
		if (newQuery.endsWith('/')) {
			newQuery = newQuery.slice(0, -1)
		}
		const res = await this.extractComponents(newQuery)
		if (!res) return
		const { service, name, identifier, path } = res
		let query = `?service=${service}`
		if (name) {
			query = query + `&name=${name}`
		}
		if (identifier) {
			query = query + `&identifier=${identifier}`
		}
		if (path) {
			query = query + `&path=${path}`
		}
		window.parent.reduxStore.dispatch(window.parent.reduxAction.setNewTab({
			url: `qdn/browser/index.html${query}`,
			id: this.uid.rnd(),
			myPlugObj: {
				"url": service === 'WEBSITE' ? "websites" : "qapps",
				"domain": "core",
				"page": `qdn/browser/index.html${query}`,
				"title": name,
				"icon": service === 'WEBSITE' ? 'vaadin:desktop' : 'vaadin:external-browser',
				"mwcicon": service === 'WEBSITE' ? 'desktop_mac' : 'open_in_browser',
				"menus": [],
				"parent": false
			}
		}))
	}

	getUserWallet(coin) {
		let userWallet = {}
		switch (coin) {
			case 'QORT':
				userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.address
				userWallet['publicKey'] = window.parent.reduxStore.getState().app.selectedAddress.base58PublicKey
				break
			case 'BTC':
				userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.btcWallet.address
				userWallet['publicKey'] = window.parent.reduxStore.getState().app.selectedAddress.btcWallet.derivedMasterPublicKey
				break
			case 'LTC':
				userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet.address
				userWallet['publicKey'] = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet.derivedMasterPublicKey
				break
			case 'DOGE':
				userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet.address
				userWallet['publicKey'] = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet.derivedMasterPublicKey
				break
			case 'DGB':
				userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.dgbWallet.address
				userWallet['publicKey'] = window.parent.reduxStore.getState().app.selectedAddress.dgbWallet.derivedMasterPublicKey
				break
			case 'RVN':
				userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.rvnWallet.address
				userWallet['publicKey'] = window.parent.reduxStore.getState().app.selectedAddress.rvnWallet.derivedMasterPublicKey
				break
			case 'ARRR':
				break
			default:
				break
		}
		return userWallet
	}

	clearConsole() {
		if (!isElectron()) {
		} else {
			console.clear()
			window.parent.electronAPI.clearCache()
		}
	}

	changeTheme() {
		const checkTheme = localStorage.getItem('qortalTheme')
		if (checkTheme === 'dark') {
			this.theme = 'dark'
		} else {
			this.theme = 'light'
		}
		document.querySelector('html').setAttribute('theme', this.theme)
	}

	changeLanguage() {
		const checkLanguage = localStorage.getItem('qortalLanguage')
		if (checkLanguage === null || checkLanguage.length === 0) {
			localStorage.setItem('qortalLanguage', 'us')
			use('us')
		} else {
			use(checkLanguage)
		}
	}

	addAppToNotificationList(appName) {
		if (!appName) throw new Error('unknown app name')
		const id = `appNotificationList-${this.selectedAddress.address}`
		const checkData = localStorage.getItem(id) ? JSON.parse(localStorage.getItem(id)) : null
		if (!checkData) {
			const newData = {
				[appName]: {
					interval: 900000, // 15mins in milliseconds
					lastNotification: null
				}
			}
			localStorage.setItem(id, JSON.stringify(newData))
		} else {
			const copyData = { ...checkData }
			copyData[appName] = {
				interval: 900000, // 15mins in milliseconds
				lastNotification: null
			}
			localStorage.setItem(id, JSON.stringify(copyData))
		}
	}

	updateLastNotification(id, appName) {
		const checkData = localStorage.getItem(id) ? JSON.parse(localStorage.getItem(id)) : null
		if (checkData) {
			const copyData = { ...checkData }
			if (copyData[appName]) {
				copyData[appName].lastNotification = Date.now() // Make sure to use Date.now(), not date.now()
			} else {
				copyData[appName] = {
					interval: 900000, // 15mins in milliseconds
					lastNotification: Date.now()
				}
			}
			localStorage.setItem(id, JSON.stringify(copyData))
		}
	}


	renderFollowUnfollowButton() {
		// Only show the follow/unfollow button if we have permission to modify the list on this node
		if (this.followedNames == null || !Array.isArray(this.followedNames)) {
			return html``
		}
		if (this.followedNames.indexOf(this.name) === -1) {
			// render follow button
			return html`
				<mwc-button
					@click=${() => this.follow()}
					title="${translate('browserpage.bchange7')} ${this.name}"
					class="address-bar-button float-right"
				>
					<mwc-icon>add_to_queue</mwc-icon>
				</mwc-button>
			`
		} else {
			// render unfollow button
			return html`
				<mwc-button
					@click=${() => this.unfollow()}
					title="${translate('browserpage.bchange8')} ${this.name}"
					class="address-bar-button float-right"
				>
					<mwc-icon>remove_from_queue</mwc-icon>
				</mwc-button>
			`
		}
	}

	renderBlockUnblockButton() {
		// Only show the block/unblock button if we have permission to modify the list on this node
		if (this.blockedNames == null || !Array.isArray(this.blockedNames)) {
			return html``
		}
		if (this.blockedNames.indexOf(this.name) === -1) {
			// render block button
			return html`
				<mwc-button
					@click=${() => this.block()}
					title="${translate('browserpage.bchange9')} ${this.name}"
					class="address-bar-button float-right"
				>
					<mwc-icon>block</mwc-icon>
				</mwc-button>
			`
		} else {
			// render unblock button
			return html`
				<mwc-button
					@click=${() => this.unblock()}
					title="${translate('browserpage.bchange10')} ${this.name}"
					class="address-bar-button float-right"
				>
					<mwc-icon>radio_button_unchecked</mwc-icon>
				</mwc-button>
			`
		}
	}

	// Navigation
	goBack() {
		window.history.back()
	}

	goForward() {
		window.history.forward()
	}

	refresh() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		if (this.dev === 'FRAMEWORK') {
			this.url = `${this.link}?time=${new Date().getMilliseconds()}`
		} else {
			this.url = `${nodeUrl}/render/${this.service}/${this.name}${this.path != null ? this.path : ''}?theme=${this.theme}&identifier=${this.identifier != null ? this.identifier : ''}&time=${new Date().getMilliseconds()}`
		}
	}

	goBackToList() {
		if (this.service === "APP") {
			this.exitFullScreen()
			window.location = '../../q-app/index.html'
		}
		else { // Default to websites list
			this.exitFullScreen()
			window.location = '../../q-website/index.html'
		}
	}

	follow() {
		this.followName(this.name)
	}

	unfollow() {
		this.unfollowName(this.name)
	}

	block() {
		this.blockName(this.name)
	}

	unblock() {
		this.unblockName(this.name)
	}

	delete() {
		this.deleteCurrentResource()
	}

	async followName(name) {
		let items = [name]
		let namesJsonString = JSON.stringify({ items: items })
		let ret = await parentEpml.request('apiCall', {
			url: `/lists/followedNames?apiKey=${this.getApiKey()}`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: `${namesJsonString}`
		})
		if (ret === true) {
			// Successfully followed - add to local list
			// Remove it first by filtering the list - doing it this way ensures the UI updates
			// immediately, as apposed to only adding if it doesn't already exist
			this.followedNames = this.followedNames.filter(
				(item) => item !== name
			)
			this.followedNames.push(name)
		} else {
			let err1string = get('browserpage.bchange11')
			parentEpml.request('showSnackBar', `${err1string}`)
		}
		return ret
	}

	async unfollowName(name) {
		let items = [name]
		let namesJsonString = JSON.stringify({ items: items })
		let ret = await parentEpml.request('apiCall', {
			url: `/lists/followedNames?apiKey=${this.getApiKey()}`,
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: `${namesJsonString}`
		})
		if (ret === true) {
			// Successfully unfollowed - remove from local list
			this.followedNames = this.followedNames.filter(
				(item) => item !== name
			)
		} else {
			let err2string = get('browserpage.bchange12')
			parentEpml.request('showSnackBar', `${err2string}`)
		}
		return ret
	}

	async blockName(name) {
		let items = [name]
		let namesJsonString = JSON.stringify({ items: items })
		let ret = await parentEpml.request('apiCall', {
			url: `/lists/blockedNames?apiKey=${this.getApiKey()}`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: `${namesJsonString}`
		})
		if (ret === true) {
			// Successfully blocked - add to local list
			// Remove it first by filtering the list - doing it this way ensures the UI updates
			// immediately, as apposed to only adding if it doesn't already exist
			this.blockedNames = this.blockedNames.filter(
				(item) => item !== name
			)
			this.blockedNames.push(name)
		} else {
			let err3string = get('browserpage.bchange13')
			parentEpml.request('showSnackBar', `${err3string}`)
		}
		return ret
	}

	async unblockName(name) {
		let items = [name]
		let namesJsonString = JSON.stringify({ items: items })
		let ret = await parentEpml.request('apiCall', {
			url: `/lists/blockedNames?apiKey=${this.getApiKey()}`,
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: `${namesJsonString}`
		})
		if (ret === true) {
			// Successfully unblocked - remove from local list
			this.blockedNames = this.blockedNames.filter((item) => item !== name)
		} else {
			let err4string = get('browserpage.bchange14')
			parentEpml.request('showSnackBar', `${err4string}`)
		}
		return ret
	}

	async deleteCurrentResource() {
		if (this.followedNames.indexOf(this.name) !== -1) {
			// Following name - so deleting won't work
			let err5string = get('browserpage.bchange15')
			parentEpml.request('showSnackBar', `${err5string}`)
			return
		}
		let identifier = (this.identifier == null || this.identifier.length === 0) ? 'default' : this.identifier
		let ret = await parentEpml.request('apiCall', {
			url: `/arbitrary/resource/${this.service}/${this.name}/${identifier}?apiKey=${this.getApiKey()}`,
			method: 'DELETE'
		})
		if (ret === true) {
			this.goBackToList()
		} else {
			let err6string = get('browserpage.bchange16')
			parentEpml.request('showSnackBar', `${err6string}`)
		}
		return ret
	}

	// Standard functions
	getApiKey() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.apiKey
	}

	isEmptyArray(arr) {
		if (!arr) { return true }
		return arr.length === 0
	}

	round(number) {
		return (Math.round(parseFloat(number) * 1e8) / 1e8).toFixed(8)
	}
}

window.customElements.define('web-browser', WebBrowser)

async function showModalAndWait(type, data) {
	// Create a new Promise that resolves with user data and an action when the user clicks a button
	return new Promise((resolve) => {
		// Create the modal and add it to the DOM
		const modal = document.createElement('div')
		modal.id = "backdrop"
		modal.classList.add("backdrop")
		modal.innerHTML = `
			<div class="modal my-modal-class">
				<div class="modal-content">
					<div class="modal-body">
						${type === actions.GET_USER_ACCOUNT ? `
							<div class="modal-subcontainer">
								<p class="modal-paragraph">${`<span class="capitalize-first">${data.service.toLowerCase()}</span> ${get("browserpage.bchange18")}`}</p>
								<p class="modal-paragraph">${get("browserpage.bchange24")} ${data.service.toLowerCase()}.</p>
								<p class="modal-paragraph">${get("browserpage.bchange25")}</p>
								<div class="checkbox-row">
									<label for="authButton" id="authButtonLabel" style="color: var(--black);">
										${get('browserpage.bchange26')}
									</label>
									<mwc-checkbox style="margin-right: -15px;" id="authButton" ?checked=${window.parent.reduxStore.getState().app.qAPPAutoAuth}></mwc-checkbox>
								</div>
							</div>
						` : ''}

						${type === actions.ADMIN_ACTION ? `
							<div class="modal-subcontainer">
								<p class="modal-paragraph">
									${data.type === 'stop' ? get("nodepage.nchange31") : ''}
									${data.type === 'restart' ? get("nodepage.nchange33") : ''}
									${data.type === 'bootstrap' ? get("tour.tour18") : ''}
									${data.type === 'addmintingaccount' ? `${get("nodepage.nchange8")}: ${get("nodepage.nchange9")}` : ''}
									${data.type === 'removemintingaccount' ? `${get("nodepage.nchange12")}: ${get("nodepage.nchange9")}` : ''}
									${data.type === 'forcesync' ? get("nodepage.nchange23") : ''}
									${data.type === 'addpeer' ? `${get("nodepage.nchange8")}: ${get("nodepage.nchange17")}` : ''}
									${data.type === 'removepeer' ? `${get("nodepage.nchange12")}: ${get("nodepage.nchange17")}` : ''}
								</p>
								${data.value ? `<p class="modal-paragraph">${data.value}</p>` : ''}
								<p class="modal-paragraph">${get("browserpage.bchange55")}</p>
							</div>
						` : ''}

						${type === actions.PUBLISH_MULTIPLE_QDN_RESOURCES ? `
							<div class="modal-subcontainer">
								<p class="modal-paragraph">${get("browserpage.bchange19")}</p>
								<p style="font-size: 16px;overflow-wrap: anywhere;" class="modal-paragraph"><span style="font-weight: bold">${get("browserpage.bchange45")}:</span> ${(!!data.encrypt)}</p>
								<table>
									${data.resources.map((resource) => `
										<tr>
											<td><span style="font-weight: bold">${get("browserpage.bchange30")}:</span> ${resource.service}</td>
											<td><span style="font-weight: bold">${get("browserpage.bchange31")}:</span> ${resource.name}</td>
											<td><span style="font-weight: bold">${get("browserpage.bchange32")}:</span> ${resource.identifier}</td>
											${resource.filename ? `<td><span style="font-weight: bold">${get("browserpage.bchange34")}:</span> ${resource.filename}</td>` : ''}
										</tr>
									`).join('')}
								</table>
								<div class="checkbox-row">
									<p style="font-size: 16px;overflow-wrap: anywhere;" class="modal-paragraph">${get('browserpage.bchange47')} <span style="font-weight: bold">${data.resources.length * data.feeAmount} QORT ${get("walletpage.wchange36")}</span></p>
								</div>
							</div>
						` : ''}

						${type === actions.PUBLISH_QDN_RESOURCE ? `
							<div class="modal-subcontainer">
								<p class="modal-paragraph">${get("browserpage.bchange19")}</p>
								<p style="font-size: 16px;overflow-wrap: anywhere;" class="modal-paragraph"><span style="font-weight: bold">${get("browserpage.bchange30")}:</span> ${data.service}</p>
								<p style="font-size: 16px;overflow-wrap: anywhere;" class="modal-paragraph"><span style="font-weight: bold">${get("browserpage.bchange31")}:</span> ${data.name}</p>
								<p style="font-size: 16px;overflow-wrap: anywhere;" class="modal-paragraph"><span style="font-weight: bold">${get("browserpage.bchange32")}:</span> ${data.identifier}</p>
								<p style="font-size: 16px;overflow-wrap: anywhere;" class="modal-paragraph"><span style="font-weight: bold">${get("browserpage.bchange45")}:</span> ${(!!data.encrypt)}</p>
								<div class="checkbox-row">
								<p style="font-size: 16px;overflow-wrap: anywhere;" class="modal-paragraph">${get('browserpage.bchange47')} <span style="font-weight: bold">${data.feeAmount} QORT ${get("walletpage.wchange36")}</span></p>
								</div>
							</div>
						` : ''}

						${type === actions.SEND_COIN ? `
							<div class="modal-subcontainer">
								<p class="modal-paragraph">${get("browserpage.bchange35")}</p>
								<p style="font-size: 16px;overflow-wrap: anywhere;" class="modal-paragraph"><span style="font-weight: bold">${get("walletpage.wchange59")}:</span> ${data.coin}</p>
								<p style="font-size: 16px;overflow-wrap: anywhere;" class="modal-paragraph"><span style="font-weight: bold">${get("walletpage.wchange19")}:</span> ${data.balance} ${data.coin}</p>
								<p style="font-size: 16px;overflow-wrap: anywhere;" class="modal-paragraph"><span style="font-weight: bold">${get("walletpage.wchange10")}:</span> ${data.recipient}</p>
								<p style="font-size: 16px;overflow-wrap: anywhere;" class="modal-paragraph"><span style="font-weight: bold">${get("walletpage.wchange11")}:</span> ${data.amount} ${data.coin}</p>
								<p style="font-size: 16px;overflow-wrap: anywhere;" class="modal-paragraph"><span style="font-weight: bold">${get("walletpage.wchange36")}:</span> ~${data.fee} ${data.coin}</p>
							</div>
						` : ''}

						${type === actions.GET_USER_WALLET ? `
							<div class="modal-subcontainer">
								<p class="modal-paragraph">${get("browserpage.bchange52")}</p>
							</div>
						` : ''}

						${type === actions.GET_WALLET_BALANCE ? `
							<div class="modal-subcontainer">
								<p class="modal-paragraph">${get("browserpage.bchange20")}</p>
								<div class="checkbox-row">
									<label for="balanceButton" id="balanceButtonLabel" style="color: var(--black);">
										${get('modals.mpchange86')}
									</label>
									<mwc-checkbox style="margin-right: -15px;" id="balanceButton" ?checked=${window.parent.reduxStore.getState().app.qAPPAutoBalance}></mwc-checkbox>
								</div>
							</div>
						` : ''}

						${type === actions.GET_LIST_ITEMS ? `
							<div class="modal-subcontainer">
								<p class="modal-paragraph">${get("browserpage.bchange41")}</p>
								<p class="modal-paragraph">${get("browserpage.bchange40")}: <span> ${data.list_name}</span></p>
								<div class="checkbox-row">
									<label for="listsButton" id="listsButtonLabel" style="color: var(--black);">
										${get('browserpage.bchange39')}
									</label>
									<mwc-checkbox style="margin-right: -15px;" id="listsButton" ?checked=${window.parent.reduxStore.getState().app.qAPPAutoLists}></mwc-checkbox>
								</div>
							</div>
						` : ''}

						${type === actions.GET_FRIENDS_LIST ? `
							<div class="modal-subcontainer">
								<p class="modal-paragraph">${get("browserpage.bchange54")}</p>
								<div class="checkbox-row">
									<label for="friendsListCheckbox" id="friendsListLabel" style="color: var(--black);">
										${get('browserpage.bchange53')}
									</label>
									<mwc-checkbox style="margin-right: -15px;" id="friendsListCheckbox" ?checked=${window.parent.reduxStore.getState().app.qAPPFriendsList}></mwc-checkbox>
								</div>
							</div>
						` : ''}

						${type === actions.ADD_LIST_ITEMS ? `
							<div class="modal-subcontainer">
								<p class="modal-paragraph">${get("browserpage.bchange43")}</p>
								<p class="modal-paragraph">${get("browserpage.bchange40")}: <span> ${data.list_name}</span></p>
								<p class="modal-paragraph">${get("browserpage.bchange42")}: <span> ${data.items.join(', ')}</span></p>
							</div>
						` : ''}

						${type === actions.SAVE_FILE ? `
							<div class="modal-subcontainer">
								<p class="modal-paragraph">${get("browserpage.bchange46")}: <span> ${data.filename}</span></p>
							</div>
						` : ''}

						${type === actions.GET_PROFILE_DATA ? `
							<div class="modal-subcontainer">
								<p class="modal-paragraph">${get("browserpage.bchange49")}: <span style="font-weight: bold"> ${data.property}</span></p>
							</div>
						` : ''}

						${type === actions.SET_PROFILE_DATA ? `
							<div class="modal-subcontainer">
								<p class="modal-paragraph">${get("browserpage.bchange50")} <span style="font-weight: bold"> ${data.property}</span></p>
								<br>
								<p style="font-size: 16px;overflow-wrap: anywhere;" class="modal-paragraph">${get('browserpage.bchange47')} <span style="font-weight: bold">${data.fee} QORT ${get("walletpage.wchange36")}</span></p>
								<br>
								<p style="font-size: 16px;overflow-wrap: anywhere;" class="modal-paragraph">${get('browserpage.bchange51')} </p>
							</div>
						` : ''}

						${type === actions.NOTIFICATIONS_PERMISSION ? `
							<div class="modal-subcontainer">
								<p class="modal-paragraph">${get("browserpage.bchange48")}</p>
							</div>
						` : ''}

						${type === actions.DELETE_LIST_ITEM ? `
							<div class="modal-subcontainer">
								<p class="modal-paragraph">${get("browserpage.bchange44")}</p>
								<p class="modal-paragraph">${get("browserpage.bchange40")}: <span> ${data.list_name}</span></p>
								<p class="modal-paragraph">${get("browserpage.bchange42")}: <span> ${data.item}</span></p>
							</div>
						` : ''}

						${type === actions.SEND_CHAT_MESSAGE ? `
							<p class="modal-paragraph">${get("browserpage.bchange22")}</p>
							<p class="modal-paragraph">${get("chatpage.cchange4")}: <span> ${data.message}</span></p>
						` : ''}

						${type === actions.SIGN_TRANSACTION ? `
							<p class="modal-paragraph">${data.text1}</p>
							<p class="modal-paragraph">${data.text2}</p>
							<p class="modal-paragraph">${data.text3}</p>
							<p class="modal-paragraph"><span>${data.txdata}</span></p>
							<p class="modal-paragraph"><span>${convertJson(data.txjson)}</span></p>
						` : ''}

						${type === actions.CREATE_TRADE_BUY_ORDER ? `
							<p class="modal-paragraph">${data.text1}</p>
							<p class="modal-paragraph">${data.text2}</p>
							<p class="modal-paragraph">${data.text3}</p>
							<p class="modal-paragraph">${get("walletpage.wchange36")}: <span>${data.foreignFee}</span></p>
						` : ''}

						${type === actions.CREATE_TRADE_SELL_ORDER ? `
							<p class="modal-paragraph">${data.text1}</p>
							<p class="modal-paragraph">${data.text2}</p>
							<p class="modal-paragraph">${data.text3}</p>
							<p class="modal-paragraph">${get("walletpage.wchange36")}: <span>${data.fee}</span></p>
						` : ''}

						${type === actions.CANCEL_TRADE_SELL_ORDER ? `
							<p class="modal-paragraph">${data.text1}</p>
							<p class="modal-paragraph">${data.text2}</p>
							<p class="modal-paragraph">${data.text3}</p>
							<p class="modal-paragraph">${get("walletpage.wchange36")}: <span>${data.fee}</span></p>
						` : ''}

						${type === actions.JOIN_GROUP ? `
							<p class="modal-paragraph">${data.text1}</p>
							<p class="modal-paragraph">${data.text2}</p>
							<p class="modal-paragraph">${data.text3}</p>
							<p class="modal-paragraph">${get("walletpage.wchange36")}: <span>${data.fee}</span></p>
						` : ''}

						${type === actions.GET_USER_WALLET_TRANSACTIONS ? `
							<div class="modal-subcontainer">
								<p class="modal-paragraph">Do you give this application permission to retrieve your wallet transactions?</p>
								<div class="checkbox-row">
									<label for="transactionsButton" id="transactionsButtonLabel" style="color: var(--black);">
										Always allow wallet txs to be retrieved automatically
									</label>
									<mwc-checkbox style="margin-right: -15px;" id="transactionsButton" ?checked=${window.parent.reduxStore.getState().app.qAPPAutoTransactions}></mwc-checkbox>
								</div>
							</div>
						` : ''}
					</div>
					<div class="modal-buttons">
						<button id="cancel-button">${get("browserpage.bchange27")}</button>
						<button id="ok-button">${get("browserpage.bchange28")}</button>
					</div>
				</div>
			</div>
		`
		document.body.appendChild(modal)

		// Add click event listeners to the buttons
		const okButton = modal.querySelector('#ok-button')
		okButton.addEventListener('click', () => {
			const userData = {}
			if (type === actions.PUBLISH_QDN_RESOURCE || type === actions.PUBLISH_MULTIPLE_QDN_RESOURCES) {
				const isWithFeeCheckbox = modal.querySelector('#isWithFee')
				// userData.isWithFee = isWithFeeCheckbox.checked
				userData.isWithFee = true
			}
			if (modal.parentNode === document.body) {
				document.body.removeChild(modal)
			}
			resolve({ action: 'accept', userData })
		})

		const modalContent = modal.querySelector('.modal-content')
		modalContent.addEventListener('click', (e) => {
			e.stopPropagation()
		})

		const backdropClick = document.getElementById('backdrop')
		backdropClick.addEventListener('click', () => {
			if (modal.parentNode === document.body) {
				document.body.removeChild(modal)
			}
			resolve({ action: 'reject' })
		})

		const cancelButton = modal.querySelector('#cancel-button')
		cancelButton.addEventListener('click', () => {
			if (modal.parentNode === document.body) {
				document.body.removeChild(modal)
			}
			resolve({ action: 'reject' })
		})

		const labelButton = modal.querySelector('#authButtonLabel')
		if (labelButton) {
			labelButton.addEventListener('click', () => {
				this.shadowRoot.getElementById('authButton').click()
			})
		}

		const checkbox = modal.querySelector('#authButton')
		if (checkbox) {
			checkbox.addEventListener('click', (e) => {
				if (e.target.checked) {
					window.parent.reduxStore.dispatch(window.parent.reduxAction.removeQAPPAutoAuth(false))
					return
				}
				window.parent.reduxStore.dispatch(window.parent.reduxAction.allowQAPPAutoAuth(true))
			})
		}

		const labelButton1 = modal.querySelector('#balanceButtonLabel')
		if (labelButton1) {
			labelButton1.addEventListener('click', () => {
				this.shadowRoot.getElementById('balanceButton').click()
			})
		}

		const checkbox1 = modal.querySelector('#balanceButton')
		if (checkbox1) {
			checkbox1.addEventListener('click', (e) => {
				if (e.target.checked) {
					window.parent.reduxStore.dispatch(window.parent.reduxAction.removeQAPPAutoBalance(false))
					return
				}
				window.parent.reduxStore.dispatch(window.parent.reduxAction.allowQAPPAutoBalance(true))
			})
		}

		const labelButton2 = modal.querySelector('#listsButtonLabel')
		if (labelButton2) {
			labelButton2.addEventListener('click', () => {
				this.shadowRoot.getElementById('listsButton').click()
			})
		}

		const checkbox2 = modal.querySelector('#listsButton')
		if (checkbox2) {
			checkbox2.addEventListener('click', (e) => {
				if (e.target.checked) {
					window.parent.reduxStore.dispatch(window.parent.reduxAction.removeQAPPAutoLists(false))
					return
				}
				window.parent.reduxStore.dispatch(window.parent.reduxAction.allowQAPPAutoLists(true))
			})
		}

		const labelButton3 = modal.querySelector('#transactionsButtonLabel')
		if (labelButton3) {
			labelButton3.addEventListener('click', () => {
				this.shadowRoot.getElementById('transactionsButton').click()
			})
		}

		const checkbox3 = modal.querySelector('#transactionsButton')
		if (checkbox3) {
			checkbox3.addEventListener('click', (e) => {
				if (e.target.checked) {
					window.parent.reduxStore.dispatch(window.parent.reduxAction.removeQAPPAutoTransacions(false))
					return
				}
				window.parent.reduxStore.dispatch(window.parent.reduxAction.allowQAPPAutoTransacions(true))
			})
		}

		const labelButtonFriendsList = modal.querySelector('#friendsListLabel')
		if (labelButtonFriendsList) {
			labelButtonFriendsList.addEventListener('click', () => {
				this.shadowRoot.getElementById('listsButton').click()
			})
		}

		const labelButtonFriendsList2 = modal.querySelector('#friendsListCheckbox')
		if (labelButtonFriendsList2) {
			labelButtonFriendsList2.addEventListener('click', (e) => {
				if (e.target.checked) {
					window.parent.reduxStore.dispatch(window.parent.reduxAction.removeQAPPAutoFriendsList(false))
					return
				}
				window.parent.reduxStore.dispatch(window.parent.reduxAction.allowQAPPAutoFriendsList(true))
			})
		}
	})
}

function convertJson(jsonStr) {
	let regeStr = ''
	let f = {
		brace: 0
	}

	regeStr = jsonStr.replace(/({|}[,]*|[^{}:]+:[^{}:,]*[,{]*)/g, function (m, p1) {
		const rtnFn = function() {
			return '<div style="text-indent: ' + (f['brace'] * 20) + 'px;color: var(--black);">' + p1 + '</div>'
		}

		let rtnStr = 0

		if (p1.lastIndexOf('{') === (p1.length - 1)) {
			rtnStr = rtnFn()
			f['brace'] += 1
		} else if (p1.indexOf('}') === 0) {
			f['brace'] -= 1
			rtnStr = rtnFn()
		} else {
			rtnStr = rtnFn()
		}

		return rtnStr
	})

	return regeStr
}

async function showErrorAndWait(type, data) {
	// Create the modal and add it to the DOM
	const modalDelay = ms => new Promise(res => setTimeout(res, ms))
	const error = document.createElement('div')
	error.id = "backdrop"
	error.classList.add("backdrop")
	error.innerHTML = `
		<div class="modal">
			<div class="modal-content-error">
				<div class="modal-body">
					${type === "MISSING_FIELDS" ? `
						<div class="modal-subcontainer-error">
							<p class="modal-paragraph-error-header">${get("modals.mpchange82")}</p>
							${data.id1 ? `<p class="modal-paragraph-error">${data.id1}</p>` : ''}
							${data.id2 ? `<p class="modal-paragraph-error">${data.id2}</p>` : ''}
							${data.id3 ? `<p class="modal-paragraph-error">${data.id3}</p>` : ''}
						</div>
					` : ''}

					${type === "DECLINED_REQUEST" ? `
						<div class="modal-subcontainer-error">
							<p class="modal-paragraph-error-header">${get("modals.mpchange83")}</p>
							${data.id1 ? `<p class="modal-paragraph-error">${data.id1}</p>` : ''}
							${data.id2 ? `<p class="modal-paragraph-error">${data.id2}</p>` : ''}
							${data.id3 ? `<p class="modal-paragraph-error">${data.id3}</p>` : ''}
						</div>
					` : ''}

					${type === "ACTION_FAILED" ? `
						<div class="modal-subcontainer-error">
							<p class="modal-paragraph-error-header">${get("modals.mpchange84")}</p>
							${data.id1 ? `<p class="modal-paragraph-error">${data.id1}</p>` : ''}
							${data.id2 ? `<p class="modal-paragraph-error">${data.id2}</p>` : ''}
							${data.id3 ? `<p class="modal-paragraph-error">${data.id3}</p>` : ''}
						</div>
					` : ''}
				</div>
			</div>
		</div>
	`
	document.body.appendChild(error)
	await modalDelay(3000)
	document.body.removeChild(error)
}

async function showSuccessAndWait(type, data) {
	// Create the modal and add it to the DOM
	const modalDelay = ms => new Promise(res => setTimeout(res, ms))
	const success = document.createElement('div')
	success.id = "backdrop"
	success.classList.add("backdrop")
	success.innerHTML = `
		<div class="modal">
			<div class="modal-content-success">
				<div class="modal-body">
					${type === "REQUEST_SUCCESS" ? `
						<div class="modal-subcontainer-success">
							<p class="modal-paragraph-success-header">${get("modals.mpchange85")}</p>
							${data.id1 ? `<p class="modal-paragraph-success">${data.id1}</p>` : ''}
							${data.id2 ? `<p class="modal-paragraph-success">${data.id2}</p>` : ''}
							${data.id3 ? `<p class="modal-paragraph-success">${data.id3}</p>` : ''}
						</div>
					` : ''}
				</div>
			</div>
		</div>
	`
	document.body.appendChild(success)
	await modalDelay(3000)
	document.body.removeChild(success)
}

// Add the styles for the modal
const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(webBrowserModalStyles)
document.adoptedStyleSheets = [styleSheet]
