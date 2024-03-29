import {css, html, LitElement} from 'lit';
import {translate,} from '../../../translate'
import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-checkbox';
import {connect} from 'pwa-helpers';
import {store} from '../../store';
import '@polymer/paper-spinner/paper-spinner-lite.js'

class AddFriendsModal extends connect(store)(LitElement) {
	static get properties() {
		return {
			isOpen: { type: Boolean },
			setIsOpen: { attribute: false },
			isLoading: { type: Boolean },
			userSelected: { type: Object },
			alias: { type: String },
			willFollow: { type: Boolean },
			notes: { type: String },
			onSubmit: { attribute: false },
			editContent: { type: Object },
			onClose: { attribute: false },
			mySelectedFeeds: { type: Array },
			availableFeeedSchemas: {type: Array},
			isLoadingSchemas: {type: Boolean}
		};
	}

	constructor() {
		super();
		this.isOpen = false;
		this.isLoading = false;
		this.alias = '';
		this.willFollow = true;
		this.notes = '';
		this.nodeUrl = this.getNodeUrl();
		this.myNode = this.getMyNode();
		this.mySelectedFeeds = [];
		this.availableFeeedSchemas = [];
		this.isLoadingSchemas= false;
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
				box-sizing:border-box;
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
				flex-direction:column;
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

		return myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
	}
	getMyNode() {
		return store.getState().app.nodeConfig.knownNodes[
			window.parent.reduxStore.getState().app.nodeConfig.node
			];
	}

	clearFields() {
		this.alias = '';
		this.willFollow = true;
		this.notes = '';
	}

	addFriend() {
		this.onSubmit({
			name: this.userSelected.name,
			alias: this.alias,
			notes: this.notes,
			willFollow: this.willFollow,
			mySelectedFeeds: this.mySelectedFeeds

		});
		this.clearFields();
		this.onClose();
	}

	removeFriend() {
		this.onSubmit(
			{
				name: this.userSelected.name,
				alias: this.alias,
				notes: this.notes,
				willFollow: this.willFollow,
				mySelectedFeeds: this.mySelectedFeeds
			},
			true
		);
		this.clearFields();
		this.onClose();
	}

	async updated(changedProperties) {
		if (
			changedProperties &&
			changedProperties.has('editContent') &&
			this.editContent
		) {
			this.userSelected = {
				name: this.editContent.name ?? '',
			};
			this.notes = this.editContent.notes ?? '';
			this.willFollow = this.editContent.willFollow ?? true;
			this.alias = this.editContent.alias ?? '';
			this.requestUpdate()
		}
		if (
			changedProperties &&
			changedProperties.has('isOpen') && this.isOpen
		) {
			await this.getAvailableFeedSchemas()
		}

	}

	async getAvailableFeedSchemas() {
		try {
			this.isLoadingSchemas= true
			const url = `${this.nodeUrl}/arbitrary/resources/search?service=DOCUMENT&identifier=ui_schema_feed&prefix=true`;
			const res = await fetch(url);
			const data = await res.json();
			if (data.error === 401) {
				this.availableFeeedSchemas = [];
			} else {
				this.availableFeeedSchemas = data.filter(
					(item) => item.identifier === 'ui_schema_feed'
				);
			}
			this.userFoundModalOpen = true;
		} catch (error) {} finally {
			this.isLoadingSchemas= false
		}
	}

	render() {
		return html`
			<div class="modal-overlay ${this.isOpen ? '' : 'hidden'}">

				<div class="modal-content">
					<div class="inner-content">
					<div style="text-align:center">
						<h1>
							${this.editContent
								? translate('friends.friend10')
								: translate('friends.friend2')}
						</h1>
						<hr />
					</div>
					<p>${translate('friends.friend3')}</p>
					<div class="checkbox-row">
						<label
							for="willFollow"
							id="willFollowLabel"
							style="color: var(--black);"
						>
							${translate('friends.friend5')}
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
					<div style="height:15px"></div>
					<div style="display: flex;flex-direction: column;">
						<label
							for="name"
							id="nameLabel"
							style="color: var(--black);"
						>
							${translate('login.name')}
						</label>
						<input
							id="name"
							class="input"
							?disabled=${true}
							value=${this.userSelected
								? this.userSelected.name
								: ''}
						/>
					</div>
					<div style="height:15px"></div>
					<div style="display: flex;flex-direction: column;">
						<label
							for="alias"
							id="aliasLabel"
							style="color: var(--black);"
						>
							${translate('friends.friend6')}
						</label>
						<input
							id="alias"
							placeholder=${translate('friends.friend7')}
							class="input"
							.value=${this.alias}
							@change=${(e) => {
								this.alias = e.target.value
							}}
						/>
					</div>
					<div style="height:15px"></div>
					<div style="margin-bottom:0;">
						<textarea
							class="input"
							@change=${(e) => {
								this.notes = e.target.value
							}}
							.value=${this.notes}
							?disabled=${this.isLoading}
							id="messageBoxAddFriend"
							placeholder="${translate('friends.friend4')}"
							rows="3"
						></textarea>
					</div>
					<div style="height:15px"></div>
					<h2>${translate('friends.friend15')}</h2>
					<div style="margin-bottom:0;">
						<p>${translate('friends.friend16')}</p>
					</div>
					<div>
					${this.isLoadingSchemas ? html`
                    <div style="width:100%;display: flex; justify-content:center">
                    <paper-spinner-lite active></paper-spinner-lite>
                    </div>
                    ` : ''}
						${this.availableFeeedSchemas.map((schema) => {
							const isAlreadySelected = this.mySelectedFeeds.find(
								(item) => item.name === schema.name
							);
							let avatarImgApp;
							const avatarUrl2 = `${this.nodeUrl}/arbitrary/THUMBNAIL/${schema.name}/qortal_avatar?async=true&apiKey=${this.myNode.apiKey}`;
							avatarImgApp = html`<img
								src="${avatarUrl2}"
								style="max-width:100%; max-height:100%;"
								onerror="this.onerror=null; this.src='/img/incognito.png';"
							/>`;
							return html`
								<div
									class="app-name"
									style="background:${isAlreadySelected ? 'lightblue': ''}"
									@click=${() => {
										const copymySelectedFeeds = [
											...this.mySelectedFeeds,
										];
										const findIndex =
											copymySelectedFeeds.findIndex(
												(item) =>
													item.name === schema.name
											);
										if (findIndex === -1) {
											if(this.mySelectedFeeds.length > 4) return
											copymySelectedFeeds.push({
												name: schema.name,
												identifier: schema.identifier,
												service: schema.service,
											});
											this.mySelectedFeeds =
												copymySelectedFeeds;
										} else {
											this.mySelectedFeeds =
												copymySelectedFeeds.filter(
													(item) =>
														item.name !==
														schema.name
												);
										}
									}}
								>
									<div class="avatar">${avatarImgApp}</div>
									<span
										style="color:${isAlreadySelected ? 'var(--white)': 'var(--black)'};font-size:16px"
										>${schema.name}</span
									>
								</div>
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
						${this.editContent
							? html`
									<button
										?disabled="${this.isLoading}"
										class="modal-button-red"
										@click=${() => {
											this.removeFriend();
										}}
									>
										${translate('friends.friend14')}
									</button>
							  `
							: ''}

						<button
							?disabled="${this.isLoading}"
							class="modal-button"
							@click=${() => {
								this.addFriend();
							}}
						>
							${this.editContent
								? translate('friends.friend10')
								: translate('friends.friend2')}
						</button>
					</div>
				</div>
			</div>
		`;
	}
}

customElements.define('add-friends-modal', AddFriendsModal);
