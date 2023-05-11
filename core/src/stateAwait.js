/**
 * Simple helper function so that I can do `await stateAwait(state => state.something === true)` or `await stateAwait(state => state.name === 'myName')`
 */
import { store } from './store.js'

let subscriptions = []
store.subscribe(() => {
    const state = store.getState()
    subscriptions = subscriptions.filter(fn => fn(state))
})
export const stateAwait = fn => {
    return new Promise((resolve, reject) => {
        // Check immediately...then if not true store it
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
