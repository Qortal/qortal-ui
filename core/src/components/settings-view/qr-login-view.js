import {css, html, LitElement} from 'lit'
import {connect} from 'pwa-helpers'
import {store} from '../../store.js'
import {translate} from '../../../translate'

import '@material/mwc-textfield'
import '@material/mwc-icon'
import '@vaadin/password-field/vaadin-password-field.js'
import '../../../../plugins/plugins/core/components/QortalQrcodeGenerator.js'

class QRLoginView extends connect(store)(LitElement) {
  static get properties() {
    return {
      theme: { type: String, reflect: true },
      savedWalletDataJson: { type: String },
      translateDescriptionKey: { type: String }, // Description text
      translateButtonKey: { type: String }, // Button text
    }
  }

  static get styles() {
    return css`
            * {
                --lumo-primary-text-color: rgb(0, 167, 245);
                --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
                --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
                --lumo-primary-color: hsl(199, 100%, 48%);
                --lumo-base-color: var(--white);
                --lumo-body-text-color: var(--black);
                --lumo-secondary-text-color: var(--sectxt);
                --lumo-contrast-60pct: var(--vdicon);
            }

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

            .q-button.outlined {
                background: unset;
                border: 1px solid #03a9f4;
            }

            :host([theme="light"]) .q-button.outlined {
                color: #03a9f4;
            }

            #qr-toggle-button {
                margin-left: 12px;
            }

            #login-qr-code {
                margin: auto;
            }
        `
  }

  constructor() {
    super()
    this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    this.translateDescriptionKey = 'settings.qr_login_description_' + (this.isWalletStored() ? '1' : '2')
    this.translateButtonKey = 'settings.qr_login_button_' + (this.isWalletStored() ? '1' : '2')
  }

  render() {
    return html`
        <div style="position: relative;" >
            <div class="center-box">
                <p>
                    ${translate(this.translateDescriptionKey)}
                </p>
                <div style="max-width: 500px; justify-content: center; margin: auto; display: ${this.isWalletStored() ? 'none' : 'flex' }">
                    <mwc-icon style="padding: 10px; padding-left:0; padding-top: 42px;">password</mwc-icon>
                    <vaadin-password-field id="newWalletPassword" style="width: 100%; color: var(--black);" label="${translate("settings.password")}"  autofocus></vaadin-password-field>
                </div>
                <div style="max-width: 600px; display: flex; justify-content: center; margin: auto;">
                    <div id="qr-toggle-button" @click=${() => this.showQRCode()} class="q-button outlined"> ${translate(this.translateButtonKey)} </div>
                </div>

                <div id="login-qr-code" style="display: none;">
                    <qortal-qrcode-generator id="login-qr-code" data="${this.savedWalletDataJson}" mode="octet" format="html" auto></qortal-qrcode-generator>
                </div>
            </div>
        </div>
    `
  }

  isWalletStored() {
    const state = store.getState()
    const address0 = state.app.wallet._addresses[0].address
    const savedWalletData = state.user.storedWallets && state.user.storedWallets[address0]
    return !!savedWalletData
  }

  async setSavedWalletDataJson() {
    const state = store.getState()
    let data
    if (this.isWalletStored()) { // if the wallet is stored, we use the existing encrypted backup
      const address0 = state.app.wallet._addresses[0].address
      data = state.user.storedWallets[address0]
    } else { // if the wallet is not stored, we generate new `saveWalletData` backup encrypted with the new password
      const password = this.shadowRoot.getElementById('newWalletPassword').value
      data = await state.app.wallet.generateSaveWalletData(password, state.config.crypto.kdfThreads, () => { })
    }
    this.savedWalletDataJson = JSON.stringify(data)
  }

  async showQRCode() {
    await this.setSavedWalletDataJson()
    let el = this.shadowRoot.getElementById('login-qr-code')
    el.style.display = 'flex'
  }
}

window.customElements.define('qr-login-view', QRLoginView)
