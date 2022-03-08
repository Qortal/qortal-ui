import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../../epml'

import '@material/mwc-button'
import '@material/mwc-textfield'
import '@material/mwc-select'
import '@material/mwc-list/mwc-list-item.js'
import '@material/mwc-slider'
import '@polymer/paper-progress/paper-progress.js'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class WebBrowser extends LitElement {
    static get properties() {
        return {
            url: { type: String },
            name: { type: String },
            service: { type: String },
            identifier: { type: String },
            followedNames: { type: Array },
            blockedNames: { type: Array },
            theme: { type: String, reflect: true }
        }
    }

    static get observers() {
        return ['_kmxKeyUp(amount)']
    }

    static get styles() {
        return css`
			* {
				--mdc-theme-primary: rgb(3, 169, 244);
				--mdc-theme-secondary: var(--mdc-theme-primary);
				--paper-input-container-focus-color: var(--mdc-theme-primary);
			}

			#websitesWrapper paper-button {
				float: right;
			}

			#websitesWrapper .buttons {
				width: auto !important;
			}

			.address-bar {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				height: 100px;
				background-color: var(--white);
				height: 36px;
			}

			.address-bar-button mwc-icon {
				width: 20px;
			}

			.iframe-container {
				position: absolute;
				top: 36px;
				left: 0;
				right: 0;
				bottom: 0;
				border-top: 1px solid var(--black);
			}

			.iframe-container iframe {
				display: block;
				width: 100%;
				height: 100%;
				border: none;
				background-color: var(--white);
			}

			input[type=text] {
				margin: 0;
				padding: 2px 0 0 20px;
				border: 0;
				height: 34px;
				font-size: 16px;
				background-color: var(--white);
			}

			paper-progress {
				--paper-progress-active-color: var(--mdc-theme-primary);
			}

			.float-right {
				float: right;
			}
		
		`
    }

    constructor() {
        super()
        this.url = 'about:blank'

        const urlParams = new URLSearchParams(window.location.search);
        this.name = urlParams.get('name');
        this.service = urlParams.get('service');
        // FUTURE: add support for identifiers
        this.identifier = null;
        this.followedNames = []
        this.blockedNames = []
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'

        const getFollowedNames = async () => {

            let followedNames = await parentEpml.request('apiCall', {
                url: `/lists/followedNames?apiKey=${this.getApiKey()}`
            })

            this.followedNames = followedNames
            setTimeout(getFollowedNames, this.config.user.nodeSettings.pingInterval)
        }

        const getBlockedNames = async () => {

            let blockedNames = await parentEpml.request('apiCall', {
                url: `/lists/blockedNames?apiKey=${this.getApiKey()}`
            })

            this.blockedNames = blockedNames
            setTimeout(getBlockedNames, this.config.user.nodeSettings.pingInterval)
        }

        const render = () => {
            const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
            const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
            this.url = `${nodeUrl}/render/${this.service}/${this.name}?theme=${this.theme}`;
        }

        const authorizeAndRender = () => {
            parentEpml.request('apiCall', {
                url: `/render/authorize/${this.name}?apiKey=${this.getApiKey()}`,
                method: "POST"
            }).then(res => {
                console.log(res)
                if (res.error) {
                    // Authorization problem - API key incorrect?
                }
                else {
                    render()
                }
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
                    authorizeAndRender()
                    setTimeout(getFollowedNames, 1)
                    setTimeout(getBlockedNames, 1)
                    configLoaded = true
                }
            })
            parentEpml.subscribe('copy_menu_switch', async value => {

                if (value === 'false' && window.getSelection().toString().length !== 0) {

                    this.clearSelection()
                }
            })
        })
    }

    render() {
        return html`
			<div id="websitesWrapper" style="width:auto; padding:10px; background: var(--white);">
				<div class="layout horizontal center">
					<div class="address-bar">
						<mwc-button @click=${() => this.goBack()} title="Back" class="address-bar-button"><mwc-icon>arrow_back_ios</mwc-icon></mwc-button>
						<mwc-button @click=${() => this.goForward()} title="Forward" class="address-bar-button"><mwc-icon>arrow_forward_ios</mwc-icon></mwc-button>
						<mwc-button @click=${() => this.refresh()} title="Reload" class="address-bar-button"><mwc-icon>refresh</mwc-icon></mwc-button>
						<mwc-button @click=${() => this.goBackToList()} title="Back to list" class="address-bar-button"><mwc-icon>home</mwc-icon></mwc-button>
						<input disabled style="width: 550px; color: var(--black);" id="address" type="text" value="qortal://${this.service.toLowerCase()}/${this.name}"></input>
						<mwc-button @click=${() => this.delete()} title="Delete ${this.service} ${this.name} from node" class="address-bar-button float-right"><mwc-icon>delete</mwc-icon></mwc-button>
						${this.renderBlockUnblockButton()}
						${this.renderFollowUnfollowButton()}
					</div>
					<div class="iframe-container">
						<iframe id="browser-iframe" src="${this.url}" sandbox="allow-scripts allow-forms allow-downloads">
							<span style="color: var(--black);">Your browser doesn't support iframes</span>
						</iframe>
					</div>
				</div>
			</div>
		`
    }

    firstUpdated() {

	setInterval(() => {
	    this.changeTheme();
	}, 100)

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
    }

    changeTheme() {
        const checkTheme = localStorage.getItem('qortalTheme')
        if (checkTheme === 'dark') {
            this.theme = 'dark';
        } else {
            this.theme = 'light';
        }
        document.querySelector('html').setAttribute('theme', this.theme);
    }

    renderFollowUnfollowButton() {
        // Only show the follow/unfollow button if we have permission to modify the list on this node
        if (this.followedNames == null || !Array.isArray(this.followedNames)) {
            return html``
        }

        if (this.followedNames.indexOf(this.name) === -1) {
            // render follow button
            return html`<mwc-button @click=${() => this.follow()} title="Follow ${this.name}" class="address-bar-button float-right"><mwc-icon>add_to_queue</mwc-icon></mwc-button>`
        }
        else {
            // render unfollow button
            return html`<mwc-button @click=${() => this.unfollow()} title="Unfollow ${this.name}" class="address-bar-button float-right"><mwc-icon>remove_from_queue</mwc-icon></mwc-button>`
        }
    }

    renderBlockUnblockButton() {
        // Only show the block/unblock button if we have permission to modify the list on this node
        if (this.blockedNames == null || !Array.isArray(this.blockedNames)) {
            return html``
        }

        if (this.blockedNames.indexOf(this.name) === -1) {
            // render block button
            return html`<mwc-button @click=${() => this.block()} title="Block ${this.name}" class="address-bar-button float-right"><mwc-icon>block</mwc-icon></mwc-button>`
        }
        else {
            // render unblock button
            return html`<mwc-button @click=${() => this.unblock()} title="Unblock ${this.name}" class="address-bar-button float-right"><mwc-icon>radio_button_unchecked</mwc-icon></mwc-button>`
        }
    }


    // Navigation

    goBack() {
        window.history.back();
    }

    goForward() {
        window.history.forward();
    }

    refresh() {
        window.location.reload();
    }

    goBackToList() {
        window.location = "../index.html";
    }

    follow() {
        this.followName(this.name);
    }

    unfollow() {
        this.unfollowName(this.name);
    }

    block() {
        this.blockName(this.name);
    }

    unblock() {
        this.unblockName(this.name);
    }

    delete() {
        this.deleteCurrentResource();
    }


    async followName(name) {
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

    async unfollowName(name) {
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

    async blockName(name) {
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

    async unblockName(name) {
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

    async deleteCurrentResource() {
        if (this.followedNames.indexOf(this.name) != -1) {
            // Following name - so deleting won't work
            parentEpml.request('showSnackBar', "Can't delete data from followed names. Please unfollow first.");
            return;
        }

        let identifier = this.identifier == null ? "default" : resource.identifier;

        let ret = await parentEpml.request('apiCall', {
            url: `/arbitrary/resource/${this.service}/${this.name}/${identifier}?apiKey=${this.getApiKey()}`,
            method: 'DELETE'
        })

        if (ret === true) {
            this.goBackToList();
        }
        else {
            parentEpml.request('showSnackBar', 'Error occurred when trying to delete this resource. Please try again')
        }

        return ret
    }



    // Helper Functions (Re-Used in Most part of the UI )

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

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
        let apiKey = myNode.apiKey;
        return apiKey;
    }

    clearSelection() {
        window.getSelection().removeAllRanges()
        window.parent.getSelection().removeAllRanges()
    }
}

window.customElements.define('web-browser', WebBrowser)
