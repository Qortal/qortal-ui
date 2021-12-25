import { LitElement, html, css } from 'lit-element'

class ChainMessaging extends LitElement {
    static get properties() {
        return {
            loading: { type: Boolean },
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
        // ...
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
            // this._textMenu(event)
        });

        window.addEventListener("click", () => {

            // parentEpml.request('closeCopyTextMenu', null)
        });

        window.onkeyup = (e) => {
            if (e.keyCode === 27) {

                // parentEpml.request('closeCopyTextMenu', null)
            }
        }
    }

    // _textMenu(event) {

    //     const getSelectedText = () => {
    //         var text = "";
    //         if (typeof window.getSelection != "undefined") {
    //             text = window.getSelection().toString();
    //         } else if (typeof this.shadowRoot.selection != "undefined" && this.shadowRoot.selection.type == "Text") {
    //             text = this.shadowRoot.selection.createRange().text;
    //         }
    //         return text;
    //     }

    //     const checkSelectedTextAndShowMenu = () => {
    //         let selectedText = getSelectedText();
    //         if (selectedText && typeof selectedText === 'string') {

    //             let _eve = { pageX: event.pageX, pageY: event.pageY, clientX: event.clientX, clientY: event.clientY }

    //             let textMenuObject = { selectedText: selectedText, eventObject: _eve, isFrame: true }

    //             parentEpml.request('openCopyTextMenu', textMenuObject)
    //         }
    //     }

    //     checkSelectedTextAndShowMenu()
    // }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }
}

window.customElements.define('chain-messaging', ChainMessaging)
