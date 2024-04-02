import {css, html, LitElement} from 'lit'
import {connect} from 'pwa-helpers'
import {store} from '../../store.js'
import {translate} from '../../../translate'

import '@polymer/paper-dialog/paper-dialog.js'
import '@material/mwc-button'

import './account-view.js'
import './security-view.js'
import './notifications-view.js'
import './qr-login-view.js'
import './export-keys.js'

class UserSettings extends connect(store)(LitElement) {
    static get properties() {
        return {
            loggedIn: { type: Boolean },
            pages: { type: Array },
            selectedView: { type: Object },
            theme: { type: String, reflect: true }
        }
    }

    static get styles() {
        return css`
            :host {
                margin: 0;
                width: 100%;
                max-width: 100vw;
                height: 100%;
                max-height: 100vh;
                background-color: var(--white);
                color: var(--black);
                line-height: 1.6;
            }

            .decline {
                --mdc-theme-primary: var(--mdc-theme-error)
            }

            paper-dialog.userSettings {
                width: 100%;
                max-width: 100vw;
                height: 100%;
                max-height: 100vh;
                background-color: var(--white);
                color: var(--black);
                line-height: 1.6;
                overflow-y: auto;
            }

            .actions {
                display:flex;
                justify-content: space-between;
                padding: 0 4em;
                margin: 15px 0 -2px 0;
            }

            .close-icon {
                font-size: 36px;
            }

            .close-icon:hover {
                cursor: pointer;
                opacity: .6;
            }

            .buttons {
                text-align:right;
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
                border-radius: 5px;
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
                padding: 20px 0 10px 0;
                border-radius: 5px;
                font-size: 16px;
                text-align: center;
                min-height: 460px;
                height: auto;
                overflow: auto;

            }

            @media(max-width:700px) {
                .mainPage {
                    margin-top: 30px;
                }
            }

            @media(min-width:765px) {
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .actions {
                    display:flex;
                    justify-content: space-between;
                    padding: 0 4em;
                    margin: 15px 0 -25px 0;
                }

                .container {
                    padding: 2em;
                }

                .wrapper {
                    display: grid;
                    grid-template-columns: 1fr 3fr;
                    grid-gap: 30px;
                }

                .wrapper > .mainPage {
                    padding: 2em;
                }

                .leftBar {
                    text-align: left;
                    max-height: 403px;
                    max-width: 400px;
                    font-size: 16px;
                }

                .mainPage {
                    font-size: 16px;
                }
            }
        `
    }

    constructor() {
        super()
        this.selectedView = { id: 'info', name: 'General Account Info' }
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    render() {
        return html`
            <paper-dialog id="userSettingsDialog" class="userSettings" modal>
                <div class="actions">
                    <h2></h2>
                    <mwc-icon class="close-icon" @click=${ () => this.closeSettings()} title="Close Settings" >highlight_off</mwc-icon>
                </div>
                <div class="container">
                    <div class="wrapper">
                        <div class="leftBar" style="display: table; width: 100%;">
                            <div class="slug">Qortal UI ${translate("settings.settings")}</div>
                            <ul>
                                <li @click=${ () => this.setSettingsView('info')} ><a class=${this.selectedView.id === 'info' ? 'active' : ''} href="javascript:void(0)">${translate("settings.account")}</a></li>
                                <li @click=${ () => this.setSettingsView('security')} ><a class=${this.selectedView.id === 'security' ? 'active' : ''} href="javascript:void(0)">${translate("settings.security")}</a></li>
                                <li @click=${ () => this.setSettingsView('export')} ><a class=${this.selectedView.id === 'export' ? 'active' : ''} href="javascript:void(0)">${translate("settings.exp1") }</a></li>
                                <li @click=${ () => this.setSettingsView('qr-login')} ><a class=${this.selectedView.id === 'qr-login' ? 'active' : ''} href="javascript:void(0)">${translate("settings.qr_login_menu_item") }</a></li>
                                <li @click=${ () => this.setSettingsView('notification')} ><a class=${this.selectedView.id === 'notification' ? 'active' : ''} href="javascript:void(0)">${translate("settings.notifications")}</a></li>
                            </ul>
                        </div>
                        <div class="mainPage">
                            <h1>${this.renderHeaderViews()}</h1>
                            <hr>
                            ${html`${this.renderSettingViews(this.selectedView)}`}
                        </div>
                    </div>
                </div>
            </paper-dialog>
        `
    }

    stateChanged(state) {
        this.loggedIn = state.app.loggedIn
    }

    renderSettingViews(selectedView) {
        if (selectedView.id === 'info') {
            return html`<account-view></account-view>`
        } else if (selectedView.id === 'security') {
            return html`<security-view .closeSettings=${()=> this.closeSettings()}></security-view>`
        } else if (selectedView.id === 'export') {
            return html`<export-keys></export-keys>`
        } else if (selectedView.id === 'notification') {
            return html`<notifications-view></notifications-view>`
        } else if (selectedView.id === 'qr-login') {
            return html`<qr-login-view></qr-login-view>`
        }
    }

    renderHeaderViews() {
        if (this.selectedView.id === 'info') {
            return html`${translate("settings.generalinfo")}`
        } else if (this.selectedView.id === 'security') {
            return html`${translate("settings.accountsecurity")}`
        } else if (this.selectedView.id === 'export') {
            return html`${translate("settings.exp1")}`
        } else if (this.selectedView.id === 'notification') {
            return html`UI ${translate("settings.notifications")}`
        } else if (this.selectedView.id === 'qr-login') {
            return html`${translate("settings.qr_login_menu_item")}`
        }
    }

    setSettingsView(pageId) {
        if (pageId === 'info') {
            return this.selectedView = { id: 'info', name: 'General Account Info' }
        } else if (pageId === 'security') {
            return this.selectedView = { id: 'security', name: 'Account Security' }
        } else if (pageId === 'export') {
            return this.selectedView = { id: 'export', name: 'Export Master Keys' }
        } else if (pageId === 'notification') {
            return this.selectedView = { id: 'notification', name: 'UI Notifications' }
        } else if (pageId === 'qr-login') {
            return this.selectedView = { id: 'qr-login', name: 'QR Login' }
        }
    }

    openSettings() {
        if (this.loggedIn) {
            this.shadowRoot.getElementById('userSettingsDialog').open()
        }
    }

    closeSettings() {
        this.shadowRoot.getElementById('userSettingsDialog').close()
        this.cleanUp()
    }

    cleanUp() {
        this.selectedView = { id: 'info', name: 'General Account Info' }
    }
}

window.customElements.define('user-settings', UserSettings)
