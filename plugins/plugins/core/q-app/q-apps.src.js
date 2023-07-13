import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../epml.js'
import { use, get, translate, translateUnsafeHTML, registerTranslateConfig } from 'lit-translate'
import { columnBodyRenderer, gridRowDetailsRenderer } from '@vaadin/grid/lit.js'
import isElectron from 'is-electron'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

import '@material/mwc-dialog'
import '@material/mwc-icon'
import '@material/mwc-button'
import '@material/mwc-tab-bar'
import '@material/mwc-textfield'
import '@polymer/paper-dialog/paper-dialog.js'
import '@vaadin/button'
import '@vaadin/grid'
import '@vaadin/icon'
import '@vaadin/icons'
import '@vaadin/text-field'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class QApps extends LitElement {
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
            btnDisabled: { type: Boolean },
            selectedAddress: { type: Object },
            searchName: { type: String },
            searchResources: { type: Array },
            followedResources: { type: Array },
            blockedResources: { type: Array },
            textStatus: { type: String },
            textProgress: { type: String },
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

            #apps-list-page {
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
                overflow-y: auto;
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

            .green {
                --mdc-theme-primary: #198754;
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

        `
    }

    constructor() {
        super()
        this.service = "APP"
        this.identifier = null
        this.selectedAddress = {}
        this.resources = []
        this.pageRes = []
        this.followedNames = []
        this.blockedNames = []
        this.relayMode = null
        this.isLoading = false
        this.btnDisabled = false
        this.searchName = ''
        this.searchResources = []
        this.followedResources = []
        this.blockedResources = []
        this.textStatus = ''
        this.textProgress = ''
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
	                      <vaadin-grid theme="wrap-cell-content" id="resourcesGrid" ?hidden="${this.isEmptyArray(this.pageRes)}" .items="${this.pageRes}" aria-label="apps" all-rows-visible>
	                          <vaadin-grid-column width="7rem" flex-grow="0" header="${translate("appspage.schange5")}" .renderer=${(root, column, data) => {
	                              render(html`${this.renderAvatar(data.item)}`, root)
	                          }}>
	                          </vaadin-grid-column>
	                          <vaadin-grid-column header="${translate("appspage.schange6")}" .renderer=${(root, column, data) => {
	                              render(html`${this.renderInfo(data.item)}`, root)
	                          }}>
	                          </vaadin-grid-column>
                               <vaadin-grid-column width="12rem" flex-grow="0" header="${translate("appspage.schange7")}" .renderer=${(root, column, data) => {
	                              render(html`${this.renderPublishedBy(data.item)}`, root)
	                          }}>
	                          </vaadin-grid-column>
                               <vaadin-grid-column width="14rem" flex-grow="0" header="" .renderer=${(root, column, data) => {
                                   render(html`${this.renderDownload(data.item)}`, root)
                               }}>
                               </vaadin-grid-column>
	                          <vaadin-grid-column width="10rem" flex-grow="0" header="${translate("appspage.schange8")}" .renderer=${(root, column, data) => {
	                              render(html`${this.renderFollowUnfollowButton(data.item)}`, root);
	                          }}>
	                          </vaadin-grid-column>
	                          <vaadin-grid-column width="10rem" flex-grow="0" header="" .renderer=${(root, column, data) => {
	                              render(html`${this.renderBlockUnblockButton(data.item)}`, root);
	                          }}>
	                          </vaadin-grid-column>
	                      </vaadin-grid>
	                      <div id="pages"></div>
                            ${this.pageRes == null ? html`
	                          Loading...
	                      ` : ''}
	                      ${this.isEmptyArray(this.pageRes) ? html`
	                          <span style="color: var(--black);">${translate("appspage.schange10")}</span>
	                      ` : ''}
	                  ${this.renderRelayModeText()}<br>
	              </div>
                    <div id="tab-followed-content">
	                  <div style="min-height:48px; display: flex; padding-bottom: 6px; margin: 2px;">
                              <h2 style="margin: 0; padding-top: .5em; display: inline;">${translate("appspage.schange11")}</h2>
                	      <h2 style="margin: 0; flex: 6; padding-top: .5em; display: inline;">${this.renderSearchButton()}</h2>
                	      <h2 style="margin: 0; padding-top: .5em; display: inline;">${this.renderPublishButton()}</h2>
	                  </div>
	                      <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">${translate("appspage.schange12")}</h3>
	                      <vaadin-grid theme="wrap-cell-content" id="followedResourcesGrid" ?hidden="${this.isEmptyArray(this.followedResources)}" .items="${this.followedResources}" aria-label="Followed apps" all-rows-visible>
                                <vaadin-grid-column width="7rem" flex-grow="0" header="${translate("appspage.schange5")}" .renderer=${(root, column, data) => {
                                    render(html`${this.renderAvatar(data.item)}`, root)
                                }}>
                                </vaadin-grid-column>
                                <vaadin-grid-column header="${translate("appspage.schange6")}" .renderer=${(root, column, data) => {
                                    render(html`${this.renderInfo(data.item)}`, root)
                                }}>
                                </vaadin-grid-column>
                                <vaadin-grid-column width="12rem" flex-grow="0" header="${translate("appspage.schange7")}" .renderer=${(root, column, data) => {
                                    render(html`${this.renderPublishedBy(data.item)}`, root)
                                }}>
                                </vaadin-grid-column>
                                <vaadin-grid-column width="14rem" flex-grow="0" header="${translate("appspage.schange8")}" .renderer=${(root, column, data) => {
                                    render(html`${this.renderDownload(data.item)}`, root)
                                }}>
                                </vaadin-grid-column>
                                <vaadin-grid-column width="10rem" flex-grow="0" header="" .renderer=${(root, column, data) => {
                                    render(html`${this.renderFollowUnfollowButtonTab(data.item)}`, root);
                                }}>
                                </vaadin-grid-column>
	                      </vaadin-grid>
                            ${this.followedResources == null ? html`
	                          Loading...
	                      ` : ''}
	                      ${this.isEmptyArray(this.followedResources) ? html`
	                          <span style="color: var(--black);">${translate("appspage.schange13")}</span>
	                      ` : ''}
	                  ${this.renderRelayModeText()}
	              </div>
                    <div id="tab-blocked-content">
	                  <div style="min-height:48px; display: flex; padding-bottom: 6px; margin: 2px;">
        	                <h2 style="margin: 0; padding-top: .5em; display: inline;">${translate("appspage.schange14")}</h2>
                	        <h2 style="margin: 0; flex: 6; padding-top: .5em; display: inline;">${this.renderSearchButton()}</h2>
                	        <h2 style="margin: 0; padding-top: .5em; display: inline;">${this.renderPublishButton()}</h2>
	                  </div>
	                      <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">${translate("appspage.schange15")}</h3>
	                      <vaadin-grid theme="wrap-cell-content" id="blockedResourcesGrid" ?hidden="${this.isEmptyArray(this.blockedResources)}" .items="${this.blockedResources}" aria-label="Blocked apps" all-rows-visible>
                                <vaadin-grid-column width="7rem" flex-grow="0" header="${translate("appspage.schange5")}" .renderer=${(root, column, data) => {
                                    render(html`${this.renderAvatar(data.item)}`, root)
                                }}>
                                </vaadin-grid-column>
                                <vaadin-grid-column header="${translate("appspage.schange6")}" .renderer=${(root, column, data) => {
                                    render(html`${this.renderInfo(data.item)}`, root)
                                }}>
                                </vaadin-grid-column>
                                <vaadin-grid-column width="12rem" flex-grow="0" header="${translate("appspage.schange7")}" .renderer=${(root, column, data) => {
                                    render(html`${this.renderPublishedBy(data.item)}`, root)
                                }}>
                                </vaadin-grid-column>
                                <vaadin-grid-column width="10rem" flex-grow="0" header="${translate("appspage.schange8")}" .renderer=${(root, column, data) => {
                                    render(html`${this.renderBlockUnblockButtonTab(data.item)}`, root);
                                }}>
                                </vaadin-grid-column>
	                      </vaadin-grid>
                            ${this.blockedResources == null ? html`
	                          Loading...
	                      ` : ''}
	                      ${this.isEmptyArray(this.blockedResources) ? html`
	                          <span style="color: var(--black);">${translate("appspage.schange16")}</span>
	                      ` : ''}
	                  ${this.renderRelayModeText()}
	              </div>
	          </div>
	      </div>
            <mwc-dialog id="searchAppDialog">
                <h3 style="margin: 0; margin-bottom: 1em; text-align: left;">${translate("appspage.schange4")}</h3>
	        <div id="search">
                    <vaadin-text-field theme="medium" id="searchName" placeholder="${translate("appspage.schange33")}" value="${this.searchName}" @keydown="${this.searchListener}" clear-button-visible>
                        <vaadin-icon slot="prefix" icon="vaadin:user"></vaadin-icon>
	            </vaadin-text-field>&nbsp;&nbsp;<br>
	            <vaadin-button theme="medium" @click="${(e) => this.doSearch(e)}">
	                <vaadin-icon icon="vaadin:search" slot="prefix"></vaadin-icon>
	                ${translate("appspage.schange35")}
                    </vaadin-button>
	        </div><br />
	        <vaadin-grid theme="wrap-cell-content" id="searchResourcesGrid" ?hidden="${this.isEmptyArray(this.searchResources)}" .items="${this.searchResources}" aria-label="Search apps" all-rows-visible>
	            <vaadin-grid-column width="7rem" flex-grow="0" header="${translate("appspage.schange5")}" .renderer=${(root, column, data) => {
	                render(html`${this.renderAvatar(data.item)}`, root)
                    }}>
	            </vaadin-grid-column>
                    <vaadin-grid-column width="12rem" flex-grow="0" header="${translate("appspage.schange7")}" .renderer=${(root, column, data) => {
	                render(html`${this.renderPublishedBy(data.item)}`, root)
	            }}>
	            </vaadin-grid-column>
                    <vaadin-grid-column width="14rem" flex-grow="0" header="" .renderer=${(root, column, data) => {
                        render(html`${this.renderDownload(data.item)}`, root)
                    }}>
                    </vaadin-grid-column>
	            <vaadin-grid-column width="10rem" flex-grow="0" header="${translate("appspage.schange8")}" .renderer=${(root, column, data) => {
	                render(html`${this.renderFollowUnfollowButton(data.item)}`, root);
	            }}>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="10rem" flex-grow="0" header="" .renderer=${(root, column, data) => {
	                render(html`${this.renderBlockUnblockButton(data.item)}`, root);
	            }}>
	            </vaadin-grid-column>
	        </vaadin-grid>
            </mwc-dialog>
           <paper-dialog id="downloadProgressDialog" class="progress" modal>
               <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
               <h2>${translate("appspage.schange41")}</h2>
               <h3>${this.textProgress}</h3>
           </paper-dialog>
        `
    }

    firstUpdated() {

        this.changeTheme()
        this.changeLanguage()
        this.showapps()

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

        const getRelayMode = async () => {
            let relayMode = await parentEpml.request('apiCall', {
                url: `/arbitrary/relaymode?apiKey=${this.getApiKey()}`
            })

            this.relayMode = relayMode;
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
                    setTimeout(this.getFollowedNamesResource, 1)
                    setTimeout(this.getBlockedNamesResource, 1)
                    setInterval(this.getArbitraryResources, 600000)
                    configLoaded = true
                }
                this.config = JSON.parse(c)
            })
        })
        parentEpml.imReady()
    }

    changeTheme() {
        const checkTheme = localStorage.getItem('qortalTheme')
        if (checkTheme === 'dark') {
            this.theme = 'dark';
        } else {
            this.theme = 'light';
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
        return html`${translate("appspage.schange26")}`
    }

    displayTabContent(tab) {
        const tabBrowseContent = this.shadowRoot.getElementById('tab-browse-content')
        const tabFollowedContent = this.shadowRoot.getElementById('tab-followed-content')
        const tabBlockedContent = this.shadowRoot.getElementById('tab-blocked-content')
        if (tab === 'browse') {
            this.refreshapps()
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
        const resources = await parentEpml.request('apiCall', {
            url: `/arbitrary/resources?service=${this.service}&default=true&limit=0&reverse=false&includestatus=false&includemetadata=false&excludeblocked=true`
        })
        this.resources = resources
    }

    getFollowedNamesResource = async () => {
        const followedRes = await parentEpml.request('apiCall', {
            url: `/arbitrary/resources?service=${this.service}&default=true&limit=0&reverse=false&includestatus=true&includemetadata=true&namefilter=followedNames`
        })
        this.followedResources = followedRes
    }

    getFollowedNamesRefresh = async () => {
        let followedNames = await parentEpml.request('apiCall', {
            url: `/lists/followedNames?apiKey=${this.getApiKey()}`
        })
        this.followedNames = followedNames
    }

    getBlockedNamesResource = async () => {
        const blockedRes = await parentEpml.request('apiCall', {
            url: `/arbitrary/resources?service=${this.service}&default=true&limit=0&reverse=false&includestatus=true&includemetadata=true&namefilter=blockedNames`
        })
        this.blockedResources = blockedRes
    }

    getBlockedNamesRefresh = async () => {
        let blockedNames = await parentEpml.request('apiCall', {
            url: `/lists/blockedNames?apiKey=${this.getApiKey()}`
        })
        this.blockedNames = blockedNames
    }

    async getData(offset) {
      const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
      const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
      let jsonOffsetUrl = `${nodeUrl}/arbitrary/resources?service=APP&default=true&limit=20&offset=${offset}&reverse=false&includestatus=true&includemetadata=true&excludeblocked=true`

      const jsonOffsetRes = await fetch(jsonOffsetUrl)
      const jsonOffsetData = await jsonOffsetRes.json()

      this.pageRes = jsonOffsetData
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
                let offset = 0;
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

    async showapps() {
        await this.getData(0)
        await this.getArbitraryResources()
        await this.getResourcesGrid()
        await this.updateItemsFromPage(1, true)
    }

    async refreshapps() {
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
            let err1string = get("appspage.schange34")
            parentEpml.request('showSnackBar', `${err1string}`)
        } else {
            let searchResources = await parentEpml.request('apiCall', {
                url: `/arbitrary/resources/search?service=${this.service}&query=${searchName}&default=true&limit=5&reverse=false&includestatus=true&includemetadata=true`
            })
            if (this.isEmptyArray(searchResources)) {
                let err2string = get("appspage.schange17")
                parentEpml.request('showSnackBar', `${err2string}`)
            } else {
                this.searchResources = searchResources
            }
        }
    }

    renderAvatar(appObj) {
        let name = appObj.name
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/arbitrary/THUMBNAIL/${name}/qortal_avatar?async=true&apiKey=${this.getApiKey()}`
        return html`<img src="${url}" onerror="this.src='/img/incognito.png';">`
    }

    renderRelayModeText() {
        if (this.relayMode === true) {
            return html`<div class="relay-mode-notice">${translate("appspage.schange18")} <strong>"relayModeEnabled": false</strong> ${translate("appspage.schange19")} settings.json</div>`
        }
        else if (this.relayMode === false) {
            return html`<div class="relay-mode-notice">${translate("appspage.schange20")} <strong>"relayModeEnabled": true</strong> ${translate("appspage.schange19")} settings.json</div>`
        }
        return html``
    }

    renderPublishButton() {
        if (this.followedNames == null || !Array.isArray(this.followedNames)) {
            return html``
        }
        return html`<mwc-button style="float:right;" @click=${() => this.publishApp()}><mwc-icon>add</mwc-icon>${translate("appspage.schange21")}</mwc-button>`
    }

    renderSearchButton() {
        return html`<mwc-button style="float:right;" @click=${() =>  this.openSearchDialog()}><mwc-icon>search</mwc-icon>${translate("appspage.schange4")}</mwc-button>`
    }

    openSearchDialog() {
        this.searchResources = []
        this.shadowRoot.getElementById('searchName').value = ''
        this.shadowRoot.getElementById('searchAppDialog').show()
    }

    renderDownload(downObj) {
        if (downObj.status.description === "Published but not yet downloaded" || downObj.status.status === "MISSING_DATA") {
            return html`<mwc-button ?disabled="${this.btnDisabled}" dense unelevated label="${translate("appspage.schange36")}" icon="download" @click=${() => this.downloadApp(downObj)}></mwc-button>`
        } else if (downObj.status.description === "Ready" || downObj.status.status === "DOWNLOADED") {
            return html`<a class="visitSite" href="../qdn/browser/index.html?name=${downObj.name}&service=${this.service}"><mwc-button class="green" dense unelevated label="${translate("appspage.schange39")}" icon="open_in_browser"></mwc-button></a>`
        } else {
            return html``
        }
    }

    async downloadApp(downObj) {
        this.showChunks(downObj)
        await parentEpml.request('apiCall', {
            url: `/arbitrary/resource/status/APP/${downObj.name}?build=true&apiKey=${this.getApiKey()}`
        })
    }

    showChunks(downObj) {
        const checkStatus = async () => {
            const service = this.service
            const name = downObj.name

            const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
            const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
            const url = `${nodeUrl}/arbitrary/resource/status/${service}/${name}?build=true&apiKey=${this.getApiKey()}`

            this.textStatus = 'Loading...'

            this.btnDisabled = true

            this.shadowRoot.getElementById('downloadProgressDialog').open()

            let timerDownload

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const status = await response.json()

            console.log("status:", status.id)

            if (status.id === "UNSUPPORTED") {
                this.btnDisabled = false
                this.textProgress = ''
                clearTimeout(timerDownload)
                this.textStatus = status.description
            } else if (status.id === "BLOCKED") {
                this.btnDisabled = false
                this.textProgress = ''
                this.textStatus = name + " is blocked so content cannot be served"
                clearTimeout(timerDownload)
                timerDownload = setTimeout(checkStatus, 5000)
            } else if (status.id === "READY") {
                this.btnDisabled = false
                clearTimeout(timerDownload)
                this.textStatus = ''
                this.textProgress = ''
                this.shadowRoot.getElementById('downloadProgressDialog').close()
                this.getData(0)
                this.getFollowedNamesRefresh()
                this.getFollowedNamesResource()
                this.updateComplete.then(() => this.requestUpdate())
            } else if (status.id === "BUILDING") {
                this.btnDisabled = true
                this.textProgress = ''
                this.textStatus = status.description
                clearTimeout(timerDownload)
                timerDownload = setTimeout(checkStatus, 1000)
            } else if (status.id === "BUILD_FAILED") {
                this.btnDisabled = false
                this.textProgress = ''
                clearTimeout(timerDownload)
                this.textStatus = status.description
            } else if (status.id === "NOT_STARTED") {
                this.btnDisabled = false
                this.textProgress = ''
                this.textStatus = status.description
                clearTimeout(timerDownload)
                timerDownload = setTimeout(checkStatus, 1000)
            } else if (status.id === "DOWNLOADING") {
                this.btnDisabled = true
                this.textStatus = status.description
                let progressString = get("appspage.schange42")
                this.textProgress = progressString + ": " + status.localChunkCount + " / " + status.totalChunkCount
                clearTimeout(timerDownload)
                timerDownload = setTimeout(checkStatus, 1000)
            } else if (status.id === "MISSING_DATA") {
                this.btnDisabled = true
                this.textProgress = ''
                this.textStatus = status.description
                clearTimeout(timerDownload)
                timerDownload = setTimeout(checkStatus, 5000)
            } else if (status.id === "DOWNLOADED") {
                this.btnDisabled = true
                this.textProgress = ''
                this.textStatus = status.description
                clearTimeout(timerDownload)
                timerDownload = setTimeout(checkStatus, 1000)
            }
        }
        checkStatus()
    }

    publishApp() {
        window.location.href = `../qdn/publish/index.html?service=${this.service}&identifier=${this.identifier}&uploadType=zip&category=app&showName=true&showService=false&showIdentifier=false&showMetadata=true`
    }

    async followName(appObj) {
        let name = appObj.name
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
            this.getFollowedNamesRefresh()
            this.getFollowedNamesResource()
        } else {
            let err3string = get("appspage.schange22")
            parentEpml.request('showSnackBar', `${err3string}`)
        }
        return ret
    }

    async unfollowName(appObj) {
        let name = appObj.name
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
        } else {
            let err4string = get("appspage.schange23")
            parentEpml.request('showSnackBar', `${err4string}`)
        }
        return ret
    }

    async unfollowNameTab(appObj) {
        let name = appObj.name
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
            this.getFollowedNamesRefresh()
            this.getFollowedNamesResource()
        } else {
            let err4string = get("websitespage.schange23")
            parentEpml.request('showSnackBar', `${err4string}`)
        }
        return ret
    }

    async blockName(appObj) {
        let name = appObj.name
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
        } else {
            let err5string = get("appspage.schange24")
            parentEpml.request('showSnackBar', `${err5string}`)
        }
        return ret
    }

    async unblockName(appObj) {
        let name = appObj.name
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
        } else {
            let err6string = get("appspage.schange25")
            parentEpml.request('showSnackBar', `${err6string}`)
        }
        return ret
    }

    async unblockNameTab(appObj) {
        let name = appObj.name
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
            this.getBlockedNamesRefresh()
            this.getBlockedNamesResource()
        } else {
            let err6string = get("websitespage.schange25")
            parentEpml.request('showSnackBar', `${err6string}`)
        }
        return ret
    }

    renderInfo(appObj) {
        let name = appObj.name
        let title = name
        let description = ""
        let categoryName = this.renderCatText()
        let tags = "";
        let sizeReadable = ""

        if (appObj.metadata != null) {
            title = appObj.metadata.title;
            description = appObj.metadata.description;
            categoryName = appObj.metadata.categoryName;
            if (appObj.metadata.tags != null && appObj.metadata.tags.length > 0) {
                tags = "Tags: " + appObj.metadata.tags.join(", ")
            }
        }

        if (appObj.size != null) {
            sizeReadable = this.bytesToSize(appObj.size);
        }

        return html`
            <div class="resourceTitle">
                ${title}
            </div>
            <div class="resourceDescription">
                ${description}
            </div>
            <div class="resourceCategoryTags">
                ${categoryName}&nbsp;
                ${tags.length > 0 ? " | " : ""}
                &nbsp;${tags}&nbsp;
                ${sizeReadable.length > 0 ? " | " : ""}
                &nbsp;${translate("appspage.schange27")}: ${sizeReadable}
            </div>
        `
    }

    renderPublishedBy(appObj) {
        return html`<div class="resourceRegisteredName">${appObj.name}</div>
        <div class="resourceStatus">${translate("appspage.schange28")}: <span title="${appObj.status.description}">${appObj.status.title}</span></div>`
    }

    renderSize(appObj) {
        if (appObj.size === null) {
            return html``
        }
        let sizeReadable = this.bytesToSize(appObj.size)
        return html`<span>${sizeReadable}</span>`
    }

    renderFollowUnfollowButton(appObj) {
        let name = appObj.name

        if (this.followedNames == null || !Array.isArray(this.followedNames)) {
            return html``
        }

        if (this.followedNames.indexOf(name) === -1) {
            return html`<mwc-button @click=${() => this.followName(appObj)}><mwc-icon>add_to_queue</mwc-icon>&nbsp;${translate("appspage.schange29")}</mwc-button>`
        } else {
            return html`<mwc-button @click=${() => this.unfollowName(appObj)}><mwc-icon>remove_from_queue</mwc-icon>&nbsp;${translate("appspage.schange30")}</mwc-button>`
        }
    }

    renderFollowUnfollowButtonTab(appObj) {
        let name = appObj.name

        if (this.followedNames == null || !Array.isArray(this.followedNames)) {
            return html``
        }

        if (this.followedNames.indexOf(name) === -1) {
            return html`<mwc-button @click=${() => this.followNameTab(appObj)}><mwc-icon>add_to_queue</mwc-icon>&nbsp;${translate("appspage.schange29")}</mwc-button>`
        }
        else {
            return html`<mwc-button @click=${() => this.unfollowNameTab(appObj)}><mwc-icon>remove_from_queue</mwc-icon>&nbsp;${translate("appspage.schange30")}</mwc-button>`
        }
    }

    renderBlockUnblockButton(appObj) {
        let name = appObj.name

        if (this.blockedNames == null || !Array.isArray(this.blockedNames)) {
            return html``
        }

        if (this.blockedNames.indexOf(name) === -1) {
            return html`<mwc-button @click=${() => this.blockName(appObj)}><mwc-icon>block</mwc-icon>&nbsp;${translate("appspage.schange31")}</mwc-button>`
        } else {
            return html`<mwc-button @click=${() => this.unblockName(appObj)}><mwc-icon>radio_button_unchecked</mwc-icon>&nbsp;${translate("appspage.schange32")}</mwc-button>`
        }
    }

    renderBlockUnblockButtonTab(appObj) {
        let name = appObj.name

        // Only show the block/unblock button if we have permission to modify the list on this node
        if (this.blockedNames == null || !Array.isArray(this.blockedNames)) {
            return html``
        }

        if (this.blockedNames.indexOf(name) === -1) {
            // render block button
            return html`<mwc-button @click=${() => this.blockNameTab(appObj)}><mwc-icon>block</mwc-icon>&nbsp;${translate("appspage.schange31")}</mwc-button>`
        }
        else {
            // render unblock button
            return html`<mwc-button @click=${() => this.unblockNameTab(appObj)}><mwc-icon>radio_button_unchecked</mwc-icon>&nbsp;${translate("appspage.schange32")}</mwc-button>`
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
        let apiKey = myNode.apiKey
        return apiKey
    }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }
}

window.customElements.define('q-apps', QApps)
