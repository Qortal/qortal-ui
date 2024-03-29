import {css, html, LitElement} from 'lit'
import {connect} from 'pwa-helpers'
import {store} from '../../store.js'
import {checkApiKey} from '../../apiKeyUtils.js'
import {translate} from '../../../translate'
import {doLogin, doSelectAddress} from '../../redux/app/app-actions.js'
import {doRemoveWallet, doStoreWallet} from '../../redux/user/user-actions.js'
import {createWallet} from '../../../../crypto/api/createWallet.js'
import snackbar from '../../functional-components/snackbar.js'
import '../../custom-elements/frag-file-input.js'
import ripple from '../../functional-components/loading-ripple.js'

import '@material/mwc-button'
import '@material/mwc-checkbox'
import '@material/mwc-dialog'
import '@material/mwc-formfield'
import '@material/mwc-icon'
import '@material/mwc-icon-button'
import '@material/mwc-textfield'
import '@polymer/iron-pages'
import '@polymer/paper-input/paper-input-container.js'
import '@polymer/paper-input/paper-input.js'
import '@polymer/paper-ripple'
import '@polymer/iron-collapse'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/text-field/vaadin-text-field.js'
import '@vaadin/password-field/vaadin-password-field.js'

class LoginSection extends connect(store)(LitElement) {
    static get properties() {
        return {
            nextHidden: { type: Boolean, notify: true },
            nextDisabled: { type: Boolean, notify: true },
            nextText: { type: String, notify: true },
            backHidden: { type: Boolean, notify: true },
            backDisabled: { type: Boolean, notify: true },
            backText: { type: String, notify: true },
            hideNav: { type: Boolean, notify: true },
            loginFunction: { type: Object },
            selectedWallet: { type: Object },
            selectedPage: { type: String },
            wallets: { type: Object },
            loginErrorMessage: { type: String },
            hasStoredWallets: { type: Boolean },
            saveInBrowser: { type: Boolean },
            backedUpWalletJSON: { type: Object },
            backedUpSeedLoading: { type: Boolean },
            nodeConfig: { type: Object },
            theme: { type: String, reflect: true }
        }
    }

    static get styles() {
        return [
            css`
	        * {
		    --mdc-theme-primary: var(--login-button);
                    --mdc-theme-secondary: var(--mdc-theme-primary);
                    --paper-input-container-focus-color: var(--mdc-theme-primary);
                    --mdc-theme-surface: var(--white);
                    --mdc-dialog-content-ink-color: var(--black);
                    --mdc-checkbox-unchecked-color: var(--black);
                    --lumo-primary-text-color: var(--login-border);
                    --lumo-primary-color-50pct: var(--login-border-50pct);
                    --lumo-primary-color-10pct: var(--login-border-10pct);
                    --lumo-primary-color: hsl(199, 100%, 48%);
                    --lumo-base-color: var(--white);
                    --lumo-body-text-color: var(--black);
                    --lumo-secondary-text-color: var(--sectxt);
                    --lumo-contrast-60pct: var(--vdicon);
                    --_lumo-grid-border-color: var(--border);
                    --_lumo-grid-secondary-border-color: var(--border2);
                }

                mwc-formfield {
                    color: var(--black);
                }

                .red {
                    --mdc-theme-primary: red;
                }
            `
        ]
    }

    constructor() {
        super()
        this.nextHidden = true
        this.backText = this.renderBackText()
        this.backedUpSeedLoading = false
        this.hasStoredWallets = Object.keys(store.getState().user.storedWallets).length > 0
        this.selectedPage = this.hasStoredWallets ? 'storedWallet' : 'loginOptions'
        this.selectedWallet = {}
        this.loginErrorMessage = ''
        this.saveInBrowser = false
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'

        this.loginOptions = [
            {
                page: 'phrase',
                linkText: this.renderSeedText(),
                icon: 'short_text'
            },
            {
                page: 'storedWallet',
                linkText: this.renderSavedText(),
                icon: 'save'
            },
            {
                page: 'seed',
                linkText: this.renderQoraText(),
                icon: 'clear_all'
            },
            {
                page: 'backedUpSeed',
                linkText: this.renderBackupText(),
                icon: 'insert_drive_file'
            }
        ]

        this.showPasswordCheckboxPages = ['seed', 'phrase', 'V1Seed', 'unlockBackedUpSeed']
    }

