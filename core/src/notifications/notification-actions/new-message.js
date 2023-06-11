import { store } from '../../store.js'
import { doPageUrl, setNewTab } from '../../redux/app/app-actions.js'
import isElectron from 'is-electron'

export const newMessage = (data) => {
    const alert = playSound(data.sound)

    // Should I show notification ?
    if (store.getState().user.notifications.q_chat.showNotification) {

        // Yes, I can but should I play sound ?
        if (store.getState().user.notifications.q_chat.playSound) {

            const notify = new Notification(data.title, data.options)

            notify.onshow = (e) => {
                alert.play()
            }

            notify.onclick = (e) => {
                const pageUrl = `/app/q-chat/?chat=${data.req.url}`
                store.dispatch(doPageUrl(pageUrl))
            }
        } else {

            const notify = new Notification(data.title, data.options)

            notify.onclick = (e) => {
                const pageUrl = `/app/q-chat/?chat=${data.req.url}`
                store.dispatch(doPageUrl(pageUrl))
            }
        }
    }

}
export const newMessageNotificationQapp = (data) => {

    const alert = playSound(data.sound)

    // Should I show notification ?
    if (store.getState().user.notifications.q_chat.showNotification) {

        // Yes, I can but should I play sound ?
        if (store.getState().user.notifications.q_chat.playSound) {

            const notify = new Notification(data.title, data.options)

            notify.onshow = (e) => {
                alert.play()
            }

            notify.onclick = (e) => {
                const query = `?service=APP&name=Q-Mail`

                store.dispatch(setNewTab({
                    url: `qdn/browser/index.html${query}`,
                    id: 'q-mail-notification',
                    myPlugObj: {
                        "url": "qapps",
                        "domain": "core",
                        "page": `qdn/browser/index.html${query}`,
                        "title": "Q-Mail",
                        "icon": "vaadin:desktop",
                        "menus": [],
                        "parent": false
                    }
                }))
                if (!isElectron()) {
                    window.focus();
                } else {
                    window.electronAPI.focusApp()
                }

            }
        } else {

            const notify = new Notification(data.title, data.options)

            notify.onclick = (e) => {
                const query = `?service=APP&name=Q-Mail`

                store.dispatch(setNewTab({
                    url: `qdn/browser/index.html${query}`,
                    id: 'q-mail-notification',
                    myPlugObj: {
                        "url": "qapps",
                        "domain": "core",
                        "page": `qdn/browser/index.html${query}`,
                        "title": "Q-Mail",
                        "icon": "vaadin:desktop",
                        "menus": [],
                        "parent": false
                    }
                }))
                if (!isElectron()) {
                    window.focus();
                } else {
                    window.electronAPI.focusApp()
                }
            }
        }
    }

}

const playSound = (soundUrl) => {
    return new Audio(soundUrl)
}
