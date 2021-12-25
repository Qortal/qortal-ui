// import '@webcomponents/webcomponentsjs/webcomponents-loader.js'
// /* Es6 browser but transpi;led code */
// import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'

import { LitElement, html, css } from 'lit-element'
import { Epml } from '../../../epml.js'

import '@material/mwc-icon'
import '@material/mwc-button'
import '@material/mwc-textfield'
import '@material/mwc-dialog'

import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/vaadin-grid/vaadin-grid.js'
import '@vaadin/vaadin-grid/theme/material/all-imports.js'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class NameRegistration extends LitElement {
    static get properties() {
        return {
            loading: { type: Boolean },
            names: { type: Array },
            recipientPublicKey: { type: String },
            selectedAddress: { type: Object },
            btnDisable: { type: Boolean },
            registerNameLoading: { type: Boolean },
            error: { type: Boolean },
            message: { type: String },
            removeError: { type: Boolean },
            removeMessage: { type: String }
        }
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --mdc-theme-secondary: var(--mdc-theme-primary);
                --paper-input-container-focus-color: var(--mdc-theme-primary);
            }
            #name-registration-page {
                background: #fff;
                padding: 12px 24px;
            }

            .divCard {
                border: 1px solid #eee;
                padding: 1em;
                /** box-shadow: 0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 2px 0 rgba(0,0,0,0.20); **/
                box-shadow: 0 .3px 1px 0 rgba(0,0,0,0.14), 0 1px 1px -1px rgba(0,0,0,0.12), 0 1px 2px 0 rgba(0,0,0,0.20);
            }

            h2 {
                margin:0;
            }

            h2, h3, h4, h5 {
                color:#333;
                font-weight: 400;
            }
        `
    }

    constructor() {
        super()
        this.selectedAddress = {}
        this.names = []
        this.recipientPublicKey = ''
        this.btnDisable = false
        this.registerNameLoading = false
    }

    render() {
        return html`
            <div id="name-registration-page">
                <div style="min-height:48px; display: flex; padding-bottom: 6px; margin: 2px;">
                    <h2 style="margin: 0; flex: 1; padding-top: .1em; display: inline;">Name Registration</h2>
                    <mwc-button style="float:right;" @click=${() => this.shadowRoot.querySelector('#registerNameDialog').show()}><mwc-icon>add</mwc-icon>Register Name</mwc-button>
                </div>

                <div class="divCard">
                    <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">Registered Names</h3>
                    <vaadin-grid id="namesGrid" style="height:auto;" ?hidden="${this.isEmptyArray(this.names)}" aria-label="Peers" .items="${this.names}" height-by-rows>
                        <vaadin-grid-column path="name"></vaadin-grid-column>
                        <vaadin-grid-column path="owner"></vaadin-grid-column>
                    </vaadin-grid>
                    ${this.isEmptyArray(this.names) ? html`
                        No names registered by this account!
                    `: ''}
                </div>

                <!-- Register Name Dialog -->
                <mwc-dialog id="registerNameDialog" scrimClickAction="${this.registerNameLoading ? '' : 'close'}">
                    <div>Register a Name!</div>
                    <br>
                    <mwc-textfield style="width:100%;" ?disabled="${this.registerNameLoading}" label="Name" id="nameInput"></mwc-textfield>
                    <p style="margin-bottom:0;">
                        <mwc-textfield style="width:100%;" ?disabled="${this.registerNameLoading}" label="Description (optional)" id="descInput"></mwc-textfield>
                    </p>
                    <div style="text-align:right; height:36px;">
                        <span ?hidden="${!this.registerNameLoading}">
                            <!-- loading message -->
                            Doing something delicious &nbsp;
                            <paper-spinner-lite
                                style="margin-top:12px;"
                                ?active="${this.registerNameLoading}"
                                alt="Registering Name"></paper-spinner-lite>
                        </span>
                        <span ?hidden=${this.message === ''} style="${this.error ? 'color:red;' : ''}">
                            ${this.message}
                        </span>
                    </div>
                    
                    <mwc-button
                        ?disabled="${this.registerNameLoading}"
                        slot="primaryAction"
                        @click=${this.registerName}
                        >
                        Register
                    </mwc-button>
                    <mwc-button
                        ?disabled="${this.registerNameLoading}"
                        slot="secondaryAction"
                        dialogAction="cancel"
                        class="red">
                        Close
                    </mwc-button>
                </mwc-dialog>
            </div>
        `
    }

    // getNamesGrid() {

    //     const myGrid = this.shadowRoot.querySelector('#namesGrid')

    //     myGrid.addEventListener('click', (e) => {
    //         this.tempMintingAccount = myGrid.getEventContext(e).item

    //         this.shadowRoot.querySelector('#removeRewardShareDialog').show()
    //     })

    // }


    firstUpdated() {

        // Call getNamesGrid
        // this.getNamesGrid()

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

        const fetchNames = () => {
            // console.log('=========================================')
            parentEpml.request('apiCall', {
                url: `/names/address/${this.selectedAddress.address}?limit=0&reverse=true`
            }).then(res => {

                setTimeout(() => { this.names = res }, 1)
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

    clearSelection() {

        window.getSelection().removeAllRanges()
        window.parent.getSelection().removeAllRanges()
    }

    async registerName(e) {
        this.error = false
        this.message = ''
        const nameInput = this.shadowRoot.getElementById("nameInput").value
        const descInput = this.shadowRoot.getElementById("descInput").value

        // Check for valid...^
        this.registerNameLoading = true

        // Get Last Ref
        const getLastRef = async () => {
            let myRef = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/lastreference/${this.selectedAddress.address}`
            })
            return myRef
        };

        // Get Account Details
        const validateName = async () => {
            let isValid = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/names/${nameInput}`
            })

            return isValid
        };

        const validateReceiver = async () => {
            let nameInfo = await validateName();
            let lastRef = await getLastRef();

            if (nameInfo.error === 401) {
                this.error = false
                this.message = ''
                let myTransaction = await makeTransactionRequest(lastRef)
                getTxnRequestResponse(myTransaction)
            } else {
                this.error = true
                this.message = `Name Already Exists!`
            }
        }

        // Make Transaction Request
        const makeTransactionRequest = async (lastRef) => {

            let myTxnrequest = await parentEpml.request('transaction', {
                type: 3,
                nonce: this.selectedAddress.nonce,
                params: {
                    name: nameInput,
                    value: descInput,
                    lastReference: lastRef,
                }
            })

            return myTxnrequest
        }

        // FAILED txnResponse = {success: false, message: "User declined transaction"}
        // SUCCESS txnResponse = { success: true, data: true }

        const getTxnRequestResponse = (txnResponse) => {

            if (txnResponse.success === false && txnResponse.message) {
                this.error = true
                this.message = txnResponse.message
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.message = 'Name Registration Successful!'
                this.error = false
            } else {
                this.error = true
                this.message = txnResponse.data.message
                throw new Error(txnResponse)
            }
        }

        validateReceiver()

        this.registerNameLoading = false
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

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }
}

window.customElements.define('name-registration', NameRegistration)
