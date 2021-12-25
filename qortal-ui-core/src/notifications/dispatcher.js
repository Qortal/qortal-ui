import { NEW_MESSAGE } from './types'
import { newMessage } from './notification-actions'

export const dispatcher = function (notificationState) {
    switch (notificationState.type) {
        case NEW_MESSAGE:
            return newMessage(notificationState.data)
        default:
    }
}
