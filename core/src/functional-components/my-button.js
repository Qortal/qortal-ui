import {css, html, LitElement} from 'lit';
import '@vaadin/button';
import '@polymer/paper-spinner/paper-spinner-lite.js';

export class MyButton extends LitElement {
	static properties = {
		onClick: { type: Function },
		isLoading: { type: Boolean },
		label: { type: String },
	};

	static styles = css`
		vaadin-button {
			height: 100%;
			margin: 0;
			cursor: pointer;
			min-width: 80px;
			background-color: #03a9f4;
			color: white;
		}

		vaadin-button:hover {
			opacity: 0.8;
		}
	`;

	constructor() {
		super();
		this.onClick = () => {};
		this.isLoading = false;
		this.label = '';
	}

	render() {
		return html`
			<vaadin-button
				?disabled="${this.isLoading}"
				@click="${this.onClick}"
			>
				${this.isLoading === false
					? html`${this.label}`
					: html`<paper-spinner-lite active></paper-spinner-lite>`}
			</vaadin-button>
		`;
	}
}
customElements.define('my-button', MyButton);
