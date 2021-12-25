import { LitElement, html, css } from 'lit-element'
import { Epml } from '../../../epml.js'

import '@material/mwc-icon-button'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ButtonIconCopy extends LitElement {
    static get properties() {
        return {
            textToCopy: { type: String },
            title: { type: String },
            onSuccessMessage: { type: String },
            onErrorMessage: { type: String },
            buttonSize: { type: String },
            iconSize: { type: String },
            color: { type: String },
            offsetLeft: { type: String },
            offsetRight: { type: String }
        }
    }

    constructor() {
        super()
        this.textToCopy = ''
        this.title = 'Copy to clipboard'
        this.onSuccessMessage = 'Copied to clipboard'
        this.onErrorMessage = 'Unable to copy'
        this.buttonSize = '48px'
        this.iconSize = '24px'
        this.color = 'inherit'
        this.offsetLeft = '0'
        this.offsetRight = '0'
    }

    connectedCallback() {
        super.connectedCallback();
        this.style.setProperty('--mdc-icon-button-size', this.buttonSize)
        this.style.setProperty('--mdc-icon-size', this.iconSize)
        this.style.setProperty('color', this.color)
        this.style.setProperty('margin-left', this.offsetLeft)
        this.style.setProperty('margin-right', this.offsetRight)
    }

    render() {
        return html`
            <mwc-icon-button 
                title=${this.title}
                label=${this.title}
                icon="content_copy" 
                @click=${() => this.saveToClipboard(this.textToCopy)}
            >
            </mwc-icon-button>
        `
    }

    async saveToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text)
            parentEpml.request('showSnackBar', this.onSuccessMessage)
        } catch (err) {
            parentEpml.request('showSnackBar', this.onErrorMessage)
            console.error('Copy to clipboard error:', err)
        }
    }
}

window.customElements.define('button-icon-copy', ButtonIconCopy)
