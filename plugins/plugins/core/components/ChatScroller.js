import { html, LitElement, } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { Epml } from '../../../epml'
import { cropAddress, roundToNearestDecimal } from '../../utils/functions'
import { generateHTML, generateJSON } from '@tiptap/core'
import { chatLimit, totalMsgCount } from './ChatPage'
import { chatStyles } from './plugins-css'
import isElectron from 'is-electron'
import axios from 'axios'
import Highlight from '@tiptap/extension-highlight'
import Mention from '@tiptap/extension-mention'
import ShortUniqueId from 'short-unique-id'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import './ChatModals'
import './LevelFounder'
import './NameMenu'
import './UserInfo'
import './WrapperModal'
import './ChatImage'
import './ChatImageGif'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-icon'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/iron-icons/iron-icons.js'
import '@vaadin/icon'
import '@vaadin/icons'
import '@vaadin/tooltip'

// Multi language support
import { get, translate } from '../../../../core/translate'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

const uid = new ShortUniqueId()

let toggledMessage = {}

const extractComponents = async (url) => {
	if (!url.startsWith('qortal://')) {
		return null
	}
	url = url.replace(/^(qortal:\/\/)/, '')
	if (url.startsWith('use-')) {
		// Handle the new 'use' format
		let parts = url.split('/')
		const type = parts[0].split('-')[1] // e.g., 'group' from 'use-group'
		parts.shift()
		const action = parts.length > 0 ? parts[0].split('-')[1] : null // e.g., 'invite' from 'action-invite'
		parts.shift()
		const idPrefix = parts.length > 0 ? parts[0].split('-')[0] : null // e.g., 'groupid' from 'groupid-321'
		const id = parts.length > 0 ? parts[0].split('-')[1] : null // e.g., '321' from 'groupid-321'
		return {
			type: type,
			action: action,
			[idPrefix]: id
		}
	} else if (url.includes('/')) {
		let parts = url.split('/')
		const service = parts[0].toUpperCase()
		parts.shift()
		const name = parts[0]
		parts.shift()
		let identifier
		if (parts.length > 0) {
			identifier = parts[0] // Do not shift yet

			// Check if a resource exists with this service, name and identifier combination
			let responseObj = await parentEpml.request('apiCall', {
				url: `/arbitrary/resource/status/${service}/${name}/${identifier}`,
			})

			if (responseObj.totalChunkCount > 0) {
				// Identifier exists, so don't include it in the path
				parts.shift()
			} else {
				identifier = null
			}
		}
		const path = parts.join('/')
		const components = {}
		components['service'] = service
		components['name'] = name
		components['identifier'] = identifier
		components['path'] = path
		return components
	}
	return null
}

function processText(input) {
	const linkRegex = /(qortal:\/\/\s+$|\S+.+)/gm
	function processNode(node) {
		if (node.nodeType === Node.TEXT_NODE) {
			const parts = node.textContent.split(linkRegex)
			if (parts.length > 0) {
				const fragment = document.createDocumentFragment()
				parts.forEach((part) => {
					if (part.startsWith('qortal://')) {
						const link = document.createElement('span')

						// Store the URL in a data attribute
						link.setAttribute('data-url', part)
						link.textContent = part
						link.style.color = 'var(--code-block-text-color)'
						link.style.textDecoration = 'underline'
						link.style.cursor = 'pointer'

						link.addEventListener('click', async (e) => {
							e.preventDefault()
							try {
								const res = await extractComponents(part)

								if (!res) return

								if (res.type && res.groupid && res.action === 'join') {
									window.parent.reduxStore.dispatch(
										window.parent.reduxAction.setNewTab({
											url: `group-management`,
											id: uid.rnd(),
											myPlugObj: {
												"url": "group-management",
												"domain": "core",
												"page": "group-management/index.html",
												"title": "Group Management",
												"icon": "vaadin:group",
												"mwcicon": "group",
												"pluginNumber": "plugin-fJZNpyLGTl",
												"menus": [],
												"parent": false
											},
											openExisting: true
										})
									)
									window.parent.reduxStore.dispatch(
										window.parent.reduxAction.setSideEffectAction({
											type: 'openJoinGroupModal',
											data: res.groupid
										})
									)
									return
								}
								const { service, name, identifier, path } = res
								let query = `?service=${service}`
								if (name) {
									query = query + `&name=${name}`
								}
								if (identifier) {
									query = query + `&identifier=${identifier}`
								}
								if (path) {
									query = query + `&path=${path}`
								}
								window.parent.reduxStore.dispatch(
									window.parent.reduxAction.setNewTab({
										url: `qdn/browser/index.html${query}`,
										id: uid.rnd(),
										myPlugObj: {
											url: 'myapp',
											domain: 'core',
											page: `qdn/browser/index.html${query}`,
											title: name,
											icon:
												service === 'WEBSITE'
													? 'vaadin:desktop'
													: 'vaadin:external-browser',
											mwcicon:
												service === 'WEBSITE'
													? 'desktop_mac'
													: 'open_in_browser',
											menus: [],
											parent: false
										}
									})
								)
							} catch (error) {
								console.error({ error })
							}
						})

						fragment.appendChild(link)
					} else {
						const textNode = document.createTextNode(part)
						fragment.appendChild(textNode)
					}
				})

				node.replaceWith(fragment)
			}
		} else {
			for (const childNode of Array.from(node.childNodes)) {
				processNode(childNode)
			}
		}
	}
	const wrapper = document.createElement('div')
	wrapper.innerHTML = input
	processNode(wrapper)
	return wrapper
}

class ChatScroller extends LitElement {
	static get properties() {
		return {
			theme: { type: String, reflect: true },
			getNewMessage: { attribute: false },
			getOldMessage: { attribute: false },
			getAfterMessages: { attribute: false },
			escapeHTML: { attribute: false },
			messages: { type: Object },
			hideMessages: { type: Array },
			setRepliedToMessageObj: { attribute: false },
			setEditedMessageObj: { attribute: false },
			sendMessage: { attribute: false },
			sendMessageForward: { attribute: false },
			showLastMessageRefScroller: { attribute: false },
			emojiPicker: { attribute: false },
			isLoadingMessages: { type: Boolean },
			setIsLoadingMessages: { attribute: false },
			chatId: { type: String },
			setForwardProperties: { attribute: false },
			setOpenPrivateMessage: { attribute: false },
			setOpenUserInfo: { attribute: false },
			setOpenTipUser: { attribute: false },
			setUserName: { attribute: false },
			setSelectedHead: { attribute: false },
			openTipUser: { type: Boolean },
			openUserInfo: { type: Boolean },
			userName: { type: String },
			selectedHead: { type: Object },
			goToRepliedMessage: { attribute: false },
			listSeenMessages: { type: Array },
			updateMessageHash: { type: Object },
			messagesToRender: { type: Array },
			oldMessages: { type: Array },
			clearUpdateMessageHashmap: { attribute: false },
			disableFetching: { type: Boolean },
			isLoadingBefore: { type: Boolean },
			isLoadingAfter: { type: Boolean },
			messageQueue: { type: Array },
			loggedInUserName: { type: String },
			loggedInUserAddress: { type: String }		}
	}

	static get styles() {
		return [chatStyles]
	}

	constructor() {
		super()
		this.messages = {
			messages: [],
			type: '',
		}
		this.oldMessages = []
		this._upObserverhandler = this._upObserverhandler.bind(this)
		this.newListMessages = this.newListMessages.bind(this)
		this.newListMessagesUnreadMessages = this.newListMessagesUnreadMessages.bind(this)
		this._downObserverHandler = this._downObserverHandler.bind(this)
		this.isLastMessageBeforeUnread = this.isLastMessageBeforeUnread.bind(this)
		this.replaceMessagesWithUpdate = this.replaceMessagesWithUpdate.bind(this)
		this.__bottomObserverForFetchingMessagesHandler = this.__bottomObserverForFetchingMessagesHandler.bind(this)
		this.myAddress = window.parent.reduxStore.getState().app.selectedAddress.address
		this.hideMessages = JSON.parse(localStorage.getItem('MessageBlockedAddresses') || '[]')
		this.openTipUser = false
		this.openUserInfo = false
		this.listSeenMessages = []
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
		this.messagesToRender = []
		this.disableFetching = false
		this.isLoadingBefore = false
		this.isLoadingAfter = false
		this.disableAddingNewMessages = false
		this.lastReadMessageTimestamp = null
		this.messageQueue = []
	}

