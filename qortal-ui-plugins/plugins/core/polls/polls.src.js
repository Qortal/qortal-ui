import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../epml.js'
import { use, get, translate, translateUnsafeHTML, registerTranslateConfig } from 'lit-translate'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

import '@material/mwc-icon'
import '@material/mwc-button'
import '@material/mwc-textfield'
import '@material/mwc-dialog'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/grid'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class polls extends LitElement {
    static get properties() {
        return {
            loading: { type: Boolean },
            theme: { type: String, reflect: true }
        }
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --mdc-theme-secondary: var(--mdc-theme-primary);
                --paper-input-container-focus-color: var(--mdc-theme-primary);
                --mdc-theme-surface: var(--white);
                --mdc-dialog-content-ink-color: var(--black);
                --lumo-primary-text-color: rgb(0, 167, 245);
                --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
                --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
                --lumo-primary-color: hsl(199, 100%, 48%);
                --lumo-base-color: var(--white);
                --lumo-body-text-color: var(--black);
                --_lumo-grid-border-color: var(--border);
                --_lumo-grid-secondary-border-color: var(--border2);
            }

            #polls-page {
                background: var(--white);
                padding: 12px 24px;
            }

            .divCard {
                border: 1px solid var(--border);
                padding: 1em;
                box-shadow: 0 .3px 1px 0 rgba(0,0,0,0.14), 0 1px 1px -1px rgba(0,0,0,0.12), 0 1px 2px 0 rgba(0,0,0,0.20);
            }

            h2 {
                margin:0;
            }

            h2, h3, h4, h5 {
                color: var(--black);
                font-weight: 400;
            }

            img {
                border-radius: 25%;
                max-width: 42px;
                height: 100%;
                max-height: 42px;
            }

            .red {
                --mdc-theme-primary: #F44336;
            }
        `
    }

    constructor() {
        super()
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    render() {
        return html`
            <div id="polls-page">
                <div style="min-height:48px; display: flex; padding-bottom: 6px; margin: 2px;">
                    <h2 style="margin: 0; flex: 1; padding-top: .1em; display: inline;">${translate("pollspage.ppchange1")}</h2>
                    <mwc-button style="float:right;" @click=${() => this.shadowRoot.querySelector('#pollsDialog').show()}><mwc-icon>add</mwc-icon>${translate("pollspage.ppchange2")}</mwc-button>
                </div>

                <div class="divCard">
                    <h3 style="margin: 0; margin-bottom: 1em; text-align: center;">${translate("pollspage.ppchange3")}</h3>
                    <vaadin-grid theme="large" id="pollsGrid" ?hidden="${this.isEmptyArray(this.polls)}" aria-label="Names" .items="${this.polls}" all-rows-visible>
                        <vaadin-grid-column width="5rem" flex-grow="0" header="${translate("pollspage.ppchange4")}" .renderer=${(root, column, data) => {
                            render(html`${this.renderPollExpiration(data.item)}`, root)
                        }}></vaadin-grid-column>
                        <vaadin-grid-column header="${translate("pollspage.ppchange5")}" path="polls"></vaadin-grid-column>
                        <vaadin-grid-column header="${translate("pollspage.ppchange6")}" path="description"></vaadin-grid-column>
                        <vaadin-grid-column width="14rem" flex-grow="0" header="${translate("pollspage.ppchange7")}" .renderer=${(root, column, data) => {
                            render(html`${this.renderVoteButton(data.item)}`, root)
                        }}></vaadin-grid-column>
                    </vaadin-grid>
                    ${this.isEmptyArray(this.polls) ? html`
                        <span style="color: var(--black);">${translate("pollspage.ppchange8")}</span>
                    `: ''}
                </div>

                <!-- Create Poll Page -->
                <mwc-dialog id="pollsDialog" scrimClickAction="${this.createPollLoading ? '' : 'close'}">
                    <div>${translate("pollspage.ppchange9")}</div>
                    <br>
                    <mwc-textfield style="width:100%;" ?disabled="${this.createPollLoading}" label="${translate("pollspage.ppchange5")}" id="titleInput"></mwc-textfield>
                    <p style="margin-bottom:0;">
                        <mwc-textfield style="width:100%;" ?disabled="${this.createPollLoading}" label="${translate("pollspage.ppchange10")}" id="descInput"></mwc-textfield>
                    </p>
                    <div style="text-align:right; height:36px;">
                        <span ?hidden="${!this.createPollLoading}">
                            <!-- loading message -->
                            ${translate("pollspage.ppchange11")} &nbsp;
                            <paper-spinner-lite
                                style="margin-top:12px;"
                                ?active="${this.createPollLoading}"
                                alt="${translate("pollspage.ppchange12")}"></paper-spinner-lite>
                        </span>
                        <span ?hidden=${this.message === ''} style="${this.error ? 'color:red;' : 'color:green;'}">
                            ${this.message}
                        </span><br>
                    </div>
                    
                    <mwc-button
                        ?disabled="${this.createPollLoading}"
                        slot="primaryAction"
                        @click=${this.createPoll}
                    >
                    ${translate("pollspage.ppchange14")}
                    </mwc-button>
                    <mwc-button
                        ?disabled="${this.createPollLoading}"
                        slot="secondaryAction"
                        dialogAction="cancel"
                        class="red"
                    >
                    ${translate("general.close")}
                    </mwc-button>
                </mwc-dialog>
            </div>
        `
    }

    firstUpdated() {

        this.changeTheme()
        this.changeLanguage()

        window.addEventListener("contextmenu", (event) => {
            event.preventDefault()
            this._textMenu(event)
        })

        window.addEventListener("click", () => {
            parentEpml.request('closeCopyTextMenu', null)
        })

        window.addEventListener('storage', () => {
            const checkLanguage = localStorage.getItem('qortalLanguage')
            const checkTheme = localStorage.getItem('qortalTheme')

            use(checkLanguage)

            if (checkTheme === 'dark') {
                this.theme = 'dark'
            } else {
                this.theme = 'light'
            }
            document.querySelector('html').setAttribute('theme', this.theme)
        })

        window.onkeyup = (e) => {
            if (e.keyCode === 27) {
                parentEpml.request('closeCopyTextMenu', null)
            }
        }

        let configLoaded = false

        parentEpml.ready().then(() => {
            parentEpml.subscribe('selected_address', async selectedAddress => {
                this.selectedAddress = {}
                selectedAddress = JSON.parse(selectedAddress)
                if (!selectedAddress || Object.entries(selectedAddress).length === 0) return
                this.selectedAddress = selectedAddress
            })
            parentEpml.subscribe('config', c => {
                if (!configLoaded) {
                    setTimeout(fetchNames, 1)
                    configLoaded = true
                }
                this.config = JSON.parse(c)
            })
            parentEpml.subscribe('copy_menu_switch', async value => {
                if (value === 'false' && window.getSelection().toString().length !== 0) {
                    this.clearSelection()
                }
            })
        })
        parentEpml.imReady()
    }

    changeTheme() {
        const checkTheme = localStorage.getItem('qortalTheme')
        if (checkTheme === 'dark') {
            this.theme = 'dark';
        } else {
            this.theme = 'light';
        }
        document.querySelector('html').setAttribute('theme', this.theme);
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

    renderCoreText() {
        return html`${translate("pollspage.ppchange16")}`
    }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
        let apiKey = myNode.apiKey;
        return apiKey;
    }

    clearSelection() {
        window.getSelection().removeAllRanges()
        window.parent.getSelection().removeAllRanges()
    }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }
}

window.customElements.define('polls-info', polls)
