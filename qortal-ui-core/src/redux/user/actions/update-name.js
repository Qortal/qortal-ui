import { updateAccountInfo } from './update-account-info.js'
// import { doUpdateStoredWalletName } from '../user-actions.js'
import { doUpdateStoredWalletName } from './store-wallet.js'

const GET_NAME_URL = 'names/address/'
const CHECK_NAME_INTERVAL = 1000 * 3 // Every 3 seconds

export const UPDATE_NAME_STATUSES = {
    LOADING: 'LOADING',
    LOADED: 'LOADED',
    DOES_NOT_EXIST: 'DOES_NOT_EXIST',
    WAITING_FOR_CONFIRM: 'WAITING_FOR_CONFIRM'
}

export const doUpdateAccountName = (address, expectedName, awaitingConfirm) => {
    return (dispatch, getState) => {
        dispatch(updateAccountInfo({
            nameStatus: UPDATE_NAME_STATUSES.LOADING,
            name: expectedName
        }))
        const state = getState()
        const config = state.config
        const node = config.coin.node.api
        // console.log(config.constants)
        // const url = config.constants.proxyURL + node.url + node.tail + GET_NAME_URL + address
        const url = node.url + node.tail + GET_NAME_URL + address
        return fetch(url)
            .then(res => res.json())
            .then(names => {
                if (names.length > 0) {
                    const name = names[0]
                    dispatch(updateAccountInfo({
                        nameStatus: UPDATE_NAME_STATUSES.LOADED,
                        name
                    }))
                    // ...
                    if (state.user.storedWallets[address]) dispatch(doUpdateStoredWalletName(address, name))
                } else {
                    dispatch(updateAccountInfo({
                        nameStatus: awaitingConfirm ? UPDATE_NAME_STATUSES.DOES_NOT_EXIST : UPDATE_NAME_STATUSES.WAITING_FOR_CONFIRM
                    }))
                    if (awaitingConfirm) setTimeout(() => dispatch(doUpdateAccountName(address, expectedName, awaitingConfirm)), CHECK_NAME_INTERVAL)
                }
            })
    }
}
