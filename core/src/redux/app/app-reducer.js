// Loading state, login state, isNavDrawOpen state etc. None of this needs to be saved to localstorage.
import { loadStateFromLocalStorage, saveStateToLocalStorage } from '../../localStorageHelpers.js'
import { LOG_IN, LOG_OUT, NETWORK_CONNECTION_STATUS, INIT_WORKERS, ADD_PLUGIN_URL, ADD_PLUGIN, ADD_NEW_PLUGIN_URL, NAVIGATE, SELECT_ADDRESS, ACCOUNT_INFO, CHAT_HEADS, UPDATE_BLOCK_INFO, UPDATE_NODE_STATUS, UPDATE_NODE_INFO, LOAD_NODE_CONFIG, SET_NODE, ADD_NODE, PAGE_URL, ADD_AUTO_LOAD_IMAGES_CHAT, REMOVE_AUTO_LOAD_IMAGES_CHAT, ALLOW_QAPP_AUTO_AUTH, REMOVE_QAPP_AUTO_AUTH, SET_CHAT_LAST_SEEN, ADD_CHAT_LAST_SEEN, ALLOW_QAPP_AUTO_LISTS, REMOVE_QAPP_AUTO_LISTS, SET_NEW_TAB, ADD_TAB_INFO, SET_TAB_NOTIFICATIONS } from './app-action-types.js'
import { initWorkersReducer } from './reducers/init-workers.js'
import { loginReducer } from './reducers/login-reducer.js'
import { setNode, addNode } from './reducers/manage-node.js'
import localForage from "localforage";
const chatLastSeen = localForage.createInstance({
    name: "chat-last-seen",
});


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
    autoLoadImageChats: loadStateFromLocalStorage('autoLoadImageChats') || [],
    qAPPAutoAuth: loadStateFromLocalStorage('qAPPAutoAuth') || false,
    qAPPAutoLists: loadStateFromLocalStorage('qAPPAutoLists') || false,
    chatLastSeen: [],
    newTab: null,
    tabInfo: {}
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
        case ADD_AUTO_LOAD_IMAGES_CHAT: {
            const findChat = state.autoLoadImageChats.findIndex((chat) => chat === action.payload)

            if (findChat !== -1) return state
            const updatedState = [...state.autoLoadImageChats, action.payload]

            saveStateToLocalStorage('autoLoadImageChats', updatedState)
            return {
                ...state,
                autoLoadImageChats: updatedState
            }
        }

        case REMOVE_AUTO_LOAD_IMAGES_CHAT: {
            const updatedState = state.autoLoadImageChats.filter((chat) => chat !== action.payload)
            saveStateToLocalStorage('autoLoadImageChats', updatedState)
            return {
                ...state,
                autoLoadImageChats: updatedState
            }
        }

        case ALLOW_QAPP_AUTO_AUTH: {
            saveStateToLocalStorage("qAPPAutoAuth", true)
            return {
                ...state,
                qAPPAutoAuth: action.payload
            }
        }

        case REMOVE_QAPP_AUTO_AUTH: {
            saveStateToLocalStorage("qAPPAutoAuth", false)
            return {
                ...state,
                qAPPAutoAuth: action.payload
            }
        }
        case ALLOW_QAPP_AUTO_LISTS: {
            saveStateToLocalStorage("qAPPAutoLists", true)
            return {
                ...state,
                qAPPAutoLists: action.payload
            }
        }

        case REMOVE_QAPP_AUTO_LISTS: {
            saveStateToLocalStorage("qAPPAutoLists", false)
            return {
                ...state,
                qAPPAutoLists: action.payload
            }
        }

        case SET_CHAT_LAST_SEEN: {
            return {
                ...state,
                chatLastSeen: action.payload
            }
        }
        case ADD_CHAT_LAST_SEEN: {
            const chatId = action.payload.key
            const timestamp = action.payload.timestamp
            if (!chatId || !timestamp) return state
            let newChatLastSeen = [...state.chatLastSeen]
            const findChatIndex = state.chatLastSeen.findIndex((chat) => chat.key === chatId)
            if (findChatIndex !== -1) {

                newChatLastSeen[findChatIndex] = {
                    key: chatId,
                    timestamp,
                }
            }
            if (findChatIndex === -1) {

                newChatLastSeen = [...newChatLastSeen, {
                    key: chatId,
                    timestamp,
                }]
            }
            chatLastSeen.setItem(chatId, timestamp)
            return {
                ...state,
                chatLastSeen: newChatLastSeen
            }
        }

        case SET_NEW_TAB: {
            return {
                ...state,
                newTab: action.payload
            }
        }
        case ADD_TAB_INFO: {
            const newTabInfo = action.payload
            if (state.tabInfo[newTabInfo.id] && state.tabInfo[newTabInfo.id].name && newTabInfo.name === state.tabInfo[newTabInfo.id].name) break
            return {
                ...state,
                tabInfo: {
                    ...state.tabInfo,
                    [newTabInfo.id]: {
                        ...newTabInfo,
                        count: 0
                    }
                }
            }
        }
        case SET_TAB_NOTIFICATIONS: {
            const count = action.payload.count
            const name = action.payload.name
            const newTabInfo = {}
            Object.keys(state.tabInfo).forEach((key) => {
                const tab = state.tabInfo[key]
                if (tab.name == name) {
                    newTabInfo[key] = {
                        ...tab,
                        count
                    }
                } else {
                    newTabInfo[key] = tab
                }
            })
            return {
                ...state,
                tabInfo: newTabInfo
            }
        }

        default:
            return state
    }
}
