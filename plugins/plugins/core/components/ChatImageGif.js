import { html, LitElement } from 'lit'
import { Epml } from '../../../epml'
import { RequestQueueWithPromise } from '../../utils/classes'
import { chatImageStyles } from './plugins-css'
import axios from 'axios'

// Multi language support
import { get, translate } from '../../../../core/translate'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

const requestQueue = new RequestQueueWithPromise(5)

export class ChatImageGif extends LitElement {
	static get properties() {
		return {
			resource: { type: Object },
			isReady: { type: Boolean },
			status: { type: Object },
			setOpenDialogGif: { attribute: false }
		}
	}

	static get styles() {
		return [chatImageStyles]
	}

	constructor() {
		super();
		this.resource = {
			identifier: '',
			name: '',
			service: ''
		}
		this.status = {
			status: ''
		}
		this.url = ''
		this.isReady = false
		this.nodeUrl = this.getNodeUrl()
		this.myNode = this.getMyNode()
		this.hasCalledWhenDownloaded = false
		this.isFetching = false
		this.observer = new IntersectionObserver(entries => {
			for (const entry of entries) {
				if (entry.isIntersecting && this.status.status !== 'READY') {
					this.fetchGif()
					this.observer.unobserve(this)
				}
			}
		})
	}

	render() {

		return html`
			<div class=${[`image-container`, this.status.status !== 'READY' ? 'defaultSize' : '', this.status.status !== 'READY' ? 'hideImg' : '',].join(' ')}>
    				${this.status.status !== 'READY' ?
					html`
						<div style="display: flex; flex-direction: column; width:100%; height: 100%; justify-content: center; align-items: center; position: absolute;">
							<div class=${`smallLoading`}></div>
                            				<p style="color: var(--black)">${`${Math.round(this.status.percentLoaded || 0).toFixed(0)}% `}${translate('chatpage.cchange94')}</p>
						</div>
					`
					: ''
				}
    				${this.status.status === 'READY' ?
					html`
      						${this.createGif(this.url)}
    					`
					: ''
				}
			</div>
		`
	}

	firstUpdated() {
		this.observer.observe(this)
	}

	createGif(gif) {
		const gifHTMLRes = new Image()
		gifHTMLRes.src = gif
		gifHTMLRes.style = 'max-width:45vh; max-height:40vh; border-radius: 5px; cursor: pointer;'
		gifHTMLRes.onclick = () => {this.setOpenDialogGif(true);}
		gifHTMLRes.onload = () => {this.isGifLoaded = true;}
		gifHTMLRes.onerror = () => {
			if (this.gifFetches < 4) {
				setTimeout(() => {
					this.gifFetches = this.gifFetches + 1
					gifHTMLRes.src = gif
				}, 10000)
			} else {
				gifHTMLRes.src = '/img/chain.png'
				gifHTMLRes.style = 'max-width:45vh; max-height:20vh; border-radius: 5px; filter: opacity(0.5);'
				gifHTMLRes.onclick = () => {}
				this.isGifLoaded = true
			}
		}
		return gifHTMLRes
	}

	getNodeUrl() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		return nodeUrl
	}

	getMyNode() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode
	}

	async fetchResource() {
		try {
			if (this.isFetching) return
			this.isFetching = true
			await axios.get(`${this.nodeUrl}/arbitrary/resource/properties/${this.resource.service}/${this.resource.name}/${this.resource.identifier}`)
			this.isFetching = false
		} catch (error) {
			this.isFetching = false
		}
	}

	async fetchGifUrl() {
		this.fetchResource()
		this.url = `${this.nodeUrl}/arbitrary/${this.resource.service}/${this.resource.name}/${this.resource.identifier}?async=true`
	}

	async fetchStatus() {
		let isCalling = false
		let percentLoaded = 0
		let timer = 24

		const response = await axios.get(`${this.nodeUrl}/arbitrary/resource/status/${this.resource.service}/${this.resource.name}/${this.resource.identifier}`)

		if (response && response.data && response.data.status === 'READY') {
			this.status = response.data
			return
		}

		const intervalId = setInterval(async () => {
			if (isCalling) return

			isCalling = true

			const data = await requestQueue.enqueue(() => {
				return axios.get(`${this.nodeUrl}/arbitrary/resource/status/${this.resource.service}/${this.resource.name}/${this.resource.identifier}`)
			})

			const res = data.data

			isCalling = false

			if (res.localChunkCount) {
				if (res.percentLoaded) {
					if (res.percentLoaded === percentLoaded && res.percentLoaded !== 100) {
						timer = timer - 5
					} else {
						timer = 24
					}

					if (timer < 0) {
						timer = 24

						isCalling = true

						this.status = {
							...res,
							status: 'REFETCHING'
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

				if (this.status.status === 'DOWNLOADED') {
					this.fetchResource()
				}
			}

			// check if progress is 100% and clear interval if true
			if (res.status === 'READY') {
				clearInterval(intervalId)
				this.status = res
				this.isReady = true
			}
		}, 5000) // 5 second interval
	}

	async fetchGif() {
		try {
			this.fetchGifUrl({name: this.resource.name, service: this.resource.service, identifier: this.resource.identifier})
			this.fetchStatus()
		} catch (error) { /* empty */ }
	}

	shouldUpdate(changedProperties) {
		if (changedProperties.has('setOpenDialogGif') && changedProperties.size === 1) {
			return false
		}
		return true
	}

	// Standard functions
	getApiKey() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.apiKey
	}

	isEmptyArray(arr) {
		if (!arr) { return true }
		return arr.length === 0
	}

	round(number) {
		return (Math.round(parseFloat(number) * 1e8) / 1e8).toFixed(8)
	}
}

window.customElements.define('chat-image-gif', ChatImageGif)
