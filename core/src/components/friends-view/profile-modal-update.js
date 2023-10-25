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
import { connect } from 'pwa-helpers';
import { store } from '../../store';
import '@polymer/paper-spinner/paper-spinner-lite.js';

class ProfileModalUpdate extends connect(store)(LitElement) {
	static get properties() {
		return {
			isOpen: { type: Boolean },
			setIsOpen: { attribute: false },
			isLoading: { type: Boolean },
			onSubmit: { attribute: false },
			editContent: { type: Object },
			onClose: { attribute: false },
			tagline: { type: String },
			bio: { type: String },
			wallets: { type: Array },
		};
	}

	constructor() {
		super();
		this.isOpen = false;
		this.isLoading = false;
		this.nodeUrl = this.getNodeUrl();
		this.myNode = this.getMyNode();
		this.tagline = '';
		(this.bio = ''),
			(this.walletList = [
				'btc_Address',
				'ltc_Address',
				'doge_Address',
				'dgb_Address',
				'rvn_Address',
				'arrr_Address',
			]);
		let wallets = {};
		this.walletList.forEach((item) => {
			wallets[item] = '';
		});
		this.wallets = wallets;
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
				box-sizing: border-box;
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

			.modal-button {
				font-family: Roboto, sans-serif;
				font-size: 16px;
				color: var(--mdc-theme-primary);
				background-color: transparent;
				padding: 8px 10px;
				border-radius: 5px;
				border: none;
				transition: all 0.3s ease-in-out;
			}

			.modal-button-red {
				font-family: Roboto, sans-serif;
				font-size: 16px;
				color: #f44336;
				background-color: transparent;
				padding: 8px 10px;
				border-radius: 5px;
				border: none;
				transition: all 0.3s ease-in-out;
			}

			.modal-button-red:hover {
				cursor: pointer;
				background-color: #f4433663;
			}

			.modal-button:hover {
				cursor: pointer;
				background-color: #03a8f475;
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
				background-color: rgba(
					0,
					0,
					0,
					0.5
				); /* Semi-transparent backdrop */
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
				display: flex;
				flex-direction: column;
			}

			.modal-overlay.hidden {
				display: none;
			}
			.avatar {
				width: 36px;
				height: 36px;
				display: flex;
				align-items: center;
			}

			.app-name {
				display: flex;
				gap: 20px;
				align-items: center;
				width: 100%;
				cursor: pointer;
				padding: 5px;
				border-radius: 5px;
				margin-bottom: 10px;
			}
			.inner-content {
				display: flex;
				flex-direction: column;
				max-height: 75vh;
				flex-grow: 1;
				overflow: auto;
			}

			.inner-content::-webkit-scrollbar-track {
				background-color: whitesmoke;
				border-radius: 7px;
			}

			.inner-content::-webkit-scrollbar {
				width: 12px;
				border-radius: 7px;
				background-color: whitesmoke;
			}

			.inner-content::-webkit-scrollbar-thumb {
				background-color: rgb(180, 176, 176);
				border-radius: 7px;
				transition: all 0.3s ease-in-out;
			}
		`;
	}

	firstUpdated() {}

	getNodeUrl() {
		const myNode =
			store.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			];

		const nodeUrl =
			myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
		return nodeUrl;
	}
	getMyNode() {
		const myNode =
			store.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			];

		return myNode;
	}

	clearFields() {}

	render() {
		return html`
			<div class="modal-overlay ${this.isOpen ? '' : 'hidden'}">
				<div class="modal-content">
					<div class="inner-content">
						<div style="height:15px"></div>
						<div style="display: flex;flex-direction: column;">
							<label
								for="tagline"
								id="taglineLabel"
								style="color: var(--black);"
							>
								${get('profile.profile4')}
							</label>
							<textarea
								class="input"
								@change=${(e) => {
									this.tagline = e.target.value;
								}}
								.value=${this.tagline}
								?disabled=${this.isLoading}
								id="tagline"
								placeholder="${translate('profile.profile4')}"
								rows="3"
							></textarea>
						</div>
						<div style="height:15px"></div>
						<div style="display: flex;flex-direction: column;">
							<label
								for="bio"
								id="bioLabel"
								style="color: var(--black);"
							>
								${get('profile.profile5')}
							</label>
							<textarea
								class="input"
								@change=${(e) => {
									this.bio = e.target.value;
								}}
								.value=${this.bio}
								?disabled=${this.isLoading}
								id="bio"
								placeholder="${translate('profile.profile5')}"
								rows="3"
							></textarea>
						</div>
						<div style="height:15px"></div>
						<p>${get('profile.profile6')}</p>
						<div style="display: flex;flex-direction: column;">
							${Object.keys(this.wallets).map((key) => {
								return html`
									<input
										id=${key}
										placeholder=${key}
										class="input"
										.value=${this.wallets[key]}
										@change=${(e) => {
											this.wallets = {
												...this.wallets,
												[key]: e.target.value,
											};
										}}
									/>
								`;
							})}
						</div>
					</div>
					<div
						style="display:flex;justify-content:space-between;align-items:center;margin-top:20px"
					>
						<button
							class="modal-button-red"
							?disabled="${this.isLoading}"
							@click="${() => {
								this.setIsOpen(false);
								this.clearFields();
								this.onClose();
							}}"
						>
							${translate('general.close')}
						</button>

						<button
							?disabled="${this.isLoading}"
							class="modal-button"
							@click=${() => {
								this.addFriend();
							}}
						>
							${translate('profile.profile3')}
						</button>
					</div>
				</div>
			</div>
		`;
	}
}

customElements.define('profile-modal-update', ProfileModalUpdate);
