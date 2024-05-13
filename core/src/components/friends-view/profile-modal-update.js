import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store'
import { parentEpml } from '../show-plugin'
import { get, translate } from '../../../translate'
import { profileModalUpdateStyles } from '../../styles/core-css'
import '@material/mwc-button'
import '@material/mwc-checkbox'
import '@material/mwc-dialog'
import '@material/mwc-icon'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/tooltip'

class ProfileModalUpdate extends connect(store)(LitElement) {
	static get properties() {
		return {
			isOpen: { type: Boolean },
			setIsOpen: { attribute: false },
			isLoading: { type: Boolean },
			onSubmit: { attribute: false },
			editContent: { type: Object },
			onClose: { attribute: false },
			tagline: { type: String },
			bio: { type: String },
			wallets: { type: Array },
			hasFetchedArrr: { type: Boolean },
			isOpenCustomDataModal: { type: Boolean },
			customData: { type: Object },
			newCustomDataField: { type: Object },
			newFieldName: { type: String },
			qortalRequestCustomData: { type: Object },
			newCustomDataKey: { type: String },
			newCustomDataValue: { type: String },
			isSaving: { type: Boolean }
		}
	}

	static get styles() {
		return [profileModalUpdateStyles]
	}

	constructor() {
		super();
		this.isOpen = false
		this.isLoading = false
		this.nodeUrl = this.getNodeUrl()
		this.myNode = this.getMyNode()
		this.tagline = ''
		this.bio = ''
		this.walletList = ['btc', 'ltc', 'doge', 'dgb', 'rvn', 'arrr']
		let wallets = {}
		this.walletList.forEach((item) => {
			wallets[item] = ''
		})
		this.wallets = wallets
		this.walletsUi = new Map()
		let coinProp = {
			wallet: null
		}
		this.walletList.forEach((c, i) => {
			this.walletsUi.set(c, { ...coinProp })
		})
		this.walletsUi.get('btc').wallet = store.getState().app.selectedAddress.btcWallet
		this.walletsUi.get('ltc').wallet = store.getState().app.selectedAddress.ltcWallet
		this.walletsUi.get('doge').wallet = store.getState().app.selectedAddress.dogeWallet
		this.walletsUi.get('dgb').wallet = store.getState().app.selectedAddress.dgbWallet
		this.walletsUi.get('rvn').wallet = store.getState().app.selectedAddress.rvnWallet
		this.hasFetchedArrr = false
		this.isOpenCustomDataModal = false
		this.customData = {}
		this.newCustomDataKey = ""
		this.newCustomDataValue = ""
		this.newCustomDataField = {}
		this.newFieldName = ''
		this.isSaving = false
		this.addPrivate = this.addPrivate.bind(this)
		this.checkForPrivate = this.checkForPrivate.bind(this)
	}

