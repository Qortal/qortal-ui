import {css, html, LitElement} from 'lit'
import {get, translate} from '../../translate'
import snackbar from '../functional-components/snackbar.js'

import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/iron-icons/iron-icons.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@vaadin/text-field'

class SearchModal extends LitElement {
	static get properties() {
		return {
			searchContentString: { type: String },
			theme: { type: String, reflect: true }
		}
	}

	constructor() {
		super()
		this.searchContentString = ''
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
	}

	static get styles() {
		return css`
			* {
				--lumo-primary-text-color: rgb(0, 167, 245);
				--lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
				--lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
				--lumo-primary-color: hsl(199, 100%, 48%);
				--lumo-base-color: var(--white);
				--lumo-body-text-color: var(--black);
				--lumo-secondary-text-color: var(--sectxt);
				--lumo-contrast-60pct: var(--vdicon);
				--item-selected-color: var(--nav-selected-color);
				--item-selected-color-text: var(--nav-selected-color-text);
				--item-color-active: var(--nav-color-active);
				--item-color-hover: var(--nav-color-hover);
				--item-text-color: var(--nav-text-color);
				--item-icon-color: var(--nav-icon-color);
				--item-border-color: var(--nav-border-color);
				--item-border-selected-color: var(--nav-border-selected-color);
			}

			paper-dialog.searchSettings {
				min-width: 525px;
				max-width: 525px;
				min-height: auto;
				max-height: 150px;
				background-color: var(--white);
				color: var(--black);
				line-height: 1.6;
				overflow: hidden;
				border: 1px solid var(--black);
				border-radius: 10px;
				padding: 15px;
				box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
			}

			.search {
				display: inline;
				width: 50%;
				align-items: center;
			}
		`
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
		if (checkvalue.length < 3) {
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
