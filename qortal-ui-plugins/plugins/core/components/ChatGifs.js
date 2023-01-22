import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../epml.js'
import * as zip from "@zip.js/zip.js";
import { saveAs } from 'file-saver';
import '@material/mwc-icon'
import ShortUniqueId from 'short-unique-id';
import { publishData } from '../../utils/publish-image.js';
import './ChatGifsExplore'
const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ChatGifs extends LitElement {
    static get properties() {
        return {
            selectedAddress: { type: Object },
            myGifCollections: { type: Array },
            exploreCollections: { type: Array },
            gifsToBeAdded: { type: Array},
            webWorkerImage: {type: Object},
            mode: {type: String},
            currentCollection: {type: String}
        }
    }

    static get styles() {
        return css`
           
        `
    }

    constructor() {
        super()
        this.uid = new ShortUniqueId()
        this.selectedAddress = window.parent.reduxStore.getState().app.selectedAddress
        this.myGifCollections = []
        this.exploreCollections = []
        this.myAccountName = ''
        this.gifsToBeAdded = []
        // mode can be 'myCollection', 'newCollection', 'explore', 'subscribedCollection'
        this.mode = "myCollection"
        this.currentCollection = null
        this.pageNumber = 1
        this.downObserverElement = ''
        this.viewElement = ''
    }

   async structureCollections(gifCollections){
    try {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
        const getMetaDataGifs = (gifCollections || []).map(async (collection) => {
            let collectionObj = collection
            try {
              const metaData =  await parentEpml.request('apiCall', {
                    url: `/arbitrary/metadata/GIF_REPOSITORY/${this.myAccountName}/${collection.identifier}`
                })

                collectionObj = {
                    ...collection,
                    gifUrls: []
                }
                if(metaData.description){
                    const metaDataArray = metaData.description.split(';').map((data)=> {
                        return `${nodeUrl}/arbitrary/GIF_REPOSITORY/${this.myAccountName}/${collection.identifier}?filepath=${data}`
                    })
                
                    
                   collectionObj = {
                        ...collection,
                        gifUrls: metaDataArray
                    }
                   
                }   

               
                
            } catch (error) {
                console.log(error)
            }
    
            return collectionObj
        })
        return  await Promise.all(getMetaDataGifs)
    } catch (error) {
        
    }
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

    async getMoreExploreGifs(){
        try {
      
            const getAllGifCollections = await parentEpml.request("apiCall", {
                type: "api",
                url: `/arbitrary/resources?service=GIF_REPOSITORY&limit=20&offset=${this.pageNumber * 20}`,
            });

            const gifCollectionWithMetaData = await this.structureCollections(getAllGifCollections)
            this.exploreCollections = [...this.exploreCollections, ...gifCollectionWithMetaData]

            this.pageNumber = this.pageNumber + 1
        } catch (error) {
          console.error(error)
        }
    }

    async getCollectionList(){
        try {
            await parentEpml.request("apiCall", {
                type: "api",
                url: `/lists/gifSubscribedRepos`,
            });
           
        } catch (error) {
            
        }
    }

    async addCollectionToList(collection){
        try {
      
            const body = {
				
                "items": [
                    collection
                ]
              
        }
        const bodyToString = JSON.stringify(body)
          await parentEpml.request("apiCall", {
            type: "api",
            method: "POST",
            url: `/lists/gifSubscribedRepos`,
            body: bodyToString,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        } catch (error) {
            
        }
    }

    async removeCollectionFromList(collection){
        try {
      
            const body = {
				
                "items": [
                    collection
                ]
              
        }
        const bodyToString = JSON.stringify(body)
          await parentEpml.request("apiCall", {
            type: "api",
            method: 'DELETE',
            url: `/lists/gifSubscribedRepos`,
            body: bodyToString,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        } catch (error) {
            
        }
    }

    async firstUpdated() {
        this.viewElement = this.shadowRoot.getElementById('viewElement');
        this.downObserverElement = this.shadowRoot.getElementById('downObserver');
        this.elementObserver();

        try {
          
            const userName = await this.getName(this.selectedAddress.address);
            this.myAccountName = userName
            if(this.myAccountName){
                const getMyGifColloctions =  await parentEpml.request('apiCall', {
                    url: `/arbitrary/resources?service=GIF_REPOSITORY&limit=0&name=${this.myAccountName}`
                })

                const gifCollectionWithMetaData = await this.structureCollections(getMyGifColloctions)
                
                console.log({gifCollectionWithMetaData})
                this.myGifCollections = gifCollectionWithMetaData
            }
            // for the explore section
            const getAllGifCollections = await parentEpml.request("apiCall", {
                type: "api",
                url: `/arbitrary/resources?service=GIF_REPOSITORY&limit=20&offset=${this.pageNumber * 20}`,
            });
            console.log({getAllGifCollections})
            const gifCollectionWithMetaData = await this.structureCollections(getAllGifCollections)
            this.exploreCollections = gifCollectionWithMetaData
            this.pageNumber = this.pageNumber + 1

            const getCollectionList = await this.getCollectionList()

            let savedCollections = []

            const getSavedGifRepos = (!Array.isArray(getCollectionList) || []).map(async (collection) => {
                let collectionObj = collection
                try {
                  const data =  await parentEpml.request('apiCall', {
                        url: `/arbitrary/GIF_REPOSITORY/collection`
                    })
                    savedCollections.push(data)

                } catch (error) {
                    console.log(error)
                }
        
                return collectionObj
            })
          await Promise.all(getSavedGifRepos)

            console.log({savedCollections})

        } catch (error) {
            
        }
    }

    async getName (recipient) {
        try {
            const getNames = await parentEpml.request("apiCall", {
                type: "api",
                url: `/names/address/${recipient}`,
            });

            if (Array.isArray(getNames) && getNames.length > 0 ) {
                return getNames[0].name
            } else {
                return ''
            }

        } catch (error) {
            return ""
        }
    }

    addGifs(gifs){
        console.log('gifs', gifs)
        const mapGifs = gifs.map((file)=> {
            return {
                file,
                name: file.name
            }
        })
        console.log({mapGifs})
        this.gifsToBeAdded = [...this.gifsToBeAdded, ...mapGifs]
        console.log('this.gifsToBeAdded', this.gifsToBeAdded)
    }

    async uploadGifCollection(){
        try {
            function blobToBase64(blob) {
                return new Promise((resolve, _) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result);
                  reader.readAsDataURL(blob);
                });
              }
            const zipFileWriter = new zip.BlobWriter("application/zip");
// Creates a TextReader object storing the text of the entry to add in the zip
// (i.e. "Hello world!").
const helloWorldReader = new zip.TextReader("Hello world!");

// Creates a ZipWriter object writing data via `zipFileWriter`, adds the entry
// "hello.txt" containing the text "Hello world!" via `helloWorldReader`, and
// closes the writer.

const zipWriter = new zip.ZipWriter(zipFileWriter, { bufferedWrite: true });


for (let i = 0;  i < this.gifsToBeAdded.length;  i++) {
    await zipWriter.add(this.gifsToBeAdded[i].name, new zip.BlobReader(this.gifsToBeAdded[i].file));
  }


await zipWriter.close();
const zipFileBlob = await zipFileWriter.getData()
const blobTobase = await blobToBase64(zipFileBlob)
console.log({blobTobase})
const userName = await this.getName(this.selectedAddress.address);
            if (!userName) {
                parentEpml.request('showSnackBar', get("chatpage.cchange27"));
                this.isLoading = false;
                return;
            }
            const id = this.uid();
            const identifier = `gif_${id}`;
await publishData({
    registeredName: userName,
    file : blobTobase.split(',')[1],
    service: 'GIF_REPOSITORY',
    identifier: identifier,
    parentEpml,
    metaData: undefined,
    uploadType: 'zip',
    selectedAddress: this.selectedAddress,
    worker: this.webWorkerImage,
    isBase64: true,
    metaData: `description=${this.gifsToBeAdded.map((gif)=> gif.name).join(';')}`
   })
saveAs(zipFileBlob, 'zipfile');
console.log({zipFileBlob})
        } catch (error) {
            console.log(error)
        }
    }

    setCurrentCollection(val){
        this.currentCollection = val
    }

    render() {

        return html`
             <div>
                        <div class="dialog-container">
                            <button @click=${()=> {
                                this.mode = "newCollection"
                            }}>Create Collection</button>
                            <button @click=${()=> {
                                this.mode = "myCollection"
                            }}>My collections</button>
                            <button @click=${()=> {
                                this.mode = "subscribedCollection"
                            }}>Subscribed to collections</button>
                            <button @click=${()=> {
                                this.mode = "explore"
                            }}>Explore collections</button>
                         

${this.mode === "myCollection" && !this.currentCollection ? html`
                        ${this.myGifCollections.map((collection)=> {
                                return html`
                                <div>
                                <p @click=${()=> {
                                    this.currentCollection = collection
                                }}>${collection.identifier}</p>
                                
                                </div>
                                `
                            })}
                        ` : ''}
                        ${this.mode === "explore" && !this.currentCollection ? html`
                        <chat-gifs-explore currentCollection=${this.currentCollection} .getMoreExploreGifs=${(val)=> this.getMoreExploreGifs(val)} .exploreCollections=${this.exploreCollections}
                        .setCurrentCollection=${(val)=> this.setCurrentCollection(val)}
                        ></chat-gifs-explore>
                        
                        ` : ''}
                        ${this.currentCollection && this.mode === "myCollection" ? html`
                        <button @click=${()=> {
                                    this.currentCollection = null
                                }}>Back</button>
                        ${this.currentCollection.gifUrls.map((gif)=> {
                                    console.log({gif})

                                  return html`
                                    <img onerror=${(e)=> {
                                        e.target.src = gif
                                    }} src=${gif} style="width: 50px; height: 50px" />
                                   `
                                })}
                        ` : ''}
                        ${this.currentCollection && this.mode === "explore" ? html`
                        <button @click=${()=> {
                                    this.currentCollection = null
                                }}>Back</button>
                          <button @click=${()=> {
                                    this.currentCollection = null
                                }}>Subscribe to this collection</button>
                        ${this.currentCollection.gifUrls.map((gif)=> {
                                    console.log({gif})

                                  return html`
                                    <img onerror=${(e)=> {
                                        e.target.src = gif
                                    }} src=${gif} style="width: 50px; height: 50px" />
                                   `
                                })}
                        ` : ''}
                        ${this.mode === "newCollection" ? html`
                        <input 
                            @change="${e => {
                                this.addGifs(Array.from(e.target.files));
                                const filePickerInput = this.shadowRoot.getElementById('file-picker-gif') 
                                if(filePickerInput){
                                    filePickerInput.value = ""
                                }
                                    }
                                }"
                            id="file-picker-gif"
                            ?multiple=${true}
                            class="file-picker-input-gif" type="file" name="myGif" accept="image/gif" />

                                <button @click=${()=> {
                                    this.uploadGifCollection()
                                }}>Upload Collection</button>
                            <div style="display: flex; flex-direction: column">
                            ${this.gifsToBeAdded.map((gif, i)=> {
                                console.log({gif})
                                return html`
                                <div style="display: flex">
                                <img  src=${URL.createObjectURL(gif.file)} style="width: 50px; height: 50px" />
                                <input .value=${gif.name} @change=${(e=> {
                                    this.gifsToBeAdded[i] = {
                                        ...gif,
                                        name: e.target.value
                                    } 
                                })} />
                                </div>
                                
                                `
                            })}
                            </div>
                        ` : ''}
                        
                        </div>
                </div>  
        `
    }

    
}

window.customElements.define('chat-gifs', ChatGifs)
