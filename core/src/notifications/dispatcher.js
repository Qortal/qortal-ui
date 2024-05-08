import {NEW_MESSAGE, NEW_MESSAGE_NOTIFICATION_QAPP, NEW_MESSAGE_NOTIFICATION_QAPP_LOCAL} from './types'
import {newMessage, newMessageNotificationQapp, newMessageNotificationQappLocal} from './notification-actions'

export const dispatcher = function (notificationState) {
	switch (notificationState.type) {
		case NEW_MESSAGE:
			return newMessage(notificationState.data)

		case NEW_MESSAGE_NOTIFICATION_QAPP:
			return newMessageNotificationQapp(notificationState.data)

		case NEW_MESSAGE_NOTIFICATION_QAPP_LOCAL:
			return newMessageNotificationQappLocal(notificationState.data)

		default:
	}
}