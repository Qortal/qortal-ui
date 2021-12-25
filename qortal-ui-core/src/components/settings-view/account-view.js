import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../../store.js'

class AccountView extends connect(store)(LitElement) {

    static get styles() {
        return css`

            .sub-main {
                position: relative;
                text-align: center;
            }

            .center-box {
                position: relative;
                top: 45%;
                left: 50%;
                transform: translate(-50%, 0%);
                text-align: center;
            }

            .img-icon {
                font-size: 150px;
                display: block;
            }

            .content-box {
                border: 1px solid #a1a1a1;
                padding: 10px 25px;
                text-align: left;
                display: inline-block;
                /* min-width: 350px; */
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

            .start-chat {
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
                <div class="sub-main">
                    <div class="center-box">
                        <mwc-icon class="img-icon">account_circle</mwc-icon>
                        <div class="content-box">
                            <span class="title">Address: </span>
                            <span class="value">${store.getState().app.selectedAddress.address}</span>
                            <br/>
                            <span class="title">Public Key: </span>
                            <span class="value">${store.getState().app.selectedAddress.base58PublicKey}</span>
                        </div>
                    </div>
                </div>
        `
    }

    stateChanged(state) {
        // ...
    }
}

window.customElements.define('account-view', AccountView)
