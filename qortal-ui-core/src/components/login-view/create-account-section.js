import { LitElement, html, css } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store.js'

import { createWallet } from '../../../../qortal-ui-crypto/api/createWallet.js'

import FileSaver from 'file-saver'

import { doLogin, doLogout, doSelectAddress } from '../../redux/app/app-actions.js'
import { doStoreWallet } from '../../redux/user/user-actions.js'
import { checkApiKey } from '../../apiKeyUtils.js'

import snackbar from '../../functional-components/snackbar.js'

import '@material/mwc-button'
import '@material/mwc-checkbox'
import '@material/mwc-textfield'
import '@material/mwc-icon'
import '@material/mwc-dialog'
import '@material/mwc-formfield'

import '@polymer/iron-pages'
import '@polymer/paper-input/paper-input-container.js'
import '@polymer/paper-input/paper-input.js'
import '@vaadin/vaadin-text-field/vaadin-text-field.js'
import '@vaadin/vaadin-text-field/vaadin-password-field.js'

import 'random-sentence-generator'

import ripple from '../../functional-components/loading-ripple.js'

let lastPassword = ''

class CreateAccountSection extends connect(store)(LitElement) {
    static get properties() {
        return {
            nextHidden: { type: Boolean, notify: true },
            nextDisabled: { type: Boolean, notify: true },
            nextText: { type: String, notify: true },
            backHidden: { type: Boolean, notify: true },
            backDisabled: { type: Boolean, notify: true },
            backText: { type: String, notify: true },
            hideNav: { type: Boolean, notify: true },
            selectedPage: { type: String },
            error: { type: Boolean },
            errorMessage: { type: String },
            nextButtonText: { type: String },
            saveAccount: { type: Boolean },
            createAccountLoading: { type: Boolean },
            showSeedphrase: { type: Boolean },
            _wallet: { type: Object },
            _pass: { type: String },
            _name: { type: String },
            isDownloadedBackup: { type: Boolean },
            nodeConfig: { type: Object }
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
        this.nextText = 'Next'
        this.backText = 'Back'
        this.nextDisabled = false
        this._pass = ''
        this._name = ''
        this.selectedPage = 'info'
        this.nextButtonText = 'Next'
        this.saveAccount = true
        this.showSeedphrase = false
        this.isDownloadedBackup = false
        this.createAccountLoading = false
        const welcomeMessage = 'Welcome to Qortal'
        this.welcomeMessage = welcomeMessage

        this.pages = {
            info: {
                next: e => {
                    this.error = false
                    this.errorMessage = ''
                    this.nextButtonText = 'Create'
                    this.selectPage('password')
                    this.updateNext()
                },
                back: () => {
                    this.navigate('welcome')
                }
            },
            password: {
                next: e => {
                    // Create account and login :)
                    this.createAccountLoading = true
                    const nameInput = this.shadowRoot.getElementById('nameInput').value
                    const password = this.shadowRoot.getElementById('password').value
                    const rePassword = this.shadowRoot.getElementById('rePassword').value

                    if (password === '') {
                        snackbar.add({
                            labelText: 'Please enter a Password!',
                            dismiss: true
                        })
                        return
                    }

                    if (password != rePassword) {
                        snackbar.add({
                            labelText: 'Passwords not match!',
                            dismiss: true
                        })
                        return
                    }

                    if (password.length < 8 && lastPassword !== password) {
                        snackbar.add({
                            labelText: 'Your password is less than 8 characters! This is not recommended. You can continue to ignore this warning.',
                            dismiss: true
                        })
                        lastPassword = password
                        return
                    }

                    if (this.saveAccount === true && nameInput === '') {
                        snackbar.add({
                            labelText: 'Please enter a Name!',
                            dismiss: true
                        })
                        return
                    }

                    this._name = nameInput
                    this._pass = password

                    let seedObj = {}
                    const seedPhrase = this.shadowRoot.getElementById('randSentence').parsedString
                    seedObj = { seedPhrase: seedPhrase }

                    ripple.welcomeMessage = welcomeMessage
                    ripple.open({
                        x: e.clientX,
                        y: e.clientY
                    })
                        .then(() => createWallet('phrase', seedObj, status => {
                            ripple.loadingMessage = status
                        }))
                        .then(wallet => {
                            this._wallet = wallet

                            return ripple.fade()
                        })
                        .then(() => {
                            this.selectPage('backup')
                            this.updateNext()
                        })
                        .catch(e => {
                            snackbar.add({
                                labelText: e,
                                dismiss: true
                            })
                            console.error('== Error == \n', e)
                            store.dispatch(doLogout())
                            ripple.close()
                        })
                },
                back: () => {
                    this.selectPage('info')
                    this.updateNext()
                }
            },
            backup: {
                next: e => {
                    if (!this.isDownloadedBackup) {
                        snackbar.add({
                            labelText: 'Please Download Your Wallet BackUp file!',
                            dismiss: true
                        })
                    } else {
                        if (this.saveAccount) {
                            ripple.welcomeMessage = 'Preparing Your Account'
                            ripple.open({
                                x: e.clientX,
                                y: e.clientY
                            })
                                .then(() => {
                                    store.dispatch(doStoreWallet(this._wallet, this._pass, this._name, () => {
                                        ripple.loadingMessage = 'Loading, Please wait...'
                                    }))
                                        .then(() => {
                                            store.dispatch(doLogin(this._wallet))
                                            store.dispatch(doSelectAddress(this._wallet.addresses[0]))
                                            checkApiKey(this.nodeConfig);
                                            this.cleanup()
                                            return ripple.fade()
                                        })
                                        .catch(err => console.error(err))
                                }).catch(err => {
                                    console.error(err)
                                })
                        } else {
                            store.dispatch(doLogin(this._wallet))
                            store.dispatch(doSelectAddress(this._wallet.addresses[0]))
                            checkApiKey()
                            this.cleanup()
                        }
                    }
                },
                back: () => {
                    this.navigate('welcome')
                }
            }
        }
        this.pageIndexes = {
            info: 0,
            password: 1,
            backup: 2
        }

        this.nextEnabled = false
        this.prevEnabled = false
    }

    render() {
        return html`
            <style>
                div[hidden] {
                    display:none !important; 
                }

                .flex {
                    display: flex;
                }

                .flex.column {
                    flex-direction: column;
                }

                #createAccountSection {
                    max-height: calc(var(--window-height) - 56px);
                    max-width: 440px;
                    max-height:calc(100% - 100px);
                    padding: 0 12px;
                    overflow-y:auto;
                }

                #createAccountPages {
                    flex-shrink:1;
                    text-align: left;
                    left:0;
                }

                #createAccountPages [page] {
                    flex-shrink:1;
                }

                .section-content {
                    padding:0 24px;
                    padding-bottom:0;
                    overflow:auto;
                    flex-shrink:1;
                    max-height: calc(100vh - 296px);
                }

                #download-area {
                    border: 2px dashed #ccc;
                    font-family: "Roboto", sans-serif;
                    padding: 10px;
                }

                #trigger:hover {
                    cursor: pointer;
                }

                mwc-checkbox::shadow .mdc-checkbox::after, mwc-checkbox::shadow .mdc-checkbox::before {
                    background-color:var(--mdc-theme-primary)
                }

                @media only screen and (max-width: ${getComputedStyle(document.body).getPropertyValue('--layout-breakpoint-tablet')}) {
                    /* Mobile */
                    #createAccountSection {
                        max-width: 100%;
                        height: calc(var(--window-height) - 56px);
                    }
                    #infoContent{
                        height:auto;
                        min-height: calc(var(--window-height) - 96px)
                    }
                    #nav {
                        flex-shrink:0;
                        padding-top:8px;
                    }
                }

                #infoContent p {
                    text-align: justify;
                }

                @keyframes fade {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                iron-pages .animated {
                    animation-duration: 0.6s;
                    animation-name: fade;
                }

                paper-input {
                    --paper-input-container-input-color: var(--mdc-theme-on-surface);
                }

                paper-icon-button {
                    --paper-icon-button-ink-color: var(--mdc-theme-primary);
                }
            </style>
            
            <div id="createAccountSection" class="flex column">
                <iron-pages selected="${this.selectedPage}" attr-for-selected="page" id="createAccountPages">
                    <div page="info">
                        <div id="infoContent" class="section-content" style="">
                            <br>
                            <h3 style="text-align:center; margin-top: 0; font-weight: 100; font-family: 'Roboto Mono', monospace;">Create account</h3>
                            <p>
                                Welcome to QORT, you will find it to be similar to that of an RPG game, 
                                you, as a minter on the QORT network (if you choose to become one) will have the chance to level your account up, 
                                giving you both more of the QORT block reward and also larger influence over the network in terms of voting on decisions for the platform. 
                            </p>
                            <p style="margin-bottom:0;">
                                Create your QORT account by clicking Next below. 
                                A ‘seedphrase’ will be randomly generated but not displayed, and this is used as your private key generator for your blockchain account in QORT.
                            </p>

                            <div id="seedBox" style="display: none; border-radius: 4px; padding-top: 8px; background: rgba(3,169,244,0.1); margin-top: 24px;">
                                <div style="display: inline-block; padding:12px; width:calc(100% - 84px);">
                                    <random-sentence-generator
                                        template="adverb verb noun adjective noun adverb verb noun adjective noun adjective verbed adjective noun"
                                        id="randSentence"></random-sentence-generator>
                                </div>
                                        <!--
                                            --- --- --- --- --- --- --- --- --- --- --- -
                                            Calculations
                                            --- --- --- --- --- --- --- --- --- --- --- -
                                            403 adjectives
                                            60 interjections
                                            243 adverbs
                                            2353 nouns
                                            3387 verbs
                                            --- --- --- --- --- --- --- --- --- --- --- -
                                            sooo 243*3387*403*2353*3387*403*2353*403*2353 ~ 2^92
                                            --- --- --- --- --- --- --- --- --- --- --- -
                                            -->
                                <paper-icon-button
                                    icon="icons:autorenew"
                                    style="top:-12px; margin:8px;"
                                    @click=${() => this.shadowRoot.getElementById('randSentence').generate()}
                                ></paper-icon-button>
                            </div>
                        </div>
                        <div style="display: none; text-align: right; vertical-align: top; line-height: 40px; margin:0;">
                            <mwc-formfield alignEnd label="I'm an advanced user, show my seed phrase.">
                                <label for="hasSavedSeedphraseCheckbox" @click=${() => this.shadowRoot.getElementById('showSeedphraseCheckbox').click()} ></label>
                                <mwc-checkbox style="display: inline; id="showSeedphraseCheckbox" @click=${e => { this.showSeedphrase = !e.target.checked; this.updateNext() }} ?checked=${this.showSeedphrase}></mwc-checkbox>
                            </mwc-formfield>
                        </div>
                    </div>

                    <div page="password">
                        <div id="saveContent" class="section-content">
                            <h3 style="text-align: center;">Save in browser</h3>
                            <p style="text-align: justify;">Your account is now ready to be created. It will be saved in this browser. If you do not want your new account to be saved in your browser, you can uncheck the box below. 
                            You will still be able to login with your new account(after logging out), using your wallet backup file that you MUST download once you create your account.</p>
                            <div style="display:flex;" ?hidden="${!this.saveAccount}">
                                <mwc-icon style="padding: 10px; padding-left:0; padding-top: 42px;">perm_identity</mwc-icon>
                                <vaadin-text-field style="width:100%;" label="Name" id="nameInput"></vaadin-text-field>
                            </div>
                            <div style="display:flex;">
                                <mwc-icon style="padding: 10px; padding-left:0; padding-top: 42px;">password</mwc-icon>
                                <vaadin-password-field style="width:100%;" label="Password" id="password"></vaadin-password-field>
                            </div>
                            <div style="display:flex;">
                                <mwc-icon style="padding: 10px; padding-left:0; padding-top: 42px;">password</mwc-icon>
                                <vaadin-password-field style="width:100%;" label="Confirm Password" id="rePassword"></vaadin-password-field>
                            </div>
                            <div style="text-align:right; vertical-align: top; line-height: 40px; margin:0;">
                                <mwc-formfield alignEnd label="Save in this browser.">
                                    <label for="saveInBrowserCheckbox" @click=${() => this.shadowRoot.getElementById('saveInBrowserCheckbox').click()}></label>
                                    <mwc-checkbox style="display: inline; id="saveInBrowserCheckbox" @click=${e => { this.saveAccount = !e.target.checked }} ?checked=${this.saveAccount}></mwc-checkbox>
                                </mwc-formfield>
                            </div>
                        </div>
                    </div>

                    <div page="backup">
                        <div id="downloadBackup" class="section-content">
                            <h3>Download Wallet BackUp File</h3>
                            <p style="text-align: justify;">Your account is now created${this.saveAccount ? ' and will be saved in this browser.' : '.'}</p>
                            <p style="margin:0;">
                                This file is the <strong>ONLY</strong> way to access your account on a system that doesn't have it saved to the app/browser. <strong>BE SURE TO BACKUP THIS FILE IN MULTIPLE PLACES.</strong> The file is encrypted very securely and decrypted with your local password you created in the previous step. You can save it anywhere securely, but be sure to do that in multiple locations.
                            </p>
                            <div id="download-area">
                                <div style="line-height:40px;">
                                    <span style="padding-top:6px; margin-right: 10px;">Download Wallet BackUp File</span>
                                    <slot id="trigger" name="inputTrigger" @click=${() => this.downloadBackup(this._wallet)} style="dispay:inline;">
                                        <mwc-button><mwc-icon>cloud_download</mwc-icon>&nbsp; Save</mwc-button>
                                    </slot>
                                </div>
                            </div>
                            <div style="text-align:right; vertical-align: top; line-height: 40px; margin:0;">
                                <mwc-formfield alignEnd label="Done saving your wallet backup ?">
                                    <label for="downloadBackupCheckbox" @click=${() => this.shadowRoot.getElementById('downloadBackupCheckbox').click()}></label>
                                    <mwc-checkbox style="display: inline;" id="downloadBackupCheckbox" @click=${e => { this.isDownloadedBackup = !e.target.checked; this.updateNext() }} ?checked=${this.isDownloadedBackup}></mwc-checkbox>
                                </mwc-formfield>
                            </div>
                        </div>
                    </div>
                </iron-pages>
            </div>
        `
    }

    cleanup() {
        this.shadowRoot.getElementById('randSentence').generate()
        this.shadowRoot.getElementById('nameInput').value = ''
        this.shadowRoot.getElementById('password').value = ''
        this.showSeedphrase = false
        this.selectPage('info')
        this.error = false
        this.errorMessage = ''
        this.nextButtonText = 'Next'
        this.createAccountLoading = false
        this.saveAccount = true
        this.isDownloadedBackup = false
        this._wallet = ''
        this._pass = ''
        this._name = ''
    }

    _pageChange(newPage, oldPage) {
        if (!this.shadowRoot.querySelector('#createAccountPages') || !newPage) {
            return
        }
        const pages = this.shadowRoot.querySelector('#createAccountPages').children
        // Run the animation on the newly selected page
        const newIndex = this.pageIndexes[newPage]
        if (!pages[newIndex].className.includes('animated')) {
            pages[newIndex].className += ' animated'
        }

        if (typeof oldPage !== 'undefined') {
            const oldIndex = this.pageIndexes[oldPage]
            // Stop the animation of hidden pages
            pages[oldIndex].classList.remove('animated')
        }
    }

    selectPage(newPage) {
        const oldPage = this.selectedPage
        this.selectedPage = newPage
        this._pageChange(newPage, oldPage)
    }

    updateNext() {
        if (this.selectedPage === 'info') {
            this.nextText = 'Next'
            this.nextDisabled = false
        } else if (this.selectedPage === 'password') {
            this.nextDisabled = false
            this.nextText = 'Create Account'
        } else if (this.selectedPage === 'backup') {
            this.nextDisabled = !this.isDownloadedBackup
            this.backHidden = true
            this.nextText = 'Continue'
        }

        this.updatedProperty()
    }

    back(e) {
        this.pages[this.selectedPage].back(e)
    }

    next(e) {
        this.pages[this.selectedPage].next(e)
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

    stateChanged(state) {
        this.nodeConfig = state.app.nodeConfig
    }

    createAccount() {
    }

    async downloadBackup(wallet) {
        const state = store.getState()
        const data = await wallet.generateSaveWalletData(this._pass, state.config.crypto.kdfThreads, () => { })
        const dataString = JSON.stringify(data)
        const blob = new Blob([dataString], { type: 'text/plain;charset=utf-8' })
        FileSaver.saveAs(blob, `qortal_backup_${wallet.addresses[0].address}.json`)
    }
}

window.customElements.define('create-account-section', CreateAccountSection)
