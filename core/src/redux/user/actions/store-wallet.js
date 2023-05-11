import { STORE_WALLET, REMOVE_WALLET, UPDATE_STORED_WALLET_NAME } from '../user-action-types.js'

export const doStoreWallet = (wallet, password, name, statusUpdateFn = () => { }) => {
    return (dispatch, getState) => {

        return wallet.generateSaveWalletData(password, getState().config.crypto.kdfThreads, statusUpdateFn).then(data => {

            dispatch(storeWallet({
                ...data,
                name
            }))
        })
    }
}

const storeWallet = payload => {
    return {
        type: STORE_WALLET,
        payload
    }
}

export const doRemoveWallet = (address) => {
    return (dispatch, getState) => {
        return dispatch(removeWallet({
            address
        }))
    }
}

const removeWallet = payload => {
    return {
        type: REMOVE_WALLET,
        payload
    }
}
export const doUpdateStoredWalletName = (address, name) => {
    return (dispatch, getState) => {
        return updateStoredWalletName({
            address, name
        })
    }
}

const updateStoredWalletName = payload => {
    return {
        type: UPDATE_STORED_WALLET_NAME,
        payload
    }
}
