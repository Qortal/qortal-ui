// Loading state, login state, isNavDrawOpen state etc. None of this needs to be saved to localstorage.
import { LOG_IN, LOG_OUT, NETWORK_CONNECTION_STATUS, INIT_WORKERS, ADD_PLUGIN_URL, ADD_PLUGIN, ADD_NEW_PLUGIN_URL, NAVIGATE, SELECT_ADDRESS, ACCOUNT_INFO, CHAT_HEADS, UPDATE_BLOCK_INFO, UPDATE_NODE_STATUS, UPDATE_NODE_INFO, LOAD_NODE_CONFIG, SET_NODE, ADD_NODE, PAGE_URL, COPY_MENU_SWITCH, PASTE_MENU_SWITCH, FRAME_PASTE_MENU_SWITCH } from './app-action-types.js'
import { initWorkersReducer } from './reducers/init-workers.js'
import { loginReducer } from './reducers/login-reducer.js'
import { setNode, addNode } from './reducers/manage-node.js'

const INITIAL_STATE = {
    loggedIn: false,
    drawerOpen: false,
    workers: {
        workers: [],
        ready: false,
        loading: false
    },
    wallet: {
        addresses: [
            {
                address: ''
            }
        ]
    },
    nodeConfig: {
        node: 0,
        knownNodes: [{}],
        version: ''
    },
    plugins: [],
    registeredUrls: [],
    accountInfo: {
        names: [],
        addressInfo: {}
    },
    url: '',
    selectedAddress: {},
    chatHeads: {},
    blockInfo: {},
    nodeInfo: {},
    nodeStatus: {},
    pageUrl: '',
    copyMenuSwitch: false,
    pasteMenuSwitch: false,
    framePasteMenuSwitch: {
        isOpen: false,
        elementId: ''
    }
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case INIT_WORKERS:
            return initWorkersReducer(state, action)
        case LOG_IN:
            return loginReducer(state, action)
        case LOG_OUT:
            return {
                ...state,
                pin: '',
                loggedIn: false,
                loggingIn: false,
                wallet: INITIAL_STATE.wallet
            }
        case ADD_PLUGIN:
            return {
                ...state,
                plugins: [
                    ...state.plugins,
                    action.payload
                ]
            }
        case ADD_PLUGIN_URL:
            return {
                ...state,
                registeredUrls: action.payload
            }
        case ADD_NEW_PLUGIN_URL: // TODO: Will be used in to add new plugins in future...
            return {
                ...state,
                registeredUrls: state.registeredUrls.concat(action.payload)
            }
        case CHAT_HEADS:
            return {
                ...state,
                chatHeads: action.payload
            }
        case UPDATE_BLOCK_INFO:
            return {
                ...state,
                blockInfo: action.payload
            }
        case UPDATE_NODE_STATUS:
            return {
                ...state,
                nodeStatus: action.payload
            }
        case UPDATE_NODE_INFO:
            return {
                ...state,
                nodeInfo: action.payload
            }
        case ACCOUNT_INFO:
            return {
                ...state,
                accountInfo: action.payload
            }
        case LOAD_NODE_CONFIG:
            return {
                ...state,
                nodeConfig: action.payload
            }
        case SET_NODE:
            return setNode(state, action)
        case ADD_NODE:
            return addNode(state, action)
        case PAGE_URL:
            return {
                ...state,
                pageUrl: action.payload
            }
        case NAVIGATE:
            return {
                ...state,
                url: action.url
            }
        case SELECT_ADDRESS:
            return {
                ...state,
                selectedAddress: action.address
            }
        case NETWORK_CONNECTION_STATUS:
            return {
                ...state,
                networkIsConnected: action.payload
            }
        case COPY_MENU_SWITCH:
            return {
                ...state,
                copyMenuSwitch: action.payload
            }
        case PASTE_MENU_SWITCH:
            return {
                ...state,
                pasteMenuSwitch: action.payload
            }
        case FRAME_PASTE_MENU_SWITCH:
            return {
                ...state,
                framePasteMenuSwitch: action.payload
            }
        default:
            return state
    }
}
