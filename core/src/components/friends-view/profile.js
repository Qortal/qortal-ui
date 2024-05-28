import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store'
import { parentEpml } from '../show-plugin'
import { publishData, modalHelper } from '../../../../plugins/plugins/utils/classes'
import { setNewTab, setProfileData, setSideEffectAction } from '../../redux/app/app-actions'
import {
	decryptGroupData,
	encryptDataGroup,
	objectToBase64,
	uint8ArrayToObject
} from '../../../../plugins/plugins/core/components/qdn-action-encryption'
import { get, translate } from '../../../translate'
import { profileQdnStyles } from '../../styles/core-css'
import ShortUniqueId from 'short-unique-id'
import WebWorker2 from '../WebWorkerFile.js'
import './avatar'
import './friends-side-panel'
import './profile-modal-update'
import '../notification-view/popover'
import '@material/mwc-icon'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/tooltip'

class ProfileQdn extends connect(store)(LitElement) {
	static get properties() {
		return {
			isOpen: { type: Boolean },
			syncPercentage: { type: Number },
			settingsRawData: { type: Object },
			valuesToBeSavedOnQdn: { type: Object },
			resourceExists: { type: Boolean },
			isSaving: { type: Boolean },
			fee: { type: Object },
			name: { type: String },
			isOpenProfileModalUpdate: { type: Boolean },
			editContent: { type: Object },
			profileData: { type: Object },
			imageUrl: { type: String },
			dialogOpenedProfile: { type: Boolean },
			profileDataVisiting: { type: Object },
			nameVisiting: { type: String },
			hasName: { type: Boolean },
			resourceExistsVisiting: { type: Boolean },
			error: { type: String },
			isFriend: { type: Boolean }
		}
	}

	static get styles() {
		return [profileQdnStyles]
	}

	constructor() {
		super()
		this.isOpen = false
		this.getProfile = this.getProfile.bind(this)
		this._handleQortalRequestSetData = this._handleQortalRequestSetData.bind(this)
		this._handleOpenVisiting = this._handleOpenVisiting.bind(this)
		this.setValues = this.setValues.bind(this)
		this.saveToQdn = this.saveToQdn.bind(this)
		this.syncPercentage = 0
		this.hasRetrievedResource = false
		this.hasAttemptedToFetchResource = false
		this.resourceExists = undefined
		this.settingsRawData = null
		this.nodeUrl = this.getNodeUrl()
		this.myNode = this.getMyNode()
		this.valuesToBeSavedOnQdn = {}
		this.isSaving = false
		this.fee = null
		this.name = undefined
		this.uid = new ShortUniqueId()
		this.isOpenProfileModalUpdate = false
		this.editContent = null
		this.profileData = null
		this.qortalRequestCustomData = null
		this.imageUrl = ''
		this.dialogOpenedProfile = false
		this.profileDataVisiting = null
		this.nameVisiting = ''
		this.hasName = false
		this.resourceExistsVisiting = undefined
		this.error = ''
		this.getUserAddress = this.getUserAddress.bind(this)
		this.checkIfInFriendsList = this.checkIfInFriendsList.bind(this)
		this.isFriend = undefined
	}

