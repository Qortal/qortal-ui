import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'

import { doAddNode, doSetNode } from '../redux/app/app-actions.js'

import '@material/mwc-dialog'
import '@material/mwc-button'
import '@material/mwc-select'
import '@material/mwc-textfield'
import '@material/mwc-icon'

import '@material/mwc-list/mwc-list-item.js'

import snackbar from './snackbar.js'

let settingsDialog

class SettingsPage extends connect(store)(LitElement) {
    static get properties() {
        return {
            lastSelected: { type: Number },
            nodeConfig: { type: Object }
        }
    }

    static get styles() {
        return css`
            .red {
                --mdc-theme-primary: red;
            }
        `
    }

    constructor() {
        super()
        this.nodeConfig = {}
    }

    render() {
        return html`
            <style>
                
            </style>

            <mwc-dialog id="settingsDialog" heading="Settings" opened=false>
                <div style="min-height:450px; min-width: 300px; box-sizing: border-box; position: relative;">

                    <mwc-select id="nodeSelect" label="Node url" index="0" @selected=${(e) => this.nodeSelected(e)} style="min-width: 130px; max-width:100%; width:100%;">
                        ${this.nodeConfig.knownNodes.map((n, index) => html`
                            <mwc-list-item value="${index}">${n.protocol + '://' + n.domain + ':' + n.port}</mwc-list-item>
                        `)}
                    </mwc-select>

                    <p style="margin-top: 45px;">Select a node from the default list of nodes above or add a custom node to the list above by clicking on the button below</p>

                     <mwc-button style="display: block; bottom: 0; position: absolute; left: 30%;" @click=${() => this.shadowRoot.querySelector('#addNodeDialog').show()}><mwc-icon>add</mwc-icon>Add Custom Node</mwc-button>
                </div>
                <mwc-button
                    slot="primaryAction"
                    dialogAction="close"
                    class="red"
                    >
                    Close
                </mwc-button>
            </mwc-dialog>
            
            <mwc-dialog id="addNodeDialog" heading="Add Custom Node">
                <mwc-select id="protocolList" label="Protocol" style="width:100%;">
                    <mwc-list-item value="http">http</mwc-list-item>
                    <mwc-list-item value="https">https</mwc-list-item>
                </mwc-select>
                <br>
                <mwc-textfield id="domainInput" style="width:100%;" label="Domain"></mwc-textfield>
                <mwc-textfield id="portInput" style="width:100%;" label="Port"></mwc-textfield>
                <mwc-button
                    slot="secondaryAction"
                    dialogAction="close"
                    class="red"
                    >
                    Cancel
                </mwc-button>
                <mwc-button
                    slot="primaryAction"
                    @click=${this.addNode}
                >
                    Add
                </mwc-button>
            </mwc-dialog>
        `
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
            labelText: `UI Set to Node : ${selectedNodeUrl}`,
            dismiss: true
        })
    }

    addNode() {
        const protocolList = this.shadowRoot.getElementById('protocolList').value
        const domainInput = this.shadowRoot.getElementById('domainInput').value
        const portInput = this.shadowRoot.getElementById('portInput').value

        if (protocolList.length >= 4 && domainInput.length >= 3 && portInput.length >= 4) {
            const nodeObject = {
                protocol: protocolList,
                domain: domainInput,
                port: portInput
            }

            store.dispatch(doAddNode(nodeObject))

            snackbar.add({
                labelText: 'Successfully Added a Custom Node',
                dismiss: true
            })

            this.shadowRoot.getElementById('protocolList').value = ''
            this.shadowRoot.getElementById('domainInput').value = ''
            this.shadowRoot.getElementById('portInput').value = ''

            this.shadowRoot.querySelector('#addNodeDialog').close()
        }
    }
}

window.customElements.define('settings-page', SettingsPage)

const settings = document.createElement('settings-page')
settingsDialog = document.body.appendChild(settings)

export default settingsDialog
