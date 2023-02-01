import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../../epml.js'
import * as zip from "@zip.js/zip.js";
import { saveAs } from 'file-saver';
import '@material/mwc-icon'
import ShortUniqueId from 'short-unique-id';
import { publishData } from '../../../utils/publish-image.js';

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ChatGifsExplore extends LitElement {
    static get properties() {
        return {
            currentCollection: {type: String},
            getMoreExploreGifs: {attribute: false},
            exploreCollections: {type: Array},
            setCurrentCollection: {attribute: false}
        }
    }

    static get styles() {
        return css`
           
        `
    }

    constructor() {
        super()
        this.downObserverElement = ''
        this.viewElement = ''
        this.exploreCollections = []
    }



    elementObserver() {
        const options = {
            root: this.viewElement,
            rootMargin: '0px',
            threshold: 1
        }
        // identify an element to observe
        const elementToObserve = this.downObserverElement;
        // passing it a callback function
        const observer = new IntersectionObserver(this.observerHandler, options);
        // call `observe()` on that MutationObserver instance,
        // passing it the element to observe, and the options object
        observer.observe(elementToObserve);
    }

    observerHandler(entries) {
        if (!entries[0].isIntersecting) {
            return
        } else {
            if(this.exploreCollections.length < 20){
                return
            }
 
            this.getMoreExploreGifs()
        }
    }



    async firstUpdated() {
        this.viewElement = this.shadowRoot.getElementById('viewElement');
        this.downObserverElement = this.shadowRoot.getElementById('downObserver');
        this.elementObserver();
    }

  

    render() {

        return html`
                        <div id="viewElement" class="container-body">
                        ${this.exploreCollections.map((collection)=> {
                                return html`
                                <div>
                                <p @click=${()=> {
                                    this.setCurrentCollection(collection)
                                }}>${collection.identifier}</p>
                                
                                </div>
                                `
                            })}
                            <div id='downObserver'></div>
                        </div>
                       
        `
    }

    
}

window.customElements.define('chat-gifs-explore', ChatGifsExplore)
