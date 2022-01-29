import { LitElement, html, css } from 'lit-element'
import { render } from 'lit-html'
import { Epml } from '../../../../epml'

import '@material/mwc-icon'
import '@material/mwc-button'

import '@vaadin/vaadin-grid/vaadin-grid.js'
import '@vaadin/vaadin-grid/theme/material/all-imports.js'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class DataManagement extends LitElement {
    static get properties() {
        return {
            loading: { type: Boolean },
            blockedNames: { type: Array },
            followedNames: { type: Array },
            datres: { type: Array }
        }
    }

    static get styles() {
        return css`
	    * {
	        --mdc-theme-primary: rgb(3, 169, 244);
                --paper-input-container-focus-color: var(--mdc-theme-primary);
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
        this.blockedNames = []
        this.followedNames = []
        this.datres = []
        this.isLoading = false
    }

    render() {
        return html`
            <div id="websites-list-page">
                <div style="min-height:48px; display: flex; padding-bottom: 6px; margin: 2px;">
                    <h2 style="margin: 0; flex: 1; padding-top: .1em; display: inline;">Data Management</h2>
                </div>
                <div class="divCard">
                    <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">Data hosted by this node</h3>
                    <vaadin-grid id="resourcesGrid" style="height:auto;" ?hidden="${this.isEmptyArray(this.datres)}" page-size="20" height-by-rows>
                        <vaadin-grid-column header="Registered Name" path="name"></vaadin-grid-column>
                        <vaadin-grid-column header="Service" path="service"></vaadin-grid-column>
			<vaadin-grid-column header="Identifier" .renderer=${(root, column, data) => {
                	    render(html`${this.renderIdentifier(data.item)}`, root)
            		}}></vaadin-grid-column>
			<vaadin-grid-column width="10rem" flex-grow="0" header="" .renderer=${(root, column, data) => {
                	    render(html`${this.renderDeleteButton(data.item)}`, root);
            		}}></vaadin-grid-column>
			<vaadin-grid-column width="10rem" flex-grow="0" header="" .renderer=${(root, column, data) => {
                	    render(html`${this.renderBlockUnblockButton(data.item)}`, root);
            		}}></vaadin-grid-column>
                    </vaadin-grid>
                    <div id="pages"></div>
		    ${this.renderDefaultText()}
                </div>
            </div>
        `
    }

    firstUpdated() {

        window.addEventListener('contextmenu', (event) => {
            event.preventDefault()
            this._textMenu(event)
        })

        window.addEventListener('click', () => {
            parentEpml.request('closeCopyTextMenu', null)
        })

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
                this.config = JSON.parse(c)
                if (!configLoaded) {
                    setTimeout(this.getFollowedNames, 1)
                    setTimeout(this.getBlockedNames, 1)
                    setInterval(this.showManagement(), 30 * 1000)
                    setInterval(this.getFollowedNames, 30 * 1000)
                    setInterval(this.getBlockedNames, 30 * 1000)
                    configLoaded = true
                }
            })
            parentEpml.subscribe('copy_menu_switch', async value => {

                if (value === 'false' && window.getSelection().toString().length !== 0) {

                    this.clearSelection()
                }
            })
        })
        parentEpml.imReady()
    }

    renderDefaultText() {
        if (this.datres == null || !Array.isArray(this.datres)) {
            return html`<br />Couldn't fetch hosted data list from node`
        }
        if (this.isEmptyArray(this.datres)) {
            return html`<br />This node isn't hosting any data`;
        }
        return '';
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
            return html`<mwc-button @click=${() => this.unfollowName(resource)}><mwc-icon>remove_from_queue</mwc-icon>&nbsp;Unfollow</mwc-button>`
        }

        // render delete button
        return html`<mwc-button @click=${() => this.deleteResource(resource)} onclick="this.blur();"><mwc-icon>delete</mwc-icon>&nbsp;Delete</mwc-button>`
    }

    renderBlockUnblockButton(resource) {
        let name = resource.name

        // Only show the block/unblock button if we have permission to modify the list on this node
        if (this.blockedNames == null || !Array.isArray(this.blockedNames)) {
            return html``
        }

        if (this.blockedNames.indexOf(name) === -1) {
            // render block button
            return html`<mwc-button @click=${() => this.blockName(resource)}><mwc-icon>block</mwc-icon>&nbsp;Block</mwc-button>`
        }
        else {
            // render unblock button
            return html`<mwc-button @click=${() => this.unblockName(resource)}><mwc-icon>radio_button_unchecked</mwc-icon>&nbsp;Unblock</mwc-button>`
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
            parentEpml.request('showSnackBar', 'Error occurred when trying to block this registered name. Please try again')
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
            parentEpml.request('showSnackBar', 'Error occurred when trying to unfollow this registered name. Please try again')
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
            parentEpml.request('showSnackBar', 'Error occurred when trying to unblock this registered name. Please try again')
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
            this.getArbitraryResources();
        }
        else {
            parentEpml.request('showSnackBar', 'Error occurred when trying to delete this resource. Please try again')
        }

        return ret
    }


    textColor(color) {
        return color == 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.87)'
    }

    _textMenu(event) {
        const getSelectedText = () => {
            var text = ''
            if (typeof window.getSelection != 'undefined') {
                text = window.getSelection().toString()
            } else if (typeof this.shadowRoot.selection != 'undefined' && this.shadowRoot.selection.type == 'Text') {
                text = this.shadowRoot.selection.createRange().text
            }
            return text
        }

        const checkSelectedTextAndShowMenu = () => {
            let selectedText = getSelectedText()
            if (selectedText && typeof selectedText === 'string') {
                let _eve = { pageX: event.pageX, pageY: event.pageY, clientX: event.clientX, clientY: event.clientY }

                let textMenuObject = { selectedText: selectedText, eventObject: _eve, isFrame: true }

                parentEpml.request('openCopyTextMenu', textMenuObject)
            }
        }

        checkSelectedTextAndShowMenu()
    }

    async getResourcesGrid() {
        this.resourcesGrid = this.shadowRoot.querySelector(`#resourcesGrid`)
        this.pagesControl = this.shadowRoot.querySelector('#pages')
        this.pages = undefined
    }

    async fetchManagementDetails() {
        const myDat = await parentEpml.request('apiCall', {
            url: `/arbitrary/hosted/resources?apiKey=${this.getApiKey()}`
        })
        this.datres = myDat;
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
        await this.fetchManagementDetails()
        await this.getResourcesGrid()
        await this.updateItemsFromPage(1, true)
    }



    getBlockedNames = async () => {

        let blockedNames = await parentEpml.request('apiCall', {
            url: `/lists/blockedNames?apiKey=${this.getApiKey()}`
        })

        this.blockedNames = blockedNames
    }

    getFollowedNames = async () => {

        let followedNames = await parentEpml.request('apiCall', {
            url: `/lists/followedNames?apiKey=${this.getApiKey()}`
        })

        this.followedNames = followedNames
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

window.customElements.define('data-management', DataManagement)
