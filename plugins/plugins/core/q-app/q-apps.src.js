import {css, html, LitElement} from 'lit'
import {Epml} from '../../../epml.js'
import {get, registerTranslateConfig, translate, use} from '../../../../core/translate'
import isElectron from 'is-electron'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/iron-icons/iron-icons.js'
import '@material/mwc-icon'
import '@material/mwc-button'
import '@material/mwc-tab-bar'
import '@vaadin/text-field'

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
            isLoading: {type: Boolean},
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
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --mdc-button-disabled-fill-color: rgba(3, 169, 244, 0.5);
                --mdc-theme-surface: var(--white);
                --paper-input-container-focus-color: var(--mdc-theme-primary);
                --lumo-primary-text-color: rgb(0, 167, 245);
                --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
                --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
                --lumo-primary-color: hsl(199, 100%, 48%);
                --lumo-base-color: var(--white);
                --lumo-body-text-color: var(--black);
                --lumo-secondary-text-color: var(--sectxt);
                --lumo-contrast-60pct: var(--vdicon);
                --_lumo-grid-border-color: var(--border);
                --_lumo-grid-secondary-border-color: var(--border2);
            }

            [hidden] {
                display: hidden !important;
                visibility: none !important;
            }

            h2 {
                margin: 0;
            }

            h3 {
                margin: 10px 0;
            }

            h4 {
                margin: 0;
            }

            h5 {
                margin: 5px 0;
                font-size: 14px;
            }

            h6 {
                margin: 5px 0;
                text-transform: uppercase;
                color: var(--black);
                font-weight: 600;
            }

            h2, h3, h4, h5 {
                color: var(--black);
                font-weight: 400;
            }

            p {
                font-size: 14px;
                line-height: 21px;
                color: var(--black);
            }

            span {
                font-size: 14px;
                word-break: break-all;
            }

            #tabs-1 {
                --mdc-tab-height: 50px;
            }

            #tabs-1-content {
                height: 100%;
                padding-bottom: 10px;
            }

            mwc-tab-bar {
                --mdc-text-transform: none;
                --mdc-tab-color-default: var(--black);
                --mdc-tab-text-label-color-default: var(--black);
	    }

            #apps-list-page {
                background: var(--white);
                padding: 12px 24px;
            }

            .search {
                display: inline;
                width: 50%;
                align-items: center;
            }

            paper-spinner-lite {
                height: 30px;
                width: 30px;
                --paper-spinner-color: var(--mdc-theme-primary);
                --paper-spinner-stroke-width: 3px;
            }

            .spinner {
                width: 100%;
                display: flex;
                justify-content: center;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            paper-dialog.progress {
                width: auto;
                max-width: 50vw;
                height: auto;
                max-height: 30vh;
                background-color: var(--white);
                color: var(--black);
                border: 1px solid var(--black);
                border-radius: 15px;
                text-align:center;
                padding: 15px;
                line-height: 1.6;
                overflow: hidden;
            }

            paper-dialog.close-progress {
                min-width: 550px;
                max-width: 550px;
                height: auto;
                background-color: var(--white);
                color: var(--black);
                border: 1px solid var(--black);
                border-radius: 15px;
                text-align:center;
                padding: 15px;
                font-size: 17px;
                font-weight: 500;
                line-height: 20px;
                overflow: hidden;
            }

            paper-dialog.search {
                min-width: 550px;
                max-width: 550px;
                min-height: auto;
                max-height: 700px;
                background-color: var(--white);
                color: var(--black);
                line-height: 1.6;
                overflow: auto;
                border: 1px solid var(--black);
                border-radius: 10px;
                padding: 15px;
                box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
            }

            paper-dialog.appinfo {
                width: auto;
                max-width: 450px;
                height: auto;
                background-color: var(--white);
                border: 1px solid var(--black);
                border-radius: 15px;
                padding: 5px;
                overflow-y: auto;
            }

            .relay-mode-notice {
                margin: auto;
                margin-top: 20px;
                text-align: center;
                word-break: normal;
                font-size: 14px;
                line-height: 20px;
                color: var(--relaynodetxt);
            }

            .lds-roller {
                display: inline-block;
                position: relative;
                width: 80px;
                height: 80px;
            }

            .lds-roller div {
                animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                transform-origin: 40px 40px;
            }

            .lds-roller div:after {
                content: " ";
                display: block;
                position: absolute;
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: var(--black);
                margin: -4px 0 0 -4px;
            }

            .lds-roller div:nth-child(1) {
                animation-delay: -0.036s;
            }

            .lds-roller div:nth-child(1):after {
                top: 63px;
                left: 63px;
            }

            .lds-roller div:nth-child(2) {
                animation-delay: -0.072s;
            }

            .lds-roller div:nth-child(2):after {
                top: 68px;
                left: 56px;
            }

            .lds-roller div:nth-child(3) {
                animation-delay: -0.108s;
            }

            .lds-roller div:nth-child(3):after {
                top: 71px;
                left: 48px;
            }

            .lds-roller div:nth-child(4) {
                animation-delay: -0.144s;
            }

            .lds-roller div:nth-child(4):after {
                top: 72px;
                left: 40px;
            }

            .lds-roller div:nth-child(5) {
                animation-delay: -0.18s;
            }

            .lds-roller div:nth-child(5):after {
                top: 71px;
                left: 32px;
            }

            .lds-roller div:nth-child(6) {
                animation-delay: -0.216s;
            }

            .lds-roller div:nth-child(6):after {
                top: 68px;
                left: 24px;
            }

            .lds-roller div:nth-child(7) {
                animation-delay: -0.252s;
            }

            .lds-roller div:nth-child(7):after {
                top: 63px;
                left: 17px;
            }

            .lds-roller div:nth-child(8) {
                animation-delay: -0.288s;
            }

            .lds-roller div:nth-child(8):after {
                top: 56px;
                left: 12px;
            }

            @keyframes lds-roller {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }

            .grid-container {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                gap: 10px;
            }

            .grid-container-search {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
            }

            .container {
                height: 84px;
                width: 84px;
                overflow: hidden;
                margin: 10px auto;
                border-radius: 25%;
                border: 1px solid var(--black);
                transition: all 0.3s ease-in-out;
                box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.3);
                background: linear-gradient(315deg, #045de9 0%, #09c6f9 74%);
            }

            img {
                cursor: pointer;
                position: relative;
                border-radius: 25%;
                display: block;
                height: 64px;
                width: 64px;
                object-fit: cover;
                margin: 10px auto;
                transition: all 0.3s ease;
            }

            .round-icon {
                margin-top: -87px;
                margin-left: 69px;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                border: 1px solid #64dd17;
                background-color: #76ff03;
            }

            .myapptitle {
                display: flex;
                justify-content: center;
                max-height: 32px;
                overflow: hidden;
                text-overflow: ellipsis;
                color: var(--black);
                font-size: 17px;
                font-weight: 500;
                padding: 10px;
                line-height: 20px;
                margin-top: -10px;
                text-align: center;
            }

            @media (min-width: 400px) {
                .grid-container {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }
            }

            @media (min-width: 640px) {
                .grid-container {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                }
            }

            @media (min-width: 767px) {
                .grid-container {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 10px;
                }
            }

            @media (min-width: 1024px) {
                .grid-container {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 10px;
                }
            }

            @media (min-width: 1280px) {
                .grid-container {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 10px;
                }
            }

            @media (min-width: 1600px) {
                .grid-container {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 10px;
                }
            }

            @media (min-width: 1920px) {
                .grid-container {
                    display: grid;
                    grid-template-columns: repeat(8, 1fr);
                    gap: 10px;
                }
            }

            .card-container {
                background-color: var(--white);
                color: var(--black);
                position: relative;
                width: 350px;
                max-width: 100%;
                text-align: center;
            }

            .card-container .block {
                color: rgb(3, 169, 244);
                background-color: transparent;
                border-radius: 3px;
                border: 1px solid rgb(3, 169, 244);
                font-size: 14px;
                font-weight: bold;
                padding: 3px 7px;
                position: absolute;
                top: 30px;
                left: 30px;
            }

            .card-container .block:hover {
                color: #FFF;
                background-color: rgb(3, 169, 244);
                cursor: pointer;
            }

            .card-container .close {
                color: #df3636;
                background-color: transparent;
                border-radius: 3px;
                border: 1px solid #df3636;
                font-size: 14px;
                font-weight: bold;
                padding: 3px 7px;
                position: absolute;
                top: 30px;
                right: 30px;
            }

            .card-container .close:hover {
                color: #FFF;
                background-color: #df3636;
                cursor: pointer;
            }

            .card-container img {
                height: 96px;
                width: 96px;
            }

            .buttons {
                display: flex;
                justify-content: space-between;
                margin: 10px;
            }

            button.primary {
                background-color: transparent;
                border: 1px solid rgb(3, 169, 244);
                border-radius: 3px;
                color: rgb(3, 169, 244);
                font-family: Montserrat, sans-serif;
                font-weight: 500;
                padding: 10px 25px;
            }

            button.primary:hover {
                background-color: rgb(3, 169, 244);
                color: #FFF;
                cursor: pointer;
            }

            button.secondary {
                background-color: transparent;
                border: 1px solid #198754;
                border-radius: 3px;
                color: #198754;
                font-family: Montserrat, sans-serif;
                font-weight: 500;
                padding: 10px 25px;
            }

            button.secondary:hover {
                background-color: #198754;
                color: #FFF;
                cursor: pointer;
            }

            .tags {
                background-color: var(--white);
                text-align: left;
                padding: 10px;
                margin-top: 10px;
            }

            .tags ul {
                list-style-type: none;
                margin: 0;
                padding: 0;
            }

            .tags ul li {
                border: 1px solid rgb(3, 169, 244);
                border-radius: 3px;
                display: inline-block;
                font-size: 12px;
                margin: 0 7px 7px 0;
                padding: 7px;
            }

            .close-download {
                color: var(--black);
                font-size: 14px;
                font-weight: bold;
                position: absolute;
                top: -15px;
                right: -15px;
            }

            .close-download:hover {
                color: #df3636;
            }
        `
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
        this.service = "APP"
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
                        ${this.isEmptyArray(this.followedResources) ? html`<div class="relay-mode-notice">${translate("appspage.schange13")}</div>` : ''}
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
                        ${this.isEmptyArray(this.blockedResources) ? html`<div class="relay-mode-notice">${translate("appspage.schange16")}</div>` : ''}
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
                <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
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
                    <h5>${translate("appspage.schange7")}: ${this.appPublisher}</h6>
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
                    <h5>${translate("appspage.schange7")}: ${this.appPublisher}</h6>
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

            if (checkTheme) {
                this.theme = checkTheme
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
        if (checkTheme) {
            this.theme = checkTheme
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

    getAppsArrayData = async () => {
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
                    tags = item.metadata.tags.join(", ")
                }
            }
            const status1 = item.status.description
            const status2 = item.status.status

            const openDialog = () => {this.openAppInfoDialog(url, title, name, description, tags, status1, status2)}

            let clickTimeout
            let isDoubleClick = false

            const widgetElement = document.createElement('div')

            const myImage = document.createElement('img')
            myImage.src = `${url}`
            myImage.onerror = function() {
                myImage.src = '/img/incognito.png'
            }
            myImage.addEventListener('click', function() {
                clickTimeout = setTimeout(function() {
                    if (!isDoubleClick) {
                        openDialog()
                    }
                    isDoubleClick = false
                }, 250)
            })
            myImage.addEventListener('dblclick', function() {
                clearTimeout(clickTimeout)
                isDoubleClick = true
                window.location.href = `../qdn/browser/index.html?name=${item.name}&service=APP`
            })

            const myStatus = document.createElement('div')
            myStatus.classList.add('round-icon')

            const myContainer = document.createElement('div')
            myContainer.classList.add('container')
            myContainer.appendChild(myImage)
            if (item.status.description === "Published but not yet downloaded" || item.status.status === "MISSING_DATA") {
            } else if (item.status.description === "Ready" || item.status.status === "DOWNLOADED") {
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

    getFollowedNamesRefresh = async () => {
        this.isLoading = true
		this.followedNames = await parentEpml.request('apiCall', {
			url: `/lists/followedNames?apiKey=${this.getApiKey()}`
		})
        this.isLoading = false
    }

    getFollowedNamesResource = async () => {
        this.isLoading = true
		this.followedResources = await parentEpml.request('apiCall', {
			url: `/arbitrary/resources?service=${this.service}&default=true&limit=0&reverse=false&includestatus=true&includemetadata=true&namefilter=followedNames`
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
                    tags = item.metadata.tags.join(", ")
                }
            }
            const status1 = item.status.description
            const status2 = item.status.status

            const openDialog = () => {this.openAppInfoDialog(url, title, name, description, tags, status1, status2)}

            let clickTimeout
            let isDoubleClick = false

            const widgetElement = document.createElement('div')

            const myImage = document.createElement('img')
            myImage.src = `${url}`
            myImage.onerror = function() {
                myImage.src = '/img/incognito.png'
            }
            myImage.addEventListener('click', function() {
                clickTimeout = setTimeout(function() {
                    if (!isDoubleClick) {
                        openDialog()
                    }
                    isDoubleClick = false
                }, 250)
            })
            myImage.addEventListener('dblclick', function() {
                clearTimeout(clickTimeout)
                isDoubleClick = true
                window.location.href = `../qdn/browser/index.html?name=${item.name}&service=APP`
            })

            const myStatus = document.createElement('div')
            myStatus.classList.add('round-icon')

            const myContainer = document.createElement('div')
            myContainer.classList.add('container')
            myContainer.appendChild(myImage)
            if (item.status.description === "Published but not yet downloaded" || item.status.status === "MISSING_DATA") {
            } else if (item.status.description === "Ready" || item.status.status === "DOWNLOADED") {
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

    getBlockedNamesRefresh = async () => {
        this.isLoading = true
		this.blockedNames = await parentEpml.request('apiCall', {
			url: `/lists/blockedNames?apiKey=${this.getApiKey()}`
		})
        this.isLoading = false
    }

    getBlockedNamesResource = async () => {
        this.isLoading = true
        this.blockedResources = []
		this.blockedResources = await parentEpml.request('apiCall', {
			url: `/arbitrary/resources?service=${this.service}&default=true&limit=0&reverse=false&includestatus=true&includemetadata=true&namefilter=blockedNames`
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
                    tags = item.metadata.tags.join(", ")
                }
            }
            const status1 = item.status.description
            const status2 = item.status.status

            const openDialog = () => {this.openBlockedInfoDialog(url, title, name, description, tags, status1, status2)}

            let clickTimeout
            let isDoubleClick = false

            const widgetElement = document.createElement('div')

            const myImage = document.createElement('img')
            myImage.src = `${url}`
            myImage.onerror = function() {
                myImage.src = '/img/incognito.png'
            }
            myImage.addEventListener('click', function() {
                clickTimeout = setTimeout(function() {
                    if (!isDoubleClick) {
                        openDialog()
                    }
                    isDoubleClick = false
                }, 250)
            })
            myImage.addEventListener('dblclick', function() {
                clearTimeout(clickTimeout)
                isDoubleClick = true
            })

            const myStatus = document.createElement('div')
            myStatus.classList.add('round-icon')

            const myContainer = document.createElement('div')
            myContainer.classList.add('container')
            myContainer.appendChild(myImage)
            if (item.status.description === "Published but not yet downloaded" || item.status.status === "MISSING_DATA") {
            } else if (item.status.description === "Ready" || item.status.status === "DOWNLOADED") {
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
        if (status1 === "Published but not yet downloaded" || status2 === "MISSING_DATA") {
            this.appStatus = html`<button class="primary" @click=${() => this.downloadApp(name)}>${translate("appspage.schange36")}</button>`
        } else if (status1 === "Ready" || status2 === "DOWNLOADED") {
            this.appStatus = html`<button class="secondary" @click=${() => window.location.href = `../qdn/browser/index.html?name=${name}&service=APP`}>${translate("appspage.schange39")}</button>`
        } else {
            this.appStatus = html`<button class="primary" @click=${() => this.downloadApp(name)}>${translate("appspage.schange36")}</button>`
        }
        if (this.followedNames.indexOf(name) === -1) {
           this.appFollow = html`<button class="primary" @click=${() => this.followName(name)}>${translate("appspage.schange29")}</button>`
        } else {
           this.appFollow = html`<button class="primary" @click=${() => this.unfollowName(name)}>${translate("appspage.schange30")}</button>`
        }
        if (this.blockedNames.indexOf(name) === -1) {
            this.appBlock = html`<span class="block" @click=${() => this.blockName(name)}>${translate("appspage.schange31")}</span>`
        } else {
            this.appBlock = html`<span class="block" @click=${() => this.unblockName(name)}>${translate("appspage.schange32")}</span>`
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
            this.appBlock = html`<span class="block" @click=${() => this.blockName(name)}>${translate("appspage.schange31")}</span>`
        } else {
            this.appBlock = html`<span class="block" @click=${() => this.unblockName(name)}>${translate("appspage.schange32")}</span>`
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
        return html`<mwc-button style="float:right;" @click=${() =>  this.openSearchDialog()}><mwc-icon>search</mwc-icon>${translate("appspage.schange4")}</mwc-button>`
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
            let err1string = get("appspage.schange34")
            parentEpml.request('showSnackBar', `${err1string}`)
        } else {
            const searchResourcesRes = await parentEpml.request('apiCall', {
                url: `/arbitrary/resources/search?service=${this.service}&query=${searchName}&default=true&limit=0&reverse=false&includestatus=true&includemetadata=true&excludeblocked=true`
            })
            if (this.isEmptyArray(searchResourcesRes)) {
                let err2string = get("appspage.schange17")
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
                tags = item.metadata.tags.join(", ")
            }
            const status1 = item.status.description
            const status2 = item.status.status

            const openDialog = () => {this.openAppInfoDialog(url, title, name, description, tags, status1, status2)}

            let clickTimeout
            let isDoubleClick = false

            const widgetElement = document.createElement('div')

            const myImage = document.createElement('img')
            myImage.src = `${url}`
            myImage.onerror = function() {
                myImage.src = '/img/incognito.png'
            }
            myImage.addEventListener('click', function() {
                clickTimeout = setTimeout(function() {
                    if (!isDoubleClick) {
                        openDialog()
                    }
                    isDoubleClick = false
                }, 250)
            })
            myImage.addEventListener('dblclick', function() {
                clearTimeout(clickTimeout)
                isDoubleClick = true
                window.location.href = `../qdn/browser/index.html?name=${item.name}&service=APP`
            })

            const myStatus = document.createElement('div')
            myStatus.classList.add('round-icon')

            const myContainer = document.createElement('div')
            myContainer.classList.add('container')
            myContainer.appendChild(myImage)
            if (item.status.description === "Published but not yet downloaded" || item.status.status === "MISSING_DATA") {
            } else if (item.status.description === "Ready" || item.status.status === "DOWNLOADED") {
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
            return html`<div class="relay-mode-notice">${translate("appspage.schange18")} <strong>"relayModeEnabled": false</strong> ${translate("appspage.schange19")} settings.json</div>`
        } else if (this.relayMode === false) {
            return html`<div class="relay-mode-notice">${translate("appspage.schange20")} <strong>"relayModeEnabled": true</strong> ${translate("appspage.schange19")} settings.json</div>`
        }
    }

    renderPublishButton() {
        if (this.followedNames == null || !Array.isArray(this.followedNames)) {
            return html``
        }
        return html`<mwc-button style="float:right;" @click=${() => this.publishApp()}><mwc-icon>add</mwc-icon>${translate("appspage.schange21")}</mwc-button>`
    }

    publishApp() {
        window.location.href = `../qdn/publish/index.html?service=${this.service}&identifier=${this.identifier}&uploadType=zip&category=app&showName=true&showService=false&showIdentifier=false&showMetadata=true`
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
            const service = this.service
            const name = appname

            const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
            const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
            const url = `${nodeUrl}/arbitrary/resource/status/${service}/${name}?build=true&apiKey=${this.getApiKey()}`

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

            if (status.id === "UNSUPPORTED") {
                this.textProgress = ''
                clearTimeout(timerDownload)
                this.textStatus = status.description
            } else if (status.id === "BLOCKED") {
                this.textProgress = ''
                this.textStatus = name + " is blocked so content cannot be served"
                clearTimeout(timerDownload)
                timerDownload = setTimeout(checkStatus, 5000)
            } else if (status.id === "READY") {
                clearTimeout(timerDownload)
                this.textStatus = ''
                this.textProgress = ''
                this.shadowRoot.getElementById('downloadProgressDialog').close()
                this.closeAppInfoDialog()
                await this.getAppsArrayData()
                await this.getFollowedNamesRefresh()
                await this.getFollowedNamesResource()
                this.updateComplete.then(() => this.requestUpdate())
            } else if (status.id === "BUILDING") {
                this.textProgress = ''
                this.textStatus = status.description
                clearTimeout(timerDownload)
                timerDownload = setTimeout(checkStatus, 1000)
            } else if (status.id === "BUILD_FAILED") {
                this.textProgress = ''
                clearTimeout(timerDownload)
                this.textStatus = status.description
            } else if (status.id === "NOT_STARTED") {
                this.textProgress = ''
                this.textStatus = status.description
                clearTimeout(timerDownload)
                timerDownload = setTimeout(checkStatus, 1000)
            } else if (status.id === "DOWNLOADING") {
                this.textStatus = status.description
                let progressString = get("appspage.schange42")
                this.textProgress = progressString + ": " + status.localChunkCount + " / " + status.totalChunkCount
                clearTimeout(timerDownload)
                timerDownload = setTimeout(checkStatus, 1000)
            } else if (status.id === "MISSING_DATA") {
                this.textProgress = ''
                this.textStatus = status.description
                clearTimeout(timerDownload)
                timerDownload = setTimeout(checkStatus, 5000)
            } else if (status.id === "DOWNLOADED") {
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
        let namesJsonString = JSON.stringify({ "items": items })

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
            let err3string = get("appspage.schange22")
            parentEpml.request('showSnackBar', `${err3string}`)
        }
        return ret
    }

    async unfollowName(appName) {
        let name = appName
        let items = [
            name
        ]
        let namesJsonString = JSON.stringify({ "items": items })

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
            let err4string = get("appspage.schange23")
            parentEpml.request('showSnackBar', `${err4string}`)
        }
        return ret
    }

    async blockName(appName) {
        let name = appName
        let items = [
            name
        ]
        let namesJsonString = JSON.stringify({ "items": items })

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
            let err5string = get("appspage.schange24")
            parentEpml.request('showSnackBar', `${err5string}`)
        }
        return ret
    }

    async unblockName(appName) {
        let name = appName
        let items = [
            name
        ]
        let namesJsonString = JSON.stringify({ "items": items })

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
            let err6string = get("appspage.schange25")
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

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.apiKey
    }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }
}

window.customElements.define('q-apps', QApps)
