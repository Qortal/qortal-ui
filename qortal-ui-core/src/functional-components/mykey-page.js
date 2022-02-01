import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
import { testApiKey } from '../apiKeyUtils.js'

import '@material/mwc-dialog'
import '@material/mwc-button'
import '@material/mwc-select'
import '@material/mwc-textfield'
import '@material/mwc-icon'

import snackbar from './snackbar.js'

let mykeyDialog

class MykeyPage extends connect(store)(LitElement) {
    static get properties() {
        return {
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
            <mwc-dialog id="mykeyDialog" heading="Add API key" opened=false>
                <div style="min-height:200px; min-width: 300px; box-sizing: border-box; position: relative;">
                    <mwc-textfield icon="fingerprint" id="mykeyInput" style="width:100%;" label="API key"></mwc-textfield>
                    <p style="margin-top: 45px;">Please enter the API key for this node. It can be found in a file called "apikey.txt" in the directory where the core is installed. Alternatively, click Cancel to use the core with reduced functionality.</p>
                </div>
                <mwc-button
                    slot="secondaryAction"
                    dialogAction="close"
                    class="red"
                >
                Cancel
                </mwc-button>
                <mwc-button
                    slot="primaryAction"
                    @click="${this.addMykey}"
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
        this.shadowRoot.getElementById('mykeyDialog').show()
    }

    async addMykey() {
        const mykeyInput = this.shadowRoot.getElementById('mykeyInput').value
        let selectedNode = this.nodeConfig.knownNodes[this.nodeConfig.node];
        let testResult = await testApiKey(mykeyInput);

        if (testResult === true) {
            selectedNode.apiKey = mykeyInput;
            this.nodeConfig.knownNodes[this.nodeConfig.node] = selectedNode;
            localStorage.setItem('myQortalNodes', JSON.stringify(this.nodeConfig.knownNodes));
            snackbar.add({
                labelText: 'Successfully Added API Key',
                dismiss: true
            })
            this.shadowRoot.getElementById('mykeyInput').value = ''
            this.shadowRoot.querySelector('#mykeyDialog').close()
        } else {
            snackbar.add({
                labelText: 'API Key Wrong, No Apikey Added',
                dismiss: true
            })
            this.shadowRoot.getElementById('mykeyInput').value = ''
            this.shadowRoot.querySelector('#mykeyDialog').close()
        }
    }
}

window.customElements.define('mykey-page', MykeyPage)

const mykey = document.createElement('mykey-page')
mykeyDialog = document.body.appendChild(mykey)

export default mykeyDialog
