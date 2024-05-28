import { html, LitElement } from 'lit'
import { Epml } from '../../../epml'
import { toolTipStyles } from './plugins-css'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ToolTip extends LitElement {
	static get properties() {
		return {
			selectedAddress: { type: Object },
			config: { type: Object },
			toolTipMessage: { type: String, reflect: true },
			showToolTip: { type: Boolean, reflect: true }
		}
	}

	static get styles() {
		return [toolTipStyles]
	}

	constructor() {
		super()
		this.selectedAddress = {}
		this.config = {
			user: {
				node: {
				}
			}
		}
		this.toolTipMessage = ''
		this.showToolTip = false
	}

	render() {
		return html`
			<span id="myTool" class="tooltiptext">${this.toolTipMessage}</span>
		`
	}

	firstUpdated() {
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
					configLoaded = true
				}
				this.config = JSON.parse(c)
			})
		})

		parentEpml.imReady()
	}

	// Standard functions
	getApiKey() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.apiKey
	}

	isEmptyArray(arr) {
		if (!arr) { return true }
		return arr.length === 0
	}

	round(number) {
		return (Math.round(parseFloat(number) * 1e8) / 1e8).toFixed(8)
	}
}

window.customElements.define('tool-tip', ToolTip)
