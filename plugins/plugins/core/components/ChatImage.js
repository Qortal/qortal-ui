import { LitElement, html, css } from 'lit';
import { render } from 'lit/html.js';
import {
  use,
  get,
  translate,
  translateUnsafeHTML,
  registerTranslateConfig,
} from 'lit-translate';
import axios from 'axios'
import { RequestQueueWithPromise } from '../../utils/queue';

const requestQueue = new RequestQueueWithPromise(5);

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
      img {
        max-width:45vh; 
        max-height:40vh; 
        border-radius: 5px; 
        cursor: pointer;
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

    const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
    return nodeUrl
}
getMyNode(){
  const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]

  return myNode
}

  getApiKey() {
    const myNode =
      window.parent.reduxStore.getState().app.nodeConfig.knownNodes[
      window.parent.reduxStore.getState().app.nodeConfig.node
      ];
    let apiKey = myNode.apiKey;
    return apiKey;
  }

   async fetchResource() {
    try {
      // await qortalRequest({
      //   action: 'GET_QDN_RESOURCE_PROPERTIES',
      //   name,
      //   service,
      //   identifier
      // })
      await axios.get(`${this.nodeUrl}/arbitrary/resource/properties/${this.resource.service}/${this.resource.name}/${this.resource.identifier}?apiKey=${this.myNode.apiKey}`)


    } catch (error) {}
  }

 async fetchVideoUrl() {

      this.fetchResource()
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
              this.fetchResource({
                name,
                service,
                identifier
              })
            }, 25000)
            return
          }
          percentLoaded = res.percentLoaded
        }
   
        this.status = res
        
      }

      // check if progress is 100% and clear interval if true
      if (res?.status === 'READY') {
        clearInterval(intervalId)
        this.status = res
        this.isReady = true
      }
    }, 5000) // 1 second interval
  }

  async _fetchImage() {
    try {
      this.fetchVideoUrl({
       name: this.resource.name,
       service: this.resource.service,
       identifier: this.resource.identifier
      })
      this.fetchStatus()
    } catch (error) {
      
    }
  }

  firstUpdated(){
    this.observer.observe(this);

  }

  shouldUpdate(changedProperties) {
		if (changedProperties.has('setOpenDialogImage') && changedProperties.size === 1) {
			return false;
		}

    return true
  }
  async updated(changedProperties) {
		if (changedProperties && changedProperties.has('status')) {
      if(this.hasCalledWhenDownloaded === false && this.status.status === 'DOWNLOADED'){
        this.fetchResource()
        this.hasCalledWhenDownloaded = true
      }
    }
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
                            <p>${`${Math.round(this.status.percentLoaded || 0
                        ).toFixed(0)}% loaded`}</p>
													</div>
											  `
											: ''
									}
    ${this.status.status === 'READY' ? html`
      <img @click=${()=> this.setOpenDialogImage(true)} src=${this.url} />
    ` : ''}

                </div>
    `
    
    
  }
}

customElements.define('chat-image', ChatImage);
