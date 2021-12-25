import { UPDATE_ACCOUNT_INFO } from '../user-action-types'

export const doUpdateAccountInfo = (accInfo) => {
    return (dispatch, getState) => {
        return dispatch(updateAccountInfo(accInfo))
    }
}

export const updateAccountInfo = (payload) => {
    return {
        type: UPDATE_ACCOUNT_INFO,
        payload
    }
}
