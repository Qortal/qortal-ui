import {css, html, LitElement} from 'lit'
import {connect} from 'pwa-helpers'
import {store} from '../../store.js'
import {allowShowSyncIndicator, removeShowSyncIndicator} from '../../redux/app/app-actions.js'
import {doSetQChatNotificationConfig} from '../../redux/user/user-actions.js'
import {translate} from '../../../translate/index.js'
import isElectron from 'is-electron'

import '@material/mwc-checkbox'

class NotificationsView extends connect(store)(LitElement) {
    static get properties() {
        return {
            notificationConfig: { type: Object },
            q_chatConfig: { type: Object },
            theme: { type: String, reflect: true },
            appNotificationList: { type: Array }
        }
    }

    constructor() {
        super()
        this.notificationConfig = {}
        this.q_chatConfig = {}
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
        this.appNotificationList = [] // Fetch the list of apps from local storage
    }

    firstUpdated() {
        this.appNotificationList = this.getAppsFromStorage()
    }

    static get styles() {
        return css`
            .sub-main {
                position: relative;
                text-align: center;
            }

            .notification-box {
                display: block;
                position: relative;
                top: 45%;
                left: 50%;
                transform: translate(-50%, 0%);
                text-align: center;
            }

            @media(min-width: 1400px) {
                .notification-box {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-gap: 30px;
                }
            }

            .checkbox-row {
                position: relative;
                display: flex;
                align-items: center;
                align-content: center;
                font-family: Montserrat, sans-serif;
                font-weight: 600;
                color: var(--black);
            }

            .content-box {
                border: 1px solid #a1a1a1;
                padding: 10px 25px;
                text-align: left;
                display: inline-block;
                min-width: 350px;
                min-height: 150px;
                margin: 20px 0;
            }

            h4 {
                margin-bottom: 0;
            }

            mwc-checkbox::shadow .mdc-checkbox::after, mwc-checkbox::shadow .mdc-checkbox::before {
                background-color:var(--mdc-theme-primary)
            }

            label:hover {
                cursor: pointer;
            }

            .title {
                font-weight: 600;
                font-size: 15px;
                display: block;
                line-height: 32px;
                opacity: 0.66;
            }

            .value {
                font-size: 16px;
                display: inline-block;
            }

            .q-button {
                display: inline-flex;
                flex-direction: column;
                justify-content: center;
                align-content: center;
                border: none;
                border-radius: 20px;
                padding-left: 25px;
                padding-right: 25px;
                color: white;
                background: #03a9f4;
                width: 50%;
                font-size: 17px;
                cursor: pointer;
                height: 50px;
                margin-top: 1rem;
                text-transform: uppercase;
                text-decoration: none;
                transition: all .2s;
                position: relative;
            }

            .remove-button {
                font-family: Roboto, sans-serif;
                font-size: 16px;
                color: var(--mdc-theme-primary);
                background-color: transparent;
                padding: 8px 10px;
                border-radius: 5px;
                border: none;
                transition: all 0.3s ease-in-out;
                cursor: pointer;
            }
        `
    }

    render() {
        return html`
            <div class="sub-main">
                <div class="notification-box">
                    <div class="content-box">
                        <h4> Q-Chat ${translate("settings.notifications")} </h4>

                        <div style="line-height: 3rem;">
                            <mwc-checkbox id="qChatPlaySound" @click=${e => this.setQChatNotificationConfig({ type: 'PLAY_SOUND', value: e.target.checked })} ?checked=${this.q_chatConfig.playSound}></mwc-checkbox>
                            <label
                                for="qChatPlaySound"
                                @click=${() => this.shadowRoot.getElementById('qChatPlaySound').click()}
                            >
                                ${translate("settings.playsound")}
                            </label>
                        </div>

                        <div style="line-height: 3rem;">
                            <mwc-checkbox id="qChatShowNotification" @click=${e => this.setQChatNotificationConfig({ type: 'SHOW_NOTIFICATION', value: e.target.checked })} ?checked=${this.q_chatConfig.showNotification}></mwc-checkbox>
                            <label
                                for="qChatShowNotification"
                                @click=${() => this.shadowRoot.getElementById('qChatShowNotification').click()}
                            >
                                ${translate("settings.shownotifications")}
                            </label>
                        </div>
                    </div>
                    <div class="content-box">
                        <h4>${translate("settings.qappNotification1")}</h4>
                        ${this.appNotificationList.map((app) => html`
                            <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                                ${app}
                                <button class="remove-button" @click=${() => this.removeApp(app)}>Remove</button>
                            </div>
                        `)}
                    </div>
                </div>
                <div class="checkbox-row">
                    <label for="syncIndicator" id="syncIndicatorLabel" style="color: var(--black);">
                            ${translate("settings.sync_indicator")}
                    </label>
                    <mwc-checkbox style="margin-right: -15px;" id="syncIndicator" @click=${(e) => this.checkForSyncMessages(e)} ?checked=${store.getState().app.showSyncIndicator}></mwc-checkbox>
                </div>
                ${this.renderSetCoreButton()}
            </div>
        `
    }

    getAppsFromStorage() {
        // Your method to fetch the list of apps from local storage
        // Example:
        const address = store.getState().app.selectedAddress.address
        const id = `appNotificationList-${address}`
        const data = localStorage.getItem(id)
        return data ? Object.keys(JSON.parse(data)) : []
    }

    removeApp(appName) {
        // Remove the app from local storage
        this.removeAppFromStorage(appName);
        // Update the apps list in the component
        this.appNotificationList = this.appNotificationList.filter(app => app !== appName);
    }

    removeAppFromStorage(appName) {
        // Your method to remove the app from local storage
        const address= store.getState().app.selectedAddress.address
        const id = `appNotificationList-${address}`;
        const data = JSON.parse(localStorage.getItem(id) || '{}');
        delete data[appName];
        localStorage.setItem(id, JSON.stringify(data));
    }

    renderSetCoreButton() {
        if (!isElectron()) {
            return html``
        } else {
            return html`
                <div style="max-width: 500px; display: flex; justify-content: center; margin: auto;">
                    <div @click=${() => this.checkCoreSettings()} class="q-button"> ${translate("settings.core")} </div>
                </div>
            `
        }
    }

    checkCoreSettings() {
        window.electronAPI.setStartCore()
    }

    checkForSyncMessages(e) {
        if (e.target.checked) {
           store.dispatch(removeShowSyncIndicator(false))
        } else {
           store.dispatch(allowShowSyncIndicator(true))
        }
    }

    stateChanged(state) {
        this.notificationConfig = state.user.notifications
        this.q_chatConfig = this.notificationConfig.q_chat
    }

    setQChatNotificationConfig(valueObject) {
        if (valueObject.type === 'PLAY_SOUND') {
            let data = {
                playSound: !valueObject.value,
                showNotification: this.q_chatConfig.showNotification
            }
            store.dispatch(doSetQChatNotificationConfig(data))
        } if (valueObject.type === 'SHOW_NOTIFICATION') {

            let data = {
                playSound: this.q_chatConfig.playSound,
                showNotification: !valueObject.value
            }
            store.dispatch(doSetQChatNotificationConfig(data))
        }
    }
}

window.customElements.define('notifications-view', NotificationsView)
