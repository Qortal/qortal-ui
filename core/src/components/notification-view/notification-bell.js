import { css, html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store'
import { setNewTab } from '../../redux/app/app-actions'
import { routes } from '../../plugins/routes'
import { notificationBellStyles } from '../../styles/core-css'
import config from '../../notifications/config'
import '../../../../plugins/plugins/core/components/TimeAgo'
import '@material/mwc-icon'
import '@polymer/paper-icon-button/paper-icon-button'
import '@polymer/iron-icons/iron-icons.js'
import '@vaadin/item'
import '@vaadin/list-box'

class NotificationBell extends connect(store)(LitElement) {
	static get properties() {
		return {
			notifications: { type: Array },
			showNotifications: { type: Boolean },
			notificationCount: { type: Boolean },
			theme: { type: String, reflect: true }
		}
	}

	static get styles() {
		return [notificationBellStyles]
	}

	constructor() {
		super()
		this.notifications = []
		this.showNotifications = false
		this.notificationCount = false
		this.initialFetch = false
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
	}

	render() {
		return html`
			<div class="layout">
				${this.notificationCount ? html`
					<mwc-icon @click=${() => this._toggleNotifications()} id="notification-mail-icon" style="color: green;cursor:pointer;user-select:none">
						mail
					</mwc-icon>
					<vaadin-tooltip
						for="notification-mail-icon"
						position="bottom"
						hover-delay=${400}
						hide-delay=${1}
						text="Q-Mail">
					</vaadin-tooltip>
				` : html`
					<mwc-icon @click=${() => this._openTabQmail()} id="notification-mail-icon" style="color: var(--black); cursor:pointer;user-select:none">
						mail
					</mwc-icon>
					<vaadin-tooltip
						for="notification-mail-icon"
						position="bottom"
						hover-delay=${400}
						hide-delay=${1}
						text="Q-Mail">
					</vaadin-tooltip>
				`}
				${this.notificationCount ? html`
					<span class="count">${this.notifications.length}</span>
				` : ''}
				<div class="popover-panel" ?hidden=${!this.showNotifications}>
					<div class="notifications-list">
						${this.notifications.map(notification => html`
							<div
								class="notification-item"
								@click=${() => {
									const query = `?service=APP&name=Q-Mail`
									store.dispatch(setNewTab({
										url: `qdn/browser/index.html${query}`,
										id: 'q-mail-notification',
										myPlugObj: {
											"url": "myapp",
											"domain": "core",
											"page": `qdn/browser/index.html${query}`,
											"title": "Q-Mail",
											"icon": "vaadin:mailbox",
											"mwcicon": "mail_outline",
											"menus": [],
											"parent": false
										}
									}))
									this.showNotifications = false
									this.notifications = []
								}}
							>
								<div>
									<p>Q-Mail</p>
									<message-time timestamp=${notification.created} style="color:red;font-size:12px"></message-time>
								</div>
								<div>
									<p>${notification.name}</p>
								</div>
							</div>
						`)}
					</div>
				</div>
			</div>
		`
	}

	firstUpdated() {
		this.getNotifications()

		document.addEventListener('click', (event) => {
			const path = event.composedPath()
			if (!path.includes(this)) {
				this.showNotifications = false
			}
		})
	}

	getApiKey() {
		const apiNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		return apiNode.apiKey
	}

	async getNotifications() {
		const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port

		let interval = null
		let stop = false

		const getNewMail = async () => {
			const getMail = async (recipientName, recipientAddress) => {
				const query = `qortal_qmail_${recipientName.slice(
					0,
					20
				)}_${recipientAddress.slice(-6)}_mail_`

				const url = `${nodeUrl}/arbitrary/resources/search?service=MAIL_PRIVATE&query=${query}&limit=10&includemetadata=false&offset=0&reverse=true&excludeblocked=true`

				const response = await fetch(url, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				})

				return await response.json()
			}

			if (!stop && !this.showNotifications) {
				stop = true

				try {
					const address = window.parent.reduxStore.getState().app?.selectedAddress?.address;
					const name = window.parent.reduxStore.getState().app?.accountInfo?.names[0]?.name

					if (!name || !address) return

					const mailArray = await getMail(name, address)

					let notificationsToShow = []

					if (mailArray.length > 0) {
						const lastVisited = localStorage.getItem("Q-Mail-last-visited")

						if (lastVisited) {
							mailArray.forEach((mail) => {
								if (mail.created > lastVisited) notificationsToShow.push(mail)
							})
						} else {
							notificationsToShow = mailArray
						}

					}

					if (!this.initialFetch && notificationsToShow.length > 0) {
						const mail = notificationsToShow[0]
						const urlPic = `${nodeUrl}/arbitrary/THUMBNAIL/${mail.name}/qortal_avatar?async=true}`

						await routes.showNotification({
							data: {
								title: 'New Q-Mail',
								type: 'qapp',
								sound: config.messageAlert,
								url: '',
								options: {
									body: `You have an unread mail from ${mail.name}`,
									icon: urlPic,
									badge: urlPic
								}
							}
						})
					} else if (notificationsToShow.length > 0) {
						if (notificationsToShow[0].created > (this.notifications[0]?.created || 0)) {
							const mail = notificationsToShow[0]
							const urlPic = `${nodeUrl}/arbitrary/THUMBNAIL/${mail.name}/qortal_avatar?async=true}`

							await routes.showNotification({
								data: {
									title: 'New Q-Mail',
									type: 'qapp',
									sound: config.messageAlert,
									url: '',
									options: {
										body: `You have an unread mail from ${mail.name}`,
										icon: urlPic,
										badge: urlPic
									}
								}
							})
						}
					}

					this.notifications = notificationsToShow

					this.notificationCount = this.notifications.length !== 0

					if (!this.initialFetch) this.initialFetch = true
				} catch (error) {
					console.error(error)
				}

				stop = false
			}
		}

		try {
			setTimeout(() => {
				getNewMail()
			}, 5000)

			interval = setInterval(getNewMail, 60000)
		} catch (error) {
			console.error(error)
		}
	}

	_toggleNotifications() {
		if (this.notifications.length === 0) return
		this.showNotifications = !this.showNotifications
	}

	_openTabQmail() {
		const query = `?service=APP&name=Q-Mail`

		store.dispatch(setNewTab({
			url: `qdn/browser/index.html${query}`,
			id: 'q-mail-notification',
			myPlugObj: {
				"url": "myapp",
				"domain": "core",
				"page": `qdn/browser/index.html${query}`,
				"title": "Q-Mail",
				"icon": "vaadin:mailbox",
				"mwcicon": "mail_outline",
				"menus": [],
				"parent": false
			}
		}))
	}
}

window.customElements.define('notification-bell', NotificationBell)