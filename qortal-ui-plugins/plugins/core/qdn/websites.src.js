import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../epml.js'

import '@material/mwc-icon'
import '@material/mwc-button'
import '@material/mwc-tab-bar'
import '@material/mwc-textfield'
import '@vaadin/button'
import '@vaadin/grid'
import '@vaadin/icon'
import '@vaadin/icons'
import '@vaadin/text-field'


const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class Websites extends LitElement {
    static get properties() {
        return {
            service: { type: String },
            identifier: { type: String },
            loading: { type: Boolean },
            resources: { type: Array },
            followedNames: { type: Array },
            blockedNames: { type: Array },
            relayMode: { type: Boolean },
            selectedAddress: { type: Object },
            searchName: { type: String },
            searchResources: { type: Array },
            searchFollowedNames: { type: Array },
            searchBlockedNames: { type: Array },
            webResources: { type: Array },
            webFollowedNames: { type: Array },
            webBlockedNames: { type: Array },
            blockResources: { type: Array },
            blockFollowedNames: { type: Array },
            blockBlockedNames: { type: Array }
        }
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --paper-input-container-focus-color: var(--mdc-theme-primary);
                --lumo-primary-text-color: rgb(0, 167, 245);
                --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
                --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
                --lumo-primary-color: hsl(199, 100%, 48%);
            }

            #tabs-1 {
		--mdc-tab-height: 50px;
            }

            #tabs-1-content {
		height: 100%;
		padding-bottom: 10px;
            }

	    #pages {
		display: flex;
		flex-wrap: wrap;
	        padding: 10px 5px 5px 5px;
		margin: 0px 20px 20px 20px;
	    }

	    #pages > button {
		user-select: none;
		padding: 5px;
		margin: 0 5px;
		border-radius: 10%;
		border: 0;
		background: transparent;
		font: inherit;
		outline: none;
		cursor: pointer;
	    }

	    #pages > button:not([disabled]):hover,
	    #pages > button:focus {
		color: #ccc;
		background-color: #eee;
	    }

	    #pages > button[selected] {
		font-weight: bold;
		color: white;
		background-color: #ccc;
	    }

	    #pages > button[disabled] {
		opacity: 0.5;
		cursor: default;
	    }

            #websites-list-page {
                background: #fff;
                padding: 12px 24px;
            }

            #search {
               display: flex;
               width: 50%;
               align-items: center;
            }

            .divCard {
                border: 1px solid #eee;
                padding: 1em;
                box-shadow: 0 .3px 1px 0 rgba(0,0,0,0.14), 0 1px 1px -1px rgba(0,0,0,0.12), 0 1px 2px 0 rgba(0,0,0,0.20);
                margin-bottom: 2em;
            }

            h2 {
                margin:0;
            }

            h2, h3, h4, h5 {
                color:#333;
                font-weight: 400;
            }

            a.visitSite {
                color: #000;
                text-decoration: none;
            }

            [hidden] {
                display: hidden !important;
                visibility: none !important;
            }

            .details {
                display: flex;
                font-size: 18px;
            }

            span {
                font-size: 14px;
                word-break: break-all;
            }

            select {
                padding: 13px 20px;
                width: 100%;
                font-size: 14px;
                color: #555;
                font-weight: 400;
            }

            .title {
                font-weight:600;
                font-size:12px;
                line-height: 32px;
                opacity: 0.66;
            }

            .itemList {
                padding:0;
            }

            .relay-mode-notice {
                margin:auto;
                text-align:center;
                word-break:normal;
                font-size:14px;
                line-height:20px;
                color:rgb(100,100,100);
            }

            img {
                border-radius: 25%;
                max-width: 42px;
                height: 100%;
                max-height: 42px;
            }
        `
    }

    constructor() {
        super()
        this.service = "WEBSITE"
        this.identifier = null
        this.selectedAddress = {}
        this.resources = []
        this.followedNames = []
        this.blockedNames = []
        this.relayMode = null
        this.isLoading = false
        this.searchName = ''
        this.searchResources = []
        this.searchFollowedNames = []
        this.searchBlockedNames = []
        this.webResources = []
        this.webFollowedNames = []
        this.webBlockedNames = []
        this.blockResources = []
        this.blockFollowedNames = []
        this.blockBlockedNames = []
    }

    render() {
        return html`
            <div id="websites-list-page">
                <mwc-tab-bar id="tabs-1" activeIndex="0">
                    <mwc-tab label="Browse Websites" icon="travel_explore" @click="${(e) => this.displayTabContent('browse')}"></mwc-tab>
                    <mwc-tab label="Followed Websites" icon="desktop_windows" @click="${(e) => this.displayTabContent('followed')}"></mwc-tab>
                    <mwc-tab label="Blocked Websites" icon="block" @click="${(e) => this.displayTabContent('blocked')}"></mwc-tab>
                </mwc-tab-bar>
                <z id="tabs-1-content">
                    <div id="tab-browse-content">
	                <div style="min-height:48px; display: flex; padding-bottom: 6px; margin: 2px;">
        	            <h2 style="margin: 0; flex: 1; padding-top: .5em; display: inline;">Browse Websites</h2>
                	    <h2 style="margin: 0; flex: 1; padding-top: .5em; display: inline;">${this.renderPublishButton()}</h2>
	                </div>
        	        <div class="divCard">
                    	    <h3 style="margin: 0; margin-bottom: 1em; text-align: left;">Search Websites</h3>
	                    <div id="search">
	                        <vaadin-text-field theme="medium" id="searchName" placeholder="Name to search" value="${this.searchName}" @keydown="${this.searchListener}" clear-button-visible>
	                            <vaadin-icon slot="prefix" icon="vaadin:user"></vaadin-icon>
	                        </vaadin-text-field>&nbsp;&nbsp;<br>
	                        <vaadin-button theme="medium" @click="${(e) => this.doSearch(e)}">
	                            <vaadin-icon icon="vaadin:search" slot="prefix"></vaadin-icon>
	                            Search
	                        </vaadin-button>
	                    </div><br />
	                    <vaadin-grid theme="large" id="searchResourcesGrid" ?hidden="${this.isEmptyArray(this.searchResources)}" .items="${this.searchResources}" aria-label="Search Websites" all-rows-visible>
	                        <vaadin-grid-column width="5rem" flex-grow="0" header="Avatar" .renderer=${(root, column, data) => {
	                            render(html`${this.renderSearchAvatar(data.item)}`, root)
	                        }}>
	                        </vaadin-grid-column>
	                        <vaadin-grid-column header="Name" .renderer=${(root, column, data) => {
	                            render(html`${this.renderSearchName(data.item)}`, root)
	                        }}>
	                        </vaadin-grid-column>
	                        <vaadin-grid-column header="Status" .renderer=${(root, column, data) => {
	                             render(html`${this.renderSearchStatus(data.item)}`, root)
	                        }}>
	                        </vaadin-grid-column>
				<vaadin-grid-column header="Size" .renderer=${(root, column, data) => {
	                            render(html`${this.renderSearchSize(data.item)}`, root)
	                        }}>
	                        </vaadin-grid-column>
	                        <vaadin-grid-column width="10rem" flex-grow="0" header="Action" .renderer=${(root, column, data) => {
	                            render(html`${this.renderSearchFollowUnfollowButton(data.item)}`, root);
	                        }}>
	                        </vaadin-grid-column>
	                        <vaadin-grid-column width="10rem" flex-grow="0" header="" .renderer=${(root, column, data) => {
	                            render(html`${this.renderSearchBlockUnblockButton(data.item)}`, root);
	                        }}>
	                        </vaadin-grid-column>
	                    </vaadin-grid><br />
	                </div>
	                <div class="divCard">
	                    <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">Websites</h3>
	                    <vaadin-grid theme="large" id="resourcesGrid" ?hidden="${this.isEmptyArray(this.resources)}" aria-label="Websites" page-size="20" all-rows-visible>
	                        <vaadin-grid-column width="5rem" flex-grow="0" header="Avatar" .renderer=${(root, column, data) => {
	                            render(html`${this.renderAvatar(data.item)}`, root)
	                        }}>
	                        </vaadin-grid-column>
	                        <vaadin-grid-column header="Name" .renderer=${(root, column, data) => {
	                            render(html`${this.renderName(data.item)}`, root)
	                        }}>
	                        </vaadin-grid-column>
	                        <vaadin-grid-column header="Status" .renderer=${(root, column, data) => {
	                            render(html`${this.renderStatus(data.item)}`, root)
	                        }}>
	                        </vaadin-grid-column>
				<vaadin-grid-column header="Size" .renderer=${(root, column, data) => {
	                            render(html`${this.renderSize(data.item)}`, root)
	                        }}>
	                        </vaadin-grid-column>
	                        <vaadin-grid-column width="10rem" flex-grow="0" header="Action" .renderer=${(root, column, data) => {
	                            render(html`${this.renderFollowUnfollowButton(data.item)}`, root);
	                        }}>
	                        </vaadin-grid-column>
	                        <vaadin-grid-column width="10rem" flex-grow="0" header="" .renderer=${(root, column, data) => {
	                            render(html`${this.renderBlockUnblockButton(data.item)}`, root);
	                        }}>
	                        </vaadin-grid-column>
	                    </vaadin-grid>
	                    <div id="pages"></div>
	                    ${this.isEmptyArray(this.resources) ? html`
	                        No websites available
	                    `: ''}
	                </div>
	                ${this.renderRelayModeText()}
	            </div>
                    <div id="tab-followed-content">
	                <div style="min-height:48px; display: flex; padding-bottom: 6px; margin: 2px;">
        	            <h2 style="margin: 0; flex: 1; padding-top: .5em; display: inline;">Your followed Webistes</h2>
                	    <h2 style="margin: 0; flex: 1; padding-top: .5em; display: inline;">${this.renderPublishButton()}</h2>
	                </div>
	                <div class="divCard">
	                    <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">Followed Websites</h3>
	                    <vaadin-grid theme="large" id="webResourcesGrid" ?hidden="${this.isEmptyArray(this.webResources)}" .items="${this.webResources}" aria-label="Followed Websites" all-rows-visible>
	                        <vaadin-grid-column width="5rem" flex-grow="0" header="Avatar" .renderer=${(root, column, data) => {
	                            render(html`${this.renderWebAvatar(data.item)}`, root)
	                        }}>
	                        </vaadin-grid-column>
	                        <vaadin-grid-column header="Name" .renderer=${(root, column, data) => {
	                            render(html`${this.renderWebName(data.item)}`, root)
	                        }}>
	                        </vaadin-grid-column>
	                        <vaadin-grid-column header="Status" .renderer=${(root, column, data) => {
	                            render(html`${this.renderWebStatus(data.item)}`, root)
	                        }}>
	                        </vaadin-grid-column>
				<vaadin-grid-column header="Size" .renderer=${(root, column, data) => {
	                            render(html`${this.renderWebSize(data.item)}`, root)
	                        }}>
	                        </vaadin-grid-column>
	                        <vaadin-grid-column width="10rem" flex-grow="0" header="Action" .renderer=${(root, column, data) => {
	                            render(html`${this.renderWebFollowUnfollowButton(data.item)}`, root);
	                        }}>
	                        </vaadin-grid-column>
	                        <vaadin-grid-column width="10rem" flex-grow="0" header="" .renderer=${(root, column, data) => {
	                            render(html`${this.renderWebBlockUnblockButton(data.item)}`, root);
	                        }}>
	                        </vaadin-grid-column>
	                    </vaadin-grid>
	                    ${this.isEmptyArray(this.webResources) ? html`
	                        You not follow any website
	                    `: ''}
	                </div>
	                ${this.renderRelayModeText()}
	            </div>
                    <div id="tab-blocked-content">
	                <div style="min-height:48px; display: flex; padding-bottom: 6px; margin: 2px;">
        	            <h2 style="margin: 0; flex: 1; padding-top: .5em; display: inline;">Your blocked Webistes</h2>
                	    <h2 style="margin: 0; flex: 1; padding-top: .5em; display: inline;">${this.renderPublishButton()}</h2>
	                </div>
	                <div class="divCard">
	                    <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">Blocked Websites</h3>
	                    <vaadin-grid theme="large" id="blockResourcesGrid" ?hidden="${this.isEmptyArray(this.blockResources)}" .items="${this.blockResources}" aria-label="Followed Websites" all-rows-visible>
	                        <vaadin-grid-column width="5rem" flex-grow="0" header="Avatar" .renderer=${(root, column, data) => {
	                            render(html`${this.renderBlockAvatar(data.item)}`, root)
	                        }}>
	                        </vaadin-grid-column>
	                        <vaadin-grid-column header="Name" .renderer=${(root, column, data) => {
	                            render(html`${this.renderBlockName(data.item)}`, root)
	                        }}>
	                        </vaadin-grid-column>
	                        <vaadin-grid-column header="Status" .renderer=${(root, column, data) => {
	                            render(html`${this.renderBlockStatus(data.item)}`, root)
	                        }}>
	                        </vaadin-grid-column>
				<vaadin-grid-column header="Size" .renderer=${(root, column, data) => {
	                            render(html`${this.renderBlockSize(data.item)}`, root)
	                        }}>
	                        </vaadin-grid-column>
	                        <vaadin-grid-column width="10rem" flex-grow="0" header="Action" .renderer=${(root, column, data) => {
	                            render(html`${this.renderBlockFollowUnfollowButton(data.item)}`, root);
	                        }}>
	                        </vaadin-grid-column>
	                        <vaadin-grid-column width="10rem" flex-grow="0" header="" .renderer=${(root, column, data) => {
	                            render(html`${this.renderBlockBlockUnblockButton(data.item)}`, root);
	                        }}>
	                        </vaadin-grid-column>
	                    </vaadin-grid>
	                    ${this.isEmptyArray(this.blockResources) ? html`
	                        You have not blocked any website
	                    `: ''}
	                </div>
	                ${this.renderRelayModeText()}
	            </div>
	        </div>
	    </div>
        `
    }

    firstUpdated() {

        this.showWebsites()

        setTimeout(() => {
            this.displayTabContent('browse')
        }, 0)

        const getFollowedNames = async () => {
            let followedNames = await parentEpml.request('apiCall', {
                url: `/lists/followedNames?apiKey=${this.getApiKey()}`
            })

            this.followedNames = followedNames
            setTimeout(getFollowedNames, 60000)
        }

        const getBlockedNames = async () => {
            let blockedNames = await parentEpml.request('apiCall', {
                url: `/lists/blockedNames?apiKey=${this.getApiKey()}`
            })

            this.blockedNames = blockedNames
            setTimeout(getBlockedNames, 60000)
        }

        const getWebFollowedNames = async () => {
            let webFollowedNames = await parentEpml.request('apiCall', {
                url: `/lists/followedNames?apiKey=${this.getApiKey()}`
            })

            this.webFollowedNames = webFollowedNames
            setTimeout(getWebFollowedNames, 60000)
        }

        const getWebBlockedNames = async () => {
            let webBlockedNames = await parentEpml.request('apiCall', {
                url: `/lists/blockedNames?apiKey=${this.getApiKey()}`
            })

            this.webBlockedNames = webBlockedNames
            setTimeout(getWebBlockedNames, 60000)
        }

        const getBlockFollowedNames = async () => {
            let blockFollowedNames = await parentEpml.request('apiCall', {
                url: `/lists/followedNames?apiKey=${this.getApiKey()}`
            })

            this.blockFollowedNames = blockFollowedNames
            setTimeout(getBlockFollowedNames, 60000)
        }

        const getBlockBlockedNames = async () => {
            let blockBlockedNames = await parentEpml.request('apiCall', {
                url: `/lists/blockedNames?apiKey=${this.getApiKey()}`
            })

            this.blockBlockedNames = blockBlockedNames
            setTimeout(getBlockBlockedNames, 60000)
        }

        const getSearchFollowedNames = async () => {
            let searchFollowedNames = await parentEpml.request('apiCall', {
                url: `/lists/followedNames?apiKey=${this.getApiKey()}`
            })

            this.searchFollowedNames = searchFollowedNames
            setTimeout(getSearchFollowedNames, 60000)
        }

        const getSearchBlockedNames = async () => {
            let searchBlockedNames = await parentEpml.request('apiCall', {
                url: `/lists/blockedNames?apiKey=${this.getApiKey()}`
            })

            this.searchBlockedNames = searchBlockedNames
            setTimeout(getSearchBlockedNames, 60000)
        }

        const getRelayMode = async () => {
            let relayMode = await parentEpml.request('apiCall', {
                url: `/arbitrary/relaymode?apiKey=${this.getApiKey()}`
            })

            this.relayMode = relayMode;
            setTimeout(getRelayMode, 60000)
        }

        window.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            this._textMenu(event)
        });

        window.addEventListener("click", () => {
            parentEpml.request('closeCopyTextMenu', null)
        });

        window.onkeyup = (e) => {
            if (e.keyCode === 27) {
                parentEpml.request('closeCopyTextMenu', null)
            }
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
                    setTimeout(this.getArbitraryResources, 1)
                    setTimeout(this.getFollowedWebsites, 1)
                    setTimeout(this.getBlockedWebsites, 1)
                    setTimeout(getFollowedNames, 1)
                    setTimeout(getBlockedNames, 1)
                    setTimeout(getWebFollowedNames, 1)
                    setTimeout(getWebBlockedNames, 1)
                    setTimeout(getBlockFollowedNames, 1)
                    setTimeout(getBlockBlockedNames, 1)
                    setTimeout(getSearchFollowedNames, 1)
                    setTimeout(getSearchBlockedNames, 1)
                    setTimeout(getRelayMode, 1)
                    setInterval(this.getArbitraryResources, 120000)
                    setInterval(this.getFollowedWebsites, 60000)
                    setInterval(this.getBlockedWebsites, 60000)
                    configLoaded = true
                }
                this.config = JSON.parse(c)
            })
            parentEpml.subscribe('copy_menu_switch', async value => {
                if (value === 'false' && window.getSelection().toString().length !== 0) {
                    this.clearSelection()
                }
            })
        })
        parentEpml.imReady()
    }

    displayTabContent(tab) {
        const tabBrowseContent = this.shadowRoot.getElementById('tab-browse-content')
        const tabFollowedContent = this.shadowRoot.getElementById('tab-followed-content')
        const tabBlockedContent = this.shadowRoot.getElementById('tab-blocked-content')
        tabBrowseContent.style.display = (tab === 'browse') ? 'block' : 'none'
        tabFollowedContent.style.display = (tab === 'followed') ? 'block' : 'none'
        tabBlockedContent.style.display = (tab === 'blocked') ? 'block' : 'none'
    }

    searchListener(e) {
        if (e.key === 'Enter') {
            this.doSearch(e);
        }
    }

    async getResourcesGrid() {
        this.resourcesGrid = this.shadowRoot.querySelector(`#resourcesGrid`)
        this.pagesControl = this.shadowRoot.querySelector('#pages')
        this.pages = undefined
    }

    getArbitraryResources = async () => {
        const resources = await parentEpml.request('apiCall', {
            url: `/arbitrary/resources?service=${this.service}&default=true&limit=0&reverse=false&includestatus=true`
        })
        this.resources = resources
    }

    async updateItemsFromPage(page) {
        if (page === undefined) {
            return
        }

        if (!this.pages) {
            this.pages = Array.apply(null, { length: Math.ceil(this.resources.length / this.resourcesGrid.pageSize) }).map((item, index) => {
                return index + 1
            })

            const prevBtn = document.createElement('button')
            prevBtn.textContent = '<'
            prevBtn.addEventListener('click', () => {
                const selectedPage = parseInt(this.pagesControl.querySelector('[selected]').textContent)
                this.updateItemsFromPage(selectedPage - 1)
            })
            this.pagesControl.appendChild(prevBtn)

            this.pages.forEach((pageNumber) => {
                const pageBtn = document.createElement('button')
                pageBtn.textContent = pageNumber
                pageBtn.addEventListener('click', (e) => {
                    this.updateItemsFromPage(parseInt(e.target.textContent))
                })
                if (pageNumber === page) {
                    pageBtn.setAttribute('selected', true)
                }
                this.pagesControl.appendChild(pageBtn)
            })

            const nextBtn = window.document.createElement('button')
            nextBtn.textContent = '>'
            nextBtn.addEventListener('click', () => {
                const selectedPage = parseInt(this.pagesControl.querySelector('[selected]').textContent)
                this.updateItemsFromPage(selectedPage + 1)
            })
            this.pagesControl.appendChild(nextBtn)
        }

        const buttons = Array.from(this.pagesControl.children)
        buttons.forEach((btn, index) => {
            if (parseInt(btn.textContent) === page) {
                btn.setAttribute('selected', true)
            } else {
                btn.removeAttribute('selected')
            }
            if (index === 0) {
                if (page === 1) {
                    btn.setAttribute('disabled', '')
                } else {
                    btn.removeAttribute('disabled')
                }
            }
            if (index === buttons.length - 1) {
                if (page === this.pages.length) {
                    btn.setAttribute('disabled', '')
                } else {
                    btn.removeAttribute('disabled')
                }
            }
        })
        let start = (page - 1) * this.resourcesGrid.pageSize
        let end = page * this.resourcesGrid.pageSize

        this.resourcesGrid.items = this.resources.slice(start, end)
    }

    async showWebsites() {
        await this.getArbitraryResources()
        await this.getResourcesGrid()
        await this.updateItemsFromPage(1, true)
    }

    doSearch(e) {
        this.searchResult()
    }

    getFollowedWebsites = async () => {
	let data = [];
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
        const namesUrl = `${nodeUrl}/lists/followedNames?apiKey=${this.getApiKey()}`;
        const jsonUrl = `${nodeUrl}/arbitrary/resources?service=WEBSITE&default=true&limit=0&reverse=false&includestatus=true`;

	const jsonRes = await fetch(jsonUrl);
	const jsonData = await jsonRes.json();
	const response = await fetch(namesUrl);
	const names = await response.json();

	let webres = jsonData.filter((elm) => names.includes(elm.name));

        this.webResources = webres;
    }

    renderWebAvatar(webObj) {
        let name = webObj.name
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/arbitrary/THUMBNAIL/${name}/qortal_avatar?async=true&apiKey=${this.getApiKey()}`;
        return html`<img src="${url}" onerror="this.onerror=null; this.src='/img/incognito.png';">`
    }

    renderWebName(webObj) {
        let name = webObj.name
        return html`<a class="visitSite" href="browser/index.html?name=${name}&service=${this.service}">${name}</a>`
    }

    renderWebStatus(webObj) {
        return html`<span title="${webObj.status.description}">${webObj.status.title}</span>`
    }

    renderWebSize(webObj) {
        if (webObj.size === null) {
            return html``
        }
        let sizeWebReadable = this.bytesToSize(webObj.size);
        return html`<span>${sizeWebReadable}</span>`
    }

    renderWebFollowUnfollowButton(webObj) {
        let name = webObj.name
        if (this.webFollowedNames == null || !Array.isArray(this.webFollowedNames)) {
            return html``
        }
        if (this.webFollowedNames.indexOf(name) === -1) {
            return html`<mwc-button @click=${() => this.webFollowName(webObj)}><mwc-icon>add_to_queue</mwc-icon>&nbsp;Follow</mwc-button>`
        }
        else {
            return html`<mwc-button @click=${() => this.webUnfollowName(webObj)}><mwc-icon>remove_from_queue</mwc-icon>&nbsp;Unfollow</mwc-button>`
        }
    }

    async webFollowName(webObj) {
        let name = webObj.name
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
            this.webFollowedNames = this.webFollowedNames.filter(item => item != name);
            this.webFollowedNames.push(name)
        }
        else {
            parentEpml.request('showSnackBar', 'Error occurred when trying to follow this registered name. Please try again')
        }
        return ret
    }

    async webUnfollowName(webObj) {
        let name = webObj.name
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
            this.webFollowedNames = this.webFollowedNames.filter(item => item != name);
        }
        else {
            parentEpml.request('showSnackBar', 'Error occurred when trying to unfollow this registered name. Please try again')
        }
        return ret
    }

    renderWebBlockUnblockButton(webObj) {
        let name = webObj.name
        if (this.webBlockedNames == null || !Array.isArray(this.webBlockedNames)) {
            return html``
        }
        if (this.webBlockedNames.indexOf(name) === -1) {
            return html`<mwc-button @click=${() => this.webBlockName(webObj)}><mwc-icon>block</mwc-icon>&nbsp;Block</mwc-button>`
        }
        else {
            return html`<mwc-button @click=${() => this.webUnblockName(webObj)}><mwc-icon>radio_button_unchecked</mwc-icon>&nbsp;Unblock</mwc-button>`
        }
    }

    async webBlockName(webObj) {
        let name = webObj.name
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
            this.webBlockedNames = this.webBlockedNames.filter(item => item != name);
            this.webBlockedNames.push(name)
        }
        else {
            parentEpml.request('showSnackBar', 'Error occurred when trying to block this registered name. Please try again')
        }
        return ret
    }

    async webUnblockName(webObj) {
        let name = webObj.name
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
            this.webBlockedNames = this.webBlockedNames.filter(item => item != name);
        }
        else {
            parentEpml.request('showSnackBar', 'Error occurred when trying to unblock this registered name. Please try again')
        }
        return ret
    }

    getBlockedWebsites = async () => {
	let data = [];
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
        const blockedNamesUrl = `${nodeUrl}/lists/blockedNames?apiKey=${this.getApiKey()}`;
        const blockedJsonUrl = `${nodeUrl}/arbitrary/resources?service=WEBSITE&default=true&limit=0&reverse=false&includestatus=true`;

	const blockedJsonRes = await fetch(blockedJsonUrl);
	const blockedJsonData = await blockedJsonRes.json();
	const blockedResponse = await fetch(blockedNamesUrl);
	const blockednames = await blockedResponse.json();

	let blockedres = blockedJsonData.filter((elm) => blockednames.includes(elm.name));

        this.blockResources = blockedres;
    }

    renderBlockAvatar(blockObj) {
        let name = blockObj.name
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/arbitrary/THUMBNAIL/${name}/qortal_avatar?async=true&apiKey=${this.getApiKey()}`;
        return html`<img src="${url}" onerror="this.onerror=null; this.src='/img/incognito.png';">`
    }

    renderBlockName(blockObj) {
        let name = blockObj.name
        return html`<a class="visitSite" href="browser/index.html?name=${name}&service=${this.service}">${name}</a>`
    }

    renderBlockStatus(blockObj) {
        return html`<span title="${blockObj.status.description}">${blockObj.status.title}</span>`
    }

    renderBlockSize(blockObj) {
        if (blockObj.size === null) {
            return html``
        }
        let sizeBlockReadable = this.bytesToSize(blockObj.size);
        return html`<span>${sizeBlockReadable}</span>`
    }

    renderBlockFollowUnfollowButton(blockObj) {
        let name = blockObj.name
        if (this.blockFollowedNames == null || !Array.isArray(this.blockFollowedNames)) {
            return html``
        }
        if (this.blockFollowedNames.indexOf(name) === -1) {
            return html`<mwc-button @click=${() => this.blockFollowName(blockObj)}><mwc-icon>add_to_queue</mwc-icon>&nbsp;Follow</mwc-button>`
        }
        else {
            return html`<mwc-button @click=${() => this.blockUnfollowName(blockObj)}><mwc-icon>remove_from_queue</mwc-icon>&nbsp;Unfollow</mwc-button>`
        }
    }

    async blockFollowName(blockObj) {
        let name = blockObj.name
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
            this.blockFollowedNames = this.blockFollowedNames.filter(item => item != name);
            this.blockFollowedNames.push(name)
        }
        else {
            parentEpml.request('showSnackBar', 'Error occurred when trying to follow this registered name. Please try again')
        }
        return ret
    }

    async blockUnfollowName(blockObj) {
        let name = blockObj.name
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
            this.blockFollowedNames = this.blockFollowedNames.filter(item => item != name);
        }
        else {
            parentEpml.request('showSnackBar', 'Error occurred when trying to unfollow this registered name. Please try again')
        }
        return ret
    }

    renderBlockBlockUnblockButton(blockObj) {
        let name = blockObj.name
        if (this.blockBlockedNames == null || !Array.isArray(this.blockBlockedNames)) {
            return html``
        }
        if (this.blockBlockedNames.indexOf(name) === -1) {
            return html`<mwc-button @click=${() => this.blockBlockName(blockObj)}><mwc-icon>block</mwc-icon>&nbsp;Block</mwc-button>`
        }
        else {
            return html`<mwc-button @click=${() => this.blockUnblockName(blockObj)}><mwc-icon>radio_button_unchecked</mwc-icon>&nbsp;Unblock</mwc-button>`
        }
    }

    async blockBlockName(blockObj) {
        let name = blockObj.name
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
            this.blockBlockedNames = this.blockBlockedNames.filter(item => item != name);
            this.blockBlockedNames.push(name)
        }
        else {
            parentEpml.request('showSnackBar', 'Error occurred when trying to block this registered name. Please try again')
        }
        return ret
    }

    async blockUnblockName(blockObj) {
        let name = blockObj.name
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
            this.blockBlockedNames = this.blockBlockedNames.filter(item => item != name);
        }
        else {
            parentEpml.request('showSnackBar', 'Error occurred when trying to unblock this registered name. Please try again')
        }
        return ret
    }

    async searchResult() {
        let searchName = this.shadowRoot.getElementById('searchName').value
        if (searchName.length === 0) {
            parentEpml.request('showSnackBar', 'Name Can Not Be Empty!')
        } else {
            let searchResources = await parentEpml.request('apiCall', {
                url: `/arbitrary/resources/search?service=${this.service}&query=${searchName}&default=true&limit=5&reverse=false&includestatus=true`
            })
            if (this.isEmptyArray(searchResources)) {
                parentEpml.request('showSnackBar', 'Name Not Found!')
            } else {
                this.searchResources = searchResources
            }
        }
    }

    renderSearchAvatar(searchObj) {
        let name = searchObj.name
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/arbitrary/THUMBNAIL/${name}/qortal_avatar?async=true&apiKey=${this.getApiKey()}`;
        return html`<img src="${url}" onerror="this.onerror=null; this.src='/img/incognito.png';">`
    }

    renderSearchName(searchObj) {
        let name = searchObj.name
        return html`<a class="visitSite" href="browser/index.html?name=${name}&service=${this.service}">${name}</a>`
    }

    renderSearchStatus(searchObj) {
        return html`<span title="${searchObj.status.description}">${searchObj.status.title}</span>`
    }

    renderSearchSize(searchObj) {
        if (searchObj.size === null) {
            return html``
        }
        let sizeSearchReadable = this.bytesToSize(searchObj.size);
        return html`<span>${sizeSearchReadable}</span>`
    }

    renderSearchFollowUnfollowButton(searchObj) {
        let name = searchObj.name
        if (this.searchFollowedNames == null || !Array.isArray(this.searchFollowedNames)) {
            return html``
        }
        if (this.searchFollowedNames.indexOf(name) === -1) {
            return html`<mwc-button @click=${() => this.searchFollowName(searchObj)}><mwc-icon>add_to_queue</mwc-icon>&nbsp;Follow</mwc-button>`
        }
        else {
            return html`<mwc-button @click=${() => this.searchUnfollowName(searchObj)}><mwc-icon>remove_from_queue</mwc-icon>&nbsp;Unfollow</mwc-button>`
        }
    }

    async searchFollowName(searchObj) {
        let name = searchObj.name
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
            this.searchFollowedNames = this.searchFollowedNames.filter(item => item != name);
            this.searchFollowedNames.push(name)
        }
        else {
            parentEpml.request('showSnackBar', 'Error occurred when trying to follow this registered name. Please try again')
        }
        return ret
    }

    async searchUnfollowName(searchObj) {
        let name = searchObj.name
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
            this.searchFollowedNames = this.searchFollowedNames.filter(item => item != name);
        }
        else {
            parentEpml.request('showSnackBar', 'Error occurred when trying to unfollow this registered name. Please try again')
        }
        return ret
    }

    renderSearchBlockUnblockButton(searchObj) {
        let name = searchObj.name
        if (this.searchBlockedNames == null || !Array.isArray(this.searchBlockedNames)) {
            return html``
        }
        if (this.searchBlockedNames.indexOf(name) === -1) {
            return html`<mwc-button @click=${() => this.searchBlockName(searchObj)}><mwc-icon>block</mwc-icon>&nbsp;Block</mwc-button>`
        }
        else {
            return html`<mwc-button @click=${() => this.searchUnblockName(searchObj)}><mwc-icon>radio_button_unchecked</mwc-icon>&nbsp;Unblock</mwc-button>`
        }
    }

    async searchBlockName(searchObj) {
        let name = searchObj.name
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
            this.searchBlockedNames = this.searchBlockedNames.filter(item => item != name);
            this.searchBlockedNames.push(name)
        }
        else {
            parentEpml.request('showSnackBar', 'Error occurred when trying to block this registered name. Please try again')
        }
        return ret
    }

    async searchUnblockName(searchObj) {
        let name = searchObj.name
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
            this.searchBlockedNames = this.searchBlockedNames.filter(item => item != name);
        }
        else {
            parentEpml.request('showSnackBar', 'Error occurred when trying to unblock this registered name. Please try again')
        }
        return ret
    }

    renderAvatar(websiteObj) {
        let name = websiteObj.name
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/arbitrary/THUMBNAIL/${name}/qortal_avatar?async=true&apiKey=${this.getApiKey()}`;
        return html`<img src="${url}" onerror="this.src='/img/incognito.png';">`
    }

    renderRelayModeText() {
        if (this.relayMode === true) {
            return html`<div class="relay-mode-notice">Relay mode is enabled. This means that your node will help to transport encrypted data around the network when a peer requests it. You can opt out by setting <strong>"relayModeEnabled": false</strong> in settings.json</div>`;
        }
        else if (this.relayMode === false) {
            return html`<div class="relay-mode-notice">Relay mode is disabled. You can enable it by setting <strong>"relayModeEnabled": true</strong> in settings.json</div>`;
        }
        return html``;
    }

    renderPublishButton() {
        // Only show the publish button if we have admin permissions on this node
        // We can check the followed names array to achieve this
        if (this.followedNames == null || !Array.isArray(this.followedNames)) {
            return html``
        }
        return html`<mwc-button style="float:right;" @click=${() => this.publishWebsite()}><mwc-icon>add</mwc-icon>Publish Website</mwc-button>`
    }

    publishWebsite() {
        window.location.href = `publish/index.html?service=${this.service}&identifier=${this.identifier}&uploadType=zip&category=Website&showName=true&showService=false&showIdentifier=false`
    }

    async followName(websiteObj) {
        let name = websiteObj.name
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
            // Successfully followed - add to local list
            // Remove it first by filtering the list - doing it this way ensures the UI updates
            // immediately, as apposed to only adding if it doesn't already exist
            this.followedNames = this.followedNames.filter(item => item != name);
            this.followedNames.push(name)
        }
        else {
            parentEpml.request('showSnackBar', 'Error occurred when trying to follow this registered name. Please try again')
        }

        return ret
    }

    async unfollowName(websiteObj) {
        let name = websiteObj.name
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
            // Successfully unfollowed - remove from local list
            this.followedNames = this.followedNames.filter(item => item != name);
        }
        else {
            parentEpml.request('showSnackBar', 'Error occurred when trying to unfollow this registered name. Please try again')
        }

        return ret
    }

    async blockName(websiteObj) {
        let name = websiteObj.name
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
            // Successfully blocked - add to local list
            // Remove it first by filtering the list - doing it this way ensures the UI updates
            // immediately, as apposed to only adding if it doesn't already exist
            this.blockedNames = this.blockedNames.filter(item => item != name);
            this.blockedNames.push(name)
        }
        else {
            parentEpml.request('showSnackBar', 'Error occurred when trying to block this registered name. Please try again')
        }

        return ret
    }

    async unblockName(websiteObj) {
        let name = websiteObj.name
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
            // Successfully unblocked - remove from local list
            this.blockedNames = this.blockedNames.filter(item => item != name);
        }
        else {
            parentEpml.request('showSnackBar', 'Error occurred when trying to unblock this registered name. Please try again')
        }

        return ret
    }

    renderRole(groupObj) {
        if (groupObj.owner === this.selectedAddress.address) {
            return "Owner"
        } else if (groupObj.isAdmin === true) {
            return "Admin"
        } else {
            return "Member"
        }
    }

    renderName(websiteObj) {
        let name = websiteObj.name
        return html`<a class="visitSite" href="browser/index.html?name=${name}&service=${this.service}">${name}</a>`
    }

    renderStatus(websiteObj) {
        return html`<span title="${websiteObj.status.description}">${websiteObj.status.title}</span>`
    }

    renderSize(websiteObj) {
        if (websiteObj.size === null) {
            return html``
        }
        let sizeReadable = this.bytesToSize(websiteObj.size);
        return html`<span>${sizeReadable}</span>`
    }

    renderFollowUnfollowButton(websiteObj) {
        let name = websiteObj.name

        // Only show the follow/unfollow button if we have permission to modify the list on this node
        if (this.followedNames == null || !Array.isArray(this.followedNames)) {
            return html``
        }

        if (this.followedNames.indexOf(name) === -1) {
            // render follow button
            return html`<mwc-button @click=${() => this.followName(websiteObj)}><mwc-icon>add_to_queue</mwc-icon>&nbsp;Follow</mwc-button>`
        }
        else {
            // render unfollow button
            return html`<mwc-button @click=${() => this.unfollowName(websiteObj)}><mwc-icon>remove_from_queue</mwc-icon>&nbsp;Unfollow</mwc-button>`
        }
    }

    renderBlockUnblockButton(websiteObj) {
        let name = websiteObj.name

        // Only show the block/unblock button if we have permission to modify the list on this node
        if (this.blockedNames == null || !Array.isArray(this.blockedNames)) {
            return html``
        }

        if (this.blockedNames.indexOf(name) === -1) {
            // render block button
            return html`<mwc-button @click=${() => this.blockName(websiteObj)}><mwc-icon>block</mwc-icon>&nbsp;Block</mwc-button>`
        }
        else {
            // render unblock button
            return html`<mwc-button @click=${() => this.unblockName(websiteObj)}><mwc-icon>radio_button_unchecked</mwc-icon>&nbsp;Unblock</mwc-button>`
        }
    }

    bytesToSize(bytes) {
        var sizes = ['bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 bytes';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    _textMenu(event) {

        const getSelectedText = () => {
            var text = "";
            if (typeof window.getSelection != "undefined") {
                text = window.getSelection().toString();
            } else if (typeof this.shadowRoot.selection != "undefined" && this.shadowRoot.selection.type == "Text") {
                text = this.shadowRoot.selection.createRange().text;
            }
            return text;
        }

        const checkSelectedTextAndShowMenu = () => {
            let selectedText = getSelectedText();
            if (selectedText && typeof selectedText === 'string') {
                let _eve = { pageX: event.pageX, pageY: event.pageY, clientX: event.clientX, clientY: event.clientY }
                let textMenuObject = { selectedText: selectedText, eventObject: _eve, isFrame: true }
                parentEpml.request('openCopyTextMenu', textMenuObject)
            }
        }
        checkSelectedTextAndShowMenu()
    }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
        let apiKey = myNode.apiKey;
        return apiKey;
    }

    clearSelection() {
        window.getSelection().removeAllRanges()
        window.parent.getSelection().removeAllRanges()
    }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }
}

window.customElements.define('websites-list', Websites)
