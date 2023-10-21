import { LitElement, html, css } from 'lit'
import { translate, translateUnsafeHTML } from 'lit-translate'

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
            theme: { type: String, reflect: true }
        }
    }

    static get styles() {
        return [
            css`
                * {
                    --mdc-theme-primary: rgb(3, 169, 244);
                    --mdc-theme-secondary: var(--mdc-theme-primary);
                    --mdc-button-outline-color: #03a9f4;
                }

                mwc-button {
                    margin: 6px;
                    width: 90%;
                    max-width:90vw;
                    margin: 4px;
                }

                .welcome-page {
                    padding: 12px 0;
                }
            `
        ]
    }

    constructor() {
        super()
        this.hideNav = true
        this.nextText = ''
        const welcomeMessage = 'Welcome to Qortal';
        this.welcomeMessage = welcomeMessage
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    firstUpdated() {
        // ...
    }

    render() {
        return html`
            <style>
              #mobile-logo {}
              @media only screen and (min-width: ${getComputedStyle(document.body).getPropertyValue('--layout-breakpoint-tablet')}) {
                #mobile-logo {
                  display:hidden;
                  visibility:none;
                }
              }
            </style>
            <div class='welcome-page' style="overflow:hidden;">
              <div id="mobile-logo"></div>
              <mwc-button @click=${() => this.navigate('login')} outlined style="border-top:0; border-bottom:0;">${translate("login.login")}</mwc-button>
              <mwc-button @click=${() => this.navigate('create-account')} outlined style="border-top:0; border-bottom:0;">${translate("login.createaccount")}</mwc-button>
            </div>
        `
    }

    back() { }

    next() { }

    navigate(page) {
        this.dispatchEvent(new CustomEvent('navigate', {
            detail: { page },
            bubbles: true,
            composed: true
        }))
    }
}

window.customElements.define('welcome-page', WelcomePage)
