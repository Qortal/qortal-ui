import { html, LitElement } from 'lit'
import { Epml } from '../../../epml'
import { EmojiPicker } from 'emoji-picker-js'
import { chatTextEditorStyles } from './plugins-css'
import '@material/mwc-checkbox'
import '@material/mwc-icon'

// Multi language support
import { get, translate } from '../../../../core/translate'

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
			repliedToMessageObj: { type: Object },
			setChatEditor: { attribute: false },
			iframeId: { type: String },
			hasGlobalEvents: { type: Boolean },
			chatMessageSize: { type: Number },
			isEditMessageOpen: { type: Boolean },
			editor: { type: Object },
			theme: { type: String, reflect: true },
			toggleEnableChatEnter: { attribute: false },
			isEnabledChatEnter: { type: Boolean },
			openGifModal: { type: Boolean },
			setOpenGifModal: { attribute: false },
			chatId: { type: String },
			messageQueue: { type: Array }
		}
	}

	static get styles() {
		return [chatTextEditorStyles]
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
			<div class=${["chatbar-container", "chatbar-buttons", this.iframeId !== "_chatEditorDOM" && 'hide-styling'].join(" ")} style="align-items: center; justify-content:space-between;">
				<div style="display: flex; align-items: center;">
					<button
						@click=${() => this.editor.chain().focus().toggleBold().run()}
						?disabled=${this.editor && !this.editor.can().chain().focus().toggleBold().run()}
						class=${["chatbar-button-single", (this.editedMessageObj || this.repliedToMessageObj || this.openGifModal) && 'show-chatbar-buttons', this.editor && this.editor.isActive('bold') ? 'is-active' : ''].join(' ')}
					>
						<span class="material-symbols-outlined">&#xe238;</span>
					</button>
					<button
						@click=${() => this.editor.chain().focus().toggleItalic().run()}
						?disabled=${this.editor && !this.editor.can().chain().focus().toggleItalic().run()}
						class=${["chatbar-button-single", (this.editedMessageObj || this.repliedToMessageObj || this.openGifModal) && 'show-chatbar-buttons', this.editor && this.editor.isActive('italic') ? 'is-active' : ''].join(' ')}
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
						class=${["chatbar-button-single", (this.editedMessageObj || this.repliedToMessageObj || this.openGifModal) && 'show-chatbar-buttons', this.editor && this.editor.isActive('codeBlock') ? 'is-active' : ''].join(' ')}
					>
						<span class="material-symbols-outlined">&#xe86f;</span>
					</button>
					<button
						@click=${() => this.toggleEnableChatEnter()}
						style="height: 26px; box-sizing: border-box;"
						class=${["chatbar-button-single", (this.editedMessageObj || this.repliedToMessageObj || this.openGifModal) && 'show-chatbar-buttons', this.editor && this.editor.isActive('codeBlock') ? 'is-active' : ''].join(' ')}
					>
						${this.isEnabledChatEnter ? html`${translate("chatpage.cchange63")}` : html`${translate("chatpage.cchange64")}`}
					</button>
				</div>
				${this.iframeId === "_chatEditorDOM" ?
					html`
						<div style="height: 26px; box-sizing: border-box;" class=${["chatbar-button-single", "removeBg"].join(' ')}>
							<label for="qChatShowAutoMsg" @click=${() => this.shadowRoot.getElementById('qChatShowAutoMsg').click()}>
								${translate('chatpage.cchange69')}
							</label>
							<mwc-checkbox
								style="margin-right: -15px;"
								id="qChatShowAutoMsg"
								@click=${e => {
									if (e.target.checked) {
										window.parent.reduxStore.dispatch(window.parent.reduxAction.removeAutoLoadImageChat(this.chatId))
										return
									}
									window.parent.reduxStore.dispatch(window.parent.reduxAction.addAutoLoadImageChat(this.chatId))
								}}
								?checked=${(window.parent.reduxStore.getState().app?.autoLoadImageChats || []).includes(this.chatId)}
							>
							</mwc-checkbox>
						</div>
					`
					: ''
				}
			</div>
			<div class=${["chatbar-container", (this.iframeId === "newChat" || this.iframeId === "privateMessage") ? "chatbar-caption" : ""].join(" ")} style="align-items: flex-end; position: relative;">
				<div style=${this.iframeId === "privateMessage" ? "display: none;" : "display: block;"} class="file-picker-container" @click=${(e) => {this.preventUserSendingImage(e)}}>
					<vaadin-icon class="paperclip-icon" icon="vaadin:paperclip" slot="icon"></vaadin-icon>
					<div class="file-picker-input-container">
						<input
							@change="${e => {
								this.insertFile(e.target.files[0])
								const filePickerInput = this.shadowRoot.getElementById('file-picker')
								if (filePickerInput) {
									filePickerInput.value = ''
								}
							}}"
							id="file-picker"
							class="file-picker-input"
							type="file"
							name="myImage"
							accept="
								image/*, .doc, .docx, .zip, .pdf, .txt, .odt, .ods, .html,
								.xls, .xlsx, .ppt, .pptx, .jar, .gzip, .exe, .deb, .rar, .log,
								.sh, .dmg, .pkg, .7z, .gz, .psd, .mp4, .rpm, .snap, .AppImage
							"
						>
					</div>
				</div>
				<textarea style="color: var(--black);" tabindex='1' ?autofocus=${true} ?disabled=${this.isLoading || this.isLoadingMessages} id="messageBox" rows="1"></textarea>
				<div id=${this.iframeId} class=${["element", this.iframeId === "privateMessage" ? "privateMessageMargin" : ""].join(" ")}></div>
				<button class="emoji-button" ?disabled=${this.isLoading || this.isLoadingMessages}>
					${html`<img class="emoji" draggable="false" alt="😀" src="/emoji/svg/1f600.svg">`}
				</button>
				${this.editedMessageObj ?
					html`
						<div style="margin-bottom: 10px;">
							${this.isLoading === false
								? html`
									<vaadin-icon class="checkmark-icon" icon="vaadin:check" slot="icon" @click=${() => {this.sendMessageFunc(this.messageQueue)}}></vaadin-icon>
								` : html`
									<paper-spinner-lite active></paper-spinner-lite>
								`
							}
						</div>
					` : html`
						<div style="margin-bottom: 10px; ${(
							this.iframeId === 'newChat'
							|| this.iframeId === "newImageChat"
							|| this.iframeId === "newGifChat"
							|| this.iframeId === "newAttachmentChat"
							|| this.iframeId === "newFileChat"
						) ? 'display: none;' : 'display: flex;'}">
							${this.isLoading === false
								? html`
									<img src="/img/qchat-send-message-icon.svg" alt="send-icon" class="send-icon" @click=${() => {this.sendMessageFunc(this.messageQueue)}}>
								` : html`
									<paper-spinner-lite active></paper-spinner-lite>
								`
							}
						</div>
					`
				}
			</div>
			${this.chatMessageSize >= 750 ?
				html`
					<div class="message-size-container" style=${this.imageFile && "margin-top: 10px;"}>
						<div class="message-size" style="${this.chatMessageSize > 4000 && 'color: #F44336'}">
							${`Your message size is of ${this.chatMessageSize} bytes out of a maximum of 4000`}
						</div>
					</div>
				`
				: html``
			}
		`
	}

	async firstUpdated() {
		window.addEventListener('storage', () => {
			const checkTheme = localStorage.getItem('qortalTheme')
			const chatbar = this.shadowRoot.querySelector('.element')

			if (checkTheme === 'dark') {
				this.theme = 'dark'
				chatbar.style.cssText = "color:#ffffff;"

			} else {
				this.theme = 'light'
				chatbar.style.cssText = "color:#080808;"

			}
		})

		this.emojiPickerHandler = this.shadowRoot.querySelector('.emoji-button')
		this.mirrorChatInput = this.shadowRoot.getElementById('messageBox')
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

		})

		this.emojiPicker.on('emoji', selection => {
			this.editor.commands.insertContent(selection.emoji, {
				parseOptions: {
					preserveWhitespace: false
				}
			})
		})

		this.emojiPickerHandler.addEventListener('click', () => this.emojiPicker.togglePicker(this.emojiPickerHandler))

		await this.updateComplete
	}

	preventUserSendingImage(e) {
		if (!this.userName) {
			e.preventDefault()
			parentEpml.request('showSnackBar', get("chatpage.cchange27"))
		}
	}

	async handlePasteEvent(e) {
		if (e.type === 'paste') {
			e.preventDefault()

			const item_list = await navigator.clipboard.read()

			let image_type // we will feed this later

			const item = item_list.find(item => // choose the one item holding our image
				item.types.some(type => {
					if (type.startsWith('image/')) {
						image_type = type
						return true
					}
				})
			)

			if (item) {
				const blob = item && await item.getType(image_type)

				var file = new File([blob], "name", {
					type: image_type
				})

				this.insertFile(file)
			}
		}
	}

	async updated(changedProperties) {
		if (changedProperties && changedProperties.has('editedMessageObj')) {
			if (this.editedMessageObj) {
				this.editor.commands.setContent(this.editedMessageObj.message)
				this.getMessageSize(this.editedMessageObj.message)
			} else {
				this.chatMessageSize = 0
			}
		}

		if (changedProperties && changedProperties.has('placeholder') && this.updatePlaceholder && this.editor) {
			this.updatePlaceholder(this.editor, this.placeholder)
		}

		if (changedProperties && changedProperties.has("imageFile")) {
			this.chatMessageInput = "newChat"
		}
	}

	shouldUpdate(changedProperties) {
		// Only update element if prop1 changed.
		if (changedProperties.has('setChatEditor') && changedProperties.size === 1) return false
		return true
	}

	sendMessageFunc(props) {
		if (this.editor.isEmpty && (this.iframeId !== 'newChat' && this.iframeId !== 'newGifChat' && this.iframeId !== 'newAttachmentChat' && this.iframeId !== 'newFileChat')) return

		this.getMessageSize(this.editor.getJSON())

		if (this.chatMessageSize > 4000) {
			parentEpml.request('showSnackBar', get("chatpage.cchange29"))
			return
		}

		this.chatMessageSize = 0
		this._sendMessage(props, this.editor.getJSON(), this.messageQueue)
	}

	getMessageSize(message) {
		try {
			const trimmedMessage = message
			let messageObject = {}

			if (this.repliedToMessageObj) {
				let chatReference = this.repliedToMessageObj.signature

				if (this.repliedToMessageObj.chatReference) {
					chatReference = this.repliedToMessageObj.chatReference
				}

				messageObject = {
					messageText: trimmedMessage,
					images: [''],
					repliedTo: chatReference,
					version: 3
				}
			} else if (this.editedMessageObj) {
				let message = ''

				try {
					const parsedMessageObj = JSON.parse(this.editedMessageObj.decodedMessage)
					message = parsedMessageObj
				} catch (error) {
					message = this.messageObj.decodedMessage
				}

				messageObject = {
					...message,
					messageText: trimmedMessage,
				}
			} else if (this.imageFile && this.iframeId === 'newChat') {
				messageObject = {
					messageText: trimmedMessage,
					images: [{
						service: "QCHAT_IMAGE",
						name: '123456789123456789123456789',
						identifier: '123456'
					}],
					repliedTo: '',
					version: 3
				}
			} else if (this.gifFile && this.iframeId === 'newGifChat') {
				messageObject = {
					messageText: trimmedMessage,
					images: [{
						service: "IMAGE",
						name: '123456789123456789123456789',
						identifier: '123456'
					}],
					repliedTo: '',
					version: 3
				}
			} else if (this.attachment && this.iframeId === 'newAttachmentChat') {
				messageObject = {
					messageText: trimmedMessage,
					attachments: [{
						service: "ATTACHMENT",
						name: '123456789123456789123456789',
						identifier: '123456',
						attachmentName: "123456789123456789123456789",
						attachmentSize: "123456"
					}],
					repliedTo: '',
					version: 3
				}
			} else if (this.appFile && this.iframeId === 'newFileChat') {
				messageObject = {
					messageText: trimmedMessage,
					files: [{
						service: "FILE",
						name: '123456789123456789123456789',
						identifier: '123456',
						appFileName: "123456789123456789123456789",
						appFileSize: "123456"
					}],
					repliedTo: '',
					version: 3
				}
			} else {
				messageObject = {
					messageText: trimmedMessage,
					images: [''],
					repliedTo: '',
					version: 3
				}
			}

			const stringified = JSON.stringify(messageObject)
			const size = new Blob([stringified]).size

			this.chatMessageSize = size
		} catch (error) {
			console.error(error)
		}

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

window.customElements.define('chat-text-editor', ChatTextEditor)
