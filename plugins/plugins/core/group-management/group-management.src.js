import {css, html, LitElement} from 'lit'
import {render} from 'lit/html.js'
import {Epml} from '../../../epml.js'
import isElectron from 'is-electron'
import {get, registerTranslateConfig, translate, use} from '../../../../core/translate/index.js'
import '../components/time-elements/index.js'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-formfield'
import '@material/mwc-icon'
import '@material/mwc-icon-button'
import '@material/mwc-textfield'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@polymer/paper-progress/paper-progress.js'
import '@vaadin/button'
import '@vaadin/icon'
import '@vaadin/icons'
import '@vaadin/grid'
import '@vaadin/grid/vaadin-grid-filter-column.js'
import '@vaadin/grid/vaadin-grid-sort-column.js'
import '@vaadin/text-field'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class GroupManagement extends LitElement {
    static get properties() {
        return {
            loading: { type: Boolean },
            publicGroups: { type: Array },
            privateGroups: { type: Array },
            joinedGroups: { type: Array },
            groupInvites: { type: Array },
            filteredItems: { type: Array },
            privateGroupSearch: { type: Array },
            newMembersList: { type: Array },
            newAdminsList: { type: Array },
            newBannedList: { type: Array },
            newGroupInvitesList: { type: Array },
            newGroupJoinsList: { type: Array },
            recipientPublicKey: { type: String },
            selectedAddress: { type: Object },
            manageGroupObj: { type: Object },
            joinGroupObj: { type: Object },
            leaveGroupObj: { type: Object },
            btnDisable: { type: Boolean },
            isLoading: { type: Boolean },
            createFee: { type: Number },
            joinFee: { type: Number },
            leaveFee: { type: Number },
            addGroupAdminFee: { type: Number },
            kickGroupAdminFee: { type: Number },
            createBanFee: { type: Number },
            cancelBanFee: { type: Number },
            kickGroupMemberFee: { type: Number },
            inviteGroupMemberFee: { type: Number },
            cancelInviteGroupMemberFee: { type: Number },
            error: { type: Boolean },
            message: { type: String },
            removeError: { type: Boolean },
            removeMessage: { type: String },
            theme: { type: String, reflect: true },
            selectedView: { type: Object },
            manageGroupId: { type: String },
            theGroupOwner: { type: String },
            manageGroupName: { type: String },
            manageGroupCount: { type: String },
            manageGroupType: { type: String },
            memberToAdmin: { type: String },
            kickGroupAdminAddress: { type: String },
            toBanName: { type: String },
            toBanAddress: { type: String },
            banReason: { type: String },
            toCancelBanName: { type: String },
            toCancelBanAddress: { type: String },
            toKickMemberName: { type: String },
            toKickMemberAddress: { type: String },
            kickMemberReason: { type: String },
            toInviteMemberToGroup: { type: String },
            toCancelInviteMemberName: { type: String },
            toCancelInviteMemberAddress: { type: String },
            searchGroupName: { type: String },
            errorMessage: { type: String },
            successMessage: { type: String }
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
                --mdc-dialog-min-width: 400px;
                --mdc-dialog-max-width: 1024px;
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

[part="input-field"] {
    background-color: #fff;
}
            #group-management-page {
                background: var(--white);
                padding: 12px 24px;
            }

            paper-progress {
                --paper-progress-active-color: var(--mdc-theme-primary);
            }

            paper-dialog.nanage-group {
                width: 80%;
                max-width: 80vw;
                height: 80%;
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

            .card-container {
                background-color: var(--white);
                border-radius: 5px;
                color: var(--black);
                padding-top: 30px;
                position: relative;
                width: 350px;
                max-width: 100%;
                text-align: center;
            }

            .error-icon {
                font-size: 48px;
                color: red;
            }

            .success-icon {
                font-size: 48px;
                color: #198754;
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

            ul {
                list-style: none;
                padding: 0;
                margin-bottom: 0;
            }

            .leftBar {
                background-color: var(--white);
                color: var(--black);
                border: 1px solid var(--border);
                padding: 20px 0 0 0;
                border-radius: 10px;
            }

            .leftBar img {
                margin: 0 auto;
                width: 75%;
                height: 75%;
                text-align: center;
            }

            .leftBar .slug {
                text-align: center;
                margin-top: 20px;
                color: var(--black);
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 7px;
            }

            .leftBar ul li {
                border-bottom: 1px solid var(--border);
            }

            .leftBar ul li:last-child {
                border-bottom: none;
            }

            .leftBar ul li a {
                color: var(--black);
                font-size: 16px;
                font-weight: 400;
                text-decoration: none;
                padding: .9em;
                display: block;
            }

            .leftBar ul li a i {
                margin-right: 8px;
                font-size: 16px;
            }

            .leftBar ul li a:hover {
                background-color: var(--menuhover);
                color: #515151;
            }

            .leftBar ul li:active {
                border-bottom: none;
            }

            .leftBar ul li a.active {
                color: #515151;
                background-color: var(--menuactive);
                border-left: 2px solid #515151;
                margin-left: -2px;
            }

            .mainPage {
                background-color: var(--white);
                color: var(--black);
                border: 1px solid var(--border);
                padding: 10px 0 10px 0;
                border-radius: 10px;
                font-size: 16px;
                text-align: center;
                min-height: 460px;
            }

            @media(max-width:700px) {
                .mainPage {
                    margin-top: 30px;
                }
            }

            @media(min-width:765px) {
                .container {
                    padding: 2em;
                }

                .wrapper {
                    display: grid;
                    grid-template-columns: 1fr 5fr;
                    grid-gap: 20px;
                }

                .wrapper > .mainPage {
                    padding: 2em;
                }

                .leftBar {
                    text-align: left;
                    max-height: 320px;
                    max-width: 250px;
                    font-size: 16px;
                }

                .mainPage {
                    font-size: 16px;
                }

            }

            mwc-textfield {
                width:100%;
            }

            .red {
                --mdc-theme-primary: red;
            }

            .warning {
                --mdc-theme-primary: #f0ad4e;
            }

            .green {
                --mdc-theme-primary: #198754;
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

            img {
                border-radius: 25%;
                max-width: 32px;
                height: 100%;
                max-height: 32px;
            }

            .successBox {
                height: 34px;
                min-width: 300px;
                width: 100%;
                border: 1px solid green;
                border-radius: 5px;
                background-color: transparent;
                margin-top: 15px;
            }

            .errorBox {
                height: 34px;
                min-width: 300px;
                width: 100%;
                border: 1px solid red;
                border-radius: 5px;
                background-color: transparent;
                margin-top: 15px;
            }

            .manage-group-dialog {
                min-height: 300px;
                min-width: 350px;
                box-sizing: border-box;
                position: relative;
            }

            .btn-clear-success {
			--mdc-icon-button-size: 32px;
			color: red;
		}

            .btn-clear-error {
			--mdc-icon-button-size: 32px;
			color: green;
		}

		select {
			background: var(--white);
			color: var(--black);
		}

            #search {
               width: 100%;
               display: flex;
               margin: auto;
               align-items: center;
            }
        `
    }

    constructor() {
        super()
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
        this.selectedAddress = {}
        this.publicGroups = []
        this.privateGroups = []
        this.joinedGroups = []
        this.groupInvites = []
        this.filteredItems = []
        this.privateGroupSearch = []
        this.newMembersList = []
        this.newAdminsList = []
        this.newBannedList = []
        this.newGroupInvitesList = []
        this.newGroupJoinsList = []
        this.manageGroupObj = {}
        this.joinGroupObj = {}
        this.leaveGroupObj = {}
        this.recipientPublicKey = ''
        this.btnDisable = false
        this.isLoading = false
        this.createFee = 0.001
        this.joinFee = 0.001
        this.leaveFee = 0.001
        this.addGroupAdminFee = 0.001
        this.kickGroupAdminFee = 0.001
        this.createBanFee = 0.001
        this.cancelBanFee = 0.001
        this.kickGroupMemberFee = 0.001
        this.inviteGroupMemberFee = 0.001
        this.cancelInviteGroupMemberFee = 0.001
        this.manageGroupId = ''
        this.theGroupOwner = ''
        this.manageGroupName = ''
        this.manageGroupCount = ''
        this.manageGroupType = ''
        this.memberToAdmin = ''
        this.kickGroupAdminAddress = ''
        this.toBanName = ''
        this.toBanAddress = ''
        this.banReason = ''
        this.toCancelBanName = ''
        this.toCancelBanAddress = ''
        this.toKickMemberName = ''
        this.toKickMemberAddress = ''
        this.kickMemberReason = ''
        this.toInviteMemberToGroup = ''
        this.toCancelInviteMemberName = ''
        this.toCancelInviteMemberAddress = ''
        this.searchGroupName = ''
        this.errorMessage = ''
        this.successMessage = ''
        this.selectedView = { id: 'group-members', name: 'Group Members' }
    }

    groupMemberTemplate() {
        return html`
            <vaadin-grid theme="large" id="groupMembersGrid" ?hidden="${this.isEmptyArray(this.newMembersList)}" .items="${this.newMembersList}" aria-label="Group Members" all-rows-visible>
                <vaadin-grid-column
                    width="6rem"
                    flex-grow="0"
                    header="${translate("websitespage.schange5")}"
                    .renderer=${(root, column, data) => {
	                  render(html`${this.renderAvatar(data.item)}`, root)
	              }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    width="12rem"
                    flex-grow="0"
                    header="${translate("puzzlepage.pchange4")}"
                    .renderer=${(root, column, data) => {
                        render(html`${data.item.name}`, root)
                    }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    width="22rem"
                    flex-grow="0"
                    header="${translate("login.address")}"
                    .renderer=${(root, column, data) => {
	                  render(html`${data.item.owner}`, root)
	              }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    width="9rem"
                    flex-grow="0"
                    header="${translate("websitespage.schange8")}"
                    .renderer=${(root, column, data) => {
                        render(html`${this.renderBanButton(data.item)}`, root)
                    }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    width="9rem"
                    flex-grow="0"
                    .renderer=${(root, column, data) => {
                        render(html`${this.renderKickGroupMemberButton(data.item)}`, root)
                    }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    width="9rem"
                    flex-grow="0"
                    .renderer=${(root, column, data) => {
                        render(html`${this.renderMakeAdminButton(data.item.owner)}`, root)
                    }}
                ></vaadin-grid-column>
            </vaadin-grid>

            <mwc-dialog id="createBanMemberDialog" scrimClickAction="" escapeKeyAction="">
                <div class="manage-group-dialog">
                    <div style="text-align: center;">
                        <h2>${translate("managegroup.mg17")}</h2>
                        <hr />
                        <br>
                    </div>
                    <p>
                        <mwc-textfield
                            style="width: 100%; color: var(--black);"
                            readOnly
                            outlined
                            id="toBanName"
                            label="${translate("managegroup.mg18")}"
                            type="text"
                            value="${this.toBanName}"
                        >
                        </mwc-textfield>
                    </p>
                    <p>
                        <mwc-textfield
                            style="width: 100%; color: var(--black);"
                            required
                            readOnly
                            outlined
                            id="toBanAddress"
                            label="${translate("managegroup.mg19")}"
                            type="text"
                            value="${this.toBanAddress}"
                        >
                        </mwc-textfield>
                    </p>
                    <p>
                        <mwc-textfield
                            style="width: 100%; color: var(--black);"
                            required
                            outlined
                            id="banReason"
                            label="${translate("managegroup.mg21")}"
                            type="text"
                            value="${this.banReason}"
                        >
                        </mwc-textfield>
                    </p>
                    <p>
                        ${translate("managegroup.mg20")}
                        <select required validationMessage="${translate("grouppage.gchange14")}" id="banMemberTime" label="Ban Time">
                            <option value="reject" selected>${translate("grouppage.gchange15")}</option>
                            <option value="10800">3 ${translate("grouppage.gchange24")}</option>
                            <option value="21600">6 ${translate("grouppage.gchange24")}</option>
                            <option value="43200">12 ${translate("grouppage.gchange24")}</option>
                            <option value="86400">1 ${translate("grouppage.gchange25")}</option>
                            <option value="259200">3 ${translate("grouppage.gchange26")}</option>
                            <option value="432000">5 ${translate("grouppage.gchange26")}</option>
                            <option value="604800">7 ${translate("grouppage.gchange26")}</option>
                            <option value="864000">10 ${translate("grouppage.gchange26")}</option>
                            <option value="1296000">15 ${translate("grouppage.gchange26")}</option>
                            <option value="2592000">30 ${translate("grouppage.gchange26")}</option>
                            <option value="0">${translate("managegroup.mg24")}</option>
                        </select>
                    </p>
                    <div style="margin-bottom: 10px;">
                        <p style="margin-bottom: 0;">${translate("walletpage.wchange21")} <span style="font-weight: bold;">${this.createBanFee} QORT<span></p>
                        <br>
                    </div>
                    ${this.renderClearSuccess()}
                    ${this.renderClearError()}
                    ${this.isLoading ? html`<paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress>` : ''}
                    <div class="buttons">
                        <div>
                            <vaadin-button ?disabled="${this.btnDisable}" theme="primary medium" style="width: 100%;" @click=${() => this.createBanMember(this.manageGroupId)}>
                                <vaadin-icon icon="vaadin:ban" slot="prefix"></vaadin-icon>
                                ${translate("managegroup.mg17")}
                            </vaadin-button>
                        </div>
                    </div>
                </div>
                <mwc-button
                    slot="primaryAction"
                    @click="${() => this.closeCreateBanMemberDialog()}"
                    class="red"
                >
                ${translate("general.close")}
                </mwc-button>
            </mwc-dialog>

            <mwc-dialog id="kickGroupMemberDialog" scrimClickAction="" escapeKeyAction="">
                <div class="manage-group-dialog">
                    <div style="text-align: center;">
                        <h2>${translate("managegroup.mg31")}</h2>
                        <hr />
                        <br>
                    </div>
                    <p>
                        <mwc-textfield
                            style="width: 100%; color: var(--black);"
                            readOnly
                            outlined
                            id="toKickMemberName"
                            label="${translate("managegroup.mg18")}"
                            type="text"
                            value="${this.toKickMemberName}"
                        >
                        </mwc-textfield>
                    </p>
                    <p>
                        <mwc-textfield
                            style="width: 100%; color: var(--black);"
                            required
                            readOnly
                            outlined
                            id="toKickMemberAddress"
                            label="${translate("managegroup.mg19")}"
                            type="text"
                            value="${this.toKickMemberAddress}"
                        >
                        </mwc-textfield>
                    </p>
                    <p>
                        <mwc-textfield
                            style="width: 100%; color: var(--black);"
                            required
                            outlined
                            id="kickMemberReason"
                            label="${translate("managegroup.mg32")}"
                            type="text"
                            value="${this.kickMemberReason}"
                        >
                        </mwc-textfield>
                    </p>
                    <div style="margin-bottom: 10px;">
                        <p style="margin-bottom: 0;">${translate("walletpage.wchange21")} <span style="font-weight: bold;">${this.kickGroupMemberFee} QORT<span></p>
                        <br>
                    </div>
                    ${this.renderClearSuccess()}
                    ${this.renderClearError()}
                    ${this.isLoading ? html`<paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress>` : ''}
                    <div class="buttons">
                        <div>
                            <vaadin-button ?disabled="${this.btnDisable}" theme="primary medium" style="width: 100%;" @click=${() => this.kickGroupMember(this.manageGroupId)}>
                                <vaadin-icon icon="vaadin:exit" slot="prefix"></vaadin-icon>
                                ${translate("managegroup.mg31")}
                            </vaadin-button>
                        </div>
                    </div>
                </div>
                <mwc-button
                    slot="primaryAction"
                    @click="${() => this.closeKickGroupMemberDialog()}"
                    class="red"
                >
                ${translate("general.close")}
                </mwc-button>
            </mwc-dialog>

            <mwc-dialog id="addGroupAdminDialog" scrimClickAction="" escapeKeyAction="">
                <div class="manage-group-dialog">
                    <div style="text-align: center;">
                        <h2>${translate("managegroup.mg10")}</h2>
                        <hr />
                        <br>
                    </div>
                    <p>
                        <mwc-textfield
                            style="width: 100%; color: var(--black);"
                            required
                            readOnly
                            outlined
                            id="memberToAdmin"
                            label="${translate("walletpage.wchange23")}"
                            type="text"
                            value="${this.memberToAdmin}"
                        >
                        </mwc-textfield>
                    </p>
                    <div style="margin-bottom: 10px;">
                        <p style="margin-bottom: 0;">${translate("walletpage.wchange21")} <span style="font-weight: bold;">${this.addGroupAdminFee} QORT<span></p>
                        <br>
                    </div>
                    ${this.renderClearSuccess()}
                    ${this.renderClearError()}
                    ${this.isLoading ? html`<paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress>` : ''}
                    <div class="buttons">
                        <div>
                            <vaadin-button ?disabled="${this.btnDisable}" theme="primary medium" style="width: 100%;" @click=${() => this.addGroupAdmin(this.manageGroupId)}>
                                <vaadin-icon icon="vaadin:plus-circle-o" slot="prefix"></vaadin-icon>
                                ${translate("managegroup.mg10")}
                            </vaadin-button>
                        </div>
                    </div>
                </div>
                <mwc-button
                    slot="primaryAction"
                    @click="${() => this.closeAddGroupAdminDialog()}"
                    class="red"
                >
                ${translate("general.close")}
                </mwc-button>
            </mwc-dialog>
        `
    }

    groupBannedTemplate() {
        return html`
            <vaadin-grid theme="large" id="groupBannedGrid" ?hidden="${this.isEmptyArray(this.newBannedList)}" .items="${this.newBannedList}" aria-label="Banned Members" all-rows-visible>
                <vaadin-grid-column
                    width="6rem"
                    flex-grow="0"
                    header="${translate("websitespage.schange5")}"
                    .renderer=${(root, column, data) => {
	                  render(html`${this.renderAvatar(data.item)}`, root)
	              }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    width="12rem"
                    flex-grow="0"
                    header="${translate("puzzlepage.pchange4")}"
                    .renderer=${(root, column, data) => {
                        render(html`${data.item.name}`, root)
                    }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    width="22rem"
                    flex-grow="0"
                    header="${translate("login.address")}"
                    .renderer=${(root, column, data) => {
	                  render(html`${data.item.owner}`, root)
	              }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    width="14rem"
                    flex-grow="0"
                    header="${translate("managegroup.mg27")}"
                    .renderer=${(root, column, data) => {
                        const dateString = new Date(data.item.expiry).toLocaleString()
                        render(html`${dateString}`, root)
                    }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    width="12rem"
                    flex-grow="0"
                    header="${translate("websitespage.schange8")}"
                    .renderer=${(root, column, data) => {
                        render(html`${this.renderCancelBanButton(data.item)}`, root)
                    }}
                ></vaadin-grid-column>
            </vaadin-grid>

            <mwc-dialog id="cancelBanMemberDialog" scrimClickAction="" escapeKeyAction="">
                <div class="manage-group-dialog">
                    <div style="text-align: center;">
                        <h2>${translate("managegroup.mg28")}</h2>
                        <hr />
                        <br>
                    </div>
                    <p>
                        <mwc-textfield
                            style="width: 100%; color: var(--black);"
                            readOnly
                            outlined
                            id="toCancelBanName"
                            label="${translate("managegroup.mg18")}"
                            type="text"
                            value="${this.toCancelBanName}"
                        >
                        </mwc-textfield>
                    </p>
                    <p>
                        <mwc-textfield
                            style="width: 100%; color: var(--black);"
                            required
                            readOnly
                            outlined
                            id="toCancelBanAddress"
                            label="${translate("managegroup.mg19")}"
                            type="text"
                            value="${this.toCancelBanAddress}"
                        >
                        </mwc-textfield>
                    </p>
                    <div style="margin-bottom: 10px;">
                        <p style="margin-bottom: 0;">${translate("walletpage.wchange21")} <span style="font-weight: bold;">${this.cancelBanFee} QORT<span></p>
                        <br>
                    </div>
                    ${this.renderClearSuccess()}
                    ${this.renderClearError()}
                    ${this.isLoading ? html`<paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress>` : ''}
                    <div class="buttons">
                        <div>
                            <vaadin-button ?disabled="${this.btnDisable}" theme="primary medium" style="width: 100%;" @click=${() => this.cancelBanMember(this.manageGroupId)}>
                                <vaadin-icon icon="vaadin:unlock" slot="prefix"></vaadin-icon>
                                ${translate("managegroup.mg28")}
                            </vaadin-button>
                        </div>
                    </div>
                </div>
                <mwc-button
                    slot="primaryAction"
                    @click="${() => this.closeCancelBanMemberDialog()}"
                    class="red"
                >
                ${translate("general.close")}
                </mwc-button>
            </mwc-dialog>
        `
    }

    groupInviteTemplate() {
        return html`
            <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">${translate("managegroup.mg36")}</h3>
            <vaadin-grid theme="large" id="groupInvitesGrid" ?hidden="${this.isEmptyArray(this.newGroupInvitesList)}" .items="${this.newGroupInvitesList}" aria-label="Group Invites" all-rows-visible>
                <vaadin-grid-column
                    width="6rem"
                    flex-grow="0"
                    header="${translate("websitespage.schange5")}"
                    .renderer=${(root, column, data) => {
	                  render(html`${this.renderAvatar(data.item)}`, root)
	              }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    auto-width
                    resizable
                    header="${translate("puzzlepage.pchange4")}"
                    .renderer=${(root, column, data) => {
                        render(html`${data.item.name}`, root)
                    }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    auto-width
                    resizable
                    header="${translate("login.address")}"
                    .renderer=${(root, column, data) => {
	                  render(html`${data.item.owner}`, root)
	              }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    header="${translate("managegroup.mg43")}"
                    .renderer=${(root, column, data) => {
                        const expiryString = new Date(data.item.expiry).toLocaleString()
                        render(html`${expiryString}`, root)
                    }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    width="9rem"
                    flex-grow="0"
                    header="${translate("websitespage.schange8")}"
                    .renderer=${(root, column, data) => {
                        render(html`${this.renderCancelInviteButton(data.item)}`, root)
                    }}
                ></vaadin-grid-column>
            </vaadin-grid>
            ${this.isEmptyArray(this.newGroupInvitesList) ? html`
                <span style="color: var(--black);">${translate("managegroup.mg35")}</span>
            ` : html``}
            <br><hr><br>
            <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">${translate("managegroup.mg53")}</h3>
            <vaadin-grid theme="large" id="groupJoinsGrid" ?hidden="${this.isEmptyArray(this.newGroupJoinsList)}" .items="${this.newGroupJoinsList}" aria-label="Group Join Requests" all-rows-visible>
                <vaadin-grid-column
                    width="6rem"
                    flex-grow="0"
                    header="${translate("websitespage.schange5")}"
                    .renderer=${(root, column, data) => {
	                  render(html`${this.renderAvatar(data.item)}`, root)
	              }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    auto-width
                    resizable
                    header="${translate("puzzlepage.pchange4")}"
                    .renderer=${(root, column, data) => {
                        render(html`${data.item.name}`, root)
                    }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    auto-width
                    resizable
                    header="${translate("login.address")}"
                    .renderer=${(root, column, data) => {
	                  render(html`${data.item.owner}`, root)
	              }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    width="12rem"
                    flex-grow="0"
                    header="${translate("websitespage.schange8")}"
                    .renderer=${(root, column, data) => {
                        render(html`${this.renderConfirmRequestButton(data.item)}`, root)
                    }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    width="12rem"
                    flex-grow="0"
                    .renderer=${(root, column, data) => {
                        render(html`${this.renderDeclineRequestButton(data.item)}`, root)
                    }}
                ></vaadin-grid-column>
            </vaadin-grid>
            ${this.isEmptyArray(this.newGroupJoinsList) ? html`
                <span style="color: var(--black);">${translate("managegroup.mg54")}</span>
            ` : html``}
            <br>
            <hr>
            <div style="padding-top: 20px;">
                <vaadin-button theme="primary medium" @click=${() => this.openInviteMemberToGroupDialog()}>
                    ${translate("managegroup.mg2")}
                </vaadin-button>
            </div>

            <mwc-dialog id="inviteMemberToGroupDialog" scrimClickAction="" escapeKeyAction="">
                <div class="manage-group-dialog">
                    <div style="text-align: center;">
                        <h2>${translate("managegroup.mg2")}</h2>
                        <hr />
                        <br>
                    </div>
                    <p>
                        <mwc-textfield
                            style="width: 100%; color: var(--black);"
                            required
                            outlined
                            id="toInviteMemberToGroup"
                            label="${translate("managegroup.mg37")}"
                            type="text"
                            value="${this.toInviteMemberToGroup}"
                        >
                        </mwc-textfield>
                    </p>
                        ${translate("managegroup.mg38")}
                        <select required validationMessage="${translate("grouppage.gchange14")}" id="inviteMemberTime" label="Expiry Time">
                            <option value="reject" selected>${translate("grouppage.gchange15")}</option>
                            <option value="10800">3 ${translate("grouppage.gchange24")}</option>
                            <option value="21600">6 ${translate("grouppage.gchange24")}</option>
                            <option value="43200">12 ${translate("grouppage.gchange24")}</option>
                            <option value="86400">1 ${translate("grouppage.gchange25")}</option>
                            <option value="259200">3 ${translate("grouppage.gchange26")}</option>
                            <option value="432000">5 ${translate("grouppage.gchange26")}</option>
                            <option value="604800">7 ${translate("grouppage.gchange26")}</option>
                            <option value="864000">10 ${translate("grouppage.gchange26")}</option>
                            <option value="1296000">15 ${translate("grouppage.gchange26")}</option>
                            <option value="2592000">30 ${translate("grouppage.gchange26")}</option>
                        </select>
                    </p>
                    <div style="margin-bottom: 10px;">
                        <p style="margin-bottom: 0;">${translate("walletpage.wchange21")} <span style="font-weight: bold;">${this.inviteGroupMemberFee} QORT<span></p>
                        <br>
                    </div>
                    ${this.renderClearSuccess()}
                    ${this.renderClearError()}
                    ${this.isLoading ? html`<paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress>` : ''}
                    <div class="buttons">
                        <div>
                            <vaadin-button ?disabled="${this.btnDisable}" theme="primary medium" style="width: 100%;" @click=${() => this.openMemberInfo(this.manageGroupId)}>
                                <vaadin-icon icon="vaadin:user-check" slot="prefix"></vaadin-icon>
                                ${translate("managegroup.mg2")}
                            </vaadin-button>
                        </div>
                    </div>
                </div>
                <mwc-button
                    slot="primaryAction"
                    @click="${() => this.closeInviteMemberToGroupDialog()}"
                    class="red"
                >
                ${translate("general.close")}
                </mwc-button>
            </mwc-dialog>

            <mwc-dialog id="cancelInviteMemberToGroupDialog" scrimClickAction="" escapeKeyAction="">
                <div class="manage-group-dialog">
                    <div style="text-align: center;">
                        <h2>${translate("managegroup.mg47")}</h2>
                        <hr />
                        <br>
                    </div>
                    <p>
                        <mwc-textfield
                            style="width: 100%; color: var(--black);"
                            readOnly
                            outlined
                            id="toCancelInviteMemberName"
                            label="${translate("managegroup.mg18")}"
                            type="text"
                            value="${this.toCancelInviteMemberName}"
                        >
                        </mwc-textfield>
                    </p>
                    <p>
                        <mwc-textfield
                            style="width: 100%; color: var(--black);"
                            required
                            readOnly
                            outlined
                            id="toCancelInviteMemberAddress"
                            label="${translate("managegroup.mg19")}"
                            type="text"
                            value="${this.toCancelInviteMemberAddress}"
                        >
                        </mwc-textfield>
                    </p>
                    <div style="margin-bottom: 10px;">
                        <p style="margin-bottom: 0;">${translate("walletpage.wchange21")} <span style="font-weight: bold;">${this.cancelInviteGroupMemberFee} QORT<span></p>
                        <br>
                    </div>
                    ${this.renderClearSuccess()}
                    ${this.renderClearError()}
                    ${this.isLoading ? html`<paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress>` : ''}
                    <div class="buttons">
                        <div>
                            <vaadin-button ?disabled="${this.btnDisable}" theme="primary medium" style="width: 100%;" @click=${() => this.cancelInviteGroupMember(this.manageGroupId)}>
                                <vaadin-icon icon="vaadin:exit" slot="prefix"></vaadin-icon>
                                ${translate("managegroup.mg47")}
                            </vaadin-button>
                        </div>
                    </div>
                </div>
                <mwc-button
                    slot="primaryAction"
                    @click="${() => this.closeCancelInviteMemberToGroupDialog()}"
                    class="red"
                >
                ${translate("general.close")}
                </mwc-button>
            </mwc-dialog>

            <mwc-dialog id="userErrorDialog" scrimClickAction="" escapeKeyAction="">
                <div class="card-container">
                    <mwc-icon class="error-icon">warning</mwc-icon>
                    <h2>${translate("explorerpage.exp4")}</h2>
                    <h4>${translate("explorerpage.exp5")}</h4>
                </div>

                <mwc-button
                    slot="primaryAction"
                    @click=${() => this.closeErrorDialog()}
                    class="red"
                >
                ${translate("general.close")}
                </mwc-button>
            </mwc-dialog>

            <mwc-dialog id="fieldErrorDialog" scrimClickAction="" escapeKeyAction="">
                <div>
                    <mwc-icon class="error-icon">warning</mwc-icon>
                    <h2>${translate("managegroup.mg39")}</h2>
                    <h4>${translate("walletpage.wchange44")}</h4>
                </div>

                <mwc-button
                    slot="primaryAction"
                    @click=${() => this.closeFieldErrorDialog()}
                    class="red"
                >
                ${translate("general.close")}
                </mwc-button>
            </mwc-dialog>

            <mwc-dialog id="successJoinDialog" scrimClickAction="" escapeKeyAction="">
                <div class="card-container">
                    <mwc-icon class="success-icon">group_add</mwc-icon>
                    <h2>${translate("managegroup.mg57")}</h2>
                    <h4>${translate("walletpage.wchange43")}</h4>
                </div>

                <mwc-button
                    slot="primaryAction"
                    @click=${() => this.closeSuccessJoinDialog()}
                    class="red"
                >
                ${translate("general.close")}
                </mwc-button>
            </mwc-dialog>

            <mwc-dialog id="errorJoinDialog" scrimClickAction="" escapeKeyAction="">
                <div class="card-container">
                    <mwc-icon class="error-icon">warning</mwc-icon>
                    <h2>${translate("managegroup.mg58")}</h2>
                    <h4>${this.errorMessage}</h4>
                    <h4>${translate("walletpage.wchange44")}</h4>
                </div>

                <mwc-button
                    slot="primaryAction"
                    @click=${() => this.closeErrorJoinDialog()}
                    class="red"
                >
                ${translate("general.close")}
                </mwc-button>
            </mwc-dialog>

            <mwc-dialog id="cancelSuccessJoinDialog" scrimClickAction="" escapeKeyAction="">
                <div class="card-container">
                    <mwc-icon class="success-icon">person_remove</mwc-icon>
                    <h2>${translate("managegroup.mg59")}</h2>
                    <h4>${translate("walletpage.wchange43")}</h4>
                </div>

                <mwc-button
                    slot="primaryAction"
                    @click=${() => this.closeCancelSuccessJoinDialog()}
                    class="red"
                >
                ${translate("general.close")}
                </mwc-button>
            </mwc-dialog>

            <mwc-dialog id="cancelErrorJoinDialog" scrimClickAction="" escapeKeyAction="">
                <div class="card-container">
                    <mwc-icon class="error-icon">warning</mwc-icon>
                    <h2>${translate("managegroup.mg58")}</h2>
                    <h4>${this.errorMessage}</h4>
                    <h4>${translate("walletpage.wchange44")}</h4>
                </div>

                <mwc-button
                    slot="primaryAction"
                    @click=${() => this.closeCancelErrorJoinDialog()}
                    class="red"
                >
                ${translate("general.close")}
                </mwc-button>
            </mwc-dialog>
        `
    }

    groupAdminTemplate() {
        return html`
            <vaadin-grid theme="large" id="groupAdminsGrid" ?hidden="${this.isEmptyArray(this.newAdminsList)}" .items="${this.newAdminsList}" aria-label="Group Admins" all-rows-visible>
                <vaadin-grid-column
                    width="6rem"
                    flex-grow="0"
                    header="${translate("websitespage.schange5")}"
                    .renderer=${(root, column, data) => {
	                  render(html`${this.renderAvatar(data.item)}`, root)
	              }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    auto-width
                    resizable
                    header="${translate("puzzlepage.pchange4")}"
                    .renderer=${(root, column, data) => {
                        render(html`${data.item.name}`, root)
                    }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    auto-width
                    resizable
                    header="${translate("login.address")}"
                    .renderer=${(root, column, data) => {
	                  render(html`${data.item.owner}`, root)
	              }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    auto-width
                    resizable
                    header="${translate("managegroup.mg9")}"
                    .renderer=${(root, column, data) => {
                        const dateString = new Date(data.item.joined).toLocaleDateString()
                        render(html`${dateString}`, root)
                    }}
                ></vaadin-grid-column>
                <vaadin-grid-column
                    width="9rem"
                    flex-grow="0"
                    header="${translate("websitespage.schange8")}"
                    .renderer=${(root, column, data) => {
                        if (this.theGroupOwner === data.item.owner) {
                            render(html``, root)
                        } else {
                            render(html`${this.renderKickAdminButton(data.item.owner)}`, root)
                        }
                    }}
                ></vaadin-grid-column>
            </vaadin-grid>

            <mwc-dialog id="kickGroupAdminDialog" scrimClickAction="" escapeKeyAction="">
                <div class="manage-group-dialog">
                    <div style="text-align: center;">
                        <h2>${translate("managegroup.mg13")}</h2>
                        <hr />
                        <br>
                    </div>
                    <p>
                        <mwc-textfield
                            style="width: 100%; color: var(--black);"
                            required
                            readOnly
                            outlined
                            id="kickGroupAdminAddress"
                            label="${translate("managegroup.mg14")}"
                            type="text"
                            value="${this.kickGroupAdminAddress}"
                        >
                        </mwc-textfield>
                    </p>
                    <div style="margin-bottom: 10px;">
                        <p style="margin-bottom: 0;">${translate("walletpage.wchange21")} <span style="font-weight: bold;">${this.kickGroupAdminFee} QORT<span></p>
                        <br>
                    </div>
                    ${this.renderClearSuccess()}
                    ${this.renderClearError()}
                    ${this.isLoading ? html`<paper-progress indeterminate style="width: 100%; margin: 4px;"></paper-progress>` : ''}
                    <div class="buttons">
                        <div>
                            <vaadin-button ?disabled="${this.btnDisable}" theme="primary medium" style="width: 100%;" @click=${() => this.kickGroupAdmin(this.manageGroupId)}>
                                <vaadin-icon icon="vaadin:minus-circle-o" slot="prefix"></vaadin-icon>
                                ${translate("managegroup.mg13")}
                            </vaadin-button>
                        </div>
                    </div>
                </div>
                <mwc-button
                    slot="primaryAction"
                    @click="${() => this.closeKickGroupAdminDialog()}"
                    class="red"
                >
                ${translate("general.close")}
                </mwc-button>
            </mwc-dialog>
        `
    }

    groupUpdateTemplate() {
        return html`
            <div style="text-align: center;">
                <span><h1>${translate("managegroup.mg50")}</h1></span>
            </div>
        `
    }

    render() {
        return html`
            <div id="group-management-page">
                <div style="min-height: 48px; display: flex; padding-bottom: 6px; margin: 2px;">
                    <h2 style="margin: 0; flex: 1; padding-top: .1em; display: inline;">${translate("grouppage.gchange1")}</h2>
                    <mwc-button style="float:right;" @click=${() => this.shadowRoot.querySelector('#createGroupDialog').show()}><mwc-icon>add</mwc-icon>${translate("grouppage.gchange2")}</mwc-button>
                </div>

                <div class="divCard">
                    <h3 style="margin: 0; margin-bottom: 1em; text-align: left;">${translate("grouppage.gchange55")}</h3>
	              <div id="search">
	                  <vaadin-text-field
                            theme="medium"
                            style="width: 20em"
                            minlength="3"
                            maxlength="32"
                            id="searchGroupName"
                            placeholder="${translate("grouppage.gchange56")}"
                            value="${this.searchGroupName}"
                            @keydown="${this.searchGroupListener}"
                            clear-button-visible
                         >
	                      <vaadin-icon slot="prefix" icon="vaadin:user"></vaadin-icon>
	                  </vaadin-text-field>&nbsp;&nbsp;<br>
                        <vaadin-button theme="medium" @click="${(e) => this.doGroupSearch(e)}">
	                      <vaadin-icon icon="vaadin:search" slot="prefix"></vaadin-icon>
	                      ${translate("websitespage.schange35")}
                        </vaadin-button>
	              </div><br />
                    <vaadin-grid theme="large" id="priveGroupSearchGrid" ?hidden="${this.isEmptyArray(this.privateGroupSearch)}" .items="${this.privateGroupSearch}" aria-label="My Search Result" all-rows-visible>
                        <vaadin-grid-column width="8rem" flex-grow="0" header="${translate("grouppage.gchange54")}" path="memberCount"></vaadin-grid-column>
                        <vaadin-grid-column header="${translate("grouppage.gchange4")}" path="groupName"></vaadin-grid-column>
                        <vaadin-grid-column header="${translate("managegroup.mg42")}" .renderer=${(root, column, data) => {
                            if (data.item.isOpen === true) {
                                render(html`${translate("managegroup.mg44")}`, root)
                            } else {
                                render(html`${translate("managegroup.mg45")}`, root)
                            }
                        }}></vaadin-grid-column>
                        <vaadin-grid-column header="${translate("grouppage.gchange5")}" path="description"></vaadin-grid-column>
                        <vaadin-grid-column header="${translate("grouppage.gchange10")}" path="owner"></vaadin-grid-column>
                        <vaadin-grid-column width="11rem" flex-grow="0" header="${translate("grouppage.gchange7")}" .renderer=${(root, column, data) => {
                            render(html`<mwc-button @click=${() => this.joinGroup(data.item)}><mwc-icon>queue</mwc-icon>&nbsp;${translate("grouppage.gchange51")}</mwc-button>`, root)
                        }}></vaadin-grid-column>
                    </vaadin-grid>
                </div>

                <div class="divCard">
                    <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">${translate("grouppage.gchange3")}</h3>
                    <vaadin-grid theme="large" id="joinedGroupsGrid" ?hidden="${this.isEmptyArray(this.joinedGroups)}" .items="${this.joinedGroups}" aria-label="Joined Groups" all-rows-visible>
                        <vaadin-grid-sort-column width="8rem" flex-grow="0" header="${translate("grouppage.gchange54")}" path="memberCount"></vaadin-grid-sort-column>
                        <vaadin-grid-sort-column header="${translate("grouppage.gchange4")}" path="groupName"></vaadin-grid-sort-column>
                        <vaadin-grid-sort-column header="${translate("grouppage.gchange5")}" path="description"></vaadin-grid-sort-column>
                        <vaadin-grid-column width="11rem" flex-grow="0" header="${translate("grouppage.gchange6")}" .renderer=${(root, column, data) => {
                            render(html`${this.renderRole(data.item)}`, root)
                        }}></vaadin-grid-column>
                        <vaadin-grid-column width="11rem" flex-grow="0" header="${translate("registernamepage.nchange7")}" .renderer=${(root, column, data) => {
                            render(html`${this.renderManageButton(data.item)}`, root)
                        }}></vaadin-grid-column>
                    </vaadin-grid>
                    ${this.isEmptyArray(this.joinedGroups) ? html`
                        <div style="text-align: center;">
                            <span style="color: var(--black);">${translate("grouppage.gchange8")}</span>
                        </div>
                    `: ''}
                </div>

                <div class="divCard">
                    <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">${translate("managegroup.mg36")}</h3>
                    <vaadin-grid theme="large" id="openGroupInvitesGrid" ?hidden="${this.isEmptyArray(this.groupInvites)}" .items="${this.groupInvites}" aria-label="My Group Invites" all-rows-visible>
                        <vaadin-grid-column width="8rem" flex-grow="0" header="${translate("grouppage.gchange54")}" path="memberCount"></vaadin-grid-column>
                        <vaadin-grid-column header="${translate("grouppage.gchange4")}" path="groupName"></vaadin-grid-column>
                        <vaadin-grid-column header="${translate("managegroup.mg42")}" .renderer=${(root, column, data) => {
                            if (data.item.isOpen === true) {
                                render(html`${translate("managegroup.mg44")}`, root)
                            } else {
                                render(html`${translate("managegroup.mg45")}`, root)
                            }
                        }}></vaadin-grid-column>
                        <vaadin-grid-column header="${translate("managegroup.mg43")}" .renderer=${(root, column, data) => {
                            const expiryString = new Date(data.item.expiry).toLocaleString()
                            render(html`${expiryString}`, root)
                        }}></vaadin-grid-column>
                        <vaadin-grid-column width="11rem" flex-grow="0" header="${translate("grouppage.gchange7")}" .renderer=${(root, column, data) => {
                            render(html`<mwc-button @click=${() => this.joinGroup(data.item)}><mwc-icon>queue</mwc-icon>&nbsp;${translate("grouppage.gchange51")}</mwc-button>`, root)
                        }}></vaadin-grid-column>
                    </vaadin-grid>
                    ${this.isEmptyArray(this.groupInvites) ? html`
                        <div style="text-align: center;">
                            <span style="color: var(--black);">${translate("managegroup.mg35")}</span>
                        </div>
                    `: ''}
                </div>

                <div class="divCard">
                    <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">${translate("grouppage.gchange9")}</h3>
                    <vaadin-text-field
                        placeholder="${translate("datapage.dchange4")}"
                        style="width: 25%; margin-bottom: 20px;"
                        clear-button-visible
                        @value-changed="${(e) => {
                            this.filteredItems = []
                            const searchTerm = (e.target.value || '').trim()
                            const keys = ['groupName', 'description', 'owner']
                            const filtered = this.publicGroups.filter((search) => keys.some((key) => search[key].toLowerCase().includes(searchTerm.toLowerCase())))
                            this.filteredItems = filtered
                        }}"
                    >
                    <vaadin-icon slot="prefix" icon="vaadin:search"></vaadin-icon>
                    </vaadin-text-field><br>
                    <vaadin-grid theme="large" id="publicGroupsGrid" .items="${this.filteredItems}" aria-label="Public Open Groups" all-rows-visible>
                        <vaadin-grid-sort-column width="8rem" flex-grow="0" header="${translate("grouppage.gchange54")}" path="memberCount"></vaadin-grid-sort-column>
                        <vaadin-grid-sort-column header="${translate("grouppage.gchange4")}" path="groupName"></vaadin-grid-sort-column>
                        <vaadin-grid-sort-column header="${translate("grouppage.gchange5")}" path="description"></vaadin-grid-sort-column>
                        <vaadin-grid-sort-column header="${translate("grouppage.gchange10")}" path="owner"></vaadin-grid-sort-column>
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
                    <p>
                        <mwc-textfield
                            style="width: 100%; color: var(--black);"
                            ?disabled="${this.isLoading}"
                            required
                            outlined
                            id="groupNameInput"
                            label="${translate("grouppage.gchange4")}"
                            type="text"
                            helper="${translate("managegroup.mg51")}"
                            maxLength="32"
                            charCounter="true"
                        >
                        </mwc-textfield>
                    </p>
                    <p>
                        <mwc-textfield
                            style="width: 100%; color: var(--black);"
                            ?disabled="${this.isLoading}"
                            required
                            outlined
                            id="groupDescInput"
                            label="${translate("grouppage.gchange5")}"
                            type="text"
                            helper="${translate("managegroup.mg52")}"
                            maxLength="128"
                            charCounter="true"
                        >
                        </mwc-textfield>
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
                        </span><br>
                        <span>
                            <b>${translate("walletpage.wchange21")} ${this.createFee} QORT.</b>
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
                    </div>

                    <div style="text-align:right; height:36px;">
                        <span ?hidden="${!this.isLoading}">
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
                        </span><br>
                        <span>
                            <b>${translate("walletpage.wchange21")} ${this.joinFee} QORT.</b>
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
                        </span><br>
                        <span>
                            <b>${translate("walletpage.wchange21")} ${this.leaveFee} QORT.</b>
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

                <paper-dialog id="manageGroupOwnerDialog" class="nanage-group" modal>
                    <div class="actions">
                        <h2>${translate("grouppage.gchange4")}: ${this.manageGroupName} / ${translate("managegroup.mg8")}: ${this.manageGroupId} / ${translate("grouppage.gchange54")}: ${this.manageGroupCount}</h2>
                        <mwc-icon class="close-icon" @click=${ () => this.closeManageGroupOwnerDialog()} title="${translate("managegroup.mg5")}">highlight_off</mwc-icon>
                    </div>
                    <div class="container">
                        <div class="wrapper">
                            <div class="leftBar" style="display: table; width: 100%;">
                                <div class="slug">${translate("grouppage.gchange40")}</div>
                                <ul>
                                    <li @click=${ () => this.setManageGroupView('group-members')}><a class=${this.selectedView.id === 'group-members' ? 'active' : ''} href="javascript:void(0)">${translate("managegroup.mg1")}</a></li>
                                    <li @click=${ () => this.setManageGroupView('group-banned')}><a class=${this.selectedView.id === 'group-banned' ? 'active' : ''} href="javascript:void(0)">${translate("managegroup.mg25")}</a></li>
                                    <li @click=${ () => this.setManageGroupView('group-admin')}><a class=${this.selectedView.id === 'group-admin' ? 'active' : ''} href="javascript:void(0)">${translate("managegroup.mg3") }</a></li>
                                    <li @click=${ () => this.setManageGroupView('group-invite')}><a class=${this.selectedView.id === 'group-invite' ? 'active' : ''} href="javascript:void(0)">${translate("managegroup.mg2")}</a></li>
                                    <li @click=${ () => this.setManageGroupView('group-update')}><a class=${this.selectedView.id === 'group-update' ? 'active' : ''} href="javascript:void(0)">${translate("managegroup.mg4")}</a></li>
                                </ul>
                            </div>
                            <div class="mainPage">
                                <h1>${this.renderManageGroupHeaderViews()}</h1>
                                <hr><br>
                                ${html`${this.renderManageGroupViews(this.selectedView)}`}
                            </div>
                        </div>
                    </div>
                </paper-dialog>

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

                <mwc-dialog id="privateGroupErrorDialog" scrimClickAction="" escapeKeyAction="">
                    <div style="text-align: center;">
                        <mwc-icon class="error-icon">warning</mwc-icon>
                        <h2>${translate("grouppage.gchange57")}</h2>
                        <h4>${translate("grouppage.gchange58")}</h4>
                    </div>

                    <mwc-button
                        slot="primaryAction"
                        @click=${() => this.closePrivateGroupErrorDialog()}
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
        this.unitAddGroupAdminFee()
        this.unitKickGroupAdminFee()
        this.unitCreateBanFee()
        this.unitCancelBanFee()
        this.unitKickGroupMemberFee()
        this.unitInviteGroupMemberFee()
        this.unitCancelInviteGroupMemberFee()

        const getOpenPublicGroups = async () => {
            let openG = await parentEpml.request('apiCall', {
                url: `/groups?limit=0&reverse=true`
            })
            let myGs = openG.filter(myG => myG.isOpen === true)
            return myGs
        }

        const getPrivateGroups = async () => {
            let privateG = await parentEpml.request('apiCall', {
                url: `/groups?limit=0&reverse=true`
            })
            let myPgs = privateG.filter(myP => myP.isOpen === false)
            return myPgs
        }

        const getJoinedGroups = async () => {
            let joinedG = await parentEpml.request('apiCall', {
                url: `/groups/member/${this.selectedAddress.address}`
            })
            return joinedG
        }
        const getGroupInfo = async (groupId) => {
            let joinedG = await parentEpml.request('apiCall', {
                url: `/groups/${groupId}`
            })
            return joinedG
        }

        const getGroupInvites = async () => {
            const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
            const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port

            let timerGroupInvites
            let myInvitesObj = []
            let myArrObj = []
            this.myGroupInvites = []
            this.myGroupIdArr = []

            await parentEpml.request('apiCall', {
                url: `/groups/invites/${this.selectedAddress.address}`
            }).then(res => {
                this.myGroupInvites = res
            })

            if (this.isEmptyArray(this.myGroupInvites) === true) {
                clearTimeout(timerGroupInvites)
                timerGroupInvites = setTimeout(getGroupInvites, 300000)
            } else {
                const currentTime = Date.now()
                this.myGroupInvites.forEach(a => {
                if (a.expiry > currentTime) {
                    let callTheNewInviteUrl = `${nodeUrl}/groups/${a.groupId}`
                    fetch(callTheNewInviteUrl).then(res => {
                        return res.json()
                    }).then(jsonRes => {
                        myArrObj.push(jsonRes)
                        if (myArrObj.length) {
                            myArrObj.forEach(b => {
                                const infoObjToAdd = {
                                    invitee: a.invitee,
                                    groupId: b.groupId,
                                    owner: b.owner,
                                    groupName: b.groupName,
                                    description: b.description,
                                    created: b.created,
                                    isOpen: b.isOpen,
                                    memberCount: b.memberCount,
                                    expiry: a.expiry
                                }
                                myInvitesObj.push(infoObjToAdd)
                            })
                        }
                        this.groupInvites = myInvitesObj
                    })
                }
                })
            }
            setTimeout(getGroupInvites, 300000)
        }

        const getOpen_JoinedGroups = async () => {
            let _joinedGroups = await getJoinedGroups()
            let _publicGroups = await getOpenPublicGroups()
            let _privateGroups = await getPrivateGroups()
            let results = _publicGroups.filter(myOpenGroup => {
                let value = _joinedGroups.some(myJoinedGroup => myOpenGroup.groupId === myJoinedGroup.groupId)
                return !value
            });
            this.publicGroups = results
            this.privateGroups = _privateGroups
            this.joinedGroups = _joinedGroups
            this.filteredItems = this.publicGroups
            setTimeout(getOpen_JoinedGroups, 600000)
        }

        if (!isElectron()) {
        } else {
            window.addEventListener('contextmenu', (event) => {
                event.preventDefault()
                window.parent.electronAPI.showMyMenu()
            })
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

        let configLoaded = false

        parentEpml.ready().then(() => {
            parentEpml.subscribe('selected_address', async selectedAddress => {
                this.selectedAddress = {}
                selectedAddress = JSON.parse(selectedAddress)
                if (!selectedAddress || Object.entries(selectedAddress).length === 0) return
                this.selectedAddress = selectedAddress
            })
            parentEpml.subscribe('side_effect_action', async sideEffectActionParam => {
                const sideEffectAction = JSON.parse(sideEffectActionParam)

                if(sideEffectAction && sideEffectAction.type === 'openJoinGroupModal'){
                   const res = await getGroupInfo(sideEffectAction.data)
                   if(res && res.groupId){
                    if(res.isOpen){
                        this.joinGroup(res)

                    } else {
                        let snackbarstring = get("managegroup.mg45")
                        parentEpml.request('showSnackBar', `${snackbarstring}`)
                    }
                   }
                   window.parent.reduxStore.dispatch(
                    window.parent.reduxAction.setSideEffectAction(null)
                );
                }
            })
            parentEpml.subscribe('config', c => {
                if (!configLoaded) {
                    setTimeout(getOpen_JoinedGroups, 1)
                    setTimeout(getGroupInvites, 1)
                    configLoaded = true
                }
                this.config = JSON.parse(c)
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

    renderSuccessText() {
        return html`${translate("walletpage.wchange30")}`
    }

    renderClearSuccess() {
        let strSuccessValue = this.successMessage
        if (strSuccessValue === "") {
            return html``
        } else {
            return html`
                <div class="successBox">
                    <span style="color: green; float: left; padding-top: 4px; padding-left: 7px;">${this.successMessage}</span>
                    <span style="padding-top: 4px: padding-right: 7px; float: right;"><mwc-icon-button class="btn-clear-success" title="${translate("general.close")}" icon="close" @click="${() => this.successMessage = ''}"></mwc-icon-button></span>
                </div>
                <div style="margin-bottom: 15px;">
                    <p style="margin-bottom: 0;">${translate("walletpage.wchange43")}</p>
                </div>
            `
        }
    }

    renderClearError() {
        let strErrorValue = this.errorMessage
        if (strErrorValue === "") {
            return html``
        } else {
            return html`
                <div class="errorBox">
                    <span style="color: red; float: left; padding-top: 4px; padding-left: 7px;">${this.errorMessage}</span>
                    <span style="padding-top: 4px: padding-right: 7px; float: right;"><mwc-icon-button class="btn-clear-error" title="${translate("general.close")}" icon="close" @click="${() => this.errorMessage = ''}"></mwc-icon-button></span>
                </div>
                <div style="margin-bottom: 15px;">
                    <p style="margin-bottom: 0;">${translate("walletpage.wchange44")}</p>
                </div>
            `
        }
    }

    searchGroupListener(e) {
        if (e.key === 'Enter') {
            this.doGroupSearch(e)
        }
    }

    doGroupSearch(e) {
        this.renderSearchResult()
    }

    renderSearchResult() {
        this.privateGroupSearch = []
        let searchGroupName = this.shadowRoot.getElementById('searchGroupName').value
        if (searchGroupName.length === 0) {
            let err1string = get("websitespage.schange34")
            parentEpml.request('showSnackBar', `${err1string}`)
        } else {
            this.privateGroupSearch = this.privateGroups.filter(myS => myS.groupName === searchGroupName)
            if (this.privateGroupSearch.length === 0) {
                this.shadowRoot.querySelector('#privateGroupErrorDialog').show()
            }
        }
    }

    closePrivateGroupErrorDialog() {
        this.shadowRoot.querySelector('#privateGroupErrorDialog').close()
        this.shadowRoot.getElementById('searchGroupName').value = ''
        this.privateGroupSearch = []
    }

    renderBanButton(groupObj) {
        return html`<mwc-button class="red" @click=${() => this.openCreateBanMemberDialog(groupObj)}><mwc-icon>hardware</mwc-icon>&nbsp;${translate("managegroup.mg6")}</mwc-button>`
    }

    openCreateBanMemberDialog(groupObj) {
        this.toBanName = ''
        this.toBanAddress = ''
        this.banReason = ''
        this.shadowRoot.getElementById("banReason").value = ''
        this.shadowRoot.getElementById("banMemberTime").value = 'reject'
        this.toBanName = groupObj.name
        this.toBanAddress = groupObj.owner
        this.shadowRoot.querySelector('#createBanMemberDialog').show()
    }

    closeCreateBanMemberDialog() {
        this.shadowRoot.querySelector('#createBanMemberDialog').close()
        this.shadowRoot.getElementById('toBanName').value = ''
        this.shadowRoot.getElementById('toBanAddress').value = ''
        this.shadowRoot.getElementById("banReason").value = ''
        this.shadowRoot.getElementById("banMemberTime").value = 'reject'
        this.toBanName = ''
        this.toBanAddress = ''
        this.banReason = ''
        this.successMessage = ''
        this.errorMessage = ''
    }

    renderCancelBanButton(groupObj) {
        return html`<mwc-button class="warning" title="${translate("managegroup.mg26")}" @click=${() => this.openCancelBanMemberDialog(groupObj)}><mwc-icon>person_remove</mwc-icon>&nbsp;&nbsp;${translate("managegroup.mg26")}</mwc-button>`
    }

    openCancelBanMemberDialog(groupObj) {
        this.toCancelBanName = ''
        this.toCancelBanAddress = ''
        this.toCancelBanName = groupObj.name
        this.toCancelBanAddress = groupObj.owner
        this.shadowRoot.querySelector('#cancelBanMemberDialog').show()
    }

    closeCancelBanMemberDialog() {
        this.shadowRoot.querySelector('#cancelBanMemberDialog').close()
        this.shadowRoot.getElementById('toCancelBanName').value = ''
        this.shadowRoot.getElementById('toCancelBanAddress').value = ''
        this.toCancelBanName = ''
        this.toCancelBanAddress = ''
        this.successMessage = ''
        this.errorMessage = ''
    }

    renderKickGroupMemberButton(groupObj) {
        return html`<mwc-button class="warning" title="${translate("managegroup.mg31")}" @click=${() => this.openKickGroupMemberDialog(groupObj)}><mwc-icon>exit_to_app</mwc-icon>&nbsp;${translate("managegroup.mg7")}</mwc-button>`
    }

    openKickGroupMemberDialog(groupObj) {
        this.toKickMemberName = ''
        this.toKickMemberAddresss = ''
        this.kickMemberReason = ''
        this.toKickMemberName = groupObj.name
        this.toKickMemberAddress = groupObj.owner
        this.shadowRoot.querySelector('#kickGroupMemberDialog').show()
    }

    closeKickGroupMemberDialog() {
        this.shadowRoot.querySelector('#kickGroupMemberDialog').close()
        this.shadowRoot.getElementById('toKickMemberName').value = ''
        this.shadowRoot.getElementById('toKickMemberAddress').value = ''
        this.shadowRoot.getElementById('kickMemberReason').value = ''
        this.toKickMemberName = ''
        this.toKickMemberAddress = ''
        this.kickMemberReason = ''
        this.successMessage = ''
        this.errorMessage = ''
    }

    renderMakeAdminButton(groupObj) {
        return html`<mwc-button class="green" title="${translate("managegroup.mg10")}" @click=${() => this.openAddGroupAdminDialog(groupObj)}><mwc-icon>queue</mwc-icon>&nbsp;${translate("grouppage.gchange52")}</mwc-button>`
    }

    openAddGroupAdminDialog(makeAdmin) {
        this.memberToAdmin = ''
        this.memberToAdmin = makeAdmin
        this.shadowRoot.querySelector('#addGroupAdminDialog').show()
    }

    closeAddGroupAdminDialog() {
        this.shadowRoot.querySelector('#addGroupAdminDialog').close()
        this.shadowRoot.getElementById('memberToAdmin').value = ''
        this.memberToAdmin = ''
        this.successMessage = ''
        this.errorMessage = ''
    }

    renderKickAdminButton(groupObj) {
        return html`<mwc-button class="red" title="${translate("managegroup.mg13")}" @click=${() => this.openKickGroupAdminDialog(groupObj)}><mwc-icon>exit_to_app</mwc-icon>&nbsp;${translate("managegroup.mg7")}</mwc-button>`
    }

    openKickGroupAdminDialog(kickAdmin) {
        this.kickGroupAdminAddress = ''
        this.kickGroupAdminAddress = kickAdmin
        this.shadowRoot.querySelector('#kickGroupAdminDialog').show()
    }

    closeKickGroupAdminDialog() {
        this.shadowRoot.querySelector('#kickGroupAdminDialog').close()
        this.shadowRoot.getElementById('kickGroupAdminAddress').value = ''
        this.kickGroupAdminAddress = ''
        this.successMessage = ''
        this.errorMessage = ''
    }

    openInviteMemberToGroupDialog() {
        this.shadowRoot.getElementById("toInviteMemberToGroup").value = ''
        this.shadowRoot.getElementById("inviteMemberTime").value = 'reject'
        this.toInviteMemberToGroup = ''
        this.successMessage = ''
        this.errorMessage = ''
        this.shadowRoot.querySelector('#inviteMemberToGroupDialog').show()
    }

    closeInviteMemberToGroupDialog() {
        this.shadowRoot.querySelector('#inviteMemberToGroupDialog').close()
        this.shadowRoot.getElementById('toInviteMemberToGroup').value = ''
        this.shadowRoot.getElementById("inviteMemberTime").value = 'reject'
        this.toInviteMemberToGroup = ''
        this.inviteMemberTime = 'reject'
        this.successMessage = ''
        this.errorMessage = ''
    }

    renderCancelInviteButton(groupObj) {
        return html`<mwc-button class="red" title="${translate("managegroup.mg46")}" @click=${() => this.openCancelInviteMemberToGroupDialog(groupObj)}><mwc-icon>cancel_schedule_send</mwc-icon>&nbsp;${translate("apipage.achange4")}</mwc-button>`
    }

    openCancelInviteMemberToGroupDialog(groupObj) {
        this.toCancelInviteMemberName = groupObj.name
        this.toCancelInviteMemberAddress = groupObj.owner
        this.successMessage = ''
        this.errorMessage = ''
        this.shadowRoot.querySelector('#cancelInviteMemberToGroupDialog').show()
    }

    closeCancelInviteMemberToGroupDialog() {
        this.shadowRoot.querySelector('#cancelInviteMemberToGroupDialog').close()
        this.shadowRoot.getElementById('toCancelInviteMemberName').value = ''
        this.shadowRoot.getElementById("toCancelInviteMemberAddress").value = ''
        this.toCancelInviteMemberName = ''
        this.toCancelInviteMemberAddress = ''
        this.successMessage = ''
        this.errorMessage = ''
    }

    renderConfirmRequestButton(joinObj) {
        return html`<mwc-button class="green" @click=${() => this.createAcceptJoinGroupMember(joinObj)}><mwc-icon>add_task</mwc-icon>&nbsp;${translate("transpage.tchange3")}</mwc-button>`
    }

    renderDeclineRequestButton(joinObj) {
        return html`<mwc-button class="red" @click=${() => this.kickJoinGroupMember(joinObj)}><mwc-icon>cancel</mwc-icon>&nbsp;${translate("transpage.tchange2")}</mwc-button>`
    }

    closeSuccessJoinDialog() {
        this.shadowRoot.querySelector('#successJoinDialog').close()
        this.successMessage = ''
        this.errorMessage = ''
    }

    closeErrorJoinDialog() {
        this.shadowRoot.querySelector('#errorJoinDialog').close()
        this.successMessage = ''
        this.errorMessage = ''
    }

    closeCancelSuccessJoinDialog() {
        this.shadowRoot.querySelector('#cancelSuccessJoinDialog').close()
        this.successMessage = ''
        this.errorMessage = ''
    }

    closeCancelErrorJoinDialog() {
        this.shadowRoot.querySelector('#cancelErrorJoinDialog').close()
        this.successMessage = ''
        this.errorMessage = ''
    }

    openMemberInfo(inviteGroupId) {
        const _inviteMemberInfo = this.shadowRoot.getElementById('toInviteMemberToGroup').value
        const _nviteMemberTime = this.shadowRoot.getElementById("inviteMemberTime").value
        const _inviteGroupId = inviteGroupId

        if (_inviteMemberInfo === '' || _nviteMemberTime === 'reject') {
            this.shadowRoot.querySelector('#fieldErrorDialog').show()
        } else {
            if (_inviteMemberInfo.startsWith('Q') && _inviteMemberInfo.length == 34) {
                this.getAddressUserResult(_inviteMemberInfo, _nviteMemberTime, _inviteGroupId)
            } else {
                this.getNameUserResult(_inviteMemberInfo, _nviteMemberTime, _inviteGroupId)
            }
        }
    }

    async getAddressUserResult(_inviteMemberInfo, _nviteMemberTime, _inviteGroupId) {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const addressUrl = `${nodeUrl}/addresses/${_inviteMemberInfo}`

        await fetch(addressUrl).then(res => {
            if (res.status === 400) {
                this.shadowRoot.querySelector('#userErrorDialog').show()
            } else {
                this.createInviteGroupMember(_inviteMemberInfo, _nviteMemberTime, _inviteGroupId)
            }
        })
    }

    async getNameUserResult(_inviteMemberInfo, _nviteMemberTime, _inviteGroupId) {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const nameUrl = `${nodeUrl}/names/${_inviteMemberInfo}`

        await fetch(nameUrl).then(res => {
            if (res.status === 404) {
                this.shadowRoot.querySelector('#userErrorDialog').show()
            } else {
                this.getAddressFromName(_inviteMemberInfo, _nviteMemberTime, _inviteGroupId)
            }
        })
    }

    async getAddressFromName(_inviteMemberInfo, _nviteMemberTime, _inviteGroupId) {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const fromNameUrl = `${nodeUrl}/names/${_inviteMemberInfo}`

        const qortalNameInfo = await fetch(fromNameUrl).then(response => {
            return response.json()
        })

        this.nameAddressResult = qortalNameInfo
        const _inviteMemberNameInfo = this.nameAddressResult.owner
        this.createInviteGroupMember(_inviteMemberNameInfo, _nviteMemberTime, _inviteGroupId)
    }

    closeErrorDialog() {
        this.shadowRoot.querySelector('#userErrorDialog').close()
    }

    closeFieldErrorDialog() {
        this.shadowRoot.querySelector('#fieldErrorDialog').close()
    }

    async unitCreateFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/transactions/unitfee?txType=CREATE_GROUP`
        await fetch(url).then((response) => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response)
        }).then((json) => {
            this.createFee = (Number(json) / 1e8).toFixed(8)
        })
    }

    async unitJoinFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/transactions/unitfee?txType=JOIN_GROUP`
        await fetch(url).then((response) => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response)
        }).then((json) => {
            this.joinFee = (Number(json) / 1e8).toFixed(8)
        })
    }

    async unitLeaveFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/transactions/unitfee?txType=LEAVE_GROUP`
        await fetch(url).then((response) => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response)
        }).then((json) => {
            this.leaveFee = (Number(json) / 1e8).toFixed(8)
        })
    }

    async unitAddGroupAdminFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/transactions/unitfee?txType=ADD_GROUP_ADMIN`
        await fetch(url).then((response) => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response)
        }).then((json) => {
            this.addGroupAdminFee = (Number(json) / 1e8).toFixed(8)
        })
    }

    async unitKickGroupAdminFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/transactions/unitfee?txType=REMOVE_GROUP_ADMIN`
        await fetch(url).then((response) => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response)
        }).then((json) => {
            this.kickGroupAdminFee = (Number(json) / 1e8).toFixed(8)
        })
    }

    async unitCreateBanFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/transactions/unitfee?txType=GROUP_BAN`
        await fetch(url).then((response) => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response)
        }).then((json) => {
            this.createBanFee = (Number(json) / 1e8).toFixed(8)
        })
    }

    async unitCancelBanFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
        const url = `${nodeUrl}/transactions/unitfee?txType=CANCEL_GROUP_BAN`
        await fetch(url).then((response) => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response)
        }).then((json) => {
            this.cancelBanFee = (Number(json) / 1e8).toFixed(8)
        })
    }

    async unitKickGroupMemberFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/transactions/unitfee?txType=GROUP_KICK`
        await fetch(url).then((response) => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response)
        }).then((json) => {
            this.kickGroupMemberFee = (Number(json) / 1e8).toFixed(8)
        })
    }

    async unitInviteGroupMemberFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/transactions/unitfee?txType=GROUP_INVITE`
        await fetch(url).then((response) => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response)
        }).then((json) => {
            this.inviteGroupMemberFee = (Number(json) / 1e8).toFixed(8)
        })
    }

    async unitCancelInviteGroupMemberFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/transactions/unitfee?txType=CANCEL_GROUP_INVITE`
        await fetch(url).then((response) => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response)
        }).then((json) => {
            this.cancelInviteGroupMemberFee = (Number(json) / 1e8).toFixed(8)
        })
    }

    async getNewMemberList(theGroup) {
        let callMembers = theGroup
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const callMembersUrl = `${nodeUrl}/groups/members/${callMembers}?limit=0&reverse=true`

        let obj = []
        let obj1 = []

        await fetch(callMembersUrl).then(res => {
            return res.json()
        }).then(data => {
            let groupMemberToParse = data
            groupMemberToParse.members.map(a => {
                if (a.isAdmin === undefined) {
                    let callTheNewMember = a.member
                    let callSingleMemberUrl = `${nodeUrl}/names/address/${callTheNewMember}`
                    fetch(callSingleMemberUrl).then(res => {
                        return res.json()
                    }).then(jsonRes => {
                        if (jsonRes.length) {
                            jsonRes.map(b => {
                                const objToAdd = {
                                    name: b.name,
                                    owner: b.owner,
                                    joined: a.joined
                                }
                                obj.push(objToAdd)
                            })
                        } else {
                            const noName = 'No registered name'
                            const noNameObj = {
                                name: noName,
                                owner: a.member,
                                joined: a.joined
                            }
                            obj.push(noNameObj)
                        }
                        this.newMembersList = obj
                    })
                } else if (a.isAdmin === true) {
                    let callTheNewAdmin = a.member
                    let callSingleAdminUrl = `${nodeUrl}/names/address/${callTheNewAdmin}`
                    fetch(callSingleAdminUrl).then(res => {
                        return res.json()
                    }).then(jsonRes => {
                        if (jsonRes.length) {
                            jsonRes.map(c => {
                                const obj1ToAdd = {
                                    name: c.name,
                                    owner: c.owner,
                                    joined: a.joined
                                }
                                obj1.push(obj1ToAdd)
                            })
                        } else {
                            const noName = 'No registered name'
                            const noNameObj1 = {
                                name: noName,
                                owner: a.member,
                                joined: a.joined
                            }
                            obj1.push(noNameObj1)
                        }
                        this.newAdminsList = obj1
                    })
                }
            })
        })
    }

    async getNewBannedList(theGroup) {
        let callGroupID = theGroup
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port

        let banObj = []
        this.bannedMembers = []

        await parentEpml.request('apiCall', {
            url: `/groups/bans/${callGroupID}`
        }).then(res => {
            this.bannedMembers = res
        })

        if (this.bannedMembers.length === 0) {
            return
        } else {
            this.bannedMembers.map(a => {
                let callTheBannedMember = a.offender
                let callSingleBannedMemberUrl = `${nodeUrl}/names/address/${callTheBannedMember}`
                fetch(callSingleBannedMemberUrl).then(res => {
                    return res.json()
                }).then(jsonRes => {
                    if (jsonRes.length) {
                        jsonRes.map(b => {
                            const banObjToAdd = {
                                name: b.name,
                                owner: b.owner,
                                banned: a.banned,
                                reason: a.reason,
                                expiry: a.expiry
                            }
                            banObj.push(banObjToAdd)
                        })
                    } else {
                        const noName = 'No registered name'
                        const noNameObj = {
                            name: noName,
                            owner: a.offender,
                            banned: a.banned,
                            reason: a.reason,
                            expiry: a.expiry
                        }
                        banObj.push(noNameObj)
                    }
                    this.newBannedList = banObj
                })
            })
        }
    }

    async getNewGroupInvitesList(theGroup) {
        let callGroupID = theGroup
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port

        let inviteObj = []
        this.groupInviteMembers = []

        await parentEpml.request('apiCall', {
            url: `/groups/invites/group/${callGroupID}`
        }).then(res => {
            this.groupInviteMembers = res
        })

        if (this.groupInviteMembers.length === 0) {
            return
        } else {
            this.groupInviteMembers.map(a => {
                let callTheInviteMember = a.invitee
                let callSingleInviteMemberUrl = `${nodeUrl}/names/address/${callTheInviteMember}`
                fetch(callSingleInviteMemberUrl).then(res => {
                    return res.json()
                }).then(jsonRes => {
                    if (jsonRes.length) {
                        jsonRes.map(b => {
                            const inviteObjToAdd = {
                                name: b.name,
                                owner: b.owner,
                                expiry: a.expiry
                            }
                            inviteObj.push(inviteObjToAdd)
                        })
                    } else {
                        const noName = 'No registered name'
                        const noNameObj = {
                            name: noName,
                            owner: a.invitee,
                            expiry: a.expiry
                        }
                        inviteObj.push(noNameObj)
                    }
                    this.newGroupInvitesList = inviteObj
                })
            })
        }
    }

    async getNewGroupJoinList(theGroup) {
        let callGroupID = theGroup
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port

        let joinObj = []
        this.groupJoinMembers = []

        await parentEpml.request('apiCall', {
            url: `/groups/joinrequests/${callGroupID}`
        }).then(res => {
            this.groupJoinMembers = res
        })

        if (this.groupJoinMembers.length === 0) {
            return
        } else {
            this.groupJoinMembers.map(a => {
                let callTheJoinMember = a.joiner
                let callSingleJoinMemberUrl = `${nodeUrl}/names/address/${callTheJoinMember}`
                fetch(callSingleJoinMemberUrl).then(res => {
                    return res.json()
                }).then(jsonRes => {
                    if (jsonRes.length) {
                        jsonRes.map(b => {
                            const joinObjToAdd = {
                                groupId: a.groupId,
                                name: b.name,
                                owner: b.owner,
                                time: '86400',
                                reason: 'NotAllowed'
                            }
                            joinObj.push(joinObjToAdd)
                        })
                    } else {
                        const noName = 'No registered name'
                        const noNameObj = {
                            groupId: a.groupId,
                            name: noName,
                            owner: a.joiner,
                            time: '86400',
                            reason: 'NotAllowed'
                        }
                        joinObj.push(noNameObj)
                    }
                    this.newGroupJoinsList = joinObj
                })
            })
        }
    }

    closeManageGroupOwnerDialog() {
        this.resetDefaultSettings()
        this.shadowRoot.getElementById('manageGroupOwnerDialog').close()
        window.location.reload()
    }

    resetDefaultSettings() {
        this.error = false
        this.message = ''
        this.isLoading = false
    }

    async manageGroupOwner(groupObj) {
        this.manageGroupId = ''
        this.theGroupOwner = ''
        this.manageGroupName = ''
        this.manageGroupCount = ''
        this.manageGroupType = ''
        const manageGroupDelay = ms => new Promise(res => setTimeout(res, ms))
        this.manageGroupObj = groupObj
        this.manageGroupId = groupObj.groupId
        this.theGroupOwner = groupObj.owner
        this.manageGroupName = groupObj.groupName
        this.manageGroupCount = groupObj.memberCount
        this.manageGroupType = groupObj.isOpen
        await this.getNewMemberList(groupObj.groupId)
        await this.getNewBannedList(groupObj.groupId)
        await this.getNewGroupInvitesList(groupObj.groupId)
        await this.getNewGroupJoinList(groupObj.groupId)
        await manageGroupDelay(1000)
        this.shadowRoot.getElementById('manageGroupOwnerDialog').open()
    }

    async manageGroupAdmin(groupObj) {
        this.manageGroupId = ''
        this.theGroupOwner = ''
        this.manageGroupName = ''
        this.manageGroupCount = ''
        this.manageGroupType = ''
        const manageGroupDelay = ms => new Promise(res => setTimeout(res, ms))
        this.manageGroupObj = groupObj
        this.manageGroupId = groupObj.groupId
        this.theGroupOwner = groupObj.owner
        this.manageGroupName = groupObj.groupName
        this.manageGroupCount = groupObj.memberCount
        this.manageGroupType = groupObj.isOpen
        await this.getNewMemberList(groupObj.groupId)
        await this.getNewBannedList(groupObj.groupId)
        await this.getNewGroupInvitesList(groupObj.groupId)
        await manageGroupDelay(1000)
        this.shadowRoot.getElementById('manageGroupOwnerDialog').open()
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
            return html`<mwc-button class="warning" @click=${() => this.manageGroupOwner(groupObj)}><mwc-icon>create</mwc-icon>&nbsp;${translate("grouppage.gchange40")}</mwc-button>`
        } else if (groupObj.isAdmin === true) {
            return html`<mwc-button class="warning" @click=${() => this.manageGroupAdmin(groupObj)}><mwc-icon>create</mwc-icon>&nbsp;${translate("grouppage.gchange40")}</mwc-button>
            <br><mwc-button @click=${() => this.leaveGroup(groupObj)}><mwc-icon>exit_to_app</mwc-icon>&nbsp;${translate("grouppage.gchange50")}</mwc-button>`
        } else {
            return html`<mwc-button @click=${() => this.leaveGroup(groupObj)}><mwc-icon>exit_to_app</mwc-icon>&nbsp;${translate("grouppage.gchange50")}</mwc-button>`
        }
    }

    renderManageGroupViews(selectedView) {
        if (selectedView.id === 'group-members') {
            return html`${this.groupMemberTemplate()}`
        } else if (selectedView.id === 'group-banned') {
            return html`${this.groupBannedTemplate()}`
        } else if (selectedView.id === 'group-invite') {
            return html`${this.groupInviteTemplate()}`
        } else if (selectedView.id === 'group-admin') {
            return html`${this.groupAdminTemplate()}`
        } else if (selectedView.id === 'group-update') {
            return html`${this.groupUpdateTemplate()}`
        }
    }

    renderManageGroupHeaderViews() {
        if (this.selectedView.id === 'group-members') {
            return html`${translate("managegroup.mg1")}`
        } else if (this.selectedView.id === 'group-banned') {
            return html`${translate("managegroup.mg25")}`
        } else if (this.selectedView.id === 'group-invite') {
            return html`${translate("managegroup.mg2")}`
        } else if (this.selectedView.id === 'group-admin') {
            return html`${translate("managegroup.mg3")}`
        } else if (this.selectedView.id === 'group-update') {
            return html`${translate("managegroup.mg4")}`
        }
    }

    setManageGroupView(pageId) {
        if (pageId === 'group-members') {
            return this.selectedView = { id: 'group-members', name: 'Group Members' }
        } else if (pageId === 'group-banned') {
            return this.selectedView = { id: 'group-banned', name: 'Banned Members' }
        } else if (pageId === 'group-invite') {
            return this.selectedView = { id: 'group-invite', name: 'Invite To Group' }
        } else if (pageId === 'group-admin') {
            return this.selectedView = { id: 'group-admin', name: 'Group Admins' }
        } else if (pageId === 'group-update') {
            return this.selectedView = { id: 'group-update', name: 'Update Group' }
        }
    }

    renderAvatar(groupObj) {
        let name = groupObj.name
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/arbitrary/THUMBNAIL/${name}/qortal_avatar?async=true&apiKey=${this.getApiKey()}`
        return html`<img src="${url}" onerror="this.src='/img/incognito.png';">`
    }

    async createGroup(e) {
        this.resetDefaultSettings()
        const createFeeInput = this.createFee
        const groupNameInput = this.shadowRoot.getElementById("groupNameInput").value
        const groupDescInput = this.shadowRoot.getElementById("groupDescInput").value
        const groupTypeInput = this.shadowRoot.getElementById("groupTypeInput").value
        const groupApprovalInput = this.shadowRoot.getElementById("groupApprovalInput").value
        const groupMinDelayInput = this.shadowRoot.getElementById("groupMinDelayInput").value
        const groupMaxDelayInput = this.shadowRoot.getElementById("groupMaxDelayInput").value

        this.isLoading = true

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

        const makeTransactionRequest = async (_groupTypeInput, _groupApprovalInput, _groupMinDelayInput, _groupMaxDelayInput, lastRef) => {
            let groupdialog5 = get("transactions.groupdialog5")
            let groupdialog6 = get("transactions.groupdialog6")
            let groupdialog7 = get("grouppage.gchange4")
            let groupdialog8 = get("grouppage.gchange5")
            let groupdialog9 = get("grouppage.gchange13")
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
                    groupdialog5: groupdialog5,
                    groupdialog6: groupdialog6,
                    groupdialog7: groupdialog7,
                    groupdialog8: groupdialog8,
                    groupdialog9: groupdialog9,
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
            validateReceiver()
        }
    }

    setTxNotification(tx){
        window.parent.reduxStore.dispatch(
            window.parent.reduxAction.setNewNotification({
                type: 'JOIN_GROUP',
                status: 'confirming',
                reference: tx,
                timestamp: Date.now()
            })
        );
    }

    async _joinGroup(groupId, groupName) {
        this.resetDefaultSettings()
        const joinFeeInput = this.joinFee

        this.isLoading = true

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

        const makeTransactionRequest = async (lastRef) => {
            let groupdialog1 = get("transactions.groupdialog1")
            let groupdialog2 = get("transactions.groupdialog2")
            let myTxnrequest = await parentEpml.request('transaction', {
                type: 31,
                nonce: this.selectedAddress.nonce,
                params: {
                    fee: joinFeeInput,
                    registrantAddress: this.selectedAddress.address,
                    rGroupName: groupName,
                    rGroupId: groupId,
                    lastReference: lastRef,
                    groupdialog1: groupdialog1,
                    groupdialog2: groupdialog2
                },
                apiVersion: 2
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
                this.setTxNotification({
                    groupName,
                    groupId,
                    timestamp: Date.now(),
                    ...(txnResponse.data || {})
                })
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
        this.resetDefaultSettings()
        const leaveFeeInput = this.leaveFee

        this.isLoading = true

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

        const makeTransactionRequest = async (lastRef) => {
            let groupdialog3 = get("transactions.groupdialog3")
            let groupdialog4 = get("transactions.groupdialog4")
            let myTxnrequest = await parentEpml.request('transaction', {
                type: 32,
                nonce: this.selectedAddress.nonce,
                params: {
                    fee: leaveFeeInput,
                    registrantAddress: this.selectedAddress.address,
                    rGroupName: groupName,
                    rGroupId: groupId,
                    lastReference: lastRef,
                    groupdialog3: groupdialog3,
                    groupdialog4: groupdialog4
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

    async createBanMember(groupId) {
        const member = this.shadowRoot.getElementById('toBanAddress').value
        const reason = this.shadowRoot.getElementById('banReason').value
        const banTime = this.shadowRoot.getElementById('banMemberTime').value
        const createBanFeeInput = this.createBanFee
        const theGroupId = groupId
        this.isLoading = true
        this.btnDisable = true

        const getLastRef = async () => {
            let myRef = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/lastreference/${this.selectedAddress.address}`
            })
            return myRef
        }

        const validateReceiver = async () => {
            let lastRef = await getLastRef()
            let _banTime = parseInt(banTime)
            let myTransaction = await makeTransactionRequest(_banTime, lastRef)
            getTxnRequestResponse(myTransaction)

        }

        const makeTransactionRequest = async (_banTime, lastRef) => {
            const myMember = member
            const myLastRef = lastRef
            const myGroupId = theGroupId
            const myFee = createBanFeeInput
            const myBanTime = _banTime
            const myReason = reason
            const myBanMemberDialog1 = get("managegroup.mg22")
            const myBanMemberDialog2 = get("managegroup.mg23")

            let myTxnrequest = await parentEpml.request('transaction', {
                type: 26,
                nonce: this.selectedAddress.nonce,
                params: {
                    fee: myFee,
                    recipient: myMember,
                    rGroupId: myGroupId,
                    rBanReason: myReason,
                    rBanTime: myBanTime,
                    lastReference: myLastRef,
                    banMemberDialog1: myBanMemberDialog1,
                    banMemberDialog2: myBanMemberDialog2
                }
            })
            return myTxnrequest
        }

        const getTxnRequestResponse = (txnResponse) => {
            if (txnResponse.success === false && txnResponse.message) {
                this.errorMessage = txnResponse.message
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.shadowRoot.getElementById('toBanName').value = ''
                this.shadowRoot.getElementById('toBanAddress').value = ''
                this.shadowRoot.getElementById("banReason").value = ''
                this.shadowRoot.getElementById("banMemberTime").value = 'reject'
                this.toBanName = ''
                this.toBanAddress = ''
                this.banReason = ''
                this.errorMessage = ''
                this.toBanAddress = ''
                this.successMessage = this.renderSuccessText()
                this.isLoading = false
                this.btnDisable = false
            } else {
                this.errorMessage = txnResponse.data.message
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            }
        }

        if (reason.length < 3) {
            this.error = true
            this.message = this.renderErr2Text()
            this.isLoading = false
        } else if (banTime === 'reject') {
            this.error = true
            this.message = this.renderErr4Text()
            this.isLoading = false
        } else {
            this.error = false
            validateReceiver()
        }
    }

    async cancelBanMember(groupId) {
        const member = this.shadowRoot.getElementById('toCancelBanAddress').value
        const cancelBanFeeInput = this.cancelBanFee
        const theGroupId = groupId
        this.isLoading = true
        this.btnDisable = true

        const getLastRef = async () => {
            let myRef = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/lastreference/${this.selectedAddress.address}`
            })
            return myRef
        }

        const validateReceiver = async () => {
            let lastRef = await getLastRef()
            let myTransaction = await makeTransactionRequest(lastRef)
            getTxnRequestResponse(myTransaction)

        }

        const makeTransactionRequest = async (lastRef) => {
            const myMember = member
            const myLastRef = lastRef
            const myGroupId = theGroupId
            const myFee = cancelBanFeeInput
            const myCancelBanMemberDialog1 = get("managegroup.mg29")
            const myCancelBanMemberDialog2 = get("managegroup.mg30")

            let myTxnrequest = await parentEpml.request('transaction', {
                type: 27,
                nonce: this.selectedAddress.nonce,
                params: {
                    fee: myFee,
                    recipient: myMember,
                    rGroupId: myGroupId,
                    lastReference: myLastRef,
                    cancelBanMemberDialog1: myCancelBanMemberDialog1,
                    cancelBanMemberDialog2: myCancelBanMemberDialog2
                }
            })
            return myTxnrequest
        }

        const getTxnRequestResponse = (txnResponse) => {
            if (txnResponse.success === false && txnResponse.message) {
                this.errorMessage = txnResponse.message
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.shadowRoot.getElementById('toCancelBanAddress').value = ''
                this.toCancelBanAddress = ''
                this.errorMessage = ''
                this.successMessage = this.renderSuccessText()
                this.isLoading = false
                this.btnDisable = false
            } else {
                this.errorMessage = txnResponse.data.message
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            }
        }
        validateReceiver()
    }

    async createInviteGroupMember(_inviteMemberNameInfo, _nviteMemberTime, _inviteGroupId) {
        const member = _inviteMemberNameInfo
        const inviteTime = _nviteMemberTime
        const inviteGroupMemberFeeInput = this.inviteGroupMemberFee
        const theGroupId = _inviteGroupId
        this.isLoading = true
        this.btnDisable = true

        const getLastRef = async () => {
            let myRef = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/lastreference/${this.selectedAddress.address}`
            })
            return myRef
        }

        const validateReceiver = async () => {
            let lastRef = await getLastRef()
            let myTransaction = await makeTransactionRequest(lastRef)
            getTxnRequestResponse(myTransaction)
        }

        const makeTransactionRequest = async (lastRef) => {
            const myMember = member
            const myLastRef = lastRef
            const myGroupId = theGroupId
            const myFee = inviteGroupMemberFeeInput
            const myInviteTime = inviteTime
            const myInviteMemberDialog1 = get("managegroup.mg40")
            const myInviteMemberDialog2 = get("managegroup.mg41")

            let myTxnrequest = await parentEpml.request('transaction', {
                type: 29,
                nonce: this.selectedAddress.nonce,
                params: {
                    fee: myFee,
                    recipient: myMember,
                    rGroupId: myGroupId,
                    rInviteTime: myInviteTime,
                    lastReference: myLastRef,
                    inviteMemberDialog1: myInviteMemberDialog1,
                    inviteMemberDialog2: myInviteMemberDialog2
                }
            })
            return myTxnrequest
        }

        const getTxnRequestResponse = (txnResponse) => {
            if (txnResponse.success === false && txnResponse.message) {
                this.errorMessage = txnResponse.message
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.shadowRoot.getElementById('toInviteMemberToGroup').value = ''
                this.shadowRoot.getElementById("inviteMemberTime").value = 'reject'
                this.toInviteMemberToGroup = ''
                this.inviteMemberTime = 'reject'
                this.errorMessage = ''
                this.successMessage = this.renderSuccessText()
                this.isLoading = false
                this.btnDisable = false
            } else {
                this.errorMessage = txnResponse.data.message
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            }
        }
        validateReceiver()
    }

    async cancelInviteGroupMember(groupId) {
        const name = this.shadowRoot.getElementById('toCancelInviteMemberName').value
        const member = this.shadowRoot.getElementById('toCancelInviteMemberAddress').value
        const cancelInviteGroupMemberFeeInput = this.cancelInviteGroupMemberFee
        const theGroupId = groupId
        this.isLoading = true
        this.btnDisable = true

        const getLastRef = async () => {
            let myRef = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/lastreference/${this.selectedAddress.address}`
            })
            return myRef
        }

        const validateReceiver = async () => {
            let lastRef = await getLastRef()
            let myTransaction = await makeTransactionRequest(lastRef)
            getTxnRequestResponse(myTransaction)
        }

        const makeTransactionRequest = async (lastRef) => {
            const myName = name
            const myMember = member
            const myLastRef = lastRef
            const myGroupId = theGroupId
            const myFee = cancelInviteGroupMemberFeeInput
            const myCancelInviteDialog1 = get("managegroup.mg48")
            const myCancelInviteDialog2 = get("managegroup.mg49")

            let myTxnrequest = await parentEpml.request('transaction', {
                type: 30,
                nonce: this.selectedAddress.nonce,
                params: {
                    fee: myFee,
                    memberName: myName,
                    recipient: myMember,
                    rGroupId: myGroupId,
                    lastReference: myLastRef,
                    cancelInviteDialog1: myCancelInviteDialog1,
                    cancelInviteDialog2: myCancelInviteDialog2
                }
            })
            return myTxnrequest
        }

        const getTxnRequestResponse = (txnResponse) => {
            if (txnResponse.success === false && txnResponse.message) {
                this.errorMessage = txnResponse.message
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.shadowRoot.getElementById('toCancelInviteMemberName').value = ''
                this.shadowRoot.getElementById('toCancelInviteMemberAddress').value = ''
                this.toCancelInviteMemberName = ''
                this.toCancelInviteMemberAddress = ''
                this.errorMessage = ''
                this.successMessage = this.renderSuccessText()
                this.isLoading = false
                this.btnDisable = false
            } else {
                this.errorMessage = txnResponse.data.message
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            }
        }
        validateReceiver()
    }

    async createAcceptJoinGroupMember(joinObj) {
        const member = joinObj.owner
        const inviteTime = joinObj.time
        const inviteGroupMemberFeeInput = this.inviteGroupMemberFee
        const theGroupId = joinObj.groupId
        this.isLoading = true
        this.btnDisable = true

        const getLastRef = async () => {
            let myRef = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/lastreference/${this.selectedAddress.address}`
            })
            return myRef
        }

        const validateReceiver = async () => {
            let lastRef = await getLastRef()
            let myTransaction = await makeTransactionRequest(lastRef)
            getTxnRequestResponse(myTransaction)
        }

        const makeTransactionRequest = async (lastRef) => {
            const myMember = member
            const myLastRef = lastRef
            const myGroupId = theGroupId
            const myFee = inviteGroupMemberFeeInput
            const myInviteTime = inviteTime
            const myInviteMemberDialog1 = get("managegroup.mg55")
            const myInviteMemberDialog2 = get("managegroup.mg56")

            let myTxnrequest = await parentEpml.request('transaction', {
                type: 29,
                nonce: this.selectedAddress.nonce,
                params: {
                    fee: myFee,
                    recipient: myMember,
                    rGroupId: myGroupId,
                    rInviteTime: myInviteTime,
                    lastReference: myLastRef,
                    inviteMemberDialog1: myInviteMemberDialog1,
                    inviteMemberDialog2: myInviteMemberDialog2
                }
            })
            return myTxnrequest
        }

        const getTxnRequestResponse = (txnResponse) => {
            if (txnResponse.success === false && txnResponse.message) {
                this.errorMessage = txnResponse.message
                this.shadowRoot.querySelector('#errorJoinDialog').show()
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.shadowRoot.querySelector('#successJoinDialog').show()
                this.errorMessage = ''
                this.successMessage = this.renderSuccessText()
                this.isLoading = false
                this.btnDisable = false
            } else {
                this.errorMessage = txnResponse.data.message
                this.shadowRoot.querySelector('#errorJoinDialog').show()
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            }
        }
        validateReceiver()
    }

    async kickJoinGroupMember(joinObj) {
        const member = joinObj.owner
        const reason = joinObj.reason
        const kickGroupMemberFeeInput = this.kickGroupMemberFee
        const theGroupId = joinObj.groupId
        this.isLoading = true
        this.btnDisable = true

        const getLastRef = async () => {
            let myRef = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/lastreference/${this.selectedAddress.address}`
            })
            return myRef
        }

        const validateReceiver = async () => {
            let lastRef = await getLastRef()
            let myTransaction = await makeTransactionRequest(lastRef)
            getTxnRequestResponse(myTransaction)
        }

        const makeTransactionRequest = async (lastRef) => {
            const myMember = member
            const myLastRef = lastRef
            const myGroupId = theGroupId
            const myFee = kickGroupMemberFeeInput
            const myReason = reason
            const myKickMemberDialog1 = get("managegroup.mg60")
            const myKickMemberDialog2 = get("managegroup.mg61")

            let myTxnrequest = await parentEpml.request('transaction', {
                type: 28,
                nonce: this.selectedAddress.nonce,
                params: {
                    fee: myFee,
                    recipient: myMember,
                    rGroupId: myGroupId,
                    rBanReason: myReason,
                    lastReference: myLastRef,
                    kickMemberDialog1: myKickMemberDialog1,
                    kickMemberDialog2: myKickMemberDialog2
                }
            })
            return myTxnrequest
        }

        const getTxnRequestResponse = (txnResponse) => {
            if (txnResponse.success === false && txnResponse.message) {
                this.errorMessage = txnResponse.message
                this.shadowRoot.querySelector('#cancelErrorJoinDialog').show()
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.shadowRoot.querySelector('#cancelSuccessJoinDialog').show()
                this.errorMessage = ''
                this.successMessage = this.renderSuccessText()
                this.isLoading = false
                this.btnDisable = false
            } else {
                this.errorMessage = txnResponse.data.message
                this.shadowRoot.querySelector('#cancelErrorJoinDialog').show()
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            }
        }
        validateReceiver()
    }

    async addGroupAdmin(groupId) {
        const member = this.shadowRoot.getElementById('memberToAdmin').value
        const addGroupAdminFeeInput = this.addGroupAdminFee
        const theGroupId = groupId
        this.isLoading = true
        this.btnDisable = true

        const getLastRef = async () => {
            let myRef = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/lastreference/${this.selectedAddress.address}`
            })
            return myRef
        }

        const validateReceiver = async () => {
            let lastRef = await getLastRef()
            let myTransaction = await makeTransactionRequest(lastRef)
            getTxnRequestResponse(myTransaction)
        }

        const makeTransactionRequest = async (lastRef) => {
            const myMember = member
            const myLastRef = lastRef
            const myGroupId = theGroupId
            const myFee = addGroupAdminFeeInput
            const myAddAdminDialog1 = get("managegroup.mg11")
            const myAddAdminDialog2 = get("managegroup.mg12")

            let myTxnrequest = await parentEpml.request('transaction', {
                type: 24,
                nonce: this.selectedAddress.nonce,
                params: {
                    fee: myFee,
                    recipient: myMember,
                    rGroupId: myGroupId,
                    lastReference: myLastRef,
                    addAdminDialog1: myAddAdminDialog1,
                    addAdminDialog2: myAddAdminDialog2
                }
            })
            return myTxnrequest
        }

        const getTxnRequestResponse = (txnResponse) => {
            if (txnResponse.success === false && txnResponse.message) {
                this.errorMessage = txnResponse.message
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.shadowRoot.getElementById('memberToAdmin').value = ''
                this.errorMessage = ''
                this.memberToAdmin = ''
                this.successMessage = this.renderSuccessText()
                this.isLoading = false
                this.btnDisable = false
            } else {
                this.errorMessage = txnResponse.data.message
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            }
        }
        validateReceiver()
    }

    async kickGroupMember(groupId) {
        const member = this.shadowRoot.getElementById('toKickMemberAddress').value
        const reason = this.shadowRoot.getElementById('kickMemberReason').value
        const kickGroupMemberFeeInput = this.kickGroupMemberFee
        const theGroupId = groupId
        this.isLoading = true
        this.btnDisable = true

        const getLastRef = async () => {
            let myRef = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/lastreference/${this.selectedAddress.address}`
            })
            return myRef
        }

        const validateReceiver = async () => {
            let lastRef = await getLastRef()
            let myTransaction = await makeTransactionRequest(lastRef)
            getTxnRequestResponse(myTransaction)
        }

        const makeTransactionRequest = async (lastRef) => {
            const myMember = member
            const myLastRef = lastRef
            const myGroupId = theGroupId
            const myFee = kickGroupMemberFeeInput
            const myReason = reason
            const myKickMemberDialog1 = get("managegroup.mg33")
            const myKickMemberDialog2 = get("managegroup.mg34")

            let myTxnrequest = await parentEpml.request('transaction', {
                type: 28,
                nonce: this.selectedAddress.nonce,
                params: {
                    fee: myFee,
                    recipient: myMember,
                    rGroupId: myGroupId,
                    rBanReason: myReason,
                    lastReference: myLastRef,
                    kickMemberDialog1: myKickMemberDialog1,
                    kickMemberDialog2: myKickMemberDialog2
                }
            })
            return myTxnrequest
        }

        const getTxnRequestResponse = (txnResponse) => {
            if (txnResponse.success === false && txnResponse.message) {
                this.errorMessage = txnResponse.message
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.shadowRoot.getElementById('toKickMemberName').value = ''
                this.shadowRoot.getElementById('toKickMemberAddress').value = ''
                this.shadowRoot.getElementById('kickMemberReason').value = ''
                this.toKickMemberName = ''
                this.toKickMemberAddress = ''
                this.kickMemberReason = ''
                this.errorMessage = ''
                this.successMessage = this.renderSuccessText()
                this.isLoading = false
                this.btnDisable = false
            } else {
                this.errorMessage = txnResponse.data.message
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            }
        }

        if (reason.length < 3) {
            this.error = true
            this.message = this.renderErr2Text()
            this.isLoading = false
        } else {
            this.error = false
            validateReceiver()
        }
    }

    async kickGroupAdmin(groupId) {
        const kickAdmin = this.shadowRoot.getElementById('kickGroupAdminAddress').value
        const kickGroupAdminFeeInput = this.kickGroupAdminFee
        const theGroupId = groupId
        this.isLoading = true
        this.btnDisable = true

        const getLastRef = async () => {
            let myRef = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/lastreference/${this.selectedAddress.address}`
            })
            return myRef
        }

        const validateReceiver = async () => {
            let lastRef = await getLastRef()
            let myTransaction = await makeTransactionRequest(lastRef)
            getTxnRequestResponse(myTransaction)

        }

        const makeTransactionRequest = async (lastRef) => {
            const myKickAdmin = kickAdmin
            const myLastRef = lastRef
            const myGroupId = theGroupId
            const myFee = kickGroupAdminFeeInput
            const myKickAdminDialog1 = get("managegroup.mg15")
            const myKickAdminDialog2 = get("managegroup.mg16")

            let myTxnrequest = await parentEpml.request('transaction', {
                type: 25,
                nonce: this.selectedAddress.nonce,
                params: {
                    fee: myFee,
                    recipient: myKickAdmin,
                    rGroupId: myGroupId,
                    lastReference: myLastRef,
                    kickAdminDialog1: myKickAdminDialog1,
                    kickAdminDialog2: myKickAdminDialog2
                }
            })
            return myTxnrequest
        }

        const getTxnRequestResponse = (txnResponse) => {
            if (txnResponse.success === false && txnResponse.message) {
                this.errorMessage = txnResponse.message
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.shadowRoot.getElementById('kickGroupAdminAddress').value = ''
                this.errorMessage = ''
                this.kickGroupAdminAddress = ''
                this.successMessage = this.renderSuccessText()
                this.isLoading = false
                this.btnDisable = false
            } else {
                this.errorMessage = txnResponse.data.message
                this.isLoading = false
                this.btnDisable = false
                throw new Error(txnResponse)
            }
        }
        validateReceiver()
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

window.customElements.define('group-management', GroupManagement)
