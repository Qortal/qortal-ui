import {css, html, LitElement} from 'lit'
import {render} from 'lit/html.js'
import {Epml} from '../../../../epml'
import isElectron from 'is-electron'
import {get, registerTranslateConfig, translate, use} from '../../../../../core/translate'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-icon'
import '@polymer/paper-dialog/paper-dialog.js'
import '@vaadin/button'
import '@vaadin/grid'
import '@vaadin/icon'
import '@vaadin/icons'
import '@vaadin/text-field'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class DataManagement extends LitElement {
    static get properties() {
        return {
            loading: { type: Boolean },
            searchBlockedNames: { type: Array },
            searchFollowedNames: { type: Array },
            searchDatres: { type: Array },
            blockedNames: { type: Array },
            followedNames: { type: Array },
            datres: { type: Array },
            dataImageUrl: { type: String },
            savedGifRepo: { type: Array },
            collectionName: { type: String },
            theme: { type: String, reflect: true }
        }
    }

    static get styles() {
        return css`
	      * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --paper-input-container-focus-color: var(--mdc-theme-primary);
                --mdc-theme-surface: var(--white);
                --mdc-text-field-outlined-idle-border-color: var(--txtfieldborder);
                --mdc-text-field-outlined-hover-border-color: var(--txtfieldhoverborder);
                --mdc-text-field-label-ink-color: var(--black);
                --mdc-text-field-ink-color: var(--black);
                --mdc-dialog-content-ink-color: var(--black);
                --mdc-dialog-max-width: 85vw;
                --mdc-dialog-max-height: 95vh;
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

            paper-dialog.gif-repo {
                width: auto;
                max-width: 80vw;
                height: auto;
                max-height: 80vh;
                background-color: var(--white);
                color: var(--black);
                border: 1px solid var(--black);
                border-radius: 15px;
                line-height: 1.6;
                overflow-y: auto;
            }

            .actions {
                display:flex;
                justify-content: space-between;
                padding: 0 1em;
                margin: 12px 0 -6px 0;
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

            .image-container {
                display: flex;
            }

            .image-display {
                height: auto;
                max-height: 80vh;
                width: auto;
                max-width: 80vw;
                object-fit: contain;
                border-radius: 5px;
            }

            .green {
                --mdc-theme-primary: #198754;
            }

            .red {
                --mdc-theme-primary: #F44336;
            }

            .close-icon {
                font-size: 36px;
            }

            .close-icon:hover {
                cursor: pointer;
                opacity: .6;
            }

            .buttons {
                text-align: right;
            }

            .container {
                max-width: 90vw;
                margin-left: auto;
                margin-right: auto;
                margin-top: 20px;
                padding: .6em;
            }

            a.visitSite {
                text-decoration: none;
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
                font-size: 18px;
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

            .default-identifier {
                font-size: 14px;
                font-style: italic;
            }
        `
    }

    constructor() {
        super()
        this.selectedAddress = {}
        this.searchBlockedNames = []
        this.searchFollowedNames = []
        this.searchDatres = []
        this.blockedNames = []
        this.followedNames = []
        this.datres = []
        this.isLoading = false
        this.dataImageUrl = ''
        this.savedGifRepo = []
        this.collectionName = ''
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    gifCollection() {
        return html`
            <vaadin-grid theme="large" id="gifCollectionGrid" ?hidden="${this.isEmptyArray(this.savedGifRepo)}" .items="${this.savedGifRepo}" aria-label="GIF REPO" all-rows-visible>
                <vaadin-grid-column
                    width="12rem"
                    flex-grow="0"
                    header="${translate("registernamepage.nchange6")}"
                    .renderer=${(root, column, data) => {
	                  render(html`${data.item.name}`, root)
	              }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    width="12rem"
                    flex-grow="0"
                    header="${translate("gifs.gchange9")}"
                    .renderer=${(root, column, data) => {
                        render(html`${data.item.identifier}`, root)
                    }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    width="20rem"
                    flex-grow="0"
                    header="${translate("gifs.gchange29")}"
                    .renderer=${(root, column, data) => {
	                  render(html`${data.item.filepath}`, root)
	              }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    width="9rem"
                    flex-grow="0"
                    header="${translate("tradepage.tchange17")}"
                    .renderer=${(root, column, data) => {
                        render(html`${this.renderViewGifImage(data.item)}`, root)
                    }}
                ></vaadin-grid-column>
            </vaadin-grid>

            <mwc-dialog id="showGifImage" scrimClickAction="" escapeKeyAction="">
                <div></div>
                <div class="image-container">
                    <div class="image-display">
                        <img src="${this.dataImageUrl}">
                    </div>
                </div>
                <mwc-button
                    slot="primaryAction"
                    dialogAction="cancel"
                    class="red"
                    @click=${() => {this.closeGifRepoImageView()}}
                >
                ${translate("general.close")}
                </mwc-button>
            </mwc-dialog>
        `
    }

    render() {
        return html`
            <div id="websites-list-page">
                <div style="min-height:48px; display: flex; padding-bottom: 6px; margin: 2px;">
                    <h2 style="margin: 0; flex: 1; padding-top: .1em; display: inline;">${translate("datapage.dchange1")}</h2>
                </div>
        	<div class="divCard">
                    <h3 style="margin: 0; margin-bottom: 1em; text-align: left;">${translate("datapage.dchange2")}</h3>
	            <div id="search">
	                <vaadin-text-field theme="medium" id="searchName" placeholder="${translate("datapage.dchange3")}" value="${this.searchData}" @keydown="${this.searchListener}" clear-button-visible>
	                    <vaadin-icon slot="prefix" icon="vaadin:database"></vaadin-icon>
	                </vaadin-text-field>&nbsp;&nbsp;<br />
	                <vaadin-button theme="medium" @click="${(e) => this.doSearch(e)}">
	                    <vaadin-icon icon="vaadin:search" slot="prefix"></vaadin-icon>
	                    ${translate("datapage.dchange4")}
	                </vaadin-button>
	            </div><br />
                    <vaadin-grid theme="large" id="searchDataHostedGrid" ?hidden="${this.isEmptyArray(this.searchDatres)}" .items="${this.searchDatres}" aria-label="Search Data Hosted" all-rows-visible>
                        <vaadin-grid-column header="${translate("datapage.dchange5")}" path="name"></vaadin-grid-column>
                        <vaadin-grid-column header="${translate("datapage.dchange6")}" path="service"></vaadin-grid-column>
			<vaadin-grid-column header="${translate("datapage.dchange7")}" .renderer=${(root, column, data) => {
                	    render(html`${this.renderSearchIdentifier(data.item)}`, root)
            		}}>
                        </vaadin-grid-column>
			<vaadin-grid-column width="11rem" flex-grow="0" header="${translate("datapage.dchange8")}" .renderer=${(root, column, data) => {
                	    render(html`${this.renderSearchDeleteButton(data.item)}`, root);
            	}}>
                  </vaadin-grid-column>
			<vaadin-grid-column width="11rem" flex-grow="0" header="" .renderer=${(root, column, data) => {
                	    render(html`${this.renderSearchBlockUnblockButton(data.item)}`, root);
            	}}>
                  </vaadin-grid-column>
			<vaadin-grid-column width="9rem" flex-grow="0" header="" .renderer=${(root, column, data) => {
                      if (data.item.service === "QCHAT_IMAGE") {
                          render(html`${this.renderViewQchatImage(data.item)}`, root)
                      } else if (data.item.service === "THUMBNAIL") {
                          render(html`${this.renderViewAvatarImage(data.item)}`, root)
                      } else if (data.item.service === "GIF_REPOSITORY") {
                          render(html`${this.renderViewGifRepo(data.item)}`, root)
                      } else if (data.item.service === "WEBSITE") {
                          render(html`${this.renderViewWebsite(data.item)}`, root)
                      } else {
                          render(html``, root)
                      }
            	}}>
                  </vaadin-grid-column>
                </vaadin-grid>
	        </div><br />
                <div class="divCard">
                    <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">${translate("datapage.dchange9")}</h3>
                    <vaadin-grid theme="large" id="resourcesGrid" ?hidden="${this.isEmptyArray(this.datres)}" aria-label="Data Hosted" page-size="20" all-rows-visible>
                        <vaadin-grid-column header="${translate("datapage.dchange5")}" path="name"></vaadin-grid-column>
                        <vaadin-grid-column header="${translate("datapage.dchange6")}" path="service"></vaadin-grid-column>
			<vaadin-grid-column header="${translate("datapage.dchange7")}" .renderer=${(root, column, data) => {
                	    render(html`${this.renderIdentifier(data.item)}`, root)
            		}}>
                        </vaadin-grid-column>
			<vaadin-grid-column width="11rem" flex-grow="0" header="${translate("datapage.dchange8")}" .renderer=${(root, column, data) => {
                	    render(html`${this.renderDeleteButton(data.item)}`, root);
            		}}>
                        </vaadin-grid-column>
			<vaadin-grid-column width="11rem" flex-grow="0" header="" .renderer=${(root, column, data) => {
                	    render(html`${this.renderBlockUnblockButton(data.item)}`, root);
            	}}>
                  </vaadin-grid-column>
			<vaadin-grid-column width="9rem" flex-grow="0" header="" .renderer=${(root, column, data) => {
                      if (data.item.service === "QCHAT_IMAGE") {
                          render(html`${this.renderViewQchatImage(data.item)}`, root)
                      } else if (data.item.service === "THUMBNAIL") {
                          render(html`${this.renderViewAvatarImage(data.item)}`, root)
                      } else if (data.item.service === "GIF_REPOSITORY") {
                          render(html`${this.renderViewGifRepo(data.item)}`, root)
                      } else if (data.item.service === "WEBSITE") {
                          render(html`${this.renderViewWebsite(data.item)}`, root)
                      } else {
                          render(html``, root)
                      }
            	}}>
                  </vaadin-grid-column>
                  </vaadin-grid>
                    <div id="pages"></div>
		    ${this.renderDefaultText()}
                </div>

                <mwc-dialog id="showQchatImage" scrimClickAction="" escapeKeyAction="">
                    <div></div>
                    <div class="image-container">
                        <div class="image-display">
                            <img src="${this.dataImageUrl}">
                        </div>
                    </div>
                    <mwc-button
                        slot="primaryAction"
                        dialogAction="cancel"
                        class="red"
                        @click=${() => {this.closeQchatImageViewDialog()}}
                    >
                    ${translate("general.close")}
                    </mwc-button>
                </mwc-dialog>

                <mwc-dialog id="showAvatarImage" scrimClickAction="" escapeKeyAction="">
                    <div></div>
                    <div class="image-container">
                        <div class="image-display">
                            <img src="${this.dataImageUrl}">
                        </div>
                    </div>
                    <mwc-button
                        slot="primaryAction"
                        dialogAction="cancel"
                        class="red"
                        @click=${() => {this.closeAvatarImageViewDialog()}}
                    >
                    ${translate("general.close")}
                    </mwc-button>
                </mwc-dialog>
            </div>

            <paper-dialog id="gifCollectionDialog" class="gif-repo" modal>
                <div class="actions">
                    <h2>${translate("gifs.gchange9")} : ${this.collectionName}</h2>
                    <mwc-icon class="close-icon" @click=${ () => this.closeGifRepoView()} title="${translate("general.close")}">highlight_off</mwc-icon>
                </div>
                <hr />
                <div class="container">${this.gifCollection()}</div>
            </paper-dialog>
        `
    }

    firstUpdated() {
        this.changeTheme()
        this.changeLanguage()
        this.showManagement()

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
                this.config = JSON.parse(c)
                if (!configLoaded) {
                    setTimeout(this.getFollowedNames, 1)
                    setTimeout(this.getBlockedNames, 1)
                    setInterval(this.getFollowedNames, 30 * 1000)
                    setInterval(this.getBlockedNames, 30 * 1000)
                    setTimeout(this.getSearchFollowedNames, 1)
                    setTimeout(this.getSearchBlockedNames, 1)
                    setInterval(this.getSearchFollowedNames, 30 * 1000)
                    setInterval(this.getSearchBlockedNames, 30 * 1000)
                    setInterval(this.getManagementDetails, 30 * 1000)
                    configLoaded = true
                }
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
            this.theme = checkTheme;
        } else {
            this.theme = 'light';
        }
        document.querySelector('html').setAttribute('theme', this.theme);
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

    searchListener(e) {
        if (e.key === 'Enter') {
            this.doSearch(e);
        }
    }

    doSearch(e) {
        this.searchResult()
    }

    async searchResult() {
        let searchName = this.shadowRoot.getElementById('searchName').value
        if (searchName.length === 0) {
            let err1string = get("datapage.dchange10")
            parentEpml.request('showSnackBar', `${err1string}`)
        } else {
            let searchDatres = await parentEpml.request('apiCall', {
                url: `/arbitrary/hosted/resources?includestatus=true&limit=20&offset=0&query=${searchName}&apiKey=${this.getApiKey()}`
            })
            if (this.isEmptyArray(searchDatres)) {
                let err2string = get("datapage.dchange11")
                parentEpml.request('showSnackBar', `${err2string}`)
            } else {
                this.searchDatres = searchDatres
            }
        }
    }

    renderViewWebsite(viewWebsiteObj) {
        return html`<a class="visitSite" href="../browser/index.html?name=${viewWebsiteObj.name}&service=${viewWebsiteObj.service}"><mwc-button class="green"><mwc-icon>pageview</mwc-icon>&nbsp;${translate("general.view")}</mwc-button></a>`
    }

    renderViewQchatImage(viewQchatObj) {
        return html`<mwc-button class="green"  @click=${() => this.openQchatImageView(viewQchatObj)} onclick="this.blur();"><mwc-icon>pageview</mwc-icon>&nbsp;${translate("general.view")}</mwc-button>`
    }

    openQchatImageView(viewChatObj) {
        let name = viewChatObj.name
        let identifier = viewChatObj.identifier
        let service = viewChatObj.service
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/arbitrary/${service}/${name}/${identifier}?rebuild=true&async=true&apiKey=${this.getApiKey()}`
        this.openQchatImageViewDialog(url)
    }

    openQchatImageViewDialog(qchatUrl) {
        this.dataImageUrl = ''
        this.dataImageUrl = qchatUrl
        this.shadowRoot.querySelector('#showQchatImage').show()
    }

    closeQchatImageViewDialog() {
        this.shadowRoot.querySelector('#showQchatImage').close()
        this.dataImageUrl = ''
    }

    renderViewAvatarImage(viewAvatarObj) {
        return html`<mwc-button class="green" @click=${() => this.openAvatarImageView(viewAvatarObj)} onclick="this.blur();"><mwc-icon>pageview</mwc-icon>&nbsp;${translate("general.view")}</mwc-button>`
    }

    openAvatarImageView(viewAvatarObj) {
        let name = viewAvatarObj.name
        let identifier = viewAvatarObj.identifier
        let service = viewAvatarObj.service
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/arbitrary/${service}/${name}/${identifier}?rebuild=true&async=true&apiKey=${this.getApiKey()}`
        this.openAvatarImageViewDialog(url)
    }

    openAvatarImageViewDialog(avatarUrl) {
        this.dataImageUrl = ''
        this.dataImageUrl = avatarUrl
        this.shadowRoot.querySelector('#showAvatarImage').show()
    }

    closeAvatarImageViewDialog() {
        this.shadowRoot.querySelector('#showAvatarImage').close()
        this.dataImageUrl = ''
    }


    renderViewGifRepo(viewGifRepoObj) {
        return html`<mwc-button class="green" @click=${() => this.openGifRepoView(viewGifRepoObj)} onclick="this.blur();"><mwc-icon>pageview</mwc-icon>&nbsp;${translate("general.view")}</mwc-button>`
    }

    async openGifRepoView(viewGifRepoObj) {
        let name = viewGifRepoObj.name
        let identifier = viewGifRepoObj.identifier
        let service = viewGifRepoObj.service
        this.collectionName = ''
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/arbitrary/${service}/${name}/${identifier}?rebuild=true&async=true&apiKey=${this.getApiKey()}`
        const metaUrl = `${nodeUrl}/arbitrary/metadata/${service}/${name}/${identifier}?apiKey=${this.getApiKey()}`

        this.savedGifRepo = []
        var imageList = []
        this.collectionName = identifier

        await fetch(metaUrl).then(response => {
            return response.json()
        }).then(data => {
            data.files.map(item => {
                const gifDetails = {
                    name: name,
                    identifier: identifier,
                    service: service,
                    filepath: item
                }
                imageList.push(gifDetails)
            })
        })
        this.savedGifRepo = imageList
        this.shadowRoot.querySelector('#gifCollectionDialog').open()
    }

    renderViewGifImage(viewGifImageObj) {
        return html`<mwc-button class="green" @click=${() => this.openGifRepoImageView(viewGifImageObj)} onclick="this.blur();"><mwc-icon>pageview</mwc-icon>&nbsp;${translate("general.view")}</mwc-button>`
    }

    closeGifRepoView() {
        this.shadowRoot.querySelector('#gifCollectionDialog').close()
        this.savedGifRepo = []
        this.collectionName = ''
    }

    openGifRepoImageView(gifViewObj) {
        this.dataImageUrl = ''
        let name = gifViewObj.name
        let identifier = gifViewObj.identifier
        let service = gifViewObj.service
        let filepath = gifViewObj.filepath
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		this.dataImageUrl = `${nodeUrl}/arbitrary/${service}/${name}/${identifier}?filepath=${filepath}&rebuild=true&async=true&apiKey=${this.getApiKey()}`
        this.shadowRoot.querySelector('#showGifImage').show()
    }

    closeGifRepoImageView() {
        this.shadowRoot.querySelector('#showGifImage').close()
        this.dataImageUrl = ''
    }

    renderDefaultText() {
        if (this.datres == null || !Array.isArray(this.datres)) {
            return html`<br />${translate("datapage.dchange12")}`
        }
        if (this.isEmptyArray(this.datres)) {
            return html`<br />${translate("datapage.dchange13")}`;
        }
        return '';
    }

    renderSearchIdentifier(search) {
        return search.identifier == null ? html`<span class="default-identifier">default</span>` : html`${search.identifier}`
    }

    renderSearchDeleteButton(search) {
        let name = search.name

        // Only show the block/unblock button if we have permission to modify the list on this node
        // We can use the blocked names list for this, as it won't be a valid array if we have no access
        if (this.searchBlockedNames == null || !Array.isArray(this.searchBlockedNames)) {
            return html``
        }

        // We need to check if we are following this name, as if we are, there is no point in deleting anything
        // as it will be re-fetched immediately. In these cases we should show an UNFOLLOW button.
        if (this.searchFollowedNames.indexOf(name) != -1) {
            // render unfollow button
            return html`<mwc-button @click=${() => this.searchUnfollowName(search)}><mwc-icon>remove_from_queue</mwc-icon>&nbsp;${translate("datapage.dchange14")}</mwc-button>`
        }

        // render delete button
        return html`<mwc-button @click=${() => this.deleteSearchResource(search)} onclick="this.blur();"><mwc-icon>delete</mwc-icon>&nbsp;${translate("datapage.dchange15")}</mwc-button>`
    }

    renderSearchBlockUnblockButton(search) {
        let name = search.name

        // Only show the block/unblock button if we have permission to modify the list on this node
        if (this.searchBlockedNames == null || !Array.isArray(this.searchBlockedNames)) {
            return html``
        }

        if (this.searchBlockedNames.indexOf(name) === -1) {
            // render block button
            return html`<mwc-button @click=${() => this.searchBlockName(search)}><mwc-icon>block</mwc-icon>&nbsp;${translate("datapage.dchange16")}</mwc-button>`
        }
        else {
            // render unblock button
            return html`<mwc-button @click=${() => this.searchUnblockName(search)}><mwc-icon>radio_button_unchecked</mwc-icon>&nbsp;${translate("datapage.dchange17")}</mwc-button>`
        }
    }

    async searchBlockName(search) {
        let name = search.name
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
            this.searchBlockedNames = this.searchBlockedNames.filter(item => item != name);
            this.searchBlockedNames.push(name)
        }
        else {
            let err3string = get("datapage.dchange18")
            parentEpml.request('showSnackBar', `${err3string}`)
        }
        return ret
    }

    async searchUnfollowName(search) {
        let name = search.name
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
            this.searchFollowedNames = this.searchFollowedNames.filter(item => item != name);
        }
        else {
            let err4string = get("datapage.dchange19")
            parentEpml.request('showSnackBar', `${err4string}`)
        }
        return ret
    }

    async searchUnblockName(search) {
        let name = search.name
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
            this.searchBlockedNames = this.searchBlockedNames.filter(item => item != name);
        }
        else {
            let err5string = get("datapage.dchange20")
            parentEpml.request('showSnackBar', `${err5string}`)
        }
        return ret
    }

    async deleteSearchResource(search) {
        let identifier = search.identifier == null ? "default" : search.identifier;

        let ret = await parentEpml.request('apiCall', {
            url: `/arbitrary/resource/${search.service}/${search.name}/${identifier}?apiKey=${this.getApiKey()}`,
            method: 'DELETE'
        })

        if (ret === true) {
            // Successfully deleted - so refresh the page
            window.location.reload();
        }
        else {
            let err6string = get("datapage.dchange21")
            parentEpml.request('showSnackBar', `${err6string}`)
        }
        return ret
    }

    renderIdentifier(resource) {
        return resource.identifier == null ? html`<span class="default-identifier">default</span>` : html`${resource.identifier}`
    }

    renderDeleteButton(resource) {
        let name = resource.name

        // Only show the block/unblock button if we have permission to modify the list on this node
        // We can use the blocked names list for this, as it won't be a valid array if we have no access
        if (this.blockedNames == null || !Array.isArray(this.blockedNames)) {
            return html``
        }

        // We need to check if we are following this name, as if we are, there is no point in deleting anything
        // as it will be re-fetched immediately. In these cases we should show an UNFOLLOW button.
        if (this.followedNames.indexOf(name) != -1) {
            // render unfollow button
            return html`<mwc-button @click=${() => this.unfollowName(resource)}><mwc-icon>remove_from_queue</mwc-icon>&nbsp;${translate("datapage.dchange14")}</mwc-button>`
        }

        // render delete button
        return html`<mwc-button @click=${() => this.deleteResource(resource)} onclick="this.blur();"><mwc-icon>delete</mwc-icon>&nbsp;${translate("datapage.dchange15")}</mwc-button>`
    }

    renderBlockUnblockButton(resource) {
        let name = resource.name

        // Only show the block/unblock button if we have permission to modify the list on this node
        if (this.blockedNames == null || !Array.isArray(this.blockedNames)) {
            return html``
        }

        if (this.blockedNames.indexOf(name) === -1) {
            // render block button
            return html`<mwc-button @click=${() => this.blockName(resource)}><mwc-icon>block</mwc-icon>&nbsp;${translate("datapage.dchange16")}</mwc-button>`
        }
        else {
            // render unblock button
            return html`<mwc-button @click=${() => this.unblockName(resource)}><mwc-icon>radio_button_unchecked</mwc-icon>&nbsp;${translate("datapage.dchange17")}</mwc-button>`
        }
    }

    async blockName(resource) {
        let name = resource.name
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
            let err7string = get("datapage.dchange18")
            parentEpml.request('showSnackBar', `${err7string}`)
        }

        return ret
    }

    async unfollowName(resource) {
        let name = resource.name
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
            let err8string = get("datapage.dchange19")
            parentEpml.request('showSnackBar', `${err8string}`)
        }

        return ret
    }

    async unblockName(resource) {
        let name = resource.name
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
            let err9string = get("datapage.dchange20")
            parentEpml.request('showSnackBar', `${err7string}`)
        }

        return ret
    }

    async deleteResource(resource) {
        let identifier = resource.identifier == null ? "default" : resource.identifier;

        let ret = await parentEpml.request('apiCall', {
            url: `/arbitrary/resource/${resource.service}/${resource.name}/${identifier}?apiKey=${this.getApiKey()}`,
            method: 'DELETE'
        })

        if (ret === true) {
            // Successfully deleted - so refresh the page
            window.location.reload();
        }
        else {
            let err10string = get("datapage.dchange21")
            parentEpml.request('showSnackBar', `${err10string}`)
        }

        return ret
    }

    async getResourcesGrid() {
        this.resourcesGrid = this.shadowRoot.querySelector(`#resourcesGrid`)
        this.pagesControl = this.shadowRoot.querySelector('#pages')
        this.pages = undefined
    }

    getManagementDetails = async () => {
		this.datres = await parentEpml.request('apiCall', {
			url: `/arbitrary/hosted/resources?apiKey=${this.getApiKey()}`
		});
    }

    async updateItemsFromPage(page) {
        if (page === undefined) {
            return
        }

        if (!this.pages) {
            this.pages = Array.apply(null, { length: Math.ceil(this.datres.length / this.resourcesGrid.pageSize) }).map((item, index) => {
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

        this.resourcesGrid.items = this.datres.slice(start, end)
    }

    async showManagement() {
        await this.getManagementDetails()
        await this.getResourcesGrid()
        await this.updateItemsFromPage(1, true)
    }

    getSearchBlockedNames = async () => {
		this.searchBlockedNames = await parentEpml.request('apiCall', {
			url: `/lists/blockedNames?apiKey=${this.getApiKey()}`
		})
    }

    getSearchFollowedNames = async () => {
		this.searchFollowedNames = await parentEpml.request('apiCall', {
			url: `/lists/followedNames?apiKey=${this.getApiKey()}`
		})
    }

    getBlockedNames = async () => {
		this.blockedNames = await parentEpml.request('apiCall', {
			url: `/lists/blockedNames?apiKey=${this.getApiKey()}`
		})
    }

    getFollowedNames = async () => {
		this.followedNames = await parentEpml.request('apiCall', {
			url: `/lists/followedNames?apiKey=${this.getApiKey()}`
		})
    }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
		return myNode.apiKey;
    }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }
}

window.customElements.define('data-management', DataManagement)
