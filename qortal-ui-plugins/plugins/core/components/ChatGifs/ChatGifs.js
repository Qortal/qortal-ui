import {LitElement, html, css} from 'lit';
import {render} from 'lit/html.js';
import {Epml} from '../../../../epml.js';
import * as zip from '@zip.js/zip.js';
import {saveAs} from 'file-saver';
import '@material/mwc-icon';
import ShortUniqueId from 'short-unique-id';
import {publishData} from '../../../utils/publish-image.js';
import {translate, get} from 'lit-translate';
import {gifExplorerStyles} from './ChatGifs-css.js';
import './ChatGifsExplore.js';
import '@vaadin/tooltip';

const parentEpml = new Epml({type: 'WINDOW', source: window.parent});

class ChatGifs extends LitElement {
static get properties() {
return {
selectedAddress: {type: Object},
myGifCollections: {type: Array},
mySubscribedCollections: {type: Array},
exploreCollections: {type: Array},
gifsToBeAdded: {type: Array},
webWorkerImage: {type: Object},
mode: {type: String},
currentCollection: {type: String},
isLoading: {type: String},
newCollectionName: {type: String},
editor: {type: Object},
};
}

    static styles = [gifExplorerStyles];

    constructor() {
    	super();
    	this.uid = new ShortUniqueId();
    	this.selectedAddress =
    		window.parent.reduxStore.getState().app.selectedAddress;
    	this.myGifCollections = [];
    	this.mySubscribedCollections = [];
    	this.exploreCollections = [];
    	this.myAccountName = '';
    	this.gifsToBeAdded = [];
    	// mode can be 'myCollection', 'newCollection', 'explore', 'subscribedCollection'
    	this.mode = 'myCollection';
    	this.currentCollection = null;
    	this.pageNumber = 0;
    	this.isLoading = false;
    	this.newCollectionName = '';
    }

    async structureCollections(gifCollections) {
    	try {
    		const myNode =
    			window.parent.reduxStore.getState().app.nodeConfig.knownNodes[
    				window.parent.reduxStore.getState().app.nodeConfig.node
    			];
    		const nodeUrl =
    			myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
    		const getMetaDataGifs = (gifCollections || []).map(
    			async (collection) => {
    				let collectionObj = collection;
    				try {
    					const metaData = await parentEpml.request('apiCall', {
    						url: `/arbitrary/metadata/GIF_REPOSITORY/${this.myAccountName}/${collection.identifier}`,
    					});

							console.log({metaData});

    					collectionObj = {
    						...collection,
    						gifUrls: [],
    					};
    					if (metaData.files) {
    						const metaDataArray = metaData.files.map((data) => {
    							return `${nodeUrl}/arbitrary/GIF_REPOSITORY/${this.myAccountName}/${collection.identifier}?filepath=${data}`;
    						});

    						collectionObj = {
    							...collection,
    							gifUrls: metaDataArray,
    						};
    					}
    				} catch (error) {
    					console.log(error);
    				}

    				return collectionObj;
    			}
    		);
    		return await Promise.all(getMetaDataGifs);
    	} catch (error) {}
    }

    async getMoreExploreGifs() {
    	try {
    		const getAllGifCollections = await parentEpml.request('apiCall', {
    			type: 'api',
    			url: `/arbitrary/resources?service=GIF_REPOSITORY&limit=20&offset=${
    				this.pageNumber * 20
    			}`,
    		});

    		const gifCollectionWithMetaData = await this.structureCollections(
    			getAllGifCollections
    		);
    		this.exploreCollections = [
    			...this.exploreCollections,
    			...gifCollectionWithMetaData,
    		];

    		this.pageNumber = this.pageNumber + 1;
    	} catch (error) {
    		console.error(error);
    	}
    }

    async getCollectionList() {
    	try {
    		return await parentEpml.request('apiCall', {
    			type: 'api',
    			url: `/lists/gifSubscribedRepos`,
    		});
    	} catch (error) {}
    }

    async addCollectionToList(collection) {
    	try {
    		const body = {
    			items: [collection],
    		};

    		const bodyToString = JSON.stringify(body);
    		await parentEpml.request('apiCall', {
    			type: 'api',
    			method: 'POST',
    			url: `/lists/gifSubscribedRepos`,
    			body: bodyToString,
    			headers: {
    				'Content-Type': 'application/json',
    			},
    		});
    	} catch (error) {}
    }

    async removeCollectionFromList(collection) {
    	try {
    		const body = {
    			items: [collection],
    		};
    		const bodyToString = JSON.stringify(body);
    		await parentEpml.request('apiCall', {
    			type: 'api',
    			method: 'DELETE',
    			url: `/lists/gifSubscribedRepos`,
    			body: bodyToString,
    			headers: {
    				'Content-Type': 'application/json',
    			},
    		});
    	} catch (error) {}
    }

