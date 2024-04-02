import {html, LitElement} from 'lit'
import {translate} from '../../../../../core/translate'
import {userInfoStyles} from './UserInfo-css.js'
import {cropAddress} from '../../../utils/cropAddress.js'

import '@polymer/paper-progress/paper-progress.js'
import '@vaadin/button'


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

    constructor() {
        super()
        this.isImageLoaded = false
        this.selectedHead = {}
        this.imageFetches = 0
    }

    static get styles() {
		return [userInfoStyles];
	}


    createImage(imageUrl)  {
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
                    imageHTMLRes.src = imageUrl;
                }, 10000)
            } else {
                this.isImageLoaded = false
            }
        }
        return imageHTMLRes
    }

    openProfile(){
        try {
            const customEvent = new CustomEvent('open-visiting-profile', {
                detail: this.userName
            });
            window.parent.dispatchEvent(customEvent);

        } catch (error) { /* empty */ }
    }


    render() {
        let avatarImg = ""
        if (this.selectedHead && this.selectedHead.name) {
            const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
            const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
            const avatarUrl = `${nodeUrl}/arbitrary/THUMBNAIL/${this.selectedHead.name}/qortal_avatar?async=true&apiKey=${myNode.apiKey}`
            avatarImg = this.createImage(avatarUrl)
        }
        return html`
            <div style="position: relative;">
            <vaadin-icon
                class="close-icon"
                icon="vaadin:close-big"
                slot="icon"
                @click=${() => {
                    this.setOpenUserInfo(false)
                }}
            >
            </vaadin-icon>
                ${this.isImageLoaded ? html`<div class="avatar-container">${avatarImg}</div>` : html``}
                ${!this.isImageLoaded && this.selectedHead && this.selectedHead.name ? html`
                    <div class="avatar-container">
                        <div class="user-info-no-avatar">
                            ${this.selectedHead.name.charAt(0)}
                        </div>
                    </div>
                ` : ""}
                ${!this.isImageLoaded && this.selectedHead && !this.selectedHead.name ? html`
                    <div class="avatar-container">
                        <img src="/img/incognito.png" alt="avatar" />
                    </div>`
                : ""}
                  <div class="user-info-header">
                    ${this.selectedHead && this.selectedHead.name ? this.selectedHead.name : this.selectedHead ? cropAddress(this.selectedHead.address) : null}
                </div>
                <div class="send-message-button" @click="${() => {
                    this.setOpenPrivateMessage({
                        name: this.userName,
                        open: true
                    })
                    this.setOpenUserInfo(false)
                }}">
                    ${translate("chatpage.cchange58")}
                </div>
                <div style="margin-top: 5px;" class="send-message-button" @click=${() => {
                    this.setOpenTipUser(true)
                    this.setOpenUserInfo(false)
                }}>
                    ${translate("chatpage.cchange59")}
                </div>
                ${this.userName ? html`
                <div style="margin-top: 5px;text-transform: uppercase;" class="send-message-button" @click=${() => {
                    setTimeout(() => {
                        this.openProfile()
                    }, 250);
                    this.setOpenUserInfo(false)


                }}>
                    ${translate("profile.profile18")}
                </div>
                ` : ''}

            </div>
        `
    }
}

customElements.define('user-info', UserInfo)
