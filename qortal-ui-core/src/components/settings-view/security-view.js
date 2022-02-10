import { LitElement, html, css } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store.js'

import '@material/mwc-textfield'
import '@material/mwc-icon'

import '@vaadin/vaadin-text-field/vaadin-password-field.js'

import FileSaver from 'file-saver'

class SecurityView extends connect(store)(LitElement) {
    static get properties() {
        return {
        }
    }

    static get styles() {
        return css`
            .center-box {
                position: relative;
                top: 45%;
                left: 50%;
                transform: translate(-50%, 0%);
                text-align: center;
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
        `
    }

    render() {
        return html`
                <div style="position: relative;" >
                    <div class="center-box">
                        <p>
                            Please choose a password to encrypt your backup with (this can be the same as the one you logged in with, or different)
                        </p>
                        <div style="max-width: 500px; display: flex; justify-content: center; margin: auto;">
                            <mwc-icon style="padding: 10px; padding-left:0; padding-top: 42px;">password</mwc-icon>
                            <vaadin-password-field style="width:100%;" label="Password" id="downloadBackupPassword"></vaadin-password-field>
                        </div>
                        <div style="max-width: 500px; display: flex; justify-content: center; margin: auto;">
                            <div @click=${() => this.downloadBackup()} class="q-button"> Download BackUp File </div>
                        </div>
                    </div>
                </div>
        `
    }

    stateChanged(state) {
    }

    async downloadBackup() {
        const state = store.getState()
        const password = this.shadowRoot.getElementById('downloadBackupPassword').value
        const data = await state.app.wallet.generateSaveWalletData(password, state.config.crypto.kdfThreads, () => { })
        const dataString = JSON.stringify(data)
        const blob = new Blob([dataString], { type: 'text/plain;charset=utf-8' })
        FileSaver.saveAs(blob, `qortal_backup_${state.app.selectedAddress.address}.json`)
    }
}

window.customElements.define('security-view', SecurityView)
