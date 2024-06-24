import { html, LitElement } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { animate } from '@lit-labs/motion'
import { Epml } from '../../../epml'
import { Editor, Extension, generateHTML } from '@tiptap/core'
import { escape } from 'html-escaper'
import { inputKeyCodes, replaceMessagesEdited, generateIdFromAddresses } from '../../utils/functions'
import { publishData, modalHelper, RequestQueue } from '../../utils/classes'
import { EmojiPicker } from 'emoji-picker-js'
import { Slice, Fragment, Node } from 'prosemirror-model'
import { chatpageStyles } from './plugins-css'
import localForage from 'localforage'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import WebWorker from 'web-worker:./computePowWorker.js'
import WebWorkerFile from 'web-worker:./computePowWorkerFile.js'
import WebWorkerSortMessages from 'web-worker:./webworkerSortMessages.js'
import WebWorkerDecodeMessages from 'web-worker:./webworkerDecodeMessages.js'
import ShortUniqueId from 'short-unique-id'
import Compressor from 'compressorjs'
import './ChatScroller'
import './LevelFounder'
import './NameMenu'
import './TimeAgo'
import './ChatTextEditor'
import './WrapperModal'
import './TipUser'
import './ChatSelect'
import './ChatSideNavHeads'
import './ChatLeaveGroup'
import './ChatGroupSettings'
import './ChatRightPanel'
import './ChatRightPanelResources'
import './ChatRightPanelSettings'
import './ChatSearchResults'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-icon'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/tooltip'

// Multi language support
import { get, translate } from '../../../../core/translate'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

const chatLastSeen = localForage.createInstance({
	name: 'chat-last-seen'
})

export const queue = new RequestQueue()
export const chatLimit = 20
export const chatLimitHalf = 10
export const totalMsgCount = 60

class ChatPage extends LitElement {
	static get properties() {
		return {
			theme: { type: String, reflect: true },
			selectedAddress: { type: Object },
			config: { type: Object },
			messages: { type: Array },
			_messages: { type: Array },
			newMessages: { type: Array },
			hideMessages: { type: Array },
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
			showNewMessageBar: { attribute: false },
			hideNewMessageBar: { attribute: false },
			setOpenPrivateMessage: { attribute: false },
			chatEditorPlaceholder: { type: String },
			messagesRendered: { type: Object },
			repliedToMessageObj: { type: Object },
			editedMessageObj: { type: Object },
			iframeHeight: { type: Number },
			imageFile: { type: Object },
			gifFile: { type: Object },
			attachment: { type: Object },
			appFile: { type: Object },
			isUploadingImage: { type: Boolean },
			isUploadingGif: { type: Boolean },
			isUploadingAttachment: { type: Boolean },
			isUploadingAppFile: { type: Boolean },
			isDeletingImage: { type: Boolean },
			isDeletingGif: { type: Boolean },
			isDeletingAttachment: { type: Boolean },
			isDeletingAppFile: { type: Boolean },
			userLanguage: { type: String },
			lastMessageRefVisible: { type: Boolean },
			isLoadingOldMessages: { type: Boolean },
			isEditMessageOpen: { type: Boolean },
			webSocket: { attribute: false },
			chatHeads: { type: Array },
			forwardActiveChatHeadUrl: { type: Object },
			openForwardOpen: { type: Boolean },
			groupAdmin: { type: Array },
			groupMembers: { type: Array },
			shifted: { type: Boolean },
			shiftedResources: { type: Boolean },
			shiftedSettings: { type: Boolean },
			groupInfo: { type: Object },
			setActiveChatHeadUrl: { attribute: false },
			userFound: { type: Array },
			userFoundModalOpen: { type: Boolean },
			webWorker: { type: Object },
			webWorkerFile: { type: Object },
			myTrimmedMeassage: { type: String },
			editor: { type: Object },
			currentEditor: { type: String },
			isEnabledChatEnter: { type: Boolean },
			openTipUser: { type: Boolean },
			openUserInfo: { type: Boolean },
			selectedHead: { type: Object },
			userName: { type: String },
			openGifModal: { type: Boolean },
			gifsLoading: { type: Boolean },
			goToRepliedMessage: { attribute: false },
			isLoadingGoToRepliedMessage: { type: Object },
			updateMessageHash: { type: Object },
			oldMessages: { type: Array },
			messageQueue: { type: Array },
			isInProcessQueue: { type: Boolean },
			loggedInUserName: { type: String },
			loggedInUserAddress: { type: String }
		}
	}

	static get styles() {
		return [chatpageStyles]
	}

	constructor() {
		super()
		this.getOldMessage = this.getOldMessage.bind(this)
		this.clearUpdateMessageHashmap = this.clearUpdateMessageHashmap.bind(this)
		this._sendMessage = this._sendMessage.bind(this)
		this.insertFile = this.insertFile.bind(this)
		this.pasteImage = this.pasteImage.bind(this)
		this.toggleEnableChatEnter = this.toggleEnableChatEnter.bind(this)
		this._downObserverhandler = this._downObserverhandler.bind(this)
		this.setOpenTipUser = this.setOpenTipUser.bind(this)
		this.setOpenUserInfo = this.setOpenUserInfo.bind(this)
		this.setUserName = this.setUserName.bind(this)
		this.setSelectedHead = this.setSelectedHead.bind(this)
		this.setGifsLoading = this.setGifsLoading.bind(this)
		this.selectedAddress = window.parent.reduxStore.getState().app.selectedAddress
		this.userName = ""
		this.chatId = ''
		this.myAddress = ''
		this.messages = []
		this._messages = []
		this.newMessages = []
		this.hideMessages = JSON.parse(localStorage.getItem("MessageBlockedAddresses") || "[]")
		this._publicKey = { key: '', hasPubKey: false }
		this.messageSignature = ''
		this._initialMessages = []
		this.balance = 1
		this.isReceipient = false
		this.isLoadingMessages = true
		this.isLoading = false
		this.isUserDown = false
		this.isPasteMenuOpen = false
		this.chatEditorPlaceholder = ""
		this.messagesRendered = {
			messages: [],
			type: ''
		}
		this.repliedToMessageObj = null
		this.editedMessageObj = null
		this.iframeHeight = 42
		this.imageFile = null
		this.gifFile = null
		this.attachment = null
		this.appFile = null
		this.uid = new ShortUniqueId()
		this.userLanguage = ""
		this.lastMessageRefVisible = false
		this.isEditMessageOpen = false
		this.emojiPicker = new EmojiPicker({
			style: "twemoji",
			twemojiBaseUrl: '/emoji/',
			showPreview: false,
			showVariants: false,
			showAnimation: false,
			position: 'top-start',
			boxShadow: 'rgba(4, 4, 5, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.24) 0px 8px 16px 0px'
		})
		this.openForwardOpen = false
		this.groupAdmin = []
		this.groupMembers = []
		this.shifted = false
		this.shiftedResources = false
		this.shiftedSettings = false
		this.groupInfo = {}
		this.pageNumber = 1
		this.userFoundModalOpen = false
		this.userFound = []
		this.forwardActiveChatHeadUrl = {
			url: "",
			name: "",
			selected: false
		}
		this.webWorker = null
		this.webWorkerFile = null
		this.webWorkerSortMessages = null
		this.webWorkerDecodeMessages = null
		this.currentEditor = '_chatEditorDOM'
		this.initialChat = this.initialChat.bind(this)
		this.setOpenGifModal = this.setOpenGifModal.bind(this)
		this.isEnabledChatEnter = true
		this.openGifModal = false
		this.isLoadingGoToRepliedMessage = {
			isLoading: false,
			top: 0,
			left: 0,
			offsetHeight: 0
		}
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
		this.updateMessageHash = {}
		this.addToUpdateMessageHashmap = this.addToUpdateMessageHashmap.bind(this)
		this.getAfterMessages = this.getAfterMessages.bind(this)
		this.oldMessages = []
		this.lastReadMessageTimestamp = 0
		this.initUpdate = this.initUpdate.bind(this)
		this.messageQueue = []
		this.addToQueue = this.addToQueue.bind(this)
		this.processQueue = this.processQueue.bind(this)
		this.isInProcessQueue = false
		this.nodeUrl = this.getNodeUrl()
		this.myNode = this.getMyNode()
	}