    render() {
        return html`
            <style>
                #loginSection {
                    padding: 0;
                    text-align: left;
                    padding-top: 12px;
                    --paper-spinner-color: var(--mdc-theme-primary);
                    --paper-spinner-stroke-width: 2px;
                }

                #loginPages{
                    overflow: visible;
                }

                #walletsPage {
                }

                #wallets {
                    max-height: 50vh;
                    border-bottom: 1px solid #eee;
                    border-top: 1px solid #eee;
                    overflow-y: auto;
                    box-shadow: 0 0 15px 0px rgb(0 0 0 / 10%);
                    background: var(--white);
                    margin: 2vh;
                }

                .wallet {
                    position: relative;
                    padding: 15px 60px 15px 15px;
                    cursor: pointer;
                    display: flex;
                    border-bottom: solid 1px #dedede;
                }

                .wallet .wallet-details {
                    float: left;
                    width: auto;
                    height: 60px;
                    display: block;
                }

                .wallet .wallet-details p {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin: 0;
                    height: 20px;
                    font-size: 15px;
                    line-height: 20px;
                }

                .wallet .walletAddress {
                    height: 40px !important;
                    line-height: 40px !important;
                    color: var(--black);
                }

                .wallet .walletName {
                    color: var(--black);
                }

                .wallet p span {
                    color: var(--black);
                    font-size: 12px;
                    width: 50px;
                    display: inline-block;
                }

                .removeWallet {
                    position: absolute;
                    right: 5px;
                    top: 20px;
                    color: tomato;
                    --mdc-icon-size: 30px;
                }

                .login-option {
                    max-width: 300px;
                    position: relative;
                    padding: 16px 0 8px 12px;
                    cursor: pointer;
                    display: flex;
                }

                .loginIcon {
                    padding-right: 12px;
                    margin-top: -2px;
                    color: var(--black);
                }

                *[hidden] {
                    display: none !important;
                    visibility: hidden;
                }

                h1 {
                    padding: 24px;
                    padding-top: 0;
                    margin: 0;
                    font-size: 24px;
                    font-weight: 100;
                }

                .accountIcon {
                    font-size: 42px;
                    padding-top: 8px;
                }

                #unlockStoredPage {
                    padding: 24px;
                }

                #unlockStoredPage mwc-icon {
                    font-size:48px;
                }

                @media only screen and (max-width: ${getComputedStyle(document.body).getPropertyValue('--layout-breakpoint-tablet')}) {
                    /* Mobile */
                    #wallets {
                        height: 100%;
                        overflow-y: auto;
                        overflow-x: hidden;
                    }

                    #loginSection {
                        height: calc(var(--window-height) - 56px);
                    }

                    .wallet {
                        max-width: 100%;
                    }
                }

                .backButton {
                    padding: 14px;
                    text-align: left;
                }

                #pagesContainer {
                    max-height: calc(var(--window-height) - 184px);
                }

                .checkboxLabel:hover {
                    cursor: pointer;
                }
            </style>

            <div id="loginSection">
                <div id="pagesContainer">
                    <iron-pages style="padding: 0;" selected="${this.selectedPage}" attr-for-selected="page" id="loginPages">
                        <div page="loginOptions">
                            <h3 style="color: var(--black);">${translate("login.howlogin")}</h3>
                            ${this.loginOptions.map(({ page, linkText, icon }) => html`
                                <div class="login-option" @click=${() => { this.selectedPage = page }}>
                                    <paper-ripple></paper-ripple>
                                    <div>
                                        <mwc-icon class='loginIcon'>${icon}</mwc-icon>
                                    </div>
                                    <div>
                                        <span style="color: var(--black)">${linkText}</span>
                                    </div>
                                </div>
                            `)}
                        </div>

                        <div page="storedWallet" id="walletsPage">
                            <div style="text-align: center; padding-left:0;">
                                <h1 style="padding:0; color: var(--black);">${translate("login.youraccounts")}</h1>
                                <p style="margin:0; padding: 0 0 12px 0; color: var(--black);">${translate("login.clickto")}</p>
                            </div>
                            <div id="wallets">
                                ${(Object.entries(this.wallets || {}).length < 1) ? html`
                                    <p style="color: var(--black); padding: 0 0 6px 0;">${translate("login.needcreate")}</p>
                                ` : ''}
                                ${Object.entries(this.wallets || {}).map(wallet => html`
                                    <div class="wallet">
                                        <div class="selectWallet" @click=${() => this.selectWallet(wallet[1])}>
                                            <paper-ripple></paper-ripple>
                                            <div class='wallet-details'>
                                                <p class='walletName'><span style="color: var(--black);">${translate("login.name")}</span>${wallet[1].name || "No saved name"}</p>
                                                <p class="walletAddress"><span style="color: var(--black);">${translate("login.address")}</span>${wallet[1].address0}</p>
                                            </div>
                                        </div>
                                        <mwc-icon-button class="removeWallet" @click="${(e) => this.toDeleteWallet(wallet[1].address0)}" icon="clear"></mwc-icon-button>
                                        <mwc-dialog id="deleteWalletDialog">
                                            <div style="text-align: center;">
                                                <h2>Qortal UI</h2>
                                                <hr>
                                            </div>
                                            <br>
                                            <p>${translate("login.areyousure")}</p>
                                            <mwc-button
                                                slot="primaryAction"
                                                @click="${(e) => this.removeWallet(this.myToDeleteWallet)}"
                                            >
                                            ${translate("general.yes")}
                                            </mwc-button>
                                            <mwc-button
                                                slot="secondaryAction"
                                                dialogAction="cancel"
                                                class="red"
                                            >
                                            ${translate("general.no")}
                                            </mwc-button>
                                        </mwc-dialog>
                                    </div>
                                `)}
                            </div>
                        </div>

                        <div page="phrase" id="phrasePage">
                            <div style="padding:0;">
                                <div style="display:flex;">
                                    <mwc-icon style="padding: 10px; padding-left: 0; padding-top: 42px; color: var(--black);">short_text</mwc-icon>
                                    <vaadin-password-field style="width:100%;" label="${translate("login.seed")}" id="existingSeedPhraseInput" @keydown="${e => this.seedListener(e)}" autofocus></vaadin-password-field>
                                </div>
                            </div>
                        </div>

                        <div page="seed" id="seedPage">
                            <div>
                                <div style="display: flex;">
                                    <mwc-icon style="padding: 10px; padding-left: 0; padding-top: 42px; color: var(--black);">clear_all</mwc-icon>
                                    <vaadin-password-field style="width: 100%;" label="${translate("login.qora")}" id="v1SeedInput" @keydown="${e => this.seedListener(e)}" autofocus></vaadin-password-field>
                                </div>
                            </div>
                        </div>

                        <div page="unlockStored" id="unlockStoredPage">
                            <div style="text-align:center;">
                                <mwc-icon id='accountIcon' style="padding-bottom: 24px; color: var(--black);">account_circle</mwc-icon>
                                <br>
                                <span style="font-size:14px; font-weight: 100; font-family: 'Roboto Mono', monospace; color: var(--black);">${this.selectedWallet.address0}</span>
                            </div>
                        </div>

                        <div page="backedUpSeed">
                            ${!this.backedUpSeedLoading ? html`
                                <h3 style="color: var(--black);">${translate("login.upload")}</h3>
                                <frag-file-input accept=".zip,.json" @file-read-success="${e => this.loadBackup(e.detail.result)}"></frag-file-input>
                            ` : html`
                                <paper-spinner-lite active style="display: block; margin: 0 auto;"></paper-spinner-lite>
                            `}
                        </div>

                        <div page="unlockBackedUpSeed">
                            <h3 style="text-align: center; color: var(--black);">${translate("login.decrypt")}</h3>
                        </div>
                    </iron-pages>

                    <iron-collapse style="" ?opened=${this.showName(this.selectedPage)} id="passwordCollapse">
                        <div style="display:flex;">
                            <mwc-icon style="padding: 10px; padding-left: 0; padding-top: 42px; color: var(--black);">perm_identity</mwc-icon>
                            <vaadin-text-field style="width:100%;" label="${translate("login.name")}" id="nameInput"></vaadin-text-field>
                        </div>
                    </iron-collapse>

                    <iron-collapse style="" ?opened=${this.showPassword(this.selectedPage)} id="passwordCollapse">
                        <div style="display:flex;">
                            <mwc-icon style="padding: 10px; padding-left: 0; padding-top: 42px; color: var(--black);">password</mwc-icon>
                            <vaadin-password-field style="width:100%;" label="${translate("login.password")}" id="password" @keyup=${e => this.keyupEnter(e, e => this.emitNext(e))} autofocus></vaadin-password-field>
                        </div>
                    </iron-collapse>

                    <div style="text-align: right; color: var(--mdc-theme-error)">
                        ${this.loginErrorMessage}
                    </div>
                        ${this.showPasswordCheckboxPages.includes(this.selectedPage) ? html`
                            <div style="text-align: right; vertical-align: top; line-height: 40px; margin:0;">
                                <mwc-formfield alignEnd>
                                    <label for="storeCheckbox" class="checkboxLabel" @click=${() => this.shadowRoot.getElementById('storeCheckbox').click()}><span style="color: var(--black);">${translate("login.save")}</span></label>
                                    <mwc-checkbox style="display: inline;" id="storeCheckbox" @click=${e => { this.saveInBrowser = !e.target.checked }} ?checked="${this.saveInBrowser}"></mwc-checkbox>
                                </mwc-formfield>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `
    }

    firstUpdated() {
        this.loadingRipple = ripple
        const pages = this.shadowRoot.querySelector('#loginPages')
        pages.addEventListener('selected-item-changed', () => {
            if (!pages.selectedItem) {
                // ...
            } else {
                this.updateNext()
                this.shadowRoot.querySelector('#nameInput').value = ''
                this.shadowRoot.querySelector('#password').value = ''
                this.loginErrorMessage = ''
            }
        })
    }

    renderBackText() {
        return html`${translate("general.back")}`
    }

    renderNextText() {
        return html`${translate("general.next")}`
    }

    renderLoginText() {
        return html`${translate("login.login")}`
    }

    renderSeedText() {
        return html`${translate("login.seed")}`
    }

    renderSavedText() {
        return html`${translate("login.saved")}`
    }

    renderQoraText() {
        return html`${translate("login.qora")}`
    }

    renderBackupText() {
        return html`${translate("login.backup")}`
    }

    renderPrepareText() {
        return html`${translate("login.prepare")}`
    }

    renderError1Text() {
        return html`${translate("login.error1")}`
    }

    renderError2Text() {
        return html`${translate("login.error2")}`
    }

    renderError3Text() {
        return html`${translate("login.lp8")}`
    }

    selectWallet(wallet) {
        this.selectedWallet = wallet
        this.selectedPage = 'unlockStored'
    }

    toDeleteWallet(deleteAddress) {
        this.myToDeleteWallet = deleteAddress
        this.shadowRoot.querySelector('#deleteWalletDialog').show()
    }

    removeWallet(walletAddress) {
        delete store.getState().user.storedWallets[walletAddress]
        this.wallets = store.getState().user.storedWallets
        store.dispatch(
            doRemoveWallet(walletAddress)
        )
        this.cleanup()
    }

    stateChanged(state) {
        this.loggedIn = state.app.loggedIn
        this.wallets = state.user.storedWallets
        this.hasStoredWallets = this.wallets.length > 0
        this.nodeConfig = state.app.nodeConfig
    }

    seedListener(e) {
        if (e.key === 'Enter') {
            this.emitNext(e)
        }
    }

    keyupEnter(e, action) {
        if (e.keyCode === 13) {
            e.preventDefault()
            action(e)
        }
    }

    emitNext(e) {
        this.dispatchEvent(new CustomEvent('next', {
            detail: {}
        }))
    }

    loadBackup(file) {
        let error = ''
        let pf
        this.selectedPage = 'unlockBackedUpSeed'

        try {
            pf = JSON.parse(file)
        } catch (e) {
            this.loginErrorMessage = this.renderError1Text()
        }

        try {
            const requiredFields = ['address0', 'salt', 'iv', 'version', 'encryptedSeed', 'mac', 'kdfThreads']
            for (const field of requiredFields) {
                if (!(field in pf)) throw new Error(field + ' not found in JSON')
            }
        } catch (e) {
            error = e
        }

        if (error !== '') {
            snackbar.add({
                labelText: error
            })
            this.selectedPage = 'backedUpSeed'
            return
        }
        this.backedUpWalletJSON = pf
    }

    showName(selectedPage) {
        return (
            this.saveInBrowser && [
                'unlockBackedUpSeed',
                'seed',
                'phrase'
            ].includes(selectedPage)
        ) ||
            (
                [
                    ''
                ].includes(selectedPage)
            )
    }

    showPassword(selectedPage) {
        let willBeShown = (
            this.saveInBrowser && [
                'unlockBackedUpSeed',
                'seed',
                'phrase'
            ].includes(selectedPage)
        ) || (['unlockBackedUpSeed', 'unlockStored'].includes(selectedPage))

        if (willBeShown)
            this.shadowRoot.getElementById('password').focus()

        return willBeShown
    }

    get walletSources() {
        return {
            seed: () => {
                const seed = this.shadowRoot.querySelector('#v1SeedInput').value
                const name = this.shadowRoot.getElementById('nameInput').value
                const password = this.shadowRoot.getElementById('password').value
                return {
                    seed,
                    password,
                    name
                }
            },
            storedWallet: () => {
                const wallet = this.selectedWallet
                const password = this.shadowRoot.getElementById('password').value
                return {
                    wallet,
                    password
                }
            },
            phrase: () => {
                const seedPhrase = this.shadowRoot.querySelector('#existingSeedPhraseInput').value
                if (seedPhrase == "") {
                    throw new Error('Please enter a seedphrase')
                    return
                }
                const name = this.shadowRoot.getElementById('nameInput').value
                const password = this.shadowRoot.getElementById('password').value
                return {
                    seedPhrase,
                    name,
                    password
                }
            },
            backedUpSeed: () => {
                const wallet = this.backedUpWalletJSON
                const name = this.shadowRoot.getElementById('nameInput').value
                const password = this.shadowRoot.getElementById('password').value
                return {
                    password,
                    wallet,
                    name
                }
            }
        }
    }

    loginOptionIsSelected(type) {
        return this.loginOptions.map(op => op.page).includes(type)
    }

    login(e) {
        let type = this.selectedPage === 'unlockStored' ? 'storedWallet' : this.selectedPage
        type = type === 'unlockBackedUpSeed' ? 'backedUpSeed' : type

        if (!this.loginOptionIsSelected(type)) {
            throw new Error(this.renderError2Text())
        }

        // First decrypt...
        this.loadingRipple.welcomeMessage = this.renderPrepareText()

        this.loadingRipple.open({
            x: e.clientX,
            y: e.clientY
        }).then(() => {
            const source = this.walletSources[type]()
            return createWallet(type, source, status => {
                this.loadingRipple.loadingMessage = status
            }).then(wallet => {
                store.dispatch(doLogin(wallet))
                store.dispatch(doSelectAddress(wallet.addresses[0]))
                this.navigate('show-address')
                const storedWallets = store.getState().user.storedWallets
                const storedWalletAddress = storedWallets[wallet.addresses[0].address]

                if (!storedWalletAddress) {
                    if (this.saveInBrowser && type !== 'storedWallet') {
                        store.dispatch(doStoreWallet(wallet, source.password, source.name, () => {
                            ripple.loadingMessage = status
                        })).catch(err => console.error(err))
                    }
                }
                checkApiKey(this.nodeConfig)
                this.cleanup()
                return this.loadingRipple.fade()
            })
        }).catch(e => {
            this.loginErrorMessage = this.renderError3Text()
            console.error(e)
            return this.loadingRipple.close()
        })
    }

    back() {
        if (['seed', 'phrase', 'storedWallet', 'backedUpSeed'].includes(this.selectedPage)) {
            this.selectedPage = 'loginOptions'
        } else if (this.selectedPage === 'loginOptions') {
            this.navigate('welcome')
        } else if (this.selectedPage === 'unlockStored') {
            this.selectedPage = 'storedWallet'
        } else if (this.selectedPage === 'unlockBackedUpSeed') {
            this.selectedPage = 'backedUpSeed'
        }
    }

    next(e) {
        this.login(e)
    }

    // clicks next for parent
    clickNext() {
    }

    updateNext() {
        if (['phrase', 'seed', 'unlockStored', 'unlockBackedUpSeed'].includes(this.selectedPage)) {
            this.nextText = this.renderLoginText()
            this.nextHidden = false
            // Should enable/disable the next button based on whether or not password are inputted
        } else if (['storedWallet', 'loginOptions', 'backedUpSeed'].includes(this.selectedPage)) {
            this.nextHidden = true
            this.nextText = this.renderNextText()
        }

        this.updatedProperty()
    }

    updatedProperty() {
        this.dispatchEvent(new CustomEvent('updatedProperty', {
            detail: {},
            bubbles: true,
            composed: true
        }))
    }

    navigate(page) {
        this.dispatchEvent(new CustomEvent('navigate', {
            detail: { page },
            bubbles: true,
            composed: true
        }))
    }

    cleanup() {
        this.wallet = {}
        this.shadowRoot.querySelector('#nameInput').value = ''
        this.shadowRoot.querySelector('#password').value = ''
        this.hasStoredWallets = Object.keys(store.getState().user.storedWallets).length > 0
        this.selectedPage = this.hasStoredWallets ? 'storedWallet' : 'loginOptions'
        this.shadowRoot.querySelector('#deleteWalletDialog').close()
    }
}

window.customElements.define('login-section', LoginSection)
