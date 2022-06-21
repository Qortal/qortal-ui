import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../epml.js'
import snackbar from './snackbar.js'
import { use, get, translate, translateUnsafeHTML, registerTranslateConfig } from 'lit-translate'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

import '@polymer/paper-tooltip/paper-tooltip.js'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class LevelFounder extends LitElement {
    static get properties() {
        return {
            checkleveladdress: { type: String, attribute: true },
            selectedAddress: { type: Object },
            config: { type: Object },
            memberInfo: { type: Array }
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
                --paper-input-container-focus-color: var(--mdc-theme-primary);
                --lumo-primary-text-color: rgb(0, 167, 245);
                --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
                --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
                --lumo-primary-color: hsl(199, 100%, 48%);
                --lumo-base-color: var(--white);
                --lumo-body-text-color: var(--black);
            }

            h2 {
                 margin:0;
            }

            h2, h3, h4, h5 {
                color:# var(--black);
                font-weight: 400;
            }

            .level {
                position: relative;
                display: inline;
            }

            .custom {
                --paper-tooltip-background: #03a9f4;
                --paper-tooltip-text-color: #fff;
            }

            .badge {
                align-items: center;
                background: #03a9f4;
                border: 1px solid transparent;
                border-radius: 99em;
                color: #fff;
                display: flex;
                font-size: 10px;
                font-weight: 400;
                height: 12px;
                justify-content: center;
                line-height: 1;
                min-width: 12px;
                position: absolute;
                left: -16px;
                top: -12px;
                cursor: pointer;
            }
        `
    }

    constructor() {
        super()
        this.memberInfo = []
        this.selectedAddress = window.parent.reduxStore.getState().app.selectedAddress.address
    }

    render() {
        return html`
            <div class="level">
                ${this.renderFounder()}
                ${this.renderLevel()}
            </div>
        `
    }

    firstUpdated() {

        this.changeLanguage()
        this.checkAddressInfo()

        window.addEventListener('storage', () => {
            const checkLanguage = localStorage.getItem('qortalLanguage')
            use(checkLanguage)
        })

        let configLoaded = false

        parentEpml.ready().then(() => {
            parentEpml.subscribe('selected_address', async selectedAddress => {
                this.selectedAddress = {}
                selectedAddress = JSON.parse(selectedAddress)
                if (!selectedAddress || Object.entries(selectedAddress).length === 0) return
                this.selectedAddress = selectedAddress
            })
        })
        parentEpml.imReady()
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

    async checkAddressInfo() {
        let toCheck = this.checkleveladdress
        const memberInfo = await parentEpml.request('apiCall', {
            url: `/addresses/${toCheck}`
        })
        this.memberInfo = memberInfo
    }

    renderFounder() {
        let adressfounder = this.memberInfo.flags
        if (adressfounder === 1) {
            return html `
                <span id="founderTooltip" class="badge">F</span>
                <paper-tooltip class="custom" for="founderTooltip" position="top">FOUNDER</paper-tooltip>
            `
        } else {
            return html ``
        }
    }

    renderLevel() {
        let adresslevel = this.memberInfo.level
        return html `
            <span id="levelTooltip">${translate("mintingpage.mchange27")} ${adresslevel}</span>
        `
    }

    _textMenu(event) {
        const getSelectedText = () => {
            var text = "";
            if (typeof window.getSelection != "undefined") {
                text = window.getSelection().toString();
            } else if (typeof this.shadowRoot.selection != "undefined" && this.shadowRoot.selection.type == "Text") {
                text = this.shadowRoot.selection.createRange().text;
            }
            return text;
        }

        const checkSelectedTextAndShowMenu = () => {
            let selectedText = getSelectedText();
            if (selectedText && typeof selectedText === 'string') {
                let _eve = { pageX: event.pageX, pageY: event.pageY, clientX: event.clientX, clientY: event.clientY }
                let textMenuObject = { selectedText: selectedText, eventObject: _eve, isFrame: true }
                parentEpml.request('openCopyTextMenu', textMenuObject)
            }
        }
        checkSelectedTextAndShowMenu()
    }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
        let apiKey = myNode.apiKey;
        return apiKey;
    }
}

window.customElements.define('level-founder', LevelFounder)
