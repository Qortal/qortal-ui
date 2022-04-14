import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../epml.js'
import { use, get, translate, translateUnsafeHTML, registerTranslateConfig } from 'lit-translate'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

import '@material/mwc-icon'
import '@material/mwc-button'
import '@material/mwc-textfield'
import '@material/mwc-dialog'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/grid'
import '@vaadin/grid/vaadin-grid-filter-column.js'
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
            removeMessage: { type: String },
            theme: { type: String, reflect: true }
        }
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --paper-input-container-focus-color: var(--mdc-theme-primary);
                --mdc-theme-surface: var(--white);
                --mdc-dialog-content-ink-color: var(--black);
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

            #group-management-page {
                background: var(--white);
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
        this.createFee = 0.001
        this.joinFee = 0.001
        this.leaveFee = 0.001
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    render() {
        return html`
            <div id="group-management-page">
                <div style="min-height: 48px; display: flex; padding-bottom: 6px; margin: 2px;">
                    <h2 style="margin: 0; flex: 1; padding-top: .1em; display: inline;">${translate("grouppage.gchange1")}</h2>
                    <mwc-button style="float:right;" @click=${() => this.shadowRoot.querySelector('#createGroupDialog').show()}><mwc-icon>add</mwc-icon>${translate("grouppage.gchange2")}</mwc-button>
                </div>

                <div class="divCard">
                    <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">${translate("grouppage.gchange3")}</h3>
                    <vaadin-grid theme="large" id="joinedGroupsGrid" ?hidden="${this.isEmptyArray(this.joinedGroups)}" .items="${this.joinedGroups}" aria-label="Joined Groups" all-rows-visible>
                        <vaadin-grid-column header="${translate("grouppage.gchange4")}" path="groupName"></vaadin-grid-column>
                        <vaadin-grid-column header="${translate("grouppage.gchange5")}" path="description"></vaadin-grid-column>
                        <vaadin-grid-column width="11rem" flex-grow="0" header="${translate("grouppage.gchange6")}" .renderer=${(root, column, data) => {
                            render(html`${this.renderRole(data.item)}`, root)
                        }}></vaadin-grid-column>
                        <vaadin-grid-column width="11rem" flex-grow="0" header="${translate("grouppage.gchange7")}" .renderer=${(root, column, data) => {
                            render(html`${this.renderManageButton(data.item)}`, root)
                        }}></vaadin-grid-column>
                    </vaadin-grid>
                    ${this.isEmptyArray(this.joinedGroups) ? html`
                        <span style="color: var(--black);">${translate("grouppage.gchange8")}</span>
                    `: ''}
                </div>

                <div class="divCard">
                    <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">${translate("grouppage.gchange9")}</h3>
                    <vaadin-grid theme="large" id="publicGroupsGrid" ?hidden="${this.isEmptyArray(this.publicGroups)}" .items="${this.publicGroups}" aria-label="Public Open Groups" all-rows-visible>
                        <vaadin-grid-filter-column header="${translate("grouppage.gchange4")}" path="groupName"></vaadin-grid-filter-column>
                        <vaadin-grid-filter-column header="${translate("grouppage.gchange5")}" path="description"></vaadin-grid-filter-column>
                        <vaadin-grid-filter-column header="${translate("grouppage.gchange10")}" path="owner"></vaadin-grid-filter-column>
                        <vaadin-grid-column width="11rem" flex-grow="0" header="${translate("grouppage.gchange7")}" .renderer=${(root, column, data) => {
                            render(html`<mwc-button @click=${() => this.joinGroup(data.item)}><mwc-icon>queue</mwc-icon>&nbsp;${translate("grouppage.gchange51")}</mwc-button>`, root)
                        }}></vaadin-grid-column>
                    </vaadin-grid>
                    ${this.isEmptyArray(this.publicGroups) ? html`
                        <span style="color: var(--black);">${translate("grouppage.gchange11")}</span>
                    `: ''}
                </div>

                <!-- Create Group Dialog -->
                <mwc-dialog id="createGroupDialog" scrimClickAction="${this.isLoading ? '' : 'close'}">
                    <div style="text-align:center">
                        <h1>${translate("grouppage.gchange12")}</h1>
                        <hr>
                    </div>
                    
                    <mwc-textfield style="width: 100%;" ?disabled="${this.isLoading}" label="${translate("grouppage.gchange4")}" id="groupNameInput"></mwc-textfield>
                    <p style="margin-bottom:0;">
                        <mwc-textfield style="width:100%;" ?disabled="${this.isLoading}" label="${translate("grouppage.gchange5")}" id="groupDescInput"></mwc-textfield>
                    </p>
                    <p>
                        ${translate("grouppage.gchange13")}:
                        <select required validationMessage="${translate("grouppage.gchange14")}" id="groupTypeInput" label="Group Type">
                            <option value="reject" selected>${translate("grouppage.gchange15")}</option>
                            <option value="1">${translate("grouppage.gchange16")}</option>
                            <option value="0">${translate("grouppage.gchange17")}</option>
                        </select>
                    </p>
                    <p>
                        ${translate("grouppage.gchange18")}
                        <select required validationMessage="${translate("grouppage.gchange14")}" id="groupApprovalInput" label="Group Type">
                            <option value="reject" selected>${translate("grouppage.gchange15")}</option>
                            <option value="0">${translate("grouppage.gchange19")}</option>
                            <option value="1">${translate("grouppage.gchange20")}</option>
                            <option value="20">20%</option>
                            <option value="40">40%</option>
                            <option value="60">60%</option>
                            <option value="80">80%</option>
                            <option value="100">100%</option>
                        </select>
                    </p>
                    <p>
                        ${translate("grouppage.gchange21")}
                        <select required validationMessage="${translate("grouppage.gchange14")}" id="groupMinDelayInput" label="Group Type">
                            <option value="reject" selected>${translate("grouppage.gchange15")}</option>
                            <option value="5">5 ${translate("grouppage.gchange22")}</option>
                            <option value="10">10 ${translate("grouppage.gchange22")}</option>
                            <option value="30">30 ${translate("grouppage.gchange22")}</option>
                            <option value="60">1 ${translate("grouppage.gchange23")}</option>
                            <option value="180">3 ${translate("grouppage.gchange24")}</option>
                            <option value="300">5 ${translate("grouppage.gchange24")}</option>
                            <option value="420">7 ${translate("grouppage.gchange24")}</option>
                            <option value="720">12 ${translate("grouppage.gchange24")}</option>
                            <option value="1440">1 ${translate("grouppage.gchange25")}</option>
                            <option value="4320">3 ${translate("grouppage.gchange26")}</option>
                            <option value="7200">5 ${translate("grouppage.gchange26")}</option>
                            <option value="10080">7 ${translate("grouppage.gchange26")}</option>
                        </select>
                    </p>
                    <p>
                        ${translate("grouppage.gchange27")}
                        <select required validationMessage="${translate("grouppage.gchange14")}" id="groupMaxDelayInput" label="Group Type">
                            <option value="reject" selected>${translate("grouppage.gchange15")}</option>
                            <option value="60">1 ${translate("grouppage.gchange23")}</option>
                            <option value="180">3 ${translate("grouppage.gchange24")}</option>
                            <option value="300">5 ${translate("grouppage.gchange24")}</option>
                            <option value="420">7 ${translate("grouppage.gchange24")}</option>
                            <option value="720">12 ${translate("grouppage.gchange24")}</option>
                            <option value="1440">1 ${translate("grouppage.gchange25")}</option>
                            <option value="4320">3 ${translate("grouppage.gchange26")}</option>
                            <option value="7200">5 ${translate("grouppage.gchange26")}</option>
                            <option value="10080">7 ${translate("grouppage.gchange26")}</option>
                            <option value="14400">10 ${translate("grouppage.gchange26")}</option>
                            <option value="21600">15 ${translate("grouppage.gchange26")}</option>
                        </select>
                    </p>
                    <div style="text-align:right; height:36px;">
                        <span ?hidden="${!this.isLoading}">
                            <!-- loading message -->
                            ${translate("grouppage.gchange28")} &nbsp;
                            <paper-spinner-lite
                                style="margin-top:12px;"
                                ?active="${this.isLoading}"
                                alt="Creating Group"
                            >
                            </paper-spinner-lite>
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
                    ${translate("grouppage.gchange29")}
                    </mwc-button>
                    <mwc-button
                        ?disabled="${this.isLoading}"
                        slot="secondaryAction"
                        dialogAction="cancel"
                        class="red"
                    >
                    ${translate("general.close")}
                    </mwc-button>
                </mwc-dialog>

                <!-- Join Group Dialog -->
                <mwc-dialog id="joinDialog" scrimClickAction="${this.isLoading ? '' : 'close'}">
                    <div style="text-align:center">
                        <h1>${translate("grouppage.gchange30")}</h1>
                        <hr>
                    </div>
                    
                    <div class="itemList">
                        <span class="title">${translate("grouppage.gchange4")}</span>
                        <br>
                        <div><span>${this.joinGroupObj.groupName}</span></div>

                        <span class="title">${translate("grouppage.gchange5")}</span>
                        <br>
                        <div><span>${this.joinGroupObj.description}</span></div>

                        <span class="title">${translate("grouppage.gchange10")}</span>
                        <br>
                        <div><span>${this.joinGroupObj.owner}</span></div>

                        <span class="title">${translate("grouppage.gchange31")}</span>
                        <br>
                        <div><span><time-ago datetime=${this.timeIsoString(this.joinGroupObj.created)}></time-ago></span></div>

                        ${!this.joinGroupObj.updated ? "" : html`<span class="title">${translate("grouppage.gchange32")}</span>
                        <br>
                        <div><span><time-ago datetime=${this.timeIsoString(this.joinGroupObj.updated)}></time-ago></span></div>`}
                    </div>

                    <div style="text-align:right; height:36px;">
                        <span ?hidden="${!this.isLoading}">
                            <!-- loading message -->
                            ${translate("grouppage.gchange33")} &nbsp;
                            <paper-spinner-lite
                                style="margin-top:12px;"
                                ?active="${this.isLoading}"
                                alt="Joining"
                            >
                            </paper-spinner-lite>
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
                    ${translate("grouppage.gchange34")}
                    </mwc-button>
                    <mwc-button
                        ?disabled="${this.isLoading}"
                        slot="secondaryAction"
                        dialogAction="cancel"
                        class="red"
                    >
                    ${translate("general.close")}
                    </mwc-button>
                </mwc-dialog>

                <!-- Leave Group Dialog -->
                <mwc-dialog id="leaveDialog" scrimClickAction="${this.isLoading ? '' : 'close'}">
                    <div style="text-align:center">
                        <h1>${translate("grouppage.gchange35")}</h1>
                        <hr>
                    </div>
                    
                    <div class="itemList">
                        <span class="title">${translate("grouppage.gchange4")}</span>
                        <br>
                        <div><span>${this.leaveGroupObj.groupName}</span></div>

                        <span class="title">${translate("grouppage.gchange5")}</span>
                        <br>
                        <div><span>${this.leaveGroupObj.description}</span></div>

                        <span class="title">${translate("grouppage.gchange10")}</span>
                        <br>
                        <div><span>${this.leaveGroupObj.owner}</span></div>

                        <span class="title">${translate("grouppage.gchange31")}</span>
                        <br>
                        <div><span><time-ago datetime=${this.timeIsoString(this.leaveGroupObj.created)}></time-ago></span></div>

                        ${!this.leaveGroupObj.updated ? "" : html`<span class="title">${translate("grouppage.gchange32")}</span>
                        <br>
                        <div><span><time-ago datetime=${this.timeIsoString(this.leaveGroupObj.updated)}></time-ago></span></div>`}
                    </div>

                    <div style="text-align:right; height:36px;">
                        <span ?hidden="${!this.isLoading}">
                            <!-- loading message -->
                            ${translate("grouppage.gchange36")} &nbsp;
                            <paper-spinner-lite
                                style="margin-top:12px;"
                                ?active="${this.isLoading}"
                                alt="Leaving"
                            >
                            </paper-spinner-lite>
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
                    ${translate("grouppage.gchange37")}
                    </mwc-button>
                    <mwc-button
                        ?disabled="${this.isLoading}"
                        slot="secondaryAction"
                        dialogAction="cancel"
                        class="red"
                    >
                    ${translate("general.close")}
                    </mwc-button>
                </mwc-dialog>

                <!-- Manage Group Owner Dialog -->
                <mwc-dialog id="manageGroupOwnerDialog" scrimClickAction="${this.isLoading ? '' : 'close'}">
                    <div>${translate("grouppage.gchange38")} ${this.manageGroupObj.groupName}</div>
                    <mwc-button
                        ?disabled="${this.isLoading}"
                        slot="secondaryAction"
                        dialogAction="cancel"
                        class="red"
                    >
                    ${translate("general.close")}
                    </mwc-button>
                </mwc-dialog>

                <!-- Manage Group Admin Dialog -->
                <mwc-dialog id="manageGroupAdminDialog" scrimClickAction="${this.isLoading ? '' : 'close'}">
                    <div>${translate("grouppage.gchange39")} ${this.manageGroupObj.groupName}</div>
                    <mwc-button
                        ?disabled="${this.isLoading}"
                        slot="secondaryAction"
                        dialogAction="cancel"
                        class="red"
                    >
                    ${translate("general.close")}
                    </mwc-button>
                </mwc-dialog>
            </div>
        `
    }

    firstUpdated() {

        this.changeTheme()
        this.changeLanguage()
        this.unitCreateFee()
        this.unitJoinFee()
        this.unitLeaveFee()

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
        })

        window.addEventListener("click", () => {
            parentEpml.request('closeCopyTextMenu', null)
        })

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

    changeTheme() {
        const checkTheme = localStorage.getItem('qortalTheme')
        if (checkTheme === 'dark') {
            this.theme = 'dark';
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

    renderErr1Text() {
        return html`${translate("grouppage.gchange41")}`
    }

    renderErr2Text() {
        return html`${translate("grouppage.gchange42")}`
    }
    renderErr3Text() {
        return html`${translate("grouppage.gchange43")}`
    }
    renderErr4Text() {
        return html`${translate("grouppage.gchange44")}`
    }
    renderErr5Text() {
        return html`${translate("grouppage.gchange45")}`
    }
    renderErr6Text() {
        return html`${translate("grouppage.gchange46")}`
    }
    renderErr7Text() {
        return html`${translate("grouppage.gchange47")}`
    }
    renderErr8Text() {
        return html`${translate("grouppage.gchange48")}`
    }
    renderErr9Text() {
        return html`${translate("grouppage.gchange49")}`
    }

    async unitCreateFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
        const url = `${nodeUrl}/transactions/unitfee?txType=CREATE_GROUP`;
        await fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            })
            .then((json) => {
                this.createFee = (Number(json) / 1e8).toFixed(8);
            })
            .catch((response) => {
                console.log(response.status, response.statusText, 'Need Core Update');
            })
    }

    async unitJoinFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
        const url = `${nodeUrl}/transactions/unitfee?txType=JOIN_GROUP`;
        await fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            })
            .then((json) => {
                this.joinFee = (Number(json) / 1e8).toFixed(8);
            })
            .catch((response) => {
                console.log(response.status, response.statusText, 'Need Core Update');
            })
    }

    async unitLeaveFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
        const url = `${nodeUrl}/transactions/unitfee?txType=LEAVE_GROUP`;
        await fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            })
            .then((json) => {
                this.leaveFee = (Number(json) / 1e8).toFixed(8);
            })
            .catch((response) => {
                console.log(response.status, response.statusText, 'Need Core Update');
            })
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
            let ownerstring = get("grouppage.gchange10")
            return ownerstring
        } else if (groupObj.isAdmin === true) {
            let adminstring = get("grouppage.gchange52")
            return adminstring
        } else {
            let memberstring = get("grouppage.gchange53")
            return memberstring
        }
    }

    renderManageButton(groupObj) {
        if (groupObj.owner === this.selectedAddress.address) {
            // render owner actions btn to modal
            return html`<mwc-button @click=${() => this.manageGroupOwner(groupObj)}><mwc-icon>create</mwc-icon>nbsp;${translate("grouppage.gchange40")}</mwc-button>`
        } else if (groupObj.isAdmin === true) {
            // render admin actions modal
            return html`<mwc-button @click=${() => this.manageGroupAdmin(groupObj)}><mwc-icon>create</mwc-icon>nbsp;${translate("grouppage.gchange40")}</mwc-button>`
        } else {
            // render member leave group modal
            return html`<mwc-button @click=${() => this.leaveGroup(groupObj)}><mwc-icon>exit_to_app</mwc-icon>&nbsp;${translate("grouppage.gchange50")}</mwc-button>`
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

    async createGroup(e) {
        // Reset Default Settings...
        this.resetDefaultSettings()
        const createFeeInput = this.createFee
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
                    fee: createFeeInput,
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

        const getTxnRequestResponse = (txnResponse) => {
            if (txnResponse.success === false && txnResponse.message) {
                this.error = true
                this.message = txnResponse.message
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.message = this.renderErr1Text()
                this.error = false
            } else {
                this.error = true
                this.message = txnResponse.data.message
                throw new Error(txnResponse)
            }
        }

        if (groupNameInput.length < 3) {
            this.error = true
            this.message = this.renderErr2Text()
            this.isLoading = false
        } else if (groupDescInput.length < 3) {
            this.error = true
            this.message = this.renderErr3Text()
            this.isLoading = false
        } else if (groupTypeInput === 'reject') {
            this.error = true
            this.message = this.renderErr4Text()
            this.isLoading = false
        } else if (groupApprovalInput === 'reject') {
            this.error = true
            this.message = this.renderErr5Text()
            this.isLoading = false
        } else if (groupMinDelayInput === 'reject') {
            this.error = true
            this.message = this.renderErr6Text()
            this.isLoading = false
        } else if (groupMaxDelayInput === 'reject') {
            this.error = true
            this.message = this.renderErr7Text()
            this.isLoading = false
        } else {
            this.error = false
            // Call validateReceiver
            validateReceiver()
        }
    }

    async _joinGroup(groupId, groupName) {
        // Reset Default Settings...
        this.resetDefaultSettings()
        const joinFeeInput = this.joinFee

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
                    fee: joinFeeInput,
                    registrantAddress: this.selectedAddress.address,
                    rGroupName: groupName,
                    rGroupId: groupId,
                    lastReference: lastRef,
                }
            })
            return myTxnrequest
        }

        const getTxnRequestResponse = (txnResponse) => {
            if (txnResponse.success === false && txnResponse.message) {
                this.error = true
                this.message = txnResponse.message
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.message = this.renderErr8Text()
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
        const leaveFeeInput = this.leaveFee

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
                    fee: leaveFeeInput,
                    registrantAddress: this.selectedAddress.address,
                    rGroupName: groupName,
                    rGroupId: groupId,
                    lastReference: lastRef,
                }
            })
            return myTxnrequest
        }

        const getTxnRequestResponse = (txnResponse) => {

            if (txnResponse.success === false && txnResponse.message) {
                this.error = true
                this.message = txnResponse.message
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.message = this.renderErr9Text()
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
