import { LitElement, html, css } from 'lit-element'

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
            hideNav: { type: Boolean, notify: true }
        }
    }

    static get styles() {
        return [
            css`
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
    }

    firstUpdate() {
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
              <mwc-button @click=${() => this.navigate('login')} outlined style="border-top:0; border-bottom:0;">Login</mwc-button>
              <mwc-button @click=${() => this.navigate('create-account')} outlined style="border-top:0; border-bottom:0;">Create account</mwc-button>
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