    async getMyGifCollections() {
    	const userName = await this.getName(this.selectedAddress.address);
    	this.myAccountName = userName;
    	if (this.myAccountName) {
    		const getMyGifCollections = await parentEpml.request('apiCall', {
    			url: `/arbitrary/resources?service=GIF_REPOSITORY&limit=0&name=${this.myAccountName}`,
    		});
    		const gifCollectionWithMetaData = await this.structureCollections(
    			getMyGifCollections
    		);

    		console.log({gifCollectionWithMetaData});
    		this.myGifCollections = gifCollectionWithMetaData;
    	}
    }
    async getAllCollections() {
    	this.pageNumber = 0;
    	// for the explore section
    	const getAllGifCollections = await parentEpml.request('apiCall', {
    		type: 'api',
    		url: `/arbitrary/resources?service=GIF_REPOSITORY&limit=20&offset=${
    			this.pageNumber * 20
    		}`,
    	});
    	const gifCollectionWithMetaData = await this.structureCollections(
    		getAllGifCollections
    	);
    	this.exploreCollections = gifCollectionWithMetaData;
    	this.pageNumber = this.pageNumber + 1;
    }

    async getSavedCollections() {
    	const getCollectionList = await this.getCollectionList();
    	let savedCollections = [];
    	const getSavedGifRepos = (getCollectionList || []).map(
    		async (collection) => {
    			let splitCollection = collection.split('/');
    			const name = splitCollection[0];
    			const identifier = splitCollection[1];
    			try {
    				console.log({collection});
    				const data = await parentEpml.request('apiCall', {
    					url: `/arbitrary/resources?service=GIF_REPOSITORY&limit=0&name=${name}&identifier=${identifier}`,
    				});
    				if (data.length > 0) {
    					savedCollections.push(data[0]);
    				}
    			} catch (error) {
    				console.log(error);
    			}
    			return collection;
    		}
    	);
    	await Promise.all(getSavedGifRepos);
    	const savedCollectionsWithMetaData = await this.structureCollections(
    		savedCollections
    	);
    	this.mySubscribedCollections = savedCollectionsWithMetaData;
    }

    async firstUpdated() {
    	const tooltip = this.shadowRoot.querySelector('vaadin-tooltip');
    	const overlay = tooltip.shadowRoot.querySelector(
    		'vaadin-tooltip-overlay'
    	);
    	overlay.shadowRoot.getElementById('overlay').style.cssText =
    		'background-color: transparent; border-radius: 10px; box-shadow: rgb(50 50 93 / 25%) 0px 2px 5px -1px, rgb(0 0 0 / 30%) 0px 1px 3px -1px';
    	overlay.shadowRoot.getElementById('content').style.cssText =
    		'background-color: var(--gif-tooltip-bg); color: var(--chat-bubble-msg-color); text-align: center; padding: 20px 10px; font-family: Roboto, sans-serif; letter-spacing: 0.3px; font-weight: 300; font-size: 13.5px; transition: all 0.3s ease-in-out;';

    	try {
    		this.isLoading = true;
    		await this.getMyGifCollections();
    		await this.getAllCollections();
    		await this.getSavedCollections();
    		this.isLoading = false;
    	} catch (error) {
    		this.isLoading = false;
    		console.error(error);
    	}
    }

    async updated(changedProperties) {
    	console.log({changedProperties});
    	if (changedProperties && changedProperties.has('mode')) {
    		const mode = this.mode;
    		console.log({mode});
    		if (mode === 'myCollection') {
    			try {
    				this.isLoading = true;

    				await this.getMyGifCollections();
    				this.isLoading = false;
    			} catch (error) {
    				this.isLoading = false;
    			}
    		}

    		if (mode === 'explore') {
    			try {
    				this.isLoading = true;

    				await this.getAllCollections();
    				this.isLoading = false;
    			} catch (error) {
    				this.isLoading = false;
    			}
    		}
    		if (mode === 'subscribedCollection') {
    			try {
    				this.isLoading = true;

    				await this.getSavedCollections();
    				this.isLoading = false;
    			} catch (error) {
    				this.isLoading = false;
    			}
    		}
    	}
    }

    async getName(recipient) {
    	try {
    		const getNames = await parentEpml.request('apiCall', {
    			type: 'api',
    			url: `/names/address/${recipient}`,
    		});

    		if (Array.isArray(getNames) && getNames.length > 0) {
    			return getNames[0].name;
    		} else {
    			return '';
    		}
    	} catch (error) {
    		return '';
    	}
    }

