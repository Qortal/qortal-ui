import {html, LitElement} from 'lit';
import {Epml} from '../../../../epml.js';
import * as zip from '@zip.js/zip.js';
import '@material/mwc-icon';
import ShortUniqueId from 'short-unique-id';
import {publishData} from '../../../utils/publish-image.js';
import {gifExplorerStyles} from './ChatGifs-css.js';
import {bytesToMegabytes} from '../../../utils/bytesToMegabytes.js';
import './ChatGifsExplore.js';
import '../ImageComponent.js';
import '@vaadin/tooltip';
import {get, translate} from '../../../../../core/translate'

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
isSubscribed: { type: Boolean },
setGifsLoading: { attribute: false },
sendMessage: { attribute: false },
setOpenGifModal: { attribute: false }
};
}

    static styles = [gifExplorerStyles];

    constructor() {
    	super();
    	this.uid = new ShortUniqueId();
    	this.selectedAddress = window.parent.reduxStore.getState().app.selectedAddress;
    	this.myGifCollections = [];
    	this.mySubscribedCollections = [];
    	this.exploreCollections = [];
    	this.myAccountName = '';
    	this.gifsToBeAdded = [];
    	this.mode = 'myCollection';
    	this.currentCollection = null;
    	this.pageNumber = 0;
    	this.isLoading = false;
    	this.isSubscribed = false;
    	this.newCollectionName = '';
			this.getAllCollections = this.getAllCollections.bind(this);
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
					const myCollections = await this.getMyGifCollections();
					const savedCollections = await this.getSavedCollections();
					const allCollections = await this.getAllCollections();

					if (!Array.isArray(myCollections) && !Array.isArray(savedCollections)) {
						parentEpml.request('showSnackBar', get('gifs.gchange12'));
						return;
					}

					await new Promise((res) => {
						setTimeout(() => {
							res();
						}, 1000)
					});
					this.myGifCollections = myCollections;
					this.mySubscribedCollections = savedCollections;
					this.exploreCollections = allCollections;
			} catch (error) {
				console.error(error);
			} finally {
				this.isLoading = false;
			}
		}

		async updated(changedProperties) {
			if (changedProperties && changedProperties.has('mode')) {
				const mode = this.mode;
				if (mode === 'myCollection') {
					try {
						this.myGifCollections = [];
						this.isLoading = true;
							const collections = await this.getMyGifCollections();
							await new Promise((res) => {
								setTimeout(() => {
									res();
								}, 1000)
							});
							this.myGifCollections = collections;
					} catch (error) {
						console.error(error);
					} finally {
						this.isLoading = false;
					}
				}

				if (mode === 'explore') {
					try {
						this.exploreCollections = [];
						this.isLoading = true;
						const allCollections = await this.getAllCollections();
						await new Promise((res) => {
							setTimeout(() => {
								res();
							}, 1000)
						});
						this.exploreCollections = allCollections;
					} catch (error) {
						console.error(error);
					} finally {
						this.isLoading = false;
					}
				}
				if (mode === 'subscribedCollection') {
					try {
							this.mySubscribedCollections = [];
							this.isLoading = true;
							const savedCollections = await this.getSavedCollections();
							await new Promise((res) => {
								setTimeout(() => {
									res();
								}, 1000)
							});
							this.mySubscribedCollections = savedCollections;
					} catch (error) {
						console.error(error);
					} finally {
						this.isLoading = false;
					}
				}
			}

			if (changedProperties && changedProperties.has('currentCollection')) {
				if (this.mode === 'explore') {
					const subbedCollection = this.mySubscribedCollections.find((collection) => ((collection.name === this.currentCollection.name) && (collection.identifier === this.currentCollection.identifier)));
					this.isSubscribed = !!subbedCollection;
				}
			}
		}

    async structureCollections(gifCollections) {
			const userName = await this.getName(this.selectedAddress.address);
			if (!userName) {
				return;
			}
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
    						url: `/arbitrary/metadata/GIF_REPOSITORY/${collection.name}/${collection.identifier}?apiKey=${this.getApiKey()}`,
    					});

    					collectionObj = {
    						...collection,
    						gifUrls: [],
    					};
    					if (metaData.files) {
    						const metaDataArray = metaData.files.map((data) => {
    							return {
									url: `${nodeUrl}/arbitrary/GIF_REPOSITORY/${collection.name}/${collection.identifier}?filepath=${data}&apiKey=${this.getApiKey()}`,
									filePath: data,
									identifier: collection.identifier,
									name: collection.name
								};
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

	getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
		return myNode.apiKey;
    }

    async getMoreExploreGifs() {
    	try {
    		const getAllGifCollections = await parentEpml.request('apiCall', {
    			type: 'api',
    			url: `/arbitrary/resources?service=GIF_REPOSITORY&limit=20&offset=${
    				this.pageNumber * 20
    			}&apiKey=${this.getApiKey()}`,
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
    			url: `/lists/gifSubscribedRepos?apiKey=${this.getApiKey()}`,
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
    			url: `/lists/gifSubscribedRepos?apiKey=${this.getApiKey()}`,
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
    			url: `/lists/gifSubscribedRepos?apiKey=${this.getApiKey()}`,
    			body: bodyToString,
    			headers: {
    				'Content-Type': 'application/json',
    			},
    		});
    	} catch (error) {}
    }

    async getMyGifCollections() {
		this.myAccountName = await this.getName(this.selectedAddress.address);
    	if (this.myAccountName) {
    		const getMyGifCollections = await parentEpml.request('apiCall', {
    			url: `/arbitrary/resources/search?service=GIF_REPOSITORY&query=${this.myAccountName}&apiKey=${this.getApiKey()}`,
    		});
			return await this.structureCollections(
				getMyGifCollections
			);
    	} else {
				return [];
			}
    }

    async getAllCollections() {
    	this.pageNumber = 0;
    	// for the explore section
    	const getAllGifCollections = await parentEpml.request('apiCall', {
    		type: 'api',
    		url: `/arbitrary/resources?service=GIF_REPOSITORY&limit=20&offset=${
    			this.pageNumber * 20
    		}&apiKey=${this.getApiKey()}`,
    	});
    	const gifCollectionWithMetaData = await this.structureCollections(
    		getAllGifCollections
    	);
    	this.pageNumber = this.pageNumber + 1;
    	return gifCollectionWithMetaData;
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
    				const data = await parentEpml.request('apiCall', {
    					url: `/arbitrary/metadata/GIF_REPOSITORY/${name}/${identifier}?apiKey=${this.getApiKey()}`,
    				});
    				if (data.title) {
    					savedCollections.push({
							identifier,
							name,
							service: 'GIF_REPOSITORY'
						});
    				}
    			} catch (error) {
    				console.log(error);
    			}
    			return collection;
    		}
    	);
    	await Promise.all(getSavedGifRepos);
		return await this.structureCollections(
			savedCollections
		);
    }

    async getName(recipient) {
    	try {
    		const getNames = await parentEpml.request('apiCall', {
    			type: 'api',
    			url: `/names/address/${recipient}?apiKey=${this.getApiKey()}`,
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

		removeDotGIF(arr) {
			return arr.map(obj => {
				const newObj = { ...obj };
				if (newObj.hasOwnProperty('name') && newObj.name.endsWith('.gif')) {
					newObj.name = newObj.name.slice(0, -4);
				}
				return newObj;
			});
		}

		addDotGIF(arr) {
			return arr.map(obj => {
				const newObj = { ...obj };
				if (newObj.hasOwnProperty('name') && !newObj.name.endsWith('.gif')) {
					newObj.name += '.gif';
				}
				return newObj;
			});
		}

    addGifs(gifs) {
    	const mapGifs = gifs.map((file) => {
    		return {
    			file,
    			name: file.name,
					size: file.size
    		};
    	});
			const removedExtensions = this.removeDotGIF(mapGifs);
    	this.gifsToBeAdded = [...this.gifsToBeAdded, ...removedExtensions];
    }

    async uploadGifCollection() {
    	if (!this.newCollectionName) {
    		parentEpml.request('showSnackBar', get('gifs.gchange8'));
    		return;
    	}
    	try {
    			this.setGifsLoading(true);
    			this.isLoading = true;
					const userName = await this.getName(this.selectedAddress.address);
					const doesNameExist = await parentEpml.request('apiCall', {
    			url: `/arbitrary/metadata/GIF_REPOSITORY/${userName}/${this.newCollectionName}?apiKey=${this.getApiKey()}`,
    		});

				if (!userName) {
    			parentEpml.request('showSnackBar', get('chatpage.cchange27'));
					this.setGifsLoading(false);
    			this.isLoading = false;
    			return;
    		}

    		if (doesNameExist.title) {
    			parentEpml.request('showSnackBar', get('gifs.gchange24'));
					this.isLoading = false;
					this.setGifsLoading(false);
    			return;
    		}

				 function validateGifSizes(gifs) {
					const maxSizeInMB = 0.7;
					const invalidGifs = [];

					for (let i = 0; i < gifs.length; i++) {
						const gif = gifs[i];
						const gifSize = gif.size;

						const gifSizeMB = bytesToMegabytes(gifSize);

						if (gifSizeMB > maxSizeInMB) {
							invalidGifs.push(gif);
						}
					}

					return invalidGifs.length <= 0;
				}

				let validatedSize = validateGifSizes(this.gifsToBeAdded);

				if (!validatedSize) {
					parentEpml.request('showSnackBar', get('gifs.gchange28'));
					this.isLoading = false;
					this.setGifsLoading(false);
					return;
				}

				function validateDuplicateGifNames(arr) {
					let names = [];
					for (let i = 0; i < arr.length; i++) {
							if (names.includes(arr[i].name)) {
									return false;
							}
							names.push(arr[i].name);
					}
					return true;
			}

			let validatedNames = validateDuplicateGifNames(this.gifsToBeAdded);

			if (!validatedNames) {
				parentEpml.request('showSnackBar', get('gifs.gchange23'));
				this.isLoading = false;
				this.setGifsLoading(false);
				return;
			}

			const addedGifExtensionsArr = this.addDotGIF(this.gifsToBeAdded);

    		function blobToBase64(blob) {
    			return new Promise((resolve, _) => {
    				const reader = new FileReader();
    				reader.onloadend = () => resolve(reader.result);
    				reader.readAsDataURL(blob);
    			});
    		}
    		const zipFileWriter = new zip.BlobWriter('application/zip');

    		const zipWriter = new zip.ZipWriter(zipFileWriter, {
    			bufferedWrite: true,
    		});

    		for (let i = 0; i < addedGifExtensionsArr.length; i++) {
    			await zipWriter.add(
    				addedGifExtensionsArr[i].name,
    				new zip.BlobReader(addedGifExtensionsArr[i].file)
    			);
    		}

    		await zipWriter.close();

    		const zipFileBlob = await zipFileWriter.getData();

				const zipSize = bytesToMegabytes(zipFileBlob.size);

				if (zipSize > 10) {
					parentEpml.request('showSnackBar', get('gifs.gchange27'));
					this.isLoading = false;
					this.setGifsLoading(false);
					return;
				}

    		const blobTobase = await blobToBase64(zipFileBlob);

    		await publishData({
    			registeredName: userName,
    			file: blobTobase.split(',')[1],
    			service: 'GIF_REPOSITORY',
    			identifier: this.newCollectionName,
    			parentEpml,
				title: this.newCollectionName,
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
    								url: `/arbitrary/metadata/GIF_REPOSITORY/${userName}/${this.newCollectionName}?apiKey=${this.getApiKey()}`,
    							}
    						);
    						if (myCollection.title) {
    							clearInterval(interval);
    							res();
    						}
    					} catch (error) {
								console.error(error);
								this.isLoading = false;
								this.setGifsLoading(false);
								this.mode = 'myCollection';
								this.gifsToBeAdded = [];
								this.newCollectionName = '';
								parentEpml.request('showSnackBar', get('gifs.gchange12'));
							}
    					stop = false;
    				}
    			};
    			interval = setInterval(getAnswer, 5000);
    		});

				this.isLoading = false;
				this.setGifsLoading(false);
				this.mode = 'myCollection';
				this.gifsToBeAdded = [];
				this.newCollectionName = '';
				parentEpml.request('showSnackBar', get('gifs.gchange10'));
				} catch (error) {
    		console.log(error);
				parentEpml.request('showSnackBar', get('gifs.gchange12'));
				this.setGifsLoading(false);
    			this.isLoading = false;
    	}
    }

    setCurrentCollection(val) {
    	this.currentCollection = val;
    }

    clearGifSelections() {
    	this.mode = 'myCollection';
    	this.gifsToBeAdded = [];
    }

		async subscribeToCollection() {
			await this.addCollectionToList(
				`${this.currentCollection.name}/${this.currentCollection.identifier}`
			);
			parentEpml.request('showSnackBar', get('gifs.gchange20'));
			this.isSubscribed = true;
			this.mySubscribedCollections = await this.getSavedCollections();
		}

		async unsubscribeToCollection() {
			await this.removeCollectionFromList(
				`${this.currentCollection.name}/${this.currentCollection.identifier}`
			);
			parentEpml.request('showSnackBar', get('gifs.gchange21'));
			this.isSubscribed = false;
			this.mySubscribedCollections = await this.getSavedCollections();
		}

    render() {
    	return html`
                <div class="gifs-container">
                <div class="gif-explorer-container">
                    <vaadin-icon
                        style=${
    											(this.mode === 'newCollection' ||
													(this.mode === 'explore' && this.currentCollection))
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
									<div
											style=${((this.currentCollection && (this.mode === 'myCollection' || this.mode === 'subscribedCollection')) || this.mode === 'explore') ? "visibility: visible;" : "visibility: hidden;"}
    									class='collection-back-button'
    								@click=${() => {
											if (this.mode === 'explore' && !this.currentCollection) {
												this.mode = 'myCollection';
												this.currentCollection = null;
											} else if (this.mode === 'explore' && this.currentCollection) {
												this.mode = 'explore';
												this.currentCollection = null;
												this.isSubscribed = false;
											} else {
												this.currentCollection = null;
											}
    								}}
    							>
    								<vaadin-icon class='collection-back-button-arrow' icon='vaadin:arrow-left' slot='icon'></vaadin-icon>
    							</div>
                    <p class="gif-explorer-title">
											${translate(
												'gifs.gchange1'
											)}
										</p>
                    <vaadin-icon
                        style=${
    						(this.mode === 'newCollection' || this.mode === 'explore')
    							? 'display: none'
    							: 'display: block'
    					}
                        id="explore-collections-icon"
                        class="explore-collections-icon"
                        @click=${() => {
												if (this.isLoading) return;
												this.mode = 'explore';
												this.currentCollection = null;
											}}
                        icon="vaadin:search"
                        slot="icon">
                    </vaadin-icon>
                    <vaadin-tooltip
                        for="explore-collections-icon"
                        position="top"
                        hover-delay=${400}
                        hide-delay=${1}
                        text=${get('gifs.gchange2')}>
                    </vaadin-tooltip>
                </div>
                <div
								class="collections-button-row"
								style=${(this.mode === 'newCollection' || this.mode === 'explore')
								? 'display: none' : 'display: block'}>
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
    						this.currentCollection = null;
							}}>
                  ${translate('gifs.gchange3')}
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
    						this.currentCollection = null;
    				}}
                >
                    ${translate('gifs.gchange4')}
                </div>
              </div>
            </div>
            <div class="collection-wrapper">
            ${this.mode === 'myCollection' && !this.currentCollection
    				? html`
    						${this.isLoading === true
    							? html`<div class="lds-circle"><div></div></div>`
    							: ''}
    							${(this.myGifCollections.length === 0 && !this.isLoading) ? (
    								html`
    								<div class='no-collections'>${translate('gifs.gchange13')}</div>
    								`
    							) : (
    								html`
    								${(this.myGifCollections || []).map((collection) => {
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
    							)}
    				  `
    				: ''
    		}
    				${this.mode === 'subscribedCollection' &&
    				!this.currentCollection
    					? html`
    							${this.isLoading === true
    								? html`<div class="lds-circle"><div></div></div>`
    								: ''}
    								  ${(this.mySubscribedCollections.length === 0 && !this.isLoading) ? (
    								html`
    								<div class='no-collections'>${translate('gifs.gchange14')}</div>
    								`
    							) : (
    									html`
    									${this.mySubscribedCollections.map(
    										(collection) => {
    											return html`
    													<div @click=${() => {
    													this.currentCollection =
    														collection;
    												}} class='collection-card'>
    													${collection.identifier}
    												</div>
    											`;
    										}
    									)}
    									`
    								)}
    					  `
    					: ''
    			}
                ${this.mode === 'explore' && !this.currentCollection
    						? html`
    							${this.isLoading === true
    								? html`
										<div class="lds-circle"><div></div></div>
										`
    								: html`
										<chat-gifs-explore
    								currentCollection=${this.currentCollection}
    								.getAllCollections=${(val) =>
    									this.getAllCollections(val)}
    								.getMoreExploreGifs=${(val) =>
    									this.getMoreExploreGifs(val)}
    								.exploreCollections=${this
    									.exploreCollections}
    								.setCurrentCollection=${(val) =>
    									this.setCurrentCollection(val)}
    							></chat-gifs-explore>
									`
								}
    					  `
    					: ''
    			}
                ${this.currentCollection && this.mode === 'myCollection'
    					? html`
    								<div class='collection-gifs'>
											${this.currentCollection.gifUrls.map((gif) => {
												return html`
													<image-component
														.sendMessage=${(val) => this.sendMessage(val)}
														.setOpenGifModal=${(val) => this.setOpenGifModal(val)}
														.class=${'gif-image'}
														.gif=${gif}
														.alt=${'gif-image'}>
														</image-component>
												`;
											})}
    								</div>
    					  `
    					: ''
    			}
    			${this.currentCollection &&
    				this.mode === 'subscribedCollection'
    					? html`
    								<div class='collection-gifs'>
    							${this.currentCollection.gifUrls.map((gif) => {
    								return html`
												<image-component
													.sendMessage=${(val) => this.sendMessage(val)}
													.setOpenGifModal=${(val) => this.setOpenGifModal(val)}
													.class=${'gif-image'}
													.gif=${gif}
													.alt=${'gif-image'}>
													</image-component>
    								`;
    							})}
    								</div>
    					  `
    					: ''
    			}
    						${this.currentCollection && this.mode === 'explore'
    						? html`
									<div class="collection-gifs">
    							${this.currentCollection.gifUrls.map((gif) => {
    								return html`
											<image-component
												.sendMessage=${(val) => this.sendMessage(val)}
												.setOpenGifModal=${(val) => this.setOpenGifModal(val)}
												.class=${'gif-image'}
												.gif=${gif}
												.alt=${'gif-image'}>
												</image-component>
    								`;
    							})}
									</div>
									${this.isSubscribed ? (
										html`
										<button
											class='unsubscribe-button'
											@click=${this.unsubscribeToCollection}>
											${translate('gifs.gchange22')}
    							</button>
										`
									) : (
										html`
										<button
											class='subscribe-button'
											@click=${this.subscribeToCollection}
										>
											${translate('gifs.gchange17')}
										</button>
										`
									)}
    					  `
    					: ''
    			}
    						${this.mode === 'newCollection' && this.isLoading === false
    					? html`
    							<div class="new-collection-row" style=${this.gifsToBeAdded.length === 0 ? "" : "flex: 1;"}>
    								<div class="new-collection-subrow">
    									<p class="new-collection-title">
    										${translate('gifs.gchange5')}
    									</p>
    									<p class="new-collection-subtitle">
    										${translate('gifs.gchange6')}
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
    											placeholder=${get("gifs.gchange9")}
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
    										${translate('gifs.gchange7')}
    									</button>
    								</div>
    								</div>
    							</div>
    					  `
    					: this.mode === 'newCollection' && this.isLoading === true ? (
    							html`
    								<div>
    									<p class='gifs-loading-message'>${translate("gifs.gchange11")}</p>
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

window.customElements.define('chat-gifs', ChatGifs)
