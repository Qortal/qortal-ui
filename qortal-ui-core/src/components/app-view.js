import { LitElement, html, css } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
import { translate, translateUnsafeHTML } from 'lit-translate'

import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/iron-icons/iron-icons.js'
import '@polymer/app-layout/app-layout.js'
import '@polymer/paper-ripple'

import './wallet-profile.js'
import './app-info.js'
import './sidenav-menu.js'
import './show-plugin.js'
import './qort-theme-toggle.js'
import './language-selector.js'
import './settings-view/user-settings.js'
import './logout-view/logout-view.js'

class AppView extends connect(store)(LitElement) {
    static get properties() {
        return {
            config: { type: Object },
            theme: { type: String, reflect: true }
        }
    }

    static get styles() {
        return [
            css`
                * {
		    --mdc-theme-primary: rgb(3, 169, 244);
		    --mdc-theme-secondary: var(--mdc-theme-primary);
		    --mdc-theme-error: rgb(255, 89, 89);
                }

                :host {
                    --app-drawer-width: 260px;
                }

                app-drawer-layout:not([narrow]) [drawer-toggle]:not(sidenav-menu) {
                    display: none;
                }

                app-drawer {
                    box-shadow: var(--shadow-2);
                    background: var(--sidetopbar);
                }

                app-header {
                    box-shadow: var(--shadow-2);
                }

                app-toolbar {
                    background: var(--sidetopbar);
                    color: var(--black);
                    border-top: var(--border);
                    height: 48px;
                    padding: 3px;
                }

                #sideBar {
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    background: var(--sidetopbar);
                }

                .sideBarMenu{
                    overflow-y: auto;
                    flex: 1 1;
                }

                #sideBar::-webkit-scrollbar {
                    width: 7px;
                    background-color: transparent;
                }

                #sideBar::-webkit-scrollbar-track {
                     background-color: transparent;
                }

                #sideBar::-webkit-scrollbar-thumb {
                     background-color: #333;
                     border-radius: 6px;
                     border: 3px solid #333;
                }
            `
        ]
    }

    constructor() {
        super()
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    render() {
        return html`
            <app-drawer-layout responsive-width='${getComputedStyle(document.body).getPropertyValue('--layout-breakpoint-desktop')}' fullbleed >
                <app-drawer swipe-open slot="drawer" id="appdrawer">
                    <app-header-layout>
                        <div id="sideBar">
                            <wallet-profile></wallet-profile>
                            <div class="sideBarMenu">
                                <sidenav-menu></sidenav-menu>
                            </div>
                            <app-info></app-info>
                        </div>
                    </app-header-layout>
                </app-drawer>
                <app-header-layout style="height: var(--window-height);">
                    <app-header id='appHeader' slot="header" fixed>
                        <app-toolbar>
                            <paper-icon-button class="menu-toggle-button" drawer-toggle icon="menu"></paper-icon-button>
                            <div main-title>
                                <span class="qora-title">
                                    <img src="${this.config.coin.logo}" style="height:32px; padding-left:12px;">
                                </span>
                            </div>
                            <div style="display: inline;">
                                <span>
                                    <img src="/img/${translate("selectmenu.languageflag")}-flag-round-icon-32.png" style="width: 32px; height: 32px; padding-top: 4px;">
                                </span>
                            </div>
                            <div>&nbsp;&nbsp;</div>
                            <language-selector></language-selector>
                            <div>&nbsp;&nbsp;&nbsp;&nbsp;</div>
                            <qort-theme-toggle></qort-theme-toggle>
                            <div>&nbsp;&nbsp;&nbsp;&nbsp;</div>
                            <div style="display: inline;">
                                <paper-icon-button icon="icons:settings" @click=${() => this.openSettings()} title="${translate("settings.settings")}"></paper-icon-button>
                            </div>
                            <div>&nbsp;&nbsp;</div>
                            <div style="display: inline;">
                                <paper-icon-button icon="icons:exit-to-app" @click=${() => this.openLogout()} title="${translate("logout.logout")}"></paper-icon-button>
                            </div>
                            <div>&nbsp;&nbsp;</div>
                        </app-toolbar>
                    </app-header>
                    <show-plugin></show-plugin>
                </app-header-layout>
            </app-drawer-layout>
            <user-settings></user-settings>
            <logout-view></logout-view>
        `
    }

    firstUpdated() {
        // ...
    }

    stateChanged(state) {
        this.config = state.config
    }

    openSettings() {
        const settingsDialog = document.getElementById('main-app').shadowRoot.querySelector('app-view').shadowRoot.querySelector('user-settings')
        settingsDialog.openSettings()
    }

    openLogout() {
        const logoutDialog = document.getElementById('main-app').shadowRoot.querySelector('app-view').shadowRoot.querySelector('logout-view')
        logoutDialog.openLogout()
    }
}

window.customElements.define('app-view', AppView)
