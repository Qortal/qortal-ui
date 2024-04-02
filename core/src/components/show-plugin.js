import {css, html, LitElement} from 'lit'
import {render} from 'lit/html.js'
import {connect} from 'pwa-helpers'
import {store} from '../store.js'
import {Epml} from '../epml.js'
import {addPluginRoutes} from '../plugins/addPluginRoutes.js'
import {repeat} from 'lit/directives/repeat.js';
import ShortUniqueId from 'short-unique-id';
import {setIsOpenDevDialog, setNewTab} from '../redux/app/app-actions.js'
import FileSaver from 'file-saver'
import {get, registerTranslateConfig, translate, use} from '../../translate'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-icon'
import '@material/mwc-textfield'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/iron-icons/iron-icons.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@vaadin/grid'
import '@vaadin/text-field'
import '../custom-elements/frag-file-input.js'
import {defaultQappsTabs} from '../data/defaultQapps.js'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

export const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

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
            chatHeads: { type: Array },
            proxyPort: { type: Number },
            isOpenDevDialog: { type: Boolean }
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
                --mdc-theme-primary: rgb(3, 169, 244);
                --mdc-theme-surface: var(--white);
                --mdc-text-field-outlined-idle-border-color: var(--txtfieldborder);
                --mdc-text-field-outlined-hover-border-color: var(--txtfieldhoverborder);
                --mdc-text-field-label-ink-color: var(--black);
                --mdc-text-field-ink-color: var(--black);
                --mdc-select-ink-color: var(--black);
                --mdc-select-fill-color: var(--black);
                --mdc-select-label-ink-color: var(--black);
                --mdc-select-idle-line-color: var(--black);
                --mdc-select-hover-line-color: var(--black);
                --mdc-select-outlined-idle-border-color: var(--txtfieldborder);
                --mdc-select-outlined-hover-border-color: var(--txtfieldhoverborder);
                --mdc-dialog-content-ink-color: var(--black);
                --mdc-dialog-shape-radius: 25px;
                --mdc-dialog-min-width: 400px;
                --mdc-dialog-max-width: 700px;
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
                z-Index: -10;
            }

            .showIframe  {
                display: flex;
                position: relative;
                z-Index: 1;
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
                min-width: 110px;
                max-width: 220px;
                overflow: hidden;
                z-index: 2;
            }

            .tabCard {
                display: inline-block;
            }

            .tabTitle {
                display: inline-block;
                position: relative;
                width: auto;
                min-width: 1px;
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
                z-index: 1;
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
                color: var(--general-color-blue);
                font-size: 2em;
                cursor: pointer;
                transition: color 0.3s;
            }

            .add-tab-button:hover {
                color: var(--black);
            }

            .add-dev-button {
                position: fixed;
                right: 20px;
                margin-left: 10px;
                margin-top: 4px;
                max-height: 28px;
                padding: 5px 5px;
                font-size: 14px;
                background-color: var(--general-color-blue);
                color: white;
                border: 1px solid transparent;
                border-radius: 3px;
                cursor: pointer;
            }

            .add-dev-button:hover {
                opacity: 0.8;
                cursor: pointer;
            }

            .red {
                --mdc-theme-primary: #F44336;
            }

            .iconActive {
                position: absolute;
                top: 5px;
                color: var(--general-color-blue);
                --mdc-icon-size: 24px;
            }

            .iconInactive {
                position: absolute;
                top: 5px;
                color: #999;
                --mdc-icon-size: 24px;
            }

            .tab:hover .iconInactive {
                color: var(--general-color-blue);
            }

            .count {
                position: relative;
                top: -5px;
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
        this.initialRegisteredUrls = []
        this.currentTab = 0
        this.tabs = []
        this.uid = new ShortUniqueId()
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
        this.tabInfo = {}
        this.chatLastSeen = []
        this.chatHeads = []
        this.proxyPort = 0
        this.isOpenDevDialog = false
    }

    render() {
        const plugSrc = (myPlug) => {
            return myPlug === undefined ? 'about:blank' : `${window.location.origin}/plugin/${myPlug.domain}/${myPlug.page}${this.linkParam}`
        }

        return html`
             <div id="showPluginId" style="width:0px"></div>
            <div class="tabs">
                ${this.tabs.map((tab, index) => {
                    let title = ''
                    let icon = ''
                    let count = 0

                    if (tab.myPlugObj && tab.myPlugObj.title === "Overview Page") {
                        title = html`${translate('tabmenu.tm28')}`
                    } else if (tab.myPlugObj && tab.myPlugObj.title === "Minting Details") {
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
                    } else if (tab.myPlugObj && tab.myPlugObj.title === "Qortal Lottery") {
                        title = html`${translate('tabmenu.tm42')}`
                    } else if (tab.myPlugObj && tab.myPlugObj.url === "myapp") {
                        title = tab.myPlugObj && tab.myPlugObj.title
                    } else if (tab.myPlugObj && tab.myPlugObj.url === "devmode") {
                        title = html`${translate('tabmenu.tm38')}`
                    } else {
                        title = html`${translate('tabmenu.tm17')}`
                    }

                    if (tab.myPlugObj && tab.myPlugObj.mwcicon) {
                        icon = tab.myPlugObj.mwcicon
                    } else {
                        icon = 'tab'
                    }

                    if (tab.myPlugObj && (tab.myPlugObj.url === 'myapp') && this.tabInfo[tab.id]) {
                        title = this.tabInfo[tab.id].name
                    }

                    if (tab.myPlugObj && (tab.myPlugObj.url === 'myapp') && this.tabInfo[tab.id]) {
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
                            @click="${() => {
                                this.currentTab = index
                            }}"
                             @mousedown="${(event) => {
        if (event.button === 1) {
            event.preventDefault();
            this.removeTab(index, tab.id);
        }
    }}"
                        >
                            <div id="icon-${tab.id}" class="${this.currentTab === index ? "iconActive" : "iconInactive"}">
                            ${tab.myPlugObj && tab.myPlugObj.url === "myapp" ? html`
                            <tab-avatar appname=${title} appicon=${icon}></tab-avatar>
                            ` : html`
                            <mwc-icon>${icon}</mwc-icon>
                            `}


                            </div>
                            <div class="tabCard">
                                ${count ? html`
                                    <span class="tabTitle ml-30">${title}</span>
                                    <span class="count ml-5">${count}</span>
                                    <span class="show ml-25"><mwc-icon class="close" @click=${(event) => {
                                        event.stopPropagation(); this.removeTab(index, tab.id)

                                        }}>close</mwc-icon></span>
                                ` : html`
                                    <span class="tabTitle ml-30">${title}</span>
                                    <span class="show ml-25"><mwc-icon class="close" @click=${(event) => {event.stopPropagation(); this.removeTab(index, tab.id)}}>close</mwc-icon></span>
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
                            id: this.uid.rnd()
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
            <mwc-dialog id="addDevDialog"
                ?open=${this.isOpenDevDialog}
                @closed=${() => {
                    this.shadowRoot.getElementById('domainInput').value = ''
                    this.shadowRoot.getElementById('portInput').value = ''
                    this.isOpenDevDialog = false
                    store.dispatch(setIsOpenDevDialog(false))
                }}
            >
                <div style="text-align: center;">
                    <h2>${translate('tabmenu.tm39')}</h2>
                    <hr>
                </div>
                <p>
                    <mwc-textfield id="domainInput" style="width:100%; color: var(--black);" required outlined label="${translate("settings.domain")}"></mwc-textfield>
                </p>
                <p>
                    <mwc-textfield id="portInput" style="width:100%; color: var(--black);" required outlined label="${translate("settings.port")}"></mwc-textfield>
                </p>
                <mwc-button
                    slot="secondaryAction"
                    dialogAction="close"
                    class="red"
                >
                ${translate("general.close")}
                </mwc-button>
                <mwc-button
                    slot="primaryAction"
                    @click="${this.getProxyPort}"
                >
                ${translate('tabmenu.tm40')}
                </mwc-button>
            </mwc-dialog>
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

            if (checkTheme) {
                this.theme = checkTheme
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

    async getProxyPort() {
        this.proxyPort = 0
        let framework = ''

        const domain = this.shadowRoot.getElementById('domainInput').value
        const port = this.shadowRoot.getElementById('portInput').value

        if (domain.length >= 3 && port.length >= 2) {
            framework = domain + ':' + port
        } else {
            let errorString = get("tabmenu.tm41")
            parentEpml.request('showSnackBar', `${errorString}`)
            return
        }

        let framePort = await parentEpml.request('apiCall', {
            url: `/developer/proxy/start`,
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: `${framework}`
        })

        this.createUrl(framePort)
    }

    createUrl(framePort) {
        this.proxyPort = framePort
        const myFrameNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const myFrameNodeUrl = myFrameNode.protocol + '://' + myFrameNode.domain + ':' + this.proxyPort

        this.changePage({
            "url": "devmode",
            "domain": "core",
            "page": `qdn/browser/index.html?link=${myFrameNodeUrl}&dev=FRAMEWORK`,
            "title": "Dev Server",
            "icon": "vaadin:desktop",
            "mwcicon": "api",
            "menus": [],
            "parent": false
        })

        this.shadowRoot.querySelector("#addDevDialog").close()
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
            this.currentTab = this.tabs.length - 1;

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
                    url: "",
                    id: this.uid.rnd()
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
            newUrl = ''
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
            if(newTab.openExisting && this.tabs.find((tab)=> tab.url === newTab.url)){
                const findIndex = this.tabs.findIndex((tab) => tab.url === newTab.url)
                if (findIndex !== -1) {
                    this.currentTab = findIndex
                }

                store.dispatch(setNewTab(null))
            } else if (!this.tabs.find((tab) => tab.id === newTab.id)) {
                await this.addTab(newTab)
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

        if(state.app.isOpenDevDialog){
            this.isOpenDevDialog = state.app.isOpenDevDialog
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
            pluginPage: { type: String },
            mwcIcon: { type: String },
            pluginNameToDelete: { type: String },
            pluginNumberToDelete: { type: String },
            textFieldDisabled: { type: Boolean },
            initialName: { type: String },
            newId: { type: String },
            removeTitle: { type: String },
            myFollowedNames: { type: Array },
            myFollowedNamesList: { type: Array },
            searchNameContentString: { type: String },
            searchNameResources: { type: Array }
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
            --mdc-dialog-shape-radius: 25px;
            --mdc-dialog-min-width: 300px;
            --mdc-dialog-max-width: 700px;
        }

        .parent {
            display: flex;
            flex-direction: column;
            flex-flow: column;
            align-items: center;
            padding: 20px;
            height: calc(100vh - 120px);
            overflow-y: auto;
        }

        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: var(--white);
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
            position: relative;
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
            position: relative;
        }

        .app-list .app-icon:hover .removeIcon {
            display: inline;
        }

        .menuIcon {
            color: var(--app-icon);
            --mdc-icon-size: 64px;
            cursor: pointer;
        }

        .menuIconPos {
            right: -2px;
        }

        .removeIconPos {
            position: absolute;
    top: -10px;
    right: -10px;
    z-index: 1;
        }

        .menuIconPos:hover .removeIcon {
            display: inline;
        }

        .removeIcon {
            display: none;
            color: var(--black);
            --mdc-icon-size: 28px;
            cursor: pointer;
            position: relative;
            z-index: 1;
        }

        .removeIcon:hover {
            color: #C6011F;
            font-weight: bold;
        }

        .red {
            --mdc-theme-primary: #F44336;
        }

        select {
            padding: 10px 10px 10px 10px;
            width: 100%;
            font-size: 16px;
            font-weight: 500;
            background: var(--white);
            color: var(--black);
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: url('/img/arrow.png');
            background-repeat: no-repeat;
            background-position: right 10px center;
            background-size: 20px;
        }

        .resetIcon {
            position: fixed;
            right: 20px;
            top: 116px;
            color: #666;
            --mdc-icon-size: 32px;
            cursor: pointer;
        }

        .resetIcon:hover {
            color: var(--general-color-blue);
            font-weight: bold;
        }

        .searchIcon {
            position: fixed;
            left: 20px;
            top: 116px;
            color: #666;
            --mdc-icon-size: 32px;
            cursor: pointer;
        }

        .searchIcon:hover {
            color: var(--general-color-blue);
            font-weight: bold;
        }

        .importIcon {
            position: fixed;
            left: 20px;
            bottom: 16px;
            color: #666;
            --mdc-icon-size: 32px;
            cursor: pointer;
        }

        .importIcon:hover {
            color: var(--general-color-blue);
            font-weight: bold;
        }

        .exportIcon {
            position: fixed;
            right: 20px;
            bottom: 16px;
            color: #666;
            --mdc-icon-size: 32px;
            cursor: pointer;
        }

        .exportIcon:hover {
            color: var(--general-color-blue);
            font-weight: bold;
        }

        paper-dialog.searchSettings {
            width: 100%;
            max-width: 550px;
            height: auto;
            max-height: 600px;
            background-color: var(--white);
            color: var(--black);
            line-height: 1.6;
            overflow: hidden;
            border: 1px solid var(--black);
            border-radius: 10px;
            padding: 15px;
        }

        paper-dialog button {
            padding: 5px 10px;
            font-size: 18px;
            background-color: var(--general-color-blue);
            color: white;
            border: 1px solid transparent;
            border-radius: 5px;
            cursor: pointer;
        }

        paper-dialog button:hover {
            opacity: 0.8;
            cursor: pointer;
        }

        .search {
            display: inline;
            width: 50%;
            align-items: center;
        }

        .divCard {
            height: auto;
            max-height: 500px;
            border: 1px solid var(--border);
            padding: 1em;
            margin-bottom: 1em;
        }

        img {
            border-radius: 25%;
            max-width: 32px;
            height: 100%;
            max-height: 32px;
        }

        vaadin-text-field[focused]::part(input-field) {
            border-color: var(--general-color-blue);
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
        this.pluginPage = ''
        this.myApps = ''
        this.mwcIcon = ''
        this.pluginNameToDelete = ''
        this.pluginNumberToDelete = ''
        this.textFieldDisabled = false
        this.initialName = ''
        this.newId = ''
        this.removeTitle = ''
        this.myFollowedNames = []
        this.myFollowedNamesList = []
        this.searchContentString = ''
        this.searchNameResources = []
        this._updateMyMenuPlugins = this._updateMyMenuPlugins.bind(this)
    }

    render() {
        return html`
            <div class="parent">
                <mwc-icon class="resetIcon" @click="${() => this.resetMenu()}" title="${translate("tabmenu.tm29")}">reset_tv</mwc-icon>
                <mwc-icon class="searchIcon" @click="${() => this.openNameSearch()}" title="${translate("tabmenu.tm30")}">person_search</mwc-icon>
                <mwc-icon class="importIcon" @click="${() => this.openImportDialog()}" title="${translate("tabmenu.tm33")}">upload</mwc-icon>
                <mwc-icon class="exportIcon" @click="${() => this.exportTabMenu()}" title="${translate("tabmenu.tm34")}">download</mwc-icon>
                <div class="navbar">
                    <input @keydown=${this._handleKeyDown} id="linkInput" type="text" placeholder="qortal://">
                    <button @click="${this.handlePasteLink}">${translate('general.open')}</button>
                </div>
                <div class="app-list">
                    ${repeat(this.myMenuList, (plugin) => plugin.url, (plugin, index) => html`
                        <div class="app-icon">
                            <div class="app-icon-box">
                                ${this.renderRemoveIcon(plugin.url, plugin.mwcicon, plugin.title, plugin.pluginNumber, plugin)}
                            </div>
                            ${this.renderTitle(plugin.url, plugin.title)}
                        </div>
                    `)}
                    <div class="app-icon" @click="${() => this.openAddNewPlugin()}">
                        <div class="app-icon-box">
                            <mwc-icon class="menuIcon">add</mwc-icon>
                        </div>
                        <span class="text" title="${translate("tabmenu.tm19")}">${translate("tabmenu.tm19")}</span>
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
                    <select
                        required
                        @change="${() => this.val()}"
                        validationMessage="${translate("grouppage.gchange14")}"
                        id="pluginTypeInput"
                        label="${translate("tabmenu.tm24")}"
                    >
                        <option value="reject" selected>${translate("grouppage.gchange15")}</option>
                        <option style="margin-top: 10px;" value="0">${translate("tabmenu.tm20")}</option>
                        <option style="margin-top: 10px;" value="1">${translate("tabmenu.tm21")}</option>
                        <option disabled style="font-size: 0.25em;"></option>>
                        <option disabled style="background: #666; font-size: 0.1px;"></option>
                        <option disabled style="font-size: 0.50em;"></option>>
                        ${this.filterSelectMenu()}
                    </select>
                </p>
                <p>
                    <mwc-textfield
                        ?disabled="${this.textFieldDisabled}"
                        style="width: 100%; color: var(--black);"
                        outlined
                        id="pluginNameInput"
                        label="${translate("login.name")}"
                        type="text"
                        value="${this.initialName}"
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
                <h3 style="text-align:center">${this.removeTitle}</h3>
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
            <paper-dialog id="searchNameDialog" class="searchSettings" vertical-align="top" horizontal-align="center" dynamic-align>
                <div style="display: inline;">
                    <div class="search">
                        <vaadin-text-field
                            style="width: 350px"
                            id="searchNameContent"
                            placeholder="${translate("appspage.schange33")}"
                            value="${this.searchNameContentString}"
                            @keydown="${this.searchNameKeyListener}"
                            clear-button-visible
                            autofocus
                        >
                        </vaadin-text-field>
                        <paper-icon-button icon="icons:search" @click="${() => this.searchNameResult()}" title="${translate("websitespage.schange35")}"></paper-icon-button>
                        <paper-icon-button icon="icons:close" @click="${() => this.closeNameSearch()}" title="${translate("general.close")}"></paper-icon-button>
                    </div>
                </div><br>
                <div class="divCard">
                    <vaadin-grid
                        theme="wrap-cell-content"
                        id="searchNameGrid"
                        ?hidden="${this.isEmptyArray(this.searchNameResources)}"
                        .items="${this.searchNameResources}"
                        aria-label="Search Name"
                    >
                        <vaadin-grid-column
                            width="6rem"
                            flex-grow="0" header="${translate("appspage.schange5")}"
                            .renderer=${(root, column, data) => {
                                render(html`${this.renderNameAvatar(data.item)}`, root)
                            }}
                        >
                        </vaadin-grid-column>
                        <vaadin-grid-column
                            width="12rem"
                            flex-grow="0"
                            header="${translate("datapage.dchange5")}"
                            .renderer=${(root, column, data) => {
	                        render(html`${data.item.name}`, root)
	                    }}
                        >
                        </vaadin-grid-column>
	                <vaadin-grid-column
                            width="10rem"
                            flex-grow="0"
                            header="${translate("appspage.schange8")}"
                            .renderer=${(root, column, data) => {
	                        render(html`${this.renderMyFollowUnfollowButton(data.item)}`, root)
	                    }}
                        >
	                </vaadin-grid-column>
	            </vaadin-grid>
                    ${this.isEmptyArray(this.searchNameResources) ? html`
                        <span style="color: var(--black); text-align: center; font-size: 16px;">${translate("login.entername")}</span>
                    `: ''}
	        </div>
	        <div style="text-align: right;">
                    <button @click="${this.openMyFollowedNames}">${translate("tabmenu.tm31")}</button>
	        </div>
            </paper-dialog>
            <paper-dialog id="myFollowedNamesDialog" class="searchSettings" vertical-align="top" horizontal-align="center" dynamic-align>
                <div style="text-align:center">
                    <h2>${translate("tabmenu.tm31")}</h2>
                    <hr>
                </div>
                <div class="divCard">
                    <vaadin-grid
                        theme="wrap-cell-content"
                        id="followedNameGrid"
                        ?hidden="${this.isEmptyArray(this.myFollowedNamesList)}"
                        .items="${this.myFollowedNamesList}"
                        aria-label="My Followed Bames"
                    >
                        <vaadin-grid-column
                            width="6rem"
                            flex-grow="0" header="${translate("appspage.schange5")}"
                            .renderer=${(root, column, data) => {
                                render(html`${this.renderNameAvatar(data.item)}`, root)
                            }}
                        >
                        </vaadin-grid-column>
                        <vaadin-grid-column
                            width="12rem"
                            flex-grow="0"
                            header="${translate("datapage.dchange5")}"
                            .renderer=${(root, column, data) => {
	                        render(html`${data.item.name}`, root)
	                    }}
                        >
                        </vaadin-grid-column>
	                <vaadin-grid-column
                            width="10rem"
                            flex-grow="0"
                            header="${translate("appspage.schange8")}"
                            .renderer=${(root, column, data) => {
	                        render(html`${this.renderMyFollowUnfollowButton(data.item)}`, root)
	                    }}
                        >
	                </vaadin-grid-column>
	            </vaadin-grid>
                    ${this.isEmptyArray(this.myFollowedNamesList) ? html`
                        <span style="color: var(--black); text-align: center; font-size: 16px;">${translate("tabmenu.tm32")}</span>
                    `: ''}
	        </div>
	        <div style="display: flex; justify-content: space-between;">
                    <button @click="${this.openNameSearch}">${translate("websitespage.schange35")}</button>
                    <button style="background-color: red;" @click="${this.closeMyFollowedNames}">${translate("general.close")}</button>
	        </div>
            </paper-dialog>
            <mwc-dialog id="importTabMenutDialog">
                <div style="text-align:center">
                    <h2>${translate("tabmenu.tm33")}</h2>
                    <hr>
                    <br>
                </div>
                <div style="min-height: 150px; min-width: 500px; box-sizing: border-box; position: relative;">
                    <frag-file-input accept=".tabmenu" @file-read-success="${(e) => this.importTabMenu(e.detail.result)}"></frag-file-input>
                    <h4 style="color: #F44336; text-align: center;">${translate("walletpage.wchange56")}</h4>
                    <h5 style="text-align: center;">${translate("tabmenu.tm35")}</h5>
                </div>
                <mwc-button
                    slot="primaryAction"
                    dialogAction="cancel"
                    class="red"
                >
                ${translate("general.close")}
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

        await this.getMyFollowedNames()
        await this.getMyFollowedNamesList()
    }

    async _updateMyMenuPlugins(event) {
        await new Promise((res)=> {
            setTimeout(() => {
                res()
            }, 1000);
        })
		this.myMenuPlugins = event.detail
        const addressInfo = this.addressInfo
        const isMinter = addressInfo?.error !== 124 && +addressInfo?.level > 0
        const isSponsor = +addressInfo?.level >= 5


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

        this.requestUpdate()
	}

	connectedCallback() {
		super.connectedCallback()
		window.addEventListener('myMenuPlugs-event', this._updateMyMenuPlugins)	}

	disconnectedCallback() {
		window.removeEventListener('myMenuPlugs-event', this._updateMyMenuPlugins)
		super.disconnectedCallback()
	}

    openImportDialog() {
        this.shadowRoot.getElementById('importTabMenutDialog').show()
    }

    importTabMenu(file) {
        this.myMenuPlugins = []
        let myFile = ''
        localStorage.removeItem("myMenuPlugs")
        myFile = file
        const newTabMenu = JSON.parse((myFile) || "[]")
        const copyPayload = [...newTabMenu]
        localStorage.setItem("myMenuPlugs", JSON.stringify(newTabMenu))
        this.saveSettingToTemp(copyPayload)
        this.shadowRoot.getElementById('importTabMenutDialog').close()
        this.myMenuPlugins = JSON.parse(localStorage.getItem("myMenuPlugs") || "[]")
        this.firstUpdated()

        let success5string = get("tabmenu.tm36")
        parentEpml.request('showSnackBar', `${success5string}`)
    }

    exportTabMenu() {
        let tabMenu = ""
        const qortalTabMenu = JSON.stringify(localStorage.getItem("myMenuPlugs"))
        const qortalTabMenuSave = JSON.parse((qortalTabMenu) || "[]")
        const blob = new Blob([qortalTabMenuSave ], { type: 'text/plain;charset=utf-8' })
        tabMenu = "qortal.tabmenu"
        this.saveFileToDisk(blob, tabMenu)
    }

    async saveFileToDisk(blob, fileName) {
        try {
            const fileHandle = await self.showSaveFilePicker({
                suggestedName: fileName,
                types: [{
                        description: "File",
                }]
            })
            const writeFile = async (fileHandle, contents) => {
                const writable = await fileHandle.createWritable()
                await writable.write(contents)
                await writable.close()
            }
            writeFile(fileHandle, blob).then(() => console.log("FILE SAVED"))
            let snack4string = get("tabmenu.tm37")
            parentEpml.request('showSnackBar', `${snack4string} ${fileName}`)
        } catch (error) {
            if (error.name === 'AbortError') {
                return
            }
            FileSaver.saveAs(blob, fileName)
            let snack4string = get("tabmenu.tm37")
            parentEpml.request('showSnackBar', `${snack4string} ${fileName}`)
        }
    }

    openNameSearch() {
        this.searchNameResources = []
        this.shadowRoot.getElementById('searchNameContent').value = ''
        this.shadowRoot.getElementById('myFollowedNamesDialog').close()
        this.shadowRoot.getElementById('searchNameDialog').open()
    }

    closeNameSearch() {
        this.shadowRoot.getElementById('searchNameDialog').close()
    }

    openMyFollowedNames() {
        this.shadowRoot.getElementById('searchNameDialog').close()
        this.shadowRoot.getElementById('myFollowedNamesDialog').open()
        this.getMyFollowedNamesList()
    }

    closeMyFollowedNames() {
        this.shadowRoot.getElementById('myFollowedNamesDialog').close()
    }

    async getMyFollowedNames() {
		this.myFollowedNames = await parentEpml.request('apiCall', {
			url: `/lists/followedNames?apiKey=${this.getApiKey()}`
		})
    }

    searchNameKeyListener(e) {
        if (e.key === 'Enter') {
            this.searchNameResult()
        }
    }

    async getMyFollowedNamesList() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const myNodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const followedNamesUrl = `${myNodeUrl}/lists/followedNames?apiKey=${this.getApiKey()}`

        var myFollowedNamesNew = []

        this.myFollowedNamesList = []

        await fetch(followedNamesUrl).then(response => {
            return response.json()
        }).then(data => {
            return data.map(item => {
                const addListName = {
                    name: item
                }
                myFollowedNamesNew.push(addListName)
            })
        })
        this.myFollowedNamesList = myFollowedNamesNew
        if(this.shadowRoot.getElementById('myFollowedNamesDialog').opened) {
            this.shadowRoot.getElementById('myFollowedNamesDialog').notifyResize()
        }
    }

    async searchNameResult() {
        let searchMyName = this.shadowRoot.getElementById('searchNameContent').value
        if (searchMyName.length === 0) {
            let err1string = get("appspage.schange34")
            parentEpml.request('showSnackBar', `${err1string}`)
        } else {
            let searchNameResources = await parentEpml.request('apiCall', {
                url: `/names/search?query=${searchMyName}&prefix=true&limit=0&reverse=true`
            })
            if (this.isEmptyArray(searchNameResources)) {
                let err2string = get("appspage.schange17")
                parentEpml.request('showSnackBar', `${err2string}`)
            } else {
                this.searchNameResources = searchNameResources
                if(this.shadowRoot.getElementById('searchNameDialog').opened) {
                    this.shadowRoot.getElementById('searchNameDialog').notifyResize()
                }
            }
        }
    }

    renderNameAvatar(nameObj) {
        let myName = nameObj.name
        const myNameNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const myNodeUrl = myNameNode.protocol + '://' + myNameNode.domain + ':' + myNameNode.port
        const nameUrl = `${myNodeUrl}/arbitrary/THUMBNAIL/${myName}/qortal_avatar?async=true`
        return html`<img src="${nameUrl}" onerror="this.src='/img/incognito.png';">`
    }

    renderMyFollowUnfollowButton(nameObj) {
        let name = nameObj.name

        if (this.myFollowedNames == null || !Array.isArray(this.myFollowedNames)) {
            return html``
        }

        if (this.myFollowedNames.indexOf(name) === -1) {
            return html`<mwc-button @click=${() => this.myFollowName(nameObj)}><mwc-icon>add_to_queue</mwc-icon>&nbsp;${translate("appspage.schange29")}</mwc-button>`
        } else {
            return html`<mwc-button @click=${() => this.myUnfollowName(nameObj)}><mwc-icon>remove_from_queue</mwc-icon>&nbsp;${translate("appspage.schange30")}</mwc-button>`
        }
    }

    async myFollowName(nameObj) {
        let name = nameObj.name
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
            this.myFollowedNames = this.myFollowedNames.filter(item => item != name)
            this.myFollowedNames.push(name)
        } else {
            let err3string = get("appspage.schange22")
            parentEpml.request('showSnackBar', `${err3string}`)
        }
        await this.getMyFollowedNamesList()
        return ret
    }

    async myUnfollowName(nameObj) {
        let name = nameObj.name
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
            this.myFollowedNames = this.myFollowedNames.filter(item => item != name)
        } else {
            let err4string = get("appspage.schange23")
            parentEpml.request('showSnackBar', `${err4string}`)
        }
        await this.getMyFollowedNamesList()
        return ret
    }

    async checkMyMenuPlugins() {
        const appDelay = ms => new Promise(res => setTimeout(res, ms))

        if (localStorage.getItem("myMenuPlugs") === null) {
            await appDelay(1000)
            const listOfPlugins = this.menuList.filter(plugin=> plugin.url !== "puzzles")
            const addQapps = [...listOfPlugins, ...defaultQappsTabs]
            const myObj = JSON.stringify(addQapps)
            localStorage.setItem("myMenuPlugs", myObj)
            this.myMenuPlugins = JSON.parse(localStorage.getItem("myMenuPlugs") || "[]")
        } else {
            this.myMenuPlugins = JSON.parse(localStorage.getItem("myMenuPlugs") || "[]")
        }
    }

    resetMenu() {
        localStorage.removeItem("myMenuPlugs")
        this.firstUpdated()
    }

    val() {
        const theValue = this.shadowRoot.getElementById("pluginTypeInput").value

        if (theValue === "reject") {
            this.textFieldDisabled = false
            this.initialName = ''
            this.mwcIcon = ''
        } else if (theValue === "0") {
            this.textFieldDisabled = false
            this.initialName = ''
            this.mwcIcon = ''
        } else if (theValue === "1") {
            this.textFieldDisabled = false
            this.initialName = ''
            this.mwcIcon = ''
        } else if (theValue === 'overview-page') {
            this.mwcIcon = ''
            this.initialName = ''
            this.textFieldDisabled = true
            this.initialName = 'Overview Page'
            this.mwcIcon = 'home'
        } else if (theValue === 'minting') {
            this.mwcIcon = ''
            this.initialName = ''
            this.textFieldDisabled = true
            this.initialName = 'Minting Details'
            this.mwcIcon = 'info_outline'
        } else if (theValue === 'become-minter') {
            this.mwcIcon = ''
            this.initialName = ''
            this.textFieldDisabled = true
            this.initialName = 'Become a Minter'
            this.mwcIcon = 'thumb_up'
        } else if (theValue === 'sponsorship-list') {
            this.mwcIcon = ''
            this.initialName = ''
            this.textFieldDisabled = true
            this.initialName = 'Sponsorship List'
            this.mwcIcon = 'format_list_numbered'
        } else if (theValue === 'wallet') {
            this.mwcIcon = ''
            this.initialName = ''
            this.textFieldDisabled = true
            this.initialName = 'Wallets'
            this.mwcIcon = 'account_balance_wallet'
        } else if (theValue === 'trade-portal') {
            this.mwcIcon = ''
            this.initialName = ''
            this.textFieldDisabled = true
            this.initialName = 'Trade Portal'
            this.mwcIcon = 'format_list_bulleted'
        } else if (theValue === 'trade-bot-portal') {
            this.mwcIcon = ''
            this.initialName = ''
            this.textFieldDisabled = true
            this.initialName = 'Auto Buy'
            this.mwcIcon = 'shop'
        } else if (theValue === 'reward-share') {
            this.mwcIcon = ''
            this.initialName = ''
            this.textFieldDisabled = true
            this.initialName = 'Reward Share'
            this.mwcIcon = 'ios_share'
        } else if (theValue === 'q-chat') {
            this.mwcIcon = ''
            this.initialName = ''
            this.textFieldDisabled = true
            this.initialName = 'Q-Chat'
            this.mwcIcon = 'forum'
        } else if (theValue === 'name-registration') {
            this.mwcIcon = ''
            this.initialName = ''
            this.textFieldDisabled = true
            this.initialName = 'Name Registration'
            this.mwcIcon = 'manage_accounts'
        } else if (theValue === 'names-market') {
            this.mwcIcon = ''
            this.initialName = ''
            this.textFieldDisabled = true
            this.initialName = 'Names Market'
            this.mwcIcon = 'store'
        } else if (theValue === 'websites') {
            this.mwcIcon = ''
            this.initialName = ''
            this.textFieldDisabled = true
            this.initialName = 'Websites'
            this.mwcIcon = 'desktop_mac'
        } else if (theValue === 'qapps') {
            this.mwcIcon = ''
            this.initialName = ''
            this.textFieldDisabled = true
            this.initialName = 'Q-Apps'
            this.mwcIcon = 'apps'
        } else if (theValue === 'group-management') {
            this.mwcIcon = ''
            this.initialName = ''
            this.textFieldDisabled = true
            this.initialName = 'Group Management'
            this.mwcIcon = 'group'
        } else if (theValue === 'data-management') {
            this.mwcIcon = ''
            this.initialName = ''
            this.textFieldDisabled = true
            this.initialName = 'Data Management'
            this.mwcIcon = 'storage'
        } else if (theValue === 'puzzles') {
            this.mwcIcon = ''
            this.initialName = ''
            this.textFieldDisabled = true
            this.initialName = 'Puzzles'
            this.mwcIcon = 'extension'
        } else if (theValue === 'node-management') {
            this.mwcIcon = ''
            this.initialName = ''
            this.textFieldDisabled = true
            this.initialName = 'Node Management'
            this.mwcIcon = 'cloud'
        } else if (theValue === 'lottery') {
            this.mwcIcon = ''
            this.initialName = ''
            this.textFieldDisabled = true
            this.initialName = 'Qortal Lottery'
            this.mwcIcon = 'token'
        }
    }

    filterSelectMenu() {
        const addressInfoSelect = this.addressInfo
        const isMinterSelect = addressInfoSelect?.error !== 124 && +addressInfoSelect?.level > 0
        const isSponsorSelect = +addressInfoSelect?.level >= 5

        if (!isMinterSelect) {
            return html`
                <option value="overview-page">${translate("tabmenu.tm28")}</option>
                <option style="padding-top: 10px;" value="become-minter">${translate("tabmenu.tm2")}</option>
                <option style="padding-top: 10px;" value="wallet">${translate("tabmenu.tm4")}</option>
                <option style="padding-top: 10px;" value="trade-portal">${translate("tabmenu.tm5")}</option>
                <option style="padding-top: 10px;" value="trade-bot-portal">${translate("tabmenu.tm6")}</option>
                <option style="padding-top: 10px;" value="reward-share">${translate("tabmenu.tm7")}</option>
                <option style="padding-top: 10px;" value="q-chat">${translate("tabmenu.tm8")}</option>
                <option style="padding-top: 10px;" value="name-registration">${translate("tabmenu.tm9")}</option>
                <option style="padding-top: 10px;" value="names-market">${translate("tabmenu.tm10")}</option>
                <option style="padding-top: 10px;" value="websites">${translate("tabmenu.tm11")}</option>
                <option style="padding-top: 10px;" value="qapps">${translate("tabmenu.tm12")}</option>
                <option style="padding-top: 10px;" value="group-management">${translate("tabmenu.tm13")}</option>
                <option style="padding-top: 10px;" value="data-management">${translate("tabmenu.tm14")}</option>
                <option style="padding-top: 10px;" value="puzzles">${translate("tabmenu.tm15")}</option>
                <option style="padding-top: 10px;" value="node-management">${translate("tabmenu.tm16")}</option>
                <option style="padding-top: 10px;" value="lottery">${translate("tabmenu.tm42")}</option>
            `
        } else if (isMinterSelect && isSponsorSelect) {
            return html`
                <option value="overview-page">${translate("tabmenu.tm28")}</option>
                <option style="padding-top: 10px;" value="minting">${translate("tabmenu.tm1")}</option>
                <option style="padding-top: 10px;" value="sponsorship-list">${translate("tabmenu.tm3")}</option>
                <option style="padding-top: 10px;" value="wallet">${translate("tabmenu.tm4")}</option>
                <option style="padding-top: 10px;" value="trade-portal">${translate("tabmenu.tm5")}</option>
                <option style="padding-top: 10px;" value="trade-bot-portal">${translate("tabmenu.tm6")}</option>
                <option style="padding-top: 10px;" value="reward-share">${translate("tabmenu.tm7")}</option>
                <option style="padding-top: 10px;" value="q-chat">${translate("tabmenu.tm8")}</option>
                <option style="padding-top: 10px;" value="name-registration">${translate("tabmenu.tm9")}</option>
                <option style="padding-top: 10px;" value="names-market">${translate("tabmenu.tm10")}</option>
                <option style="padding-top: 10px;" value="websites">${translate("tabmenu.tm11")}</option>
                <option style="padding-top: 10px;" value="qapps">${translate("tabmenu.tm12")}</option>
                <option style="padding-top: 10px;" value="group-management">${translate("tabmenu.tm13")}</option>
                <option style="padding-top: 10px;" value="data-management">${translate("tabmenu.tm14")}</option>
                <option style="padding-top: 10px;" value="puzzles">${translate("tabmenu.tm15")}</option>
                <option style="padding-top: 10px;" value="node-management">${translate("tabmenu.tm16")}</option>
                <option style="padding-top: 10px;" value="lottery">${translate("tabmenu.tm42")}</option>
            `
        } else {
            return html`
                <option value="overview-page">${translate("tabmenu.tm28")}</option>
                <option style="padding-top: 10px;" value="minting">${translate("tabmenu.tm1")}</option>
                <option style="padding-top: 10px;" value="wallet">${translate("tabmenu.tm4")}</option>
                <option style="padding-top: 10px;" value="trade-portal">${translate("tabmenu.tm5")}</option>
                <option style="padding-top: 10px;" value="trade-bot-portal">${translate("tabmenu.tm6")}</option>
                <option style="padding-top: 10px;" value="reward-share">${translate("tabmenu.tm7")}</option>
                <option style="padding-top: 10px;" value="q-chat">${translate("tabmenu.tm8")}</option>
                <option style="padding-top: 10px;" value="name-registration">${translate("tabmenu.tm9")}</option>
                <option style="padding-top: 10px;" value="names-market">${translate("tabmenu.tm10")}</option>
                <option style="padding-top: 10px;" value="websites">${translate("tabmenu.tm11")}</option>
                <option style="padding-top: 10px;" value="qapps">${translate("tabmenu.tm12")}</option>
                <option style="padding-top: 10px;" value="group-management">${translate("tabmenu.tm13")}</option>
                <option style="padding-top: 10px;" value="data-management">${translate("tabmenu.tm14")}</option>
                <option style="padding-top: 10px;" value="puzzles">${translate("tabmenu.tm15")}</option>
                <option style="padding-top: 10px;" value="node-management">${translate("tabmenu.tm16")}</option>
                <option style="padding-top: 10px;" value="lottery">${translate("tabmenu.tm42")}</option>
            `
        }
    }

    openAddNewPlugin() {
        this.shadowRoot.getElementById("pluginTypeInput").value = 'reject'
        this.shadowRoot.getElementById("pluginNameInput").value = ''
        this.initialName = ''
        this.textFieldDisabled = false
        this.shadowRoot.querySelector('#addNewPlugin').show()
    }

    async addToMyMenuPlugins() {
        this.newId = ''
        const newUid = new ShortUniqueId({ length: 10 })
        this.newId = 'plugin-' + newUid.rnd()

        this.pluginType = this.shadowRoot.getElementById("pluginTypeInput").value

        if (this.pluginType === "reject") {
            let myplugerr = get("tabmenu.tm25")
            parentEpml.request('showSnackBar', `${myplugerr}`)
            return false
        } else if (this.pluginType === "0") {
            this.mwcIcon = ''
            this.pluginName = this.shadowRoot.getElementById('pluginNameInput').value

            if (this.pluginName === "Q-Blog") {
                this.mwcIcon = 'rss_feed'
            } else if (this.pluginName === "Q-Mail") {
                this.mwcIcon = 'mail'
            } else {
                this.mwcIcon = 'apps'
            }

            var oldMenuPlugs = JSON.parse(localStorage.getItem("myMenuPlugs") || "[]")

            const newMenuPlugsItem = {
                "url": "myapp",
                "domain": "core",
                "page": `qdn/browser/index.html?name=${this.pluginName}&service=APP`,
                "title": this.pluginName,
                "icon": "vaadin:external-browser",
                "mwcicon": this.mwcIcon,
                "pluginNumber": this.newId,
                "menus": [],
                "parent": false
            }

            const validatePluginName = async () => {
                if (this.pluginType === "0" && this.pluginName.length == 0) {
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

                myPluginName = !(this.myPluginNameRes === undefined || this.myPluginNameRes.length == 0);
                return myPluginName
            }

            let myNameRes = await validatePluginName()

            if (myNameRes !== false) {
                oldMenuPlugs.push(newMenuPlugsItem)
                const copyPayload = [...oldMenuPlugs]

                localStorage.setItem("myMenuPlugs", JSON.stringify(oldMenuPlugs))
                this.saveSettingToTemp(copyPayload)

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
            this.mwcIcon = ''
            this.pluginName = this.shadowRoot.getElementById('pluginNameInput').value

            this.mwcIcon = 'web'

            var oldMenuPlugs = JSON.parse(localStorage.getItem("myMenuPlugs") || "[]")

            const newMenuPlugsItem = {
                "url": "myapp",
                "domain": "core",
                "page": `qdn/browser/index.html?name=${this.pluginName}&service=WEBSITE`,
                "title": this.pluginName,
                "icon": "vaadin:external-browser",
                "mwcicon": this.mwcIcon,
                "pluginNumber": this.newId,
                "menus": [],
                "parent": false
            }

            const validatePluginName = async () => {
                if (this.pluginType === "1" && this.pluginName.length == 0) {
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

                myPluginName = !(this.myPluginNameRes === undefined || this.myPluginNameRes.length == 0);
                return myPluginName
            }

            let myNameRes = await validatePluginName()

            if (myNameRes !== false) {
                oldMenuPlugs.push(newMenuPlugsItem)
                const copyPayload = [...oldMenuPlugs]

                localStorage.setItem("myMenuPlugs", JSON.stringify(oldMenuPlugs))
                this.saveSettingToTemp(copyPayload)
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
        } else {
            this.pluginPage = ''
            if (this.pluginType === 'overview-page') {
                this.pluginPage = 'overview-page/index.html'
            } else if (this.pluginType === 'minting') {
                this.pluginPage = 'minting/index.html'
            } else if (this.pluginType === 'become-minter') {
                this.pluginPage = 'become-minter/index.html'
            } else if (this.pluginType === 'sponsorship-list') {
                this.pluginPage = 'sponsorship-list/index.html'
            } else if (this.pluginType === 'wallet') {
                this.pluginPage = 'wallet/index.html'
            } else if (this.pluginType === 'trade-portal') {
                this.pluginPage = 'trade-portal/index.html'
            } else if (this.pluginType === 'trade-bot-portal') {
                this.pluginPage = 'trade-bot/index.html'
            } else if (this.pluginType === 'reward-share') {
                this.pluginPage = 'reward-share/index.html'
            } else if (this.pluginType === 'q-chat') {
                this.pluginPage = 'messaging/q-chat/index.html'
            } else if (this.pluginType === 'name-registration') {
                this.pluginPage = 'name-registration/index.html'
            } else if (this.pluginType === 'names-market') {
                this.pluginPage = 'names-market/index.html'
            } else if (this.pluginType === 'websites') {
                this.pluginPage = 'qdn/index.html'
            } else if (this.pluginType === 'qapps') {
                this.pluginPage = 'q-app/index.html'
            } else if (this.pluginType === 'group-management') {
                this.pluginPage = 'group-management/index.html'
            } else if (this.pluginType === 'data-management') {
                this.pluginPage = 'qdn/data-management/index.html'
            } else if (this.pluginType === 'puzzles') {
                this.pluginPage = 'puzzles/index.html'
            } else if (this.pluginType === 'node-management') {
                this.pluginPage = 'node-management/index.html'
            } else if (this.pluginType === 'lottery') {
                this.pluginPage = 'qortal-lottery/index.html'
            }

            var oldMenuPlugs = JSON.parse(localStorage.getItem("myMenuPlugs") || "[]")

            const newMenuPlugsItem = {
                "url": this.pluginType,
                "domain": "core",
                "page": this.pluginPage,
                "title": this.initialName,
                "icon": "vaadin:external-browser",
                "mwcicon": this.mwcIcon,
                "pluginNumber": this.newId,
                "menus": [],
                "parent": false
            }

            oldMenuPlugs.push(newMenuPlugsItem)
            const copyPayload = [...oldMenuPlugs]

            localStorage.setItem("myMenuPlugs", JSON.stringify(oldMenuPlugs))
            this.saveSettingToTemp(copyPayload)
            let myplugstring2 = get("walletpage.wchange52")
            parentEpml.request('showSnackBar', `${myplugstring2}`)

            this.closeAddNewPlugin()

            this.myMenuPlugins = JSON.parse(localStorage.getItem("myMenuPlugs") || "[]")
            this.firstUpdated()
        }
    }

    closeAddNewPlugin() {
        this.shadowRoot.querySelector('#addNewPlugin').close()
        this.shadowRoot.getElementById("pluginTypeInput").value = 'reject'
        this.shadowRoot.getElementById("pluginNameInput").value = ''
        this.initialName = ''
        this.textFieldDisabled = false
    }

    renderTitle(theUrl, theName) {
        if (theUrl === 'overview-page') {
            return html`<span>${translate('tabmenu.tm28')}</span>`
        } else if (theUrl === 'minting') {
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
        } else if (theUrl === 'lottery') {
            return html`<span>${translate('tabmenu.tm42')}</span>`
        } else {
            return html`<span>${theName}</span>`
        }
    }

    renderRemoveIcon(appurl, appicon, appname, appid, appplugin) {
        return html`

            <div class="menuIconPos" @click="${() => this.changePage(appplugin)}">
            <div class="removeIconPos" title="${translate('tabmenu.tm22')}" @click="${(event) => {
                              event.stopPropagation();
                              this.openRemoveApp(appname, appid, appurl)
            } }">
                <mwc-icon class="removeIcon">backspace</mwc-icon>
            </div>
                ${appurl === 'myapp' ? html`
                <app-avatar appicon=${appicon} appname=${appname}></app-avatar>
                ` : html`
                <mwc-icon class="menuIcon">${appicon}</mwc-icon>

                `}
            </div>
        `
    }

    openRemoveApp(pluginNameTD, pluginNumberTD, pluginUrlTD) {
        this.pluginNameToDelete = ''
        this.pluginNameToDelete = pluginNameTD
        this.pluginNumberToDelete = ''
        this.pluginNumberToDelete = pluginNumberTD
        this.removeTitle = ''
        if (pluginUrlTD === 'overview-page') {
            this.removeTitle = html`<span>${translate('tabmenu.tm28')}</span>`
        } else if (pluginUrlTD === 'minting') {
            this.removeTitle = html`<span>${translate('tabmenu.tm1')}</span>`
        } else if (pluginUrlTD === 'become-minter') {
            this.removeTitle = html`<span>${translate('tabmenu.tm2')}</span>`
        } else if (pluginUrlTD === 'sponsorship-list') {
            this.removeTitle = html`<span>${translate('tabmenu.tm3')}</span>`
        } else if (pluginUrlTD === 'wallet') {
            this.removeTitle = html`<span>${translate('tabmenu.tm4')}</span>`
        } else if (pluginUrlTD === 'trade-portal') {
            this.removeTitle = html`<span>${translate('tabmenu.tm5')}</span>`
        } else if (pluginUrlTD === 'trade-bot-portal') {
            this.removeTitle = html`<span>${translate('tabmenu.tm6')}</span>`
        } else if (pluginUrlTD === 'reward-share') {
            this.removeTitle = html`<span>${translate('tabmenu.tm7')}</span>`
        } else if (pluginUrlTD === 'q-chat') {
            this.removeTitle = html`<span>${translate('tabmenu.tm8')}</span>`
        } else if (pluginUrlTD === 'name-registration') {
            this.removeTitle = html`<span>${translate('tabmenu.tm9')}</span>`
        } else if (pluginUrlTD === 'names-market') {
            this.removeTitle = html`<span>${translate('tabmenu.tm10')}</span>`
        } else if (pluginUrlTD === 'websites') {
            this.removeTitle = html`<span>${translate('tabmenu.tm11')}</span>`
        } else if (pluginUrlTD === 'qapps') {
            this.removeTitle = html`<span>${translate('tabmenu.tm12')}</span>`
        } else if (pluginUrlTD === 'group-management') {
            this.removeTitle = html`<span>${translate('tabmenu.tm13')}</span>`
        } else if (pluginUrlTD === 'data-management') {
            this.removeTitle = html`<span>${translate('tabmenu.tm14')}</span>`
        } else if (pluginUrlTD === 'puzzles') {
            this.removeTitle = html`<span>${translate('tabmenu.tm15')}</span>`
        } else if (pluginUrlTD === 'node-management') {
            this.removeTitle = html`<span>${translate('tabmenu.tm16')}</span>`
        } else if (pluginUrlTD === 'lottery') {
            this.removeTitle = html`<span>${translate('tabmenu.tm42')}</span>`
        } else {
            this.removeTitle = html`<span>${pluginNameTD}</span>`
        }
        this.shadowRoot.querySelector('#removePlugin').show()
    }

    removeAppFromArray() {
        const pluginToRemove = this.pluginNumberToDelete
        this.newMenuFilter = []
        this.newMenuFilter = this.myMenuList.filter((item) => item.pluginNumber !== pluginToRemove)
        const copyPayload = [...this.newMenuFilter]

        const myNewObj = JSON.stringify(this.newMenuFilter)
        localStorage.removeItem("myMenuPlugs")
        localStorage.setItem("myMenuPlugs", myNewObj)
        this.saveSettingToTemp(copyPayload)
        this.myMenuPlugins = JSON.parse(localStorage.getItem("myMenuPlugs") || "[]")
        this.firstUpdated()
        this.closeRemoveApp()
    }

    saveSettingToTemp(data){
        const tempSettingsData= JSON.parse(localStorage.getItem('temp-settings-data') || "{}")
		const newTemp = {
			...tempSettingsData,
			myMenuPlugs: {
				data: data,
				timestamp: Date.now()
			}
		}

		localStorage.setItem('temp-settings-data', JSON.stringify(newTemp));
		this.dispatchEvent(
			new CustomEvent('temp-settings-data-event', {
			  bubbles: true,
			  composed: true
			}),
		  );
    }

    closeRemoveApp() {
        this.shadowRoot.querySelector('#removePlugin').close()
        this.pluginNameToDelete = ''
        this.pluginNumberToDelete = ''
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
                "url": "myapp",
                "domain": "core",
                "page": `qdn/browser/index.html${query}`,
                "title": name || "Q-App",
                "icon": "vaadin:external-browser",
                "mwcicon": "open_in_browser",
                "menus": [],
                "parent": false
            })
        } else if (service === "WEBSITE") {
            this.changePage({
                "url": "myapp",
                "domain": "core",
                "page": `qdn/browser/index.html${query}`,
                "title": name || "Website",
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
            await this.getQuery(value)
        } catch (error) {
        }
    }

    async _handleKeyDown(e) {
        if (e.key === 'Enter') {
            try {
                const value = this.shadowRoot.getElementById('linkInput').value
                await this.getQuery(value)
            } catch (error) {
            }
        }
    }

    getApiKey() {
        const apiNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return apiNode.apiKey
    }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }

    stateChanged(state) {
        this.menuList = state.app.registeredUrls
        this.addressInfo = state.app.accountInfo.addressInfo
    }
}

customElements.define('nav-bar', NavBar)


class AppAvatar extends LitElement {
    static get properties() {
        return {
            hasAvatar: { type: Boolean },
            isImageLoaded: {type: Boolean},
            appicon: {type: String},
            appname: {type: String}
        }
    }

    constructor() {
        super()

        this.hasAvatar = false
        this.isImageLoaded = false
        this.imageFetches = 0
    }

    static get styles() {

        return css`
          :host {
            position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
        }
        .menuIcon {
        color: var(--app-icon);
        --mdc-icon-size: 64px;
        cursor: pointer;
    }


            `
    }

    createImage(imageUrl)  {
        const imageHTMLRes = new Image();
        imageHTMLRes.src = imageUrl;
        imageHTMLRes.style= "border-radius:10px; font-size:14px; object-fit: fill;height:60px;width:60px";

        imageHTMLRes.onload = () => {
            this.isImageLoaded = true;
        }
        imageHTMLRes.onerror = () => {
            if (this.imageFetches < 1) {
                setTimeout(() => {
                    this.imageFetches = this.imageFetches + 1;
                    imageHTMLRes.src = imageUrl;
                }, 5000);
            } else {
               this.isImageLoaded = false
            }
        };
        return imageHTMLRes;
      }

    render(){
        let avatarImg = ""
        if (this.appname) {
            const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
            const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
            const avatarUrl = `${nodeUrl}/arbitrary/THUMBNAIL/${this.appname}/qortal_avatar?async=true&apiKey=${myNode.apiKey}`;
           avatarImg = this.createImage(avatarUrl)
        }

        return html`
            ${this.isImageLoaded ? html`
            ${avatarImg}
            ` : html`
            <mwc-icon class="menuIcon">${this.appicon}</mwc-icon>
            `}
        `
    }

}

customElements.define('app-avatar', AppAvatar)

class TabAvatar extends LitElement {
    static get properties() {
        return {
            hasAvatar: { type: Boolean },
            isImageLoaded: {type: Boolean},
            appicon: {type: String},
            appname: {type: String}
        }
    }

    constructor() {
        super()

        this.hasAvatar = false
        this.isImageLoaded = false
        this.imageFetches = 0
    }



    createImage(imageUrl)  {
        const imageHTMLRes = new Image();
        imageHTMLRes.src = imageUrl;
        imageHTMLRes.style= "border-radius:4px; font-size:14px; object-fit: fill;height:24px;width:24px";

        imageHTMLRes.onload = () => {
            this.isImageLoaded = true;
        }
        imageHTMLRes.onerror = () => {
            if (this.imageFetches < 1) {
                setTimeout(() => {
                    this.imageFetches = this.imageFetches + 1;
                    imageHTMLRes.src = imageUrl;
                }, 5000);
            } else {
               this.isImageLoaded = false
            }
        };
        return imageHTMLRes;
      }

    render(){
        let avatarImg = ""
        if (this.appname) {
            const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
            const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
            const avatarUrl = `${nodeUrl}/arbitrary/THUMBNAIL/${this.appname}/qortal_avatar?async=true&apiKey=${myNode.apiKey}`;
           avatarImg = this.createImage(avatarUrl)
        }

        return html`
            ${this.isImageLoaded ? html`
            ${avatarImg}
            ` : html`
            <mwc-icon>${this.appicon}</mwc-icon>
            `}
        `
    }

}

customElements.define('tab-avatar', TabAvatar)