	render() {
		return html`
			<div class="modal-overlay ${this.isOpen ? '' : 'hidden'}">
				<div class="modal-content">
					<div class="inner-content">
						<div style="height:15px"></div>
						<div style="display: flex;flex-direction: column;">
							<label
								for="tagline"
								id="taglineLabel"
								style="color: var(--black);"
							>
								${translate('profile.profile4')}
							</label>
							<textarea
								class="input"
								@change=${(e) => {
									this.tagline = e.target.value;
								}}
								.value=${this.tagline}
								?disabled=${this.isLoading}
								id="tagline"
								placeholder="${translate('profile.profile4')}"
								rows="3"
							></textarea>
						</div>
						<div style="height:15px"></div>
						<div style="display: flex;flex-direction: column;">
							<label
								for="bio"
								id="bioLabel"
								style="color: var(--black);"
							>
								${translate('profile.profile5')}
							</label>
							<textarea
								class="input"
								@change=${(e) => {
									this.bio = e.target.value;
								}}
								.value=${this.bio}
								?disabled=${this.isLoading}
								id="bio"
								placeholder="${translate('profile.profile5')}"
								rows="3"
							></textarea>
						</div>
						<div style="height:15px"></div>
						<p>${translate('profile.profile6')}</p>
						<div style="display: flex;flex-direction: column;">
							${Object.keys(this.wallets).map((key) => {
								return html`
									<div style="display:flex;justify-content:center;flex-direction:column">
										<label
											for=${key}
											id="taglineLabel"
											style="color: var(--black);font-size:16px"
										>
											${key}
										</label>
										<div style="display:flex;gap:15px;align-items:center">
											<input
												id=${key}
												placeholder=${key + ' ' + get('settings.address')}
												class="input"
												.value=${this.wallets[key]}
												@change=${(e) => {
													this.wallets = {
														...this.wallets,
														[key]: e.target.value,
													};
												}}
											/>
											<mwc-icon
												id=${`${key}-upload`}
												@click=${() =>
												this.fillAddress(key)}
												style="color:var(--black);cursor:pointer"
											>
												upload_2
											</mwc-icon>
											<vaadin-tooltip
												for=${`${key}-upload`}
												position="bottom"
												hover-delay=${200}
												hide-delay=${1}
												text=${translate('profile.profile21')}
											></vaadin-tooltip>
										</div>
									</div>
								`
							})}
						</div>
						<div style="display: flex;flex-direction: column;">
							${Object.keys(this.customData).map((key) => {
								return html`
									<div style="display:flex;justify-content:center;flex-direction:column;gap:25px">
										<div style="display:flex;gap:15px;align-items:center">
											<p style="color: var(--black);font-size:16px">${key}</p>
											<mwc-icon
												@click=${() => this.updateCustomData(key, this.customData[key])}
												style="color:var(--black);cursor:pointer"
											>
												edit
											</mwc-icon>
											<mwc-icon
												@click=${() => this.removeCustomData(key)}
												style="color:var(--black);cursor:pointer"
											>
												remove
											</mwc-icon>
										</div>
									</div>
								`
							})}
						</div>
					</div>
					<div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px">
						<button
							class="modal-button-red"
							?disabled="${this.isLoading}"
							@click="${() => {
								this.setIsOpen(false);
								this.clearFields();
								this.onClose();
							}}"
						>
							${translate('general.close')}
						</button>
						<div style="display:flex;gap:10px;align-items:center">
							<button
								?disabled="${this.isLoading}"
								class="modal-button"
								@click=${() => {
									this.isOpenCustomDataModal = true;
								}}
							>
								${translate('profile.profile8')}
							</button>
							<button
								?disabled="${this.isLoading}"
								class="modal-button"
								@click=${() => {
									if (this.isSaving) return
									this.saveProfile();
								}}
							>
								${this.isSaving ? html`
									<paper-spinner-lite active></paper-spinner-lite>
								` : ''}
								${this.isSaving ? '' : translate('profile.profile3')}
							</button>
						</div>
					</div>
				</div>
			</div>
			<!-- add custom vars -->
			<div
				class="modal-overlay ${this.isOpenCustomDataModal
				? ''
				: 'hidden'}"
				style="z-index:1001"
			>
				<div class="modal-content" style="max-width: 950px">
					<div class="inner-content">
						<div style="display:flex; justify-content:flex-end">
							<div class="checkbox-row" style="font-size:16px">
								<label for="isPrivate" style="color: var(--black);">${get('profile.profile23')}</label>
								<mwc-checkbox id="isPrivate" @change=${(e) => this.addPrivate(e)} ?checked=${this.checkForPrivate()}></mwc-checkbox>
							</div>
						</div>
						<div style="height:15px"></div>
						<div style="display:flex;justify-content:center;flex-direction:column">
							<label
								for="key-name"
								id="taglineLabel"
								style="color: var(--black);font-size:16px"
							>
								${translate('profile.profile9')}
							</label>
							<div style="display:flex;gap:15px;align-items:center">
								<input
									id="key-name"
									placeholder=${translate(
										'profile.profile9'
									)}
									?disabled=${!!this.qortalRequestCustomData}
									class="input"
									.value=${this.newCustomDataKey}
									@change=${(e) => {
										this.newCustomDataKey = e.target.value
									}}
								/>
							</div>
						</div>
						<p style=${`${Object.keys(this.newCustomDataField).length ? "margin: 10px 0 10px 0;" : "margin: 10px 0 0 0;"}`}>
							${translate('profile.profile10')}
						</p>
						<div style="display: flex;flex-direction: column;">
							${Object.keys(this.newCustomDataField).map((key) => {
								return html`
									<div style="display:flex;justify-content:center;flex-direction:column">
										<label for=${key} id="taglineLabel" style="color: var(--black);font-size:16px">${key}</label>
										<div style="display:flex;gap:15px;align-items:center">
											<input
												id=${key}
												placeholder=${translate('profile.profile13')}
												class="input"
												.value=${this.newCustomDataField[key]}
												@change=${(e) => {
													this.newCustomDataField = {
														...this.newCustomDataField,
														[key]: e.target.value,
													};
												}}
											/>
											<mwc-icon
												@click=${() => this.removeField(key)}
												style="color:var(--black);cursor:pointer"
											>
												remove
											</mwc-icon>
										</div>
									</div>
								`
							})}
						</div>
						<div style=${`display: flex; flex-direction: row; align-items: center;justify-content:space-between; ${Object.keys(this.newCustomDataField).length ? "margin-top: 10px" : ""}`}>
							<div style="width:100%;display:flex; flex-direction: column; align-items: flex-start;justify-content:center;gap:10px;">
								<input
									placeholder=${translate('profile.profile12')}
									class="input"
									.value=${this.newFieldName}
									@change=${(e) => {
										this.newFieldName = e.target.value
									}}
								/>
								<input
									id="value-name"
									placeholder=${translate('profile.profile13')}
									class="input"
									.value=${this.newCustomDataValue}
									@change=${(e) => {
										this.newCustomDataValue = e.target.value;
								}}
								/>
							</div>
							<button
								class="modal-button"
								style="margin-top: 25px; width: 100px; min-height: 80px;"
								@click=${() => {
									this.addField();
								}}
							>
								${translate('profile.profile11')}
							</button>
						</div>
					</div>
					<div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px">
						<button
							class="modal-button-red"
							?disabled="${this.isLoading}"
							@click="${() => {
								this.isOpenCustomDataModal = false
								this.newCustomDataKey = ""
								this.newCustomDataField = {};
							}}"
						>
							${translate('general.close')}
						</button>
						<button
							?disabled="${this.isSaving}"
							class="modal-button"
							@click=${() => {
								this.addCustomData();
							}}
						>
							${translate('profile.profile8')}
						</button>
					</div>
				</div>
			</div>
		`
	}

