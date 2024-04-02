import {css, html, LitElement} from 'lit';
import {translate,} from '../../../../core/translate'
import '@material/mwc-menu';
import '@material/mwc-list/mwc-list-item.js';
import '@material/mwc-dialog'
import './ChatGroupManager'

export class ChatGroupsModal extends LitElement {
	static get properties() {
		return {
	  openDialogGroupsModal: { type: Boolean },
	  setOpenDialogGroupsModal: { attribute: false}
		};
	}

	static get styles() {
		return css`
			* {
				--mdc-theme-text-primary-on-background: var(--black);
				--mdc-dialog-max-width: 85vw;
				--mdc-dialog-max-height: 95vh;
			}

			.imageContainer {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

			@-webkit-keyframes loadingAnimation {
				0% {
					-webkit-transform: rotate(0deg);
					transform: rotate(0deg);
				}
				100% {
					-webkit-transform: rotate(360deg);
					transform: rotate(360deg);
				}
			}

			@keyframes loadingAnimation {
				0% {
					-webkit-transform: rotate(0deg);
					transform: rotate(0deg);
				}
				100% {
					-webkit-transform: rotate(360deg);
					transform: rotate(360deg);
				}
			}
		`;
	}

	constructor() {
		super();
	this.openDialogGroupsModal = false

	}



	firstUpdated() {
	}


	render() {
		return html`

			<mwc-dialog
                id="showDialogGroupsModal"
                ?open=${this.openDialogGroupsModal}
                @closed=${() => {
					this.setOpenDialogGroupsModal(false)
				}}>
					<div class="dialog-header"></div>
					<div class="dialog-container ">
						<chat-groups-manager></chat-groups-manager>
			</div>
					<mwc-button
						slot="primaryAction"
						dialogAction="cancel"
						class="red"
						@click=${() => {
							this.setOpenDialogGroupsModal(false)
						}}
					>
					    ${translate('general.close')}
					</mwc-button>
				</mwc-dialog>
		`;
	}
}

customElements.define('chat-groups-modal', ChatGroupsModal);
