import { LitElement, html, css } from 'lit-element'
import { render } from 'lit-html'
import { Epml } from '../../../epml.js'

import '@material/mwc-icon'
import '@material/mwc-button'
import '@material/mwc-textfield'
import '@material/mwc-dialog'
import '@material/mwc-slider'

import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/vaadin-grid/vaadin-grid.js'
import '@vaadin/vaadin-grid/theme/material/all-imports.js'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class RewardShare extends LitElement {
    static get properties() {
        return {
            loading: { type: Boolean },
            rewardShares: { type: Array },
            recipientPublicKey: { type: String },
            selectedAddress: { type: Object },
            btnDisable: { type: Boolean },
            createRewardShareLoading: { type: Boolean },
            removeRewardShareLoading: { type: Boolean },
            rewardSharePercentage: { type: Number },
            error: { type: Boolean },
            message: { type: String }
        }
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --mdc-theme-secondary: var(--mdc-theme-primary);
                --paper-input-container-focus-color: var(--mdc-theme-primary);
            }
            #reward-share-page {
                background: #fff;
                padding: 12px 24px;
            }

            h2 {
                margin:0;
            }

            h2, h3, h4, h5 {
                color:#333;
                font-weight: 400;
            }

            .red {
                --mdc-theme-primary: #F44336;
            }
        `
    }

    constructor() {
        super()
        this.selectedAddress = {}
        this.rewardShares = []
        this.recipientPublicKey = ''
        this.rewardSharePercentage = 0
        this.btnDisable = false
        this.createRewardShareLoading = false
        this.removeRewardShareLoading = false
    }

    render() {
        return html`
            <div id="reward-share-page">
                <div style="min-height:48px; display: flex; padding-bottom: 6px;">
                    <h3 style="margin: 0; flex: 1; padding-top: 8px; display: inline;">Rewardshares involving this account</h3>
                    <mwc-button style="float:right;" @click=${() => this.shadowRoot.querySelector('#createRewardShareDialog').show()}><mwc-icon>add</mwc-icon>Create reward share</mwc-button>
                </div>

                <vaadin-grid id="accountRewardSharesGrid" style="height:auto;" ?hidden="${this.isEmptyArray(this.rewardShares)}" .items="${this.rewardShares}" height-by-rows>
                    <vaadin-grid-column auto-width path="mintingAccount"></vaadin-grid-column>
                    <vaadin-grid-column auto-width path="sharePercent"></vaadin-grid-column>
                    <vaadin-grid-column auto-width path="recipient"></vaadin-grid-column>
                    <vaadin-grid-column width="12em" header="Action" .renderer=${(root, column, data) => {
                render(html`${this.renderRemoveRewardShareButton(data.item)}`, root)
            }}></vaadin-grid-column>
                </vaadin-grid>

                <mwc-dialog id="createRewardShareDialog" scrimClickAction="${this.createRewardShareLoading ? '' : 'close'}">
                    <div>Level 1 - 4 can create a Self Share and Level 5 or above can create a Reward Share!</div>
                    <br>
                    <mwc-textfield style="width:100%;" ?disabled="${this.createRewardShareLoading}" label="Recipient Public Key" id="recipientPublicKey"></mwc-textfield>
                    <p style="margin-bottom:0;">
                        Reward share percentage: ${this.rewardSharePercentage}
                        <!-- <mwc-textfield style="width:36px;" ?disabled="${this.createRewardShareLoading}" id="createRewardShare"></mwc-textfield> -->
                    </p>
                    <mwc-slider
                        @change="${e => this.rewardSharePercentage = this.shadowRoot.getElementById('rewardSharePercentageSlider').value}"
                        id="rewardSharePercentageSlider"
                        style="width:100%;"
                        step="1"
                        pin
                        markers
                        max="100"
                        value="${this.rewardSharePercentage}">
                    </mwc-slider>
                    <div style="text-align:right; height:36px;">
                        <span ?hidden="${!this.createRewardShareLoading}">
                            <!-- loading message -->
                            Doing something delicious &nbsp;
                            <paper-spinner-lite
                                style="margin-top:12px;"
                                ?active="${this.createRewardShareLoading}"
                                alt="Adding minting account"></paper-spinner-lite>
                        </span>
                        <span ?hidden=${this.message === ''} style="${this.error ? 'color:red;' : ''}">
                            ${this.message}
                        </span>
                    </div>
                    
                    <mwc-button
                        ?disabled="${this.createRewardShareLoading}"
                        slot="primaryAction"
                        @click=${this.createRewardShare}
                        >
                        <!--dialogAction="add"-->
                        Add
                    </mwc-button>
                    <mwc-button
                        ?disabled="${this.createRewardShareLoading}"
                        slot="secondaryAction"
                        dialogAction="cancel"
                        class="red">
                        Close
                    </mwc-button>
                </mwc-dialog>

                ${this.isEmptyArray(this.rewardShares) ? html`
                    Account is not involved in any reward shares
                `: ''}
            </div>
        `
    }

    renderRemoveRewardShareButton(rewardShareObject) {

        if (rewardShareObject.mintingAccount === this.selectedAddress.address) {

            return html`<mwc-button class="red" ?disabled=${this.removeRewardShareLoading} @click=${() => this.removeRewardShare(rewardShareObject)}><mwc-icon>create</mwc-icon>Remove</mwc-button>`
        } else {
            return ""
        }
    }

    firstUpdated() {

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

        const textBox = this.shadowRoot.getElementById("recipientPublicKey")

        const updateRewardshares = () => {

            parentEpml.request('apiCall', {
                url: `/addresses/rewardshares?involving=${this.selectedAddress.address}`
            }).then(res => {
                setTimeout(() => { this.rewardShares = res }, 1)
            })
            setTimeout(updateRewardshares, this.config.user.nodeSettings.pingInterval)
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
                    setTimeout(updateRewardshares, 1)
                    configLoaded = true
                }
                this.config = JSON.parse(c)
            })
            parentEpml.subscribe('copy_menu_switch', async value => {

                if (value === 'false' && window.getSelection().toString().length !== 0) {

                    this.clearSelection()
                }
            })
            parentEpml.subscribe('frame_paste_menu_switch', async res => {

                res = JSON.parse(res)
                if (res.isOpen === false && this.isPasteMenuOpen === true) {

                    this.pasteToTextBox(textBox)
                    this.isPasteMenuOpen = false
                }
            })
        })

        parentEpml.imReady()

        textBox.addEventListener('contextmenu', (event) => {

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
                    // ...
                } else {

                    this.pasteMenu(event)
                    this.isPasteMenuOpen = true

                    // Prevent Default and Stop Event Bubbling
                    event.preventDefault()
                    event.stopPropagation()

                }
            }

            checkSelectedTextAndShowMenu()

        })
    }

    async createRewardShare(e) {

        this.error = false
        this.message = ''
        const recipientPublicKey = this.shadowRoot.getElementById("recipientPublicKey").value
        const percentageShare = this.shadowRoot.getElementById("rewardSharePercentageSlider").value

        // Check for valid...^
        this.createRewardShareLoading = true

        let recipientAddress = window.parent.base58PublicKeyToAddress(recipientPublicKey)

        // Get Last Ref
        const getLastRef = async () => {

            let myRef = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/lastreference/${this.selectedAddress.address}`
            })
            return myRef
        };

        // Get Account Details
        const getAccountDetails = async () => {

            let myAccountDetails = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/${this.selectedAddress.address}`
            })
            return myAccountDetails
        };

        // Get Reward Relationship if it already exists
        const getRewardShareRelationship = async (minterAddr) => {

            let isRewardShareExisting = false
            let myRewardShareArray = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/rewardshares?minters=${minterAddr}&recipients=${recipientAddress}`
            })

            isRewardShareExisting = myRewardShareArray.length !== 0 ? true : false
            return isRewardShareExisting

            // THOUGHTS: At this point, I think I dont wanna further do any check...
            // myRewardShareArray.forEach(rewsh => {
            //     if (rewsh.mintingAccount) {

            //     }
            // })
        }

        // Validate Reward Share by Level
        const validateReceiver = async () => {

            let accountDetails = await getAccountDetails();
            let lastRef = await getLastRef();
            let isExisting = await getRewardShareRelationship(this.selectedAddress.address)

            // Check for creating self share at different levels (also adding check for flags...)
            if (accountDetails.flags === 1) {
                this.error = false
                this.message = ''
                let myTransaction = await makeTransactionRequest(lastRef)
                if (isExisting === true) {

                    this.error = true
                    this.message = `Cannot Create Multiple Reward Shares!`
                } else {
                    // Send the transaction for confirmation by the user
                    this.error = false
                    this.message = ''
                    getTxnRequestResponse(myTransaction)
                }
            } else if (accountDetails.address === recipientAddress) {

                if (accountDetails.level >= 1 && accountDetails.level <= 4) {

                    this.error = false
                    this.message = ''
                    let myTransaction = await makeTransactionRequest(lastRef)
                    if (isExisting === true) {

                        this.error = true
                        this.message = `Cannot Create Multiple Self Shares!`
                    } else {
                        // Send the transaction for confirmation by the user
                        this.error = false
                        this.message = ''
                        getTxnRequestResponse(myTransaction)
                    }
                } else if (accountDetails.level >= 5) {

                    this.error = false
                    this.message = ''
                    let myTransaction = await makeTransactionRequest(lastRef)
                    if (isExisting === true) {

                        this.error = true
                        this.message = `Cannot Create Multiple Self Shares!`
                    } else {
                        // Send the transaction for confirmation by the user
                        this.error = false
                        this.message = ''
                        getTxnRequestResponse(myTransaction)
                    }
                } else {
                    this.error = true
                    this.message = `CANNOT CREATE SELF SHARE! at level ${accountDetails.level}`
                }
            } else { //Check for creating reward shares

                if (accountDetails.level >= 5) {

                    this.error = false
                    this.message = ''
                    let myTransaction = await makeTransactionRequest(lastRef)
                    if (isExisting === true) {

                        this.error = true
                        this.message = `Cannot Create Multiple Reward Shares!`
                    } else {
                        // Send the transaction for confirmation by the user
                        this.error = false
                        this.message = ''
                        getTxnRequestResponse(myTransaction)
                    }
                } else {

                    this.error = true
                    this.message = `CANNOT CREATE REWARD SHARE! at level ${accountDetails.level}`
                }
            }
        }

        // Make Transaction Request
        const makeTransactionRequest = async (lastRef) => {

            let mylastRef = lastRef

            let myTxnrequest = await parentEpml.request('transaction', {
                type: 38,
                nonce: this.selectedAddress.nonce,
                params: {
                    recipientPublicKey,
                    percentageShare,
                    lastReference: mylastRef,
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
                this.message = 'Reward Share Successful!'
                this.error = false
            } else {
                this.error = true
                this.message = txnResponse.data.message
                throw new Error(txnResponse)
            }
        }

        validateReceiver()

        this.createRewardShareLoading = false
    }

    async removeRewardShare(rewardShareObject) {

        const myPercentageShare = -1

        // Check for valid...^
        this.removeRewardShareLoading = true

        // Get Last Ref
        const getLastRef = async () => {

            let myRef = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/lastreference/${this.selectedAddress.address}`
            })
            return myRef
        };

        // Remove Reward Share
        const removeReceiver = async () => {

            let lastRef = await getLastRef();

            let myTransaction = await makeTransactionRequest(lastRef)
            getTxnRequestResponse(myTransaction)

        }

        // Make Transaction Request
        const makeTransactionRequest = async (lastRef) => {

            let mylastRef = lastRef

            let myTxnrequest = await parentEpml.request('transaction', {
                type: 381,
                nonce: this.selectedAddress.nonce,
                params: {
                    rewardShareKeyPairPublicKey: rewardShareObject.rewardSharePublicKey,
                    recipient: rewardShareObject.recipient,
                    percentageShare: myPercentageShare,
                    lastReference: mylastRef,
                }
            })

            return myTxnrequest
        }

        // FAILED txnResponse = {success: false, message: "User declined transaction"}
        // SUCCESS txnResponse = { success: true, data: true }

        const getTxnRequestResponse = (txnResponse) => {

            if (txnResponse.success === false && txnResponse.message) {

                this.removeRewardShareLoading = false
                parentEpml.request('showSnackBar', txnResponse.message)
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {

                this.removeRewardShareLoading = false
                parentEpml.request('showSnackBar', 'Reward Share Removed Successfully!')
            } else {

                this.removeRewardShareLoading = false
                parentEpml.request('showSnackBar', txnResponse.data.message)
                throw new Error(txnResponse)
            }
        }

        removeReceiver()

    }

    pasteToTextBox(textBox) {

        // Return focus to the window
        window.focus()

        navigator.clipboard.readText().then(clipboardText => {

            textBox.value += clipboardText
            textBox.focus()
        });
    }

    pasteMenu(event) {

        let eventObject = { pageX: event.pageX, pageY: event.pageY, clientX: event.clientX, clientY: event.clientY }
        parentEpml.request('openFramePasteMenu', eventObject)
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

    clearSelection() {

        window.getSelection().removeAllRanges()
        window.parent.getSelection().removeAllRanges()
    }
}

window.customElements.define('reward-share', RewardShare)
