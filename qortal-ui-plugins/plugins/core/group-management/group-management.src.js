
import { LitElement, html, css } from 'lit-element'
import { render } from 'lit-html'
import { Epml } from '../../../epml.js'

import '@material/mwc-icon'
import '@material/mwc-button'
import '@material/mwc-textfield'
import '@material/mwc-dialog'

import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/vaadin-grid/vaadin-grid.js'
import '@vaadin/vaadin-grid/theme/material/all-imports.js'

import '@github/time-elements'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class GroupManagement extends LitElement {
    static get properties() {
        return {
            loading: { type: Boolean },
            publicGroups: { type: Array },
            joinedGroups: { type: Array },
            recipientPublicKey: { type: String },
            selectedAddress: { type: Object },
            manageGroupObj: { type: Object },
            joinGroupObj: { type: Object },
            leaveGroupObj: { type: Object },
            btnDisable: { type: Boolean },
            isLoading: { type: Boolean },
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
                --paper-input-container-focus-color: var(--mdc-theme-primary);
            }
            #group-management-page {
                background: #fff;
                padding: 12px 24px;
            }

            mwc-textfield { 
                width:100%;
            }

            .red {
                --mdc-theme-primary: red;
            }

            .red-button {
                --mdc-theme-primary: red;
                --mdc-theme-on-primary: white;
            }

            mwc-button.red-button {
                --mdc-theme-primary: red;
                --mdc-theme-on-primary: white;
            }

            .divCard {
                border: 1px solid #eee;
                padding: 1em;
                /** box-shadow: 0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 2px 0 rgba(0,0,0,0.20); **/
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
            /* .itemList > * {
                padding-left:24px;
                padding-right:24px;
            } */
        `
    }

    constructor() {
        super()
        this.selectedAddress = {}
        this.publicGroups = []
        this.joinedGroups = []
        this.manageGroupObj = {}
        this.joinGroupObj = {}
        this.leaveGroupObj = {}
        this.recipientPublicKey = ''
        this.btnDisable = false
        this.isLoading = false
    }

    render() {
        return html`
            <div id="group-management-page">
                <div style="min-height:48px; display: flex; padding-bottom: 6px; margin: 2px;">
                    <h2 style="margin: 0; flex: 1; padding-top: .1em; display: inline;">Qortal Groups</h2>
                    <mwc-button style="float:right;" @click=${() => this.shadowRoot.querySelector('#createGroupDialog').show()}><mwc-icon>add</mwc-icon>Create Group</mwc-button>
                </div>

                <div class="divCard">
                    <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">Public Groups</h3>
                    <vaadin-grid id="publicGroupsGrid" style="height:auto;" ?hidden="${this.isEmptyArray(this.publicGroups)}" aria-label="Public Open Groups" .items="${this.publicGroups}" height-by-rows>
                        <vaadin-grid-column path="groupName"></vaadin-grid-column>
                        <vaadin-grid-column header="Description" path="description"></vaadin-grid-column>
                        <vaadin-grid-column path="owner"></vaadin-grid-column>
                        <vaadin-grid-column width="9.8rem" flex-grow="0" header="Action" .renderer=${(root, column, data) => {
                render(html`<mwc-button @click=${() => this.joinGroup(data.item)}><mwc-icon>queue</mwc-icon>Join</mwc-button>`, root)
            }}></vaadin-grid-column>
                    </vaadin-grid>
                    </vaadin-grid>
                    ${this.isEmptyArray(this.publicGroups) ? html`
                        No Open Public Groups available!
                    `: ''}
                </div>

                <div class="divCard">
                    <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">Your Joined Groups</h3>
                    <vaadin-grid id="joinedGroupsGrid" style="height:auto;" ?hidden="${this.isEmptyArray(this.joinedGroups)}" aria-label="Joined Groups" .items="${this.joinedGroups}" height-by-rows>
                        <vaadin-grid-column header="Name" path="groupName"></vaadin-grid-column>
                        <vaadin-grid-column header="Description" path="description"></vaadin-grid-column>
                        <vaadin-grid-column width="9.8rem" flex-grow="0" header="Role" .renderer=${(root, column, data) => {
                render(html`${this.renderRole(data.item)}`, root)
            }}></vaadin-grid-column>
                        <vaadin-grid-column width="9.8rem" flex-grow="0" header="Action" .renderer=${(root, column, data) => {
                render(html`${this.renderManageButton(data.item)}`, root)
            }}></vaadin-grid-column>
                    </vaadin-grid>
                    ${this.isEmptyArray(this.joinedGroups) ? html`
                        Not a member of any groups!
                    `: ''}
                </div>

                <!-- Create Group Dialog -->
                <mwc-dialog id="createGroupDialog" scrimClickAction="${this.isLoading ? '' : 'close'}">
                    <div style="text-align:center">
                        <h1>Create a New Group</h1>
                        <hr>
                    </div>
                    
                    <mwc-textfield style="width:100%;" ?disabled="${this.isLoading}" label="Group Name" id="groupNameInput"></mwc-textfield>
                    <p style="margin-bottom:0;">
                        <mwc-textfield style="width:100%;" ?disabled="${this.isLoading}" label="Description" id="groupDescInput"></mwc-textfield>
                    </p>
                    <p>
                        Group Type:
                        <select required validationMessage="This Field is Required" id="groupTypeInput" label="Group Type">
                            <option value="reject" selected>Select an option</option>
                            <option value="1">Public</option>
                            <option value="0">Private</option>
                        </select>
                    </p>
                    <p>
                        Group Approval Threshold (number / percentage of Admins that must approve a transaction):
                        <select required validationMessage="This Field is Required" id="groupApprovalInput" label="Group Type">
                            <option value="reject" selected>Select an option</option>
                            <option value="0">NONE</option>
                            <option value="1">ONE</option>
                            <option value="20">20%</option>
                            <option value="40">40%</option>
                            <option value="60">60%</option>
                            <option value="80">80%</option>
                            <option value="100">100%</option>
                        </select>
                    </p>
                    <p>
                        Minimum Block delay for Group Transaction Approvals:
                        <select required validationMessage="This Field is Required" id="groupMinDelayInput" label="Group Type">
                            <option value="reject" selected>Select an option</option>
                            <option value="5">5 minutes</option>
                            <option value="10">10 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="180">3 hours</option>
                            <option value="300">5 hours</option>
                            <option value="420">7 hours</option>
                            <option value="720">12 hours</option>
                            <option value="1440">1 day</option>
                            <option value="4320">3 days</option>
                            <option value="7200">5 days</option>
                            <option value="10080">7 days</option>
                        </select>
                    </p>
                    <p>
                        Maximum Block delay for Group Transaction Approvals:
                        <select required validationMessage="This Field is Required" id="groupMaxDelayInput" label="Group Type">
                            <option value="reject" selected>Select an option</option>
                            <option value="60">1 hour</option>
                            <option value="180">3 hours</option>
                            <option value="300">5 hours</option>
                            <option value="420">7 hours</option>
                            <option value="720">12 hours</option>
                            <option value="1440">1 day</option>
                            <option value="4320">3 days</option>
                            <option value="7200">5 days</option>
                            <option value="10080">7 days</option>
                            <option value="14400">10 days</option>
                            <option value="21600">15 days</option>
                        </select>
                    </p>
                    <div style="text-align:right; height:36px;">
                        <span ?hidden="${!this.isLoading}">
                            <!-- loading message -->
                            Creating Group &nbsp;
                            <paper-spinner-lite
                                style="margin-top:12px;"
                                ?active="${this.isLoading}"
                                alt="Creating Group"></paper-spinner-lite>
                        </span>
                        <span ?hidden=${this.message === ''} style="${this.error ? 'color:red;' : ''}">
                            ${this.message}
                        </span>
                    </div>
                    
                    <mwc-button
                        ?disabled="${this.isLoading}"
                        slot="primaryAction"
                        @click=${this.createGroup}
                        >
                        Create
                    </mwc-button>
                    <mwc-button
                        ?disabled="${this.isLoading}"
                        slot="secondaryAction"
                        dialogAction="cancel"
                        class="red">
                        Close
                    </mwc-button>
                </mwc-dialog>

                <!-- Join Group Dialog -->
                <mwc-dialog id="joinDialog" scrimClickAction="${this.isLoading ? '' : 'close'}">
                    <div style="text-align:center">
                        <h1>Join Group Request</h1>
                        <hr>
                    </div>
                    
                    <div class="itemList">
                        <span class="title">Group Name</span>
                        <br>
                        <div><span>${this.joinGroupObj.groupName}</span></div>

                        <span class="title">Description</span>
                        <br>
                        <div><span>${this.joinGroupObj.description}</span></div>

                        <span class="title">Owner</span>
                        <br>
                        <div><span>${this.joinGroupObj.owner}</span></div>

                        <span class="title">Date Created</span>
                        <br>
                        <div><span><time-ago datetime=${this.timeIsoString(this.joinGroupObj.created)}></time-ago></span></div>

                        ${!this.joinGroupObj.updated ? "" : html`<span class="title">Date Updated</span>
                        <br>
                        <div><span><time-ago datetime=${this.timeIsoString(this.joinGroupObj.updated)}></time-ago></span></div>`}
                    </div>

                    <div style="text-align:right; height:36px;">
                        <span ?hidden="${!this.isLoading}">
                            <!-- loading message -->
                            Joining &nbsp;
                            <paper-spinner-lite
                                style="margin-top:12px;"
                                ?active="${this.isLoading}"
                                alt="Joining"></paper-spinner-lite>
                        </span>
                        <span ?hidden=${this.message === ''} style="${this.error ? 'color:red;' : ''}">
                            ${this.message}
                        </span>
                    </div>
                    
                    <mwc-button
                        ?disabled="${this.isLoading}"
                        slot="primaryAction"
                        @click=${() => this._joinGroup(this.joinGroupObj.groupId, this.joinGroupObj.groupName)}
                        >
                        Join
                    </mwc-button>
                    <mwc-button
                        ?disabled="${this.isLoading}"
                        slot="secondaryAction"
                        dialogAction="cancel"
                        class="red">
                        Close
                    </mwc-button>
                </mwc-dialog>

                <!-- Leave Group Dialog -->
                <mwc-dialog id="leaveDialog" scrimClickAction="${this.isLoading ? '' : 'close'}">
                    <div style="text-align:center">
                        <h1>Leave Group Request</h1>
                        <hr>
                    </div>
                    
                    <div class="itemList">
                        <span class="title">Group Name</span>
                        <br>
                        <div><span>${this.leaveGroupObj.groupName}</span></div>

                        <span class="title">Description</span>
                        <br>
                        <div><span>${this.leaveGroupObj.description}</span></div>

                        <span class="title">Owner</span>
                        <br>
                        <div><span>${this.leaveGroupObj.owner}</span></div>

                        <span class="title">Date Created</span>
                        <br>
                        <div><span><time-ago datetime=${this.timeIsoString(this.leaveGroupObj.created)}></time-ago></span></div>

                        ${!this.leaveGroupObj.updated ? "" : html`<span class="title">Date Updated</span>
                        <br>
                        <div><span><time-ago datetime=${this.timeIsoString(this.leaveGroupObj.updated)}></time-ago></span></div>`}
                    </div>

                    <div style="text-align:right; height:36px;">
                        <span ?hidden="${!this.isLoading}">
                            <!-- loading message -->
                            Leaving &nbsp;
                            <paper-spinner-lite
                                style="margin-top:12px;"
                                ?active="${this.isLoading}"
                                alt="Leaving"></paper-spinner-lite>
                        </span>
                        <span ?hidden=${this.message === ''} style="${this.error ? 'color:red;' : ''}">
                            ${this.message}
                        </span>
                    </div>
                    
                    <mwc-button
                        ?disabled="${this.isLoading}"
                        slot="primaryAction"
                        @click=${() => this._leaveGroup(this.leaveGroupObj.groupId, this.leaveGroupObj.groupName)}
                        >
                        Leave Group
                    </mwc-button>
                    <mwc-button
                        ?disabled="${this.isLoading}"
                        slot="secondaryAction"
                        dialogAction="cancel"
                        class="red">
                        Close
                    </mwc-button>
                </mwc-dialog>

                <!-- Manage Group Owner Dialog -->
                <mwc-dialog id="manageGroupOwnerDialog" scrimClickAction="${this.isLoading ? '' : 'close'}">
                    <div>Manage Group Owner: ${this.manageGroupObj.groupName}</div>
                    
                    <mwc-button
                        ?disabled="${this.isLoading}"
                        slot="secondaryAction"
                        dialogAction="cancel"
                        class="red">
                        Close
                    </mwc-button>
                </mwc-dialog>

                <!-- Manage Group Admin Dialog -->
                <mwc-dialog id="manageGroupAdminDialog" scrimClickAction="${this.isLoading ? '' : 'close'}">
                    <div>Manage Group Admin: ${this.manageGroupObj.groupName}</div>
                    
                    <mwc-button
                        ?disabled="${this.isLoading}"
                        slot="secondaryAction"
                        dialogAction="cancel"
                        class="red">
                        Close
                    </mwc-button>
                </mwc-dialog>
            </div>
        `
    }

    resetDefaultSettings() {
        this.error = false
        this.message = ''
        this.isLoading = false
    }

    manageGroupOwner(groupObj) {
        this.resetDefaultSettings()
        this.manageGroupObj = groupObj

        this.shadowRoot.querySelector('#manageGroupOwnerDialog').show()
    }

    manageGroupAdmin(groupObj) {
        this.resetDefaultSettings()
        this.manageGroupObj = groupObj

        this.shadowRoot.querySelector('#manageGroupAdminDialog').show()
    }

    joinGroup(groupObj) {
        this.resetDefaultSettings()
        this.joinGroupObj = groupObj

        this.shadowRoot.querySelector('#joinDialog').show()
    }

    leaveGroup(groupObj) {
        this.resetDefaultSettings()
        this.leaveGroupObj = groupObj

        this.shadowRoot.querySelector('#leaveDialog').show()
    }

    timeIsoString(timestamp) {
        let myTimestamp = timestamp === undefined ? 1587560082346 : timestamp
        let time = new Date(myTimestamp)
        return time.toISOString()
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

    renderManageButton(groupObj) {
        if (groupObj.owner === this.selectedAddress.address) {
            // render owner actions btn to modal
            return html`<mwc-button @click=${() => this.manageGroupOwner(groupObj)}><mwc-icon>create</mwc-icon>Manage</mwc-button>`
        } else if (groupObj.isAdmin === true) {
            // render admin actions modal
            return html`<mwc-button @click=${() => this.manageGroupAdmin(groupObj)}><mwc-icon>create</mwc-icon>Manage</mwc-button>`
        } else {
            // render member leave group modal
            return html`<mwc-button @click=${() => this.leaveGroup(groupObj)}><mwc-icon>exit_to_app</mwc-icon>Leave</mwc-button>`
        }
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


    firstUpdated() {

        // Call getNamesGrid
        // this.getNamesGrid()

        const getOpenPublicGroups = async () => {
            let openG = await parentEpml.request('apiCall', {
                url: `/groups?limit=0&reverse=true`
            })

            let myGs = openG.filter(myG => myG.isOpen === true)
            return myGs
        }

        const getJoinedGroups = async () => {
            let joinedG = await parentEpml.request('apiCall', {
                url: `/groups/member/${this.selectedAddress.address}`
            })

            return joinedG
        }

        const getOpen_JoinedGroups = async () => {
            // this.publicGroups = []
            // this.joinedGroups = []

            let _joinedGroups = await getJoinedGroups()
            let _publicGroups = await getOpenPublicGroups()

            let results = _publicGroups.filter(myOpenGroup => {
                let value = _joinedGroups.some(myJoinedGroup => myOpenGroup.groupId === myJoinedGroup.groupId)
                return !value
            });
            this.publicGroups = results
            this.joinedGroups = _joinedGroups
            setTimeout(getOpen_JoinedGroups, this.config.user.nodeSettings.pingInterval)
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
                    setTimeout(getOpen_JoinedGroups, 1)
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

    async createGroup(e) {
        // Reset Default Settings...
        this.resetDefaultSettings()

        const groupNameInput = this.shadowRoot.getElementById("groupNameInput").value
        const groupDescInput = this.shadowRoot.getElementById("groupDescInput").value
        const groupTypeInput = this.shadowRoot.getElementById("groupTypeInput").value
        const groupApprovalInput = this.shadowRoot.getElementById("groupApprovalInput").value
        const groupMinDelayInput = this.shadowRoot.getElementById("groupMinDelayInput").value
        const groupMaxDelayInput = this.shadowRoot.getElementById("groupMaxDelayInput").value

        this.isLoading = true

        // Get Last Ref
        const getLastRef = async () => {
            let myRef = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/lastreference/${this.selectedAddress.address}`
            })
            return myRef
        };

        const validateReceiver = async () => {
            let lastRef = await getLastRef();
            let _groupTypeInput = parseInt(groupTypeInput)
            let _groupApprovalInput = parseInt(groupApprovalInput)
            let _groupMinDelayInput = parseInt(groupMinDelayInput)
            let _groupMaxDelayInput = parseInt(groupMaxDelayInput)

            this.resetDefaultSettings()
            let myTransaction = await makeTransactionRequest(_groupTypeInput, _groupApprovalInput, _groupMinDelayInput, _groupMaxDelayInput, lastRef)
            getTxnRequestResponse(myTransaction)

        }

        // Make Transaction Request
        const makeTransactionRequest = async (_groupTypeInput, _groupApprovalInput, _groupMinDelayInput, _groupMaxDelayInput, lastRef) => {

            let myTxnrequest = await parentEpml.request('transaction', {
                type: 22,
                nonce: this.selectedAddress.nonce,
                params: {
                    registrantAddress: this.selectedAddress.address,
                    rGroupName: groupNameInput,
                    rGroupDesc: groupDescInput,
                    rGroupType: _groupTypeInput,
                    rGroupApprovalThreshold: _groupApprovalInput,
                    rGroupMinimumBlockDelay: _groupMinDelayInput,
                    rGroupMaximumBlockDelay: _groupMaxDelayInput,
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
                this.message = 'Group Creation Successful!'
                this.error = false
            } else {
                this.error = true
                this.message = txnResponse.data.message
                throw new Error(txnResponse)
            }
        }

        if (groupNameInput.length < 3) {
            this.error = true
            this.message = "Invalid Group Name"
            this.isLoading = false
        } else if (groupDescInput.length < 3) {
            this.error = true
            this.message = "Invalid Group Description"
            this.isLoading = false
        } else if (groupTypeInput === 'reject') {
            this.error = true
            this.message = "Select a Group Type"
            this.isLoading = false
        } else if (groupApprovalInput === 'reject') {
            this.error = true
            this.message = "Select a Group Approval Threshold"
            this.isLoading = false
        } else if (groupMinDelayInput === 'reject') {
            this.error = true
            this.message = "Select a Minimum Block delay for Group Transaction Approvals"
            this.isLoading = false
        } else if (groupMaxDelayInput === 'reject') {
            this.error = true
            this.message = "Select a Maximum Block delay for Group Transaction Approvals"
            this.isLoading = false
        } else {
            this.error = false
            // Call validateReceiver
            validateReceiver()
        }
        // this.resetDefaultSettings()
    }

    async _joinGroup(groupId, groupName) {
        // Reset Default Settings...
        this.resetDefaultSettings()

        this.isLoading = true

        // Get Last Ref
        const getLastRef = async () => {
            let myRef = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/lastreference/${this.selectedAddress.address}`
            })
            return myRef
        };

        const validateReceiver = async () => {
            let lastRef = await getLastRef();

            this.resetDefaultSettings()
            let myTransaction = await makeTransactionRequest(lastRef)
            getTxnRequestResponse(myTransaction)

        }

        // Make Transaction Request
        const makeTransactionRequest = async (lastRef) => {

            let myTxnrequest = await parentEpml.request('transaction', {
                type: 31,
                nonce: this.selectedAddress.nonce,
                params: {
                    registrantAddress: this.selectedAddress.address,
                    rGroupName: groupName,
                    rGroupId: groupId,
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
                this.message = 'Join Group Request Sent Successfully!'
                this.error = false
            } else {
                this.error = true
                this.message = txnResponse.data.message
                throw new Error(txnResponse)
            }
        }

        validateReceiver()

        this.resetDefaultSettings()
    }

    async _leaveGroup(groupId, groupName) {
        // Reset Default Settings...
        this.resetDefaultSettings()

        this.isLoading = true

        // Get Last Ref
        const getLastRef = async () => {
            let myRef = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/lastreference/${this.selectedAddress.address}`
            })
            return myRef
        };

        const validateReceiver = async () => {
            let lastRef = await getLastRef();

            this.resetDefaultSettings()
            let myTransaction = await makeTransactionRequest(lastRef)
            getTxnRequestResponse(myTransaction)

        }

        // Make Transaction Request
        const makeTransactionRequest = async (lastRef) => {

            let myTxnrequest = await parentEpml.request('transaction', {
                type: 32,
                nonce: this.selectedAddress.nonce,
                params: {
                    registrantAddress: this.selectedAddress.address,
                    rGroupName: groupName,
                    rGroupId: groupId,
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
                this.message = 'Leave Group Request Sent Successfully!'
                this.error = false
            } else {
                this.error = true
                this.message = txnResponse.data.message
                throw new Error(txnResponse)
            }
        }

        validateReceiver()

        this.resetDefaultSettings()
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

window.customElements.define('group-management', GroupManagement)
