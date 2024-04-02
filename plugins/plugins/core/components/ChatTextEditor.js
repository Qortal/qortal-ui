import {css, html, LitElement} from "lit";
import {EmojiPicker} from 'emoji-picker-js'
import {Epml} from '../../../epml.js'
import '@material/mwc-icon'
import '@material/mwc-checkbox'
import {get, translate} from '../../../../core/translate'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ChatTextEditor extends LitElement {
	static get properties() {
		return {
            isLoading: { type: Boolean },
            isLoadingMessages: { type: Boolean },
            _sendMessage: { attribute: false },
            placeholder: { type: String },
            attachment: { type: Object },
            insertFile: { attribute: false },
            imageFile: { type: Object },
            insertImage: { attribute: false },
            iframeHeight: { type: Number },
            editedMessageObj: { type: Object },
            repliedToMessageObj: {type: Object},
            setChatEditor: { attribute: false },
            iframeId: { type: String },
            hasGlobalEvents: { type: Boolean },
            chatMessageSize: { type: Number },
            isEditMessageOpen: { type: Boolean },
            editor: {type: Object},
            theme: {
                type: String,
                reflect: true
              },
            toggleEnableChatEnter: {attribute: false},
            isEnabledChatEnter: {type: Boolean},
            openGifModal: { type: Boolean },
            setOpenGifModal: { attribute: false },
            chatId: {type: String},
            messageQueue: {type: Array}
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
            width: 100%;
            overflow: hidden;

      }
      * {

                    --mdc-checkbox-unchecked-color: var(--black);

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
        .privateMessageMargin {
            margin-bottom: 12px;
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
            margin-bottom: 5px;
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
            margin-bottom: 10px;
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

        .element {
            width: 100%;
            max-height: 100%;
            overflow: auto;
            color: var(--black);
            padding: 0px 10px;
            height: 100%;
    display: flex;
    align-items: safe center;
        }
        .element::-webkit-scrollbar-track {
                        background-color: whitesmoke;
                        border-radius: 7px;
                    }

                    .element::-webkit-scrollbar {
                        width: 6px;
                        border-radius: 7px;
                        background-color: whitesmoke;
                    }

                    .element::-webkit-scrollbar-thumb {
                        background-color: rgb(180, 176, 176);
                        border-radius: 7px;
                        transition: all 0.3s ease-in-out;
                    }

                    .element::-webkit-scrollbar-thumb:hover {
                        background-color: rgb(148, 146, 146);
                        cursor: pointer;
                    }
        .ProseMirror:focus {
            outline: none;
        }

        .is-active {
            background-color: var(--white)
        }

    .ProseMirror > * + * {
    margin-top: 0.75em;
    outline: none;
  }

  .ProseMirror ul,
  ol {
    padding: 0 1rem;
  }

  .ProseMirror h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  .ProseMirror code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  .ProseMirror pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    white-space: pre-wrap;
  }
  .ProseMirror pre code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }


  .ProseMirror img {
    width: 1.7em;
    height: 1.5em;
    margin: 0px;

  }

  .ProseMirror blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  .ProseMirror hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }
  .chatbar-button-single {
    background: var(--white);
    outline: none;
    border: none;
    color: var(--black);
    padding: 4px;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 2px;
    filter: brightness(100%);
    transition: all 0.2s;
    display: none;
  }
  .removeBg {
    background: none;
  }

  .chatbar-button-single label {
    font-size: 13px;
  }
  .chatbar-button-single:hover {
    filter: brightness(120%);

  }

  .chatbar-buttons {
    margin-bottom: 5px;
    flex-shrink: 0;
  }

  .show-chatbar-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  :host(:hover) .chatbar-button-single {

    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ProseMirror p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
.ProseMirror p {
    font-size: 18px;
    margin-block-start: 0px;
    margin-block-end: 0px;
    overflow-wrap: anywhere;
}

.ProseMirror {
    width: 100%;
    box-sizing: border-box;
    word-break: break-word;
}

.ProseMirror mark {
  background-color: #ffe066;
  border-radius: 0.25em;
  box-decoration-break: clone;
  padding: 0.125em 0;
}

.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  /* Preferred icon size */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;

}

.material-symbols-outlined {
  font-family: 'Material Icons Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 18px;  /* Preferred icon size */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
}
.hide-styling {
    display: none;
}
mwc-checkbox::shadow, mdc-checkbox::after, mwc-checkbox::shadow, mdc-checkbox::before {
                background-color: var(--mdc-theme-primary)
            }
		`
	}

	constructor() {
		super()
		this.isLoadingMessages = true
        this.isLoading = false
        this.getMessageSize = this.getMessageSize.bind(this)
        this.sendMessageFunc = this.sendMessageFunc.bind(this)
        this.iframeHeight = 42
        this.chatMessageSize = 0
        this.userName = window.parent.reduxStore.getState().app.accountInfo.names[0]
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
        this.editor = null
        this.messageQueue = []

	}

	render() {
		return html`
            <div
             class=${["chatbar-container", "chatbar-buttons", this.iframeId !=="_chatEditorDOM" && 'hide-styling'].join(" ")}
             style="align-items: center;justify-content:space-between">
            <div style="display: flex;align-items: center">
             <button
        @click=${() => this.editor.chain().focus().toggleBold().run()}
        ?disabled=${
            this.editor &&
          !this.editor.can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
        class=${["chatbar-button-single", (this.editedMessageObj || this.repliedToMessageObj || this.openGifModal) && 'show-chatbar-buttons', this.editor && this.editor.isActive('bold') ? 'is-active' : ''].join(" ")}
      >
      <!-- <mwc-icon >format_bold</mwc-icon> -->
      <span class="material-symbols-outlined">&#xe238;</span>
      </button>
      <button
        @click=${() => this.editor.chain().focus().toggleItalic().run()}
        ?disabled=${ this.editor &&
          !this.editor.can()
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
        class=${["chatbar-button-single", (this.editedMessageObj || this.repliedToMessageObj || this.openGifModal) && 'show-chatbar-buttons', this.editor &&  this.editor.isActive('italic') ? 'is-active' : ''].join(' ')}
      >
      <span class="material-symbols-outlined">&#xe23f;</span>
      </button>

      <button
        @click=${() => this.editor.chain().focus().toggleUnderline().run()}
        class=${["chatbar-button-single", (this.editedMessageObj || this.repliedToMessageObj || this.openGifModal) && 'show-chatbar-buttons', this.editor && this.editor.isActive('underline') ? 'is-active' : ''].join(' ')}
      >
      <span class="material-symbols-outlined">&#xe249;</span>
      </button>
      <button
        @click=${() => this.editor.chain().focus().toggleHighlight().run()}
        class=${["chatbar-button-single", (this.editedMessageObj || this.repliedToMessageObj || this.openGifModal) && 'show-chatbar-buttons', this.editor && this.editor.isActive('highlight') ? 'is-active' : ''].join(' ')}
      >
      <span class="material-symbols-outlined">&#xe22b;</span>
      </button>
      <button
        @click=${() => this.editor.chain().focus().toggleCodeBlock().run()}
        class=${["chatbar-button-single",(this.editedMessageObj || this.repliedToMessageObj || this.openGifModal) && 'show-chatbar-buttons', this.editor && this.editor.isActive('codeBlock') ? 'is-active' : ''].join(' ')}
      >
      <span class="material-symbols-outlined">&#xe86f;</span>
      </button>
      <button
      @click=${()=> this.toggleEnableChatEnter() }
      style="height: 26px; box-sizing: border-box;"
        class=${["chatbar-button-single",(this.editedMessageObj || this.repliedToMessageObj || this.openGifModal) && 'show-chatbar-buttons', this.editor && this.editor.isActive('codeBlock') ? 'is-active' : ''].join(' ')}
      >
      ${this.isEnabledChatEnter ? html`
      ${translate("chatpage.cchange63")}
      ` : html`
      ${translate("chatpage.cchange64")}
      `}

      </button>
    </div>
        ${this.iframeId === "_chatEditorDOM" ? html`
        <div
      style="height: 26px; box-sizing: border-box"
        class=${["chatbar-button-single", "removeBg"].join(' ')}
      >
      <label
                                for="qChatShowAutoMsg"
                                @click=${() => this.shadowRoot.getElementById('qChatShowAutoMsg').click()}
                                >${translate('chatpage.cchange69')}</label>

        <mwc-checkbox style="margin-right: -15px;"  id="qChatShowAutoMsg" @click=${e => {
        if(e.target.checked){
            window.parent.reduxStore.dispatch( window.parent.reduxAction.removeAutoLoadImageChat(this.chatId))
            return
        }
        window.parent.reduxStore.dispatch( window.parent.reduxAction.addAutoLoadImageChat(this.chatId))

      }} ?checked=${(window.parent.reduxStore.getState().app?.autoLoadImageChats || []).includes(this.chatId)}></mwc-checkbox>
    </div>
        ` : ''}

            </div>
            <div
             class=${["chatbar-container", (this.iframeId === "newChat" || this.iframeId === "privateMessage") ? "chatbar-caption" : ""].join(" ")}
             style="align-items: flex-end; position: relative">

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
                            this.insertFile(e.target.files[0]);
                            const filePickerInput = this.shadowRoot.getElementById('file-picker');
                            if (filePickerInput) {
                                    filePickerInput.value = "";
                                }
                            }
                        }"
                        id="file-picker"
                        class="file-picker-input"
                        type="file"
                        name="myImage"
                        accept="image/*, .doc, .docx, .pdf, .zip, .pdf, .txt, .odt, .ods, .xls, .xlsx, .ppt, .pptx" />
                    </div>
                </div>
                <textarea style="color: var(--black);" tabindex='1' ?autofocus=${true} ?disabled=${this.isLoading || this.isLoadingMessages} id="messageBox" rows="1"

                >

                ></textarea>
                <div id=${this.iframeId}
                class=${["element", this.iframeId === "privateMessage" ? "privateMessageMargin" : ""].join(" ")}
                ></div>
                <button class="emoji-button" ?disabled=${this.isLoading || this.isLoadingMessages}>
                    ${html`<img class="emoji" draggable="false" alt="😀" src="/emoji/svg/1f600.svg" />`}
                </button>
                ${this.editedMessageObj ? (
                    html`
                    <div style="margin-bottom: 10px">
                        ${this.isLoading === false ? html`
                            <vaadin-icon
                                class="checkmark-icon"
                                icon="vaadin:check"
                                slot="icon"
                                @click=${() => {
                                    this.sendMessageFunc(this.messageQueue);
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
                        style="margin-bottom: 10px;
                        ${(this.iframeId === 'newChat'  || this.iframeId === "newAttachmentChat")
                        ? 'display: none;'
                        : 'display: flex;'}">
                            ${this.isLoading === false ? html`
                                <img
                                src="/img/qchat-send-message-icon.svg"
                                alt="send-icon"
                                class="send-icon"
                                @click=${() => {
                                    this.sendMessageFunc(this.messageQueue);
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
                            <div class="message-size" style="${this.chatMessageSize > 4000 && 'color: #bd1515'}">
                                ${`Your message size is of ${this.chatMessageSize} bytes out of a maximum of 4000`}
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

    async handlePasteEvent(e) {
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
            this.insertFile(file);
            }
        }
    }

	async firstUpdated() {
        window.addEventListener('storage', () => {
            const checkTheme = localStorage.getItem('qortalTheme');
            const chatbar = this.shadowRoot.querySelector('.element')
            chatbar.style.cssText = "color: var(--chat-bubble-msg-color);"
        })

        this.emojiPickerHandler = this.shadowRoot.querySelector('.emoji-button');
        this.mirrorChatInput = this.shadowRoot.getElementById('messageBox');
        this.chatMessageInput = this.shadowRoot.querySelector('.element')

        this.emojiPicker = new EmojiPicker({
            style: "twemoji",
            twemojiBaseUrl: '/emoji/',
            showPreview: false,
            showVariants: false,
            showAnimation: false,
            position: 'top-start',
            boxShadow: 'rgba(4, 4, 5, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.24) 0px 8px 16px 0px',
            zIndex: 100

        });

        this.emojiPicker.on('emoji', selection => {

            this.editor.commands.insertContent(selection.emoji, {
                parseOptions: {
                    preserveWhitespace: false
                }
            })
        });


        this.emojiPickerHandler.addEventListener('click', () => this.emojiPicker.togglePicker(this.emojiPickerHandler));

        await this.updateComplete;
        // this.initChatEditor();
	}

    async updated(changedProperties) {
        if (changedProperties && changedProperties.has('editedMessageObj')) {
            if (this.editedMessageObj) {
                this.editor.commands.setContent(this.editedMessageObj.message)
                this.getMessageSize(this.editedMessageObj.message);
            } else {
                this.chatMessageSize = 0;
            }
        }
        if (changedProperties && changedProperties.has('placeholder') && this.updatePlaceholder && this.editor) {
            this.updatePlaceholder(this.editor, this.placeholder )
        }

        if (changedProperties && changedProperties.has("imageFile")) {
            this.chatMessageInput = "newChat";
        }
    }

    shouldUpdate(changedProperties) {
        // Only update element if prop1 changed.
       return !(changedProperties.has('setChatEditor') && changedProperties.size === 1);

      }

    sendMessageFunc(props) {
        if(this.editor.isEmpty && (this.iframeId !== 'newChat' && this.iframeId !== 'newAttachmentChat')) return
        this.getMessageSize(this.editor.getJSON())
        if (this.chatMessageSize > 4000 ) {
            parentEpml.request('showSnackBar', get("chatpage.cchange29"));
            return;
        }
        this.chatMessageSize = 0;
        this._sendMessage(props, this.editor.getJSON(), this.messageQueue);
    }

    getMessageSize(message){
        try {

        const trimmedMessage = message
            let messageObject = {};

            if (this.repliedToMessageObj) {
                let chatReference = this.repliedToMessageObj.signature;
                if (this.repliedToMessageObj.chatReference) {
                    chatReference = this.repliedToMessageObj.chatReference;
                }
                 messageObject = {
                    messageText: trimmedMessage,
                    images: [''],
                    repliedTo: chatReference,
                    version: 3
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
                    version: 3
                };
            } else if (this.attachment && this.iframeId === 'newAttachmentChat') {
                messageObject = {
                      messageText: trimmedMessage,
                      attachments: [{
                          service: "QCHAT_ATTACHMENT",
                          name: '123456789123456789123456789',
                          identifier: '123456',
                          attachmentName: "123456789123456789123456789",
                          attachmentSize: "123456"
                      }],
                      repliedTo: '',
                      version: 2
                  };
              } else {
                messageObject = {
                      messageText: trimmedMessage,
                      images: [''],
                      repliedTo: '',
                      version: 3
                  };
              }

            const stringified = JSON.stringify(messageObject);
			this.chatMessageSize = new Blob([stringified]).size;
        } catch (error) {
            console.error(error)
        }

    }


}

window.customElements.define("chat-text-editor", ChatTextEditor)
