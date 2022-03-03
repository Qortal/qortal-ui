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

class PublishData extends LitElement {
    static get properties() {
        return {
            name: { type: String },
            service: { type: String },
            identifier: { type: String },
            category: { type: String },
            uploadType: { type: String },
            showName: { type: Boolean },
            showService: { type: Boolean },
            showIdentifier: { type: Boolean },
            serviceLowercase: { type: String },
            names: { type: Array },
            registeredName: { type: String },
            selectedName: { type: String },
            path: { type: String },
            portForwardingEnabled: { type: Boolean },
            amount: { type: Number },
            generalMessage: { type: String },
            successMessage: { type: String },
            errorMessage: { type: String },
            loading: { type: Boolean },
            btnDisable: { type: Boolean }
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

			#publishWrapper paper-button {
				float: right;
			}

			#publishWrapper .buttons {
				width: auto !important;
			}

			mwc-textfield {
				margin: 0;
			}

			paper-progress {
				--paper-progress-active-color: var(--mdc-theme-primary);
			}

			.upload-text {
				display: block;
				font-size: 14px;
			}

			.address-bar {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				height: 100px;
				background-color: white;
				height: 36px;
			}

			.address-bar-button mwc-icon {
				width: 30px;
			}
		`
    }

    render() {
        return html`
			<div id="publishWrapper" style="width:auto; padding:10px; background: #fff; height:100vh;">
				<div class="layout horizontal center" style=" padding:12px 15px;">
					<div class="address-bar">
						<mwc-button @click=${() => this.goBack()} class="address-bar-button"><mwc-icon>arrow_back_ios</mwc-icon> Back</mwc-button>
					</div>
					<paper-card style="width:100%; max-width:740px;">
						<div style="margin:0; margin-top:20px;">
							<h3 style="margin:0; padding:8px 0; text-transform:capitalize;">Publish / Update ${this.category}</h3>
							<p style="font-style:italic; font-size:14px;" ?hidden="${this.portForwardingEnabled}">Note: it is recommended that you set up port forwarding before hosting data, so that it can more easily accessed by peers on the network.</p>
						</div>
					</paper-card>
					<!-- TODO: adapt this dropdown to list all names on the account. Right now it's hardcoded to a single name -->
					<p style="display: ${this.showName ? 'block' : 'none'}">
						<mwc-select id="registeredName" label="Select Name" index="0" @selected=${(e) => this.selectName(e)} style="min-width: 130px; max-width:100%; width:100%;">
                            <mwc-list-item selected value=""></mwc-list-item>
							<mwc-list-item value="${this.registeredName}">${this.registeredName}</mwc-list-item>
						</mwc-select>
					</p>
					${this.renderUploadField()}
					<p style="display: ${this.showService ? 'block' : 'none'}">
						<mwc-textfield style="width:100%;" label="Service" id="service" type="text" value="${this.service}"></mwc-textfield>
					</p>
					<p style="display: ${this.showIdentifier ? 'block' : 'none'}">
						<mwc-textfield style="width:100%;" label="Identifier" id="identifier" type="text" value="${this.identifier != null ? this.identifier : ''}"></mwc-textfield>
					</p>
					
					<p style="break-word;">${this.generalMessage}</p>
					<p style="color:red">${this.errorMessage}</p>
					<p style="color:green;word-break: break-word;">${this.successMessage}</p>

					${this.loading ? html` <paper-progress indeterminate style="width:100%; margin:4px;"></paper-progress> ` : ''}

