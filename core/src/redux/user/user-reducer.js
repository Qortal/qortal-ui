import { loadStateFromLocalStorage } from '../../localStorageHelpers'
import { STORE_WALLET, REMOVE_WALLET, CLAIM_AIRDROP, UPDATE_ACCOUNT_INFO, LOAD_NOTIFICATION_CONFIG, SET_QCHAT_NOTIFICATION_CONFIG } from './user-action-types.js'

const DEFAULT_INITIAL_STATE = {
    storedWallets: {},
    hasClaimedAirdrop: false,
    accountInfo: {
        // nameStatus: ''
    },
    notifications: {
        q_chat: {},
        block: {}
    },
    loaded: false
}

export default (state = loadStateFromLocalStorage('user') || DEFAULT_INITIAL_STATE, action) => {
    switch (action.type) {
        case STORE_WALLET:
            return {
                ...state,
                storedWallets: {
                    ...(state.storedWallets || {}),
                    [action.payload.address0]: action.payload
                }
            }
        case REMOVE_WALLET:
            delete state.storedWallets[action.payload.address]
            return {
                ...state,
                storedWallets:state.storedWallets
            }
        case CLAIM_AIRDROP:
            return {
                ...state,
                hasClaimedAirdrop: true
            }
        case UPDATE_ACCOUNT_INFO: {
            return {
                ...state,
                accountInfo: {
                    ...state.accountInfo,
                    ...action.payload
                }
            }
        }
        case LOAD_NOTIFICATION_CONFIG:
            return {
                ...state,
                notifications: action.payload,
                loaded: true
            }
        case SET_QCHAT_NOTIFICATION_CONFIG:
            return {
                ...state,
                notifications: {
                    ...state.notifications,
                    q_chat: action.payload
                }
            }
        default:
            return state
    }
}
