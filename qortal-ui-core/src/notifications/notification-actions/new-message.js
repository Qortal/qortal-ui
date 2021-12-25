import { store } from '../../store.js'
import { doPageUrl } from '../../redux/app/app-actions.js'

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
                const pageUrl = `/app/q-chat/${data.req.url}`
                store.dispatch(doPageUrl(pageUrl))
            }
        } else {

            const notify = new Notification(data.title, data.options)

            notify.onclick = (e) => {
                const pageUrl = `/app/q-chat/${data.req.url}`
                store.dispatch(doPageUrl(pageUrl))
            }
        }
    }

}

const playSound = (soundUrl) => {

    return new Audio(soundUrl)
}
