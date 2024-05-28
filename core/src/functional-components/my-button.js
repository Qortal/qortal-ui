import { html, LitElement } from 'lit'
import { myButtonStyles } from '../styles/core-css'
import '@vaadin/button'
import '@polymer/paper-spinner/paper-spinner-lite.js'

export class MyButton extends LitElement {
	static get properties() {
		return {
			onClick: { type: Function },
			isLoading: { type: Boolean },
			label: { type: String }
		}
	}

	static get styles() {
		return [myButtonStyles]
	}

	constructor() {
		super()
		this.onClick = () => { }
		this.isLoading = false
		this.label = ''
	}

	render() {
		return html`
			<vaadin-button ?disabled="${this.isLoading}" @click="${this.onClick}">
				${this.isLoading === false ? html`${this.label}` : html`<paper-spinner-lite active></paper-spinner-lite>`}
			</vaadin-button>
		`
	}

	firstUpdated() {
		// ...
	}
}

window.customElements.define('my-button', MyButton)