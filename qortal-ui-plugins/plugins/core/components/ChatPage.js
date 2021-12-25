import { LitElement, html, css } from 'lit-element'
import { Epml } from '../../../epml.js'

import { escape, unescape } from 'html-escaper';
import { inputKeyCodes } from '../../utils/keyCodes.js';

import './ChatScroller.js'
import './TimeAgo.js'

import { EmojiPicker } from 'emoji-picker-js';
import '@polymer/paper-spinner/paper-spinner-lite.js'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ChatPage extends LitElement {
    static get properties() {
        return {
            selectedAddress: { type: Object },
            config: { type: Object },
            messages: { type: Array },
            _messages: { type: Array },
            newMessages: { type: Array },
            chatId: { type: String },
            myAddress: { type: String },
            isReceipient: { type: Boolean },
            isLoading: { type: Boolean },
            _publicKey: { type: Object },
            balance: { type: Number },
            socketTimeout: { type: Number },
            messageSignature: { type: String },
            _initialMessages: { type: Array },
            isUserDown: { type: Boolean },
            isPasteMenuOpen: { type: Boolean },
            showNewMesssageBar: { attribute: false },
            hideNewMesssageBar: { attribute: false }
        }
    }

    static get styles() {
        return css`
        html {
            scroll-behavior: smooth;
        }
        .chat-text-area {
            display: flex;
            justify-content: center;
            overflow: hidden;
        }
        .chat-text-area .typing-area {
            display: flex;
            flex-direction: row;
            position: absolute;
            bottom: 0;
            width: 98%;
            box-sizing: border-box;
            padding: 5px;
            margin-bottom: 8px;
            border: 1px solid rgba(0, 0, 0, 0.3);
            border-radius: 10px;
        }
        .chat-text-area .typing-area textarea {
            display: none;
        }
        .chat-text-area .typing-area .chat-editor {
            border-color: transparent;
            flex: 1;
            max-height: 40px;
            height: 40px;
            margin: 0;
            padding: 0;
            border: none;
        }
        .chat-text-area .typing-area .emoji-button {
            width: 45px;
            height: 40px;
            padding: 5px;
            border: none;
            outline: none;
            background: transparent;
            cursor: pointer;
            max-height: 40px;
        }
        `
    }

    updated(changedProps) {
        // changedProps.forEach((OldProp, name) => {
        //     if (name === 'messages') {
        //         this.scrollDownPage()
        //     }

        //     // if (name === 'newMessages') {
        //     //     this.updateChatHistory(this.newMessages)
        //     // }
        // });
    }

    constructor() {
        super()
        this.getOldMessage = this.getOldMessage.bind(this)
        this._sendMessage = this._sendMessage.bind(this)
        this._downObserverhandler = this._downObserverhandler.bind(this)

        this.selectedAddress = {}
        this.chatId = ''
        this.myAddress = ''
        this.messages = []
        this._messages = []
        this.newMessages = []
        this._publicKey = { key: '', hasPubKey: false }
        this.messageSignature = ''
        this._initialMessages = []
        this.balance = 1
        this.isReceipient = false
        this.isLoadingMessages = true
        this.isLoading = false
        this.isUserDown = false
        this.isPasteMenuOpen = false
    }

    render() {

        // TODO: Build a nice preloader for loading messages...
        return html`
            ${this.isLoadingMessages ? html`<h1>Loading Messages...</h1>` : this.renderChatScroller(this._initialMessages)}

            <div class="chat-text-area">
                <div class="typing-area">
                    <textarea tabindex='1' ?autofocus=${true} ?disabled=${this.isLoading || this.isLoadingMessages} id="messageBox" rows="1"></textarea>

                    <iframe class="chat-editor" id="_chatEditorDOM" tabindex="-1"></iframe>
                    <button class="emoji-button" ?disabled=${this.isLoading || this.isLoadingMessages}>
                        ${this.isLoading === false ? html`<img class="emoji" draggable="false" alt="😀" src="/emoji/svg/1f600.svg">` : html`<paper-spinner-lite active></paper-spinner-lite>`}
                    </button>
                </div>
            </div>
        `
    }

    renderChatScroller(initialMessages) {

        return html`<chat-scroller .initialMessages=${initialMessages} .emojiPicker=${this.emojiPicker} .escapeHTML=${escape} .getOldMessage=${this.getOldMessage} > </chat-scroller>`
    }

    getOldMessage(scrollElement) {

        if (this._messages.length <= 15 && this._messages.length >= 1) { // 15 is the default number of messages...

            let __msg = [...this._messages]
            this._messages = []

            return { oldMessages: __msg, scrollElement: scrollElement }
        } else if (this._messages.length > 15) {

            return { oldMessages: this._messages.splice(this._messages.length - 15), scrollElement: scrollElement }
        } else {

            return false
        }
    }

    processMessages(messages, isInitial) {

        if (isInitial) {

            this.messages = messages.map((eachMessage) => {

                if (eachMessage.isText === true) {
                    this.messageSignature = eachMessage.signature
                    let _eachMessage = this.decodeMessage(eachMessage)
                    return _eachMessage
                }
            })

            this._messages = [...this.messages]

            const adjustMessages = () => {

                let __msg = [...this._messages]
                this._messages = []
                this._initialMessages = __msg
            }

            // TODO: Determine number of initial messages by screen height...
            this._messages.length <= 15 ? adjustMessages() : this._initialMessages = this._messages.splice(this._messages.length - 15);

            this.isLoadingMessages = false
            setTimeout(() => this.downElementObserver(), 500)
        } else {

            let _newMessages = messages.map((eachMessage) => {

                if (eachMessage.isText === true) {
                    let _eachMessage = this.decodeMessage(eachMessage)

                    if (this.messageSignature !== eachMessage.signature) {

                        this.messageSignature = eachMessage.signature

                        // What are we waiting for, send in the message immediately...
                        this.renderNewMessage(_eachMessage)
                    }

                    return _eachMessage
                }
            })

            this.newMessages = this.newMessages.concat(_newMessages)

        }


    }

    /**
    * New Message Template implementation, takes in a message object.
    * @param { Object } messageObj
    * @property id or index
    * @property sender and other info..
    */
    chatMessageTemplate(messageObj) {

        return `
            <li class="clearfix">
                <div class="message-data ${messageObj.sender === this.selectedAddress.address ? "align-right" : ""}">
                    <span class="message-data-name">${messageObj.senderName ? messageObj.senderName : messageObj.sender}</span>
                    <span class="message-data-time"><message-time timestamp=${messageObj.timestamp}></message-time></span>
                </div>
                <div class="message ${messageObj.sender === this.selectedAddress.address ? "my-message float-right" : "other-message"}">${this.emojiPicker.parse(escape(messageObj.decodedMessage))}</div>
            </li>
        `
    }

    renderNewMessage(newMessage) {

        const viewElement = this.shadowRoot.querySelector('chat-scroller').shadowRoot.getElementById('viewElement');
        const downObserver = this.shadowRoot.querySelector('chat-scroller').shadowRoot.getElementById('downObserver');
        const li = document.createElement('li');
        li.innerHTML = this.chatMessageTemplate(newMessage);
        li.id = newMessage.signature;

        if (newMessage.sender === this.selectedAddress.address) {

            viewElement.insertBefore(li, downObserver);
            viewElement.scrollTop = viewElement.scrollHeight;
        } else if (this.isUserDown) {

            // Append the message and scroll to the bottom if user is down the page
            viewElement.insertBefore(li, downObserver);
            viewElement.scrollTop = viewElement.scrollHeight;
        } else {

            viewElement.insertBefore(li, downObserver);
            this.showNewMesssageBar();
        }
    }

    /**
     *  Decode Message Method. Takes in a message object and returns a decoded message object
     * @param {Object} encodedMessageObj 
     * 
     */
    decodeMessage(encodedMessageObj) {
        let decodedMessageObj = {}

        if (this.isReceipient === true) {
            // direct chat

            if (encodedMessageObj.isEncrypted === true && this._publicKey.hasPubKey === true) {

                let decodedMessage = window.parent.decryptChatMessage(encodedMessageObj.data, window.parent.reduxStore.getState().app.selectedAddress.keyPair.privateKey, this._publicKey.key, encodedMessageObj.reference)
                decodedMessageObj = { ...encodedMessageObj, decodedMessage }
            } else if (encodedMessageObj.isEncrypted === false) {

                let bytesArray = window.parent.Base58.decode(encodedMessageObj.data)
                let decodedMessage = new TextDecoder('utf-8').decode(bytesArray)
                decodedMessageObj = { ...encodedMessageObj, decodedMessage }
            } else {

                decodedMessageObj = { ...encodedMessageObj, decodedMessage: "Cannot Decrypt Message!" }
            }

        } else {
            // group chat

            let bytesArray = window.parent.Base58.decode(encodedMessageObj.data)
            let decodedMessage = new TextDecoder('utf-8').decode(bytesArray)
            decodedMessageObj = { ...encodedMessageObj, decodedMessage }
        }

        return decodedMessageObj
    }

    async fetchChatMessages(chatId) {

        const initDirect = (cid) => {

            let initial = 0

            let directSocketTimeout

            let myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
            let nodeUrl = myNode.domain + ":" + myNode.port

            let directSocketLink

            if (window.parent.location.protocol === "https:") {

                directSocketLink = `wss://${nodeUrl}/websockets/chat/messages?involving=${window.parent.reduxStore.getState().app.selectedAddress.address}&involving=${cid}`;
            } else {

                // Fallback to http
                directSocketLink = `ws://${nodeUrl}/websockets/chat/messages?involving=${window.parent.reduxStore.getState().app.selectedAddress.address}&involving=${cid}`;
            }

            const directSocket = new WebSocket(directSocketLink);

            // Open Connection
            directSocket.onopen = () => {

                setTimeout(pingDirectSocket, 50)
            }

            // Message Event
            directSocket.onmessage = (e) => {

                if (initial === 0) {

                    this.isLoadingMessages = true
                    this.processMessages(JSON.parse(e.data), true)
                    initial = initial + 1
                } else {

                    this.processMessages(JSON.parse(e.data), false)
                }
            }

            // Closed Event
            directSocket.onclose = () => {
                clearTimeout(directSocketTimeout)
            }

            // Error Event
            directSocket.onerror = (e) => {
                clearTimeout(directSocketTimeout)
                console.log(`[DIRECT-SOCKET ==> ${cid}]: ${e.type}`);
            }

            const pingDirectSocket = () => {
                directSocket.send('ping')

                directSocketTimeout = setTimeout(pingDirectSocket, 295000)
            }

        };

        const initGroup = (gId) => {
            let groupId = Number(gId)

            let initial = 0

            let groupSocketTimeout

            let myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
            let nodeUrl = myNode.domain + ":" + myNode.port

            let groupSocketLink

            if (window.parent.location.protocol === "https:") {

                groupSocketLink = `wss://${nodeUrl}/websockets/chat/messages?txGroupId=${groupId}`;
            } else {

                // Fallback to http
                groupSocketLink = `ws://${nodeUrl}/websockets/chat/messages?txGroupId=${groupId}`;
            }

            const groupSocket = new WebSocket(groupSocketLink);

            // Open Connection
            groupSocket.onopen = () => {

                setTimeout(pingGroupSocket, 50)
            }

            // Message Event
            groupSocket.onmessage = (e) => {

                if (initial === 0) {

                    this.isLoadingMessages = true
                    this.processMessages(JSON.parse(e.data), true)
                    initial = initial + 1
                } else {

                    this.processMessages(JSON.parse(e.data), false)
                }
            }

            // Closed Event
            groupSocket.onclose = () => {
                clearTimeout(groupSocketTimeout)
            }

            // Error Event
            groupSocket.onerror = (e) => {
                clearTimeout(groupSocketTimeout)
                console.log(`[GROUP-SOCKET ==> ${groupId}]: ${e.type}`);
            }

            const pingGroupSocket = () => {
                groupSocket.send('ping')

                groupSocketTimeout = setTimeout(pingGroupSocket, 295000)
            }

        };


        if (chatId !== undefined) {

            if (this.isReceipient) {
                initDirect(chatId)
            } else {
                let groupChatId = Number(chatId)
                initGroup(groupChatId)
            }

        } else {
            // ... Render a nice "Error, Go Back" component.
        }

        // Add to the messages... TODO: Save messages to localstorage and fetch from it to make it persistent... 
    }

    _sendMessage() {
        this.isLoading = true;
        this.chatEditor.disable();
        const messageText = this.mirrorChatInput.value;

        // Format and Sanitize Message
        const sanitizedMessage = messageText.replace(/&nbsp;/gi, ' ').replace(/<br\s*[\/]?>/gi, '\n');
        const trimmedMessage = sanitizedMessage.trim();

        if (/^\s*$/.test(trimmedMessage)) {
            this.isLoading = false;
            this.chatEditor.enable();
        } else if (trimmedMessage.length >= 256) {
            this.isLoading = false;
            this.chatEditor.enable();
            parentEpml.request('showSnackBar', "Maximum Characters per message is 255");
        } else {
            this.sendMessage(trimmedMessage);
        }
    }

    async sendMessage(messageText) {
        this.isLoading = true;

        let _reference = new Uint8Array(64);
        window.crypto.getRandomValues(_reference);
        let reference = window.parent.Base58.encode(_reference);

        const sendMessageRequest = async () => {
            if (this.isReceipient === true) {
                let chatResponse = await parentEpml.request('chat', {
                    type: 18,
                    nonce: this.selectedAddress.nonce,
                    params: {
                        timestamp: Date.now(),
                        recipient: this._chatId,
                        recipientPublicKey: this._publicKey.key,
                        message: messageText,
                        lastReference: reference,
                        proofOfWorkNonce: 0,
                        isEncrypted: this._publicKey.hasPubKey === false ? 0 : 1,
                        isText: 1
                    }
                });

                _computePow(chatResponse)
            } else {
                let groupResponse = await parentEpml.request('chat', {
                    type: 181,
                    nonce: this.selectedAddress.nonce,
                    params: {
                        timestamp: Date.now(),
                        groupID: Number(this._chatId),
                        hasReceipient: 0,
                        message: messageText,
                        lastReference: reference,
                        proofOfWorkNonce: 0,
                        isEncrypted: 0, // Set default to not encrypted for groups
                        isText: 1
                    }
                });

                _computePow(groupResponse)
            }
        };

        const _computePow = async (chatBytes) => {
            const _chatBytesArray = Object.keys(chatBytes).map(function (key) { return chatBytes[key]; });
            const chatBytesArray = new Uint8Array(_chatBytesArray);
            const chatBytesHash = new window.parent.Sha256().process(chatBytesArray).finish().result;
            const hashPtr = window.parent.sbrk(32, window.parent.heap);
            const hashAry = new Uint8Array(window.parent.memory.buffer, hashPtr, 32);
            hashAry.set(chatBytesHash);

            const difficulty = this.balance === 0 ? 14 : 8;
            const workBufferLength = 8 * 1024 * 1024;
            const workBufferPtr = window.parent.sbrk(workBufferLength, window.parent.heap);
            let nonce = window.parent.computePow(hashPtr, workBufferPtr, workBufferLength, difficulty);

            let _response = await parentEpml.request('sign_chat', {
                nonce: this.selectedAddress.nonce,
                chatBytesArray: chatBytesArray,
                chatNonce: nonce
            });
            getSendChatResponse(_response);
        };

        const getSendChatResponse = (response) => {
            if (response === true) {
                this.chatEditor.resetValue();
            } else if (response.error) {
                parentEpml.request('showSnackBar', response.message);
            } else {
                parentEpml.request('showSnackBar', "Sending failed, Please retry...");
            }

            this.isLoading = false;
            this.chatEditor.enable();
        };

        // Exec..
        sendMessageRequest();
    }

    /**
     * Method to set if the user's location is down in the chat
     * @param { Boolean } isDown 
     */
    setIsUserDown(isDown) {

        this.isUserDown = isDown;
    }

    _downObserverhandler(entries) {

        if (entries[0].isIntersecting) {

            this.setIsUserDown(true)
            this.hideNewMesssageBar()
        } else {

            this.setIsUserDown(false)
        }
    }

    downElementObserver() {
        const downObserver = this.shadowRoot.querySelector('chat-scroller').shadowRoot.getElementById('downObserver');

        const options = {
            root: this.shadowRoot.querySelector('chat-scroller').shadowRoot.getElementById('viewElement'),
            rootMargin: '100px',
            threshold: 1
        }
        const observer = new IntersectionObserver(this._downObserverhandler, options)
        observer.observe(downObserver)
    }


    firstUpdated() {
        // TODO: Load and fetch messages from localstorage (maybe save messages to localstorage...)

        this.emojiPickerHandler = this.shadowRoot.querySelector('.emoji-button');
        this.mirrorChatInput = this.shadowRoot.getElementById('messageBox');
        this.chatMessageInput = this.shadowRoot.getElementById('_chatEditorDOM');

        document.addEventListener('keydown', (e) => {
            if (!this.chatEditor.content.body.matches(':focus')) {
                // WARNING: Deprecated methods from KeyBoard Event
                if (e.code === "Space" || e.keyCode === 32 || e.which === 32) {
                    this.chatEditor.insertText('&nbsp;');
                } else if (inputKeyCodes.includes(e.keyCode)) {
                    this.chatEditor.insertText(e.key);
                    return this.chatEditor.focus();
                } else {
                    return this.chatEditor.focus();
                }
            };
        });

        // Init EmojiPicker
        this.emojiPicker = new EmojiPicker({
            style: "twemoji",
            twemojiBaseUrl: '/emoji/',
            showPreview: false,
            showVariants: false,
            showAnimation: false,
            position: 'top-start',
            boxShadow: 'rgba(4, 4, 5, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.24) 0px 8px 16px 0px'
        });

        this.emojiPicker.on('emoji', selection => {
            const emojiHtmlString = `<img class="emoji" draggable="false" alt="${selection.emoji}" src="${selection.url}">`;
            this.chatEditor.insertEmoji(emojiHtmlString);
        });

        // Attach Event Handler
        this.emojiPickerHandler.addEventListener('click', () => this.emojiPicker.togglePicker(this.emojiPickerHandler));

        const getAddressPublicKey = () => {

            parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/publickey/${this._chatId}`
            }).then(res => {

                if (res.error === 102) {

                    this._publicKey.key = ''
                    this._publicKey.hasPubKey = false
                    this.fetchChatMessages(this._chatId)
                } else if (res !== false) {

                    this._publicKey.key = res
                    this._publicKey.hasPubKey = true
                    this.fetchChatMessages(this._chatId)
                } else {

                    this._publicKey.key = ''
                    this._publicKey.hasPubKey = false
                    this.fetchChatMessages(this._chatId)
                }
            })
        };

        setTimeout(() => {
            this.chatId.includes('direct') === true ? this.isReceipient = true : this.isReceipient = false;
            this._chatId = this.chatId.split('/')[1];

            const placeholder = this.isReceipient === true ? `Message ${this._chatId}` : 'Message...';
            this.chatEditorPlaceholder = placeholder;

            this.isReceipient ? getAddressPublicKey() : this.fetchChatMessages(this._chatId);

            // Init ChatEditor
            this.initChatEditor();
        }, 100)

        parentEpml.ready().then(() => {
            parentEpml.subscribe('selected_address', async selectedAddress => {
                this.selectedAddress = {}
                selectedAddress = JSON.parse(selectedAddress)
                if (!selectedAddress || Object.entries(selectedAddress).length === 0) return
                this.selectedAddress = selectedAddress
            })
            parentEpml.request('apiCall', {
                url: `/addresses/balance/${window.parent.reduxStore.getState().app.selectedAddress.address}`
            }).then(res => {
                this.balance = res
            })
            parentEpml.subscribe('frame_paste_menu_switch', async res => {

                res = JSON.parse(res)
                if (res.isOpen === false && this.isPasteMenuOpen === true) {

                    this.pasteToTextBox(textarea)
                    this.isPasteMenuOpen = false
                }
            })
        })

        parentEpml.imReady();
    }

    pasteToTextBox(textarea) {

        // Return focus to the window
        window.focus()

        navigator.clipboard.readText().then(clipboardText => {

            textarea.value += clipboardText
            textarea.focus()
        });
    }

    pasteMenu(event) {

        let eventObject = { pageX: event.pageX, pageY: event.pageY, clientX: event.clientX, clientY: event.clientY }
        parentEpml.request('openFramePasteMenu', eventObject)
    }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }

    initChatEditor() {

        const ChatEditor = function (editorConfig) {

            const ChatEditor = function () {
                const editor = this;

                editor.init();
            };

            ChatEditor.prototype.getValue = function () {
                const editor = this;

                if (editor.content) {
                    return editor.content.body.innerHTML;
                }
            };

            ChatEditor.prototype.setValue = function (value) {
                const editor = this;

                if (value) {
                    editor.content.body.innerHTML = value;
                    editor.updateMirror();
                }

                editor.focus();
            };

            ChatEditor.prototype.resetValue = function () {
                const editor = this;

                editor.content.body.innerHTML = '';
                editor.updateMirror();

                editor.focus();
            };

            ChatEditor.prototype.styles = function () {
                const editor = this;

                editor.styles = document.createElement('style');
                editor.styles.setAttribute('type', 'text/css');
                editor.styles.innerText = `
                                        html {
                                            cursor: text;
                                        }
                                        body {
                                                font-size: 1rem;
                                                line-height: 1.38rem;
                                                font-weight: 400;
                                                font-family: "Open Sans", helvetica, sans-serif;
                                                padding-right: 3px;
                                                text-align: left;
                                                white-space: break-spaces;
                                                word-break: break-word;
                                                outline: none;
                                            }
                                        body[contentEditable=true]:empty:before {
                                                content: attr(data-placeholder);
                                                display: block;
                                                color: rgb(103, 107, 113);
                                                text-overflow: ellipsis;
                                                overflow: hidden;
                                                user-select: none;
                                                white-space: nowrap;
                                            }
                                        body[contentEditable=false]{
                                                background: rgba(0,0,0,0.1);
                                            }
                                        img.emoji {
                                                width: 1.7em;
                                                height: 1.5em;
                                                margin-bottom: -2px;
                                                vertical-align: bottom;
                                            }
                `;
                editor.content.head.appendChild(editor.styles);
            };

            ChatEditor.prototype.enable = function () {
                const editor = this;

                editor.content.body.setAttribute('contenteditable', 'true');
                editor.focus();
            };

            ChatEditor.prototype.disable = function () {
                const editor = this;

                editor.content.body.setAttribute('contenteditable', 'false');
            };

            ChatEditor.prototype.state = function () {
                const editor = this;

                return editor.content.body.getAttribute('contenteditable');
            };

            ChatEditor.prototype.focus = function () {
                const editor = this;

                editor.content.body.focus();
            };

            ChatEditor.prototype.clearSelection = function () {
                const editor = this;

                let selection = editor.content.getSelection().toString();
                if (!/^\s*$/.test(selection)) editor.content.getSelection().removeAllRanges();
            };

            ChatEditor.prototype.insertEmoji = function (emojiImg) {
                const editor = this;

                const doInsert = () => {

                    if (editor.content.queryCommandSupported("InsertHTML")) {
                        editor.content.execCommand("insertHTML", false, emojiImg);
                        editor.updateMirror();
                    }
                };

                editor.focus();
                return doInsert();
            };

            ChatEditor.prototype.insertText = function (text) {
                const editor = this;

                const parsedText = editorConfig.emojiPicker.parse(text);
                const doPaste = () => {

                    if (editor.content.queryCommandSupported("InsertHTML")) {
                        editor.content.execCommand("insertHTML", false, parsedText);
                        editor.updateMirror();
                    }
                };

                editor.focus();
                return doPaste();
            };

            ChatEditor.prototype.updateMirror = function () {
                const editor = this;

                const chatInputValue = editor.getValue();
                const filteredValue = chatInputValue.replace(/<img.*?alt=".*?/g, '').replace(/".?src=.*?>/g, '');

                let unescapedValue = editorConfig.unescape(filteredValue);
                editor.mirror.value = unescapedValue;
            };

            ChatEditor.prototype.listenChanges = function () {
                const editor = this;

                ['drop', 'contextmenu', 'mouseup', 'click', 'touchend', 'keydown', 'blur', 'paste'].map(function (event) {
                    editor.content.body.addEventListener(event, function (e) {

                        if (e.type === 'click') {

                            e.preventDefault();
                            e.stopPropagation();
                        }

                        if (e.type === 'paste') {
                            e.preventDefault();

                            navigator.clipboard.readText().then(clipboardText => {

                                let escapedText = editorConfig.escape(clipboardText);

                                editor.insertText(escapedText);
                            }).catch(err => {

                                // Fallback if everything fails...
                                let textData = (e.originalEvent || e).clipboardData.getData('text/plain');
                                editor.insertText(textData);
                            })
                            return false;
                        }

                        if (e.type === 'contextmenu') {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }

                        if (e.type === 'keydown') {

                            // Handle Enter
                            if (e.keyCode === 13 && !e.shiftKey) {

                                // Update Mirror
                                editor.updateMirror();

                                if (editor.state() === 'false') return false;

                                editorConfig.sendFunc();
                                e.preventDefault();
                                return false;
                            }

                            // Handle Commands with CTR or CMD
                            if (e.ctrlKey || e.metaKey) {
                                switch (e.keyCode) {
                                    case 66:
                                    case 98: e.preventDefault();
                                        return false;
                                    case 73:
                                    case 105: e.preventDefault();
                                        return false;
                                    case 85:
                                    case 117: e.preventDefault();
                                        return false;
                                }

                                return false;
                            }
                        }

                        if (e.type === 'blur') {

                            editor.clearSelection();
                        }

                        if (e.type === 'drop') {
                            e.preventDefault();

                            let droppedText = e.dataTransfer.getData('text/plain')
                            let escapedText = editorConfig.escape(droppedText)

                            editor.insertText(escapedText);
                            return false;
                        }

                        editor.updateMirror();
                    });
                });

                editor.content.addEventListener('click', function (event) {

                    event.preventDefault();
                    editor.focus();
                });
            };

            ChatEditor.prototype.init = function () {
                const editor = this;

                editor.frame = editorConfig.editableElement;
                editor.mirror = editorConfig.mirrorElement;

                editor.content = (editor.frame.contentDocument || editor.frame.document);
                editor.content.body.setAttribute('contenteditable', 'true');
                editor.content.body.setAttribute('data-placeholder', editorConfig.placeholder);
                editor.content.body.setAttribute('spellcheck', 'false');

                editor.styles();
                editor.listenChanges();
            };


            function doInit() {

                return new ChatEditor();
            };

            return doInit();
        };

        const editorConfig = {
            mirrorElement: this.mirrorChatInput,
            editableElement: this.chatMessageInput,
            sendFunc: this._sendMessage,
            emojiPicker: this.emojiPicker,
            escape: escape,
            unescape: unescape,
            placeholder: this.chatEditorPlaceholder
        };

        this.chatEditor = new ChatEditor(editorConfig);
    }

}

window.customElements.define('chat-page', ChatPage)
