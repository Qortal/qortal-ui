// Must be saved to localstorage. Will storage things such as saved addresses and themes (day/night mode) etc.
// Initial state needs to be loaded from either the getConfig url or localstorage...NOT set via this
import { loadStateFromLocalStorage } from '../../localStorageHelpers'
import { LOAD_CONFIG_FROM_API } from './config-actions.js'
import { loadConfigFromAPI } from './reducers/load-config-from-api.js'

const DEFAULT_INITIAL_STATE = {
    styles: {
        breakpoints: {},
        theme: {
            color: 'green',
            colors: {}
        }
    },
    coin: {
        name: ''
    },
    user: {
        language: 'english',
        theme: 'light',
        server: {},
        node: 0,
        knownNodes: [{}]
    },
    savedWallets: {},
    loaded: false
}

export default (state = loadStateFromLocalStorage('config') || DEFAULT_INITIAL_STATE, action) => {
    switch (action.type) {
        case LOAD_CONFIG_FROM_API:
            return loadConfigFromAPI(state, action)
        default:
            return state
    }
}