	async firstUpdated() {
		try {
			await this.fetchWalletAddress('arrr')
		} catch (error) {
			console.log({ error })
		} finally {
		}
	}

	async updated(changedProperties) {
		if (changedProperties && changedProperties.has('editContent') && this.editContent) {
			const { bio, tagline, wallets, customData } = this.editContent
			this.bio = bio ?? ''
			this.tagline = tagline ?? ''
			let formWallets = { ...this.wallets }
			if (wallets && Object.keys(wallets).length) {
				Object.keys(formWallets).forEach((key) => {
					if (wallets[key]) {
						formWallets[key] = wallets[key]
					}
				})
			}
			this.wallets = formWallets

			this.customData = { ...customData }
			this.requestUpdate();
		}
		if (changedProperties && changedProperties.has('qortalRequestCustomData') && this.qortalRequestCustomData) {
			this.isOpenCustomDataModal = true
			this.newCustomDataField = { ...this.qortalRequestCustomData.payload.customData }
			this.newCustomDataKey = this.qortalRequestCustomData.property
			this.requestUpdate()
		}
	}

	async fetchWalletAddress(coin) {
		switch (coin) {
			case 'arrr':
				const arrrWalletName = `${coin}Wallet`;

				let res = await parentEpml.request('apiCall', {
					url: `/crosschain/${coin}/walletaddress?apiKey=${this.myNode.apiKey}`,
					method: 'POST',
					body: `${store.getState().app.selectedAddress[arrrWalletName].seed58}`
				})
				if (res != null && res.error != 1201 && res.length === 78) {
					this.arrrWalletAddress = res
					this.hasFetchedArrr = true
				}
				break

			default:
				// Not used for other coins yet
				break
		}
	}

	async getSelectedWalletAddress(wallet) {
		switch (wallet) {
			case 'arrr':
				if (!this.arrrWalletAddress) {
					try {
						await this.fetchWalletAddress('arrr')
					} catch (error) {
						console.log({ error })
					}
				}
				// Use address returned by core API
				return this.arrrWalletAddress

			default:
				// Use locally derived address
				return this.walletsUi.get(wallet).wallet.address
		}
	}

	getNodeUrl() {
		const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		return myNode.protocol + '://' + myNode.domain + ':' + myNode.port
	}

	getMyNode() {
		return store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
	}

	clearFields() {
		this.bio = ''
		this.tagline = ''
	}

	async fillAddress(coin) {
		const address = await this.getSelectedWalletAddress(coin)

		if (address) {
			this.wallets = {
				...this.wallets,
				[coin]: address
			}
		}
	}

	async saveProfile() {
		try {
			const data = {
				version: 1,
				tagline: this.tagline,
				bio: this.bio,
				wallets: this.wallets,
				customData: this.customData
			}
			this.isSaving = true
			await this.onSubmit(data)
			this.setIsOpen(false)
			this.clearFields()
			this.onClose('success')
		} catch (error) { } finally {
			this.isSaving = false
		}
	}

	removeField(key) {
		const copyObj = { ...this.newCustomDataField }
		delete copyObj[key]
		this.newCustomDataField = copyObj
	}

	addField() {
		if (!this.newFieldName || !this.newCustomDataValue) {
			let snack5string = get("profile.profile24")
			parentEpml.request('showSnackBar', `${snack5string}`)
			return
		}
		const copyObj = { ...this.newCustomDataField }
		copyObj[this.newFieldName] = this.newCustomDataValue
		this.newCustomDataField = copyObj
		this.newFieldName = ''
		this.newCustomDataValue = ''
	}

	addCustomData() {
		const copyObj = { ...this.customData }
		copyObj[this.newCustomDataKey] = this.newCustomDataField
		this.customData = copyObj
		this.newCustomDataKey = ''
		this.newCustomDataField = {}
		this.newFieldName = ''
		this.newCustomDataValue = ''
		this.isOpenCustomDataModal = false
	}

	updateCustomData(key, data) {
		this.isOpenCustomDataModal = true
		this.newCustomDataField = data
		this.newCustomDataKey = key

	}

	removeCustomData(key) {
		const copyObj = { ...this.customData }
		delete copyObj[key]
		this.customData = copyObj
	}

	checkForPrivate() {
		let isPrivate = false
		if (this.newCustomDataKey.includes('-private')) isPrivate = true
		return isPrivate
	}

	addPrivate(e) {
		if (e.target.checked) {
			if (this.newCustomDataKey.includes('-private')) {

			} else {
				this.newCustomDataKey = this.newCustomDataKey + '-private'
			}
		} else {
			this.newCustomDataKey = this.newCustomDataKey.replace('-private', '')
		}
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

window.customElements.define('profile-modal-update', ProfileModalUpdate)