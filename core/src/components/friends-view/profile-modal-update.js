import { LitElement, html, css } from 'lit';
import { render } from 'lit/html.js';
import {
	use,
	get,
	translate,
	translateUnsafeHTML,
	registerTranslateConfig,
} from 'lit-translate';
import '@material/mwc-button';
import '@material/mwc-icon';
import '@material/mwc-dialog';
import '@material/mwc-checkbox';
import { connect } from 'pwa-helpers';
import { store } from '../../store';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import { parentEpml } from '../show-plugin';

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
			newCustomDataField: {type: Object},
			newFieldName: {type: String},
			qortalRequestCustomData: {type: Object},
			newCustomDataKey: {type: String},
			isSaving: {type: Boolean}
		};
	}

	constructor() {
		super();
		this.isOpen = false;
		this.isLoading = false;
		this.nodeUrl = this.getNodeUrl();
		this.myNode = this.getMyNode();
		this.tagline = '';
		this.bio = '';
		this.walletList = ['btc', 'ltc', 'doge', 'dgb', 'rvn', 'arrr'];
		let wallets = {};
		this.walletList.forEach((item) => {
			wallets[item] = '';
		});
		this.wallets = wallets;
		this.walletsUi = new Map();
		let coinProp = {
			wallet: null,
		};

		this.walletList.forEach((c, i) => {
			this.walletsUi.set(c, { ...coinProp });
		});
		this.walletsUi.get('btc').wallet =
			window.parent.reduxStore.getState().app.selectedAddress.btcWallet;
		this.walletsUi.get('ltc').wallet =
			window.parent.reduxStore.getState().app.selectedAddress.ltcWallet;
		this.walletsUi.get('doge').wallet =
			window.parent.reduxStore.getState().app.selectedAddress.dogeWallet;
		this.walletsUi.get('dgb').wallet =
			window.parent.reduxStore.getState().app.selectedAddress.dgbWallet;
		this.walletsUi.get('rvn').wallet =
			window.parent.reduxStore.getState().app.selectedAddress.rvnWallet;
		this.walletsUi.get('arrr').wallet =
			window.parent.reduxStore.getState().app.selectedAddress.arrrWallet;
		this.hasFetchedArrr = false;
		this.isOpenCustomDataModal = false;
		this.customData = {};
		this.newCustomDataKey = ""
		this.newCustomDataField = {};
		this.newFieldName = '';
		this.isSaving = false
		
	}

	static get styles() {
		return css`
			* {
				--mdc-theme-primary: rgb(3, 169, 244);
				--mdc-theme-secondary: var(--mdc-theme-primary);
				--mdc-theme-surface: var(--white);
				--mdc-dialog-content-ink-color: var(--black);
				--mdc-dialog-min-width: 400px;
				--mdc-dialog-max-width: 1024px;
				box-sizing: border-box;
			}
			.input {
				width: 90%;
				outline: 0;
				border-width: 0 0 2px;
				border-color: var(--mdc-theme-primary);
				background-color: transparent;
				padding: 10px;
				font-family: Roboto, sans-serif;
				font-size: 15px;
				color: var(--chat-bubble-msg-color);
				box-sizing: border-box;
			}
			.input::selection {
				background-color: var(--mdc-theme-primary);
				color: white;
			}

			.input::placeholder {
				opacity: 0.6;
				color: var(--black);
			}

			.modal-button {
				font-family: Roboto, sans-serif;
				font-size: 16px;
				color: var(--mdc-theme-primary);
				background-color: transparent;
				padding: 8px 10px;
				border-radius: 5px;
				border: none;
				transition: all 0.3s ease-in-out;
			}

			.modal-button-red {
				font-family: Roboto, sans-serif;
				font-size: 16px;
				color: #f44336;
				background-color: transparent;
				padding: 8px 10px;
				border-radius: 5px;
				border: none;
				transition: all 0.3s ease-in-out;
			}

			.modal-button-red:hover {
				cursor: pointer;
				background-color: #f4433663;
			}

			.modal-button:hover {
				cursor: pointer;
				background-color: #03a8f475;
			}
			.checkbox-row {
				position: relative;
				display: flex;
				align-items: center;
				align-content: center;
				font-family: Montserrat, sans-serif;
				font-weight: 600;
				color: var(--black);
			}
			.modal-overlay {
				display: block;
				position: fixed;
				top: 0;
				left: 0;
				width: 100vw;
				height: 100vh;
				background-color: rgba(
					0,
					0,
					0,
					0.5
				); /* Semi-transparent backdrop */
				z-index: 1000;
			}

			.modal-content {
				position: fixed;
				top: 50vh;
				left: 50vw;
				transform: translate(-50%, -50%);
				background-color: var(--mdc-theme-surface);
				width: 80vw;
				max-width: 600px;
				padding: 20px;
				box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;
				z-index: 1001;
				border-radius: 5px;
				display: flex;
				flex-direction: column;
			}

			.modal-overlay.hidden {
				display: none;
			}
			.avatar {
				width: 36px;
				height: 36px;
				display: flex;
				align-items: center;
			}

			.app-name {
				display: flex;
				gap: 20px;
				align-items: center;
				width: 100%;
				cursor: pointer;
				padding: 5px;
				border-radius: 5px;
				margin-bottom: 10px;
			}
			.inner-content {
				display: flex;
				flex-direction: column;
				max-height: 75vh;
				flex-grow: 1;
				overflow: auto;
			}

			.inner-content::-webkit-scrollbar-track {
				background-color: whitesmoke;
				border-radius: 7px;
			}

			.inner-content::-webkit-scrollbar {
				width: 12px;
				border-radius: 7px;
				background-color: whitesmoke;
			}

			.inner-content::-webkit-scrollbar-thumb {
				background-color: rgb(180, 176, 176);
				border-radius: 7px;
				transition: all 0.3s ease-in-out;
			}
		`;
	}

	async updated(changedProperties) {
		if (
			changedProperties &&
			changedProperties.has('editContent') &&
			this.editContent
		) {
			const {bio, tagline, wallets, customData} = this.editContent
			this.bio = bio ?? '';
			this.tagline = tagline ?? '';
			this.wallets = wallets ?? {};
			this.customData = {...customData}
			this.requestUpdate();
		}
		if (
			changedProperties &&
			changedProperties.has('qortalRequestCustomData') &&
			this.qortalRequestCustomData
		) {
			console.log('this.qortalRequestCustomData', this.qortalRequestCustomData)
			this.isOpenCustomDataModal = true
			this.newCustomDataField = {...this.qortalRequestCustomData.payload.customData}
			this.newCustomDataKey = this.qortalRequestCustomData.property
			this.requestUpdate();
		}

		
	}

	async firstUpdated() {
		try {
			await this.fetchWalletAddress('arrr');
		} catch (error) {
			console.log({ error });
		} finally {
		}
	}

	async fetchWalletAddress(coin) {
		console.log({ coin });
		switch (coin) {
			case 'arrr':
				console.log('arrr');
				const arrrWalletName = `${coin}Wallet`;

				const res2 = await parentEpml.request('apiCall', {
					url: `/crosschain/${coin}/syncstatus?apiKey=${this.myNode.apiKey}`,
					method: 'POST',
					body: `${
						window.parent.reduxStore.getState().app.selectedAddress[
							arrrWalletName
						].seed58
					}`,
				});
				if (res2 !== null && res2 !== 'Synchronized') {
					// Check again shortly after
					await new Promise((resolve) => setTimeout(resolve, 2000));
					this.fetchWalletAddress('arrr');

					// No need to make balance or transaction list calls yet
					return;
				}

				let res = await parentEpml.request('apiCall', {
					url: `/crosschain/${coin}/walletaddress?apiKey=${this.myNode.apiKey}`,
					method: 'POST',
					body: `${
						window.parent.reduxStore.getState().app.selectedAddress[
							arrrWalletName
						].seed58
					}`,
				});
				if (res != null && res.error != 1201 && res.length === 78) {
					this.arrrWalletAddress = res;
					this.hasFetchedArrr = true;
				}
				break;

			default:
				// Not used for other coins yet
				break;
		}
	}

	getSelectedWalletAddress(wallet) {
		switch (wallet) {
			case 'arrr':
				// Use address returned by core API
				return this.arrrWalletAddress;

			default:
				// Use locally derived address
				return this.walletsUi.get(wallet).wallet.address;
		}
	}

	getNodeUrl() {
		const myNode =
			store.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			];

		const nodeUrl =
			myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
		return nodeUrl;
	}
	getMyNode() {
		const myNode =
			store.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			];

		return myNode;
	}

	clearFields() {
		this.bio = '';
		this.tagline = '';
		this.wallets = {};
	}

	fillAddress(coin) {
		const address = this.getSelectedWalletAddress(coin);
		if (address) {
			this.wallets = {
				...this.wallets,
				[coin]: address,
			};
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
			};
			this.isSaving = true
			await this.onSubmit(data);
			this.setIsOpen(false);
			this.clearFields();
			this.onClose('success');
		} catch (error) {} finally {
			this.isSaving = false
		}
	}

	removeField(key){
		const copyObj = {...this.newCustomDataField}
		delete copyObj[key]
		this.newCustomDataField = copyObj
	}

	addField(){
		const copyObj = {...this.newCustomDataField}
		copyObj[this.newFieldName] = ''
		this.newCustomDataField = copyObj
		this.newFieldName = ""
	}

	addCustomData(){
		const copyObj = {...this.customData}
		copyObj[this.newCustomDataKey] = this.newCustomDataField
		this.customData = copyObj
		this.newCustomDataKey = ""
		this.newCustomDataField = {};
		this.newFieldName = ''
		this.isOpenCustomDataModal = false;
	}

	updateCustomData(key, data){
		this.isOpenCustomDataModal = true
		this.newCustomDataField = data
		this.newCustomDataKey = key

	}
	removeCustomData(key){
		const copyObj = {...this.customData}
		delete copyObj[key]
		this.customData = copyObj
	}

	render() {
		console.log('modal');
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
									<div
										style="display:flex;justify-content:center;flex-direction:column"
									>
										<label
											for=${key}
											id="taglineLabel"
											style="color: var(--black);font-size:16px"
										>
											${key}
										</label>
										<div
											style="display:flex;gap:15px;align-items:center"
										>
											<input
												id=${key}
												placeholder=${key + ' ' +  get('settings.address')}
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
												@click=${() =>
													this.fillAddress(key)}
												style="color:var(--black);cursor:pointer"
												>upload_2</mwc-icon
											>
										</div>
									</div>
								`;
							})}
						</div>
						<div style="display: flex;flex-direction: column;">
							${Object.keys(this.customData).map((key) => {
								return html`
									<div
										style="display:flex;justify-content:center;flex-direction:column;gap:25px"
									>
										
										<div
											style="display:flex;gap:15px;align-items:center"
										>
										<p
										
											style="color: var(--black);font-size:16px"
										>
											${key}
											</p>

											<mwc-icon
												@click=${() =>
													this.updateCustomData(key,this.customData[key])}
												style="color:var(--black);cursor:pointer"
												>edit</mwc-icon
											>
											<mwc-icon
												@click=${() =>
													this.removeCustomData(key)}
												style="color:var(--black);cursor:pointer"
												>remove</mwc-icon
											>
										</div>
									</div>
								`;
							})}
						</div>
					</div>
					<div
						style="display:flex;justify-content:space-between;align-items:center;margin-top:20px"
					>
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
								if(this.isSaving) return
								this.saveProfile();
							}}
						>
						${this.isSaving ? html`
							<paper-spinner-lite active></paper-spinner-lite>
							` : ''}
							${this.isSaving ? '' : translate('profile.profile3') }
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
				<div class="modal-content">
					<div class="inner-content">
						<div style="height:15px"></div>
						<div
							style="display:flex;justify-content:center;flex-direction:column"
						>
							<label
								for="key-name"
								id="taglineLabel"
								style="color: var(--black);font-size:16px"
							>
								${translate('profile.profile9')}
							</label>
							<div
								style="display:flex;gap:15px;align-items:center"
							>
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
						<div style="height:15px"></div>
						<p>${translate('profile.profile10')}</p>
						<div style="display: flex;flex-direction: column;">
							${Object.keys(this.newCustomDataField).map((key) => {
								return html`
									<div
										style="display:flex;justify-content:center;flex-direction:column"
									>
										<label
											for=${key}
											id="taglineLabel"
											style="color: var(--black);font-size:16px"
										>
											${key}
										</label>
										<div
											style="display:flex;gap:15px;align-items:center"
										>
										
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
												@click=${() =>
													this.removeField(key)}
												style="color:var(--black);cursor:pointer"
												>remove</mwc-icon
											>
										</div>
									</div>
								`;
							})}
						</div>
						<div style="height:15px"></div>
						<div style="width:100%;display:flex;justify-content:center;gap:10px">
						<input
												
												placeholder=${translate('profile.profile12')}
												class="input"
												.value=${this.newFieldName}
												@change=${(e) => {
													this.newFieldName = e.target.value
													
												}}
											/>
						<button
							class="modal-button"
							@click=${() => {
								this.addField();
							}}
						>
							${translate('profile.profile11')}
						</button>
						</div>
					</div>
					<div
						style="display:flex;justify-content:space-between;align-items:center;margin-top:20px"
					>
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
		`;
	}
}

customElements.define('profile-modal-update', ProfileModalUpdate);
