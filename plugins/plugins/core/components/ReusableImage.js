import { html, LitElement } from 'lit'
import { RequestQueueWithPromise } from '../../utils/classes'
import { reusableImageStyles } from './plugins-css'
import axios from 'axios'
import '@material/mwc-dialog'
import '@material/mwc-list/mwc-list-item.js'
import '@material/mwc-menu'

// Multi language support
import { translate } from '../../../../core/translate'

const requestQueue = new RequestQueueWithPromise(5)
const requestQueue2 = new RequestQueueWithPromise(5)

export class ResuableImage extends LitElement {
	static get properties() {
		return {
			resource: { type: Object },
			isReady: { type: Boolean },
			status: { type: Object },
			missingData: { type: Boolean },
			openDialogImage: { type: Boolean },
			onLoad: { attribute: false }
		}
	}

	static get styles() {
		return [reusableImageStyles]
	}

	constructor() {
		super()
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
		this.missingData = false
		this.openDialogImage = false
		this.observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting && this.status.status !== 'READY') {
					this._fetchImage()

					// Stop observing after the image has started loading
					this.observer.unobserve(this)
				}
			}
		})
	}

	render() {
		return html`
			<div>
				${this.status.status !== 'READY' ?
					html`
						<div style="display:flex;flex-direction:column;width:100%;height:100%;justify-content:center;align-items:center;">
							<div class=${`smallLoading`}></div>
							<p style="color: var(--black)">
								${`${Math.round(this.status.percentLoaded || 0).toFixed(0)}% `}${translate('chatpage.cchange94')}
							</p>
						</div>
					`
					: ''
				}
				${this.status.status === 'READY' ?
					html`
						<div style="position:relative; cursor:pointer" @click=${() => {this.openDialogImage = true;}}>
							<img crossorigin="anonymous" src=${this.url} />
						</div>
					`
					: ''
				}
			</div>
			<mwc-dialog id="showDialogPublicKey" ?open=${this.openDialogImage} @closed=${() => {this.openDialogImage = false;}}>
				<div class="dialog-header"></div>
				<div class="dialog-container imageContainer">
					${this.openDialogImage ?
						html`
							<img src=${this.url} style="height: auto; max-height: 80vh; width: auto; max-width: 80vw; object-fit: contain; border-radius: 5px;"/>
						`
						: ''
					}
				</div>
				<mwc-button slot="primaryAction" dialogAction="cancel" class="red" @click=${() => {this.openDialogImage = false;}}>
					${translate('general.close')}
				</mwc-button>
			</mwc-dialog>
		`
	}

	firstUpdated() {
		this.observer.observe(this)
	}

	getNodeUrl() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.protocol + '://' + myNode.domain + ':' + myNode.port
	}

	getMyNode() {
		return window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
	}

	async fetchResource() {
		try {
			if (this.isFetching) return

			this.isFetching = true

			await requestQueue2.enqueue(() => {
				return axios.get(
					`${this.nodeUrl}/arbitrary/resource/properties/${this.resource.service}/${this.resource.name}/${this.resource.identifier}`
				)
			})

			this.isFetching = false
		} catch (error) {
			this.isFetching = false
		}
	}

	async fetchVideoUrl() {
		await this.fetchResource();
		this.url = `${this.nodeUrl}/arbitrary/${this.resource.service}/${this.resource.name}/${this.resource.identifier}?async=true`
	}

	async fetchStatus() {
		let isCalling = false
		let percentLoaded = 0
		let timer = 24

		const response = await axios.get(
			`${this.nodeUrl}/arbitrary/resource/status/${this.resource.service}/${this.resource.name}/${this.resource.identifier}`
		)

		if (response && response.data && response.data.status === 'READY') {
			this.status = response.data
			this.onLoad()
			return
		}

		const intervalId = setInterval(async () => {
			if (isCalling) return

			isCalling = true

			const data = await requestQueue.enqueue(() => {
				return axios.get(
					`${this.nodeUrl}/arbitrary/resource/status/${this.resource.service}/${this.resource.name}/${this.resource.identifier}`
				)
			})

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
						timer = 24;
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
					await this.fetchResource()
				}
			}

			// check if progress is 100% and clear interval if true
			if (res.status === 'READY') {
				this.onLoad()
				clearInterval(intervalId)
				this.status = res
				this.isReady = true
			}

			if (res.status === 'MISSING_DATA') {
				this.status = res
				this.missingData = true
				clearInterval(intervalId)
			}
		}, 5000) // 5 second interval
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

	showContextMenu(e) {
		e.preventDefault()
		e.stopPropagation()

		const contextMenu = this.shadowRoot.getElementById('contextMenu')
		const containerRect = e.currentTarget.getBoundingClientRect()

		// Adjusting the positions
		const adjustedX = e.clientX - containerRect.left
		const adjustedY = e.clientY - containerRect.top

		contextMenu.style.top = `${adjustedY}px`
		contextMenu.style.left = `${adjustedX}px`

		contextMenu.open = true
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

customElements.define('reusable-image', ResuableImage)