	render() {
		return html`
			<div class="main-container">
				<div class="chat-container" style="grid-template-rows: minmax(40px, auto) minmax(6%, 92vh) minmax(40px, auto); flex: 3;">
					<div class="group-nav-container">
						<div
							@click=${()=> {if (+this._chatId === 0 || this.isReceipient) return; this._toggle();}}
							style=${`height: 100%; display: flex; align-items: center;flex-grow: 1; cursor: pointer; cursor: ${+this._chatId === 0 || this.isReceipient ? 'default': 'pointer'}; user-select: none`}
						>
							${this.isReceipient ? '' : +this._chatId === 0 ?
								html`
									<p class="group-name">Qortal General Chat</p>
								`
								:  html`
									<p class="group-name">${this.groupInfo && this.groupInfo.groupName}</p>
								`
							}
						</div>
						<div style="display: flex; height: 100%; align-items: center">
							<mwc-icon id="chatsettings" class="top-bar-icon" @click=${this._toggleSettings} style="margin: 0px 10px">settings</mwc-icon>
							<vaadin-tooltip for="chatsettings" text=${translate("chatsettings.cs1")} position="start"></vaadin-tooltip>
							${(!this.isReceipient && +this._chatId !== 0) ?
								html`
									<mwc-icon class="top-bar-icon" @click=${this.copyJoinGroupLinkToClipboard} style="margin: 0px 10px">link</mwc-icon>
								`
								: ''
							}
							<mwc-icon class="top-bar-icon" @click=${this._toggleResources} style="margin: 0px 10px">photo_library</mwc-icon>
							${(!this.isReceipient && +this._chatId !== 0) ?
								html`
									<mwc-icon class="top-bar-icon" @click=${this._toggle} style="margin: 0px 10px">groups</mwc-icon>
								`
								: ''
							}
						</div>
					</div>
					<div>
						${this.isLoadingMessages ?
							html`
								<div class="lds-grid">
									<div></div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
								</div>
							`
							: this.renderChatScroller()
						}
					</div>
					<div
						class="gifs-backdrop"
						@click=${() => {if (this.gifsLoading) return; this.setOpenGifModal(false); this.editor.commands.focus("end"); this.shadowRoot.querySelector("chat-gifs").clearGifSelections();}}
						style=${this.openGifModal ? "visibility: visible; z-index: 4" : "visibility: hidden; z-index: -100"}
					>
					</div>
					<!-- main chat bar -->
					${this.isLoadingGoToRepliedMessage && this.isLoadingGoToRepliedMessage.loading ?
						html`
							<div style="position: fixed; top:${parseInt(this.isLoadingGoToRepliedMessage.top)}px;left: ${parseInt(this.isLoadingGoToRepliedMessage.left)}px" class=${`smallLoading marginLoader`}></div>
						`
						: ''
					}
					<div class="chat-text-area" style="${`${(this.repliedToMessageObj || this.editedMessageObj) && "min-height: 120px"}`}">
						<div class='last-message-ref' style=${(this.lastMessageRefVisible && !this.imageFile && !this.openGifModal) ? 'opacity: 1;' : 'opacity: 0;'}>
							<vaadin-icon
								class='arrow-down-icon'
								icon='vaadin:arrow-circle-down' slot='icon'
								@click=${() => {
									const chatScrollerElement = this.shadowRoot.querySelector('chat-scroller');
									if (chatScrollerElement && chatScrollerElement.disableAddingNewMessages) {
										this.getLastestMessages();
									} else {
										this.shadowRoot.querySelector("chat-scroller").shadowRoot.getElementById("downObserver").scrollIntoView({behavior: 'smooth',});
									}
								}}
							>
							</vaadin-icon>
						</div>
						<div class="typing-area">
							${this.repliedToMessageObj &&
								html`
									<div class="repliedTo-container">
										<div class="repliedTo-subcontainer">
											<vaadin-icon class="reply-icon" icon="vaadin:reply" slot="icon"></vaadin-icon>
											<div class="repliedTo-message">
												<p class="senderName">${this.repliedToMessageObj.senderName ? this.repliedToMessageObj.senderName : this.repliedToMessageObj.sender}</p>
												${this.repliedToMessageObj.version.toString() === '1' ?
													html`
														<span style="color: var(--black);">${this.repliedToMessageObj.message}</span>
													`
													: ''
												}
												${+this.repliedToMessageObj.version > 1 ?
													html`
														<span style="color: var(--black);">${unsafeHTML(generateHTML(this.repliedToMessageObj.message, [StarterKit, Underline, Highlight]))}</span>
													`
													: ''
												}
											</div>
											<vaadin-icon class="close-icon" icon="vaadin:close-big" slot="icon" @click=${() => this.closeRepliedToContainer()}></vaadin-icon>
										</div>
									</div>
								`
							}
							${this.editedMessageObj &&
								html`
									<div class="repliedTo-container">
										<div class="repliedTo-subcontainer">
											<vaadin-icon class="reply-icon" icon="vaadin:pencil" slot="icon"></vaadin-icon>
											<div class="repliedTo-message">
												<p class="senderName">${translate("chatpage.cchange25")}</p>
												<span style="color: var(--black);">${unsafeHTML(generateHTML(this.editedMessageObj.message, [StarterKit, Underline, Highlight]))}</span>
											</div>
											<vaadin-icon class="close-icon" icon="vaadin:close-big" slot="icon" @click=${() => this.closeEditMessageContainer()}></vaadin-icon>
										</div>
									</div>
								`
							}
							<div class="chatbar">
								<chat-text-editor
									?hasGlobalEvents=${true}
									iframeId="_chatEditorDOM"
									placeholder=${this.chatEditorPlaceholder}
									._sendMessage=${this._sendMessage}
									.imageFile=${this.imageFile}
									.insertFile=${this.insertFile}
									.editedMessageObj=${this.editedMessageObj}
									?isLoading=${this.isLoading}
									?isLoadingMessages=${this.isLoadingMessages}
									?isEditMessageOpen=${this.isEditMessageOpen}
									.editor=${this.editor}
									.updatePlaceholder=${(editor, value) => this.updatePlaceholder(editor, value)}
									id="_chatEditorDOM"
									.repliedToMessageObj=${this.repliedToMessageObj}
									.toggleEnableChatEnter=${this.toggleEnableChatEnter}
									?isEnabledChatEnter=${this.isEnabledChatEnter}
									?openGifModal=${this.openGifModal}
									.setOpenGifModal=${(val) => this.setOpenGifModal(val)}
									chatId=${this.chatId}
									.messageQueue=${this.messageQueue}
								>
								</chat-text-editor>
							</div>
						</div>
					</div>
					${(this.isUploadingImage || this.isDeletingImage) ?
						html`
							<div class="dialogCustom">
								<div class="dialogCustomInner">
									<div class="dialog-container-loader">
										<div class=${`smallLoading marginLoader`}></div>
										<p>${this.isDeletingImage ? translate("chatpage.cchange31") : translate("chatpage.cchange30")}</p>
									</div>
								</div>
							</div>
						`
						: ''
					}
					${(this.isUploadingGif || this.isDeletingGif) ?
						html`
							<div class="dialogCustom">
								<div class="dialogCustomInner">
									<div class="dialog-container-loader">
										<div class=${`smallLoading marginLoader`}></div>
										<p>${this.isDeletingImage ? translate("chatpage.cchange104") : translate("chatpage.cchange103")}</p>
									</div>
								</div>
							</div>
						`
						: ''
					}
					${(this.isUploadingAttachment || this.isDeletingAttachment) ?
						html`
							<div class="dialogCustom">
								<div class="dialogCustomInner">
									<div class="dialog-container-loader">
										<div class=${`smallLoading marginLoader`}></div>
										<p>${this.isDeletingAttachment ? translate("chatpage.cchange76") : translate("chatpage.cchange75")}</p>
									</div>
								</div>
							</div>
						`
						: ''
					}
					${(this.isUploadingAppFile || this.isDeletingAppFile) ?
						html`
							<div class="dialogCustom">
								<div class="dialogCustomInner">
									<div class="dialog-container-loader">
										<div class=${`smallLoading marginLoader`}></div>
										<p>${this.isDeletingAppFile ? translate("chatpage.cchange99") : translate("chatpage.cchange98")}</p>
									</div>
								</div>
							</div>
						`
						: ''
					}
					<wrapper-modal .onClickFunc=${() => {this.removeImage();}} style=${(this.imageFile && !this.isUploadingImage) ? "visibility:visible; z-index:50" : "visibility: hidden;z-index:-100"}>
						<div>
							<div class="dialog-container">
								<p class="dialog-container-title">${translate("chatpage.cchange110")}</p>
								${this.imageFile &&
									html`
										<img
											src=${this.imageFile.identifier ?
												`
													${this.nodeUrl}/arbitrary/${this.imageFile.service}/${this.imageFile.name}/${this.imageFile.identifier}
												`
												: URL.createObjectURL(this.imageFile)
											}
											alt="dialog-img"
											class="dialog-image"
										>
									`
								}
								<div class="caption-container">
									<chat-text-editor
										iframeId="newChat"
										?hasGlobalEvents=${false}
										placeholder=${this.chatEditorPlaceholder}
										._sendMessage=${this._sendMessage}
										.imageFile=${this.imageFile}
										.insertFile=${this.insertFile}
										.editedMessageObj=${this.editedMessageObj}
										?isLoading=${this.isLoading}
										?isLoadingMessages=${this.isLoadingMessages}
										id="chatTextCaption"
										.editor=${this.editorImage}
										.updatePlaceholder=${(editor, value) => this.updatePlaceholder(editor, value)}
									>
									</chat-text-editor>
								</div>
								<div class="modal-button-row">
									<button class="modal-button-red" @click=${() => {this.removeImage();}}>
										${translate("chatpage.cchange33")}
									</button>
									<button
										class="modal-button"
										@click=${() => {
											const chatTextEditor = this.shadowRoot.getElementById('chatTextCaption');
											chatTextEditor.sendMessageFunc({type: 'image',});
										}}
									>
										${translate("chatpage.cchange9")}
									</button>
								</div>
							</div>
						</div>
					</wrapper-modal>
					<wrapper-modal .onClickFunc=${() => {this.removeGif();}} style=${(this.gifFile && !this.isUploadingGif) ? "visibility:visible; z-index:50" : "visibility: hidden;z-index:-100"}>
						<div>
							<div class="dialog-container">
								<p class="dialog-container-title">${translate("chatpage.cchange111")}</p>
								${this.gifFile &&
									html`
										<img
											src=${this.gifFile.identifier ?
												`
													${this.nodeUrl}/arbitrary/${this.gifFile.service}/${this.gifFile.name}/${this.gifFile.identifier}
												`
												: URL.createObjectURL(this.gifFile)
											}
											alt="dialog-gif"
											class="dialog-image"
										>
									`
								}
								<div class="caption-container">
									<chat-text-editor
										iframeId="newGifChat"
										?hasGlobalEvents=${false}
										placeholder=${this.chatEditorPlaceholder}
										._sendMessage=${this._sendMessage}
										.gifFile=${this.gifFile}
										.insertFile=${this.insertFile}
										.editedMessageObj=${this.editedMessageObj}
										?isLoading=${this.isLoading}
										?isLoadingMessages=${this.isLoadingMessages}
										id="chatGifId"
										.editor=${this.editorGif}
										.updatePlaceholder=${(editor, value) => this.updatePlaceholder(editor, value)}
									>
									</chat-text-editor>
								</div>
								<div class="modal-button-row">
									<button class="modal-button-red" @click=${() => {this.removeGif();}}>
										${translate("chatpage.cchange33")}
									</button>
									<button
										class="modal-button"
										@click=${() => {
											const chatTextEditor = this.shadowRoot.getElementById('chatGifId');
											chatTextEditor.sendMessageFunc({type: 'gif',});
										}}
									>
										${translate("chatpage.cchange9")}
									</button>
								</div>
							</div>
						</div>
					</wrapper-modal>
					<wrapper-modal .onClickFunc=${() => {this.removeAttachment();}} style=${this.attachment && !this.isUploadingAttachment ? "visibility: visible; z-index: 50" : "visibility: hidden; z-index: -100"}>
						<div>
							<div class="dialog-container">
								<p class="dialog-container-title">${translate("chatpage.cchange112")}</p>
								${this.attachment &&
									html`
										<div class="attachment-icon-container"><img src="/img/attachment-icon.png" alt="attachment-icon" class="attachment-icon" /></div>
									`
								}
								<p class="attachment-name">${this.attachment && this.attachment.name}</p>
								<div class="caption-container">
									<chat-text-editor
										iframeId="newAttachmentChat"
										?hasGlobalEvents=${false}
										placeholder=${this.chatEditorPlaceholder}
										._sendMessage=${this._sendMessage}
										.imageFile=${this.imageFile}
										.attachment=${this.attachment}
										.insertFile=${this.insertFile}
										.editedMessageObj=${this.editedMessageObj}
										?isLoading=${this.isLoading}
										?isLoadingMessages=${this.isLoadingMessages}
										id="chatAttachmentId"
										.editor=${this.editorAttachment}
										.updatePlaceholder=${(editor, value) => this.updatePlaceholder(editor, value)}
									>
									</chat-text-editor>
								</div>
								<div class="modal-button-row">
									<button class="modal-button-red" @click=${() => {this.removeAttachment();}}>
										${translate("chatpage.cchange33")}
									</button>
									<button
										class="modal-button"
										@click=${() => {
											const chatTextEditor = this.shadowRoot.getElementById('chatAttachmentId');
											chatTextEditor.sendMessageFunc({type: 'attachment',});
										}}
									>
										${translate("chatpage.cchange9")}
									</button>
								</div>
							</div>
						</div>
					</wrapper-modal>
					<wrapper-modal .onClickFunc=${() => {this.removeAppFile();}} style=${this.appFile && !this.isUploadingAppFile ? "visibility: visible; z-index: 50" : "visibility: hidden; z-index: -100"}>
						<div>
							<div class="dialog-container">
								<p class="dialog-container-title">${translate("chatpage.cchange113")}</p>
								${this.appFile &&
									html`
										<div class="file-icon-container"><img src="/img/file-icon.png" alt="file-icon" class="file-icon"></div>
									`
								}
								<p class="attachment-name">${this.appFile && this.appFile.name}</p>
								<div class="caption-container">
									<chat-text-editor
										iframeId="newFileChat"
										?hasGlobalEvents=${false}
										placeholder=${this.chatEditorPlaceholder}
										._sendMessage=${this._sendMessage}
										.appFile=${this.appFile}
										.insertFile=${this.insertFile}
										.editedMessageObj=${this.editedMessageObj}
										?isLoading=${this.isLoading}
										?isLoadingMessages=${this.isLoadingMessages}
										id="chatFileId"
										.editor=${this.editorFile}
										.updatePlaceholder=${(editor, value) => this.updatePlaceholder(editor, value)}
									>
									</chat-text-editor>
								</div>
								<div class="modal-button-row">
									<button class="modal-button-red" @click=${() => {this.removeAppFile();}}>
										${translate("chatpage.cchange33")}
									</button>
									<button
										class="modal-button"
										@click=${() => {
											const chatTextEditor = this.shadowRoot.getElementById('chatFileId');
											chatTextEditor.sendMessageFunc({type: 'file'});
										}}
									>
										${translate("chatpage.cchange9")}
									</button>
								</div>
							</div>
						</div>
					</wrapper-modal>
					<paper-dialog class="warning" id="confirmDialog" modal>
						<h2 style="color: var(--black);">${translate("chatpage.cchange41")}</h2>
						<hr>
						<br>
						<h3 style="color: var(--black);">${translate("chatpage.cchange42")}</h3>
						<div class="buttons">
							<mwc-button @click=${() => {this.sendMessage(this.myMessageUnder4Qort);}} dialog-confirm>${translate("transpage.tchange3")}</mwc-button>
						</div>
					</paper-dialog>
					<wrapper-modal .onClickFunc=${() => {this.openForwardOpen = false; this.forwardActiveChatHeadUrl = {}; this.requestUpdate();}} style=${this.openForwardOpen ? "display: block" : "display: none"}>
						<div>
							<div class="dialog-container">
								<div><p class="dialog-container-title">${translate("blockpage.bcchange16")}</p></div>
								<div class="divider"></div>
								<div class="chat-head-container">
									<div class="search-field">
										<input
											type="text"
											class="name-input"
											id="sendTo"
											placeholder="${translate("chatpage.cchange7")}"
											@keydown=${() => {
												if (this.forwardActiveChatHeadUrl.selected) {
													this.forwardActiveChatHeadUrl = {};
													this.requestUpdate();
												}
											}}
										>
										${this.forwardActiveChatHeadUrl.selected ?
											(html`
												<div class="user-verified">
													<p>${translate("chatpage.cchange38")}</p>
													<vaadin-icon icon="vaadin:check-circle-o" slot="icon"></vaadin-icon>
												</div>
											`)
											: (html`<vaadin-icon @click=${this.userSearch} slot="icon" icon="vaadin:open-book" class="search-icon"></vaadin-icon>`)
										}
									</div>
									${this.forwardActiveChatHeadUrl.selected ?
										(html`
											<div class="user-selected">
												<p class="user-selected-name">
													${this.forwardActiveChatHeadUrl.name}
												</p>
												<div class="forwarding-container">
													<p class="user-selected-forwarding">
														Forwarding...
													</p>
													<vaadin-icon
														class="close-forwarding"
														icon="vaadin:close-big"
														slot="icon"
														@click=${() => {
															this.userFound = [];
															this.forwardActiveChatHeadUrl = {};
															this.requestUpdate();
															this.shadowRoot.getElementById("sendTo").value = "";
														}}
													>
													</vaadin-icon>
												</div>
											</div>
										`)
										: (html`
											${this.chatHeads.map((item) => {
												return html`
													<chat-select
														activeChatHeadUrl=${this.forwardActiveChatHeadUrl.url}
														.setActiveChatHeadUrl=${
															(val) => {this.forwardActiveChatHeadUrl = {...this.forwardActiveChatHeadUrl, url: val}; this.userFound = [];}
														}
														chatInfo=${JSON.stringify(item)}
													>
													</chat-select>
												`
											})}
										`)
									}
								</div>
								<div class="modal-button-row">
									<button class="modal-button-red" @click=${() => {this.openForwardOpen = false; this.forwardActiveChatHeadUrl = {}; this.requestUpdate();}}>
										${translate("chatpage.cchange33")}
									</button>
									<button class="modal-button" @click=${() => {this.sendForwardMessage();}}>
										${translate("blockpage.bcchange14")}
									</button>
								</div>
							</div>
							<div class="search-results-div">
								<chat-search-results
									.onClickFunc=${(result) => {
										this.forwardActiveChatHeadUrl = {...this.forwardActiveChatHeadUrl, url: `direct/${result.owner}`, name: result.name, selected: true};
										this.userFound = [];
										this.userFoundModalOpen = false;
									}}
									.closeFunc=${() => {
										this.userFoundModalOpen = false;
										this.userFound = [];
									}}
									.searchResults=${this.userFound}
									?isOpen=${this.userFoundModalOpen}
									?loading=${this.isLoading}
								>
								</chat-search-results>
							</div>
						</div>
					</wrapper-modal>
					<wrapper-modal .onClickFunc=${() => {this.setOpenTipUser(false)}} zIndex=${55} style=${this.openTipUser ? "display: block;" : "display: none;"}>
						<tip-user .closeTipUser=${!this.openTipUser} .userName=${this.userName} .setOpenTipUser=${(val) => this.setOpenTipUser(val)}></tip-user>
					</wrapper-modal>
					<wrapper-modal .onClickFunc=${() => {this.setOpenUserInfo(false); this.setUserName(""); this.setSelectedHead({});}} style=${this.openUserInfo ? "display: block" : "display: none"}>
						<user-info
							.setOpenUserInfo=${(val) => this.setOpenUserInfo(val)}
							.setOpenTipUser=${(val) => this.setOpenTipUser(val)}
							.setOpenPrivateMessage=${(val) => this.setOpenPrivateMessage(val)}
							.userName=${this.userName}
							.selectedHead=${this.selectedHead}
						>
						</user-info>
					</wrapper-modal>
				</div>
				<div class="chat-right-panel ${this.shifted ? "movedin" : "movedout"}" ${animate()}>
					<chat-right-panel
						.getMoreMembers=${(val) => this.getMoreMembers(val)}
						.toggle=${(val) => this._toggle(val)}
						.selectedAddress=${this.selectedAddress}
						.groupMembers=${this.groupMembers}
						.groupAdmin=${this.groupAdmin}
						.leaveGroupObj=${this.groupInfo}
						.setOpenPrivateMessage=${(val) => this.setOpenPrivateMessage(val)}
						.setOpenTipUser=${(val) => this.setOpenTipUser(val)}
						.setOpenUserInfo=${(val) => this.setOpenUserInfo(val)}
						.setUserName=${(val) => this.setUserName(val)}
					>
					</chat-right-panel>
				</div>
				<div class="chat-right-panel ${this.shiftedResources ? "movedin" : "movedout"}" ${animate()}>
					<chat-right-panel-resources
						.getMoreMembers=${(val) => this.getMoreMembers(val)}
						.toggle=${(val) => this._toggleResources(val)}
						.selectedAddress=${this.selectedAddress}
						.groupMembers=${this.groupMembers}
						.groupAdmin=${this.groupAdmin}
						.leaveGroupObj=${this.groupInfo}
						.setOpenPrivateMessage=${(val) => this.setOpenPrivateMessage(val)}
						.setOpenTipUser=${(val) => this.setOpenTipUser(val)}
						.setOpenUserInfo=${(val) => this.setOpenUserInfo(val)}
						.setUserName=${(val) => this.setUserName(val)}
						_chatId=${ifDefined(this._chatId)}
						chatId=${this.chatId}
						?isreceipient=${this.isReceipient}
						.repost=${this.insertFile}
					>
					</chat-right-panel-resources>
				</div>
				<div class="chat-right-panel ${this.shiftedSettings ? "movedin" : "movedout"}" ${animate()}>
					<chat-right-panel-settings
						.toggle=${(val) => this._toggleSettings(val)}
					>
					</chat-right-panel-settings>
				</div>
			</div>
		`
	}

	async firstUpdated() {
		this.changeTheme()

		if (localStorage.getItem('timestampForChats') === null) {
			localStorage.setItem('timestampForChats', 'ago')
		}

		if (localStorage.getItem('fontsizeForChats') === null) {
			localStorage.setItem('fontsizeForChats', 'font16')
		}

		window.addEventListener('storage', () => {
			const checkLanguage = localStorage.getItem('qortalLanguage')
			const checkTheme = localStorage.getItem('qortalTheme')

			this.userLanguage = checkLanguage

			if (checkTheme === 'dark') {
				this.theme = 'dark'
			} else {
				this.theme = 'light'
			}
			document.querySelector('html').setAttribute('theme', this.theme)
		})

		this.lastReadMessageTimestamp = await chatLastSeen.getItem(this.chatId) || 0

		parentEpml.imReady()

		const isEnabledChatEnter = localStorage.getItem('isEnabledChatEnter')

		if (isEnabledChatEnter) {
			this.isEnabledChatEnter = isEnabledChatEnter === 'false' ? false : true
		}

	}

