import { LitElement, html, css } from 'lit'
import { get, translate, translateUnsafeHTML } from 'lit-translate'
import isElectron from 'is-electron'

import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/iron-icons/iron-icons.js'

class CheckForUpdate extends LitElement {
	static get properties() {
		return {
			theme: { type: String, reflect: true }
		}
	}

	constructor() {
		super()
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
	}

	static styles = [
		css`
		`
	]

	render() {
		return html`
			${this.renderUpdateButton()}
		`
	}

	firstUpdated() {
	}

	renderUpdateButton() {
		if (!isElectron) {
			return html`
				<div style="display: inline;">
					<paper-icon-button icon="icons:get-app" @click=${() => this.checkupdate()} title="${translate("appspage.schange38")} UI"></paper-icon-button>
				</div>
				<div>&nbsp;&nbsp;</div>
			`
		} else {
			return html``
		}
	}

	checkupdate() {
		window.electronAPI.checkForUpdate()
	}
}

window.customElements.define('check-for-update', CheckForUpdate)
