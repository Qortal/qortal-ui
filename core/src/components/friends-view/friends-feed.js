import { html, LitElement } from 'lit'
import { store } from '../../store'
import { connect } from 'pwa-helpers'
import { translate } from '../../../translate'
import { friendsViewStyles } from '../../styles/core-css'
import './feed-item'
import './friends-view'
import '@material/mwc-icon'
import '@polymer/paper-spinner/paper-spinner-lite.js'

const perEndpointCount = 20
const totalDesiredCount = 100
const maxResultsInMemory = 300

class FriendsFeed extends connect(store)(LitElement) {
	static get properties() {
		return {
			feed: { type: Array },
			setHasNewFeed: { attribute: false },
			isLoading: { type: Boolean },
			hasFetched: { type: Boolean },
			mySelectedFeeds: { type: Array }
		}
	}

	static get styles() {
		return [friendsViewStyles]
	}

	constructor() {
		super()
		this.feed = []
		this.feedToRender = []
		this.nodeUrl = this.getNodeUrl()
		this.myNode = this.getMyNode()
		this.endpoints = []
		this.endpointOffsets = []  // Initialize offsets for each endpoint to 0
		this.loadAndMergeData = this.loadAndMergeData.bind(this)
		this.hasInitialFetch = false
		this.observerHandler = this.observerHandler.bind(this)
		this.elementObserver = this.elementObserver.bind(this)
		this.mySelectedFeeds = []
		this.getSchemas = this.getSchemas.bind(this)
		this.hasFetched = false
		this._updateFeeds = this._updateFeeds.bind(this)
	}

	render() {
		return html`
			<div class="container">
				<div id="viewElement" class="container-body" style=${"position: relative"}>
					${this.isLoading ? html`
						<div style="width:100%;display: flex; justify-content:center">
							<paper-spinner-lite active></paper-spinner-lite>
						</div>
					` : ''}
					${this.hasFetched && !this.isLoading && this.feed.length === 0 ? html`
						<div style="width:100%;display: flex; justify-content:center">
							<p>${translate('friends.friend17')}</p>
						</div>
					` : ''}
					${this.feedToRender.map((item) => {
						return html`
							<feed-item
								.resource=${item}
								appName=${'Q-Blog'}
								link=${item.link}
							>
							</feed-item>
						`
					})}
					<div id="downObserver"></div>
				</div>
			</div>
		`
	}


	async firstUpdated() {
		this.viewElement = this.shadowRoot.getElementById('viewElement')
		this.downObserverElement = this.shadowRoot.getElementById('downObserver')
		this.elementObserver()

		try {
			await new Promise((res) => {
				setTimeout(() => {
					res()
				}, 5000)
			})

			if (this.mySelectedFeeds.length === 0) {
				await this.getEndpoints()
				await this.loadAndMergeData()
			}

			this.getFeedOnInterval()
		} catch (error) {
			console.log(error)
		}
	}

	getNodeUrl() {
		const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		return myNode.protocol + '://' + myNode.domain + ':' + myNode.port
	}

	getMyNode() {
		return store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
	}

	_updateFeeds(event) {
		this.mySelectedFeeds = event.detail
		this.reFetchFeedData()
		this.requestUpdate()
	}

	connectedCallback() {
		super.connectedCallback()
		window.addEventListener('friends-my-selected-feeds-event', this._updateFeeds)
	}

	disconnectedCallback() {
		window.removeEventListener('friends-my-selected-feeds-event', this._updateFeeds)
		super.disconnectedCallback()
	}

	async getSchemas() {
		this.mySelectedFeeds = JSON.parse(localStorage.getItem('friends-my-selected-feeds') || "[]")
		const schemas = this.mySelectedFeeds

		const getAllSchemas = (schemas || []).map(
			async (schema) => {
				try {
					const url = `${this.nodeUrl}/arbitrary/${schema.service}/${schema.name}/${schema.identifier}`
					const res = await fetch(url)
					const data = await res.json()
					if (data.error) return false
					return data
				} catch (error) {
					console.log(error)
					return false
				}
			}
		)

		const res = await Promise.all(getAllSchemas)
		return res.filter((item) => !!item)
	}

