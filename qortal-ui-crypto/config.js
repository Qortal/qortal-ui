import { store } from './api.js'

let config = false
let loaded = false
const configWatchers = []
const waitingForConfig = []

const subscribeToStore = () => {
    if (!store) return setTimeout(() => subscribeToStore(), 50) // 0.05s

    store.subscribe(() => {
        const cA = store.getState().app
        const c = store.getState().config
        if (!c.loaded) return
        if (!loaded) waitingForConfig.forEach(r => r(cA))
        configWatchers.forEach(fn => fn(cA))
        config = cA
    })
}

subscribeToStore()

export function getConfig() {
    return config
}

export function watchConfig(fn) {
    // config ? fn(config) : void 0
    fn(config)
    configWatchers.push(fn)
}

export function waitForConfig() {
    return new Promise((resolve, reject) => {
        if (config) return resolve(config)
        waitingForConfig.push(resolve)
    })
}