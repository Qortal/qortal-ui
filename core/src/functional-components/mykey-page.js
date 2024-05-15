import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../store'
import { testApiKey } from '../apiKeyUtils'
import { mykeyPageStyles } from '../styles/core-css'
import snackbar from './snackbar'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-icon'
import '@material/mwc-textfield'

// Multi language support
import { get, translate } from '../../translate'

let mykeyDialog

class MykeyPage extends connect(store)(LitElement) {
	static get properties() {
		return {
			nodeConfig: { type: Object },
			theme: { type: String, reflect: true }
		}
	}

	static get styles() {
		return [mykeyPageStyles]
	}

	constructor() {
		super()
		this.nodeConfig = {}
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
	}

	render() {
		return html`
			<mwc-dialog id="mykeyDialog" heading="${translate("apipage.achange1")}" opened=false>
				<div style="min-height:200px; min-width: 300px; box-sizing: border-box; position: relative;">
					<mwc-textfield icon="fingerprint" id="mykeyInput" style="width:100%;" label="${translate("apipage.achange2")}"></mwc-textfield>
					<p style="margin-top: 45px;">${translate("apipage.achange3")}</p>
				</div>
				<mwc-button slot="secondaryAction" dialogAction="close" class="red">
					${translate("apipage.achange4")}
				</mwc-button>
				<mwc-button slot="primaryAction" @click="${this.addMykey}">
					${translate("apipage.achange5")}
				</mwc-button>
			</mwc-dialog>
		`
	}

	firstUpdated() {
		// ...
	}

	show() {
		this.shadowRoot.getElementById('mykeyDialog').show()
	}

	async addMykey() {
		const mykeyInput = this.shadowRoot.getElementById('mykeyInput').value

		let selectedNode = this.nodeConfig.knownNodes[this.nodeConfig.node]
		let testResult = await testApiKey(mykeyInput)

		if (testResult === true) {
			selectedNode.apiKey = mykeyInput

			this.nodeConfig.knownNodes[this.nodeConfig.node] = selectedNode

			localStorage.setItem('myQortalNodes', JSON.stringify(this.nodeConfig.knownNodes))

			let snackbar1 = get("apipage.achange6")

			snackbar.add({
				labelText: `${snackbar1}`,
				dismiss: true
			})

			this.shadowRoot.getElementById('mykeyInput').value = ''
			this.shadowRoot.querySelector('#mykeyDialog').close()
		} else {
			let snackbar2 = get("apipage.achange7")

			snackbar.add({
				labelText: `${snackbar2}`,
				dismiss: true
			})

			this.shadowRoot.getElementById('mykeyInput').value = ''
			this.shadowRoot.querySelector('#mykeyDialog').close()
		}
	}

	stateChanged(state) {
		this.config = state.config
		this.nodeConfig = state.app.nodeConfig
	}
}

window.customElements.define('mykey-page', MykeyPage)

const mykey = document.createElement('mykey-page')
mykeyDialog = document.body.appendChild(mykey)
export default mykeyDialog