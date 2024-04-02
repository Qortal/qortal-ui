import {css, html, LitElement} from 'lit'
import {Epml} from '../../../epml.js'

import '@material/mwc-icon'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ChatSelect extends LitElement {
    static get properties() {
        return {
            selectedAddress: { type: Object },
            config: { type: Object },
            chatInfo: { type: Object },
            iconName: { type: String },
            activeChatHeadUrl: { type: String },
            isImageLoaded: { type: Boolean },
            setActiveChatHeadUrl: {attribute: false}
        }
    }

    static get styles() {
        return css`
            ul {
                list-style-type: none;
                }
            li {
                padding: 10px 2px 20px 5px;
                cursor: pointer;
                width: 100%;
                display: flex;
                box-sizing: border-box;
            }

            li:hover {
                background-color: var(--menuhover);
            }

            .active {
                background: var(--menuactive);
                border-left: 4px solid #3498db;
            }

            .img-icon {
                font-size:40px;
                color: var(--chat-group);
            }

            .about {
                margin-top: 8px;
            }

            .about {
                padding-left: 8px;
            }

            .status {
                color: #92959e;
            }

            .name {
                user-select: none;
            }

            .clearfix:after {
                visibility: hidden;
                display: block;
                font-size: 0;
                content: " ";
                clear: both;
                height: 0;
            }
        `
    }

    constructor() {
        super()
        this.selectedAddress = {}
        this.config = {
            user: {
                node: {

                }
            }
        }
        this.chatInfo = {}
        this.iconName = ''
        this.activeChatHeadUrl = ''
        this.isImageLoaded = false
        this.imageFetches = 0
    }

    createImage(imageUrl)  {
        const imageHTMLRes = new Image();
        imageHTMLRes.src = imageUrl;
        imageHTMLRes.style= "width:40px; height:40px; float: left; border-radius:50%";
        imageHTMLRes.onclick= () => {
            this.openDialogImage = true;
        }
        imageHTMLRes.onload = () => {
            this.isImageLoaded = true;
        }
        imageHTMLRes.onerror = () => {
            if (this.imageFetches < 4) {
                setTimeout(() => {
                    this.imageFetches = this.imageFetches + 1;
                    imageHTMLRes.src = imageUrl;
                }, 500);
            } else {


                this.isImageLoaded = false
            }
        };
        return imageHTMLRes;
      }

    render() {
        let avatarImg = '';
        let backupAvatarImg = ''
        if(this.chatInfo.name){
            const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
            const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
            const avatarUrl = `${nodeUrl}/arbitrary/THUMBNAIL/${this.chatInfo.name}/qortal_avatar?async=true&apiKey=${myNode.apiKey}`;
            avatarImg= this.createImage(avatarUrl)

        }

        return html`
            <li
            @click=${() => this.getUrl(this.chatInfo.url)}
            class="clearfix ${this.activeChatHeadUrl === this.chatInfo.url ? 'active' : ''}">
                ${this.isImageLoaded ? html`${avatarImg}` : html``}
                ${!this.isImageLoaded && !this.chatInfo.name && !this.chatInfo.groupName ? html`<mwc-icon class="img-icon">account_circle</mwc-icon>` :
                html``
                }
                ${!this.isImageLoaded && this.chatInfo.name ?
                    html`
                    <div
                    style="width:40px; height:40px; float: left; border-radius:50%; background: ${this.activeChatHeadUrl === this.chatInfo.url ?
                        'var(--chatHeadBgActive)' :
                        'var(--chatHeadBg)' };
                        color: ${this.activeChatHeadUrl === this.chatInfo.url ?
                        'var(--chatHeadTextActive)' :
                        'var(--chatHeadText)'};
                        font-weight:bold;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        text-transform: capitalize">
                        ${this.chatInfo.name.charAt(0)}
                    </div>`:
                ''}
                ${!this.isImageLoaded && this.chatInfo.groupName ?
                    html`
                    <div
                    style="width:40px;
                    height:40px;
                    float: left;
                    border-radius:50%;
                    background: ${this.activeChatHeadUrl === this.chatInfo.url ?
                    'var(--chatHeadBgActive)' :
                    'var(--chatHeadBg)' };
                    color: ${this.activeChatHeadUrl === this.chatInfo.url ?
                    'var(--chatHeadTextActive)' :
                    'var(--chatHeadText)' };
                    font-weight:bold;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-transform: capitalize">
                        ${this.chatInfo.groupName.charAt(0)}
                    </div>`:
                ''}
                <div class="about">
                    <div class="name">
                        <span style="float:left; padding-left: 8px; color: var(--chat-group);">
                            ${this.chatInfo.groupName ?
                            this.chatInfo.groupName :
                            this.chatInfo.name !== undefined ? this.chatInfo.name :
                            this.chatInfo.address.substr(0, 15)}
                        </span>
                    </div>
                </div>
            </li>
        `
    }

    firstUpdated() {
        let configLoaded = false
        parentEpml.ready().then(() => {
            parentEpml.subscribe('selected_address', async selectedAddress => {
                this.selectedAddress = {}
                selectedAddress = JSON.parse(selectedAddress)
                if (!selectedAddress || Object.entries(selectedAddress).length === 0) return
                this.selectedAddress = selectedAddress
            })
            parentEpml.subscribe('config', c => {
                if (!configLoaded) {
                    configLoaded = true
                }
                this.config = JSON.parse(c)
            })
        })
        parentEpml.imReady()


    }

    shouldUpdate(changedProperties) {
        if(changedProperties.has('activeChatHeadUrl')){
            return true
        }
        return !!changedProperties.has('chatInfo');


      }

    getUrl(chatUrl) {
        this.setActiveChatHeadUrl(chatUrl)
    }

    onPageNavigation(pageUrl) {
        parentEpml.request('setPageUrl', pageUrl)
    }
}

window.customElements.define('chat-select', ChatSelect)
