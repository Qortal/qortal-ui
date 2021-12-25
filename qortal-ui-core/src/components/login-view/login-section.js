import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../../store.js'

import '@material/mwc-button'
import '@material/mwc-checkbox'
import '@material/mwc-textfield'
import '@material/mwc-icon'
import '@material/mwc-dialog'
import '@material/mwc-formfield'

import '@polymer/iron-pages'
import '@polymer/paper-input/paper-input-container.js'
import '@polymer/paper-input/paper-input.js'
import '@polymer/paper-ripple'
import '@polymer/iron-collapse'
import '@polymer/paper-spinner/paper-spinner-lite.js'

import { doLogin, doSelectAddress } from '../../redux/app/app-actions.js'
import { doStoreWallet, doRemoveWallet } from '../../redux/user/user-actions.js'

import { createWallet } from '../../../../qortal-ui-crypto/api/createWallet.js'

import snackbar from '../../functional-components/snackbar.js'
import '../../custom-elements/frag-file-input.js'

import ripple from '../../functional-components/loading-ripple.js'

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
            backedUpSeedLoading: { type: Boolean }
        }
    }

    static get styles() {
        return [
            css`
                
            `
        ]
    }

    constructor() {
        super()
        this.nextHidden = true
        this.backText = 'Back'

        this.backedUpSeedLoading = false
        this.hasStoredWallets = Object.keys(store.getState().user.storedWallets).length > 0
        this.selectedPage = this.hasStoredWallets ? 'storedWallet' : 'loginOptions'
        this.selectedWallet = {}
        this.loginErrorMessage = ''
        this.saveInBrowser = false

        this.loginOptions = [
            {
                page: 'phrase',
                linkText: 'Seedphrase',
                icon: 'short_text'
            },
            {
                page: 'storedWallet',
                linkText: 'Saved account',
                icon: 'save'
            },
            {
                page: 'seed',
                linkText: 'Qortal address seed',
                icon: 'clear_all'
            },
            {
                page: 'backedUpSeed',
                linkText: 'Qortal wallet backup',
                icon: 'insert_drive_file'
            }
        ]

        this.showPasswordCheckboxPages = ['seed', 'phrase', 'V1Seed', 'unlockBackedUpSeed']
    }

    render() {
        return html`
            <style>
                #loginSection {
                    padding:0;
                    text-align:left;
                    padding-top: 12px;
                    --paper-spinner-color: var(--mdc-theme-primary);
                    --paper-spinner-stroke-width: 2px;
                }
                #loginPages{
                    overflow:visible;
                }
                #walletsPage {
                    /*min-width: 500px;*/
                }
                #wallets {
                    max-height: 50vh;
                    border-bottom: 1px solid #eee;
                    border-top: 1px solid #eee;
                    overflow-y: auto;
                    box-shadow: 0 0 15px 0px rgb(0 0 0 / 10%);
                    background: rgb(253 253 253 / 50%);
                    margin: 2vh;
                }
                .wallet {
                    /* max-width: 300px; */
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
                .wallet .wallet-details p{
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin:0;
                    height: 20px;
                    font-size: 15px;
                    line-height: 20px;
                }
                .wallet .walletAddress{
                    height: 40px !important;
                    line-height: 40px !important;
                }
                .wallet .walletName{
                   
                }
                .wallet p span{
                    color: #888;
                    font-size: 12px;
                    width: 50px;
                    display: inline-block;
                }
                .removeWallet{
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
                    /* font-size:42px; */
                    padding-right: 12px;
                    margin-top: -2px;
                }
                *[hidden] { 
                    display:none !important;
                    visibility: hidden;
                }
                h1 {
                    padding: 24px;
                    padding-top:0;
                    margin:0;
                    font-size:24px;
                    font-weight:100;
                }
                .accountIcon {
                    font-size:42px;
                    padding-top:8px;
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
                        /* max-height: calc(var(--window-height) - 180px);
                        min-height: calc(var(--window-height) - 180px); */
                        height:100%;
                        overflow-y:auto;
                        overflow-x:hidden;
                    }
                    #loginSection {
                        height: calc(var(--window-height) - 56px);
                    }
                    .wallet {
                        max-width: 100%;
                    }
                }
                .backButton {
                    padding:14px;
                    text-align:left;
                }
                #pagesContainer {
                    max-height: calc(var(--window-height) - 184px);
                }
                .checkboxLabel:hover{
                    cursor: pointer;
                }
            </style>
            
            <div id="loginSection">
                <div id="pagesContainer">
                    <iron-pages style="padding: 0;" selected="${this.selectedPage}" attr-for-selected="page" id="loginPages">
                        <div page="loginOptions">
                            <h3>How would you like to login?</h3>
                            ${this.loginOptions.map(({ page, linkText, icon }) => html`
                                <div class="login-option" @click=${() => { this.selectedPage = page }}>
                                    <paper-ripple></paper-ripple>
                                    <div>
                                        <mwc-icon class='loginIcon'>${icon}</mwc-icon>
                                    </div>
                                    <div>
                                        ${linkText}
                                    </div>
                                </div>
                            `)}
                        </div>

                        <div page="storedWallet" id="walletsPage">
                            <div style="padding-left:0;">
                                <h1 style="padding:0;">Your accounts</h1>
                                <p style="margin:0; padding: 0 0 12px 0;">Click your account to login with it</p>
                            </div>
                            <div id="wallets">
                                ${(Object.entries(this.wallets || {}).length < 1) ? html`
                                    <p style="padding: 0 0 6px 0;">You need to create or save an account before you can log in!</p>
                                ` : ''}
                                ${Object.entries(this.wallets || {}).map(wallet => html`
                                    <div class="wallet">
                                        <div class="selectWallet" @click=${() => this.selectWallet(wallet[1])}>
                                            <paper-ripple></paper-ripple>
                                            <div class='wallet-details'>
                                                <!--h3 class='walletName'><span>Name : </span>${wallet[1].name || wallet[1].address0.substring(0, 5)}</h3-->
                                                <p class='walletName'><span>Name</span>${wallet[1].name || "No saved name"}</p>
                                                <p class="walletAddress"><span>Address</span>${wallet[1].address0}</p>
                                            </div>
                                        </div>
                                        <mwc-icon-button class="removeWallet" @click=${(e) => this.removeWallet(wallet[1].address0)} icon="clear"></mwc-icon-button>
                                    </div>
                                `)}
                            </div>
                        </div>

                        <div page="phrase" id="phrasePage">
                            <div style="padding:0;">
                                <div style="display:flex;">
                                    <mwc-textfield icon="short_text" style="width:100%;" label="Seedphrase" id="existingSeedPhraseInput" type="password"></mwc-textfield>
                                </div>
                            </div>
                        </div>

                        <div page="seed" id="seedPage">
                            <div>
                                <div style="display:flex;">
                                    <mwc-textfield style="width:100%;" icon="clear_all" label="Qortal address seed" id="v1SeedInput" type="password"></mwc-textfield>
                                </div>
                            </div>
                        </div>

                        <div page="unlockStored" id="unlockStoredPage">
                            <div style="text-align:center;">
                                <mwc-icon id='accountIcon' style=" padding-bottom:24px;">account_circle</mwc-icon>
                                <br>
                                <span style="font-size:14px; font-weight:100; font-family: 'Roboto Mono', monospace;">${this.selectedWallet.address0}</span>
                            </div>
                        </div>

                        <div page="backedUpSeed">
                            ${!this.backedUpSeedLoading ? html`
                                <h3>Upload your qortal backup</h3>
                                <frag-file-input accept=".zip,.json" @file-read-success="${e => this.loadBackup(e.detail.result)}"></frag-file-input>
                            ` : html`
                                <paper-spinner-lite active style="display: block; margin: 0 auto;"></paper-spinner-lite>
                            `}
                        </div>

                        <div page="unlockBackedUpSeed">
                            <h3>Decrypt backup</h3>
                        </div>

                    </iron-pages>
                    <iron-collapse style="" ?opened=${this.showName(this.selectedPage)} id="passwordCollapse">
                        <div style="display:flex;">
                            <mwc-textfield icon="perm_identity" style="width:100%;" label="Name" id="nameInput"></mwc-textfield>
                        </div>
                    </iron-collapse>
                    <iron-collapse style="" ?opened=${this.showPassword(this.selectedPage)} id="passwordCollapse">
                        <div style="display:flex;">
                            <mwc-textfield icon="vpn_key" style="width:100%;" label="Password" id="password" type="password" @keyup=${e => this.keyupEnter(e, e => this.emitNext(e))}></mwc-textfield>
                        </div>
                    </iron-collapse>

                    <div style="text-align: right; color: var(--mdc-theme-error)">
                        ${this.loginErrorMessage}
                    </div>
                        ${this.showPasswordCheckboxPages.includes(this.selectedPage) ? html`
                            <div style="text-align:right; min-height:40px;">
                                <p style="vertical-align: top; line-height: 40px; margin:0;">
                                    <label
                                    for="storeCheckbox"
                                    class="checkboxLabel"
                                    @click=${() => this.shadowRoot.getElementById('storeCheckbox').click()}
                                    >Save in this browser</label>
                                    <mwc-checkbox id="storeCheckbox" style="margin-bottom:-12px;" @click=${e => { this.saveInBrowser = !e.target.checked }} ?checked="${this.saveInBrowser}"></mwc-checkbox>
                                </p>
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

    selectWallet(wallet) {
        this.selectedWallet = wallet
        this.selectedPage = 'unlockStored'
    }

    removeWallet(walletAddress){
        if(window.confirm('Are you sure you want to remove this wallet from saved wallets?')) {
            delete store.getState().user.storedWallets[walletAddress]
            this.wallets=store.getState().user.storedWallets
            store.dispatch(
                doRemoveWallet(walletAddress)
            )//.catch(err => console.error(err))
            this.cleanup()
        }
    }

    stateChanged(state) {
        this.loggedIn = state.app.loggedIn
        this.wallets = state.user.storedWallets
        this.hasStoredWallets = this.wallets.length > 0
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
            this.loginErrorMessage = 'Backup must be valid JSON'
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
        let willBeShown= (
            this.saveInBrowser && [
                'unlockBackedUpSeed',
                'seed',
                'phrase'
            ].includes(selectedPage)
            ) || (['unlockBackedUpSeed','unlockStored'].includes(selectedPage))

        if(willBeShown)//if the password will be displayed lt's give it focus 
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
            throw new Error('Login option not selected page')
        }

        // First decrypt...
        this.loadingRipple.welcomeMessage = 'Preparing Your Account'
        this.loadingRipple.open({
            x: e.clientX,
            y: e.clientY
        })
            .then(() => {
                const source = this.walletSources[type]()
                return createWallet(type, source, status => {
                    this.loadingRipple.loadingMessage = status
                })
                    .then(wallet => {
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
                        this.cleanup()
                        return this.loadingRipple.fade()
                    })
            })
            .catch(e => {
                this.loginErrorMessage = e
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
            this.nextText = 'Login'
            this.nextHidden = false
            // Should enable/disable the next button based on whether or not password are inputted
        } else if (['storedWallet', 'loginOptions', 'backedUpSeed'].includes(this.selectedPage)) {
            this.nextHidden = true
            this.nextText = 'Next'
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
    }
}

window.customElements.define('login-section', LoginSection)
