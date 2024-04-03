import {css, html, LitElement} from 'lit'
import {Epml} from '../../../epml.js'
import localForage from "localforage"
import {translate} from '../../../../core/translate'

import '@material/mwc-icon'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

const chatLastSeen = localForage.createInstance({
    name: "chat-last-seen",
})

class ChatHead extends LitElement {
    static get properties() {
        return {
            theme: { type: String, reflect: true },
            selectedAddress: { type: Object },
            config: { type: Object },
            chatInfo: { type: Object },
            iconName: { type: String },
            activeChatHeadUrl: { type: String },
            isImageLoaded: { type: Boolean },
            setActiveChatHeadUrl: {attribute: false},
            lastReadMessageTimestamp: {type: Number}
        }
    }

    static get styles() {
        return css`
            li {
                width: 100%;
                padding: 10px 5px 10px 5px;
                cursor: pointer;
                box-sizing: border-box;
                display: flex;
                align-items: flex-start;
            }

            li:hover {
                background-color: var(--menuhover);
            }

            .active {
                background: var(--menuactive);
                border-left: 4px solid #3498db;
            }

            .img-icon {
                float: left;
                font-size:40px;
                color: var(--chat-group);
            }

            .about {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                margin: 0;
            }
            .inner-container {
                display: flex;
                width: calc(100% - 45px);
                flex-direction: column;
                justify-content: center;
            }

            .status {
                color: #92959e;
            }

            .clearfix:after {
                visibility: hidden;
                display: block;
                font-size: 0;
                content: " ";
                clear: both;
                height: 0;
            }

            .name {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
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
        this.lastReadMessageTimestamp =  0
        this.loggedInAddress = window.parent.reduxStore.getState().app.selectedAddress.address
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

     createImage(imageUrl)  {
        const imageHTMLRes = new Image()
        imageHTMLRes.src = imageUrl
        imageHTMLRes.style= "width:40px; height:40px; float: left; border-radius:50%"
        imageHTMLRes.onclick= () => {
            this.openDialogImage = true;
        }
        imageHTMLRes.onload = () => {
            this.isImageLoaded = true;
        }
        imageHTMLRes.onerror = () => {
            if (this.imageFetches < 4) {
                setTimeout(() => {
                    this.imageFetches = this.imageFetches + 1
                    imageHTMLRes.src = imageUrl
                }, 750)
            } else {
                this.isImageLoaded = false
            }
        };
        return imageHTMLRes
      }

    render() {
        let avatarImg = ''
        let isUnread = false

        if(this.chatInfo.name){
            const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
            const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
            const avatarUrl = `${nodeUrl}/arbitrary/THUMBNAIL/${this.chatInfo.name}/qortal_avatar?async=true&apiKey=${myNode.apiKey}`
            avatarImg= this.createImage(avatarUrl)
        }

        if(this.lastReadMessageTimestamp && this.chatInfo.timestamp){
            if(this.lastReadMessageTimestamp < this.chatInfo.timestamp){
                isUnread = true
            }
        }

        if(this.activeChatHeadUrl === this.chatInfo.url){
            isUnread = false
        }

        if(this.chatInfo.sender === this.loggedInAddress){
            isUnread = false
        }
        return html`
            <li @click=${() => this.getUrl(this.chatInfo.url)} class="clearfix ${this.activeChatHeadUrl === this.chatInfo.url ? 'active' : ''}">
				${this.isImageLoaded ? html`${avatarImg}` : html`` }
                ${!this.isImageLoaded && !this.chatInfo.name && !this.chatInfo.groupName ? html`<mwc-icon class="img-icon">account_circle</mwc-icon>` : html`` }
                ${!this.isImageLoaded && this.chatInfo.name ? html`<div  style="width:40px; height:40px; flex-shrink: 0; border-radius:50%; background: ${this.activeChatHeadUrl === this.chatInfo.url ? 'var(--chatHeadBgActive)' : 'var(--chatHeadBg)' }; color: ${this.activeChatHeadUrl === this.chatInfo.url ? 'var(--chatHeadTextActive)' : 'var(--chatHeadText)' }; font-weight:bold; display: flex; justify-content: center; align-items: center; text-transform: capitalize">${this.chatInfo.name.charAt(0)}</div>`: ''}
                ${!this.isImageLoaded && this.chatInfo.groupName ? html`<div  style="width:40px; height:40px; flex-shrink: 0; border-radius:50%; background: ${this.activeChatHeadUrl === this.chatInfo.url ? 'var(--chatHeadBgActive)' : 'var(--chatHeadBg)' }; color: ${this.activeChatHeadUrl === this.chatInfo.url ? 'var(--chatHeadTextActive)' : 'var(--chatHeadText)' }; font-weight:bold; display: flex; justify-content: center; align-items: center; text-transform: capitalize">${this.chatInfo.groupName.charAt(0)}</div>`: ''}
				<div class="inner-container">
				   <div class="about">
					   <div class="name"><span style="font-weight: bold;float:left; padding-left: 8px; color: var(--chat-group);font-size:14px;word-break:${this.chatInfo.groupName ? this.chatInfo.groupName : this.chatInfo.name !== undefined ? 'break-word': 'break-all'}">${this.chatInfo.groupName ? this.chatInfo.groupName : this.chatInfo.name !== undefined ? this.chatInfo.name : this.chatInfo.address.substr(0, 15)} </span> <mwc-icon style="font-size:18px; color: var(--chat-group);">${this.chatInfo.groupId !== undefined ? 'lock_open' : 'lock'}</mwc-icon> </div>
				   </div>
				   <div class="about" style="margin-top:7px">
					   <div class="name"><span style="float:left; padding-left: 8px; color: var(--chat-group);font-size:12px">${this.chatInfo.groupId !== undefined ? 'id: ' + this.chatInfo.groupId : ''}</span>
						   <div style="color: var(--black); display: flex;font-size: 12px; align-items:center">
							   <div style="width: 8px; height: 8px;border-radius: 50%;background: ${isUnread ? 'var(--error)' : 'none'} ; margin-right:5px;"></div>
							   <message-time style="display: ${(this.chatInfo.timestamp && this.chatInfo.timestamp > 100000) ? 'block' : 'none'}" timestamp=${this.chatInfo.timestamp}></message-time>
							   <span style="font-size:12px;color:var(--black);display: ${(!this.chatInfo.timestamp || this.chatInfo.timestamp > 100000) ? 'none' : 'block'}">${translate('chatpage.cchange90')}</span>
						   </div>
					   </div>
				   </div>
			   </div>
			</li>
        `
    }

   async firstUpdated() {
        this.changeTheme()

        window.addEventListener('storage', () => {
            const checkTheme = localStorage.getItem('qortalTheme')

            if (checkTheme === 'dark') {
                this.theme = 'dark'
            } else {
                this.theme = 'light'
            }
            document.querySelector('html').setAttribute('theme', this.theme)
        })

        let configLoaded = false
        this.lastReadMessageTimestamp =  await chatLastSeen.getItem(this.chatInfo.url) || 0
        parentEpml.ready().then(() => {
            parentEpml.subscribe('selected_address', async selectedAddress => {
                this.selectedAddress = {}
                selectedAddress = JSON.parse(selectedAddress)
                if (!selectedAddress || Object.entries(selectedAddress).length === 0) return
                this.selectedAddress = selectedAddress
            })
            parentEpml.subscribe('chat_last_seen', async chatList => {
                const parsedChatList = JSON.parse(chatList)
                const findChatSeen = parsedChatList.find(chat=> chat.key === this.chatInfo.url)

                if(findChatSeen && this.lastReadMessageTimestamp !== findChatSeen.timestamp){
                    this.lastReadMessageTimestamp = findChatSeen.timestamp
                    this.requestUpdate()
                }
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

    changeTheme() {
        const checkTheme = localStorage.getItem('qortalTheme')
        if (checkTheme === 'dark') {
            this.theme = 'dark'
        } else {
            this.theme = 'light'
        }
        document.querySelector('html').setAttribute('theme', this.theme)
    }

    shouldUpdate(changedProperties) {
        if(changedProperties.has('activeChatHeadUrl')){
            return true
        }
        if(changedProperties.has('lastReadMessageTimestamp')){
            return true
        }
        if(changedProperties.has('chatInfo')){

            const prevChatInfo = changedProperties.get('chatInfo')

            if(prevChatInfo.address !== this.chatInfo.address){

                this.isImageLoaded = false
                this.requestUpdate()
            }
            return true
        }

        return false
      }

    getUrl(chatUrl) {
        this.setActiveChatHeadUrl(chatUrl)
    }

    onPageNavigation(pageUrl) {
        parentEpml.request('setPageUrl', pageUrl)
    }
}

window.customElements.define('chat-head', ChatHead)