import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../epml.js'

import './LevelFounder.js'
import './NameMenu.js'

import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-icon'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ChatScroller extends LitElement {
    static get properties() {
        return {
            getNewMessage: { attribute: false },
            getOldMessage: { attribute: false },
            emojiPicker: { attribute: false },
            escapeHTML: { attribute: false },
            initialMessages: { type: Array },
            messages: { type: Array },
            hideMessages: { type: Array }
        }
    }

    static get styles() {
        return css`
        html {
            --scrollbarBG: #a1a1a1;
            --thumbBG: #6a6c75;
        }

        *::-webkit-scrollbar {
            width: 11px;
        }

        * {
            scrollbar-width: thin;
            scrollbar-color: var(--thumbBG) var(--scrollbarBG);
            --mdc-theme-primary: rgb(3, 169, 244);
            --mdc-theme-secondary: var(--mdc-theme-primary);
        }

        *::-webkit-scrollbar-track {
            background: var(--scrollbarBG);
        }

        *::-webkit-scrollbar-thumb {
            background-color: var(--thumbBG);
            border-radius: 6px;
            border: 3px solid var(--scrollbarBG);
        }

        a {
            color: var(--black);
            text-decoration: none;
        }

        ul {
            list-style: none;
            margin: 0;
            padding: 20px;
        }

        .chat-list {
            overflow-y: auto;
            height: 92vh;
            box-sizing: border-box;
        }

        .message-data {
            width: 92%;
            margin-bottom: 15px;
            margin-left: 50px;
        }

        .message-data:hover .hide {
            color: #03a9f4;
            display: inline;
        }

        .message-data-name {
            cursor: pointer;
        }

        .message-data-level {
            color: #03a9f4;
            font-size: 13px;
            padding-left: 8px;
            padding-bottom: 4px;
        }

        .message-data-time {
            color: #a8aab1;
            font-size: 13px;
            padding-left: 6px;
            padding-bottom: 4px;
        }

        .message-data-react {
            margin-left: 50px;
        }

        .message-data-react-item {
            padding-left: 6px;
        }

        .message {
            color: black;
            padding: 12px 10px;
            line-height: 19px;
            white-space: pre-line;
            word-wrap: break-word;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            user-select: text;
            font-size: 16px;
            border-radius: 7px;
            margin-bottom: 20px;
            width: 90%;
            position: relative;
        }

        .message:after {
            bottom: 100%;
            left: 93%;
            border: solid transparent;
            content: " ";
            height: 0;
            width: 0;
            position: absolute;
            white-space: pre-line;
            word-wrap: break-word;
            pointer-events: none;
            border-bottom-color: #ddd;
            border-width: 10px;
            margin-left: -10px;
        }

        .emoji {
            width: 1.7em;
            height: 1.5em;
            margin-bottom: -2px;
            vertical-align: bottom;
            object-fit: contain;
        }

        .my-message {
            background: #d1d1d1;
            border: 2px solid #cecece;
        }

        .my-message:after {
            border-bottom-color: #d1d1d1;
            left: 7%;
        }

        .other-message {
            background: #f1f1f1;
            border: 2px solid #dedede;
        }

        .other-message:after {
            border-bottom-color: #f1f1f1;
            left: 7%;
        }

        .hide {
            display: none;
        }

        .align-left {
            text-align: left;
        }

        .align-right {
            text-align: right;
        }

        .float-left {
            float: left;
        }

        .float-right {
            float: right;
        }

        .padright5 {
            padding-right: 5px;
        }

        .clearfix:after {
            visibility: hidden;
            display: block;
            font-size: 0;
            content: " ";
            clear: both;
            height: 0;
        }

        img {
            border-radius: 25%;
        }

        .iconsRight {
            color: #a8aab1;
            --mdc-icon-size: 18px;
        }
        `
    }

    constructor() {
        super()
        this.messages = []
        this.hideMessages = []
        this._upObserverhandler = this._upObserverhandler.bind(this)
        this.isLoading = false
        this.myAddress = window.parent.reduxStore.getState().app.selectedAddress.address
    }


    render() {
        return html`
            <ul id="viewElement" class="chat-list clearfix">
                <div id="upObserver"></div>
                <div id="downObserver"></div>
            </ul>
        `
    }

    firstUpdated() {
        this.getHideMessages()
        this.viewElement = this.shadowRoot.getElementById('viewElement')
        this.upObserverElement = this.shadowRoot.getElementById('upObserver')
        this.downObserverElement = this.shadowRoot.getElementById('downObserver')
        this.renderChatMessages(this.initialMessages)

        // Intialize Observers
        this.upElementObserver()

        this.viewElement.scrollTop = this.viewElement.scrollHeight + 50
    }

    async getHideMessages() {
        const hideMessages = await parentEpml.request('apiCall', {
            url: `/lists/blockedAddresses?apiKey=${this.getApiKey()}`
        })
        this.hideMessages = hideMessages
    }

    chatMessageTemplate(messageObj) {
        const hidmes = this.hideMessages

        let avatarImg = ''
        let nameMenu = ''
        let levelFounder = ''
        let hideit = hidmes.includes(messageObj.sender)

        if (messageObj.senderName) {
            const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
            const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
            const avatarUrl = `${nodeUrl}/arbitrary/THUMBNAIL/${messageObj.senderName}/qortal_avatar?async=true&apiKey=${myNode.apiKey}`
            avatarImg = `<img src="${avatarUrl}" style="max-width:100%; max-height:100%;" onerror="this.onerror=null; this.src='/img/incognito.png';" />`
        }

        if (messageObj.sender === this.myAddress) {
            nameMenu = `<mwc-icon class="iconsRight">more_horiz</mwc-icon>`
        } else {
            nameMenu = `<name-menu toblockaddress="${messageObj.sender}" nametodialog="${messageObj.senderName ? messageObj.senderName : messageObj.sender}" messagesignatur="${messageObj.signature}"></name-menu>`
        }

        levelFounder = `<level-founder checkleveladdress="${messageObj.sender}"></level-founder>`

        if ( hideit === true ) {
            return `
                <li class="clearfix"></li>
            `
        } else {
            return `
                <li class="clearfix">
                    <div class="message-data ${messageObj.sender === this.myAddress ? "" : ""}">
                        <span class="message-data-name" style="${messageObj.sender === this.myAddress ? "color: #03a9f4;" : "color: var(--black);"}">${messageObj.senderName ? messageObj.senderName : messageObj.sender}</span>
                        <span class="message-data-level">${levelFounder}</span>
                        <span class="message-data-time"><message-time timestamp=${messageObj.timestamp}></message-time></span>
                        <span class="hide float-right">${nameMenu}</span>
                    </div>
                    <div class="message-data-avatar" style="width: 42px; height: 42px; ${messageObj.sender === this.myAddress ? "float:left;" : "float:left;"} margin: 3px;">${avatarImg}</div>
                    <div id="messageContent" class="message ${messageObj.sender === this.myAddress ? "my-message float-left" : "other-message float-left"}">${this.emojiPicker.parse(this.escapeHTML(messageObj.decodedMessage))}</div>
                    <div class="message-data-react"></div>
                </li>
            `
        }
    }

    renderChatMessages(messages) {
        messages.forEach(message => {
            const li = document.createElement('li')
            li.innerHTML = this.chatMessageTemplate(message)
            li.id = message.signature;
            this.downObserverElement.before(li)
        })
    }

    renderOldMessages(listOfOldMessages) {
        let { oldMessages, scrollElement } = listOfOldMessages
        let _oldMessages = oldMessages.reverse()
        _oldMessages.forEach(oldMessage => {
            const li = document.createElement('li')
            li.innerHTML = this.chatMessageTemplate(oldMessage)
            li.id = oldMessage.signature
            this.upObserverElement.after(li)
            scrollElement.scrollIntoView({ behavior: 'auto', block: 'center' })
        })
    }

    _getOldMessage(_scrollElement) {
        let listOfOldMessages = this.getOldMessage(_scrollElement)
        if (listOfOldMessages) {
            this.renderOldMessages(listOfOldMessages)
        }
    }

    _upObserverhandler(entries) {
        if (entries[0].isIntersecting) {
            let _scrollElement = entries[0].target.nextElementSibling
            this._getOldMessage(_scrollElement)
        }
    }

    upElementObserver() {
        const options = {
            root: this.viewElement,
            rootMargin: '0px',
            threshold: 1
        }
        const observer = new IntersectionObserver(this._upObserverhandler, options)
        observer.observe(this.upObserverElement)
    }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        let apiKey = myNode.apiKey
        return apiKey
    }
}

window.customElements.define('chat-scroller', ChatScroller)
