import { LitElement, html, css } from 'lit';
import '@material/mwc-icon';
import './friends-side-panel.js';
import { connect } from 'pwa-helpers';
import { store } from '../../store.js';
import WebWorker2 from '../WebWorkerFile.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import '@vaadin/tooltip';
import { get, translate } from 'lit-translate';
import ShortUniqueId from 'short-unique-id';

import {
	decryptGroupData,
	encryptDataGroup,
	objectToBase64,
	uint8ArrayToBase64,
	uint8ArrayToObject,
} from '../../../../plugins/plugins/core/components/qdn-action-encryption.js';
import { publishData } from '../../../../plugins/plugins/utils/publish-image.js';
import { parentEpml } from '../show-plugin.js';
import '../notification-view/popover.js';
import './avatar.js';
import { setNewTab } from '../../redux/app/app-actions.js';
import './profile-modal-update.js';

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
			profileData: {type: Object}
		};
	}

	constructor() {
		super();
		this.isOpen = false;
		this.getProfile = this.getProfile.bind(this);
		this._updateTempSettingsData = this._updateTempSettingsData.bind(this);
		this.setValues = this.setValues.bind(this);
		this.saveToQdn = this.saveToQdn.bind(this);
		this.syncPercentage = 0;
		this.hasRetrievedResource = false;
		this.hasAttemptedToFetchResource = false;
		this.resourceExists = undefined;
		this.settingsRawData = null;
		this.nodeUrl = this.getNodeUrl();
		this.myNode = this.getMyNode();
		this.valuesToBeSavedOnQdn = {};
		this.isSaving = false;
		this.fee = null;
		this.name = undefined;
		this.uid = new ShortUniqueId();
		this.isOpenProfileModalUpdate = false;
		this.editContent = null;
		this.profileData = null
	}
	static styles = css`
		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 16px;
			border-bottom: 1px solid #e0e0e0;
		}

		.content {
			padding: 16px;
		}
		.close {
			visibility: hidden;
			position: fixed;
			z-index: -100;
			right: -1000px;
		}

		.parent-side-panel {
			transform: translateX(100%); /* start from outside the right edge */
			transition: transform 0.3s ease-in-out;
		}
		.parent-side-panel.open {
			transform: translateX(0); /* slide in to its original position */
		}
		.notActive {
			opacity: 0.5;
			cursor: default;
			color: var(--black);
		}
		.active {
			opacity: 1;
			cursor: pointer;
			color: green;
		}
		.accept-button {
			font-family: Roboto, sans-serif;
			letter-spacing: 0.3px;
			font-weight: 300;
			padding: 8px 5px;
			border-radius: 3px;
			text-align: center;
			color: var(--mdc-theme-primary);
			transition: all 0.3s ease-in-out;
			display: flex;
			align-items: center;
			gap: 10px;
			font-size: 18px;
		}

		.accept-button:hover {
			cursor: pointer;
			background-color: #03a8f485;
		}

		.undo-button {
			font-family: Roboto, sans-serif;
			letter-spacing: 0.3px;
			font-weight: 300;
			padding: 8px 5px;
			border-radius: 3px;
			text-align: center;
			color: #f44336;
			transition: all 0.3s ease-in-out;
			display: flex;
			align-items: center;
			gap: 10px;
			font-size: 18px;
		}

		.undo-button:hover {
			cursor: pointer;
			background-color: #f4433663;
		}
	`;

	getNodeUrl() {
		const myNode =
			window.parent.reduxStore.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			];

		const nodeUrl =
			myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
		return nodeUrl;
	}
	getMyNode() {
		const myNode =
			window.parent.reduxStore.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			];

		return myNode;
	}

	

	async getRawData(dataItem) {
		const url = `${this.nodeUrl}/arbitrary/${dataItem.service}/${dataItem.name}/${dataItem.identifier}`;
		const res = await fetch(url);
		const data = await res.json();
		if (data.error) throw new Error('Cannot retrieve your data from qdn');
		return data
	}

	async getMyFollowedNames() {
		let myFollowedNames = [];
		try {
			myFollowedNames = await parentEpml.request('apiCall', {
				url: `/lists/followedNames?apiKey=${this.myNode.apiKey}`,
			});
		} catch (error) {}

		return myFollowedNames;
	}

	async followNames(names) {
		let items = names;
		let namesJsonString = JSON.stringify({ items: items });

		let ret = await parentEpml.request('apiCall', {
			url: `/lists/followedNames?apiKey=${this.myNode.apiKey}`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: `${namesJsonString}`,
		});

		return ret;
	}

	async setValues(response, resource) {
		console.log('hello', response)
		
		if(response){
			let data = {...response}
		let customData = {}
			for (const key of Object.keys(data.customData || {})) {
				if (key.includes('-private')) {
					try {
						console.log('key', data.customData[key])
						const decryptedData = decryptGroupData(data.customData[key]);

						console.log({decryptedData})
						if(decryptedData && !decryptedData.error){
							const decryptedDataToBase64 = uint8ArrayToObject(decryptedData);
							if(decryptedDataToBase64 && !decryptedDataToBase64.error){
								customData[key] = decryptedDataToBase64;
							}

						}
					} catch (error) {
						console.log({error})
					}
					
				} 
			}
			this.profileData = {
				...response,
				customData
			}
		}
	}

	async getProfile() {
		try {
			const arbFee = await this.getArbitraryFee();
			this.fee = arbFee;
			this.hasAttemptedToFetchResource = true;
			let resource;
			const nameObject = store.getState().app.accountInfo.names[0];
			if (!nameObject) {
				this.name = null;
				throw new Error('no name');
			}
			const name = nameObject.name;
			this.name = name;
			this.error = '';
			const url = `${this.nodeUrl}/arbitrary/resources/search?service=DOCUMENT&identifier=qortal_profile&name=${name}&prefix=true&exactmatchnames=true&excludeblocked=true&limit=20`;
			const res = await fetch(url);
			let data = '';
			try {
				console.log({res})
				data = await res.json();
				console.log({data})
				if (Array.isArray(data)) {
					data = data.filter(
						(item) => item.identifier === 'qortal_profile'
					);

					if (data.length > 0) {
						this.resourceExists = true;
						const dataItem = data[0];
						try {
							const response = await this.getRawData(dataItem);
							console.log({response})
							if (response.wallets) {
								this.setValues(response, dataItem);
							} else {
								this.error = 'Cannot get saved user settings';
							}
						} catch (error) {
							console.log({ error });
							this.error = 'Cannot get saved user settings';
						}
					} else {
						this.resourceExists = false;
					}
				} else {
					this.error = 'Unable to perform query';
				}
			} catch (error) {
				console.log({error})
				data = {
					error: 'No resource found',
				};
			}

			if (resource) {
				this.hasRetrievedResource = true;
			}
		} catch (error) {
			console.log({ error });
		}
	}

	stateChanged(state) {
		if (
			state.app.accountInfo &&
			state.app.accountInfo.names.length &&
			state.app.nodeStatus &&
			state.app.nodeStatus.syncPercent !== this.syncPercentage
		) {
			this.syncPercentage = state.app.nodeStatus.syncPercent;

			if (
				!this.hasAttemptedToFetchResource &&
				state.app.nodeStatus.syncPercent === 100
			) {
				this.getProfile();
			}
		}
	}

	async getArbitraryFee() {
		const timestamp = Date.now();
		const url = `${this.nodeUrl}/transactions/unitfee?txType=ARBITRARY&timestamp=${timestamp}`;
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error('Error when fetching arbitrary fee');
		}
		const data = await response.json();
		const arbitraryFee = (Number(data) / 1e8).toFixed(8);
		return {
			timestamp,
			fee: Number(data),
			feeToShow: arbitraryFee,
		};
	}

	async saveToQdn(data) {
		try {
			console.log({data})
			this.isSaving = true;
			if (this.resourceExists === true && this.error)
				throw new Error('Unable to save');

			const nameObject = store.getState().app.accountInfo.names[0];
			if (!nameObject) throw new Error('no name');
			const name = nameObject.name;
			const identifer = 'qortal_profile';
			const filename = 'qortal_profile.json';
			const selectedAddress = store.getState().app.selectedAddress;
			const getArbitraryFee = await this.getArbitraryFee();
			const feeAmount = getArbitraryFee.fee;

			let newObject = {...data};

			for (const key of Object.keys(newObject.customData || {})) {
				if (key.includes('-private')) {
					const toBase64 = await objectToBase64(newObject.customData[key]);
					const encryptedData = encryptDataGroup({
						data64: toBase64,
						publicKeys: [],
					});
					newObject['customData'][key] = encryptedData;
				} else {
					newObject['customData'][key] = data[key];
				}
			}

			const newObjectToBase64 = await objectToBase64(newObject);
			// const encryptedData = encryptDataGroup({
			// 	data64: newObjectToBase64,
			// 	publicKeys: [],
			// });

			const worker = new WebWorker2();
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
					feeAmount: feeAmount,
				});

				this.resourceExists = true;
				this.profileData = data
				// this.setValues(newObject, {
				// 	updated: Date.now(),
				// });
				worker.terminate();
			} catch (error) {
				worker.terminate();
			}
		} catch (error) {
			console.log({ error });
			throw new Error(error.message)
		} finally {
			this.isSaving = false;
		}
	}

	_updateTempSettingsData() {
		this.valuesToBeSavedOnQdn = JSON.parse(
			localStorage.getItem('temp-settings-data') || '{}'
		);
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener(
			'temp-settings-data-event',
			this._updateTempSettingsData
		);
	}

	disconnectedCallback() {
		window.removeEventListener(
			'temp-settings-data-event',
			this._updateTempSettingsData
		);
		super.disconnectedCallback();
	}

	onClose() {
		this.isOpenProfileModalUpdate = false;
		this.editContent = null
	}
	render() {
		console.log('sup profile2', {profileData: this.profileData});
		return html`
			${this.isSaving ||
			(!this.error && this.resourceExists === undefined)
				? html`
						<paper-spinner-lite
							active
							style="display: block; margin: 0 auto;"
						></paper-spinner-lite>
				  `
				: !this.name
				? html`
						<mwc-icon
							id="profile-icon"
							class=${Object.values(this.valuesToBeSavedOnQdn)
								.length > 0 || this.resourceExists === false
								? 'active'
								: 'notActive'}
							@click=${() => {
								const target = this.shadowRoot.getElementById(
									'popover-notification'
								);
								const popover =
									this.shadowRoot.querySelector(
										'popover-component'
									);
								if (popover) {
									popover.openPopover(target);
								}
							}}
							style="user-select:none;cursor:pointer"
							>account_circle</mwc-icon
						>
						<vaadin-tooltip
							for="profile-icon"
							position="bottom"
							hover-delay=${300}
							hide-delay=${1}
							text=${this.error
								? get('save.saving1')
								: Object.values(this.valuesToBeSavedOnQdn)
										.length > 0 ||
								  this.resourceExists === false
								? get('save.saving3')
								: get('save.saving2')}
						>
						</vaadin-tooltip>
						<popover-component for="profile-icon" message="">
							<div style="margin-bottom:20px">
								<p style="margin:10px 0px; font-size:16px">
									${`${get('profile.profile1')}`}
								</p>
							</div>
							<div
								style="display:flex;justify-content:center;gap:10px"
							>
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
													pluginNumber:
														'plugin-qCmtXAQmtu',
													menus: [],
													parent: false,
												},
												openExisting: true,
											})
										);
										const popover =
											this.shadowRoot.querySelector(
												'popover-component'
											);
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
						<div
							style="user-select:none;cursor:pointer;opacity:0.5"
			
						>
							<avatar-component
								.resource=${{
									name: this.name,
									service: 'THUMBNAIL',
									identifier: 'qortal_avatar',
								}}
								name=${this.name}
							></avatar-component>
						</div>
				  ` : html`
						<div
							style="user-select:none;cursor:pointer"
							@click=${() => {
								if(this.resourceExists && this.profileData){
									this.editContent = this.profileData
								} else if(this.resourceExists && !this.profileData){
									return
								}
								this.isOpenProfileModalUpdate =
									!this.isOpenProfileModalUpdate;
							}}
						>
							<avatar-component
								.resource=${{
									name: this.name,
									service: 'THUMBNAIL',
									identifier: 'qortal_avatar',
								}}
								name=${this.name}
							></avatar-component>
						</div>
				  `}

			<profile-modal-update
				?isOpen=${this.isOpenProfileModalUpdate}
				.setIsOpen=${(val) => {
					this.isOpenProfileModalUpdate = val;
				}}
				.onSubmit=${this.saveToQdn}
				.editContent=${this.editContent}
				.onClose=${() => this.onClose()}
			></profile-modal-update>
		`;
	}
}

customElements.define('profile-qdn', ProfileQdn);
