import { html, LitElement } from 'lit'
import { Epml } from '../../../epml'
import { buttonIconCopyStyles } from './plugins-css'
import '@material/mwc-icon-button'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ButtonIconCopy extends LitElement {
	static get properties() {
		return {
			textToCopy: { type: String },
			title: { type: String },
			onSuccessMessage: { type: String },
			onErrorMessage: { type: String },
			buttonSize: { type: String },
			iconSize: { type: String },
			color: { type: String },
			offsetLeft: { type: String },
			offsetRight: { type: String }
		}
	}

	static get styles() {
		return [buttonIconCopyStyles]
	}

	constructor() {
		super()
		this.textToCopy = ''
		this.title = 'Copy to clipboard'
		this.onSuccessMessage = 'Copied to clipboard'
		this.onErrorMessage = 'Unable to copy'
		this.buttonSize = '48px'
		this.iconSize = '24px'
		this.color = 'inherit'
		this.offsetLeft = '0'
		this.offsetRight = '0'
	}

	render() {
		return html`
			<mwc-icon-button
				title=${this.title}
				label=${this.title}
				icon="content_copy"
				@click=${() => this.saveToClipboard(this.textToCopy)}
			>
			</mwc-icon-button>
		`
	}

	firstUpdated() {
		// ...
	}

	connectedCallback() {
		super.connectedCallback()
		this.style.setProperty('--mdc-icon-button-size', this.buttonSize)
		this.style.setProperty('--mdc-icon-size', this.iconSize)
		this.style.setProperty('color', this.color)
		this.style.setProperty('margin-left', this.offsetLeft)
		this.style.setProperty('margin-right', this.offsetRight)
	}

	async saveToClipboard(text) {
		try {
			await navigator.clipboard.writeText(text)
			parentEpml.request('showSnackBar', this.onSuccessMessage)
		} catch (err) {
			parentEpml.request('showSnackBar', this.onErrorMessage)
			console.error('Copy to clipboard error:', err)
		}
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

window.customElements.define('button-icon-copy', ButtonIconCopy)