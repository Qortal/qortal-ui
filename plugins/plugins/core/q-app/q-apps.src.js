import { html, LitElement } from 'lit'
import { Epml } from '../../../epml'
import { qAppsStyles } from '../components/plugins-css'
import isElectron from 'is-electron'
import '@polymer/iron-icons/iron-icons.js'
import '@material/mwc-icon'
import '@material/mwc-button'
import '@material/mwc-tab-bar'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/text-field'

// Multi language support
import { get, registerTranslateConfig, translate, use } from '../../../../core/translate'
registerTranslateConfig({
	loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class QApps extends LitElement {
	static get properties() {
		return {
			selectedAddress: { type: Object },
			appsArray: { type: Array },
			followedNames: { type: Array },
			blockedNames: { type: Array },
			searchResources: { type: Array },
			followedResources: { type: Array },
			blockedResources: { type: Array },
			isLoading: { type: Boolean },
			relayMode: { type: Boolean },
			service: { type: String },
			identifier: { type: String },
			searchName: { type: String },
			textStatus: { type: String },
			textProgress: { type: String },
			appIconUrl: { type: String },
			appTitle: { type: String },
			appPublisher: { type: String },
			appDescription: { type: String },
			appTags: { type: String },
			appStatus: { type: String },
			appFollow: { type: String },
			appBlock: { type: String },
			theme: { type: String, reflect: true }
		}
	}

	static get styles() {
		return [qAppsStyles]
	}

	constructor() {
		super()
		this.selectedAddress = {}
		this.appsArray = []
		this.followedNames = []
		this.blockedNames = []
		this.searchResources = []
		this.followedResources = []
		this.blockedResources = []
		this.isLoading = false
		this.relayMode = false
		this.identifier = ''
		this.searchName = ''
		this.textStatus = ''
		this.textProgress = ''
		this.appIconUrl = ''
		this.appTitle = ''
		this.appPublisher = ''
		this.appDescription = ''
		this.appTags = ''
		this.appStatus = ''
		this.appFollow = ''
		this.appBlock = ''
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
	}

	render() {
		return html`
			<div id="apps-list-page">
				<mwc-tab-bar id="tabs-1" activeIndex="0">
					<mwc-tab label="${translate("appspage.schange1")}" icon="travel_explore" @click="${(e) => this.displayTabContent('browse')}"></mwc-tab>
					<mwc-tab label="${translate("appspage.schange2")}" icon="desktop_windows" @click="${(e) => this.displayTabContent('followed')}"></mwc-tab>
					<mwc-tab label="${translate("appspage.schange3")}" icon="block" @click="${(e) => this.displayTabContent('blocked')}"></mwc-tab>
				</mwc-tab-bar>
				<div id="tabs-1-content">
					<div id="tab-browse-content">
						<div style="min-height:48px; display: flex; padding-bottom: 6px; margin: 2px;">
							<h2 style="margin: 0; padding-top: .5em; display: inline;">${translate("appspage.schange1")}</h2>
							<h2 style="margin: 0; flex: 6; padding-top: .5em; display: inline;">${this.renderSearchButton()}</h2>
							<h2 style="margin: 0; padding-top: .5em; display: inline;">${this.renderPublishButton()}</h2>
						</div>
						<div id="apps-container" class="grid-container"></div>
						${this.isLoading ? html`
							<div class="spinner">
								<paper-spinner-lite active></paper-spinner-lite>
							</div>
						` : ''}
						${this.renderRelayModeText()}
					</div>
					<div id="tab-followed-content">
						<div style="min-height:48px; display: flex; padding-bottom: 6px; margin: 2px;">
							<h2 style="margin: 0; padding-top: .5em; display: inline;">${translate("appspage.schange11")}</h2>
							<h2 style="margin: 0; flex: 6; padding-top: .5em; display: inline;">${this.renderSearchButton()}</h2>
							<h2 style="margin: 0; padding-top: .5em; display: inline;">${this.renderPublishButton()}</h2>
						</div>
						<div id="followed-container" class="grid-container"></div>
						${this.isLoading ? html`
							<div class="spinner">
								<paper-spinner-lite active></paper-spinner-lite>
							</div>
						` : ''}
						${this.isEmptyArray(this.followedResources) ? html`
							<div class="relay-mode-notice">${translate("appspage.schange13")}</div>
						` : ''}
						${this.renderRelayModeText()}
					</div>
					<div id="tab-blocked-content">
						<div style="min-height:48px; display: flex; padding-bottom: 6px; margin: 2px;">
							<h2 style="margin: 0; padding-top: .5em; display: inline;">${translate("appspage.schange14")}</h2>
							<h2 style="margin: 0; flex: 6; padding-top: .5em; display: inline;">${this.renderSearchButton()}</h2>
							<h2 style="margin: 0; padding-top: .5em; display: inline;">${this.renderPublishButton()}</h2>
						</div>
						<div id="blocked-container" class="grid-container"></div>
						${this.isLoading ? html`
							<div class="spinner">
								<paper-spinner-lite active></paper-spinner-lite>
							</div>
						` : ''}
						${this.isEmptyArray(this.blockedResources) ? html`
							<div class="relay-mode-notice">${translate("appspage.schange16")}</div>
						` : ''}
						${this.renderRelayModeText()}
					</div>
				</div>
			</div>
			<paper-dialog id="searchAppDialog" class="search">
				<div style="display: inline;">
					<div class="search">
						<vaadin-text-field
							style="width: 350px"
							id="searchName"
							placeholder="${translate("appspage.schange33")}"
							value="${this.searchName}"
							@keydown="${this.searchListener}"
							clear-button-visible
						>
						</vaadin-text-field>
						<paper-icon-button icon="icons:search" @click="${(e) => this.doSearch(e)}" title="${translate("appspage.schange35")}"></paper-icon-button>
						<paper-icon-button icon="icons:close" @click="${() => this.closeSearchDialog()}" title="${translate("general.close")}"></paper-icon-button>
					</div>
				</div>
				<div id="search-container" class="grid-container-search"></div>
			</paper-dialog>
			<paper-dialog id="downloadProgressDialog" class="progress" modal>
				<span class="close-download"><paper-icon-button icon="icons:close" @click="${() => this.closeDownloadProgressDialog()}" title="${translate("general.close")}"></paper-icon-button></span>
				<div class="lds-roller">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
				<h2>${translate("appspage.schange41")}</h2>
				<h3>${this.textProgress}</h3>
			</paper-dialog>
			<paper-dialog id="closeProgressDialog" class="close-progress" modal>
				${translate("appspage.schange43")}
			</paper-dialog>
			<paper-dialog id="appInfoDialog" class="appinfo" modal>
				<div class="card-container">
					${this.appBlock}
					<span class="close" @click=${() => this.closeAppInfoDialog()}>${translate("general.close")}</span>
					<img src="${this.appIconUrl}" onerror="this.src='/img/incognito.png';">
					<h3>${this.appTitle}</h3>
					<h5>
					${translate("appspage.schange7")}: ${this.appPublisher}</h6>
					<p>${this.appDescription}</p>
					<div class="tags">
						<h6>TAGS</h6>
						<ul>
							<li>${this.appTags}</li>
						</ul>
					</div>
					<div class="buttons">
						${this.appStatus}
						${this.appFollow}
					</div>
				</div>
			</paper-dialog>
			<paper-dialog id="blockedInfodDialog" class="appinfo" modal>
				<div class="card-container">
					${this.appBlock}
					<span class="close" @click=${() => this.closeBlockedInfoDialog()}>${translate("general.close")}</span>
					<img src="${this.appIconUrl}" onerror="this.src='/img/incognito.png';">
					<h3>${this.appTitle}</h3>
					<h5>
					${translate("appspage.schange7")}: ${this.appPublisher}</h6>
					<p>${this.appDescription}</p>
					<div class="tags">
						<h6>TAGS</h6>
						<ul>
							<li>${this.appTags}</li>
						</ul>
					</div>
				</div>
			</paper-dialog>
		`
	}

	firstUpdated() {
		this.changeTheme()
		this.changeLanguage()

		setTimeout(() => {
			this.displayTabContent('browse')
		}, 0)

		const getFollowedNames = async () => {
			this.followedNames = await parentEpml.request('apiCall', {
				url: `/lists/followedNames?apiKey=${this.getApiKey()}`
			})
			setTimeout(getFollowedNames, 60000)
		}

		const getBlockedNames = async () => {
			this.blockedNames = await parentEpml.request('apiCall', {
				url: `/lists/blockedNames?apiKey=${this.getApiKey()}`
			})
			setTimeout(getBlockedNames, 60000)
		}

		const getRelayMode = async () => {
			this.relayMode = await parentEpml.request('apiCall', {
				url: `/arbitrary/relaymode?apiKey=${this.getApiKey()}`
			})
			setTimeout(getRelayMode, 600000)
		}

		window.addEventListener('storage', () => {
			const checkLanguage = localStorage.getItem('qortalLanguage')
			const checkTheme = localStorage.getItem('qortalTheme')

			use(checkLanguage)

			if (checkTheme === 'dark') {
				this.theme = 'dark'
			} else {
				this.theme = 'light'
			}
			document.querySelector('html').setAttribute('theme', this.theme)
		})

		if (!isElectron()) {
		} else {
			window.addEventListener('contextmenu', (event) => {
				event.preventDefault()
				window.parent.electronAPI.showMyMenu()
			})
		}

		let configLoaded = false

		parentEpml.ready().then(() => {
			parentEpml.subscribe('selected_address', async selectedAddress => {
				this.selectedAddress = {}
				selectedAddress = JSON.parse(selectedAddress)
				if (!selectedAddress || Object.entries(selectedAddress).length === 0) return
				this.selectedAddress = selectedAddress
			})

			parentEpml.subscribe('config', c => {
				if (!configLoaded) {
					setTimeout(getFollowedNames, 1)
					setTimeout(getBlockedNames, 1)
					setTimeout(getRelayMode, 1)
					configLoaded = true
				}
				this.config = JSON.parse(c)
			})
		})

		parentEpml.imReady()

		this.clearConsole()

		setInterval(() => {
			this.clearConsole()
		}, 60000)

		setInterval(() => {
			this.getAppsArrayData()
		}, 600000)
	}

	clearConsole() {
		if (!isElectron()) {
		} else {
			console.clear()
			window.parent.electronAPI.clearCache()
		}
	}

	changeTheme() {
		const checkTheme = localStorage.getItem('qortalTheme')
		if (checkTheme === 'dark') {
			this.theme = 'dark'
		} else {
			this.theme = 'light'
		}
		document.querySelector('html').setAttribute('theme', this.theme)
	}

	changeLanguage() {
		const checkLanguage = localStorage.getItem('qortalLanguage')

		if (checkLanguage === null || checkLanguage.length === 0) {
			localStorage.setItem('qortalLanguage', 'us')
			use('us')
		} else {
			use(checkLanguage)
		}
	}

	async displayTabContent(tab) {
		const tabBrowseContent = this.shadowRoot.getElementById('tab-browse-content')
		const tabFollowedContent = this.shadowRoot.getElementById('tab-followed-content')
		const tabBlockedContent = this.shadowRoot.getElementById('tab-blocked-content')

		if (tab === 'browse') {
			tabBrowseContent.style.display = 'block'
			tabFollowedContent.style.display = 'none'
			tabBlockedContent.style.display = 'none'
			await this.getAppsArrayData()
		} else if (tab === 'followed') {
			tabBrowseContent.style.display = 'none'
			tabFollowedContent.style.display = 'block'
			tabBlockedContent.style.display = 'none'
			await this.getFollowedNamesRefresh()
			await this.getFollowedNamesResource()
		} else if (tab === 'blocked') {
			tabBrowseContent.style.display = 'none'
			tabFollowedContent.style.display = 'none'
			tabBlockedContent.style.display = 'block'
			await this.getBlockedNamesRefresh()
			await this.getBlockedNamesResource()
		}
	}

	async getAppsArrayData() {
		this.isLoading = true
		this.appsArray = []

		this.appsArray = await parentEpml.request('apiCall', {
			url: `/arbitrary/resources?service=APP&default=true&limit=0&reverse=false&includestatus=true&includemetadata=true&excludeblocked=true`
		})

		this.isLoading = false
		this.renderAppGrid()
	}

	renderAppGrid() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const gridContainer = this.shadowRoot.getElementById('apps-container')
		this.shadowRoot.getElementById('apps-container').innerHTML = ''

		this.appsArray.forEach(item => {
			const name = item.name

			let title

			if (item.metadata != null) {
				if (item.metadata.title != null) {
					title = item.metadata.title
				}
			} else {
				title = item.name
			}

			let description

			if (item.metadata != null) {
				if (item.metadata.description != null) {
					description = item.metadata.description
				}
			} else {
				description = item.name
			}

			const url = `${nodeUrl}/arbitrary/THUMBNAIL/${name}/qortal_avatar?async=true&apiKey=${this.getApiKey()}`

			let tags = 'No Tags'

			if (item.metadata != null) {
				if (item.metadata.tags != null && item.metadata.tags.length > 0) {
					tags = item.metadata.tags.join(', ')
				}
			}

			const status1 = item.status.description
			const status2 = item.status.status
			const openDialog = () => { this.openAppInfoDialog(url, title, name, description, tags, status1, status2) }

			let clickTimeout
			let isDoubleClick = false

			const widgetElement = document.createElement('div')
			const myImage = document.createElement('img')

			myImage.src = `${url}`

			myImage.onerror = function () {
				myImage.src = '/img/incognito.png'
			}

			myImage.addEventListener('click', function () {
				clickTimeout = setTimeout(function () {
					if (!isDoubleClick) {
						openDialog()
					}
					isDoubleClick = false
				}, 250)
			})

			myImage.addEventListener('dblclick', function () {
				clearTimeout(clickTimeout)
				isDoubleClick = true
				window.location.href = `../qdn/browser/index.html?name=${item.name}&service=APP`
			})

			const myStatus = document.createElement('div')

			myStatus.classList.add('round-icon')

			const myContainer = document.createElement('div')

			myContainer.classList.add('container')
			myContainer.appendChild(myImage)

			if (item.status.description === 'Published but not yet downloaded' || item.status.status === 'MISSING_DATA') {
			} else if (item.status.description === 'Ready' || item.status.status === 'DOWNLOADED') {
				myContainer.appendChild(myStatus)
			}

			const myAppTitle = document.createElement('div')

			myAppTitle.classList.add('myapptitle')
			myAppTitle.textContent = title

			widgetElement.appendChild(myContainer)
			widgetElement.appendChild(myAppTitle)

			gridContainer.appendChild(widgetElement)
		})
	}

	async getFollowedNamesRefresh() {
		this.isLoading = true

		this.followedNames = await parentEpml.request('apiCall', {
			url: `/lists/followedNames?apiKey=${this.getApiKey()}`
		})

		this.isLoading = false
	}

	async getFollowedNamesResource() {
		this.isLoading = true

		this.followedResources = await parentEpml.request('apiCall', {
			url: `/arbitrary/resources?service=APP&default=true&limit=0&reverse=false&includestatus=true&includemetadata=true&namefilter=followedNames`
		})

		this.isLoading = false

		this.renderFollowedAppsGrid()
	}

	renderFollowedAppsGrid() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const gridContainer = this.shadowRoot.getElementById('followed-container')

		this.shadowRoot.getElementById('followed-container').innerHTML = ''

		this.followedResources.forEach(item => {
			const name = item.name

			let title

			if (item.metadata != null) {
				if (item.metadata.title != null) {
					title = item.metadata.title
				}
			} else {
				title = item.name
			}

			let description

			if (item.metadata != null) {
				if (item.metadata.description != null) {
					description = item.metadata.description
				}
			} else {
				description = item.name
			}

			const url = `${nodeUrl}/arbitrary/THUMBNAIL/${name}/qortal_avatar?async=true&apiKey=${this.getApiKey()}`

			let tags = 'No Tags'

			if (item.metadata != null) {
				if (item.metadata.tags != null && item.metadata.tags.length > 0) {
					tags = item.metadata.tags.join(', ')
				}
			}

			const status1 = item.status.description
			const status2 = item.status.status
			const openDialog = () => { this.openAppInfoDialog(url, title, name, description, tags, status1, status2) }

			let clickTimeout
			let isDoubleClick = false

			const widgetElement = document.createElement('div')
			const myImage = document.createElement('img')

			myImage.src = `${url}`

			myImage.onerror = function () {
				myImage.src = '/img/incognito.png'
			}

			myImage.addEventListener('click', function () {
				clickTimeout = setTimeout(function () {
					if (!isDoubleClick) {
						openDialog()
					}
					isDoubleClick = false
				}, 250)
			})

			myImage.addEventListener('dblclick', function () {
				clearTimeout(clickTimeout)
				isDoubleClick = true
				window.location.href = `../qdn/browser/index.html?name=${item.name}&service=APP`
			})

			const myStatus = document.createElement('div')

			myStatus.classList.add('round-icon')

			const myContainer = document.createElement('div')

			myContainer.classList.add('container')
			myContainer.appendChild(myImage)

			if (item.status.description === 'Published but not yet downloaded' || item.status.status === 'MISSING_DATA') {
			} else if (item.status.description === 'Ready' || item.status.status === 'DOWNLOADED') {
				myContainer.appendChild(myStatus)
			}

			const myAppTitle = document.createElement('div')

			myAppTitle.classList.add('myapptitle')
			myAppTitle.textContent = title

			widgetElement.appendChild(myContainer)
			widgetElement.appendChild(myAppTitle)

			gridContainer.appendChild(widgetElement)
		})
	}

	async getBlockedNamesRefresh() {
		this.isLoading = true

		this.blockedNames = await parentEpml.request('apiCall', {
			url: `/lists/blockedNames?apiKey=${this.getApiKey()}`
		})

		this.isLoading = false
	}

	async getBlockedNamesResource() {
		this.isLoading = true
		this.blockedResources = []

		this.blockedResources = await parentEpml.request('apiCall', {
			url: `/arbitrary/resources?service=APP&default=true&limit=0&reverse=false&includestatus=true&includemetadata=true&namefilter=blockedNames`
		})

		this.isLoading = false
		this.renderBlockedAppsGrid()
	}

	renderBlockedAppsGrid() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const gridContainer = this.shadowRoot.getElementById('blocked-container')
		this.shadowRoot.getElementById('blocked-container').innerHTML = ''

		this.blockedResources.forEach(item => {
			const name = item.name

			let title

			if (item.metadata != null) {
				if (item.metadata.title != null) {
					title = item.metadata.title
				}
			} else {
				title = item.name
			}

			let description

			if (item.metadata != null) {
				if (item.metadata.description != null) {
					description = item.metadata.description
				}
			} else {
				description = item.name
			}

			const url = `${nodeUrl}/arbitrary/THUMBNAIL/${name}/qortal_avatar?async=true&apiKey=${this.getApiKey()}`

			let tags = 'No Tags'

			if (item.metadata != null) {
				if (item.metadata.tags != null && item.metadata.tags.length > 0) {
					tags = item.metadata.tags.join(', ')
				}
			}

			const status1 = item.status.description
			const status2 = item.status.status
			const openDialog = () => { this.openBlockedInfoDialog(url, title, name, description, tags, status1, status2) }

			let clickTimeout
			let isDoubleClick = false

			const widgetElement = document.createElement('div')
			const myImage = document.createElement('img')

			myImage.src = `${url}`

			myImage.onerror = function () {
				myImage.src = '/img/incognito.png'
			}

			myImage.addEventListener('click', function () {
				clickTimeout = setTimeout(function () {
					if (!isDoubleClick) {
						openDialog()
					}
					isDoubleClick = false
				}, 250)
			})

			myImage.addEventListener('dblclick', function () {
				clearTimeout(clickTimeout)
				isDoubleClick = true
			})

			const myStatus = document.createElement('div')

			myStatus.classList.add('round-icon')

			const myContainer = document.createElement('div')

			myContainer.classList.add('container')
			myContainer.appendChild(myImage)

			if (item.status.description === 'Published but not yet downloaded' || item.status.status === 'MISSING_DATA') {
			} else if (item.status.description === 'Ready' || item.status.status === 'DOWNLOADED') {
				myContainer.appendChild(myStatus)
			}

			const myAppTitle = document.createElement('div')

			myAppTitle.classList.add('myapptitle')
			myAppTitle.textContent = title

			widgetElement.appendChild(myContainer)
			widgetElement.appendChild(myAppTitle)

			gridContainer.appendChild(widgetElement)
		})
	}

	openAppInfoDialog(url, title, name, description, tags, status1, status2) {
		this.appIconUrl = ''
		this.appTitle = ''
		this.appPublisher = ''
		this.appDescription = ''
		this.appTags = ''
		this.appStatus = ''
		this.appFollow = ''
		this.appBlock = ''
		this.appIconUrl = url
		this.appTitle = title
		this.appPublisher = name
		this.appDescription = description
		this.appTags = tags

		if (status1 === 'Published but not yet downloaded' || status2 === 'MISSING_DATA') {
			this.appStatus = html`<button class="primary" @click=${() => this.downloadApp(name)}>${translate('appspage.schange36')}</button>`
		} else if (status1 === 'Ready' || status2 === 'DOWNLOADED') {
			this.appStatus = html`<button class="secondary" @click=${() => window.location.href = `../qdn/browser/index.html?name=${name}&service=APP`}>${translate('appspage.schange39')}</button>`
		} else {
			this.appStatus = html`<button class="primary" @click=${() => this.downloadApp(name)}>${translate('appspage.schange36')}</button>`
		}

		if (this.followedNames.indexOf(name) === -1) {
			this.appFollow = html`<button class="primary" @click=${() => this.followName(name)}>${translate('appspage.schange29')}</button>`
		} else {
			this.appFollow = html`<button class="primary" @click=${() => this.unfollowName(name)}>${translate('appspage.schange30')}</button>`
		}

		if (this.blockedNames.indexOf(name) === -1) {
			this.appBlock = html`<span class="block" @click=${() => this.blockName(name)}>${translate('appspage.schange31')}</span>`
		} else {
			this.appBlock = html`<span class="block" @click=${() => this.unblockName(name)}>${translate('appspage.schange32')}</span>`
		}

		this.shadowRoot.getElementById('appInfoDialog').open()
	}

	closeAppInfoDialog() {
		this.shadowRoot.getElementById('appInfoDialog').close()
		this.appIconUrl = ''
		this.appTitle = ''
		this.appPublisher = ''
		this.appDescription = ''
		this.appTags = ''
		this.appStatus = ''
		this.appFollow = ''
		this.appBlock = ''
	}

	openBlockedInfoDialog(url, title, name, description, tags, status1, status2) {
		this.appIconUrl = ''
		this.appTitle = ''
		this.appPublisher = ''
		this.appDescription = ''
		this.appTags = ''
		this.appStatus = ''
		this.appFollow = ''
		this.appBlock = ''
		this.appIconUrl = url
		this.appTitle = title
		this.appPublisher = name
		this.appDescription = description
		this.appTags = tags

		if (this.blockedNames.indexOf(name) === -1) {
			this.appBlock = html`<span class="block" @click=${() => this.blockName(name)}>${translate('appspage.schange31')}</span>`
		} else {
			this.appBlock = html`<span class="block" @click=${() => this.unblockName(name)}>${translate('appspage.schange32')}</span>`
		}

		this.shadowRoot.getElementById('blockedInfodDialog').open()
	}

	closeBlockedInfoDialog() {
		this.shadowRoot.getElementById('blockedInfodDialog').close()
		this.appIconUrl = ''
		this.appTitle = ''
		this.appPublisher = ''
		this.appDescription = ''
		this.appTags = ''
		this.appStatus = ''
		this.appFollow = ''
		this.appBlock = ''
	}

	renderSearchButton() {
		return html`<mwc-button style="float:right;" @click=${() => this.openSearchDialog()}><mwc-icon>search</mwc-icon>${translate('appspage.schange4')}</mwc-button>`
	}

	async doSearch(e) {
		await this.searchResult()
	}

	searchListener(e) {
		if (e.key === 'Enter') {
			this.doSearch(e)
		}
	}

	async searchResult() {
		let searchName = this.shadowRoot.getElementById('searchName').value
		if (searchName.length === 0) {
			let err1string = get('appspage.schange34')
			parentEpml.request('showSnackBar', `${err1string}`)
		} else {
			const searchResourcesRes = await parentEpml.request('apiCall', {
				url: `/arbitrary/resources/search?service=APP&query=${searchName}&default=true&limit=0&reverse=false&includestatus=true&includemetadata=true&excludeblocked=true`
			})

			if (this.isEmptyArray(searchResourcesRes)) {
				let err2string = get('appspage.schange17')
				parentEpml.request('showSnackBar', `${err2string}`)
			} else {
				this.searchResources = searchResourcesRes
				this.renderSearchAppsGrid()
			}
		}
	}

	renderSearchAppsGrid() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const gridContainer = this.shadowRoot.getElementById('search-container')

		this.shadowRoot.getElementById('search-container').innerHTML = ''

		this.searchResources.forEach(item => {
			const name = item.name
			const title = item.metadata.title
			const description = item.metadata.description
			const url = `${nodeUrl}/arbitrary/THUMBNAIL/${name}/qortal_avatar?async=true&apiKey=${this.getApiKey()}`

			let tags = 'No Tags'

			if (item.metadata.tags != null && item.metadata.tags.length > 0) {
				tags = item.metadata.tags.join(', ')
			}

			const status1 = item.status.description
			const status2 = item.status.status
			const openDialog = () => { this.openAppInfoDialog(url, title, name, description, tags, status1, status2) }

			let clickTimeout
			let isDoubleClick = false

			const widgetElement = document.createElement('div')
			const myImage = document.createElement('img')

			myImage.src = `${url}`

			myImage.onerror = function () {
				myImage.src = '/img/incognito.png'
			}

			myImage.addEventListener('click', function () {
				clickTimeout = setTimeout(function () {
					if (!isDoubleClick) {
						openDialog()
					}
					isDoubleClick = false
				}, 250)
			})

			myImage.addEventListener('dblclick', function () {
				clearTimeout(clickTimeout)
				isDoubleClick = true
				window.location.href = `../qdn/browser/index.html?name=${item.name}&service=APP`
			})

			const myStatus = document.createElement('div')

			myStatus.classList.add('round-icon')

			const myContainer = document.createElement('div')

			myContainer.classList.add('container')
			myContainer.appendChild(myImage)

			if (item.status.description === 'Published but not yet downloaded' || item.status.status === 'MISSING_DATA') {
			} else if (item.status.description === 'Ready' || item.status.status === 'DOWNLOADED') {
				myContainer.appendChild(myStatus)
			}

			const myAppTitle = document.createElement('div')

			myAppTitle.classList.add('myapptitle')
			myAppTitle.textContent = item.metadata.title

			widgetElement.appendChild(myContainer)
			widgetElement.appendChild(myAppTitle)

			gridContainer.appendChild(widgetElement)
		})

		this.shadowRoot.getElementById('searchAppDialog').notifyResize()
	}

	openSearchDialog() {
		this.searchResources = []
		this.shadowRoot.getElementById('searchName').value = ''
		this.shadowRoot.getElementById('search-container').innerHTML = ''
		this.shadowRoot.getElementById('searchAppDialog').open()
	}

	closeSearchDialog() {
		this.searchResources = []
		this.shadowRoot.getElementById('searchName').value = ''
		this.shadowRoot.getElementById('search-container').innerHTML = ''
		this.shadowRoot.getElementById('searchAppDialog').close()
	}

	renderRelayModeText() {
		if (this.relayMode === true) {
			return html`<div class="relay-mode-notice">${translate('appspage.schange18')} <strong>"relayModeEnabled": false</strong> ${translate('appspage.schange19')} settings.json</div>`
		} else if (this.relayMode === false) {
			return html`<div class="relay-mode-notice">${translate('appspage.schange20')} <strong>"relayModeEnabled": true</strong> ${translate('appspage.schange19')} settings.json</div>`
		}
	}

	renderPublishButton() {
		if (this.followedNames == null || !Array.isArray(this.followedNames)) {
			return html``
		} else {
			return html`<mwc-button style="float:right;" @click=${() => this.publishApp()}><mwc-icon>add</mwc-icon>${translate('appspage.schange21')}</mwc-button>`
		}
	}

	publishApp() {
		window.location.href = `../qdn/publish/index.html?service=APP&identifier=${this.identifier}&uploadType=zip&category=app&showName=true&showService=false&showIdentifier=false&showMetadata=true`
	}

	async downloadApp(appname) {
		this.showChunks(appname)

		await parentEpml.request('apiCall', {
			url: `/arbitrary/resource/status/APP/${appname}?build=true&apiKey=${this.getApiKey()}`
		})
	}

	showChunks(appname) {
		this.shadowRoot.getElementById('downloadProgressDialog').open()

		const checkStatus = async () => {
			const service = 'APP'
			const name = appname
			const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
			const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
			const url = `${nodeUrl}/arbitrary/resource/status/${service}/${name}?build=true`

			this.textStatus = 'Loading...'

			this.btnDisabled = true

			let timerDownload

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			const status = await response.json()

			if (status.id === 'UNSUPPORTED') {
				this.textProgress = ''
				clearTimeout(timerDownload)
				this.textStatus = status.description
			} else if (status.id === 'BLOCKED') {
				this.textProgress = ''
				this.textStatus = name + ' is blocked so content cannot be served'
				clearTimeout(timerDownload)
				timerDownload = setTimeout(checkStatus, 5000)
			} else if (status.id === 'READY') {
				clearTimeout(timerDownload)
				this.textStatus = ''
				this.textProgress = ''
				this.shadowRoot.getElementById('downloadProgressDialog').close()
				this.closeAppInfoDialog()
				await this.getAppsArrayData()
				await this.getFollowedNamesRefresh()
				await this.getFollowedNamesResource()
				this.updateComplete.then(() => this.requestUpdate())
			} else if (status.id === 'BUILDING') {
				this.textProgress = ''
				this.textStatus = status.description
				clearTimeout(timerDownload)
				timerDownload = setTimeout(checkStatus, 1000)
			} else if (status.id === 'BUILD_FAILED') {
				this.textProgress = ''
				clearTimeout(timerDownload)
				this.textStatus = status.description
			} else if (status.id === 'NOT_STARTED') {
				this.textProgress = ''
				this.textStatus = status.description
				clearTimeout(timerDownload)
				timerDownload = setTimeout(checkStatus, 1000)
			} else if (status.id === 'DOWNLOADING') {
				this.textStatus = status.description
				let progressString = get('appspage.schange42')
				this.textProgress = progressString + ': ' + status.localChunkCount + ' / ' + status.totalChunkCount
				clearTimeout(timerDownload)
				timerDownload = setTimeout(checkStatus, 1000)
			} else if (status.id === 'MISSING_DATA') {
				this.textProgress = ''
				this.textStatus = status.description
				clearTimeout(timerDownload)
				timerDownload = setTimeout(checkStatus, 5000)
			} else if (status.id === 'DOWNLOADED') {
				this.textProgress = ''
				this.textStatus = status.description
				clearTimeout(timerDownload)
				timerDownload = setTimeout(checkStatus, 1000)
			}
		}

		checkStatus()
	}

	async closeDownloadProgressDialog() {
		const closeDelay = ms => new Promise(res => setTimeout(res, ms))
		this.shadowRoot.getElementById('downloadProgressDialog').close()
		this.shadowRoot.getElementById('closeProgressDialog').open()
		await closeDelay(3000)
		this.shadowRoot.getElementById('closeProgressDialog').close()
		this.closeAppInfoDialog()
	}

	async followName(appName) {
		let name = appName

		let items = [
			name
		]

		let namesJsonString = JSON.stringify({ 'items': items })

		let ret = await parentEpml.request('apiCall', {
			url: `/lists/followedNames?apiKey=${this.getApiKey()}`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: `${namesJsonString}`
		})

		if (ret === true) {
			this.followedNames = this.followedNames.filter(item => item != name)
			this.followedNames.push(name)
			this.closeAppInfoDialog()
			await this.getFollowedNamesRefresh()
			await this.getFollowedNamesResource()
		} else {
			let err3string = get('appspage.schange22')
			parentEpml.request('showSnackBar', `${err3string}`)
		}

		return ret
	}

	async unfollowName(appName) {
		let name = appName

		let items = [
			name
		]

		let namesJsonString = JSON.stringify({ 'items': items })

		let ret = await parentEpml.request('apiCall', {
			url: `/lists/followedNames?apiKey=${this.getApiKey()}`,
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: `${namesJsonString}`
		})

		if (ret === true) {
			this.followedNames = this.followedNames.filter(item => item != name)
			this.closeAppInfoDialog()
			await this.getFollowedNamesRefresh()
			await this.getFollowedNamesResource()
		} else {
			let err4string = get('appspage.schange23')
			parentEpml.request('showSnackBar', `${err4string}`)
		}

		return ret
	}

	async blockName(appName) {
		let name = appName

		let items = [
			name
		]

		let namesJsonString = JSON.stringify({ 'items': items })

		let ret = await parentEpml.request('apiCall', {
			url: `/lists/blockedNames?apiKey=${this.getApiKey()}`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: `${namesJsonString}`
		})

		if (ret === true) {
			this.blockedNames = this.blockedNames.filter(item => item != name)
			this.blockedNames.push(name)
			this.closeAppInfoDialog()
			await this.getAppsArrayData()
			await this.getBlockedNamesRefresh()
			await this.getBlockedNamesResource()
		} else {
			let err5string = get('appspage.schange24')
			parentEpml.request('showSnackBar', `${err5string}`)
		}

		return ret
	}

	async unblockName(appName) {
		let name = appName

		let items = [
			name
		]

		let namesJsonString = JSON.stringify({ 'items': items })

		let ret = await parentEpml.request('apiCall', {
			url: `/lists/blockedNames?apiKey=${this.getApiKey()}`,
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: `${namesJsonString}`
		})

		if (ret === true) {
			this.blockedNames = this.blockedNames.filter(item => item != name)
			this.closeBlockedInfoDialog()
			await this.getBlockedNamesRefresh()
			await this.getBlockedNamesResource()
		} else {
			let err6string = get('appspage.schange25')
			parentEpml.request('showSnackBar', `${err6string}`)
		}

		return ret
	}

	renderSize(size) {
		if (size === null) {
			return html``
		}

		let sizeReadable = this.bytesToSize(size)

		return html`<span>${sizeReadable}</span>`
	}

	bytesToSize(bytes) {
		var sizes = ['bytes', 'KB', 'MB', 'GB', 'TB']
		if (bytes == 0) return '0 bytes'
		var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
		return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
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

window.customElements.define('q-apps', QApps)