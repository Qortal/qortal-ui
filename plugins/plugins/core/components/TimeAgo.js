import { html, LitElement } from 'lit'
import { timeAgoStyles } from './plugins-css'
import './time-elements/index'

class TimeAgo extends LitElement {
	static get properties() {
		return {
			selectedAddress: { type: Object },
			config: { type: Object },
			timestamp: { type: Number },
			format: { type: String, reflect: true },
			timeIso: { type: String }
		}
	}

	static get styles() {
		return [timeAgoStyles]
	}

	constructor() {
		super()
		this.timestamp = 0
		this.timeIso = ''
		this.format = ''
	}

	render() {
		return html`
			<time-ago datetime=${this.timeIso} format=${this.format}></time-ago>
		`
	}

	firstUpdated() {
		// ...
	}

	updated(changedProps) {
		changedProps.forEach((OldProp, name) => {
			if (name === 'timeIso' || name === 'timestamp') {
				this.renderTime(this.timestamp)
			}
		})
		this.shadowRoot.querySelector('time-ago').setAttribute('title', '')
	}

	renderTime(timestamp) {
		timestamp === undefined ? this.timeIso = '' : this.timeIso = new Date(timestamp).toISOString()
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

window.customElements.define('message-time', TimeAgo)