    addGifs(gifs) {
    	console.log('gifs', gifs);
    	const mapGifs = gifs.map((file) => {
    		return {
    			file,
    			name: file.name,
    		};
    	});
    	console.log({mapGifs});
    	this.gifsToBeAdded = [...this.gifsToBeAdded, ...mapGifs];
    	console.log('this.gifsToBeAdded', this.gifsToBeAdded);
    }

    async uploadGifCollection() {
    	if (!this.newCollectionName) {
    		parentEpml.request('showSnackBar', get('chatpage.cchange87'));
    		return;
    	}
    	try {
    			this.setGifsLoading(true);
    			this.isLoading = true;
    		const userName = await this.getName(this.selectedAddress.address);
    		const doesNameExist = await parentEpml.request('apiCall', {
    			url: `/arbitrary/resources?service=GIF_REPOSITORY&limit=0&name=${userName}&identifier=${this.newCollectionName}`,
    		});

    		if (doesNameExist.length !== 0) {
    			parentEpml.request('showSnackBar', get('chatpage.cchange87'));
    				this.isLoading = false;
    				this.setGifsLoading(false);
    			return;
    		}
    		function blobToBase64(blob) {
    			return new Promise((resolve, _) => {
    				const reader = new FileReader();
    				reader.onloadend = () => resolve(reader.result);
    				reader.readAsDataURL(blob);
    			});
    		}
    		const zipFileWriter = new zip.BlobWriter('application/zip');
    		// Creates a TextReader object storing the text of the entry to add in the zip
    		// (i.e. "Hello world!").
    		const helloWorldReader = new zip.TextReader('Hello world!');

    		// Creates a ZipWriter object writing data via `zipFileWriter`, adds the entry
    		// "hello.txt" containing the text "Hello world!" via `helloWorldReader`, and
    		// closes the writer.

    		const zipWriter = new zip.ZipWriter(zipFileWriter, {
    			bufferedWrite: true,
    		});

    		for (let i = 0; i < this.gifsToBeAdded.length; i++) {
    			await zipWriter.add(
    				this.gifsToBeAdded[i].name,
    				new zip.BlobReader(this.gifsToBeAdded[i].file)
    			);
    		}

    		await zipWriter.close();
    		const zipFileBlob = await zipFileWriter.getData();
    		const blobTobase = await blobToBase64(zipFileBlob);
    		console.log({blobTobase});

    		if (!userName) {
    			parentEpml.request('showSnackBar', get('chatpage.cchange27'));
    				this.setGifsLoading(false);
    			this.isLoading = false;
    			return;
    		}
    		const id = this.uid();
    		const identifier = `gif_${id}`;
    		await publishData({
    			registeredName: userName,
    			file: blobTobase.split(',')[1],
    			service: 'GIF_REPOSITORY',
    			identifier: this.newCollectionName,
    			parentEpml,
    			metaData: `title=${this.newCollectionName}`,
    			uploadType: 'zip',
    			selectedAddress: this.selectedAddress,
    			worker: this.webWorkerImage,
    			isBase64: true,
    		});

    		await new Promise((res) => {
    			let interval = null;
    			let stop = false;
    			const getAnswer = async () => {
    				if (!stop) {
    					stop = true;
    					try {
    						let myCollection = await parentEpml.request(
    							'apiCall',
    							{
    								url: `/arbitrary/resources?service=GIF_REPOSITORY&limit=0&name=${userName}&identifier=${this.newCollectionName}`,
    							}
    						);
    						if (myCollection.length > 0) {
    							clearInterval(interval);
    							res();
    						}
    					} catch (error) {}
    					stop = false;
    				}
    			};
    			interval = setInterval(getAnswer, 5000);
    		});
    		// saveAs(zipFileBlob, 'zipfile');
    			this.isLoading = false;
    			this.setGifsLoading(false);
					this.mode = 'myCollection';
					this.gifsToBeAdded = [];
					this.newCollectionName = '';
    			parentEpml.request('showSnackBar', get('chatpage.cchange89'));
    		console.log({zipFileBlob});
    	} catch (error) {
    		console.log(error);
    	}
    }

    setCurrentCollection(val) {
    	this.currentCollection = val;
    }

    clearGifSelections() {
    	this.mode = 'myCollection';
    	this.gifsToBeAdded = [];
    }

