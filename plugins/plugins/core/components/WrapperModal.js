import { html, LitElement } from 'lit'
import { wrapperModalStyles } from './plugins-css'

export class WrapperModal extends LitElement {
	static get properties() {
		return {
			customStyle: { type: String },
			onClickFunc: { attribute: false },
			zIndex: { type: Number }
		}
	}

	static get styles() {
		return [wrapperModalStyles]
	}

	constructor() {
		super()
	}

	render() {
		return html`
			<div>
				<div style="z-index: ${this.zIndex || 50}" class="backdrop" @click=${() => { this.onClickFunc() }}></div>
				<div class="modal-body" style=${this.customStyle ? this.customStyle : ""}><slot></slot></div>
			</div>
		`
	}

	firstUpdated() {
		// ...
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

window.customElements.define('wrapper-modal', WrapperModal)
