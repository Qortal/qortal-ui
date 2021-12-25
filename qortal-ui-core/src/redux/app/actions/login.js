import { LOG_IN, LOG_OUT, SELECT_ADDRESS } from '../app-action-types.js'

export const doSelectAddress = address => {
    return (dispatch, getState) => {
        dispatch(selectAddress(address))
    }
}

const selectAddress = address => {
    return {
        type: SELECT_ADDRESS,
        address
    }
}

export const doLogin = wallet => {
    return (dispatch, getState) => {
        dispatch(login('success', {
            wallet
        }))
    }
}

const login = (status, payload) => {
    return {
        type: LOG_IN,
        status,
        payload
    }
}

export const doLogout = () => {
    // THOUGHTS: Maybe add some checks for ongoing stuff...
    return (dispatch, getState) => {
        dispatch(logout())
    }
}

const logout = () => {
    return {
        type: LOG_OUT
    }
}
