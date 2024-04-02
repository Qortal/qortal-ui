import {css, html, LitElement} from 'lit'
import {translate} from '../../../translate'

import '@material/mwc-button'

class WelcomePage extends LitElement {
    static get properties() {
        return {
            nextHidden: { type: Boolean, notify: true },
            nextEnabled: { type: Boolean, notify: true },
            nextText: { type: String, notify: true },
            backHidden: { type: Boolean, notify: true },
            backDisabled: { type: Boolean, notify: true },
            backText: { type: String, notify: true },
            hideNav: { type: Boolean, notify: true },
            welcomeMessage: { type: String },
            theme: { type: String, reflect: true }
        }
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: var(--login-button);
                --mdc-theme-secondary: var(--mdc-theme-primary);
                --mdc-button-outline-color: var(--general-color-blue);
            }

            .button-outline {
                margin: 6px;
                width: 90%;
                max-width:90vw;
                border-top: 0;
                border-bottom: 0;
            }

            .welcome-page {
                padding: 12px 0;
                overflow: hidden;
            }
        `
    }

    constructor() {
        super()
        this.hideNav = true
        this.nextText = ''
        this.welcomeMessage = 'Welcome to Qortal'
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    firstUpdated() {}

    render() {
        return html`
            <div class="welcome-page">
                <mwc-button class="button-outline" @click=${() => this.navigate('login')} outlined>${translate("login.login")}</mwc-button>
                <mwc-button class="button-outline" @click=${() => this.navigate('create-account')} outlined>${translate("login.createaccount")}</mwc-button>
            </div>
        `
    }

    back() {}

    next() {}

    navigate(page) {
        this.dispatchEvent(new CustomEvent('navigate', {
            detail: { page },
            bubbles: true,
            composed: true
        }))
    }
}

window.customElements.define('welcome-page', WelcomePage)
