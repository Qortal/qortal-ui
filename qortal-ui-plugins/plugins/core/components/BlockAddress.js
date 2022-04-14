import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../epml.js'
import snackbar from './snackbar.js'
import { use, get, translate, translateUnsafeHTML, registerTranslateConfig } from 'lit-translate'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

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
            <mwc-button dense unelevated label="${translate("blockpage.bcchange1")}" icon="voice_over_off" @click="${() => this.chatBlockAddress()}"></mwc-button>
        `
    }

    firstUpdated() {

        this.changeLanguage()
        this.getChatBlockedAdresses()

	setInterval(() => {
	    this.getChatBlockedAdresses();
	}, 60000)

        window.addEventListener('storage', () => {
            const checkLanguage = localStorage.getItem('qortalLanguage')
            use(checkLanguage)
        })

    }

    updated(changedProps) {
    }

    changeLanguage() {
        const checkLanguage = localStorage.getItem('qortalLanguage')

        if (checkLanguage === null || checkLanguage.length === 0) {
            localStorage.setItem('qortalLanguage', 'us')
            use('us')
        } else {
            use(checkLanguage)
        }
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
            this.getChatBlockedList()
            let err1string = get("blockpage.bcchange2")
            snackbar.add({
                labelText: `${err1string}`,
                dismiss: true
            })
        } else {
            let err2string = get("blockpage.bcchange2")
            snackbar.add({
                labelText: `${err2string}`,
                dismiss: true
            })
        }
        return ret
    }

    getChatBlockedList() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const blockedAddressesUrl = `${nodeUrl}/lists/blockedAddresses?apiKey=${this.getApiKey()}`
        const err3string = 'No regitered name'

        localStorage.removeItem("ChatBlockedAddresses")

        var obj = [];

        fetch(blockedAddressesUrl).then(response => {
            return response.json()
        }).then(data => {
            return data.map(item => {
                const noName = {
                    name: err3string,
                    owner: item
                }
                fetch(`${nodeUrl}/names/address/${item}?limit=0&reverse=true`).then(res => {
                    return res.json()
                }).then(jsonRes => {
                    if(jsonRes.length) {
                        jsonRes.map (item => {
                            obj.push(item)
                        })
                    } else {
                        obj.push(noName)
                    }
                    localStorage.setItem("ChatBlockedAddresses", JSON.stringify(obj))
                })
            })
        })
    }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
        let apiKey = myNode.apiKey;
        return apiKey;
    }
}

window.customElements.define('block-address', BlockAddress)
