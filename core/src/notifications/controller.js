import config from './config'
import { dispatcher } from './dispatcher'
import snackbar from '../functional-components/snackbar.js'
import { NEW_MESSAGE } from './types'

let initial = 0
let _state

const notificationCheck = function () {
    if (window.Notification && Notification.permission === 'granted') {
        // ...
        return true
    } else if (window.Notification && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                dispatcher(_state)
                _state = ''
                return true
            } else {
                initial = initial + 1
                snackbar.add({
                    labelText: 'Notification is disabled, Enable it to recieve notifications.',
                    dismiss: true
                })
            }
        })
    } else {
        if ([1, 3, 5, 7, 9, 11, 13, 15].includes(initial)) {
            snackbar.add({
                labelText: 'Notification is disabled in this browser, Enable it to recieve notifications.',
                dismiss: true
            })
        }

        initial = initial + 1
    }
}

/**
 * @param req
 * @property notificationState = { type: NEW_MESSAGE, data }
 * @property data = { title: 'Qortal Chat', sound: config.messageAlert, options: { body: 'New Message', icon: config.default.icon, badge: config.default.icon }, req }
*/

export const doNewMessage = function (req) {
    const newMessage = () => {
        let data

        if (req.groupId) {
            const title = `${req.groupName}`
            const body = `New Message from ${req.senderName === undefined ? req.sender : req.senderName}`
            data = { title, sound: config.messageAlert, options: { body, icon: config.default.icon, badge: config.default.icon }, req }
        } else {
            const title = `${req.senderName === undefined ? req.sender : req.senderName}`
            const body = 'New Message'
            data = { title, sound: config.messageAlert, options: { body, icon: config.default.icon, badge: config.default.icon }, req }
        }

        const notificationState = { type: NEW_MESSAGE, data: data }

        const canI = notificationCheck()

        if (canI === true) {
            dispatcher(notificationState)
        } else {
            _state = notificationState
        }
    }

    const page = window.top.location.href
    if (!document.hasFocus()) {
        newMessage()
    } else {
        if (page.includes(req.url) === false) {
            newMessage()
        }
    }
}
