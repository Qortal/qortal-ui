import { LitElement, html, css } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
import { doAddNode, doSetNode } from '../redux/app/app-actions.js'
import snackbar from './snackbar.js'
import { translate, translateUnsafeHTML } from 'lit-translate'
import '../components/language-selector.js'

import '@material/mwc-dialog'
import '@material/mwc-button'
import '@material/mwc-select'
import '@material/mwc-textfield'
import '@material/mwc-icon'
import '@material/mwc-list/mwc-list-item.js'

let settingsDialog

class SettingsPage extends connect(store)(LitElement) {
    static get properties() {
        return {
            lastSelected: { type: Number },
            nodeConfig: { type: Object },
            theme: { type: String, reflect: true }
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

            #main {
                width: 210px;
                display: flex;
                align-items: center;
            }

            .globe {
                color: var(--black);
                --mdc-icon-size: 36px;
            }

            .red {
                --mdc-theme-primary: red;
            }
        `
    }

    constructor() {
        super()
        this.nodeConfig = {}
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light';
    }

    render() {
        return html`
            <mwc-dialog id="settingsDialog" opened=false>
                <div style="display: inline; text-align: center;">
                    <h1>${translate("settings.settings")}</h1>
                    <hr>
                </div>
                <br>
                <div style="min-height: 250px; min-width: 300px; box-sizing: border-box; position: relative;">
                    <mwc-select icon="link" id="nodeSelect" label="${translate("settings.nodeurl")}" index="0" @selected="${(e) => this.nodeSelected(e)}" style="min-width: 130px; max-width:100%; width:100%;">
                        ${this.nodeConfig.knownNodes.map((n, index) => html`
                            <mwc-list-item value="${index}">${n.protocol + '://' + n.domain + ':' + n.port}</mwc-list-item>
                        `)}
                    </mwc-select>
                    <p style="margin-top: 30px;">${translate("settings.nodehint")}</p>
                    <center>
                        <mwc-button outlined @click="${() => this.shadowRoot.querySelector('#addNodeDialog').show()}"><mwc-icon>add</mwc-icon>${translate("settings.addcustomnode")}</mwc-button>
                    </center>
                </div>
                <div style="min-height:100px; min-width: 300px; box-sizing: border-box; position: relative;">
                    <hr><br>
                    <center>
                    <div id="main">
                        <mwc-icon class="globe">language</mwc-icon>&nbsp;<language-selector></language-selector>
                    </div>
                    </center>
                </div>
                <mwc-button
                    slot="primaryAction"
                    dialogAction="close"
                    class="red"
                >
                ${translate("general.close")}
                </mwc-button>
            </mwc-dialog>

            <mwc-dialog id="addNodeDialog">
                <div style="text-align: center;">
                    <h2>${translate("settings.addcustomnode")}</h2>
                    <hr>
                </div>
                <br>
                <mwc-select id="protocolList" label="${translate("settings.protocol")}" style="width:100%;">
                    <mwc-list-item value="http">http</mwc-list-item>
                    <mwc-list-item value="https">https</mwc-list-item>
                </mwc-select>
                <br>
                <mwc-textfield id="domainInput" style="width:100%;" label="${translate("settings.domain")}"></mwc-textfield>
                <mwc-textfield id="portInput" style="width:100%;" label="${translate("settings.port")}"></mwc-textfield>
                <mwc-button
                    slot="secondaryAction"
                    dialogAction="close"
                    class="red"
                >
                ${translate("general.close")}
                </mwc-button>
                <mwc-button
                    slot="primaryAction"
                    @click="${this.addNode}"
                >
                ${translate("settings.addandsave")}
                </mwc-button>
            </mwc-dialog>
        `
    }

    firstUpdated() {
        // ...
    }

    stateChanged(state) {
        this.config = state.config
        this.nodeConfig = state.app.nodeConfig
    }

    show() {
        this.shadowRoot.getElementById('settingsDialog').show()
    }

    nodeSelected(e) {
        const selectedNodeIndex = this.shadowRoot.getElementById('nodeSelect').value
        const selectedNode = this.nodeConfig.knownNodes[selectedNodeIndex]
        const selectedNodeUrl = `${selectedNode.protocol + '://' + selectedNode.domain + ':' + selectedNode.port}`

        const index = parseInt(selectedNodeIndex)
        if (isNaN(index)) return

        // Set selected node
        store.dispatch(doSetNode(selectedNodeIndex))
        snackbar.add({
            labelText: `UI Set To Node : ${selectedNodeUrl}`,
            dismiss: true
        })
        this.shadowRoot.querySelector('#settingsDialog').close()
    }

    addNode() {
        const protocolList = this.shadowRoot.getElementById('protocolList').value
        const domainInput = this.shadowRoot.getElementById('domainInput').value
        const portInput = this.shadowRoot.getElementById('portInput').value

        if (protocolList.length >= 4 && domainInput.length >= 3 && portInput.length >= 4) {
            const nodeObject = {
                protocol: protocolList,
                domain: domainInput,
                port: portInput,
                enableManagement: true
            }

            store.dispatch(doAddNode(nodeObject))

            const haveNodes = JSON.parse(localStorage.getItem('myQortalNodes'));

            if (haveNodes === null || haveNodes.length === 0) {

                var savedNodes = [];
                savedNodes.push(nodeObject);
                localStorage.setItem('myQortalNodes', JSON.stringify(savedNodes));

                snackbar.add({
                    labelText: 'Successfully Added And Saved Custom Node',
                    dismiss: true
                })

                this.shadowRoot.getElementById('protocolList').value = ''
                this.shadowRoot.getElementById('domainInput').value = ''
                this.shadowRoot.getElementById('portInput').value = ''

                this.shadowRoot.querySelector('#addNodeDialog').close()

            } else {

                var stored = JSON.parse(localStorage.getItem('myQortalNodes'));
                stored.push(nodeObject);
                localStorage.setItem('myQortalNodes', JSON.stringify(stored));

                snackbar.add({
                    labelText: 'Successfully Added And Saved Custom Node',
                    dismiss: true
                })

                this.shadowRoot.getElementById('protocolList').value = ''
                this.shadowRoot.getElementById('domainInput').value = ''
                this.shadowRoot.getElementById('portInput').value = ''

                this.shadowRoot.querySelector('#addNodeDialog').close()
            }
        }
    }
}

window.customElements.define('settings-page', SettingsPage)

const settings = document.createElement('settings-page')
settingsDialog = document.body.appendChild(settings)

export default settingsDialog
