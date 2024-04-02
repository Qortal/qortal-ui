import {css, html, LitElement} from 'lit'
import {render} from 'lit/html.js'
import {Epml} from '../../../epml.js'
import isElectron from 'is-electron'
import {get, registerTranslateConfig, translate, use} from '../../../../core/translate'
import '@material/mwc-dialog'
import '@material/mwc-icon'
import '@material/mwc-button'
import '@material/mwc-tab-bar'
import '@material/mwc-textfield'

import '@vaadin/button'
import '@vaadin/grid'
import '@vaadin/icon'
import '@vaadin/icons'
import '@vaadin/text-field'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class Websites extends LitElement {
    static get properties() {
        return {
            service: { type: String },
            identifier: { type: String },
            loading: { type: Boolean },
            resources: { type: Array },
            pageRes: { type: Array },
            followedNames: { type: Array },
            blockedNames: { type: Array },
            relayMode: { type: Boolean },
            selectedAddress: { type: Object },
            searchName: { type: String },
            searchResources: { type: Array },
            followedResources: { type: Array },
            blockedResources: { type: Array },
            theme: { type: String, reflect: true }
        }
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --mdc-button-disabled-fill-color: rgba(3, 169, 244, 0.5);
                --mdc-theme-surface: var(--white);
                --mdc-text-field-outlined-idle-border-color: var(--txtfieldborder);
                --mdc-text-field-outlined-hover-border-color: var(--txtfieldhoverborder);
                --mdc-text-field-label-ink-color: var(--black);
                --mdc-text-field-ink-color: var(--black);
                --mdc-dialog-content-ink-color: var(--black);
                --mdc-dialog-shape-radius: 25px;
                --mdc-dialog-min-width: 300px;
                --mdc-dialog-max-width: auto;
                --mdc-dialog-max-height: 700px;
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
                color: var(--black);
            }

            #pages > button:not([disabled]):hover,
            #pages > button:focus {
                color: #ccc;
                background-color: #eee;
            }

            #pages > button[selected] {
                font-weight: bold;
                color: var(--white);
                background-color: #ccc;
            }

            #pages > button[disabled] {
                opacity: 0.5;
                cursor: default;
            }

            #websites-list-page {
                background: var(--white);
                padding: 12px 24px;
            }

            #search {
               display: flex;
               width: 50%;
               align-items: center;
            }

            .divCard {
                border: 1px solid var(--border);
                padding: 1em;
                box-shadow: 0 .3px 1px 0 rgba(0,0,0,0.14), 0 1px 1px -1px rgba(0,0,0,0.12), 0 1px 2px 0 rgba(0,0,0,0.20);
                margin-bottom: 2em;
            }

            h2 {
                margin:0;
            }

            h2, h3, h4, h5 {
                color: var(--black);
                font-weight: 400;
            }

            a.visitSite {
                color: var(--black);
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

            .resourceTitle {
                font-size:15px;
                line-height: 32px;
            }

            .resourceDescription {
                font-size:11px;
                padding-bottom: 5px;
            }

            .resourceCategoryTags {
                font-size:11px;
                padding-bottom: 10px;
            }

            .resourceRegisteredName {
                font-size:15px;
                line-height: 32px;
            }

            .resourceStatus, .resourceStatus span {
                font-size:11px;
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
                color: var(--relaynodetxt);
            }

            img {
                border-radius: 25%;
                max-width: 65px;
                height: 100%;
                max-height: 65px;
            }
        `
    }

    constructor() {
        super()
        this.service = "WEBSITE"
        this.identifier = null
        this.selectedAddress = {}
        this.resources = []
        this.pageRes = []
        this.followedNames = []
        this.blockedNames = []
        this.relayMode = null
        this.isLoading = false
        this.searchName = ''
        this.searchResources = []
        this.followedResources = []
        this.blockedResources = []
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    render() {
        return html`
            <div id="websites-list-page">
                <mwc-tab-bar id="tabs-1" activeIndex="0">
                    <mwc-tab label="${translate("websitespage.schange1")}" icon="travel_explore" @click="${(e) => this.displayTabContent('browse')}"></mwc-tab>
                    <mwc-tab label="${translate("websitespage.schange2")}" icon="desktop_windows" @click="${(e) => this.displayTabContent('followed')}"></mwc-tab>
                    <mwc-tab label="${translate("websitespage.schange3")}" icon="block" @click="${(e) => this.displayTabContent('blocked')}"></mwc-tab>
                </mwc-tab-bar>
                <div id="tabs-1-content">
                    <div id="tab-browse-content">
	                <div style="min-height:48px; display: flex; padding-bottom: 6px; margin: 2px;">
        	                <h2 style="margin: 0; padding-top: .5em; display: inline;">${translate("websitespage.schange1")}</h2>
                	        <h2 style="margin: 0; flex: 6; padding-top: .5em; display: inline;">${this.renderSearchButton()}</h2>
                	        <h2 style="margin: 0;  padding-top: .5em; display: inline;">${this.renderPublishButton()}</h2>
	                </div>
	                      <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">${translate("websitespage.schange9")}</h3>
	                      <vaadin-grid theme="wrap-cell-content" id="resourcesGrid" ?hidden="${this.isEmptyArray(this.pageRes)}" .items="${this.pageRes}" aria-label="Websites" all-rows-visible>
	                          <vaadin-grid-column width="7rem" flex-grow="0" header="${translate("websitespage.schange5")}" .renderer=${(root, column, data) => {
	                              render(html`${this.renderAvatar(data.item)}`, root)
	                          }}>
	                          </vaadin-grid-column>
	                          <vaadin-grid-column header="${translate("websitespage.schange6")}" .renderer=${(root, column, data) => {
	                              render(html`${this.renderInfo(data.item)}`, root)
	                          }}>
	                          </vaadin-grid-column>
                                  <vaadin-grid-column width="12rem" flex-grow="0" header="${translate("websitespage.schange7")}" .renderer=${(root, column, data) => {
	                              render(html`${this.renderPublishedBy(data.item)}`, root)
	                          }}>
                                </vaadin-grid-column>
	                          <vaadin-grid-column width="11rem" flex-grow="0" header="${translate("websitespage.schange8")}" .renderer=${(root, column, data) => {
	                              render(html`${this.renderFollowUnfollowButton(data.item)}`, root);
	                          }}>
	                          </vaadin-grid-column>
	                          <vaadin-grid-column width="11rem" flex-grow="0" header="" .renderer=${(root, column, data) => {
	                              render(html`${this.renderBlockUnblockButton(data.item)}`, root);
	                          }}>
	                          </vaadin-grid-column>
	                      </vaadin-grid>
	                      <div id="pages"></div>
                            ${this.pageRes == null ? html`
	                          Loading...
	                      ` : ''}
	                      ${this.isEmptyArray(this.pageRes) ? html`
	                          <span style="color: var(--black);">${translate("websitespage.schange10")}</span>
	                      ` : ''}
	                  ${this.renderRelayModeText()}
	              </div>
                    <div id="tab-followed-content">
	                  <div style="min-height:48px; display: flex; padding-bottom: 6px; margin: 2px;">
                                <h2 style="margin: 0; padding-top: .5em; display: inline;">${translate("websitespage.schange11")}</h2>
                	        <h2 style="margin: 0; flex: 6; padding-top: .5em; display: inline;">${this.renderSearchButton()}</h2>
              	                <h2 style="margin: 0; padding-top: .5em; display: inline;">${this.renderPublishButton()}</h2>
	                  </div>
	                  <div class="divCard">
	                      <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">${translate("websitespage.schange12")}</h3>
	                      <vaadin-grid theme="wrap-cell-content" id="followedResourcesGrid" ?hidden="${this.isEmptyArray(this.followedResources)}" .items="${this.followedResources}" aria-label="Followed Websites" all-rows-visible>
                                <vaadin-grid-column width="7rem" flex-grow="0" header="${translate("websitespage.schange5")}" .renderer=${(root, column, data) => {
                                    render(html`${this.renderAvatar(data.item)}`, root)
                                }}>
                                </vaadin-grid-column>
                                <vaadin-grid-column header="${translate("websitespage.schange6")}" .renderer=${(root, column, data) => {
                                    render(html`${this.renderInfo(data.item)}`, root)
                                }}>
                                </vaadin-grid-column>
                                <vaadin-grid-column width="12rem" flex-grow="0" header="${translate("websitespage.schange7")}" .renderer=${(root, column, data) => {
                                    render(html`${this.renderPublishedBy(data.item)}`, root)
                                }}>
                                </vaadin-grid-column>
                                <vaadin-grid-column width="11rem" flex-grow="0" header="${translate("websitespage.schange8")}" .renderer=${(root, column, data) => {
                                    render(html`${this.renderFollowUnfollowButtonTab(data.item)}`, root);
                                }}>
                                </vaadin-grid-column>
	                      </vaadin-grid>
                            ${this.followedResources == null ? html`
	                          Loading...
	                      ` : ''}
	                      ${this.isEmptyArray(this.followedResources) ? html`
	                          <span style="color: var(--black);">${translate("websitespage.schange13")}</span>
	                      ` : ''}
	                  ${this.renderRelayModeText()}
	              </div>
                    <div id="tab-blocked-content">
	                  <div style="min-height:48px; display: flex; padding-bottom: 6px; margin: 2px;">
        	                <h2 style="margin: 0; padding-top: .5em; display: inline;">${translate("websitespage.schange14")}</h2>
                	        <h2 style="margin: 0; flex: 6; padding-top: .5em; display: inline;">${this.renderSearchButton()}</h2>
                	        <h2 style="margin: 0; padding-top: .5em; display: inline;">${this.renderPublishButton()}</h2>
	                  </div>
	                      <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">${translate("websitespage.schange15")}</h3>
	                      <vaadin-grid theme="wrap-cell-content" id="blockedResourcesGrid" ?hidden="${this.isEmptyArray(this.blockedResources)}" .items="${this.blockedResources}" aria-label="Blocked Websites" all-rows-visible>
                                <vaadin-grid-column width="7rem" flex-grow="0" header="${translate("websitespage.schange5")}" .renderer=${(root, column, data) => {
                                    render(html`${this.renderAvatar(data.item)}`, root)
                                }}>
                                </vaadin-grid-column>
                                <vaadin-grid-column header="${translate("websitespage.schange6")}" .renderer=${(root, column, data) => {
                                    render(html`${this.renderInfo(data.item)}`, root)
                                }}>
                                </vaadin-grid-column>
                                <vaadin-grid-column width="12rem" flex-grow="0" header="${translate("websitespage.schange7")}" .renderer=${(root, column, data) => {
                                    render(html`${this.renderPublishedBy(data.item)}`, root)
                                }}>
                                </vaadin-grid-column>
                                <vaadin-grid-column width="11rem" flex-grow="0" header="" .renderer=${(root, column, data) => {
                                    render(html`${this.renderBlockUnblockButtonTab(data.item)}`, root);
                                }}>
                                </vaadin-grid-column>
	                      </vaadin-grid>
                            ${this.blockedResources == null ? html`
	                          Loading...
	                      ` : ''}
	                      ${this.isEmptyArray(this.blockedResources) ? html`
	                          <span style="color: var(--black);">${translate("websitespage.schange16")}</span>
	                      ` : ''}
	                  ${this.renderRelayModeText()}
	              </div>
	          </div>
	      </div>
            <mwc-dialog id="searchWebsiteDialog">
                <h3 style="margin: 0; margin-bottom: 1em; text-align: left;">${translate("websitespage.schange4")}</h3>
	        <div id="search">
	            <vaadin-text-field theme="medium" id="searchName" placeholder="${translate("websitespage.schange33")}" value="${this.searchName}" @keydown="${this.searchListener}" clear-button-visible>
                        <vaadin-icon slot="prefix" icon="vaadin:user"></vaadin-icon>
	            </vaadin-text-field>&nbsp;&nbsp;<br>
	            <vaadin-button theme="medium" @click="${(e) => this.doSearch(e)}">
	                <vaadin-icon icon="vaadin:search" slot="prefix"></vaadin-icon>
	                ${translate("websitespage.schange35")}
                    </vaadin-button>
	        </div><br />
	        <vaadin-grid theme="wrap-cell-content" id="searchResourcesGrid" ?hidden="${this.isEmptyArray(this.searchResources)}" .items="${this.searchResources}" aria-label="Search Websites" all-rows-visible>
	            <vaadin-grid-column width="7rem" flex-grow="0" header="${translate("websitespage.schange5")}" .renderer=${(root, column, data) => {
                        render(html`${this.renderAvatar(data.item)}`, root)
                    }}>
	            </vaadin-grid-column>
                    <vaadin-grid-column width="12rem" flex-grow="0" header="${translate("websitespage.schange7")}" .renderer=${(root, column, data) => {
	                render(html`${this.renderPublishedBy(data.item)}`, root)
                    }}>
                    </vaadin-grid-column>
	            <vaadin-grid-column width="11rem" flex-grow="0" header="${translate("websitespage.schange8")}" .renderer=${(root, column, data) => {
	                render(html`${this.renderFollowUnfollowButton(data.item)}`, root);
	            }}>
	            </vaadin-grid-column>
                    <vaadin-grid-column width="11rem" flex-grow="0" header="" .renderer=${(root, column, data) => {
	               render(html`${this.renderBlockUnblockButton(data.item)}`, root);
	            }}>
	            </vaadin-grid-column>
	        </vaadin-grid>
            </mwc-dialog>
        `
    }

    firstUpdated() {
        this.changeTheme()
        this.changeLanguage()
        this.showWebsites()

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
                    setTimeout(this.getFollowedNamesResource, 1)
                    setTimeout(this.getBlockedNamesResource, 1)
                    setInterval(this.getArbitraryResources, 900000)
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

    renderCatText() {
        return html`${translate("websitespage.schange26")}`
    }

    displayTabContent(tab) {
        const tabBrowseContent = this.shadowRoot.getElementById('tab-browse-content')
        const tabFollowedContent = this.shadowRoot.getElementById('tab-followed-content')
        const tabBlockedContent = this.shadowRoot.getElementById('tab-blocked-content')
        if (tab === 'browse') {
            this.refreshWebsites()
            tabBrowseContent.style.display = 'block'
            tabFollowedContent.style.display = 'none'
            tabBlockedContent.style.display = 'none'
        } else if (tab === 'followed') {
            this.getFollowedNamesRefresh()
            this.getFollowedNamesResource()
            tabBrowseContent.style.display = 'none'
            tabFollowedContent.style.display = 'block'
            tabBlockedContent.style.display = 'none'
        } else if (tab === 'blocked') {
            this.getBlockedNamesRefresh()
            this.getBlockedNamesResource()
            tabBrowseContent.style.display = 'none'
            tabFollowedContent.style.display = 'none'
            tabBlockedContent.style.display = 'block'
        } else {
        }
    }

    searchListener(e) {
        if (e.key === 'Enter') {
            this.doSearch(e)
        }
    }

    async getResourcesGrid() {
        this.resourcesGrid = this.shadowRoot.querySelector(`#resourcesGrid`)
        this.pagesControl = this.shadowRoot.querySelector('#pages')
        this.pages = undefined
    }

    getArbitraryResources = async () => {
		this.resources = await parentEpml.request('apiCall', {
			url: `/arbitrary/resources?service=${this.service}&default=true&limit=0&reverse=false&includestatus=false&includemetadata=false&excludeblocked=true`
		})
    }

    getFollowedNamesResource = async () => {
		this.followedResources = await parentEpml.request('apiCall', {
			url: `/arbitrary/resources?service=${this.service}&default=true&limit=0&reverse=false&includestatus=true&includemetadata=true&namefilter=followedNames`
		})
    }

    getFollowedNamesRefresh = async () => {
		this.followedNames = await parentEpml.request('apiCall', {
			url: `/lists/followedNames?apiKey=${this.getApiKey()}`
		})
    }

    getBlockedNamesResource = async () => {
		this.blockedResources = await parentEpml.request('apiCall', {
			url: `/arbitrary/resources?service=${this.service}&default=true&limit=0&reverse=false&includestatus=true&includemetadata=true&namefilter=blockedNames`
		})
    }

    getBlockedNamesRefresh = async () => {
		this.blockedNames = await parentEpml.request('apiCall', {
			url: `/lists/blockedNames?apiKey=${this.getApiKey()}`
		})
    }

    async getData(offset) {
      const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
      const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
      let jsonOffsetUrl = `${nodeUrl}/arbitrary/resources?service=WEBSITE&default=true&limit=20&offset=${offset}&reverse=false&includestatus=true&includemetadata=true&excludeblocked=true`

      const jsonOffsetRes = await fetch(jsonOffsetUrl)
		this.pageRes = await jsonOffsetRes.json()
    }

    async updateItemsFromPage(page) {
        if (page === undefined) {
            return
        }

        if (!this.pages) {
            this.pages = Array.apply(null, { length: Math.ceil(this.resources.length / 20) }).map((item, index) => {
                return index + 1
            })

            let offset = 0

            const prevBtn = document.createElement('button')
            prevBtn.textContent = '<'
            prevBtn.addEventListener('click', () => {
                if (parseInt(this.pagesControl.querySelector('[selected]').textContent) > 1) {
                    offset = (parseInt(this.pagesControl.querySelector('[selected]').textContent) - 2) * 20
                } else {
                    offset = 0
                }
                this.getData(offset)
                const selectedPage = parseInt(this.pagesControl.querySelector('[selected]').textContent)
                this.updateItemsFromPage(selectedPage - 1)
            })
            this.pagesControl.appendChild(prevBtn)

            this.pages.forEach((pageNumber) => {
                const pageBtn = document.createElement('button')
                pageBtn.textContent = pageNumber
                let offset = 0
                pageBtn.addEventListener('click', (e) => {
                    if (parseInt(e.target.textContent) > 1) {
                        offset = (parseInt(e.target.textContent) - 1) * 20
                    } else {
                        offset = 0
                    }
                    this.getData(offset)
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
                if (parseInt(this.pagesControl.querySelector('[selected]').textContent) >= 1) {
                    offset = ((parseInt(this.pagesControl.querySelector('[selected]').textContent) + 1) * 20) - 20
                } else {
                    offset = 0
                }
                this.getData(offset)
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
    }

    async showWebsites() {
        await this.getData(0)
        await this.getArbitraryResources()
        await this.getResourcesGrid()
        await this.updateItemsFromPage(1, true)
    }

    async refreshWebsites() {
        await this.getData(0)
        await this.getArbitraryResources()
        await this.updateItemsFromPage(1, true)
    }

    doSearch(e) {
        this.searchResult()
    }

    async searchResult() {
        let searchName = this.shadowRoot.getElementById('searchName').value
        if (searchName.length === 0) {
            let err1string = get("websitespage.schange34")
            parentEpml.request('showSnackBar', `${err1string}`)
        } else {
            let searchResources = await parentEpml.request('apiCall', {
                url: `/arbitrary/resources/search?service=${this.service}&query=${searchName}&default=true&limit=5&reverse=false&includestatus=true&includemetadata=true`
            })
            if (this.isEmptyArray(searchResources)) {
                let err2string = get("websitespage.schange17")
                parentEpml.request('showSnackBar', `${err2string}`)
            } else {
                this.searchResources = searchResources
            }
        }
    }

    renderAvatar(websiteObj) {
        let name = websiteObj.name
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/arbitrary/THUMBNAIL/${name}/qortal_avatar?async=true&apiKey=${this.getApiKey()}`
        return html`<a class="visitSite" href="browser/index.html?name=${name}&service=${this.service}"><img src="${url}" onerror="this.src='/img/incognito.png';"></a>`
    }

    renderRelayModeText() {
        if (this.relayMode === true) {
            return html`<div class="relay-mode-notice">${translate("websitespage.schange18")} <strong>"relayModeEnabled": false</strong> ${translate("websitespage.schange19")} settings.json</div>`
        }
        else if (this.relayMode === false) {
            return html`<div class="relay-mode-notice">${translate("websitespage.schange20")} <strong>"relayModeEnabled": true</strong> ${translate("websitespage.schange19")} settings.json</div>`
        }
        return html``
    }

    renderPublishButton() {
        // Only show the publish button if we have admin permissions on this node
        // We can check the followed names array to achieve this
        if (this.followedNames == null || !Array.isArray(this.followedNames)) {
            return html``
        }
        return html`<mwc-button style="float:right;" @click=${() => this.publishWebsite()}><mwc-icon>add</mwc-icon>${translate("websitespage.schange21")}</mwc-button>`
    }

    renderSearchButton() {
        return html`<mwc-button style="float:right;" @click=${() =>  this.openSearchDialog()}><mwc-icon>search</mwc-icon>${translate("websitespage.schange4")}</mwc-button>`
    }

    openSearchDialog() {
        this.searchResources = []
        this.shadowRoot.getElementById('searchName').value = ''
        this.shadowRoot.getElementById('searchWebsiteDialog').show()
    }

    publishWebsite() {
        window.location.href = `publish/index.html?service=${this.service}&identifier=${this.identifier}&uploadType=zip&category=Website&showName=true&showService=false&showIdentifier=false&showMetadata=true`
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
            this.followedNames = this.followedNames.filter(item => item != name)
            this.followedNames.push(name)
        } else {
            let err3string = get("websitespage.schange22")
            parentEpml.request('showSnackBar', `${err3string}`)
        }
        return ret
    }

    async followNameTab(websiteObj) {
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
            this.followedNames = this.followedNames.filter(item => item != name)
            this.followedNames.push(name)
            await this.getFollowedNamesRefresh()
            await this.getFollowedNamesResource()
        } else {
            let err3string = get("websitespage.schange22")
            parentEpml.request('showSnackBar', `${err3string}`)
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
            this.followedNames = this.followedNames.filter(item => item != name)
        } else {
            let err4string = get("websitespage.schange23")
            parentEpml.request('showSnackBar', `${err4string}`)
        }
        return ret
    }

    async unfollowNameTab(websiteObj) {
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
            this.followedNames = this.followedNames.filter(item => item != name)
            await this.getFollowedNamesRefresh()
            await this.getFollowedNamesResource()
        } else {
            let err4string = get("websitespage.schange23")
            parentEpml.request('showSnackBar', `${err4string}`)
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
            this.blockedNames = this.blockedNames.filter(item => item != name)
            this.blockedNames.push(name)
        } else {
            let err5string = get("websitespage.schange24")
            parentEpml.request('showSnackBar', `${err5string}`)
        }
        return ret
    }

    async blockNameTab(websiteObj) {
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
            this.blockedNames = this.blockedNames.filter(item => item != name)
            this.blockedNames.push(name)
            await this.getBlockedNamesRefresh()
            await this.getBlockedNamesResource()
        } else {
            let err5string = get("websitespage.schange24")
            parentEpml.request('showSnackBar', `${err5string}`)
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
            this.blockedNames = this.blockedNames.filter(item => item != name)
        } else {
            let err6string = get("websitespage.schange25")
            parentEpml.request('showSnackBar', `${err6string}`)
        }
        return ret
    }

    async unblockNameTab(websiteObj) {
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
            this.blockedNames = this.blockedNames.filter(item => item != name)
            await this.getBlockedNamesRefresh()
            await this.getBlockedNamesResource()
        } else {
            let err6string = get("websitespage.schange25")
            parentEpml.request('showSnackBar', `${err6string}`)
        }
        return ret
    }

    renderInfo(websiteObj) {
        let name = websiteObj.name
        let title = name
        let description = ""
        let categoryName = this.renderCatText()
        let tags = ""
        let sizeReadable = ""

        if (websiteObj.metadata != null) {
            title = websiteObj.metadata.title;
            description = websiteObj.metadata.description;
            categoryName = websiteObj.metadata.categoryName;
            if (websiteObj.metadata.tags != null && websiteObj.metadata.tags.length > 0) {
                tags = "Tags: " + websiteObj.metadata.tags.join(", ")
            }
        }

        if (websiteObj.size != null) {
            sizeReadable = this.bytesToSize(websiteObj.size)
        }

        return html`
            <div class="resourceTitle">
                <a class="visitSite" href="browser/index.html?name=${name}&service=${this.service}">${title}</a>
            </div>
            <div class="resourceDescription">${description}</div>
            <div class="resourceCategoryTags">
                ${categoryName}&nbsp;
                ${tags.length > 0 ? " | " : ""}&nbsp;
                ${tags}&nbsp;
                ${sizeReadable.length > 0 ? " | " : ""}&nbsp;
                ${translate("websitespage.schange27")}: ${sizeReadable}
            </div>
        `
    }

    renderPublishedBy(websiteObj) {
        return html`<div class="resourceRegisteredName">${websiteObj.name}</div>
        <div class="resourceStatus">${translate("websitespage.schange28")}: <span title="${websiteObj.status.description}">${websiteObj.status.title}</span></div>`
    }

    renderSize(websiteObj) {
        if (websiteObj.size === null) {
            return html``
        }
        let sizeReadable = this.bytesToSize(websiteObj.size)
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
            return html`<mwc-button @click=${() => this.followName(websiteObj)}><mwc-icon>add_to_queue</mwc-icon>&nbsp;${translate("websitespage.schange29")}</mwc-button>`
        }
        else {
            // render unfollow button
            return html`<mwc-button @click=${() => this.unfollowName(websiteObj)}><mwc-icon>remove_from_queue</mwc-icon>&nbsp;${translate("websitespage.schange30")}</mwc-button>`
        }
    }

    renderFollowUnfollowButtonTab(websiteObj) {
        let name = websiteObj.name

        // Only show the follow/unfollow button if we have permission to modify the list on this node
        if (this.followedNames == null || !Array.isArray(this.followedNames)) {
            return html``
        }

        if (this.followedNames.indexOf(name) === -1) {
            // render follow button
            return html`<mwc-button @click=${() => this.followNameTab(websiteObj)}><mwc-icon>add_to_queue</mwc-icon>&nbsp;${translate("websitespage.schange29")}</mwc-button>`
        }
        else {
            // render unfollow button
            return html`<mwc-button @click=${() => this.unfollowNameTab(websiteObj)}><mwc-icon>remove_from_queue</mwc-icon>&nbsp;${translate("websitespage.schange30")}</mwc-button>`
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
            return html`<mwc-button @click=${() => this.blockName(websiteObj)}><mwc-icon>block</mwc-icon>&nbsp;${translate("websitespage.schange31")}</mwc-button>`
        }
        else {
            // render unblock button
            return html`<mwc-button @click=${() => this.unblockName(websiteObj)}><mwc-icon>radio_button_unchecked</mwc-icon>&nbsp;${translate("websitespage.schange32")}</mwc-button>`
        }
    }

    renderBlockUnblockButtonTab(websiteObj) {
        let name = websiteObj.name

        // Only show the block/unblock button if we have permission to modify the list on this node
        if (this.blockedNames == null || !Array.isArray(this.blockedNames)) {
            return html``
        }

        if (this.blockedNames.indexOf(name) === -1) {
            // render block button
            return html`<mwc-button @click=${() => this.blockNameTab(websiteObj)}><mwc-icon>block</mwc-icon>&nbsp;${translate("websitespage.schange31")}</mwc-button>`
        }
        else {
            // render unblock button
            return html`<mwc-button @click=${() => this.unblockNameTab(websiteObj)}><mwc-icon>radio_button_unchecked</mwc-icon>&nbsp;${translate("websitespage.schange32")}</mwc-button>`
        }
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

window.customElements.define('websites-list', Websites)