	getFeedOnInterval() {
		let interval = null
		let stop = false

		const getAnswer = async () => {
			if (!stop) {
				stop = true
				try {
					await this.reFetchFeedData()
				} catch (error) { }
				stop = false
			}
		}

		interval = setInterval(getAnswer, 900000)
	}

	async getEndpoints() {
		const dynamicVars = { }
		const schemas = await this.getSchemas()
		const friendList = JSON.parse(localStorage.getItem('friends-my-friend-list') || "[]")
		const names = friendList.map(friend => `name=${friend.name}`).join('&')

		if (names.length === 0) {
			this.endpoints = []
			this.endpointOffsets = Array(this.endpoints.length).fill(0)
			return
		}

		const baseurl = `${this.nodeUrl}/arbitrary/resources/search?reverse=true&mode=ALL&exactmatchnames=true&${names}`
		let formEndpoints = []

		schemas.forEach((schema) => {
			const feedData = schema.feed[0]
			if (feedData) {
				const copyFeedData = { ...feedData }
				const fullUrl = constructUrl(baseurl, copyFeedData.search, dynamicVars)
				if (fullUrl) {
					formEndpoints.push({
						url: fullUrl, schemaName: schema.name, schema: copyFeedData
					})
				}
			}
		})

		this.endpoints = formEndpoints
		this.endpointOffsets = Array(this.endpoints.length).fill(0)
	}

	getMoreFeed() {
		if (!this.hasInitialFetch) return
		if (this.feedToRender.length === this.feed.length) return
		this.feedToRender = this.feed.slice(0, this.feedToRender.length + 20)
		this.requestUpdate()
	}

	async refresh() {
		try {
			await this.getEndpoints()
			await this.reFetchFeedData()
		} catch (error) {

		}
	}

	elementObserver() {
		const options = {
			rootMargin: '0px',
			threshold: 1
		}

		// identify an element to observe
		const elementToObserve = this.downObserverElement

		// passing it a callback function
		const observer = new IntersectionObserver(
			this.observerHandler,
			options
		)

		// call `observe()` on that MutationObserver instance,
		// passing it the element to observe, and the options object
		observer.observe(elementToObserve)
	}

	observerHandler(entries) {
		if (!entries[0].isIntersecting) {
		} else {
			if (this.feedToRender.length < 20) {
				return
			}
			this.getMoreFeed()
		}
	}

	async fetchDataFromEndpoint(endpointIndex, count) {
		const offset = this.endpointOffsets[endpointIndex]
		const url = `${this.endpoints[endpointIndex].url}&limit=${count}&offset=${offset}`
		const res = await fetch(url)
		const data = await res.json()

		return data.map((i) => {
			return {
				...this.endpoints[endpointIndex],
				...i
			}
		})
	}

	async initialLoad() {
		let results = []
		let totalFetched = 0
		let i = 0
		let madeProgress = true
		let exhaustedEndpoints = new Set()

		while (totalFetched < totalDesiredCount && madeProgress) {
			madeProgress = false
			this.isLoading = true
			for (i = 0; i < this.endpoints.length; i++) {
				if (exhaustedEndpoints.has(i)) {
					continue
				}

				const remainingCount = totalDesiredCount - totalFetched

				// If we've already reached the desired count, break
				if (remainingCount <= 0) {
					break;
				}

				let fetchCount = Math.min(perEndpointCount, remainingCount)
				let data = await this.fetchDataFromEndpoint(i, fetchCount)

				// Increment the offset for this endpoint by the number of items fetched
				this.endpointOffsets[i] += data.length

				if (data.length > 0) {
					madeProgress = true
				}

				if (data.length < fetchCount) {
					exhaustedEndpoints.add(i)
				}

				results = results.concat(data)
				totalFetched += data.length
			}

			if (exhaustedEndpoints.size === this.endpoints.length) {
				break
			}
		}

		this.isLoading = false
		this.hasFetched = true

		// Trim the results if somehow they are over the totalDesiredCount
		return results.slice(0, totalDesiredCount)
	}

	trimDataToLimit(data, limit) {
		return data.slice(0, limit)
	}

	mergeData(newData, existingData) {
		const existingIds = new Set(existingData.map(item => item.identifier))  // Assume each item has a unique 'id'
		const uniqueNewData = newData.filter(item => !existingIds.has(item.identifier))
		return uniqueNewData.concat(existingData)
	}

