import { LitElement, html, css } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
import { Epml } from '../epml.js'
import { addPluginRoutes } from '../plugins/addPluginRoutes.js'
import { repeat } from 'lit/directives/repeat.js';
import ShortUniqueId from 'short-unique-id';
import { setNewTab } from '../redux/app/app-actions.js'

import '@material/mwc-icon'

class ShowPlugin extends connect(store)(LitElement) {
    static get properties() {
        return {
            app: { type: Object },
            pluginConfig: { type: Object },
            url: { type: String },
            linkParam: { type: String },
            registeredUrls: { type: Array },
            currentTab: { type: Number },
            tabs: { type: Array },
            theme: { type: String, reflect: true },
        }
    }

    static get styles() {
        return css`
            html {
                --scrollbarBG: #a1a1a1;
                --thumbBG: #6a6c75;
            }

            *::-webkit-scrollbar {
                width: 11px;
            }

            * {
                scrollbar-width: thin;
                scrollbar-color: var(--thumbBG) var(--scrollbarBG);
            }

            *::-webkit-scrollbar-track {
                background: var(--scrollbarBG);
            }

            *::-webkit-scrollbar-thumb {
                background-color: var(--thumbBG);
                border-radius: 6px;
                border: 3px solid var(--scrollbarBG);
            }
            
            .hideIframe  {
                visibility: hidden;
                position: absolute;
                zIndex: -10;  
            }

            .showIframe  {
                zIndex: 1;
                position: relative;
                visibility: visible;
            }

            .tabs {
                display: flex;
                justify-content: flex-start;
                padding-top: 0.5em;
                padding-left: 0.5em;
                background: var(--sidetopbar);
                border-bottom: 1px solid var(--black);
                height: 48px;
                box-sizing: border-box;
            }

            .tab {
                padding: 0.5em;
                background: var(--white);
                border-top-right-radius: 10px;
                border-top-left-radius: 10px;
                border-top: 1px solid grey;
                border-left: 1px solid grey;
                border-right: 1px solid grey;
                color: grey;
                cursor: pointer;
                transition: background 0.3s;
                position: relative;
                min-width: 120px;
                max-width: 200px;
                overflow: hidden;
                text-wrap: nowrap;
                text-overflow: ellipsis;
                text-overflow: ellipsis;
            }

            .tab:hover {
                background: var(--nav-color-hover);
                color: #03a9f4;
                font-weight: bold;
            }

            .tab.active {
                margin-bottom: -1px;
                background: var(--white);
                color: var(--black);
                border-top-right-radius: 10px;
                border-top-left-radius: 10px;
                border-top: 1px solid var(--black);
                border-left: 1px solid var(--black);
                border-right: 1px solid var(--black);
                border-bottom: 1px solid var(--white);
            }

            .close {
                color: #999;
                font-weight: bold;
                font-size: 20px;
                line-height: 20px;
                position: absolute;
                top: 7px;
                right: 8px;
            }

            .title {
                display: inline;
            }

            .close:hover {
                color: red;
            }

            .add-tab-button {
                font-weight: bold;
                background: none;
                border: none;
                color: #03a9f4;
                font-size: 2em;
                cursor: pointer;
                transition: color 0.3s;
            }

            .add-tab-button:hover {
                color: var(--black);
            }

            .iconActive {
                position: absolute;
                top: 7px;
                color: #03a9f4;
                --mdc-icon-size: 20px;
            }

            .iconInactive {
                position: absolute;
                top: 7px;
                color: #999;
                --mdc-icon-size: 20px;
            }
        `
    }

