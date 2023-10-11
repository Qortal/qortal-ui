import { LitElement, html, css } from 'lit';
import { render } from 'lit/html.js';
import {
	use,
	get,
	translate,
	translateUnsafeHTML,
	registerTranslateConfig,
} from 'lit-translate';
import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-checkbox';

class AddFriendsModal extends LitElement {
	static get properties() {
		return {
			isOpen: { type: Boolean },
			setIsOpen: { attribute: false },
			isLoading: { type: Boolean },
			userSelected: { type: Object },
			alias: { type: String },
			willFollow: { type: Boolean },
			notes: { type: String },
            onSubmit: {attribute: false},
			editContent: {type: Object},
			onClose: {attribute: false}
		};
	}

	constructor() {
		super();
		this.isOpen = false;
		this.isLoading = false;
		this.alias = '';
		this.willFollow = true;
		this.notes = '';
	}

	static get styles() {
		return css`
		  * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --mdc-theme-secondary: var(--mdc-theme-primary);
                --mdc-theme-surface: var(--white);
                --mdc-dialog-content-ink-color: var(--black);
                --mdc-dialog-min-width: 400px;
                --mdc-dialog-max-width: 1024px;
            }
			.input {
				width: 90%;
				outline: 0;
				border-width: 0 0 2px;
				border-color: var(--mdc-theme-primary);
				background-color: transparent;
				padding: 10px;
				font-family: Roboto, sans-serif;
				font-size: 15px;
				color: var(--chat-bubble-msg-color);
				box-sizing: border-box;
			}

			.input::selection {
				background-color: var(--mdc-theme-primary);
				color: white;
			}

			.input::placeholder {
				opacity: 0.6;
				color: var(--black);
			}

			.close-button {
				display: block;
				--mdc-theme-primary: red;
			}
			.checkbox-row {
				position: relative;
				display: flex;
				align-items: center;
				align-content: center;
				font-family: Montserrat, sans-serif;
				font-weight: 600;
				color: var(--black);
			}
			.modal-overlay {
                display: block;
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent backdrop */
                z-index: 1000;
            }

            .modal-content {
				position: fixed;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
    background-color: var(--mdc-theme-surface);
    width: 80vw;
    max-width: 600px;
    padding: 20px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;
    z-index: 1001;
    border-radius: 5px;
    max-height: 80vh;
    overflow: auto;
            }
			.modal-overlay.hidden {
            display: none;
        }
		`;
	}

	firstUpdated() {}

	clearFields(){
		this.alias = '';
		this.willFollow = true;
		this.notes = '';
	}

    addFriend(){

        this.onSubmit({
            name: this.userSelected.name,
            alias: this.alias,
            notes: this.notes,
            willFollow: this.willFollow
        })
		this.clearFields()
			this.onClose()
    }

	
	async updated(changedProperties) {
		if (changedProperties && changedProperties.has('editContent') && this.editContent) {
			this.userSelected = {
				name: this.editContent.name ?? '',
			}
			this.notes = this.editContent.notes ?? ''
				this.willFollow = this.editContent.willFollow ?? true
				this.alias = this.editContent.alias ?? ''
		}

		
	}

	render() {
		return html`
			  <div class="modal-overlay ${this.isOpen ? '' : 'hidden'}">
			  <div class="modal-content">
				<div style="text-align:center">
					<h1>${this.editContent ? translate('friends.friend10') : translate('friends.friend2')}</h1>
					<hr />
				</div>
				<p>${translate('friends.friend3')}</p>
				<div class="checkbox-row">
					<label
						for="willFollow"
						id="willFollowLabel"
						style="color: var(--black);"
					>
						${get('friends.friend5')}
					</label>
					<mwc-checkbox
						style="margin-right: -15px;"
						id="willFollow"
						@change=${(e) => {
        this.willFollow = e.target.checked;
    }}
						?checked=${this.willFollow}
					></mwc-checkbox>
				</div>
				<div style="height: 15px"></div>
				<div style="display: flex;flex-direction: column;">
					<label
						for="name"
						id="nameLabel"
						style="color: var(--black);"
					>
						${get('login.name')}
					</label>
					<input
						id="name"
						class="input"
						?disabled=${true}
						value=${this.userSelected ? this.userSelected.name : ''}
					/>
				</div>
				<div style="height: 15px"></div>
				<div style="display: flex;flex-direction: column;">
					<label
						for="alias"
						id="aliasLabel"
						style="color: var(--black);"
					>
						${get('friends.friend6')}
					</label>
					<input
						id="alias"
						placeholder=${translate('friends.friend7')}
						class="input"
						value=${this.alias}
						@change=${(e) => (this.alias = e.target.value)}
					/>
				</div>
				<div style="height: 15px"></div>
				<div style="margin-bottom:0;">
					<textarea
						class="input"
						@change=${(e) => (this.notes = e.target.value)}
						value=${this.notes}
						?disabled=${this.isLoading}
						id="messageBoxAddFriend"
						placeholder="${translate('friends.friend4')}"
						rows="3"
					></textarea>
				</div>
				<div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px">
			
				<mwc-button
					?disabled="${this.isLoading}"
					slot="secondaryAction"
					@click="${() => {
						this.setIsOpen(false)
							this.clearFields()
			this.onClose()
					} }"
					class="close-button"
				>
					${translate('general.close')}
				</mwc-button>
				<mwc-button
					?disabled="${this.isLoading}"
					slot="primaryAction"
					@click=${() => {
						this.addFriend();
					}}
					>${this.editContent ? translate('friends.friend10') : translate('friends.friend2')}
				</mwc-button>
				</div>
				</div>
				</div>
		`;
	}
}

customElements.define('add-friends-modal', AddFriendsModal);
