import { NAVIGATE, NETWORK_CONNECTION_STATUS } from './app-action-types.js'

export * from './actions/login.js'
export * from './actions/init-worker.js'
export * from './actions/plugins.js'
export * from './actions/app-core.js'
export * from './actions/node-config.js'

export const doNavigate = loca => {
    return (dispatch, getState) => {
        dispatch(navigate(loca))
    }
}

const navigate = loca => {

    return {
        type: NAVIGATE,
        url: loca.pathname
    }
}

export const updateNetworkConnectionStatus = status => {

    return {
        type: NETWORK_CONNECTION_STATUS,
        payload: status
    }
}