    constructor() {
        super()
        this.registeredUrls = []
        this.currentTab = 0
        this.tabs = []
        this.uid = new ShortUniqueId()
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    async getUpdateComplete() {
        await super.getUpdateComplete()
        return true
    }

    async addTab(tab) {
        this.tabs = [...this.tabs, tab]
        await this.getUpdateComplete();

        // add the new tab to the tabs array
        const newIndex = this.tabs.length - 1

        // render the tab and wait for it to be added to the DOM
        const frame = this.shadowRoot.getElementById(`showPluginFrame${newIndex}`)
        this.createEpmlInstance(frame, newIndex)
    }

    render() {
        const plugSrc = (myPlug) => {
            return myPlug === undefined ? 'about:blank' : `${window.location.origin}/plugin/${myPlug.domain}/${myPlug.page}${this.linkParam}`
        }

        return html`
            <div class="tabs">
                ${this.tabs.map((tab, index) => html`
                    <div 
                        class="tab ${this.currentTab === index ? 'active' : ''}"
                        @click=${() => this.currentTab = index}
                    >
                        <div class="title">
                            <div class="${this.currentTab === index ? "iconActive" : "iconInactive"}">
                                <mwc-icon>${tab.myPlugObj && tab.myPlugObj.mwcicon}</mwc-icon>
                            </div>
                            <div>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                ${tab.myPlugObj && tab.myPlugObj.title}
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </div>
                            <div class="close" @click=${() => { this.removeTab(index) }}>x</div>
                        </div>
                    </div>
                `)}&nbsp;&nbsp;&nbsp;
                <button 
                    class="add-tab-button" 
                    title="Add Tab"
                    @click=${() => {
                        const lengthOfTabs = this.tabs.length
                        this.addTab({
                            url: "",
                            id: this.uid()
                        })
                        this.currentTab = lengthOfTabs
                    }}
                >
                    +
                </button>
            </div>

            ${repeat(this.tabs, (tab) => tab.id, (tab, index) => html`
                <div class=${this.currentTab === index ? "showIframe" : "hideIframe"}>
                    <iframe src="${plugSrc(tab.myPlugObj)}" id="showPluginFrame${index}" style="width:100%;
                        height:calc(var(--window-height) - 102px);
                        border:0;
                        padding:0;
                        margin:0"
                        class=${!tab.myPlugObj ? "hideIframe" : ""}
                    >
                    </iframe>
                    <nav-bar class=${!tab.myPlugObj ? "showIframe" : "hideIframe"} .registeredUrls=${this.registeredUrls} .changePage=${(val) => this.changePage(val)}>
                    </nav-bar>
                </div>
            `)}     
        `
    }

    removeTab(index) {
        // Remove tab from array
        this.tabs = this.tabs.filter((tab, tIndex) => tIndex !== index)
        if (this.tabs.length !== 0) {
            this.currentTab = 0
        }
    }

    createEpmlInstance(frame, index) {
        const showingPluginEpml = new Epml({
            type: 'WINDOW',
            source: frame.contentWindow
        })

        addPluginRoutes(showingPluginEpml);
        showingPluginEpml.imReady();

        // store Epml instance in tab for later use
        this.tabs[index].epmlInstance = showingPluginEpml

        // Register each instance with a unique identifier
        Epml.registerProxyInstance(`visible-plugin-${index}`, showingPluginEpml)
    }

    firstUpdated() {
        this.tabs.forEach((tab, index) => {
            const frame = this.shadowRoot.getElementById(`showPluginFrame${index}`)
            this.createEpmlInstance(frame, index)
        })
    }

    updated(changedProps) {
        if (changedProps.has('url') || changedProps.has('registeredUrls')) {
            const plugArr = []

            this.registeredUrls.forEach(myPlugArr => {
                myPlugArr.menus.length === 0 ? plugArr.push(myPlugArr) : myPlugArr.menus.forEach(i => plugArr.push(myPlugArr, i))
            })

            const myPlugObj = plugArr.find(pagePlug => {
                return pagePlug.url === this.url
            })

            if (this.tabs.length === 0) {
                this.addTab({
                    url: this.url,
                    myPlugObj,
                    id: this.uid()
                })
            } else {
                const copiedTabs = [...this.tabs]
                copiedTabs[this.currentTab] = {
                    ...copiedTabs[this.currentTab],
                    url: this.url,
                    myPlugObj
                }
                this.tabs = copiedTabs
            }
            this.requestUpdate()
        }


        if (changedProps.has('computerUrl')) {
            if (this.computedUrl !== 'about:blank') {
                this.loading = true
            }
        }
    }

    changePage(page) {
        const copiedTabs = [...this.tabs]
        copiedTabs[this.currentTab] = {
            ...copiedTabs[this.currentTab],
            myPlugObj: page,
            url: page.url
        }
        this.tabs = copiedTabs
    }

    stateChanged(state) {
        const split = state.app.url.split('/')
        const newRegisteredUrls = state.app.registeredUrls

        let newUrl, newLinkParam

        if (newRegisteredUrls !== this.registeredUrls) {
            this.registeredUrls = newRegisteredUrls
        }

        if (split[0] === '' && split[1] === 'app' && split[2] === undefined) {
            newUrl = 'wallet'
            newLinkParam = ''
        } else if (split.length === 5 && split[1] === 'app') {
            newUrl = split[2]
            newLinkParam = split[3] === undefined ? '' : '?' + split[3] + '/' + split[4]
        } else if (split[1] === 'app') {
            newUrl = split[2]
            newLinkParam = ''
        } else {
            newUrl = '404'
            newLinkParam = ''
        }

        if (newUrl !== this.url) {
            this.url = newUrl
        }

        if (newLinkParam !== this.linkParam) {
            this.linkParam = newLinkParam
        }

        if (state.app.newTab) {
            const newTab = state.app.newTab
            if (!this.tabs.find((tab) => tab.id === newTab.id)) {
                this.addTab(newTab)
                this.currentTab = this.tabs.length - 1
                store.dispatch(setNewTab(null))
                //clear newTab
            } else {
                const findIndex = this.tabs.findIndex((tab) => tab.id === newTab.id)
                if (findIndex !== -1) {
                    const copiedTabs = [...this.tabs]
                    copiedTabs[findIndex] = newTab
                    this.tabs = copiedTabs
                    this.currentTab = findIndex
                }

                store.dispatch(setNewTab(null))
                //clear newTab
            }

        }
    }
}

window.customElements.define('show-plugin', ShowPlugin)

class NavBar extends connect(store)(LitElement) {
    static get properties() {
        return {
            menuList: { type: Array },
            newMenuList: { type: Array },
            myMenuList: { type: Array },
            addressInfo: { type: Object },
            changePage: { attribute: false }
        }
    }

