import {css, html, LitElement} from 'lit';
import {get, translate,} from '../../../../core/translate'
import axios from 'axios'
import {RequestQueueWithPromise} from '../../utils/queue';
import '@material/mwc-menu';
import '@material/mwc-list/mwc-list-item.js'
import {Epml} from '../../../epml';

const requestQueue = new RequestQueueWithPromise(5);
const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

export class ChatImage extends LitElement {
  static get properties() {
    return {
      resource: { type: Object },
      isReady: { type: Boolean},
      status: {type: Object},
      setOpenDialogImage: { attribute: false}
    };
  }

  static get styles() {
    return css`
    * {
      --mdc-theme-text-primary-on-background: var(--black);
    }
      img {
        max-width:45vh;
        max-height:40vh;
        border-radius: 5px;
        cursor: pointer;
        position: relative;
      }
      .smallLoading,
  .smallLoading:after {
      border-radius: 50%;
      width: 2px;
      height: 2px;
  }

  .smallLoading {
      border-width: 0.8em;
      border-style: solid;
      border-color: rgba(3, 169, 244, 0.2) rgba(3, 169, 244, 0.2)
      rgba(3, 169, 244, 0.2) rgb(3, 169, 244);
      font-size: 30px;
      position: relative;
      text-indent: -9999em;
      transform: translateZ(0px);
      animation: 1.1s linear 0s infinite normal none running loadingAnimation;
  }

  .defaultSize {
		width: 45vh;
		height: 40vh;
	}

  mwc-menu {
      position: absolute;
    }




  @-webkit-keyframes loadingAnimation {
      0% {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
      }
      100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
      }
  }

  @keyframes loadingAnimation {
      0% {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
      }
      100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
      }
  }
		`;
  }

