import { html, LitElement } from 'lit'
import { cropAddress } from '../../utils/functions'
import { userInfoStyles } from './plugins-css'
import '@polymer/paper-progress/paper-progress.js'
import '@vaadin/button'

// Multi language support
import { translate } from '../../../../core/translate'

export class UserInfo extends LitElement {
	static get properties() {
		return {
			setOpenUserInfo: { attribute: false },
			setOpenTipUser: { attribute: false },
			setOpenPrivateMessage: { attribute: false },
			userName: { type: String },
			selectedHead: { type: Object },
			isImageLoaded: { type: Boolean }
		}
	}

	static get styles() {
		return [userInfoStyles]
	}

	constructor() {
		super()
		this.isImageLoaded = false
		this.selectedHead = {}
		this.imageFetches = 0
	}

	render() {
		let avatarImg = ''

		if (this.selectedHead && this.selectedHead.name) {
			const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
			const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
			const avatarUrl = `${nodeUrl}/arbitrary/THUMBNAIL/${this.selectedHead.name}/qortal_avatar?async=true`
			avatarImg = this.createImage(avatarUrl)
		}

		return html`
			<div style="position: relative;">
				<vaadin-icon class="close-icon" icon="vaadin:close-big"slot="icon" @click=${() => {this.setOpenUserInfo(false);}}></vaadin-icon>
				${this.isImageLoaded ? html`<div class="avatar-container">${avatarImg}</div>` : html``}
				${!this.isImageLoaded && this.selectedHead && this.selectedHead.name ?
					html`
						<div class="avatar-container">
							<div class="user-info-no-avatar">
								${this.selectedHead.name.charAt(0)}
							</div>
						</div>
					`
					: ""
				}
				${!this.isImageLoaded && this.selectedHead && !this.selectedHead.name ?
					html`
						<div class="avatar-container">
							<img src="/img/incognito.png" alt="avatar" />
						</div>
					`
					: ""
				}
				<div class="user-info-header">
					${this.selectedHead && this.selectedHead.name ? this.selectedHead.name : this.selectedHead ? cropAddress(this.selectedHead.address) : null}
				</div>
				<div class="send-message-button" @click="${() => {this.setOpenPrivateMessage({name: this.userName, open: true}); this.setOpenUserInfo(false);}}">
					${translate("chatpage.cchange58")}
				</div>
				<div style="margin-top: 5px;" class="send-message-button" @click=${() => {this.setOpenTipUser(true); this.setOpenUserInfo(false);}}>
					${translate("chatpage.cchange59")}
				</div>
				${this.userName ?
					html`
						<div style="margin-top: 5px;text-transform: uppercase;" class="send-message-button" @click=${() => {
							setTimeout(() => {
								this.openProfile();
							}, 250);
							this.setOpenUserInfo(false);
						}}>
							${translate("profile.profile18")}
						</div>
					`
					: ''
				}
			</div>
		`
	}

	firstUpdated() {
		// ...
	}

	createImage(imageUrl) {
		const imageHTMLRes = new Image()

		imageHTMLRes.src = imageUrl
		imageHTMLRes.classList.add("user-info-avatar")

		imageHTMLRes.onload = () => {
			this.isImageLoaded = true
		}

		imageHTMLRes.onerror = () => {
			if (this.imageFetches < 4) {
				setTimeout(() => {
					this.imageFetches = this.imageFetches + 1
					imageHTMLRes.src = imageUrl
				}, 10000)
			} else {
				this.isImageLoaded = false
			}
		}

		return imageHTMLRes
	}

	openProfile() {
		try {
			const customEvent = new CustomEvent('open-visiting-profile', {
				detail: this.userName
			})

			window.parent.dispatchEvent(customEvent)
		} catch (error) { /* empty */ }
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

window.customElements.define('user-info', UserInfo)
