import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../epml.js'
import * as zip from "@zip.js/zip.js";
import { saveAs } from 'file-saver';
import '@material/mwc-icon'
import ShortUniqueId from 'short-unique-id';
import { publishData } from '../../utils/publish-image.js';

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ChatGifs extends LitElement {
    static get properties() {
        return {
            selectedAddress: { type: Object },
            myGifCollections: { type: Array },
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
        this.myAccountName = ''
        this.gifsToBeAdded = []
        // mode can be 'myCollection', 'newCollection', 'explore', 'subscribedCollection'
        this.mode = "myCollection"
        this.currentCollection = null
    }

    async firstUpdated() {
       

        try {
            const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
            const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
            const userName = await this.getName(this.selectedAddress.address);
            this.myAccountName = userName
            if(this.myAccountName){
                const getMyGifColloctions =  await parentEpml.request('apiCall', {
                    url: `/arbitrary/resources?service=GIF_REPOSITORY&limit=0&name=${this.myAccountName}`
                })

            
                const getMetaDataGifs = (getMyGifColloctions || []).map(async (collection) => {
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
                            const listOfGifs = [`${nodeUrl}/arbitrary/GIF_REPOSITORY/Phil/gif_pmBEwm?filepath=giphy (1).gif`, `${nodeUrl}/arbitrary/GIF_REPOSITORY/Phil/gif_pmBEwm?filepath=giphy (3).gif`]
                            
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
                const gifCollectionWithMetaData =  await Promise.all(getMetaDataGifs)
                console.log({gifCollectionWithMetaData})
                this.myGifCollections = gifCollectionWithMetaData
            }
            
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
                        ${this.currentCollection ? html`
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
