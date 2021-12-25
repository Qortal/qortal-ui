import { LitElement, html, css } from 'lit-element'

class ChatScroller extends LitElement {
    static get properties() {
        return {
            getNewMessage: { attribute: false },
            getOldMessage: { attribute: false },
            emojiPicker: { attribute: false },
            escapeHTML: { attribute: false },
            initialMessages: { type: Array }, // First set of messages to load.. 15 messages max ( props )
            messages: { type: Array }
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
        }

        *::-webkit-scrollbar-track {
            background: var(--scrollbarBG);
        }

        *::-webkit-scrollbar-thumb {
            background-color: var(--thumbBG);
            border-radius: 6px;
            border: 3px solid var(--scrollbarBG);
        }

        ul {
            list-style: none;
            margin: 0;
            padding: 20px;
        }
        .chat-list {
            overflow-y: auto;
            height: 91vh;
            box-sizing: border-box;
        }

        .message-data {
            margin-bottom: 15px;
        }

        .message-data-time {
            color: #a8aab1;
            font-size: 13px;
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
            background: #ddd;
            border: 2px #ccc solid;
        }

        .other-message {
            background: #f1f1f1;
            border: 2px solid #dedede;
        }

        .other-message:after {
            border-bottom-color: #f1f1f1;
            left: 7%;
        }

        .align-left {
            text-align: left;
        }

        .align-right {
            text-align: right;
        }

        .float-right {
            float: right;
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

        this.messages = []
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

    chatMessageTemplate(messageObj) {

        return `
            <li class="clearfix">
                <div class="message-data ${messageObj.sender === this.myAddress ? "align-right" : ""}">
                    <span class="message-data-name">${messageObj.senderName ? messageObj.senderName : messageObj.sender}</span>
                    <span class="message-data-time"><message-time timestamp=${messageObj.timestamp}></message-time></span>
                </div>
                <div id="messageContent" class="message ${messageObj.sender === this.myAddress ? "my-message float-right" : "other-message"}">${this.emojiPicker.parse(this.escapeHTML(messageObj.decodedMessage))}</div>
            </li>
        `
    }

    renderChatMessages(messages) {

        messages.forEach(message => {
            const li = document.createElement('li');
            li.innerHTML = this.chatMessageTemplate(message);
            li.id = message.signature;
            this.downObserverElement.before(li);
        });
    }

    renderOldMessages(listOfOldMessages) {

        let { oldMessages, scrollElement } = listOfOldMessages;

        let _oldMessages = oldMessages.reverse();
        _oldMessages.forEach(oldMessage => {
            const li = document.createElement('li');
            li.innerHTML = this.chatMessageTemplate(oldMessage);
            li.id = oldMessage.signature;
            this.upObserverElement.after(li);
            scrollElement.scrollIntoView({ behavior: 'auto', block: 'center' });
        });
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
        };

        const observer = new IntersectionObserver(this._upObserverhandler, options)
        observer.observe(this.upObserverElement)
    }

    firstUpdated() {

        this.viewElement = this.shadowRoot.getElementById('viewElement');
        this.upObserverElement = this.shadowRoot.getElementById('upObserver');
        this.downObserverElement = this.shadowRoot.getElementById('downObserver');

        this.renderChatMessages(this.initialMessages)

        // Intialize Observers
        this.upElementObserver()

        this.viewElement.scrollTop = this.viewElement.scrollHeight + 50;
    }

}

window.customElements.define('chat-scroller', ChatScroller)
