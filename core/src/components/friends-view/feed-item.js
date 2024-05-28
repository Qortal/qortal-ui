import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store'
import { setNewTab } from '../../redux/app/app-actions'
import { RequestQueueWithPromise } from '../../../../plugins/plugins/utils/classes'
import { translate, } from '../../../translate'
import { feedItemStyles } from '../../styles/core-css'
import axios from 'axios'
import ShortUniqueId from 'short-unique-id'
import '../../../../plugins/plugins/core/components/TimeAgo'
import '@material/mwc-menu'
import '@material/mwc-list/mwc-list-item.js'

const requestQueue = new RequestQueueWithPromise(3)
const requestQueueRawData = new RequestQueueWithPromise(3)
const requestQueueStatus = new RequestQueueWithPromise(3)

export class FeedItem extends connect(store)(LitElement) {
	static get properties() {
		return {
			resource: { type: Object },
			isReady: { type: Boolean },
			status: { type: Object },
			feedItem: { type: Object },
			appName: { type: String },
			link: { type: String }
		}
	}

	static get styles() {
		return [feedItemStyles]
	}

	constructor() {
		super()
		this.resource = {
			identifier: "",
			name: "",
			service: ""
		}
		this.status = {
			status: ''
		}
		this.isReady = false
		this.nodeUrl = this.getNodeUrl()
		this.myNode = this.getMyNode()
		this.hasCalledWhenDownloaded = false
		this.isFetching = false
		this.uid = new ShortUniqueId()
		this.observer = new IntersectionObserver(entries => {
			for (const entry of entries) {
				if (entry.isIntersecting && this.status.status !== 'READY') {
					this._fetchImage()
					// Stop observing after the image has started loading
					this.observer.unobserve(this)
				}
			}
		})
		this.feedItem = null
	}

	render() {
		let avatarImg
		const avatarUrl = `${this.nodeUrl}/arbitrary/THUMBNAIL/${this.resource.name}/qortal_avatar?async=true`
		avatarImg = html`<img src="${avatarUrl}" style="width:100%; height:100%;" onerror="this.onerror=null; this.src='/img/incognito.png';" />`

		let avatarImgApp
		const avatarUrl2 = `${this.nodeUrl}/arbitrary/THUMBNAIL/${this.appName}/qortal_avatar?async=true`
		avatarImgApp = html`<img src="${avatarUrl2}" style="width:100%; height:100%;" onerror="this.onerror=null; this.src='/img/incognito.png';" />`

		return html`
			<div
				class=${[`image-container`, this.status.status !== 'READY' ? 'defaultSize' : '', this.status.status !== 'READY' ? 'hideImg' : '',].join(' ')}
				style=" box-sizing: border-box;"
			>
				${this.status.status !== 'READY' ?
					html`
						<div style="display:flex;flex-direction:column;width:100%;height:100%;justify-content:center;align-items:center; box-sizing: border-box;">
							<div class=${`smallLoading`}></div>
							<p style="color: var(--black)">
								${`${Math.round(this.status.percentLoaded || 0).toFixed(0)}% `}${translate('chatpage.cchange94')}
							</p>
						</div>
					`
					: ''
				}
				${this.status.status === 'READY' && this.feedItem ?
					html`
						<div class="parent-feed-item"  style="position:relative" @click=${this.goToFeedLink}>
							<div style="display:flex;gap:10px;margin-bottom:5px">
								<div class="avatar">${avatarImg}</div>
								<span class="feed-item-name">${this.resource.name}</span>
							</div>
							<div>
								<p>${this.feedItem.title}</p>
							</div>
							<div class="app-name">
								<div class="avatarApp">${avatarImgApp}</div>
								<message-time timestamp=${this.resource.created}></message-time>
							</div>
						</div>
					`
					: ''
				}
			</div>
		`
	}

	firstUpdated() {
		this.observer.observe(this)
	}

	getNodeUrl() {
		const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		return myNode.protocol + '://' + myNode.domain + ':' + myNode.port
	}

	getMyNode() {
		return store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
	}

	async fetchResource() {
		try {
			if (this.isFetching) return
			this.isFetching = true
			await axios.get(`${this.nodeUrl}/arbitrary/resource/properties/${this.resource.service}/${this.resource.name}/${this.resource.identifier}?apiKey=${this.myNode.apiKey}`)
			this.isFetching = false

		} catch (error) {
			this.isFetching = false
		}
	}

	async fetchVideoUrl() {
		await this.fetchResource()
	}

	async getRawData() {
		const url = `${this.nodeUrl}/arbitrary/${this.resource.service}/${this.resource.name}/${this.resource.identifier}?apiKey=${this.myNode.apiKey}`

		return await requestQueueRawData.enqueue(() => {
			return axios.get(url)
		})
	}

