import { LitElement, html, css } from 'lit-element'

import '@github/time-elements'

class TimeAgo extends LitElement {
    static get properties() {
        return {
            selectedAddress: { type: Object },
            config: { type: Object },
            timestamp: { type: Number },
            format: { type: String, reflect: true },
            timeIso: { type: String }
        }
    }

    static get styles() {
        return css``
    }

    updated(changedProps) {
        changedProps.forEach((OldProp, name) => {
            if (name === 'timeIso') {
                this.renderTime(this.timestamp)
            }
        });

        this.shadowRoot.querySelector('time-ago').setAttribute('title', '');
    }

    constructor() {
        super();
        this.timestamp = 0
        this.timeIso = ''
        this.format = ''
    }

    render() {

        return html`
            <time-ago datetime=${this.timeIso} format=${this.format}> </time-ago>
        `
    }

    renderTime(timestamp) {
        timestamp === undefined ? this.timeIso = '' : this.timeIso = new Date(timestamp).toISOString();
    }

    firstUpdated() {
        // ...
    }
}

window.customElements.define('message-time', TimeAgo)