					<div class="buttons">
						<div>
							<mwc-button ?disabled=${this.btnDisable} style="width:100%;" raised icon="send" @click=${(e) => this.doPublish(e)}>Publish &nbsp;</mwc-button>
						</div>
					</div>
				</div>
			</div>
		`
    }

    // Navigation

    goBack() {
        window.history.back();
    }


    renderUploadField() {
        if (this.uploadType === "file") {
            return html`<p>
				<input style="width:100%;" id="file" type="file" />
			</p>`;
        }
        else if (this.uploadType === "zip") {
            return html`<p>
				<span class="upload-text">Select zip file containing static content:</span><br />
				<input style="width:100%;" id="file" type="file" accept=".zip" />
			</p>`;
        }
        else {
            return html`<p>
				<mwc-textfield style="width:100%;" label="Local path to static files" id="path" type="text" value="${this.path}"></mwc-textfield>
			</p>`;
        }
    }


    doPublish(e) {
        let registeredName = this.shadowRoot.getElementById('registeredName').value
        let service = this.shadowRoot.getElementById('service').value
        let identifier = this.shadowRoot.getElementById('identifier').value

        // If name is hidden, use the value passed in via the name parameter
        if (!this.showName) {
            registeredName = this.name
        }

        let file;
        let path;

        if (this.uploadType === "file" || this.uploadType === "zip") {
            file = this.shadowRoot.getElementById('file').files[0]
        }
        else if (this.uploadType === "path") {
            path = this.shadowRoot.getElementById('path').value
        }

        this.generalMessage = ''
        this.successMessage = ''
        this.errorMessage = ''

        if (registeredName === '') {
            this.showName = true
            parentEpml.request('showSnackBar', 'Please select a registered name to publish data for')
        }
        else if (this.uploadType === "file" && file == null) {
            parentEpml.request('showSnackBar', 'Please select a file to host')
        }
        else if (this.uploadType === "zip" && file == null) {
            parentEpml.request('showSnackBar', 'Please select a zip file to host')
        }
        else if (this.uploadType === "path" && path === '') {
            parentEpml.request('showSnackBar', 'Please enter the directory path containing the static content')
        }
        else if (service === '') {
            parentEpml.request('showSnackBar', 'Please enter a service name')
        }
        else {
            this.publishData(registeredName, path, file, service, identifier)
        }
    }

    async publishData(registeredName, path, file, service, identifier) {
        this.loading = true
        this.btnDisable = true

        const validateName = async (receiverName) => {
            let nameRes = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/names/${receiverName}`,
            })

            return nameRes
        }

        const showError = async (errorMessage) => {
            this.loading = false
            this.btnDisable = false
            this.generalMessage = ''
            this.successMessage = ''
            console.error(errorMessage)
        }

        const validate = async () => {
            let validNameRes = await validateName(registeredName)
            if (validNameRes.error) {
                this.errorMessage = "Error: " + validNameRes.message
                showError(this.errorMessage)
                throw new Error(this.errorMessage);
            }

            this.generalMessage = "Processing data... this can take some time...";

            let transactionBytes = await uploadData(registeredName, path, file)
            if (transactionBytes.error) {
                this.errorMessage = "Error: " + transactionBytes.message
                showError(this.errorMessage)
                throw new Error(this.errorMessage);
            }
            else if (transactionBytes.includes("Error 500 Internal Server Error")) {
                this.errorMessage = "Internal Server Error when publishing data"
                showError(this.errorMessage)
                throw new Error(this.errorMessage);
            }

            this.generalMessage = "Computing proof of work... this can take some time...";

            let signAndProcessRes = await signAndProcess(transactionBytes)
            if (signAndProcessRes.error) {
                this.errorMessage = "Error: " + signAndProcessRes.message
                showError(this.errorMessage)
                throw new Error(this.errorMessage);
            }

            this.btnDisable = false
            this.loading = false
            this.errorMessage = ''
            this.generalMessage = ''
            this.successMessage = 'Transaction successful!'
        }

        const uploadData = async (registeredName, path, file) => {
            let postBody = path
            let urlSuffix = ""
            if (file != null) {

                // If we're sending zipped data, make sure to use the /zip version of the POST /arbitrary/* API
                if (this.uploadType === "zip") {
                    urlSuffix = "/zip"
                }
                // If we're sending file data, use the /base64 version of the POST /arbitrary/* API
                else if (this.uploadType === "file") {
                    urlSuffix = "/base64"
                }

                // Base64 encode the file to work around compatibility issues between javascript and java byte arrays
                let fileBuffer = new Uint8Array(await file.arrayBuffer())
                postBody = Buffer.from(fileBuffer).toString('base64');
            }

            let uploadDataUrl = `/arbitrary/${this.service}/${registeredName}${urlSuffix}`
            if (identifier != null && identifier.trim().length > 0) {
                uploadDataUrl = `/arbitrary/${service}/${registeredName}/${this.identifier}${urlSuffix}`
            }

            let uploadDataRes = await parentEpml.request('apiCall', {
                type: 'api',
                method: 'POST',
                url: `${uploadDataUrl}?apiKey=${this.getApiKey()}`,
                body: `${postBody}`,
            })

            return uploadDataRes
        }

        const convertBytesForSigning = async (transactionBytesBase58) => {
            let convertedBytes = await parentEpml.request('apiCall', {
                type: 'api',
                method: 'POST',
                url: `/transactions/convert`,
                body: `${transactionBytesBase58}`,
            })

            return convertedBytes
        }

        const signAndProcess = async (transactionBytesBase58) => {
            let convertedBytesBase58 = await convertBytesForSigning(transactionBytesBase58)
            if (convertedBytesBase58.error) {
                this.errorMessage = "Error: " + convertedBytesBase58.message
                showError(this.errorMessage)
                throw new Error(this.errorMessage);
            }

            const convertedBytes = window.parent.Base58.decode(convertedBytesBase58);
            const _convertedBytesArray = Object.keys(convertedBytes).map(function (key) { return convertedBytes[key]; });
            const convertedBytesArray = new Uint8Array(_convertedBytesArray)
            const convertedBytesHash = new window.parent.Sha256().process(convertedBytesArray).finish().result

            const hashPtr = window.parent.sbrk(32, window.parent.heap);
            const hashAry = new Uint8Array(window.parent.memory.buffer, hashPtr, 32);
            hashAry.set(convertedBytesHash);

            const difficulty = 14;
            const workBufferLength = 8 * 1024 * 1024;
            const workBufferPtr = window.parent.sbrk(workBufferLength, window.parent.heap);

            this.errorMessage = '';
            this.successMessage = '';
            let nonce = window.parent.computePow(hashPtr, workBufferPtr, workBufferLength, difficulty)

            let response = await parentEpml.request('sign_arbitrary', {
                nonce: this.selectedAddress.nonce,
                arbitraryBytesBase58: transactionBytesBase58,
                arbitraryBytesForSigningBase58: convertedBytesBase58,
                arbitraryNonce: nonce
            })

            let myResponse = { error: '' }
            if (response === false) {
                myResponse.error = "Unable to sign and process transaction"
            }
            else {
                myResponse = response
            }

            return myResponse
        }

        validate()
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

    constructor() {
        super()

        this.showName = false;
        this.showService = false
        this.showIdentifier = false

        const urlParams = new URLSearchParams(window.location.search)
        this.name = urlParams.get('name')
        this.service = urlParams.get('service')
        this.identifier = urlParams.get('identifier')
        this.category = urlParams.get('category')
        this.uploadType = urlParams.get('uploadType') !== "null" ? urlParams.get('uploadType') : "file"

        if (urlParams.get('showName') === "true") {
            this.showName = true
        }
        if (urlParams.get('showService') === "true") {
            this.showService = true
        }
        if (urlParams.get('showIdentifier') === "true") {
            this.showIdentifier = true
        }

        if (this.identifier != null) {
            if (this.identifier === "null" || this.identifier.trim().length == 0) {
                this.identifier = null
            }
        }

        // Default to true so the message doesn't appear and disappear quickly
        this.portForwardingEnabled = true
        this.names = []
        this.registeredName = ''
        this.selectedName = 'invalid'
        this.path = ''
        this.successMessage = ''
        this.generalMessage = ''
        this.errorMessage = ''
        this.loading = false
        this.btnDisable = false

        const fetchNames = () => {
            parentEpml.request('apiCall', {
                url: `/names/address/${this.selectedAddress.address}?limit=0&reverse=true`
            }).then(res => {

                setTimeout(() => {
                    this.names = res
                    if (res[0] != null) {
                        this.registeredName = res[0].name;
                    }
                }, 1)
            })
            setTimeout(fetchNames, this.config.user.nodeSettings.pingInterval)
        }

        const fetchPeersSummary = () => {
            parentEpml.request('apiCall', {
                url: `/peers/summary`
            }).then(res => {

                setTimeout(() => {
                    this.portForwardingEnabled = (res.inboundConnections != null && res.inboundConnections > 0);
                }, 1)
            })
            setTimeout(fetchNames, this.config.user.nodeSettings.pingInterval)
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
                    setTimeout(fetchNames, 1)
                    setTimeout(fetchPeersSummary, 1)
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
    }

    selectName(e) {
        const name = this.shadowRoot.getElementById('registeredName').value
        this.selectedName = name
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

window.customElements.define('publish-data', PublishData)
