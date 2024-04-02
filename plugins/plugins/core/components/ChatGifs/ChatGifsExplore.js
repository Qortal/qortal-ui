import {html, LitElement} from 'lit'
import {Epml} from '../../../../epml.js'
import {chatGifsExploreStyles} from './ChatGifsExplore-css.js'
import {get, translate} from '../../../../../core/translate'
import '@material/mwc-icon'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent });

class ChatGifsExplore extends LitElement {
		static get properties() {
		return {
			currentCollection: { type: String },
			searchCollectionName: {type: String},
			getMoreExploreGifs: { attribute: false },
			exploreCollections: { type: Array },
			setCurrentCollection: { attribute: false },
			isLoading: { type: Boolean },
			isSearched: { type: Boolean },
			getAllCollections: { attribute: false }
		};
	}

    static styles = [chatGifsExploreStyles];

    constructor() {
    	super();
			this.searchCollectionName = '';
    	this.downObserverElement = '';
    	this.viewElement = '';
    	this.exploreCollections = [];
			this.isLoading = false;
			this.isSearched = false;
    }

    elementObserver() {
    	const options = {
    		root: this.viewElement,
    		rootMargin: '0px',
    		threshold: 1,
    	};
    	// identify an element to observe
    	const elementToObserve = this.downObserverElement;
    	// passing it a callback function
    	const observer = new IntersectionObserver(
    		this.observerHandler,
    		options
    	);
    	// call `observe()` on that MutationObserver instance,
    	// passing it the element to observe, and the options object
    	observer.observe(elementToObserve);
    }

    observerHandler(entries) {
    	if (!entries[0].isIntersecting) {

    	} else {
    		if (this.exploreCollections.length < 20) {
    			return;
    		}

    		this.getMoreExploreGifs();
    	}
    }

    async firstUpdated() {
    	this.viewElement = this.shadowRoot.getElementById('viewElement');
    	this.downObserverElement =
    		this.shadowRoot.getElementById('downObserver');
    	this.elementObserver();
    }
	getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.apiKey
    }

		async searchCollections() {
			this.isSearched = true;
			try {
				this.exploreCollections = [];
				this.isLoading = true;
				const response = await parentEpml.request('apiCall', {
					url: `/arbitrary/resources/search?service=GIF_REPOSITORY&query=${this.searchCollectionName}&limit=0&apiKey=${this.getApiKey()}
					`,
				});
				await new Promise((res) => {
					setTimeout(() => {
						res();
					}, 1000)
				});
				this.exploreCollections = response;
			} catch (error) {
				console.error(error);
			} finally {
				this.isLoading = false;
			}
		}

    render() {
    	return html`
    		<div id='viewElement' class='container-body'>
    			<div class='search-collection-wrapper'>
    				<input
    				class='search-collection-name'
    				placeholder=${get('gifs.gchange9')}
    				.value=${this.searchCollectionName}
    				@change=${(e) => {
    					this.searchCollectionName =
    						e.target.value;
    				}}
    				@keyup=${async (e) => {
    					if (e.key === 'Enter' && this.searchCollectionName) {
    						await this.searchCollections()
    					}
    				}}
    			/>
					${this.isSearched ? (
						html`
						<vaadin-icon
							class='clear-search-icon'
							@click=${async () => {
								if (this.isLoading) return;
								this.exploreCollections = await this.getAllCollections();
								this.searchCollectionName = '';
								this.isSearched = false;
								}}
							icon='vaadin:close-small'
							slot='icon'>
						</vaadin-icon>
						`
					) : html`
						<vaadin-icon
							class='explore-collections-icon'
							@click=${async () => {
								if (this.isLoading || !this.searchCollectionName) return;
									await this.searchCollections();
								}}
							icon='vaadin:search'
							slot='icon'>
						</vaadin-icon>
					`}
    		</div>
    		<div class='collection-wrapper'>
					${this.isLoading ? html`
						<div style=${'margin-top: 10px;'}>
						<p class='gifs-loading-message'>${translate('gifs.gchange18')}
						</p>
						<div class='lds-circle'><div></div></div>
					</div>`
					: this.isSearched && this.exploreCollections.length === 0 ? (
						html`<p style=${'margin-top: 10px;'} class='gifs-loading-message'>${translate('gifs.gchange19')}</p>`
					) : (
    			html`${this.exploreCollections.map((collection) => {
    			return html`
    					<div class='collection-card' @click=${() => {
    								this.setCurrentCollection(collection);
    						}}>
    							${collection.identifier}
    					</div>
    				`;
    			})}`
					)}
    		</div>
    			<div id='downObserver'></div>
    		</div>
    	`;
    }

}

window.customElements.define('chat-gifs-explore', ChatGifsExplore)
