import { LitElement, html, css } from 'lit';
import { Epml } from '../../../../epml.js';
import { chatGifsExploreStyles } from './ChatGifsExplore-css.js';
import { translate, get } from 'lit-translate';
import '@material/mwc-icon';

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent });

class ChatGifsExplore extends LitElement {
static get properties() {
return {
currentCollection: { type: String },
searchCollectionName: {type: String},
getMoreExploreGifs: { attribute: false },
exploreCollections: { type: Array },
setCurrentCollection: { attribute: false },
};
}

    static styles = [chatGifsExploreStyles];

    constructor() {
    	super();
			this.searchCollectionName = '';
    	this.downObserverElement = '';
    	this.viewElement = '';
    	this.exploreCollections = [];
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
    		return;
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

    render() {
    	console.log(6, "chat-gifs-explore-here");
    	return html`
    		<div id="viewElement" class="container-body">
    		<input
    		class="search-collection-name"
    		placeholder=${get("chatpage.cchange88")}
    		.value=${this.searchCollectionName}
    		@change=${(e) => {
    			this.searchCollectionName =
    				e.target.value;
    		}}
    	/>
			<div class='collection-wrapper'>
    			${this.exploreCollections.map((collection) => {
    			return html`
    					<div class='collection-card' @click=${() => {
    								this.setCurrentCollection(collection);
    						}}>
    							${collection.identifier}
    					</div>
    				`;
    	})}
			</div>
    			<div id="downObserver"></div>
    		</div>
    	`;
    }

}

window.customElements.define('chat-gifs-explore', ChatGifsExplore);
