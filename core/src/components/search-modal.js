import { html, LitElement } from 'lit'
import { searchModalStyles } from '../styles/core-css'
import snackbar from '../functional-components/snackbar'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/iron-icons/iron-icons.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@vaadin/text-field'

// Multi language support
import { get, translate } from '../../translate'

class SearchModal extends LitElement {
	static get properties() {
		return {
			searchContentString: { type: String },
			theme: { type: String, reflect: true }
		}
	}

	static get styles() {
		return [searchModalStyles]
	}

	constructor() {
		super()
		this.searchContentString = ''
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
	}

	render() {
		return html`
			<div style="display: inline;">
				<paper-icon-button icon="icons:search" @click=${() => this.openSearch()} title="${translate("websitespage.schange35")}"></paper-icon-button></a>
			</div>

			<paper-dialog id="searchSettingsDialog" class="searchSettings">
				<div style="display: inline;">
					<div class="search">
						<vaadin-text-field
							style="width: 350px"
							id="searchContent"
							placeholder="${translate("explorerpage.exp1")}"
							value="${this.searchContentString}"
							@keydown="${this.searchKeyListener}"
							clear-button-visible
						>
						</vaadin-text-field>
						<paper-icon-button icon="icons:search" @click="${() => this.openUserInfo()}" title="${translate("websitespage.schange35")}"></paper-icon-button>
						<paper-icon-button icon="icons:close" @click="${() => this.closeSearch()}" title="${translate("general.close")}"></paper-icon-button>
					</div>
				</div>
			</paper-dialog>
		`
	}

	firstUpdated() {
		// ...
	}

	openSearch() {
		this.shadowRoot.getElementById('searchSettingsDialog').open()
	}

	closeSearch() {
		this.shadowRoot.getElementById('searchSettingsDialog').close()
	}

	searchKeyListener(e) {
		if (e.key === 'Enter') {
			this.openUserInfo()
		}
	}

	openUserInfo() {
		const checkvalue = this.shadowRoot.getElementById('searchContent').value

		if (checkvalue.length < 1) {
			let snackbar1string = get("publishpage.pchange20")
			let snackbar2string = get("welcomepage.wcchange4")

			snackbar.add({
				labelText: `${snackbar1string} ${snackbar2string}`,
				dismiss: true
			})

			this.shadowRoot.getElementById('searchContent').value = this.searchContentString
		} else {
			let sendInfoAddress = this.shadowRoot.getElementById('searchContent').value

			const infoDialog = document.getElementById('main-app').shadowRoot.querySelector('app-view').shadowRoot.querySelector('user-info-view')

			infoDialog.openUserInfo(sendInfoAddress)

			this.shadowRoot.getElementById('searchContent').value = this.searchContentString
			this.shadowRoot.getElementById('searchSettingsDialog').close()
		}
	}
}

window.customElements.define('search-modal', SearchModal)