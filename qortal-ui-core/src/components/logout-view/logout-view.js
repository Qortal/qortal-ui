import { LitElement, html, css } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store.js'

import '@polymer/paper-dialog/paper-dialog.js'
import '@material/mwc-button'

import { doLogout } from '../../redux/app/app-actions.js'

class LogoutView extends connect(store)(LitElement) {
    static get properties() {
        return {
        }
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --mdc-theme-secondary: var(--mdc-theme-primary);
                --mdc-theme-surface: var(--white);
                --mdc-dialog-content-ink-color: var(--black);
            }

            .decline {
                --mdc-theme-primary: var(--mdc-theme-error)
            }

            .buttons {
                text-align:right;
            }
        `
    }

    constructor() {
        super()
    }

    render() {
        return html`
            <paper-dialog style="background: var(--white);" id="userLogoutDialog" modal>
                <div style="text-align: center;">
                    <h2 style="color: var(--black);">Qortal UI</h2>
                    <hr>
                </div>
                <div style="text-align: center;">
                    <h2 style="color: var(--black);">Are you sure you want to logout?</h2>
                </div>
                <div class="buttons">
                    <mwc-button class='decline' @click=${e => this.decline(e)} dialog-dismiss>NO</mwc-button>
                    <mwc-button class='confirm' @click=${e => this.confirm(e)} dialog-confirm autofocus>YES</mwc-button>
                </div>
            </paper-dialog>
        `
    }

    openLogout() {
        this.shadowRoot.getElementById('userLogoutDialog').open()
    }

    async confirm(e) {
        store.dispatch(doLogout())
    }

    decline(e) {
        this.shadowRoot.getElementById('userLogoutDialog').close()
    }
}

window.customElements.define('logout-view', LogoutView)
