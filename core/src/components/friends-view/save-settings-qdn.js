import { LitElement, html, css } from 'lit';
import '@material/mwc-icon';
import './friends-side-panel.js';
import { connect } from 'pwa-helpers';
import { store } from '../../store.js';
import WebWorker from 'web-worker:./computePowWorkerFile.src.js'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/tooltip';
import {
	get
} from 'lit-translate';
import { decryptGroupData, encryptDataGroup, objectToBase64, uint8ArrayToBase64, uint8ArrayToObject } from '../../../../plugins/plugins/core/components/qdn-action-encryption.js';
import { publishData } from '../../../../plugins/plugins/utils/publish-image.js';
import { parentEpml } from '../show-plugin.js';

class SaveSettingsQdn  extends connect(store)(LitElement) {
	static get properties() {
		return {
			isOpen: {type: Boolean},
			syncPercentage: {type: Number},
			settingsRawData: {type: Object},
			valuesToBeSavedOnQdn: {type: Object},
			resourceExists: {type: Boolean},
			isSaving: {type: Boolean}
		};
	}
	

	constructor() {
		super();
		this.isOpen = false
		this.getGeneralSettingsQdn = this.getGeneralSettingsQdn.bind(this)
		this._updateTempSettingsData = this._updateTempSettingsData.bind(this)
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
			color: var(--black)
		}
		.active {
			opacity: 1;
			cursor: pointer;
			color: green;
		}
	`;

getNodeUrl(){
    const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]

    const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
    return nodeUrl
}
getMyNode(){
  const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]

  return myNode
}

async getRawData (dataItem){
	const url = `${this.nodeUrl}/arbitrary/${dataItem.service}/${dataItem.name}/${dataItem.identifier}?encoding=base64`;
	const res = await fetch(url)
	const data = await res.text()
	if(data.error) throw new Error('Cannot retrieve your data from qdn')
	const decryptedData = decryptGroupData(data)
	const decryptedDataToBase64 = uint8ArrayToObject(decryptedData)
	return decryptedDataToBase64
}

async setValues(response, resource){
	this.settingsRawData = response
	const rawDataTimestamp = resource.updated
	
	const tempSettingsData = JSON.parse(localStorage.getItem('temp-settings-data') || "{}")
	if(tempSettingsData){

	}
	const userLists = response.userLists || []
	const friendsFeed = response.friendsFeed

	this.valuesToBeSavedOnQdn = {}
	if(userLists.length > 0 && (!tempSettingsData.userLists || (tempSettingsData.userLists && (tempSettingsData.userLists.timestamp < rawDataTimestamp)))){
		const friendList = userLists[0]
		localStorage.setItem('friends-my-friend-list', JSON.stringify(friendList));
		this.dispatchEvent(
			new CustomEvent('friends-my-friend-list-event', {
			  bubbles: true,
			  composed: true,
			  detail: friendList,
			}),
		  );
	} else if(tempSettingsData.userLists && tempSettingsData.userLists.timestamp > rawDataTimestamp){
		this.valuesToBeSavedOnQdn = {
			...this.valuesToBeSavedOnQdn,
			userLists: {
				data: tempSettingsData.userLists.data
			}
		}
	}

	if(friendsFeed && (!tempSettingsData.friendsFeed || ( tempSettingsData.friendsFeed && (tempSettingsData.friendsFeed.timestamp < rawDataTimestamp)))){
		localStorage.setItem('friends-my-selected-feeds', JSON.stringify(friendsFeed));
		this.dispatchEvent(
			new CustomEvent('friends-my-selected-feeds-event', {
			  bubbles: true,
			  composed: true,
			  detail: friendsFeed,
			}),
		  );
	} else if(tempSettingsData.friendsFeed && tempSettingsData.friendsFeed.timestamp > rawDataTimestamp){
		this.valuesToBeSavedOnQdn = {
			...this.valuesToBeSavedOnQdn,
			friendsFeed: {
				data: tempSettingsData.friendsFeed.data
			}
		}
	}
}

async getGeneralSettingsQdn(){
	try {
		this.hasAttemptedToFetchResource = true
		let resource
		const name = "palmas"
		this.error = ''
				const url = `${this.nodeUrl}/arbitrary/resources/search?service=DOCUMENT_PRIVATE&identifier=qortal_general_settings&name=${name}&prefix=true&exactmatchnames=true&excludeblocked=true&limit=20`
				const res = await fetch(url)
				let data = ''
				try {
					data = await res.json()
					if(Array.isArray(data)){
						data = data.filter((item)=> item.identifier === 'qortal_general_settings')

						if(data.length > 0){

							this.resourceExists = true
							const dataItem = data[0]
							try {
								const response = await this.getRawData(dataItem)
								console.log({response})
								if(response.version){
									this.setValues(response, dataItem)
								} else {
									this.error = "Cannot get saved user settings"
								}
							} catch (error) {
								console.log({error})
								this.error = "Cannot get saved user settings"
							}
						} else {
							this.resourceExists = false
						}
					} else {
						this.error = "Unable to perform query"
					}
				} catch (error) {
					data = {
						error: 'No resource found'
					}
				}

		if(resource){
			this.hasRetrievedResource = true
		}
	} catch (error) {
		console.log({error})

	}
}



stateChanged(state) {
	if(state.app.nodeStatus && state.app.nodeStatus.syncPercent !== this.syncPercentage){
		this.syncPercentage = state.app.nodeStatus.syncPercent

		if(!this.hasAttemptedToFetchResource && state.app.nodeStatus.syncPercent === 100){
			console.log('hello')
			this.getGeneralSettingsQdn()
		}

	}
}

async getArbitraryFee (){
	const timestamp = Date.now()
	const url = `${this.nodeUrl}/transactions/unitfee?txType=ARBITRARY&timestamp=${timestamp}`
	const response = await fetch(url)
	if (!response.ok) {
		throw new Error('Error when fetching arbitrary fee');
	}
	const data = await response.json()
	const arbitraryFee = (Number(data) / 1e8).toFixed(8)
	return {
		timestamp,
		fee : Number(data),
		feeToShow: arbitraryFee
	}
}

async saveToQdn(){
	try {
		this.isSaving = true
		if(this.resourceExists === true && this.error) throw new Error('Unable to save')
		
			console.log('info', store.getState())
			const nameObject = store.getState().app.accountInfo.names[0]
			if(!nameObject) throw new Error('no name')
			const name = nameObject.name
			console.log({name})
			const identifer = 'qortal_general_settings'
			const filename = 'qortal_general_settings.json'
			const selectedAddress = store.getState().app.selectedAddress
			console.log({selectedAddress})
			const getArbitraryFee = await this.getArbitraryFee()
			const feeAmount = getArbitraryFee.fee
			console.log({feeAmount})
			const friendsList = JSON.parse(localStorage.getItem('friends-my-friend-list') || "[]")
			const friendsFeed = JSON.parse(localStorage.getItem('friends-my-selected-feeds') || "[]")
			
			let newObject 

			if(this.resourceExists === false){
				 newObject = {
					version: 1,
					userLists: [friendsList],
					friendsFeed
				}
			} else if(this.settingsRawData) {
				const tempSettingsData= JSON.parse(localStorage.getItem('temp-settings-data') || "{}")
				console.log({tempSettingsData})
				newObject = {
					...this.settingsRawData,
				}
				for (const key in tempSettingsData) {
					if (tempSettingsData[key].hasOwnProperty('data')) {
						newObject[key] = tempSettingsData[key].data;
					}
				}
				
			}
			
			console.log({newObject})
			const newObjectToBase64 = await objectToBase64(newObject);
			console.log({newObjectToBase64})
			const encryptedData =  encryptDataGroup({data64: newObjectToBase64, publicKeys: []})
			
			console.log({encryptedData})
			const worker = new WebWorker();
						try {
							const resPublish = await publishData({
								registeredName: encodeURIComponent(name),
								file: encryptedData,
								service: 'DOCUMENT_PRIVATE',
								identifier: encodeURIComponent(identifer),
								parentEpml: parentEpml,
								uploadType: 'file',
								selectedAddress: selectedAddress,
								worker: worker,
								isBase64: true,
								filename: filename,
								apiVersion: 2,
								withFee:  true,
								feeAmount: feeAmount
							});

							this.resourceExists = true
							this.setValues(newObject, {
								updated: Date.now()
							})
							localStorage.setItem('temp-settings-data', JSON.stringify({}));
							this.valuesToBeSavedOnQdn = {}
							worker.terminate();
						} catch (error) {
							worker.terminate();
							
						} 

		
		
	} catch (error) {
		console.log({error})
	} finally {
		this.isSaving = false
	}
}

_updateTempSettingsData(){
	this.valuesToBeSavedOnQdn = JSON.parse(localStorage.getItem('temp-settings-data') || "{}")

}

connectedCallback() {
	super.connectedCallback()
	console.log('callback')
	window.addEventListener('temp-settings-data-event', this._updateTempSettingsData)	
}

disconnectedCallback() {
	window.removeEventListener('temp-settings-data-event', this._updateTempSettingsData)
	super.disconnectedCallback()
}
	render() {
		console.log('this.resourceExists', this.resourceExists)
		return html`
		${this.isSaving || (!this.error && this.resourceExists === undefined) ? html`
		<paper-spinner-lite active style="display: block; margin: 0 auto;"></paper-spinner-lite>

		` : html`
		<mwc-icon id="save-icon" class=${Object.values(this.valuesToBeSavedOnQdn).length > 0 || this.resourceExists === false ? 'active' : 'notActive'} @click=${()=> {
				if(Object.values(this.valuesToBeSavedOnQdn).length > 0 || this.resourceExists === false ){
					this.saveToQdn()
				}
				// this.isOpen = !this.isOpen
			}} style="user-select:none"
				>save</mwc-icon
			>
			<vaadin-tooltip
			  for="save-icon"
			  position="bottom"
			  hover-delay=${300}
			  hide-delay=${1}
			  text=${this.error ? get('save.saving1') : Object.values(this.valuesToBeSavedOnQdn).length > 0 || this.resourceExists === false ? get('save.saving3') :  get('save.saving2')}>
		  </vaadin-tooltip>
		`}
			
			
			
		`;
	}


}

customElements.define('save-settings-qdn', SaveSettingsQdn);
