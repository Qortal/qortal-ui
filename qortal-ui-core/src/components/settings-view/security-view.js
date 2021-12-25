import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../../store.js'

import '@material/mwc-textfield'

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
                background: #6a6c75;
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
                        <div style="max-width: 500px; display: inline-block;">
                            <mwc-textfield style="width:100%;" icon="vpn_key" id="downloadBackupPassword" label="Password" type="password" ></mwc-textfield>
                            <div @click=${() => this.downloadBackup()} class="q-button"> Download BackUp File </div>
                        </div>
                    </div>
                </div>
        `
    }

    stateChanged(state) {
        // ...
    }

    async downloadBackup() {
        const state = store.getState()
        const password = this.shadowRoot.getElementById('downloadBackupPassword').value

        console.log(password);

        const data = await state.app.wallet.generateSaveWalletData(password, state.config.crypto.kdfThreads, () => { })
        const dataString = JSON.stringify(data)

        const blob = new Blob([dataString], { type: 'text/plain;charset=utf-8' })
        FileSaver.saveAs(blob, `qortal_backup_${state.app.selectedAddress.address}.json`)
    }
}

window.customElements.define('security-view', SecurityView)