	render() {
		return html`
			${this.isSaving || (!this.error && this.resourceExists === undefined) ?
				html`
					<paper-spinner-lite active style="display: block; margin: 0 auto;"></paper-spinner-lite>
				`
				: !this.name ? html`
					<mwc-icon
						id="profile-icon"
						class=${'notActive'}
						@click=${() => {
							const target = this.shadowRoot.getElementById('popover-notification');
							const popover = this.shadowRoot.querySelector('popover-component');
							if (popover) {
								popover.openPopover(target);
							}
						}}
						style="user-select:none;cursor:pointer"
					>
						account_circle
					</mwc-icon>
					<vaadin-tooltip
						for="profile-icon"
						position="bottom"
						hover-delay=${300}
						hide-delay=${1}
						text=${translate('profile.profile20')}
					></vaadin-tooltip>
					<popover-component for="profile-icon" message="">
						<div style="margin-bottom:20px">
							<p style="margin:10px 0px; font-size:16px">
								${translate('profile.profile1')}
							</p>
						</div>
						<div style="display:flex;justify-content:center;gap:10px">
							<div
								class="accept-button"
								@click="${() => {
									store.dispatch(
										setNewTab({
											url: `group-management`,
											id: this.uid.rnd(),
											myPlugObj: {
												url: 'name-registration',
												domain: 'core',
												page: 'name-registration/index.html',
												title: 'Name Registration',
												icon: 'vaadin:user-check',
												mwcicon: 'manage_accounts',
												pluginNumber: 'plugin-qCmtXAQmtu',
												menus: [],
												parent: false
											},
											openExisting: true
										})
									);
									const popover = this.shadowRoot.querySelector('popover-component');
									if (popover) {
										popover.closePopover();
									}
								}}"
							>
								${translate('profile.profile2')}
							</div>
						</div>
					</popover-component>
				`
				: this.error ? html`
					<div style="user-select:none;cursor:pointer;opacity:0.5" id="profile-error">
						<avatar-component
							.resource=${{
								name: this.name,
								service: 'THUMBNAIL',
								identifier: 'qortal_avatar'
							}}
							name=${this.name}
						></avatar-component>
					</div>
					<vaadin-tooltip
						for="profile-error"
						position="bottom"
						hover-delay=${200}
						hide-delay=${1}
						text=${translate('profile.profile19')}
					></vaadin-tooltip>
				`
				: html`
					<div
						style="user-select:none;cursor:pointer"
						@click=${() => {
							if (this.resourceExists && this.profileData) {
								this.editContent = this.profileData;
							} else if (this.resourceExists && !this.profileData) {
								return;
							}
							if (this.profileData) {
								this.profileDataVisiting = this.profileData;
								this.nameVisiting = this.name;
								this.dialogOpenedProfile = true;
							} else {
								this.isOpenProfileModalUpdate = !this.isOpenProfileModalUpdate;
							}
						}}
					>
						<avatar-component
							.resource=${{
								name: this.name,
								service: 'THUMBNAIL',
								identifier: 'qortal_avatar'
							}}
							name=${this.name}
						></avatar-component>
					</div>
				`
			}
			<profile-modal-update
				?isOpen=${this.isOpenProfileModalUpdate}
				.setIsOpen=${(val) => {
					this.isOpenProfileModalUpdate = val;
				}}
				.onSubmit=${this.saveToQdn}
				.editContent=${this.editContent}
				.onClose=${(val) => this.onClose(val)}
				.qortalRequestCustomData=${this.qortalRequestCustomData}
			></profile-modal-update>
			<!-- Profile read-view -->
			${this.dialogOpenedProfile ?
				html`
					<paper-dialog class="full-info-wrapper" ?opened="${this.dialogOpenedProfile}">
						<div class="full-info-logo">
							${this.avatarFullImage()}
						</div>
						<h3>${this.nameVisiting}</h3>
						<div style="display:flex;gap:15px;justify-content:center;margin-top:10px">
							${this.nameVisiting !== this.name ?
								html`
									<div
										class="send-message-button"
										@click="${async () => {
											const address = await this.getUserAddress();
											if (!address) return;
											store.dispatch(
												setNewTab({
													url: `q-chat`,
													id: this.uid.rnd(),
													myPlugObj: {
														url: 'q-chat',
														domain: 'core',
														page: 'q-chat/index.html',
														title: 'Q-Chat',
														icon: 'vaadin:chat',
														mwcicon: 'forum',
														pluginNumber: 'plugin-qhsyOnpRhT',
														menus: [],
														parent: false
													},
													openExisting: true
												})
											);
											store.dispatch(
												setSideEffectAction({
													type: 'openPrivateChat',
													data: {
														address,
														name: this.nameVisiting
													}
												})
											);
											this.dialogOpenedProfile = false;
										}}"
									>
										<mwc-icon id="send-chat-icon" style="color: var(--black)">send</mwc-icon>
										<vaadin-tooltip
											for="send-chat-icon"
											position="bottom"
											hover-delay=${200}
											hide-delay=${1}
											text=${translate('friends.friend8')}
										></vaadin-tooltip>
									</div>
								`
								: ''
							}
							${this.nameVisiting !== this.name ?
								html`
									<div
										class="send-message-button"
										@click="${() => {
											const query = `?service=APP&name=Q-Mail/to/${this.nameVisiting}`;
											store.dispatch(
												setNewTab({
													url: `qdn/browser/index.html${query}`,
													id: this.uid.rnd(),
													myPlugObj: {
														url: 'myapp',
														domain: 'core',
														page: `qdn/browser/index.html${query}`,
														title: 'Q-Mail',
														icon: 'vaadin:mailbox',
														mwcicon: 'mail_outline',
														menus: [],
														parent: false
													},
													openExisting: true
												})
											);
											this.dialogOpenedProfile = false;
										}}"
									>
										<mwc-icon id="send-mail-icon" style="color: var(--black)">mail</mwc-icon>
										<vaadin-tooltip
											for="send-mail-icon"
											position="bottom"
											hover-delay=${200}
											hide-delay=${1}
											text=${translate('friends.friend9')}
										></vaadin-tooltip>
									</div>
								`
								: ''
							}
							${this.nameVisiting !== this.name && this.isFriend === false ?
								html`
									<div
										class="send-message-button"
										@click="${() => {
											this.dispatchEvent(new CustomEvent('add-friend', {bubbles: true, composed: true, detail: this.nameVisiting}));
											this.dialogOpenedProfile = false;
										}}"
									>
										<mwc-icon id="add-friend-icon" style="color: var(--black)">person_add</mwc-icon>
										<vaadin-tooltip
											for="add-friend-icon"
											position="bottom"
											hover-delay=${200}
											hide-delay=${1}
											text=${translate('profile.profile26')}
										></vaadin-tooltip>
									</div>
								`
								: ''
							}
							${this.nameVisiting !== this.name && this.isFriend === true ?
								html`
									<div
										class="send-message-button"
										@click="${() => {
											this.dispatchEvent(new CustomEvent('add-friend', {bubbles: true, composed: true, detail: this.nameVisiting}));
											this.dialogOpenedProfile = false;
										}}"
									>
										<mwc-icon id="add-friend-icon" style="color: green">person</mwc-icon>
										<vaadin-tooltip
											for="add-friend-icon"
											position="bottom"
											hover-delay=${200}
											hide-delay=${1}
											text=${translate('profile.profile25')}
										></vaadin-tooltip>
									</div>
								`
								: ''
							}
						</div>
						<div class="data-info">
							${this.isLoadingVisitingProfile ?
								html`
									<div style="width:100%;display:flex;justify-content:center">
										<paper-spinner-lite active style="display: block; margin: 0 auto;"></paper-spinner-lite>
									</div>
								`
								: this.resourceExistsVisiting === false ?
									html`
										<div style="width:100%;display:flex;justify-content:center">
											<p>${translate('profile.profile16')}</p>
										</div>
									`
								: this.profileDataVisiting === null ?
									html`
										<div style="width:100%;display:flex;justify-content:center">
											<p>${translate('profile.profile17')}</p>
										</div>
									`
								: html`
									<p style="font-weight:bold;color:#03a9f4;font-size:17px">
										${translate('profile.profile4')}
									</p>
									<p style="font-size:15px">
										${this.profileDataVisiting.tagline || translate('profile.profile15')}
									</p>
									<p style="font-weight:bold;color:#03a9f4;font-size:17px">
										${translate('profile.profile5')}
									</p>
									<p>
										${this.profileDataVisiting.bio || translate('profile.profile15')}
									</p>
									<p style="font-weight:bold;color:#03a9f4;font-size:17px">
										${translate('profile.profile6')}
									</p>
									${Object.keys(this.profileDataVisiting.wallets).map((key, i) => {
										return html`
											<p>
												<span style="font-weight:bold;text-transform: uppercase">${key}</span>:
												<span>${this.profileDataVisiting.wallets[key] || translate('profile.profile15')}</span>
											</p>
										`
									})}
								`
							}
						</div>
						<div>
							<span class="paybutton">
								<mwc-button class="green" @click=${() => this.openUserInfo()}>${translate('profile.profile14')}</mwc-button>
							</span>
							<span class="buttons">
								${this.nameVisiting === this.name ?
									html`
										<mwc-button @click=${() => this.openEdit()}>${translate('profile.profile3')}</mwc-button>
									` : ''
								}
								<mwc-button class="decline" @click=${() => {this.dialogOpenedProfile = false;}}>${translate('general.close')}</mwc-button>
							</span>
						</div>
					</paper-dialog>
				`: ''
			}
		`
	}

	firstUpdated() {
		// ...
	}

	getNodeUrl() {
		const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		return myNode.protocol + '://' + myNode.domain + ':' + myNode.port
	}

	getMyNode() {
		return store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
	}

	async getRawData(dataItem) {
		const url = `${this.nodeUrl}/arbitrary/${dataItem.service}/${dataItem.name}/${dataItem.identifier}`
		const res = await fetch(url)
		const data = await res.json()
		if (data.error) throw new Error('Cannot retrieve your data from qdn')
		return data
	}

	async getMyFollowedNames() {
		let myFollowedNames = []

		try {
			myFollowedNames = await parentEpml.request('apiCall', {
				url: `/lists/followedNames?apiKey=${this.myNode.apiKey}`
			})
		} catch (error) { }

		return myFollowedNames
	}

	async followNames(names) {
		let namesJsonString = JSON.stringify({ items: names })

		return await parentEpml.request('apiCall', {
			url: `/lists/followedNames?apiKey=${this.myNode.apiKey}`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: `${namesJsonString}`
		})
	}

	async setValues(response, resource) {
		if (response) {
			let data = { ...response }
			let customData = {}

			for (const key of Object.keys(data.customData || {})) {
				if (key.includes('-private')) {
					try {
						const decryptedData = decryptGroupData(data.customData[key])

						if (decryptedData && !decryptedData.error) {
							const decryptedDataToBase64 =
								uint8ArrayToObject(decryptedData)
							if (decryptedDataToBase64 && !decryptedDataToBase64.error) {
								customData[key] = decryptedDataToBase64
							}
						}
					} catch (error) {
						console.log({ error })
					}
				} else {
					customData[key] = data.customData[key]
				}
			}

			this.profileData = {
				...response,
				customData
			}

			store.dispatch(setProfileData(this.profileData))
		}
	}

	async getVisitingProfile(name) {
		try {
			this.isLoadingVisitingProfile = true
			this.nameVisiting = name
			this.checkIfInFriendsList(this.nameVisiting)
			const url = `${this.nodeUrl}/arbitrary/resources/search?service=DOCUMENT&identifier=qortal_profile&mode=ALL&name=${name}&prefix=true&exactmatchnames=true&excludeblocked=true&limit=20`
			const res = await fetch(url)
			let data = ''

			try {
				data = await res.json();
				if (Array.isArray(data)) {
					data = data.filter(
						(item) => item.identifier === 'qortal_profile'
					)

					if (data.length > 0) {
						this.resourceExistsVisiting = true
						const dataItem = data[0]

						try {
							const response = await this.getRawData(dataItem)

							if (response.wallets) {
								this.profileDataVisiting = response
							} else {
								// this.error = 'Cannot get saved user settings'
							}
						} catch (error) {
							console.log({ error })
						}
					} else {
						this.resourceExistsVisiting = false
					}
				} else {
					// this.error = 'Unable to perform query'
				}
			} catch (error) {
				console.log({ error })
				data = {
					error: 'No resource found'
				}
			}
		} catch (error) {
			console.log({ error })
		} finally {
			this.isLoadingVisitingProfile = false
		}
	}

	async getProfile() {
		try {
			this.error = ''
			this.fee = await this.getArbitraryFee()
			this.hasAttemptedToFetchResource = true
			let resource
			let nameObject

			try {
				nameObject = store.getState().app.accountInfo.names[0]
			} catch (error) { }

			if (!nameObject) {
				this.name = null
				this.error = 'no name'
				throw new Error('no name')
			}

			this.hasName = true
			const name = nameObject.name
			this.name = name
			const url = `${this.nodeUrl}/arbitrary/resources/search?service=DOCUMENT&mode=ALL&identifier=qortal_profile&name=${name}&prefix=true&exactmatchnames=true&excludeblocked=true&limit=20`
			const res = await fetch(url)
			let data = ''

			try {
				data = await res.json()

				if (Array.isArray(data)) {
					data = data.filter(
						(item) => item.identifier === 'qortal_profile'
					)

					if (data.length > 0) {
						this.resourceExists = true
						const dataItem = data[0]

						try {
							const response = await this.getRawData(dataItem)

							if (response.wallets) {
								await this.setValues(response, dataItem)
							} else {
								this.error = 'Cannot get saved user settings'
							}
						} catch (error) {
							this.error = 'Cannot get saved user settings'
						}
					} else {
						this.resourceExists = false
					}
				} else {
					this.error = 'Unable to perform query'
				}
			} catch (error) {
				data = {
					error: 'No resource found'
				}
			}

			if (resource) {
				this.hasRetrievedResource = true
			}
		} catch (error) {
			console.log({ error })
		}
	}

	stateChanged(state) {
		if (state.app.nodeStatus && state.app.nodeStatus.syncPercent !== this.syncPercentage) {
			this.syncPercentage = state.app.nodeStatus.syncPercent

			if (!this.hasAttemptedToFetchResource && state.app.nodeStatus.syncPercent === 100) {
				this.getProfile()
			}
		}

		if (
			state.app.accountInfo && state.app.accountInfo.names.length &&
			state.app.nodeStatus && state.app.nodeStatus.syncPercent === 100 &&
			this.hasName === false && this.hasAttemptedToFetchResource &&
			state.app.accountInfo && state.app.accountInfo.names &&
			state.app.accountInfo.names.length > 0
		) {
			this.getProfile()
		}
	}

	async getArbitraryFee() {
		const timestamp = Date.now()
		const url = `${this.nodeUrl}/transactions/unitfee?txType=ARBITRARY&timestamp=${timestamp}`
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

	async saveToQdn(data) {
		try {
			this.isSaving = true

			if (this.resourceExists === true && this.error) throw new Error('Unable to save')

			const nameObject = store.getState().app.accountInfo.names[0]

			if (!nameObject) throw new Error('no name')

			const arbitraryFeeData = await modalHelper.getArbitraryFee()
			const res = await modalHelper.showModalAndWaitPublish({
				feeAmount: arbitraryFeeData.feeToShow,
			})

			if (res.action !== 'accept') throw new Error('User declined publish')

			const name = nameObject.name
			const identifer = 'qortal_profile'
			const filename = 'qortal_profile.json'
			const selectedAddress = store.getState().app.selectedAddress
			const getArbitraryFee = await this.getArbitraryFee()
			const feeAmount = getArbitraryFee.fee

			let newObject = structuredClone(data)

			for (const key of Object.keys(newObject.customData || {})) {
				if (key.includes('-private')) {
					const dataKey = newObject.customData[key]
					let isBase64 = false

					try {
						const decodedString = atob(dataKey)
						isBase64 = decodedString.includes('qortalGroupEncryptedData')
					} catch (e) {
						console.log(e)
					}

					if (isBase64) {
						newObject['customData'][key] = newObject.customData[key]
					} else {
						const toBase64 = await objectToBase64(newObject.customData[key])

						newObject['customData'][key] = encryptDataGroup({
							data64: toBase64,
							publicKeys: []
						})
					}
				} else {
					newObject['customData'][key] = newObject.customData[key]
				}
			}

			const newObjectToBase64 = await objectToBase64(newObject)
			const worker = new WebWorker2()

			try {
				const resPublish = await publishData({
					registeredName: encodeURIComponent(name),
					file: newObjectToBase64,
					service: 'DOCUMENT',
					identifier: encodeURIComponent(identifer),
					parentEpml: parentEpml,
					uploadType: 'file',
					selectedAddress: selectedAddress,
					worker: worker,
					isBase64: true,
					filename: filename,
					apiVersion: 2,
					withFee: true,
					feeAmount: feeAmount
				})

				this.resourceExists = true
				this.profileData = data
				store.dispatch(setProfileData(data))
				parentEpml.request('showSnackBar', get('profile.profile22'))

				worker.terminate()
			} catch (error) {
				worker.terminate()
			}
		} catch (error) {
			console.log({ error })
			throw new Error(error.message)
		} finally {
			this.isSaving = false
		}
	}

	sendBackEvent(detail) {
		let iframes

		const mainApp = document.getElementById('main-app')

		if (mainApp && mainApp.shadowRoot) {
			const appView = mainApp.shadowRoot.querySelector('app-view')
			if (appView && appView.shadowRoot) {
				const showPlugin = appView.shadowRoot.querySelector('show-plugin')
				if (showPlugin && showPlugin.shadowRoot) {
					iframes = showPlugin.shadowRoot.querySelectorAll('iframe')
				}
			}
		}

		iframes.forEach((iframe) => {
			const iframeWindow = iframe.contentWindow;
			const customEvent = new CustomEvent('qortal-request-set-profile-data-response', { detail: detail })

			iframeWindow.dispatchEvent(customEvent)
		})
	}

	async _handleQortalRequestSetData(event) {
		const detail = event.detail

		try {
			if (!detail.property || !detail.payload) throw new Error('not saved')
			if (!this.profileData && (this.resourceExists || this.resourceExists === undefined)) throw new Error('unable to fetch the users profile data')

			this.isOpenProfileModalUpdate = true

			this.editContent = {...(this.profileData || {}),}

			if (detail.payload.customData) {
				this.qortalRequestCustomData = detail
			}

			// Wait for response event
			const response = await new Promise((resolve, reject) => {
				function handleResponseEvent(event) {
					// Handle the data from the event, if any
					const responseData = event.detail

					// Clean up by removing the event listener once we've received the response
					window.removeEventListener('send-back-event', handleResponseEvent)

					if (responseData.response === 'saved') {
						resolve(responseData)
					} else {
						reject(new Error(responseData.error))
					}
				}

				// Set up an event listener to wait for the response
				window.addEventListener('send-back-event', handleResponseEvent)
			})

			this.sendBackEvent({
				response: response.response,
				uniqueId: detail.uniqueId
			})
		} catch (error) {
			this.sendBackEvent({
				response: 'error',
				uniqueId: detail.uniqueId
			})
		}
	}

	_handleOpenVisiting(event) {
		try {
			const name = event.detail
			this.getVisitingProfile(name)
			this.dialogOpenedProfile = true
		} catch (error) { }
	}

	connectedCallback() {
		super.connectedCallback()
		window.addEventListener('qortal-request-set-profile-data', this._handleQortalRequestSetData)
		window.addEventListener('open-visiting-profile', this._handleOpenVisiting)
	}

	disconnectedCallback() {
		window.removeEventListener('qortal-request-set-profile-data', this._handleQortalRequestSetData)
		window.removeEventListener('open-visiting-profile', this._handleOpenVisiting)
		super.disconnectedCallback()
	}

	onClose(isSuccess) {
		this.isOpenProfileModalUpdate = false
		this.editContent = null

		if (this.qortalRequestCustomData) {
			// Create and dispatch custom event
			const customEvent = new CustomEvent('send-back-event', {
				detail: {
					response: isSuccess ? 'saved' : 'not saved'
				}
			})

			window.dispatchEvent(customEvent)

			this.qortalRequestCustomData = null
		}
	}

	avatarFullImage() {
		this.imageUrl = `${this.nodeUrl}/arbitrary/THUMBNAIL/${this.nameVisiting}/qortal_avatar?async=true&apiKey=${this.myNode.apiKey}`

		return html`<img class="round-fullinfo" src="${this.imageUrl}" onerror="this.src='/img/incognito.png';" />`
	}

	openUserInfo() {
		const infoDialog = document
			.getElementById('main-app')
			.shadowRoot.querySelector('app-view')
			.shadowRoot.querySelector('user-info-view')
		infoDialog.openUserInfo(this.nameVisiting)
	}

	openEdit() {
		this.isOpenProfileModalUpdate = !this.isOpenProfileModalUpdate
	}

	onCloseVisitingProfile() {
		this.profileDataVisiting = null
		this.nameVisiting = ''
		this.imageUrl = ''
		this.resourceExistsVisiting = undefined
		this.isFriend = undefined
	}

	updated(changedProperties) {
		if (changedProperties && changedProperties.has('dialogOpenedProfile') && this.dialogOpenedProfile === false) {
			const prevVal = changedProperties.get('dialogOpenedProfile')
			if (prevVal === true) this.onCloseVisitingProfile()
		}
	}

	async getUserAddress() {
		try {
			const url = `${this.nodeUrl}/names/${this.nameVisiting}`
			const res = await fetch(url)
			const result = await res.json()

			if (result.error === 401) {
				return ''
			} else {
				return result.owner
			}
		} catch (error) {
			return ''
		}
	}

	checkIfInFriendsList(name) {
		try {
			this.isFriend = undefined
			const friendList = JSON.parse(localStorage.getItem('friends-my-friend-list') || '[]')
			const findIndex = friendList.findIndex((friend) => friend.name === name)
			this.isFriend = findIndex !== -1
		} catch (error) { }
	}

	// Standard functions
	getApiKey() {
		const coreNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		return coreNode.apiKey
	}

	isEmptyArray(arr) {
		if (!arr) { return true }
		return arr.length === 0
	}

	round(number) {
		return (Math.round(parseFloat(number) * 1e8) / 1e8).toFixed(8)
	}
}

window.customElements.define('profile-qdn', ProfileQdn)