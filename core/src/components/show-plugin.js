import { LitElement, html, css } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
import { Epml } from '../epml.js'
import { addPluginRoutes } from '../plugins/addPluginRoutes.js'
import { repeat } from 'lit/directives/repeat.js';
import ShortUniqueId from 'short-unique-id';
import { setNewTab } from '../redux/app/app-actions.js'
import localForage from 'localforage'
import { use, get, translate, translateUnsafeHTML, registerTranslateConfig } from 'lit-translate'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-icon'
import '@material/mwc-textfield'

const chatLastSeen = localForage.createInstance({
    name: "chat-last-seen",
})

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

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
            tabInfo: { type: Object },
            chatLastSeen: { type: Array },
            chatHeads: { type: Array }
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
                display: none;
                position: absolute;
                zIndex: -10;
            }

            .showIframe  {
                display: block;
                position: relative;
                zIndex: 1;
            }

            .tabs {
                display: flex;
                width: 100%;
                max-width: 100%;
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
                width: auto;
                min-width: 50px;
                max-width: 200px;
                overflow: hidden;
                zIndex: 2;
            }

            .tabCard {
                display: inline-block;
            }

            .tabTitle {
                display: inline-block;
                position: relative;
                width: auto;
                min-width: 25px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .tab:hover {
                background: var(--nav-color-hover);
                color: var(--black);
                min-width: fit-content;
            }

            .tab.active {
                display: inline-block;
                min-width: fit-content;
                max-width: 200px;
                margin-bottom: -1px;
                background: var(--white);
                color: var(--black);
                border-top-right-radius: 10px;
                border-top-left-radius: 10px;
                border-top: 1px solid var(--black);
                border-left: 1px solid var(--black);
                border-right: 1px solid var(--black);
                border-bottom: 1px solid var(--white);
                zIndex: 1;
            }

            .close {
                position: absolute;
                top: 8px;
                right: 5px;
                color: var(--black);
                --mdc-icon-size: 20px;
            }

            .close:hover {
                color: #C6011F;
                font-weight: bold;
            }

            .tab .close,
            .tab .show {
                display: none;
            }

            .tab.active .close,
            .tab.active .show {
                display: inline-block;
                color: var(--black);
            }

            .tab:hover .close,
            .tab:hover .show {
                display: inline-block;
                color: var(--black);
            }

            .tab .close:hover,
            .tab.active .close:hover {
                color: #C6011F;
                font-weight: bold;
            }

            .add-tab-button {
                margin-left: 10px;
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
                top: 5px;
                color: #03a9f4;
                --mdc-icon-size: 24px;
            }

            .iconInactive {
                position: absolute;
                top: 5px;
                color: #999;
                --mdc-icon-size: 24px;
            }

            .tab:hover .iconInactive {
                color: #03a9f4;
            }

            .count {
                font-weight: bold;
                background-color: #C6011F;
                color: white;
                font-size: 12px;
                padding: 2px 6px;
                text-align: center;
                border-radius: 5px;
	        animation: pulse 1500ms infinite;
                animation-duration: 6s;
            }

            .ml-5 {
                margin-left: 5px;
            }

            .ml-10 {
                margin-left: 10px;
            }

            .ml-15 {
                margin-left: 15px;
            }

            .ml-20 {
                margin-left: 20px;
            }

            .ml-25 {
                margin-left: 25px;
            }

            .ml-30 {
                margin-left: 30px;
            }

            .ml-35 {
                margin-left: 35px;
            }

            .ml-40 {
                margin-left: 40px;
            }

            @keyframes pulse {
                0% {
                    box-shadow:#C6011F 0 0 0 0;
                }
                75% {
                    box-shadow:#ff69b400 0 0 0 16px;
                }
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
        this.tabInfo = {}
        this.chatLastSeen = []
        this.chatHeads = []
    }

    render() {
        const plugSrc = (myPlug) => {
            return myPlug === undefined ? 'about:blank' : `${window.location.origin}/plugin/${myPlug.domain}/${myPlug.page}${this.linkParam}`
        }

        return html`
            <div class="tabs">
                ${this.tabs.map((tab, index) => {
                    let title = ''
                    let icon = ''
                    let count = 0

                    if (tab.myPlugObj && tab.myPlugObj.title === "Minting Details") {
                        title = html`${translate('tabmenu.tm1')}`
                    } else if (tab.myPlugObj && tab.myPlugObj.title === "Become a Minter") {
                        title = html`${translate('tabmenu.tm2')}`
                    } else if (tab.myPlugObj && tab.myPlugObj.title === "Sponsorship List") {
                        title = html`${translate('tabmenu.tm3')}`
                    } else if (tab.myPlugObj && tab.myPlugObj.title === "Wallets") {
                        title = html`${translate('tabmenu.tm4')}`
                    } else if (tab.myPlugObj && tab.myPlugObj.title === "Trade Portal") {
                        title = html`${translate('tabmenu.tm5')}`
                    } else if (tab.myPlugObj && tab.myPlugObj.title === "Auto Buy") {
                        title = html`${translate('tabmenu.tm6')}`
                    } else if (tab.myPlugObj && tab.myPlugObj.title === "Reward Share") {
                        title = html`${translate('tabmenu.tm7')}`
                    } else if (tab.myPlugObj && tab.myPlugObj.title === "Q-Chat") {
                        title = html`${translate('tabmenu.tm8')}`
                    } else if (tab.myPlugObj && tab.myPlugObj.title === "Name Registration") {
                        title = html`${translate('tabmenu.tm9')}`
                    } else if (tab.myPlugObj && tab.myPlugObj.title === "Names Market") {
                        title = html`${translate('tabmenu.tm10')}`
                    } else if (tab.myPlugObj && tab.myPlugObj.title === "Websites") {
                        title = html`${translate('tabmenu.tm11')}`
                    } else if (tab.myPlugObj && tab.myPlugObj.title === "Q-Apps") {
                        title = html`${translate('tabmenu.tm12')}`
                    } else if (tab.myPlugObj && tab.myPlugObj.title === "Group Management") {
                        title = html`${translate('tabmenu.tm13')}`
                    } else if (tab.myPlugObj && tab.myPlugObj.title === "Data Management") {
                        title = html`${translate('tabmenu.tm14')}`
                    } else if (tab.myPlugObj && tab.myPlugObj.title === "Puzzles") {
                        title = html`${translate('tabmenu.tm15')}`
                    } else if (tab.myPlugObj && tab.myPlugObj.title === "Node Management") {
                        title = html`${translate('tabmenu.tm16')}`
                    } else if (tab.myPlugObj && tab.myPlugObj.url === "myapp") {
                        title = tab.myPlugObj && tab.myPlugObj.title
                    } else {
                        title = html`${translate('tabmenu.tm17')}`
                    }

                    if (tab.myPlugObj && tab.myPlugObj.mwcicon) {
                        icon = tab.myPlugObj.mwcicon
                    } else {
                        icon = 'tab'
                    }

                    if (tab.myPlugObj && (tab.myPlugObj.url === 'websites' || tab.myPlugObj.url === 'qapps') && this.tabInfo[tab.id]) {
                        title = this.tabInfo[tab.id].name
                    }

                    if (tab.myPlugObj && (tab.myPlugObj.url === 'websites' || tab.myPlugObj.url === 'qapps') && this.tabInfo[tab.id]) {
                        count = this.tabInfo[tab.id].count
                    }

                    if (tab.myPlugObj && tab.myPlugObj.url === 'q-chat') {
                        for (const chat of this.chatHeads) {

                            const lastReadMessage = this.chatLastSeen.find((ch) => {
                                let id
                                if (chat.groupId === 0) {
                                    id = chat.groupId
                                } else if (chat.groupId) {
                                    id = chat.groupId
                                } else {
                                    id = chat.address
                                }
                                return ch.key.includes(id)
                            })
                            if (lastReadMessage && lastReadMessage.timestamp < chat.timestamp) {
                                count = count + 1
                            }
                        }
                    }

                    return html`
                        <div
                            id="tab-${tab.id}"
                            class="tab ${this.currentTab === index ? 'active' : ''}"
                            @click="${() => this.currentTab = index}"
                        >
                            <div id="icon-${tab.id}" class="${this.currentTab === index ? "iconActive" : "iconInactive"}">
                                <mwc-icon>${icon}</mwc-icon>
                            </div>
                            <div class="tabCard">
                                ${count ? html`
                                    <span class="tabTitle ml-30">${title}</span>
                                    <span class="count ml-5">${count}</span>
                                    <span class="ml-25 show"><mwc-icon class="close" @click=${() => {this.removeTab(index, tab.id)}}>close</mwc-icon></span>
                                ` : html`
                                    <span class="tabTitle ml-30">${title}</span>
                                    <span class="ml-25 show"><mwc-icon class="close" @click=${() => {this.removeTab(index, tab.id)}}>close</mwc-icon></span>
                                `}
                            </div>
                        </div>
                    `
                })}
                <button 
                    class="add-tab-button"
                    title="${translate('tabmenu.tm18')}"
                    @click=${() => {
                        const lengthOfTabs = this.tabs.length
                        this.addTab({
                            url: "",
                            id: this.uid()
                        })
                        this.currentTab = lengthOfTabs
                    }}
                >+</button>
            </div>

            ${repeat(this.tabs, (tab) => tab.id, (tab, index) => html`
                <div id="frame-${tab.id}" class=${this.currentTab === index ? "showIframe" : "hideIframe"}>
                    <iframe src="${plugSrc(tab.myPlugObj)}" data-id=${tab.id} id="showPluginFrame${index}" style="width:100%;
                        height: calc(var(--window-height) - 102px);
                        border: 0;
                        padding: 0;
                        margin: 0"
                        class=${!tab.myPlugObj ? "hideIframe" : ""}
                    >
                    </iframe>
                    <nav-bar
                        id="plug-${tab.id}"
                        class=${!tab.myPlugObj ? "showIframe" : "hideIframe"}
                        .registeredUrls=${this.registeredUrls}
                        .changePage=${(val) => this.changePage(val)}
                    >
                    </nav-bar>
                </div>
            `)}     
        `
    }

    firstUpdated() {
        this.changeLanguage()

        this.tabs.forEach((tab, index) => {
            const frame = this.shadowRoot.getElementById(`showPluginFrame${index}`)
            this.createEpmlInstance(frame, index)
        })

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

    async getUpdateComplete() {
        await super.getUpdateComplete()
        return true
    }

    async addTab(tab) {
        if (this.tabs == []) {
            // ...Nothing to do
        } else {
            this.tabs.forEach((rac, index) => {
                let racId = ''
                let tabRacId = ''
                let frameRacId = ''
                let plugRacId = ''
                let iconRacId = ''

                racId = rac.id
                tabRacId = 'tab-' + racId
                frameRacId = 'frame-' + racId
                plugRacId = 'plug-' + racId
                iconRacId = 'icon-' + racId

                const plugObjRac = rac.url

                var tabActiveRac = this.shadowRoot.getElementById(tabRacId)
                var frameActiveRac = this.shadowRoot.getElementById(frameRacId)
                var plugActiveRac = this.shadowRoot.getElementById(plugRacId)
                var iconActiveRac = this.shadowRoot.getElementById(iconRacId)

                if (plugObjRac === undefined || "") {
                    tabActiveRac.classList.remove("active")
                    iconActiveRac.classList.remove("iconActive")
                    iconActiveRac.classList.add("iconInactive")
                    plugActiveRac.classList.remove("showIframe")
                    plugActiveRac.classList.add("hideIframe")
                } else {
                    tabActiveRac.classList.remove("active")
                    iconActiveRac.classList.remove("iconActive")
                    iconActiveRac.classList.add("iconInactive")
                    frameActiveRac.classList.remove("showIframe")
                    frameActiveRac.classList.add("hideIframe")
                }
            })
        }

        this.tabs = [...this.tabs, tab]
        await this.getUpdateComplete()

        // add the new tab to the tabs array
        const newIndex = this.tabs.length - 1

        // render the tab and wait for it to be added to the DOM
        const frame = this.shadowRoot.getElementById(`showPluginFrame${newIndex}`)
        this.createEpmlInstance(frame, newIndex)
    }

    removeTab(index, tabA) {
        const tabB = this.tabs.length - 1
        const tabC = this.tabs[tabB].id

        if (tabC === tabA) {
            let theId = ''
            let tabId = ''
            let frameId = ''
            let plugId = ''
            let iconId = ''

            this.tabs = this.tabs.filter((tab, tIndex) => tIndex !== index)

            const tabD = this.tabs.length - 1
            const plugObj = this.tabs[tabD].url

            theId = this.tabs[tabD].id
            tabId = 'tab-' + theId
            frameId = 'frame-' + theId
            plugId = 'plug-' + theId
            iconId = 'icon-' + theId

            var tabActive = this.shadowRoot.getElementById(tabId)
            var frameActive = this.shadowRoot.getElementById(frameId)
            var plugActive = this.shadowRoot.getElementById(plugId)
            var iconActive = this.shadowRoot.getElementById(iconId)

            if (plugObj === undefined || "") {
                tabActive.classList.add("active")
                iconActive.classList.remove("iconInactive")
                iconActive.classList.add("iconActive")
                plugActive.classList.remove("hideIframe")
                plugActive.classList.add("showIframe")
            } else {
                tabActive.classList.add("active")
                iconActive.classList.remove("iconInactive")
                iconActive.classList.add("iconActive")
                frameActive.classList.remove("hideIframe")
                frameActive.classList.add("showIframe")
            }
            this.requestUpdate()
        } else {
            // Remove tab from array
            this.tabs = this.tabs.filter((tab, tIndex) => tIndex !== index)

            if (this.tabs.length !== 0) {
                this.currentTab = 0
            }
            this.requestUpdate()
        }
    }

    createEpmlInstance(frame, index) {
        const showingPluginEpml = new Epml({
            type: 'WINDOW',
            source: frame.contentWindow
        })

        addPluginRoutes(showingPluginEpml);
        showingPluginEpml.imReady()

        // store Epml instance in tab for later use
        this.tabs[index].epmlInstance = showingPluginEpml

        // Register each instance with a unique identifier
        Epml.registerProxyInstance(`visible-plugin-${index}`, showingPluginEpml)
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

    async stateChanged(state) {
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
        if (this.tabInfo !== state.app.tabInfo) {
            this.tabInfo = state.app.tabInfo
        }
        if (this.chatLastSeen !== state.app.chatLastSeen) {
            this.chatLastSeen = state.app.chatLastSeen
        }
        if (state.app.chatHeads !== this.unModifiedChatHeads) {
            let chatHeads = []
            if (state.app.chatHeads && state.app.chatHeads.groups) {
                chatHeads = [...chatHeads, ...state.app.chatHeads.groups]
            }
            if (state.app.chatHeads && state.app.chatHeads.direct) {
                chatHeads = [...chatHeads, ...state.app.chatHeads.direct]
            }
            this.chatHeads = chatHeads
            this.unModifiedChatHeads = state.app.chatHeads
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
            myMenuPlugins: { type: Array },
            myApps: { type: Array },
            addressInfo: { type: Object },
            changePage: { attribute: false },
            pluginName: { type: String },
            pluginType: { type: String },
            mwcIcon: { type: String },
            pluginNameToDelete: { type: String }
        }
    }

    static styles = css`
        * {
            --mdc-theme-primary: rgb(3, 169, 244);
            --mdc-theme-surface: var(--white);
            --mdc-text-field-outlined-idle-border-color: var(--txtfieldborder);
            --mdc-text-field-outlined-hover-border-color: var(--txtfieldhoverborder);
            --mdc-text-field-label-ink-color: var(--black);
            --mdc-text-field-ink-color: var(--black);
            --mdc-dialog-content-ink-color: var(--black);
            --mdc-dialog-min-width: 300px;
            --mdc-dialog-max-width: 700px;
        }

        .parent {
            display: flex;
            flex-direction: column;
            flex-flow: column;
            align-items: center;
            padding: 20px;
            height: 100vh;
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
            padding: 10px 0;
            gap: 10px;
            flex-wrap: wrap;
        }

        .app-list .app-icon {
            text-align: center;
            font-size: 15px;
            font-weight: bold;
            color: var(--black);
            width: 175px;
            height: 110px;
            background: transparent;
            padding: 5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: block;
            width: 100%;
            min-width: 1px;
        }

        .app-list .app-icon span {
            display: block;
        }

        .app-icon-box {
            display: flex;
            align-items: center;
            padding-left: 14px;
            width: 80px;
            min-width: 80px;
            height: 80px;
            min-height: 80px;
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
            cursor: pointer;
        }

        .menuIconPos {
            position: relative;
            right: 26px;
        }

        .removeIcon {
            color: var(--black);
            --mdc-icon-size: 28px;
            cursor: pointer;
        }

        .removeIcon:hover {
            color: #C6011F;
            font-weight: bold;
        }

        .removeIconPos {
            position: relative;
            top: -36px;
            left: 62px;
        }

        .red {
            --mdc-theme-primary: #F44336;
        }

        select {
            padding: 10px 10px;
            width: 100%;
            font-size: 16px;
            font-weight: 500;
            background: var(--white);
            color: var(--black);
        }
    `
    constructor() {
        super()
        this.menuList = []
        this.newMenuList = []
        this.myMenuList = []
        this.myMenuPlugins = []
        this.addressInfo = {}
        this.pluginName = ''
        this.pluginType = ''
        this.myApps = ''
        this.mwcIcon = ''
        this.pluginNameToDelete = ''
    }

    render() {
        return html`
            <div class="parent">
                <div class="navbar">
                    <input @keydown=${this._handleKeyDown} id="linkInput" type="text" placeholder="qortal://">
                    <button @click="${this.handlePasteLink}">${translate('general.open')}</button>
                </div>
                <div>
                    <div class="app-list">
                        ${repeat(this.myMenuList, (plugin) => plugin.url, (plugin, index) => html`
                            <div class="app-icon">
                                <div class="app-icon-box">
                                    ${this.renderRemoveIcon(plugin.url, plugin.mwcicon, plugin.title, plugin)}
                                </div>
                                ${this.renderTitle(plugin.url, plugin.title)}
                            </div>
                        `)}
                        <div class="app-icon" @click="${() => this.openAddNewPlugin()}">
                            <div class="app-icon-box">
                                <mwc-icon class="menuIcon">add</mwc-icon>
                            </div>
                            <span class="text">${translate("tabmenu.tm19")}</span>
                        </div>
                    </div>
                </div>
            </div>
            <mwc-dialog id="addNewPlugin" scrimClickAction="" escapeKeyAction="">
                <div style="text-align:center">
                    <h2>${translate("tabmenu.tm26")}</h2>
                    <hr><br>
                </div>
                <p>
                    ${translate("tabmenu.tm24")}
                    <select required validationMessage="${translate("grouppage.gchange14")}" id="pluginTypeInput" label="${translate("tabmenu.tm24")}">
                        <option value="reject" selected>${translate("grouppage.gchange15")}</option>
                        <option value="0">${translate("tabmenu.tm20")}</option>
                        <option value="1">${translate("tabmenu.tm21")}</option>
                    </select>
                </p>
                <p>
                    <mwc-textfield
                        style="width: 100%; color: var(--black);"
                        required
                        outlined
                        id="pluginNameInput"
                        label="${translate("login.name")}"
                        type="text"
                    >
                    </mwc-textfield>
                </p>
                <mwc-button
                    slot="primaryAction"
                    @click=${this.addToMyMenuPlugins}
                >
                    ${translate("tabmenu.tm19")}
                </mwc-button>
                <mwc-button
                    slot="secondaryAction"
                    dialogAction="cancel"
                    class="red"
                >
                    ${translate("general.close")}
                </mwc-button>
            </mwc-dialog>
            <mwc-dialog id="removePlugin" scrimClickAction="" escapeKeyAction="">
                <div style="text-align:center">
                    <h2>${translate("tabmenu.tm27")}</h2>
                    <hr><br>
                </div>
                <p style="text-align:center">${translate("tabmenu.tm23")}</p>
                <h3 style="text-align:center">${this.pluginNameToDelete}</h3>
                <mwc-button
                    slot="primaryAction"
                    @click=${this.removeAppFromArray}
                >
                    ${translate("general.yes")}
                </mwc-button>
                <mwc-button
                    slot="secondaryAction"
                    dialogAction="cancel"
                    class="red"
                >
                    ${translate("general.no")}
                </mwc-button>
            </mwc-dialog>
        `
    }

    async firstUpdated() {
        addPluginRoutes(parentEpml)
        parentEpml.imReady()

        const addressInfo = this.addressInfo
        const isMinter = addressInfo?.error !== 124 && +addressInfo?.level > 0
        const isSponsor = +addressInfo?.level >= 5
        const appDelay = ms => new Promise(res => setTimeout(res, ms))

        await appDelay(50)

        await this.checkMyMenuPlugins()

        if (!isMinter) {
            this.newMenuList = this.myMenuPlugins.filter((minter) => {
                return minter.url !== 'minting'
            })
        } else {
            this.newMenuList = this.myMenuPlugins.filter((minter) => {
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

    async checkMyMenuPlugins() {
        const appDelay = ms => new Promise(res => setTimeout(res, ms))

        if (localStorage.getItem("myMenuPlugs") === null) {
            await appDelay(1000)
            const myObj = JSON.stringify(this.menuList)
            localStorage.setItem("myMenuPlugs", myObj)
        } else {
            this.myMenuPlugins = JSON.parse(localStorage.getItem("myMenuPlugs") || "[]")
        }
    }

    openAddNewPlugin() {
        this.shadowRoot.getElementById("pluginTypeInput").value = 'reject'
        this.shadowRoot.getElementById("pluginNameInput").value = ''
        this.shadowRoot.querySelector('#addNewPlugin').show()
    }

    async addToMyMenuPlugins() {
        this.mwcIcon = ''
        this.pluginType = this.shadowRoot.getElementById("pluginTypeInput").value
        this.pluginName = this.shadowRoot.getElementById('pluginNameInput').value

        var oldMenuPlugs = JSON.parse(localStorage.getItem("myMenuPlugs") || "[]")

        if (this.pluginType === "reject") {
            let myplugerr = get("tabmenu.tm25")
            parentEpml.request('showSnackBar', `${myplugerr}`)
            return false
        } else if (this.pluginType === "0") {
            if (this.pluginName === "Q-Blog") {
                this.mwcIcon = 'rss_feed'
            } else if (this.pluginName === "Q-Mail") {
                this.mwcIcon = 'mail'
            } else {
                this.mwcIcon = 'apps'
            }

            const newMenuPlugsItem = {
                "url": "myapp",
                "domain": "core",
                "page": `qdn/browser/index.html?name=${this.pluginName}&service=APP`,
                "title": this.pluginName,
                "icon": "vaadin:external-browser",
                "mwcicon": this.mwcIcon,
                "menus": [],
                "parent": false
            }

            const validatePluginName = async () => {
                if (this.pluginName.length === 0) {
                    let myplugstring1 = get("walletpage.wchange50")
                    parentEpml.request('showSnackBar', `${myplugstring1}`)
                    return false
                }

                let myPluginName = false
                this.myPluginNameRes = []

                await parentEpml.request('apiCall', {
                    url: `/arbitrary/resources/search?service=APP&query=${this.pluginName}&exactmatchnames=true&limit=1`
                }).then(res => {
                    this.myPluginNameRes = res
                })

                if (this.myPluginNameRes === undefined || this.myPluginNameRes.length == 0 ) {
                    myPluginName = false
                } else {
                    myPluginName = true
                }
                return myPluginName
            }

            let myNameRes = await validatePluginName()

            if (myNameRes !== false) {
                oldMenuPlugs.push(newMenuPlugsItem)

                localStorage.setItem("myMenuPlugs", JSON.stringify(oldMenuPlugs))

                let myplugstring2 = get("walletpage.wchange52")
                parentEpml.request('showSnackBar', `${myplugstring2}`)

                this.closeAddNewPlugin()

                this.myMenuPlugins = JSON.parse(localStorage.getItem("myMenuPlugs") || "[]")
                this.firstUpdated()
            } else {
                let myplugstring3 = get("websitespage.schange17")
                parentEpml.request('showSnackBar', `${myplugstring3}`)
                return false
            }
        } else if (this.pluginType === "1") {
            this.mwcIcon = 'web'

            const newMenuPlugsItem = {
                "url": "myapp",
                "domain": "core",
                "page": `qdn/browser/index.html?name=${this.pluginName}&service=WEBSITE`,
                "title": this.pluginName,
                "icon": "vaadin:external-browser",
                "mwcicon": this.mwcIcon,
                "menus": [],
                "parent": false
            }

            const validatePluginName = async () => {
                if (this.pluginName.length === 0) {
                    let myplugstring1 = get("walletpage.wchange50")
                    parentEpml.request('showSnackBar', `${myplugstring1}`)
                    return false
                }

                let myPluginName = false
                this.myPluginNameRes = []

                await parentEpml.request('apiCall', {
                    url: `/arbitrary/resources/search?service=WEBSITE&query=${this.pluginName}&exactmatchnames=true&limit=1`
                }).then(res => {
                    this.myPluginNameRes = res
                })

                if (this.myPluginNameRes === undefined || this.myPluginNameRes.length == 0 ) {
                    myPluginName = false
                } else {
                    myPluginName = true
                }
                return myPluginName
            }

            let myNameRes = await validatePluginName()

            if (myNameRes !== false) {
                oldMenuPlugs.push(newMenuPlugsItem)

                localStorage.setItem("myMenuPlugs", JSON.stringify(oldMenuPlugs))

                let myplugstring2 = get("walletpage.wchange52")
                parentEpml.request('showSnackBar', `${myplugstring2}`)

                this.closeAddNewPlugin()

                this.myMenuPlugins = JSON.parse(localStorage.getItem("myMenuPlugs") || "[]")
                this.firstUpdated()
            } else {
                let myplugstring3 = get("websitespage.schange17")
                parentEpml.request('showSnackBar', `${myplugstring3}`)
                return false
            }
        }
    }

    closeAddNewPlugin() {
        this.shadowRoot.querySelector('#addNewPlugin').close()
        this.shadowRoot.getElementById("pluginTypeInput").value = 'reject'
        this.shadowRoot.getElementById("pluginNameInput").value = ''
    }

    renderTitle(theUrl, theName) {
        if (theUrl === 'minting') {
            return html`<span>${translate('tabmenu.tm1')}</span>`
        } else if (theUrl === 'become-minter') {
            return html`<span>${translate('tabmenu.tm2')}</span>`
        } else if (theUrl === 'sponsorship-list') {
            return html`<span>${translate('tabmenu.tm3')}</span>`
        } else if (theUrl === 'wallet') {
            return html`<span>${translate('tabmenu.tm4')}</span>`
        } else if (theUrl === 'trade-portal') {
            return html`<span>${translate('tabmenu.tm5')}</span>`
        } else if (theUrl === 'trade-bot-portal') {
            return html`<span>${translate('tabmenu.tm6')}</span>`
        } else if (theUrl === 'reward-share') {
            return html`<span>${translate('tabmenu.tm7')}</span>`
        } else if (theUrl === 'q-chat') {
            return html`<span>${translate('tabmenu.tm8')}</span>`
        } else if (theUrl === 'name-registration') {
            return html`<span>${translate('tabmenu.tm9')}</span>`
        } else if (theUrl === 'names-market') {
            return html`<span>${translate('tabmenu.tm10')}</span>`
        } else if (theUrl === 'websites') {
            return html`<span>${translate('tabmenu.tm11')}</span>`
        } else if (theUrl === 'qapps') {
            return html`<span>${translate('tabmenu.tm12')}</span>`
        } else if (theUrl === 'group-management') {
            return html`<span>${translate('tabmenu.tm13')}</span>`
        } else if (theUrl === 'data-management') {
            return html`<span>${translate('tabmenu.tm14')}</span>`
        } else if (theUrl === 'puzzles') {
            return html`<span>${translate('tabmenu.tm15')}</span>`
        } else if (theUrl === 'node-management') {
            return html`<span>${translate('tabmenu.tm16')}</span>`
        } else {
            return html`<span>${theName}</span>`
        }
    }

    renderRemoveIcon(appurl, appicon, appname, appplugin) {
        if (appurl === 'myapp') {
            return html`
                <div class="removeIconPos" @click="${() => this.openRemoveApp(appname)}">
                    <mwc-icon class="removeIcon">backspace</mwc-icon>
                </div>
                <div class="menuIconPos" @click="${() => this.changePage(appplugin)}">
                    <mwc-icon class="menuIcon">${appicon}</mwc-icon>
                </div>
            `
        } else {
            return html`<mwc-icon class="menuIcon" @click="${() => this.changePage(appplugin)}">${appicon}</mwc-icon>`
        }
    }

    openRemoveApp(pluginNameTD) {
        this.pluginNameToDelete = ''
        this.pluginNameToDelete = pluginNameTD
        this.shadowRoot.querySelector('#removePlugin').show()
    }

    removeAppFromArray() {
        const pluginToRemove = this.pluginNameToDelete
        this.newMenuFilter = []
        this.newMenuFilter = this.myMenuList.filter((item) => item.title !== pluginToRemove)
        const myNewObj = JSON.stringify(this.newMenuFilter)
        localStorage.removeItem("myMenuPlugs")
        localStorage.setItem("myMenuPlugs", myNewObj)
        this.myMenuPlugins = JSON.parse(localStorage.getItem("myMenuPlugs") || "[]")
        this.firstUpdated()
        this.closeRemoveApp()
    }

    closeRemoveApp() {
        this.shadowRoot.querySelector('#removePlugin').close()
        this.pluginNameToDelete = ''
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

        if (service === "APP") {
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
        } else if (service === "WEBSITE") {
            this.changePage({
                "url": "websites",
                "domain": "core",
                "page": `qdn/browser/index.html${query}`,
                "title": "Website",
                "icon": "vaadin:desktop",
                "mwcicon": "desktop_mac",
                "menus": [],
                "parent": false
            })
        }
    }

    async handlePasteLink(e) {
        try {
            const value = this.shadowRoot.getElementById('linkInput').value
            this.getQuery(value)
        } catch (error) {
        }
    }

    async _handleKeyDown(e) {
        if (e.key === 'Enter') {
            try {
                const value = this.shadowRoot.getElementById('linkInput').value
                this.getQuery(value)
            } catch (error) {
            }
        }
    }

    getApiKey() {
        const apiNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        let apiKey = apiNode.apiKey
        return apiKey
    }

    stateChanged(state) {
        this.menuList = state.app.registeredUrls
        this.addressInfo = state.app.accountInfo.addressInfo
    }
}

customElements.define('nav-bar', NavBar)
