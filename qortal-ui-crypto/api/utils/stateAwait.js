import { store } from '../../api.js'

let subscriptions = []

// Have to wait with init because something import stateAwait before the store gets initialized
let initialized = false
const init = () => {
    initialized = true
    store.subscribe(() => {
        const state = store.getState()

        subscriptions = subscriptions.filter(fn => fn(state))
    })
}

export const stateAwait = fn => {
    return new Promise((resolve, reject) => {
        // Check immediately...then if not true store it
        if (!initialized) {
            init()
        }
        if (fn(store.getState())) resolve()
        subscriptions.push(state => {
            if (fn(state)) {
                resolve()
                return true
            }
            return false
        })
    })
}
