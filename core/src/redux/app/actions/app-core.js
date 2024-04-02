// Core App Actions here...
import {
	ACCOUNT_INFO,
	ADD_AUTO_LOAD_IMAGES_CHAT,
	ADD_CHAT_LAST_SEEN,
	ADD_TAB_INFO,
	ALLOW_QAPP_AUTO_AUTH,
	ALLOW_QAPP_AUTO_LISTS,
	CHAT_HEADS,
	IS_OPEN_DEV_DIALOG,
	REMOVE_AUTO_LOAD_IMAGES_CHAT,
	REMOVE_QAPP_AUTO_AUTH,
	REMOVE_QAPP_AUTO_LISTS,
	SET_CHAT_LAST_SEEN,
	SET_COIN_BALANCES,
	SET_NEW_NOTIFICATION,
	SET_NEW_TAB,
	SET_SIDE_EFFECT,
	SET_TAB_NOTIFICATIONS,
	UPDATE_BLOCK_INFO,
	UPDATE_NODE_INFO,
	UPDATE_NODE_STATUS,
	SET_PROFILE_DATA,
	ALLOW_QAPP_FRIENDS_LIST,
	REMOVE_QAPP_FRIENDS_LIST,
	ALLOW_SHOW_SYNC_INDICATOR,
	REMOVE_SHOW_SYNC_INDICATOR
} from '../app-action-types.js'

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

export const allowQAPPAutoFriendsList = (payload) => {
    return {
        type: ALLOW_QAPP_FRIENDS_LIST,
        payload
    }
}

export const removeQAPPAutoFriendsList = (payload) => {
    return {
        type: REMOVE_QAPP_FRIENDS_LIST,
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

export const setNewTab = (payload) => {
    return {
        type: SET_NEW_TAB,
        payload
    }
}

export const setNewNotification = (payload) => {
    return {
        type: SET_NEW_NOTIFICATION,
        payload
    }
}

export const setIsOpenDevDialog = (payload) => {
    return {
        type: IS_OPEN_DEV_DIALOG,
        payload
    }
}

export const addTabInfo = (payload) => {
    return {
        type: ADD_TAB_INFO,
        payload
    }
}

export const setTabNotifications = (payload) => {
    return {
        type: SET_TAB_NOTIFICATIONS,
        payload
    }
}

export const setSideEffectAction = (payload)=> {
    return {
        type: SET_SIDE_EFFECT,
        payload
    }
}

export const setProfileData = (payload) => {
    return {
        type: SET_PROFILE_DATA,
        payload
    }
}

export const setCoinBalances = (payload) => {
    return {
        type: SET_COIN_BALANCES,
        payload
    }
}

export const allowShowSyncIndicator = (payload) => {
    return {
        type: ALLOW_SHOW_SYNC_INDICATOR,
        payload
    }
}

export const removeShowSyncIndicator = (payload) => {
    return {
        type: REMOVE_SHOW_SYNC_INDICATOR,
        payload
    }
}
