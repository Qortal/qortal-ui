import { LitElement, html, css } from 'lit'

class ChainMessaging extends LitElement {
    static get properties() {
        return {
            loading: { type: Boolean }
        }
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --paper-input-container-focus-color: var(--mdc-theme-primary);
            }

            paper-spinner-lite{
                height: 24px;
                width: 24px;
                --paper-spinner-color: var(--mdc-theme-primary);
                --paper-spinner-stroke-width: 2px;
            }

            #chain-messaging-page {
                background:#fff;
            }

        `
    }

    constructor() {
        super()
    }

    render() {
        return html`
            <div id="chain-messaging-page">
                <h2 style="text-align: center; margin-top: 3rem;">Coming Soon!</h2>
            </div>
        `
    }

    firstUpdated() {

        window.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        window.addEventListener("click", () => {
        });

        window.onkeyup = (e) => {
            if (e.keyCode === 27) {
            }
        }
    }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }
}

window.customElements.define('chain-messaging', ChainMessaging)
