import { LitElement, html, css } from 'lit'
import { connect } from 'pwa-helpers'

import '@vaadin/item'
import '@vaadin/list-box'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/iron-icons/iron-icons.js'
import { store } from '../../store.js'
import { setNewTab } from '../../redux/app/app-actions.js'
import { routes } from '../../plugins/routes.js'
import config from '../../notifications/config.js'
import '../../../../plugins/plugins/core/components/TimeAgo.js'

class NotificationBell extends connect(store)(LitElement) {

    static properties = {
        notifications: { type: Array },
        showNotifications: { type: Boolean },
        notificationCount: { type: Boolean },
        theme: { type: String, reflect: true },
    }

    constructor() {
        super()
        this.notifications = []
        this.showNotifications = false
        this.notificationCount = false
        this.initialFetch = false
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    firstUpdated() {
        this.getNotifications();
        document.addEventListener('click', (event) => {
            const path = event.composedPath()
            if (!path.includes(this)) {
                this.showNotifications = false
            }
        })
    }

    getApiKey() {
        const apiNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        let apiKey = apiNode.apiKey
        return apiKey
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
                const url = `${nodeUrl}/arbitrary/resources/search?service=MAIL_PRIVATE&query=${query}&limit=10&includemetadata=true&offset=0&reverse=true&excludeblocked=true`
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                const data = await response.json()
                return data;
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
                        const urlPic = `${nodeUrl}/arbitrary/THUMBNAIL/${mail.name}/qortal_avatar?async=true&apiKey=${this.getApiKey()}`
                        routes.showNotification({
                            data: { title: "New Q-Mail", type: "qapp", sound: config.messageAlert, url: "", options: { body: `You have an unread mail from ${mail.name}`, icon: urlPic, badge: urlPic } }
                        })
                    } else if (notificationsToShow.length > 0) {
                        if (notificationsToShow[0].created > (this.notifications[0]?.created || 0)) {
                            const mail = notificationsToShow[0]
                            const urlPic = `${nodeUrl}/arbitrary/THUMBNAIL/${mail.name}/qortal_avatar?async=true&apiKey=${this.getApiKey()}`
                            routes.showNotification({
                                data: { title: "New Q-Mail", type: "qapp", sound: config.messageAlert, url: "", options: { body: `You have an unread mail from ${mail.name}`, icon: urlPic, badge: urlPic } }
                            })
                        }
                    }
                    this.notifications = notificationsToShow

                    if (this.notifications.length === 0) {
                        this.notificationCount = false
                    } else {
                        this.notificationCount = true
                    }

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

    render() {
        return html`
            <div class="layout">
                ${this.notificationCount ? html`
                    <paper-icon-button style="color: green;" icon="icons:mail" @click=${() => this._toggleNotifications()} title="Q-Mail"></paper-icon-button>
                ` : html`
                    <paper-icon-button icon="icons:mail" @click=${() => {
                       this._openTabQmail()
                    }} title="Q-Mail"></paper-icon-button>
                `}

                ${this.notificationCount ? html`
                    <span class="count">${this.notifications.length}</span>
                ` : ''}

                <div class="popover-panel" ?hidden=${!this.showNotifications}>
                    <div class="notifications-list">
                        ${this.notifications.map(notification => html`
                            <div class="notification-item" @click=${() => {
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
                            }}>
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

    static styles = css`
        .layout {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .count {
          position: absolute;
          top: 2px;
          right: 0px;
          font-size: 12px;
          background-color: red;
          color: white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nocount {
          display: none;
        }

        .popover-panel {
          position: absolute;
          width: 200px;
          padding: 10px;
          background-color: var(--white);
          border: 1px solid var(--black);
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          top: 40px;
          max-height: 350px;
          overflow: auto;
          scrollbar-width: thin;
          scrollbar-color: #6a6c75 #a1a1a1;
        }

        .popover-panel::-webkit-scrollbar {
          width: 11px;
        }

        .popover-panel::-webkit-scrollbar-track {
          background: #a1a1a1;
        }

        .popover-panel::-webkit-scrollbar-thumb {
          background-color: #6a6c75;
          border-radius: 6px;
          border: 3px solid #a1a1a1;
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
        }

        .notification-item {
          padding: 5px;
          border-bottom: 1px solid;
          display: flex;
          justify-content: space-between;
          cursor: pointer;
          transition: 0.2s all;
        }

        .notification-item:hover {
          background: var(--nav-color-hover);
        }

        p {
          font-size: 14px;
          color: var(--black);
          margin: 0px;
          padding: 0px;
        }
    `
}

customElements.define('notification-bell', NotificationBell)