	render() {
		let formattedMessages = this.messagesToRender

		return html`
			${this.isLoadingBefore
				? html`
						<div class="spinnerContainer">
							<paper-spinner-lite active></paper-spinner-lite>
						</div>
				`
				: ''
			}
			<ul id="viewElement" class="chat-list clearfix">
				<div id="upObserver"></div>
				${repeat(formattedMessages, (formattedMessage) => formattedMessage.reference, (formattedMessage) =>
					html`
						${repeat(formattedMessage.messages, (message) => message.signature, (message, indexMessage) =>
							html`
								<message-template
									.emojiPicker=${this.emojiPicker}
									.escapeHTML=${this.escapeHTML}
									.messageObj=${message}
									.hideMessages=${this.hideMessages}
									.setRepliedToMessageObj=${this.setRepliedToMessageObj}
									.setEditedMessageObj=${this.setEditedMessageObj}
									.sendMessage=${this.sendMessage}
									.sendMessageForward=${this.sendMessageForward}
									?isFirstMessage=${indexMessage === 0}
									?isSingleMessageInGroup=${formattedMessage.messages.length > 1}
									?isLastMessageInGroup=${indexMessage ===
									formattedMessage.messages.length - 1}
									.setToggledMessage=${this.setToggledMessage}
									.setForwardProperties=${this.setForwardProperties}
									.setOpenPrivateMessage=${(val) => this.setOpenPrivateMessage(val)}
									.setOpenTipUser=${(val) => this.setOpenTipUser(val)}
									.setOpenUserInfo=${(val) => this.setOpenUserInfo(val)}
									.setUserName=${(val) => this.setUserName(val)}
									id=${message.signature}
									.goToRepliedMessage=${(val, val2) => this.goToRepliedMessageFunc(val, val2)}
									.addSeenMessage=${(val) => this.addSeenMessage(val)}
									.listSeenMessages=${this.listSeenMessages}
									chatId=${this.chatId}
								>
								</message-template>
								${message.isDivider ?
									html`
										<div class="unread-divider" id="unread-divider-id">
											${translate('chatpage.cchange92')}
										</div>
									`
									: null
								}
							`
						)}
					`
				)}
				<div style=${this.messageQueue.filter((item) => this.chatId.includes(item._chatId)).length > 0 ? 'height: 1px' : 'height: 1px'} id="bottomObserverForFetchingMessages"></div>
				<div style=${'height: 1px;'} id="downObserver"></div>
				${this.isLoadingAfter ?
					html`
						<div class="spinnerContainer">
							<paper-spinner-lite active></paper-spinner-lite>
						</div>
					`
					: ''
				}
				${!this.disableAddingNewMessages ?
					repeat(
						this.messageQueue.filter((item) => this.chatId.includes(item._chatId)),
						(message) => message.messageText,
						(message) => html`
							<message-template
								.emojiPicker=${this.emojiPicker}
								.escapeHTML=${this.escapeHTML}
								.messageObj=${{decodedMessage: message.messageText, timestamp: message.timestamp, sender: this.loggedInUserAddress, senderName: this.loggedInUserName, signature: ''}}
								.hideMessages=${this.hideMessages}
								.setRepliedToMessageObj=${this.setRepliedToMessageObj}
								.setEditedMessageObj=${this.setEditedMessageObj}
								.sendMessage=${this.sendMessage}
								.sendMessageForward=${this.sendMessageForward}
								?isFirstMessage=${true}
								?isSingleMessageInGroup=${false}
								?isLastMessageInGroup=${true}
								.setToggledMessage=${this.setToggledMessage}
								.setForwardProperties=${this.setForwardProperties}
								.setOpenPrivateMessage=${(val) => this.setOpenPrivateMessage(val)}
								.setOpenTipUser=${(val) => this.setOpenTipUser(val)}
								.setOpenUserInfo=${(val) => this.setOpenUserInfo(val)}
								.setUserName=${(val) => this.setUserName(val)}
								id=${message.signature}
								.goToRepliedMessage=${(val, val2) => this.goToRepliedMessageFunc(val, val2)}
								.addSeenMessage=${(val) => this.addSeenMessage(val)}
								.listSeenMessages=${this.listSeenMessages}
								chatId=${this.chatId}
								?isInProgress=${true}
							>
							</message-template>
						`
					)
					: ''
				}
			</ul>
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

		this.emojiPicker.on('emoji', (selection) => {
			this.sendMessage({
				type: 'reaction',
				editedMessageObj: toggledMessage,
				reaction: selection.emoji
			})
		})

		this.viewElement = this.shadowRoot.getElementById('viewElement')
		this.upObserverElement = this.shadowRoot.getElementById('upObserver')
		this.downObserverElement = this.shadowRoot.getElementById('downObserver')

		this.bottomObserverForFetchingMessages = this.shadowRoot.getElementById(
			'bottomObserverForFetchingMessages'
		)

		// Intialize Observers
		this.upElementObserver()
		this.downElementObserver()
		this.bottomObserver()

		this.clearConsole()

		setInterval(() => {
			this.clearConsole()
		}, 60000)
	}

	addSeenMessage(val) {
		this.listSeenMessages.push(val)
	}

	goToRepliedMessageFunc(val, val2) {
		this.disableFetching = true
		this.goToRepliedMessage(val, val2)
	}

	shouldGroupWithLastMessage(newMessage, lastGroupedMessage) {
		if (!lastGroupedMessage) return false

		return (
			Math.abs(lastGroupedMessage.timestamp - newMessage.timestamp) <
			600000 &&
			lastGroupedMessage.sender === newMessage.sender &&
			!lastGroupedMessage.repliedToData
		)
	}

	clearLoaders() {
		this.isLoadingBefore = false
		this.isLoadingAfter = false
		this.disableFetching = false
	}

	addNewMessage(newMessage) {
		const lastGroupedMessage =
			this.messagesToRender[this.messagesToRender.length - 1]

		if (this.shouldGroupWithLastMessage(newMessage, lastGroupedMessage)) {
			lastGroupedMessage.messages.push(newMessage)
		} else {
			this.messagesToRender.push({
				messages: [newMessage],
				...newMessage
			})
		}

		this.clearLoaders()
		this.requestUpdate()
	}

	async newListMessages(newMessages, count) {
		let data = []

		const copy = [...newMessages]

		copy.forEach((newMessage) => {
			const lastGroupedMessage = data[data.length - 1]

			if (this.shouldGroupWithLastMessage(newMessage, lastGroupedMessage)) {
				lastGroupedMessage.messages.push(newMessage)
			} else {
				data.push({
					messages: [newMessage],
					...newMessage
				})
			}
		})

		this.messagesToRender = data

		if (count > 0) {
			this.disableAddingNewMessages = true
		}

		this.clearLoaders()
		this.requestUpdate()
		await this.updateComplete
	}

	async newListMessagesUnreadMessages(newMessages, message, lastReadMessageTimestamp, count) {
		let data = []

		const copy = [...newMessages]

		// To ensure the divider is added only once
		let dividerPlaced = false

		// Start from the end of the list (newest messages)
		for (let i = copy.length - 1; i >= 0; i--) {
			let newMessage = copy[i]

			// Initialize a property for the divider
			newMessage.isDivider = false

			// Check if this is the message before which the divider should be placed
			if (!dividerPlaced && newMessage.timestamp <= lastReadMessageTimestamp) {
				newMessage.isDivider = true

				// Ensure the divider is only added once
				dividerPlaced = true

				// Exit once the divider is placed
				break
			}
		}

		copy.forEach((newMessage) => {
			const lastGroupedMessage = data[data.length - 1]

			if (this.shouldGroupWithLastMessage(newMessage, lastGroupedMessage)) {
				lastGroupedMessage.messages.push(newMessage)
			} else {
				data.push({
					messages: [newMessage],
					...newMessage
				})
			}
		})

		if (count > 0) {
			this.disableAddingNewMessages = true
		}

		this.messagesToRender = data
		this.clearLoaders()
		this.requestUpdate()

		await this.updateComplete

		const findElement = this.shadowRoot.getElementById('unread-divider-id')

		if (findElement) {
			findElement.scrollIntoView({ behavior: 'auto', block: 'center' })
		}
	}

	async addNewMessages(newMessages, type) {
		if (this.disableAddingNewMessages && type === 'newComingInAuto') return

		const viewElement = this.shadowRoot.querySelector('#viewElement')
		const copy = type === 'initial' ? [] : [...this.messagesToRender]

		for (const newMessage of newMessages) {
			const lastGroupedMessage = copy[copy.length - 1]

			if (this.shouldGroupWithLastMessage(newMessage, lastGroupedMessage)) {
				lastGroupedMessage.messages.push(newMessage)
			} else {
				copy.push({
					messages: [newMessage],
					...newMessage
				})
			}
		}

		// Ensure that the total number of individual messages doesn't exceed totalMsgCount
		let totalMessagesCount = copy.reduce(
			(acc, group) => acc + group.messages.length,
			0
		)

		while (totalMessagesCount > totalMsgCount && copy.length) {
			if (newMessages.length < chatLimit && type !== 'newComingInAuto' && type !== 'initial') {
				this.disableAddingNewMessages = false
			}

			const firstGroup = copy[0]

			if (firstGroup.messages.length <= totalMessagesCount - totalMsgCount) {
				// If removing the whole first group achieves the goal, remove it
				totalMessagesCount -= firstGroup.messages.length
				copy.shift()
			} else {
				// Otherwise, trim individual messages from the first group
				const messagesToRemove = totalMessagesCount - totalMsgCount
				firstGroup.messages.splice(0, messagesToRemove)
				totalMessagesCount = totalMsgCount
			}
		}

		this.messagesToRender = copy
		this.requestUpdate()

		await this.updateComplete

		if (type === 'initial') {
			viewElement.scrollTop = viewElement.scrollHeight
		}

		this.clearLoaders()
	}

	async prependOldMessages(oldMessages) {
		// Ensure it's initialized
		if (!this.messagesToRender) this.messagesToRender = []

		let currentMessageGroup = null
		let previousMessage = null

		for (const message of oldMessages) {
			if (!previousMessage || !this.shouldGroupWithLastMessage(message, previousMessage)) {
				if (currentMessageGroup) {
					this.messagesToRender.unshift(currentMessageGroup)
				}

				currentMessageGroup = {
					id: message.signature,
					messages: [message],
					...message
				}
			} else {
				// Add to the current group
				currentMessageGroup.messages.unshift(message)
			}
			previousMessage = message
		}

		// After processing all old messages, add the last group
		if (currentMessageGroup) {
			this.messagesToRender.unshift(currentMessageGroup)
		}

		// Ensure that the total number of individual messages doesn't exceed totalMsgCount
		let totalMessagesCount = this.messagesToRender.reduce(
			(acc, group) => acc + group.messages.length,
			0
		)
		while (totalMessagesCount > totalMsgCount && this.messagesToRender.length) {
			this.disableAddingNewMessages = true
			const lastGroup = this.messagesToRender[this.messagesToRender.length - 1]

			if (lastGroup.messages.length <= totalMessagesCount - totalMsgCount) {
				// If removing the whole last group achieves the goal, remove it
				totalMessagesCount -= lastGroup.messages.length
				this.messagesToRender.pop()
			} else {
				// Otherwise, trim individual messages from the last group
				const messagesToRemove = totalMessagesCount - totalMsgCount
				lastGroup.messages.splice(-messagesToRemove, messagesToRemove)
				totalMessagesCount = totalMsgCount
			}
		}

		this.clearLoaders()
		this.requestUpdate()

		await this.updateComplete
	}

	async replaceMessagesWithUpdate(updatedMessages) {
		const viewElement = this.shadowRoot.querySelector('#viewElement')

		// Ensure the element exists
		if (!viewElement) return

		const isUserAtBottom = viewElement.scrollTop + viewElement.clientHeight === viewElement.scrollHeight

		// Using map to return a new array, rather than mutating the old one
		const newMessagesToRender = this.messagesToRender.map((group) => {
			// For each message, return the updated message if it exists, otherwise return the original message
			const updatedGroupMessages = group.messages.map((message) => {
				return updatedMessages[message.signature]
					? { ...message, ...updatedMessages[message.signature] }
					: message
			})

			// Return a new group object with updated messages
			return {
				...group,
				messages: updatedGroupMessages
			}
		})

		this.messagesToRender = newMessagesToRender
		this.requestUpdate()
		await this.updateComplete

		if (isUserAtBottom) {
			viewElement.scrollTop = viewElement.scrollHeight - viewElement.clientHeight
		} else {
			// Adjust scroll position based on the difference in scroll heights
			const newScrollHeight = viewElement.scrollHeight
			viewElement.scrollTop = viewElement.scrollTop + (newScrollHeight - viewElement.scrollHeight)
		}

		this.clearUpdateMessageHashmap()
		this.clearLoaders()
	}

	async replaceMessagesWithUpdateByArray(updatedMessagesArray) {
		let previousScrollTop
		let previousScrollHeight

		const viewElement = this.shadowRoot.querySelector('#viewElement')

		previousScrollTop = viewElement.scrollTop
		previousScrollHeight = viewElement.scrollHeight

		for (let group of this.messagesToRender) {
			for (let i = 0; i < group.messages.length; i++) {
				const update = updatedMessagesArray.find(
					(updatedMessage) =>
						updatedMessage.chatReference ===
						group.messages[i].signature ||
						updatedMessage.chatReference ===
						group.messages[i].originalSignature ||
						updatedMessage.chatReference ===
						group.messages[i].chatReference
				)
				if (update) {
					Object.assign(group.messages[i], update)
				}
			}
		}

		this.requestUpdate()

		const newScrollHeight = viewElement.scrollHeight

		viewElement.scrollTop = previousScrollTop + (newScrollHeight - previousScrollHeight)

		this.clearUpdateMessageHashmap()
		this.clearLoaders()
	}

	async updated(changedProperties) {
		if (changedProperties && changedProperties.has('messages')) {
			if (this.messages.type === 'initial') {
				this.addNewMessages(this.messages.messages, 'initial')
			} else if (this.messages.type === 'initialLastSeen') {
				this.newListMessagesUnreadMessages(
					this.messages.messages,
					'initialLastSeen',
					this.messages.lastReadMessageTimestamp,
					this.messages.count
				)
			} else if (this.messages.type === 'new')
				this.addNewMessages(this.messages.messages)
			else if (this.messages.type === 'newComingInAuto')
				this.addNewMessages(this.messages.messages, 'newComingInAuto')
			else if (this.messages.type === 'old')
				this.prependOldMessages(this.messages.messages)
			else if (this.messages.type === 'inBetween')
				this.newListMessages(
					this.messages.messages,
					this.messages.count
				)
			else if (this.messages.type === 'update')
				this.replaceMessagesWithUpdateByArray(this.messages.messages)
		}

		if (changedProperties && changedProperties.has('updateMessageHash') && Object.keys(this.updateMessageHash).length > 0) {
			this.replaceMessagesWithUpdate(this.updateMessageHash)
		}

		if (changedProperties && changedProperties.has('messageQueue') && Object.keys(this.messageQueue).length > 0) {
			if (!this.disableAddingNewMessages) {
				await new Promise((res) => {
					setTimeout(() => {
						res()
					}, 200)
				})
				const viewElement = this.shadowRoot.querySelector('#viewElement')
				viewElement.scrollTop = viewElement.scrollHeight + 200
			}
		}
	}

	isLastMessageBeforeUnread(message, formattedMessages) {
		// if the message is the last one in the older messages list and its timestamp is before the user's last seen timestamp
		if (message.timestamp < this.lastReadMessageTimestamp && formattedMessages.indexOf(message) === formattedMessages.length - 21) {
			return true
		}
		return false
	}

	shouldUpdate(changedProperties) {
		if (changedProperties.has('isLoadingMessages')) {
			return true
		}

		if (changedProperties.has('chatId') && changedProperties.get('chatId')) {
			return true
		}

		if (changedProperties.has('openTipUser')) {
			return true
		}

		if (changedProperties.has('openUserInfo')) {
			return true
		}

		if (changedProperties.has('userName')) {
			return true
		}

		if (changedProperties.has('loggedInUserName')) {
			return true
		}

		if (changedProperties.has('updateMessageHash')) {
			return true
		}

		if (changedProperties.has('messagesToRender')) {
			return true
		}

		if (changedProperties.has('isLoadingBefore')) {
			return true
		}

		if (changedProperties.has('isLoadingAfter')) {
			return true
		}

		if (changedProperties.has('messageQueue')) {
			return true
		}

		// Only update element if prop1 changed.
		return changedProperties.has('messages')
	}

	async getUpdateComplete() {
		await super.getUpdateComplete()
		const marginElements = Array.from(this.shadowRoot.querySelectorAll('message-template'))
		await Promise.all(marginElements.map((el) => el.updateComplete))
		return true
	}

	setToggledMessage(message) {
		toggledMessage = message
	}

	clearConsole() {
		if (!isElectron()) { /* empty */ } else {
			console.clear()
			window.parent.electronAPI.clearCache()
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

	_getOldMessage(_scrollElement) {
		this.getOldMessage(_scrollElement)
	}
	_getAfterMessages(_scrollElement) {
		this.getAfterMessages(_scrollElement)
	}

	_upObserverhandler(entries) {
		if (!entries[0].target || !entries[0].target.nextElementSibling) return
		if (entries[0].isIntersecting) {
			if (this.disableFetching) {
				return
			}
			this.disableFetching = true
			this.isLoadingBefore = true
			let _scrollElement = entries[0].target.nextElementSibling
			this._getOldMessage(_scrollElement)
		}
	}

	_downObserverHandler(entries) {
		if (!entries[0].isIntersecting) {
			this.showLastMessageRefScroller(true)
		} else {
			this.showLastMessageRefScroller(false)
		}
	}

	__bottomObserverForFetchingMessagesHandler(entries) {
		if (this.messagesToRender.length === 0 || this.disableFetching) {
			return
		}
		if (!this.disableAddingNewMessages) return
		if (!entries[0].isIntersecting || !entries[0].target || !entries[0].target.previousElementSibling) {
			/* empty */
		} else {
			this.disableFetching = true
			this.isLoadingAfter = true
			let _scrollElement = entries[0].target.previousElementSibling
			this._getAfterMessages(_scrollElement)
		}
	}

	upElementObserver() {
		const options = {
			root: this.viewElement,
			rootMargin: '0px',
			threshold: 1
		}
		const observer = new IntersectionObserver(
			this._upObserverhandler,
			options
		)
		observer.observe(this.upObserverElement)
	}

	downElementObserver() {
		const options = {}

		// identify an element to observe
		const elementToObserve = this.downObserverElement

		// passing it a callback function
		const observer = new IntersectionObserver(
			this._downObserverHandler,
			options
		)

		// call `observe()` on that MutationObserver instance,
		// passing it the element to observe, and the options object
		observer.observe(elementToObserve)
	}

	bottomObserver() {
		const options = {}

		// identify an element to observe
		const elementToObserve = this.bottomObserverForFetchingMessages

		// passing it a callback function
		const observer = new IntersectionObserver(
			this.__bottomObserverForFetchingMessagesHandler,
			options
		)

		// call `observe()` on that MutationObserver instance,
		// passing it the element to observe, and the options object
		observer.observe(elementToObserve)
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

window.customElements.define('chat-scroller', ChatScroller)

class MessageTemplate extends LitElement {
	static get properties() {
		return {
			messageObj: { type: Object },
			emojiPicker: { attribute: false },
			escapeHTML: { attribute: false },
			hideMessages: { type: Array },
			openDialogPrivateMessage: { type: Boolean },
			openDialogBlockUser: { type: Boolean },
			showBlockAddressIcon: { type: Boolean },
			setRepliedToMessageObj: { attribute: false },
			setEditedMessageObj: { attribute: false },
			sendMessage: { attribute: false },
			sendMessageForward: { attribute: false },
			openDialogImage: { type: Boolean },
			openDialogGif: { type: Boolean },
			openDeleteImage: { type: Boolean },
			openDeleteGif: { type: Boolean },
			openDeleteAttachment: { type: Boolean },
			openDeleteFile: { type: Boolean },
			isImageLoaded: { type: Boolean },
			isGifLoaded: { type: Boolean },
			isFirstMessage: { type: Boolean },
			isSingleMessageInGroup: { type: Boolean },
			isLastMessageInGroup: { type: Boolean },
			setToggledMessage: { attribute: false },
			setForwardProperties: { attribute: false },
			viewImage: { type: Boolean },
			setOpenPrivateMessage: { attribute: false },
			setOpenTipUser: { attribute: false },
			setOpenUserInfo: { attribute: false },
			setUserName: { attribute: false },
			openTipUser: { type: Boolean },
			goToRepliedMessage: { attribute: false },
			listSeenMessages: { type: Array },
			addSeenMessage: { attribute: false },
			chatId: { type: String },
			isInProgress: { type: Boolean },
			id: { type: String },
			timeId: { type: String },
			isAgo: { type: Boolean },
			isIso: { type: Boolean },
			isBoth: { type: Boolean },
			fontSize: { type: String },
			messageFontSize: { type: String },
			replyFontSize: { type: String }
		}
	}

	static get styles() {
		return [chatStyles]
	}

	constructor() {
		super()
		this.messageObj = {}
		this.openDialogPrivateMessage = false
		this.openDialogBlockUser = false
		this.showBlockAddressIcon = false
		this.myAddress = window.parent.reduxStore.getState().app.selectedAddress.address
		this.imageFetches = 0
		this.gifFetches = 0
		this.openDialogImage = false
		this.openDialogGif = false
		this.isImageLoaded = false
		this.isGifLoaded = false
		this.isFirstMessage = false
		this.isSingleMessageInGroup = false
		this.isLastMessageInGroup = false
		this.viewImage = false
		this.isInProgress = false
		this.openDeleteImage = false
		this.openDeleteGif = false
		this.openDeleteAttachment = false
		this.openDeleteFile = false
		this.timeId = localStorage.getItem('timestampForChats') ? localStorage.getItem('timestampForChats') : 'ago'
		this.isAgo = false
		this.isIso = false
		this.isBoth = false
		this.fontSize = localStorage.getItem('fontsizeForChats') ? localStorage.getItem('fontsizeForChats') : 'font16'
		this.messageFontSize = ''
		this.replyFontSize = ''
	}

	render() {
		const hidemsg = this.hideMessages

		let message = ''
		let messageVersion2 = ''
		let messageVersion2WithLink = null
		let reactions = []
		let repliedToData = null
		let image = null
		let gif = null
		let attachment = null
		let file = null
		let isImageDeleted = false
		let isGifDeleted = false
		let isAttachmentDeleted = false
		let isFileDeleted = false
		let version = 0
		let isForwarded = false
		let isEdited = false
		let isEncrypted = false

		try {
			const parsedMessageObj = JSON.parse(this.messageObj.decodedMessage)

			if (parsedMessageObj.version > 1 && parsedMessageObj.messageText) {
				messageVersion2 = generateHTML(parsedMessageObj.messageText, [StarterKit, Underline, Highlight, Mention])
				messageVersion2WithLink = processText(messageVersion2)
			}

			if (parsedMessageObj.version > 1 && parsedMessageObj.message && !parsedMessageObj.messageText) {
				messageVersion2 = parsedMessageObj.message
				messageVersion2WithLink = processText(messageVersion2)
			}

			message = parsedMessageObj.messageText ? parsedMessageObj.messageText : parsedMessageObj.message
			repliedToData = this.messageObj.repliedToData
			isImageDeleted = parsedMessageObj.isImageDeleted
			isGifDeleted = parsedMessageObj.isGifDeleted
			isAttachmentDeleted = parsedMessageObj.isAttachmentDeleted
			isFileDeleted = parsedMessageObj.isFileDeleted
			// reactions = parsedMessageObj.reactions || []
			version = parsedMessageObj.version
			isForwarded = parsedMessageObj.type === 'forward'
			isEdited = parsedMessageObj.isEdited && true
			isEncrypted = parsedMessageObj.isFromHub || parsedMessageObj.isPrivate || parsedMessageObj.message ? true : false

			if (parsedMessageObj.images && Array.isArray(parsedMessageObj.images) && parsedMessageObj.images.length > 0) {
				image = parsedMessageObj.images[0]
			}

			if (parsedMessageObj.gifs && Array.isArray(parsedMessageObj.gifs) && parsedMessageObj.gifs.length > 0) {
				gif = parsedMessageObj.gifs[0]
			}

			if (parsedMessageObj.attachments && Array.isArray(parsedMessageObj.attachments) && parsedMessageObj.attachments.length > 0) {
				attachment = parsedMessageObj.attachments[0]
			}

			if (parsedMessageObj.files && Array.isArray(parsedMessageObj.files) && parsedMessageObj.files.length > 0) {
				file = parsedMessageObj.files[0]
			}
		} catch (error) {
			message = this.messageObj.decodedMessage
		}

		let avatarImg = ''
		let imageHTML = ''
		let imageUrl = ''
		let gifHTML = ''
		let gifHTMLDialog = ''
		let gifUrl = ''
		let nameMenu = ''
		let levelFounder = ''
		let hideit = hidemsg.includes(this.messageObj.sender)
		let forwarded = ''
		let edited = ''
		let encrypted = ''
		let decrypted = ''

		levelFounder = html`<level-founder checkleveladdress="${this.messageObj.sender}"></level-founder>`

		const createGif = (gif) => {
			const gifHTMLRes = new Image()
			gifHTMLRes.src = gif
			gifHTMLRes.style = 'max-width:45vh; max-height:40vh; border-radius: 5px; cursor: pointer;'
			gifHTMLRes.onclick = () => {this.openDialogGif = true;}
			gifHTMLRes.onload = () => {this.isGifLoaded = true;}
			gifHTMLRes.onerror = () => {
				if (this.gifFetches < 4) {
					setTimeout(() => {
						this.gifFetches = this.gifFetches + 1
						gifHTMLRes.src = gif
					}, 10000)
				} else {
					gifHTMLRes.src = '/img/chain.png'
					gifHTMLRes.style = 'max-width:45vh; max-height:20vh; border-radius: 5px; filter: opacity(0.5);'
					gifHTMLRes.onclick = () => {}
					this.isGifLoaded = true
				}
			}
			return gifHTMLRes
		}

		if (this.messageObj.senderName) {
			const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
			const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
			const avatarUrl = `${nodeUrl}/arbitrary/THUMBNAIL/${this.messageObj.senderName}/qortal_avatar?async=true`
			avatarImg = html`<img src="${avatarUrl}" style="max-width:100%; max-height:100%;" onerror="this.onerror=null; this.src='/img/incognito.png';" />`
		} else {
			avatarImg = html`<img src="/img/incognito.png" style="max-width:100%; max-height:100%;" onerror="this.onerror=null;" />`
		}

		if (image) {
			const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
			const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
			imageUrl = `${nodeUrl}/arbitrary/${image.service}/${image.name}/${image.identifier}?async=true`
			if (this.viewImage || this.myAddress === this.messageObj.sender) {
				imageHTML = html`
					<chat-image
						.resource=${{name: image.name, service: image.service, identifier: image.identifier}}
                    				.setOpenDialogImage=${(val) => this.setOpenDialogImage(val)}
					>
					</chat-image>
				`
			}
		}

		if (gif) {
			const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
			const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
			gifUrl = `${nodeUrl}/arbitrary/${gif.service}/${gif.name}/${gif.identifier}?async=true`
			if (this.viewImage || this.myAddress === this.messageObj.sender) {
				gifHTML = html`
					<chat-image-gif
						.resource=${{name: gif.name, service: gif.service, identifier: gif.identifier}}
                    				.setOpenDialogGif=${(val) => this.setOpenDialogGif(val)}
					>
					</chat-image-gif>
				`
				gifHTMLDialog = createGif(gifUrl)
				gifHTMLDialog.style = 'height: auto; max-height: 80vh; width: auto; max-width: 80vw; object-fit: contain; border-radius: 5px;'
			}
		}

		nameMenu = html`
			<div id="namesize" style=${this.messageFontSize}>
				<span class="${this.messageObj.sender === this.myAddress && 'message-data-my-name'}">
					${this.messageObj.senderName ? this.messageObj.senderName : cropAddress(this.messageObj.sender)}
				</span>
			</div>
		`

		forwarded = html`
			<span class="${this.messageObj.sender === this.myAddress && 'message-data-forward'}">
				${translate('blockpage.bcchange17')}
			</span>
		`

		if (this.timeId === 'ago') {
			this.isAgo = true
			this.isIso = false
			this.isBoth = false
		} else if (this.timeId === 'iso') {
			this.isAgo = false
			this.isIso = true
			this.isBoth = false
		} else if (this.timeId === 'both') {
			this.isAgo = false
			this.isIso = false
			this.isBoth = true
		}

		if (this.fontSize === 'font16') {
			this.messageFontSize = "font-size: 16px"
			this.replyFontSize = "font-size: 14px"
		} else if (this.fontSize === 'font18') {
			this.messageFontSize = "font-size: 18px"
			this.replyFontSize = "font-size: 16px"
		} else if (this.fontSize === 'font20') {
			this.messageFontSize = "font-size: 20px"
			this.replyFontSize = "font-size: 18px"
		} else if (this.fontSize === 'font22') {
			this.messageFontSize = "font-size: 22px"
			this.replyFontSize = "font-size: 20px"
		}

		edited = html`
			<span class="edited-message-style">
				${translate('chatpage.cchange68')}
				<message-time timestamp=${(this.messageObj.editedTimestamp === undefined ? Date.now() : this.messageObj.editedTimestamp)}></message-time>
			</span>
		`

		encrypted = html`&nbsp;&nbsp;&nbsp;<mwc-icon style="font-size:16px; color: var(--chat-group);">key</mwc-icon>&nbsp;&nbsp;&nbsp;`

		decrypted = html`&nbsp;&nbsp;&nbsp;<mwc-icon style="font-size:16px; color: var(--chat-group);">key_off</mwc-icon>&nbsp;&nbsp;&nbsp;`

		if (repliedToData) {
			try {
				repliedToData.decodedMessage = JSON.parse(repliedToData.decodedMessage)
			} catch (error) { /* empty */ }
		}

		let repliedToMessageText = ''

		if (repliedToData && repliedToData.decodedMessage && repliedToData.decodedMessage.messageText) {
			try {
				repliedToMessageText = generateHTML(repliedToData.decodedMessage.messageText, [StarterKit, Underline, Highlight, Mention])
			} catch (error) { /* empty */ }
		} else if (repliedToData && repliedToData.decodedMessage && repliedToData.decodedMessage.message) {
			try {
				repliedToMessageText = this.convertHubMessageToJson(repliedToData.decodedMessage.message)
			} catch (error) { /* empty */ }
		}

		let replacedMessage = ''

		if (message && +version < 2) {
			const escapedMessage = this.escapeHTML(message)
			if (escapedMessage) {
				replacedMessage = escapedMessage.replace(new RegExp('\r?\n', 'g'), '<br />')
			}
		}

		return hideit ? html`<li class="clearfix"></li>` : html`
			<li
				class="clearfix message-parent"
				style="${
					this.isSingleMessageInGroup === true
					&& this.isLastMessageInGroup === false
					&& reactions.length === 0 ?
					'padding-bottom: 0;' : null
				}
				${this.isFirstMessage && 'margin-top: 20px;'}"
			>
				<div>
					<div class="message-container" style="${this.isSingleMessageInGroup === true && this.isLastMessageInGroup === false && 'margin-bottom: 0'}">
						<div class=${`message-subcontainer1 ${this.isInProgress ? 'message-sending' : ''}`}>
							${this.isSingleMessageInGroup === false || (this.isSingleMessageInGroup === true && this.isLastMessageInGroup === true) ?
								html`
									<div style=${this.myAddress === this.messageObj.sender ? 'cursor: auto;' : 'cursor: pointer;'}
										@click=${() => {
											if (this.myAddress === this.messageObj.sender) return;
											this.setOpenUserInfo(true);
											this.setUserName(this.messageObj);
										}}
										class="message-data-avatar"
									>
										${avatarImg}
									</div>
								`
								: html`
									<div class="message-data-avatar"></div>
								`
							}
							<div
								class="${`
									message-subcontainer2
									${this.myAddress === this.messageObj.sender && 'message-myBg'}
									${
										(
											(this.isFirstMessage === true && this.isSingleMessageInGroup === false)
											|| (this.isSingleMessageInGroup === true && this.isLastMessageInGroup === true)
										) && this.myAddress !== this.messageObj.sender ?
											'message-triangle'
										: (
											(this.isFirstMessage === true && this.isSingleMessageInGroup === false)
											|| (this.isSingleMessageInGroup === true && this.isLastMessageInGroup === true)
										) && this.myAddress === this.messageObj.sender ?
											'message-myTriangle'
										: null
									}
								`}"
								style="
									${
										this.isSingleMessageInGroup === true
										&& this.isLastMessageInGroup === false ?
											'margin-bottom: 0;'
										: null
									}
									${
										this.isFirstMessage === false
											&& this.isSingleMessageInGroup === true
											&& this.isLastMessageInGroup === false ?
											'border-radius: 8px 25px 25px 8px;'
										: this.isFirstMessage === true
											&& this.isSingleMessageInGroup === true
											&& this.isLastMessageInGroup === false ?
											'border-radius: 27px 25px 25px 12px;'
										: this.isFirstMessage === false
											&& this.isSingleMessageInGroup === true
											&& this.isLastMessageInGroup === true ?
											'border-radius: 10px 25px 25px 0;'
										: this.isFirstMessage === true
											&& this.isSingleMessageInGroup === false
											&& this.isLastMessageInGroup === true ?
											'border-radius: 25px 25px 25px 0px;'
										: null
									}
								"
							>
								<div class="message-user-info">
									${this.isFirstMessage ?
										html`
											<span
												style=${this.myAddress === this.messageObj.sender ? 'cursor: auto;' : 'cursor: pointer;'}
												@click=${() => {
													if (this.myAddress === this.messageObj.sender) return;
													this.setOpenUserInfo(true);
													this.setUserName(this.messageObj);
												}}
												class="message-data-name"
											>
												${nameMenu}
											</span>
										`
										: null
									}
									${isForwarded ?
										html`
											<span class="forwarded-text">${forwarded}</span>
										`
										: null
									}
									${this.isFirstMessage ?
										html`
											<span class="message-data-level">${levelFounder}</span>
										`
										: null
									}
								</div>
								${repliedToData &&
									html`
										<div
											id="replyNameSize"
											class="original-message"
											style=${this.replyFontSize}
											@click=${() => {this.goToRepliedMessage(repliedToData, this.messageObj);}}
										>
											<p
												style=${'cursor: pointer; margin: 0 0 5px 0;'}
												class=${
													this.myAddress !== repliedToData.sender ?
													'original-message-sender' : 'message-data-my-name'
												}
											>
												${repliedToData.senderName ? repliedToData.senderName : cropAddress(repliedToData.sender)}
											</p>
											<p class="replied-message">
												${version && version.toString() === '1' ?
													html`
														<div id="replyFontSize" style=${this.replyFontSize}>
															${repliedToData.decodedMessage.messageText}
														</div>
													`
													: ''
												}
												${+version > 1 && repliedToMessageText ?
													html`
														<div id="replyFontSize" style=${this.replyFontSize}>
															${unsafeHTML(repliedToMessageText)}
														</div>
													`
													: ''
												}
											</p>
										</div>
									`
								}
								${image && !isImageDeleted && !this.viewImage && this.myAddress !== this.messageObj.sender ?
									html`
										<div
											@click=${() => {this.viewImage = true;}}
											class=${[`image-container`, !this.isImageLoaded ? 'defaultSize' : '',].join(' ')}
											style=${this.isFirstMessage && 'margin-top: 10px;'}
										>
											<div
												style="
													display: flex;
													width: 100%;
													height: 100%;
													justify-content: center;
													align-items: center;
													cursor: pointer;
													color: var(--black);
												"
											>
												${translate('chatpage.cchange40')}
											</div>
										</div>
									`
									: html``
								}
								${image && !isImageDeleted && (this.viewImage || this.myAddress === this.messageObj.sender) ?
									html`
										<div class=${[`image-container`,].join(' ')} style=${this.isFirstMessage && 'margin-top: 10px;'}>
											${imageHTML}
											${this.myAddress === this.messageObj.sender ?
												html`
													<vaadin-icon
														@click=${() => this.openDeleteImageDialog()}
														icon="vaadin:close"
														slot="icon"
														class="image-delete-icon"
													></vaadin-icon>
												`
												: ''
											}
										</div>
									`
									: image && isImageDeleted ?
										html`
											<div class="attachment-container">
												<div class="attachment-info">
													<p style=${'font-style: italic;'} class="attachment-name">
														${translate('chatpage.cchange80')}
													</p>
												</div>
											</div>
										`
									: html``
								}
								${gif && !isGifDeleted && !this.viewImage && this.myAddress !== this.messageObj.sender ?
									html`
										<div
											@click=${() => {this.viewImage = true;}}
											class=${[`image-container`, !this.isGifoaded ? 'defaultSize' : '', ].join(' ')}
											style=${this.isFirstMessage && 'margin-top: 10px;'}
										>
											<div
												style="
													display: flex;
													width: 100%;
													height: 100%;
													justify-content: center;
													align-items: center;
													cursor: pointer;
													color: var(--black);
												"
											>
												${translate('gifs.gchange25')}
											</div>
										</div>
									`
									: html``
								}
								${gif && !isGifDeleted && (this.viewImage || this.myAddress === this.messageObj.sender) ?
									html`
										<div
											class=${
												[`image-container`, !this.isGifLoaded ? 'defaultSize' : '',].join(' ')
											}
											style=${this.isFirstMessage && 'margin-top: 10px;'}
										>
											${gifHTML}
											${this.myAddress === this.messageObj.sender ?
												html`
													<vaadin-icon
														@click=${() => this.openDeleteGifDialog()}
														icon="vaadin:close"
														slot="icon"
														class="image-delete-icon"
													></vaadin-icon>
												`
												: ''
											}
										</div>
									`
									: gif && isGifDeleted ?
										html`
											<div class="attachment-container">
												<div class="attachment-info">
													<p style=${'font-style: italic;'} class="attachment-name">
														${translate('chatpage.cchange107')}
													</p>
												</div>
											</div>
										`
									: html``
								}
								${attachment && !isAttachmentDeleted ?
									html`
										<div class="attachment-container">
											<div class="attachment-icon-container">
												<img src="/img/attachment-icon.png" alt="attachment-icon" class="attachment-icon" />
											</div>
											<div class="attachment-info">
												<p class="attachment-name">
													${attachment && attachment.attachmentName}
												</p>
												${attachment.attachmentSize > 0 ?
												`<p class="attachment-size">
													${roundToNearestDecimal(attachment.attachmentSize)} mb
												</p>` : ''}
											</div>
											<vaadin-icon
												@click=${async () => await this.downloadAttachment(attachment)}
												icon="vaadin:download-alt"
												slot="icon"
												class="download-icon"
											></vaadin-icon>
											${this.myAddress === this.messageObj.sender ?
												html`
													<vaadin-icon
														@click=${() => this.openDeleteAttachmentDialog()}
														class="image-delete-icon"
														icon="vaadin:close"
														slot="icon"
													>
													</vaadin-icon>
												`
												: html``
											}
										</div>
									`
									: attachment && isAttachmentDeleted ?
										html`
											<div class="attachment-container">
												<div class="attachment-info">
													<p style=${'font-style: italic;'} class="attachment-name">
														${translate('chatpage.cchange82')}
													</p>
												</div>
											</div>
										`
									: html``
								}
								${file && !isFileDeleted ?
									html`
										<div class="file-container">
											<div class="file-icon-container">
												<img src="/img/file-icon.png" alt="file-icon" class="file-icon" />
											</div>
											<div class="attachment-info">
												<p class="attachment-name">
													${file && file.appFileName}
												</p>
												<p class="attachment-size">
													${roundToNearestDecimal(file.appFileSize)} mb
												</p>
											</div>
											<vaadin-icon
												@click=${async () => await this.downloadFile(file)}
												icon="vaadin:download-alt"
												slot="icon"
												class="download-icon"
											></vaadin-icon>
											${this.myAddress === this.messageObj.sender ?
												html`
													<vaadin-icon
														@click=${() => this.openDeleteFileDialog()}
														class="image-delete-icon"
														icon="vaadin:close"
														slot="icon"
													></vaadin-icon>
												`
												: html``
											}
										</div>
									`
									: file && isFileDeleted ?
										html`
											<div class="attachment-container">
												<div class="attachment-info">
													<p style=${'font-style: italic;'} class="attachment-name">
														${translate('chatpage.cchange102')}
													</p>
												</div>
											</div>
										`
									: html``
								}
								<div id="messageContent" class="message" style=${image && replacedMessage !== '' && 'margin-top: 15px;'}>
									${+version > 1 ? messageVersion2WithLink ?
										html`
											<div id="fontsize" style=${this.messageFontSize}>
												${messageVersion2WithLink}
											<div>
										`
										: html`
											<div id="fontsize" style=${this.messageFontSize}>
												${unsafeHTML(messageVersion2)}
											<div>
										`
										: ''
									}
									${version && version.toString() === '1' ?
										html`
											<div id="fontsize" style=${this.messageFontSize}>
												${unsafeHTML(this.emojiPicker.parse(replacedMessage))}
											<div>
										`
										: ''
									}
									${version && version.toString() === '0' ?
										html`
											${unsafeHTML(this.emojiPicker.parse(replacedMessage))}
										`
										: ''
									}
									<div
										style=${isEdited ? 'justify-content: space-between;' : 'justify-content: flex-end;'}
										class="${
											(this.isFirstMessage === false
												&& this .isSingleMessageInGroup === true
												&& this.isLastMessageInGroup === true
											) ||
											(this.isFirstMessage === true
												&& this.isSingleMessageInGroup === false
												&& this.isLastMessageInGroup === true
											) ? 'message-data-time' : 'message-data-time-hidden'
										}"
									>
										${isEdited ? html`<span>${edited}</span>` : ''}
										${this.isInProgress ? html`
											<p>${translate('chatpage.cchange91')}</p>
											` : this.isAgo ? html`
												<div style="display: flex; align-items: center;">
													<div style="margin-top: 4px;">
														${isEncrypted ? html`${encrypted}` : html`${decrypted}`}
													</div>
													<div id="timeformat">
														<span>
															<message-time timestamp=${this.messageObj.timestamp}></message-time>
														</span>
													</div>
												</div>
											` : this.isIso ? html`
												<div style="display: flex; align-items: center;">
													<div style="margin-top: 4px;">
														${isEncrypted ? html`${encrypted}` : html`${decrypted}`}
													</div>
													<div id="timeformat">
														<span>
															${new Date(this.messageObj.timestamp).toLocaleString()}
														</span>
													</div>
												</div>
											` : this.isBoth ? html`
												<div style="display: flex; align-items: center;">
													<div style="margin-top: 4px;">
														${isEncrypted ? html`${encrypted}` : html`${decrypted}`}
													</div>
													<div id="timeformat">
														<span>
															${new Date(this.messageObj.timestamp).toLocaleString()}
															( <message-time timestamp=${this.messageObj.timestamp}></message-time> )
														</span>
													</div>
												</div>
											` : ''
										}
								</div>
							</div>
						</div>
						${this.isInProgress ? '' :
							html`
								<chat-menu
									tabindex="0"
									class="chat-hover"
									style="${this.showBlockAddressIcon && 'display: block;'}"
									toblockaddress="${this.messageObj.sender}"
									.showPrivateMessageModal=${() => this.showPrivateMessageModal()}
									.showBlockUserModal=${() => this.showBlockUserModal()}
									.showBlockIconFunc=${(props) => this.showBlockIconFunc(props)}
									.showBlockAddressIcon=${this.showBlockAddressIcon}
									.originalMessage=${{...this.messageObj, message,}}
									.setRepliedToMessageObj=${this.setRepliedToMessageObj}
									.setEditedMessageObj=${this.setEditedMessageObj}
									.myAddress=${this.myAddress}
									@blur=${() => this.showBlockIconFunc(false)}
									.sendMessage=${this.sendMessage}
									.sendMessageForward=${this.sendMessageForward}
									version=${version}
									.emojiPicker=${this.emojiPicker}
									.setToggledMessage=${this.setToggledMessage}
									.setForwardProperties=${this.setForwardProperties}
									?firstMessageInChat=${this.messageObj.firstMessageInChat}
									.setOpenPrivateMessage=${(val) => this.setOpenPrivateMessage(val)}
									.setOpenTipUser=${(val) => this.setOpenTipUser(val)}
									.setUserName=${(val) => this.setUserName(val)}
									.gif=${!!gif}
								>
								</chat-menu>
							`
						}
					</div>
					<div class="message-reactions" style="${reactions.length > 0 && 'margin-top: 10px; margin-bottom: 5px;'}">
						${reactions.map((reaction, index) => {
							return html`
								<span
									@click=${() => this.sendMessage({type: 'reaction', editedMessageObj: this.messageObj, reaction: reaction.type,})}
									id=${`reactions-${index}`}
									class="reactions-bg"
								>
									${reaction.type} ${reaction.qty}
									<vaadin-tooltip
										for=${`reactions-${index}`}
										position="top"
										hover-delay=${400}
										hide-delay=${1}
										text=${
											reaction.users.length > 3 ?
												`
													${reaction.users[0].name ? reaction.users[0].nameMessageTemplate : cropAddress(reaction.users[0].address)},
													${reaction.users[1].name ? reaction.users[1].name : cropAddress(reaction.users[1].address)},
													${reaction.users[2].name ? reaction.users[2].name : cropAddress(reaction.users[2].address)} ${get('chatpage.cchange71')}
													${reaction.users.length - 3} ${get('chatpage.cchange72')}
													${reaction.users.length - 3 > 1 ? html`${get('chatpage.cchange73')}` : ''}
													${get('chatpage.cchange74')}
													${reaction.type}
												`
											: reaction.users.length === 3 ?
												`
													${reaction.users[0].name ? reaction.users[0].name : cropAddress(reaction.users[0].address)},
													${reaction.users[1].name ? reaction.users[1].name : cropAddress(reaction.users[1].address)}
													${get('chatpage.cchange71')}
													${reaction.users[2].name ? reaction.users[2].name : cropAddress(reaction.users[2].address)}
													${get('chatpage.cchange74')}
													${reaction.type}
												`
											: reaction.users.length === 2 ?
												`
													${reaction.users[0].name ? reaction.users[0].name : cropAddress(reaction.users[0].address)}
													${get('chatpage.cchange71')}
													${reaction.users[1].name ? reaction.users[1].namMessageTemplatee : cropAddress(reaction.users[1].address)}
													${get('chatpage.cchange74')}
													${reaction.type}
												`
											: reaction.users.length === 1 ?
												`
													${reaction.users[0].name ? reaction.users[0].name : cropAddress(reaction.users[0].address)}
													${get('chatpage.cchange74')}
													${reaction.type}
												`
											: ''
										}
									>
									</vaadin-tooltip>
								</span>
							`
						})}
					</div>
				</div>
			</li>
			<chat-modals
				.openDialogPrivateMessage=${this.openDialogPrivateMessage}
				.openDialogBlockUser=${this.openDialogBlockUser}
				nametodialog="${this.messageObj.senderName ? this.messageObj.senderName : this.messageObj.sender}"
				.hidePrivateMessageModal=${() => this.hidePrivateMessageModal()}
				.hideBlockUserModal=${() => this.hideBlockUserModal()}
				toblockaddress=${this.messageObj.sender}
			>
			</chat-modals>
			<mwc-dialog id="showDialogPublicKey" ?open=${this.openDialogImage} @closed=${() => {this.openDialogImage = false;}}>
				<div class="dialog-header"></div>
				<div class="dialog-container imageContainer">
					${this.openDialogImage ? html`<img src=${imageUrl} style="height: auto; max-height: 80vh; width: auto; max-width: 80vw; object-fit: contain; border-radius: 5px;">` : ''}
				</div>
				<mwc-button slot="primaryAction" dialogAction="cancel" class="red" @click=${() => {this.openDialogImage = false;}}>
					${translate('general.close')}
				</mwc-button>
			</mwc-dialog>
			<mwc-dialog id="showDialogPublicKey" ?open=${this.openDialogGif} @closed=${() => {this.openDialogGif = false;}}>
				<div class="dialog-header"></div>
				<div class="dialog-container imageContainer">
					${gifHTMLDialog}
				</div>
				<mwc-button slot="primaryAction" dialogAction="cancel" class="red" @click=${() => {this.openDialogGif = false;}}>
					${translate('general.close')}
				</mwc-button>
			</mwc-dialog>
			<mwc-dialog hideActions id="deleteImageDialog" scrimClickAction="" escapeKeyAction="">
				<div class="delete-image-msg">
					<p>${translate('chatpage.cchange78')}</p>
				</div>
				<div class="modal-button-row">
					<button class="modal-button-red" @click=${() => this.closeDeleteImageDialog()}>
						${translate('login.lp4')}
					</button>
					<button class="modal-button" @click=${() => {
						this.sendMessage({type: 'delete', name: image.name, identifier: image.identifier, editedMessageObj: this.messageObj});
						this.closeDeleteImageDialog();
					}}>
						${translate('general.yes')}
					</button>
				</div>
			</mwc-dialog>
			<mwc-dialog hideActions id="deleteGifDialog" scrimClickAction="" escapeKeyAction="">
				<div class="delete-image-msg">
					<p>${translate('chatpage.cchange106')}</p>
				</div>
				<div class="modal-button-row">
					<button class="modal-button-red" @click=${() => this.closeDeleteGifDialog()}>
						${translate('login.lp4')}
					</button>
					<button class="modal-button" @click=${() => {
						this.sendMessage({type: 'deleteGif', gif: gif, name: gif.name, identifier: gif.identifier, editedMessageObj: this.messageObj});
						this.closeDeleteGifDialog();
					}}>
						${translate('general.yes')}
					</button>
				</div>
			</mwc-dialog>
			<mwc-dialog hideActions id="deleteAttachmentDialog" scrimClickAction="" escapeKeyAction="">
				<div class="delete-image-msg">
					<p>${translate('chatpage.cchange79')}</p>
				</div>
				<div class="modal-button-row">
					<button class="modal-button-red" @click=${() => this.closeDeleteAttachmentDialog()}>
						${translate('login.lp4')}
					</button>
					<button class="modal-button" @click=${() => {
						this.sendMessage({type: 'deleteAttachment', attachment: attachment, name: attachment.name, identifier: attachment.identifier, editedMessageObj: this.messageObj});
						this.closeDeleteAttachmentDialog();
					}}>
						${translate('general.yes')}
					</button>
				</div>
			</mwc-dialog>
			<mwc-dialog hideActions id="deleteFileDialog" scrimClickAction="" escapeKeyAction="">
				<div class="delete-image-msg">
					<p>${translate('chatpage.cchange101')}</p>
				</div>
				<div class="modal-button-row">
					<button class="modal-button-red" @click=${() => this.closeDeleteFileDialog()}>
						${translate('login.lp4')}
					</button>
					<button class="modal-button" @click=${() => {
						this.sendMessage({type: 'deleteFile', file: file, name: file.name, identifier: file.identifier, editedMessageObj: this.messageObj});
						this.closeDeleteFileDialog();
					}}>
						${translate('general.yes')}
					</button>
				</div>
			</mwc-dialog>
			<paper-dialog id="downloadProgressDialog" class="progress" modal>
				<span class="close-download"><paper-icon-button icon="icons:close" @click="${() => this.closeDownloadProgressDialog()}" title="${translate("general.close")}"></paper-icon-button></span>
				<div class="lds-roller">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
				<h2>${translate('appspage.schange41')}</h2>
			</paper-dialog>
			<paper-dialog id="closeProgressDialog" class="close-progress" modal>
				${translate('chatpage.cchange108')}
			</paper-dialog>
		`
	}

	firstUpdated() {
		window.addEventListener('storage', () => {
			if (localStorage.getItem('timestampForChats') !== this.timeId) {
				this.timeId = localStorage.getItem('timestampForChats')

				if (this.timeId === 'ago') {
					this.isAgo = true
					this.isIso = false
					this.isBoth = false
					const setTimeFormatAgo = this.shadowRoot.querySelectorAll('#timeformat')
					setTimeFormatAgo.forEach((replaceToAgo) => {
						replaceToAgo.innerHTML = `
							<span>
								<message-time timestamp=${this.messageObj.timestamp}></message-time>
							</span>
						`
					})
				} else if (this.timeId === 'iso') {
					this.isAgo = false
					this.isIso = true
					this.isBoth = false
					const setTimeFormatIso = this.shadowRoot.querySelectorAll('#timeformat')
					setTimeFormatIso.forEach((replaceToIso) => {
						replaceToIso.innerHTML = `
							<span>
								${new Date(this.messageObj.timestamp).toLocaleString()}
							</span>
						`
					})
				} else if (this.timeId === 'both') {
					this.isAgo = false
					this.isIso = false
					this.isBoth = true
					const setTimeFormatBoth = this.shadowRoot.querySelectorAll('#timeformat')
					setTimeFormatBoth.forEach((replaceToBoth) => {
						replaceToBoth.innerHTML = `
							<span>
								${new Date(this.messageObj.timestamp).toLocaleString()}
								( <message-time timestamp=${this.messageObj.timestamp}></message-time> )
							</span>
						`
					})
				}
			}

			if (localStorage.getItem('fontsizeForChats') !== this.messageFontSize) {
				this.messageFontSize = localStorage.getItem('fontsizeForChats')
				if (this.messageFontSize === 'font16') {
					const setFontSize16 = this.shadowRoot.querySelectorAll('#fontsize')
					setFontSize16.forEach((replaceFontSizeTo16) => {
						replaceFontSizeTo16.removeAttribute("style")
						replaceFontSizeTo16.setAttribute("style", "font-size: 16px;")
					})
					const setNameSize16 = this.shadowRoot.querySelectorAll('#namesize')
					setNameSize16.forEach((replaceNameSizeTo16) => {
						replaceNameSizeTo16.removeAttribute("style")
						replaceNameSizeTo16.setAttribute("style", "font-size: 16px;")
					})
					const setReplyFontSize16 = this.shadowRoot.querySelectorAll('#replyFontSize')
					setReplyFontSize16.forEach((replaceReplayFontSizeTo16) => {
						replaceReplayFontSizeTo16.removeAttribute("style")
						replaceReplayFontSizeTo16.setAttribute("style", "font-size: 14px;")
					})
					const setReplyNameSize16 = this.shadowRoot.querySelectorAll('#replyNameSize')
					setReplyNameSize16.forEach((replaceReplayNameSizeTo16) => {
						replaceReplayNameSizeTo16.removeAttribute("style")
						replaceReplayNameSizeTo16.setAttribute("style", "font-size: 14px;")
					})
				} else if (this.messageFontSize === 'font18') {
					const setFontSize18 = this.shadowRoot.querySelectorAll('#fontsize')
					setFontSize18.forEach((replaceFontSizeTo18) => {
						replaceFontSizeTo18.removeAttribute("style")
						replaceFontSizeTo18.setAttribute("style", "font-size: 18px;")
					})
					const setNameSize18 = this.shadowRoot.querySelectorAll('#namesize')
					setNameSize18.forEach((replaceNameSizeTo18) => {
						replaceNameSizeTo18.removeAttribute("style")
						replaceNameSizeTo18.setAttribute("style", "font-size: 18px;")
					})
					const setReplyFontSize18 = this.shadowRoot.querySelectorAll('#replyFontSize')
					setReplyFontSize18.forEach((replaceReplayFontSizeTo18) => {
						replaceReplayFontSizeTo18.removeAttribute("style")
						replaceReplayFontSizeTo18.setAttribute("style", "font-size: 16px;")
					})
					const setReplyNameSize18 = this.shadowRoot.querySelectorAll('#replyNameSize')
					setReplyNameSize18.forEach((replaceReplayNameSizeTo18) => {
						replaceReplayNameSizeTo18.removeAttribute("style")
						replaceReplayNameSizeTo18.setAttribute("style", "font-size: 16px;")
					})
				} else if (this.messageFontSize === 'font20') {
					const setFontSize20 = this.shadowRoot.querySelectorAll('#fontsize')
					setFontSize20.forEach((replaceFontSizeTo20) => {
						replaceFontSizeTo20.removeAttribute("style")
						replaceFontSizeTo20.setAttribute("style", "font-size: 20px;")
					})
					const setNameSize20 = this.shadowRoot.querySelectorAll('#namesize')
					setNameSize20.forEach((replaceNameSizeTo20) => {
						replaceNameSizeTo20.removeAttribute("style")
						replaceNameSizeTo20.setAttribute("style", "font-size: 20px;")
					})
					const setReplyFontSize20 = this.shadowRoot.querySelectorAll('#replyFontSize')
					setReplyFontSize20.forEach((replaceReplayFontSizeTo20) => {
						replaceReplayFontSizeTo20.removeAttribute("style")
						replaceReplayFontSizeTo20.setAttribute("style", "font-size: 18px;")
					})
					const setReplyNameSize20 = this.shadowRoot.querySelectorAll('#replyNameSize')
					setReplyNameSize20.forEach((replaceReplayNameSizeTo20) => {
						replaceReplayNameSizeTo20.removeAttribute("style")
						replaceReplayNameSizeTo20.setAttribute("style", "font-size: 18px;")
					})
				} else if (this.messageFontSize === 'font22') {
					const setFontSize22 = this.shadowRoot.querySelectorAll('#fontsize')
					setFontSize22.forEach((replaceFontSizeTo22) => {
						replaceFontSizeTo22.removeAttribute("style")
						replaceFontSizeTo22.setAttribute("style", "font-size: 22px;")
					})
					const setNameSize22 = this.shadowRoot.querySelectorAll('#namesize')
					setNameSize22.forEach((replaceNameSizeTo22) => {
						replaceNameSizeTo22.removeAttribute("style")
						replaceNameSizeTo22.setAttribute("style", "font-size: 22px;")
					})
					const setReplyFontSize22 = this.shadowRoot.querySelectorAll('#replyFontSize')
					setReplyFontSize22.forEach((replaceReplayFontSizeTo22) => {
						replaceReplayFontSizeTo22.removeAttribute("style")
						replaceReplayFontSizeTo22.setAttribute("style", "font-size: 20px;")
					})
					const setReplyNameSize22 = this.shadowRoot.querySelectorAll('#replyNameSize')
					setReplyNameSize22.forEach((replaceReplayNameSizeTo22) => {
						replaceReplayNameSizeTo22.removeAttribute("style")
						replaceReplayNameSizeTo22.setAttribute("style", "font-size: 20px;")
					})
				}
			}
		})

		const autoSeeChatList = window.parent.reduxStore.getState().app.autoLoadImageChats

		if (autoSeeChatList.includes(this.chatId) || this.listSeenMessages.includes(this.messageObj.signature)) {
			this.viewImage = true
		}

		const tooltips = this.shadowRoot.querySelectorAll('vaadin-tooltip')

		tooltips.forEach((tooltip) => {
			const overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay')
			overlay.shadowRoot.getElementById('overlay').style.cssText =
				'background-color: transparent; box-shadow: rgb(50 50 93 / 25%) 0px 2px 5px -1px, rgb(0 0 0 / 30%) 0px 1px 3px -1px'
			overlay.shadowRoot.getElementById('content').style.cssText =
				'background-color: var(--reactions-tooltip-bg); color: var(--chat-bubble-msg-color); text-align: center; padding: 20px 10px; border-radius: 8px; font-family: Roboto, sans-serif; letter-spacing: 0.3px; font-weight: 300; font-size: 13.5px; transition: all 0.3s ease-in-out;'
		})

		this.clearConsole()

		setInterval(() => {
			this.clearConsole()
		}, 60000)
	}

	convertHubMessageToJson(message) {
		let newJson = generateJSON(`${message}`, [StarterKit, Underline, Highlight, Mention])
		return generateHTML(newJson, [StarterKit, Underline, Highlight, Mention])
	}

	async closeDownloadProgressDialog() {
		const closeDelay = ms => new Promise(res => setTimeout(res, ms))
		this.shadowRoot.getElementById('downloadProgressDialog').close()
		this.shadowRoot.getElementById('closeProgressDialog').open()
		await closeDelay(3000)
		this.shadowRoot.getElementById('closeProgressDialog').close()
	}

	// Open & Close Private Message Chat Modal
	showPrivateMessageModal() {
		this.openDialogPrivateMessage = true
	}

	hidePrivateMessageModal() {
		this.openDialogPrivateMessage = false
	}

	// Open & Close Block User Chat Modal
	showBlockUserModal() {
		this.openDialogBlockUser = true
	}

	hideBlockUserModal() {
		this.openDialogBlockUser = false
	}

	showBlockIconFunc(bool) {
		if (bool) {
			this.showBlockAddressIcon = true
		} else {
			this.showBlockAddressIcon = false
		}
	}

	openDeleteImageDialog() {
		this.openDeleteImage = true
		this.shadowRoot.querySelector('#deleteImageDialog').show()
	}

	closeDeleteImageDialog() {
		this.shadowRoot.querySelector('#deleteImageDialog').close()
		this.openDeleteImage = false
	}

	openDeleteGifDialog() {
		this.openDeleteGif = true
		this.shadowRoot.querySelector('#deleteGifDialog').show()
	}

	closeDeleteGifDialog() {
		this.shadowRoot.querySelector('#deleteGifDialog').close()
		this.openDeleteGif = false
	}

	openDeleteAttachmentDialog() {
		this.openDeleteAttachment = true
		this.shadowRoot.querySelector('#deleteAttachmentDialog').show()
	}

	closeDeleteAttachmentDialog() {
		this.shadowRoot.querySelector('#deleteAttachmentDialog').close()
		this.openDeleteAttachment = false
	}

	openDeleteFileDialog() {
		this.openDeleteFile = true
		this.shadowRoot.querySelector('#deleteFileDialog').show()
	}

	closeDeleteFileDialog() {
		this.shadowRoot.querySelector('#deleteFileDialog').close()
		this.openDeleteFile = false
	}

	downloadAttachment(attachment) {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port

		this.shadowRoot.getElementById('downloadProgressDialog').open()

		try {
			axios.get(
				`${nodeUrl}/arbitrary/ATTACHMENT/${attachment.name}/${attachment.identifier}`,
				{ responseType: 'blob' }
			).then((response) => {
				this.shadowRoot.getElementById('downloadProgressDialog').close()
				let filename = attachment.attachmentName
				let blob = new Blob([response.data], { type: 'application/octet-stream' })
				this.shadowRoot.getElementById('downloadProgressDialog').close()
				this.saveFileToDisk(blob, filename)
			})
		} catch (error) {
			console.error(error)
		}
	}

	downloadFile(file) {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port

		this.shadowRoot.getElementById('downloadProgressDialog').open()

		try {
			axios.get(
				`${nodeUrl}/arbitrary/FILE/${file.name}/${file.identifier}`,
				{ responseType: 'blob' }
			).then((response) => {
				this.shadowRoot.getElementById('downloadProgressDialog').close()
				let filename = file.appFileName
				let blob = new Blob([response.data], { type: 'application/octet-stream' })
				this.saveFileToDisk(blob, filename)
			})
		} catch (error) {
			console.error(error)
		}
	}

	async saveFileToDisk(blob, fileName) {
		try {
			const fileHandle = await self.showSaveFilePicker({
				suggestedName: fileName,
				types: [{ description: 'File' }]
			})

			const writeFile = async (fileHandle, contents) => {
				const writable = await fileHandle.createWritable()
				await writable.write(contents)
				await writable.close()
			}

			await writeFile(fileHandle, blob).then(() => console.log('FILE SAVED'))
		} catch (error) {
			console.error(error)
		}
	}

	setOpenDialogImage(val) {
		this.openDialogImage = val
	}

	setOpenDialogGif(val) {
		this.openDialogGif = val
	}

	shouldUpdate(changedProperties) {
		if (changedProperties.has('messageObj')) {
			return true
		}

		if (changedProperties.has('showBlockAddressIcon')) {
			return true
		}

		if (changedProperties.has('openDialogBlockUser')) {
			return true
		}

		if (changedProperties.has('viewImage')) {
			return true
		}

		if (changedProperties.has('isImageLoaded')) {
			return true
		}

		if (changedProperties.has('openDialogImage')) {
			return true
		}

		if (changedProperties.has('openDialogPrivateMessage')) {
			return true
		}

		if (changedProperties.has('openDialogGif')) {
			return true
		}

		if (changedProperties.has('isGifLoaded')) {
			return true
		}

		return false
	}

	clearConsole() {
		if (!isElectron()) {
		} else {
			console.clear()
			window.parent.electronAPI.clearCache()
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

window.customElements.define('message-template', MessageTemplate)

class ChatMenu extends LitElement {
	static get properties() {
		return {
			menuItems: { type: Array },
			showPrivateMessageModal: { attribute: false },
			showBlockUserModal: { attribute: false },
			toblockaddress: { type: String, attribute: true },
			showBlockIconFunc: { attribute: false },
			showBlockAddressIcon: { type: Boolean },
			originalMessage: { type: Object },
			setRepliedToMessageObj: { attribute: false },
			setEditedMessageObj: { attribute: false },
			myAddress: { type: Object },
			emojiPicker: { attribute: false },
			sendMessage: { attribute: false },
			version: { type: String },
			setToggledMessage: { attribute: false },
			sendMessageForward: { attribute: false },
			setForwardProperties: { attribute: false },
			firstMessageInChat: { type: Boolean },
			setOpenPrivateMessage: { attribute: false },
			setOpenTipUser: { attribute: false },
			setUserName: { attribute: false },
			gif: { type: Boolean }
		}
	}

	static get styles() {
		return [chatStyles]
	}

	constructor() {
		super()
		this.showPrivateMessageModal = () => { }
		this.showBlockUserModal = () => { }
	}

	render() {
		return html`
			<div class="container">
				<div
					class=${`menu-icon ${!this.firstMessageInChat ? 'tooltip' : ''}`}
					data-text="${translate('blockpage.bcchange14')}"
					@click="${() => {if (this.version === '0') {this.versionErrorSnack(); return;} this.messageForwardFunc();}}"
				>
					<vaadin-icon icon="vaadin:arrow-forward" slot="icon"></vaadin-icon>
				</div>
				<div
					class=${`menu-icon ${!this.firstMessageInChat ? 'tooltip' : ''}`}
					data-text="${translate('blockpage.bcchange9')}"
					@click="${() => this.setOpenPrivateMessage({name: this.originalMessage.senderName ? this.originalMessage.senderName : this.originalMessage.sender, open: true,})}"
				>
					<vaadin-icon icon="vaadin:paperplane" slot="icon"></vaadin-icon>
				</div>
				<div
					class=${`menu-icon ${!this.firstMessageInChat ? 'tooltip' : ''}`}
					data-text="${translate('blockpage.bcchange8')}"
					@click="${() => this.copyToClipboard(this.toblockaddress)}"
				>
					<vaadin-icon icon="vaadin:copy" slot="icon"></vaadin-icon>
				</div>
				<div
					class=${`menu-icon ${!this.firstMessageInChat ? 'tooltip' : ''}`}
					data-text="${translate('blockpage.bcchange11')}"
					@click="${() => {if (this.version === '0') {this.versionErrorSnack(); return;} this.setRepliedToMessageObj({...this.originalMessage, version: this.version,});}}"
				>
					<vaadin-icon icon="vaadin:reply" slot="icon"></vaadin-icon>
				</div>
				${this.myAddress === this.originalMessage.sender && !this.gif ?
					html`
						<div
							class=${`menu-icon ${!this.firstMessageInChat ? 'tooltip' : ''}`}
							data-text="${translate('blockpage.bcchange12')}"
							@click=${() => {
								if (this.version === '0') {
									this.versionErrorSnack(); 
									return;
								}
								this.setEditedMessageObj(this.originalMessage);
							}}
						>
							<vaadin-icon icon="vaadin:pencil" slot="icon"></vaadin-icon>
						</div>
					`
					: html`
						<div></div>
					`
				}
				${this.myAddress !== this.originalMessage.sender ?
					html`
						<div
							class=${`menu-icon ${!this.firstMessageInChat ? 'tooltip' : ''}`}
							data-text="${translate('blockpage.bcchange18')}"
							@click=${(e) => {e.preventDefault(); this.setUserName(this.originalMessage); this.setOpenTipUser(true);}}
						>
							<vaadin-icon icon="vaadin:dollar" slot="icon"></vaadin-icon>
						</div>
					`
					: html`
						<div></div>
					`
				}
				<div
					class=${`menu-icon ${!this.firstMessageInChat ? 'tooltip' : ''}`}
					data-text="${translate('blockpage.bcchange10')}"
					@click="${() => this.showBlockIconFunc(true)}"
				>
					<vaadin-icon icon="vaadin:ellipsis-dots-h" slot="icon"></vaadin-icon>
				</div>
				${this.showBlockAddressIcon ?
					html`
						<div class="block-user-container">
							<div class="block-user" @click="${() => this.showBlockUserModal()}">
								<p>${translate('blockpage.bcchange1')}</p>
								<vaadin-icon icon="vaadin:close-circle" slot="icon"></vaadin-icon>
							</div>
						</div>
					`
					: html`
						<div></div>
					`
				}
			</div>
		`
	}

	firstUpdated() {
		// ...
	}

	// Copy address to clipboard
	async copyToClipboard(text) {
		try {
			let copyString1 = get('walletpage.wchange4')
			await navigator.clipboard.writeText(text)
			parentEpml.request('showSnackBar', `${copyString1}`)
		} catch (err) {
			let copyString2 = get('walletpage.wchange39')
			parentEpml.request('showSnackBar', `${copyString2}`)
			console.error('Copy to clipboard error:', err)
		}
	}

	versionErrorSnack() {
		let errorMsg = get('chatpage.cchange34')
		parentEpml.request('showSnackBar', `${errorMsg}`)
	}

	async messageForwardFunc() {
		let parsedMessageObj = {}
		let publicKey = {
			hasPubKey: false,
			key: '',
		}
		try {
			parsedMessageObj = JSON.parse(this.originalMessage.decodedMessage)
		} catch (error) {
			parsedMessageObj = {}
		}

		try {
			const res = await parentEpml.request('apiCall', {
				type: 'api',
				url: `/addresses/publickey/${this._chatId}`,
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
		} catch (error) {
			/* empty */
		}

		try {
			const message = {
				...parsedMessageObj,
				type: 'forward',
			}
			const stringifyMessageObject = JSON.stringify(message)
			this.setForwardProperties(stringifyMessageObject)
		} catch (error) {
			/* empty */
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

window.customElements.define('chat-menu', ChatMenu)
