import {css, html, LitElement} from "lit"
import {escape, unescape} from 'html-escaper'
import {EmojiPicker} from 'emoji-picker-js'
import {inputKeyCodes} from '../../utils/keyCodes.js'
import {Epml} from '../../../epml.js'
import {get} from '../../../../core/translate'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ChatTextEditor extends LitElement {
	static get properties() {
		return {
            isLoading: { type: Boolean },
            isLoadingMessages: { type: Boolean },
            _sendMessage: { attribute: false },
            placeholder: { type: String },
            imageFile: { type: Object },
            insertImage: { attribute: false },
            iframeHeight: { type: Number },
            editedMessageObj: { type: Object },
            chatEditor: { type: Object },
            setChatEditor: { attribute: false },
            iframeId: { type: String },
            hasGlobalEvents: { type: Boolean },
            chatMessageSize: { type: Number },
            isEditMessageOpen: { type: Boolean },
            theme: {
                type: String,
                reflect: true
              }
		}
	}

	static get styles() {
		return css`
       :host {
         position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: auto;
            overflow-y: hidden;
            width: 100%;
      }
        .chatbar-container {
            width: 100%;
            display: flex;
            height: auto;
            overflow: hidden;
        }

        .chatbar-caption {
            border-bottom: 2px solid var(--mdc-theme-primary);
        }

        .emoji-button {
            width: 45px;
            height: 40px;
            padding-top: 4px;
            border: none;
            outline: none;
            background: transparent;
            cursor: pointer;
            max-height: 40px;
            color: var(--black);
        }

        .message-size-container {
            display: flex;
            justify-content: flex-end;
            width: 100%;
        }

        .message-size {
            font-family: Roboto, sans-serif;
            font-size: 12px;
            color: black;
        }

        .paperclip-icon {
            color: var(--paperclip-icon);
            width: 25px;
        }

        .paperclip-icon:hover {
            cursor: pointer;
        }

        .send-icon {
            width: 30px;
            margin-left: 5px;
            transition: all 0.1s ease-in-out;
            cursor: pointer;
        }

        .send-icon:hover {
            filter: brightness(1.1);
        }

        .file-picker-container {
            position: relative;
            height: 25px;
            width: 25px;
        }

        .file-picker-input-container {
            position: absolute;
            top: 0px;
            bottom: 0px;
            left: 0px;
            right: 0px;
            z-index: 10;
            opacity: 0;
            overflow: hidden;
        }

        input[type=file]::-webkit-file-upload-button {
            cursor: pointer;
        }

        .chatbar-container textarea {
            display: none;
        }

        .chatbar-container .chat-editor {
            display: flex;
            max-height: -webkit-fill-available;
            width: 100%;
            border-color: transparent;
            margin: 0;
            padding: 0;
            border: none;
        }

        .checkmark-icon {
            width: 30px;
            color: var(--mdc-theme-primary);
            margin-bottom: 6px;
        }

        .checkmark-icon:hover {
           cursor: pointer;
        }
		`
	}

	constructor() {
		super()
		this.isLoadingMessages = true
        this.isLoading = false
        this.getMessageSize = this.getMessageSize.bind(this)
        this.calculateIFrameHeight = this.calculateIFrameHeight.bind(this)
        this.resetIFrameHeight = this.resetIFrameHeight.bind(this)
        this.addGlobalEventListener = this.addGlobalEventListener.bind(this)
        this.sendMessageFunc = this.sendMessageFunc.bind(this)
        this.removeGlobalEventListener = this.removeGlobalEventListener.bind(this)
        this.initialChat = this.initialChat.bind(this)
        this.iframeHeight = 42
        this.chatMessageSize = 0
        this.userName = window.parent.reduxStore.getState().app.accountInfo.names[0]
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
	}

	render() {
        let scrollHeightBool = false;
        try {
            if (this.chatMessageInput && this.chatMessageInput.contentDocument.body.scrollHeight > 60 && this.shadowRoot.querySelector(".chat-editor").contentDocument.body.querySelector("#chatbarId").innerHTML.trim() !== "") {
                    scrollHeightBool = true;
                }
        } catch (error) {
            scrollHeightBool = false;
        }
		return html`
            <div
             class=${["chatbar-container", (this.iframeId === "newChat" || this.iframeId === "privateMessage") ? "chatbar-caption" : ""].join(" ")}
             style="${scrollHeightBool ? 'align-items: flex-end' : "align-items: center"}">
                <div
                    style=${this.iframeId === "privateMessage" ? "display: none" : "display: block"}
                    class="file-picker-container"
                    @click=${(e) => {
                        this.preventUserSendingImage(e)
                    }}>
                    <vaadin-icon
                        class="paperclip-icon"
                        icon="vaadin:paperclip"
                        slot="icon"
                    >
                    </vaadin-icon>
                    <div class="file-picker-input-container">
                    <input
                            @change="${e => {
                                this.insertImage(e.target.files[0]);
                                const filePickerInput = this.shadowRoot.getElementById('file-picker')
                                if(filePickerInput){
                                    filePickerInput.value = ""
                                }
                                    }
                                }"
                            id="file-picker"
                            class="file-picker-input" type="file" name="myImage" accept="image/*" />
                    </div>
                </div>
                <textarea style="color: var(--black);" tabindex='1' ?autofocus=${true} ?disabled=${this.isLoading || this.isLoadingMessages} id="messageBox" rows="1"></textarea>
                <iframe style=${(this.iframeId === "newChat" && this.iframeHeight > 42) && "height: 100%;"} id=${this.iframeId}  class="chat-editor"  tabindex="-1" height=${this.iframeHeight}></iframe>
                <button class="emoji-button" ?disabled=${this.isLoading || this.isLoadingMessages}>
                    ${html`<img class="emoji" draggable="false" alt="😀" src="/emoji/svg/1f600.svg" />`}
                </button>
                ${this.editedMessageObj ? (
                    html`
                    <div>
                        ${this.isLoading === false ? html`
                            <vaadin-icon
                                class="checkmark-icon"
                                icon="vaadin:check"
                                slot="icon"
                                @click=${() => {
                                    this.sendMessageFunc();
                                }}
                                >
                            </vaadin-icon>
                            ` :
                            html`
                            <paper-spinner-lite active></paper-spinner-lite>
                        `}
                    </div>
                        `
                ) :
                    html`
                        <div
                        style="${scrollHeightBool
                        ? 'margin-bottom: 5px;'
                        : "margin-bottom: 0;"}
                        ${this.iframeId === 'newChat'
                        ? 'display: none;'
                        : 'display: flex;'}">
                            ${this.isLoading === false ? html`
                                <img
                                src="/img/qchat-send-message-icon.svg"
                                alt="send-icon"
                                class="send-icon"
                                @click=${() => {
                                    this.sendMessageFunc();
                                }}
                                />
                            ` :
                            html`
                                <paper-spinner-lite active></paper-spinner-lite>
                        `}
                        </div>
                        `
                    }
                </div>
                    ${this.chatMessageSize >= 750 ?
                        html`
                        <div class="message-size-container" style=${this.imageFile && "margin-top: 10px;"}>
                            <div class="message-size" style="${this.chatMessageSize > 1000 && 'color: #bd1515'}">
                                ${`Your message size is of ${this.chatMessageSize} bytes out of a maximum of 1000`}
                            </div>
                        </div>
                        ` :
                    html``}
            </div>
		`
	}

    preventUserSendingImage(e) {
            if (!this.userName) {
                e.preventDefault();
                parentEpml.request('showSnackBar', get("chatpage.cchange27"));
           }
	}

    initialChat(e) {
        if (!this.chatEditor?.contentDiv.matches(':focus')) {
            // WARNING: Deprecated methods from KeyBoard Event
            if (e.code === "Space" || e.keyCode === 32 || e.which === 32) {
                this.chatEditor.insertText('&nbsp;');
            } else if (inputKeyCodes.includes(e.keyCode)) {
                this.chatEditor.insertText(e.key);
                return this.chatEditor.focus();
            } else {
                return this.chatEditor.focus();
            }
        }
    }

    addGlobalEventListener(){
        document.addEventListener('keydown', this.initialChat);
    }

    removeGlobalEventListener(){
        document.removeEventListener('keydown', this.initialChat);
    }

	async firstUpdated() {
        if (this.hasGlobalEvents) {
            this.addGlobalEventListener();
        }

        window.addEventListener('storage', () => {
            const checkTheme = localStorage.getItem('qortalTheme')
            const chatbar = this.shadowRoot.getElementById(this.iframeId).contentWindow.document.getElementById('chatbarId')
            chatbar.style.cssText = "color: var(--chat-bubble-msg-color);"
        })

        this.emojiPickerHandler = this.shadowRoot.querySelector('.emoji-button');
        this.mirrorChatInput = this.shadowRoot.getElementById('messageBox');
        this.chatMessageInput = this.shadowRoot.getElementById(this.iframeId);

        this.emojiPicker = new EmojiPicker({
            style: "twemoji",
            twemojiBaseUrl: '/emoji/',
            showPreview: false,
            showVariants: false,
            showAnimation: false,
            position: 'top-start',
            boxShadow: 'rgba(4, 4, 5, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.24) 0px 8px 16px 0px',
            zIndex: 100

        })

        this.emojiPicker.on('emoji', selection => {
            const emojiHtmlString = `<img class="emoji" draggable="false" alt="${selection.emoji}" src="${selection.url}">`
            this.chatEditor.insertEmoji(emojiHtmlString);
        })


        this.emojiPickerHandler.addEventListener('click', () => this.emojiPicker.togglePicker(this.emojiPickerHandler))

        await this.updateComplete
        this.initChatEditor()
	}

    async updated(changedProperties) {
        if (changedProperties && changedProperties.has('editedMessageObj')) {
            if (this.editedMessageObj) {
                this.chatEditor.insertText(this.editedMessageObj.message);
                this.getMessageSize(this.editedMessageObj.message);
            } else {
                this.chatEditor.insertText("");
                this.chatMessageSize = 0;
            }
        }
        if (changedProperties && changedProperties.has('placeholder')) {
            const captionEditor = this.shadowRoot.getElementById(this.iframeId).contentWindow.document.getElementById('chatbarId')
            captionEditor.setAttribute('data-placeholder', this.placeholder)
        }

        if (changedProperties && changedProperties.has("imageFile")) {
            this.chatMessageInput = "newChat"
        }
    }

    shouldUpdate(changedProperties) {
        // Only update element if prop1 changed.
       return !(changedProperties.has('setChatEditor') && changedProperties.size === 1);

      }

    sendMessageFunc(props) {
        if (this.chatMessageSize > 1000 ) {
            parentEpml.request('showSnackBar', get("chatpage.cchange29"))
            return
        }
        this.chatMessageSize = 0
        this.chatEditor.updateMirror()
        this._sendMessage(props)
    }

    getMessageSize(message){
        try {
			// Format and Sanitize Message
        const sanitizedMessage = message.replace(/&nbsp;/gi, ' ').replace(/<br\s*[\/]?>/gi, '\n');
        const trimmedMessage = sanitizedMessage.trim();
            let messageObject = {};

            if (this.repliedToMessageObj) {
                let chatReference = this.repliedToMessageObj.reference;
                if (this.repliedToMessageObj.chatReference) {
                    chatReference = this.repliedToMessageObj.chatReference;
                }
                 messageObject = {
                    messageText: trimmedMessage,
                    images: [''],
                    repliedTo: chatReference,
                    version: 1
                }
            } else if (this.editedMessageObj) {
                let message = "";
                try {
					message = JSON.parse(this.editedMessageObj.decodedMessage);
                 } catch (error) {
                    message = this.messageObj.decodedMessage
                }
                messageObject = {
                    ...message,
                    messageText: trimmedMessage,
                }
            } else if(this.imageFile && this.iframeId === 'newChat') {
              messageObject = {
                    messageText: trimmedMessage,
                    images: [{
                        service: "QCHAT_IMAGE",
                        name: '123456789123456789123456789',
                        identifier: '123456'
                }],
                    repliedTo: '',
                    version: 1
                };
            } else {
                messageObject = {
                      messageText: trimmedMessage,
                      images: [''],
                      repliedTo: '',
                      version: 1
                  };
              }

            const stringified = JSON.stringify(messageObject);
			this.chatMessageSize = new Blob([stringified]).size;
        } catch (error) {
            console.error(error)
        }

    }

    calculateIFrameHeight(height) {
        setTimeout(()=> {
            const editorTest = this.shadowRoot.getElementById(this.iframeId).contentWindow.document.getElementById('chatbarId').scrollHeight;
            this.iframeHeight = editorTest + 20;
        }, 50)
    }
    resetIFrameHeight(height) {
        this.iframeHeight = 42;
    }
    initChatEditor() {
        const ChatEditor = function (editorConfig) {
            const ChatEditor = function () {
                const editor = this;
                editor.init();
            };

            ChatEditor.prototype.getValue = function () {
                const editor = this;

                if (editor.contentDiv) {
                    return editor.contentDiv.innerHTML;
                }
            };

            ChatEditor.prototype.setValue = function (value) {
                const editor = this;

                if (value) {
                    editor.contentDiv.innerHTML = value;
                    editor.updateMirror();
                }

                editor.focus();
            };

            ChatEditor.prototype.resetValue = function () {
                const editor = this;
                editor.contentDiv.innerHTML = '';
                editor.updateMirror();
                editor.focus();
                editorConfig.resetIFrameHeight()
            };

            ChatEditor.prototype.styles = function () {
                const editor = this;

                editor.styles = document.createElement('style');
                editor.styles.setAttribute('type', 'text/css');
                editor.styles.innerText = `
                    html {
                        cursor: text;
                    }

                    .chatbar-body {
                        display: flex;
                        align-items: center;
                    }

                    .chatbar-body::-webkit-scrollbar-track {
                        background-color: whitesmoke;
                        border-radius: 7px;
                    }

                    .chatbar-body::-webkit-scrollbar {
                        width: 6px;
                        border-radius: 7px;
                        background-color: whitesmoke;
                    }

                    .chatbar-body::-webkit-scrollbar-thumb {
                        background-color: rgb(180, 176, 176);
                        border-radius: 7px;
                        transition: all 0.3s ease-in-out;
                    }

                    .chatbar-body::-webkit-scrollbar-thumb:hover {
                        background-color: rgb(148, 146, 146);
                        cursor: pointer;
                    }

                    div {
                        font-size: 1rem;
                        line-height: 1.38rem;
                        font-weight: 400;
                        font-family: "Open Sans", helvetica, sans-serif;
                        padding-right: 3px;
                        text-align: left;
                        white-space: break-spaces;
                        word-break: break-word;
                        outline: none;
                        min-height: 20px;
                        width: 100%;
                    }

                    div[contentEditable=true]:empty:before {
                        content: attr(data-placeholder);
                        display: block;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        user-select: none;
                        white-space: nowrap;
                        opacity: 0.7;
                   }

                   div[contentEditable=false]{
                        background: rgba(0,0,0,0.1);
                        width: 100%;
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

                editor.contentDiv.setAttribute('contenteditable', 'true');
                editor.focus();
            };

            ChatEditor.prototype.getMirrorElement = function (){
                return editor.mirror
            }

            ChatEditor.prototype.disable = function () {
                const editor = this;

                editor.contentDiv.setAttribute('contenteditable', 'false');
            };

            ChatEditor.prototype.state = function () {
                const editor = this;

                return editor.contentDiv.getAttribute('contenteditable');
            };

            ChatEditor.prototype.focus = function () {
                const editor = this;

                editor.contentDiv.focus();
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

				editor.mirror.value = editorConfig.unescape(filteredValue);
            };

            ChatEditor.prototype.listenChanges =  function () {

                const editor = this;

                const events = ['drop', 'contextmenu', 'mouseup', 'click', 'touchend', 'keydown', 'blur', 'paste']

                for (let i = 0; i < events.length; i++) {
                    const event = events[i]
                    editor.content.body.addEventListener(event, async function (e) {

                        if (e.type === 'click') {
                            e.preventDefault();
                            e.stopPropagation();
                        }

                        if (e.type === 'paste') {
                            e.preventDefault();
                            const item_list = await navigator.clipboard.read();
                            let image_type; // we will feed this later
                            const item = item_list.find( item => // choose the one item holding our image
                                item.types.some( type => {
                                if (type.startsWith( 'image/')) {
                                    image_type = type;
                                    return true;
                                }
                            })
                            );
                            if(item){
                                const blob = item && await item.getType( image_type );
                            var file = new File([blob], "name", {
                            type: image_type
                            });

                            editorConfig.insertImage(file)
                            } else {
                                navigator.clipboard.readText()
                                .then(clipboardText => {
                                    let escapedText = editorConfig.escape(clipboardText);
                                    editor.insertText(escapedText);
                                })
                                .then(() => {
                                    editorConfig.getMessageSize(editorConfig.editableElement.contentDocument.body.querySelector("#chatbarId").innerHTML);
                                })
                                .catch(err => {
                                    // Fallback if everything fails...
                                    let textData = (e.originalEvent || e).clipboardData.getData('text/plain');
                                    editor.insertText(textData);
                                })
                            }


                            return false;
                        }

                        if (e.type === 'contextmenu') {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }

                        if (e.type === 'keydown') {
                            await new Promise((res, rej) => {
                                setTimeout(() => {
                                    editorConfig.calculateIFrameHeight(editorConfig.editableElement.contentDocument.body.scrollHeight);
                                    editorConfig.getMessageSize(editorConfig.editableElement.contentDocument.body.querySelector("#chatbarId").innerHTML);
                                }, 0);
                                res();
                            })

                             // Handle Enter
                            if (e.keyCode === 13 && !e.shiftKey) {


                                if (editor.state() === 'false') return false;
                                if (editorConfig.iframeId === 'newChat') {
                                    editorConfig.sendFunc(
                                        {
                                            type: 'image',
                                            imageFile:  editorConfig.imageFile,
                                        }
                                    );
                                } else {
                                    editorConfig.sendFunc();
                                }

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
                  }

                editor.content.addEventListener('click', function (event) {
                    event.preventDefault();
                    editor.focus();
                });
            };

            ChatEditor.prototype.remove = function () {
                const editor = this;
                var old_element = editor.content.body;
                var new_element = old_element.cloneNode(true);
                editor.content.body.parentNode.replaceChild(new_element, old_element);
                while (editor.content.body.firstChild) {
                    editor.content.body.removeChild(editor.content.body.lastChild);
                  }

            };

            ChatEditor.prototype.init = function () {
                const editor = this;

                editor.frame = editorConfig.editableElement;
                editor.mirror = editorConfig.mirrorElement;

                editor.content = (editor.frame.contentDocument || editor.frame.document);
                editor.content.body.classList.add("chatbar-body");

                let elemDiv = document.createElement('div');
                elemDiv.setAttribute('contenteditable', 'true');
                elemDiv.setAttribute('spellcheck', 'false');
                elemDiv.setAttribute('data-placeholder', editorConfig.placeholder);
                elemDiv.style.cssText = `width:100%; color:var(--chat-bubble-msg-color);`;
                elemDiv.id = 'chatbarId';
                editor.content.body.appendChild(elemDiv);
                editor.contentDiv =  editor.frame.contentDocument.body.firstChild;
                editor.styles();
                editor.listenChanges();

            };


            function doInit() {
                return new ChatEditor();
            }
            return doInit();
        };

        const editorConfig = {
            getMessageSize: this.getMessageSize,
            calculateIFrameHeight: this.calculateIFrameHeight,
            mirrorElement: this.mirrorChatInput,
            editableElement: this.chatMessageInput,
            sendFunc: this.sendMessageFunc,
            emojiPicker: this.emojiPicker,
            escape: escape,
            unescape: unescape,
            placeholder: this.placeholder,
            imageFile: this.imageFile,
            requestUpdate: this.requestUpdate,
            insertImage: this.insertImage,
            chatMessageSize: this.chatMessageSize,
            addGlobalEventListener: this.addGlobalEventListener,
            removeGlobalEventListener: this.removeGlobalEventListener,
            iframeId: this.iframeId,
            theme: this.theme,
            resetIFrameHeight: this.resetIFrameHeight
        };
        const newChat = new ChatEditor(editorConfig);
        this.setChatEditor(newChat);
    }
}

window.customElements.define("chat-text-editor", ChatTextEditor)