	getNodeUrl() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		return nodeUrl
	}

	getMyNode() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode
	}

	setOpenGifModal(value) {
		this.openGifModal = value
	}

	_toggle(value) {
		this.shifted = value === (false || true) ? value : !this.shifted
		this.requestUpdate()
	}

	_toggleResources(value) {
		this.shiftedResources = value === (false || true) ? value : !this.shiftedResources
		this.requestUpdate()
	}

	_toggleSettings(value) {
		this.shiftedSettings = value === (false || true) ? value : !this.shiftedSettings
		this.requestUpdate()
	}

	setOpenTipUser(props) {
		this.openTipUser = props
	}

	setOpenUserInfo(props) {
		this.openUserInfo = props
	}

	setUserName(props) {
		this.userName = props.senderName ? props.senderName : props.sender
		this.setSelectedHead(props)
	}

	setSelectedHead(props) {
		this.selectedHead = {
			...this.selectedHead,
			address: props.sender,
			name: props.senderName,
		}
	}

	toggleEnableChatEnter() {
		localStorage.setItem('isEnabledChatEnter', !this.isEnabledChatEnter)
		this.isEnabledChatEnter = !this.isEnabledChatEnter
	}

	addGifs(gifs) {
		this.gifsToBeAdded = [...this.gifsToBeAdded, ...gifs]
	}

	setGifsLoading(props) {
		this.gifsLoading = props
	}

	addToQueue(outSideMsg, messageQueue) {
		// Push the new message object to the queue

		this.messageQueue = [...messageQueue, { ...outSideMsg, timestamp: Date.now() }]

		// Start processing the queue only if the message we just added is the only one in the queue
		// This ensures that the queue processing starts only once, even if this method is called multiple times
		if (this.messageQueue.length === 1) {
			this.processQueue()
		}

		// Notify Lit to update/render due to the property change
		this.requestUpdate()
	}

	async processQueue() {
		if (this.messageQueue.length === 0) return
		const currentMessage = this.messageQueue[0]
		try {
			const res = await this.sendMessage(currentMessage)

			if (res === true) {
				this.messageQueue = this.messageQueue.slice(1)
			} else {
				throw new Error('failed')
			}

			if (this.messageQueue.length > 0) {
				setTimeout(() => this.processQueue(), 2000) // Wait for 10 seconds before retrying
				// setTimeout(() => this.processQueue(), 0) // Process the next message immediately
			}
		} catch (error) {
			console.error("Failed to send message:", error)
			setTimeout(() => this.processQueue(), 10000) // Wait for 10 seconds before retrying
		}
	}

	async getLastestMessages() {
		try {
			let getInitialMessages = []
			if (this.isReceipient) {
				getInitialMessages = await parentEpml.request('apiCall', {
					type: 'api',
					url: `/chat/messages?involving=${window.parent.reduxStore.getState().app.selectedAddress.address}&involving=${this._chatId}&limit=${chatLimit}&reverse=true&haschatreference=false&encoding=BASE64`
				})
			} else {
				getInitialMessages = await parentEpml.request('apiCall', {
					type: 'api',
					url: `/chat/messages?txGroupId=${Number(this._chatId)}&limit=${chatLimit}&reverse=true&haschatreference=false&encoding=BASE64`
				})
			}
			this.processMessages(getInitialMessages, true, false)
		} catch (error) { /* empty */ }
	}

	async copyJoinGroupLinkToClipboard() {
		try {
			const link = `qortal://use-group/action-join/groupid-${this.groupInfo.groupId}`
			let copyString1 = get('chatpage.cchange97')
			await navigator.clipboard.writeText(link)
			parentEpml.request('showSnackBar', `${copyString1}`)
		} catch (err) {
			let copyString2 = get('walletpage.wchange39')
			parentEpml.request('showSnackBar', `${copyString2}`)
			console.error('Copy to clipboard error:', err)
		}
	}

	async getMoreMembers(groupId) {
		try {
			const getMembers = await parentEpml.request("apiCall", {
				type: "api",
				url: `/groups/members/${groupId}?onlyAdmins=false&limit=20&offset=${this.pageNumber * 20}`
			})
			const getMembersWithName = (getMembers.members || []).map(async (member) => {
				let memberItem = member
				try {
					const name = await this.getName(member.member)
					memberItem = {
						address: member.member,
						name: name ? name : undefined
					}
				} catch (error) { /* empty */ }

				return memberItem
			})
			const membersWithName = await Promise.all(getMembersWithName)
			this.groupMembers = [...this.groupMembers, ...membersWithName]
			this.pageNumber = this.pageNumber + 1
		} catch (error) { /* empty */ }
	}

	async connectedCallback() {
		super.connectedCallback()
		await this.initUpdate()

		if (!this.webWorker) {
			this.webWorker = new WebWorker()
		}

		if (!this.webWorkerFile) {
			this.webWorkerFile = new WebWorkerFile()
		}

		if (!this.webWorkerSortMessages) {
			this.webWorkerSortMessages = new WebWorkerSortMessages()
		}

		if (!this.webWorkerDecodeMessages) {
			this.webWorkerDecodeMessages = new WebWorkerDecodeMessages()
		}

		await this.getUpdateCompleteTextEditor()

		const elementChatId = this.shadowRoot.getElementById('_chatEditorDOM').shadowRoot.getElementById('_chatEditorDOM')
		const elementChatImageId = this.shadowRoot.getElementById('chatTextCaption').shadowRoot.getElementById('newChat')
		const elementChatGifId = this.shadowRoot.getElementById('chatGifId').shadowRoot.getElementById('newGifChat')
		const elementChatAttachmentId = this.shadowRoot.getElementById('chatAttachmentId').shadowRoot.getElementById('newAttachmentChat')
		const elementChatFileId = this.shadowRoot.getElementById('chatFileId').shadowRoot.getElementById('newFileChat')

		const placeholderString = get('chatpage.cchange114')

		const clipboardTextParser = (text, context, plain) => {
			const splitLines = text.replace().split(/(?:\r\n?|\n)/)
			const nodesLines = []

			splitLines.forEach(line => {
				let nodeJson = {type: "paragraph"}

				if (line.length === 0) {
					nodeJson.content = [{type: "hardBreak"}]
				} else if (line.length > 0) {
					nodeJson.content = [{type: "text", text: line}]
				}

				let modifiedLine = Node.fromJSON(context.doc.type.schema, nodeJson)

				nodesLines.push(modifiedLine)
			})

			const fragment = Fragment.fromArray(nodesLines)

			return Slice.maxOpen(fragment)
		}

		this.editor = new Editor({
			editorProps: {
				clipboardTextParser: clipboardTextParser
			},
			onUpdate: () => {
				this.shadowRoot.getElementById('_chatEditorDOM').getMessageSize(this.editor.getJSON())
			},
			element: elementChatId,
			extensions: [
				StarterKit,
				Underline,
				Highlight,
				Placeholder.configure({
					placeholder: `${placeholderString}`
				}),
				Extension.create({
					name: 'shortcuts',
					addKeyboardShortcuts: () => {
						return {
							'Enter': () => {
								if (this.isEnabledChatEnter) {
									const chatTextEditor = this.shadowRoot.getElementById('_chatEditorDOM')
									chatTextEditor.sendMessageFunc({
									})
									return true
								}

							},
							'Shift-Enter': () => {
								if (this.isEnabledChatEnter) {
									this.editor.commands.first(() => [
										this.editor.commands.newlineInCode()
									])
								}
							}
						}
					}
				})
			]
		})

		this.editorImage = new Editor({
			onUpdate: () => {
				this.shadowRoot.getElementById('chatTextCaption').getMessageSize(this.editorImage.getJSON())
			},
			element: elementChatImageId,
			extensions: [
				StarterKit,
				Underline,
				Highlight,
				Placeholder.configure({
					placeholder: `${placeholderString}`
				}),
				Extension.create({
					addKeyboardShortcuts: () => {
						return {
							'Enter': () => {
								const chatTextEditor = this.shadowRoot.getElementById('chatTextCaption')
								chatTextEditor.sendMessageFunc({
									type: 'image'
								})
								return true
							},
							'Shift-Enter': () => {
								if (this.isEnabledChatEnter) {
									this.editor.commands.first(() => [
										this.editor.commands.newlineInCode()
									])
								}
							}
						}
					}
				})
			]
		})

		this.editorGif = new Editor({
			onUpdate: () => {
				this.shadowRoot.getElementById('chatGifId').getMessageSize(this.editorGif.getJSON())
			},
			element: elementChatGifId,
			extensions: [
				StarterKit,
				Underline,
				Highlight,
				Placeholder.configure({
					placeholder: `${placeholderString}`
				}),
				Extension.create({
					addKeyboardShortcuts: () => {
						return {
							'Enter': () => {
								const chatTextEditor = this.shadowRoot.getElementById('chatGifId')
								chatTextEditor.sendMessageFunc({
									type: 'gif'
								})
								return true
							},
							'Shift-Enter': () => {
								if (this.isEnabledChatEnter) {
									this.editor.commands.first(() => [
										this.editor.commands.newlineInCode()
									])
								}
							}
						}
					}
				})
			]
		})

		this.editorAttachment = new Editor({
			onUpdate: () => {
				this.shadowRoot.getElementById('chatAttachmentId').getMessageSize(this.editorAttachment.getJSON())
			},
			element: elementChatAttachmentId,
			extensions: [
				StarterKit,
				Underline,
				Highlight,
				Placeholder.configure({
					placeholder: `${placeholderString}`
				}),
				Extension.create({
					addKeyboardShortcuts: () => {
						return {
							'Enter': () => {
								const chatTextEditor = this.shadowRoot.getElementById('chatAttachmentId')
								chatTextEditor.sendMessageFunc({
									type: 'attachment'
								})
								return true
							},
							'Shift-Enter': () => {
								if (this.isEnabledChatEnter) {
									this.editor.commands.first(() => [
										this.editor.commands.newlineInCode()
									])
								}
							}
						}
					}
				})
			]
		})

		this.editorFile = new Editor({
			onUpdate: () => {
				this.shadowRoot.getElementById('chatFileId').getMessageSize(this.editorFile.getJSON())
			},
			element: elementChatFileId,
			extensions: [
				StarterKit,
				Underline,
				Highlight,
				Placeholder.configure({
					placeholder: `${placeholderString}`
				}),
				Extension.create({
					addKeyboardShortcuts: () => {
						return {
							'Enter': () => {
								const chatTextEditor = this.shadowRoot.getElementById('chatFileId')
								chatTextEditor.sendMessageFunc({
									type: 'file'
								})
								return true
							},
							'Shift-Enter': () => {
								if (this.isEnabledChatEnter) {
									this.editor.commands.first(() => [
										this.editor.commands.newlineInCode()
									])
								}
							}
						}
					}
				})
			]
		})

		document.addEventListener('keydown', this.initialChat)
		document.addEventListener('paste', this.pasteImage)

		let callback = (entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {

					this.isPageVisible = true
					if (this.chatId) {
						window.parent.reduxStore.dispatch(window.parent.reduxAction.addChatLastSeen({
							key: this.chatId,
							timestamp: Date.now()
						}))

					}
				} else {
					this.isPageVisible = false
				}
			})
		}

		let options = {
			root: null,
			rootMargin: '0px',
			threshold: 0.5
		}

		// Create the observer with the callback function and options
		this.observer = new IntersectionObserver(callback, options)
		const mainContainer = this.shadowRoot.querySelector('.main-container')

		this.observer.observe(mainContainer)
	}

	disconnectedCallback() {
		super.disconnectedCallback()

		if (this.webSocket) {
			this.webSocket.close(1000, 'switch chat')
			this.webSocket = ''
		}

		if (this.webWorker) {
			this.webWorker.terminate()
		}

		if (this.webWorkerFile) {
			this.webWorkerFile.terminate()
		}

		if (this.webWorkerSortMessages) {
			this.webWorkerSortMessages.terminate()
		}

		if (this.editor) {
			this.editor.destroy()
		}

		if (this.editorImage) {
			this.editorImage.destroy()
		}

		if (this.editorGif) {
			this.editorGif.destroy()
		}

		if (this.editorAttachment) {
			this.editorAttachment.destroy()
		}

		if (this.editorFile) {
			this.editorFile.destroy()
		}

		if (this.observer) {
			this.observer.disconnect()
		}

		document.removeEventListener('keydown', this.initialChat)
		document.removeEventListener('paste', this.pasteImage)
	}

	initialChat(e) {
		if (this.editor && !this.editor.isFocused && this.currentEditor === '_chatEditorDOM' && !this.openForwardOpen && !this.openTipUser && !this.openGifModal) {
			// WARNING: Deprecated methods from KeyBoard Event
			if (e.code === "Space" || e.keyCode === 32 || e.which === 32) { /* empty */ } else if (inputKeyCodes.includes(e.keyCode)) {
				this.editor.commands.insertContent(e.key)
				this.editor.commands.focus('end')
			} else {
				this.editor.commands.focus('end')
			}
		}
	}

	async pasteImage(e) {
		const handleTransferIntoURL = (dataTransfer) => {
			try {
				const [firstItem] = dataTransfer.items
				const blob = firstItem.getAsFile()
				return blob
			} catch (error) { /* empty */ }
		}

		if (e.clipboardData) {
			const blobFound = handleTransferIntoURL(e.clipboardData)

			if (blobFound) {
				this.insertFile(blobFound)
				e.preventDefault()
				return
			} else {
				const item_list = await navigator.clipboard.read()

				let image_type

				const item = item_list.find(item =>
					item.types.some(type => {
						if (type.startsWith('image/')) {
							image_type = type
							return true
						}
					})
				)

				if (item) {
					try {
						const blob = item && await item.getType(image_type)
						let file = new File([blob], 'name', {
							type: image_type
						})
						this.insertFile(file)
						e.preventDefault()
					} catch (error) {
						console.error(error)
						let errorMsg = get("chatpage.cchange81")
						parentEpml.request('showSnackBar', `${errorMsg}`)
					}
				} else {
					return
				}
			}
		}
	}

	async goToRepliedMessage(message, clickedOnMessage) {
		const findMessage = this.shadowRoot.querySelector('chat-scroller').shadowRoot.getElementById(message.signature)

		if (findMessage) {
			findMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
			const findElement = findMessage.shadowRoot.querySelector('.message-parent')
			if (findElement) {
				findElement.classList.add('blink-bg')
				setTimeout(() => {
					findElement.classList.remove('blink-bg')
				}, 2000)
			}
			const chatScrollerElement = this.shadowRoot.querySelector('chat-scroller')
			if (chatScrollerElement && chatScrollerElement.disableFetching) {
				chatScrollerElement.disableFetching = false
			}
			return
		}

		const findOriginalMessage = this.shadowRoot.querySelector('chat-scroller').shadowRoot.getElementById(clickedOnMessage.signature)
		if (findOriginalMessage) {
			const messageClientRect = findOriginalMessage.getBoundingClientRect()
			this.isLoadingGoToRepliedMessage = {
				...this.isLoadingGoToRepliedMessage,
				loading: true,
				left: messageClientRect.left,
				top: messageClientRect.top,
				offsetHeight: findOriginalMessage.offsetHeight
			}

			await this.getOldMessageDynamic(0, clickedOnMessage.timestamp, message)
			await this.getUpdateComplete()

			const marginElements = Array.from(this.shadowRoot.querySelector('chat-scroller').shadowRoot.querySelectorAll('message-template'))
			const findMessage2 = marginElements.find((item) =>
					item.messageObj.signature === message.signature) || marginElements.find(
						(item) => item.messageObj.originalSignature === message.signature
					)
					|| marginElements.find((item) => item.messageObj.signature === message.originalSignature)
					|| marginElements.find((item) => item.messageObj.originalSignature === message.originalSignature)
			if (findMessage2) {
				findMessage2.scrollIntoView({ block: 'center' })
			}
			if (findMessage2) {
				this.isLoadingGoToRepliedMessage = {
					...this.isLoadingGoToRepliedMessage,
					loading: false
				}
				const findElement = findMessage2.shadowRoot.querySelector('.message-parent')
				if (findElement) {
					findElement.classList.add('blink-bg')
					setTimeout(() => {
						findElement.classList.remove('blink-bg')
					}, 2000)
				}

				const chatScrollerElement = this.shadowRoot.querySelector('chat-scroller')

				if (chatScrollerElement && chatScrollerElement.disableFetching) {
					chatScrollerElement.disableFetching = false
				}

				return
			}
			this.isLoadingGoToRepliedMessage = {
				...this.isLoadingGoToRepliedMessage,
				loading: false
			}
			let errorMsg = get("chatpage.cchange66")
			parentEpml.request('showSnackBar', `${errorMsg}`)
		}
	}

	async userSearch() {
		const nameValue = this.shadowRoot.getElementById('sendTo').value
		if (!nameValue) {
			this.userFound = []
			this.userFoundModalOpen = false
			this.loading = false
			return
		}
		try {
			const result = await parentEpml.request('apiCall', {
				type: 'api',
				url: `/names/${nameValue}`
			})
			if (result.error === 401) {
				this.userFound = []
				this.loading = false
			} else {
				this.userFound = [
					...this.userFound,
					result,
				]
			}
			this.userFoundModalOpen = true
		} catch (error) {
			this.loading = false
			let err4string = get("chatpage.cchange35")
			parentEpml.request('showSnackBar', `${err4string}`)
		}
	}

	setForwardProperties(forwardedMessage) {
		this.openForwardOpen = true
		this.forwardedMessage = forwardedMessage
	}

	async sendForwardMessage() {
		let parsedMessageObj = {}
		try {
			parsedMessageObj = JSON.parse(this.forwardedMessage)
		} catch (error) {
			parsedMessageObj = {}
		}

		try {
			const message = {
				...parsedMessageObj,
				type: 'forward'
			}
			delete message.reactions
			const stringifyMessageObject = JSON.stringify(message)
			this.sendMessage({ messageText: stringifyMessageObject, chatReference: undefined, isForward: true })
		} catch (error) { /* empty */ }
	}

	showLastMessageRefScroller(props) {
		this.lastMessageRefVisible = props
	}

	insertFile(file) {
		const acceptedFileExtension = [
			'zip', 'jar', 'gzip', 'exe', 'deb',
			'rar', 'dmg', 'pkg', '7z', 'gz', 'psd',
			'mp4', 'rpm', 'snap', 'AppImage'
		]

		const acceptedAttachmentExtension = [
			'pdf', 'txt', 'odt', 'ods', 'doc', 'html',
			'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'sh', 'log'
		]

		const fileExtension = file.name.split('.').pop()

		if (file.identifier) {
			this.imageFile = file
			this.currentEditor = 'newChat'
			this.editorImage.commands.setContent('')
			return
		} else if (file.type === 'image/gif') {
			this.gifFile = file
			this.currentEditor = 'newGifChat'
			this.editorGif.commands.setContent('')
			return
		} else if (file.type.includes('image')) {
			this.imageFile = file
			this.currentEditor = 'newChat'
			this.editorImage.commands.setContent('')
			return
		} else if (acceptedFileExtension.includes(fileExtension)) {
			this.appFile = file
			this.currentEditor = 'newFileChat'
			this.editorFile.commands.setContent('')
			return
		} else if (acceptedAttachmentExtension.includes(fileExtension)){
			this.attachment = file
			this.currentEditor = "newAttachmentChat"
			this.editorAttachment.commands.setContent('')
			return
		} else {
			this.resetChatEditor()
			parentEpml.request('showSnackBar', get("chatpage.cchange109"))
			return
		}
	}

	removeImage() {
		this.imageFile = null
		this.resetChatEditor()
		this.currentEditor = '_chatEditorDOM'
	}

	removeGif() {
		this.gifFile = null
		this.resetChatEditor()
		this.currentEditor = '_chatEditorDOM'
	}

	removeAttachment() {
		this.attachment = null
		this.resetChatEditor()
		this.currentEditor = '_chatEditorDOM'
	}

	removeAppFile() {
		this.appFile = null
		this.resetChatEditor()
		this.currentEditor = '_chatEditorDOM'
	}

	changeMsgInput(id) {
		this.chatMessageInput = this.shadowRoot.getElementById(id)
		this.initChatEditor()
	}

	async initUpdate() {
		if (this.webSocket) {
			this.webSocket.close(1000, 'switch chat')
			this.webSocket = ''
		}

		this.pageNumber = 1

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
		}

		setTimeout(() => {
			const isRecipient = this.chatId.includes('direct') === true ? true : false
			this.chatId.includes('direct') === true ? this.isReceipient = true : this.isReceipient = false
			this._chatId = this.chatId.split('/')[1]

			const mstring = get('chatpage.cchange114')
			const placeholder = isRecipient === true ? `Message ${this._chatId}` : `${mstring}`
			this.chatEditorPlaceholder = placeholder

			isRecipient ? getAddressPublicKey() : this.fetchChatMessages(this._chatId)
		}, 100)

		const isRecipient = this.chatId.includes('direct') === true ? true : false
		const groupId = this.chatId.split('/')[1]

		if (!isRecipient && groupId.toString() !== '0') {
			try {
				const getMembers = await parentEpml.request("apiCall", {
					type: "api",
					url: `/groups/members/${groupId}?onlyAdmins=false&limit=20&offset=0`
				})

				const getMembersAdmins = await parentEpml.request("apiCall", {
					type: "api",
					url: `/groups/members/${groupId}?onlyAdmins=true&limit=20`
				})

				const getGroupInfo = await parentEpml.request("apiCall", {
					type: "api",
					url: `/groups/${groupId}`
				})

				const getMembersAdminsWithName = (getMembersAdmins.members || []).map(async (member) => {
					let memberItem = member
					try {
						const name = await this.getName(member.member)
						memberItem = {
							address: member.member,
							name: name ? name : undefined
						}
					} catch (error) { /* empty */ }
					return memberItem
				})

				const membersAdminsWithName = await Promise.all(getMembersAdminsWithName)

				const getMembersWithName = (getMembers.members || []).map(async (member) => {
					let memberItem = member
					try {
						const name = await this.getName(member.member)
						memberItem = {
							address: member.member,
							name: name ? name : undefined
						}
					} catch (error) { /* empty */ }
					return memberItem
				})

				const membersWithName = await Promise.all(getMembersWithName)

				this.groupAdmin = membersAdminsWithName
				this.groupMembers = membersWithName
				this.groupInfo = getGroupInfo
			} catch (error) { /* empty */ }
		}
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

	async updated(changedProperties) {
		if (changedProperties && changedProperties.has('userLanguage')) {
			const userLang = changedProperties.get('userLanguage')
			if (userLang) {
				await new Promise(r => setTimeout(r, 100))
				this.chatEditorPlaceholder = this.isReceipient === true ? `Message ${this._chatId}` : `${get('chatpage.cchange114')}`
			}
		}

		if (changedProperties && changedProperties.has('isLoading')) {
			if (this.isLoading === true && this.currentEditor === '_chatEditorDOM' && this.editor && this.editor.setEditable) {
				this.editor.setEditable(false)
			}

			if (this.isLoading === false && this.currentEditor === '_chatEditorDOM' && this.editor && this.editor.setEditable) {
				this.editor.setEditable(true)
			}
		}

		if (changedProperties && changedProperties.has('chatId') && this.webSocket) {
			const previousChatId = changedProperties.get('chatId')

			this.isLoadingMessages = true
			this.initUpdate()

			if (previousChatId) {
				window.parent.reduxStore.dispatch(window.parent.reduxAction.addChatLastSeen({
					key: previousChatId,
					timestamp: Date.now()
				}))
			}
		}
	}

	shouldUpdate(changedProperties) {
		if (changedProperties.has('chatId')) {
			if (this.repliedToMessageObj) {
				this.closeRepliedToContainer()
				return true
			}

			if (this.editedMessageObj) {
				this.closeEditMessageContainer()
				return true
			}

			return true
		}

		if (changedProperties.has('setActiveChatHeadUrl')) {
			return false
		}

		if (changedProperties.has('setOpenPrivateMessage')) {
			return false
		}

		return true

	}

	async getName(recipient) {
		try {
			const getNames = await parentEpml.request("apiCall", {
				type: "api",
				url: `/names/address/${recipient}`
			})

			if (Array.isArray(getNames) && getNames.length > 0) {
				return getNames[0].name
			} else {
				return ''
			}

		} catch (error) {
			return ""
		}
	}

	async renderPlaceholder() {
		const getName = async (recipient) => {
			try {
				const getNames = await parentEpml.request("apiCall", {
					type: "api",
					url: `/names/address/${recipient}`
				})

				if (Array.isArray(getNames) && getNames.length > 0) {
					return getNames[0].name
				} else {
					return ''
				}

			} catch (error) {
				return ""
			}
		}

		let userName = ''

		if (this.isReceipient) {
			userName = await getName(this._chatId)
		}

		const mstring = get('chatpage.cchange114')
		const placeholder = this.isReceipient === true ? `Message ${userName ? userName : this._chatId}` : `${mstring}`

		return placeholder
	}

	renderChatScroller() {
		return html`
			<chat-scroller
				chatId=${this.chatId}
				.messages=${this.messagesRendered}
				.oldMessages=${this.oldMessages}
				.escapeHTML=${escape}
				.getOldMessage=${this.getOldMessage}
				.getAfterMessages=${this.getAfterMessages}
				.setRepliedToMessageObj=${(val) => this.setRepliedToMessageObj(val)}
				.setEditedMessageObj=${(val) => this.setEditedMessageObj(val)}
				.sendMessage=${(val) => this._sendMessage(val)}
				.sendMessageForward=${(messageText, typeMessage, chatReference, isForward, forwardParams) => this.sendMessage(messageText, typeMessage, chatReference, isForward, forwardParams)}
				.showLastMessageRefScroller=${(val) => this.showLastMessageRefScroller(val)}
				.emojiPicker=${this.emojiPicker}
				?isLoadingMessages=${this.isLoadingOldMessages}
				.setIsLoadingMessages=${(val) => this.setIsLoadingMessages(val)}
				.setForwardProperties=${(forwardedMessage) => this.setForwardProperties(forwardedMessage)}
				.setOpenPrivateMessage=${(val) => this.setOpenPrivateMessage(val)}
				.setOpenTipUser=${(val) => this.setOpenTipUser(val)}
				.setOpenUserInfo=${(val) => this.setOpenUserInfo(val)}
				.setUserName=${(val) => this.setUserName(val)}
				.setSelectedHead=${(val) => this.setSelectedHead(val)}
				?openTipUser=${this.openTipUser}
				.selectedHead=${this.selectedHead}
				.goToRepliedMessage=${(val, val2) => this.goToRepliedMessage(val, val2)}
				.updateMessageHash=${this.updateMessageHash}
				.clearUpdateMessageHashmap=${this.clearUpdateMessageHashmap}
				.messageQueue=${this.messageQueue}
				loggedInUserName=${this.loggedInUserName}
				loggedInUserAddress=${this.loggedInUserAddress}
			>
			</chat-scroller>
		`
	}

	setIsLoadingMessages(val) {
		this.isLoadingOldMessages = val
	}

	async getUpdateComplete() {
		await super.getUpdateComplete()
		const marginElements = Array.from(this.shadowRoot.querySelectorAll('chat-scroller'))
		await Promise.all(marginElements.map(el => el.updateComplete))
		return true
	}

	async getUpdateCompleteMessages() {
		await super.getUpdateComplete()
		const marginElements = Array.from(this.shadowRoot.querySelector('chat-scroller').shadowRoot.querySelectorAll('message-template'))
		await Promise.all(marginElements.map(el => el.updateComplete))
		return true
	}

	async getUpdateCompleteTextEditor() {
		await super.getUpdateComplete()
		const marginElements = Array.from(this.shadowRoot.querySelectorAll('chat-text-editor'))
		await Promise.all(marginElements.map(el => el.updateComplete))
		const marginElements2 = Array.from(this.shadowRoot.querySelectorAll('wrapper-modal'))
		await Promise.all(marginElements2.map(el => el.updateComplete))
		return true
	}

	updatePlaceholder(editor, text) {
		editor.extensionManager.extensions.forEach((extension) => {
			if (extension.name === "placeholder") {
				extension.options["placeholder"] = text
				editor.commands.focus('end')
			}
		})
	}

	async getOldMessageDynamic(limit, timestampClickedOnMessage, messageToGoTo) {
		const findMsg = await parentEpml.request("apiCall", {
			type: "api",
			url: `/chat/message/${messageToGoTo.originalSignature || messageToGoTo.signature}?encoding=BASE64`,
		})
		if (!findMsg) return null
		if (this.isReceipient) {
			const getInitialMessagesBefore = await parentEpml.request('apiCall', {
				type: 'api',
				url: `/chat/messages?involving=${window.parent.reduxStore.getState().app.selectedAddress.address}&involving=${this._chatId}&limit=${20}&reverse=true&before=${findMsg.timestamp}&haschatreference=false&encoding=BASE64`
			})
			const getInitialMessagesAfter = await parentEpml.request('apiCall', {
				type: 'api',
				url: `/chat/messages?involving=${window.parent.reduxStore.getState().app.selectedAddress.address}&involving=${this._chatId}&limit=${20}&reverse=false&after=${findMsg.timestamp - 1000}&haschatreference=false&encoding=BASE64`
			})
			const getInitialMessages = [...getInitialMessagesBefore, ...getInitialMessagesAfter]
			let decodeMsgs = []
			await new Promise((res, rej) => {
				this.webWorkerDecodeMessages.postMessage({ messages: getInitialMessages, isReceipient: this.isReceipient, _publicKey: this._publicKey, privateKey: window.parent.reduxStore.getState().app.selectedAddress.keyPair.privateKey })

				this.webWorkerDecodeMessages.onmessage = e => {
					decodeMsgs = e.data
					res()
				}

				this.webWorkerDecodeMessages.onerror = () => {
					rej()
				}
			})

			queue.push(() => replaceMessagesEdited({
				decodedMessages: decodeMsgs,
				parentEpml,
				isReceipient: this.isReceipient,
				decodeMessageFunc: this.decodeMessage,
				_publicKey: this._publicKey,
				addToUpdateMessageHashmap: this.addToUpdateMessageHashmap
			}))


			let list = [...decodeMsgs]

			await new Promise((res) => {
				this.webWorkerSortMessages.postMessage({ list })

				this.webWorkerSortMessages.onmessage = e => {
					list = e.data
					res()
				}
			})
			const lastMsg = list.at(-1)
			if (lastMsg) {
				const count = await parentEpml.request('apiCall', {
					type: 'api',
					url: `/chat/messages/count?after=${lastMsg.timestamp}&involving=${window.parent.reduxStore.getState().app.selectedAddress.address}&involving=${this._chatId}&limit=20&reverse=false`
				})
				this.messagesRendered = {
					messages: list,
					type: 'inBetween',
					message: messageToGoTo,
					count
				}
			}
			this.isLoadingOldMessages = false

		} else {
			const getInitialMessagesBefore = await parentEpml.request('apiCall', {
				type: 'api',
				url: `/chat/messages?txGroupId=${Number(this._chatId)}&limit=${20}&reverse=true&before=${findMsg.timestamp}&haschatreference=false&encoding=BASE64`
			})

			const getInitialMessagesAfter = await parentEpml.request('apiCall', {
				type: 'api',
				url: `/chat/messages?txGroupId=${Number(this._chatId)}&limit=${20}&reverse=false&after=${findMsg.timestamp - 1000}&haschatreference=false&encoding=BASE64`
			})

			const getInitialMessages = [...getInitialMessagesBefore, ...getInitialMessagesAfter]

			let decodeMsgs = []

			await new Promise((res, rej) => {
				this.webWorkerDecodeMessages.postMessage({ messages: getInitialMessages, isReceipient: this.isReceipient, _publicKey: this._publicKey, privateKey: window.parent.reduxStore.getState().app.selectedAddress.keyPair.privateKey })

				this.webWorkerDecodeMessages.onmessage = e => {
					decodeMsgs = e.data
					res()
				}

				this.webWorkerDecodeMessages.onerror = () => {
					rej()
				}
			})

			queue.push(() => replaceMessagesEdited({
				decodedMessages: decodeMsgs,
				parentEpml,
				isReceipient: this.isReceipient,
				decodeMessageFunc: this.decodeMessage,
				_publicKey: this._publicKey,
				addToUpdateMessageHashmap: this.addToUpdateMessageHashmap
			}))

			let list = [...decodeMsgs]

			await new Promise((res) => {
				this.webWorkerSortMessages.postMessage({ list })

				this.webWorkerSortMessages.onmessage = e => {
					list = e.data
					res()
				}
			})

			const lastMsg = list.at(-1)

			if (lastMsg) {
				const count = await parentEpml.request('apiCall', {
					type: 'api',
					url: `/chat/messages/count?after=${lastMsg.timestamp}&txGroupId=${Number(this._chatId)}&limit=20&reverse=false`
				})
				this.messagesRendered = {
					messages: list,
					type: 'inBetween',
					signature: messageToGoTo.signature,
					count
				}
			}
			this.isLoadingOldMessages = false
		}
	}

	async getOldMessage(scrollElement) {
		if (!scrollElement || !scrollElement.messageObj || !scrollElement.messageObj.timestamp) {
			this.messagesRendered = {
				messages: [],
				type: 'old',
				el: scrollElement
			}
			return
		}
		if (this.isReceipient) {
			const getInitialMessages = await parentEpml.request('apiCall', {
				type: 'api',
				url: `/chat/messages?involving=${window.parent.reduxStore.getState().app.selectedAddress.address}&involving=${this._chatId}&limit=${chatLimit}&reverse=true&before=${scrollElement.messageObj.timestamp}&haschatreference=false&encoding=BASE64`
			})
			let decodeMsgs = []
			await new Promise((res, rej) => {
				this.webWorkerDecodeMessages.postMessage({ messages: getInitialMessages, isReceipient: this.isReceipient, _publicKey: this._publicKey, privateKey: window.parent.reduxStore.getState().app.selectedAddress.keyPair.privateKey })

				this.webWorkerDecodeMessages.onmessage = e => {
					decodeMsgs = e.data
					res()
				}

				this.webWorkerDecodeMessages.onerror = () => {
					rej()
				}
			})

			queue.push(() => replaceMessagesEdited({
				decodedMessages: decodeMsgs,
				parentEpml,
				isReceipient: this.isReceipient,
				decodeMessageFunc: this.decodeMessage,
				_publicKey: this._publicKey,
				addToUpdateMessageHashmap: this.addToUpdateMessageHashmap
			}))

			let list = [...decodeMsgs]

			this.messagesRendered = {
				messages: list,
				type: 'old',
				el: scrollElement
			}

			this.isLoadingOldMessages = false
			await this.getUpdateComplete()
			const marginElements = Array.from(this.shadowRoot.querySelector('chat-scroller').shadowRoot.querySelectorAll('message-template'))

			const findElement = marginElements.find((item) => item.messageObj.signature === scrollElement.messageObj.signature)

			if (findElement) {
				findElement.scrollIntoView({ behavior: 'auto', block: 'center' })
			}
		} else {
			const getInitialMessages = await parentEpml.request('apiCall', {
				type: 'api',
				url: `/chat/messages?txGroupId=${Number(this._chatId)}&limit=${chatLimit}&reverse=true&before=${scrollElement.messageObj.timestamp}&haschatreference=false&encoding=BASE64`
			})

			let decodeMsgs = []

			await new Promise((res, rej) => {
				this.webWorkerDecodeMessages.postMessage({ messages: getInitialMessages, isReceipient: this.isReceipient, _publicKey: this._publicKey, privateKey: window.parent.reduxStore.getState().app.selectedAddress.keyPair.privateKey })

				this.webWorkerDecodeMessages.onmessage = e => {
					decodeMsgs = e.data
					res()
				}

				this.webWorkerDecodeMessages.onerror = () => {
					rej()
				}
			})

			queue.push(() => replaceMessagesEdited({
				decodedMessages: decodeMsgs,
				parentEpml,
				isReceipient: this.isReceipient,
				decodeMessageFunc: this.decodeMessage,
				_publicKey: this._publicKey,
				addToUpdateMessageHashmap: this.addToUpdateMessageHashmap
			}))

			let list = [...decodeMsgs]

			this.messagesRendered = {
				messages: list,
				type: 'old',
				el: scrollElement
			}
			// this.isLoadingOldMessages = false
			await this.getUpdateComplete()
			const marginElements = Array.from(this.shadowRoot.querySelector('chat-scroller').shadowRoot.querySelectorAll('message-template'))
			const findElement = marginElements.find((item) => item.messageObj.signature === scrollElement.messageObj.signature)

			if (findElement) {
				findElement.scrollIntoView({ behavior: 'auto', block: 'center' })
			}
		}
	}

	async getAfterMessages(scrollElement) {
		if (!scrollElement || !scrollElement.messageObj || !scrollElement.messageObj.timestamp) {
			this.messagesRendered = {
				messages: [],
				type: 'new',
			}
			return
		}
		const timestamp = scrollElement.messageObj.timestamp

		if (this.isReceipient) {
			const getInitialMessages = await parentEpml.request('apiCall', {
				type: 'api',
				url: `/chat/messages?involving=${window.parent.reduxStore.getState().app.selectedAddress.address}&involving=${this._chatId}&limit=${chatLimit}&reverse=false&after=${timestamp}&haschatreference=false&encoding=BASE64`
			})

			let decodeMsgs = []
			await new Promise((res, rej) => {
				this.webWorkerDecodeMessages.postMessage({ messages: getInitialMessages, isReceipient: this.isReceipient, _publicKey: this._publicKey, privateKey: window.parent.reduxStore.getState().app.selectedAddress.keyPair.privateKey })

				this.webWorkerDecodeMessages.onmessage = e => {
					decodeMsgs = e.data
					res()
				}

				this.webWorkerDecodeMessages.onerror = () => {
					rej()
				}
			})

			queue.push(() => replaceMessagesEdited({
				decodedMessages: decodeMsgs,
				parentEpml,
				isReceipient: this.isReceipient,
				decodeMessageFunc: this.decodeMessage,
				_publicKey: this._publicKey,
				addToUpdateMessageHashmap: this.addToUpdateMessageHashmap
			}))

			let list = [...decodeMsgs]

			await new Promise((res) => {
				this.webWorkerSortMessages.postMessage({ list })
				this.webWorkerSortMessages.onmessage = e => {
					list = e.data
					res()
				}
			})

			this.messagesRendered = {
				messages: list,
				type: 'new'
			}


			this.isLoadingOldMessages = false
			await this.getUpdateComplete()
			const marginElements = Array.from(this.shadowRoot.querySelector('chat-scroller').shadowRoot.querySelectorAll('message-template'))

			const findElement = marginElements.find((item) => item.messageObj.signature === scrollElement.messageObj.signature)

			if (findElement) {
				findElement.scrollIntoView({ behavior: 'auto', block: 'center' })
			}
		} else {
			const getInitialMessages = await parentEpml.request('apiCall', {
				type: 'api',
				url: `/chat/messages?txGroupId=${Number(this._chatId)}&limit=${chatLimit}&reverse=false&after=${timestamp}&haschatreference=false&encoding=BASE64`
			})
			let decodeMsgs = []
			await new Promise((res, rej) => {
				this.webWorkerDecodeMessages.postMessage({ messages: getInitialMessages, isReceipient: this.isReceipient, _publicKey: this._publicKey, privateKey: window.parent.reduxStore.getState().app.selectedAddress.keyPair.privateKey })

				this.webWorkerDecodeMessages.onmessage = e => {
					decodeMsgs = e.data
					res()
				}

				this.webWorkerDecodeMessages.onerror = () => {
					rej()
				}
			})

			queue.push(() => replaceMessagesEdited({
				decodedMessages: decodeMsgs,
				parentEpml,
				isReceipient: this.isReceipient,
				decodeMessageFunc: this.decodeMessage,
				_publicKey: this._publicKey,
				addToUpdateMessageHashmap: this.addToUpdateMessageHashmap
			}))

			let list = [...decodeMsgs]

			await new Promise((res) => {
				this.webWorkerSortMessages.postMessage({ list })
				this.webWorkerSortMessages.onmessage = e => {
					list = e.data
					res()
				}
			})

			this.messagesRendered = {
				messages: list,
				type: 'new'
			}

			this.isLoadingOldMessages = false
			await this.getUpdateComplete()
			const marginElements = Array.from(this.shadowRoot.querySelector('chat-scroller').shadowRoot.querySelectorAll('message-template'))
			const findElement = marginElements.find((item) => item.messageObj.signature === scrollElement.messageObj.signature)
			if (findElement) {
				findElement.scrollIntoView({ behavior: 'auto', block: 'center' })
			}
		}
	}

	async addToUpdateMessageHashmap(array) {
		const newObj = {}

		array.forEach((item) => {
			const signature = item.originalSignature || item.signature
			newObj[signature] = item
		})

		this.updateMessageHash = {
			...this.updateMessageHash,
			...newObj
		}

		this.requestUpdate()
		await this.getUpdateComplete()
	}

	async clearUpdateMessageHashmap() {
		this.updateMessageHash = {}
		this.requestUpdate()
	}

	findContent(identifier, data) {
		const [type, id] = identifier.split('/')

		if (type === 'group') {
			for (let group of data.groups) {
				if (group.groupId === parseInt(id, 10)) {
					return group
				}
			}
		} else if (type === 'direct') {
			for (let direct of data.direct) {
				if (direct.address === id) {
					return direct
				}
			}
		}

		return null
	}

	async processMessages(messages, isInitial, isUnread, count) {
		const isReceipient = this.chatId.includes('direct')
		let decodedMessages = []

		if (!this.webWorkerDecodeMessages) {
			this.webWorkerDecodeMessages = new WebWorkerDecodeMessages()
		}

		if (!this.webWorkerSortMessages) {
			this.webWorkerSortMessages = new WebWorkerSortMessages()
		}

		await new Promise((res, rej) => {
			this.webWorkerDecodeMessages.postMessage({ messages: messages, isReceipient: this.isReceipient, _publicKey: this._publicKey, privateKey: window.parent.reduxStore.getState().app.selectedAddress.keyPair.privateKey })

			this.webWorkerDecodeMessages.onmessage = e => {
				decodedMessages = e.data
				res()
			}

			this.webWorkerDecodeMessages.onerror = () => {
				rej()
			}
		})

		if (isInitial) {
			this.chatEditorPlaceholder = await this.renderPlaceholder()

			try {
				queue.push(() => replaceMessagesEdited({
					decodedMessages: decodedMessages,
					parentEpml,
					isReceipient: isReceipient,
					decodeMessageFunc: this.decodeMessage,
					_publicKey: this._publicKey,
					addToUpdateMessageHashmap: this.addToUpdateMessageHashmap
				}))
			} catch (error) {
				console.log({ error })
			}

			let list = decodedMessages

			await new Promise((res) => {
				this.webWorkerSortMessages.postMessage({ list })
				this.webWorkerSortMessages.onmessage = e => {
					list = e.data
					res()
				}
			})

			this._messages = list

			// TODO: Determine number of initial messages by screen height...
			// this.messagesRendered = this._messages
			const lastReadMessageTimestamp = this.lastReadMessageTimestamp

			if (isUnread) {
				this.messagesRendered = {
					messages: this._messages,
					type: 'initialLastSeen',
					lastReadMessageTimestamp,
					count
				}

				window.parent.reduxStore.dispatch(window.parent.reduxAction.addChatLastSeen({
					key: this.chatId,
					timestamp: Date.now()
				}))
			} else {
				this.messagesRendered = {
					messages: this._messages,
					type: 'initial'
				}
			}

			this.isLoadingMessages = false

			setTimeout(() => this.downElementObserver(), 500)
		} else {
			queue.push(() => replaceMessagesEdited({
				decodedMessages: decodedMessages,
				parentEpml,
				isReceipient: isReceipient,
				decodeMessageFunc: this.decodeMessage,
				_publicKey: this._publicKey,
				isNotInitial: true,
				addToUpdateMessageHashmap: this.addToUpdateMessageHashmap
			}))

			const renderEachMessage = decodedMessages.map(async (msg) => {
				await this.renderNewMessage(msg)
			})

			await Promise.all(renderEachMessage)

			if (this.chatId && this.isPageVisible) {
				window.parent.reduxStore.dispatch(window.parent.reduxAction.addChatLastSeen({
					key: this.chatId,
					timestamp: Date.now()
				}))

			}
		}
	}

	// set replied to message in chat editor
	setRepliedToMessageObj(messageObj) {
		this.editor.commands.focus('end')
		this.repliedToMessageObj = { ...messageObj }
		this.editedMessageObj = null
		this.requestUpdate()
	}

	// set edited message in chat editor
	setEditedMessageObj(messageObj) {
		this.editor.commands.focus('end')
		this.editedMessageObj = { ...messageObj }
		this.repliedToMessageObj = null
		this.requestUpdate()
	}

	closeEditMessageContainer() {
		this.editedMessageObj = null
		this.isEditMessageOpen = !this.isEditMessageOpen
		this.editor.commands.setContent('')
	}

	closeRepliedToContainer() {
		this.repliedToMessageObj = null
		this.requestUpdate()
	}

	/**
	* New Message Template implementation, takes in a message object.
	* @param { Object } messageObj
	* @property id or index
	* @property sender and other info..
	*/
	async renderNewMessage(newMessage) {
		if (newMessage.chatReference) {
			this.messagesRendered = {
				messages: [newMessage],
				type: 'update',
			}
			return
		}

		let viewElement = this.shadowRoot.querySelector('chat-scroller')

		if (viewElement) {
			viewElement = viewElement.shadowRoot.getElementById('viewElement')
		} else {
			viewElement = null
		}

		if (newMessage.sender === this.selectedAddress.address) {
			this.messagesRendered = {
				messages: [newMessage],
				type: 'newComingInAuto',
			}

			await this.getUpdateComplete()

			// viewElement.scrollTop = viewElement.scrollHeight
		} else if (this.isUserDown) {
			this.messagesRendered = {
				messages: [newMessage],
				type: 'newComingInAuto',
			}

			// Append the message and scroll to the bottom if user is down the page
			// this.messagesRendered = [...this.messagesRendered, newMessage]
			await this.getUpdateComplete()

			if (viewElement) {
				viewElement.scrollTop = viewElement.scrollHeight
			}

		} else {
			this.messagesRendered = {
				messages: [newMessage],
				type: 'newComingInAuto',
			}

			await this.getUpdateComplete()

			this.showNewMessageBar()
		}
	}

	/**
	 *  Decode Message Method. Takes in a message object and returns a decoded message object
	 * @param {Object} encodedMessageObj
	 *
	 */
	decodeMessage(encodedMessageObj, isReceipient, _publicKey) {
		let isReceipientVar
		let _publicKeyVar

		try {
			isReceipientVar = this.isReceipient === undefined ? isReceipient : this.isReceipient
			_publicKeyVar = this._publicKey === undefined ? _publicKey : this._publicKey
		} catch (error) {
			isReceipientVar = isReceipient
			_publicKeyVar = _publicKey
		}

		let decodedMessageObj = {}

		if (isReceipientVar === true) {
			// direct chat
			if (encodedMessageObj.isEncrypted === true && _publicKeyVar.hasPubKey === true && encodedMessageObj.data) {
				let decodedMessage = window.parent.decryptChatMessageBase64(encodedMessageObj.data, window.parent.reduxStore.getState().app.selectedAddress.keyPair.privateKey, _publicKeyVar.key, encodedMessageObj.reference)
				decodedMessageObj = { ...encodedMessageObj, decodedMessage }
			} else if (encodedMessageObj.isEncrypted === false && encodedMessageObj.data) {
				let decodedMessage = window.parent.Base64.decode(encodedMessageObj.data)
				decodedMessageObj = { ...encodedMessageObj, decodedMessage }
			} else {
				decodedMessageObj = { ...encodedMessageObj, decodedMessage: "Cannot Decrypt Message!" }
			}
		} else {
			// group chat
			let decodedMessage = window.parent.Base64.decode(encodedMessageObj.data)
			decodedMessageObj = { ...encodedMessageObj, decodedMessage }
		}

		return decodedMessageObj
	}

	async fetchChatMessages(chatId) {
		const initDirect = async (cid, noInitial) => {
			let timeoutId
			let initial = 0

			let directSocketTimeout

			let myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
			let nodeUrl = myNode.domain + ":" + myNode.port

			let directSocketLink

			if (window.parent.location.protocol === "https:") {
				directSocketLink = `wss://${nodeUrl}/websockets/chat/messages?involving=${window.parent.reduxStore.getState().app.selectedAddress.address}&involving=${cid}&encoding=BASE64&limit=1`
			} else {
				// Fallback to http
				directSocketLink = `ws://${nodeUrl}/websockets/chat/messages?involving=${window.parent.reduxStore.getState().app.selectedAddress.address}&involving=${cid}&encoding=BASE64&limit=1`
			}

			this.webSocket = new WebSocket(directSocketLink)

			// Open Connection
			this.webSocket.onopen = () => {
				setTimeout(pingDirectSocket, 50)
			}

			// Message Event
			this.webSocket.onmessage = async (e) => {
				if (e.data === 'pong') {
					clearTimeout(timeoutId)
					directSocketTimeout = setTimeout(pingDirectSocket, 45000)
					return
				}

				if (initial === 0) {
					this.lastReadMessageTimestamp = await chatLastSeen.getItem(this.chatId) || 0
					if (noInitial) return
					let getInitialMessages = []
					let count = 0
					let isUnread = false

					const chatId = this.chatId
					const findContent = this.chatHeads.find((item) => item.url === chatId)
					const chatInfoTimestamp = findContent.timestamp || 0
					const lastReadMessageTimestamp = this.lastReadMessageTimestamp


					if (lastReadMessageTimestamp && chatInfoTimestamp) {
						if (lastReadMessageTimestamp < chatInfoTimestamp) {
							isUnread = true
						}
					}
					if (isUnread) {
						const getInitialMessagesBefore = await parentEpml.request('apiCall', {
							type: 'api',
							url: `/chat/messages?involving=${window.parent.reduxStore.getState().app.selectedAddress.address}&involving=${cid}&limit=${chatLimitHalf}&reverse=true&before=${lastReadMessageTimestamp}&haschatreference=false&encoding=BASE64`
						})
						const getInitialMessagesAfter = await parentEpml.request('apiCall', {
							type: 'api',
							url: `/chat/messages?involving=${window.parent.reduxStore.getState().app.selectedAddress.address}&involving=${cid}&limit=${chatLimitHalf}&reverse=false&after=${lastReadMessageTimestamp - 1000}&haschatreference=false&encoding=BASE64`
						})
						getInitialMessages = [...getInitialMessagesBefore, ...getInitialMessagesAfter]
						const lastMessage = getInitialMessagesAfter.at(-1)
						if (lastMessage) {
							count = await parentEpml.request('apiCall', {
								type: 'api',
								url: `/chat/messages/count?after=${lastMessage.timestamp}&involving=${window.parent.reduxStore.getState().app.selectedAddress.address}&involving=${cid}&limit=20&reverse=false`
							})
						}
					} else {
						getInitialMessages = await parentEpml.request('apiCall', {
							type: 'api',
							url: `/chat/messages?involving=${window.parent.reduxStore.getState().app.selectedAddress.address}&involving=${cid}&limit=${chatLimit}&reverse=true&haschatreference=false&encoding=BASE64`
						})
					}



					this.processMessages(getInitialMessages, true, isUnread, count)

					initial = initial + 1

				} else {
					try {
						if (e.data) {
							this.processMessages(JSON.parse(e.data), false)
						}
					} catch (error) { /* empty */ }
				}
			}

			// Closed Event
			this.webSocket.onclose = (e) => {
				clearTimeout(directSocketTimeout)

				if (e.reason === 'switch chat') return

				restartDirectWebSocket()
			}

			// Error Event
			this.webSocket.onerror = () => {
				clearTimeout(directSocketTimeout)
			}

			const pingDirectSocket = () => {
				this.webSocket.send('ping')
				timeoutId = setTimeout(() => {
					this.webSocket.close()
					clearTimeout(directSocketTimeout)
				}, 5000)
			}
		}

		const restartDirectWebSocket = () => {
			const noInitial = true
			setTimeout(() => initDirect(chatId, noInitial), 50)
		}

		const restartGroupWebSocket = () => {
			const noInitial = true
			let groupChatId = Number(chatId)
			setTimeout(() => initGroup(groupChatId, noInitial), 50)
		}

		const initGroup = (gId, noInitial) => {
			let timeoutId
			let groupId = Number(gId)

			let initial = 0
			let count = 0
			let groupSocketTimeout

			let myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
			let nodeUrl = myNode.domain + ":" + myNode.port

			let groupSocketLink

			if (window.parent.location.protocol === "https:") {
				groupSocketLink = `wss://${nodeUrl}/websockets/chat/messages?txGroupId=${groupId}&encoding=BASE64&limit=1`
			} else {
				// Fallback to http
				groupSocketLink = `ws://${nodeUrl}/websockets/chat/messages?txGroupId=${groupId}&encoding=BASE64&limit=1`
			}

			this.webSocket = new WebSocket(groupSocketLink)

			// Open Connection
			this.webSocket.onopen = () => {
				setTimeout(pingGroupSocket, 50)
			}

			// Message Event
			this.webSocket.onmessage = async (e) => {
				if (e.data === 'pong') {
					clearTimeout(timeoutId)
					groupSocketTimeout = setTimeout(pingGroupSocket, 45000)
					return
				}
				if (initial === 0) {
					this.lastReadMessageTimestamp = await chatLastSeen.getItem(this.chatId) || 0
					if (noInitial) return
					let getInitialMessages = []
					const lastReadMessageTimestamp = this.lastReadMessageTimestamp

					let isUnread = false

					const chatId = this.chatId
					const findContent = this.chatHeads.find((item) => item.url === chatId)
					const chatInfoTimestamp = findContent.timestamp || 0

					if (lastReadMessageTimestamp && chatInfoTimestamp) {
						if (lastReadMessageTimestamp < chatInfoTimestamp) {
							isUnread = true
						}
					}
					if (isUnread) {
						const getInitialMessagesBefore = await parentEpml.request('apiCall', {
							type: 'api',
							url: `/chat/messages?txGroupId=${groupId}&limit=${chatLimitHalf}&reverse=true&before=${lastReadMessageTimestamp}&haschatreference=false&encoding=BASE64`
						})
						const getInitialMessagesAfter = await parentEpml.request('apiCall', {
							type: 'api',
							url: `/chat/messages?txGroupId=${groupId}&limit=${chatLimitHalf}&reverse=false&after=${lastReadMessageTimestamp - 1000}&haschatreference=false&encoding=BASE64`
						})
						getInitialMessages = [...getInitialMessagesBefore, ...getInitialMessagesAfter]
						const lastMessage = getInitialMessagesAfter.at(-1)
						if (lastMessage) {
							count = await parentEpml.request('apiCall', {
								type: 'api',
								url: `/chat/messages/count?after=${lastMessage.timestamp}&txGroupId=${groupId}&limit=20&reverse=false`
							})
						}

					} else {
						getInitialMessages = await parentEpml.request('apiCall', {
							type: 'api',
							url: `/chat/messages?txGroupId=${groupId}&limit=${chatLimit}&reverse=true&haschatreference=false&encoding=BASE64`
						})
					}

					this.processMessages(getInitialMessages, true, isUnread, count)

					initial = initial + 1
				} else {
					try {
						if (e.data) {
							this.processMessages(JSON.parse(e.data), false)
						}
					} catch (error) { /* empty */ }
				}
			}

			// Closed Event
			this.webSocket.onclose = (e) => {
				clearTimeout(groupSocketTimeout)
				if (e.reason === 'switch chat') return
				restartGroupWebSocket()
			}

			// Error Event
			this.webSocket.onerror = () => {
				clearTimeout(groupSocketTimeout)
				this.webSocket.close()
			}

			const pingGroupSocket = () => {
				this.webSocket.send('ping')
				timeoutId = setTimeout(() => {
					this.webSocket.close()
					clearTimeout(groupSocketTimeout)
				}, 5000) // Close the WebSocket connection if no pong message is received within 5 seconds.
			}
		}

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

	resetChatEditor() {
		if (this.currentEditor === '_chatEditorDOM') {
			this.editor.commands.setContent('')
		}

		if (this.currentEditor === 'newChat') {
			this.editorImage.commands.setContent('')
		}

		if (this.currentEditor === 'newGifChat') {
			this.editorGif.commands.setContent('')
		}

		if (this.currentEditor === 'newFileChat') {
			this.editorAttachment.commands.setContent('')
		}

		if (this.currentEditor === 'newAttachmentChat') {
			this.editorAttachment.commands.setContent('')
		}
	}

	async _sendMessage(outSideMsg, msg, messageQueue) {
		const _chatId = this._chatId
		const isReceipient = this.isReceipient
		const str = "iVBORw0KGgoAAAANSUhEUgAAAsAAAAGMAQMAAADuk4YmAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAADlJREFUeF7twDEBAAAAwiD7p7bGDlgYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAGJrAABgPqdWQAAAABJRU5ErkJggg=="

		let _publicKey = this._publicKey

		try {
			if (this.isReceipient) {
				let hasPublicKey = true
				if (!_publicKey.hasPubKey) {
					hasPublicKey = false
					try {
						const res = await parentEpml.request('apiCall', {
							type: 'api',
							url: `/addresses/publickey/${this.selectedAddress.address}`
						})
						if (res.error === 102) {
							_publicKey.key = ''
							_publicKey.hasPubKey = false
						} else if (res !== false) {
							_publicKey.key = res
							_publicKey.hasPubKey = true
							hasPublicKey = true
						} else {
							_publicKey.key = ''
							_publicKey.hasPubKey = false
						}
					} catch (error) { /* empty */ }

					if (!hasPublicKey || !_publicKey.hasPubKey) {
						let err4string = get("chatpage.cchange39")
						parentEpml.request('showSnackBar', `${err4string}`)
						return
					}

				}
			}

			// have params to determine if it's a reply or not
			// have variable to determine if it's a response, holds signature in constructor
			// need original message signature
			// need whole original message object, transform the data and put it in local storage
			// create new var called repliedToData and use that to modify the UI
			// find specific object property in local

			let typeMessage = 'regular'

			const trimmedMessage = msg

			const getName = async (recipient) => {
				try {
					const getNames = await parentEpml.request("apiCall", {
						type: "api",
						url: `/names/address/${recipient}`
					})

					if (Array.isArray(getNames) && getNames.length > 0) {
						return getNames[0].name
					} else {
						return ''
					}

				} catch (error) {
					return ''
				}
			}

			if (outSideMsg && outSideMsg.type === 'delete') {
				this.isDeletingImage = true

				let userName
				let identifier

				userName = outSideMsg.name
				identifier = outSideMsg.identifier

				if (this.webWorkerFile) {
					this.webWorkerFile.terminate()
					this.webWorkerFile = null
				}

				this.webWorkerFile = new WebWorkerFile()

				const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
					const byteCharacters = atob(b64Data)
					const byteArrays = []

					for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
						const slice = byteCharacters.slice(offset, offset + sliceSize)

						const byteNumbers = new Array(slice.length)
						for (let i = 0; i < slice.length; i++) {
							byteNumbers[i] = slice.charCodeAt(i)
						}

						const byteArray = new Uint8Array(byteNumbers)
						byteArrays.push(byteArray)
					}

					const blob = new Blob(byteArrays, { type: contentType })
					return blob
				}

				const blob = b64toBlob(str, 'image/png')

				let compressedFile = ''

				await new Promise(resolve => {
					new Compressor(blob, {
						quality: 0.6,
						maxWidth: 500,
						success(result) {
							const file = new File([result], "name", {
								type: 'image/png'
							})

							compressedFile = file
							resolve()
						},
						error() {
						},
					})
				})

				const arbitraryFeeData = await modalHelper.getArbitraryFee()

				const res = await modalHelper.showModalAndWaitPublish({
					feeAmount: arbitraryFeeData.feeToShow
				})

				if (res.action !== 'accept') throw new Error('User declined publish')

				try {
					await publishData({
						registeredName: userName,
						file: compressedFile,
						service: 'QCHAT_IMAGE',
						identifier: identifier,
						parentEpml,
						metaData: undefined,
						uploadType: 'file',
						selectedAddress: this.selectedAddress,
						worker: this.webWorkerFile,
						withFee: true,
						feeAmount: arbitraryFeeData.fee
					})

					this.isDeletingImage = false
				} catch (error) {
					this.isLoading = false
					return
				}

				typeMessage = 'edit'

				let chatReference = outSideMsg.editedMessageObj.signature

				if (outSideMsg.editedMessageObj.chatReference) {
					chatReference = outSideMsg.editedMessageObj.chatReference
				}

				let message = ''

				try {
					const parsedMessageObj = JSON.parse(outSideMsg.editedMessageObj.decodedMessage)
					message = parsedMessageObj
				} catch (error) {
					message = outSideMsg.editedMessageObj.decodedMessage
				}

				const messageObject = {
					...message,
					isImageDeleted: true
				}

				const stringifyMessageObject = JSON.stringify(messageObject)

				return this.sendMessage({ messageText: stringifyMessageObject, typeMessage, chatReference, isForward: false, isReceipient, _chatId, _publicKey, messageQueue })
			} else if (outSideMsg && outSideMsg.type === 'deleteGif') {
				this.isDeletingGif = true

				let userName
				let identifier

				userName = outSideMsg.name
				identifier = outSideMsg.identifier

				if (this.webWorkerFile) {
					this.webWorkerFile.terminate()
					this.webWorkerFile = null
				}

				this.webWorkerFile = new WebWorkerFile()

				const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
					const byteCharacters = atob(b64Data)
					const byteArrays = []

					for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
						const slice = byteCharacters.slice(offset, offset + sliceSize)

						const byteNumbers = new Array(slice.length)
						for (let i = 0; i < slice.length; i++) {
							byteNumbers[i] = slice.charCodeAt(i)
						}

						const byteArray = new Uint8Array(byteNumbers)
						byteArrays.push(byteArray)
					}

					const blob = new Blob(byteArrays, { type: contentType })
					return blob
				}

				const blob = b64toBlob(str, 'image/png')

				let compressedFile = ''

				await new Promise(resolve => {
					new Compressor(blob, {
						quality: 0.6,
						maxWidth: 500,
						success(result) {
							const file = new File([result], "name", {
								type: 'image/png'
							})

							compressedFile = file
							resolve()
						},
						error() {
						},
					})
				})

				const arbitraryFeeData = await modalHelper.getArbitraryFee()

				const res = await modalHelper.showModalAndWaitPublish({
					feeAmount: arbitraryFeeData.feeToShow
				})

				if (res.action !== 'accept') throw new Error('User declined publish')

				try {
					await publishData({
						registeredName: userName,
						file: compressedFile,
						service: 'IMAGE',
						identifier: identifier,
						parentEpml,
						metaData: undefined,
						uploadType: 'file',
						selectedAddress: this.selectedAddress,
						worker: this.webWorkerFile,
						withFee: true,
						feeAmount: arbitraryFeeData.fee
					})

					this.isDeletingGif = false
				} catch (error) {
					this.isLoading = false
					return
				}

				typeMessage = 'edit'

				let chatReference = outSideMsg.editedMessageObj.signature

				if (outSideMsg.editedMessageObj.chatReference) {
					chatReference = outSideMsg.editedMessageObj.chatReference
				}

				let message = ''

				try {
					const parsedMessageObj = JSON.parse(outSideMsg.editedMessageObj.decodedMessage)
					message = parsedMessageObj

				} catch (error) {
					message = outSideMsg.editedMessageObj.decodedMessage
				}

				const messageObject = {
					...message,
					isGifDeleted: true
				}

				const stringifyMessageObject = JSON.stringify(messageObject)

				return this.sendMessage({ messageText: stringifyMessageObject, typeMessage, chatReference, isForward: false, isReceipient, _chatId, _publicKey, messageQueue })
			} else if (outSideMsg && outSideMsg.type === 'deleteAttachment') {
				this.isDeletingAttachment = true

				let userName
				let identifier

				userName = outSideMsg.name
				identifier = outSideMsg.identifier

				if (this.webWorkerFile) {
					this.webWorkerFile.terminate()
					this.webWorkerFile = null
				}

				this.webWorkerFile = new WebWorkerFile()

				const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
					const byteCharacters = atob(b64Data)
					const byteArrays = []

					for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
						const slice = byteCharacters.slice(offset, offset + sliceSize)

						const byteNumbers = new Array(slice.length)
						for (let i = 0; i < slice.length; i++) {
							byteNumbers[i] = slice.charCodeAt(i)
						}

						const byteArray = new Uint8Array(byteNumbers)
						byteArrays.push(byteArray)
					}

					const blob = new Blob(byteArrays, { type: contentType })
					return blob
				}

				const blob = b64toBlob(str, 'image/png')

				let compressedFile = ''

				await new Promise(resolve => {
					new Compressor(blob, {
						quality: 0.6,
						maxWidth: 500,
						success(result) {
							const file = new File([result], "name", {
								type: 'image/png'
							})

							compressedFile = file
							resolve()
						},
						error() {
						},
					})
				})

				const arbitraryFeeData = await modalHelper.getArbitraryFee()

				const res = await modalHelper.showModalAndWaitPublish({
					feeAmount: arbitraryFeeData.feeToShow
				})

				if (res.action !== 'accept') throw new Error('User declined publish')

				try {
					await publishData({
						registeredName: userName,
						file: compressedFile,
						service: 'ATTACHMENT',
						identifier: identifier,
						parentEpml,
						metaData: undefined,
						uploadType: 'file',
						selectedAddress: this.selectedAddress,
						worker: this.webWorkerFile,
						withFee: true,
						feeAmount: arbitraryFeeData.fee
					})

					this.isDeletingAttachment = false
				} catch (error) {
					this.isLoading = false
					return
				}

				typeMessage = 'edit'

				let chatReference = outSideMsg.editedMessageObj.signature

				if (outSideMsg.editedMessageObj.chatReference) {
					chatReference = outSideMsg.editedMessageObj.chatReference
				}

				let message = ''

				try {
					const parsedMessageObj = JSON.parse(outSideMsg.editedMessageObj.decodedMessage)
					message = parsedMessageObj

				} catch (error) {
					message = outSideMsg.editedMessageObj.decodedMessage
				}

				const messageObject = {
					...message,
					isAttachmentDeleted: true
				}

				const stringifyMessageObject = JSON.stringify(messageObject)

				return this.sendMessage({ messageText: stringifyMessageObject, typeMessage, chatReference, isForward: false, isReceipient, _chatId, _publicKey, messageQueue })
			} else if (outSideMsg && outSideMsg.type === 'deleteFile') {
				this.isDeletingAppFile = true

				let userName
				let identifier

				userName = outSideMsg.name
				identifier = outSideMsg.identifier

				if (this.webWorkerFile) {
					this.webWorkerFile.terminate()
					this.webWorkerFile = null
				}

				this.webWorkerFile = new WebWorkerFile()

				const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
					const byteCharacters = atob(b64Data)
					const byteArrays = []

					for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
						const slice = byteCharacters.slice(offset, offset + sliceSize)

						const byteNumbers = new Array(slice.length)
						for (let i = 0; i < slice.length; i++) {
							byteNumbers[i] = slice.charCodeAt(i)
						}

						const byteArray = new Uint8Array(byteNumbers)
						byteArrays.push(byteArray)
					}

					const blob = new Blob(byteArrays, { type: contentType })
					return blob
				}

				const blob = b64toBlob(str, 'image/png')

				let compressedFile = ''

				await new Promise(resolve => {
					new Compressor(blob, {
						quality: 0.6,
						maxWidth: 500,
						success(result) {
							const file = new File([result], "name", {
								type: 'image/png'
							})

							compressedFile = file
							resolve()
						},
						error() {
						},
					})
				})

				const arbitraryFeeData = await modalHelper.getArbitraryFee()

				const res = await modalHelper.showModalAndWaitPublish({
					feeAmount: arbitraryFeeData.feeToShow
				})

				if (res.action !== 'accept') throw new Error('User declined publish')

				try {
					await publishData({
						registeredName: userName,
						file: compressedFile,
						service: 'FILE',
						identifier: identifier,
						parentEpml,
						metaData: undefined,
						uploadType: 'file',
						selectedAddress: this.selectedAddress,
						worker: this.webWorkerFile,
						withFee: true,
						feeAmount: arbitraryFeeData.fee
					})

					this.isDeletingAppFile = false
				} catch (error) {
					this.isDeletingAppFile = false
					this.isLoading = false
					return
				}

				typeMessage = 'edit'

				let chatReference = outSideMsg.editedMessageObj.signature

				if (outSideMsg.editedMessageObj.chatReference) {
					chatReference = outSideMsg.editedMessageObj.chatReference
				}

				let message = ''

				try {
					const parsedMessageObj = JSON.parse(outSideMsg.editedMessageObj.decodedMessage)
					message = parsedMessageObj

				} catch (error) {
					message = outSideMsg.editedMessageObj.decodedMessage
				}

				const messageObject = {
					...message,
					isFileDeleted: true
				}

				const stringifyMessageObject = JSON.stringify(messageObject)

				return this.sendMessage({ messageText: stringifyMessageObject, typeMessage, chatReference, isForward: false, isReceipient, _chatId, _publicKey, messageQueue })
			} else if (outSideMsg && outSideMsg.type === 'image') {
				if (!this.imageFile.identifier) {
					this.isUploadingImage = true
				}

				const userName = await getName(this.selectedAddress.address)

				if (!userName) {
					parentEpml.request('showSnackBar', get("chatpage.cchange27"))
					this.isLoading = false
					this.isUploadingImage = false
					this.imageFile = null
					return
				}

				let service = "QCHAT_IMAGE"
				let name = userName
				let identifier

				if (this.imageFile.identifier) {
					identifier = this.imageFile.identifier
					name = this.imageFile.name
					service = this.imageFile.service
				} else {
					const arbitraryFeeData = await modalHelper.getArbitraryFee()

					const res = await modalHelper.showModalAndWaitPublish({
						feeAmount: arbitraryFeeData.feeToShow
					})

					if (res.action !== 'accept') throw new Error('User declined publish')

					if (this.webWorkerFile) {
						this.webWorkerFile.terminate()
						this.webWorkerFile = null
					}

					this.webWorkerFile = new WebWorkerFile()

					const image = this.imageFile
					const id = this.uid.rnd()
					let groupPart

					if (this.isReceipient) {
						groupPart = `direct_${generateIdFromAddresses(this._chatId, this.selectedAddress.address)}`
					} else {
						groupPart = `group_${this._chatId}`
					}

					identifier = `qchat_${groupPart}_${id}`

					let compressedFile = ''

					await new Promise(resolve => {
						new Compressor(image, {
							quality: .6,
							maxWidth: 1200,
							mimeType: 'image/webp',
							success(result) {
								const file = new File([result], "name", {
									type: 'image/webp'
								})
								compressedFile = file
								resolve()
							},
							error() {
							},
						})
					})

					const fileSize = compressedFile.size

					if (fileSize > 500000) {
						parentEpml.request('showSnackBar', get("chatpage.cchange26"))
						this.isLoading = false
						this.isUploadingImage = false
						return
					}

					try {
						await publishData({
							registeredName: userName,
							file: compressedFile,
							service: 'QCHAT_IMAGE',
							identifier: identifier,
							parentEpml,
							metaData: undefined,
							uploadType: 'file',
							selectedAddress: this.selectedAddress,
							worker: this.webWorkerFile,
							withFee: true,
							feeAmount: arbitraryFeeData.fee
						})

						this.isUploadingImage = false
						this.removeImage()
					} catch (error) {
						this.isLoading = false
						this.isUploadingImage = false
						return
					}

				}

				const messageObject = {
					messageText: trimmedMessage,
					images: [{
						service: service,
						name: name,
						identifier: identifier
					}],
					isImageDeleted: false,
					repliedTo: '',
					version: 3
				}

				const stringifyMessageObject = JSON.stringify(messageObject)

				this.removeImage()

				return this.sendMessage({ messageText: stringifyMessageObject, typeMessage, chatReference: undefined, isForward: false, isReceipient, _chatId, _publicKey, messageQueue })
			} else if (outSideMsg && outSideMsg.type === 'gif') {
				if (!this.gifFile.identifier) {
					this.isUploadingGif = true
				}

				const userName = await getName(this.selectedAddress.address)

				if (!userName) {
					parentEpml.request('showSnackBar', get("chatpage.cchange27"))
					this.isLoading = false
					this.isUploadingGif = false
					this.gifFile = null
					return
				}

				let identifier
				let groupPart

				if (this.webWorkerFile) {
					this.webWorkerFile.terminate()
					this.webWorkerFile = null
				}

				this.webWorkerFile = new WebWorkerFile()

				const gifFile = this.gifFile
				const id = this.uid.rnd()

				if (this.isReceipient) {
					groupPart = `direct_${generateIdFromAddresses(this._chatId, this.selectedAddress.address)}`
				} else {
					groupPart = `group_${this._chatId}`
				}

				identifier = `qchat_${groupPart}_gif_${id}`

				const fileSize = gifFile.size

				if (fileSize > 3000000) {
					parentEpml.request('showSnackBar', get("chatpage.cchange103"))
					this.isLoading = false
					this.isUploadingGif = false
					return
				}

				const arbitraryFeeData = await modalHelper.getArbitraryFee()

				const res = await modalHelper.showModalAndWaitPublish({
					feeAmount: arbitraryFeeData.feeToShow
				})

				if (res.action !== 'accept') throw new Error('User declined publish')

				try {
					await publishData({
						registeredName: userName,
						file: gifFile,
						service: 'IMAGE',
						identifier: identifier,
						parentEpml,
						metaData: undefined,
						uploadType: 'file',
						selectedAddress: this.selectedAddress,
						worker: this.webWorkerFile,
						withFee: true,
						feeAmount: arbitraryFeeData.fee
					})

					this.isUploadingGif = false
					this.removeGif()
				} catch (error) {
					this.isLoading = false
					this.isUploadingGif = false
					return
				}

				const messageObject = {
					messageText: trimmedMessage,
					gifs: [{
						service: 'IMAGE',
						name: userName,
						identifier: identifier
					}],
					isGifDeleted: false,
					repliedTo: '',
					version: 3
				}

				const stringifyMessageObject = JSON.stringify(messageObject)

				return this.sendMessage({ messageText: stringifyMessageObject, typeMessage, chatReference: undefined, isForward: false, isReceipient, _chatId, _publicKey, messageQueue })
			} else if (outSideMsg && outSideMsg.type === 'attachment') {
				if (!this.attachment.identifier) {
					this.isUploadingAttachment = true
				}

				let identifier
				let groupPart

				const userName = await getName(this.selectedAddress.address)

				if (!userName) {
					parentEpml.request('showSnackBar', get("chatpage.cchange27"))
					this.isUploadingAttachment = false
					this.isLoading = false
					this.attachment = null
					return
				}

				if (this.webWorkerFile) {
					this.webWorkerFile.terminate()
					this.webWorkerFile = null
				}

				this.webWorkerFile = new WebWorkerFile()

				const attachment = this.attachment
				const id = this.uid.rnd()

				if (this.isReceipient) {
					groupPart = `direct_${generateIdFromAddresses(this._chatId, this.selectedAddress.address)}`
				} else {
					groupPart = `group_${this._chatId}`
				}

				identifier = `qchat_${groupPart}_attachment_${id}`

				const fileSize = attachment.size

				if (fileSize > 10000000) {
					parentEpml.request('showSnackBar', get("chatpage.cchange77"))
					this.isLoading = false
					this.isUploadingAttachment = false
					return
				}

				const arbitraryFeeData = await modalHelper.getArbitraryFee()

				const res = await modalHelper.showModalAndWaitPublish({
					feeAmount: arbitraryFeeData.feeToShow
				})

				if (res.action !== 'accept') throw new Error('User declined publish')

				try {
					await publishData({
						registeredName: userName,
						file: attachment,
						service: 'ATTACHMENT',
						identifier: identifier,
						parentEpml,
						metaData: undefined,
						uploadType: 'file',
						selectedAddress: this.selectedAddress,
						worker: this.webWorkerFile,
						withFee: true,
						feeAmount: arbitraryFeeData.fee
					})

					this.isUploadingAttachment = false
					this.removeAttachment()
				} catch (error) {
					this.isLoading = false
					this.isUploadingAttachment = false
					return
				}

				const messageObject = {
					messageText: trimmedMessage,
					attachments: [{
						service: 'ATTACHMENT',
						name: userName,
						identifier: identifier,
						attachmentName: attachment.name,
						attachmentSize: attachment.size
					}],
					isAttachmentDeleted: false,
					repliedTo: '',
					version: 3
				}

				const stringifyMessageObject = JSON.stringify(messageObject)

				return this.sendMessage({ messageText: stringifyMessageObject, typeMessage, chatReference: undefined, isForward: false, isReceipient, _chatId, _publicKey, messageQueue })
			} else if (outSideMsg && outSideMsg.type === 'file') {
				if (!this.appFile.identifier) {
					this.isUploadingAppFile = true
				}

				let identifier
				let groupPart

				const userName = await getName(this.selectedAddress.address)

				if (!userName) {
					parentEpml.request('showSnackBar', get("chatpage.cchange27"))
					this.isUploadingAppFile = false
					this.isLoading = false
					this.appFile = null
					return
				}

				if (this.webWorkerFile) {
					this.webWorkerFile.terminate()
					this.webWorkerFile = null
				}

				this.webWorkerFile = new WebWorkerFile()

				const appFile = this.appFile
				const id = this.uid.rnd()

				if (this.isReceipient) {
					groupPart = `direct_${generateIdFromAddresses(this._chatId, this.selectedAddress.address)}`
				} else {
					groupPart = `group_${this._chatId}`
				}

				identifier = `qchat_${groupPart}_file_${id}`

				const fileSize = appFile.size

				if (fileSize > 125000000) {
					parentEpml.request('showSnackBar', get("chatpage.cchange100"))
					this.isLoading = false
					this.isUploadingAppFile = false
					return
				}

				const arbitraryFeeData = await modalHelper.getArbitraryFee()

				const res = await modalHelper.showModalAndWaitPublish({
					feeAmount: arbitraryFeeData.feeToShow
				})

				if (res.action !== 'accept') throw new Error('User declined publish')

				try {
					await publishData({
						registeredName: userName,
						file: appFile,
						service: 'FILE',
						identifier: identifier,
						parentEpml,
						metaData: undefined,
						uploadType: 'file',
						selectedAddress: this.selectedAddress,
						worker: this.webWorkerFile,
						withFee: true,
						feeAmount: arbitraryFeeData.fee
					})

					this.isUploadingAppFile = false
					this.removeAppFile()
				} catch (error) {
					this.isLoading = false
					this.isUploadingAppFile = false
					return
				}

				const messageObject = {
					messageText: trimmedMessage,
					files: [{
						service: 'FILE',
						name: userName,
						identifier: identifier,
						appFileName: appFile.name,
						appFileSize: appFile.size
					}],
					isFileDeleted: false,
					repliedTo: '',
					version: 3
				}

				const stringifyMessageObject = JSON.stringify(messageObject)

				return this.sendMessage({ messageText: stringifyMessageObject, typeMessage, chatReference: undefined, isForward: false, isReceipient, _chatId, _publicKey, messageQueue })
			} else if (outSideMsg && outSideMsg.type === 'reaction') {
				const userName = await getName(this.selectedAddress.address)

				typeMessage = 'edit'

				let chatReference = outSideMsg.editedMessageObj.signature

				if (outSideMsg.editedMessageObj.chatReference) {
					chatReference = outSideMsg.editedMessageObj.chatReference
				}

				let message = ''

				try {
					const parsedMessageObj = JSON.parse(outSideMsg.editedMessageObj.decodedMessage)
					message = parsedMessageObj
				} catch (error) {
					message = outSideMsg.editedMessageObj.decodedMessage
				}

				let reactions = message.reactions || []

				const findEmojiIndex = reactions.findIndex((reaction) => reaction.type === outSideMsg.reaction)

				if (findEmojiIndex !== -1) {
					let users = reactions[findEmojiIndex].users || []
					const findUserIndex = users.findIndex((user) => user.address === this.selectedAddress.address)

					if (findUserIndex !== -1) {
						users.splice(findUserIndex, 1)
					} else {
						users.push({
							address: this.selectedAddress.address,
							name: userName
						})
					}

					reactions[findEmojiIndex] = {
						...reactions[findEmojiIndex],
						qty: users.length,
						users
					}

					if (users.length === 0) {
						reactions.splice(findEmojiIndex, 1)
					}
				} else {
					reactions = [...reactions, {
						type: outSideMsg.reaction,
						qty: 1,
						users: [{
							address: this.selectedAddress.address,
							name: userName
						}]
					}]
				}

				const messageObject = {
					...message,
					reactions
				}

				const stringifyMessageObject = JSON.stringify(messageObject)

				return this.sendMessage({ messageText: stringifyMessageObject, typeMessage, chatReference, isForward: false, isReceipient, _chatId, _publicKey, messageQueue })
			} else if (/^\s*$/.test(trimmedMessage)) {
				this.isLoading = false
			} else if (this.repliedToMessageObj) {
				let chatReference = this.repliedToMessageObj.signature

				if (this.repliedToMessageObj.chatReference) {
					chatReference = this.repliedToMessageObj.chatReference
				}

				typeMessage = 'reply'

				const messageObject = {
					messageText: trimmedMessage,
					images: [''],
					repliedTo: chatReference,
					version: 3
				}

				const stringifyMessageObject = JSON.stringify(messageObject)

				return this.sendMessage({ messageText: stringifyMessageObject, typeMessage, chatReference: undefined, isForward: false, isReceipient, _chatId, _publicKey, messageQueue })
			} else if (this.editedMessageObj) {
				typeMessage = 'edit'
				let chatReference = this.editedMessageObj.signature

				if (this.editedMessageObj.chatReference) {
					chatReference = this.editedMessageObj.chatReference
				}

				let message = ''

				try {
					const parsedMessageObj = JSON.parse(this.editedMessageObj.decodedMessage)
					message = parsedMessageObj

				} catch (error) {
					message = this.editedMessageObj.decodedMessage
				}

				const messageObject = {
					...message,
					messageText: trimmedMessage,
					isEdited: true
				}

				const stringifyMessageObject = JSON.stringify(messageObject)

				return this.sendMessage({ messageText: stringifyMessageObject, typeMessage, chatReference, isForward: false, isReceipient, _chatId, _publicKey, messageQueue })
			} else {
				const messageObject = {
					messageText: trimmedMessage,
					images: [''],
					repliedTo: '',
					version: 3
				}

				const stringifyMessageObject = JSON.stringify(messageObject)

				if (this.balance < 4) {
					this.myMessageUnder4Qort = null
					this.myMessageUnder4Qort = { messageText: stringifyMessageObject, typeMessage, chatReference: undefined, isForward: false, isReceipient, _chatId, _publicKey, messageQueue }
					this.shadowRoot.getElementById('confirmDialog').open()
				} else {
					return this.sendMessage({ messageText: stringifyMessageObject, typeMessage, chatReference: undefined, isForward: false, isReceipient, _chatId, _publicKey, messageQueue })
				}
			}
		} catch (error) {
			this.isLoading = false
			this.isUploadingImage = false
			this.isUploadingGif = false
			this.isUploadingAttachment = false
			this.isUploadingAppFile = false
			return
		}

	}

	async sendMessage({ messageText, typeMessage, chatReference, isForward, isReceipient, _chatId, _publicKey, messageQueue }) {
		if (messageQueue) {
			this.addToQueue({ messageText, typeMessage, chatReference, isForward, isReceipient, _chatId, _publicKey }, messageQueue)
			this.resetChatEditor()
			this.closeEditMessageContainer()
			this.closeRepliedToContainer()
			return
		}

		if (isForward) {
			this.isLoading = true
		}

		let _reference = new Uint8Array(64)
		window.crypto.getRandomValues(_reference)
		let reference = window.parent.Base58.encode(_reference)

		const sendMessageRequest = async () => {
			if (isReceipient === true) {
				let chatResponse = await parentEpml.request('chat', {
					type: 18,
					nonce: this.selectedAddress.nonce,
					params: {
						timestamp: Date.now(),
						recipient: _chatId,
						recipientPublicKey: _publicKey.key,
						hasChatReference: typeMessage === 'edit' ? 1 : 0,
						chatReference: chatReference,
						message: messageText,
						lastReference: reference,
						proofOfWorkNonce: 0,
						isEncrypted: 1,
						isText: 1
					}
				})
				return _computePow(chatResponse)
			} else {
				let groupResponse = await parentEpml.request('chat', {
					type: 181,
					nonce: this.selectedAddress.nonce,
					params: {
						timestamp: Date.now(),
						groupID: Number(_chatId),
						hasReceipient: 0,
						hasChatReference: typeMessage === 'edit' ? 1 : 0,
						chatReference: chatReference,
						message: messageText,
						lastReference: reference,
						proofOfWorkNonce: 0,
						isEncrypted: 0, // Set default to not encrypted for groups
						isText: 1
					}
				})
				return _computePow(groupResponse)
			}
		}

		const sendForwardRequest = async () => {
			const userInput = this.shadowRoot.getElementById("sendTo").value.trim()
			if (!userInput && !this.forwardActiveChatHeadUrl.url) {
				let err4string = get("chatpage.cchange65")
				getSendChatResponse(false, true, err4string)
				return
			}

			let publicKey = {
				hasPubKey: false,
				key: ''
			}

			if (this.forwardActiveChatHeadUrl.url) {
				const activeChatHeadAddress = this.forwardActiveChatHeadUrl.url.split('/')[1]
				try {
					const res = await parentEpml.request('apiCall', {
						type: 'api',
						url: `/addresses/publickey/${activeChatHeadAddress}`
					})

					if (res.error === 102) {
						publicKey.key = ''
						publicKey.hasPubKey = false
					} else if (res !== false) {
						publicKey.key = res
						publicKey.hasPubKey = true
					} else {
						publicKey.key = ''
						publicKey.hasPubKey = false
					}
				} catch (error) { /* empty */ }
			}

			if (!this.forwardActiveChatHeadUrl.selected && this.shadowRoot.getElementById("sendTo").value !== "") {
				try {
					let userPubkey = ""
					const validatedAddress = await parentEpml.request('apiCall', {
						type: 'api',
						url: `/addresses/validate/${userInput}`
					})

					const validatedUsername = await parentEpml.request('apiCall', {
						type: 'api',
						url: `/names/${userInput}`
					})

					if (validatedAddress && validatedUsername.name) {
						userPubkey = await parentEpml.request('apiCall', {
							type: 'api',
							url: `/addresses/publickey/${validatedUsername.owner}`
						})
						this.forwardActiveChatHeadUrl = {
							...this.forwardActiveChatHeadUrl,
							url: `direct/${validatedUsername.owner}`,
							name: validatedUsername.name,
							selected: true
						}
					} else
						if (!validatedAddress && (validatedUsername && !validatedUsername.error)) {
							userPubkey = await parentEpml.request('apiCall', {
								type: 'api',
								url: `/addresses/publickey/${validatedUsername.owner}`
							})

							this.forwardActiveChatHeadUrl = {
								...this.forwardActiveChatHeadUrl,
								url: `direct/${validatedUsername.owner}`,
								name: validatedUsername.name,
								selected: true
							}
						} else if (validatedAddress && !validatedUsername.name) {
							userPubkey = await parentEpml.request('apiCall', {
								type: 'api',
								url: `/addresses/publickey/${userInput}`
							})

							this.forwardActiveChatHeadUrl = {
								...this.forwardActiveChatHeadUrl,
								url: `direct/${userInput}`,
								name: "",
								selected: true
							}
						} else if (!validatedAddress && !validatedUsername.name) {
							let err4string = get("chatpage.cchange62")
							getSendChatResponse(false, true, err4string)
							return
						}

					if (userPubkey.error === 102) {
						publicKey.key = ''
						publicKey.hasPubKey = false
					} else if (userPubkey !== false) {
						publicKey.key = userPubkey
						publicKey.hasPubKey = true
					} else {
						publicKey.key = ''
						publicKey.hasPubKey = false
					}
				} catch (error) { /* empty */ }
			}

			const isRecipient = this.forwardActiveChatHeadUrl.url.includes('direct') === true ? true : false

			const recipientAddress = this.forwardActiveChatHeadUrl.url.split('/')[1]
			this.openForwardOpen = false
			if (isRecipient === true) {
				if (!publicKey.hasPubKey) {
					let err4string = get("chatpage.cchange39")
					parentEpml.request('showSnackBar', `${err4string}`)
					getSendChatResponse(false)
					return
				}
				let chatResponse = await parentEpml.request('chat', {
					type: 18,
					nonce: this.selectedAddress.nonce,
					params: {
						timestamp: Date.now(),
						recipient: recipientAddress,
						recipientPublicKey: publicKey.key,
						hasChatReference: 0,
						chatReference: "",
						message: messageText,
						lastReference: reference,
						proofOfWorkNonce: 0,
						isEncrypted: 1,
						isText: 1
					}
				})
				_computePow(chatResponse, true)
			} else {
				let groupResponse = await parentEpml.request('chat', {
					type: 181,
					nonce: this.selectedAddress.nonce,
					params: {
						timestamp: Date.now(),
						groupID: Number(recipientAddress),
						hasReceipient: 0,
						hasChatReference: 0,
						chatReference: chatReference,
						message: messageText,
						lastReference: reference,
						proofOfWorkNonce: 0,
						isEncrypted: 0, // Set default to not encrypted for groups
						isText: 1
					}
				})
				_computePow(groupResponse, true)
			}
		}

		const _computePow = async (chatBytes, isForward) => {
			const difficulty = this.balance < 4 ? 18 : 8
			const path = window.parent.location.origin + '/memory-pow/memory-pow.wasm.full'

			let worker

			if (this.webWorker) {
				worker = this.webWorker
			} else {
				this.webWorker = new WebWorker()
			}

			let nonce = null

			let chatBytesArray = null

			await new Promise((res) => {
				worker.postMessage({ chatBytes, path, difficulty })
				worker.onmessage = e => {
					chatBytesArray = e.data.chatBytesArray
					nonce = e.data.nonce
					res()
				}
			})

			let _response = await parentEpml.request('sign_chat', {
				nonce: this.selectedAddress.nonce,
				chatBytesArray: chatBytesArray,
				chatNonce: nonce
			})

			getSendChatResponse(_response, isForward)
			return _response
		}

		const getSendChatResponse = (response, isForward) => {
			if (response === true) {
				if (isForward) {
					let successString = get("blockpage.bcchange15")
					parentEpml.request('showSnackBar', `${successString}`)
					this.resetChatEditor()
					this.closeEditMessageContainer()
					this.closeRepliedToContainer()
					this.openForwardOpen = false
					this.forwardActiveChatHeadUrl = {
						url: "",
						name: "",
						selected: false
					}
					this.isLoading = false
				}
			} else if (response.error) {
				// parentEpml.request('showSnackBar', response.message)
			} else {
				// let err2string = get("chatpage.cchange21")
				// parentEpml.request('showSnackBar', `${customErrorMessage || err2string}`)
			}
			if (isForward && response !== true) {
				this.isLoading = false
				return
			}
			this.isLoading = false

		}

		if (isForward) {
			sendForwardRequest()
			return
		}
		return sendMessageRequest()
	}

	/**
	 * Method to set if the user's location is down in the chat
	 * @param { Boolean } isDown
	 */
	setIsUserDown(isDown) {
		this.isUserDown = isDown
	}

	_downObserverhandler(entries) {
		if (entries[0].isIntersecting) {

			this.setIsUserDown(true)
			this.hideNewMessageBar()
		} else {

			this.setIsUserDown(false)
		}
	}

	downElementObserver() {
		const chatscrollerEl = this.shadowRoot.querySelector('chat-scroller')
		if (!chatscrollerEl) return
		const downObserver = this.shadowRoot.querySelector('chat-scroller').shadowRoot.getElementById('downObserver')

		const options = {
			root: this.shadowRoot.querySelector('chat-scroller').shadowRoot.getElementById('viewElement'),
			rootMargin: '100px',
			threshold: 1
		}
		const observer = new IntersectionObserver(this._downObserverhandler, options)
		observer.observe(downObserver)
	}

	pasteToTextBox(textarea) {
		// Return focus to the window
		window.focus()

		navigator.clipboard.readText().then(clipboardText => {
			textarea.value += clipboardText
			textarea.focus()
		})
	}

	pasteMenu(event) {
		let eventObject = { pageX: event.pageX, pageY: event.pageY, clientX: event.clientX, clientY: event.clientY }
		parentEpml.request('openFramePasteMenu', eventObject)
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

window.customElements.define('chat-page', ChatPage)
