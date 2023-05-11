
import { LOAD_NOTIFICATION_CONFIG, SET_QCHAT_NOTIFICATION_CONFIG } from '../user-action-types.js'

const configUrl = '/getConfig'

export const doLoadNotificationConfig = () => {

    return (dispatch, getState) => {

        fetch(configUrl)
            .then(res => {
                return res.json()
            })
            .then(data => {

                const notifications = {
                    q_chat: {},
                    block: {}
                }
                notifications.q_chat = data.config.user.notifications.q_chat
                notifications.block = data.config.user.notifications.block
                return dispatch(loadNotificationConfig(notifications))
            })
            .catch(err => {
                console.error(err)
            })
    }
}

const loadNotificationConfig = (payload) => {

    return {
        type: LOAD_NOTIFICATION_CONFIG,
        payload
    }
}

/**
 * doSetQChatNotificationConfig action to set QChat Notification
 * @param { Object } qChatNotificationObject - { playSound: boolean, showNotification: boolean }
 */

export const doSetQChatNotificationConfig = (qChatNotificationObject) => {

    return (dispatch, getState) => {

        return dispatch(setQChatNotificationConfig(qChatNotificationObject))
    }
}

const setQChatNotificationConfig = (payload) => {

    return {
        type: SET_QCHAT_NOTIFICATION_CONFIG,
        payload
    }
}
