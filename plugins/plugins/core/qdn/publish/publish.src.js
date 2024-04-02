import {css, html, LitElement} from 'lit'
import {Epml} from '../../../../epml'
import isElectron from 'is-electron'
import {get, registerTranslateConfig, translate, use} from '../../../../../core/translate'
import '@material/mwc-button'
import '@material/mwc-textfield'
import '@material/mwc-select'
import '@material/mwc-dialog'
import '@material/mwc-list/mwc-list-item.js'
import '@polymer/paper-progress/paper-progress.js'
import {modalHelper} from '../../../utils/publish-modal'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

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
            showMetadata: { type: Boolean },
            tags: { type: Array },
            serviceLowercase: { type: String },
            metadata: { type: Array },
            categories: { type: Array },
            names: { type: Array },
            myRegisteredName: { type: String },
            selectedName: { type: String },
            path: { type: String },
            portForwardingEnabled: { type: Boolean },
            amount: { type: Number },
            generalMessage: { type: String },
            successMessage: { type: String },
            errorMessage: { type: String },
            loading: { type: Boolean },
            btnDisable: { type: Boolean },
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
                --mdc-dialog-content-ink-color: var(--black);
                --mdc-theme-surface: var(--white);
                --mdc-dialog-min-width: 400px;
                --mdc-dialog-max-width: 1024px;
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

            input[type=text] {
                padding: 6px 6px 6px 6px;
                color: var(--black);
            }

            input[type=file]::file-selector-button {
                border: 1px solid transparent;
                padding: 6px 6px 6px 6px;
                border-radius: 5px;
                color: #fff;
                background-color: var(--mdc-theme-primary);
                transition: 1s;
            }

            input[type=file]::file-selector-button:hover {
                color: #000;
                background-color: #81ecec;
                border: 1px solid transparent;
            }

            #publishWrapper paper-button {
                float: right;
            }

            #publishWrapper .buttons {
                display: flex;
                justify-content: space-between;
                max-width:100%;
                width:100%;
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
                color: var(--black);
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
                width: 30px;
            }

            .red {
                --mdc-theme-primary: #F44336;
            }

            .green {
                --mdc-theme-primary: #198754;
            }
        `
    }

    constructor() {
        super()

        this.showName = false
        this.showService = false
        this.showIdentifier = false
        this.showMetadata = false

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

	if (urlParams.get('showMetadata') === "true") {
            this.showMetadata = true
        }

        if (this.identifier != null) {
            if (this.identifier === "null" || this.identifier.trim().length == 0) {
                this.identifier = null
            }
        }

        // Default to true so the message doesn't appear and disappear quickly
        this.portForwardingEnabled = true
        this.names = []
        this.myRegisteredName = ''
        this.selectedName = 'invalid'
        this.path = ''
        this.successMessage = ''
        this.generalMessage = ''
        this.errorMessage = ''
        this.loading = false
        this.btnDisable = false
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'

        const fetchNames = () => {
            parentEpml.request('apiCall', {url: `/names/address/${this.selectedAddress.address}?limit=0&reverse=true`}).then(res => {
                setTimeout(() => {
                    this.names = res
                    if (res[0] != null) {
                        this.myRegisteredName = res[0].name
                    }
                }, 1)
            })
            setTimeout(fetchNames, this.config.user.nodeSettings.pingInterval)
        }

        const fetchCategories = () => {
            parentEpml.request('apiCall', {url: `/arbitrary/categories`}).then(res => {
                setTimeout(() => {
                    this.categories = res
                }, 1)
            })
            setTimeout(fetchCategories, this.config.user.nodeSettings.pingInterval)
        }

        const fetchPeersSummary = () => {
            parentEpml.request('apiCall', {url: `/peers/summary`}).then(res => {
                setTimeout(() => {
                    this.portForwardingEnabled = (res.inboundConnections != null && res.inboundConnections > 0)
                }, 1)
            })
            setTimeout(fetchPeersSummary, this.config.user.nodeSettings.pingInterval)
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
                    setTimeout(fetchCategories, 1)
                    setTimeout(fetchPeersSummary, 1)
                    configLoaded = true
                }
                this.config = JSON.parse(c)
            })
        })
    }

    render() {
        return html`
            <div id="publishWrapper" style="width: auto; padding:10px; background: var(--white); height: 100vh;">
                <div class="layout horizontal center" style=" padding:12px 15px;">
                    <div class="address-bar">
                        <mwc-button @click=${() => this.goBack()} class="address-bar-button"><mwc-icon>arrow_back_ios</mwc-icon> ${translate("general.back")}</mwc-button>
                    </div>
                    <paper-card style="width:100%; max-width:740px;">
                        <div style="margin:0; margin-top:20px;">
                            <h3 style="margin:0; padding:8px 0; text-transform: capitalize; color: var(--black);">${translate("publishpage.pchange1")} / ${translate("publishpage.pchange2")} ${this.category}</h3>
                            <p style="font-style: italic; font-size: 14px; color: var(--black);" ?hidden="${this.portForwardingEnabled}">${translate("publishpage.pchange3")}</p><p style="font-style: italic; font-size: 14px; color: var(--black);">(500 KB max.)</p>
                        </div>
                    </paper-card>
                    <!-- TODO: adapt this dropdown to list all names on the account. Right now it's hardcoded to a single name -->
                    <p style="display: ${this.showName ? 'block' : 'none'}">
                        <mwc-select id="registeredName" label="${translate("publishpage.pchange4")}" @selected=${(e) => this.selectName(e)} style="min-width: 130px; max-width:100%; width:100%;">
                            <mwc-list-item selected value=""></mwc-list-item>
                            <mwc-list-item value="${this.myRegisteredName}" style="color: var(--black);">${this.myRegisteredName}</mwc-list-item>
                        </mwc-select>
                    </p>
                    <div style="display: ${this.showMetadata ? 'block' : 'none'}">
                        <p>
                            <mwc-textfield style="width:100%;" label="${translate("publishpage.pchange5")}" id="title" type="text" value="${this.metadata != null && this.metadata.title != null ? this.metadata.title : ''}" maxLength="80"></mwc-textfield><!--charCounter="true"-->
                        </p>
                        <p>
                            <mwc-textfield style="width:100%;" label="${translate("publishpage.pchange6")}" id="description" type="text" value="${this.metadata != null && this.metadata.description != null ? this.metadata.description : ''}" maxLength="500"></mwc-textfield><!--charCounter="true"-->
                        </p>
                        <p>
                            <mwc-select id="category" label="${translate("publishpage.pchange7")}" index="0" style="min-width: 130px; max-width:100%; width:100%;">
                                ${this.categories.map((c, index) => html`
                                    <mwc-list-item style="color:var(--black)" value="${c.id}">${c.name}</mwc-list-item>
                                `)}
                            </mwc-select>
                        </p>
                        <div style="display: flex; justify-content: space-between; max-width:100%; width:100%;">
                            <mwc-textfield style="width:19.6%;" id="tag1" type="text" value="${this.metadata != null && this.metadata.tags != null && this.metadata.tags[0] != null ? this.metadata.tags[0] : ''}" placeholder="${translate("publishpage.pchange8")} 1" maxLength="20"></mwc-textfield>
                            <mwc-textfield style="width:19.6%;" id="tag2" type="text" value="${this.metadata != null && this.metadata.tags != null && this.metadata.tags[1] != null ? this.metadata.tags[1] : ''}" placeholder="${translate("publishpage.pchange8")} 2" maxLength="20"></mwc-textfield>
                            <mwc-textfield style="width:19.6%;" id="tag3" type="text" value="${this.metadata != null && this.metadata.tags != null && this.metadata.tags[2] != null ? this.metadata.tags[2] : ''}" placeholder="${translate("publishpage.pchange8")} 3" maxLength="20"></mwc-textfield>
                            <mwc-textfield style="width:19.6%;" id="tag4" type="text" value="${this.metadata != null && this.metadata.tags != null && this.metadata.tags[3] != null ? this.metadata.tags[3] : ''}" placeholder="${translate("publishpage.pchange8")} 4" maxLength="20"></mwc-textfield>
                            <mwc-textfield style="width:19.6%;" id="tag5" type="text" value="${this.metadata != null && this.metadata.tags != null && this.metadata.tags[4] != null ? this.metadata.tags[4] : ''}" placeholder="${translate("publishpage.pchange8")} 5" maxLength="20"></mwc-textfield>
                        </div>
                    </div>
                    ${this.renderUploadField()}
                    <p style="display: ${this.showService ? 'block' : 'none'}">
                        <mwc-textfield style="width:100%;" label="${translate("publishpage.pchange9")}" id="service" type="text" value="${this.service}"></mwc-textfield>
                    </p>
                    <p style="display: ${this.showIdentifier ? 'block' : 'none'}">
                        <mwc-textfield style="width:100%;" label="${translate("publishpage.pchange10")}" id="identifier" type="text" value="${this.identifier != null ? this.identifier : ''}"></mwc-textfield>
                    </p>
                    <p style="break-word; color: var(--black);">${this.generalMessage}</p>
                    <p style="color:red">${this.errorMessage}</p>
                    <p style="color: green; word-break: break-word;">${this.successMessage}</p>
                    ${this.loading ? html` <paper-progress indeterminate style="width:100%; margin:4px;"></paper-progress> ` : ''}
                    <div class="buttons">
                            <mwc-button ?disabled=${this.btnDisable} style="width:49%;" raised icon="science" @click=${(e) => {
                                this.doPublish(e, true, false)}
                            }> ${translate("appspage.schange40")}</mwc-button>
                            <mwc-button ?disabled=${this.btnDisable} style="width:49%;" raised icon="send" @click=${(e) => {
                                this.doPublish(e, false, true)
                            }}> ${translate("publishpage.pchange11")}</mwc-button>
                    </div>
                </div>
            </div>
            <!-- Publish With Fee Dialog -->
            <mwc-dialog id="publishWithFeeDialog" scrimClickAction="" escapeKeyAction="">
                 <div style="text-align: center;">${translate("browserpage.bchange36")}<br>${translate("browserpage.bchange29")}</div>
                 <mwc-button slot="primaryAction" @click="${(e) => this.feeDialogNo(e, false, false)}" class="red">
                     ${translate("general.no")}
                 </mwc-button>
                 <mwc-button slot="secondaryAction" @click="${(e) => this.feeDialogYes(e, false, true)}" class="green">
                     ${translate("general.yes")}
                 </mwc-button>
            </mwc-dialog>
        `
    }

    firstUpdated() {
        this.changeTheme()
        this.changeLanguage()

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

    // Navigation
    goBack() {
        window.history.back()
    }


    renderUploadField() {
        if (this.uploadType === "file") {
            return html`
                <p>
                    <input style="width: 100%; background: var(--white); color: var(--black)" id="file" type="file">
                </p>
            `
        }
        else if (this.uploadType === "zip") {
            return html`
                <p>
                    <span class="upload-text">${translate("publishpage.pchange12")}:</span><br />
                    <input style="color: var(--black)" id="file" type="file" accept=".zip">
                </p>
            `
        }
        else {
            return html`
                <p>
                    <mwc-textfield style="width:100%;" label="${translate("publishpage.pchange13")}" id="path" type="text" value="${this.path}"></mwc-textfield>
                </p>
            `
        }
    }

    feeDialogYes(e, preview, fee) {
        this.doPublish(e, preview, fee)
        this.shadowRoot.querySelector('#publishWithFeeDialog').close()
    }

    feeDialogNo(e, preview, fee) {
        this.doPublish(e, preview, fee)
        this.shadowRoot.querySelector('#publishWithFeeDialog').close()
    }

    async doPublish(e, preview, fee) {
        let registeredName = this.shadowRoot.getElementById('registeredName').value
        let service = this.shadowRoot.getElementById('service').value
        let identifier = this.shadowRoot.getElementById('identifier').value

        // If name is hidden, use the value passed in via the name parameter
        if (!this.showName) {
            registeredName = this.name
        }

        let file
        let path

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
            let err1string = get("publishpage.pchange14")
            parentEpml.request('showSnackBar', `${err1string}`)
        }
        else if (this.uploadType === "file" && file == null) {
            let err2string = get("publishpage.pchange15")
            parentEpml.request('showSnackBar', `${err2string}`)
        }
        else if (this.uploadType === "zip" && file == null) {
            let err3string = get("publishpage.pchange16")
            parentEpml.request('showSnackBar', `${err3string}`)
        }
        else if (this.uploadType === "path" && path === '') {
            let err4string = get("publishpage.pchange17")
            parentEpml.request('showSnackBar', `${err4string}`)
        }
        else if (service === '') {
            let err5string = get("publishpage.pchange18")
            parentEpml.request('showSnackBar', `${err5string}`)
        }
        else {
            try {
                if(!preview){
                    const arbitraryFeeData = await modalHelper.getArbitraryFee()
                    const res = await modalHelper.showModalAndWaitPublish(
                        {
                            feeAmount: arbitraryFeeData.feeToShow
                        }
                    );
                    if (res.action !== 'accept') throw new Error('User declined publish')
                }

                await this.publishData(registeredName, path, file, service, identifier, preview, fee)
            } catch (error) {
                this.shadowRoot.querySelector('#publishWithFeeDialog').close()
            }

        }
    }

    async publishData(registeredName, path, file, service, identifier, preview, fee) {
        this.loading = true
        this.btnDisable = true

        const validateName = async (receiverName) => {
			return await parentEpml.request('apiCall', {
				type: 'api',
				url: `/names/${receiverName}`,
			})
        }

        const showError = async (errorMessage) => {
            this.loading = false
            this.btnDisable = false
            this.generalMessage = ''
            this.successMessage = ''
            console.error(errorMessage)
        }
        const getArbitraryFee = async () => {
            const timestamp = Date.now()
            let fee = await parentEpml.request('apiCall', {
                url: `/transactions/unitfee?txType=ARBITRARY&timestamp=${timestamp}`
            })
            return {
                timestamp,
                fee : Number(fee),
			feeToShow: (Number(fee) / 1e8).toFixed(8)
            }
        }

        const validate = async () => {
            let validNameRes = await validateName(registeredName)
            if (validNameRes.error) {
                this.errorMessage = "Error: " + validNameRes.message
                await showError(this.errorMessage)
                throw new Error(this.errorMessage)
            }

            let err6string = get("publishpage.pchange19")
            this.generalMessage = `${err6string}`
            let transactionBytes
            let previewUrlPath
            let feeAmount = null

            if(fee){
                const res = await getArbitraryFee()
                if(res.fee){
                    feeAmount= res.fee
                } else {
                    throw new Error('unable to get fee')
                }
            }
            let uploadDataRes = await uploadData(registeredName, path, file, preview, fee, feeAmount)

            if (uploadDataRes.error) {
                let err7string = get("publishpage.pchange20")
                this.errorMessage = `${err7string}` + uploadDataRes.message
                await showError(this.errorMessage)
                throw new Error(this.errorMessage)
            }
            else if (uploadDataRes.includes("Error 500 Internal Server Error")) {
                let err8string = get("publishpage.pchange21")
                this.errorMessage = `${err8string}`
                await showError(this.errorMessage)
                throw new Error(this.errorMessage)
            }

            if (preview) {
                // uploadData() returns preview URL path when in preview mode
                previewUrlPath = uploadDataRes
                window.location = `../browser/index.html?service=${this.service}&name=Preview&preview=${previewUrlPath}`
                return
            }
            else {
                // uploadData() returns transaction bytes when not in preview mode
                transactionBytes = uploadDataRes
            }

            if (fee) {
                let err9string = get("publishpage.pchange26")
                this.generalMessage = `${err9string}`

            } else {
                let err9string = get("publishpage.pchange22")
                this.generalMessage = `${err9string}`
            }

            let signAndProcessRes = await signAndProcess(transactionBytes, fee, feeAmount)

            if (signAndProcessRes.error) {
                let err10string = get("publishpage.pchange20")
                this.errorMessage = `${err10string}` + signAndProcessRes.message
                await showError(this.errorMessage)
                throw new Error(this.errorMessage)
            }

            let err11string = get("publishpage.pchange23")

            this.btnDisable = false
            this.loading = false
            this.errorMessage = ''
            this.generalMessage = ''
            this.successMessage = `${err11string}`
        }



        const uploadData = async (registeredName, path, file, preview, fee, feeAmount) => {
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
                postBody = Buffer.from(fileBuffer).toString('base64')
            }

            // Optional metadata
            let title = encodeURIComponent(this.shadowRoot.getElementById('title').value)
            let description = encodeURIComponent(this.shadowRoot.getElementById('description').value)
            let category = encodeURIComponent(this.shadowRoot.getElementById('category').value)
            let tag1 = encodeURIComponent(this.shadowRoot.getElementById('tag1').value)
            let tag2 = encodeURIComponent(this.shadowRoot.getElementById('tag2').value)
            let tag3 = encodeURIComponent(this.shadowRoot.getElementById('tag3').value)
            let tag4 = encodeURIComponent(this.shadowRoot.getElementById('tag4').value)
            let tag5 = encodeURIComponent(this.shadowRoot.getElementById('tag5').value)

            let metadataQueryString = `title=${title}&description=${description}&category=${category}&tags=${tag1}&tags=${tag2}&tags=${tag3}&tags=${tag4}&tags=${tag5}`
            let uploadDataUrl = ``

            if (preview) {
                uploadDataUrl = `/arbitrary/${this.service}/${registeredName}${urlSuffix}?${metadataQueryString}&apiKey=${this.getApiKey()}&preview=${new Boolean(preview).toString()}`
                if (identifier != null && identifier.trim().length > 0) {
                    uploadDataUrl = `/arbitrary/${service}/${registeredName}/${this.identifier}${urlSuffix}?${metadataQueryString}&apiKey=${this.getApiKey()}&preview=${new Boolean(preview).toString()}`
                }
            } else if (fee) {
                uploadDataUrl = `/arbitrary/${this.service}/${registeredName}${urlSuffix}?${metadataQueryString}&fee=${feeAmount}&apiKey=${this.getApiKey()}`
                if (identifier != null && identifier.trim().length > 0) {
                    uploadDataUrl = `/arbitrary/${service}/${registeredName}/${this.identifier}${urlSuffix}?${metadataQueryString}&fee=${feeAmount}&apiKey=${this.getApiKey()}`
                }
            } else {
                uploadDataUrl = `/arbitrary/${this.service}/${registeredName}${urlSuffix}?${metadataQueryString}&apiKey=${this.getApiKey()}`
                if (identifier != null && identifier.trim().length > 0) {
                    uploadDataUrl = `/arbitrary/${service}/${registeredName}/${this.identifier}${urlSuffix}?${metadataQueryString}&apiKey=${this.getApiKey()}`
                }
            }

			return await parentEpml.request('apiCall', {
				type: 'api',
				method: 'POST',
				url: `${uploadDataUrl}`,
				body: `${postBody}`,
			})
        }

        const convertBytesForSigning = async (transactionBytesBase58) => {
			return await parentEpml.request('apiCall', {
				type: 'api',
				method: 'POST',
				url: `/transactions/convert`,
				body: `${transactionBytesBase58}`,
			})
        }

        const signAndProcess = async (transactionBytesBase58, fee) => {
            let convertedBytesBase58 = await convertBytesForSigning(transactionBytesBase58)
            if (convertedBytesBase58.error) {
                let err12string = get("publishpage.pchange20")
                this.errorMessage = `${err12string}` + convertedBytesBase58.message
                await showError(this.errorMessage)
                throw new Error(this.errorMessage)
            }

            const convertedBytes = window.parent.Base58.decode(convertedBytesBase58)
            const _convertedBytesArray = Object.keys(convertedBytes).map(function (key) { return convertedBytes[key] })
            const convertedBytesArray = new Uint8Array(_convertedBytesArray)
            const convertedBytesHash = new window.parent.Sha256().process(convertedBytesArray).finish().result

            const hashPtr = window.parent.sbrk(32, window.parent.heap)
            const hashAry = new Uint8Array(window.parent.memory.buffer, hashPtr, 32)
            hashAry.set(convertedBytesHash)

            const difficulty = 14
            const workBufferLength = 8 * 1024 * 1024
            const workBufferPtr = window.parent.sbrk(workBufferLength, window.parent.heap)

            this.errorMessage = ''
            this.successMessage = ''
            let response = false

            if (fee) {
                response = await parentEpml.request('sign_arbitrary_with_fee', {
                    nonce: this.selectedAddress.nonce,
                    arbitraryBytesBase58: transactionBytesBase58,
                    arbitraryBytesForSigningBase58: convertedBytesBase58
                })
            } else {
                const nonce = window.parent.computePow(hashPtr, workBufferPtr, workBufferLength, difficulty)

                response = await parentEpml.request('sign_arbitrary', {
                    nonce: this.selectedAddress.nonce,
                    arbitraryBytesBase58: transactionBytesBase58,
                    arbitraryBytesForSigningBase58: convertedBytesBase58,
                    arbitraryNonce: nonce
                })
            }

            let myResponse = { error: '' }
            if (response === false) {
                let err13string = get("publishpage.pchange24")
                myResponse.error = `${err13string}`
            }
            else {
                myResponse = response
            }
            return myResponse
        }
        await validate()
    }

    fetchResourceMetadata() {
        let identifier = this.identifier != null ? this.identifier : "default"

        parentEpml.request('apiCall', {
            url: `/arbitrary/metadata/${this.service}/${this.name}/${identifier}?apiKey=${this.getApiKey()}`
        }).then(res => {

            setTimeout(() => {
                this.metadata = res
                if (this.metadata != null && this.metadata.category != null) {
                    this.shadowRoot.getElementById('category').value = this.metadata.category
                }
                else {
                    this.shadowRoot.getElementById('category').value = ""
                }
            }, 1)
        })
    }

    selectName(e) {
        let name = this.shadowRoot.getElementById('registeredName')
        this.selectedName = (name.value)
        // Update the current name if one has been selected
        if (name.value.length > 0) {
            this.name = (name.value)
        }
        this.fetchResourceMetadata()
    }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.apiKey
    }
}

window.customElements.define('publish-data', PublishData)