  constructor() {
    super();
    this.resource = {
      identifier: "",
      name: "",
      service: ""
    }
    this.status = {
      status: ''
    }
    this.url = ""
    this.isReady = false
    this.nodeUrl = this.getNodeUrl()
    this.myNode = this.getMyNode()
    this.hasCalledWhenDownloaded = false
    this.isFetching = false

    this.observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
          if (entry.isIntersecting && this.status.status !== 'READY') {
              this._fetchImage();
              // Stop observing after the image has started loading
              this.observer.unobserve(this);
          }
      }
  });
  }
  getNodeUrl(){
    const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]

  return myNode.protocol + '://' + myNode.domain + ':' + myNode.port
}
getMyNode(){
	return window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
}

  getApiKey() {
    const myNode =
      window.parent.reduxStore.getState().app.nodeConfig.knownNodes[
      window.parent.reduxStore.getState().app.nodeConfig.node
      ];
	  return myNode.apiKey;
  }

   async fetchResource() {
    try {
      if(this.isFetching) return
      this.isFetching = true
      await axios.get(`${this.nodeUrl}/arbitrary/resource/properties/${this.resource.service}/${this.resource.name}/${this.resource.identifier}?apiKey=${this.myNode.apiKey}`)
      this.isFetching = false

    } catch (error) {
      this.isFetching = false
    }
  }

 async fetchVideoUrl() {

      await this.fetchResource()
      this.url = `${this.nodeUrl}/arbitrary/${this.resource.service}/${this.resource.name}/${this.resource.identifier}?async=true&apiKey=${this.myNode.apiKey}`

  }

  async fetchStatus(){
    let isCalling = false
    let percentLoaded = 0
    let timer = 24
    const response = await axios.get(`${this.nodeUrl}/arbitrary/resource/status/${this.resource.service}/${this.resource.name}/${this.resource.identifier}?apiKey=${this.myNode.apiKey}`)
    if(response && response.data && response.data.status === 'READY'){
      this.status = response.data
      return
    }
    const intervalId = setInterval(async () => {
      if (isCalling) return
      isCalling = true

     const data = await requestQueue.enqueue(() => {
        return  axios.get(`${this.nodeUrl}/arbitrary/resource/status/${this.resource.service}/${this.resource.name}/${this.resource.identifier}?apiKey=${this.myNode.apiKey}`)
      });
      const res = data.data

      isCalling = false
      if (res.localChunkCount) {
        if (res.percentLoaded) {
          if (
            res.percentLoaded === percentLoaded &&
            res.percentLoaded !== 100
          ) {
            timer = timer - 5
          } else {
            timer = 24
          }
          if (timer < 0) {
            timer = 24
            isCalling = true
            this.status = {
              ...res,
              status:  'REFETCHING'
            }

            setTimeout(() => {
              isCalling = false
              this.fetchResource()
            }, 25000)
            return
          }
          percentLoaded = res.percentLoaded
        }

        this.status = res
        if(this.status.status === 'DOWNLOADED'){
          await this.fetchResource()
        }
      }

      // check if progress is 100% and clear interval if true
      if (res.status === 'READY') {
        clearInterval(intervalId)
        this.status = res
        this.isReady = true
      }
    }, 5000) // 1 second interval
  }

  async _fetchImage() {
    try {
      await this.fetchVideoUrl({
		  name: this.resource.name,
		  service: this.resource.service,
		  identifier: this.resource.identifier
	  })
      await this.fetchStatus()
    } catch (error) { /* empty */ }
  }

  firstUpdated(){
    this.observer.observe(this);

  }

  shouldUpdate(changedProperties) {
		return !(changedProperties.has('setOpenDialogImage') && changedProperties.size === 1);


  }



  showContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();

    const contextMenu = this.shadowRoot.getElementById('contextMenu');
    const containerRect = e.currentTarget.getBoundingClientRect();

    // Adjusting the positions
    const adjustedX = e.clientX - containerRect.left;
    const adjustedY = e.clientY - containerRect.top;

    contextMenu.style.top = `${adjustedY}px`;
    contextMenu.style.left = `${adjustedX}px`;

    contextMenu.open = true;
  }





  async handleCopy(e) {
    e.stopPropagation();
    const image = this.shadowRoot.querySelector('img');

    // Create a canvas and draw the image on it.
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    // Convert canvas image to blob
    canvas.toBlob(blob => {
      try {
        const clipboardItem = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([clipboardItem]).then(() => {
          const msg = get("chatpage.cchange93")
          parentEpml.request('showSnackBar', msg)
          console.log('Image copied to clipboard');
        }).catch(err => {
          console.error('Failed to copy image: ', err);
        });
      } catch (error) {
        console.error('Error copying the image: ', error);
      }
    }, 'image/png');
  }




  handleMenuBlur() {
    setTimeout(() => {
        if (!this.isMenuItemClicked) {
            const contextMenu = this.shadowRoot.getElementById('contextMenu');
            contextMenu.open = false;
        }
    }, 100);
}


  render() {

    return html`
    <div
														class=${[
															`image-container`,
															this.status.status !== 'READY'
																? 'defaultSize'
																: '',
															this.status.status !== 'READY'
																? 'hideImg'
																: '',
														].join(' ')}
													>
    ${
										this.status.status !== 'READY'
											? html`
													<div
														style="display:flex;flex-direction:column;width:100%;height:100%;justify-content:center;align-items:center;position:absolute;"
													>
														<div
															class=${`smallLoading`}
														></div>
                            <p style="color: var(--black)">${`${Math.round(this.status.percentLoaded || 0
                        ).toFixed(0)}% `}${translate('chatpage.cchange94')}</p>
													</div>
											  `
											: ''
									}
    ${this.status.status === 'READY' ? html`
    <div class="customContextMenuDiv" @contextmenu="${this.showContextMenu}" style="position:relative">
      <img crossOrigin="anonymous"  @click=${()=> this.setOpenDialogImage(true)} src=${this.url} />
      <mwc-menu id="contextMenu" @blur="${this.handleMenuBlur}">
        <mwc-list-item @click="${this.handleCopy}">Copy</mwc-list-item>
      </mwc-menu>
    </div>
    ` : ''}

                </div>

    `


  }
}

customElements.define('chat-image', ChatImage);