    render() {
    	console.log('this.currentCollection', this.currentCollection);
    	console.log(13, 'chat gifs here');
    	return html`
                <div class="gifs-container">
                <div class="gif-explorer-container">
                    <vaadin-icon
                        style=${
    											this.mode === 'newCollection'
    												? 'display: none;'
    												: 'display: block;'
    										}
                        id="create-collection-button"
                        class="create-collections-icon"
                        @click=${() => {
    						if (this.isLoading) return;
    						this.mode = 'newCollection';
    					}}
                        icon="vaadin:plus"
                        slot="icon">
                    </vaadin-icon>
                <div class="title-row">
                    <p class="gif-explorer-title">${translate(
    					'chatpage.cchange80'
    				)}</p>
                    <vaadin-icon
                        style=${
    						this.mode === 'newCollection'
    							? 'display: none'
    							: 'display: block'
    					}
                        id="explore-collections-icon"
                        class="explore-collections-icon"
                        @click=${() => {
    						if (this.isLoading) return;
    						this.mode = 'explore';
    					}}
                        icon="vaadin:search"
                        slot="icon">
                    </vaadin-icon>
                    <vaadin-tooltip
                        for="explore-collections-icon"
                        position="top"
                        hover-delay=${400}
                        hide-delay=${1}
                        text=${get('chatpage.cchange81')}>
                    </vaadin-tooltip>
                </div>
                <div class="collections-button-row" style=${
    				this.mode === 'newCollection'
    					? 'display: none'
    					: 'display: block'
    			}>
                    <div class="collections-button-innerrow">
                <div
                    id="my-collections-button"
                  class=${[
    					'my-collections-button',
    					this.mode === 'myCollection'
    						? 'collections-button-active'
    						: null,
    				].join(' ')}
                  @click=${() => {
    					if (this.isLoading) return;
    					if (this.mode === 'myCollection') return;
    					this.mode = 'myCollection';
    				}}
                >
                  ${translate('chatpage.cchange82')}
                </div>
                <div
                id="subscribed-collections-button"
                  class=${[
    					'subscribed-collections-button',
    					this.mode === 'subscribedCollection'
    						? 'collections-button-active'
    						: null,
    				].join(' ')}
                  @click=${() => {
    					if (this.isLoading) return;
    					if (this.mode === 'subscribedCollection') return;
    					this.mode = 'subscribedCollection';
    				}}
                >
                    ${translate('chatpage.cchange83')}
                </div>
              </div>
            </div>
            <div class="collection-wrapper">
            ${this.mode === 'myCollection' && !this.currentCollection
    				? html`
    						${this.isLoading === true
    							? html`<div class="lds-circle"><div></div></div>`
    							: ''}
    						${this.myGifCollections.map((collection) => {
    							return html`
    								<div @click=${() => {
    											this.currentCollection =
    												collection;
    										}} class='collection-card'>
    										${collection.identifier}
    								</div>
    							`;
    						})}
    				  `
    				: ''
    		}
    					${this.mode === 'subscribedCollection' &&
    				!this.currentCollection
    					? html`
    							${this.isLoading === true
    								? html` <p>Loading...</p> `
    								: ''}
    							${this.mySubscribedCollections.map(
    								(collection) => {
    									return html`
    										<div>
    											<p
    												@click=${() => {
    													this.currentCollection =
    														collection;
    												}}
    											>
    												${collection.identifier}
    											</p>
    										</div>
    									`;
    								}
    							)}
    					  `
    					: ''
    			}
                ${this.mode === 'explore' && !this.currentCollection
    					? html`
    							${this.isLoading === true
    								? html` <p>Loading...</p> `
    								: ''}
    							<chat-gifs-explore
    								currentCollection=${this.currentCollection}
    								.getMoreExploreGifs=${(val) =>
    									this.getMoreExploreGifs(val)}
    								.exploreCollections=${this
    									.exploreCollections}
    								.setCurrentCollection=${(val) =>
    									this.setCurrentCollection(val)}
    							></chat-gifs-explore>
    					  `
    					: ''
    			}
                ${this.currentCollection && this.mode === 'myCollection'
    					? html`
    							<div
										class='collection-back-button'
    								@click=${() => {
    									this.currentCollection = null;
    								}}
    							>
									<vaadin-icon icon='vaadin:arrow-left' slot='icon'></vaadin-icon>
    								${translate('general.back')}
    							</div>
    							${this.currentCollection.gifUrls.map((gif) => {
    								console.log({gif});

    								return html`
    									<img
    										onerror=${(e) => {
    											e.target.src = gif;
    										}}
    										src=${gif}
    										style="width: 50px; height: 50px"
    									/>
    								`;
    							})}
    					  `
    					: ''
    			}
    			${this.currentCollection &&
    				this.mode === 'subscribedCollection'
    					? html`
    							<button
    								@click=${() => {
    									this.currentCollection = null;
    								}}
    							>
    								Back
    							</button>
    							${this.currentCollection.gifUrls.map((gif) => {
    								console.log({gif});

    								return html`
    									<img
    										onerror=${(e) => {
    											e.target.src = gif;
    										}}
    										src=${gif}
    										style="width: 50px; height: 50px"
    									/>
    								`;
    							})}
    					  `
    					: ''
    			}
    						${this.currentCollection && this.mode === 'explore'
    					? html`
    							<button
    								@click=${() => {
    									this.currentCollection = null;
    								}}
    							>
    								Back
    							</button>
    							<button
    								@click=${() => {
    									this.addCollectionToList(
    										`${this.currentCollection.name}/${this.currentCollection.identifier}`
    									);
    								}}
    							>
    								Subscribe to this collection
    							</button>
    							${this.currentCollection.gifUrls.map((gif) => {
    								console.log({gif});

    								return html`
    									<img
    										onerror=${(e) => {
    											e.target.src = gif;
    										}}
    										src=${gif}
    										style="width: 50px; height: 50px"
    									/>
    								`;
    							})}
    					  `
    					: ''
    			}
    						${this.mode === 'newCollection' && this.isLoading === false
    					? html`
    							<div class="new-collection-row" style=${this.gifsToBeAdded.length === 0 ? "" : "flex: 1;"}>
    								<div class="new-collection-subrow">
    									<p class="new-collection-title">
    										${translate('chatpage.cchange84')}
    									</p>
    									<p class="new-collection-subtitle">
    										${translate('chatpage.cchange85')}
    									</p>
    								</div>
    								<div
    									@click=${() =>
    										this.shadowRoot
    											.getElementById(
    												'file-picker-gif'
    											)
    											.click()}
    									class="new-collection-container"
    										style=${this.gifsToBeAdded.length > 0 ? "padding: 10px 0;" : "padding: 60px 0;"}
    								>
    									<vaadin-icon
    										id="new-collection-icon"
    										class="new-collection-icon"
    										icon="vaadin:folder"
    										slot="icon"
    									>
    									</vaadin-icon>
    									<input
    										@change="${(e) => {
    											this.addGifs(
    												Array.from(e.target.files)
    											);
    											const filePickerInput =
    												this.shadowRoot.getElementById(
    													'file-picker-gif'
    												);
    											if (filePickerInput) {
    												filePickerInput.value = '';
    											}
    										}}"
    										id="file-picker-gif"
    										?multiple=${true}
    										type="file"
    										name="myGif"
    										accept="image/gif"
    										style=${'display: none;'}
    									/>
    								</div>

    								<input
    											class="upload-collection-name"
    										style=${this.gifsToBeAdded.length === 0 ? "display: none;" : "display: block;"}
    											placeholder=${get("chatpage.cchange88")}
    									.value=${this.newCollectionName}
    									@change=${(e) => {
    										this.newCollectionName =
    											e.target.value;
    									}}
    								/>
    								<div
    									class="gifs-added-col"
    										
    								>
    									<div class="gifs-added-row">
    									${this.gifsToBeAdded.map((gif, i) => {
    										return html`
    											<div class="gif-input">
    												<img
    														class="gif-input-img"
    													src=${URL.createObjectURL(
    														gif.file
    													)}
    												/>
    												<input
    														class="gif-input-field"
    													.value=${gif.name}
    													@change=${(e) => {
    														this.gifsToBeAdded[i] = {
    															...gif,
    															name: e.target
    																.value,
    														};
    													}}
    												/>
    											</div>
    										`;
    									})}
    									</div>
    								<div class="upload-collection-row">
    									<button
    										class="upload-back-button"
    										@click=${() => {
    											this.mode = 'myCollection';
    											this.gifsToBeAdded = [];
    										}}
    									>
    										${translate('general.back')}
    									</button>
    									<button
												style=${this.gifsToBeAdded.length === 0 ? "display: none;" : "display: block;"}
    										class="upload-button"
    										@click=${() => {
    											this.uploadGifCollection();
    										}}
    									>
    										${translate('chatpage.cchange86')}
    									</button>
    								</div>
    								</div>
    							</div>
    					  `
    					: this.mode === 'newCollection' && this.isLoading === true ? (
    							html`
    								<div>
    									<p class='gifs-loading-message'>${translate("chatpage.cchange90")}</p>
    								<div class="lds-circle"><div></div></div>
    								</div>
    								`
    						)
    						: ''
    			}
                </div>
            </div>
        </div>
    </div>
        `;
    }

}

window.customElements.define('chat-gifs', ChatGifs);
