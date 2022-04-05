import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../epml.js'
import snackbar from './snackbar.js'

import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-icon'
import '@material/mwc-snackbar'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class BlockAddress extends LitElement {
    static get properties() {
        return {
            toblockaddress: { type: String, attribute: true },
            chatBlockedAdresses: { type: Array }
        }
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --mdc-theme-secondary: var(--mdc-theme-primary);
                --mdc-dialog-content-ink-color: var(--black);
                --mdc-theme-surface: var(--white);
                --mdc-theme-text-primary-on-background: var(--black);
            }
        `
    }

    constructor() {
        super()
        this.chatBlockedAdresses = []
    }

    render() {
        return html`
            <mwc-button dense unelevated label="block" icon="voice_over_off" @click="${() => this.chatBlockAddress()}"></mwc-button>
        `
    }

    firstUpdated() {
        this.getChatBlockedAdresses()

	setInterval(() => {
	    this.getChatBlockedAdresses();
	}, 60000)
    }

    updated(changedProps) {
    }

    async getChatBlockedAdresses() {
        const chatBlockedAdresses = await parentEpml.request('apiCall', {
            url: `/lists/blockedAddresses?apiKey=${this.getApiKey()}`
        })
        this.chatBlockedAdresses = chatBlockedAdresses
    }

    async chatBlockAddress() {
        let address = this.toblockaddress

        let items = [
            address
        ]

        let addressJsonString = JSON.stringify({ "items": items })

        let ret = await parentEpml.request('apiCall', {
            url: `/lists/blockedAddresses?apiKey=${this.getApiKey()}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: `${addressJsonString}`
        })

        if (ret === true) {
            this.chatBlockedAdresses = this.chatBlockedAdresses.filter(item => item != address)
            this.chatBlockedAdresses.push(address)
            snackbar.add({
                labelText: `Success blocked this user.`,
                dismiss: true
            })
        } else {
            snackbar.add({
                labelText: `Error occurred when trying to block this user. Please try again.`,
                dismiss: true
            })
        }
        return ret
    }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
        let apiKey = myNode.apiKey;
        return apiKey;
    }
}

window.customElements.define('block-address', BlockAddress)