	updateDisplayWithPlaceholders(display, resource, rawdata) {
		const pattern = /\$\$\{([a-zA-Z0-9_\.]+)\}\$\$/g

		for (const key in display) {
			const value = display[key]

			display[key] = value.replace(pattern, (match, p1) => {
				if (p1.startsWith('rawdata.')) {
					const dataKey = p1.split('.')[1]
					if (rawdata[dataKey] === undefined) {
						console.error("rawdata key not found:", dataKey)
					}
					return rawdata[dataKey] || match
				} else if (p1.startsWith('resource.')) {
					const resourceKey = p1.split('.')[1]
					if (resource[resourceKey] === undefined) {
						console.error("resource key not found:", resourceKey)
					}
					return resource[resourceKey] || match
				}
				return match
			})
		}
	}

	async fetchStatus() {
		let isCalling = false
		let percentLoaded = 0
		let timer = 24

		const response = await requestQueueStatus.enqueue(() => {
			return axios.get(`${this.nodeUrl}/arbitrary/resource/status/${this.resource.service}/${this.resource.name}/${this.resource.identifier}?apiKey=${this.myNode.apiKey}`)
		})

		if (response && response.data && response.data.status === 'READY') {
			const rawData = await this.getRawData()

			const object = {
				...this.resource.schema.display
			}

			this.updateDisplayWithPlaceholders(object, {}, rawData.data)
			this.feedItem = object
			this.status = response.data

			return
		}

		const intervalId = setInterval(async () => {
			if (isCalling) return
			isCalling = true

			const data = await requestQueue.enqueue(() => {
				return axios.get(`${this.nodeUrl}/arbitrary/resource/status/${this.resource.service}/${this.resource.name}/${this.resource.identifier}?apiKey=${this.myNode.apiKey}`)
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
					await this.fetchResource()
				}
			}

			// check if progress is 100% and clear interval if true
			if (res.status === 'READY') {
				const rawData = await this.getRawData()
				const object = {
					...this.resource.schema.display
				}
				this.updateDisplayWithPlaceholders(object, {}, rawData.data)
				this.feedItem = object
				clearInterval(intervalId)
				this.status = res
				this.isReady = true
			}
		}, 5000) // 5 second interval
	}

	async _fetchImage() {
		try {
			await this.fetchVideoUrl()
			await this.fetchStatus()
		} catch (error) { /* empty */ }
	}

	async goToFeedLink() {
		try {
			let newQuery = this.link
			if (newQuery.endsWith('/')) {
				newQuery = newQuery.slice(0, -1)
			}
			const res = await this.extractComponents(newQuery)
			if (!res) return
			const { service, name, identifier, path } = res
			let query = `?service=${service}`
			if (name) {
				query = query + `&name=${name}`
			}
			if (identifier) {
				query = query + `&identifier=${identifier}`
			}
			if (path) {
				query = query + `&path=${path}`
			}

			store.dispatch(setNewTab({
				url: `qdn/browser/index.html${query}`,
				id: this.uid.rnd(),
				myPlugObj: {
					"url": "myapp",
					"domain": "core",
					"page": `qdn/browser/index.html${query}`,
					"title": name,
					"icon": 'vaadin:external-browser',
					"mwcicon": 'open_in_browser',
					"menus": [],
					"parent": false
				},
				openExisting: true
			}))
		} catch (error) {
			console.log({ error })
		}
	}

	async extractComponents(url) {
		if (!url.startsWith("qortal://")) {
			return null
		}

		url = url.replace(/^(qortal\:\/\/)/, "")

		if (url.includes("/")) {
			let parts = url.split("/")
			const service = parts[0].toUpperCase()
			parts.shift()
			const name = parts[0]
			parts.shift()
			let identifier

			if (parts.length > 0) {
				identifier = parts[0] // Do not shift yet
				// Check if a resource exists with this service, name and identifier combination
				const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
				const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
				const url = `${nodeUrl}/arbitrary/resource/status/${service}/${name}/${identifier}?apiKey=${myNode.apiKey}}`

				const res = await fetch(url);
				const data = await res.json();
				if (data.totalChunkCount > 0) {
					// Identifier exists, so don't include it in the path
					parts.shift()
				}
				else {
					identifier = null
				}
			}

			const path = parts.join("/")

			const components = {}
			components["service"] = service
			components["name"] = name
			components["identifier"] = identifier
			components["path"] = path
			return components
		}
		return null
	}

	// Standard functions
	getApiKey() {
		const coreNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		return coreNode.apiKey
	}

	isEmptyArray(arr) {
		if (!arr) { return true }
		return arr.length === 0
	}

	round(number) {
		return (Math.round(parseFloat(number) * 1e8) / 1e8).toFixed(8)
	}
}

window.customElements.define('feed-item', FeedItem)