    constructor() {
        super()
        this.menuList = []
        this.newMenuList = []
        this.myMenuList = []
        this.addressInfo = {}
    }

    static styles = css`
        .parent {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            overflow-y: auto;
        }

        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: color: var(--white);
            padding: 10px 20px;
            max-width: 750px;
            width: 80%;
        }

        .navbar input {
            font-size: 16px;
            color: #000;
            padding: 5px;
            flex-grow: 1;
            margin-right: 10px;
            border: 1px solid var(--black);
        }

        .navbar button {
            padding: 5px 10px;
            font-size: 18px;
            background-color: var(--app-background-1);
            background-image: linear-gradient(315deg, var(--app-background-1) 0%, var(--app-background-2) 74%);
            color: var(--app-icon);
            border: 1px solid transparent;
            border-radius: 3px;
            cursor: pointer;
        }

        .navbar button:hover {
            background-color: #45a049;
        }

        .app-list {
            display: flex;
            justify-content: space-between;
            padding: 20px 0;
            gap: 20px;
            flex-wrap: wrap;
        }

        .app-list .app-icon {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            color: var(--black);
            width: 150px;
            height: 110px;
            background: transparent;
            padding: 5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            cursor: pointer;
        }

        .app-list .app-icon span {
            display: block;
        }

        .app-icon-box {
            display: flex;
            align-items: center;
            padding-left: 14px;
            width: 80px;
            height: 80px;
            background-color: var(--app-background-1);
            background-image: linear-gradient(315deg, var(--app-background-1) 0%, var(--app-background-2) 74%);
            border-top-left-radius: 10px;
            border-top-right-radius: 20px;
            border-bottom-left-radius: 20px;
            border-bottom-right-radius: 10px;
        }

        .menuIcon {
            color: var(--app-icon);
            --mdc-icon-size: 64px;
        }
    `

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
                let responseObj = await parentEpml.request('apiCall', {
                    url: `${nodeUrl}/arbitrary/resource/status/${service}/${name}/${identifier}?apiKey=${myNode.apiKey}}`
                })

                if (responseObj.totalChunkCount > 0) {
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

    async getQuery(value) {
        let newQuery = value
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

        this.changePage({
            "url": "qapp",
            "domain": "core",
            "page": `qdn/browser/index.html${query}`,
            "title": "Q-App",
            "icon": "vaadin:external-browser",
            "mwcicon": "open_in_browser",
            "menus": [],
            "parent": false
        })
    }

    async handlePasteLink(e) {
        const value = this.shadowRoot.getElementById('linkInput').value
        this.getQuery(value)
    }

    async _handleKeyDown(e) {
        if (e.key === 'Enter') {
            const value = this.shadowRoot.getElementById('linkInput').value
            this.getQuery(value)
        }
    }

    render() {
        return html`
            <div class="parent">
                <div class="navbar">
                    <input @keydown=${this._handleKeyDown} id="linkInput" type="text" placeholder="qortal://" />
                    <button @click="${this.handlePasteLink}">Go</button>
                </div>
                <div>
                    <div class="app-list">
                        ${repeat(this.myMenuList, (plugin) => plugin.url, (plugin, index) => html`
                            <div class="app-icon" @click=${() => {
                                this.changePage(plugin)
                            }}>
                                <div class="app-icon-box">
                                    <mwc-icon class="menuIcon">${plugin.mwcicon}</mwc-icon>
                                </div>
                                <span>${plugin.title}</span>
                            </div>
                        `)}
                    </div>
                </div>
            </div>
        `
    }

    firstUpdated() {
        const addressInfo = this.addressInfo
        const isMinter = addressInfo?.error !== 124 && +addressInfo?.level > 0
        const isSponsor = +addressInfo?.level >= 5

        if (!isMinter) {
            this.newMenuList = this.menuList.filter((minter) => {
                return minter.url !== 'minting'
            })
        } else {
            this.newMenuList = this.menuList.filter((minter) => {
                return minter.url !== 'become-minter'
            })
        }

        if (!isSponsor) {
            this.myMenuList = this.newMenuList.filter((sponsor) => {
                return sponsor.url !== 'sponsorship-list'
            })
        } else {
            this.myMenuList = this.newMenuList
        }
    }

    stateChanged(state) {
        this.menuList = state.app.registeredUrls
        this.addressInfo = state.app.accountInfo.addressInfo
    }
}

customElements.define('nav-bar', NavBar)