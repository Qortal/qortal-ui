import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../../store.js'

import '@polymer/paper-dialog/paper-dialog.js'
import '@material/mwc-button'

// Settings View
import './account-view.js'
import './security-view.js'
import './notifications-view.js'

import { doLogout } from '../../redux/app/app-actions.js'

class UserSettings extends connect(store)(LitElement) {
    static get properties() {
        return {
            loggedIn: { type: Boolean },
            pages: { type: Array },
            selectedView: { type: Object }
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
                background-color: #fff;
                color: #333333;
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
                background-color: #fff;
                color: #333333;
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
                background-color: #fff;
                color: #333333;
                border: 1px solid #a1a1a1;
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
                color: #333333;
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 7px;
            }


            .leftBar ul li {
                border-bottom: 1px solid #DDD;    
            }

            .leftBar ul li:last-child {
                border-bottom: none;
            }

            .leftBar ul li a {
                color: #333333;
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
                background-color: #f6f6f6;
                color: #515151;
            }

            .leftBar ul li:active {
                border-bottom: none;
            }

            .leftBar ul li a.active {
                color: #515151;
                background-color: #eee;
                border-left: 2px solid #515151;
                margin-left: -2px;
            }


            /* Main Profile Page */

            .mainPage {
                background-color: #fff;
                color: #333333;
                border: 1px solid #a1a1a1;
                padding: 20px 0 10px 0;
                border-radius: 5px;
                font-size: 16px;
                text-align: center;
                min-height: 460px;
            }



            /* Styles for Smaller Screen Sizes */

            @media(max-width:700px) {
                .mainPage {
                    margin-top: 30px;
                }
            }


            /* Styles for Larger Screen Sizes */

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
    }

    render() {
        return html`
            <style>
                
            </style>

            <paper-dialog id="userSettingsDialog" class="userSettings" modal>

                <div class="actions">
                    <h2></h2>
                    <mwc-icon class="close-icon" @click=${ () => this.closeSettings()} title="Close Settings" >highlight_off</mwc-icon>
                </div>

                <div class="container">
                    <div class="wrapper">
                        <div class="leftBar" style="display: table; width: 100%;">
                            <div class="slug">Qortal UI Settings</div>
                            <ul>
                                <li @click=${ () => this.setSettingsView('info')} ><a class=${this.selectedView.id === 'info' ? 'active' : ''} href="javascript:void(0)">Account</a></li>
                                <li @click=${ () => this.setSettingsView('security')} ><a class=${this.selectedView.id === 'security' ? 'active' : ''} href="javascript:void(0)">Security</a></li>
                                <li @click=${ () => this.setSettingsView('notification')} ><a class=${this.selectedView.id === 'notification' ? 'active' : ''} href="javascript:void(0)">Notifications</a></li>
                            </ul>
                        </div>

                        <div class="mainPage">
                            <h1>${ this.selectedView.name}</h1>
                            <hr>
                            ${html`${this.renderSettingViews(this.selectedView)}`}
                            <!-- <div class="depoAddress">
                                <h3>Deposit Address</h3>

                                <div class="box">
                                    <input type="text" placeholder="RNd2ioGJZKKmwaKB7ydWjuy8VUzmRzSNWe">
                                    <span class="copyAddress">Copy</span>
                                </div>
                            </div> -->
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
            return html`<account-view></account-view>`;
        } else if (selectedView.id === 'security') {
            return html`<security-view></security-view>`;
        } else if (selectedView.id === 'notification') {
            return html`<notifications-view></notifications-view>`;
        }
    }

    setSettingsView(pageId) {

        if (pageId === 'info') {
            return this.selectedView = { id: 'info', name: 'General Account Info' }
        } else if (pageId === 'security') {
            return this.selectedView = { id: 'security', name: 'Account Security' }
        } else if (pageId === 'notification') {
            return this.selectedView = { id: 'notification', name: 'UI Notifications' }
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
