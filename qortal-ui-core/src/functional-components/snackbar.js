import { LitElement, html, css } from 'lit-element'
import '@material/mwc-snackbar'

let queueElement

class SnackQueue extends LitElement {
    static get properties() {
        return {
            busy: {
                type: Boolean,
                attribute: 'busy',
                reflectToAttribute: true
            },
            currentSnack: {
                type: Object,
                attribute: 'current-snack',
                reflectToAttribute: true
            },
            _queue: {
                type: Array
            },
            _labelText: { type: String },
            _stacked: { type: Boolean },
            _leading: { type: Boolean },
            _closeOnEscape: { type: Boolean },
            _timeoutMs: { type: Number },
            action: {},
            _dismiss: {},
            _dismissIcon: { type: String }
        }
    }

    static get styles() {
        return css``
    }

    constructor() {
        super()
        this._queue = []
        this.busy = false
        this._timeoutMs = 5000
    }

    render() {
        return html`
            <mwc-snackbar id="snack" labelText="${this._labelText}" ?stacked=${this._stacked} ?leading=${this._leading} ?closeOnEscape=${this._closeOnEscape} timeoutMs=${this._timeoutMs}>
                ${this._action}
                ${this._dismiss ? html`
                    <mwc-icon-button icon="${this._dismissIcon}" slot="dismiss"></mwc-icon-button>
                ` : ''}
            </mwc-snackbar>
        `
    }

    firstUpdated() {
        this._snackbar = this.shadowRoot.getElementById('snack')
    }

    _shift() {
        if (this.busy || this._queue.length === 0) return
        const item = this._queue.shift()
        this._labelText = item.labelText || ''
        this._action = item.action || ''
        this._dismiss = item.dismiss || false
        this._dismissIcon = item.dismissIcon || 'close'
        this._leading = !!item.leading
        this._closeOnEscape = (item.closeOnEscape && item.closeOnEscape !== false) // JSON.parse maybe needs to be compared to 'false'...in which case no need for complex expression
        this._timeoutMs = (item.timeoutMs >= 4000 && item.timeoutMs <= 10000) ? item.timeoutMs : 5000
        this._snackbar.show()
    }

    add(item) {
        this._queue.push(item)
        this._shift()
    }
}

window.customElements.define('snack-queue', SnackQueue)

const queueNode = document.createElement('snack-queue')
queueNode.id = 'queue-node'
queueNode.loadingMessage = ''
queueElement = document.body.appendChild(queueNode)
setTimeout(() => {
    queueElement = document.getElementById('queue-node')
    const mainApp = document.getElementById('main-app')
    const shadow = mainApp.shadowRoot
    queueElement = shadow.appendChild(queueElement)
}, 500)
export default queueElement
