import { html, LitElement } from 'lit'
import { Epml } from '../../../epml'
import { chatMessageStyles } from './plugins-css'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ChatMessage extends LitElement {
	static get properties() {
		return {
			selectedAddress: { type: Object },
			config: { type: Object },
			message: { type: Object, reflect: true }
		}
	}

	static get styles() {
		return [chatMessageStyles]
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
		this.message = {}
	}

	render() {
		return html`
			<li class="clearfix">
				<div class="message-data ${this.message.sender === this.selectedAddress.address ? "align-right" : ""}">
					<span class="message-data-name">${this.message.sender}</span> &nbsp;
					<span class="message-data-time">10:10 AM, Today</span>
				</div>
				<div class="message ${this.message.sender === this.selectedAddress.address ? "my-message float-right" : "other-message float-left"}">
					${this.message.decodedMessage}
				</div>
			</li>
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

window.customElements.define('chat-message', ChatMessage)
