import { html, LitElement } from 'lit'
import { chatGroupsModalStyles } from './plugins-css'
import './ChatGroupManager'
import '@material/mwc-dialog'
import '@material/mwc-list/mwc-list-item.js'
import '@material/mwc-menu'

// Multi language support
import { translate } from '../../../../core/translate'

export class ChatGroupsModal extends LitElement {
	static get properties() {
		return {
			openDialogGroupsModal: { type: Boolean },
			setOpenDialogGroupsModal: { attribute: false }
		}
	}

	static get styles() {
		return [chatGroupsModalStyles]
	}

	constructor() {
		super()
		this.openDialogGroupsModal = false
	}

	render() {
		return html`
			<mwc-dialog id="showDialogGroupsModal" ?open=${this.openDialogGroupsModal} @closed=${() => {this.setOpenDialogGroupsModal(false)}}>
				<div class="dialog-header"></div>
				<div class="dialog-container">
					<chat-groups-manager></chat-groups-manager>
				</div>
				<mwc-button slot="primaryAction" dialogAction="cancel" class="red" @click=${() => {this.setOpenDialogGroupsModal(false)}}>
					${translate('general.close')}
				</mwc-button>
			</mwc-dialog>
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

window.customElements.define('chat-groups-modal', ChatGroupsModal)
