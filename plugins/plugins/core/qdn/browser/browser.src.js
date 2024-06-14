import { html, LitElement } from 'lit'
import { Epml } from '../../../../epml'
import { Loader, publishData } from '../../../utils/classes'
import { QORT_DECIMALS } from '../../../../../crypto/api/constants'
import { mimeToExtensionMap } from '../../components/qdn-action-constants'
import {
	base64ToUint8Array,
	decryptDeprecatedSingle,
	decryptGroupData,
	encryptDataGroup,
	fileToBase64,
	uint8ArrayStartsWith,
	uint8ArrayToBase64
} from '../../components/qdn-action-encryption'
import { webBrowserStyles, webBrowserModalStyles } from '../../components/plugins-css'
import * as actions from '../../components/qdn-action-types'
import isElectron from 'is-electron'
import ShortUniqueId from 'short-unique-id'
import FileSaver from 'file-saver'
import WebWorker from 'web-worker:./computePowWorkerFile.js'
import WebWorkerChat from 'web-worker:./computePowWorker.js'
import '@material/mwc-button'
import '@material/mwc-icon'
import '@material/mwc-checkbox'

// Multi language support
import { get, registerTranslateConfig, translate, use } from '../../../../../core/translate'
registerTranslateConfig({
	loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

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
		let displayUrl = ''

		if (this.dev === 'FRAMEWORK') {
			displayUrl = 'qortal://app/development'
		} else {
			displayUrl = 'qortal://' + this.service + '/' + this.name

			if (this.identifier && this.identifier != 'null' && this.identifier != 'default') {
				displayUrl = displayUrl.concat('/' + this.identifier)
			}

			if (this.path != null && this.path != '/') {
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
				this.url = `${nodeUrl}/render/${this.service}/${this.name}${this.path != null ? this.path : ''}?theme=${this.theme}&identifier=${(this.identifier != null && this.identifier != 'null') ? this.identifier : ''}`
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
    						<input @keydown=${this._handleKeyDown} style="width: 550px; color: var(--black);" id="address" type="text" value="${this.displayUrl}"></input>
    						${this.renderFullScreen()}
    						<mwc-button @click=${() => this.delete()} title="${translate('browserpage.bchange4')} ${this.service} ${this.name} ${translate('browserpage.bchange5')}" class="address-bar-button float-right">
							<mwc-icon>delete</mwc-icon>
						</mwc-button>
    						${this.renderBlockUnblockButton()}
    						${this.renderFollowUnfollowButton()}
    					</div>
    					<div class="iframe-container">
    						<iframe id="browser-iframe" src="${this.url}" sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals" allow="fullscreen">
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
			if (event == null || event.data == null || event.data.length == 0 || event.data.action == null) {
				return
			}

			let response = '{"error": "Request could not be fulfilled"}'
			let data = event.data

			switch (data.action) {
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
						break
					}
				}

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
						break
					}
				}

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
						break
					}
				}

				case actions.GET_LIST_ITEMS: {
					const requiredFields = ['list_name']
					const missingFields = []
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
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

						} catch (error) {
							const data = {}
							data['error'] = "Error in retrieving list"
							response = JSON.stringify(data)
						} finally {
							break
						}
					} else {
						const data = {}
						data['error'] = "User declined to share list"
						response = JSON.stringify(data)
						break
					}
				}

				case actions.ADD_LIST_ITEMS: {
					const requiredFields = ['list_name', 'items']
					const missingFields = []
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
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
						} catch (error) {
							const data = {}
							data['error'] = "Error in adding to list"
							response = JSON.stringify(data)
						} finally {
							break
						}
					} else {
						const data = {}
						data['error'] = "User declined add to list"
						response = JSON.stringify(data)
						break
					}
				}

				case actions.DELETE_LIST_ITEM: {
					const requiredFields = ['list_name', 'item']
					const missingFields = []
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
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
						} catch (error) {
							const data = {}
							data['error'] = "Error in adding to list"
							response = JSON.stringify(data)
						} finally {
							break
						}
					} else {
						const data = {}
						data['error'] = "User declined add to list"
						response = JSON.stringify(data)
						break
					}
				}

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
						} catch (error) {
							const data = {}
							data['error'] = "Error in retrieving friends list"
							response = JSON.stringify(data)
						}
						break
					} else {
						const data = {}
						data['error'] = "User declined to share friends list"
						response = JSON.stringify(data)
						break
					}
				}

				case actions.LINK_TO_QDN_RESOURCE:
				case actions.QDN_RESOURCE_DISPLAYED:
					// Links are handled by the core, but the UI also listens for these actions in order to update the address bar.
					// Note: don't update this.url here, as we don't want to force reload the iframe each time.
					if (this.preview != null && this.preview.length > 0) {
						this.displayUrl = translate("appspage.schange40")
						return
					}
					let url = 'qortal://' + data.service + '/' + data.name
					this.path = data.path != null ? (data.path.startsWith('/') ? '' : '/') + data.path : null
					if (data.identifier != null && data.identifier != '' && data.identifier != 'default') {
						url = url.concat('/' + data.identifier)
					}
					if (this.path != null && this.path != '/') {
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
					return

				case actions.SET_TAB_NOTIFICATIONS: {
					const { count } = data
					if (isNaN(count)) {
						response['error'] = 'count is not a number'
						break
					}
					if (count === undefined) {
						response['error'] = 'missing count'
						break
					}
					window.parent.reduxStore.dispatch(window.parent.reduxAction.setTabNotifications({
						name: this.name,
						count: count
					}))
					response = true
					break
				}

				case actions.PUBLISH_QDN_RESOURCE: {
					// optional fields: encrypt:boolean recipientPublicKey:string
					const requiredFields = ['service', 'name']
					const missingFields = []
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
						break
					}
					if (!data.file && !data.data64) {
						let data = {}
						data['error'] = "No data or file was submitted"
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
						let data = {}
						data['error'] = "Encrypting data requires public keys"
						response = JSON.stringify(data)
						break
					}
					if (!data.encrypt && data.service.endsWith("_PRIVATE")) {
						let data = {}
						data['error'] = "Only encrypted data can go into private services"
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
							const obj = {}
							obj['error'] = error.message || 'Upload failed due to failed encryption'
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
							worker.terminate()
							const obj = {}
							obj['error'] = error.message || 'Upload failed'
							response = JSON.stringify(obj)
							console.error(error)
							break
						} finally {
							this.loader.hide()
						}
					} else if (res2.action === 'reject') {
						response = '{"error": "User declined request"}'
					}
					// Params: data.service, data.name, data.identifier, data.data64,
					// TODO: prompt user for publish. If they confirm, call `POST /arbitrary/{service}/{name}/{identifier}/base64` and sign+process transaction
					// then set the response string from the core to the `response` variable (defined above)
					// If they decline, send back JSON that includes an `error` key, such as `{"error": "User declined request"}`
					break
				}

				case actions.PUBLISH_MULTIPLE_QDN_RESOURCES: {
					const requiredFields = ['resources']
					const missingFields = []
					let feeAmount = null
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
						break
					}
					const resources = data.resources
					if (!Array.isArray(resources)) {
						let data = {}
						data['error'] = "Invalid data"
						response = JSON.stringify(data)
						break
					}
					if (resources.length === 0) {
						let data = {}
						data['error'] = "No resources to publish"
						response = JSON.stringify(data)
						break
					}
					if (data.encrypt && (!data.publicKeys || (Array.isArray(data.publicKeys) && data.publicKeys.length === 0))) {
						let data = {}
						data['error'] = "Encrypting data requires public keys"
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
								const errorMsg = "Only encrypted data can go into private services"
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
									const errorMsg = error.message || 'Upload failed due to failed encryption'
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
								const errorMsg = error.message || 'Upload failed'
								failedPublishesIdentifiers.push({
									reason: errorMsg,
									identifier: resource.identifier
								})
							}
						} catch (error) {
							failedPublishesIdentifiers.push({
								reason: "Unknown error",
								identifier: resource.identifier
							})
						}
					}
					this.loader.hide()
					if (failedPublishesIdentifiers.length > 0) {
						response = failedPublishesIdentifiers
						const obj = {}
						obj['error'] = {
							unsuccessfulPublishes: failedPublishesIdentifiers
						}
						response = JSON.stringify(obj)
						this.loader.hide()
						break
					}
					response = true
					break
				}

				case actions.VOTE_ON_POLL: {
					const requiredFields = ['pollName', 'optionIndex']
					const missingFields = []
					requiredFields.forEach((field) => {
						if (!data[field] && data[field] !== 0) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
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
						const errorMsg = (error && error.message) || 'Poll not found'
						let obj = {}
						obj['error'] = errorMsg
						response = JSON.stringify(obj)
						break
					}
					if (!pollInfo || pollInfo.error) {
						const errorMsg = (pollInfo && pollInfo.message) || 'Poll not found'
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
						const obj = {}
						obj['error'] = error.message || 'Failed to vote on the poll.'
						response = JSON.stringify(obj)
					} finally {
						this.loader.hide()
					}
					break
				}

				case actions.CREATE_POLL: {
					const requiredFields = ['pollName', 'pollDescription', 'pollOptions', 'pollOwnerAddress']
					const missingFields = []
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
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
						const obj = {}
						obj['error'] = error.message || 'Failed to created poll.'
						response = JSON.stringify(obj)
					} finally {
						this.loader.hide()
					}
					break
				}

				case actions.OPEN_NEW_TAB: {
					if (!data.qortalLink) {
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
						console.log('error', error)
						const obj = {}
						obj['error'] = "Invalid qortal link"
						response = JSON.stringify(obj)
						break
					}
				}

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
						break
					}
				}

				case actions.SEND_LOCAL_NOTIFICATION: {
					const { title, url, icon, message } = data
					try {
						const id = `appNotificationList-${this.selectedAddress.address}`
						const checkData = localStorage.getItem(id) ? JSON.parse(localStorage.getItem(id)) : null
						if (!checkData || !checkData[this.name]) throw new Error('App not on permission list')
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
								throw new Error(`invalid data`)
							}
						} else if (!lastNotification) {
							parentEpml.request('showNotification', {
								title, type: "qapp-local-notification", sound: '', url, options: { body: message, icon, badge: icon }
							})
							response = true
							this.updateLastNotification(id)
							break
						} else {
							throw new Error(`invalid data`)
						}
					} catch (error) {
						const obj = {}
						obj['error'] = error.message || "error in pushing notification"
						response = JSON.stringify(obj)
						break
					}
				}

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
								throw new Error(res.message)
							} else {
								throw new Error('ERROR: Could not send message')
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
							console.error(error)
							if (error.message) {
								let data = {}
								data['error'] = error.message
								response = JSON.stringify(data)
								break
							}
							response = '{"error": "Request could not be fulfilled"}'
						} finally {
							this.loader.hide()
						}
					} else {
						response = '{"error": "User declined request"}'
					}
					// this.loader.show()
					// Params: data.groupId, data.destinationAddress, data.message
					// TODO: prompt user to send chat message. If they confirm, sign+process a CHAT transaction
					// then set the response string from the core to the `response` variable (defined above)
					// If they decline, send back JSON that includes an `error` key, such as `{"error": "User declined request"}`
					break
				}

				case actions.JOIN_GROUP: {
					const requiredFields = ['groupId']
					const missingFields = []
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
						break
					}
					const groupId = data.groupId
					let groupInfo = null
					try {
						groupInfo = await parentEpml.request("apiCall", {
							type: "api",
							url: `/groups/${groupId}`
						})
					} catch (error) {
						const errorMsg = (error && error.message) || 'Group not found'
						let obj = {}
						obj['error'] = errorMsg
						response = JSON.stringify(obj)
						break
					}
					if (!groupInfo || groupInfo.error) {
						const errorMsg = (groupInfo && groupInfo.message) || 'Group not found'
						let obj = {}
						obj['error'] = errorMsg
						response = JSON.stringify(obj)
						break
					}
					try {
						this.loader.show()
						const resJoinGroup = await this._joinGroup(groupId, groupInfo.groupName)
						response = JSON.stringify(resJoinGroup)
					} catch (error) {
						const obj = {}
						obj['error'] = error.message || 'Failed to join the group.'
						response = JSON.stringify(obj)
					} finally {
						this.loader.hide()
					}
					// Params: data.groupId
					// TODO: prompt user to join group. If they confirm, sign+process a JOIN_GROUP transaction
					// then set the response string from the core to the `response` variable (defined above)
					// If they decline, send back JSON that includes an `error` key, such as `{"error": "User declined request"}`
					break
				}

				case actions.SAVE_FILE: {
					try {
						const requiredFields = ['filename', 'blob']
						const missingFields = []
						requiredFields.forEach((field) => {
							if (!data[field]) {
								missingFields.push(field)
							}
						})
						if (missingFields.length > 0) {
							const missingFieldsString = missingFields.join(', ')
							const errorMsg = `Missing fields: ${missingFieldsString}`
							let data = {}
							data['error'] = errorMsg
							response = JSON.stringify(data)
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
						const obj = {}
						obj['error'] = error.message || 'Failed to initiate download'
						response = JSON.stringify(obj)
					}
					break
				}

				case actions.DEPLOY_AT: {
					const requiredFields = ['name', 'description', 'tags', 'creationBytes', 'amount', 'assetId', 'type']
					const missingFields = []
					requiredFields.forEach((field) => {
						if (!data[field] && data[field] !== 0) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
						break
					}
					try {
						this.loader.show()
						const resDeployAt = await this._deployAt(data.name, data.description, data.tags, data.creationBytes, data.amount, data.assetId, data.type)
						response = JSON.stringify(resDeployAt)
					} catch (error) {
						const obj = {}
						obj['error'] = error.message || 'Failed to join the group.'
						response = JSON.stringify(obj)
					} finally {
						this.loader.hide()
					}
					break
				}

				case actions.GET_PROFILE_DATA: {
					const defaultProperties = ['tagline', 'bio', 'wallets']
					const requiredFields = ['property']
					const missingFields = []
					requiredFields.forEach((field) => {
						if (!data[field] && data[field] !== 0) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
						break
					}
					try {
						const profileData = window.parent.reduxStore.getState().app.profileData
						if (!profileData) {
							throw new Error('User does not have a profile')
						}
						const property = data.property
						const propertyIndex = defaultProperties.indexOf(property)
						if (propertyIndex !== -1) {
							const requestedData = profileData[property]
							if (requestedData) {
								response = JSON.stringify(requestedData)
								break
							} else {
								throw new Error('Cannot find requested data')
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
									throw new Error('Cannot find requested data')
								}
							} else {
								throw new Error('User denied permission for private property')
							}
						} else {
							const requestedData = profileData.customData[property]
							if (requestedData) {
								response = JSON.stringify(requestedData)
								break
							} else {
								throw new Error('Cannot find requested data')
							}
						}
					} catch (error) {
						const obj = {}
						obj['error'] = error.message || 'Failed to join the group.'
						response = JSON.stringify(obj)
					} finally {
						this.loader.hide()
					}
					break
				}

				case actions.SET_PROFILE_DATA: {
					const requiredFields = ['property', 'data']
					const missingFields = []
					requiredFields.forEach((field) => {
						if (!data[field] && data[field] !== 0) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
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
						if (resSetPrivateProperty.action !== 'accept') throw new Error('User declined permission')
						//dispatch event and wait until I get a response to continue
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
						if (!res.response) throw new Error('Failed to set property')
						response = JSON.stringify(res.response)
					} catch (error) {
						const obj = {}
						obj['error'] = error.message || 'Failed to set property.'
						response = JSON.stringify(obj)
					} finally {
						this.loader.hide()
					}
					break
				}

				case actions.OPEN_PROFILE: {
					const requiredFields = ['name']
					const missingFields = []
					requiredFields.forEach((field) => {
						if (!data[field] && data[field] !== 0) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
						break
					}
					try {
						const customEvent = new CustomEvent('open-visiting-profile', {
							detail: data.name
						})
						window.parent.dispatchEvent(customEvent)
						response = JSON.stringify(true)
					} catch (error) {
						const obj = {}
						obj['error'] = error.message || 'Failed to open profile'
						response = JSON.stringify(obj)
					}
					break
				}

				case actions.GET_USER_WALLET: {
					const requiredFields = ['coin']
					const missingFields = []
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
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
								userWallet['publickey'] = window.parent.reduxStore.getState().app.selectedAddress.base58PublicKey
								break
							case 'BTC':
								userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.btcWallet.address
								userWallet['publickey'] = window.parent.reduxStore.getState().app.selectedAddress.btcWallet.derivedMasterPublicKey
								break
							case 'LTC':
								userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet.address
								userWallet['publickey'] = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet.derivedMasterPublicKey
								break
							case 'DOGE':
								userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet.address
								userWallet['publickey'] = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet.derivedMasterPublicKey
								break
							case 'DGB':
								userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.dgbWallet.address
								userWallet['publickey'] = window.parent.reduxStore.getState().app.selectedAddress.dgbWallet.derivedMasterPublicKey
								break
							case 'RVN':
								userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.rvnWallet.address
								userWallet['publickey'] = window.parent.reduxStore.getState().app.selectedAddress.rvnWallet.derivedMasterPublicKey
								break
							case 'ARRR':
								userWallet['address'] = arrrAddress
								break
							default:
								break
						}
						response = JSON.stringify(userWallet)
						break
					} else if (res3.action === 'reject') {
						response = '{"error": "User declined request"}'
					}
					break
				}

				case actions.GET_WALLET_BALANCE: {
					const requiredFields = ['coin']
					const missingFields = []
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
						break
					}
					// Params: data.coin (QORT / BTC / LTC / DOGE / DGB / RVN / ARRR)
					// TODO: prompt user to share wallet balance. If they confirm, call `GET /crosschain/:coin/walletbalance`, or for QORT, call `GET /addresses/balance/:address`
					// then set the response string from the core to the `response` variable (defined above)
					// If they decline, send back JSON that includes an `error` key, such as `{"error": "User declined request"}`
					const res3 = await showModalAndWait(
						actions.GET_WALLET_BALANCE
					)
					if (res3.action === 'accept') {
						let coin = data.coin
						if (coin === "QORT") {
							let qortAddress = window.parent.reduxStore.getState().app.selectedAddress.address
							try {
								this.loader.show()
								response = await parentEpml.request('apiCall', {
									url: `/addresses/balance/${qortAddress}?apiKey=${this.getApiKey()}`
								})


							} catch (error) {
								console.error(error)
								const data = {}
								data['error'] = error.message || get("browserpage.bchange21")
								response = JSON.stringify(data)

							} finally {
								this.loader.hide()
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
								this.loader.show()
								const res = await parentEpml.request('apiCall', {
									url: _url,
									method: 'POST',
									body: _body
								})
								if (isNaN(Number(res))) {
									const data = {}
									data['error'] = get("browserpage.bchange21")
									response = JSON.stringify(data)
									return
								} else {
									response = (Number(res) / 1e8).toFixed(8)
								}
							} catch (error) {
								console.error(error)
								const data = {}
								data['error'] = error.message || get("browserpage.bchange21")
								response = JSON.stringify(data)
								return
							} finally {
								this.loader.hide()
							}
						}
					} else if (res3.action === 'reject') {
						response = '{"error": "User declined request"}'
					}
					break
				}

				case actions.GET_USER_WALLET_INFO: {
					const requiredFields = ['coin']
					const missingFields = []
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
						break
					}
					const userWallet = await showModalAndWait(
						actions.GET_USER_WALLET
					)
					if (userWallet.action === 'accept') {
						let coin = data.coin
						let walletKeys = this.getUserWallet(coin)
						let _url = `/crosschain/` + data.coin.toLowerCase() + `/addressinfos?apiKey=${this.getApiKey()}`
						let _body = { xpub58: walletKeys['publickey'] }
						try {
							this.loader.show()
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
							console.error(error)
							const data = {}
							data['error'] = error.message || get("browserpage.bchange21")
							response = JSON.stringify(data)
							return
						} finally {
							this.loader.hide()
						}
					} else if (userWallet.action === 'reject') {
						response = '{"error": "User declined request"}'
					}
					break
				}
				case actions.GET_CROSSCHAIN_SERVER_INFO: {
					const requiredFields = ['coin']
					const missingFields = []
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
						break
					}
					let _url = `/crosschain/` + data.coin.toLowerCase() + `/serverinfos`
					try {
						this.loader.show()
						const res = await parentEpml.request('apiCall', {
							url: _url,
							method: 'GET',
							headers: {
								'Accept': '*/*'
							}
						})
						response = JSON.stringify(res.servers)
					} catch (error) {
						console.error(error)
						const data = {}
						data['error'] = error.message || 'Error in retrieving server info'
						response = JSON.stringify(data)
						return
					} finally {
						this.loader.hide()
					}
					break
				}

				case actions.GET_TX_ACTIVITY_SUMMARY: {
					const requiredFields = ['coin']
					const missingFields = []
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
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
					} catch (error) {
						const data = {}
						data['error'] = "Error in tx activity summary"
						response = JSON.stringify(data)
					} finally {
						break
					}
				}

				case actions.GET_FOREIGN_FEE: {
					const requiredFields = ['coin','type']
					const missingFields = []

          			requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})

          			if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
						break
					}

					try {
						let coin = data.coin;
						let type = data.type;
						response = await parentEpml.request('apiCall', {
							type: 'api',
							method: 'GET',
							url: `/crosschain/${coin}/${type}?apiKey=${this.getApiKey()}`,
							headers: {
								'Accept': '*/*',
								'Content-Type': 'application/json'
							},
						})
					} catch (error) {
						const data = {}
						data['error'] = "Error in get foreign fee"
						response = JSON.stringify(data)
					} finally {
						break
					}
				}

				case actions.UPDATE_FOREIGN_FEE: {
					const requiredFields = ['coin','type']
					const missingFields = []

					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})

					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
						break
					}

					try {
						let coin = data.coin;
						let type = data.type;
						let value = data.value;
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
					} catch (error) {
						const data = {}
						data['error'] = "Error in update foreign fee"
						response = JSON.stringify(data)
					} finally {
						break
					}
				}

				case actions.GET_SERVER_CONNECTION_HISTORY: {
					const requiredFields = ['coin']
					const missingFields = []

					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})

					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
						break
					}

					try {
						let coin = data.coin.toLowerCase();

						response = await parentEpml.request('apiCall', {
							type: 'api',
							method: 'GET',
							url: `/crosschain/${coin}/serverconnectionhistory`,
							headers: {
								'Accept': '*/*',
								'Content-Type': 'application/json'
							},
						})
					} catch (error) {
						const data = {}
						data['error'] = "Error in get server connection history"
						response = JSON.stringify(data)
					} finally {
						break
					}
				}

				case actions.SET_CURRENT_FOREIGN_SERVER: {
					const requiredFields = ['coin']
					const missingFields = []

					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})

					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
						break
					}

					try {
						let coin = data.coin;
						let host = data.host;
						let port = data.port;
						let type = data.type;

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
					} catch (error) {
						const data = {}
						data['error'] = "Error in set current server"
						response = JSON.stringify(data)
					} finally {
						break
					}
				}

				case actions.ADD_FOREIGN_SERVER: {
					const requiredFields = ['coin']
					const missingFields = []

					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})

					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
						break
					}

					try {
						let coin = data.coin;
						let host = data.host;
						let port = data.port;
						let type = data.type;

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
					} catch (error) {
						const data = {}
						data['error'] = "Error in add server"
						response = JSON.stringify(data)
					} finally {
						break
					}
				}

				case actions.REMOVE_FOREIGN_SERVER: {
					const requiredFields = ['coin']
					const missingFields = []

					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})

					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
						break
					}

					try {
						let coin = data.coin;
						let host = data.host;
						let port = data.port;
						let type = data.type;

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
					} catch (error) {
						const data = {}
						data['error'] = "Error in remove server"
						response = JSON.stringify(data)
					} finally {
						break
					}
				}

				case actions.GET_DAY_SUMMARY: {
					try {
						response = await parentEpml.request('apiCall', {
							type: 'api',
							url: `/admin/summary?apiKey=${this.getApiKey()}`
						})
					} catch (error) {
						const data = {}
						data['error'] = "Error in retrieving summary"
						response = JSON.stringify(data)
					} finally {
						break
					}
				}

				case actions.SEND_COIN: {
					const requiredFields = ['coin', 'destinationAddress', 'amount']
					const missingFields = []
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						await showErrorAndWait("MISSING_FIELDS", errorMsg)
						let data = {}
						data['error'] = errorMsg
						response = JSON.stringify(data)
						break
					}
					let checkCoin = data.coin
					if (checkCoin === "QORT") {
						// Params: data.coin, data.destinationAddress, data.amount, data.fee
						// TODO: prompt user to send. If they confirm, call `POST /crosschain/:coin/send`, or for QORT, broadcast a PAYMENT transaction
						// then set the response string from the core to the `response` variable (defined above)
						// If they decline, send back JSON that includes an `error` key, such as `{"error": "User declined request"}`
						const amount = Number(data.amount)
						const recipient = data.destinationAddress
						const coin = data.coin
						const walletBalance = await parentEpml.request('apiCall', {
							url: `/addresses/balance/${this.myAddress.address}`
						})
						if (isNaN(Number(walletBalance))) {
							let errorMsg = "Failed to Fetch QORT Balance. Try again!"
							let failedMsg = get("walletpage.wchange33") + " QORT " + get("general.balance")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("FAILED_FETCH", failedMsg, pleaseMsg)
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
							let errorMsg = "Insufficient Funds!"
							let failedMsg = get("walletpage.wchange26")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("INSUFFICIENT_FUNDS", failedMsg, pleaseMsg)
							let obj = {}
							obj['error'] = errorMsg
							response = JSON.stringify(obj)
							break
						}
						if (amount <= 0) {
							let errorMsg = "Invalid Amount!"
							await showErrorAndWait("INVALID_AMOUNT", errorMsg)
							let obj = {}
							obj['error'] = errorMsg
							response = JSON.stringify(obj)
							break
						}
						if (recipient.length === 0) {
							let errorMsg = "Receiver cannot be empty!"
							await showErrorAndWait("NO_RECEIVER", errorMsg)
							let obj = {}
							obj['error'] = errorMsg
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
							let errorMsg = "User declined request"
							let myMsg1 = get("transactions.declined")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("DECLINED_REQUEST", myMsg1, myMsg2)
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
									await showErrorAndWait("INVALID_RECEIVER", errorMsg, pleaseMsg)
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
								throw new Error(txnResponse.message)
							} else if (txnResponse.success === true && !txnResponse.data.error) {
								this.loader.hide()
								return txnResponse.data
							} else {
								this.loader.hide()
								throw new Error('Error: could not send coin')
							}
						}
						try {
							response = await validateReceiver(recipient)
						} catch (error) {
							console.error(error)
							response = '{"error": "Request could not be fulfilled"}'
						} finally {
							this.loader.hide()
						}
						break
					} else if (checkCoin === "BTC") {
						this.loader.show()
						const amount = Number(data.amount)
						const recipient = data.destinationAddress
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
							let errorMsg = "Failed to Fetch BTC Balance. Try again!"
							let failedMsg = get("walletpage.wchange33") + " BTC " + get("general.balance")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("FAILED_FETCH", failedMsg, pleaseMsg)
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
							let errorMsg = "Insufficient Funds!"
							let failedMsg = get("walletpage.wchange26")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("INSUFFICIENT_FUNDS", failedMsg, pleaseMsg)
							let obj = {}
							obj['error'] = errorMsg
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
							let errorMsg = "User declined request"
							let myMsg1 = get("transactions.declined")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("DECLINED_REQUEST", myMsg1, myMsg2)
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
								showErrorAndWait("TRANSACTION_SUCCESS", successMsg, patientMsg)
							} else if (response === false) {
								this.loader.hide()
								let errorMsg = get("walletpage.wchange31")
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("TRANSACTION_FAILED", errorMsg, pleaseMsg)
								throw new Error(response)
							} else {
								this.loader.hide()
								let errorMsg = response.message
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("TRANSACTION_FAILED", errorMsg, pleaseMsg)
								throw new Error(response)
							}
						}
						try {
							const res = await makeRequest()
							manageResponse(res)
							response = res
						} catch (error) {
							console.error(error)
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
							let errorMsg = "Failed to Fetch LTC Balance. Try again!"
							let failedMsg = get("walletpage.wchange33") + " LTC " + get("general.balance")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("FAILED_FETCH", failedMsg, pleaseMsg)
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
							let errorMsg = "Insufficient Funds!"
							let failedMsg = get("walletpage.wchange26")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("INSUFFICIENT_FUNDS", failedMsg, pleaseMsg)
							let obj = {}
							obj['error'] = errorMsg
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
							let errorMsg = "User declined request"
							let myMsg1 = get("transactions.declined")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("DECLINED_REQUEST", myMsg1, myMsg2)
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
								showErrorAndWait("TRANSACTION_SUCCESS", successMsg, patientMsg)
							} else if (response === false) {
								this.loader.hide()
								let errorMsg = get("walletpage.wchange31")
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("TRANSACTION_FAILED", errorMsg, pleaseMsg)
								throw new Error(response)
							} else {
								this.loader.hide()
								let errorMsg = response.message
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("TRANSACTION_FAILED", errorMsg, pleaseMsg)
								throw new Error(response)
							}
						}
						try {
							const res = await makeRequest()
							manageResponse(res)
							response = res
						} catch (error) {
							console.error(error)
							response = '{"error": "Request could not be fulfilled"}'
						} finally {
							this.loader.hide()
						}
						break
					} else if (checkCoin === "DOGE") {
						this.loader.show()
						const amount = Number(data.amount)
						const recipient = data.destinationAddress
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
							let errorMsg = "Failed to Fetch DOGE Balance. Try again!"
							let failedMsg = get("walletpage.wchange33") + " DOGE " + get("general.balance")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("FAILED_FETCH", failedMsg, pleaseMsg)
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
							let errorMsg = "Insufficient Funds!"
							let failedMsg = get("walletpage.wchange26")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("INSUFFICIENT_FUNDS", failedMsg, pleaseMsg)
							let obj = {}
							obj['error'] = errorMsg
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
							let errorMsg = "User declined request"
							let myMsg1 = get("transactions.declined")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("DECLINED_REQUEST", myMsg1, myMsg2)
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
								showErrorAndWait("TRANSACTION_SUCCESS", successMsg, patientMsg)
							} else if (response === false) {
								this.loader.hide()
								let errorMsg = get("walletpage.wchange31")
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("TRANSACTION_FAILED", errorMsg, pleaseMsg)
								throw new Error(response)
							} else {
								this.loader.hide()
								let errorMsg = response.message
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("TRANSACTION_FAILED", errorMsg, pleaseMsg)
								throw new Error(response)
							}
						}
						try {
							const res = await makeRequest()
							manageResponse(res)
							response = res
						} catch (error) {
							console.error(error)
							response = '{"error": "Request could not be fulfilled"}'
						} finally {
							this.loader.hide()
						}
						break
					} else if (checkCoin === "DGB") {
						this.loader.show()
						const amount = Number(data.amount)
						const recipient = data.destinationAddress
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
							let errorMsg = "Failed to Fetch DGB Balance. Try again!"
							let failedMsg = get("walletpage.wchange33") + " DGB " + get("general.balance")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("FAILED_FETCH", failedMsg, pleaseMsg)
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
							let errorMsg = "Insufficient Funds!"
							let failedMsg = get("walletpage.wchange26")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("INSUFFICIENT_FUNDS", failedMsg, pleaseMsg)
							let obj = {}
							obj['error'] = errorMsg
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
							let errorMsg = "User declined request"
							let myMsg1 = get("transactions.declined")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("DECLINED_REQUEST", myMsg1, myMsg2)
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
								showErrorAndWait("TRANSACTION_SUCCESS", successMsg, patientMsg)
							} else if (response === false) {
								this.loader.hide()
								let errorMsg = get("walletpage.wchange31")
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("TRANSACTION_FAILED", errorMsg, pleaseMsg)
								throw new Error(response)
							} else {
								this.loader.hide()
								let errorMsg = response.message
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("TRANSACTION_FAILED", errorMsg, pleaseMsg)
								throw new Error(response)
							}
						}
						try {
							const res = await makeRequest()
							manageResponse(res)
							response = res
						} catch (error) {
							console.error(error)
							response = '{"error": "Request could not be fulfilled"}'
						} finally {
							this.loader.hide()
						}
						break
					} else if (checkCoin === "RVN") {
						this.loader.show()
						const amount = Number(data.amount)
						const recipient = data.destinationAddress
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
							let errorMsg = "Failed to Fetch RVN Balance. Try again!"
							let failedMsg = get("walletpage.wchange33") + " RVN " + get("general.balance")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("FAILED_FETCH", failedMsg, pleaseMsg)
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
							let errorMsg = "Insufficient Funds!"
							let failedMsg = get("walletpage.wchange26")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("INSUFFICIENT_FUNDS", failedMsg, pleaseMsg)
							let obj = {}
							obj['error'] = errorMsg
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
							let errorMsg = "User declined request"
							let myMsg1 = get("transactions.declined")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("DECLINED_REQUEST", myMsg1, myMsg2)
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
								showErrorAndWait("TRANSACTION_SUCCESS", successMsg, patientMsg)
							} else if (response === false) {
								this.loader.hide()
								let errorMsg = get("walletpage.wchange31")
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("TRANSACTION_FAILED", errorMsg, pleaseMsg)
								throw new Error(response)
							} else {
								this.loader.hide()
								let errorMsg = response.message
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("TRANSACTION_FAILED", errorMsg, pleaseMsg)
								throw new Error(response)
							}
						}
						try {
							const res = await makeRequest()
							manageResponse(res)
							response = res
						} catch (error) {
							console.error(error)
							response = '{"error": "Request could not be fulfilled"}'
						} finally {
							this.loader.hide()
						}
						break
					} else if (checkCoin === "ARRR") {
						this.loader.show()
						const amount = Number(data.amount)
						const recipient = data.destinationAddress
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
							let errorMsg = "Failed to Fetch ARRR Balance. Try again!"
							let failedMsg = get("walletpage.wchange33") + " ARRR " + get("general.balance")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("FAILED_FETCH", failedMsg, pleaseMsg)
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
							let errorMsg = "Insufficient Funds!"
							let failedMsg = get("walletpage.wchange26")
							let pleaseMsg = get("walletpage.wchange44")
							await showErrorAndWait("INSUFFICIENT_FUNDS", failedMsg, pleaseMsg)
							let obj = {}
							obj['error'] = errorMsg
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
							let errorMsg = "User declined request"
							let myMsg1 = get("transactions.declined")
							let myMsg2 = get("walletpage.wchange44")
							await showErrorAndWait("DECLINED_REQUEST", myMsg1, myMsg2)
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
								showErrorAndWait("TRANSACTION_SUCCESS", successMsg, patientMsg)
							} else if (response === false) {
								this.loader.hide()
								let errorMsg = get("walletpage.wchange31")
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("TRANSACTION_FAILED", errorMsg, pleaseMsg)
								throw new Error(response)
							} else {
								this.loader.hide()
								let errorMsg = response.message
								let pleaseMsg = get("walletpage.wchange44")
								showErrorAndWait("TRANSACTION_FAILED", errorMsg, pleaseMsg)
								throw new Error(response)
							}
						}
						try {
							const res = await makeRequest()
							manageResponse(res)
							response = res
							break
						} catch (error) {
							console.error(error)
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
					return
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
		if (window.innerHeight == screen.height) {
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
				userWallet['publickey'] = window.parent.reduxStore.getState().app.selectedAddress.base58PublicKey
				break
			case 'BTC':
				userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.btcWallet.address
				userWallet['publickey'] = window.parent.reduxStore.getState().app.selectedAddress.btcWallet.derivedMasterPublicKey
				break
			case 'LTC':
				userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet.address
				userWallet['publickey'] = window.parent.reduxStore.getState().app.selectedAddress.ltcWallet.derivedMasterPublicKey
				break
			case 'DOGE':
				userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet.address
				userWallet['publickey'] = window.parent.reduxStore.getState().app.selectedAddress.dogeWallet.derivedMasterPublicKey
				break
			case 'DGB':
				userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.dgbWallet.address
				userWallet['publickey'] = window.parent.reduxStore.getState().app.selectedAddress.dgbWallet.derivedMasterPublicKey
				break
			case 'RVN':
				userWallet['address'] = window.parent.reduxStore.getState().app.selectedAddress.rvnWallet.address
				userWallet['publickey'] = window.parent.reduxStore.getState().app.selectedAddress.rvnWallet.derivedMasterPublicKey
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
		if (this.service == "APP") {
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
				(item) => item != name
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
				(item) => item != name
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
				(item) => item != name
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
			this.blockedNames = this.blockedNames.filter((item) => item != name)
		} else {
			let err4string = get('browserpage.bchange14')
			parentEpml.request('showSnackBar', `${err4string}`)
		}
		return ret
	}

	async deleteCurrentResource() {
		if (this.followedNames.indexOf(this.name) != -1) {
			// Following name - so deleting won't work
			let err5string = get('browserpage.bchange15')
			parentEpml.request('showSnackBar', `${err5string}`)
			return
		}
		let identifier = (this.identifier == null || this.identifier.length == 0) ? 'default' : this.identifier
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
									<p style="font-size: 16px;overflow-wrap: anywhere;" class="modal-paragraph">${get('browserpage.bchange47')} <span style="font-weight: bold">${data.resources.length * data.feeAmount} QORT fee</span></p>
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
								<p style="font-size: 16px;overflow-wrap: anywhere;" class="modal-paragraph">${get('browserpage.bchange47')} <span style="font-weight: bold">${data.feeAmount} QORT fee</span></p>
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
								<p style="font-size: 16px;overflow-wrap: anywhere;" class="modal-paragraph">${get('browserpage.bchange47')} <span style="font-weight: bold">${data.fee} QORT fee</span></p>
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

async function showErrorAndWait(type, data, data1) {
	// Create the modal and add it to the DOM
	const modalDelay = ms => new Promise(res => setTimeout(res, ms))
	const error = document.createElement('div')
	error.id = "backdrop"
	error.classList.add("backdrop")
	error.innerHTML = `
		<div class="modal my-modal-class">
			<div class="modal-content">
				<div class="modal-body">
					${type === "MISSING_FIELDS" ? `
						<div class="modal-subcontainer-error">
							<p class="modal-paragraph-error">${data}</p>
							<p class="modal-paragraph-error">${data1}<</p>
						</div>
					` : ''}

					${type === "FAILED_FETCH" ? `
						<div class="modal-subcontainer-error">
							<p class="modal-paragraph-error">${data}</p>
							<p class="modal-paragraph-error">${data1}</p>
						</div>
					` : ''}

					${type === "INSUFFICIENT_FUNDS" ? `
						<div class="modal-subcontainer-error">
							<p class="modal-paragraph-error">${data}</p>
							<p class="modal-paragraph-error">${data1}</p>
						</div>
					` : ''}

					${type === "INVALID_AMOUNT" ? `
						<div class="modal-subcontainer-error">
							<p class="modal-paragraph-error">${data}</p>
							<p class="modal-paragraph-error">${data1}</p>
						</div>
					` : ''}

					${type === "NO_RECEIVER" ? `
						<div class="modal-subcontainer-error">
							<p class="modal-paragraph-error">${data}</p>
							<p class="modal-paragraph-error">${data1}</p>
						</div>
					` : ''}

					${type === "INVALID_RECEIVER" ? `
						<div class="modal-subcontainer-error">
							<p class="modal-paragraph-error">${data}</p>
							<p class="modal-paragraph-error">${data1}</p>
						</div>
					` : ''}

					${type === "DECLINED_REQUEST" ? `
						<div class="modal-subcontainer-error">
							<p class="modal-paragraph-error">${data}</p>
							<p class="modal-paragraph-error">${data1}</p>
						</div>
					` : ''}

					${type === "TRANSACTION_FAILED" ? `
						<div class="modal-subcontainer-error">
							<p class="modal-paragraph-error">${data}</p>
							<p class="modal-paragraph-error">${data1}</p>
						</div>
					` : ''}

					${type === "TRANSACTION_SUCCESS" ? `
						<div class="modal-subcontainer-error">
							<p class="modal-paragraph-error">${data}</p>
							<p class="modal-paragraph-error">${data1}</p>
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

// Add the styles for the modal
const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(webBrowserModalStyles)
document.adoptedStyleSheets = [styleSheet]
