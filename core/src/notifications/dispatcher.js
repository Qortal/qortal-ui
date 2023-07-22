import { NEW_MESSAGE, NEW_MESSAGE_NOTIFICATION_QAPP } from './types'
import { newMessage, newMessageNotificationQapp } from './notification-actions'

export const dispatcher = function (notificationState) {

    switch (notificationState.type) {
        case NEW_MESSAGE:
            return newMessage(notificationState.data)
        case NEW_MESSAGE_NOTIFICATION_QAPP:
            return newMessageNotificationQapp(notificationState.data)
        default:
    }
}
