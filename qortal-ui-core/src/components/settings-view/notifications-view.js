import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../../store.js'

import { doSetQChatNotificationConfig } from '../../redux/user/user-actions.js'

import '@material/mwc-checkbox'


class NotificationsView extends connect(store)(LitElement) {
    static get properties() {
        return {
            notificationConfig: { type: Object },
            q_chatConfig: { type: Object },
            blockConfig: { type: Object }
        }
    }

    constructor() {
        super()
        this.notificationConfig = {}
        this.q_chatConfig = {}
        this.blockConfig = {}
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

            @media(min-width: 1150px) {
                .notification-box {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-gap: 30px;
                }
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
        `
    }

    render() {
        return html`
                <div class="sub-main">
                    <div class="notification-box">
                        <div class="content-box">
                            <h4> Q-Chat Notifications </h4>

                            <div style="line-height: 3rem;">
                                <mwc-checkbox id="qChatPlaySound" @click=${e => this.setQChatNotificationConfig({ type: 'PLAY_SOUND', value: e.target.checked })} ?checked=${this.q_chatConfig.playSound}></mwc-checkbox>
                                <label
                                for="qChatPlaySound"
                                @click=${() => this.shadowRoot.getElementById('qChatPlaySound').click()}
                                >Play Sound</label>
                            </div>

                            <div style="line-height: 3rem;">
                                <mwc-checkbox id="qChatShowNotification" @click=${e => this.setQChatNotificationConfig({ type: 'SHOW_NOTIFICATION', value: e.target.checked })} ?checked=${this.q_chatConfig.showNotification}></mwc-checkbox>
                                <label
                                for="qChatShowNotification"
                                @click=${() => this.shadowRoot.getElementById('qChatShowNotification').click()}
                                >Show Notifications</label>
                            </div>
                        </div>
                        <div class="content-box">
                            <h4> Block Notifications ("Coming Soon...") </h4>

                            <div style="line-height: 3rem;">
                                <mwc-checkbox indeterminate disabled id="blockPlaySound"></mwc-checkbox>
                                <label for="blockPlaySound">Play Sound</label>
                            </div>

                            <div style="line-height: 3rem;">
                                <mwc-checkbox indeterminate disabled id="blockShowNotification"></mwc-checkbox>
                                <label for="blockShowNotification">Show Notifications</label>
                            </div>
                        </div>
                    </div>
                </div>
        `
    }

    stateChanged(state) {

        this.notificationConfig = state.user.notifications
        this.q_chatConfig = this.notificationConfig.q_chat
        this.blockConfig = this.notificationConfig.block
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