	async addExtraData(data) {
		let newData = []
		for (let item of data) {
			let newItem = {
				...item,
				schema: {
					...item.schema,
					customParams: { ...item.schema.customParams }

				}
			}

			let newResource = {
				identifier: newItem.identifier,
				service: newItem.service,
				name: newItem.name
			}

			if (newItem.schema) {
				const resource = newItem

				let clickValue1 = newItem.schema.click;

				newItem.link = replacePlaceholders(clickValue1, resource, newItem.schema.customParams)
				newData.push(newItem)
			}
		}
		return newData
	}

	async reFetchFeedData() {
		// Resetting offsets to start fresh.
		this.endpointOffsets = Array(this.endpoints.length).fill(0)
		await this.getEndpoints()
		const oldIdentifiers = new Set(this.feed.map(item => item.identifier))
		const newData = await this.initialLoad()

		// Filter out items that are already in the feed
		const trulyNewData = newData.filter(item => !oldIdentifiers.has(item.identifier))

		if (trulyNewData.length > 0) {
			// Adding extra data and merging with old data
			const enhancedNewData = await this.addExtraData(trulyNewData)

			// Merge new data with old data immutably
			this.feed = [...enhancedNewData, ...this.feed]
			this.feed = this.removeDuplicates(this.feed)
			this.feed.sort((a, b) => new Date(b.created) - new Date(a.created))  // Sort by timestamp, most recent first
			this.feed = this.trimDataToLimit(this.feed, maxResultsInMemory)  // Trim to the maximum allowed in memory
			this.feedToRender = this.feed.slice(0, 20)
			this.hasInitialFetch = true

			const created = trulyNewData[0].created
			let value = localStorage.getItem('lastSeenFeed')
			if (((+value || 0) < created)) {
				this.setHasNewFeed(true)
			}
		}
	}

	removeDuplicates(array) {
		const seenIds = new Set()
		return array.filter(item => {
			if (!seenIds.has(item.identifier)) {
				seenIds.add(item.identifier)
				return true
			}
			return false
		})
	}

	async loadAndMergeData() {
		let allData = this.feed
		const newData = await this.initialLoad();
		allData = await this.addExtraData(newData)
		allData = this.mergeData(newData, allData);
		allData.sort((a, b) => new Date(b.created) - new Date(a.created));  // Sort by timestamp, most recent first
		allData = this.trimDataToLimit(allData, maxResultsInMemory);  // Trim to the maximum allowed in memory
		allData = this.removeDuplicates(allData)
		this.feed = [...allData]
		this.feedToRender = this.feed.slice(0, 20)
		this.hasInitialFetch = true
		if (allData.length > 0) {
			const created = allData[0].created
			let value = localStorage.getItem('lastSeenFeed')
			if (((+value || 0) < created)) {
				this.setHasNewFeed(true)
			}
		}
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

window.customElements.define('friends-feed', FriendsFeed)

export function substituteDynamicVar(value, dynamicVars) {
	if (typeof value !== 'string') return value
	const pattern = /\$\$\{([a-zA-Z0-9_]+)\}\$\$/g  // Adjusted pattern to capture $${name}$$ with curly braces
	return value.replace(pattern, (match, p1) => {
		return dynamicVars[p1] !== undefined ? dynamicVars[p1] : match
	})
}

export function constructUrl(base, search, dynamicVars) {
	let queryStrings = []
	for (const [key, value] of Object.entries(search)) {
		const substitutedValue = substituteDynamicVar(value, dynamicVars)
		queryStrings.push(`${key}=${encodeURIComponent(substitutedValue)}`)
	}
	return queryStrings.length > 0 ? `${base}&${queryStrings.join('&')}` : base
}

export function replacePlaceholders(template, resource, customParams) {
	const dataSource = { resource, customParams }
	return template.replace(/\$\$\{(.*?)\}\$\$/g, (match, p1) => {
		const keys = p1.split('.')
		let value = dataSource
		for (let key of keys) {
			if (value[key] !== undefined) {
				value = value[key]
			} else {
				return match  // Return placeholder unchanged
			}
		}
		return value
	})
}