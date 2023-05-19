// Core App Actions here...
import { UPDATE_BLOCK_INFO, UPDATE_NODE_STATUS, UPDATE_NODE_INFO, CHAT_HEADS, ACCOUNT_INFO, ADD_AUTO_LOAD_IMAGES_CHAT, REMOVE_AUTO_LOAD_IMAGES_CHAT, ALLOW_QAPP_AUTO_AUTH, REMOVE_QAPP_AUTO_AUTH, SET_CHAT_LAST_SEEN, ADD_CHAT_LAST_SEEN, ALLOW_QAPP_AUTO_LISTS, REMOVE_QAPP_AUTO_LISTS } from '../app-action-types.js'

export const doUpdateBlockInfo = (blockObj) => {
    return (dispatch, getState) => {
        dispatch(updateBlock(blockObj))
    }
}

const updateBlock = (payload) => {
    return {
        type: UPDATE_BLOCK_INFO,
        payload
    }
}

export const doUpdateNodeStatus = (nodeStatusObj) => {
    return (dispatch, getState) => {
        dispatch(updateNodeStatus(nodeStatusObj))
    }
}

const updateNodeStatus = (payload) => {
    return {
        type: UPDATE_NODE_STATUS,
        payload
    }
}

export const doUpdateNodeInfo = (nodeInfoObj) => {
    return (dispatch, getState) => {
        dispatch(updateNodeInfo(nodeInfoObj))
    }
}

const updateNodeInfo = (payload) => {
    return {
        type: UPDATE_NODE_INFO,
        payload
    }
}

export const doSetChatHeads = (chatHeadsObj) => {
    return (dispatch, getState) => {
        dispatch(setChatHeads(chatHeadsObj))
    }
}

const setChatHeads = (payload) => {
    return {
        type: CHAT_HEADS,
        payload
    }
}

export const doUpdateAccountInfo = (appInfoObj) => {
    return (dispatch, getState) => {
        dispatch(updateAccountInfo(appInfoObj))
    }
}

const updateAccountInfo = (payload) => {
    return {
        type: ACCOUNT_INFO,
        payload
    }
}

export const addAutoLoadImageChat = (payload) => {
    return {
        type: ADD_AUTO_LOAD_IMAGES_CHAT,
        payload
    }
}

export const removeAutoLoadImageChat = (payload) => {
    return {
        type: REMOVE_AUTO_LOAD_IMAGES_CHAT,
        payload
    }
}

export const allowQAPPAutoAuth = (payload) => {
    return {
        type: ALLOW_QAPP_AUTO_AUTH,
        payload
    }
}

export const removeQAPPAutoAuth = (payload) => {
    return {
        type: REMOVE_QAPP_AUTO_AUTH,
        payload
    }
}
export const allowQAPPAutoLists = (payload) => {
    return {
        type: ALLOW_QAPP_AUTO_LISTS,
        payload
    }
}

export const removeQAPPAutoLists = (payload) => {
    return {
        type: REMOVE_QAPP_AUTO_LISTS,
        payload
    }
}

export const setChatLastSeen = (payload) => {
    return {
        type: SET_CHAT_LAST_SEEN,
        payload
    }
}
export const addChatLastSeen = (payload) => {
    return {
        type: ADD_CHAT_LAST_SEEN,
        payload
    }
}

