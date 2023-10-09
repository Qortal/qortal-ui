import { LitElement, html, css } from 'lit';
import {
  get,
  translate,
} from 'lit-translate';
import axios from 'axios'
import '@material/mwc-menu';
import '@material/mwc-list/mwc-list-item.js'
import { RequestQueueWithPromise } from '../../../../plugins/plugins/utils/queue';
const requestQueue = new RequestQueueWithPromise(5);

export class FeedItem extends LitElement {
  static get properties() {
    return {
      resource: { type: Object },
      isReady: { type: Boolean},
      status: {type: Object},
      feedItem: {type: Object}
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
  this.feedItem = null
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
      if(this.isFetching) return
      this.isFetching = true
      await axios.get(`${this.nodeUrl}/arbitrary/resource/properties/${this.resource.service}/${this.resource.name}/${this.resource.identifier}?apiKey=${this.myNode.apiKey}`)
      this.isFetching = false

    } catch (error) {
      this.isFetching = false
    }
  }

 async fetchVideoUrl() {

      this.fetchResource()
      this.url = `${this.nodeUrl}/arbitrary/${this.resource.service}/${this.resource.name}/${this.resource.identifier}?async=true&apiKey=${this.myNode.apiKey}`
     
  }

  async getRawData(){
    const url = `${this.nodeUrl}/arbitrary/${this.resource.service}/${this.resource.name}/${this.resource.identifier}?apiKey=${this.myNode.apiKey}`
    const response2 = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const responseData2 = await response2.json()
    return responseData2
  }
 
   updateDisplayWithPlaceholders(display, resource, rawdata) {
    const pattern = /\$\$\{([a-zA-Z0-9_\.]+)\}\$\$/g;

    for (const key in display) {
        const value = display[key];

        display[key] = value.replace(pattern, (match, p1) => {
            if (p1.startsWith('rawdata.')) {
                const dataKey = p1.split('.')[1];
                if (rawdata[dataKey] === undefined) {
                    console.error("rawdata key not found:", dataKey);
                }
                return rawdata[dataKey] || match; 
            } else if (p1.startsWith('resource.')) {
                const resourceKey = p1.split('.')[1];
                if (resource[resourceKey] === undefined) {
                    console.error("resource key not found:", resourceKey);
                }
                return resource[resourceKey] || match;
            }
            return match;
        });
    }
}




  async fetchStatus(){
    let isCalling = false
    let percentLoaded = 0
    let timer = 24
    const response = await axios.get(`${this.nodeUrl}/arbitrary/resource/status/${this.resource.service}/${this.resource.name}/${this.resource.identifier}?apiKey=${this.myNode.apiKey}`)
    if(response && response.data && response.data.status === 'READY'){
      const rawData = await this.getRawData()
      const object = {
        title: "$${rawdata.title}$$",
      }
      this.updateDisplayWithPlaceholders(object, {},rawData)
      this.feedItem = object
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
          this.fetchResource()
        }
      }

      // check if progress is 100% and clear interval if true
      if (res.status === 'READY') {
     
        this.feedItem = await this.getRawData()
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
    } catch (error) { /* empty */ }
  }

  firstUpdated(){
    this.observer.observe(this);

  }

 

  
  


  

  
  
 
  
 

  render() {
    console.log('this.feedItem', this.feedItem)
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
														style="display:flex;flex-direction:column;width:100%;height:100%;justify-content:center;align-items:center;"
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
    ${this.status.status === 'READY' && this.feedItem ? html`
    <div  style="position:relative">
                  ready
    </div>
    ` : ''}

                </div>
               
    `
    
    
  }
}

customElements.define('feed-item', FeedItem);
